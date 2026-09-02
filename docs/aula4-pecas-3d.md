# Aula 4 — Pesquisa técnica por componente + preparação Meshy

Fonte: `v1.pdf` (37 slides, sensores) e `v2.pdf` (34 slides, sonda lambda / atuadores / flex) —
resumidos em `slides aula 4/v1.md` e `v2.md`.

Este documento faz duas coisas por componente:
1. **Aprofunda o conteúdo do slide** (função, construção, sinal elétrico, valores, falhas/teste);
2. **Descreve a geometria** e entrega o **prompt Meshy pronto** para gerar o GLB.

Nada aqui foi gerado ainda. Regras do [`ASSET_PIPELINE.md`](ASSET_PIPELINE.md) valem:
`meshy_check_balance` antes de gastar, registrar em `docs/assets/credit-ledger.json` e
`docs/assets/asset-provenance.json`, e a malha **nunca** define cinemática nem valor técnico.

> **STATUS — GERADO.** As 18 peças marcadas para gerar já foram criadas no Meshy 6
> (preview 20 cr + refine texturizado 10 cr = 540 cr; saldo 1120 → 580), baixadas em
> `public/models/parts/` e registradas em `src/engine3d/parts/partModels.tsx`
> (`PART_MODELS`, `PART_META`, `PART_GLB`, `PART_ANNOTATIONS`). A roda fônica 60-2 saiu
> **procedural** (0 cr). Os 5 itens marcados **NÃO GERAR** continuam cobertos por GLBs
> existentes. Tudo aparece na página `/parts`, agrupado por sistema.

---

## 0. Inventário: o que já existe vs. o que falta

Já em `public/models/parts/` (não regerar — regra 5 do pipeline):

| id | peça | cobre qual slide |
|---|---|---|
| `injector` | válvula injetora multiponto | v2/23, v2/25 |
| `ignition-coil` | bobina + vela | v2/30 |
| `throttle-body` | corpo de borboleta (cabo) | v1/12 |
| `map-sensor` | sensor MAP | v1/19-22 |
| `temp-sensor` | sensor NTC (serve para ECT) | v1/27-28 |
| `lambda-sensor` | sonda lambda genérica | v1/38, v2/2 |
| `knock-sensor` | sensor de detonação | v1/32-33 |
| `ckp-sensor` | sensor de rotação | v1/29-30 |
| `tps-sensor` | TPS | v1/15 |
| `ecu` | unidade de comando | v1/4 |
| `fuel-pump` | bomba de combustível | v1/6 |
| `cooling-fan` | eletroventilador | — |

**Atenção — três desses GLBs cobrem mais do que o nome sugere** (confirmado em `PART_META` e
`PART_ANNOTATIONS` de `partModels.tsx`):

- **`throttle-body`** já é o **motorizado**: o conceito registrado é *"aceleração eletrônica"* e os
  rótulos da peça são `Borboleta`, `Motor eletrico`, `Conector`. **Não precisa gerar o ETB.**
- **`temp-sensor`** está cadastrado como **`Sensor de temperatura (IAT/ECT)`** — o mesmo NTC serve
  para os dois slides. **Não precisa gerar o IAT.**
- **`lambda-sensor`** é a sonda genérica; banda estreita e banda larga são **visualmente idênticas**
  por fora (muda a contagem de fios). Só vale gastar numa variante se for o **corte didático**.

Mesma lógica para o **CMP**: por fora é um clone do `ckp-sensor` (corpo plástico, haste, conector
de 3 vias). E o **TMAP** é a fusão de `map-sensor` + `temp-sensor`, que já existem.

Descontando isso, **faltam de fato peças com forma própria** — lista revisada no §7.1.

---

# 1. Sistema de combustível

## 1.1 Filtro de ar — `air-filter` *(novo)*

**Slide:** v1/5.

**Aprofundamento.** O elemento é de papel de microfibra celulósica **impregnado com resina
fenólica** — a resina dá rigidez ao papel molhado e resistência à pulsação de admissão. O papel é
**plissado** para multiplicar a área frontal (um elemento de 25×20 cm com 40 pregas chega a ~1 m²
de área filtrante). Retém partículas de ~5 µm em diante com eficiência acima de 98 %.
A moldura é de **poliuretano injetado** diretamente sobre as bordas do papel, funcionando como
vedação da caixa. Filtro saturado = restrição → menor massa de ar → o **MAP acusa pressão mais
alta em plena carga** e o motor perde potência; num sistema **speed-density** (MAP) a mistura
tende a **enriquecer**, num sistema **MAF** não, porque o medidor mede o ar que realmente passou.
Não lavar nem soprar com ar comprimido pelo lado sujo — rasga a fibra.

**Geometria para o 3D.** Painel retangular chato, ~25×20×4 cm, com 30–45 pregas verticais em
zigue-zague, papel bege/amarelado, moldura de borracha preta em todo o perímetro com lábio de
vedação arredondado. Sem nenhum outro componente.

**Prompt Meshy**
> Automotive engine air filter element, rectangular flat panel, deep accordion pleated beige-yellow paper media with about 40 vertical folds, thick black rubber sealing frame moulded around the entire perimeter, isolated single object, clean product studio look, no background, no text.

---

## 1.2 Conjunto/flange da bomba no tanque — `fuel-pump-module` *(novo)*

**Slide:** v1/6.

**Aprofundamento.** É um módulo submerso porque o combustível **refrigera e lubrifica** a bomba —
por isso não se deve rodar com o tanque vazio (slide v2/33: além da sujeira, a bomba superaquece).
Composto por: **flange superior** (tampa com conectores elétricos e engates de mangueira),
**copo/cuba** com o **pré-filtro** (tela de nylon, ~70 µm), a **bomba elétrica** (roletes ou
turbina/periférica, 12 V, 4–8 A), o **medidor de nível** (braço + boia + potenciômetro de trilha
resistiva) e, nos sistemas *returnless*, o **regulador de pressão** e o filtro fino dentro do
próprio copo. A cuba mantém combustível junto à sucção em curvas e com pouco combustível.
Bomba de roletes gera pressão alta com boa vazão; a periférica é mais silenciosa.
Teste: pressão (§1.4), vazão (l/h no tempo) e corrente consumida — corrente alta indica bomba
"agarrando".

**Geometria para o 3D.** Cilindro vertical de plástico preto (~11 cm Ø × 20 cm alt.), flange
circular no topo com conector elétrico e dois bicos de mangueira, braço metálico lateral com
boia preta oval, tela de filtro branca na base.

**Prompt Meshy**
> In-tank fuel pump module assembly, black plastic cylindrical reservoir cup, round top flange with electrical connector and two hose barb outlets, side mounted metal float arm with black oval float, white nylon strainer filter at the bottom, isolated single automotive part, product studio look, no background.

