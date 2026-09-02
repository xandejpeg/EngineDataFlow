/**
 * Cinematica do motor monocilindrico de 4 tempos (ciclo Otto) — Aula 3.
 *
 * Referencia real: moto "150" (ex.: diametro 57,3 mm x curso 57,8 mm ≈ 149 cm³).
 * Um motor 4 tempos precisa de DUAS voltas do virabrequim (720°) para completar
 * os 4 tempos: cada tempo = meia volta (180°). O comando de valvulas gira na
 * METADE da rotacao do virabrequim (360° por ciclo) — por isso ele define o tempo.
 *
 * Unidades: metros de cena (nao milimetros). As proporcoes seguem um monocilindro
 * real (relacao biela/manivela ≈ 3,1), so que em escala de palco.
 */

/** Raio do virabrequim (manivela) = metade do curso do pistao. */
export const CRANK_R = 0.62;
/** Comprimento da biela (centro a centro). */
export const ROD_L = 1.95;
/** Altura (Y) do centro do virabrequim. */
export const CRANK_Y = -1.55;
/** Raio interno do cilindro (camisa). */
export const BORE_R = 0.5;
/** Raio do pistao (um pouco menor que a camisa). */
export const PISTON_R = 0.46;
/** Meia-altura do corpo do pistao: do pino ate a coroa (topo). */
export const PISTON_HALF = 0.42;
/** Folga entre a coroa no PMS e o tampo do cabecote (camara de combustao minima). */
export const DECK_CLEAR = 0.12;

/** Y do pino do pistao no Ponto Morto Superior (PMS / TDC). */
export const PIN_TDC = CRANK_Y + CRANK_R + ROD_L;
/** Y do pino do pistao no Ponto Morto Inferior (PMI / BDC). */
export const PIN_BDC = CRANK_Y - CRANK_R + ROD_L;
/** Y da coroa do pistao no PMS. */
export const CROWN_TDC = PIN_TDC + PISTON_HALF;
/** Y da face do cabecote (tampo do cilindro). */
export const DECK_Y = CROWN_TDC + DECK_CLEAR;
/** Curso total do pistao (PMS -> PMI). */
export const STROKE = 2 * CRANK_R;

export interface CrankState {
  /** Angulo do virabrequim neste giro (rad); 0 = PMS. */
  theta: number;
  /** Y do pino do pistao. */
  pinY: number;
  /** Y da coroa (topo) do pistao. */
  crownY: number;
  /** Angulo da biela em relacao a vertical (rad). */
  rodAngle: number;
  /** X do moente (crankpin). */
  pinX: number;
  /** Y do moente (crankpin). */
  pinCrankY: number;
}

/**
 * Mecanismo biela-manivela. Dado o angulo do virabrequim `theta` (0 = PMS),
 * devolve a posicao do pistao, do moente e o angulo da biela.
 */
export function crankSlider(theta: number): CrankState {
  const pinX = CRANK_R * Math.sin(theta);
  const pinCrankY = CRANK_Y + CRANK_R * Math.cos(theta);
  const rodAngle = Math.asin(pinX / ROD_L);
  const pinY = pinCrankY + Math.sqrt(ROD_L * ROD_L - pinX * pinX);
  return { theta, pinY, crownY: pinY + PISTON_HALF, rodAngle, pinX, pinCrankY };
}

export type StrokeId = 'admissao' | 'compressao' | 'combustao' | 'escape';

export interface StrokeInfo {
  id: StrokeId;
  index: number;
  namePt: string;
  descPt: string;
  color: string;
  /** Progresso 0..1 dentro do tempo atual. */
  phase: number;
}

