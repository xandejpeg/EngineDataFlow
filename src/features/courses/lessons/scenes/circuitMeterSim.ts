/**
 * Modelo eletrico do circuito da Aula 2 (bateria 12 V -> fusivel -> interruptor
 * -> farol H7). Valores FIXOS e realistas. Dado a funcao do multimetro, os dois
 * pontos onde estao as pontas e o estado do circuito, calcula a leitura do visor
 * e explica o que esta acontecendo (tensao em paralelo, corrente em serie,
 * resistencia com o circuito desenergizado).
 */
import { getFunctionById } from '@/data/multimeterHM2090.pt-BR';

export type MeterFn = 'off' | 'v' | 'a' | 'ohm';

export interface CircuitState {
  switchOn: boolean;
  fuseBlown: boolean;
  batteryConnected: boolean;
}

export interface CircuitReading {
  primary: string; // "12.48", "OL", "4.13", "0.35", "---"
  unit: string; // "V" | "A" | "Ω" | ""
  mode: string; // "DC" | ""
  notePt: string; // explicacao do que esta sendo medido
  tone: 'ok' | 'warn' | 'danger';
  lampOn: boolean; // se a lampada acende neste cenario
}

// ---- Valores fixos (farol H7 55 W tipico) ----
export const EMF = 12.6; // V — tensao da bateria em vazio
const R_INT = 0.03; // Ω — resistencia interna da bateria
const R_FUSE = 0.01; // Ω — fusivel bom
const R_SW = 0.01; // Ω — contatos do interruptor fechado
export const R_LAMP_HOT = 3.0; // Ω — filamento QUENTE (aceso)
export const R_LAMP_COLD = 0.35; // Ω — filamento FRIO (medido com ohmimetro)
export const I_LOOP = EMF / (R_INT + R_FUSE + R_SW + R_LAMP_HOT); // ~4.13 A

/** Ordem dos nos ao longo da malha serie (o segmento i fica entre CHAIN[i] e CHAIN[i+1]). */
const CHAIN = ['batPlus', 'fuseL', 'fuseR', 'swL', 'swR', 'lampIn', 'lampOut', 'batMinus'];

function segResistance(i: number, state: CircuitState, cold: boolean): number {
  if (i === 1) return state.fuseBlown ? Infinity : R_FUSE; // fusivel
  if (i === 3) return state.switchOn ? R_SW : Infinity; // interruptor
  if (i === 5) return cold ? R_LAMP_COLD : R_LAMP_HOT; // lampada
  return 0; // fios
}

/** Componentes conectados (uniao dos nos por segmentos fechados; a bateria NAO liga). */
function roots(state: CircuitState): Record<string, string> {
  const parent: Record<string, string> = {};
  const find = (x: string): string => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a: string, b: string) => {
    parent[find(a)] = find(b);
  };
  for (const n of CHAIN) parent[n] = n;
  const closed = [true, !state.fuseBlown, true, state.switchOn, true, true, true];
  for (let i = 0; i < closed.length; i++) if (closed[i]) union(CHAIN[i], CHAIN[i + 1]);
  const out: Record<string, string> = {};
  for (const n of CHAIN) out[n] = find(n);
  return out;
}

/** Potencial de cada no (V). null = trecho isolado/flutuante. */
function potentials(state: CircuitState): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  if (!state.batteryConnected) {
    for (const n of CHAIN) out[n] = 0; // sem fonte: sem diferenca de potencial
    return out;
  }
  const full = state.switchOn && !state.fuseBlown;
  if (full) {
    const I = I_LOOP;
    out.batMinus = 0;
    out.lampOut = 0;
    out.lampIn = I * R_LAMP_HOT;
    out.swR = out.lampIn;
    out.swL = out.swR + I * R_SW;
    out.fuseR = out.swL;
    out.fuseL = out.fuseR + I * R_FUSE;
    out.batPlus = out.fuseL;
    return out;
  }
  const r = roots(state);
  const rPlus = r.batPlus;
  const rMinus = r.batMinus;
  for (const n of CHAIN) {
    if (r[n] === rPlus) out[n] = EMF;
    else if (r[n] === rMinus) out[n] = 0;
    else out[n] = null;
  }
  return out;
}

