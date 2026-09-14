import { expect, it } from 'vitest';
import { Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three';
import { createMirrorFace, createMirrorShell } from './golfMirrorGeometry';

it('closes mirrored mirror shells and keeps the rear glass ahead of the housing', () => {
  const material = new MeshBasicMaterial();
  const shells = [-1, 1].map(createMirrorShell);
  for (const [offset, side] of [-1, 1].entries()) {
    const geometry = shells[offset];
    const vertices = geometry.getAttribute('position');
    const index = geometry.getIndex()!;
    const edges = new Map<string, number>();
    for (let triangle = 0; triangle < index.count; triangle += 3) for (let corner = 0; corner < 3; corner++) {
      const key = [index.getX(triangle + corner), index.getX(triangle + (corner + 1) % 3)].sort((left, right) => left - right).join(':');
      edges.set(key, (edges.get(key) ?? 0) + 1);
    }
    expect([...edges.values()].every(count => count === 2)).toBe(true);
    expect(Array.from(geometry.getAttribute('normal').array).every(Number.isFinite)).toBe(true);
    const shell = new Mesh(geometry, material);
    shell.updateMatrixWorld(true);
    const glassGeometry = createMirrorFace(side);
    const glass = new Mesh(glassGeometry, material);
    glass.updateMatrixWorld(true);
    const ray = new Raycaster(new Vector3(0, 0, 150), new Vector3(0, 0, -1));
    expect(ray.intersectObject(glass)[0].distance).toBeCloseTo(80);
    expect(ray.intersectObject(shell)[0].distance).toBeCloseTo(84);
    expect(geometry.boundingBox!.max.x - geometry.boundingBox!.min.x).toBeGreaterThan(190);
    for (let vertex = 0; vertex < vertices.count; vertex++) expect(vertices.getX(vertex)).toBeCloseTo(-shells[1 - offset].getAttribute('position').getX(vertex));
    glassGeometry.dispose();
  }
  shells.forEach(shell => shell.dispose()); material.dispose();
});