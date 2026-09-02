import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Readout, SceneShell, Slider } from './sceneUi';
import {
  CircuitStage,
  DRAPER_C,
  FILAMENT_MAX_C,
  SceneLights,
  WHITE_BG,
  filamentColor,
  filamentTempC,
} from './circuitParts';

const P_REF = (24 * 24) / 2; // 288 W (potencia no ajuste maximo: 24 V / 2 Ω)
const I_MAX = 24 / 2; // 12 A

/** Experimento POTENCIA: junta tudo — mexa na tensao e na resistencia e veja o circuito reagir. */
export function PowerScene() {
  const [volts, setVolts] = useState(12);
  const [resistance, setResistance] = useState(6);
  const [on, setOn] = useState(true);
  const [fs, setFs] = useState(false);
  const current = on ? volts / resistance : 0;
  const power = volts * current;
  // Temperatura do filamento: perde calor por RADIACAO (Stefan-Boltzmann), T ~ P^(1/4).
  const tempC = filamentTempC(power / P_REF);
  // Brilho visivel: so incandesce acima do ponto Draper e cresce rapido (nao linear).
  const glow = Math.max(0, Math.min(1, (tempC - DRAPER_C) / (FILAMENT_MAX_C - DRAPER_C)));
  const lampLevel = glow * glow;
  const norm = current / I_MAX;
  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <>
          <Slider
            label="Tensao"
            value={volts}
            min={0}
            max={24}
            step={1}
            color="#5b8def"
            onChange={setVolts}
            valueLabel={`${volts} V`}
          />
          <Slider
            label="Resistencia"
            value={resistance}
            min={2}
            max={24}
            step={1}
            color="#ff9f43"
            onChange={setResistance}
            valueLabel={`${resistance} Ω`}
          />
          <Readout
            items={[
              { label: 'Corrente', value: `${current.toFixed(1)} A`, color: '#37d67a' },
              { label: 'Potencia', value: `${Math.round(power)} W`, color: '#c99bff' },
              { label: 'Filamento', value: `${Math.round(tempC)} °C`, color: '#ff5a1e' },
            ]}
          />
        </>
      }
    >
      <Canvas key={fs ? 'fs' : 'win'} camera={{ position: fs ? [0, 0.35, 5] : [0, 0.1, 7.3] }} dpr={[1, 1.5]}>
        <color attach="background" args={[WHITE_BG]} />
        <SceneLights />
        <Suspense fallback={null}>
          <CircuitStage
            lampLevel={lampLevel}
            glowColor={filamentColor(tempC)}
            electronCount={Math.round(norm * 32)}
            electronSpeed={0.22}
            switchOn={on}
            onToggleSwitch={() => setOn((v) => !v)}
          />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}
