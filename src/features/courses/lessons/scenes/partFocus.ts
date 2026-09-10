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
  /** Fluxo comandado pela borboleta, ou pela janela da EGR com 'egr'. */
  gated?: boolean | 'egr' | 'gdi' | 'knock';
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
      'Ela tambem fala com o resto do carro pela rede CAN: painel, cambio, ABS, imobilizador. E e ela que guarda os codigos de falha que o scanner le. Na maioria dos carros a CAN nao chega direto no conector de diagnostico: passa por um gateway, que separa a rede do motor da rede da carroceria.',
      'A bateria nao conversa com a ECU: so entrega energia, e ela chega pela caixa de fusiveis. O fusivel protege o fio, nao a peca. E quem realmente liga a injecao e o rele principal, com a bobina aterrada pela propria ECU. Por isso ela continua ligada alguns segundos depois de voce tirar a chave: e o afterrun, ela terminando de gravar os dados e so entao soltando o proprio rele.',
      'Do lado de fora, o que existe mesmo e o chicote: uma capa corrugada fechada, com 60 a 200 fios dedicados, um para cada sensor e cada atuador. Eles so abrem em leque nos pontos de saida. E a ECU tem mais de um terra: um grosso para a parte de potencia e outro fino para a eletronica, separados de proposito para o ruido de um nao sujar o sinal do outro.',
    ],
    contextPt:
      'A cena esta dividida por regiao: a esquerda a energia, com bateria, caixa de fusiveis e o rele principal; embaixo os terras parafusados no bloco; a direita a rede CAN passando pelo gateway ate o conector de diagnostico; e na frente o chicote, com a capa corrugada fechada e o leque de fios abrindo so no ponto de saida.',
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
      'Rede CAN com a chave desligada mede cerca de 60 ohm entre CAN H e CAN L: sao os dois resistores de 120 ohm em paralelo, cada um dentro de um modulo da ponta.',
      'ECU e a ULTIMA peca a se trocar. A esmagadora maioria dos casos e chicote, conector oxidado ou terra.',
    ],
    camDist: 15,
    camTarget: [0.3, 0.2, 0],
    parts: [
      { partId: 'ecu', pos: [0, 1.6, 0], scale: 1.3 },
      { partId: 'battery', pos: [-7.2, 4.6, 0], scale: 0.7, dim: true },
      {
        partId: 'fuse-box',
        pos: [-6.4, 1.6, 0],
        scale: 1.2,
        dim: true,
        labelPt: 'Caixa de fusiveis e reles',
        labelAt: [-6.4, 3.1, 0],
      },
      { partId: 'wiring-harness', pos: [3.52, 0.16, 0], scale: 1.0, rot: [0, 0, -0.6], dim: true },
      {
        partId: 'obd-connector',
        pos: [7.6, 1.2, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Diagnostico OBD2',
        labelAt: [7.6, 0.1, 0],
      },
    ],
    boxes: [
      {
        pos: [5.2, 2.6, 0],
        size: [0.9, 0.9, 0.8],
        color: '#8a6d10',
        labelPt: 'Gateway',
        labelAt: [5.2, 3.7, 0],
      },
      {
        pos: [-1.0, -5.0, 0],
        size: [7.0, 0.5, 1.2],
        color: '#2b313d',
        labelPt: 'Bloco do motor',
        labelAt: [-6.4, -5.0, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-7.2, 3.75, 0],
          [-7.2, 2.35, 0],
        ],
        r: 0.09,
        color: WIRE_RED,
      },
      {
        points: [
          [-5.44, 1.6, 0],
          [-1.9, 1.6, 0],
        ],
        r: 0.09,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: '+12 V pelo rele principal',
        labelAt: [-3.7, 2.4, 0],
      },
      {
        points: [
          [-1.0, 0.74, 0],
          [-1.0, 0.0, 0],
          [-6.7, 0.0, 0],
          [-6.7, 0.88, 0],
        ],
        r: 0.05,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'a ECU segura o rele ligado depois da chave',
        labelAt: [-3.9, -0.7, 0],
      },
      {
        points: [
          [-0.6, 0.74, 0],
          [-0.6, -4.75, 0],
        ],
        r: 0.1,
        color: WIRE_BLACK,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'dois terras: potencia e eletronica',
        labelAt: [-3.4, -2.6, 0],
      },
      {
        points: [
          [0.2, 0.74, 0],
          [0.2, -4.75, 0],
        ],
        r: 0.055,
        color: WIRE_BLACK,
      },
      {
        points: [
          [1.9, 2.0, 0],
          [4.2, 2.0, 0],
          [4.2, 2.6, 0],
          [4.75, 2.6, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.34,
        labelPt: 'Rede CAN: par trancado',
        labelAt: [3.2, 2.7, 0],
      },
      {
        points: [
          [5.65, 2.6, 0],
          [7.6, 2.6, 0],
          [7.6, 1.9, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
      },
      {
        points: [
          [7.4, -0.5, 0],
          [6.3, -0.5, 0],
          [5.15, -0.95, 0],
        ],
        r: 0.07,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'sinal do sensor',
        labelAt: [8.0, -0.5, 0],
      },
      {
        points: [
          [5.35, -1.5, 0],
          [6.5, -1.9, 0],
          [7.4, -1.9, 0],
        ],
        r: 0.07,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'comando pelo terra',
        labelAt: [8.1, -1.9, 0],
      },
      {
        points: [
          [5.0, -2.1, 0],
          [6.2, -3.0, 0],
          [7.4, -3.0, 0],
        ],
        r: 0.07,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'referencia 5 V',
        labelAt: [8.0, -3.0, 0],
      },
    ],
    labels: [
      { textPt: '120 ohm dentro de cada modulo', pos: [6.6, 3.6, 0] },
      { textPt: 'o rele liga a carga; a ECU so aterra a bobina', pos: [-6.2, -1.6, 0] },
      { textPt: 'e mais 60 a 200 fios iguais dentro da capa', pos: [3.4, -4.0, 0] },
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
      'Repare nas cavidades vazias: quase nenhum carro monta as 16 vias. So entram as que aquele modelo usa, e boa parte das sobrando e reservada para o fabricante. Cavidade vazia nao e fio arrancado.',
      'A tomada e femea: quem tem as laminas de metal e o plugue do scanner. Ela fica presa no painel por duas orelhas e tem uma trava em cima, que e o clique que voce sente ao encaixar. E na maioria dos carros a CAN nao chega crua nela: passa antes por um gateway, que separa a rede do motor da rede da carroceria.',
    ],
    contextPt:
      'A cena mostra a tomada de frente: as vias montadas estao coloridas pela funcao e as cavidades vazias sao as que o fabricante nao usou. Atras dela chegam os fios de verdade: +12 V pela caixa de fusiveis, terra no chassi e a rede CAN vindo do gateway, com os modulos do carro pendurados no mesmo par.',
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
      'Bateria desligada, resistencia entre os pinos 6 e 14 tem que dar perto de 60 ohm. Sao os dois resistores de 120 ohm em paralelo, cada um dentro de um modulo da ponta. Se der 120, uma ponta da rede esta aberta.',
      'Cavidade vazia nao e defeito: quase nenhum carro monta as 16 vias. Antes de suspeitar de fio arrancado, confere o pinout daquele modelo.',
    ],
    camDist: 13,
    camTarget: [0, 0.6, 0],
    parts: [
      { partId: 'obd-connector', pos: [0, 0, 0], scale: 1.6, titleAt: [4.4, -3.4, 0] },
      { partId: 'ecu', pos: [-5.4, 4.4, 0], scale: 0.85, dim: true, labelPt: 'ECU do motor', labelAt: [-5.4, 5.6, 0] },
      {
        partId: 'mil-lamp',
        pos: [5.4, 4.4, 0],
        scale: 0.85,
        dim: true,
        labelPt: 'Painel de instrumentos',
        labelAt: [5.4, 5.6, 0],
      },
      { partId: 'battery', pos: [-6.4, -2.2, 0], scale: 0.65, dim: true },
      {
        partId: 'fuse-box',
        pos: [-3.9, -2.2, 0],
        scale: 0.5,
        dim: true,
        labelPt: 'fusivel do conector',
        labelAt: [-3.9, -3.3, 0],
      },
    ],
    boxes: [
      { pos: [0, 3.0, 0], size: [0.9, 0.9, 0.8], color: '#8a6d10', labelPt: 'Gateway', labelAt: [0, 4.1, 0] },
      {
        pos: [-1.0, -4.2, 0],
        size: [4.0, 0.4, 1.0],
        color: '#2b313d',
        labelPt: 'Terra no chassi',
        labelAt: [-4.8, -4.2, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-5.4, 3.0, 0],
          [5.4, 3.0, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.34,
        labelPt: 'Barramento CAN: todos no mesmo par',
        labelAt: [-2.9, 2.35, 0],
      },
      {
        points: [
          [-5.4, 3.85, 0],
          [-5.4, 3.0, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
      },
      {
        points: [
          [5.4, 3.9, 0],
          [5.4, 3.0, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
      },
      {
        points: [
          [0, 2.55, -0.6],
          [0, 2.2, -0.6],
          [2.6, 2.2, -0.6],
          [2.6, 0.0, -0.6],
          [1.2, 0.0, -0.6],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.3,
      },
      {
        points: [
          [-5.9, -2.2, 0],
          [-4.6, -2.2, 0],
        ],
        r: 0.08,
        color: WIRE_RED,
      },
      {
        points: [
          [-3.3, -2.2, -0.6],
          [-1.4, -2.2, -0.6],
          [-1.4, -0.5, -0.6],
          [-0.4, -0.5, -0.6],
        ],
        r: 0.08,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
      },
      {
        points: [
          [0.4, -1.2, -0.6],
          [0.4, -4.0, -0.6],
        ],
        r: 0.08,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-0.14, 0.21, 0.4],
          [-1.9, 1.5, 0.4],
          [-2.9, 1.5, 0.4],
        ],
        r: 0.04,
        color: '#7b8494',
        labelPt: 'pinos 4 e 5: terras',
        labelAt: [-4.4, 1.5, 0],
      },
      {
        points: [
          [0.41, 0.21, 0.4],
          [1.9, 1.5, 0.4],
          [2.9, 1.5, 0.4],
        ],
        r: 0.04,
        color: '#d6b129',
        labelPt: 'pinos 6 e 14: CAN',
        labelAt: [4.3, 1.5, 0],
      },
      {
        points: [
          [0.95, -0.21, 0.4],
          [2.2, -1.5, 0.4],
          [3.0, -1.5, 0.4],
        ],
        r: 0.04,
        color: WIRE_RED,
        labelPt: 'pino 16: +12 V permanente',
        labelAt: [4.8, -1.5, 0],
      },
    ],
    labels: [
      { textPt: '120 ohm dentro dos modulos', pos: [3.2, 2.35, 0] },
      { textPt: 'cavidade vazia: via nao usada', pos: [1.4, -2.5, 0] },
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
      'Isso vale para carro de rede. Em carro antigo, antes da CAN, era fio direto mesmo: o painel dava +12 V para a lampada e a ECU aterrava o outro lado para acender. E o mesmo comando por terra que ela usa nos atuadores.',
      'Luz apagada nao significa carro sem problema. Existe muito codigo pendente que ainda nao acendeu a luz, e existe defeito mecanico que a ECU nao enxerga.',
      'E hoje quase nao existe mais lampada ali: e LED soldado na placa do painel. Espia que nao acende no autoteste raramente e LED queimado, quase sempre e alguem que apagou de proposito para esconder defeito.',
    ],
    contextPt:
      'A cena mostra os tres estados lado a lado, do mesmo painel: apagada com o motor rodando, acesa fixa e piscando. Em cima, a ordem saindo da ECU pela CAN e chegando no modulo do painel, que e quem de fato acende o LED.',
    pinsPt: [
      { pinPt: 'Sem fio direto', whatPt: 'A ECU nao aciona a lampada, ela envia a mensagem pela CAN', color: '#8a6d10' },
      { pinPt: 'Alimentacao', whatPt: 'A lampada e alimentada pelo proprio painel', color: WIRE_RED },
    ],
    testPt: [
      'Luz nao acende ao girar a chave: ou o LED foi apagado no software, ou alguem tirou de proposito. Isso e classico em carro de revenda.',
      'Luz acesa e o scanner nao acha codigo: leia todos os modulos, nao so o motor. Cambio e ABS tambem acendem espia.',
      'Luz piscando: nao rode o carro. Faca teste de compressao e cheque bobina, vela e injetor do cilindro que o codigo aponta.',
      'Apagar a luz sem consertar a causa nao resolve. Ela volta no proximo ciclo de teste.',
    ],
    camDist: 12,
    camTarget: [0, 0.8, 0],
    parts: [
      { partId: 'mil-lamp-off', pos: [-4.0, 0.4, 0], scale: 1.0, labelPt: 'apagada: normal', labelAt: [-4.0, -1.2, 0] },
      { partId: 'mil-lamp', pos: [0, 0.4, 0], scale: 1.0, labelPt: 'acesa fixa: tem codigo', labelAt: [0, -1.2, 0] },
      {
        partId: 'mil-lamp-blink',
        pos: [4.0, 0.4, 0],
        scale: 1.0,
        labelPt: 'piscando: pare o carro',
        labelAt: [4.0, -1.2, 0],
      },
      { partId: 'ecu', pos: [-5.0, 3.8, 0], scale: 0.8, dim: true, labelPt: 'ECU do motor', labelAt: [-5.0, 4.8, 0] },
    ],
    boxes: [
      {
        pos: [0, 3.8, 0],
        size: [1.3, 0.8, 0.7],
        color: '#3d4657',
        labelPt: 'Modulo do painel',
        labelAt: [0, 4.8, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-4.3, 3.8, 0],
          [-0.65, 3.8, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'a ordem de acender vem pela CAN',
        labelAt: [-2.5, 3.1, 0],
      },
      {
        points: [
          [0, 3.4, -0.3],
          [0, 2.6, -0.3],
          [-4.0, 2.6, -0.3],
          [-4.0, 1.3, -0.3],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
      },
      {
        points: [
          [0, 2.6, -0.3],
          [0, 1.3, -0.3],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
      },
      {
        points: [
          [0, 2.6, -0.3],
          [4.0, 2.6, -0.3],
          [4.0, 1.3, -0.3],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        labelPt: 'quem acende o LED e o painel',
        labelAt: [4.4, 3.1, 0],
      },
    ],
    labels: [
      { textPt: 'ao girar a chave todas acendem: e o autoteste', pos: [0, -2.1, 0] },
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
      'A antena em si e burra: e so uma bobina de duas pontas, sem alimentacao e sem rede. Quem energiza, le, confere o codigo e libera e o modulo do imobilizador. Em muitos carros esse modulo esta dentro do proprio painel ou do BCM.',
      'Em carro de botao start-stop nao ha cilindro: a antena vira uma bobina no porta-chaves ou na coluna, e o botao tem uma bobina de emergencia para encostar a chave quando a bateria do telecomando morre.',
    ],
    contextPt:
      'A cena segue o caminho inteiro: a antena energiza o chip por inducao e recebe o codigo de volta, manda pelos dois fios para o modulo do imobilizador, o modulo libera pela rede e so entao a ECU solta injecao e ignicao. Sem essa liberacao, o corte acontece na ECU.',
    pinsPt: [
      { pinPt: 'Bobina da antena', whatPt: 'So dois fios, energiza o chip da chave por inducao', color: '#7127c9' },
      { pinPt: 'Modulo', whatPt: 'E ele que confere o codigo, nao a antena', color: WIRE_SIGNAL },
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
    camDist: 12,
    camTarget: [1.4, 0.4, 0],
    parts: [
      { partId: 'immobilizer-antenna', pos: [-2.6, 0.8, 0], scale: 1.2 },
      { partId: 'ecu', pos: [6.4, 3.4, 0], scale: 0.8, dim: true, labelPt: 'ECU do motor', labelAt: [6.4, 4.5, 0] },
    ],
    boxes: [
      {
        pos: [2.0, 0.6, 0],
        size: [1.2, 0.9, 0.7],
        color: '#3d4657',
        labelPt: 'Modulo do imobilizador',
        labelAt: [2.0, 1.9, 0],
      },
      {
        pos: [0.2, 3.4, 0],
        size: [0.7, 0.5, 0.4],
        color: '#c9a227',
        labelPt: 'luz do cadeado no painel',
        labelAt: [0.2, 4.3, 0],
      },
      { pos: [6.4, 1.6, 0], size: [0.55, 0.22, 0.55], color: '#c62222', labelPt: 'sem liberacao a ECU corta', labelAt: [4.3, 1.6, 0] },
      { pos: [5.2, -1.1, 0], size: [1.1, 0.8, 0.6], color: '#7127c9', labelPt: 'injecao', labelAt: [5.2, -2.0, 0] },
      { pos: [7.6, -1.1, 0], size: [1.1, 0.8, 0.6], color: '#7127c9', labelPt: 'ignicao', labelAt: [7.6, -2.0, 0] },
    ],
    pipes: [
      {
        points: [
          [-2.9, 2.6, 0],
          [-4.5, 2.6, 0],
        ],
        r: 0.07,
        color: '#7127c9',
        tube: false,
        flow: '#7127c9',
        flowSpeed: 0.26,
        labelPt: 'a antena energiza o chip',
        labelAt: [-3.7, 3.3, 0],
      },
      {
        points: [
          [-4.5, -1.0, 0],
          [-2.9, -1.0, 0],
        ],
        r: 0.07,
        color: WIRE_SIGNAL,
        tube: false,
        flow: WIRE_SIGNAL,
        flowSpeed: 0.26,
        labelPt: 'o chip responde com o codigo',
        labelAt: [-3.7, -1.7, 0],
      },
      {
        points: [
          [-2.84, -0.6, 0],
          [-2.84, -2.9, 0],
          [2.0, -2.9, 0],
          [2.0, 0.15, 0],
        ],
        r: 0.06,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'a bobina so tem dois fios',
        labelAt: [-0.4, -3.5, 0],
      },
      {
        points: [
          [2.0, 1.05, 0],
          [2.0, 3.4, 0],
          [5.3, 3.4, 0],
        ],
        r: 0.07,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'liberacao pela rede',
        labelAt: [3.5, 4.1, 0],
      },
      {
        points: [
          [2.0, 3.4, 0],
          [0.55, 3.4, 0],
        ],
        r: 0.05,
        color: '#8a6d10',
      },
      {
        points: [
          [6.4, 2.85, 0],
          [6.4, 0.4, 0],
          [5.2, 0.4, 0],
          [5.2, -0.7, 0],
        ],
        r: 0.07,
        color: '#7127c9',
      },
      {
        points: [
          [6.4, 0.4, 0],
          [7.6, 0.4, 0],
          [7.6, -0.7, 0],
        ],
        r: 0.07,
        color: '#7127c9',
      },
    ],
    labels: [{ textPt: 'codigo errado: pega e morre', pos: [-0.6, 2.6, 0] }],
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
      'E cuidado com a ideia de "uma rede so". O carro tem varias: a do motor, rapida, com ECU, cambio e ABS; a da carroceria, mais lenta, com vidro, porta e ar; alem de linhas LIN para coisa simples. Quem costura tudo isso e o gateway, que tambem e a porta de entrada do scanner.',
    ],
    contextPt:
      'A cena mostra o par trancado com os modulos pendurados nele, cada um puxando os DOIS fios, e os 120 ohm dentro dos modulos das pontas. Em cima, o osciloscopio mostra o que acontece num bit: CAN H sobe e CAN L desce ao mesmo tempo.',
    pinsPt: [
      { pinPt: 'CAN H', whatPt: 'Linha alta. Repouso 2,5 V, sobe para cerca de 3,5 V', color: '#d6b129' },
      { pinPt: 'CAN L', whatPt: 'Linha baixa. Repouso 2,5 V, desce para cerca de 1,5 V', color: '#8a6d10' },
      { pinPt: 'Resistores', whatPt: '120 ohm dentro de cada modulo de ponta. Em paralelo dao 60 ohm', color: WIRE_BLACK },
    ],
    testPt: [
      'Chave desligada e bateria desconectada: entre CAN H e CAN L tem que dar perto de 60 ohm. Deu 120, uma ponta abriu. Deu infinito, o barramento esta partido.',
      'Chave ligada: CAN H perto de 2,6 V e CAN L perto de 2,4 V contra o terra. Os dois em 0 V e curto para o terra; os dois em 12 V e curto com a alimentacao.',
      'Scanner que ve alguns modulos e outros nao geralmente e um ramo da rede aberto, e nao defeito dos modulos que sumiram.',
      'Um unico modulo em curto derruba a rede inteira. Desconectando um por um, o que voltar a rede quando sai e o culpado.',
      'Nunca destrance os fios da CAN nem estenda so um deles. Perdendo a trancagem, o carro passa a dar falhas aleatorias com o motor rodando.',
    ],
    camDist: 15,
    camTarget: [0, 0.4, 0],
    parts: [
      { partId: 'can-bus', pos: [0, 0, 0], scale: 1.0 },
      { partId: 'can-scope', pos: [0, 3.9, 0], scale: 1.0 },
      { partId: 'ecu', pos: [-6.4, 3.0, 0], scale: 0.85, dim: true, labelPt: 'ECU do motor', labelAt: [-6.4, 4.2, 0] },
      {
        partId: 'immobilizer-antenna',
        pos: [-3.0, -3.2, 0],
        scale: 0.8,
        dim: true,
        labelPt: 'Imobilizador',
        labelAt: [-3.0, -4.8, 0],
      },
      { partId: 'mil-lamp', pos: [6.4, 3.0, 0], scale: 0.85, dim: true, labelPt: 'Painel', labelAt: [6.4, 4.2, 0] },
      {
        partId: 'obd-connector',
        pos: [6.4, -3.2, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Diagnostico OBD2',
        labelAt: [6.4, -4.4, 0],
      },
    ],
    boxes: [
      { pos: [3.0, 2.6, 0], size: [0.9, 0.9, 0.8], color: '#8a6d10', labelPt: 'Gateway', labelAt: [3.0, 3.7, 0] },
      { pos: [-6.4, 3.0, 0.7], size: [0.3, 0.3, 0.3], color: '#d6b129', labelPt: '120 ohm aqui dentro', labelAt: [-7.4, 1.9, 0] },
      { pos: [6.4, 3.0, 0.7], size: [0.3, 0.3, 0.3], color: '#d6b129', labelPt: '120 ohm aqui dentro', labelAt: [7.4, 1.9, 0] },
      ...[-6.4, -3.0, 3.0, 6.4].map((x) => ({
        pos: [x, 0, 0] as Vec3,
        size: [0.3, 0.52, 0.34] as Vec3,
        color: '#2b313d',
      })),
    ],
    pipes: [
      {
        points: [
          [-6.4, 0.14, 0],
          [-2.0, 0.14, 0],
        ],
        r: 0.06,
        color: '#d6b129',
        flow: ELEC,
        flowSpeed: 0.36,
        labelPt: 'CAN H',
        labelAt: [-4.6, 0.8, 0],
      },
      {
        points: [
          [2.0, 0.14, 0],
          [6.4, 0.14, 0],
        ],
        r: 0.06,
        color: '#d6b129',
        flow: ELEC,
        flowSpeed: 0.36,
      },
      {
        points: [
          [-6.4, -0.14, 0],
          [-2.0, -0.14, 0],
        ],
        r: 0.06,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.36,
        labelPt: 'CAN L',
        labelAt: [-4.6, -0.9, 0],
      },
      {
        points: [
          [2.0, -0.14, 0],
          [6.4, -0.14, 0],
        ],
        r: 0.06,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.36,
      },
      ...([
        [-6.4, 2.5],
        [6.4, 2.5],
        [3.0, 2.15],
      ] as [number, number][]).flatMap(([x, y]) => [
        { points: [[x - 0.1, 0.14, 0], [x - 0.1, y, 0]] as Vec3[], r: 0.05, color: '#d6b129' },
        { points: [[x + 0.1, -0.14, 0], [x + 0.1, y, 0]] as Vec3[], r: 0.05, color: '#8a6d10' },
      ]),
      { points: [[-3.1, 0.14, 0], [-3.1, -2.6, 0]], r: 0.05, color: '#d6b129' },
      { points: [[-2.9, -0.14, 0], [-2.9, -2.6, 0]], r: 0.05, color: '#8a6d10' },
      {
        points: [
          [3.45, 2.6, -0.6],
          [8.2, 2.6, -0.6],
          [8.2, -3.2, -0.6],
          [7.3, -3.2, -0.6],
        ],
        r: 0.06,
        color: '#8a6d10',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'rede de diagnostico',
        labelAt: [6.6, 1.0, 0],
      },
    ],
    labels: [
      { textPt: '3,5 V', pos: [-2.6, 4.45, 0] },
      { textPt: '2,5 V', pos: [-2.6, 3.9, 0] },
      { textPt: '1,5 V', pos: [-2.6, 3.35, 0] },
      { textPt: 'CAN H sobe e CAN L desce junto: le-se a diferenca', pos: [0, 5.4, 0] },
      { textPt: 'trancados para pegarem o mesmo ruido', pos: [0, -1.2, 0] },
      { textPt: 'cada modulo puxa os dois fios', pos: [0, -2.0, 0] },
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
      'Repare que o EVAP e um circuito fechado, e nao uma mangueira solta. O vapor nasce em cima da gasolina no tanque, fica preso no carvao do canister e so sai quando a purga abre. Para sair, precisa entrar ar limpo pelo outro bocal do canister: sem essa entrada de ar, o motor tenta chupar de um pote lacrado e nao vem nada.',
      'E a tampa do tanque faz parte do sistema. Ela e que fecha esse circuito. Mal rosqueada, o ar entra por onde nao devia, a ECU nao consegue fazer o teste de estanqueidade e acende a luz. E o motivo numero um de codigo de EVAP no mundo inteiro.',
    ],
    contextPt:
      'A cena segue o vapor do comeco ao fim: nasce no tanque, fica preso no carvao do canister, passa pela valvula de purga aberta em PWM e e chupado pelo vacuo do coletor. Embaixo entra o ar limpo que empurra o vapor para fora, e a sonda lambda fecha o laco avisando a ECU.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '+12 V pos-chave, vindo do rele principal', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Comando por terra da ECU, pulsado em PWM', color: '#7127c9' },
    ],
    testPt: [
      'Resistencia da bobina entre os dois pinos: normalmente de 20 a 30 ohm. Aberta ou em curto, troca.',
      'Sopro pelo lado do canister com a valvula desligada: nao pode passar ar. Passou, ela esta travada aberta.',
      'Valvula travada aberta da marcha lenta oscilando, motor morrendo ao parar no semaforo e cheiro de combustivel. E um dos defeitos mais mal diagnosticados que existe.',
      'No scanner de um lado, com o motor quente em marcha lenta, force a purga para 100 por cento: a rotacao tem que mexer. Nao mexeu nada, a valvula ou a mangueira estao entupidas.',
      'Antes de trocar qualquer coisa por codigo de EVAP, aperte a tampa do tanque e confira a borracha dela. E a causa mais comum de todas.',
      'Canister encharcado de gasolina liquida entope o carvao e ainda deixa passar combustivel para o coletor. Isso acontece em quem completa o tanque depois que a bomba desarma.',
    ],
    camDist: 14,
    camTarget: [0, 0.3, 0],
    parts: [
      { partId: 'purge-valve', pos: [1.8, 1.4, 0], scale: 1.5, titleAt: [4.0, -1.4, 0] },
      {
        partId: 'fuel-tank-cap',
        pos: [-7.2, -1.0, 0],
        scale: 0.8,
        dim: true,
        labelPt: 'Tanque: o vapor nasce aqui',
        labelAt: [-7.2, -2.3, 0],
      },
      {
        partId: 'canister',
        pos: [-2.8, -1.2, 0],
        scale: 1.3,
        dim: true,
        labelPt: 'Canister: o carvao segura o vapor',
        labelAt: [-2.8, -2.7, 0],
      },
      { partId: 'ecu', pos: [1.8, 4.8, 0], scale: 0.8, dim: true, labelPt: 'ECU', labelAt: [1.8, 5.75, 0] },
      {
        partId: 'lambda-sensor',
        pos: [6.4, -1.8, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Sonda lambda',
        labelAt: [6.4, -3.3, 0],
      },
    ],
    boxes: [
      {
        pos: [6.4, 1.4, 0],
        size: [0.6, 2.2, 1.4],
        color: '#3d4657',
        labelPt: 'Coletor: aqui tem vacuo',
        labelAt: [7.3, 2.9, 0],
      },
      {
        pos: [-1.6, 4.8, 0],
        size: [0.8, 0.8, 0.6],
        color: '#8a6d10',
        labelPt: 'Rele principal',
        labelAt: [-1.6, 5.6, 0],
      },
      {
        pos: [-0.9, -3.4, 0],
        size: [0.75, 0.5, 0.5],
        color: '#5b9bd5',
        labelPt: 'entrada de ar fresco',
        labelAt: [-0.9, -4.2, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-6.6, -0.24, 0],
          [-6.6, 1.1, 0],
          [-3.385, 1.1, 0],
          [-3.385, 0.1, 0],
        ],
        r: 0.1,
        color: HOSE,
        flow: '#c2610a',
        flowSpeed: 0.1,
        labelPt: 'vapor do tanque',
        labelAt: [-5.0, 1.7, 0],
      },
      {
        points: [
          [-0.9, -3.1, 0],
          [-0.9, 0.7, 0],
          [-2.215, 0.7, 0],
          [-2.215, 0.1, 0],
        ],
        r: 0.1,
        color: HOSE,
        flow: '#5b9bd5',
        flowSpeed: 0.18,
        gated: true,
      },
      {
        points: [
          [-2.8, 0.1, 0],
          [-2.8, 1.4, 0],
          [0.36, 1.4, 0],
        ],
        r: 0.1,
        color: HOSE,
        flow: '#e08a1e',
        flowSpeed: 0.14,
        gated: true,
      },
      {
        points: [
          [3.24, 1.4, 0],
          [6.1, 1.4, 0],
        ],
        r: 0.1,
        color: HOSE,
        flow: '#e08a1e',
        flowSpeed: 0.2,
        gated: true,
        labelPt: 'o vacuo do motor puxa o vapor',
        labelAt: [4.4, 0.0, 0],
      },
      {
        points: [
          [-1.6, 4.4, 0],
          [-1.6, 3.3, 0],
          [1.65, 3.3, 0],
          [1.65, 2.66, 0],
        ],
        r: 0.06,
        color: WIRE_RED,
      },
      {
        points: [
          [1.95, 4.35, 0],
          [1.95, 2.66, 0],
        ],
        r: 0.06,
        color: '#7127c9',
      },
      {
        points: [
          [7.1, -1.8, 0],
          [8.7, -1.8, 0],
          [8.7, 5.0, 0],
          [2.9, 5.0, 0],
        ],
        r: 0.06,
        color: WIRE_SIGNAL,
      },
    ],
    labels: [
      { textPt: 'sem energia a mola fecha', pos: [0.4, -0.3, 0] },
      { textPt: 'PWM: a ECU pulsa o terra', pos: [3.7, 3.6, 0] },
      { textPt: '+12 V do rele principal', pos: [-0.5, 3.7, 0] },
      { textPt: 'a lambda vigia: enriqueceu, fecha a purga', pos: [6.2, 5.6, 0] },
      { textPt: 'sem ar entrando, vapor nenhum sai', pos: [1.4, -2.6, 0] },
      { textPt: 'tampa mal fechada ja da codigo de EVAP', pos: [-6.4, -3.7, 0] },
    ],
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
      'E o motor eletrico nao mexe a borboleta direto: entre ele e o eixo tem um trem de engrenagens de reducao. E por isso que a borboleta consegue ser rapida e forte ao mesmo tempo, e tambem por isso que forcar a borboleta na mao com o motor ligado estraga o conjunto.',
    ],
    contextPt:
      'A cena inteira anda junta: o pedal desce, os dois pontos sobem no grafico das rampas, a ECU decide e a borboleta abre na mesma hora. Nao ha cabo nenhum entre o pedal e a borboleta, so fios.',
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
      'Antes de condenar o pedal, confira os 5 V e o terra dos sensores. Referencia caida ou terra ruim derruba as duas leituras juntas e imita defeito de sensor.',
    ],
    camDist: 15,
    camTarget: [0, 0.4, 0],
    parts: [
      { partId: 'throttle-body', pos: [4.2, 0, 0], scale: 1.5, titleAt: [5.6, 2.4, 0] },
      {
        partId: 'app-sensor',
        pos: [-7.0, -2.6, 0],
        scale: 1.2,
        dim: true,
        labelPt: 'Pedal do acelerador',
        labelAt: [-7.0, -4.6, 0],
      },
      { partId: 'pedal-trace', pos: [-6.4, 3.4, 0], scale: 1.0 },
      { partId: 'ecu', pos: [-0.6, 3.4, 0], scale: 0.9, dim: true, labelPt: 'ECU decide a abertura', labelAt: [-0.6, 4.9, 0] },
    ],
    boxes: [
      {
        pos: [7.6, 0, 0],
        size: [0.6, 2.2, 1.4],
        color: '#3d4657',
        labelPt: 'Coletor de admissao',
        labelAt: [7.6, -1.9, 0],
      },
    ],
    pipes: [
      {
        points: [
          [1.2, 0, 0],
          [2.85, 0, 0],
        ],
        r: 0.36,
        color: METAL_PIPE,
        labelPt: 'ar entra',
        labelAt: [1.0, 1.7, 0],
      },
      {
        points: [
          [5.55, 0, 0],
          [7.3, 0, 0],
        ],
        r: 0.36,
        color: METAL_PIPE,
      },
      {
        points: [
          [1.2, 0, 0],
          [7.3, 0, 0],
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
          [-5.55, -3.05, 0],
          [-3.9, -3.05, 0],
          [-3.9, 3.7, 0],
          [-1.6, 3.7, 0],
        ],
        r: 0.045,
        color: WIRE_RED,
      },
      {
        points: [
          [-5.55, -3.2, 0],
          [-3.7, -3.2, 0],
          [-3.7, 3.55, 0],
          [-1.6, 3.55, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-5.55, -3.35, 0],
          [-3.5, -3.35, 0],
          [-3.5, 3.4, 0],
          [-1.6, 3.4, 0],
        ],
        r: 0.045,
        color: WIRE_SIGNAL,
        labelPt: 'dois sinais do pedal, mais 5 V e terra',
        labelAt: [-3.4, -4.6, 0],
      },
      {
        points: [
          [-5.55, -3.5, 0],
          [-3.3, -3.5, 0],
          [-3.3, 3.25, 0],
          [-1.6, 3.25, 0],
        ],
        r: 0.045,
        color: '#7127c9',
      },
      {
        points: [
          [1.05, 3.7, 0],
          [1.55, 3.7, 1.5],
          [1.55, -1.75, 1.5],
          [4.5, -1.8, 1.0],
        ],
        r: 0.045,
        color: WIRE_RED,
        labelPt: 'motor eletrico e as duas leituras de volta',
        labelAt: [2.8, 4.5, 0],
      },
      {
        points: [
          [1.05, 3.55, 0],
          [1.72, 3.55, 1.5],
          [1.72, -1.75, 1.5],
          [4.65, -1.8, 1.0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
      {
        points: [
          [1.05, 3.4, 0],
          [1.89, 3.4, 1.5],
          [1.89, -1.75, 1.5],
          [4.8, -1.8, 1.0],
        ],
        r: 0.045,
        color: WIRE_SIGNAL,
      },
      {
        points: [
          [1.05, 3.25, 0],
          [2.06, 3.25, 1.5],
          [2.06, -1.75, 1.5],
          [4.95, -1.8, 1.0],
        ],
        r: 0.045,
        color: '#7127c9',
      },
    ],
    labels: [
      { textPt: 'APP 1 sobe de 0,5 a 4,5 V', pos: [-6.4, 4.85, 0] },
      { textPt: 'APP 2 vai de 0,25 a 2,25 V: sempre a metade', pos: [-6.4, 2.1, 0] },
      { textPt: 'a ECU divide um pelo outro e tem que dar 2', pos: [-6.4, 1.5, 0] },
      { textPt: 'deu outro numero, ela nao confia em nenhum', pos: [-6.4, 0.9, 0] },
      { textPt: 'nao existe cabo do pedal ate a borboleta', pos: [-2.6, -1.0, 0] },
      { textPt: 'se as duas leituras nao baterem, entra em emergencia', pos: [3.6, -3.2, 0] },
      { textPt: 'a mola deixa uma fresta se faltar energia', pos: [3.6, -4.4, 0] },
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
      'A cena anda junta: o ressalto de tres lobos gira, levanta o tucho, o tucho levanta o pistao, a valvula de saida abre e sai o pulso de alta. A dosadora estrangula a entrada e o sensor da flauta conta para a ECU como ficou.',
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
    camDist: 15,
    camTarget: [0, 0.9, 0],
    parts: [
      { partId: 'hp-fuel-pump', pos: [0, 0.6, 0], scale: 1.5, titleAt: [0, 3.4, 0] },
      {
        partId: 'pump-drive',
        pos: [0, -1.77, 0],
        scale: 1.5,
        dim: true,
        labelPt: 'Comando de valvulas',
        labelAt: [0, -3.1, 0],
      },
      {
        partId: 'fuel-rail-gdi',
        pos: [5.6, 0.7, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Flauta de alta pressao',
        labelAt: [6.2, -0.9, 0],
      },
      {
        partId: 'rail-pressure-sensor',
        pos: [4.7, 1.3, 0],
        scale: 0.85,
        dim: true,
        labelPt: 'Sensor de pressao da flauta',
        labelAt: [7.4, 1.5, 0],
      },
      {
        partId: 'fuel-pump-module',
        pos: [-6.4, -2.9, 0],
        scale: 0.55,
        dim: true,
        labelPt: 'Bomba do tanque',
        labelAt: [-6.4, -4.4, 0],
      },
      {
        partId: 'ecu',
        pos: [0, 5.0, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'ECU: compara alvo e real',
        labelAt: [0, 6.05, 0],
      },
    ],
    boxes: [
      {
        pos: [-3.6, 5.0, 0],
        size: [0.8, 0.8, 0.6],
        color: '#8a6d10',
        labelPt: 'Rele principal',
        labelAt: [-3.6, 5.95, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-6.675, -1.47, 0],
          [-6.675, 1.53, 0],
          [-2.62, 1.53, 0],
        ],
        r: 0.11,
        color: FUEL_PIPE,
        flow: '#e08a1e',
        flowSpeed: 0.12,
        labelPt: 'baixa pressao: 5 bar',
        labelAt: [-4.6, 2.2, 0],
      },
      {
        points: [
          [1.9, 1.56, 0],
          [3.3, 1.56, 0],
          [3.3, 0.7, 0],
          [3.9, 0.7, 0],
        ],
        r: 0.09,
        color: '#96a3b5',
        flow: '#e08a1e',
        flowSpeed: 0.3,
        labelPt: 'alta pressao: mais de 100 bar',
        labelAt: [3.8, -0.6, 0],
      },
      {
        points: [
          [-3.2, 5.0, 0],
          [-3.2, 2.46, 0],
          [-1.65, 2.46, 0],
        ],
        r: 0.05,
        color: WIRE_RED,
      },
      {
        points: [
          [-1.08, 4.75, 0],
          [-2.62, 4.75, 0],
          [-2.62, 2.75, 0],
          [-1.2, 2.75, 0],
          [-1.2, 2.46, 0],
        ],
        r: 0.05,
        color: '#7127c9',
      },
      {
        points: [
          [4.7, 2.5, 0],
          [4.7, 5.15, 0],
          [1.08, 5.15, 0],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        labelPt: 'a pressao real volta para a ECU',
        labelAt: [6.7, 4.4, 0],
      },
    ],
    labels: [
      { textPt: 'o ressalto empurra o tucho e o tucho empurra o pistao', pos: [0, -3.75, 0] },
      { textPt: 'a dosadora decide quanto entra a cada golpe', pos: [-5.8, 3.2, 0] },
      { textPt: 'duas bombas em serie', pos: [-4.5, 0.4, 0] },
      { textPt: '5 bar viram mais de 100 bar', pos: [-4.5, -0.15, 0] },
      { textPt: 'a linha de alta fica pressurizada mesmo com o motor desligado', pos: [5.0, -1.5, 0] },
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
      'A cena inteira anda junta com a borboleta: ela abre, o ar corre, o diafragma do sensor entorta e o ponteiro da escala sobe. Embaixo esta a outra versao da mesma peca, o TMAP: nao esta ligada no coletor, so aparece para comparar.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: '5 V de referencia vindos da ECU', color: WIRE_RED },
      { pinPt: 'Fio 2', whatPt: 'Terra de sinal, sempre o da ECU e nao o da carroceria', color: WIRE_BLACK },
      { pinPt: 'Fio 3', whatPt: 'Sinal de pressao, de 0,5 a 4,5 V', color: WIRE_SIGNAL },
      { pinPt: 'Fio 4', whatPt: 'So na versao TMAP: sinal do sensor de temperatura do ar', color: '#7127c9' },
    ],
    testPt: [
      'Chave ligada, motor parado: tem que ler a pressao atmosferica, algo entre 95 e 102 kPa (4,5 V aproximadamente). Se ja mostra 40 kPa parado, o sensor esta mentindo.',
      'Marcha lenta com motor bom: de 25 a 40 kPa, ou 0,9 a 1,5 V. Valor alto demais em marcha lenta aponta entrada de ar falsa ou valvula EGR travada aberta.',
      'Acelerando de uma vez a leitura tem que ir quase ate a atmosferica e voltar rapido. Resposta lenta e mangueira de vacuo com sujeira ou sensor viciado.',
      'Confira a mangueira de vacuo antes do sensor. Mangueira ressecada, trincada ou entupida da o mesmo sintoma de sensor ruim e e muito mais comum.',
      'Referencia de 5 V fora da faixa de 4,9 a 5,1 V nao e defeito do MAP: e problema na alimentacao da ECU ou outro sensor em curto puxando a referencia.',
      'No TMAP, teste os dois sinais separados: o de pressao e o do NTC. NTC aberto ou em curto engana a ECU na densidade do ar.',
    ],
    camDist: 15,
    camTarget: [0, 0.4, 0],
    parts: [
      { partId: 'map-sensor', pos: [0, 1.7, 0], scale: 1.5, titleAt: [-4.4, 2.8, 0] },
      {
        partId: 'throttle-body',
        pos: [-5.4, -1.5, 0],
        scale: 1.2,
        dim: true,
        labelPt: 'Borboleta',
        labelAt: [-5.4, 0.6, 0],
      },
      {
        partId: 'ecu',
        pos: [0, 5.1, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'ECU',
        labelAt: [0, 6.0, 0],
      },
      { partId: 'map-gauge', pos: [5.6, 1.4, 0], scale: 1.2 },
      {
        partId: 'tmap-sensor',
        pos: [-6.0, -4.0, 0],
        scale: 1.2,
        labelPt: 'Versao TMAP: pressao e temperatura, 4 vias',
        labelAt: [-2.0, -4.0, 0],
      },
    ],
    boxes: [
      {
        pos: [0, -1.5, 0],
        size: [5.6, 1.1, 1.6],
        color: '#3d4657',
        labelPt: 'Coletor de admissao',
        labelAt: [0, -2.5, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-7.8, -1.5, 0],
          [-6.5, -1.5, 0],
        ],
        r: 0.3,
        color: METAL_PIPE,
        labelPt: 'ar entra',
        labelAt: [-7.6, -0.6, 0],
      },
      {
        points: [
          [-4.3, -1.5, 0],
          [-2.8, -1.5, 0],
        ],
        r: 0.3,
        color: METAL_PIPE,
      },
      {
        points: [
          [-7.8, -1.5, 0],
          [2.4, -1.5, 0],
        ],
        r: 0.3,
        color: METAL_PIPE,
        tube: false,
        flow: '#1d5fd8',
        flowSpeed: 0.18,
        gated: true,
      },
      {
        points: [
          [0, -0.95, 0],
          [0, 0.6, 0],
        ],
        r: 0.07,
        color: HOSE,
        labelPt: 'tomada de vacuo',
        labelAt: [1.7, -0.35, 0],
      },
      {
        points: [
          [1.08, 5.35, 0],
          [2.0, 5.35, 0],
          [2.0, 3.75, 0],
          [0.27, 3.75, 0],
          [0.27, 3.32, 0],
        ],
        r: 0.05,
        color: WIRE_RED,
        labelPt: '5 V de referencia',
        labelAt: [3.4, 5.35, 0],
      },
      {
        points: [
          [1.08, 5.1, 0],
          [1.75, 5.1, 0],
          [1.75, 3.95, 0],
          [0, 3.95, 0],
          [0, 3.32, 0],
        ],
        r: 0.05,
        color: WIRE_BLACK,
      },
      {
        points: [
          [1.08, 4.85, 0],
          [1.5, 4.85, 0],
          [1.5, 4.15, 0],
          [-0.27, 4.15, 0],
          [-0.27, 3.32, 0],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        labelPt: 'sinal: 0,5 V com muito vacuo, 4,5 V com o coletor cheio',
        labelAt: [-3.6, 4.6, 0],
      },
    ],
    labels: [
      { textPt: '0 = vacuo total', pos: [3.8, 0.05, 0] },
      { textPt: 'marcha lenta: 30', pos: [4.7, -0.6, 0] },
      { textPt: '101 = atmosfera', pos: [6.6, 0.05, 0] },
      { textPt: 'daqui pra cima so com turbo', pos: [7.0, -0.6, 0] },
      { textPt: 'o ponteiro anda com a borboleta', pos: [5.6, 3.0, 0] },
      { textPt: 'a camara de cima e vacuo selado: e contra ela que ele mede', pos: [-1.0, -3.2, 0] },
      { textPt: 'o NTC le a temperatura do ar', pos: [-2.4, -4.8, 0] },
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
      'A cena inteira anda junta: a borboleta abre, a marca da escala embaixo caminha e a EGR so destrava quando a marca entra na faixa verde. Fora dela a haste senta na sede e as bolinhas vermelhas param. O gas quente sai do cilindro, passa pela valvula, esfria no radiador de EGR e volta para o coletor de admissao.',
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
    camTarget: [0.2, 0.6, 0],
    parts: [
      { partId: 'egr-valve', pos: [1.6, 1.7, 0], scale: 1.2, titleAt: [-1.6, 2.6, 0] },
      {
        partId: 'egr-cooler',
        pos: [4.3, 1.64, 0],
        scale: 1.0,
        labelPt: 'Radiador de EGR: o gas chega mais frio',
        labelAt: [5.6, 0.7, 0],
      },
      { partId: 'egr-band', pos: [1.0, -2.5, 0], scale: 1.0 },
      {
        partId: 'ecu',
        pos: [4.6, 3.4, 0],
        scale: 0.8,
        dim: true,
        labelPt: 'ECU',
        labelAt: [4.6, 2.62, 0],
      },
      {
        partId: 'throttle-body',
        pos: [-5.8, 4.2, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Borboleta',
        labelAt: [-5.8, 6.1, 0],
      },
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
        pos: [-5.6, -2.4, 0],
        size: [2.6, 3.4, 2.2],
        color: '#3d4657',
        labelPt: 'Cilindro: e aqui que o gas queimado nasce',
        labelAt: [-5.6, -4.6, 0],
      },
      { pos: [-5.6, -2.4, 1.15], size: [1.3, 2.4, 0.06], glass: true },
      {
        pos: [-1.0, -0.6, 0],
        size: [6.0, 0.9, 1.2],
        color: '#5a5045',
        labelPt: 'Coletor de escape',
        labelAt: [-3.0, -1.6, 0],
      },
      {
        pos: [-1.6, 4.2, 0],
        size: [5.2, 0.9, 1.2],
        color: '#3d4657',
        labelPt: 'Coletor de admissao: ar limpo mais o gas de volta',
        labelAt: [-1.6, 5.4, 0],
      },
      {
        pos: [4.6, 5.4, 0],
        size: [0.8, 0.8, 0.6],
        color: '#8a6d10',
        labelPt: 'Rele principal',
        labelAt: [6.0, 5.4, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-8.4, 4.2, 0],
          [-6.7, 4.2, 0],
        ],
        r: 0.28,
        color: METAL_PIPE,
        labelPt: 'ar limpo',
        labelAt: [-7.4, 5.0, 0],
      },
      {
        points: [
          [-4.9, 4.2, 0],
          [-4.2, 4.2, 0],
        ],
        r: 0.28,
        color: METAL_PIPE,
      },
      {
        points: [
          [-8.4, 4.2, 0],
          [1.0, 4.2, 0],
        ],
        r: 0.28,
        color: METAL_PIPE,
        tube: false,
        flow: '#1d5fd8',
        flowSpeed: 0.18,
        gated: true,
      },
      {
        points: [
          [-3.4, 3.75, 0],
          [-3.4, 2.9, 0],
          [-6.2, 2.9, 0],
          [-6.2, -0.65, 0],
        ],
        r: 0.2,
        color: '#4a5364',
        flow: '#1d5fd8',
        flowSpeed: 0.16,
        gated: true,
        labelPt: 'vai para o cilindro',
        labelAt: [-7.5, 1.2, 0],
      },
      {
        points: [
          [-3.4, 3.75, 0],
          [-3.4, 2.9, 0],
          [-6.2, 2.9, 0],
          [-6.2, -0.65, 0],
        ],
        r: 0.2,
        color: '#4a5364',
        tube: false,
        flow: '#e08a1e',
        flowSpeed: 0.16,
        gated: 'egr',
      },
      {
        points: [
          [-5.0, -0.75, 0],
          [-5.0, -0.6, 0],
          [-4.0, -0.6, 0],
        ],
        r: 0.22,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.2,
      },
      {
        points: [
          [2.0, -0.6, 0],
          [5.4, -0.6, 0],
          [5.4, -2.2, 0],
        ],
        r: 0.22,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.2,
        labelPt: 'o resto vai embora pelo escapamento',
        labelAt: [6.6, -1.2, 0],
      },
      {
        points: [
          [1.6, -0.15, 0],
          [1.6, 0.52, 0],
        ],
        r: 0.16,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.14,
        gated: 'egr',
        labelPt: 'o gas entra por baixo, pelo flange',
        labelAt: [3.4, 0.1, 0],
      },
      {
        points: [
          [2.9, 1.64, 0],
          [3.55, 1.64, 0],
        ],
        r: 0.16,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.14,
        gated: 'egr',
      },
      {
        points: [
          [5.05, 1.64, 0],
          [6.2, 1.64, 0],
          [6.2, 4.2, 0],
          [1.0, 4.2, 0],
        ],
        r: 0.16,
        color: EXH_PIPE,
        flow: '#e08a1e',
        flowSpeed: 0.14,
        gated: 'egr',
        labelPt: 'e volta mais frio para a admissao',
        labelAt: [6.9, 2.6, 0],
      },
      {
        points: [
          [4.6, 5.0, 0],
          [4.6, 4.55, 0],
          [3.05, 4.55, 0],
          [3.05, 3.236, 0],
          [2.97, 3.236, 0],
        ],
        r: 0.04,
        color: WIRE_RED,
      },
      {
        points: [
          [3.64, 3.512, 0],
          [3.46, 3.512, 0],
          [3.46, 3.092, 0],
          [2.97, 3.092, 0],
        ],
        r: 0.04,
        color: '#7127c9',
      },
      {
        points: [
          [3.64, 3.4, 0],
          [3.37, 3.4, 0],
          [3.37, 2.948, 0],
          [2.97, 2.948, 0],
        ],
        r: 0.04,
        color: WIRE_RED,
      },
      {
        points: [
          [3.64, 3.288, 0],
          [3.28, 3.288, 0],
          [3.28, 2.804, 0],
          [2.97, 2.804, 0],
        ],
        r: 0.04,
        color: WIRE_SIGNAL,
      },
      {
        points: [
          [3.64, 3.176, 0],
          [3.19, 3.176, 0],
          [3.19, 2.66, 0],
          [2.97, 2.66, 0],
        ],
        r: 0.04,
        color: WIRE_BLACK,
      },
    ],
    labels: [
      { textPt: 'acima de 1600 graus o nitrogenio do ar vira NOx', pos: [-5.6, -5.3, 0] },
      { textPt: 'a ECU manda o quanto abrir e le a posicao de volta', pos: [0.0, 6.3, 0] },
      { textPt: 'so nesta faixa a EGR abre', pos: [0.95, -1.4, 0] },
      { textPt: 'marcha lenta', pos: [-0.5, -3.6, 0] },
      { textPt: 'pe no fundo', pos: [2.5, -3.6, 0] },
      { textPt: 'gas queimado nao queima de novo: ele so absorve calor', pos: [0.4, -4.7, 0] },
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
      'A cena inteira anda junta: a carga sobe, a bomba de alta trabalha mais e a pressao da flauta sobe com ela. Dentro do sensor a membrana de aco entorta, e na escala da direita o alvo da ECU e a pressao real caminham colados. O combustivel sai pelos injetores, porque nesta flauta nao existe retorno.',
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
    camDist: 14,
    camTarget: [0.3, 0.9, 0],
    parts: [
      {
        partId: 'rail-pressure-sensor',
        pos: [-0.155, 1.324, 0],
        scale: 1.4,
        titleAt: [-3.2, 2.6, 0],
      },
      {
        partId: 'fuel-rail-gdi',
        pos: [1.6, 0.2, 0],
        scale: 1.3,
        dim: true,
        labelPt: 'Flauta de alta',
        labelAt: [4.6, -1.2, 0],
      },
      { partId: 'injector-gdi', pos: [0.56, -1.78, 0], scale: 0.9, dim: true },
      { partId: 'injector-gdi', pos: [1.249, -1.78, 0], scale: 0.9, dim: true },
      { partId: 'injector-gdi', pos: [1.951, -1.78, 0], scale: 0.9, dim: true },
      {
        partId: 'injector-gdi',
        pos: [2.64, -1.78, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Injetores',
        labelAt: [4.4, -2.0, 0],
      },
      { partId: 'rail-gauge', pos: [5.6, 2.4, 0], scale: 1.1 },
      {
        partId: 'ecu',
        pos: [-3.4, 5.0, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'ECU',
        labelAt: [-3.4, 4.1, 0],
      },
      {
        partId: 'hp-fuel-pump',
        pos: [-5.6, 0.2, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Bomba de alta',
        labelAt: [-5.8, -1.6, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-4.5, 0.776, 0],
          [-3.2, 0.776, 0],
          [-3.2, 0.2, 0],
          [-0.9, 0.2, 0],
        ],
        r: 0.09,
        color: '#96a3b5',
        flow: '#e08a1e',
        flowSpeed: 0.26,
        labelPt: 'vem da bomba de alta',
        labelAt: [-3.9, 1.75, 0],
      },
      {
        points: [
          [-2.32, 5.252, 0],
          [0.013, 5.252, 0],
          [0.013, 3.228, 0],
        ],
        r: 0.04,
        color: WIRE_SIGNAL,
      },
      {
        points: [
          [-2.32, 5.0, 0],
          [-0.155, 5.0, 0],
          [-0.155, 3.228, 0],
        ],
        r: 0.04,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-2.32, 4.748, 0],
          [-0.323, 4.748, 0],
          [-0.323, 3.228, 0],
        ],
        r: 0.04,
        color: WIRE_RED,
      },
      {
        points: [
          [-4.48, 5.0, 0],
          [-5.9, 5.0, 0],
          [-5.9, 2.2, 0],
          [-6.32, 2.2, 0],
          [-6.32, 1.35, 0],
        ],
        r: 0.04,
        color: '#7127c9',
        labelPt: 'comando da valvula dosadora',
        labelAt: [-4.0, 4.2, 0],
      },
      ...[0.56, 1.249, 1.951, 2.64].map((x) => ({
        points: [
          [x, -2.9, 0],
          [x, -3.9, 0],
        ] as Vec3[],
        r: 0.08,
        color: '#96a3b5',
        tube: false,
        flow: '#e08a1e',
        flowSpeed: 0.32,
        gated: true,
      })),
    ],
    labels: [
      { textPt: 'a pressao muda o tempo todo: de 40 a mais de 200 bar', pos: [5.6, 4.6, 0] },
      { textPt: 'alvo e real andam coladas: se separarem, tem defeito', pos: [5.6, 3.9, 0] },
      { textPt: '0', pos: [3.95, 1.0, 0] },
      { textPt: '100 bar', pos: [5.27, 1.0, 0] },
      { textPt: '200 bar', pos: [6.59, 1.0, 0] },
      { textPt: 'claro e o alvo, laranja e a pressao real', pos: [5.9, 0.35, 0] },
      { textPt: 'o combustivel sai por aqui: nao existe retorno', pos: [0.4, -4.3, 0] },
      { textPt: 'sem a pressao real a ECU nao sabe quanto combustivel saiu do injetor', pos: [-3.6, -3.4, 0] },
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
      'A flauta esta em corte para mostrar o que ela guarda: combustivel sob pressao. A bomba manda em golpes pelo tubo rigido, o volume de dentro amortece e os quatro injetores tiram a mesma coisa. Embaixo, so para comparar e fora do circuito, esta o regulador da injecao indireta antiga, com a mangueira de volta que aqui nao existe.',
    testPt: [
      'Vazamento na flauta e emergencia. Combustivel a 200 bar vira nevoa e pega fogo facil em contato com o coletor de escape.',
      'Antes de abrir qualquer conexao, despressurize pelo scanner e espere. A pressao nao cai sozinha rapido.',
      'Teste de queda: pressurize e desligue o motor observando a pressao no scanner. Se ela despenca em poucos segundos, tem injetor vazando ou vedacao ruim.',
      'Nunca teste vazamento de alta pressao com a mao. O jato atravessa a pele.',
      'Nao tem retorno: se voce procura mangueira de volta ao tanque numa injecao direta, ela nao existe.',
    ],
    camDist: 14,
    camTarget: [0, 0.4, 0],
    parts: [
      { partId: 'fuel-rail-gdi', pos: [0, 0.9, 0], scale: 1.5, titleAt: [3.6, 0.6, 0] },
      {
        partId: 'rail-pressure-sensor',
        pos: [-2.025, 1.82, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Sensor de pressao',
        labelAt: [-4.4, 2.6, 0],
      },
      {
        partId: 'rail-relief-valve',
        pos: [1.5, 1.6, 0],
        scale: 1.0,
        labelPt: 'Valvula de alivio: so abre se passar do limite',
        labelAt: [4.6, 2.4, 0],
      },
      { partId: 'injector-gdi', pos: [-1.2, -1.36, 0], scale: 1.0, dim: true },
      { partId: 'injector-gdi', pos: [-0.405, -1.36, 0], scale: 1.0, dim: true },
      { partId: 'injector-gdi', pos: [0.405, -1.36, 0], scale: 1.0, dim: true },
      {
        partId: 'injector-gdi',
        pos: [1.2, -1.36, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Um injetor por cilindro',
        labelAt: [3.4, -1.4, 0],
      },
      {
        partId: 'hp-fuel-pump',
        pos: [-6.2, 0.9, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Bomba de alta',
        labelAt: [-6.2, 2.6, 0],
      },
      {
        partId: 'ecu',
        pos: [-5.0, 4.6, 0],
        scale: 0.8,
        dim: true,
        labelPt: 'ECU',
        labelAt: [-5.0, 3.8, 0],
      },
      {
        partId: 'fuel-pressure-regulator',
        pos: [-5.4, -2.6, 0],
        scale: 1.0,
        dim: true,
      },
    ],
    pipes: [
      {
        points: [
          [-5.05, 1.476, 0],
          [-4.2, 1.476, 0],
          [-4.2, 0.9, 0],
          [-2.9, 0.9, 0],
        ],
        r: 0.09,
        color: '#96a3b5',
        flow: '#e08a1e',
        flowSpeed: 0.26,
        labelPt: 'tubo rigido de aco',
        labelAt: [-3.9, 2.3, 0],
      },
      {
        points: [
          [-4.04, 4.824, 0],
          [-1.905, 4.824, 0],
          [-1.905, 3.1, 0],
        ],
        r: 0.04,
        color: WIRE_SIGNAL,
      },
      {
        points: [
          [-4.04, 4.6, 0],
          [-2.025, 4.6, 0],
          [-2.025, 3.1, 0],
        ],
        r: 0.04,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-4.04, 4.376, 0],
          [-2.145, 4.376, 0],
          [-2.145, 3.1, 0],
        ],
        r: 0.04,
        color: WIRE_RED,
      },
      ...[-1.2, -0.405, 0.405, 1.2].map((x) => ({
        points: [
          [x, -2.6, 0],
          [x, -3.5, 0],
        ] as Vec3[],
        r: 0.08,
        color: '#96a3b5',
        tube: false,
        flow: '#e08a1e',
        flowSpeed: 0.32,
        gated: true,
      })),
      {
        points: [
          [-5.4, -3.3, 0],
          [-5.4, -3.9, 0],
          [-3.6, -3.9, 0],
        ],
        r: 0.1,
        color: HOSE,
      },
    ],
    labels: [
      { textPt: 'ela guarda pressao e entrega igual para todos os cilindros', pos: [-0.4, 4.3, 0] },
      { textPt: 'a bomba manda em golpes, a flauta amortece', pos: [1.4, 3.1, 0] },
      { textPt: 'cone de metal: tubo de uso unico', pos: [-4.6, -1.4, 0] },
      { textPt: 'aqui nao tem retorno: o que entra sai pelos injetores', pos: [2.6, -3.6, 0] },
      { textPt: 'Injecao indireta antiga: tinha regulador e retorno', pos: [-2.2, -3.6, 0] },
      { textPt: 'esta mangueira de volta nao existe na injecao direta', pos: [-1.0, -4.6, 0] },
    ],
  },

  // ---------------------------------------------------------------- 15
  15: {
    oneLinePt:
      'O bico injetor, que no catalogo se chama valvula de injecao: ele pulveriza a gasolina direto dentro da camara de combustao, contra a pressao da compressao.',
    bodyPt: [
      'Na injecao indireta o injetor molha a valvula de admissao com uns 3 bar e o ar leva o combustivel para dentro. Aqui nao: o bico fica dentro do cabecote, olhando para o pistao, e tem que vencer a pressao que ja existe la dentro.',
      'Por isso ele precisa de mais de 100 bar. E por isso a abertura dele e minuscula: fracoes de milissegundo, com um curso de agulha de poucos centesimos de milimetro.',
      'A vantagem de injetar dentro e o controle. Como o combustivel nao entra pelo coletor, da para escolher a hora exata da injecao. Injetando cedo, no comeco da admissao, a gasolina espalha e forma mistura homogenea. Injetando tarde, ja perto da faisca, forma uma nuvem rica so em volta da vela e o resto da camara fica pobre. Isso e a carga estratificada, e permite rodar com muito menos combustivel em carga parcial.',
      'Tem outro ganho grande: a gasolina evapora dentro da camara e rouba calor do ar. Isso esfria a camara e permite subir a taxa de compressao um ou dois pontos sem detonar. Mais taxa e mais rendimento.',
      'A ECU nao aciona ele com 12 V simples. Um driver interno joga um pico de 60 a 90 V para arrancar a agulha rapido, e depois cai para uma corrente menor so para segurar aberta. Sem esse pico a agulha nao vence a pressao a tempo.',
      'O ponto fraco e conhecido: como nao passa gasolina lavando a valvula de admissao, o carvao do respiro do motor e da EGR gruda ali e forma crosta. Motor de injecao direta com muita cidade acumula carvao na admissao, e isso e uma limpeza de manutencao e nao um defeito.',
    ],
    contextPt:
      'A cena roda um ciclo de quatro tempos inteiro. O injetor esta em corte para voce ver a agulha; ao lado, o pico do driver que arranca ela. Um ciclo injeta cedo e forma mistura homogenea, o proximo injeta tarde e forma a nuvem rica so na vela. No canto, apagado e fora do circuito, o injetor indireto de 3 bar e a valvula que virou crosta de carvao.',
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
    camDist: 14,
    camTarget: [0, 0.2, 0],
    parts: [
      { partId: 'injector-gdi', pos: [-0.9, 1.3, 0], scale: 1.3, titleAt: [-3.6, 1.8, 0] },
      {
        partId: 'gdi-spray',
        pos: [-0.9, -0.42, 0],
        scale: 1.0,
        labelPt: 'jato direto na camara',
        labelAt: [-3.2, -1.2, 0],
      },
      { partId: 'gdi-mixture', pos: [0.15, -1.15, 0], scale: 0.85 },
      {
        partId: 'spark-plug',
        pos: [0.3, 0.2, 0],
        scale: 1.0,
        labelPt: 'Vela de ignicao',
        labelAt: [2.9, -0.6, 0],
      },
      {
        partId: 'gdi-piston',
        pos: [0, -2.2, 0],
        scale: 1.0,
        labelPt: 'Pistao',
        labelAt: [2.4, -2.6, 0],
      },
      {
        partId: 'fuel-rail-gdi',
        pos: [-0.657, 3.9, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Flauta de alta pressao',
        labelAt: [2.6, 3.9, 0],
      },
      {
        partId: 'injector-driver-gauge',
        pos: [5.4, 1.2, 0],
        scale: 1.0,
      },
      {
        partId: 'ecu',
        pos: [5.4, 4.2, 0],
        scale: 0.85,
        dim: true,
        labelPt: 'ECU com driver de alta tensao',
        labelAt: [5.4, 3.2, 0],
      },
      {
        partId: 'injector-cutaway',
        pos: [-7.0, 2.2, 0],
        scale: 1.1,
        dim: true,
        labelPt: 'Injetor indireto de 3 bar, so para comparar',
        labelAt: [-7.0, 4.4, 0],
      },
      {
        partId: 'coked-intake-valve',
        pos: [-7.0, -1.4, 0],
        scale: 1.3,
        dim: true,
        labelPt: 'Valvula de admissao com crosta de carvao',
        labelAt: [-7.0, -2.4, 0],
      },
    ],
    boxes: [
      { pos: [0, 0.4, 0], size: [3.6, 1.2, 2.4], color: '#4a5364' },
      {
        pos: [0, -2.2, 0],
        size: [3.2, 4.0, 2.4],
        color: '#3d4657',
        labelPt: 'Cilindro em corte',
        labelAt: [3.2, -3.9, 0],
      },
      { pos: [0, -2.2, 1.25], size: [2.2, 3.4, 0.06], glass: true },
    ],
    pipes: [
      {
        points: [
          [-0.9, 3.1, 0],
          [-0.9, 2.7, 0],
        ],
        r: 0.09,
        color: '#96a3b5',
        flow: '#e08a1e',
        flowSpeed: 0.3,
        gated: 'gdi',
      },
      {
        points: [
          [4.38, 4.438, 0],
          [3.1, 4.438, 0],
          [3.1, 2.1, 0],
          [-0.77, 2.1, 0],
          [-0.77, 1.82, 0],
        ],
        r: 0.045,
        color: '#7127c9',
      },
      {
        points: [
          [4.38, 3.962, 0],
          [3.4, 3.962, 0],
          [3.4, 1.75, 0],
          [-1.03, 1.75, 0],
          [-1.03, 1.82, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
    ],
    labels: [
      { textPt: 'abre em fracoes de milissegundo', pos: [-3.8, 1.0, 0] },
      { textPt: 'contra a pressao da compressao', pos: [-3.8, 0.3, 0] },
      { textPt: 'pico', pos: [4.65, 0.0, 0] },
      { textPt: 'sustentacao', pos: [6.15, 0.0, 0] },
      { textPt: 'pico de 60 a 90 V para arrancar a agulha', pos: [5.4, -0.6, 0] },
      { textPt: 'depois cai para uma corrente baixa so para segurar', pos: [5.4, -1.3, 0] },
      { textPt: 'a agulha levanta poucos centesimos de milimetro', pos: [3.4, 2.6, 0] },
      { textPt: 'injeta cedo na admissao: mistura homogenea', pos: [-2.6, -5.0, 0] },
      { textPt: 'injeta tarde na compressao: carga estratificada', pos: [2.8, -5.0, 0] },
      { textPt: 'a cena alterna os dois modos a cada ciclo', pos: [0.1, -5.6, 0] },
      { textPt: 'ele molhava a valvula e ela ficava limpa', pos: [-7.0, 0.4, 0] },
      { textPt: 'aqui nao passa gasolina lavando ela', pos: [-7.0, -3.1, 0] },
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
      'Do lado esquerdo a mesma camara nas duas situacoes: em cima da normal sai uma frente de chama so; na outra o canto se acende sozinho e as duas se batem no meio. O choque vira onda e corre pelo bloco ate o sensor, que esta em corte com o cristal, a massa e o parafuso. A direita o que a ECU ve: o sinal bruto no osciloscopio, a janela de escuta e o avanco recuando.',
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
    camDist: 14,
    parts: [
      { partId: 'knock-sensor', pos: [1.3, 1.594, 0], scale: 1.3, titleAt: [2.0, 2.9, 0] },
      {
        partId: 'combustion-normal',
        pos: [-3.8, 0.2, 0],
        scale: 1.0,
        labelPt: 'Queima normal',
        labelAt: [-3.8, 2.6, 0],
      },
      {
        partId: 'combustion-knock',
        pos: [-1.0, 0.2, 0],
        scale: 1.0,
        labelPt: 'Detonacao',
        labelAt: [-1.0, 2.6, 0],
      },
      { partId: 'knock-wave', pos: [-1.0, -0.4, 0], scale: 1.0 },
      {
        partId: 'knock-scope',
        pos: [6.4, 0.6, 0],
        scale: 1.0,
        labelPt: 'Sinal bruto do cristal',
        labelAt: [6.4, 1.95, 0],
      },
      {
        partId: 'spark-advance-gauge',
        pos: [6.4, -2.6, 0],
        scale: 1.0,
        labelPt: 'Avanco de ignicao',
        labelAt: [6.4, -1.35, 0],
      },
      {
        partId: 'damaged-piston',
        pos: [-7.0, -3.6, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Estrago da detonacao',
        labelAt: [-7.0, -2.5, 0],
      },
      {
        partId: 'ecu',
        pos: [6.6, 3.1, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'ECU atrasa o ponto',
        labelAt: [6.8, 4.9, 0],
      },
    ],
    boxes: [
      {
        pos: [-1.4, -0.6, 0],
        size: [7.6, 3.4, 2.4],
        color: '#3d4657',
        labelPt: 'Bloco do motor',
        labelAt: [2.6, -2.6, 0],
      },
    ],
    pipes: [
      {
        points: [
          [3.679, 1.711, 0],
          [3.9, 1.711, 0],
          [3.9, 3.352, 0],
          [5.47, 3.352, 0],
        ],
        r: 0.045,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        gated: 'knock',
        labelPt: 'cabo blindado: sinal de poucos milivolts',
        labelAt: [2.4, 3.6, 0],
      },
      {
        points: [
          [3.679, 1.477, 0],
          [4.15, 1.477, 0],
          [4.15, 3.1, 0],
          [5.47, 3.1, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
      {
        points: [
          [2.66, 1.594, 0],
          [2.66, 1.3, 0],
          [4.4, 1.3, 0],
          [4.4, 2.848, 0],
          [5.47, 2.848, 0],
        ],
        r: 0.07,
        color: '#8a93a6',
        labelPt: 'malha aterrada so no lado da ECU',
        labelAt: [4.0, 4.3, 0],
      },
    ],
    labels: [
      { textPt: 'uma frente so, saindo da vela, empurrando o pistao', pos: [-3.8, 3.4, 0] },
      { textPt: 'o canto se acende sozinho e as duas frentes se batem no meio', pos: [-2.0, 4.2, 0] },
      { textPt: 'e o choque que quebra pistao, junta e vela', pos: [-2.0, 4.9, 0] },
      { textPt: 'a onda corre pelo bloco entre 5 e 15 kHz', pos: [-3.2, -3.2, 0] },
      { textPt: 'parafusado direto no bloco, sem arruela', pos: [1.8, -3.2, 0] },
      { textPt: 'aperto errado e ele para de escutar', pos: [1.8, -3.8, 0] },
      { textPt: 'vermelho: e so ai que a ECU escuta', pos: [6.4, -0.85, 0] },
      { textPt: 'recua de uma vez e devolve devagar', pos: [6.4, -3.95, 0] },
      { textPt: 'com gasolina ruim ela fica presa atrasada e o carro anda fraco', pos: [1.0, -4.6, 0] },
      { textPt: 'poucos segundos em carga bastam', pos: [-7.0, -4.8, 0] },
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
      'A roda 60-2 gira presa na ponta do virabrequim e acelera junto com o motor. Em cima dela, os dois tipos de sensor lado a lado: o indutivo em corte, com ima e bobina, e o Hall de tres fios. Cada um tem o seu tracado a direita, com a falha marcada e um cursor andando junto com a roda. Embaixo, apagado, o comando girando na metade da rotacao.',
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
    camDist: 15,
    camTarget: [1.6, 0.7, 0],
    parts: [
      {
        partId: 'trigger-wheel',
        pos: [-2.6, 0.4, 0],
        scale: 1.5,
        labelPt: 'Roda dentada 60-2 na ponta do virabrequim',
        labelAt: [-2.4, -2.15, 0],
      },
      {
        partId: 'ckp-sensor',
        pos: [-3.3, 3.153, 0],
        scale: 1.2,
        titleAt: [-5.6, 4.4, 0],
        labelPt: 'Indutivo: 2 fios',
        labelAt: [-5.4, 3.6, 0],
      },
      {
        partId: 'ckp-hall-sensor',
        pos: [-1.9, 3.153, 0],
        scale: 1.2,
        labelPt: 'Hall: 3 fios',
        labelAt: [-0.3, 3.6, 0],
      },
      {
        partId: 'ckp-trace-inductive',
        pos: [4.0, 2.9, 0],
        scale: 1.0,
        labelPt: 'Indutivo: a altura cresce com a rotacao',
        labelAt: [4.0, 4.25, 0],
      },
      {
        partId: 'ckp-trace-hall',
        pos: [4.0, -0.1, 0],
        scale: 1.0,
        labelPt: 'Hall: a altura nao muda nunca',
        labelAt: [4.0, 1.4, 0],
      },
      {
        partId: 'cam-trigger-wheel',
        pos: [-5.4, -3.4, 0],
        scale: 0.8,
        dim: true,
        labelPt: 'Roda do comando: meia rotacao',
        labelAt: [-5.4, -4.9, 0],
      },
      {
        partId: 'cmp-sensor',
        pos: [-3.7, -3.4, 0],
        rot: [0, 0, -Math.PI / 2],
        scale: 0.9,
        dim: true,
        labelPt: 'Sensor de fase',
        labelAt: [-1.4, -3.6, 0],
      },
      { partId: 'ecu', pos: [7.6, 3.8, 0], scale: 0.85, dim: true, labelPt: 'ECU', labelAt: [7.6, 4.9, 0] },
    ],
    pipes: [
      {
        points: [
          [-3.432, 4.653, 0],
          [-3.432, 5.65, 0],
          [6.39, 5.65, 0],
          [6.39, 4.038, 0],
          [6.53, 4.038, 0],
        ],
        r: 0.045,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        gated: true,
        labelPt: 'dois fios, sem alimentacao',
        labelAt: [-6.4, 6.3, 0],
      },
      {
        points: [
          [-3.168, 4.653, 0],
          [-3.168, 5.45, 0],
          [6.28, 5.45, 0],
          [6.28, 3.919, 0],
          [6.53, 3.919, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-2.08, 4.653, 0],
          [-2.08, 5.25, 0],
          [6.17, 5.25, 0],
          [6.17, 3.8, 0],
          [6.53, 3.8, 0],
        ],
        r: 0.045,
        color: WIRE_RED,
        labelPt: 'tres fios: 12 V, terra e sinal',
        labelAt: [0.0, 6.3, 0],
      },
      {
        points: [
          [-1.9, 4.653, 0],
          [-1.9, 5.05, 0],
          [6.06, 5.05, 0],
          [6.06, 3.681, 0],
          [6.53, 3.681, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-1.72, 4.653, 0],
          [-1.72, 4.85, 0],
          [5.95, 4.85, 0],
          [5.95, 3.562, 0],
          [6.53, 3.562, 0],
        ],
        r: 0.045,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        gated: true,
      },
      {
        points: [
          [-3.57, 4.413, 0],
          [-3.9, 4.413, 0],
          [-3.9, 5.9, 0],
          [6.53, 5.9, 0],
          [6.53, 4.361, 0],
        ],
        r: 0.07,
        color: '#8a93a6',
        labelPt: 'malha aterrada so no lado da ECU',
        labelAt: [7.2, 6.3, 0],
      },
      {
        points: [
          [-3.3, 2.123, 0.6],
          [-3.3, 2.373, 0.6],
        ],
        r: 0.035,
        color: '#ffd93b',
      },
      {
        points: [
          [-4.95, 2.25, 0.6],
          [-3.42, 2.25, 0.6],
        ],
        r: 0.025,
        color: '#ffd93b',
        labelPt: 'folga de 0,5 a 1,5 mm',
        labelAt: [-6.2, 2.95, 0],
      },
    ],
    labels: [
      { textPt: 'a falha passa uma vez por volta: e ali que a ECU se localiza', pos: [-2.0, -2.7, 0] },
      { textPt: 'um pulso a cada duas voltas: e ele que diz se e compressao ou escape', pos: [-2.0, -5.5, 0] },
      { textPt: 'a falha marcada em vermelho, no meio do desenho', pos: [3.8, -1.6, 0] },
      { textPt: 'o Hall le ate com o motor parado', pos: [3.8, -2.3, 0] },
      { textPt: 'sem sinal, o motor morre', pos: [-6.5, 1.4, 0] },
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
      'O tanque esta em corte com o combustivel dentro e o modulo inteiro aberto: o copo embaixo, a tela da suceao, o motor eletrico com a turbina girando, o filtro em cima e o braco da boia acompanhando a superficie. O nivel desce enquanto o motor consome, e o marcador do painel a direita segue a boia ate acender a reserva. Do lado direito a pressao que ela entrega; embaixo o rele que a ECU comanda.',
    pinsPt: [
      { pinPt: 'Fio 1', whatPt: 'Sinal da boia de nivel para o painel', color: WIRE_SIGNAL },
      { pinPt: 'Fio 2', whatPt: '+12 V vindo do rele da bomba, e nao direto da chave', color: WIRE_RED },
      { pinPt: 'Fio 3', whatPt: 'Terra da boia', color: WIRE_BLACK },
      { pinPt: 'Fio 4', whatPt: 'Terra da bomba', color: WIRE_BLACK },
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
    camDist: 15,
    camTarget: [0.4, -0.1, 0],
    parts: [
      { partId: 'tank-fuel', pos: [-4.9, 0, 0], scale: 1.0 },
      { partId: 'fuel-pump-module', pos: [-4.9, 0, 0], scale: 1.0, titleAt: [-7.4, 3.4, 0] },
      {
        partId: 'lp-gauge',
        pos: [4.6, 0.9, 0],
        scale: 1.0,
        labelPt: 'Pressao na linha de baixa',
        labelAt: [4.6, 2.2, 0],
      },
      {
        partId: 'fuel-gauge-cluster',
        pos: [4.6, -2.4, 0],
        scale: 1.0,
        labelPt: 'Marcador do painel',
        labelAt: [4.6, -3.7, 0],
      },
      { partId: 'pump-relay', pos: [1.4, -3.6, 0], scale: 1.0, labelPt: 'Rele da bomba', labelAt: [1.4, -2.6, 0] },
      { partId: 'ecu', pos: [7.8, -4.4, 0], scale: 0.85, dim: true, labelPt: 'ECU', labelAt: [7.8, -3.4, 0] },
      {
        partId: 'hp-fuel-pump',
        pos: [7.8, 3.0, 0],
        scale: 0.85,
        dim: true,
        labelPt: 'Bomba de alta no motor',
        labelAt: [7.8, 5.0, 0],
      },
    ],
    boxes: [
      {
        pos: [-4.9, -0.125, 0],
        size: [6.2, 4.15, 3.0],
        glass: true,
        labelPt: 'Tanque de combustivel',
        labelAt: [-4.9, -3.0, 0],
      },
      {
        pos: [-1.0, -5.5, 0],
        size: [1.6, 0.3, 0.6],
        color: '#2f3644',
        labelPt: 'terra da carroceria',
        labelAt: [-3.2, -5.5, 0],
      },
      { pos: [4.4, -6.0, 0], size: [0.55, 0.45, 0.45], color: '#3d4657', labelPt: 'do fusivel', labelAt: [5.6, -6.0, 0] },
    ],
    pipes: [
      {
        points: [
          [-5.4, 2.6, 0],
          [-5.4, 5.8, 0],
          [6.8, 5.8, 0],
          [6.8, 3.0, 0],
          [7.0, 3.0, 0],
        ],
        r: 0.11,
        color: FUEL_PIPE,
        flow: '#e08a1e',
        flowSpeed: 0.16,
        labelPt: 'baixa pressao: 5 bar ate a bomba de alta',
        labelAt: [0.6, 6.15, 0],
      },
      {
        points: [
          [-6.9, -1.9, 0.8],
          [-5.35, -1.9, 0.8],
        ],
        r: 0.055,
        color: FUEL_PIPE,
        flow: '#e08a1e',
        flowSpeed: 0.12,
      },
      {
        points: [
          [-4.66, 2.66, 0],
          [-4.66, 5.4, 0],
          [2.6, 5.4, 0],
          [2.6, -2.4, 0],
          [3.3, -2.4, 0],
        ],
        r: 0.045,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.28,
        labelPt: 'sinal da boia vai para o painel, nao para a ECU',
        labelAt: [-4.3, 6.15, 0],
      },
      {
        points: [
          [0.98, -4.525, 0],
          [0.98, -4.9, 0],
          [0.4, -4.9, 0],
          [0.4, 5.2, 0],
          [-4.54, 5.2, 0],
          [-4.54, 2.66, 0],
        ],
        r: 0.045,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: '+12 V vem do rele, nao da chave',
        labelAt: [-7.2, 5.5, 0],
      },
      {
        points: [
          [-4.42, 2.66, 0],
          [-4.42, 5.0, 0],
          [-0.6, 5.0, 0],
          [-0.6, -5.35, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-4.3, 2.66, 0],
          [-4.3, 4.8, 0],
          [-1.6, 4.8, 0],
          [-1.6, -5.35, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
      {
        points: [
          [6.73, -4.4, 0],
          [6.0, -4.4, 0],
          [6.0, -5.6, 0],
          [1.54, -5.6, 0],
          [1.54, -4.525, 0],
        ],
        r: 0.045,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'a ECU so segura o rele enquanto ve o sinal do virabrequim',
        labelAt: [-4.6, -6.3, 0],
      },
      {
        points: [
          [4.125, -6.0, 0],
          [1.26, -6.0, 0],
          [1.26, -4.525, 0],
        ],
        r: 0.045,
        color: WIRE_RED,
      },
      {
        points: [
          [1.82, -4.525, 0],
          [1.82, -5.15, 0],
          [-0.25, -5.15, 0],
          [-0.25, -5.35, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
    ],
    labels: [
      { textPt: 'trocar o filtro e tirar o modulo do tanque', pos: [0.6, 2.9, 0] },
      { textPt: 'a boia e um potenciometro: so o painel usa ela', pos: [0.2, 2.2, 0] },
      { textPt: 'submersa: o combustivel esfria a bomba', pos: [-4.9, -3.7, 0] },
      { textPt: 'o copo segura combustivel na curva e na subida', pos: [-4.9, -4.4, 0] },
      { textPt: 'rodar sempre na reserva mata a bomba', pos: [-4.9, -5.1, 0] },
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
      'A bobina esta aberta: o nucleo de ferro no meio, o primario de fio grosso acendendo enquanto carrega e o secundario de fio fino disparando no corte. Embaixo dela a vela, e o arco so aparece no instante em que a ECU solta o terra. Ao lado, a camara acende a chama nesse mesmo instante. A direita o osciloscopio com a janela do dwell e o corte marcado, e o avanco em graus subindo com a rotacao.',
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
    camDist: 15,
    camTarget: [0.2, 0.2, 0],
    parts: [
      { partId: 'ignition-coil', pos: [-5.6, 0.6, 0], scale: 1.8, titleAt: [-4.0, 4.4, 0] },
      { partId: 'spark-gap', pos: [-5.546, -1.902, 0], scale: 1.8 },
      {
        partId: 'combustion-normal',
        pos: [-2.4, -0.3, 0],
        scale: 1.2,
        dim: true,
        labelPt: 'A camara: a chama comeca no instante do corte',
        labelAt: [-2.4, 2.2, 0],
      },
      {
        partId: 'coil-scope',
        pos: [3.4, 2.9, 0],
        scale: 1.0,
        labelPt: 'Dwell e corte no osciloscopio',
        labelAt: [3.4, 5.4, 0],
      },
      {
        partId: 'ignition-timing-gauge',
        pos: [3.4, -1.2, 0],
        scale: 1.0,
        labelPt: 'Avanco de ignicao',
        labelAt: [3.4, 0.1, 0],
      },
      {
        partId: 'coil-pack',
        pos: [-1.6, -4.3, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Bobina dupla: faisca perdida',
        labelAt: [-1.6, -5.3, 0],
      },
      { partId: 'ecu', pos: [7.6, 1.2, 0], scale: 0.85, dim: true, labelPt: 'ECU', labelAt: [7.6, 2.4, 0] },
    ],
    boxes: [
      {
        pos: [-7.4, -3.0, 0],
        size: [0.9, 0.9, 0.7],
        color: '#8a6d10',
        labelPt: 'Rele principal',
        labelAt: [-7.4, -1.9, 0],
      },
      {
        pos: [-8.4, -5.2, 0],
        size: [1.4, 0.3, 0.6],
        color: '#2f3644',
        labelPt: 'terra do estagio de potencia',
        labelAt: [-5.7, -5.2, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-5.924, 3.858, 0.18],
          [-5.924, 5.2, 0.18],
          [-7.4, 5.2, 0.18],
          [-7.4, -2.55, 0.18],
        ],
        r: 0.05,
        color: WIRE_RED,
        labelPt: '+12 V pos-chave',
        labelAt: [-8.6, 1.4, 0],
      },
      {
        points: [
          [-5.708, 3.858, 0.18],
          [-5.708, 5.5, 0.18],
          [-8.4, 5.5, 0.18],
          [-8.4, -5.05, 0.18],
        ],
        r: 0.05,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-5.492, 3.858, 0.18],
          [-5.492, 5.0, 0.18],
          [6.2, 5.0, 0.18],
          [6.2, 1.438, 0.18],
          [6.529, 1.438, 0.18],
        ],
        r: 0.05,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'a ECU segura e depois CORTA o terra',
        labelAt: [-2.6, 5.45, 0],
      },
      {
        points: [
          [-5.276, 3.858, 0.18],
          [-5.276, 4.8, 0.18],
          [5.9, 4.8, 0.18],
          [5.9, 1.319, 0.18],
          [6.529, 1.319, 0.18],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.26,
        labelPt: 'retorno de diagnostico: avisa se a faisca saiu',
        labelAt: [0.4, 4.45, 0],
      },
    ],
    labels: [
      { textPt: 'primario: fio grosso, poucas voltas', pos: [-4.7, -3.1, 0] },
      { textPt: 'secundario: milhares de voltas de fio fino', pos: [-5.2, -3.75, 0] },
      { textPt: 'a relacao chega a 1 para 100', pos: [-5.2, -4.4, 0] },
      { textPt: 'nao e o ligar que gera a faisca: e o desligar', pos: [3.4, 1.0, 0] },
      { textPt: 'em rotacao alta a faisca sai bem antes', pos: [3.4, -2.6, 0] },
      { textPt: 'uma bobina por vela: acabou o cabo de vela', pos: [-1.6, -5.9, 0] },
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
      'Em cima a roda de fase girando no comando, com o dente acendendo o circuito Hall do sensor uma vez a cada duas voltas. Logo abaixo a roda do virabrequim, girando no dobro, para a relacao ficar visivel. A direita os dois sinais na mesma base de tempo e, embaixo deles, os quatro cilindros com o injetor abrindo na vez de cada um. No pe da cena o variador de fase, que usa esse mesmo sensor para saber quanto o comando andou.',
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
    camDist: 15,
    camTarget: [0.6, 0.2, 0],
    parts: [
      { partId: 'cmp-sensor', pos: [-3.9, 4.2, 0], rot: [0, 0, -Math.PI / 2], scale: 1.2, titleAt: [-2.6, 5.6, 0] },
      {
        partId: 'cam-trigger-wheel',
        pos: [-6.2, 4.2, 0],
        scale: 1.2,
        labelPt: 'Roda de fase no comando',
        labelAt: [-6.2, 6.0, 0],
      },
      {
        partId: 'trigger-wheel',
        pos: [-6.2, 0.3, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Roda do virabrequim',
        labelAt: [-6.2, 2.1, 0],
      },
      {
        partId: 'ckp-sensor',
        pos: [-4.2, 0.3, 0],
        rot: [0, 0, -Math.PI / 2],
        scale: 0.9,
        dim: true,
        labelPt: 'Sensor do virabrequim',
        labelAt: [-1.5, 0.3, 0],
      },
      {
        partId: 'cam-phaser',
        pos: [-6.2, -4.0, 0],
        scale: 1.1,
        labelPt: 'Variador de fase (VVT)',
        labelAt: [-6.2, -1.9, 0],
      },
      {
        partId: 'phase-trace',
        pos: [4.2, 4.0, 0],
        scale: 1.0,
        labelPt: 'Os dois sinais juntos',
        labelAt: [4.2, 6.0, 0],
      },
      {
        partId: 'sequential-panel',
        pos: [4.2, 0.3, 0],
        scale: 1.0,
        labelPt: 'Injecao sequencial: 1-3-4-2',
        labelAt: [4.2, 2.0, 0],
      },
      { partId: 'ecu', pos: [8.2, -3.2, 0], scale: 0.9, dim: true, labelPt: 'ECU', labelAt: [8.2, -2.0, 0] },
    ],
    pipes: [
      {
        points: [
          [-2.52, 4.356, 0],
          [1.6, 4.356, 0],
          [1.6, -2.948, 0],
          [7.066, -2.948, 0],
        ],
        r: 0.05,
        color: WIRE_RED,
        labelPt: 'alimentacao e terra da ECU',
        labelAt: [0.3, 5.15, 0],
      },
      {
        points: [
          [-2.52, 4.2, 0],
          [1.35, 4.2, 0],
          [1.35, -3.074, 0],
          [7.066, -3.074, 0],
        ],
        r: 0.05,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-2.52, 4.044, 0],
          [1.1, 4.044, 0],
          [1.1, -3.2, 0],
          [7.066, -3.2, 0],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.34,
        labelPt: 'sinal em onda quadrada',
        labelAt: [0.0, 4.6, 0],
      },
      {
        points: [
          [-3.075, 0.3, 0],
          [0.85, 0.3, 0],
          [0.85, -3.326, 0],
          [7.066, -3.326, 0],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.5,
      },
      {
        points: [
          [7.066, -3.452, 0],
          [-1.6, -3.452, 0],
          [-1.6, -4.0, 0],
          [-2.57, -4.0, 0],
        ],
        r: 0.05,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'comando da eletrovalvula do variador',
        labelAt: [2.4, -3.9, 0],
      },
    ],
    labels: [
      { textPt: 'uma volta do comando = duas do virabrequim', pos: [-1.4, 2.3, 0] },
      { textPt: 'so com o virabrequim a ECU nao sabe se e compressao ou escape', pos: [-1.4, -1.5, 0] },
      { textPt: 'sem fase o motor anda, mas injeta todos juntos', pos: [4.2, -1.6, 0] },
      { textPt: 'a ECU compara o comando com o virabrequim e fecha a malha do variador', pos: [2.4, -5.0, 0] },
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
      'A galeria de agua esta em corte e o liquido dentro dela vai do azul ao vermelho enquanto o motor esquenta. O sensor esta rosqueado nela, aberto, com o NTC na ponta mudando de cor junto. A direita a curva de resistencia caindo com a temperatura e o divisor de tensao dentro da ECU, onde os 5 V vao descendo para menos de 1 V. Embaixo o ventilador, que so gira depois do limite. E do lado do sensor da ECU esta o OUTRO sensor, de um fio so, que manda no ponteiro do painel.',
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
    camDist: 15,
    camTarget: [0.4, 0.2, 0],
    parts: [
      { partId: 'temp-sensor', pos: [-5.6, 1.6, 0], scale: 1.9, titleAt: [-5.6, 5.5, 0] },
      {
        partId: 'water-jacket',
        pos: [-5.6, -0.4, 0],
        scale: 1.0,
        labelPt: 'Galeria de agua do cabecote',
        labelAt: [-5.6, -1.9, 0],
      },
      {
        partId: 'temp-sensor',
        pos: [-3.6, 1.25, 0],
        scale: 1.1,
        dim: true,
        labelPt: 'Sensor do painel',
        labelAt: [-2.2, 1.25, 0],
      },
      { partId: 'divider-panel', pos: [1.2, 4.3, 0], scale: 1.0, labelPt: 'Divisor de tensao na ECU', labelAt: [1.2, 6.15, 0] },
      { partId: 'ntc-curve', pos: [6.4, 4.3, 0], scale: 1.0, labelPt: 'Curva do NTC', labelAt: [6.4, 6.0, 0] },
      { partId: 'rad-fan', pos: [4.6, -2.6, 0], scale: 1.2, labelPt: 'Ventilador do radiador', labelAt: [4.6, -0.9, 0] },
      {
        partId: 'temp-gauge-cluster',
        pos: [-2.4, -3.4, 0],
        scale: 1.0,
        labelPt: 'Ponteiro do painel',
        labelAt: [-2.4, -5.1, 0],
      },
      { partId: 'ecu', pos: [8.2, 1.5, 0], scale: 0.9, dim: true, labelPt: 'ECU', labelAt: [8.2, 2.6, 0] },
    ],
    pipes: [
      {
        points: [
          [-9.0, -0.4, 0],
          [-8.2, -0.4, 0],
        ],
        r: 0.22,
        color: '#3f6b9e',
        flow: '#4f8fd0',
        flowSpeed: 0.14,
      },
      {
        points: [
          [-3.0, -0.4, 0],
          [-2.2, -0.4, 0],
        ],
        r: 0.22,
        color: '#3f6b9e',
        flow: '#4f8fd0',
        flowSpeed: 0.14,
      },
      {
        points: [
          [-5.828, 3.405, 0],
          [-5.828, 5.1, 0],
          [-0.7, 5.1, 0],
          [-0.7, 1.752, 0],
          [7.066, 1.752, 0],
        ],
        r: 0.05,
        color: WIRE_BLACK,
      },
      {
        points: [
          [-5.372, 3.405, 0],
          [-5.372, 4.75, 0],
          [-1.05, 4.75, 0],
          [-1.05, 1.626, 0],
          [7.066, 1.626, 0],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'sinal: 4 V frio, menos de 1 V quente',
        labelAt: [0.6, 2.4, 0],
      },
      {
        points: [
          [-3.6, 2.295, 0],
          [-3.6, 3.9, 0],
          [-9.1, 3.9, 0],
          [-9.1, -3.4, 0],
          [-3.6, -3.4, 0],
        ],
        r: 0.05,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.22,
        labelPt: 'sensor do painel: um fio so',
        labelAt: [-7.0, -5.2, 0],
      },
      {
        points: [
          [7.066, 1.374, 0],
          [6.6, 1.374, 0],
          [6.6, -5.0, 0],
          [4.6, -5.0, 0],
          [4.6, -4.1, 0],
        ],
        r: 0.05,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.4,
        labelPt: 'a ECU liga o ventilador',
        labelAt: [5.6, -5.4, 0],
      },
    ],
    labels: [
      { textPt: 'NTC: quanto mais quente, MENOR a resistencia', pos: [3.2, -0.2, 0] },
      { textPt: '25 graus: 2,5 mil ohm', pos: [1.0, -1.0, 0] },
      { textPt: '80 graus: 300 ohm', pos: [1.0, -1.8, 0] },
      { textPt: 'motor frio pede quase o dobro de combustivel', pos: [-6.4, -2.8, 0] },
      { textPt: 'sensor lendo frio demais = consumo alto a vida toda', pos: [-6.4, -4.1, 0] },
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
      'A sonda esta em corte, rosqueada no coletor antes do catalisador. Dentro dela a camara de difusao muda de cor conforme a mistura e o oxigenio e bombeado para dentro ou para fora, sempre para segurar a camara em lambda 1. A direita o zoom dessa camara, com a seta da corrente invertendo de lado e zerando na mistura ideal, e as duas curvas lado a lado: a banda estreita encostada no fim da escala dos dois lados e a banda larga seguindo reta. Embaixo a leitura do scanner e o aquecedor sendo dosado em PWM ate a ceramica chegar na faixa de medida. A esquerda, apagada, a sonda antiga de banda estreita.',
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
    camDist: 15,
    camTarget: [0.4, 0.2, 0],
    parts: [
      { partId: 'lambda-planar', pos: [-5.4, -1.3, 0], scale: 1.9, titleAt: [-7.2, 5.3, 0] },
      {
        partId: 'lambda-sensor',
        pos: [-8.2, -1.3, 0],
        scale: 1.2,
        dim: true,
        labelPt: 'A banda estreita: so diz o lado',
        labelAt: [-8.2, -2.9, 0],
      },
      {
        partId: 'catalytic-converter',
        pos: [1.6, -3.2, 0],
        scale: 0.7,
        dim: true,
        labelPt: 'Catalisador',
        labelAt: [1.6, -4.2, 0],
      },
      {
        partId: 'pump-cell-panel',
        pos: [1.4, 3.9, 0],
        scale: 1.0,
        labelPt: 'A camara de difusao por dentro',
        labelAt: [1.4, 5.7, 0],
      },
      {
        partId: 'lambda-compare',
        pos: [6.6, 3.9, 0],
        scale: 1.0,
        labelPt: 'Estreita satura, larga e linear',
        labelAt: [6.6, 5.7, 0],
      },
      { partId: 'lambda-gauge', pos: [1.4, 0.4, 0], scale: 1.0, labelPt: 'O que o scanner mostra', labelAt: [1.4, 1.6, 0] },
      { partId: 'heater-pwm-panel', pos: [6.4, 0.4, 0], scale: 1.0, labelPt: 'Aquecedor em PWM', labelAt: [6.4, -1.1, 0] },
      { partId: 'ecu', pos: [-2.0, 3.4, 0], scale: 0.9, dim: true, labelPt: 'ECU', labelAt: [-2.0, 4.4, 0] },
    ],
    boxes: [
      {
        pos: [-8.4, 2.6, 0],
        size: [0.9, 0.9, 0.7],
        color: '#8a6d10',
        labelPt: 'Rele principal',
        labelAt: [-8.4, 3.6, 0],
      },
      {
        pos: [-5.4, -2.85, 0],
        size: [0.9, 0.6, 0.9],
        color: '#5a6577',
        labelPt: 'sede roscada no coletor',
        labelAt: [-3.1, -2.85, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-9.0, -3.2, 0],
          [0.45, -3.2, 0],
        ],
        r: 0.16,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
        labelPt: 'gases do motor',
        labelAt: [-7.6, -3.9, 0],
      },
      {
        points: [
          [2.75, -3.2, 0],
          [4.6, -3.2, 0],
        ],
        r: 0.16,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
      },
      {
        points: [
          [-5.37, 0.505, 0],
          [-5.37, 2.15, 0],
          [-8.4, 2.15, 0],
        ],
        r: 0.045,
        color: WIRE_RED,
        labelPt: 'aquecedor: +12 V do rele',
        labelAt: [-7.0, 1.6, 0],
      },
      {
        points: [
          [-5.3, 0.505, 0],
          [-5.3, 3.652, 0],
          [-3.134, 3.652, 0],
        ],
        r: 0.045,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.34,
        labelPt: 'terra do aquecedor em PWM',
        labelAt: [-4.9, 4.1, 0],
      },
      {
        points: [
          [-5.23, 0.505, 0],
          [-5.23, 3.526, 0],
          [-3.134, 3.526, 0],
        ],
        r: 0.045,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.28,
        labelPt: 'a medida e a corrente, nao a tensao',
        labelAt: [-2.8, 1.2, 0],
      },
      {
        points: [
          [-5.16, 0.505, 0],
          [-5.16, 3.4, 0],
          [-3.134, 3.4, 0],
        ],
        r: 0.045,
        color: '#0f8a46',
      },
      {
        points: [
          [-5.09, 0.505, 0],
          [-5.09, 3.274, 0],
          [-3.134, 3.274, 0],
        ],
        r: 0.045,
        color: WIRE_BLACK,
      },
    ],
    labels: [
      { textPt: 'ela diz o QUANTO, e nao so o lado', pos: [-6.4, -5.3, 0] },
      { textPt: 'em lambda 1 a corrente e zero e inverte de lado', pos: [1.4, 2.1, 0] },
      { textPt: 'lambda 1,00 e a mistura ideal', pos: [1.4, -1.15, 0] },
      { textPt: 'mede de lambda 0,65 ate ar puro', pos: [6.6, 2.05, 0] },
      { textPt: 'so mede direito acima de 700 graus', pos: [6.4, -2.0, 0] },
      { textPt: 'esqueca o multimetro: aqui o teste e pelo scanner', pos: [6.4, -3.0, 0] },
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
      'O catalisador esta aberto: da para ver o favo de mel de canais finos, a camada de metais nobres nas duas faces e o gas atravessando, entrando sujo de um lado e saindo limpo do outro. O corpo esquenta de cinza a laranja depois da partida. Em cima, os dois sinais de sonda na mesma base de tempo, o light-off com a linha dos 280 graus e a janela estreitissima de lambda 1 onde os tres gases convertem ao mesmo tempo.',
    testPt: [
      'O teste classico e comparar as duas sondas com o motor quente. A de antes tem que oscilar rapido; a de depois tem que ficar quase parada, alta e estavel, perto de 0,6 a 0,8 V. Se a de depois copia o desenho da de antes, o catalisador nao esta mais convertendo.',
      'Contrapressao: com o motor acelerado nao pode haver restricao. Catalisador derretido por dentro entope, o motor perde forca e superaquece.',
      'Barulho de chocalho ao bater de leve com a mao no corpo dele indica ceramica quebrada.',
      'Codigo de eficiencia do catalisador abaixo do limite raramente aparece sozinho. Procure primeiro falha de combustao, injetor vazando ou consumo de oleo.',
      'Trocar o catalisador sem consertar a causa e jogar dinheiro fora: o novo morre igual.',
      'Nunca lave um catalisador quente com agua fria. O choque termico trinca a ceramica.',
    ],
    camDist: 15,
    camTarget: [0.4, 0.2, 0],
    parts: [
      { partId: 'catalytic-converter', pos: [-4.6, -1.6, 0], scale: 1.5, titleAt: [-4.6, 0.9, 0] },
      {
        partId: 'lambda-planar',
        pos: [-8.2, -0.6, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Sonda antes: controla a mistura',
        labelAt: [-8.4, -2.8, 0],
      },
      {
        partId: 'lambda-sensor',
        pos: [0.2, -0.9, 0],
        scale: 1.0,
        dim: true,
        labelPt: 'Sonda depois: fiscaliza o catalisador',
        labelAt: [1.4, -2.6, 0],
      },
      {
        partId: 'lambda-pair-trace',
        pos: [-4.4, 3.6, 0],
        scale: 1.0,
        labelPt: 'As duas sondas no mesmo tempo',
        labelAt: [-4.4, 5.4, 0],
      },
      {
        partId: 'cat-lightoff-panel',
        pos: [0.6, 3.6, 0],
        scale: 1.0,
        labelPt: 'Frio ele nao converte',
        labelAt: [0.6, 5.4, 0],
      },
      {
        partId: 'cat-window-panel',
        pos: [5.4, 3.6, 0],
        scale: 1.0,
        labelPt: 'A janela de lambda 1',
        labelAt: [5.4, 5.4, 0],
      },
      { partId: 'ecu', pos: [5.4, 0.2, 0], scale: 0.9, dim: true, labelPt: 'ECU', labelAt: [5.4, 1.3, 0] },
    ],
    boxes: [
      { pos: [-8.06, -1.25, 0], size: [0.7, 0.5, 0.7], color: '#5a6577' },
      { pos: [0.2, -1.25, 0], size: [0.7, 0.5, 0.7], color: '#5a6577' },
    ],
    pipes: [
      {
        points: [
          [-9.2, -1.6, 0],
          [-7.15, -1.6, 0],
        ],
        r: 0.3,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
        labelPt: 'CO, HC e NOx',
        labelAt: [-8.4, -2.2, 0],
      },
      {
        points: [
          [-2.05, -1.6, 0],
          [1.6, -1.6, 0],
        ],
        r: 0.3,
        color: EXH_PIPE,
        flow: '#7a8a99',
        flowSpeed: 0.22,
        labelPt: 'gas carbonico, agua e nitrogenio',
        labelAt: [1.4, -2.0, 0],
      },
      {
        points: [
          [-8.06, 0.35, 0],
          [-8.06, 1.5, 0],
          [3.9, 1.5, 0],
          [3.9, 0.452, 0],
          [4.266, 0.452, 0],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'sinal da sonda de antes',
        labelAt: [-3.2, 1.75, 0],
      },
      {
        points: [
          [0.2, 0.55, 0],
          [0.2, 1.1, 0],
          [3.6, 1.1, 0],
          [3.6, 0.326, 0],
          [4.266, 0.326, 0],
        ],
        r: 0.05,
        color: '#0f8a46',
        flow: ELEC,
        flowSpeed: 0.24,
        labelPt: 'sinal da sonda de depois',
        labelAt: [2.6, 1.35, 0],
      },
    ],
    labels: [
      { textPt: 'ele nao filtra: ele acelera reacoes quimicas', pos: [-4.6, -3.6, 0] },
      { textPt: 'platina e paladio queimam o CO e o combustivel cru', pos: [-4.6, -4.4, 0] },
      { textPt: 'o rodio devolve nitrogenio puro do NOx', pos: [-4.6, -5.2, 0] },
      { textPt: 'se a de depois copiar a de antes, ele morreu', pos: [3.4, -3.6, 0] },
      { textPt: 'quando morre, quase sempre foi outra peca que matou', pos: [3.4, -4.4, 0] },
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
      'O sensor esta em corte e rosqueado no tubo, com o elemento de platina na ponta acendendo conforme o gas esquenta. Logo adiante o filtro de particulas, tambem aberto, com os canais tampados alternados e a fuligem escurecendo ate queimar quando o gas passa dos 600 graus. Em cima, a curva do PTC subindo com o calor ao lado da curva do NTC da agua, que faz o contrario, o painel com as tres acoes da ECU acendendo por limite e o termometro do escape.',
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
    camDist: 15,
    camTarget: [0.4, 0.2, 0],
    parts: [
      { partId: 'egt-sensor', pos: [-6.4, 0.9, 0], scale: 1.5, titleAt: [-7.0, 5.2, 0] },
      {
        partId: 'dpf-filter',
        pos: [-2.6, -1.4, 0],
        scale: 1.2,
        labelPt: 'Filtro de particulas',
        labelAt: [-2.6, -2.6, 0],
      },
      {
        partId: 'catalytic-converter',
        pos: [1.6, -1.4, 0],
        scale: 0.8,
        dim: true,
        labelPt: 'Catalisador',
        labelAt: [1.6, -2.6, 0],
      },
      { partId: 'ptc-curve', pos: [-2.4, 4.6, 0], scale: 1.0, labelPt: 'PTC: sobe com o calor', labelAt: [-2.4, 6.3, 0] },
      { partId: 'egt-protect-panel', pos: [2.4, 4.6, 0], scale: 1.0, labelPt: 'O que a ECU faz', labelAt: [2.4, 6.3, 0] },
      { partId: 'egt-gauge', pos: [7.2, 4.6, 0], scale: 1.0, labelPt: 'Temperatura do gas', labelAt: [7.2, 6.3, 0] },
      { partId: 'ecu', pos: [7.2, 1.6, 0], scale: 0.9, dim: true, labelPt: 'ECU', labelAt: [7.2, 2.6, 0] },
    ],
    boxes: [{ pos: [-6.4, -0.95, 0], size: [0.8, 0.6, 0.8], color: '#5a6577' }],
    pipes: [
      {
        points: [
          [-9.2, -1.4, 0],
          [-4.7, -1.4, 0],
        ],
        r: 0.3,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.24,
        labelPt: 'de 600 a mais de 1000 graus',
        labelAt: [-8.0, -2.4, 0],
      },
      {
        points: [
          [-0.6, -1.4, 0],
          [0.25, -1.4, 0],
        ],
        r: 0.3,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.24,
      },
      {
        points: [
          [2.95, -1.4, 0],
          [4.2, -1.4, 0],
        ],
        r: 0.3,
        color: EXH_PIPE,
        flow: '#7a8a99',
        flowSpeed: 0.24,
      },
      {
        points: [
          [-6.52, 3.75, 0],
          [-6.52, 4.25, 0],
          [-4.9, 4.25, 0],
          [-4.9, 2.6, 0],
          [5.2, 2.6, 0],
          [5.2, 1.852, 0],
          [6.066, 1.852, 0],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'sinal do elemento de platina',
        labelAt: [0.0, 2.9, 0],
      },
      {
        points: [
          [-6.28, 3.75, 0],
          [-6.28, 4.0, 0],
          [-5.2, 4.0, 0],
          [-5.2, 2.35, 0],
          [4.9, 2.35, 0],
          [4.9, 1.726, 0],
          [6.066, 1.726, 0],
        ],
        r: 0.05,
        color: WIRE_BLACK,
        labelPt: 'terra de sinal',
        labelAt: [0.0, 2.05, 0],
      },
    ],
    labels: [
      { textPt: 'a ponta vive dentro do gas quente', pos: [-7.6, -3.2, 0] },
      { textPt: 'PTC: quanto mais quente, MAIOR a resistencia', pos: [-2.6, -3.2, 0] },
      { textPt: 'a fuligem so queima acima de 600 graus', pos: [-2.6, -4.0, 0] },
      { textPt: 'ECU enriquece para esfriar a turbina', pos: [3.6, -3.2, 0] },
      { textPt: 'sem ele o filtro nao regenera com seguranca', pos: [3.6, -4.0, 0] },
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
      'O acumulador esta em corte: os quadradinhos na parede sao os sitios onde o NOx fica preso como nitrato e vao acendendo enquanto o motor roda pobre. Quando enche, a ECU manda o pulso rico e em segundos tudo se solta e sai como nitrogenio. Em cima, a barra de estoque com o contador de regeneracoes, o NOx que a sonda ve escapando e o painel do enxofre, que ocupa os mesmos sitios e so sai numa limpeza mais quente.',
    testPt: [
      'Ele nao tem fio proprio. Quem tem fio e o sensor de NOx que trabalha junto com ele.',
      'Codigo de eficiencia baixa: antes de trocar, confira se as regeneracoes estao acontecendo. O scanner mostra o contador de regeneracao.',
      'Combustivel com muito enxofre satura ele. Em alguns carros da para forcar a dessulfatacao pelo scanner.',
      'Consumo subindo sem motivo pode ser regeneracao acontecendo com frequencia demais porque o catalisador nao guarda mais.',
      'Igual ao de tres vias: falha de combustao, oleo queimando ou mistura rica cronica destroem ele antes da hora.',
    ],
    camDist: 15,
    camTarget: [0.4, 0.2, 0],
    parts: [
      { partId: 'nox-catalyst', pos: [-2.4, -1.6, 0], scale: 1.3, titleAt: [-2.4, 0.9, 0] },
      {
        partId: 'catalytic-converter',
        pos: [-7.0, -1.6, 0],
        scale: 0.75,
        dim: true,
        labelPt: 'Catalisador de tres vias',
        labelAt: [-7.0, -2.5, 0],
      },
      {
        partId: 'nox-sensor',
        pos: [2.6, -1.0, 0],
        scale: 0.9,
        labelPt: 'Sensor de NOx',
        labelAt: [1.6, 0.9, 0],
      },
      {
        partId: 'nox-store-panel',
        pos: [-5.4, 3.6, 0],
        scale: 1.0,
        labelPt: 'Enche pobre, esvazia rico',
        labelAt: [-5.4, 5.4, 0],
      },
      {
        partId: 'nox-trace-panel',
        pos: [-0.6, 3.6, 0],
        scale: 1.0,
        labelPt: 'NOx que escapa',
        labelAt: [-0.6, 5.4, 0],
      },
      {
        partId: 'sulfur-panel',
        pos: [4.4, 3.6, 0],
        scale: 1.0,
        labelPt: 'O enxofre nao sai na regeneracao',
        labelAt: [4.4, 5.4, 0],
      },
      { partId: 'ecu', pos: [8.2, 3.6, 0], scale: 0.9, dim: true, labelPt: 'ECU', labelAt: [8.2, 4.8, 0] },
    ],
    boxes: [{ pos: [1.79, -1.35, 0], size: [0.7, 0.5, 0.7], color: '#5a6577' }],
    pipes: [
      {
        points: [
          [-9.2, -1.6, 0],
          [-8.35, -1.6, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
      },
      {
        points: [
          [-5.65, -1.6, 0],
          [-4.9, -1.6, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
      },
      {
        points: [
          [0.15, -1.6, 0],
          [4.6, -1.6, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#7a8a99',
        flowSpeed: 0.22,
        labelPt: 'nitrogenio puro',
        labelAt: [4.2, -2.2, 0],
      },
      {
        points: [
          [3.35, -0.217, 0],
          [3.35, 0.6, 0],
          [6.4, 0.6, 0],
          [6.4, 3.852, 0],
          [7.066, 3.852, 0],
        ],
        r: 0.05,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'a sonda de NOx fala pela rede',
        labelAt: [5.0, 1.1, 0],
      },
      {
        points: [
          [3.56, -0.217, 0],
          [3.56, 0.35, 0],
          [6.6, 0.35, 0],
          [6.6, 3.726, 0],
          [7.066, 3.726, 0],
        ],
        r: 0.05,
        color: WIRE_BLACK,
      },
    ],
    labels: [
      { textPt: 'com oxigenio sobrando o de tres vias nao da conta', pos: [-4.4, -3.5, 0] },
      { textPt: 'aqui o NOx fica preso na parede como nitrato', pos: [-4.4, -4.3, 0] },
      { textPt: 'a ECU manda um pulso rico e ele esvazia em segundos', pos: [-4.4, -5.1, 0] },
      { textPt: 'a sonda depois diz quanto NOx escapou', pos: [4.4, -3.5, 0] },
      { textPt: 'regeneracao demais quer dizer que ele nao guarda mais', pos: [4.4, -4.3, 0] },
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
      'A sonda esta em corte e rosqueada depois do catalisador: da para ver o dedo de zirconia com a coluna de ar de referencia por dentro subindo pelo cabo, o eletrodo do lado do escape mudando de cor entre rico e pobre e a resistencia de aquecimento acendendo. Em cima, a curva em degrau com a rampa da banda larga apagada atras, os dois desenhos comparados com o veredito do catalisador e o painel do aquecedor. Embaixo, os arranjos de 1 a 5 fios nas cores Bosch.',
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
    camDist: 15,
    camTarget: [0.4, 0.2, 0],
    parts: [
      { partId: 'lambda-sensor', pos: [1.4, -0.47, 0], scale: 1.9, titleAt: [-1.6, 0.6, 0] },
      {
        partId: 'catalytic-converter',
        pos: [-2.6, -1.8, 0],
        scale: 0.9,
        dim: true,
        labelPt: 'Catalisador',
        labelAt: [-2.2, -2.9, 0],
      },
      {
        partId: 'lambda-planar',
        pos: [-6.4, -0.5, 0],
        scale: 1.3,
        dim: true,
        labelPt: 'Banda larga, antes',
        labelAt: [-6.4, 1.3, 0],
      },
      {
        partId: 'step-curve-panel',
        pos: [-6.6, 4.2, 0],
        scale: 1.0,
        labelPt: 'A curva em degrau',
        labelAt: [-6.6, 6.0, 0],
      },
      {
        partId: 'cat-verdict-panel',
        pos: [-1.6, 4.2, 0],
        scale: 1.0,
        labelPt: 'O veredito do catalisador',
        labelAt: [-1.6, 6.0, 0],
      },
      {
        partId: 'lsf-heater-panel',
        pos: [3.6, 4.2, 0],
        scale: 1.0,
        labelPt: 'Fria ela nao gera sinal',
        labelAt: [3.6, 6.0, 0],
      },
      {
        partId: 'lsf-wiring-panel',
        pos: [-5.4, -4.0, 0],
        scale: 1.0,
        labelPt: 'Quantos fios e por que',
        labelAt: [-5.4, -5.8, 0],
      },
      { partId: 'ecu', pos: [7.4, 2.0, 0], scale: 0.9, dim: true, labelPt: 'ECU', labelAt: [7.4, 3.2, 0] },
    ],
    boxes: [
      { pos: [1.4, -1.55, 0], size: [0.9, 0.6, 0.9], color: '#5a6577' },
      { pos: [-6.22, -1.55, 0], size: [0.7, 0.5, 0.7], color: '#5a6577' },
      {
        pos: [4.0, 0.6, 0],
        size: [0.9, 0.9, 0.7],
        color: '#8a6d10',
        labelPt: 'Rele principal',
        labelAt: [4.0, -0.4, 0],
      },
    ],
    pipes: [
      {
        points: [
          [-9.2, -1.8, 0],
          [-4.25, -1.8, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#c62222',
        flowSpeed: 0.22,
      },
      {
        points: [
          [-0.95, -1.8, 0],
          [5.2, -1.8, 0],
        ],
        r: 0.28,
        color: EXH_PIPE,
        flow: '#7a8a99',
        flowSpeed: 0.22,
        labelPt: 'gas estavel: o catalisador absorveu a oscilacao',
        labelAt: [3.4, -2.6, 0],
      },
      {
        points: [
          [1.1435, 2.285, 0],
          [1.1435, 2.75, 0],
          [6.2, 2.75, 0],
          [6.2, 2.252, 0],
          [6.266, 2.252, 0],
        ],
        r: 0.05,
        color: '#111827',
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'preto sinal, brancos aquecedor',
        labelAt: [4.0, 1.35, 0],
      },
      {
        points: [
          [1.3145, 2.285, 0],
          [1.3145, 2.65, 0],
          [6.0, 2.65, 0],
          [6.0, 2.126, 0],
          [6.266, 2.126, 0],
        ],
        r: 0.05,
        color: '#8a8f98',
      },
      {
        points: [
          [1.4855, 2.285, 0],
          [1.4855, 2.55, 0],
          [5.8, 2.55, 0],
          [5.8, 2.0, 0],
          [6.266, 2.0, 0],
        ],
        r: 0.05,
        color: '#e8e8e8',
      },
      {
        points: [
          [1.6565, 2.285, 0],
          [1.6565, 2.45, 0],
          [4.0, 2.45, 0],
          [4.0, 1.05, 0],
        ],
        r: 0.05,
        color: '#e8e8e8',
      },
    ],
    labels: [
      { textPt: 'a de tras oscila; esta aqui tem que ficar reta', pos: [-2.2, -0.4, 0] },
      { textPt: 'ela mede o oxigenio que SOBROU, e nao o combustivel', pos: [3.4, -3.4, 0] },
      { textPt: 'a virada acontece toda em cima de 0,45 V', pos: [3.4, -4.2, 0] },
      { textPt: 'ela respira ar de referencia pelo cabo: nunca sele', pos: [3.4, -5.0, 0] },
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
      'Em corte, com as seis celulas e a carga acompanhando o ciclo do carro. Ao lado estao o motor de partida, o alternador, o IBS no polo negativo, a caixa de fusiveis, o rele principal e o cabo de terra indo para o bloco.',
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
    camDist: 15,
    camTarget: [0.4, 0.2, 0],
    parts: [
      { partId: 'battery', pos: [-6.6, 0.4, 0], scale: 1.7, titleAt: [-6.6, -1.6, 0] },
      {
        partId: 'ibs-sensor',
        pos: [-5.376, 2.202, 0],
        scale: 0.8,
        rot: [0, Math.PI, 0],
        labelPt: 'IBS no polo negativo',
        labelAt: [-1.4, 2.3, 0],
      },
      { partId: 'starter-motor', pos: [-6.0, -2.6, 0], scale: 1.0, labelPt: 'Motor de partida', labelAt: [-6.0, -3.6, 0] },
      { partId: 'alternator', pos: [-1.6, -2.6, 0], scale: 1.2, labelPt: 'Alternador', labelAt: [-1.7, -3.9, 0] },
      { partId: 'volt-trace-panel', pos: [-6.0, 4.6, 0], scale: 1.0, labelPt: 'A tensao do sistema', labelAt: [-6.0, 6.3, 0] },
      {
        partId: 'dead-time-panel',
        pos: [-0.6, 4.6, 0],
        scale: 1.0,
        labelPt: 'Tensao baixa alonga o injetor',
        labelAt: [-0.6, 6.3, 0],
      },
      {
        partId: 'ground-drop-panel',
        pos: [4.2, 4.6, 0],
        scale: 1.0,
        labelPt: 'Terra ruim desregula sensor',
        labelAt: [4.2, 6.3, 0],
      },
      { partId: 'ecu', pos: [6.0, -2.4, 0], scale: 1.0, dim: true, labelPt: 'ECU', labelAt: [6.0, -1.2, 0] },
    ],
    boxes: [
      { pos: [-1.6, 0.6, 0], size: [1.1, 1.3, 0.9], color: '#3d4657', labelPt: 'Fusiveis e reles', labelAt: [-1.4, 1.8, 0] },
      { pos: [1.8, -0.2, 0], size: [0.9, 0.9, 0.7], color: '#8a6d10', labelPt: 'Rele principal', labelAt: [1.8, -1.3, 0] },
      { pos: [0.0, -4.6, 0], size: [12.0, 0.8, 1.4], color: '#2b313d', labelPt: 'Bloco do motor', labelAt: [-7.2, -4.6, 0] },
    ],
    pipes: [
      {
        points: [
          [-7.95, 2.44, 0],
          [-7.95, 2.7, 0],
          [-9.0, 2.7, 0],
          [-9.0, -2.6, 0],
          [-6.9, -2.6, 0],
        ],
        r: 0.12,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
      },
      {
        points: [
          [-7.7, 2.44, 0],
          [-7.7, 2.9, 0],
          [-2.9, 2.9, 0],
          [-2.9, 0.6, 0],
          [-2.15, 0.6, 0],
        ],
        r: 0.09,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: '+12 V permanente',
        labelAt: [-2.5, 3.1, 0],
      },
      {
        points: [
          [-5.0, 2.542, 0],
          [-5.0, 2.75, 0],
          [-4.6, 2.75, 0],
          [-4.6, -4.2, 0],
        ],
        r: 0.11,
        color: WIRE_BLACK,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'toda corrente volta pelo terra',
        labelAt: [-4.6, -3.35, 0],
      },
      {
        points: [
          [-4.256, 1.962, 0],
          [-4.0, 1.962, 0],
          [-4.0, -3.6, 0],
          [4.6, -3.6, 0],
          [4.6, -2.68, 0],
          [4.74, -2.68, 0],
        ],
        r: 0.06,
        color: WIRE_SIGNAL,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'o IBS informa o estado de carga',
        labelAt: [1.4, -3.0, 0],
      },
      {
        points: [
          [-1.05, 0.6, 0],
          [0.6, 0.6, 0],
          [0.6, -0.2, 0],
          [1.35, -0.2, 0],
        ],
        r: 0.07,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
      },
      {
        points: [
          [-1.05, 0.9, 0],
          [4.3, 0.9, 0],
          [4.3, -2.12, 0],
          [4.74, -2.12, 0],
        ],
        r: 0.07,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
        labelPt: 'permanente e pos-chave',
        labelAt: [3.9, 0.4, 0],
      },
      {
        points: [
          [2.25, -0.2, 0],
          [4.0, -0.2, 0],
          [4.0, -2.26, 0],
          [4.74, -2.26, 0],
        ],
        r: 0.07,
        color: '#7127c9',
        flow: ELEC,
        flowSpeed: 0.3,
      },
      {
        points: [
          [6.0, -2.95, 0],
          [6.0, -4.2, 0],
        ],
        r: 0.07,
        color: WIRE_BLACK,
        flow: ELEC,
        flowSpeed: 0.3,
      },
      {
        points: [
          [-1.0, -2.12, 0],
          [-1.0, -1.4, 0],
          [-1.6, -1.4, 0],
          [-1.6, -0.05, 0],
        ],
        r: 0.08,
        color: WIRE_RED,
        flow: ELEC,
        flowSpeed: 0.3,
      },
    ],
    labels: [
      { textPt: 'na partida nao pode cair de 9,5 V', pos: [-3.6, -5.6, 0] },
      { textPt: 'parada 12,6 V. rodando de 13,8 a 14,4 V', pos: [1.4, -5.6, 0] },
      { textPt: 'a ECU corrige o injetor pela tensao', pos: [6.6, -5.6, 0] },
    ],
  },
};

export function hasFocus(numero: number): boolean {
  return numero in PART_FOCUS;
}

export { EXH_PIPE, FUEL_PIPE, HOSE, METAL_PIPE, WIRE_BLACK, WIRE_RED, WIRE_SIGNAL };
