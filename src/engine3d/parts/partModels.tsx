/* eslint-disable react-refresh/only-export-components */
import { useRef, type JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { throttleOpening } from '@/features/courses/lessons/scenes/mapPrimitives';
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

/** Bobina coil-on-plug + vela. */
function IgnitionCoil(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 1.4, 20]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, 1.4, 0.1]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Bota de conexao */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 0.5, 16]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Vela: hex + rosca + eletrodo */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.4, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      <mesh position={[0, -1.28, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
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
      {/* Tampa das engrenagens, na ponta do eixo */}
      <mesh position={[0, 0, 1.0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.2, 22]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
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
function MapSensor(): JSX.Element {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.0, 0.7, 0.6]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 12]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.55, 0.4, 0.45]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Sensor de temperatura NTC (IAT/ECT). */
function TempSensor(): JSX.Element {
  return (
    <group>
      {/* Conector 2 vias */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.4]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Hex */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 6]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
      {/* Rosca */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Ponta sensora */}
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.16, 0.3, 16]} />
        <meshStandardMaterial {...BRASS} />
      </mesh>
    </group>
  );
}

/** Sonda lambda banda estreita de 4 fios: 2 do aquecedor, sinal e massa. */
function LambdaSensor(): JSX.Element {
  const wireColors = ['#e8e8e8', '#e8e8e8', '#111', '#8a8f98'];
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.35, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.5, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Ponta ceramica */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[0.18, 0.4, 16]} />
        <meshStandardMaterial {...CERAMIC} />
      </mesh>
      {/* Corpo de protecao superior */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 0.4, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* 4 fios */}
      {wireColors.map((c, i) => (
        <mesh key={i} position={[(i - 1.5) * 0.09, 1.2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial color={c} metalness={0.2} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Sensor de detonacao (tipo arruela). */
function KnockSensor(): JSX.Element {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.45, 0.28, 16, 28]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Furo central metalico */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 20, 1, true]} />
        <meshStandardMaterial {...METAL} side={2} />
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
      {/* Conector de 2 vias: e aqui que se mede a resistencia do cristal */}
      <mesh position={[1.45, 0, 0]}>
        <boxGeometry args={[0.44, 0.26, 0.34]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Trava do conector */}
      <mesh position={[1.45, 0, -0.2]}>
        <boxGeometry args={[0.22, 0.1, 0.08]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {[0.075, -0.075].map((z) => (
        <mesh key={z} position={[1.72, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.22, 8]} />
          <meshStandardMaterial {...COPPER} />
        </mesh>
      ))}
    </group>
  );
}

/** Sensor de rotacao/fase (CKP/CMP) tipo cilindro + flange. */
function CkpSensor(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 1.1, 20]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Flange de fixacao */}
      <mesh position={[0.35, 0.35, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.4]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Ponta */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Conector */}
      <mesh position={[0, 0.75, 0.1]}>
        <boxGeometry args={[0.45, 0.45, 0.5]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
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

/** Modulo de bomba de combustivel (no tanque). */
function FuelPump(): JSX.Element {
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

/** Injetor de injecao direta (GDI): corpo metalico esguio. */
function InjectorGdi(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.7, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Secao da bobina sobremoldada */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.75, 20]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, 0.15, 0.35]}>
        <boxGeometry args={[0.45, 0.35, 0.3]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Haste ate a camara */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.85, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Anel de teflon (vedacao da camara) */}
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.05, 10, 22]} />
        <meshStandardMaterial color="#e9e9e4" metalness={0.05} roughness={0.6} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <coneGeometry args={[0.13, 0.25, 18]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
    </group>
  );
}

/** Pedal do acelerador com sensor integrado (drive-by-wire). */
function AppSensor(): JSX.Element {
  return (
    <group>
      {/* Base de assoalho */}
      <mesh position={[0, -0.75, 0]}>
        <boxGeometry args={[0.9, 0.25, 1.0]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Braco do pedal inclinado */}
      <mesh position={[0, 0.05, -0.15]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.55, 1.5, 0.12]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Borracha estriada */}
      <mesh position={[0, 0.2, 0.02]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.62, 1.1, 0.1]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Caixa do sensor (dois potenciometros) */}
      <mesh position={[0.6, -0.5, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.6]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[0.95, -0.5, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.45]} />
        <meshStandardMaterial {...PLASTIC} />
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

