/* eslint-disable react-refresh/only-export-components */
import { useMemo, useRef, type JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GolfPistonCatalogPart } from '../../features/courses/lessons/scenes/golf/GolfCylinder';
import {
  ADV_BASE,
  autoIgnition,
  busVolts,
  camRevs,
  CAT_LIGHTOFF_C,
  catEfficiency,
  catHeatOk,
  catLambda,
  catTempC,
  ckpAmplitude,
  ckpHall,
  ckpInductive,
  ckpRevs,
  ckpSquareAt,
  CKP_TEETH,
  ckpTurn,
  cmpPulse,
  cmpPulseAt,
  coolantHeat,
  coolantTemp,
  crankAmps,
  desulfActive,
  DPF_BURN_C,
  ectVolts,
  egrDuty,
  EGT_BOOST_C,
  EGT_ENRICH_C,
  EGT_POWER_C,
  egtBoost,
  egtTempC,
  FAN_ON_C,
  firingCylinder,
  flameFront,
  FLOAT_ARM,
  FLOAT_PIVOT_Y,
  floatAngle,
  fuelLevel,
  fuelReserve,
  fuelSurfaceY,
  gdiBoost,
  gdiMixture,
  gdiNeedle,
  gdiPhase,
  gdiPistonY,
  gdiSpark,
  gdiStratified,
  GROUND_LIMIT_V,
  groundDropV,
  heaterDuty,
  IGN_DWELL_X,
  IGN_SPARK_X,
  ignitionAdvance,
  injDeadTimeMs,
  injPulseMs,
  knockRing,
  knockShock,
  knockSignal,
  knockWindow,
  LAMBDA_MAX,
  LAMBDA_MIN,
  lambdaTempC,
  lambdaValue,
  LSF_LIGHT_C,
  lsfCatAged,
  lsfPostV,
  lsfSignalV,
  lsfTempC,
  narrowVolts,
  noxEff,
  noxLambda,
  noxPpm,
  noxStore,
  ntcOhm,
  oxidationEff,
  postLambdaV,
  preLambdaV,
  ptcOhm,
  pumpCurrent,
  pumpSpin,
  primaryAt,
  primaryCurrent,
  RAIL_BAR_MIN,
  RAIL_BAR_SPAN,
  railRealBar,
  railTargetBar,
  regenActive,
  regenCount,
  secondaryAt,
  secondaryKv,
  socLevel,
  sootLoad,
  sparkAdvance,
  sulfurLoad,
  sysPhase,
  throttleOpening,
  vvtAdvance,
} from '@/features/courses/lessons/scenes/mapPrimitives';
import {
  Camshaft,
  ConnRod,
  Crankcase,
  Crankshaft,
  CylinderBarrel,
  CylinderHead,
  ExhaustSystem,
  IntakeSystem,
  Piston,
  PoppetValve,
} from '@/features/courses/lessons/scenes/engineParts';

/**
 * Modelos 3D procedurais e genericos das pecas de injecao eletronica.
 * Sao didaticos e reconheciveis, sem reproduzir marca ou peca real especifica.
 * Cada funcao retorna um <group> centrado na origem, com escala ~2-3 unidades.
 */

const METAL = { color: '#b7c0cc', metalness: 0.85, roughness: 0.35 } as const;
const METAL_DARK = { color: '#7d8798', metalness: 0.8, roughness: 0.4 } as const;
const PLASTIC = { color: '#23272f', metalness: 0.2, roughness: 0.7 } as const;
const PLASTIC_GREY = { color: '#3a4152', metalness: 0.2, roughness: 0.7 } as const;
const BRASS = { color: '#b8912f', metalness: 0.8, roughness: 0.4 } as const;
const COPPER = { color: '#b5732e', metalness: 0.85, roughness: 0.4 } as const;
const CERAMIC = { color: '#e8e2d0', metalness: 0.05, roughness: 0.8 } as const;
const RUBBER = { color: '#1a1c22', metalness: 0.1, roughness: 0.9 } as const;
/** Corpo tubular vazado: fica meio transparente para dar para ver o que passa dentro. */
const CUTAWAY = { transparent: true, opacity: 0.42, depthWrite: false } as const;

/** Injetor de combustivel. */
function Injector(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.42, 1.7, 24]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Conector eletrico */}
      <mesh position={[0, 1.05, 0.15]}>
        <boxGeometry args={[0.55, 0.5, 0.55]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Aneis de vedacao */}
      {[-0.55, 0.55].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.09, 10, 24]} />
          <meshStandardMaterial {...RUBBER} />
        </mesh>
      ))}
      {/* Bico pulverizador */}
      <mesh position={[0, -1.05, 0]}>
        <coneGeometry args={[0.28, 0.5, 20]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
    </group>
  );
}

/** Bobina coil-on-plug em corte: nucleo, primario grosso, secundario fino e a vela embaixo. */
function IgnitionCoil(): JSX.Element {
  const prim = useRef<THREE.MeshStandardMaterial>(null);
  const sec = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (prim.current) prim.current.emissiveIntensity = 0.05 + 1.6 * primaryCurrent(t);
    if (sec.current) sec.current.emissiveIntensity = 0.05 + 2.4 * secondaryKv(t);
  });

  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 1.4, 20, 1, true]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Nucleo de ferro laminado */}
      {[-0.05, 0, 0.05].map((x) => (
        <mesh key={x} position={[x, 0.6, 0]}>
          <boxGeometry args={[0.04, 1.5, 0.14]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
      ))}
      {/* Primario: poucas voltas de fio grosso */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.18 + i * 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.035, 8, 20]} />
          <meshStandardMaterial ref={i === 0 ? prim : undefined} {...COPPER} emissive="#ffb35c" emissiveIntensity={0.05} />
        </mesh>
      ))}
      {/* Secundario: milhares de voltas de fio fino, aqui representadas por muitas espiras */}
      {Array.from({ length: 22 }).map((_, i) => (
        <mesh key={i} position={[0, 0.02 + i * 0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.012, 6, 18]} />
          <meshStandardMaterial
            ref={i === 0 ? sec : undefined}
            color="#c98a3a"
            metalness={0.7}
            roughness={0.35}
            emissive="#9fd8ff"
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
      {/* Conector de comando */}
      <mesh position={[0, 1.42, 0.1]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[-0.18, -0.06, 0.06, 0.18].map((x) => (
        <mesh key={x} position={[x, 1.71, 0.1]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Bota de borracha */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 0.5, 16]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Vela: hex, rosca e os dois eletrodos */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.4, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, -1.29, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.09, -1.32, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.1]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.03, -1.42, 0]}>
        <boxGeometry args={[0.16, 0.04, 0.1]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
    </group>
  );
}

/** Arco da faisca entre os eletrodos: so existe no instante do corte e na queima. */
function SparkGap(): JSX.Element {
  const g = useRef<THREE.Group>(null);
  const arc = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const v = secondaryKv(clock.getElapsedTime());
    if (g.current) g.current.visible = v > 0.02;
    if (arc.current) arc.current.emissiveIntensity = 0.5 + 4 * v;
    if (glow.current) {
      glow.current.scale.setScalar(0.4 + 2.2 * v);
      const m = glow.current.material as THREE.MeshStandardMaterial;
      m.opacity = 0.5 * Math.min(1, v * 2.2);
    }
  });

  return (
    <group ref={g}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.11, 6]} />
        <meshStandardMaterial ref={arc} color="#dff1ff" emissive="#8fd0ff" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshStandardMaterial color="#8fd0ff" emissive="#8fd0ff" emissiveIntensity={1.6} transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  );
}

const SCOPE_N = 90;

/** Osciloscopio da ignicao: corrente do primario em cima, tensao do secundario embaixo. */
function CoilScope(): JSX.Element {
  const cursor = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (cursor.current) cursor.current.position.x = -1.7 + gdiPhase(clock.getElapsedTime()) * 3.4;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.8, 2.4, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Janela do dwell */}
      <mesh
        position={[-1.7 + ((IGN_DWELL_X + IGN_SPARK_X) / 2) * 3.4, 0.15, 0.05]}
      >
        <boxGeometry args={[(IGN_SPARK_X - IGN_DWELL_X) * 3.4, 1.9, 0.02]} />
        <meshStandardMaterial color="#2f7f5a" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      {/* Instante do corte */}
      <mesh position={[-1.7 + IGN_SPARK_X * 3.4, 0.15, 0.06]}>
        <boxGeometry args={[0.03, 2.0, 0.02]} />
        <meshStandardMaterial color="#ff6a3c" emissive="#ff6a3c" emissiveIntensity={1.2} />
      </mesh>
      {[0.15, -0.85].map((y) => (
        <mesh key={y} position={[0, y, 0.07]}>
          <boxGeometry args={[3.5, 0.02, 0.03]} />
          <meshStandardMaterial color="#5c6674" />
        </mesh>
      ))}
      {Array.from({ length: SCOPE_N }).map((_, i) => {
        const p = (i + 0.5) / SCOPE_N;
        const x = -1.7 + p * 3.4;
        return (
          <group key={i}>
            <mesh position={[x, 0.15 + primaryAt(p) * 0.78, 0.09]}>
              <boxGeometry args={[0.034, 0.05, 0.03]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.1} />
            </mesh>
            <mesh position={[x, -0.85 + secondaryAt(p) * 0.62, 0.09]}>
              <boxGeometry args={[0.034, 0.05, 0.03]} />
              <meshStandardMaterial color="#f2a33c" emissive="#f2a33c" emissiveIntensity={1.1} />
            </mesh>
          </group>
        );
      })}
      <group ref={cursor}>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.03, 2.1, 0.03]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );
}

/** Avanco de ignicao em graus: sai mais cedo conforme a rotacao sobe. */
function IgnitionTimingGauge(): JSX.Element {
  const needle = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (needle.current) needle.current.rotation.z = (0.5 - ignitionAdvance(clock.getElapsedTime()) / 40) * Math.PI;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[2.6, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.45, 0.07]}>
        <torusGeometry args={[0.85, 0.035, 8, 48, Math.PI]} />
        <meshStandardMaterial color="#5c6674" />
      </mesh>
      {[0, 10, 20, 30, 40].map((deg) => {
        const a = (0.5 - deg / 40) * Math.PI;
        return (
          <mesh key={deg} position={[-0.85 * Math.sin(a), -0.45 + 0.85 * Math.cos(a), 0.08]}>
            <boxGeometry args={[0.06, 0.16, 0.03]} />
            <meshStandardMaterial color="#9aa4b2" emissive="#9aa4b2" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
      <group ref={needle} position={[0, -0.45, 0.12]}>
        <mesh position={[0, 0.39, 0]}>
          <boxGeometry args={[0.06, 0.78, 0.04]} />
          <meshStandardMaterial color="#8fd0ff" emissive="#8fd0ff" emissiveIntensity={1.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial color="#d5dae2" />
        </mesh>
      </group>
    </group>
  );
}

/** Corpo de borboleta eletronico: a borboleta abre e fecha de verdade. */
function ThrottleBody(): JSX.Element {
  const plate = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = plate.current;
    if (!g) return;
    // 0,12 rad e a fresta da marcha lenta; 1,45 rad e quase paralela ao fluxo.
    g.rotation.z = 0.12 + 1.33 * throttleOpening(state.clock.elapsedTime);
  });

  return (
    <group>
      {/* Furo por onde o ar passa */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.7, 0.7, 1.7, 32, 1, true]} />
        <meshStandardMaterial {...METAL} {...CUTAWAY} side={2} />
      </mesh>
      {/* Flange de cada boca, com os furos de parafuso */}
      {[-0.85, 0.85].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.98, 0.98, 0.14, 32]} />
            <meshStandardMaterial {...METAL_DARK} />
          </mesh>
          {[
            [0.72, 0.72],
            [-0.72, 0.72],
            [0.72, -0.72],
            [-0.72, -0.72],
          ].map(([y, z]) => (
            <mesh key={`${y},${z}`} position={[0, y, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.13, 0.13, 0.2, 12]} />
              <meshStandardMaterial {...METAL_DARK} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Eixo da borboleta, atravessando o furo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.9, 12]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Paleta: um pouco menor que o furo, senao nao fecharia */}
      <group ref={plate}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.66, 0.66, 0.045, 28]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      </group>
      {/* Motor eletrico, deitado ao lado do furo */}
      <mesh position={[0.1, -0.35, 0.95]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1.15, 18]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Mola que puxa a borboleta para a fresta de seguranca se faltar energia */}
      <group position={[0, 0, -0.75]}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[0, 0, -i * 0.09]}>
            <torusGeometry args={[0.16, 0.028, 6, 18]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        ))}
      </group>
      {/* Tampa das engrenagens, aberta: da para ver a reducao do motor ate o eixo */}
      <mesh position={[0, 0, 1.0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.2, 22]} />
        <meshStandardMaterial {...PLASTIC_GREY} {...CUTAWAY} side={2} />
      </mesh>
      {(
        [
          [0.1, -0.35, 0.16],
          [0.06, -0.14, 0.26],
          [0, 0, 0.2],
        ] as [number, number, number][]
      ).map(([x, y, r]) => (
        <mesh key={`${x},${y}`} position={[x, y, 0.98]}>
          <cylinderGeometry args={[r, r, 0.09, 20]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      {/* Os dois sensores de posicao da borboleta, um para cada leitura */}
      {(
        [
          [-0.2, '#0f8a46'],
          [0.2, '#7127c9'],
        ] as [number, string][]
      ).map(([x, c]) => (
        <mesh key={x} position={[x, 0.34, 1.14]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
      {/* Conector, embaixo */}
      <mesh position={[0.35, -0.95, 0.5]}>
        <boxGeometry args={[0.52, 0.3, 0.44]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0.2 + (i % 3) * 0.15, -1.14, 0.42 + Math.floor(i / 3) * 0.16]}>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 6]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

/** Sensor tipo bloco (MAP) com tomada de vacuo. */
function MapSensor({ pins = 3 }: { pins?: number } = {}): JSX.Element {
  const dia = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    // Mais pressao no coletor empurra o diafragma contra a camara de referencia.
    const k = throttleOpening(clock.getElapsedTime());
    if (dia.current) dia.current.position.y = -0.06 + 0.14 * k;
  });
  const pinX = pins === 4 ? [-0.21, -0.07, 0.07, 0.21] : [-0.18, 0, 0.18];
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.3, 1.0, 0.75]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Camara de referencia: vacuo selado de fabrica, o zero da escala */}
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[0.86, 0.32, 0.5]} />
        <meshStandardMaterial color="#1b2634" metalness={0.2} roughness={0.85} transparent opacity={0.55} />
      </mesh>
      {/* Diafragma de silicio com os resistores impressos em cima */}
      <group ref={dia} position={[0, -0.06, 0]}>
        <mesh>
          <boxGeometry args={[0.86, 0.06, 0.5]} />
          <meshStandardMaterial {...CERAMIC} />
        </mesh>
        {[-0.3, -0.1, 0.1, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.05, 0]}>
            <boxGeometry args={[0.1, 0.03, 0.3]} />
            <meshStandardMaterial {...COPPER} />
          </mesh>
        ))}
      </group>
      {/* Camara ligada no coletor pelo bico */}
      <mesh position={[0, -0.32, 0]}>
        <boxGeometry args={[0.86, 0.34, 0.5]} />
        <meshStandardMaterial color="#26405c" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.6, 16]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.035, 8, 20]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.66, 0.44, 0.5]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {pinX.map((x) => (
        <mesh key={x} position={[x, 1.0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Orelha de fixacao */}
      <mesh position={[0.85, -0.1, 0]}>
        <boxGeometry args={[0.5, 0.16, 0.4]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0.95, -0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.24, 12]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
    </group>
  );
}

/** TMAP: o mesmo MAP com o NTC de temperatura do ar no mesmo corpo, 4 vias. */
function TmapSensor(): JSX.Element {
  const bead = useRef<THREE.Mesh>(null);
  const cold = useRef(new THREE.Color('#3b82f6')).current;
  const hot = useRef(new THREE.Color('#f97316')).current;
  useFrame((state) => {
    const m = bead.current?.material as THREE.MeshStandardMaterial | undefined;
    if (!m) return;
    const k = (1 - Math.cos(state.clock.elapsedTime * 0.5)) / 2;
    m.color.copy(cold).lerp(hot, k);
    m.emissive.copy(m.color).multiplyScalar(0.45);
  });
  return (
    <group>
      <MapSensor pins={4} />
      <mesh position={[0.4, -0.75, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.66, 8]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      <mesh ref={bead} position={[0.4, -1.15, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.2} roughness={0.55} />
      </mesh>
    </group>
  );
}

const GAUGE_MAX_KPA = 120;
function kpaToX(kpa: number): number {
  return -1.5 + (3.0 * kpa) / GAUGE_MAX_KPA;
}

/** Escala de pressao ABSOLUTA: o ponteiro anda junto com a borboleta. */
function MapGauge(): JSX.Element {
  const needle = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const k = throttleOpening(clock.getElapsedTime());
    if (needle.current) needle.current.position.x = kpaToX(30 + 71 * k);
  });
  return (
    <group>
      <mesh>
        <boxGeometry args={[3.6, 1.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.2, 0.07]}>
        <boxGeometry args={[3.0, 0.16, 0.04]} />
        <meshStandardMaterial color="#2a3140" />
      </mesh>
      {/* Faixa acima da atmosferica: so motor turbo chega la */}
      <mesh position={[(kpaToX(101) + kpaToX(GAUGE_MAX_KPA)) / 2, -0.2, 0.09]}>
        <boxGeometry args={[kpaToX(GAUGE_MAX_KPA) - kpaToX(101), 0.16, 0.04]} />
        <meshStandardMaterial color="#e08a1e" emissive="#e08a1e" emissiveIntensity={0.35} />
      </mesh>
      {[0, 30, 101].map((kpa) => (
        <mesh key={kpa} position={[kpaToX(kpa), -0.2, 0.1]}>
          <boxGeometry args={[0.04, 0.36, 0.03]} />
          <meshStandardMaterial color="#9aa4b2" />
        </mesh>
      ))}
      <group ref={needle} position={[kpaToX(30), 0, 0]}>
        <mesh position={[0, 0.18, 0.12]}>
          <boxGeometry args={[0.05, 0.62, 0.03]} />
          <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.2, 0.14]}>
          <sphereGeometry args={[0.11, 16, 12]} />
          <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/** Sensor de temperatura NTC (IAT/ECT). */
const ECT_COLD_COLOR = new THREE.Color('#3f6b9e');
const ECT_HOT_COLOR = new THREE.Color('#c0392b');

/** Sensor de temperatura (ECT): NTC em corte, mudando de cor com o liquido. */
function TempSensor(): JSX.Element {
  const bead = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const u = Math.min(1, Math.max(0, coolantHeat(clock.getElapsedTime())));
    if (bead.current) {
      bead.current.color.copy(ECT_COLD_COLOR).lerp(ECT_HOT_COLOR, u);
      bead.current.emissive.copy(bead.current.color);
      bead.current.emissiveIntensity = 0.3 + 1.7 * u;
    }
  });

  return (
    <group>
      {/* Conector 2 vias */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.4]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {[-0.12, 0.12].map((x) => (
        <mesh key={x} position={[x, 0.82, 0]}>
          <boxGeometry args={[0.06, 0.26, 0.06]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Hex */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 6]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      {/* Rosca em corte, para o par de fios aparecer */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 16, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, -0.05, 0]}>
          <boxGeometry args={[0.03, 0.9, 0.03]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Ponta sensora */}
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.16, 0.3, 16, 1, true]} />
        <meshStandardMaterial {...BRASS} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* O NTC propriamente dito */}
      <mesh position={[0, -0.62, 0]}>
        <sphereGeometry args={[0.09, 14, 10]} />
        <meshStandardMaterial ref={bead} color="#3f6b9e" emissive="#3f6b9e" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/** Galeria de agua do cabecote em corte: o liquido esquenta e muda de cor. */
function WaterJacket(): JSX.Element {
  const liquid = useRef<THREE.MeshStandardMaterial>(null);
  const drops = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const u = Math.min(1, Math.max(0, coolantHeat(t)));
    if (liquid.current) {
      liquid.current.color.copy(ECT_COLD_COLOR).lerp(ECT_HOT_COLOR, u);
      liquid.current.emissive.copy(liquid.current.color);
      liquid.current.emissiveIntensity = 0.15 + 0.7 * u;
    }
    if (drops.current) drops.current.position.x = ((t * 0.9) % 1) - 0.5;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[5.2, 1.8, 2.2]} />
        <meshStandardMaterial color="#8fb6d8" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh>
        <boxGeometry args={[5.0, 1.5, 2.0]} />
        <meshStandardMaterial
          ref={liquid}
          color="#3f6b9e"
          emissive="#3f6b9e"
          emissiveIntensity={0.15}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>
      <group ref={drops}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[-2.1 + i * 0.84, -0.35, 0.6]}>
            <sphereGeometry args={[0.09, 10, 8]} />
            <meshStandardMaterial color="#cfe4f5" emissive="#cfe4f5" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const NTC_N = 72;
const ntcCurveX = (tempC: number): number => -1.7 + (tempC / 120) * 3.4;
const ntcCurveY = (ohm: number): number => -0.95 + ((Math.log10(ohm) - 2) / 2) * 1.9;

/** Curva do NTC: resistencia contra temperatura, com o cursor andando enquanto o motor esquenta. */
function NtcCurve(): JSX.Element {
  const cursor = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const temp = coolantTemp(clock.getElapsedTime());
    if (cursor.current) cursor.current.position.set(ntcCurveX(temp), ntcCurveY(ntcOhm(temp)), 0.14);
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.0, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -1.05, 0.06]}>
        <boxGeometry args={[3.5, 0.03, 0.03]} />
        <meshStandardMaterial color="#5c6674" />
      </mesh>
      <mesh position={[-1.75, 0, 0.06]}>
        <boxGeometry args={[0.03, 2.2, 0.03]} />
        <meshStandardMaterial color="#5c6674" />
      </mesh>
      {Array.from({ length: NTC_N }).map((_, i) => {
        const temp = (i / (NTC_N - 1)) * 120;
        return (
          <mesh key={i} position={[ntcCurveX(temp), ntcCurveY(ntcOhm(temp)), 0.09]}>
            <boxGeometry args={[0.05, 0.05, 0.03]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.1} />
          </mesh>
        );
      })}
      {/* Os dois pontos que vale decorar */}
      {[25, 80].map((temp) => (
        <mesh key={temp} position={[ntcCurveX(temp), ntcCurveY(ntcOhm(temp)), 0.12]}>
          <sphereGeometry args={[0.1, 12, 10]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.4} />
        </mesh>
      ))}
      <mesh ref={cursor}>
        <sphereGeometry args={[0.12, 14, 10]} />
        <meshStandardMaterial color="#ff6a3c" emissive="#ff6a3c" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

/** Divisor de tensao: 5 V da ECU, resistor fixo em cima e o NTC embaixo puxando o ponto do meio. */
function DividerPanel(): JSX.Element {
  const ntc = useRef<THREE.MeshStandardMaterial>(null);
  const bar = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const u = Math.min(1, Math.max(0, coolantHeat(t)));
    if (ntc.current) {
      ntc.current.color.copy(ECT_COLD_COLOR).lerp(ECT_HOT_COLOR, u);
      ntc.current.emissive.copy(ntc.current.color);
      ntc.current.emissiveIntensity = 0.3 + 1.5 * u;
    }
    if (bar.current) {
      const h = Math.max(0.05, (ectVolts(coolantTemp(t)) / 5) * 1.9);
      bar.current.scale.y = h;
      bar.current.position.y = -0.85 + h / 2;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Trilho de 5 V em cima, terra embaixo */}
      <mesh position={[-0.5, 1.05, 0.06]}>
        <boxGeometry args={[1.8, 0.07, 0.04]} />
        <meshStandardMaterial color="#b03030" emissive="#b03030" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-0.5, -0.85, 0.06]}>
        <boxGeometry args={[1.8, 0.07, 0.04]} />
        <meshStandardMaterial color="#8a93a3" />
      </mesh>
      <mesh position={[-0.5, 0.1, 0.05]}>
        <boxGeometry args={[0.05, 1.9, 0.03]} />
        <meshStandardMaterial color="#5c6674" />
      </mesh>
      {/* Resistor fixo da ECU */}
      <mesh position={[-0.5, 0.62, 0.08]}>
        <boxGeometry args={[0.34, 0.55, 0.14]} />
        <meshStandardMaterial color="#c9a227" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* O NTC, do lado de fora da ECU */}
      <mesh position={[-0.5, -0.42, 0.08]}>
        <boxGeometry args={[0.34, 0.55, 0.14]} />
        <meshStandardMaterial ref={ntc} color="#3f6b9e" emissive="#3f6b9e" emissiveIntensity={0.3} />
      </mesh>
      {/* Ponto de leitura no meio */}
      <mesh position={[-0.5, 0.1, 0.12]}>
        <sphereGeometry args={[0.11, 12, 10]} />
        <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0.28, 0.1, 0.06]}>
        <boxGeometry args={[1.55, 0.05, 0.03]} />
        <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={0.7} />
      </mesh>
      {/* Barra da tensao lida */}
      <mesh position={[1.05, 0.1, 0.05]}>
        <boxGeometry args={[0.36, 1.95, 0.03]} />
        <meshStandardMaterial color="#2b3240" />
      </mesh>
      <mesh ref={bar} position={[1.05, -0.4, 0.08]}>
        <boxGeometry args={[0.28, 1, 0.04]} />
        <meshStandardMaterial color="#f2a33c" emissive="#f2a33c" emissiveIntensity={1.3} />
      </mesh>
    </group>
  );
}

/** Ventilador do radiador: so gira depois que o liquido passa da temperatura de acionamento. */
function RadFan(): JSX.Element {
  const blades = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, delta) => {
    const on = coolantTemp(clock.getElapsedTime()) > FAN_ON_C;
    if (blades.current && on) blades.current.rotation.z -= delta * 9;
    if (lamp.current) lamp.current.emissiveIntensity = on ? 1.8 : 0.04;
  });

  return (
    <group>
      <mesh>
        <torusGeometry args={[0.95, 0.1, 10, 36]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.72, Math.sin(a) * 0.72, -0.16]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.5, 0.09, 0.12]} />
            <meshStandardMaterial {...PLASTIC_GREY} />
          </mesh>
        );
      })}
      <group ref={blades}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.48, Math.sin(a) * 0.48, 0]}
              rotation={[0.5, 0, a]}
            >
              <boxGeometry args={[0.72, 0.3, 0.05]} />
              <meshStandardMaterial {...PLASTIC} />
            </mesh>
          );
        })}
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.32, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, -1.02, 0]}>
        <boxGeometry args={[0.32, 0.3, 0.32]} />
        <meshStandardMaterial ref={lamp} {...PLASTIC_GREY} emissive="#3ddc84" emissiveIntensity={0.04} />
      </mesh>
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, -1.25, 0]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

