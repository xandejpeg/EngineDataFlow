import { Path, Shape } from 'three';
import { INPUT_SHAFT_MODEL } from './golfInputShaftGeometry';
import { SLAVE_CYLINDER_MODEL } from './golfClutchReference';
import type { Position } from './golfAssembly';

export const GEARBOX_INTERNALS = {
  dimensionalStatus: 'estimated', applicationStatus: 'generic-not-02s-engineering-drawing',
  actuation: 'not-simulated', toothForm: 'schematic-not-involute', ratios: 'not-specified',
  shaftStart: -320, shaftEnd: INPUT_SHAFT_MODEL.position[0] + INPUT_SHAFT_MODEL.start,
  input: [0, 0], output: [-54, 72],
  differential: [-100, -65, 200] as Position,
  outputFlanges: [[-230, -65, 200], [30, -65, 200]] as Position[],
} as const;

export const GEARBOX_PAIRS = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1, axis: -296 + index * 29, width: 12,
  inputTeeth: 28 + index * 3, outputTeeth: 62 - index * 3,
}));

export function schematicGearShape(teeth: number, pitchRadius: number, bore = 14) {
  const shape = new Shape();
  for (let index = 0; index < teeth * 4; index++) {
    const radius = pitchRadius + (index % 4 === 1 || index % 4 === 2 ? 1.7 : -2.3);
    const angle = index / (teeth * 4) * Math.PI * 2;
    const axis = Math.cos(angle) * radius;
    const height = Math.sin(angle) * radius;
    if (index === 0) shape.moveTo(axis, height); else shape.lineTo(axis, height);
  }
  shape.closePath();
  const hole = new Path();
  hole.absarc(0, 0, bore, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

export function gearboxFlangeWorld(position: Position): Position {
  return position.map((value, index) => value + SLAVE_CYLINDER_MODEL.gearboxPosition[index]) as Position;
}