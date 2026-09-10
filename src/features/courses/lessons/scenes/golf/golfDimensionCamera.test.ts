import { PerspectiveCamera, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { dimensionCameraFrame } from './golfDimensionCamera';
import { VEHICLE_WHEELS, wheelDimension } from './golfVehicleGeometry';

describe('Golf: enquadramento dimensional por roda', () => {
  it('mantem marcos, cota e margem do rotulo em desktop e celular', () => {
    for (const [width, height] of [[1000, 580], [320, 402], [390, 402]]) for (const wheel of VEHICLE_WHEELS) {
      const frame = dimensionCameraFrame(wheel.id, width, height);
      const camera = new PerspectiveCamera(42, width / height, 1, 30000);
      camera.position.fromArray(frame.position);
      camera.lookAt(new Vector3(...frame.target));
      camera.updateMatrixWorld(true);
      const dimension = wheelDimension(wheel.id);
      for (const point of [wheel.hub, wheel.arch, dimension.lower, dimension.upper, dimension.label]) {
        const projected = new Vector3(...point).project(camera);
        expect(Math.abs(projected.x)).toBeLessThan(1 - 132 / width);
        expect(Math.abs(projected.y)).toBeLessThan(1 - 60 / height);
        expect(projected.z).toBeGreaterThan(-1);
        expect(projected.z).toBeLessThan(1);
      }
      expect(camera.position.distanceTo(new Vector3(...frame.target))).toBeLessThan(2000);
    }
  });
});