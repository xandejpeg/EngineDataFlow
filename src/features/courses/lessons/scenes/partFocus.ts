/**
 * Conteudo da visualizacao isolada de cada peca do mapa Motronic.
 *
 * A ideia: o aluno clica em "Visualizar" e some tudo que nao tem a ver com a
 * peca. Fica so ela, o que ela toca de verdade (tubo, valvula, tanque, cabo) e
 * um texto do lado explicando o que e, como funciona e como se testa.
 *
 * A chave do mapa e o numero do item em MOTRONIC_ITEMS.
 */
import type { Vec3 } from './mapPrimitives';

/** Uma peca desenhada na cena isolada. A principal fica destacada. */
export interface FocusPart {
  partId: string;
  /** Rotulo flutuante. A peca principal recebe o nome dela sozinha, em cima do corpo. */
  labelPt?: string;
  labelAt?: Vec3;
  /** Onde por o nome da peca principal, quando o lugar medido em cima dela nao serve. */
  titleAt?: Vec3;
  pos: Vec3;
  scale: number;
  rot?: Vec3;
  /** Peca de contexto: fica mais apagada para o foco ficar na principal. */
  dim?: boolean;
}

/** Tubo, mangueira ou cabo ligando as pecas da cena isolada. */
export interface FocusPipe {
  points: Vec3[];
  r: number;
  color: string;
  /** Cor das bolinhas de fluxo. Sem isso o tubo fica parado. */
  flow?: string;
  flowSpeed?: number;
  /** Fluxo comandado pela borboleta: acelera quando ela abre e quase para quando fecha. */
  gated?: boolean;
  /** false desenha so o fluxo, sem o tubo: serve para atravessar por dentro de uma peca. */
  tube?: boolean;
  labelPt?: string;
  labelAt?: Vec3;
}

/** Caixa solida ou de vidro: tanque, coletor, cilindro, caixa de filtro. */
export interface FocusBox {
  pos: Vec3;
  size: Vec3;
  color?: string;
  glass?: boolean;
  labelPt?: string;
  labelAt?: Vec3;
}

/** Um fio do conector da peca. */
export interface FocusPin {
  pinPt: string;
  whatPt: string;
  color: string;
}

export interface PartFocus {
  /** Uma linha: o que a peca e, sem enrolacao. */
  oneLinePt: string;
  /** Como funciona, em paragrafos curtos. */
  bodyPt: string[];
  /** O que aparece junto na cena e por que. */
  contextPt: string;
  /** Fios do conector. Peca so mecanica fica sem. */
  pinsPt?: FocusPin[];
  /** Valores de teste e sintoma de defeito. */
  testPt: string[];
  parts: FocusPart[];
  pipes?: FocusPipe[];
  boxes?: FocusBox[];
  labels?: { textPt: string; pos: Vec3 }[];
  /** Distancia da camera. Peca grande pede mais. */
  camDist?: number;
  camTarget?: Vec3;
}

const WIRE_RED = '#b03030';
const WIRE_BLACK = '#2f3644';
const WIRE_SIGNAL = '#0f8a46';
const HOSE = '#2f3644';
const METAL_PIPE = '#5b667a';
const EXH_PIPE = '#7a6a5c';
const FUEL_PIPE = '#8a6330';
/** Cor das bolinhas que correm no fio: eletricidade tambem e fluxo. */
const ELEC = '#ffd93b';

