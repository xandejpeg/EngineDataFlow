import { useMemo, type ReactNode } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

type Point = [number, number, number];

export function Casting({ position = [0, 0, 0], size, color = '#adb3b3', radius = 4, opacity = 1, children }: {
  position?: Point; size: Point; color?: string; radius?: number; opacity?: number; children?: ReactNode;
}) {
  return <group position={position}>
    <RoundedBox args={size} radius={Math.min(radius, Math.min(...size) / 3)} smoothness={2}>
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.48} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} />
    </RoundedBox>
    {children}
  </group>;
}

export function Turned({ profile, color = '#adb3b3', opacity = 1, segments = 32 }: {
  profile: [number, number][]; color?: string; opacity?: number; segments?: number;
}) {
  const points = useMemo(() => profile.map(point => new THREE.Vector2(...point)), [profile]);
  return <mesh>
    <latheGeometry args={[points, segments]} />
    <meshStandardMaterial color={color} roughness={0.36} metalness={0.7} side={THREE.DoubleSide} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} />
  </mesh>;
}

/**
 * Arredonda cada vertice com um raio curto antes de suavizar a curva. Sem isso a
 * CatmullRom transforma um canto de 90 graus num arco enorme e o chicote perde os trechos retos.
 */
function filleted(points: Point[], radius: number): THREE.Vector3[] {
  const nodes = points.map(point => new THREE.Vector3(...point));
  if (nodes.length < 3) return nodes;
  const out = [nodes[0]];
  for (let index = 1; index < nodes.length - 1; index += 1) {
    const corner = nodes[index];
    const before = nodes[index - 1].clone().sub(corner);
    const after = nodes[index + 1].clone().sub(corner);
    const cut = Math.min(radius, before.length() * 0.45, after.length() * 0.45);
    if (cut < 0.5) { out.push(corner); continue; }
    out.push(corner.clone().addScaledVector(before.normalize(), cut), corner.clone().addScaledVector(after.normalize(), cut));
  }
  out.push(nodes[nodes.length - 1]);
  return out;
}

export function Tube({ points, radius, color, opacity = 1, corner = 26 }: { points: Point[]; radius: number; color: string; opacity?: number; corner?: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(filleted(points, corner), false, 'centripetal'), [points, corner]);
  return <mesh>
    <tubeGeometry args={[curve, Math.max(24, points.length * 10), radius, 10, false]} />
    <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} />
  </mesh>;
}

export function Shaft({ from, to, radius, color = '#8c969c' }: { from: Point; to: Point; radius: number; color?: string }) {
  const start = new THREE.Vector3(...from);
  const finish = new THREE.Vector3(...to);
  const direction = finish.clone().sub(start);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return <mesh position={start.add(finish).multiplyScalar(0.5)} quaternion={quaternion}>
    <cylinderGeometry args={[radius, radius, direction.length(), 20]} />
    <meshStandardMaterial color={color} roughness={0.32} metalness={0.75} />
  </mesh>;
}

export function Ring({ radius, tube = 2, color = '#555e61', position = [0, 0, 0], rotation = [Math.PI / 2, 0, 0] }: {
  radius: number; tube?: number; color?: string; position?: Point; rotation?: Point;
}) {
  return <mesh position={position} rotation={rotation}>
    <torusGeometry args={[radius, tube, 8, 36]} />
    <meshStandardMaterial color={color} metalness={0.65} roughness={0.4} />
  </mesh>;
}

export function Connector({ pins = 3, width = 24 }: { pins?: number; width?: number }) {
  return <group>
    <Casting size={[width, 15, 18]} color="#242b2e" radius={2} />
    <Casting position={[0, 9, 0]} size={[width * 0.5, 4, 12]} color="#424b4e" radius={1} />
    {Array.from({ length: pins }, (_, index) => <Shaft key={index} from={[(index - (pins - 1) / 2) * 4, 0, 8]} to={[(index - (pins - 1) / 2) * 4, 0, 13]} radius={0.8} color="#b9a56c" />)}
  </group>;
}