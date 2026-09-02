/* eslint-disable react-refresh/only-export-components */
/**
 * Simulador 3D do multimetro HIKARI HM-2090.
 * Chave seletora giratoria (13 posicoes), 4 botoes (SELECT/RANGE/REL/HOLD),
 * visor LCD, 4 terminais e duas pontas de prova arrastaveis.
 * A leitura vem de multimeterSim.ts e cobre TODAS as funcoes + erros de terminal.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SceneShell } from './sceneUi';
import { WHITE_BG } from './circuitParts';
import { HM2090_FUNCTIONS, getFunctionById } from '@/data/multimeterHM2090.pt-BR';
import { TEST_ITEMS, TEST_ITEMS_BY_ID, IDEAL_SETUP, computeReading, type Reading } from './multimeterSim';

type Vec3 = [number, number, number];
export type RedJack = 'VΩHz' | 'mAμA' | '10A';

export const METERX = -3.05;
export const JACK_DX: Record<string, number> = { '10A': -0.82, 'mAμA': -0.27, COM: 0.27, VΩHz: 0.82 };
export const JACK_Y = -1.48;
export const jackWorld = (id: string): Vec3 => [METERX + JACK_DX[id], JACK_Y, 0.34];

export const DIALY = -0.16; // centro da chave seletora (mundo)
const DIAL_MIN = 30; // limite direito (canto superior direito)
const DIAL_MAX = 335; // limite esquerdo (canto superior esquerdo)

/** Angulo em graus, sentido horario a partir do topo, do vetor (dx, dy). */
export function angleClockwiseFromTop(dx: number, dy: number): number {
  return ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
}
/** Prende o angulo ao arco valido da chave (com o vao no topo). */
export function clampDialAngle(t: number): number {
  t = ((t % 360) + 360) % 360;
  if (t >= DIAL_MIN && t <= DIAL_MAX) return t;
  const dMax = t > DIAL_MAX ? t - DIAL_MAX : t + 360 - DIAL_MAX;
  const dMin = t < DIAL_MIN ? DIAL_MIN - t : DIAL_MIN + 360 - t;
  return dMax <= dMin ? DIAL_MAX : DIAL_MIN;
}
/** Funcao cujo angulo esta mais proximo de theta. */
export function nearestFnId(theta: number): string {
  let best = HM2090_FUNCTIONS[0].id;
  let bd = 999;
  for (const f of HM2090_FUNCTIONS) {
    let d = Math.abs(f.angleDeg - theta);
    d = Math.min(d, 360 - d);
    if (d < bd) {
      bd = d;
      best = f.id;
    }
  }
  return best;
}

const COLS = [0.5, 1.95, 3.4];
const ROWS = [2.0, 1.1, 0.2, -0.7, -1.6];
const itemCenter = (i: number): Vec3 => [COLS[i % 3], ROWS[Math.floor(i / 3)], 0.16];
const RED_SOCK: Vec3 = [-0.34, -0.22, 0.14];
const BLK_SOCK: Vec3 = [0.34, -0.22, 0.14];

const SOCKETS = TEST_ITEMS.map((it, i) => {
  const c = itemCenter(i);
  return {
    id: it.id,
    red: [c[0] + RED_SOCK[0], c[1] + RED_SOCK[1], c[2] + RED_SOCK[2]] as Vec3,
    black: [c[0] + BLK_SOCK[0], c[1] + BLK_SOCK[1], c[2] + BLK_SOCK[2]] as Vec3,
    center: c,
  };
});

function nearestSocket(p: Vec3, which: 'red' | 'black'): string | null {
  let best: string | null = null;
  let bd = 0.45; // limiar de encaixe
  for (const s of SOCKETS) {
    const t = which === 'red' ? s.red : s.black;
    const d = Math.hypot(p[0] - t[0], p[1] - t[1]);
    if (d < bd) {
      bd = d;
      best = s.id;
    }
  }
  return best;
}

/* ------------------------------- Multimetro ------------------------------- */

