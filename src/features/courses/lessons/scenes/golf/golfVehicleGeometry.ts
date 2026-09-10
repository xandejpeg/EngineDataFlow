import { Path, Shape, Vector2 } from 'three';
import { GOLF } from './golfPhysics';
import type { AlignmentAxle, WheelAlignmentMeasurement } from './golfAlignment';

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

export const VEHICLE_WINDOWS = [
  [[510, 990], [885, 1350], [1510, 1397], [1510, 990]],
  [[1570, 990], [1570, 1397], [2130, 1390], [2320, 1325], [2290, 990]],
  [[2350, 990], [2380, 1300], [2600, 1225], [2860, 1030], [2810, 990]],
] as [number, number][][];

export function createVehicleGlazing() {
  return VEHICLE_WINDOWS.map(points => new Shape(points.map(point => new Vector2(...point))));
}

export function createVehicleOutline() {
  const shape = new Shape();
  shape.moveTo(-875, 430); shape.quadraticCurveTo(-890, 690, -720, 775);
  shape.bezierCurveTo(-430, 900, 160, 940, 390, 970);
  shape.lineTo(840, 1395); shape.quadraticCurveTo(1000, 1490, 2100, 1450);
  shape.quadraticCurveTo(2700, 1400, 3050, 1090); shape.lineTo(3300, 970);
  shape.quadraticCurveTo(3360, 900, 3329, 460); shape.lineTo(2970, 300);
  shape.lineTo(2578 + BODY_ARCH.radius, BODY_ARCH.centreHeight);
  shape.absarc(2578, BODY_ARCH.centreHeight, BODY_ARCH.radius, 0, Math.PI, false);
  shape.lineTo(BODY_ARCH.radius, BODY_ARCH.centreHeight);
  shape.absarc(0, BODY_ARCH.centreHeight, BODY_ARCH.radius, 0, Math.PI, false);
  shape.lineTo(-875, 430); shape.closePath();
  for (const points of VEHICLE_WINDOWS) {
    const opening = new Path(points.map(point => new Vector2(...point)));
    opening.closePath();
    shape.holes.push(opening);
  }
  return shape;
}