const STROKES: { id: StrokeId; namePt: string; descPt: string; color: string }[] = [
  {
    id: 'admissao',
    namePt: 'Admissao',
    descPt:
      'Pistao DESCE (PMS->PMI). A valvula de admissao abre e o ar entra; o bico injeta combustivel formando a mistura.',
    color: '#38bdf8',
  },
  {
    id: 'compressao',
    namePt: 'Compressao',
    descPt: 'Pistao SOBE (PMI->PMS) com as duas valvulas fechadas, comprimindo a mistura.',
    color: '#22c55e',
  },
  {
    id: 'combustao',
    namePt: 'Combustao',
    descPt:
      'A vela inflama a mistura no PMS: a explosao empurra o pistao para BAIXO (PMS->PMI). E o tempo que gera forca.',
    color: '#f97316',
  },
  {
    id: 'escape',
    namePt: 'Escape',
    descPt: 'Pistao SOBE (PMI->PMS) com a valvula de escape aberta, expulsando os gases queimados.',
    color: '#8b93a1',
  },
];

/** Normaliza um angulo de ciclo para a faixa [0, 720). */
export function wrapCycle(cycleDeg: number): number {
  return ((cycleDeg % 720) + 720) % 720;
}

/** Qual dos 4 tempos esta acontecendo neste angulo de ciclo (0..720). */
export function strokeAt(cycleDeg: number): StrokeInfo {
  const c = wrapCycle(cycleDeg);
  const index = Math.min(3, Math.floor(c / 180));
  const s = STROKES[index];
  return { ...s, index, phase: (c - index * 180) / 180 };
}

/** Meia-duracao de contato do ressalto (rad de came). ~120° de duracao por
 * valvula deixa o CRUZAMENTO (admissao+escape abertas no PMS) bem visivel. */
export const CAM_HALF = (60 * Math.PI) / 180;

/**
 * Perfil do ressalto (came): elevacao 0..1 conforme a distancia angular `delta`
 * (rad) entre o bico do ressalto e o seguidor. O MESMO perfil desenha o came e
 * calcula a abertura — por isso o bico "empurra" a valvula de fato (geometria real).
 */
export function camBump(delta: number): number {
  const d = Math.atan2(Math.sin(delta), Math.cos(delta));
  if (Math.abs(d) >= CAM_HALF) return 0;
  return 0.5 * (1 + Math.cos((Math.PI * d) / CAM_HALF));
}

/** Fase (rad) do bico de cada ressalto: define em que giro do came a valvula abre. */
export const CAM_PHASE_INTAKE = (135 * Math.PI) / 180; // bico p/ baixo no meio da admissao
export const CAM_PHASE_EXHAUST = (225 * Math.PI) / 180; // bico p/ baixo no meio do escape

/** Elevacao (0..1) dada pelo ressalto no angulo `camAngleRad` do comando. */
export function camLift(camAngleRad: number, lobePhaseRad: number): number {
  return camBump(camAngleRad + lobePhaseRad - Math.PI);
}

/** Elevacao da valvula de admissao (0..1), vinda da geometria do came. */
export function intakeLift(cycleDeg: number): number {
  return camLift(((cycleDeg / 2) * Math.PI) / 180, CAM_PHASE_INTAKE);
}

/** Elevacao da valvula de escape (0..1), vinda da geometria do came. */
export function exhaustLift(cycleDeg: number): number {
  return camLift(((cycleDeg / 2) * Math.PI) / 180, CAM_PHASE_EXHAUST);
}

/** Intensidade da queima (0..1): estoura logo apos o PMS de combustao (~360°). */
export function combustionFlash(cycleDeg: number): number {
  const c = wrapCycle(cycleDeg);
  const t = (c - 360) / 60;
  if (t < 0 || t > 1) return 0;
  return Math.sin(Math.PI * t) ** 1.4;
}

/**
 * Quanto o cilindro esta "cheio" de carga (0..1), para a nuvem de particulas.
 * Enche na admissao, fica cheio na compressao/combustao e esvazia no escape.
 */
export function chargeFill(cycleDeg: number): number {
  const c = wrapCycle(cycleDeg);
  if (c < 180) return c / 180; // admissao: enche
  if (c < 540) return 1; // compressao + combustao: cheio
  return 1 - (c - 540) / 180; // escape: esvazia
}

/** Angulo do comando de valvulas (rad): gira na METADE da rotacao do virabrequim. */
export function camAngle(cycleRad: number): number {
  return cycleRad / 2;
}
