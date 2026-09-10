# Componentes do EngineDataFlow

Duas listas:

1. **Mapa do sistema (Aula 4)** — os 27 numeros que aparecem no esquema 3D.
2. **Catalogo completo de pecas 3D** — as 57 pecas registradas em `PART_MODELS`.

> Qual motor de verdade tem esses 27 componentes juntos, qual peca real corresponde a
> cada numero e os prompts de foto para remodelar: [MOTOR-REAL.md](MOTOR-REAL.md)
>
> Manual de montagem 3D do carro completo (coordenadas em mm, materiais, escape e
> tanque em escala real, 3 modos de visualizacao):
> [ASTRA-BUILD-GOLF-V-2.0-FSI.md](ASTRA-BUILD-GOLF-V-2.0-FSI.md)

---

## 1. Mapa do sistema Motronic (Aula 4) — 27 componentes

Fonte: [src/features/courses/lessons/scenes/motronicMap.ts](src/features/courses/lessons/scenes/motronicMap.ts)

Legenda das colunas:
- **Grupo** — filtro da cena (ar, combustivel, ignicao, sensores, escape, controle)
- **Pos** — posicao no mundo 3D `[x, y, z]`
- **Chicote** — onde o fio termina: na ECU, no barramento CAN, ou nada (peca so mecanica)

| # | Nome | Grupo | partId | Pos | Escala | Chicote |
|---|------|-------|--------|-----|--------|---------|
| 1 | Canister | combustivel | `canister` | [-8.6, 5.0, 0] | 0.670 | — |
| 2 | Medidor de massa de ar (MAF) | ar | `maf-sensor` | [-7.7, 2.4, 0] | 0.340 | ECU |
| 3 | Controle eletronico (ECU) | controle | `ecu` | [-8.6, -1.8, 0] | 0.520 | — |
| 4 | Interface de diagnostico (OBD2) | controle | `obd-connector` | [-8.6, -4.2, 0] | 0.740 | **CAN** |
| 5 | Lampada do diagnostico (MIL) | controle | `mil-lamp` | [-5.6, -4.2, 0] | 0.575 | **CAN** |
| 6 | Bloqueio de partida (imobilizador) | controle | `immobilizer-antenna` | [-5.6, -1.8, 0] | 0.400 | **CAN** |
| 7 | Rede CAN | controle | `can-bus` | [-7.1, -0.6, -0.6] | 0.400 | e o proprio barramento |
| 8 | Valvula de purga do canister | combustivel | `purge-valve` | [-5.6, 5.0, 0] | 0.580 | ECU |
| 9 | Corpo de borboleta motorizado (EGAS) | ar | `throttle-body` | [-5.0, 2.4, 0] | 0.600 | ECU |
| 10 | Bomba de alta pressao | combustivel | `hp-fuel-pump` | [2.95, 3.3, 0.55] | 0.530 | ECU |
| 11 | Sensor de pressao do coletor (MAP) | sensores | `map-sensor` | [0.2, 5.0, -1.35] | 0.740 | ECU |
| 12 | Valvula EGR | escape | `egr-valve` | [3.9, 4.7, 0] | 0.710 | ECU |
| 13 | Sensor de pressao da galeria | sensores | `rail-pressure-sensor` | [-2.55, 2.0, 1.15] | 0.630 | ECU |
| 14 | Galeria de combustivel | combustivel | `fuel-rail-gdi` | [-1.2, 3.3, 1.15] | 0.420 | — |
| 15 | Valvula de injecao | combustivel | `injector-gdi` | [-1.2, 1.9, 1.15] | 0.510 | ECU |
| 16 | Sensor de detonacao | sensores | `knock-sensor` | [3.0, -2.1, 0.9] | 0.640 | ECU |
| 17 | Sensor de rotacao (CKP) | sensores | `ckp-sensor` | [-3.9, -3.0, 0.9] | 0.410 | ECU |
| 18 | Modulo de combustivel | combustivel | `fuel-pump-module` | [-2.8, -4.6, 0] | 0.520 | ECU |
| 19 | Bobina de ignicao | ignicao | `ignition-coil` | [0, 2.85, 0] | 0.385 | ECU |
| 20 | Sensor de fase (CMP) | sensores | `cmp-sensor` | [2.95, 1.5, 0.9] | 0.610 | ECU |
| 21 | Sensor de temperatura do motor (ECT) | sensores | `temp-sensor` | [-3.5, 0.5, 0.9] | 0.680 | ECU |
| 22 | Sonda lambda pre-catalisador (LSU) | escape | `lambda-planar` | [7.0, -0.6, 0] | 0.590 | ECU |
| 23 | Pre-catalisador | escape | `catalytic-converter` | [5.6, -2.0, 0] | 0.485 | — |
| 24 | Sensor de temperatura dos gases (EGT) | escape | `egt-sensor` | [7.0, -3.2, 0] | 0.330 | ECU |
| 25 | Catalisador de NOx | escape | `nox-catalyst` | [5.6, -4.4, 0] | 0.447 | — |
| 26 | Sonda lambda pos-catalisador (LSF) | escape | `lambda-sensor` | [7.0, -5.5, 0] | 0.530 | ECU |
| 27 | Bateria 12 V | controle | `battery` | [-8.6, 0.6, 0] | 0.575 | — |

