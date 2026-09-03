# Revisao dos 27 componentes do mapa Motronic

Passada componente por componente nas cenas de "Visualizar"
(`src/features/courses/lessons/scenes/partFocus.ts`) procurando tres coisas: legenda caindo dentro
de peca, peca feia ou irreal, e peca virada para o lado errado ou apontando para lugar nenhum.

## Como ler a tag

Cada componente recebe **uma tag so**, que responde: com o que essa peca trabalha?

- **GASES** - ar, vapor de combustivel ou gas de escape passa por dentro dela ou encosta nela
- **ELETRICIDADE** - o que passa por ela e corrente ou sinal
- **LIQUIDOS** - combustivel ou liquido de arrefecimento passa por dentro dela ou encosta nela
- **PIEZOELETRICA** - nao passa nada por dentro. O cristal e apertado e ele mesmo gera a tensao

Depois da tag vem o que ela faz de verdade. So aparece a linha que existe: se a peca nao mede nada,
nao tem linha de medir. Nao existe mais linha de "empurra: nada".

---

## 1. Canister

**Tag: trabalha com GASES**

- **Sistema**: combustivel (controle de emissao evaporativa)
- **O que faz**: guarda. Absorve o vapor de gasolina no carvao ativado e segura ate a ECU mandar limpar
- **Requer**: os tres bocais (tanque, ar livre e purga), carvao ativado seco, mangueiras sem dobra
- **Problema encontrado**: as mangueiras saiam pela lateral do corpo, mas no modelo os tres bocais
  ficam todos no TOPO; o tanque estava solto no ar
- **Situacao**: corrigido. Mangueiras saindo dos tres bocais de cima, tanque reposicionado e legenda
  nova explicando isso

## 2. Medidor de massa de ar (MAF)

**Tag: trabalha com GASES**

- **Sistema**: ar
- **O que faz**: mede a massa de ar em gramas por segundo, e tambem a temperatura do ar
- **Como**: mantem o fio quente numa temperatura fixa e mede a corrente gasta nisso
- **Requer**: alimentacao, terra, fio de sinal, e filtro de ar limpo antes dele
- **Problema encontrado**: legenda do corpo de borboleta caia por cima da propria peca
- **Situacao**: corrigido

## 3. Controle eletronico (ECU)

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: controle
- **O que faz**: le todos os sensores, calcula injecao, ponto e marcha lenta, e comanda os atuadores
- **Requer**: +12 V permanente, +12 V pos-chave, terras bons, e a rede CAN
- **Problema encontrado**: o fio de +12 V atravessava o corpo da ECU e a legenda da bateria ficava
  dentro da bateria
- **Situacao**: corrigido. Alimentacao contorna e entra pelo conector multivias, terra sai pelo outro
  lado, terminador de 120 ohm adicionado na CAN
- **Continua em aberto**: nada. O modelo ganhou conector multivias espelhado tambem no lado -X, com
  os mesmos 40 pinos, entao o chicote pode chegar pelos dois lados

## 4. Interface de diagnostico (OBD2)

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: controle
- **O que faz**: e a porta de entrada da rede para o scanner. Nao decide nada, so da acesso
- **Requer**: pino 16 com +12 V permanente, pinos 4 e 5 de terra, pinos 6 e 14 de CAN
- **Problema encontrado**: barramento desenhado como fios soltos, sem terminadores
- **Situacao**: corrigido. Barramento horizontal real, com as duas caixas terminadoras nas pontas e
  derivacoes que encostam na face de cada modulo

## 5. Lampada do diagnostico (MIL)

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: controle
- **O que faz**: acende quando a ECU grava uma falha que afeta emissoes
- **Problema encontrado**: o fio da rede comecava dentro do corpo da ECU
- **Situacao**: corrigido. Sai da face inferior

## 6. Bloqueio de partida (imobilizador)

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: controle
- **O que faz**: le o codigo do transponder dentro da chave e libera ou bloqueia a injecao e a ignicao
- **Problema encontrado**: mesmo caso do fio nascendo dentro da ECU
- **Situacao**: corrigido

