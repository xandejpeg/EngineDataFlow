import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Eye } from 'lucide-react';
import { PART_MODELS } from '@/engine3d/parts/partModels';
import { Choice, SceneShell } from './sceneUi';
import { Flow, GLASS, Run, Seg, type Vec3 } from './mapPrimitives';
import { PartFocusView } from './PartFocusView';
import { hasFocus } from './partFocus';
import {
  GROUP_META,
  GROUP_ORDER,
  MOTRONIC_ITEMS,
  type MapGroup,
  type MapItem,
} from './motronicMap';

const BG = '#ffffff';
/** A lista ocupa a direita: a camera mira um pouco a direita para o desenho sobrar na esquerda. */
const PAN_X = 0.8;
const ECU_POS: [number, number, number] = [-8.6, -1.8, 0];
const OVERVIEW = { x: PAN_X, y: 0.1, dist: 13.7 };
/** Plano dos fios, atras de tudo, para o chicote nao atravessar as pecas. */
const WIRE_Z = -2.6;
/** Espinha do barramento CAN: par trancado com um resistor de 120 ohm em cada ponta. */
const CAN_X = -7.1;
const CAN_TOP = 1.6;
const CAN_BOTTOM = -5.0;
const CAN_Z = -0.6;
const CAN_COLOR = '#8a6d10';
/** Eixo comando: fica em cima das hastes das valvulas, dentro da tampa. */
const CAM_Y = 1.72;
const CAM_Z = 0.55;
/** O motor em corte fica maior que as pecas do mapa para dar para ver o que acontece dentro. */
const ENGINE_SCALE = 1.2;

const FILTERS: (MapGroup | 'tudo')[] = ['tudo', ...GROUP_ORDER];
const FILTER_LABELS = ['Tudo', ...GROUP_ORDER.map((g) => GROUP_META[g].labelPt)];

/** Duto de admissao: da tomada de ar ate o coletor, passando pelo MAF e pela borboleta. */
const AIR_PATH: Vec3[] = [
  [-8.9, 2.4, 0],
  [-3.4, 2.4, 0],
  [-3.4, 4.0, 0],
  [-3.4, 4.0, -1.35],
  [-2.35, 4.0, -1.35],
];
/** O ar comeca fora da tomada, antes de entrar na caixa do filtro. */
const AIR_FLOW: Vec3[] = [[-11.2, 2.4, 0], ...AIR_PATH];
/** Respiro do tanque ate o canister: e por aqui que o vapor sai do tanque. */
const TANK_VENT_PATH: Vec3[] = [
  [-4.0, -4.3, -0.7],
  [-4.0, -4.3, -1.7],
  [-9.25, -4.3, -1.7],
  [-9.25, 5.0, -1.7],
  [-8.6, 5.0, -1.7],
  [-8.6, 5.0, -0.4],
];
/** Respiro do canister para o ar livre, com filtro de po na ponta. */
const VENT_PATH: Vec3[] = [
  [-8.6, 4.4, 0],
  [-8.6, 4.0, 0],
  [-9.62, 4.0, 0],
];
/** Canister -> valvula de purga. */
const PURGE_IN_PATH: Vec3[] = [
  [-8.02, 5.0, 0],
  [-6.2, 5.0, 0],
];
/** Valvula de purga -> coletor de admissao, depois da borboleta. */
const PURGE_OUT_PATH: Vec3[] = [
  [-5.0, 5.0, 0],
  [-1.4, 5.0, 0],
  [-1.4, 5.0, -1.7],
  [-1.4, 4.25, -1.7],
];
/** Baixa pressao: modulo dentro do tanque ate a bomba de alta. */
const FUEL_PATH: Vec3[] = [
  [-2.2, -4.6, 0.7],
  [-2.2, -4.6, 1.7],
  [4.6, -4.6, 1.7],
  [4.6, 3.3, 1.7],
  [4.6, 3.3, 0.55],
  [3.6, 3.3, 0.55],
];
/** Alta pressao: bomba ate a galeria. */
const RAIL_PATH: Vec3[] = [
  [2.95, 3.3, 0.9],
  [2.95, 3.3, 1.15],
  [-0.62, 3.3, 1.15],
];
/** Sensor de pressao rosqueado na ponta da galeria. */
const RAILP_PATH: Vec3[] = [
  [-2.55, 2.5, 1.15],
  [-2.55, 3.3, 1.15],
  [-1.78, 3.3, 1.15],
];
/** Da galeria para o bico injetor, que fica enfiado no cabecote. */
const INJ_PATH: Vec3[] = [
  [-1.313, 3.0, 1.15],
  [-1.313, 2.35, 1.15],
  [-1.313, 2.35, 0],
  [-1.653, 2.35, 0],
  [-1.653, 1.8, 0],
];
const EXH_PATH: Vec3[] = [
  [1.92, 0.66, 0],
  [5.6, 0.66, 0],
  [5.6, -5.5, 0],
];
/** Tomada de gas queimado no escape ate a valvula EGR. */
const EGR_IN_PATH: Vec3[] = [
  [5.6, 0.66, 0],
  [5.6, 4.7, 0],
  [4.45, 4.7, 0],
];
/** EGR -> coletor de admissao. */
const EGR_OUT_PATH: Vec3[] = [
  [3.35, 4.7, 0],
  [1.25, 4.7, 0],
  [1.25, 4.7, -1.7],
  [1.25, 4.25, -1.7],
];
/** +12 V: bateria -> caixa de fusiveis -> ECU e pino 16 do OBD. */
const POWER_PATH: Vec3[] = [
  [-8.6, 0.15, 0.35],
  [-9.65, 0.15, 0.35],
  [-9.65, -4.2, 0.35],
  [-9.05, -4.2, 0.35],
];