### Contagem por grupo

| Grupo | Quantos | Numeros |
|-------|---------|---------|
| ar | 2 | 2, 9 |
| combustivel | 6 | 1, 8, 10, 14, 15, 18 |
| ignicao | 1 | 19 |
| sensores | 6 | 11, 13, 16, 17, 20, 21 |
| escape | 6 | 12, 22, 23, 24, 25, 26 |
| controle | 6 | 3, 4, 5, 6, 7, 27 |

### Elementos desenhados na cena que nao tem numero

Sao geometria de apoio, nao componentes clicaveis:

- Motor em corte: pistao, aneis, biela, virabrequim, pino, camisa do cilindro, carter
- Valvula de admissao (azul) e valvula de escape (laranja)
- Vela de ignicao (corpo, ceramica, eletrodo, faisca)
- Jato do injetor (cone de spray animado)
- Coletor de admissao (plenum) e os 4 dutos ate o cabecote
- Tomada de vacuo do MAP
- Cabo de alta da bobina ate a vela
- Entrada de ar (cone do filtro)
- Tubulacoes: ar, escape, purga, combustivel, alta pressao, EGR
- Tomadas das sondas e do EGT no tubo de escape
- Pes de fixacao do CKP, detonacao, CMP e ECT
- Chicote eletrico (fios em angulo reto saindo da ECU)
- Barramento CAN: par trancado com um resistor de 120 ohm em cada ponta
- Caixa do filtro de ar e snorkel de entrada, antes do MAF
- Tanque de combustivel translucido com o modulo da bomba dentro
- Respiro do tanque ate o canister e filtro de vent do canister para o ar livre
- Dois eixos comando girando na metade da rotacao, com ressaltos, roda de fase
  e o tucho que aciona a bomba de alta
- Tampa de valvulas translucida, com o poco onde a bobina senta na vela
- Roda dentada do virabrequim girando na frente do bloco
- Cabo +12 V da bateria, caixa de fusiveis, derivacao para a ECU e para o pino
  16 do OBD

---

## 1.1 Em que peca do carro real cada uma se encosta

Para cada um dos 27 numeros: onde ela e presa fisicamente, o que chega e sai
dela em mangueira/tubo, e o que chega nela em fio. Motor de referencia:
4 cilindros de injecao direta (MED-Motronic).

---

### 1. Canister

**Onde fica montado:** preso por cinta ou berco plastico na longarina traseira,
dentro da caixa de roda ou em cima do tanque. Nunca no vao do motor, porque o
carvao nao pode cozinhar.

**Se encosta direto em:**
- Tanque de combustivel — mangueira de respiro, passando pela valvula de
  seguranca de capotamento (rollover)
- Valvula de purga (8) — mangueira de saida dos vapores
- Ar livre — tubo de ventilacao (vent) com filtro de po; em carro com teste de
  vazamento EVAP, esse tubo vai para o modulo DMTL parafusado no proprio canister
- Carroceria — so a cinta de fixacao

**Fio:** nenhum. O canister e 100% mecanico.

---

### 2. Medidor de massa de ar (MAF)

**Onde fica montado:** encaixado no duto de ar, sempre DEPOIS do filtro de ar e
ANTES do corpo de borboleta. Preso por braçadeira ou por dois parafusos numa
flange, com anel de vedacao.

**Se encosta direto em:**
- Caixa do filtro de ar — de um lado
- Mangueira de admissao que vai ao corpo de borboleta (9) — do outro lado
- Em motor turbo, ele fica antes do compressor

**Fio (conector de 4 ou 5 vias):**
- +12 V do rele principal
- Terra
- Sinal de massa de ar para a ECU
- Sinal de temperatura do ar (o sensor IAT mora dentro do mesmo corpo)
- 5 V de referencia, nos modelos que usam

---

### 3. Controle eletronico (ECU)

**Onde fica montado:** caixa de aluminio ou plastico parafusada na parede
corta-fogo, no suporte da bateria ou dentro do habitaculo, atras do porta-luvas.

**Se encosta direto em:**
- Carroceria ou suporte de borracha — 3 ou 4 parafusos
- Um a tres conectores multivias (de 60 ate 154 pinos) que sao a ponta do chicote

**Fio, o que realmente passa por esses pinos:**
- +12 V permanente direto da bateria via fusivel (guarda os codigos e as adaptacoes)
- +12 V pos-chave, que acorda a central
- Saida de comando do rele principal (a ECU liga o proprio rele)
- Varios terras parafusados no bloco do motor e na carroceria
- 5 V de referencia distribuido para MAP, CMP, pedal, sensor de pressao do rail e TPS
- CAN H e CAN L
- Todos os sinais de sensor e todos os drivers de atuador (injetores, bobinas,
  borboleta, purga, EGR, rele da bomba)

---

### 4. Interface de diagnostico (OBD2)

