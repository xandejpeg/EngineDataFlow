import { describe, expect, it } from 'vitest';
import { cabinPanelPoint } from './golfCabinSurface';
import { bodyHalfWidth } from './golfBodyGeometry';
import { BODY_TOP } from './golfVehicleGeometry';

describe('compound cabin surfaces', () => {
  it('preserves door-side edges, mirror symmetry and panel joins', () => {
    for (const kind of ['roof', 'windshield'] as const) for (const [depth, height] of BODY_TOP[kind]) {
      expect(cabinPanelPoint(kind, 1, depth, height)).toEqual([bodyHalfWidth(height, depth), height, depth]);
      const right = cabinPanelPoint(kind, 0.5, depth, height);
      expect(cabinPanelPoint(kind, -0.5, depth, height)).toEqual([-right[0], right[1], right[2]]);
    }
    for (const across of [-1, -0.5, 0, 0.5, 1]) {
      const [startDepth, startHeight] = BODY_TOP.roof[0];
      const [endDepth, endHeight] = BODY_TOP.roof[BODY_TOP.roof.length - 1];
      expect(cabinPanelPoint('windshield', across, startDepth, startHeight)).toEqual(cabinPanelPoint('roof', across, startDepth, startHeight));
      expect(cabinPanelPoint('roof', across, endDepth, endHeight)[1]).toBe(endHeight + (1 - across * across) * 14);
    }
  });
  it('crowns the roof and bows the windshield without moving its cowl', () => {
    const roofMidpoint = (BODY_TOP.roof[0][0] + BODY_TOP.roof[BODY_TOP.roof.length - 1][0]) / 2;
    expect(cabinPanelPoint('roof', 0, roofMidpoint, 1475)[1]).toBe(1519);
    expect(cabinPanelPoint('windshield', 0, 485, 1213)[2]).toBe(463);
    expect(cabinPanelPoint('windshield', 0, 210, 990)).toEqual([0, 1004, 210]);
  });
});