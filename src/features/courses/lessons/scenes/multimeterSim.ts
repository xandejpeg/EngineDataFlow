/**
 * Logica do simulador do HM-2090: dado a funcao da chave, o terminal da ponta
 * vermelha e o item da bancada sob as pontas, calcula o que aparece no visor.
 * Cobre TODAS as posicoes da chave e os erros de terminal/escala do infografico.
 */
import { getFunctionById, type MeterQuantity } from '@/data/multimeterHM2090.pt-BR';

/** Item mensuravel da bancada (fonte/componente automotivo). */
export interface TestItem {
  id: string;
  namePt: string;
  descPt: string;
  color: string;
  dcV?: number; // tensao continua entre os dois pontos (V)
  acV?: number; // tensao alternada RMS (V)
  ohms?: number; // resistencia (Ω); Infinity = aberto
  diodeDrop?: number; // queda direta do diodo (V)
  freqHz?: number; // frequencia do sinal (Hz)
  dutyPct?: number; // ciclo de trabalho (%)
  tempC?: number; // temperatura (para termopar)
  hfe?: number; // ganho de transistor
  currentA?: number; // corrente que passa se o meter entrar em serie (A)
  energized?: boolean; // se true, medir Ω/diodo/continuidade da erro
}

export interface Reading {
  primary: string; // texto principal do visor (ex.: "12.60", "OL", "----")
  unit: string;
  mode: string; // indicador pequeno (DC, AC, BIP, diode, hFE, AUTO)
  beep: boolean;
  danger: boolean; // alerta vermelho (poderia danificar o instrumento)
  ok: boolean; // medicao valida
  warnPt?: string;
}

/** Bancada de teste: cobre todas as funcoes da chave, com contexto automotivo. */
export const TEST_ITEMS: TestItem[] = [
  {
    id: 'bateria',
    namePt: 'Bateria 12 V',
    descPt: 'Bateria automotiva carregada. Meça em V= (DC).',
    color: '#e2564a',
    dcV: 12.6,
    energized: true,
  },
  {
    id: 'sensor5v',
    namePt: 'Sensor 5 V',
    descPt: 'Alimentação de sensor da ECU. Meça em V=.',
    color: '#4a90e2',
    dcV: 5.0,
    energized: true,
  },
  {
    id: 'tps',
    namePt: 'Sinal TPS 0,85 V',
    descPt: 'Sinal de sensor de baixa tensão (0,85 V). Meça em V= — em mV= estoura (OL).',
    color: '#7ed37e',
    dcV: 0.85,
    energized: true,
  },
  {
    id: 'tomada',
    namePt: 'Rede AC 127 V',
    descPt: 'Tensão alternada. Meça em V~ (AC). Também tem 60 Hz.',
    color: '#d39b4a',
    acV: 127,
    freqHz: 60,
    energized: true,
  },
  {
    id: 'resistor',
    namePt: 'Resistor 220 Ω',
    descPt: 'Componente passivo. Meça em Ω com o circuito desligado.',
    color: '#b07a3a',
    ohms: 220,
  },
  {
    id: 'fio-ok',
    namePt: 'Fio bom',
    descPt: 'Condutor íntegro. Teste em continuidade ))) — deve bipar.',
    color: '#8ea0b8',
    ohms: 0.4,
  },
  {
    id: 'fio-rompido',
    namePt: 'Fio rompido',
    descPt: 'Condutor aberto. Em continuidade NÃO bipa (OL).',
    color: '#5a6678',
    ohms: Infinity,
  },
  {
    id: 'diodo',
    namePt: 'Diodo retificador',
    descPt: 'Queda direta ~0,55 V. Use a função de diodo >|.',
    color: '#9b6bd3',
    diodeDrop: 0.55,
    ohms: Infinity,
  },
  {
    id: 'termopar',
    namePt: 'Termopar 90 °C',
    descPt: 'Ponto quente do motor. Use a função °C (temperatura).',
    color: '#e07a4a',
    tempC: 90,
  },
  {
    id: 'transistor',
    namePt: 'Transistor NPN',
    descPt: 'Ganho hFE ~180. Use a função hFE.',
    color: '#6bd3c4',
    hfe: 180,
  },
  {
    id: 'injetor',
    namePt: 'Bico injetor (PWM)',
    descPt: 'Pulsa a 50 Hz. Corrente ~420 mA (mA) ou frequência (Hz).',
    color: '#d34a90',
    currentA: 0.42,
    freqHz: 50,
    dutyPct: 35,
    energized: true,
  },
  {
    id: 'bomba',
    namePt: 'Bomba de combustível',
    descPt: 'Corrente alta ~6,5 A. Use A no terminal 10A.',
    color: '#4ad3a0',
    currentA: 6.5,
    energized: true,
  },
  {
    id: 'sensor-ua',
    namePt: 'Sensor de baixa corrente',
    descPt: 'Corrente ~120 µA. Use µA no terminal mA/µA.',
    color: '#b8b84a',
    currentA: 0.00012,
    energized: true,
  },
];

