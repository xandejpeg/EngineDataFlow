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
  | { kind: 'scene'; sceneId: string; captionPt?: string; heightPx?: number; interactive?: boolean };

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
  ],
};

export function getCourseLessons(courseId: string): Lesson[] {
  return COURSE_LESSONS[courseId] ?? [];
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  return (COURSE_LESSONS[courseId] ?? []).find((l) => l.id === lessonId);
}
