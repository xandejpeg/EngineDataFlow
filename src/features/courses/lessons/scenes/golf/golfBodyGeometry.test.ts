import { describe, expect, it } from 'vitest';
import { bodyHalfWidth, createBodySide } from './golfBodyGeometry';
import { BODY_TOP, createVehicleOutline, VEHICLE_WHEELS } from './golfVehicleGeometry';

describe('Golf exterior surfaces', () => {
  it('keeps the dimension markers on the actual wheel arch skin', () => {
    for (const wheel of VEHICLE_WHEELS) expect(wheel.side * bodyHalfWidth(wheel.arch[1], wheel.arch[2])).toBeCloseTo(wheel.arch[0]);
  });
  it('joins the hood glass roof and hatch with shared endpoints', () => {
    const panels = Object.values(BODY_TOP);
    for (let panel = 1; panel < panels.length; panel++) expect(panels[panel][0]).toEqual(panels[panel - 1].at(-1));
  });
  it('narrows the greenhouse and rounds the waist without moving the wheels', () => {
    expect(bodyHalfWidth(1465, 1500)).toBe(710);
    expect(bodyHalfWidth(990, 1500)).toBe(837);
    expect(bodyHalfWidth(650, 1500)).toBeGreaterThan(855);
    expect(bodyHalfWidth(317, 1500)).toBeLessThan(805);
    expect(bodyHalfWidth(700, 1500) - bodyHalfWidth(317, 1500)).toBeGreaterThan(65);
    expect(VEHICLE_WHEELS.map(wheel => wheel.hub[2])).toEqual([0, 0, 2578, 2578]);
  });
  it('builds mirrored finite surfaces while preserving window openings', () => {
    const outline = createVehicleOutline();
    expect(outline.holes).toHaveLength(3);
    const left = createBodySide(outline, -1);
    const right = createBodySide(outline, 1);
    const leftPositions = left.getAttribute('position');
    const rightPositions = right.getAttribute('position');
    expect(leftPositions.count).toBe(rightPositions.count);
    for (let vertex = 0; vertex < leftPositions.count; vertex++) {
      expect(leftPositions.getX(vertex)).toBe(-rightPositions.getX(vertex));
      expect(Number.isFinite(leftPositions.getY(vertex))).toBe(true);
      expect(Number.isFinite(leftPositions.getZ(vertex))).toBe(true);
    }
    left.dispose(); right.dispose();
  });
});