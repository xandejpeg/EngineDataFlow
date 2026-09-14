import { expect, it } from 'vitest';
import { bodyHalfWidth } from './golfBodyGeometry';
import { BODY_TOP } from './golfBodyProfile';
import { rearBumperPoint, rearProfileDepth, rearSectionPoint, rearSideDepth } from './golfRearSurface';
import { BUMPER_COLUMNS, createBumperGeometry } from './golfBumperGeometry';

it('joins rounded rear corners to the side sheet and preserves mirrored continuous sections', () => {
  for (const [depth, height] of [...BODY_TOP.rearGlass, ...BODY_TOP.hatch]) {
    const sideDepth = rearSideDepth(depth, height);
    const width = bodyHalfWidth(height, sideDepth);
    expect(rearSectionPoint(1, depth, height)).toEqual([width, height, sideDepth]);
    expect(rearSectionPoint(-1, depth, height)).toEqual([-width, height, sideDepth]);
    expect(rearProfileDepth(height)).toBeCloseTo(depth, 3);
    for (let step = 0; step <= 100; step++) {
      const across = step / 100;
      const right = rearSectionPoint(across, depth, height);
      const left = rearSectionPoint(-across, depth, height);
      expect(left[0]).toBeCloseTo(-right[0]);
      expect(left.slice(1)).toEqual(right.slice(1));
      expect(right.every(Number.isFinite)).toBe(true);
      if (step) {
        const previous = rearSectionPoint((step - 1) / 100, depth, height);
        expect(right[0]).toBeGreaterThan(previous[0]);
        expect(right[2]).toBeLessThanOrEqual(previous[2]);
      }
    }
  }
  expect(rearSectionPoint(0.95, 3340, 865)[2]).toBeLessThan(3190);
});

it('shares every upper bumper vertex with the lower hatch and quarter section', () => {
  const geometry = createBumperGeometry(true);
  const positions = geometry.getAttribute('position');
  for (let column = 0; column <= BUMPER_COLUMNS; column++) {
    const point = rearSectionPoint(column / BUMPER_COLUMNS * 2 - 1, rearProfileDepth(710), 710);
    const vertex = 40 * (BUMPER_COLUMNS + 1) + column;
    expect(positions.getX(vertex)).toBeCloseTo(point[0], 3);
    expect(positions.getY(vertex)).toBeCloseTo(point[1], 3);
    expect(positions.getZ(vertex)).toBeCloseTo(point[2], 3);
  }
  geometry.dispose();
});

it('recesses the plate into the bumper without shifting the corners or upper join', () => {
  expect(rearBumperPoint(0, 3360, 547)[2]).toBe(3332);
  expect(rearBumperPoint(0.6, 3360, 547)).toEqual(rearSectionPoint(0.6, 3360, 547, 0));
  expect(rearBumperPoint(1, 3360, 547)).toEqual(rearSectionPoint(1, 3360, 547, 0));
  expect(rearBumperPoint(0, rearProfileDepth(710), 710, 14)).toEqual(rearSectionPoint(0, rearProfileDepth(710), 710));
});