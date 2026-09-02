import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ElectronLane {
  x: number;
  z: number;
  phase: number;
  speed: number;
}

const TOP_Y = 1.5;
const BOTTOM_Y = -1.5;

/** Atomos fixos dentro da bateria (cinza). */
const ATOMS: [number, number, number][] = [
  [-0.35, -0.9, 0.2],
  [0.4, -0.3, -0.25],
  [-0.25, 0.4, -0.15],
  [0.3, 1.0, 0.25],
  [0.0, 0.1, 0.35],
];

function Battery() {
  const electronRefs = useRef<(THREE.Mesh | null)[]>([]);

  const lanes = useMemo<ElectronLane[]>(() => {
    const list: ElectronLane[] = [];
    const positions = [
      [0.0, 0.0],
      [0.45, 0.2],
      [-0.4, -0.25],
      [0.2, -0.4],
      [-0.25, 0.4],
    ];
    positions.forEach(([x, z]) => {
      for (let k = 0; k < 3; k++) {
        list.push({ x, z, phase: k / 3, speed: 0.35 });
      }
    });
    return list;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    lanes.forEach((lane, i) => {
      const m = electronRefs.current[i];
      if (!m) return;
      // Fluxo ordenado: todos sobem do polo negativo (-) ao positivo (+).
      const prog = (t * lane.speed + lane.phase) % 1;
      m.position.set(lane.x, BOTTOM_Y + prog * (TOP_Y - BOTTOM_Y), lane.z);
    });
  });

  return (
    <group>
      {/* Corpo da bateria (semi-transparente para ver o interior) */}
      <mesh>
        <cylinderGeometry args={[0.95, 0.95, 3, 40, 1, true]} />
        <meshStandardMaterial
          color="#38507a"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Tampas */}
      <mesh position={[0, TOP_Y, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.12, 40]} />
        <meshStandardMaterial color="#c94a4a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, BOTTOM_Y, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.12, 40]} />
        <meshStandardMaterial color="#3a4152" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Terminal positivo (nub) */}
      <mesh position={[0, TOP_Y + 0.18, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.25, 24]} />
        <meshStandardMaterial color="#d0d5dd" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Sinais + e - */}
      <Text position={[0, TOP_Y + 0.7, 0]} fontSize={0.5} color="#ff6a6a" anchorX="center">
        +
      </Text>
      <Text position={[0, BOTTOM_Y - 0.55, 0]} fontSize={0.5} color="#7fc4ff" anchorX="center">
        -
      </Text>

      {/* Atomos fixos */}
      {ATOMS.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#9aa4b6" metalness={0.2} roughness={0.6} />
        </mesh>
      ))}

      {/* Eletrons em fluxo ordenado (sobem) */}
      {lanes.map((_, i) => (
        <mesh key={i} ref={(m) => (electronRefs.current[i] = m)}>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial color="#2fd6e0" emissive="#2fd6e0" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Bateria com fluxo de eletrons (nao interativo). */
export function BatteryScene() {
  return (
    <Canvas camera={{ position: [3.4, 1.4, 4.6], fov: 45 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#0a0e16']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 4]} intensity={1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#88aaff" />
      <group rotation={[0, -0.4, 0]}>
        <Battery />
      </group>
    </Canvas>
  );
}
