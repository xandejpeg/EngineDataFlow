/* eslint-disable react-refresh/only-export-components */
/**
 * Aula 3 — motor em linha animado (paginas 2 e 3: 2 cil./4 valvulas e
 * 4 cil./8 valvulas).
 *
 * Reaproveita a cinematica e as pecas da pagina 1 (monocilindro). Cada cilindro
 * tem 2 valvulas comandadas por dois eixos-comando (admissao/escape) que giram
 * na metade da rotacao e no MESMO sentido do virabrequim, puxados pela correia
 * dentada.
 *
 * REFERENCIA: o cilindro 1 e o vizinho da correia dentada e a linha do tempo
 * comeca (0°) com ele em BALANCO — pistao no PMS, as duas valvulas fechadas e
 * os dois cames apontados um para o outro. Lendo os cames: dois para dentro =
 * balanco; dois para baixo = cruzamento; so admissao atuando = admissao; so
 * escape atuando = escape.
 */
import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Environment, Lightformer, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SceneShell, Slider } from './sceneUi';
import {
  ConnRod,
  CylinderBarrel,
  CylinderHead,
  Injector,
  IntakeSystem,
  ExhaustSystem,
  Piston,
  PoppetValve,
  INTAKE_PIPE,
  EXHAUST_PIPE,
  INTAKE_X,
  EXHAUST_X,
  VALVE_MAX_LIFT,
  CAM_CENTER_Y,
  CAM_RB,
  CAM_LN,
  INJECTOR_TIP,
} from './engineParts';
import {
  BORE_R,
  CRANK_R,
  CRANK_Y,
  DECK_Y,
  CAM_PHASE_EXHAUST,
  CAM_PHASE_INTAKE,
  camBump,
  chargeFill,
  combustionFlash,
  crankSlider,
  exhaustLift,
  intakeLift,
  strokeAt,
  wrapCycle,
} from './enginePhysics';

const WHITE_BG = '#ffffff';
const BASE_OMEGA = Math.PI; // rad/s do virabrequim em 1.0x
const STEP_OMEGA = Math.PI * 0.8;
const TWO_CYCLE = Math.PI * 4; // 720°
const DEG = Math.PI / 180;

const SPACING = 1.85; // distancia entre cilindros (eixo do bloco = Z local)

interface Layout {
  n: number;
  /** Posicao de cada cilindro ao longo do bloco; indice 0 = cilindro 1. */
  zOf: number[];
  /** Defasagem de ciclo (graus) de cada cilindro; define a ordem de ignicao. */
  phases: number[];
  /** Z do lado A, onde fica a correia dentada (junto do cilindro 1). */
  zBelt: number;
  label: string;
  cam: [number, number, number];
  camFs: [number, number, number];
}

function makeLayout(phases: number[], label: string, cam: [number, number, number], camFs: [number, number, number]): Layout {
  const n = phases.length;
  const zOf = Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * SPACING);
  return { n, zOf, phases, zBelt: zOf[0] - 0.62, label, cam, camFs };
}

/** 2 cilindros: manivelas a 180°, pistoes opostos (um no PMS, outro no PMI). */
export const LAYOUT_2 = makeLayout([0, 180], 'Motor 2 cilindros · 4 valvulas', [11.7, 2.6, 11.7], [9.4, 2.2, 9.4]);
/**
 * 4 cilindros em linha: 1 e 4 sobem juntos, 2 e 3 sobem juntos, e a ordem de
 * ignicao e 1-3-4-2. Com o cilindro 1 em BALANCO o companheiro (4) fica em
 * CRUZAMENTO e os outros dois em admissao/escape — os 4 estados de uma vez.
 */
export const LAYOUT_4 = makeLayout([0, 180, 540, 360], 'Motor 4 cilindros · 8 valvulas', [11.6, 2.9, 11.6], [9.6, 2.4, 9.6]);

/**
 * Ciclo (0..720°) do cilindro 1 quando a linha do tempo marca 0°. 360° = PMS de
 * compressao = BALANCO. E o ponto de referencia de montagem: cilindro 1 (o da
 * correia dentada) no PMS com as duas valvulas fechadas e os cames cruzados
 * para cima. Todo o resto do ciclo decorre dai.
 */
export const CYCLE0 = 360;

export const CAM_STATES = {
  balanco: { label: 'BALANCO', color: '#16a34a' },
  cruzamento: { label: 'CRUZAMENTO', color: '#7c3aed' },
  admissao: { label: 'ADMISSAO', color: '#0284c7' },
  escape: { label: 'ESCAPE', color: '#b45309' },
} as const;
export type CamStateKey = keyof typeof CAM_STATES;

