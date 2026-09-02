import { WIEBE } from './constants';
import { clamp } from './units';

/**
 * Wiebe function for the burned mass fraction during combustion.
 *   xb = 1 - exp(-a * tau^(m+1))
 * where tau is the normalized angle within the combustion window (0..1).
 */
export function wiebeBurnFraction(
  localAngleDeg: number,
  combustionStartDeg: number,
  combustionDurationDeg: number,
  a = WIEBE.a,
  m = WIEBE.m,
): number {
  const tau = (localAngleDeg - combustionStartDeg) / combustionDurationDeg;
  if (tau <= 0) return 0;
  if (tau >= 1) return 1;
  return 1 - Math.exp(-a * Math.pow(tau, m + 1));
}

/** Combustion start angle (deg) — spark occurs `advance` degrees before TDC power (360). */
export function combustionStartDeg(ignitionAdvanceDeg: number): number {
  return 360 - ignitionAdvanceDeg;
}

/**
 * Combustion efficiency as a smooth function of lambda. Peaks slightly rich,
 * falls off for very rich or very lean mixtures. Purely didactic curve.
 */
export function combustionEfficiency(lambda: number): number {
  // Gaussian-like bump centered near lambda 0.95.
  const center = 0.95;
  const width = 0.28;
  const base = Math.exp(-((lambda - center) ** 2) / (2 * width * width));
  return clamp(0.55 + 0.42 * base, 0.4, 0.99);
}

/**
 * Flame speed / stability factor. Very lean or very rich mixtures burn slower
 * and less reliably; used to modulate misfire tendency.
 */
export function combustionStability(lambda: number): number {
  if (lambda >= 0.8 && lambda <= 1.25) return 1;
  const d = lambda < 0.8 ? 0.8 - lambda : lambda - 1.25;
  return clamp(1 - d * 2.5, 0, 1);
}
