import { Vector3 } from 'three';
import { FRONT_STRUCTURE, REAR_STRUCTURE, type StructurePoint } from './golfStructureGeometry';
import { VEHICLE_WHEELS } from './golfVehicleGeometry';

export const CHASSIS_REFERENCE = {
  dimensionalStatus: 'estimated', actuation: 'not-simulated',
  frontSuspension: 'macpherson', rearSuspension: 'four-link-independent',
  drive: 'front-wheel-drive',
  source: 'Architecture: SSP 321; coordinates fitted to existing estimated structure',
} as const;

export const CHASSIS_CORNERS = VEHICLE_WHEELS.map(wheel => {
  const index = wheel.side < 0 ? 0 : 1;
  const front = wheel.axle === 'front';
  return {
    ...wheel,
    knuckle: [wheel.hub[0] - wheel.side * 70, wheel.hub[1], wheel.hub[2]] as StructurePoint,
    damperTop: front ? FRONT_STRUCTURE.towers[index] : REAR_STRUCTURE.damperMounts[index],
    springTop: front ? FRONT_STRUCTURE.towers[index] : REAR_STRUCTURE.springSeats[index],
    innerCv: front ? [wheel.side < 0 ? -370 : -110, 350, 130] as StructurePoint : null,
  };
});

export function coilPoints(from: StructurePoint, to: StructurePoint, radius: number, turns = 6): StructurePoint[] {
  const start = new Vector3(...from);
  const direction = new Vector3(...to).sub(start);
  const axis = direction.clone().normalize();
  const perpendicular = new Vector3(0, 0, 1).cross(axis).normalize();
  const normal = axis.clone().cross(perpendicular).normalize();
  return Array.from({ length: turns * 16 + 1 }, (_, index) => {
    const progress = index / (turns * 16);
    const angle = progress * turns * Math.PI * 2;
    return start.clone().addScaledVector(direction, progress)
      .addScaledVector(perpendicular, Math.cos(angle) * radius)
      .addScaledVector(normal, Math.sin(angle) * radius).toArray() as StructurePoint;
  });
}