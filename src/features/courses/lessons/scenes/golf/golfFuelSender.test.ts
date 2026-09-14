import { describe, expect, it } from 'vitest';
import { advanceFuelSender, decodeFuelVoltage, initialFuelSender, sampleFuelSender } from './golfFuelSender';

describe('didactic fuel sender circuit', () => {
  it('decodes level only from divider voltage throughout the range', () => {
    for (let step = 0; step <= 100; step += 1) {
      const level = step / 100;
      const sample = sampleFuelSender(initialFuelSender(), level, true);
      expect(sample.decoded).toBeCloseTo(level, 10);
      expect(sample.currentMa).toBeCloseTo(sample.voltage / sample.senderOhms * 1000);
    }
    expect(sampleFuelSender(initialFuelSender(), 0, true).senderOhms).toBe(280);
    expect(sampleFuelSender(initialFuelSender(), 1, true).senderOhms).toBe(40);
  });
  it('detects either open wire and a short to ground', () => {
    for (const fault of ['signal-open', 'ground-open', 'short-ground'] as const) {
      const state = { ...initialFuelSender(), fault };
      const sample = sampleFuelSender(state, 0.7, true);
      expect(sample.decoded).toBeNull();
      expect(sample.faultLamp).toBe(true);
      expect(sample.reserveLamp).toBe(false);
      expect(sample.voltage).toBe(fault === 'short-ground' ? 0 : 5);
      expect(advanceFuelSender(state, 0.7, true, 10).indicated).toBeLessThan(0.001);
    }
  });
  it('does not magically diagnose a plausible stuck float', () => {
    const state = { ...initialFuelSender(0.4), fault: 'float-stuck' as const };
    const sample = sampleFuelSender(state, 0.9, true);
    expect(sample.floatLevel).toBe(0.4);
    expect(sample.decoded).toBeCloseTo(0.4);
    expect(sample.faultLamp).toBe(false);
  });
  it('cuts reference and lamps without changing passive sender resistance', () => {
    const state = initialFuelSender(0.1);
    for (const sample of [sampleFuelSender(state, 0.1, false), sampleFuelSender({ ...state, fuseOpen: true }, 0.1, true)]) {
      expect(sample.voltage).toBe(0);
      expect(sample.currentMa).toBe(0);
      expect(sample.senderOhms).toBe(256);
      expect(sample.reserveLamp).toBe(false);
      expect(sample.faultLamp).toBe(false);
    }
  });
  it('filters the needle and converges equally with subdivided time', () => {
    const state = initialFuelSender(0);
    const first = advanceFuelSender(state, 1, true, 0.2);
    expect(first.indicated).toBeGreaterThan(0);
    expect(first.indicated).toBeLessThan(1);
    const split = advanceFuelSender(first, 1, true, 0.8);
    expect(split.indicated).toBeCloseTo(advanceFuelSender(state, 1, true, 1).indicated, 10);
  });
  it('uses hysteresis for reserve and suppresses it on invalid signal', () => {
    const low = advanceFuelSender(initialFuelSender(0.1), 0.1, true, 10);
    expect(low.reserve).toBe(true);
    expect(advanceFuelSender(low, 0.14, true, 10).reserve).toBe(true);
    expect(advanceFuelSender(low, 0.2, true, 10).reserve).toBe(false);
    expect(sampleFuelSender({ ...low, fault: 'signal-open' }, 0.1, true).reserveLamp).toBe(false);
  });
  it('clamps level input and rejects invalid voltage or time', () => {
    expect(sampleFuelSender(initialFuelSender(), 2, true).floatLevel).toBe(1);
    expect(sampleFuelSender(initialFuelSender(), -1, true).floatLevel).toBe(0);
    for (const voltage of [0, 5, NaN, Infinity]) expect(decodeFuelVoltage(voltage)).toBeNull();
    const state = initialFuelSender();
    expect(advanceFuelSender(state, 1, true, NaN)).toBe(state);
  });
});