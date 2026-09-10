# O motor real por tras dos 27 componentes

Este documento responde tres perguntas:

1. **Que motor de verdade tem os 27 componentes juntos?** (nao adianta pegar peca de carro diferente)
2. **Qual carro real usa cada um dos 27, do jeito que a Aula 4 explica?**
3. **Que fotos e prompts usar no Astra** para remodelar tudo.

> Sobre os links: os de Wikipedia sao ponto de partida conceitual. O que realmente
> serve para achar foto e peca sao os **codigos VAG (G.., N.., J..)** e os **codigos Bosch**,
> porque sao exatamente os termos que os catalogos e os foruns usam.
> Onde eu nao tenho certeza do numero exato da peca, eu escrevo "confirmar".

---

## 1. Veredito rapido

O conjunto dos 27 **nao e um motor generico**. Ele e a assinatura de uma familia
muito especifica e bem rara:

> **Injecao direta de gasolina com queima pobre estratificada (lean burn), Euro 4,
> com catalisador acumulador de NOx.**

O que denuncia isso e a combinacao de tres numeros:

- **25** catalisador de NOx (so existe em motor que roda pobre)
- **24** sensor EGT antes dele (para gerenciar regeneracao e dessulfatacao)
- **22 + 26** banda larga LSU na frente e LSF atras (controle de lambda variavel, nao so lambda 1)

No mundo inteiro, **quatro familias** de motor a gasolina tiveram exatamente esse arranjo.

### Ranking dos candidatos

| Pos | Motor | Carros | Central | Bate quantos dos 27 |
|-----|-------|--------|---------|---------------------|
| 1 | **VW/Audi 2.0 FSI** (BLX, AXW, BLR, BVY) | Golf V GT, Jetta, Passat B6, Audi A3 8P, Skoda Octavia II, Seat Leon 1P — 2004 a 2008 | **Bosch MED 9.5.10** | **27 de 27** |
| 2 | **BMW N43B20** | 318i / 320i (E90/E91/E92), 116i / 118i / 120i (E81/E87), 520i (E60) — 2007 a 2011 | Siemens MSD80 / MSD81 | 26 de 27 |
| 3 | **BMW N53B30** (6 cilindros) | 325i, 330i, 523i, 530i (E90/E60/E70) — 2007 a 2011 | MSD80 / MSD81 | 26 de 27 |
| 4 | **Mercedes M271 DE18 ML CGI** | C 200 CGI (W203), CLK 200 CGI (C209) — 2003 a 2005 | Bosch ME/MED | 24 de 27 |
| 5 | Mitsubishi 4G93 GDI | Carisma GDI, Galant GDI — 1996 a 2003 | Mitsubishi | 20 de 27 (nao tem CAN nem banda larga) |

### A escolha: **VW/Audi 2.0 FSI, codigo de motor BLX ou AXW**

Motivos, em ordem de peso:

1. **A central e literalmente Motronic.** MED 9.5.10 e a Motronic de injecao direta da
   Bosch. O mapa da Aula 4 se chama `motronicMap` — entao o carro tem que ser Motronic,
   nao Siemens. Isso ja elimina o BMW.
2. **Tem os 27, sem excecao**, incluindo o par mais dificil de achar junto:
   catalisador acumulador de NOx (25) + sensor de NOx + EGT (24).
3. **E aspirado.** Nao tem turbo. Isso importa porque a cena da Aula 4 nao tem turbo:
   se escolhessemos um TFSI ou o Mercedes CGI turbo, faltaria uma peca grande no desenho.
4. **Coletor de admissao com dutos longos e MAP na tomada de vacuo**, exatamente como
   esta desenhado.
5. **Documentacao aberta.** E o motor mais fotografado e mais desmontado da internet
   nesse nicho. Vamos achar foto de tudo.

### O que vamos ter que mudar (a lista honesta)

Comparando a cena de hoje com o 2.0 FSI real:

| # | O que muda | Por que |
|---|-----------|---------|
| — | **Adicionar o coletor de admissao com as flaps de turbulencia** | O FSI tem uma aba (borboleta de carga, `N316`) em cada duto que fecha para criar tumbling na queima estratificada. Hoje nossos dutos sao tubos lisos. E a peca mais visivel que falta. |
| 19 | **Bobina virar 4 bobinas separadas** | O FSI e coil-on-plug, uma por cilindro. Hoje temos uma so, com cabo de alta. |
| 15 | **Injetor deitado, entrando pela lateral do cabecote** | No FSI o bico entra por baixo do duto de admissao, apontando para a bacia do pistao (wall-guided). Hoje o nosso esta em cima, vertical. |
| — | **Pistao com bacia (bowl)** | O pistao do FSI tem uma cava assimetrica que joga o combustivel para a vela. O nosso e de topo plano. |
| 10 | **Bomba de alta encostada no comando de admissao** | Ela e acionada por um ressalto de tres lobos no comando. Hoje ela flutua ao lado da galeria. |
| 12 | **EGR** | O 2.0 FSI tem EGR resfriada, com um trocador de calor. Hoje e so uma valvula. |
| 27 | **IBS** | O FSI normalmente **nao** tem IBS no polo negativo. Se a gente quiser manter o IBS na cena 27, o carro de referencia passa a ser o BMW N43 ou um VAG mais novo. Decisao sua. |
| 2 | **Caixa do filtro de ar** | A do Golf V e retangular grande, com o MAF encaixado na saida. A nossa e um cone. |

Tudo isso e coisa de remodelar, nao de refazer o conceito. O sistema eletrico,
os sensores e o escape estao corretos.

### Se voce preferir o BMW N43

Vale saber uma coisa que ele tem e que combina demais com a Aula 4:

> A Wikipedia registra que **o N43 nao foi vendido em paises com combustivel de alto teor
> de enxofre** — e por isso que ele nunca veio para o Brasil.

Isso e exatamente o que a cena 25 ensina sobre envenenamento por enxofre e dessulfatacao.
E o N43 tambem tem IBS de fabrica. So que a central nao e Motronic.