/** Estado do cilindro lido pelos cames que estao acima dele. */
export function camStateOf(inLift: number, exLift: number): CamStateKey {
  const adm = inLift > 0.02;
  const esc = exLift > 0.02;
  if (adm && esc) return 'cruzamento';
  if (adm) return 'admissao';
  if (esc) return 'escape';
  return 'balanco';
}

const C_AIR = new THREE.Color('#38bdf8');
const C_FUEL = new THREE.Color('#f5a623');
const C_MIX = new THREE.Color('#2ec16b');
const C_BURN = new THREE.Color('#ff5722');
const C_EXH = new THREE.Color('#8b93a1');

const CRANK_MAT = { color: '#8f97a2', metalness: 0.85, roughness: 0.3 } as const;
const STEEL = { color: '#c4ccd6', metalness: 0.9, roughness: 0.3 } as const;
const DARK = { color: '#5c636e', metalness: 0.8, roughness: 0.4 } as const;

const smooth = (t: number) => t * t * (3 - 2 * t);

function polyAt(pts: number[][], p: number): [number, number, number] {
  const n = pts.length - 1;
  const f = Math.min(0.99999, Math.max(0, p)) * n;
  const i = Math.floor(f);
  const t = f - i;
  const a = pts[i];
  const b = pts[i + 1];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

const INTAKE_PATH: number[][] = [
  [1.74, DECK_Y + 1.44, 0],
  [1.56, DECK_Y + 1.16, 0],
  ...[...INTAKE_PIPE].reverse(),
  [INTAKE_X, DECK_Y - 0.05, 0],
  [INTAKE_X * 0.5, DECK_Y - 0.42, 0],
];
const EXHAUST_PATH: number[][] = [
  [EXHAUST_X * 0.5, DECK_Y - 0.4, 0],
  [EXHAUST_X, DECK_Y - 0.05, 0],
  ...EXHAUST_PIPE,
  [-2.5, DECK_Y - 0.72, 0],
];
const shiftZ = (path: number[][], dz: number) => path.map((p) => [p[0], p[1], p[2] + dz]);

function makeDot(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.45, 'rgba(255,255,255,0.85)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

function buildPoints(count: number, withColor: boolean) {
  const pos = new Float32Array(count * 3);
  const col = withColor ? new Float32Array(count * 3) : null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (col) geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return { pos, col, geo };
}

/** Ressalto do comando desenhado com a PONTA para cima (+Y) em repouso. */
export function lobeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = CAM_RB + CAM_LN * camBump(a);
    const x = r * Math.sin(a);
    const y = r * Math.cos(a);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: false, curveSegments: 24 });
  geo.translate(0, 0, -0.07);
  return geo;
}
/**
 * Giro do ressalto. O comando acompanha o virabrequim (sentido horario, por
 * isso o sinal negativo) e o `-lobePhase` faz a ponta cair exatamente sobre o
 * tucho no instante em que `camLift` chega ao maximo. Consequencia direta:
 * ponta para baixo = valvula aberta, ponta para cima = valvula fechada.
 */
export const lobeAngle = (camRad: number, lobePhase: number) => -camRad - lobePhase;

/* --- Lado A (frente): correia dentada liga o virabrequim aos 2 comandos (1:2) --- */
const R_CRANK_SPKT = 0.13;
const R_CAM_SPKT = 0.24;

/** Polia/engrenagem dentada de sincronismo (dentes ao redor do aro). */
function Sprocket({ r, teeth }: { r: number; teeth: number }) {
  const th = 0.07;
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, th, 28]} />
        <meshStandardMaterial {...CRANK_MAT} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.34, r * 0.34, th + 0.03, 16]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      {Array.from({ length: teeth }).map((_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.028, 0.05, th * 0.85]} />
            <meshStandardMaterial {...DARK} />
          </mesh>
        );
      })}
    </group>
  );
}

function makeBeltTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 4;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#16181d';
    g.fillRect(0, 0, 8, 4);
    g.fillStyle = '#333944';
    g.fillRect(0, 0, 4, 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(80, 1);
  return t;
}

/** Correia dentada: alca fechada abracando o virabrequim e os 2 comandos. */
function beltGeometry(): THREE.BufferGeometry {
  const g = 0.06;
  const pts: [number, number][] = [
    [R_CRANK_SPKT + g, CRANK_Y],
    [INTAKE_X + R_CAM_SPKT + g, CAM_CENTER_Y],
    [INTAKE_X, CAM_CENTER_Y + R_CAM_SPKT + g],
    [EXHAUST_X, CAM_CENTER_Y + R_CAM_SPKT + g],
    [EXHAUST_X - R_CAM_SPKT - g, CAM_CENTER_Y],
    [-(R_CRANK_SPKT + g), CRANK_Y],
    [0, CRANK_Y - R_CRANK_SPKT - g],
  ];
  const curve = new THREE.CatmullRomCurve3(
    pts.map((p) => new THREE.Vector3(p[0], p[1], 0)),
    true,
  );
  return new THREE.TubeGeometry(curve, 160, 0.045, 6, true);
}