## 7. Rede CAN

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: controle
- **O que faz**: transporta as mensagens entre os modulos, em par trancado com sinal diferencial
- **Requer**: dois resistores de 120 ohm, um em cada ponta
- **Problema encontrado**: os fios eram desenhados atravessando o proprio corpo do barramento
- **Situacao**: corrigido. Dois trechos separados, um de cada lado, e derivacoes terminando
  exatamente na face de cada modulo

## 8. Valvula de purga do canister

**Tag: trabalha com GASES**

- **Sistema**: combustivel
- **O que faz**: abre e fecha em PWM comandada pela ECU, liberando o vapor guardado no canister
- **Detalhe**: ela nao sopra nada. Quem puxa o vapor para a admissao e o vacuo do motor
- **Problema encontrado**: a mangueira saia da lateral do canister, onde nao existe bocal
- **Situacao**: corrigido. Sai do bocal de cima e desce ate o niple da valvula

## 9. Corpo de borboleta motorizado (EGAS)

**Tag: trabalha com GASES**

- **Sistema**: ar
- **O que faz**: restringe a passagem de ar. Um motor eletrico posiciona a borboleta, nao existe
  cabo de acelerador
- **Mede**: a posicao da propria borboleta, com dois TPS internos redundantes
- **Requer**: dois sinais de pedal, dois de posicao, alimentacao do motor
- **Problema encontrado**: o fio do pedal terminava no vazio, sem encostar na ECU
- **Situacao**: corrigido. Fios saem da borda do sensor de pedal e chegam na face da ECU

## 10. Bomba de alta pressao

**Tag: trabalha com LIQUIDOS**

- **Sistema**: combustivel
- **O que faz**: comprime o combustivel de 5 bar para 100 a 350 bar. Um pistao movido por um came
  do comando faz o trabalho
- **Requer**: came do comando embaixo do tucho, linha de baixa pressao na entrada, valvula dosadora
- **Problema encontrado**: o comando de valvulas estava desenhado ACIMA da bomba, mas no modelo o
  tucho fica embaixo, entao a bomba nao era acionada por nada
- **Situacao**: corrigido. Comando movido para baixo, linha de baixa entrando na dosadora do lado -X
  e a de alta saindo do lado +X

## 11. Sensor de pressao do coletor (MAP)

**Tag: trabalha com GASES**

- **Sistema**: sensores
- **O que faz**: mede a pressao absoluta do coletor, em bar ou kPa
- **Como**: um diafragma de silicio deforma e muda a resistencia da ponte
- **Problema encontrado**: legenda dentro do corpo de borboleta e duto interrompido
- **Situacao**: corrigido

## 12. Valvula EGR

**Tag: trabalha com GASES**

- **Sistema**: escape
- **O que faz**: abre e fecha a passagem que devolve gas de escape para a admissao, para baixar a
  temperatura de queima e o NOx
- **Problema encontrado**: o tubo de escape atravessava o coletor e o gas entrava pelo lado errado
  da valvula
- **Situacao**: corrigido. Gas entra pela flange de baixo, sai pelo bocal frontal (+Z) e sobe para a
  admissao; tubo de escape encurtado

## 13. Sensor de pressao da galeria

**Tag: trabalha com LIQUIDOS**

- **Sistema**: sensores
- **O que faz**: mede a pressao real do combustivel na flauta de alta e fecha a malha da valvula
  dosadora da bomba
- **Problema encontrado**: estava FLUTUANDO ao lado da flauta em vez de rosqueado nela, e havia um
  cano orfao ligando nada a nada
- **Situacao**: corrigido. Sensor assentado no topo da flauta, cano removido

## 14. Galeria de combustivel (flauta)

**Tag: trabalha com LIQUIDOS**

- **Sistema**: combustivel
- **O que faz**: guarda e distribui. E um acumulador que amortece o pulso de cada injecao
- **Problema encontrado**: sensor solto ao lado e cano vertical sem destino
- **Situacao**: corrigido. Sensor montado sobre a flauta

## 15. Valvula de injecao (injetor GDI)

**Tag: trabalha com LIQUIDOS**