**Onde fica montado:** sob o painel, lado do motorista, obrigatoriamente a menos
de 60 cm do volante e sem precisar de ferramenta para chegar nele.

**Se encosta direto em:**
- Estrutura do painel — clipe ou dois parafusos
- Chicote do habitaculo

**Fio (pinos que importam):**
- Pino 16 — +12 V permanente da bateria, com fusivel proprio
- Pino 4 — terra de chassi
- Pino 5 — terra de sinal
- Pino 6 — CAN H, o mesmo par que vai na ECU
- Pino 14 — CAN L
- Pinos 7 e 15 — linha K/L, so em carro antigo

---

### 5. Lampada do diagnostico (MIL)

**Onde fica montado:** e um LED ou lampada dentro do painel de instrumentos.
Nao existe como peca solta.

**Se encosta direto em:**
- Placa de circuito do painel de instrumentos

**Fio:**
- Em carro moderno **nao existe fio da ECU ate a lampada**. A ECU manda uma
  mensagem pela CAN, o painel recebe e acende. Por isso a luz nao acende se a
  rede cair.
- Em carro mais antigo e um fio so: +12 V pos-chave de um lado e a ECU aterrando
  o outro lado para acender

---

### 6. Bloqueio de partida (imobilizador)

**Onde fica montado:** o anel da antena fica encaixado em volta do cilindro da
ignicao, ou dentro da moldura do botao start.

**Se encosta direto em:**
- Comutador de ignicao — o anel abraca ele
- Chave/transponder — **sem contato nenhum**, o acoplamento e por campo
  magnetico, a antena ate energiza o chip da chave
- Modulo imobilizador ou painel de instrumentos — cabo curto

**Fio:**
- 2 fios de alimentacao da antena
- Linha de dados ate o modulo imobilizador ou o painel
- O modulo e que conversa com a ECU, por CAN ou por uma linha dedicada. Sem o
  codigo certo a ECU corta injecao e ignicao.

---

### 7. Rede CAN

**Onde fica montado:** nao tem carcaca. Sao dois fios trancados correndo dentro
do chicote, de ponta a ponta do carro.

**Se encosta direto em:**
- ECU do motor
- Painel de instrumentos
- Modulo do ABS
- Modulo do cambio automatico
- Modulo da carroceria (BCM)
- Modulo do airbag
- Pinos 6 e 14 do conector OBD2 (4)

**Detalhe que derruba carro:** existe um resistor de 120 ohm em cada ponta do
barramento, normalmente dentro da ECU do motor e dentro do painel (ou do ABS).
Medindo os pinos 6 e 14 com tudo desligado tem que dar ~60 ohm, que e os dois
em paralelo.

**Fio:** a CAN **e** o fio, nao e uma peca que recebe fio. Sao dois condutores
trancados, CAN H e CAN L, que passam de modulo em modulo. Cada modulo se pendura
no par por um pedaco curto de fio, entao nao existe um cabo da ECU ate a
lampada, ate o OBD ou ate o imobilizador: todos eles entram no mesmo par.

---

### 8. Valvula de purga do canister

**Onde fica montado:** presa por clipe num suporte do coletor de admissao ou na
propria tampa de valvulas.

**Se encosta direto em:**
- Canister (1) — mangueira de entrada
- Coletor de admissao — mangueira de saida, ligada num bico DEPOIS da borboleta,
  que e onde tem vacuo
- Em motor turbo tem duas saidas: uma no coletor (vacuo) e outra antes do
  compressor (para funcionar quando o motor esta em pressao positiva)

**Fio (2 vias):**
- +12 V do rele principal
- Comando PWM aterrado pela ECU

---

### 9. Corpo de borboleta motorizado (EGAS)

**Onde fica montado:** parafusado direto na flange de entrada do coletor de
admissao, com junta ou anel de vedacao.

**Se encosta direto em:**
- Coletor de admissao — flange parafusada
- Mangueira de admissao que vem do MAF (2) — do outro lado
- Mangueira do respiro do carter (PCV)
- Bico da mangueira de purga (8), em muitos modelos
- Mangueiras de agua quente do arrefecimento, em carro de clima frio, para nao
  congelar a borboleta

**Fio (conector de 6 vias):**
- 2 fios do motor DC que move a borboleta (comando em ponte H dentro da ECU)
- 5 V de referencia
- Terra
- Sinal do TPS pista 1
- Sinal do TPS pista 2 (redundante, sempre discordando da pista 1 de proposito)

---

### 10. Bomba de alta pressao

**Onde fica montado:** parafusada direto no cabecote. O tucho dela apoia num
ressalto extra do eixo comando (normalmente de 3 ou 4 lobulos). E o motor que
gira ela.

**Se encosta direto em:**
- Cabecote — flange parafusada
- Eixo comando de valvulas — contato mecanico direto, tucho no ressalto
- Modulo de combustivel (18) — linha de baixa pressao chegando, a ~5 bar
- Galeria (14) — tubo rigido de aco saindo, a 150-200 bar
- Amortecedor de pulsacao, montado no proprio corpo

**Fio (2 vias):**
- Valvula reguladora de volume (MSV/DRV), comandada em PWM pela ECU. E ela que
  decide quanto combustivel entra no ciclo de bombeamento.

