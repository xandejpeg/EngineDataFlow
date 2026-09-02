/* eslint-disable react-refresh/only-export-components */
/**
 * Pecas 3D procedurais do motor monocilindrico da Aula 3.
 * Cada peca e um componente "burro" (so geometria/material). As pecas que se
 * movem (pistao, biela, virabrequim, valvulas, comando) sao posicionadas pela
 * cena atraves de refs no grupo pai — aqui elas ficam na posicao de referencia.
 */
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  BORE_R,
  CAM_PHASE_EXHAUST,
  CAM_PHASE_INTAKE,
  CRANK_R,
  DECK_Y,
  PISTON_HALF,
  PISTON_R,
  ROD_L,
  camBump,
} from './enginePhysics';

/** Elevacao maxima da valvula (deslocamento para baixo, em metros de cena). */
export const VALVE_MAX_LIFT = 0.24;
/** Posicoes X das valvulas (admissao no +X, escape no -X). */
export const INTAKE_X = 0.24;
export const EXHAUST_X = -0.24;
/** Topo plano do tucho (balde) da valvula, no frame local da valvula. */
export const TAPPET_TOP = 0.9;
/** Raio do circulo de base do ressalto e altura do bico (= elevacao maxima). */
export const CAM_RB = 0.17;
export const CAM_LN = VALVE_MAX_LIFT;
/** Y do centro do eixo do comando: o came encosta no tucho fechado sem folga. */
export const CAM_CENTER_Y = DECK_Y + TAPPET_TOP + CAM_RB;

const STEEL = { color: '#c4ccd6', metalness: 0.9, roughness: 0.3 } as const;
const DARK = { color: '#5c636e', metalness: 0.8, roughness: 0.4 } as const;
const CRANK_MAT = { color: '#8f97a2', metalness: 0.85, roughness: 0.3 } as const;
const ROD_MAT = { color: '#aab2be', metalness: 0.85, roughness: 0.3 } as const;
const PISTON_MAT = { color: '#dfe4ea', metalness: 0.82, roughness: 0.28 } as const;
const ALU = { color: '#c9d0d9', metalness: 0.55, roughness: 0.5 } as const;
const BRASS = { color: '#c9a24a', metalness: 0.8, roughness: 0.32 } as const;
const COPPER = { color: '#d98a4b', metalness: 0.7, roughness: 0.35 } as const;

/** Material de casca (bloco/cabecote/carter): metal solido ou transparente (raio-X). */
function Shell({
  xray,
  color,
  metalness = 0.6,
  roughness = 0.5,
}: {
  xray: boolean;
  color: string;
  metalness?: number;
  roughness?: number;
}) {
  if (xray) {
    return (
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.1}
        metalness={0.1}
        roughness={0.12}
        depthWrite={false}
      />
    );
  }
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />;
}

/** Material das aletas: solido, ou levemente transparente no raio-X. */
function FinMat({ xray }: { xray: boolean }) {
  if (xray) {
    return (
      <meshStandardMaterial
        color="#c9d0d9"
        transparent
        opacity={0.22}
        metalness={0.2}
        roughness={0.4}
        depthWrite={false}
      />
    );
  }
  return <meshStandardMaterial color="#c9d0d9" metalness={0.55} roughness={0.5} />;
}

/* ------------------------------------------------------------------ PISTAO */
/** Pistao: o pino fica no Y local 0 (a cena posiciona o grupo por esse pino). */
export function Piston() {
  return (
    <group>
      {/* corpo/saia */}
      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[PISTON_R, PISTON_R, 0.9, 32]} />
        <meshStandardMaterial {...PISTON_MAT} />
      </mesh>
      {/* coroa (topo) */}
      <mesh position={[0, PISTON_HALF - 0.03, 0]}>
        <cylinderGeometry args={[PISTON_R, PISTON_R, 0.06, 32]} />
        <meshStandardMaterial color="#eef2f6" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* aneis */}
      {[0.27, 0.19, 0.11].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[PISTON_R + 0.008, PISTON_R + 0.008, 0.03, 32]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
      ))}
      {/* pino (eixo X) no Y=0 */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, PISTON_R * 2 + 0.06, 16]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------- BIELA */
