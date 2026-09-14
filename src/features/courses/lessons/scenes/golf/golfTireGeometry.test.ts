import { expect, it } from 'vitest';
import { Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three';
import { createGolfTire } from './golfTireGeometry';

it('exposes the whole alloy face while preserving the nominal tire envelope', () => {
  const geometry = createGolfTire();
  const material = new MeshBasicMaterial();
  const mesh = new Mesh(geometry, material);
  const ray = (radius: number) => new Raycaster(new Vector3(400, radius, 0), new Vector3(-1, 0, 0)).intersectObject(mesh);
  expect(ray(200)).toHaveLength(0);
  expect(ray(260).length).toBeGreaterThan(0);
  geometry.computeBoundingBox();
  expect(geometry.boundingBox!.max.y).toBeCloseTo(317.15, 2);
  expect(geometry.boundingBox!.max.x).toBeCloseTo(110, 2);
  const positions = geometry.getAttribute('position');
  for (let vertex = 0; vertex < positions.count; vertex++) expect(Math.hypot(positions.getY(vertex), positions.getZ(vertex))).toBeGreaterThan(213.99);
  geometry.dispose(); material.dispose();
});