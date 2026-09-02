# Especificacao do produto (escopo implementado)

## Motor principal

Ciclo Otto, quatro tempos, quatro cilindros em linha, ordem 1-3-4-2, 720° por ciclo, injecao
multiponto, ignicao coil-on-plug, duas valvulas por cilindro, comando 1:2, arrefecimento por
liquido, lubrificacao pressurizada, aspiracao natural. Turbo/intercooler/wastegate como modulo
opcional. Gasolina e etanol. Dimensoes, taxa de compressao e parametros editaveis em faixas seguras.

## Rotas

`/` laboratorio · `/learn` + `/learn/:lessonId` · `/components` + `/components/:componentId` ·
`/cases` + `/cases/:caseId` · `/compare` · `/data-flow` · `/variants` · `/about-model`.

## Laboratorio 3D

Orbita/zoom/pan com limites; restaurar camera; 11 cameras predefinidas; corte/X-ray graduavel;
explosao 0–100%; esconder bloco/cabecote; rotulos; particulas de fluxo com densidade ajustavel;
legenda de cores; pausa/reproducao; velocidades 0,1x–2x; passo 1/5/10°; scrubber 0–720° com marcas de
eventos; indicadores criticos flutuantes; resumo textual acessivel da cena.

## Nucleo unico de simulacao

Um `SimulationEngine` alimenta cena, graficos, paineis, alertas e casos com o mesmo frame. Loop com
sub-passos fixos e publicacao throttled para a UI (frame bus). Geometria, cinematica, termodinamica,
valvulas, combustao, torque, arrefecimento, lubrificacao, turbo, emissoes e telemetria.

## Controles

Basicos (RPM, carga, combustivel, lambda, avanco, temperatura ambiente, turbo/boost) e avancados
(diametro, curso, biela, taxa de compressao, eficiencia volumetrica, duracao da combustao, gamma,
atrito). Presets (normal sempre recuperavel) e toggles de falhas.

## Telemetria e graficos

Paineis de desempenho, cilindro, mistura/ignicao, riscos, arrefecimento/lubrificacao e emissoes.
Graficos: pressao×angulo, p-V, temperatura×angulo, elevacao de valvulas×angulo, torque×angulo, com
cursor por angulo e clique para posicionar a cena. Comparacao normal×falha.

## Falhas, casos e aprendizagem

Fault Engine com propagacao numerica; 18 estudos de caso com diagnostico interativo e pontuacao;
6 trilhas de aprendizagem que controlam camera e simulacao; enciclopedia de componentes pesquisavel;
modo Data Flow (sensores → ECU → atuadores + eventos).

## Persistencia e acessibilidade

IndexedDB (Dexie) para progresso, resultados e configuracoes. Navegacao por teclado, foco visivel,
ARIA, contraste, modo de movimento reduzido, resumo textual da cena, audio opcional (mutado por
padrao). Seletor de qualidade (baixo/medio/alto/auto).

## Ativos 3D

Estrategia hibrida orientada a ativos; padrao procedural. Camada preparada para `procedural`/`glb`/
`hybrid` por componente, com fallback procedural garantido.
