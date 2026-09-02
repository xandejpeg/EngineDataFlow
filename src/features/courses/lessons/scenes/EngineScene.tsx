/* eslint-disable react-refresh/only-export-components */
/**
 * Aula 3 — Motor monocilindrico de 4 tempos (ciclo Otto).
 * Virabrequim -> biela -> pistao dentro da camisa; cabecote com 2 valvulas
 * comandadas por um comando que gira na metade da rotacao; bico injetor e
 * particulas de ar (azul), combustivel (amarelo), mistura (verde), queima
 * (laranja) e escape (cinza). Duas voltas (720°) = os 4 tempos.
 */
import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SceneShell, Slider } from './sceneUi';
import {
  CamShaft,
  CamStateBadge,
  CYCLE0,
  camStateOf,
  lobeAngle,
  lobeGeometry,
  type CamStateKey,
} from './inlineEngine';
import {
  ConnRod,
  Crankcase,
  Crankshaft,
  CylinderBarrel,
  CylinderHead,
  Injector,
  INJECTOR_TIP,
  Piston,
  PoppetValve,
  IntakeSystem,
  ExhaustSystem,
  INTAKE_PIPE,
  EXHAUST_PIPE,
  VALVE_MAX_LIFT,
  INTAKE_X,
  EXHAUST_X,
} from './engineParts';
import {
  BORE_R,
  CAM_PHASE_EXHAUST,
  CAM_PHASE_INTAKE,
  CRANK_Y,
  DECK_Y,
  chargeFill,
  combustionFlash,
  crankSlider,
  exhaustLift,
  intakeLift,
  strokeAt,
  wrapCycle,
} from './enginePhysics';

const WHITE_BG = '#ffffff';
const BASE_OMEGA = Math.PI; // rad/s do virabrequim em 1.0x (~0,5 volta/s)
const STEP_OMEGA = Math.PI * 0.8; // velocidade no modo passo a passo
const TWO_CYCLE = Math.PI * 4; // 720° em radianos = 1 ciclo completo
const DEG = Math.PI / 180;

