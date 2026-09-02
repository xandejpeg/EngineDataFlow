/**
 * Motor 4 cilindros / 8 valvulas (inline-4, ciclo Otto) para o laboratorio.
 *
 * Reaproveita 100% da "Aula 3" (motor monocilindrico): a mesma cinematica
 * (biela-manivela, perfil do came, elevacao das valvulas, tempos) e as mesmas
 * pecas 3D procedurais — agora replicadas em 4 cilindros com a ordem de
 * ignicao real 1-3-4-2. Um unico virabrequim (4 moentes: 1&4 juntos, 2&3
 * opostos) e dois comandos (admissao/escape) girando na metade da rotacao
 * abrem cada valvula no seu tempo. Cada cilindro tem bico injetor, fluxo de
 * ar/combustivel, mistura, queima e escape proprios.
 *
 * A animacao le o angulo do virabrequim (0..720) da telemetria compartilhada
 * (frameBus), entao os paineis, a linha do tempo e o botao Ligar continuam
 * governando o motor.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getLatestFrame } from '@/state/frameBus';
import { useUiStore } from '@/state/uiStore';
import { degToRad } from '@/simulation/units';
import { localCycleAngleDeg } from '@/simulation/phasing';
import {
  ConnRod,
  CylinderBarrel,
  CylinderHead,
  Injector,
  INJECTOR_TIP,
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
} from '@/features/courses/lessons/scenes/engineParts';
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
} from '@/features/courses/lessons/scenes/enginePhysics';

/* ------------------------------------------------------------------ setup */
const N = 4; // cilindros
const SPACING = 1.72; // distancia entre cilindros (eixo do bloco = Z local)
/** Z local de cada cilindro (fisicos 1..4, da frente para tras). */
const Z_OF = Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * SPACING);
/** Numero fisico do cilindro na posicao i (1,2,3,4 em linha). */
const CYL_NUMBER = [1, 2, 3, 4];

const C_AIR = new THREE.Color('#38bdf8');
const C_FUEL = new THREE.Color('#f5a623');
const C_MIX = new THREE.Color('#2ec16b');
const C_BURN = new THREE.Color('#ff5722');
const C_EXH = new THREE.Color('#8b93a1');

const CRANK_MAT = { color: '#8f97a2', metalness: 0.85, roughness: 0.3 } as const;
const STEEL = { color: '#c4ccd6', metalness: 0.9, roughness: 0.3 } as const;
const DARK = { color: '#5c636e', metalness: 0.8, roughness: 0.4 } as const;

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

/** Caminho do AR na admissao (cilindro em z=0); deslocado por cilindro. */
const INTAKE_PATH: number[][] = [
  [1.74, DECK_Y + 1.44, 0],
  [1.56, DECK_Y + 1.16, 0],
  ...[...INTAKE_PIPE].reverse(),
  [INTAKE_X, DECK_Y - 0.05, 0],
  [INTAKE_X * 0.5, DECK_Y - 0.42, 0],
];
/** Caminho dos GASES no escape (cilindro em z=0); deslocado por cilindro. */
const EXHAUST_PATH: number[][] = [
  [EXHAUST_X * 0.5, DECK_Y - 0.4, 0],
  [EXHAUST_X, DECK_Y - 0.05, 0],
  ...EXHAUST_PIPE,
  [-2.5, DECK_Y - 0.72, 0],
];

function shiftZ(path: number[][], dz: number): number[][] {
  return path.map((p) => [p[0], p[1], p[2] + dz]);
}

/** Textura redonda (gradiente radial) para as particulas parecerem moleculas. */
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