/** Ponteiro de temperatura do painel: quem manda nele costuma ser outro sensor, de um fio so. */
function TempGaugeCluster(): JSX.Element {
  const needle = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const temp = coolantTemp(clock.getElapsedTime());
    const u = Math.min(1, Math.max(0, (temp - 40) / 80));
    if (needle.current) needle.current.rotation.z = (0.5 - u) * Math.PI;
    if (lamp.current) lamp.current.emissiveIntensity = temp > 95 ? 1.8 : 0.04;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[2.4, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.45, 0.07]}>
        <torusGeometry args={[0.85, 0.035, 8, 48, Math.PI]} />
        <meshStandardMaterial color="#5c6674" />
      </mesh>
      {[0, 0.5, 1].map((v) => {
        const a = (0.5 - v) * Math.PI;
        return (
          <mesh key={v} position={[-0.85 * Math.sin(a), -0.45 + 0.85 * Math.cos(a), 0.08]}>
            <boxGeometry args={[0.06, 0.16, 0.03]} />
            <meshStandardMaterial color={v === 1 ? '#e05a44' : '#9aa4b2'} emissive={v === 1 ? '#e05a44' : '#9aa4b2'} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
      <group ref={needle} position={[0, -0.45, 0.12]}>
        <mesh position={[0, 0.39, 0]}>
          <boxGeometry args={[0.06, 0.78, 0.04]} />
          <meshStandardMaterial color="#ff6a3c" emissive="#ff6a3c" emissiveIntensity={1.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial color="#d5dae2" />
        </mesh>
      </group>
      <mesh position={[0.9, 0.6, 0.1]}>
        <sphereGeometry args={[0.12, 14, 10]} />
        <meshStandardMaterial ref={lamp} color="#e05a44" emissive="#e05a44" emissiveIntensity={0.04} />
      </mesh>
    </group>
  );
}

/** Sonda lambda banda estreita de 4 fios: 2 do aquecedor, sinal e massa. */
function LambdaSensor(): JSX.Element {
  // Padrao Bosch: preto sinal, cinza terra de sinal, os dois brancos do aquecedor.
  const wireColors = ['#111', '#8a8f98', '#e8e8e8', '#e8e8e8'];
  const elec = useRef<THREE.MeshStandardMaterial>(null);
  const heat = useRef<THREE.MeshStandardMaterial>(null);
  const rich = useMemo(() => new THREE.Color('#c0392b'), []);
  const lean = useMemo(() => new THREE.Color('#3f6b9e'), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (elec.current) {
      const u = Math.max(0, Math.min(1, (0.9 - lsfSignalV(t)) / 0.8));
      elec.current.color.copy(rich).lerp(lean, u);
      elec.current.emissive.copy(elec.current.color);
    }
    if (heat.current) heat.current.emissiveIntensity = 0.05 + 2.4 * Math.min(1, lsfTempC(t) / 750);
  });

  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.35, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.5, 16, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Dedo de zirconia: gas de escape por fora, ar do ambiente por dentro */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[0.18, 0.4, 16, 1, true]} />
        <meshStandardMaterial {...CERAMIC} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.34, 16, 1, true]} />
        <meshStandardMaterial {...CERAMIC} side={THREE.DoubleSide} />
      </mesh>
      {/* Eletrodo do lado do escape: muda de cor entre rico e pobre */}
      <mesh position={[0, -0.5, 0.01]}>
        <coneGeometry args={[0.195, 0.42, 16, 1, true]} />
        <meshStandardMaterial
          ref={elec}
          color="#c0392b"
          emissive="#c0392b"
          emissiveIntensity={0.8}
          transparent
          opacity={0.55}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Coluna de ar de referencia: ela sobe pelo proprio cabo */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 1.7, 10]} />
        <meshStandardMaterial color="#8ecae6" emissive="#8ecae6" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      {/* Resistencia de aquecimento por dentro da ceramica */}
      <mesh position={[0.075, -0.2, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.85, 8]} />
        <meshStandardMaterial ref={heat} color="#7a4a20" emissive="#ff7a1a" emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 0.4, 16, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {wireColors.map((c, i) => (
        <mesh key={i} position={[(i - 1.5) * 0.09, 1.2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial color={c} metalness={0.2} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

const STEP_N = 64;
const stepX = (lam: number): number => -1.8 + ((lam - LAMBDA_MIN) / (LAMBDA_MAX - LAMBDA_MIN)) * 3.6;
const stepY = (v: number): number => -1.15 + v * 2.1;

/** A curva em degrau da zirconia contra a rampa linear da banda larga. */
function StepCurvePanel(): JSX.Element {
  const cursor = useRef<THREE.Mesh>(null);

  const step = useMemo(
    () =>
      Array.from({ length: STEP_N }).map((_, i) => {
        const lam = LAMBDA_MIN + ((LAMBDA_MAX - LAMBDA_MIN) * i) / (STEP_N - 1);
        return { x: stepX(lam), y: stepY(narrowVolts(lam)) };
      }),
    [],
  );
  const wide = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const lam = LAMBDA_MIN + ((LAMBDA_MAX - LAMBDA_MIN) * i) / 27;
        return { x: stepX(lam), y: stepY(0.05 + ((lam - LAMBDA_MIN) / (LAMBDA_MAX - LAMBDA_MIN)) * 0.9) };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!cursor.current) return;
    const lam = lambdaValue(clock.getElapsedTime());
    cursor.current.position.set(stepX(lam), stepY(narrowVolts(lam)), 0.15);
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.0, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* 0,45 V e lambda 1: e nesse cruzamento que tudo acontece */}
      <mesh position={[0, stepY(0.45), 0.05]}>
        <boxGeometry args={[3.6, 0.03, 0.02]} />
        <meshStandardMaterial color="#e05a44" emissive="#e05a44" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[stepX(1), 0, 0.05]}>
        <boxGeometry args={[0.03, 2.4, 0.02]} />
        <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.7} />
      </mesh>
      {wide.map((d, i) => (
        <mesh key={`w${i}`} position={[d.x, d.y, 0.08]}>
          <boxGeometry args={[0.05, 0.05, 0.03]} />
          <meshStandardMaterial color="#4a5568" emissive="#4a5568" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {step.map((d, i) => (
        <mesh key={`s${i}`} position={[d.x, d.y, 0.1]}>
          <boxGeometry args={[0.06, 0.06, 0.03]} />
          <meshStandardMaterial color="#e0a44a" emissive="#e0a44a" emissiveIntensity={1.3} />
        </mesh>
      ))}
      <mesh ref={cursor} position={[0, 0, 0.15]}>
        <sphereGeometry args={[0.11, 14, 12]} />
        <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

const VERDICT_N = 56;

/** Os dois desenhos lado a lado e o veredito que a ECU tira deles. */
function CatVerdictPanel(): JSX.Element {
  const pre = useRef<(THREE.Mesh | null)[]>([]);
  const post = useRef<(THREE.Mesh | null)[]>([]);
  const ok = useRef<THREE.MeshStandardMaterial>(null);
  const bad = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < VERDICT_N; i += 1) {
      const back = (1 - i / (VERDICT_N - 1)) * 7;
      const a = pre.current[i];
      if (a) a.position.y = 0.75 + (preLambdaV(t - back) - 0.5) * 1.1;
      const b = post.current[i];
      if (b) b.position.y = -0.55 + (lsfPostV(t - back) - 0.5) * 1.1;
    }
    const aged = lsfCatAged(t);
    if (ok.current) ok.current.emissiveIntensity = aged < 0.35 ? 1.8 : 0.04;
    if (bad.current) bad.current.emissiveIntensity = aged > 0.65 ? 1.8 : 0.04;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.4, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {[0.75, -0.55].map((y) => (
        <mesh key={y} position={[0, y, 0.05]}>
          <boxGeometry args={[4.0, 0.02, 0.02]} />
          <meshStandardMaterial color="#3a4453" />
        </mesh>
      ))}
      {Array.from({ length: VERDICT_N }).map((_, i) => (
        <mesh
          key={`a${i}`}
          ref={(m) => {
            pre.current[i] = m;
          }}
          position={[-1.95 + (i / (VERDICT_N - 1)) * 3.9, 0.75, 0.1]}
        >
          <boxGeometry args={[0.055, 0.055, 0.03]} />
          <meshStandardMaterial color="#e0a44a" emissive="#e0a44a" emissiveIntensity={1.3} />
        </mesh>
      ))}
      {Array.from({ length: VERDICT_N }).map((_, i) => (
        <mesh
          key={`b${i}`}
          ref={(m) => {
            post.current[i] = m;
          }}
          position={[-1.95 + (i / (VERDICT_N - 1)) * 3.9, -0.55, 0.1]}
        >
          <boxGeometry args={[0.055, 0.055, 0.03]} />
          <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={1.3} />
        </mesh>
      ))}
      <mesh position={[-0.45, -1.15, 0.09]}>
        <sphereGeometry args={[0.15, 14, 12]} />
        <meshStandardMaterial ref={ok} color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.04} />
      </mesh>
      <mesh position={[0.45, -1.15, 0.09]}>
        <sphereGeometry args={[0.15, 14, 12]} />
        <meshStandardMaterial ref={bad} color="#e05a44" emissive="#e05a44" emissiveIntensity={0.04} />
      </mesh>
    </group>
  );
}

const HEAT_N = 40;

/** Enquanto a ceramica esta fria o sinal fica preso na referencia da ECU. */
function LsfHeaterPanel(): JSX.Element {
  const bar = useRef<THREE.Mesh>(null);
  const dots = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (bar.current) {
      const h = Math.max(0.05, Math.min(1, lsfTempC(t) / 800) * 1.9);
      bar.current.scale.y = h;
      bar.current.position.y = -1.05 + h / 2;
    }
    for (let i = 0; i < HEAT_N; i += 1) {
      const m = dots.current[i];
      if (!m) continue;
      const back = (1 - i / (HEAT_N - 1)) * 9;
      m.position.y = -0.1 + (lsfSignalV(t - back) - 0.45) * 2.2;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.2, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[-1.15, -0.1, 0.05]}>
        <boxGeometry args={[0.42, 1.9, 0.03]} />
        <meshStandardMaterial color="#1c232e" roughness={1} />
      </mesh>
      <mesh ref={bar} position={[-1.15, -1.05, 0.09]}>
        <boxGeometry args={[0.3, 1, 0.05]} />
        <meshStandardMaterial color="#ff7a1a" emissive="#ff7a1a" emissiveIntensity={1.2} />
      </mesh>
      {/* Abaixo desta linha a zirconia nao gera tensao nenhuma */}
      <mesh position={[-1.15, -1.05 + (LSF_LIGHT_C / 800) * 1.9, 0.12]}>
        <boxGeometry args={[0.6, 0.04, 0.03]} />
        <meshStandardMaterial color="#e05a44" emissive="#e05a44" emissiveIntensity={1.3} />
      </mesh>
      <mesh position={[0.45, -0.1, 0.05]}>
        <boxGeometry args={[2.0, 0.03, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      {Array.from({ length: HEAT_N }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            dots.current[i] = m;
          }}
          position={[-0.5 + (i / (HEAT_N - 1)) * 1.9, -0.1, 0.1]}
        >
          <boxGeometry args={[0.055, 0.055, 0.03]} />
          <meshStandardMaterial color="#e0a44a" emissive="#e0a44a" emissiveIntensity={1.3} />
        </mesh>
      ))}
    </group>
  );
}

const LSF_ARRANGEMENTS: string[][] = [
  ['#111'],
  ['#111', '#8a8f98'],
  ['#111', '#e8e8e8', '#e8e8e8'],
  ['#111', '#8a8f98', '#e8e8e8', '#e8e8e8'],
  ['#111', '#8a8f98', '#e8e8e8', '#e8e8e8', '#0f8a46'],
];

/** De 1 a 5 fios, nas cores do padrao Bosch. O de 4 e o desta cena. */
function LsfWiringPanel(): JSX.Element {
  return (
    <group>
      <mesh>
        <boxGeometry args={[4.6, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {LSF_ARRANGEMENTS.map((colors, i) => (
        <group key={i} position={[-1.8 + i * 0.9, 0, 0.06]}>
          {i === 3 && (
            <mesh position={[0, 0.15, -0.02]}>
              <boxGeometry args={[0.78, 2.3, 0.02]} />
              <meshStandardMaterial color="#1d3448" emissive="#38bdf8" emissiveIntensity={0.35} />
            </mesh>
          )}
          <mesh position={[0, -0.85, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.3, 6]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.34, 0.28, 0.2]} />
            <meshStandardMaterial {...PLASTIC_GREY} />
          </mesh>
          {colors.map((c, k) => (
            <mesh key={k} position={[(k - (colors.length - 1) / 2) * 0.115, 0.35, 0.02]}>
              <boxGeometry args={[0.07, 1.4, 0.05]} />
              <meshStandardMaterial color={c} metalness={0.2} roughness={0.8} />
            </mesh>
          ))}
          {/* Um tracinho por fio, para dar para contar de longe */}
          {colors.map((c, k) => (
            <mesh key={`m${k}`} position={[(k - (colors.length - 1) / 2) * 0.115, 1.2, 0.04]}>
              <boxGeometry args={[0.08, 0.08, 0.04]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}


/** Sensor de detonacao em corte: cristal piezo, massa sismica e o parafuso que aperta tudo. */
function KnockSensor(): JSX.Element {
  const mass = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const v = knockSignal(clock.getElapsedTime());
    // O curso real e microscopico; aqui vai exagerado so para dar para ver.
    if (mass.current) mass.current.position.y = 0.07 + 0.05 * v;
    if (crystal.current) crystal.current.emissiveIntensity = 0.05 + 1.6 * Math.abs(v);
  });

  return (
    <group>
      {/* Carcaca de plastico em corte */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.56, 28, 1, true]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Base de aco: e esta face que tem que encostar no bloco limpo */}
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.12, 28]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Anel piezoeletrico: acende conforme a vibracao que chega nele */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.1, 28]} />
        <meshStandardMaterial {...CERAMIC} emissive="#ffd36b" emissiveIntensity={0.05} ref={crystal} />
      </mesh>
      {/* Massa sismica: o peso que aperta o cristal a cada solavanco do bloco */}
      <group ref={mass} position={[0, 0.07, 0]}>
        <mesh>
          <cylinderGeometry args={[0.46, 0.46, 0.24, 28]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
      </group>
      {/* Prato de mola que pre-carrega a massa */}
      <mesh position={[0, 0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.035, 10, 24]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Bucha central metalica: o furo por onde passa o parafuso */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.76, 20, 1, true]} />
        <meshStandardMaterial {...METAL} side={THREE.DoubleSide} />
      </mesh>
      {/* Parafuso: nao leva arruela, e o torque dele e que faz o sensor escutar */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.15, 16]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.18, 6]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {/* Saida do cabo, com o pescoco de borracha */}
      <mesh position={[0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.12, 0.24, 12]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Cabo blindado */}
      <mesh position={[1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.42, 10]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Conector de 2 vias: e aqui que se mede o sinal do cristal */}
      <mesh position={[1.45, 0, 0]}>
        <boxGeometry args={[0.44, 0.34, 0.26]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Trava do conector */}
      <mesh position={[1.45, 0, -0.16]}>
        <boxGeometry args={[0.22, 0.08, 0.1]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[0.09, -0.09].map((y) => (
        <mesh key={y} position={[1.72, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.22, 8]} />
          <meshStandardMaterial {...COPPER} />
        </mesh>
      ))}
    </group>
  );
}

/** Sensor de rotacao indutivo em corte: ima, nucleo de ferro e a bobina que gera o sinal. */
function CkpSensor(): JSX.Element {
  const coil = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (coil.current) coil.current.emissiveIntensity = 0.05 + 1.3 * Math.abs(ckpInductive(clock.getElapsedTime()));
  });
  return (
    <group>
      {/* Corpo em corte */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.0, 20, 1, true]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Ima permanente */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.34, 16]} />
        <meshStandardMaterial color="#a8342f" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Nucleo de ferro que leva o campo ate a ponta */}
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 1.05, 16]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {/* Bobina: e ela que gera a tensao sozinha, sem alimentacao nenhuma */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 20, 1, true]} />
        <meshStandardMaterial
          {...COPPER}
          emissive="#ffb35c"
          emissiveIntensity={0.05}
          side={THREE.DoubleSide}
          ref={coil}
        />
      </mesh>
      {/* Ponta que olha para a roda */}
      <mesh position={[0, -0.53, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.24, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Flange de fixacao */}
      <mesh position={[0.35, 0.35, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.4]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Conector de 2 vias: so bobina mais e bobina menos */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[0.11, -0.11].map((x) => (
        <mesh key={x} position={[x, 1.15, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

/** A variante de efeito Hall: alimentacao, terra e sinal em onda quadrada. */
function CkpHallSensor(): JSX.Element {
  const chip = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (chip.current) chip.current.emissiveIntensity = ckpHall(clock.getElapsedTime()) > 0 ? 1.5 : 0.05;
  });
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.44, 1.0, 0.32]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Flange com o furo do parafuso */}
      <mesh position={[0.42, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.24, 0.28]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0.55, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.3, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Ima de polarizacao atras do chip */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.22, 0.18, 0.16]} />
        <meshStandardMaterial color="#a8342f" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Cabeca sensora */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.34, 0.3, 0.24]} />
        <meshStandardMaterial {...PLASTIC_GREY} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* O circuito integrado Hall: acende quando o dente esta na frente dele */}
      <mesh position={[0, -0.52, 0.02]}>
        <boxGeometry args={[0.18, 0.12, 0.12]} />
        <meshStandardMaterial color="#1d2430" emissive="#4ade80" emissiveIntensity={0.05} ref={chip} />
      </mesh>
      <mesh position={[0, -0.66, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.22]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Conector de 3 vias */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[-0.15, 0, 0.15].map((x) => (
        <mesh key={x} position={[x, 1.15, 0]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

const CKP_SLOT = 3.0 / CKP_TEETH;

/** Onde cada dente cai no painel. A falha fica no meio, que e onde o olho procura. */
function ckpSlotX(i: number): number {
  return -1.5 + (((i + 30) % CKP_TEETH) + 0.5) * CKP_SLOT;
}

/**
 * Uma volta inteira do sinal, com a falha no centro e um cursor andando junto com
 * a roda. No indutivo a altura cresce com a rotacao; no Hall ela nao muda.
 */
function CkpTrace({ hall }: { hall: boolean }): JSX.Element {
  const pulses = useRef<THREE.Group>(null);
  const cursor = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulses.current) pulses.current.scale.y = hall ? 1 : ckpAmplitude(t);
    if (cursor.current) {
      const p = ckpTurn(t) * CKP_TEETH;
      cursor.current.position.x = -1.5 + (((p + 30) % CKP_TEETH) + 0.5) * CKP_SLOT;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.55, 0.07]}>
        <boxGeometry args={[3.1, 0.03, 0.04]} />
        <meshStandardMaterial color="#3a4152" />
      </mesh>
      {/* Marca da falha: e ela que a ECU usa para saber onde o virabrequim esta */}
      <mesh position={[ckpSlotX(0) + CKP_SLOT / 2, 0.05, 0.05]}>
        <boxGeometry args={[CKP_SLOT * 2, 1.5, 0.02]} />
        <meshStandardMaterial color="#ff6a3c" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <group ref={pulses} position={[0, -0.55, 0.09]}>
        {Array.from({ length: CKP_TEETH }).map((_, i) =>
          i === 0 || i === 1 ? null : (
            <mesh key={i} position={[ckpSlotX(i), hall ? 0.36 : 0.45, 0]}>
              <boxGeometry args={[hall ? CKP_SLOT * 0.55 : 0.026, hall ? 0.72 : 0.9, 0.04]} />
              <meshStandardMaterial
                color={hall ? '#4ade80' : '#38bdf8'}
                emissive={hall ? '#4ade80' : '#38bdf8'}
                emissiveIntensity={0.9}
              />
            </mesh>
          ),
        )}
      </group>
      <group ref={cursor}>
        <mesh position={[0, 0.15, 0.12]}>
          <boxGeometry args={[0.03, 1.6, 0.03]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
}

function CkpTraceInductive(): JSX.Element {
  return <CkpTrace hall={false} />;
}

function CkpTraceHall(): JSX.Element {
  return <CkpTrace hall />;
}

/** Sensor de posicao da borboleta (rotativo). */
function TpsSensor(): JSX.Element {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 24]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.5, 0.45, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.45]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** ECU: caixa de aluminio com conector multivias e aletas. */
function Ecu(): JSX.Element {
  return (
    <group>
      <mesh>
        <boxGeometry args={[2.0, 1.1, 1.4]} />
        <meshStandardMaterial color="#9aa4b2" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Aletas */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.6, 0]}>
          <boxGeometry args={[0.08, 0.12, 1.3]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      {/* Conector multivias nos dois lados: o chicote pode chegar por qualquer um */}
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh position={[1.05 * s, 0, 0]}>
            <boxGeometry args={[0.25, 0.8, 1.1]} />
            <meshStandardMaterial {...PLASTIC} />
          </mesh>
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => (
              <mesh key={`${r}-${c}`} position={[1.2 * s, 0.28 - r * 0.14, 0.45 - c * 0.13]}>
                <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
                <meshStandardMaterial {...COPPER} />
              </mesh>
            )),
          )}
        </group>
      ))}
    </group>
  );
}

/**
 * Chicote: capa corrugada fechada no percurso e o leque de fios so no ponto de
 * saida, que e como ele aparece de verdade no carro.
 */
function WiringHarness(): JSX.Element {
  const rings = Array.from({ length: 15 }, (_, i) => -2.15 + i * 0.21);
  const fan = Array.from({ length: 10 }, (_, i) => ({
    a: -0.42 + i * 0.093,
    z: ((i % 3) - 1) * 0.13,
  }));
  return (
    <group>
      {/* Tronco */}
      <mesh position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 3.1, 20]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {rings.map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.2, 0.035, 8, 20]} />
          <meshStandardMaterial color="#2b2f38" metalness={0.1} roughness={0.85} />
        </mesh>
      ))}
      {/* Fitas de amarracao */}
      {[-1.7, -0.2].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.23, 0.23, 0.16, 20]} />
          <meshStandardMaterial color="#4d5462" metalness={0.1} roughness={0.9} />
        </mesh>
      ))}
      {/* Ponto de saida: aqui a capa acaba e os fios abrem em leque */}
      <mesh position={[0.92, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.14, 0.3, 20]} />
        <meshStandardMaterial color="#3a4152" metalness={0.15} roughness={0.85} />
      </mesh>
      {fan.map(({ a, z }, i) => (
        <group key={i}>
          <mesh
            position={[1.05 + Math.cos(a) * 0.65, Math.sin(a) * 0.65, z]}
            rotation={[0, 0, a - Math.PI / 2]}
          >
            <cylinderGeometry args={[0.045, 0.045, 1.3, 8]} />
            <meshStandardMaterial color="#525a69" metalness={0.15} roughness={0.85} />
          </mesh>
          <mesh position={[1.05 + Math.cos(a) * 1.38, Math.sin(a) * 1.38, z]}>
            <boxGeometry args={[0.18, 0.16, 0.14]} />
            <meshStandardMaterial {...PLASTIC_GREY} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Caixa de fusiveis e reles, aberta de frente. */
function FuseBox(): JSX.Element {
  const fuses = ['#c0392b', '#2f6fd0', '#d6b129', '#3f9d4a', '#d97b2b', '#8e44ad'];
  return (
    <group>
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[1.7, 1.4, 0.5]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Moldura da tampa aberta */}
      {[
        [0, 0.68, 1.8, 0.12],
        [0, -0.68, 1.8, 0.12],
      ].map(([x, y, w, h]) => (
        <mesh key={y} position={[x, y, 0.06]}>
          <boxGeometry args={[w, h, 0.6]} />
          <meshStandardMaterial {...PLASTIC_GREY} />
        </mesh>
      ))}
      {[-0.84, 0.84].map((x) => (
        <mesh key={x} position={[x, 0, 0.06]}>
          <boxGeometry args={[0.12, 1.5, 0.6]} />
          <meshStandardMaterial {...PLASTIC_GREY} />
        </mesh>
      ))}
      {/* Fusiveis lamina: a cor e o valor em amperes */}
      {fuses.map((c, i) => (
        <mesh key={c} position={[-0.6 + i * 0.24, -0.32, 0.16]}>
          <boxGeometry args={[0.15, 0.34, 0.12]} />
          <meshStandardMaterial color={c} metalness={0.1} roughness={0.5} transparent opacity={0.85} />
        </mesh>
      ))}
      {/* Reles: o da esquerda e o principal, que alimenta a injecao */}
      {[-0.5, 0.06, 0.6].map((x, i) => (
        <mesh key={x} position={[x, 0.28, 0.14]}>
          <boxGeometry args={i === 0 ? [0.44, 0.46, 0.34] : [0.36, 0.38, 0.3]} />
          <meshStandardMaterial color={i === 0 ? '#3a4152' : '#23272f'} metalness={0.2} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/** Modulo de bomba de combustivel (no tanque). */function FuelPump(): JSX.Element {
  return (
    <group>
      {/* Flange superior */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.18, 24]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Conector */}
      <mesh position={[0.35, 1.35, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Corpo/reservatorio */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.7, 24, 1, true]} />
        <meshStandardMaterial {...PLASTIC_GREY} side={2} />
      </mesh>
      {/* Bomba (cilindro interno) */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 1.4, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Filtro/pescador (tela) */}
      <mesh position={[0, -0.85, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.6]} />
        <meshStandardMaterial color="#c9c04a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Braco da boia + boia */}
      <mesh position={[0.55, -0.2, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.95, -0.45, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#2b2f38" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Eletroventilador (shroud + hub + pas). */
function CoolingFan(): JSX.Element {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Aro/shroud */}
      <mesh>
        <torusGeometry args={[1.1, 0.12, 16, 40]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Cubo do motor */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.4, 20]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Pas */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0]}
            rotation={[0.4, 0, a + Math.PI / 2]}
          >
            <boxGeometry args={[0.55, 0.02, 0.34]} />
            <meshStandardMaterial color="#31353f" metalness={0.2} roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

/* --- Pecas MECANICAS do motor (Aula 3), reaproveitadas da cena da aula --- */
function CrankshaftPart(): JSX.Element {
  return <Crankshaft />;
}
function ConnRodPart(): JSX.Element {
  return <ConnRod />;
}
function PistonPart(): JSX.Element {
  return <Piston />;
}
function CylinderLinerPart(): JSX.Element {
  return <CylinderBarrel xray={false} />;
}
function CylinderHeadPart(): JSX.Element {
  return <CylinderHead xray={false} />;
}
function IntakeValvePart(): JSX.Element {
  return <PoppetValve tint="#8fb7ff" />;
}
function ExhaustValvePart(): JSX.Element {
  return <PoppetValve tint="#e08a6a" />;
}
function CamshaftPart(): JSX.Element {
  return <Camshaft />;
}
function IntakeSystemPart(): JSX.Element {
  return <IntakeSystem xray={false} />;
}
function ExhaustSystemPart(): JSX.Element {
  return <ExhaustSystem xray={false} />;
}
function CrankcasePart(): JSX.Element {
  return <Crankcase y={0} xray={false} />;
}

// ---------------------------------------------------------------------------
// Aula 4 — sensores e atuadores da injecao eletronica
// ---------------------------------------------------------------------------

const PAPER = { color: '#d9c489', metalness: 0.02, roughness: 0.95 } as const;
const STEEL_DARK = { color: '#5d6472', metalness: 0.85, roughness: 0.45 } as const;

/** Medidor de massa de ar: tubo de passagem com cartucho lateral. */
function MafSensor({ pins = 4 }: { pins?: number } = {}): JSX.Element {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.7, 0.7, 1.8, 28, 1, true]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={2} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.7, 0.09, 10, 28]} />
          <meshStandardMaterial {...PLASTIC_GREY} />
        </mesh>
      ))}
      {/* Tela de protecao interna */}
      <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 24]} />
        <meshStandardMaterial color="#8f97a5" metalness={0.7} roughness={0.5} wireframe />
      </mesh>
      {/* Cartucho do elemento sensor */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.5, 0.9, 0.45]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.12]} />
        <meshStandardMaterial {...CERAMIC} />
      </mesh>
      {/* Conector: 4 vias no MAF comum, 5 na versao com sensor de temperatura */}
      <mesh position={[0, 1.15, 0.1]}>
        <boxGeometry args={[0.68, 0.4, 0.5]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, 1.15, 0.38]}>
        <boxGeometry args={[0.24, 0.12, 0.08]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {Array.from({ length: pins }).map((_, i) => (
        <mesh key={i} position={[-0.24 + (i * 0.48) / (pins - 1), 1.46, 0.1]}>
          <cylinderGeometry args={[0.032, 0.032, 0.24, 8]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * TMAF: o mesmo medidor de massa de ar com o sensor de temperatura junto. A
 * anteninha do NTC entra no duto e a conta muda de cor conforme o ar esquenta.
 */
function TmafSensor(): JSX.Element {
  const bead = useRef<THREE.Mesh>(null);
  const cold = useRef(new THREE.Color('#3b82f6')).current;
  const hot = useRef(new THREE.Color('#f97316')).current;

  useFrame((state) => {
    const m = bead.current?.material as THREE.MeshStandardMaterial | undefined;
    if (!m) return;
    const k = (1 - Math.cos(state.clock.elapsedTime * 0.5)) / 2;
    m.color.copy(cold).lerp(hot, k);
    m.emissive.copy(m.color).multiplyScalar(0.45);
  });

  return (
    <group>
      <MafSensor pins={5} />
      {/* Haste fina do NTC, entrando no duto */}
      <mesh position={[0.34, 0.18, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.75, 8]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      <mesh ref={bead} position={[0.34, -0.22, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.2} roughness={0.55} />
      </mesh>
    </group>
  );
}

/** Valvula de marcha lenta (motor de passo) com embolo conico. */
function IacValve(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 1.1, 24]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.3, 24]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Flange de fixacao com dois furos */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, -0.3, 0]}>
          <boxGeometry args={[0.4, 0.16, 0.35]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.07, 10, 24]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Embolo conico (a ponta que dosa o ar) */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <coneGeometry args={[0.24, 0.45, 20]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0.55, 0.5, 0]}>
        <boxGeometry args={[0.35, 0.45, 0.45]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Tubo distribuidor multiponto: barra com 4 copos de injetor. */
function FuelRail(): JSX.Element {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 3.0, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {[-1.05, -0.35, 0.35, 1.05].map((x) => (
        <mesh key={x} position={[x, -0.35, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      {/* Flanges de fixacao */}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, -0.18, 0]}>
          <boxGeometry args={[0.3, 0.14, 0.45]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      {/* Valvula de teste */}
      <mesh position={[1.2, 0.32, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.3, 12]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Entrada de combustivel */}
      <mesh position={[-1.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.35, 16]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
    </group>
  );
}

/** Regulador de pressao: duas conchas prensadas + bico de vacuo. */
function FuelPressureRegulator(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.55, 28]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.62, 0.5, 0.45, 28]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Costura da prensagem */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.07, 10, 30]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Bico de vacuo para o coletor */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.4, 14]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Saida inferior com o-ring */}
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.35, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.29, 0.07, 10, 22]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
    </group>
  );
}

/** Injetor de injecao direta (GDI) em corte: bobina, mola, agulha e sede multifuros. */
function InjectorGdi(): JSX.Element {
  const needle = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Group>(null);
  const coil = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const n = gdiNeedle(clock.getElapsedTime());
    if (needle.current) needle.current.position.y = -0.06 + 0.09 * n;
    if (spring.current) spring.current.scale.y = 1 - 0.35 * n;
    if (coil.current) coil.current.emissiveIntensity = 0.05 + 0.9 * n;
  });
  return (
    <group>
      {/* Entrada de combustivel: encaixa no bocal da flauta */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.7, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Secao da bobina, aberta para ver o enrolamento */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.75, 20]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.55, 20, 1, true]} />
        <meshStandardMaterial
          ref={coil}
          {...COPPER}
          emissive="#ffb35c"
          emissiveIntensity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Canal de combustivel sob pressao */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2.0, 14]} />
        <meshStandardMaterial
          color="#e08a1e"
          emissive="#e08a1e"
          emissiveIntensity={0.35}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
      {/* Mola que empurra a agulha contra a sede */}
      <group ref={spring} position={[0, 0.55, 0]}>
        {[-0.08, -0.17, -0.26, -0.35].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.024, 8, 18]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        ))}
      </group>
      {/* Agulha: curso minusculo, mas e ele que abre e fecha o bico */}
      <group ref={needle} position={[0, -0.06, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.0, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -1.03, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.16, 14]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      </group>
      {/* Haste ate a camara, aberta para ver a agulha */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.85, 18, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Anel de teflon (vedacao da camara) */}
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.05, 10, 22]} />
        <meshStandardMaterial color="#e9e9e4" metalness={0.05} roughness={0.6} />
      </mesh>
      {/* Sede: e aqui que a agulha assenta */}
      <mesh position={[0, -1.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.025, 8, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <coneGeometry args={[0.13, 0.25, 18, 1, true]} />
        <meshStandardMaterial {...METAL} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Furos calibrados do leque */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.055, -1.3, Math.sin(a) * 0.055]}>
            <cylinderGeometry args={[0.018, 0.018, 0.08, 6]} />
            <meshStandardMaterial color="#11151f" metalness={0} roughness={1} />
          </mesh>
        );
      })}
      {/* Conector de duas vias, do driver de alta tensao */}
      <mesh position={[0, 0.15, 0.35]}>
        <boxGeometry args={[0.45, 0.35, 0.3]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.4, 0.35]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

