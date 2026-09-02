import type { Lesson } from '@/simulation/types';

export interface Track {
  id: string;
  titlePt: string;
  descriptionPt: string;
}

export const TRACKS: Track[] = [
  { id: 'fundamentals', titlePt: 'Trilha 1 - Fundamentos', descriptionPt: 'Energia, potencia, torque e geometria do motor.' },
  { id: 'four-strokes', titlePt: 'Trilha 2 - Os quatro tempos', descriptionPt: 'Admissao, compressao, combustao e escape em 720 graus.' },
  { id: 'systems', titlePt: 'Trilha 3 - Sistemas', descriptionPt: 'Alimentacao, ignicao, lubrificacao, arrefecimento e mais.' },
  { id: 'internals', titlePt: 'Trilha 4 - Componentes internos', descriptionPt: 'Pistao, aneis, virabrequim, valvulas e comando.' },
  { id: 'combustion', titlePt: 'Trilha 5 - Combustao e desempenho', descriptionPt: 'AFR, avanco, pressao, torque, detonacao e perdas.' },
  { id: 'diagnosis', titlePt: 'Trilha 6 - Diagnostico', descriptionPt: 'Sintomas, padroes de falha e comparacao normal x defeito.' },
];

export const LESSONS: Lesson[] = [
  {
    id: 'energy-basics',
    trackId: 'fundamentals',
    titlePt: 'Energia termica e mecanica',
    summaryPt: 'Como a energia quimica do combustivel vira trabalho mecanico.',
    steps: [
      {
        titlePt: 'Do combustivel ao torque',
        bodyPt:
          'A combustao libera energia quimica como calor e pressao. A pressao empurra o pistao, que gira o virabrequim gerando torque. Observe o pistao em movimento.',
        crankAngleDeg: 400,
      },
      {
        titlePt: 'Potencia x torque',
        bodyPt:
          'Torque e a forca de giro; potencia e torque multiplicado pela velocidade angular. Acompanhe os valores no painel de telemetria.',
        quiz: {
          questionPt: 'Potencia e igual a:',
          options: ['torque x rotacao angular', 'apenas torque', 'apenas rotacao'],
          correctIndex: 0,
        },
      },
    ],
  },
  {
    id: 'geometry-basics',
    trackId: 'fundamentals',
    titlePt: 'PMS, PMI, curso e cilindrada',
    summaryPt: 'Os conceitos geometricos que definem o motor.',
    steps: [
      {
        titlePt: 'PMS e PMI',
        bodyPt:
          'O ponto morto superior (PMS) e a posicao mais alta do pistao; o inferior (PMI) e a mais baixa. O curso e a distancia entre eles e vale 2 vezes o raio da manivela.',
        crankAngleDeg: 0,
        focusComponentId: 'piston',
      },
      {
        titlePt: 'Cilindrada e taxa de compressao',
        bodyPt:
          'A cilindrada e o volume deslocado pelo pistao; a taxa de compressao relaciona o volume total ao volume da camara. Veja os valores calculados.',
      },
    ],
  },
  {
    id: 'four-strokes',
    trackId: 'four-strokes',
    titlePt: 'Os quatro tempos em 720 graus',
    summaryPt: 'Admissao, compressao, combustao/expansao e escape.',
    steps: [
      { titlePt: 'Admissao', bodyPt: 'A valvula de admissao abre e o pistao desce, aspirando a mistura. Observe a valvula de admissao.', crankAngleDeg: 90, focusComponentId: 'valves' },
      { titlePt: 'Compressao', bodyPt: 'As valvulas fecham e o pistao sobe comprimindo a mistura.', crankAngleDeg: 270 },
      { titlePt: 'Combustao e expansao', bodyPt: 'A centelha inflama a mistura; a pressao empurra o pistao gerando trabalho.', crankAngleDeg: 400 },
      { titlePt: 'Escape', bodyPt: 'A valvula de escape abre e o pistao expulsa os gases queimados.', crankAngleDeg: 630 },
    ],
  },
  {
    id: 'firing-order',
    trackId: 'four-strokes',
    titlePt: 'Ordem de ignicao 1-3-4-2',
    summaryPt: 'Como os quatro cilindros se revezam a cada 180 graus.',
    steps: [
      {
        titlePt: 'Eventos separados por 180 graus',
        bodyPt:
          'Em um quatro cilindros, os eventos de combustao ocorrem a cada 180 graus na ordem 1-3-4-2, equilibrando o motor.',
      },
    ],
  },
  {
    id: 'ignition-system',
    trackId: 'systems',
    titlePt: 'Sistema de ignicao',
    summaryPt: 'Bobina, vela, avanco e a ECU.',
    steps: [
      { titlePt: 'A centelha no ponto certo', bodyPt: 'A ECU comanda a bobina para gerar a centelha alguns graus antes do PMS.', focusComponentId: 'spark-plug', crankAngleDeg: 345 },
    ],
  },
  {
    id: 'combustion-quality',
    trackId: 'combustion',
    titlePt: 'Combustao normal, detonacao e pre-ignicao',
    summaryPt: 'Diferencie os tres padroes de combustao.',
    steps: [
      { titlePt: 'Normal', bodyPt: 'Frente de chama unica, pico de pressao apos o PMS.', crankAngleDeg: 380 },
      { titlePt: 'Detonacao', bodyPt: 'Autoignicao do gas final apos a centelha, com ondas de pressao e ruido.' },
      { titlePt: 'Pre-ignicao', bodyPt: 'Ponto quente inicia a chama antes da centelha, com pressao contra o pistao subindo.' },
    ],
  },
  {
    id: 'diagnosis-intro',
    trackId: 'diagnosis',
    titlePt: 'Padrao de diagnostico',
    summaryPt: 'Aspecto, dados, causas provaveis, teste discriminante, correcao e prevencao.',
    steps: [
      {
        titlePt: 'O metodo',
        bodyPt:
          'Observe o aspecto, leia os dados, levante causas provaveis, aplique um teste que as diferencie, corrija e previna. Os estudos de caso seguem esse padrao.',
      },
    ],
  },
];

export const LESSONS_BY_ID = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
export const LESSONS_BY_TRACK = TRACKS.map((t) => ({
  track: t,
  lessons: LESSONS.filter((l) => l.trackId === t.id),
}));