---

## 1.3 Regulador de pressão (com retorno) — `fuel-pressure-regulator` *(novo)*

**Slide:** v1/10 e v1/11.

**Aprofundamento.** É uma **válvula diferencial**, não uma válvula de pressão fixa. A câmara
superior é ligada por mangueira ao **coletor de admissão**; assim a mola + o vácuo definem a
pressão **relativa ao coletor**, mantendo o **diferencial constante sobre o bico** (tipicamente
**3,0 bar** no multiponto e **1,0–1,1 bar** no monoponto/TBI). Em marcha lenta (vácuo alto) a
pressão de linha cai para ~2,5 bar; em plena carga sobe para ~3,0 bar. Isso é o que permite à ECU
usar **só o tempo de injeção** para dosar combustível.
Numeração do slide: 1 entrada, 2 retorno, 3 placa da válvula, 4 suporte da válvula, 5 diafragma,
6 mola, 7 conexão ao coletor.
Falhas típicas: diafragma furado → combustível sobe pela mangueira de vácuo (motor fumaça preta,
mangueira molhada); mola/sede presa → pressão alta e mistura rica.
Nos sistemas **returnless** o regulador foi para dentro do tanque e a referência de vácuo sumiu:
a pressão passa a ser fixa (~3,8 bar) e a ECU compensa por cálculo.

**Geometria para o 3D.** Corpo metálico em duas conchas prensadas (~5 cm Ø × 5 cm alt.), costura
circular no meio, tubo fino de vácuo saindo do topo, base com o-ring e furo de entrada.

**Prompt Meshy**
> Automotive fuel pressure regulator, two stamped metal shells crimped together at a circular seam, compact cylindrical body, small vacuum nipple tube on top, lower spigot with rubber o-ring seal, bare steel finish, isolated single part, product studio look, no background.

---

## 1.4 Testes de pressão e estanqueidade — *sem peça 3D nova*

**Slides:** v1/8 e v1/9.

**Aprofundamento (é conteúdo de bancada, vira animação/UI, não modelo).**
- **Pressão de trabalho:** manômetro em série na linha, chave ligada → pressuriza; motor em marcha
  lenta → lê o valor de norma (ex. 3,0 bar); soltar a mangueira de vácuo do regulador → a pressão
  **deve subir** ~0,5 bar (prova que o regulador responde).
- **Estanqueidade (retenção):** desligar o motor e observar o manômetro. A pressão deve cair pouco
  e **estabilizar** por vários minutos. Se cai a zero rápido, o vazamento está em um de três
  lugares — **válvula de retenção da bomba**, **regulador** (retorno aberto) ou **bico injetor**
  vazando. Pinçar a mangueira de retorno isola o regulador; pinçar a de alimentação isola a bomba.
- **Vazão:** medir l/h em recipiente graduado por tempo cronometrado.

Tabela do slide v1/7 = valores Bosch por referência de bomba (vazão, pressão, corrente).

## 1.5 Tubo distribuidor MPFI — `fuel-rail` *(novo)*

**Slide:** v2/17.

**Aprofundamento.** Funciona como **acumulador hidráulico**: o volume interno é grande o
suficiente para que a abertura simultânea/sequencial dos bicos não derrube a pressão. Sem esse
volume, cada pulso de injeção geraria oscilação e o último cilindro receberia menos combustível.
Também amortece o **martelo hidráulico** do fechamento da agulha. Alumínio extrudado ou aço; os
bicos entram em copos com o-rings e são presos por clipes; costuma ter o regulador numa ponta e a
válvula Schrader de teste na outra.

**Geometria.** Tubo reto de alumínio ~30 cm × 2 cm Ø, quatro copos cilíndricos descendo em
espaçamento igual, dois furos de fixação com flanges, um bico de teste no topo.

**Prompt Meshy**
> Automotive fuel injector rail, straight extruded aluminium tube about 30 cm long, four evenly spaced cylindrical injector cups pointing down, two mounting flanges with bolt holes, small test valve nipple on top, brushed aluminium finish, isolated single part, product studio look, no background.

---

## 1.6 Tubo distribuidor Flex Start — `fuel-rail-flexstart` *(novo)*

**Slide:** v2/18.

**Aprofundamento.** Solução brasileira para partida a frio em álcool **sem tanquinho de gasolina**.
Dentro do rail há uma **resistência elétrica (aquecedor)** de ~300–500 W que aquece o etanol a
~80–90 °C antes da partida, melhorando a **volatilidade** — o etanol tem calor latente de
vaporização quase 3× o da gasolina, por isso não pega frio abaixo de ~15 °C.
A ECU só libera a partida depois que o aquecedor atinge a temperatura (dai o atraso de 1–3 s ao
girar a chave em dia frio). Exige bateria e alternador em boas condições: o consumo é alto.
Legenda do slide: 1 aquecedor, 2 entrada de combustível.

**Geometria.** Igual ao rail comum, porém mais robusto, com um **corpo aquecedor cilíndrico**
integrado numa das extremidades e um conector elétrico de potência (2 vias grossas).

**Prompt Meshy**
> Automotive flex fuel injector rail with integrated electric fuel heater, straight aluminium rail with four injector cups, thick cylindrical heater housing at one end with a heavy duty two pin electrical connector, fuel inlet fitting, isolated single part, product studio look, no background.

---

## 1.7 Rail de injeção direta + sensor de alta pressão — `fuel-rail-gdi` e `rail-pressure-sensor` *(novos)*

**Slides:** v2/19 e v1/37 (= v2/1).

**Aprofundamento.** Na injeção direta a linha é dividida (slide v1/2): **baixa pressão** com bomba
elétrica no tanque até **6 bar**, e **alta pressão** com bomba mecânica acionada por um ressalto
extra do comando, chegando a **150–200 bar** (GDI gasolina) — no diesel common rail vai a 2000 bar.
O rail é um **tubo forjado de aço** de parede grossa, com tubos rígidos de aço rosqueados em cones
de vedação metal-metal (nada de o-ring nessa pressão).
O **sensor de alta pressão** é piezorresistivo/piezoelétrico: uma membrana de aço deforma sobre um
elemento cujo sinal, amplificado, sai como **0,5–4,5 V** proporcional à pressão. A ECU o usa em
**malha fechada** comandando a válvula reguladora de vazão da bomba de alta. O slide lembra que o
mesmo princípio de sensor mede a **pressão do fluido de freio dentro do módulo ESP**.

**Geometria (rail GDI).** Tubo de aço grosso e curto, quatro tomadas laterais com porcas cônicas,
sensor rosqueado numa ponta, suportes de fixação forjados.

