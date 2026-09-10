import { describe, expect, it } from 'vitest';
import { advanceEgas } from './golfEgas';
import { advanceClock, initialClock, sampleGolf } from './golfPhysics';

describe('EGAS no motor existente', () => {
  it('preserva presets e comparacao, usa abertura real no modo manual', () => {
    const clock = initialClock('cruise');
    expect(sampleGolf(clock).throttle).toBe(0.85);
    const manual = { ...clock, egas: { ...clock.egas, enabled: true, pedal: 0.8, opening: 0.4 } };
    expect(sampleGolf(manual).throttle).toBe(0.4);
    expect(sampleGolf(manual).mode).toBe('homogeneous');
    expect(sampleGolf(manual, 'stratified').throttle).toBe(0.85);
    expect(sampleGolf(manual, 'homogeneous').throttle).toBe(0.3);
    expect(advanceClock(manual, 1).egas).toEqual(manual.egas);
  });
  it.each(['main', 'ecu'] as const)('fusivel %s remove alimentacao do atuador e referencia', openFuse => {
    const clock = { ...initialClock(), openFuse };
    const sample = sampleGolf(clock);
    expect(sample.electrical.ecu).toBe(false);
    const state = { ...clock.egas, enabled: true, pedal: 1, opening: 0.9 };
    expect(advanceEgas(state, sample.electrical.ecu, 3).opening).toBeCloseTo(0.06);
  });
  it('altera admissao sem criar alteracao artificial da rotacao ou fases', () => {
    const clock = initialClock();
    const closed = sampleGolf({ ...clock, egas: { ...clock.egas, enabled: true, opening: 0.06 } });
    const open = sampleGolf({ ...clock, egas: { ...clock.egas, enabled: true, opening: 0.94 } });
    expect(open.map).toBeGreaterThan(closed.map);
    expect(open.rpm).toBe(closed.rpm);
    expect(open.cylinders.map(cylinder => cylinder.pinY)).toEqual(closed.cylinders.map(cylinder => cylinder.pinY));
  });
});