export const TEST_ITEMS_BY_ID: Record<string, TestItem> = Object.fromEntries(
  TEST_ITEMS.map((it) => [it.id, it]),
);

/** Ajuste correto (chave + terminal da ponta vermelha) para medir cada item. */
export const IDEAL_SETUP: Record<string, { fnId: string; redJack: 'VΩHz' | 'mAμA' | '10A' }> = {
  bateria: { fnId: 'dcv', redJack: 'VΩHz' },
  sensor5v: { fnId: 'dcv', redJack: 'VΩHz' },
  tps: { fnId: 'dcv', redJack: 'VΩHz' },
  tomada: { fnId: 'acv', redJack: 'VΩHz' },
  resistor: { fnId: 'ohm', redJack: 'VΩHz' },
  'fio-ok': { fnId: 'cont', redJack: 'VΩHz' },
  'fio-rompido': { fnId: 'cont', redJack: 'VΩHz' },
  diodo: { fnId: 'diode', redJack: 'VΩHz' },
  termopar: { fnId: 'temp', redJack: 'VΩHz' },
  transistor: { fnId: 'hfe', redJack: 'VΩHz' },
  injetor: { fnId: 'mA', redJack: 'mAμA' },
  bomba: { fnId: 'A', redJack: '10A' },
  'sensor-ua': { fnId: 'uA', redJack: 'mAμA' },
};

function decimalsFor(rangeMax: number): number {
  if (rangeMax <= 6) return 3;
  if (rangeMax <= 60) return 2;
  if (rangeMax <= 600) return 1;
  return 0;
}

/** Formata um valor dentro das faixas de auto-range; "OL" se estourar. */
function fmtRanged(
  value: number,
  ranges: number[] | undefined,
  unit: string,
  mode: string,
  manualRangeMax?: number,
): Reading {
  const abs = Math.abs(value);
  const rs = manualRangeMax != null ? [manualRangeMax] : (ranges ?? [Math.max(abs, 1)]);
  const range = rs.find((r) => abs <= r * 1.0000001);
  if (range == null) {
    return { primary: 'OL', unit, mode: manualRangeMax != null ? mode : mode, beep: false, danger: false, ok: true, warnPt: 'Valor acima da escala (OL). Aumente a faixa.' };
  }
  const dec = decimalsFor(range);
  return { primary: value.toFixed(dec), unit, mode: manualRangeMax != null ? `${mode} man` : mode, beep: false, danger: false, ok: true };
}

function fmtResistance(r: number): Reading {
  if (!isFinite(r)) return { primary: 'OL', unit: 'Ω', mode: 'AUTO', beep: false, danger: false, ok: true, warnPt: 'Aberto (resistencia infinita).' };
  if (r < 1000) return { primary: r.toFixed(1), unit: 'Ω', mode: 'AUTO', beep: false, danger: false, ok: true };
  if (r < 1e6) return { primary: (r / 1e3).toFixed(3), unit: 'kΩ', mode: 'AUTO', beep: false, danger: false, ok: true };
  return { primary: (r / 1e6).toFixed(3), unit: 'MΩ', mode: 'AUTO', beep: false, danger: false, ok: true };
}

function fmtFrequency(f: number): Reading {
  if (f < 1000) return { primary: f.toFixed(1), unit: 'Hz', mode: 'AUTO', beep: false, danger: false, ok: true };
  if (f < 1e6) return { primary: (f / 1e3).toFixed(3), unit: 'kHz', mode: 'AUTO', beep: false, danger: false, ok: true };
  return { primary: (f / 1e6).toFixed(3), unit: 'MHz', mode: 'AUTO', beep: false, danger: false, ok: true };
}

const OFF_READING: Reading = { primary: '', unit: '', mode: '', beep: false, danger: false, ok: false };

function danger(warnPt: string): Reading {
  return { primary: 'ERR', unit: '', mode: '', beep: false, danger: true, ok: false, warnPt };
}
function warn(primary: string, unit: string, warnPt: string): Reading {
  return { primary, unit, mode: '', beep: false, danger: false, ok: false, warnPt };
}

export interface ReadOptions {
  secondary?: boolean; // botao SELECT ativo (funcao laranja)
  manualRangeMax?: number; // faixa manual escolhida pelo botao RANGE
}

/**
 * Calcula a leitura do visor.
 * @param fnId funcao selecionada na chave (id).
 * @param redJack terminal onde esta a ponta vermelha.
 * @param item item da bancada sob as duas pontas (ou null).
 */