/** Conjunto da bomba dentro do tanque: cuba, boia e pre-filtro. */
function FuelPumpModule(): JSX.Element {
  return (
    <group>
      {/* Cuba */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.5, 24]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Flange superior */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.18, 28]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      <mesh position={[-0.25, 0.98, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.35]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {[0.2, 0.5].map((x) => (
        <mesh key={x} position={[x, 1.0, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.4, 14]} />
          <meshStandardMaterial {...PLASTIC_GREY} />
        </mesh>
      ))}
      {/* Braco e boia do medidor de nivel */}
      <mesh position={[0.75, -0.15, 0]} rotation={[0, 0, 1.15]}>
        <cylinderGeometry args={[0.035, 0.035, 1.0, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[1.15, -0.55, 0]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Pre-filtro (tela) */}
      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[0.9, 0.16, 0.5]} />
        <meshStandardMaterial color="#d8dade" metalness={0.1} roughness={0.85} />
      </mesh>
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
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 2.4, 22]} />
        <meshStandardMaterial {...STEEL_DARK} />
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
        </group>
      ))}
      {/* Sede roscada do sensor de alta pressao */}
      <mesh position={[-1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.4, 6]} />
        <meshStandardMaterial {...METAL} />
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

/** Sensor de alta pressao do tubo distribuidor. */
function RailPressureSensor(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.65, 0.55, 0.55]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, 1.0, 0.1]}>
        <boxGeometry args={[0.45, 0.35, 0.4]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Sextavado de aperto */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.35, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Rosca de alta pressao */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.6, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
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
function LambdaPlanar(): JSX.Element {
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
        <meshStandardMaterial color="#b9c6d6" metalness={0.15} roughness={0.6} />
      </mesh>
      {/* Camara de difusao: o vao entre as duas celulas */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.03, 1.15, 0.045]} />
        <meshStandardMaterial color="#2e3b52" metalness={0} roughness={1} />
      </mesh>
      {/* Celula de Nernst (lamina de medicao, com ar de referencia) */}
      <mesh position={[0.07, -0.35, 0]}>
        <boxGeometry args={[0.06, 1.3, 0.05]} />
        <meshStandardMaterial {...CERAMIC} />
      </mesh>
      {/* Trilha do aquecedor, comandada por PWM */}
      <mesh position={[0.14, -0.35, 0.04]}>
        <boxGeometry args={[0.05, 1.1, 0.02]} />
        <meshStandardMaterial {...COPPER} />
      </mesh>
      {/* Saida dos fios */}
      <mesh position={[0, 0.75, -0.18]}>
        <cylinderGeometry args={[0.18, 0.26, 0.4, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial {...METAL_DARK} side={2} />
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

/** Roda fonica 60-2: 58 dentes e a falha de referencia. */
function TriggerWheel(): JSX.Element {
  const teeth = 60;
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[1.05, 1.05, 0.12, 48]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 24]} />
        <meshStandardMaterial {...METAL} />
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
  );
}

/** Sensor de fase (CMP): efeito Hall lendo a roda dentada do comando. */
function CmpSensor(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 1.0, 0.35]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
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
        <meshStandardMaterial {...PLASTIC_GREY} />
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

/** Corpo de catalisador: usado pelo catalisador de 3 vias e pelo de NOx. */
function CatalystShell({
  dims,
  bosses,
}: {
  /** [raio, comprimento, numero de nervuras da manta termica] */
  dims: [number, number, number];
  bosses: number[];
}): JSX.Element {
  const [r, len, ribs] = dims;
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[r, r, len, 24]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Nervuras da manta termica */}
      {Array.from({ length: ribs }).map((_, i) => (
        <mesh key={i} position={[0, (i / (ribs - 1) - 0.5) * len * 0.8, 0]}>
          <cylinderGeometry args={[r + 0.03, r + 0.03, 0.05, 24]} />
          <meshStandardMaterial {...METAL_DARK} />
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
  return <CatalystShell dims={[0.5, 1.6, 5]} bosses={[0.55]} />;
}

/** Catalisador acumulador de NOx: duas bossas, uma para a sonda de NOx. */
function NoxCatalyst(): JSX.Element {
  return <CatalystShell dims={[0.45, 1.9, 6]} bosses={[0.7, -0.7]} />;
}

/** Canister: caixa de carvao ativado que retem os vapores do tanque. */
function Canister(): JSX.Element {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.5, 1.3, 0.9]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Carvao ativado a mostra por uma janela lateral */}
      <mesh position={[0, 0, 0.46]}>
        <boxGeometry args={[1.1, 0.9, 0.02]} />
        <meshStandardMaterial color="#15171c" metalness={0} roughness={1} />
      </mesh>
      {/* Tres bocais: tanque, purga e ar */}
      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.85, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.4, 14]} />
          <meshStandardMaterial {...PLASTIC_GREY} />
        </mesh>
      ))}
      {/* Suporte de fixacao */}
      <mesh position={[-0.85, -0.2, 0]}>
        <boxGeometry args={[0.22, 0.7, 0.6]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
    </group>
  );
}