**Prompt Meshy — rail GDI**
> Gasoline direct injection high pressure fuel rail, thick forged steel tube, four side ports with conical union nuts for rigid steel injector lines, threaded boss at one end for a pressure sensor, forged mounting brackets, dark steel finish, isolated single part, product studio look, no background.

**Prompt Meshy — sensor de alta pressão**
> Automotive high pressure fuel rail sensor, small stainless steel body with hexagonal wrench flats and a threaded port at the bottom, black plastic top housing with a three pin electrical connector, isolated single part, product studio look, no background.

---

# 2. Ar, borboleta e sensores

## 2.1 Corpo de borboleta motorizado — **NÃO GERAR: reaproveita `throttle-body`**

**Slide:** v1/13 (e a imagem v1/14).

**Aprofundamento.** É o **drive-by-wire** (ETC). Elimina cabo do acelerador **e a válvula IAC** —
a marcha lenta passa a ser feita abrindo a própria borboleta poucos graus. Dentro há um motor DC
com **redução por engrenagens** e uma **mola de retorno de segurança (limp-home)** que deixa a
borboleta numa abertura de ~6–7 %, suficiente para o carro andar devagar se o motor falhar.
O TPS agora é **duplo e redundante** (duas pistas, normalmente uma crescente e outra decrescente,
ou uma o dobro da outra) e a ECU compara continuamente; divergência acima da tolerância =
modo de segurança. O controle é em **malha fechada de posição**: pedal → ECU → PWM no motor →
TPS realimenta. Por isso o slide diz que **não é o motorista quem decide a abertura**: a ECU
considera carga, temperatura, emissões, controle de tração e ar-condicionado.
Limpeza: nunca forçar a borboleta com a mão e, após limpar, muitas ECUs exigem **reaprendizado da
posição de batente**.

**Geometria.** Corpo de alumínio com duto Ø ~55 mm e flange oval de 4 furos, borboleta interna
inclinada, carcaça plástica preta lateral cobrindo as engrenagens, conector de 6 vias.

**Prompt Meshy**
> Electronic drive by wire throttle body, cast aluminium housing with a round 55 mm bore and oval four bolt mounting flange, tilted throttle plate visible inside the bore, black plastic side cover housing the gear reduction and electric motor, six pin electrical connector, isolated single automotive part, product studio look, no background.

---

## 2.2 Sensor do pedal do acelerador — `app-sensor` *(novo)*

**Slide:** v1/16.

**Aprofundamento.** Dois canais **independentes e redundantes**. Nos potenciométricos, as duas
pistas recebem 5 V e devolvem tensões proporcionais ao curso; o slide dá o padrão mais comum:
**a pista 1 é o dobro da pista 2** (ex. 0,6 V / 0,3 V em repouso, subindo até ~4,0 V / 2,0 V a
fundo). Usar razão em vez de valores absolutos permite à ECU detectar erro mesmo se a alimentação
oscilar. Daí os **6 fios**: 2 alimentações, 2 massas, 2 sinais (versões de 4 e 5 fios compartilham
alimentação ou massa). Modelos mais novos usam **Hall sem contato**, que não desgasta a trilha.
Falha em um canal → a ECU aceita o canal íntegro com potência limitada; falha nos dois → marcha
lenta forçada. Também há um **switch de freio** redundante que zera o pedido de torque.

**Geometria.** Pedal completo de módulo: base plástica preta em cunha, braço do pedal metálico com
borracha estriada, caixa do sensor lateral, conector de 6 vias.

**Prompt Meshy**
> Automotive electronic accelerator pedal module, black plastic wedge shaped floor bracket, hinged metal pedal arm with ribbed rubber pad, integrated black sensor housing on the side with a six pin connector, isolated single part, product studio look, no background.

---

## 2.3 Sensor de temperatura do ar (IAT) — **NÃO GERAR: reaproveita `temp-sensor`**

**Slides:** v1/17 e v1/18.

**Aprofundamento.** **NTC** (coeficiente negativo): resistência cai quando a temperatura sobe.
Ordem de grandeza: ~**4,5 kΩ a 0 °C**, ~**2,5 kΩ a 20 °C**, ~**300 Ω a 80 °C**. Ele forma um
**divisor de tensão** com um resistor fixo dentro da ECU alimentado por 5 V — a ECU lê tensão, não
resistência. Ar frio = ar denso = mais massa de O₂ no mesmo volume, então a ECU **enriquece** e
**recua** um pouco o avanço (ar quente detona mais fácil, o EST atrasa o ponto).
O slide traz a estratégia de *fallback*: fora dos limites plausíveis, a ECU **substitui pelo valor
do sensor de temperatura da água**; se os dois falharem, adota um **valor fixo** de tabela.
Nos motores modernos aparece integrado ao MAP (TMAP, §2.4) ou dentro do MAF (TMAF).
A ponta do sensor deve ficar **no fluxo de ar**, nunca encostada na parede quente do coletor.

**Geometria.** Corpo plástico preto pequeno com flange de 2 furos, haste curta com a ponta do
termistor exposta em uma gaiola aberta, conector de 2 vias.

**Prompt Meshy**
> Intake air temperature sensor, small black plastic body with a two hole mounting flange, short probe with an exposed thermistor tip inside an open protective cage, two pin electrical connector on top, isolated single automotive sensor, product studio look, no background.

---

## 2.4 Sensor de temperatura e pressão absoluta (TMAP) — **NÃO GERAR: `map-sensor` + `temp-sensor`**

**Slides:** v1/23 e v1/24.

**Aprofundamento.** Junta num só corpo o **MAP** (piezorresistivo) e o **IAT** (NTC), com 4 vias:
5 V, massa, sinal de pressão, sinal de temperatura. O detalhe importante do slide é a
**calibração da pressão barométrica**: com a **ignição ligada e o motor parado** não há vácuo, logo
o MAP lê a **pressão atmosférica** — e a ECU **guarda esse valor na RAM** como referência de
altitude. O slide cita a leitura com borboleta ~70 % aberta (WOT) porque em plena carga a pressão
no coletor também se aproxima da atmosférica, permitindo **reaprender a barométrica com o motor
funcionando**. Perder essa referência (bateria desconectada + altitude diferente) causa mistura
errada até o próximo ciclo de chave.
Como o slide encerra: com pressão + temperatura a ECU calcula **densidade** e daí a **massa de ar**
(speed-density), dispensando o MAF.

**Geometria.** Corpo plástico preto compacto, flange de 1 furo, pescoço curto com dois o-rings e
a ponta do NTC saindo pelo centro, conector de 4 vias no topo.

**Prompt Meshy**
> Combined manifold absolute pressure and air temperature sensor TMAP, compact black plastic body, single bolt mounting tab, short cylindrical snout with two rubber o-rings and a small exposed thermistor tip in the centre, four pin connector on top, isolated single automotive sensor, product studio look, no background.