/**
 * Motor em corte: a carcaca fica translucida de proposito, para o aluno ver o
 * pistao subindo, as valvulas abrindo, o jato do injetor e a faisca da vela.
 */
function EngineCutaway() {
  const piston = useRef<THREE.Group>(null);
  const rod = useRef<THREE.Mesh>(null);
  const pin = useRef<THREE.Mesh>(null);
  const vIn = useRef<THREE.Group>(null);
  const vEx = useRef<THREE.Group>(null);
  const spark = useRef<THREE.Mesh>(null);
  const spray = useRef<THREE.Mesh>(null);
  const wheel = useRef<THREE.Group>(null);
  const ang = useRef(0);

  const CRANK_Y = -2.5;
  const CRANK_R = 0.62;
  const ROD_LEN = 1.75;
  /** Roda dentada 60-2: 60 posicoes, duas sem dente, para a ECU achar o PMS. */
  const TEETH = Array.from({ length: 24 }, (_, i) => i).filter((i) => i > 1);

  useFrame((_, dt) => {
    ang.current = (ang.current + dt * 4.2) % (Math.PI * 4);
    const a = ang.current;
    const deg = (a * 180) / Math.PI;

    if (wheel.current) wheel.current.rotation.z = -a;

    const px = Math.sin(a) * CRANK_R;
    const py = CRANK_Y + Math.cos(a) * CRANK_R;
    if (pin.current) pin.current.position.set(px, py, 0);

    const pistonY = py + Math.sqrt(Math.max(0.01, ROD_LEN * ROD_LEN - px * px));
    if (piston.current) piston.current.position.y = pistonY;

    if (rod.current) {
      const dx = 0 - px;
      const dy = pistonY - py;
      rod.current.position.set(px + dx / 2, py + dy / 2, 0);
      rod.current.rotation.z = -Math.atan2(dx, dy);
    }

    // 0-180 admissao, 180-360 compressao, 360-540 expansao, 540-720 escape
    const intake = deg < 180 ? Math.sin((deg / 180) * Math.PI) : 0;
    const exhaust = deg > 540 ? Math.sin(((deg - 540) / 180) * Math.PI) : 0;
    if (vIn.current) vIn.current.position.y = -0.3 * intake;
    if (vEx.current) vEx.current.position.y = -0.3 * exhaust;

    if (spark.current) {
      const on = deg > 330 && deg < 372;
      spark.current.visible = on;
      spark.current.scale.setScalar(on ? 0.7 + Math.random() * 0.9 : 1);
    }
    if (spray.current) spray.current.visible = deg > 20 && deg < 140;
  });

  return (
    <group>
      {/* Carcaca translucida */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[3.2, 1.0, 1.8]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <boxGeometry args={[3.0, 2.6, 1.7]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0, -2.85, 0]}>
        <boxGeometry args={[2.6, 0.5, 1.4]} />
        <meshStandardMaterial color="#2b313d" metalness={0.5} roughness={0.65} />
      </mesh>
      {/* Tampa de valvulas: e dentro dela que moram os eixos comando */}
      <mesh position={[0, 1.44, 0]}>
        <boxGeometry args={[3.2, 0.78, 1.8]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>

      {/* Camisa do cilindro */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 2.4, 28, 1, true]} />
        <meshStandardMaterial
          color="#5b667a"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Pistao */}
      <group ref={piston}>
        <mesh>
          <cylinderGeometry args={[0.52, 0.52, 0.5, 24]} />
          <meshStandardMaterial color="#9aa6b8" metalness={0.85} roughness={0.3} />
        </mesh>
        {[0.16, 0.05].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.52, 0.03, 8, 28]} />
            <meshStandardMaterial color="#5d6472" metalness={0.85} roughness={0.45} />
          </mesh>
        ))}
      </group>

      {/* Biela e virabrequim */}
      <mesh ref={rod}>
        <boxGeometry args={[0.16, ROD_LEN, 0.16]} />
        <meshStandardMaterial color="#7d8798" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh position={[0, CRANK_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.1, 20]} />
        <meshStandardMaterial color="#606b7c" metalness={0.85} roughness={0.4} />
      </mesh>
      <mesh ref={pin} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.8, 16]} />
        <meshStandardMaterial color="#8d97a8" metalness={0.85} roughness={0.35} />
      </mesh>

      {/* Roda dentada na ponta do virabrequim: e o que o sensor de rotacao le */}
      <group ref={wheel} position={[0, CRANK_Y, 1.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.1, 32]} />
          <meshStandardMaterial color="#6d7789" metalness={0.8} roughness={0.4} />
        </mesh>
        {TEETH.map((i) => {
          const th = (i / 24) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(th) * 0.64, Math.sin(th) * 0.64, 0]}
              rotation={[0, 0, th]}
            >
              <boxGeometry args={[0.14, 0.08, 0.1]} />
              <meshStandardMaterial color="#8d97a8" metalness={0.8} roughness={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* Valvula de admissao (azul) e de escape (laranja) */}
      <group ref={vIn} position={[0, 0, 0]}>
        <mesh position={[-0.32, 0.75, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.2, 12]} />
          <meshStandardMaterial color="#8d97a8" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[-0.32, 0.14, 0]}>
          <cylinderGeometry args={[0.22, 0.06, 0.16, 20]} />
          <meshStandardMaterial color="#1d5fd8" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>
      <group ref={vEx} position={[0, 0, 0]}>
        <mesh position={[0.32, 0.75, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.2, 12]} />
          <meshStandardMaterial color="#8d97a8" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[0.32, 0.14, 0]}>
          <cylinderGeometry args={[0.22, 0.06, 0.16, 20]} />
          <meshStandardMaterial color="#d4571f" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* Vela de ignicao */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 6]} />
        <meshStandardMaterial color="#8d97a8" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#d9d0b6" metalness={0.05} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
        <meshStandardMaterial color="#606b7c" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh ref={spark} position={[0, 0.31, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color="#1e6fff" />
      </mesh>
      <Text position={[1.0, 1.15, 0.95]} fontSize={0.19} color="#7127c9" anchorX="center">
        vela
      </Text>

      {/* Jato do injetor direto entrando na camara (o corpo do bico e a peca 15) */}
      <mesh ref={spray} position={[-0.72, 0.25, 0]} rotation={[0, 0, 0.55]}>
        <coneGeometry args={[0.3, 1.1, 16, 1, true]} />
        <meshBasicMaterial color="#e08a1e" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[-1.15, -0.5, 0.95]} fontSize={0.19} color="#c2610a" anchorX="center">
        jato
      </Text>

      <Text position={[1.75, -3.35, 0.95]} fontSize={0.2} color="#5b6779" anchorX="center">
        motor em corte
      </Text>
    </group>
  );
}