/** Resistencia da cadeia linear entre dois nos (bateria fora do circuito). */
function chainResistance(a: string, b: string, state: CircuitState): number {
  const ia = CHAIN.indexOf(a);
  const ib = CHAIN.indexOf(b);
  if (ia < 0 || ib < 0) return Infinity;
  const lo = Math.min(ia, ib);
  const hi = Math.max(ia, ib);
  let sum = 0;
  for (let i = lo; i < hi; i++) sum += segResistance(i, state, true);
  return sum;
}

/** Qual componente esta entre os dois nos (ou null se atravessa fios/varios). */
function pairElement(a: string, b: string): 'battery' | 'fuse' | 'switch' | 'lamp' | null {
  const s = new Set([a, b]);
  if (s.has('batPlus') && s.has('batMinus')) return 'battery';
  if (s.has('fuseL') && s.has('fuseR')) return 'fuse';
  if (s.has('swL') && s.has('swR')) return 'switch';
  if (s.has('lampIn') && s.has('lampOut')) return 'lamp';
  return null;
}

const fmt2 = (v: number) => v.toFixed(2);
function fmtOhm(r: number): string {
  if (r < 10) return r.toFixed(2);
  if (r < 1000) return r.toFixed(1);
  return (r / 1000).toFixed(2);
}
const unitOf = (fn: MeterFn) => (fn === 'v' ? 'V' : fn === 'a' ? 'A' : fn === 'ohm' ? 'Ω' : '');

function voltageNote(a: string, b: string, v: number, state: CircuitState): string {
  const el = pairElement(a, b);
  const big = Math.abs(v) > 1;
  if (el === 'battery')
    return state.switchOn && !state.fuseBlown && state.batteryConnected
      ? 'Tensao nos polos da bateria SOB CARGA (cai um pouco abaixo dos 12,6 V de vazio).'
      : 'Tensao nos polos da bateria em vazio (~12,6 V).';
  if (el === 'lamp')
    return big
      ? 'Tensao sobre a lampada: quase toda a tensao da bateria cai aqui (e a maior resistencia).'
      : 'Lampada com ~0 V: nao ha corrente (circuito aberto).';
  if (el === 'fuse')
    return big
      ? 'Fusivel ABERTO: aparece TODA a tensao da bateria. E assim que se acha o ponto interrompido!'
      : 'Queda no fusivel ~0 V: fusivel bom.';
  if (el === 'switch')
    return big
      ? 'Interruptor ABERTO: aparece TODA a tensao da bateria (ponto interrompido).'
      : 'Interruptor fechado: queda ~0 V.';
  return 'Tensao (diferenca de potencial) entre os dois pontos.';
}

/**
 * Calcula a leitura do multimetro.
 * @param fn funcao (off / tensao / corrente / resistencia)
 * @param red no onde esta a ponta vermelha
 * @param black no onde esta a ponta preta
 */
