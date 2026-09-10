/**
 * Pecas de desenho usadas pelo mapa do sistema e pela visualizacao isolada:
 * trechos de tubo, linhas de tubo, particulas de fluxo e o vidro translucido.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type Vec3 = [number, number, number];

/** Trecho reto de tubo entre dois pontos. Mantem o desenho anguloso, de esquema. */
export function Seg({
  from,
  to,
  r = 0.12,
  color = '#7d8798',
  metalness = 0.6,
  roughness = 0.5,
}: {
  from: Vec3;
  to: Vec3;
  r?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    return {
      pos: a.clone().addScaledVector(dir, 0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize(),
      ),
      len: dir.length(),
    };
  }, [from, to]);

  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 14]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/** Linha de tubos ligando varios pontos em sequencia, com joelho nas curvas. */
export function Run({
  points,
  r = 0.12,
  color,
  metalness,
  roughness,
  joints = true,
}: {
  points: Vec3[];
  r?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  joints?: boolean;
}) {
  return (
    <>
      {points.slice(1).map((p, i) => (
        <Seg
          key={i}
          from={points[i]}
          to={p}
          r={r}
          color={color}
          metalness={metalness}
          roughness={roughness}
        />
      ))}
      {joints &&
        points.slice(1, -1).map((p) => (
          <mesh key={p.join()} position={p}>
            <sphereGeometry args={[r, 14, 14]} />
            <meshStandardMaterial
              color={color}
              metalness={metalness ?? 0.6}
              roughness={roughness ?? 0.5}
            />
          </mesh>
        ))}
    </>
  );
}

/**
 * Ciclo lento de abertura da borboleta: 0 fechada, 1 aberta. A borboleta e o ar
 * leem a mesma funcao, entao o ar so anda quando ela abre.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function throttleOpening(t: number): number {
  return 0.04 + 0.96 * ((1 - Math.cos(t * 0.7)) / 2);
}

const EGR_LO = 0.25;
const EGR_HI = 0.72;

/**
 * Quanto a EGR esta aberta: 0 fechada, 1 toda aberta. So abre na faixa do meio,
 * porque em marcha lenta o motor morreria e em plena carga so atrapalharia.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function egrDuty(t: number): number {
  const load = throttleOpening(t);
  if (load <= EGR_LO || load >= EGR_HI) return 0;
  return Math.sin((Math.PI * (load - EGR_LO)) / (EGR_HI - EGR_LO));
}

export const RAIL_BAR_MIN = 40;
export const RAIL_BAR_SPAN = 170;

/** Pressao que a ECU quer na flauta de alta, em bar: sobe junto com a carga. */
// eslint-disable-next-line react-refresh/only-export-components
export function railTargetBar(t: number): number {
  return RAIL_BAR_MIN + RAIL_BAR_SPAN * throttleOpening(t);
}

/** Pressao real: corre atras do alvo com um atraso pequeno, que e a malha fechada trabalhando. */
// eslint-disable-next-line react-refresh/only-export-components
export function railRealBar(t: number): number {
  return RAIL_BAR_MIN + RAIL_BAR_SPAN * throttleOpening(t - 0.3);
}

const GDI_CYCLE = 4;
const GDI_PULSE = 0.07;
const GDI_START_HOMO = 0.05;
const GDI_START_STRAT = 0.4;

/** Fase do ciclo de quatro tempos: 0 e 0.5 no PMS, 0.25 e 0.75 no PMI. */
// eslint-disable-next-line react-refresh/only-export-components
export function gdiPhase(t: number): number {
  return (t % GDI_CYCLE) / GDI_CYCLE;
}

/** Alterna o modo a cada ciclo, para dar para comparar homogenea com estratificada. */
// eslint-disable-next-line react-refresh/only-export-components
export function gdiStratified(t: number): boolean {
  return Math.floor(t / GDI_CYCLE) % 2 === 1;
}

// eslint-disable-next-line react-refresh/only-export-components
function gdiStart(t: number): number {
  return gdiStratified(t) ? GDI_START_STRAT : GDI_START_HOMO;
}

