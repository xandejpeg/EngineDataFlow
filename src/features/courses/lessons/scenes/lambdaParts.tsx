import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const LAMBDA_BG = '#0a0e16';

export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 6, 4]} intensity={1.05} />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#88aaff" />
    </>
  );
}

/** Rotulo flutuante desenhado no proprio 3D (nao usa HTML, escala junto com a cena). */
export function Tag({
  position,
  text,
  color = '#dfe6f2',
  size = 0.12,
}: {
  position: [number, number, number];
  text: string;
  color?: string;
  size?: number;
}) {
  return (
    <Text position={position} fontSize={size} color={color} anchorX="left" anchorY="middle">
      {text}
    </Text>
  );
}

/**
 * Tela de osciloscopio: mantem um buffer circular de amostras e redesenha a
 * linha a cada quadro, sem re-renderizar o React.
 */
export function ScopeTrace({
  samples,
  width = 3.4,
  height = 1.5,
  color = '#37d67a',
  position = [0, 0, 0],
}: {
  samples: React.MutableRefObject<number[]>;
  width?: number;
  height?: number;
  color?: string;
  position?: [number, number, number];
}) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(240 * 3), 3));
    return g;
  }, []);

  useFrame(() => {
    const arr = geo.getAttribute('position') as THREE.BufferAttribute;
    const data = samples.current;
    const n = 240;
    for (let i = 0; i < n; i++) {
      const v = data[i] ?? 0.5;
      arr.setXYZ(i, (i / (n - 1) - 0.5) * width, (v - 0.5) * height, 0);
    }
    arr.needsUpdate = true;
    geo.computeBoundingSphere();
  });

  return (
    <group position={position}>
      {/* Moldura da tela */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[width + 0.24, height + 0.24]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width + 0.24, height + 0.24)]} />
        <lineBasicMaterial color="#2a3346" />
      </lineSegments>
      <line>
        <primitive object={geo} attach="geometry" />
        <lineBasicMaterial color={color} linewidth={2} />
      </line>
    </group>
  );
}

/** Linha horizontal de referencia dentro da tela (ex.: os 450 mV). */
export function ScopeRef({
  y,
  width = 3.4,
  color = '#ff9f43',
  label,
}: {
  y: number;
  width?: number;
  color?: string;
  label?: string;
}) {
  return (
    <group position={[0, y, 0.01]}>
      <mesh>
        <planeGeometry args={[width, 0.012]} />
        <meshBasicMaterial color={color} transparent opacity={0.75} />
      </mesh>
      {label && <Tag position={[width / 2 + 0.08, 0, 0]} text={label} color={color} size={0.11} />}
    </group>
  );
}

/** Sonda simplificada em corte, usada como ilustracao ao lado do grafico. */
export function ProbeBody({
  position = [0, 0, 0],
  tipColor = '#e6e2d8',
  glow = 0,
}: {
  position?: [number, number, number];
  tipColor?: string;
  glow?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 6]} />
        <meshStandardMaterial color="#b8bec9" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
        <meshStandardMaterial color="#6e7684" metalness={0.8} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <coneGeometry args={[0.16, 0.42, 16]} />
        <meshStandardMaterial
          color={tipColor}
          emissive="#ff5a1e"
          emissiveIntensity={glow}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.35, 16]} />
        <meshStandardMaterial color="#6e7684" metalness={0.8} roughness={0.45} />
      </mesh>
    </group>
  );
}

/** Chicote de fios colorido saindo da sonda; usado para 3, 4 e 5 fios. */
export function WireHarness({
  colors,
  position = [0, 0, 0],
  length = 0.7,
}: {
  colors: string[];
  position?: [number, number, number];
  length?: number;
}) {
  return (
    <group position={position}>
      {colors.map((c, i) => (
        <mesh key={i} position={[(i - (colors.length - 1) / 2) * 0.09, length / 2, 0]}>
          <cylinderGeometry args={[0.028, 0.028, length, 8]} />
          <meshStandardMaterial color={c} metalness={0.15} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** Molecula de O2 usada para animar o bombeamento de oxigenio. */
export function OxygenDot({
  position,
  color = '#5b8def',
}: {
  position: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 10, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

/** Fluxo de ions de O2 subindo ou descendo conforme o sinal da corrente. */
export function IonFlow({
  count = 7,
  direction,
  x,
  yFrom,
  yTo,
  color,
  speed = 0.5,
}: {
  count?: number;
  direction: number;
  x: number;
  yFrom: number;
  yTo: number;
  color: string;
  speed?: number;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g || direction === 0) return;
    const span = yTo - yFrom;
    for (const child of g.children) {
      child.position.y += dt * speed * direction;
      if (direction > 0 && child.position.y > span) child.position.y -= span;
      if (direction < 0 && child.position.y < 0) child.position.y += span;
    }
  });
  if (direction === 0) return null;
  return (
    <group ref={group} position={[x, yFrom, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <OxygenDot key={i} position={[0, ((i + 0.5) / count) * (yTo - yFrom), 0]} color={color} />
      ))}
    </group>
  );
}
