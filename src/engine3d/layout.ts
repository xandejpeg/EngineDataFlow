import { deriveGeometry } from '@/simulation/geometry';
import type { EngineConfiguration } from '@/simulation/types';

/** World scale: meters -> scene units. */
export const SCALE = 9;

export interface EngineLayout {
  scale: number;
  boreU: number;
  strokeU: number;
  rodU: number;
  crankRadiusU: number;
  cylinderSpacingU: number;
  cylinderXs: number[];
  deckTopY: number; // Y of piston crown at TDC
  crankCenterY: number;
  totalWidthU: number;
}

/** Compute a scene layout from the engine configuration. */
export function computeLayout(config: EngineConfiguration): EngineLayout {
  const derived = deriveGeometry(config.geometry);
  const boreU = config.geometry.boreM * SCALE;
  const strokeU = config.geometry.strokeM * SCALE;
  const rodU = config.geometry.conrodM * SCALE;
  const crankRadiusU = derived.crankRadiusM * SCALE;
  const cylinderSpacingU = boreU * 1.55;
  const count = config.geometry.cylinderCount;

  const cylinderXs: number[] = [];
  const offset = ((count - 1) * cylinderSpacingU) / 2;
  for (let i = 0; i < count; i++) {
    cylinderXs.push(i * cylinderSpacingU - offset);
  }

  const crankCenterY = 0;
  const deckTopY = crankCenterY + crankRadiusU + rodU; // piston crown at TDC

  return {
    scale: SCALE,
    boreU,
    strokeU,
    rodU,
    crankRadiusU,
    cylinderSpacingU,
    cylinderXs,
    deckTopY,
    crankCenterY,
    totalWidthU: count * cylinderSpacingU,
  };
}