/** Curso da agulha: 0 fechada, 1 aberta. Pulso curto, cedo na admissao ou tarde na compressao. */
// eslint-disable-next-line react-refresh/only-export-components
export function gdiNeedle(t: number): number {
  const k = (gdiPhase(t) - gdiStart(t)) / GDI_PULSE;
  if (k <= 0 || k >= 1) return 0;
  return Math.sqrt(Math.sin(Math.PI * k));
}

/** O pico de tensao do driver: so no comecinho do pulso, para arrancar a agulha. */
// eslint-disable-next-line react-refresh/only-export-components
export function gdiBoost(t: number): number {
  const k = (gdiPhase(t) - gdiStart(t)) / GDI_PULSE;
  if (k <= 0 || k >= 0.35) return 0;
  return 1 - k / 0.35;
}

/** Altura do pistao: 1 no PMS, -1 no PMI. Duas voltas de virabrequim por ciclo. */
// eslint-disable-next-line react-refresh/only-export-components
export function gdiPistonY(t: number): number {
  return Math.cos(gdiPhase(t) * 4 * Math.PI);
}

/** Faisca: pulso curtissimo no fim da compressao. */
// eslint-disable-next-line react-refresh/only-export-components
export function gdiSpark(t: number): number {
  const k = (gdiPhase(t) - 0.485) / 0.02;
  if (k <= 0 || k >= 1) return 0;
  return Math.sin(Math.PI * k);
}

/** Quanto da mistura ja se formou na camara: cresce depois da injecao e some na queima. */
// eslint-disable-next-line react-refresh/only-export-components
export function gdiMixture(t: number): number {
  const p = gdiPhase(t);
  const start = gdiStart(t);
  if (p < start || p > 0.52) return 0;
  return Math.min(1, (p - start) / 0.06);
}

const KNOCK_SPARK = 0.485;
const KNOCK_AUTO = 0.515;
const KNOCK_HIT = 0.565;

/** Quanto a frente de chama que saiu da vela ja avancou: 0 na faisca, 1 quando varreu a camara. */
// eslint-disable-next-line react-refresh/only-export-components
export function flameFront(t: number): number {
  const k = (gdiPhase(t) - KNOCK_SPARK) / 0.1;
  if (k <= 0) return 0;
  return Math.min(1, k);
}

/** A mistura do canto mais longe da vela se acendendo sozinha, por pressao e calor. */
// eslint-disable-next-line react-refresh/only-export-components
export function autoIgnition(t: number): number {
  const k = (gdiPhase(t) - KNOCK_AUTO) / 0.055;
  if (k <= 0) return 0;
  return Math.min(1, k);
}

/** O encontro das duas frentes: pico curto e violento no meio da camara. */
// eslint-disable-next-line react-refresh/only-export-components
export function knockShock(t: number): number {
  const k = (gdiPhase(t) - KNOCK_HIT) / 0.03;
  if (k <= 0 || k >= 1) return 0;
  return Math.sin(Math.PI * k);
}

/** A onda que corre pelo bloco depois do choque: oscila rapido e vai morrendo. */
// eslint-disable-next-line react-refresh/only-export-components
export function knockRing(t: number): number {
  const k = (gdiPhase(t) - KNOCK_HIT) / 0.16;
  if (k <= 0 || k >= 1) return 0;
  return Math.exp(-3.5 * k) * Math.sin(2 * Math.PI * 9 * k);
}

/** Sinal bruto do cristal: um chiado de fundo o tempo todo e o estouro quando bate. */
// eslint-disable-next-line react-refresh/only-export-components
export function knockSignal(t: number): number {
  return 0.11 * Math.sin(t * 61) * Math.sin(t * 23) + 0.95 * knockRing(t);
}

/** Janela de escuta: a ECU so olha o sinal num pedaco curto do giro, logo depois da faisca. */
// eslint-disable-next-line react-refresh/only-export-components
export function knockWindow(t: number): boolean {
  const p = gdiPhase(t);
  return p > KNOCK_SPARK && p < 0.63;
}

export const ADV_BASE = 24;
export const ADV_RETARD = 8;