export function measure(
  fn: MeterFn,
  red: string | null,
  black: string | null,
  state: CircuitState,
): CircuitReading {
  const normalLamp = state.switchOn && !state.fuseBlown && state.batteryConnected;

  if (fn === 'off')
    return { primary: '', unit: '', mode: '', notePt: 'Multimetro desligado (OFF).', tone: 'ok', lampOn: normalLamp };

  if (!red || !black || red === black)
    return {
      primary: '---',
      unit: unitOf(fn),
      mode: fn === 'v' || fn === 'a' ? 'DC' : '',
      notePt: 'Encoste as DUAS pontas em pontos DIFERENTES do circuito.',
      tone: 'warn',
      lampOn: normalLamp,
    };

  // ---- TENSAO (paralelo, circuito energizado) ----
  if (fn === 'v') {
    const pot = potentials(state);
    const a = pot[red];
    const b = pot[black];
    if (a == null || b == null)
      return { primary: '---', unit: 'V', mode: 'DC', notePt: 'Trecho isolado (sem referencia) — ponto entre duas aberturas.', tone: 'warn', lampOn: normalLamp };
    const v = a - b;
    return { primary: fmt2(v), unit: 'V', mode: 'DC', notePt: voltageNote(red, black, v, state), tone: 'ok', lampOn: normalLamp };
  }

  // ---- RESISTENCIA (circuito DESENERGIZADO) ----
  if (fn === 'ohm') {
    if (state.batteryConnected)
      return { primary: '---', unit: 'Ω', mode: '', notePt: 'Circuito ENERGIZADO! Desconecte a bateria antes de medir resistencia.', tone: 'warn', lampOn: normalLamp };
    const r = chainResistance(red, black, state);
    const el = pairElement(red, black);
    if (!isFinite(r)) {
      const why =
        el === 'switch' ? 'Interruptor ABERTO: resistencia infinita (OL).' : el === 'fuse' ? 'Fusivel QUEIMADO: OL (aberto).' : 'Caminho aberto (interruptor desligado ou fusivel queimado): OL.';
      return { primary: 'OL', unit: 'Ω', mode: '', notePt: why, tone: 'warn', lampOn: false };
    }
    let note = 'Resistencia entre os dois pontos (circuito desligado).';
    if (el === 'lamp') note = 'Resistencia da lampada A FRIO (~0,35 Ω). Acesa (quente) sobe para ~3 Ω — por isso "puxa" mais corrente no primeiro instante.';
    else if (el === 'fuse') note = 'Fusivel bom: ~0 Ω (tem continuidade).';
    else if (el === 'switch') note = 'Interruptor fechado: ~0 Ω (tem continuidade).';
    return { primary: fmtOhm(r), unit: 'Ω', mode: '', notePt: note, tone: 'ok', lampOn: false };
  }

  // ---- CORRENTE (serie, terminal 10A) ----
  const el = pairElement(red, black);
  const powered = state.batteryConnected;

  if (el === 'battery')
    return powered
      ? { primary: 'OL', unit: 'A', mode: 'DC', notePt: '⛔ CURTO! Amperimetro direto nos polos da bateria = curto-circuito. Corrente enorme e o fusivel do multimetro queima.', tone: 'danger', lampOn: false }
      : { primary: '0.00', unit: 'A', mode: 'DC', notePt: 'Bateria desconectada — nao ha corrente.', tone: 'warn', lampOn: false };

  if (el === 'switch') {
    if (powered && !state.switchOn && !state.fuseBlown)
      return { primary: fmt2(I_LOOP), unit: 'A', mode: 'DC', notePt: '✓ Corrente em SERIE: com o interruptor ABERTO, o amperimetro fecha o circuito no lugar dele. A lampada acende e o visor le a corrente do circuito.', tone: 'ok', lampOn: true };
    if (powered && state.switchOn)
      return { primary: '0.00', unit: 'A', mode: 'DC', notePt: 'Interruptor fechado: o amperimetro ficou em PARALELO. Abra o interruptor para inserir o meter em serie.', tone: 'warn', lampOn: normalLamp };
  }

  if (el === 'fuse') {
    if (powered && state.fuseBlown && state.switchOn)
      return { primary: fmt2(I_LOOP), unit: 'A', mode: 'DC', notePt: '✓ Corrente em SERIE pelo porta-fusivel: com o fusivel fora, o amperimetro fecha o circuito. A lampada acende.', tone: 'ok', lampOn: true };
    if (powered && !state.fuseBlown)
      return { primary: '0.00', unit: 'A', mode: 'DC', notePt: 'Fusivel bom no lugar: amperimetro em PARALELO. Para medir aqui, remova o fusivel e ligue o meter em serie.', tone: 'warn', lampOn: normalLamp };
  }

  if (el === 'lamp') {
    if (powered && state.switchOn && !state.fuseBlown)
      return { primary: 'OL', unit: 'A', mode: 'DC', notePt: '⛔ CURTO na carga! O amperimetro (~0 Ω) curto-circuita a lampada. Corrente altissima, a lampada apaga e o fusivel queima.', tone: 'danger', lampOn: false };
    return { primary: '0.00', unit: 'A', mode: 'DC', notePt: 'Sem energia aqui. Para medir corrente o circuito precisa estar alimentado e o meter em SERIE.', tone: 'warn', lampOn: false };
  }

  return {
    primary: '0.00',
    unit: 'A',
    mode: 'DC',
    notePt: 'Para medir CORRENTE, abra o circuito num ponto e ligue o amperimetro em SERIE (um lado em cada ponta). Aqui ele esta em paralelo.',
    tone: 'warn',
    lampOn: normalLamp,
  };
}

