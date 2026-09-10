import { engineToWorld } from './golfPhysics';
import type { Position } from './golfAssembly';
import type { EgasFault } from './golfEgas';

export const EGAS_PEDAL_ORIGIN: Position = [-240, 450, 690];
export const EGAS_PEDAL_PLUG: Position = [-215, 465, 690];
export const EGAS_ECU_ORIGIN: Position = [-350, 930, 450];
export const EGAS_ECU_PLUG: Position = [-350, 930, 358];
export const EGAS_THROTTLE_ORIGIN: Position = [316, 215, 161];
export const EGAS_THROTTLE_PLUG = engineToWorld([408, 215, 161]);

export const EGAS_WIRES = [
  ...['reference-1', 'ground-1', 'pedal-1', 'reference-2', 'ground-2', 'pedal-2'].map((id, index) => {
    const start: Position = [EGAS_PEDAL_PLUG[0] + index * 3, EGAS_PEDAL_PLUG[1], EGAS_PEDAL_PLUG[2]];
    const end: Position = [EGAS_ECU_PLUG[0] + index * 3, EGAS_ECU_PLUG[1], EGAS_ECU_PLUG[2]];
    return { id, fault: (id.startsWith('reference') ? 'reference' : id === 'pedal-2' ? 'pedal-signal' : 'none') as EgasFault, color: id.startsWith('reference') ? '#b4504d' : id.startsWith('ground') ? '#3c4945' : '#138b91', points: [start, [start[0], 650, 625], [-280 + index * 3, 860, 475], end] as Position[] };
  }),
  ...['motor-positive', 'motor-negative', 'position-reference', 'position-ground', 'position-1', 'position-2'].map((id, index) => {
    const start: Position = [EGAS_ECU_PLUG[0] + 30 + index * 3, EGAS_ECU_PLUG[1], EGAS_ECU_PLUG[2]];
    const end: Position = [EGAS_THROTTLE_PLUG[0], EGAS_THROTTLE_PLUG[1] + index * 3, EGAS_THROTTLE_PLUG[2]];
    return { id, fault: (id === 'motor-positive' ? 'motor-wire' : id === 'position-reference' ? 'reference' : id === 'position-2' ? 'position-signal' : 'none') as EgasFault, color: id.startsWith('motor') ? '#ab7b37' : id.includes('ground') ? '#3c4945' : '#5d7cb3', points: [start, [-250, 840 + index * 3, 270], [-130, 780 + index * 3, 10], end] as Position[] };
  }),
];