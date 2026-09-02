import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ElectronData {
  r: number;
  speed: number;
  phase: number;
  tilt: THREE.Euler;
}

const NUCLEUS = [
  { pos: [0, 0, 0] as const, proton: true },
  { pos: [0.2, 0.1, 0.05] as const, proton: false },
  { pos: [-0.16, 0.13, -0.09] as const, proton: true },
  { pos: [0.06, -0.19, 0.13] as const, proton: false },
  { pos: [-0.11, -0.06, 0.19] as const, proton: true },
  { pos: [0.13, 0.06, -0.17] as const, proton: false },
  { pos: [-0.06, 0.17, 0.07] as const, proton: true },
];

const SHELLS = [
  { r: 1.5, tilt: new THREE.Euler(0, 0, 0), count: 2, speed: 1.5 },
  { r: 2.2, tilt: new THREE.Euler(Math.PI / 2.5, 0, 0), count: 3, speed: 1.05 },
  { r: 2.9, tilt: new THREE.Euler(0, Math.PI / 3, Math.PI / 4), count: 3, speed: 0.8 },
];

function Atom() {
  const root = useRef<THREE.Group>(null);
  const electronRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const electrons = useMemo<ElectronData[]>(() => {
    const list: ElectronData[] = [];
    SHELLS.forEach((s) => {
      for (let i = 0; i < s.count; i++) {
        list.push({ r: s.r, speed: s.speed, phase: (i / s.count) * Math.PI * 2, tilt: s.tilt });
      }
    });
    return list;
  }, []);

  useFrame((state) => {
    if (root.current) root.current.rotation.y += 0.004;
    const t = state.clock.elapsedTime;
    electrons.forEach((e, i) => {
      const m = electronRefs.current[i];
      if (!m) return;
      const a = t * e.speed + e.phase;
      tmp.set(Math.cos(a) * e.r, Math.sin(a) * e.r, 0).applyEuler(e.tilt);
      m.position.copy(tmp);
    });
  });

  return (
    <group ref={root}>
      {/* Nucleo */}
      <group>
        {NUCLEUS.map((n, i) => (
          <mesh key={i} position={n.pos as unknown as [number, number, number]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial
              color={n.proton ? '#ff5a5a' : '#9aa4b6'}
              emissive={n.proton ? '#7a1010' : '#20262f'}
              emissiveIntensity={0.5}
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Orbitas */}
      {SHELLS.map((s, i) => (
        <mesh key={i} rotation={[s.tilt.x, s.tilt.y, s.tilt.z]}>
          <torusGeometry args={[s.r, 0.012, 8, 80]} />
          <meshBasicMaterial color="#2a3a5c" />
        </mesh>
      ))}

      {/* Eletrons */}
      {electrons.map((_, i) => (
        <mesh key={i} ref={(m) => (electronRefs.current[i] = m)}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#2fd6e0" emissive="#2fd6e0" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Atomo animado (nao interativo). */
export function AtomScene() {
  return (
    <Canvas camera={{ position: [0, 1.2, 6.2], fov: 45 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#0a0e16']} />
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#ff9a9a" distance={4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <Atom />
    </Canvas>
  );
}
