import { BufferGeometry, Float32BufferAttribute } from 'three';

export function createSeatPad(width: number, height: number, depth: number) {
  const segments = 64;
  const rings = [[-0.5, 0.78], [-0.36, 0.96], [0, 1], [0.33, 0.96], [0.46, 0.72], [0.37, 0.36]];
  const positions: number[] = [];
  const indices: number[] = [];
  for (const [vertical, scale] of rings) for (let segment = 0; segment < segments; segment++) {
    const angle = segment / segments * Math.PI * 2;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const across = Math.sign(cosine) * Math.abs(cosine) ** 0.45;
    const along = Math.sign(sine) * Math.abs(sine) ** 0.45;
    positions.push(across * width / 2 * scale * (1 - 0.05 * along), vertical * height, along * depth / 2 * scale);
  }
  for (let ring = 0; ring < rings.length - 1; ring++) for (let segment = 0; segment < segments; segment++) {
    const first = ring * segments + segment;
    const next = ring * segments + (segment + 1) % segments;
    indices.push(first, first + segments, next, next, first + segments, next + segments);
  }
  const bottom = positions.length / 3;
  positions.push(0, -height / 2, 0, 0, height * 0.35, 0);
  for (let segment = 0; segment < segments; segment++) {
    const next = (segment + 1) % segments;
    indices.push(bottom, segment, next);
    const last = (rings.length - 1) * segments;
    indices.push(bottom + 1, last + next, last + segment);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}