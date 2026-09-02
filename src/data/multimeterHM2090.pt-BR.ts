/**
 * Ficha tecnica / prototipo de dados do multimetro digital HIKARI HM-2090.
 *
 * Fonte primaria: infografico oficial do equipamento (chave seletora, terminais,
 * botoes, categoria de seguranca e erros comuns). Faixas de medicao seguem o
 * padrao de um instrumento TRUE RMS de 6000 contagens (valores tipicos do HM-2090).
 *
 * Este arquivo e a FONTE UNICA que alimenta a ficha da Aula 1 e o simulador 3D:
 * a chave seletora, os terminais exigidos por funcao, as faixas de auto-range e
 * os textos de ajuda saem daqui.
 */

/** Grandeza fisica medida por uma posicao da chave. */
export type MeterQuantity =
  | 'off'
  | 'voltage-dc'
  | 'voltage-ac'
  | 'millivolt-dc'
  | 'resistance'
  | 'diode'
  | 'continuity'
  | 'frequency'
  | 'hfe'
  | 'temperature'
  | 'current-uA'
  | 'current-mA'
  | 'current-A';

/** Terminal (canal) onde a ponta VERMELHA deve entrar para cada funcao. */
export type RedJack = 'VΩHz' | 'mAμA' | '10A';

export interface MeterFunctionSpec {
  id: string;
  /** Simbolo curto que aparece na chave (ex.: "V="). */
  symbol: string;
  namePt: string;
  quantity: MeterQuantity;
  /** Unidade principal exibida no visor (ex.: "V", "Ω", "°C"). */
  unit: string;
  /** Terminal exigido para a ponta vermelha (COM sempre recebe a preta). */
  redJack: RedJack;
  /** Faixas de auto-range (valor maximo de cada faixa), da menor para a maior. */
  ranges?: number[];
  descriptionPt: string;
  examplePt: string;
  /** Funcao secundaria (laranja) acessivel pelo botao SELECT nesta posicao. */
  secondaryPt?: string;
  /** Angulo do ponteiro na chave, em graus no sentido horario a partir do topo. */
  angleDeg: number;
}

export interface MeterTerminalSpec {
  id: 'VΩHz' | 'mAμA' | 'COM' | '10A';
  labelPt: string;
  polarity: 'positivo' | 'negativo' | 'comum';
  acceptsPt: string;
  neverPt: string;
  fusePt?: string;
  /** Posicao X do terminal na carcaca (da esquerda para a direita). */
  order: number;
}

export interface MeterButtonSpec {
  id: 'SELECT' | 'RANGE' | 'REL' | 'HOLD' | 'LIGHT';
  labelPt: string;
  descriptionPt: string;
}

export interface MeterErrorSpec {
  riscoPt: string;
  consequenciaPt: string;
  nivel: 'critico' | 'alto' | 'medio';
}