function decimalsFor(rangeMax: number): number {
  if (rangeMax <= 6) return 3;
  if (rangeMax <= 60) return 2;
  if (rangeMax <= 600) return 1;
  return 0;
}

function modeOf(q: string): string {
  if (q === 'voltage-ac') return 'AC';
  if (q.startsWith('voltage') || q === 'millivolt-dc' || q.startsWith('current')) return 'DC';
  return '';
}

function fmtRanged(value: number, ranges: number[] | undefined, unit: string, mode: string, note: string, lampOn: boolean): CircuitReading {
  const abs = Math.abs(value);
  const rs = ranges ?? [Math.max(abs, 1)];
  const range = rs.find((r) => abs <= r * 1.0000001);
  if (range == null)
    return { primary: 'OL', unit, mode, notePt: 'Acima da escala (OL) para esta faixa/funcao. Selecione a funcao ou faixa certa.', tone: 'warn', lampOn };
  return { primary: value.toFixed(decimalsFor(range)), unit, mode, notePt: note, tone: 'ok', lampOn };
}

function currentReading(red: string, black: string, state: CircuitState, unit: string, ranges: number[] | undefined): CircuitReading {
  const el = pairElement(red, black);
  const powered = state.batteryConnected;
  const normalLamp = state.switchOn && !state.fuseBlown && powered;
  const conv = unit === 'mA' ? I_LOOP * 1e3 : unit === 'µA' ? I_LOOP * 1e6 : I_LOOP;
  if (el === 'battery')
    return powered
      ? { primary: 'OL', unit, mode: 'DC', notePt: '⛔ CURTO! Amperimetro direto nos polos da bateria = curto-circuito. Corrente enorme, queima o fusivel do multimetro.', tone: 'danger', lampOn: false }
      : { primary: '0.00', unit, mode: 'DC', notePt: 'Bateria desconectada — sem corrente.', tone: 'warn', lampOn: false };
  if (el === 'switch') {
    if (powered && !state.switchOn && !state.fuseBlown)
      return fmtRanged(conv, ranges, unit, 'DC', '✓ Corrente em SERIE (ponte no interruptor aberto): a lampada acende. E a MESMA corrente de TODO o circuito — a lampada (maior resistencia) e quem define quanto passa.', true);
    if (powered && state.switchOn)
      return { primary: '---', unit, mode: 'DC', notePt: 'Amperimetro em PARALELO no interruptor fechado — assim NAO mede. Clique em "Interruptor: ABERTO" e encoste nos 2 lados (em serie).', tone: 'warn', lampOn: normalLamp };
  }
  if (el === 'fuse') {
    if (powered && state.fuseBlown && state.switchOn)
      return fmtRanged(conv, ranges, unit, 'DC', '✓ Corrente em SERIE pelo porta-fusivel: a lampada acende. E a MESMA corrente que passa pela lampada — ela e quem decide quanto passa no circuito todo.', true);
    if (powered && !state.fuseBlown)
      return { primary: '---', unit, mode: 'DC', notePt: 'Amperimetro em PARALELO no fusivel bom — assim NAO mede (por isso nao aparece corrente). Clique em "Fusivel: REMOVIDO" e encoste nos 2 lados do porta-fusivel (em serie). E assim que se mede corrente no carro.', tone: 'warn', lampOn: normalLamp };
  }
  if (el === 'lamp') {
    if (powered && state.switchOn && !state.fuseBlown)
      return { primary: 'OL', unit, mode: 'DC', notePt: '⛔ CURTO na carga! O amperimetro curto-circuita a lampada. Corrente altissima, o fusivel queima.', tone: 'danger', lampOn: false };
    return { primary: '0.00', unit, mode: 'DC', notePt: 'Sem energia aqui. O amperimetro mede em SERIE, com o circuito alimentado.', tone: 'warn', lampOn: false };
  }
  return powered
    ? { primary: '---', unit, mode: 'DC', notePt: 'Para medir CORRENTE, ABRA o circuito num ponto (tire o fusivel ou abra o interruptor) e ligue o amperimetro em SERIE nos 2 lados. Encostado em paralelo ele NAO mede.', tone: 'warn', lampOn: normalLamp }
    : { primary: '0.00', unit, mode: 'DC', notePt: 'Sem corrente (bateria desconectada).', tone: 'warn', lampOn: false };
}