- **Sistema**: combustivel
- **O que faz**: pulveriza o combustivel direto dentro da camara, contra a pressao da compressao.
  Um solenoide ou cristal piezo abre a agulha por milissegundos
- **Problema encontrado**: a ponta do injetor nao entrava na camara desenhada, o jato nascia do ar
- **Situacao**: corrigido. Camara reposicionada em volta da ponta, jato saindo do bico

## 16. Sensor de detonacao

**Tag: PIEZOELETRICA**

- **Sistema**: sensores
- **O que faz**: le a vibracao do bloco na faixa de 5 a 15 kHz e avisa a ECU para atrasar o ponto
- **Detalhe**: ele nao recebe alimentacao e nao tem nada passando por dentro. O cristal e apertado
  pela vibracao e GERA a tensao sozinho. Por isso a tag dele nao e eletricidade: a eletricidade e o
  resultado, nao a materia prima
- **Requer**: torque exato de aperto e contato direto com o bloco, sem arruela extra
- **Problema encontrado**: estava flutuando meia unidade ACIMA do bloco, o que contradiz o proprio
  texto sobre aperto e contato. Depois, na checagem contra foto de peca real, o cabo terminava no ar:
  o modelo nao tinha o conector de 2 vias na ponta
- **Situacao**: corrigido. Assentado no bloco, cabo blindado roteado ate a ECU, e agora com pescoco
  de borracha na saida do cabo, conector de 2 vias com trava e os dois pinos a mostra: e neles que se
  mede a resistencia do cristal

## 17. Sensor de rotacao (CKP)

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: sensores
- **O que faz**: le a rotacao e a posicao angular do virabrequim. E o sinal mestre: sem ele nao ha
  injecao nem faisca
- **Requer**: roda dentada de 60 menos 2 dentes e folga de 0,5 a 1,5 mm
- **Problema encontrado**: o MODELO 3D do sensor trazia uma roda dentada de 20 dentes embutida, o
  que duplicava a roda 60-2 da cena e contrariava o texto. Alem disso, sensor e roda estavam a 1,4
  unidade de distancia enquanto a legenda falava em folga de milimetros
- **Situacao**: corrigido. Roda removida do modelo em `partModels.tsx`, sensor colocado a um fio da
  borda da roda

## 18. Modulo de combustivel

**Tag: trabalha com LIQUIDOS**

- **Sistema**: combustivel
- **O que faz**: leva o combustivel do tanque ate o motor, com cerca de 5 bar na injecao direta.
  Bomba, filtro, boia e copo antirefluxo no mesmo conjunto
- **Mede**: o nivel do tanque, pela boia com potenciometro
- **Requer**: rele comandado pela ECU, e a ECU so mantem o rele ligado com sinal de CKP
- **Problema encontrado**: mangueira e fio saiam de pontos que nao existem no modelo, e a legenda do
  tanque batia na tampa
- **Situacao**: corrigido. Saidas alinhadas com os bocais reais, fio de +12 V chegando no conector
  de cima

## 19. Bobina de ignicao

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: ignicao
- **O que faz**: transforma os 12 V em 15 a 30 mil volts. Carrega o campo magnetico durante o dwell
  e gera a alta tensao no CORTE do terra, nao na ligacao
- **Requer**: +12 V, terra de potencia e o comando da ECU
- **Problema encontrado**: existia uma caixa desenhada de "Vela" POR CIMA da vela que ja vem no
  proprio modelo da bobina, e a bobina nao alcancava o cilindro, entao a faisca acontecia no ar
- **Situacao**: corrigido. Vela duplicada removida, cilindro centralizado embaixo da bobina e faisca
  no eletrodo certo

## 20. Sensor de fase (CMP)

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: sensores
- **O que faz**: le em que fase o motor esta, e o angulo real do comando variavel. E o que permite
  injecao sequencial
- **Problema encontrado**: o sensor estava a mais de uma unidade e meia do comando, ou seja, nao lia
  nada, e o comando estava desenhado minusculo
- **Situacao**: corrigido. Comando ampliado, sensor logo acima dele, e o par CKP mais roda igualmente
  aproximado embaixo