/**
 * Avanco de ignicao em graus: despenca no instante da batida e volta subindo devagar.
 * Como a batida se repete, ele nunca chega de novo no avanco cheio.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function sparkAdvance(t: number): number {
  const p = gdiPhase(t);
  const since = p < KNOCK_HIT ? p + (1 - KNOCK_HIT) : p - KNOCK_HIT;
  const back = Math.max(0, Math.min(1, (since - 0.03) / 0.8));
  return ADV_BASE - ADV_RETARD * (1 - 0.72 * back);
}

export const CKP_TEETH = 60;
const CKP_RPS_MIN = 0.22;
const CKP_RPS_SPAN = 0.55;

/** Rotacao da roda dentada em voltas por segundo: sobe e desce junto com a borboleta. */
// eslint-disable-next-line react-refresh/only-export-components
export function ckpRps(t: number): number {
  return CKP_RPS_MIN + CKP_RPS_SPAN * throttleOpening(t);
}

/**
 * Voltas acumuladas. E a integral exata de ckpRps, para a roda, o cursor do
 * tracado e o sensor de fase andarem todos no mesmo compasso.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function ckpRevs(t: number): number {
  return CKP_RPS_MIN * t + CKP_RPS_SPAN * (0.52 * t - (0.48 / 0.7) * Math.sin(0.7 * t));
}

/** Onde a roda esta dentro da volta, de 0 a 1. */
// eslint-disable-next-line react-refresh/only-export-components
export function ckpTurn(t: number): number {
  const r = ckpRevs(t);
  return r - Math.floor(r);
}

/** Verdadeiro enquanto a falha de dois dentes esta passando na frente do sensor. */
// eslint-disable-next-line react-refresh/only-export-components
export function ckpGap(t: number): boolean {
  return ckpTurn(t) * CKP_TEETH < 2;
}

/** O quanto o sinal do indutivo cresce com a rotacao: 0 na partida, 1 em alta. */
// eslint-disable-next-line react-refresh/only-export-components
export function ckpAmplitude(t: number): number {
  return 0.2 + 0.8 * throttleOpening(t);
}

/** Senoide do sensor indutivo: some na falha e engorda conforme o motor sobe de giro. */
// eslint-disable-next-line react-refresh/only-export-components
export function ckpInductive(t: number): number {
  if (ckpGap(t)) return 0;
  return ckpAmplitude(t) * Math.sin(ckpRevs(t) * CKP_TEETH * Math.PI * 2);
}

/** Onda quadrada do Hall: mesma altura em qualquer rotacao, e fica em nivel baixo na falha. */
// eslint-disable-next-line react-refresh/only-export-components
export function ckpHall(t: number): number {
  if (ckpGap(t)) return -1;
  return Math.sin(ckpRevs(t) * CKP_TEETH * Math.PI * 2) > 0 ? 1 : -1;
}

const TANK_CYCLE = 34;

/** Nivel do tanque de 1 (cheio) a 0 (vazio): esvazia devagar e enche de novo no fim do ciclo. */
// eslint-disable-next-line react-refresh/only-export-components
export function fuelLevel(t: number): number {
  const p = (t % TANK_CYCLE) / TANK_CYCLE;
  if (p < 0.86) return 1 - p / 0.86;
  return (p - 0.86) / 0.14;
}

/** Reserva acesa: ultimo quinto do tanque. */
// eslint-disable-next-line react-refresh/only-export-components
export function fuelReserve(t: number): boolean {
  return fuelLevel(t) < 0.2;
}

/** Angulo do rotor da bomba: gira sempre, mais rapido com o motor pedindo mais. */
// eslint-disable-next-line react-refresh/only-export-components
export function pumpSpin(t: number): number {
  return t * (7 + 9 * throttleOpening(t));
}

/** Pivo e comprimento do braco da boia, em unidades locais do modulo. */
export const FLOAT_PIVOT_Y = -0.25;
export const FLOAT_ARM = 1.75;

/** Angulo do braco da boia: deitado para baixo no vazio, levantado no cheio. */
// eslint-disable-next-line react-refresh/only-export-components
export function floatAngle(t: number): number {
  return -1.0 + 1.95 * fuelLevel(t);
}

/** Altura da superficie do combustivel: e a mesma que a boia acompanha. */
// eslint-disable-next-line react-refresh/only-export-components
export function fuelSurfaceY(t: number): number {
  return FLOAT_PIVOT_Y + FLOAT_ARM * Math.sin(floatAngle(t));
}

const IGN_DWELL_START = 0.4;
const IGN_SPARK = 0.485;
const IGN_BURN = 0.115;
const IGN_RISE = 0.012;

