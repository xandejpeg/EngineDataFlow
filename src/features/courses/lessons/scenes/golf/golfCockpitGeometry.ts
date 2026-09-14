import { BufferGeometry, Float32BufferAttribute, Shape, Vector2 } from 'three';

export const COCKPIT = {
  steeringPosition: [-390, 915, 965] as [number, number, number],
  steeringTilt: -0.35,
  driverEye: [-180, 1180, 1330] as [number, number, number],
  driverTarget: [-60, 845, 720] as [number, number, number],
  instruments: [[-465, 958, 890], [-315, 958, 890]] as [number, number, number][],
};

export function createDashboardGeometry() {
  const profile = [[230, 850], [210, 977], [380, 990], [730, 950], [825, 929], [861, 890], [842, 754], [705, 732]];
  const positions: number[] = [];
  const indices: number[] = [];
  const columns = 48;
  for (let column = 0; column <= columns; column++) {
    const across = column / columns * 2 - 1;
    const shoulder = Math.abs(across) ** 3;
    profile.forEach(([depth, height], point) => positions.push(across * (point === 1 || point === 2 ? 790 : 685), height - 24 * shoulder, depth - (point < 3 ? 0 : 65 * shoulder)));
    if (column < columns) for (let point = 0; point < profile.length; point++) {
      const vertex = column * profile.length + point;
      const next = column * profile.length + (point + 1) % profile.length;
      indices.push(vertex, next, vertex + profile.length, next, next + profile.length, vertex + profile.length);
    }
  }
  for (let point = 1; point < profile.length - 1; point++) {
    indices.push(0, point + 1, point);
    const offset = columns * profile.length;
    indices.push(offset, offset + point, offset + point + 1);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function steeringSpokeShape(side: number) {
  const points = side === 0
    ? [[-42, -18], [42, -18], [27, -146], [-27, -146]]
    : [[side * 40, 30], [side * 151, 33], [side * 151, -8], [side * 55, -36]];
  return new Shape(points.map(([horizontal, height]) => new Vector2(horizontal, height)));
}