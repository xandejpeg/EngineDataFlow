import { expect, it } from 'vitest';
import { bodyHalfWidth } from './golfBodyGeometry';
import { createDoorTrimInsert, doorDefinition } from './golfDoorGeometry';
import type { DoorId } from './golfBodyControl';

it('mirrors door inserts below the glass and inside the trim surface', () => {
  for (const axle of ['front', 'rear']) for (const upper of [false, true]) {
    const leftId = `${axle}-left` as DoorId;
    const rightId = `${axle}-right` as DoorId;
    const left = createDoorTrimInsert(leftId, upper);
    const right = createDoorTrimInsert(rightId, upper);
    const leftPivot = doorDefinition(leftId).pivot;
    const rightPivot = doorDefinition(rightId).pivot;
    const positions = left.getAttribute('position');
    const mirrored = right.getAttribute('position');
    expect(positions.count).toBeGreaterThan(0);
    expect(positions.count).toBe(mirrored.count);
    for (let vertex = 0; vertex < positions.count; vertex++) {
      const height = positions.getY(vertex) + leftPivot[1];
      const depth = positions.getZ(vertex) + leftPivot[2];
      const width = Math.abs(positions.getX(vertex) + leftPivot[0]);
      expect(height).toBeLessThanOrEqual(975.001);
      expect(height).toBeGreaterThanOrEqual(upper ? 944.999 : 659.999);
      expect(bodyHalfWidth(height, depth) - width).toBeCloseTo(upper ? 40 : 46, 3);
      expect(positions.getX(vertex) + leftPivot[0]).toBeCloseTo(-mirrored.getX(vertex) - rightPivot[0], 3);
      expect(positions.getY(vertex)).toBe(mirrored.getY(vertex));
      expect(positions.getZ(vertex)).toBe(mirrored.getZ(vertex));
    }
    left.dispose(); right.dispose();
  }
});