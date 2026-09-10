import { describe, expect, it } from 'vitest';
import { BRAKE_REFERENCE, brakeGeometry } from './golfBrakeGeometry';

describe('estimated wheel brake geometry', () => {
  it('preserves original rotor radii and keeps pads clear of friction faces', () => {
    expect(brakeGeometry('front').radius).toBe(156);
    expect(brakeGeometry('rear').radius).toBe(143);
    for (const axle of ['front', 'rear'] as const) {
      const model = brakeGeometry(axle);
      expect(model.padInner - model.halfThickness).toBeCloseTo(0.7);
      expect(model.padOuter).toBeGreaterThan(model.padInner);
      expect(model.padRadius + 19).toBeLessThan(model.radius);
      expect(model.shieldAxis).toBeLessThan(-model.halfThickness);
    }
  });
  it('distinguishes illustrative front ventilation without selecting a factory PR', () => {
    expect(brakeGeometry('front').ventilated).toBe(true);
    expect(brakeGeometry('rear').ventilated).toBe(false);
    expect(BRAKE_REFERENCE.applicationStatus).toBe('generic-no-pr-selected');
    expect(BRAKE_REFERENCE.actuation).toBe('not-simulated');
  });
});