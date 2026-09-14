import { ExtrudeGeometry, Shape } from 'three';

export const RIM_SPOKE_COUNT = 10;

export function createRimSpoke() {
  const shape = new Shape();
  shape.moveTo(-12, 62);
  shape.quadraticCurveTo(-11, 109, -22, 158);
  shape.quadraticCurveTo(-24, 184, -17, 211);
  shape.lineTo(17, 211);
  shape.quadraticCurveTo(24, 184, 22, 158);
  shape.quadraticCurveTo(11, 109, 12, 62);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: 15, bevelEnabled: true, bevelSize: 2, bevelThickness: 2, bevelSegments: 3, curveSegments: 16 });
  const positions = geometry.getAttribute('position');
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const tangent = positions.getX(vertex);
    const radius = positions.getY(vertex);
    const crown = 5 * Math.sin(Math.max(0, Math.min(1, (radius - 62) / 149)) * Math.PI);
    positions.setXYZ(vertex, 62 + positions.getZ(vertex) + crown, radius, -tangent);
  }
  geometry.clearGroups();
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}