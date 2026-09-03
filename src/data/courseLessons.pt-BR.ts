/**
 * Conteudo das aulas do curso (lousa virtual). Cada aula tem varias paginas;
 * cada pagina e uma lista de blocos (pergunta, texto, titulo, cena 3D, nota).
 * As cenas 3D sao componentes registrados em lessons/lessonScenes.ts.
 */

export type LessonBlock =
  | { kind: 'question'; textPt: string }
  | { kind: 'heading'; textPt: string }
  | { kind: 'text'; textPt: string }
  | { kind: 'note'; textPt: string }
  | { kind: 'formula'; textPt: string }
  | {
      kind: 'concept';
      numero: number;
      titlePt: string;
      unitPt: string;
      definitionPt: string;
      color: string;
    }
  | {
      kind: 'scene';
      sceneId: string;
      captionPt?: string;
      heightPx?: number;
      interactive?: boolean;
      /** Rompe a coluna de texto e ocupa a largura da tela. */
      wide?: boolean;
    };

export interface LessonPage {
  id: string;
  titlePt: string;
  blocks: LessonBlock[];
}

export interface Lesson {
  id: string;
  numero: number;
  titlePt: string;
  tag: string;
  summaryPt?: string;
  /** Aula pronta mas ainda fora do front; sai da listagem, o conteudo fica guardado. */
  rascunho?: boolean;
  pages: LessonPage[];
}

