# Real Car Lifestyle — Orientação técnica inicial

**Versão:** 0.5. **Situação:** proposta para discussão, sem engine ou stack aprovadas. Nenhum projeto de jogo foi criado.

## O que foi confirmado

O lançamento inicial é para PC/notebooks. Mais de 200 NPCs deverão manter atividades e deslocamentos ao longo do dia em uma cidade, com outros NPCs circulando. Ainda faltam especificações do hardware alvo e expectativas visuais. O criador quer receber explicações e recomendações antes das perguntas técnicas.

**Diretriz vigente de 14/09/2026:** priorizar uma base reaproveitável na tecnologia de entrega final, evitando protótipo Web destinado ao descarte. Unity permanece recomendação provisória; nenhuma engine foi aprovada. Ver a última seção para a orientação vigente e as seções anteriores para seu histórico.

## Recomendação inicial

Proponho um jogo instalado para PC, começando por Windows, desenvolvido em Unity com C# e URP, e distribuído futuramente pela Steam. É uma hipótese de trabalho a validar com um protótipo e o notebook alvo; não uma decisão do criador. Não há demonstração de que a visão completa já caiba no orçamento de desempenho.

Steam é a loja e o canal de distribuição. Unity é a engine que organiza cenas, gráficos, física, áudio e interfaces. VS Code é o editor onde trabalharíamos no código. Essas ferramentas podem ser usadas juntas; o editor da engine também faz parte do desenvolvimento. Publicar na Steam é uma etapa posterior ao desenvolvimento e teste da versão instalada. [Steamworks](https://partner.steamgames.com/doc/gettingstarted).

URP oferece uma base gráfica com opções de otimização para várias classes de hardware. Minha escolha preliminar considera um jogo 3D para notebooks com simulações próprias; ela não garante bom desempenho em qualquer notebook. [Documentação URP](https://docs.unity3d.com/Manual/urp/urp-introduction.html).

## Navegador

Jogos de navegador podem ter 3D e muitos personagens. Eles baixam código e recursos e, em geral, executam a simulação no computador do jogador; colocar o jogo em um site não transfere automaticamente o processamento para um servidor. Para este projeto, proponho priorizar a versão instalada para reduzir restrições de plataforma. A documentação da Unity registra limitações específicas de acesso a arquivos, APIs e threads em C# na Web; isso não significa que todo processamento paralelo seja impossível. [Limitações da exportação Web da Unity](https://docs.unity3d.com/Manual/webgl-technical-overview.html).

O navegador pode continuar servindo para o laboratório e demonstrações isoladas. Isso não obriga o jogo final a usar a mesma tecnologia. Godot é outra engine possível; não foi descartada tecnicamente. A escolha precisa considerar também o código efetivamente disponível no laboratório. [Introdução ao Godot](https://docs.godotengine.org/en/stable/about/introduction.html).

## Proposta para os NPCs e o mundo

O número de NPCs, sozinho, não determina viabilidade. Importam frequência de decisões, caminhos, animações, colisões, quantidade simultaneamente visível e interação com veículos.

Proponho manter identidade, agenda, relações e estado persistente dos NPCs, com atualização em níveis de detalhe. Perto do jogador, executar deslocamento, animação e interações detalhadas. Longe, avançar trajetos e atividades de maneira mais econômica. As transições precisam preservar continuidade: o NPC que saiu para trabalhar deve continuar coerente ao ser reencontrado. A proposta ainda precisa ser discutida caso o criador queira acompanhamento físico integral de todos os trajetos.

Um teste deve cobrir tanto a população distribuída na cidade quanto uma concentração grande num encontro. Quantidades renderizadas, frequências de atualização e meta de FPS serão determinadas por medição, não por promessa.

Proponho estudar raciocínio semelhante para veículos: preservar estado mecânico e defeitos, concentrando os cálculos mais detalhados onde houver necessidade de condução, reparo ou medição. Qualquer simplificação precisa respeitar o comportamento causal e a precisão exigida pelos instrumentos. Nenhuma redução da física já foi aprovada.

## Papel das IAs e do laboratório

As ferramentas de IA ajudam a construir, revisar e testar código. Isso é diferente da lógica que controla os NPCs durante a partida. Rotinas, objetivos e diálogos contextuais podem ser programados sem chamar um modelo de linguagem para cada personagem. Não há proposta aprovada de depender de IA generativa em tempo real.

As demonstrações citadas pelo criador não foram fornecidas ou verificadas; não se pode concluir que provam a viabilidade deste jogo completo. O nome “Fable 5” não foi identificado com segurança. Não foi assumida disponibilidade de modelos específicos dentro do Copilot. [Visão geral do agente de código do GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent).

O Engine Data Flow permanece um laboratório separado. Antes de transportar código, precisamos inspecionar dependências, unidades, entradas/saídas e testes de referência. Proponho um núcleo de simulação separado das interfaces, conectado à engine por uma camada de integração. Reutilizar diretamente, portar ou adaptar cada componente depende dessa inspeção. Mudar de linguagem não significa descartar modelos e testes, mas não se deve prometer reaproveitamento literal de todo código.

## Como começar a implementar a visão

Projetar desde o começo as relações entre relógio, NPCs, veículos, peças, reparos, economia, carreiras e salvamentos. Construir uma primeira fatia integrada: garagem, carro funcional, reparo, trabalho com NPC, passagem do dia e salvamento, acompanhada de teste de carga com mais de 200 NPCs. Isso permite medir comunicação entre sistemas e desempenho antes de expandir o mapa e o catálogo. Não representa exclusão das demais ideias do jogo.

A referência de hardware é o próximo requisito: qual notebook deve rodar o jogo satisfatoriamente? Depois serão definidos apresentação visual, metas de resolução/FPS e requisitos da integração com o laboratório. O protótipo deverá ser medido no hardware alvo usando ferramentas de análise. [Unity Profiler](https://docs.unity3d.com/Manual/Profiler.html).

## Complemento — Base gerada por IA e execução em localhost (14/09/2026)

O criador pediu pesquisa rápida sobre vídeos de jogos gerados por IA a partir de um pedido e perguntou se uma base semelhante pode iniciar o projeto. Sim, é uma possibilidade técnica válida. A indicação anterior de Unity foi prematura como encaminhamento único: engine e stack permanecem abertas. A pergunta 042 sobre hardware continua pendente, sem impedir essa avaliação.

Foram encontrados os vídeos [GPT-6 Astra Is INSANE For Building Video Games (Full Test)](https://www.youtube.com/watch?v=HVrwoywwvdw), [AI Built a Tiny City Builder Game in ONE Prompt](https://www.youtube.com/watch?v=eFs260_9ZJs) e [ChatGPT 6 Astra vs Claude Fable 5.1 Make GTA 6](https://www.youtube.com/watch?v=YG6IFkQss20). A abertura direta das páginas do YouTube foi bloqueada por limitação de acesso; os vídeos não foram assistidos nem tiveram código ou desempenho verificados. Os títulos são os publicados, não comprovação independente de capacidades ou versões dos modelos.

Na [publicação do próprio Brendan Jowett](https://www.skool.com/brendan/gpt-6-astra-is-insane-for-building-video-games-full-test?p=ddb8bd09), o autor do primeiro vídeo informa usar Codex, Unreal Engine 5 e Blender. Isso comprova o relato de tecnologia pelo criador, não a completude dos jogos anunciados. O resultado indexado do vídeo Tiny City Builder cita Three.js; sem acesso ao projeto, não se confirma sua stack completa. O comparativo menciona Fable 5.1 no título; não foi identificado com segurança o vídeo específico de Fable 5.2 referido pelo usuário.

Localhost é o endereço do próprio computador. Não identifica uma engine. Um servidor local entrega os arquivos ao navegador durante o desenvolvimento. Vite é uma ferramenta que pode fazer isso, inclusive na porta 5173 por padrão; outras ferramentas usam outros endereços e portas. [Documentação Vite](https://vite.dev/guide/).

Uma base possível para avaliação é TypeScript + Three.js + Vite, com simulação separada da renderização e das interfaces. Three.js fornece a camada 3D; os sistemas do jogo e a simulação automotiva exigem implementação e integração próprias. Outra opção Web é Babylon.js. Essas são alternativas propostas, não tecnologias identificadas em todos os vídeos. [Three.js](https://threejs.org/manual/), [Babylon.js](https://www.babylonjs.com/).

É possível evoluir um projeto Web e também distribuí-lo como aplicativo de desktop usando Electron, que incorpora Chromium e Node.js. Esse empacotamento preserva a tecnologia Web e não transforma automaticamente o desempenho ou o código numa engine nativa. [Electron](https://www.electronjs.org/docs/latest/).

Recomendação revisada: avaliar uma primeira base jogável gerada com IA, no estilo solicitado, antes de fechar a engine. Um candidato é um protótipo Web separado do Engine Data Flow, com garagem, carro, NPCs com rotina e integração inicial de uma simulação real do laboratório. Medir também a carga de mais de 200 NPCs. É possível solicitar essa base em uma tarefa ampla, mas correção, profundidade e desempenho só podem ser afirmados após execução e verificação. Ainda não há autorização interpretada como ordem de criar o projeto neste pedido de pesquisa.

Se a base atender, poderá evoluir. Se houver necessidade de migração para outra engine, modelos, dados e testes poderão orientar a adaptação, mas cenas, interfaces e código podem exigir reescrita. Não se promete migração automática. A escolha depende da inspeção do laboratório, do hardware e das expectativas visuais, que ainda estão abertos.

## Diretriz — Reaproveitamento e economia de tokens (14/09/2026)

O criador prioriza economia de tokens e redução de retrabalho: deseja uma base que evolua até a entrega final e rejeita investir significativamente em um protótipo Web já destinado a ser abandonado. Quer aproveitar integrações MCP, incluindo Blender, para automatizar o desenvolvimento com IA. Isso não constitui escolha de engine nem comprovação de que uma versão Web seria inadequada. A recomendação passa a priorizar a escolha da tecnologia de entrega antes da construção ampla, com validação pequena e reaproveitável dentro dela.

A avaliação Web anteriormente proposta não deve virar um projeto paralelo descartável. A recomendação do assistente é construir a primeira versão reduzida dentro da engine pretendida para a entrega final. Unity + C# + URP continua sendo a preferência provisória para o PC/notebook, sujeita às expectativas visuais, ao hardware e ao custo de integração com o laboratório. Não há aprovação da stack. A existência de uma integração MCP não determina, sozinha, qual engine é adequada.

Integrações verificadas em fontes dos próprios projetos:

- [MCP for Unity, CoplayDev](https://github.com/CoplayDev/unity-mcp): projeto comunitário, não oficial da Unity, que documenta controle de cenas, objetos, assets, scripts, testes e automação do editor.
- [Blender MCP, ahujasid](https://github.com/ahujasid/blender-mcp): plugin comunitário para conectar assistentes ao Blender e controlar operações de criação/edição 3D.

Essas integrações permitem automatizar trabalho real nos programas; não garantem que todo o jogo fique correto ou pronto para publicação sem execução, revisão e medições. Nenhuma foi instalada ou conectada nesta conversa. Operações no computador do criador dependem de configuração e acesso no ambiente onde o agente trabalhará.

Estratégia proposta para reduzir tokens: manter um resumo técnico curto com decisões vigentes e um índice, consultar somente os módulos necessários em cada tarefa, reutilizar scripts de geração em vez de repetir muitas operações unitárias, preservar testes de referência e fazer alterações incrementais. A entrevista completa permanece como fonte histórica, sem precisar entrar inteira em cada pedido de código. Não há estimativa de economia quantificada.

Próximo passo técnico recomendado antes de criar a base: obter da IA do laboratório um inventário compacto da stack real, núcleo de simulação, dependências de interface, formatos de assets, testes e entradas/saídas. A partir disso, estimar a integração na engine escolhida e preparar uma especificação de implementação. Não foi enviada nova mensagem nem criado projeto nesta etapa.

## Próxima ação preparada

Foi preparada a solicitação [Solicitacao_Diagnostico_Tecnico_Engine_Data_Flow.md](sandbox:/workspace/scratch/3c45b6f9ce3f/Solicitacao_Diagnostico_Tecnico_Engine_Data_Flow.md) para Alessandro encaminhar à IA com acesso ao laboratório. Complementa o pedido de inventário anterior e pede reutilização de qualquer resposta já produzida. Solicita inspeção somente de leitura, com resposta compacta e evidências de código. Ainda não foi enviada e não há novo retorno recebido. Com o diagnóstico, o GPT deverá apresentar uma decisão técnica fundamentada e o plano de configuração dos MCPs e da base inicial.

## Diagnóstico recebido e revisão ampliada

Recebido `Diagnostico_Recebido_Engine_Data_Flow_2026-09-14.md`, com relato de inspeção na branch main, commit 75eb71a94790. A IA relata duas pilhas independentes, falta de dinâmica de condução, elétrica limitada e ausência de medições de desempenho. Estes são achados relatados, não verificados diretamente pelo GPT no repositório.

O criador solicitou que a arquitetura seja avaliada junto com todas as entrevistas e conceitos. A mensagem `LEIA_PRIMEIRO_Revisao_Arquitetura_Real_Car_Lifestyle.md` solicita essa revisão e qualifica conclusões excessivas do diagnóstico: geometria procedural não foi demonstrada como perda total, ausência de dinâmica não torna todo dado inútil para condução e reaproveitamento Web não equivale a ausência de trabalho novo. Nenhuma engine está aprovada. A nova revisão deve preservar a prioridade de economia de tokens e base reaproveitável.
