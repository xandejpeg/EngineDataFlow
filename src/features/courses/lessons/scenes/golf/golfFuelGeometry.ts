import { fuelFraction } from './golfFuelSender';
export type FuelPoint = [number, number, number];
export const FUEL_GEOMETRY = { bottom: 325, depth: 260, armLength: 160, pivot: [-250, 455, 2150] as FuelPoint, module: [-150, 470, 2150] as FuelPoint, gauge: [-390, 930, 887] as FuelPoint, senderPlug: [-250, 475, 2165] as FuelPoint, gaugePlug: [-390, 915, 875] as FuelPoint };
export function fuelFloatPose(level: number) {
  const surface = FUEL_GEOMETRY.bottom + FUEL_GEOMETRY.depth * fuelFraction(level);
  const angle = Math.asin((surface - FUEL_GEOMETRY.pivot[1]) / FUEL_GEOMETRY.armLength);
  const tip: FuelPoint = [FUEL_GEOMETRY.pivot[0] + FUEL_GEOMETRY.armLength * Math.cos(angle), surface, FUEL_GEOMETRY.pivot[2]];
  return { angle, surface, tip };
}
export const FUEL_SENDER_ROUTES: { id: string; points: FuelPoint[]; color: string }[] = [
  { id: 'signal', points: [FUEL_GEOMETRY.senderPlug, [-560, 420, 2110], [-610, 400, 1430], [-610, 790, 780], FUEL_GEOMETRY.gaugePlug], color: '#ccaa43' },
  { id: 'return', points: [[-244, 475, 2165], [-550, 428, 2110], [-600, 408, 1430], [-600, 798, 780], [-384, 915, 875]], color: '#725543' },
  { id: 'supply', points: [[-620, 710, 430], [-580, 800, 650], [-402, 915, 875]], color: '#b63e4a' },
  { id: 'ground', points: [[-396, 915, 875], [-570, 760, 670], [-560, 790, 430]], color: '#344953' },
];