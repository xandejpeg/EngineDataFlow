import * as THREE from 'three';
import { SLAVE_CYLINDER_MODEL } from './golfClutchReference';

type Point = [number, number, number];

export function slavePlungerContact(): Point {
  const point = new THREE.Vector3(0, SLAVE_CYLINDER_MODEL.plunger.end, 0);
  point.applyAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2);
  return point.add(new THREE.Vector3(...SLAVE_CYLINDER_MODEL.position)).toArray();
}

const contact = slavePlungerContact();

export const CLUTCH_LEVER_MODEL = {
  dimensionalStatus: 'estimated',
  placementStatus: 'estimated',
  actuation: 'not-simulated',
  plungerContact: contact,
  pivot: [contact[0], -112, 0] as Point,
  pivotBase: [contact[0] - 25, -112, 0] as Point,
  bearingCenter: [contact[0] + 7, 0, 0] as Point,
  plateBackX: contact[0] + 3,
  plateThickness: 5,
  seatInnerRadius: 4.5,
  seatOuterRadius: 7,
  pivotRadius: 6,
  pivotSeatInnerRadius: 6.5,
  pivotSeatOuterRadius: 9,
} as const;

export const CLUTCH_SPRING_MODEL = {
  position: CLUTCH_LEVER_MODEL.pivot,
  dimensionalStatus: 'estimated',
  placementStatus: 'estimated',
  actuation: 'not-simulated',
  wireRadius: 0.8,
  halfGap: 5.3,
  neckPlaneX: -6.5,
  loopTop: 28,
  hookBottom: -21,
  hookFrontX: CLUTCH_LEVER_MODEL.plateBackX + CLUTCH_LEVER_MODEL.plateThickness - CLUTCH_LEVER_MODEL.pivot[0] + 0.8,
} as const;

export function clutchSpringPath(): Point[] {
  const model = CLUTCH_SPRING_MODEL;
  const leg = (side: number): Point[] => [
    [model.hookFrontX, -13, side * model.halfGap],
    [model.hookFrontX, model.hookBottom + 3, side * model.halfGap],
    [2, model.hookBottom, side * model.halfGap],
    [model.neckPlaneX, model.hookBottom + 3, side * model.halfGap],
    [model.neckPlaneX, -7, side * model.halfGap],
    [model.neckPlaneX, 7, side * model.halfGap],
    [model.neckPlaneX, 20, side * 2.4],
    [model.neckPlaneX, model.loopTop - 2, side * 2.4],
  ];
  return [...leg(-1), [model.neckPlaneX, model.loopTop, 0], ...leg(1).reverse()];
}

export function clutchLeverShape() {
  const top = CLUTCH_LEVER_MODEL.plungerContact[1];
  const bottom = CLUTCH_LEVER_MODEL.pivot[1];
  const shape = new THREE.Shape();
  shape.moveTo(-14, top);
  shape.quadraticCurveTo(-14, top + 15, 0, top + 15);
  shape.quadraticCurveTo(14, top + 15, 14, top);
  shape.bezierCurveTo(17, 100, 29, 38, 29, 0);
  shape.quadraticCurveTo(29, -54, 20, bottom);
  shape.quadraticCurveTo(20, bottom - 17, 0, bottom - 17);
  shape.quadraticCurveTo(-20, bottom - 17, -20, bottom);
  shape.quadraticCurveTo(-29, -54, -29, 0);
  shape.bezierCurveTo(-29, 38, -17, 100, -14, top);
  shape.closePath();
  const opening = new THREE.Path();
  opening.absellipse(0, 0, 22, 34, 0, Math.PI * 2, true, 0);
  shape.holes.push(opening);
  const serviceHole = new THREE.Path();
  serviceHole.absarc(0, -57, 8, 0, Math.PI * 2, true);
  shape.holes.push(serviceHole);
  return shape;
}