## 21. Sensor de temperatura do motor (ECT)

**Tag: trabalha com LIQUIDOS**

- **Sistema**: sensores
- **O que faz**: mede a temperatura do liquido de arrefecimento
- **Como**: e um NTC. Quanto mais quente, MENOR a resistencia
- **Problema encontrado**: a ponta ficava ACIMA da galeria de agua, fora do liquido, e o fio nascia
  fora do conector
- **Situacao**: corrigido. Ponta imersa na galeria, fio saindo do conector real

## 22. Sonda lambda pre-catalisador (LSU, banda larga)

**Tag: trabalha com GASES**

- **Sistema**: escape
- **O que faz**: mede o valor exato de lambda, numa faixa ampla, com celula de bombeamento de
  oxigenio e aquecedor controlado
- **Problema encontrado**: estava com `rot Math.PI`, ou seja, DE CABECA PARA BAIXO, com a ponta
  virada para cima e fora do tubo; e o catalisador estava EM PE num tubo horizontal
- **Situacao**: corrigido. Rotacoes removidas, ponta dentro do fluxo, catalisador deitado no eixo do
  escape

## 23. Pre-catalisador

**Tag: trabalha com GASES**

- **Sistema**: escape
- **O que faz**: acelera as reacoes que transformam CO, HC e NOx em CO2, agua e nitrogenio. Ele nao
  filtra nada
- **Requer**: mistura em volta de lambda 1 e temperatura acima de 250 a 300 graus
- **Problema encontrado**: catalisador em pe e as DUAS sondas invertidas, com a ponta para cima
- **Situacao**: corrigido. Catalisador deitado, sondas com a ponta dentro do tubo, tocos de tubulacao
  redundantes removidos

## 24. Sensor de temperatura dos gases (EGT)

**Tag: trabalha com GASES**

- **Sistema**: escape
- **O que faz**: mede a temperatura do gas de escape para proteger turbina, catalisador e filtro de
  particulas
- **Como**: PTC de platina. Quanto mais quente, MAIOR a resistencia
- **Problema encontrado**: invertido, com a ponta apontando para cima enquanto o texto dizia "a
  ponta fica dentro do fluxo"; catalisador em pe
- **Situacao**: corrigido, e a legenda do topo subida para nao ficar por cima do corpo do sensor

## 25. Catalisador de NOx

**Tag: trabalha com GASES**

- **Sistema**: escape
- **O que faz**: guarda o NOx enquanto o motor roda pobre e esvazia numa regeneracao rica de poucos
  segundos
- **Detalhe**: quem mede e o sensor de NOx logo depois dele
- **Problema encontrado**: catalisador de NOx e catalisador de tres vias os dois em pe, e o sensor
  de NOx invertido
- **Situacao**: corrigido. Os dois deitados no eixo do tubo e o sensor com a sonda no fluxo

## 26. Sonda lambda pos-catalisador (LSF, banda estreita)

**Tag: trabalha com GASES**

- **Sistema**: escape
- **O que faz**: mede o oxigenio que SOBROU no escape, em curva de degrau em torno de 0,45 V. Ela
  fiscaliza a eficiencia do catalisador, nao controla a mistura
- **Requer**: aquecedor comandado pela ECU e ar de referencia respirado pelo proprio cabo
- **Problema encontrado**: sonda pos-catalisador e sonda de banda larga invertidas, catalisador em
  pe, e tocos de tubulacao ligando o nada
- **Situacao**: corrigido

## 27. Bateria 12 V

**Tag: trabalha com ELETRICIDADE**

- **Sistema**: controle
- **O que faz**: converte energia quimica em eletrica. Entrega de 200 a 400 A no arranque e e a
  referencia de tensao de todo o sistema
- **Detalhe**: quem mede o estado dela e o sensor IBS no polo negativo
- **Requer**: terras limpos, e registro da troca no scanner quando existe IBS
- **Problema encontrado**: o sensor IBS estava desenhado EMBAIXO da bateria, quando ele fica agarrado
  no polo negativo em CIMA; o cabo positivo nascia dentro da caixa da bateria; duas legendas caiam
  por cima do IBS