/** Biela: olhal grande no Y local 0 (moente) e olhal pequeno no Y=ROD_L (pino). */
export function ConnRod() {
  const midY = ROD_L / 2;
  const shaftLen = ROD_L - 0.5;
  return (
    <group>
      {/* olhal grande (capa da biela) — furo abraca o moente, estreito entre os discos */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.19, 0.06, 16, 30]} />
        <meshStandardMaterial {...ROD_MAT} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.36, 22]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      {/* corpo em I */}
      <mesh position={[0, midY, 0]}>
        <boxGeometry args={[0.16, shaftLen, 0.16]} />
        <meshStandardMaterial {...ROD_MAT} />
      </mesh>
      <mesh position={[0, midY, 0.055]}>
        <boxGeometry args={[0.26, shaftLen, 0.05]} />
        <meshStandardMaterial {...ROD_MAT} />
      </mesh>
      <mesh position={[0, midY, -0.055]}>
        <boxGeometry args={[0.26, shaftLen, 0.05]} />
        <meshStandardMaterial {...ROD_MAT} />
      </mesh>
      {/* olhal pequeno (pino do pistao) */}
      <mesh position={[0, ROD_L, 0]}>
        <torusGeometry args={[0.11, 0.055, 12, 24]} />
        <meshStandardMaterial {...ROD_MAT} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------ VIRABREQUIM */
/** Virabrequim centrado no eixo (Y=0 local). Moente no Y=+CRANK_R. */
export function Crankshaft() {
  const cheekZ = 0.4; // Z de cada disco (cheek); a biela corre entre eles
  const cheekR = 0.72;
  return (
    <group>
      {/* munhoes de apoio (giram nos mancais do carter) */}
      {[0.62, -0.62].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.46, 24]} />
          <meshStandardMaterial {...CRANK_MAT} />
        </mesh>
      ))}
      {/* 2 discos (cheeks) com contrapeso oposto ao moente */}
      {[cheekZ, -cheekZ].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[cheekR, cheekR, 0.14, 44]} />
            <meshStandardMaterial {...CRANK_MAT} />
          </mesh>
          {/* contrapeso (massa no lado oposto ao moente) */}
          <mesh position={[0, -0.34, 0]}>
            <boxGeometry args={[1.0, 0.62, 0.14]} />
            <meshStandardMaterial {...DARK} />
          </mesh>
        </group>
      ))}
      {/* moente (crankpin) entre os discos, deslocado +CRANK_R */}
      <mesh position={[0, CRANK_R, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 2 * cheekZ + 0.14, 22]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* volante de inercia atras (nao tampa o corte visto de frente) */}
      <mesh position={[0, 0, -0.84]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.14, 44]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------ CAMISA + ALETAS */
/** Camisa do cilindro com aletas de refrigeracao, flanges e prisioneiros. */
export function CylinderBarrel({ xray }: { xray: boolean }) {
  const bottom = DECK_Y - 2 * CRANK_R - 0.55; // um pouco abaixo do PMI
  const top = DECK_Y;
  const h = top - bottom;
  const midY = (top + bottom) / 2;
  const finCount = 9;
  return (
    <group>
      {/* parede da camisa */}
      <mesh position={[0, midY, 0]}>
        <cylinderGeometry args={[BORE_R + 0.05, BORE_R + 0.05, h, 48, 1, true]} />
        <Shell xray={xray} color="#cdd4dd" metalness={0.72} roughness={0.4} />
      </mesh>
      {/* aletas de refrigeracao (maiores embaixo) */}
      {Array.from({ length: finCount }).map((_, i) => {
        const f = i / (finCount - 1);
        const y = bottom + 0.28 + f * (h - 0.42);
        const rad = 0.86 - 0.14 * f;
        return (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[rad, rad, 0.05, 48]} />
            <FinMat xray={xray} />
          </mesh>
        );
      })}
      {/* flanges (base do cilindro e junta do cabecote) */}
      <mesh position={[0, bottom + 0.05, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.14, 48]} />
        <meshStandardMaterial color="#b4bbc4" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, top - 0.03, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 48]} />
        <meshStandardMaterial color="#b4bbc4" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* 4 prisioneiros (studs) que prendem o cabecote ao bloco */}
      {[
        [0.72, 0.5],
        [-0.72, 0.5],
        [0.72, -0.5],
        [-0.72, -0.5],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, midY + 0.25, z]}>
          <cylinderGeometry args={[0.05, 0.05, h + 0.7, 12]} />
          <meshStandardMaterial color="#8a9099" metalness={0.88} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------- CABECOTE */
