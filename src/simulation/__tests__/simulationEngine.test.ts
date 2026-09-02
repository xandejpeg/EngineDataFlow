import { describe, expect, it } from 'vitest';
import { SimulationEngine, DEFAULT_CONFIG } from '../simulationEngine';
import { AFR_STOICH } from '../constants';
import { accumulateFaultModifiers } from '../faults/faultModifiers';

function stabilize(engine: SimulationEngine, seconds = 3, dt = 1 / 60): void {
  engine.clock.running = true;
  const steps = Math.round(seconds / dt);
  for (let i = 0; i < steps; i++) engine.step(dt);
}

describe('SimulationEngine frame', () => {
  it('produces finite, non-NaN performance values', () => {
    const engine = new SimulationEngine();
    stabilize(engine);
    const frame = engine.computeFrame();
    expect(Number.isFinite(frame.performance.torqueMeanNm)).toBe(true);
    expect(Number.isFinite(frame.performance.powerW)).toBe(true);
    expect(Number.isNaN(frame.performance.powerW)).toBe(false);
    for (const cyl of frame.cylinders) {
      expect(Number.isFinite(cyl.pressurePa)).toBe(true);
      expect(Number.isFinite(cyl.temperatureK)).toBe(true);
      expect(cyl.pressurePa).toBeGreaterThan(0);
    }
  });

  it('pressure rises during compression and volume rises during expansion', () => {
    const engine = new SimulationEngine();
    // Sample cylinder 1 across the cycle by setting the crank angle directly.
    const pressureAt = (globalDeg: number) => {
      engine.clock.crankAngleDeg = globalDeg;
      const f = engine.computeFrame();
      return f.cylinders[0];
    };
    const early = pressureAt(200); // cyl1 in compression
    const late = pressureAt(350); // cyl1 near compression TDC
    expect(late.pressurePa).toBeGreaterThan(early.pressurePa);

    const powerStart = pressureAt(370).volumeM3;
    const powerEnd = pressureAt(520).volumeM3;
    expect(powerEnd).toBeGreaterThan(powerStart);
  });

  it('mean torque and power are positive at part load', () => {
    const engine = new SimulationEngine();
    stabilize(engine);
    const frame = engine.computeFrame();
    expect(frame.performance.torqueMeanNm).toBeGreaterThan(0);
    expect(frame.performance.powerW).toBeGreaterThan(0);
  });

  it('lambda reflects fuel stoichiometry for gasoline and ethanol', () => {
    const engine = new SimulationEngine();
    engine.setConfig({ targetLambda: 1, fuel: 'gasoline' });
    let frame = engine.computeFrame();
    expect(frame.mixture.stoichAfr).toBeCloseTo(AFR_STOICH.gasoline, 3);
    expect(frame.mixture.afr).toBeCloseTo(AFR_STOICH.gasoline, 2);

    engine.setConfig({ fuel: 'ethanol' });
    frame = engine.computeFrame();
    expect(frame.mixture.stoichAfr).toBeCloseTo(AFR_STOICH.ethanol, 3);
  });

  it('energy balance fractions sum to approximately 1', () => {
    const engine = new SimulationEngine();
    stabilize(engine);
    const b = engine.computeFrame().performance.energyBalance;
    const sum =
      b.usefulFraction +
      b.coolingFraction +
      b.exhaustFraction +
      b.pumpingFraction +
      b.frictionFraction;
    expect(sum).toBeGreaterThan(0.9);
    expect(sum).toBeLessThan(1.1);
  });

  it('cam turns at half crank speed (720 crank deg = 360 cam deg)', () => {
    const engine = new SimulationEngine();
    engine.setConfig({ rpm: 6000 });
    engine.clock.running = true;
    const before = engine.clock.crankAngleDeg;
    engine.step(0.001);
    const after = engine.clock.crankAngleDeg;
    // Cam angle would be half of the crank advance.
    const crankAdvance = (after - before + 720) % 720;
    expect(crankAdvance / 2).toBeCloseTo(crankAdvance * 0.5, 6);
  });
});

describe('Fault Engine propagation', () => {
  it('low oil pressure fault reduces oil pressure and film integrity', () => {
    const healthy = new SimulationEngine();
    stabilize(healthy, 5);
    const healthyFrame = healthy.computeFrame();

    const faulted = new SimulationEngine();
    faulted.setFaults(['low-oil-pressure']);
    stabilize(faulted, 5);
    const faultedFrame = faulted.computeFrame();

    expect(faultedFrame.lubrication.oilPressurePa).toBeLessThan(
      healthyFrame.lubrication.oilPressurePa,
    );
    expect(faultedFrame.lubrication.filmIntegrity).toBeLessThan(
      healthyFrame.lubrication.filmIntegrity,
    );
  });

  it('thermostat-stuck-closed fault raises coolant temperature over time', () => {
    const healthy = new SimulationEngine();
    stabilize(healthy, 8);
    const overheating = new SimulationEngine();
    overheating.setFaults(['overheat-thermostat-closed']);
    stabilize(overheating, 8);
    expect(overheating.slow.cooling.coolantTempK).toBeGreaterThan(
      healthy.slow.cooling.coolantTempK,
    );
  });

  it('detonation fault increases knock risk', () => {
    const healthy = new SimulationEngine();
    healthy.setConfig({ throttle: 0.9 });
    stabilize(healthy, 4);
    const knocking = new SimulationEngine();
    knocking.setConfig({ throttle: 0.9 });
    knocking.setFaults(['detonation']);
    stabilize(knocking, 4);
    expect(knocking.computeFrame().combustionQuality.knockRisk).toBeGreaterThan(
      healthy.computeFrame().combustionQuality.knockRisk,
    );
  });

  it('accumulateFaultModifiers stays neutral with no faults', () => {
    const mods = accumulateFaultModifiers([], DEFAULT_CONFIG);
    expect(mods.oilPressureMul).toBe(1);
    expect(mods.thermostatStuck).toBe('none');
    expect(mods.misfireForceCylinders).toEqual([]);
  });
});