/** Valvula de purga do canister: solenoide que a ECU abre em PWM. */
function PurgeValve(): JSX.Element {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.9, 20]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
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

/** Bomba de alta pressao da injecao direta: acionada pelo comando. */
function HpFuelPump(): JSX.Element {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 0.9, 20]} />
        <meshStandardMaterial color="#9aa3af" metalness={0.7} roughness={0.5} />
      </mesh>
      {/* Amortecedor de pulsacao no topo */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 0.35, 20]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Tucho acionado pelo came, embaixo */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.42, 18]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.14, 18]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Valvula dosadora solenoide com conector */}
      <mesh position={[-0.72, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 0.55, 16]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[-1.05, 0.05, 0]}>
        <boxGeometry args={[0.28, 0.34, 0.32]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Saida de alta pressao */}
      <mesh position={[0.72, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.14, 0.55, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0.55, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 6]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
    </group>
  );
}

/** Valvula EGR: devolve parte dos gases de escape para a admissao. */
function EgrValve(): JSX.Element {
  return (
    <group>
      {/* Corpo fundido com o flange */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[1.0, 0.6, 0.8]} />
        <meshStandardMaterial color="#6b6f78" metalness={0.6} roughness={0.65} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.3, 0.16, 1.0]} />
        <meshStandardMaterial {...STEEL_DARK} />
      </mesh>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 12]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
      ))}
      {/* Passagem dos gases */}
      <mesh position={[0, -0.15, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Sede e haste da valvula (pintle) */}
      <mesh position={[0, -0.42, 0]}>
        <coneGeometry args={[0.22, 0.22, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.9, 12]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Atuador eletrico com conector */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.6, 20]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0.45, 0.85, 0]}>
        <boxGeometry args={[0.36, 0.32, 0.34]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Sensor de temperatura dos gases de escape (EGT): sonda longa e cabo blindado. */
function EgtSensor(): JSX.Element {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.32, 6]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Haste longa que entra no fluxo dos gases */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 1.1, 14]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, -1.45, 0]}>
        <sphereGeometry args={[0.085, 12, 10]} />
        <meshStandardMaterial {...METAL_DARK} />
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
    </group>
  );
}

/** Conector de diagnostico OBD2 de 16 vias. */
function ObdConnector(): JSX.Element {
  return (
    <group>
      {/* Carcaca trapezoidal */}
      <mesh>
        <boxGeometry args={[1.5, 0.7, 0.5]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[1.1, 0.16, 0.5]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Moldura metalica */}
      <mesh position={[0, 0, 0.27]}>
        <boxGeometry args={[1.56, 0.76, 0.06]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* 16 terminais em duas fileiras */}
      {Array.from({ length: 16 }).map((_, i) => {
        const row = i < 8 ? 1 : -1;
        const col = i % 8;
        return (
          <mesh key={i} position={[(col - 3.5) * 0.16, row * 0.16, 0.2]}>
            <boxGeometry args={[0.06, 0.11, 0.16]} />
            <meshStandardMaterial {...BRASS} />
          </mesh>
        );
      })}
      {/* Chicote saindo por tras */}
      <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.5, 16]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
    </group>
  );
}

