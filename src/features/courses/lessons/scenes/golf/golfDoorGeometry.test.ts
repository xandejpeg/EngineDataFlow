import { describe, expect, it } from 'vitest';
import { DoubleSide, Mesh, MeshBasicMaterial, Raycaster, Vector2, Vector3 } from 'three';
import { createBodySide } from './golfBodyGeometry';
import { BODY_ARCH, VEHICLE_WINDOWS, createVehicleOutline } from './golfVehicleGeometry';
import { DOOR_IDS } from './golfBodyControl';
import { DOOR_OPENINGS, DOOR_OPEN_ANGLE, createCabinSeal, createDoorEdgeGeometry, createDoorPanelGeometry, createDoorPillarTrim, createDoorRubStrip, createDoorSideOutline, createDoorWindowGeometry, createFixedPillarTrim, createWindowSurround, doorDefinition, doorPanelContour, doorRoofHeight, doorWindowDrop } from './golfDoorGeometry';

function contains(polygon: { x: number; y: number }[], depth: number, height: number) {
  let inside = false;
  polygon.forEach((point, index) => {
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    if ((point.y > height) !== (previous.y > height) && depth < (previous.x - point.x) * (height - point.y) / (previous.y - point.y) + point.x) inside = !inside;
  });
  return inside;
}

