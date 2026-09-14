import { BufferGeometry, Float32BufferAttribute, Path, Shape, ShapeGeometry } from 'three';
import { BUMPER_COLUMNS, createBumperGeometry } from './golfBumperGeometry';
import { hoodPanelPoint } from './golfBodyFit';
import { BODY_TOP } from './golfBodyProfile';
import { bodyHalfWidth } from './golfBodyGeometry';
import { frontIntakeShapes } from './golfFrontOpenings';

const surface = createBumperGeometry(false);
const positions = surface.getAttribute('position');
const indices = surface.getIndex()!;

export function frontPanelPoint(horizontal: number, height: number, clearance = 6, normal?: [number, number, number]): [number, number, number] {
  if (height > 780) {
    let previous = frontPanelPoint(horizontal, 780, 0);
    for (const [depth, rowHeight] of BODY_TOP.hood) {
      const next = hoodPanelPoint(horizontal / bodyHalfWidth(rowHeight, depth), depth, rowHeight);
      if (height <= next[1]) {
        const fraction = (height - previous[1]) / (next[1] - previous[1]);
        return [horizontal, height, previous[2] + (next[2] - previous[2]) * fraction - clearance];
      }
      previous = next;
    }
    throw new RangeError(`Front detail above hood: ${horizontal}, ${height}`);
  }
  const sampleHeight = Math.max(300, Math.min(780, height));
  let frontDepth = Number.POSITIVE_INFINITY;
  for (let row = 0; row < 40; row++) {
    const lower = positions.getY(row * (BUMPER_COLUMNS + 1));
    const upper = positions.getY((row + 1) * (BUMPER_COLUMNS + 1));
    if (sampleHeight < lower || sampleHeight > upper) continue;
    for (let offset = row * BUMPER_COLUMNS * 6; offset < (row + 1) * BUMPER_COLUMNS * 6; offset += 3) {
      const first = indices.getX(offset), second = indices.getX(offset + 1), third = indices.getX(offset + 2);
      const firstX = positions.getX(first), firstY = positions.getY(first);
      const secondX = positions.getX(second), secondY = positions.getY(second);
      const thirdX = positions.getX(third), thirdY = positions.getY(third);
      const determinant = (secondY - thirdY) * (firstX - thirdX) + (thirdX - secondX) * (firstY - thirdY);
      if (Math.abs(determinant) < 0.000001) continue;
      const firstWeight = ((secondY - thirdY) * (horizontal - thirdX) + (thirdX - secondX) * (sampleHeight - thirdY)) / determinant;
      const secondWeight = ((thirdY - firstY) * (horizontal - thirdX) + (firstX - thirdX) * (sampleHeight - thirdY)) / determinant;
      const thirdWeight = 1 - firstWeight - secondWeight;
      if (Math.min(firstWeight, secondWeight, thirdWeight) < -0.000001) continue;
      const depth = firstWeight * positions.getZ(first) + secondWeight * positions.getZ(second) + thirdWeight * positions.getZ(third);
      if (depth >= frontDepth) continue;
      frontDepth = depth;
      if (normal) {
        const normals = surface.getAttribute('normal');
        for (let axis = 0; axis < 3; axis++) normal[axis] = firstWeight * normals.getComponent(first, axis) + secondWeight * normals.getComponent(second, axis) + thirdWeight * normals.getComponent(third, axis);
        const length = Math.hypot(...normal);
        for (let axis = 0; axis < 3; axis++) normal[axis] /= length;
      }
    }
  }
  if (Number.isFinite(frontDepth)) return [horizontal, height, frontDepth - clearance];
  throw new RangeError(`Front detail outside fascia: ${horizontal}, ${height}`);
}

