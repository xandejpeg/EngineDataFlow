import { describe, expect, it } from 'vitest';
import { CatmullRomCurve3, Vector3 } from 'three';
import { bodyHalfWidth, frontCornerSweep } from './golfBodyGeometry';
import { BUMPER_COLUMNS, BUMPER_ROWS, createBumperGeometry } from './golfBumperGeometry';
import { rearSideDepth } from './golfRearSurface';

describe('continuous bumper skin', () => {
  for (const rear of [false, true]) it(`keeps ${rear ? 'rear' : 'front'} symmetry, side joins and smooth corners`, () => {
    const geometry = createBumperGeometry(rear);
    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');
    const rows = BUMPER_ROWS[rear ? 'rear' : 'front'];
    const profile = new CatmullRomCurve3(rows.map(([height, width, depth]) => new Vector3(height, width, depth))).getPoints(40);
    const endDepth = rear ? 3130 : -620;
    for (let row = 0; row <= 40; row++) {
      const start = row * (BUMPER_COLUMNS + 1);
      const sideDepth = rear ? rearSideDepth(profile[row].z, positions.getY(start)) : endDepth;
      expect(positions.getZ(start)).toBeCloseTo(sideDepth + (rear ? 0 : frontCornerSweep(sideDepth)), 3);
      expect(positions.getX(start)).toBeCloseTo(-bodyHalfWidth(positions.getY(start), sideDepth), 3);
      for (let column = 0; column <= BUMPER_COLUMNS; column++) {
        const vertex = start + column;
        const mirrored = start + BUMPER_COLUMNS - column;
        expect(positions.getX(vertex)).toBeCloseTo(-positions.getX(mirrored), 3);
        expect(positions.getZ(vertex)).toBeCloseTo(positions.getZ(mirrored), 3);
        const normal = new Vector3().fromBufferAttribute(normals, vertex);
        expect(normal.length()).toBeCloseTo(1, 5);
        if (column > 0) expect(normal.dot(new Vector3().fromBufferAttribute(normals, vertex - 1))).toBeGreaterThan(0.85);
      }
    }
    expect(positions.getY(BUMPER_COLUMNS / 2)).toBe(rows[0][0]);
    expect(positions.getZ(BUMPER_COLUMNS / 2)).toBe(rows[0][2]);
    geometry.dispose();
  });
});