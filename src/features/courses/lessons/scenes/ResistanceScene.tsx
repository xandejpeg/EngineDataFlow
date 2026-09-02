import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Choice, Readout, SceneNotice, SceneShell, type SceneNoticeData } from './sceneUi';
import { CircuitStage, SceneLights, WHITE_BG, filamentColor, filamentTempC } from './circuitParts';

const V_FIXED = 12; // bateria fixa
// Lampadas de resistencia diferente para comparar (I = 12 / R).
const LAMPS = [
  { label: '3 Ω', R: 3, color: '#ffcf7a' }, // 4 A
  { label: '6 Ω', R: 6, color: '#8ef0b8' }, // 2 A
  { label: '12 Ω', R: 12, color: '#9db8ff' }, // 1 A
];
const P_REF = (V_FIXED * V_FIXED) / 3; // 48 W (na de 3 Ω)

/** Experimento RESISTENCIA: troque lampadas de resistencia diferente e compare corrente e brilho. */
export function ResistanceScene() {
  const [idx, setIdx] = useState(1);
  const [on, setOn] = useState(true);
  const [fs, setFs] = useState(false);
  const [notice, setNotice] = useState<SceneNoticeData | null>(null);
  const noticeKey = useRef(0);
  const R = LAMPS[idx].R;
  const current = on ? V_FIXED / R : 0;
  const power = V_FIXED * current;
  const norm = current / 4; // max 4 A (3 Ω)
  const tempC = filamentTempC(power / P_REF);

  // Ao trocar a lampada, explica a cadeia resistencia -> corrente -> potencia -> brilho.
  const selectLamp = (next: number) => {
    const prevR = LAMPS[idx].R;
    const nextR = LAMPS[next].R;
    setIdx(next);
    if (nextR === prevR) return;
    noticeKey.current += 1;
    const nextI = V_FIXED / nextR;
    const nextP = V_FIXED * nextI;
    if (nextR > prevR) {
      setNotice({
        key: noticeKey.current,
        tone: 'down',
        text: `Mais resistencia (${nextR} Ω): a corrente cai para ${nextI.toFixed(0)} A -> menos potencia (${nextP.toFixed(0)} W), menos eletrons circulando e a lampada acende mais fraca.`,
      });
    } else {
      setNotice({
        key: noticeKey.current,
        tone: 'up',
        text: `Menos resistencia (${nextR} Ω): a corrente sobe para ${nextI.toFixed(0)} A -> mais potencia (${nextP.toFixed(0)} W), mais eletrons circulando e a lampada acende mais forte.`,
      });
    }
  };

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <>
          <Choice
            label="Lampada"
            options={LAMPS.map((l) => l.label)}
            value={idx}
            color="#ff9f43"
            onChange={selectLamp}
          />
          <Readout
            items={[
              { label: 'Resistencia', value: `${R} Ω`, color: '#ff9f43' },
              { label: 'Corrente', value: `${current.toFixed(1)} A`, color: '#37d67a' },
              { label: 'Potencia', value: `${power.toFixed(0)} W`, color: '#c99bff' },
              { label: 'Filamento', value: `${Math.round(tempC)} °C`, color: '#ff5a1e' },
            ]}
          />
        </>
      }
    >
      <SceneNotice notice={notice} />
      <Canvas key={fs ? 'fs' : 'win'} camera={{ position: fs ? [0, 0.35, 5] : [0, 0.1, 7.3] }} dpr={[1, 1.5]}>
        <color attach="background" args={[WHITE_BG]} />
        <SceneLights />
        <Suspense fallback={null}>
          <CircuitStage
            lampLevel={power / P_REF}
            glowColor={filamentColor(tempC)}
            electronCount={Math.round(norm * 32)}
            electronSpeed={0.22}
            switchOn={on}
            onToggleSwitch={() => setOn((v) => !v)}
            lampColor={LAMPS[idx].color}
          />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}
