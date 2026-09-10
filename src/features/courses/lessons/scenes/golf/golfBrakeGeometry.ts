import type { AlignmentAxle } from './golfAlignment';

export const BRAKE_REFERENCE = {
  dimensionalStatus: 'estimated', applicationStatus: 'generic-no-pr-selected',
  actuation: 'not-simulated', boltPattern: 'illustrative-not-verified',
} as const;

export function brakeGeometry(axle: AlignmentAxle) {
  const front = axle === 'front';
  const halfThickness = front ? 12 : 5;
  return {
    radius: front ? 156 : 143,
    halfThickness,
    ventilated: front,
    padInner: halfThickness + 0.7,
    padOuter: halfThickness + 9,
    padRadius: front ? 123 : 110,
    shieldAxis: -halfThickness - 19,
    hubFace: 36,
    boltCircleRadius: 55,
    boltCount: 5,
  };
}

export function brakeAnnulus(inner: number, outer: number, start: number, end: number): [number, number][] {
  return [[inner, start], [outer, start], [outer, end], [inner, end], [inner, start]];
}