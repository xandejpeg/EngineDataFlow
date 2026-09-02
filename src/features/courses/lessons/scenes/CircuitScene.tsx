import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const HALF_W = 3.2;
const HALF_H = 1.9;
const VOLTS = 12;

// Cantos do laco retangular (sentido horario a partir do canto inferior esquerdo).
const CORNERS = [
  new THREE.Vector2(-HALF_W, -HALF_H),
  new THREE.Vector2(HALF_W, -HALF_H),
  new THREE.Vector2(HALF_W, HALF_H),
  new THREE.Vector2(-HALF_W, HALF_H),
];
const SEGMENTS = CORNERS.map((p, i) => {
  const q = CORNERS[(i + 1) % CORNERS.length];
  return { p, q, len: p.distanceTo(q) };
});
const TOTAL_LEN = SEGMENTS.reduce((a, s) => a + s.len, 0);

function pointOnLoop(s: number, out: THREE.Vector3): THREE.Vector3 {
  let d = ((s % 1) + 1) % 1;
  d *= TOTAL_LEN;
  for (const seg of SEGMENTS) {
    if (d <= seg.len) {
      const t = d / seg.len;
      out.set(seg.p.x + (seg.q.x - seg.p.x) * t, seg.p.y + (seg.q.y - seg.p.y) * t, 0);
      return out;
    }
    d -= seg.len;
  }
  out.set(CORNERS[0].x, CORNERS[0].y, 0);
  return out;
}

const WIRE_MAT = { color: '#8a94a6', metalness: 0.7, roughness: 0.4 } as const;

function CircuitModel({ current, power }: { current: number; power: number }) {
  const electronRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lampMat = useRef<THREE.MeshStandardMaterial>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const N = 18;
  const phases = useMemo(() => Array.from({ length: N }, (_, i) => i / N), []);
  const speed = 0.015 + current * 0.02;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < phases.length; i++) {
      const m = electronRefs.current[i];
      if (!m) continue;
      pointOnLoop(t * speed + phases[i], tmp);
      m.position.copy(tmp);
    }
    if (lampMat.current) {
      lampMat.current.emissiveIntensity = 0.3 + power * 0.035;
    }
  });

  const label = (text: string, x: number, y: number, color: string) => (
    <Billboard position={[x, y, 0.35]}>
      <Text fontSize={0.42} color={color} anchorX="center" anchorY="middle">
        {text}
      </Text>
    </Billboard>
  );

  return (
    <group>
      {/* Fios (segmentos) */}
      <mesh position={[0, -HALF_H, 0]}>
        <boxGeometry args={[HALF_W * 2, 0.09, 0.09]} />
        <meshStandardMaterial {...WIRE_MAT} />
      </mesh>
      <mesh position={[0, HALF_H, 0]}>
        <boxGeometry args={[HALF_W * 2, 0.09, 0.09]} />
        <meshStandardMaterial {...WIRE_MAT} />
      </mesh>
      <mesh position={[-HALF_W, 0, 0]}>
        <boxGeometry args={[0.09, HALF_H * 2, 0.09]} />
        <meshStandardMaterial {...WIRE_MAT} />
      </mesh>
      <mesh position={[HALF_W, 0, 0]}>
        <boxGeometry args={[0.09, HALF_H * 2, 0.09]} />
        <meshStandardMaterial {...WIRE_MAT} />
      </mesh>

      {/* Bateria (fio inferior) = tensao */}
      <group position={[0, -HALF_H, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 0.5, 0.5]} />
          <meshStandardMaterial color="#2a3550" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0.7, 0.35, 0]}>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color="#c94a4a" metalness={0.5} roughness={0.4} />
        </mesh>
        {label('+', 0.7, 0.75, '#ff8a8a')}
        {label('-', -0.7, 0.6, '#7fc4ff')}
        {label('V', 0, -0.75, '#5b8def')}
      </group>

      {/* Resistor (fio superior) = resistencia */}
      <group position={[0, HALF_H, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 1.1, 20]} />
          <meshStandardMaterial color="#d8c9a0" metalness={0.1} roughness={0.7} />
        </mesh>
        {[-0.28, -0.08, 0.16].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.07, 20]} />
            <meshStandardMaterial color={['#3a2a12', '#c94a4a', '#e0a030'][i]} roughness={0.6} />
          </mesh>
        ))}
        {label('Ω', 0, 0.7, '#ff9f43')}
      </group>

      {/* Lampada (fio direito) = potencia */}
      <group position={[HALF_W, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial
            ref={lampMat}
            color="#fff2b0"
            emissive="#ffcf4d"
            emissiveIntensity={0.5}
            metalness={0.1}
            roughness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>
        <pointLight color="#ffd66b" intensity={Math.min(power * 0.02, 2)} distance={4} />
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.35, 16]} />
          <meshStandardMaterial color="#9aa4b6" metalness={0.6} roughness={0.4} />
        </mesh>
        {label('W', 0.85, 0, '#c99bff')}
      </group>

      {/* Seta de corrente (fio esquerdo) */}
      <group position={[-HALF_W, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.16, 0.4, 16]} />
          <meshStandardMaterial color="#2fd6e0" emissive="#2fd6e0" emissiveIntensity={0.5} />
        </mesh>
        {label('I', -0.5, 0, '#37d67a')}
      </group>

      {/* Eletrons em fluxo ordenado */}
      {phases.map((_, i) => (
        <mesh key={i} ref={(m) => (electronRefs.current[i] = m)}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#2fd6e0" emissive="#2fd6e0" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Circuito interativo: gira (orbita) e ajusta a resistencia. */
export function CircuitScene() {
  const [resistance, setResistance] = useState(4);
  const current = VOLTS / resistance; // I = V / R
  const power = VOLTS * current; // P = V * I

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Canvas camera={{ position: [0.5, 1.5, 9.5], fov: 45 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#0a0e16']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 6]} intensity={0.9} />
        <directionalLight position={[-4, 2, -3]} intensity={0.3} color="#88aaff" />
        <CircuitModel current={current} power={power} />
        <OrbitControls enablePan={false} minDistance={6} maxDistance={16} />
      </Canvas>

      <div style={overlayStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#b9c4d6' }}>Resistencia</span>
          <input
            type="range"
            min={1}
            max={12}
            step={0.5}
            value={resistance}
            aria-label="Resistencia (ohms)"
            onChange={(e) => setResistance(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#ff9f43' }}
          />
        </div>
        <div style={readoutStyle}>
          <Readout label="Tensao" value={`${VOLTS.toFixed(0)} V`} color="#5b8def" />
          <Readout label="Resistencia" value={`${resistance.toFixed(1)} Ω`} color="#ff9f43" />
          <Readout label="Corrente" value={`${current.toFixed(1)} A`} color="#37d67a" />
          <Readout label="Potencia" value={`${power.toFixed(0)} W`} color="#c99bff" />
        </div>
      </div>
    </div>
  );
}

function Readout({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#7c8aa3', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 15, fontFamily: 'var(--font-mono)', color, fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  left: 12,
  right: 12,
  bottom: 12,
  background: 'rgba(10,14,22,0.82)',
  border: '1px solid #253049',
  borderRadius: 10,
  padding: '10px 14px',
  backdropFilter: 'blur(6px)',
};

const readoutStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 8,
};
