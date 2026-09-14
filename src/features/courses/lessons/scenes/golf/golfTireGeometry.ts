import { CatmullRomCurve3, LatheGeometry, Vector2, Vector3 } from 'three';

export function createGolfTire() {
  const profile = [[214, -80], [221, -88], [252, -108], [284, -110], [310, -98], [317.15, -78], [317.15, 78], [310, 98], [284, 110], [252, 108], [221, 88], [214, 80], [214, -80]];
  const smooth = new CatmullRomCurve3(profile.slice(0, -1).map(([radius, axis]) => new Vector3(radius, axis, 0)), true).getPoints(96);
  const geometry = new LatheGeometry(smooth.map(point => new Vector2(Math.max(214, Math.min(317.15, point.x)), point.y)), 192).rotateZ(-Math.PI / 2);
  const positions = geometry.getAttribute('position');
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const axis = positions.getX(vertex);
    const height = positions.getY(vertex);
    const depth = positions.getZ(vertex);
    const radius = Math.hypot(height, depth);
    if (radius < 309) continue;
    const angle = Math.atan2(depth, height);
    const channels = [-56, -19, 19, 56].reduce((sum, center) => sum + 3.5 * Math.exp(-(((axis - center) / 3.5) ** 2)), 0);
    const lateral = 1.7 * Math.max(0, Math.cos(angle * 64 + axis * 0.055)) ** 12;
    const target = radius - (channels + lateral) * Math.min(1, (radius - 309) / 8);
    positions.setXYZ(vertex, axis, height * target / radius, depth * target / radius);
  }
  geometry.computeVertexNormals();
  return geometry;
}