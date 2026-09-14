import { describe, expect, it } from 'vitest';
import { DoubleSide, Mesh, MeshBasicMaterial, Raycaster, ShapeGeometry, Vector3 } from 'three';
import { createBumperGeometry } from './golfBumperGeometry';
import { fitFrontDetail, frontLampOutline, frontNoseBridge, frontPanelPoint, frontReflector } from './golfFrontFit';
import { hoodPanelPoint } from './golfBodyFit';
import { frontCornerSweep } from './golfBodyGeometry';
import { BODY_TOP } from './golfBodyProfile';

describe('front fascia shared surface', () => {
  it('wraps the taller outer lamps back over the fender instead of floating ahead of it', () => {
    const lower = frontPanelPoint(680, 780, 0);
    const upper = frontPanelPoint(680, 830, 0);
    expect(upper[2]).toBeGreaterThan(lower[2] + 80);
    expect(upper[2]).toBeLessThan(-500);
    expect(frontPanelPoint(-680, 830, 0)[2]).toBeCloseTo(upper[2], 3);
  });
  it('raises the outer headlamp shoulder above the grille-side taper', () => {
    const points = frontLampOutline().getPoints(40);
    const inner = points.filter(point => point.x < -140);
    const outer = points.filter(point => point.x > 40);
    expect(Math.max(...outer.map(point => point.y)) - Math.max(...inner.map(point => point.y))).toBeGreaterThan(50);
    expect(Math.min(...points.map(point => point.x))).toBeLessThan(-210);
    expect(Math.max(...points.map(point => point.x))).toBeGreaterThan(195);
  });
  it('closes the nose between the bumper and rounded hood without folding the sides', () => {
    const geometry = frontNoseBridge();
    const vertices = geometry.getAttribute('position');
    const [depth, height] = BODY_TOP.hood[0];
    for (let column = 0; column <= 64; column++) {
      const upper = hoodPanelPoint(column / 32 - 1, depth, height);
      const lower = frontPanelPoint(upper[0], 780, 0);
      for (let axis = 0; axis < 3; axis++) {
        expect(vertices.array[(6 * 65 + column) * 3 + axis]).toBeCloseTo(upper[axis], 3);
        expect(vertices.array[column * 3 + axis]).toBeCloseTo(lower[axis], 3);
      }
    }
    for (let depth = -915; depth < -500; depth++) expect(depth + 1 + frontCornerSweep(depth + 1)).toBeGreaterThan(depth + frontCornerSweep(depth));
    expect(frontCornerSweep(-357)).toBe(0);
    geometry.dispose();
  });
  it('keeps reflector bowls between their housing and transparent cover', () => {
    for (const side of [-1, 1]) {
      const geometry = frontReflector(side, [638, 709], 30, 61);
      const vertices = geometry.getAttribute('position');
      const depths: number[] = [];
      for (let index = 0; index < vertices.count; index++) {
        const skin = frontPanelPoint(vertices.getX(index), vertices.getY(index), 0);
        const clearance = skin[2] - vertices.getZ(index);
        expect(clearance).toBeGreaterThan(9.99);
        expect(clearance).toBeLessThan(16.01);
        depths.push(clearance);
      }
      expect(Math.max(...depths) - Math.min(...depths)).toBeCloseTo(6, 2);
      geometry.dispose();
    }
  });
  it('keeps lamps, grille and fog pockets ahead of the actual bumper', () => {
    const geometry = createBumperGeometry(false);
    const material = new MeshBasicMaterial({ side: DoubleSide });
    const bumper = new Mesh(geometry, material);
    bumper.updateMatrixWorld();
    for (const height of [350, 430, 569, 650, 708, 775]) for (const horizontal of [-735, -625, -550, -340, 0, 340, 550, 625, 735]) {
      const point = frontPanelPoint(horizontal, height);
      const hits = new Raycaster(new Vector3(...point), new Vector3(0, 0, 1)).intersectObject(bumper);
      expect(hits.length).toBeGreaterThan(0);
      expect(hits[0].distance).toBeCloseTo(6, 2);
      const mirrored = frontPanelPoint(-horizontal, height);
      expect(mirrored[2]).toBeCloseTo(point[2], 1);
    }
    geometry.dispose(); material.dispose();
  });
  it('fits every headlamp boundary vertex on both sides without changing the silhouette', () => {
    const original = new ShapeGeometry(frontLampOutline(), 24);
    for (const side of [-1, 1]) {
      const fitted = fitFrontDetail(original.clone(), side, [550, 701], 9);
      const vertices = fitted.getAttribute('position');
      const source = original.getAttribute('position');
      for (let index = 0; index < vertices.count; index++) {
        expect(vertices.getX(index)).toBeCloseTo(side * (550 + source.getX(index)), 3);
        expect(vertices.getY(index)).toBeCloseTo(701 + source.getY(index), 3);
        expect(vertices.getZ(index)).toBeCloseTo(frontPanelPoint(vertices.getX(index), vertices.getY(index), 9)[2], 3);
      }
      fitted.dispose();
    }
    original.dispose();
  });
});