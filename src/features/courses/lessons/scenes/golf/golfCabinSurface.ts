import { bodyHalfWidth } from './golfBodyGeometry';
import { BODY_TOP } from './golfVehicleGeometry';

export function cabinPanelPoint(kind: 'roof' | 'windshield', across: number, depth: number, height: number): [number, number, number] {
  const rows = BODY_TOP[kind];
  const progress = Math.max(0, Math.min(1, (depth - rows[0][0]) / (rows[rows.length - 1][0] - rows[0][0])));
  const arch = progress === 0 || progress === 1 ? 0 : Math.sin(progress * Math.PI);
  const transverse = 1 - across * across;
  const crown = transverse * (14 + (kind === 'roof' ? 22 * arch : 6 * arch));
  const bow = kind === 'windshield' ? 42 * arch * transverse : 0;
  return [across * bodyHalfWidth(height, depth), height + crown, depth - bow];
}