export function fitFrontDetail<Geometry extends BufferGeometry>(geometry: Geometry, side: number, center: [number, number], clearance: number) {
  const vertices = geometry.getAttribute('position');
  for (let index = 0; index < vertices.count; index++) {
    const point = frontPanelPoint(side * (center[0] + vertices.getX(index)), center[1] + vertices.getY(index), clearance - vertices.getZ(index));
    vertices.setXYZ(index, ...point);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function frontLampOutline() {
  const shape = new Shape();
  shape.moveTo(-214, -62);
  shape.quadraticCurveTo(-215, -20, -163, 14);
  shape.quadraticCurveTo(-60, 55, 83, 74);
  shape.quadraticCurveTo(174, 82, 195, 37);
  shape.quadraticCurveTo(215, -7, 197, -66);
  shape.quadraticCurveTo(50, -94, -185, -80);
  shape.quadraticCurveTo(-217, -79, -214, -62);
  shape.closePath();
  return shape;
}

export function frontShapeSurface(shape: Shape, side: number, center: [number, number], clearance: number) {
  const flat = new ShapeGeometry(shape, 24);
  const vertices = flat.getAttribute('position');
  const triangles = flat.getIndex()!;
  const points: number[] = [];
  for (let triangle = 0; triangle < triangles.count; triangle += 3) {
    const corners = [0, 1, 2].map(offset => triangles.getX(triangle + offset));
    const longest = Math.max(...corners.map((corner, offset) => {
      const next = corners[(offset + 1) % 3];
      return Math.hypot(vertices.getX(corner) - vertices.getX(next), vertices.getY(corner) - vertices.getY(next));
    }));
    const divisions = Math.max(4, Math.ceil(longest / 30));
    const point = (row: number, column: number) => {
      const weights = [1 - (row + column) / divisions, row / divisions, column / divisions];
      return [corners.reduce((sum, corner, offset) => sum + vertices.getX(corner) * weights[offset], 0), corners.reduce((sum, corner, offset) => sum + vertices.getY(corner) * weights[offset], 0), 0];
    };
    for (let row = 0; row < divisions; row++) for (let column = 0; column < divisions - row; column++) {
      points.push(...point(row, column), ...point(row + 1, column), ...point(row, column + 1));
      if (row + column < divisions - 1) points.push(...point(row + 1, column), ...point(row + 1, column + 1), ...point(row, column + 1));
    }
  }
  flat.dispose();
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  return fitFrontDetail(geometry, side, center, clearance);
}

export function frontNoseBridge() {
  const points: number[] = [];
  const faces: number[] = [];
  const [depth, height] = BODY_TOP.hood[0];
  for (let row = 0; row <= 6; row++) for (let column = 0; column <= BUMPER_COLUMNS; column++) {
    const across = column / (BUMPER_COLUMNS / 2) - 1;
    const upper = hoodPanelPoint(across, depth, height);
    const lowerVertex = 40 * (BUMPER_COLUMNS + 1) + column;
    const lower = [positions.getX(lowerVertex), positions.getY(lowerVertex), positions.getZ(lowerVertex)];
    const fraction = row / 6;
    points.push(lower[0] + (upper[0] - lower[0]) * fraction, lower[1] + (upper[1] - lower[1]) * fraction, lower[2] + (upper[2] - lower[2]) * fraction);
    if (row < 6 && column < BUMPER_COLUMNS) {
      const stride = BUMPER_COLUMNS + 1;
      const vertex = row * stride + column;
      faces.push(vertex, vertex + 1, vertex + stride, vertex + 1, vertex + stride + 1, vertex + stride);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

export function frontReflector(side: number, center: [number, number], inner: number, outer: number) {
  const geometry = new BufferGeometry();
  const points: number[] = [];
  const faces: number[] = [];
  for (let row = 0; row <= 6; row++) for (let column = 0; column <= 48; column++) {
    const radius = inner + (outer - inner) * row / 6;
    const angle = column / 48 * Math.PI * 2;
    points.push(radius * Math.cos(angle), radius * Math.sin(angle), -6 * (row / 6) ** 2);
    if (row < 6 && column < 48) {
      const vertex = row * 49 + column;
      faces.push(vertex, vertex + 1, vertex + 49, vertex + 1, vertex + 50, vertex + 49);
    }
  }
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  geometry.setIndex(faces);
  return fitFrontDetail(geometry, side, center, 10);
}

export function createFrontBumperSkin() {
  const outline = new Shape();
  outline.moveTo(-780, 300); outline.lineTo(780, 300);
  outline.lineTo(780, 780); outline.lineTo(-780, 780); outline.closePath();
  const openings = frontIntakeShapes();
  for (const shape of [openings.upper, openings.lower, ...openings.pockets]) outline.holes.push(new Path(shape.getPoints(24)));
  const front = frontShapeSurface(outline, 1, [0, 0], 0);
  const data = [...front.getAttribute('position').array];
  const appendOutside = (triangle: number[][], side: number) => {
    const polygon: number[][] = [];
    triangle.forEach((point, index) => {
      const previous = triangle[(index + 2) % 3];
      const inside = side * point[0] >= 780;
      if (inside !== (side * previous[0] >= 780)) {
        const fraction = (side * 780 - previous[0]) / (point[0] - previous[0]);
        polygon.push(point.map((value, axis) => previous[axis] + (value - previous[axis]) * fraction));
      }
      if (inside) polygon.push(point);
    });
    for (let index = 1; index < polygon.length - 1; index++) data.push(...polygon[0], ...polygon[index], ...polygon[index + 1]);
  };
  for (let index = 0; index < indices.count; index += 3) {
    const triangle = [0, 1, 2].map(offset => {
      const vertex = indices.getX(index + offset);
      return [positions.getX(vertex), positions.getY(vertex), positions.getZ(vertex)];
    });
    appendOutside(triangle, -1); appendOutside(triangle, 1);
  }
  front.dispose();
  const paint: number[] = [];
  const plastic: number[] = [];
  for (let index = 0; index < data.length; index += 9) {
    const meanHeight = (data[index + 1] + data[index + 4] + data[index + 7]) / 3;
    (meanHeight < 340 ? plastic : paint).push(...data.slice(index, index + 9));
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([...paint, ...plastic], 3));
  geometry.addGroup(0, paint.length / 3, 0);
  geometry.addGroup(paint.length / 3, plastic.length / 3, 1);
  geometry.computeVertexNormals();
  const skinPositions = geometry.getAttribute('position');
  const skinNormals = geometry.getAttribute('normal');
  const normal: [number, number, number] = [0, 0, -1];
  for (let vertex = 0; vertex < skinPositions.count; vertex++) {
    if (Math.abs(skinPositions.getX(vertex)) > 780.01) continue;
    frontPanelPoint(skinPositions.getX(vertex), skinPositions.getY(vertex), 0, normal);
    skinNormals.setXYZ(vertex, ...normal);
  }
  return geometry;
}

export function frontIntakeWall(shape: Shape, recess = 35) {
  const boundary = shape.getSpacedPoints(96);
  const data: number[] = [];
  for (let index = 0; index < boundary.length - 1; index++) {
    const start = boundary[index];
    const end = boundary[index + 1];
    const outerStart = frontPanelPoint(start.x, start.y, 1);
    const outerEnd = frontPanelPoint(end.x, end.y, 1);
    const innerStart = frontPanelPoint(start.x, start.y, -recess);
    const innerEnd = frontPanelPoint(end.x, end.y, -recess);
    data.push(...outerStart, ...outerEnd, ...innerStart, ...outerEnd, ...innerEnd, ...innerStart);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(data, 3));
  geometry.computeVertexNormals();
  return geometry;
}