# Prompt para abrir o chat novo com o GPT-6 Astra

Copie tudo que esta dentro do bloco abaixo e cole como primeira mensagem.

---

```
Voce vai trabalhar num projeto de curso de injecao eletronica automotiva que ja esta
em andamento. Leia este briefing inteiro antes de tocar em qualquer arquivo.

===============================================================================
1. O QUE E O PROJETO
===============================================================================

Repositorio: EngineDataFlow
Stack: React 18 + TypeScript strict + Vite 5 + @react-three/fiber 8.17 +
       @react-three/drei 9.114 + three 0.169 + lucide-react

E uma plataforma de curso onde cada aula tem paginas de texto e cenas 3D
interativas construidas em react-three-fiber. Nada e imagem: tudo e geometria
gerada em codigo, animada com useFrame.

O servidor de desenvolvimento JA ESTA RODANDO em http://localhost:5173.
NAO inicie outro.

===============================================================================
2. O QUE JA ESTA PRONTO (nao refaca nada disso)
===============================================================================

Curso: injecao-eletronica-40h

  Aula 0 a 2  eletricidade basica, multimetro, circuitos
  Aula 3      Ordem de ignicao (3 partes)
  Aula 4      Componentes e sensores do motor (2 partes)  <-- 27 componentes 3D
  "Aula 5"    Sonda lambda -- EXISTE mas esta rascunho:true, escondida

Todas as aulas vivem em UM arquivo de dados:

  src/data/courseLessons.pt-BR.ts

===============================================================================
3. LEIA ESTAS DUAS AULAS ANTES DE COMECAR. ELAS SAO SUA BASE.
===============================================================================

--- AULA 3, PARTE 3: o motor mecanico ---

  Licao id:  'aula-3-ordem-de-ignicao', pagina 'p3'
  Titulo:    "Motor 4 cilindros: os quatro estados ao mesmo tempo"
  Arquivo:   src/data/courseLessons.pt-BR.ts  (busque por 'aula-3-ordem-de-ignicao')
  Cena 3D:   sceneId 'engine4'
  Codigo:    src/features/courses/lessons/scenes/inlineEngine.tsx
             (componente EngineScene4; EngineScene2 e o de 2 cilindros)
  Fisica:    src/features/courses/lessons/scenes/enginePhysics.ts
  Pecas:     src/features/courses/lessons/scenes/engineParts.tsx

  O que essa aula ja ensina e voce NAO precisa reexplicar:
    - 4 cilindros em linha, 8 valvulas, um virabrequim, correia dentada
      girando os comandos na metade da rotacao
    - manivelas: 1 e 4 sobem juntos, 2 e 3 sobem juntos
    - ORDEM DE IGNICAO 1-3-4-2
    - os quatro estados lidos nos cames: BALANCO, CRUZAMENTO, ADMISSAO, ESCAPE
    - cilindro 1 (o vizinho da correia) e a referencia; em 0 graus ele esta
      em BALANCO no PMS com as duas valvulas fechadas
    - modo raio-X para ver por dentro

  ESSA E A SUA BASE MECANICA. O motor da aula 5 tem que ser coerente com ela.

--- AULA 4: o sistema eletrico e os sensores ---

  Licao id:  'aula-4-componentes-e-sensores'
  Arquivo:   src/data/courseLessons.pt-BR.ts
  Cena 3D:   sceneId 'motronicMap'
  Codigo:    src/features/courses/lessons/scenes/MotronicMapScene.tsx
  Dados:     src/features/courses/lessons/scenes/motronicMap.ts   (27 itens)
  Detalhe:   src/features/courses/lessons/scenes/partFocus.ts     (27 cenas de foco)
  URL:       /courses/injecao-eletronica-40h/lessons/aula-4-componentes-e-sensores

  Sao 27 componentes numerados, cada um com uma cena de foco propria com
  texto, pinagem e testes. Ja passaram por auditoria completa. NAO MEXA NELAS
  sem o usuario pedir.

  Os 27, por grupo:
    ar          02 MAF, 09 corpo de borboleta
    combustivel 01 canister, 08 valvula de purga, 10 bomba de alta,
                14 galeria, 15 bico injetor, 18 modulo de combustivel
    ignicao     19 bobina
    sensores    11 MAP, 13 pressao da galeria, 16 detonacao, 17 CKP,
                20 CMP, 21 ECT
    escape      12 EGR, 22 lambda LSU, 23 pre-catalisador, 24 EGT,
                25 catalisador de NOx, 26 lambda LSF
    controle    03 ECU, 04 OBD2, 05 MIL, 06 imobilizador, 07 CAN, 27 bateria

  ESSA E A SUA BASE ELETRICA. Os 27 ja existem como modelo 3D.

===============================================================================
4. O DOCUMENTO QUE VOCE TEM QUE SEGUIR
===============================================================================

  ASTRA-BUILD-GOLF-V-2.0-FSI.md   (raiz do repositorio)

Leia ele inteiro. E uma especificacao de montagem de um carro completo:
Volkswagen Golf V (Typ 1K, plataforma PQ35), motor 2.0 FSI codigo BLX, 2005,
central Bosch MED 9.5.10, cambio manual 02Q de 6 marchas.

Esse carro foi escolhido porque e o unico modelo real que tem os 27 componentes
da Aula 4 ao mesmo tempo, incluindo o trio raro: catalisador acumulador de NOx,
sensor de NOx e sensor EGT. E a central dele e Motronic de verdade, que e o
nome do mapa da aula 4.

O que tem dentro do documento:

  Secao 1   Sistema de coordenadas em MILIMETRO. Origem no centro do eixo
            dianteiro, no chao. X para a direita, Y para cima, Z para tras.
            Todos os marcos globais do carro.
  Secao 2   Os tres modos de visualizacao
  Secao 3   Biblioteca de materiais nomeados
  Secao 4   Carroceria, chassi, suspensao, freios
  Secao 5   O motor por dentro: bloco, virabrequim, pistoes com bacia,
            cabecote, comandos, correia, acessorios, cambio, arrefecimento.
            Inclui o frame local do motor e a regra exata de rotacao para
            posicionar ele no mundo.
  Secao 6   Os 27 componentes, um por um, com coordenada global, tamanho,
            material, codigo VAG (G70, G247, G295, N80, N30-N33...) e ligacoes
  Secao 7   O que tem no vao do motor e nao tem numero
  Secao 8   O escape inteiro em escala real: 18 pontos de trajeto, ~3900 mm
  Secao 9   Tanque tipo sela de 55 L e a linha de combustivel de ~2600 mm
  Secao 10  Rede eletrica com secao de cabo real

  >>> Secao 11  O MOTOR FUNCIONANDO. O relogio mestre theta de 0 a 720, a
  >>>           defasagem dos cilindros a partir da ordem 1-3-4-2, a formula
  >>>           exata da posicao do pistao, o comando de valvulas, o avanco de
  >>>           ignicao com dwell, e as janelas de injecao dos dois modos.
  >>> Secao 12  COMO CADA UM DOS 27 SE MEXE. Tabela contrato: cada componente
  >>>           e o que ele anima, ligado a theta ou ao estado de operacao.
  >>>           Termina com a lista de 7 verificacoes que provam que esta certo.

  Secao 13  Termos de busca em alemao para foto de referencia
  Secao 14  Prompts de geracao de imagem
  Secao 15  ORDEM DE CONSTRUCAO em 23 passos + hierarquia de grupos
  Secao 16  Onde a especificacao pode estar errada

AS SECOES 11 E 12 SAO AS MAIS IMPORTANTES. As secoes 1 a 10 descrevem um motor
PARADO. Sem as secoes 11 e 12 voce entrega uma escultura, nao uma aula.

LEIA A SECAO 16 COM ATENCAO. As coordenadas globais e os angulos de comando sao
estimativa de engenharia, nao ficha tecnica da VW. Sao coerentes entre si e a
animacao vai ficar certa, mas se voce tiver referencia melhor, SOBRESCREVA e
avise. Nao trate como verdade absoluta.

Existe tambem MOTOR-REAL.md, com a pesquisa de qual peca real corresponde a
cada um dos 27. Leia se precisar de contexto de peca.

===============================================================================
5. SUA MISSAO: A AULA 5 -- "MOTOR COMPLETO"
===============================================================================

A Aula 3 ensinou a MECANICA: 4 cilindros, ordem de ignicao 1-3-4-2, os quatro
tempos acontecendo ao mesmo tempo. Mas num motor generico, sem sistema.

A Aula 4 ensinou os 27 COMPONENTES: cada peca, o que ela faz, como testar. Mas
espalhados num mapa esquematico, sem um motor de verdade em volta.

A AULA 5 JUNTA AS DUAS. Titulo: "Motor completo".

E o motor do Golf V 2.0 FSI montado inteiro, RODANDO, com:

  - a mecanica da Aula 3 funcionando de verdade: virabrequim girando, os 4
    pistoes nas defasagens certas, comandos em metade da rotacao, valvulas
    abrindo na hora, e as bobinas disparando na ORDEM 1-3-4-2

  - os 27 componentes da Aula 4 TODOS PRESENTES, cada um na coordenada real
    dentro do carro, e cada um SE MEXENDO no tempo certo: o CKP lendo os 58
    dentes, o CMP dando 1 pulso por ciclo, o MAP caindo a cada admissao, a
    bomba de alta dando 3 golpes contra 4 injecoes, o bico disparando no
    angulo do modo, a sonda mudando de leitura, o catalisador de NOx enchendo
    e esvaziando

  - o escape completo, em escala, do coletor ate a ponteira la atras
  - o tanque atras e a linha de combustivel percorrendo o assoalho inteiro
  - a carroceria, para dar escala e contexto
  - os tres modos de visualizacao

TUDO ligado a UMA unica variavel: o angulo do virabrequim theta, de 0 a 720.
Nada animado por tempo solto. E isso que garante que nada saia de sincronismo.

O TESTE QUE DEFINE SE VOCE ACERTOU:
coloque theta = 0 e olhe os quatro cilindros. Tem que dar exatamente o que a
Aula 3 parte 3 ja ensina:
     cilindro 1 -> BALANCO      cilindro 2 -> ESCAPE
     cilindro 3 -> ADMISSAO     cilindro 4 -> CRUZAMENTO
Se nao der isso, sua cena esta contradizendo uma aula anterior. Refaca.
A secao 12.2 do documento tem as outras 6 verificacoes.

DOIS PONTOS PEDAGOGICOS QUE O USUARIO QUER VISIVEIS:

  1. OS DOIS MODOS DE INJECAO. Mesmo motor, mesmo angulo, nuvem de combustivel
     em lugar completamente diferente. No homogeneo o bico injeta na admissao e
     enche o cilindro. No estratificado o bico injeta no fim da compressao e a
     BACIA DO PISTAO leva a nuvem rica ate a vela, com as flaps fechadas e a
     borboleta 85 por cento aberta. Isso e o contrario de tudo que o aluno viu
     ate agora e e o coracao da Aula 5. Esta na secao 11.7.

  2. A DISTANCIA REAL. O combustivel sai do tanque la atras, viaja ~2600 mm a
     5 bar pelo assoalho, chega na bomba de alta que sobe para 110 bar, e ai
     percorre so 20 cm de galeria ate o bico. Nenhum diagrama de livro mostra
     essa proporcao.

COMO REGISTRAR A AULA:

  1. Adicione um objeto Lesson ao array COURSE_LESSONS['injecao-eletronica-40h']
     em src/data/courseLessons.pt-BR.ts

     Formato:
     {
       id: 'aula-5-motor-completo',
       numero: 5,
       titlePt: 'Motor completo',
       tag: 'motor',
       summaryPt: '...',
       pages: [
         { id: 'p1', titlePt: '...', blocks: [ ... ] }
       ]
     }

     Blocos disponiveis: question, heading, text, note, formula, concept, scene.
     O bloco de cena:
     { kind: 'scene', sceneId: 'meuId', captionPt: '...', heightPx: 580,
       interactive: true, wide: true }

     Observacao: ja existe no arquivo uma licao antiga de sonda lambda marcada
     com rascunho:true que ocupa o numero 5. Ela esta escondida do usuario.
     Renumere ela para o fim da lista e siga. Nao gaste tempo com ela e nao
     abra esse assunto com o usuario agora.

  2. Registre o sceneId em:
     src/features/courses/lessons/lessonScenes.ts  (objeto LESSON_SCENES)

  3. Crie o componente da cena em:
     src/features/courses/lessons/scenes/

  4. Pecas 3D reutilizaveis vao em:
     src/engine3d/parts/partModels.tsx   (registry PART_MODELS + PART_META)

     ESSE ARQUIVO TEM ~6900 LINHAS. NUNCA LEIA ELE INTEIRO.
     Use grep_search para achar a funcao que voce quer.
     Ele ja tem 125 pecas registradas, varias delas uteis pra voce:
     crankshaft, connecting-rod, piston, cylinder-liner, cylinder-head,
     intake-valve, exhaust-valve, camshaft, intake-system, exhaust-system,
     crankcase, alternator, starter-motor, battery, ecu, e os 27 da aula 4.
     REUTILIZE antes de criar peca nova.

-------------------------------------------------------------------------------
5.1 QUALIDADE DO MODELO. ENTENDA ISSO OU VAI ENTREGAR ERRADO.
-------------------------------------------------------------------------------

As pecas 3D que ja existem nas aulas 3 e 4 sao ESQUEMATICAS. Elas foram feitas
para um MAPA DIDATICO: formas simplificadas, tamanhos exagerados de proposito
para caber na legenda, posicoes logicas e nao reais. Elas cumprem bem o papel
delas e estao aprovadas. NAO MEXA NELAS.

Mas ELAS NAO SAO O ALVO VISUAL DA AULA 5.

Use as aulas 3 e 4 como REFERENCIA DE CONCEITO:
  - o que a peca faz
  - como ela se liga nas outras
  - qual sinal ela gera
  - o nome, o codigo, a pinagem
  - a matematica do motor que a aula 3 ja resolveu

E use o ASTRA-BUILD como REFERENCIA DE FORMA:
  - a peca da aula 5 tem que PARECER A PECA REAL DO GOLF V 2.0 FSI
  - silhueta certa, proporcao certa, tamanho em milimetro real,
    material certo, na coordenada real dentro do carro

Ou seja: voce vai REMODELAR. Aproveitar o codigo existente como esqueleto e
ponto de partida esta otimo, mas a geometria final tem que ser mais fiel.
Uma bobina da aula 4 pode ser um bloco com um pino. A bobina da aula 5 tem que
ter o corpo moldado, o conector de 4 vias, o cachimbo de borracha e a mola.

COMO ACERTAR A FORMA SEM CHUTAR:
  - A secao 13 do ASTRA-BUILD tem os termos de busca EM ALEMAO para achar foto
    real de cada peca. Alemao acha a peca certa; portugues acha anuncio.
  - A secao 14 tem prompts prontos de geracao de imagem, caso voce prefira
    gerar uma referencia visual.
  - Olhe a referencia ANTES de escrever a geometria. Modelar de memoria e o
    caminho mais rapido para uma peca que parece um brinquedo.

TECNICA, porque geometria de codigo PODE ficar boa:
  - LatheGeometry para tudo que e torneado: corpo de sensor, bico, pistao,
    conexao, silencioso. E a ferramenta mais subaproveitada do three.
  - ExtrudeGeometry com Shape e bezierCurveTo para perfil recortado: flange,
    suporte, coletor, chapa.
  - TubeGeometry com CatmullRomCurve3 para chicote, mangueira e escape.
  - Quebre o canto vivo. Peca real quase nunca tem aresta de 90 graus seca.
    Um chanfro pequeno muda completamente a leitura da forma.
  - Peca fundida (bloco, cabecote, coletor) tem superficie irregular e angulo
    de saida de molde, nao e caixa lisa.
  - Caixa crua e cilindro cru so como bloco de rascunho. Nao entregue assim.

MAS SEM EXAGERO: e um carro inteiro. Detalhe onde a camera chega perto
(motor, os 27, o cabecote em corte). Simplifique o que so aparece de longe
(assoalho, suspensao, interior). Peca fora de quadro nao precisa de curva.

===============================================================================
6. REGRAS DE ECONOMIA. LEIA COM ATENCAO, ISSO IMPORTA.
===============================================================================

O usuario paga por credito e ja gastou muito neste projeto. Sua eficiencia e
parte da tarefa, nao um detalhe.

  1. NUNCA TIRE SCREENSHOT PARA CONFERIR SEU PROPRIO TRABALHO.
     Isso e o que mais queima credito. O usuario olha na tela dele e te fala
     se esta certo. Se voce quiser verificar algo, use Playwright com
     evaluate/DOM, que e barato. Screenshot NAO.

  2. NAO EXPLORE O REPOSITORIO AS CEGAS.
     Todos os caminhos que voce precisa estao neste briefing. Va direto.

  3. LEIA EM BLOCO GRANDE, NAO EM PEDACINHO.
     Uma leitura de 300 linhas custa menos que seis de 50.

  4. NAO CRIE ARQUIVO .MD PARA DOCUMENTAR O QUE VOCE FEZ.
     O usuario nao pediu. Se ele pedir, ai sim.

  5. UMA PECA POR VEZ. Construa, valide, siga.
     Nao escreva 2000 linhas e valide no fim. Se quebrar, voce perde tudo.

  6. NAO REFACA O QUE JA PASSOU NA VALIDACAO.

  7. O SERVIDOR JA RODA EM :5173. Nao suba outro.

  8. Se voce ficar em duvida sobre uma decisao grande (arquitetura, numeracao
     da aula, mudar algo das 27 cenas existentes), PERGUNTE em vez de assumir.
     Uma pergunta custa muito menos que um retrabalho.

===============================================================================
7. REGRAS DO REPOSITORIO
===============================================================================

  - Todo texto em portugues dentro de codigo e dados vai SEM ACENTO.
    ("injecao", "combustivel", "rotacao"). Isso e padrao do projeto inteiro.
    Na conversa com o usuario voce pode usar acento normalmente.

  - Responda ao usuario em portugues do Brasil, direto, SEM EMOJI.

  - Nao encha as cenas de legenda. Uma cena limpa ensina mais.

  - Existe um DETECTOR AUTOMATICO DE SOBREPOSICAO DE LEGENDA rodando nas cenas
    de foco (useLabelOverlapCheck, em PartFocusView.tsx). Ele dispara em 1400 ms
    e imprime avisos "[foco] ..." no console. Se voce criar cena de foco nova,
    ele vai te cobrar. Regras dele:
      largura do texto = (min(5, n_chars * 0.125) + 0.13)
      fora de quadro se |x - camTarget.x| > 9 ou |y - camTarget.y| > 6.5
      caixas contam como corpo; pecas animadas sao medidas EXPANDIDAS
      ele so reporta o PRIMEIRO problema de cada cena, entao deixe margem

  - Enquadramento da camera:
      metadeAltura = camDist * tan(23 graus)
      metadeLargura = metadeAltura * 1.55

  - Pegadinhas do three.js que ja custaram tempo aqui:
      o eixo do torus e o Z, nao o Y
      coneGeometry aponta o bico para +Y
      cilindro com openEnded precisa de side={THREE.DoubleSide}
      Box3.setFromObject ignora objeto com visible=false

  - Em mapPrimitives.tsx, TODA funcao exportada precisa da linha
    // eslint-disable-next-line react-refresh/only-export-components
    logo acima. Const de numero puro nao precisa.

===============================================================================
8. VALIDACAO. RODE ISSO ANTES DE DIZER QUE TERMINOU.
===============================================================================

  npx tsc -p tsconfig.app.json --noEmit; npm run lint
  npm run build 2>&1 | Select-String -Pattern "built in|error"

  O lint e "eslint . --max-warnings=0". Import nao usado QUEBRA o build.
  O terminal e PowerShell no Windows. Use ; para encadear, nunca &&.

===============================================================================
9. COMECE ASSIM
===============================================================================

  1. Leia ASTRA-BUILD-GOLF-V-2.0-FSI.md inteiro, com atencao dobrada nas
     secoes 11 e 12
  2. Leia a Aula 3 parte 3 e a Aula 4 em src/data/courseLessons.pt-BR.ts
  3. Olhe EngineScene4 em inlineEngine.tsx e enginePhysics.ts para entender
     como o projeto ja resolve sincronismo de motor. Voce vai estender essa
     ideia, nao inventar outra do zero
  4. Me diga:
       - se voce concorda com a especificacao ou se achou erro nela
       - se a matematica de sincronismo da secao 11 bate com o que a
         EngineScene4 ja faz hoje
       - quais das pecas existentes voce vai reaproveitar como estao e quais
         voce vai remodelar para ficarem fieis ao Golf (secao 5.1)
       - qual sua proposta de divisao em paginas
       - por onde voce quer comecar
  5. So depois que eu aprovar, comece a escrever codigo.

Seja honesto sobre incerteza. Se voce desviar do plano combinado, AVISE no
relatorio final. Nao esconda desvio.
```

---

## Notas para voce, nao para o Astra

- O prompt manda ele **perguntar antes de codar**. Se voce quiser que ele saia
  construindo direto, apague o passo 5 da secao 9.
- As regras de economia (secao 6) sao as mesmas que voce me deu. Se ele ignorar,
  cobre.
- A licao antiga de sonda lambda (`rascunho: true`) ocupa o numero 5. Mandei ele
  so renumerar ela pro fim e nao te encher com isso agora.
