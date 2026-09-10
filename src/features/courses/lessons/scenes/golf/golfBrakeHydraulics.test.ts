import { describe, expect, it } from 'vitest';
import { advanceBrakes, BRAKE_HYDRAULICS, initialBrakes, launchBrakeBench, sampleBrakes } from './golfBrakeHydraulics';

describe('pedal e circuito de freio didatico', () => {
  it('nao aplica torque antes de fechar a folga estimada das pastilhas', () => {
    const takeup = sampleBrakes({ ...initialBrakes(), primaryBar: 1, secondaryBar: 1 });
    expect(takeup.wheels.every(wheel => wheel.pistonForceN > 0 && wheel.padTravelMm === 0.35 && wheel.clampN === 0 && wheel.torqueNm === 0)).toBe(true);
  });

  it('nao gera pressao sem pedal; libera pressao e pastilhas ao soltar', () => {
    expect(sampleBrakes(advanceBrakes(initialBrakes(), 1)).wheels.every(wheel => wheel.clampN === 0)).toBe(true);
    const applied = advanceBrakes({ ...initialBrakes(), pedal: 0.6 }, 1);
    expect(applied.primaryBar).toBeGreaterThan(50);
    expect(sampleBrakes(applied).wheels.every(wheel => wheel.padTravelMm === 0.7)).toBe(true);
    const released = advanceBrakes({ ...applied, pedal: 0 }, 2);
    expect(sampleBrakes(released).wheels.every(wheel => wheel.torqueNm === 0 && wheel.padTravelMm === 0)).toBe(true);
  });

  it('relaciona forca, area do mestre e ganho do servo, mantendo freio sem assistencia', () => {
    const manual = sampleBrakes({ ...initialBrakes(), pedal: 1, assisted: false });
    const assisted = sampleBrakes({ ...initialBrakes(), pedal: 1 });
    expect(manual.targetBar).toBeCloseTo(500 * 4 / (Math.PI * (23.8 / 2000) ** 2) / 100000);
    expect(assisted.targetBar / manual.targetBar).toBeCloseTo(3.5);
    expect(manual.targetBar).toBeGreaterThan(0);
    expect(sampleBrakes({ ...initialBrakes(), pedal: 0.02 }).targetBar).toBe(0);
  });

  it.each(['primary', 'secondary'] as const)('isola vazamento no circuito %s e preserva a diagonal restante', fault => {
    const intact = advanceBrakes({ ...initialBrakes(), pedal: 0.5 }, 1);
    const failed = advanceBrakes({ ...intact, fault }, 1);
    const wheels = sampleBrakes(failed).wheels;
    expect(wheels.filter(wheel => wheel.circuit === fault).every(wheel => wheel.pressureBar === 0 && wheel.torqueNm === 0)).toBe(true);
    expect(wheels.filter(wheel => wheel.circuit !== fault).every(wheel => wheel.pressureBar > 50)).toBe(true);
    expect(wheels.filter(wheel => wheel.circuit === 'primary').map(wheel => wheel.id).sort()).toEqual(['front-left', 'rear-right']);
    expect(sampleBrakes(failed).masterTravelMm).toBeGreaterThan(sampleBrakes(intact).masterTravelMm);
  });

  it('converte energia da bancada em frenagem sem inverter o movimento', () => {
    const launch = launchBrakeBench({ ...initialBrakes(), pedal: 1 });
    const stopped = advanceBrakes(launch, 10);
    expect(stopped.speedMps).toBe(0);
    expect(stopped.distanceM).toBeGreaterThan(0);
    expect(stopped.wheelAngle).toBeCloseTo(stopped.distanceM / BRAKE_HYDRAULICS.tyreRadiusM);
    expect(stopped.dissipatedJ).toBeCloseTo(BRAKE_HYDRAULICS.massKg * launch.speedMps ** 2 / 2);
    expect(advanceBrakes(stopped, 10)).toEqual(stopped);
  });

  it('sem freio conserva velocidade; vazamento aumenta a distancia de parada', () => {
    const launch = launchBrakeBench(initialBrakes());
    expect(advanceBrakes(launch, 1).speedMps).toBe(launch.speedMps);
    const intact = advanceBrakes({ ...launch, pedal: 0.5 }, 10);
    const failed = advanceBrakes({ ...launch, pedal: 0.5, fault: 'primary' }, 10);
    expect(failed.speedMps).toBe(0);
    expect(failed.distanceM).toBeGreaterThan(intact.distanceM);
  });

  it('mantem resultado com subdivisao temporal e rejeita entrada nao finita', () => {
    const start = launchBrakeBench({ ...initialBrakes(), pedal: 0.4 });
    const full = advanceBrakes(start, 1);
    const split = Array.from({ length: 100 }).reduce<typeof start>(state => advanceBrakes(state, 0.01), start);
    expect(full.speedMps).toBeCloseTo(split.speedMps, 8);
    expect(full.distanceM).toBeCloseTo(split.distanceM, 8);
    expect(advanceBrakes(start, NaN)).toBe(start);
    expect(sampleBrakes({ ...start, pedal: Infinity }).targetBar).toBe(0);
  });
});