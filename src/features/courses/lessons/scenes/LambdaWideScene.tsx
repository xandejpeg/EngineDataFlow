import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  Readout,
  SceneNotice,
  SceneShell,
  Slider,
  type SceneNoticeData,
} from './sceneUi';
import { IonFlow, LAMBDA_BG, SceneLights, Tag, WireHarness } from './lambdaParts';
import { pumpMa } from './lambdaSim';

/**
 * Cena SONDA DE BANDA LARGA: as duas celulas, a camara de difusao e a corrente
 * de bombeamento que a ECU usa para manter a camara sempre em lambda = 1.
 */
export function LambdaWideScene() {
  const [fs, setFs] = useState(false);
  const [lambda, setLambda] = useState(1.0);
  const [notice, setNotice] = useState<SceneNoticeData | null>(null);
  const noticeKey = useRef(0);
  const lastZone = useRef('eq');

  const ip = pumpMa(lambda);

  const changeLambda = (v: number) => {
    setLambda(v);
    const next = pumpMa(v);
    const z = next > 0.06 ? 'lean' : next < -0.06 ? 'rich' : 'eq';
    if (z === lastZone.current) return;
    lastZone.current = z;
    noticeKey.current += 1;
    if (z === 'lean') {
      setNotice({
        key: noticeKey.current,
        tone: 'down',
        text: 'Mistura POBRE: sobra oxigenio dentro da camara de difusao. Para manter a camara em lambda = 1, a ECU bombeia o O2 para FORA — a corrente fica POSITIVA. Quanto mais pobre, maior a corrente: aqui a leitura e LINEAR, ela diz o QUANTO e nao so o lado.',
      });
    } else if (z === 'rich') {
      setNotice({
        key: noticeKey.current,
        tone: 'up',
        text: 'Mistura RICA: falta oxigenio na camara. A ECU inverte o sentido e bombeia O2 para DENTRO — a corrente fica NEGATIVA. E o sinal invertido que diz o quanto de combustivel esta sobrando.',
      });
    } else {
      setNotice({
        key: noticeKey.current,
        tone: 'up',
        text: 'Lambda = 1 exato: a celula de Nernst le 450 mV, nao precisa bombear nada e a corrente cai para ZERO. Esse ponto de corrente nula e a referencia da banda larga.',
      });
    }
  };

  const ipColor = ip > 0.06 ? '#5b8def' : ip < -0.06 ? '#ff7a45' : '#37d67a';
  const dir = ip > 0.06 ? 1 : ip < -0.06 ? -1 : 0;
  const mixLabel = ip > 0.06 ? 'pobre' : ip < -0.06 ? 'rica' : 'lambda = 1';

  return (
    <SceneShell
      onFullscreenChange={setFs}
      controls={
        <>
          <Slider
            label="Fator lambda"
            value={lambda}
            min={0.75}
            max={2.5}
            step={0.01}
            color="#ff9f43"
            valueLabel={`λ ${lambda.toFixed(2)}`}
            onChange={changeLambda}
          />
          <Readout
            items={[
              { label: 'Mistura', value: mixLabel, color: ipColor },
              {
                label: 'Corrente de bomba',
                value: `${ip >= 0 ? '+' : ''}${ip.toFixed(2)} mA`,
                color: ipColor,
              },
              { label: 'Celula de Nernst', value: '450 mV', color: '#37d67a' },
              { label: 'Temperatura', value: '750 °C', color: '#ff5a1e' },
            ]}
          />
        </>
      }
    >
      <SceneNotice notice={notice} />
      <Canvas key={fs ? 'fs' : 'win'} camera={{ position: [0, 0.1, fs ? 4.4 : 5.4] }} dpr={[1, 1.5]}>
        <color attach="background" args={[LAMBDA_BG]} />
        <SceneLights />
        <Suspense fallback={null}>
          <group position={[-0.7, -0.1, 0]}>
            {/* Gas de escape do lado de fora */}
            <mesh position={[-0.75, 0, -0.1]}>
              <boxGeometry args={[0.5, 2.4, 0.4]} />
              <meshStandardMaterial color="#2b2f3a" transparent opacity={0.55} />
            </mesh>
            <Tag position={[-1.05, 1.35, 0]} text="gas de escape" color="#9aa4b5" size={0.12} />

            {/* Celula de bombeamento */}
            <mesh position={[-0.28, 0, 0]}>
              <boxGeometry args={[0.22, 2.2, 0.5]} />
              <meshStandardMaterial color="#b9c6d6" metalness={0.2} roughness={0.6} />
            </mesh>
            <Tag position={[-0.55, -1.35, 0]} text="celula de bombeamento" color="#b9c6d6" size={0.13} />

            {/* Camara de difusao */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.3, 2.0, 0.48]} />
              <meshStandardMaterial color="#1b2333" metalness={0} roughness={1} />
            </mesh>
            <Tag position={[-0.16, 1.25, 0.3]} text="camara de difusao (sempre λ = 1)" color="#ffd479" size={0.125} />
            <IonFlow direction={dir} x={0} yFrom={-1.0} yTo={1.0} color={dir > 0 ? '#5b8def' : '#ff7a45'} count={8} speed={0.6 + Math.abs(ip) * 0.5} />

            {/* Celula de Nernst */}
            <mesh position={[0.28, 0, 0]}>
              <boxGeometry args={[0.22, 2.2, 0.5]} />
              <meshStandardMaterial color="#e6e2d8" metalness={0.05} roughness={0.75} />
            </mesh>
            <Tag position={[0.45, 0.55, 0]} text="celula de Nernst" color="#e6e2d8" size={0.13} />

            {/* Canal de ar de referencia */}
            <mesh position={[0.52, 0, 0]}>
              <boxGeometry args={[0.12, 2.0, 0.44]} />
              <meshStandardMaterial color="#2f4468" />
            </mesh>
            <Tag position={[0.66, 0.1, 0]} text="ar de referencia" color="#9db8ff" size={0.12} />

            {/* Trilha do aquecedor */}
            <mesh position={[0.74, 0, 0]}>
              <boxGeometry args={[0.14, 2.1, 0.42]} />
              <meshStandardMaterial color="#c87f4a" metalness={0.6} roughness={0.5} />
            </mesh>
            <Tag position={[0.9, -0.5, 0]} text="aquecedor (PWM)" color="#c87f4a" size={0.12} />
            <Tag position={[-0.9, -1.62, 0]} text="a resistencia da celula de Nernst e o termometro da ECU" color="#7c8aa3" size={0.115} />
          </group>

          {/* Chicote: 5 fios na sonda, 6 no chicote (o 6o e o resistor de calibracao) */}
          <group position={[2.35, -0.1, 0]}>
            <WireHarness
              colors={['#8a8f98', '#e8e8e8', '#f5d547', '#111111', '#e03b3b', '#7a5cd6']}
              position={[0, 0.2, 0]}
              length={1.0}
            />
            <Tag position={[0.35, 1.28, 0]} text="cinza: + aquecedor" color="#8a8f98" size={0.115} />
            <Tag position={[0.35, 1.11, 0]} text="branco: - aquecedor (PWM)" color="#e8e8e8" size={0.115} />
            <Tag position={[0.35, 0.94, 0]} text="amarelo: referencia negativa" color="#f5d547" size={0.115} />
            <Tag position={[0.35, 0.77, 0]} text="preto: alimentacao do elemento" color="#c9c9c9" size={0.115} />
            <Tag position={[0.35, 0.6, 0]} text="vermelho: sinal" color="#e03b3b" size={0.115} />
            <Tag position={[0.35, 0.43, 0]} text="6o: resistor de calibracao" color="#7a5cd6" size={0.115} />
          </group>
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={fs} />
      </Canvas>
    </SceneShell>
  );
}
