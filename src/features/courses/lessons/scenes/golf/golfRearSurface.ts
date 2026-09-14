import { bodyHalfWidth } from './golfBodyGeometry';
import { BODY_TOP } from './golfBodyProfile';
import { CatmullRomCurve3, Vector3 } from 'three';

export const REAR_BUMPER_HEIGHT = 710;

export function rearCornerDepth(height: number) {
  const roofHeight = BODY_TOP.rearGlass[0][1];
  const progress = Math.max(0, Math.min(1, (roofHeight - height) / 360));
  return 205 * progress * progress * (3 - 2 * progress);
}

export function rearSideDepth(depth: number, height: number) {
  return depth - rearCornerDepth(height);
}

export function rearSectionPoint(across: number, depth: number, height: number, crown = 14): [number, number, number] {
  const sideDepth = rearSideDepth(depth, height);
  const width = bodyHalfWidth(height, sideDepth);
  const magnitude = Math.abs(across);
  if (magnitude === 1) return [Math.sign(across) * width, height, sideDepth];
  const corner = Math.max(0, (magnitude - 0.68) / 0.32);
  const angle = corner * Math.PI / 2;
  const horizontal = magnitude <= 0.68 ? magnitude : 0.68 + 0.32 * Math.sin(angle);
  const setback = magnitude <= 0.68 ? 0 : rearCornerDepth(height) * (1 - Math.cos(angle));
  return [Math.sign(across) * horizontal * width, height + (1 - across * across) * crown, depth - setback];
}

export function rearProfileDepth(height: number) {
  const rows = [...BODY_TOP.rearGlass, ...BODY_TOP.hatch.slice(1)];
  const index = rows.findIndex((row, offset) => offset < rows.length - 1 && height <= row[1] && height >= rows[offset + 1][1]);
  if (index < 0) throw new RangeError(`Rear height outside body: ${height}`);
  const start = rows[index];
  const end = rows[index + 1];
  return start[0] + (end[0] - start[0]) * (start[1] - height) / (start[1] - end[1]);
}

export const REAR_HATCH_ROWS: [number, number][] = [
  ...BODY_TOP.hatch.filter(([, height]) => height > REAR_BUMPER_HEIGHT),
  [rearProfileDepth(REAR_BUMPER_HEIGHT), REAR_BUMPER_HEIGHT],
];

export const REAR_BUMPER_PROFILE = [
  [320, 3300], [390, 3355], [540, 3360], [640, 3335], [REAR_BUMPER_HEIGHT, rearProfileDepth(REAR_BUMPER_HEIGHT)],
] as const;

const bumperCurve = new CatmullRomCurve3(REAR_BUMPER_PROFILE.map(([height, depth]) => new Vector3(height, depth, 0))).getPoints(200);
export const REAR_BUMPER_SAMPLES: [number, number][] = Array.from({ length: 41 }, (_, index) => {
  const height = index <= 16 ? 320 + index * 10 : 480 + (index - 16) / 24 * 230;
  const segment = bumperCurve.findIndex(point => point.x >= height);
  if (segment <= 0) return [height, REAR_BUMPER_PROFILE[0][1]];
  const start = bumperCurve[segment - 1];
  const end = bumperCurve[segment];
  return [height, start.y + (end.y - start.y) * (height - start.x) / (end.x - start.x)];
});

export function rearBumperPoint(across: number, depth: number, height: number, crown = 0): [number, number, number] {
  const point = rearSectionPoint(across, depth, height, crown);
  const ease = (value: number) => { const clamped = Math.max(0, Math.min(1, value)); return clamped * clamped * (3 - 2 * clamped); };
  const horizontal = ease((285 - Math.abs(point[0])) / 45);
  const vertical = ease((height - 457) / 30) * ease((637 - height) / 30);
  point[2] -= 28 * horizontal * vertical;
  return point;
}