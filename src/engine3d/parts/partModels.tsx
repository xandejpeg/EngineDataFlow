/* eslint-disable react-refresh/only-export-components */
import type { JSX } from 'react';
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

/** Corpo de borboleta eletronico. */
function ThrottleBody(): JSX.Element {
  return (
    <group>
      {/* Tubo */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.75, 0.75, 1.6, 28, 1, true]} />
        <meshStandardMaterial {...METAL} side={2} />
      </mesh>
      {/* Borboleta (disco) */}
      <mesh rotation={[0.5, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.7, 0.7, 0.06, 24]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Motor eletrico lateral */}
      <mesh position={[0, -0.55, 0.75]}>
        <cylinderGeometry args={[0.28, 0.28, 0.5, 16]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Conector */}
      <mesh position={[0.9, 0.35, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.5]} />
        <meshStandardMaterial {...PLASTIC_GREY} />
      </mesh>
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

/** Sonda lambda: hex + ceramica + 4 fios. */
function LambdaSensor(): JSX.Element {
  const wireColors = ['#d7d7d7', '#d7d7d7', '#111', '#3a7bd5'];
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
      {/* Cabo */}
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 10]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
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
      {/* Roda dentada de referencia */}
      <group position={[0, -1.05, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.16, 36]} />
          <meshStandardMaterial {...METAL_DARK} />
        </mesh>
        {Array.from({ length: 20 }).map((_, i) => {
          const a = (i / 20) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.82, 0, Math.sin(a) * 0.82]}>
              <boxGeometry args={[0.1, 0.18, 0.1]} />
              <meshStandardMaterial {...METAL} />
            </mesh>
          );
        })}
      </group>
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
      {/* Conector multivias */}
      <mesh position={[1.05, 0, 0]}>
        <boxGeometry args={[0.25, 0.8, 1.1]} />
        <meshStandardMaterial {...PLASTIC} />
      </mesh>
      {/* Pinos */}
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 8 }).map((_, c) => (
          <mesh key={`${r}-${c}`} position={[1.2, 0.28 - r * 0.14, 0.45 - c * 0.13]}>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
            <meshStandardMaterial {...COPPER} />
          </mesh>
        )),
      )}
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
function MafSensor(): JSX.Element {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.7, 0.7, 1.8, 28, 1, true]} />
        <meshStandardMaterial {...PLASTIC} side={2} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
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
      <mesh position={[0, 1.15, 0.1]}>
        <boxGeometry args={[0.6, 0.4, 0.5]} />
        <meshStandardMaterial {...PLASTIC} />
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
      {/* Elemento planar laminado */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.16, 1.3, 0.05]} />
        <meshStandardMaterial {...CERAMIC} />
      </mesh>
      {/* Trilha do aquecedor */}
      <mesh position={[0, -0.35, 0.04]}>
        <boxGeometry args={[0.07, 1.1, 0.02]} />
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
    namePt: 'Sonda lambda (O2)',
    system: 'Sensores',
    conceptPt: 'Mede o oxigenio no escape para a ECU corrigir a mistura (rica/pobre).',
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
    namePt: 'Sonda planar (em corte)',
    system: 'Injecao / escape',
    conceptPt: 'Elemento em laminas finas: opera em ~10 s contra mais de 1 minuto da sonda dedal.',
  },
  'trigger-wheel': {
    namePt: 'Roda fonica 60-2',
    system: 'Injecao / sensores',
    conceptPt: 'A falha de dois dentes da a referencia angular absoluta do virabrequim.',
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
    { pos: [0, 1.3, 0], label: '4 fios' },
    { pos: [0.45, 0.35, 0], label: 'Corpo hex (rosca)' },
    { pos: [0, -0.6, 0], label: 'Ponta ceramica' },
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
    { pos: [0, -0.35, 0.35], label: 'Lamina ceramica' },
    { pos: [0.45, -0.9, 0], label: 'Aquecedor integrado' },
    { pos: [0, 1.1, 0], label: 'Saida dos fios' },
  ],
  'trigger-wheel': [
    { pos: [1.5, 0, 0], label: 'Falha de 2 dentes' },
    { pos: [0, 0, 1.5], label: '58 dentes' },
  ],
};
