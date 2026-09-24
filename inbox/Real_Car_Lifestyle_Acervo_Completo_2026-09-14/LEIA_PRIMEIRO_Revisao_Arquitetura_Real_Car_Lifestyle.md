# Revisão de arquitetura — visão completa do Real Car Lifestyle

Mensagem do GPT que coordena o planejamento com Alessandro para a IA com acesso ao Engine Data Flow. Este pacote reúne os documentos produzidos nesta conversa, a resposta técnica recebida e as fontes anexadas. Leia os documentos antes de emitir a recomendação revisada. Não implemente nada nesta etapa.

## Por que estamos voltando à análise

Seu diagnóstico é útil como inventário do laboratório. Alessandro quer que a escolha de engine e arquitetura considere também o jogo completo descrito nas cinco entrevistas e no documento de conceitos. Esses documentos são necessários para essa decisão, embora não fossem necessários para identificar a stack local. Nosso pedido anterior foi estreito; agora ampliamos a avaliação.

O Engine Data Flow é o laboratório existente. O Real Car Lifestyle será outro projeto/diretório, ainda não criado. O alvo é PC/notebooks; hardware mínimo e referência visual permanecem abertos. Alessandro prioriza economia de tokens, automação com IA/MCP/Blender e uma base reaproveitável até a entrega final. Não quer um protótipo Web já destinado ao descarte. Isso não prova que Web seja inviável como produto. Unity/C#/URP foi uma recomendação provisória do GPT, não uma decisão aprovada. Online está reservado para estudo futuro.

## Leitura obrigatória e precedência

1. Leia `Indice_Real_Car_Lifestyle.md` para localizar o acervo.
2. Leia integralmente `Conceitos_Iniciais_Real_Car_Lifestyle.md` e as cinco entrevistas: `Entrevista_Real_Car_Lifestyle.md` e partes 2, 3, 4 e 5. Não se limite às sínteses.
3. Leia `Orientacao_Tecnica_Real_Car_Lifestyle.md`, observando a evolução das recomendações e a diretriz mais recente de evitar retrabalho.
4. Leia a correspondência e as fontes: `Mensagem_IA_Engine_Data_Flow.md`, `Solicitacao_Diagnostico_Tecnico_Engine_Data_Flow.md`, `Conversa_Original_Real_Car_Lifestyle.md`, `Analise_Original_IA_Engine_Data_Flow.md` e `Diagnostico_Recebido_Engine_Data_Flow_2026-09-14.md`.
5. A pasta `fontes_anexadas/` contém os três anexos originais. Os arquivos derivados de conversa/análise/diagnóstico preservam essas fontes para leitura; evite processar duas vezes conteúdos comprovadamente idênticos.

Falas mais recentes do criador prevalecem sobre antigas quando houver mudança explícita. Exemplos não fecham automaticamente um sistema. Recomendações das IAs não são decisões do criador. As respostas originais devem ser preservadas. Ao terminar, liste os documentos lidos e informe qualquer conteúdo inacessível ou truncado.

## O que a arquitetura precisa acomodar

Avalie conjuntamente os requisitos, sem redesenhar ou cortar a visão do criador:

- Simulação causal de motor, transmissão e movimento; elétrica e instrumentos; fluidos e térmica; falhas e diagnóstico.
- Desmontagem, peças com parâmetros próprios, adaptações, soldagem/fabricação, lataria, funilaria e chassi. Detalhes de PT e colisões foram adiados.
- Interfaces específicas de reparo e ações no POV normal; necessidade de consistência entre o defeito, a medição e o comportamento do carro.
- Duas cidades, rodovia, pistas, porto, trânsito e mais de 200 NPCs com rotinas numa cidade, além de circulação adicional. Encontros podem concentrar personagens e veículos.
- Profissões combináveis, árvores de perks, ferramentas, negócios, funcionários, compras/vendas, pagamentos, reputação, relações individuais, influência e internet interna do jogo.
- Relógio, energia/humor, experiência ao dormir, salvamento, morte definitiva e a exceção Efeito Borboleta.
- Modos carreira e laboratório jogável com isolamento absoluto do conteúdo criado pelo jogador; isso é diferente do laboratório externo de desenvolvimento.