/**
 * Leitura completa usando a chave de 13 posicoes do HM-2090 (Aula 2).
 * Honra a funcao (fnId), o terminal da ponta vermelha (redJack) e os dois nos.
 */
export function measureCircuitFull(fnId: string, redJack: string, red: string | null, black: string | null, state: CircuitState): CircuitReading {
  const fn = getFunctionById(fnId);
  const normalLamp = state.switchOn && !state.fuseBlown && state.batteryConnected;
  if (!fn || fn.quantity === 'off')
    return { primary: '', unit: '', mode: '', notePt: 'Chave em OFF. Gire para V=, A ou Ω para medir.', tone: 'ok', lampOn: normalLamp };

  const q = fn.quantity;
  const isCurrent = q === 'current-A' || q === 'current-mA' || q === 'current-uA';

  if (isCurrent && redJack === 'VΩHz')
    return { primary: 'ERR', unit: '', mode: '', notePt: '⛔ PERIGO: funcao de corrente com a ponta no terminal VΩHz. Vira um curto pelas pontas — pode queimar o multimetro.', tone: 'danger', lampOn: normalLamp };
  if (!isCurrent && redJack !== 'VΩHz')
    return { primary: '---', unit: fn.unit, mode: '', notePt: `Ponta vermelha no terminal ${redJack}. Para ${fn.namePt}, use o terminal VΩHz.`, tone: 'warn', lampOn: normalLamp };
  if (isCurrent && redJack !== fn.redJack)
    return { primary: '---', unit: fn.unit, mode: '', notePt: `Terminal de corrente errado. Use ${fn.redJack} para ${fn.namePt}.`, tone: 'warn', lampOn: normalLamp };

  if (!red || !black || red === black)
    return { primary: '----', unit: fn.unit, mode: modeOf(q), notePt: 'Encoste as DUAS pontas em pontos DIFERENTES do circuito.', tone: 'warn', lampOn: normalLamp };

  switch (q) {
    case 'voltage-dc': {
      const pot = potentials(state);
      const a = pot[red];
      const b = pot[black];
      if (a == null || b == null) return { primary: '---', unit: 'V', mode: 'DC', notePt: 'Trecho isolado (sem referencia).', tone: 'warn', lampOn: normalLamp };
      return fmtRanged(a - b, fn.ranges, 'V', 'DC', voltageNote(red, black, a - b, state), normalLamp);
    }
    case 'voltage-ac':
      return { primary: '0.00', unit: 'V', mode: 'AC', notePt: 'Este circuito e de corrente CONTINUA. Em V~ (AC) o visor le ~0 — use V= (DC).', tone: 'warn', lampOn: normalLamp };
    case 'millivolt-dc': {
      const pot = potentials(state);
      const a = pot[red];
      const b = pot[black];
      if (a == null || b == null) return { primary: '---', unit: 'mV', mode: 'DC', notePt: 'Trecho isolado (sem referencia).', tone: 'warn', lampOn: normalLamp };
      return fmtRanged((a - b) * 1000, fn.ranges, 'mV', 'DC', 'mV= so serve para tensoes pequenas (ate 600 mV) — bom para a queda no fusivel/interruptor.', normalLamp);
    }
    case 'resistance': {
      if (state.batteryConnected) return { primary: '---', unit: 'Ω', mode: '', notePt: 'Circuito ENERGIZADO! Desconecte a bateria antes de medir resistencia.', tone: 'warn', lampOn: normalLamp };
      const r = chainResistance(red, black, state);
      const el = pairElement(red, black);
      if (!isFinite(r)) return { primary: 'OL', unit: 'Ω', mode: '', notePt: el === 'switch' ? 'Interruptor ABERTO: OL (infinito).' : el === 'fuse' ? 'Fusivel QUEIMADO: OL.' : 'Caminho aberto: OL.', tone: 'warn', lampOn: false };
      let note = 'Resistencia entre os dois pontos (circuito desligado).';
      if (el === 'lamp') note = 'Resistencia da lampada A FRIO (~0,35 Ω). Acesa (quente) sobe para ~3 Ω.';
      else if (el === 'fuse') note = 'Fusivel bom: ~0 Ω.';
      else if (el === 'switch') note = 'Interruptor fechado: ~0 Ω.';
      return { primary: r < 10 ? r.toFixed(2) : r.toFixed(1), unit: 'Ω', mode: '', notePt: note, tone: 'ok', lampOn: false };
    }
    case 'continuity': {
      if (state.batteryConnected) return { primary: '---', unit: 'Ω', mode: '', notePt: 'Circuito ENERGIZADO! Nao teste continuidade com tensao presente.', tone: 'warn', lampOn: normalLamp };
      const r = chainResistance(red, black, state);
      const beep = isFinite(r) && r < 50;
      return beep
        ? { primary: r.toFixed(2), unit: 'Ω', mode: 'BIP )))', notePt: 'Tem continuidade (apita): resistencia quase zero.', tone: 'ok', lampOn: false }
        : { primary: 'OL', unit: 'Ω', mode: '', notePt: 'Sem continuidade (aberto): interruptor desligado ou fusivel queimado no caminho.', tone: 'warn', lampOn: false };
    }
    case 'diode':
      return { primary: 'OL', unit: 'V', mode: 'diode', notePt: 'Sem diodo neste circuito (a lampada nao tem juncao). A funcao >| e para testar diodos.', tone: 'warn', lampOn: normalLamp };
    case 'frequency':
      return { primary: '0.0', unit: 'Hz', mode: 'AUTO', notePt: 'Circuito DC: frequencia 0 Hz (nao ha sinal alternado).', tone: 'ok', lampOn: normalLamp };
    case 'hfe':
      return { primary: '---', unit: '', mode: 'hFE', notePt: 'Sem transistor neste circuito.', tone: 'warn', lampOn: normalLamp };
    case 'temperature':
      return { primary: '25', unit: '°C', mode: '', notePt: 'Sem termopar na medicao — mostra a temperatura ambiente.', tone: 'ok', lampOn: normalLamp };
    case 'current-A':
      return currentReading(red, black, state, 'A', fn.ranges);
    case 'current-mA':
      return currentReading(red, black, state, 'mA', fn.ranges);
    case 'current-uA':
      return currentReading(red, black, state, 'µA', fn.ranges);
    default:
      return { primary: '---', unit: '', mode: '', notePt: '', tone: 'warn', lampOn: normalLamp };
  }
}

