import {
  CYCLE_DEGREES,
  CYLINDER_COUNT,
  FIRING_ORDER,
  P_ATMOSPHERE,
} from './constants';
import { combustionEfficiency, combustionStability, combustionStartDeg } from './combustion';
import { deriveGeometry } from './geometry';
import {
  cylinderTorqueNm,
  computeCylinderThermo,
  heatFractions,
  idealOttoEfficiency,
  trappedAirMassKg,
} from './thermodynamics';
import { pistonPositionFromTdcM, pistonVelocityMps } from './kinematics';
import { computeIntake, computeMixture, heatPerCycleJ } from './intake';
import { computeEmissions } from './emissions';
import { initialCooling, stepCooling } from './cooling';
import { initialLubrication, stepLubrication } from './lubrication';
import { initialTurbo, stepTurbo } from './turbo';
import { localCycleAngleDeg, phaseFromLocalAngle } from './phasing';
import {
  computeValveState,
  DEFAULT_VALVE_TIMING,
  IDEAL_VALVE_TIMING,
  type ValveTiming,
} from './valveTrain';
import {
  accumulateFaultModifiers,
  type FaultModifiers,
} from './faults/faultModifiers';
import type {
  CombustionQuality,
  CoolingState,
  CylinderState,
  EngineConfiguration,
  IgnitionState,
  LubricationState,
  PerformanceState,
  SimulationClock,
  TelemetryFrame,
  TurboState,
} from './types';
import {
  celsiusToKelvin,
  clamp,
  degToRad,
  mapRange,
  normalizeCycleAngleDeg,
  radToDeg,
  rpmToRadPerSec,
} from './units';
import { buildSensors, buildActuators, buildEvents } from './telemetry';

export const DEFAULT_CONFIG: EngineConfiguration = {
  geometry: {
    boreM: 0.077,
    strokeM: 0.0858,
    conrodM: 0.133,
    compressionRatio: 10.5,
    cylinderCount: CYLINDER_COUNT,
  },
  fuel: 'gasoline',
  rpm: 2500,
  throttle: 0.35,
  targetLambda: 1.0,
  ignitionAdvanceDeg: 18,
  ambientTempK: celsiusToKelvin(20),
  gamma: 1.33,
  combustionDurationDeg: 55,
  volumetricEfficiencyBase: 0.85,
  frictionFactor: 1.0,
  turboEnabled: false,
  boostBar: 0,
};

export interface SlowState {
  cooling: CoolingState;
  lubrication: LubricationState;
  turbo: TurboState;
}

/**
 * Deterministic Otto-cycle simulation engine. Fast quantities (piston motion,
 * cylinder pressure) are computed instantaneously from the crank angle; slow
 * thermal states are integrated over time. The same computed frame feeds the
 * 3D scene, charts, panels and alerts.
 */
export class SimulationEngine {
  config: EngineConfiguration;
  faultIds: string[];
  clock: SimulationClock;
  slow: SlowState;
  selectedCylinderIndex = 0;
  beginnerValveMode = true;

  constructor(config: EngineConfiguration = DEFAULT_CONFIG) {
    this.config = structuredClone(config);
    this.faultIds = [];
    this.clock = { crankAngleDeg: 0, timeS: 0, running: false, speedScale: 1 };
    this.slow = {
      cooling: initialCooling(config.ambientTempK),
      lubrication: initialLubrication(config.ambientTempK),
      turbo: initialTurbo(),
    };
  }

  setConfig(partial: Partial<EngineConfiguration>): void {
    this.config = { ...this.config, ...partial };
  }

  setFaults(faultIds: string[]): void {
    this.faultIds = [...faultIds];
  }

  reset(): void {
    this.clock.crankAngleDeg = 0;
    this.clock.timeS = 0;
    this.slow = {
      cooling: initialCooling(this.config.ambientTempK),
      lubrication: initialLubrication(this.config.ambientTempK),
      turbo: initialTurbo(),
    };
  }

  get valveTiming(): ValveTiming {
    return this.beginnerValveMode ? IDEAL_VALVE_TIMING : DEFAULT_VALVE_TIMING;
  }

