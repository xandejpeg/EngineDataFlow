import type { DerivedGeometry, EngineGeometry } from './types';
import { PI } from './units';

/**
 * Compute cached geometric quantities from the base engine geometry.
 * All lengths in meters, volumes in cubic meters.
 */
export function deriveGeometry(geometry: EngineGeometry): DerivedGeometry {
  const { boreM, strokeM, conrodM, compressionRatio, cylinderCount } = geometry;

  const crankRadiusM = strokeM / 2;
  const pistonAreaM2 = (PI * boreM * boreM) / 4;
  const displacementCylinderM3 = pistonAreaM2 * strokeM;
  const displacementTotalM3 = displacementCylinderM3 * cylinderCount;
  // Vc = Vd / (CR - 1)
  const clearanceVolumeM3 = displacementCylinderM3 / (compressionRatio - 1);
  const rodRatio = conrodM / crankRadiusM;

  return {
    crankRadiusM,
    pistonAreaM2,
    displacementCylinderM3,
    displacementTotalM3,
    clearanceVolumeM3,
    rodRatio,
  };
}

/**
 * Geometric compression ratio from swept + clearance volumes.
 * Provided for tests / verification against the configured value.
 */
export function geometricCompressionRatio(
  displacementCylinderM3: number,
  clearanceVolumeM3: number,
): number {
  return (displacementCylinderM3 + clearanceVolumeM3) / clearanceVolumeM3;
}