/** Corrente do primario numa fase do ciclo: sobe enquanto carrega e vai a zero no corte. */
// eslint-disable-next-line react-refresh/only-export-components
export function primaryAt(p: number): number {
  if (p < IGN_DWELL_START || p >= IGN_SPARK) return 0;
  return 1 - Math.exp((-3.4 * (p - IGN_DWELL_START)) / (IGN_SPARK - IGN_DWELL_START));
}

/** Tensao do secundario: pico seco no corte e depois a linha de queima caindo. */
// eslint-disable-next-line react-refresh/only-export-components
export function secondaryAt(p: number): number {
  const k = p - IGN_SPARK;
  if (k < 0 || k > IGN_BURN) return 0;
  if (k < IGN_RISE) return k / IGN_RISE;
  const u = (k - IGN_RISE) / (IGN_BURN - IGN_RISE);
  return 0.3 * (1 - u) * (1 + 0.07 * Math.sin(u * 42));
}

/** Fase em que a ECU segura o terra do primario. */
// eslint-disable-next-line react-refresh/only-export-components
export function dwellWindow(p: number): boolean {
  return p >= IGN_DWELL_START && p < IGN_SPARK;
}

export const IGN_DWELL_X = IGN_DWELL_START;
export const IGN_SPARK_X = IGN_SPARK;

// eslint-disable-next-line react-refresh/only-export-components
export function primaryCurrent(t: number): number {
  return primaryAt(gdiPhase(t));
}

// eslint-disable-next-line react-refresh/only-export-components
export function secondaryKv(t: number): number {
  return secondaryAt(gdiPhase(t));
}

/** Avanco de ignicao em graus antes do ponto morto superior: cresce com a rotacao. */
// eslint-disable-next-line react-refresh/only-export-components
export function ignitionAdvance(t: number): number {
  return 8 + 28 * throttleOpening(t);
}

/** O comando de valvulas gira na metade da rotacao do virabrequim: uma volta por ciclo. */
// eslint-disable-next-line react-refresh/only-export-components
export function camRevs(t: number): number {
  return ckpRevs(t) * 0.5;
}

const CMP_PULSE_W = 0.08;

/** Pulso do sensor de fase numa fracao da volta do comando. */
// eslint-disable-next-line react-refresh/only-export-components
export function cmpPulseAt(u: number): number {
  return u < CMP_PULSE_W ? 1 : 0;
}

// eslint-disable-next-line react-refresh/only-export-components
export function cmpPulse(t: number): number {
  return cmpPulseAt(camRevs(t) % 1);
}

/** Quadrados por volta do virabrequim no tracado: o suficiente para dar escala, nao os 60 dentes. */
export const CKP_SQUARES = 6;

/** Onda quadrada do virabrequim na mesma base de tempo do comando. */
// eslint-disable-next-line react-refresh/only-export-components
export function ckpSquareAt(u: number): number {
  return (u * 2 * CKP_SQUARES) % 1 < 0.5 ? 1 : 0;
}

/** Quanto o variador adiantou o comando, em graus. */
// eslint-disable-next-line react-refresh/only-export-components
export function vvtAdvance(t: number): number {
  return 40 * throttleOpening(t);
}

/** Ordem de ignicao 1-3-4-2 em indices de cilindro. */
// eslint-disable-next-line react-refresh/only-export-components
export const FIRING_ORDER = [0, 2, 3, 1];

/** Qual cilindro esta na compressao agora: so da para saber com o sinal de fase. */
// eslint-disable-next-line react-refresh/only-export-components
export function firingCylinder(t: number): number {
  return FIRING_ORDER[Math.floor((camRevs(t) % 1) * 4) % 4];
}

const ECT_CYCLE = 30;
export const ECT_COLD = 20;
export const ECT_HOT = 98;

/** Ciclo de aquecimento do motor: sobe do frio ate a temperatura de trabalho e esfria de novo. */
// eslint-disable-next-line react-refresh/only-export-components
export function coolantTemp(t: number): number {
  const p = (t % ECT_CYCLE) / ECT_CYCLE;
  const span = ECT_HOT - ECT_COLD;
  if (p < 0.78) return ECT_COLD + span * (1 - Math.exp(-p / 0.2));
  return ECT_COLD + span * 0.98 * (1 - (p - 0.78) / 0.22);
}