/** Ajuste correto para cada tipo de medida (para as dicas/checklist da Aula 2). */
export const MEASURE_GOALS: { id: string; fnId: string; redJack: string; red: string; black: string; needs: Partial<CircuitState>; titlePt: string }[] = [
  { id: 'v-bateria', fnId: 'dcv', redJack: 'VΩHz', red: 'batPlus', black: 'batMinus', needs: {}, titlePt: 'Tensao da bateria' },
  { id: 'v-lampada', fnId: 'dcv', redJack: 'VΩHz', red: 'lampIn', black: 'lampOut', needs: { switchOn: true, fuseBlown: false, batteryConnected: true }, titlePt: 'Tensao na lampada' },
  { id: 'v-interruptor', fnId: 'dcv', redJack: 'VΩHz', red: 'swL', black: 'swR', needs: { switchOn: false, batteryConnected: true }, titlePt: 'Tensao no interruptor aberto' },
  { id: 'a-serie', fnId: 'A', redJack: '10A', red: 'swL', black: 'swR', needs: { switchOn: false, fuseBlown: false, batteryConnected: true }, titlePt: 'Corrente em serie' },
  { id: 'ohm-lampada', fnId: 'ohm', redJack: 'VΩHz', red: 'lampIn', black: 'lampOut', needs: { batteryConnected: false }, titlePt: 'Resistencia da lampada (fria)' },
];