---

### 11. Sensor de pressao do coletor (MAP)

**Onde fica montado:** parafusado direto no plenum do coletor de admissao, com
anel de vedacao, ou ligado nele por uma mangueira curta de vacuo.

**Se encosta direto em:**
- Coletor de admissao (plenum) — atraves de um furo calibrado, para o sensor
  nao ler cada pulso de admissao
- Em motor turbo existe um segundo sensor (TMAP) depois do intercooler

**Fio (4 vias):**
- 5 V de referencia
- Terra
- Sinal de pressao (0,5 a 4,5 V)
- Sinal de temperatura do ar, quando e TMAP

---

### 12. Valvula EGR

**Onde fica montado:** parafusada entre o escape e a admissao, com junta
metalica nos dois lados.

**Se encosta direto em:**
- Coletor de escape, ou um tubo rigido que sai dele
- Coletor de admissao, no lado de baixa pressao
- Resfriador de EGR, quando existe — e esse resfriador entra no circuito de
  agua do motor

**Fio (5 ou 6 vias):**
- 2 fios do motor DC (ou do solenoide, nas mais simples)
- 5 V de referencia
- Terra
- Sinal do sensor de posicao interno

---

### 13. Sensor de pressao da galeria

**Onde fica montado:** rosqueado direto no corpo da galeria (14).

**Se encosta direto em:**
- Galeria de combustivel (14) — rosca com vedacao conica metal-metal, **sem anel
  de borracha**. Borracha nao aguenta 200 bar.

**Fio (3 vias):**
- 5 V de referencia
- Terra
- Sinal 0,5 a 4,5 V

---

### 14. Galeria de combustivel (rail de injecao direta)

**Onde fica montado:** parafusada em dois ou tres suportes forjados no cabecote.

**Se encosta direto em:**
- Cabecote — parafusos dos suportes
- Bomba de alta pressao (10) — tubo de aco de parede grossa entrando
- Injetores (15) — os copos de saida, um por cilindro
- Sensor de pressao (13) — rosca na ponta
- Valvula limitadora de pressao, em alguns sistemas

**Fio:** nenhum. A galeria e so um tubo forjado.

---

### 15. Valvula de injecao (injetor de injecao direta)

**Onde fica montado:** e a peca que fica presa em DOIS lugares ao mesmo tempo —
por isso ela nunca fica solta no ar.

**Se encosta direto em:**
- **Galeria (14)** — o espigao de cima entra no copo da galeria, com vedacao
  conica, e um garfo/clipe metalico trava os dois
- **Cabecote** — o corpo do injetor entra num furo usinado do cabecote e e
  apertado por um grampo ou uma braçadeira parafusada
- **Camara de combustao** — a ponta atravessa o cabecote e fica dentro da camara,
  ao lado das valvulas de admissao, apontando para a vela
- Anel de teflon na ponta, vedando a pressao da combustao, e um anel de apoio
  (arruela de suporte termico) por baixo

**Fio (2 vias):**
- O comando NAO e 12 V comum: a ECU tem um driver de alta tensao que joga de
  60 a 90 V na abertura e depois segura com corrente baixa

---

### 16. Sensor de detonacao

**Onde fica montado:** parafusado direto na parede lateral do bloco, entre os
cilindros, porque e por ali que a vibracao da batida de pino viaja melhor.

**Se encosta direto em:**
- Bloco do motor — um unico parafuso, com torque exato (~20 Nm) e **sem
  arruela**. Arruela, tinta ou sujeira entre o sensor e o bloco matam o sinal.
- Motor de 4 cilindros normalmente tem 1; V6 e V8 tem 2, um por banco

**Fio (2 vias):**
- Cabo blindado, com a malha aterrada **so do lado da ECU**. Aterrar dos dois
  lados cria loop de terra e a ECU passa a ver detonacao que nao existe.

---

### 17. Sensor de rotacao (CKP)

**Onde fica montado:** parafusado no bloco, na tampa da distribuicao ou na
carcaca do cambio, sempre apontando para a roda fonica.

**Se encosta direto em:**
- Bloco ou tampa — 1 parafuso
- **Roda fonica 60-2**, que pode estar em tres lugares: na polia do virabrequim,
  no volante do motor ou numa roda interna presa ao virabrequim
- Entreferro (a folga entre a ponta do sensor e o dente) de 0,5 a 1,5 mm — esse
  numero e o que faz o sinal existir ou nao

**Fio:**
- 2 vias se for indutivo: ele gera a propria tensao, nao precisa de alimentacao
- 3 vias se for Hall: alimentacao, terra e sinal quadrado

---

### 18. Modulo de combustivel

**Onde fica montado:** enfiado dentro do tanque, com a flange parafusada ou
rosqueada na tampa superior do tanque, com um anel de vedacao grande.

**Se encosta direto em:**
- Tanque de combustivel — flange e anel
- Combustivel liquido — a bomba fica submersa de proposito, e o proprio
  combustivel que refrigera o motor eletrico dela
