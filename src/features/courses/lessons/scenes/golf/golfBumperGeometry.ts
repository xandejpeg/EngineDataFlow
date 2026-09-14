import { BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, Vector3 } from 'three';
import { bodyHalfWidth, frontCornerSweep } from './golfBodyGeometry';
import { REAR_BUMPER_PROFILE, REAR_BUMPER_SAMPLES, rearBumperPoint, rearSectionPoint } from './golfRearSurface';

export const BUMPER_ROWS = {
  front: [[300, 785, -865], [350, 825, -910], [530, 850, -925], [645, 845, -920], [780, 813, -865]],
  rear: REAR_BUMPER_PROFILE.map(([height, depth]) => [height, rearSectionPoint(1, depth, height)[0], depth]),
} as const;
export const BUMPER_COLUMNS = 96;

export function createBumperGeometry(rear: boolean) {
  const rows = BUMPER_ROWS[rear ? 'rear' : 'front'];
  const profile = new CatmullRomCurve3(rows.map(([height, width, depth]) => new Vector3(height, width, depth)));
  const positions: number[] = [];
  const indices: number[] = [];
  const depthSign = rear ? -1 : 1;
  const sideDepth = rear ? 3130 : -620;
  const endDepth = sideDepth + (rear ? 0 : frontCornerSweep(sideDepth));
  const samples = rear ? REAR_BUMPER_SAMPLES.map(([height, depth]) => new Vector3(height, rearSectionPoint(1, depth, height)[0], depth)) : profile.getPoints(40);
  const first = rows[0];
  const last = rows[rows.length - 1];
  samples[0].set(first[0], first[1], first[2]);
  samples[40].set(last[0], last[1], last[2]);
  samples.forEach(({ x: height, y: width, z: depth }, row) => {
    const endWidth = bodyHalfWidth(height, sideDepth);
    const contour = new CatmullRomCurve3([
      new Vector3(-endWidth, height, endDepth),
      new Vector3(-width, height, depth + depthSign * 130),
      new Vector3(-width * 0.83, height, depth + depthSign * 26),
      new Vector3(0, height, depth),
      new Vector3(width * 0.83, height, depth + depthSign * 26),
      new Vector3(width, height, depth + depthSign * 130),
      new Vector3(endWidth, height, endDepth),
    ]);
    const crownProgress = Math.max(0, Math.min(1, (height - 620) / 90));
    const crown = 14 * crownProgress * crownProgress * (3 - 2 * crownProgress);
    const points = rear ? Array.from({ length: BUMPER_COLUMNS + 1 }, (_, column) => new Vector3(...rearBumperPoint(column / BUMPER_COLUMNS * 2 - 1, depth, height, crown))) : contour.getPoints(BUMPER_COLUMNS);
    if (!rear) {
      points[0].set(-endWidth, height, endDepth);
      points[BUMPER_COLUMNS].set(endWidth, height, endDepth);
    }
    points.forEach(point => positions.push(point.x, point.y, point.z));
    if (row < samples.length - 1) for (let column = 0; column < BUMPER_COLUMNS; column++) {
      const vertex = row * (BUMPER_COLUMNS + 1) + column;
      indices.push(vertex, vertex + BUMPER_COLUMNS + 1, vertex + 1, vertex + 1, vertex + BUMPER_COLUMNS + 1, vertex + BUMPER_COLUMNS + 2);
    }
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  samples.slice(0, -1).forEach((point, row) => geometry.addGroup(row * BUMPER_COLUMNS * 6, BUMPER_COLUMNS * 6, point.x < (rear ? 480 : 340) ? 1 : 0));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}