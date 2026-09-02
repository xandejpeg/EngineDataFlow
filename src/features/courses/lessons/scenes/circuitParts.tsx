/* eslint-disable react-refresh/only-export-components */
/**
 * Kit de pecas de circuito reutilizado pelos 4 experimentos da Aula 0.
 * As pecas (bateria, resistor, lampada, motor) sao modelos Meshy (GLB) carregados
 * uma vez e reaproveitados entre as cenas. Fios e eletrons sao procedurais.
 * A fisica usa unidades reais: Volt (V), Ampere (A), Ohm (Ω), Watt (W), Celsius (°C).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const ELECTRON_COLOR = '#2563eb'; // azul: contraste no fundo branco
export const WHITE_BG = '#ffffff';
export const AMBIENT_C = 25; // temperatura ambiente de referencia

export const LESSON_MODELS = {
  battery: '/models/lesson/battery.glb',
  lamp: '/models/lesson/lamp.glb',
} as const;
export type LessonModelId = keyof typeof LESSON_MODELS;

// Pre-carrega os GLBs para reduzir o atraso ao abrir cada cena.
Object.values(LESSON_MODELS).forEach((u) => useGLTF.preload(u));

export interface PreparedModel {
  object: THREE.Group;
  materials: THREE.MeshStandardMaterial[];
}

/**
 * Carrega um GLB, clona (com materiais por instancia), centraliza na origem e
 * redimensiona para caber em `size` (maior dimensao). Retorna tambem os materiais
 * para animar emissao (brilho/calor) sem afetar outras instancias.
 */
export function useLessonModel(id: LessonModelId, size: number): PreparedModel {
  const { scene } = useGLTF(LESSON_MODELS[id]);
  return useMemo(() => {
    const root = scene.clone(true);
    const materials: THREE.MeshStandardMaterial[] = [];
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const src = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const cloned = src.map((m) => {
          const c = m.clone() as THREE.MeshStandardMaterial;
          if (c.emissive) materials.push(c);
          return c;
        });
        mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    const dim = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(dim);
    const maxDim = Math.max(dim.x, dim.y, dim.z) || 1;
    const k = size / maxDim;
    root.position.set(-center.x, -center.y, -center.z);
    const inner = new THREE.Group();
    inner.add(root);
    inner.scale.setScalar(k);
    const object = new THREE.Group();
    object.add(inner);
    return { object, materials };
  }, [scene, size]);
}

/** Define a emissao (cor + intensidade) de todos os materiais da peca. */
export function applyEmissive(
  prep: PreparedModel,
  color: THREE.ColorRepresentation,
  intensity: number,
) {
  for (const m of prep.materials) {
    m.emissive.set(color);
    m.emissiveIntensity = intensity;
  }
}

/** Tinge a cor base de todos os materiais da peca (ex.: lampada de outra cor). */
export function applyColor(prep: PreparedModel, color: THREE.ColorRepresentation) {
  for (const m of prep.materials) m.color.set(color);
}

/** Esmaece uma peca desligada (transparencia). */
export function applyOpacity(prep: PreparedModel, opacity: number) {
  prep.object.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const mm = m as THREE.MeshStandardMaterial;
        mm.transparent = opacity < 1;
        mm.opacity = opacity;
      }
    }
  });
}

/** Luz da lampada (spill) — o brilho do bulbo vem da emissao do proprio vidro. */
export function LampLight({ level }: { level: number }) {
  const l = THREE.MathUtils.clamp(level, 0, 1);
  return <pointLight color="#ffcf7a" intensity={l * 7} distance={4.5} />;
}

/** Cor do metal quente em funcao da temperatura (°C): frio -> laranja -> vermelho vivo. */
export function heatEmissive(tempC: number): { color: THREE.Color; intensity: number } {
  const hot = THREE.MathUtils.clamp((tempC - AMBIENT_C) / 200, 0, 1); // 25..225 °C
  const color = new THREE.Color('#3a0a00').lerp(new THREE.Color('#ff6a1e'), hot);
  return { color, intensity: hot * 3.2 };
}

/** Cor de corpo negro aproximada de um filamento em funcao da temperatura (°C):
 *  rubro escuro -> vermelho -> laranja -> amarelo -> branco quente. */