- Bomba de alta pressao (10) — linha de saida
- Canister (1) — linha de vapor do respiro
- Dentro do modulo, encostando um no outro: cuba, pre-filtro (peneira), bomba,
  boia de nivel e, nos sistemas com retorno, o regulador de pressao

**Fio (conector na flange):**
- +12 V vindo do rele da bomba
- Terra
- 2 fios da boia de nivel, que vao para o painel (nao para a ECU)

---

### 19. Bobina de ignicao

**Onde fica montado:** enfiada no poco da vela, na tampa de valvulas, presa por
um unico parafuso.

**Se encosta direto em:**
- Tampa de valvulas / cabecote — parafuso de fixacao
- **Vela de ignicao** — a saia de borracha abraca o isolador da vela e uma mola
  interna faz o contato eletrico de alta com o terminal da vela. E o unico
  caminho da alta tensao.
- Poco da vela — a saia tambem veda contra agua e oleo entrando ali

**Fio primario (3 ou 4 vias):**
- +12 V do rele principal
- Terra de potencia
- Sinal de comando da ECU (o driver do transistor de saida)
- Em algumas, um quarto fio de retorno de diagnostico

---

### 20. Sensor de fase (CMP)

**Onde fica montado:** parafusado na tampa do cabecote ou na tampa da
distribuicao.

**Se encosta direto em:**
- Cabecote ou tampa da distribuicao — 1 parafuso
- **Roda de fase do eixo comando** — uma aba, um pino ou uma roda dentada presa
  no comando de admissao (ou de escape). Como o comando gira na metade da
  rotacao do virabrequim, e ele que diz em qual das duas voltas o motor esta.

**Fio (3 vias, efeito Hall):**
- Alimentacao (5 V ou 12 V, depende do modelo)
- Terra
- Sinal

---

### 21. Sensor de temperatura do motor (ECT)

**Onde fica montado:** rosqueado na galeria de agua do cabecote ou na carcaca do
termostato, com a ponta mergulhada no liquido.

**Se encosta direto em:**
- Cabecote ou carcaca do termostato — rosca com anel de vedacao
- **Liquido de arrefecimento** — contato direto, e por isso que ele so le certo
  com o sistema cheio e sem ar

**Fio:**
- 2 vias no basico: a ECU manda 5 V por um resistor interno e mede a queda
- 4 vias em muitos carros, porque o mesmo corpo leva um segundo elemento que
  alimenta o ponteiro de temperatura do painel

---

### 22. Sonda lambda pre-catalisador (banda larga, LSU)

**Onde fica montado:** rosqueada num bung soldado no coletor de escape ou logo
na saida dele, no downpipe. Sempre ANTES do catalisador.

**Se encosta direto em:**
- Coletor de escape ou downpipe — rosca M18, com pasta antitravante na rosca
  (nunca no elemento)
- **Gases de escape** — a ponta ceramica fica no meio do fluxo
- Ar ambiente — pelo proprio corpo/cabo, que e a referencia de oxigenio

**Fio (5 ou 6 vias):**
- 2 fios do aquecedor: +12 V e o comando aterrado em PWM pela ECU
- Celula de Nernst (sinal)
- Celula de bombeamento (corrente Ip)
- Terra virtual
- **Resistor de calibracao dentro do proprio conector** — por isso nao se pode
  trocar o conector nem usar sonda universal aqui

---

### 23. Pre-catalisador

**Onde fica montado:** logo depois do coletor de escape, soldado ou flangeado no
downpipe, o mais perto possivel do motor para acender rapido.

**Se encosta direto em:**
- Coletor de escape / downpipe — flange com junta ou solda
- Tubo intermediario do escape, do outro lado
- Carroceria — coxins de borracha do escape
- **Bung da sonda pre-cat (22)** antes dele e **bung da sonda pos-cat (26)**
  depois dele

**Fio:** nenhum.

---

### 24. Sensor de temperatura dos gases (EGT)

**Onde fica montado:** rosqueado num bung do escape, antes da turbina ou antes
do catalisador, com a haste comprida entrando no meio do fluxo.

**Se encosta direto em:**
- Tubo de escape ou carcaca da turbina — rosca
- Gases de escape — a ponta fica exposta a 900 graus ou mais

**Fio (2 vias):**
- Termopar ou termistor PT200, com cabo de fibra resistente a calor. O sinal e
  em milivolts, entao o menor mau contato ja derruba a leitura.

---

### 25. Catalisador de NOx

**Onde fica montado:** na linha de escape, depois do pre-catalisador, ja embaixo
do carro.

**Se encosta direto em:**
- Tubo de escape — flange nos dois lados
- Carroceria — coxins de borracha
- **Bung da sonda pos-catalisador (26)** e, quando existe, o bung do sensor de
  NOx

**Fio:** nenhum no proprio catalisador. Quem tem fio e o sensor de NOx, que tem
modulo proprio falando CAN com a ECU.

---

### 26. Sonda lambda pos-catalisador (banda estreita, LSF)

**Onde fica montado:** rosqueada num bung depois do catalisador.

**Se encosta direto em:**
- Tubo de escape depois do catalisador — rosca M18
- Gases ja tratados

