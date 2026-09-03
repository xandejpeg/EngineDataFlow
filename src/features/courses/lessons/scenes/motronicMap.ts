/**
 * Mapa do sistema de injecao eletronica (esquema Motronic) em 3D.
 * Cada item aponta para uma peca ja existente em PART_MODELS, entao o mapa
 * mostra a peca de verdade no lugar dela dentro do motor, e nao um icone.
 */

export type MapGroup = 'ar' | 'combustivel' | 'ignicao' | 'sensores' | 'escape' | 'controle';

export interface MapItem {
  numero: number;
  /** Chave em PART_MODELS. */
  partId: string;
  namePt: string;
  group: MapGroup;
  pos: [number, number, number];
  scale: number;
  rot?: [number, number, number];
  /** Ligado no chicote da ECU. */
  wired: boolean;
  /** Onde o fio termina: direto na ECU (padrao) ou no barramento CAN. */
  link?: 'ecu' | 'can';
  /** Desloca o balao do numero quando o lugar de cima esta ocupado. */
  badge?: [number, number];
  /** Distancia da camera quando a peca e focada. */
  focus?: number;
  /** O que a peca faz, na linguagem da oficina. */
  descPt: string;
  /** O que se mede nela e os valores tipicos de carro de rua. */
  medePt: string;
}

// Tons escuros de proposito: o mapa e desenhado sobre fundo branco.
export const GROUP_META: Record<MapGroup, { labelPt: string; color: string }> = {
  ar: { labelPt: 'Ar', color: '#1d5fd8' },
  combustivel: { labelPt: 'Combustivel', color: '#c2610a' },
  ignicao: { labelPt: 'Ignicao', color: '#7127c9' },
  sensores: { labelPt: 'Sensores', color: '#0f8a46' },
  escape: { labelPt: 'Escape', color: '#c62222' },
  controle: { labelPt: 'Controle', color: '#8a6d10' },
};

export const GROUP_ORDER: MapGroup[] = [
  'ar',
  'combustivel',
  'ignicao',
  'sensores',
  'escape',
  'controle',
];

