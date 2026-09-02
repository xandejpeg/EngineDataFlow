# Matriz de leituras — multímetro HM-2090 na bancada da Aula 1

> Gerado a partir da **lógica real do simulador** (`src/features/courses/lessons/scenes/multimeterSim.ts`)
> e da ficha técnica (`src/data/multimeterHM2090.pt-BR.ts`).
>
> Para **cada caixa** da bancada, a tabela cruza as **13 posições da chave seletora** (linhas)
> com os **3 terminais** onde a ponta **vermelha** pode entrar (colunas). A ponta **preta** fica sempre no **COM**.

## Legenda

| Símbolo | Significado |
|---|---|
| `valor` | o que aparece no visor; _DC/AC/hFE/AUTO/..._ é o indicador de modo |
| ⭐ | combinação **correta** (chave + terminal) para aquela caixa |
| 🔔 | apita (bip de continuidade) |
| ⚠ | leitura inválida / cuidado (terminal ou escala errada, circuito energizado, aberto...) |
| ⛔ | **PERIGO** — pode danificar o multímetro e/ou o circuito |
| — | chave em **OFF** (desligado) |

> Observação: os botões **SELECT** (função laranja: DUTY % em Hz, °F em °C) e **RANGE** (faixa manual)
> não estão nesta matriz — ela usa a função primária e o **auto-range**.

## Posições da chave seletora

| Símbolo | Função | Terminal correto | Faixas (auto-range) |
|---|---|---|---|
| OFF | Desligado | — | — |
| V= | Tensao continua (DC) | VΩHz | 6, 60, 600, 1000 |
| V~ | Tensao alternada (AC) | VΩHz | 6, 60, 600, 750 |
| mV= | Milivolts DC | VΩHz | 600 |
| Ω | Resistencia | VΩHz | 600, 6000, 60000, 600000, 6000000, 60000000 |
| >\| | Teste de diodos | VΩHz | — |
| ))) | Continuidade (bip) | VΩHz | — |
| Hz | Frequencia | VΩHz | 100, 1000, 10000, 100000, 1000000, 10000000 |
| hFE | Ganho de transistor | VΩHz | 1000 |
| °C | Temperatura | VΩHz | 1000 |
| µA | Corrente continua baixa (microamperes) | mA/µA | 600, 6000 |
| mA | Corrente continua (miliamperes) | mA/µA | 60, 600 |
| A | Corrente continua (alta) | 10A | 10 |

---

## 1. Bateria 12 V

_Bateria automotiva carregada. Meça em V= (DC)._

**✅ Como medir certo:** chave em **V=** (Tensao continua (DC)) + terminal **VΩHz** → `12.60 V` _DC_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | ⭐ `12.60 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `OL mV` _DC_ ⚠ acima da escala (**OL**) — aumente a faixa | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | ⚠ `OL Ω` · circuito **energizado** — desligue para medir Ω | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | ⚠ `--- V` · circuito **energizado** — desligue para testar o diodo | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⚠ `--- Ω` · circuito **energizado** — não teste continuidade | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 2. Sensor 5 V

_Alimentação de sensor da ECU. Meça em V=._

**✅ Como medir certo:** chave em **V=** (Tensao continua (DC)) + terminal **VΩHz** → `5.000 V` _DC_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | ⭐ `5.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `OL mV` _DC_ ⚠ acima da escala (**OL**) — aumente a faixa | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | ⚠ `OL Ω` · circuito **energizado** — desligue para medir Ω | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | ⚠ `--- V` · circuito **energizado** — desligue para testar o diodo | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⚠ `--- Ω` · circuito **energizado** — não teste continuidade | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 3. Sinal TPS 0,85 V

_Sinal de sensor de baixa tensão (0,85 V). Meça em V= — em mV= estoura (OL)._

