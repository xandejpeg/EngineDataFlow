import { P_ATMOSPHERE, R_AIR } from './constants';
import { combustionStartDeg, wiebeBurnFraction } from './combustion';
import { cylinderVolumeM3, dVolumeDThetaM3PerRad, mechanicalAngleRad } from './kinematics';
import type { DerivedGeometry, EnergyBalance } from './types';
import { clamp, degToRad, mapRange, normalizeCycleAngleDeg } from './units';

export interface CylinderThermoInput {
  localAngleDeg: number;
  derived: DerivedGeometry;
  gamma: number;
  manifoldPressurePa: number;
  intakeTempK: number;
  exhaustBackpressurePa: number;
  ignitionAdvanceDeg: number;
  combustionDurationDeg: number;
  chargeMassKg: number; // trapped air+fuel mass
  releasedHeatJ: number; // total chemical heat available this cycle
  sparkEnabled: boolean; // false => misfire (no heat release)
}

export interface CylinderThermoOutput {
  volumeM3: number;
  pressurePa: number;
  temperatureK: number;
  burnFraction: number;
  dVolumeDTheta: number;
}

/**
 * Single-zone quasi-static thermodynamic model, continuous in crank angle.
 * Reference state is taken at intake valve close (BDC, local 180 deg).
 */
export function computeCylinderThermo(input: CylinderThermoInput): CylinderThermoOutput {
  const {
    localAngleDeg,
    derived,
    gamma,
    manifoldPressurePa,
    intakeTempK,
    exhaustBackpressurePa,
    ignitionAdvanceDeg,
    combustionDurationDeg,
    releasedHeatJ,
    sparkEnabled,
  } = input;

  const a = normalizeCycleAngleDeg(localAngleDeg);
  const mechRad = mechanicalAngleRad(a);
  const rodM = derived.rodRatio * derived.crankRadiusM;
  const volumeM3 = volumeAt(a, derived);
  const dVolumeDTheta = dVolumeDThetaM3PerRad(mechRad, derived.pistonAreaM2, derived.crankRadiusM, rodM);

  // Reference (IVC) state at BDC.
  const v1 = volumeAt(180, derived);
  const p1 = manifoldPressurePa;
  const t1 = intakeTempK;
  const mR = (p1 * v1) / t1; // m*R for the trapped charge

  const cStart = combustionStartDeg(ignitionAdvanceDeg);
  const burnFraction = sparkEnabled
    ? wiebeBurnFraction(a, cStart, combustionDurationDeg)
    : 0;

  let pressurePa: number;
  let temperatureK: number;

  if (a < 180) {
    // Intake stroke: near manifold pressure and intake temperature.
    pressurePa = manifoldPressurePa;
    temperatureK = intakeTempK;
  } else if (a < cStart) {
    // Compression before spark: polytropic from IVC.
    pressurePa = p1 * Math.pow(v1 / volumeM3, gamma);
    temperatureK = t1 * Math.pow(v1 / volumeM3, gamma - 1);
  } else if (a < 540) {
    // Combustion + expansion: motored polytropic + single-zone heat release.
    const tMotored = t1 * Math.pow(v1 / volumeM3, gamma - 1);
    const deltaT = (burnFraction * releasedHeatJ * (gamma - 1)) / (mR || 1e-9);
    temperatureK = tMotored + deltaT;
    pressurePa = (mR * temperatureK) / volumeM3;
    // Blend down toward backpressure near exhaust valve opening (520-540).
    if (a > 520) {
      const t = (a - 520) / 20;
      pressurePa = pressurePa * (1 - t) + exhaustBackpressurePa * t;
    }
  } else {
    // Exhaust stroke: near backpressure, cooling gas.
    pressurePa = exhaustBackpressurePa;
    const tMotored = t1 * Math.pow(v1 / volumeAt(540, derived), gamma - 1);
    const deltaT = (releasedHeatJ * (gamma - 1)) / (mR || 1e-9);
    const tExhaustOpen = tMotored + deltaT;
    const t = (a - 540) / 180;
    temperatureK = clamp(tExhaustOpen * (1 - 0.55 * t), intakeTempK, 3000);
  }

  return {
    volumeM3,
    pressurePa: Math.max(pressurePa, 500),
    temperatureK: clamp(temperatureK, 200, 3200),
    burnFraction,
    dVolumeDTheta,
  };
}

/** Cylinder volume at a local cycle angle. */
export function volumeAt(localAngleDeg: number, derived: DerivedGeometry): number {
  const mechRad = mechanicalAngleRad(localAngleDeg);
  const rodM = derived.rodRatio * derived.crankRadiusM;
  const positionM =
    derived.crankRadiusM * (1 - Math.cos(mechRad)) +
    rodM -
    Math.sqrt(Math.max(rodM * rodM - Math.pow(derived.crankRadiusM * Math.sin(mechRad), 2), 0));
  return cylinderVolumeM3(positionM, derived.pistonAreaM2, derived.clearanceVolumeM3);
}

/** Ideal Otto-cycle thermal efficiency for comparison (labeled ideal only). */
export function idealOttoEfficiency(compressionRatio: number, gamma: number): number {
  return 1 - 1 / Math.pow(compressionRatio, gamma - 1);
}

/** Net indicated torque contribution from cylinder pressure. */
export function cylinderTorqueNm(
  pressurePa: number,
  dVolumeDThetaM3PerRadValue: number,
): number {
  // Gauge pressure relative to crankcase (~atmosphere) acting on the piston.
  return (pressurePa - P_ATMOSPHERE) * dVolumeDThetaM3PerRadValue;
}

/** Trapped air mass per cycle from volumetric efficiency and intake density. */
export function trappedAirMassKg(
  displacementCylinderM3: number,
  volumetricEfficiency: number,
  manifoldPressurePa: number,
  intakeTempK: number,
): number {
  const density = manifoldPressurePa / (R_AIR * intakeTempK);
  return displacementCylinderM3 * volumetricEfficiency * density;
}

/**
 * Distribute the input energy into useful work, cooling, exhaust, pumping and
 * friction losses. Fractions sum to 1 (labeled as didactic estimates).
 */
export function heatFractions(
  etaEstimated: number,
  rpm: number,
  frictionMul: number,
): EnergyBalance {
  const usefulFraction = clamp(etaEstimated, 0.05, 0.42);
  const remaining = 1 - usefulFraction;
  const frictionFraction = clamp(mapRange(rpm, 700, 6000, 0.05, 0.13) * frictionMul, 0.03, 0.2);
  const pumpingFraction = clamp(mapRange(rpm, 700, 6000, 0.02, 0.08), 0.02, 0.1);
  const rest = Math.max(remaining - frictionFraction - pumpingFraction, 0);
  const coolingFraction = rest * 0.5;
  const exhaustFraction = rest * 0.5;
  return {
    usefulFraction,
    coolingFraction,
    exhaustFraction,
    pumpingFraction,
    frictionFraction,
  };
}

export { degToRad };