/** Perfil polar real do ressalto, com a PONTA para cima (+Y) em repouso. */
function lobeGeometry(): THREE.BufferGeometry {
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
 * Giro do ressalto: o comando acompanha o virabrequim (horario, dai o sinal
 * negativo) e o `-lobePhase` faz a ponta cair sobre o tucho exatamente quando
 * `camLift` chega ao maximo. Ponta para baixo = valvula aberta.
 */
const lobeAngle = (camRad: number, lobePhase: number) => -camRad - lobePhase;

interface CylParts {
  charge: ReturnType<typeof buildPoints> & {
    seed: { ang: number; rad: number; u: number; jit: number; isFuel: boolean }[];
  };
  intake: ReturnType<typeof buildPoints> & { off: number[]; zsp: number[]; path: number[][] };
  exhaust: ReturnType<typeof buildPoints> & { off: number[]; zsp: number[]; path: number[][] };
  spray: ReturnType<typeof buildPoints> & { off: number[]; sp: number[] };
}

const NC = 22; // particulas de carga por cilindro
const NS = 12; // particulas de fluxo (admissao/escape) por cilindro
const NK = 8; // particulas do jato do bico por cilindro

/** Virabrequim unico com 4 moentes (1&4 juntos, 2&3 opostos) + volante. */
function CrankShaft4() {
  const cheekR = 0.6;
  return (
    <group>
      {/* munhoes de apoio entre e nas pontas dos cilindros */}
      {[Z_OF[0] - SPACING / 2, ...Z_OF.map((z) => z + SPACING / 2)].map((z, k) => (
        <mesh key={`j${k}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.34, 22]} />
          <meshStandardMaterial {...CRANK_MAT} />
        </mesh>
      ))}
      {/* 4 manivelas */}
      {Z_OF.map((z, i) => (
        <group key={i} position={[0, 0, z]} rotation={[0, 0, -degToRad([0, 180, 540, 360][i])]}>
          {/* 2 discos (cheeks) que abraçam a biela */}
          {[0.34, -0.34].map((cz) => (
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
          {/* moente (crankpin) deslocado +CRANK_R */}
          <mesh position={[0, CRANK_R, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.82, 20]} />
            <meshStandardMaterial {...STEEL} />
          </mesh>
        </group>
      ))}
      {/* volante de inercia numa ponta */}
      <mesh position={[0, 0, Z_OF[N - 1] + SPACING / 2 + 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.16, 44]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* polia / ponta de acionamento na outra ponta */}
      <mesh position={[0, 0, Z_OF[0] - SPACING / 2 - 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.2, 28]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
    </group>
  );
}

/** Carter unico que abraca os 4 cilindros (topo aberto para as bielas). */
function Crankcase4({ xray }: { xray: boolean }) {
  const W = 2.0;
  const D = N * SPACING + 0.5;
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
      {/* carter de oleo (sump) */}
      <mesh position={[0, -H / 2 - 0.16, 0]}>
        <boxGeometry args={[1.5, 0.42, D * 0.82]} />
        <meshStandardMaterial color="#3b414b" metalness={0.5} roughness={0.55} />
      </mesh>
    </group>
  );
}

/** Um comando (admissao ou escape): eixo ao longo de Z + 4 ressaltos. */
function CamShaft({
  x,
  geom,
  lobeRefs,
}: {
  x: number;
  geom: THREE.BufferGeometry;
  lobeRefs: React.MutableRefObject<(THREE.Group | null)[]>;
}) {
  const len = N * SPACING + 0.3;
  return (
    <group position={[x, CAM_CENTER_Y, 0]}>
      {/* eixo do comando (ao longo de Z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, len, 20]} />
        <meshStandardMaterial {...CRANK_MAT} />
      </mesh>
      {/* mancais entre cilindros */}
      {Z_OF.map((z) => (
        <mesh key={z} position={[0, 0, z + SPACING / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 18]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
      ))}
      {/* ressaltos: 1 por cilindro, fase propria (giram no useFrame) */}
      {Z_OF.map((z, i) => (
        <group key={i} ref={(g) => (lobeRefs.current[i] = g)} position={[0, 0, z]}>
          <mesh geometry={geom}>
            <meshStandardMaterial {...CRANK_MAT} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function FourCylinderEngine() {
  const xrayAmount = useUiStore((s) => s.xrayAmount);
  const explode = useUiStore((s) => s.explodeAmount);
  const showParticles = useUiStore((s) => s.showParticles);
  const hidden = useUiStore((s) => s.hiddenSystems);
  const xray = xrayAmount > 0.12;
  const showBlock = !hidden.includes('shortBlock');
  const showHead = !hidden.includes('cylinderHead');

  const dot = useMemo(makeDot, []);
  const lobeGeo = useMemo(() => lobeGeometry(), []);

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
  const mkMat = (hex: string) =>
    new THREE.PointsMaterial({
      size: 0.13,
      map: dot,
      color: new THREE.Color(hex),
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    });
  const intakeMat = useMemo(() => mkMat('#38bdf8'), [dot]); // eslint-disable-line react-hooks/exhaustive-deps
  const exhaustMat = useMemo(() => mkMat('#8b93a1'), [dot]); // eslint-disable-line react-hooks/exhaustive-deps
  const sprayMat = useMemo(() => mkMat('#f5a623'), [dot]); // eslint-disable-line react-hooks/exhaustive-deps

  // particulas por cilindro
  const cyls = useMemo<CylParts[]>(() => {
    return Z_OF.map((zc) => {
      const charge = {
        ...buildPoints(NC, true),
        seed: Array.from({ length: NC }, () => ({
          ang: Math.random() * Math.PI * 2,
          rad: 0.25 + Math.random() * 0.7,
          u: Math.random(),
          jit: Math.random() * Math.PI * 2,
          isFuel: Math.random() < 0.32,
        })),
      };
      const intake = {
        ...buildPoints(NS, false),
        off: Array.from({ length: NS }, () => Math.random()),
        zsp: Array.from({ length: NS }, () => (Math.random() - 0.5) * 0.4),
        path: shiftZ(INTAKE_PATH, zc),
      };
      const exhaust = {
        ...buildPoints(NS, false),
        off: Array.from({ length: NS }, () => Math.random()),
        zsp: Array.from({ length: NS }, () => (Math.random() - 0.5) * 0.4),
        path: shiftZ(EXHAUST_PATH, zc),
      };
      const spray = {
        ...buildPoints(NK, false),
        off: Array.from({ length: NK }, () => Math.random()),
        sp: Array.from({ length: NK }, () => (Math.random() - 0.5) * 0.28),
      };
      return { charge, intake, exhaust, spray };
    });
  }, []);

  // refs
  const crankRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const pistonRefs = useRef<(THREE.Group | null)[]>([]);
  const rodRefs = useRef<(THREE.Group | null)[]>([]);
  const inValveRefs = useRef<(THREE.Group | null)[]>([]);
  const exValveRefs = useRef<(THREE.Group | null)[]>([]);
  const inLobeRefs = useRef<(THREE.Group | null)[]>([]);
  const exLobeRefs = useRef<(THREE.Group | null)[]>([]);
  const flashRefs = useRef<(THREE.Mesh | null)[]>([]);
  const chargeRefs = useRef<(THREE.Points | null)[]>([]);
  const intakeRefs = useRef<(THREE.Points | null)[]>([]);
  const exhaustRefs = useRef<(THREE.Points | null)[]>([]);
  const sprayRefs = useRef<(THREE.Points | null)[]>([]);

  const simTime = useRef(0);
  const lastMaster = useRef(0);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const frame = getLatestFrame();
    const masterDeg = frame ? frame.clock.crankAngleDeg : 0;
    const masterRad = degToRad(masterDeg);

    // tempo de simulacao acumula so o quanto o motor girou (gases seguem a rotacao)
    let d = masterDeg - lastMaster.current;
    if (d < -360) d += 720; // wrap 720->0
    if (d < 0) d = 0;
    lastMaster.current = masterDeg;
    simTime.current += d;
    const t = (simTime.current / 180) * 0.6; // ritmo das particulas

    if (crankRef.current) crankRef.current.rotation.z = -masterRad;
    if (headRef.current) headRef.current.position.y = explode * 2.6;

    const partsOn = showParticles && xray;

    for (let i = 0; i < N; i++) {
      const localDeg = localCycleAngleDeg(masterDeg, CYL_NUMBER[i]);
      const cs = crankSlider(degToRad(localDeg));
      const stroke = strokeAt(localDeg);

      const pg = pistonRefs.current[i];
      if (pg) pg.position.set(0, cs.pinY, Z_OF[i]);
      const rg = rodRefs.current[i];
      if (rg) {
        rg.position.set(cs.pinX, cs.pinCrankY, Z_OF[i]);
        rg.rotation.z = cs.rodAngle;
      }

      const inL = intakeLift(localDeg);
      const exL = exhaustLift(localDeg);
      const iv = inValveRefs.current[i];
      if (iv) iv.position.y = DECK_Y - inL * VALVE_MAX_LIFT;
      const ev = exValveRefs.current[i];
      if (ev) ev.position.y = DECK_Y - exL * VALVE_MAX_LIFT;

      // ressaltos do comando (giram na metade da rotacao, fase por cilindro)
      const camA = degToRad(localDeg / 2);
      const il = inLobeRefs.current[i];
      if (il) il.rotation.z = lobeAngle(camA, CAM_PHASE_INTAKE);
      const el = exLobeRefs.current[i];
      if (el) el.rotation.z = lobeAngle(camA, CAM_PHASE_EXHAUST);

      // clarao da combustao
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

      // ---- carga dentro do cilindro (enche/comprime/queima/esvazia) ----
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
              cp.pos[k * 3 + 2] = Z_OF[i] + Math.sin(swirl) * r;
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
              cp.pos[k * 3 + 2] = Z_OF[i] + (s.rad - 0.5) * 0.4;
            }
          }
          cp.geo.attributes.position.needsUpdate = true;
          cp.geo.attributes.color!.needsUpdate = true;
        }
      }

      // ---- fluxo de admissao ----
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

      // ---- fluxo de escape ----
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

      // ---- jato do bico injetor (na admissao) ----
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
            sp.pos[k * 3 + 2] = Z_OF[i] + sp.sp[k] * p;
          }
          sp.geo.attributes.position.needsUpdate = true;
        }
      }
    }
  });

  return (
    <group rotation={[0, -Math.PI / 2, 0]} position={[0, 3.15, 0]}>
      {/* bloco curto: carter + camisas (casca sempre desenhada; raio-X = transparente) */}
      {showBlock && <Crankcase4 xray={xray} />}
      {showBlock &&
        Z_OF.map((z, i) => (
          <group key={i} position={[0, 0, z]}>
            <CylinderBarrel xray={xray} />
          </group>
        ))}

      {/* pecas moveis internas */}
      <group ref={crankRef} position={[0, CRANK_Y, 0]}>
        <CrankShaft4 />
      </group>
      {Z_OF.map((_, i) => (
        <group key={`rod${i}`} ref={(g) => (rodRefs.current[i] = g)}>
          <ConnRod />
        </group>
      ))}
      {Z_OF.map((_, i) => (
        <group key={`pis${i}`} ref={(g) => (pistonRefs.current[i] = g)}>
          <Piston />
        </group>
      ))}

      {/* cabecote + comandos + valvulas + admissao/escape/injecao (sobem no explode) */}
      <group ref={headRef}>
        {showHead &&
          Z_OF.map((z, i) => (
            <group key={`head${i}`} position={[0, 0, z]}>
              <CylinderHead xray={xray} />
              <IntakeSystem xray={xray} />
              <ExhaustSystem xray={xray} />
              <Injector />
            </group>
          ))}

        {showHead && (
          <>
            <CamShaft x={INTAKE_X} geom={lobeGeo} lobeRefs={inLobeRefs} />
            <CamShaft x={EXHAUST_X} geom={lobeGeo} lobeRefs={exLobeRefs} />
          </>
        )}

        {Z_OF.map((z, i) => (
          <group key={`iv${i}`} ref={(g) => (inValveRefs.current[i] = g)} position={[INTAKE_X, DECK_Y, z]}>
            <PoppetValve tint="#8fb7ff" />
          </group>
        ))}
        {Z_OF.map((z, i) => (
          <group key={`ev${i}`} ref={(g) => (exValveRefs.current[i] = g)} position={[EXHAUST_X, DECK_Y, z]}>
            <PoppetValve tint="#e08a6a" />
          </group>
        ))}
      </group>

      {/* clarao da combustao por cilindro */}
      {Z_OF.map((z, i) => (
        <mesh
          key={`fl${i}`}
          ref={(m) => (flashRefs.current[i] = m)}
          position={[0, DECK_Y - 0.02, z]}
          visible={false}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ff7a1a" transparent opacity={0.85} depthWrite={false} />
        </mesh>
      ))}

      {/* particulas por cilindro */}
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