**Fio (4 vias):**
- 2 do aquecedor
- Sinal (0,1 a 0,9 V)
- Terra de sinal

**Papel dela:** a ECU nao usa essa sonda para dosar combustivel. Ela compara o
sinal de cima (22) com o de baixo (26) para julgar se o catalisador ainda esta
guardando oxigenio, e faz uma correcao lenta na sonda de cima.

---

### 27. Bateria 12 V

**Onde fica montado:** presa por garra numa bandeja, no vao do motor, embaixo do
banco ou no porta-malas.

**Se encosta direto em:**
- Bandeja e garra de fixacao — carroceria
- **Terminal positivo:** cabo grosso ate o motor de partida e ate a caixa de
  fusiveis / distribuidor de energia. O alternador tambem chega aqui, direto ou
  pela caixa.
- **Terminal negativo:** cabo curto ate a carroceria e uma cordoalha separada
  ate o bloco do motor. Se essa cordoalha estiver ruim, a corrente de partida
  procura outro caminho e queima cabo de sensor.
- **Sensor IBS** parafusado no proprio terminal negativo, nos carros com
  Stop&Start
- ECU (3) — dois caminhos: um +12 V permanente com fusivel e um +12 V pos-chave

**Fio:** a bateria nao tem conector de sinal, so os dois terminais de forca. Tudo
que e eletrico no carro nasce nela: positivo -> distribuidor de energia ->
fusivel -> rele principal -> alimentacao da ECU, dos sensores e dos atuadores.
O unico fio fino que chega nela e o do IBS, e ele fala com a ECU por LIN.

---

## 2. Catalogo completo de pecas 3D — 57 pecas

Fonte: [src/engine3d/parts/partModels.tsx](src/engine3d/parts/partModels.tsx)

**GLB** = tem modelo importado em `/public/models/parts/`; quando nao tem, usa so o modelo procedural.

### Sensores e atuadores basicos (Aulas 1-2)

| # | partId | Nome | Sistema | GLB |
|---|--------|------|---------|-----|
| 1 | `injector` | Injetor de combustivel | Alimentacao | sim |
| 2 | `ignition-coil` | Bobina + vela de ignicao | Ignicao | sim |
| 3 | `throttle-body` | Corpo de borboleta | Admissao | sim |
| 4 | `map-sensor` | Sensor de pressao (MAP) | Sensores | sim |
| 5 | `temp-sensor` | Sensor de temperatura (IAT/ECT) | Sensores | sim |
| 6 | `lambda-sensor` | Sonda lambda banda estreita (4 fios) | Sensores | sim |
| 7 | `knock-sensor` | Sensor de detonacao (knock) | Sensores | sim |
| 8 | `ckp-sensor` | Sensor de rotacao (CKP) | Sensores | sim |
| 9 | `tps-sensor` | Sensor de borboleta (TPS) | Sensores | sim |
| 10 | `ecu` | ECU (central eletronica) | Controle | sim |
| 11 | `fuel-pump` | Bomba de combustivel | Alimentacao | sim |
| 12 | `cooling-fan` | Eletroventilador | Arrefecimento | sim |

### Motor mecanico (Aula 3)

| # | partId | Nome | Sistema | GLB |
|---|--------|------|---------|-----|
| 13 | `crankshaft` | Virabrequim | Motor / conjunto movel | sim |
| 14 | `connecting-rod` | Biela | Motor / conjunto movel | sim |
| 15 | `piston` | Pistao | Motor / conjunto movel | sim |
| 16 | `cylinder-liner` | Cilindro / camisa | Motor / bloco | sim |
| 17 | `cylinder-head` | Cabecote | Motor / bloco | sim |
| 18 | `intake-valve` | Valvula de admissao | Motor / distribuicao | sim |
| 19 | `exhaust-valve` | Valvula de escape | Motor / distribuicao | sim |
| 20 | `camshaft` | Comando de valvulas | Motor / distribuicao | sim |
| 21 | `intake-system` | Coletor de admissao | Motor / admissao | sim |
| 22 | `exhaust-system` | Coletor de escape | Motor / escape | sim |
| 23 | `crankcase` | Carter | Motor / bloco | sim |

### Injecao eletronica (Aula 4)

