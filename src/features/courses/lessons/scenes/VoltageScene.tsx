import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Readout, SceneShell, Slider } from './sceneUi';
import { CircuitStage, SceneLights, WHITE_BG, filamentColor, filamentTempC } from './circuitParts';

const R_LAMP = 6; // Ohm — o filamento da lampada e a resistencia do circuito
const P_REF = (24 * 24) / R_LAMP; // 96 W (brilho de referencia)

/** Experimento TENSAO: mais volts = mais pressao = os mesmos eletrons circulam mais rapido. */
export function VoltageScene() {
  const [volts, setVolts] = useState(12);
  const [on, setOn] = useState(true);
  const [fs, setFs] = useState(false);
  const current = on ? volts / R_LAMP : 0;
  const power = volts * current;
  const tempC = filamentTempC(power / P_REF);
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
          />
          <Readout
            items={[
              { label: 'Tensao', value: `${volts} V`, color: '#5b8def' },
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
            lampLevel={(volts * current) / P_REF}
            glowColor={filamentColor(tempC)}
            electronCount={6}
            electronSpeed={(volts / 24) * 0.6}
            switchOn={on}
            onToggleSwitch={() => setOn((v) => !v)}
          />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}