/** Leque de combustivel saindo do bico: so aparece enquanto a agulha esta levantada. */
function GdiSpray(): JSX.Element {
  const fan = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = fan.current;
    if (!g) return;
    const n = gdiNeedle(clock.getElapsedTime());
    g.visible = n > 0.02;
    g.scale.set(1, 0.35 + 0.65 * n, 1);
    g.traverse((c) => {
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m?.transparent) m.opacity = 0.55 * n;
    });
  });
  return (
    <group ref={fan}>
      {[-0.34, -0.17, 0, 0.17, 0.34].map((a) => (
        <group key={a} rotation={[0, 0, a]}>
          <mesh position={[0, -0.7, 0]}>
            <coneGeometry args={[0.16, 1.4, 12, 1, true]} />
            <meshStandardMaterial
              color="#e08a1e"
              emissive="#e08a1e"
              emissiveIntensity={0.8}
              transparent
              opacity={0.5}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Pistao que sobe e desce no ciclo de quatro tempos. */
function GdiPiston(): JSX.Element {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = 1.05 * gdiPistonY(clock.getElapsedTime());
  });
  return (
    <group ref={g}>
      <mesh>
        <cylinderGeometry args={[0.85, 0.85, 0.36, 26]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {[0.08, -0.02].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.87, 0.87, 0.05, 26]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 26, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Vela de ignicao com a faisca no fim da compressao. */
function SparkPlug(): JSX.Element {
  const arc = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const s = gdiSpark(clock.getElapsedTime());
    const m = arc.current;
    if (!m) return;
    m.visible = s > 0.02;
    m.scale.setScalar(0.6 + 1.4 * s);
  });
  return (
    <group>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.7, 16]} />
        <meshStandardMaterial {...CERAMIC} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.26, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.3, 14]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Eletrodo central e massa lateral */}
      <mesh position={[0, -0.36, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.07, -0.5, 0]}>
        <boxGeometry args={[0.14, 0.05, 0.09]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh ref={arc} position={[0, -0.48, 0]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial
          color="#bfe3ff"
          emissive="#7fd0ff"
          emissiveIntensity={3}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** As duas nuvens: homogenea quando injeta cedo, estratificada quando injeta tarde. */
function GdiMixtureCloud(): JSX.Element {
  const homo = useRef<THREE.Mesh>(null);
  const strat = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const m = gdiMixture(t);
    const s = gdiStratified(t);
    if (homo.current) {
      homo.current.visible = !s && m > 0.02;
      homo.current.scale.setScalar(0.5 + 0.5 * m);
      (homo.current.material as THREE.MeshStandardMaterial).opacity = 0.3 * m;
    }
    if (strat.current) {
      strat.current.visible = s && m > 0.02;
      strat.current.scale.setScalar(0.5 + 0.5 * m);
      (strat.current.material as THREE.MeshStandardMaterial).opacity = 0.6 * m;
    }
  });
  return (
    <group>
      <mesh ref={homo}>
        <sphereGeometry args={[1.15, 20, 16]} />
        <meshStandardMaterial
          color="#e0a45e"
          emissive="#e08a1e"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={strat} position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.45, 18, 14]} />
        <meshStandardMaterial
          color="#e08a1e"
          emissive="#e08a1e"
          emissiveIntensity={0.9}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Valvula de admissao com a crosta de carvao que so aparece na injecao direta. */
function CokedIntakeValve(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.0, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.05, 0.32, 0.3, 20]} />
        <meshStandardMaterial color="#8fb7ff" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.13, 0]}>
        <cylinderGeometry args={[0.32, 0.26, 0.08, 20]} />
        <meshStandardMaterial color="#8fb7ff" metalness={0.85} roughness={0.28} />
      </mesh>
      {/* A crosta: carvao do respiro do motor cozinhando na haste e na cabeca */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.09, 0.36, 0.34, 16]} />
        <meshStandardMaterial color="#231d18" metalness={0.05} roughness={1} />
      </mesh>
      {[0.3, 0.48, 0.66].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.14, 10]} />
          <meshStandardMaterial color="#2a221b" metalness={0.05} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

const DRIVER_BAR_X = -0.75;

/** Como o driver aciona: um pico alto para arrancar a agulha e uma corrente baixa para segurar. */
function InjectorDriverGauge(): JSX.Element {
  const pico = useRef<THREE.Group>(null);
  const hold = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const b = gdiBoost(t);
    const n = gdiNeedle(t);
    if (pico.current) pico.current.scale.y = 0.02 + 1.18 * b;
    if (hold.current) hold.current.scale.y = 0.02 + 0.42 * (n > 0.05 ? 1 - b : 0);
  });
  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.7, 0.07]}>
        <boxGeometry args={[2.9, 0.06, 0.04]} />
        <meshStandardMaterial color="#3a4152" />
      </mesh>
      <group ref={pico} position={[DRIVER_BAR_X, -0.7, 0.1]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.5, 1, 0.05]} />
          <meshStandardMaterial color="#7127c9" emissive="#7127c9" emissiveIntensity={0.9} />
        </mesh>
      </group>
      <group ref={hold} position={[-DRIVER_BAR_X, -0.7, 0.1]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.5, 1, 0.05]} />
          <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Camara em corte com vela e pistao. Com `knock`, a mistura do canto tambem se
 * acende sozinha e as duas frentes se batem no meio.
 */
function CombustionChamber({ knock }: { knock: boolean }): JSX.Element {
  const piston = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Mesh>(null);
  const auto = useRef<THREE.Mesh>(null);
  const shock = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (piston.current) piston.current.position.y = -0.3 + 0.42 * gdiPistonY(t);
    const ff = flameFront(t);
    if (flame.current) {
      const s = 0.06 + 0.76 * ff;
      flame.current.scale.set(s, s * 0.55, s);
      (flame.current.material as THREE.MeshStandardMaterial).opacity = 0.55 * ff;
    }
    if (!knock) return;
    const ai = autoIgnition(t);
    if (auto.current) {
      auto.current.scale.setScalar(0.06 + 0.32 * ai);
      (auto.current.material as THREE.MeshStandardMaterial).opacity = 0.7 * ai;
    }
    const sh = knockShock(t);
    if (shock.current) {
      shock.current.visible = sh > 0.02;
      shock.current.scale.setScalar(0.3 + 2.1 * sh);
      shock.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
        if (m?.transparent) m.opacity = 0.9 * sh;
      });
    }
  });

  return (
    <group>
      {/* Camisa do cilindro em corte */}
      <mesh>
        <cylinderGeometry args={[0.78, 0.78, 1.9, 28, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Cabecote fechando a camara por cima */}
      <mesh position={[0, 1.06, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.22, 28]} />
        <meshStandardMaterial {...METAL} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Vela no centro do cabecote */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.42, 14]} />
        <meshStandardMaterial {...CERAMIC} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.16, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, 0.93, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.18, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Pistao */}
      <group ref={piston}>
        <mesh>
          <cylinderGeometry args={[0.75, 0.75, 0.28, 28]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        {[0.06, -0.03].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.77, 0.77, 0.04, 28]} />
            <meshStandardMaterial {...STEEL_DARK} />
          </mesh>
        ))}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.5, 24, 1, true]} />
          <meshStandardMaterial {...METAL_DARK} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* Frente de chama que sai da vela */}
      <mesh ref={flame} position={[0, 0.62, 0]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial
          color="#ff9a3c"
          emissive="#ff7a1e"
          emissiveIntensity={1.1}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      {knock && (
        <>
          {/* A mistura do canto se acendendo por conta propria */}
          <mesh ref={auto} position={[-0.42, 0.15, 0]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial
              color="#ff4d3a"
              emissive="#ff2a1a"
              emissiveIntensity={1.3}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
          {/* O choque das duas frentes */}
          <group ref={shock} position={[-0.16, 0.4, 0]} visible={false}>
            <mesh>
              <sphereGeometry args={[0.22, 14, 10]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#cfe6ff"
                emissiveIntensity={2}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.34, 0.04, 8, 24]} />
              <meshStandardMaterial
                color="#9fd4ff"
                emissive="#9fd4ff"
                emissiveIntensity={1.6}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}

function CombustionNormal(): JSX.Element {
  return <CombustionChamber knock={false} />;
}

function CombustionKnock(): JSX.Element {
  return <CombustionChamber knock />;
}

/** A onda de vibracao correndo pelo bloco depois da batida. */
function KnockWave(): JSX.Element {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const a = Math.abs(knockRing(t));
    if (!g.current) return;
    g.current.visible = a > 0.015;
    g.current.children.forEach((c, i) => {
      const u = (t * 0.8 + i * 0.25) % 1;
      c.scale.setScalar(0.5 + u * 4.3);
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
      m.opacity = a * (1 - u) * 0.85;
    });
  });
  return (
    <group ref={g} visible={false}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i}>
          <torusGeometry args={[0.5, 0.05, 8, 40]} />
          <meshStandardMaterial
            color="#ffb14d"
            emissive="#ff8c1a"
            emissiveIntensity={1.2}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const SCOPE_BARS = 56;
const SCOPE_STEP = 0.035;
const SCOPE_QUIET = new THREE.Color('#3f7f5a');
const SCOPE_LISTEN = new THREE.Color('#ff6a3c');

/** O que aparece no osciloscopio ligado no conector do sensor. */
function KnockScope(): JSX.Element {
  const bars = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lamp.current) lamp.current.emissiveIntensity = knockWindow(t) ? 1.6 : 0.05;
    bars.current?.children.forEach((c, i) => {
      const ts = t - i * SCOPE_STEP;
      c.scale.y = Math.max(0.03, Math.abs(knockSignal(ts)) * 1.6);
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
      const listening = knockWindow(ts);
      m.color.copy(listening ? SCOPE_LISTEN : SCOPE_QUIET);
      m.emissive.copy(m.color);
      m.emissiveIntensity = listening ? 1.1 : 0.35;
    });
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0.07]}>
        <boxGeometry args={[2.95, 0.03, 0.04]} />
        <meshStandardMaterial color="#3a4152" />
      </mesh>
      <group ref={bars}>
        {Array.from({ length: SCOPE_BARS }).map((_, i) => (
          <mesh key={i} position={[1.45 - i * (2.9 / (SCOPE_BARS - 1)), 0.05, 0.09]}>
            <boxGeometry args={[0.038, 1, 0.05]} />
            <meshStandardMaterial color="#3f7f5a" emissive="#3f7f5a" emissiveIntensity={0.35} />
          </mesh>
        ))}
      </group>
      {/* Lampada da janela de escuta: acende no pedaco do giro em que a ECU olha o sinal */}
      <mesh position={[1.42, 0.75, 0.1]}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color="#ff6a3c" emissive="#ff6a3c" emissiveIntensity={0.05} ref={lamp} />
      </mesh>
    </group>
  );
}

/** Escala do avanco de ignicao, com o ponteiro recuando a cada batida. */
const ADV_ANGLE = (0.5 - ADV_BASE / 30) * Math.PI;

function SparkAdvanceGauge(): JSX.Element {
  const needle = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (needle.current) needle.current.rotation.z = (0.5 - sparkAdvance(clock.getElapsedTime()) / 30) * Math.PI;
  });
  return (
    <group>
      <mesh>
        <boxGeometry args={[2.6, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.45, 0.07]}>
        <torusGeometry args={[0.85, 0.035, 8, 48, Math.PI]} />
        <meshStandardMaterial color="#3a4152" />
      </mesh>
      {[0, 7.5, 15, 22.5, 30].map((deg) => {
        const a = (0.5 - deg / 30) * Math.PI;
        return (
          <mesh key={deg} position={[-0.85 * Math.sin(a), -0.45 + 0.85 * Math.cos(a), 0.08]}>
            <boxGeometry args={[0.06, 0.06, 0.04]} />
            <meshStandardMaterial color="#6b7688" />
          </mesh>
        );
      })}
      {/* Marca do avanco cheio: e dali que o ponteiro despenca quando ouve a batida */}
      <mesh position={[-0.85 * Math.sin(ADV_ANGLE), -0.45 + 0.85 * Math.cos(ADV_ANGLE), 0.08]}>
        <boxGeometry args={[0.09, 0.09, 0.04]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.8} />
      </mesh>
      <group ref={needle} position={[0, -0.45, 0.12]}>
        <mesh position={[0, 0.39, 0]}>
          <boxGeometry args={[0.06, 0.78, 0.04]} />
          <meshStandardMaterial color="#ff6a3c" emissive="#ff6a3c" emissiveIntensity={1.1} />
        </mesh>
      </group>
      <mesh position={[0, -0.45, 0.14]}>
        <sphereGeometry args={[0.09, 12, 10]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
    </group>
  );
}

/** O estrago: borda do pistao comida e a junta do cabecote queimada. */
function DamagedPiston(): JSX.Element {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.85, 0.85, 0.36, 28]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {[0.1, 0.0].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.87, 0.87, 0.05, 28]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
      ))}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 24, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} side={THREE.DoubleSide} />
      </mesh>
      {/* Cratera na borda: e sempre no canto mais longe da vela que ela come */}
      {[-0.55, -0.3, -0.05, 0.2].map((a, i) => (
        <mesh
          key={a}
          position={[0.82 * Math.cos(a), 0.14 - (i % 2) * 0.06, 0.82 * Math.sin(a)]}
        >
          <sphereGeometry args={[0.17, 10, 8]} />
          <meshStandardMaterial color="#1c1712" roughness={1} />
        </mesh>
      ))}
      {/* Junta do cabecote com um trecho queimado */}
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.05, 8, 40, Math.PI * 1.45]} />
        <meshStandardMaterial color="#8a5a2a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, Math.PI * 1.45]}>
        <torusGeometry args={[0.95, 0.05, 8, 20, Math.PI * 0.55]} />
        <meshStandardMaterial color="#221c17" roughness={1} />
      </mesh>
    </group>
  );
}

/** Pedal do acelerador com sensor integrado: o braco gira junto com a borboleta. */
function AppSensor(): JSX.Element {
  const arm = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Group>(null);

  useFrame((state) => {
    const k = throttleOpening(state.clock.elapsedTime);
    if (arm.current) arm.current.rotation.z = k * 0.45;
    if (spring.current) spring.current.scale.y = 1 - k * 0.45;
  });

  return (
    <group>
      {/* Assoalho */}
      <mesh position={[0, -1.0, 0]}>
        <boxGeometry args={[1.9, 0.16, 1.0]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {/* Batente de fim de curso */}
      <mesh position={[-1.25, -0.82, 0]}>
        <boxGeometry args={[0.24, 0.2, 0.5]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Caixa do sensor, no eixo do pedal */}
      <mesh position={[0.6, -0.62, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.7]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Sao duas leituras separadas, e nao uma so */}
      {(
        [
          [0.45, '#0f8a46'],
          [0.78, '#7127c9'],
        ] as [number, string][]
      ).map(([x, c]) => (
        <mesh key={x} position={[x, -0.62, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[1.02, -0.62, 0]}>
        <boxGeometry args={[0.28, 0.42, 0.5]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {[-0.13, 0, 0.13].map((z) => (
        <mesh key={z} position={[1.24, -0.62, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.22, 8]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Mola de retorno: e ela que devolve o pedal quando o pe sai */}
      <group ref={spring} position={[-0.55, -0.92, 0]}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[0, 0.12 + i * 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.14, 0.025, 6, 16]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        ))}
      </group>
      {/* Braco articulado no eixo do sensor */}
      <group ref={arm} position={[0.6, -0.62, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[-0.42, 0.74, 0]} rotation={[0, 0, 0.52]}>
          <boxGeometry args={[0.2, 1.7, 0.14]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
        <mesh position={[-0.55, 1.0, 0.1]} rotation={[0, 0, 0.52]}>
          <boxGeometry args={[0.42, 1.0, 0.09]} />
          <meshStandardMaterial {...RUBBER} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * As duas rampas do pedal, lado a lado. O ponto anda com a mesma funcao do
 * pedal e da borboleta, entao da para ver que as tres coisas sao a mesma.
 */
function PedalTrace(): JSX.Element {
  const d1 = useRef<THREE.Mesh>(null);
  const d2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const k = throttleOpening(state.clock.elapsedTime);
    const x = -1.5 + 3.0 * k;
    d1.current?.position.set(x, -0.6 + 1.2 * k, 0.14);
    d2.current?.position.set(x, -0.6 + 0.6 * k, 0.14);
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 1.7, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.72, 0.06]}>
        <boxGeometry args={[3.1, 0.03, 0.02]} />
        <meshStandardMaterial color="#5a6270" />
      </mesh>
      <mesh position={[-1.56, 0, 0.06]}>
        <boxGeometry args={[0.03, 1.5, 0.02]} />
        <meshStandardMaterial color="#5a6270" />
      </mesh>
      <mesh position={[0, 0, 0.08]} rotation={[0, 0, 0.3805]}>
        <boxGeometry args={[3.231, 0.06, 0.02]} />
        <meshStandardMaterial color="#0f8a46" emissive="#0f8a46" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.3, 0.08]} rotation={[0, 0, 0.1974]}>
        <boxGeometry args={[3.059, 0.06, 0.02]} />
        <meshStandardMaterial color="#7127c9" emissive="#7127c9" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={d1}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial color="#0f8a46" emissive="#0f8a46" emissiveIntensity={1.5} />
      </mesh>
      <mesh ref={d2}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial color="#7127c9" emissive="#7127c9" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

/** Bobina de ignicao estatica (faisca perdida) com 4 torres. */
function CoilPack(): JSX.Element {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.9, 0.8, 0.9]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {[-0.65, -0.22, 0.22, 0.65].map((x) => (
        <group key={x} position={[x, 0.55, 0]}>
          <mesh>
            <cylinderGeometry args={[0.17, 0.2, 0.35, 16]} />
            <meshStandardMaterial {...PLASTIC_GREY} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 10]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        </group>
      ))}
      {/* Conector lateral */}
      <mesh position={[0, -0.05, 0.62]}>
        <boxGeometry args={[0.7, 0.4, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Suporte de fixacao */}
      <mesh position={[0, -0.48, 0]}>
        <boxGeometry args={[2.1, 0.12, 0.7]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
    </group>
  );
}

/** Filtro de ar: painel de papel plissado com moldura de borracha. */
function AirFilter(): JSX.Element {
  const pleats = 16;
  return (
    <group>
      {Array.from({ length: pleats }).map((_, i) => {
        const x = (i / (pleats - 1) - 0.5) * 2.0;
        return (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, i % 2 === 0 ? 0.5 : -0.5, 0]}>
            <boxGeometry args={[0.13, 1.3, 0.5]} />
            <meshStandardMaterial {...PAPER} />
          </mesh>
        );
      })}
      {/* Moldura de vedacao */}
      {[-0.72, 0.72].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[2.4, 0.2, 0.75]} />
          <meshStandardMaterial {...RUBBER} />
        </mesh>
      ))}
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.2, 1.65, 0.75]} />
          <meshStandardMaterial {...RUBBER} />
        </mesh>
      ))}
    </group>
  );
}

/** Modulo do tanque em corte: copo, motor eletrico, turbina, filtro e a boia do nivel. */
function FuelPumpModule(): JSX.Element {
  const rotor = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rotor.current) rotor.current.rotation.y = pumpSpin(t);
    if (arm.current) arm.current.rotation.z = floatAngle(t);
  });

  return (
    <group>
      {/* Flange que fecha a boca do tanque */}
      <mesh position={[0, 2.02, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.16, 28]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0.42, 2.27, 0]}>
        <boxGeometry args={[0.5, 0.34, 0.4]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {[-0.18, -0.06, 0.06, 0.18].map((dx) => (
        <mesh key={dx} position={[0.42 + dx, 2.55, 0]}>
          <boxGeometry args={[0.05, 0.22, 0.05]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Bico de saida */}
      <mesh position={[-0.5, 2.35, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.5, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>

      {/* Copo: e ele que segura combustivel em volta da suceao */}
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 1.5, 28, 1, true]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.97, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.06, 28]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.25, 24]} />
        <meshStandardMaterial color="#e08a1e" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      {/* Tela grossa da suceao */}
      <mesh position={[0, -1.9, 0]}>
        <boxGeometry args={[0.9, 0.12, 0.5]} />
        <meshStandardMaterial color="#d8dade" metalness={0.1} roughness={0.85} />
      </mesh>

      {/* Motor de corrente continua, submerso de proposito */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 1.3, 24, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, -0.15, 0]}>
          <boxGeometry args={[0.1, 0.9, 0.5]} />
          <meshStandardMaterial color="#a8342f" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      <group ref={rotor}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 1.9, 12]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, -0.15, 0]} rotation={[0, (i * Math.PI) / 4, 0]}>
            <boxGeometry args={[0.5, 0.7, 0.11]} />
            <meshStandardMaterial {...COPPER} />
          </mesh>
        ))}
        {/* Turbina na base: e ela que empurra o combustivel */}
        <mesh position={[0, -0.88, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.14, 20]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i * Math.PI) / 4;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.27, -0.88, Math.sin(a) * 0.27]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.1, 0.2, 0.16]} />
              <meshStandardMaterial {...METAL} />
            </mesh>
          );
        })}
      </group>

      {/* Filtro dentro do proprio modulo */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.9, 24]} />
        <meshStandardMaterial {...PAPER} />
      </mesh>
      {[0.6, 1.5].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.08, 24]} />
          <meshStandardMaterial {...PLASTIC_GREY} />
        </mesh>
      ))}
      <mesh position={[0, 1.74, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.4, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>

      {/* Braco da boia: potenciometro no pivo, esfera na superficie */}
      <mesh position={[0.8, FLOAT_PIVOT_Y, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.22, 16]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <group ref={arm} position={[0.8, FLOAT_PIVOT_Y, 0]}>
        <mesh position={[FLOAT_ARM / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, FLOAT_ARM, 8]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[FLOAT_ARM, 0, 0]}>
          <sphereGeometry args={[0.24, 16, 12]} />
          <meshStandardMaterial {...PLASTIC} />
        </mesh>
      </group>
    </group>
  );
}

/** Combustivel do tanque: a superficie desce junto com a boia. */
function TankFuel(): JSX.Element {
  const body = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!body.current) return;
    const h = Math.max(0.05, fuelSurfaceY(clock.getElapsedTime()) + 2.15);
    body.current.scale.y = h;
    body.current.position.y = -2.15 + h / 2;
  });

  return (
    <mesh ref={body}>
      <boxGeometry args={[6.1, 1, 2.9]} />
      <meshStandardMaterial color="#e08a1e" transparent opacity={0.34} depthWrite={false} />
    </mesh>
  );
}

/** Marcador de combustivel do painel, com a luz de reserva. */
function FuelGaugeCluster(): JSX.Element {
  const needle = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (needle.current) needle.current.rotation.z = (0.5 - fuelLevel(t)) * Math.PI;
    if (lamp.current) lamp.current.emissiveIntensity = fuelReserve(t) ? 1.8 : 0.04;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[2.6, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.4, 0.07]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.03, 8, 44, Math.PI]} />
        <meshStandardMaterial color="#5c6674" />
      </mesh>
      {[0, 0.5, 1].map((v) => {
        const a = (0.5 - v) * Math.PI;
        return (
          <mesh key={v} position={[-0.8 * Math.sin(a), -0.4 + 0.8 * Math.cos(a), 0.08]}>
            <boxGeometry args={[0.07, 0.16, 0.03]} />
            <meshStandardMaterial color="#9aa4b2" emissive="#9aa4b2" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
      <group ref={needle} position={[0, -0.4, 0.12]}>
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.04]} />
          <meshStandardMaterial color="#ff6a3c" emissive="#ff6a3c" emissiveIntensity={1.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial color="#d5dae2" />
        </mesh>
      </group>
      <mesh position={[0.95, 0.6, 0.1]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial ref={lamp} color="#f2a33c" emissive="#f2a33c" emissiveIntensity={0.04} />
      </mesh>
    </group>
  );
}

/** Manometro da linha de baixa pressao, escala de 0 a 7 bar. */
function LpGauge(): JSX.Element {
  const needle = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!needle.current) return;
    const bar = 5 + 0.14 * Math.sin(clock.getElapsedTime() * 5.5);
    needle.current.rotation.z = (0.5 - bar / 7) * Math.PI;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[2.4, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.4, 0.07]}>
        <torusGeometry args={[0.8, 0.03, 8, 44, Math.PI]} />
        <meshStandardMaterial color="#5c6674" />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((bar) => {
        const a = (0.5 - bar / 7) * Math.PI;
        return (
          <mesh key={bar} position={[-0.8 * Math.sin(a), -0.4 + 0.8 * Math.cos(a), 0.08]}>
            <boxGeometry args={[0.05, 0.14, 0.03]} />
            <meshStandardMaterial color="#9aa4b2" emissive="#9aa4b2" emissiveIntensity={0.45} />
          </mesh>
        );
      })}
      <group ref={needle} position={[0, -0.4, 0.12]}>
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.04]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial color="#d5dae2" />
        </mesh>
      </group>
    </group>
  );
}

/** Rele da bomba em corte: bobina energizada e contato de potencia fechado. */
function PumpRelay(): JSX.Element {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 0.9]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Bobina de comando */}
      <mesh position={[-0.3, -0.08, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.6, 18]} />
        <meshStandardMaterial {...COPPER} emissive="#ffb35c" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-0.3, -0.08, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.78, 12]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {/* Armadura puxada e contato de potencia fechado */}
      <mesh position={[0.08, 0.34, 0]}>
        <boxGeometry args={[0.78, 0.09, 0.3]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.4, 0.16, 0]}>
        <boxGeometry args={[0.12, 0.28, 0.24]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      <mesh position={[0.4, -0.08, 0]}>
        <boxGeometry args={[0.12, 0.24, 0.24]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      {[-0.42, -0.14, 0.14, 0.42].map((x) => (
        <mesh key={x} position={[x, -0.75, 0]}>
          <boxGeometry args={[0.09, 0.35, 0.09]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

/** Sensor de velocidade do veiculo (VSS) com engrenagem acionadora. */
function VssSensor(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0.45, 0.55, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Colar roscado */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.3, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.35, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.21, 0.05, 10, 20]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Engrenagem acionadora */}
      <mesh position={[0, -0.78, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.28, 14]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Tubo distribuidor com aquecedor de partida a frio (flex start). */
function FuelRailFlexstart(): JSX.Element {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 2.6, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {[-0.85, -0.28, 0.28, 0.85].map((x) => (
        <mesh key={x} position={[x, -0.36, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      {/* Corpo do aquecedor eletrico */}
      <mesh position={[-1.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.8, 22]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[-1.55, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.5]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Entrada de combustivel */}
      <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
    </group>
  );
}

/** Tubo distribuidor de injecao direta (alta pressao). */
function FuelRailGdi(): JSX.Element {
  const core = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = core.current;
    if (!g) return;
    const p = (railRealBar(t) - RAIL_BAR_MIN) / RAIL_BAR_SPAN;
    const ripple = pumpLift(t);
    (g.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15 + 0.7 * p + 0.12 * ripple;
    g.scale.setScalar(0.96 + 0.04 * ripple);
  });
  return (
    <group>
      {/* Parede em corte: o que importa aqui e o volume guardado dentro */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 2.4, 22, 1, true]} />
        <meshStandardMaterial {...STEEL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {[-1.17, 1.17].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.06, 22]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
      ))}
      <mesh ref={core} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 2.28, 20]} />
        <meshStandardMaterial
          color="#e08a1e"
          emissive="#e08a1e"
          emissiveIntensity={0.4}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      {[-0.8, -0.27, 0.27, 0.8].map((x) => (
        <group key={x} position={[x, -0.4, 0]}>
          <mesh>
            <cylinderGeometry args={[0.19, 0.19, 0.3, 6]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.35, 14]} />
            <meshStandardMaterial {...METAL_DARK} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.7, 10]} />
            <meshStandardMaterial color="#e08a1e" emissive="#e08a1e" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
      {/* Sede roscada do sensor de alta pressao */}
      <mesh position={[-1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.4, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Entrada de alta: porca e cone de metal contra metal, de uso unico */}
      <mesh position={[-1.68, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.26, 6]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[-1.86, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.15, 0.12, 16]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      {/* Suportes forjados */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.4, 0]}>
          <boxGeometry args={[0.35, 0.3, 0.5]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
      ))}
    </group>
  );
}

/** Valvula de alivio mecanica: fica sentada e so abre se a pressao passar do limite. */
function RailReliefValve(): JSX.Element {
  const ball = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ball.current) ball.current.position.y = 0.12 + 0.012 * pumpLift(clock.getElapsedTime());
  });
  return (
    <group>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.3, 14]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.7, 18]} />
        <meshStandardMaterial {...METAL} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.03, 8, 18]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh ref={ball} position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.11, 16, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {[0.3, 0.4, 0.5, 0.6].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.028, 8, 18]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.12, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.3, 12]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
    </group>
  );
}

