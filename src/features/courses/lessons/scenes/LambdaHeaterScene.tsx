import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Choice, Readout, SceneNotice, SceneShell, Slider, type SceneNoticeData } from './sceneUi';
import { LAMBDA_BG, ProbeBody, SceneLights, ScopeRef, ScopeTrace, Tag } from './lambdaParts';
import { heaterRampDuty, pwmAverageV } from './lambdaSim';

/**
 * Cena AQUECEDOR PWM: a ECU nao varia a tensao, ela liga e desliga a massa do
 * aquecedor bem rapido e muda a LARGURA do pulso. Duty alto com a sonda fria
 * trinca a ceramica, entao a ECU sobe o duty em rampa.
 */
export function LambdaHeaterScene() {
  const [fs, setFs] = useState(false);
  const [mode, setMode] = useState(0); // 0 = rampa da ECU, 1 = manual
  const [manualDuty, setManualDuty] = useState(1);
  const [notice, setNotice] = useState<SceneNoticeData | null>(null);
  const [live, setLive] = useState({ duty: 0.1, tempC: 20, cracked: false, t: 0 });
  const noticeKey = useRef(0);

  const samples = useRef<number[]>(new Array(240).fill(0));
  const cfg = useRef({ mode: 0, manualDuty: 1 });
  cfg.current = { mode, manualDuty };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let phase = 0;
    let tempC = 20;
    let acc = 0;
    let cracked = false;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      const duty = cfg.current.mode === 0 ? heaterRampDuty(t) : cfg.current.manualDuty;

      // Choque termico: duty alto com a ceramica ainda fria (agua no escape).
      if (duty > 0.9 && tempC < 200) cracked = true;

      // Aquecimento de 1a ordem: a potencia media manda na temperatura final.
      const target = 20 + duty * 900;
      tempC += (target - tempC) * Math.min(1, dt * 0.5);

      // Trem de pulsos: o desenho do PWM em si (10 Hz na tela para dar para ver).
      phase = (phase + dt * 6) % 1;
      samples.current.push(phase < duty ? 0.92 : 0.06);
      if (samples.current.length > 240) samples.current.shift();

      acc += dt;
      if (acc > 0.12) {
        acc = 0;
        setLive({ duty, tempC, cracked, t });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const selectMode = (i: number) => {
    setMode(i);
    noticeKey.current += 1;
    setNotice({
      key: noticeKey.current,
      tone: i === 0 ? 'up' : 'warn',
      text:
        i === 0
          ? 'RAMPA DA ECU: no arranque o escape ainda tem agua condensada. A ECU comeca com duty baixo e vai abrindo aos poucos, entao segura o duty no valor que mantem a temperatura alvo. A planar chega a operar em ~10 s; a dedal com aquecedor direto leva mais de 1 minuto.'
          : 'MODO MANUAL: agora voce escolhe o duty. Passe de 90% com a sonda ainda fria e veja o que acontece com a ceramica.',
    });
  };

  const changeDuty = (v: number) => {
    setManualDuty(v);
    if (v > 0.9 && live.tempC < 200) {
      noticeKey.current += 1;
      setNotice({
        key: noticeKey.current,
        tone: 'warn',
        text: 'Duty perto de 100% com a sonda fria: a ceramica sobe de temperatura de uma vez, encontra a agua condensada do escape e TRINCA. E exatamente por isso que a ECU usa rampa.',
      });
    }
  };

  const tempColor = live.tempC > 600 ? '#ff5a1e' : live.tempC > 300 ? '#ff9f43' : '#5b8def';
  const status = live.cracked
    ? 'ceramica trincada'
    : live.tempC > 600
      ? 'em regulacao'
      : live.tempC > 300
        ? 'sonda ativa'
        : 'aquecendo (malha aberta)';

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <>
          <Choice
            label="Aquecedor"
            options={['Rampa da ECU', 'Manual']}
            value={mode}
            color="#ff9f43"
            onChange={selectMode}
          />
          {mode === 1 && (
            <Slider
              label="Duty cycle"
              value={manualDuty}
              min={0}
              max={1}
              step={0.01}
              color="#37d67a"
              valueLabel={`${Math.round(manualDuty * 100)} %`}
              onChange={changeDuty}
            />
          )}
          <Readout
            items={[
              { label: 'Duty', value: `${Math.round(live.duty * 100)} %`, color: '#37d67a' },
              {
                label: 'Tensao media',
                value: `${pwmAverageV(live.duty).toFixed(1)} V`,
                color: '#9db8ff',
              },
              { label: 'Ceramica', value: `${Math.round(live.tempC)} °C`, color: tempColor },
              { label: 'Estado', value: status, color: live.cracked ? '#ff4d4f' : tempColor },
            ]}
          />
        </>
      }
    >
      <SceneNotice notice={notice} />
      <Canvas key={fs ? 'fs' : 'win'} camera={{ position: [0, 0.2, fs ? 4.2 : 5.2] }} dpr={[1, 1.5]}>
        <color attach="background" args={[LAMBDA_BG]} />
        <SceneLights />
        <Suspense fallback={null}>
          <group position={[-0.55, 0.05, 0]}>
            <ScopeTrace samples={samples} width={3.2} height={1.5} color="#37d67a" />
            <ScopeRef y={0.63} width={3.2} color="#5b8def" label="12 V (massa aberta)" />
            <ScopeRef y={-0.66} width={3.2} color="#7c8aa3" label="0 V (massa fechada)" />
            <Tag position={[-1.6, -1.15, 0]} text="a ECU chaveia a MASSA e muda a largura do pulso" color="#7c8aa3" size={0.12} />
          </group>
          <group position={[2.1, -0.1, 0]}>
            <ProbeBody
              glow={Math.min(1.4, Math.max(0, (live.tempC - 200) / 500))}
              tipColor={live.cracked ? '#8a4a4a' : '#e6e2d8'}
            />
            <Tag position={[0.3, -0.35, 0]} text={live.cracked ? 'ceramica trincada' : 'ceramica'} color={live.cracked ? '#ff4d4f' : '#e6e2d8'} size={0.12} />
            <Tag position={[-1.3, 1.5, 0]} text="abaixo de 300 °C a sonda nao gera sinal" color="#7c8aa3" size={0.12} />
          </group>
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}