const LOBE_X = [-1.8, -1.15, -0.5, 0.15];

/**
 * Eixos comando, girando na metade da rotacao do motor. Ficam em cima das
 * hastes das valvulas; a vela passa no vao entre os dois. E o comando que
 * aciona a bomba de alta pressao e que carrega a roda de fase do sensor CMP.
 */
function Camshafts() {
  const front = useRef<THREE.Group>(null);
  const rear = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const w = dt * 2.1;
    if (front.current) front.current.rotation.x += w;
    if (rear.current) rear.current.rotation.x += w;
  });

  const lobe = (x: number) => (
    <mesh key={x} position={[x, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.26, 0.26, 0.17, 20]} />
      <meshStandardMaterial color="#8d97a8" metalness={0.8} roughness={0.4} />
    </mesh>
  );

  return (
    <group>
      <group ref={front} position={[0, CAM_Y, CAM_Z]}>
        <mesh position={[0.425, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 5.45, 16]} />
          <meshStandardMaterial color="#7d8798" metalness={0.85} roughness={0.35} />
        </mesh>
        {LOBE_X.map(lobe)}
        {lobe(2.95)}
        {/* Roda de fase: um dente so, e como a ECU sabe em que tempo o motor esta */}
        <mesh position={[1.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.09, 26]} />
          <meshStandardMaterial color="#6d7789" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[1.7, 0.42, 0]}>
          <boxGeometry args={[0.1, 0.18, 0.14]} />
          <meshStandardMaterial color="#8d97a8" metalness={0.8} roughness={0.4} />
        </mesh>
      </group>

      <group ref={rear} position={[0, CAM_Y, -CAM_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 4.6, 16]} />
          <meshStandardMaterial color="#7d8798" metalness={0.85} roughness={0.35} />
        </mesh>
        {LOBE_X.map(lobe)}
      </group>

      {/* Tucho da bomba de alta apoiado no ressalto do comando */}
      <Seg from={[2.95, 2.84, CAM_Z]} to={[2.95, 1.98, CAM_Z]} r={0.09} color="#8d97a8" />

      <Text position={[3.25, 2.35, CAM_Z]} fontSize={0.19} color="#5b6779" anchorX="left">
        eixo comando
      </Text>
    </group>
  );
}

