# Plano de implementacao

Registro do plano por fases (mantendo o projeto executavel ao final de cada fase).

## Fase 0 — Inspecao e fundacao ✅
Workspace inspecionado; PDF localizado; `.vscode/mcp.json`, `.gitignore`, `.env.example`,
`scripts/extract-manual.mjs` e docs iniciais criados; React + TypeScript (strict) + Vite + ESLint +
Prettier + Vitest configurados; tema e shell responsivo; estrategia procedural por componente.

## Fase 1 — Nucleo matematico ✅
Unidades, geometria, cinematica, fases dos quatro cilindros e ordem 1-3-4-2, valvulas, termodinamica
simplificada, combustao (Wiebe), torque, telemetria. 25 testes unitarios cobrindo PMS/PMI, curso 2r,
volumes, CR, comando 1:2, quatro tempos, ordem de ignicao, lambda, compressao/expansao, ausencia de
NaN, balanco energetico e propagacao de falhas.

## Fase 2 — Motor 3D funcional ✅
Contratos espaciais e layout parametrico; virabrequim, pistoes, bielas, comando e valvulas
procedurais sincronizados ao mesmo angulo; bloco em corte e cabecote; cameras, corte, explosao e
visibilidade; fallback procedural garantido.

## Fase 3 — Fluidos e sistemas ✅
Particulas de ar/escape por valvula; frente de chama; paineis de arrefecimento, lubrificacao,
mistura, ignicao; telemetria/cena/graficos sincronizados.

## Fase 4 — Interatividade e graficos ✅
Controles basicos e avancados; scrubber e eventos; graficos essenciais (pressao, p-V, temperatura,
valvulas, torque); presets e comparacao normal×falha.

## Fase 5 — Falhas e diagnostico ✅
Fault Engine com modificadores; grafo/cadeia causal; 18 estudos de caso de ponta a ponta com teste e
reparo virtual.

## Fase 6 — Aprendizagem e variantes ✅
6 trilhas e licoes guiadas; enciclopedia de componentes com busca; Data Flow; bancadas de variantes.

## Fase 7 — Persistencia, acessibilidade e desempenho ✅
IndexedDB (Dexie); seletor de qualidade; teclado/contraste/movimento reduzido; layout mobile com
paineis recolhiveis.

## Fase 8 — Qualidade final ✅
Testes, lint e build de producao passando; verificacao visual via Playwright (desktop e mobile);
PDF/imagens/segredos fora do bundle; documentacao alinhada ao codigo.