export function MeterBody() {
  return (
    <group position={[METERX, 0.34, 0]}>
      {/* traseira arredondada — da profundidade e tira o ar de "tijolo" */}
      <RoundedBox args={[2.98, 5.6, 0.5]} radius={0.25} smoothness={6} position={[0, 0, -0.34]}>
        <meshStandardMaterial color="#d9820a" roughness={0.62} metalness={0.05} />
      </RoundedBox>
      {/* capa de borracha laranja: grossa e bem arredondada */}
      <RoundedBox args={[2.92, 5.54, 0.74]} radius={0.37} smoothness={6} position={[0, 0, -0.12]}>
        <meshStandardMaterial color="#f39c12" roughness={0.5} metalness={0.05} />
      </RoundedBox>
      {/* corpo escuro */}
      <RoundedBox args={[2.36, 5.26, 0.56]} radius={0.28} smoothness={5} position={[0, 0, 0.02]}>
        <meshStandardMaterial color="#2f343c" roughness={0.45} metalness={0.2} />
      </RoundedBox>
      {/* painel frontal */}
      <RoundedBox args={[2.14, 5.0, 0.14]} radius={0.07} smoothness={4} position={[0, 0, 0.24]}>
        <meshStandardMaterial color="#191d24" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <Text position={[0, 2.34, 0.33]} fontSize={0.15} color="#ffb43a" anchorX="center" letterSpacing={0.05}>
        HIKARI
      </Text>
      <Text position={[0, 2.12, 0.33]} fontSize={0.078} color="#9fb0c8" anchorX="center">
        Multimetro Digital  ·  HM-2090
      </Text>
      <Text position={[-0.74, 0.94, 0.33]} fontSize={0.08} color="#e8963a" anchorX="center">
        Hz/DUTY
      </Text>
      {/* marcas na base (banda laranja) */}
      <Text position={[-0.8, -2.72, 0.27]} fontSize={0.12} color="#f4f7fb" anchorX="center">
        CE
      </Text>
      <Text position={[0.36, -2.72, 0.27]} fontSize={0.12} color="#b5241a" anchorX="center" letterSpacing={0.02}>
        TRUE RMS
      </Text>
      {[
        [-1.0, 2.42],
        [1.0, 2.42],
        [-1.0, -2.42],
        [1.0, -2.42],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
          <meshStandardMaterial color="#7c869a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function Lcd({ reading, hold, rel, light }: { reading: Reading; hold: boolean; rel: boolean; light: boolean }) {
  const glass = light ? '#d3e6f0' : '#a9c6d6';
  const ink = reading.danger ? '#7a1400' : '#0e2036';
  return (
    <group position={[METERX, 1.84, 0.31]}>
      <RoundedBox args={[2.14, 1.02, 0.08]} radius={0.07} smoothness={3}>
        <meshStandardMaterial color="#0b0f14" roughness={0.35} metalness={0.2} />
      </RoundedBox>
      <RoundedBox args={[1.94, 0.8, 0.05]} radius={0.04} smoothness={3} position={[0, 0, 0.03]}>
        <meshStandardMaterial color={glass} emissive={glass} emissiveIntensity={light ? 0.6 : 0.28} roughness={0.2} />
      </RoundedBox>
      <Text position={[-0.9, 0.28, 0.07]} fontSize={0.1} color={ink} anchorX="left">
        {[hold ? 'HOLD' : '', rel ? 'REL\u0394' : '', reading.mode].filter(Boolean).join('  ')}
      </Text>
      <Text position={[0.42, -0.06, 0.07]} fontSize={0.52} color={ink} anchorX="right" anchorY="middle">
        {reading.primary || ' '}
      </Text>
      <Text position={[0.72, -0.08, 0.07]} fontSize={0.2} color={ink} anchorX="left" anchorY="middle">
        {reading.unit}
      </Text>
    </group>
  );
}

const OUTER = 0.9;

export function Dial({
  fnId,
  dragAngle,
  onSelect,
  onKnobDown,
}: {
  fnId: string;
  dragAngle: number | null;
  onSelect: (id: string) => void;
  onKnobDown: (e: ThreeEvent<PointerEvent>) => void;
}) {
  const knob = useRef<THREE.Group>(null);
  const cur = useMemo(() => getFunctionById(fnId), [fnId]);
  const targetDeg = dragAngle != null ? dragAngle : cur?.angleDeg ?? 180;
  const target = -(targetDeg * Math.PI) / 180;

  useFrame(() => {
    const g = knob.current;
    if (!g) return;
    if (dragAngle != null) g.rotation.z = target;
    else g.rotation.z += (target - g.rotation.z) * 0.3;
  });

  return (
    <group position={[METERX, DIALY, 0.26]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
        <cylinderGeometry args={[1.06, 1.06, 0.06, 48]} />
        <meshStandardMaterial color="#12151b" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <ringGeometry args={[0.78, 1.02, 48]} />
        <meshStandardMaterial color="#e9edf3" roughness={0.5} />
      </mesh>
      <Text position={[0, 0.82, 0.05]} fontSize={0.066} color="#8794a8" anchorX="center">
        AUTO POWER OFF
      </Text>
      {HM2090_FUNCTIONS.map((f) => {
        const a = (f.angleDeg * Math.PI) / 180;
        const x = OUTER * Math.sin(a);
        const y = OUTER * Math.cos(a);
        const active = f.id === fnId;
        return (
          <group key={f.id}>
            <mesh position={[0.72 * Math.sin(a), 0.72 * Math.cos(a), 0.04]} rotation={[0, 0, -a]}>
              <boxGeometry args={[0.04, 0.11, 0.02]} />
              <meshStandardMaterial
                color={active ? '#f5a623' : '#59647a'}
                emissive={active ? '#f5a623' : '#000'}
                emissiveIntensity={active ? 0.7 : 0}
              />
            </mesh>
            {f.secondaryPt && (
              <Text
                position={[1.12 * Math.sin(a), 1.12 * Math.cos(a), 0.05]}
                fontSize={0.068}
                color="#e8963a"
                anchorX="center"
                anchorY="middle"
              >
                {f.id === 'hz' ? 'DUTY' : '°F'}
              </Text>
            )}
            <Text
              position={[x, y, 0.06]}
              fontSize={0.125}
              color={active ? '#ffd479' : '#7f8ba0'}
              anchorX="center"
              anchorY="middle"
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onSelect(f.id);
              }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'auto')}
            >
              {f.symbol}
            </Text>
          </group>
        );
      })}
      {/* alvo para agarrar e girar o knob */}
      <mesh
        position={[0, 0, 0.34]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={onKnobDown}
        onPointerOver={() => (document.body.style.cursor = 'grab')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <cylinderGeometry args={[0.64, 0.64, 0.06, 24]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {/* knob giratorio */}
      <group ref={knob} position={[0, 0, 0.12]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.56, 0.64, 0.3, 48]} />
          <meshStandardMaterial color="#23272f" roughness={0.35} metalness={0.55} />
        </mesh>
        {Array.from({ length: 18 }).map((_, i) => {
          const g = (i / 18) * Math.PI * 2;
          return (
            <mesh key={i} position={[0.56 * Math.cos(g), 0.56 * Math.sin(g), 0.05]} rotation={[0, 0, g]}>
              <boxGeometry args={[0.044, 0.11, 0.18]} />
              <meshStandardMaterial color="#2b303a" roughness={0.4} metalness={0.45} />
            </mesh>
          );
        })}
        <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.05, 40]} />
          <meshStandardMaterial color="#333944" roughness={0.28} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.24, 0.19]}>
          <boxGeometry args={[0.09, 0.36, 0.05]} />
          <meshStandardMaterial color="#ffb43a" emissive="#ffb43a" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.46, 0.19]}>
          <coneGeometry args={[0.09, 0.14, 3]} />
          <meshStandardMaterial color="#ffb43a" emissive="#ffb43a" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export function MeterButton({
  pos,
  label,
  color,
  active,
  onClick,
}: {
  pos: Vec3;
  label: string;
  color: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <group position={pos}>
      <RoundedBox
        args={[0.46, 0.27, 0.16]}
        radius={0.1}
        smoothness={4}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <meshStandardMaterial
          color={active ? color : '#525a67'}
          emissive={active ? color : '#000'}
          emissiveIntensity={active ? 0.6 : 0}
          roughness={0.4}
          metalness={0.2}
        />
      </RoundedBox>
      <Text position={[0, 0, 0.11]} fontSize={0.1} color="#f2f5fa" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

export function Jack({
  id,
  labelPt,
  color,
  selected,
  onSelect,
}: {
  id: string;
  labelPt: string;
  color: string;
  selected: boolean;
  onSelect?: (id: string) => void;
}) {
  const p = jackWorld(id);
  return (
    <group position={p}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.17, 0.1, 28]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.1, 24]} />
        <meshStandardMaterial color="#c9cfda" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 20]} />
        <meshStandardMaterial color="#08090c" />
      </mesh>
      {selected && (
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[0.19, 0.23, 28]} />
          <meshStandardMaterial color="#ffd479" emissive="#ffd479" emissiveIntensity={0.7} />
        </mesh>
      )}
      <Text position={[0, 0.27, 0.02]} fontSize={0.11} color="#cfd8e6" anchorX="center">
        {labelPt}
      </Text>
      {onSelect && (
        <mesh
          position={[0, 0, 0.12]}
          visible={false}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onSelect(id);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <boxGeometry args={[0.38, 0.38, 0.24]} />
        </mesh>
      )}
    </group>
  );
}