---

## 2.5 Medidor de massa de ar (MAF) — `maf-sensor` *(novo)*

**Slides:** v1/25 e a imagem v1/26.

**Aprofundamento.** Mede **massa**, não volume — por isso dispensa correção de altitude e
temperatura. Princípio do **fio/filme quente**: um elemento é mantido a uma temperatura fixa
(~120–180 °C) acima do ar ambiente; quanto mais ar passa, mais calor é levado embora e mais
corrente o circuito precisa injetar para manter a temperatura. Essa corrente é convertida em
**0–5 V** (Bosch HFM) ou em **frequência** (alguns GM/Ford).
O **filme quente** substituiu o fio quente por ser mais barato, mais rápido e não precisar do ciclo
de *burn-off*. Muitos trazem o **IAT integrado** (o slide chama de **TMAF**).
Sintomas de MAF sujo/falho: motor morre em marcha lenta, hesitação, mistura pobre em carga.
Nunca limpar com o dedo ou solvente comum — só limpador específico. Uma **entrada de ar falsa
depois do MAF** engana o sistema (ar não medido) e empobrece a mistura.

**Geometria.** Tubo plástico preto de ~7 cm Ø com flanges nas duas pontas, cartucho retangular do
sensor inserido pela lateral, tela de proteção interna, conector de 5 vias.

**Prompt Meshy**
> Hot film mass air flow sensor, black plastic tube housing about 7 cm diameter with flanges on both ends, rectangular sensor cartridge plugged into the side wall, protective mesh screen inside the bore, five pin electrical connector, isolated single automotive part, product studio look, no background.

---

## 2.6 Sensor de temperatura da água (ECT) — reaproveita `temp-sensor`

**Slides:** v1/27 e v1/28.

**Aprofundamento.** Mesmo NTC do IAT, porém em **latão** para conduzir calor e resistir ao
líquido; rosqueado no fluxo de arrefecimento (cabeçote ou caixa da válvula termostática). Sinal
cai de **~4,5 V (frio) para ~0,5 V (quente)**.
Os códigos citados no slide são a chave do diagnóstico e vale decorar a lógica:
- **circuito aberto/desconectado → tensão ALTA → a ECU "vê" motor FRIO → código 15**;
- **curto para a massa → tensão BAIXA → a ECU "vê" motor QUENTE → código 14**.
Consequência prática: sensor aberto faz o motor rodar **rico** o tempo todo (consumo, vela preta,
catalisador em risco); sensor em curto impede o enriquecimento de partida a frio (motor não pega
frio). É também o sensor que comanda o **eletroventilador** e a entrada em **malha fechada**.

*Sem nova geração — usar `temp-sensor.glb`.*

---

# 3. Rotação, fase e demais sensores

## 3.1 CKP + roda fônica — reaproveita `ckp-sensor`, novo `trigger-wheel`

**Slides:** v1/29 e v1/30.

**Aprofundamento.** O slide descreve o **indutivo**: bobina + ímã permanente. Ao passar o dente, o
fluxo magnético varia e induz uma tensão **alternada**; no instante em que o dente está
**perfeitamente alinhado** com o núcleo a variação é zero → **a tensão cruza o zero**. Esse
*zero-crossing* é justamente o ponto que a ECU usa como referência de tempo (mais preciso que o
pico). Amplitude cresce com a rotação (~0,5 V na partida, dezenas de volts em alta) — por isso o
indutivo não funciona bem em rotação muito baixa; o **Hall** entrega onda quadrada de amplitude
constante e funciona até parado, mas precisa de alimentação.
A roda fônica padrão é a **60-2**: 60 dentes de 6° menos 2 removidos. A falha (o "buraco" de dois
dentes) dá à ECU a **referência angular absoluta** do virabrequim. Contando dentes desde a falha,
a ECU sabe o ângulo com resolução de 6°.
Falha do CKP = **motor não pega** (sem sinal não há injeção nem faísca). Teste: resistência da
bobina (~500–1500 Ω no indutivo) e, melhor, forma de onda no osciloscópio — a falha dos dois
dentes tem que aparecer limpa.

**Geometria (roda fônica).** Disco de aço ~15 cm Ø com 58 dentes retangulares na periferia e um
vão liso onde faltam 2, cubo central com furos de fixação.

**Prompt Meshy**
> Engine crankshaft trigger wheel, flat steel disc about 15 cm diameter with 58 rectangular teeth around the rim and one wider gap where two teeth are missing, central hub with bolt holes, machined steel finish, isolated single automotive part, product studio look, no background.

---

## 3.2 Sensor de fase (CMP) — **NÃO GERAR: clone visual do `ckp-sensor`**

**Slide:** v1/31.

**Aprofundamento.** O CKP sozinho não distingue **compressão de escape**, porque o virabrequim dá
**duas voltas** para cada ciclo — daí a relação **1:2** citada no slide. O CMP lê uma referência
(dente único, meia-lua ou anel dentado) no **comando de válvulas** ou na engrenagem do
distribuidor, e informa qual das duas voltas está em curso.
Com o CMP a ECU pode fazer **injeção sequencial** (um bico por vez, na hora certa) e **ignição
sequencial**; sem ele o sistema cai para **injeção semissequencial/simultânea** e faísca perdida —
o motor **ainda funciona**, com mais consumo e partida mais demorada. Essa é a diferença
diagnóstica clássica: **CKP falhou = não pega; CMP falhou = pega e roda mal**.
Também é indispensável para **comando variável (VVT)**, onde a ECU compara CMP × CKP para medir o
avanço real do comando.

**Geometria.** Corpo plástico preto com haste cilíndrica, flange de 1 furo, ponta chata (Hall),
conector de 3 vias.

**Prompt Meshy**
> Camshaft position sensor, black plastic body with a cylindrical probe and a flat sensing tip, single bolt mounting flange with a metal collar, rubber o-ring on the shaft, three pin electrical connector on top, isolated single automotive sensor, product studio look, no background.

---

## 3.3 Sensor de detonação (KS) — reaproveita `knock-sensor`

**Slides:** v1/32 e v1/33.

**Aprofundamento.** Cristal **piezoelétrico** em anel, prensado por uma massa sísmica; a vibração
do bloco deforma o cristal e gera **tensão alternada de alguns mV a poucos volts**. A detonação
tem uma **assinatura de frequência** característica (≈ 6–8 kHz em motores 1.0–2.0; a frequência
cai com o aumento do diâmetro do cilindro). A ECU **filtra essa banda** e só "escuta" dentro de uma
**janela angular** após o PMS, para não confundir com ruído de válvula ou bomba.
Estratégia: detectou → **atrasa o ponto** (tipicamente 2–3° por evento, até ~10°), **cilindro a
cilindro**; cessou → devolve o avanço em **passos pequenos** até o mapa original. É isso que
permite o motor flex rodar com gasolina de octanagem baixa sem quebrar.
Detalhe de montagem que o slide não diz e é causa comum de falha: o **torque do parafuso é
crítico** (~20 N·m) — apertado errado o cristal não "ouve" e nasce um código de sinal baixo.

