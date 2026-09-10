import { describe, expect, it } from 'vitest';
import { electricalPotentials, electricalSupply, FUSE_NODES, measureVoltage } from './golfElectrical';
import { carrierToWorld, fuseMount, TEST_POINTS } from './golfService';
import { HIGH_PUMP_INLET, INJECTOR_FUEL_PORT, INJECTOR_ORIGIN, INJECTOR_ROTATION, RAIL_SENSOR_MOUNT, THROTTLE_INLET } from './golfMounts';
import { Vector3 } from 'three';
import { AIR_PATH, FUEL_PATH } from './golfAssembly';
import { engineToWorld } from './golfPhysics';

describe('Aula 5: tensao entre terminais', () => {
  it('respeita polaridade, referencia e pontas no mesmo no', () => {
    const potentials = electricalPotentials(true, null, 14.2);
    expect(measureVoltage(potentials, 'batteryPlus', 'ground')).toBe(14.2);
    expect(measureVoltage(potentials, 'ground', 'batteryPlus')).toBe(-14.2);
    expect(measureVoltage(potentials, 'ground', 'ground')).toBe(0);
    expect(measureVoltage(potentials, null, 'ground')).toBeNull();
  });
  it('mede os dois lados do fusivel, nao apenas o estado da carga', () => {
    for (const id of ['main', 'ecu', 'pump', 'ignition', 'diagnostics'] as const) {
      const [input, output] = FUSE_NODES[id];
      expect(measureVoltage(electricalPotentials(true, null, 12.6), input, output)).toBe(0);
      expect(measureVoltage(electricalPotentials(true, id, 12.6), input, output)).toBe(12.6);
    }
  });
  it('mantem B+ no fusivel da bomba apos o comando terminar', () => {
    expect(electricalSupply(true, false, null).pump).toBe(false);
    expect(electricalPotentials(true, null, 12.6).pumpFeed).toBe(12.6);
  });
  it('mede contato e bobina do rele separadamente', () => {
    const off = electricalPotentials(false, null, 12.6);
    expect(measureVoltage(off, 'ecuFeed', 'relay87')).toBe(12.6);
    expect(measureVoltage(off, 'relay86', 'relay85')).toBe(0);
    const on = electricalPotentials(true, null, 12.6);
    expect(measureVoltage(on, 'ecuFeed', 'relay87')).toBe(0);
    expect(measureVoltage(on, 'relay86', 'relay85')).toBe(12.6);
  });
  it('nao inventa potencial em trecho flutuante', () => {
    const isolated = electricalPotentials(false, 'ignition', 12.6);
    expect(isolated.relay87).toBeNull();
    expect(measureVoltage(isolated, 'relay87', 'ground')).toBeNull();
  });
  it('ancora terminais nas duas faces de teste dos fusiveis', () => {
    expect(new Set(TEST_POINTS.map(point => point.id)).size).toBe(TEST_POINTS.length);
    for (const id of ['main', 'ecu', 'pump', 'ignition', 'diagnostics'] as const) {
      const mount = fuseMount(id);
      const input = TEST_POINTS.find(point => point.id === `${id}-in`)!;
      const output = TEST_POINTS.find(point => point.id === `${id}-out`)!;
      expect(input.position).toEqual(carrierToWorld(mount.area, [mount.position[0] - 6, mount.position[1] + 29, mount.position[2]]));
      expect(new Vector3(...input.position).distanceTo(new Vector3(...output.position))).toBeCloseTo(12);
    }
  });
  it('termina linhas nos bocais e sensor na extremidade da galeria', () => {
    expect(AIR_PATH.at(-1)).toEqual(engineToWorld(THROTTLE_INLET));
    expect(FUEL_PATH.at(-1)).toEqual(engineToWorld(HIGH_PUMP_INLET));
    expect(RAIL_SENSOR_MOUNT).toEqual([132 - 155, 280, 128]);
    const inlet = new Vector3(0, 88, 0).applyQuaternion(INJECTOR_ROTATION).add(new Vector3(...INJECTOR_ORIGIN));
    expect(inlet.distanceTo(new Vector3(...INJECTOR_FUEL_PORT))).toBeLessThan(1e-10);
  });
});