/** Cabecote: bloco com portas de admissao/escape e a vela (opaco ou raio-X). */
export function CylinderHead({ xray }: { xray: boolean }) {
  const base = DECK_Y;
  const top = DECK_Y + 0.72;
  const midY = (base + top) / 2;
  return (
    <group>
      {/* corpo do cabecote */}
      <mesh position={[0, midY, 0]}>
        <boxGeometry args={[1.5, top - base, 1.3]} />
        <Shell xray={xray} color="#c9d0d9" metalness={0.55} roughness={0.5} />
      </mesh>
      {/* aletas do cabecote */}
      {[0.16, 0.42, 0.66].map((dy) => (
        <mesh key={dy} position={[0, base + dy, 0]}>
          <boxGeometry args={[1.62, 0.05, 1.42]} />
          <FinMat xray={xray} />
        </mesh>
      ))}
      {/* sede conica + garganta (furo/porta real) + guia por valvula */}
      {[INTAKE_X, EXHAUST_X].map((x) => (
        <group key={`v${x}`} position={[x, base, 0]}>
          {/* garganta: o furo por onde a valvula abre para a porta */}
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.15, 0.17, 0.54, 24, 1, true]} />
            <meshStandardMaterial color="#15181d" metalness={0.3} roughness={0.7} side={2} />
          </mesh>
          {/* sede conica onde a cabeca da valvula assenta */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.15, 0.09, 26, 1, true]} />
            <meshStandardMaterial {...BRASS} side={2} />
          </mesh>
          {/* guia da haste */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.46, 14, 1, true]} />
            <meshStandardMaterial {...DARK} />
          </mesh>
        </group>
      ))}
      {/* vela de ignicao (centro) */}
      <group position={[0, top - 0.02, 0]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.32, 16]} />
          <meshStandardMaterial {...ALU} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.22, 12]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
      </group>
    </group>
  );
}

/* --------------------------------------------------------------- VALVULA */
/** Valvula cogumelo: disco no Y=0 (assentada), haste e tucho de topo plano. */
export function PoppetValve({ tint }: { tint: string }) {
  return (
    <group>
      {/* disco (cabeca) */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.19, 0.13, 0.06, 20]} />
        <meshStandardMaterial color={tint} metalness={0.85} roughness={0.28} />
      </mesh>
      {/* transicao */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.045, 0.13, 0.16, 16]} />
        <meshStandardMaterial color={tint} metalness={0.85} roughness={0.28} />
      </mesh>
      {/* haste */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.82, 12]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* mola */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.5, 16, 1, true]} />
        <meshStandardMaterial color="#454b54" metalness={0.6} roughness={0.5} wireframe />
      </mesh>
      {/* tucho/balde: topo plano onde o ressalto do comando encosta */}
      <mesh position={[0, TAPPET_TOP - 0.07, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.14, 20]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------- COMANDO */
/** Raio do perfil do ressalto no angulo `a` (came-local): base + bico geometrico. */
function camRadius(a: number, phase: number): number {
  return CAM_RB + CAM_LN * camBump(a - phase);
}

/** Geometria real do ressalto: perfil polar extrudado ao longo do eixo X. */
function useLobeGeometry(phase: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const r = camRadius(a, phase);
      const x = r * Math.sin(a);
      const y = r * Math.cos(a);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.15,
      bevelEnabled: false,
      curveSegments: 24,
    });
    geo.translate(0, 0, -0.075);
    return geo;
  }, [phase]);
}

/**
 * Comando de valvulas: eixo ao longo de X com um ressalto real sobre cada
 * valvula. A cena gira o grupo pai (rotation.x); o bico de cada ressalto
 * empurra o tucho — a MESMA geometria que calcula a elevacao da valvula.
 */
