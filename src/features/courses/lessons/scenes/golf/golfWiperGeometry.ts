import { BODY_TOP } from './golfBodyProfile';

export type WiperPoint = [number, number, number];
const windshieldBase = BODY_TOP.windshield[0];
const windshieldTop = BODY_TOP.windshield[BODY_TOP.windshield.length - 1];
export const WIPER_PLANE = { origin: [0, windshieldBase[1] + 8, windshieldBase[0] + 10] as WiperPoint, tilt: Math.atan2(windshieldTop[0] - windshieldBase[0], windshieldTop[1] - windshieldBase[1]) };
export const WIPER_PIVOTS = [[-620, 0, 35], [60, 0, 35]] as WiperPoint[];
export const WIPER_MOTOR: WiperPoint = [-370, -90, 35];
export const WIPER_STALK: WiperPoint = [-320, 860, 880];
export const WIPER_CONTROLLER: WiperPoint = [-330, 785, 730];
export const WIPER_LINKS = { crank: 60, rod: 250, rocker: 100, tie: 680 } as const;
const ground = Math.hypot(250, -90);
const direction = Math.atan2(-90, 250);
const parkedRocker = direction + Math.acos((ground ** 2 + WIPER_LINKS.rocker ** 2 - (WIPER_LINKS.rod - WIPER_LINKS.crank) ** 2) / (2 * ground * WIPER_LINKS.rocker));
const parkedEnd = [-620 + 100 * Math.cos(parkedRocker), 100 * Math.sin(parkedRocker)];
const parkedCrank = Math.atan2(WIPER_MOTOR[1] - parkedEnd[1], WIPER_MOTOR[0] - parkedEnd[0]);

export function wiperPose(phase: number) {
  const rotation = parkedCrank + phase * Math.PI * 2;
  const crank: WiperPoint = [WIPER_MOTOR[0] + WIPER_LINKS.crank * Math.cos(rotation), WIPER_MOTOR[1] + WIPER_LINKS.crank * Math.sin(rotation), 35];
  const offsetX = crank[0] - WIPER_PIVOTS[0][0];
  const offsetY = crank[1];
  const distance = Math.hypot(offsetX, offsetY);
  const along = (WIPER_LINKS.rocker ** 2 - WIPER_LINKS.rod ** 2 + distance ** 2) / (2 * distance);
  const height = Math.sqrt(Math.max(0, WIPER_LINKS.rocker ** 2 - along ** 2));
  const left: WiperPoint = [-620 + (along * offsetX - height * offsetY) / distance, (along * offsetY + height * offsetX) / distance, 35];
  const right: WiperPoint = [left[0] + WIPER_LINKS.tie, left[1], 35];
  return { crank, left, right, rotation, sweep: Math.atan2(left[1], left[0] + 620) - parkedRocker };
}

export function wiperToWorld(point: WiperPoint): WiperPoint {
  return [point[0], WIPER_PLANE.origin[1] + point[1] * Math.cos(WIPER_PLANE.tilt) - point[2] * Math.sin(WIPER_PLANE.tilt), WIPER_PLANE.origin[2] + point[1] * Math.sin(WIPER_PLANE.tilt) + point[2] * Math.cos(WIPER_PLANE.tilt)];
}

export const WIPER_WIRES: { id: string; from: WiperPoint; to: WiperPoint; color: string }[] = [
  { id: 'supply', from: [-620, 710, 430], to: WIPER_CONTROLLER, color: '#ba3745' },
  { id: 'stalk', from: WIPER_STALK, to: WIPER_CONTROLLER, color: '#d4ae43' },
  { id: 'motor', from: WIPER_CONTROLLER, to: wiperToWorld(WIPER_MOTOR), color: '#287b98' },
  { id: 'park', from: wiperToWorld(WIPER_MOTOR), to: [-310, 785, 730], color: '#8e72a0' },
  { id: 'ground', from: wiperToWorld(WIPER_MOTOR), to: [-560, 790, 430], color: '#755446' },
  { id: 'washer', from: WIPER_CONTROLLER, to: [525, 475, -470], color: '#398a74' },
];