# Real Car Lifestyle e Engine Data Flow — Plano mestre de coordenação

**Versão:** 1.0 — 14/09/2026.  
**Responsável pela visão:** Alessandro Chiarelli Filho.  
**Coordenação:** GPT.  
**Objeto:** decisões técnicas, prioridades, dependências e primeiras ordens para as duas IAs.  
**Estado:** plano pronto; nenhuma implementação, instalação, publicação ou comunicação com as IAs externas foi executada nesta rodada.

## 1. Decisão de direção

Vamos começar o Real Car Lifestyle na tecnologia de entrega e melhorar o Engine Data Flow naquilo que viabiliza essa entrega. Os dois avançam em paralelo, com uma integração pequena e verificável a cada marco.

A decisão técnica de coordenação é **Unity 6.3 LTS + C# + URP, com primeira compilação para Windows PC**. Ela é tomada agora sob o pedido de Alessandro para decidir a abordagem; os registros anteriores de “engine ainda não aprovada” continuam corretos como histórico. Windows é o primeiro alvo de implementação escolhido pela coordenação, não uma nova limitação da visão de plataforma PC.

O Engine Data Flow conserva seu projeto e sua interface Web. Seu investimento imediato será em modelos verificáveis, contratos, dados, extração de geometria e um núcleo C# reutilizável. Não vamos converter todo o aplicativo educacional para Unity nem construir a cidade dentro dele.

O primeiro resultado integrado será **uma garagem e um pátio onde uma falha elétrica altera a alimentação do motor, aparece no instrumento, pode ser reparada e muda o funcionamento e a condução do mesmo veículo**. A infraestrutura de mundo, NPCs e carreira avança paralelamente. Esse cenário de desenvolvimento não altera o início da campanha: o personagem continua chegando sem carro.

O trabalho fica organizado em três papéis, dentro de dois repositórios:

| Papel | Responsabilidade imediata |
| --- | --- |
| IA do Engine Data Flow | Modelos físicos, dados de engenharia, núcleo C# compartilhável, cenários e evidências. |
| IA do Real Car Lifestyle | Projeto Unity, apresentação, interação, integração veicular, mundo, NPCs, carreira e persistência do jogo. |
| GPT coordenador | Contratos entre as frentes, ordem de execução, resolução de conflitos, revisão das entregas e atualização do plano. |

**Limite desta análise:** foram lidos os 19 MDs do acervo atual e o prompt histórico do Engine Data Flow. O código dos repositórios não estava disponível nesta sessão. Os achados de código são relatos da IA do laboratório, vinculados ao commit que ela informou; não são uma auditoria direta nem uma medição nova.

## 2. O que a revisão do acervo mudou

### 2.1 Precedência das informações

1. A visão e as correções mais recentes de Alessandro definem o produto.
2. Este plano define a abordagem técnica sob a delegação atual.
3. As entrevistas preservam o requisito original e ajudam a resolver ambiguidades.
4. Diagnósticos do laboratório descrevem implementação relatada, não toda a visão realizada.
5. Propostas antigas, exemplos e prompts históricos não se tornam requisitos novos automaticamente.

Não precisamos de outra entrevista geral nem de outro inventário amplo. A próxima inspeção nos repositórios deve conferir somente a base de trabalho, alterações desde o diagnóstico e os pontos necessários para a primeira entrega.

### 2.2 Problema confirmado no documento de conceitos

A versão atual de `Conceitos_Iniciais_Real_Car_Lifestyle.md` tem 609 linhas e 56.995 bytes. A seção 13 termina no meio de uma frase e passa diretamente para o esclarecimento da resposta 028. As seções 14–27 anunciadas no sumário não aparecem no corpo atual. Isso foi conferido também no arquivo materializado, não apenas na visualização de texto.

As entrevistas completas foram lidas para recuperar o contexto. Portanto, **o documento de conceitos não deve ser a única entrada das IAs**. Este plano e sua matriz de cobertura passam a ser a entrada operacional, mantendo as entrevistas como fontes. Reconstruir o documento de conceitos em uma versão separada é manutenção documental posterior; não será necessário reentrevistar Alessandro para fazê-lo.

### 2.3 Correções que passam a orientar a execução

| Afirmação ou proposta anterior | Tratamento vigente |
| --- | --- |
| “O motor já está pronto, basta envelopar.” | Há modelos didáticos e lacunas importantes; cada capacidade precisa de evidência. |
| “Scanner e diagrama já existem.” | A revisão do laboratório relata ausência de scanner e de tela de diagrama; são trabalho a implementar. |
| “Golf procedural é perda total.” | Cotas e identificação são aproveitáveis; exportação de malha, hierarquia e pivôs precisa ser demonstrada. |
| “Um único carro permite singleton.” | Um controlador limita a um ativo; o estado pertence à instância do veículo. |
| “FullSimState não é salvo.” | Save e troca de fidelidade são operações diferentes. Estados necessários à continuidade precisam ser preservados. |
| “Depois de carregar, basta esperar convergir.” | A retomada deve ser coerente desde a primeira observação e nos eventos seguintes. |
| “Paridade prova realismo.” | Paridade verifica o porte. Validade física exige verificações independentes. |
| “A engine já entrega dirigibilidade e cidade prontas.” | Ela oferece componentes; integração, comportamento, escala e acerto continuam sendo trabalho. |
| “Notebook específico, 1080p e 60 FPS já definidos.” | Plataforma PC confirmada; hardware mínimo e metas de produto ainda não foram fixados. |
| “Física completa de todos os carros.” | Um veículo usado/testado em detalhe; demais veículos com modelo simplificado. |
| “Há três modelos obrigatórios de fidelidade.” | Dois modelos do veículo. Frequências e representações visuais podem variar sem criar um terceiro modelo físico independente. |
| “O laboratório terá de ficar completo antes do jogo.” | Só as capacidades necessárias para cada integração antecedem sua utilização no jogo. |

O prompt de agosto descreve explicitamente um simulador educacional com aproximações, controles de RPM e índices heurísticos. Isso explica parte da distância para a ambição atual. Seu catálogo é fonte de trabalho; suas estimativas não devem virar medições profissionais apenas por serem portadas.

## 3. Base tecnológica escolhida

### 3.1 Jogo

