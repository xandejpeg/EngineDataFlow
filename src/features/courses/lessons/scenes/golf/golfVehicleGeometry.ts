import { Path, Shape, Vector2 } from 'three';
import { BODY_TOP } from './golfBodyProfile';
export { BODY_TOP } from './golfBodyProfile';
import { GOLF } from './golfPhysics';
import type { AlignmentAxle, WheelAlignmentMeasurement } from './golfAlignment';
import { roundedCabinContour, type CabinPoint } from './golfCabinContours';
import { REAR_BUMPER_SAMPLES, REAR_HATCH_ROWS, rearSideDepth } from './golfRearSurface';

export const BODY_ARCH = { centreHeight: 317, radius: 357, sideOffset: 837 } as const;
export type VehicleWheelId = `${AlignmentAxle}-${'left' | 'right'}`;
export const VEHICLE_WHEELS = (['front', 'rear'] as const).flatMap(axle => ([-1, 1] as const).map(side => ({
  id: `${axle}-${side < 0 ? 'left' : 'right'}` as VehicleWheelId,
  axle,
  side,
  hub: [side * (axle === 'front' ? 767 : 757), GOLF.wheelRadius, axle === 'front' ? 0 : 2578] as [number, number, number],
  arch: [side * BODY_ARCH.sideOffset, BODY_ARCH.centreHeight + BODY_ARCH.radius, axle === 'front' ? 0 : 2578] as [number, number, number],
})));

export function modelWheelHeight(hub: readonly number[], arch: readonly number[]): WheelAlignmentMeasurement {
  return { hubToArchMm: arch[1] - hub[1], camberDegrees: null, toeInDegrees: null, casterDegrees: null };
}

export function modelAxleMeasurements(axle: AlignmentAxle) {
  return VEHICLE_WHEELS.filter(wheel => wheel.axle === axle).map(wheel => modelWheelHeight(wheel.hub, wheel.arch));
}

export function wheelDimension(id: VehicleWheelId) {
  const wheel = VEHICLE_WHEELS.find(wheel => wheel.id === id);
  if (!wheel) throw new Error('Unknown model wheel');
  const axis = wheel.side * (BODY_ARCH.sideOffset + 150);
  const lower: [number, number, number] = [axis, wheel.hub[1], wheel.hub[2]];
  const upper: [number, number, number] = [axis, wheel.arch[1], wheel.arch[2]];
  const label: [number, number, number] = [axis + wheel.side * 65, (lower[1] + upper[1]) / 2, lower[2]];
  return { wheel, lower, upper, label, heightMm: upper[1] - lower[1] };
}

export const VEHICLE_WINDOWS = ([
  [[330, 990], [620, 1270], [820, 1370], [1100, 1410], [1500, 1418], [1500, 990]],
  [[1590, 990], [1590, 1418], [1990, 1410], [2260, 1394], [2230, 990]],
  [[2265, 990], [2295, 1390], [2450, 1370], [2570, 1290], [2610, 1060], [2580, 990]],
] as CabinPoint[][]).map(points => roundedCabinContour(points, 45));

export function createVehicleGlazing() {
  return VEHICLE_WINDOWS.map(points => new Shape(points.map(point => new Vector2(...point))));
}

export function createVehicleOutline() {
  const shape = new Shape();
  shape.moveTo(-620, 317); shape.lineTo(-620, 780); shape.lineTo(-875, 795);
  [...BODY_TOP.hood, ...BODY_TOP.windshield, ...BODY_TOP.roof].forEach(([depth, height]) => shape.lineTo(depth, height));
  [...BODY_TOP.rearGlass, ...REAR_HATCH_ROWS].forEach(([depth, height]) => shape.lineTo(rearSideDepth(depth, height), height));
  [...REAR_BUMPER_SAMPLES].reverse().slice(1).forEach(([height, depth]) => shape.lineTo(rearSideDepth(depth, height), height));
  shape.lineTo(2578 + BODY_ARCH.radius, BODY_ARCH.centreHeight);
  shape.absarc(2578, BODY_ARCH.centreHeight, BODY_ARCH.radius, 0, Math.PI, false);
  shape.lineTo(2170, 245); shape.lineTo(410, 245); shape.lineTo(BODY_ARCH.radius, BODY_ARCH.centreHeight);
  shape.absarc(0, BODY_ARCH.centreHeight, BODY_ARCH.radius, 0, Math.PI, false);
  shape.lineTo(-620, 317); shape.closePath();
  for (const points of VEHICLE_WINDOWS) {
    const opening = new Path(points.map(point => new Vector2(...point)));
    opening.closePath();
    shape.holes.push(opening);
  }
  return shape;
}