/** Fracao entre frio e quente, para colorir liquido e ponta do sensor. */
// eslint-disable-next-line react-refresh/only-export-components
export function coolantHeat(t: number): number {
  return (coolantTemp(t) - ECT_COLD) / (ECT_HOT - ECT_COLD);
}

/** NTC: resistencia CAI quando a temperatura sobe. Calibrado em 2,5 kohm a 25 graus. */
// eslint-disable-next-line react-refresh/only-export-components
export function ntcOhm(tempC: number): number {
  return 2500 * Math.exp(4060 * (1 / (tempC + 273.15) - 1 / 298.15));
}

/** Resistor fixo dentro da ECU: e ele que forma o divisor com o NTC. */
export const ECT_PULLUP = 1000;

/** A ECU nao le ohm, le a tensao do meio do divisor. */
// eslint-disable-next-line react-refresh/only-export-components
export function ectVolts(tempC: number): number {
  const r = ntcOhm(tempC);
  return (5 * r) / (r + ECT_PULLUP);
}

export const FAN_ON_C = 94;

/* ---------------------------------------------------------------- sonda de banda larga (22) */

export const LAMBDA_MIN = 0.7;
export const LAMBDA_MAX = 1.3;

/**
 * Ciclo de 24 s do fator lambda como o scanner mostra: lenta oscilando em volta
 * de 1,00, pe no fundo enriquecendo, e corte na desaceleracao indo para pobre.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function lambdaValue(t: number): number {
  const p = (t % 24) / 24;
  if (p < 0.45) return 1 + 0.035 * Math.sin(p * 24 * Math.PI * 2);
  if (p < 0.55) return 1 - 0.12 * Math.sin(((p - 0.45) / 0.1) * Math.PI);
  if (p < 0.68) return 0.88;
  if (p < 0.78) return 0.88 + 0.34 * ((p - 0.68) / 0.1);
  if (p < 0.88) return 1.22;
  return 1.22 - 0.22 * ((p - 0.88) / 0.12);
}

/** Corrente de bombeamento em mA: linear, inverte de sentido e zera em lambda 1. */
// eslint-disable-next-line react-refresh/only-export-components
export function pumpCurrent(lambda: number): number {
  return Math.max(-3, Math.min(3, (lambda - 1) * 10));
}

/** Banda estreita: curva em S que satura nas duas pontas e nao mede o quanto. */
// eslint-disable-next-line react-refresh/only-export-components
export function narrowVolts(lambda: number): number {
  return 0.1 + 0.8 / (1 + Math.exp((lambda - 1) * 120));
}

/** Duty do aquecedor: alto no motor frio, baixo depois que a sonda chega na faixa. */
// eslint-disable-next-line react-refresh/only-export-components
export function heaterDuty(t: number): number {
  const p = (t % 24) / 24;
  return p < 0.3 ? 0.95 - 0.55 * (p / 0.3) : 0.4 + 0.12 * Math.sin(t * 1.4);
}

/** Temperatura da ceramica: so mede direito depois de passar dos 700 graus. */
// eslint-disable-next-line react-refresh/only-export-components
export function lambdaTempC(t: number): number {
  const p = (t % 24) / 24;
  return p < 0.3 ? 120 + 620 * (p / 0.3) : 740 + 30 * Math.sin(t * 0.9);
}

/* ---------------------------------------------------------------- catalisador (23) */

export const CAT_LIGHTOFF_C = 280;

/** Temperatura do favo desde a partida a frio ate a faixa de trabalho. */
// eslint-disable-next-line react-refresh/only-export-components
export function catTempC(t: number): number {
  const p = (t % 24) / 24;
  return p < 0.35 ? 60 + 720 * (p / 0.35) : 780 + 40 * Math.sin(t * 0.7);
}

/** Quanto o calor ja permite converter: zero abaixo de 180, cheio acima de 340. */
// eslint-disable-next-line react-refresh/only-export-components
export function catHeatOk(t: number): number {
  return Math.max(0, Math.min(1, (catTempC(t) - 180) / 160));
}

/** Varredura lenta da mistura, so para mostrar a janela de lambda 1. */
// eslint-disable-next-line react-refresh/only-export-components
export function catLambda(t: number): number {
  return 1 + 0.03 * Math.sin(t * 0.35);
}