/** Posicoes da chave seletora (inclui OFF). Ordenadas pelo id logico. */
export const HM2090_FUNCTIONS: MeterFunctionSpec[] = [
  {
    id: 'off',
    symbol: 'OFF',
    namePt: 'Desligado',
    quantity: 'off',
    unit: '',
    redJack: 'VΩHz',
    descriptionPt: 'Desliga o multimetro. Sempre volte para OFF apos o uso.',
    examplePt: 'Guardar o instrumento com seguranca.',
    angleDeg: 180,
  },
  {
    id: 'dcv',
    symbol: 'V=',
    namePt: 'Tensao continua (DC)',
    quantity: 'voltage-dc',
    unit: 'V',
    redJack: 'VΩHz',
    ranges: [6, 60, 600, 1000],
    descriptionPt: 'Mede tensao em circuitos de bateria, fonte, ECU e sensores.',
    examplePt: 'Bateria 12 V, sensor de 5 V.',
    angleDeg: 335,
  },
  {
    id: 'acv',
    symbol: 'V~',
    namePt: 'Tensao alternada (AC)',
    quantity: 'voltage-ac',
    unit: 'V',
    redJack: 'VΩHz',
    ranges: [6, 60, 600, 750],
    descriptionPt: 'Mede tensao em circuitos de corrente alternada (True RMS).',
    examplePt: 'Saida do alternador (AC), tomada.',
    angleDeg: 310,
  },
  {
    id: 'mv',
    symbol: 'mV=',
    namePt: 'Milivolts DC',
    quantity: 'millivolt-dc',
    unit: 'mV',
    redJack: 'VΩHz',
    ranges: [600],
    descriptionPt: 'Tensao continua em escalas muito baixas.',
    examplePt: 'Sinal de sensor, pequena queda de tensao.',
    angleDeg: 285,
  },
  {
    id: 'ohm',
    symbol: '\u03a9',
    namePt: 'Resistencia',
    quantity: 'resistance',
    unit: 'Ω',
    redJack: 'VΩHz',
    ranges: [600, 6e3, 60e3, 600e3, 6e6, 60e6],
    descriptionPt: 'Mede a resistencia eletrica (ohms) com o circuito DESLIGADO.',
    examplePt: 'Resistencia de fios, sensores, bobinas.',
    angleDeg: 30,
  },
  {
    id: 'diode',
    symbol: '>|',
    namePt: 'Teste de diodos',
    quantity: 'diode',
    unit: 'V',
    redJack: 'VΩHz',
    descriptionPt: 'Verifica a queda de tensao direta de diodos.',
    examplePt: 'Diodo retificador do alternador.',
    angleDeg: 55,
  },
  {
    id: 'cont',
    symbol: ')))',
    namePt: 'Continuidade (bip)',
    quantity: 'continuity',
    unit: 'Ω',
    redJack: 'VΩHz',
    descriptionPt: 'Emite um bip se houver continuidade (resistencia quase zero).',
    examplePt: 'Testar fios rompidos, fusiveis, conexoes.',
    angleDeg: 80,
  },
  {
    id: 'hz',
    symbol: 'Hz',
    namePt: 'Frequencia',
    quantity: 'frequency',
    unit: 'Hz',
    redJack: 'VΩHz',
    ranges: [100, 1e3, 10e3, 100e3, 1e6, 10e6],
    descriptionPt: 'Mede a frequencia em Hz.',
    examplePt: 'Sinal PWM, sinal de sensor, rede AC.',
    secondaryPt: 'DUTY %: ciclo de trabalho do sinal.',
    angleDeg: 105,
  },
  {
    id: 'hfe',
    symbol: 'hFE',
    namePt: 'Ganho de transistor',
    quantity: 'hfe',
    unit: '',
    redJack: 'VΩHz',
    ranges: [1000],
    descriptionPt: 'Mede o ganho (hFE) de transistores bipolares (NPN/PNP).',
    examplePt: 'Diagnostico de transistores.',
    angleDeg: 130,
  },
  {
    id: 'temp',
    symbol: '\u00b0C',
    namePt: 'Temperatura',
    quantity: 'temperature',
    unit: '°C',
    redJack: 'VΩHz',
    ranges: [1000],
    descriptionPt: 'Mede temperatura com termopar tipo K.',
    examplePt: 'Escalas em Celsius ou Fahrenheit.',
    secondaryPt: '°C / °F: alterna a unidade.',
    angleDeg: 152,
  },
  {
    id: 'uA',
    symbol: '\u00b5A',
    namePt: 'Corrente continua baixa (microamperes)',
    quantity: 'current-uA',
    unit: 'µA',
    redJack: 'mAμA',
    ranges: [600, 6000],
    descriptionPt: 'Mede correntes muito pequenas.',
    examplePt: 'Sensores, modulos, circuitos de controle.',
    angleDeg: 252,
  },
  {
    id: 'mA',
    symbol: 'mA',
    namePt: 'Corrente continua (miliamperes)',
    quantity: 'current-mA',
    unit: 'mA',
    redJack: 'mAμA',
    ranges: [60, 600],
    descriptionPt: 'Mede correntes medias.',
    examplePt: 'Bicos injetores, eletrovalvulas, reles.',
    angleDeg: 230,
  },
  {
    id: 'A',
    symbol: 'A',
    namePt: 'Corrente continua (alta)',
    quantity: 'current-A',
    unit: 'A',
    redJack: '10A',
    ranges: [10],
    descriptionPt: 'Mede correntes altas (ate 10 A).',
    examplePt: 'Motor de partida, ventinha, sistema de carga.',
    angleDeg: 208,
  },
];