export const MOTRONIC_ITEMS: MapItem[] = [
  {
    numero: 1,
    partId: 'canister',
    namePt: 'Canister',
    group: 'combustivel',
    pos: [-8.6, 5.0, 0],
    scale: 0.67,
    badge: [0.85, 0],
    wired: false,
    descPt:
      'Caixa com carvao ativado que prende o vapor de gasolina do tanque em vez de deixar ele sair para o ar. O vapor fica guardado ali ate a ECU mandar queimar.',
    medePt:
      'Nao tem sinal eletrico. O teste e mecanico: o sopro deve passar do tanque para o canister e nao vazar para a atmosfera. Canister encharcado de combustivel liquido derruba a marcha lenta.',
  },
  {
    numero: 2,
    partId: 'maf-sensor',
    namePt: 'Medidor de massa de ar (MAF)',
    group: 'ar',
    pos: [-7.7, 2.4, 0],
    scale: 0.34,
    wired: true,
    descPt:
      'Fio quente na entrada de ar. A ECU aquece o fio e mede a corrente que precisa para manter a temperatura: quanto mais ar passa, mais o fio esfria e maior a corrente. Dai sai a MASSA de ar em g/s, que e o que define quanto combustivel entra.',
    medePt:
      'Alimentacao 12 V, terra e sinal. Sinal de 0,5 a 1,2 V na lenta e 3,5 a 4,5 V em plena carga. No scanner: 2 a 4 g/s na lenta e 20 a 30 g/s acelerando forte num motor 1.0 a 2.0.',
  },
  {
    numero: 3,
    partId: 'ecu',
    namePt: 'Controle eletronico (ECU)',
    group: 'controle',
    pos: [-8.6, -1.8, 0],
    scale: 0.52,
    focus: 5,
    wired: false,
    descPt:
      'O cerebro. Le todos os sensores, cruza com os mapas gravados na memoria e comanda os atuadores: tempo de injecao, ponto de ignicao, abertura da borboleta, purga, EGR. Nao decide nada sozinha: ela so responde ao que os sensores contam.',
    medePt:
      'Alimentacao permanente 12 V, pos-chave 12 V e varios terras. A queda de tensao no terra da ECU tem que ficar abaixo de 0,1 V; terra ruim faz a central errar sem ter defeito nenhum.',
  },
  {
    numero: 4,
    partId: 'obd-connector',
    namePt: 'Interface de diagnostico (OBD2)',
    group: 'controle',
    pos: [-8.6, -4.2, 0],
    scale: 0.74,
    wired: true,
    link: 'can',
    descPt:
      'Tomada de 16 pinos onde o scanner conversa com a ECU. Por ela saem os codigos de falha, os parametros ao vivo e os testes de atuador.',
    medePt:
      'Pino 16 com 12 V permanente, pinos 4 e 5 de terra. A rede CAN sai nos pinos 6 (CAN H) e 14 (CAN L). Scanner que nao conecta costuma ser fusivel do pino 16 queimado.',
  },
  {
    numero: 5,
    partId: 'mil-lamp',
    namePt: 'Lampada do diagnostico (MIL)',
    group: 'controle',
    pos: [-5.6, -4.2, 0],
    scale: 0.575,
    wired: true,
    link: 'can',
    descPt:
      'A luz de anomalia do painel. Acesa fixa e falha registrada; piscando e falha de combustao acontecendo agora, que destroi o catalisador se o carro seguir andando.',
    medePt:
      'Recebe 12 V da ignicao e a ECU aterra o outro lado para acender. Consumo de 100 a 150 mA. Se ela nao acende ao ligar a chave, o autoteste nao rodou: pode ser lampada queimada escondendo defeito.',
  },
  {
    numero: 6,
    partId: 'immobilizer-antenna',
    namePt: 'Bloqueio de partida (imobilizador)',
    group: 'controle',
    pos: [-5.6, -1.8, 0],
    scale: 0.4,
    wired: true,
    link: 'can',
    descPt:
      'Antena em volta do cilindro da ignicao que le o chip transponder da chave. Se o codigo nao bater, a ECU corta injecao e ignicao: o motor gira mas nao pega.',
    medePt:
      'A bobina da antena costuma medir de 5 a 20 ohm. Sintoma classico: o motor gira normal, tem combustivel, mas o pulso do injetor nunca aparece e a luz da chave fica piscando no painel.',
  },
  {
    numero: 7,
    partId: 'can-bus',
    namePt: 'Rede CAN',
    group: 'controle',
    pos: [-7.1, -0.6, -0.6],
    scale: 0.4,
    rot: [0, 0, Math.PI / 2],
    wired: false,
    descPt:
      'Par trancado (CAN H e CAN L) com resistor de 120 ohms em cada ponta. E por ele que a ECU do motor fala com cambio, ABS, painel e carroceria usando dois fios so, em vez de um fio para cada sinal.',
    medePt:
      'Em repouso os dois ficam em 2,5 V; transmitindo, o CAN H sobe para 3,5 V e o CAN L cai para 1,5 V, sempre espelhados. Com tudo desligado, a resistencia entre H e L tem que dar 60 ohm (dois resistores de 120 em paralelo).',
  },
  {
    numero: 8,
    partId: 'purge-valve',
    namePt: 'Valvula de purga do canister',
    group: 'combustivel',
    pos: [-5.6, 5.0, 0],
    scale: 0.58,
    badge: [0.85, 0],
    wired: true,
    descPt:
      'Solenoide que a ECU abre em pulsos para o vacuo do coletor puxar o vapor guardado no canister e queimar no motor. Se travar aberta, entra combustivel sem controle e a marcha lenta fica instavel.',
    medePt:
      'Bobina de 20 a 30 ohm. Comando em PWM: 0% na partida e com o motor frio, subindo ate 80 ou 100% com o motor quente em carga parcial. Travada aberta, joga o ajuste de combustivel para o lado negativo.',
  },
  {
    numero: 9,
    partId: 'throttle-body',
    namePt: 'Corpo de borboleta motorizado (EGAS)',
    group: 'ar',
    pos: [-5.0, 2.4, 0],
    scale: 0.6,
    wired: true,
    descPt:
      'Sem cabo de acelerador: um motor eletrico abre a borboleta e dois potenciometros dizem para a ECU onde ela esta. A propria ECU decide a abertura, entao ela tambem faz marcha lenta, controle de tracao e limitador.',
    medePt:
      'Motor de 1 a 3 ohm. Os dois sensores de posicao andam juntos e invertidos: um sai de 0,5 V e vai a 4,5 V enquanto o outro faz o contrario. Se os dois derem o mesmo valor, a ECU entra em modo de emergencia.',
  },
  {
    numero: 10,
    partId: 'hp-fuel-pump',
    namePt: 'Bomba de alta pressao',
    group: 'combustivel',
    pos: [2.95, 3.3, 0.55],
    scale: 0.53,
    wired: true,
    descPt:
      'Movida por um ressalto do comando, pega o combustivel a 4 bar da bomba do tanque e joga na galeria a 50-200 bar. E o que permite a injecao direta pulverizar dentro da camara.',
    medePt:
      'Solenoide dosador de 0,5 a 2 ohm, acionado com pico de 5 a 12 A. Pressao de 50 bar na lenta ate 150 ou 200 bar em carga. Pressao que nao sobe na partida quase sempre e ressalto do comando gasto ou dosador travado.',
  },
  {
    numero: 11,
    partId: 'map-sensor',
    namePt: 'Sensor de pressao do coletor (MAP)',
    group: 'sensores',
    pos: [0.2, 5.0, -1.35],
    scale: 0.74,
    badge: [-0.85, 0.15],
    wired: true,
    descPt:
      'Le a pressao absoluta dentro do coletor. Marcha lenta da vacuo alto (pressao baixa), pe no fundo chega perto da pressao atmosferica. E o sinal de CARGA do motor.',
    medePt:
      'Alimentado com 5 V. Chave ligada e motor parado: cerca de 4,5 V. Na marcha lenta cai para 1,0 a 1,5 V. Acelerando de vez volta para 4,0 a 4,7 V. Se ficar em 4,5 V com o motor rodando, ou a mangueira soltou ou o coletor esta furado.',
  },
  {
    numero: 12,
    partId: 'egr-valve',
    namePt: 'Valvula EGR',
    group: 'escape',
    pos: [3.9, 4.7, 0],
    scale: 0.71,
    wired: true,
    descPt:
      'Devolve uma parte do gas de escape para a admissao. Esse gas nao queima, entao ele baixa a temperatura da combustao, e e temperatura alta que cria o NOx.',
    medePt:
      'Solenoide ou motor de passo de 5 a 20 ohm. O sensor de posicao trabalha de 0,5 V fechada a 4,5 V toda aberta. EGR travada aberta da marcha lenta tremida e falha de combustao parado.',
  },
  {
    numero: 13,
    partId: 'rail-pressure-sensor',
    namePt: 'Sensor de pressao da galeria',
    group: 'sensores',
    pos: [-2.55, 2.0, 1.15],
    scale: 0.63,
    wired: true,
    descPt:
      'Diz para a ECU a pressao real dentro da galeria. Com ela a ECU fecha a malha da bomba de alta e corrige o tempo de injecao, porque a mesma abertura entrega mais combustivel se a pressao subir.',
    medePt:
      'Alimentado com 5 V, sinal de 0,5 V na pressao baixa ate 4,5 V na maxima. No scanner voce compara pressao pedida com pressao real: diferenca grande e bomba fraca, dosador travado ou injetor vazando.',
  },
  {
    numero: 14,
    partId: 'fuel-rail-gdi',
    namePt: 'Galeria de combustivel',
    group: 'combustivel',
    pos: [-1.2, 3.3, 1.15],
    scale: 0.42,
    wired: false,
    descPt:
      'Tubo reforcado que guarda combustivel pressurizado e alimenta todos os injetores. Tambem serve de acumulador: segura a pressao quando varios injetores abrem juntos.',
    medePt:
      'Nao tem sinal proprio, mede-se a pressao com manometro: 3 a 4 bar na injecao indireta e 50 a 200 bar na direta. Depois de desligar, a pressao tem que cair devagar; queda rapida e injetor ou regulador vazando.',
  },
  {
    numero: 15,
    partId: 'injector-gdi',
    namePt: 'Valvula de injecao',
    group: 'combustivel',
    pos: [-1.2, 1.9, 1.15],
    scale: 0.51,
    badge: [0.9, 0],
    rot: [0, 0, 0.55],
    wired: true,
    descPt:
      'Solenoide que a ECU abre por alguns milissegundos. Quem determina a quantidade de combustivel e o TEMPO que ela fica aberta, nao a pressao.',
    medePt:
      'Injetor indireto de alta impedancia: 12 a 16 ohm. De baixa impedancia: 1,5 a 4 ohm. Injetor de injecao direta: 1 a 3 ohm, com pico de 6 a 12 A e depois corrente de manutencao. Tempo de injecao na lenta: 2 a 4 ms.',
  },
  {
    numero: 16,
    partId: 'knock-sensor',
    namePt: 'Sensor de detonacao',
    group: 'sensores',
    pos: [3.0, -2.1, 0.9],
    scale: 0.64,
    wired: true,
    descPt:
      'Microfone piezeletrico parafusado no bloco. Escuta a batida de pino e faz a ECU atrasar o ponto naquele cilindro ate a batida sumir.',
    medePt:
      'Nao tem alimentacao: ele mesmo gera de 0,1 a 1 V em corrente alternada quando o bloco vibra. A resistencia entre os terminais e altissima, acima de 1 Mohm. O torque do parafuso importa: apertado errado ele para de escutar.',
  },
  {
    numero: 17,
    partId: 'ckp-sensor',
    namePt: 'Sensor de rotacao (CKP)',
    group: 'sensores',
    pos: [-3.9, -3.0, 0.9],
    scale: 0.41,
    wired: true,
    descPt:
      'Le a roda dentada da arvore de manivelas. Da a rotacao e, pela falha de dentes, a posicao exata do virabrequim. Sem esse sinal a ECU nao injeta nem faz faisca: o motor nem tenta pegar.',
    medePt:
      'Indutivo: 400 a 1200 ohm entre os fios, gerando 0,5 a 2 V AC na partida e mais de 20 V AC em rotacao alta. Hall: alimentado com 5 ou 12 V, entrega onda quadrada entre 0,3 V e a tensao de alimentacao.',
  },
  {
    numero: 18,
    partId: 'fuel-pump-module',
    namePt: 'Modulo de combustivel',
    group: 'combustivel',
    pos: [-2.8, -4.6, 0],
    scale: 0.52,
    wired: true,
    descPt:
      'Dentro do tanque: bomba, filtro, regulador de pressao e boia. Manda combustivel para a frente ja na pressao certa e informa o nivel ao painel.',
    medePt:
      'A bomba puxa de 4 a 8 A com a pressao normal; corrente acima disso e bomba forcada ou filtro entupido. A boia varia de uns 10 ohm com o tanque cheio a 300 ohm vazio, dependendo do fabricante.',
  },
  {
    numero: 19,
    partId: 'ignition-coil',
    namePt: 'Bobina de ignicao',
    group: 'ignicao',
    pos: [0, 2.85, 0],
    scale: 0.385,
    badge: [0.55, -0.7],
    wired: true,
    descPt:
      'Transforma os 12 V da bateria em dezenas de milhares de volts. A ECU carrega o primario e corta a corrente; e o CORTE que gera a alta tensao e a faisca.',
    medePt:
      'Primario de 0,5 a 1,5 ohm e secundario de 6 a 15 kohm. Tempo de carga (dwell) de 1,5 a 4 ms. A faisca sai com 8 a 25 kV, dependendo da folga da vela e da compressao.',
  },
  {
    numero: 20,
    partId: 'cmp-sensor',
    namePt: 'Sensor de fase (CMP)',
    group: 'sensores',
    pos: [2.95, 1.5, 0.9],
    scale: 0.61,
    badge: [0.9, 0],
    wired: true,
    descPt:
      'Le o comando de valvulas e diz em qual das duas voltas o motor esta. Sem ele a ECU sabe a posicao mas nao sabe se o cilindro esta na compressao ou no escape, e nao consegue injetar sequencial.',
    medePt:
      'Efeito Hall alimentado com 5 ou 12 V. Onda quadrada entre 0,3 V e a tensao de alimentacao, uma vez a cada duas voltas do virabrequim. Sem esse sinal o motor ainda pega, mas demora mais na partida.',
  },
  {
    numero: 21,
    partId: 'temp-sensor',
    namePt: 'Sensor de temperatura do motor (ECT)',
    group: 'sensores',
    pos: [-3.5, 0.5, 0.9],
    scale: 0.68,
    wired: true,
    descPt:
      'Termistor NTC: frio tem resistencia alta, quente tem resistencia baixa. Motor frio pede mistura mais rica, e e esse sensor que autoriza o enriquecimento.',
    medePt:
      'A 20 C mede de 2 a 3 kohm; a 80 C cai para 300 ou 400 ohm; a 90 C fica perto de 200 ohm. Em tensao: 3,0 a 3,5 V frio e 0,4 a 0,8 V quente. Sensor que sempre marca frio deixa o carro bebendo combustivel.',
  },
  {
    numero: 22,
    partId: 'lambda-planar',
    namePt: 'Sonda lambda pre-catalisador (LSU)',
    group: 'escape',
    pos: [7.0, -0.6, 0],
    scale: 0.59,
    rot: [0, 0, -Math.PI / 2],
    wired: true,
    descPt:
      'Sonda de banda larga logo na saida do motor. Le o oxigenio que sobrou da queima e e ela que fecha a malha da injecao: com esse sinal a ECU corrige o tempo de injetor a cada instante.',
    medePt:
      'Aquecedor de 2 a 4 ohm. Aqui nao se le tensao de sinal como na banda estreita: o que vale e a corrente de bombeamento, de -3 a +3 mA, que o scanner mostra ja convertida em fator lambda (0,7 ate ar puro).',
  },
  {
    numero: 23,
    partId: 'catalytic-converter',
    namePt: 'Pre-catalisador',
    group: 'escape',
    pos: [5.6, -2.0, 0],
    scale: 0.485,
    badge: [-1.4, 0.85],
    rot: [0, 0, Math.PI / 2],
    focus: 5,
    wired: false,
    descPt:
      'Colmeia ceramica coberta de platina, paladio e rodio. Fica colado no motor para esquentar rapido e ja comecar a limpar CO, HC e NOx nos primeiros segundos, que e quando o carro mais polui.',
    medePt:
      'Nao tem sinal. Avalia-se pela temperatura (a saida tem que ficar de 30 a 100 C mais quente que a entrada) e pela comparacao das duas sondas no scanner. Contrapressao acima de 0,3 bar indica catalisador entupido.',
  },
  {
    numero: 24,
    partId: 'egt-sensor',
    namePt: 'Sensor de temperatura dos gases (EGT)',
    group: 'escape',
    pos: [7.0, -3.2, 0],
    scale: 0.33,
    rot: [0, 0, -Math.PI / 2],
    wired: true,
    descPt:
      'Vigia a temperatura do escape. Se passar do limite a ECU protege o catalisador enriquecendo a mistura ou cortando carga: ceramica derretida entope o escape.',
    medePt:
      'Trabalha de 200 a 900 C. Nas versoes NTC o sinal cai de uns 4,5 V com o escape frio para menos de 1 V bem quente. Nas versoes termopar a saida e de poucos milivolts e so o modulo consegue ler direito.',
  },
  {
    numero: 25,
    partId: 'nox-catalyst',
    namePt: 'Catalisador de NOx',
    group: 'escape',
    pos: [5.6, -4.4, 0],
    scale: 0.447,
    badge: [-1.4, 0.85],
    rot: [0, 0, Math.PI / 2],
    focus: 5,
    wired: false,
    descPt:
      'Usado quando o motor roda com mistura pobre e sobra oxigenio, situacao em que o catalisador de tres vias nao consegue quebrar o NOx. Ele ARMAZENA o NOx e depois a ECU manda um pulso rico para queimar o que ficou guardado.',
    medePt:
      'Nao tem sinal proprio. Quem controla e o sensor de NOx e a estrategia de regeneracao: de tempos em tempos a ECU enriquece a mistura por alguns segundos para esvaziar o acumulador.',
  },
  {
    numero: 26,
    partId: 'lambda-sensor',
    namePt: 'Sonda lambda pos-catalisador (LSF)',
    group: 'escape',
    pos: [7.0, -5.5, 0],
    scale: 0.53,
    rot: [0, 0, -Math.PI / 2],
    wired: true,
    descPt:
      'Sonda de banda estreita depois do catalisador. Ela NAO corrige a injecao: ela audita o catalisador. Sinal quase reto perto de 600-700 mV significa catalisador bom; se ele comecar a copiar a oscilacao da sonda da frente, o catalisador morreu.',
    medePt:
      'Aquecedor de 5 a 15 ohm. Sinal de 100 a 900 mV. Com catalisador bom fica quase parado entre 600 e 750 mV; se comecar a oscilar 1 a 2 vezes por segundo igual a sonda da frente, e catalisador saturado.',
  },
  {
    numero: 27,
    partId: 'battery',
    namePt: 'Bateria 12 V',
    group: 'controle',
    pos: [-8.6, 0.6, 0],
    scale: 0.575,
    wired: false,
    descPt:
      'A fonte de tudo. Alimenta a ECU, as bobinas, os injetores, a bomba e os aquecedores das sondas. Bateria fraca nao da so problema de partida: ela faz sensor entregar valor errado e a ECU registrar defeito que nao existe.',
    medePt:
      'Em repouso 12,4 a 12,7 V (abaixo de 12,2 V ja esta descarregada). Com o motor ligado o alternador segura entre 13,8 e 14,4 V. Durante a partida a tensao nao pode cair abaixo de 9,6 V.',
  },
];
