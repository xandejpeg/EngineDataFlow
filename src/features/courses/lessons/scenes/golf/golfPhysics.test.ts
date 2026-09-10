import { describe, expect, it } from 'vitest';
import { advanceClock, camState, crossings, cylinderAt, engineToWorld, GOLF, initialClock, pistonAt, pulseDegrees, sampleGolf, valveLift, wrap } from './golfPhysics';
import { exhaustLift, intakeLift, wrapCycle } from '../enginePhysics';
import { FUEL_LENGTH_MM, GOLF_PARTS } from './golfAssembly';
import { COURSE_LESSONS } from '../../../../../data/courseLessons.pt-BR';

describe('Aula 5: contrato mecanico', () => {
  it('mantem a referencia da Aula 3 em todos os angulos inteiros', () => {
    const phases = [0, 180, 540, 360];
    for (let theta = 0; theta < 720; theta++) {
      phases.forEach((phase, index) => expect(wrap(theta - GOLF.firingOffsets[index] + 360)).toBe(wrapCycle(theta + 360 + phase)));
    }
    const sample = sampleGolf(initialClock());
    expect(sample.cylinders.map(cylinder => cylinder.state)).toEqual(['BALANCO', 'ESCAPE', 'ADMISSAO', 'CRUZAMENTO']);
    expect(phases.map(phase => camState(intakeLift(360 + phase), exhaustLift(360 + phase)))).toEqual(sample.cylinders.map(cylinder => cylinder.state));
  });

  it('mede o curso e a distancia constante entre os centros da biela', () => {
    expect(pistonAt(0).crownY).toBeCloseTo(222.9);
    expect(pistonAt(180).crownY).toBeCloseTo(130.1);
    expect(pistonAt(0).crownY - pistonAt(180).crownY).toBeCloseTo(92.8);
    for (let angle = 0; angle < 720; angle++) {
      const piston = pistonAt(angle);
      expect(Math.hypot(piston.crankZ, piston.pinY - piston.crankY)).toBeCloseTo(144);
    }
  });

  it('fecha as valvulas sem salto e abre no meio da janela', () => {
    expect(valveLift(355, 355, 590, 10)).toBe(0);
    expect(valveLift(472.5, 355, 590, 10)).toBeCloseTo(10);
    expect(valveLift(590, 355, 590, 10)).toBe(0);
    expect(valveLift(589.999, 355, 590, 10)).toBeLessThan(0.000001);
    expect(valveLift(360, 355, 590, 10)).toBeGreaterThan(0);
  });

  it('preserva os pares de pistoes e a ordem 1-3-4-2', () => {
    expect(([0, 180, 360, 540] as const).map(theta => GOLF.firingOffsets.indexOf(theta))).toEqual([0, 2, 3, 1]);
    for (let angle = 0; angle < 720; angle += 3) {
      const cylinders = sampleGolf({ ...initialClock(), angle }).cylinders;
      expect(cylinders[0].pinY).toBeCloseTo(cylinders[3].pinY);
      expect(cylinders[1].pinY).toBeCloseTo(cylinders[2].pinY);
    }
    expect(pulseDegrees(3, 2000)).toBe(36);
  });

  it('conta eventos mesmo com frames que atravessam varios ciclos', () => {
    expect(crossings(0, 720, 0, 240)).toBe(3);
    expect(GOLF.firingOffsets.reduce<number>((sum, offset) => sum + crossings(0, 720, wrap(offset - 10), 720), 0)).toBe(4);
    expect(crossings(0, 720, 0, 720)).toBe(1);
    expect(Array.from({ length: 58 }, (_, tooth) => crossings(0, 720, tooth * 6, 360)).reduce((sum, value) => sum + value, 0)).toBe(116);
    expect(crossings(0, 7200, 0, 240)).toBe(30);
  });

  it('troca injecao sem alterar cinematica e limita o pulso a janela', () => {
    const homogeneous = cylinderAt(400, 0, 2000, 'homogeneous', 28, 2.5);
    const stratified = cylinderAt(400, 0, 2000, 'stratified', 28, 2.5);
    expect(homogeneous.injecting).toBe(true);
    expect(stratified.injecting).toBe(false);
    expect(homogeneous.pinY).toBe(stratified.pinY);
    expect(homogeneous.intake).toBe(stratified.intake);
    expect(stratified.injectionEnd).toBe(670);
    expect(cylinderAt(640, 0, 4000, 'stratified', 16, 2.5).injectionEnd).toBe(680);
  });

  it('mantem cilindro 1 a direita e admissao para frente', () => {
    expect([0, 88, 176, 264].map(axis => engineToWorld([axis, 0, 0])[0])).toEqual([300, 212, 124, 36]);
    expect(engineToWorld([0, 0, 100])[2]).toBeLessThan(-70);
    expect(engineToWorld([0, 250, 0])[2]).toBeGreaterThan(-70);
    expect(GOLF.wheelRadius).toBeCloseTo(317.15);
  });
});

