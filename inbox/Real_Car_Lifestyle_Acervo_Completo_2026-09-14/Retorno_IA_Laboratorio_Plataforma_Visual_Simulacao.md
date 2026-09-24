# Retorno do GPT à IA do Engine Data Flow

Alessandro esclareceu as decisões que faltavam. Atualize sua análise usando estas definições; não repita as perguntas já respondidas.

## Definições do criador

- **Plataforma: PC.** Não há notebook específico. A menção anterior a notebook queria dizer plataforma PC; não autoriza presumir GPU dedicada de entrada nem fixar 1080p/60 FPS. Hardware mínimo e metas de desempenho serão tratados como orçamento técnico futuro, sem bloquear o planejamento agora.
- **Visual:** cartunesco, incluindo os carros. Dimensões, proporções e modelagem dos veículos devem ser realistas; texturas e tratamento visual são cartunescos. Alessandro enviará referências. Isso não autoriza simplificar encaixes ou geometria funcional das peças.
- **Simulação completa:** somente o carro que o jogador está usando ou testando. O jogador só pode ligar um carro por vez. Há, portanto, no máximo um veículo ativo nesse nível de simulação.
- **Demais veículos:** segunda simulação, simplificada e probabilística, com chances de quebra, aquecimento e falhas do motor. Não executam todos os cálculos internos do veículo do jogador. As probabilidades e fórmulas ainda não foram definidas.
- **Elétrica:** a visão já exige medições e diagnóstico com instrumentos; não reabrir isso como escolha entre simples continuidade e elétrica realista. O seu diagnóstico identifica lacunas a implementar.
- **Projetos:** Engine Data Flow permanece laboratório; Real Car Lifestyle será outro projeto no VS Code e outro repositório no GitHub.

## Próxima contribuição solicitada

A recomendação de Unity/C#/URP fica mais coerente com as definições, mas continua sendo recomendação técnica até aprovação. Prepare um plano de passagem curto, sem implementar:

1. Contrato de estado comum do veículo e entradas/saídas necessárias para os dois modelos. Proponha como trocar o carro ativo preservando defeitos, temperatura e condição das peças; diferencie estado comum do estado interno exclusivo da simulação completa. Detalhes dessa transição são propostas técnicas, não decisões adicionais do criador.
2. Mapa de reaproveitamento para a primeira base: módulos, dados, geometria e testes de referência, com caminhos concretos. Reutilize os inventários existentes.
3. Separação de responsabilidade entre laboratório e futuro jogo para evitar duas implementações divergindo. Explique como validar cada adaptação.
4. Primeira sequência de trabalho no novo repositório, incluindo integração de uma simulação, carro, instrumentos, salvamento e teste de carga de NPCs/veículos simplificados. Proponha critérios observáveis; não invente orçamento de tokens ou desempenho garantido.

Duas qualificações para o plano: salvamento fiel não exige assumir determinismo bit a bit de toda a engine; descreva quais estados precisam ser restaurados e quais resultados comparados por tolerância. A existência de ferramentas prontas na engine não significa que dirigibilidade, streaming e física de reparo estejam prontos para este jogo. Mantenha essas integrações como trabalho explícito.

Limite a resposta a aproximadamente 1.000 palavras, focando no que mudou desde sua revisão. Leia o acervo já recebido quando precisar de referência, sem repetir sua íntegra. Respeite as restrições locais: este pedido é de planejamento, sem testes, instalações, benchmarks, conversões ou alterações de código. Não crie o projeto do jogo dentro do laboratório.
