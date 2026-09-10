import { Box3, Vector3 } from 'three';
import { wheelDimension, type VehicleWheelId } from './golfVehicleGeometry';

export function dimensionCameraFrame(wheelId: VehicleWheelId, width: number, height: number, fov = 42) {
  const dimension = wheelDimension(wheelId);
  const points = [dimension.wheel.hub, dimension.wheel.arch, dimension.lower, dimension.upper, dimension.label].map(point => new Vector3(...point));
  const bounds = new Box3().setFromPoints(points).expandByScalar(45);
  const target = bounds.getCenter(new Vector3());
  const direction = new Vector3(dimension.wheel.side, 0.18, -0.65).normalize();
  const right = new Vector3(0, 1, 0).cross(direction).normalize();
  const up = direction.clone().cross(right).normalize();
  const verticalTangent = Math.tan(fov * Math.PI / 360) * Math.max(0.25, 1 - 130 / height);
  const horizontalTangent = Math.tan(fov * Math.PI / 360) * width / height * Math.max(0.25, 1 - 190 / width);
  let distance = 300;
  for (const axis of [bounds.min.x, bounds.max.x]) for (const elevation of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) {
    const relative = new Vector3(axis, elevation, depth).sub(target);
    distance = Math.max(distance, relative.dot(direction) + Math.abs(relative.dot(up)) / verticalTangent, relative.dot(direction) + Math.abs(relative.dot(right)) / horizontalTangent);
  }
  return { target: target.toArray(), position: target.clone().addScaledVector(direction, distance).toArray() };
}