# Fontes de conteudo e limites

## Originalidade

Todo o conteudo do EngineDataFlow — geometria 3D, textos, icones, diagramas, casos de falha, licoes
e a identidade visual — e **original**, escrito e construido a partir de conceitos gerais de
engenharia de motores de combustao interna. As explicacoes foram reescritas com linguagem propria.

## Manual de referencia

O escopo tecnico foi informado pelo estudo de um manual tecnico de motores de combustao interna
(edicao 2019/2020). Esse PDF e qualquer material extraido dele:

- ficam apenas em `references/` (gitignored);
- **nunca** sao copiados, publicados ou redistribuidos;
- **nunca** entram em `public/`, `dist/`, no bundle de producao ou em rota acessivel;
- **nunca** sao dependencia em tempo de execucao.

Nao ha reproducao de paginas, fotografias, ilustracoes, logotipos, numeros de peca ou trechos longos.
Nenhuma marca ou simbolo de terceiros e usado (o logotipo do EngineDataFlow e original, em SVG).

## Separacao obrigatoria Otto x Diesel

Antes de usar qualquer texto, imagem, tabela ou caso, o conteudo e classificado como:

- `OTTO_ONLY` — usado.
- `COMMON` — usado apenas apos confirmar que se aplica corretamente ao motor Otto (lubrificacao,
  arrefecimento, componentes mecanicos gerais).
- `DIESEL_ONLY` — **ignorado**.

O EngineDataFlow e exclusivo do **Ciclo Otto** quatro tempos. Nao implementa ignicao por compressao,
velas aquecedoras, bomba/injecao Diesel de alta pressao nem qualquer funcionamento exclusivo do
Diesel. Em caso de duvida, o conteudo e descartado para nao confundir o modelo, as explicacoes, os
casos ou a visualizacao 3D.

## Limite cientifico

Simulador educacional interativo — nao e software de calibracao, CFD, FEA, dinamometro certificado ou
ferramenta de reparo. O modelo e simplificado, deterministico e dimensionalmente coerente.
Estimativas nunca sao apresentadas como medicoes reais. Valores de referencia do material didatico
sao exibidos com selo proprio e a nota de que podem variar fortemente conforme projeto, carga,
combustivel e medicao. Tolerancias e limites de servico reais dependem sempre do manual da
montadora/fabricante. Veja a rota **Sobre o modelo** (`/about-model`).

## Segredos

Chaves de API (ex.: Meshy) sao usadas apenas na etapa opcional de criacao de ativos, lidas de
variaveis de ambiente, e nunca sao copiadas para o codigo da aplicacao, logs, screenshots ou bundle.
`.env*` esta no `.gitignore` (exceto `.env.example`).
