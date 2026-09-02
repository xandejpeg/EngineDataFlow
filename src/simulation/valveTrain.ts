import type { ValveState } from './types';
import { clamp, normalizeCycleAngleDeg } from './units';

/**
 * Simplified valve lift profiles based on the local cycle angle. Uses a smooth
 * raised-cosine (sin^2) lobe so lift is continuous. In beginner mode the ideal
 * open/close windows are used; an optional overlap can be enabled.
 */

export interface ValveTiming {
  intakeOpenDeg: number; // IVO
  intakeCloseDeg: number; // IVC
  exhaustOpenDeg: number; // EVO
  exhaustCloseDeg: number; // EVC
  maxLiftM: number;
}

export const DEFAULT_VALVE_TIMING: ValveTiming = {
  // Small realistic overlap around TDC intake.
  intakeOpenDeg: 350, // opens just before intake TDC (i.e. -10 => 710/350 region)
  intakeCloseDeg: 210, // closes a bit after BDC
  exhaustOpenDeg: 520, // opens before BDC
  exhaustCloseDeg: 10, // closes just after TDC
  maxLiftM: 0.009,
};

/** Beginner-mode ideal timing: no overlap, clean stroke boundaries. */
export const IDEAL_VALVE_TIMING: ValveTiming = {
  intakeOpenDeg: 0,
  intakeCloseDeg: 180,
  exhaustOpenDeg: 540,
  exhaustCloseDeg: 720,
  maxLiftM: 0.009,
};

/** Compute a smooth lift given an open window that may wrap past 720. */
function liftInWindow(
  angleDeg: number,
  openDeg: number,
  closeDeg: number,
  maxLiftM: number,
): number {
  const a = normalizeCycleAngleDeg(angleDeg);
  const start = normalizeCycleAngleDeg(openDeg);
  const end = normalizeCycleAngleDeg(closeDeg);
  // Duration of the open window (handle wrap-around).
  let duration = end - start;
  if (duration <= 0) duration += 720;
  // Position within window.
  let rel = a - start;
  if (rel < 0) rel += 720;
  if (rel > duration) return 0;
  const t = rel / duration; // 0..1
  return maxLiftM * Math.sin(Math.PI * t) ** 1; // smooth raised lobe
}

export function computeValveState(
  localAngleDeg: number,
  timing: ValveTiming,
  liftScale = 1,
): ValveState {
  const intakeLiftM =
    liftInWindow(localAngleDeg, timing.intakeOpenDeg, timing.intakeCloseDeg, timing.maxLiftM) *
    clamp(liftScale, 0, 1.5);
  const exhaustLiftM =
    liftInWindow(localAngleDeg, timing.exhaustOpenDeg, timing.exhaustCloseDeg, timing.maxLiftM) *
    clamp(liftScale, 0, 1.5);
  return {
    intakeLiftM,
    exhaustLiftM,
    intakeOpen: intakeLiftM > 1e-5,
    exhaustOpen: exhaustLiftM > 1e-5,
  };
}