/** Sensor de alta pressao em corte: a membrana de aco entorta conforme a flauta enche. */
function RailPressureSensor(): JSX.Element {
  const dia = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const p = (railRealBar(clock.getElapsedTime()) - RAIL_BAR_MIN) / RAIL_BAR_SPAN;
    if (dia.current) dia.current.position.y = 0.46 + 0.07 * p;
    if (core.current) core.current.emissiveIntensity = 0.15 + 0.95 * p;
  });
  return (
    <group>
      {/* Rosca de alta pressao e o furo que sobe ate a membrana */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.6, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 1.0, 12]} />
        <meshStandardMaterial ref={core} color="#e08a1e" emissive="#e08a1e" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.35, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.62, 20]} />
        <meshStandardMaterial {...METAL} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.16, 18]} />
        <meshStandardMaterial color="#e08a1e" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <group ref={dia} position={[0, 0.46, 0]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.05, 20]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        {[-0.15, -0.05, 0.05, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.04, 0]}>
            <boxGeometry args={[0.05, 0.02, 0.14]} />
            <meshStandardMaterial {...COPPER} />
          </mesh>
        ))}
      </group>
      {/* Placa que amplifica o sinal fraco da membrana */}
      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[0.44, 0.05, 0.34]} />
        <meshStandardMaterial color="#1d4f2a" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.73, 0]}>
        <boxGeometry args={[0.13, 0.06, 0.1]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.45, 0.35, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[-0.12, 0, 0.12].map((x) => (
        <mesh key={x} position={[x, 1.28, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

const RAIL_GAUGE_MAX = 250;
function barToX(bar: number): number {
  return -1.5 + (3.0 * bar) / RAIL_GAUGE_MAX;
}

/** Escala da flauta: o alvo da ECU e a pressao real tem que andar coladas. */
function RailGauge(): JSX.Element {
  const alvo = useRef<THREE.Group>(null);
  const real = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (alvo.current) alvo.current.position.x = barToX(railTargetBar(t));
    if (real.current) real.current.position.x = barToX(railRealBar(t));
  });
  return (
    <group>
      <mesh>
        <boxGeometry args={[3.6, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.35, 0.07]}>
        <boxGeometry args={[3.0, 0.16, 0.04]} />
        <meshStandardMaterial color="#2a3140" />
      </mesh>
      {[0, 100, 200].map((bar) => (
        <mesh key={bar} position={[barToX(bar), -0.35, 0.1]}>
          <boxGeometry args={[0.04, 0.36, 0.03]} />
          <meshStandardMaterial color="#9aa4b2" />
        </mesh>
      ))}
      <group ref={alvo} position={[barToX(RAIL_BAR_MIN), 0, 0]}>
        <mesh position={[0, 0.2, 0.12]}>
          <boxGeometry args={[0.05, 0.8, 0.03]} />
          <meshStandardMaterial color="#cfd6e2" emissive="#cfd6e2" emissiveIntensity={0.6} />
        </mesh>
      </group>
      <group ref={real} position={[barToX(RAIL_BAR_MIN), 0, 0]}>
        <mesh position={[0, -0.35, 0.14]}>
          <sphereGeometry args={[0.13, 16, 12]} />
          <meshStandardMaterial color="#e08a1e" emissive="#e08a1e" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/** Injetor piezoeletrico: pilha de cristais num corpo esguio. */
function InjectorPiezo(): JSX.Element {
  return (
    <group>
      {/* Secao do atuador piezo */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 1.5, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 0.15 + i * 0.16, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.05, 20]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.4]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Uniao de alta pressao lateral */}
      <mesh position={[0.35, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 6]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      {/* Corpo inferior e bico */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.19, 0.15, 1.0, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, -1.0, 0]}>
        <coneGeometry args={[0.12, 0.25, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
    </group>
  );
}

/** Conjunto monoponto (TBI): borboleta com um unico injetor central. */
function InjectorTbi(): JSX.Element {
  return (
    <group>
      {/* Corpo com o furo de passagem */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[1.5, 0.7, 1.3]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.75, 24, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} side={2} />
      </mesh>
      {/* Borboleta */}
      <mesh position={[0, -0.35, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.47, 0.47, 0.05, 24]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Tampa superior com o injetor unico */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.35, 24]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 20]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.45, 0.3, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Sensor inteligente de bateria (IBS) no terminal negativo. */
function IbsSensor(): JSX.Element {
  return (
    <group>
      {/* Garra do terminal */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.13, 12, 26]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[0.35, 0.22, 0.3]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      <mesh position={[0.5, 0.25, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.35, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Caixa da eletronica (shunt + micro) */}
      <mesh position={[-0.3, -0.3, 0]}>
        <boxGeometry args={[1.0, 0.3, 0.7]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Rabicho LIN */}
      <mesh position={[-0.95, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 10]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      <mesh position={[-1.25, -0.3, 0]}>
        <boxGeometry args={[0.3, 0.25, 0.28]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Sensor de NOx: sonda + modulo eletronico proprio. */
function NoxSensor(): JSX.Element {
  return (
    <group>
      {/* Sonda */}
      <group position={[-0.9, 0, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 6]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.45, 16]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.35, 16]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 0.4, 16]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      </group>
      {/* Cabo blindado */}
      <mesh position={[-0.15, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 1.5, 10]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Modulo eletronico */}
      <mesh position={[0.95, 0.35, 0]}>
        <boxGeometry args={[1.0, 0.9, 0.6]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0.95, -0.2, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.45]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Sonda lambda planar em corte: lamina ceramica e aquecedor a mostra. */
const LAMBDA_RICH = new THREE.Color('#c0392b');
const LAMBDA_LEAN = new THREE.Color('#3f6b9e');

/** Cor da camara de difusao: vermelho quando falta oxigenio, azul quando sobra. */
function mixtureColor(target: THREE.Color, lambda: number): void {
  const u = Math.max(0, Math.min(1, (lambda - 0.85) / 0.3));
  target.copy(LAMBDA_RICH).lerp(LAMBDA_LEAN, u);
}

function LambdaPlanar(): JSX.Element {
  const chamber = useRef<THREE.MeshStandardMaterial>(null);
  const pump = useRef<THREE.MeshStandardMaterial>(null);
  const heat = useRef<THREE.MeshStandardMaterial>(null);
  const ions = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const lam = lambdaValue(t);
    const cur = pumpCurrent(lam);
    if (chamber.current) {
      mixtureColor(chamber.current.color, lam);
      chamber.current.emissive.copy(chamber.current.color);
      chamber.current.emissiveIntensity = 0.25 + 0.5 * Math.min(1, Math.abs(cur) / 3);
    }
    if (pump.current) pump.current.emissiveIntensity = 0.04 + 1.8 * Math.min(1, Math.abs(cur) / 3);
    if (heat.current) heat.current.emissiveIntensity = 0.05 + 1.9 * heaterDuty(t);
    // Os ions sobem quando bombeia para fora (pobre) e descem quando bombeia para dentro.
    const dir = cur >= 0 ? 1 : -1;
    const speed = 0.15 + 0.55 * Math.min(1, Math.abs(cur) / 3);
    for (let i = 0; i < 4; i += 1) {
      const m = ions.current[i];
      if (!m) continue;
      const u = (t * speed + i / 4) % 1;
      m.position.y = -0.95 + (dir > 0 ? u : 1 - u) * 0.55;
      m.visible = Math.abs(cur) > 0.15;
    }
  });

  return (
    <group>
      {/* Meio corpo (corte longitudinal) */}
      <mesh position={[0, 0.35, -0.18]}>
        <cylinderGeometry args={[0.38, 0.38, 0.35, 6, 1, false, 0, Math.PI]} />
        <meshStandardMaterial {...METAL} side={2} />
      </mesh>
      <mesh position={[0, -0.05, -0.18]}>
        <cylinderGeometry args={[0.26, 0.26, 0.5, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial {...METAL_DARK} side={2} />
      </mesh>
      <mesh position={[0, -0.55, -0.18]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 16, 1, true, 0, Math.PI]} />
        <meshStandardMaterial {...METAL} side={2} />
      </mesh>
      {/* Celula de bombeamento (lamina externa, lado do gas de escape) */}
      <mesh position={[-0.07, -0.35, 0]}>
        <boxGeometry args={[0.06, 1.3, 0.05]} />
        <meshStandardMaterial
          ref={pump}
          color="#b9c6d6"
          emissive="#ffd93b"
          emissiveIntensity={0.04}
          metalness={0.15}
          roughness={0.6}
        />
      </mesh>
      {/* Camara de difusao: o vao que o circuito segura em lambda 1 */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.03, 1.15, 0.045]} />
        <meshStandardMaterial ref={chamber} color="#2e3b52" emissive="#2e3b52" emissiveIntensity={0.25} roughness={1} />
      </mesh>
      {/* Oxigenio entrando ou saindo da camara pela fenda */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            ions.current[i] = m;
          }}
          position={[0, -0.9, 0.05]}
        >
          <sphereGeometry args={[0.028, 8, 6]} />
          <meshStandardMaterial color="#eaf2ff" emissive="#eaf2ff" emissiveIntensity={1.4} />
        </mesh>
      ))}
      {/* Celula de Nernst (lamina de medicao, com ar de referencia) */}
      <mesh position={[0.07, -0.35, 0]}>
        <boxGeometry args={[0.06, 1.3, 0.05]} />
        <meshStandardMaterial {...CERAMIC} />
      </mesh>
      {/* Trilha do aquecedor, comandada por PWM */}
      <mesh position={[0.14, -0.35, 0.04]}>
        <boxGeometry args={[0.05, 1.1, 0.02]} />
        <meshStandardMaterial ref={heat} color="#b87333" emissive="#ff7a1a" emissiveIntensity={0.05} metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Saida dos fios */}
      <mesh position={[0, 0.75, -0.18]}>
        <cylinderGeometry args={[0.18, 0.26, 0.4, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial {...METAL_DARK} side={2} />
      </mesh>
    </group>
  );
}

/** Zoom da camara de difusao: o bombeamento de oxigenio e o sentido da corrente. */
function PumpCellPanel(): JSX.Element {
  const chamber = useRef<THREE.MeshStandardMaterial>(null);
  const arrow = useRef<THREE.Group>(null);
  const bar = useRef<THREE.Mesh>(null);
  const ions = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const lam = lambdaValue(t);
    const cur = pumpCurrent(lam);
    const mag = Math.min(1, Math.abs(cur) / 3);
    if (chamber.current) {
      mixtureColor(chamber.current.color, lam);
      chamber.current.emissive.copy(chamber.current.color);
      chamber.current.emissiveIntensity = 0.3 + 0.7 * mag;
    }
    if (arrow.current) {
      arrow.current.rotation.z = cur >= 0 ? 0 : Math.PI;
      arrow.current.scale.setScalar(0.35 + 0.65 * mag);
    }
    if (bar.current) {
      const h = Math.max(0.04, mag * 1.05);
      bar.current.scale.y = h;
      bar.current.position.y = (cur >= 0 ? h / 2 : -h / 2) + 0.1;
    }
    const dir = cur >= 0 ? 1 : -1;
    const speed = 0.12 + 0.5 * mag;
    for (let i = 0; i < 6; i += 1) {
      const m = ions.current[i];
      if (!m) continue;
      const u = (t * speed + i / 6) % 1;
      m.position.y = -1.15 + (dir > 0 ? u : 1 - u) * 1.5;
      m.visible = mag > 0.05;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.6, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Celula de bombeamento, do lado do gas */}
      <mesh position={[-0.95, 0.1, 0.1]}>
        <boxGeometry args={[0.3, 1.8, 0.12]} />
        <meshStandardMaterial color="#b9c6d6" emissive="#ffd93b" emissiveIntensity={0.35} metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Camara de difusao */}
      <mesh position={[-0.5, 0.1, 0.1]}>
        <boxGeometry args={[0.5, 1.6, 0.1]} />
        <meshStandardMaterial ref={chamber} color="#2e3b52" emissive="#2e3b52" emissiveIntensity={0.3} roughness={1} />
      </mesh>
      {/* Fenda que liga a camara ao escape */}
      <mesh position={[-0.5, -1.02, 0.1]}>
        <boxGeometry args={[0.16, 0.36, 0.1]} />
        <meshStandardMaterial color="#5a6577" roughness={1} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            ions.current[i] = m;
          }}
          position={[-0.5, -1.15, 0.18]}
        >
          <sphereGeometry args={[0.06, 10, 8]} />
          <meshStandardMaterial color="#eaf2ff" emissive="#eaf2ff" emissiveIntensity={1.5} />
        </mesh>
      ))}
      {/* Celula de medicao, com o ar de referencia atras */}
      <mesh position={[-0.05, 0.1, 0.1]}>
        <boxGeometry args={[0.3, 1.8, 0.12]} />
        <meshStandardMaterial {...CERAMIC} />
      </mesh>
      <mesh position={[0.28, 0.1, 0.1]}>
        <boxGeometry args={[0.3, 1.8, 0.1]} />
        <meshStandardMaterial color="#8fb6d8" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {/* Escala da corrente de bombeamento: zero no meio, inverte de lado */}
      <mesh position={[1.35, 0.1, 0.06]}>
        <boxGeometry args={[0.4, 2.2, 0.03]} />
        <meshStandardMaterial color="#1c232e" roughness={1} />
      </mesh>
      <mesh position={[1.35, 0.1, 0.09]}>
        <boxGeometry args={[0.56, 0.05, 0.03]} />
        <meshStandardMaterial color="#9aa4b2" emissive="#9aa4b2" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={bar} position={[1.35, 0.1, 0.12]}>
        <boxGeometry args={[0.3, 1, 0.05]} />
        <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={1.1} />
      </mesh>
      {/* Seta que inverte junto com a corrente */}
      <group ref={arrow} position={[0.75, 0.1, 0.14]}>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.08, 0.5, 0.05]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.0} />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <coneGeometry args={[0.16, 0.28, 12]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.0} />
        </mesh>
      </group>
    </group>
  );
}

const CMP_N = 76;
const lambdaX = (lam: number): number => -1.8 + ((lam - LAMBDA_MIN) / (LAMBDA_MAX - LAMBDA_MIN)) * 3.6;

/** As duas curvas na mesma escala: a estreita satura, a larga segue reta. */
function LambdaCompare(): JSX.Element {
  const cursor = useRef<THREE.Group>(null);

  const dots = useMemo(
    () =>
      Array.from({ length: CMP_N }).map((_, i) => {
        const lam = LAMBDA_MIN + ((LAMBDA_MAX - LAMBDA_MIN) * i) / (CMP_N - 1);
        return {
          x: lambdaX(lam),
          narrow: -1.05 + ((narrowVolts(lam) - 0.1) / 0.8) * 0.95,
          wide: 0.6 + (pumpCurrent(lam) / 3) * 0.5,
        };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (cursor.current) cursor.current.position.x = lambdaX(lambdaValue(clock.getElapsedTime()));
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.2, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Lambda 1 no meio das duas escalas */}
      <mesh position={[lambdaX(1), 0, 0.06]}>
        <boxGeometry args={[0.04, 2.5, 0.03]} />
        <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.6, 0.05]}>
        <boxGeometry args={[3.7, 0.03, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      <mesh position={[0, -0.58, 0.05]}>
        <boxGeometry args={[3.7, 0.03, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      {dots.map((d, i) => (
        <group key={i}>
          <mesh position={[d.x, d.wide, 0.09]}>
            <boxGeometry args={[0.05, 0.05, 0.03]} />
            <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[d.x, d.narrow, 0.09]}>
            <boxGeometry args={[0.05, 0.05, 0.03]} />
            <meshStandardMaterial color="#e0a44a" emissive="#e0a44a" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}
      <group ref={cursor}>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.05, 2.5, 0.04]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );
}

/** Como o scanner mostra: fator lambda com a faixa de mistura ideal marcada. */
function LambdaGauge(): JSX.Element {
  const needle = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!needle.current) return;
    const lam = lambdaValue(clock.getElapsedTime());
    const u = Math.max(0, Math.min(1, (lam - LAMBDA_MIN) / (LAMBDA_MAX - LAMBDA_MIN)));
    needle.current.rotation.z = (0.5 - u) * Math.PI;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[2.6, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.45, 0.07]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.85, 0.035, 8, 48, Math.PI]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      {[0, 0.5, 1].map((v) => {
        const a = Math.PI * (1 - v);
        const ideal = v === 0.5;
        return (
          <mesh key={v} position={[Math.cos(a) * 0.85, -0.45 + Math.sin(a) * 0.85, 0.1]}>
            <boxGeometry args={[0.09, 0.09, 0.04]} />
            <meshStandardMaterial
              color={ideal ? '#3ddc84' : '#9aa4b2'}
              emissive={ideal ? '#3ddc84' : '#9aa4b2'}
              emissiveIntensity={ideal ? 1.2 : 0.6}
            />
          </mesh>
        );
      })}
      <group ref={needle} position={[0, -0.45, 0.12]}>
        <mesh position={[0, 0.39, 0]}>
          <boxGeometry args={[0.06, 0.78, 0.04]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      </group>
    </group>
  );
}

const PWM_N = 60;

/** O aquecedor nao e simplesmente ligado: a ECU dosa a potencia em PWM. */
function HeaterPwmPanel(): JSX.Element {
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const bar = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const duty = heaterDuty(t);
    for (let i = 0; i < PWM_N; i += 1) {
      const m = dots.current[i];
      if (!m) continue;
      const phase = ((i / PWM_N) * 6) % 1;
      m.position.y = phase < duty ? 0.85 : 0.25;
    }
    const temp = lambdaTempC(t);
    if (bar.current) {
      const h = Math.max(0.05, Math.min(1, temp / 900) * 1.5);
      bar.current.scale.y = h;
      bar.current.position.y = -1.0 + h / 2;
    }
    if (glow.current) glow.current.emissiveIntensity = temp > 700 ? 1.8 : 0.05;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 2.4, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.25, 0.05]}>
        <boxGeometry args={[2.2, 0.03, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      {Array.from({ length: PWM_N }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            dots.current[i] = m;
          }}
          position={[-1.55 + (i / (PWM_N - 1)) * 2.1, 0.25, 0.09]}
        >
          <boxGeometry args={[0.05, 0.05, 0.03]} />
          <meshStandardMaterial color="#7127c9" emissive="#a06bf0" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {/* Termometro da ceramica com a faixa de trabalho marcada */}
      <mesh position={[1.15, -0.25, 0.05]}>
        <boxGeometry args={[0.42, 1.6, 0.03]} />
        <meshStandardMaterial color="#1c232e" roughness={1} />
      </mesh>
      <mesh ref={bar} position={[1.15, -1.0, 0.09]}>
        <boxGeometry args={[0.3, 1, 0.05]} />
        <meshStandardMaterial color="#ff7a1a" emissive="#ff7a1a" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[1.15, 0.25, 0.14]}>
        <boxGeometry args={[0.56, 0.14, 0.03]} />
        <meshStandardMaterial ref={glow} color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.05} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/** Injetor em corte longitudinal: mostra filtro, bobina, mola, agulha e disco de furos. */
function InjectorCutaway(): JSX.Element {
  return (
    <group>
      {/* Meia carcaca plastica (o corte) */}
      <mesh position={[0, 0.1, -0.02]}>
        <cylinderGeometry args={[0.42, 0.42, 1.5, 24, 1, true, 0, Math.PI]} />
        <meshStandardMaterial {...PLASTIC} side={2} />
      </mesh>
      {/* Entrada de combustivel e anel de vedacao superior */}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.35, 18]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.27, 0.06, 10, 22]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Microfiltro (cesta) */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#cfd6e0" metalness={0.3} roughness={0.8} wireframe />
      </mesh>
      {/* Enrolamento de cobre da bobina */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.6, 20, 1, true]} />
        <meshStandardMaterial {...COPPER} side={2} />
      </mesh>
      {/* Mola interna */}
      {[-0.12, -0.02, 0.08].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.022, 8, 20]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      ))}
      {/* Agulha de acionamento */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.1, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.85, 0]}>
        <coneGeometry args={[0.07, 0.16, 14]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Corpo inferior */}
      <mesh position={[0, -0.55, -0.02]}>
        <cylinderGeometry args={[0.22, 0.22, 0.8, 18, 1, true, 0, Math.PI]} />
        <meshStandardMaterial {...METAL_DARK} side={2} />
      </mesh>
      {/* Anel de vedacao inferior */}
      <mesh position={[0, -0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.23, 0.06, 10, 22]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Disco com furos calibrados */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.07, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.1, -1.05, Math.sin(a) * 0.1]}>
            <cylinderGeometry args={[0.022, 0.022, 0.12, 8]} />
            <meshStandardMaterial color="#11151f" metalness={0} roughness={1} />
          </mesh>
        );
      })}
      {/* Conector eletrico */}
      <mesh position={[0.42, 0.35, 0]}>
        <boxGeometry args={[0.36, 0.4, 0.42]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Roda fonica 60-2 girando na ponta do virabrequim: 58 dentes e a falha de referencia. */
function TriggerWheel(): JSX.Element {
  const teeth = CKP_TEETH;
  const spin = useRef<THREE.Group>(null);
  // Alinhado para a falha estar no topo da roda no instante em que ckpGap fica verdadeiro.
  useFrame(({ clock }) => {
    if (spin.current) {
      spin.current.rotation.y = 2 * Math.PI * ckpRevs(clock.getElapsedTime()) + Math.PI / 2 - Math.PI / teeth;
    }
  });
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <group ref={spin}>
        <mesh>
          <cylinderGeometry args={[1.05, 1.05, 0.12, 48]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 24]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        {/* Ponta do virabrequim: o parafuso central e o rasgo da chaveta */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.14, 6]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
        <mesh position={[0.3, 0.14, 0]}>
          <boxGeometry args={[0.12, 0.06, 0.09]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
        {Array.from({ length: teeth }).map((_, i) => {
          if (i === 0 || i === 1) return null; // a falha de dois dentes
          const a = (i / teeth) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 1.16, 0, Math.sin(a) * 1.16]}
              rotation={[0, -a, 0]}
            >
              <boxGeometry args={[0.16, 0.12, 0.09]} />
              <meshStandardMaterial {...METAL} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/** Roda do comando: um dente so e meia rotacao da roda do virabrequim. */
function CamTriggerWheel(): JSX.Element {
  const spin = useRef<THREE.Group>(null);
  const tooth = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (spin.current) spin.current.rotation.y = Math.PI * ckpRevs(t);
    // Um pulso a cada duas voltas do virabrequim: e isso que tira a duvida do ciclo.
    if (tooth.current) tooth.current.emissiveIntensity = 0.04 + 1.6 * cmpPulse(t);
  });
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <group ref={spin}>
        <mesh>
          <cylinderGeometry args={[0.85, 0.85, 0.12, 40]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.26, 20]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0.96, 0, 0]}>
          <boxGeometry args={[0.24, 0.12, 0.14]} />
          <meshStandardMaterial {...METAL} emissive="#ffd93b" emissiveIntensity={0.04} ref={tooth} />
        </mesh>
      </group>
    </group>
  );
}

/** Sensor de fase (CMP): efeito Hall em corte, lendo a roda do comando. */
function CmpSensor(): JSX.Element {
  const hall = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (hall.current) hall.current.emissiveIntensity = 0.04 + 2.6 * cmpPulse(clock.getElapsedTime());
  });

  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 1.0, 0.35]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Ima permanente: o campo que o dente do comando desvia */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.22, 0.42, 0.2]} />
        <meshStandardMaterial color="#a8342f" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Trilhas ligando o circuito ao conector */}
      {[-0.09, 0, 0.09].map((x) => (
        <mesh key={x} position={[x, 0.45, 0.08]}>
          <boxGeometry args={[0.03, 0.5, 0.03]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Flange de fixacao com o furo do parafuso */}
      <mesh position={[0.55, 0.15, 0]}>
        <boxGeometry args={[0.6, 0.32, 0.3]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0.72, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.36, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Cabeca sensora (a face que "olha" a roda do comando) */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.36, 0.35, 0.26]} />
        <meshStandardMaterial {...PLASTIC_GREY} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Circuito Hall: acende no instante em que o dente passa */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.24, 0.16, 0.16]} />
        <meshStandardMaterial ref={hall} {...CERAMIC} emissive="#3ddc84" emissiveIntensity={0.04} />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.22]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Conector de 3 vias: alimentacao, massa e sinal */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.46, 0.36, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[-0.13, 0, 0.13].map((x) => (
        <mesh key={x} position={[x, 1.05, 0]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

const PHASE_N = 104;

/** Os dois sinais na mesma base de tempo: um pulso do comando a cada duas voltas do virabrequim. */
function PhaseTrace(): JSX.Element {
  const cursor = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (cursor.current) cursor.current.position.x = -1.9 + (camRevs(clock.getElapsedTime()) % 1) * 3.8;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.4, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Fronteira entre a primeira e a segunda volta do virabrequim */}
      {[0, 0.5, 1].map((u) => (
        <mesh key={u} position={[-1.9 + u * 3.8, 0, 0.05]}>
          <boxGeometry args={[0.03, 2.4, 0.02]} />
          <meshStandardMaterial color="#5c6674" />
        </mesh>
      ))}
      {[0.55, -0.75].map((y) => (
        <mesh key={y} position={[0, y, 0.06]}>
          <boxGeometry args={[3.9, 0.02, 0.03]} />
          <meshStandardMaterial color="#3b434f" />
        </mesh>
      ))}
      {Array.from({ length: PHASE_N }).map((_, i) => {
        const u = (i + 0.5) / PHASE_N;
        const x = -1.9 + u * 3.8;
        return (
          <group key={i}>
            <mesh position={[x, 0.55 + cmpPulseAt(u) * 0.62, 0.09]}>
              <boxGeometry args={[0.036, 0.05, 0.03]} />
              <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={1.2} />
            </mesh>
            <mesh position={[x, -0.75 + ckpSquareAt(u) * 0.5, 0.09]}>
              <boxGeometry args={[0.036, 0.05, 0.03]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.0} />
            </mesh>
          </group>
        );
      })}
      <group ref={cursor}>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.03, 2.5, 0.03]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );
}