describe('Aula 5: relogio unico e estados', () => {
  it('reutiliza amostras sem misturar modos, falhas ou instantes', () => {
    const clock = Object.freeze(initialClock('cruise'));
    const sample = sampleGolf(clock);
    expect(sampleGolf(clock)).toBe(sample);
    const homogeneous = sampleGolf(clock, 'homogeneous');
    expect(homogeneous).not.toBe(sample);
    expect(homogeneous.mode).toBe('homogeneous');
    expect(sampleGolf(clock, 'homogeneous')).toBe(homogeneous);
    expect(sampleGolf(clock).mode).toBe('stratified');
    expect(sampleGolf({ ...clock, openFuse: 'ecu' }).running).toBe(false);
    expect(sampleGolf(advanceClock(clock, 0.01)).theta).not.toBe(sample.theta);
    expect(sampleGolf(clock)).toBe(sample);
    expect(sample.running).toBe(true);
    expect(clock.angle).toBe(0);
  });

  it('mantem as cinco partes na Aula 5 e acrescenta o grupo 28 aos 27 originais', () => {
    const lessons = COURSE_LESSONS['injecao-eletronica-40h'];
    const lesson = lessons.find(item => item.id === 'aula-5-motor-completo');
    expect(lesson?.numero).toBe(5);
    expect(lesson?.pages.map(page => page.id)).toEqual(['p1', 'p2', 'p3', 'p4', 'p5']);
    expect(lessons.filter(item => !item.rascunho && item.numero === 5)).toHaveLength(1);
    expect(GOLF_PARTS.map(part => part.id)).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
    expect(FUEL_LENGTH_MM).toBeGreaterThan(2500);
    expect(FUEL_LENGTH_MM).toBeLessThan(2900);
  });

  it('mantem folga vertical conservadora entre pistao e discos das valvulas', () => {
    for (let angle = 0; angle < 720; angle++) {
      for (const camAdvance of [0, 20, 40]) {
        const cylinder = cylinderAt(angle, 0, 2000, 'homogeneous', 28, 2, camAdvance);
        const diskLowest = 246 - Math.max(cylinder.intake, cylinder.exhaust) * Math.cos(20 * Math.PI / 180) - 15 * Math.sin(20 * Math.PI / 180);
        expect(diskLowest).toBeGreaterThan(cylinder.crownY);
      }
    }
  });

  it('pressuriza por dois segundos mesmo com theta parado', () => {
    const clock = initialClock('key');
    expect(sampleGolf(advanceClock(clock, 1.99)).pumpLow).toBe(true);
    expect(sampleGolf(advanceClock(clock, 2)).pumpLow).toBe(false);
    expect(advanceClock(clock, 2).angle).toBe(0);
  });

  it('encerra a regeneracao em tres segundos e preserva o angulo acumulado', () => {
    const clock = initialClock('regeneration');
    const next = advanceClock(clock, 3.5);
    expect(next.operation).toBe('cruise');
    expect(next.elapsed).toBeCloseTo(0.5);
    expect(next.angle).toBeCloseTo(3.5 * 6 * 2000);
    expect(next.nox).toBeLessThan(clock.nox);
  });

  it('nao injeta na desaceleracao ou com motor parado', () => {
    for (const operation of ['off', 'key', 'overrun'] as const) {
      expect(sampleGolf({ ...initialClock(operation), angle: 385 }).cylinders.every(cylinder => !cylinder.injecting && !cylinder.spark)).toBe(true);
    }
  });

  it('integra desaceleracao independentemente da divisao dos frames', () => {
    const clock = initialClock('overrun');
    const whole = advanceClock(clock, 15);
    const split = advanceClock(advanceClock(clock, 5), 10);
    expect(whole.angle).toBeCloseTo(split.angle);
    expect(sampleGolf(whole).rpm).toBe(780);
  });

  it('pausa tempo, temperatura e combustivel sem relogios externos', () => {
    const clock = initialClock('starting');
    expect(advanceClock(clock, 0)).toEqual(clock);
    expect(sampleGolf(clock).volts).toBe(9.5);
    expect(sampleGolf(initialClock()).volts).toBe(14.2);
  });
});