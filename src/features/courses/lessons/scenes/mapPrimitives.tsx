/**
 * Pecas de desenho usadas pelo mapa do sistema e pela visualizacao isolada:
 * trechos de tubo, linhas de tubo, particulas de fluxo e o vidro translucido.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type Vec3 = [number, number, number];

/** Trecho reto de tubo entre dois pontos. Mantem o desenho anguloso, de esquema. */
export function Seg({
  from,
  to,
  r = 0.12,
  color = '#7d8798',
  metalness = 0.6,
  roughness = 0.5,
}: {
  from: Vec3;
  to: Vec3;
  r?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    return {
      pos: a.clone().addScaledVector(dir, 0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize(),
      ),
      len: dir.length(),
    };
  }, [from, to]);

  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 14]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/** Linha de tubos ligando varios pontos em sequencia, com joelho nas curvas. */
export function Run({
  points,
  r = 0.12,
  color,
  metalness,
  roughness,
  joints = true,
}: {
  points: Vec3[];
  r?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  joints?: boolean;
}) {
  return (
    <>
      {points.slice(1).map((p, i) => (
        <Seg
          key={i}
          from={points[i]}
          to={p}
          r={r}
          color={color}
          metalness={metalness}
          roughness={roughness}
        />
      ))}
      {joints &&
        points.slice(1, -1).map((p) => (
          <mesh key={p.join()} position={p}>
            <sphereGeometry args={[r, 14, 14]} />
            <meshStandardMaterial
              color={color}
              metalness={metalness ?? 0.6}
              roughness={roughness ?? 0.5}
            />
          </mesh>
        ))}
    </>
  );
}

/**
 * Ciclo lento de abertura da borboleta: 0 fechada, 1 aberta. A borboleta e o ar
 * leem a mesma funcao, entao o ar so anda quando ela abre.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function throttleOpening(t: number): number {
  return 0.04 + 0.96 * ((1 - Math.cos(t * 0.7)) / 2);
}

/** Bolinhas correndo pelo caminho: mostram o sentido do fluxo. */
export function Flow({
  points,
  color,
  count = 8,
  speed = 0.16,
  size = 0.08,
  gated = false,
}: {
  points: Vec3[];
  color: string;
  count?: number;
  speed?: number;
  size?: number;
  /** Amarra o fluxo a abertura da borboleta. */
  gated?: boolean;
}) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(...p)),
        false,
        'catmullrom',
        0,
      ),
    [points],
  );
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const gate = gated ? throttleOpening(state.clock.elapsedTime) : 1;
    t.current = (t.current + dt * speed * gate) % 1;
    g.children.forEach((c, i) => {
      const u = (t.current + i / count) % 1;
      c.position.copy(curve.getPointAt(u));
      // Nasce e some nas pontas, para nao piscar do nada no meio do desenho.
      const k = Math.min(1, u / 0.09, (1 - u) / 0.09);
      c.scale.setScalar((0.45 + k * 0.55) * (0.35 + 0.65 * gate));
      const mat = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = (0.15 + k * 0.75) * (0.2 + 0.8 * gate);
    });
  });

  return (
    <group ref={ref}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[size * (0.78 + 0.44 * ((i * 3) % 4)) * 0.55, 14, 14]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Carcaca translucida: deixa ver o que acontece dentro da peca. */
export const GLASS = {
  color: '#6f86ad',
  transparent: true,
  opacity: 0.2,
  metalness: 0.1,
  roughness: 0.35,
  depthWrite: false,
} as const;
