/**
 * Conteudo do curso (pt-BR), estruturado para exibicao detalhada e para a futura
 * tridimensionalizacao. Cada topico traz dados tecnicos, sintomas de falha, como
 * testar e um descritor de referencia 3D (viz3d) para modelagem procedural/Meshy.
 *
 * Escopo: injecao eletronica (Ciclo Otto). NAO inclui carburador (motor
 * carburado), por decisao de escopo.
 */

export type BlockImportance = 'alta' | 'media';
export type Viz3dStatus = 'planejado' | 'procedural' | 'glb';

export interface Viz3dRef {
  /** Descricao da forma para modelagem (procedural ou geracao). */
  shapePt: string;
  /** Prompt sugerido para geracao text-to-3D / image-to-3D (generico). */
  genPrompt: string;
  status: Viz3dStatus;
  /** Componente 3D relacionado no laboratorio, quando existir. */
  relatedComponentId?: string;
  /** Id do modelo 3D procedural (PART_MODELS) exibido no visualizador. */
  partModelId?: string;
}

export interface TechDatum {
  label: string;
  value: string;
}

export interface CourseTopic {
  id: string;
  titlePt: string;
  bodyPt: string;
  keyPointsPt: string[];
  technicalData?: TechDatum[];
  failureSymptomsPt?: string[];
  howToTestPt?: string[];
  viz3d: Viz3dRef;
}

export interface CourseBlock {
  id: string;
  numero: number;
  titlePt: string;
  summaryPt: string;
  importancia: BlockImportance;
  topics: CourseTopic[];
}

/**
 * Aula do curso. Estrutura base; o conteudo e as simulacoes 3D de cada aula
 * (do inicio ao fim) serao definidos aula a aula.
 */
export interface CourseLesson {
  id: string;
  numero: number;
  titlePt: string;
  summaryPt?: string;
}

export interface Course {
  id: string;
  titlePt: string;
  institution?: string;
  unitPt: string;
  hours: number;
  category: string;
  objectivePt: string;
  officialUrl?: string;
  notePt: string;
  blocks: CourseBlock[];
  /** Aulas com simulacoes 3D. Vazio por enquanto (a definir aula a aula). */
  lessons: CourseLesson[];
}