function Cable({ from, to, color }: { from: Vec3; to: Vec3; color: string }) {
  const geo = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const d = a.distanceTo(b);
    const sag = Math.min(1.5, 0.4 + d * 0.42);
    const m1 = a.clone().lerp(b, 0.33);
    m1.y -= sag;
    m1.z += 0.18;
    const m2 = a.clone().lerp(b, 0.66);
    m2.y -= sag * 0.82;
    m2.z += 0.24;
    const curve = new THREE.CatmullRomCurve3([a, m1, m2, b]);
    return new THREE.TubeGeometry(curve, 44, 0.06, 12, false);
  }, [from, to]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
    </mesh>
  );
}

/** Triangulo de aviso amarelo com "!" (padrao dos instrumentos). */
function WarnTriangle({ pos, size = 0.072 }: { pos: Vec3; size?: number }) {
  return (
    <group position={pos}>
      <mesh>
        <circleGeometry args={[size * 1.28, 3, Math.PI / 2]} />
        <meshStandardMaterial color="#0b0b0d" />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <circleGeometry args={[size, 3, Math.PI / 2]} />
        <meshStandardMaterial color="#ffd21e" emissive="#ffd21e" emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
      <Text position={[0, -0.01, 0.016]} fontSize={size * 0.95} color="#0b0b0d" anchorX="center" anchorY="middle">
        !
      </Text>
    </group>
  );
}

