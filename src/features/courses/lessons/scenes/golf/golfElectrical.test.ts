import { describe, expect, it } from 'vitest';
import { electricalSupply } from './golfElectrical';
import { advanceClock, initialClock, sampleGolf } from './golfPhysics';

describe('Aula 5: distribuicao eletrica didatica', () => {
  it('mantem OBD permanente e desliga o rele principal sem chave', () => {
    expect(electricalSupply(false, false, null)).toEqual({ distribution: true, ecu: false, ignition: false, pump: false, diagnostics: true, mainRelay: false, sensor5V: 0 });
  });

  it('interrompe os ramos dependentes da protecao principal', () => {
    expect(electricalSupply(true, true, 'main')).toEqual({ distribution: false, ecu: false, ignition: false, pump: false, diagnostics: false, mainRelay: false, sensor5V: 0 });
  });

  it('retira 5 V e comandos quando a ECU perde alimentacao', () => {
    const supply = electricalSupply(true, true, 'ecu');
    expect(supply.ecu || supply.ignition || supply.pump || supply.mainRelay).toBe(false);
    expect(supply.sensor5V).toBe(0);
    expect(supply.diagnostics).toBe(true);
  });

  it('isola falhas da bomba, bobinas e tomada de diagnostico', () => {
    expect(electricalSupply(true, true, 'pump')).toMatchObject({ ecu: true, pump: false, ignition: true, diagnostics: true });
    expect(electricalSupply(true, true, 'ignition')).toMatchObject({ ecu: true, pump: true, ignition: false });
    expect(electricalSupply(true, true, 'diagnostics')).toMatchObject({ ecu: true, pump: true, ignition: true, diagnostics: false });
  });

  it('desliga a bomba ao terminar a solicitacao de pre-pressurizacao', () => {
    expect(electricalSupply(true, false, null)).toMatchObject({ ecu: true, pump: false, mainRelay: true });
    const primed = advanceClock(initialClock('key'), 2.5);
    expect(sampleGolf({ ...primed, openFuse: 'diagnostics' }).lowPressure).toBe(sampleGolf(primed).lowPressure);
    expect(sampleGolf({ ...primed, openFuse: 'ignition' }).lowPressure).toBe(sampleGolf(primed).lowPressure);
  });

  it('interrompe funcionamento e consumo com falha nos circuitos do motor', () => {
    for (const openFuse of ['main', 'ecu', 'pump', 'ignition'] as const) {
      const clock = { ...initialClock('cruise'), openFuse };
      const next = advanceClock(clock, 1);
      expect(sampleGolf(next).rpm).toBe(0);
      expect(next.angle).toBe(clock.angle);
      expect(next.fuel).toBe(clock.fuel);
      expect(next.nox).toBe(clock.nox);
      expect(sampleGolf(next).cylinders.every(cylinder => !cylinder.injecting && !cylinder.spark)).toBe(true);
    }
  });

  it('permite arranque sem combustao e preserva motor com OBD aberto', () => {
    const cranking = sampleGolf({ ...initialClock('starting'), openFuse: 'ecu' });
    expect(cranking.rpm).toBe(250);
    expect(cranking.running).toBe(false);
    expect(cranking.cylinders.every(cylinder => !cylinder.spark && !cylinder.injecting)).toBe(true);
    const diagnosticFault = sampleGolf({ ...initialClock(), openFuse: 'diagnostics' });
    expect(diagnosticFault.rpm).toBe(780);
    expect(diagnosticFault.electrical.diagnostics).toBe(false);
  });
});