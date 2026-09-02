import { deriveGeometry } from './geometry';
import { computeIntake, computeMixture, heatPerCycleJ } from './intake';
import { combustionEfficiency } from './combustion';
import {
  computeCylinderThermo,
  cylinderTorqueNm,
  trappedAirMassKg,
} from './thermodynamics';
import { computeValveState, IDEAL_VALVE_TIMING } from './valveTrain';
import { FIRING_ORDER } from './constants';
import { localCycleAngleDeg } from './phasing';
import { accumulateFaultModifiers } from './faults/faultModifiers';
import type { EngineConfiguration } from './types';
import { celsiusToKelvin, kelvinToCelsius, mToMm, paToBar } from './units';
import { initialTurbo } from './turbo';

export interface CycleSample {
  angle: number; // 0..720 crank angle
  pressureBar: number; // cylinder 1 pressure
  temperatureC: number;
  volumeCm3: number;
  intakeLiftMm: number;
  exhaustLiftMm: number;
  torqueTotal: number;
  torqueCyl1: number;
}

/**
 * Sample one full 720-degree cycle for charts (p-V, pressure/temp/volume/valve
 * lift/torque vs angle). Pure with respect to the live engine state.
 */
export function sampleCycle(
  config: EngineConfiguration,
  faultIds: string[],
  samples = 180,
): CycleSample[] {
  const derived = deriveGeometry(config.geometry);
  const mods = accumulateFaultModifiers(faultIds, config);
  const turbo = initialTurbo();
  const intake = computeIntake(config, mods, turbo);
  const intakeTempK = celsiusToKelvin(kelvinToCelsius(config.ambientTempK) + 10);
  const airMass = trappedAirMassKg(
    derived.displacementCylinderM3,
    intake.volumetricEfficiency,
    intake.manifoldPressurePa,
    intakeTempK,
  );
  intake.airMassPerCycleKg = airMass;
  const mixture = computeMixture(config, mods, airMass);
  const combEff = combustionEfficiency(mixture.lambda);
  const heatCycleJ = heatPerCycleJ(config.fuel, airMass, mixture.afr, combEff);
  const advance = config.ignitionAdvanceDeg + mods.ignitionAdvanceAddDeg;

  const out: CycleSample[] = [];
  const stepDeg = 720 / samples;

  for (let s = 0; s <= samples; s++) {
    const global = s * stepDeg;
    let torqueTotal = 0;
    let torqueCyl1 = 0;
    let pressureBar = 0;
    let temperatureC = 0;
    let volumeCm3 = 0;

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
        chargeMassKg: airMass,
        releasedHeatJ: heatCycleJ,
        sparkEnabled: true,
      });
      const torque = cylinderTorqueNm(thermo.pressurePa, thermo.dVolumeDTheta);
      torqueTotal += torque;
      if (cylinderNumber === 1) {
        torqueCyl1 = torque;
        pressureBar = paToBar(thermo.pressurePa);
        temperatureC = kelvinToCelsius(thermo.temperatureK);
        volumeCm3 = thermo.volumeM3 * 1e6;
      }
    }

    const localAngle1 = localCycleAngleDeg(global, 1);
    const valves = computeValveState(localAngle1, IDEAL_VALVE_TIMING);

    out.push({
      angle: Math.round(global),
      pressureBar: Number(pressureBar.toFixed(2)),
      temperatureC: Number(temperatureC.toFixed(0)),
      volumeCm3: Number(volumeCm3.toFixed(1)),
      intakeLiftMm: Number(mToMm(valves.intakeLiftM).toFixed(2)),
      exhaustLiftMm: Number(mToMm(valves.exhaustLiftM).toFixed(2)),
      torqueTotal: Number(torqueTotal.toFixed(1)),
      torqueCyl1: Number(torqueCyl1.toFixed(1)),
    });
  }
  return out;
}

/** Torque and power sweep across an RPM range (calculated, not measured). */
export interface SweepPoint {
  rpm: number;
  torqueNm: number;
  powerKw: number;
}