export function filamentColor(tempC: number): string {
  const stops: [number, string][] = [
    [600, '#3a0b00'],
    [900, '#ff3300'],
    [1300, '#ff6a1e'],
    [1800, '#ffa24b'],
    [2300, '#ffd48c'],
    [2700, '#ffeccb'],
    [3200, '#fff6ea'],
  ];
  if (tempC <= stops[0][0]) return stops[0][1];
  const last = stops[stops.length - 1];
  if (tempC >= last[0]) return last[1];
  for (let i = 1; i < stops.length; i++) {
    if (tempC <= stops[i][0]) {
      const [t0, c0] = stops[i - 1];
      const [t1, c1] = stops[i];
      const f = (tempC - t0) / (t1 - t0);
      return '#' + new THREE.Color(c0).lerp(new THREE.Color(c1), f).getHexString();
    }
  }
  return last[1];
}

export const FILAMENT_MAX_C = 2800; // °C: filamento de tungstenio incandescente no maximo
export const DRAPER_C = 525; // °C: inicio da luz visivel (ponto Draper)

/** Temperatura radiativa do filamento a partir da potencia normalizada (0..1): T ~ P^(1/4). */
export function filamentTempC(powerNorm: number): number {
  const p = Math.max(0, Math.min(1, powerNorm));
  return p > 0 ? AMBIENT_C + (FILAMENT_MAX_C - AMBIENT_C) * Math.pow(p, 0.25) : AMBIENT_C;
}

function toVec(points: [number, number, number][]) {
  return points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
}

/** Fio de circuito: segmentos retos (cilindros) + esferas nas juntas.
 *  `skipSegments` deixa um vao onde uma peca (fusivel/interruptor/lampada) faz a ponte. */