export const HM2090_TERMINALS: MeterTerminalSpec[] = [
  {
    id: '10A',
    labelPt: '10A',
    polarity: 'positivo',
    acceptsPt: 'Entrada para correntes altas (ate 10 A), somente na funcao A.',
    neverPt: 'Nunca use para tensao ou resistencia.',
    fusePt: 'Fusivel 10 A MAX — 10 s MAX a cada 15 min.',
    order: 0,
  },
  {
    id: 'mAμA',
    labelPt: 'mA/µA',
    polarity: 'positivo',
    acceptsPt: 'Entrada para correntes baixas (ate 400 mA), nas funcoes µA e mA.',
    neverPt: 'Nunca use para 10 A ou tensao.',
    fusePt: 'Fusivel 400 mA MAX.',
    order: 1,
  },
  {
    id: 'COM',
    labelPt: 'COM',
    polarity: 'comum',
    acceptsPt: 'Comum (negativo). Conecte sempre a ponta PRETA aqui. Referencia de todas as medicoes.',
    neverPt: 'E a referencia — nao troque pela vermelha.',
    order: 2,
  },
  {
    id: 'VΩHz',
    labelPt: 'VΩHz',
    polarity: 'positivo',
    acceptsPt: 'Tensao (V=/V~/mV), resistencia (Ω), frequencia (Hz), diodos (>|) e temperatura (°C/°F).',
    neverPt: 'Nunca use para corrente (A, mA, µA).',
    order: 3,
  },
];

export const HM2090_BUTTONS: MeterButtonSpec[] = [
  {
    id: 'SELECT',
    labelPt: 'SELECT',
    descriptionPt:
      'Seleciona a funcao secundaria (laranja) marcada acima de algumas posicoes da chave. Ex.: Hz, °C/°F, DUTY (%).',
  },
  {
    id: 'RANGE',
    labelPt: 'RANGE',
    descriptionPt:
      'Altera a faixa de medicao. Pressione para alternar entre faixas manuais; segure para voltar ao modo automatico.',
  },
  {
    id: 'REL',
    labelPt: 'REL',
    descriptionPt:
      'Medicao relativa. Zera o visor no valor atual e passa a mostrar apenas a diferenca em relacao a essa referencia.',
  },
  {
    id: 'HOLD',
    labelPt: 'HOLD',
    descriptionPt: 'Congela o valor no visor. Pressione novamente para liberar.',
  },
  {
    id: 'LIGHT',
    labelPt: 'Luz de fundo',
    descriptionPt: 'Ativa a iluminacao do visor para leitura em ambientes escuros.',
  },
];

export const HM2090_ERRORS: MeterErrorSpec[] = [
  {
    riscoPt: 'Medir corrente com a ponta no canal de tensao (VΩHz).',
    consequenciaPt: 'Pode queimar o multimetro e o circuito (curto pela ponta).',
    nivel: 'critico',
  },
  {
    riscoPt: 'Medir tensao com o multimetro na funcao de corrente.',
    consequenciaPt: 'Pode queimar o fusivel interno ou o multimetro.',
    nivel: 'alto',
  },
  {
    riscoPt: 'Escala muito baixa para a medicao.',
    consequenciaPt: 'Sobrecarga e leitura "OL"; pode danificar o instrumento.',
    nivel: 'medio',
  },
  {
    riscoPt: 'Medir resistencia, diodo ou continuidade em circuito energizado.',
    consequenciaPt: 'Pode danificar o multimetro ou dar leituras falsas.',
    nivel: 'alto',
  },
  {
    riscoPt: 'Ultrapassar o limite de corrente (10 A por mais de 10 segundos).',
    consequenciaPt: 'Queima o fusivel; siga as especificacoes do fabricante.',
    nivel: 'medio',
  },
];

export const HM2090 = {
  brand: 'HIKARI',
  model: 'HM-2090',
  namePt: 'Multimetro Digital HIKARI HM-2090',
  counts: 6000,
  trueRms: true,
  categoryPt: 'CAT III 600 V',
  categoryDescPt:
    'Protecao para equipamentos instalados em circuitos de distribuicao, como sistemas automotivos, paineis, baterias e alternadores.',
  autoPowerOffPt:
    'Para economizar bateria, o multimetro desliga apos alguns minutos de inatividade. Para ligar novamente, gire a chave seletora.',
  importantePt:
    'Sempre selecione a funcao correta ANTES de conectar as ponteiras ao circuito. Funcao ou escala errada pode queimar o multimetro, o circuito ou ambos.',
  dicaDeOuroPt:
    'Sempre conheca o circuito, escolha a funcao e a escala corretas e so entao conecte as ponteiras. Isso evita danos e garante medicoes confiaveis.',
  functions: HM2090_FUNCTIONS,
  terminals: HM2090_TERMINALS,
  buttons: HM2090_BUTTONS,
  errors: HM2090_ERRORS,
} as const;

export function getFunctionById(id: string): MeterFunctionSpec | undefined {
  return HM2090_FUNCTIONS.find((f) => f.id === id);
}
