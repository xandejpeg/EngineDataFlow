import { expect, it } from 'vitest';
import { FUEL_GEOMETRY, FUEL_SENDER_ROUTES, fuelFloatPose } from './golfFuelGeometry';

it('keeps the float at the liquid surface with a rigid arm at every level', () => {
  for (let step = 0; step <= 100; step += 1) {
    const pose = fuelFloatPose(step / 100);
    expect(pose.tip[1]).toBeCloseTo(325 + 260 * step / 100);
    expect(pose.tip[0] - 26).toBeGreaterThan(-380);
    expect(pose.tip[0] + 26).toBeLessThan(-62);
    expect(Math.hypot(...pose.tip.map((value, axis) => value - FUEL_GEOMETRY.pivot[axis]))).toBeCloseTo(160);
    expect(pose.angle).toBeGreaterThan(-Math.PI / 2);
    expect(pose.angle).toBeLessThan(Math.PI / 2);
  }
});
it('connects sender signal to the instrument plug without sharing pump wiring', () => {
  expect(FUEL_SENDER_ROUTES[0].points[0]).toEqual(FUEL_GEOMETRY.senderPlug);
  expect(FUEL_SENDER_ROUTES[0].points.at(-1)).toEqual(FUEL_GEOMETRY.gaugePlug);
  expect(FUEL_SENDER_ROUTES).toHaveLength(4);
  for (const route of FUEL_SENDER_ROUTES) expect(route.points.flat().every(Number.isFinite)).toBe(true);
});