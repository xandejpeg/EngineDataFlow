import { describe, expect, it } from 'vitest';
import { COCKPIT, createDashboardGeometry, steeringSpokeShape } from './golfCockpitGeometry';

describe('estimated cockpit geometry', () => {
  it('closes the curved dashboard with mirrored shoulders inside the cabin', () => {
    const geometry = createDashboardGeometry();
    const positions = geometry.getAttribute('position');
    const index = geometry.getIndex()!;
    const edges = new Map<string, number>();
    for (let triangle = 0; triangle < index.count; triangle += 3) for (let corner = 0; corner < 3; corner++) {
      const first = index.getX(triangle + corner);
      const second = index.getX(triangle + (corner + 1) % 3);
      const key = [first, second].sort((left, right) => left - right).join(':');
      edges.set(key, (edges.get(key) ?? 0) + 1);
    }
    expect([...edges.values()].every(count => count === 2)).toBe(true);
    for (let column = 0; column <= 48; column++) for (let point = 0; point < 8; point++) {
      const vertex = column * 8 + point;
      const mirror = (48 - column) * 8 + point;
      expect(positions.getX(vertex)).toBeCloseTo(-positions.getX(mirror));
      expect(positions.getY(vertex)).toBe(positions.getY(mirror));
      expect(positions.getZ(vertex)).toBe(positions.getZ(mirror));
    }
    expect(geometry.boundingBox!.min.x).toBe(-790);
    expect(geometry.boundingBox!.max.z).toBeLessThan(COCKPIT.instruments[0][2]);
    expect(Array.from(geometry.getAttribute('normal').array).every(Number.isFinite)).toBe(true);
    geometry.dispose();
  });
  it('retains the steering mount and fits three solid spokes inside the rim', () => {
    expect(COCKPIT.steeringPosition).toEqual([-390, 915, 965]);
    for (const side of [-1, 0, 1]) for (const point of steeringSpokeShape(side).getPoints()) expect(point.length()).toBeLessThan(167);
    expect(COCKPIT.driverEye[2]).toBeGreaterThan(COCKPIT.steeringPosition[2]);
    expect(COCKPIT.driverTarget[2]).toBeLessThan(COCKPIT.steeringPosition[2]);
  });
});