export function Camshaft() {
  const inGeo = useLobeGeometry(CAM_PHASE_INTAKE);
  const exGeo = useLobeGeometry(CAM_PHASE_EXHAUST);
  return (
    <group>
      {/* eixo do comando (ao longo de X) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 1.05, 20]} />
        <meshStandardMaterial {...CRANK_MAT} />
      </mesh>
      {/* mancais */}
      {[0.44, -0.44].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 18]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
      ))}
      {/* ressaltos (came) — perfil real extrudado ao longo de X */}
      <mesh geometry={inGeo} position={[INTAKE_X, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial {...CRANK_MAT} />
      </mesh>
      <mesh geometry={exGeo} position={[EXHAUST_X, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial {...CRANK_MAT} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------- INJETOR */
/**
 * Ponta (bico) do injetor multiponto: fica na entrada da porta de admissao,
 * mirando a costas da valvula de admissao. E o ponto de onde sai o jato.
 */
export const INJECTOR_TIP: [number, number, number] = [0.66, DECK_Y + 0.34, 0];

/**
 * Bico injetor de combustivel (injecao multiponto / PFI). Fica montado na
 * galeria/porta de admissao com o pulverizador apontando para a valvula de
 * admissao (nao para a camara) — a mistura se forma no coletor durante a
 * admissao. O tubo distribuidor (fuel rail) alimenta o topo; o conector
 * eletrico fica na lateral.
 */
export function Injector() {
  const dx = INTAKE_X - INJECTOR_TIP[0];
  const dy = DECK_Y - INJECTOR_TIP[1];
  const len = Math.hypot(dx, dy) || 1;
  const rot = Math.atan2(dx / len, -dy / len); // -Y local aponta para a valvula
  return (
    <group position={INJECTOR_TIP} rotation={[0, 0, rot]}>
      {/* pulverizador (entra na porta de admissao) */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.03, 0.055, 0.1, 16]} />
        <meshStandardMaterial {...COPPER} />
      </mesh>
      {/* o-rings de vedacao */}
      {[0.13, 0.33].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.072, 0.02, 10, 22]} />
          <meshStandardMaterial color="#20242b" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}
      {/* corpo metalico */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.3, 22]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* solenoide (corpo plastico superior) */}
      <mesh position={[0, 0.47, 0]}>
        <cylinderGeometry args={[0.088, 0.082, 0.2, 22]} />
        <meshStandardMaterial color="#2b303a" metalness={0.35} roughness={0.6} />
      </mesh>
      {/* copo de encaixe no tubo distribuidor (fuel rail) */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.055, 0.078, 0.12, 18]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* conector eletrico lateral */}
      <mesh position={[0.13, 0.5, 0]}>
        <boxGeometry args={[0.15, 0.13, 0.15]} />
        <meshStandardMaterial color="#1c2028" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------- ADMISSAO + ESCAPE */
/** Material de duto: transparente no raio-X (ver os gases) ou metal solido. */
function PipeMat({ xray, color }: { xray: boolean; color: string }) {
  if (xray) {
    return (
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.32}
        metalness={0.35}
        roughness={0.3}
        depthWrite={false}
        side={2}
      />
    );
  }
  return <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} side={2} />;
}

/** Cano vazado: tubo liso (TubeGeometry) seguindo uma curva suave pelos pontos. */
function CurvedPipe({
  points,
  radius,
  xray,
  color,
}: {
  points: [number, number, number][];
  radius: number;
  xray: boolean;
  color: string;
}) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
    );
    return new THREE.TubeGeometry(curve, 80, radius, 24, false);
  }, [points, radius]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <PipeMat xray={xray} color={color} />
    </mesh>
  );
}

/** Curva do cano de ADMISSAO (flange no cabecote -> corpo de borboleta). */
export const INTAKE_PIPE: [number, number, number][] = [
  [0.55, DECK_Y + 0.3, 0],
  [0.95, DECK_Y + 0.55, 0],
  [1.28, DECK_Y + 0.82, 0],
  [1.5, DECK_Y + 1.08, 0],
];
/** Curva do cano de ESCAPE (flange no cabecote -> entrada do silencioso). */
export const EXHAUST_PIPE: [number, number, number][] = [
  [-0.55, DECK_Y + 0.24, 0],
  [-0.98, DECK_Y - 0.02, 0],
  [-1.36, DECK_Y - 0.44, 0],
  [-1.72, DECK_Y - 0.72, 0],
];