**✅ Como medir certo:** chave em **V=** (Tensao continua (DC)) + terminal **VΩHz** → `0.850 V` _DC_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | ⭐ `0.850 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `OL mV` _DC_ ⚠ acima da escala (**OL**) — aumente a faixa | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | ⚠ `OL Ω` · circuito **energizado** — desligue para medir Ω | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | ⚠ `--- V` · circuito **energizado** — desligue para testar o diodo | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⚠ `--- Ω` · circuito **energizado** — não teste continuidade | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 4. Rede AC 127 V

_Tensão alternada. Meça em V~ (AC). Também tem 60 Hz._

**✅ Como medir certo:** chave em **V~** (Tensao alternada (AC)) + terminal **VΩHz** → `127.0 V` _AC_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | ⭐ `127.0 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | ⚠ `OL Ω` · circuito **energizado** — desligue para medir Ω | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | ⚠ `--- V` · circuito **energizado** — desligue para testar o diodo | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⚠ `--- Ω` · circuito **energizado** — não teste continuidade | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `60.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 5. Resistor 220 Ω

_Componente passivo. Meça em Ω com o circuito desligado._

**✅ Como medir certo:** chave em **Ω** (Resistencia) + terminal **VΩHz** → `220.0 Ω` _AUTO_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | ⭐ `220.0 Ω` _AUTO_ | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | `0.220 V` _diode >\|_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | `OL Ω` ⚠ sem continuidade (condutor aberto) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 6. Fio bom

_Condutor íntegro. Teste em continuidade ))) — deve bipar._

**✅ Como medir certo:** chave em **)))** (Continuidade (bip)) + terminal **VΩHz** → `0.4 Ω` _BIP )))_ 🔔

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | `0.4 Ω` _AUTO_ | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | `0.000 V` _diode >\|_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⭐ `0.4 Ω` _BIP )))_ 🔔 | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 7. Fio rompido

_Condutor aberto. Em continuidade NÃO bipa (OL)._

**✅ Como medir certo:** chave em **)))** (Continuidade (bip)) + terminal **VΩHz** → `OL Ω`

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | `OL Ω` _AUTO_ ⚠ aberto (resistência ∞) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | `OL V` _diode >\|_ ⚠ sem junção (aberto / diodo invertido) | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⭐ `OL Ω` ⚠ sem continuidade (condutor aberto) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 8. Diodo retificador

_Queda direta ~0,55 V. Use a função de diodo >|._

**✅ Como medir certo:** chave em **>\|** (Teste de diodos) + terminal **VΩHz** → `0.550 V` _diode >|_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | `OL Ω` _AUTO_ ⚠ aberto (resistência ∞) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | ⭐ `0.550 V` _diode >\|_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | `OL Ω` ⚠ sem continuidade (condutor aberto) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 9. Termopar 90 °C

_Ponto quente do motor. Use a função °C (temperatura)._

**✅ Como medir certo:** chave em **°C** (Temperatura) + terminal **VΩHz** → `90 °C`

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | `OL Ω` _AUTO_ ⚠ aberto (resistência ∞) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | `OL V` _diode >\|_ ⚠ sem junção (aberto / diodo invertido) | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | `OL Ω` ⚠ sem continuidade (condutor aberto) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | ⭐ `90 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 10. Transistor NPN

_Ganho hFE ~180. Use a função hFE._

**✅ Como medir certo:** chave em **hFE** (Ganho de transistor) + terminal **VΩHz** → `180` _hFE_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | `OL Ω` _AUTO_ ⚠ aberto (resistência ∞) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | `OL V` _diode >\|_ ⚠ sem junção (aberto / diodo invertido) | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | `OL Ω` ⚠ sem continuidade (condutor aberto) | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⭐ `180` _hFE_ | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 µA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0 mA` _DC_ ⚠ sem corrente — a medição de corrente é em **série** | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0 A` _DC_ ⚠ sem corrente — a medição de corrente é em **série** |

## 11. Bico injetor (PWM)

_Pulsa a 50 Hz. Corrente ~420 mA (mA) ou frequência (Hz)._

**✅ Como medir certo:** chave em **mA** (Corrente continua (miliamperes)) + terminal **mA/µA** → `420.0 mA` _DC_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | ⚠ `OL Ω` · circuito **energizado** — desligue para medir Ω | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | ⚠ `--- V` · circuito **energizado** — desligue para testar o diodo | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⚠ `--- Ω` · circuito **energizado** — não teste continuidade | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `50.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `OL µA` _DC_ ⚠ acima da escala (**OL**) — aumente a faixa | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⭐ `420.0 mA` _DC_ | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0.42 A` _DC_ |

## 12. Bomba de combustível

_Corrente alta ~6,5 A. Use A no terminal 10A._

**✅ Como medir certo:** chave em **A** (Corrente continua (alta)) + terminal **10A** → `6.50 A` _DC_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | ⚠ `OL Ω` · circuito **energizado** — desligue para medir Ω | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | ⚠ `--- V` · circuito **energizado** — desligue para testar o diodo | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⚠ `--- Ω` · circuito **energizado** — não teste continuidade | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `OL µA` _DC_ ⚠ acima da escala (**OL**) — aumente a faixa | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `OL mA` _DC_ ⚠ acima da escala (**OL**) — aumente a faixa | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | ⭐ `6.50 A` _DC_ |