/** Platina e paladio: precisam de oxigenio, entao caem na mistura rica. */
// eslint-disable-next-line react-refresh/only-export-components
export function oxidationEff(lambda: number): number {
  return 1 / (1 + Math.exp(-(lambda - 0.993) / 0.003));
}

/** Rodio: arranca o oxigenio do NOx, entao cai quando sobra oxigenio. */
// eslint-disable-next-line react-refresh/only-export-components
export function noxEff(lambda: number): number {
  return 1 / (1 + Math.exp((lambda - 1.006) / 0.003));
}

/** Conversao real: o pior dos tres gases, limitado pelo calor. */
// eslint-disable-next-line react-refresh/only-export-components
export function catEfficiency(t: number): number {
  const lam = catLambda(t);
  return Math.min(oxidationEff(lam), noxEff(lam)) * catHeatOk(t);
}

/** Sonda de antes: serrilha rapido em volta de 0,45 V. */
// eslint-disable-next-line react-refresh/only-export-components
export function preLambdaV(t: number): number {
  return 0.5 + 0.38 * Math.tanh(Math.sin(t * 3.4) * 3);
}

/** Sonda de depois: com o catalisador bom fica alta e quase parada. */
// eslint-disable-next-line react-refresh/only-export-components
export function postLambdaV(t: number): number {
  return 0.68 + 0.015 * Math.sin(t * 0.6);
}

/* ---------------------------------------------------------------- temperatura de escape (24) */

export const EGT_ENRICH_C = 800;
export const EGT_BOOST_C = 950;
export const EGT_POWER_C = 1050;
export const DPF_BURN_C = 600;

/** Ciclo de 26 s: cruzeiro, plena carga passando de 1000, protecao, alivio e regeneracao. */
// eslint-disable-next-line react-refresh/only-export-components
export function egtTempC(t: number): number {
  const p = (t % 26) / 26;
  if (p < 0.3) return 520 + 60 * Math.sin(t * 0.8);
  if (p < 0.5) return 520 + 560 * ((p - 0.3) / 0.2);
  if (p < 0.62) return 1080 - 120 * ((p - 0.5) / 0.12);
  if (p < 0.75) return 960 - 340 * ((p - 0.62) / 0.13);
  return 620 + 40 * Math.sin(t * 0.9);
}

/** PTC de platina tipo PT200: ao contrario do NTC, a resistencia SOBE com o calor. */
// eslint-disable-next-line react-refresh/only-export-components
export function ptcOhm(tempC: number): number {
  return 200 * (1 + 0.00385 * tempC);
}

/** Pressao do turbo depois que a ECU comeca a cortar para proteger. */
// eslint-disable-next-line react-refresh/only-export-components
export function egtBoost(t: number): number {
  return Math.max(0.15, 1 - Math.max(0, (egtTempC(t) - EGT_BOOST_C) / 150));
}

/** Fuligem no filtro: vai enchendo no gas frio e queima na regeneracao. */
// eslint-disable-next-line react-refresh/only-export-components
export function sootLoad(t: number): number {
  const p = (t % 26) / 26;
  return p < 0.75 ? 0.05 + p * 1.27 : Math.max(0, 1 - (p - 0.75) / 0.25);
}

// --- Catalisador acumulador de NOx: minutos guardando, segundos limpando -----
const NOX_CYCLE = 20;
const SULF_CYCLE = 60;

/** Onde estamos no ciclo de armazenamento, de 0 a 1. */
// eslint-disable-next-line react-refresh/only-export-components
export function noxPhase(t: number): number {
  return (t % NOX_CYCLE) / NOX_CYCLE;
}

/** Verdadeiro durante o pulso rico que esvazia o acumulador. */
// eslint-disable-next-line react-refresh/only-export-components
export function regenActive(t: number): boolean {
  return noxPhase(t) > 0.82;
}

// eslint-disable-next-line react-refresh/only-export-components
export function noxLambda(t: number): number {
  return regenActive(t) ? 0.93 : 1.35;
}

