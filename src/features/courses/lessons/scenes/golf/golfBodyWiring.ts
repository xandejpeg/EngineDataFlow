import { Vector3 } from 'three';
import { DOOR_IDS, sampleBodyControl, type BodyControlState, type BodyPower, type DoorId } from './golfBodyControl';
import { doorDefinition } from './golfDoorGeometry';
import { circuitOpen, type GolfClock } from './golfPhysics';
import type { BrakeState } from './golfBrakeHydraulics';
import { BODY_TOP } from './golfVehicleGeometry';
import { rearPanelPoint } from './golfBodyFit';
import { frontPanelPoint } from './golfFrontFit';
import { testPoint } from './golfService';
import { A_PILLAR, cabinDrop, CABIN_GROMMET, DASH_CROSS, doorDrop, engineBayRun, FLOOR_CROSS, FRONT_CROSS, GROUND_STUD, HEADLINER, loomZone, rearQuarterRun, reversed, sillRun } from './golfLoom';
import { orthoStub } from './golfOrthoRoute';
import { buildLoom } from './golfLoomBundles';

const blade = (id: string): BodyPoint => testPoint(id)!.position;

export type BodyPoint = [number, number, number];
export const HOOD_PIVOT: BodyPoint = [0, BODY_TOP.windshield[0][1], BODY_TOP.windshield[0][0]];
export const HATCH_PIVOT: BodyPoint = [0, BODY_TOP.rearGlass[0][1], BODY_TOP.rearGlass[0][0]];
export const HATCH_STOP: BodyPoint = [0, HATCH_PIVOT[1] - 5, HATCH_PIVOT[2] + 36];
export const HOOD_ANGLE = 1.05;
export const HATCH_ANGLE = -1.5;
export const HOOD_PROP_BASE: BodyPoint = [-630, 830, -480];
export const HOOD_PROP_ATTACHMENT: BodyPoint = [-400, 874, -560];
export const HOOD_PROP_LENGTH = new Vector3(...HOOD_PROP_BASE).distanceTo(new Vector3(...bodyHingePoint(HOOD_PROP_ATTACHMENT, HOOD_PIVOT, HOOD_ANGLE)));

export function bodyHingePoint(point: BodyPoint, pivot: BodyPoint, angle: number): BodyPoint {
  return new Vector3(...point).sub(new Vector3(...pivot)).applyAxisAngle(new Vector3(1, 0, 0), angle).add(new Vector3(...pivot)).toArray();
}

export function hoodPropEndpoints(state: Pick<BodyControlState, 'hood' | 'prop'>) {
  const tip: BodyPoint = state.prop ? bodyHingePoint(HOOD_PROP_ATTACHMENT, HOOD_PIVOT, state.hood * HOOD_ANGLE) : [HOOD_PROP_BASE[0], HOOD_PROP_BASE[1], HOOD_PROP_BASE[2] + HOOD_PROP_LENGTH];
  return { base: HOOD_PROP_BASE, tip, length: new Vector3(...tip).distanceTo(new Vector3(...HOOD_PROP_BASE)) };
}

export function hatchStrutEndpoints(side: number, hatch: number) {
  const base: BodyPoint = [side * 650, 1060, 2930];
  const attachment = rearPanelPoint(side * 0.68, 1270, -10);
  const tip = bodyHingePoint(attachment, HATCH_PIVOT, hatch * HATCH_ANGLE);
  return { base, tip, attachment, length: new Vector3(...tip).distanceTo(new Vector3(...base)) };
}

export function bodyPower(clock: GolfClock, brakes: BrakeState): BodyPower {
  return { battery: !circuitOpen(clock, 'main'), ignition: clock.operation !== 'off', braking: brakes.pedal > 0.01, lighting: !circuitOpen(clock, 'lighting'), comfort: !circuitOpen(clock, 'comfort') };
}

