import { describe, expect, it } from 'vitest';
import { advanceClock, advanceCoolingClock, coolingSample, initialClock, sampleGolf } from './golfPhysics';

describe('arrefecimento integrado', () => {
  it('usa temperatura compartilhada sem mudar angulo no ensaio termico', () => {
    const clock = initialClock('idle');
    const next = advanceCoolingClock(clock, 60);
    expect(next.temperature).not.toBe(clock.temperature);
    expect(next.angle).toBe(clock.angle);
    expect(next.egas).toEqual(clock.egas);
    expect(next.cooling.elapsed).toBeCloseTo(60);
  });
  it('separa escala lenta do motor e tempo termico real', () => {
    const next = advanceClock(initialClock(), 0.01, 1);
    expect(next.cooling.elapsed).toBeCloseTo(1);
    expect(next.elapsed).toBeCloseTo(0.01);
  });
  it('bomba acompanha rotacao, fan depende da ECU e corte nao adiciona combustao', () => {
    const clock = { ...initialClock(), temperature: 110 };
    expect(coolingSample(clock).fanPowered).toBe(true);
    expect(coolingSample({ ...clock, openFuse: 'ecu' }).fanPowered).toBe(false);
    expect(coolingSample(initialClock('off')).pumpLpm).toBe(0);
    expect(coolingSample(initialClock('overrun')).heatInputW).toBe(0);
    expect(sampleGolf(clock).rpm).toBe(780);
  });
});