## 13. Sensor de baixa corrente

_Corrente ~120 µA. Use µA no terminal mA/µA._

**✅ Como medir certo:** chave em **µA** (Corrente continua baixa (microamperes)) + terminal **mA/µA** → `120.0 µA` _DC_

| Chave (posição) | VΩHz | mA/µA | 10A |
|---|---|---|---|
| OFF · Desligado | — | — | — |
| V= · Tensao continua (DC) | `0.000 V` _DC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| V~ · Tensao alternada (AC) | `0.000 V` _AC_ | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| mV= · Milivolts DC | `0.0 mV` _DC_ | ⚠ `--- mV` · terminal errado — use **VΩHz** | ⚠ `--- mV` · terminal errado — use **VΩHz** |
| Ω · Resistencia | ⚠ `OL Ω` · circuito **energizado** — desligue para medir Ω | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| >\| · Teste de diodos | ⚠ `--- V` · circuito **energizado** — desligue para testar o diodo | ⚠ `--- V` · terminal errado — use **VΩHz** | ⚠ `--- V` · terminal errado — use **VΩHz** |
| ))) · Continuidade (bip) | ⚠ `--- Ω` · circuito **energizado** — não teste continuidade | ⚠ `--- Ω` · terminal errado — use **VΩHz** | ⚠ `--- Ω` · terminal errado — use **VΩHz** |
| Hz · Frequencia | `0.0 Hz` _AUTO_ | ⚠ `--- Hz` · terminal errado — use **VΩHz** | ⚠ `--- Hz` · terminal errado — use **VΩHz** |
| hFE · Ganho de transistor | ⚠ `---` · precisa de um transistor no soquete hFE | ⚠ `---` · terminal errado — use **VΩHz** | ⚠ `---` · terminal errado — use **VΩHz** |
| °C · Temperatura | `25 °C` | ⚠ `--- °C` · terminal errado — use **VΩHz** | ⚠ `--- °C` · terminal errado — use **VΩHz** |
| µA · Corrente continua baixa (microamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⭐ `120.0 µA` _DC_ | ⚠ `--- µA` · terminal de corrente errado — use **mAμA** |
| mA · Corrente continua (miliamperes) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | `0.12 mA` _DC_ | ⚠ `--- mA` · terminal de corrente errado — use **mAμA** |
| A · Corrente continua (alta) | ⛔ **PERIGO**: corrente com a ponta em VΩHz = curto pelas pontas, pode queimar! | ⚠ `--- A` · terminal de corrente errado — use **10A** | `0.00 A` _DC_ |

---

## Análise — o que a matriz revela

- **DC × AC não se enxergam:** medir uma fonte DC em `V~` (ou uma fonte AC em `V=`) mostra `0` — o multímetro só responde à forma de onda daquela função. Ex.: a Bateria 12 V em `V~` marca `0.000 V`.
- **Escala importa:** o Sinal TPS 0,85 V em `mV=` estoura (`OL`), porque 850 mV passa da faixa de 600 mV; o certo é `V=` → `0.850 V`. A mesma lógica derruba a Bomba 6,5 A em `mA` (6500 mA ≫ 600 mA).
- **Nunca meça resistência/continuidade/diodo com o circuito ligado:** todas as caixas energizadas (bateria, sensores, rede, injetor, bomba) bloqueiam `Ω`, `)))` e `>|` com aviso de **circuito energizado**. Desligue antes.
- **⛔ O erro mais grave:** selecionar corrente (`µA`/`mA`/`A`) com a ponta vermelha ainda no terminal **VΩHz** cria um curto pelas pontas — risco de queimar o instrumento e o circuito.
- **Corrente é medição em SÉRIE:** encostar as pontas numa caixa sem corrente própria (ex.: resistor) na função `mA`/`A` mostra `0` — corrente não se mede "encostando em paralelo".
- **Cada caixa tem um terminal certo:** tensão/resistência/diodo/continuidade/Hz/°C/hFE → **VΩHz**; correntes baixas (µA/mA, como o injetor e o sensor de baixa corrente) → **mA/µA**; corrente alta (bomba) → **10A**.
- **Auto-range escolhe as casas decimais:** o número de dígitos após a vírgula muda conforme a faixa (6 → 3 casas, 60 → 2, 600 → 1, acima → inteiro).
