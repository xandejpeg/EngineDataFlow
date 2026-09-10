import { describe, expect, it } from 'vitest';
import { COOLING_PORTS, COOLING_ROUTES, coolingRoutePoints } from './golfCoolingGeometry';

describe('estimated cooling circuit', () => {
  it('connects each route exactly to its named component ports', () => {
    expect(new Set(COOLING_ROUTES.map(route => route.id)).size).toBe(6);
    for (const route of COOLING_ROUTES) {
      const points = coolingRoutePoints(route);
      expect(points[0]).toEqual(COOLING_PORTS[route.from]);
      expect(points.at(-1)).toEqual(COOLING_PORTS[route.to]);
      expect(points.flat().every(Number.isFinite)).toBe(true);
      points.slice(1).forEach((point, index) => expect(point).not.toEqual(points[index]));
    }
  });
  it('includes radiator return, heater return and expansion feed at thermostat', () => {
    expect(COOLING_ROUTES.filter(route => route.to === 'thermostat').map(route => route.id)).toEqual(['lower', 'expansion', 'heater-return']);
    expect(COOLING_ROUTES.some(route => route.from === 'headOutlet' && route.to === 'heaterInlet')).toBe(true);
  });
});