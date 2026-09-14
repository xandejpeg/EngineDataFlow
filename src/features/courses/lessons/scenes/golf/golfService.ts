import { FUSE_BOX_POSITIONS, type Position } from './golfAssembly';
import { FUSE_CIRCUITS, FUSE_NODES, type ElectricalNode, type FuseCircuit } from './golfElectrical';

export type ServiceArea = 'engine' | 'cabin' | 'battery';
export interface TestPoint { id: string; label: string; node: ElectricalNode; position: Position; area: ServiceArea }

const FUSE_MOUNTS: Record<FuseCircuit, { area: 'engine' | 'cabin'; position: Position }> = {
  main: { area: 'engine', position: [-48, 13, -35] },
  ecu: { area: 'engine', position: [-16, 13, -35] },
  pump: { area: 'engine', position: [16, 13, -35] },
  ignition: { area: 'engine', position: [48, 13, -35] },
  lighting: { area: 'engine', position: [-62, 13, 28] },
  comfort: { area: 'engine', position: [-31, 13, 28] },
  fan: { area: 'engine', position: [0, 13, 28] },
  diagnostics: { area: 'cabin', position: [0, 13, -25] },
  instrument: { area: 'cabin', position: [0, 13, 20] },
};

export function fuseMount(id: FuseCircuit): { area: 'engine' | 'cabin'; position: Position } {
  return FUSE_MOUNTS[id];
}

export function carrierToWorld(area: 'engine' | 'cabin', point: Position): Position {
  const origin = FUSE_BOX_POSITIONS[area];
  const rotated: Position = area === 'cabin' ? [-point[1], point[0], point[2]] : point;
  return [origin[0] + rotated[0], origin[1] + rotated[1], origin[2] + rotated[2]];
}

export const RELAY_TESTS: { id: string; label: string; node: ElectricalNode; local: Position }[] = [
  { id: 'relay30', label: 'Rele / 30', node: 'ecuFeed', local: [29, 51, 21] },
  { id: 'relay87', label: 'Rele / 87', node: 'relay87', local: [47, 51, 21] },
  { id: 'relay85', label: 'Rele / 85', node: 'relay85', local: [29, 51, 39] },
  { id: 'relay86', label: 'Rele / 86', node: 'relay86', local: [47, 51, 39] },
];

export const TEST_POINTS: TestPoint[] = [
  { id: 'batteryPlus', label: 'Bateria / positivo', node: 'batteryPlus', position: [-535, 912, 310], area: 'battery' },
  { id: 'batteryMinus', label: 'Bateria / negativo', node: 'ground', position: [-365, 912, 310], area: 'battery' },
  { id: 'bodyGround', label: 'Massa do cofre', node: 'ground', position: [-650, 786, 350], area: 'engine' },
  ...FUSE_CIRCUITS.flatMap(circuit => {
    const mount = fuseMount(circuit.id);
    return FUSE_NODES[circuit.id].map((node, index): TestPoint => ({
      id: `${circuit.id}-${index === 0 ? 'in' : 'out'}`, label: `${circuit.label} / ${index === 0 ? 'entrada' : 'saida'}`, node, area: mount.area,
      position: carrierToWorld(mount.area, [mount.position[0] + (index === 0 ? -6 : 6), mount.position[1] + 29, mount.position[2]]),
    }));
  }),
  ...RELAY_TESTS.map((point): TestPoint => ({ id: point.id, label: point.label, node: point.node, area: 'engine', position: carrierToWorld('engine', point.local) })),
];

export function testPoint(id: string): TestPoint | undefined { return TEST_POINTS.find(point => point.id === id); }