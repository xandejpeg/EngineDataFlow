# Engine Data Flow — Diagnóstico para escolher a base do jogo

Mensagem preparada pelo GPT que coordena o planejamento do Real Car Lifestyle com Alessandro. Este pedido complementa a mensagem anterior de alinhamento. Se você já produziu o inventário solicitado, reutilize-o e atualize apenas o que mudou ou estiver faltando.

O Engine Data Flow continua sendo o laboratório. O jogo será outro projeto/diretório, ainda não criado. O alvo inicial é PC/notebooks, com simulação automotiva causal, reparos interativos, duas cidades e mais de 200 NPCs com rotinas em uma cidade, além de personagens circulantes. Online fica para estudo futuro.

Nossa prioridade é economizar tokens e evitar construir uma base destinada a ser descartada. Queremos usar IA, scripts e MCPs de engine/Blender para construir diretamente na tecnologia de entrega final. Unity com C#/URP é uma candidata, não uma decisão. Precisamos conhecer o custo real de aproveitar este laboratório antes de escolher.

**Faça uma inspeção somente de leitura. Não refatore, não instale dependências, não converta modelos e não crie o projeto do jogo.** Respeite as instruções do repositório. Não envie segredos, credenciais ou conteúdo de arquivos de ambiente.

Entregue uma resposta em Markdown, preferencialmente até 1.000 palavras, com estes pontos:

1. **Stack real:** linguagens, frameworks, renderização, bibliotecas de física e ferramentas de build. Informe versões declaradas nos manifests e os caminhos de origem, sem deduzir a stack pelos nomes das pastas. Identifique branch/commit quando disponíveis.
2. **Núcleo reaproveitável:** uma tabela com até dez módulos principais, caminho, função e dependências. Inclua motor/combustão, elétrica/instrumentos, fluidos/térmica e gabarito do veículo quando existirem. Distinga implementação funcional, aproximação e visualização.
3. **Separação da interface:** quais partes funcionam sem navegador/renderizador e quais dependem de DOM, React, Three.js ou outra interface? Dê exemplos de entradas, saídas, unidades e avanço do tempo do núcleo. Informe o que impede sua execução isolada.
4. **Assets:** formatos dos modelos, peças, materiais e animações disponíveis. Informe se a geometria é procedural ou vem de arquivos e o que já pode ser exportado. Não execute conversões nesta etapa.
5. **Evidências existentes:** testes, cenários de referência e medições de desempenho já disponíveis, com caminhos e limites. Diferencie teste encontrado de teste executado. Não faça benchmark novo nesta inspeção; se não há medição, diga isso.
6. **Custo de integração:** para Unity/C#, Unreal/C++ e uma base Web mantida como produto, indique o que seria reutilizado diretamente, adaptado ou reescrito. Fundamente no código inspecionado. Não invente percentual de reaproveitamento, orçamento de tokens ou prazo. Se alguma alternativa depender de avaliação externa, indique a lacuna.
7. **Próximo teste mínimo:** proponha uma única integração pequena que permita verificar o maior risco de reaproveitamento. Descreva dados de entrada e resultado observável para comparação com o laboratório. Apenas proponha, não implemente.

A conclusão deve resumir os principais riscos de migração e as informações que ainda faltam. A decisão de engine será tomada com esses dados, o hardware alvo e a apresentação visual desejada. Não precisamos que você repita o conceito inteiro do jogo nem que redesenhe sua arquitetura neste levantamento.
