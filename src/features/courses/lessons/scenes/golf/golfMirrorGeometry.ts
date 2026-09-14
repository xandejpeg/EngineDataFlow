import { BufferGeometry, Float32BufferAttribute, Shape, ShapeGeometry } from 'three';

function mirrorOutline() {
  const shape = new Shape();
  shape.moveTo(-91, -37);
  shape.quadraticCurveTo(-20, -48, 97, -36);
  shape.quadraticCurveTo(123, -27, 109, 8);
  shape.quadraticCurveTo(86, 60, 30, 64);
  shape.quadraticCurveTo(-48, 75, -80, 30);
  shape.quadraticCurveTo(-96, 8, -91, -37);
  shape.closePath();
  return shape;
}

export function createMirrorShell(side: number) {
  const contour = mirrorOutline().getSpacedPoints(64).slice(0, -1);
  const sections = [[-65, 0.24], [-54, 0.61], [-25, 0.88], [18, 1], [55, 1], [66, 0.96]];
  const positions: number[] = [];
  const indices: number[] = [];
  const materials: number[] = [];
  for (const [depth, scale] of sections) for (const point of contour) positions.push(side * point.x * scale, point.y * scale, depth + point.x * scale * 0.1);
  const face = (first: number, second: number, third: number) => {
    indices.push(first, side > 0 ? second : third, side > 0 ? third : second);
    materials.push((positions[first * 3 + 1] + positions[second * 3 + 1] + positions[third * 3 + 1]) / 3 < -22 ? 1 : 0);
  };
  for (let section = 0; section < sections.length - 1; section++) for (let point = 0; point < contour.length; point++) {
    const first = section * contour.length + point;
    const next = section * contour.length + (point + 1) % contour.length;
    face(first, next, first + contour.length);
    face(next, next + contour.length, first + contour.length);
  }
  const front = positions.length / 3;
  positions.push(0, 0, sections[0][0], 0, 0, sections[sections.length - 1][0]);
  for (let point = 0; point < contour.length; point++) {
    const next = (point + 1) % contour.length;
    const rear = (sections.length - 1) * contour.length;
    face(front, next, point);
    face(front + 1, rear + point, rear + next);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  let start = 0;
  for (let faceIndex = 1; faceIndex <= materials.length; faceIndex++) if (materials[faceIndex] !== materials[start]) {
    geometry.addGroup(start * 3, (faceIndex - start) * 3, materials[start]);
    start = faceIndex;
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

export function createMirrorFace(side: number, bezel = false) {
  const geometry = new ShapeGeometry(mirrorOutline(), 24);
  const positions = geometry.getAttribute('position');
  const scale = bezel ? 0.91 : 0.83;
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const horizontal = positions.getX(vertex) * scale;
    positions.setXYZ(vertex, side * horizontal, positions.getY(vertex) * scale, (bezel ? 68 : 70) + horizontal * 0.1);
  }
  if (side < 0) {
    const index = geometry.getIndex()!;
    for (let triangle = 0; triangle < index.count; triangle += 3) {
      const second = index.getX(triangle + 1);
      index.setX(triangle + 1, index.getX(triangle + 2));
      index.setX(triangle + 2, second);
    }
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}