const C_AIR = new THREE.Color('#38bdf8');
const C_FUEL = new THREE.Color('#f5a623');
const C_MIX = new THREE.Color('#2ec16b');
const C_BURN = new THREE.Color('#ff5722');
const C_EXH = new THREE.Color('#8b93a1');

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Posicao ao longo de uma poli-linha (waypoints) na fracao p (0..1). */
function polyAt(pts: number[][], p: number): [number, number, number] {
  const n = pts.length - 1;
  const f = Math.min(0.99999, Math.max(0, p)) * n;
  const i = Math.floor(f);
  const t = f - i;
  const a = pts[i];
  const b = pts[i + 1];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Caminho do AR na admissao: filtro -> borboleta -> cano -> valvula -> cilindro. */
const INTAKE_PATH: number[][] = [
  [1.74, DECK_Y + 1.44, 0],
  [1.56, DECK_Y + 1.16, 0],
  ...[...INTAKE_PIPE].reverse(),
  [INTAKE_X, DECK_Y - 0.05, 0],
  [INTAKE_X * 0.5, DECK_Y - 0.42, 0],
];
/** Caminho dos GASES no escape: cilindro -> valvula -> header -> silencioso -> ponteira. */
const EXHAUST_PATH: number[][] = [
  [EXHAUST_X * 0.5, DECK_Y - 0.4, 0],
  [EXHAUST_X, DECK_Y - 0.05, 0],
  ...EXHAUST_PIPE,
  [-2.5, DECK_Y - 0.72, 0],
];

function makeStreamMat(hex: string, map: THREE.Texture) {
  return new THREE.PointsMaterial({
    size: 0.13,
    map,
    color: new THREE.Color(hex),
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });
}

function buildPoints(count: number, withColor: boolean) {
  const pos = new Float32Array(count * 3);
  const col = withColor ? new Float32Array(count * 3) : null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (col) geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return { pos, col, geo };
}

/** Textura redonda (gradiente radial) para as particulas parecerem moleculas. */
function useDotTexture() {
  return useMemo(() => {
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
  }, []);
}

interface RigProps {
  running: boolean;
  speed: number;
  xray: boolean;
  stepRef: React.MutableRefObject<number | null>;
  scrubRef: React.MutableRefObject<number | null>;
  onSample: (deg: number) => void;
}

/** Todo o motor 3D + a animacao (um unico useFrame governa tudo). */
function EngineRig({ running, speed, xray, stepRef, scrubRef, onSample }: RigProps) {
  const dot = useDotTexture();
  const lobeGeo = useMemo(() => lobeGeometry(), []);

  const crankRef = useRef<THREE.Group>(null);
  const rodRef = useRef<THREE.Group>(null);
  const pistonRef = useRef<THREE.Group>(null);
  const inValveRef = useRef<THREE.Group>(null);
  const exValveRef = useRef<THREE.Group>(null);
  const inLobeRefs = useRef<(THREE.Group | null)[]>([]);
  const exLobeRefs = useRef<(THREE.Group | null)[]>([]);
  const flashRef = useRef<THREE.Mesh>(null);

  const [camState, setCamState] = useState<CamStateKey>(() =>
    camStateOf(intakeLift(CYCLE0), exhaustLift(CYCLE0)),
  );
  const camKey = useRef(camState);

  const cycleRad = useRef(0);
  const simTime = useRef(0);
  const acc = useRef(0);

  const N = 46;
  const M = 22;
  const K = 12;

  const charge = useMemo(() => {
    const b = buildPoints(N, true);
    const seed = Array.from({ length: N }, () => ({
      ang: Math.random() * Math.PI * 2,
      rad: 0.25 + Math.random() * 0.7,
      u: Math.random(),
      jit: Math.random() * Math.PI * 2,
      isFuel: Math.random() < 0.32,
    }));
    return { ...b, seed };
  }, []);
  const intake = useMemo(() => {
    const b = buildPoints(M, false);
    const off = Array.from({ length: M }, () => Math.random());
    const zsp = Array.from({ length: M }, () => (Math.random() - 0.5) * 0.4);
    return { ...b, off, zsp };
  }, []);
  const exhaust = useMemo(() => {
    const b = buildPoints(M, false);
    const off = Array.from({ length: M }, () => Math.random());
    const zsp = Array.from({ length: M }, () => (Math.random() - 0.5) * 0.4);
    return { ...b, off, zsp };
  }, []);
  const spray = useMemo(() => {
    const b = buildPoints(K, false);
    const off = Array.from({ length: K }, () => Math.random());
    const sp = Array.from({ length: K }, () => (Math.random() - 0.5) * 0.28);
    return { ...b, off, sp };
  }, []);

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
  const intakeMat = useMemo(() => makeStreamMat('#38bdf8', dot), [dot]);
  const exhaustMat = useMemo(() => makeStreamMat('#8b93a1', dot), [dot]);
  const sprayMat = useMemo(() => makeStreamMat('#f5a623', dot), [dot]);

  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    // simTime acumula so o quanto o motor girou -> gases e pecas param juntos e
    // escalam com a velocidade (0.1x/0.5x deixam TUDO em camera lenta).
    const before = cycleRad.current;
    let advanced = 0;
    if (scrubRef.current != null) {
      // arrastar a linha do tempo: vai direto pro angulo escolhido (sem avancar)
      const c = ((scrubRef.current % 720) + 720) % 720;
      cycleRad.current = (c * Math.PI) / 180;
      scrubRef.current = null;
    } else if (stepRef.current != null) {
      const target = (stepRef.current * Math.PI) / 180;
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

    const cr = cycleRad.current;
    const cycleDeg = wrapCycle((cr * 180) / Math.PI + CYCLE0);
    const t = simTime.current * 0.35;
    const cs = crankSlider(cycleDeg * DEG);
    const stroke = strokeAt(cycleDeg);

    // mecanismo
    if (crankRef.current) crankRef.current.rotation.z = -cr;
    if (pistonRef.current) pistonRef.current.position.y = cs.pinY;
    if (rodRef.current) {
      rodRef.current.position.set(cs.pinX, cs.pinCrankY, 0);
      rodRef.current.rotation.z = cs.rodAngle;
    }
    const inL = intakeLift(cycleDeg);
    const exL = exhaustLift(cycleDeg);
    if (inValveRef.current) inValveRef.current.position.y = DECK_Y - inL * VALVE_MAX_LIFT;
    if (exValveRef.current) exValveRef.current.position.y = DECK_Y - exL * VALVE_MAX_LIFT;
    const camA = (cycleDeg / 2) * DEG;
    const il = inLobeRefs.current[0];
    const el = exLobeRefs.current[0];
    if (il) il.rotation.z = lobeAngle(camA, CAM_PHASE_INTAKE);
    if (el) el.rotation.z = lobeAngle(camA, CAM_PHASE_EXHAUST);
    const nextCam = camStateOf(inL, exL);
    if (nextCam !== camKey.current) {
      camKey.current = nextCam;
      setCamState(nextCam);
    }

    // combustao
    const flash = combustionFlash(cycleDeg);
    if (flashRef.current) {
      const vis = flash > 0.01 && xray;
      flashRef.current.visible = vis;
      if (vis) {
        const s = 0.14 + flash * BORE_R * 1.5;
        flashRef.current.scale.setScalar(s);
        (flashRef.current.material as THREE.MeshBasicMaterial).opacity = flash * 0.85;
      }
    }

    // ---- carga dentro do cilindro (enche/comprime/queima/esvazia) ----
    chargeMat.visible = xray;
    const fill = chargeFill(cycleDeg);
    const active = Math.round(N * fill);
    const chamberTop = DECK_Y - 0.07;
    const chamberBot = cs.crownY + 0.05;
    const band = Math.max(0.04, chamberTop - chamberBot);
    const cpos = charge.pos;
    const ccol = charge.col!;
    for (let i = 0; i < N; i++) {
      const s = charge.seed[i];
      if (i < active) {
        const swirl = t * 0.7 + s.ang;
        const r = s.rad * BORE_R * 0.82;
        const x = Math.cos(swirl) * r;
        const z = Math.sin(swirl) * r;
        const y = chamberBot + s.u * band + Math.sin(t * 3 + s.jit) * 0.015;
        cpos[i * 3] = x;
        cpos[i * 3 + 1] = y;
        cpos[i * 3 + 2] = z;
        if (stroke.id === 'admissao') {
          tmp.copy(s.isFuel ? C_FUEL : C_AIR).lerp(C_MIX, smooth(stroke.phase) * 0.85);
        } else if (stroke.id === 'compressao') {
          tmp.copy(C_MIX);
        } else if (stroke.id === 'combustao') {
          tmp.copy(C_BURN).lerp(C_EXH, smooth(stroke.phase));
        } else {
          tmp.copy(C_EXH);
        }
        ccol[i * 3] = tmp.r;
        ccol[i * 3 + 1] = tmp.g;
        ccol[i * 3 + 2] = tmp.b;
      } else {
        // estacionada dentro do pistao (opaco): fica escondida
        cpos[i * 3] = (s.u - 0.5) * 0.4;
        cpos[i * 3 + 1] = cs.crownY - 0.28;
        cpos[i * 3 + 2] = (s.rad - 0.5) * 0.4;
      }
    }
    charge.geo.attributes.position.needsUpdate = true;
    charge.geo.attributes.color!.needsUpdate = true;

    // ---- fluxo de admissao: ar entrando pelo filtro ate o cilindro ----
    const inVis = inL > 0.05;
    intakeMat.visible = inVis && xray;
    if (inVis) {
      const ipos = intake.pos;
      for (let i = 0; i < M; i++) {
        const p = (intake.off[i] + t * 0.5) % 1;
        const q = polyAt(INTAKE_PATH, p);
        ipos[i * 3] = q[0];
        ipos[i * 3 + 1] = q[1];
        ipos[i * 3 + 2] = q[2] + intake.zsp[i] * 0.5;
      }
      intake.geo.attributes.position.needsUpdate = true;
    }

    // ---- fluxo de escape: gases saindo do cilindro ate a ponteira ----
    const exVis = exL > 0.05;
    exhaustMat.visible = exVis && xray;
    if (exVis) {
      const epos = exhaust.pos;
      for (let i = 0; i < M; i++) {
        const p = (exhaust.off[i] + t * 0.55) % 1;
        const q = polyAt(EXHAUST_PATH, p);
        epos[i * 3] = q[0];
        epos[i * 3 + 1] = q[1];
        epos[i * 3 + 2] = q[2] + exhaust.zsp[i] * 0.5;
      }
      exhaust.geo.attributes.position.needsUpdate = true;
    }

    // ---- jato do bico injetor (na admissao) ----
    const sprayVis = stroke.id === 'admissao' && stroke.phase > 0.05 && stroke.phase < 0.9;
    sprayMat.visible = sprayVis && xray;
    if (sprayVis) {
      const spos = spray.pos;
      for (let i = 0; i < K; i++) {
        const p = (spray.off[i] + t * 0.9) % 1;
        spos[i * 3] = INJECTOR_TIP[0] + (INTAKE_X - INJECTOR_TIP[0]) * p;
        spos[i * 3 + 1] = INJECTOR_TIP[1] + (DECK_Y - 0.2 - INJECTOR_TIP[1]) * p;
        spos[i * 3 + 2] = spray.sp[i] * p;
      }
      spray.geo.attributes.position.needsUpdate = true;
    }

    // amostra p/ a interface (throttle ~12 Hz)
    acc.current += dt;
    if (acc.current > 0.08) {
      acc.current = 0;
      onSample(cycleDeg);
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* casca do motor: SEMPRE visivel; o raio-X so a deixa transparente */}
      <Crankcase y={CRANK_Y} xray={xray} />
      <CylinderBarrel xray={xray} />
      <CylinderHead xray={xray} />
      <IntakeSystem xray={xray} />
      <ExhaustSystem xray={xray} />
      <Injector />

      {/* pecas internas: sempre desenhadas (motor cheio); no solido a casca
          opaca esconde a maior parte, no raio-X a casca fica transparente */}
      <group>
        <group ref={crankRef} position={[0, CRANK_Y, 0]}>
          <Crankshaft />
        </group>
        <group ref={rodRef}>
          <ConnRod />
        </group>
        <group ref={pistonRef}>
          <Piston />
        </group>
        <group ref={inValveRef} position={[INTAKE_X, DECK_Y, 0]}>
          <PoppetValve tint="#8fb7ff" />
        </group>
        <group ref={exValveRef} position={[EXHAUST_X, DECK_Y, 0]}>
          <PoppetValve tint="#e08a6a" />
        </group>
        <CamShaft
          x={INTAKE_X}
          geom={lobeGeo}
          lobeRefs={inLobeRefs}
          zOf={[0]}
          len={1.0}
          bearings={[-0.42, 0.42]}
          tint="#2f6fd0"
        />
        <CamShaft
          x={EXHAUST_X}
          geom={lobeGeo}
          lobeRefs={exLobeRefs}
          zOf={[0]}
          len={1.0}
          bearings={[-0.42, 0.42]}
          tint="#d2603a"
        />
        <CamStateBadge z={0} sub="CILINDRO UNICO · sem ordem de ignicao" state={camState} />

        {/* particulas (gases) */}
        <points geometry={charge.geo} material={chargeMat} />
        <points geometry={intake.geo} material={intakeMat} />
        <points geometry={exhaust.geo} material={exhaustMat} />
        <points geometry={spray.geo} material={sprayMat} />

        {/* clarao da combustao */}
        <mesh ref={flashRef} position={[0, DECK_Y - 0.02, 0]} visible={false}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshBasicMaterial color="#ff7a1a" transparent opacity={0.85} depthWrite={false} />
        </mesh>
      </group>
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

/** Botao estilo janela (minimizar / maximizar / fechar) no cabecalho do painel. */
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

/** Cena da Aula 3: o motor monocilindrico animado + painel de controle. */
export function EngineScene() {
  const [fs, setFs] = useState(false);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [xray, setXray] = useState(true);
  const [deg, setDeg] = useState(0);
  const [panelMin, setPanelMin] = useState(false);
  const stepRef = useRef<number | null>(null);
  const scrubRef = useRef<number | null>(null);

  const stroke = strokeAt(wrapCycle(deg + CYCLE0));
  const volta = deg < 360 ? '1a volta' : '2a volta';

  const nextStroke = () => {
    const cur = deg;
    stepRef.current = (Math.floor(cur / 180) + 1) * 180;
    setRunning(false);
  };

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* cabecalho estilo janela: — e ✕ minimizam; □ restaura (so quando minimizado) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#b9c4d6' }}>
              {panelMin ? (
                <>
                  <b style={{ color: stroke.color }}>{stroke.namePt}</b>
                  <span style={{ color: '#7c8aa3', fontWeight: 500 }}>
                    {' '}· {Math.round(deg)}° · {speed.toFixed(1)}x
                  </span>
                </>
              ) : (
                'Painel de controle'
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

          {/* linha do tempo: arraste p/ passar o motor por todos os angulos (0-720) */}
          <Slider
            label="Linha do tempo (0° = balanco)"
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

          <div style={{ fontSize: 12.5, color: '#cdd8ea', lineHeight: 1.4 }}>
            <b style={{ color: stroke.color }}>{stroke.namePt}</b> — {stroke.descPt}
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
        camera={{ position: fs ? [3.8, 1.3, 7.4] : [4.5, 1.6, 9.1], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={[WHITE_BG]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 6]} intensity={1.05} />
        <directionalLight position={[-5, 3, -2]} intensity={0.4} />
        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[0, 4, 6]} scale={[10, 8, 1]} />
          <Lightformer intensity={1.1} position={[-6, 2, 4]} scale={[5, 10, 1]} color="#dbe6ff" />
          <Lightformer intensity={0.9} position={[6, -1, 4]} scale={[6, 8, 1]} color="#fff0d6" />
        </Environment>
        <Suspense fallback={null}>
          <EngineRig running={running} speed={speed} xray={xray} stepRef={stepRef} scrubRef={scrubRef} onSample={setDeg} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom minDistance={4.5} maxDistance={16} target={[0, 0.4, 0]} />
      </Canvas>
    </SceneShell>
  );
}