| # | partId | Nome | Sistema | GLB |
|---|--------|------|---------|-----|
| 24 | `maf-sensor` | Medidor de massa de ar (MAF) | Injecao / admissao | sim |
| 25 | `iac-valve` | Valvula de marcha lenta (IAC) | Injecao / admissao | sim |
| 26 | `fuel-rail` | Tubo distribuidor (rail) | Injecao / combustivel | sim |
| 27 | `fuel-pressure-regulator` | Regulador de pressao | Injecao / combustivel | sim |
| 28 | `injector-gdi` | Injetor de injecao direta | Injecao / combustivel | sim |
| 29 | `app-sensor` | Sensor do pedal (APP) | Injecao / sensores | sim |
| 30 | `coil-pack` | Bobina dupla (faisca perdida) | Injecao / ignicao | sim |
| 31 | `air-filter` | Filtro de ar | Injecao / admissao | sim |
| 32 | `fuel-pump-module` | Conjunto da bomba (no tanque) | Injecao / combustivel | sim |
| 33 | `vss-sensor` | Sensor de velocidade (VSS) | Injecao / sensores | sim |
| 34 | `fuel-rail-flexstart` | Rail com aquecedor (flex start) | Injecao / combustivel | sim |
| 35 | `fuel-rail-gdi` | Rail de injecao direta | Injecao / combustivel | sim |
| 36 | `rail-pressure-sensor` | Sensor de alta pressao | Injecao / sensores | sim |
| 37 | `injector-piezo` | Injetor piezoeletrico | Injecao / combustivel | sim |
| 38 | `injector-tbi` | Monoponto (TBI) | Injecao / combustivel | sim |
| 39 | `ibs-sensor` | Sensor de bateria (IBS) | Injecao / sensores | sim |
| 40 | `nox-sensor` | Sensor de NOx | Injecao / escape | sim |
| 41 | `lambda-planar` | Sonda planar em corte (base da banda larga) | Injecao / escape | sim |
| 42 | `injector-cutaway` | Injetor em corte | Injecao / combustivel | sim |
| 43 | `cmp-sensor` | Sensor de fase (CMP) | Sensores | sim |
| 44 | `egt-sensor` | Sensor de temperatura dos gases (EGT) | Injecao / escape | sim |
| 45 | `catalytic-converter` | Catalisador de tres vias | Injecao / escape | sim |
| 46 | `nox-catalyst` | Catalisador de NOx | Injecao / escape | sim |
| 47 | `egr-valve` | Valvula EGR | Injecao / escape | sim |
| 48 | `canister` | Canister | Alimentacao | sim |
| 49 | `purge-valve` | Valvula de purga do canister | Alimentacao | sim |
| 50 | `hp-fuel-pump` | Bomba de alta pressao | Injecao / combustivel | sim |
| 51 | `obd-connector` | Conector de diagnostico (OBD2) | Controle | sim |
| 52 | `can-bus` | Rede CAN (par trancado) | Controle | **nao** |
| 53 | `mil-lamp` | Luz espia de anomalia (MIL) | Controle | **nao** |
| 54 | `immobilizer-antenna` | Imobilizador (antena + transponder) | Controle | **nao** |
| 55 | `battery` | Bateria 12 V | Controle | **nao** |
| 56 | `trigger-wheel` | Roda fonica 60-2 | Injecao / sensores | **nao** |

> Observacao: `PART_MODELS` tem 57 entradas e `PART_GLB` tem 51. As 6 sem GLB (`can-bus`, `mil-lamp`, `immobilizer-antenna`, `battery`, `trigger-wheel`) rodam so com a geometria procedural — o que e proposital, porque sao pecas simples ou abstratas (a rede CAN nem e peca, e barramento).

---

## 3. Conceito de cada peca

### Sensores e atuadores basicos

- **`injector`** — Pulveriza o combustivel no ar admitido, dosado pela ECU, formando a mistura.
- **`ignition-coil`** — Eleva a tensao (coil-on-plug) e a vela solta a faisca que inflama a mistura.
- **`throttle-body`** — Controla quanto ar entra no motor (aceleracao eletronica).
- **`map-sensor`** — Mede a pressao/vacuo no coletor de admissao para calcular a carga do motor.
- **`temp-sensor`** — Le a temperatura do ar admitido e/ou do liquido de arrefecimento.
- **`lambda-sensor`** — Tipo dedal. Gera a propria tensao: 900 mV rica, 450 mV lambda=1, 100 mV pobre. So diz o LADO da mistura, nao o quanto.
- **`knock-sensor`** — Detecta a batida de pino (detonacao) para a ECU atrasar o ponto.
- **`ckp-sensor`** — Le a roda dentada do virabrequim: rotacao (RPM) e posicao dos pistoes.
- **`tps-sensor`** — Informa a abertura da borboleta (o quanto o acelerador foi pedido).
- **`ecu`** — O cerebro: le os sensores e comanda injecao, ignicao e marcha-lenta.
- **`fuel-pump`** — Manda o combustivel do tanque pressurizado ate os injetores.
- **`cooling-fan`** — Puxa ar pelo radiador quando o motor esquenta (arrefecimento a agua).

### Motor mecanico

- **`crankshaft`** — Converte o sobe-e-desce do pistao em rotacao; leva munhoes, moente, contrapesos e volante.
- **`connecting-rod`** — Liga o pistao ao moente do virabrequim, variando de angulo o tempo todo.
- **`piston`** — Recebe a pressao da explosao e sobe/desce na camisa; leva aneis e pino.
- **`cylinder-liner`** — O tubo onde o pistao desliza, com aletas de refrigeracao e prisioneiros.
- **`cylinder-head`** — Fecha o cilindro por cima; forma a camara de combustao e abriga valvulas e vela.
- **`intake-valve`** — Abre para deixar a mistura entrar; fecha na compressao e na combustao.
- **`exhaust-valve`** — Abre para expulsar os gases queimados no tempo de escape.
- **`camshaft`** — Gira na metade da rotacao e abre cada valvula na hora certa (os ressaltos).
- **`intake-system`** — Filtro de ar + corpo de borboleta + cano ate a valvula de admissao.
- **`exhaust-system`** — Cano da valvula de escape ate o silencioso e a ponteira.
- **`crankcase`** — A caixa onde o virabrequim gira (mancais) e onde fica o oleo (bacia).