/** Sistema de ADMISSAO (direita): cano vazado + braçadeira + borboleta + filtro. */
export function IntakeSystem({ xray }: { xray: boolean }) {
  return (
    <group>
      <CurvedPipe points={INTAKE_PIPE} radius={0.15} xray={xray} color="#b7c2cf" />
      {/* braçadeira no cabecote */}
      <mesh position={[0.6, DECK_Y + 0.33, 0]}>
        <torusGeometry args={[0.17, 0.03, 10, 22]} />
        <Shell xray={xray} color="#8a9099" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* corpo de borboleta */}
      <mesh position={[1.56, DECK_Y + 1.16, 0]} rotation={[0, 0, -0.72]}>
        <cylinderGeometry args={[0.19, 0.19, 0.34, 24]} />
        <Shell xray={xray} color="#454b54" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* filtro de ar (trombeta) */}
      <mesh position={[1.74, DECK_Y + 1.44, 0]} rotation={[0, 0, -0.72]}>
        <cylinderGeometry args={[0.34, 0.24, 0.4, 24]} />
        <Shell xray={xray} color="#caa24a" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Sistema de ESCAPE (esquerda): header vazado + braçadeira + silencioso + ponteira. */
export function ExhaustSystem({ xray }: { xray: boolean }) {
  return (
    <group>
      <CurvedPipe points={EXHAUST_PIPE} radius={0.14} xray={xray} color="#8a8f98" />
      {/* braçadeira no cabecote */}
      <mesh position={[-0.6, DECK_Y + 0.28, 0]}>
        <torusGeometry args={[0.16, 0.03, 10, 22]} />
        <Shell xray={xray} color="#8a9099" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* silencioso (muffler) horizontal */}
      <mesh position={[-2.05, DECK_Y - 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.78, 24]} />
        <Shell xray={xray} color="#5c636e" metalness={0.6} roughness={0.45} />
      </mesh>
      {/* ponteira */}
      <mesh position={[-2.5, DECK_Y - 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.17, 0.3, 20, 1, true]} />
        <PipeMat xray={xray} color="#3a4048" />
      </mesh>
    </group>
  );
}

/** Carter do virabrequim: caixa de topo ABERTO (a biela sobe livre) + mancais + sump. */
export function Crankcase({ y, xray }: { y: number; xray: boolean }) {
  const T = 0.12; // espessura das paredes
  const W = 2.1;
  const D = 1.4;
  const H = 1.9;
  const cy = -0.05;
  const wallX = W / 2 - T / 2;
  const wallZ = D / 2 - T / 2;
  return (
    <group position={[0, y, 0]}>
      {/* fundo */}
      <mesh position={[0, cy - H / 2 + T / 2, 0]}>
        <boxGeometry args={[W, T, D]} />
        <Shell xray={xray} color="#c2c9d2" metalness={0.5} roughness={0.55} />
      </mesh>
      {/* paredes frente/tras (mancais do virabrequim) — TOPO ABERTO */}
      {[wallZ, -wallZ].map((z) => (
        <mesh key={z} position={[0, cy, z]}>
          <boxGeometry args={[W, H, T]} />
          <Shell xray={xray} color="#c2c9d2" metalness={0.5} roughness={0.55} />
        </mesh>
      ))}
      {/* paredes laterais */}
      {[wallX, -wallX].map((x) => (
        <mesh key={x} position={[x, cy, 0]}>
          <boxGeometry args={[T, H, D]} />
          <Shell xray={xray} color="#c2c9d2" metalness={0.5} roughness={0.55} />
        </mesh>
      ))}
      {/* mancais (bosses) onde o munhao apoia */}
      {[wallZ, -wallZ].map((z) => (
        <mesh key={`b${z}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.12, 24]} />
          <Shell xray={xray} color="#aeb6c0" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* carter de oleo (sump) */}
      <mesh position={[0, cy - H / 2 - 0.12, 0]}>
        <boxGeometry args={[1.5, 0.4, 1.05]} />
        <meshStandardMaterial color="#3b414b" metalness={0.5} roughness={0.55} />
      </mesh>
    </group>
  );
}
