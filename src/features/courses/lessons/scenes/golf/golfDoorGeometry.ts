import { BufferGeometry, CurvePath, Float32BufferAttribute, LineCurve3, Path, Shape, TubeGeometry, Vector2, Vector3 } from 'three';
import { bodyHalfWidth, createBodySide } from './golfBodyGeometry';
import { BODY_TOP, VEHICLE_WINDOWS, createVehicleOutline } from './golfVehicleGeometry';
import type { DoorId } from './golfBodyControl';
import { roundedCabinContour } from './golfCabinContours';

export type DoorPoint = [number, number];
export const DOOR_BELT_HEIGHT = 990;
export const DOOR_WINDOW_TRAVEL = 440;
export const DOOR_OPEN_ANGLE = 1.05;

export function doorRoofHeight(depth: number) {
  const profile = [...BODY_TOP.windshield, ...BODY_TOP.roof];
  const index = profile.findIndex(point => point[0] >= depth);
  if (index <= 0) return profile[0][1];
  const [startDepth, startHeight] = profile[index - 1];
  const [endDepth, endHeight] = profile[index];
  return startHeight + (endHeight - startHeight) * (depth - startDepth) / (endDepth - startDepth);
}

function roofEdge(start: number, end: number): DoorPoint[] {
  return [start, ...BODY_TOP.roof.map(point => point[0]).filter(depth => depth > start && depth < end), end]
    .reverse().map(depth => [depth, doorRoofHeight(depth) - 18]);
}

export const DOOR_OPENINGS: DoorPoint[][] = ([
  [[450, 400], [1430, 400], [1535, 450], ...roofEdge(785, 1535), [270, 1010], [430, 850]],
  [[1560, 400], [2160, 400], [2210, 520], [2290, 720], [2435, 890], [2660, 1020], [2650, 1295], ...roofEdge(1560, 2660)],
] as DoorPoint[][]).map(points => roundedCabinContour(points, 24));

export function doorDefinition(id: DoorId) {
  const side = id.endsWith('left') ? -1 : 1;
  const index = id.startsWith('front') ? 0 : 1;
  const hingeDepth = index === 0 ? 450 : 1560;
  const pivot: [number, number, number] = [side * bodyHalfWidth(800, hingeDepth), 800, hingeDepth];
  return { side, index, pivot, hingeDepth, handleDepth: index === 0 ? 1410 : 2210 };
}

export function doorPanelContour(index: number): DoorPoint[] {
  const points = DOOR_OPENINGS[index];
  const centreDepth = index === 0 ? 990 : 1950;
  return points.map(([depth, height]) => [centreDepth + (depth - centreDepth) * 0.992, 900 + (height - 900) * 0.992]);
}

export function createDoorSideOutline() {
  const shape = createVehicleOutline();
  shape.holes = DOOR_OPENINGS.map(points => {
    const path = new Path(points.map(point => new Vector2(...point)));
    path.closePath();
    return path;
  });
  return shape;
}

export function clipDoorPolygon(points: DoorPoint[], minimumHeight: number): DoorPoint[] {
  const clipped: DoorPoint[] = [];
  points.forEach((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const inside = point[1] >= minimumHeight;
    if (inside !== (previous[1] >= minimumHeight)) {
      const fraction = (minimumHeight - previous[1]) / (point[1] - previous[1]);
      clipped.push([previous[0] + fraction * (point[0] - previous[0]), minimumHeight]);
    }
    if (inside) clipped.push([...point]);
  });
  return clipped;
}

export function doorWindowDrop(closed: number) {
  return (1 - Math.max(0, Math.min(1, closed))) * DOOR_WINDOW_TRAVEL;
}

export function createDoorPanelGeometry(id: DoorId) {
  const { index, side, pivot } = doorDefinition(id);
  const shape = new Shape(doorPanelContour(index).map(point => new Vector2(...point)));
  const window = new Path(VEHICLE_WINDOWS[index].map(point => new Vector2(...point)));
  window.closePath();
  shape.holes.push(window);
  if (index === 1) {
    const quarter = new Path(VEHICLE_WINDOWS[2].map(point => new Vector2(...point)));
    quarter.closePath();
    shape.holes.push(quarter);
  }
  return createBodySide(shape, side).translate(-pivot[0], -pivot[1], -pivot[2]);
}

