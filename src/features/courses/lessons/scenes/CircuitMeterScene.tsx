/* eslint-disable react-refresh/only-export-components */
/**
 * Aula 2 — Medindo um circuito real com o multimetro HM-2090.
 * Reaproveita o MESMO multimetro da Aula 1 (corpo, visor, chave seletora de 13
 * posicoes com knob giratorio e os 4 terminais) e o circuito da Aula 0 (bateria
 * 12 V -> fusivel -> interruptor -> farol), agora com valores FIXOS. Gire a chave,
 * escolha o terminal e posicione as duas pontas em pontos do circuito para medir
 * tensao, corrente e resistencia. Clicar de novo no ponto desconecta a ponta.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SceneShell } from './sceneUi';
import {
  CircuitStage,
  SceneLights,
  WHITE_BG,
  CIRCUIT_NODES,
  filamentColor,
  filamentTempC,
} from './circuitParts';
import {
  MeterBody,
  Lcd,
  Dial,
  MeterButton,
  Jack,
  METERX,
  DIALY,
  jackWorld,
  clampDialAngle,
  angleClockwiseFromTop,
  nearestFnId,
  type RedJack,
} from './MultimeterScene';
import { measureCircuitFull, MEASURE_GOALS, type CircuitState, type CircuitReading } from './circuitMeterSim';
import type { Reading } from './multimeterSim';
import { HM2090_FUNCTIONS } from '@/data/multimeterHM2090.pt-BR';

type Vec3 = [number, number, number];

const CS = 0.62; // escala do circuito
const CO: Vec3 = [1.95, 0.4, 0]; // deslocamento do circuito (fica a direita do meter)

const nodeWorld = (id: string): Vec3 => {
  const n = CIRCUIT_NODES.find((x) => x.id === id)!;
  return [n.pos[0] * CS + CO[0], n.pos[1] * CS + CO[1], n.pos[2] * CS + CO[2]];
};

const symOf = (fnId: string) => HM2090_FUNCTIONS.find((f) => f.id === fnId)?.symbol ?? fnId;
const jackLabel = (j: string) => (j === 'mAμA' ? 'mA/µA' : j);
const shortOf = (id: string) => CIRCUIT_NODES.find((n) => n.id === id)?.short ?? id;
function stateHint(needs: Partial<CircuitState>): string {
  const parts: string[] = [];
  if (needs.switchOn === false) parts.push('interruptor ABERTO');
  if (needs.switchOn === true) parts.push('interruptor LIGADO');
  if (needs.fuseBlown === true) parts.push('fusivel REMOVIDO');
  if (needs.batteryConnected === false) parts.push('bateria DESCONECTADA');
  return parts.length ? ` (${parts.join(', ')})` : '';
}

/* --------------------------------- pecas 3D -------------------------------- */

function Cable({ from, to, color }: { from: Vec3; to: Vec3; color: string }) {
  const geo = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    mid.z += 0.7;
    mid.y -= 0.2;
    const curve = new THREE.CatmullRomCurve3([a, mid, b]);
    return new THREE.TubeGeometry(curve, 30, 0.05, 8, false);
  }, [from, to]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

function ProbeTip({ pos, color }: { pos: Vec3; color: string }) {
  return (
    <mesh position={[pos[0], pos[1], pos[2] + 0.03]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.05, 0.22, 14]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.35} />
    </mesh>
  );
}

function NodeMarker({
  world,
  short,
  isRed,
  isBlack,
  onPick,
}: {
  world: Vec3;
  short: string;
  isRed: boolean;
  isBlack: boolean;
  onPick: () => void;
}) {
  const on = isRed || isBlack;
  const color = isRed ? '#e2564a' : isBlack ? '#20242c' : '#8aa0bf';
  return (
    <group position={world}>
      {/* area de clique maior e na FRENTE das pecas do circuito (facilita ligar o fio) */}
      <mesh
        position={[0, 0, 0.22]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPick();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[on ? 0.07 : 0.055, 14, 14]} />
        <meshStandardMaterial color={color} emissive={on ? color : '#0a1526'} emissiveIntensity={on ? 0.5 : 0.15} roughness={0.5} />
      </mesh>
      <Text position={[0, 0.15, 0]} fontSize={0.1} color="#5a6678" anchorX="center" anchorY="middle">
        {short}
      </Text>
    </group>
  );
}

