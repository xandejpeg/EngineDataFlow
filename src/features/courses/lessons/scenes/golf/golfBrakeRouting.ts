import { brakeGeometry } from './golfBrakeGeometry';
import { wheelCircuit } from './golfBrakeHydraulics';
import { CLUTCH_HYDRAULICS } from './golfHydraulics';
import { VEHICLE_WHEELS } from './golfVehicleGeometry';
import type { StructurePoint } from './golfStructureGeometry';

export const BRAKE_PEDAL_PIVOT: StructurePoint = [-370, 695, 630];
export const BRAKE_CALIPER_ANGLE = Math.atan2(77, 100);
export const BRAKE_MASTER_PORTS: StructurePoint[] = [[-380, 740, 230], [-340, 740, 285]];
export const BRAKE_ABS_INPUTS: StructurePoint[] = [[-595, 592.5, 365], [-545, 592.5, 365]];
export const BRAKE_MASTER_LINES = BRAKE_MASTER_PORTS.map((port, index) => [port, [port[0], 720, 300], [-480, 655, 365], BRAKE_ABS_INPUTS[index]] as StructurePoint[]);
export const BRAKE_RESERVOIR_LINES = BRAKE_MASTER_PORTS.map(port => [
  [CLUTCH_HYDRAULICS.reservoir[0], CLUTCH_HYDRAULICS.reservoir[1] - 35, CLUTCH_HYDRAULICS.reservoir[2]],
  [port[0], 795, port[2]], [port[0], 760, port[2]], port,
] as StructurePoint[]);

export const BRAKE_WHEEL_LINES = VEHICLE_WHEELS.map((wheel, index) => {
  const radius = brakeGeometry(wheel.axle).padRadius;
  const inlet: StructurePoint = [wheel.hub[0] - wheel.side * 48, wheel.hub[1] + radius * Math.cos(BRAKE_CALIPER_ANGLE), wheel.hub[2] + wheel.side * radius * Math.sin(BRAKE_CALIPER_ANGLE)];
  const outlet: StructurePoint = [-607.5 + index * 25, 592.5, 400];
  const bulkhead: StructurePoint = [wheel.side * 480, 400, wheel.hub[2] + 140];
  const rigid: StructurePoint[] = [outlet, [-570, 465 + index * 8, 445 + index * 12], [wheel.side * 440, 365 + index * 8, 490 + index * 12], [wheel.side * 480, 365, wheel.hub[2] + 200], bulkhead];
  const hose: StructurePoint[] = [bulkhead, [wheel.side * 580, 470, wheel.hub[2] + 100], [wheel.side * 650, 430, wheel.hub[2] + 80], inlet];
  return { id: wheel.id, circuit: wheelCircuit(wheel.id), outlet, inlet, rigid, hose };
});