import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Choice, Readout, SceneNotice, SceneShell, type SceneNoticeData } from './sceneUi';
import { LAMBDA_BG, ProbeBody, SceneLights, ScopeRef, ScopeTrace, Tag, WireHarness } from './lambdaParts';
import {
  mixtureLabel,
  nernstMv,
  newLoopState,
  stepLoop,
  type MixtureFault,
} from './lambdaSim';

const FAULTS: { label: string; id: MixtureFault; msg: string; tone: 'up' | 'down' | 'warn' }[] = [
  {
    label: 'Normal',
    id: 'ok',
    msg: 'Motor sadio: a ECU fica oscilando de leve em torno de 450 mV e a correcao (fuel trim) para perto de zero.',
    tone: 'up',
  },
  {
    label: 'Ar falso',
    id: 'air-leak',
    msg: 'Entrada de ar falsa: entra oxigenio a mais, a sonda cai para ~100 mV (POBRE) e a ECU precisa AUMENTAR o tempo de injecao. A correcao sobe e fica presa la em cima — e assim que o scanner mostra fuel trim positivo alto.',
    tone: 'warn',
  },
  {
    label: 'Injetor vazando',
    id: 'leaky-injector',
    msg: 'Injetor vazando: sobra combustivel, a sonda sobe para ~900 mV (RICA) e a ECU precisa REDUZIR o tempo de injecao. A correcao vai para o negativo.',
    tone: 'warn',
  },
];

/**
 * Cena SONDA DE BANDA ESTREITA: mostra por que o sinal fica oscilando entre
 * 100 e 900 mV e o que a ECU esta fazendo a cada cruzamento dos 450 mV.
 */
export function LambdaNarrowScene() {
  const [fs, setFs] = useState(false);
  const [faultIdx, setFaultIdx] = useState(0);
  const [closed, setClosed] = useState(1);
  const [notice, setNotice] = useState<SceneNoticeData | null>(null);
  const [live, setLive] = useState({ mv: 450, trim: 0, tempC: 20, hz: 0 });
  const noticeKey = useRef(0);

  const samples = useRef<number[]>(new Array(240).fill(0.5));
  const sim = useRef(newLoopState());
  const cfg = useRef({ fault: 'ok' as MixtureFault, closedLoop: true });
  cfg.current = { fault: FAULTS[faultIdx].id, closedLoop: closed === 1 };

  // Simulacao propria em requestAnimationFrame: o buffer do grafico vive em ref
  // (sem re-render) e os mostradores atualizam so 8x por segundo.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let crossings = 0;
    let window0 = last;
    let prevRich = false;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stepLoop(sim.current, dt, {
        fault: cfg.current.fault,
        closedLoop: cfg.current.closedLoop,
        gain: 0.9,
        heaterOn: true,
      });
      const mv = s.tempC > 300 ? nernstMv(s.sensed) : 0;
      samples.current.push(mv / 1000);
      if (samples.current.length > 240) samples.current.shift();

      const rich = mv > 450;
      if (rich !== prevRich) crossings += 1;
      prevRich = rich;

      acc += dt;
      if (acc > 0.12) {
        acc = 0;
        const span = (now - window0) / 1000;
        const hz = span > 1.5 ? crossings / 2 / span : 0;
        if (span > 3) {
          crossings = 0;
          window0 = now;
        }
        setLive({ mv, trim: s.trim, tempC: s.tempC, hz });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const selectFault = (i: number) => {
    setFaultIdx(i);
    noticeKey.current += 1;
    setNotice({ key: noticeKey.current, tone: FAULTS[i].tone, text: FAULTS[i].msg });
  };

  const selectLoop = (i: number) => {
    setClosed(i);
    noticeKey.current += 1;
    setNotice({
      key: noticeKey.current,
      tone: i === 1 ? 'up' : 'warn',
      text:
        i === 1
          ? 'MALHA FECHADA: a ECU volta a obedecer a sonda. Como a sonda so diz o LADO (rica ou pobre), a ECU corrige ate cruzar os 450 mV, passa do ponto e volta — por isso o sinal NUNCA para quieto. Essa oscilacao e o metodo, nao defeito: a MEDIA do tempo cai em lambda = 1.'
          : 'MALHA ABERTA: a ECU ignora a sonda e injeta pelo mapa (motor frio, plena carga ou sonda fria). A correcao congela e o sinal para de oscilar.',
    });
  };

  const state = live.tempC > 300 ? mixtureLabel(live.mv) : 'sonda fria';
  const stateColor =
    state === 'rica' ? '#ff7a45' : state === 'pobre' ? '#5b8def' : state === 'lambda = 1' ? '#37d67a' : '#7c8aa3';

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <>
          <Choice
            label="Mistura"
            options={FAULTS.map((f) => f.label)}
            value={faultIdx}
            color="#ff9f43"
            onChange={selectFault}
          />
          <Choice
            label="Controle"
            options={['Malha aberta', 'Malha fechada']}
            value={closed}
            color="#37d67a"
            onChange={selectLoop}
          />
          <Readout
            items={[
              { label: 'Sonda', value: `${Math.round(live.mv)} mV`, color: stateColor },
              { label: 'Estado', value: state, color: stateColor },
              {
                label: 'Correcao',
                value: `${live.trim >= 0 ? '+' : ''}${(live.trim * 100).toFixed(1)} %`,
                color: '#c99bff',
              },
              { label: 'Oscilacao', value: `${live.hz.toFixed(1)} Hz`, color: '#9db8ff' },
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
            <ScopeTrace samples={samples} width={3.2} height={1.7} color="#37d67a" />
            <ScopeRef y={-0.005} width={3.2} color="#ff9f43" label="450 mV" />
            <ScopeRef y={0.68} width={3.2} color="#ff7a45" label="900 mV rica" />
            <ScopeRef y={-0.68} width={3.2} color="#5b8def" label="100 mV pobre" />
          </group>
          <group position={[2.1, -0.1, 0]}>
            <ProbeBody glow={live.tempC > 300 ? 0.6 : 0.05} />
            <WireHarness colors={['#e8e8e8', '#e8e8e8', '#111111', '#8a8f98']} position={[0, 1.1, 0]} />
            <Tag position={[0.25, 1.85, 0]} text="2x aquecedor" color="#e8e8e8" size={0.115} />
            <Tag position={[0.25, 1.68, 0]} text="sinal (preto)" color="#c9c9c9" size={0.115} />
            <Tag position={[0.25, 1.51, 0]} text="massa (cinza)" color="#8a8f98" size={0.115} />
            <Tag position={[0.32, -0.35, 0]} text="celula de zirconia" color="#e6e2d8" size={0.115} />
            <Tag position={[-1.5, -1.35, 0]} text="a sonda GERA a propria tensao" color="#7c8aa3" size={0.12} />
          </group>
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}