*Sem nova geração.*

---

## 3.4 Sensor de velocidade (VSS) — `vss-sensor` *(novo)*

**Slides:** v1/34 e v1/35.

**Aprofundamento.** Rosqueado na **caixa de câmbio**, no lugar do antigo cabo do velocímetro; lê
uma engrenagem/anel dentado da saída da transmissão. Pode ser **Hall** (onda quadrada 0/5 V ou
0/12 V) ou **relutância variável**. A ECU conta **pulsos por distância** — a ordem de grandeza
usual é de alguns milhares de pulsos por quilômetro, definida pelo fabricante.
O slide lista o uso do sinal: **marcha lenta** (a ECU distingue "parado no semáforo" de "descendo
em ponto morto"), **quantidade de combustível**, **válvula EGR** e **computador de bordo**.
O caso mais didático é o **corte em desaceleração (freio-motor)**: pé fora do acelerador +
rotação alta + **velocidade acima de um limiar** → a ECU **corta a injeção** completamente
(consumo zero); ao cair perto da marcha lenta ela restabelece o combustível para o motor não
morrer. Sem o VSS o sistema não confia nesse corte.
Falha típica: velocímetro morto, marcha lenta instável ao parar, câmbio automático trocando errado.

**Geometria.** Corpo plástico preto com rosca/flange metálica, engrenagem plástica pequena na
ponta, conector de 3 vias, forma em "L".

**Prompt Meshy**
> Vehicle speed sensor for a gearbox, black plastic L shaped body with a metal threaded collar, small plastic driven gear on the tip of the shaft, rubber o-ring, three pin electrical connector, isolated single automotive sensor, product studio look, no background.

---

## 3.5 Sensor inteligente de bateria (IBS) — `ibs-sensor` *(novo)*

**Slide:** v1/36.

**Aprofundamento.** Fica **no polo negativo** da bateria, em série com o cabo de massa. Mede três
grandezas: **tensão**, **corrente** (por um *shunt* de precisão — resistência baixíssima e
conhecida, lendo a queda de tensão sobre ele) e **temperatura**. Com isso um microcontrolador
calcula por modelo o **SOC** (estado de carga), o **SOH** (saúde) e a **capacidade de partida**, e
envia por **rede LIN** para o módulo de gestão de energia.
Aplicações citadas no slide:
- **Stop&Start** — o motor só desliga no semáforo se o IBS garantir carga suficiente para religar;
- **gestão do alternador** — regulação inteligente: o alternador é aliviado em aceleração
  (economia) e forçado em desaceleração (**recuperação de energia na frenagem**).
Consequência prática de oficina: nesses carros **trocar a bateria exige registrar a nova bateria**
no módulo; sem isso o sistema segue com o modelo da bateria velha e sub/sobrecarrega a nova.

**Geometria.** Terminal de bateria em latão/aço com parafuso de aperto, corpo plástico preto
achatado colado ao terminal, pequeno rabicho com conector de 2 vias.

**Prompt Meshy**
> Intelligent battery sensor IBS, automotive negative battery terminal clamp with a bolt, flat black plastic electronics housing moulded onto the clamp, short cable pigtail with a small two pin connector, brass and steel hardware, isolated single part, product studio look, no background.

---

# 4. Sonda lambda (o coração do v2)

## 4.1 Sonda de banda estreita: dedal × planar — `lambda-thimble` e `lambda-planar` *(novos)*

**Slides:** v2/2, v2/4, v2/7, v2/8.

**Aprofundamento.** É uma **célula galvânica de zircônia (ZrO₂)** com eletrodos de platina. A
zircônia conduz íons de oxigênio **acima de ~300 °C**; a diferença de concentração de O₂ entre o
gás de escape e o ar atmosférico de referência gera tensão (equação de Nernst).
A curva é **abrupta em λ = 1**: por isso ela só serve como **indicador liga/desliga**:
- **~900 mV** → quase 0 % de O₂ → **mistura rica**;
- **450 mV** → ponto de comutação ≈ λ 1;
- **~100 mV** → ~5 % de O₂ → **mistura pobre**.
A ECU usa isso em **malha fechada**, corrigindo o tempo de injeção em zigue-zague permanente
(por isso o sinal **oscila** — sonda parada num valor fixo é sonda morta).
**Malha aberta (open loop)**: partida a frio, sonda fria, plena carga e desaceleração — a ECU
**ignora** a sonda e usa mapa.
**Dedal (finger) × planar** — a diferença que o slide destaca:

| | dedal / finger | planar |
|---|---|---|
| elemento | cerâmica maciça em forma de dedal | finas lâminas cerâmicas laminadas |
| massa térmica | alta | baixa |
| tempo até operar | **> 1 minuto** | **~10 segundos** |
| aquecedor | alimentação direta | controlado por **PWM** |

O aquecimento rápido da planar é ambientalmente decisivo: a maior parte da emissão de um ciclo de
condução acontece antes da sonda entrar em malha fechada.
**Manutenção** (slide): 80–100 mil km para sonda **sem aquecedor**; mais para as aquecidas;
**banda larga até 250 mil km**. Envenenamento por silicone, chumbo ou óleo mata a sonda.

**Geometria.** Corpo hexagonal rosqueado M18 em aço, ponta protetora perfurada, isolador cerâmico
branco, cabo com 3 ou 4 fios e conector. Para o corte didático, gerar a **versão em corte** com o
elemento aparecendo.

**Prompt Meshy — sonda (dedal, 3 fios)**
> Automotive oxygen sensor, stainless steel hexagonal M18 threaded body with a slotted protective tip, white ceramic insulator, black cable with three wires ending in a small connector, isolated single part, product studio look, no background.

**Prompt Meshy — corte didático planar**
> Cutaway cross section of a planar oxygen sensor, steel threaded hex body sliced in half lengthwise to reveal the flat layered white ceramic sensing element and the internal heater strip inside the protective tip, educational cutaway model, isolated single part, product studio look, no background.

---

## 4.2 Sonda de banda larga — **NÃO GERAR: reaproveita `lambda-sensor`**

**Slides:** v2/6, v2/13, v2/14.

**Aprofundamento.** Resolve a limitação da banda estreita: ela mede **quanto** a mistura está rica
ou pobre, cobrindo de **λ ≈ 0,65 até ar puro**. Funciona com **duas células**:
- **célula de Nernst** (a mesma medição da banda estreita), medindo o O₂ numa **câmara de difusão**;
- **célula de bombeamento**, que injeta ou retira íons de oxigênio dessa câmara.
O circuito controla a **corrente de bombeamento (Ip)** de modo a manter a câmara **sempre em
λ = 1** (450 mV na Nernst). **Essa corrente é o sinal**: corrente positiva = estava pobre demais
(precisa tirar O₂), negativa = estava rica. É exatamente o gráfico dos slides v2/14 — mA no eixo
vertical, λ de 0,7 a 4 no horizontal, cruzando o zero em λ = 1.
Temperatura de operação **600–800 °C**, mantida por aquecedor PWM — muito mais crítica que na
banda estreita, porque a corrente depende da temperatura.
**Cores Bosch (lado do sensor)** — direto do slide:

| cor | função |
|---|---|
| cinza | positivo do aquecedor |
| branco | negativo do aquecedor (PWM) |
| amarelo | referência negativa do elemento sensor |
| preto | positivo do elemento sensor |
| vermelho | sinal |

São **6 fios do lado do chicote e 5 do lado do sensor** — o fio extra é o **resistor de calibração**
que vem dentro do conector, individual de cada sonda: **por isso não se troca o conector nem se
emenda a fiação de uma banda larga**.
Nunca testar banda larga com multímetro esperando 0–1 V: o sinal é corrente, e só faz sentido lido
pelo scanner (λ ou AFR) ou por osciloscópio no circuito certo.

**Prompt Meshy**
> Wideband air fuel ratio oxygen sensor, stainless steel hexagonal threaded body with slotted tip, white ceramic insulator, five colour coded wires grey white yellow black and red running to a rectangular black connector with a calibration resistor, isolated single part, product studio look, no background.

---

## 4.3 Teste com osciloscópio — *sem peça 3D*

**Slides:** v2/9, v2/11, v2/12.

**Aprofundamento.** O que se avalia no traçado da banda estreita:
- **amplitude** — deve varrer de ~**50–100 mV até ~900 mV**;
- **frequência de comutação** — pelo menos **1 a 2 travessias por segundo** a 2500 rpm; sonda
  "preguiçosa" (lazy) é a falha mais comum de envelhecimento;
- **tempo de resposta rico→pobre e pobre→rico** — deve ser < 100–300 ms;
- **teste forçado**: criar vazamento de vácuo → a sonda deve cair para perto de 100 mV; injetar
  combustível/aditivo → deve subir para 900 mV. Se não reage, é a sonda; se reage e a ECU não
  corrige, o problema é outro.
Sinal preso em ~450 mV fixo = sonda fria, aquecedor queimado ou fio partido (a ECU lê a tensão de
polarização dela mesma).

## 4.4 Sensor de NOx — `nox-sensor` *(novo)*

**Slide:** v2/16.

**Aprofundamento.** Fica **depois do catalisador** (ou depois do catalisador SCR). NOx nasce da
reação do N₂ com o O₂ do próprio ar sob **alta temperatura e pressão** — acima de ~1600 °C, exatamente
o que motores **diesel** e **injeção direta a gasolina de mistura pobre** produzem, e é por isso que
esses motores precisam do sensor (num motor a gasolina estequiométrico o catalisador de três vias
já resolve).
Construtivamente é uma **banda larga com duas câmaras**: a primeira bombeia o O₂ para fora, a
segunda decompõe o NOx e mede o oxigênio resultante — a corrente é proporcional à **concentração
de NOx em ppm**. Como exige eletrônica de precisão, vem com um **módulo próprio** que fala **CAN**
com a ECU (não é sensor de dois fios).
Uso: controle do **SCR/ARLA-32** (dosagem de ureia) e diagnóstico da armadilha de NOx (LNT).

**Geometria.** Sonda rosqueada com corpo hexagonal, cabo longo blindado até uma **caixa eletrônica
retangular preta** com conector, tudo numa peça só.

**Prompt Meshy**
> Automotive NOx sensor assembly, stainless steel threaded probe with hexagonal body and slotted tip, long shielded cable leading to a rectangular black plastic electronic control module box with a multi pin connector, isolated single part, product studio look, no background.

---

# 5. Atuadores

## 5.1 Válvula de marcha lenta / motor de passo (IAC) — `iac-valve` *(novo)*

**Slides:** v2/20, v2/21, v2/22.

**Aprofundamento.** Com a borboleta 100 % fechada o motor ainda precisa de ar para se manter vivo;
a IAC é um **desvio (by-pass)** calibrado ao redor da borboleta. Ela compensa toda carga parasita:
**ar-condicionado ligado, direção hidráulica em fim de curso, alternador carregando, motor frio,
marcha engatada no automático**.
No **motor de passo** (o do slide) há duas bobinas alimentadas em sequência; cada pulso move o
êmbolo cônico um **passo**. **Retrai = mais ar = mais rotação; estende = menos ar**. A ECU calcula
a posição-alvo a partir de **tensão da bateria, ECT e MAP** — ou seja, é **malha aberta com
correção**, e por isso ela precisa saber onde o êmbolo está.
É esse o ponto do slide sobre **ajuste/aprendizado**: a posição é **guardada na memória**; se a
bateria for desconectada ou a válvula removida, a memória mente e a marcha lenta sai errada. O
procedimento de reaprendizado que o slide descreve: depois que o motor passa de **~3500 rpm** e a
chave é desligada, a ECU **estende o êmbolo até o batente (posição zero)** e conta os passos de
volta até a posição desejada — uma **referenciação mecânica**, igual à de uma impressora.
Alternativa mais simples: a **IAC solenoide/rotativa** de 2 ou 3 fios, controlada por **PWM/duty**.
Em carros com borboleta motorizada (§2.1) a IAC **não existe mais**.

**Geometria.** Corpo cilíndrico com flange de 2 furos, ponta com **êmbolo cônico** saindo, corpo
plástico preto com conector de 4 vias.

**Prompt Meshy**
> Idle air control stepper valve, cylindrical black plastic and aluminium body with a two hole mounting flange and o-ring, tapered conical pintle protruding from the tip, four pin electrical connector on the side, isolated single automotive part, product studio look, no background.

---

## 5.2 Válvula injetora indireta — reaproveita `injector` (+ novo `injector-tbi`)

**Slides:** v2/23, v2/24, v2/25.

**Aprofundamento.** A ECU controla **só o tempo de abertura** (largura do pulso, ms) porque a
**pressão diferencial é constante** (§1.3) — vazão fixa × tempo = massa injetada. Marcha lenta usa
~2–3 ms; plena carga 10–15 ms. O **duty cycle** acima de ~85 % significa injetor no limite.
Bobina de **12–16 Ω** (alta impedância, acionamento direto por saturação) ou 2–3 Ω (baixa
impedância, precisa de *peak & hold*).
Componentes numerados do slide v2/25: 1 anel superior, 2 microfiltro, 3 conector, 4 enrolamento,
5 mola, 6 agulha, 7 anel inferior, 8 disco com furos (o *spray plate*, que define o cone e a
pulverização — 1, 4, 6 ou 12 furos).
**Monoponto (TBI)**: um único injetor **acima da borboleta**, pressão baixa **~1,0–1,1 bar**,
molhando o coletor inteiro (má distribuição, condensação nas paredes).
**Multiponto**: um por cilindro, ~3 bar, jato dirigido para a **costas da válvula de admissão**
ainda fechada — o calor da válvula ajuda a vaporizar.
O slide também cita a **válvula puramente mecânica** que abre com **3,8 bar** de sobrepressão
(sistemas K-Jetronic, injeção contínua) — não é comandada eletricamente.

**Geometria (injetor monoponto/TBI).** Injetor curto e gordo montado no topo de um corpo de
borboleta, com tampa metálica de retenção — gerar como **conjunto TBI monoponto**.

**Prompt Meshy — TBI monoponto**
> Single point throttle body injection unit, aluminium throttle body casting with a round bore and throttle plate, one large fuel injector mounted vertically in the centre of the top cap, integrated pressure regulator cap, electrical connectors, isolated single automotive part, product studio look, no background.

---

## 5.3 Injetor de injeção direta — `injector-gdi` *(novo)*

**Slide:** v2/28.

**Aprofundamento.** Vive **dentro da câmara de combustão**, exposto à combustão: por isso a
estrutura é totalmente **metálica**, com vedação por **anel de teflon** e assento cônico. Trabalha
com **50–200 bar** (contra 3 bar do multiponto) e precisa abrir em **fração de milissegundo**,
com corrente de pico de **6–12 A** seguida de corrente de manutenção — o driver é uma etapa de
potência dedicada (booster de ~65 V).
O slide destaca as **até 2 injeções por ciclo**: no modo **homogêneo** injeta cedo, na admissão;
no modo **estratificado** (carga parcial) injeta tarde, na compressão, criando uma **nuvem rica só
ao redor da vela** enquanto o resto do cilindro está pobre (λ até 3) — é o que o slide v1/2 chamava
de mistura **estratificada / homogênea pobre / homogênea**.
Vantagem extra: o combustível evapora **dentro** do cilindro e **resfria a carga**, permitindo
taxa de compressão mais alta. Desvantagem: **carbonização das válvulas de admissão** (não há mais
gasolina lavando a costas da válvula) e mais **material particulado**.

**Prompt Meshy**
> Gasoline direct injection fuel injector, slim all metal stainless steel body, precision machined tip with a small nozzle, white PTFE sealing ring near the tip, high pressure inlet fitting at the top with a metal filter, black plastic overmoulded coil section with a two pin connector, isolated single part, product studio look, no background.

---

## 5.4 Injetor piezoelétrico — `injector-piezo` *(novo)*

**Slide:** v2/29.

**Aprofundamento.** Substitui o solenoide por uma **pilha de centenas de lâminas de cristal
(quartzo/PZT)** que se alonga alguns micrômetros ao receber **100–200 V**. O curso minúsculo é
amplificado hidraulicamente para abrir a agulha.
Ganhos: tempo de resposta ~**5× menor** que o solenoide (abertura em ~0,1 ms), o que permite as
**até 5 injeções por ciclo** citadas no slide — pré-injeção (reduz ruído de combustão, o "batido"
do diesel), injeção principal, pós-injeção (regeneração do filtro de particulados). Também permite
dosar **quantidades mínimas** com precisão.
Custo alto e sensibilidade a tensão/temperatura; exige codificação (IMA/IQA) gravada no injetor e
**registrada na ECU** ao trocar.

**Prompt Meshy**
> Piezoelectric fuel injector, long slender stainless steel body, tall cylindrical actuator section housing the piezo stack, precision machined nozzle tip, high pressure inlet union nut on the side, two pin electrical connector on top, isolated single automotive part, product studio look, no background.

---

## 5.5 Bobina de ignição — reaproveita `ignition-coil` (+ novo `coil-pack`)

**Slide:** v2/30.

**Aprofundamento.** Transformador elevador: primário de poucas centenas de voltas (12 V, 6–8 A)
e secundário de dezenas de milhares (relação ~1:100), produzindo **15–40 kV** no colapso do campo.
Evolução que o slide organiza:
1. **Convencional** — uma bobina + **distribuidor** mecânico (rotor, tampa, cabos). Desgaste,
   perdas e avanço mecânico (contrapesos/vácuo).
2. **Estática com faísca perdida (DIS)** — **uma bobina para dois cilindros** em oposição
   (ex. 1-4 e 2-3): as duas velas soltam faísca ao mesmo tempo, uma no fim da compressão (útil) e
   outra no escape (perdida, sem efeito). Dispensa distribuidor e o sensor de fase.
3. **Bobina individual (COP, coil on plug)** — uma por cilindro, sobre a vela, sem cabo.
   Exige **CMP** para saber a volta certa; permite **avanço individual por cilindro** (usado junto
   com o sensor de detonação).
Em todos, **quem decide o avanço e o sincronismo é a ECU**, a partir de CKP+CMP+carga+detonação —
não há mais nada mecânico.

**Geometria (bobina dupla DIS).** Bloco retangular preto com 4 torres de cabo de vela, conector
lateral, base de fixação.

**Prompt Meshy**
> Wasted spark ignition coil pack, rectangular black moulded plastic block with four high voltage spark plug cable towers on top, side mounted multi pin electrical connector, metal mounting bracket with bolt holes, isolated single automotive part, product studio look, no background.

---

# 6. Sistema Flex (Magneti Marelli SFS)

**Slides:** v2/31, v2/32, v2/33. **Sem peça 3D nova** — é conteúdo de texto/animação.

**Aprofundamento.** O ponto central: o **SFS (Software Flexfuel Sensor)** eliminou o antigo
**sensor de combustível** (capacitivo, que media a constante dielétrica da mistura na linha).
Em vez de medir, a ECU **infere** o combustível pelo **erro de correção de curto/longo prazo da
sonda lambda**: abastecido com mais etanol, a mistura fica pobre (o etanol pede ~9:1 contra ~14,7:1
da gasolina), a sonda acusa, a ECU enriquece, e o desvio persistente identifica a proporção. Por
isso todo o reconhecimento é **software + sonda lambda**, com **os mesmos sensores e atuadores**
do motor a gasolina — a mudança é a centralina, o software, a partida a frio e o conector.
As **mudanças mecânicas** (slide v2/32) fazem sentido físico:
- **taxa de compressão 11,65:1** — o etanol tem octanagem maior, aguenta compressão maior, e é ela
  que recupera o rendimento perdido pelo menor poder calorífico;
- **sedes e guias de válvula** em material resistente — o etanol é **corrosivo** e mau lubrificante;
- **bicos e bomba de maior vazão** — precisa injetar ~**30 % mais volume** de etanol para a mesma
  energia;
- **coletor de plástico menos rugoso** e **galeria de plástico** — reduz filme de combustível na
  parede e resiste ao álcool;
- **partida a frio com gasolina** (tanquinho) ou o **rail aquecido** do §1.6;
- **furo calibrado após a borboleta** para o jato do sistema de partida a frio.
**Diagnóstico/manutenção** (slide v2/33): modo **recovery** — detectada uma avaria, o sistema adota
uma **proporção fixa de mistura** e um mapa conservador, para levar o carro ao mecânico. A ECU
**autotesta todos os sensores a cada partida**. Cuidados citados: não molhar a centralina na
lavagem, alarme/som mal instalados podem **cancelar a garantia** do sistema, não rodar com tanque
vazio, e **revisar corpo de borboleta e limpar bicos a cada 15 mil km**.

---

# 7. Plano de geração no Meshy

## 7.1 Lista revisada (depois de descontar o que já existe)

### Não gerar — já temos equivalente

| peça pretendida | por quê |
|---|---|
| corpo de borboleta motorizado | **`throttle-body.glb` já é o motorizado** (tem "Motor eletrico" nos rótulos) |
| sensor IAT | **`temp-sensor.glb` já é `Sensor de temperatura (IAT/ECT)`** |
| sensor de fase (CMP) | clone visual do **`ckp-sensor.glb`** — só muda o rótulo |
| TMAP | fusão de **`map-sensor` + `temp-sensor`**, ambos existentes |
| sonda banda larga | por fora é idêntica à **`lambda-sensor.glb`**; só faz sentido como corte didático |

**Economia: 5 peças × 30 cr = 150 créditos que não precisam ser gastos.**

### Grupo A — gerar (formas realmente novas)

| # | id proposto | peça | por que não dá para reaproveitar |
|---|---|---|---|
| 1 | `maf-sensor` | medidor de massa de ar | tubo de passagem com cartucho — não parece com nenhum sensor atual |
| 2 | `iac-valve` | válvula de marcha lenta (motor de passo) | corpo com êmbolo cônico saindo da ponta |
| 3 | `fuel-rail` | tubo distribuidor multiponto | peça longa com 4 copos, nada parecido no acervo |
| 4 | `fuel-pressure-regulator` | regulador de pressão | duas conchas prensadas + bico de vácuo |
| 5 | `injector-gdi` | injetor de injeção direta | totalmente metálico e esguio ≠ `injector.glb` (MPFI) |

**5 peças × 30 cr = 150 créditos.**

### Grupo A-proc — 0 crédito

| id | peça | por quê |
|---|---|---|
| `trigger-wheel` | roda fônica 60-2 | disco + 58 dentes retangulares é geometria trivial em `three.js` — **fazer procedural, não gastar crédito** |

### Grupo B — depois de avaliar o A

| id | peça |
|---|---|
| `app-sensor` | pedal do acelerador |
| `coil-pack` | bobina dupla (faísca perdida) |
| `air-filter` | filtro de ar |
| `fuel-pump-module` | conjunto da bomba no tanque (o `fuel-pump.glb` atual é só a bomba) |
| `vss-sensor` | sensor de velocidade |

**5 × 30 = 150 créditos.**

### Grupo C — opcionais

| id | peça |
|---|---|
| `fuel-rail-flexstart` | rail com aquecedor flex start |
| `fuel-rail-gdi` | rail de injeção direta |
| `rail-pressure-sensor` | sensor de alta pressão |
| `injector-piezo` | injetor piezoelétrico |
| `injector-tbi` | conjunto monoponto TBI |
| `nox-sensor` | sensor de NOx |
| `ibs-sensor` | sensor de bateria IBS |
| `lambda-planar` | corte didático da sonda planar (o único caso em que vale duplicar a lambda) |

**8 × 30 = 240 créditos.**

## 7.2 Parâmetros padrão

Seguindo o que já foi usado nas peças existentes (ver `credit-ledger.json`):

```
meshy_text_to_3d:
  ai_model: "meshy-6"          # sensores anteriores foram regerados em meshy-6
  target_formats: ["glb"]      # só GLB — é o que o PartViewer carrega
  topology: "quad"
  target_polycount: 20000      # malha econômica (regra 6 do pipeline)
  should_remesh: true

meshy_text_to_3d_refine:
  ai_model: "meshy-6"
  enable_pbr: false            # textura base 2K basta
  remove_lighting: true        # o app tem iluminação própria (Stage/Environment)
  target_formats: ["glb"]
```

Destino: `public/models/parts/<id>.glb`, registrar em `PART_GLB`, `PART_META` e
`PART_ANNOTATIONS` (`src/engine3d/parts/partModels.tsx`), e atualizar
`docs/assets/asset-provenance.json` + `docs/assets/credit-ledger.json`.

## 7.3 Custo

| opção | por peça | A (5) | A+B (10) | tudo (18) |
|---|---|---|---|---|
| meshy-6 preview (20) + refine (10) | **30 cr** | **150** | 300 | 540 |
| meshy-5 preview (5) + refine (10) | 15 cr | 75 | 150 | 270 |
| só preview meshy-6, sem textura | 20 cr | 100 | 200 | 360 |

Saldo estimado no ledger: **790 créditos** (`estimatedBalanceAfter`) — **a confirmar com
`meshy_check_balance` antes de qualquer geração**.

**Recomendação:** rodar o **grupo A (5 peças) em meshy-6 + refine = 150 créditos** e a roda fônica
procedural (0 cr), avaliar no `PartViewer`, e só então decidir B e C. O plano anterior de 10 peças
gastava 150 créditos em modelos que teriam sósia no acervo.

## 7.4 Ordem de execução

1. `meshy_check_balance` — confirmar saldo real.
2. Para cada peça do grupo A: `meshy_text_to_3d` (prompt deste documento) → `meshy_get_task_status`
   → avaliar o preview → `meshy_text_to_3d_refine` → `meshy_download_model` (glb) →
   `public/models/parts/<id>.glb`.
3. Registrar taskIds e créditos nos dois JSONs de `docs/assets/`.
4. Adicionar as entradas em `partModels.tsx` (o `PartViewer` já tem fallback procedural, então
   uma peça sem modelo procedural precisa de pelo menos um placeholder).
5. `npx tsc -p tsconfig.app.json --noEmit`, `npm run lint`, `npm run build`.

> **Nada será gerado sem autorização explícita** — os prompts acima estão prontos para colar.