export type BodyOutput = ReturnType<typeof sampleBodyControl>;
export type BodyLamp = 'low' | 'high' | 'position' | 'tail' | 'brake' | 'indicator' | 'fog' | 'cabin' | 'cargo';

export function bodyLampOn(output: BodyOutput, lamp: BodyLamp, side = 1, state?: BodyControlState): boolean {
  if (lamp === 'low') return side < 0 ? output.leftLow : output.low;
  if (lamp === 'high') return output.high && (side > 0 || output.leftLow);
  if (lamp === 'position' || lamp === 'tail') return output.position;
  if (lamp === 'indicator') return side < 0 ? output.leftIndicator : output.rightIndicator;
  if (lamp === 'cargo') return output.comfort && (state?.hatch ?? 0) > 0.02;
  return output[lamp];
}

export const BODY_WIRING_NODES: Record<string, BodyPoint> = {
  'battery-plus': [-535, 902, 310], 'battery-minus': [-365, 902, 310],
  'main-fuse': blade('main-out'), 'lighting-fuse': blade('lighting-out'), 'comfort-fuse': blade('comfort-out'),
  'controller-lighting': [-580, 730, 730], 'controller-comfort': [-520, 730, 730], 'controller-ground': [-550, 705, 730],
  ground: GROUND_STUD,
  'head-left': frontPanelPoint(-550, 709, 0), 'head-right': frontPanelPoint(550, 709, 0),
  'rear-left': [-574, 932, 3320], 'rear-right': [574, 932, 3320],
  'fog-left': frontPanelPoint(-653, 427, 0), 'fog-right': frontPanelPoint(653, 427, 0),
  cabin: [0, 1415, 1180], cargo: [-480, 1180, 2910], 'hatch-stop': HATCH_STOP,
  ...Object.fromEntries(DOOR_IDS.map(id => [`door-${id}`, doorDefinition(id).pivot])),
};

export type BodyCircuit = 'battery' | 'main' | 'lighting' | 'comfort' | 'controller' | 'head-left' | 'head-right' | 'rear-left' | 'rear-right' | 'fog' | 'cabin' | 'cargo' | 'brake' | 'door-command' | 'door-feedback';
export interface BodyWire { id: string; from: string; to: string; circuit: BodyCircuit; code: string; return: boolean; points: BodyPoint[]; movingEnd?: boolean }

const AXIS_LETTERS = 'xyz';

/**
 * Converte a polilinha em trechos alinhados aos eixos: os desvios curtos saem primeiro e o
 * eixo dominante fica por ultimo, entao o fio entra no corredor e corre reto ate o proximo canto.
 */
function orthogonal(points: BodyPoint[]): BodyPoint[] {
  const out: BodyPoint[] = [points[0]];
  for (const target of points.slice(1)) {
    const previous = out[out.length - 1];
    if (Math.hypot(target[0] - previous[0], target[1] - previous[1], target[2] - previous[2]) < 0.5) continue;
    const order = [0, 1, 2]
      .sort((a, b) => Math.abs(target[a] - previous[a]) - Math.abs(target[b] - previous[b]))
      .map(axis => AXIS_LETTERS[axis]).join('');
    out.push(...orthoStub(previous, target, order) as BodyPoint[], target);
  }
  return out;
}

function wire(id: string, from: string, to: string, circuit: BodyCircuit, code: string, isReturn = false, via: BodyPoint[] = []): BodyWire {
  const points = orthogonal([BODY_WIRING_NODES[from], ...via, BODY_WIRING_NODES[to]]);
  return { id, from, to, circuit, code, return: isReturn, points, movingEnd: from === 'hatch-stop' || to === 'hatch-stop' };
}