const NC = 30; // particulas de carga por cilindro
const NS = 16; // particulas de fluxo por cilindro
const NK = 10; // particulas do jato por cilindro

/** Virabrequim unico: uma manivela por cilindro, na defasagem do layout, + volante. */
function CrankShaft({ lay }: { lay: Layout }) {
  const cheekR = 0.6;
  const journals = [lay.zOf[0] - 0.42, ...lay.zOf.slice(0, -1).map((z) => z + SPACING / 2), lay.zOf[lay.n - 1] + 0.42];
  return (
    <group>
      {journals.map((z, k) => (
        <mesh key={`j${k}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.32, 22]} />
          <meshStandardMaterial {...CRANK_MAT} />
        </mesh>
      ))}
      {lay.zOf.map((z, i) => (
        <group key={i} position={[0, 0, z]} rotation={[0, 0, -lay.phases[i] * DEG]}>
          {[0.32, -0.32].map((cz) => (
            <group key={cz} position={[0, 0, cz]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[cheekR, cheekR, 0.13, 40]} />
                <meshStandardMaterial {...CRANK_MAT} />
              </mesh>
              <mesh position={[0, -0.32, 0]}>
                <boxGeometry args={[0.9, 0.56, 0.13]} />
                <meshStandardMaterial {...DARK} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, CRANK_R, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.78, 20]} />
            <meshStandardMaterial {...STEEL} />
          </mesh>
        </group>
      ))}
      {/* volante numa ponta */}
      <mesh position={[0, 0, lay.zOf[lay.n - 1] + 0.66]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.16, 44]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* engrenagem dentada do virabrequim (lado A) que puxa a correia */}
      <group position={[0, 0, lay.zBelt]}>
        <Sprocket r={R_CRANK_SPKT} teeth={11} />
      </group>
    </group>
  );
}

/** Carter unico que abraca todos os cilindros (topo aberto para as bielas). */
function Crankcase({ xray, lay }: { xray: boolean; lay: Layout }) {
  const W = 2.0;
  const D = lay.n * SPACING + 0.5;
  const H = 1.7;
  const T = 0.12;
  const y = CRANK_Y - 0.05;
  const wallX = W / 2 - T / 2;
  const shell = (
    <meshStandardMaterial
      color="#c2c9d2"
      metalness={xray ? 0.1 : 0.5}
      roughness={xray ? 0.12 : 0.55}
      transparent={xray}
      opacity={xray ? 0.1 : 1}
      depthWrite={!xray}
    />
  );
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, -H / 2 + T / 2, 0]}>
        <boxGeometry args={[W, T, D]} />
        {shell}
      </mesh>
      {[wallX, -wallX].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[T, H, D]} />
          {shell}
        </mesh>
      ))}
      {[D / 2 - T / 2, -(D / 2 - T / 2)].map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <boxGeometry args={[W, H, T]} />
          {shell}
        </mesh>
      ))}
      <mesh position={[0, -H / 2 - 0.16, 0]}>
        <boxGeometry args={[1.5, 0.42, D * 0.82]} />
        <meshStandardMaterial color="#3b414b" metalness={0.5} roughness={0.55} />
      </mesh>
    </group>
  );
}

/** Um comando (admissao ou escape): eixo ao longo de Z + 1 ressalto por cilindro. */
export function CamShaft({
  x,
  geom,
  lobeRefs,
  zOf,
  len,
  bearings,
  tint,
}: {
  x: number;
  geom: THREE.BufferGeometry;
  lobeRefs: React.MutableRefObject<(THREE.Group | null)[]>;
  zOf: number[];
  len: number;
  bearings: number[];
  tint: string;
}) {
  return (
    <group position={[x, CAM_CENTER_Y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, len, 20]} />
        <meshStandardMaterial {...CRANK_MAT} />
      </mesh>
      {bearings.map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 18]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
      ))}
      {zOf.map((z, i) => (
        <group key={i} ref={(g) => (lobeRefs.current[i] = g)} position={[0, 0, z]}>
          <mesh geometry={geom}>
            <meshStandardMaterial color={tint} metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Placa flutuante acima dos comandos: o estado que os cames daquele cilindro mostram. */
export function CamStateBadge({ z, sub, state }: { z: number; sub: string; state: CamStateKey }) {
  const s = CAM_STATES[state];
  return (
    <Billboard position={[0, CAM_CENTER_Y + 0.72, z]}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.42, 0.46]} />
        <meshBasicMaterial color={s.color} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.36, 0.4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Text position={[0, 0.055, 0]} fontSize={0.145} color={s.color} anchorX="center" anchorY="middle">
        {s.label}
      </Text>
      <Text position={[0, -0.115, 0]} fontSize={0.082} color="#475569" anchorX="center" anchorY="middle">
        {sub}
      </Text>
    </Billboard>
  );
}

interface RigProps {
  lay: Layout;
  running: boolean;
  speed: number;
  xray: boolean;
  stepRef: React.MutableRefObject<number | null>;
  scrubRef: React.MutableRefObject<number | null>;
  onSample: (deg: number) => void;
}

interface CylParts {
  charge: ReturnType<typeof buildPoints> & {
    seed: { ang: number; rad: number; u: number; jit: number; isFuel: boolean }[];
  };
  intake: ReturnType<typeof buildPoints> & { off: number[]; zsp: number[]; path: number[][] };
  exhaust: ReturnType<typeof buildPoints> & { off: number[]; zsp: number[]; path: number[][] };
  spray: ReturnType<typeof buildPoints> & { off: number[]; sp: number[] };
}

/** Motor em linha 3D + animacao (um unico useFrame governa tudo). */
function EngineRig({ lay, running, speed, xray, stepRef, scrubRef, onSample }: RigProps) {
  const dot = useMemo(makeDot, []);
  const lobeGeo = useMemo(() => lobeGeometry(), []);
  const beltGeo = useMemo(beltGeometry, []);
  const beltTex = useMemo(makeBeltTexture, []);

  const chargeMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.15,
        map: dot,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [dot],
  );
  const intakeMat = useMemo(
    () => new THREE.PointsMaterial({ size: 0.13, map: dot, color: new THREE.Color('#38bdf8'), transparent: true, depthWrite: false, sizeAttenuation: true }),
    [dot],
  );
  const exhaustMat = useMemo(
    () => new THREE.PointsMaterial({ size: 0.13, map: dot, color: new THREE.Color('#8b93a1'), transparent: true, depthWrite: false, sizeAttenuation: true }),
    [dot],
  );
  const sprayMat = useMemo(
    () => new THREE.PointsMaterial({ size: 0.13, map: dot, color: new THREE.Color('#f5a623'), transparent: true, depthWrite: false, sizeAttenuation: true }),
    [dot],
  );

  const cyls = useMemo<CylParts[]>(
    () =>
      lay.zOf.map((zc) => ({
        charge: {
          ...buildPoints(NC, true),
          seed: Array.from({ length: NC }, () => ({
            ang: Math.random() * Math.PI * 2,
            rad: 0.25 + Math.random() * 0.7,
            u: Math.random(),
            jit: Math.random() * Math.PI * 2,
            isFuel: Math.random() < 0.32,
          })),
        },
        intake: {
          ...buildPoints(NS, false),
          off: Array.from({ length: NS }, () => Math.random()),
          zsp: Array.from({ length: NS }, () => (Math.random() - 0.5) * 0.4),
          path: shiftZ(INTAKE_PATH, zc),
        },
        exhaust: {
          ...buildPoints(NS, false),
          off: Array.from({ length: NS }, () => Math.random()),
          zsp: Array.from({ length: NS }, () => (Math.random() - 0.5) * 0.4),
          path: shiftZ(EXHAUST_PATH, zc),
        },
        spray: {
          ...buildPoints(NK, false),
          off: Array.from({ length: NK }, () => Math.random()),
          sp: Array.from({ length: NK }, () => (Math.random() - 0.5) * 0.28),
        },
      })),
    [lay],
  );

  const crankRef = useRef<THREE.Group>(null);
  const pistonRefs = useRef<(THREE.Group | null)[]>([]);
  const rodRefs = useRef<(THREE.Group | null)[]>([]);
  const inValveRefs = useRef<(THREE.Group | null)[]>([]);
  const exValveRefs = useRef<(THREE.Group | null)[]>([]);
  const inLobeRefs = useRef<(THREE.Group | null)[]>([]);
  const exLobeRefs = useRef<(THREE.Group | null)[]>([]);
  const inSprocketRef = useRef<THREE.Group>(null);
  const exSprocketRef = useRef<THREE.Group>(null);
  const flashRefs = useRef<(THREE.Mesh | null)[]>([]);
  const chargeRefs = useRef<(THREE.Points | null)[]>([]);
  const intakeRefs = useRef<(THREE.Points | null)[]>([]);
  const exhaustRefs = useRef<(THREE.Points | null)[]>([]);
  const sprayRefs = useRef<(THREE.Points | null)[]>([]);

  const cycleRad = useRef(0);
  const simTime = useRef(0);
  const acc = useRef(0);
  const camKeys = useRef<CamStateKey[]>(
    lay.phases.map((p) => {
      const d = wrapCycle(CYCLE0 + p);
      return camStateOf(intakeLift(d), exhaustLift(d));
    }),
  );
  const [camStates, setCamStates] = useState<CamStateKey[]>(camKeys.current);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const before = cycleRad.current;
    let advanced = 0;
    if (scrubRef.current != null) {
      const c = ((scrubRef.current % 720) + 720) % 720;
      cycleRad.current = c * DEG;
      scrubRef.current = null;
    } else if (stepRef.current != null) {
      const target = stepRef.current * DEG;
      const next = Math.min(target, cycleRad.current + dt * STEP_OMEGA);
      advanced = next - before;
      if (next >= target - 1e-3) {
        cycleRad.current = target >= TWO_CYCLE - 1e-3 ? 0 : target;
        stepRef.current = null;
      } else {
        cycleRad.current = next;
      }
    } else if (running) {
      advanced = dt * BASE_OMEGA * speed;
      cycleRad.current += advanced;
    }
    simTime.current += Math.max(0, advanced);
    if (cycleRad.current >= TWO_CYCLE) cycleRad.current -= TWO_CYCLE;

    const masterDeg = wrapCycle((cycleRad.current * 180) / Math.PI);
    const t = (simTime.current / Math.PI) * 0.6;
    const nextCam: CamStateKey[] = [];

    if (crankRef.current) crankRef.current.rotation.z = -cycleRad.current;
    // comandos (e suas polias) giram na METADE da rotacao do virabrequim (1:2)
    if (inSprocketRef.current) inSprocketRef.current.rotation.z = -cycleRad.current / 2;
    if (exSprocketRef.current) exSprocketRef.current.rotation.z = -cycleRad.current / 2;
    beltTex.offset.x = -cycleRad.current * 0.5;

    for (let i = 0; i < lay.n; i++) {
      const localDeg = wrapCycle(masterDeg + CYCLE0 + lay.phases[i]);
      const cs = crankSlider(localDeg * DEG);
      const stroke = strokeAt(localDeg);

      const pg = pistonRefs.current[i];
      if (pg) pg.position.set(0, cs.pinY, lay.zOf[i]);
      const rg = rodRefs.current[i];
      if (rg) {
        rg.position.set(cs.pinX, cs.pinCrankY, lay.zOf[i]);
        rg.rotation.z = cs.rodAngle;
      }

      const inL = intakeLift(localDeg);
      const exL = exhaustLift(localDeg);
      const iv = inValveRefs.current[i];
      if (iv) iv.position.y = DECK_Y - inL * VALVE_MAX_LIFT;
      const ev = exValveRefs.current[i];
      if (ev) ev.position.y = DECK_Y - exL * VALVE_MAX_LIFT;

      const camA = (localDeg / 2) * DEG;
      const il = inLobeRefs.current[i];
      if (il) il.rotation.z = lobeAngle(camA, CAM_PHASE_INTAKE);
      const el = exLobeRefs.current[i];
      if (el) el.rotation.z = lobeAngle(camA, CAM_PHASE_EXHAUST);
      nextCam[i] = camStateOf(inL, exL);

      const flash = combustionFlash(localDeg);
      const fm = flashRefs.current[i];
      if (fm) {
        const vis = flash > 0.01 && xray;
        fm.visible = vis;
        if (vis) {
          fm.scale.setScalar(0.1 + flash * BORE_R * 0.9);
          (fm.material as THREE.MeshBasicMaterial).opacity = flash * 0.8;
        }
      }

      const partsOn = xray;

      const cRef = chargeRefs.current[i];
      const cp = cyls[i].charge;
      if (cRef) {
        cRef.visible = partsOn;
        if (partsOn) {
          const fill = chargeFill(localDeg);
          const active = Math.round(NC * fill);
          const chamberTop = DECK_Y - 0.07;
          const chamberBot = cs.crownY + 0.05;
          const band = Math.max(0.04, chamberTop - chamberBot);
          for (let k = 0; k < NC; k++) {
            const s = cp.seed[k];
            if (k < active) {
              const swirl = t * 0.7 + s.ang;
              const r = s.rad * BORE_R * 0.82;
              cp.pos[k * 3] = Math.cos(swirl) * r;
              cp.pos[k * 3 + 1] = chamberBot + s.u * band + Math.sin(t * 3 + s.jit) * 0.015;
              cp.pos[k * 3 + 2] = lay.zOf[i] + Math.sin(swirl) * r;
              if (stroke.id === 'admissao') tmp.copy(s.isFuel ? C_FUEL : C_AIR).lerp(C_MIX, smooth(stroke.phase) * 0.85);
              else if (stroke.id === 'compressao') tmp.copy(C_MIX);
              else if (stroke.id === 'combustao') tmp.copy(C_BURN).lerp(C_EXH, smooth(stroke.phase));
              else tmp.copy(C_EXH);
              cp.col![k * 3] = tmp.r;
              cp.col![k * 3 + 1] = tmp.g;
              cp.col![k * 3 + 2] = tmp.b;
            } else {
              cp.pos[k * 3] = (s.u - 0.5) * 0.4;
              cp.pos[k * 3 + 1] = cs.crownY - 0.28;
              cp.pos[k * 3 + 2] = lay.zOf[i] + (s.rad - 0.5) * 0.4;
            }
          }
          cp.geo.attributes.position.needsUpdate = true;
          cp.geo.attributes.color!.needsUpdate = true;
        }
      }

      const inRef = intakeRefs.current[i];
      const ip = cyls[i].intake;
      const inVis = inL > 0.05 && partsOn;
      if (inRef) {
        inRef.visible = inVis;
        if (inVis) {
          for (let k = 0; k < NS; k++) {
            const p = (ip.off[k] + t * 0.5) % 1;
            const q = polyAt(ip.path, p);
            ip.pos[k * 3] = q[0];
            ip.pos[k * 3 + 1] = q[1];
            ip.pos[k * 3 + 2] = q[2] + ip.zsp[k] * 0.5;
          }
          ip.geo.attributes.position.needsUpdate = true;
        }
      }

      const exRef = exhaustRefs.current[i];
      const ep = cyls[i].exhaust;
      const exVis = exL > 0.05 && partsOn;
      if (exRef) {
        exRef.visible = exVis;
        if (exVis) {
          for (let k = 0; k < NS; k++) {
            const p = (ep.off[k] + t * 0.55) % 1;
            const q = polyAt(ep.path, p);
            ep.pos[k * 3] = q[0];
            ep.pos[k * 3 + 1] = q[1];
            ep.pos[k * 3 + 2] = q[2] + ep.zsp[k] * 0.5;
          }
          ep.geo.attributes.position.needsUpdate = true;
        }
      }

      const spRef = sprayRefs.current[i];
      const sp = cyls[i].spray;
      const spVis = stroke.id === 'admissao' && stroke.phase > 0.05 && stroke.phase < 0.9 && partsOn;
      if (spRef) {
        spRef.visible = spVis;
        if (spVis) {
          for (let k = 0; k < NK; k++) {
            const p = (sp.off[k] + t * 0.9) % 1;
            sp.pos[k * 3] = INJECTOR_TIP[0] + (INTAKE_X - INJECTOR_TIP[0]) * p;
            sp.pos[k * 3 + 1] = INJECTOR_TIP[1] + (DECK_Y - 0.2 - INJECTOR_TIP[1]) * p;
            sp.pos[k * 3 + 2] = lay.zOf[i] + sp.sp[k] * p;
          }
          sp.geo.attributes.position.needsUpdate = true;
        }
      }
    }

    acc.current += dt;
    if (acc.current > 0.08) {
      acc.current = 0;
      onSample(masterDeg);
    }
    if (nextCam.some((k, i) => k !== camKeys.current[i])) {
      camKeys.current = nextCam;
      setCamStates(nextCam);
    }
  });

  return (
    <group rotation={[0, -Math.PI / 2, 0]} position={[0, 0.9, 0]}>
      <Crankcase xray={xray} lay={lay} />
      {lay.zOf.map((z, i) => (
        <group key={`bar${i}`} position={[0, 0, z]}>
          <CylinderBarrel xray={xray} />
        </group>
      ))}

      <group ref={crankRef} position={[0, CRANK_Y, 0]}>
        <CrankShaft lay={lay} />
      </group>

      {/* LADO A: correia dentada de sincronismo (virabrequim -> 2 comandos, 1:2) */}
      <mesh geometry={beltGeo} position={[0, 0, lay.zBelt]}>
        <meshStandardMaterial map={beltTex} color="#20242b" metalness={0.2} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <group ref={inSprocketRef} position={[INTAKE_X, CAM_CENTER_Y, lay.zBelt]}>
        <Sprocket r={R_CAM_SPKT} teeth={22} />
      </group>
      <group ref={exSprocketRef} position={[EXHAUST_X, CAM_CENTER_Y, lay.zBelt]}>
        <Sprocket r={R_CAM_SPKT} teeth={22} />
      </group>
      {/* tensionador da correia */}
      <mesh position={[EXHAUST_X - 0.16, 0.55, lay.zBelt]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.06, 18]} />
        <meshStandardMaterial {...DARK} />
      </mesh>

      {lay.zOf.map((_, i) => (
        <group key={`rod${i}`} ref={(g) => (rodRefs.current[i] = g)}>
          <ConnRod />
        </group>
      ))}
      {lay.zOf.map((_, i) => (
        <group key={`pis${i}`} ref={(g) => (pistonRefs.current[i] = g)}>
          <Piston />
        </group>
      ))}

      {lay.zOf.map((z, i) => (
        <group key={`head${i}`} position={[0, 0, z]}>
          <CylinderHead xray={xray} />
          <IntakeSystem xray={xray} />
          <ExhaustSystem xray={xray} />
          <Injector />
        </group>
      ))}

      <CamShaft
        x={INTAKE_X}
        geom={lobeGeo}
        lobeRefs={inLobeRefs}
        zOf={lay.zOf}
        len={lay.n * SPACING + 0.5}
        bearings={lay.zOf.map((z) => z + SPACING / 2)}
        tint="#2f6fd0"
      />
      <CamShaft
        x={EXHAUST_X}
        geom={lobeGeo}
        lobeRefs={exLobeRefs}
        zOf={lay.zOf}
        len={lay.n * SPACING + 0.5}
        bearings={lay.zOf.map((z) => z + SPACING / 2)}
        tint="#d2603a"
      />

      {lay.zOf.map((z, i) => (
        <CamStateBadge
          key={`badge${i}`}
          z={z}
          sub={i === 0 ? 'CILINDRO 1 · referencia (correia)' : `CILINDRO ${i + 1}`}
          state={camStates[i]}
        />
      ))}

      {lay.zOf.map((z, i) => (
        <group key={`iv${i}`} ref={(g) => (inValveRefs.current[i] = g)} position={[INTAKE_X, DECK_Y, z]}>
          <PoppetValve tint="#8fb7ff" />
        </group>
      ))}
      {lay.zOf.map((z, i) => (
        <group key={`ev${i}`} ref={(g) => (exValveRefs.current[i] = g)} position={[EXHAUST_X, DECK_Y, z]}>
          <PoppetValve tint="#e08a6a" />
        </group>
      ))}

      {lay.zOf.map((z, i) => (
        <mesh key={`fl${i}`} ref={(m) => (flashRefs.current[i] = m)} position={[0, DECK_Y - 0.02, z]} visible={false}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ff7a1a" transparent opacity={0.85} depthWrite={false} />
        </mesh>
      ))}

      {cyls.map((c, i) => (
        <group key={`pt${i}`}>
          <points ref={(p) => (chargeRefs.current[i] = p)} geometry={c.charge.geo} material={chargeMat} />
          <points ref={(p) => (intakeRefs.current[i] = p)} geometry={c.intake.geo} material={intakeMat} />
          <points ref={(p) => (exhaustRefs.current[i] = p)} geometry={c.exhaust.geo} material={exhaustMat} />
          <points ref={(p) => (sprayRefs.current[i] = p)} geometry={c.spray.geo} material={sprayMat} />
        </group>
      ))}
    </group>
  );
}

const TEMPOS = [
  { name: '1 Admissao', color: '#38bdf8' },
  { name: '2 Compressao', color: '#22c55e' },
  { name: '3 Combustao', color: '#f97316' },
  { name: '4 Escape', color: '#8b93a1' },
];
const LEGENDA = [
  { t: 'Ar', c: '#38bdf8' },
  { t: 'Combustivel', c: '#f5a623' },
  { t: 'Mistura', c: '#2ec16b' },
  { t: 'Queima', c: '#ff5722' },
  { t: 'Escape', c: '#8b93a1' },
];

const btn = (active: boolean): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: 8,
  border: `1px solid ${active ? '#3b82f6' : '#2a3346'}`,
  background: active ? 'rgba(59,130,246,0.25)' : 'rgba(20,26,38,0.9)',
  color: '#e6ecf6',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
});

function WinBtn({
  glyph,
  title,
  onClick,
  tone,
  dim,
}: {
  glyph: string;
  title: string;
  onClick: () => void;
  tone?: 'red';
  dim?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        width: 26,
        height: 22,
        borderRadius: 5,
        border: '1px solid #2a3346',
        background: tone === 'red' ? 'rgba(220,70,70,0.18)' : 'rgba(20,26,38,0.9)',
        color: dim ? '#566072' : tone === 'red' ? '#ff9a9a' : '#dfe6f2',
        fontSize: 13,
        lineHeight: 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {glyph}
    </button>
  );
}

/** Cena da Aula 3: motor em linha animado + painel de controle. */
function InlineEngineScene({ lay }: { lay: Layout }) {
  const [fs, setFs] = useState(false);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(0.5);
  const [xray, setXray] = useState(true);
  const [deg, setDeg] = useState(0);
  const [panelMin, setPanelMin] = useState(false);
  const stepRef = useRef<number | null>(null);
  const scrubRef = useRef<number | null>(null);

  const stroke = strokeAt(wrapCycle(deg + CYCLE0));
  const volta = deg < 360 ? '1a volta' : '2a volta';

  const nextStroke = () => {
    stepRef.current = (Math.floor(deg / 180) + 1) * 180;
    setRunning(false);
  };

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#b9c4d6' }}>
              {panelMin ? (
                <>
                  <b style={{ color: stroke.color }}>{stroke.namePt}</b>
                  <span style={{ color: '#7c8aa3', fontWeight: 500 }}>
                    {' '}· cil.1 · {Math.round(deg)}° · {speed.toFixed(1)}x
                  </span>
                </>
              ) : (
                lay.label
              )}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <WinBtn glyph="—" title="Minimizar" onClick={() => setPanelMin(true)} />
              <WinBtn glyph="□" title="Maximizar" onClick={() => setPanelMin(false)} dim={!panelMin} />
              <WinBtn glyph="✕" title="Fechar (minimiza)" tone="red" onClick={() => setPanelMin(true)} />
            </div>
          </div>

          {!panelMin && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" style={btn(running)} onClick={() => setRunning((v) => !v)}>
                  {running ? '⏸ Pausar' : '▶ Rodar'}
                </button>
                <button type="button" style={btn(false)} onClick={nextStroke}>
                  ⏭ Proximo tempo
                </button>
                <button type="button" style={btn(xray)} onClick={() => setXray((v) => !v)}>
                  {xray ? '🩻 Raio-X: ON' : '🩻 Raio-X: OFF'}
                </button>
              </div>

              <Slider
                label="Linha do tempo (0° = balanco cil.1)"
                value={deg}
                min={0}
                max={720}
                step={1}
                color="#c99bff"
                onChange={(v) => {
                  setRunning(false);
                  setDeg(v);
                  scrubRef.current = v;
                }}
                valueLabel={`${Math.round(deg)}° / 720°`}
              />

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#7c8aa3', minWidth: 78 }}>Velocidade:</span>
                {[0.1, 0.5, 1, 2].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSpeed(v)}
                    style={{ ...btn(Math.abs(speed - v) < 0.001), padding: '3px 12px', fontSize: 12 }}
                  >
                    {v}x
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {TEMPOS.map((tp, i) => {
                  const on = i === stroke.index;
                  return (
                    <div
                      key={tp.name}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '5px 4px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        color: on ? '#0b0e16' : '#9fb0c4',
                        background: on ? tp.color : 'rgba(20,26,38,0.7)',
                        border: `1px solid ${on ? tp.color : '#233049'}`,
                        transition: 'all 160ms',
                      }}
                    >
                      {tp.name}
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: 11, color: '#9fb0c4', lineHeight: 1.5 }}>
                Leitura do comando: <b style={{ color: '#16a34a' }}>2 cames para dentro = BALANCO</b> ·{' '}
                <b style={{ color: '#a78bfa' }}>2 para baixo = CRUZAMENTO</b> ·{' '}
                <b style={{ color: '#38bdf8' }}>so admissao = ADMISSAO</b> ·{' '}
                <b style={{ color: '#e08a6a' }}>so escape = ESCAPE</b>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {LEGENDA.map((l) => (
                    <span key={l.t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9fb0c4' }}>
                      <span style={{ width: 9, height: 9, borderRadius: 9, background: l.c }} />
                      {l.t}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11.5, color: '#7c8aa3', fontFamily: 'var(--font-mono)' }}>
                  {Math.round(deg)}° / 720° · {volta}
                </div>
              </div>
            </>
          )}
        </div>
      }
    >
      <Canvas
        key={fs ? 'fs' : 'win'}
        camera={{ position: fs ? lay.camFs : lay.cam, fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={[WHITE_BG]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 6]} intensity={1.05} />
        <directionalLight position={[-5, 3, -2]} intensity={0.4} />
        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[0, 4, 6]} scale={[12, 8, 1]} />
          <Lightformer intensity={1.1} position={[-6, 2, 4]} scale={[5, 10, 1]} color="#dbe6ff" />
          <Lightformer intensity={0.9} position={[6, -1, 4]} scale={[6, 8, 1]} color="#fff0d6" />
        </Environment>
        <Suspense fallback={null}>
          <EngineRig
            lay={lay}
            running={running}
            speed={speed}
            xray={xray}
            stepRef={stepRef}
            scrubRef={scrubRef}
            onSample={setDeg}
          />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom minDistance={5} maxDistance={38} target={[0, -1.15, 0]} />
      </Canvas>
    </SceneShell>
  );
}

/** Aula 3 / pagina 2: 2 cilindros, 4 valvulas. */
export function EngineScene2() {
  return <InlineEngineScene lay={LAYOUT_2} />;
}

/** Aula 3 / pagina 3: 4 cilindros, 8 valvulas, ordem de ignicao 1-3-4-2. */
export function EngineScene4() {
  return <InlineEngineScene lay={LAYOUT_4} />;
}