export const COURSES: Course[] = [
  {
    id: 'injecao-eletronica-40h',
    titlePt: 'Caracteristicas Tecnicas de Injecao Eletronica de Veiculos Leves',
    unitPt: 'Vila Leopoldina, Sao Paulo/SP',
    hours: 40,
    category: 'Presencial · Curso Livre · Automotiva',
    objectivePt:
      'Identificar os componentes do sistema de injecao eletronica, suas funcoes e principios de funcionamento, assim como as respectivas manutencoes, utilizando ferramentas e equipamentos conforme procedimentos tecnicos e normas de saude e seguranca no trabalho.',
    notePt:
      'A grade hora a hora nao e publicada oficialmente (apenas objetivo + 40h). O conteudo abaixo e o programa tecnico tipico do curso, detalhado para estudo. Escopo em injecao eletronica: carburador nao faz parte.',
    blocks: [
      {
        id: 'fundamentos',
        numero: 1,
        titlePt: 'Fundamentos do motor e da combustao',
        summaryPt:
          'A base de tudo: como o motor Ciclo Otto funciona, o que e a mistura ar-combustivel e por que o controle eletronico substituiu o mecanico.',
        importancia: 'alta',
        topics: [
          {
            id: 'ciclo-otto',
            titlePt: 'Motor Ciclo Otto (quatro tempos)',
            bodyPt:
              'O motor de ignicao por centelha completa um ciclo a cada 720 graus de virabrequim (duas voltas). Sao quatro tempos: admissao (aspira a mistura), compressao (comprime a mistura), combustao/expansao (a centelha inflama e a pressao empurra o pistao) e escape (expulsa os gases). Entender esse ciclo e a base para saber quando cada sensor le e cada atuador age.',
            keyPointsPt: [
              'Ciclo completo = 720 graus de virabrequim (2 voltas)',
              'Comando de valvulas gira a metade da rotacao do virabrequim (1:2)',
              'Ordem de ignicao tipica em 4 cilindros: 1-3-4-2',
              'A centelha ocorre alguns graus antes do PMS (avanco de ignicao)',
            ],
            technicalData: [
              { label: 'Tempos', value: 'Admissao, compressao, combustao, escape' },
              { label: 'Ciclo', value: '720 graus (4 tempos)' },
              { label: 'Relacao comando/virabrequim', value: '1:2' },
            ],
            viz3d: {
              shapePt:
                'Motor 4 cilindros em corte com pistoes, bielas, virabrequim e valvulas animados pelo angulo (ja existe no laboratorio).',
              genPrompt:
                'generic inline-4 four-stroke engine cutaway, pistons, connecting rods, crankshaft, educational, no branding',
              status: 'procedural',
              relatedComponentId: 'piston',
            },
          },
          {
            id: 'mistura-afr-lambda',
            titlePt: 'Mistura ar-combustivel, estequiometria e lambda',
            bodyPt:
              'Para queimar bem, o motor precisa de uma proporcao correta entre ar e combustivel. A mistura ideal (estequiometrica) queima quase todo o combustivel. Lambda (λ) e a relacao entre a mistura real e a ideal: λ=1 e ideal, λ<1 e rica (mais combustivel), λ>1 e pobre (menos combustivel). Toda a injecao eletronica gira em torno de medir e corrigir esse lambda.',
            keyPointsPt: [
              'Estequiometrica gasolina: ~14,7:1 (ar:combustivel em massa)',
              'Estequiometrica etanol: ~9:1',
              'λ = AFR_real / AFR_estequiometrico',
              'λ < 1 rica · λ = 1 ideal · λ > 1 pobre',
              'Mistura rica: mais CO/HC e consumo · pobre: mais NOx e risco termico',
            ],
            technicalData: [
              { label: 'AFR gasolina', value: '14,7 : 1' },
              { label: 'AFR etanol', value: '~9 : 1' },
              { label: 'Lambda ideal', value: '1,00' },
              { label: 'Janela util', value: '~0,8 (rica) a 1,2 (pobre)' },
            ],
            viz3d: {
              shapePt:
                'Camara de combustao com particulas de ar (azul) e combustivel (ambar) formando mistura (ciano) e frente de chama.',
              genPrompt:
                'combustion chamber cross-section with colored gas particles mixing, educational diagram style',
              status: 'procedural',
              relatedComponentId: 'injector',
            },
          },
          {
            id: 'do-mecanico-ao-eletronico',
            titlePt: 'Por que injecao eletronica (controle em malha fechada)',
            bodyPt:
              'A injecao eletronica dosa o combustivel com precisao para cada condicao (partida a frio, marcha lenta, aceleracao, plena carga), corrigindo em tempo real pela sonda lambda. Isso reduz consumo e emissoes e melhora a dirigibilidade, algo que o controle puramente mecanico nao consegue acompanhar. O conceito central e a malha fechada: a ECU injeta, a sonda lambda mede o resultado e a ECU corrige.',
            keyPointsPt: [
              'Malha aberta: ECU usa mapas sem confirmacao da sonda (motor frio, plena carga)',
              'Malha fechada: ECU corrige a injecao pela leitura da sonda lambda',
              'Vantagens: menor consumo, menos emissao, melhor dirigibilidade',
              'Correcao adaptativa: fuel trim de curto e longo prazo',
            ],
            technicalData: [
              { label: 'Malha aberta', value: 'Sem correcao pela sonda' },
              { label: 'Malha fechada', value: 'Correcao continua pela sonda' },
            ],
            viz3d: {
              shapePt:
                'Diagrama de fluxo sensor -> ECU -> atuador -> resultado -> sonda (loop), destacando a realimentacao.',
              genPrompt:
                'closed-loop control diagram engine ECU sensor actuator feedback, clean infographic',
              status: 'planejado',
              relatedComponentId: 'ecu',
            },
          },
        ],
      },
      {
        id: 'arquitetura',
        numero: 2,
        titlePt: 'Arquitetura do sistema de injecao',
        summaryPt:
          'Como o sistema e organizado: malha aberta x fechada, tipos de injecao e o fluxo de dados entre sensores, ECU e atuadores.',
        importancia: 'alta',
        topics: [
          {
            id: 'tipos-injecao',
            titlePt: 'Tipos de injecao eletronica',
            bodyPt:
              'A injecao evoluiu do mono-ponto (um injetor para todos os cilindros) para o multiponto (um injetor por cilindro) e, dentro deste, para a injecao sequencial (cada injetor pulsa sincronizado com o tempo de admissao do seu cilindro). Existe ainda a injecao direta (GDI), que injeta combustivel dentro da camara sob alta pressao. O sistema principal deste curso e o multiponto sequencial.',
            keyPointsPt: [
              'Mono-ponto: 1 injetor no corpo de borboleta (mais antigo/simples)',
              'Multiponto (MPI): 1 injetor por cilindro no coletor',
              'Sequencial: cada injetor pulsa no tempo certo do seu cilindro',
              'Injecao direta (GDI): combustivel dentro da camara, alta pressao',
            ],
            technicalData: [
              { label: 'MPI (coletor)', value: 'Baixa pressao ~3-4 bar' },
              { label: 'GDI (direta)', value: 'Alta pressao ~50-200 bar' },
            ],
            viz3d: {
              shapePt:
                'Coletor de admissao com 4 injetores apontando para as valvulas de admissao (multiponto) x 1 injetor central (mono-ponto).',
              genPrompt:
                'intake manifold with four port fuel injectors, generic, educational 3D',
              status: 'planejado',
              relatedComponentId: 'injector',
            },
          },
          {
            id: 'malha-aberta-fechada',
            titlePt: 'Malha aberta x malha fechada',
            bodyPt:
              'Em malha aberta a ECU aplica valores de mapa sem confirmar o resultado (usada na partida a frio, aceleracao brusca e plena carga). Em malha fechada a ECU le a sonda lambda e ajusta continuamente a injecao para manter λ=1. As correcoes ficam guardadas nos ajustes de combustivel (fuel trim).',
            keyPointsPt: [
              'Malha aberta em: partida a frio, plena carga, aceleracao rapida',
              'Malha fechada no regime normal (motor quente, carga parcial)',
              'Fuel trim de curto prazo (STFT): correcao instantanea',
              'Fuel trim de longo prazo (LTFT): correcao aprendida/memorizada',
            ],
            technicalData: [
              { label: 'STFT/LTFT saudavel', value: '~ +/- 10%' },
              { label: 'Alerta', value: 'Trim alto positivo = mistura pobre; negativo = rica' },
            ],
            viz3d: {
              shapePt: 'Painel/infografico do loop de controle com a sonda realimentando a ECU.',
              genPrompt: 'engine closed loop fuel control infographic, sensor to ECU feedback arrow',
              status: 'planejado',
              relatedComponentId: 'ecu',
            },
          },
          {
            id: 'fluxo-dados',
            titlePt: 'Fluxo de dados: sensores -> ECU -> atuadores',
            bodyPt:
              'A ECU recebe sinais dos sensores (rotacao, pressao/fluxo de ar, temperatura, borboleta, lambda, detonacao), calcula a estrategia e comanda os atuadores (injetores, bobinas, borboleta, ventilador, bomba). O resultado altera o funcionamento do motor, que e novamente lido pelos sensores, fechando o ciclo.',
            keyPointsPt: [
              'Entradas: rotacao, ar, temperatura, borboleta, lambda, detonacao',
              'Processamento: mapas + correcoes na ECU',
              'Saidas: injecao, ignicao, marcha lenta, ventilador, bomba, wastegate',
              'Realimentacao: sensores confirmam o efeito',
            ],
            viz3d: {
              shapePt:
                'Ja existe a rota Data Flow: caixas de sensores -> ECU -> atuadores com setas animadas.',
              genPrompt: 'automotive ECU data flow map, sensors inputs actuators outputs, clean UI',
              status: 'procedural',
              relatedComponentId: 'ecu',
            },
          },
        ],
      },
      {
        id: 'sensores',
        numero: 3,
        titlePt: 'Sensores (entradas da ECU)',
        summaryPt:
          'Os "sentidos" do motor. Cada sensor mede uma grandeza, envia um sinal a ECU e, quando falha, produz sintomas caracteristicos.',
        importancia: 'alta',
        topics: [
          {
            id: 'ckp',
            titlePt: 'Sensor de rotacao e PMS (CKP)',
            bodyPt:
              'Le a rotacao do motor e a posicao do virabrequim a partir de uma roda dentada (geralmente 60-2 dentes). E o sinal mais critico: sem ele o motor nem liga, pois a ECU nao sabe quando injetar nem centelhar.',
            keyPointsPt: [
              'Tipos: relutancia variavel (indutivo) ou efeito Hall',
              'Le roda fonica, tipicamente 60-2 dentes (a falha marca o PMS)',
              'Base para o calculo de injecao e ignicao',
            ],
            technicalData: [
              { label: 'Grandeza', value: 'Rotacao / posicao (rpm, graus)' },
              { label: 'Sinal indutivo', value: 'Onda senoidal (AC), amplitude sobe com a rotacao' },
              { label: 'Sinal Hall', value: 'Onda quadrada (0/5V ou 0/12V)' },
              { label: 'Frequencia', value: 'Alta (centenas de Hz)' },
            ],
            failureSymptomsPt: [
              'Motor nao pega (sinal ausente)',
              'Corte de ignicao/injecao intermitente',
              'Motor morre em movimento',
            ],
            howToTestPt: [
              'Osciloscopio: verificar forma de onda e a falha da roda fonica',
              'Multimetro: resistencia da bobina (indutivo) e chicote',
              'Scanner: leitura de rpm em partida',
            ],
            viz3d: {
              shapePt:
                'Cilindro pequeno com conector, apontado para uma roda dentada (60-2) no virabrequim.',
              genPrompt:
                'automotive crankshaft position sensor near toothed reluctor wheel, generic, 3D',
              status: 'procedural',
              partModelId: 'ckp-sensor',
              relatedComponentId: 'crankshaft',
            },
          },
          {
            id: 'cmp',
            titlePt: 'Sensor de fase / comando (CMP)',
            bodyPt:
              'Identifica qual cilindro esta no tempo de compressao, permitindo a injecao sequencial e a ignicao correta. Trabalha junto do CKP para a ECU saber exatamente a fase do ciclo de 720 graus.',
            keyPointsPt: [
              'Tipo mais comum: efeito Hall',
              'Le uma referencia no eixo comando',
              'Necessario para injecao sequencial e sincronismo fino',
            ],
            technicalData: [
              { label: 'Grandeza', value: 'Fase do comando (posicao)' },
              { label: 'Sinal', value: 'Onda quadrada (Hall)' },
            ],
            failureSymptomsPt: [
              'Partida demorada (ECU sincroniza sem ele com dificuldade)',
              'Injecao passa de sequencial para semissequencial',
              'Luz de injecao acesa (DTC de fase)',
            ],
            howToTestPt: [
              'Osciloscopio: pulso a cada volta do comando',
              'Scanner: DTC de correlacao CKP/CMP',
            ],
            viz3d: {
              shapePt: 'Sensor tipo Hall montado no cabecote, apontando para o eixo comando.',
              genPrompt: 'camshaft position sensor hall effect, generic automotive, 3D',
              status: 'procedural',
              partModelId: 'ckp-sensor',
              relatedComponentId: 'camshaft',
            },
          },
          {
            id: 'map-maf',
            titlePt: 'Carga do motor: MAP e MAF',
            bodyPt:
              'A ECU precisa saber quanto ar entra para calcular o combustivel. O MAP mede a pressao absoluta no coletor (estrategia speed-density, junto com rotacao e temperatura). O MAF mede diretamente a massa de ar admitida. Muitos motores usam um ou outro; alguns usam os dois.',
            keyPointsPt: [
              'MAP: pressao no coletor (kPa). Baixa em marcha lenta, alta em plena carga',
              'MAF: massa de ar (g/s). Cresce com aceleracao',
              'MAP = estrategia speed-density · MAF = medicao direta',
            ],
            technicalData: [
              { label: 'MAP marcha lenta', value: '~20-40 kPa' },
              { label: 'MAP ignicao ligada/motor parado', value: '~100 kPa (atmosferica)' },
              { label: 'MAF marcha lenta', value: '~2-5 g/s' },
              { label: 'Sinal', value: 'Tensao 0-5V (analogico) ou frequencia' },
            ],
            failureSymptomsPt: [
              'Mistura pobre/rica conforme leitura errada',
              'Marcha lenta instavel, falha de aceleracao',
              'Aumento de consumo e emissoes',
            ],
            howToTestPt: [
              'Scanner: comparar MAP com a atmosferica com ignicao ligada',
              'Multimetro/osciloscopio: tensao x abertura de borboleta',
              'MAF: leitura de g/s em marcha lenta e aceleracao',
            ],
            viz3d: {
              shapePt:
                'MAP: pequeno bloco com tomada de vacuo e conector no coletor. MAF: corpo tubular no duto de ar com elemento aquecido.',
              genPrompt:
                'MAP sensor and MAF air flow sensor, generic automotive parts, 3D, no branding',
              status: 'procedural',
              partModelId: 'map-sensor',
              relatedComponentId: 'throttle-body',
            },
          },
          {
            id: 'tps',
            titlePt: 'Sensor de posicao da borboleta (TPS)',
            bodyPt:
              'Informa a abertura da borboleta, ou seja, a intencao do motorista (carga e aceleracao). E fundamental para o enriquecimento em aceleracao e o corte na desaceleracao.',
            keyPointsPt: [
              'Potenciometro (ou dois, no corpo eletronico)',
              'Indica marcha lenta, carga parcial e plena carga',
              'Base para enriquecimento de aceleracao',
            ],
            technicalData: [
              { label: 'Sinal', value: 'Tensao 0-5V' },
              { label: 'Borboleta fechada', value: '~0,5-0,9 V' },
              { label: 'Borboleta aberta (WOT)', value: '~4,0-4,5 V' },
            ],
            failureSymptomsPt: [
              'Falha/hesitacao na aceleracao',
              'Marcha lenta irregular',
              'Trancos na troca de marcha (cambio automatico)',
            ],
            howToTestPt: [
              'Multimetro/osciloscopio: varredura suave 0-5V abrindo a borboleta (sem quedas)',
              'Scanner: TPS em % acompanhando o pedal',
            ],
            viz3d: {
              shapePt: 'Corpo de borboleta com sensor rotativo no eixo da borboleta.',
              genPrompt: 'throttle position sensor on throttle body shaft, generic, 3D',
              status: 'procedural',
              partModelId: 'tps-sensor',
              relatedComponentId: 'throttle-body',
            },
          },
          {
            id: 'iat-ect',
            titlePt: 'Sensores de temperatura (IAT e ECT)',
            bodyPt:
              'O IAT mede a temperatura do ar admitido (densidade do ar) e o ECT a temperatura do liquido de arrefecimento (regime termico do motor). Ambos sao resistores NTC: a resistencia cai quando a temperatura sobe. O ECT comanda enriquecimento a frio e o eletroventilador.',
            keyPointsPt: [
              'NTC: resistencia diminui com o aumento da temperatura',
              'ECT: enriquecimento a frio, avanco e eletroventilador',
              'IAT: correcao pela densidade do ar',
            ],
            technicalData: [
              { label: 'Tipo', value: 'Termistor NTC' },
              { label: 'Resistencia a ~20 C', value: 'alta (kilo-ohms)' },
              { label: 'Resistencia a ~90 C', value: 'baixa (centenas de ohms)' },
            ],
            failureSymptomsPt: [
              'Dificuldade de partida a frio',
              'Consumo alto (ECU pensa que esta sempre frio)',
              'Ventilador sempre ligado ou nunca liga',
            ],
            howToTestPt: [
              'Multimetro: resistencia x temperatura (tabela do fabricante)',
              'Scanner: comparar IAT e ECT com o motor frio (devem ser iguais a ambiente)',
            ],
            viz3d: {
              shapePt: 'Sensor pequeno rosqueado com ponta sensora e conector de 2 vias.',
              genPrompt: 'coolant temperature sensor NTC, brass body two-pin connector, generic, 3D',
              status: 'procedural',
              partModelId: 'temp-sensor',
              relatedComponentId: 'thermostat',
            },
          },
          {
            id: 'sonda-lambda',
            titlePt: 'Sonda lambda (sensor de oxigenio)',
            bodyPt:
              'Mede o oxigenio residual no escape e informa a ECU se a mistura esta rica ou pobre, permitindo a malha fechada. A sonda de banda estreita oscila em torno de λ=1; a de banda larga (wideband) mede uma faixa ampla de lambda de forma linear.',
            keyPointsPt: [
              'Banda estreita: comuta ~0,1V (pobre) a ~0,9V (rica) em torno de λ=1',
              'Banda larga (LSU): leitura linear de lambda',
              'Sonda pos-catalisador: monitora a eficiencia do catalisador',
              'So funciona aquecida (possui aquecedor interno)',
            ],
            technicalData: [
              { label: 'Narrowband rica', value: '~0,8-0,9 V' },
              { label: 'Narrowband pobre', value: '~0,1-0,2 V' },
              { label: 'Comutacao saudavel', value: 'varias vezes por segundo em malha fechada' },
              { label: 'Temperatura de trabalho', value: '~300 C ou mais' },
            ],
            failureSymptomsPt: [
              'Consumo alto e falha de emissao',
              'Malha fechada nao entra (sonda "preguicosa")',
              'Luz de injecao (DTC de sonda/aquecedor)',
            ],
            howToTestPt: [
              'Osciloscopio: sinal oscilando entre rico e pobre',
              'Scanner: forcar rica/pobre e ver a resposta da sonda',
              'Verificar o aquecedor (resistencia e alimentacao)',
            ],
            viz3d: {
              shapePt:
                'Sonda rosqueada no escapamento, corpo metalico hexagonal com ponta ceramica e cabo de 4 fios.',
              genPrompt:
                'oxygen lambda sensor threaded into exhaust pipe, hex body, four wires, generic, 3D',
              status: 'procedural',
              partModelId: 'lambda-sensor',
              relatedComponentId: 'ecu',
            },
          },
          {
            id: 'knock',
            titlePt: 'Sensor de detonacao (knock)',
            bodyPt:
              'E um sensor piezeletrico preso ao bloco que "ouve" a vibracao caracteristica da detonacao. Ao detectar batida, a ECU recua o avanco de ignicao para proteger o motor, reavancando aos poucos quando o risco passa.',
            keyPointsPt: [
              'Elemento piezeletrico sensivel a vibracao',
              'Dispara o recuo de avanco pela ECU',
              'Protege contra detonacao (erosao do pistao, quebra de anel)',
            ],
            technicalData: [
              { label: 'Sinal', value: 'Tensao AC proporcional a vibracao' },
              { label: 'Faixa de interesse', value: 'frequencia caracteristica da batida (kHz)' },
            ],
            failureSymptomsPt: [
              'Perda de desempenho (ECU recua avanco por seguranca)',
              'Risco de detonacao nao detectada (sensor mudo)',
              'Luz de injecao (DTC de knock)',
            ],
            howToTestPt: [
              'Osciloscopio: pico ao bater levemente no bloco perto do sensor',
              'Scanner: parametro de recuo de avanco / contagem de knock',
              'Conferir torque de aperto (aperto errado falseia a leitura)',
            ],
            viz3d: {
              shapePt: 'Anel/olho metalico com furo de fixacao preso ao bloco, cabo curto.',
              genPrompt: 'engine knock sensor piezo washer type bolted to block, generic, 3D',
              status: 'procedural',
              partModelId: 'knock-sensor',
              relatedComponentId: 'ecu',
            },
          },
        ],
      },
      {
        id: 'atuadores',
        numero: 4,
        titlePt: 'Atuadores (saidas da ECU)',
        summaryPt:
          'Os "musculos" do motor. A ECU comanda estes componentes para colocar em pratica a estrategia calculada.',
        importancia: 'alta',
        topics: [
          {
            id: 'injetores',
            titlePt: 'Injetores de combustivel',
            bodyPt:
              'Valvulas eletromagneticas que pulverizam o combustivel. A ECU controla o tempo de abertura (largura de pulso, em ms): quanto maior o pulso, mais combustivel. E o principal atuador do controle de mistura.',
            keyPointsPt: [
              'Abertura eletromagnetica comandada pela ECU',
              'Largura de pulso (ms) define a quantidade de combustivel',
              'Alta impedancia (saturado) ou baixa impedancia (pico e retencao)',
            ],
            technicalData: [
              { label: 'Resistencia alta impedancia', value: '~12-16 ohms' },
              { label: 'Resistencia baixa impedancia', value: '~2-4 ohms' },
              { label: 'Largura de pulso marcha lenta', value: '~2-4 ms (varia)' },
              { label: 'Pressao de trabalho (MPI)', value: '~3-4 bar' },
            ],
            failureSymptomsPt: [
              'Falha de cilindro (misfire) por injetor entupido',
              'Marcha lenta irregular, consumo alto',
              'Cheiro de combustivel (injetor vazando)',
            ],
            howToTestPt: [
              'Multimetro: resistencia da bobina do injetor',
              'Osciloscopio: forma de onda do comando (pulso)',
              'Teste de vazao/estanqueidade e spray (bancada)',
            ],
            viz3d: {
              shapePt: 'Corpo cilindrico com conector eletrico, bico pulverizador e aneis de vedacao.',
              genPrompt: 'port fuel injector, electrical connector, spray nozzle, o-rings, generic, 3D',
              status: 'procedural',
              partModelId: 'injector',
              relatedComponentId: 'injector',
            },
          },
          {
            id: 'bobinas-velas',
            titlePt: 'Bobinas e velas de ignicao',
            bodyPt:
              'A bobina eleva a tensao da bateria para dezenas de milhares de volts, gerando a centelha na vela no momento exato (avanco de ignicao). No sistema moderno ha uma bobina por vela (coil-on-plug), comandada individualmente pela ECU.',
            keyPointsPt: [
              'Uma bobina por vela (coil-on-plug)',
              'ECU define o instante e o tempo de saturacao (dwell)',
              'Vela: grau termico correto evita pre-ignicao/deposito',
            ],
            technicalData: [
              { label: 'Tensao de centelha', value: 'dezenas de kV' },
              { label: 'Folga da vela', value: 'conforme fabricante (ex.: 0,8-1,1 mm)' },
              { label: 'Comando', value: 'sinal da ECU ao modulo/bobina' },
            ],
            failureSymptomsPt: [
              'Falha de cilindro (misfire), trepidacao',
              'Perda de potencia e consumo alto',
              'Luz de injecao piscando (misfire severo)',
            ],
            howToTestPt: [
              'Osciloscopio: primario/secundario da ignicao',
              'Teste de centelha e inspecao da vela (aspecto do eletrodo)',
              'Troca cruzada de bobina para localizar o cilindro',
            ],
            viz3d: {
              shapePt: 'Bobina tipo caneta (coil-on-plug) acoplada a vela de ignicao.',
              genPrompt: 'coil-on-plug ignition coil with spark plug, generic automotive, 3D',
              status: 'procedural',
              partModelId: 'ignition-coil',
              relatedComponentId: 'ignition-coil',
            },
          },
          {
            id: 'corpo-borboleta',
            titlePt: 'Corpo de borboleta eletronico (ETC)',
            bodyPt:
              'No sistema moderno a borboleta e movida por um motor eletrico comandado pela ECU (drive-by-wire), sem cabo mecanico. A ECU decide a abertura conforme o pedal (sensor APP), a marcha lenta e as estrategias de seguranca.',
            keyPointsPt: [
              'Acionamento por motor eletrico (drive-by-wire)',
              'Controla ar de marcha lenta sem valvula IAC separada',
              'Dois TPS internos + dois sensores no pedal (redundancia/seguranca)',
            ],
            technicalData: [
              { label: 'Comando', value: 'PWM ao motor da borboleta' },
              { label: 'Realimentacao', value: '2x TPS (posicao real)' },
            ],
            failureSymptomsPt: [
              'Modo de emergencia (potencia limitada)',
              'Marcha lenta irregular',
              'Luz de injecao / luz de acelerador',
            ],
            howToTestPt: [
              'Scanner: posicao comandada x posicao real',
              'Limpeza do corpo (fuligem altera marcha lenta)',
              'Teste de atuacao pelo scanner',
            ],
            viz3d: {
              shapePt: 'Corpo tubular com borboleta interna, motor eletrico lateral e conector.',
              genPrompt: 'electronic throttle body with motor and connector, generic, 3D',
              status: 'procedural',
              partModelId: 'throttle-body',
              relatedComponentId: 'throttle-body',
            },
          },
          {
            id: 'bomba-combustivel',
            titlePt: 'Bomba e pressao de combustivel',
            bodyPt:
              'A bomba eletrica pressuriza o combustivel ate a flauta que alimenta os injetores. A pressao correta e essencial: pressao baixa empobrece a mistura, pressao alta enriquece. Muitos sistemas controlam a pressao eletronicamente.',
            keyPointsPt: [
              'Bomba eletrica no tanque (ou em linha)',
              'Regulador mantem a pressao de trabalho',
              'Pressao errada = mistura errada em toda a faixa',
            ],
            technicalData: [
              { label: 'Pressao tipica MPI', value: '~3-4 bar' },
              { label: 'GDI (alta pressao)', value: '~50-200 bar (bomba mecanica adicional)' },
            ],
            failureSymptomsPt: [
              'Falha de partida / motor morre',
              'Perda de potencia sob carga',
              'Trancos por pressao insuficiente',
            ],
            howToTestPt: [
              'Manometro: pressao com ignicao ligada e em carga',
              'Verificar vazao da bomba e queda apos desligar (retencao)',
              'Conferir alimentacao/rele da bomba',
            ],
            viz3d: {
              shapePt: 'Modulo de bomba no tanque com boia, filtro e flauta com injetores.',
              genPrompt: 'in-tank fuel pump module with sender and fuel rail injectors, generic, 3D',
              status: 'procedural',
              partModelId: 'fuel-pump',
              relatedComponentId: 'injector',
            },
          },
          {
            id: 'eletroventilador-reles',
            titlePt: 'Eletroventilador, valvulas e reles',
            bodyPt:
              'A ECU comanda o eletroventilador por temperatura, a valvula de purga do canister (vapores de combustivel), a marcha lenta e reles diversos. Sao saidas mais simples, mas importantes para o regime termico e as emissoes.',
            keyPointsPt: [
              'Eletroventilador por limiar de temperatura (ECT)',
              'Valvula canister (purga de vapores) controlada por PWM',
              'Reles de bomba, ventilador e ignicao',
            ],
            technicalData: [
              { label: 'Ventilador', value: 'liga em ~100-105 C (varia)' },
              { label: 'Canister', value: 'comando PWM pela ECU' },
            ],
            failureSymptomsPt: [
              'Superaquecimento (ventilador nao liga)',
              'Marcha lenta irregular (purga travada)',
              'Falha de partida (rele da bomba)',
            ],
            howToTestPt: [
              'Scanner: atuar ventilador/purga',
              'Multimetro: bobina do rele e alimentacao',
            ],
            viz3d: {
              shapePt: 'Ventilador com defletor, valvula canister e reles no porta-fusiveis.',
              genPrompt: 'radiator cooling fan, canister purge valve, relays, generic automotive, 3D',
              status: 'procedural',
              partModelId: 'cooling-fan',
              relatedComponentId: 'water-pump',
            },
          },
        ],
      },
      {
        id: 'ecu',
        numero: 5,
        titlePt: 'Unidade de comando (ECU) e estrategias',
        summaryPt:
          'O cerebro do sistema: recebe os sensores, aplica mapas e correcoes e comanda os atuadores, alem de fazer o autodiagnostico.',
        importancia: 'alta',
        topics: [
          {
            id: 'ecu-funcionamento',
            titlePt: 'Como a ECU processa e decide',
            bodyPt:
              'A ECU le os sensores, calcula a carga do motor e consulta mapas (injecao e ignicao) gravados na memoria. Depois aplica correcoes (temperatura, lambda, detonacao) e comanda os atuadores. Tudo isso muitas vezes por segundo.',
            keyPointsPt: [
              'Entradas analogicas/digitais dos sensores',
              'Mapas de injecao e de avanco de ignicao',
              'Correcoes: partida a frio, lambda, detonacao, altitude',
              'Saidas comandadas: injetores, bobinas, borboleta, ventilador',
            ],
            technicalData: [
              { label: 'Estrategia de carga', value: 'speed-density (MAP) ou mass-air (MAF)' },
              { label: 'Alimentacao', value: '12 V + terras/blindagem' },
            ],
            viz3d: {
              shapePt: 'Caixa da ECU com conectores multivias; internamente placa com processador.',
              genPrompt: 'engine control unit ECU box with multi-pin connectors, PCB inside, generic, 3D',
              status: 'procedural',
              partModelId: 'ecu',
              relatedComponentId: 'ecu',
            },
          },
          {
            id: 'estrategias',
            titlePt: 'Estrategias de gerenciamento',
            bodyPt:
              'A ECU muda a estrategia conforme a condicao: enriquece na partida a frio, corta combustivel na desaceleracao (economia e emissao), enriquece em plena carga (protecao termica), limita a rotacao maxima e recua o avanco quando ha detonacao.',
            keyPointsPt: [
              'Partida a frio: enriquecimento e marcha lenta elevada',
              'Cut-off: corte de combustivel ao desacelerar com marcha engatada',
              'Plena carga: enriquecimento de protecao',
              'Recuo de avanco por detonacao; limitador de rpm',
            ],
            viz3d: {
              shapePt: 'Infografico das estrategias ligado ao estado do motor (fase, carga, temperatura).',
              genPrompt: 'engine management strategy infographic states cold start WOT deceleration',
              status: 'planejado',
              relatedComponentId: 'ecu',
            },
          },
          {
            id: 'obd-dtc',
            titlePt: 'Autodiagnostico: OBD-II, DTC e luz de injecao',
            bodyPt:
              'A ECU monitora os proprios sensores e atuadores. Ao detectar algo fora do esperado, grava um codigo de falha (DTC) e pode acender a luz de injecao (MIL). Em falhas graves entra em modo de emergencia (limp home) com potencia limitada para proteger o motor.',
            keyPointsPt: [
              'DTC: codigo padronizado (ex.: P0130 = circuito da sonda)',
              'MIL: luz de injecao (Check Engine)',
              'Freeze frame: condicoes do momento da falha',
              'Modo de emergencia (limp home)',
            ],
            technicalData: [
              { label: 'Conector', value: 'OBD-II (16 vias)' },
              { label: 'Codigos', value: 'P (powertrain), C, B, U' },
            ],
            failureSymptomsPt: [
              'Luz de injecao acesa/piscando',
              'Potencia limitada (modo de emergencia)',
            ],
            howToTestPt: [
              'Scanner: ler e apagar DTC, ver freeze frame',
              'Analisar parametros ao vivo para confirmar a causa',
            ],
            viz3d: {
              shapePt: 'Conector OBD-II de 16 vias e scanner conectado; icone da luz de injecao.',
              genPrompt: 'OBD-II 16-pin diagnostic connector with scan tool, check engine light, 3D',
              status: 'procedural',
              partModelId: 'ecu',
              relatedComponentId: 'ecu',
            },
          },
        ],
      },
      {
        id: 'diagnostico',
        numero: 6,
        titlePt: 'Diagnostico e manutencao',
        summaryPt:
          'A parte que da dinheiro: usar as ferramentas certas e um metodo para achar a causa raiz com seguranca.',
        importancia: 'alta',
        topics: [
          {
            id: 'ferramentas',
            titlePt: 'Ferramentas de diagnostico',
            bodyPt:
              'O scanner le codigos e parametros ao vivo e atua componentes. O multimetro mede tensao, resistencia e continuidade. O osciloscopio mostra a forma de onda (essencial para sensores de sinal rapido). O manometro verifica a pressao de combustivel.',
            keyPointsPt: [
              'Scanner: DTC, parametros ao vivo (live data), atuacao',
              'Multimetro: tensao, resistencia, continuidade',
              'Osciloscopio: forma de onda de CKP, CMP, injetor, sonda',
              'Manometro: pressao de combustivel',
            ],
            technicalData: [
              { label: 'Live data', value: 'rpm, MAP/MAF, TPS, ECT, lambda, fuel trim' },
              { label: 'Osciloscopio', value: 'ideal para sinais rapidos e intermitencias' },
            ],
            viz3d: {
              shapePt: 'Bancada com scanner, multimetro, osciloscopio e manometro.',
              genPrompt: 'automotive diagnostic tools scan tool multimeter oscilloscope fuel gauge, 3D',
              status: 'planejado',
              relatedComponentId: 'ecu',
            },
          },
          {
            id: 'metodo',
            titlePt: 'Metodo de diagnostico (causa raiz)',
            bodyPt:
              'Diagnostico nao e trocar pecas por tentativa. O metodo: confirmar o sintoma, ler DTC e freeze frame, analisar parametros ao vivo, formular hipoteses, aplicar um teste que diferencie as causas, corrigir e validar. E exatamente o padrao aspecto -> dados -> causas provaveis -> teste discriminante -> correcao -> prevencao usado nos estudos de caso deste app.',
            keyPointsPt: [
              'Confirmar o sintoma (reproduzir a falha)',
              'Ler DTC + freeze frame + parametros ao vivo',
              'Levantar hipoteses e testar a que diferencia as causas',
              'Corrigir a causa raiz e validar o reparo',
            ],
            viz3d: {
              shapePt: 'Fluxograma do metodo de diagnostico (ja aplicado nos estudos de caso).',
              genPrompt: 'diagnostic flowchart symptom data hypothesis test fix, clean infographic',
              status: 'procedural',
              relatedComponentId: 'ecu',
            },
          },
          {
            id: 'seguranca',
            titlePt: 'Seguranca no trabalho (SST)',
            bodyPt:
              'A ignicao gera alta tensao (risco de choque) e o sistema de combustivel trabalha sob pressao (risco de incendio). Use EPI, alivie a pressao de combustivel antes de abrir a linha, cuidado com partes quentes e giratorias e siga os procedimentos do fabricante.',
            keyPointsPt: [
              'Alta tensao na ignicao: risco de choque',
              'Combustivel sob pressao: aliviar antes de abrir a linha',
              'Partes quentes e moveis: cuidado com escape e ventilador',
              'EPI e procedimentos do fabricante sempre',
            ],
            viz3d: {
              shapePt: 'Icones de EPI e advertencia (alta tensao, inflamavel, quente).',
              genPrompt: 'workshop safety icons high voltage flammable hot surface PPE, flat 3D',
              status: 'planejado',
              relatedComponentId: 'ecu',
            },
          },
        ],
      },
    ],
    lessons: [],
  },
];

export const COURSES_BY_ID = Object.fromEntries(COURSES.map((c) => [c.id, c]));
