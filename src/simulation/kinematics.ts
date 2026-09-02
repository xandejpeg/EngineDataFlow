import type { DerivedGeometry } from './types';
import { degToRad } from './units';

/**
 * Slider-crank kinematics. The crank angle is measured from TDC (top dead
 * center). Piston displacement x is the distance from TDC (0 at TDC, positive
 * moving down toward BDC).
 *
 *   x(theta) = r*(1 - cos(theta)) + l - sqrt(l^2 - (r*sin(theta))^2)
 *
 * where r = crank radius, l = connecting-rod length.
 */
export function pistonPositionFromTdcM(
  crankAngleRad: number,
  crankRadiusM: number,
  conrodM: number,
): number {
  const r = crankRadiusM;
  const l = conrodM;
  const term = Math.sqrt(Math.max(l * l - Math.pow(r * Math.sin(crankAngleRad), 2), 0));
  return r * (1 - Math.cos(crankAngleRad)) + l - term;
}

/** Piston velocity (m/s) given crank angle and angular velocity omega (rad/s). */
export function pistonVelocityMps(
  crankAngleRad: number,
  omega: number,
  crankRadiusM: number,
  conrodM: number,
): number {
  const r = crankRadiusM;
  const l = conrodM;
  const sinT = Math.sin(crankAngleRad);
  const cosT = Math.cos(crankAngleRad);
  const root = Math.sqrt(Math.max(l * l - Math.pow(r * sinT, 2), 0));
  // dx/dtheta
  const dxdtheta = r * sinT + (r * r * sinT * cosT) / (root || 1e-9);
  return dxdtheta * omega;
}

/** Instantaneous cylinder volume (m^3) at a given piston position. */
export function cylinderVolumeM3(
  pistonPositionM: number,
  pistonAreaM2: number,
  clearanceVolumeM3: number,
): number {
  return clearanceVolumeM3 + pistonAreaM2 * pistonPositionM;
}

/** dV/dtheta (m^3/rad) — needed for torque from pressure. */
export function dVolumeDThetaM3PerRad(
  crankAngleRad: number,
  pistonAreaM2: number,
  crankRadiusM: number,
  conrodM: number,
): number {
  const r = crankRadiusM;
  const l = conrodM;
  const sinT = Math.sin(crankAngleRad);
  const cosT = Math.cos(crankAngleRad);
  const root = Math.sqrt(Math.max(l * l - Math.pow(r * sinT, 2), 0));
  const dxdtheta = r * sinT + (r * r * sinT * cosT) / (root || 1e-9);
  return pistonAreaM2 * dxdtheta;
}

/**
 * The mechanical crank position repeats every 360 deg, while the thermodynamic
 * phase spans 720 deg. This maps a thermodynamic phase to the mechanical angle.
 */
export function mechanicalAngleRad(cycleAngleDeg: number): number {
  return degToRad(cycleAngleDeg % 360);
}

/** Convenience: full slider-crank state for one cylinder at a phase. */
export function crankState(
  cycleAngleDeg: number,
  omega: number,
  derived: DerivedGeometry,
): { positionM: number; velocityMps: number; volumeM3: number } {
  const mechRad = mechanicalAngleRad(cycleAngleDeg);
  const positionM = pistonPositionFromTdcM(mechRad, derived.crankRadiusM, 0 + rodLength(derived));
  const velocityMps = pistonVelocityMps(
    mechRad,
    omega,
    derived.crankRadiusM,
    rodLength(derived),
  );
  const volumeM3 = cylinderVolumeM3(positionM, derived.pistonAreaM2, derived.clearanceVolumeM3);
  return { positionM, velocityMps, volumeM3 };
}

/** Recover connecting-rod length from the derived rod ratio. */
export function rodLength(derived: DerivedGeometry): number {
  return derived.rodRatio * derived.crankRadiusM;
}
