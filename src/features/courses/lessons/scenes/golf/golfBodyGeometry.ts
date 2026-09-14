import { BufferGeometry, Float32BufferAttribute, ShapeGeometry, type Shape } from 'three';

export const BODY_FINISH = { paint: '#e5e9e7', glass: '#344548', trim: '#202629' } as const;

export function frontCornerSweep(depth: number) {
  const progress = Math.max(0, Math.min(1, (-depth - 500) / 375));
  return 160 * progress * progress * (3 - 2 * progress);
}

export function bodyHalfWidth(height: number, depth: number) {
  const archDistance = Math.min(Math.hypot(depth, height - 317), Math.hypot(depth - 2578, height - 317));
  const archProgress = Math.max(0, Math.min(1, (archDistance - 357) / 170));
  const archBlend = archProgress ** 3 * (10 - 15 * archProgress + 6 * archProgress ** 2);
  const waist = Math.max(0, Math.min(1, (height - 317) / 673));
  const lowerRoll = 23 * Math.sin(waist * Math.PI) - 38 * (1 - waist) ** 2;
  const shoulder = 9 * Math.sin(waist * Math.PI) ** 4;
  const belt = height <= 990 ? 837 + archBlend * (lowerRoll + shoulder) : 837 - Math.min(1, (height - 990) / 475) * 127;
  const frontProgress = Math.max(0, Math.min(1, (-depth - 450) / 500));
  const rearProgress = Math.max(0, Math.min(1, (depth - 2850) / 600));
  const endTaper = 45 * frontProgress ** 2 * (3 - 2 * frontProgress) + 65 * rearProgress ** 2 * (3 - 2 * rearProgress);
  const roofWeight = Math.max(0, Math.min(1, (height - 1130) / 320));
  const roofLongitudinal = Math.max(0, Math.min(1, (depth - 760) / 2060));
  const roofTaper = roofWeight * (18 - 38 * Math.sin(roofLongitudinal * Math.PI));
  return belt - endTaper - roofTaper;
}

export function createBodySide(shape: Shape, side: number, inset = 0, valance = false) {
  const flat = new ShapeGeometry(shape, 40);
  const source = flat.getAttribute('position');
  const index = flat.getIndex()!;
  const positions: number[] = [];
  for (let triangle = 0; triangle < index.count; triangle += 3) {
    const vertices = [0, 1, 2].map(offset => index.getX(triangle + offset));
    const longest = Math.max(...vertices.map((vertex, offset) => {
      const next = vertices[(offset + 1) % 3];
      return Math.hypot(source.getX(vertex) - source.getX(next), source.getY(vertex) - source.getY(next));
    }));
    const divisions = Math.max(2, Math.ceil(longest / 45));
    const point = (row: number, column: number) => {
      const weights = [1 - (row + column) / divisions, row / divisions, column / divisions];
      const depth = vertices.reduce((sum, vertex, offset) => sum + source.getX(vertex) * weights[offset], 0);
      const height = vertices.reduce((sum, vertex, offset) => sum + source.getY(vertex) * weights[offset], 0);
      return [side * (bodyHalfWidth(height, depth) + inset), height, depth + frontCornerSweep(depth)];
    };
    for (let row = 0; row < divisions; row++) for (let column = 0; column < divisions - row; column++) {
      positions.push(...point(row, column), ...point(row + 1, column), ...point(row, column + 1));
      if (row + column < divisions - 1) positions.push(...point(row + 1, column), ...point(row + 1, column + 1), ...point(row, column + 1));
    }
  }
  flat.dispose();
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const normals: number[] = [];
  for (let vertex = 0; vertex < positions.length; vertex += 3) {
    const height = positions[vertex + 1]; const mappedDepth = positions[vertex + 2];
    let lowerDepth = mappedDepth - 160; let upperDepth = mappedDepth;
    for (let step = 0; mappedDepth < -500 && step < 24; step++) {
      const middle = (lowerDepth + upperDepth) / 2;
      if (middle + frontCornerSweep(middle) < mappedDepth) lowerDepth = middle; else upperDepth = middle;
    }
    const depth = mappedDepth < -500 ? (lowerDepth + upperDepth) / 2 : mappedDepth;
    const slopeHeight = (bodyHalfWidth(height + 0.1, depth) - bodyHalfWidth(height - 0.1, depth)) / 0.2;
    const slopeDepth = (bodyHalfWidth(height, depth + 0.1) - bodyHalfWidth(height, depth - 0.1)) / (0.2 + frontCornerSweep(depth + 0.1) - frontCornerSweep(depth - 0.1));
    const length = Math.hypot(1, slopeHeight, slopeDepth);
    normals.push(side / length, -slopeHeight / length, -slopeDepth / length);
  }
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  if (valance) {
    const painted: number[] = [];
    const paintedNormals: number[] = [];
    const plastic: number[] = [];
    const plasticNormals: number[] = [];
    const clip = (polygon: number[][], axis: number, boundary: number, above: boolean) => {
      const result: number[][] = [];
      polygon.forEach((point, index) => {
        const previous = polygon[(index + polygon.length - 1) % polygon.length];
        const inside = above ? point[axis] >= boundary : point[axis] <= boundary;
        const previousInside = above ? previous[axis] >= boundary : previous[axis] <= boundary;
        if (inside !== previousInside) {
          const fraction = (boundary - previous[axis]) / (point[axis] - previous[axis]);
          result.push(point.map((value, coordinate) => previous[coordinate] + fraction * (value - previous[coordinate])));
        }
        if (inside) result.push(point);
      });
      return result;
    };
    const append = (polygon: number[][], dark: boolean) => {
      for (let index = 1; index < polygon.length - 1; index++) for (const point of [polygon[0], polygon[index], polygon[index + 1]]) {
        (dark ? plastic : painted).push(...point.slice(0, 3));
        (dark ? plasticNormals : paintedNormals).push(...point.slice(3));
      }
    };
    for (let vertex = 0; vertex < positions.length; vertex += 9) {
      const triangle = [0, 3, 6].map(offset => [...positions.slice(vertex + offset, vertex + offset + 3), ...normals.slice(vertex + offset, vertex + offset + 3)]);
      append(clip(triangle, 1, 480, true), false);
      const lower = clip(triangle, 1, 480, false);
      append(clip(lower, 2, 2935, false), false);
      append(clip(lower, 2, 2935, true), true);
    }
    geometry.setAttribute('position', new Float32BufferAttribute([...painted, ...plastic], 3));
    geometry.setAttribute('normal', new Float32BufferAttribute([...paintedNormals, ...plasticNormals], 3));
    geometry.addGroup(0, painted.length / 3, 0);
    geometry.addGroup(painted.length / 3, plastic.length / 3, 1);
  }
  return geometry;
}