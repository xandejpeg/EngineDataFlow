# Manual de construcao 3D — Volkswagen Golf V 2.0 FSI (BLX), 2005

**Para quem ler isso (Astra ou qualquer modelador):**
este documento e uma especificacao de montagem. Ele diz **o que** construir, **onde**
colocar (coordenada em milimetro), **que tamanho**, **que material** e **que foto usar
de referencia**. Siga a ordem da secao 15.

> **LEIA AS SECOES 11 E 12 ANTES DE COMECAR A MODELAR.**
> As secoes 1 a 10 descrevem um motor **parado**. As secoes 11 e 12 descrevem o motor
> **funcionando**, e e ai que este projeto ganha sentido. A Aula 5 nao e um motor bonito:
> e o motor da **Aula 3** (ordem de ignicao 1-3-4-2, os quatro tempos simultaneos)
> rodando com os **27 componentes da Aula 4** todos trabalhando juntos, no tempo certo.
> Se voce modelar tudo e o motor nao girar sincronizado, a aula nao existe.

Alvo do briefing, ainda nao validado como uma configuracao completa: **VW Golf V
(Typ 1K, plataforma PQ35), motor 2.0 FSI codigo BLX, ano 2005, central Bosch
MED 9.5.10, cambio manual 6 marchas 02Q.** A aplicacao conjunta de motor,
central, cambio e tracao precisa de documentacao especifica. A cena atual usa
AXW como referencia de motor; isso nao confirma a configuracao BLX do alvo.

> As coordenadas e formas deste briefing sao provisoes de modelagem, nao cotas
> de reparacao Volkswagen. Nao usar para afirmar fidelidade dimensional.
> O SSP 321, pp. 7 e 13, documenta agregado dianteiro de aluminio em tres partes
> com seis fixacoes e agregado traseiro FWD de aco fixado diretamente a carroceria.
> A geometria abaixo ainda precisa ser reconciliada com essa arquitetura.

Dados do briefing, com aplicacao a versao ainda por conferir:
- Entre eixos **2578 mm**, comprimento **4204 mm**, largura **1759 mm**, altura **1470 mm**
- Motor 2.0 FSI: codigos AXW / BLR / BLX / BVY / BVX, 4 cilindros em linha, **1984 cc**
- Golf GT: freio dianteiro **312 mm ventilado**, traseiro **286 mm solido**,
  roda **7Jx17** com pneu **225/45 R17**, **saida de escape dupla**

### Auditoria de aplicacao - 2026-09-08

Consulta a reproducoes do manual de oficina em arquivo independente, nao a um
catalogo Volkswagen atualizado por VIN:

| Item | Evidencia consultada | Limite de aplicacao |
|------|----------------------|---------------------|
| BLX | Fabricacao desde 05.2004; 1984 cm3; 110 kW a 6000 rpm; 200 Nm a 3500 rpm; diametro 82.5 mm; curso 92.8 mm; compressao 11.5:1 | A tabela do motor nao identifica cambio, tracao, mercado ou codigos PR do carro |
| Gerenciamento BLX | Motronic MED 9.5; mistura homogenea/estratificada; EGR; catalisador acumulador de NOx | A tabela nao especifica o sufixo 9.5.10; nao transferir automaticamente detalhes do AXW |
| Golf 4Motion 2005, 2.0 l 110 kW | Manual de seis marchas 02S; HJM fabricado de 08.2004 a 05.2006; diferencial 64:15; flange de semieixo 100 mm | A tabela nao identifica o codigo BLX. HJM e candidato documental, nao configuracao escolhida |
| 02Q 4Motion | A tabela consultada lista diesel e 3.2 l; nao lista 2.0 l 110 kW | O 02Q do briefing nao esta confirmado para o alvo; nao modelar essa associacao |
| Freios | Alocacao por codigo PR na etiqueta do veiculo e catalogo ETKA | Discos 312/286 e rodas 17 do briefing nao estao confirmados para o alvo |

