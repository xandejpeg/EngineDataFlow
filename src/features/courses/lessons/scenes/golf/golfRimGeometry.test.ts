import { expect, it } from 'vitest';
import { Group, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three';
import { createRimSpoke, RIM_SPOKE_COUNT } from './golfRimGeometry';

it('fits ten curved spokes inside the unchanged barrel with open gaps and brake clearance', () => {
  const geometry = createRimSpoke();
  const material = new MeshBasicMaterial();
  const root = new Group();
  for (let index = 0; index < RIM_SPOKE_COUNT; index++) {
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = index * Math.PI * 2 / RIM_SPOKE_COUNT;
    root.add(mesh);
  }
  root.updateMatrixWorld(true);
  const vertices = geometry.getAttribute('position');
  for (let vertex = 0; vertex < vertices.count; vertex++) {
    expect(Math.hypot(vertices.getY(vertex), vertices.getZ(vertex))).toBeLessThan(215);
    expect(vertices.getX(vertex)).toBeGreaterThanOrEqual(59.99);
    expect(vertices.getX(vertex)).toBeLessThan(84.01);
  }
  expect(Array.from(geometry.getAttribute('normal').array).every(Number.isFinite)).toBe(true);
  for (let index = 0; index < RIM_SPOKE_COUNT; index++) {
    const angle = index * Math.PI * 2 / RIM_SPOKE_COUNT;
    const hit = (direction: number) => new Raycaster(new Vector3(200, Math.cos(direction) * 145, Math.sin(direction) * 145), new Vector3(-1, 0, 0)).intersectObject(root, true);
    expect(hit(angle).length).toBeGreaterThan(0);
    expect(hit(angle + Math.PI / RIM_SPOKE_COUNT)).toHaveLength(0);
  }
  geometry.dispose(); material.dispose();
});