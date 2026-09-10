import { describe, expect, it } from 'vitest';
import { Euler, Vector3 } from 'three';
import { EGAS_ECU_PLUG, EGAS_PEDAL_PLUG, EGAS_THROTTLE_ORIGIN, EGAS_THROTTLE_PLUG, EGAS_WIRES } from './golfEgasGeometry';
import { engineToWorld } from './golfPhysics';

describe('chicote EGAS no carro', () => {
  it('termina no conector da TBI considerando ambas as rotacoes', () => {
    const local = new Vector3(92, 0, 0).applyEuler(new Euler(Math.PI / 2, 0, 0)).add(new Vector3(...EGAS_THROTTLE_ORIGIN));
    expect(engineToWorld(local.toArray() as [number, number, number])).toEqual(EGAS_THROTTLE_PLUG);
  });
  it('tem seis condutores por conector e nenhuma ponta fora dos envelopes', () => {
    expect(new Set(EGAS_WIRES.map(wire => wire.id)).size).toBe(12);
    EGAS_WIRES.slice(0, 6).forEach(wire => {
      expect(new Vector3(...wire.points[0]).distanceTo(new Vector3(...EGAS_PEDAL_PLUG))).toBeLessThanOrEqual(15);
      expect(new Vector3(...wire.points.at(-1)!).distanceTo(new Vector3(...EGAS_ECU_PLUG))).toBeLessThanOrEqual(15);
    });
    EGAS_WIRES.slice(6).forEach(wire => {
      expect(new Vector3(...wire.points[0]).distanceTo(new Vector3(...EGAS_ECU_PLUG))).toBeLessThanOrEqual(45);
      expect(new Vector3(...wire.points.at(-1)!).distanceTo(new Vector3(...EGAS_THROTTLE_PLUG))).toBeLessThanOrEqual(15);
    });
  });
});