/** Coletores, dutos, tanque, escape e tubulacoes: o esqueleto do desenho. */
function Plumbing() {
  return (
    <group>
      {/* Coletor de admissao atras do cabecote, com os dutos descendo nos cilindros */}
      <mesh position={[-0.5, 4.0, -1.35]}>
        <boxGeometry args={[3.6, 0.5, 0.9]} />
        <meshStandardMaterial color="#3d4657" metalness={0.35} roughness={0.65} />
      </mesh>
      {LOBE_X.map((x) => (
        <mesh key={x} position={[x, 2.51, -1.35]}>
          <cylinderGeometry args={[0.14, 0.14, 2.48, 14]} />
          <meshStandardMaterial color="#3d4657" metalness={0.35} roughness={0.65} />
        </mesh>
      ))}
      {/* Tomada de vacuo do sensor MAP */}
      <Seg from={[0.2, 3.75, -1.35]} to={[0.2, 4.45, -1.35]} r={0.06} color="#3d4657" />

      <Camshafts />

      {/* Capa da bobina descendo no poco ate sentar na vela: nao existe cabo de alta */}
      <Seg
        from={[0, 2.35, 0]}
        to={[0, 1.5, 0]}
        r={0.1}
        color="#23272f"
        metalness={0.1}
        roughness={0.9}
      />

      {/* Caixa do filtro de ar, antes do medidor de massa de ar */}
      <mesh position={[-9.25, 2.4, 0]}>
        <boxGeometry args={[0.75, 0.95, 0.9]} />
        <meshStandardMaterial color="#3d4657" metalness={0.35} roughness={0.65} />
      </mesh>
      {/* Tomada de ar: trombeta virada para fora, e por onde o ar entra */}
      <Seg from={[-9.625, 2.4, 0]} to={[-9.95, 2.4, 0]} r={0.17} color="#5b667a" />
      <mesh position={[-10.08, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.17, 0.3, 18, 1, true]} />
        <meshStandardMaterial
          color="#5b667a"
          metalness={0.4}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tanque de combustivel: o modulo da bomba fica dentro dele */}
      <mesh position={[-2.8, -4.75, 0]}>
        <boxGeometry args={[2.6, 1.4, 1.4]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>

      {/* Filtro do respiro do canister, aberto para o ar livre */}
      <mesh position={[-9.8, 4.0, 0]}>
        <boxGeometry args={[0.3, 0.36, 0.3]} />
        <meshStandardMaterial color="#3d4657" metalness={0.35} roughness={0.65} />
      </mesh>

      {/* Caixa de fusiveis entre a bateria e o resto do carro */}
      <mesh position={[-9.65, -1.0, 0.35]}>
        <boxGeometry args={[0.4, 0.55, 0.4]} />
        <meshStandardMaterial color="#3d4657" metalness={0.35} roughness={0.65} />
      </mesh>

      <Run points={AIR_PATH} r={0.2} color="#5b667a" />
      {/* Abracadeiras onde o duto entra na caixa do filtro, no MAF e na borboleta */}
      {[-8.86, -8.3, -7.1, -5.6, -4.4].map((x) => (
        <mesh key={x} position={[x, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.245, 0.245, 0.13, 16]} />
          <meshStandardMaterial color="#2f3644" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Entrada do duto no coletor de admissao */}
      <mesh position={[-2.4, 4.0, -1.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.245, 0.245, 0.13, 16]} />
        <meshStandardMaterial color="#2f3644" metalness={0.5} roughness={0.5} />
      </mesh>
      <Run points={EXH_PATH} r={0.17} color="#7a6a5c" />
      <Run points={TANK_VENT_PATH} r={0.05} color="#2f3644" metalness={0.1} roughness={0.9} />
      <Run points={VENT_PATH} r={0.05} color="#2f3644" metalness={0.1} roughness={0.9} />
      <Run points={PURGE_IN_PATH} r={0.055} color="#2f3644" metalness={0.1} roughness={0.9} />
      <Run points={PURGE_OUT_PATH} r={0.055} color="#2f3644" metalness={0.1} roughness={0.9} />
      <Run points={FUEL_PATH} r={0.055} color="#8a6330" metalness={0.4} roughness={0.6} />
      <Run points={RAIL_PATH} r={0.055} color="#8a6330" metalness={0.4} roughness={0.6} />
      <Run points={RAILP_PATH} r={0.045} color="#8a6330" metalness={0.4} roughness={0.6} />
      <Run points={INJ_PATH} r={0.045} color="#8a6330" metalness={0.4} roughness={0.6} />
      <Run points={EGR_IN_PATH} r={0.085} color="#6d5a4a" metalness={0.5} roughness={0.6} />
      <Run points={EGR_OUT_PATH} r={0.085} color="#6d5a4a" metalness={0.5} roughness={0.6} />
      <Run points={POWER_PATH} r={0.055} color="#b03030" metalness={0.2} roughness={0.7} />
      {/* Derivacao do +12 V para a ECU */}
      <Seg
        from={[-9.65, -1.8, 0.35]}
        to={[-9.05, -1.8, 0.35]}
        r={0.055}
        color="#b03030"
        metalness={0.2}
        roughness={0.7}
      />

      {/* Tomadas das sondas e do EGT no tubo de escape */}
      <Seg from={[5.6, -0.6, 0]} to={[6.45, -0.6, 0]} r={0.07} color="#8d97a8" />
      <Seg from={[5.6, -3.2, 0]} to={[6.45, -3.2, 0]} r={0.07} color="#8d97a8" />
      <Seg from={[5.6, -5.5, 0]} to={[6.45, -5.5, 0]} r={0.07} color="#8d97a8" />

      {/* Sensor de rotacao apontado para a roda dentada do virabrequim */}
      <Seg from={[-3.55, -3.0, 1.0]} to={[-0.95, -3.0, 1.2]} r={0.07} color="#8d97a8" />
      {/* Sensor de detonacao parafusado na lateral do bloco */}
      <Seg from={[1.82, -2.1, 0.6]} to={[2.5, -2.1, 0.9]} r={0.07} color="#8d97a8" />
      {/* Sensor de fase apontado para a roda do comando */}
      <Seg from={[2.6, 1.5, 0.85]} to={[2.1, 1.72, 0.6]} r={0.07} color="#8d97a8" />
      {/* Sensor de temperatura rosqueado na galeria de agua do cabecote */}
      <Seg from={[-1.95, 0.5, 0.6]} to={[-3.25, 0.5, 0.9]} r={0.07} color="#8d97a8" />

      <Flow points={AIR_FLOW} color="#1d5fd8" count={14} speed={0.16} size={0.16} />
      <Flow points={EXH_PATH} color="#c62222" count={9} speed={0.2} />
      <Flow points={FUEL_PATH} color="#e08a1e" count={11} speed={0.1} size={0.07} />

      <Text position={[-6.35, 2.85, 0]} fontSize={0.26} color="#1d5fd8" anchorX="center">
        ar
      </Text>
      <Text position={[-9.6, 1.6, 0]} fontSize={0.18} color="#5b6779" anchorX="left">
        filtro de ar
      </Text>
      <Text position={[-9.8, 3.6, 0]} fontSize={0.17} color="#5b6779" anchorX="left">
        ar livre
      </Text>
      <Text position={[-9.65, 0.55, 0.35]} fontSize={0.18} color="#b03030" anchorX="center">
        +12 V
      </Text>
      <Text position={[-1.35, -4.75, 0]} fontSize={0.19} color="#5b6779" anchorX="left">
        tanque
      </Text>
      <Text position={[0.2, -4.05, 1.3]} fontSize={0.18} color="#5b6779" anchorX="left">
        roda dentada
      </Text>
      <Text position={[4.2, -5.5, 0]} fontSize={0.24} color="#c62222" anchorX="right">
        gases queimados
      </Text>
    </group>
  );
}

/** Uma peca do mapa: modelo 3D real, balao com o numero e area clicavel. */
function ItemNode({
  item,
  selected,
  onSelect,
}: {
  item: MapItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const Part = PART_MODELS[item.partId];
  const color = GROUP_META[item.group].color;
  const ring = useRef<THREE.Mesh>(null);
  const body = useRef<THREE.Group>(null);
  const guess = 0.5 + item.scale * 0.9;
  // Altura real da peca: o balao e o nome so encostam nela depois de medir.
  const [span, setSpan] = useState<[number, number]>([guess, -guess]);

  useEffect(() => {
    let alive = true;
    const measure = () => {
      const g = body.current;
      if (!alive || !g) return;
      const b = new THREE.Box3().setFromObject(g);
      if (!Number.isFinite(b.max.y) || !Number.isFinite(b.min.y)) return;
      const next: [number, number] = [b.max.y - item.pos[1], b.min.y - item.pos[1]];
      setSpan((p) =>
        Math.abs(p[0] - next[0]) < 0.02 && Math.abs(p[1] - next[1]) < 0.02 ? p : next,
      );
    };
    const raf = requestAnimationFrame(measure);
    const late = setTimeout(measure, 1500);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(late);
    };
  }, [item]);

  useFrame(({ clock }) => {
    if (ring.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.07;
      ring.current.scale.set(s, s, s);
    }
  });

  if (!Part) return null;

  const [bx, by] = item.badge ?? [0, span[0] + 0.45];
  const len = Math.hypot(bx, by) || 1;
  const ux = bx / len;
  const uy = by / len;
  const hit = Math.max(0.5, (span[0] - span[1]) * 0.6);
  // A peca e o balao do numero selecionam a mesma coisa.
  const pick = {
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onSelect();
    },
    onPointerOver: () => {
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      document.body.style.cursor = 'auto';
    },
  };

  return (
    <group position={item.pos}>
      <group ref={body} scale={item.scale} rotation={item.rot}>
        <Part />
      </group>

      <mesh {...pick}>
        <sphereGeometry args={[hit, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {selected && (
        <mesh ref={ring} position={[0, 0, 0.1]}>
          <torusGeometry args={[hit * 1.1, 0.035, 10, 44]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}

      {/* Linha de chamada ligando a peca ao balao, como em esquema impresso */}
      {len > 0.6 && (
        <Seg
          from={[ux * 0.3, uy * 0.3, 0.45]}
          to={[bx - ux * 0.3, by - uy * 0.3, 0.45]}
          r={0.018}
          color={color}
          metalness={0}
          roughness={1}
        />
      )}

      <mesh position={[bx, by, 0.5]}>
        <circleGeometry args={[0.23, 24]} />
        <meshBasicMaterial color={selected ? color : '#ffffff'} />
      </mesh>
      <mesh position={[bx, by, 0.51]}>
        <ringGeometry args={[0.23, 0.28, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Text
        position={[bx, by, 0.52]}
        fontSize={0.26}
        color={selected ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
      >
        {String(item.numero)}
      </Text>
      {/* Area clicavel do balao, na frente do numero */}
      <mesh position={[bx, by, 0.6]} {...pick}>
        <circleGeometry args={[0.34, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {selected && (
        <Text
          position={[0, span[1] - 0.35, 0.5]}
          fontSize={0.2}
          color="#1b2433"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.6}
          textAlign="center"
          outlineWidth={0.04}
          outlineColor={BG}
        >
          {item.namePt}
        </Text>
      )}
    </group>
  );
}

/**
 * Barramento CAN. Nao e uma peca: sao dois fios trancados com um resistor de
 * 120 ohm em cada ponta. OBD, lampada de anomalia e imobilizador entram aqui,
 * nao num fio proprio ate a ECU.
 */
function CanTrunk() {
  return (
    <group>
      {[-0.08, 0.08].map((d) => (
        <Seg
          key={d}
          from={[CAN_X + d, CAN_TOP, CAN_Z]}
          to={[CAN_X + d, CAN_BOTTOM, CAN_Z]}
          r={0.045}
          color={CAN_COLOR}
          metalness={0.1}
          roughness={0.9}
        />
      ))}
      {[CAN_TOP, CAN_BOTTOM].map((y) => (
        <mesh key={y} position={[CAN_X, y, CAN_Z]}>
          <boxGeometry args={[0.36, 0.2, 0.2]} />
          <meshStandardMaterial color={CAN_COLOR} metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      <Text
        position={[CAN_X + 0.2, CAN_TOP + 0.34, CAN_Z]}
        fontSize={0.19}
        color={CAN_COLOR}
        anchorX="left"
      >
        120 ohm
      </Text>
      <Text
        position={[CAN_X, CAN_BOTTOM - 0.34, CAN_Z]}
        fontSize={0.19}
        color={CAN_COLOR}
        anchorX="center"
      >
        120 ohm
      </Text>
      {/* Entrada do barramento na ECU */}
      <Seg
        from={[CAN_X, ECU_POS[1], CAN_Z]}
        to={[ECU_POS[0] + 0.6, ECU_POS[1], CAN_Z]}
        r={0.045}
        color={CAN_COLOR}
        metalness={0.1}
        roughness={0.9}
      />
    </group>
  );
}

/** Caminho do fio: sai da ECU (ou do barramento CAN), corre reto e entra na peca. */
function wirePath(it: MapItem): Vec3[] {
  const onCan = it.link === 'can';
  const z = onCan ? CAN_Z : WIRE_Z;
  const startY = onCan ? Math.min(CAN_TOP, Math.max(CAN_BOTTOM, it.pos[1])) : ECU_POS[1];
  const startX = onCan ? CAN_X : ECU_POS[0];
  return [
    [startX, startY, z],
    [it.pos[0], startY, z],
    [it.pos[0], it.pos[1], z],
    [it.pos[0], it.pos[1], it.pos[2] - 0.2],
  ];
}

/** Chicote: fios em angulo reto da ECU ate cada peca eletrica, como no esquema. */
function Harness({ items, selected }: { items: MapItem[]; selected: MapItem | null }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (const it of items) {
      if (!it.wired) continue;
      const path = wirePath(it);
      for (let i = 1; i < path.length; i += 1) {
        pts.push(new THREE.Vector3(...path[i - 1]), new THREE.Vector3(...path[i]));
      }
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [items]);

  useEffect(() => () => geo.dispose(), [geo]);

  const hot = selected?.wired ? wirePath(selected) : null;
  const hotColor = selected ? GROUP_META[selected.group].color : '#000000';

  return (
    <group>
      {items.some((i) => i.link === 'can') && <CanTrunk />}
      <lineSegments geometry={geo}>
        <lineBasicMaterial color="#8fa0b8" transparent opacity={0.45} />
      </lineSegments>
      {hot?.slice(1).map((p, i) => (
        <Seg key={i} from={hot[i]} to={p} r={0.035} color={hotColor} metalness={0.2} roughness={0.7} />
      ))}
    </group>
  );
}

/** Leva a camera ate a peca escolhida deslizando, sem mexer no zoom do aluno. */
function CameraRig({ item }: { item: MapItem | null }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as unknown as
    | { target: THREE.Vector3; update: () => void }
    | null;
  const anim = useRef(1);
  const offset = useRef(new THREE.Vector3(0, 0, OVERVIEW.dist));

  const look = useMemo(
    () =>
      item
        ? new THREE.Vector3(item.pos[0] + PAN_X, item.pos[1], 0)
        : new THREE.Vector3(OVERVIEW.x, OVERVIEW.y, 0),
    [item],
  );

  useEffect(() => {
    anim.current = 0;
    // guarda a distancia e o angulo atuais: o movimento so desliza, nunca da zoom
    if (controls) offset.current.copy(camera.position).sub(controls.target);
  }, [look, camera, controls]);

  useFrame((_, dt) => {
    if (anim.current >= 1 || !controls) return;
    anim.current = Math.min(1, anim.current + dt * 1.6);
    const k = 0.12;
    controls.target.lerp(look, k);
    camera.position.lerp(look.clone().add(offset.current), k);
    controls.update();
  });

  return null;
}

const rowBase: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  border: '1px solid transparent',
  borderRadius: 8,
  padding: '5px 8px',
  marginBottom: 3,
  cursor: 'pointer',
  background: 'transparent',
  color: '#334155',
  fontSize: 12,
  lineHeight: 1.35,
};

/** Lista numerada ao lado do desenho: clicou, a camera vai na peca e abre a explicacao. */
function Legend({
  items,
  selected,
  onSelect,
  onFocus,
}: {
  items: MapItem[];
  selected: MapItem | null;
  onSelect: (n: number | null) => void;
  onFocus: (n: number) => void;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected || !box.current) return;
    box.current
      .querySelector(`[data-n="${selected.numero}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selected]);

  return (
    <div
      ref={box}
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        bottom: 118,
        width: 150,
        overflowY: 'auto',
        padding: 10,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #ccd5e2',
        boxShadow: '0 6px 20px rgba(15,23,42,0.12)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 10.5, letterSpacing: 0.6, color: '#64748b', fontWeight: 700 }}>
          COMPONENTES ({items.length})
        </span>
        {selected && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            style={{
              border: '1px solid #ccd5e2',
              background: 'transparent',
              color: '#475569',
              borderRadius: 6,
              fontSize: 10.5,
              padding: '2px 7px',
              cursor: 'pointer',
            }}
          >
            ver tudo
          </button>
        )}
      </div>

      {items.map((it) => {
        const color = GROUP_META[it.group].color;
        const on = selected?.numero === it.numero;
        return (
          <div key={it.numero}>
            <button
              type="button"
              data-n={it.numero}
              onClick={() => onSelect(on ? null : it.numero)}
              style={{
                ...rowBase,
                border: `1px solid ${on ? color : 'transparent'}`,
                background: on ? `${color}14` : 'transparent',
              }}
            >
              <span style={{ display: 'flex', gap: 7, alignItems: 'baseline' }}>
                <span style={{ color, fontWeight: 800, minWidth: 17 }}>{it.numero}</span>
                <span style={{ color: on ? '#0f172a' : '#334155', fontWeight: on ? 700 : 500 }}>
                  {it.namePt}
                </span>
              </span>
            </button>
            {on && hasFocus(it.numero) && (
              <button
                type="button"
                data-focus={it.numero}
                onClick={() => onFocus(it.numero)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  width: '100%',
                  margin: '1px 0 6px',
                  padding: '6px 8px',
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#ffffff',
                  background: color,
                  border: `1px solid ${color}`,
                }}
              >
                <Eye size={13} /> Visualizar
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Cena MAPA DO SISTEMA: o esquema Motronic montado em 3D, com o motor em corte
 * mostrando pistao, valvulas, jato do injetor e faisca da vela. Clique num
 * numero (no desenho ou na lista) para a camera ir ate a peca.
 */
export function MotronicMapScene() {
  const [fs, setFs] = useState(false);
  const [filter, setFilter] = useState(0);
  const [showHarness, setShowHarness] = useState(1);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [focusNum, setFocusNum] = useState<number | null>(null);

  const active = FILTERS[filter];
  const visible = useMemo(
    () => (active === 'tudo' ? MOTRONIC_ITEMS : MOTRONIC_ITEMS.filter((i) => i.group === active)),
    [active],
  );
  const selected = useMemo(
    () => visible.find((i) => i.numero === selectedNum) ?? null,
    [visible, selectedNum],
  );

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <>
          <Choice
            label="Sistema"
            options={FILTER_LABELS}
            value={filter}
            color="#5b8def"
            onChange={(i) => {
              setFilter(i);
              setSelectedNum(null);
            }}
          />
          <Choice
            label="Chicote"
            options={['Oculto', 'Visivel']}
            value={showHarness}
            color="#f5d76e"
            onChange={setShowHarness}
          />
          <div style={{ marginTop: 4, fontSize: 11.5, color: '#7c8aa3' }}>
            Clique num numero (no desenho ou na lista) para a camera centralizar a peca sem mexer no
            zoom. Arraste para girar, role para aproximar.
          </div>
        </>
      }
    >
      <Canvas
        key={fs ? 'fs' : 'win'}
        camera={{ position: [OVERVIEW.x, OVERVIEW.y, OVERVIEW.dist], fov: 48 }}
        dpr={[1, 1.5]}
        onPointerMissed={() => setSelectedNum(null)}
      >
        <color attach="background" args={[BG]} />
        <ambientLight intensity={1.0} />
        <directionalLight position={[6, 8, 10]} intensity={1.0} />
        <directionalLight position={[-8, 3, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          <group>
            <Plumbing />
            <group scale={ENGINE_SCALE}>
              <EngineCutaway />
            </group>
            {showHarness === 1 && <Harness items={visible} selected={selected} />}
            {visible.map((item) => (
              <ItemNode
                key={item.numero}
                item={item}
                selected={item.numero === selectedNum}
                onSelect={() => setSelectedNum(item.numero)}
              />
            ))}
          </group>
        </Suspense>
        <CameraRig item={selected} />
        <OrbitControls makeDefault enablePan minDistance={2.5} maxDistance={22} />
      </Canvas>
      <Legend
        items={visible}
        selected={selected}
        onSelect={setSelectedNum}
        onFocus={setFocusNum}
      />
      {focusNum !== null && (
        <PartFocusView numero={focusNum} onClose={() => setFocusNum(null)} />
      )}
    </SceneShell>
  );
}