export function WirePath({
  points,
  closed = true,
  color = '#20242c',
  radius = 0.05,
  skipSegments = [],
}: {
  points: [number, number, number][];
  closed?: boolean;
  color?: string;
  radius?: number;
  skipSegments?: number[];
}) {
  const segments = useMemo(() => {
    const v = toVec(points);
    const up = new THREE.Vector3(0, 1, 0);
    const n = closed ? v.length : v.length - 1;
    return Array.from({ length: n }, (_, i) => {
      const a = v[i];
      const b = v[(i + 1) % v.length];
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      const pos = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize());
      return {
        pos: [pos.x, pos.y, pos.z] as [number, number, number],
        quat: [quat.x, quat.y, quat.z, quat.w] as [number, number, number, number],
        len,
      };
    });
  }, [points, closed]);

  return (
    <group>
      {segments.map((s, i) =>
        skipSegments.includes(i) ? null : (
          <mesh key={i} position={s.pos} quaternion={s.quat}>
            <cylinderGeometry args={[radius, radius, s.len, 10]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.55} />
          </mesh>
        ),
      )}
      {points.map((p, i) => (
        <mesh key={`j${i}`} position={p}>
          <sphereGeometry args={[radius * 1.1, 10, 10]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/** Conector vermelho (terminal) que liga o fio a uma perna/contato da peca. */
export function Terminal({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial
        color="#d63a2a"
        metalness={0.25}
        roughness={0.5}
        emissive="#5a0f08"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

/** Eletrons ao longo de uma polilinha: `count` espacados, movendo a `speed`. */
export function PathElectrons({
  points,
  closed = true,
  count,
  speed,
  size = 0.08,
}: {
  points: [number, number, number][];
  closed?: boolean;
  count: number;
  speed: number;
  size?: number;
}) {
  const MAX = 60;
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const path = useMemo(() => {
    const v = toVec(points);
    const pts = closed ? [...v, v[0]] : v;
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
    return { pts, cum, total: cum[cum.length - 1] || 1 };
  }, [points, closed]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const vis = Math.max(0, Math.min(count, MAX));
    for (let i = 0; i < MAX; i++) {
      const m = refs.current[i];
      if (!m) continue;
      if (i >= vis) {
        m.visible = false;
        continue;
      }
      m.visible = true;
      const u = (i / vis + t * speed) % 1;
      const d = u * path.total;
      let j = 1;
      while (j < path.cum.length && path.cum[j] < d) j++;
      const segLen = path.cum[j] - path.cum[j - 1] || 1;
      const f = (d - path.cum[j - 1]) / segLen;
      tmp.lerpVectors(path.pts[j - 1], path.pts[j], f);
      m.position.copy(tmp);
    }
  });

  return (
    <>
      {Array.from({ length: MAX }, (_, i) => (
        <mesh key={i} ref={(m) => (refs.current[i] = m)}>
          <sphereGeometry args={[size, 10, 10]} />
          <meshStandardMaterial
            color={ELECTRON_COLOR}
            emissive={ELECTRON_COLOR}
            emissiveIntensity={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
    </>
  );
}

/** Iluminacao padrao das cenas (fundo branco, sem HDR/CDN). */
export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#ffffff', '#dfe4ec', 0.8]} />
      <directionalLight position={[5, 8, 6]} intensity={1.05} />
      <directionalLight position={[-4, 3, -2]} intensity={0.35} />
    </>
  );
}

/** Circuito real em serie: bateria -> fusivel -> interruptor -> lampada.
 *  A fiacao liga cada terminal (pontos vermelhos); o interruptor liga/desliga. */
const NODES = {
  batPlus: [-2.05, -0.3, 0] as [number, number, number],
  batMinus: [-2.75, -0.3, 0] as [number, number, number],
  fuseL: [-1.225, 1.1, 0] as [number, number, number],
  fuseR: [-0.975, 1.1, 0] as [number, number, number],
  swL: [0.45, 1.1, 0] as [number, number, number],
  swR: [0.75, 1.1, 0] as [number, number, number],
  lampIn: [2.45, -0.55, 0] as [number, number, number],
  lampOut: [2.95, -0.55, 0] as [number, number, number],
};

const WIRE_PATH: [number, number, number][] = [
  NODES.batPlus,
  [-2.05, 1.1, 0],
  NODES.fuseL,
  NODES.fuseR,
  NODES.swL,
  NODES.swR,
  [2.45, 1.1, 0],
  NODES.lampIn,
  NODES.lampOut,
  [2.95, -1.4, 0],
  [-2.75, -1.4, 0],
  NODES.batMinus,
];

const ALL_TERMINALS: [number, number, number][] = [
  NODES.batPlus,
  NODES.batMinus,
  NODES.fuseL,
  NODES.fuseR,
  NODES.swL,
  NODES.swR,
  NODES.lampIn,
  NODES.lampOut,
];

/** Pontos de conexao do circuito (para medicao com multimetro na Aula 2). */
export const CIRCUIT_NODES: { id: string; pos: [number, number, number]; label: string; short: string }[] = [
  { id: 'batPlus', pos: NODES.batPlus, label: 'Bateria (+)', short: 'B+' },
  { id: 'batMinus', pos: NODES.batMinus, label: 'Bateria (−)', short: 'B-' },
  { id: 'fuseL', pos: NODES.fuseL, label: 'Fusivel (entrada)', short: 'F1' },
  { id: 'fuseR', pos: NODES.fuseR, label: 'Fusivel (saida)', short: 'F2' },
  { id: 'swL', pos: NODES.swL, label: 'Interruptor (entrada)', short: 'S1' },
  { id: 'swR', pos: NODES.swR, label: 'Interruptor (saida)', short: 'S2' },
  { id: 'lampIn', pos: NODES.lampIn, label: 'Lampada (entrada)', short: 'L1' },
  { id: 'lampOut', pos: NODES.lampOut, label: 'Lampada (saida)', short: 'L2' },
];

/** Soquete da lampada (procedural) onde a base do bulbo se encaixa. */
function LampSocket({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.24, 0.28, 0.42, 20]} />
        <meshStandardMaterial color="#2b3038" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.17, 0.2, 0.16, 16]} />
        <meshStandardMaterial color="#b9902f" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Postes metalicos da bateria nos dois polos. */
function BatteryPosts() {
  return (
    <group>
      {[NODES.batMinus, NODES.batPlus].map((p, i) => (
        <mesh key={i} position={[p[0], p[1] - 0.12, p[2]]}>
          <cylinderGeometry args={[0.08, 0.1, 0.22, 12]} />
          <meshStandardMaterial color="#9aa0aa" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

/** Fusivel de lamina (ATO) procedural, EM PE: corpo translucido + duas laminas
 *  que descem ate os fios (pernas = pontos de conexao). */
function CircuitFuse({ blown }: { blown: boolean }) {
  return (
    <group position={[-1.1, 1.1, 0]}>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.34, 0.54, 0.16]} />
        <meshStandardMaterial
          color={blown ? '#6e1a10' : '#d83a2a'}
          transparent
          opacity={0.9}
          emissive={blown ? '#ff2a00' : '#000000'}
          emissiveIntensity={blown ? 1.6 : 0}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.13]} />
        <meshStandardMaterial color="#b03225" roughness={0.5} />
      </mesh>
      {/* elemento interno */}
      <mesh position={[0, 0.46, 0.085]}>
        <boxGeometry args={[0.16, 0.36, 0.015]} />
        <meshStandardMaterial color={blown ? '#3a3a3a' : '#e2c46a'} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* laminas (pernas) descendo ate os fios em x = +-0.125 (fuseL/fuseR) */}
      <mesh position={[-0.125, 0.02, 0]}>
        <boxGeometry args={[0.07, 0.38, 0.04]} />
        <meshStandardMaterial color="#c9ccd2" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.125, 0.02, 0]}>
        <boxGeometry args={[0.07, 0.38, 0.04]} />
        <meshStandardMaterial color="#c9ccd2" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Interruptor de alavanca procedural: base fixa + SO a alavanca gira (ON/OFF).
 *  Dois terminais descem ate os fios (swL/swR). Clicar na ALAVANCA alterna. */
function CircuitSwitch({ on, onToggle }: { on: boolean; onToggle?: () => void }) {
  return (
    <group position={[0.6, 1.1, 0]}>
      {/* base fixa */}
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[0.42, 0.32, 0.36]} />
        <meshStandardMaterial color="#15181e" metalness={0.35} roughness={0.55} />
      </mesh>
      {/* barril de montagem */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.16, 16]} />
        <meshStandardMaterial color="#c9ccd2" metalness={0.85} roughness={0.22} />
      </mesh>
      {/* ALAVANCA: so este grupo gira (esquerda OFF / direita ON). Clicar AQUI alterna. */}
      <group
        position={[0, 0.5, 0]}
        rotation={[0, 0, on ? -0.55 : 0.55]}
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* area de clique generosa da alavanca */}
        <mesh position={[0, 0.24, 0]}>
          <boxGeometry args={[0.4, 0.66, 0.5]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.045, 0.052, 0.36, 12]} />
          <meshStandardMaterial color="#e0e3e8" metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <sphereGeometry args={[0.07, 14, 14]} />
          <meshStandardMaterial color="#e0e3e8" metalness={0.9} roughness={0.18} />
        </mesh>
      </group>
      {/* terminais descendo ate os fios em x = +-0.15 (swL/swR) */}
      <mesh position={[-0.15, 0, 0]}>
        <boxGeometry args={[0.06, 0.22, 0.04]} />
        <meshStandardMaterial color="#caa64a" metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <boxGeometry args={[0.06, 0.22, 0.04]} />
        <meshStandardMaterial color="#caa64a" metalness={0.75} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Fusivel animado: ao substituir (queimado -> novo) ele sobe e desce um novo. */
function AnimatedFuse({ blown, onSwapping }: { blown: boolean; onSwapping?: (b: boolean) => void }) {
  const grp = useRef<THREE.Group>(null);
  const [showBlown, setShowBlown] = useState(false);
  const anim = useRef<{ phase: 'idle' | 'up' | 'down'; t: number; prev: boolean }>({
    phase: 'idle',
    t: 0,
    prev: blown,
  });

  useEffect(() => {
    if (anim.current.prev && !blown && anim.current.phase === 'idle') {
      anim.current.phase = 'up';
      anim.current.t = 0;
      setShowBlown(true);
      onSwapping?.(true);
    } else if (anim.current.phase === 'idle') {
      setShowBlown(blown);
    }
    anim.current.prev = blown;
  }, [blown, onSwapping]);

  useFrame((_, dt) => {
    const a = anim.current;
    const g = grp.current;
    if (!g) return;
    const SPEED = 2.6;
    const RISE = 2.4;
    if (a.phase === 'up') {
      a.t = Math.min(1, a.t + dt * SPEED);
      g.position.y = RISE * a.t;
      if (a.t >= 1) {
        a.phase = 'down';
        a.t = 0;
        setShowBlown(false);
      }
    } else if (a.phase === 'down') {
      a.t = Math.min(1, a.t + dt * SPEED);
      g.position.y = RISE * (1 - a.t);
      if (a.t >= 1) {
        a.phase = 'idle';
        g.position.y = 0;
        onSwapping?.(false);
      }
    }
  });

  return (
    <group ref={grp}>
      <CircuitFuse blown={showBlown} />
    </group>
  );
}

/** Lampada animada: ao trocar de cor, o bulbo sai (desliza+some) e entra um novo. */
function AnimatedLamp({
  color,
  level,
  glowColor,
  onSwapping,
}: {
  color: string;
  level: number;
  glowColor?: string;
  onSwapping?: (b: boolean) => void;
}) {
  const prep = useLessonModel('lamp', 1.5);
  const grp = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const anim = useRef<{ phase: 'idle' | 'out' | 'in'; t: number; shown: string }>({
    phase: 'idle',
    t: 0,
    shown: color,
  });

  useEffect(() => {
    if (color !== anim.current.shown && anim.current.phase === 'idle') {
      anim.current.phase = 'out';
      anim.current.t = 0;
      onSwapping?.(true);
    }
  }, [color, onSwapping]);

  useFrame((_, dt) => {
    const a = anim.current;
    const g = grp.current;
    if (!g) return;
    const SPEED = 2.6;
    const DIST = 1.5;
    if (a.phase === 'out') {
      a.t = Math.min(1, a.t + dt * SPEED);
      g.position.x = 2.7 - DIST * a.t;
      applyOpacity(prep, 1 - a.t);
      if (a.t >= 1) {
        a.phase = 'in';
        a.t = 0;
        a.shown = color;
      }
    } else if (a.phase === 'in') {
      a.t = Math.min(1, a.t + dt * SPEED);
      g.position.x = 2.7 - DIST * (1 - a.t);
      applyOpacity(prep, a.t);
      if (a.t >= 1) {
        a.phase = 'idle';
        g.position.x = 2.7;
        applyOpacity(prep, 1);
        onSwapping?.(false);
      }
    }
    const glow = a.phase === 'idle' ? level : 0;
    const emc = glowColor ?? a.shown;
    applyColor(prep, a.shown);
    applyEmissive(prep, emc, glow > 0.001 ? 0.12 + glow * 2.3 : 0);
    if (light.current) {
      light.current.color.set(emc);
      light.current.intensity = glow * 7;
    }
  });

  return (
    <group ref={grp} position={[2.7, 0.3, 0]}>
      <primitive object={prep.object} />
      <pointLight ref={light} distance={4.5} intensity={0} />
    </group>
  );
}

export function CircuitStage({
  lampLevel,
  electronCount,
  electronSpeed,
  switchOn = true,
  onToggleSwitch,
  fuseBlown = false,
  lampColor = '#ffcf7a',
  glowColor,
  lampOn,
}: {
  lampLevel: number;
  electronCount: number;
  electronSpeed: number;
  switchOn?: boolean;
  onToggleSwitch?: () => void;
  fuseBlown?: boolean;
  lampColor?: string;
  glowColor?: string;
  lampOn?: boolean;
}) {
  const battery = useLessonModel('battery', 1.7);
  const [lampSwapping, setLampSwapping] = useState(false);
  const [fuseSwapping, setFuseSwapping] = useState(false);
  const paused = lampSwapping || fuseSwapping;
  const conducting = (lampOn != null ? lampOn : switchOn && !fuseBlown) && !paused;
  const flowing = conducting && electronCount > 0;
  const lampGlow = conducting ? lampLevel : 0;

  return (
    <group>
      <WirePath points={WIRE_PATH} skipSegments={[2, 4, 7, 11]} />
      {ALL_TERMINALS.map((p, i) => (
        <Terminal key={i} position={p} />
      ))}

      <group position={[-2.4, -0.75, 0]}>
        <primitive object={battery.object} />
      </group>
      <BatteryPosts />

      <AnimatedFuse blown={fuseBlown} onSwapping={setFuseSwapping} />

      <CircuitSwitch on={switchOn} onToggle={onToggleSwitch} />

      <LampSocket position={[2.7, -0.5, 0]} />
      <AnimatedLamp color={lampColor} level={lampGlow} glowColor={glowColor} onSwapping={setLampSwapping} />

      {flowing && (
        <PathElectrons points={WIRE_PATH} count={electronCount} speed={electronSpeed} />
      )}
    </group>
  );
}