/* --------------------------------- overlay --------------------------------- */

function Toggle({
  label,
  on,
  onLabel,
  offLabel,
  color,
  onToggle,
}: {
  label: string;
  on: boolean;
  onLabel: string;
  offLabel: string;
  color: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        padding: '3px 9px',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 11,
        border: `1px solid ${on ? color : '#59667c'}`,
        background: on ? `${color}22` : 'rgba(90,102,124,0.12)',
        color: on ? color : '#aab6c8',
      }}
    >
      {label}: {on ? onLabel : offLabel}
    </button>
  );
}

function ChipRow({
  label,
  value,
  color,
  onPick,
}: {
  label: string;
  value: string | null;
  color: string;
  onPick: (id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 11, color, minWidth: 88, fontWeight: 600 }}>{label}</span>
      {CIRCUIT_NODES.map((n) => (
        <button
          key={n.id}
          type="button"
          title={n.label}
          onClick={() => onPick(n.id)}
          style={{
            padding: '2px 7px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 700,
            border: `1px solid ${value === n.id ? color : '#2a3346'}`,
            background: value === n.id ? `${color}22` : 'transparent',
            color: value === n.id ? color : '#9fb0c8',
          }}
        >
          {n.short}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------- cena ----------------------------------- */

function sameNodes(a: string | null, b: string | null, c: string, d: string): boolean {
  return (a === c && b === d) || (a === d && b === c);
}

export function CircuitMeterScene() {
  const [fs, setFs] = useState(false);
  const [fnId, setFnId] = useState('dcv');
  const [redJack, setRedJack] = useState<RedJack>('VΩHz');
  const [buttons, setButtons] = useState<Record<string, boolean>>({ SELECT: false, RANGE: false, REL: false, HOLD: false, LIGHT: false });
  const [knobDragAngle, setKnobDragAngle] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [redNode, setRedNode] = useState<string | null>('batPlus');
  const [blackNode, setBlackNode] = useState<string | null>('batMinus');
  const [holding, setHolding] = useState<'red' | 'black' | null>(null);
  const [switchOn, setSwitchOn] = useState(true);
  const [fuseBlown, setFuseBlown] = useState(false);
  const [batteryConnected, setBatteryConnected] = useState(true);
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [panelOpen, setPanelOpen] = useState(true);

  const state: CircuitState = { switchOn, fuseBlown, batteryConnected };
  const live = measureCircuitFull(fnId, redJack, redNode, blackNode, state);

  const heldRef = useRef<CircuitReading | null>(null);
  let reading = live;
  if (buttons.HOLD) {
    if (!heldRef.current) heldRef.current = live;
    reading = heldRef.current;
  } else {
    heldRef.current = null;
  }

  useEffect(() => {
    for (const g of MEASURE_GOALS) {
      const okState =
        (g.needs.switchOn === undefined || g.needs.switchOn === switchOn) &&
        (g.needs.fuseBlown === undefined || g.needs.fuseBlown === fuseBlown) &&
        (g.needs.batteryConnected === undefined || g.needs.batteryConnected === batteryConnected);
      if (fnId === g.fnId && redJack === g.redJack && sameNodes(redNode, blackNode, g.red, g.black) && okState && live.tone === 'ok') {
        setDone((prev) => {
          if (prev.has(g.id)) return prev;
          const next = new Set(prev);
          next.add(g.id);
          return next;
        });
      }
    }
  }, [fnId, redJack, redNode, blackNode, switchOn, fuseBlown, batteryConnected, live.tone]);

  // Pega/solta o fio a partir do TERMINAL do multimetro (os 4 bornes).
  const onTerminal = (t: string) => {
    const w = t === 'COM' ? 'black' : 'red';
    if (w === 'red') setRedJack(t as RedJack);
    if (holding === w) {
      setHolding(null); // solta o fio da mao -> some
    } else {
      setHolding(w); // pega o fio (tira do circuito)
      if (w === 'red') setRedNode(null);
      else setBlackNode(null);
    }
  };
  // Clique num ponto do circuito: liga o fio que esta na mao, ou pega o fio que ja esta ali.
  const pickNode = (id: string) => {
    if (holding === 'red') {
      setRedNode(id);
      setHolding(null);
    } else if (holding === 'black') {
      setBlackNode(id);
      setHolding(null);
    } else if (redNode === id) {
      setRedNode(null);
      setHolding('red');
    } else if (blackNode === id) {
      setBlackNode(null);
      setHolding('black');
    }
  };
  const toggleRed = (id: string) => {
    setHolding(null);
    setRedNode((v) => (v === id ? null : id));
  };
  const toggleBlack = (id: string) => {
    setHolding(null);
    setBlackNode((v) => (v === id ? null : id));
  };

  const onKnobDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(true);
  };
  const onKnobRotate = (pt: THREE.Vector3) => {
    const theta = clampDialAngle(angleClockwiseFromTop(pt.x - METERX, pt.y - DIALY));
    setKnobDragAngle(theta);
    setFnId(nearestFnId(theta));
  };
  const onKnobRelease = () => {
    setKnobDragAngle(null);
    setDragging(false);
  };
  const toggleButton = (id: string) => setButtons((b) => ({ ...b, [id]: !b[id] }));

  const lcdReading: Reading = {
    primary: reading.primary,
    unit: reading.unit,
    mode: reading.mode,
    beep: false,
    danger: reading.tone === 'danger',
    ok: reading.tone === 'ok',
  };
  const glow = filamentColor(filamentTempC(reading.lampOn ? 1 : 0));
  const toneColor = reading.tone === 'danger' ? '#ff8a6a' : reading.tone === 'warn' ? '#ffcf7a' : '#8ff0bd';
  const nextGoal = MEASURE_GOALS.find((g) => !done.has(g.id));
  const heldFrom = jackWorld(holding === 'black' ? 'COM' : redJack);
  const heldTip: Vec3 = [heldFrom[0] + 0.5, heldFrom[1] - 1.15, heldFrom[2] + 1.1];

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <div style={{ fontSize: 12, color: '#cfd8e6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: panelOpen ? 6 : 0 }}>
            <button
              type="button"
              onClick={() => setPanelOpen((o) => !o)}
              title={panelOpen ? 'Minimizar painel' : 'Abrir painel'}
              style={{ padding: '3px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, border: '1px solid #3a4356', background: 'rgba(255,255,255,0.06)', color: '#dfe6f2' }}
            >
              {panelOpen ? '▾ Painel de controle' : '▸ Painel de controle'}
            </button>
            {!panelOpen && (
              <>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800, color: toneColor }}>
                  {reading.primary} {reading.unit} <span style={{ fontSize: 11, opacity: 0.8 }}>{reading.mode}</span>
                </span>
                <span style={{ fontSize: 11, color: toneColor, opacity: 0.92, flex: 1, lineHeight: 1.25 }}>{reading.notePt}</span>
              </>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: done.size === MEASURE_GOALS.length ? '#8ff0bd' : '#9fb0c8' }}>
              {done.size === MEASURE_GOALS.length ? '🏆 ' : ''}Medidas: {done.size}/{MEASURE_GOALS.length}
            </span>
          </div>
          {panelOpen && (
            <>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#ffd479', minWidth: 52, fontWeight: 600 }}>Chave</span>
            {HM2090_FUNCTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                title={f.namePt}
                onClick={() => setFnId(f.id)}
                style={{
                  padding: '2px 6px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 700,
                  border: `1px solid ${fnId === f.id ? '#ffd479' : '#2a3346'}`,
                  background: fnId === f.id ? 'rgba(255,212,121,0.16)' : 'transparent',
                  color: fnId === f.id ? '#ffd479' : '#9fb0c8',
                }}
              >
                {f.symbol}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#7fd3ff', minWidth: 52, fontWeight: 600 }}>Terminal</span>
            {['VΩHz', 'mAμA', '10A', 'COM'].map((t) => {
              const isBlack = t === 'COM';
              const held = isBlack ? holding === 'black' : holding === 'red' && redJack === t;
              const chosen = isBlack ? blackNode != null || holding === 'black' : redJack === t;
              const col = isBlack ? '#e8edf5' : '#7fd3ff';
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTerminal(t)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 700,
                    border: `1px solid ${held ? col : '#2a3346'}`,
                    background: held ? `${col}2e` : chosen ? `${col}14` : 'transparent',
                    color: held || chosen ? col : '#9fb0c8',
                  }}
                >
                  {t === 'mAμA' ? 'mA/µA' : t}
                </button>
              );
            })}
            <Toggle label="Interruptor" on={switchOn} onLabel="LIGADO" offLabel="ABERTO" color="#37d67a" onToggle={() => setSwitchOn((v) => !v)} />
            <Toggle label="Fusivel" on={!fuseBlown} onLabel="BOM" offLabel="REMOVIDO" color="#4a90e2" onToggle={() => setFuseBlown((v) => !v)} />
            <Toggle label="Bateria" on={batteryConnected} onLabel="CONECTADA" offLabel="DESCONECTADA" color="#e2564a" onToggle={() => setBatteryConnected((v) => !v)} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#9fb0c8', fontWeight: 600 }}>Na mao:</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: holding === 'red' ? '#ff9a86' : holding === 'black' ? '#e8edf5' : '#7c8aa3' }}>
              {holding === 'red' ? '🔴 ponta vermelha' : holding === 'black' ? '⚫ ponta preta' : '— nada —'}
            </span>
            <span style={{ fontSize: 11, color: '#7c8aa3' }}>
              {holding
                ? 'clique num PONTO do circuito para ligar o fio ali (ou no terminal de novo para soltar)'
                : 'clique num TERMINAL (10A / mA-µA / COM / VΩHz) para pegar a ponta na mao'}
            </span>
          </div>
          <ChipRow label="Ponta vermelha" value={redNode} color="#e2564a" onPick={toggleRed} />
          <ChipRow label="Ponta preta" value={blackNode} color="#e8edf5" onPick={toggleBlack} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginTop: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800, color: toneColor, minWidth: 120 }}>
              {reading.primary} {reading.unit} <span style={{ fontSize: 12, opacity: 0.8 }}>{reading.mode}</span>
            </div>
            <div style={{ flex: 1, color: toneColor, lineHeight: 1.35 }}>{reading.notePt}</div>
          </div>
          {nextGoal && (
            <div style={{ marginTop: 4, fontSize: 11, color: '#8aa0bf' }}>
              👉 Proxima medida sugerida: <strong style={{ color: '#cdd8e8' }}>{nextGoal.titlePt}</strong> — chave{' '}
              <strong style={{ color: '#ffd479' }}>{symOf(nextGoal.fnId)}</strong>, terminal{' '}
              <strong style={{ color: '#7fd3ff' }}>{jackLabel(nextGoal.redJack)}</strong>, pontas em{' '}
              <strong style={{ color: '#ff9a86' }}>{shortOf(nextGoal.red)}</strong> e{' '}
              <strong>{shortOf(nextGoal.black)}</strong>
              {stateHint(nextGoal.needs)}.
            </div>
          )}
            </>
          )}
        </div>
      }
    >
      <Canvas key={fs ? 'fs' : 'win'} camera={{ position: [0, 0, fs ? 7.8 : 8.8], fov: 46 }} dpr={[1, 1.5]}>
        <color attach="background" args={[WHITE_BG]} />
        <SceneLights />
        <Suspense fallback={null}>
          {/* multimetro HM-2090 (o mesmo da Aula 1) */}
          <MeterBody />
          <Lcd reading={lcdReading} hold={buttons.HOLD} rel={buttons.REL} light={buttons.LIGHT} />
          <Dial fnId={fnId} dragAngle={dragging ? knobDragAngle : null} onSelect={setFnId} onKnobDown={onKnobDown} />
          <MeterButton pos={[METERX - 0.75, 1.02, 0.3]} label="SEL" color="#f5a623" active={buttons.SELECT} onClick={() => toggleButton('SELECT')} />
          <MeterButton pos={[METERX - 0.25, 1.02, 0.3]} label="RANGE" color="#4a90e2" active={buttons.RANGE} onClick={() => toggleButton('RANGE')} />
          <MeterButton pos={[METERX + 0.25, 1.02, 0.3]} label="REL" color="#7ed37e" active={buttons.REL} onClick={() => toggleButton('REL')} />
          <MeterButton pos={[METERX + 0.75, 1.02, 0.3]} label="HOLD" color="#e2564a" active={buttons.HOLD} onClick={() => toggleButton('HOLD')} />
          <MeterButton pos={[METERX + 0.88, 1.36, 0.3]} label="LUZ" color="#ffd479" active={buttons.LIGHT} onClick={() => toggleButton('LIGHT')} />
          <Jack id="10A" labelPt="10A" color="#c23a2c" selected={redJack === '10A'} onSelect={onTerminal} />
          <Jack id="mAμA" labelPt="mA/µA" color="#c23a2c" selected={redJack === 'mAμA'} onSelect={onTerminal} />
          <Jack id="COM" labelPt="COM" color="#20242c" selected={holding === 'black' || blackNode != null} onSelect={onTerminal} />
          <Jack id="VΩHz" labelPt="VΩHz" color="#c23a2c" selected={redJack === 'VΩHz'} onSelect={onTerminal} />

          {/* circuito (a direita) */}
          <group scale={CS} position={CO}>
            <CircuitStage
              lampLevel={reading.lampOn ? 1 : 0}
              lampOn={reading.lampOn}
              glowColor={glow}
              electronCount={6}
              electronSpeed={reading.lampOn ? 0.5 : 0}
              switchOn={switchOn}
              onToggleSwitch={() => setSwitchOn((v) => !v)}
              fuseBlown={fuseBlown}
            />
          </group>
          {CIRCUIT_NODES.map((n) => (
            <NodeMarker key={n.id} world={nodeWorld(n.id)} short={n.short} isRed={redNode === n.id} isBlack={blackNode === n.id} onPick={() => pickNode(n.id)} />
          ))}

          {/* pontas: cabos do terminal certo ate cada no */}
          {redNode && <Cable from={jackWorld(redJack)} to={nodeWorld(redNode)} color="#c23a2c" />}
          {blackNode && <Cable from={jackWorld('COM')} to={nodeWorld(blackNode)} color="#15181d" />}
          {redNode && <ProbeTip pos={nodeWorld(redNode)} color="#c23a2c" />}
          {blackNode && <ProbeTip pos={nodeWorld(blackNode)} color="#15181d" />}
          {holding && <Cable from={heldFrom} to={heldTip} color={holding === 'black' ? '#15181d' : '#c23a2c'} />}
          {holding && <ProbeTip pos={heldTip} color={holding === 'black' ? '#15181d' : '#c23a2c'} />}

          {/* plano de arraste do knob (so enquanto gira) */}
          {dragging && (
            <mesh
              position={[0, 0, 0.7]}
              onPointerMove={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                onKnobRotate(e.point);
              }}
              onPointerUp={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                onKnobRelease();
              }}
              onPointerLeave={onKnobRelease}
            >
              <planeGeometry args={[40, 30]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          )}
        </Suspense>
        <OrbitControls enablePan={false} enableRotate={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}