export const PART_FOCUS: Record<number, PartFocus> = {
  // ---------------------------------------------------------------- 1
  1: {
    oneLinePt:
      'Caixa cheia de carvao ativado que prende o vapor de gasolina do tanque em vez de deixar ele escapar para o ar.',
    bodyPt: [
      'Gasolina evapora. Um tanque fechado no sol chega a alguns decimos de bar de pressao so de vapor. Esse vapor precisa sair de algum lugar, senao o tanque estufa.',
      'Antigamente ele saia direto para a atmosfera por um respiro. Hoje nao pode: o vapor e hidrocarboneto, e o carro precisa passar na lei de emissoes. Entao o respiro do tanque nao vai para o ar, vai para o canister.',
      'Dentro do canister tem carvao ativado. O carvao tem uma area interna enorme e segura a molecula de gasolina na superficie. O ar limpo sai pelo respiro de baixo, a gasolina fica presa no carvao.',
      'So que o carvao enche. Por isso o canister precisa ser limpo de tempo em tempo, e quem faz isso e a valvula de purga: a ECU abre a purga, o vacuo do motor puxa ar limpo pela entrada de baixo, esse ar arrasta a gasolina que estava presa no carvao e leva tudo para o coletor de admissao, onde e queimado no motor.',
      'Resumindo o ciclo: motor parado o canister enche, motor rodando quente a ECU esvazia o canister queimando o vapor. Por isso ele nao e uma peca isolada, ele so faz sentido junto com a valvula de purga e o tanque.',
    ],
    contextPt:
      'Na cena estao o tanque, a mangueira de respiro que traz o vapor, o filtro de ar livre embaixo do canister, a valvula de purga e a mangueira que leva o vapor para o coletor de admissao.',
    testPt: [
      'Nao tem sinal eletrico. Quem tem fio e a valvula de purga, nao o canister.',
      'Teste de sopro: soprando pelo bico do tanque o ar tem que passar para o canister com pouca resistencia.',
      'Canister encharcado de gasolina liquida (abastecer ate transbordar) derruba a marcha lenta e da cheiro de combustivel. Nesse caso troca, nao adianta lavar.',
      'Canister ou mangueira entupida faz o tanque estufar e o bico da bomba desarmar toda hora ao abastecer.',
    ],
    camDist: 14,
    camTarget: [-0.4, 1.0, 0],
    parts: [
      { partId: 'canister', pos: [-2.6, 1.4, 0], scale: 1.5, titleAt: [-2.6, -0.15, 0] },
      { partId: 'purge-valve', pos: [2.2, 1.4, 0], scale: 1.2, labelPt: 'Valvula de purga', labelAt: [2.2, 2.9, 0] },
    ],
    boxes: [
      {
        pos: [-5.4, -2.2, 0],
        size: [3.2, 1.6, 1.6],
        glass: true,
        labelPt: 'Tanque de combustivel',
        labelAt: [-5.4, -3.5, 0],
      },
      {
        pos: [5.1, 1.4, 0],
        size: [0.5, 1.8, 1.2],
        color: '#3d4657',
        labelPt: 'Coletor de admissao',
        labelAt: [5.9, 2.7, 0],
      },
      { pos: [-2.6, 4.6, 0], size: [0.55, 0.5, 0.55], color: '#3d4657' },
    ],
    pipes: [
      {
        points: [
          [-5.4, -1.4, 0],
          [-5.4, 3.7, 0],
          [-3.28, 3.7, 0],
          [-3.28, 2.85, 0],
        ],
        r: 0.09,
        color: HOSE,
        flow: '#e08a1e',
        flowSpeed: 0.12,
        labelPt: 'Respiro do tanque: vapor sobe',
        labelAt: [-6.6, 1.0, 0],
      },
      {
        points: [
          [-2.6, 2.85, 0],
          [-2.6, 4.3, 0],
        ],
        r: 0.07,
        color: HOSE,
        labelPt: 'Respiro de ar livre',
        labelAt: [-2.6, 5.4, 0],
      },
      {
        points: [
          [-1.92, 2.85, 0],
          [-1.92, 4.5, 0],
          [0.3, 4.5, 0],
          [0.3, 1.4, 0],
          [1.15, 1.4, 0],
        ],
        r: 0.09,
        color: HOSE,
        flow: '#e08a1e',
        flowSpeed: 0.16,
      },
      {
        points: [
          [3.25, 1.4, 0],
          [4.85, 1.4, 0],
        ],
        r: 0.09,
        color: HOSE,
        flow: '#e08a1e',
        flowSpeed: 0.16,
        labelPt: 'Vapor vai para o motor queimar',
        labelAt: [4.0, 0.05, 0],
      },
    ],
    labels: [{ textPt: 'os tres bocais ficam no topo do canister', pos: [1.6, -0.9, 0] }],
  },

  // ---------------------------------------------------------------- 2
  2: {
    oneLinePt:
      'Mede quantos gramas de ar por segundo estao entrando no motor. E o numero que define quanto combustivel injetar.',
    bodyPt: [
      'O motor nao queima volume de ar, queima massa de ar. Um metro cubico de ar frio tem muito mais oxigenio que um metro cubico de ar quente. Por isso medir vazao de volume nao serve: tem que medir massa.',
      'O MAF de fio ou de filme quente resolve isso com um truque simples. Dentro do duto tem um elemento aquecido a uma temperatura fixa acima da temperatura do ar (uns 120 a 180 graus acima). O ar passando por ele rouba calor. Quanto mais massa de ar passa, mais calor ele rouba, e mais corrente o circuito precisa injetar para manter aquela temperatura.',
      'Essa corrente e o sinal. O modulo interno converte para tensao de 0 a 5 V (analogico) ou para frequencia (digital). Marcha lenta fica perto de 0,8 a 1,2 V; acelerando forte vai para 4 V e pouco.',
      'O MAF comum tem 4 fios: +12 V pos-chave, terra, terra de referencia do sinal e o proprio sinal. Existe tambem versao de 3 fios, digital, que entrega frequencia em vez de tensao e dispensa o terra separado do sinal.',
      'Quando o sensor de temperatura do ar (IAT) vem no mesmo corpo, ele vira TMAF e ganha um quinto fio: o sinal do NTC, que aproveita o mesmo terra de referencia. A ECU precisa da temperatura para saber a densidade do ar.',
      'O MAF fica logo depois da caixa do filtro de propósito: se entrar poeira o elemento suja, e elemento sujo isola, mede menos ar do que realmente passa. Resultado: mistura pobre, falta de forca, motor engasgando na aceleracao.',
    ],
    contextPt:
      'Na cena estao a caixa do filtro de ar antes dele, o duto e o corpo de borboleta depois. As bolinhas azuis mostram o sentido do ar, e elas so correm quando a borboleta abre. Embaixo esta a outra versao da mesma peca, o TMAF: nao esta ligada no duto, so aparece para comparar.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '+12 V pos-chave, vindo do rele principal', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Terra do modulo, vai direto na ECU', color: WIRE_BLACK },
      { pinPt: 'Fio 3', whatPt: 'Terra de referencia do sinal', color: WIRE_BLACK },
      { pinPt: 'Fio 4', whatPt: 'Sinal de massa de ar, 0 a 5 V ou frequencia', color: WIRE_SIGNAL },
      {
        pinPt: 'Fio 5',
        whatPt: 'So na versao TMAF: sinal do sensor de temperatura do ar (IAT)',
        color: '#7127c9',
      },
    ],
    testPt: [
      'Chave ligada motor parado: sinal parado perto de 0,2 a 0,6 V. Se ja marca 1 V com o motor desligado, o sensor esta viciado.',
      'Marcha lenta: 0,8 a 1,2 V. Acelerando de uma vez: tem que subir rapido para mais de 4 V e voltar.',
      'Compare com a leitura em g/s no scanner. Regra pratica de motor aspirado: em marcha lenta cerca de 2 a 4 g/s, e no pico da aceleracao aproximadamente a cilindrada em litros vezes 55 a 60.',
      'MAF sujo da falta de forca e mistura pobre. Antes de trocar, procure entrada de ar falsa entre o MAF e a borboleta: esse ar entra sem ser medido e da o mesmo sintoma.',
      'No TMAF, teste os dois sinais separados: o de massa de ar e o do NTC. NTC aberto ou em curto engana a ECU na densidade e some com a correcao de partida a frio.',
    ],
    camDist: 11,
    parts: [
      { partId: 'maf-sensor', pos: [0, 0, 0], scale: 1.0 },
      {
        partId: 'throttle-body',
        pos: [4.4, 0, 0],
        scale: 1.1,
        labelPt: 'Corpo de borboleta: abre e fecha o ar',
        labelAt: [4.4, 1.9, 0],
      },
      {
        partId: 'tmaf-sensor',
        pos: [-1.0, -3.0, 0],
        scale: 1.0,
        labelPt: 'Versao TMAF: massa e temperatura, 5 fios',
        labelAt: [3.4, -2.6, 0],
      },
    ],
    boxes: [
      {
        pos: [-4.3, 0, 0],
        size: [1.5, 1.9, 1.8],
        color: '#3d4657',
        labelPt: 'Caixa do filtro de ar',
        labelAt: [-4.3, 1.7, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-7.5, 0, 0],
          [-0.95, 0, 0],
        ],
        r: 0.4,
        color: METAL_PIPE,
        labelPt: 'ar entra',
        labelAt: [-6.6, 0.9, 0],
      },
      {
        points: [
          [0.95, 0, 0],
          [3.4, 0, 0],
        ],
        r: 0.4,
        color: METAL_PIPE,
      },
      {
        points: [
          [5.4, 0, 0],
          [6.2, 0, 0],
        ],
        r: 0.4,
        color: METAL_PIPE,
      },
      {
        points: [
          [-7.5, 0, 0],
          [6.2, 0, 0],
        ],
        r: 0.4,
        color: METAL_PIPE,
        tube: false,
        flow: '#1d5fd8',
        flowSpeed: 0.18,
        gated: true,
      },
    ],
    labels: [
      { textPt: 'ar medido vai para o motor', pos: [5.6, -1.6, 0] },
      { textPt: 'a anteninha do NTC le a temperatura', pos: [-5.0, -3.2, 0] },
    ],
  },

  // ---------------------------------------------------------------- 3
  3: {
    oneLinePt:
      'O computador do motor. Le todos os sensores, decide quanto injetar e quando dar faisca, e aciona os atuadores.',
    bodyPt: [
      'A ECU nao "sabe" nada sozinha. Ela tem um mapa gravado de fabrica e, em cima dele, corrige em tempo real com o que os sensores contam.',
      'A conta basica e essa: rotacao e carga (do MAF ou do MAP) dizem quanto ar esta entrando. Com a massa de ar, a ECU calcula o combustivel para chegar em lambda 1. Depois corrige com temperatura do motor, temperatura do ar, sonda lambda e sensor de detonacao.',
      'Por dentro tem tres blocos: a entrada, que protege e condiciona os sinais dos sensores; o processador, que roda os mapas; e a saida de potencia, que sao transistores fortes que aterram injetor, bobina, rele e motor da borboleta.',
      'Quase tudo que a ECU liga, ela liga pelo lado do terra. O atuador recebe +12 V do rele e fica esperando; a ECU fecha o terra e o atuador funciona. E por isso que medir tensao no fio de comando de um injetor com o motor parado da 12 V, e nao zero.',
      'Ela tambem fala com o resto do carro pela rede CAN: painel, cambio, ABS, imobilizador. E e ela que guarda os codigos de falha que o scanner le.',
    ],
    contextPt:
      'Na cena estao a alimentacao +12 V com a caixa de fusiveis, o terra, o barramento CAN com os dois resistores de 120 ohm e o conector de diagnostico.',
    pinsPt: [
      { pinPt: 'Alimentacao', whatPt: '+12 V direto da bateria (memoria) e +12 V pos-chave', color: WIRE_RED },
      { pinPt: 'Terras', whatPt: 'Varios terras de potencia parafusados no bloco do motor', color: WIRE_BLACK },
      { pinPt: 'CAN H / CAN L', whatPt: 'Par trancado da rede, 2,5 V em repouso', color: '#8a6d10' },
      { pinPt: 'Entradas', whatPt: 'Sensores: 5 V de referencia, terra de sinal e o sinal', color: WIRE_SIGNAL },
      { pinPt: 'Saidas', whatPt: 'Comando por terra: injetores, bobinas, reles, borboleta', color: '#7127c9' },
    ],
    testPt: [
      'Antes de acusar a ECU: confira +12 V pos-chave, +12 V permanente e TODOS os terras. Terra ruim imita defeito de ECU.',
      'Queda de tensao no terra da ECU com o motor rodando tem que ficar abaixo de 0,1 V.',
      'A referencia de 5 V que ela manda para os sensores tem que ficar entre 4,9 e 5,1 V. Se caiu para 3 V, tem sensor em curto puxando a referencia para baixo.',
      'ECU e a ULTIMA peca a se trocar. A esmagadora maioria dos casos e chicote, conector oxidado ou terra.',
    ],
    camDist: 14,
    camTarget: [0.2, 0.3, 0],
    parts: [
      { partId: 'ecu', pos: [0, 0, 0], scale: 1.3 },
      {
        partId: 'obd-connector',
        pos: [4.6, -2.4, 0],
        scale: 1.1,
        dim: true,
        labelPt: 'Diagnostico OBD2',
        labelAt: [4.6, -3.6, 0],
      },
      { partId: 'battery', pos: [-4.8, 2.6, 0], scale: 1.0, dim: true, labelPt: 'Bateria', labelAt: [-4.8, 4.4, 0] },
    ],
    boxes: [
      { pos: [-4.8, 0.2, 0], size: [0.7, 0.9, 0.7], color: '#3d4657', labelPt: 'Fusiveis', labelAt: [-6.1, 0.2, 0] },
      { pos: [6.5, 0.5, 0], size: [0.4, 0.5, 0.4], color: '#8a6d10' },
    ],
    pipes: [
      {
        points: [
          [-4.8, 1.85, 0],
          [-4.8, 0.65, 0],
        ],
        r: 0.08,
        color: WIRE_RED,
      },
      {
        points: [
          [-4.8, -0.25, 0.35],
          [-4.8, -2.2, 0.35],
          [2.8, -2.2, 0.35],
          [2.8, 0.15, 0.35],
          [1.6, 0.15, 0.35],
        ],
        r: 0.08,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: '+12 V entra pelo conector',
        labelAt: [-1.2, -2.8, 0],
      },
      {
        points: [
          [1.6, -0.5, -0.35],
          [1.6, -3.2, -0.35],
          [-3.6, -3.2, -0.35],
        ],
        r: 0.08,
        color: WIRE_BLACK,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'Terra no bloco',
        labelAt: [-5.0, -3.2, 0],
      },
      {
        points: [
          [1.6, 0.5, 0],
          [4.6, 0.5, 0],
          [6.3, 0.5, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.34,
        labelPt: 'Rede CAN',
        labelAt: [3.2, 1.3, 0],
      },
      {
        points: [
          [4.6, 0.5, 0],
          [4.6, -1.9, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
      },
    ],
    labels: [
      { textPt: 'resistor 120 ohm', pos: [6.5, 1.4, 0] },
      { textPt: 'tudo entra e sai pelo conector multivias', pos: [0, 2.4, 0] },
    ],
  },

  // ---------------------------------------------------------------- 4
  4: {
    oneLinePt:
      'A tomada padronizada de 16 pinos por onde o scanner conversa com a ECU e com os outros modulos do carro.',
    bodyPt: [
      'O conector e igual em qualquer carro do mundo desde que o OBD2 virou lei: mesmo formato, mesma posicao de pinos, sempre a menos de um metro do volante e sem precisar de ferramenta para chegar nele.',
      'O que muda de carro para carro e o protocolo que roda por dentro. Nos carros mais antigos era K-line no pino 7; hoje e praticamente tudo CAN, nos pinos 6 e 14.',
      'Repare que o conector nao e "da ECU". Ele e do carro. Pelo mesmo conector o scanner fala com a ECU do motor, com o cambio, com o ABS, com o airbag e com o painel, porque todos estao no mesmo barramento.',
      'Os pinos 4 e 5 sao terra e o 16 e +12 V direto da bateria, sem passar pela chave. E por isso que o scanner acende antes de girar a chave.',
    ],
    contextPt:
      'Na cena estao a ECU e o barramento CAN, para ficar claro que o conector so e uma tomada no meio da rede, e nao um fio exclusivo da central.',
    pinsPt: [
      { pinPt: 'Pino 4', whatPt: 'Terra do chassi', color: WIRE_BLACK },
      { pinPt: 'Pino 5', whatPt: 'Terra do sinal', color: WIRE_BLACK },
      { pinPt: 'Pino 6', whatPt: 'CAN H (alta)', color: '#8a6d10' },
      { pinPt: 'Pino 14', whatPt: 'CAN L (baixa)', color: '#8a6d10' },
      { pinPt: 'Pino 7', whatPt: 'K-line, usado nos sistemas mais antigos', color: '#7127c9' },
      { pinPt: 'Pino 16', whatPt: '+12 V permanente, direto da bateria', color: WIRE_RED },
    ],
    testPt: [
      'Scanner nao liga: mede 12 V entre o pino 16 e o pino 4. Sem isso, procura o fusivel do conector, e um dos que mais queima.',
      'Chave ligada, motor parado: entre CAN H e terra da perto de 2,6 V e entre CAN L e terra perto de 2,4 V. Os dois em 0 V ou os dois em 5 V e barramento em curto.',
      'Bateria desligada, resistencia entre os pinos 6 e 14 tem que dar perto de 60 ohm. Sao os dois resistores de 120 ohm das pontas em paralelo. Se der 120, uma ponta da rede esta aberta.',
    ],
    camDist: 13,
    camTarget: [0, 0.6, 0],
    parts: [
      { partId: 'obd-connector', pos: [0, 0, 0], scale: 1.6 },
      { partId: 'ecu', pos: [-4.4, 2.4, 0], scale: 1.0, dim: true, labelPt: 'ECU do motor', labelAt: [-4.4, 3.6, 0] },
      {
        partId: 'mil-lamp',
        pos: [4.2, 2.4, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Luz de anomalia no painel',
        labelAt: [4.2, 3.6, 0],
      },
    ],
    boxes: [
      { pos: [-6.0, 1.2, 0], size: [0.4, 0.5, 0.4], color: '#8a6d10' },
      { pos: [6.0, 1.2, 0], size: [0.4, 0.5, 0.4], color: '#8a6d10' },
    ],
    pipes: [
      {
        points: [
          [-5.8, 1.2, 0],
          [5.8, 1.2, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.34,
        labelPt: 'Barramento CAN: todos os modulos no mesmo par de fios',
        labelAt: [0, 2.3, 0],
      },
      {
        points: [
          [-4.4, 1.85, 0],
          [-4.4, 1.2, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
      },
      {
        points: [
          [4.2, 1.8, 0],
          [4.2, 1.2, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
      },
      {
        points: [
          [0, 0.65, 0],
          [0, 1.2, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
      },
    ],
    labels: [
      { textPt: 'resistor 120 ohm', pos: [-6.0, 0.4, 0] },
      { textPt: 'resistor 120 ohm', pos: [6.0, 0.4, 0] },
      { textPt: 'pino 16: +12 V direto da bateria', pos: [0, -1.7, 0] },
    ],
  },

  // ---------------------------------------------------------------- 5
  5: {
    oneLinePt:
      'A luz amarela de motor no painel. Ela nao diz qual e o defeito, ela so diz que a ECU gravou um codigo.',
    bodyPt: [
      'Sequencia normal: girou a chave, a luz acende junto com as outras. Isso e o autoteste, e proposital. Deu partida, ela apaga. Se ficar acesa com o motor rodando, tem codigo gravado.',
      'Luz acesa fixa e falha que afeta emissao ou funcionamento, mas da para andar. Luz piscando e falha de combustao acontecendo AGORA, e e serio: combustivel nao queimado esta indo para o escape e vai cozinhar o catalisador. Nesse caso e para parar.',
      'A luz nao tem fio proprio ate a ECU. Ela e comandada pelo painel, e o painel recebe a ordem pela rede CAN. Por isso um painel com defeito de comunicacao pode deixar a luz apagada mesmo com codigo gravado, ou acesa sem motivo.',
      'Luz apagada nao significa carro sem problema. Existe muito codigo pendente que ainda nao acendeu a luz, e existe defeito mecanico que a ECU nao enxerga.',
    ],
    contextPt:
      'Na cena estao a ECU, o barramento CAN e o painel, mostrando que a ordem de acender viaja pela rede e nao por um fio direto.',
    pinsPt: [
      { pinPt: 'Sem fio direto', whatPt: 'A ECU nao aciona a lampada, ela envia a mensagem pela CAN', color: '#8a6d10' },
      { pinPt: 'Alimentacao', whatPt: 'A lampada e alimentada pelo proprio painel', color: WIRE_RED },
    ],
    testPt: [
      'Luz nao acende ao girar a chave: ou a lampada queimou, ou alguem tirou de proposito. Isso e classico em carro de revenda.',
      'Luz acesa e o scanner nao acha codigo: leia todos os modulos, nao so o motor. Cambio e ABS tambem acendem espia.',
      'Luz piscando: nao rode o carro. Faca teste de compressao e cheque bobina, vela e injetor do cilindro que o codigo aponta.',
      'Apagar a luz sem consertar a causa nao resolve. Ela volta no proximo ciclo de teste.',
    ],
    camDist: 10,
    parts: [
      { partId: 'mil-lamp', pos: [0, 0, 0], scale: 1.5 },
      { partId: 'ecu', pos: [-4.6, 2.2, 0], scale: 1.0, dim: true, labelPt: 'ECU do motor', labelAt: [-4.6, 3.3, 0] },
    ],
    boxes: [
      {
        pos: [0, 0, -0.9],
        size: [4.4, 2.0, 0.3],
        color: '#2b313d',
        labelPt: 'Painel de instrumentos',
        labelAt: [0, 1.5, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-4.6, 1.65, 0],
          [-4.6, -2.6, 0],
          [0, -2.6, 0],
          [0, -1.2, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'a ordem de acender vem pela CAN',
        labelAt: [-2.2, -3.2, 0],
      },
    ],
    labels: [
      { textPt: 'acesa fixa: tem codigo gravado', pos: [0, -1.7, 0] },
      { textPt: 'piscando: falha de combustao agora, para o carro', pos: [0, -2.5, 0] },
    ],
  },

  // ---------------------------------------------------------------- 6
  6: {
    oneLinePt:
      'A antena em volta do cilindro da ignicao que le o chip da chave. Sem a resposta certa, a ECU nao deixa o motor pegar.',
    bodyPt: [
      'Dentro da cabeca da chave tem um transponder: um chip sem bateria. A antena em volta do cilindro energiza esse chip por inducao, o chip responde com um codigo, e o modulo do imobilizador confere.',
      'Se o codigo bate, o imobilizador manda pela rede uma liberacao para a ECU. So entao a ECU habilita injecao e ignicao.',
      'O sintoma classico e caracteristico: o motor gira normal, chega a pegar por meio segundo e morre. Isso e a ECU cortando combustivel depois de nao receber a liberacao. Motor que nem tenta pegar geralmente e outro problema.',
      'Chave copiada sem programar o transponder abre a porta e gira o cilindro, mas nao da partida. E o defeito mais comum de chave reserva de chaveiro.',
      'Cuidado com o que fica perto da chave: outra chave com chip, tag de pedagio ou celular encostado no chaveiro atrapalham a leitura.',
    ],
    contextPt:
      'Na cena estao a antena, a chave com o transponder e a ECU, com a mensagem de liberacao viajando pela rede.',
    pinsPt: [
      { pinPt: 'Bobina da antena', whatPt: 'Dois fios, energiza o chip da chave por inducao', color: '#7127c9' },
      { pinPt: 'Alimentacao', whatPt: '+12 V pos-chave para o modulo', color: WIRE_RED },
      { pinPt: 'Rede', whatPt: 'A liberacao vai para a ECU pela CAN ou por linha dedicada', color: '#8a6d10' },
    ],
    testPt: [
      'Motor pega e morre em menos de 1 segundo: suspeite do imobilizador antes de mexer em combustivel.',
      'A luz do cadeado no painel acesa ou piscando confirma bloqueio.',
      'Teste com a outra chave. Se a segunda chave funciona, o problema e o transponder da primeira.',
      'A bobina da antena da poucos ohm. Antena solta ou fio partido no volante da o mesmo sintoma de chave sem chip.',
      'Trocar a ECU de um carro com imobilizador exige programar as chaves na central nova, senao nao pega.',
    ],
    camDist: 10,
    parts: [
      { partId: 'immobilizer-antenna', pos: [0, 0, 0], scale: 1.4 },
      { partId: 'ecu', pos: [4.6, 2.2, 0], scale: 1.0, dim: true, labelPt: 'ECU do motor', labelAt: [4.6, 3.3, 0] },
    ],
    boxes: [
      { pos: [0, 2.3, 0], size: [0.9, 0.5, 0.3], color: '#c9a227', labelPt: 'Chave com transponder', labelAt: [-2.4, 2.3, 0] },
    ],
    pipes: [
      {
        points: [
          [1.2, 0, 0],
          [4.6, 0, 0],
          [4.6, 1.65, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'liberacao: pode dar partida',
        labelAt: [2.9, -0.9, 0],
      },
    ],
    labels: [
      { textPt: 'a antena energiza o chip', pos: [0, 1.35, 0] },
      { textPt: 'codigo errado: pega e morre', pos: [0, -1.7, 0] },
    ],
  },

  // ---------------------------------------------------------------- 7
  7: {
    oneLinePt:
      'O par de fios trancados por onde todos os modulos do carro conversam. Duas linhas so, e nelas passa a informacao de tudo.',
    bodyPt: [
      'Antes da CAN, cada informacao precisava de um fio proprio. A rotacao ia do motor para o painel por um fio, a velocidade por outro, e assim por diante. Com dezenas de modulos isso virou um chicote impossivel.',
      'A CAN resolveu com dois fios: CAN H e CAN L. Todos os modulos ficam pendurados nesse mesmo par. Quem quer falar joga a mensagem na rede e todo mundo escuta; cada modulo pega so o que interessa para ele.',
      'O sinal e diferencial, e e por isso que ele e confiavel. Em repouso as duas linhas ficam em 2,5 V. Quando um bit e transmitido, CAN H sobe para uns 3,5 V e CAN L desce para uns 1,5 V, ao mesmo tempo. O receptor nao le tensao, le a DIFERENCA entre as duas.',
      'Se um ruido eletrico entra na rede (bobina, alternador, motor de partida), ele entra igual nos dois fios e a diferenca nao muda. O ruido some sozinho. Por isso os dois fios sao trancados um no outro: para pegarem exatamente o mesmo ruido.',
      'Nas duas pontas do barramento tem um resistor de 120 ohm. Eles nao sao enfeite: eles impedem que o sinal bata na ponta do fio e volte, embaralhando a mensagem. Como estao em paralelo, medindo com tudo desligado da 60 ohm.',
      'Quem manda mais na rede e definido pelo endereco da mensagem: se dois modulos falam ao mesmo tempo, a mensagem mais importante ganha e a outra tenta de novo. Freio e motor passam na frente de radio e ar condicionado.',
    ],
    contextPt:
      'Na cena estao o par trancado com os dois resistores de ponta e os modulos pendurados nele: ECU, painel, conector de diagnostico e imobilizador.',
    pinsPt: [
      { pinPt: 'CAN H', whatPt: 'Linha alta. Repouso 2,5 V, sobe para cerca de 3,5 V', color: '#8a6d10' },
      { pinPt: 'CAN L', whatPt: 'Linha baixa. Repouso 2,5 V, desce para cerca de 1,5 V', color: '#8a6d10' },
      { pinPt: 'Resistores', whatPt: '120 ohm em cada ponta. Em paralelo dao 60 ohm', color: WIRE_BLACK },
    ],
    testPt: [
      'Chave desligada e bateria desconectada: entre CAN H e CAN L tem que dar perto de 60 ohm. Deu 120, uma ponta abriu. Deu infinito, o barramento esta partido.',
      'Chave ligada: CAN H perto de 2,6 V e CAN L perto de 2,4 V contra o terra. Os dois em 0 V e curto para o terra; os dois em 12 V e curto com a alimentacao.',
      'Scanner que ve alguns modulos e outros nao geralmente e um ramo da rede aberto, e nao defeito dos modulos que sumiram.',
      'Um unico modulo em curto derruba a rede inteira. Desconectando um por um, o que voltar a rede quando sai e o culpado.',
      'Nunca destrance os fios da CAN nem estenda so um deles. Perdendo a trancagem, o carro passa a dar falhas aleatorias com o motor rodando.',
    ],
    camDist: 13,
    parts: [
      { partId: 'can-bus', pos: [0, 0, 0], scale: 1.0 },
      { partId: 'ecu', pos: [-3.4, 2.6, 0], scale: 1.0, dim: true, labelPt: 'ECU do motor', labelAt: [-3.4, 3.8, 0] },
      {
        partId: 'immobilizer-antenna',
        pos: [-3.4, -2.8, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Imobilizador',
        labelAt: [-3.4, -3.9, 0],
      },
      {
        partId: 'mil-lamp',
        pos: [3.4, 2.6, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Painel',
        labelAt: [3.4, 3.8, 0],
      },
      {
        partId: 'obd-connector',
        pos: [3.4, -2.8, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Diagnostico OBD2',
        labelAt: [3.4, -3.9, 0],
      },
    ],
    boxes: [
      { pos: [-5.0, 0, 0], size: [0.35, 0.7, 0.35], color: '#2b313d' },
      { pos: [5.0, 0, 0], size: [0.35, 0.7, 0.35], color: '#2b313d' },
    ],
    pipes: [
      {
        points: [
          [-5.0, 0.13, 0],
          [-2.05, 0.13, 0],
        ],
        r: 0.06,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.36,
        labelPt: 'CAN H',
        labelAt: [-3.4, 0.7, 0],
      },
      {
        points: [
          [2.05, 0.13, 0],
          [5.0, 0.13, 0],
        ],
        r: 0.06,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.36,
      },
      {
        points: [
          [-2.05, -0.13, 0],
          [-5.0, -0.13, 0],
        ],
        r: 0.06,
        color: '#b09a3a',
        flow: ELEC,
        flowSpeed: 0.36,
        labelPt: 'CAN L',
        labelAt: [-3.4, -0.75, 0],
      },
      {
        points: [
          [5.0, -0.13, 0],
          [2.05, -0.13, 0],
        ],
        r: 0.06,
        color: '#b09a3a',
        flow: ELEC,
        flowSpeed: 0.36,
      },
      {
        points: [
          [-3.4, 0.13, 0],
          [-3.4, 2.05, 0],
        ],
        r: 0.05,
        color: '#8a6d10',
      },
      {
        points: [
          [-3.4, -0.13, 0],
          [-3.4, -2.25, 0],
        ],
        r: 0.05,
        color: '#8a6d10',
      },
      {
        points: [
          [3.4, 0.13, 0],
          [3.4, 2.0, 0],
        ],
        r: 0.05,
        color: '#8a6d10',
      },
      {
        points: [
          [3.4, -0.13, 0],
          [3.4, -2.42, 0],
        ],
        r: 0.05,
        color: '#8a6d10',
      },
    ],
    labels: [
      { textPt: '120 ohm', pos: [-5.0, 1.1, 0] },
      { textPt: '120 ohm', pos: [5.0, 1.1, 0] },
      { textPt: 'o par trancado: os dois juntos medem 60 ohm', pos: [1.4, 0.95, 0] },
    ],
  },

  // ---------------------------------------------------------------- 8
  8: {
    oneLinePt:
      'A valvula que a ECU abre para o motor chupar o vapor guardado no canister e queimar junto com a mistura.',
    bodyPt: [
      'O canister enche de vapor com o carro parado. Alguem precisa esvaziar ele, senao satura e para de segurar gasolina. Quem esvazia e a valvula de purga.',
      'Ela fica entre o canister e o coletor de admissao. De um lado tem o vapor guardado; do outro tem o vacuo do motor. Basta abrir que o motor chupa.',
      'So que nao pode abrir a qualquer hora. Aquele vapor e combustivel, e entra sem a ECU ter medido. Se abrir com o motor frio ou em marcha lenta cheia, a mistura enriquece de repente e o motor treme ou morre.',
      'Por isso a ECU so libera a purga com condicao: motor ja quente, sonda lambda trabalhando em malha fechada, rotacao e carga acima da marcha lenta. E mesmo assim ela abre devagar.',
      'A abertura nao e liga e desliga. E PWM: a ECU pulsa o terra da valvula numa frequencia fixa e muda o tempo ligado. 10 por cento de ciclo e um fiapo de vapor; 80 por cento e purga forte. Enquanto isso ela vigia a correcao da lambda: se a mistura enriquecer demais, ela fecha a purga na hora.',
      'A valvula e normalmente fechada. Sem energia, ela fica fechada. E de proposito: se o fio partir, o pior que acontece e o canister nao esvaziar. Se ela travasse aberta, o motor chuparia vapor direto o tempo todo.',
    ],
    contextPt:
      'Na cena estao o canister de onde vem o vapor, a valvula e a mangueira que leva para o coletor de admissao, onde o vacuo do motor faz a suceao.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '+12 V pos-chave, vindo do rele principal', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Comando por terra da ECU, pulsado em PWM', color: '#7127c9' },
    ],
    testPt: [
      'Resistencia da bobina entre os dois pinos: normalmente de 20 a 30 ohm. Aberta ou em curto, troca.',
      'Sopro pelo lado do canister com a valvula desligada: nao pode passar ar. Passou, ela esta travada aberta.',
      'Valvula travada aberta da marcha lenta oscilando, motor morrendo ao parar no semaforo e cheiro de combustivel. E um dos defeitos mais mal diagnosticados que existe.',
      'No scanner de um lado, com o motor quente em marcha lenta, force a purga para 100 por cento: a rotacao tem que mexer. Nao mexeu nada, a valvula ou a mangueira estao entupidas.',
      'Codigo de sistema EVAP nao quer dizer valvula ruim. Pode ser tampa do tanque mal fechada, e isso e o caso mais comum de todos.',
    ],
    camDist: 11,
    parts: [
      { partId: 'purge-valve', pos: [0, 0, 0], scale: 1.6 },
      {
        partId: 'canister',
        pos: [-4.4, 0, 0],
        scale: 1.2,
        dim: true,
        labelPt: 'Canister: vapor guardado',
        labelAt: [-4.4, -1.6, 0],
      },
      { partId: 'ecu', pos: [0, 3.3, 0], scale: 0.85, dim: true, labelPt: 'ECU comanda o terra', labelAt: [0, 4.3, 0] },
    ],
    boxes: [
      {
        pos: [4.9, 0, 0],
        size: [0.6, 2.2, 1.4],
        color: '#3d4657',
        labelPt: 'Coletor de admissao: aqui tem vacuo',
        labelAt: [5.0, -1.7, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-3.86, 1.26, 0],
          [-3.86, 2.4, 0],
          [-1.58, 2.4, 0],
          [-1.58, 0, 0],
          [-0.9, 0, 0],
        ],
        r: 0.1,
        color: HOSE,
        flow: '#e08a1e',
        flowSpeed: 0.14,
      },
      {
        points: [
          [0.9, 0, 0],
          [4.55, 0, 0],
        ],
        r: 0.1,
        color: HOSE,
        flow: '#e08a1e',
        flowSpeed: 0.2,
        labelPt: 'o vacuo do motor puxa o vapor',
        labelAt: [2.7, -1.2, 0],
      },
      {
        points: [
          [0, 2.83, 0],
          [0, 1.45, 0],
        ],
        r: 0.06,
        color: '#7127c9',
        labelPt: 'PWM',
        labelAt: [0.8, 2.1, 0],
      },
    ],
    labels: [{ textPt: 'sem energia ela fica fechada', pos: [0, -1.7, 0] }],
  },

  // ---------------------------------------------------------------- 9
  9: {
    oneLinePt:
      'A borboleta que controla quanto ar entra no motor. Hoje ela e eletrica: nao existe mais cabo do pedal ate ela.',
    bodyPt: [
      'No sistema antigo o pedal puxava um cabo de aco que abria a borboleta. Pisou, abriu. Simples e direto, mas a ECU nao tinha como discordar de voce.',
      'No EGAS, que e o que esta na cena, o pedal nao puxa nada. O pedal so tem sensores. Eles contam para a ECU quanto voce pisou, a ECU decide quanto abrir, e um motor eletrico dentro do corpo de borboleta faz o movimento.',
      'Parece complicacao, mas ganhou muita coisa: a ECU controla a marcha lenta sem valvula auxiliar, faz o controle de tracao fechar a borboleta sozinha, protege o motor, ajusta o aquecimento e conversa com o cambio automatico na troca de marcha.',
      'Como agora e um computador que decide se o motor acelera, tudo aqui e duplicado. O pedal tem dois sensores e a borboleta tem dois sensores. Eles trabalham com rampas diferentes de proposito: um sobe de 0,5 para 4,5 V e o outro faz o caminho contrario, ou trabalha na metade do valor.',
      'A ECU compara os dois o tempo todo. Se as duas leituras deixarem de bater entre si, ela nao arrisca: entra em modo de emergencia, prende a borboleta perto da marcha lenta e o carro anda so o suficiente para sair da rua. E a famosa luz amarela com o carro sem forca.',
      'Dentro do corpo ainda tem uma mola forte que puxa a borboleta para uma posicao de seguranca, um pouco aberta. Se acabar a energia, o motor nao morre no meio da pista e nem fica acelerado.',
    ],
    contextPt:
      'Na cena estao o duto de ar chegando, o pedal com os dois sensores, a ECU no meio decidindo e o corpo de borboleta com o motor eletrico.',
    pinsPt: [
      { pinPt: 'Motor +', whatPt: 'Comando do motor eletrico da borboleta, ponte H', color: WIRE_RED },
      { pinPt: 'Motor -', whatPt: 'O outro lado da ponte. A ECU inverte para fechar', color: WIRE_BLACK },
      { pinPt: '5 V', whatPt: 'Referencia para os dois sensores de posicao', color: WIRE_RED },
      { pinPt: 'Terra', whatPt: 'Terra de sinal dos sensores', color: WIRE_BLACK },
      { pinPt: 'TPS 1', whatPt: 'Posicao da borboleta, sobe com a abertura', color: WIRE_SIGNAL },
      { pinPt: 'TPS 2', whatPt: 'Segunda leitura, com rampa oposta ou pela metade', color: '#7127c9' },
    ],
    testPt: [
      'Chave ligada, motor parado: os dois sinais de posicao tem que se mexer juntos e sem degrau ao abrir a borboleta na mao (com o carro em modo de teste).',
      'Sinal com salto, buraco ou ponto morto no meio do curso e pista gasta. Da falha de aceleracao sempre no mesmo ponto do pedal.',
      'A resistencia do motor da borboleta e baixa, normalmente de 1 a 5 ohm. Aberto e motor queimado.',
      'Corpo sujo de carvao trava a borboleta e engana o aprendizado da marcha lenta. Limpe com produto proprio e sem forcar a borboleta com o motor eletrico ligado.',
      'Depois de limpar ou trocar, e obrigatorio fazer o aprendizado da posicao fechada pelo scanner. Sem isso a marcha lenta fica alta ou o carro morre.',
      'Modo de emergencia (carro pesado, sem forca, luz acesa): olhe primeiro a coerencia entre os dois sinais do pedal e os dois da borboleta.',
    ],
    camDist: 13,
    parts: [
      { partId: 'throttle-body', pos: [2.6, 0, 0], scale: 1.5 },
      {
        partId: 'app-sensor',
        pos: [-5.0, -1.4, 0],
        scale: 1.1,
        dim: true,
        labelPt: 'Pedal do acelerador',
        labelAt: [-5.0, -2.9, 0],
      },
      { partId: 'ecu', pos: [-1.2, 3.2, 0], scale: 0.9, dim: true, labelPt: 'ECU decide a abertura', labelAt: [-1.2, 4.3, 0] },
    ],
    boxes: [
      {
        pos: [6.4, 0, 0],
        size: [0.6, 2.2, 1.4],
        color: '#3d4657',
        labelPt: 'Coletor de admissao',
        labelAt: [6.4, -1.7, 0],
      },
    ],
    pipes: [
      {
        points: [
          [0.4, 0, 0],
          [1.28, 0, 0],
        ],
        r: 0.36,
        color: METAL_PIPE,
        labelPt: 'ar entra',
        labelAt: [0.4, 1.7, 0],
      },
      {
        points: [
          [3.93, 0, 0],
          [6.1, 0, 0],
        ],
        r: 0.36,
        color: METAL_PIPE,
      },
      {
        points: [
          [0.4, 0, 0],
          [6.1, 0, 0],
        ],
        r: 0.36,
        color: METAL_PIPE,
        tube: false,
        flow: '#1d5fd8',
        flowSpeed: 0.18,
        gated: true,
      },
      {
        points: [
          [-3.7, -1.4, 0],
          [-2.4, -1.4, 0],
          [-2.4, 3.2, 0],
          [-2.15, 3.2, 0],
        ],
        r: 0.06,
        color: WIRE_SIGNAL,
        labelPt: 'dois sinais do pedal',
        labelAt: [-3.6, -2.9, 0],
      },
      {
        points: [
          [-0.05, 3.2, 0],
          [2.6, 3.2, 0],
          [2.6, 1.45, 0],
        ],
        r: 0.06,
        color: '#7127c9',
        labelPt: 'motor eletrico e as duas leituras de volta',
        labelAt: [4.3, 2.6, 0],
      },
    ],
    labels: [
      { textPt: 'nao existe cabo do pedal ate a borboleta', pos: [-1.2, -3.9, 0] },
      { textPt: 'tudo duplicado: se os dois nao baterem, entra em emergencia', pos: [2.6, -2.4, 0] },
    ],
  },

  // ---------------------------------------------------------------- 10
  10: {
    oneLinePt:
      'A bomba mecanica movida pelo comando de valvulas que pega o combustivel a 5 bar e joga na flauta a mais de 100 bar.',
    bodyPt: [
      'Na injecao direta o injetor pulveriza dentro da camara, e na camara ja tem a pressao da compressao. Para o jato entrar e virar nevoa fina, ele precisa chegar com pressao muito maior. Bomba eletrica nenhuma dentro do tanque faz isso.',
      'Por isso existem duas bombas em serie. A eletrica do tanque manda combustivel a uns 4 ou 5 bar ate o motor; essa aqui, mecanica, pega esses 5 bar e transforma em 100, 200, em alguns motores 350 bar.',
      'Ela e um pistao. O comando de valvulas tem um ressalto extra, so para ela, e esse ressalto empurra um tucho que empurra o pistao. Cada volta do comando da varios bombeamentos. Por isso a pressao do sistema depende da rotacao do motor.',
      'Se ela bombeasse tudo o tempo todo, a pressao ia explodir. Quem segura e a valvula reguladora de volume na entrada: a ECU comanda ela e escolhe quanto combustivel deixa entrar no pistao a cada golpe. Menos entrada, menos pressao.',
      'A ECU trabalha em circuito fechado: o sensor de pressao da flauta le o valor real, ela compara com o alvo do mapa e corrige a valvula reguladora. Em partida a frio ela pede pressao baixa; acelerando forte ela pede o maximo.',
      'Como e movida por ressalto do comando, o desgaste do tucho e um ponto de atencao real. Tucho comido faz barulho de batida no cabecote e derruba a pressao.',
    ],
    contextPt:
      'Na cena estao o comando de valvulas com o ressalto que aciona a bomba, a linha de baixa pressao que vem do tanque e a linha de alta que vai para a flauta.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '+12 V para a valvula reguladora de volume', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Comando por terra da ECU, controla a pressao', color: '#7127c9' },
    ],
    testPt: [
      'Pressao de baixa antes dela: de 4 a 6 bar. Se ja chega fraco, o problema esta na bomba do tanque ou no filtro, e nao aqui.',
      'Pressao de alta na partida: precisa subir rapido para algo entre 40 e 60 bar so para o motor pegar. Se demora, da partida longa a frio.',
      'Pressao de alta com o motor rodando: acompanhe o valor alvo e o valor real no scanner ao mesmo tempo. Real sempre abaixo do alvo com a valvula no maximo e bomba gasta.',
      'Barulho de batida ritmada no cabecote junto com falta de pressao aponta tucho ou ressalto do comando desgastado.',
      'CUIDADO: a linha de alta pressao continua pressurizada com o motor desligado. Nunca abra uma conexao sem despressurizar pelo scanner e sem esperar.',
      'Todo o combustivel passa por ela. Combustivel sujo ou adulterado risca o pistao dela primeiro, e ai vai metal para os injetores.',
    ],
    camDist: 13,
    parts: [
      { partId: 'hp-fuel-pump', pos: [0, 0.6, 0], scale: 1.5 },
      { partId: 'camshaft', pos: [0, -2.1, 0], scale: 1.6, dim: true, labelPt: 'Comando de valvulas', labelAt: [-2.6, -2.1, 0] },
      {
        partId: 'fuel-rail-gdi',
        pos: [5.0, 0.7, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Flauta de alta pressao',
        labelAt: [5.0, 2.3, 0],
      },
      {
        partId: 'fuel-pump-module',
        pos: [-5.2, -2.6, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Bomba do tanque',
        labelAt: [-5.2, -4.0, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-5.2, -1.5, 0],
          [-5.2, 0.68, 0],
          [-1.6, 0.68, 0],
        ],
        r: 0.11,
        color: FUEL_PIPE,
        flow: '#e08a1e',
        flowSpeed: 0.12,
        labelPt: 'baixa pressao: 5 bar',
        labelAt: [-3.6, 1.4, 0],
      },
      {
        points: [
          [1.6, 0.7, 0],
          [4.0, 0.7, 0],
        ],
        r: 0.09,
        color: '#96a3b5',
        flow: '#e08a1e',
        flowSpeed: 0.28,
        labelPt: 'alta pressao: mais de 100 bar',
        labelAt: [2.8, -1.4, 0],
      },
      {
        points: [
          [0, -1.7, 0],
          [0, -0.9, 0],
        ],
        r: 0.13,
        color: '#8d97a8',
        labelPt: 'tucho',
        labelAt: [0.9, -1.3, 0],
      },
    ],
    labels: [
      { textPt: 'o ressalto do comando empurra o pistao da bomba por baixo', pos: [0, -3.3, 0] },
      { textPt: 'a valvula reguladora escolhe quanto entra: e assim que a pressao e controlada', pos: [-0.4, 3.1, 0] },
    ],
  },

  // ---------------------------------------------------------------- 11
  11: {
    oneLinePt:
      'Mede a pressao absoluta dentro do coletor de admissao. E por ela que a ECU sabe o quanto o motor esta carregado.',
    bodyPt: [
      'O motor aspirado e uma bomba de vacuo. Em marcha lenta a borboleta esta quase fechada, os pistoes puxam e nao entra ar suficiente: a pressao la dentro cai bem abaixo da atmosferica. Pisando fundo a borboleta abre e a pressao sobe quase ate a atmosferica.',
      'Ou seja: a pressao no coletor e um retrato direto da carga do motor. Pouco vacuo, motor carregado, precisa de mais combustivel. Muito vacuo, motor aliviado.',
      'Ele mede pressao ABSOLUTA, e nao pressao relativa. Zero para ele e vacuo total, nao a pressao do ambiente. Por isso, com a chave ligada e o motor parado, ele le a pressao atmosferica: cerca de 101 kPa no nivel do mar e uns 90 kPa numa cidade alta.',
      'Por dentro tem um diafragma de silicio com resistores impressos. A pressao entorta o diafragma, os resistores mudam de valor e o circuito devolve tensao proporcional: perto de 0,5 V com muito vacuo e perto de 4,5 V com o coletor cheio.',
      'Em motor turbo ele e ainda mais importante, porque tambem mede a pressao positiva do turbo, e ai passa dos 100 kPa. Muitos ja vem com o sensor de temperatura do ar junto no mesmo corpo.',
      'Ele e a alternativa ao MAF, e alguns motores tem os dois. A vantagem dele e que ele nao sofre com entrada de ar falsa depois da borboleta: qualquer ar que entra ele enxerga, porque ele mede a pressao do que realmente esta dentro do coletor.',
    ],
    contextPt:
      'Na cena estao o coletor de admissao com a borboleta antes dele e a tomada de vacuo onde o sensor e rosqueado.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '5 V de referencia vindos da ECU', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Terra de sinal, sempre o da ECU e nao o da carroceria', color: WIRE_BLACK },
      { pinPt: 'Fio 3', whatPt: 'Sinal de pressao, de 0,5 a 4,5 V', color: WIRE_SIGNAL },
      { pinPt: 'Fio 4', whatPt: 'Quando tem: sinal do sensor de temperatura do ar junto', color: '#7127c9' },
    ],
    testPt: [
      'Chave ligada, motor parado: tem que ler a pressao atmosferica, algo entre 95 e 102 kPa (4,5 V aproximadamente). Se ja mostra 40 kPa parado, o sensor esta mentindo.',
      'Marcha lenta com motor bom: de 25 a 40 kPa, ou 0,9 a 1,5 V. Valor alto demais em marcha lenta aponta entrada de ar falsa ou valvula EGR travada aberta.',
      'Acelerando de uma vez a leitura tem que ir quase ate a atmosferica e voltar rapido. Resposta lenta e mangueira de vacuo com sujeira ou sensor viciado.',
      'Confira a mangueira de vacuo antes do sensor. Mangueira ressecada, trincada ou entupida da o mesmo sintoma de sensor ruim e e muito mais comum.',
      'Referencia de 5 V fora da faixa de 4,9 a 5,1 V nao e defeito do MAP: e problema na alimentacao da ECU ou outro sensor em curto puxando a referencia.',
    ],
    camDist: 11,
    parts: [
      { partId: 'map-sensor', pos: [0, 1.5, 0], scale: 1.6 },
      {
        partId: 'throttle-body',
        pos: [-4.6, -0.9, 0],
        scale: 1.2,
        dim: true,
        labelPt: 'Borboleta',
        labelAt: [-4.6, 0.9, 0],
      },
    ],
    boxes: [
      {
        pos: [0.6, -1.2, 0],
        size: [5.2, 1.1, 1.6],
        color: '#3d4657',
        labelPt: 'Coletor de admissao',
        labelAt: [0.6, -2.3, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-3.4, -0.9, 0],
          [-2.0, -0.9, 0],
        ],
        r: 0.3,
        color: METAL_PIPE,
        flow: '#1d5fd8',
        flowSpeed: 0.18,
      },
      {
        points: [
          [0, -0.65, 0],
          [0, 0.9, 0],
        ],
        r: 0.07,
        color: HOSE,
        labelPt: 'tomada de vacuo',
        labelAt: [1.9, 0.15, 0],
      },
    ],
    labels: [
      { textPt: 'marcha lenta: muito vacuo, cerca de 30 kPa', pos: [-2.4, 3.0, 0] },
      { textPt: 'pe no fundo: quase a atmosferica, cerca de 95 kPa', pos: [3.0, 3.0, 0] },
      { textPt: 'chave ligada e motor parado ele le a pressao do ambiente', pos: [0.6, -3.4, 0] },
    ],
  },

  // ---------------------------------------------------------------- 12
  12: {
    oneLinePt:
      'A valvula que pega um pouco do gas que ja foi queimado e devolve para dentro do motor. Serve para baixar a temperatura da queima e cortar o NOx.',
    bodyPt: [
      'Para entender a EGR primeiro tem que entender o NOx. O ar que o motor respira e quase 78 por cento de nitrogenio. Em temperatura normal esse nitrogenio nao reage com nada, ele so passa. Mas acima de mais ou menos 1600 graus dentro da camara ele comeca a se juntar com o oxigenio e forma oxido de nitrogenio, o NOx.',
      'NOx e um poluente serio: e ele que faz a nevoa marrom das cidades grandes e a chuva acida. E o catalisador de tres vias nao consegue tratar NOx direito quando o motor roda com mistura pobre. Entao a saida e nao deixar ele se formar.',
      'A receita e simples: se o NOx nasce do calor, entao abaixe o calor da queima. E foi ai que veio a ideia da EGR.',
      'O gas que sai do escapamento ja foi queimado. Ele quase nao tem oxigenio e e cheio de gas carbonico e vapor de agua. Se voce mistura um pouco desse gas com o ar limpo que entra, a camara fica com menos oxigenio por volume e, principalmente, com muito mais massa de gas que absorve calor sem queimar.',
      'Resultado: a mesma queima acontece, mas espalhada e mais fria. A temperatura de pico cai algumas centenas de graus, e a formacao de NOx despenca. Uma taxa de 5 a 15 por cento de recirculacao ja corta a maior parte.',
      'Tem bonus: com a EGR aberta em carga parcial, a ECU pode abrir mais a borboleta para o motor puxar a mesma quantidade de ar. Menos vacuo no coletor e menos esforco para respirar, o que economiza combustivel.',
      'E tem hora certa. A ECU NUNCA abre a EGR com o motor frio, nem em marcha lenta, nem com o pe no fundo. Frio ela faria o motor tremer; em lenta o motor morreria; em plena carga voce quer todo o oxigenio possivel para ter potencia. Ela trabalha na faixa do meio, que e onde o carro passa a maior parte do tempo.',
      'O caminho e sempre esse: pega o gas quente logo na saida do coletor de escape, passa pela valvula e joga no coletor de admissao, depois da borboleta. Em muitos motores tem um radiador de EGR no meio, para o gas chegar mais frio ainda.',
    ],
    contextPt:
      'Na cena esta o cilindro em corte de onde sai o gas queimado, o coletor de escape, a valvula EGR, o tubo que volta para a admissao e o resto do escapamento indo para o catalisador. As bolinhas vermelhas sao os gases queimados.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '+12 V pos-chave para o motor da valvula', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Comando da ECU, PWM ou motor de passo', color: '#7127c9' },
      { pinPt: 'Fio 3', whatPt: '5 V de referencia para o sensor de posicao interno', color: WIRE_RED },
      { pinPt: 'Fio 4', whatPt: 'Sinal de posicao: a ECU confere se ela abriu mesmo', color: WIRE_SIGNAL },
      { pinPt: 'Fio 5', whatPt: 'Terra de sinal', color: WIRE_BLACK },
    ],
    testPt: [
      'EGR travada ABERTA: motor treme em marcha lenta, morre no semaforo, falha na partida a frio e MAP alto demais em lenta. E o defeito mais comum, quase sempre por carvao.',
      'EGR travada FECHADA: o motor roda liso, mas da codigo de fluxo insuficiente e o consumo sobe. Em diesel ainda aparece detonacao e mais NOx.',
      'Teste facil: motor quente em marcha lenta, force a abertura da EGR pelo scanner. A rotacao TEM que cair ou o motor engasgar. Se nao mudou nada, o duto esta entupido de carvao.',
      'Compare o sinal de posicao com o comando no scanner. A ECU manda 40 por cento e o sensor responde 5 por cento? Ela esta emperrada.',
      'O acumulo de fuligem e normal no duto. Limpar resolve muito caso que seria trocado a toa. Em motor de injecao direta o carvao tambem sobe para a valvula de admissao, porque nao tem gasolina lavando ela.',
      'Nunca simplesmente tampe a EGR. O motor anda, mas voce joga o NOx todo para fora, quebra o catalisador com o tempo e o carro reprova na inspecao.',
    ],
    camDist: 15,
    camTarget: [0, 0.2, 0],
    parts: [
      { partId: 'egr-valve', pos: [0, 3.0, 0], scale: 1.5, titleAt: [3.4, 3.4, 0] },
      {
        partId: 'catalytic-converter',
        pos: [5.4, -3.6, 0],
        scale: 0.8,
        rot: [0, 0, Math.PI / 2],
        dim: true,
        labelPt: 'Catalisador',
        labelAt: [7.0, -3.6, 0],
      },
    ],
    boxes: [
      {
        pos: [-4.6, -1.2, 0],
        size: [2.6, 3.4, 2.2],
        color: '#3d4657',
        labelPt: 'Cilindro: e aqui que o gas queimado nasce',
        labelAt: [-4.6, -3.4, 0],
      },
      { pos: [-4.6, -1.2, 1.15], size: [1.3, 2.4, 0.06], glass: true },
      {
        pos: [-0.6, 0.6, 0],
        size: [4.6, 0.9, 1.2],
        color: '#5a5045',
        labelPt: 'Coletor de escape',
        labelAt: [1.2, -0.6, 0],
      },
      {
        pos: [-0.6, 5.4, 0],
        size: [5.2, 0.9, 1.2],
        color: '#3d4657',
        labelPt: 'Coletor de admissao: ar limpo mais o gas de volta',
        labelAt: [-0.6, 6.5, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-4.6, 0.5, 0],
          [-4.6, 0.6, 0],
          [-2.9, 0.6, 0],
        ],
        r: 0.22,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.2,
      },
      {
        points: [
          [1.7, 0.6, 0],
          [5.4, 0.6, 0],
          [5.4, -2.2, 0],
        ],
        r: 0.22,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.2,
        labelPt: 'o resto vai embora pelo escapamento',
        labelAt: [7.2, -0.8, 0],
      },
      {
        points: [
          [0, 0.6, 0],
          [0, 2.15, 0],
        ],
        r: 0.16,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.14,
        labelPt: 'o gas entra por baixo, pelo flange',
        labelAt: [2.4, 1.5, 0],
      },
      {
        points: [
          [0, 2.78, 0.85],
          [0, 2.78, 1.9],
          [-2.6, 2.78, 1.9],
          [-2.6, 5.4, 1.9],
          [-2.6, 5.4, 0.55],
        ],
        r: 0.16,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.14,
        labelPt: 'e volta para a admissao',
        labelAt: [-3.6, 3.4, 1.9],
      },
      {
        points: [
          [-6.6, 5.4, 0],
          [-3.4, 5.4, 0],
        ],
        r: 0.28,
        color: METAL_PIPE,
        flow: '#1d5fd8',
        flowSpeed: 0.18,
        labelPt: 'ar limpo',
        labelAt: [-6.2, 6.2, 0],
      },
      {
        points: [
          [-4.6, 4.9, 0],
          [-4.6, 0.5, 0],
        ],
        r: 0.14,
        color: '#4a5364',
        labelPt: 'entra no cilindro',
        labelAt: [-6.1, 3.0, 0],
      },
    ],
    labels: [
      { textPt: 'acima de 1600 graus o nitrogenio do ar vira NOx', pos: [-4.6, -4.4, 0] },
      { textPt: 'gas queimado nao queima de novo: ele so absorve calor e esfria a queima', pos: [0.4, -5.4, 0] },
    ],
  },

  // ---------------------------------------------------------------- 13
  13: {
    oneLinePt:
      'Le a pressao real de combustivel dentro da flauta de alta. E o retorno que permite a ECU controlar a bomba de alta.',
    bodyPt: [
      'Na injecao direta a pressao nao e fixa. Ela muda o tempo todo conforme a rotacao, a carga e a temperatura do motor: uns 40 bar na partida, 60 em marcha lenta, e ate 200 ou mais com o pe no fundo.',
      'Se a pressao muda, o tempo de injecao tambem tem que mudar. A mesma abertura de 1 milissegundo a 50 bar entrega muito menos combustivel que a 200 bar. Sem saber a pressao real, a ECU nao consegue calcular a massa injetada.',
      'E ai que entra este sensor. Ele fica rosqueado na propria flauta e le a pressao la dentro, o tempo todo. Por dentro e o mesmo principio do MAP: uma membrana de aco com resistores colados, que muda de resistencia quando entorta.',
      'Com esse valor a ECU faz duas coisas ao mesmo tempo. Corrige o tempo de abertura de cada injetor e ajusta a valvula reguladora da bomba de alta para segurar a pressao no alvo. E um controle em malha fechada, igual ao da lambda mas para pressao.',
      'A precisao dele e critica. Se ele le 20 por cento a menos do que a pressao real, a ECU manda a bomba subir a pressao e injeta com o tempo errado. Da para quebrar o sistema por causa disso.',
      'Ele trabalha em uma faixa alta e com pouca resolucao embaixo, entao um sensor que parece ok em marcha lenta pode errar feio em plena carga.',
    ],
    contextPt:
      'Na cena estao a flauta de alta pressao onde ele e rosqueado, os injetores pendurados nela e a linha vindo da bomba de alta.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '5 V de referencia da ECU', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Terra de sinal', color: WIRE_BLACK },
      { pinPt: 'Fio 3', whatPt: 'Sinal de pressao, tipicamente de 0,5 a 4,5 V', color: WIRE_SIGNAL },
    ],
    testPt: [
      'Chave ligada, motor parado e sistema despressurizado: o sinal tem que ficar perto de 0,5 V (pressao zero). Se marca 1,5 V com o sistema aliviado, o sensor esta viciado.',
      'No scanner acompanhe pressao alvo e pressao real juntas. Elas tem que andar coladas em qualquer rotacao.',
      'Real sempre abaixo do alvo: pode ser bomba de alta gasta, injetor vazando ou este sensor mentindo. Um manometro de alta resolve a duvida.',
      'Partida longa a frio com pressao demorando a subir e classico de injetor vazando internamente, e nao do sensor.',
      'CUIDADO ao remover: a flauta guarda pressao mesmo com o motor desligado por horas. Despressurize pelo scanner antes.',
    ],
    camDist: 12,
    camTarget: [0.2, 0.3, 0],
    parts: [
      { partId: 'rail-pressure-sensor', pos: [-0.6, 2.05, 0], scale: 1.6 },
      { partId: 'fuel-rail-gdi', pos: [0.4, 0, 0], scale: 1.1, dim: true, labelPt: 'Flauta de alta', labelAt: [3.4, 0.9, 0] },
      { partId: 'injector-gdi', pos: [-1.4, -1.9, 0], scale: 0.9, dim: true },
      { partId: 'injector-gdi', pos: [0.6, -1.9, 0], scale: 0.9, dim: true },
      { partId: 'injector-gdi', pos: [2.6, -1.9, 0], scale: 0.9, dim: true, labelPt: 'Injetores', labelAt: [4.4, -2.4, 0] },
      {
        partId: 'hp-fuel-pump',
        pos: [-5.4, 0, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Bomba de alta',
        labelAt: [-5.4, 1.4, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-4.6, 0, 0],
          [-1.35, 0, 0],
        ],
        r: 0.09,
        color: '#96a3b5',
        flow: '#e08a1e',
        flowSpeed: 0.26,
      },
    ],
    labels: [
      { textPt: 'a pressao muda o tempo todo: de 40 a mais de 200 bar', pos: [3.0, 3.2, 0] },
      { textPt: 'sem a pressao real a ECU nao sabe quanto combustivel saiu do injetor', pos: [0.4, -3.7, 0] },
    ],
  },

  // ---------------------------------------------------------------- 14
  14: {
    oneLinePt:
      'O tubo de aco forjado que segura o combustivel a alta pressao e distribui igual para todos os injetores.',
    bodyPt: [
      'A flauta e um acumulador. A bomba de alta bombeia em golpes, um por ressalto do comando; os injetores abrem em outros momentos. Se um estivesse ligado direto no outro, a pressao pularia a cada golpe e a cada injecao.',
      'O volume interno da flauta amortece isso. Ela guarda combustivel sob pressao e entrega para os quatro injetores com a mesma pressao, no cilindro 1 e no cilindro 4 igual. Distribuicao desigual daria mistura diferente entre cilindros.',
      'Na injecao direta ela e uma peca de seguranca. Trabalha com 100, 200, em alguns casos 350 bar. Por isso e aco forjado e nao aluminio fundido, as conexoes sao conicas de metal contra metal, e nao tem mangueira nenhuma: so tubo rigido.',
      'Repare que ela nao tem retorno. Na injecao indireta antiga existia um regulador com mangueira de volta para o tanque. Aqui nao: a pressao e controlada la na entrada da bomba, escolhendo quanto combustivel entra. Menos combustivel circulando e menos aquecimento.',
      'Nela ficam pendurados o sensor de pressao e, dependendo do motor, uma valvula de alivio mecanica de seguranca que abre se a pressao passar do limite.',
      'A regra de ouro na oficina: parafuso e tubo de alta pressao sao de uso unico em muitos motores. O cone de vedacao se deforma no aperto. Reaproveitar tubo e receita para vazamento de combustivel a 200 bar em cima de um motor quente.',
    ],
    contextPt:
      'Na cena estao a linha de alta vinda da bomba, o sensor de pressao em cima e os injetores pendurados embaixo, um por cilindro.',
    testPt: [
      'Vazamento na flauta e emergencia. Combustivel a 200 bar vira nevoa e pega fogo facil em contato com o coletor de escape.',
      'Antes de abrir qualquer conexao, despressurize pelo scanner e espere. A pressao nao cai sozinha rapido.',
      'Teste de queda: pressurize e desligue o motor observando a pressao no scanner. Se ela despenca em poucos segundos, tem injetor vazando ou vedacao ruim.',
      'Nunca teste vazamento de alta pressao com a mao. O jato atravessa a pele.',
      'Nao tem retorno: se voce procura mangueira de volta ao tanque numa injecao direta, ela nao existe.',
    ],
    camDist: 12,
    parts: [
      { partId: 'fuel-rail-gdi', pos: [0, 0.6, 0], scale: 1.5, titleAt: [2.6, 2.3, 0] },
      {
        partId: 'rail-pressure-sensor',
        pos: [-1.4, 2.08, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Sensor de pressao',
        labelAt: [-3.6, 2.6, 0],
      },
      { partId: 'injector-gdi', pos: [-2.7, -1.8, 0], scale: 1.0, dim: true },
      { partId: 'injector-gdi', pos: [-0.9, -1.8, 0], scale: 1.0, dim: true },
      { partId: 'injector-gdi', pos: [0.9, -1.8, 0], scale: 1.0, dim: true },
      {
        partId: 'injector-gdi',
        pos: [2.7, -1.8, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Um injetor por cilindro',
        labelAt: [4.6, -2.2, 0],
      },
      {
        partId: 'hp-fuel-pump',
        pos: [-5.6, 0.6, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Bomba de alta',
        labelAt: [-5.6, 1.8, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-4.8, 0.6, 0],
          [-2.4, 0.6, 0],
        ],
        r: 0.09,
        color: '#96a3b5',
        flow: '#e08a1e',
        flowSpeed: 0.26,
        labelPt: 'tubo rigido de aco',
        labelAt: [-3.5, 2.3, 0],
      },
    ],
    labels: [
      { textPt: 'ela guarda pressao e entrega igual para todos os cilindros', pos: [0, 3.8, 0] },
      { textPt: 'nao existe mangueira de retorno para o tanque', pos: [0, -3.4, 0] },
    ],
  },

  // ---------------------------------------------------------------- 15
  15: {
    oneLinePt:
      'O injetor que pulveriza a gasolina direto dentro da camara de combustao, contra a pressao da compressao.',
    bodyPt: [
      'Na injecao indireta o injetor molha a valvula de admissao com uns 3 bar e o ar leva o combustivel para dentro. Aqui nao: o bico fica dentro do cabecote, olhando para o pistao, e tem que vencer a pressao que ja existe la dentro.',
      'Por isso ele precisa de mais de 100 bar. E por isso a abertura dele e minuscula: fracoes de milissegundo, com um curso de agulha de poucos centesimos de milimetro.',
      'A vantagem de injetar dentro e o controle. Como o combustivel nao entra pelo coletor, da para escolher a hora exata da injecao. Injetando cedo, no comeco da admissao, a gasolina espalha e forma mistura homogenea. Injetando tarde, ja perto da faisca, forma uma nuvem rica so em volta da vela e o resto da camara fica pobre. Isso e a carga estratificada, e permite rodar com muito menos combustivel em carga parcial.',
      'Tem outro ganho grande: a gasolina evapora dentro da camara e rouba calor do ar. Isso esfria a camara e permite subir a taxa de compressao um ou dois pontos sem detonar. Mais taxa e mais rendimento.',
      'A ECU nao aciona ele com 12 V simples. Um driver interno joga um pico de 60 a 90 V para arrancar a agulha rapido, e depois cai para uma corrente menor so para segurar aberta. Sem esse pico a agulha nao vence a pressao a tempo.',
      'O ponto fraco e conhecido: como nao passa gasolina lavando a valvula de admissao, o carvao do respiro do motor e da EGR gruda ali e forma crosta. Motor de injecao direta com muita cidade acumula carvao na admissao, e isso e uma limpeza de manutencao e nao um defeito.',
    ],
    contextPt:
      'Na cena estao a flauta de alta que alimenta ele, o cilindro em corte com o pistao e a vela, e o jato entrando na camara.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: 'Comando de alta tensao do driver, pico de 60 a 90 V', color: '#7127c9' },
      { pinPt: 'Fio 2', whatPt: 'Retorno do driver. Nao e um terra comum de chassi', color: WIRE_BLACK },
    ],
    testPt: [
      'NUNCA aplique 12 V direto no injetor de injecao direta para testar. Ele nao e acionado assim e voce queima a bobina.',
      'Resistencia tipica muito baixa, na faixa de 1 a 3 ohm. Bem diferente dos 12 a 16 ohm de um injetor indireto.',
      'Injetor vazando derruba a pressao com o motor desligado, da partida longa, cheiro de combustivel e lava o cilindro. O oleo do motor sobe de nivel e cheira a gasolina.',
      'Falha de combustao so num cilindro: troque a bobina com a do cilindro do lado e veja se a falha muda de lugar. Se nao mudou, o suspeito e o injetor.',
      'Ao trocar, sempre use anel de vedacao (teflon) novo e a ferramenta de calibrar o anel. Anel mal montado sopra gas de combustao para fora do cabecote.',
      'Muitos motores exigem gravar o codigo de calibracao do injetor novo na ECU. Sem isso a entrega fica desigual entre cilindros.',
    ],
    camDist: 12,
    parts: [
      { partId: 'injector-gdi', pos: [0, 1.9, 0], scale: 1.6, titleAt: [-2.9, 3.4, 0] },
      {
        partId: 'fuel-rail-gdi',
        pos: [0, 4.4, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Flauta de alta pressao',
        labelAt: [0, 5.4, 0],
      },
    ],
    boxes: [
      {
        pos: [1.2, -1.9, 0],
        size: [3.4, 3.6, 2.4],
        color: '#3d4657',
        labelPt: 'Cilindro em corte',
        labelAt: [4.6, -1.9, 0],
      },
      { pos: [1.2, -1.9, 1.25], size: [2.0, 3.0, 0.06], glass: true },
      { pos: [1.2, -3.2, 1.25], size: [1.8, 0.55, 0.1], color: '#6a7385', labelPt: 'Pistao', labelAt: [1.2, -4.2, 0] },
    ],
    pipes: [
      {
        points: [
          [0, 3.9, 0],
          [0, 2.9, 0],
        ],
        r: 0.09,
        color: '#96a3b5',
        flow: '#e08a1e',
        flowSpeed: 0.26,
      },
      {
        points: [
          [0, -0.25, 0],
          [1.6, -1.9, 0],
        ],
        r: 0.1,
        color: '#c98a3a',
        flow: '#e08a1e',
        flowSpeed: 0.4,
        labelPt: 'jato direto na camara',
        labelAt: [-2.0, -1.3, 0],
      },
    ],
    labels: [
      { textPt: 'abre em fracoes de milissegundo contra a pressao da compressao', pos: [-3.4, 2.0, 0] },
      { textPt: 'sem gasolina lavando a valvula de admissao, o carvao acumula ali', pos: [1.0, -5.0, 0] },
    ],
  },

  // ---------------------------------------------------------------- 16
  16: {
    oneLinePt:
      'Um microfone parafusado no bloco. Ele escuta a batida de pino e avisa a ECU para atrasar o ponto antes de furar o pistao.',
    bodyPt: [
      'Combustao normal e uma frente de chama que sai da vela e atravessa a camara de forma organizada, empurrando o pistao. Detonacao e outra coisa: parte da mistura no canto mais longe da vela se auto acende sozinha, por pressao e calor, antes da chama chegar.',
      'Quando isso acontece, duas frentes de chama se encontram no meio e a pressao sobe de forma violenta, com ondas de choque batendo na parede do cilindro. E dai que vem o barulho de bolinha de gude, o famoso pino batendo.',
      'Detonacao nao e chateacao, e destruicao. Ela quebra o filme de oleo da camisa, come a borda do pistao, danifica a junta do cabecote e derrete o eletrodo da vela. Alguns segundos em plena carga ja fazem estrago.',
      'O sensor e um cristal piezoeletrico com uma massa em cima. Toda vibracao do bloco aperta o cristal e ele gera uma tensao pequena, na casa dos milivolts. A detonacao vibra numa faixa bem especifica, tipicamente entre 5 e 15 kHz.',
      'A ECU faz um trabalho fino: ela nao escuta o tempo todo. Ela abre uma janela de escuta so no pedaco do giro onde a detonacao pode acontecer, logo depois da faisca, e filtra so aquela faixa de frequencia. Assim ela nao confunde detonacao com barulho de valvula ou de bomba.',
      'Detectou, ela atrasa o ponto de ignicao daquele cilindro, uns graus de cada vez, ate a batida parar. Depois vai devolvendo o avanco devagar. E por isso que um carro com gasolina ruim anda mais fraco: a ECU esta se protegendo o tempo todo.',
      'Em motor de quatro cilindros um sensor no meio do bloco costuma dar conta. Em seis ou oito cilindros usam dois, um para cada banco.',
    ],
    contextPt:
      'Na cena estao o bloco onde ele e parafusado, o cilindro em corte com a frente de chama e o cabo blindado indo para a ECU.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: 'Sinal do cristal, em milivolts de corrente alternada', color: WIRE_SIGNAL },
      { pinPt: 'Fio 2', whatPt: 'Retorno do sinal, o par trancado do primeiro', color: WIRE_BLACK },
      { pinPt: 'Malha', whatPt: 'Blindagem aterrada so no lado da ECU, contra ruido', color: WIRE_BLACK },
    ],
    testPt: [
      'O aperto e sagrado. Ele tem torque especificado, normalmente de 20 a 25 N.m, e sem arruela. Frouxo ele nao escuta o bloco; apertado demais o cristal trinca.',
      'A superficie do bloco tem que estar limpa. Tinta, ferrugem ou sujeira embaixo dele abafam a vibracao e geram codigo de sinal baixo.',
      'Teste rapido: com o motor parado e o osciloscopio no conector, de pequenas batidas com um cabo de chave de fenda perto dele. Tem que aparecer um pico de alguns centenas de milivolts.',
      'Nao pode ter continuidade entre nenhum dos pinos e o corpo do sensor.',
      'Codigo de sensor de detonacao com o carro andando fraco quase sempre e cabo rompido ou blindagem aterrada nos dois lados, pegando ruido.',
      'Se o motor bate pino e o sensor esta bom, o problema esta em outro lugar: combustivel de octanagem baixa, motor muito quente, carvao na camara aumentando a taxa ou mistura pobre demais.',
    ],
    camDist: 12,
    parts: [
      { partId: 'knock-sensor', pos: [0, -0.91, 0], scale: 1.4 },
      { partId: 'ecu', pos: [5.2, 2.4, 0], scale: 0.9, dim: true, labelPt: 'ECU atrasa o ponto', labelAt: [5.2, 3.6, 0] },
    ],
    boxes: [
      {
        pos: [-0.4, -2.6, 0],
        size: [6.6, 2.2, 2.2],
        color: '#3d4657',
        labelPt: 'Bloco do motor',
        labelAt: [-0.4, -4.1, 0],
      },
      { pos: [-3.4, 2.0, 0], size: [2.6, 3.2, 2.0], color: '#3d4657' },
      { pos: [-3.4, 2.0, 1.05], size: [1.5, 2.4, 0.06], glass: true, labelPt: 'Camara', labelAt: [-5.6, 2.0, 0] },
      { pos: [-3.4, 2.9, 1.05], size: [0.7, 0.5, 0.1], color: '#c98a3a' },
    ],
    pipes: [
      {
        points: [
          [2.55, -0.91, 0],
          [3.2, -0.91, 0],
          [3.2, 2.4, 0],
          [4.2, 2.4, 0],
        ],
        r: 0.07,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'cabo blindado: sinal de poucos milivolts',
        labelAt: [5.25, -1.0, 0],
      },
    ],
    labels: [
      { textPt: 'a batida vibra o bloco entre 5 e 15 kHz', pos: [0.8, 0.5, 0] },
      { textPt: 'duas frentes de chama se encontrando: e isso que quebra pistao', pos: [-3.4, 4.4, 0] },
      { textPt: 'ouviu detonacao, a ECU atrasa o ponto e depois devolve devagar', pos: [1.6, -5.2, 0] },
    ],
  },

  // ---------------------------------------------------------------- 17
  17: {
    oneLinePt:
      'Le a roda dentada do virabrequim. E o sensor mais importante do motor: sem ele a ECU nao injeta e nao da faisca.',
    bodyPt: [
      'A ECU precisa saber duas coisas o tempo todo: em que rotacao o motor esta e em que angulo exato o virabrequim se encontra AGORA. Sem angulo nao da para escolher a hora da faisca nem a hora da injecao.',
      'Quem entrega isso e a roda dentada presa no virabrequim, junto com este sensor. O padrao mais comum e a roda de 60 menos 2: sessenta dentes de 6 graus cada, com dois dentes arrancados formando uma falha.',
      'A falha e o segredo. Contando dentes a ECU sabe a rotacao, mas todos os dentes sao iguais. Quando passa o espaco vazio, ela reconhece a referencia e sabe exatamente onde o virabrequim esta. A partir dali e so contar.',
      'Existem dois tipos de sensor. O indutivo tem um ima e uma bobina: o dente passando muda o campo e gera tensao alternada sozinho, sem precisar de alimentacao. Ele tem dois fios e o sinal cresce com a rotacao, de uns 2 V na partida para dezenas de volts em alta.',
      'O de efeito Hall precisa de alimentacao e tem tres fios. Ele entrega uma onda quadrada limpa, com a mesma amplitude em qualquer rotacao, e le bem ate parado. Por isso ele e o preferido nos motores modernos, principalmente nos de start-stop, que precisam saber a posicao com o motor imovel.',
      'Uma coisa importante: o sinal do virabrequim sozinho nao diz se o cilindro 1 esta na compressao ou no escape, porque o virabrequim da duas voltas por ciclo. Quem tira essa duvida e o sensor de fase, la no comando.',
      'Perder esse sinal e morte instantanea do motor. A ECU corta injecao e ignicao na hora, porque sem angulo ela nao tem como acionar nada com seguranca.',
    ],
    contextPt:
      'Na cena estao a roda dentada com a falha de dois dentes, o sensor apontando para ela com a folga certa e a ECU recebendo o sinal.',
    pinsPt: [
      { pinPt: 'Indutivo: 2 fios', whatPt: 'Bobina + e bobina -. Ele gera o proprio sinal, sem alimentacao', color: WIRE_SIGNAL },
      { pinPt: 'Hall: fio 1', whatPt: '+5 V ou +12 V de alimentacao vindos da ECU', color: WIRE_RED },
      { pinPt: 'Hall: fio 2', whatPt: 'Terra', color: WIRE_BLACK },
      { pinPt: 'Hall: fio 3', whatPt: 'Sinal em onda quadrada', color: WIRE_SIGNAL },
      { pinPt: 'Malha', whatPt: 'Blindagem aterrada num lado so', color: WIRE_BLACK },
    ],
    testPt: [
      'Motor gira e nao pega, sem faisca e sem injecao: teste este sensor primeiro. Ele e o suspeito numero um.',
      'Indutivo: resistencia da bobina normalmente entre 200 e 1200 ohm, conforme o modelo. Aberto ou em curto, troca.',
      'No osciloscopio o desenho tem que ser limpo e com a falha bem visivel uma vez por volta. Sinal picotado indica dente danificado ou folga errada.',
      'A folga ate a roda importa: em geral de 0,5 a 1,5 mm. Sensor mal encaixado ou com sujeira magnetica grudada na ponta da falha intermitente.',
      'Falha que aparece so com o motor quente e classica de sensor indutivo com bobina abrindo por dilatacao. Esquente com secador para reproduzir.',
      'Roda dentada com dente quebrado ou volante trincado da o mesmo codigo. Antes de trocar o sensor pela segunda vez, olhe a roda.',
      'Depois de trocar, alguns motores pedem aprendizado da roda dentada pelo scanner para o controle de falha de combustao funcionar.',
    ],
    camDist: 14,
    camTarget: [-0.4, 0.6, 0],
    parts: [
      { partId: 'ckp-sensor', pos: [-1.0, 2.78, 0], scale: 1.3 },
      {
        partId: 'trigger-wheel',
        pos: [-1.0, 0, 0],
        scale: 1.5,
        dim: true,
        labelPt: 'Roda dentada do virabrequim',
        labelAt: [-1.0, -2.6, 0],
      },
      { partId: 'ecu', pos: [5.0, 3.6, 0], scale: 0.85, dim: true, labelPt: 'ECU', labelAt: [5.0, 4.7, 0] },
    ],
    pipes: [
      {
        points: [
          [-1.0, 3.9, 0],
          [-1.0, 4.8, 0],
          [3.4, 4.8, 0],
          [3.4, 3.6, 0],
          [4.0, 3.6, 0],
        ],
        r: 0.06,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.34,
      },
    ],
    labels: [
      { textPt: 'roda de 60 dentes com 2 arrancados: a falha e a referencia', pos: [-5.4, 0.6, 0] },
      { textPt: 'folga de 0,5 a 1,5 mm', pos: [1.6, 2.2, 0] },
      { textPt: 'perdeu esse sinal, o motor morre na hora', pos: [-1.0, -3.5, 0] },
    ],
  },

  // ---------------------------------------------------------------- 18
  18: {
    oneLinePt:
      'O conjunto dentro do tanque: bomba eletrica, filtro, boia do nivel e o copo que segura combustivel perto da suceao.',
    bodyPt: [
      'Ele nao e so uma bomba. E um modulo com quatro funcoes juntas, e entender cada uma evita troca errada.',
      'A bomba eletrica em si e um motor de corrente continua com uma turbina. Ela fica submersa de proposito: o proprio combustivel resfria e lubrifica o motor dela. E por isso que rodar sempre com o tanque na reserva mata bomba antes da hora.',
      'A pressao que ela entrega depende do sistema. Numa injecao indireta ela ja e a pressao final, de 3 a 4 bar. Numa injecao direta, como esta do mapa, ela e so o estagio de baixa: manda uns 5 bar ate a bomba mecanica de alta, que faz o resto.',
      'O filtro fica no proprio modulo na maioria dos carros modernos, o que significa que trocar o filtro e tirar o modulo do tanque. Alem dele tem uma tela grossa na entrada, que segura sujeira maior.',
      'A boia do nivel e um braco com um potenciometro. Ele muda de resistencia conforme o braco sobe. E um sinal simples que vai para o painel, e nao para a ECU do motor na maioria dos carros.',
      'O copo em volta da bomba tem um motivo que muita gente nao sabe: em curva forte ou subida com pouco combustivel, o liquido corre para um lado do tanque. O copo segura um pouco de combustivel em volta da suceao para a bomba nao chupar ar e o motor nao morrer.',
      'A bomba nao gira direto da chave. Ela e ligada por um rele que a ECU comanda, e a ECU so mantem o rele ligado enquanto ve sinal do sensor do virabrequim. Isso e seguranca: em uma batida com o motor parado, a bomba desliga sozinha.',
    ],
    contextPt:
      'Na cena estao o tanque em vidro com o modulo dentro, a linha de baixa pressao saindo para o motor e o rele com a alimentacao.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '+12 V vindo do rele da bomba, e nao direto da chave', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Terra da bomba', color: WIRE_BLACK },
      { pinPt: 'Fio 3', whatPt: 'Sinal da boia de nivel para o painel', color: WIRE_SIGNAL },
      { pinPt: 'Fio 4', whatPt: 'Terra da boia', color: WIRE_BLACK },
    ],
    testPt: [
      'Primeiro escute. Girando a chave sem dar partida, a bomba tem que zunir por 2 a 3 segundos e parar. Silencio total aponta rele, fusivel ou a propria bomba.',
      'Meca a tensao NO CONECTOR DA BOMBA com ela funcionando, e nao no rele. Queda de mais de 0,5 V no fio ou no terra ja derruba a vazao.',
      'Teste de pressao com manometro e teste de vazao sao coisas diferentes. Bomba fraca pode dar pressao certa parada e faltar volume com o motor acelerado.',
      'Sintoma classico de bomba morrendo: o carro anda bem frio e comeca a falhar depois de quente, ou perde forca em subida e com o tanque baixo.',
      'Filtro entupido da os mesmos sintomas de bomba fraca. Confira o filtro antes de condenar a bomba.',
      'Boia com defeito e problema so de marcador. Nao afeta o motor. Nao troque o modulo inteiro se o unico sintoma e o ponteiro errado.',
      'Rodar sempre na reserva superaquece a bomba. Isso e desgaste real e evitavel.',
    ],
    camDist: 12,
    parts: [
      { partId: 'fuel-pump-module', pos: [0, 0, 0], scale: 1.5 },
      {
        partId: 'hp-fuel-pump',
        pos: [5.6, 2.2, 0],
        scale: 0.85,
        dim: true,
        labelPt: 'Bomba de alta no motor',
        labelAt: [5.6, 3.4, 0],
      },
    ],
    boxes: [
      {
        pos: [0, -0.2, 0],
        size: [5.4, 3.4, 3.0],
        glass: true,
        labelPt: 'Tanque de combustivel',
        labelAt: [0, -2.5, 0],
      },
      { pos: [-5.6, 2.2, 0], size: [0.8, 0.8, 0.8], color: '#3d4657', labelPt: 'Rele da bomba', labelAt: [-6.9, 2.2, 0] },
    ],
    pipes: [
      {
        points: [
          [0.75, 1.5, 0],
          [0.75, 2.6, 0],
          [4.6, 2.6, 0],
        ],
        r: 0.11,
        color: FUEL_PIPE,
        flow: '#e08a1e',
        flowSpeed: 0.16,
        labelPt: 'baixa pressao: cerca de 5 bar',
        labelAt: [3.0, 3.2, 0],
      },
      {
        points: [
          [-5.6, 1.8, 0],
          [-5.6, 3.6, 0],
          [-0.38, 3.6, 0],
          [-0.38, 1.6, 0],
        ],
        r: 0.07,
        color: WIRE_RED,
        labelPt: '+12 V',
        labelAt: [-3.0, 4.1, 0],
      },
    ],
    labels: [
      { textPt: 'a bomba fica submersa: o combustivel esfria ela', pos: [-5.4, -0.4, 0] },
      { textPt: 'o copo segura combustivel na curva para nao chupar ar', pos: [0, -3.4, 0] },
      { textPt: 'sem sinal do virabrequim a ECU desliga o rele', pos: [4.4, -2.2, 0] },
    ],
  },

  // ---------------------------------------------------------------- 19
  19: {
    oneLinePt:
      'Transforma os 12 V da bateria em dezenas de milhares de volts para a faisca atravessar o ar entre os eletrodos da vela.',
    bodyPt: [
      'Ar nao conduz eletricidade. Para uma faisca pular a folga de menos de um milimetro da vela, dentro de uma camara com a mistura ja comprimida, precisa de algo entre 15 mil e 30 mil volts. Quanto maior a compressao, mais tensao e necessaria.',
      'A bobina faz isso com duas bobinagens no mesmo nucleo de ferro. O primario tem poucas voltas de fio grosso; o secundario tem milhares de voltas de fio fino. A relacao entre eles e da ordem de 1 para 100 ou mais.',
      'O funcionamento e por corte, e nao por continuidade. A ECU fecha o terra do primario e a corrente sobe, guardando energia no campo magnetico. Esse tempo de carga se chama dwell, e fica na faixa de 1,5 a 4 milissegundos.',
      'Quando a hora da faisca chega, a ECU CORTA o terra de uma vez. O campo magnetico despenca, e essa variacao brusca induz a alta tensao no secundario. Nao e o ligar que gera a faisca: e o desligar.',
      'A bobina moderna e do tipo coil-on-plug: uma por cilindro, encaixada direto na vela, sem cabo de vela nenhum. Isso acabou com perda de energia no cabo, fuga de corrente e interferencia no radio.',
      'Existe ainda o formato de bobina dupla, que solta faisca em dois cilindros ao mesmo tempo: um esta na compressao e usa a faisca, o outro esta no escape e a faisca se perde. Chamam de faisca perdida.',
      'O tempo da faisca e o ponto de ignicao, e ele muda o tempo todo. Em rotacao alta a faisca sai bem antes do pistao chegar em cima, porque a queima leva tempo. Quem calcula esse avanco e a ECU, usando rotacao, carga, temperatura e o sensor de detonacao.',
    ],
    contextPt:
      'Na cena estao a bobina encaixada direto na vela, o cilindro em corte com a faisca acontecendo e o comando da ECU chegando.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '+12 V pos-chave, vindo do rele principal', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Terra do estagio de potencia', color: WIRE_BLACK },
      { pinPt: 'Fio 3', whatPt: 'Comando da ECU: ela segura e depois corta. O corte gera a faisca', color: '#7127c9' },
      { pinPt: 'Fio 4', whatPt: 'Quando tem: retorno de diagnostico avisando se a faisca saiu', color: WIRE_SIGNAL },
    ],
    testPt: [
      'Falha so em um cilindro: troque a bobina com a do cilindro vizinho e rode de novo. A falha andou junto? Bobina. Ficou no mesmo lugar? Injetor, vela ou compressao.',
      'Resistencia do primario tipicamente de 0,4 a 1,5 ohm. Nas bobinas com modulo eletronico interno essa medida nao vale, e o teste tem que ser no osciloscopio.',
      'A vela e parte do conjunto. Vela com folga aberta pelo desgaste exige mais tensao e mata a bobina por esforco. Respeite o intervalo de troca.',
      'Olhe a borracha (cachimbo) da bobina. Ressecada ou com trilha branca de fuga, a alta escapa para o cabecote antes de chegar na vela.',
      'Agua ou oleo no poco da vela e causa comum de falha. Junta da tampa de valvulas vazando enche o poco e a faisca fuga.',
      'Nunca puxe a bobina com o motor rodando para ver a faisca. Voce toma choque de dezenas de milhares de volts e ainda pode queimar o driver da ECU.',
    ],
    camDist: 12,
    camTarget: [-0.4, 0, 0],
    parts: [
      { partId: 'ignition-coil', pos: [0, 1.35, 0], scale: 1.4 },
      { partId: 'ecu', pos: [-4.8, 3.0, 0], scale: 0.85, dim: true, labelPt: 'ECU', labelAt: [-4.8, 4.1, 0] },
    ],
    boxes: [
      {
        pos: [0, -2.4, 0],
        size: [3.6, 3.8, 2.4],
        color: '#3d4657',
        labelPt: 'Cilindro em corte',
        labelAt: [3.4, -2.4, 0],
      },
      { pos: [0, -2.4, 1.25], size: [2.2, 3.0, 0.06], glass: true },
      { pos: [0, -0.68, 0], size: [0.14, 0.22, 0.14], color: '#e8b64a' },
    ],
    pipes: [
      {
        points: [
          [-0.4, 3.31, 0],
          [-3.7, 3.31, 0],
        ],
        r: 0.06,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'a ECU segura e depois CORTA o terra',
        labelAt: [-2.9, 2.1, 0],
      },
    ],
    labels: [
      { textPt: 'uma bobina por vela: nao existe mais cabo de vela', pos: [0, 4.5, 0] },
      { textPt: 'dwell: tempo carregando o campo, de 1,5 a 4 ms', pos: [3.4, 1.6, 0] },
      { textPt: 'a vela ja vem encaixada embaixo da bobina', pos: [-3.9, -0.15, 0] },
      { textPt: 'faisca de 15 mil a 30 mil volts', pos: [0, -5.0, 0] },
    ],
  },

  // ---------------------------------------------------------------- 20
  20: {
    oneLinePt:
      'Le a posicao do comando de valvulas. E ele que diz para a ECU qual cilindro esta na compressao de verdade.',
    bodyPt: [
      'O sensor do virabrequim conta o angulo com precisao, mas tem um limite: o virabrequim da DUAS voltas para o motor completar um ciclo. Entao, so com ele, a ECU sabe que um pistao esta la em cima, mas nao sabe se ele esta terminando a compressao ou terminando o escape.',
      'A diferenca e tudo. Se ela injetar e soltar faisca no tempo errado, o combustivel vai direto para o escapamento. O comando de valvulas gira na metade da rotacao do virabrequim, uma volta por ciclo, entao ele resolve a duvida.',
      'Por isso o nome sensor de fase. Ele nao mede rotacao, ele identifica em que fase o motor esta. Junto com o virabrequim, a ECU monta o quadro completo e consegue fazer injecao sequencial: cada injetor abre na hora certa do seu proprio cilindro.',
      'A roda que ele le fica no comando e tem poucos dentes, as vezes um so, ou um recorte assimetrico. Nao precisa de resolucao alta, precisa de identificacao.',
      'Quase todos hoje sao de efeito Hall, com tres fios: alimentacao, terra e sinal em onda quadrada. O Hall le bem em rotacao baixissima, o que ajuda na partida.',
      'Nos motores com comando variavel ele ganhou um segundo emprego, que virou o principal: ele mede em tempo real o quanto o comando foi adiantado ou atrasado pelo variador. A ECU compara a posicao do comando com a do virabrequim e fecha a malha do variador com esse valor.',
      'Perder o sinal de fase geralmente nao mata o motor. A ECU entra num plano B: tenta adivinhar a fase, ou passa a injetar todos os cilindros juntos. O carro anda, mas gasta mais, a partida demora e o comando variavel deixa de funcionar.',
    ],
    contextPt:
      'Na cena estao o comando de valvulas com a roda de fase, o sensor apontando para ela e o sensor do virabrequim embaixo, para ficar clara a relacao de duas voltas para uma.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '+5 V ou +12 V de alimentacao da ECU', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Terra', color: WIRE_BLACK },
      { pinPt: 'Fio 3', whatPt: 'Sinal em onda quadrada, um pulso por volta do comando', color: WIRE_SIGNAL },
    ],
    testPt: [
      'Partida demorada mas o motor pega e anda: suspeite do sensor de fase. Sem ele a ECU precisa de mais voltas para descobrir a fase.',
      'Chave ligada: tem que existir alimentacao no pino correspondente e terra bom. Sem alimentacao o Hall nao gera nada.',
      'No osciloscopio o sinal tem que ser quadrado, sem ruido, e aparecer uma vez a cada duas voltas do virabrequim.',
      'Codigo de correlacao entre virabrequim e comando raramente e o sensor. Quase sempre e corrente esticada, tensor gasto ou variador de fase travado por oleo sujo.',
      'Se o codigo de correlacao apareceu depois de uma troca de correia ou corrente, confira a sincronizacao antes de qualquer coisa.',
      'Comando variavel que nao atua e oleo. Filtro da eletrovalvula do variador entupido e a causa mais comum, e nao o sensor.',
    ],
    camDist: 14,
    camTarget: [-0.3, 0.2, 0],
    parts: [
      { partId: 'cmp-sensor', pos: [-0.6, 4.3, 0], scale: 1.4, titleAt: [-3.8, 5.2, 0] },
      { partId: 'camshaft', pos: [-0.6, 2.4, 0], scale: 3.0, dim: true, labelPt: 'Comando de valvulas', labelAt: [-4.4, 2.4, 0] },
      {
        partId: 'ckp-sensor',
        pos: [-0.6, -1.38, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Sensor do virabrequim',
        labelAt: [2.6, -1.38, 0],
      },
      { partId: 'trigger-wheel', pos: [-0.6, -3.4, 0], scale: 1.1, dim: true },
    ],
    pipes: [
      {
        points: [
          [-0.28, 5.45, 0],
          [3.9, 5.45, 0],
          [3.9, 4.2, 0],
        ],
        r: 0.06,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.34,
        labelPt: 'sinal para a ECU',
        labelAt: [1.8, 4.95, 0],
      },
    ],
    labels: [
      { textPt: 'comando: 1 volta por ciclo', pos: [3.2, 3.9, 0] },
      { textPt: 'virabrequim: 2 voltas por ciclo', pos: [3.2, -3.4, 0] },
      { textPt: 'juntos os dois dizem qual cilindro esta na compressao', pos: [-0.6, 0.5, 0] },
    ],
  },

  // ---------------------------------------------------------------- 21
  21: {
    oneLinePt:
      'Le a temperatura do liquido de arrefecimento. E o sensor que manda no enriquecimento a frio, no ponto e no ventilador.',
    bodyPt: [
      'Motor frio precisa de mais combustivel. A gasolina nao evapora bem em metal frio: boa parte se condensa na parede do cilindro e nao queima. Para o motor pegar e nao morrer, a ECU injeta bem mais do que a conta teorica, as vezes o dobro.',
      'Conforme o motor esquenta, ela vai tirando esse excesso ate chegar no ponto normal. Quem diz para ela em que ponto dessa curva o motor esta e este sensor.',
      'Ele e um NTC, ou seja, um resistor com coeficiente negativo: quanto mais quente, MENOR a resistencia. Isso e ao contrario do que a intuicao diz, e e o ponto que mais confunde.',
      'Valores de referencia que vale decorar: perto de 5 mil ohm a 20 graus, cerca de 2,5 mil ohm a 25 graus, aproximadamente 300 ohm a 80 graus, e menos de 200 ohm a 100 graus.',
      'A ECU nao le ohm, le tensao. Ela manda 5 V por um resistor fixo interno e o NTC puxa esse ponto para baixo. Motor frio da uns 3,5 a 4 V; motor quente cai para 0,5 a 1,5 V. E um divisor de tensao simples.',
      'Com esse valor ela mexe em muita coisa: quantidade injetada, avanco de ponto, marcha lenta acelerada a frio, liberacao da malha fechada da lambda, liberacao da EGR e da purga do canister, ligar o ventilador do radiador e acender a luz de temperatura no painel.',
      'Cuidado com a confusao: o sensor que manda a informacao para o ponteiro do painel muitas vezes e OUTRO, separado, com um fio so. O da ECU costuma ter dois fios. Ponteiro certo nao garante sensor da ECU bom.',
    ],
    contextPt:
      'Na cena estao o cabecote e a galeria de agua onde ele e rosqueado, com a ECU recebendo o sinal e comandando o ventilador.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: 'Sinal: 5 V da ECU passando por um resistor interno', color: WIRE_SIGNAL },
      { pinPt: 'Fio 2', whatPt: 'Terra de sinal da ECU', color: WIRE_BLACK },
      { pinPt: 'Extra', whatPt: 'Quando tem 3 ou 4 pinos, o segundo par vai para o painel', color: '#7127c9' },
    ],
    testPt: [
      'Carro frio de verdade, parado a noite toda: a leitura de temperatura no scanner tem que ser igual a temperatura do ar. Se marca 40 graus com o motor frio, o sensor esta mentindo.',
      'Compare a leitura do scanner com um termometro infravermelho na mangueira do radiador. Diferenca grande e sensor viciado.',
      'Meca a resistencia com o sensor fora, mergulhado em agua quente, e acompanhe a queda com um termometro. E o teste mais confiavel.',
      'Fio de sinal em curto com o terra: a ECU le temperatura altissima, corta combustivel e liga o ventilador direto. Fio partido: ela le frio extremo e enriquece demais, enchendo de combustivel.',
      'Sensor lendo mais frio que a realidade e um dos maiores viloes de consumo alto. O motor roda a vida inteira em enriquecimento de partida, suja vela e catalisador.',
      'Motor que so falha a frio e melhora depois de quente pede este sensor na lista de suspeitos junto com a bomba e a bobina.',
      'Nunca use fita veda rosca comum na rosca dele quando ela e do tipo que precisa de contato eletrico com o bloco.',
    ],
    camDist: 11,
    parts: [
      { partId: 'temp-sensor', pos: [0, 0.98, 0], scale: 1.7 },
      { partId: 'ecu', pos: [4.8, 2.2, 0], scale: 0.85, dim: true, labelPt: 'ECU', labelAt: [4.8, 3.3, 0] },
    ],
    boxes: [
      {
        pos: [0, -1.2, 0],
        size: [5.6, 1.8, 2.0],
        color: '#3d4657',
        labelPt: 'Galeria de agua do cabecote',
        labelAt: [0, -2.6, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-4.0, -1.2, 0],
          [4.0, -1.2, 0],
        ],
        r: 0.22,
        color: '#3f6b9e',
        flow: '#4f8fd0',
        flowSpeed: 0.14,
        labelPt: 'liquido de arrefecimento',
        labelAt: [-4.8, 0.4, 0],
      },
      {
        points: [
          [0.45, 2.17, 0],
          [3.95, 2.17, 0],
        ],
        r: 0.06,
        color: WIRE_SIGNAL,
      },
    ],
    labels: [
      { textPt: 'NTC: quanto mais quente, MENOR a resistencia', pos: [0, 3.5, 0] },
      { textPt: '20 graus: cerca de 5 mil ohm', pos: [-3.6, 2.6, 0] },
      { textPt: '80 graus: cerca de 300 ohm', pos: [3.4, -3.6, 0] },
    ],
  },

  // ---------------------------------------------------------------- 22
  22: {
    oneLinePt:
      'A sonda de banda larga antes do catalisador. Ela nao diz so se esta rico ou pobre: ela diz o QUANTO, num numero.',
    bodyPt: [
      'A sonda comum de banda estreita tem um defeito grave para o controle moderno: ela so avisa de que lado do lambda 1 a mistura esta. Passou de 0,45 V, esta rico; abaixo, esta pobre. Ela nao consegue dizer se esta pouco rico ou muito rico.',
      'Isso funciona quando o motor so precisa ficar oscilando em volta de lambda 1. Mas motor de injecao direta trabalha proposital em mistura pobre, e motor turbo enriquece proposital em plena carga. Nesses pontos a sonda estreita fica cega, encostada no fim da escala.',
      'A sonda de banda larga, ou LSU, resolve isso com uma sacada de engenharia. Ela tem duas celulas dentro: uma celula de medicao, igual a sonda comum, e uma celula de bombeamento de oxigenio.',
      'Entre elas existe uma camara minuscula de difusao, ligada ao gas de escape por uma fenda. O circuito faz uma coisa esperta: ele bombeia oxigenio para dentro ou para fora dessa camara, o quanto for preciso, para manter a camara SEMPRE em lambda 1.',
      'A informacao entao nao e a tensao. E a CORRENTE de bombeamento necessaria. Mistura pobre, tem oxigenio sobrando, o circuito precisa bombear oxigenio para fora: corrente num sentido. Mistura rica, falta oxigenio, ele bombeia para dentro: corrente no sentido contrario. Em lambda 1 exato a corrente e praticamente zero.',
      'Essa corrente e proporcional e linear, entao a ECU consegue ler qualquer valor entre um motor muito pobre e um motor muito rico. Na pratica ela mede de lambda 0,65 ate ar puro.',
      'Ela so funciona quente, entre 700 e 800 graus, e a temperatura tem que ser exata para a medida ser exata. Por isso o aquecedor dela nao e simplesmente ligado: a ECU controla a potencia dele em PWM, em malha fechada, medindo a resistencia interna da propria sonda.',
      'No scanner voce nao ve a corrente crua. Voce ve o resultado ja convertido: o valor de lambda ou a relacao ar combustivel. Lambda 1,00 e a mistura ideal, 0,85 e bem rico, 1,10 e pobre.',
    ],
    contextPt:
      'Na cena esta o coletor de escape com o gas quente passando, a sonda rosqueada nele antes do catalisador, e o catalisador logo depois.',
    pinsPt: [
      { pinPt: 'Aquecedor +', whatPt: '+12 V do rele. Sem aquecer ela nao mede nada', color: WIRE_RED },
      { pinPt: 'Aquecedor -', whatPt: 'Comando por terra da ECU, em PWM controlado', color: '#7127c9' },
      { pinPt: 'Celula de bombeamento', whatPt: 'Por onde passa a corrente que e a medida de verdade', color: WIRE_SIGNAL },
      { pinPt: 'Celula de medicao', whatPt: 'Referencia interna que o circuito segura em lambda 1', color: '#0f8a46' },
      { pinPt: 'Referencia comum', whatPt: 'O retorno compartilhado das duas celulas', color: WIRE_BLACK },
    ],
    testPt: [
      'ESQUECA o multimetro nesta sonda. Medir tensao nos pinos dela nao diz nada, porque o sinal e corrente controlada pelo circuito da ECU. O teste e pelo scanner.',
      'Leitura correta no scanner: motor quente em marcha lenta, lambda oscilando bem perto de 1,00. Pisando fundo tem que cair para algo entre 0,85 e 0,92; tirando o pe de uma vez tem que subir acima de 1,10 (corte de combustivel).',
      'Sonda preguicosa: o valor demora a reagir ao acelerar. Compare o tempo de resposta dela com o comportamento do MAF.',
      'Cada sonda de banda larga vem com um resistor de calibracao dentro do proprio conector. Nunca corte esse conector nem troque por outro modelo.',
      'Aquecedor: resistencia tipica de 2 a 10 ohm. Aberto e sonda morta, mesmo que o resto esteja bom.',
      'Vazamento de escape ANTES dela deixa entrar ar falso e a leitura vai para pobre. Procure vazamento antes de trocar a sonda.',
      'Aditivo de silicone, oleo queimado e combustivel adulterado envenenam a sonda de forma permanente.',
    ],
    camDist: 12,
    parts: [
      { partId: 'lambda-planar', pos: [0, 1.3, 0], scale: 1.5 },
      {
        partId: 'catalytic-converter',
        pos: [4.4, 0, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Catalisador',
        labelAt: [4.4, -1.2, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-6.0, 0, 0],
          [2.9, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
        labelPt: 'gases do motor',
        labelAt: [-4.6, 0.9, 0],
      },
      {
        points: [
          [5.9, 0, 0],
          [7.6, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
      },
    ],
    labels: [
      { textPt: 'ela mede o QUANTO, e nao so o lado', pos: [0, 3.3, 0] },
      { textPt: 'so trabalha entre 700 e 800 graus: por isso o aquecedor e controlado', pos: [0, -1.7, 0] },
      { textPt: 'lambda 1,00 e a mistura ideal', pos: [-3.8, -2.7, 0] },
    ],
  },

  // ---------------------------------------------------------------- 23
  23: {
    oneLinePt:
      'A colmeia ceramica com metais nobres que transforma o gas venenoso do motor em gas comum antes de sair pelo escapamento.',
    bodyPt: [
      'Mesmo com a queima perfeita sobram tres venenos no escape: monoxido de carbono, que e o CO, hidrocarboneto nao queimado, que e combustivel cru, e o NOx.',
      'O catalisador de tres vias trata os tres ao mesmo tempo, e dai vem o nome. Ele nao filtra nada: ele acelera reacoes quimicas que aconteceriam sozinhas so em temperaturas absurdas.',
      'Por dentro e um bloco ceramico em forma de favo de mel, com milhares de canais finos. A area interna e enorme, do tamanho de campos de futebol somados. Sobre essa ceramica tem uma camada com platina, paladio e rodio.',
      'Platina e paladio cuidam da oxidacao: pegam o CO e o combustivel cru e juntam com oxigenio, virando gas carbonico e agua. O rodio cuida da reducao: ele arranca o oxigenio do NOx e devolve nitrogenio puro, que e o que ja existia no ar.',
      'Tem uma condicao dura: os tres so funcionam juntos numa faixa estreitissima em volta de lambda 1. Um pouco rico e falta oxigenio para oxidar; um pouco pobre e sobra oxigenio e o rodio nao consegue reduzir o NOx. E exatamente por isso que a sonda lambda existe e fica corrigindo o tempo todo.',
      'Ele tambem precisa de calor. Abaixo de uns 250 a 300 graus ele quase nao converte nada. Por isso, no primeiro minuto depois da partida a frio, o carro polui muito mais, e por isso a ECU atrasa o ponto de proposito na partida: gas mais quente esquenta o catalisador mais rapido.',
      'Ele nao tem manutencao e nao deveria gastar. Quando morre, quase sempre foi outra peca que matou ele: falha de combustao mandando combustivel cru, oleo queimando, mistura rica cronica ou uma pancada.',
    ],
    contextPt:
      'Na cena estao a sonda antes dele, que controla a mistura, e a sonda depois dele, que confere se ele ainda esta trabalhando.',
    testPt: [
      'O teste classico e comparar as duas sondas com o motor quente. A de antes tem que oscilar rapido; a de depois tem que ficar quase parada, alta e estavel, perto de 0,6 a 0,8 V. Se a de depois copia o desenho da de antes, o catalisador nao esta mais convertendo.',
      'Contrapressao: com o motor acelerado nao pode haver restricao. Catalisador derretido por dentro entope, o motor perde forca e superaquece.',
      'Barulho de chocalho ao bater de leve com a mao no corpo dele indica ceramica quebrada.',
      'Codigo de eficiencia do catalisador abaixo do limite raramente aparece sozinho. Procure primeiro falha de combustao, injetor vazando ou consumo de oleo.',
      'Trocar o catalisador sem consertar a causa e jogar dinheiro fora: o novo morre igual.',
      'Nunca lave um catalisador quente com agua fria. O choque termico trinca a ceramica.',
    ],
    camDist: 13,
    parts: [
      { partId: 'catalytic-converter', pos: [0, 0, 0], scale: 1.1 },
      {
        partId: 'lambda-planar',
        pos: [-3.8, 0.9, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Sonda antes: controla a mistura',
        labelAt: [-4.4, 2.4, 0],
      },
      {
        partId: 'lambda-sensor',
        pos: [3.8, 0.8, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Sonda depois: fiscaliza o catalisador',
        labelAt: [4.6, 2.6, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-7.0, 0, 0],
          [-1.9, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
        labelPt: 'CO, combustivel cru e NOx',
        labelAt: [-5.6, -0.9, 0],
      },
      {
        points: [
          [1.9, 0, 0],
          [7.0, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#7a8a99',
        flowSpeed: 0.22,
        labelPt: 'gas carbonico, agua e nitrogenio',
        labelAt: [5.4, -0.9, 0],
      },
    ],
    labels: [
      { textPt: 'favo de ceramica com platina, paladio e rodio', pos: [0, 1.7, 0] },
      { textPt: 'so converte os tres gases juntos em volta de lambda 1', pos: [0, -1.7, 0] },
      { textPt: 'frio ele nao trabalha: precisa passar de 250 a 300 graus', pos: [0, -2.7, 0] },
    ],
  },

  // ---------------------------------------------------------------- 24
  24: {
    oneLinePt:
      'Termometro de escape. Ele vigia a temperatura do gas para proteger turbina, catalisador e filtro de particulas.',
    bodyPt: [
      'O gas de escape sai do motor entre 600 e 900 graus em uso normal, e passa de 1000 em situacao extrema. Nessa faixa as pecas do escapamento vivem no limite do material.',
      'Turbina de turbo, catalisador e filtro de particulas tem cada um sua temperatura maxima. Passou disso, a ceramica derrete, a colmeia colapsa e a turbina perde a folga. Sao pecas caras, e por isso alguem precisa ficar de olho.',
      'Esse alguem e o sensor de temperatura de gases. Ele fica rosqueado no tubo, com a ponta dentro do fluxo, e entrega a temperatura em tempo real para a ECU.',
      'Com esse valor a ECU age: enriquece a mistura em plena carga para o excesso de combustivel esfriar a turbina, corta pressao do turbo se a coisa apertar, ou reduz a potencia.',
      'No diesel ele tem outro emprego importante. O filtro de particulas precisa queimar a fuligem acumulada, e para isso o gas tem que passar de uns 600 graus. A ECU injeta combustivel extra no fim do ciclo so para elevar a temperatura, e usa este sensor para controlar essa queima. Sem ele, nao da para regenerar o filtro com seguranca.',
      'A maioria e do tipo PTC de platina, o oposto do sensor de agua: aqui, quanto mais quente, MAIOR a resistencia. Isso da uma curva bem previsivel na faixa alta. Outros modelos sao termopares, que geram uma tensao minuscula pela diferenca de temperatura entre duas juntas.',
      'A ponta dele vive dentro do gas quente com vibracao e sal de estrada. E uma peca de desgaste, e o cabo dela sofre tanto quanto o sensor.',
    ],
    contextPt:
      'Na cena estao o tubo de escape com o gas quente, o sensor com a ponta dentro do fluxo e o catalisador logo adiante.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: 'Um lado do elemento. Nao tem polaridade no tipo PTC', color: WIRE_SIGNAL },
      { pinPt: 'Fio 2', whatPt: 'O outro lado, indo para a ECU ou para o modulo do escape', color: WIRE_BLACK },
      { pinPt: 'Termopar', whatPt: 'Quando e termopar, ai sim a polaridade importa', color: '#7127c9' },
    ],
    testPt: [
      'Carro frio parado a noite toda: a leitura tem que ser igual a temperatura do ambiente. Diferenca grande ja condena.',
      'Motor quente e acelerado: a leitura tem que subir de forma continua, sem pulos. Valor congelado num numero e sensor ou cabo aberto.',
      'Meca a resistencia frio e compare com a tabela do fabricante. No PTC ela sobe com a temperatura.',
      'Passe a mao no chicote dele com atencao. E o cabo que mais queima encostado no proprio escapamento.',
      'Rosca agarrada e regra. Use penetrante e aqueca o tubo antes, senao voce arrebenta o sensor la dentro.',
      'Em diesel, sensor ruim impede a regeneracao do filtro de particulas. O filtro entope, o carro entra em modo de emergencia e ai o prejuizo e outro.',
    ],
    camDist: 12,
    parts: [
      { partId: 'egt-sensor', pos: [0, 1.62, 0], scale: 1.2 },
      {
        partId: 'catalytic-converter',
        pos: [4.4, 0, 0],
        scale: 0.85,
        dim: true,
        labelPt: 'Catalisador protegido',
        labelAt: [4.4, -1.2, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-6.0, 0, 0],
          [2.9, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.24,
        labelPt: 'de 600 a mais de 1000 graus',
        labelAt: [-4.4, -0.9, 0],
      },
      {
        points: [
          [5.8, 0, 0],
          [7.4, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.24,
      },
    ],
    labels: [
      { textPt: 'a ponta fica dentro do fluxo de gas', pos: [0, 4.4, 0] },
      { textPt: 'PTC: quanto mais quente, MAIOR a resistencia', pos: [0, -1.8, 0] },
      { textPt: 'muito quente: a ECU enriquece ou corta pressao para proteger', pos: [0, -2.8, 0] },
    ],
  },

  // ---------------------------------------------------------------- 25
  25: {
    oneLinePt:
      'O catalisador que guarda o NOx enquanto o motor roda pobre e depois queima esse estoque numa limpeza rapida e rica.',
    bodyPt: [
      'Motor de injecao direta economiza rodando com mistura pobre em carga parcial, com lambda bem acima de 1. Otimo para o consumo, pessimo para o NOx: com oxigenio sobrando, o catalisador de tres vias nao consegue reduzir NOx nenhum.',
      'A solucao foi criar um catalisador que nao trata o NOx na hora, e sim GUARDA. Ele tem um material que se combina com o NOx e prende ele quimicamente na superficie, formando nitrato. Enquanto o motor roda pobre, ele vai enchendo.',
      'So que ele enche. Depois de algum tempo rodando pobre ele satura e para de segurar. E ai que acontece a parte engenhosa: a ECU faz uma regeneracao.',
      'Ela enriquece a mistura de proposito por poucos segundos, deixando o motor levemente rico. Sem oxigenio livre no escape, o nitrato guardado se solta, e o CO e o combustivel cru dessa mistura rica reagem com ele e liberam nitrogenio puro. O catalisador esvazia e volta a poder guardar.',
      'Esse ciclo se repete o tempo todo: alguns minutos guardando, poucos segundos limpando. O motorista nao percebe nada, mas a ECU precisa fazer a conta certa de quanto NOx entrou e quanto ja saiu.',
      'Para acompanhar isso existe o sensor de NOx depois dele, que mede quanto NOx esta escapando e diz para a ECU a hora de regenerar e se a regeneracao funcionou.',
      'O grande inimigo desse tipo de catalisador e o enxofre do combustivel. O enxofre gruda no mesmo lugar onde o NOx deveria grudar e nao sai numa regeneracao normal. Por isso existe uma dessulfatacao: uma limpeza mais longa, com o catalisador em temperatura bem mais alta.',
      'Em diesel pesado a estrategia e outra: em vez de guardar, injeta-se ureia (o Arla 32) no escape e o NOx e reduzido de forma continua no catalisador SCR.',
    ],
    contextPt:
      'Na cena estao o catalisador de tres vias antes, este catalisador de NOx e a sonda depois dele que fiscaliza o resultado.',
    testPt: [
      'Ele nao tem fio proprio. Quem tem fio e o sensor de NOx que trabalha junto com ele.',
      'Codigo de eficiencia baixa: antes de trocar, confira se as regeneracoes estao acontecendo. O scanner mostra o contador de regeneracao.',
      'Combustivel com muito enxofre satura ele. Em alguns carros da para forcar a dessulfatacao pelo scanner.',
      'Consumo subindo sem motivo pode ser regeneracao acontecendo com frequencia demais porque o catalisador nao guarda mais.',
      'Igual ao de tres vias: falha de combustao, oleo queimando ou mistura rica cronica destroem ele antes da hora.',
    ],
    camDist: 13,
    parts: [
      { partId: 'nox-catalyst', pos: [0, 0, 0], scale: 1.1 },
      {
        partId: 'catalytic-converter',
        pos: [-4.6, 0, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Catalisador de tres vias',
        labelAt: [-4.6, -1.2, 0],
      },
      {
        partId: 'nox-sensor',
        pos: [4.2, 0.7, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Sensor de NOx',
        labelAt: [5.0, 2.2, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-7.4, 0, 0],
          [-6.1, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
      },
      {
        points: [
          [-3.0, 0, 0],
          [-2.05, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
      },
      {
        points: [
          [2.05, 0, 0],
          [7.0, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#7a8a99',
        flowSpeed: 0.22,
        labelPt: 'nitrogenio puro',
        labelAt: [6.2, -0.9, 0],
      },
    ],
    labels: [
      { textPt: 'motor pobre: ele GUARDA o NOx', pos: [0, 1.8, 0] },
      { textPt: 'saturou: a ECU enriquece por segundos e ele ESVAZIA', pos: [0, 2.7, 0] },
      { textPt: 'o enxofre do combustivel ocupa o lugar do NOx e satura ele', pos: [0, -1.9, 0] },
    ],
  },

  // ---------------------------------------------------------------- 26
  26: {
    oneLinePt:
      'A sonda depois do catalisador. Ela nao controla a mistura: ela existe para fiscalizar se o catalisador ainda esta trabalhando.',
    bodyPt: [
      'Para entender qualquer sonda, entenda primeiro o que ela mede. Ela NAO mede combustivel. Ela mede quanto oxigenio SOBROU no gas de escape depois da queima. Sobrou muito oxigenio, e porque faltou combustivel: mistura pobre. Nao sobrou oxigenio, e porque sobrou combustivel: mistura rica.',
      'A sonda de banda estreita, que e a mais comum, e feita de zirconia. O corpo ceramico dela tem gas de escape de um lado e ar do ambiente do outro. Quando a diferenca de oxigenio entre os dois lados e grande, a ceramica gera tensao sozinha, como uma pilha. Ela nao precisa de alimentacao para o sinal: ela e uma fonte.',
      'E aqui esta o detalhe que define tudo: a curva dela nao e proporcional, e um degrau. Em mistura pobre ela fica perto de 0,1 V. Em mistura rica ela pula para perto de 0,9 V. E a mudanca entre um e outro acontece toda em cima de lambda 1, em 0,45 V. Fora dessa vizinhanca ela satura e nao informa mais nada.',
      'Por isso a sonda de antes do catalisador fica oscilando o tempo todo entre rico e pobre, varias vezes por segundo. A ECU nao consegue ficar parada em lambda 1: ela passa um pouco, corrige, passa para o outro lado, corrige de novo. Esse zigue-zague e o funcionamento CERTO, e nao defeito.',
      'A sonda depois do catalisador, que e esta da cena, ve outra coisa. O catalisador guarda oxigenio dentro dele e usa esse estoque para completar as reacoes. Se ele estiver saudavel, ele absorve toda a oscilacao que vem de tras, e o gas que sai dele fica estavel. Por isso o sinal dela tem que ser quase uma linha reta, alta, entre 0,6 e 0,8 V.',
      'A ECU compara os dois desenhos. Se o de tras oscila e o da frente fica parado, o catalisador esta bom. Se o da frente comeca a copiar o desenho de tras, ele parou de converter, e nasce o codigo de eficiencia do catalisador abaixo do limite.',
      'AQUECEDOR. A zirconia so gera tensao acima de uns 300 a 350 graus. Esperar o gas de escape aquecer ela levaria minutos, e e justamente nos primeiros minutos que o carro mais polui. Por isso ela tem uma resistencia de aquecimento interna, comandada pela ECU, que a coloca em temperatura de trabalho em 20 ou 30 segundos.',
      'OS TIPOS DE SONDA. Banda estreita de zirconia: gera o proprio sinal, curva em degrau, e o padrao. Banda estreita de titania: nao gera tensao, ela MUDA DE RESISTENCIA com o oxigenio, entao precisa receber tensao da ECU; e menor e mais rapida, mas menos usada. Banda larga (LSU): a de cinco fios, mede o valor exato de lambda numa faixa ampla e e a que vai antes do catalisador nos carros modernos.',
      'OS FIOS, QUE E A DUVIDA CLASSICA. 1 fio: so o sinal, e o terra volta pela rosca no escapamento. So em carro antigo, sem aquecedor. 2 fios: sinal e terra proprio, tambem sem aquecedor. 3 fios: sinal, mais os dois do aquecedor, com o terra do sinal pela rosca. 4 fios: sinal, terra de sinal, aquecedor mais e aquecedor menos. E o arranjo mais comum hoje. 5 ou 6 fios: e banda larga, com as duas celulas mais o aquecedor.',
      'CORES. No padrao Bosch os dois fios do aquecedor sao BRANCOS e nao tem polaridade entre si; o PRETO e o sinal; o CINZA e o terra do sinal. Nao e regra universal, mas ajuda muito na hora de identificar um conector cortado.',
      'Um detalhe de montagem que muita gente esquece: a sonda respira ar do ambiente pelo proprio cabo, por dentro do isolamento. Por isso nunca se pode selar, passar cola ou emendar mal o chicote dela. Sem ar de referencia, ela mente.',
    ],
    contextPt:
      'Na cena esta o catalisador antes dela, o tubo de escape e, ao lado, a sonda de banda larga para comparar os dois tipos: a de degrau depois do catalisador e a linear antes.',
    pinsPt: [
      { pinPt: '1 fio', whatPt: 'So o sinal. O terra volta pela rosca no escape. Carro antigo, sem aquecedor', color: WIRE_SIGNAL },
      { pinPt: '2 fios', whatPt: 'Sinal e terra proprio. Ainda sem aquecedor', color: WIRE_BLACK },
      { pinPt: '3 fios', whatPt: 'Sinal mais os dois do aquecedor. Terra do sinal pela rosca', color: WIRE_RED },
      { pinPt: '4 fios', whatPt: 'Sinal, terra de sinal, aquecedor + e aquecedor -. O mais comum hoje', color: '#7127c9' },
      { pinPt: '5 ou 6 fios', whatPt: 'Banda larga: duas celulas mais aquecedor e resistor de calibracao', color: '#0f8a46' },
      { pinPt: 'Cores Bosch', whatPt: 'Dois brancos: aquecedor. Preto: sinal. Cinza: terra do sinal', color: '#8a6d10' },
    ],
    testPt: [
      'Sonda DEPOIS do catalisador com sinal oscilando igual ao da frente: o catalisador acabou. A sonda pode estar perfeita.',
      'Sonda ANTES do catalisador tem que oscilar rapido: pelo menos umas 6 a 8 travessias por 0,45 V a cada 10 segundos com o motor quente em marcha lenta.',
      'Teste de resposta: crie mistura rica (produto de limpeza aspirado pelo vacuo) e a sonda tem que ir para mais de 0,8 V na hora. Crie pobre (entrada de ar falsa) e ela tem que cair abaixo de 0,2 V. Sonda lenta e preguicosa e sonda gasta.',
      'Aquecedor: resistencia tipica de 3 a 15 ohm conforme o modelo. Aberto e sonda que so funciona depois de muito tempo rodando, e da codigo de aquecedor.',
      'Sinal preso perto de 0,45 V parado e caracteristico de sonda fria, aquecedor queimado ou fio de sinal partido: a ECU esta lendo a propria referencia interna.',
      'Vazamento de escape antes da sonda entra ar e ela le pobre para sempre. A ECU enriquece, o consumo dispara e a sonda leva a culpa.',
      'Nunca use silicone comum perto do motor. O vapor de silicone envenena a sonda de forma permanente.',
      'Rosca dela leva pasta antiengripante SOMENTE na rosca, nunca perto da ponta ceramica.',
    ],
    camDist: 14,
    parts: [
      { partId: 'lambda-sensor', pos: [2.0, 0.8, 0], scale: 1.5 },
      {
        partId: 'catalytic-converter',
        pos: [-2.0, 0, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Catalisador',
        labelAt: [-2.0, -1.2, 0],
      },
      {
        partId: 'lambda-planar',
        pos: [-6.0, 1.0, 0],
        scale: 1.2,
        dim: true,
        labelPt: 'Banda larga, antes do catalisador',
        labelAt: [-6.0, 3.0, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-8.4, 0, 0],
          [-3.6, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
      },
      {
        points: [
          [-0.4, 0, 0],
          [6.4, 0, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#7a8a99',
        flowSpeed: 0.22,
      },
    ],
    labels: [
      { textPt: 'ela mede o oxigenio que SOBROU, e nao o combustivel', pos: [2.4, 4.1, 0] },
      { textPt: 'depois do catalisador o sinal tem que ficar quase parado, de 0,6 a 0,8 V', pos: [2.4, 3.2, 0] },
      { textPt: 'pobre: perto de 0,1 V', pos: [-6.6, -1.5, 0] },
      { textPt: 'rico: perto de 0,9 V', pos: [-6.6, -2.3, 0] },
      { textPt: 'a virada acontece toda em cima de 0,45 V, que e lambda 1', pos: [-1.0, -3.3, 0] },
      { textPt: 'a sonda respira ar de referencia pelo proprio cabo: nunca sele o chicote', pos: [2.0, -2.3, 0] },
    ],
  },

  // ---------------------------------------------------------------- 27
  27: {
    oneLinePt:
      'A fonte de energia do carro parado e a referencia de tensao de todo o sistema. Bateria ruim gera defeito eletronico que parece de tudo, menos bateria.',
    bodyPt: [
      'A bateria de chumbo acido tem seis celulas de pouco mais de 2 V em serie, dando os 12 V nominais. Ela nao guarda eletricidade: ela guarda energia quimica e converte em eletricidade quando precisa.',
      'Ela tem dois trabalhos bem diferentes. O primeiro e dar o tranco da partida, que e uma corrente enorme e curta, facilmente de 200 a 400 A. O segundo e alimentar as memorias, o alarme e os modulos que ficam acordados com o carro desligado.',
      'Depois que o motor pega, quem sustenta o carro e o alternador, e nao ela. O alternador entrega algo entre 13,8 e 14,4 V, e essa diferenca para os 12 V da bateria e o que recarrega ela.',
      'Para eletronica de injecao, a tensao nao e detalhe: e informacao. A ECU calcula o tempo de abertura do injetor contando com a tensao disponivel, porque com tensao baixa o injetor demora mais para abrir. Existe um mapa de correcao de tempo morto do injetor so por causa disso.',
      'E por isso que bateria fraca causa sintomas que parecem outra coisa completamente: partida longa, marcha lenta instavel, falha de comunicacao do scanner, codigos aleatorios em varios modulos ao mesmo tempo, vidro e trava agindo sozinhos.',
      'O terra e tao importante quanto o positivo. Toda a corrente que sai pelo positivo tem que voltar pelo terra. Cabo de terra oxidado no bloco ou na carroceria da queda de tensao, e essa queda desregula os sensores, que trabalham com milivolts.',
      'Nos carros com start-stop a bateria e diferente: AGM ou EFB, feitas para aguentar muito mais ciclos de carga e descarga. Colocar uma bateria comum nesses carros mata ela em meses.',
      'Muitos carros modernos tem um sensor no polo negativo, o IBS, que mede corrente, tensao e temperatura da bateria e informa o estado de carga real para a ECU. Trocar a bateria sem registrar a troca no scanner faz o sistema continuar carregando pelo perfil da bateria velha.',
    ],
    contextPt:
      'Na cena estao a caixa de fusiveis, a alimentacao da ECU e o cabo de terra indo para o bloco do motor.',
    pinsPt: [
      { pinPt: 'Polo positivo', whatPt: 'Vai para o motor de partida, o alternador e a caixa de fusiveis', color: WIRE_RED },
      { pinPt: 'Polo negativo', whatPt: 'Terra da carroceria e do bloco do motor. Pode ter o sensor IBS', color: WIRE_BLACK },
      { pinPt: '+12 V permanente', whatPt: 'Memoria da ECU, alarme, radio e o pino 16 do OBD', color: WIRE_RED },
      { pinPt: '+12 V pos-chave', whatPt: 'Sai do rele principal e alimenta sensores e atuadores', color: '#7127c9' },
    ],
    testPt: [
      'Em repouso, com o carro desligado ha algumas horas: 12,6 V e carga cheia. 12,4 V ja e 75 por cento. Abaixo de 12,0 V ela esta descarregada e sulfatando.',
      'Com o motor rodando: de 13,8 a 14,4 V. Abaixo disso o alternador nao esta carregando; acima de 15 V o regulador esta descontrolado e vai cozinhar a bateria e os modulos.',
      'Teste de partida: durante o arranque a tensao nao pode cair abaixo de 9,5 a 10 V. Caiu mais que isso e a bateria nao aguenta mais o esforco, mesmo que parada ela marque 12,6 V.',
      'Queda de tensao no terra: ponta vermelha no polo negativo, ponta preta no bloco, motor rodando. Tem que ficar abaixo de 0,1 V. Acima disso, limpe e reaperte o terra.',
      'Fuga de corrente com o carro dormindo: normalmente de 20 a 50 mA depois que os modulos entram em repouso, o que pode levar alguns minutos. Muito acima disso, procure o consumidor tirando fusivel por fusivel.',
      'Antes de condenar qualquer modulo por comportamento estranho, teste a bateria e os terras. E o passo que mais economiza tempo e dinheiro em diagnostico.',
      'Ao desligar a bateria, lembre que a ECU perde os valores aprendidos. O motor pode ficar com marcha lenta estranha ate reaprender.',
    ],
    camDist: 13,
    parts: [
      { partId: 'battery', pos: [-3.6, 0.6, 0], scale: 1.6, titleAt: [-1.5, 3.2, 0] },
      { partId: 'ecu', pos: [4.2, 0.6, 0], scale: 1.0, dim: true, labelPt: 'ECU', labelAt: [4.2, 1.9, 0] },
      {
        partId: 'ibs-sensor',
        pos: [-4.4, 2.9, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Sensor IBS no polo negativo',
        labelAt: [-4.6, 4.0, 0],
      },
    ],
    boxes: [
      { pos: [0.4, 1.6, 0], size: [1.0, 1.2, 0.9], color: '#3d4657', labelPt: 'Fusiveis e reles', labelAt: [2.2, 1.6, 0] },
      { pos: [0.4, -3.0, 0], size: [6.0, 0.8, 1.4], color: '#2b313d', labelPt: 'Bloco do motor', labelAt: [0.4, -4.0, 0] },
    ],
    pipes: [
      {
        points: [
          [-2.6, 2.6, 0],
          [-2.6, 3.6, 0],
          [0.4, 3.6, 0],
          [0.4, 2.25, 0],
        ],
        r: 0.09,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: '+12 V',
        labelAt: [-1.2, 4.0, 0],
      },
      {
        points: [
          [0.9, 1.6, 0],
          [2.6, 1.6, 0],
          [2.6, 0.7, 0],
          [3.25, 0.7, 0],
        ],
        r: 0.07,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
      },
      {
        points: [
          [-4.4, 2.5, 0],
          [-6.4, 2.5, 0],
          [-6.4, -3.0, 0],
          [-2.7, -3.0, 0],
        ],
        r: 0.09,
        color: WIRE_BLACK,
        flow: ELEC,
        flowSpeed: 0.3,
      },
      {
        points: [
          [4.2, 0.1, 0],
          [4.2, -2.7, 0],
        ],
        r: 0.07,
        color: WIRE_BLACK,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'terra da ECU',
        labelAt: [5.5, -1.4, 0],
      },
    ],
    labels: [
      { textPt: 'parada: 12,6 V. Motor rodando: de 13,8 a 14,4 V', pos: [-3.6, -1.2, 0] },
      { textPt: 'na partida nao pode cair abaixo de 9,5 V', pos: [-3.6, -2.0, 0] },
      { textPt: 'a ECU corrige o tempo do injetor pela tensao da bateria', pos: [1.4, -1.9, 0] },
      { textPt: 'queda no terra tem que ser menor que 0,1 V', pos: [0.4, -4.9, 0] },
    ],
  },
};

export function hasFocus(numero: number): boolean {
  return numero in PART_FOCUS;
}

export { EXH_PIPE, FUEL_PIPE, HOSE, METAL_PIPE, WIRE_BLACK, WIRE_RED, WIRE_SIGNAL };