/** Rede CAN: par trancado com os dois resistores de 120 ohm nas pontas. */
function CanBus(): JSX.Element {
  const turns = 26;
  return (
    <group>
      {Array.from({ length: turns }).map((_, i) => {
        const t = (i / (turns - 1) - 0.5) * 3.4;
        const a = (i / (turns - 1)) * Math.PI * 6;
        return (
          <group key={i}>
            <mesh position={[t, Math.sin(a) * 0.14, Math.cos(a) * 0.14]}>
              <sphereGeometry args={[0.075, 10, 8]} />
              <meshStandardMaterial color="#e0c341" metalness={0.1} roughness={0.85} />
            </mesh>
            <mesh position={[t, -Math.sin(a) * 0.14, -Math.cos(a) * 0.14]}>
              <sphereGeometry args={[0.075, 10, 8]} />
              <meshStandardMaterial color="#3d7a3d" metalness={0.1} roughness={0.85} />
            </mesh>
          </group>
        );
      })}
      {/* Resistores de terminacao de 120 ohm, um em cada extremidade */}
      {[-1.95, 1.95].map((x) => (
        <group key={x}>
          <mesh position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.42, 16]} />
            <meshStandardMaterial {...PAPER} />
          </mesh>
          {[-0.26, 0.26].map((z) => (
            <mesh key={z} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.2, 8]} />
              <meshStandardMaterial {...METAL} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Luz espia de anomalia (MIL) no painel: o "motorzinho" amarelo. */
function MilLamp(): JSX.Element {
  return (
    <group>
      {/* Recorte do painel */}
      <mesh>
        <boxGeometry args={[2.0, 1.2, 0.25]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Lente do simbolo, acesa */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.95, 0.62, 0.08]} />
        <meshStandardMaterial
          color="#e8a01e"
          emissive="#ffa41b"
          emissiveIntensity={1.4}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.34, 0.15]}>
        <boxGeometry args={[0.5, 0.2, 0.08]} />
        <meshStandardMaterial
          color="#e8a01e"
          emissive="#ffa41b"
          emissiveIntensity={1.4}
          roughness={0.5}
        />
      </mesh>
      {/* Soquete e fios atras */}
      <mesh position={[0, 0, -0.28]}>
        <cylinderGeometry args={[0.22, 0.22, 0.35, 14]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
    </group>
  );
}

/** Imobilizador: antena em volta do comutador e o transponder da chave. */
function ImmobilizerAntenna(): JSX.Element {
  return (
    <group>
      {/* Cilindro do comutador de ignicao */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 1.1, 20]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Bobina de antena em volta */}
      <mesh position={[0.15, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.5, 0.11, 12, 28]} />
        <meshStandardMaterial {...COPPER} />
      </mesh>
      <mesh position={[0.15, -0.55, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.28]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
      {/* Palheta e cabeca da chave com o transponder */}
      <mesh position={[-0.95, 0, 0]}>
        <boxGeometry args={[0.9, 0.28, 0.05]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[-1.75, 0, 0]}>
        <boxGeometry args={[0.75, 0.62, 0.22]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* O chip transponder dentro da cabeca da chave */}
      <mesh position={[-1.75, 0, 0.13]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 14]} />
        <meshStandardMaterial color="#2f6f4f" metalness={0.2} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Bateria 12 V de chumbo-acido: caixa, tampas de celula e os dois polos. */
function Battery(): JSX.Element {
  return (
    <group>
      <mesh>
        <boxGeometry args={[2.0, 1.5, 1.2]} />
        <meshStandardMaterial color="#1e2836" metalness={0.15} roughness={0.75} />
      </mesh>
      {/* Tampa superior */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.0, 0.16, 1.2]} />
        <meshStandardMaterial color="#2c3746" metalness={0.15} roughness={0.7} />
      </mesh>
      {/* Tampas das celulas */}
      {[-0.7, -0.23, 0.23, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.92, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 14]} />
          <meshStandardMaterial color="#3a4657" metalness={0.1} roughness={0.8} />
        </mesh>
      ))}
      {/* Polo positivo (vermelho) e negativo (preto) */}
      <mesh position={[-0.72, 1.06, 0.36]}>
        <cylinderGeometry args={[0.15, 0.18, 0.28, 14]} />
        <meshStandardMaterial color="#c0392b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.72, 1.06, 0.36]}>
        <cylinderGeometry args={[0.13, 0.16, 0.26, 14]} />
        <meshStandardMaterial color="#111417" metalness={0.6} roughness={0.45} />
      </mesh>
      {/* Etiqueta */}
      <mesh position={[0, 0.05, 0.61]}>
        <planeGeometry args={[1.5, 0.6]} />
        <meshStandardMaterial color="#d8dee9" metalness={0.02} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Registro de pecas por id. */
export const PART_MODELS: Record<string, () => JSX.Element> = {
  injector: Injector,
  'ignition-coil': IgnitionCoil,
  'throttle-body': ThrottleBody,
  'map-sensor': MapSensor,
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
  'iac-valve': IacValve,
  'fuel-rail': FuelRail,
  'fuel-pressure-regulator': FuelPressureRegulator,
  'injector-gdi': InjectorGdi,
  'app-sensor': AppSensor,
  'coil-pack': CoilPack,
  'air-filter': AirFilter,
  'fuel-pump-module': FuelPumpModule,
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
  canister: Canister,
  'purge-valve': PurgeValve,
  'hp-fuel-pump': HpFuelPump,
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
    { pos: [0.75, 0.9, 0], label: 'Atuador eletrico' },
    { pos: [-0.75, 0.15, 0], label: 'Haste (pintle)' },
    { pos: [0, -0.42, 0.75], label: 'Passagem dos gases' },
    { pos: [-0.95, -0.55, 0], label: 'Flange no coletor' },
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
    { pos: [0, 0.95, 0], label: 'Amortecedor de pulsacao' },
    { pos: [-1.45, 0.05, 0], label: 'Valvula dosadora' },
    { pos: [1.1, 0.15, 0], label: 'Saida de alta pressao' },
    { pos: [0, -1.15, 0], label: 'Acionamento pelo came' },
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