// Retornos correm no mesmo corredor da alimentacao; a separacao vem do empacotamento do feixe.
const headApproach = (side: number): BodyPoint[] => side < 0 ? engineBayRun(-1).slice(1) : [...engineBayRun(-1).slice(1), ...FRONT_CROSS.slice(1, 3)];
const bayToFront = (side: number): BodyPoint[] => side < 0 ? engineBayRun(-1).slice(1) : [...engineBayRun(-1).slice(1), ...FRONT_CROSS.slice(1)];
const frontToGround = (side: number): BodyPoint[] => side < 0
  ? reversed(engineBayRun(-1)).slice(1, -1)
  : [...reversed(FRONT_CROSS).slice(1), ...reversed(engineBayRun(-1)).slice(1, -1)];
const cabinToUnderfloor = (side: number): BodyPoint[] => side < 0
  ? [...cabinDrop(-1), ...sillRun(-1)]
  : [...cabinDrop(-1), ...FLOOR_CROSS, ...sillRun(1).slice(1)];
const underfloorToGround = (side: number): BodyPoint[] => [
  ...reversed(sillRun(side)),
  ...(side < 0 ? [] : reversed(FLOOR_CROSS).slice(1)),
  ...reversed(cabinDrop(-1)),
  ...CABIN_GROMMET,
];
const toDoorSide = (side: number): BodyPoint[] => side < 0 ? [[-640, 760, 742]] : [[-540, 900, 726], ...DASH_CROSS.slice(1)];
const fromDoorSide = (side: number): BodyPoint[] => reversed(toDoorSide(side));

const RAW_WIRES: BodyWire[] = [
  wire('battery-main', 'battery-plus', 'main-fuse', 'battery', 'ro', false, [[-572, 848, 356]]),
  wire('main-lighting', 'main-fuse', 'lighting-fuse', 'main', 'ro'),
  wire('main-comfort', 'main-fuse', 'comfort-fuse', 'main', 'ro'),
  wire('lighting-controller', 'lighting-fuse', 'controller-lighting', 'lighting', 'sw', false, reversed(CABIN_GROMMET).slice(2)),
  wire('comfort-controller', 'comfort-fuse', 'controller-comfort', 'comfort', 'ro/sw', false, reversed(CABIN_GROMMET).slice(2)),
  wire('controller-return', 'controller-ground', 'ground', 'controller', 'br', true, CABIN_GROMMET),
  wire('battery-return', 'ground', 'battery-minus', 'controller', 'br', true, [[-628, 800, 302], [-470, 868, 306]]),
  ...(['left', 'right'] as const).flatMap(name => {
    const side = name === 'left' ? -1 : 1;
    return [
      wire(`head-${name}-feed`, 'controller-lighting', `head-${name}`, `head-${name}`, 'ge/ws', false, [...CABIN_GROMMET, ...headApproach(side)]),
      wire(`head-${name}-return`, `head-${name}`, 'ground', `head-${name}`, 'br', true, frontToGround(side)),
      wire(`fog-${name}-feed`, 'controller-lighting', `fog-${name}`, 'fog', 'ge/sw', false, [...CABIN_GROMMET, ...bayToFront(side), [side * 656, 566, -664]]),
      wire(`fog-${name}-return`, `fog-${name}`, 'ground', 'fog', 'br', true, [[side * 656, 566, -664], ...frontToGround(side)]),
      wire(`rear-${name}-feed`, 'controller-lighting', `rear-${name}`, `rear-${name}`, 'gr/sw', false, [...cabinToUnderfloor(side), ...rearQuarterRun(side)]),
      wire(`rear-${name}-return`, `rear-${name}`, 'ground', `rear-${name}`, 'br', true, [...reversed(rearQuarterRun(side)), ...underfloorToGround(side)]),
    ];
  }),
  ...DOOR_IDS.flatMap(id => {
    const { side, hingeDepth } = doorDefinition(id);
    const drop = doorDrop(side, hingeDepth);
    return [
      wire(`door-${id}-feed`, 'controller-comfort', `door-${id}`, 'comfort', 'ro/sw', false, [...toDoorSide(side), ...drop]),
      wire(`door-${id}-return`, `door-${id}`, 'ground', 'comfort', 'br', true, [...reversed(drop), ...(side < 0 ? [] : fromDoorSide(side)), ...CABIN_GROMMET]),
      wire(`door-${id}-command`, 'controller-comfort', `door-${id}`, 'door-command', 'li', false, [...toDoorSide(side), ...drop]),
      wire(`door-${id}-feedback`, `door-${id}`, 'controller-comfort', 'door-feedback', 'li/ws', false, [...reversed(drop), ...fromDoorSide(side)]),
    ];
  }),
  wire('cabin-feed', 'controller-comfort', 'cabin', 'cabin', 'ro/ge', false, [[-640, 742, 738], ...A_PILLAR, ...HEADLINER.slice(1, 4)]),
  wire('cabin-return', 'cabin', 'ground', 'cabin', 'br', true, [...reversed(HEADLINER.slice(1, 4)), ...reversed(A_PILLAR), ...CABIN_GROMMET]),
  wire('cargo-feed', 'controller-comfort', 'cargo', 'cargo', 'ro/ge', false, [...cabinToUnderfloor(-1), ...rearQuarterRun(-1).slice(0, 3), [-548, 900, 2880]]),
  wire('cargo-return', 'cargo', 'ground', 'cargo', 'br', true, [[-548, 900, 2880], ...reversed(rearQuarterRun(-1)).slice(1), ...underfloorToGround(-1)]),
  wire('hatch-stop-feed', 'controller-lighting', 'hatch-stop', 'brake', 'sw/ro', false, [[-640, 742, 738], ...A_PILLAR, ...HEADLINER.slice(1), HATCH_PIVOT]),  wire('hatch-stop-return', 'hatch-stop', 'ground', 'brake', 'br', true, [HATCH_PIVOT, ...reversed(HEADLINER), ...reversed(A_PILLAR).slice(1), ...CABIN_GROMMET]),
];