describe('estimated four-door geometry', () => {
  it('returns each door perimeter inward without changing its outer boundary', () => {
    for (const id of DOOR_IDS) {
      const { side } = doorDefinition(id);
      const geometry = createDoorEdgeGeometry(id);
      const vertices = geometry.getAttribute('position');
      expect(Array.from(geometry.getAttribute('normal').array).every(Number.isFinite)).toBe(true);
      for (let vertex = 0; vertex < vertices.count; vertex += 2) {
        expect(side * (vertices.getX(vertex) - vertices.getX(vertex + 1))).toBeCloseTo(28, 3);
        expect(vertices.getY(vertex)).toBe(vertices.getY(vertex + 1));
        expect(vertices.getZ(vertex)).toBe(vertices.getZ(vertex + 1));
      }
      expect(geometry.getIndex()!.count).toBe(vertices.count * 3);
      geometry.dispose();
    }
  });
  it('rounds glass corners and leaves glazing open through the fitted surrounds', () => {
    const material = new MeshBasicMaterial({ side: DoubleSide });
    VEHICLE_WINDOWS.forEach((points, index) => {
      expect(points.length).toBeGreaterThan(20);
      for (const side of [-1, 1]) {
        const surround = new Mesh(createWindowSurround(index, side), material);
        surround.updateMatrixWorld();
        const depth = [1100, 1900, 2300][index];
        expect(new Raycaster(new Vector3(side * 2000, 1200, depth), new Vector3(-side, 0, 0)).intersectObject(surround)).toHaveLength(0);
        const seal = createCabinSeal(points, side, 2, 3);
        expect(Array.from(seal.getAttribute('position').array).every(Number.isFinite)).toBe(true);
        seal.dispose(); surround.geometry.dispose();
      }
    });
    material.dispose();
  });

  it('keeps split pillar trims on their panels and rub strips below glazing', () => {
    for (const id of DOOR_IDS) {
      const { pivot, index } = doorDefinition(id);
      const pillar = createDoorPillarTrim(id);
      const panel = doorPanelContour(index).map(point => new Vector2(...point));
      const vertices = pillar.getAttribute('position');
      expect(vertices.count).toBeGreaterThan(0);
      for (let vertex = 0; vertex < vertices.count; vertex++) {
        const depth = vertices.getZ(vertex) + pivot[2];
        const height = vertices.getY(vertex) + pivot[1];
        const centreDepth = index === 0 ? 1515 : 1575;
        expect(contains(panel, depth * 0.999 + centreDepth * 0.001, height * 0.999 + 1200 * 0.001)).toBe(true);
        expect(index === 0 ? depth > 1500 : depth < 1590).toBe(true);
      }
      const strip = createDoorRubStrip(id);
      strip.computeBoundingBox();
      expect(strip.boundingBox!.max.y + pivot[1]).toBeLessThan(990);
      pillar.dispose(); strip.dispose();
    }
    for (const side of [-1, 1]) {
      const pillar = createFixedPillarTrim(side);
      pillar.computeBoundingBox();
      expect(pillar.boundingBox!.min.z).toBeGreaterThan(1535);
      expect(pillar.boundingBox!.max.z).toBeLessThan(1560);
      pillar.dispose();
    }
  });

  it('keeps complete disjoint openings inside the existing outline and clear of roof and arches', () => {
    const outline = createVehicleOutline().getPoints(100);
    DOOR_OPENINGS.forEach((points, index) => points.forEach((point, vertex) => {
      const next = points[(vertex + 1) % points.length];
      for (let step = 0; step <= 40; step++) {
        const depth = point[0] + (next[0] - point[0]) * step / 40;
        const height = point[1] + (next[1] - point[1]) * step / 40;
        expect(contains(outline, depth, height)).toBe(true);
        expect(height).toBeLessThan(doorRoofHeight(depth));
        expect(Math.hypot(depth - (index === 0 ? 0 : 2578), height - BODY_ARCH.centreHeight)).toBeGreaterThan(BODY_ARCH.radius);
      }
    }));
    expect(Math.max(...DOOR_OPENINGS[0].map(point => point[0]))).toBeLessThan(Math.min(...DOOR_OPENINGS[1].map(point => point[0])));
  });

  it('encloses the rear quarter in the rear door while keeping it separate from the sliding pane', () => {
    [0, 1].forEach(index => {
      const polygon = doorPanelContour(index).map(point => new Vector2(...point));
      VEHICLE_WINDOWS[index].forEach(point => expect(contains(polygon, ...point)).toBe(true));
      VEHICLE_WINDOWS[2].forEach(point => expect(contains(polygon, ...point)).toBe(index === 1));
    });
    expect(createDoorSideOutline().holes).toHaveLength(2);
    expect(Math.max(...VEHICLE_WINDOWS[1].map(point => point[0]))).toBeLessThan(Math.min(...VEHICLE_WINDOWS[2].map(point => point[0])));
  });

  it('raycasts through door apertures but hits the fixed pillar and moving lower panels on both sides', () => {
    for (const side of [-1, 1]) {
      const material = new MeshBasicMaterial({ side: DoubleSide });
      const fixed = new Mesh(createBodySide(createDoorSideOutline(), side), material);
      fixed.updateMatrixWorld(true);
      const hit = (mesh: Mesh, depth: number, height: number) => new Raycaster(new Vector3(side * 2000, height, depth), new Vector3(-side, 0, 0)).intersectObject(mesh).length;
      expect(hit(fixed, 1000, 750)).toBe(0);
      expect(hit(fixed, 1900, 750)).toBe(0);
      expect(hit(fixed, 1547, 750)).toBeGreaterThan(0);
      expect(hit(fixed, 2450, 1120)).toBe(0);
      DOOR_IDS.filter(id => doorDefinition(id).side === side).forEach(id => {
        const { pivot, index } = doorDefinition(id);
        const panel = new Mesh(createDoorPanelGeometry(id), material);
        panel.position.set(...pivot);
        panel.updateMatrixWorld(true);
        expect(hit(panel, index === 0 ? 1000 : 1900, 750)).toBeGreaterThan(0);
        expect(hit(panel, index === 0 ? 1100 : 1900, 1200)).toBe(0);
        if (index === 1) expect(hit(panel, 2300, 1200)).toBe(0);
        panel.geometry.dispose();
      });
      fixed.geometry.dispose();
      material.dispose();
    }
  });

  it('rotates trailing edges outward about a vertical front hinge on both sides', () => {
    DOOR_IDS.forEach(id => {
      const { side, pivot } = doorDefinition(id);
      const trailing = new Vector3(0, 0, 650).applyAxisAngle(new Vector3(0, 1, 0), side * DOOR_OPEN_ANGLE).add(new Vector3(...pivot));
      expect(side * (trailing.x - pivot[0])).toBeGreaterThan(500);
      expect(trailing.y).toBe(pivot[1]);
    });
  });

  it('slides each pane down without visible glass below the belt, and hides it fully down', () => {
    DOOR_IDS.forEach(id => {
      for (const closed of [1, 0.75, 0.5, 0.1, 0]) {
        const geometry = createDoorWindowGeometry(id, closed);
        const positions = geometry.getAttribute('position');
        const { pivot } = doorDefinition(id);
        if (closed === 0) expect(positions?.count ?? 0).toBe(0);
        else {
          expect(positions.count).toBeGreaterThan(0);
          for (let vertex = 0; vertex < positions.count; vertex++) expect(positions.getY(vertex) + pivot[1] - doorWindowDrop(closed)).toBeGreaterThanOrEqual(989.999);
        }
        geometry.dispose();
      }
    });
  });
});