import { expect, it } from 'vitest';
import { Vector3 } from 'three';
import { createSeatPad } from './golfUpholsteryGeometry';

it('closes tapered upholstery with finite outward-facing triangles', () => {
  const geometry = createSeatPad(450, 100, 470);
  const positions = geometry.getAttribute('position');
  const index = geometry.getIndex()!;
  const edges = new Map<string, number>();
  for (let triangle = 0; triangle < index.count; triangle += 3) {
    const vertices = [0, 1, 2].map(offset => index.getX(triangle + offset));
    const [first, second, third] = vertices.map(vertex => new Vector3().fromBufferAttribute(positions, vertex));
    expect(second.clone().sub(first).cross(third.clone().sub(first)).length()).toBeGreaterThan(0.01);
    vertices.forEach((vertex, corner) => {
      const key = [vertex, vertices[(corner + 1) % 3]].sort((left, right) => left - right).join(':');
      edges.set(key, (edges.get(key) ?? 0) + 1);
    });
  }
  expect([...edges.values()].every(count => count === 2)).toBe(true);
  expect(Array.from(geometry.getAttribute('normal').array).every(Number.isFinite)).toBe(true);
  expect(geometry.getAttribute('normal').getY(positions.count - 1)).toBeGreaterThan(0.99);
  expect(geometry.getAttribute('normal').getY(positions.count - 2)).toBeLessThan(-0.99);
  expect(geometry.boundingBox!.min.y).toBe(-50);
  expect(geometry.boundingBox!.max.z).toBe(235);
  expect(positions.getY(positions.count - 1)).toBeLessThan(geometry.boundingBox!.max.y);
  geometry.dispose();
});