/** Trilha explicativa: trace descendo do terminal ate o triangulo + texto de faixa. */
function TerminalGuide({ id, lines }: { id: string; lines: string[] }) {
  const [jx] = jackWorld(id);
  const traceTop = JACK_Y - 0.16;
  const traceBot = JACK_Y - 0.32;
  const triY = JACK_Y - 0.4;
  const txtY = JACK_Y - 0.56;
  return (
    <group>
      <mesh position={[jx, (traceTop + traceBot) / 2, 0.32]}>
        <boxGeometry args={[0.026, traceTop - traceBot, 0.02]} />
        <meshStandardMaterial color="#caa15a" emissive="#caa15a" emissiveIntensity={0.25} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[jx, traceBot, 0.33]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color="#caa15a" emissive="#caa15a" emissiveIntensity={0.3} metalness={0.5} roughness={0.4} />
      </mesh>
      <WarnTriangle pos={[jx, triY, 0.33]} size={0.072} />
      {lines.map((ln, i) => (
        <Text
          key={i}
          position={[jx, txtY - i * 0.1, 0.33]}
          fontSize={0.05}
          color="#aeb9cc"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.62}
        >
          {ln}
        </Text>
      ))}
    </group>
  );
}

function ProbeTip({
  pos,
  color,
  onDown,
}: {
  pos: Vec3;
  color: string;
  onDown: (e: ThreeEvent<PointerEvent>) => void;
}) {
  return (
    <group position={pos}>
      {/* alvo de agarrar (maior, invisivel) */}
      <mesh
        onPointerDown={onDown}
        onPointerOver={() => (document.body.style.cursor = 'grab')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {/* cabo/grip */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.075, 0.1, 0.6, 20]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      {[0.14, 0.26, 0.38].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.093, 0.013, 8, 20]} />
          <meshStandardMaterial color="#101015" roughness={0.5} />
        </mesh>
      ))}
      {/* guarda-dedo */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 20]} />
        <meshStandardMaterial color="#1a1a1f" roughness={0.5} />
      </mesh>
      {/* haste metalica */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.36, 12]} />
        <meshStandardMaterial color="#d7dde6" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <coneGeometry args={[0.028, 0.14, 12]} />
        <meshStandardMaterial color="#e6ebf2" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function BenchProp({ id, color }: { id: string; color: string }) {
  switch (id) {
    case 'bateria':
      return (
        <group position={[0, -0.06, 0.2]}>
          <RoundedBox args={[0.62, 0.34, 0.32]} radius={0.05} smoothness={3}>
            <meshStandardMaterial color="#20242c" roughness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0.19, 0]}>
            <boxGeometry args={[0.64, 0.07, 0.34]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[-0.16, 0.24, 0]}>
            <cylinderGeometry args={[0.04, 0.045, 0.08, 16]} />
            <meshStandardMaterial color="#d7431f" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0.16, 0.24, 0]}>
            <cylinderGeometry args={[0.04, 0.045, 0.08, 16]} />
            <meshStandardMaterial color="#2a2d34" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'tomada':
      return (
        <group position={[0, 0, 0.2]}>
          <RoundedBox args={[0.6, 0.6, 0.16]} radius={0.09} smoothness={3}>
            <meshStandardMaterial color="#f2f4f8" roughness={0.6} />
          </RoundedBox>
          <mesh position={[-0.12, 0.06, 0.09]}>
            <boxGeometry args={[0.05, 0.2, 0.06]} />
            <meshStandardMaterial color="#22262e" />
          </mesh>
          <mesh position={[0.12, 0.06, 0.09]}>
            <boxGeometry args={[0.05, 0.2, 0.06]} />
            <meshStandardMaterial color="#22262e" />
          </mesh>
          <mesh position={[0, -0.16, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
            <meshStandardMaterial color="#22262e" />
          </mesh>
        </group>
      );
    case 'resistor':
      return (
        <group position={[0, 0, 0.22]} rotation={[0, 0, Math.PI / 2]}>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 10]} />
            <meshStandardMaterial color="#b9bec8" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 10]} />
            <meshStandardMaterial color="#b9bec8" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.5, 20]} />
            <meshStandardMaterial color="#c9a26b" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.125, 0.125, 0.03, 20]} />
            <meshStandardMaterial color="#7a3b12" />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.125, 0.125, 0.03, 20]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.125, 0.125, 0.03, 20]} />
            <meshStandardMaterial color="#c02020" />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.125, 0.125, 0.03, 20]} />
            <meshStandardMaterial color="#d4af37" />
          </mesh>
        </group>
      );
    case 'diodo':
      return (
        <group position={[0, 0, 0.22]} rotation={[0, 0, Math.PI / 2]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 10]} />
            <meshStandardMaterial color="#b9bec8" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 10]} />
            <meshStandardMaterial color="#b9bec8" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.42, 20]} />
            <meshStandardMaterial color="#1a1a1f" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.05, 20]} />
            <meshStandardMaterial color="#d7dde6" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'fio-ok':
      return (
        <group position={[0, -0.04, 0.2]}>
          <mesh>
            <torusGeometry args={[0.28, 0.035, 10, 24, Math.PI]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'fio-rompido':
      return (
        <group position={[0, -0.04, 0.2]}>
          <mesh>
            <torusGeometry args={[0.28, 0.035, 10, 16, Math.PI * 0.38]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI * 0.62]}>
            <torusGeometry args={[0.28, 0.035, 10, 16, Math.PI * 0.38]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'termopar':
      return (
        <group position={[0, 0, 0.2]}>
          <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 12]} />
            <meshStandardMaterial color="#8a8f98" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0.075, 0.26, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
          </mesh>
        </group>
      );
    case 'transistor':
      return (
        <group position={[0, 0.04, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.26, 20, 1, false, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#1c1c20" roughness={0.45} />
          </mesh>
          <mesh position={[0, 0, -0.001]}>
            <boxGeometry args={[0.3, 0.26, 0.02]} />
            <meshStandardMaterial color="#26262b" />
          </mesh>
          {[-0.07, 0, 0.07].map((x, i) => (
            <mesh key={i} position={[x, -0.2, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
              <meshStandardMaterial color="#c9cfda" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      );
    case 'injetor':
      return (
        <group position={[0, 0, 0.2]}>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.11, 0.13, 0.34, 20]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.18, 0.1, 0.14]} />
            <meshStandardMaterial color="#2a2d34" />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <coneGeometry args={[0.05, 0.14, 16]} />
            <meshStandardMaterial color="#8a8f98" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'bomba':
      return (
        <group position={[0, 0, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.17, 0.17, 0.5, 24]} />
            <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.175, 0.175, 0.12, 24]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
            <meshStandardMaterial color="#2a2d34" />
          </mesh>
        </group>
      );
    default:
      return (
        <group position={[0, 0.02, 0.2]}>
          <RoundedBox args={[0.5, 0.4, 0.2]} radius={0.05} smoothness={3}>
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
          </RoundedBox>
          <mesh position={[0, -0.24, 0]}>
            <boxGeometry args={[0.28, 0.12, 0.14]} />
            <meshStandardMaterial color="#22262e" />
          </mesh>
          {[-0.06, 0.06].map((x, i) => (
            <mesh key={i} position={[x, -0.34, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
              <meshStandardMaterial color="#c9cfda" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      );
  }
}

function BenchItem({
  index,
  onPick,
  measured,
}: {
  index: number;
  onPick: (id: string) => void;
  measured: boolean;
}) {
  const it = TEST_ITEMS[index];
  const c = itemCenter(index);
  return (
    <group position={c}>
      <RoundedBox
        args={[1.26, 0.9, 0.14]}
        radius={0.09}
        smoothness={3}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPick(it.id);
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <meshStandardMaterial
          color={measured ? '#ffffff' : '#e9eef4'}
          emissive={measured ? it.color : '#000'}
          emissiveIntensity={measured ? 0.35 : 0}
          roughness={0.6}
          metalness={0.05}
        />
      </RoundedBox>
      <mesh position={[0, 0.34, 0.06]}>
        <boxGeometry args={[1.26, 0.2, 0.06]} />
        <meshStandardMaterial color={it.color} />
      </mesh>
      <Text
        position={[0, 0.34, 0.12]}
        fontSize={0.096}
        color="#10151d"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.18}
      >
        {it.namePt}
      </Text>
      <BenchProp id={it.id} color={it.color} />
      <group position={RED_SOCK}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.12, 18]} />
          <meshStandardMaterial color="#7a1a12" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.14, 14]} />
          <meshStandardMaterial color="#c9cfda" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <group position={BLK_SOCK}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.12, 18]} />
          <meshStandardMaterial color="#15181d" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.14, 14]} />
          <meshStandardMaterial color="#c9cfda" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/* --------------------------------- Cena ---------------------------------- */

function Rig({
  fnId,
  setFnId,
  redJack,
  setRedJack,
  buttons,
  toggleButton,
  redTip,
  blackTip,
  setTip,
  dragging,
  setDragging,
  snapTips,
  pickItem,
  measuredId,
  reading,
  dragAngle,
  onKnobDown,
  onKnobRotate,
  onKnobRelease,
}: {
  fnId: string;
  setFnId: (id: string) => void;
  redJack: RedJack;
  setRedJack: (j: RedJack) => void;
  buttons: Record<string, boolean>;
  toggleButton: (id: string) => void;
  redTip: Vec3;
  blackTip: Vec3;
  setTip: (which: 'red' | 'black', p: Vec3) => void;
  dragging: 'red' | 'black' | 'knob' | null;
  setDragging: (d: 'red' | 'black' | 'knob' | null) => void;
  snapTips: (which: 'red' | 'black') => void;
  pickItem: (id: string) => void;
  measuredId: string | null;
  reading: Reading;
  dragAngle: number | null;
  onKnobDown: (e: ThreeEvent<PointerEvent>) => void;
  onKnobRotate: (pt: THREE.Vector3) => void;
  onKnobRelease: () => void;
}) {
  const onDown = (which: 'red' | 'black') => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(which);
  };

  return (
    <group>
      <MeterBody />
      <Lcd reading={reading} hold={buttons.HOLD} rel={buttons.REL} light={buttons.LIGHT} />
      <Dial fnId={fnId} dragAngle={dragAngle} onSelect={setFnId} onKnobDown={onKnobDown} />

      {/* botoes */}
      <MeterButton pos={[METERX - 0.75, 1.02, 0.3]} label="SEL" color="#f5a623" active={buttons.SELECT} onClick={() => toggleButton('SELECT')} />
      <MeterButton pos={[METERX - 0.25, 1.02, 0.3]} label="RANGE" color="#4a90e2" active={buttons.RANGE} onClick={() => toggleButton('RANGE')} />
      <MeterButton pos={[METERX + 0.25, 1.02, 0.3]} label="REL" color="#7ed37e" active={buttons.REL} onClick={() => toggleButton('REL')} />
      <MeterButton pos={[METERX + 0.75, 1.02, 0.3]} label="HOLD" color="#e2564a" active={buttons.HOLD} onClick={() => toggleButton('HOLD')} />
      <MeterButton pos={[METERX + 0.88, 1.36, 0.3]} label="LUZ" color="#ffd479" active={buttons.LIGHT} onClick={() => toggleButton('LIGHT')} />

      {/* terminais */}
      <Jack id="10A" labelPt="10A" color="#c23a2c" selected={redJack === '10A'} onSelect={(id) => setRedJack(id as RedJack)} />
      <Jack id="mAμA" labelPt="mA/µA" color="#c23a2c" selected={redJack === 'mAμA'} onSelect={(id) => setRedJack(id as RedJack)} />
      <Jack id="COM" labelPt="COM" color="#20242c" selected={false} />
      <Jack id="VΩHz" labelPt="VΩHz" color="#c23a2c" selected={redJack === 'VΩHz'} onSelect={(id) => setRedJack(id as RedJack)} />
      {/* trilhas explicativas dos terminais */}
      <TerminalGuide id="10A" lines={['10s MAX', '10A · FUSE']} />
      <TerminalGuide id="mAμA" lines={['400mA', 'FUSE']} />
      <TerminalGuide id="VΩHz" lines={['CAT III', '600V']} />

      {/* bancada */}
      {TEST_ITEMS.map((it, i) => (
        <BenchItem key={it.id} index={i} onPick={pickItem} measured={measuredId === it.id} />
      ))}

      {/* fios */}
      <Cable from={jackWorld('COM')} to={blackTip} color="#15181d" />
      <Cable from={jackWorld(redJack)} to={redTip} color="#c23a2c" />
      <ProbeTip pos={blackTip} color="#15181d" onDown={onDown('black')} />
      <ProbeTip pos={redTip} color="#c23a2c" onDown={onDown('red')} />

      {/* plano de arraste (so quando arrastando) */}
      {dragging && (
        <mesh
          position={[0, 0, 0.7]}
          onPointerMove={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            if (dragging === 'knob') onKnobRotate(e.point);
            else setTip(dragging, [e.point.x, e.point.y, 0.24]);
          }}
          onPointerUp={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            if (dragging === 'knob') onKnobRelease();
            else {
              snapTips(dragging);
              setDragging(null);
            }
          }}
          onPointerLeave={() => {
            if (dragging === 'knob') onKnobRelease();
            else if (dragging) {
              snapTips(dragging);
              setDragging(null);
            }
          }}
        >
          <planeGeometry args={[30, 20]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export function MultimeterScene() {
  const [fs, setFs] = useState(false);
  const [fnId, setFnId] = useState('dcv');
  const [redJack, setRedJack] = useState<RedJack>('VΩHz');
  const [buttons, setButtons] = useState<Record<string, boolean>>({
    SELECT: false,
    RANGE: false,
    REL: false,
    HOLD: false,
    LIGHT: false,
  });
  const [redTip, setRedTip] = useState<Vec3>([-0.7, -2.55, 0.24]);
  const [blackTip, setBlackTip] = useState<Vec3>([-1.55, -2.55, 0.24]);
  const [redItem, setRedItem] = useState<string | null>(null);
  const [blackItem, setBlackItem] = useState<string | null>(null);
  const [dragging, setDragging] = useState<'red' | 'black' | 'knob' | null>(null);
  const [knobDragAngle, setKnobDragAngle] = useState<number | null>(null);
  const [rangeIdx, setRangeIdx] = useState(-1); // -1 = AUTO
  const [correct, setCorrect] = useState<Set<string>>(() => new Set());

  const setTip = (which: 'red' | 'black', p: Vec3) => {
    if (which === 'red') setRedTip(p);
    else setBlackTip(p);
  };

  const snapTips = (which: 'red' | 'black') => {
    if (which === 'red') {
      const near = nearestSocket(redTip, 'red');
      setRedItem(near);
      if (near) {
        const s = SOCKETS.find((x) => x.id === near)!;
        setRedTip(s.red);
      }
    } else {
      const near = nearestSocket(blackTip, 'black');
      setBlackItem(near);
      if (near) {
        const s = SOCKETS.find((x) => x.id === near)!;
        setBlackTip(s.black);
      }
    }
  };

  const pickItem = (id: string) => {
    const s = SOCKETS.find((x) => x.id === id);
    if (!s) return;
    setRedTip(s.red);
    setBlackTip(s.black);
    setRedItem(id);
    setBlackItem(id);
  };

  const onKnobDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging('knob');
  };
  const onKnobRotate = (pt: THREE.Vector3) => {
    const theta = clampDialAngle(angleClockwiseFromTop(pt.x - METERX, pt.y - DIALY));
    setKnobDragAngle(theta);
    setFnId(nearestFnId(theta));
  };
  const onKnobRelease = () => {
    setKnobDragAngle(null);
    setDragging(null);
  };

  const measuredId = redItem && redItem === blackItem ? redItem : null;
  const measured = measuredId ? TEST_ITEMS_BY_ID[measuredId] : null;

  const fn = getFunctionById(fnId);
  const manualRangeMax =
    rangeIdx >= 0 && fn?.ranges && fn.ranges[rangeIdx] != null ? fn.ranges[rangeIdx] : undefined;

  const live = computeReading(fnId, redJack, measured, {
    secondary: buttons.SELECT,
    manualRangeMax,
  });

  // Ajuste ideal do item sob as pontas (para dica e confirmacao).
  const idealSetup = measuredId ? IDEAL_SETUP[measuredId] : undefined;
  const idealFn = idealSetup ? getFunctionById(idealSetup.fnId) : undefined;
  const isIdeal = !!(
    idealSetup &&
    fnId === idealSetup.fnId &&
    redJack === idealSetup.redJack &&
    live.ok &&
    !live.danger
  );
  useEffect(() => {
    if (measuredId && isIdeal) {
      setCorrect((prev) => {
        if (prev.has(measuredId)) return prev;
        const next = new Set(prev);
        next.add(measuredId);
        return next;
      });
    }
  }, [measuredId, isIdeal]);

  // REL: mostra a diferenca para a referencia
  const relRef = useRef(0);
  let reading = live;
  if (buttons.REL && live.ok && !Number.isNaN(parseFloat(live.primary))) {
    const num = parseFloat(live.primary) - relRef.current;
    reading = { ...live, primary: num.toFixed(decimalsOf(live.primary)), mode: `${live.mode} REL` };
  }

  const toggleButton = (id: string) => {
    setButtons((b) => {
      const next = { ...b, [id]: !b[id] };
      if (id === 'REL' && next.REL) relRef.current = parseFloat(live.primary) || 0;
      return next;
    });
    if (id === 'RANGE') {
      setRangeIdx((r) => {
        const n = fn?.ranges?.length ?? 0;
        if (n === 0) return -1;
        return r + 1 >= n ? -1 : r + 1; // ...faixas... -> AUTO
      });
    }
  };

  // HOLD congela: se ligado, guarda e mostra o ultimo valor
  const heldRef = useRef<Reading | null>(null);
  if (buttons.HOLD) {
    if (!heldRef.current) heldRef.current = reading;
    reading = heldRef.current;
  } else {
    heldRef.current = null;
  }

  const rangeLabel = manualRangeMax != null ? `manual ${fmtRange(manualRangeMax, fn?.unit)}` : 'AUTO';

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <div style={{ fontSize: 12, color: '#cfd8e6', lineHeight: 1.5 }}>
          <div>
            <strong style={{ color: '#ffd479' }}>Chave:</strong> {fn?.namePt} ({fn?.symbol}) ·{' '}
            <strong style={{ color: '#7fd3ff' }}>Terminal vermelho:</strong> {redJack} ·{' '}
            <strong>Faixa:</strong> {rangeLabel}
          </div>
          <div style={{ color: reading.danger ? '#ff8a6a' : reading.warnPt ? '#ffcf7a' : '#8ff0bd', minHeight: 18 }}>
            {reading.danger ? '⚠ ' : ''}
            {reading.warnPt ??
              (measured ? `Medindo: ${measured.namePt} — ${measured.descPt}` : 'Arraste as duas pontas ate um item (ou clique no item). Preta = COM.')}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 2, minHeight: 18 }}>
            <span>
              {measured && idealSetup ? (
                isIdeal ? (
                  <span style={{ color: '#8ff0bd', fontWeight: 600 }}>✓ Medição correta de {measured.namePt}!</span>
                ) : (
                  <span style={{ color: '#ffd479' }}>
                    Dica: gire para {idealFn?.symbol} ({idealFn?.namePt}) e use o terminal{' '}
                    {idealSetup.redJack === 'mAμA' ? 'mA/µA' : idealSetup.redJack}.
                  </span>
                )
              ) : null}
            </span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: correct.size === TEST_ITEMS.length ? '#8ff0bd' : '#9fb0c8' }}>
              {correct.size === TEST_ITEMS.length ? '🏆 ' : ''}Medidos: {correct.size}/{TEST_ITEMS.length}
            </span>
          </div>
        </div>
      }
    >
      <Canvas
        key={fs ? 'fs' : 'win'}
        camera={{ position: [0, 0, fs ? 8.5 : 8.9], fov: 42 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={[WHITE_BG]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 5, 6]} intensity={0.95} />
        <directionalLight position={[-5, 2, 4]} intensity={0.35} />
        <Environment resolution={128}>
          <Lightformer intensity={2.4} position={[0, 3, 6]} scale={[10, 6, 1]} />
          <Lightformer intensity={1.1} position={[-6, 1, 4]} scale={[4, 10, 1]} color="#dbe6ff" />
          <Lightformer intensity={0.9} position={[6, -2, 4]} scale={[5, 8, 1]} color="#fff0d6" />
        </Environment>
        <Rig
          fnId={fnId}
          setFnId={setFnId}
          redJack={redJack}
          setRedJack={setRedJack}
          buttons={buttons}
          toggleButton={toggleButton}
          redTip={redTip}
          blackTip={blackTip}
          setTip={setTip}
          dragging={dragging}
          setDragging={setDragging}
          snapTips={snapTips}
          pickItem={pickItem}
          measuredId={measuredId}
          reading={reading}
          dragAngle={dragging === 'knob' ? knobDragAngle : null}
          onKnobDown={onKnobDown}
          onKnobRotate={onKnobRotate}
          onKnobRelease={onKnobRelease}
        />
        <OrbitControls enablePan={false} enableRotate={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}

function decimalsOf(s: string): number {
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

function fmtRange(r: number, unit?: string): string {
  if (r >= 1e6) return `${r / 1e6} M${unit ?? ''}`;
  if (r >= 1e3) return `${r / 1e3} k${unit ?? ''}`;
  return `${r} ${unit ?? ''}`;
}