### Injecao eletronica

- **`maf-sensor`** — Mede a massa de ar por fio ou filme quente: mais ar passa, mais calor leva embora.
- **`iac-valve`** — Desvio de ar ao redor da borboleta fechada; o embolo conico dosa a marcha lenta.
- **`fuel-rail`** — Acumulador que alimenta os bicos: o volume evita oscilacao de pressao a cada pulso.
- **`fuel-pressure-regulator`** — Ligado ao vacuo do coletor, mantem a pressao constante SOBRE o bico e devolve o excesso.
- **`injector-gdi`** — Injeta dentro da camara a 50-200 bar; permite carga estratificada e ate 2 injecoes por ciclo.
- **`app-sensor`** — Dois canais redundantes: uma pista costuma dar o dobro da tensao da outra.
- **`coil-pack`** — Uma bobina para dois cilindros: uma vela solta faisca util e a outra no escape.
- **`air-filter`** — Papel de microfibra impregnado com resina e plissado para multiplicar a area filtrante.
- **`fuel-pump-module`** — Cuba, pre-filtro, bomba e boia de nivel: o combustivel refrigera a propria bomba.
- **`vss-sensor`** — Conta pulsos na caixa de cambio; e o que autoriza o corte de combustivel no freio-motor.
- **`fuel-rail-flexstart`** — Aquece o etanol antes da partida a frio, dispensando o tanquinho de gasolina.
- **`fuel-rail-gdi`** — Tubo forjado de parede grossa para 150-200 bar, com vedacao conica metal-metal.
- **`rail-pressure-sensor`** — Piezoeletrico no rail: fecha a malha de controle da bomba de alta pressao.
- **`injector-piezo`** — Pilha de cristais que se alonga com 100-200 V: abre 5x mais rapido, ate 5 injecoes por ciclo.
- **`injector-tbi`** — Um unico bico acima da borboleta, a ~1,1 bar, molhando o coletor inteiro.
- **`ibs-sensor`** — No polo negativo, mede tensao, corrente e temperatura para o Stop&Start e a carga.
- **`nox-sensor`** — Depois do catalisador, mede NOx em ppm; tem modulo proprio falando CAN com a ECU.
- **`lambda-planar`** — Laminas finas: aquece em ~10 s contra 1 min da dedal. Duas celulas (Nernst e bombeamento) separadas pela camara de difusao formam a banda larga.
- **`injector-cutaway`** — Corte longitudinal: microfiltro e aneis sao o kit de reparo; microfiltro e disco de furos sao o que entope e pede limpeza.
- **`cmp-sensor`** — Le a roda do comando por efeito Hall e diz em qual VOLTA o motor esta: sem ele a ECU nao sabe separar admissao de escape.
- **`egt-sensor`** — Sonda longa dentro do escape. Protege catalisador e turbina contra superaquecimento e habilita a regeneracao do catalisador de NOx.
- **`catalytic-converter`** — Oxida CO e HC e reduz NOx ao mesmo tempo, mas so dentro da janela estreita em volta de lambda = 1. Por isso a sonda existe.
- **`nox-catalyst`** — Acumulador usado na injecao direta estratificada, que roda pobre: armazena NOx e depois queima o estoque num pulso rico.
- **`egr-valve`** — Devolve parte dos gases de escape para a admissao. Baixa a temperatura da queima e derruba a formacao de NOx.
- **`canister`** — Caixa de carvao ativado que prende os vapores do tanque em vez de solta-los na atmosfera.
- **`purge-valve`** — A ECU abre em PWM para o motor aspirar os vapores guardados no canister e queima-los. Se trava aberta, bagunca a marcha lenta.
- **`hp-fuel-pump`** — Acionada por um came, eleva a pressao de ~5 bar para dezenas ou centenas de bar. E ela que define a injecao DIRETA.
- **`obd-connector`** — Tomada de 16 vias padronizada: por ela o scanner conversa com a ECU pelas linhas CAN e le codigos e parametros.
- **`can-bus`** — Nao e peca, e barramento: dois fios trancados (CAN H e CAN L) com um resistor de 120 ohm em cada ponta.
- **`mil-lamp`** — A lampada do painel. Acesa fixa e falha detectada; piscando e falha de combustao que pode destruir o catalisador.
- **`immobilizer-antenna`** — Antena em volta do comutador le o chip da chave. Sem o codigo certo a ECU bloqueia injecao e ignicao.
- **`trigger-wheel`** — A falha de dois dentes da a referencia angular absoluta do virabrequim.
- **`battery`** — Fonte de tudo. Em repouso 12,4 a 12,7 V; com o motor ligado o alternador segura 13,8 a 14,4 V. Tensao baixa faz sensor mentir e a ECU errar.
