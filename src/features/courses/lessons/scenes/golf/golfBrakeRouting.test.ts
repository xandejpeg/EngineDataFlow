import { describe, expect, it } from 'vitest';
import { Euler, Vector3 } from 'three';
import { brakeGeometry } from './golfBrakeGeometry';
import { BRAKE_ABS_INPUTS, BRAKE_CALIPER_ANGLE, BRAKE_MASTER_LINES, BRAKE_MASTER_PORTS, BRAKE_RESERVOIR_LINES, BRAKE_WHEEL_LINES } from './golfBrakeRouting';
import { VEHICLE_WHEELS } from './golfVehicleGeometry';

describe('conexoes de freio', () => {
  it('liga duas saidas do mestre ao bloco e quatro saidas distintas as pincas', () => {
    BRAKE_MASTER_LINES.forEach((line, index) => {
      expect(line[0]).toEqual(BRAKE_MASTER_PORTS[index]);
      expect(line.at(-1)).toEqual(BRAKE_ABS_INPUTS[index]);
      expect(BRAKE_RESERVOIR_LINES[index].at(-1)).toEqual(BRAKE_MASTER_PORTS[index]);
    });
    expect(new Set(BRAKE_WHEEL_LINES.map(line => line.outlet.join(','))).size).toBe(4);
    BRAKE_WHEEL_LINES.forEach(line => {
      expect(line.rigid[0]).toEqual(line.outlet);
      expect(line.rigid.at(-1)).toEqual(line.hose[0]);
      expect(line.hose.at(-1)).toEqual(line.inlet);
    });
  });

  it('termina nas entradas reais de ambas as pincas espelhadas, sem usar o ponto antigo', () => {
    VEHICLE_WHEELS.forEach((wheel, index) => {
      const inlet = new Vector3(-48, brakeGeometry(wheel.axle).padRadius, 0)
        .applyEuler(new Euler(BRAKE_CALIPER_ANGLE, 0, 0))
        .applyEuler(new Euler(0, wheel.side < 0 ? Math.PI : 0, 0))
        .add(new Vector3(...wheel.hub));
      expect(inlet.distanceTo(new Vector3(...BRAKE_WHEEL_LINES[index].inlet))).toBeLessThan(0.000001);
    });
  });
});