export function computeReading(
  fnId: string,
  redJack: 'VΩHz' | 'mAμA' | '10A',
  item: TestItem | null,
  opts: ReadOptions = {},
): Reading {
  const fn = getFunctionById(fnId);
  if (!fn || fn.quantity === 'off') return OFF_READING;

  const q: MeterQuantity = fn.quantity;
  const isCurrent = q === 'current-A' || q === 'current-mA' || q === 'current-uA';

  // Erros de terminal (infografico "ERROS COMUNS E RISCOS").
  if (isCurrent && redJack === 'VΩHz') {
    return danger(
      'PERIGO: funcao de corrente com a ponta no terminal VΩHz. Cria um curto pelas pontas e pode queimar o multimetro e o circuito!',
    );
  }
  if (!isCurrent && redJack !== 'VΩHz') {
    return warn('---', fn.unit, `Ponta vermelha no terminal ${redJack}. Para ${fn.namePt}, use o terminal VΩHz.`);
  }
  if (isCurrent && redJack !== fn.redJack) {
    return warn('---', fn.unit, `Terminal de corrente errado. Use ${fn.redJack} para ${fn.namePt}.`);
  }

  if (!item) {
    return { primary: '----', unit: fn.unit, mode: modeOf(q), beep: false, danger: false, ok: false, warnPt: 'Encoste as DUAS pontas nos pontos de medicao.' };
  }

  switch (q) {
    case 'voltage-dc':
      return fmtRanged(item.dcV ?? 0, fn.ranges, 'V', 'DC', opts.manualRangeMax);
    case 'voltage-ac':
      return fmtRanged(item.acV ?? 0, fn.ranges, 'V', 'AC', opts.manualRangeMax);
    case 'millivolt-dc':
      return fmtRanged((item.dcV ?? 0) * 1000, fn.ranges, 'mV', 'DC', opts.manualRangeMax);
    case 'resistance':
      if (item.energized) return warn('OL', 'Ω', 'Circuito ENERGIZADO! Meça resistencia sempre com o circuito desligado.');
      return fmtResistance(item.ohms ?? Infinity);
    case 'continuity': {
      if (item.energized) return warn('---', 'Ω', 'Circuito ENERGIZADO! Nao teste continuidade com tensao presente.');
      const r = item.ohms ?? Infinity;
      const beep = r < 50;
      return {
        primary: beep ? r.toFixed(1) : 'OL',
        unit: 'Ω',
        mode: beep ? 'BIP )))' : '',
        beep,
        danger: false,
        ok: true,
        warnPt: beep ? undefined : 'Sem continuidade — condutor aberto.',
      };
    }
    case 'diode': {
      if (item.energized) return warn('---', 'V', 'Circuito energizado! Teste o diodo com o circuito desligado.');
      if (item.diodeDrop != null) return { primary: item.diodeDrop.toFixed(3), unit: 'V', mode: 'diode >|', beep: false, danger: false, ok: true };
      const r = item.ohms ?? Infinity;
      if (isFinite(r) && r < 2000) return { primary: (r * 0.001).toFixed(3), unit: 'V', mode: 'diode >|', beep: false, danger: false, ok: true };
      return { primary: 'OL', unit: 'V', mode: 'diode >|', beep: false, danger: false, ok: true, warnPt: 'Sem juncao (aberto) — provavel diodo invertido/queimado.' };
    }
    case 'frequency':
      if (opts.secondary && item.dutyPct != null) return { primary: item.dutyPct.toFixed(1), unit: '%', mode: 'DUTY', beep: false, danger: false, ok: true };
      return fmtFrequency(item.freqHz ?? 0);
    case 'hfe':
      return item.hfe != null
        ? { primary: String(item.hfe), unit: '', mode: 'hFE', beep: false, danger: false, ok: true }
        : { primary: '---', unit: '', mode: 'hFE', beep: false, danger: false, ok: false, warnPt: 'Encaixe um transistor no soquete hFE.' };
    case 'temperature': {
      const c = item.tempC ?? 25; // ambiente se nao for fonte de calor
      if (opts.secondary) return { primary: (c * 1.8 + 32).toFixed(0), unit: '°F', beep: false, danger: false, ok: true, mode: '' };
      return { primary: c.toFixed(0), unit: '°C', mode: '', beep: false, danger: false, ok: true };
    }
    case 'current-A':
      return item.currentA != null ? fmtRanged(item.currentA, fn.ranges, 'A', 'DC', opts.manualRangeMax) : zeroCurrent('A');
    case 'current-mA':
      return item.currentA != null ? fmtRanged(item.currentA * 1e3, fn.ranges, 'mA', 'DC', opts.manualRangeMax) : zeroCurrent('mA');
    case 'current-uA':
      return item.currentA != null ? fmtRanged(item.currentA * 1e6, fn.ranges, 'µA', 'DC', opts.manualRangeMax) : zeroCurrent('µA');
    default:
      return OFF_READING;
  }
}

function zeroCurrent(unit: string): Reading {
  return { primary: '0', unit, mode: 'DC', beep: false, danger: false, ok: true, warnPt: 'Sem corrente aqui — a medicao de corrente e feita em SERIE no circuito.' };
}

function modeOf(q: MeterQuantity): string {
  if (q === 'voltage-ac') return 'AC';
  if (q.startsWith('voltage') || q === 'millivolt-dc' || q.startsWith('current')) return 'DC';
  return '';
}