  /** Advance the simulation by real elapsed seconds and return a telemetry frame. */
  step(realDtS: number): TelemetryFrame {
    const simDt = clamp(realDtS, 0, 0.1) * this.clock.speedScale;
    const omega = rpmToRadPerSec(this.config.rpm);

    if (this.clock.running) {
      this.clock.crankAngleDeg = normalizeCycleAngleDeg(
        this.clock.crankAngleDeg + radToDeg(omega * simDt),
      );
      this.clock.timeS += simDt;

      // Integrate slow thermal states using cycle-average heat load.
      const mods = accumulateFaultModifiers(this.faultIds, this.config);
      const load = this.cycleLoad(mods);
      this.slow.cooling = stepCooling(
        this.slow.cooling,
        this.config,
        mods,
        load.combustionHeatW,
        this.config.ambientTempK,
        simDt,
      );
      this.slow.lubrication = stepLubrication(
        this.slow.lubrication,
        this.config,
        mods,
        this.slow.cooling.headTempK,
        simDt,
      );
      this.slow.turbo = stepTurbo(
        this.slow.turbo,
        this.config,
        mods,
        load.exhaustTempK,
        simDt,
      );
    }

    return this.computeFrame();
  }

  /** Cycle-averaged combustion heat power and representative exhaust temp. */
  private cycleLoad(mods: FaultModifiers): { combustionHeatW: number; exhaustTempK: number } {
    const derived = deriveGeometry(this.config.geometry);
    const intake = computeIntake(this.config, mods, this.slow.turbo);
    const intakeTempK = this.intakeChargeTempK();
    const airMass = trappedAirMassKg(
      derived.displacementCylinderM3,
      intake.volumetricEfficiency,
      intake.manifoldPressurePa,
      intakeTempK,
    );
    const mixture = computeMixture(this.config, mods, airMass);
    const combEff = combustionEfficiency(mixture.lambda);
    const heatCycleJ = heatPerCycleJ(this.config.fuel, airMass, mixture.afr, combEff);
    const cyclesPerSecond = this.config.rpm / 120;
    const combustionHeatW = heatCycleJ * cyclesPerSecond * this.config.geometry.cylinderCount;
    const exhaustTempK = celsiusToKelvin(500) + mapRange(combustionHeatW, 0, 90000, 0, 450);
    return { combustionHeatW, exhaustTempK };
  }

  private intakeChargeTempK(): number {
    // Intake charge warmed by ambient + engine heat, cooled by intercooler if turbo.
    const base = this.config.ambientTempK + 10;
    if (this.config.turboEnabled && this.slow.turbo.boostPa > 0) {
      return base + 25; // post-intercooler approximation
    }
    return base;
  }

