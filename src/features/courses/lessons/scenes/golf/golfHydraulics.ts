import { SLAVE_CYLINDER_MODEL } from './golfClutchReference';
import type { Position } from './golfAssembly';

const [gearboxX, gearboxY, gearboxZ] = SLAVE_CYLINDER_MODEL.gearboxPosition;
const [slaveX, slaveY, slaveZ] = SLAVE_CYLINDER_MODEL.position;

export const CLUTCH_HYDRAULICS = {
  dimensionalStatus: 'estimated',
  placementStatus: 'estimated',
  actuation: 'not-simulated',
  sourceFigure: 'N30-0415 / N30-10067',
  master: [-550, 650, 650] as Position,
  reservoir: [-520, 840, 520] as Position,
  slavePort: [gearboxX + slaveX - 59, gearboxY + slaveY + 26, gearboxZ + slaveZ] as Position,
  masterOutlet: [-550, 650, 565] as Position,
  masterSupply: [-526, 674, 605] as Position,
  reservoirOutlet: [-520, 805, 520] as Position,
} as const;

export const CLUTCH_SUPPLY_PATH: Position[] = [
  CLUTCH_HYDRAULICS.reservoirOutlet, [-520, 765, 550], [-526, 720, 590], CLUTCH_HYDRAULICS.masterSupply,
];

export const CLUTCH_PRESSURE_PATH: Position[] = [
  CLUTCH_HYDRAULICS.masterOutlet, [-570, 630, 490], [-605, 610, 380],
  [-605, 585, 200], [-540, 580, 80], [-420, 585, -50],
  [-335, 585, -70], CLUTCH_HYDRAULICS.slavePort,
];