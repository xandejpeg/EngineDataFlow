# EngineDataFlow

Laboratorio virtual educacional de um motor de combustao interna **Ciclo Otto** (quatro tempos,
quatro cilindros em linha, ordem de ignicao 1-3-4-2) em 3D, com animacao mecanica sincronizada ao
angulo do virabrequim, fluxos dos sistemas, telemetria em tempo real, graficos, motor de falhas,
estudos de caso, trilhas de aprendizagem e mapa de fluxo de dados (sensores → ECU → atuadores).

O aplicativo roda **totalmente offline** apos a instalacao. Nenhum servico externo, chave de API ou
URL remota e necessario em tempo de execucao. Toda a geometria 3D e **procedural** (fallback padrao),
com uma camada de abstracao (`AssetRegistry` conceitual) preparada para trocar por GLBs no futuro.

> Simulador educacional. **Nao** e software de calibracao, CFD, FEA, dinamometro certificado ou
> ferramenta de reparo. Estimativas nunca sao medicoes reais. Veja a pagina **Sobre o modelo**.

## Requisitos

- Node.js **20+** e npm
- Navegador com WebGL 2

Opcional (apenas para o pipeline de criacao de ativos 3D, nunca para executar o app):
Blender, `uv`/`uvx`, Poppler, e chaves dos servicos MCP.

## Instalacao e execucao

```bash
npm install
npm run dev        # http://localhost:5173
```

## Comandos

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Type-check + build de producao |
| `npm run preview` | Servir o build de producao |
| `npm run test` | Testes unitarios/componentes (Vitest) |
| `npm run lint` | ESLint (0 warnings permitido) |
| `npm run format` | Prettier |
| `npm run extract-manual` | Extrai texto/imagens do PDF de referencia (Poppler, local) |

## Estrutura

```
src/
  app/          Shell, roteador, loop de simulacao
  components/   UI reutilizavel, hook de telemetria
  engine3d/     Cena 3D, montagem procedural, particulas, layout
  simulation/   Nucleo numerico (geometria, cinematica, termodinamica, falhas, telemetria)
  state/        Zustand (simulacao, UI, aprendizagem), frame bus
  features/     Rotas: lab, learn, components, cases, compare, dataFlow, variants, aboutModel
  data/         Conteudo pt-BR (componentes, licoes, casos, falhas, presets)
  persistence/  IndexedDB (Dexie)
  styles/       Tema e cores dos fluidos
  test/         Setup de testes
docs/           Especificacao, modelo fisico, modelo de falhas, fontes/limites, pipeline
scripts/        extract-manual.mjs
```

## Como usar

- **Laboratorio (`/`)**: orbite, aproxime, corte (X-ray), explas o conjunto, esconda bloco/cabecote,
  selecione cameras, ligue o motor, ajuste RPM/carga/combustivel/lambda/avanco, ative falhas, use o
  scrubber de 0 a 720 graus, passo a passo (1/5/10 graus) e velocidades 0,1x a 2x. Graficos
  sincronizados por angulo (pressao, p-V, temperatura, valvulas, torque).
- **Aprender (`/learn`)**: trilhas que controlam camera e simulacao, com perguntas de verificacao.
- **Componentes (`/components`)**: enciclopedia tecnica pesquisavel.
- **Estudos de caso (`/cases`)**: 18 casos de diagnostico interativo (aspecto → dados → causas →
  teste → correcao → prevencao).
- **Comparar (`/compare`)**: normal x falha nos mesmos graficos.
- **Data Flow (`/data-flow`)**: sensores, ECU, atuadores e linha do tempo de eventos.
- **Variantes (`/variants`)**: tecnologias alternativas do Ciclo Otto.
- **Sobre o modelo (`/about-model`)**: formulas, hipoteses, limites e valores de referencia.

## Como criar novos casos e licoes

- Novas falhas: adicione um `FaultDefinition` em [`src/data/faults.pt-BR.ts`](src/data/faults.pt-BR.ts)
  e o comportamento numerico em
  [`src/simulation/faults/faultModifiers.ts`](src/simulation/faults/faultModifiers.ts).
- Novos casos: adicione um `CaseStudy` em
  [`src/data/caseStudies.pt-BR.ts`](src/data/caseStudies.pt-BR.ts) referenciando o `faultId`.
- Novas licoes: adicione um `Lesson` em [`src/data/lessons.pt-BR.ts`](src/data/lessons.pt-BR.ts).

## Ativos 3D: procedural / glb / hibrido

Por padrao tudo e **procedural**. O pipeline opcional (Meshy → Blender → GLB otimizado) esta descrito
em [`docs/ASSET_PIPELINE.md`](docs/ASSET_PIPELINE.md). GLBs finais, quando gerados, ficam em
`public/models/engine/<component-id>.glb`. Falha de carregamento sempre cai para o fallback
procedural sem derrubar a cena. Chaves de API sao lidas de variaveis de ambiente e nunca entram no
bundle, logs ou screenshots.

## Escopo: apenas Ciclo Otto

Todo conteudo derivado do manual de referencia foi classificado como `OTTO_ONLY`, `DIESEL_ONLY` ou
`COMMON`. Conteudo `DIESEL_ONLY` foi ignorado. Nao ha ignicao por compressao, velas aquecedoras nem
bomba/injecao Diesel de alta pressao. Veja
[`docs/CONTENT_SOURCES_AND_LIMITS.md`](docs/CONTENT_SOURCES_AND_LIMITS.md).

## Licenca / direitos

Conteudo, geometria, textos, icones e casos sao originais. O PDF de referencia e qualquer material
extraido dele permanecem em `references/` (gitignored) e nunca sao publicados nem incluidos no bundle.