/** Os quatro cilindros: com a fase conhecida, cada injetor abre na vez do seu cilindro. */
function SequentialPanel(): JSX.Element {
  const glow = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const jets = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    const active = firingCylinder(clock.getElapsedTime());
    for (let i = 0; i < 4; i += 1) {
      const on = i === active;
      const g = glow.current[i];
      if (g) g.emissiveIntensity = on ? 2.2 : 0.03;
      const j = jets.current[i];
      if (j) j.emissiveIntensity = on ? 2.0 : 0.03;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.4, 2.2, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => {
        const cx = -1.5 + i * 1.0;
        return (
          <group key={i} position={[cx, 0, 0]}>
            <mesh position={[0, -0.1, 0.1]}>
              <cylinderGeometry args={[0.28, 0.28, 1.1, 20, 1, true]} />
              <meshStandardMaterial {...METAL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.3, 0.1]}>
              <sphereGeometry args={[0.2, 16, 12]} />
              <meshStandardMaterial
                ref={(m) => {
                  glow.current[i] = m;
                }}
                color="#ff8a3c"
                emissive="#ff8a3c"
                emissiveIntensity={0.03}
                transparent
                opacity={0.75}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0.78, 0.1]}>
              <boxGeometry args={[0.14, 0.34, 0.14]} />
              <meshStandardMaterial
                ref={(m) => {
                  jets.current[i] = m;
                }}
                color="#3ddc84"
                emissive="#3ddc84"
                emissiveIntensity={0.03}
              />
            </mesh>
            {/* Numero do cilindro em pontos: 1, 2, 3, 4 */}
            {Array.from({ length: i + 1 }).map((__, j) => (
              <mesh key={j} position={[(j - i / 2) * 0.14, -0.85, 0.1]}>
                <boxGeometry args={[0.07, 0.07, 0.04]} />
                <meshStandardMaterial color="#9aa4b2" emissive="#9aa4b2" emissiveIntensity={0.6} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/** Variador de fase em corte: o rotor gira dentro do estator e a eletrovalvula ao lado manda o oleo. */
function CamPhaser(): JSX.Element {
  const rotor = useRef<THREE.Group>(null);
  const oil = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const adv = vvtAdvance(t);
    if (rotor.current) rotor.current.rotation.z = (adv * Math.PI) / 180;
    if (oil.current) oil.current.emissiveIntensity = 0.05 + (1.8 * adv) / 40;
  });

  return (
    <group>
      {/* Estator: a polia que a corrente puxa */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.34, 40]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.24, Math.sin(a) * 1.24, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.14, 0.12, 0.3]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        );
      })}
      {/* Separadores fixos do estator: entre eles ficam as camaras de oleo */}
      {Array.from({ length: 4 }).map((_, i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.92, Math.sin(a) * 0.92, 0.02]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.44, 0.16, 0.36]} />
            <meshStandardMaterial {...STEEL_DARK} />
          </mesh>
        );
      })}
      {/* Rotor preso ao comando: e ele que adianta ou atrasa */}
      <group ref={rotor}>
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.4, 28]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        {Array.from({ length: 4 }).map((_, i) => {
          const a = (i / 4) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.03]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.62, 0.14, 0.38]} />
              <meshStandardMaterial {...METAL} />
            </mesh>
          );
        })}
        {/* Marca do comando: mostra o quanto o rotor saiu do zero */}
        <mesh position={[0, 0.86, 0.16]}>
          <boxGeometry args={[0.1, 0.36, 0.06]} />
          <meshStandardMaterial color="#ff6a3c" emissive="#ff6a3c" emissiveIntensity={1.2} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.5, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Marca fixa do estator: o zero de referencia */}
      <mesh position={[0, 0.86, 0.2]}>
        <boxGeometry args={[0.1, 0.36, 0.06]} />
        <meshStandardMaterial color="#9aa4b2" emissive="#9aa4b2" emissiveIntensity={0.5} />
      </mesh>
      {/* Eletrovalvula do variador: dosa o oleo que gira o rotor */}
      <mesh position={[2.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 1.2, 20]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[2.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.36, 0.5, 20]} />
        <meshStandardMaterial ref={oil} {...COPPER} emissive="#ffb35c" emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[3.0, 0, 0]}>
        <boxGeometry args={[0.4, 0.36, 0.44]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[-0.08, 0.08].map((y) => (
        <mesh key={y} position={[3.21, y, 0]}>
          <boxGeometry args={[0.18, 0.05, 0.05]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

/** Corpo de catalisador: usado pelo catalisador de 3 vias e pelo de NOx. */
function CatalystShell({
  dims,
  bosses,
  cut = false,
}: {
  /** [raio, comprimento, numero de nervuras da manta termica] */
  dims: [number, number, number];
  bosses: number[];
  /** Abre a metade da frente e mostra o favo de mel por dentro. */
  cut?: boolean;
}): JSX.Element {
  const [r, len, ribs] = dims;
  const shell = useRef<THREE.MeshStandardMaterial>(null);
  const gas = useRef<(THREE.Mesh | null)[]>([]);
  const dirty = useMemo(() => new THREE.Color('#c62222'), []);
  const clean = useMemo(() => new THREE.Color('#7a8a99'), []);

  useFrame(({ clock }) => {
    if (!cut) return;
    const t = clock.getElapsedTime();
    if (shell.current) shell.current.emissiveIntensity = 0.03 + 1.1 * catHeatOk(t);
    const eff = catEfficiency(t);
    for (let i = 0; i < 10; i += 1) {
      const m = gas.current[i];
      if (!m) continue;
      const u = (t * 0.28 + i / 10) % 1;
      // O eixo do corpo vira o X do mundo por causa da rotacao do grupo.
      m.position.y = (u - 0.5) * (len + 1.2);
      const mat = m.material as THREE.MeshStandardMaterial;
      // So converte depois de entrar no favo, e so o tanto que a eficiencia deixa.
      const done = Math.max(0, Math.min(1, (u - 0.35) / 0.3)) * eff;
      mat.color.copy(dirty).lerp(clean, done);
      mat.emissive.copy(mat.color);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        {cut ? (
          <cylinderGeometry args={[r, r, len, 24, 1, true, Math.PI / 2, Math.PI]} />
        ) : (
          <cylinderGeometry args={[r, r, len, 24]} />
        )}
        {cut ? (
          <meshStandardMaterial ref={shell} {...METAL} emissive="#ff7a1a" emissiveIntensity={0.03} side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial {...METAL} />
        )}
      </mesh>
      {cut && (
        <group>
          {/* Bloco ceramico */}
          <mesh>
            <cylinderGeometry args={[r * 0.86, r * 0.86, len * 0.92, 24, 1, true, Math.PI / 2, Math.PI]} />
            <meshStandardMaterial {...CERAMIC} side={THREE.DoubleSide} />
          </mesh>
          {/* Paredes dos canais vistas de topo: o favo de mel */}
          {Array.from({ length: 9 }).map((_, i) => (
            <mesh key={`c${i}`} position={[(i / 8 - 0.5) * r * 1.5, 0, -0.02]}>
              <boxGeometry args={[0.015, len * 0.92, r * 1.2]} />
              <meshStandardMaterial color="#8b8578" roughness={1} />
            </mesh>
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={`t${i}`} position={[0, (i / 6 - 0.5) * len * 0.9, -0.02]}>
              <boxGeometry args={[r * 1.6, 0.015, r * 1.2]} />
              <meshStandardMaterial color="#8b8578" roughness={1} />
            </mesh>
          ))}
          {/* Camada de platina, paladio e rodio nas duas faces do bloco */}
          {[1, -1].map((s) => (
            <mesh key={s} position={[0, (s * len * 0.92) / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r * 0.86, 0.03, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#d9c46a" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
          {/* O gas atravessando: entra sujo e sai limpo */}
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh
              key={`g${i}`}
              ref={(m) => {
                gas.current[i] = m;
              }}
              position={[(i % 3) * 0.16 - 0.16, 0, 0.16]}
            >
              <sphereGeometry args={[0.07, 10, 8]} />
              <meshStandardMaterial color="#c62222" emissive="#c62222" emissiveIntensity={0.9} />
            </mesh>
          ))}
        </group>
      )}
      {/* Nervuras da manta termica */}
      {Array.from({ length: ribs }).map((_, i) => (
        <mesh key={i} position={[0, (i / (ribs - 1) - 0.5) * len * 0.8, 0]}>
          <cylinderGeometry args={[r + 0.03, r + 0.03, 0.05, 24, 1, cut, cut ? Math.PI / 2 : 0, cut ? Math.PI : Math.PI * 2]} />
          <meshStandardMaterial {...METAL_DARK} side={cut ? THREE.DoubleSide : THREE.FrontSide} />
        </mesh>
      ))}

      {/* Cones e tubos de entrada e saida */}
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh position={[0, (s * (len + 0.4)) / 2, 0]} scale={[1, s, 1]}>
            <coneGeometry args={[r, 0.4, 24, 1, true]} />
            <meshStandardMaterial {...METAL} side={2} />
          </mesh>
          <mesh position={[0, s * (len / 2 + 0.65), 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.6, 18]} />
            <meshStandardMaterial {...METAL_DARK} />
          </mesh>
        </group>
      ))}
      {/* Bossas roscadas para as sondas */}
      {bosses.map((y) => (
        <mesh key={y} position={[0, y, r]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.22, 6]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
    </group>
  );
}

/** Catalisador de tres vias (pre-catalisador): corpo oval com bossa de sonda. */
function CatalyticConverter(): JSX.Element {
  return <CatalystShell dims={[0.5, 1.6, 5]} bosses={[0.55]} cut />;
}

const NOX_SITES = 14;
const SULF_SITES = [0, 5, 8, 13];
const NOX_LEN = 1.9;
const NOX_R = 0.45;

/**
 * Catalisador acumulador de NOx em corte. Envelope igual ao CatalystShell
 * de dims [0.45, 1.9, 6] para nao mexer na escala do mapa.
 */
function NoxCatalyst(): JSX.Element {
  const sites = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const gas = useRef<(THREE.Mesh | null)[]>([]);
  const nox = useMemo(() => new THREE.Color('#c62222'), []);
  const clean = useMemo(() => new THREE.Color('#7a8a99'), []);
  const n2 = useMemo(() => new THREE.Color('#3ddc84'), []);
  const nitrate = useMemo(() => new THREE.Color('#e0a44a'), []);
  const sulfur = useMemo(() => new THREE.Color('#d6e04a'), []);
  const bare = useMemo(() => new THREE.Color('#4a4740'), []);
  const out = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const store = noxStore(t);
    const sulf = sulfurLoad(t);
    const regen = regenActive(t);

    for (let i = 0; i < NOX_SITES; i += 1) {
      const m = sites.current[i];
      if (!m) continue;
      const s = SULF_SITES.indexOf(i);
      if (s >= 0 && sulf > (s + 1) / 5) {
        // Enxofre fica no lugar mesmo depois do pulso rico.
        m.color.copy(sulfur);
        m.emissive.copy(sulfur);
        m.emissiveIntensity = 1.2;
        continue;
      }
      const filled = store > (i % 7) / 7.5;
      m.color.copy(bare).lerp(nitrate, filled ? 1 : 0);
      m.emissive.copy(nitrate);
      m.emissiveIntensity = filled ? 0.3 + 1.3 * store : 0.02;
    }

    const escape = Math.max(0, Math.min(1, (store - 0.7) / 0.3));
    out.copy(clean).lerp(nox, escape);
    for (let i = 0; i < 8; i += 1) {
      const m = gas.current[i];
      if (!m) continue;
      const u = (t * 0.32 + i / 8) % 1;
      m.position.y = (u - 0.5) * (NOX_LEN + 1.2);
      const mat = m.material as THREE.MeshStandardMaterial;
      const done = Math.max(0, Math.min(1, (u - 0.42) / 0.22));
      mat.color.copy(nox).lerp(regen ? n2 : out, done);
      mat.emissive.copy(mat.color);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[NOX_R, NOX_R, NOX_LEN, 24, 1, true, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial {...METAL} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[NOX_R * 0.86, NOX_R * 0.86, NOX_LEN * 0.92, 24, 1, true, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial {...CERAMIC} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`c${i}`} position={[(i / 4 - 0.5) * NOX_R * 1.4, 0, -0.02]}>
          <boxGeometry args={[0.015, NOX_LEN * 0.92, NOX_R * 1.2]} />
          <meshStandardMaterial color="#8b8578" roughness={1} />
        </mesh>
      ))}
      {/* Sitios de armazenamento: e neles que o NOx vira nitrato e fica preso */}
      {Array.from({ length: NOX_SITES }).map((_, i) => (
        <mesh
          key={`s${i}`}
          position={[i < 7 ? -0.2 : 0.2, ((i % 7) / 6 - 0.5) * NOX_LEN * 0.8, 0.1]}
        >
          <boxGeometry args={[0.075, 0.075, 0.04]} />
          <meshStandardMaterial
            ref={(m) => {
              sites.current[i] = m;
            }}
            color="#4a4740"
            emissive="#e0a44a"
            emissiveIntensity={0.02}
            roughness={0.8}
          />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`g${i}`}
          ref={(m) => {
            gas.current[i] = m;
          }}
          position={[(i % 3) * 0.14 - 0.14, 0, 0.2]}
        >
          <sphereGeometry args={[0.065, 10, 8]} />
          <meshStandardMaterial color="#c62222" emissive="#c62222" emissiveIntensity={0.9} />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`r${i}`} position={[0, (i / 5 - 0.5) * NOX_LEN * 0.8, 0]}>
          <cylinderGeometry args={[NOX_R + 0.03, NOX_R + 0.03, 0.05, 24, 1, true, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial {...METAL_DARK} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh position={[0, (s * (NOX_LEN + 0.4)) / 2, 0]} scale={[1, s, 1]}>
            <coneGeometry args={[NOX_R, 0.4, 24, 1, true]} />
            <meshStandardMaterial {...METAL} side={2} />
          </mesh>
          <mesh position={[0, s * (NOX_LEN / 2 + 0.65), 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.6, 18]} />
            <meshStandardMaterial {...METAL_DARK} />
          </mesh>
        </group>
      ))}
      {[0.7, -0.7].map((y) => (
        <mesh key={y} position={[0, y, NOX_R]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.22, 6]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
    </group>
  );
}

const REGEN_TICKS = 8;

/** Estoque de NOx enchendo com mistura pobre e despejando no pulso rico. */
function NoxStorePanel(): JSX.Element {
  const fill = useRef<THREE.Mesh>(null);
  const mix = useRef<THREE.MeshStandardMaterial>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);
  const ticks = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const lean = useMemo(() => new THREE.Color('#3f6b9e'), []);
  const rich = useMemo(() => new THREE.Color('#c0392b'), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = noxStore(t);
    const regen = regenActive(t);
    if (fill.current) {
      const w = Math.max(0.02, s * 2.9);
      fill.current.scale.x = w;
      fill.current.position.x = -1.45 + w / 2;
    }
    if (mix.current) {
      mix.current.color.copy(noxLambda(t) < 1 ? rich : lean);
      mix.current.emissive.copy(mix.current.color);
    }
    if (lamp.current) lamp.current.emissiveIntensity = regen ? 2.0 : 0.04;
    const done = regenCount(t) % (REGEN_TICKS + 1);
    for (let i = 0; i < REGEN_TICKS; i += 1) {
      const m = ticks.current[i];
      if (m) m.emissiveIntensity = i < done ? 1.4 : 0.05;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.6, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.95, 0.07]}>
        <boxGeometry args={[3.0, 0.34, 0.03]} />
        <meshStandardMaterial ref={mix} color="#3f6b9e" emissive="#3f6b9e" emissiveIntensity={1.0} />
      </mesh>
      <mesh position={[0, 0.1, 0.05]}>
        <boxGeometry args={[3.0, 0.5, 0.03]} />
        <meshStandardMaterial color="#1c232e" roughness={1} />
      </mesh>
      <mesh ref={fill} position={[-1.45, 0.1, 0.09]}>
        <boxGeometry args={[1, 0.4, 0.05]} />
        <meshStandardMaterial color="#e0a44a" emissive="#e0a44a" emissiveIntensity={1.2} />
      </mesh>
      {/* Linha de saturacao: passou daqui, o NOx comeca a vazar */}
      <mesh position={[1.15, 0.1, 0.12]}>
        <boxGeometry args={[0.04, 0.66, 0.03]} />
        <meshStandardMaterial color="#e05a44" emissive="#e05a44" emissiveIntensity={1.3} />
      </mesh>
      <mesh position={[-1.4, -0.75, 0.09]}>
        <sphereGeometry args={[0.16, 14, 12]} />
        <meshStandardMaterial ref={lamp} color="#c0392b" emissive="#c0392b" emissiveIntensity={0.04} />
      </mesh>
      {Array.from({ length: REGEN_TICKS }).map((_, i) => (
        <mesh key={i} position={[-0.7 + i * 0.28, -0.75, 0.09]}>
          <boxGeometry args={[0.14, 0.3, 0.04]} />
          <meshStandardMaterial
            ref={(m) => {
              ticks.current[i] = m;
            }}
            color="#3ddc84"
            emissive="#3ddc84"
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

const NOX_TRACE_N = 56;

/** O que a sonda de NOx enxerga depois do catalisador. */
function NoxTracePanel(): JSX.Element {
  const dots = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < NOX_TRACE_N; i += 1) {
      const m = dots.current[i];
      if (!m) continue;
      const back = (1 - i / (NOX_TRACE_N - 1)) * 14;
      m.position.y = -0.95 + (noxPpm(t - back) / 450) * 1.9;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.2, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.95, 0.05]}>
        <boxGeometry args={[3.8, 0.03, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      {/* Nivel em que a ECU decide que esta na hora de limpar */}
      <mesh position={[0, 0.1, 0.05]}>
        <boxGeometry args={[3.8, 0.03, 0.02]} />
        <meshStandardMaterial color="#e05a44" emissive="#e05a44" emissiveIntensity={0.8} />
      </mesh>
      {Array.from({ length: NOX_TRACE_N }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            dots.current[i] = m;
          }}
          position={[-1.85 + (i / (NOX_TRACE_N - 1)) * 3.7, -0.95, 0.1]}
        >
          <boxGeometry args={[0.055, 0.055, 0.03]} />
          <meshStandardMaterial color="#c62222" emissive="#c62222" emissiveIntensity={1.3} />
        </mesh>
      ))}
    </group>
  );
}

const SULF_ROW = 10;

/** O enxofre tomando os sitios e a dessulfatacao, mais longa e mais quente. */
function SulfurPanel(): JSX.Element {
  const cells = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const heat = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const load = sulfurLoad(t);
    const burn = desulfActive(t);
    const taken = Math.round(load * SULF_ROW);
    for (let i = 0; i < SULF_ROW; i += 1) {
      const m = cells.current[i];
      if (m) m.emissiveIntensity = i < taken ? 1.5 : 0.04;
    }
    if (heat.current) {
      const h = burn ? 1.5 : 0.55;
      heat.current.scale.y = h;
      heat.current.position.y = -1.0 + h / 2;
    }
    if (lamp.current) lamp.current.emissiveIntensity = burn ? 2.0 : 0.04;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.0, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {Array.from({ length: SULF_ROW }).map((_, i) => (
        <mesh key={i} position={[-1.1 + i * 0.245, 0.65, 0.08]}>
          <boxGeometry args={[0.18, 0.18, 0.04]} />
          <meshStandardMaterial
            ref={(m) => {
              cells.current[i] = m;
            }}
            color="#d6e04a"
            emissive="#d6e04a"
            emissiveIntensity={0.04}
          />
        </mesh>
      ))}
      <mesh position={[0.9, -0.25, 0.05]}>
        <boxGeometry args={[0.42, 1.7, 0.03]} />
        <meshStandardMaterial color="#1c232e" roughness={1} />
      </mesh>
      <mesh ref={heat} position={[0.9, -1.0, 0.09]}>
        <boxGeometry args={[0.3, 1, 0.05]} />
        <meshStandardMaterial color="#ff7a1a" emissive="#ff7a1a" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.9, -0.4, 0.09]}>
        <sphereGeometry args={[0.17, 14, 12]} />
        <meshStandardMaterial ref={lamp} color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.04} />
      </mesh>
    </group>
  );
}


const WIN_N = 72;
const WIN_LO = 0.97;
const WIN_HI = 1.03;
const winX = (lam: number): number => -1.8 + ((lam - WIN_LO) / (WIN_HI - WIN_LO)) * 3.6;

/** A janela estreitissima em volta de lambda 1 onde os tres gases convertem juntos. */
function CatWindowPanel(): JSX.Element {
  const cursor = useRef<THREE.Group>(null);

  const dots = useMemo(
    () =>
      Array.from({ length: WIN_N }).map((_, i) => {
        const lam = WIN_LO + ((WIN_HI - WIN_LO) * i) / (WIN_N - 1);
        return {
          x: winX(lam),
          ox: -0.95 + oxidationEff(lam) * 1.9,
          nox: -0.95 + noxEff(lam) * 1.9,
        };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (cursor.current) cursor.current.position.x = winX(catLambda(clock.getElapsedTime()));
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.2, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* A janela: so aqui dentro os tres convertem ao mesmo tempo */}
      <mesh position={[winX(0.9995), 0, 0.05]}>
        <boxGeometry args={[0.3, 2.3, 0.02]} />
        <meshStandardMaterial color="#3ddc84" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.95, 0.05]}>
        <boxGeometry args={[3.7, 0.03, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      <mesh position={[0, 0.95, 0.05]}>
        <boxGeometry args={[3.7, 0.03, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      {dots.map((d, i) => (
        <group key={i}>
          <mesh position={[d.x, d.ox, 0.09]}>
            <boxGeometry args={[0.05, 0.05, 0.03]} />
            <meshStandardMaterial color="#e0a44a" emissive="#e0a44a" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[d.x, d.nox, 0.09]}>
            <boxGeometry args={[0.05, 0.05, 0.03]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}
      <group ref={cursor}>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.05, 2.4, 0.04]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );
}

/** Frio ele nao converte: a conversao so sobe depois do light-off. */
function CatLightoffPanel(): JSX.Element {
  const temp = useRef<THREE.Mesh>(null);
  const conv = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const tc = catTempC(t);
    if (temp.current) {
      const h = Math.max(0.05, Math.min(1, tc / 900) * 1.7);
      temp.current.scale.y = h;
      temp.current.position.y = -1.0 + h / 2;
    }
    if (conv.current) {
      const h = Math.max(0.05, catEfficiency(t) * 1.7);
      conv.current.scale.y = h;
      conv.current.position.y = -1.0 + h / 2;
    }
    if (lamp.current) lamp.current.emissiveIntensity = tc > CAT_LIGHTOFF_C ? 1.8 : 0.04;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.0, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, -0.15, 0.05]}>
          <boxGeometry args={[0.5, 1.8, 0.03]} />
          <meshStandardMaterial color="#1c232e" roughness={1} />
        </mesh>
      ))}
      {/* Linha do light-off, em volta de 280 graus */}
      <mesh position={[-0.7, -1.0 + (CAT_LIGHTOFF_C / 900) * 1.7, 0.1]}>
        <boxGeometry args={[0.66, 0.05, 0.03]} />
        <meshStandardMaterial color="#e05a44" emissive="#e05a44" emissiveIntensity={1.0} />
      </mesh>
      <mesh ref={temp} position={[-0.7, -1.0, 0.09]}>
        <boxGeometry args={[0.36, 1, 0.05]} />
        <meshStandardMaterial color="#ff7a1a" emissive="#ff7a1a" emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={conv} position={[0.7, -1.0, 0.09]}>
        <boxGeometry args={[0.36, 1, 0.05]} />
        <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 1.05, 0.1]}>
        <sphereGeometry args={[0.13, 14, 12]} />
        <meshStandardMaterial ref={lamp} color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.04} />
      </mesh>
    </group>
  );
}

const PAIR_N = 56;

/** O teste do catalisador: a sonda de antes serrilha, a de depois fica parada. */
function LambdaPairTrace(): JSX.Element {
  const pre = useRef<(THREE.Mesh | null)[]>([]);
  const post = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < PAIR_N; i += 1) {
      const back = (1 - i / (PAIR_N - 1)) * 7;
      const a = pre.current[i];
      if (a) a.position.y = 0.62 + (preLambdaV(t - back) - 0.5) * 1.2;
      const b = post.current[i];
      if (b) b.position.y = -0.78 + (postLambdaV(t - back) - 0.5) * 1.2;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.4, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {[0.62, -0.78].map((y) => (
        <mesh key={y} position={[0, y, 0.05]}>
          <boxGeometry args={[3.9, 0.03, 0.02]} />
          <meshStandardMaterial color="#3a4453" />
        </mesh>
      ))}
      {Array.from({ length: PAIR_N }).map((_, i) => (
        <group key={i}>
          <mesh
            ref={(m) => {
              pre.current[i] = m;
            }}
            position={[-1.95 + (i / (PAIR_N - 1)) * 3.9, 0.62, 0.09]}
          >
            <boxGeometry args={[0.06, 0.06, 0.03]} />
            <meshStandardMaterial color="#e0a44a" emissive="#e0a44a" emissiveIntensity={1.3} />
          </mesh>
          <mesh
            ref={(m) => {
              post.current[i] = m;
            }}
            position={[-1.95 + (i / (PAIR_N - 1)) * 3.9, -0.78, 0.09]}
          >
            <boxGeometry args={[0.06, 0.06, 0.03]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}


/** Graos de carvao ativado: posicoes fixas para nao piscar entre os quadros. */
const CARBON_GRAINS: [number, number, number, number][] = Array.from({ length: 90 }, (_, i) => {
  const a = i * 2.399963;
  const r = Math.sqrt((i + 0.5) / 90);
  return [
    Math.cos(a) * r * 0.6,
    -0.52 + (((i * 37) % 100) / 100) * 0.86,
    Math.sin(a) * r * 0.3,
    0.05 + ((i * 53) % 100) / 2400,
  ];
});

/** Canister: caixa de carvao ativado que retem os vapores do tanque. */
function Canister(): JSX.Element {
  return (
    <group>
      {/* Carcaca aberta: da para ver o carvao la dentro */}
      <mesh>
        <boxGeometry args={[1.5, 1.3, 0.9]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.66, 0]}>
        <boxGeometry args={[1.5, 0.06, 0.9]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {CARBON_GRAINS.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <dodecahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color="#16181d" metalness={0} roughness={1} />
        </mesh>
      ))}
      {/* Telas que seguram o carvao no lugar */}
      {[0.42, -0.5].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.32, 0.03, 0.78]} />
          <meshStandardMaterial color="#6b7383" metalness={0.6} roughness={0.6} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* Tres bocais: cada um faz uma coisa diferente */}
      {(
        [
          [-0.45, '#c2610a'],
          [0, '#e08a1e'],
          [0.45, '#5b9bd5'],
        ] as [number, string][]
      ).map(([x, c]) => (
        <group key={x} position={[x, 0.85, 0]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.14, 0.4, 14]} />
            <meshStandardMaterial {...PLASTIC_GREY} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <torusGeometry args={[0.13, 0.035, 8, 18]} />
            <meshStandardMaterial color={c} metalness={0.3} roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Suporte de fixacao */}
      <mesh position={[-0.85, -0.2, 0]}>
        <boxGeometry args={[0.22, 0.7, 0.6]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
    </group>
  );
}

/**
 * Valvula de purga do canister: solenoide que a ECU abre em PWM.
 * O embolo pulsa com a mesma funcao do fluxo da cena, entao vapor e embolo andam juntos.
 */
function PurgeValve(): JSX.Element {
  const plunger = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Group>(null);
  const coil = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const duty = throttleOpening(state.clock.elapsedTime);
    // Frequencia fixa, tempo ligado variavel: e assim que o PWM funciona.
    const on = (state.clock.elapsedTime * 11) % 1 < duty ? 1 : 0;
    const lift = on * 0.16;
    if (plunger.current) plunger.current.position.x = -0.12 - lift;
    if (spring.current) spring.current.scale.x = 1 - lift * 1.9;
    if (coil.current) coil.current.emissiveIntensity = on * 0.9;
  });

  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.9, 20, 1, true]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Bobina do solenoide: acende quando o pulso esta ligado */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.46, 20]} />
          <meshStandardMaterial {...COPPER} emissive="#e08a1e" emissiveIntensity={0} ref={coil} />
        </mesh>
        {[-0.3, 0.06].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.37, 0.37, 0.05, 20]} />
            <meshStandardMaterial {...PLASTIC_GREY} />
          </mesh>
        ))}
      </group>
      {/* Embolo e o assento que ele fecha */}
      <group ref={plunger} position={[-0.12, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.42, 14]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
        <mesh position={[0.24, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.13, 0.16, 14]} />
          <meshStandardMaterial {...RUBBER} />
        </mesh>
      </group>
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.19, 0.1, 0.14, 16, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} side={THREE.DoubleSide} />
      </mesh>
      {/* Mola: e ela que mantem a valvula fechada sem energia */}
      <group ref={spring} position={[-0.52, 0, 0]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[i * 0.045, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.11, 0.018, 6, 16]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        ))}
      </group>
      {/* Bocais de mangueira nas duas pontas */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.72, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.16, 0.55, 14]} />
          <meshStandardMaterial {...PLASTIC_GREY} />
        </mesh>
      ))}
      {/* Conector de 2 vias */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.34]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 0.78, 0]}>
          <boxGeometry args={[0.05, 0.18, 0.05]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Orelha de fixacao */}
      <mesh position={[0, -0.05, -0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.08]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
    </group>
  );
}

/** Tanque com a tampa: a tampa mal fechada e a causa numero um de codigo EVAP. */
function FuelTankCap(): JSX.Element {
  return (
    <group>
      <mesh>
        <boxGeometry args={[2.2, 1.1, 1.2]} />
        <meshStandardMaterial color="#4a5364" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Gasolina la no fundo e o vapor em cima dela */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[2.1, 0.45, 1.1]} />
        <meshStandardMaterial color="#c2610a" transparent opacity={0.55} />
      </mesh>
      {/* Bocal de abastecimento com a tampa rosqueada */}
      <mesh position={[-0.7, 0.75, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.22, 0.22, 0.7, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[-0.86, 1.05, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.22, 18]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[-0.92, 1.16, 0]} rotation={[0, 0, -0.5]}>
        <torusGeometry args={[0.22, 0.035, 8, 20]} />
        <meshStandardMaterial color="#3f9d4a" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Saida de vapor para o canister */}
      <mesh position={[0.75, 0.68, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.55, 14]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Bomba de alta pressao da injecao direta: acionada pelo comando. */
const PUMP_CAM_BASE = 0.26;
const PUMP_CAM_LIFT = 0.2;
const PUMP_CAM_SPEED = 2.0;

/** Raio do came em funcao do angulo: mesma conta desenha o lobo e move o tucho. */
function lobeRadius(theta: number, lobes: number, base: number, lift: number): number {
  const s = Math.sin(lobes * theta);
  return base + lift * (s > 0 ? s * s : 0);
}

/** Curso do tucho (0 a 1) no instante t, lido do lobo que esta virado para cima. */
function pumpLift(t: number): number {
  const a = t * PUMP_CAM_SPEED;
  return (lobeRadius(Math.PI / 2 + a, 3, PUMP_CAM_BASE, PUMP_CAM_LIFT) - PUMP_CAM_BASE) / PUMP_CAM_LIFT;
}

function useLobeGeometry(lobes: number, base: number, lift: number, depth: number): THREE.ExtrudeGeometry {
  return useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i <= 96; i++) {
      const th = (i / 96) * Math.PI * 2;
      const r = lobeRadius(th, lobes, base, lift);
      const x = Math.cos(th) * r;
      const y = Math.sin(th) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 4 });
    geo.translate(0, 0, -depth / 2);
    return geo;
  }, [lobes, base, lift, depth]);
}

/** Trecho do comando com o ressalto de tres lobos que so serve para a bomba de alta. */
function PumpDrive(): JSX.Element {
  const pumpLobe = useLobeGeometry(3, PUMP_CAM_BASE, PUMP_CAM_LIFT, 0.34);
  const valveLobe = useLobeGeometry(1, 0.22, 0.16, 0.22);
  const shaft = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (shaft.current) shaft.current.rotation.x = clock.getElapsedTime() * PUMP_CAM_SPEED;
  });
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 3.0, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {[-1.12, 1.12].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.26, 20]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
      ))}
      <group ref={shaft}>
        <mesh geometry={pumpLobe} rotation={[0, -Math.PI / 2, 0]}>
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
        {/* Lobos comuns de valvula ao lado: o da bomba e um ressalto a mais no mesmo eixo. */}
        {[-0.62, 0.62].map((x, i) => (
          <group key={x} rotation={[i === 0 ? 2.1 : -2.1, 0, 0]}>
            <mesh geometry={valveLobe} position={[x, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <meshStandardMaterial {...METAL} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Bomba de alta em corte: o lobo levanta o tucho, o tucho levanta o pistao. */
function HpFuelPump(): JSX.Element {
  const plunger = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Group>(null);
  const inlet = useRef<THREE.Mesh>(null);
  const outlet = useRef<THREE.Mesh>(null);
  const meter = useRef<THREE.Mesh>(null);
  const coil = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const lift = pumpLift(t);
    const rising = pumpLift(t + 0.03) > lift;
    if (plunger.current) plunger.current.position.y = 0.2 * lift;
    if (spring.current) spring.current.scale.y = 1 - 0.5 * lift;
    // Na descida entra combustivel; so na subida a pressao vence a valvula de saida.
    if (inlet.current) inlet.current.position.y = 0.64 - (rising ? 0 : 0.08);
    if (outlet.current) outlet.current.position.y = 0.64 + (rising && lift > 0.08 ? 0.08 : 0);
    const duty = throttleOpening(t);
    if (meter.current) meter.current.position.x = -1.02 - 0.14 * duty;
    if (coil.current) coil.current.emissiveIntensity = 0.15 + duty * 0.9;
  });
  return (
    <group>
      {/* Carcaca em corte: da para ver o pistao e a camara */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 1.0, 24, 1, true]} />
        <meshStandardMaterial color="#9aa3af" metalness={0.7} roughness={0.5} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Paredes da camisa onde o pistao corre */}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.05, 0]}>
          <boxGeometry args={[0.06, 0.9, 0.5]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      {/* Cabecote com os dutos e as duas valvulas de retencao */}
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.24, 24, 1, true]} />
        <meshStandardMaterial {...METAL} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.46, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.4, 12]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0.46, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.4, 12]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.64, 0]}>
          <cylinderGeometry args={[0.13, 0.09, 0.12, 14]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      <mesh ref={inlet} position={[-0.2, 0.64, 0]}>
        <sphereGeometry args={[0.08, 14, 12]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      <mesh ref={outlet} position={[0.2, 0.64, 0]}>
        <sphereGeometry args={[0.08, 14, 12]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {/* Amortecedor de pulsacao no topo */}
      <mesh position={[0, 0.93, 0]}>
        <cylinderGeometry args={[0.46, 0.52, 0.34, 22]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.04, 8, 24]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Flange de fixacao no cabecote do motor */}
      <mesh position={[0, -0.44, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.14, 22]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {/* Valvula dosadora: estrangula a entrada e decide quanto entra por golpe */}
      <mesh position={[-0.95, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.62, 18]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[-0.95, 0.62, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.24, 0.09, 10, 24]} />
        <meshStandardMaterial ref={coil} {...COPPER} emissive="#e08a1e" emissiveIntensity={0.15} />
      </mesh>
      <mesh ref={meter} position={[-1.02, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.32, 14]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      <mesh position={[-1.5, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.14, 0.5, 14]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[-0.95, 1.02, 0]}>
        <boxGeometry args={[0.38, 0.34, 0.36]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[-1.1, -0.8].map((x) => (
        <mesh key={x} position={[x, 1.24, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.18, 8]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Saida de alta pressao */}
      <mesh position={[0.72, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.22, 6]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[1.05, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 14]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Mola de retorno: encurta quando o tucho sobe */}
      <group ref={spring} position={[0, -0.45, 0]}>
        {[-0.08, -0.16, -0.24, -0.32, -0.4].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.035, 8, 20]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        ))}
      </group>
      {/* Conjunto movel: pistao, haste, tucho e rolete */}
      <group ref={plunger}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 20]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
        {[0.0, -0.18].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.025, 8, 20]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        ))}
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.6, 14]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.3, 18]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
        <mesh position={[0, -1.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.36, 16]} />
          <meshStandardMaterial {...STEEL_DARK} />
        </mesh>
      </group>
    </group>
  );
}

/** Valvula EGR: devolve parte dos gases de escape para a admissao. */
const EGR_PIN_Y = [0.8, 0.92, 1.04, 1.16, 1.28];