Essa lista orienta a análise, mas não substitui a leitura integral.

## Pontos do diagnóstico a qualificar

1. **Duas pilhas separadas:** explique como formar uma fonte consistente de estado, unidades e tempo e como evitar duplicar o mesmo trabalho no laboratório e no jogo. Não unifique código agora.
2. **Golf procedural como “perda total”:** o diagnóstico não demonstrou impossibilidade de exportar as malhas geradas, preservar coordenadas/topologia ou adaptar os geradores. Avalie essas alternativas. Distinga malha estática, pivôs/hierarquia, identificação de peças e comportamento/animação. Se faltarem evidências, marque como investigação pendente.
3. **“Nada contribui para dirigir”:** diferencie ausência de dinâmica veicular de utilidade potencial do torque, estado do motor, dimensões e interfaces existentes para integrar essa dinâmica.
4. **Web “praticamente tudo / nenhuma reescrita”:** separe reutilização do laboratório de implementação dos sistemas que ainda não existem. Preservar a linguagem não garante ausência de refatoração, escalabilidade ou funcionamento do jogo completo.
5. **Portabilidade “mecânica”:** pureza ajuda, mas não comprova paridade física, estabilidade, tipos numéricos, serialização e integração com o relógio. Seu teste de paridade deve definir estado inicial, sequência de entradas, unidades, duração, tolerâncias absolutas e relativas e tratamento de grandezas próximas de zero. Não execute nem porte nesta etapa.
6. **Elétrica e mistura:** trate as limitações relatadas de corrente/resistência, falhas elétricas e lambda global como lacunas frente aos reparos desejados. Não prometa diagnóstico por cilindro com dados que não existem.
7. **Desempenho:** simular um veículo estacionado não comprova a carga de uma cidade. Proponha medições separadas de núcleo, gráficos, NPCs e veículos simultâneos. Frequências e simplificações são propostas sujeitas à validação; não reduza a fidelidade aprovada por conta própria.

## Entrega solicitada

Prepare uma resposta objetiva em Markdown, preferencialmente de até 2.000 palavras, sem repetir a entrevista inteira:

- Matriz: requisito relevante → estado atual → lacuna → efeito na arquitetura, com referência aos documentos e arquivos de código.
- Comparação fundamentada entre Unity/C#, Unreal/C++ e Web como produto desktop/navegador: implementação restante, reaproveitamento, assets procedurais, automação disponível, desempenho ainda não medido e manutenção. Não invente custos, prazos ou porcentagens.
- Sua recomendação principal, razões e condições que poderiam mudá-la. Evite escolher só pelo que já está escrito ou só pela presença de um MCP.
- Divisão proposta entre laboratório, núcleo de simulação, assets/dados e jogo; contratos e estratégia para validar mudanças entre projetos.
- Uma primeira versão pequena construída na tecnologia de entrega recomendada e que possa evoluir, com critérios de aceitação e teste do maior risco.
- No máximo três informações realmente indispensáveis que ainda dependam de Alessandro. Explique o impacto de cada uma e proponha uma hipótese provisória quando possível.

Economia de tokens: use referências e diferenças, não copie grandes blocos de código ou documentos. Reutilize o inventário já feito; confira apenas fatos que precisem de atualização. Indique branch/commit e mudanças relevantes desde o diagnóstico anterior.

Respeite as instruções locais e a restrição relatada sobre executar testes. Este pedido autoriza leitura e análise, não testes, benchmarks, instalações, conversões ou alterações de código. Apresente o plano dessas ações separadamente quando forem necessárias. Não crie o projeto do jogo nesta revisão.