Fontes consultadas:
- [Manual, dados dos motores 2.0 de injecao direta](https://workshop-manuals.com/volkswagen/golf-mk5/power_unit/4-cylinder_injection_engine_%282.0_l_engine_direct_injection%29/technical_data/engine_data/)
- [Manual, alocacao 02S no Golf 4Motion 2005](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s_four-wheel_drive/technical_data/gearbox_identification/identification_codes_assembly_allocation_capacities_golf_4_motion_2005_%3F/)
- [Manual, alocacao 02Q no Golf 4Motion 2005](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02q/technical_data/four-wheel_drive_gearbox_identification/four-wheel_drive_identification_codes_assembly_allocation_and_capacities_golf_4_motion_2005_%3F/)
- [Manual, identificacao dos freios por PR](https://workshop-manuals.com/volkswagen/golf-mk5/brake_systems/technical_data/brake_allocation_via_pr_no./)

Ainda faltam: aplicacao conjunta BLX/cambio/tracao, codigos PR e cotas de
carroceria/suspensao. A cena FWD atual nao foi convertida para 4Motion por essa
pesquisa. Nao combinar a estrutura FWD com transmissao integral sem revisar
agregado traseiro, diferencial, carda, tanque e escape.

### Referencias estaticas de suspensao

O manual define a altura de referencia como a distancia entre o centro do cubo
e a borda da caixa de roda, na posicao normal sem carga. Nao e altura livre do
solo, raio do pneu ou coordenada de um ponto de fixacao.

| Conjunto | PR | Altura dianteira / traseira (mm) | Cambagem dianteira | Caster dianteiro |
|----------|----|---------------------------------|-------------------|------------------|
| Padrao | 2UA | 382 / 380, tolerancia +/-10 | -30 minutos +/-30 | 7 graus 34 minutos +/-30 minutos |
| Reforcado | 2UB | 402 / 400, tolerancia +/-10 | -14 minutos +/-30 | 7 graus 17 minutos +/-30 minutos |
| Esportivo, exceto rodas 18 | 2UC | 367 / 365, tolerancia +/-10 | -41 minutos +/-30 | 7 graus 47 minutos +/-30 minutos |

Para esses tres conjuntos: cambagem traseira -1 grau 20 minutos +/-30 minutos;
convergencia total dianteira +10 +/-10 minutos; traseira +10 +/-12.5 minutos.
Diferenca maxima de cambagem entre lados: 30 minutos; caster dianteiro tambem
limitado a 30 minutos entre lados. Convergencia positiva significa fechamento.
Convergencia total e a soma dos dois lados, nao o valor de uma roda.

Implementado em `golfAlignment.ts`: referencias separadas, selecao explicita e
avaliacao de medidas fornecidas, com estados ausente, invalido, dentro e fora
da tolerancia. Nao ha selecao automatica de PR, leitura da cena ou aprovacao
completa de alinhamento. Divergencia em curva e angulo de impulso nao sao
avaliados. A geometria e a dinamica da suspensao continuam provisórias.

Fontes:
- [Manual, especificacoes de alinhamento](https://workshop-manuals.com/volkswagen/golf-mk5/running_gear_axles_steering/wheels_tyres._axle_align/wheel_alignment/wheel_alignment_specifications_golf/)
- [Manual, definicao da altura normal sem carga](https://workshop-manuals.com/volkswagen/golf-mk5/running_gear_axles_steering/front_suspension_drive_shafts/repairing_front_suspension/raising_wheel_suspension_to_unladen_position_golf/)

Integracao dimensional: o modo Estrutura oferece o painel "Medidas do modelo".
O contorno externo e os cubos compartilham os dados de `golfVehicleGeometry.ts`
com o renderizador da carroceria. O topo nominal do recorte externo fica em
Y=674 mm e os cubos em Y=317.15 mm: diferenca vertical de 356.85 mm nas quatro
rodas. Nao confundir com a caixa interna estrutural de raio 370 mm.
O acabamento arredondado da borda e a deformacao do pneu nao entram nessa
medida. Sao marcos do modelo estatico, nao leitura metrologica do carro real
nem amostragem das malhas animadas em coordenadas mundiais.

A referencia inicia vazia; selecionar 2UA, 2UB ou 2UC (exceto 18 polegadas)
altera somente a comparacao. Angulos permanecem nao medidos. O conjunto
padrao reprova as quatro alturas nominais; o esportivo aceita somente as
duas traseiras. Esses resultados parciais nao aprovam a suspensao nem
confirmam o PR do veiculo. Nenhuma peca foi deslocada para obter aprovacao.

Marcadores implementados: "Cotas no 3D" exibe os quatro cubos (esferas) e
quatro recortes externos (blocos), com selecao por clique ou pelo seletor de
roda. Somente a roda selecionada recebe linhas auxiliares, cota vertical e
rotulo. As anotacoes ficam sobrepostas a geometria e nao representam pecas.
Sao ocultadas fora do modo Estrutura. Os pontos e medidas nao sao alterados
pela selecao, pela referencia PR nem pela visibilidade dos agregados.

Proxima etapa: enquadramento de inspecao por roda, para examinar os dois
marcos e a cota em maior escala, preservando a vista geral como retorno.
As coordenadas de reparacao da carroceria e a configuracao do carro continuam
pendentes; esta instrumentacao nao substitui a modelagem fiel da suspensao.

---

## 1. Sistema de coordenadas

**Tudo em milimetro. Uma unidade de mundo = 1 mm.** (Se o motor 3D usar metro,
escale o conjunto por 0.001 no final, nunca no meio.)

**Origem (0,0,0): centro do eixo dianteiro, no chao.**

| Eixo | Direcao | Sinal positivo |
|------|---------|----------------|
| **X** | transversal | para a **direita** do carro (visto de dentro, olhando pra frente) |
| **Y** | vertical | para **cima**. Y=0 e o chao |
| **Z** | longitudinal | para **tras** do carro |

Marcos globais que voce vai usar o tempo todo:

| Marco | Coordenada |
|-------|-----------|
| Eixo dianteiro | Z = 0 |
| Eixo traseiro | Z = +2578 |
| Para-choque dianteiro (ponta) | Z = -875 |
| Para-choque traseiro (ponta) | Z = +3329 |
| Radiador (face) | Z = -780 |
| **Parede de fogo (firewall)** | Z = +420 |
| Centro da linha de centro do virabrequim | Z = -70, Y = 415 |
| Lateral esquerda da carroceria | X = -880 |
| Lateral direita da carroceria | X = +880 |
| Centro do cubo da roda dianteira | X = +-767, Y = 317.15 nominal sem carga, Z = 0 |
| Centro do cubo da roda traseira | X = +-757, Y = 317.15 nominal sem carga, Z = +2578 |
| Piso do assoalho (por baixo) | Y = 250 |
| Teto | Y = 1470 |
| Raio nominal sem carga (225/45 R17) | 317.15 mm (diametro 634.3); nao e raio carregado ou de rolamento |

Diametro nominal calculado: `17 * 25.4 + 2 * 225 * 0.45 = 634.3 mm`.
A medida 225/45 R17 permanece uma escolha do briefing, nao uma aplicacao
confirmada para o BLX alvo. Altura real dos cubos depende da carga e do pneu.

**Regra de ouro:** o motor e **transversal**, o **cambio fica na esquerda** (X negativo),
a **admissao aponta para a frente** (Z negativo) e o **escape aponta para tras**
(Z positivo, contra o firewall).

---

## 2. Os tres modos

O modelo tem que ser construido **uma vez so**, com hierarquia limpa, e os modos
sao so mudanca de visibilidade e material. Nao duplique geometria.

### MODO A — Carro completo
Carroceria opaca, pintura vermelha Tornado, vidros escuros, rodas montadas.
E o carro fechado como ele e na rua. Tudo interno existe, mas esta escondido.

### MODO B — Carroceria fantasma (o modo principal da aula)
A carroceria vira vidro: `opacity 0.10`, `depthWrite false`, wireframe fino nas
arestas. Tudo que esta dentro aparece: motor, cambio, escape inteiro ate a ponta,
tanque, linha de combustivel, chicote eletrico, bateria, ECU.
**Este e o modo que mostra a coisa mais importante da aula: a distancia real
entre a bomba la atras e o bico la na frente.**

### MODO C — Powertrain isolado, com o motor em corte
Some a carroceria e a suspensao. Fica so: motor, cambio, coletores, escape completo,
tanque, linhas e chicote, flutuando no vazio. O motor fica **cortado ao meio no plano
Z = -70** (o plano do virabrequim), mostrando um pistao com a bacia, biela, virabrequim,
valvulas e a vela.

> Nota de honestidade: voce pediu tres modos e citou dois explicitamente
> (chassi completo e veiculo por dentro). O terceiro acima e minha proposta.
> Se voce quiser outro no lugar, troca.

---

## 3. Biblioteca de materiais

Defina uma vez, reutilize em tudo. Nome exato entre crases.

| Nome | Cor base | Metalness | Roughness | Onde usa |
|------|----------|-----------|-----------|----------|
| `FERRO_FUNDIDO` | #4a4a48 | 0.6 | 0.75 | bloco do motor, coletor de escape |
| `ALUMINIO_BRUTO` | #b4b8bd | 0.9 | 0.45 | cabecote, carter, caixa de cambio |
| `ALUMINIO_POLIDO` | #d8dce0 | 1.0 | 0.18 | galeria de alta, corpo de borboleta |
| `ACO` | #8b8f94 | 1.0 | 0.35 | virabrequim, bielas, parafusos |
| `ACO_INOX` | #c3c7cb | 1.0 | 0.28 | tubo de escape, corpo das sondas |
| `INOX_QUEIMADO` | #6b5a4a | 0.85 | 0.55 | coletor de escape e pre-cat (azulado/amarelado pelo calor) |
| `PLASTICO_PRETO` | #23262b | 0.05 | 0.65 | coletor de admissao, tampa do motor, caixa de ar |
| `PLASTICO_CINZA` | #5a5f66 | 0.05 | 0.6 | conectores |
| `PLASTICO_PRETO_FOSCO` | #16181c | 0.0 | 0.9 | carenagens, para-choque por dentro |
| `BORRACHA` | #1a1a1c | 0.0 | 0.95 | mangueiras, coxins, pneus, vedacoes |
| `COBRE` | #b87333 | 1.0 | 0.3 | enrolamento do alternador e do motor de partida |
| `LATAO` | #c9a227 | 1.0 | 0.3 | terminais, polo positivo |
| `CERAMICA` | #e8e2d5 | 0.0 | 0.8 | colmeia do catalisador, isolador da vela |
| `VIDRO` | #aaccdd | 0.0 | 0.05 | para-brisa, vidros (opacity 0.25) |
| `PINTURA` | #c8102e | 0.35 | 0.35 | carroceria (Tornado Red) |
| `FIO_VERMELHO` | #cc2222 | 0.0 | 0.7 | positivo permanente |
| `FIO_PRETO` | #101010 | 0.0 | 0.7 | negativo / terra |
| `FIO_LARANJA` | #e07000 | 0.0 | 0.7 | rede CAN |
| `FIO_SINAL` | #2a7fd4 | 0.0 | 0.7 | sinais de sensor |
| `COMBUSTIVEL` | #d9a441 | 0.0 | 0.25 | gasolina no tanque (opacity 0.5) |
| `LIQUIDO_ARREF` | #3ea05a | 0.0 | 0.25 | agua do motor |

---

## 4. Carroceria e chassi

Construir como casca fina (5 mm de espessura), sem interior detalhado do habitaculo
alem do painel e dos bancos.

### 4.1 Estrutura

| Peca | Posicao (centro) | Tamanho / forma | Material |
|------|------------------|-----------------|----------|
| Assoalho | X 0, Y 250, Z +1200 | chapa 1500 x 5 x 3400, com tunel central de 200 de largura x 120 de altura | `ACO` |
| Longarina dianteira esq | X -400, Y 400, Z -500 | caixao 90 x 110 x 900 | `ACO` |
| Longarina dianteira dir | X +400, Y 400, Z -500 | igual | `ACO` |
| Parede de fogo | X 0, Y 750, Z +420 | chapa 1450 x 700 x 5, levemente curva | `ACO` |
| Caixa de agua (plenum) | X 0, Y 930, Z +460 | canaleta 1400 x 140 x 120, aberta pra cima, tampa plastica | `ACO` + `PLASTICO_PRETO` |
| Torre do amortecedor esq | X -560, Y 800, Z -160 | cone truncado, base D 260, topo D 150, altura 400 | `ACO` |
| Torre do amortecedor dir | X +560, Y 800, Z -160 | igual | `ACO` |
| Painel frontal (crash bar) | X 0, Y 560, Z -820 | 1300 x 120 x 60 | `ACO` |
| Coluna A esq / dir | X +-700, Y 1150, Z +560 | perfil 80 x 60, inclinado 30 graus | `ACO` |
| Coluna B esq / dir | X +-720, Y 1050, Z +1500 | perfil 90 x 60, vertical | `ACO` |
| Coluna C esq / dir | X +-700, Y 1150, Z +2350 | perfil 90 x 60, inclinado | `ACO` |
| Teto | X 0, Y 1465, Z +1450 | 1300 x 5 x 2000, abaulado 40 mm no centro | `PINTURA` |
| Capo | X 0, Y 990, Z -450 | 1400 x 6 x 800, inclinado 8 graus | `PINTURA` |
| Para-brisa | X 0, Y 1180, Z +620 | 1350 x 900 x 6, inclinado 62 graus | `VIDRO` |
| Para-choque dianteiro | X 0, Y 500, Z -840 | 1740 x 500 x 90 curvo | `PINTURA` |
| Para-choque traseiro | X 0, Y 520, Z +3290 | 1740 x 520 x 90 curvo | `PINTURA` |
| Portas (4) | esq/dir, Y 850 | 1050 x 900 x 60 | `PINTURA` |
| Paralamas (4) | — | casca sobre cada roda | `PINTURA` |
| Tampa traseira | X 0, Y 1050, Z +3200 | 1250 x 800 x 40, inclinada 55 graus | `PINTURA` |

### 4.2 Suspensao e freio

| Peca | Posicao | Tamanho | Material |
|------|---------|---------|----------|
| Subchassi dianteiro | X 0, Y 250, Z -30 | quadro 1100 x 80 x 620, tubular | `ACO` |
| Bandeja inferior esq / dir | X +-500, Y 250, Z +30 | braco em L, 400 de comprimento | `ACO` |
| Amortecedor + mola esq / dir | X +-680, Y 620, Z -60 | tubo D 50 h 420, mola D 130 com 7 espiras | `ACO` |
| Manga de eixo esq / dir | X +-740, Y 317.15 nominal, Z 0 | bloco 140 x 220 x 90 | `ALUMINIO_BRUTO` |
| **Disco dianteiro** esq / dir | X +-720, Y 317.15 nominal, Z 0 | **D 312**, espessura 25, ventilado (dois discos de 9 com aletas) | `ACO` |
| Pinca dianteira esq / dir | X +-700, Y 520, Z +40 | 150 x 90 x 60 | `ALUMINIO_BRUTO` |
| **Disco traseiro** esq / dir | X +-715, Y 317.15 nominal, Z +2578 | **D 286**, espessura 12, solido | `ACO` |
| Eixo traseiro multilink | X 0, Y 330, Z +2578 | travessa 1300 x 100 x 80 + 4 bracos por lado | `ACO` |
| Caixa de direcao | X 0, Y 330, Z +150 | tubo D 60 x 900, com motor eletrico D 90 na ponta esquerda | `ALUMINIO_BRUTO` |
| Roda (4) | nos cubos | aro 7Jx17 (diametro nominal de assentamento 431.8, largura nominal 177.8) + pneu D nominal **634.3**, largura nominal 225 | `ALUMINIO_POLIDO` + `BORRACHA` |

> A direcao do Golf V e **eletromecanica**. Nao existe bomba hidraulica na correia.
> Nao coloque uma.

---

## 5. O motor — sistema local

Construa o motor num grupo proprio com origem local, depois posicione o grupo inteiro.

### 5.1 Frame local do motor

- **Xe** = ao longo do virabrequim, **+Xe indo do cilindro 1 para o cilindro 4**
- **Ye** = eixo dos cilindros, **+Ye para cima** (para o cabecote)
- **Ze** = **+Ze para o lado da admissao**

Cilindros (furo 82.5, curso 92.8, **entre centros 88**):

| Cilindro | Xe |
|----------|-----|
| 1 | 0 |
| 2 | 88 |
| 3 | 176 |
| 4 | 264 |

Alturas locais chave:

| Referencia | Ye |
|-----------|-----|
| Fundo do carter | -280 |
| Linha da tampa de mancal | -100 |
| **Linha de centro do virabrequim** | **0** |
| Face do bloco (deck) | +223 |
| Face superior do cabecote | +343 |
| Topo da tampa de valvulas | +403 |

Extensao local do bloco: Xe de **-85** (ponta da correia) a **+350** (face do volante).
Largura local: Ze de **-150** (escape) a **+150** (admissao).

### 5.2 Posicionamento global do motor

1. Construa o motor no frame local
2. **Gire 180 graus em torno do eixo Y** (isso faz o cilindro 1 ficar na direita
   do carro e a admissao apontar para a frente)
3. **Incline 12 graus em torno do eixo X do mundo**, jogando o topo do motor
   para tras (para o firewall)
4. Posicione a origem local em **X = +300, Y = 415, Z = -70**

Resultado: as velas ficam nos X globais **+300, +212, +124, +36**
(cilindro 1 na direita, cilindro 4 no lado do cambio).

### 5.3 Pecas internas do motor

| Peca | Local (Xe, Ye, Ze) | Descricao | Material |
|------|--------------------|-----------|----------|
| **Bloco** | centro em (132, 60, 0) | Bloco em **ferro fundido cinzento** (o 2.0 FSI EA113 nao e de aluminio). Caixa 435 x 323 x 300, com 4 furos D 82.5, camisas integradas, galerias de agua ao redor | `FERRO_FUNDIDO` |
| **Virabrequim** | eixo em Ye 0, de Xe -60 a +330 | 5 mancais, 8 contrapesos, munhoes D 54, moentes D 48, **curso 92.8** (moente deslocado 46.4 do centro) | `ACO` |
| **Volante** | Xe +340 | disco D 228, espessura 22, com cremalheira de 132 dentes na borda | `ACO` |
| **Roda fonica 60-2** | Xe +320 | disco D 150 com **58 dentes** e um vao de 2 dentes. E o que o CKP le | `ACO` |
| **Bielas (4)** | nos cilindros | comprimento entre centros **144**, perfil I, capa parafusada | `ACO` |
| **Pistoes (4)** | nos cilindros | D 82.5, altura de compressao 32.5, **coroa com bacia assimetrica** de 12 mm de profundidade, deslocada para o lado do escape. **Essa bacia e a peca que define o FSI** | `ALUMINIO_BRUTO` |
| **Aneis (3 por pistao)** | — | 2 de compressao + 1 raspador | `ACO` |
| **Carter** | (132, -190, 0) | bandeja de aluminio 420 x 180 x 290, com defletor interno e bujao | `ALUMINIO_BRUTO` |
| **Modulo dos eixos balanceadores** | (150, -120, 0) | caixa dentro do carter com **2 eixos contrarrotativos** acionados por corrente do virabrequim, girando a **2x** a rotacao do motor | `ALUMINIO_BRUTO` |
| **Bomba de oleo** | (60, -150, -60) | corpo 90 x 80 x 60, acionada pela mesma corrente | `ALUMINIO_BRUTO` |
| **Cabecote** | (132, 283, 0) | aluminio, 435 x 120 x 300, **DOHC 16 valvulas**, camaras rasas tipo telhado | `ALUMINIO_BRUTO` |
| **Valvulas de admissao (8)** | 2 por cilindro, lado +Ze | haste D 6, cabeca D 33, inclinadas 20 graus | `ACO` |
| **Valvulas de escape (8)** | 2 por cilindro, lado -Ze | haste D 6, cabeca D 28, inclinadas 21 graus | `ACO` |
| **Balancim de rolete + tucho hidraulico** | 16 conjuntos | balancim 60 x 20 com rolete D 14 | `ACO` |
| **Comando de admissao** | eixo em (Ye 330, Ze +45) | 8 ressaltos + o **ressalto de 3 lobos que aciona a bomba de alta** | `ACO` |
| **Comando de escape** | eixo em (Ye 330, Ze -45) | 8 ressaltos, e o que a correia dentada puxa | `ACO` |
| **Variador de fase (N205)** | Xe -60, no comando de admissao | disco D 120, camaras hidraulicas internas | `ACO` |
| **Corrente curta admissao-escape** | Xe -75 | corrente ligando os dois comandos, na ponta da correia | `ACO` |
| **Correia dentada** | Xe -85, plano Ze/Ye | correia de 25 mm de largura ligando polia do virabrequim, comando de escape, **bomba d'agua** e tensor. Perimetro aproximado 1300 | `BORRACHA` |
| **Tampa de valvulas** | (132, 373, 0) | plastico 435 x 60 x 290, com 4 pocos de vela D 42 e o separador de oleo do respiro | `PLASTICO_PRETO` |
| **Velas (4)** | nos eixos dos cilindros, Ye 250 | corpo sextavado 16 mm, isolador ceramico, D total 21, comprimento 95 | `ACO` + `CERAMICA` |

**Ordem de ignicao: 1-3-4-2.**

### 5.4 Acessorios do motor

| Peca | Local (Xe, Ye, Ze) | Tamanho | Material |
|------|--------------------|---------|----------|
| Polia do virabrequim / damper | (-100, 0, 0) | D 150, largura 30, 6 canais | `ACO` + `BORRACHA` |
| **Alternador** (140 A) | (-100, 15, -140) | corpo D 130 x 190, polia D 55, tampa traseira com retificador e regulador | `ALUMINIO_BRUTO` + `COBRE` |
| **Compressor do ar condicionado** | (-90, -130, +130) | corpo D 120 x 200, polia com embreagem D 110 | `ALUMINIO_BRUTO` |
| Tensor da correia acessoria | (-100, 130, +40) | polia lisa D 70 com braco de mola | `ACO` |
| Correia acessoria | plano Xe -100 | 6 canais, perimetro aproximado 1650 | `BORRACHA` |
| **Motor de partida** | (+310, -35, -190) | corpo D 110 x 210, solenoide D 55 x 130 em cima, pinhao de 9 dentes | `ACO` + `COBRE` |
| Bomba d'agua | (-85, 90, -110) | corpo D 90, rotor de 6 pas, acionada pela correia dentada | `ALUMINIO_BRUTO` |
| Carcaca do termostato | (+330, 120, -60) | corpo 110 x 90 x 90, com 3 saidas de mangueira | `ALUMINIO_BRUTO` |

### 5.5 Cambio e transmissao

| Peca | Global (X, Y, Z) | Tamanho | Material |
|------|------------------|---------|----------|
| Campana da embreagem | X -140, Y 400, Z -60 | sino D 340, comprimento 180 | `ALUMINIO_BRUTO` |
| Embreagem + platô | X -110, Y 415, Z -70 | disco D 228 | `ACO` |
| **Caixa 02Q, 6 marchas** | X -370, Y 380, Z -60 | corpo irregular 300 x 320 x 300 | `ALUMINIO_BRUTO` |
| Diferencial | X -260, Y 360, Z -70 | coroa D 190 dentro da caixa | `ACO` |
| Semieixo esquerdo (curto) | de X -330 a X -740, Y 380 a 418, Z -60 | barra D 26 com junta homocinetica D 90 em cada ponta e coifa de borracha | `ACO` + `BORRACHA` |
| **Semieixo direito (longo)** | de X -230 a X +740 | barra D 26 **passando por tras do carter**, com mancal intermediario apoiado no bloco em X +180 | `ACO` |
| Coxim direito (hidraulico) | X +430, Y 600, Z -110 | bloco 120 x 100 x 90 na longarina direita | `BORRACHA` |
| Coxim esquerdo | X -480, Y 600, Z -60 | bloco 110 x 100 x 90 | `BORRACHA` |
| Coxim pendular (dogbone) | X -100, Y 300, Z +180 | braco 220 x 60 x 50 ligando cambio ao subchassi | `BORRACHA` |

### 5.6 Arrefecimento

| Peca | Global (X, Y, Z) | Tamanho | Material |
|------|------------------|---------|----------|
| Radiador | X 0, Y 540, Z -780 | 650 x 440 x 26, colmeia de aletas, tanques plasticos em cima e embaixo | `ALUMINIO_BRUTO` + `PLASTICO_PRETO` |
| Condensador do ar | X 0, Y 540, Z -815 | 620 x 400 x 16 | `ALUMINIO_BRUTO` |
| Eletroventilador duplo | X 0, Y 540, Z -700 | 2 helices D 290 numa carenagem 680 x 460 x 90 | `PLASTICO_PRETO` |
| Mangueira superior | de (X +330, Y 630, Z -80) ate (X -180, Y 700, Z -740) | tubo D 38, curva | `BORRACHA` |
| Mangueira inferior | de (X +290, Y 400, Z -180) ate (X +180, Y 380, Z -740) | tubo D 38 | `BORRACHA` |
| Reservatorio de expansao | X +420, Y 780, Z +140 | garrafa 200 x 200 x 130 com tampa preta | `PLASTICO_CINZA` |
| Radiador de oleo do EGR | X -60, Y 620, Z +90 | caixa 140 x 100 x 90 | `ALUMINIO_BRUTO` |

---

## 6. Os 27 componentes da aula

Cada entrada tem: **peca real**, **codigo VAG**, **posicao global**, **tamanho**,
**material**, **como esta ligado**. E o coracao do documento.

### 01 — Canister de carvao ativado
- Peca real: reservatorio EVAP de carvao ativado
- Posicao: **X +350, Y 400, Z +2600** — embaixo do carro, atras do tanque, lado direito
- Tamanho: **300 x 180 x 180**, caixa plastica com cantos arredondados
- Material: `PLASTICO_PRETO`
- Ligacoes: mangueira D 8 vindo do topo do tanque; mangueira D 8 indo para a frente
  ate a valvula de purga (item 08); um respiro para a atmosfera apontando para baixo
- Interno (modo C): granulado escuro preenchendo 80% do volume

### 02 — Medidor de massa de ar (MAF) — G70
- Peca real: medidor de filme quente Bosch HFM 5
- Posicao: **X -180, Y 700, Z -330** — encaixado na saida da caixa de ar
- Tamanho: tubo D 82 x 105, com um **corpo plastico de 60 x 45 x 55 saindo pela lateral**
  e um conector de **5 pinos**
- Material: `PLASTICO_PRETO` + `PLASTICO_CINZA` no conector
- Interno (modo C): um **pente de medicao** de 8 x 40 mm suspenso no meio do tubo, e a
  pastilha de silicio aquecida na ponta dele
- Ligacoes: 5 fios indo para a ECU

### 03 — Central eletronica (ECU) — J623, Bosch MED 9.5.10
- Posicao: **X -350, Y 930, Z +450** — dentro da caixa de agua, lado esquerdo,
  debaixo da tampa plastica, encostada no firewall
- Tamanho: **200 x 160 x 45**, caixa de aluminio com aletas longitudinais na tampa
- Material: `ALUMINIO_BRUTO`
- Conector: bloco de **94 pinos** na lateral menor, 3 travas
- Interno (modo C): placa verde com um processador quadrado de 20 x 20 e
  fileiras de drivers de potencia encostados na carcaca

### 04 — Conector de diagnostico (OBD2)
- Peca real: tomada SAE J1962 de 16 pinos
- Posicao: **X -420, Y 620, Z +900** — debaixo do painel, lado do motorista,
  atras de uma tampinha articulada
- Tamanho: **50 x 25 x 40**, formato de trapezio (D invertido)
- Material: `PLASTICO_PRETO` + `LATAO` nos pinos
- Pinos que importam: **4 e 5** terra, **16** positivo permanente,
  **6 e 14** CAN alta e baixa, **7** linha K

### 05 — Lampada de anomalia (MIL)
- Posicao: **X -350, Y 900, Z +820** — no painel de instrumentos J285
- Tamanho: simbolo de motor de **22 x 16**, retroiluminado em ambar
- Material: emissivo #ffa000
- **Detalhe importante para a animacao:** ela **nao tem fio da ECU**. A ECU manda
  a mensagem pelo CAN, o painel decide acender

### 06 — Antena do imobilizador — J362
- Posicao: **X -350, Y 720, Z +780** — anel em volta do miolo da ignicao,
  logo atras do volante
- Tamanho: anel D externo 60, D interno 32, espessura 18
- Material: `PLASTICO_PRETO`, com bobina de `COBRE` visivel no modo C
- Ligacoes: 2 fios curtos indo para o painel

### 07 — Rede CAN
- Peca real: **par trancado laranja**, 500 kbit/s, com **120 ohm em cada ponta**
- Traçado: da ECU (X -350, Y 930, Z +450) → desce pelo firewall → caixa de conexoes
  **J533** (X -400, Y 700, Z +870) → painel (X -350, Y 900, Z +820) → tomada OBD
  (X -420, Y 620, Z +900). Ramo de tras: J533 → modulo do NOx **J583**
  (X -80, Y 320, Z +900)
- Tamanho: dois fios D 2 trancados com passo de 30 mm
- Material: `FIO_LARANJA` (um laranja/preto, outro laranja/marrom)
- Resistores: dois cilindros D 6 x 12 nas duas pontas do barramento

### 08 — Valvula de purga do canister — N80
- Posicao: **X -20, Y 750, Z -230** — presa no coletor de admissao, lado esquerdo
- Tamanho: corpo D 28 x 70, com **dois bicos de mangueira D 8** opostos e conector
  de 2 pinos em cima
- Material: `PLASTICO_PRETO`
- Interno (modo C): bobina, embolo e mola

### 09 — Corpo de borboleta motorizado (EGAS) — J338 / GX3
- Posicao: **X -50, Y 680, Z -300** — entre a mangueira de ar e o coletor
- Tamanho: corpo D externo 105 x 90, furo interno **D 60**, borboleta de disco D 60,
  **caixa do motor DC de 70 x 60 x 55 na lateral**, conector de 6 pinos
- Material: `ALUMINIO_POLIDO` + `PLASTICO_PRETO`
- Interno (modo C): motor DC, trem de 2 engrenagens, dois potenciometros de pista
- **Detalhe da aula:** no modo estratificado essa borboleta fica **quase toda aberta**;
  quem controla o torque e a quantidade de combustivel, nao o ar

### 10 — Bomba de alta pressao — HDP1 / regulador N276
- Posicao: **X +10, Y 700, Z +50** — parafusada no cabecote, acionada pelo
  **ressalto de 3 lobos do comando de admissao** *(confirmar na foto de qual ponta
  do cabecote ela fica no BLX)*
- Tamanho: corpo de aluminio **95 x 90 x 110**, tucho de rolete embaixo,
  **regulador solenoide D 30 x 55** em cima, saida de alta com porca de 17
- Material: `ALUMINIO_BRUTO`
- Pressao: **30 a 110 bar**. Entrada em 4 a 6 bar
- Interno (modo C): embolo unico D 12 com mola, camara, valvula de admissao e de saida

### 11 — Sensor de pressao do coletor (MAP) — G71 (+ G42 de temperatura do ar)
- Posicao: **X +150, Y 660, Z -280** — rosqueado no plenum do coletor
- Tamanho: corpo **32 x 28 x 40**, flange com 1 parafuso, conector de 4 pinos
- Material: `PLASTICO_PRETO`
- Interno (modo C): diafragma de silicio piezorresistivo sobre camara de vacuo selado

### 12 — Valvula EGR — N18 (+ posicao G212), com resfriador
- Posicao da valvula: **X -10, Y 550, Z 0**
- Posicao do resfriador: **X -60, Y 620, Z +90** (caixa 140 x 100 x 90)
- Tubo de ligacao: do coletor de escape (X +80, Y 560, Z +140) subindo e cruzando
  ate o coletor de admissao (X -80, Y 640, Z -220). Tubo **D 32**, dois cotovelos
- Tamanho da valvula: corpo 90 x 80 x 90, atuador eletrico D 55 em cima
- Material: `FERRO_FUNDIDO` na valvula, `ALUMINIO_BRUTO` no resfriador

### 13 — Sensor de pressao da galeria — G247
- Posicao: **X +330, Y 640, Z -140** — rosqueado na **ponta direita** da galeria
- Tamanho: corpo de inox D 20 x 45, sextavado de 22 na base, conector de 3 pinos
- Material: `ACO_INOX`
- **Nao confundir com o G410**, que e o sensor de baixa pressao na linha do tanque

### 14 — Galeria de combustivel de alta — Kraftstoffverteilerrohr
- Posicao: barra de **X +40 a X +330, Y 640, Z -140** — no lado da admissao do cabecote
- Tamanho: tubo de **aco forjado D externo 28, parede 5 mm**, comprimento 290,
  com **4 bocas de injetor** soldadas apontando para baixo/dentro, nos X 300, 212, 124, 36
- Material: `ACO_INOX`
- **A parede grossa e o que distingue visualmente** de uma galeria de injecao indireta

### 15 — Valvula de injecao (bico) — N30, N31, N32, N33 / Bosch HDEV 1.2
- Posicao: 4 bicos, um por cilindro. Cada um sai da galeria e **desce inclinado para
  dentro do cabecote, entrando por baixo do duto de admissao**, com a ponta chegando
  na parede da camara, apontando para a bacia do pistao
- Coordenadas das pontas: **X 300 / 212 / 124 / 36, Y 590, Z -60**
- Tamanho: corpo D 21 x 95, com **dois aneis o-ring coloridos**, bobina no meio,
  conector de 2 pinos no topo
- Material: `ACO_INOX` + `PLASTICO_PRETO`
- Tipo: **solenoide** (o piezo e do BMW e do Mercedes, nao deste)

### 16 — Sensores de detonacao — G61 e G66
- Posicao: no bloco, **lado do escape** (Z positivo), Y 480
  - **G61** (cilindros 1-2): X **+256**, Z +80
  - **G66** (cilindros 3-4): X **+80**, Z +80
- Tamanho: **anel D externo 34, furo central D 9, altura 22**, com cabo moldado saindo
  pela lateral e conector de 2 pinos
- Material: `ACO` + `PLASTICO_PRETO`
- Torque de aperto real: **20 Nm** (apertar diferente disso muda a leitura)

### 17 — Sensor de rotacao (CKP) — G28
- Posicao: **X -30, Y 300, Z +60** — no bloco, do lado do volante, apontando para a
  roda fonica
- Tamanho: corpo 45 x 25 x 20 com flange de 1 parafuso, ponta cilindrica D 12,
  conector de 3 pinos
- Material: `PLASTICO_PRETO`
- Le a **roda de 60 menos 2 dentes**. O vao de 2 dentes e a referencia de sincronismo
- Interno (modo C): ima permanente + bobina (**indutivo**)

### 18 — Modulo de combustivel (dentro do tanque) — G6 + boia
- Posicao: **X -150, Y 470, Z +2150** — dentro do tanque, flange de acesso no topo
  (Y 620), sob o banco traseiro
- Tamanho: copo plastico **D 130 x 220**, com **bomba eletrica D 38 x 110** dentro,
  **braco de boia de 120 mm** com flutuador D 40, pre-filtro tipo meia na base
- Material: `PLASTICO_PRETO`
- Entrega: **4 a 6 bar** de baixa pressao para a bomba de alta
- Rele: **J17** na caixa de reles

### 19 — Bobinas de ignicao — N70, N127, N291, N292
- Posicao: **X 300 / 212 / 124 / 36, Y 810, Z -30** — enfiadas nos pocos da tampa de
  valvulas, uma por cilindro
- Tamanho: corpo **D 26 x 130** com um flange de fixacao de 1 parafuso e conector
  de **4 pinos** no topo; **capa de borracha conica** de 45 mm na ponta de baixo
- Material: `PLASTICO_PRETO` + `BORRACHA`
- Interno (modo C): nucleo laminado, primario grosso, secundario fino,
  **estagio final de potencia integrado**
- **Sao 4 separadas, coil-on-plug. Nao existe cabo de vela neste motor**

### 20 — Sensor de fase (CMP) — G40
- Posicao: **X +370, Y 700, Z -60** — na ponta da correia, no cabecote, lendo a roda
  de fase do comando de admissao
- Tamanho: corpo 55 x 30 x 22, conector de 3 pinos
- Material: `PLASTICO_PRETO`
- Tipo: **Hall** (precisa de alimentacao, diferente do CKP indutivo)

### 21 — Sensor de temperatura do motor (ECT) — G62
- Posicao: **X +10, Y 620, Z -80** — na flange de agua do cabecote, lado do cambio
- Tamanho: corpo plastico **D 20 x 45**, ponta de latao D 9 x 15 molhada,
  **trava metalica em U** atravessando o corpo, conector de 4 pinos
- Material: `PLASTICO_PRETO` (corpo verde) + `LATAO`
- Tipo: **NTC**. Nao confundir com o **G83**, que e o de saida do radiador

### 22 — Sonda lambda pre-catalisador (LSU) — G39 / Bosch LSU 4.9
- Posicao: **X +150, Y 570, Z +150** — rosqueada no coletor de escape, antes do pre-cat
- Tamanho: corpo sextavado **22 mm**, rosca M18x1.5, **tubo de protecao ranhurado
  D 12 x 30** na ponta, e **5 fios** subindo ate um conector
- Material: `ACO_INOX`
- Cores dos fios: 2 brancos (aquecedor), cinza, amarelo, vermelho
- Interno (modo C): celula de bombeamento + celula de Nernst + camara de difusao,
  em ceramica planar, com aquecedor impresso

### 23 — Pre-catalisador
- Posicao: **X +120, Y 470, Z +180** — colado no coletor de escape, quase encostado
  no cabecote, inclinado
- Tamanho: **corpo oval 130 x 100 x 250**, colmeia interna com **400 celulas
  por polegada quadrada**
- Material: `ACO_INOX` por fora, `CERAMICA` no monolito, manta de fibra entre os dois
- Fica colado no motor para **acender rapido** (light-off). So funciona em lambda 1

### 24 — Sensor de temperatura dos gases (EGT) — G235
- Posicao: **X -60, Y 185, Z +560** — no tubo, **antes** do catalisador de NOx
- Tamanho: **sonda de inox D 6 x 90**, sextavado de 17 na base, cabo trancado de 400 mm
- Material: `ACO_INOX`
- Existe para **proteger o catalisador de NOx**: a regeneracao e a dessulfatacao
  acontecem em faixas de temperatura estreitas
- *Confirmar na peca real do BLX se e PTC ou termopar — a aula hoje ensina PTC*

### 25 — Catalisador acumulador de NOx
- Posicao: **X -80, Y 180, de Z +700 a Z +1100** — embaixo do assoalho
- Tamanho: **cilindro D 145 x 400**, com cones de entrada e saida de 90 mm cada
- Material: `ACO_INOX` + `CERAMICA` com revestimento claro (oxido de bario)
- Acompanha: **sensor de NOx G295** na entrada (X -80, Y 195, Z +680, sonda D 8 x 70)
  e o **modulo J583** preso no assoalho logo acima (X -80, Y 320, Z +900,
  caixa 120 x 90 x 30) — o sensor de NOx e o unico que tem modulo proprio no CAN
- **E a peca mais cara do carro e a que morre com enxofre**

### 26 — Sonda lambda pos-catalisador (LSF) — G130 / Bosch LSF 4.2
- Posicao: **X -80, Y 190, Z +1140** — depois do catalisador de NOx
- Tamanho: igual a 22, mas com **4 fios** e tubo de protecao fechado com furos menores
- Material: `ACO_INOX`
- Nao dosa mistura. **Julga o catalisador** e corrige o desvio da sonda da frente

### 27 — Bateria 12 V
- Posicao: **X -450, Y 780, Z +260** — no vao do motor, lado esquerdo, atras,
  sobre uma bandeja metalica
- Tamanho: caixa **242 x 175 x 190** (61 a 72 Ah)
- Material: `PLASTICO_PRETO` translucido no modo corte
- Interno (modo C): **6 celulas** separadas por 5 paredes, cada celula com um
  pacote de placas de chumbo, eletrolito preenchendo ate 3/4
- Polos: **positivo D 19 (maior) em X -560**, negativo D 17 em X -340, ambos em Y 875
- Suporte de fusiveis B+ **em cima do polo positivo**: caixa 120 x 60 x 45
- Sobre o **IBS**: o BLX de fabrica normalmente **nao tem**. Se voce quiser manter
  na cena, modele um anel D 40 no cabo negativo logo abaixo do polo, com um
  conector de 2 pinos. Marque como opcional

---

## 7. O que tem no vao do motor e nao tem numero

Sem isso o vao fica vazio e falso. Tudo em coordenada global.

| Peca | Posicao (X, Y, Z) | Tamanho | Material |
|------|-------------------|---------|----------|
| **Coletor de admissao** | X +170, Y 640, Z -250 | Plastico. Plenum de 420 x 110 x 130 na frente, com **4 dutos curvos longos de D 44** subindo e virando para tras ate as portas do cabecote. Comprimento de cada duto aproximadamente 350 mm | `PLASTICO_PRETO` |
| **Flaps de turbulencia (N316)** | dentro dos 4 dutos, X 300/212/124/36, Y 640, Z -170 | **4 abas semicirculares de 40 x 22** num eixo comum de D 8, mais o atuador eletrico 70 x 55 x 45 em X -40, Y 620, Z -300, e o sensor de posicao **G336** ao lado. **Fechadas no modo pobre, abertas no modo homogeneo** | `PLASTICO_PRETO` |
| **Coletor de escape** | X +170, Y 560, Z +130 | 4 tubos de D 38 saindo do cabecote e juntando num coletor unico, ferro fundido, muito curto | `INOX_QUEIMADO` |
| **Caixa do filtro de ar** | X -300, Y 700, Z -350 | Caixa 300 x 250 x 180 com filtro de papel plissado 250 x 190 x 55 dentro, tampa com 6 clipes. *Confirmar posicao exata na foto do vao do BLX* | `PLASTICO_PRETO` |
| Duto de entrada de ar frio | de X -320, Y 780, Z -700 ate a caixa | tubo retangular 120 x 80 | `PLASTICO_PRETO` |
| Mangueira MAF ate borboleta | de X -180 a X -50, Y 690, Z -320 | tubo sanfonado D 70 | `BORRACHA` |
| **Tampa plastica do motor** | X +170, Y 850, Z -60 | Painel 480 x 60 x 330 com nervuras e o texto **2.0 FSI** em relevo | `PLASTICO_PRETO` |
| Servofreio | X -320, Y 800, Z +430 | Tambor D 250 x 130 no firewall | `ACO` |
| Cilindro mestre | X -320, Y 800, Z +330 | Corpo D 60 x 150, com reservatorio translucido 130 x 100 x 90 em cima | `ALUMINIO_BRUTO` |
| Bloco ABS | X -180, Y 620, Z +330 | Bloco 130 x 100 x 90 com 6 tubos de freio saindo | `ALUMINIO_BRUTO` |
| **Caixa de reles e fusiveis principal** | X -500, Y 950, Z +430 | Caixa 220 x 160 x 110 debaixo da tampa do plenum, com fileiras de fusiveis lamina coloridos e **reles cubicos de 25 x 25 x 25**. O **rele principal J271** e um deles | `PLASTICO_PRETO` |
| Cabo de partida (positivo grosso) | da bateria ate o motor de partida | secao **35 mm2**, D externo 12, vermelho, com percurso: X -560, Y 875 → desce para Y 500 → cruza para X -80, Y 380, Z +160 | `FIO_VERMELHO` |
| Cabo de terra da bateria | X -340, Y 875 ate o bloco em X -60, Y 300, Z +100 | secao **25 mm2**, preto trancado | `FIO_PRETO` |
| Cabo B+ do alternador | do alternador (X +400, Y 470) ate a caixa de fusiveis da bateria | secao 16 mm2, vermelho com capa | `FIO_VERMELHO` |
| Chicote do motor | ramificando da ECU | tronco de D 22 saindo da ECU, descendo pelo firewall, correndo por cima do cabecote e ramificando **um por sensor**. Use fita de chicote preta fosca | `PLASTICO_PRETO_FOSCO` |

---

## 8. O escape inteiro, em escala real

Esta e a parte que voce pediu para nao encolher. **Do cabecote a ponta sao
aproximadamente 3900 mm.** Construa como um caminho (path) e extrude o tubo.

Percurso, ponto a ponto (X, Y, Z):

| # | Ponto | O que tem ali |
|---|-------|---------------|
| 1 | (+300, 600, +100) | porta de escape do cilindro 1 |
| 2 | (+170, 570, +140) | coletor juntando os 4, **sonda G39 aqui** |
| 3 | (+120, 470, +180) | **pre-catalisador (item 23)** |
| 4 | (+40, 300, +260) | tubo descendo, curva forte |
| 5 | (-40, 200, +400) | **junta flexivel** de malha inox, D 60 x 120 |
| 6 | (-60, 185, +560) | **sensor EGT G235 (item 24)** |
| 7 | (-80, 195, +680) | **sensor de NOx G295** |
| 8 | (-80, 180, +700) | **entrada do catalisador de NOx (item 25)** |
| 9 | (-80, 180, +1100) | saida do catalisador de NOx |
| 10 | (-80, 190, +1140) | **sonda LSF G130 (item 26)** |
| 11 | (-90, 195, +1500) | tubo intermediario, D 55 |
| 12 | (-100, 200, +1900) | entrada do **silencioso intermediario** |
| 13 | (-100, 200, +2250) | saida do intermediario. Corpo 350 x 180 x 220 |
| 14 | (-140, 260, +2450) | tubo comeca a subir |
| 15 | (-160, 330, +2578) | **passagem por cima do eixo traseiro** |
| 16 | (-180, 300, +2850) | entrada do **silencioso traseiro** |
| 17 | (-180, 280, +3200) | corpo do traseiro: **600 x 200 x 350** |
| 18 | (-350, 300, +3300) e (-250, 300, +3300) | **duas ponteiras** D 70, saida dupla do GT |

Diametros: **60 mm** do coletor ate o cat de NOx, **55 mm** dali para tras.
Suspenso por **6 coxins de borracha** em forma de anel achatado (60 x 40 x 8),
nos Z aproximados +900, +1500, +2100, +2500, +2900, +3250.

**Manta termica de aluminio** (chapa 1.5 mm, ondulada) entre o escape e o assoalho,
do Z +600 ao Z +1200.

---

## 9. Tanque e linha de combustivel

### 9.1 Tanque
- Peca real: **tanque plastico tipo sela, 55 litros**
- Posicao: centro em **X 0, Y 460, Z +2225**
- Tamanho: **800 (largura) x 320 (altura) x 550 (profundidade)**, com um **rebaixo
  central em forma de tunel** de 200 x 120 na parte de baixo, para o tunel do assoalho
  e o escape passarem. E isso que faz dele "sela"
- Material: `PLASTICO_PRETO` (no modo B/C use opacidade 0.35 para ver o combustivel)
- Combustivel dentro: solido `COMBUSTIVEL` preenchendo ate **Y 560** (cheio)
- Fica **na frente do eixo traseiro, embaixo do banco de tras**

### 9.2 Acessorios do tanque
| Peca | Posicao | Tamanho |
|------|---------|---------|
| Flange do modulo (item 18) | X -150, Y 620, Z +2150 | tampa D 160 com trava tipo baioneta |
| Segundo copo (lado da sela) | X +200, Y 470, Z +2150 | copo D 100 x 180 com bomba de sucção (venturi) |
| Bocal de abastecimento | de (X +400, Y 550, Z +2400) ate (X +860, Y 750, Z +2750) | tubo D 60, curva longa, tampa com trava |
| Respiro / valvula de rollover | X 0, Y 620, Z +2000 | corpo D 40 x 50, mangueira D 8 indo ao canister |
| Filtro de combustivel | X +250, Y 300, Z +1900 | cilindro D 80 x 180, embaixo do assoalho |

### 9.3 A linha de combustivel — a distancia que a aula quer mostrar
- Sai da flange do modulo em **(X -150, Y 620, Z +2150)**
- Desce para **(X +250, Y 240, Z +1950)** e passa pelo filtro
- Corre para a frente colada no assoalho, do lado direito, em **X +250, Y 240**,
  de **Z +1900 ate Z +200** — **1700 mm em linha reta**
- Sobe para **(X +180, Y 550, Z +100)**
- Chega na entrada da bomba de alta em **(X +10, Y 660, Z +50)**
- Tubo **D 8** de plastico rigido com trecho flexivel nas pontas
- **Comprimento total da linha: aproximadamente 2600 mm**
- Linha de retorno: o FSI e **returnless**. Nao modele retorno ate o tanque

**Destaque para o modo B:** pinte esta linha de amarelo e escreva a distancia.
E o argumento visual da aula: o combustivel viaja **2,6 metros a 5 bar** ate a bomba
de alta, que sobe para **110 bar** e joga em **20 cm** de galeria ate o bico.

---

## 10. Rede eletrica principal

Modele os cabos grossos como tubos com espessura real. Eles sao visiveis e importam.

| Circuito | De | Para | Secao | Cor |
|----------|-----|------|-------|-----|
| Partida | polo + da bateria | motor de partida | 35 mm2 (D 12) | vermelho |
| Terra da bateria | polo - da bateria | bloco do motor | 25 mm2 (D 10) | preto |
| Terra da carroceria | polo - da bateria | longarina esquerda | 16 mm2 (D 8) | preto |
| Carga | B+ do alternador | fusivel da bateria | 16 mm2 (D 8) | vermelho |
| Permanente da ECU | fusivel da bateria | pino 1 da ECU | 2.5 mm2 (D 4) | vermelho |
| Pos-chave | rele principal J271 | ECU e sensores | 1.5 mm2 (D 3) | preto/amarelo |
| CAN | ECU | J533, painel, OBD, J583 | 0.5 mm2 par trancado | laranja |
| Sinais de sensor | ECU | cada sensor | 0.5 mm2 (D 2) | azul, cinza, verde |

**Terra do motor:** um cabo trancado visivel do bloco (X -60, Y 300, Z +100) ate a
carroceria (X -300, Y 400, Z +200). Este e o cabo que a aula 27 usa para explicar
queda de tensao no terra.

---

## 11. O motor funcionando — sincronismo, tempos e ignicao

**Esta e a secao mais importante do documento.** Ela liga a Aula 3 (mecanica e ordem
de ignicao) com a Aula 4 (os 27 componentes). Sem ela voce tem uma escultura.

### 11.1 O relogio mestre

Tudo na cena e funcao de **uma unica variavel**: o angulo do virabrequim.

```
theta = angulo do virabrequim, de 0 a 720 graus
```

**720 graus, nao 360.** Um ciclo completo de 4 tempos leva **duas voltas** do
virabrequim. Os comandos de valvulas giram na **metade** da rotacao:

```
theta        = (rpm / 60) * 360 * t   , modulo 720
theta_comando = theta / 2
```

Nunca anime nada por tempo direto. **Tudo deriva de theta.** E o que garante que
pistao, valvula, faisca, bico e sensor nunca saiam de sincronismo.

### 11.2 A defasagem dos cilindros — vem direto da Aula 3

Ordem de ignicao **1-3-4-2**, uma combustao a cada **180 graus**.

| Cilindro | X global | Defasagem | Queima em theta |
|----------|----------|-----------|-----------------|
| **1** | +300 | **0** | 0 |
| **3** | +124 | **180** | 180 |
| **4** | +36 | **360** | 360 |
| **2** | +212 | **540** | 540 |

```
theta_local(cilindro) = (theta - defasagem + 720) mod 720
```

**Conferencia obrigatoria contra a Aula 3.** Em `theta = 0` a cena tem que mostrar
exatamente isto, que e o que a aula 3 parte 3 ja ensina:

| Cilindro | Local | Estado | O que se ve |
|----------|-------|--------|-------------|
| **1** | 0 | **BALANCO** | PMS, as duas valvulas fechadas, os dois cames apontados um para o outro |
| **4** | 360 | **CRUZAMENTO** | PMS, os dois cames para baixo, as duas valvulas acionadas |
| **2** | 180 | **ESCAPE** | so o came de escape atuando |
| **3** | 540 | **ADMISSAO** | so o came de admissao atuando |

**Se a sua animacao nao der exatamente essa foto em theta 0, ela contradiz a Aula 3
e esta errada.** Teste isso antes de seguir.

### 11.3 Os quatro tempos, por angulo local

| Angulo local | Tempo | Pistao |
|--------------|-------|--------|
| 0 a 180 | **Expansao** (forca) | desce |
| 180 a 360 | **Escape** | sobe |
| 360 a 540 | **Admissao** | desce |
| 540 a 720 | **Compressao** | sobe |

A cada instante os quatro tempos estao acontecendo ao mesmo tempo, um por cilindro.
O virabrequim nunca fica sem forca.

### 11.4 Posicao do pistao — use esta formula, nao seno

```
r = 46.4      // curso / 2
l = 144       // comprimento da biela entre centros

y_pino(a)  = r * cos(a) + sqrt(l*l - (r * sin(a))^2)
y_coroa(a) = y_pino(a) + 32.5       // altura de compressao do pistao
```

Conferencia: em `a = 0` da **222.9**, praticamente colado no deck de 223 (PMS).
Em `a = 180` da **130.1**. Diferenca **92.8** = o curso exato.

**Nao use seno puro.** O movimento do pistao nao e senoidal: a biela finita faz ele
acelerar mais na descida logo apos o PMS do que na subida. A diferenca e visivel e
e o tipo de erro que denuncia um modelo feito no chute.

A biela acompanha: uma ponta no moente do virabrequim (raio 46.4 no angulo `a`),
a outra no pino do pistao.

### 11.5 Comando de valvulas

Valores base, em angulo local:

| Evento | Sigla | Angulo local | Referencia |
|--------|-------|--------------|------------|
| Escape abre | EVO | **135** | 45 graus antes do PMI da expansao |
| Escape fecha | EVC | **370** | 10 graus depois do PMS |
| Admissao abre | IVO | **355** | 5 graus antes do PMS |
| Admissao fecha | IVC | **590** | 50 graus depois do PMI |

**Cruzamento = de 355 a 370, so 15 graus.** Pequeno de proposito: no modo
estratificado o motor nao pode ter gas queimado voltando para a admissao.

Levantamento: **10 mm** na admissao, **9.5 mm** no escape.
Use perfil suave, nunca degrau:

```
lift(a) = (L / 2) * (1 - cos(PI * (a - abertura) / duracao))   dentro da janela
lift(a) = 0                                                     fora da janela
```

**Variador de fase N205** (so na admissao): desloca IVO e IVC de **0 a 40 graus** no
sentido de avanco. Fica em 0 na marcha lenta, avanca em carga media. Quando ele
mover, a roda de fase que o **CMP (item 20)** le tem que mover junto.

### 11.6 Ignicao — a Aula 3 agora com avanco de verdade

```
angulo da faisca = 720 - avanco     (em angulo local)
```

| Condicao | Avanco |
|----------|--------|
| Marcha lenta | 10 graus antes do PMS |
| Carga parcial | 28 graus |
| Plena carga | 16 graus (limitado pela detonacao) |

**Dwell** (tempo que a bobina fica carregando): **3 ms**. Em graus depende da rotacao:

```
dwell_graus = 3 * 6 * rpm / 1000        // a 2000 rpm da 36 graus
inicio da carga = 720 - avanco - dwell_graus
```

As quatro bobinas acendem na ordem **1-3-4-2**. Se a sua animacao acender
1-2-3-4, esta errada e contradiz a Aula 3.

### 11.7 Injecao — **isto e o coracao da Aula 5**

E aqui que este motor se separa de tudo que o curso mostrou ate agora. O bico dispara
em **angulo diferente** conforme o modo, e o resultado dentro do cilindro e outro.

#### Modo HOMOGENEO — carga alta, aceleracao, lambda 1.0
- Injeta na **ADMISSAO**, local **380 a 460**
- O combustivel tem mais de 300 graus para se misturar com **todo** o ar
- **Flaps de turbulencia ABERTAS**
- Borboleta controla o torque, como um motor normal
- A nuvem preenche o **cilindro inteiro**, uniforme

#### Modo ESTRATIFICADO — carga baixa, cruzeiro, lambda 2 a 3
- Injeta na **COMPRESSAO**, local **640 a 680**, quase encostando na faisca
- O pistao ja esta subindo. **A bacia da coroa recebe o jato e carrega a nuvem rica
  ate a vela**
- **Flaps de turbulencia FECHADAS**, criando o rolo de ar que segura a nuvem no lugar
- **Borboleta quase toda aberta, cerca de 85 por cento.** O torque e controlado pela
  quantidade de combustivel, nao pelo ar. Isso e o contrario de tudo que o aluno viu
- Em volta da nuvem so existe **ar e gas recirculado**. Por isso o lambda medio da 2 a 3

#### Modo HOMOGENEO POBRE — transicao, lambda 1.5
- Injeta na admissao, mas com pouco combustivel. Flaps meio fechadas

**A animacao precisa deixar comparar os dois lado a lado:** o mesmo motor, o mesmo
angulo de virabrequim, e a nuvem de combustivel se formando em lugar completamente
diferente. Esse e o momento da aula.

Duracao do pulso do bico: **0.4 a 2.5 ms**. Converta para graus como no dwell.

### 11.8 A bomba de alta nao acompanha os bicos

Detalhe real e otimo de ensinar:

- O ressalto que aciona a bomba tem **3 lobos**
- O comando gira **1 volta a cada 720 graus** de virabrequim
- Logo: **3 bombeadas por ciclo**, contra **4 injecoes por ciclo**

**Nao e 1 para 1.** A pressao da galeria **ondula** por causa desse descompasso, e e
exatamente isso que o sensor **G247 (item 13)** enxerga. Bombeadas em
`theta = 0, 240, 480`.

### 11.9 Os estados de operacao da cena

A cena deve percorrer estes estados, com botao para o aluno escolher:

| # | Estado | rpm | Modo | O que se ve |
|---|--------|-----|------|-------------|
| 1 | Chave desligada | 0 | — | tudo parado, bateria 12.6 V |
| 2 | Chave ligada | 0 | — | bomba de baixa pressuriza por 2 s, painel acende, imobilizador dialoga |
| 3 | **Partida** | 250 | homogeneo rico | motor de partida engatado, tensao cai para 9.5 V |
| 4 | Marcha lenta | 780 | homogeneo | lambda 1, borboleta quase fechada |
| 5 | **Cruzeiro** | 2000 | **estratificado** | borboleta aberta, flaps fechadas, lambda 2.5, NOx acumulando |
| 6 | Aceleracao | 4000 | homogeneo | lambda 1, flaps abertas, avanco reduzido |
| 7 | **Regeneracao do NOx** | 2000 | rico | 3 segundos em lambda 0.8, o catalisador esvazia |
| 8 | Corte na desaceleracao | caindo | — | bicos desligados, so ar passando |

---

## 12. Como cada um dos 27 se mexe

Nenhum dos 27 pode ser um enfeite parado. Cada um tem um comportamento ligado ao
`theta` ou ao estado de operacao. Esta tabela e o contrato.

| # | Componente | O que anima | Sincronismo |
|---|-----------|-------------|-------------|
| 01 | Canister | vapor se acumula dentro; esvazia quando a purga abre | estado, nao theta |
| 02 | **MAF** | fluxo de ar acelera com a carga; **pulsa a cada 180 graus** porque cada admissao puxa uma golfada | theta |
| 03 | **ECU** | pulsos saindo pelos fios no instante exato de cada bico e cada bobina | theta |
| 04 | OBD2 | inerte; so pisca se um scanner conectar | evento |
| 05 | MIL | apagada; acende no estado de falha. **Acende pela mensagem CAN, nunca por fio** | evento |
| 06 | Imobilizador | pisca no key-on, dialoga 1 s, depois cala | estado 2 |
| 07 | **CAN** | pacotes correndo o tempo todo entre ECU, painel, gateway e modulo do NOx | continuo |
| 08 | Valvula de purga | abre em ciclos de 1 a 2 Hz quando o motor esta quente e em carga | estado |
| 09 | **Borboleta** | angulo muda com a carga. **No estratificado abre 85 por cento** mesmo em carga baixa | estado |
| 10 | **Bomba de alta** | embolo sobe e desce **3 vezes por ciclo**, em theta 0, 240, 480 | theta |
| 11 | MAP | pressao **cai a cada admissao**; baixa no homogeneo, quase atmosferica no estratificado | theta + estado |
| 12 | EGR | abre em carga parcial, fecha na lenta e na plena carga | estado |
| 13 | **Sensor da galeria** | ponteiro **ondula** com as 3 bombeadas e as 4 injecoes | theta |
| 14 | Galeria | cor acompanha a pressao, 30 a 110 bar | theta |
| 15 | **Bico injetor** | dispara no angulo do modo: **380-460 no homogeneo, 640-680 no estratificado**. Jato conico de 6 furos | theta + modo |
| 16 | Detonacao | pico de onda logo apos a combustao, so quando ha detonacao | theta |
| 17 | **CKP** | trem de pulsos da roda **60 menos 2**: 58 pulsos e um vao, **duas vezes por ciclo** | theta |
| 18 | Modulo de combustivel | bomba girando continuo; nivel do tanque cai devagar | continuo |
| 19 | **Bobina** | carrega (dwell) e solta a faisca. **Ordem 1-3-4-2** | theta |
| 20 | **CMP** | **1 pulso a cada 720 graus.** E ele que diz a ECU em qual das duas voltas o motor esta. Sem ele nao existe injecao sequencial | theta |
| 21 | ECT | sobe do ambiente ate 90 graus ao longo do aquecimento | tempo real |
| 22 | **Lambda LSU** | oscila em torno de 1.0 no homogeneo; **salta para 2 a 3 no estratificado**; cai a 0.8 na regeneracao | modo |
| 23 | Pre-catalisador | aquece; so comeca a converter acima de 300 graus (light-off) | tempo real |
| 24 | EGT | temperatura acompanha a carga; dispara na regeneracao | estado |
| 25 | **Catalisador de NOx** | **enche de NOx durante o estratificado** e **esvazia no pulso rico**. Barra de ocupacao visivel | modo |
| 26 | Lambda LSF | plano em ~700 mV; da um salto durante a regeneracao | modo |
| 27 | **Bateria** | 12.6 V parada, **cai para 9.5 V na partida**, 14.2 V rodando | estado |

### 12.1 O que tambem tem que se mexer, e nao tem numero

| Peca | Animacao |
|------|----------|
| **Pistoes** | formula da secao 11.4, cada um na sua defasagem |
| **Virabrequim** | gira theta |
| **Bielas** | seguem moente e pino |
| **Comandos** | giram theta/2, cada came levantando a sua valvula |
| **Valvulas** | curva de levantamento da secao 11.5 |
| **Correia dentada** | anda com a polia, reducao visivel de 2 para 1 |
| **Flaps de turbulencia** | **fecham no estratificado, abrem no homogeneo.** E a peca que traduz o modo visualmente |
| **Eixos balanceadores** | giram a **2x** a rotacao do motor, em sentido contrario |
| **Alternador** | polia gira; so gera acima da marcha lenta |
| **Motor de partida** | pinhao avanca e engata a cremalheira **so no estado 3** |
| **Fluxo de ar** | particulas azuis: caixa de ar, MAF, borboleta, coletor, cilindro |
| **Fluxo de combustivel** | particulas amarelas: tanque, 2600 mm de linha, bomba de alta, galeria, bico |
| **Fluxo de escape** | particulas: cilindro, coletor, pre-cat, cat de NOx, silenciosos, ponteira |
| **Semieixos e rodas** | giram com a rotacao dividida pela marcha |

### 12.2 A prova de que esta tudo certo

Antes de dizer que a cena esta pronta, verifique nesta ordem:

1. Em `theta = 0`, os quatro cilindros mostram **BALANCO, ESCAPE, ADMISSAO,
   CRUZAMENTO** nos cilindros **1, 2, 3, 4** respectivamente
2. As bobinas acendem na ordem **1-3-4-2**, uma a cada 180 graus
3. Nenhuma valvula toca o pistao em nenhum angulo (o motor e interferente de verdade,
   mas na animacao nao pode cruzar)
4. O curso medido na tela da exatamente **92.8 mm**
5. A bomba de alta da **3 golpes** enquanto os bicos dao **4 disparos**
6. O CMP da **1 pulso** enquanto o CKP da **2 sequencias** de 58 dentes
7. Trocando de homogeneo para estratificado, **so muda o angulo da injecao e as flaps**.
   O resto do motor continua igual

---

## 13. Termos de busca para foto de referencia

Cole no Google Imagens. Estao em alemao de proposito: os catalogos alemaes trazem foto
de peca isolada em fundo branco, que e o que serve para modelar.

### 11.1 Conjunto e vao do motor
```
2.0 FSI BLX Motor Schnittmodell
VW Golf 5 2.0 FSI Motorraum
Golf 5 GT 2.0 FSI Motorraum Uebersicht
Bosch MED 9.5.10 Systemuebersicht Blockschaltbild
VW SSP 279 Motor 2.0l FSI Selbststudienprogramm
VW SSP 318 Der Golf 2004
EA113 2.0 FSI Kurbeltrieb Kolben Mulde
FSI Kolben Mulde Schichtladung Querschnitt
Golf 5 Unterboden Auspuffanlage komplett
Golf 5 Kraftstofftank Sattaltank 55 Liter
PQ35 Plattform Bodengruppe
```

### 11.2 Peca a peca
```
01  Aktivkohlebehaelter Golf 5
02  Luftmassenmesser Bosch HFM5 Golf 5 2.0 FSI
03  Motorsteuergeraet Bosch MED 9.5.10 Golf 5
04  OBD2 Diagnosebuchse 16 polig Golf 5
05  Kombiinstrument Golf 5 Motorkontrollleuchte
06  Wegfahrsperre Leseantenne Zuendschloss VAG
07  CAN Bus Antriebsstrang orange Golf 5 J533
08  Magnetventil N80 Aktivkohlebehaelter VAG
09  Drosselklappe 2.0 FSI J338 EGAS
10  Hochdruckpumpe 2.0 FSI Nockenwelle HDP1
11  Saugrohrdrucksensor G71 VAG
12  AGR Ventil 2.0 FSI mit Kuehler
13  Kraftstoffdrucksensor G247 Rail 2.0 FSI
14  Kraftstoffverteilerrohr Rail 2.0 FSI Hochdruck
15  Hochdruck Einspritzventil HDEV Bosch 2.0 FSI
16  Klopfsensor G61 G66 VAG
17  Kurbelwellensensor G28 Geberrad 60-2
18  Kraftstofffoerdereinheit Golf 5 Tankgeber
19  Stabzuendspule VAG 4 Stueck
20  Hallgeber G40 Nockenwellensensor VAG
21  Kuehlmitteltemperatursensor G62 gruen
22  Bosch LSU 4.9 Breitbandlambdasonde 5 polig
23  Vorkatalysator Kruemmer 2.0 FSI
24  Abgastemperatursensor G235 VAG
25  NOx Speicherkatalysator NOx Sensor G295 J583
26  Bosch LSF 4.2 Lambdasonde 4 polig Nachkat
27  Autobatterie Schnittmodell 6 Zellen Bleiplatten
```

### 11.3 Subsistemas
```
Saugrohr 2.0 FSI Drallklappen N316
Zylinderkopf 2.0 FSI Schnitt Ventile
Zahnriemen 2.0 FSI Steuerzeiten Nockenwellenkette
Ausgleichswellenmodul 2.0 FSI Oelwanne
Getriebe 02Q 6 Gang Schnitt
Golf 5 Vorderachse Fahrschemel
Golf 5 Mehrlenker Hinterachse
```

---

## 14. Prompts de geracao de imagem

Se nao achar foto real. **Sufixo obrigatorio em todos:**

```
, isolated automotive part, studio product photo, neutral grey background,
three-quarter view, sharp detail, no text, no watermark, no hands, no car body
```

| # | Prompt |
|---|--------|
| 1 | black plastic activated carbon canister, rectangular box with three hose ports and a mounting bracket |
| 2 | hot film mass air flow meter, black plastic measuring tube with a side pod and a five pin connector |
| 3 | engine control unit, finned aluminium case with a large multi pin connector on the short side |
| 4 | 16 pin OBD2 diagnostic socket, black trapezoid shell with gold pins and a wiring pigtail |
| 5 | amber engine shaped warning symbol backlit on a dark instrument cluster face |
| 6 | immobiliser reader coil, plastic ring antenna with a two wire pigtail |
| 7 | twisted pair automotive CAN bus harness in orange, with a 120 ohm terminating resistor |
| 8 | small black cylindrical solenoid purge valve with two opposed hose spigots |
| 9 | electronic throttle body, aluminium bore with butterfly plate and integrated DC motor housing |
| 10 | single piston high pressure fuel pump, aluminium body, roller tappet base, solenoid regulator on top |
| 11 | intake manifold absolute pressure sensor, small black body with a pressure port and four pin connector |
| 12 | exhaust gas recirculation valve with integrated cooler, cast body, two flanges, electric actuator |
| 13 | fuel rail pressure sensor, stainless body with a hex nut and three pin connector |
| 14 | forged steel high pressure fuel rail, four injector cups, thick walls, one sensor port |
| 15 | high pressure gasoline direct injection solenoid injector, slim steel body, coloured o rings |
| 16 | piezoelectric knock sensor, donut shaped with central bolt hole and moulded cable |
| 17 | inductive crankshaft position sensor next to a 60 minus 2 tooth trigger wheel |
| 18 | in tank fuel pump module, plastic swirl pot with electric pump, float arm and top flange |
| 19 | pencil coil on plug ignition coil with integrated ignitor and rubber spark plug boot |
| 20 | hall effect camshaft position sensor, compact black body with flange and three pin connector |
| 21 | coolant temperature sensor, green plastic body with brass tip and metal retaining clip |
| 22 | wideband planar lambda sensor, stainless hex body, slotted protection tube, five wires |
| 23 | close coupled catalytic converter cut open showing the ceramic honeycomb monolith |
| 24 | exhaust gas temperature sensor, long thin stainless probe with hex nut and braided lead |
| 25 | NOx storage catalyst, large stainless underbody canister cut open, with a NOx sensor in the inlet pipe |
| 26 | narrow band planar lambda sensor, stainless hex body, four wires |
| 27 | 12 volt lead acid battery cut in half showing six cells with lead plates and electrolyte |

### Prompt do motor completo
```
cutaway technical illustration of a 2005 Volkswagen 2.0 FSI EA113 inline four
cylinder gasoline direct injection engine, transverse mounting, cast iron block,
aluminium DOHC 16 valve head, four coil on plug ignition coils, high pressure fuel
pump driven by a three lobe cam on the intake camshaft, forged high pressure fuel
rail with four side entry injectors aimed at bowl shaped piston crowns, long runner
plastic intake manifold with tumble flaps, close coupled catalytic converter on the
exhaust manifold, timing belt end visible, half of the engine sectioned to reveal
one piston, connecting rod and crankshaft, neutral grey background, engineering
diagram style, no text, no watermark
```

### Prompt do carro em corte
```
cutaway technical illustration of a 2005 Volkswagen Golf Mk5 five door hatchback,
side view, body shown as transparent ghost, revealing the transverse 2.0 FSI engine
and six speed gearbox in the front bay, the full exhaust line running from the
exhaust manifold under the floor through a NOx storage catalyst, centre silencer
and rear silencer to twin tailpipes, a saddle shaped 55 litre fuel tank ahead of
the rear axle, and the fuel line running the full length of the floor,
engineering diagram style, neutral background, no text, no watermark
```

---

## 15. Ordem de construcao

Siga nesta ordem. Cada etapa fecha antes da proxima.

1. **Grid e origem.** Crie os eixos e marque os pontos da secao 1. Sem isso nada encaixa
2. **Rodas e eixos.** 4 rodas D 836 nas coordenadas dadas. Elas travam a escala
3. **Assoalho e longarinas.** A base estrutural
4. **Bloco do motor** no frame local, com os 4 furos e o virabrequim
5. **Pistoes, bielas, carter, eixos balanceadores**
6. **Cabecote, valvulas, comandos, tampa de valvulas**
7. **Correia dentada, polias, acessorios** (alternador, compressor, partida)
8. **Posicione o motor no mundo** com a rotacao da secao 5.2. Confira: velas em
   X 300/212/124/36, admissao para a frente, escape para tras
9. **Cambio, embreagem, semieixos, coxins**
10. **Coletor de admissao com flaps, corpo de borboleta, caixa de ar, MAF**
11. **Galeria de alta, 4 bicos, bomba de alta, sensor G247**
12. **Coletor de escape, pre-cat, e depois o escape inteiro ate a ponta** (secao 8)
13. **Tanque, modulo de bomba, filtro, e a linha de combustivel completa** (secao 9)
14. **Todos os sensores dos 27** nas coordenadas da secao 6
15. **Bateria, caixa de fusiveis, ECU, cabos grossos, chicote, CAN** (secoes 6, 7, 10)
16. **Suspensao, freios, direcao**
17. **Carroceria, vidros, painel, bancos**
18. **Os tres modos:** agrupe tudo em `Carroceria`, `Powertrain`, `Escape`,
    `Combustivel`, `Eletrica`, `Suspensao`, e escreva os toggles
19. **O relogio mestre.** Uma unica variavel `theta` de 0 a 720 alimentando tudo (secao 11.1)
20. **Sincronismo mecanico.** Virabrequim, pistoes pela formula da secao 11.4, bielas,
    comandos em theta/2, valvulas pela curva da secao 11.5.
    **Pare aqui e valide contra a Aula 3** usando a checagem da secao 12.2
21. **Ignicao e injecao.** Bobinas em 1-3-4-2, bicos nos dois modos (secoes 11.6 e 11.7)
22. **Os 27 vivos.** Cada componente animado conforme a tabela da secao 12
23. **Os estados de operacao** e os botoes para trocar entre eles (secao 11.9)

Hierarquia de grupos sugerida:
```
Carro
├── Carroceria
│   ├── Estrutura
│   ├── Painéis
│   └── Vidros
├── Powertrain
│   ├── Motor
│   │   ├── BlocoEInterno   (visivel so no modo C)
│   │   ├── Cabecote
│   │   ├── Admissao
│   │   ├── Ignicao
│   │   └── Acessorios
│   └── Cambio
├── Escape          (do coletor ate a ponteira)
├── Combustivel     (tanque, linha, galeria, bicos, canister)
├── Eletrica        (bateria, ECU, fusiveis, chicote, CAN)
└── Suspensao
```

---

## 16. Onde eu posso estar errado

Sendo direto, para voce nao gravar aula com erro:

**Confirmado de fonte publica:**
- Entre eixos 2578, comprimento 4204, largura 1759, altura 1470, plataforma PQ35
- Codigos de motor 2.0 FSI: AXW, BLR, BLX, BVY, BVX
- Freios do GT: 312 ventilado na frente, 286 solido atras, roda 7Jx17, 225/45 R17,
  saida de escape dupla
- **Ordem de ignicao 1-3-4-2** e a defasagem de 180 graus entre cilindros (isto ja e
  o conteudo da Aula 3 e nao esta em discussao)

**Confiante, mas sem fonte citada aqui:**
- Furo 82.5 e curso 92.8 (1984 cc bate), entre centros 88
- Bloco de ferro fundido, cabecote de aluminio, correia dentada no comando de escape
  com corrente curta ligando os dois comandos
- Modulo de eixos balanceadores no carter
- Designacoes VAG G28, G39, G40, G61, G62, G70, G71, G130, G235, G247, G295,
  N18, N30 a N33, N80, N205, N276, N316, J271, J285, J533, J583, J623

**Estimado por engenharia, nao dado de fabrica — confira contra foto:**
- **Todas as coordenadas globais deste documento.** Elas sao coerentes entre si e
  cabem no carro, mas nao vieram de desenho tecnico da VW. A geometria vai parecer
  certa; nao use para fabricar peca
- Altura do deck (223), comprimento de biela (144), inclinacao do motor (12 graus)
- Posicao exata da caixa de ar do BLX
- **De qual ponta do cabecote fica a bomba de alta** — coloquei no lado do cambio
- Comprimentos e diametros dos trechos de escape
- **Os angulos de comando da secao 11.5** (EVO 135, EVC 370, IVO 355, IVC 590) e os
  levantamentos de 10 e 9.5 mm. Sao valores tipicos de motor 16V de aspiracao natural
  dessa epoca, nao a ficha do BLX. **Servem para a animacao ficar correta e coerente**,
  mas nao cite numero de comando na narracao da aula sem confirmar
- Os avancos de ignicao da secao 11.6 e as janelas de injecao da secao 11.7. As
  **janelas estao certas em conceito** (homogeneo injeta na admissao, estratificado
  injeta no fim da compressao) — os graus exatos sao ilustrativos

**Duvida real que muda a aula:**
- Se o sensor EGT do BLX e **PTC ou termopar**. A cena 24 hoje ensina PTC.
  Isso precisa ser confirmado antes de gravar
- Se o 2.0 FSI europeu **sempre** saiu com catalisador acumulador de NOx ou se
  isso variou por mercado e ano. Se variou, precisamos fixar o ano exato