export function createDoorEdgeGeometry(id: DoorId) {
  const { index, side, pivot } = doorDefinition(id);
  const contour = doorPanelContour(index);
  const points: number[] = [];
  const indices: number[] = [];
  contour.forEach(([depth, height], corner) => {
    const [endDepth, endHeight] = contour[(corner + 1) % contour.length];
    const steps = Math.max(1, Math.ceil(Math.hypot(endDepth - depth, endHeight - height) / 35));
    for (let step = 0; step < steps; step++) {
      const currentDepth = depth + (endDepth - depth) * step / steps;
      const currentHeight = height + (endHeight - height) * step / steps;
      const width = bodyHalfWidth(currentHeight, currentDepth);
      for (const inset of [0, -28]) points.push(side * (width + inset) - pivot[0], currentHeight - pivot[1], currentDepth - pivot[2]);
    }
  });
  const count = points.length / 6;
  for (let point = 0; point < count; point++) {
    const first = point * 2;
    const next = ((point + 1) % count) * 2;
    indices.push(first, next, first + 1, next, next + 1, first + 1);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

export function createDoorTrimInsert(id: DoorId, upper = false) {
  const { index, side, pivot } = doorDefinition(id);
  const fabric: DoorPoint[] = index === 0
    ? [[650, 660], [1410, 675], [1470, 815], [1390, 907], [650, 930], [515, 850]]
    : [[1630, 660], [2180, 670], [2260, 805], [2240, 920], [1630, 932]];
  const contour = upper
    ? clipDoorPolygon(clipDoorPolygon(doorPanelContour(index), 945).map(([depth, height]) => [depth, -height]), -975).map(([depth, height]): DoorPoint => [depth, -height])
    : roundedCabinContour(fabric, 26);
  return createBodySide(new Shape(contour.map(point => new Vector2(...point))), side, upper ? -40 : -46)
    .translate(-pivot[0], -pivot[1], -pivot[2]);
}

export function createDoorWindowGeometry(id: DoorId, closed: number) {
  const { index, side, pivot } = doorDefinition(id);
  const points = clipDoorPolygon(VEHICLE_WINDOWS[index], DOOR_BELT_HEIGHT + doorWindowDrop(closed));
  if (points.length < 3) return new BufferGeometry();
  return createBodySide(new Shape(points.map(point => new Vector2(...point))), side, -2)
    .translate(-pivot[0], -pivot[1], -pivot[2]);
}

export function createCabinSeal(points: DoorPoint[], side: number, inset: number, radius: number) {
  const path = new CurvePath<Vector3>();
  let segments = 0;
  points.forEach(([depth, height], index) => {
    const [endDepth, endHeight] = points[(index + 1) % points.length];
    const count = Math.max(1, Math.ceil(Math.hypot(endDepth - depth, endHeight - height) / 35));
    const sample = (step: number) => {
      const currentDepth = depth + (endDepth - depth) * step / count;
      const currentHeight = height + (endHeight - height) * step / count;
      return new Vector3(side * (bodyHalfWidth(currentHeight, currentDepth) + inset), currentHeight, currentDepth);
    };
    for (let step = 0; step < count; step++) path.add(new LineCurve3(sample(step), sample(step + 1)));
    segments += count;
  });
  return new TubeGeometry(path, Math.max(64, segments * 2), radius, 6, true);
}

export function createWindowSurround(index: number, side: number) {
  const points = VEHICLE_WINDOWS[index];
  const centreDepth = (Math.min(...points.map(point => point[0])) + Math.max(...points.map(point => point[0]))) / 2;
  const centreHeight = (Math.min(...points.map(point => point[1])) + Math.max(...points.map(point => point[1]))) / 2;
  const shape = new Shape(points.map(([depth, height]) => new Vector2(centreDepth + (depth - centreDepth) * 1.018, centreHeight + (height - centreHeight) * 1.035)));
  const opening = new Path(points.map(point => new Vector2(...point)));
  opening.closePath();
  shape.holes.push(opening);
  return createBodySide(shape, side, 1);
}

export function createDoorPillarTrim(id: DoorId) {
  const { index, side, pivot } = doorDefinition(id);
  const upper = clipDoorPolygon(doorPanelContour(index), 993);
  const points = index === 0
    ? clipDoorPolygon(upper.map(([depth, height]) => [height, depth]), 1503).map(([height, depth]): DoorPoint => [depth, height])
    : clipDoorPolygon(upper.map(([depth, height]) => [height, -depth]), -1587).map(([height, depth]): DoorPoint => [-depth, height]);
  return createBodySide(new Shape(points.map(point => new Vector2(...point))), side, 1.5).translate(-pivot[0], -pivot[1], -pivot[2]);
}

export function createDoorRubStrip(id: DoorId) {
  const { index, side, pivot } = doorDefinition(id);
  const start = index === 0 ? 510 : 1610;
  const end = index === 0 ? 1460 : 2255;
  const points = roundedCabinContour([[start, 732], [end - 20, 735], [end, 751], [end - 20, 768], [start, 773]], 18);
  const geometry = createBodySide(new Shape(points.map(point => new Vector2(...point))), side, 2);
  const positions = geometry.getAttribute('position');
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const depth = positions.getZ(vertex);
    const height = positions.getY(vertex);
    const vertical = Math.max(0, Math.sin((height - 732) / 41 * Math.PI));
    const ends = Math.max(0, Math.min(1, (depth - start) / 35, (end - depth) / 35));
    positions.setX(vertex, positions.getX(vertex) + side * 7 * vertical * ends);
  }
  geometry.computeVertexNormals();
  return geometry.translate(-pivot[0], -pivot[1], -pivot[2]);
}

export function createFixedPillarTrim(side: number) {
  const points: DoorPoint[] = [[1536, 993], [1559, 993], [1559, doorRoofHeight(1559) - 24], [1536, doorRoofHeight(1536) - 24]];
  return createBodySide(new Shape(points.map(point => new Vector2(...point))), side, 1.5);
}