A Unity apresenta a linha 6.3 LTS com suporte até dezembro de 2027. Vamos fixar um patch estável dessa linha no projeto, após conferir a disponibilidade e a compatibilidade das ferramentas no ambiente real. Não usar dependências flutuando em `latest`. [Fonte: versões Unity 6](https://unity.com/releases/unity-6).

| Camada | Decisão de coordenação |
| --- | --- |
| Runtime do jogo | Unity 6.3 LTS; C#; URP. |
| Primeira plataforma de build | Windows PC; demais plataformas de PC ficam para expansão. |
| Núcleo físico | C# independente de `UnityEngine`, com números de engenharia em `double`. |
| Dados | Definições e estados serializáveis, com esquema e versões explícitos. |
| Input | Ações configuráveis, separadas entre personagem, veículo e ferramentas; binds persistentes. |
| NPCs | Agenda persistente e navegação local, com atualização conforme relevância. |
| Assets | Geometria funcional controlada, materiais estilizados e importação verificável. |
| Persistência inicial | Local, versionada e transacional; sem backend obrigatório para começar. |
| Automação | Scripts reproduzíveis e ferramentas do editor; MCP quando já configurado ou instalado no ambiente autorizado. |

A escolha considera o conjunto do jogo: interação 3D, ferramentas, cidade, personagens, UI, física própria e manutenção por duas IAs. Não depende da alegação de que Web seria incapaz nem de um benchmark inexistente. Não vamos desenvolver provas completas em três engines para escolher a mesma coisa repetidamente.

Há recursos de navegação com malhas, obstáculos dinâmicos e links na Unity; agendas, relações, tráfego e continuidade dos moradores serão nossos sistemas. [Fonte: AI Navigation](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/index.html).

### 3.2 Física das rodas e condução

Começar com uma camada de contato com o solo substituível, usando Rigidbody e avaliando WheelCollider no pátio. A Unity documenta aplicação de torque e freio nas rodas; o controlador de exemplo que liga input diretamente ao torque **não é o modelo de propulsão do Real Car Lifestyle**. Aqui o torque virá do motor e da transmissão. [Fonte: WheelCollider](https://docs.unity3d.com/6000.0/Documentation/Manual/WheelColliderTutorial.html).

WheelCollider será mantido se permitir demonstrar os comportamentos exigidos no marco de condução. Se impedir reação de carga, patinagem ou consistência de rodas e suspensão, substitui-se essa camada. Essa falha não exige trocar o núcleo físico nem toda a engine.

### 3.3 Automação e recursos prontos

Os projetos comunitários [MCP for Unity](https://github.com/CoplayDev/unity-mcp) e [Blender MCP](https://github.com/ahujasid/blender-mcp) documentam automação dos respectivos editores. A compatibilidade deve ser conferida com as versões instaladas. O plano não presume que estejam conectados às IAs atuais.

Usar scripts em lote e ações idempotentes para montar cenas, importar dados e validar ativos. A indisponibilidade de MCP não bloqueia lógica, contratos ou scripts locais. Compras de pacotes e geração paga não fazem parte desta entrega de planejamento.

Reaproveitar ambiente, mobiliário, personagens e ferramentas de produção quando adequados. O diferencial a construir é a relação entre peça, funcionamento, medição, reparo e consequência. Referências de Car Mechanic Simulator orientam a experiência, mas não fornecem automaticamente assets ou código reutilizáveis.

## 4. Estado técnico de partida

Base relatada pela IA do laboratório: branch `main`, commit informado como `75eb71a94790` no diagnóstico e `75eb71a` nas mensagens posteriores. Antes de implementar, registrar o SHA completo real e o estado das alterações locais; não reconstruir um SHA a partir desses prefixos.

| Área | Evidência documental atual | Trabalho necessário |
| --- | --- | --- |
| Motor | 18 arquivos puros em `src/simulation`; cinemática, combustão e termodinâmica. | Conferir estados, resolução de eventos, RPM dinâmica e validade dos modelos usados. |
| Golf | Pilha independente do motor didático; geometria e diversos sistemas representados. | Mapear identidade, unidades e integrações sem misturar configurações incompatíveis. |
| Elétrica | Grafo relatado com 15 nós e potenciais por conectividade. | Corrente, resistência, queda de tensão, cargas e transientes necessários aos diagnósticos. |
| Mistura | Lambda global relatada. | Massa de ar e combustível por cilindro nos fenômenos que exigem individualização. |
| Multímetro | Leitura do grafo no Golf. | Modelo do instrumento e circuito coerentes, inclusive carga e pontos flutuantes. |
| Osciloscópio | Presença relatada em cenas de lambda. | Instrumentação geral com sinais, amostragem e ligação aos pontos corretos. |
| Scanner | Ausente segundo a revisão ampliada. | Comunicação, parâmetros, DTCs e comportamento de ECU. |
| Diagrama | Dados de chicote disponíveis; tela não implementada. | Documento elétrico nominal derivado do catálogo e navegação entre pinos. |
| Dinâmica veicular | Sem carro reagindo à pista. | Transmissão funcional, rodas, contato, freios, suspensão e retorno de carga. |
| Assets | Golf procedural; cerca de 55 GLBs de lições/peças relatados. | Importar um conjunto representativo e provar escala, nomes, pivôs e aplicação. |
| Testes | 50 arquivos unitários e 23 specs relatados; não executados no diagnóstico. | Selecionar os cenários relevantes e distinguir existente, executado e aprovado. |
| Desempenho | Sem benchmark relatado. | Medir custo de núcleo, integração, mundo, gráficos e instrumentos separadamente. |
| Mundo e carreira | Ainda sem implementação relatada. | Construir no novo projeto, usando os requisitos consolidados abaixo. |

Nenhuma contagem de arquivos equivale a cobertura aprovada. Não é necessário portar todos os módulos, todos os testes e todas as peças para provar a primeira integração.

## 5. Como evitar duas físicas divergentes

### 5.1 Uma implementação de produção por capacidade

O núcleo C# de produção ficará **sob responsabilidade da IA do laboratório, dentro do repositório Engine Data Flow**, em um pacote independente. O jogo consumirá uma revisão fixada desse pacote. Isso conserva dois repositórios e evita uma terceira aplicação só para compartilhar arquivos.

Estrutura proposta, a adaptar apenas se houver uma estrutura equivalente já existente:

| Local proposto | Conteúdo e proprietário |
| --- | --- |
| EDF: `packages/com.realcar.vehicle-sim/Runtime/` | Código C# puro; IA do laboratório. |
| EDF: `packages/com.realcar.vehicle-sim/` | Manifesto de pacote e fronteira de compilação; IA do laboratório. |
| EDF: `tools/vehicle-sim-harness/` | Runner sem interface e comparação de cenários; IA do laboratório. |
| EDF: `exports/rcl/<release>/` | Manifesto, definições, dados, fixtures e referências de assets; IA do laboratório. |
| RCL: `Assets/RealCar/Integration/` | Adaptadores Unity, tempo, poses, contatos e instrumentos visuais; IA do jogo. |
| RCL: `Assets/RealCar/Game/` | Personagem, mundo, carreira, NPCs, UI e salvamento; IA do jogo. |
| RCL: `Assets/RealCar/Scenarios/` | Garagem, pátio e cenários de integração/carga; IA do jogo. |

O formato de consumo será pacote de fonte C# fixado a uma revisão Git, com mecanismo compatível com o ambiente. Se o acesso privado impedir isso inicialmente, aceitar cópia de distribuição gerada, com hash, versão e origem registrados, sem edição manual no consumidor. Uma revisão do pacote deve permitir reproduzir a compilação anterior.

O TypeScript existente é a referência inicial de comportamento. Fazemos **um porte verificado por capacidade**. Depois da aceitação, novos desenvolvimentos dessa capacidade acontecem no C# canônico. Não se exige reimplementar toda novidade também em TypeScript.

### 5.2 O que acontece com a interface Web do laboratório

A interface atual continua funcional e serve para consultar os modelos legados, cotas e representações já existentes. O novo núcleo C# terá bancada sem interface; sua validação visual ocorrerá na cena de ensaio do jogo, que consome o mesmo pacote.

Isso precisa ser explícito: a tela Web não ganhará automaticamente os modelos novos do C#. A integração dessa interface ao núcleo, se trouxer valor suficiente, será avaliada depois. Não começaremos por criar ponte WebAssembly, serviço local ou uma migração completa da UI. A versão do modelo mostrada em cada bancada deve ser identificável.

### 5.3 Responsabilidades nas fronteiras

| Sistema | Laboratório | Jogo |
| --- | --- | --- |
| Motor, fluidos e térmica | Equações, estados, parâmetros, calibração e cenários. | Inputs, ambiente e apresentação dos resultados. |
| Elétrica e ECU | Circuitos, componentes, sinais, protocolo e diagnóstico. | Posicionamento de ferramentas, interação e UI. |
| Transmissão | Relações, perdas, inércias, embreagem e modelo de acoplamento. | Contato com solo e integração ao corpo do veículo. |
| Suspensão e freios | Parâmetros e relações físicas dos componentes. | Corpos, contatos e adaptadores; medidas retornam ao núcleo. |
| Reparo | Consequência física de montagem, conexão e qualidade. | Ações, ferramentas, interação, inventário e requisitos de perk. |
| Danos e fabricação | Modelo de integridade e efeitos sobre o sistema. | Edição de forma, contato, soldagem visual e manipulação. |
| Modelo simplificado | Relações agregadas e taxas relacionadas a condição/uso. | Agenda dos veículos, movimentação e acionamento pelo mundo. |
| Dados e arte | Cotas, topologia e identificadores funcionais. | Acabamento, materiais, LOD visual e ambientes. |
| Carreira e NPCs | Fornece resultados físicos e catálogo técnico. | Toda a regra de negócio e vida do personagem. |

Não duplicar a mesma inércia, resistência ou força nos dois lados. Cada grandeza e efeito tem um único responsável por integração; a outra camada envia carga, estado ou comando.

## 6. Contratos que vêm antes da expansão

### 6.1 Definição, instância e checkpoint

| Contrato proposto | Conteúdo obrigatório |
| --- | --- |
| `VehicleDefinition` | Configuração do modelo, motor, transmissão, peças compatíveis, topologia, conectores, geometria funcional e versão. |
| `PartDefinition` | Material, fabricação, parâmetros físicos, preço-base e informações de catálogo. |
| `PartInstanceState` | Identidade da peça individual, desgaste, dano, defeitos, reparos, instalação e origem. |
| `VehiclePersistentState` | Identidade, peças instaladas, fluidos, bateria, temperaturas, legalização, uso acumulado e estado do modelo simplificado. |
| `FullSimulationCheckpoint` | Variáveis necessárias para retomar o veículo ativo: fases, integrais, massas, pressões, controles, estados elétricos dinâmicos, sinais e eventos pendentes, conforme o modelo. |
| `DriverInputs` | Pedais, chave, marcha e comandos; nunca velocidade desejada como propulsão física. |
| `MechanicalBoundary` | Torque, rotação, carga de reação e intervalos de integração nos pontos de acoplamento. |
| `DiagnosticSample` | Grandeza/sinal, unidade, tempo, ponto medido e estado da leitura. Não expõe o identificador secreto da causa. |
| `WorldSnapshot` | Relógios, personagem, veículos, NPCs, economia, pedidos, eventos, progressão e aleatoriedade. |

Uma peça no catálogo e uma peça instalada são entidades distintas. Dois exemplares do mesmo modelo não compartilham desgaste ou defeitos. O fato de existir um só veículo detalhado por vez não altera essa regra.

### 6.2 Convenções

- SI na fronteira de engenharia: metro, segundo, quilograma, newton, N·m, pascal, kelvin, ampere, volt, ohm e radiano.
- Documentar a base espacial, orientação dos eixos, origem e sentido positivo de rotação. Converter milímetros e graus na borda.
- Definir pressão absoluta versus manométrica em cada campo.
- Separar versão do esquema, versão do modelo físico e versão do conteúdo.
- Registrar `vehicleId`, `partInstanceId`, `definitionId` e origem do modo de jogo.
- Estados de instrumentos distinguem leitura válida, circuito/ligação inadequados e ausência de comunicação; não transformar todos esses casos no número zero.
- A definição concreta do motor piloto deve bater com a geometria escolhida. O motor didático e o Golf não são presumidos como a mesma configuração.

### 6.3 Pacote de transferência

Cada entrega do laboratório contém manifesto com revisão de origem, versão do contrato, arquivos e hashes; unidades/convenções; definições; cenários de entrada; saídas de referência quando realmente geradas; critérios de comparação; limitações e resultado da validação.

O importador do jogo verifica esquema, IDs, integridade e compatibilidade. Se houver incompatibilidade, mantém a última versão aceita e informa a divergência. Não completa campos críticos ausentes com valores silenciosamente inventados.

## 7. Fechar a causalidade antes de ampliar o catálogo

### 7.1 Rotação resultante e partida

A auditoria inicial precisa separar `rpm` imposta para ensaio de `rpm` integrada pela dinâmica. O controle de RPM do laboratório é útil para comparar curvas, mas não prova que o carro se sustente fisicamente.

No veículo ativo, a rotação responde ao torque de combustão, ao arranque, às perdas, à inércia e à carga da transmissão. Em forma de balanço: a variação do momento angular resulta da soma dos torques aplicados. Câmbio e rodas devolvem carga ao motor.

A partida merece tratamento próprio: bateria, circuito de acionamento e motor de arranque movimentam o conjunto antes de o motor funcionar por combustão. Remover combustível não deve impor artificialmente RPM zero no mesmo instante; gases restantes e inércia evoluem conforme o modelo. Sem propulsão, um carro ainda pode rolar por inércia ou gravidade.

### 7.2 Resolução temporal

O passo de até 1/120 s relatado não demonstra resolução suficiente de ignição e sinais. A 3.000 rpm, 1/120 s corresponde a **150 graus de virabrequim**: `3000 × 6 / 120`. Esse cálculo não prova um defeito do código, mas mostra por que devemos conferir se eventos intermediários são resolvidos ou apenas amostrados.

Usar avanço por eventos e/ou subpassos limitados por ângulo no motor e pelos requisitos dos circuitos. Verificar convergência com refinamento do passo e captura de pulsos. A frequência do quadro visual e a atualização da UI não determinam a resolução da medição.

Há três noções de tempo a separar: tempo físico da simulação, relógio acelerado do mundo e tempo de apresentação. O dia acelerado não pode acelerar inadvertidamente combustão ou corrente. Durante sono e períodos fora de cena, avançar os fenômenos apropriados uma única vez, sem duplicar desgaste ou resfriamento.

### 7.3 Primeira cadeia elétrica

Escolha para a primeira falha integrada: **resistência de contato no circuito de alimentação da bomba**, além do caso de circuito aberto usado como referência. Ela exige calcular tensão sob carga, corrente, comportamento da bomba e efeito na alimentação de combustível.

O laboratório precisa fornecer um circuito e uma carga definidos; o resultado não será uma porcentagem arbitrária de potência aplicada diretamente ao carro. O reparo modifica a causa na conexão, e a melhora aparece pelo mesmo cálculo.

Para osciloscópio, incluir o modelo dinâmico necessário ao fenômeno escolhido; corrente contínua resistiva não basta para prometer pulsos de bobina ou injetor. Para scanner, modelar ECU e comunicação, alimentação, parâmetros e condições de registro dos DTCs. O DTC é uma conclusão do sistema de diagnóstico, não a identificação onisciente da peça defeituosa.

### 7.4 Cilindros e sensores

O estado pode guardar massa de ar, combustível, combustão e contribuição de torque por cilindro. Isso não autoriza mostrar automaticamente uma lambda medida para cada cilindro se o sensor daquele veículo observa gases combinados. A medição deve respeitar posição, tecnologia, atraso e limites do sensor.

### 7.5 Diagramas

Usar a mesma definição elétrica para vias, identificação e documentação nominal. Manter separado o circuito de referência do veículo e o circuito efetivamente modificado pelo jogador. Um fio rompido oculto não pode aparecer destacado como solução no diagrama técnico simplesmente porque o simulador conhece a falha.

## 8. Saves, troca de veículo e isolamento dos modos

### 8.1 Salvar não é reduzir a simulação

O save do veículo ativo preserva as variáveis e o histórico necessários para continuidade observável. Campos derivados podem ser recalculados quando isso for demonstrado. Não exigir serializar caches internos indisponíveis da engine nem prometer determinismo bit a bit de toda a física Unity.

Critério: posição, velocidades, estado mecânico, sinais relevantes, próximos eventos e leituras continuam coerentes desde a retomada, dentro de tolerâncias explícitas. “Depois de alguns segundos ficou parecido” não é suficiente para uma falha durante a partida ou uma aquisição de osciloscópio.

### 8.2 Dois modelos do veículo

O controlador admite no máximo um veículo em simulação completa. Medir, testar ou dirigir promove o veículo apropriado. Os demais mantêm estado persistente e evoluem pelo modelo simplificado. Instrumentos não são abastecidos por sorteios desse modelo.

Política técnica inicial de troca: liberar o ativo quando estiver estacionado, desligado e sem procedimento/acoplamento pendente. A troca não acontece no meio de uma aquisição ou de uma condução. Se não for seguro liberar, informar o motivo e concluir o procedimento antes de promover outro veículo.

Redução preserva dano, temperaturas, fluidos, bateria e histórico necessário. Hidratação reconstrói estados compatíveis e mantém causas latentes. Trocar de carro não cura defeitos nem altera sua sorte. Carro desligado e carro circulando no trânsito recebem evolução distinta.

### 8.3 Probabilidade e relógio

Adotar risco associado ao uso e à condição, expresso por tempo ou exposição. Uma opção inicial é taxa de risco `h` e probabilidade `p = 1 - exp(-h × dt)` no intervalo com taxa constante; com taxa variável, usar sua integral. É uma escolha de modelagem a calibrar, não uma lei de falha universal.

Para consistência entre passos, salvar o estado aleatório e o progresso de exposição/evento. Não sortear chance fixa por quadro. Separar sequências aleatórias de veículos, mundo e apresentação para efeitos visuais não mudarem defeitos.

Pedidos de peças têm prazo garantido: sortear uma vez o instante dentro da previsão e persistir o evento. Não sortear novamente ao carregar. O frete abstrato das compras continua separado dos trabalhos de transporte do jogador.

### 8.4 Carreira versus laboratório jogável

O laboratório jogável do RCL é um modo do jogo e usa o mesmo código de produção. O Engine Data Flow é o projeto externo de desenvolvimento. São conceitos distintos.

Estados e criações do jogador recebem origem e identidade de campanha. Bloquear cruzamento indevido na criação, importação, carregamento e materialização de objetos; a renderização também rejeita conteúdo incompatível como defesa final. Não confiar apenas em esconder a peça na tela.

Definições e assets de desenvolvimento podem ser compartilhados entre modos. O bloqueio se aplica a criações e recursos obtidos pelo jogador no laboratório: dinheiro infinito, montagens e progressão não migram para a carreira.

### 8.5 Morte e Efeito Borboleta

Na compra do item, registrar atomicamente pagamento, aquisição e snapshot do mundo no ponto de retorno. A campanha permite uma compra e um uso.

A marca de item consumido precisa sobreviver ao retorno: ela pertence ao controle da campanha fora da parte rebobinada, ou recebe tratamento equivalente na transação de restauração. Restaurar cegamente o snapshot da compra não pode rearmar o item indefinidamente.

Testar compra → morte → retorno → segunda morte; a segunda encerra a campanha. O funcionamento normal da UI não permitirá carregar livremente um save anterior depois da morte definitiva. Não se promete impedir manipulação externa de arquivos em um jogo local.

## 9. Sequência conjunta de execução

Os marcos são ordem e dependência, não estimativa de prazo. Cada IA trabalha em um pacote principal por vez. Um marco só é aceito com a evidência indicada; trabalho independente continua enquanto uma integração aguarda a outra frente.

| Marco | Engine Data Flow | Real Car Lifestyle | Saída observável para aceitar |
| --- | --- | --- | --- |
| **M0 — Contrato e base** | Conferir alterações desde o diagnóstico; mapear as duas pilhas; preparar definições, convenções e cenários da primeira transferência. | Preparar estrutura Unity, contratos de consumo, cenas de ensaio e política de estado/saves. | Ambos concordam no contrato v0.1 e no mesmo veículo/configuração de ensaio; base executável quando o ambiente permitir. |
| **M1 — Reuso demonstrado** | Portar o subconjunto motor para C#; gerar referências quando autorizado; exportar conjunto de peças representativo. | Importar pacote/peças, selecionar por ID, mostrar telemetria; iniciar cenário de carga com moradores. | Comparação do porte e integridade de assets; medições iniciais, sem confundir paridade com realismo. |
| **M2 — Veículo causal** | Fechar partida, RPM dinâmica, alimentação e falha de contato; resolver individualidade de cilindros usada pelo cenário. | Ferramenta, pontos de prova, ação de reparo e acoplamento de transmissão/rodas no pátio. | Medição e comportamento mudam pela mesma causa; carga retorna ao motor; reparo restaura o funcionamento. |
| **M3 — Continuidade** | Checkpoint físico, redução/hidratação e modelo simplificado inicial. | Save/load, troca A/B, isolamento de modos e integração de mundo/aleatoriedade. | Retomada coerente; sem cura, duplicação, novo sorteio ou vazamento entre modos. |
| **M4 — Primeiro ciclo de carreira** | Apoiar parâmetros técnicos do serviço, desgaste e catálogo usado. | Casa do tio, Mão na Massa, trabalho de auxiliar, pagamento, sono/XP, ferramenta, compra e reparo do primeiro carro; NPCs contextuais. | Um ciclo de vida automobilística jogável e repetível, respeitando o começo sem carro. |
| **M5 — Instrumentação e especialidades** | Osciloscópio geral, ECU/scanner, sinais, diagramas, novos casos físicos e bancadas de módulo. | Interfaces profissionais, atividades, requisitos cruzados e conteúdo de oficina; primeiro evento social/automotivo. | Cada especialidade implementada tem operação concreta, medição e consequência; não só botão de concluir. |
| **M6 — Mundo e fabricação** | Expandir fluidos, suspensão, danos, propriedades de junções/peças e calibração do simplificado. | Duas cidades/rodovia em blocos progressivos, porto/pistas, tráfego, negócios; solda, adaptações e funilaria por incrementos. | Estado contínuo em circulação, reparo e negócios; criação persistente com efeito funcional. |
| **M7 — Conteúdo e produto** | Novos veículos e famílias mecânicas com testes de referência e limites. | Demais carreiras, eventos, catálogo, polimento, acessibilidade, builds e preparação de distribuição. | Ampliação sem duplicar física ou quebrar campanhas; critérios de produto definidos por medições. |

### 9.1 O que começa em paralelo imediatamente

**Laboratório:** preparar uma entrega pequena que demonstre exatamente como motor, circuito e geometria se relacionam. Não começar reformando todas as cenas, convertendo todos os assets ou ampliando os dezoito casos.

**Jogo:** preparar o projeto final, domínio de estado, interação e cenários. Pode construir o relógio, agenda, contrato de inventário e leitor de pacote sem esperar o motor completo. Dados artificiais de teste ficam restritos aos cenários identificados; não são apresentados como integração física entregue.

### 9.2 Antecipar os riscos caros

O cenário com mais de 200 moradores começa no M1 e volta a ser medido com veículo completo e instrumentos nos marcos seguintes. Não esperar terminar as cidades para descobrir o custo do mundo.

Fabricação e deformação recebem uma investigação pequena após M1: uma placa, uma junção, persistência da forma, propriedade funcional e carregamento. O objetivo é verificar a arquitetura necessária, não produzir o sistema inteiro de soldagem nesse momento. O restante dessas funcionalidades fica no M6.

## 10. Critério do primeiro marco integrado do veículo

O ensaio usa um veículo técnico de desenvolvimento, com configuração explícita e coerente. O Golf é candidato de gabarito; não é automaticamente o primeiro carro da campanha nem prova de compatibilidade entre os dois motores existentes.

Sequência exigida:

1. Carregar o veículo e registrar seu estado e versão do pacote.
2. Acionar a chave: observar arranque, alimentação e evolução da combustão/rotação.
3. Inserir a falha de contato no cenário de desenvolvimento e medir nos pontos corretos, sob a condição de carga definida.
4. Observar o efeito calculado sobre bomba, combustível e motor.
5. Executar a ação de reparo na conexão; a ação altera seu estado físico persistente.
6. Repetir a medição e comparar o resultado.
7. Acoplar transmissão e conduzir no pátio, com resposta de carga ao motor, freio e direção.
8. Desligar, salvar, carregar e verificar continuidade.

Além da falha de contato, verificar ausência de combustível, embreagem desacoplada e desligamento em movimento. Esses cenários revelam se a cadeia é realmente causal e se inércia, acoplamento e propulsão foram confundidos.

O ciclo de carreira do M4 complementa esse ensaio com trabalho, dinheiro e progressão. Não exige liberar reparo elétrico avançado ao personagem iniciante: o início usa serviço de auxiliar compatível com o perk Mão na Massa.

## 11. Cobertura da visão completa

Esta matriz conserva o escopo e indica onde ele entra. “Depois” significa sequenciamento; não significa exclusão do projeto.

| Requisito preservado | Referência | Responsável principal / entrada |
| --- | --- | --- |
| Propulsão causal por cilindro; ar, combustível, calor, óleo e hidráulica | Conversa original; Conceitos 4–12 | Laboratório + integração do jogo / M1–M2; ampliar M5–M6. |
| Balanço/cruzamento, fases e ignição com nomenclatura verificada | Conversa original; Mensagem EDF | Laboratório / M0–M1, com tabela angular; nome não substitui evidência física. |
| Multímetro, osciloscópio, scanner e diagramas | Visão original; revisão técnica | Laboratório para modelo; jogo para interação / M2 e M5. |
| Dois modos e binds; laboratório com peças, dinheiro infinito e perks configuráveis | Entrevista 001, 005–006 | Jogo / estrutura M0–M3, conteúdo progressivo. |
| Quatro pistas do laboratório: arrancada, drift, “trekking”, rali | Entrevista 001 | Jogo / expansão; “trekking” permanece termo pendente, sem bloqueio agora. |
| Nenhuma criação do laboratório jogável entra na carreira | Entrevista 006 | Jogo / M0 e M3. |
| Casa do tio, espaço livre e ferramentas básicas; início sem carro | Entrevista 001 | Jogo / M4; carro do tio não é material para o tutorial de reparo. |
| Mão na Massa libera desmanche, borracheiro e auxiliar | Entrevista 009–010 | Jogo / M4; expandir as três atividades. |
| Delivery com 50 cc alugada; pacotes com carro/carga; passageiros | Entrevistas 001, 009, 013–014 | Jogo / expansão do M4; dinâmica de motos é trabalho próprio, não mero carro com malha trocada. |
| Carro quebrado comprado em ferro-velho/leilão; inspeção limitada | Entrevista 001 | Jogo + estado do laboratório / M4. |
| Perks obrigatórios, dinheiro/pontos/nível/equipamentos; prova prática não desbloqueia | Entrevistas 002–003, 007 | Jogo / M4; regras centralizadas. |
| Nível geral e individual, faixa 1–99, mais de 100 perks e redistribuição cara | Entrevista 008 | Jogo / dados M4, expansão M5–M7. |
| Árvores simultâneas e pré-requisitos cruzados | Entrevista 004 | Jogo / modelo M4, conteúdo progressivo. |
| Reparação de módulos e mapas/telemetria como caminhos técnicos | Complemento 003 | Laboratório + jogo / M5 em diante; exemplos não fixam árvore final. |
| Dinheiro em tempo real; cartões, boletos e Pix simulados | Entrevista 002 | Jogo / livro de transações M4; interfaces depois. |
| XP das atividades creditada ao dormir; sucessos e falhas contribuem | Entrevistas 002–003 | Jogo / M4; fechamento idempotente. |
| Energia e desmaio: perda de 20% da XP daquele dia | Entrevistas 019–020 | Jogo / M4; não descontar a experiência histórica. |
| Humor afeta experiência e energia | Entrevista 022 | Jogo / M4, calibração posterior. |
| Moral por indivíduo, influência pública e afinidade de grupo distintas | Entrevistas 015–016, 021 | Jogo / estado desde M0; uso M4–M5. |
| Reputação 0–5 por estabelecimento; feedbacks e internet interna | Entrevista 012 | Jogo / M4–M6. |
| Peças chegam dentro da previsão por evento, sem simular o frete | Entrevista 013 | Jogo / agenda e save M3–M4. |
| Mecânico diagnostica/terceiriza; auxiliar executa; contratação | Entrevista 010 | Jogo + ações técnicas / M4 e expansão. |
| Garantia por reparo; responsabilidade varia com seu prazo | Entrevista 011 | Jogo / contratos M4; cinco dias para roda é exemplo. |
| Postão de encontro geral às quintas; acesso sem carro | Entrevistas 015–016, 024 | Jogo / primeiro evento M5. |
| Grupos: pista, motos, antigos, caminhonetes, rali, drift, arrancada, caminhoneiros | Entrevistas 015, 023 | Jogo / M5–M7; contatos e eventos progressivos. |
| Duas cidades, rodovia longa, três postos e porto | Entrevistas 023–024 | Jogo / topologia M1, produção progressiva M6. |
| Mais de 200 moradores com rotina e população adicional | Entrevista 041 | Jogo / cenário técnico M1; integrado nos marcos posteriores. |
| Track/off-road com traçados por cones, touge, drift e arrancada | Entrevista 023 | Jogo / M5–M6. |
| Grau/motocross, exposições/museu, cabo de guerra, rachas e importações | Complemento 023–024 | Jogo + modelos de veículo necessários / M6–M7. |
| CET, PRF, radares, multas, pátio e roubo | Entrevistas 025, 028 | Jogo / M6; crimes pesados continuam para detalhamento futuro. |
| Vistoria após mudanças de potência/estrutura; homologação e confiabilidade | Entrevistas 026–028 | Jogo + parâmetros de engenharia / M5–M6; regras do universo do jogo. |
| Compra/reparo/revenda, lojas, oficinas, concessionárias, desmanches, gerente e impostos | Entrevistas 001–004, 028–029 | Jogo / M4 e expansão M6–M7. |
| Influencer, seguidores e rifas dentro do jogo | Entrevista 004 | Jogo / M6–M7. |
| Dívidas, bens tomados pelo banco exceto a casa, saldo negativo | Entrevista 030 | Jogo / persistência M3; economia M4–M6. |
| Morte definitiva e Efeito Borboleta uma compra/um uso | Entrevistas 031–032 | Jogo / arquitetura e testes M3; integração à carreira M4. |
| Carreira aberta, campeonatos recorrentes e atualizações de veículos/eventos | Entrevista 033 | Jogo / arquitetura de conteúdo versionado desde M0. |
| Adaptações dependem de encaixe, funcionamento e comunicação | Entrevista 034 | Laboratório + jogo / contratos M0, mecânica M5–M6. |
| Solda e chapas; chassi/escapamento e fabricação livre | Entrevista 035 | Investigação após M1; entregas M6. |
| Lataria, funilaria, chassi e PT | Entrevista 036 | Contrato de dano M0–M3; comportamento M6. |
| Imóveis pré-construídos e móveis/utilidades comprados | Entrevista 037 | Jogo / M4 básico, expansão M6. |
| Simuladores por reparo; POV normal e interfaces específicas | Entrevista 038 | Jogo + modelo técnico / M2, M5–M6. |
| Roda de diálogo contextual com conversa, compra, venda e serviços | Entrevista 039 | Jogo / M4; opções guiadas pelo estado. |
| Preços-base por material, fabricação e qualidade; sem mercado dinâmico exigido | Entrevista 040 | Jogo + catálogo / M4. |
| PC, visual cartunesco e geometria realista; um veículo completo | Entrevista 042; referências visuais | Ambos / desde M0. |
| Online como estudo futuro | Entrevista 017 | Não bloquear a versão inicial com netcode ou servidores. |

Detalhes ainda abertos recebem parâmetros de desenvolvimento identificados, sem serem atribuídos a Alessandro: valores iniciais, duração do dia, preços, mapas exatos, nomes das cidades, probabilidades, limites de dano e catálogo de lançamentos.

## 12. Desempenho e escala desde cedo

Montar um cenário com **250 moradores persistentes**, número de ensaio escolhido para ultrapassar os 200 confirmados, mais população de passagem parametrizável. Cada morador tem identidade, agenda, atividade, localização lógica, deslocamento e relações. Perto do jogador, sua representação detalhada acompanha esse estado; longe, a simulação avança sua rotina de forma mais econômica.

Testar separadamente população distribuída e concentração no encontro. Não tratar “250 registros no banco” como “250 moradores funcionando”. Conferir continuidade ao aproximar, afastar, dormir e recarregar.

Adicionar tráfego em patamares configuráveis e registrar quantos veículos estão ativos visualmente, quantos no modelo simplificado e qual é o único completo. Evitar prometer um número final de trânsito antes de medir.

Cada relatório registra hardware real, sistema operacional, build, resolução, qualidade, população, veículos, cenário, duração e versão do núcleo. Medir CPU por sistema, GPU quando disponível, memória, alocações/GC, tempo por passo e percentis de tempo de quadro. Uma média de FPS isolada não mostra pausas durante save, importação ou encontro.

Os primeiros números serão orçamento de engenharia. Requisitos mínimos e metas públicas serão definidos depois de medições representativas. Não reduzir a resolução dos instrumentos para disfarçar problema de renderização; otimizar cada orçamento na camada responsável.

## 13. Validação necessária

| Verificação | Evidência exigida |
| --- | --- |
| Integridade do pacote | Versões, hashes, IDs, unidades e ausência de referências quebradas. |
| Porte TS → C# | Mesmo cenário; diferenças numéricas reportadas por grandeza e fase. |
| Validade física | Casos analíticos, balanços, sinais esperados e referências técnicas adequadas ao modelo. |
| Resolução temporal | Convergência ao refinar o passo; eventos e sinais não desaparecem conforme RPM ou FPS. |
| Circuitos | Carga e condições explícitas; tensão, corrente, potência e efeitos compatíveis. |
| Propulsão | Motor/transmissão/rodas acoplados; reação de carga e inércia presentes. |
| Instrumentos | Conectam aos pontos do veículo; leituras respeitam modelo, modo e resolução do instrumento. |
| Continuidade | Save durante operação e diagnóstico; troca A/B; causas e próximos eventos preservados. |
| Probabilidades | Risco coerente por exposição; carregar não ressorteia o estado; repartição temporal não muda a taxa pretendida. |
| Campanha | XP/transações não duplicam; Efeito Borboleta não se rearma; morte final respeitada. |
| Modos | Criações do laboratório rejeitadas na carreira antes do spawn e também na renderização. |
| Assets | Cotas, eixos, identificação, pivôs, hierarquia, materiais e poses verificados no destino. |
| Escala | Mesma simulação aceita medida com moradores, tráfego, instrumentos e save em conjunto. |

Para comparar números, usar `abs(a-b) <= absTol + relTol × max(abs(a), abs(b))`, com tolerâncias justificadas por grandeza. Estados discretos devem coincidir. Ângulos exigem distância circular e registro da fase/contagem de ciclos. Não aplicar `1e-6` arbitrariamente a tudo nem herdar automaticamente todos os testes legados.

Separar cenários de RPM imposta, úteis para regressão de curvas, dos cenários de rotação livre sob carga, necessários para provar funcionamento. A explicação antiga de que a derivada geométrica “explode no PMS” também não será adotada como critério; a geometria e suas derivadas devem ser avaliadas diretamente.

Há registro de uma restrição anterior a executar Vitest na sessão do laboratório. Este plano não a revoga nem autoriza contorná-la usando outro runner. A IA local deve conferir as instruções vigentes. Se a execução necessária continuar bloqueada, entrega os cenários preparados e marca o critério como **não validado**, mantendo as tarefas independentes em andamento. Só a execução afetada fica pendente de liberação.

## 14. Reaproveitamento de geometria e visual

O Three.js documenta `GLTFExporter`, e a Unity mantém documentação de importação glTF por glTFast. Isso fornece caminhos candidatos, não prova que a cena procedural existente já sobreviva à transferência. [GLTFExporter](https://threejs.org/docs/pages/GLTFExporter.html), [glTFast](https://docs.unity3d.com/Packages/com.unity.cloud.gltfast@6.0/manual/index.html).

Primeiro conjunto de prova: uma peça estática, uma peça móvel com pivô, uma montagem pai/filho e um conector com vias e IDs. Importar, medir marcos geométricos e aplicar poses conhecidas. Só depois ampliar ao carro.

Se a exportação falhar, preservar cotas, montagem e identificadores e adaptar apenas a parte necessária do gerador. Não encomendar um novo carro completo antes dessa prova. GLBs existentes também precisam demonstrar aplicação correta: uma malha didática genérica não é automaticamente a peça daquele veículo.

O catálogo das onze referências foi lido. As imagens originais não foram inspecionadas nesta rodada e deverão estar acessíveis à IA que montar o visual. A direção confirmada permanece: componentes definidos, proporções reais e materiais cartunescos. Transparência, destaque e câmera dedicada são opções de implementação a provar na interação, não substitutos da precisão funcional.

## 15. Riscos e decisões de contingência

| Risco | Resposta definida |
| --- | --- |
| Melhorar indefinidamente o aplicativo educacional | Cada entrega do laboratório deve atender um consumidor/cenário do jogo ou resolver um risco identificado. |
| Portar uma aproximação inadequada como física final | Identificar validade por capacidade; corrigir no núcleo canônico e criar nova referência, sem maquiar a paridade. |
| Duas IAs alterarem a mesma equação | Uma proprietária do núcleo; o jogo abre solicitação com reprodução e versão. |
| Configuração do motor incompatível com o gabarito | Manter fixtures separadas até selecionar uma configuração coerente; não esconder divergências de válvulas, cilindrada ou conectores. |
| Elétrica crescer até um simulador genérico impossível de concluir | Implementar primeiro os componentes e transientes exigidos pelos casos; ampliar por especialidade. |
| Interface Web ficar desatualizada em relação ao C# | Identificar versões; usar bancada C# e cenário Unity como referência atual; ponte visual posterior só com benefício demonstrado. |
| WheelCollider limitar condução | Substituir o adaptador de contato e acoplamento, preservando núcleo e dados. |
| NPCs e encontro excederem orçamento | Ajustar frequência, navegação, representação e conteúdo com medições; não apagar moradores ou seus estados silenciosamente. |
| Soldagem/deformação exigirem estruturas diferentes | Investigação pequena antecipada de geometria, junções e persistência; implementação ampla posterior. |
| Save provocar reinício físico ou exploração da aleatoriedade | Checkpoint de estado, eventos e RNG; validação de retomada e controle de campanha. |
| Falta de acesso a editor, repositório ou ferramenta | Reportar o item exato e continuar contratos/código/documentação independentes; não simular acesso. |

Reabrir a escolha da engine somente diante de impedimento concreto e reproduzível dos requisitos centrais, não por um vídeo novo ou por preferência de um agente. Custo de um adaptador, bug de importação ou falta de MCP isolados não demonstram necessidade de migração.

## 16. Protocolo de coordenação das IAs

### 16.1 Trabalho por pacote

Cada ordem contém: ID, objetivo, versão de entrada, proprietário, caminhos envolvidos, escopo, dependências, critérios de saída e forma de retorno. As primeiras ordens estão em arquivos próprios:

- `Ordem_01_IA_Engine_Data_Flow.md`.
- `Ordem_01_IA_Real_Car_Lifestyle.md`.

A ordem do laboratório e a ordem do jogo podem ser encaminhadas juntas. Nenhuma exige a conclusão de todo o outro projeto. A integração do motor real só é aceita quando o pacote correspondente chegar.

### 16.2 Formato curto de retorno

```text
ID da ordem:
Projeto / branch / SHA completo:
Estado: preparado | implementado | verificado | bloqueado
Resultado observável:
Arquivos/pacote entregues:
Versões de contrato, modelo e conteúdo:
Verificações executadas e resultados:
Verificações não executadas e motivo:
Diferenças em relação à ordem:
Dependência que a outra IA precisa atender:
Próximo pacote recomendado:
```

Uma resposta “feito” sem artefato, cenário ou evidência não encerra o pacote. Teste encontrado, teste escrito e teste passado têm estados diferentes. Não copiar a entrevista inteira no retorno.

### 16.3 Como o GPT decide o próximo passo

1. Confere se a entrega atende o objetivo e se houve mudança de contrato.
2. Compara o retorno do produtor com o do consumidor.
3. Resolve divergências técnicas e registra a decisão e sua justificativa.
4. Atualiza o estado do marco, mantendo explícito o que não foi validado.
5. Emite a próxima ordem delimitada para cada IA.

As IAs não mudam regras de gameplay para facilitar uma implementação. A coordenação decide questões técnicas dentro da delegação; escolhas novas de experiência que alterem a visão voltam a Alessandro apenas quando forem necessárias ao próximo incremento.

### 16.4 Contexto e economia de tokens

Este plano é o ponto de entrada. Cada IA usa a própria ordem, um resumo curto de estado e os arquivos relevantes à tarefa. Entrevistas completas são consultadas quando há dúvida de requisito, não reenviadas a cada alteração.

Manter um resumo operacional com marco, versões, última integração aceita, bloqueios e próximo pacote. Usar resultados e diferenças por revisão; preservar os documentos históricos sem misturá-los às instruções vigentes. Não reproduzir credenciais ou autorizações de serviços de prompts antigos em novas ordens.

**Forma de coordenação disponível agora:** arquivos e retornos que forem disponibilizados nesta conversa. Não há conexão presumida com os dois VS Codes. As ordens estão preparadas para encaminhamento; não foram enviadas, executadas ou publicadas por esta sessão.

## 17. Fontes lidas e limites da revisão

| # | Documento | Papel na análise |
| --- | --- | --- |
| 01 | `Indice_Real_Car_Lifestyle.md` — versão 54 | Inventário dos 19 documentos atuais. |
| 02 | `Conceitos_Iniciais_Real_Car_Lifestyle.md` — versão 52 | Visão consolidada; interrupção confirmada e compensada pelas fontes. |
| 03 | `Entrevista_Real_Car_Lifestyle.md` | Respostas 001–007 e complementos, integralmente. |
| 04 | `Entrevista_Real_Car_Lifestyle_Parte_2.md` | Respostas 008–016, integralmente. |
| 05 | `Entrevista_Real_Car_Lifestyle_Parte_3.md` | Respostas 017–024, integralmente. |
| 06 | `Entrevista_Real_Car_Lifestyle_Parte_4.md` | Respostas 025–033, integralmente. |
| 07 | `Entrevista_Real_Car_Lifestyle_Parte_5.md` — versão 16 | Respostas 034–042 e redirecionamento técnico, integralmente. |
| 08 | `Conversa_Original_Real_Car_Lifestyle.md` | Premissa causal e origem da visão. |
| 09 | `Analise_Original_IA_Engine_Data_Flow.md` | Primeiro relato de reaproveitamento; confrontado com as correções. |
| 10 | `Mensagem_IA_Engine_Data_Flow.md` | Separação dos projetos e exigência de evidências. |
| 11 | `Orientacao_Tecnica_Real_Car_Lifestyle.md` — versão 6 | Histórico das alternativas e definições vigentes antes desta decisão. |
| 12 | `Solicitacao_Diagnostico_Tecnico_Engine_Data_Flow.md` | Escopo da inspeção solicitada ao laboratório. |
| 13 | `Diagnostico_Recebido_Engine_Data_Flow_2026-09-14.md` | Stack, caminhos, lacunas e limites da verificação relatada. |
| 14 | `LEIA_PRIMEIRO_Revisao_Arquitetura_Real_Car_Lifestyle.md` | Critérios para analisar o jogo completo. |
| 15 | `Revisao_Recebida_Arquitetura_Engine_Data_Flow_2026-09-14.md` | Revisão da recomendação e correções ao diagnóstico. |
| 16 | `Retorno_IA_Laboratorio_Plataforma_Visual_Simulacao.md` | PC, visual e um veículo completo. |
| 17 | `Referencias_Visuais_Real_Car_Lifestyle.md` | Catálogo das onze imagens e intenção de reuso. |
| 18 | `Plano_Passagem_Recebido_Engine_Data_Flow.md` | Sequência e contrato propostos pela IA do laboratório. |
| 19 | `Parecer_GPT_Plano_Passagem.md` | Correções de estado, instrumentos, saves e probabilidades. |
| 20 | `EngineDataFlow_Copilot_Master_Prompt.md` | Origem educacional, modelos simplificados, controles de ensaio e arquitetura histórica. |

As cópias de mensagens coladas não foram contadas como novas decisões; foram usados os documentos canônicos identificados no índice. O manual de motores e as imagens originais são referências para validação técnica/visual específica posterior, não foram auditados nesta rodada. Os links oficiais próximos às decisões verificam capacidades das ferramentas; não comprovam desempenho do projeto.

**Próximo passo definido:** encaminhar as duas Ordens 01, receber as entregas de M0 e liberar os pacotes de M1 conforme a compatibilidade demonstrada. A prioridade do laboratório é fornecer uma base física utilizável; a prioridade do jogo é construir desde já o produto que a consumirá.
