import { BufferGeometry, Float32BufferAttribute, ShapeGeometry, type Shape } from 'three';
import { bodyHalfWidth, frontCornerSweep } from './golfBodyGeometry';
import { BODY_TOP } from './golfVehicleGeometry';
import { rearSectionPoint } from './golfRearSurface';

const rearProfile = [...BODY_TOP.rearGlass, ...BODY_TOP.hatch.slice(1)];
export const HOOD_SPLIT = 0.78;
export const HOOD_GAP = 0.002;

export function rearPanelSplit(height: number) {
  if (height < 980) {
    const lower = Math.max(0, Math.min(1, (height - 710) / 130));
    return 0.62 + 0.08 * lower * lower * (3 - 2 * lower);
  }
  const progress = Math.max(0, Math.min(1, (height - 980) / 110));
  return 0.7 + 0.18 * progress * progress * (3 - 2 * progress);
}

export function hoodSplitAt(depth: number) {
  const start = BODY_TOP.hood[0][0];
  const end = BODY_TOP.hood[BODY_TOP.hood.length - 1][0];
  const progress = Math.max(0, Math.min(1, (depth - start) / (end - start)));
  return 0.43 + 0.4 * progress;
}

export function hoodPanelPoint(across: number, depth: number, height: number): [number, number, number] {
  const start = BODY_TOP.hood[0][0];
  const end = BODY_TOP.hood[BODY_TOP.hood.length - 1][0];
  const progress = Math.max(0, Math.min(1, (depth - start) / (end - start)));
  const crown = (1 - across * across) * (14 + 14 * Math.sin(progress * Math.PI));
  const noseSweep = 35 * (1 - across * across) * Math.exp(-Math.pow(progress / 0.12, 2));
  return [across * bodyHalfWidth(height, depth), height + crown, depth - noseSweep + across ** 4 * frontCornerSweep(depth)];
}

export function rearPanelPoint(across: number, height: number, offset = 0): [number, number, number] {
  const baseHeight = height - (1 - across * across) * 14;
  const segment = rearProfile.findIndex((point, index) => index < rearProfile.length - 1 && baseHeight <= point[1] && baseHeight >= rearProfile[index + 1][1]);
  if (segment < 0) throw new RangeError('Rear detail lies outside the body profile');
  const [startDepth, startHeight] = rearProfile[segment];
  const [endDepth, endHeight] = rearProfile[segment + 1];
  const fraction = (startHeight - baseHeight) / (startHeight - endHeight);
  const depth = startDepth + (endDepth - startDepth) * fraction;
  const point = rearSectionPoint(across, depth, baseHeight);
  return [point[0], height, point[2] + offset];
}

export function fitRearDetail(geometry: BufferGeometry, side: number, origin: [number, number], offset = 0) {
  const positions = geometry.getAttribute('position');
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const across = side * (rearPanelSplit(origin[1] + positions.getY(vertex)) + (origin[0] + positions.getX(vertex)) / 800);
    const point = rearPanelPoint(across, origin[1] + positions.getY(vertex), offset + positions.getZ(vertex));
    positions.setXYZ(vertex, ...point);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function rearLampSurface(shape: Shape, side: number, origin: [number, number], offset: number) {
  const source = new ShapeGeometry(shape, 24);
  const vertices = source.getAttribute('position');
  const indices = source.getIndex()!;
  const positions: number[] = [];
  const divisions = 8;
  for (let triangle = 0; triangle < indices.count; triangle += 3) {
    const corners = [0, 1, 2].map(index => indices.getX(triangle + index));
    const point = (row: number, column: number) => {
      const weights = [1 - (row + column) / divisions, row / divisions, column / divisions];
      return [corners.reduce((sum, corner, index) => sum + vertices.getX(corner) * weights[index], 0), corners.reduce((sum, corner, index) => sum + vertices.getY(corner) * weights[index], 0), 0];
    };
    for (let row = 0; row < divisions; row++) for (let column = 0; column < divisions - row; column++) {
      positions.push(...point(row, column), ...point(row + 1, column), ...point(row, column + 1));
      if (row + column < divisions - 1) positions.push(...point(row + 1, column), ...point(row + 1, column + 1), ...point(row, column + 1));
    }
  }
  source.dispose();
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return fitRearDetail(geometry, side, origin, offset);
}