/** EGR em corte: a haste sai da sede so na faixa do meio de carga. */
function EgrValve(): JSX.Element {
  const pintle = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Group>(null);
  const gear = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const d = egrDuty(clock.getElapsedTime());
    if (pintle.current) pintle.current.position.y = -0.34 + 0.3 * d;
    if (spring.current) spring.current.scale.y = 1 - 0.45 * d;
    if (gear.current) gear.current.rotation.z = -0.9 * d;
  });
  return (
    <group>
      {/* Flange no coletor de escape */}
      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[1.3, 0.16, 1.0]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 12]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      <mesh position={[0, -0.71, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.42, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Camara em corte: e por aqui que o gas passa quando a haste sobe */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.2, 1.0, 0.9]} />
        <meshStandardMaterial
          color="#6b6f78"
          metalness={0.6}
          roughness={0.65}
          {...CUTAWAY}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.94, 0.74, 0.66]} />
        <meshStandardMaterial color="#2a1d18" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.05, 8, 24]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Crosta de carvao: o defeito numero um desta valvula */}
      <mesh position={[0, -0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.31, 0.05, 8, 24]} />
        <meshStandardMaterial color="#1a1512" metalness={0.1} roughness={0.95} />
      </mesh>
      <mesh position={[0.85, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.5, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <group ref={pintle} position={[0, -0.34, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.24, 0.22, 18]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.15, 12]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      </group>
      {/* Mola de retorno: sem corrente ela fecha a valvula sozinha */}
      <group ref={spring} position={[0, 0.42, 0]}>
        {[-0.06, -0.15, -0.24, -0.33, -0.42].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.14, 0.028, 8, 20]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        ))}
      </group>
      {/* Atuador em corte: motor, engrenagem e o sensor que confere a posicao */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.1, 0.9, 0.9]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.3, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.19, 0.19, 0.5, 18]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      <mesh position={[-0.22, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <group ref={gear} position={[0.05, 1.0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.1, 24]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
        <mesh position={[0, 0.19, 0.06]}>
          <boxGeometry args={[0.06, 0.14, 0.04]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      </group>
      <mesh position={[0.36, 1.2, 0]}>
        <boxGeometry args={[0.3, 0.26, 0.18]} />
        <meshStandardMaterial color="#1f2a3a" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.78, 1.04, 0]}>
        <boxGeometry args={[0.42, 0.62, 0.5]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {EGR_PIN_Y.map((y) => (
        <mesh key={y} position={[1.06, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

/** Radiador de EGR: o gas quente passa por dentro dos tubos e sai mais frio. */
function EgrCooler(): JSX.Element {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 1.4, 20, 1, true]} />
        <meshStandardMaterial
          color="#8a9099"
          metalness={0.7}
          roughness={0.5}
          {...CUTAWAY}
          side={THREE.DoubleSide}
        />
      </mesh>
      {[
        [0.16, 0.14],
        [0.16, -0.14],
        [-0.16, 0.14],
        [-0.16, -0.14],
      ].map(([y, z]) => (
        <mesh key={`${y},${z}`} position={[0, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 1.5, 12]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.12, 20]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      ))}
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.45, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.35, 12]} />
          <meshStandardMaterial color="#2f6fb0" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

const EGR_BAND_LO = 0.25;
const EGR_BAND_HI = 0.72;
function loadToX(load: number): number {
  return -1.5 + 3.0 * load;
}

/** Escala de carga com a janela em que a EGR pode abrir. */
function EgrBand(): JSX.Element {
  const marker = useRef<THREE.Group>(null);
  const dot = useRef<THREE.Mesh>(null);
  const off = useRef(new THREE.Color('#8b93a1')).current;
  const on = useRef(new THREE.Color('#4ade80')).current;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (marker.current) marker.current.position.x = loadToX(throttleOpening(t));
    const m = dot.current?.material as THREE.MeshStandardMaterial | undefined;
    if (!m) return;
    const d = egrDuty(t);
    m.color.copy(off).lerp(on, d);
    m.emissive.copy(m.color);
    m.emissiveIntensity = 0.15 + 0.85 * d;
  });
  return (
    <group>
      <mesh>
        <boxGeometry args={[3.6, 1.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.2, 0.07]}>
        <boxGeometry args={[3.0, 0.16, 0.04]} />
        <meshStandardMaterial color="#2a3140" />
      </mesh>
      <mesh position={[(loadToX(EGR_BAND_LO) + loadToX(EGR_BAND_HI)) / 2, -0.2, 0.09]}>
        <boxGeometry args={[loadToX(EGR_BAND_HI) - loadToX(EGR_BAND_LO), 0.16, 0.04]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.35} />
      </mesh>
      {[0, 1].map((load) => (
        <mesh key={load} position={[loadToX(load), -0.2, 0.1]}>
          <boxGeometry args={[0.04, 0.36, 0.03]} />
          <meshStandardMaterial color="#9aa4b2" />
        </mesh>
      ))}
      <group ref={marker} position={[loadToX(0.04), 0, 0]}>
        <mesh position={[0, 0.18, 0.12]}>
          <boxGeometry args={[0.05, 0.62, 0.03]} />
          <meshStandardMaterial color="#cfd6e2" emissive="#cfd6e2" emissiveIntensity={0.5} />
        </mesh>
        <mesh ref={dot} position={[0, -0.2, 0.14]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color="#8b93a1" emissive="#8b93a1" emissiveIntensity={0.15} />
        </mesh>
      </group>
    </group>
  );
}


/** Sensor de temperatura dos gases de escape (EGT): sonda longa e cabo blindado. */
function EgtSensor(): JSX.Element {
  const tip = useRef<THREE.MeshStandardMaterial>(null);
  const elem = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const u = Math.max(0, Math.min(1, (egtTempC(clock.getElapsedTime()) - 300) / 800));
    if (tip.current) tip.current.emissiveIntensity = 0.03 + 2.2 * u;
    if (elem.current) elem.current.emissiveIntensity = 0.05 + 2.6 * u;
  });

  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.32, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 16, 1, true]} />
        <meshStandardMaterial {...METAL_DARK} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {/* Haste longa que entra no fluxo dos gases, aberta para ver os condutores */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 1.1, 14, 1, true]} />
        <meshStandardMaterial {...METAL} {...CUTAWAY} side={THREE.DoubleSide} />
      </mesh>
      {[-0.03, 0.03].map((x) => (
        <mesh key={x} position={[x, -0.8, 0]}>
          <boxGeometry args={[0.02, 1.0, 0.02]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
      {/* Elemento de platina: e ele que muda de resistencia */}
      <mesh position={[0, -1.36, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.16, 12]} />
        <meshStandardMaterial ref={elem} color="#d8dde5" emissive="#ff9a3c" emissiveIntensity={0.05} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.45, 0]}>
        <sphereGeometry args={[0.085, 12, 10]} />
        <meshStandardMaterial ref={tip} color="#5a6070" emissive="#ff7a1a" emissiveIntensity={0.03} metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Cabo blindado trancado */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 0.45 + i * 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.075, 0.032, 8, 16]} />
          <meshStandardMaterial color="#8d949f" metalness={0.75} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[0.34, 0.3, 0.28]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* As duas vias do conector */}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 1.75, 0.15]}>
          <boxGeometry args={[0.05, 0.2, 0.02]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}

const PTC_N = 64;
const egtCurveX = (tempC: number): number => -1.7 + (tempC / 1100) * 3.4;
const egtCurveY = (ohm: number): number =>
  Math.max(-1.0, Math.min(1.0, -1.0 + ((Math.log10(ohm) - 1.5) / 2.5) * 2));

/** PTC de platina contra NTC: uma sobe com o calor, a outra desaba. */
function PtcCurve(): JSX.Element {
  const cursor = useRef<THREE.Mesh>(null);

  const ptc = useMemo(
    () =>
      Array.from({ length: PTC_N }).map((_, i) => {
        const temp = (1100 * i) / (PTC_N - 1);
        return { x: egtCurveX(temp), y: egtCurveY(ptcOhm(temp)) };
      }),
    [],
  );
  // A curva do NTC so faz sentido na faixa baixa; e ela que mergulha.
  const ntc = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => {
        const temp = (300 * i) / 23;
        return { x: egtCurveX(temp), y: egtCurveY(ntcOhm(temp)) };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!cursor.current) return;
    const temp = egtTempC(clock.getElapsedTime());
    cursor.current.position.set(egtCurveX(temp), egtCurveY(ptcOhm(temp)), 0.14);
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.0, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[-1.75, 0, 0.05]}>
        <boxGeometry args={[0.03, 2.2, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      <mesh position={[0, -1.05, 0.05]}>
        <boxGeometry args={[3.6, 0.03, 0.02]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      {ntc.map((d, i) => (
        <mesh key={`n${i}`} position={[d.x, d.y, 0.08]}>
          <boxGeometry args={[0.05, 0.05, 0.03]} />
          <meshStandardMaterial color="#4a5568" emissive="#4a5568" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {ptc.map((d, i) => (
        <mesh key={`p${i}`} position={[d.x, d.y, 0.1]}>
          <boxGeometry args={[0.055, 0.055, 0.03]} />
          <meshStandardMaterial color="#ff7a1a" emissive="#ff7a1a" emissiveIntensity={1.3} />
        </mesh>
      ))}
      <mesh ref={cursor} position={[0, 0, 0.14]}>
        <sphereGeometry args={[0.11, 14, 12]} />
        <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

/** Termometro do escape com a faixa de perigo marcada. */
function EgtGauge(): JSX.Element {
  const needle = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const temp = egtTempC(clock.getElapsedTime());
    if (needle.current) {
      const u = Math.max(0, Math.min(1, temp / 1100));
      needle.current.rotation.z = (0.5 - u) * Math.PI;
    }
    if (lamp.current) lamp.current.emissiveIntensity = temp > EGT_ENRICH_C ? 1.8 : 0.04;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[2.6, 1.9, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.45, 0.07]}>
        <torusGeometry args={[0.85, 0.035, 8, 48, Math.PI]} />
        <meshStandardMaterial color="#3a4453" />
      </mesh>
      {/* Faixa vermelha do fim da escala */}
      <mesh position={[0, -0.45, 0.08]}>
        <torusGeometry args={[0.85, 0.05, 8, 20, Math.PI * 0.27]} />
        <meshStandardMaterial color="#e05a44" emissive="#e05a44" emissiveIntensity={0.9} />
      </mesh>
      {[0, 0.5, 1].map((v) => {
        const a = Math.PI * (1 - v);
        return (
          <mesh key={v} position={[Math.cos(a) * 0.85, -0.45 + Math.sin(a) * 0.85, 0.11]}>
            <boxGeometry args={[0.09, 0.09, 0.04]} />
            <meshStandardMaterial color="#9aa4b2" emissive="#9aa4b2" emissiveIntensity={0.6} />
          </mesh>
        );
      })}
      <group ref={needle} position={[0, -0.45, 0.13]}>
        <mesh position={[0, 0.39, 0]}>
          <boxGeometry args={[0.06, 0.78, 0.04]} />
          <meshStandardMaterial color="#ff7a1a" emissive="#ff7a1a" emissiveIntensity={1.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      </group>
      <mesh position={[0.95, 0.6, 0.1]}>
        <sphereGeometry args={[0.12, 14, 12]} />
        <meshStandardMaterial ref={lamp} color="#e05a44" emissive="#e05a44" emissiveIntensity={0.04} />
      </mesh>
    </group>
  );
}

const EGT_STEPS = [EGT_ENRICH_C, EGT_BOOST_C, EGT_POWER_C];

/** O que a ECU faz conforme o gas passa de cada limite. */
function EgtProtectPanel(): JSX.Element {
  const lamps = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const boost = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const temp = egtTempC(t);
    for (let i = 0; i < EGT_STEPS.length; i += 1) {
      const m = lamps.current[i];
      if (m) m.emissiveIntensity = temp > EGT_STEPS[i] ? 1.9 : 0.04;
    }
    if (boost.current) {
      const h = Math.max(0.05, egtBoost(t) * 1.5);
      boost.current.scale.y = h;
      boost.current.position.y = -0.95 + h / 2;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {EGT_STEPS.map((s, i) => (
        <group key={s} position={[-0.75, 0.75 - i * 0.75, 0.09]}>
          <mesh>
            <sphereGeometry args={[0.16, 14, 12]} />
            <meshStandardMaterial
              ref={(m) => {
                lamps.current[i] = m;
              }}
              color={i === 0 ? '#3ddc84' : i === 1 ? '#e0a44a' : '#e05a44'}
              emissive={i === 0 ? '#3ddc84' : i === 1 ? '#e0a44a' : '#e05a44'}
              emissiveIntensity={0.04}
            />
          </mesh>
          {/* Escadinha de barras: cada degrau e um limite mais alto */}
          <mesh position={[0.7 + i * 0.12, 0, 0]}>
            <boxGeometry args={[0.9 + i * 0.24, 0.07, 0.03]} />
            <meshStandardMaterial color="#3a4453" />
          </mesh>
        </group>
      ))}
      <mesh position={[1.32, -0.2, 0.05]}>
        <boxGeometry args={[0.42, 1.7, 0.03]} />
        <meshStandardMaterial color="#1c232e" roughness={1} />
      </mesh>
      <mesh ref={boost} position={[1.32, -0.95, 0.09]}>
        <boxGeometry args={[0.3, 1, 0.05]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.1} />
      </mesh>
    </group>
  );
}

const DPF_CHANNELS = 7;

/** Filtro de particulas em corte: canais tampados alternados, fuligem enchendo e queimando. */
function DpfFilter(): JSX.Element {
  const soot = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const dirtyC = useMemo(() => new THREE.Color('#101215'), []);
  const cleanC = useMemo(() => new THREE.Color('#6b7280'), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const load = sootLoad(t);
    const burning = egtTempC(t) > DPF_BURN_C ? 1 : 0;
    for (let i = 0; i < DPF_CHANNELS; i += 1) {
      const m = soot.current[i];
      if (!m) continue;
      m.color.copy(cleanC).lerp(dirtyC, load);
      m.emissive.setHex(0xff5a1a);
      m.emissiveIntensity = burning * 1.6 * (1 - load);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 2.0, 24, 1, true, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial {...METAL} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: DPF_CHANNELS }).map((_, i) => {
        const x = (i / (DPF_CHANNELS - 1) - 0.5) * 0.84;
        const plugAtEnd = i % 2 === 0;
        return (
          <group key={i} position={[x, 0, -0.05]}>
            <mesh>
              <boxGeometry args={[0.1, 1.9, 0.5]} />
              <meshStandardMaterial color="#cfc9b8" roughness={1} />
            </mesh>
            <mesh position={[0, 0, 0.04]}>
              <boxGeometry args={[0.075, 1.7, 0.46]} />
              <meshStandardMaterial
                ref={(m) => {
                  soot.current[i] = m;
                }}
                color="#6b7280"
                emissive="#ff5a1a"
                emissiveIntensity={0}
                roughness={1}
              />
            </mesh>
            {/* O tampao que obriga o gas a atravessar a parede porosa */}
            <mesh position={[0, plugAtEnd ? 0.9 : -0.9, 0.04]}>
              <boxGeometry args={[0.1, 0.16, 0.48]} />
              <meshStandardMaterial {...CERAMIC} />
            </mesh>
          </group>
        );
      })}
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh position={[0, (s * 2.4) / 2, 0]} scale={[1, s, 1]}>
            <coneGeometry args={[0.55, 0.4, 24, 1, true]} />
            <meshStandardMaterial {...METAL} side={2} />
          </mesh>
          <mesh position={[0, s * 1.45, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.5, 18]} />
            <meshStandardMaterial {...METAL_DARK} />
          </mesh>
        </group>
      ))}
    </group>
  );
}


/** Contorno em D do J1962: aresta de cima larga e os dois cantos de baixo cortados. */
function obdOutline(w: number, h: number, c: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-w, h);
  s.lineTo(w, h);
  s.lineTo(w, -h + c);
  s.lineTo(w - c, -h);
  s.lineTo(-w + c, -h);
  s.lineTo(-w, -h + c);
  s.closePath();
  return s;
}

const OBD_BODY = obdOutline(0.8, 0.37, 0.17);
const OBD_FACE = (() => {
  const s = obdOutline(0.84, 0.41, 0.18);
  s.holes.push(obdOutline(0.72, 0.29, 0.13));
  return s;
})();
const OBD_FLOOR = obdOutline(0.72, 0.29, 0.13);

/** Vias realmente montadas num carro CAN atual; as outras cavidades ficam vazias. */
const OBD_PINS: Record<number, string> = {
  4: '#7b8494',
  5: '#7b8494',
  6: '#d6b129',
  7: '#8e44ad',
  14: '#d6b129',
  16: '#c0392b',
};

/** Conector de diagnostico OBD2 de 16 vias, montado no painel. */
function ObdConnector(): JSX.Element {
  return (
    <group>
      {/* Recorte do painel embaixo do volante */}
      {[
        [0, 0.62, 2.3, 0.22],
        [0, -0.62, 2.3, 0.22],
      ].map(([x, y, w, h]) => (
        <mesh key={y} position={[x, y, -0.55]}>
          <boxGeometry args={[w, h, 0.12]} />
          <meshStandardMaterial color="#3a3f48" metalness={0.2} roughness={0.9} />
        </mesh>
      ))}
      {[-1.04, 1.04].map((x) => (
        <mesh key={x} position={[x, 0, -0.55]}>
          <boxGeometry args={[0.22, 1.02, 0.12]} />
          <meshStandardMaterial color="#3a3f48" metalness={0.2} roughness={0.9} />
        </mesh>
      ))}
      {/* Corpo e moldura da boca */}
      <mesh position={[0, 0, -0.5]}>
        <extrudeGeometry args={[OBD_BODY, { depth: 0.5, bevelEnabled: false }]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh>
        <extrudeGeometry args={[OBD_FACE, { depth: 0.12, bevelEnabled: false }]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Fundo da cavidade, recuado */}
      <mesh>
        <extrudeGeometry args={[OBD_FLOOR, { depth: 0.02, bevelEnabled: false }]} />
        <meshStandardMaterial color="#20242b" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* 16 cavidades: fileira de cima 1 a 8, de baixo 9 a 16, olhando de frente */}
      {Array.from({ length: 16 }).map((_, i) => {
        const pin = i + 1;
        const col = (pin - 1) % 8;
        const x = (col - 3.5) * 0.17;
        const y = pin <= 8 ? 0.13 : -0.13;
        const used = OBD_PINS[pin];
        return (
          <group key={pin}>
            <mesh position={[x, y, 0.025]}>
              <boxGeometry args={[0.11, 0.13, 0.02]} />
              <meshStandardMaterial color={used ?? '#0d1014'} metalness={0.2} roughness={0.7} />
            </mesh>
            {used && (
              <mesh position={[x, y, 0.045]}>
                <boxGeometry args={[0.05, 0.075, 0.03]} />
                <meshStandardMaterial {...BRASS} />
              </mesh>
            )}
          </group>
        );
      })}
      {/* Trava onde o plugue do scanner encaixa */}
      <mesh position={[0, 0.45, -0.12]}>
        <boxGeometry args={[0.42, 0.1, 0.32]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0, 0.5, 0.02]}>
        <boxGeometry args={[0.42, 0.07, 0.1]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Orelhas de fixacao */}
      {[-0.98, 0.98].map((x) => (
        <group key={x}>
          <mesh position={[x, 0, -0.3]}>
            <boxGeometry args={[0.28, 0.34, 0.14]} />
            <meshStandardMaterial {...PLASTIC_GREY} />
          </mesh>
          <mesh position={[x, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.1, 10]} />
            <meshStandardMaterial {...METAL_DARK} />
          </mesh>
        </group>
      ))}
      {/* Chicote achatado saindo por tras */}
      <mesh position={[0, -0.12, -0.82]}>
        <boxGeometry args={[0.86, 0.3, 0.5]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
    </group>
  );
}

const CAN_H_COLOR = '#d6b129';
const CAN_L_COLOR = '#8a6d10';

/** Helice do par trancado: os dois fios giram um no outro para pegar o mesmo ruido. */
function canCurve(sign: number): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(
    Array.from({ length: 140 }, (_, i) => {
      const u = i / 139;
      const a = u * Math.PI * 8;
      return new THREE.Vector3((u - 0.5) * 4.0, sign * Math.sin(a) * 0.14, sign * Math.cos(a) * 0.14);
    }),
  );
}

const CAN_H_CURVE = canCurve(1);
const CAN_L_CURVE = canCurve(-1);

/** Rede CAN: o par trancado. Os 120 ohm nao ficam aqui, ficam dentro dos modulos das pontas. */
function CanBus(): JSX.Element {
  return (
    <group>
      <mesh>
        <tubeGeometry args={[CAN_H_CURVE, 200, 0.06, 8, false]} />
        <meshStandardMaterial color={CAN_H_COLOR} metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh>
        <tubeGeometry args={[CAN_L_CURVE, 200, 0.06, 8, false]} />
        <meshStandardMaterial color={CAN_L_COLOR} metalness={0.1} roughness={0.85} />
      </mesh>
    </group>
  );
}

/** Padrao de bits que corre nas duas linhas do osciloscopio. */
const CAN_BITS = [0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0];

/**
 * Osciloscopio da CAN: em repouso as duas linhas ficam em 2,5 V; num bit, CAN H
 * sobe e CAN L desce ao mesmo tempo.
 */
function CanScope(): JSX.Element {
  const hi = useRef<THREE.Group>(null);
  const lo = useRef<THREE.Group>(null);
  useFrame((state) => {
    const shift = Math.floor(state.clock.elapsedTime * 7);
    const run = (g: THREE.Group | null, sign: number) => {
      if (!g) return;
      g.children.forEach((c, i) => {
        c.position.y = CAN_BITS[(i + shift) % CAN_BITS.length] ? sign * 0.55 : 0;
      });
    };
    run(hi.current, 1);
    run(lo.current, -1);
  });
  const seg = Array.from({ length: 26 }, (_, i) => -1.56 + i * 0.125);
  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 1.7, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.3} roughness={0.8} />
      </mesh>
      {[0.55, 0, -0.55].map((y) => (
        <mesh key={y} position={[0, y, 0.06]}>
          <boxGeometry args={[3.1, 0.02, 0.02]} />
          <meshStandardMaterial color="#4a5364" />
        </mesh>
      ))}
      <group ref={hi}>
        {seg.map((x) => (
          <mesh key={x} position={[x, 0.55, 0.1]}>
            <boxGeometry args={[0.1, 0.09, 0.05]} />
            <meshStandardMaterial color={CAN_H_COLOR} emissive={CAN_H_COLOR} emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
      <group ref={lo}>
        {seg.map((x) => (
          <mesh key={x} position={[x, -0.55, 0.1]}>
            <boxGeometry args={[0.1, 0.09, 0.05]} />
            <meshStandardMaterial color={CAN_L_COLOR} emissive={CAN_L_COLOR} emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Silhueta do motor da luz espia: aproximacao reconhecivel do simbolo ISO. */
const MIL_ICON = (() => {
  const s = new THREE.Shape();
  const p: [number, number][] = [
    [-0.3, -0.3],
    [0.34, -0.3],
    [0.34, -0.1],
    [0.46, -0.1],
    [0.46, 0.08],
    [0.34, 0.08],
    [0.34, 0.18],
    [0.04, 0.18],
    [0.04, 0.3],
    [-0.18, 0.3],
    [-0.18, 0.14],
    [-0.3, 0.14],
    [-0.46, 0.14],
    [-0.46, 0.06],
    [-0.3, 0.06],
    [-0.3, 0.0],
    [-0.46, 0.0],
    [-0.46, -0.08],
    [-0.3, -0.08],
    [-0.3, -0.14],
    [-0.46, -0.14],
    [-0.46, -0.22],
    [-0.3, -0.22],
  ];
  s.moveTo(p[0][0], p[0][1]);
  p.slice(1).forEach(([x, y]) => s.lineTo(x, y));
  s.closePath();
  return s;
})();

/** Raio vazado no meio do simbolo. */
const MIL_BOLT = (() => {
  const s = new THREE.Shape();
  const p: [number, number][] = [
    [0.02, 0.14],
    [0.15, 0.14],
    [0.07, 0.02],
    [0.15, 0.02],
    [-0.03, -0.2],
    [0.03, -0.03],
    [-0.05, -0.03],
  ];
  s.moveTo(p[0][0], p[0][1]);
  p.slice(1).forEach(([x, y]) => s.lineTo(x, y));
  s.closePath();
  return s;
})();

/**
 * Luz espia de anomalia (MIL) atras do vidro do painel. O simbolo e uma mascara
 * iluminada por LED na placa, por isso ele fica rente e nao saliente.
 */
function MilLamp({ mode = 'on' }: { mode?: 'on' | 'blink' | 'off' } = {}): JSX.Element {
  const icon = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    // Piscando e a falha de combustao acontecendo agora: por isso e rapido.
    const lit = mode === 'blink' ? Math.sin(state.clock.elapsedTime * 9) > 0 : mode === 'on';
    if (icon.current) {
      icon.current.emissiveIntensity = lit ? 1.7 : 0;
      icon.current.color.set(lit ? '#f0a41c' : '#3d3832');
    }
    if (glow.current) glow.current.opacity = lit ? 0.22 : 0;
  });
  return (
    <group>
      {/* Caixa do painel e placa com os LEDs */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[2.4, 1.7, 0.44]} />
        <meshStandardMaterial color="#232830" metalness={0.3} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, -0.28]}>
        <boxGeometry args={[2.1, 1.45, 0.05]} />
        <meshStandardMaterial color="#1d5137" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Simbolo do motor, atras do vidro */}
      <mesh position={[0, 0.05, 0.1]} scale={1.25}>
        <extrudeGeometry args={[MIL_ICON, { depth: 0.03, bevelEnabled: false }]} />
        <meshStandardMaterial ref={icon} color="#f0a41c" emissive="#ffa41b" emissiveIntensity={1.7} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0.15]} scale={1.25}>
        <extrudeGeometry args={[MIL_BOLT, { depth: 0.02, bevelEnabled: false }]} />
        <meshStandardMaterial color="#14181f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0.09]}>
        <planeGeometry args={[1.5, 1.1]} />
        <meshBasicMaterial ref={glow} color="#ffb01b" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      {/* Espias vizinhas apagadas: cambio, ABS e airbag tambem acendem no painel */}
      {[-0.8, -0.25, 0.3].map((x, i) => (
        <mesh key={x} position={[x, -0.55, 0.1]}>
          {i === 1 ? <circleGeometry args={[0.11, 20]} /> : <boxGeometry args={[0.22, 0.16, 0.03]} />}
          <meshStandardMaterial color="#39404b" roughness={0.9} />
        </mesh>
      ))}
      {/* Vidro do painel */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[2.3, 1.6, 0.05]} />
        <meshStandardMaterial color="#0d1117" metalness={0.4} roughness={0.15} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function MilLampBlink(): JSX.Element {
  return <MilLamp mode="blink" />;
}

function MilLampOff(): JSX.Element {
  return <MilLamp mode="off" />;
}

/** Imobilizador: bobina de antena em volta do comutador e a chave enfiada nele. */
function ImmobilizerAntenna(): JSX.Element {
  return (
    <group>
      {/* Cilindro da chave e bloco do comutador eletrico atras */}
      <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 1.4, 20]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[1.15, 0, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.7]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Capa da coluna, vazada para dar para ver a bobina */}
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.62, 0.62, 1.0, 20, 1, true]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} side={2} />
      </mesh>
      {/* Aro plastico da antena e as espiras de cobre dentro dele */}
      <mesh position={[-0.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.52, 0.11, 12, 28]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-0.34 + i * 0.047, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.46, 0.028, 8, 26]} />
          <meshStandardMaterial {...COPPER} />
        </mesh>
      ))}
      {/* Rabicho de dois fios e conector: a antena e passiva, so isso */}
      {[-0.26, -0.14].map((x) => (
        <mesh key={x} position={[x, -0.78, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.55, 8]} />
          <meshStandardMaterial {...RUBBER} />
        </mesh>
      ))}
      <mesh position={[-0.2, -1.15, 0]}>
        <boxGeometry args={[0.32, 0.26, 0.26]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Chave enfiada no cilindro */}
      <mesh position={[-0.95, 0, 0]}>
        <boxGeometry args={[0.95, 0.26, 0.05]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[-1.85, 0, 0]}>
        <boxGeometry args={[0.8, 0.66, 0.26]} />
        <meshStandardMaterial {...PLASTIC} {...CUTAWAY} />
      </mesh>
      {[-1.75, -1.95].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.15]}>
          <boxGeometry args={[0.16, 0.1, 0.05]} />
          <meshStandardMaterial {...PLASTIC_GREY} />
        </mesh>
      ))}
      {/* Transponder por dentro da cabeca: capsula com a bobininha dele */}
      <mesh position={[-1.85, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.32, 14]} />
        <meshStandardMaterial color="#2f6f4f" metalness={0.2} roughness={0.7} />
      </mesh>
      {[-1.94, -1.76].map((x) => (
        <mesh key={x} position={[x, -0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.12, 0.02, 8, 18]} />
          <meshStandardMaterial {...COPPER} />
        </mesh>
      ))}
      <mesh position={[-2.42, 0, 0]}>
        <torusGeometry args={[0.14, 0.04, 8, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
    </group>
  );
}

/** Bateria 12 V de chumbo-acido: caixa, tampas de celula e os dois polos. */
const BAT_CELLS = 6;

/** Bateria de chumbo acido em corte: seis celulas de pouco mais de 2 V em serie. */
function Battery(): JSX.Element {
  const fills = useRef<(THREE.Mesh | null)[]>([]);
  const post = useRef<THREE.MeshStandardMaterial>(null);
  const low = useMemo(() => new THREE.Color('#8a5a2b'), []);
  const full = useMemo(() => new THREE.Color('#3ddc84'), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const soc = socLevel(t);
    for (let i = 0; i < BAT_CELLS; i += 1) {
      const m = fills.current[i];
      if (!m) continue;
      const h = Math.max(0.08, soc * 1.05);
      m.scale.y = h;
      m.position.y = -0.62 + h / 2;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.color.copy(low).lerp(full, soc);
      mat.emissive.copy(mat.color);
      mat.emissiveIntensity = 0.4 + 0.9 * soc;
    }
    // O polo positivo acende no tranco: sao centenas de amperes de uma vez.
    if (post.current) post.current.emissiveIntensity = 0.02 + (crankAmps(t) / 380) * 2.2;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[2.0, 1.5, 1.2]} />
        <meshStandardMaterial color="#1e2836" metalness={0.15} roughness={0.75} transparent opacity={0.32} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.0, 0.16, 1.2]} />
        <meshStandardMaterial color="#2c3746" metalness={0.15} roughness={0.7} />
      </mesh>
      {Array.from({ length: BAT_CELLS }).map((_, i) => {
        const cx = -0.8333 + i * 0.3333;
        return (
          <group key={i} position={[cx, 0, 0]}>
            {/* Placas de chumbo mergulhadas no eletrolito */}
            {[-0.1, 0, 0.1].map((dx) => (
              <mesh key={dx} position={[dx, -0.05, -0.1]}>
                <boxGeometry args={[0.035, 1.05, 0.7]} />
                <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.6} />
              </mesh>
            ))}
            <mesh
              ref={(m) => {
                fills.current[i] = m;
              }}
              position={[0, -0.1, 0.22]}
            >
              <boxGeometry args={[0.24, 1, 0.12]} />
              <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.9} transparent opacity={0.75} />
            </mesh>
            {/* Ponte que liga esta celula na proxima */}
            {i < BAT_CELLS - 1 && (
              <mesh position={[0.1667, 0.66, 0]}>
                <boxGeometry args={[0.22, 0.09, 0.5]} />
                <meshStandardMaterial {...METAL_DARK} />
              </mesh>
            )}
            <mesh position={[0, 0.92, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.1, 12]} />
              <meshStandardMaterial color="#3a4657" metalness={0.1} roughness={0.8} />
            </mesh>
          </group>
        );
      })}
      {Array.from({ length: BAT_CELLS - 1 }).map((_, i) => (
        <mesh key={`d${i}`} position={[-0.6667 + i * 0.3333, -0.05, 0]}>
          <boxGeometry args={[0.03, 1.4, 1.0]} />
          <meshStandardMaterial color="#2c3746" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[-0.72, 1.06, 0.36]}>
        <cylinderGeometry args={[0.15, 0.18, 0.28, 14]} />
        <meshStandardMaterial ref={post} color="#c0392b" emissive="#ff5a44" emissiveIntensity={0.02} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.72, 1.06, 0.36]}>
        <cylinderGeometry args={[0.13, 0.16, 0.26, 14]} />
        <meshStandardMaterial color="#111417" metalness={0.6} roughness={0.45} />
      </mesh>
    </group>
  );
}

