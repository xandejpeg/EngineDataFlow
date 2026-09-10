import type { Position } from './golfAssembly';
import { engineToWorld } from './golfPhysics';

export const COOLING_PORTS = {
  radiatorUpper: [-335, 715, -780] as Position,
  radiatorLower: [335, 360, -780] as Position,
  headOutlet: engineToWorld([285, 250, 80]),
  thermostat: engineToWorld([280, 40, 85]),
  expansion: [420, 715, 140] as Position,
  heaterInlet: [-60, 690, 450] as Position,
  heaterOutlet: [60, 690, 450] as Position,
};

export const COOLING_ROUTES: { id: string; from: keyof typeof COOLING_PORTS; to: keyof typeof COOLING_PORTS; radius: number; via: Position[] }[] = [
  { id: 'upper', from: 'headOutlet', to: 'radiatorUpper', radius: 17, via: [[-90, 710, -300], [-250, 740, -540]] },
  { id: 'lower', from: 'radiatorLower', to: 'thermostat', radius: 17, via: [[330, 335, -550], [155, 350, -280]] },
  { id: 'expansion', from: 'expansion', to: 'thermostat', radius: 10, via: [[395, 650, 150], [210, 490, 60]] },
  { id: 'heater-feed', from: 'headOutlet', to: 'heaterInlet', radius: 10, via: [[-60, 720, 230]] },
  { id: 'heater-return', from: 'heaterOutlet', to: 'thermostat', radius: 10, via: [[110, 610, 330], [140, 470, 130]] },
  { id: 'degassing', from: 'radiatorUpper', to: 'expansion', radius: 4, via: [[-300, 795, -650], [290, 815, -320], [430, 795, 40]] },
];

export function coolingRoutePoints(route: typeof COOLING_ROUTES[number]): Position[] {
  return [COOLING_PORTS[route.from], ...route.via, COOLING_PORTS[route.to]];
}