  /** Build a full telemetry frame at the current state (used live and while scrubbing). */
  computeFrame(): TelemetryFrame {
    const config = this.config;
    const derived = deriveGeometry(config.geometry);
    const mods = accumulateFaultModifiers(this.faultIds, config);
    const omega = rpmToRadPerSec(config.rpm);
    const intakeTempK = this.intakeChargeTempK();

    const intake = computeIntake(config, mods, this.slow.turbo);
    const airMass = trappedAirMassKg(
      derived.displacementCylinderM3,
      intake.volumetricEfficiency,
      intake.manifoldPressurePa,
      intakeTempK,
    );
    intake.airMassPerCycleKg = airMass;
    const mixture = computeMixture(config, mods, airMass);
    const combEff = combustionEfficiency(mixture.lambda);
    const stability = combustionStability(mixture.lambda);
    const heatCycleJ = heatPerCycleJ(config.fuel, airMass, mixture.afr, combEff);

    // Preliminary knock estimate (with requested advance) for ECU retard.
    const requestedAdvance = config.ignitionAdvanceDeg + mods.ignitionAdvanceAddDeg;
    const prelimKnock = this.knockRisk(config, mods, requestedAdvance, this.slow.cooling, intakeTempK);
    const knockRetard = prelimKnock > 0.6 ? (prelimKnock - 0.6) * 22 : 0;
    const effectiveAdvance = clamp(requestedAdvance - knockRetard, -10, 50);

    // Build cylinder states at the current angle.
    const cylinders: CylinderState[] = [];
    let totalTorque = 0;
    for (let i = 0; i < config.geometry.cylinderCount; i++) {
      const cylinderNumber = i + 1;
      const localAngle = localCycleAngleDeg(this.clock.crankAngleDeg, cylinderNumber);
      const misfire =
        mods.misfireForceCylinders.includes(cylinderNumber) || stability < 0.35;
      const sparkWindow = combustionStartDeg(effectiveAdvance);
      const thermo = computeCylinderThermo({
        localAngleDeg: localAngle,
        derived,
        gamma: config.gamma,
        manifoldPressurePa: intake.manifoldPressurePa,
        intakeTempK,
        exhaustBackpressurePa: intake.exhaustBackpressurePa,
        ignitionAdvanceDeg: effectiveAdvance,
        combustionDurationDeg: config.combustionDurationDeg * mods.combustionDurationMul,
        chargeMassKg: airMass,
        releasedHeatJ: misfire ? 0 : heatCycleJ,
        sparkEnabled: !misfire,
      });
      const mechRad = degToRad(localAngle % 360);
      const positionM = pistonPositionFromTdcM(mechRad, derived.crankRadiusM, config.geometry.conrodM);
      const velocityMps = pistonVelocityMps(mechRad, omega, derived.crankRadiusM, config.geometry.conrodM);
      const torque = cylinderTorqueNm(thermo.pressurePa, thermo.dVolumeDTheta);
      totalTorque += torque;

      const valves = computeValveState(localAngle, this.valveTiming, 1);
      // Valve timing fault shifts valve phase.
      const faultedValves =
        mods.valveTimingErrorDeg !== 0
          ? computeValveState(localAngle + mods.valveTimingErrorDeg, this.valveTiming, 1)
          : valves;

      cylinders.push({
        index: i,
        cylinderNumber,
        localAngleDeg: localAngle,
        phase: phaseFromLocalAngle(localAngle),
        pistonPositionM: positionM,
        pistonVelocityMps: velocityMps,
        volumeM3: thermo.volumeM3,
        pressurePa: thermo.pressurePa,
        temperatureK: thermo.temperatureK,
        valves: faultedValves,
        combustion: {
          spark: Math.abs(normalizeCycleAngleDeg(localAngle - sparkWindow)) < 2 && !misfire,
          burnFraction: thermo.burnFraction,
          burning: thermo.burnFraction > 0.001 && thermo.burnFraction < 0.999,
        },
        torqueNm: torque,
      });
    }

    // Cycle averages for mean torque, work, IMEP, peaks.
    const averages = this.cycleAverages(config, mods, derived, intake, intakeTempK, heatCycleJ, effectiveAdvance);

    const misfireIntensity = clamp(
      (1 - stability) + (mods.misfireForceCylinders.length / config.geometry.cylinderCount),
      0,
      1,
    );

    const combustionQuality: CombustionQuality = {
      knockRisk: this.knockRisk(config, mods, effectiveAdvance, this.slow.cooling, intakeTempK),
      preIgnitionRisk: this.preIgnitionRisk(config, mods, this.slow.cooling),
      peakPressurePa: averages.peakPressurePa,
      peakGasTempK: averages.peakGasTempK,
    };

    const ignition: IgnitionState = {
      advanceDeg: effectiveAdvance,
      requestedAdvanceDeg: requestedAdvance,
      knockRetardDeg: knockRetard,
      misfireIntensity,
    };

    const performance = this.performance(config, mods, derived, averages, omega, combEff);
    performance.torqueInstantNm = totalTorque;

    const emissions = computeEmissions(mixture.lambda, averages.peakGasTempK, misfireIntensity);

    const frame: TelemetryFrame = {
      clock: { ...this.clock },
      config: structuredClone(config),
      derived,
      cylinders,
      selectedCylinderIndex: this.selectedCylinderIndex,
      cooling: this.slow.cooling,
      lubrication: this.slow.lubrication,
      intakeExhaust: intake,
      ignition,
      turbo: this.slow.turbo,
      mixture,
      performance,
      combustionQuality,
      emissions,
      sensors: [],
      actuators: [],
      events: [],
      activeFaultIds: [...this.faultIds],
    };
    frame.sensors = buildSensors(frame);
    frame.actuators = buildActuators(frame);
    frame.events = buildEvents(frame);
    return frame;
  }

