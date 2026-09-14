import { describe, expect, it } from 'vitest';
import { CircleGeometry, Shape } from 'three';
import { fitRearDetail, hoodPanelPoint, hoodSplitAt, HOOD_GAP, rearLampSurface, rearPanelPoint, rearPanelSplit } from './golfBodyFit';
import { bodyHalfWidth, frontCornerSweep } from './golfBodyGeometry';
import { BODY_TOP } from './golfVehicleGeometry';
import { rearSideDepth } from './golfRearSurface';
import { bodyHingePoint, HATCH_ANGLE, HATCH_PIVOT } from './golfBodyWiring';

describe('body detail surface fit', () => {
  it('tessellates the red rear lamp cover over the curved hatch instead of crossing the paint', () => {
    const shape = new Shape();
    shape.moveTo(-210, -90); shape.lineTo(180, -90); shape.lineTo(120, 110); shape.lineTo(-160, 90); shape.closePath();
    const geometry = rearLampSurface(shape, 1, [0, 932], 4);
    const vertices = geometry.getAttribute('position');
    expect(vertices.count).toBeGreaterThan(300);
    for (let vertex = 0; vertex < vertices.count; vertex++) {
      const height = vertices.getY(vertex);
      let lower = 0;
      let upper = 1;
      for (let step = 0; step < 40; step++) {
        const middle = (lower + upper) / 2;
        if (rearPanelPoint(middle, height)[0] < vertices.getX(vertex)) lower = middle; else upper = middle;
      }
      const across = (lower + upper) / 2;
      expect(vertices.getZ(vertex) - rearPanelPoint(across, height)[2]).toBeCloseTo(4, 2);
    }
    geometry.dispose();
  });
  it('separates the hood from fixed fenders with a small continuous gap', () => {
    for (const [depth, height] of BODY_TOP.hood) {
      const outerEdge = hoodPanelPoint(1, depth, height);
      expect(outerEdge).toEqual([bodyHalfWidth(height, depth), height, depth + frontCornerSweep(depth)]);
      const split = hoodSplitAt(depth);
      const hood = hoodPanelPoint(split - HOOD_GAP, depth, height);
      const fender = hoodPanelPoint(split + HOOD_GAP, depth, height);
      expect(fender[0] - hood[0]).toBeGreaterThan(3);
      expect(fender[0] - hood[0]).toBeLessThan(4);
      expect(Math.abs(fender[1] - hood[1])).toBeLessThan(0.2);
      expect(hoodPanelPoint(-split + HOOD_GAP, depth, height)).toEqual([-hood[0], hood[1], hood[2]]);
    }
    expect(hoodPanelPoint(0, -875, 795)[2]).toBe(-910);
    expect(hoodPanelPoint(0, 210, 990)[2]).toBe(210);
    expect(hoodSplitAt(-875)).toBeCloseTo(0.43);
    expect(hoodSplitAt(210)).toBeCloseTo(0.83);
  });
  it('uses the hatch skin profile and keeps mirror symmetry', () => {
    expect(rearPanelSplit(940)).toBe(0.7);
    expect(rearPanelSplit(710)).toBeCloseTo(0.62);
    expect(rearPanelSplit(760)).toBeGreaterThan(rearPanelSplit(710));
    expect(rearPanelSplit(760)).toBeLessThan(rearPanelSplit(840));
    expect(rearPanelSplit(1200)).toBeCloseTo(0.88);
    expect(rearPanelSplit(1060)).toBeGreaterThan(0.84);
    for (const [depth, height] of BODY_TOP.hatch.slice(1, -1)) {
      const across = 0.6;
      const point = rearPanelPoint(across, height + (1 - across * across) * 14);
      expect(point[2]).toBeCloseTo(depth, 6);
      expect(point[0]).toBeCloseTo(across * bodyHalfWidth(height, rearSideDepth(depth, height)), 6);
      expect(rearPanelPoint(-across, point[1])).toEqual([-point[0], point[1], point[2]]);
    }
  });
  it('seats every lens vertex at a fixed clearance and preserves it through hinge travel', () => {
    for (const side of [-1, 1]) {
      const lens = new CircleGeometry(63, 40);
      const source = lens.getAttribute('position').clone();
      fitRearDetail(lens, side, [-100, 929], 6);
      const fitted = lens.getAttribute('position');
      for (let vertex = 0; vertex < fitted.count; vertex++) {
        const across = side * (rearPanelSplit(929 + source.getY(vertex)) + (-100 + source.getX(vertex)) / 800);
        const skin = rearPanelPoint(across, 929 + source.getY(vertex));
        const point: [number, number, number] = [fitted.getX(vertex), fitted.getY(vertex), fitted.getZ(vertex)];
        expect(point[2] - skin[2]).toBeCloseTo(6, 2);
        for (const opening of [0, 0.5, 1]) {
          const movedSkin = bodyHingePoint(skin, HATCH_PIVOT, HATCH_ANGLE * opening);
          const movedLens = bodyHingePoint(point, HATCH_PIVOT, HATCH_ANGLE * opening);
          expect(Math.hypot(...movedLens.map((coordinate, axis) => coordinate - movedSkin[axis]))).toBeCloseTo(6, 2);
        }
      }
      lens.dispose();
    }
  });
});