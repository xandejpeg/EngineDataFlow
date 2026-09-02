import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Choice, Readout, SceneNotice, SceneShell, type SceneNoticeData } from './sceneUi';
import { CircuitStage, SceneLights, WHITE_BG, filamentColor, filamentTempC } from './circuitParts';

const FUSE_A = 10; // fusivel de 10 A
// Cada lampada puxa a SUA corrente do circuito (I = V / R da lampada).
const LAMPS = [
  { label: '5 A', amps: 5, color: '#ffcf7a' },
  { label: '8 A', amps: 8, color: '#7fd3ff' },
  { label: '12 A', amps: 12, color: '#c99bff' },
];

/** Experimento CORRENTE: mais corrente = MAIS eletrons (mesma velocidade); a de 12 A queima o fusivel. */
export function CurrentScene() {
  const [idx, setIdx] = useState(0);
  const [on, setOn] = useState(true);
  const [blown, setBlown] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [fs, setFs] = useState(false);
  const [notice, setNotice] = useState<SceneNoticeData | null>(null);
  const swapTimer = useRef<number | null>(null);
  const noticeKey = useRef(0);
  const draw = LAMPS[idx].amps;

  // Enquanto o fusivel novo desce (replacing), nao queima de novo: deixa a
  // animacao terminar; so entao reavalia se a corrente ainda passa do limite.
  useEffect(() => {
    if (!blown && !replacing && on && draw > FUSE_A) setBlown(true);
  }, [draw, on, blown, replacing]);

  useEffect(() => () => {
    if (swapTimer.current) window.clearTimeout(swapTimer.current);
  }, []);

  const replaceFuse = () => {
    setBlown(false);
    setReplacing(true);
    if (swapTimer.current) window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => setReplacing(false), 1400);
  };

  // Ao trocar a lampada, mostra um aviso explicando o efeito na quantidade de eletrons.
  const selectLamp = (next: number) => {
    const prevAmps = LAMPS[idx].amps;
    const amps = LAMPS[next].amps;
    setIdx(next);
    if (amps === prevAmps) return;
    noticeKey.current += 1;
    if (amps > FUSE_A) {
      setNotice({
        key: noticeKey.current,
        tone: 'warn',
        text: `Lampada de ${amps} A: passa do limite do fusivel (${FUSE_A} A) -> o fusivel queima, corta a corrente e os eletrons param.`,
      });
    } else if (amps > prevAmps) {
      setNotice({
        key: noticeKey.current,
        tone: 'up',
        text: `Mais amperagem (${amps} A): o circuito passa a ter MAIS eletrons circulando por segundo -> maior carga eletrica em movimento.`,
      });
    } else {
      setNotice({
        key: noticeKey.current,
        tone: 'down',
        text: `Menos amperagem (${amps} A): MENOS eletrons circulando por segundo -> menor carga eletrica em movimento.`,
      });
    }
  };

  const current = on && !blown ? draw : 0;
  const norm = current / FUSE_A;
  const electronCount = 2 + Math.round(norm * 40);
  const shownElectrons = current > 0 ? electronCount : 0;
  const tempC = filamentTempC(Math.min(current / 8, 1));

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <>
          <Choice
            label="Lampada"
            options={LAMPS.map((l) => l.label)}
            value={idx}
            color="#37d67a"
            onChange={selectLamp}
          />
          <Readout
            items={[
              {
                label: 'Corrente',
                value: `${current.toFixed(0)} A`,
                color: blown ? '#ff5a1e' : '#37d67a',
              },
              {
                label: 'Fusivel',
                value: blown ? 'QUEIMADO' : `OK (${FUSE_A} A)`,
                color: blown ? '#ff5a1e' : '#37d67a',
              },
              {
                label: 'Eletrons',
                value: shownElectrons > 0 ? `~${shownElectrons}` : '0',
                color: shownElectrons > 0 ? '#6aa1ff' : '#7c8aa3',
              },
            ]}
          />
          {blown && (
            <button
              type="button"
              onClick={replaceFuse}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #ff5a1e',
                background: 'rgba(255,90,30,0.15)',
                color: '#ffb59a',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Trocar fusivel
            </button>
          )}
        </>
      }
    >
      <SceneNotice notice={notice} />
      <Canvas key={fs ? 'fs' : 'win'} camera={{ position: fs ? [0, 0.35, 5] : [0, 0.1, 7.3] }} dpr={[1, 1.5]}>
        <color attach="background" args={[WHITE_BG]} />
        <SceneLights />
        <Suspense fallback={null}>
          <CircuitStage
            lampLevel={Math.min(current / 8, 1)}
            glowColor={filamentColor(tempC)}
            electronCount={electronCount}
            electronSpeed={0.22}
            switchOn={on}
            onToggleSwitch={() => setOn((v) => !v)}
            fuseBlown={blown}
            lampColor={LAMPS[idx].color}
          />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}