- [BMW N43 (Wikipedia)](https://en.wikipedia.org/wiki/BMW_N43)

---

## 2. Os 27, um por um

Colunas:
- **Peca real** — como ela se chama no carro
- **Codigo** — designacao VAG (o que voce digita no catalogo) e/ou Bosch
- **Onde fica** — para achar a foto certa

### Ar

**2. Medidor de massa de ar (MAF)** — `maf-sensor`
- Peca real: medidor de massa de ar de filme quente Bosch HFM 5
- Codigo: **G70** (VAG) / Bosch HFM5-4.7
- Onde fica: encaixado na saida da caixa do filtro de ar, antes da mangueira grossa
- Carro: Golf V 2.0 FSI. E a mesma peca do 1.6 FSI e de meio grupo VAG da epoca
- Link: [Mass flow sensor](https://en.wikipedia.org/wiki/Mass_flow_sensor)

**9. Corpo de borboleta motorizado (EGAS)** — `throttle-body`
- Peca real: unidade de comando da borboleta, com motor DC e dois potenciometros redundantes
- Codigo: **J338** (unidade) / **GX3** (o conjunto do angulo)
- Onde fica: entre a mangueira de ar e o coletor
- Detalhe importante do FSI: no modo estratificado a borboleta fica **quase toda aberta**,
  e o torque e controlado so pela quantidade de combustivel. Isso e o oposto de um motor comum
- Link: [Throttle position sensor](https://en.wikipedia.org/wiki/Throttle_position_sensor)

### Combustivel

**1. Canister** — `canister`
- Peca real: reservatorio de carvao ativado do sistema EVAP
- Codigo: confirmar o numero da peca no catalogo (busque "Aktivkohlebehalter Golf V")
- Onde fica: embaixo do carro, do lado do tanque, atras da roda traseira direita
- Carro: Golf V / Jetta. E uma caixa preta de plastico do tamanho de uma caixa de sapato

**8. Valvula de purga do canister** — `purge-valve`
- Peca real: valvula magnetica 1 para o reservatorio de carvao ativado
- Codigo: **N80**
- Onde fica: em cima do motor, presa perto do coletor, com duas mangueiras finas
- E uma pecinha preta cilindrica de uns 6 cm com conector de 2 pinos

**10. Bomba de alta pressao** — `hp-fuel-pump`
- Peca real: bomba de alta pressao de embolo unico, acionada pelo comando de admissao
- Codigo: bomba **HDP1** (Hochdruckpumpe) da Bosch / valvula reguladora **N276**
- Onde fica: parafusada na tampa de valvulas, no lado do comando de admissao, acionada
  por um ressalto de **tres lobos** (por isso ela pulsa tres vezes por volta do comando)
- Pressao: de 30 a 110 bar
- Link: [Gasoline direct injection](https://en.wikipedia.org/wiki/Gasoline_direct_injection)

**13. Sensor de pressao da galeria** — `rail-pressure-sensor`
- Peca real: sensor de pressao do combustivel
- Codigo: **G247**
- Onde fica: rosqueado direto na ponta da galeria de alta
- Cuidado: existe tambem o **G410** (baixa pressao) na linha do tanque. Sao dois sensores
  diferentes. O nosso e o G247

**14. Galeria de combustivel** — `fuel-rail-gdi`
- Peca real: galeria de alta pressao forjada em aco
- Onde fica: em cima dos bicos, atras do coletor
- Ela e grossa e macica, nada a ver com a galeria fina de um motor de injecao indireta.
  Trabalha a 110 bar

**15. Valvula de injecao** — `injector-gdi`
- Peca real: valvula de injecao de alta pressao, **solenoide** (nao piezo, no FSI)
- Codigo: **N30, N31, N32, N33** (cilindros 1 a 4) / Bosch HDEV 1.2
- Onde fica: entra pela lateral do cabecote, **por baixo do duto de admissao**, apontando
  para a bacia do pistao
- Se voce quer o piezo (mais fino, mais rapido), o carro muda para o BMW N43 ou o Mercedes CGI
- Link: [Fuel injection](https://en.wikipedia.org/wiki/Fuel_injection)

**18. Modulo de combustivel** — `fuel-pump-module`
- Peca real: unidade de alimentacao com boia, bomba eletrica e pre-filtro
- Codigo: bomba **G6** / medidor de nivel **G** / rele **J17**
- Onde fica: dentro do tanque, acessivel por uma tampa embaixo do banco traseiro
- No FSI ela e uma **bomba de baixa** e entrega so de 4 a 6 bar para a bomba de alta
- Link: [Fuel pump](https://en.wikipedia.org/wiki/Fuel_pump)

### Ignicao

**19. Bobina de ignicao** — `ignition-coil`
- Peca real: bobina de ignicao com estagio final integrado, uma por cilindro (coil-on-plug)
- Codigo: **N70, N127, N291, N292**
- Onde fica: enfiada direto na vela, sob a tampa plastica do motor
- Essa e a bobina "caneta" preta do grupo VAG, provavelmente a bobina mais copiada do mundo
- Link: [Ignition coil](https://en.wikipedia.org/wiki/Ignition_coil)

### Sensores

**11. Sensor de pressao do coletor (MAP)** — `map-sensor`
- Peca real: sensor de pressao do tubo de admissao
- Codigo: **G71** (normalmente integrado com o **G42**, temperatura do ar)
- Onde fica: rosqueado no plenum do coletor
- O FSI tem MAF **e** MAP ao mesmo tempo. Um confere o outro, e o MAP e essencial para
  calcular a taxa de EGR
- Link: [MAP sensor](https://en.wikipedia.org/wiki/MAP_sensor)

**16. Sensor de detonacao** — `knock-sensor`
- Peca real: sensor de detonacao piezoeletrico tipo arruela
- Codigo: **G61** (cilindros 1-2) e **G66** (cilindros 3-4)
- Onde fica: parafusado no bloco, do lado do escape, com torque exato de 20 Nm
- Link: [Engine knocking](https://en.wikipedia.org/wiki/Engine_knocking)

**17. Sensor de rotacao (CKP)** — `ckp-sensor`
- Peca real: transmissor de rotacao do motor, indutivo
- Codigo: **G28**
- Onde fica: no bloco, perto do volante, lendo a roda dentada de **60 menos 2 dentes**
- Link: [Crankshaft position sensor](https://en.wikipedia.org/wiki/Crankshaft_position_sensor)

**20. Sensor de fase (CMP)** — `cmp-sensor`
- Peca real: transmissor Hall
- Codigo: **G40**
- Onde fica: na tampa de valvulas, lendo a roda de fase do comando de admissao
- Link: [Camshaft](https://en.wikipedia.org/wiki/Camshaft)

**21. Sensor de temperatura do motor (ECT)** — `temp-sensor`
- Peca real: sensor de temperatura do liquido de arrefecimento, NTC
- Codigo: **G62** (o de saida do radiador e o **G83**, outro sensor)
- Onde fica: na flange de agua atras do cabecote, corpo verde ou preto com trava metalica

### Escape

**12. Valvula EGR** — `egr-valve`
- Peca real: valvula de recirculacao com trocador de calor (EGR resfriada)
- Codigo: valvula **N18** / potenciometro de posicao **G212**
- Onde fica: entre o coletor de escape e o de admissao, com um tubo grosso passando por cima
- No FSI a EGR nao serve so para NOx: ela ajuda a reduzir bombeamento no modo estratificado
- Link: [Exhaust gas recirculation](https://en.wikipedia.org/wiki/Exhaust_gas_recirculation)

**22. Sonda lambda pre-catalisador (LSU)** — `lambda-planar`
- Peca real: sonda lambda de banda larga planar, 5 ou 6 fios
- Codigo: **G39** / Bosch **LSU 4.9**
- Onde fica: rosqueada no coletor de escape, antes do pre-catalisador
- E ela que permite a queima pobre. Uma sonda de banda estreita nao consegue medir lambda 3
- Link: [Oxygen sensor](https://en.wikipedia.org/wiki/Oxygen_sensor)

**23. Pre-catalisador** — `catalytic-converter`
- Peca real: catalisador de tres vias colado no coletor
- Onde fica: encostado no cabecote, para esquentar rapido (light-off)
- Ele so funciona quando o motor esta em modo homogeneo (lambda 1). No modo pobre
  quem trabalha e o 25
- Link: [Catalytic converter](https://en.wikipedia.org/wiki/Catalytic_converter)

**24. Sensor de temperatura dos gases (EGT)** — `egt-sensor`
- Peca real: sensor de temperatura dos gases de escape
- Codigo: **G235**
- Onde fica: rosqueado no tubo, **antes** do catalisador de NOx
- Ele existe para proteger o acumulador de NOx: a regeneracao e a dessulfatacao acontecem
  em faixas de temperatura estreitas, e passar disso derrete o catalisador
- Observacao: no FSI ele e do tipo que a ECU le por resistencia. Nossa cena 24 usa PTC.
  **Confirmar** se a peca do BLX e PTC ou termopar antes de fechar o modelo
- Link: [EGT sensor](https://en.wikipedia.org/wiki/Exhaust_gas_temperature_gauge)

**25. Catalisador de NOx** — `nox-catalyst`
- Peca real: catalisador acumulador de NOx (NOx-Speicherkatalysator, ou LNT / Lean NOx Trap)
- Codigo: o sensor que trabalha junto e o **G295**, com modulo proprio **J583** na rede
- Onde fica: debaixo do carro, logo depois do pre-catalisador
- E a peca mais rara e mais cara do carro. E ela que morre quando o dono abastece
  com gasolina de alto enxofre
- Link: [NOx adsorber](https://en.wikipedia.org/wiki/NOx_adsorber)

**26. Sonda lambda pos-catalisador (LSF)** — `lambda-sensor`
- Peca real: sonda lambda de banda estreita, planar, 4 fios
- Codigo: **G130** / Bosch **LSF 4.2**
- Onde fica: rosqueada depois do catalisador
- Ela nao dosa mistura. Ela julga o catalisador e corrige o desvio da sonda da frente
- Link: [Oxygen sensor](https://en.wikipedia.org/wiki/Oxygen_sensor)

### Controle

**3. Controle eletronico (ECU)** — `ecu`
- Peca real: **Bosch MED 9.5.10**
- Codigo: **J623** (Motorsteuergerat)
- Onde fica: na caixa plastica na base do para-brisa, do lado do motorista
- Link: [Engine control unit](https://en.wikipedia.org/wiki/Engine_control_unit)

**4. Interface de diagnostico (OBD2)** — `obd-connector`
- Peca real: conector de 16 pinos SAE J1962
- Onde fica: debaixo do painel, do lado do motorista, atras de uma tampinha
- No VAG desse ano, os pinos 6 e 14 sao CAN alta e baixa; o pino 7 ainda tem K-line
  para alguns modulos velhos
- Link: [On-board diagnostics](https://en.wikipedia.org/wiki/On-board_diagnostics)

**5. Lampada do diagnostico (MIL)** — `mil-lamp`
- Peca real: luz de anomalia no painel de instrumentos
- Codigo: painel **J285**
- Detalhe: ela nao e ligada por fio direto da ECU. A ECU manda a mensagem pelo CAN e
  o painel acende. Exatamente como esta na cena
- Link: [Check engine light](https://en.wikipedia.org/wiki/Check_engine_light)

**6. Bloqueio de partida (imobilizador)** — `immobilizer-antenna`
- Peca real: bobina leitora em volta do cilindro da ignicao
- Codigo: **D** (comutador) / **J362** (modulo imobilizador, nesse ano ja dentro do painel)
- Onde fica: um anel plastico com fio, em volta do miolo da chave
- Link: [Immobiliser](https://en.wikipedia.org/wiki/Immobiliser)

**7. Rede CAN** — `can-bus`
- Peca real: par trancado laranja, com 120 ohm em cada ponta
- No VAG, o CAN de tracao (powertrain) e **laranja com preto** e **laranja com preto/branco**,
  roda a 500 kbit/s, e passa por uma **caixa de conexoes (Datenbus-Diagnose-Interface, J533)**
- Nossa cena mostra o par com os dois resistores. Correto
- Link: [CAN bus](https://en.wikipedia.org/wiki/CAN_bus)

**27. Bateria 12 V** — `battery`
- Peca real: bateria de chumbo acido, 6 celulas, 61 a 72 Ah
- Onde fica: no cofre do motor, do lado do motorista
- Sobre o **IBS** (nosso sensor no polo negativo): codigo **J367** no VAG.
  O 2.0 FSI de 2005 normalmente **nao tem**. Quem tem de fabrica na epoca e o BMW.
  Se quiser manter o IBS, mudamos a referencia para o BMW N43
- Links: [Automotive battery](https://en.wikipedia.org/wiki/Automotive_battery) ·
  [Alternator](https://en.wikipedia.org/wiki/Alternator_(automotive)) ·
  [Starter](https://en.wikipedia.org/wiki/Starter_(engine))

---

## 3. Fotos para o Astra

Nao consigo anexar foto de verdade aqui. O que da para fazer, e o que funciona melhor,
sao duas coisas:

1. **Termo de busca exato** para voce pegar foto real (Google Imagens / eBay / catalogos)
2. **Prompt em ingles** para gerar imagem, quando nao achar foto boa

### 3.1 Termos de busca para foto real

Cole isso direto no Google Imagens. Sao os termos que os catalogos alemaes usam,
por isso trazem foto de peca isolada, fundo branco, varios angulos.

```
02  06A906461L Luftmassenmesser Golf 5 2.0 FSI
09  06F133062 Drosselklappe FSI J338
03  Bosch MED 9.5.10 Steuergeraet 06F906056
01  Aktivkohlebehaelter Golf 5 Kraftstofffilter Tank
08  06E906517 Magnetventil N80 Aktivkohlebehaelter
10  Hochdruckpumpe 2.0 FSI BLX HDP1 Nockenwelle
13  03C906051 Kraftstoffdrucksensor G247 Rail
14  Kraftstoffverteilerrohr 2.0 FSI Hochdruck Rail
15  Hochdruck Einspritzventil HDEV Bosch 2.0 FSI N30
18  Kraftstofffoerdereinheit Golf 5 Tankgeber G6
19  Zuendspule 06E905115 VAG Stabzuendspule
11  Saugrohrdrucksensor G71 038906051
16  Klopfsensor 06A905377 G61 VAG
17  Kurbelwellensensor G28 06A906433
20  Hallgeber G40 Nockenwellensensor VAG
21  Kuehlmitteltemperatursensor G62 059919501A
12  AGR Ventil 2.0 FSI N18 Kuehler
22  Bosch LSU 4.9 Breitbandlambdasonde 5 polig
23  Vorkatalysator 2.0 FSI Kruemmer
24  Abgastemperatursensor G235 VAG
25  NOx Speicherkatalysator 2.0 FSI NOx Sensor G295
26  Bosch LSF 4.2 Lambdasonde 4 polig Nachkat
04  OBD2 Buchse 16 Pin J1962 Golf 5
05  Kombiinstrument Golf 5 MIL Motorkontrollleuchte
06  Wegfahrsperre Leseantenne Zuendschloss VAG
07  CAN Bus Antriebsstrang orange Golf 5 J533
27  Autobatterie 12V Schnittmodell 6 Zellen
```

Alem disso, dois termos que valem por cem fotos:

```
2.0 FSI BLX Motor Schnittmodell
Bosch MED 9.5.10 Systemuebersicht Blockschaltbild
```

O segundo traz o **diagrama de blocos oficial da Bosch** desse sistema. E literalmente
o mesmo desenho da Aula 4, feito pela fabrica. Vale ouro para conferir se erramos algo.

### 3.2 Prompts de imagem (ingles, um por componente)

Todos com o mesmo padrao no fim, para o Astra devolver algo modelavel:
fundo neutro, tres quartos, sem pessoa, sem carro em volta.

```
SUFIXO PADRAO (cole no fim de todos):
, isolated automotive part, studio product photo, neutral grey background,
three-quarter view, sharp detail, no text, no watermark, no hands, no car body
```

| # | Prompt |
|---|--------|
| 1 | black plastic activated carbon canister, rectangular box with three hose ports and a mounting bracket, underbody fuel vapour storage |
| 2 | hot film mass air flow meter, black plastic housing with a measuring tube and a 5 pin electrical connector, Bosch style |
| 3 | engine control unit, aluminium finned case with a large multi pin connector on the side, german ECU |
| 4 | 16 pin OBD2 diagnostic socket, black trapezoid connector with gold pins and a wiring pigtail |
| 5 | amber engine shaped warning lamp icon on a dark instrument cluster face, backlit |
| 6 | immobiliser reader coil, plastic ring antenna with a short two wire pigtail, fits around an ignition lock barrel |
| 7 | twisted pair automotive CAN bus harness, orange and orange black wires, with a 120 ohm terminating resistor at the end |
| 8 | small black cylindrical solenoid purge valve with two hose spigots and a two pin connector |
| 9 | electronic throttle body, aluminium bore with a butterfly plate, integrated DC motor housing and a six pin connector |
| 10 | single piston high pressure fuel pump for direct injection, polished aluminium body with a roller tappet at the base and a solenoid regulator on top |
| 11 | intake manifold absolute pressure sensor, small black plastic body with a pressure port and a four pin connector |
| 12 | exhaust gas recirculation valve with an integrated cooler, cast metal body with two flanges and an electric actuator |
| 13 | fuel rail pressure sensor, small stainless steel body with a hex nut and a three pin connector, high pressure type |
| 14 | forged steel high pressure fuel rail for gasoline direct injection, four injector cups, thick walls, one sensor port |
| 15 | high pressure gasoline direct injection solenoid injector, slim metal body, coloured o rings, two pin connector |
| 16 | piezoelectric knock sensor, donut shaped with a central bolt hole and a moulded cable |
| 17 | inductive crankshaft position sensor, black plastic body with a mounting ear and a three pin connector |
| 18 | in tank fuel pump module, plastic swirl pot with an electric pump, a float arm level sender and a top flange |
| 19 | pencil style coil on plug ignition coil with an integrated ignitor and a rubber spark plug boot |
| 20 | hall effect camshaft position sensor, compact black body with a flange and a three pin connector |
| 21 | coolant temperature sensor, green plastic body with a brass tip and a metal retaining clip |
| 22 | wideband planar lambda sensor, stainless steel hex body with a slotted protection tube and five wires |
| 23 | close coupled three way catalytic converter, stainless steel oval shell cut open to show the honeycomb ceramic monolith |
| 24 | exhaust gas temperature sensor, long thin stainless probe with a hex nut and a braided lead |
| 25 | NOx storage catalyst, large stainless steel underbody canister cut open showing the coated honeycomb, with a NOx sensor screwed into the inlet pipe |
| 26 | narrow band planar lambda sensor, stainless steel hex body with four wires and a black connector |
| 27 | 12 volt lead acid car battery cut in half showing six cells with lead plates and electrolyte, red positive post and black negative post |

### 3.3 Prompt do motor inteiro (para a Aula 5)

Esse e o que vale mais, porque e o que da coerencia ao conjunto:

```
cutaway technical illustration of a 2005 Volkswagen 2.0 FSI inline four cylinder
gasoline direct injection engine, transverse mounting, aluminium block,
DOHC 16 valve head, coil on plug ignition, high pressure fuel pump driven by the
intake camshaft, forged high pressure fuel rail with four side mounted injectors,
long runner plastic intake manifold with tumble flaps, close coupled catalytic
converter on the exhaust manifold, half of the engine shown in section to reveal
one piston with a bowl in the crown, connecting rod and crankshaft,
neutral grey background, engineering diagram style, no text, no watermark
```

---

## 4. Plano proposto

1. Voce confirma o carro base: **2.0 FSI (BLX/AXW)** ou **BMW N43**.
   A unica diferenca pratica para nos e o IBS da cena 27 e a marca da central.
2. Eu ajusto os textos das 27 cenas para citar o carro escolhido nos exemplos,
   com os codigos G.. e N.. reais. Isso muda a aula de "generica" para "de oficina".
3. Voce junta as fotos usando a secao 3.1.
4. Remodelamos as pecas que estao na tabela "o que vamos ter que mudar".
5. Aula 5: motor completo, com o coletor de tumble flaps, os quatro cilindros e o
   comando de valvulas de verdade.

---

## 5. Onde eu posso estar errado

Sendo direto, para voce nao comprar peca errada:

- **Tenho certeza**: o 2.0 FSI europeu Euro 4 tem catalisador acumulador de NOx,
  sensor de NOx, sensor EGT, LSU na frente, LSF atras, MAF e MAP juntos, EGR,
  bomba de alta no comando e sensor de pressao na galeria. A central e MED 9.5.10.
- **Tenho certeza**: os codigos G28, G39, G40, G61, G62, G70, G71, G130, G235, G247,
  G295, N18, N30 a N33, N80, N276, J623, J285, J533 sao as designacoes VAG corretas
  para essas funcoes.
- **Nao tenho certeza**: os numeros de peca de 11 digitos que aparecem nos termos de busca.
  Eles sao chute educado para a busca funcionar, **nao compre por eles**. Confirme no ETKA
  ou no catalogo pelo chassi.
- **Nao tenho certeza**: se o sensor EGT do BLX especificamente e PTC ou termopar.
  Isso importa porque a cena 24 ensina PTC. Vale confirmar antes de gravar a aula.
- **Nao tenho certeza**: se o Brasil recebeu o 2.0 FSI. O Passat B6 nacional/importado
  veio majoritariamente 2.0 TSI, que **nao** tem catalisador de NOx. Se a ideia e comprar
  peca aqui, isso e um problema real e a gente conversa.