/** Alternador: depois que o motor pega, e ele que sustenta o carro. */
function Alternator(): JSX.Element {
  const spin = useRef<THREE.Group>(null);
  const out = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const running = sysPhase(t) === 2;
    if (spin.current && running) spin.current.rotation.x += delta * 14;
    if (out.current) out.current.emissiveIntensity = running ? 1.8 : 0.03;
  });

  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.45, 0.7, 24]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.25, 24]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <group ref={spin} position={[-0.42, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 20]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0.16, 0, 0]} rotation={[(i / 6) * Math.PI * 2, 0, 0]}>
            <boxGeometry args={[0.04, 0.44, 0.1]} />
            <meshStandardMaterial color="#9aa4b2" metalness={0.6} roughness={0.5} />
          </mesh>
        ))}
      </group>
      {/* Borne B+: e daqui que sai a carga */}
      <mesh position={[0.5, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.24, 10]} />
        <meshStandardMaterial ref={out} color="#c0392b" emissive="#ff5a44" emissiveIntensity={0.03} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Motor de partida: corrente enorme e curta, so no arranque. */
function StarterMotor(): JSX.Element {
  const body = useRef<THREE.MeshStandardMaterial>(null);
  const pinion = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const u = crankAmps(t) / 380;
    if (body.current) body.current.emissiveIntensity = 0.02 + u * 1.9;
    if (pinion.current) pinion.current.position.x = 0.6 + (u > 0.05 ? 0.14 : 0);
  });

  return (
    <group>
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 1.1, 24]} />
        <meshStandardMaterial ref={body} color="#3a4657" emissive="#ff7a1a" emissiveIntensity={0.02} metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Automatico: e ele que joga o pinhao na cremalheira */}
      <mesh position={[-0.15, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.8, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh ref={pinion} position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.35, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[-0.82, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 10]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
    </group>
  );
}

const VOLT_N = 64;
const voltY = (v: number): number => -1.25 + ((v - 8) / 7) * 2.5;

/** A tensao da rede ao longo de um ciclo inteiro do carro. */
function VoltTracePanel(): JSX.Element {
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const crank = useRef<THREE.MeshStandardMaterial>(null);
  const charge = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < VOLT_N; i += 1) {
      const m = dots.current[i];
      if (!m) continue;
      m.position.y = voltY(busVolts(t - (1 - i / (VOLT_N - 1)) * 24));
    }
    const phase = sysPhase(t);
    if (crank.current) crank.current.emissiveIntensity = phase === 1 ? 1.9 : 0.04;
    if (charge.current) charge.current.emissiveIntensity = phase === 2 ? 1.9 : 0.04;
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.4, 2.8, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Janela do alternador: 13,8 a 14,4 V */}
      <mesh position={[0, voltY(14.1), 0.05]}>
        <boxGeometry args={[4.0, voltY(14.4) - voltY(13.8), 0.02]} />
        <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.6} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, voltY(12.6), 0.05]}>
        <boxGeometry args={[4.0, 0.025, 0.02]} />
        <meshStandardMaterial color="#8a8f98" />
      </mesh>
      {/* Piso da partida: abaixo daqui a bateria nao aguenta mais */}
      <mesh position={[0, voltY(9.5), 0.05]}>
        <boxGeometry args={[4.0, 0.035, 0.02]} />
        <meshStandardMaterial color="#e05a44" emissive="#e05a44" emissiveIntensity={1.1} />
      </mesh>
      {Array.from({ length: VOLT_N }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            dots.current[i] = m;
          }}
          position={[-2.0 + (i / (VOLT_N - 1)) * 4.0, 0, 0.1]}
        >
          <boxGeometry args={[0.055, 0.055, 0.03]} />
          <meshStandardMaterial color="#e0a44a" emissive="#e0a44a" emissiveIntensity={1.3} />
        </mesh>
      ))}
      <mesh position={[-1.6, -1.15, 0.09]}>
        <sphereGeometry args={[0.14, 14, 12]} />
        <meshStandardMaterial ref={crank} color="#e05a44" emissive="#e05a44" emissiveIntensity={0.04} />
      </mesh>
      <mesh position={[-1.1, -1.15, 0.09]}>
        <sphereGeometry args={[0.14, 14, 12]} />
        <meshStandardMaterial ref={charge} color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.04} />
      </mesh>
    </group>
  );
}

const MS_SCALE = 0.42;

/** O mesmo pedido de combustivel custa mais tempo de comando com tensao baixa. */
function DeadTimePanel(): JSX.Element {
  const dead = useRef<THREE.Mesh>(null);
  const open = useRef<THREE.Mesh>(null);
  const total = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const v = busVolts(clock.getElapsedTime());
    const d = injDeadTimeMs(v) * MS_SCALE;
    if (dead.current) {
      dead.current.scale.x = d;
      dead.current.position.x = -1.5 + d / 2;
    }
    if (open.current) open.current.position.x = -1.5 + d + (3.2 * MS_SCALE) / 2;
    // Barra do comando inteiro: e esse numero que aparece no scanner.
    if (total.current) {
      const w = injPulseMs(v) * MS_SCALE;
      total.current.scale.x = w;
      total.current.position.x = -1.5 + w / 2;
    }
  });

  const refDead = injDeadTimeMs(10) * MS_SCALE;

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.6, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {[0.55, -0.55].map((y) => (
        <mesh key={y} position={[0, y - 0.32, 0.05]}>
          <boxGeometry args={[3.2, 0.02, 0.02]} />
          <meshStandardMaterial color="#3a4453" />
        </mesh>
      ))}
      {/* Linha de cima: a tensao de agora */}
      <mesh ref={dead} position={[-1.5, 0.55, 0.09]}>
        <boxGeometry args={[1, 0.34, 0.04]} />
        <meshStandardMaterial color="#e05a44" emissive="#e05a44" emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={open} position={[0, 0.55, 0.09]}>
        <boxGeometry args={[3.2 * MS_SCALE, 0.34, 0.04]} />
        <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={total} position={[-1.5, 1.02, 0.09]}>
        <boxGeometry args={[1, 0.1, 0.04]} />
        <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.0} />
      </mesh>
      {/* Linha de baixo: referencia fixa de 10 V, para comparar */}
      <mesh position={[-1.5 + refDead / 2, -0.55, 0.09]}>
        <boxGeometry args={[refDead, 0.34, 0.04]} />
        <meshStandardMaterial color="#8a5a2b" emissive="#e05a44" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-1.5 + refDead + (3.2 * MS_SCALE) / 2, -0.55, 0.09]}>
        <boxGeometry args={[3.2 * MS_SCALE, 0.34, 0.04]} />
        <meshStandardMaterial color="#2f6b4a" emissive="#3ddc84" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-1.5 + (injPulseMs(10) * MS_SCALE) / 2, -1.02, 0.09]}>
        <boxGeometry args={[injPulseMs(10) * MS_SCALE, 0.1, 0.04]} />
        <meshStandardMaterial color="#8a6d10" emissive="#ffd93b" emissiveIntensity={0.4} />
      </mesh>
      {/* Comeco do comando: os dois pulsos partem daqui */}
      <mesh position={[-1.5, 0, 0.12]}>
        <boxGeometry args={[0.03, 2.0, 0.03]} />
        <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.0} />
      </mesh>
    </group>
  );
}

/** Terra bom contra terra oxidado, e o que a queda faz com o sinal do sensor. */
function GroundDropPanel(): JSX.Element {
  const bars = useRef<(THREE.Mesh | null)[]>([]);
  const marks = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    [false, true].forEach((bad, i) => {
      const drop = groundDropV(t, bad);
      const b = bars.current[i];
      if (b) {
        const w = Math.max(0.03, drop * 5.0);
        b.scale.x = w;
        b.position.x = -1.3 + w / 2;
      }
      // O sinal do sensor sobe junto com a queda: e isso que engana a ECU.
      const m = marks.current[i];
      if (m) m.position.y = (i === 0 ? 0.6 : -0.6) - 0.45 + drop * 1.6;
    });
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 2.6, 0.1]} />
        <meshStandardMaterial color="#12161c" metalness={0.2} roughness={0.8} />
      </mesh>
      {[0.6, -0.6].map((y, i) => (
        <group key={y} position={[0, y, 0]}>
          <mesh position={[-0.1, 0, 0.05]}>
            <boxGeometry args={[2.6, 0.02, 0.02]} />
            <meshStandardMaterial color="#3a4453" />
          </mesh>
          <mesh
            ref={(m) => {
              bars.current[i] = m;
            }}
            position={[-1.3, -0.3, 0.09]}
          >
            <boxGeometry args={[1, 0.2, 0.04]} />
            <meshStandardMaterial
              color={i === 0 ? '#3ddc84' : '#e05a44'}
              emissive={i === 0 ? '#3ddc84' : '#e05a44'}
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh
            ref={(m) => {
              marks.current[i] = m;
            }}
            position={[1.3, 0, 0.1]}
          >
            <sphereGeometry args={[0.12, 12, 10]} />
            <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}
      {/* Limite de 0,1 V: passou daqui, limpe e reaperte o terra */}
      <mesh position={[-1.3 + GROUND_LIMIT_V * 5.0, 0, 0.12]}>
        <boxGeometry args={[0.03, 2.2, 0.03]} />
        <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={1.1} />
      </mesh>
    </group>
  );
}


/** Registro de pecas por id. */
export const PART_MODELS: Record<string, () => JSX.Element> = {
  'golf-fsi-piston': GolfPistonCatalogPart,
  injector: Injector,
  'ignition-coil': IgnitionCoil,
  'spark-gap': SparkGap,
  'coil-scope': CoilScope,
  'ignition-timing-gauge': IgnitionTimingGauge,
  'phase-trace': PhaseTrace,
  'sequential-panel': SequentialPanel,
  'cam-phaser': CamPhaser,
  'water-jacket': WaterJacket,
  'ntc-curve': NtcCurve,
  'divider-panel': DividerPanel,
  'rad-fan': RadFan,
  'temp-gauge-cluster': TempGaugeCluster,
  'pump-cell-panel': PumpCellPanel,
  'lambda-compare': LambdaCompare,
  'lambda-gauge': LambdaGauge,
  'heater-pwm-panel': HeaterPwmPanel,
  'cat-window-panel': CatWindowPanel,
  'cat-lightoff-panel': CatLightoffPanel,
  'lambda-pair-trace': LambdaPairTrace,
  'ptc-curve': PtcCurve,
  'egt-gauge': EgtGauge,
  'egt-protect-panel': EgtProtectPanel,
  'dpf-filter': DpfFilter,
  'nox-store-panel': NoxStorePanel,
  'nox-trace-panel': NoxTracePanel,
  'sulfur-panel': SulfurPanel,
  'step-curve-panel': StepCurvePanel,
  'cat-verdict-panel': CatVerdictPanel,
  'lsf-heater-panel': LsfHeaterPanel,
  'lsf-wiring-panel': LsfWiringPanel,
  alternator: Alternator,
  'starter-motor': StarterMotor,
  'volt-trace-panel': VoltTracePanel,
  'dead-time-panel': DeadTimePanel,
  'ground-drop-panel': GroundDropPanel,
  'throttle-body': ThrottleBody,
  'map-sensor': MapSensor,
  'tmap-sensor': TmapSensor,
  'map-gauge': MapGauge,
  'temp-sensor': TempSensor,
  'lambda-sensor': LambdaSensor,
  'knock-sensor': KnockSensor,
  'ckp-sensor': CkpSensor,
  'tps-sensor': TpsSensor,
  ecu: Ecu,
  'fuel-pump': FuelPump,
  'cooling-fan': CoolingFan,
  // --- motor mecanico (Aula 3) ---
  crankshaft: CrankshaftPart,
  'connecting-rod': ConnRodPart,
  piston: PistonPart,
  'cylinder-liner': CylinderLinerPart,
  'cylinder-head': CylinderHeadPart,
  'intake-valve': IntakeValvePart,
  'exhaust-valve': ExhaustValvePart,
  camshaft: CamshaftPart,
  'intake-system': IntakeSystemPart,
  'exhaust-system': ExhaustSystemPart,
  crankcase: CrankcasePart,
  // --- injecao eletronica (Aula 4) ---
  'maf-sensor': MafSensor,
  'tmaf-sensor': TmafSensor,
  'wiring-harness': WiringHarness,
  'fuse-box': FuseBox,
  'mil-lamp-blink': MilLampBlink,
  'mil-lamp-off': MilLampOff,
  'can-scope': CanScope,
  'iac-valve': IacValve,
  'fuel-rail': FuelRail,
  'fuel-pressure-regulator': FuelPressureRegulator,
  'injector-gdi': InjectorGdi,
  'gdi-spray': GdiSpray,
  'gdi-piston': GdiPiston,
  'gdi-mixture': GdiMixtureCloud,
  'spark-plug': SparkPlug,
  'coked-intake-valve': CokedIntakeValve,
  'injector-driver-gauge': InjectorDriverGauge,
  'combustion-normal': CombustionNormal,
  'combustion-knock': CombustionKnock,
  'knock-wave': KnockWave,
  'knock-scope': KnockScope,
  'spark-advance-gauge': SparkAdvanceGauge,
  'damaged-piston': DamagedPiston,
  'ckp-hall-sensor': CkpHallSensor,
  'ckp-trace-inductive': CkpTraceInductive,
  'ckp-trace-hall': CkpTraceHall,
  'cam-trigger-wheel': CamTriggerWheel,
  'app-sensor': AppSensor,
  'pedal-trace': PedalTrace,
  'coil-pack': CoilPack,
  'air-filter': AirFilter,
  'fuel-pump-module': FuelPumpModule,
  'tank-fuel': TankFuel,
  'fuel-gauge-cluster': FuelGaugeCluster,
  'lp-gauge': LpGauge,
  'pump-relay': PumpRelay,
  'vss-sensor': VssSensor,
  'fuel-rail-flexstart': FuelRailFlexstart,
  'fuel-rail-gdi': FuelRailGdi,
  'rail-pressure-sensor': RailPressureSensor,
  'injector-piezo': InjectorPiezo,
  'injector-tbi': InjectorTbi,
  'ibs-sensor': IbsSensor,
  'nox-sensor': NoxSensor,
  'lambda-planar': LambdaPlanar,
  'injector-cutaway': InjectorCutaway,
  'cmp-sensor': CmpSensor,
  'egt-sensor': EgtSensor,
  'catalytic-converter': CatalyticConverter,
  'nox-catalyst': NoxCatalyst,
  'egr-valve': EgrValve,
  'egr-cooler': EgrCooler,
  'egr-band': EgrBand,
  'rail-gauge': RailGauge,
  'rail-relief-valve': RailReliefValve,
  canister: Canister,
  'purge-valve': PurgeValve,
  'fuel-tank-cap': FuelTankCap,
  'hp-fuel-pump': HpFuelPump,
  'pump-drive': PumpDrive,
  'obd-connector': ObdConnector,
  'can-bus': CanBus,
  'mil-lamp': MilLamp,
  'immobilizer-antenna': ImmobilizerAntenna,
  battery: Battery,
  'trigger-wheel': TriggerWheel,
};

export type PartModelId = keyof typeof PART_MODELS;

/** Nomes pt-BR, sistema e conceito de cada peca, para galeria e legendas. */
export const PART_META: Record<string, { namePt: string; system: string; conceptPt: string }> = {
  'golf-fsi-piston': {
    namePt: 'Pistao FSI com cavidade assimetrica',
    system: 'Motor',
    conceptPt: 'Referencia visual de familia SSP 279/322. A cavidade orienta o tumble; geometria didatica em escala nominal, nao cota de fabricacao.',
  },
  injector: {
    namePt: 'Injetor de combustivel',
    system: 'Alimentacao',
    conceptPt: 'Pulveriza o combustivel no ar admitido, dosado pela ECU, formando a mistura.',
  },
  'ignition-coil': {
    namePt: 'Bobina + vela de ignicao',
    system: 'Ignicao',
    conceptPt: 'Eleva a tensao (coil-on-plug) e a vela solta a faisca que inflama a mistura.',
  },
  'spark-gap': {
    namePt: 'Arco da faisca',
    system: 'Ignicao',
    conceptPt: 'So existe no instante do corte e enquanto dura a linha de queima.',
  },
  'coil-scope': {
    namePt: 'Osciloscopio da ignicao',
    system: 'Ignicao',
    conceptPt: 'Corrente do primario subindo, o corte, e o pico do secundario logo depois.',
  },
  'ignition-timing-gauge': {
    namePt: 'Avanco de ignicao',
    system: 'Ignicao',
    conceptPt: 'Quanto antes do ponto morto superior a faisca sai; cresce com a rotacao.',
  },
  'phase-trace': {
    namePt: 'Sinais de fase e rotacao',
    system: 'Sensores',
    conceptPt: 'Um pulso do comando a cada duas voltas do virabrequim: e isso que fecha o ciclo.',
  },
  'sequential-panel': {
    namePt: 'Injecao sequencial',
    system: 'Combustivel',
    conceptPt: 'Com a fase conhecida cada injetor abre na vez do seu proprio cilindro.',
  },
  'cam-phaser': {
    namePt: 'Variador de fase (VVT)',
    system: 'Distribuicao',
    conceptPt: 'Gira o comando em relacao ao virabrequim com pressao de oleo dosada pela ECU.',
  },
  'water-jacket': {
    namePt: 'Galeria de agua do cabecote',
    system: 'Arrefecimento',
    conceptPt: 'O canal por onde o liquido passa; e nele que o sensor de temperatura fica rosqueado.',
  },
  'ntc-curve': {
    namePt: 'Curva do NTC',
    system: 'Sensores',
    conceptPt: 'Resistencia contra temperatura: quanto mais quente, menor a resistencia.',
  },
  'divider-panel': {
    namePt: 'Divisor de tensao da ECU',
    system: 'Sensores',
    conceptPt: 'A ECU nao le ohm: le a tensao do meio entre o resistor fixo dela e o sensor.',
  },
  'rad-fan': {
    namePt: 'Ventilador do radiador',
    system: 'Arrefecimento',
    conceptPt: 'A ECU liga quando a temperatura do liquido passa do limite.',
  },
  'temp-gauge-cluster': {
    namePt: 'Ponteiro de temperatura',
    system: 'Painel',
    conceptPt: 'Costuma ser alimentado por outro sensor, de um fio so, separado do da ECU.',
  },
  'pump-cell-panel': {
    namePt: 'Celula de bombeamento',
    system: 'Sensores',
    conceptPt: 'O circuito bombeia oxigenio para dentro ou para fora da camara para segurar lambda 1; a medida e essa corrente.',
  },
  'lambda-compare': {
    namePt: 'Banda estreita x banda larga',
    system: 'Sensores',
    conceptPt: 'A estreita satura nas duas pontas e so diz o lado; a larga responde reta e diz o quanto.',
  },
  'lambda-gauge': {
    namePt: 'Fator lambda no scanner',
    system: 'Diagnostico',
    conceptPt: 'A leitura ja convertida: 1,00 e a mistura ideal, abaixo e rico, acima e pobre.',
  },
  'heater-pwm-panel': {
    namePt: 'Aquecedor em PWM',
    system: 'Sensores',
    conceptPt: 'A ECU dosa a potencia do aquecedor para segurar a ceramica na faixa de medida.',
  },
  'cat-window-panel': {
    namePt: 'Janela de lambda 1',
    system: 'Emissoes',
    conceptPt: 'Os tres gases so convertem juntos numa faixa estreitissima em volta de lambda 1.',
  },
  'cat-lightoff-panel': {
    namePt: 'Light-off do catalisador',
    system: 'Emissoes',
    conceptPt: 'Frio ele quase nao converte; so trabalha depois de passar de 250 a 300 graus.',
  },
  'lambda-pair-trace': {
    namePt: 'As duas sondas comparadas',
    system: 'Diagnostico',
    conceptPt: 'A de antes serrilha rapido; a de depois fica alta e parada enquanto o catalisador converte.',
  },
  'ptc-curve': {
    namePt: 'Curva do PTC de platina',
    system: 'Sensores',
    conceptPt: 'Ao contrario do NTC da agua, aqui a resistencia sobe junto com a temperatura.',
  },
  'egt-gauge': {
    namePt: 'Temperatura do escape',
    system: 'Diagnostico',
    conceptPt: 'A leitura em tempo real, com a faixa em que as pecas do escape comecam a sofrer.',
  },
  'egt-protect-panel': {
    namePt: 'Protecao por temperatura',
    system: 'Emissoes',
    conceptPt: 'Cada limite dispara uma acao: enriquecer, cortar pressao do turbo e reduzir potencia.',
  },
  'dpf-filter': {
    namePt: 'Filtro de particulas',
    system: 'Emissoes',
    conceptPt: 'Canais tampados alternados obrigam o gas a atravessar a parede; a fuligem fica e depois e queimada.',
  },
  'nox-store-panel': {
    namePt: 'Estoque de NOx',
    system: 'Emissoes',
    conceptPt: 'Minutos enchendo com mistura pobre, poucos segundos de pulso rico para esvaziar.',
  },
  'nox-trace-panel': {
    namePt: 'NOx que escapa',
    system: 'Diagnostico',
    conceptPt: 'Enquanto o acumulador guarda, a sonda depois nao ve quase nada; quando satura, o NOx vaza.',
  },
  'sulfur-panel': {
    namePt: 'Saturacao por enxofre',
    system: 'Emissoes',
    conceptPt: 'O enxofre ocupa o mesmo sitio do NOx e so sai numa limpeza mais longa e mais quente.',
  },
  'step-curve-panel': {
    namePt: 'Curva em degrau',
    system: 'Sensores',
    conceptPt: 'A banda estreita nao e proporcional: ela vira tudo de uma vez em cima de 0,45 V.',
  },
  'cat-verdict-panel': {
    namePt: 'Veredito do catalisador',
    system: 'Diagnostico',
    conceptPt: 'Se o sinal de depois comecar a copiar o de antes, o catalisador parou de converter.',
  },
  'lsf-heater-panel': {
    namePt: 'Aquecedor da sonda',
    system: 'Sensores',
    conceptPt: 'Abaixo de uns 320 graus a zirconia nao gera tensao e o sinal fica preso em 0,45 V.',
  },
  'lsf-wiring-panel': {
    namePt: 'De 1 a 5 fios',
    system: 'Sensores',
    conceptPt: 'Preto sinal, cinza terra de sinal, brancos aquecedor. O de quatro fios e o padrao de hoje.',
  },
  alternator: {
    namePt: 'Alternador',
    system: 'Controle',
    conceptPt: 'Depois que o motor pega e ele que sustenta o carro, entre 13,8 e 14,4 V.',
  },
  'starter-motor': {
    namePt: 'Motor de partida',
    system: 'Controle',
    conceptPt: 'Puxa de 200 a 400 A por poucos segundos: e o esforco que revela bateria cansada.',
  },
  'volt-trace-panel': {
    namePt: 'Tensao da rede',
    system: 'Diagnostico',
    conceptPt: 'Repouso, mergulho da partida e janela do alternador no mesmo desenho.',
  },
  'dead-time-panel': {
    namePt: 'Tempo morto do injetor',
    system: 'Combustivel',
    conceptPt: 'Com tensao baixa a agulha demora mais e a ECU alonga o comando para compensar.',
  },
  'ground-drop-panel': {
    namePt: 'Queda no terra',
    system: 'Diagnostico',
    conceptPt: 'Terra oxidado passa dos 0,1 V e desloca o sinal dos sensores, que trabalham em milivolts.',
  },
  'throttle-body': {
    namePt: 'Corpo de borboleta',
    system: 'Admissao',
    conceptPt: 'Controla quanto ar entra no motor (aceleracao eletronica).',
  },
  'map-sensor': {
    namePt: 'Sensor de pressao (MAP)',
    system: 'Sensores',
    conceptPt: 'Mede a pressao/vacuo no coletor de admissao para calcular a carga do motor.',
  },
  'tmap-sensor': {
    namePt: 'Sensor TMAP',
    system: 'Sensores',
    conceptPt:
      'O mesmo MAP com o NTC de temperatura do ar no mesmo corpo. Ganha uma quarta via so para o sinal do NTC.',
  },
  'map-gauge': {
    namePt: 'Escala de pressao absoluta',
    system: 'Sensores',
    conceptPt:
      'Para o MAP o zero e vacuo total, e nao a pressao do ambiente. A atmosferica fica perto de 101 kPa e so o turbo passa disso.',
  },
  'temp-sensor': {
    namePt: 'Sensor de temperatura (IAT/ECT)',
    system: 'Sensores',
    conceptPt: 'Le a temperatura do ar admitido e/ou do liquido de arrefecimento.',
  },
  'lambda-sensor': {
    namePt: 'Sonda lambda banda estreita (4 fios)',
    system: 'Sensores',
    conceptPt:
      'Tipo dedal. Gera a propria tensao: 900 mV rica, 450 mV lambda=1, 100 mV pobre. So diz o LADO da mistura, nao o quanto.',
  },
  'knock-sensor': {
    namePt: 'Sensor de detonacao (knock)',
    system: 'Sensores',
    conceptPt: 'Detecta a batida de pino (detonacao) para a ECU atrasar o ponto.',
  },
  'ckp-sensor': {
    namePt: 'Sensor de rotacao (CKP)',
    system: 'Sensores',
    conceptPt: 'Le a roda dentada do virabrequim: rotacao (RPM) e posicao dos pistoes.',
  },
  'tps-sensor': {
    namePt: 'Sensor de borboleta (TPS)',
    system: 'Sensores',
    conceptPt: 'Informa a abertura da borboleta (o quanto o acelerador foi pedido).',
  },
  ecu: {
    namePt: 'ECU (central eletronica)',
    system: 'Controle',
    conceptPt: 'O cerebro: le os sensores e comanda injecao, ignicao e marcha-lenta.',
  },
  'fuel-pump': {
    namePt: 'Bomba de combustivel',
    system: 'Alimentacao',
    conceptPt: 'Manda o combustivel do tanque pressurizado ate os injetores.',
  },
  'cooling-fan': {
    namePt: 'Eletroventilador',
    system: 'Arrefecimento',
    conceptPt: 'Puxa ar pelo radiador quando o motor esquenta (arrefecimento a agua).',
  },
  crankshaft: {
    namePt: 'Virabrequim',
    system: 'Motor / conjunto movel',
    conceptPt: 'Converte o sobe-e-desce do pistao em rotacao; leva munhoes, moente, contrapesos e volante.',
  },
  'connecting-rod': {
    namePt: 'Biela',
    system: 'Motor / conjunto movel',
    conceptPt: 'Liga o pistao ao moente do virabrequim, variando de angulo o tempo todo.',
  },
  piston: {
    namePt: 'Pistao',
    system: 'Motor / conjunto movel',
    conceptPt: 'Recebe a pressao da explosao e sobe/desce na camisa; leva aneis e pino.',
  },
  'cylinder-liner': {
    namePt: 'Cilindro / camisa',
    system: 'Motor / bloco',
    conceptPt: 'O tubo onde o pistao desliza, com aletas de refrigeracao e prisioneiros.',
  },
  'cylinder-head': {
    namePt: 'Cabecote',
    system: 'Motor / bloco',
    conceptPt: 'Fecha o cilindro por cima; forma a camara de combustao e abriga valvulas e vela.',
  },
  'intake-valve': {
    namePt: 'Valvula de admissao',
    system: 'Motor / distribuicao',
    conceptPt: 'Abre para deixar a mistura entrar; fecha na compressao e na combustao.',
  },
  'exhaust-valve': {
    namePt: 'Valvula de escape',
    system: 'Motor / distribuicao',
    conceptPt: 'Abre para expulsar os gases queimados no tempo de escape.',
  },
  camshaft: {
    namePt: 'Comando de valvulas',
    system: 'Motor / distribuicao',
    conceptPt: 'Gira na metade da rotacao e abre cada valvula na hora certa (os ressaltos).',
  },
  'intake-system': {
    namePt: 'Coletor de admissao',
    system: 'Motor / admissao',
    conceptPt: 'Filtro de ar + corpo de borboleta + cano ate a valvula de admissao.',
  },
  'exhaust-system': {
    namePt: 'Coletor de escape',
    system: 'Motor / escape',
    conceptPt: 'Cano da valvula de escape ate o silencioso e a ponteira.',
  },
  crankcase: {
    namePt: 'Carter',
    system: 'Motor / bloco',
    conceptPt: 'A caixa onde o virabrequim gira (mancais) e onde fica o oleo (bacia).',
  },
  // --- injecao eletronica (Aula 4) ---
  'maf-sensor': {
    namePt: 'Medidor de massa de ar (MAF)',
    system: 'Injecao / admissao',
    conceptPt: 'Mede a massa de ar por fio ou filme quente: mais ar passa, mais calor leva embora.',
  },
  'tmaf-sensor': {
    namePt: 'Medidor de massa e temperatura do ar (TMAF)',
    system: 'Injecao / admissao',
    conceptPt:
      'Mesmo medidor de massa de ar com um NTC junto: a anteninha dentro do duto le a temperatura.',
  },
  'wiring-harness': {
    namePt: 'Chicote eletrico',
    system: 'Injecao / eletrica',
    conceptPt:
      'Capa corrugada fechada no percurso e leque de fios so no ponto de saida, um fio por peca.',
  },
  'fuse-box': {
    namePt: 'Caixa de fusiveis e reles',
    system: 'Injecao / eletrica',
    conceptPt:
      'O fusivel protege o fio; o rele liga a carga pesada com a ECU aterrando so a bobina dele.',
  },
  'mil-lamp-blink': {
    namePt: 'Luz de anomalia piscando',
    system: 'Diagnostico',
    conceptPt: 'Piscando e falha de combustao acontecendo agora, com risco de cozinhar o catalisador.',
  },
  'mil-lamp-off': {
    namePt: 'Luz de anomalia apagada',
    system: 'Diagnostico',
    conceptPt: 'Apagada com o motor rodando e o estado normal, mas nao garante carro sem problema.',
  },
  'can-scope': {
    namePt: 'Sinal diferencial da CAN',
    system: 'Rede',
    conceptPt: 'CAN H sobe e CAN L desce ao mesmo tempo; o receptor le a diferenca, nao a tensao.',
  },
  'iac-valve': {
    namePt: 'Valvula de marcha lenta (IAC)',
    system: 'Injecao / admissao',
    conceptPt: 'Desvio de ar ao redor da borboleta fechada; o embolo conico dosa a marcha lenta.',
  },
  'fuel-rail': {
    namePt: 'Tubo distribuidor (rail)',
    system: 'Injecao / combustivel',
    conceptPt: 'Acumulador que alimenta os bicos: o volume evita oscilacao de pressao a cada pulso.',
  },
  'fuel-pressure-regulator': {
    namePt: 'Regulador de pressao',
    system: 'Injecao / combustivel',
    conceptPt: 'Ligado ao vacuo do coletor, mantem a pressao constante SOBRE o bico e devolve o excesso.',
  },
  'injector-gdi': {
    namePt: 'Injetor de injecao direta',
    system: 'Injecao / combustivel',
    conceptPt: 'Injeta dentro da camara a 50-200 bar; permite carga estratificada e ate 2 injecoes por ciclo.',
  },
  'gdi-spray': {
    namePt: 'Leque do bico',
    system: 'Injecao / combustivel',
    conceptPt: 'O combustivel sai por varios furos calibrados em cone, so no instante em que a agulha levanta.',
  },
  'gdi-piston': {
    namePt: 'Pistao no ciclo',
    system: 'Motor / conjunto movel',
    conceptPt: 'Onde ele esta define se a injecao e cedo, na admissao, ou tarde, no fim da compressao.',
  },
  'gdi-mixture': {
    namePt: 'Mistura na camara',
    system: 'Injecao / combustivel',
    conceptPt: 'Injetando cedo a mistura fica homogenea; injetando tarde forma uma nuvem rica so em volta da vela.',
  },
  'spark-plug': {
    namePt: 'Vela de ignicao',
    system: 'Ignicao',
    conceptPt: 'A faisca salta no fim da compressao e acende a nuvem que o injetor acabou de montar.',
  },
  'coked-intake-valve': {
    namePt: 'Valvula de admissao com carvao',
    system: 'Motor / comando',
    conceptPt: 'Sem gasolina lavando a valvula, o carvao do respiro gruda e vira crosta. E manutencao, nao defeito.',
  },
  'injector-driver-gauge': {
    namePt: 'Pico e sustentacao do driver',
    system: 'Injecao / combustivel',
    conceptPt: 'O driver joga 60 a 90 V para arrancar a agulha e depois cai para uma corrente baixa so para segurar.',
  },
  'combustion-normal': {
    namePt: 'Queima normal',
    system: 'Ignicao',
    conceptPt: 'Uma frente de chama so, saindo da vela e varrendo a camara de forma organizada.',
  },
  'combustion-knock': {
    namePt: 'Detonacao',
    system: 'Ignicao',
    conceptPt: 'A mistura do canto se auto acende antes da chama chegar e as duas frentes se batem no meio.',
  },
  'knock-wave': {
    namePt: 'Onda de vibracao no bloco',
    system: 'Sensores',
    conceptPt: 'O choque das duas frentes vira uma vibracao entre 5 e 15 kHz que corre pelo bloco.',
  },
  'knock-scope': {
    namePt: 'Sinal do sensor de detonacao',
    system: 'Sensores',
    conceptPt: 'Chiado de fundo o tempo todo e um estouro de milivolts dentro da janela de escuta.',
  },
  'spark-advance-gauge': {
    namePt: 'Avanco de ignicao',
    system: 'Ignicao',
    conceptPt: 'A ECU recua o ponto de uma vez quando ouve a batida e devolve o avanco bem devagar.',
  },
  'damaged-piston': {
    namePt: 'Estrago da detonacao',
    system: 'Motor',
    conceptPt: 'Borda do pistao comida e junta do cabecote queimada: e o que sobra de alguns segundos batendo em carga.',
  },
  'ckp-hall-sensor': {
    namePt: 'Sensor de rotacao de efeito Hall',
    system: 'Sensores',
    conceptPt: 'Tres fios: alimentacao, terra e sinal. Onda quadrada de amplitude fixa, que le ate com o motor parado.',
  },
  'ckp-trace-inductive': {
    namePt: 'Sinal do CKP indutivo',
    system: 'Sensores',
    conceptPt: 'Senoide que cresce com a rotacao e some na falha de dois dentes.',
  },
  'ckp-trace-hall': {
    namePt: 'Sinal do CKP Hall',
    system: 'Sensores',
    conceptPt: 'Onda quadrada com a mesma altura em qualquer rotacao, com a falha bem marcada.',
  },
  'cam-trigger-wheel': {
    namePt: 'Roda do comando',
    system: 'Sensores',
    conceptPt: 'Gira na metade da rotacao do virabrequim: um pulso por ciclo, e por isso ela desempata a duvida.',
  },
  'app-sensor': {
    namePt: 'Sensor do pedal (APP)',
    system: 'Injecao / sensores',
    conceptPt: 'Dois canais redundantes: uma pista costuma dar o dobro da tensao da outra.',
  },
  'coil-pack': {
    namePt: 'Bobina dupla (faisca perdida)',
    system: 'Injecao / ignicao',
    conceptPt: 'Uma bobina para dois cilindros: uma vela solta faisca util e a outra no escape.',
  },
  'air-filter': {
    namePt: 'Filtro de ar',
    system: 'Injecao / admissao',
    conceptPt: 'Papel de microfibra impregnado com resina e plissado para multiplicar a area filtrante.',
  },
  'fuel-pump-module': {
    namePt: 'Conjunto da bomba (no tanque)',
    system: 'Injecao / combustivel',
    conceptPt: 'Cuba, pre-filtro, bomba e boia de nivel: o combustivel refrigera a propria bomba.',
  },
  'tank-fuel': {
    namePt: 'Combustivel do tanque',
    system: 'Injecao / combustivel',
    conceptPt: 'A superficie desce com o consumo e e ela que a boia acompanha.',
  },
  'fuel-gauge-cluster': {
    namePt: 'Marcador de combustivel',
    system: 'Painel',
    conceptPt: 'Recebe a resistencia da boia e acende a reserva no fim da escala.',
  },
  'lp-gauge': {
    namePt: 'Manometro de baixa pressao',
    system: 'Injecao / combustivel',
    conceptPt: 'Mostra a pressao que a bomba do tanque entrega, de 0 a 7 bar.',
  },
  'pump-relay': {
    namePt: 'Rele da bomba',
    system: 'Injecao / eletrica',
    conceptPt: 'A ECU segura a bobina fechada enquanto ve sinal do virabrequim; sem sinal, a bomba desliga.',
  },
  'vss-sensor': {
    namePt: 'Sensor de velocidade (VSS)',
    system: 'Injecao / sensores',
    conceptPt: 'Conta pulsos na caixa de cambio; e o que autoriza o corte de combustivel no freio-motor.',
  },
  'fuel-rail-flexstart': {
    namePt: 'Rail com aquecedor (flex start)',
    system: 'Injecao / combustivel',
    conceptPt: 'Aquece o etanol antes da partida a frio, dispensando o tanquinho de gasolina.',
  },
  'fuel-rail-gdi': {
    namePt: 'Rail de injecao direta',
    system: 'Injecao / combustivel',
    conceptPt: 'Tubo forjado de parede grossa para 150-200 bar, com vedacao conica metal-metal.',
  },
  'rail-pressure-sensor': {
    namePt: 'Sensor de alta pressao',
    system: 'Injecao / sensores',
    conceptPt: 'Piezoeletrico no rail: fecha a malha de controle da bomba de alta pressao.',
  },
  'injector-piezo': {
    namePt: 'Injetor piezoeletrico',
    system: 'Injecao / combustivel',
    conceptPt: 'Pilha de cristais que se alonga com 100-200 V: abre 5x mais rapido, ate 5 injecoes por ciclo.',
  },
  'injector-tbi': {
    namePt: 'Monoponto (TBI)',
    system: 'Injecao / combustivel',
    conceptPt: 'Um unico bico acima da borboleta, a ~1,1 bar, molhando o coletor inteiro.',
  },
  'ibs-sensor': {
    namePt: 'Sensor de bateria (IBS)',
    system: 'Injecao / sensores',
    conceptPt: 'No polo negativo, mede tensao, corrente e temperatura para o Stop&Start e a carga.',
  },
  'nox-sensor': {
    namePt: 'Sensor de NOx',
    system: 'Injecao / escape',
    conceptPt: 'Depois do catalisador, mede NOx em ppm; tem modulo proprio falando CAN com a ECU.',
  },
  'lambda-planar': {
    namePt: 'Sonda planar em corte (base da banda larga)',
    system: 'Injecao / escape',
    conceptPt:
      'Laminas finas: aquece em ~10 s contra 1 min da dedal. Duas celulas (Nernst e bombeamento) separadas pela camara de difusao formam a banda larga.',
  },
  'injector-cutaway': {
    namePt: 'Injetor em corte',
    system: 'Injecao / combustivel',
    conceptPt:
      'Corte longitudinal: microfiltro e aneis sao o kit de reparo; microfiltro e disco de furos sao o que entope e pede limpeza.',
  },
  'cmp-sensor': {
    namePt: 'Sensor de fase (CMP)',
    system: 'Sensores',
    conceptPt:
      'Le a roda do comando por efeito Hall e diz em qual VOLTA o motor esta: sem ele a ECU nao sabe separar admissao de escape.',
  },
  'egt-sensor': {
    namePt: 'Sensor de temperatura dos gases (EGT)',
    system: 'Injecao / escape',
    conceptPt:
      'Sonda longa dentro do escape. Protege catalisador e turbina contra superaquecimento e habilita a regeneracao do catalisador de NOx.',
  },
  'catalytic-converter': {
    namePt: 'Catalisador de tres vias',
    system: 'Injecao / escape',
    conceptPt:
      'Oxida CO e HC e reduz NOx ao mesmo tempo, mas so dentro da janela estreita em volta de lambda = 1. Por isso a sonda existe.',
  },
  'nox-catalyst': {
    namePt: 'Catalisador de NOx',
    system: 'Injecao / escape',
    conceptPt:
      'Acumulador usado na injecao direta estratificada, que roda pobre: armazena NOx e depois queima o estoque num pulso rico.',
  },
  'egr-valve': {
    namePt: 'Valvula EGR',
    system: 'Injecao / escape',
    conceptPt:
      'Devolve parte dos gases de escape para a admissao. Baixa a temperatura da queima e derruba a formacao de NOx.',
  },
  canister: {
    namePt: 'Canister',
    system: 'Alimentacao',
    conceptPt:
      'Caixa de carvao ativado que prende os vapores do tanque em vez de solta-los na atmosfera.',
  },
  'pedal-trace': {
    namePt: 'As duas rampas do pedal',
    system: 'Sensores',
    conceptPt:
      'Os dois sinais do pedal andam juntos, mas em rampas diferentes de proposito. Se pararem de bater entre si, a ECU entra em emergencia.',
  },
  'egr-cooler': {
    namePt: 'Radiador de EGR',
    system: 'Escape',
    conceptPt:
      'Trocador de calor no caminho de volta: o gas de escape passa por dentro dos tubos e o liquido de arrefecimento leva o calor embora.',
  },
  'egr-band': {
    namePt: 'A janela da EGR',
    system: 'Escape',
    conceptPt:
      'A EGR so trabalha na faixa do meio de carga. Em marcha lenta o motor morreria e com o pe no fundo voce quer todo o oxigenio.',
  },
  'rail-gauge': {
    namePt: 'Pressao alvo e pressao real',
    system: 'Injecao / combustivel',
    conceptPt:
      'A ECU escolhe um alvo de pressao e a bomba de alta persegue esse alvo. As duas leituras andam coladas: quando se separam, tem defeito.',
  },
  'rail-relief-valve': {
    namePt: 'Valvula de alivio da flauta',
    system: 'Injecao / combustivel',
    conceptPt:
      'Seguranca puramente mecanica: uma esfera segura por mola que so sai da sede se a pressao passar do limite do sistema.',
  },
  'fuel-tank-cap': {
    namePt: 'Tanque e tampa de combustivel',
    system: 'Alimentacao',
    conceptPt:
      'O vapor nasce aqui em cima da gasolina e vai para o canister. A tampa fecha o sistema: mal rosqueada, gera codigo de EVAP.',
  },
  'purge-valve': {
    namePt: 'Valvula de purga do canister',
    system: 'Alimentacao',
    conceptPt:
      'A ECU abre em PWM para o motor aspirar os vapores guardados no canister e queima-los. Se trava aberta, bagunca a marcha lenta.',
  },
  'hp-fuel-pump': {
    namePt: 'Bomba de alta pressao',
    system: 'Injecao / combustivel',
    conceptPt:
      'Acionada por um came, eleva a pressao de ~5 bar para dezenas ou centenas de bar. E ela que define a injecao DIRETA.',
  },
  'pump-drive': {
    namePt: 'Comando de valvulas',
    system: 'Injecao / combustivel',
    conceptPt:
      'O mesmo eixo que abre as valvulas leva um ressalto a mais, de tres lobos, so para empurrar o tucho da bomba de alta.',
  },
  'obd-connector': {
    namePt: 'Conector de diagnostico (OBD2)',
    system: 'Controle',
    conceptPt:
      'Tomada de 16 vias padronizada: por ela o scanner conversa com a ECU pelas linhas CAN e le codigos e parametros.',
  },
  'can-bus': {
    namePt: 'Rede CAN (par trancado)',
    system: 'Controle',
    conceptPt:
      'Nao e peca, e barramento: dois fios trancados (CAN H e CAN L) com um resistor de 120 ohm em cada ponta.',
  },
  'mil-lamp': {
    namePt: 'Luz espia de anomalia (MIL)',
    system: 'Controle',
    conceptPt:
      'A lampada do painel. Acesa fixa e falha detectada; piscando e falha de combustao que pode destruir o catalisador.',
  },
  'immobilizer-antenna': {
    namePt: 'Imobilizador (antena + transponder)',
    system: 'Controle',
    conceptPt:
      'Antena em volta do comutador le o chip da chave. Sem o codigo certo a ECU bloqueia injecao e ignicao.',
  },
  'trigger-wheel': {
    namePt: 'Roda fonica 60-2',
    system: 'Injecao / sensores',
    conceptPt: 'A falha de dois dentes da a referencia angular absoluta do virabrequim.',
  },
  battery: {
    namePt: 'Bateria 12 V',
    system: 'Controle',
    conceptPt:
      'Fonte de tudo. Em repouso 12,4 a 12,7 V; com o motor ligado o alternador segura 13,8 a 14,4 V. Tensao baixa faz sensor mentir e a ECU errar.',
  },
};

