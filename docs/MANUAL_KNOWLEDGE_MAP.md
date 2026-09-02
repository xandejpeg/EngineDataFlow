# Mapa de conhecimento do manual (indice conceitual)

Indice tematico que liga secoes conceituais do manual de referencia aos modulos do aplicativo.
Nao reproduz o conteudo do PDF; apenas mapeia assuntos para onde foram implementados. Rode
`npm run extract-manual` para gerar o indice de trabalho local (gitignored) e refinar este mapa.

Cada tema deve ser classificado como `OTTO_ONLY`, `COMMON` ou `DIESEL_ONLY` (este ultimo ignorado).

| Tema conceitual | Classificacao | Modulo do app |
| --- | --- | --- |
| Termodinamica do Ciclo Otto, quatro tempos | OTTO_ONLY | `simulation/thermodynamics`, `/about-model`, Trilha 2 |
| Cinematica biela-manivela, PMS/PMI/curso | COMMON | `simulation/kinematics`, `simulation/geometry`, Trilha 1 |
| Cilindrada e taxa de compressao | COMMON | `simulation/geometry`, `/about-model` |
| Pistao, pino, aneis | COMMON | `data/components`, `engine3d`, casos de aneis/folga |
| Cilindro/camisa e brunimento | COMMON | `data/components`, casos de contaminacao |
| Virabrequim, bronzinas, buchas | COMMON | `data/components`, caso de baixa pressao de oleo |
| Valvulas, sedes, guias, molas, comando, tuchos | COMMON | `simulation/valveTrain`, casos de sincronismo/valvula |
| Alimentacao e injecao (multiponto) | OTTO_ONLY | `simulation/intake`, `data/components`, `/variants` |
| Ignicao (coil-on-plug, avanco, detonacao) | OTTO_ONLY | `simulation/combustion`, casos de detonacao/pre-ignicao |
| Carburador, distribuidor, mono-point (historico) | OTTO_ONLY | `/variants` |
| Lubrificacao pressurizada | COMMON | `simulation/lubrication`, caso de oleo |
| Arrefecimento por liquido, termostatica | COMMON | `simulation/cooling`, casos de temperatura |
| Superalimentacao (turbo/intercooler/wastegate) | OTTO_ONLY (aplicado) | `simulation/turbo`, casos de turbo/wastegate |
| Combustao normal x detonacao x pre-ignicao | OTTO_ONLY | casos 1–3, Trilha 5 |
| Ignicao por compressao, bomba Diesel, velas aquecedoras | DIESEL_ONLY | **ignorado** |

> Observacao: uma unica fotografia raramente determina a geometria completa de uma peca. Toda
> interpretacao mecanica foi validada com o texto e com as relacoes geometricas do modelo, nunca
> apenas por imagem.
