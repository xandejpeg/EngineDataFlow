import { describe, expect, it } from 'vitest';
import { CHASSIS_CORNERS, CHASSIS_REFERENCE, coilPoints } from './golfChassisGeometry';
import { FRONT_STRUCTURE, REAR_STRUCTURE } from './golfStructureGeometry';
import { VEHICLE_WHEELS } from './golfVehicleGeometry';

describe('complete car chassis assembly', () => {
  it('uses existing wheel centres and only two front halfshafts', () => {
    expect(CHASSIS_CORNERS.map(corner => corner.hub)).toEqual(VEHICLE_WHEELS.map(wheel => wheel.hub));
    expect(CHASSIS_CORNERS.filter(corner => corner.innerCv).map(corner => corner.axle)).toEqual(['front', 'front']);
    expect(CHASSIS_REFERENCE.dimensionalStatus).toBe('estimated');
    expect(CHASSIS_REFERENCE.actuation).toBe('not-simulated');
  });
  it('mounts dampers and rear springs to the existing structure', () => {
    expect(CHASSIS_CORNERS.map(corner => corner.damperTop)).toEqual([...FRONT_STRUCTURE.towers, ...REAR_STRUCTURE.damperMounts]);
    expect(CHASSIS_CORNERS.filter(corner => corner.axle === 'rear').map(corner => corner.springTop)).toEqual(REAR_STRUCTURE.springSeats);
  });
  it('builds a finite helical spring with the requested axial span', () => {
    const points = coilPoints([0, 0, 0], [0, 200, 0], 60);
    expect(points).toHaveLength(97);
    expect(points.every(point => point.every(Number.isFinite))).toBe(true);
    expect(points[0][1]).toBe(0);
    expect(points.at(-1)![1]).toBe(200);
    points.forEach(point => expect(Math.hypot(point[0], point[2])).toBeCloseTo(60));
  });
});