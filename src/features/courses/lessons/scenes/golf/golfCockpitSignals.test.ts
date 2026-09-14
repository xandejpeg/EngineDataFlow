import { describe, expect, it } from 'vitest';
import { initialClock, sampleGolf } from './golfPhysics';
import { sampleCockpit } from './golfCockpitSignals';

describe('shared cockpit signals', () => {
  it('reads actual engine RPM instead of an independent instrument clock', () => {
    for (const operation of ['idle', 'starting', 'acceleration', 'overrun'] as const) {
      const clock = { ...initialClock(operation), elapsed: 8 };
      expect(sampleCockpit(clock).rpm).toBe(sampleGolf(clock).rpm);
    }
    expect(sampleCockpit(initialClock('acceleration')).rpmAngle).toBe(0);
  });
  it('reads coolant temperature and retains it when an ECU fuse stops the engine', () => {
    const clock = { ...initialClock(), temperature: 117, openFuse: 'ecu' as const };
    const sample = sampleCockpit(clock);
    expect(sample.powered).toBe(true);
    expect(sample.rpm).toBe(0);
    expect(sample.temperature).toBe(117);
    expect(sample.hot).toBe(true);
    expect(sampleCockpit({ ...clock, temperature: 90 }).temperatureAngle).toBe(0);
  });
  it('parks needles and removes warning output with key off or no main supply', () => {
    for (const clock of [initialClock('off'), { ...initialClock('starting'), openFuse: 'main' as const, temperature: 120 }]) {
      const sample = sampleCockpit(clock);
      expect(sample.powered).toBe(false);
      expect(sample.rpm).toBe(0);
      expect(sample.temperature).toBeNull();
      expect(sample.hot).toBe(false);
      expect(sample.rpmAngle).toBeCloseTo(Math.PI * 2 / 3);
      expect(sample.temperatureAngle).toBeCloseTo(Math.PI * 2 / 3);
    }
  });
});