export const COURSE_LESSONS: Record<string, Lesson[]> = {
  'injecao-eletronica-40h': [
    {
      id: 'aula-0-eletricidade',
      numero: 0,
      titlePt: 'Conceitos basicos de eletrica',
      tag: 'eletrica',
      summaryPt: 'O que e eletricidade, o atomo, os eletrons e a bateria.',
      pages: [
        {
          id: 'p1',
          titlePt: 'O que e eletricidade?',
          blocks: [
            { kind: 'question', textPt: 'O que e eletricidade?' },
            {
              kind: 'text',
              textPt:
                'Eletricidade e o fluxo ordenado de eletrons atraves de um material condutor.',
            },
            { kind: 'heading', textPt: 'O atomo e os eletrons' },
            {
              kind: 'scene',
              sceneId: 'atom',
              captionPt:
                'Atomo: no centro o nucleo (protons em vermelho e neutrons em cinza); ao redor giram os eletrons (azul).',
              heightPx: 340,
              interactive: false,
            },
            {
              kind: 'text',
              textPt:
                'Toda materia e feita de atomos. Ao redor do nucleo giram os eletrons. Quando esses eletrons deixam de se mover ao acaso e passam a se mover de forma ordenada, todos na mesma direcao, surge a corrente eletrica. Ou seja: eletricidade e, basicamente, o fluxo ordenado desses eletrons.',
            },
            { kind: 'heading', textPt: 'E a bateria?' },
            {
              kind: 'scene',
              sceneId: 'battery',
              captionPt:
                'Bateria: por reacoes quimicas internas, acumula eletrons no polo negativo (-) e os empurra em direcao ao polo positivo (+), criando o fluxo ordenado.',
              heightPx: 340,
              interactive: false,
            },
            {
              kind: 'text',
              textPt:
                'A bateria funciona como uma "bomba" de eletrons. Dentro dela, reacoes quimicas separam cargas: sobram eletrons no polo negativo e faltam no positivo. Essa diferenca empurra os eletrons por um caminho condutor, sempre na mesma direcao (do polo negativo para o positivo), mantendo o fluxo ordenado que chamamos de corrente eletrica.',
            },
            {
              kind: 'note',
              textPt:
                'Nesta pagina os modelos 3D sao apenas visualizacoes animadas (ainda sem interacao). Nas proximas aulas eles ganham acoes.',
            },
          ],
        },
        {
          id: 'p2',
          titlePt: 'Tensao, corrente, resistencia e potencia',
          blocks: [
            { kind: 'heading', textPt: 'Os 4 conceitos no mesmo circuito real' },
            {
              kind: 'text',
              textPt:
                'Um unico circuito, como no carro: a bateria alimenta um fusivel, que passa por um interruptor e chega na lampada. O interruptor liga e desliga a luz; em alguns experimentos voce troca a lampada. Gire a cena com o mouse.',
            },
            {
              kind: 'concept',
              numero: 1,
              titlePt: 'Tensao',
              unitPt: 'Volt (V)',
              definitionPt:
                'Diferenca de potencial entre os polos da bateria: e a pressao eletrica que empurra a corrente pelo circuito. Sem tensao, nenhuma corrente circula.',
              color: '#5b8def',
            },
            {
              kind: 'scene',
              sceneId: 'voltage',
              captionPt:
                'Aumente a TENSAO: os mesmos eletrons circulam mais rapido, porque a tensao e a pressao que os empurra. Ligue e desligue no interruptor.',
              heightPx: 380,
              interactive: true,
            },
            {
              kind: 'concept',
              numero: 2,
              titlePt: 'Corrente',
              unitPt: 'Ampere (A)',
              definitionPt:
                'Fluxo de carga que atravessa o circuito por segundo. Num circuito em serie, a mesma corrente passa pela bateria, pelo fusivel, pelo interruptor e pela lampada. O fusivel e dimensionado para abrir se essa corrente passar de um limite.',
              color: '#37d67a',
            },
            {
              kind: 'scene',
              sceneId: 'current',
              captionPt:
                'Troque a lampada: cada uma puxa a sua corrente. A de 12 A passa dos 10 A do fusivel e queima ele, abrindo o circuito. Troque o fusivel e volte para uma lampada menor.',
              heightPx: 380,
              interactive: true,
            },
            {
              kind: 'concept',
              numero: 3,
              titlePt: 'Resistencia',
              unitPt: 'Ohm (Ω)',
              definitionPt:
                'Oposicao que o condutor oferece a passagem da corrente. O filamento da lampada e a resistencia do circuito: para a mesma tensao, quanto maior a resistencia, menor a corrente.',
              color: '#ff9f43',
            },
            {
              kind: 'scene',
              sceneId: 'resistance',
              captionPt:
                'Troque a lampada por uma de resistencia diferente: com a mesma tensao, quanto maior o Ω, menor a corrente e mais fraca a luz.',
              heightPx: 360,
              interactive: true,
            },
            {
              kind: 'concept',
              numero: 4,
              titlePt: 'Potencia',
              unitPt: 'Watt (W)',
              definitionPt:
                'Energia convertida por segundo, igual a tensao multiplicada pela corrente. Na lampada, essa potencia aquece o filamento ate ele emitir luz.',
              color: '#b46bff',
            },
            {
              kind: 'scene',
              sceneId: 'power',
              captionPt:
                'Junte tudo: mexa na tensao e na resistencia e veja a corrente, a potencia (W), a temperatura do filamento (°C) e o brilho reagirem.',
              heightPx: 380,
              interactive: true,
            },
            {
              kind: 'note',
              textPt:
                'Tudo se conecta: a TENSAO (V) empurra, a RESISTENCIA (Ω) limita, e as duas juntas definem a CORRENTE (A). A POTENCIA (W) e a energia por segundo entregue a lampada; e o fusivel protege o circuito contra corrente demais.',
            },
          ],
        },
      ],
    },
    {
      id: 'aula-1-equipamento-de-medicao',
      numero: 1,
      titlePt: 'Equipamento de medicao',
      tag: 'instrumentacao',
      summaryPt:
        'O multimetro digital HIKARI HM-2090: chave seletora, terminais, botoes e um simulador 3D com todas as funcoes.',
      pages: [
        {
          id: 'p1',
          titlePt: 'O multimetro digital HM-2090',
          blocks: [
            { kind: 'question', textPt: 'Como medir tensao, corrente e resistencia com seguranca?' },
            {
              kind: 'text',
              textPt:
                'O multimetro e o instrumento que mede as grandezas eletricas. O modelo do curso e o HIKARI HM-2090: digital, TRUE RMS, 6000 contagens e categoria de seguranca CAT III 600 V — proprio para sistemas automotivos, baterias, alternadores e paineis.',
            },
            { kind: 'heading', textPt: 'Simulador 3D do multimetro' },
            {
              kind: 'scene',
              sceneId: 'multimeter',
              captionPt:
                'Gire a CHAVE SELETORA (clique nos simbolos ao redor do botao), escolha o TERMINAL da ponta vermelha (clique nos bornes) e ARRASTE as duas pontas ate um item da bancada — ou clique no item. A ponta preta fica sempre no COM. O visor mostra a leitura e avisa quando o terminal ou a funcao estao errados.',
              heightPx: 480,
              interactive: true,
            },
            {
              kind: 'note',
              textPt:
                'Regra de ouro: sempre selecione a funcao e a escala corretas ANTES de encostar as ponteiras. Funcao ou terminal errado pode queimar o multimetro, o circuito ou ambos.',
            },
          ],
        },
        {
          id: 'p2',
          titlePt: 'Chave seletora, terminais e botoes',
          blocks: [
            { kind: 'heading', textPt: 'A chave seletora (funcoes)' },
            {
              kind: 'text',
              textPt:
                'Cada posicao escolhe UMA grandeza: V= (tensao continua), V~ (tensao alternada), mV= (milivolts), Ω (resistencia), >| (teste de diodo), ))) (continuidade com bip), Hz (frequencia), hFE (ganho de transistor), °C (temperatura por termopar) e as correntes µA, mA e A. A posicao OFF desliga — volte sempre para OFF apos o uso.',
            },
            {
              kind: 'concept',
              numero: 1,
              titlePt: 'Tensao (DC e AC)',
              unitPt: 'Volt (V)',
              definitionPt:
                'V= mede tensao continua (bateria 12 V, sensor 5 V); V~ mede tensao alternada (saida do alternador, tomada). mV= e para sinais muito pequenos. Sempre no terminal VΩHz.',
              color: '#5b8def',
            },
            {
              kind: 'concept',
              numero: 2,
              titlePt: 'Corrente (µA, mA, A)',
              unitPt: 'Ampere (A)',
              definitionPt:
                'Medida SEMPRE em serie. µA e mA usam o terminal mA/µA (fusivel 400 mA); A usa o terminal 10A (fusivel 10 A, ate 10 s). Ex.: injetores em mA, bomba de combustivel em A.',
              color: '#37d67a',
            },
            {
              kind: 'concept',
              numero: 3,
              titlePt: 'Resistencia e continuidade',
              unitPt: 'Ohm (Ω)',
              definitionPt:
                'Ω mede a resistencia (fios, sensores, bobinas) com o circuito DESLIGADO. A continuidade ))) apita quando a resistencia e quase zero — otimo para achar fio rompido ou fusivel aberto.',
              color: '#ff9f43',
            },
            {
              kind: 'concept',
              numero: 4,
              titlePt: 'Funcoes especiais',
              unitPt: '>|  Hz  hFE  °C',
              definitionPt:
                'Diodo (queda direta ~0,6 V), frequencia/DUTY de sinais PWM, ganho hFE de transistores e temperatura por termopar tipo K. O botao SELECT acessa a funcao laranja (Hz, °C/°F, DUTY).',
              color: '#b46bff',
            },
            { kind: 'heading', textPt: 'Os terminais (canais)' },
            {
              kind: 'text',
              textPt:
                'COM (preto): comum/negativo, referencia de tudo — a ponta PRETA fica sempre aqui. VΩHz (vermelho): tensao, resistencia, frequencia, diodo e temperatura; NUNCA para corrente. mA/µA: correntes baixas (ate 400 mA). 10A: correntes altas (ate 10 A). Terminal errado e a causa numero 1 de multimetro queimado.',
            },
            { kind: 'heading', textPt: 'Os 4 botoes' },
            {
              kind: 'text',
              textPt:
                'SELECT: escolhe a funcao secundaria (laranja). RANGE: alterna a faixa de medicao (segure para voltar ao automatico). REL: zera no valor atual e mostra so a diferenca. HOLD: congela o valor no visor. Ha ainda a luz de fundo para ambientes escuros.',
            },
            {
              kind: 'note',
              textPt:
                'Erros que queimam o instrumento: (1) medir corrente com a ponta no terminal VΩHz — vira um curto; (2) medir tensao na funcao de corrente — queima o fusivel; (3) medir resistencia/continuidade com o circuito energizado; (4) escala baixa demais (OL). No simulador, o visor avisa cada um desses erros.',
            },
          ],
        },
      ],
    },
    {
      id: 'aula-2-medindo-o-circuito',
      numero: 2,
      titlePt: 'Medindo um circuito real',
      tag: 'pratica',
      summaryPt:
        'Bancada 3D: o mesmo circuito (bateria 12 V, fusivel, interruptor e farol) funcionando, e o multimetro medindo tensao, corrente e resistencia em cada ponto.',
      pages: [
        {
          id: 'p1',
          titlePt: 'Medindo tensao, corrente e resistencia',
          blocks: [
            { kind: 'question', textPt: 'Onde e como encostar as pontas para medir cada grandeza?' },
            {
              kind: 'text',
              textPt:
                'O circuito e o mesmo da Aula 0: bateria de 12 V, fusivel, interruptor e a lampada (farol H7 ~55 W). Agora ele funciona com valores fixos e voce usa o multimetro ao lado. Escolha a funcao, coloque as duas pontas nos pontos do circuito (B+, B-, F1, F2, S1, S2, L1, L2) e veja a leitura.',
            },
            { kind: 'heading', textPt: 'Bancada 3D — meca o circuito' },
            {
              kind: 'scene',
              sceneId: 'circuitMeter',
              captionPt:
                'Gire a chave (V=, A, Ω...) e clique num TERMINAL do multimetro para pegar a ponta na mao (bornes vermelhos = ponta vermelha; COM = ponta preta); depois clique no PONTO do circuito onde quer liga-la. Clicar no terminal de novo solta o fio. Ligue/abra o interruptor, remova o fusivel e conecte/desconecte a bateria para ver cada cenario. O visor mostra a leitura e explica o que esta acontecendo.',
              heightPx: 520,
              interactive: true,
            },
            {
              kind: 'note',
              textPt:
                'Complete as 5 medidas-chave: tensao da bateria, tensao na lampada, tensao no interruptor aberto, corrente em serie e resistencia da lampada (a frio).',
            },
          ],
        },
        {
          id: 'p2',
          titlePt: 'Como se mede cada grandeza',
          blocks: [
            { kind: 'heading', textPt: 'Tensao (V): em PARALELO' },
            {
              kind: 'concept',
              numero: 1,
              titlePt: 'Tensao mede-se em paralelo',
              unitPt: 'Volt (V)',
              definitionPt:
                'Encoste as duas pontas em DOIS pontos, sem abrir o circuito. O visor mostra a diferenca de potencial entre eles. Nos polos da bateria: ~12,6 V. Sobre a lampada acesa: quase toda a tensao. Sobre um fusivel bom ou interruptor fechado: ~0 V. Sobre um interruptor ABERTO aparece TODA a tensao — e assim que se acha o ponto interrompido.',
              color: '#5b8def',
            },
            { kind: 'heading', textPt: 'Corrente (A): em SERIE' },
            {
              kind: 'concept',
              numero: 2,
              titlePt: 'Corrente mede-se em serie',
              unitPt: 'Ampere (A)',
              definitionPt:
                'A corrente e a MESMA em todo o circuito serie (~4,1 A). Para medir, ABRA o circuito num ponto (interruptor aberto ou fusivel removido) e ligue o amperimetro nos dois lados da abertura, no terminal 10A: ele fecha o circuito e a lampada acende. NUNCA ligue o amperimetro em paralelo — nos polos da bateria ou sobre a lampada vira CURTO e queima o fusivel.',
              color: '#37d67a',
            },
            { kind: 'heading', textPt: 'Resistencia (Ω): DESLIGADO' },
            {
              kind: 'concept',
              numero: 3,
              titlePt: 'Resistencia com o circuito desenergizado',
              unitPt: 'Ohm (Ω)',
              definitionPt:
                'Desconecte a bateria antes de medir Ω (a propria tensao do circuito estraga a leitura). A lampada a FRIO mede ~0,35 Ω; acesa (quente) sobe para ~3 Ω — por isso puxa mais corrente ao ligar. Fusivel bom e interruptor fechado: ~0 Ω. Fusivel queimado ou interruptor aberto: OL (infinito).',
              color: '#ff9f43',
            },
            {
              kind: 'note',
              textPt:
                'Regra de ouro: tensao SEM abrir o circuito (paralelo); corrente ABRINDO o circuito (serie, terminal 10A); resistencia com a bateria DESCONECTADA. Terminal ou funcao errada e a causa numero 1 de multimetro e fusivel queimados.',
            },
          ],
        },
      ],
    },
    {
      id: 'aula-3-ordem-de-ignicao',
      numero: 3,
      titlePt: 'Ordem de ignicao',
      tag: 'motor',
      summaryPt:
        'Do monocilindrico ao 4 cilindros: virabrequim, biela, pistao, cabecote e comando de valvulas — e como a ORDEM DE IGNICAO (1-3-4-2) distribui os 4 tempos entre os cilindros, lidos pelo came em balanco, cruzamento, admissao e escape.',
      pages: [
        {
          id: 'p1',
          titlePt: 'O motor monocilindrico de 4 tempos',
          blocks: [
            { kind: 'question', textPt: 'Como o motor transforma combustivel em movimento?' },
            {
              kind: 'text',
              textPt:
                'Um motor MONOCILINDRICO tem um unico cilindro — e o motor tipico de moto, como uma 150. O numero "150" vem da CILINDRADA: o volume que o pistao desloca dentro do cilindro, cerca de 150 cm3 (por exemplo, diametro 57,3 mm e curso 57,8 mm). Dentro desse cilindro acontece o ciclo Otto, em 4 tempos.',
            },
            { kind: 'heading', textPt: 'Motor 3D — os 4 tempos girando' },
            {
              kind: 'scene',
              sceneId: 'engine',
              captionPt:
                'Voce ve o motor REAL (fechado). Clique em RAIO-X para abrir o corte transparente e ver o mecanismo por dentro: o virabrequim (embaixo) girando, a biela movendo o pistao na camisa, os DOIS comandos com um came cada (azul = admissao, laranja = escape) e as particulas — ar (azul), combustivel (amarelo), mistura (verde), queima (laranja) e gases de escape (cinza). A placa acima do cabecote mostra o ESTADO DO CAME. Use RODAR/PAUSAR, PROXIMO TEMPO (um tempo por vez) e a VELOCIDADE. Gire com o mouse.',
              heightPx: 540,
              interactive: true,
            },
            {
              kind: 'text',
              textPt:
                'Um motor 4 tempos precisa de DUAS voltas completas do virabrequim para realizar um ciclo: 720 graus no total. Cada tempo ocupa meia volta (180 graus): admissao, compressao, combustao e escape. So o tempo de COMBUSTAO produz forca; os outros tres andam pela inercia do virabrequim (por isso existe o volante de inercia). Quem decide a hora de cada valvula abrir e fechar e o COMANDO DE VALVULAS, que gira na METADE da rotacao do motor: 1 volta do comando para cada 2 voltas do virabrequim.',
            },
            {
              kind: 'text',
              textPt:
                'Aqui ainda NAO existe ordem de ignicao: com um unico cilindro nao ha o que ordenar — ele queima uma vez a cada 2 voltas e pronto. O que ja da para aprender e a LEITURA DO COMANDO, que e a ferramenta usada para achar a ordem de ignicao nos motores de varios cilindros. Sao 4 estados: BALANCO (os dois cames apontados um para o outro, nenhum pressionando: as duas valvulas fechadas — e o cilindro em compressao/condicao de ignicao), CRUZAMENTO (os dois cames apontados para baixo, se cruzando: o escape terminando de fechar enquanto a admissao comeca a abrir), ADMISSAO (so o came de admissao acionando: admissao aberta, escape fechada) e ESCAPE (so o came de escape acionando: escape aberta, admissao fechada).',
            },
            {
              kind: 'note',
              textPt:
                'Dica: use PROXIMO TEMPO para parar em cada um dos 4 tempos e ver quais valvulas estao abertas e para onde o pistao esta indo. Regra pratica: dois cames para dentro = BALANCO; dois para baixo/cruzados = CRUZAMENTO; so admissao atuando = ADMISSAO; so escape atuando = ESCAPE. Guarde essa regra — e com ela que voce vai ler a ordem de ignicao nas proximas paginas.',
            },
          ],
        },
        {
          id: 'p2',
          titlePt: 'Motor 2 cilindros: um sobe enquanto o outro desce',
          blocks: [
            { kind: 'question', textPt: 'E com MAIS de um cilindro — como eles se coordenam?' },
            {
              kind: 'text',
              textPt:
                'Este e um motor BICILINDRICO (2 cilindros, 4 valvulas) no MESMO virabrequim, com as manivelas a 180°: os pistoes se movem OPOSTOS — quando um esta no PMS (ponto morto superior), o outro esta no PMI (ponto morto inferior). Por isso os dois cilindros ficam sempre 1 tempo (meia volta) defasados: enquanto um admite, o outro comprime; enquanto um faz forca (combustao), o outro esta no escape.',
            },
            { kind: 'heading', textPt: 'Motor 3D — 2 cilindros de 4 tempos' },
            {
              kind: 'scene',
              sceneId: 'engine2',
              captionPt:
                'O mesmo mecanismo da pagina 1, agora com 2 cilindros. No LADO A (frente) fica a CORREIA DENTADA de sincronismo: a engrenagem do virabrequim gira os DOIS comandos na METADE da rotacao (relacao 1:2). O CILINDRO 1 e o vizinho da correia — ele e a REFERENCIA e a linha do tempo comeca (0°) com ele em BALANCO: pistao no PMS, as duas valvulas fechadas e os dois cames apontados um para o outro. A placa acima de cada cilindro mostra o estado lido nos cames dele. Clique em RAIO-X para ver por dentro. Particulas: ar (azul), combustivel (amarelo), mistura (verde), queima (laranja) e escape (cinza).',
              heightPx: 560,
              interactive: true,
            },
            {
              kind: 'text',
              textPt:
                'Olhando so para a dupla de cames que fica acima de um cilindro voce ja sabe em que estado ele esta. BALANCO: os dois cames apontados um para o outro, sem pressionar nada — admissao e escape FECHADAS; e a posicao que identifica o cilindro em compressao/condicao de ignicao. CRUZAMENTO: os dois cames para baixo, um em direcao ao outro, acionando as duas valvulas ao mesmo tempo — o escape terminando de fechar enquanto a admissao comeca a abrir. ADMISSAO: so o came de admissao acionando (admissao aberta, escape fechada). ESCAPE: so o came de escape acionando (escape aberta, admissao fechada).',
            },
            {
              kind: 'note',
              textPt:
                'Regra pratica: dois cames para dentro = BALANCO; dois para baixo/cruzados = CRUZAMENTO; so admissao atuando = ADMISSAO; so escape atuando = ESCAPE. Pause em 0° e confira: cilindro 1 em BALANCO no PMS, com o outro pistao no PMI.',
            },
          ],
        },
        {
          id: 'p3',
          titlePt: 'Motor 4 cilindros: os quatro estados ao mesmo tempo',
          blocks: [
            { kind: 'question', textPt: 'Num motor de 4 cilindros, o que cada dupla de cames esta mostrando?' },
            {
              kind: 'text',
              textPt:
                'Motor de 4 CILINDROS em linha, 8 VALVULAS (2 por cilindro), um unico virabrequim e a mesma correia dentada girando os dois comandos na metade da rotacao. As manivelas sao montadas assim: 1 e 4 sobem juntos, 2 e 3 sobem juntos, e a ordem de ignicao e 1-3-4-2. Cada cilindro esta num tempo diferente, entao a cada instante os 4 tempos estao acontecendo de uma vez — e um cilindro nunca fica sem forca no virabrequim.',
            },
            { kind: 'heading', textPt: 'Motor 3D — 4 cilindros de 8 valvulas' },
            {
              kind: 'scene',
              sceneId: 'engine4',
              captionPt:
                'A referencia continua sendo o CILINDRO 1, o vizinho da correia dentada: em 0° ele esta em BALANCO (PMS, as duas valvulas fechadas, os dois cames apontados um para o outro). Nesse mesmo instante o companheiro dele, o CILINDRO 4, esta em CRUZAMENTO (os dois cames para baixo, as duas valvulas acionadas), e os cilindros 2 e 3 ficam com so um came atuando cada — escape e admissao. A placa acima de cada cilindro mostra o estado lido nos cames. Clique em RAIO-X para ver por dentro e gire com o mouse.',
              heightPx: 580,
              interactive: true,
            },
            {
              kind: 'text',
              textPt:
                'Repare no par 1-4: quando um esta em BALANCO o outro esta em CRUZAMENTO, sempre. E o mesmo vale para o par 2-3. Por isso o mecanico usa o balanco como referencia: colocando o cilindro 1 no PMS com os cames apontados um para o outro, ele sabe que aquele cilindro esta no fim da compressao (condicao de ignicao) e que o cilindro 4 esta na troca de gases.',
            },
            {
              kind: 'note',
              textPt:
                'Dica: pause em 0° e leia as quatro placas de uma vez — BALANCO, ESCAPE, ADMISSAO e CRUZAMENTO. Depois use PROXIMO TEMPO e veja os estados girando entre os cilindros na ordem de ignicao 1-3-4-2.',
            },
          ],
        },
      ],
    },
    {
      id: 'aula-4-componentes-e-sensores',
      numero: 4,
      titlePt: 'Componentes e sensores do motor',
      tag: 'sensores',
      summaryPt:
        'O mapa completo do sistema de injecao eletronica em 3D: as 26 pecas nos lugares certos, o caminho do ar, do combustivel e do escape, o chicote saindo da ECU e as duas sondas lambda, uma antes e outra depois do catalisador.',
      pages: [
        {
          id: 'p1',
          titlePt: 'O mapa do sistema',
          blocks: [
            {
              kind: 'question',
              textPt:
                'Antes de medir qualquer sensor, uma pergunta: voce sabe onde ele fica e com quem ele conversa?',
            },
            {
              kind: 'text',
              textPt:
                'Todo diagrama de injecao eletronica que voce vai encontrar em manual e apostila e a mesma coisa desenhada de jeitos diferentes. Quem entende o desenho conserta qualquer motor; quem so decorou nome de peca fica perdido assim que muda a marca.',
            },
            {
              kind: 'text',
              textPt:
                'Esse mapa aqui embaixo e o sistema inteiro montado em 3D. O motor esta em corte de proposito: da para ver o pistao subindo, as valvulas abrindo, o jato do injetor entrando na camara e a faisca da vela. Cada numero e uma peca de verdade, no lugar em que ela fica no motor, e a lista da direita leva a camera ate ela.',
            },
            {
              kind: 'scene',
              sceneId: 'motronicMap',
              heightPx: 860,
              wide: true,
              interactive: true,
              captionPt:
                'Clique num numero, no desenho ou na lista, e a camera centraliza a peca. O filtro isola ar, combustivel, ignicao, sensores, escape ou controle.',
            },
            {
              kind: 'note',
              textPt:
                'Repare nas bolinhas correndo: azul e o ar entrando, laranja e o combustivel indo do tanque ate a galeria e vermelho e o gas queimado saindo. Todo o resto do sistema existe para acertar a proporcao entre esses tres.',
            },
          ],
        },
        {
          id: 'p2',
          titlePt: 'Como o sistema se organiza',
          blocks: [
            {
              kind: 'text',
              textPt:
                'Por mais peca que tenha no mapa, o sistema so faz uma coisa: MEDIR o que esta entrando, DECIDIR quanto de combustivel e quando dar a faisca, e CONFERIR no escape se acertou. Sensor mede, ECU decide, atuador executa, sonda confere.',
            },
            {
              kind: 'heading',
              textPt: 'O caminho do ar',
            },
            {
              kind: 'text',
              textPt:
                'O ar entra pelo medidor de massa (2), que pesa quanto ar esta entrando em gramas por segundo. Passa pelo corpo de borboleta motorizado (9), que hoje nao tem mais cabo de acelerador: quem abre a borboleta e um motor eletrico comandado pela ECU. Chega no coletor, onde o sensor de pressao (11) diz o quanto o motor esta carregado. A EGR (12) devolve uma parte do gas de escape para dentro dessa mesma admissao, para baixar a temperatura da queima.',
            },
            {
              kind: 'heading',
              textPt: 'O caminho do combustivel',
            },
            {
              kind: 'text',
              textPt:
                'O modulo dentro do tanque (18) manda combustivel para a frente. Na injecao direta ele passa ainda pela bomba de alta pressao (10), movida pelo comando, que leva a pressao de uns 4 bar para 50 a 200 bar. Essa pressao fica guardada na galeria (14), vigiada pelo sensor de pressao (13), e as valvulas de injecao (15) soltam a quantidade certa. O vapor que evapora no tanque nao vai para o ar: fica preso no canister (1) ate a valvula de purga (8) mandar ele para o motor queimar.',
            },
            {
              kind: 'note',
              textPt:
                'Quem determina a quantidade de combustivel e o TEMPO que o injetor fica aberto, medido em milissegundos. Por isso a pressao precisa ser conhecida: se ela muda e o tempo continua o mesmo, a quantidade muda junto.',
            },
            {
              kind: 'heading',
              textPt: 'Quando injetar e quando dar faisca',
            },
            {
              kind: 'text',
              textPt:
                'O sensor de rotacao (17) le a roda dentada do virabrequim e da a rotacao e a posicao. O sensor de fase (20) le o comando e diz em qual das duas voltas o motor esta. Com os dois a ECU sabe exatamente qual cilindro esta em compressao e comanda a bobina (19) na hora certa. O sensor de detonacao (16) escuta a batida de pino e faz a ECU atrasar o ponto antes de quebrar o motor. O sensor de temperatura (21) autoriza a mistura mais rica enquanto o motor esta frio.',
            },
            {
              kind: 'heading',
              textPt: 'A prova real: o escape',
            },
            {
              kind: 'text',
              textPt:
                'Depois da queima vem a conferencia. A sonda antes do catalisador (22) mede o oxigenio que sobrou e e ela que corrige a injecao a cada instante. O pre-catalisador (23) e o catalisador de NOx (25) limpam o gas, com o sensor de temperatura dos gases (24) protegendo a ceramica. E a sonda depois do catalisador (26) nao corrige nada: ela audita se o catalisador ainda esta trabalhando.',
            },
            {
              kind: 'note',
              textPt:
                'Essa e a diferenca que confunde muita gente na oficina: a sonda da frente COMANDA a mistura, a sonda de tras JULGA o catalisador. Se as duas comecarem a desenhar o mesmo sinal oscilando, o catalisador acabou.',
            },
            {
              kind: 'heading',
              textPt: 'Quem conversa com quem',
            },
            {
              kind: 'text',
              textPt:
                'Ligue o chicote no mapa e olhe quantos fios saem da ECU (3). Tudo isso comeca na bateria (27): se ela estiver fraca, todo sensor entrega valor errado e a central registra defeito que nao existe. A ECU ainda fala com o resto do carro pela rede CAN (7), com dois fios trancados, avisa o motorista pela lampada de anomalia (5), so deixa o motor pegar se o imobilizador (6) reconhecer a chave, e entrega tudo isso para o seu scanner pela tomada de diagnostico (4).',
            },
          ],
        },
      ],
    },
    {
      id: 'aula-4-sonda-lambda',
      numero: 5,
      titlePt: 'Sonda lambda',
      tag: 'sensores',
      rascunho: true,
      summaryPt:
        'Banda estreita x banda larga: como a sonda le o oxigenio do escape, por que o sinal fica oscilando entre 100 e 900 mV, o que a ECU corrige a cada cruzamento, como a banda larga se equilibra com a corrente de bombeamento e o que e o PWM do aquecedor.',
      pages: [
        {
          id: 'p1',
          titlePt: 'Sonda de banda estreita: o que ela realmente le',
          blocks: [
            { kind: 'question', textPt: 'A sonda lambda mede combustivel? Nao. Ela mede OXIGENIO.' },
            {
              kind: 'text',
              textPt:
                'A sonda fica rosqueada no escape e compara o oxigenio que sobrou na queima com o oxigenio do ar atmosferico, que entra por dentro dela (o AR DE REFERENCIA). Essa diferenca entre os dois lados de uma ceramica de ZIRCONIA gera uma tensao — repare que a sonda de banda estreita NAO e alimentada para medir: ela GERA a propria tensao, como uma pilha minuscula.',
            },
            {
              kind: 'text',
              textPt:
                'O fator LAMBDA e so uma conta: lambda = quantidade de ar que entrou dividida pela quantidade de ar que aquele combustivel precisava. Lambda = 1 e a ESTEQUIOMETRIA (na gasolina, cerca de 14,7 kg de ar para 1 kg de combustivel). Lambda menor que 1 = falta ar = mistura RICA. Lambda maior que 1 = sobra ar = mistura POBRE.',
            },
            { kind: 'heading', textPt: 'A curva: 900 mV rica, 450 mV lambda 1, 100 mV pobre' },
            {
              kind: 'scene',
              sceneId: 'lambdaNarrow',
              captionPt:
                'Tela do osciloscopio ligada no fio de sinal da sonda. A linha laranja e o divisor de agua: 450 mV. Acima dela (ate ~900 mV) a mistura esta RICA — quase nao sobrou oxigenio. Abaixo (ate ~100 mV) esta POBRE — sobrou oxigenio. Use MISTURA para provocar defeitos (ar falso e injetor vazando) e CONTROLE para desligar a malha fechada e ver o sinal parar de oscilar.',
              heightPx: 520,
              interactive: true,
            },
            {
              kind: 'text',
              textPt:
                'O detalhe que muda tudo: a curva da banda estreita e QUASE VERTICAL em lambda = 1. Uma variacao minima da mistura joga a tensao de 100 para 900 mV. Ou seja, essa sonda funciona como um INTERRUPTOR: ela diz de que LADO a mistura esta, mas nunca diz o QUANTO. Ela nao sabe diferenciar "um pouco pobre" de "muito pobre" — nos dois casos ela entrega perto de 100 mV.',
            },
            {
              kind: 'note',
              textPt:
                'Abaixo de cerca de 300 °C a ceramica nao conduz e a sonda simplesmente NAO gera sinal. Por isso ela tem aquecedor e por isso o motor comeca sempre em malha aberta. Uma sonda "morta" no scanner com o motor frio pode ser apenas uma sonda ainda fria.',
            },
            { kind: 'heading', textPt: 'Os fios: 1, 3, 4 e 5 fios' },
            {
              kind: 'text',
              textPt:
                'UM FIO: so o sinal; a massa volta pela rosca no escape (sonda antiga, sem aquecedor). TRES FIOS: sinal + os dois fios do aquecedor (a massa do elemento continua sendo a carcaca). QUATRO FIOS: sinal, massa do elemento e os dois do aquecedor — e a montagem mais comum hoje, porque massa propria da leitura mais limpa. CINCO FIOS (e SEIS no chicote): ja e sonda de BANDA LARGA, com duas celulas dentro; o fio extra do chicote e o resistor de calibracao que fica dentro do conector.',
            },
            {
              kind: 'text',
              textPt:
                'Codigo de cores mais usado: CINZA = positivo do aquecedor; BRANCO = negativo do aquecedor (e o fio que a ECU chaveia em PWM); AMARELO = referencia negativa do elemento sensor; PRETO = alimentacao positiva do elemento sensor; VERMELHO = sinal. Confira sempre no esquema do fabricante antes de medir.',
            },
          ],
        },
        {
          id: 'p2',
          titlePt: 'Malha fechada: por que o sinal nunca fica parado',
          blocks: [
            {
              kind: 'question',
              textPt:
                'Se a sonda so diz o LADO da mistura, como a ECU acerta a estequiometria?',
            },
            {
              kind: 'text',
              textPt:
                'Ela corrige por tentativa, o tempo todo. Le acima de 450 mV (rica) e vai DIMINUINDO o tempo de injecao; quando o sinal cruza para baixo de 450 mV (pobre), inverte e vai AUMENTANDO. Como a sonda nunca avisa "chegou", a ECU sempre passa do ponto e tem que voltar. O resultado e uma oscilacao permanente entre cerca de 100 e 900 mV, tipicamente de 1 a 2 Hz com o motor em marcha lenta aquecido.',
            },
            {
              kind: 'note',
              textPt:
                'Essa oscilacao NAO e defeito: e o metodo. O que interessa e a MEDIA no tempo, e ela cai exatamente em lambda = 1. Sinal de sonda parado no meio da tela, sem oscilar, com o motor quente e em malha fechada, e que e sintoma ruim.',
            },
            {
              kind: 'scene',
              sceneId: 'lambdaNarrow',
              captionPt:
                'Repita o teste olhando agora para a CORRECAO (fuel trim). Em NORMAL ela fica perto de zero. Escolha AR FALSO: a sonda vai para pobre e a correcao sobe e fica presa no positivo — a ECU esta compensando ar que nao deveria estar entrando. Escolha INJETOR VAZANDO: a correcao vai para o negativo. Depois troque para MALHA ABERTA e veja a correcao congelar.',
              heightPx: 520,
              interactive: true,
            },
            {
              kind: 'text',
              textPt:
                'Existem duas correcoes no scanner. A correcao RAPIDA (short term fuel trim) e essa que fica pulando junto com a sonda. A correcao APRENDIDA (long term fuel trim) e a media que a ECU memoriza para compensar desgaste, entrada de ar falsa, bico sujo e filtro velho. Se o trim aprendido esta muito positivo, o motor esta cronicamente pobre; muito negativo, cronicamente rico.',
            },
            {
              kind: 'heading',
              textPt: 'Por que tudo isso importa: o catalisador',
            },
            {
              kind: 'text',
              textPt:
                'O catalisador de TRES VIAS so consegue fazer as tres reacoes ao mesmo tempo (oxidar CO, oxidar HC e reduzir NOx) dentro de uma janela estreitissima em volta de lambda = 1, algo como mais ou menos 1%. Fora dessa janela ele perde eficiencia. O catalisador ainda ARMAZENA oxigenio, o que suaviza a oscilacao da mistura que chega nele.',
            },
            {
              kind: 'text',
              textPt:
                'Por isso o carro tem uma segunda sonda DEPOIS do catalisador. O sinal dela tem que ser quase RETO, la pelos 600 a 700 mV. Se a sonda de tras comeca a oscilar parecido com a da frente, o catalisador perdeu a capacidade de armazenar oxigenio — e o diagnostico de catalisador com baixa eficiencia.',
            },
            {
              kind: 'text',
              textPt:
                'A ECU entra em MALHA ABERTA (ignora a sonda e usa o mapa) em tres situacoes classicas: motor frio ou sonda ainda fria, aceleracao de plena carga (onde ela enriquece de proposito para dar potencia e proteger o motor) e desaceleracao com corte de combustivel.',
            },
          ],
        },
        {
          id: 'p3',
          titlePt: 'Banda larga: as duas celulas e a corrente de bombeamento',
          blocks: [
            {
              kind: 'question',
              textPt: 'E quando a ECU precisa saber o QUANTO, e nao so o lado?',
            },
            {
              kind: 'text',
              textPt:
                'Injecao direta com carga estratificada, diesel e controle de plena carga trabalham longe de lambda = 1. A banda estreita nao serve la: ela satura. A solucao foi a sonda de BANDA LARGA, que na construcao e a mesma sonda PLANAR em laminas, so que com DUAS celulas.',
            },
            { kind: 'heading', textPt: 'Como ela se equilibra' },
            {
              kind: 'scene',
              sceneId: 'lambdaWide',
              captionPt:
                'Corte da sonda planar de banda larga. O gas de escape nao chega direto na celula de medicao: ele passa por uma CAMARA DE DIFUSAO com entrada controlada. A celula de Nernst (direita) mede a camara igual a uma banda estreita. A celula de bombeamento (esquerda) empurra ions de oxigenio para dentro ou para fora. Arraste o FATOR LAMBDA e acompanhe a corrente e o sentido das bolinhas.',
              heightPx: 520,
              interactive: true,
            },
            {
              kind: 'text',
              textPt:
                'A ECU faz o seguinte: ela nao deixa a camara de difusao sair de lambda = 1 nunca. Ela olha a celula de Nernst e, sempre que a leitura sai dos 450 mV, aplica uma CORRENTE DE BOMBEAMENTO na outra celula para trazer a camara de volta. Se a mistura esta POBRE, sobra oxigenio na camara e a corrente bombeia o O2 para FORA: corrente POSITIVA. Se esta RICA, falta oxigenio e a corrente bombeia para DENTRO: corrente NEGATIVA. Em lambda = 1 exato nao precisa bombear nada: corrente ZERO.',
            },
            {
              kind: 'text',
              textPt:
                'Sacou a jogada? A grandeza medida deixou de ser tensao e passou a ser CORRENTE — e a corrente necessaria e proporcional ao desvio. Como essa relacao e LINEAR, a sonda consegue informar lambda desde cerca de 0,7 (bem rica) ate ar puro, dizendo exatamente o quanto. Nao e mais um interruptor, e uma regua.',
            },
            {
              kind: 'note',
              textPt:
                'Na pratica voce raramente ve a corrente direto: o scanner ja mostra convertido em lambda ou em AFR. E o aquecedor dela e obrigatorio e mais forte, porque ela trabalha entre 600 e 800 °C, contra os ~300 °C minimos da banda estreita. Cuidado ao testar: NAO se mede sonda de banda larga com a mesma logica de tensao da banda estreita.',
            },
          ],
        },
        {
          id: 'p4',
          titlePt: 'O aquecedor e o sinal PWM',
          blocks: [
            {
              kind: 'question',
              textPt: 'O que e aquele sinal PWM que o osciloscopio mostra no fio do aquecedor?',
            },
            {
              kind: 'text',
              textPt:
                'PWM quer dizer modulacao por largura de pulso. A ECU NAO varia a tensao do aquecedor — ela liga e desliga a MASSA dele muito rapido e muda a proporcao de tempo ligado. Essa proporcao e o DUTY CYCLE. A potencia media entregue e o duty multiplicado pelos 12 V: 50% de duty equivale a uns 6 V medios; 100% de duty e o aquecedor ligado direto.',
            },
            {
              kind: 'scene',
              sceneId: 'lambdaHeater',
              captionPt:
                'A tela mostra o trem de pulsos no fio de comando do aquecedor. Deixe em RAMPA DA ECU e veja o duty subir devagar e a ceramica acompanhar. Depois passe para MANUAL e jogue o duty acima de 90% com a sonda ainda fria para ver o choque termico.',
              heightPx: 500,
              interactive: true,
            },
            {
              kind: 'text',
              textPt:
                'O PWM serve para duas coisas. A primeira e evitar CHOQUE TERMICO. No arranque o escape ainda esta frio e cheio de agua condensada da propria queima. Se a ECU jogasse 100% de duty logo de cara, a ceramica esquentaria de uma vez, encontraria essa agua e TRINCARIA. Entao ela sobe o duty em rampa. A segunda e manter a temperatura de trabalho depois de aquecida, sem cozinhar o elemento.',
            },
            {
              kind: 'text',
              textPt:
                'Na sonda de banda larga tem um detalhe elegante: a ECU usa a RESISTENCIA INTERNA da celula de Nernst como termometro. A resistencia da ceramica cai conforme ela esquenta, entao a ECU mede essa resistencia e fecha uma malha em cima do aquecedor, ajustando o duty para segurar a temperatura no alvo.',
            },
            {
              kind: 'note',
              textPt:
                'E aqui aparece a diferenca pratica entre a sonda DEDAL e a PLANAR: a dedal tem muito mais massa ceramica para aquecer e normalmente o aquecedor e ligado direto, sem PWM — ela leva mais de um minuto para entrar em operacao. A planar e uma lamina fina com o aquecedor impresso junto e chega la em cerca de 10 segundos. Menos tempo em malha aberta significa menos consumo e menos emissao no arranque, que e justamente o pior momento do ciclo de emissoes.',
            },
          ],
        },
      ],
    },
  ],
};

export function getCourseLessons(courseId: string): Lesson[] {
  return (COURSE_LESSONS[courseId] ?? []).filter((l) => !l.rascunho);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  return (COURSE_LESSONS[courseId] ?? []).find((l) => l.id === lessonId);
}