/** Quanto nitrato ja esta preso na parede: enche devagar, despeja rapido. */
// eslint-disable-next-line react-refresh/only-export-components
export function noxStore(t: number): number {
  const p = noxPhase(t);
  if (p <= 0.82) return 1 - Math.exp(-p / 0.34);
  const full = 1 - Math.exp(-0.82 / 0.34);
  return Math.max(0, full * (1 - (p - 0.82) / 0.14));
}

/** NOx que escapa e chega na sonda: baixo ate saturar, pico no fim do ciclo. */
// eslint-disable-next-line react-refresh/only-export-components
export function noxPpm(t: number): number {
  if (regenActive(t)) {
    const u = (noxPhase(t) - 0.82) / 0.18;
    return 30 + 300 * Math.max(0, 1 - u / 0.35);
  }
  return 15 + 420 * Math.max(0, (noxStore(t) - 0.7) / 0.3);
}

/** Contador que o scanner mostra: sobe uma unidade a cada limpeza. */
// eslint-disable-next-line react-refresh/only-export-components
export function regenCount(t: number): number {
  return Math.floor(t / NOX_CYCLE);
}

/** Enxofre ocupando os mesmos sitios do NOx: so sai na dessulfatacao. */
// eslint-disable-next-line react-refresh/only-export-components
export function sulfurLoad(t: number): number {
  const p = (t % SULF_CYCLE) / SULF_CYCLE;
  return p < 0.86 ? p / 0.86 : Math.max(0, 1 - (p - 0.86) / 0.14);
}

/** A limpeza longa e quente, bem mais rara que a regeneracao normal. */
// eslint-disable-next-line react-refresh/only-export-components
export function desulfActive(t: number): boolean {
  return (t % SULF_CYCLE) / SULF_CYCLE >= 0.86;
}

// --- Sonda de banda estreita depois do catalisador --------------------------
const LSF_CYCLE = 34;

/** Temperatura minima em que a zirconia comeca a gerar tensao. */
export const LSF_LIGHT_C = 320;

/** Catalisador envelhecendo e voltando ao normal: 0 saudavel, 1 gasto. */
// eslint-disable-next-line react-refresh/only-export-components
export function lsfCatAged(t: number): number {
  const p = (t % LSF_CYCLE) / LSF_CYCLE;
  if (p < 0.4) return 0;
  if (p < 0.55) return (p - 0.4) / 0.15;
  if (p < 0.85) return 1;
  return Math.max(0, 1 - (p - 0.85) / 0.15);
}

/** Sinal de depois: quase reto com catalisador bom, copiando o de tras quando gasta. */
// eslint-disable-next-line react-refresh/only-export-components
export function lsfPostV(t: number): number {
  const flat = 0.68 + 0.015 * Math.sin(t * 0.6);
  return flat + lsfCatAged(t) * (preLambdaV(t - 0.35) - flat) * 0.9;
}

/** Aquecedor levando a sonda a temperatura de trabalho logo na partida. */
// eslint-disable-next-line react-refresh/only-export-components
export function lsfTempC(t: number): number {
  const p = (t % LSF_CYCLE) / LSF_CYCLE;
  return p < 0.22 ? 40 + 700 * (p / 0.22) : 730 + 25 * Math.sin(t * 0.8);
}

/** Fria ela nao gera nada e a ECU acaba lendo a propria referencia de 0,45 V. */
// eslint-disable-next-line react-refresh/only-export-components
export function lsfSignalV(t: number): number {
  return lsfTempC(t) < LSF_LIGHT_C ? 0.45 : preLambdaV(t);
}

// --- Bateria, partida e alternador -----------------------------------------
const SYS_CYCLE = 28;

/** 0 repouso, 1 partida, 2 motor rodando. */
// eslint-disable-next-line react-refresh/only-export-components
export function sysPhase(t: number): number {
  const p = (t % SYS_CYCLE) / SYS_CYCLE;
  if (p < 0.25) return 0;
  if (p < 0.33) return 1;
  if (p < 0.9) return 2;
  return 0;
}

/** Tensao da rede: repouso, mergulho da partida, alternador e volta. */
// eslint-disable-next-line react-refresh/only-export-components
export function busVolts(t: number): number {
  const p = (t % SYS_CYCLE) / SYS_CYCLE;
  if (p < 0.25) return 12.6;
  if (p < 0.33) {
    const u = (p - 0.25) / 0.08;
    return u < 0.7 ? 12.6 - 2.8 * (u / 0.7) : 9.8 + 4.4 * ((u - 0.7) / 0.3);
  }
  if (p < 0.9) return 14.2 + 0.12 * Math.sin(t * 1.6);
  return 14.2 - 1.6 * Math.min(1, (p - 0.9) / 0.04);
}

