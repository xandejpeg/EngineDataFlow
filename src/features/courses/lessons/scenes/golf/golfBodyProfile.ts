import { CatmullRomCurve3, Vector3 } from 'three';

function profile(points: [number, number][], steps: number): [number, number][] {
  const samples: [number, number][] = new CatmullRomCurve3(points.map(([depth, height]) => new Vector3(depth, height, 0))).getPoints(steps).map(point => [point.x, point.y]);
  samples[0] = [...points[0]];
  samples[steps] = [...points[points.length - 1]];
  return samples;
}

export const BODY_TOP = {
  hood: profile([[-875, 795], [-720, 841], [-400, 902], [-50, 963], [210, 990]], 28),
  windshield: profile([[210, 990], [430, 1220], [760, 1435]], 20),
  roof: profile([[760, 1435], [1100, 1465], [1750, 1475], [2440, 1460], [2820, 1425]], 40),
  rearGlass: profile([[2820, 1425], [3010, 1260], [3170, 1060]], 20),
  hatch: profile([[3170, 1060], [3300, 970], [3340, 865], [3329, 600]], 16),
};