  private cycleAverages(
    config: EngineConfiguration,
    mods: FaultModifiers,
    derived: ReturnType<typeof deriveGeometry>,
    intake: ReturnType<typeof computeIntake>,
    intakeTempK: number,
    heatCycleJ: number,
    advance: number,
  ): {
    meanTorqueNm: number;
    indicatedWorkJ: number;
    imepPa: number;
    peakPressurePa: number;
    peakGasTempK: number;
  } {
    const samples = 120;
    let torqueSum = 0;
    let workSum = 0;
    let peakP = 0;
    let peakT = 0;
    const stepDeg = CYCLE_DEGREES / samples;
    for (let s = 0; s < samples; s++) {
      const global = s * stepDeg;
      let totalTorqueAtAngle = 0;
      for (const cylinderNumber of FIRING_ORDER) {
        const localAngle = localCycleAngleDeg(global, cylinderNumber);
        const thermo = computeCylinderThermo({
          localAngleDeg: localAngle,
          derived,
          gamma: config.gamma,
          manifoldPressurePa: intake.manifoldPressurePa,
          intakeTempK,
          exhaustBackpressurePa: intake.exhaustBackpressurePa,
          ignitionAdvanceDeg: advance,
          combustionDurationDeg: config.combustionDurationDeg * mods.combustionDurationMul,
          chargeMassKg: intake.airMassPerCycleKg,
          releasedHeatJ: heatCycleJ,
          sparkEnabled: true,
        });
        const torque = cylinderTorqueNm(thermo.pressurePa, thermo.dVolumeDTheta);
        totalTorqueAtAngle += torque;
        if (thermo.pressurePa > peakP) peakP = thermo.pressurePa;
        if (thermo.temperatureK > peakT) peakT = thermo.temperatureK;
        // Indicated work for one cylinder: integral of p dV over its cycle.
        workSum += (thermo.pressurePa - P_ATMOSPHERE) * thermo.dVolumeDTheta * degToRad(stepDeg);
      }
      torqueSum += totalTorqueAtAngle;
    }
    const meanTorqueRaw = torqueSum / samples;
    // Subtract simplified friction torque.
    const frictionTorque =
      mapRange(config.rpm, 700, 6000, 3, 22) * config.frictionFactor * mods.frictionMul;
    const meanTorqueNm = Math.max(meanTorqueRaw - frictionTorque, -50);
    const indicatedWorkJ = workSum;
    const imepPa = indicatedWorkJ / (derived.displacementTotalM3 || 1e-9);
    return {
      meanTorqueNm,
      indicatedWorkJ,
      imepPa,
      peakPressurePa: peakP,
      peakGasTempK: peakT,
    };
  }

  private performance(
    config: EngineConfiguration,
    mods: FaultModifiers,
    _derived: ReturnType<typeof deriveGeometry>,
    averages: ReturnType<SimulationEngine['cycleAverages']>,
    omega: number,
    combEff: number,
  ): PerformanceState {
    const etaIdeal = idealOttoEfficiency(config.geometry.compressionRatio, config.gamma);
    const powerW = Math.max(averages.meanTorqueNm * omega, 0);
    // Estimated real efficiency: ideal scaled by combustion, mechanical, pumping losses.
    const mechEff = clamp(1 - mapRange(config.rpm, 700, 6000, 0.06, 0.16) * mods.frictionMul, 0.7, 0.95);
    const etaEstimated = clamp(etaIdeal * combEff * mechEff * 0.82, 0.05, 0.42);

    const energyBalance = heatFractions(etaEstimated, config.rpm, mods.frictionMul);

    return {
      torqueInstantNm: 0, // filled from cylinder sum by caller if needed
      torqueMeanNm: averages.meanTorqueNm,
      powerW,
      indicatedWorkPerCycleJ: averages.indicatedWorkJ,
      imepPa: averages.imepPa,
      etaIdeal,
      etaEstimated,
      energyBalance,
    };
  }

  private knockRisk(
    config: EngineConfiguration,
    mods: FaultModifiers,
    advance: number,
    cooling: CoolingState,
    intakeTempK: number,
  ): number {
    const crFactor = mapRange(config.geometry.compressionRatio, 8, 14, 0, 0.5);
    const advFactor = mapRange(advance, 10, 40, 0, 0.35);
    const loadFactor = mapRange(config.throttle, 0.2, 1, 0, 0.25);
    const tempFactor = mapRange(cooling.coolantTempK, celsiusToKelvin(90), celsiusToKelvin(120), 0, 0.3);
    const intakeFactor = mapRange(intakeTempK, celsiusToKelvin(20), celsiusToKelvin(70), 0, 0.2);
    const octaneFactor = (1 - mods.octaneRel) * 0.6;
    const boostFactor = config.turboEnabled ? mapRange(this.slow.turbo.boostPa, 0, 1.2e5, 0, 0.3) : 0;
    // Ethanol resists knock.
    const fuelBonus = config.fuel === 'ethanol' ? -0.2 : 0;
    return clamp(
      crFactor + advFactor + loadFactor + tempFactor + intakeFactor + octaneFactor + boostFactor + fuelBonus,
      0,
      1,
    );
  }

  private preIgnitionRisk(
    config: EngineConfiguration,
    mods: FaultModifiers,
    cooling: CoolingState,
  ): number {
    const depositFactor = mods.depositLevel * 0.6;
    const hotSpotFactor = mapRange(cooling.pistonTempK, celsiusToKelvin(220), celsiusToKelvin(320), 0, 0.5);
    const loadFactor = mapRange(config.throttle, 0.4, 1, 0, 0.2);
    return clamp(depositFactor + hotSpotFactor + loadFactor, 0, 1);
  }
}
