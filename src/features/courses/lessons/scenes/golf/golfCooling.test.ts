import { describe, expect, it } from 'vitest';
import { advanceCooling, COOLING_MODEL, initialCooling, sampleCooling, type CoolingInput } from './golfCooling';

const idle: CoolingInput = { temperature: 90, rpm: 780, running: true, powered: true, load: 0.09 };

describe('circuito termico didatico', () => {
  it('conserva energia entre motor, radiador e ambiente', () => {
    const initial = initialCooling();
    const result = advanceCooling(initial, idle, 60);
    const stored = (result.temperature - idle.temperature) * COOLING_MODEL.engineCapacityJK + (result.cooling.radiatorC - initial.radiatorC) * COOLING_MODEL.radiatorCapacityJK;
    expect(stored).toBeCloseTo(result.cooling.heatInputJ - result.cooling.heatRejectedJ, 5);
  });
  it('fecha radiador a frio e conserva vazao nos ramais', () => {
    const cold = sampleCooling(initialCooling(false), { ...idle, temperature: 20 });
    expect(cold.radiatorLpm).toBe(0);
    expect(cold.bypassLpm).toBeGreaterThan(0);
    expect(cold.pumpLpm).toBeCloseTo(cold.radiatorLpm + cold.bypassLpm + cold.heaterLpm);
    expect(sampleCooling(initialCooling(), { ...idle, temperature: 105 }).thermostat).toBe(1);
  });
  it('usa histerese e corta motor da ventoinha por fusivel ou falha', () => {
    const state = initialCooling();
    expect(sampleCooling(state, { ...idle, temperature: 103 }).fanPowered).toBe(true);
    expect(sampleCooling({ ...state, fanRequested: true }, { ...idle, temperature: 99 }).fanPowered).toBe(true);
    expect(sampleCooling({ ...state, fanRequested: true }, { ...idle, temperature: 94 }).fanPowered).toBe(false);
    expect(sampleCooling({ ...state, fanFuseOpen: true }, { ...idle, temperature: 110 }).fanPowered).toBe(false);
    expect(sampleCooling({ ...state, fault: 'fan' }, { ...idle, temperature: 110 }).fanPowered).toBe(false);
  });
  it('sem bomba ou com termostato fechado aquece mais que circuito integro', () => {
    const input = { ...idle, temperature: 95, rpm: 2000, load: 0.5 };
    const state = { ...initialCooling(), airflowKmh: 50 };
    const normal = advanceCooling(state, input, 300);
    for (const fault of ['pump', 'thermostat-closed'] as const) {
      const failed = advanceCooling({ ...state, fault }, input, 300);
      expect(failed.temperature).toBeGreaterThan(normal.temperature + 20);
      expect(sampleCooling(failed.cooling, { ...input, temperature: failed.temperature }).warning).toBe('overheat');
    }
  });
  it('ventoinha refrigera em parado e giro cessa sem alimentacao', () => {
    const input = { ...idle, temperature: 110 };
    const state = { ...initialCooling(), radiatorC: 95 };
    expect(advanceCooling(state, input, 180).temperature).toBeLessThan(advanceCooling({ ...state, fault: 'fan' }, input, 180).temperature);
    const off = advanceCooling(state, { ...input, rpm: 0, running: false, powered: false }, 30);
    expect(off.cooling.fanAngle).toBe(0);
    expect(off.cooling.flowLitres).toBe(0);
    expect(off.cooling.heatInputJ).toBe(0);
    expect(off.temperature).toBeLessThan(input.temperature);
  });
  it('termostato aberto atrasa aquecimento; aquecedor remove calor', () => {
    const cold = { ...idle, temperature: 20 };
    expect(advanceCooling({ ...initialCooling(false), fault: 'thermostat-open' }, cold, 300).temperature).toBeLessThan(advanceCooling(initialCooling(false), cold, 300).temperature);
    expect(advanceCooling({ ...initialCooling(), heater: true }, idle, 180).temperature).toBeLessThan(advanceCooling(initialCooling(), idle, 180).temperature);
  });
  it('e consistente com subdivisao de tempo e nao avanca com delta invalido', () => {
    const first = advanceCooling(initialCooling(), idle, 1);
    const second = advanceCooling(first.cooling, { ...idle, temperature: first.temperature }, 1);
    const whole = advanceCooling(initialCooling(), idle, 2);
    expect(second.temperature).toBeCloseTo(whole.temperature, 8);
    expect(second.cooling.radiatorC).toBeCloseTo(whole.cooling.radiatorC, 8);
    expect(advanceCooling(initialCooling(), idle, NaN).temperature).toBe(90);
  });
});