const LOOM = buildLoom(RAW_WIRES, loomZone);

/** Chicotes montados a partir dos trechos que os fios percorrem juntos. */
export const BODY_LOOM = LOOM.bundles;
export const BODY_WIRES: BodyWire[] = RAW_WIRES.map(route => ({ ...route, points: LOOM.routes.get(route.id) as BodyPoint[] }));

export function bodyWireSample(route: BodyWire, state: BodyControlState, output: BodyOutput) {
  let active: boolean;
  switch (route.circuit) {
    case 'battery': active = true; break;
    case 'main': active = output.voltage > 0; break;
    case 'controller': active = output.lighting || output.comfort; break;
    case 'door-command':
    case 'door-feedback': active = output.comfort; break;
    case 'head-left': active = output.position || output.leftLow || output.leftIndicator; break;
    case 'head-right': active = output.position || output.low || output.rightIndicator; break;
    case 'rear-left': active = output.position || output.brake || output.leftIndicator; break;
    case 'rear-right': active = output.position || output.brake || output.rightIndicator; break;
    case 'cargo': active = bodyLampOn(output, 'cargo', 1, state); break;
    default: active = output[route.circuit];
  }
  const points = route.movingEnd ? route.points.map((point, index) => (index === 0 && route.from === 'hatch-stop' || index === route.points.length - 1 && route.to === 'hatch-stop') ? bodyHingePoint(point, HATCH_PIVOT, state.hatch * HATCH_ANGLE) : point) : route.points;
  const isSignal = route.circuit === 'door-command' || route.circuit === 'door-feedback';
  const doorId = (route.from.startsWith('door-') ? route.from : route.to).slice(5) as DoorId;
  const signal = !active || !isSignal ? null : route.circuit === 'door-command' ? { locked: state.locked, windowTarget: state.doors[doorId].windowTarget, windowPower: output.windowPower } : { open: state.doors[doorId].open, window: state.doors[doorId].window };
  return { active, voltage: route.return ? 0 : active ? isSignal ? null : 12 : 0, points, signal, role: isSignal ? 'abstract-signal-no-protocol-or-pinout' : route.return ? 'return' : 'power' };
}