/** O tranco do motor de partida, em amperes. */
// eslint-disable-next-line react-refresh/only-export-components
export function crankAmps(t: number): number {
  const p = (t % SYS_CYCLE) / SYS_CYCLE;
  if (p < 0.25 || p >= 0.33) return 0;
  const u = (p - 0.25) / 0.08;
  return u < 0.15 ? 380 * (u / 0.15) : Math.max(0, 380 - 300 * ((u - 0.15) / 0.85));
}

/** Estado de carga: cai no arranque e o alternador devolve. */
// eslint-disable-next-line react-refresh/only-export-components
export function socLevel(t: number): number {
  const p = (t % SYS_CYCLE) / SYS_CYCLE;
  if (p < 0.25) return 0.92;
  if (p < 0.33) return 0.92 - 0.14 * ((p - 0.25) / 0.08);
  if (p < 0.9) return Math.min(1, 0.78 + 0.22 * ((p - 0.33) / 0.57));
  return 1;
}

/** Tempo morto do injetor: com tensao baixa a agulha demora mais para levantar. */
// eslint-disable-next-line react-refresh/only-export-components
export function injDeadTimeMs(v: number): number {
  return Math.max(0.35, 2.6 - 0.145 * v);
}

/** A ECU soma o tempo morto ao tempo util para entregar a mesma massa. */
// eslint-disable-next-line react-refresh/only-export-components
export function injPulseMs(v: number): number {
  return 3.2 + injDeadTimeMs(v);
}

/** Limite de queda no cabo de terra com o motor rodando. */
export const GROUND_LIMIT_V = 0.1;

/** Queda no terra: cresce com a corrente e explode se o cabo estiver oxidado. */
// eslint-disable-next-line react-refresh/only-export-components
export function groundDropV(t: number, bad: boolean): number {
  const load = sysPhase(t) === 1 ? 1 : 0.25;
  return 0.01 + (bad ? 0.42 : 0.03) * load;
}

/** Bolinhas correndo pelo caminho: mostram o sentido do fluxo. */
export function Flow({
  points,
  color,
  count = 8,
  speed = 0.16,
  size = 0.08,
  gated = false,
}: {
  points: Vec3[];
  color: string;
  count?: number;
  speed?: number;
  size?: number;
  /** Amarra o fluxo a borboleta, a janela da EGR, ao pulso do injetor ou ao sinal do sensor de detonacao. */
  gated?: boolean | 'egr' | 'gdi' | 'knock';
}) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(...p)),
        false,
        'catmullrom',
        0,
      ),
    [points],
  );
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const gate =
      gated === 'egr'
        ? egrDuty(state.clock.elapsedTime)
        : gated === 'gdi'
          ? gdiNeedle(state.clock.elapsedTime)
          : gated === 'knock'
            ? Math.min(1, Math.abs(knockSignal(state.clock.elapsedTime)) * 1.8)
            : gated
              ? throttleOpening(state.clock.elapsedTime)
              : 1;
    t.current = (t.current + dt * speed * gate) % 1;
    g.children.forEach((c, i) => {
      const u = (t.current + i / count) % 1;
      c.position.copy(curve.getPointAt(u));
      // Nasce e some nas pontas, para nao piscar do nada no meio do desenho.
      const k = Math.min(1, u / 0.09, (1 - u) / 0.09);
      c.scale.setScalar((0.45 + k * 0.55) * (0.35 + 0.65 * gate));
      const mat = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = (0.15 + k * 0.75) * (0.2 + 0.8 * gate);
    });
  });

  return (
    <group ref={ref}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[size * (0.78 + 0.44 * ((i * 3) % 4)) * 0.55, 14, 14]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Carcaca translucida: deixa ver o que acontece dentro da peca. */
export const GLASS = {
  color: '#6f86ad',
  transparent: true,
  opacity: 0.2,
  metalness: 0.1,
  roughness: 0.35,
  depthWrite: false,
} as const;