/**
 * GLBs gerados externamente (Meshy) e baixados localmente. Sao opcionais: o
 * visualizador sempre pode cair para o modelo procedural. Nunca referenciar URL
 * remota em runtime — apenas caminhos locais em /public.
 */
export const PART_GLB: Record<string, string> = {
  injector: '/models/parts/injector.glb',
  'ignition-coil': '/models/parts/ignition-coil.glb',
  'throttle-body': '/models/parts/throttle-body.glb',
  'map-sensor': '/models/parts/map-sensor.glb',
  'temp-sensor': '/models/parts/temp-sensor.glb',
  'lambda-sensor': '/models/parts/lambda-sensor.glb',
  'knock-sensor': '/models/parts/knock-sensor.glb',
  'ckp-sensor': '/models/parts/ckp-sensor.glb',
  'tps-sensor': '/models/parts/tps-sensor.glb',
  ecu: '/models/parts/ecu.glb',
  'fuel-pump': '/models/parts/fuel-pump.glb',
  'cooling-fan': '/models/parts/cooling-fan.glb',
  // --- motor mecanico (Aula 3), gerado no Meshy 5 ---
  crankshaft: '/models/parts/crankshaft.glb',
  'connecting-rod': '/models/parts/connecting-rod.glb',
  piston: '/models/parts/piston.glb',
  'cylinder-liner': '/models/parts/cylinder-liner.glb',
  'cylinder-head': '/models/parts/cylinder-head.glb',
  'intake-valve': '/models/parts/poppet-valve.glb',
  'exhaust-valve': '/models/parts/poppet-valve.glb',
  camshaft: '/models/parts/camshaft.glb',
  'intake-system': '/models/parts/intake-system.glb',
  'exhaust-system': '/models/parts/exhaust-system.glb',
  crankcase: '/models/parts/crankcase.glb',
  // --- injecao eletronica (Aula 4), gerado no Meshy 6 ---
  'maf-sensor': '/models/parts/maf-sensor.glb',
  'iac-valve': '/models/parts/iac-valve.glb',
  'fuel-rail': '/models/parts/fuel-rail.glb',
  'fuel-pressure-regulator': '/models/parts/fuel-pressure-regulator.glb',
  'injector-gdi': '/models/parts/injector-gdi.glb',
  'app-sensor': '/models/parts/app-sensor.glb',
  'coil-pack': '/models/parts/coil-pack.glb',
  'air-filter': '/models/parts/air-filter.glb',
  'fuel-pump-module': '/models/parts/fuel-pump-module.glb',
  'vss-sensor': '/models/parts/vss-sensor.glb',
  'fuel-rail-flexstart': '/models/parts/fuel-rail-flexstart.glb',
  'fuel-rail-gdi': '/models/parts/fuel-rail-gdi.glb',
  'rail-pressure-sensor': '/models/parts/rail-pressure-sensor.glb',
  'injector-piezo': '/models/parts/injector-piezo.glb',
  'injector-tbi': '/models/parts/injector-tbi.glb',
  'ibs-sensor': '/models/parts/ibs-sensor.glb',
  'nox-sensor': '/models/parts/nox-sensor.glb',
  'lambda-planar': '/models/parts/lambda-planar.glb',
  'injector-cutaway': '/models/parts/injector-cutaway.glb',
  'cmp-sensor': '/models/parts/cmp-sensor.glb',
  'egt-sensor': '/models/parts/egt-sensor.glb',
  'catalytic-converter': '/models/parts/catalytic-converter.glb',
  'nox-catalyst': '/models/parts/nox-catalyst.glb',
  'egr-valve': '/models/parts/egr-valve.glb',
  canister: '/models/parts/canister.glb',
  'purge-valve': '/models/parts/purge-valve.glb',
  'hp-fuel-pump': '/models/parts/hp-fuel-pump.glb',
  'obd-connector': '/models/parts/obd-connector.glb',
};

export interface PartAnnotation {
  pos: [number, number, number];
  label: string;
}

/** Rotulos didaticos apontando as partes de cada peca (posicao no espaco da peca). */
export const PART_ANNOTATIONS: Record<string, PartAnnotation[]> = {
  injector: [
    { pos: [0, 1.05, 0.5], label: 'Conector eletrico' },
    { pos: [0.55, 0.55, 0], label: 'Anel de vedacao (o-ring)' },
    { pos: [0, -1.15, 0], label: 'Bico pulverizador' },
  ],
  'ignition-coil': [
    { pos: [0, 1.5, 0.4], label: 'Conector' },
    { pos: [0.35, -0.25, 0], label: 'Bota de vedacao' },
    { pos: [0, -1.35, 0], label: 'Vela de ignicao' },
  ],
  'throttle-body': [
    { pos: [0, 0.35, 0], label: 'Borboleta' },
    { pos: [0, -0.6, 1.0], label: 'Motor eletrico' },
    { pos: [1.0, 0.4, 0], label: 'Conector' },
  ],
  'map-sensor': [
    { pos: [0, 0.6, 0], label: 'Conector' },
    { pos: [0, -0.7, 0], label: 'Tomada de vacuo' },
  ],
  'temp-sensor': [
    { pos: [0, 0.85, 0], label: 'Conector 2 vias' },
    { pos: [0, -0.7, 0], label: 'Ponta NTC' },
  ],
  'lambda-sensor': [
    { pos: [-0.1, 1.6, 0], label: '2 fios do aquecedor' },
    { pos: [0.55, 1.35, 0], label: 'Sinal (preto)' },
    { pos: [0.6, 1.05, 0], label: 'Massa (cinza)' },
    { pos: [0.55, 0.35, 0], label: 'Corpo hex (rosca)' },
    { pos: [0, -0.85, 0], label: 'Ponta dedal ceramica' },
  ],
  'knock-sensor': [
    { pos: [0, 0.55, 0], label: 'Furo de fixacao' },
    { pos: [0.9, 0, 0], label: 'Cabo' },
  ],
  'ckp-sensor': [
    { pos: [0, 0.8, 0.4], label: 'Conector' },
    { pos: [0, -0.6, 0], label: 'Ponta (leitura)' },
    { pos: [0.95, -1.05, 0], label: 'Roda dentada 60-2' },
  ],
  'tps-sensor': [
    { pos: [0, 0, 0.4], label: 'Eixo da borboleta' },
    { pos: [0.55, 0.5, 0], label: 'Conector' },
  ],
  ecu: [
    { pos: [1.25, 0, 0], label: 'Conector multivias' },
    { pos: [0, 0.75, 0], label: 'Aletas (dissipacao)' },
  ],
  'fuel-pump': [
    { pos: [0.35, 1.45, 0], label: 'Conector' },
    { pos: [0.35, 0.3, 0], label: 'Bomba' },
    { pos: [0, -0.95, 0], label: 'Filtro/pescador' },
    { pos: [1.05, -0.45, 0], label: 'Boia (nivel)' },
  ],
  'cooling-fan': [
    { pos: [0, 1.25, 0], label: 'Shroud (aro)' },
    { pos: [0, 0, 0.4], label: 'Motor' },
    { pos: [0.65, 0.65, 0], label: 'Pas' },
  ],
  // --- injecao eletronica (Aula 4) ---
  'maf-sensor': [
    { pos: [0, 0.35, 0], label: 'Elemento de filme quente' },
    { pos: [0, 1.35, 0.3], label: 'Conector' },
    { pos: [-1.1, 0, 0], label: 'Entrada de ar' },
  ],
  'iac-valve': [
    { pos: [0, -1.3, 0], label: 'Embolo conico' },
    { pos: [0, 0.6, 0], label: 'Motor de passo' },
    { pos: [0.85, 0.5, 0], label: 'Conector' },
  ],
  'fuel-rail': [
    { pos: [0, 0.4, 0], label: 'Corpo acumulador' },
    { pos: [-1.05, -0.7, 0], label: 'Copo do injetor' },
    { pos: [1.25, 0.55, 0], label: 'Valvula de teste' },
  ],
  'fuel-pressure-regulator': [
    { pos: [0, 1.0, 0], label: 'Tomada de vacuo' },
    { pos: [0.85, 0.05, 0], label: 'Diafragma (costura)' },
    { pos: [0, -0.85, 0], label: 'Retorno ao tanque' },
  ],
  'injector-gdi': [
    { pos: [0, 0.35, 0.6], label: 'Bobina / conector' },
    { pos: [0.5, -0.95, 0], label: 'Anel de teflon' },
    { pos: [0, -1.45, 0], label: 'Bico multifuros' },
  ],
  'app-sensor': [
    { pos: [0, 0.6, 0.3], label: 'Pedal' },
    { pos: [1.05, -0.5, 0], label: 'Sensor duplo (redundante)' },
    { pos: [0, -0.95, 0], label: 'Base no assoalho' },
  ],
  'coil-pack': [
    { pos: [-0.65, 0.95, 0], label: 'Torre de alta tensao' },
    { pos: [0, -0.05, 0.95], label: 'Conector primario' },
    { pos: [0, -0.65, 0], label: 'Suporte' },
  ],
  'air-filter': [
    { pos: [0, 0.3, 0.5], label: 'Papel plissado' },
    { pos: [0, -0.95, 0], label: 'Moldura de vedacao' },
  ],
  'fuel-pump-module': [
    { pos: [0, 1.25, 0], label: 'Flange e saidas' },
    { pos: [0, 0, 0.75], label: 'Cuba (reservatorio)' },
    { pos: [1.35, -0.6, 0], label: 'Boia de nivel' },
    { pos: [0, -1.2, 0], label: 'Pre-filtro' },
  ],
  'vss-sensor': [
    { pos: [0.85, 0.6, 0], label: 'Conector' },
    { pos: [0.55, -0.15, 0], label: 'Rosca de fixacao' },
    { pos: [0, -1.05, 0], label: 'Engrenagem acionadora' },
  ],
  'fuel-rail-flexstart': [
    { pos: [-1.55, 0.85, 0], label: 'Aquecedor eletrico' },
    { pos: [-0.28, -0.75, 0], label: 'Copo do injetor' },
    { pos: [1.5, 0.4, 0], label: 'Entrada de combustivel' },
  ],
  'fuel-rail-gdi': [
    { pos: [0, 0.55, 0], label: 'Tubo forjado (200 bar)' },
    { pos: [-0.8, -0.85, 0], label: 'Porca de uniao' },
    { pos: [-1.55, 0.35, 0], label: 'Sede do sensor' },
  ],
  'rail-pressure-sensor': [
    { pos: [0, 1.35, 0], label: 'Conector' },
    { pos: [0.6, 0.1, 0], label: 'Sextavado' },
    { pos: [0, -0.75, 0], label: 'Rosca de alta pressao' },
  ],
  'injector-piezo': [
    { pos: [0.5, 0.65, 0], label: 'Pilha piezoeletrica' },
    { pos: [0.65, 0.35, 0], label: 'Uniao de alta pressao' },
    { pos: [0, -1.25, 0], label: 'Bico' },
  ],
  'injector-tbi': [
    { pos: [0, 1.25, 0], label: 'Injetor unico' },
    { pos: [0.85, -0.35, 0], label: 'Corpo de borboleta' },
    { pos: [0, -0.85, 0], label: 'Saida para o coletor' },
  ],
  'ibs-sensor': [
    { pos: [0, 0.65, 0], label: 'Terminal negativo' },
    { pos: [-0.3, -0.6, 0], label: 'Shunt + eletronica' },
    { pos: [-1.25, -0.6, 0], label: 'Rede LIN' },
  ],
  'nox-sensor': [
    { pos: [-0.9, -0.85, 0], label: 'Sonda no escape' },
    { pos: [-0.15, 1.05, 0], label: 'Cabo blindado' },
    { pos: [0.95, 0.95, 0], label: 'Modulo (CAN)' },
  ],
  'lambda-planar': [
    { pos: [-0.5, -0.15, 0.3], label: 'Celula de bombeamento' },
    { pos: [0, -1.15, 0.3], label: 'Camara de difusao' },
    { pos: [0.55, -0.5, 0.3], label: 'Celula de Nernst (ar de referencia)' },
    { pos: [0.6, 0.15, 0.3], label: 'Aquecedor (PWM)' },
    { pos: [0, 1.1, 0], label: 'Saida dos fios' },
  ],
  'injector-cutaway': [
    { pos: [0, 1.35, 0], label: 'Anel superior + entrada' },
    { pos: [0.5, 0.7, 0], label: 'Microfiltro (entope)' },
    { pos: [-0.6, 0.2, 0], label: 'Enrolamento da bobina' },
    { pos: [0.4, -0.05, 0], label: 'Mola interna' },
    { pos: [-0.45, -0.45, 0], label: 'Agulha' },
    { pos: [0.5, -0.78, 0], label: 'Anel inferior' },
    { pos: [0, -1.3, 0], label: 'Disco de furos (limpeza)' },
  ],
  'cmp-sensor': [
    { pos: [0, 1.25, 0], label: 'Conector de 3 vias' },
    { pos: [0.95, 0.15, 0], label: 'Furo de fixacao' },
    { pos: [0, -0.95, 0], label: 'Face Hall (le a roda do comando)' },
  ],
  'egt-sensor': [
    { pos: [0.45, 1.75, 0], label: 'Conector' },
    { pos: [0.4, 1.0, 0], label: 'Cabo blindado' },
    { pos: [0.45, 0.15, 0], label: 'Rosca no escape' },
    { pos: [0.3, -1.5, 0], label: 'Ponta dentro dos gases' },
  ],
  'catalytic-converter': [
    { pos: [-1.5, 0.25, 0], label: 'Entrada dos gases' },
    { pos: [0, 0.85, 0], label: 'Manta termica' },
    { pos: [0.55, 0.3, 0.6], label: 'Bossa da sonda' },
    { pos: [1.5, 0.25, 0], label: 'Saida' },
  ],
  'nox-catalyst': [
    { pos: [0, 0.85, 0], label: 'Acumulador de NOx' },
    { pos: [0.7, 0.25, 0.55], label: 'Sonda de NOx' },
    { pos: [-0.7, -0.55, 0.55], label: 'Sensor de temperatura' },
  ],
  'egr-valve': [
    { pos: [0.62, 0.9, 0], label: 'Atuador eletrico' },
    { pos: [0.36, 1.35, 0], label: 'Sensor de posicao' },
    { pos: [-0.55, -0.1, 0], label: 'Haste (pintle) e sede' },
    { pos: [1.15, -0.05, 0], label: 'Passagem dos gases' },
    { pos: [-0.95, -0.95, 0], label: 'Flange no coletor' },
  ],
  canister: [
    { pos: [0, 1.25, 0], label: 'Bocais: tanque, purga e ar' },
    { pos: [0, 0, 0.75], label: 'Carvao ativado' },
    { pos: [-1.35, -0.2, 0], label: 'Suporte' },
  ],
  'purge-valve': [
    { pos: [0, 0.95, 0], label: 'Comando da ECU (PWM)' },
    { pos: [-1.15, 0, 0], label: 'Vem do canister' },
    { pos: [1.15, 0, 0], label: 'Vai para a admissao' },
  ],
  'hp-fuel-pump': [
    { pos: [0, 1.15, 0], label: 'Amortecedor de pulsacao' },
    { pos: [-1.5, 0.62, 0], label: 'Valvula dosadora' },
    { pos: [1.3, 0.64, 0], label: 'Saida de alta pressao' },
    { pos: [0, -1.2, 0], label: 'Tucho com rolete' },
  ],
  'obd-connector': [
    { pos: [0, 0.6, 0.4], label: '16 vias padronizadas' },
    { pos: [-1.0, -0.35, 0], label: 'Pinos 6 e 14: CAN H e CAN L' },
    { pos: [0, 0, -0.85], label: 'Chicote para a ECU' },
  ],
  'can-bus': [
    { pos: [0, 0.45, 0], label: 'CAN H (amarelo) e CAN L (verde)' },
    { pos: [0, -0.45, 0], label: 'Par trancado: cancela ruido' },
    { pos: [2.2, 0.35, 0], label: 'Resistor de 120 ohm' },
    { pos: [-2.9, 0.35, 0], label: 'Resistor de 120 ohm' },
  ],
  'mil-lamp': [
    { pos: [0, 0.85, 0], label: 'Acesa fixa: falha memorizada' },
    { pos: [0, -0.85, 0], label: 'Piscando: falha de combustao' },
  ],
  'immobilizer-antenna': [
    { pos: [0.15, 0.85, 0], label: 'Antena no comutador' },
    { pos: [-1.75, 0.65, 0], label: 'Transponder da chave' },
    { pos: [0.6, -0.75, 0], label: 'Vai para a ECU' },
  ],
  'trigger-wheel': [
    { pos: [1.5, 0, 0], label: 'Falha de 2 dentes' },
    { pos: [0, 0, 1.5], label: '58 dentes' },
  ],
};
