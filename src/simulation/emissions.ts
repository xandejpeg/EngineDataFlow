import type { EmissionsState } from './types';
import { clamp } from './units';

/**
 * Qualitative relative emission indices (0..1). These are didactic tendencies,
 * NOT measured values, and are labeled as such in the UI.
 */
export function computeEmissions(
  lambda: number,
  gasTempK: number,
  misfireIntensity: number,
): EmissionsState {
  // CO/HC rise sharply when rich; HC also rises on misfire.
  const richness = clamp(1 - lambda, 0, 0.5) * 2; // 0..1 for lambda 1..0.5
  const leanness = clamp(lambda - 1, 0, 0.4) * 2.5;

  const coRel = clamp(0.1 + richness * 0.85, 0, 1);
  const hcRel = clamp(0.1 + richness * 0.6 + leanness * 0.3 + misfireIntensity * 0.6, 0, 1);
  // NOx peaks slightly lean and at high temperature.
  const noxTempFactor = clamp((gasTempK - 1600) / 800, 0, 1);
  const noxLambdaFactor = clamp(1 - Math.abs(lambda - 1.08) * 3, 0, 1);
  const noxRel = clamp(0.15 + noxTempFactor * 0.6 * noxLambdaFactor, 0, 1);
  const co2Rel = clamp(0.4 + (1 - Math.abs(lambda - 1) * 1.5) * 0.4, 0, 1);

  return { coRel, hcRel, noxRel, co2Rel };
}
