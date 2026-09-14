import { describe, expect, it } from 'vitest';
import { advanceWipers, initialWipers, sampleWipers, type WiperState } from './golfWipers';

describe('didactic front wiper controller', () => {
  it('starts parked and distinguishes low and high speeds', () => {
    expect(sampleWipers(initialWipers(), true).motorPowered).toBe(false);
    expect(advanceWipers({ ...initialWipers(), mode: 'low' }, true, 6).cycles).toBe(4);
    expect(advanceWipers({ ...initialWipers(), mode: 'high' }, true, 6).cycles).toBe(6);
  });
  it('finishes the current sweep after the stalk is switched off', () => {
    const active = advanceWipers({ ...initialWipers(), mode: 'low' }, true, 0.6);
    const parking = { ...active, mode: 'off' as const };
    expect(sampleWipers(parking, true).parking).toBe(true);
    const stopped = advanceWipers(parking, true, 3);
    expect(stopped.phase).toBe(0);
    expect(stopped.cycles).toBe(1);
    expect(sampleWipers(stopped, true).motorPowered).toBe(false);
  });
  it('waits at park between intermittent sweeps', () => {
    const first = advanceWipers({ ...initialWipers(), mode: 'intermittent' }, true, 1.5);
    expect(first.phase).toBe(0);
    expect(first.interval).toBeCloseTo(4);
    expect(advanceWipers(first, true, 3).cycles).toBe(1);
    expect(advanceWipers(first, true, 5.5).cycles).toBe(2);
  });
  it('cuts power immediately and resumes parking when supply returns', () => {
    const moving = advanceWipers({ ...initialWipers(), mode: 'low' }, true, 0.5);
    for (const state of [{ ...moving, fuseOpen: true }, { ...moving, fault: 'motor' as const }]) {
      const stopped = advanceWipers(state, true, 5);
      expect(stopped.phase).toBe(moving.phase);
      expect(sampleWipers(stopped, true).motorPowered).toBe(false);
    }
    expect(advanceWipers(moving, false, 5).phase).toBe(moving.phase);
    const off = { ...moving, mode: 'off' as const };
    expect(advanceWipers(off, true, 2).phase).toBe(0);
  });
  it('disconnects arms without stopping the motor', () => {
    const moving = advanceWipers({ ...initialWipers(), mode: 'low' }, true, 0.4);
    const broken = advanceWipers({ ...moving, fault: 'linkage' }, true, 0.5);
    expect(broken.armPhase).toBe(moving.armPhase);
    expect(broken.phase).not.toBe(moving.phase);
    expect(sampleWipers(broken, true).motorPowered).toBe(true);
  });
  it('keeps parking command active when park contact fails open', () => {
    const failed = advanceWipers({ ...initialWipers(), fault: 'park' }, true, 3);
    expect(failed.cycles).toBe(2);
    expect(sampleWipers(failed, true).motorPowered).toBe(true);
  });
  it('washes then completes two sweep boundaries after release', () => {
    const washing = advanceWipers({ ...initialWipers(), washing: true }, true, 0.4);
    expect(sampleWipers(washing, true).washerPowered).toBe(true);
    const released = advanceWipers({ ...washing, washing: false }, true, 5);
    expect(released.cycles).toBe(2);
    expect(released.afterWash).toBe(0);
    expect(released.phase).toBe(0);
  });
  it('keeps the sweep bounded and subdivided integration consistent', () => {
    const initial = { ...initialWipers(), mode: 'low' as const };
    let split: WiperState = initial;
    for (let step = 0; step < 100; step += 1) {
      split = advanceWipers(split, true, 0.03);
      const sweep = sampleWipers(split, true).sweep;
      expect(sweep).toBeGreaterThanOrEqual(-1e-8);
      expect(sweep).toBeLessThanOrEqual(1.3);
    }
    const whole = advanceWipers(initial, true, 3);
    expect(split.phase).toBeCloseTo(whole.phase);
    expect(split.cycles).toBe(whole.cycles);
    expect(advanceWipers(initial, true, NaN)).toBe(initial);
  });
});