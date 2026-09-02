import { FIRING_ORDER } from './constants';
import type { StrokePhase } from './types';
import { normalizeCycleAngleDeg } from './units';

/**
 * Phase bookkeeping for the four cylinders of an inline-4 with firing order
 * 1-3-4-2. Local angle convention (per cylinder):
 *   0-180   intake   (piston TDC -> BDC)
 *   180-360 compression (BDC -> TDC), spark shortly before 360
 *   360-540 power/expansion (TDC -> BDC)
 *   540-720 exhaust (BDC -> TDC)
 */

/** Phase offset (deg) added to the global crank angle for a physical cylinder. */
export function cylinderPhaseOffsetDeg(cylinderNumber: number): number {
  const position = FIRING_ORDER.indexOf(cylinderNumber as 1 | 3 | 4 | 2);
  // Cylinder 1 fires at global 360; each later position fires 180 deg later.
  return normalizeCycleAngleDeg(-position * 180);
}

/** Local cycle angle (0..720) for a cylinder given the global crank angle. */
export function localCycleAngleDeg(globalCrankAngleDeg: number, cylinderNumber: number): number {
  return normalizeCycleAngleDeg(globalCrankAngleDeg + cylinderPhaseOffsetDeg(cylinderNumber));
}

/** Determine the four-stroke phase from a local cycle angle. */
export function phaseFromLocalAngle(localAngleDeg: number): StrokePhase {
  const a = normalizeCycleAngleDeg(localAngleDeg);
  if (a < 180) return 'intake';
  if (a < 360) return 'compression';
  if (a < 540) return 'power';
  return 'exhaust';
}
