export const DOOR_IDS = ['front-left', 'front-right', 'rear-left', 'rear-right'] as const;
export type DoorId = typeof DOOR_IDS[number];
export type BodyFault = 'none' | 'lighting-fuse' | 'comfort-fuse' | 'left-lamp-open';
export interface DoorState { open: number; target: number; window: number; windowTarget: number }
export interface BodyPower { battery: boolean; ignition: boolean; braking: boolean; lighting?: boolean; comfort?: boolean }
export interface BodyControlState {
  doors: Record<DoorId, DoorState>;
  locked: boolean;
  hood: number;
  hoodTarget: number;
  hoodReleased: boolean;
  prop: boolean;
  hatch: number;
  hatchTarget: number;
  lights: 'off' | 'position' | 'low' | 'high';
  indicator: 'off' | 'left' | 'right' | 'hazard';
  fog: boolean;
  fault: BodyFault;
  elapsed: number;
  showWiring: boolean;
}

export function initialBodyControl(): BodyControlState {
  return { doors: Object.fromEntries(DOOR_IDS.map(id => [id, { open: 0, target: 0, window: 1, windowTarget: 1 }])) as Record<DoorId, DoorState>, locked: false, hood: 0, hoodTarget: 0, hoodReleased: false, prop: false, hatch: 0, hatchTarget: 0, lights: 'off', indicator: 'off', fog: false, fault: 'none', elapsed: 0, showWiring: false };
}

export function sampleBodyControl(state: BodyControlState, power: BodyPower) {
  const lighting = power.battery && power.lighting !== false && state.fault !== 'lighting-fuse';
  const comfort = power.battery && power.comfort !== false && state.fault !== 'comfort-fuse';
  const position = lighting && state.lights !== 'off';
  const low = lighting && power.ignition && (state.lights === 'low' || state.lights === 'high');
  const high = low && state.lights === 'high';
  const leftLow = low && state.fault !== 'left-lamp-open';
  const blink = state.elapsed % 0.8 < 0.4;
  const indicators = lighting && (power.ignition || state.indicator === 'hazard');
  const leftIndicator = indicators && blink && (state.indicator === 'left' || state.indicator === 'hazard');
  const rightIndicator = indicators && blink && (state.indicator === 'right' || state.indicator === 'hazard');
  const brake = lighting && power.braking;
  const fog = lighting && power.ignition && position && state.fog;
  const cabin = comfort && (DOOR_IDS.some(id => state.doors[id].open > 0.02) || state.hatch > 0.02);
  const windowPower = comfort && power.ignition;
  const windowMoving = DOOR_IDS.filter(id => windowPower && Math.abs(state.doors[id].windowTarget - state.doors[id].window) > 0.001);
  const watts = (Number(leftLow) + Number(low)) * 55 + Number(high) * 110 + Number(position) * 30 + Number(brake) * 63 + (Number(leftIndicator) + Number(rightIndicator)) * 47 + Number(fog) * 110 + Number(cabin) * 10;
  return { lighting, comfort, windowPower, position, low, leftLow, high, leftIndicator, rightIndicator, brake, fog, cabin, windowMoving, lampCurrent: watts / 12, windowCurrent: windowMoving.length * 4, voltage: power.battery ? 12 : 0 };
}

export function commandDoor(state: BodyControlState, id: DoorId, open: boolean): BodyControlState {
  if (open && state.locked) return state;
  return { ...state, doors: { ...state.doors, [id]: { ...state.doors[id], target: Number(open) } } };
}

export function commandWindow(state: BodyControlState, id: DoorId, target: number): BodyControlState {
  if (!Number.isFinite(target)) return state;
  return { ...state, doors: { ...state.doors, [id]: { ...state.doors[id], windowTarget: Math.max(0, Math.min(1, target)) } } };
}

export function commandLock(state: BodyControlState, locked: boolean, power: BodyPower): BodyControlState {
  if (!sampleBodyControl(state, power).comfort || locked && DOOR_IDS.some(id => state.doors[id].open > 0.01 || state.doors[id].target > 0)) return state;
  return { ...state, locked };
}

export function commandHatch(state: BodyControlState, open: boolean, power: BodyPower): BodyControlState {
  if (open && (state.locked || !sampleBodyControl(state, power).comfort)) return state;
  return { ...state, hatchTarget: Number(open) };
}

export function commandHood(state: BodyControlState, open: boolean): BodyControlState {
  if (open && !state.hoodReleased || !open && state.prop) return state;
  return { ...state, hoodTarget: Number(open) };
}

export function commandProp(state: BodyControlState, deployed: boolean): BodyControlState {
  if (deployed && state.hood < 0.8) return state;
  return { ...state, prop: deployed, hoodTarget: deployed ? 1 : state.hoodTarget };
}

export function advanceBodyControl(state: BodyControlState, power: BodyPower, seconds: number): BodyControlState {
  if (!Number.isFinite(seconds) || seconds <= 0) return state;
  const delta = Math.min(seconds, 5);
  const move = (position: number, target: number, speed: number) => position + Math.sign(target - position) * Math.min(Math.abs(target - position), delta * speed);
  const output = sampleBodyControl(state, power);
  const hood = move(state.hood, state.prop ? 1 : state.hoodTarget, 0.65);
  return { ...state, elapsed: state.elapsed + delta, hood, hoodReleased: hood === 0 && state.hoodTarget === 0 ? false : state.hoodReleased, hatch: move(state.hatch, state.hatchTarget, 0.6), doors: Object.fromEntries(DOOR_IDS.map(id => [id, { ...state.doors[id], open: move(state.doors[id].open, state.doors[id].target, 0.85), window: output.windowPower ? move(state.doors[id].window, state.doors[id].windowTarget, 0.4) : state.doors[id].window }])) as Record<DoorId, DoorState> };
}