import { CLUTCH_BEARING_MODEL } from './golfClutchBearingGeometry';

export const CLUTCH_PACK_MODEL = {
  position: CLUTCH_BEARING_MODEL.position,
  dimensionalStatus: 'estimated',
  applicationStatus: 'generic-not-oe-selected',
  actuation: 'not-simulated',
  flywheel: { start: 100, end: 124, radius: 137, frictionRadius: 112, teeth: 96 },
  disc: { start: 92, end: 100, innerRadius: 73, outerRadius: 110, hubStart: 80, hubEnd: 110, bore: 11.5 },
  pressure: { start: 80, end: 92, innerRadius: 72, outerRadius: 112 },
  cover: { start: 40, end: 100, radius: 125 },
  diaphragm: { tip: CLUTCH_BEARING_MODEL.faceEnd, root: 58, innerRadius: 23, outerRadius: 91, fingers: 18 },
  crankAdapterEnd: 184,
} as const;

export function clutchPackOffsets(exploded: boolean) {
  return exploded ? { flywheel: 210, disc: 125, pressure: 65, cover: 0 } : { flywheel: 0, disc: 0, pressure: 0, cover: 0 };
}

export function annulusProfile(inner: number, outer: number, start: number, end: number): [number, number][] {
  return [[inner, start], [outer, start], [outer, end], [inner, end], [inner, start]];
}