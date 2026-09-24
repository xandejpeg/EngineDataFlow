# Ordem 01 — IA do Engine Data Flow

**ID:** LAB-001.  
**Marco:** M0 — contrato e base de transferência.  
**Coordenação:** GPT, conforme delegação de Alessandro em 14/09/2026.  
**Estado desta mensagem:** preparada para encaminhamento; não enviada nem executada pelo GPT.  
**Plano de referência:** `Plano_Mestre_Coordenacao_Real_Car_Lifestyle_Engine_Data_Flow.md`, versão 1.0.

## Objetivo

Preparar o laboratório para fornecer a primeira capacidade reutilizável ao Real Car Lifestyle, sem refazer o diagnóstico geral e sem construir o jogo neste repositório.

A coordenação escolheu Unity 6.3 LTS, C# e URP para o jogo, começando por Windows PC. Você será proprietária do núcleo C# de produção e dos dados de engenharia; a IA do jogo consumirá versões fixadas desse núcleo. O Engine Data Flow mantém seu projeto e sua interface Web. O TypeScript existente será referência inicial de comportamento, não uma segunda implementação que obrigatoriamente recebe todas as novidades do C#.

O destino proposto do pacote é `packages/com.realcar.vehicle-sim/`, dentro do EDF, com código de runtime independente de UnityEngine. Um runner separado permitirá executar cenários sem navegador. O perfil C# e de compilação deve ser compatível com a versão escolhida de Unity. Se já houver estrutura equivalente, reutilize-a e registre o mapeamento.

## Leitura inicial

Leia as instruções locais vigentes, este arquivo e as seções 2, 4–8 e 13 do plano mestre. Reutilize o diagnóstico e os inventários já produzidos. Consulte entrevistas somente se faltar uma definição relevante; não peça a Alessandro para explicar novamente o jogo.

O documento `Conceitos_Iniciais_Real_Car_Lifestyle.md` está interrompido na seção 13. Não o trate como único resumo. A matriz de cobertura do plano e as entrevistas preservam os requisitos.

## Trabalho deste pacote

1. **Registrar a base real.** Confira branch, SHA completo, alterações locais e diferenças relevantes desde o diagnóstico de `75eb71a94790`. Preserve trabalho existente. Não inspecione nem devolva segredos ou arquivos de ambiente.
2. **Mapear somente a fronteira útil.** Relacione `src/simulation`, os modelos do Golf, seus relógios e os consumidores. Identifique onde RPM é imposta e onde, se houver, é integrada a partir de torque e carga. Confirme como válvulas, ignição e sinais são tratados entre amostras.
3. **Escolher uma configuração coerente de ensaio.** Documente qual motor didático será usado para paridade e qual configuração corresponde ao gabarito do veículo. Se forem diferentes, mantenha dois fixtures identificados até resolver a correspondência. Não acople silenciosamente um motor de configuração diferente à malha do Golf.
4. **Materializar o contrato v0.1 candidato.** Produza esquema/dados mínimos com identidade, unidades, eixos, peças, terminais, parâmetros do motor e tipos de entrada/saída. Use a separação entre definição, instância e checkpoint do plano. Você é proprietária dos campos físicos; o jogo é proprietário do estado de mundo/campanha. Registre dúvidas pontuais no contrato para a coordenação, sem travar os campos já definidos.
5. **Preparar a transferência inicial.** Forneça um manifesto com origem, versões, arquivos e hashes. Inclua um pequeno conjunto exportável de definições e os cenários de referência do item seguinte. Não exporte todo o repositório.
6. **Preparar cenários discriminantes.** Um ciclo angular de referência; um caso de RPM imposta explicitamente identificado como ensaio; um caso projetado de rotação livre com carga; partida/corte de combustível; um circuito da bomba normal, aberto e com resistência de contato. Identifique quais já podem ser calculados e quais exigem trabalho novo. Saídas só podem ser chamadas de referência gerada se realmente forem produzidas.
7. **Preparar a prova de geometria.** Selecione uma peça estática, uma móvel com pivô, uma montagem pai/filho e um conector com vias. Registre caminhos reais, unidades, eixos, dimensões, IDs e hipótese de exportação. Gere o pacote pequeno quando as ferramentas e instruções locais permitirem. Não remodele o carro inteiro.

Você pode preparar os exportadores, o esquema e a estrutura mínima do pacote necessários a M0, preservando o laboratório. O porte amplo, novos solucionadores elétricos e remodelagem das cenas pertencem aos próximos pacotes, após a coordenação conferir esta entrega.

## Restrições e critérios técnicos

- Núcleo de produção com estado por veículo; um ativo não significa singleton global.
- SI na fronteira; conversão de mm/graus na borda. Declare pressão absoluta versus manométrica.
- Não descartar todo o estado interno ao salvar. Diferencie checkpoint de partida e redução de fidelidade.
- Não prometer resistência/corrente, scanner, DTCs ou lambda medida por cilindro com modelos que ainda não os produzem.
- Não considerar paridade com a versão didática como validação física.
- Não aplicar uma tolerância numérica universal; declarar tolerâncias por grandeza e comparação de fase.
- Não importar para esta tarefa autorizações de gastos ou credenciais de prompts antigos.
- Há relato de proibição anterior de Vitest e de execução de testes na sua sessão. Confira a instrução vigente; este arquivo não a remove. Se continuar aplicável, não contorne com outro runner. Entregue os cenários preparados e marque a verificação como não executada, continuando o trabalho permitido.

## Entregáveis

Entregue um relatório compacto `RCL_M0_LAB.md`, o contrato/definições v0.1 e o manifesto do pacote. Anexe scripts, fixtures e geometria apenas quando existirem e forem necessários à transferência. Informe caminhos reais, revisão de origem, conteúdo gerado e limitações.

M0 está pronto para revisão quando a IA do jogo conseguir entender e validar o pacote sem conhecer os detalhes internos do React/Three.js, e quando estiver explícito o que existe, o que falta implementar e o que não foi executado.

## Retorno à coordenação

```text
ID: LAB-001
Branch / SHA completo:
Estado: preparado | implementado | verificado | bloqueado
Resultado e artefatos:
Versão do contrato / origem do modelo:
Configuração de motor e relação com o gabarito:
Verificações executadas:
Verificações não executadas e motivo:
Divergências concretas do plano:
O que a IA do jogo já pode consumir:
Próximo pacote recomendado:
```

Próxima etapa prevista: porte verificado de um subconjunto do motor para o pacote C# e importação do conjunto representativo no jogo. Não substitua esta entrega por outro parecer genérico de engine.