- **Situacao**: corrigido. IBS no polo negativo, positivo saindo do polo, terra descendo do IBS ate
  o bloco e legendas reposicionadas

---

## Resumo pela tag

| Tag | Componentes |
| --- | --- |
| **GASES** | 1 canister, 2 MAF, 8 purga, 9 borboleta, 11 MAP, 12 EGR, 22 LSU, 23 pre-catalisador, 24 EGT, 25 catalisador de NOx, 26 LSF |
| **ELETRICIDADE** | 3 ECU, 4 OBD2, 5 MIL, 6 imobilizador, 7 CAN, 17 CKP, 19 bobina, 20 CMP, 27 bateria |
| **LIQUIDOS** | 10 bomba de alta, 13 pressao da galeria, 14 flauta, 15 injetor, 18 modulo de combustivel, 21 ECT |
| **PIEZOELETRICA** | 16 sensor de detonacao |

Dentro de cada tag, o papel:

| Papel | Componentes |
| --- | --- |
| Mede | 2, 9, 11, 13, 16, 17, 18, 20, 21, 22, 24, 26 |
| Atua quando a ECU manda | 8, 9, 10, 12, 15, 19 |
| Guarda ou transporta | 1, 4, 7, 14, 23, 25, 27 |
| Decide | 3 |
| Avisa | 5, 6 |

---

## Problemas: situacao final

1. **Conector unico na ECU.** RESOLVIDO. O modelo `Ecu` ganhou um conector multivias espelhado no
   lado -X, com os mesmos 40 pinos. Agora o chicote pode chegar por qualquer lado sem encostar em
   lateral lisa.
2. **Pecas simplificadas.** PARCIALMENTE RESOLVIDO. Todo corpo auxiliar (bloco, coletor, camara,
   caixa de fusiveis) ganhou contorno de aresta, entao a caixa deixou de parecer um bloco chapado e
   passou a ler como peca. Continua sendo geometria primitiva, nao desenho tecnico: trocar por malha
   real e uma decisao a parte, peca por peca.
3. **Pecas do catalogo fora do mapa.** NAO E DEFEITO. `iac-valve`, `fuel-rail`,
   `fuel-pressure-regulator`, `coil-pack`, `air-filter`, `vss-sensor`, `injector-tbi` e `tps-sensor`
   existem em `partModels.tsx` e ficaram de fora de proposito: este mapa e de injecao direta. Elas
   sao o material do segundo mapa, de injecao multiponto.
4. **Sem colisao automatica.** RESOLVIDO. `PartFocusView.tsx` agora tem o hook
   `useLabelOverlapCheck`, que so roda em dev: 1,4 s depois que a cena monta ele mede a caixa de
   cada corpo, mede a largura de cada legenda e avisa no console quando um texto cai dentro de um
   corpo ou sai do quadro. Quem mexer em escala ou posicao ve o aviso na hora, sem precisar abrir as
   27 cenas na mao.

---

## O que o detector encontrou

Ligar o detector do item 4 pagou na hora. Ele achou um defeito que estava em quase todas as cenas e
ninguem tinha visto:

- **Legenda de peca com coordenada relativa.** O `FocusPartNode` desenhava o texto DENTRO do grupo
  que ja tinha a posicao da peca. Resultado: o `labelAt`, que foi escrito em coordenada absoluta,
  virava deslocamento. A legenda ia parar em `posicao da peca + labelAt`, muitas vezes fora do
  quadro. Eram **25 legendas erradas em 20 cenas**. Corrigido tirando o texto de dentro do grupo de
  posicao.
- **19 legendas por cima de corpo.** Depois da correcao acima, sobraram 19 textos encostando em
  peca. Todos reposicionados: cenas 1, 2, 4, 5, 8, 9, 10, 11, 12, 14, 15, 16, 18, 19 e 27.

Estado atual: duas passadas seguidas nas 27 cenas, **zero aviso do detector e zero erro de
console**. `tsc`, `eslint` e `npm run build` passam limpos.

