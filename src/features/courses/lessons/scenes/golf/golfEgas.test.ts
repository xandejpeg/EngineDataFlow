import { describe, expect, it } from 'vitest';
import { advanceEgas, EGAS_MODEL, initialEgas, sampleEgas } from './golfEgas';

describe('EGAS didatico', () => {
  it('gera duas pistas proporcionais a partir do pedal e referencia', () => {
    for (const pedal of [0, 0.25, 0.5, 1]) {
      const sample = sampleEgas({ ...initialEgas(), pedal }, true);
      expect(sample.referenceV).toBe(5);
      expect(sample.signal1V).toBeCloseTo(0.5 + 4 * pedal);
      expect(sample.signal2V * 2).toBeCloseTo(sample.signal1V);
      expect(sample.plausible).toBe(true);
    }
  });
  it('move gradualmente e retorna ao soltar sem ultrapassar o comando', () => {
    const state = { ...initialEgas(), enabled: true, pedal: 1 };
    const moving = advanceEgas(state, true, 0.1);
    expect(moving.opening).toBeGreaterThan(state.opening);
    expect(moving.opening).toBeLessThan(0.94);
    const open = advanceEgas(moving, true, 3);
    expect(open.opening).toBeCloseTo(0.94);
    expect(advanceEgas({ ...open, pedal: 0 }, true, 3).opening).toBeCloseTo(0.06);
  });
  it.each(['pedal-signal', 'reference', 'motor-wire', 'position-signal'] as const)('inibe comando com falha %s', fault => {
    const state = { ...initialEgas(), enabled: true, pedal: 1, opening: 0.9, fault };
    const sample = sampleEgas(state, true);
    expect(sample.allowed).toBe(false);
    expect(sample.motorCommand).toBe(0);
    expect(advanceEgas(state, true, 3).opening).toBeCloseTo(EGAS_MODEL.restOpening);
  });
  it('perde referencia e comando sem ECU mas preserva valor mecanico do pedal', () => {
    const state = { ...initialEgas(), enabled: true, pedal: 1, opening: 0.9 };
    const sample = sampleEgas(state, false);
    expect(sample.pedal).toBe(1);
    expect(sample.referenceV).toBe(0);
    expect(sample.signal1V).toBe(0);
    expect(sample.signal2V).toBe(0);
    expect(sample.motorPowered).toBe(false);
    expect(advanceEgas(state, false, 3).opening).toBeCloseTo(0.06);
  });
  it('preserva modo automatico e independe da subdivisao do tempo', () => {
    const disabled = initialEgas();
    expect(advanceEgas(disabled, true, 1)).toBe(disabled);
    const state = { ...disabled, enabled: true, pedal: 0.7 };
    expect(advanceEgas(advanceEgas(state, true, 0.5), true, 0.5).opening).toBeCloseTo(advanceEgas(state, true, 1).opening, 10);
    expect(advanceEgas(state, true, NaN)).toBe(state);
    expect(sampleEgas({ ...state, pedal: NaN }, true).pedal).toBe(0);
  });
});