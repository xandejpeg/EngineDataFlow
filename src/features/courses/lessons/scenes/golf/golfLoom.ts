import type { Position } from './golfAssembly';

export type LoomPoint = Position;

// Convencao de cor DIN/VW por borne, usada nos diagramas da marca. Nao e a pinagem de fabrica.
export const WIRE_COLORS: Record<string, string> = {
  ro: '#c4382d', sw: '#20262a', br: '#6a4a32', ge: '#d7bd3c', ws: '#d5d8d3',
  gr: '#98a0a3', bl: '#3d6fb2', gn: '#3f9159', li: '#9a6fc0', or: '#d3822f', vi: '#7d5aa6',
};

export const WIRE_CODE_LABELS: Record<string, string> = {
  ro: 'vermelho', sw: 'preto', br: 'marrom', ge: 'amarelo', ws: 'branco',
  gr: 'cinza', bl: 'azul', gn: 'verde', li: 'lilas', or: 'laranja', vi: 'violeta',
};

export function wireColor(code: string): string {
  return WIRE_COLORS[code.split('/')[0]] ?? '#8d949a';
}

export function wireLabel(code: string): string {
  return code.split('/').map(part => WIRE_CODE_LABELS[part] ?? part).join(' / ');
}

export const reversed = (points: LoomPoint[]): LoomPoint[] => [...points].reverse();

// Borne de massa da carroceria na longarina esquerda do cofre, ao lado da bateria.
export const GROUND_STUD: LoomPoint = [-676, 748, 296];

// Corredores ortogonais: cada trecho anda num eixo so, como um chicote real preso a lataria.

/** Longarina interna do cofre, da caixa de fusiveis ate a travessa dianteira. */
export const engineBayRun = (side: number): LoomPoint[] =>
  [[side * 604, 740, 420], [side * 656, 740, 420], [side * 656, 740, -200], [side * 656, 740, -664]];

/** Travessa dianteira, atras do painel frontal: unica travessia do cofre. */
export const FRONT_CROSS: LoomPoint[] = [[-656, 740, -664], [-360, 740, -664], [360, 740, -664], [656, 740, -664]];

/** Desce do painel para a soleira por dentro do acabamento lateral do paineleiro. */
export const cabinDrop = (side: number): LoomPoint[] =>
  [[side * 700, 706, 748], [side * 722, 706, 748], [side * 722, 286, 748], [side * 722, 286, 800]];

/** Canal da soleira, abaixo do forro do assoalho (forro em y=317..333). */
export const sillRun = (side: number): LoomPoint[] =>
  [[side * 722, 286, 800], [side * 722, 286, 2200], [side * 640, 286, 2200]];

/** Travessia sob o assoalho, entre a linha de combustivel e o forro. */
export const FLOOR_CROSS: LoomPoint[] = [[-722, 286, 800], [-380, 286, 800], [380, 286, 800], [722, 286, 800]];

/** Sobe a travessa do assoalho traseiro e a lateral, atras do forro do porta-malas. */
export const rearQuarterRun = (side: number): LoomPoint[] =>
  [[side * 640, 286, 2200], [side * 640, 482, 2200], [side * 640, 482, 2880], [side * 640, 690, 2880]];

/** Passa-fio do paineleiro: unica travessia entre habitaculo e cofre. */
export const CABIN_GROMMET: LoomPoint[] = [
  [-640, 690, 690], [-668, 690, 690], [-668, 690, 375], [-668, 748, 375], [-676, 748, 375], [-676, 748, 296],
];

/** Travessa do painel de instrumentos, atras do revestimento. */
export const DASH_CROSS: LoomPoint[] = [[-690, 900, 726], [-300, 900, 726], [300, 900, 726], [690, 900, 726]];

/** Coluna A e forro do teto, atras dos acabamentos. */
export const A_PILLAR: LoomPoint[] = [[-690, 716, 748], [-706, 716, 748], [-706, 1400, 748], [-706, 1400, 950]];
export const HEADLINER: LoomPoint[] = [
  [-706, 1400, 950], [-706, 1428, 950], [-150, 1428, 950], [-150, 1428, 1180], [-150, 1428, 2800],
];

/** Ramal de porta ao longo da coluna, coberto pela porta fechada. */
export const doorDrop = (side: number, hingeDepth: number): LoomPoint[] => hingeDepth < 900
  ? [[side * 700, 726, 700], [side * 700, 726, 476], [side * 828, 726, 476], [side * 828, 794, 476]]
  : [[side * 700, 726, 790], [side * 700, 726, 1534], [side * 840, 726, 1534], [side * 840, 797, 1534]];

export interface LoomZone { label: string; points: LoomPoint[] }

/** Regioes usadas so para dar nome ao chicote que passa por ali. */
export const LOOM_ZONES: LoomZone[] = [
  { label: 'Cofre, longarina esquerda', points: engineBayRun(-1) },
  { label: 'Travessa dianteira', points: FRONT_CROSS },
  { label: 'Passa-fio do paineleiro', points: CABIN_GROMMET },
  { label: 'Descida do paineleiro', points: cabinDrop(-1) },
  { label: 'Soleira esquerda', points: sillRun(-1) },
  { label: 'Soleira direita', points: sillRun(1) },
  { label: 'Travessia sob o assoalho', points: FLOOR_CROSS },
  { label: 'Lateral traseira esquerda', points: rearQuarterRun(-1) },
  { label: 'Lateral traseira direita', points: rearQuarterRun(1) },
  { label: 'Travessa do painel', points: DASH_CROSS },
  { label: 'Coluna A', points: A_PILLAR },
  { label: 'Forro do teto', points: HEADLINER },
  { label: 'Ramal de porta', points: [-1, 1].flatMap(side => [...doorDrop(side, 450), ...doorDrop(side, 1560)]) },
];

export function zoneFinder(zones: LoomZone[], limit = 320): (point: LoomPoint) => string {
  return point => {
    let label = 'Ramal';
    let best = limit;
    for (const zone of zones) for (const candidate of zone.points) {
      const distance = Math.hypot(candidate[0] - point[0], candidate[1] - point[1], candidate[2] - point[2]);
      if (distance < best) { best = distance; label = zone.label; }
    }
    return label;
  };
}

export const loomZone = zoneFinder(LOOM_ZONES);

export const LOOM_SHEATH_COLOR = '#22282b';
