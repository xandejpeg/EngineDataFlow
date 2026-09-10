# Golf V: passagem de trabalho e retomada da pesquisa

Atualizado em 2026-09-10. Documento de entrada para o proximo agente pesquisador e para o Astra/agente de modelagem quando voltar.

## 1. Leia primeiro

- Diretriz do usuario em 2026-09-10: continuar a montagem acumulada em lotes substanciais, sem reiniciar nem trocar a ordem a cada exemplo. Os exemplos abaixo definem profundidade e integracao esperadas, nao uma lista exaustiva nem prioridade imediata. A priorityQueue do indice e uma fila de pesquisa dimensional antiga, nao a ordem dos lotes atuais de implementacao.
- Meta funcional: componentes conectados fisicamente e causalmente. Arrefecimento com circulacao/termostato/ventoinha; pedal interno acionando freios hidraulicos; pedal do acelerador passando pelo controle eletronico ate a TBI; comandos na coluna acionando limpadores pela rede eletrica; nivel de combustivel partindo do mecanismo sensor/boia e circuito ate o instrumento. Confirmar arquitetura e aplicacao Golf antes de afirmar pinagem, modulo, resistencia ou topologia especifica; boia nao deve ser confundida com o motor da bomba.
- Meta geometrica: carroceria reconhecivel como Golf V, paineis/portas articulados e interior completo; conferir estrutura/agregados contra referencias Golf, sem tratar envelope generico ou cotas estimadas como carroceria de fabrica certificada.
- Continuidade imediata depois de rodas/freios: integrar o comando hidraulico as pecas existentes, preservando os demais conjuntos. Os exemplos acima permanecem requisitos de longo prazo, nao entregas ja prontas.
- Pedido atual do usuario (2026-09-09): voltar ao Astra e retomar a construcao do carro. Modelagem e camera novamente autorizadas. Preservar pesquisas e declarar dimensoes estimadas; nao apresentar o carro como completo.
- Estado mais recente: cabine/chassi/carroceria e pacote generico de embreagem montados. Volante, disco, anel de pressao, tampa e diafragma agora presentes com vistas Conjunto/Explodida. Referencias anteriores a ausencia dessas pecas sao historicas; aplicacao OE, pressao e torque continuam pendentes.
- Ressalva de aplicacao: KType 17281 agrupa sete motores e diferentes conjuntos. Os tres furos da guia candidata 3114 600 007 nao comprovam erro dos dois fixadores do modelo 02S. Afirmacoes anteriores de erro confirmado ficam retificadas: e um conflito de aplicacao ainda aberto. Kits de 228 e 230 mm listados no mesmo KType nao sao necessariamente intercambiaveis no mesmo exemplar.
- A pesquisa anterior ficou cara. Usar o acervo existente antes de abrir novas buscas; trabalhar por item, com entrega verificavel. Nao repetir pesquisas ja resolvidas.
- Este documento consolida as rodadas recentes e o contexto anterior necessario para nao perder decisoes. Nao e uma lista de materiais completa de fabrica nem um historico de cada consulta do navegador.
- Estado atual: cena didatica funcional, mas fidelidade geometrica parcial. Nao existe percentual confiavel de conclusao do carro.
- O usuario nao percebeu as ultimas adicoes 3D. Foram detalhes pequenos dentro da campana, sem camera propria de aproximacao. Nao apresentar isso como uma reformulacao visual do motor/carro.
- O indice [index.json](index.json) guarda imagens, URLs originais, hashes, limites e a fila resumida. Este MD amplia a passagem e o inventario; os dois devem ser mantidos coerentes.
- Quando trocar de agente novamente, ler este MD antes de pesquisar/modelar. Registrar a entrega nova na secao 13 e atualizar os estados da fila, sem apagar as incertezas anteriores.

## 2. Decisoes e limites que nao podem ser perdidos

### Entrega de montagem ampliada, 2026-09-09

#### Continuacao em 2026-09-10: comando hidraulico dos freios

- Continuidade das rodas/freios, sem reiniciar montagem: GolfBrakeControls substitui pedal/mestre/linhas estaticos de GolfChassis. Pedal interno clicavel e articulado, haste acompanhando o ponto de apoio, pistoes ilustrativos do mestre movendo-se e pastilhas fechando a folga de 0,7 mm. Mesmas coordenadas no carro e na inspecao. Reservatorio compartilhado extraido de GolfClutchHydraulics, sem duplicar no carro nem alterar a embreagem.
- golfBrakeRouting define duas saidas do mestre, quatro saidas distintas do bloco e linhas rigidas/flexiveis ate as entradas das pincas. Removidas linhas antigas desconectadas. Testes de endpoints incluem espelhamento esquerdo/direito; cores A/B apenas didaticas, nao cor OE de tubos.
- golfBrakeHydraulics: forca do pedal -> ganho do pedal/servo -> pressao do mestre -> dois circuitos diagonais -> forca nos pistoes/pastilhas -> torque. Modelo de resposta exponencial 60 ms; folga consumida ate 2 bar antes de gerar aperto. Vazamento selecionavel elimina pressao de uma diagonal, preservando a outra; sem servo ainda existe frenagem manual. Curso do mestre e animacao de pedal parametrizados, nao solucao de volume/compliance ou cinematica do mecanismo VW.
- Freios abre circuito completo, pedal/mestre ou uma das quatro rodas. Slider do pedal e clique no pedal 3D controlam o mesmo estado. Leituras de forca, curso, pressao A/B e torque por roda. Bancada lancada a 30 km/h integra desaceleracao, distancia, rotacao e energia dissipada; rodas param sem girar ao contrario, pincas fixas. Lancar retoma reproducao pausada. Fora da bancada, rotacao anterior por angulo do motor preservada; Reiniciar freios encerra bancada. Mesmo Driver atualiza ambos, sem relogio concorrente; bancada usa delta real independentemente da velocidade lenta do motor, ate limite de recuperacao de 60 s por chamada.
- Parametros TODOS didaticos estimados, sem PR/aplicacao homologada: forca maxima 500 N, relacao pedal 4, ganho assistido 3,5, mestre 23,8 mm, pistoes 54/38 mm, atrito pastilha 0,38, massa equivalente 1400 kg, atrito solo 0,8 e carga igualmente distribuida. Topologia diagonal nao apresentada como pinagem/roteamento VW confirmado. Limite de aderencia simplificado nao e ABS, modelo de escorregamento nem simulacao de bloqueio.
- Ainda pendentes: servo dependente de vacuo e reserva, cilindro tandem por conservacao de volume, nivel/perda de fluido, ABS/EBD, transferencia de carga, temperatura/desgaste, freio de estacionamento e acoplamento a torque/velocidade real do motor/cambio. Nao representa carro rodando fisicamente no mundo.
- Validacao: 96 testes Golf e TypeScript aprovados; dois E2E hidraulicos (pedal 3D, pressao, servo, vazamento, parada, cameras/pixels/orbita e retorno) e seis E2E de regressao rodas/carro/embreagem aprovados desktop/mobile. Camera corrigida para envelope do rotor em qualquer angulo. Rodada acumulada teve timeouts; apos fechar pagina extra de inspecao, repeticao das seis regressoes passou sem alterar limites/asserts. Capturas desktop/mobile revisadas.

#### Continuacao em 2026-09-10: rodas e freios

- GolfWheel substitui a roda local simplificada em GolfVehicle: aro com barril e bordas, raios, tampa, fixadores e valvula; pneus preservam envelope anterior. Cubos e rotores separados, discos dianteiros com duas faces e aletas, traseiros macicos; pastilhas, placas de apoio, suporte, corpo da pinca, pinos-guia, sangrador, protecao do disco e alavanca traseira simplificada.
- Centros VEHICLE_WHEELS preservados e raios antigos dos discos mantidos (156/143 mm), sem assumir aplicacao PR. Furo/quantidade de fixadores e dimensoes novas ilustrativos. Folga nominal das pastilhas 0,7 mm, nao especificacao de servico. Dois testes novos verificam folgas/limites; nao ha modelo de atrito, desgaste, pressao ou freio de estacionamento funcional.
- Montagem > Pneus e aros permite ocultar apenas a roda externa; cubo/rotor/pinca continuam presentes. Carro/Fantasma restauram rodas visiveis independentemente da escolha na montagem. Cubos/rotores acompanham a rotacao ilustrativa existente, pincas/suportes ficam fixos. Sem alteracao do modelo de velocidade ou torque.
- Validacao: 86 testes Golf, TypeScript, lint e build aprovados; quatro E2E rodas/freios + carro desktop/mobile aprovados. Testes conferem visibilidade, centros, limites projetados, pixels, rotor movel, pinca fixa e retorno ao carro; capturas revisadas. Build mantem aviso de chunk grande.

#### Continuacao: interior do cambio e diferencial

- GolfGearboxInternals e golfGearboxGeometry: extensao do eixo primario, eixo secundario, seis pares ilustrativos, tres sincronizadores, mancais simplificados, haste/garfos de selecao, coroa/pinhao e diferencial aberto esquematico com satelites/planetarias simplificados. Saidas do diferencial coincidem com os dois pontos internos dos semieixos existentes; dois testes verificam esses contatos e espacamento dos pares.
- GolfTransmission inclui conjunto no carro. Carcaca principal agora transparente em corte e volume do diferencial adicionado. Vistas anteriores da embreagem omitem internos para manter legibilidade. Embreagem > Cambio abre inspecao propria; seletor Todos/Par 1 a 6/Diferencial muda apenas destaque de cor, nao marcha ou torque.
- Geometria estatica generica, nao desenho de engenharia 02S. Dentes esquematicos sem perfil evolvente/helicoidal; contagens visuais nao sao dentes OE, relacoes nao especificadas. Re, engate, lubrificacao interna, tolerancias e dinamica do diferencial nao simulados.
- Verificacao: testes novos de geometria aprovados; E2E cambio e regressao transmissao aprovados desktop/mobile (quatro testes); apos aproximar camera, dois E2E cambio aprovados novamente. Capturas/pixels, alternancia de carcaca e retorno ao motor em movimento verificados.

#### Continuacao: sistemas auxiliares do cofre

- GolfAuxiliaries substitui radiador/reservatorio/mangueiras simplificados: radiador com caixas laterais, suporte da ventoinha, expansao, flange do cabecote, termostato, volume da bomba e seis rotas de mangueiras (radiador, retorno, expansao, aquecedor e desgaseificacao). golfCoolingGeometry centraliza portas e caminhos; dois testes verificam conexoes.
- Climatizacao: condensador, filtro secador representado por volume lateral, compressor, linhas, caixa HVAC e dutos. Lavador: reservatorio, bocal, tampa, bomba e linha. Coxins laterais e apoio pendular representados. Removidos dois semieixos antigos duplicados em GolfSystems; os novos continuam em GolfChassis.
- Limites: geometrias, rotas e aplicacao genericas estimadas. Sem circulacao/pressao de fluidos, refrigeracao AC, rigidez dos coxins ou acionamento da bomba simulados. Ventoinha preserva regra ilustrativa de temperatura >85 C; nao foram alteradas equacoes termicas.
- Validacao: 82 testes Golf, TypeScript, lint e build aprovados. E2E auxiliares + carro: quatro testes desktop/mobile aprovados; capturas e pixels conferidos. Em ambiente lento, teste novo espera ate 30 s pela inicializacao do canvas; primeiras rodadas falharam por timeout, rodada final completa passou. Build mantem aviso de chunk >500 kB.

#### Continuacao: pacote de embreagem

- GolfClutchPack e golfClutchPackGeometry: volante com cremalheira visual de 96 dentes estimados, adaptador ate a ponta existente do virabrequim, disco de 220 mm generico com duas faces de atrito/cubo sem estriado, anel de pressao, tampa aberta simplificada, diafragma de 18 dedos estimados e fixadores. Nao corresponde ao kit SACHS candidato; nao modela volante bimassa nem seleciona codigo OE.
- Faces nominais no eixo local: plato termina em 92 mm, disco vai de 92 a 100 mm, volante inicia em 100 mm. Cubo com folga radial ao envelope do eixo primario; ponta do adaptador em 184 mm coincide com ponta do virabrequim em engineToWorld([322,0,0]). Tres testes novos verificam encaixes/alinhamento/explosao.
- GolfTransmission inclui pacote; removido antigo volante Gear do virabrequim para evitar duplicidade. Giro ilustrativo acompanha o relogio do motor na montagem normal; eixo primario continua estatico e nao existe modelo de torque ou patinagem.
- Inspecao Embreagem: Mecanismo preserva visibilidade da alavanca/rolamento; Conjunto mostra pacote montado; Explodida separa volante/disco/plato com carcacas desabilitadas; Circuito mantido. Inspecao estatica, sem alterar coordenadas no carro.
- E2E golf-clutch-pack: conjunto/explosao, separacao axial, pixels, limites da camera e retorno ao carro girando aprovados desktop/mobile; regressao golf-transmission aprovada nos dois formatos.

- Pedido: acelerar a montagem em lotes maiores usando o acervo, sem novas geracoes pagas ou pesquisa repetida.
- GolfCabin: bancos dianteiros com trilhos, encostos e apoios de cabeca; banco traseiro de tres lugares; painel, instrumentos, ventilacao, console, alavanca de cambio, freio de mao, cintos simplificados, forros de porta, quebra-sois, espelho interno e porta-malas.
- GolfChassis: dianteira MacPherson com bandejas, molas/amortecedores; traseira independente de quatro bracos com molas separadas; barras estabilizadoras; dois semieixos dianteiros com coifas; cremalheira eletromecanica, terminais, coluna e volante; servo, mestre de freio, bloco ABS e linhas, pedais de freio/acelerador; protecoes termicas e tubo de abastecimento. Discos/pincas existentes preservados.
- GolfBodyShell e detalhes: capô, teto e tampa traseira alinhados ao contorno lateral, para-brisa e vidro traseiro; tres aberturas laterais por lado, retrovisores externos, macanetas, frisos, limpadores e acabamentos. Substituidas placas antigas que deixavam vaos grandes.
- Modo Montagem: preserva cabine, rodas e chassi, oculta paineis externos; Carro/Fantasma/Corte e inspecao da embreagem preservados. Troca de modo restaura enquadramento.
- Validacao local: 77 testes Golf e TypeScript aprovados. Novo e2e/golf-vehicle.spec.ts cobre quatro suspensoes, dois semieixos, cabine, alternancia de paineis, camera, pixels e continuidade do motor em desktop/mobile.
- Limites: dimensoes e encaixes novos estimados, nao homologados por VIN/PR. Direcao/suspensao/freios/pedais estaticos, sem dinamica veicular ou pressao simulada; coifas/forros simplificados. Nao representa uma lista completa de todas as pecas de fabrica. Disco/plato/volante e transmissao de torque continuam pendentes; nao confundir carro montado visualmente com veiculo mecanicamente simulado.

| Assunto | Decisao / evidencia | Limite |
| --- | --- | --- |
| Veiculo | Golf V 2.0 FSI, 2WD, tracao DIANTEIRA, escolhido explicitamente | Nao trocar para 4Motion |
| Motor de referencia | AXW, 110 kW, MED9.5.10, SSP318 p37 | Nao confirma um exemplar por VIN |
| Cambio de referencia | Familia manual 02S, seis marchas, matriz SSP318 p30-31 | Codigo individual, relacoes, PR e aplicacao exata ainda desconhecidos |
| Briefings antigos | BLX / 2005 / 02Q aparecem nos textos antigos | Nao sao autoridade sobre a referencia atual; nao recolocar 02Q automaticamente |
| Suspensao | PR ainda nao escolhido/confirmado | 2UA, 2UB e 2UC nao sao intercambiaveis; 2UC usado na tabela exclui 18 polegadas |
| Geometria | Diversas pecas procedurais com dimensoes estimadas | Coaxialidade interna e testes aprovados NAO provam medidas de fabrica |
| Aulas anteriores | Preservar Aula 3, Aula 4, os 27 componentes e a sincronizacao | Nao refazer cadastro de aula nem reconstruir cenas aprovadas |
| Pesquisa | Priorizar fabricante e documento tecnico identificavel | Espelho de manual/catalogo nao equivale a consulta oficial VW por VIN |
| Custos e direitos | Sem ferramenta paga, upload externo ou redistribuicao de referencias sem autorizacao | Imagens locais nao devem entrar no app/public automaticamente |

Documentos antigos para contexto, nao para sobrescrever estas decisoes: [briefing ASTRA](../../ASTRA-BUILD-GOLF-V-2.0-FSI.md), [prompt ASTRA](../../PROMPT-ASTRA.md).

## 3. O que foi feito, por rodada

Esta tabela separa alteracao visual, infraestrutura didatica e pesquisa. Os itens mais antigos sao contexto acumulado, nao trabalho novo da ultima rodada.

| Rodada | Entrega | Mudanca 3D / limite |
| --- | --- | --- |
| Auditoria SSP321/318 | Diferenca entre agregado dianteiro, traseira FWD e 4Motion; referencia AXW | Corrigida representacao traseira FWD para aco com fixacao direta; dianteira continua com 4 de 6 apoios |
| Auditoria BLX/cambio/pneu | Conferidas tabelas secundarias; corrigido diametro incorreto de 836 mm no briefing para nominal 634,3 mm em 225/45 R17 | Cena ja usava raio 317,15 mm; nao houve nova geometria nessa correcao |
| Alinhamento | Avaliador estatico com PR explicito, altura cubo-arco, convergencia/camber/caster e dados ausentes | Nao ajusta coordenadas para fingir conformidade |
| Painel dimensional | Selecao PR, alturas do modelo e estados nao medidos | Altura modelo 356,85 mm nas quatro rodas; nao e altura livre do solo |
| Marcadores | Centros de cubo/arco, linha vertical, selecao de roda | Anotacoes sobrepostas ao modelo; nao sao pontos medidos de fabrica |
| Foco por roda | Camera enquadra a cota e volta para a vista anterior | Essa camera e das rodas, NAO da embreagem |
| Agregado dianteiro | Identificados console, suporte, bieleta, apoio pendular; buchas superior/inferior separadas em grupos | Separacao de buchas estimada; nao acrescentados dois apoios sem coordenadas |
| Fixacoes dianteiras | N40-10020: consoles 1/8, agregado 4/5, suportes 9/18; T10096 usa 1/8/9/18 | Pesquisa e inspector; nenhuma nova coordenada |
| Carroceria/gabarito | Body Repairs, VAS6240/2, Celette 2035.300 e limites de cotas | Nenhuma geometria; nao encontrado conjunto de XYZ nominal utilizavel |
| Escolha 2WD | Identidade visivel de tracao dianteira | Sem mudanca de geometria nessa rodada |
| Referencia 02S | Constante/testes/inspector com AXW + familia 02S | Pesquisa, sem geometria mecanica nova |
| Cilindro escravo | Corpo externo, duas fixacoes, coifa, haste, porta hidraulica aberta | Novo 3D estimado e estatico; nao e atuador concentricamente integrado ao rolamento |
| Alavanca e pivo | Chapa com abertura central e furo de servico, nervuras, assentos concavos, pivo esferico | Novo 3D estimado; contatos conferidos, sem atuacao |
| Rolamento e guia | Perfis vazados, portador, face, dois grampos, guia e vedacao | Novo 3D estimado; rolamento separado do cilindro |
| Alinhamento motor/cambio | Eixo radial corrigido e campana virada com abertura maior para o motor | Posicao axial e perfil continuam estimados; transmissao nao funcional |
| Eixo primario | Envelope externo liso, ombro e ponta, alinhado com guia | Novo 3D estatico; sem estrias inventadas, sem engrenagens internas |
| Disco SACHS | Dados oficiais do disco candidato e links no inspector | SEM nova geometria de disco; candidato nao selecionado |
| Aplicacao volante/kit | Cadeia ZF e corroboracao Catcar | SEM alteracao de codigo/UI/geometria nessa pesquisa complementar |
| Acervo local | 11 imagens, indice com URL/hash/limites, regra de Git ignore | SEM 3D novo; referencias nao usadas como assets do app |
| Ultima rodada de modelagem | Mola de retencao item 5 e dois olhais/fixadores item 6 da guia | Pequenos detalhes internos, estimados; testes e inspector atualizados |
| Depois da modelagem | Conferida fila de pesquisa e explicada baixa visibilidade das pecas | Nenhuma nova camera/peca; fila original tinha 5 frentes especificas + 1 generica |
| Passagem atual | Este MD e ponte de retomada no indice | Documentacao apenas; nenhuma pesquisa externa nova |

## 4. Arquivos e estado implementado

### Mecanica e cena preservadas

- [GolfLessonScene.tsx](../../src/features/courses/lessons/scenes/golf/GolfLessonScene.tsx): cena, painel recolhido `Motor e cambio / referencia`, controles e inspector DEV `inspectGolf`.
- [GolfEngine.tsx](../../src/features/courses/lessons/scenes/golf/GolfEngine.tsx), [GolfCylinder.tsx](../../src/features/courses/lessons/scenes/golf/GolfCylinder.tsx) e [golfPhysics.ts](../../src/features/courses/lessons/scenes/golf/golfPhysics.ts): mecanica didatica existente. Nao refazer por causa desta passagem.
- [GolfSystems.tsx](../../src/features/courses/lessons/scenes/golf/GolfSystems.tsx): `Accessories` monta `golf-gearbox`, campana, escravo, alavanca, rolamento e eixo. Tambem contem combustivel, eletrica, arrefecimento simplificado e escape.
- [GolfVehicle.tsx](../../src/features/courses/lessons/scenes/golf/GolfVehicle.tsx): carroceria, rodas e elementos de suspensao simplificados. Rotacao de roda por angulo/3,55 e didatica; NAO relacao de cambio 02S confirmada.
- [golfElectrical.ts](../../src/features/courses/lessons/scenes/golf/golfElectrical.ts), [GolfFuseBoxes.tsx](../../src/features/courses/lessons/scenes/golf/GolfFuseBoxes.tsx) e [GolfTestPoints.tsx](../../src/features/courses/lessons/scenes/golf/GolfTestPoints.tsx): rede ideal com tensoes chaveadas, fusivel/falha e 17 pontos DC. Nao e esquema eletrico VW completo ou solver de circuitos real.
- [motronicMap.ts](../../src/features/courses/lessons/scenes/motronicMap.ts): identidade dos 27 componentes didaticos. Preservar IDs ao pesquisar e modelar.

### Estrutura e dimensoes

- [golfStructureGeometry.ts](../../src/features/courses/lessons/scenes/golf/golfStructureGeometry.ts) e [GolfFrontStructure.tsx](../../src/features/courses/lessons/scenes/golf/GolfFrontStructure.tsx): referencias do agregado/apoios, buchas pendulares e estrutura visual.
- [golfAlignment.ts](../../src/features/courses/lessons/scenes/golf/golfAlignment.ts): avaliacao estaticamente referenciada; nulo e nao medido, valor nao finito e invalido.
- [golfVehicleGeometry.ts](../../src/features/courses/lessons/scenes/golf/golfVehicleGeometry.ts): contorno, cubos e marco de arco do modelo. Arco Y=674, cubo Y=317,15; diferenca 356,85 mm. Nao e amostragem de carro real.
- [GolfDimensions.tsx](../../src/features/courses/lessons/scenes/golf/GolfDimensions.tsx), [GolfDimensionMarkers.tsx](../../src/features/courses/lessons/scenes/golf/GolfDimensionMarkers.tsx) e [golfDimensionCamera.ts](../../src/features/courses/lessons/scenes/golf/golfDimensionCamera.ts): painel, cotas e foco de roda ja implementados.

### Conjunto de embreagem: o que realmente existe

| Arquivos | Representacao atual | O que NAO foi confirmado/feito |
| --- | --- | --- |
| [golfPowertrainReference.ts](../../src/features/courses/lessons/scenes/golf/golfPowertrainReference.ts) | AXW/02S/FWD, URLs e paginas | Codigo individual, relacoes e aplicacao exata |
| [golfClutchReference.ts](../../src/features/courses/lessons/scenes/golf/golfClutchReference.ts), [GolfClutchSlave.tsx](../../src/features/courses/lessons/scenes/golf/GolfClutchSlave.tsx) | Escravo externo item 10, haste 11, fixacao 9, campana alinhada | Part number, dimensoes e posicao de fabrica, mangueira |
| [golfClutchGeometry.ts](../../src/features/courses/lessons/scenes/golf/golfClutchGeometry.ts), [GolfClutchLever.tsx](../../src/features/courses/lessons/scenes/golf/GolfClutchLever.tsx) | Alavanca 7, pivo 2, mola 5, aberturas reais | Dimensoes, elasticidade, pre-carga, curso e cinematica real |
| [golfClutchBearingGeometry.ts](../../src/features/courses/lessons/scenes/golf/golfClutchBearingGeometry.ts), [GolfClutchBearing.tsx](../../src/features/courses/lessons/scenes/golf/GolfClutchBearing.tsx) | Guia 4, vedacao, rolamento 8, dois grampos, olhais/parafusos 6 | Rosca, torque, acionamento da cabeca, medidas e orientacao de fabrica |
| [golfInputShaftGeometry.ts](../../src/features/courses/lessons/scenes/golf/golfInputShaftGeometry.ts), [GolfInputShaft.tsx](../../src/features/courses/lessons/scenes/golf/GolfInputShaft.tsx) | Envelope externo liso, candidato SACHS separado dos dados do eixo | Estrias do eixo real, tolerancias, engrenagens, rolamentos internos |

Nao existem ainda disco/plato detalhados, volante bimassa fiel nem transmissao de torque pela embreagem. O volante existente no motor e um placeholder. O circuito do pedal agora existe como geometria estatica estimada, sem pressao, curso ou acoplamento simulados.

### Coordenadas e estimativas para retomar sem desmontar o conjunto

- Unidades da cena: mm; X direita, Y cima, Z traseira. Raiz do motor `[300,415,-70]`, rotacao `[GOLF.tilt, PI, 0]`. Virabrequim local X aponta para -X mundial.
- Transformacao compartilhada: `engineToWorld([axis,height,depth]) = [300-axis, 415+height*cos(tilt)+depth*sin(tilt), -70+height*sin(tilt)-depth*cos(tilt)]`.
- `GolfClock` e angulo mestre unico. Manter offsets `[0,540,180,360]` e fases da Aula 3; nao criar relogio concorrente.
- Parametros atuais do modelo: bore 82,5; stroke 92,8; biela 144; altura de compressao 32,5; deck 223; espacamento 88; inclinacao 12 graus. Esta lista registra implementacao, NAO certifica todas essas medidas como VW.
- Cambio: `engineToWorld([440,0,0]) = [-140,415,-70]`. Correcao removeu deslocamento radial antigo Y=-15/Z=+10; axial 440 continua estimado.
- Campana: perfil preservado `[[80,-100],[100,-100],[165,45],[160,90],[150,95]]`, rotacao Z=-PI/2; boca maior em X mundial -45 para o motor, menor em -240. Nao e contorno de fundicao medido.
- Escravo local `[-105,144,0]`, Z=-PI/2. Pes em Y mundial 537, topo da caixa 537,5. Contato haste/alavanca local `[-73,144,0]`.
- Pivo local `[-73,-112,0]`; centro do rolamento local `[-66,0,0]`, mundial `[-206,415,-70]`.
- Guia: raios interno/externo 13/17; carrier 17,6/20; face externa 31. Guia axial -34..26, carrier -10..10, face 11..22, relativos ao centro. Tudo estimado.
- Mola: `CLUTCH_SPRING_MODEL`, arame raio 0,8, meia abertura 5,3, plano do pescoco X=-6,5, topo 28, gancho inferior -21. Caminho continuo simetrico junto ao pivo, origem mundial `[-213,303,-70]`. Nao confundir com grampos do rolamento.
- Fixacoes: `GUIDE_FIXING_MODEL`, offsets locais -28/+28, olhal raio 7/furo 3,5/espessura 4, parafuso raio 3/cabeca 5,5. Centros mundiais X=-240, Y=443/387, Z=-70. Rebaixo circular da cabeca e estimativa, nao tipo de ferramenta confirmado.
- Eixo primario: X mundial -248..-95, Y=415/Z=-70; raios 10/11/8 estimados. Sem dentes. Numero de estrias e part number reais continuam nulos.
- Volante placeholder: local `[339,0,0]`, raio 114/largura 22, centro X mundial -39. Nao usar suas faces como datum de conjunto axial de fabrica.
- Todas as pecas novas de embreagem permanecem estaticas enquanto o virabrequim gira. Nao animar pelo angulo do motor sem modelo de pedal/hidraulica/acoplamento.

## 5. Pesquisa realizada: fontes, resultados e lacunas

### VW SSP e familia de veiculo

- [SSP318 d1](https://www.volkspage.net/technik/ssp/ssp/SSP_318_d1.pdf): matriz p30-31 confirma 2.0 FSI 110 kW com manual 02S e automatico 09G; 02Q nao marcado nessa linha. P37: AXW, MED9.5.10. O arquivo d2 inicia em outra parte e nao substitui essa matriz.
- [SSP321](https://www.volkspage.net/technik/ssp/ssp/SSP_321.pdf): p7 agregado dianteiro de aluminio em tres partes, seis apoios; p13 traseiro FWD em aco soldado com fixacao direta; p16 traseiro 4Motion em aluminio com isoladores e diferencial; p23 direcao eletromecanica de duplo pinhao. P5 distingue suspensoes standard/sport/heavy-duty.
- SSP322 aparece como referencia didatica do motor no projeto. A auditoria recente da combinacao motor/cambio foi pelo SSP318; nao atribuir novas cotas ao SSP322 sem conferir a pagina.
- [Indice do espelho de manual Golf Mk5](https://workshop-manuals.com/volkswagen/golf-mk5/fullindex/): consultar links reais. Caminhos adivinhados podem redirecionar; uma pagina de propaganda nao prova ausencia do manual.
- Tabela BLX no espelho: inicio 05.04, 1984 cc, 110 kW a 6000 rpm, 200 Nm a 3500 rpm, 82,5 x 92,8, compressao 11,5:1, MED9.5, modos homogeneo/estratificado e armazenamento NOx. Isso nao confirma BLX/02Q/FWD do briefing.
- Tabela 02S 4WD menciona HJM 08.04-05.06 para Golf 4Motion 2.0 110 kW, mas sem codigo de motor. NAO adotar HJM, final 64/15 ou flange 100 mm no FWD atual.
- Tabela secundaria 02S dianteiro menciona GQP/GXV com 100 kW, conflitante com os 110 kW da referencia. Vendedores associam a FSI, mas nenhum codigo/relacao foi adotado.
- Nota agrupada AXW/BLX/BLR/BLY em tanque 4WD nao prova aplicacao unica de tracao para cada motor.

### Estrutura, alinhamento e metrologia

- Referencias de alinhamento: capitulos `wheel_alignment_specifications_golf` e `raising_wheel_suspension_to_unladen_position_golf` do espelho. URLs completas e valores vivem em `golfAlignment.ts`; altura cubo-arco nao e altura ao solo. Angulos atuais nao medidos.
- N40-10411: console 3, suporte com bucha 4, bieleta 2, bandejas alternativas 10/11, apoio pendular 24, bucha inferior 25 e superior 29. Aplicacao de variantes T/V nao resolvida; nao combinar alternativas.
- N40-10020: consoles 1/8, agregado 4/5, suportes 9/18. N40-10022 localiza console; N40-10032 localiza suporte. A numeracao nao e a mesma da vista explodida anterior.
- [Body Repairs Golf 2004, edicao 06.2010](https://vwts.ru/vw/g5/vw_golf_5_2004_body_repairs_eng.pdf): 273 paginas. P14 impressa/PDF20 diz cotas de verificacao; VAS6240 e referencia final. P28/PDF34 N00-10159: diagonal 1097 mm. P29/PDF35 N00-10086: transversal 828 mm. Nao converter essas duas medidas isoladas em seis XYZ.
- P32/PDF38: bancada VAS6240 e suplemento Golf VAS6240/2; detalhes acompanham equipamento. PDF39-41 trata medidor de portas VAS5007/18, nao pontos inferiores do agregado.
- [Celette 2035.300](http://www.hidroliftbg.com/pdf/2035.300.pdf): quatro paginas, PQ35 Golf V Typ1K, 2WD e 4WD; ferramenta 43 com asterisco e 4Motion. Datas 08.12.2004/29.09.2003. Estacoes, codigos MZ e adaptadores NAO sao coordenadas em mm.
- 2035.305/VAS6240/5 e Jetta/Variant; nao substituir por suplemento do Golf. Equivalencia dimensional Celette/VAS6240/2 nao demonstrada.
- [Car-O-Data](https://car-o-liner.com/product/car-o-data/): pagina oficial anuncia assinatura. Nao foi obtida ficha especifica do Golf com pontos/datum; pagina generica nao prova disponibilidade da ficha desejada.
- Falta ficha nominal metrica com datum, identificacao/fotos dos seis pontos e variante, ou calibracao metrica da bancada mais dimensoes dos adaptadores. Nao repetir busca generica por gabarito.

### Mecanismo de embreagem 02S

- [Vista A30-0005](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_release_mechanism/assembly_overview_clutch_release_mechanism/): escravo externo 10, parafusos 9, haste 11, alavanca 7, pivo 2, mola 5, rolamento separado 8, guia 4 e fixacao 6.
- [Reparo: S30-0070 e A30-0068](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_release_mechanism/repairing_clutch_release_mechanism/): orientacao montada, retentor de arame no pivo, abertura da alavanca e grampos do rolamento. Mola de retencao e grampos sao pecas distintas.
- Guia tem O-ring vulcanizado; manual orienta renovacao conjunta com vedacao. Fonte comprova montagem/topologia, nao medidas dos perfis procedurais.
- Manual de embreagem informa acoplamento das estrias do eixo com o cubo do disco, nao com a guia. Nao fornece desenho suficiente do eixo macho.
- A30-0131: conjunto Sachs com volante bimassa. Selecao depende do catalogo de pecas; nao comprova AXW/02S exato por si.

### Disco, plato e volante candidatos

| Fonte primaria ZF | Resultado confirmado do produto | Limite |
| --- | --- | --- |
| [Disco 1864 001 694](https://aftermarket.zf.com/de/catalog/products/1864%20001%20694/?country=DE) | 228 mm, 28 dentes, perfil do cubo `20,3x22,1-28N`, EAN 4013872761715 | Sem aplicacao exata confirmada; perfil de cubo nao define tolerancias/comprimento do eixo |
| [Kit 3000 970 036](https://aftermarket.zf.com/de/catalog/products/3000%20970%20036/?country=DE) | Disco 1864001694; plato 3082001409; rolamento 3151000388; parafusos 1874000002; graxa 4200080060 | Uma indicacao de substituicao por 3151600888 apareceu na busca, mas nao adotar sem confirmacao |
| [Modulo 2290 601 053](https://aftermarket.zf.com/de/catalog/products/2290%20601%20053/?country=DE) | Reune kit 3000970036 e volante 2294001780; nao pre-montado | Cadeia de produtos nao e consulta por veiculo |
| [Volante 2294 001 780](https://aftermarket.zf.com/de/catalog/products/2294%20001%20780/?country=DE) | Bimassa, cruza OE 06F105266 / 06F105266AB | Faltam stack axial e aplicacao especifica |

- Catalogo ZF no mercado BR retornou vazio; selecionar Europa > DE resolveu. Nao concluir que produto nao existe a partir do filtro BR.
- [Catcar](http://www.catcar.info/audivw/), espelho independente: Golf/Variant, mercado ZA, ano 2005, prancha 10520, grafico 010515194. Item 10 cruza 06F105266AB e antigo 06F105266 com AXW/BLX/BLY; item 14 N90665001, 6 unidades, M10x1x22.30, menciona manual seis marchas AXW/BLX/BLY/AXX. Nao explicita 02S/FWD/PR na linha do volante. A URL arquivada e a entrada do catalogo, com localizador no JSON, nao permalink da selecao.
- [S-Performance, aplicacao anunciada AXW](https://www.sachsperformance.com/en/clutch-kit/sachs-performance/vw-golf-v-1k1/2-0-fsi-110kw): menciona 228 Sachs / 230 LuK e kits -S dependentes do volante. Sao modificados pelo distribuidor, nao kits de serie vendidos pela ZF; fotos declaradas simbolicas. Excluir como referencia visual de fabrica.
- Estado de `CLUTCH_DISC_CANDIDATE`: `selectedForScene=false`, aplicacao nao confirmada, `shaftDrawing=null`. Nao mudar isso por encontrar mais uma foto ou anuncio generico.
- Proximo passo de aplicacao: fonte especifica por codigo de cambio/PR/VIN ou ficha tecnica identificada. Sem isso, relatar lacuna e pesquisar outro item independente.

### Acionamento da embreagem 02S: pedaleira e hidraulica (rodada 2026-09-09)

Fonte: espelho independente do manual de oficina, capitulo `power_transmission / 6-speed_manual_gearbox_02s / clutch_control / clutch_operation`. Existe um capitulo homonimo sob `6-speed_manual_gearbox_02s_four-wheel_drive`: NAO usar, a referencia adotada e dianteira.

O capitulo se divide em [visao geral do acionamento](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_operation/overview_clutch_actuation/): I pedaleira, II hidraulica volante a esquerda, III hidraulica volante a direita. Somente a variante esquerda vale para a cena.

Paginas do capitulo, para nao redescobrir: `overview_clutch_actuation`, `assembly_overview_pedal_cluster`, `removing_and_installing_over-centre_spring`, `removing_and_installing_clutch_pedal`, `removing_and_installing_mounting_bracket`, `removing_and_installing_master_cylinder`, `removing_and_installing_clutch_position_senderg476`, `assembly_overview_hydraulics_(lhd)`, `assembly_overview_hydraulics_(rhd)`, `removing_and_installing_slave_cylinder`, `bleeding_clutch_system`. Varias subpaginas trazem `?` literal na URL, que precisa ser escrito como `%3F`.

**Pedaleira, [prancha N30-10067](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_operation/assembly_overview_pedal_cluster/), arquivada em [02s-pedal-cluster.webp](images/02s-pedal-cluster.webp).** Itens: 1 corta-fogo com apoio para o suporte; 2 vedacao autoadesiva colada ao suporte, sempre renovar; 3 suporte da pedaleira, com amortecimento em algumas variantes de equipamento; 4 parafuso; 5 mola sobre-centro; 6 bucha de mancal; 7 pino do pivo; 8 pedal de embreagem; 9 retentor que separa o cilindro mestre do pedal; 10 vedacao entre mestre e suporte, sempre renovar; 11 cilindro mestre; 12 sensor de posicao da embreagem G476; 13 presilha, puxada ate o batente para soltar a linha; 14 mangueira de alimentacao, de borracha e de plastico a partir de 12.05; 15 porca autotravante, 3 unidades, suporte ao corta-fogo, sempre renovar; 16 porca sextavada, sempre renovar; 17 batente do pedal.

**Hidraulica esquerda, [prancha N30-0415](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_operation/assembly_overview_hydraulics_(lhd)/), arquivada em [02s-hydraulics-lhd.webp](images/02s-hydraulics-lhd.webp).** Itens: 1 reservatorio de fluido de freio; 2 grampo de mola; 3 mangueira de alimentacao; 4 cilindro mestre; 5 presilha; 6 retentor; 7 pedal; 8 porca sextavada; 9 vedacao/O-ring da conexao; 10 linha de tubo/mangueira; 11 retentor fixado a carroceria; 12 vedacao/O-ring; 13 presilha; 14 cilindro escravo; 15 parafuso sextavado; 16 valvula de sangria; 17 capa contra po; 18 cambio; 19 suporte; 20 parafuso sextavado. Topologia confirmada: o circuito e unico, do reservatorio de freio ate o escravo externo no cambio; nao ha reservatorio proprio da embreagem.

Torques com fonte, todos de montagem e nenhum de geometria: porca autotravante do suporte ao corta-fogo 25 Nm, 3 unidades, renovar; porca sextavada do item 16 da pedaleira 25 Nm, renovar; parafuso item 20 da hidraulica 20 Nm; parafusos do apoio do cambio 20 Nm mais 90 graus, renovar e apertar todos a mao antes. **O torque do cilindro escravo no cambio nao foi resolvido**: a pagina de servico apenas remete a um item, sem valor numerico. Nao preencher por analogia.

Conexoes da linha, [figura arquivada](images/02s-line-connection-seals.png): tres configuracoes, com ranhura circunferencial, com ressalto, e com ressalto mais ranhura. So as que possuem ranhura recebem vedacao. A alocacao das vedacoes e da mangueira depende do catalogo de pecas, que nao foi consultado. A [mangueira de plastico](images/02s-supply-hose-plastic.png) aloja as vedacoes internamente. Qual variante vale para a referencia da cena, borracha ou plastico, continua indefinido, porque depende da data de producao e ela nao foi fixada.

Procedimento do escravo, [pagina](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_operation/removing_and_installing_slave_cylinder/), figura em [02s-slave-removal-bolts.png](images/02s-slave-removal-bolts.png): o acesso passa pela caixa do filtro de ar, pelos cabos seletores e pelo apoio do cambio; a linha e travada por presilha empurrada ate o batente e testada por tracao; apos remover, nao acionar o pedal; ao final, sangrar o sistema. Isso e util para a narrativa didatica de manutencao, nao fornece cotas.

Cilindro mestre, [pagina](https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_operation/removing_and_installing_master_cylinder/), figura em [02s-master-cylinder-spacer.png](images/02s-master-cylinder-spacer.png): so sai junto com o suporte da pedaleira; a haste e presa ao pedal por um retentor que engata de forma audivel; a montagem usa um espacador de cerca de 40 mm entre pedal e batente. **Esse espacador e ferramenta de servico e nao pode virar curso do pedal nem dimensao de peca.** O sensor G476 aparece como interruptor do pedal F36 na deteccao guiada de falhas, o que importa para a parte eletrica da aula.

Lacunas que continuam abertas nesta frente, para nao serem inventadas: diametros e cursos do cilindro mestre e do escravo; relacao de pedal e curso total; comprimento e trajeto real da linha; codigos de peca; coordenadas de instalacao no veiculo; e a identidade da peca alongada desenhada sobre a linha na prancha N30-0415, que o texto do manual nao nomeia.

### Consulta por veiculo no catalogo ZF: codigos, cotas e um conflito (rodada 2026-09-09)

Esta e a primeira consulta **por veiculo**, nao por produto. Caminho: [busca por veiculo](https://aftermarket.zf.com/de/aftermarket-portal/unser-katalog/suche-nach-fahrzeug/) > Pkw > VOLKSWAGEN > GOLF V (1K1) > 2.0 FSI > variante `Frontantrieb; BLR/BLX/BVX/AXW/BVZ/BVY/BLY (01/04 -> 11/08; 150 PS)`.

Veiculo confirmado pela propria ficha do catalogo: 110 kW, 1984 ccm, 01/2004 a 11/2008, tracao dianteira, KType 17281, KBA 0603741 / 0603ADR / 0603AMF, motores BLR, BLX, BVX, **AXW**, BVZ, BVY, BLY. E a referencia didatica adotada, agora com identificador de catalogo.

| Peca | Codigo SACHS | OE VW correspondente | Dado tecnico publicado |
| --- | --- | --- | --- |
| Guia do rolamento | 3114 600 007 | 02A 141 180 A | **3 furos de fixacao**; marcada como "conferir numero OE" |
| Rolamento de embreagem | 3151 000 388, substituido por 3151 600 888 | 02A 141 165 A/D/E/G/M | 0,14 kg liquido; sem cotas |
| Cilindro escravo | 6283 605 040 | familia 1K0 721 261 | 0,12 kg liquido; TRW equivalente PJD279 informa diametro 19,05 mm |
| Cilindro mestre | 6284 605 102 | familia 1K0 721 388 | com sensor integrado; TRW equivalente PNB481 informa diametro 15,57 mm |
| Kit de embreagem | 3000 970 036 | - | 228 mm, 28 dentes, perfil 20,3x22,1-28N |
| Kit alternativo | 3000 951 120 | - | 230 mm, 28 dentes, perfil 20,3x22,2-28N |
| Volante bimassa | 2294 001 780 e 2294 001 020 | - | diametro externo 228 mm |

Ainda no mesmo catalogo aparecem cilindros de outras marcas para o mesmo veiculo, uteis como corroboracao de diametro: escravos TRW PJD241 e PJD264 tambem em 19,05 mm, e as designacoes SACHS `NZ19X42` para escravo e `GZ16X35` para mestre. **Tratar `NZ19X42` e `GZ16X35` como codigos de designacao, nao como cotas confirmadas**, mesmo que sugiram 19 e 16 mm.

**Conflito que o Astra precisa saber antes de mexer na guia:** a guia candidata 3114 600 007 tem **tres** furos segundo o catalogo; o modelo atual tem dois. A consulta agrupada nao confirma essa guia para o cambio 02S especifico. Conferir primeiro aplicacao OE/cambio, depois distribuicao angular e diametro dos furos. Nao declarar o modelo errado nem trocar dois por tres apenas por esse resultado de catalogo.

**Correcao de rumo sobre a aplicacao:** este veiculo aceita tanto o kit de 228 mm quanto o de 230 mm. O candidato de 228 mm arquivado nas rodadas anteriores aparece de fato ligado a este KType, o que o corrobora, mas **nao o torna exclusivo**. Continuar tratando `CLUTCH_DISC_CANDIDATE.selectedForScene` como falso ate existir criterio documentado de escolha.

Formas reais registradas nas fotos revisadas nesta rodada, todas sem escala:

- Escravo: corpo plastico, duas orelhas de fixacao diagonais com buchas metalicas, fole sobre a haste e porta de entrada angulada com presilha. Compativel com os "parafusos -setas B-" do manual. O cilindro liso atual da cena e uma simplificacao grosseira.
- Cilindro mestre: haste com ponta esferica, flange com vedacao, conector branco da mangueira e modulo do sensor integrado ao corpo, coerente com os itens 9 a 14 da prancha da pedaleira.
- Guia: flange com tres olhais, vedacao vulcanizada e estrias internas visiveis, coerente com o que o manual descreve.

O que esta consulta **nao** resolveu: nenhuma cota de forma foi publicada. Peso e diametro de embolo nao dao comprimento, largura, altura, posicao dos furos nem angulo da porta. O peso bruto de 2,00 kg anunciado para o cilindro mestre destoa do proprio produto e provavelmente inclui embalagem ou conjunto, entao nao usar como dado fisico da peca.

## 6. Referencias salvas e o que nao esta persistido

Os 25 arquivos abaixo estao indexados com pagina, URL original da imagem, tipo de fonte, finalidade, limites, bytes e SHA256. Total registrado: 478078 bytes. Conferir o indice antes de baixar de novo.

| Arquivo local | Conteudo / uso |
| --- | --- |
| [02s-clutch-a30-0005.webp](images/02s-clutch-a30-0005.webp) | Vista explodida do acionamento 02S |
| [02s-lever-s30-0070.webp](images/02s-lever-s30-0070.webp) | Alavanca montada |
| [02s-lever-bearing-a30-0068.png](images/02s-lever-bearing-a30-0068.png) | Alavanca, retentor e encaixe do rolamento |
| [02s-sachs-clutch-a30-0131.webp](images/02s-sachs-clutch-a30-0131.webp) | Disco/plato/volante Sachs; revisar antes de modelar |
| [sachs-1864001694-view-1.webp](images/sachs-1864001694-view-1.webp) | Foto real de catalogo do disco candidato; revisar antes de modelar |
| [sachs-1864001694-view-2.webp](images/sachs-1864001694-view-2.webp) | Segunda vista do mesmo disco; revisar antes de modelar |
| [front-assembly-n40-10411.webp](images/front-assembly-n40-10411.webp) | Agregado, consoles, bandejas e buchas |
| [front-locating-n40-10020.png](images/front-locating-n40-10020.png) | Seis posicoes documentais |
| [front-bracket-n40-10032.png](images/front-bracket-n40-10032.png) | Localizacao do suporte |
| [front-console-n40-10022.png](images/front-console-n40-10022.png) | Localizacao do console |
| [golf-axw-crank-flywheel-10520.png](images/golf-axw-crank-flywheel-10520.png) | Prancha Catcar do volante; revisar tabela/aplicacao |
| [02s-actuation-overview.webp](images/02s-actuation-overview.webp) | Divisao do acionamento em pedaleira e hidraulica esquerda/direita |
| [02s-pedal-cluster.webp](images/02s-pedal-cluster.webp) | Prancha N30-10067 da pedaleira, 17 itens; revisada nesta rodada |
| [02s-pedal-bracket-damping.webp](images/02s-pedal-bracket-damping.webp) | Suporte com amortecimento; variante nao confirmada para a cena |
| [02s-hydraulics-lhd.webp](images/02s-hydraulics-lhd.webp) | Prancha N30-0415 do circuito esquerdo, 20 itens; revisada nesta rodada |
| [02s-line-connection-seals.png](images/02s-line-connection-seals.png) | Tres configuracoes de conexao e onde ha vedacao |
| [02s-supply-hose-plastic.png](images/02s-supply-hose-plastic.png) | Mangueira de plastico a partir de 12.05 e vedacoes internas |
| [02s-slave-removal-bolts.png](images/02s-slave-removal-bolts.png) | Parafusos do escravo e do apoio do cambio, vista de servico |
| [02s-master-cylinder-spacer.png](images/02s-master-cylinder-spacer.png) | Retirada do mestre com espacador de servico; nao e curso do pedal |
| [02s-guide-sleeve-3114600007-view-1.webp](images/02s-guide-sleeve-3114600007-view-1.webp) | Foto real da guia 3114 600 007; tres furos de fixacao |
| [02s-guide-sleeve-3114600007-view-2.webp](images/02s-guide-sleeve-3114600007-view-2.webp) | Segunda vista da guia, olhais e estrias internas |
| [02s-slave-cylinder-6283605040-view-1.webp](images/02s-slave-cylinder-6283605040-view-1.webp) | Foto real do escravo 6283 605 040, OE 1K0 721 261 |
| [02s-slave-cylinder-6283605040-view-2.webp](images/02s-slave-cylinder-6283605040-view-2.webp) | Escravo em perspectiva: orelhas, fole e porta angulada |
| [02s-master-cylinder-6284605102-view-1.webp](images/02s-master-cylinder-6284605102-view-1.webp) | Foto real do mestre 6284 605 102 com sensor integrado |
| [02s-master-cylinder-6284605102-view-2.webp](images/02s-master-cylinder-6284605102-view-2.webp) | Segunda vista do mestre |

- `references/golf/images/` esta ignorada pelo Git. Um clone recebe o indice/MD, nao necessariamente as imagens. Fazer backup local separado; nao enviar a terceiros automaticamente.
- URLs terminadas em `.png` podem entregar WebP; conferir assinatura real antes de nomear o arquivo. Nao converter/regravar silenciosamente e invalidar o hash.
- Na ultima rodada havia quatro imagens extras nao indexadas e um arquivo `02s-clutch-manual.png` na raiz, de mudancas externas. Nao foram atribuidos a esta entrega, revisados nem removidos. Inventariar antes de adotar.
- PDFs de Body Repairs, SSP318 e Celette foram baixados em TEMP: `golf-2004-body-repairs.pdf`, `golf-ssp318-d1.pdf`, `golf-celette-2035.300.pdf`. Permanencia atual nao garantida; nao estao entre os 11 arquivos indexados. Proximo pesquisador deve persistir fontes/paginas uteis no acervo e indexar, sem afirmar que ja estao salvas ali.
- Os diagramas de acionamento/estrutura usados nas rodadas anteriores foram vistos. As fotos SACHS, vista Sachs completa e prancha Catcar estao marcadas para revisao visual antes de modelar. Arquivo baixado nao significa geometria aprovada.

## 7. Fila prioritaria de pesquisa

Nenhuma linha abaixo autoriza inventar dimensoes. Entregar por item usando a secao 10. A numeracao serve para retomada, nao e part number VW.

| ID | Item | Ja existe / ja foi pesquisado | Falta pesquisar e registrar |
| --- | --- | --- | --- |
| P01 | Mola de retencao 02S item 5 | 3D estimado, A30-0068 arquivada | Foto instalada e solta identificada; diametro do arame, dobras 3D, encaixe e pre-carga se documentada |
| P02 | Guia e fixadores item 6 | Dois olhais/parafusos estimados, A30-0005; catalogo e fotos indicam guia 3114 600 007 / OE 02A 141 180 A com 3 furos | CONFLITO: acertar o numero e a distribuicao dos furos com fonte cotada antes de alterar o modelo; faltam diametros, rosca, profundidade e torque |
| P03 | Aplicacao disco/plato/volante | Consulta por veiculo KType 17281 lista o kit 228 mm ja arquivado e tambem um kit de 230 mm | Criterio documentado para escolher entre 228 e 230 mm neste carro; a corroboracao nao torna o candidato exclusivo |
| P04 | Stack axial e estrias | Eixo liso e volante placeholder | Desenho do eixo/cubo, ressaltos, espessuras, planos de assentamento, tolerancias e distancias; nao medir perspectiva |
| P05 | Pedal e suporte | Prancha N30-10067 arquivada: 17 itens, torques de 25 Nm e sensor G476 identificados | Cotas do pedal e do suporte, curso e relacao, fotos reais montadas, variante com amortecimento e codigos de peca |
| P06 | Cilindro mestre | Prancha e pagina de servico arquivadas; codigo 6284 605 102, OE 1K0 721 388, foto real e diametro 15,57 mm pelo equivalente TRW | Cotas de forma do corpo, curso, e confirmacao do diametro em fonte do fabricante original |
| P07 | Tubulacao hidraulica | Prancha N30-0415 arquivada: circuito completo do reservatorio de freio ao escravo, 20 itens, tipos de conexao | Comprimento e trajeto reais, diametros da linha, codigos, torque do escravo no cambio e identidade da peca sobre a linha |
| P08 | Escravo/alavanca/pivo/rolamento | Topologia pesquisada e geometria estimada; escravo 6283 605 040 / OE 1K0 721 261 com foto real e diametro 19,05 mm pelo equivalente TRW; rolamento 3151 000 388 / OE 02A 141 165 | Cotas de forma do escravo, alavanca, pivo e rolamento; nenhuma dimensao geometrica foi publicada nestes catalogos |
| P09 | Seis apoios dianteiros | Identificacao documental resolvida; somente quatro modelados | Ficha metrica com datum/variante/pontos, XYZ e tolerancias; nao repetir Celette como se fosse XYZ |
| P10 | Aplicacao do veiculo | FWD e AXW/02S como referencia | Ano/mercado/codigo individual/PR comprovados, somente quando fonte especifica estiver disponivel; nao bloquear toda pesquisa por falta de VIN |

## 8. Inventario dos 27 componentes: pesquisa de fidelidade pendente

Os componentes didaticos ja existem no projeto. A tabela NAO diz que nao ha nenhuma informacao antiga sobre eles: diz que esta rodada nao concluiu um pacote de fotos, cotas e aplicacao de cada peca no Golf escolhido. Antes de pesquisar, verificar os dados/fontes locais de Aula 4 e os registros existentes. Nao reapresentar todos como novas pecas implementadas.

| ID didatico / partId | Componente | Pesquisa e imagens que faltam consolidar |
| --- | --- | --- |
| 1 / canister | Canister | Codigo FWD, vistas, suporte/localizacao, bocais e rotas de vapor; nao adotar tanque 4Motion |
| 2 / maf-sensor | MAF | Primeiro confirmar PRESENCA na variante AXW; mantido didaticamente, nao confirmado. Depois corpo, conector e trecho do duto, se aplicavel |
| 3 / ecu | ECU | MED9.5.10 de referencia conhecida; faltam caixa correta, etiqueta, conectores, fixacao e pinagem especifica |
| 4 / obd-connector | Tomada de diagnostico | Localizacao instalada, suporte, carcaca e ligacoes especificas; nao transformar conector generico em pinagem VW validada |
| 5 / mil-lamp | MIL / painel | Painel correto por variante, posicao do indicador e vinculo eletrico; imagem frontal identificada |
| 6 / immobilizer-antenna | Antena do imobilizador | Anel, cilindro/coluna, conector e interfaces dos modulos da variante |
| 7 / can-bus | Rede CAN / gateway | Diagrama, modulos, pares, conectores e trajetos reais; animacao atual nao e captura de rede |
| 8 / purge-valve | Valvula de purga | Codigo/aplicacao, setas de fluxo, bocais, suporte, conector e mangueiras |
| 9 / throttle-body | Corpo de borboleta | Vistas dos dois lados, diametro, flange, atuador, conector e montagem |
| 10 / hp-fuel-pump | Bomba de alta | Corpo, acionamento mecanico, fixacao no cabecote, tubulacao e interfaces; cotas identificadas |
| 11 / map-sensor | Sensor MAP | Aplicacao, corpo/sonda, vedacao, parafuso, conector e posicao no coletor |
| 12 / egr-valve | EGR | Confirmar variante, conjunto valvula/tubos/trocador se aplicavel, flanges, suportes e conexoes |
| 13 / rail-pressure-sensor | Sensor de pressao do rail | Codigo, rosca/assento, conector, orientacao e cotas documentadas |
| 14 / fuel-rail-gdi | Rail GDI | Formato, suportes, entradas, portas de injetores/sensor e afastamentos documentados |
| 15 / injector-gdi | Injetores GDI | Codigo, corpo/ponta, retencao, vedacoes, conector e inclinacao instalada; geometria de jato nao inferida de foto |
| 16 / knock-sensor | Sensor de detonacao | Quantidade/aplicacao, corpo, fixacao/torque e posicao no bloco, conector |
| 17 / ckp-sensor | Sensor de rotacao | Posicao e orientacao, conector, roda fonica aplicavel e folga documentada |
| 18 / fuel-pump-module | Modulo da bomba de baixa | Modulo correto do tanque FWD, flange, copo, boia, conectores e saidas; desenho atual simplificado |
| 19 / ignition-coil | Bobinas | Part number, forma, conector, comprimento, assentamento e relacao com vela |
| 20 / cmp-sensor | Sensor de fase | Posicao no cabecote, alvo/roda, fixacao, conector e quantidade correta |
| 21 / temp-sensor | Sensor de temperatura | Sensor/flange corretos, travamento, vedacao, conector e trecho do circuito |
| 22 / lambda-planar | Lambdas pre-catalisador | Referencia AXW tem duas ramificacoes pre-cat; faltam codigos, cabos, conectores, roscas e posicionamento cotado |
| 23 / catalytic-converter | Pre-catalisadores | Referencia de duas ramificacoes preservada; faltam carcasas, flanges, suportes e pacote dimensional correto |
| 24 / egt-sensor | Sensor de temperatura de escape | Aplicacao, posicao, haste, cabo, rosca e suporte do chicote |
| 25 / nox-catalyst | Armazenador de NOx e monitoracao | Separar catalisador, sensor e modulo associado; aplicacao, carcasas, tomadas, conectores e suportes |
| 26 / lambda-sensor | Lambdas pos-catalisador | Quantidade/posicoes por variante, cabos, conectores, roscas e ligacoes |
| 27 / battery | Bateria | Especificacao por variante, caixa, polaridade, bandeja, trava, capa, terminais e cabos; dimensoes atuais estimadas |

## 9. Inventario complementar por peca/conjunto

Esta e uma fila de cobertura do modelo atual e de suas interfaces, nao uma BOM exaustiva de todas as arruelas do carro. Abrir subitens quando uma prancha real revelar pecas adicionais; nao inventar part numbers para preencher tabela. Exceto pelos resultados explicitados nas secoes 5-7, nao ha pesquisa dimensional/visual especifica concluida nesta rodada para os itens abaixo.

| ID | Peca / conjunto | Lacuna a pesquisar | Ancora local |
| --- | --- | --- | --- |
| M01 | Bloco e carter superior | Fundicao, galerias visiveis, flanges, suportes, vistas/cotas AXW | GolfEngine |
| M02 | Cabecote e tampa | Portas, mancais/tampas, furos, volumes e fixacoes | GolfEngine / GolfCylinder |
| M03 | Junta e planos bloco/cabecote | Espessura/aplicacao e datum; nao alterar compressao por foto | golfPhysics / GolfEngine |
| M04 | Pistoes, aneis e pinos | Cavidade FSI, alturas, canaletas e aplicacao, preservar fases | GolfCylinder |
| M05 | Bielas, capas e bronzinas | Comprimento entre centros e interfaces documentados | GolfCylinder |
| M06 | Virabrequim e mancais | Colos, contrapesos, flanges, retentores e dimensoes | GolfEngine |
| M07 | Comandos, valvulas e molas | Perfis/acionamento, quantidade, distribuicao e cotas; diagramas reais | GolfEngine / GolfCylinder |
| M08 | Distribuicao e variador | Correia/corrente conforme trecho real, polias, tensores, tampas e sincronismo | GolfEngine |
| M09 | Velas e pocos | Codigo, rosca, alcance, assentamento e encaixe da bobina | GolfCylinder |
| M10 | Carter, pescador, bomba e filtro de oleo | Conjunto real, canais, trocador se aplicavel, suportes e ligacoes | GolfEngine / GolfSystems |
| M11 | Ventilacao do carter | Separador/valvulas e mangueiras identificadas | GolfEngine / GolfSystems |
| A01 | Caixa/filtro de ar e entrada | Silhueta, tampas, presilhas, suporte e conexoes | GolfSystems |
| A02 | Dutos e coletor de admissao | Caminhos, ramais, flanges, atuadores e conectores conforme AXW | GolfEngine / golfAssembly |
| A03 | Coletor e tubos de escape | Duas ramificacoes AXW, geometria, flanges e protecoes termicas | GolfSystems |
| A04 | Silenciosos e suspensores | Corpos, diametros, curvas, borrachas e fixacoes FWD | GolfSystems |
| F01 | Tanque FWD e bocal | Forma correta 2WD, cintas, protecoes, respiros e enchimento; tanques atuais nao comprovam forma de serie | GolfSystems |
| F02 | Linhas de baixa/filtro/regulacao | Circuito especifico, conexoes, retorno se aplicavel e presilhas | GolfSystems / golfAssembly |
| F03 | Linhas de alta | Trajetos, porcas, suportes e interfaces bomba/rail | GolfEngine / GolfSystems |
| C01 | Radiador | Colmeia/caixas laterais, bocais, fixacoes e dimensoes | GolfSystems |
| C02 | Ventoinhas e defletor | Quantidade correta, diametros, carenagem, modulo e suportes | GolfSystems |
| C03 | Reservatorio e tampa | Forma, suporte, bocais, sensor e pressao nominal documentada | GolfSystems |
| C04 | Bomba d'agua e termostato | Local, acionamento, carcaca, flanges e esquema do circuito | GolfEngine / GolfSystems |
| C05 | Mangueiras/flanges de arrefecimento | Cada ramal, derivacoes, aquecedor, suportes e abracadeiras | GolfSystems |
| E01 | Alternador e suportes | Corpo, polia, fixacoes, conexoes e aplicacao | GolfSystems |
| E02 | Motor de partida | Corpo, solenoide, pinhao, flange e relacao com cremalheira | GolfSystems |
| E03 | Correia de acessorios/tensor | Roteamento, polias, distancias e variante com/sem acessorios | GolfEngine / GolfSystems |
| E04 | Caixas de fusivel/reles | Fotos e mapas corretos por ano/PR; modelo existente e didatico | GolfFuseBoxes / golfElectrical |
| E05 | Chicote do motor | Ramais por componente, conectores, protecao, grampos e passagens | GolfSystems / golfElectrical |
| E06 | Positivo, massas e aterramentos | Bitolas/cores se documentadas, terminais, pontos e fusivel principal | GolfSystems / golfElectrical |
| E07 | Esquema eletrico de fabrica | Alimentacoes, pinos e variantes; nao deduzir pinagem pela malha atual | golfElectrical / GolfTestPoints |
| T01 | Campana/caixa 02S | Fotos multiplas, nervuras, flanges, furos e dimensoes identificadas | GolfSystems / golfClutchReference |
| T02 | Internos e diferencial 02S | Desenhos, aplicacao, engrenagens/eixos/rolamentos e relacoes apenas se confirmadas | Ainda nao detalhados |
| T03 | Selecao de marchas | Cabos, torre seletora, suportes e comando interno | Ainda nao detalhados |
| T04 | Semieixos e juntas | Comprimentos/interfaces FWD, homocineticas, coifas e apoios | GolfSystems |
| T05 | Coxins motor/cambio | Pecas, suportes e coordenadas documentadas por variante | golfMounts / GolfFrontStructure |
| S01 | Agregado e consoles | Topologia ja pesquisada; faltam fotos de peca e cotas reais | GolfFrontStructure |
| S02 | Bandejas e suportes traseiros | Escolher variante correta, buchas, pivo, dimensoes | GolfFrontStructure / GolfVehicle |
| S03 | Apoio pendular e duas buchas | Topologia pesquisada; falta aplicacao T/V, contorno e cotas | GolfFrontStructure |
| S04 | Manga, cubo e rolamento dianteiros | Formas, interfaces e cotas por PR | GolfVehicle |
| S05 | Amortecedor/mola/coxim dianteiros | PR, altura, curso, assentamentos e fixacoes | GolfVehicle |
| S06 | Estabilizadora e bieletas | Diametro/forma por PR, buchas, grampos e conexoes | GolfFrontStructure |
| S07 | Caixa de direcao e terminais | Duplo pinhao ja documentado; falta caixa real, suportes, barras e cotas | GolfFrontStructure |
| S08 | Agregado traseiro FWD | Aco e fixacao direta confirmados; faltam vistas/cotas | GolfFrontStructure |
| S09 | Bracos e porta-manga traseiros | Inventario real multilink, buchas, geometria e interfaces FWD | GolfVehicle / GolfFrontStructure |
| S10 | Molas/amortecedores traseiros | PR, fixacoes, assentos e curso | GolfVehicle |
| B01 | Freios dianteiros e traseiros | PR, disco/pinca/suporte/pastilhas e dimensoes; raios atuais nao comprovam aplicacao | GolfVehicle |
| B02 | Freio hidraulico e estacionamento | Servo, mestre, ABS, tubos/mangueiras, sensores e cabos; abrir subitens | Ainda sem pacote nesta rodada |
| B03 | Rodas/pneus | Medida nominal atual 225/45 R17; confirmar aplicacao/PR, tala, ET e desenho | GolfVehicle / golfVehicleGeometry |
| V01 | Carroceria externa | Vistas ortogonais identificadas, ano/carroceria, contornos e cotas, nao reconstruir de foto em perspectiva | GolfVehicle |
| V02 | Cofre, torres e longarinas | Datum e pontos, flanges, soldas e suportes; vinculo com P09 | GolfFrontStructure |
| V03 | Assoalho e travessas | FWD, tunel, fixacoes de tanque/escape e protecoes | GolfFrontStructure |
| V04 | Paineis, portas, capo e tampa traseira | Geometria, folgas e interfaces; separar apenas conforme escopo aprovado | GolfVehicle |
| V05 | Vidros, farois, lanternas e grade | Pecas corretas, silhuetas, espessuras/encaixes e suportes | GolfVehicle |
| V06 | Interior e corta-fogo | Painel, coluna, pedaleira, passagens e ancoragens relevantes para aula | GolfVehicle / GolfSystems |
| V07 | Ar-condicionado e aquecedor | Confirmar escopo/variante; compressor, condensador, tubos e conexoes se necessarios | Ainda sem pacote nesta rodada |

## 10. Contrato de entrega do agente pesquisador

1. Escolher um ID das filas acima e declarar exatamente a peca/variante a pesquisar. Ler primeiro fontes locais, indice e limites. Nao editar o app nessa fase.
2. Procurar foto REAL de peca identificada e foto instalada. Buscar frente, verso, lateral e interfaces quando necessario. Desenho tecnico identificado complementa, nao transforma pixels em milimetros.
3. Preferir fabricante/manual/catalogo de aplicacao. Registrar fonte secundaria como secundaria; informar contradicoes e restricoes de ano, mercado, motor, cambio e PR.
4. Salvar imagem localmente em `references/golf/images/`; guardar pagina original e URL direta do arquivo. Para PDF, persistir o original e/ou pagina util identificada, com pagina impressa e pagina PDF; registrar direitos/limites. Nao depender de TEMP, links soltos no chat ou miniatura de busca.
5. Atualizar `index.json`: ID unico, caminho, tipo, fonte, URLs, figura/part number, uso na modelagem, limites, status de revisao, bytes e SHA256, seguindo o padrao existente. Nao alterar hashes de arquivos anteriores silenciosamente.
6. Para cada medida, registrar valor, unidade, datum/plano/eixo, pagina/tabela e aplicacao. Separar `confirmado`, `estimado`, `nao encontrado` e `conflitante`. Nao inventar rosca, torque, pinagem, dentes ou espessura.
7. Registrar o encaixe: com quais pecas conecta, faces/furos, orientacao e ligacoes de fluido/eletrica/mecanica. A entrega deve permitir modelagem, nao ser apenas um link de compra.
8. Abrir os arquivos salvos para confirmar que decodificam, correspondem ao item e mostram o detalhe necessario. Download bem-sucedido nao equivale a revisao visual.
9. Encerrar o item com resultado, lacunas, caminhos e proximo alvo exato. Quando nao houver cota/fonte acessivel, marcar a falta e parar de repetir a busca; nao afirmar inexistencia universal do documento.
10. Atualizar este MD, inclusive secao 13, e a fila resumida do indice. Nao chamar pesquisa parcial de completa. Nao gastar creditos, assinar servicos, contornar restricoes nem enviar acervo a terceiros sem autorizacao.

Modelo de registro por entrega:

```text
Data / agente:
ID da fila e componente:
Estado anterior -> novo estado:
Codigo / fabricante / aplicacao / restricoes:
Fontes: pagina + imagem/PDF + pagina/figura:
Arquivos locais + IDs no index.json:
Revisao visual realizada:
Medidas confirmadas e referencias:
Estimativas (se houver, nao promover a cotas de fabrica):
Interfaces / orientacao / uso no 3D:
Conflitos / faltas / fontes descartadas:
Pode modelar? O que exatamente? O que nao pode?
Validacao do acervo:
Proximo passo delimitado:
```

## 11. Passagem para o Astra / agente de modelagem

- Ler este MD e as entregas novas; abrir as imagens locais antes da primeira alteracao.
- Nao tratar presenca de referencia como autorizacao para concluir dimensoes ausentes. Fotos sem cota podem orientar forma, mas nao sustentar declaracao de padrao de fabrica.
- Escolher uma peca com evidencia suficiente; comparar com o dono atual da geometria. Manter IDs, unidades, transformacoes e contatos.
- Fazer alteracao pequena seguida imediatamente de teste focado. Preservar mecanica da Aula 3, Aula 4, rede didatica e estado do usuario.
- Separar fidelidade da peca e aplicacao no veiculo. Disco SACHS conhecido nao esta automaticamente aprovado para o AXW/02S atual.
- Priorizar inspeccao visual da entrega. O foco de embreagem agora esta implementado: botao Embreagem, vistas Mecanismo/Circuito e checkbox Campana e caixa. O pedido mais recente retomou modelagem.
- Nao acoplar animacao da embreagem ao virabrequim; pedal/circuito/torque ainda nao existem.
- Ao terminar, registrar geometria alterada, limites, testes realmente executados, como inspecionar e a proxima rodada. Nao dar por pronto o conjunto inteiro por testes de uma peca.

## 12. Validacao anterior, ambiente e cuidados

### Ultimo estado validado antes deste MD

- TypeScript: aprovado.
- Vitest: 15 arquivos, 96 testes aprovados.
- Lint e build: aprovados. Aviso preexistente de chunk JS aproximadamente 2,714 MB, acima de 500 kB, permanece.
- E2E: dois testes de estrutura (desktop/mobile) aprovados; dois de embreagem (desktop/mobile) aprovados em rerun isolado.
- Precisao do relato E2E: no combinado, desktop da embreagem excedeu 120 s ao salvar screenshot depois das assercoes geometricas; rerun isolado aprovou os dois em cerca de 3,1 min. Nao foi uma unica execucao ininterrupta de quatro aprovacoes.
- Screenshots desktop/mobile foram vistos. Canvas nao vazio, geometria/contatos/estaticidade foram verificados. Ha sobreposicao preexistente no cabecalho do laboratorio, nao corrigida. Nao afirmar UI perfeita.
- `git diff --check` e diagnosticos dos arquivos afetados: aprovados. Os 11 hashes/assinaturas e decodificacao das imagens foram conferidos na rodada do acervo.
- Esses resultados sao HISTORICOS. Esta passagem apenas documental nao rerodou toda a aplicacao; a validacao desta entrega sera registrada na secao 13.

Testes relevantes: [golf-clutch.spec.ts](../../e2e/golf-clutch.spec.ts), [golf-structure.spec.ts](../../e2e/golf-structure.spec.ts) e arquivos `.test.ts` vizinhos aos modulos Golf. O inspector mede matrizes reais de cena, eixo radial/paralelismo, contatos, mola/fixadores e estaticidade enquanto o motor gira. Isso testa coerencia do modelo, nao certificacao dimensional.

### Ambiente e comandos

- Windows / PowerShell 5.1; Node 24.13.0; React 18, Three.js 0.169, R3F 8, Vite 5.4.21, Vitest 2.1.9.
- Servidor existente na ultima rodada: http://localhost:5173. Confirmar disponibilidade antes de reutilizar; nao iniciar outro desnecessariamente.
- Aula: http://localhost:5173/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo.
- Pasta do projeto: `C:\Users\xandao\Documents\GitHub\EngineDataFlow`.

```powershell
npx tsc -p tsconfig.app.json --noEmit
npm run test
npm run lint
npm run build
npm run e2e -- golf-clutch.spec.ts --workers=1
npm run e2e -- golf-structure.spec.ts --workers=1
git diff --check
```

- Vitest nao suporta `--runInBand`. Nao repetir o erro anterior.
- PowerShell 5.1 pode remover aspas de JavaScript em `node -e`; para verificacao multiline, here-string encaminhada a `node --input-type=module` funcionou.
- Nao usar `Array.toSorted` sem conferir o alvo TypeScript atual; foi necessario usar sort em array local novo.
- PDF.js pode omitir imagens JBIG2 sem `wasmUrl` e `standardFontDataUrl` corretos. Render anterior precisou desses caminhos. Texto extraido sozinho nao confirma que todas as figuras foram vistas.
- Falhas de quoting/download ocorreram e foram resolvidas antes da entrega do acervo. Conferir assinatura real, hash e imagem decodificada, nao apenas exit code.
- Screenshot real dos testes de embreagem fica sob `test-results/golf-clutch-...-desktop/` e `...-mobile/`, nome `clutch-engine.png`; nao assumir caminho `playwright-report/clutch-engine.png` inventado por relato de ferramenta.
- Worktree ja estava suja com alteracoes anteriores/externas. Nao atribuir tudo a esta rodada, reverter arquivos, limpar imagens/test-results ou criar commit/branch sem pedido.
- Nao ha tarefa pendente de build/teste desta passagem exigindo retomada de terminal. Historicos com exit code 1 acima nao anulam automaticamente os reruns aprovados descritos aqui.

## 13. Registro de entregas e proxima acao

### 2026-09-09: encerramento da modelagem recente

- Ultima geometria nova: retentor de arame item 5 e duas fixacoes da guia item 6; estimados, estaticos, com limites visiveis e testes.
- Pesquisas anteriores consolidadas: AXW/02S, FWD, estrutura/alinhamento/gabaritos, mecanismo de embreagem, disco e cadeia ZF/Catcar.
- Acervo existente: 11 imagens indexadas; cobertura parcial, sem pacote completo dos 27 componentes.
- Lacunas permanecem: aplicacao exata, stack axial/estrias, hidraulica/pedal, cotas das pecas, seis XYZ dianteiros e referencias de muitos conjuntos.

### 2026-09-09: passagem documental solicitada pelo usuario

- Criado este MD com historico, mapa de arquivos, fontes, acervo, medidas estimadas, fila prioritaria, os 27 componentes e inventario complementar por conjunto.
- Adicionada ponte `researchHandoff.resumeDocument` no indice para o proximo agente encontrar este documento.
- Sem mudancas de 3D, camera, fisica ou aulas; sem nova pesquisa externa.
- Validacao documental: JSON e ponte de retomada validos; 42 links locais existentes; componentes 1..27 completos e unicos; 10 prioridades e 55 itens complementares com IDs unicos; 11 imagens com bytes/SHA256 corretos, total 278053 bytes; sem whitespace final. Nao confundir com os testes historicos da secao 12. A primeira tentativa de verificacao usou campos/padroes incorretos e foi substituida por verificacao direta do formato real, sem alterar o acervo.

### 2026-09-09: pesquisa do acionamento da embreagem, P05 a P07

- Fila: P05 pedal e suporte, P06 cilindro mestre, P07 tubulacao hidraulica. Estado anterior: sem pesquisa consolidada. Estado novo: topologia, itens de montagem e torques levantados; cotas de peca continuam ausentes. Nenhum dos tres foi encerrado.
- Fontes: capitulo `clutch_operation` do 02S no espelho do manual de oficina, paginas de visao geral, pedaleira, hidraulica esquerda, cilindro mestre e cilindro escravo. A variante 4WD do mesmo capitulo foi identificada e descartada.
- Arquivos locais: 8 imagens novas em `references/golf/images/`, indexadas com pagina, URL da imagem, uso e limites, somando 137585 bytes. Acervo passa a 19 imagens e 415638 bytes.
- Revisao visual: `02s-pedal-cluster.webp` e `02s-hydraulics-lhd.webp` foram abertas e conferidas nesta rodada; as outras seis seguem marcadas para revisao antes de virar geometria.
- Medidas confirmadas, todas de aperto: 25 Nm nas 3 porcas do suporte ao corta-fogo, 25 Nm na porca item 16 da pedaleira, 20 Nm no parafuso item 20 da hidraulica, 20 Nm mais 90 graus nos parafusos do apoio do cambio. Nenhuma cota de forma foi obtida.
- Estimativas: nenhuma criada nesta rodada. Nada foi modelado nem alterado na cena.
- Interfaces registradas: pedal ao mestre por haste e retentor; mestre ao suporte por vedacao renovavel; alimentacao vinda do reservatorio de freio; linha ate o escravo com presilha e retentor na carroceria; escravo com sangrador e capa.
- Conflitos e faltas: torque do escravo no cambio e apenas remissivo; variante da mangueira, borracha ou plastico a partir de 12.05, indefinida enquanto a data de producao da referencia nao for fixada; a peca alongada sobre a linha na N30-0415 nao e nomeada pelo manual; diametros, cursos e codigos de peca continuam sem fonte.
- Pode modelar o que: apenas o encadeamento e a existencia das pecas, se o Astra aceitar volumes declarados como estimados. Forma exata do mestre, do pedal e da linha ainda nao tem base documental.
- Proximo passo: para fechar P05 a P07, buscar catalogo de pecas com codigos e desenhos cotados, ou fotos reais identificadas do conjunto instalado; as paginas restantes do capitulo, mola sobre-centro, pedal, suporte, sensor G476 e sangria, ainda podem render torques e sequencias, mas nao dimensoes.

### 2026-09-09: consulta por veiculo, codigos de peca e conflito da guia

- Fila afetada: P02 guia e fixadores, P03 aplicacao, P06 mestre, P07 tubulacao, P08 escravo e rolamento. Nenhum foi encerrado; todos mudaram de estado.
- Fonte: catalogo do fabricante em busca por veiculo, KType 17281, Golf V 1K1 2.0 FSI 110 kW dianteiro, motores incluindo AXW. Primeira consulta por veiculo do projeto; as anteriores eram por produto.
- Codigos obtidos com OE correspondente: guia 3114 600 007 / 02A 141 180 A; rolamento 3151 000 388, substituido por 3151 600 888, / familia 02A 141 165; escravo 6283 605 040 / familia 1K0 721 261; mestre 6284 605 102 / familia 1K0 721 388, com sensor integrado.
- Arquivos locais: 6 fotos reais de produto indexadas com pagina, URL, codigo e OE, somando 62440 bytes. Acervo passa a 25 imagens e 478078 bytes.
- Revisao visual: guia, escravo e mestre foram abertos e conferidos; as outras tres vistas seguem marcadas para revisao.
- Medidas confirmadas: guia com 3 furos de fixacao; diametro 19,05 mm no escravo e 15,57 mm no mestre, publicados pela marca equivalente e nao pelo fabricante original; disco de 228 mm com 28 dentes e perfil 20,3x22,1-28N, e alternativa de 230 mm com perfil 20,3x22,2-28N; volante bimassa com 228 mm externos.
- Estimativas: nenhuma criada. Nenhum arquivo de cena alterado.
- Conflito aberto: o modelo tem 2 olhais na guia e a peca aplicada tem 3. Registrado na fila como conflito, nao corrigido, porque falta distribuicao angular e diametro dos furos.
- Correcao de rumo: o veiculo aceita kit de 228 e de 230 mm. A corroboracao por veiculo reforca o candidato arquivado, mas nao o torna exclusivo; manter `selectedForScene=false`.
- Faltas: nenhuma cota de forma foi publicada, entao comprimento, largura, altura, posicao de furos e angulo de porta continuam sem fonte. O peso bruto de 2,00 kg do mestre e inconsistente com a peca e nao deve ser usado.
- Pode modelar o que: com as fotos, a silhueta do escravo, do mestre e da guia deixa de ser chute grosseiro e pode ser refeita como aproximacao declarada, mas sem cota nenhuma; proporcoes nao podem ser medidas dessas fotos.
- Proximo passo: procurar desenho cotado ou foto com escala das tres pecas identificadas, agora que existem codigos OE para buscar; e definir o criterio 228 contra 230 mm para este carro.
- Proxima acao: trocar para agente pesquisador, ler este MD e escolher um item independente com fonte acessivel. Entregar imagens/links/medidas no acervo e registrar aqui. Se P03/P04/P09 continuarem sem fonte especifica, nao repetir as mesmas buscas; avancar para outro item, por exemplo P05-P07 ou uma peca da secao 8.

Mensagem curta de retomada para o novo agente:

> Leia este MD e index.json. A fase voltou a ser modelagem por pedido do usuario. Preserve Golf V 2.0 FSI FWD, AXW/02S, unidades e contatos; use o acervo sem promover candidatos a pecas homologadas. Registre alteracoes, limites e testes. Sem ferramentas pagas ou upload externo.

### 2026-09-09: retomada da modelagem, circuito e inspecao

- Entrega: escravo com corpo polimerico, nervuras e presilha de conexao; transformacoes e contatos preservados. Referencia visual 6283 605 040, nao confirmacao de aplicacao exata.
- Novo [GolfClutchHydraulics.tsx](../../src/features/courses/lessons/scenes/golf/GolfClutchHydraulics.tsx): reservatorio de fluido compartilhado com freio, alimentacao, mestre com volume do sensor, suporte, pedal e linha com retentores ate a porta do escravo. Nao inclui servo-freio, ABS, tubulacao de freio completa, mola sobre-centro detalhada ou pinagem do G476.
- [golfHydraulics.ts](../../src/features/courses/lessons/scenes/golf/golfHydraulics.ts) centraliza coordenadas estimadas: mestre [-550,650,650], reservatorio [-520,840,520], porta do escravo [-304,585,-70]. Raios das linhas 5 e 3 mm sao escolhas visuais estimadas, nao diametros documentados. Nao foram transferidos diametros TRW para a geometria externa SACHS.
- [GolfTransmission.tsx](../../src/features/courses/lessons/scenes/golf/GolfTransmission.tsx) compartilha a mesma montagem entre carro completo e inspecao. Guia, eixo, pivo, alavanca e suas coordenadas preservados; dois fixadores continuam provisoriamente. O conflito de tres furos e de aplicacao, nao erro ja demonstrado.
- Inspecao: botao Embreagem na Aula 5 abre conjunto isolado. Mecanismo/Circuito muda o enquadramento; Campana e caixa alterna carcasas. Carro/Fantasma/Corte restaura a montagem completa. O relogio do motor nao foi substituido nem usado para animar o pedal.
- Camera geral agora enquadra limites reais de golf-vehicle; laboratorio limitado a altura util da tela. Inspector mobile rolavel em area de 120 px. Capturas mostram o conjunto inteiro, sem a navegacao cobrindo o canvas apos rolagem para o laboratorio.
- Limites: topologia estatica, cotas e trajeto estimados. Sem curso do pedal, pressao hidraulica, embreagem funcional, disco/plato ou volante definitivo. Nao e conclusao do carro completo.
- Validacao: TypeScript aprovado; 13 arquivos/73 testes Golf aprovados (incluindo 2 testes novos de conexoes). E2E novo golf-transmission: desktop e mobile aprovados; E2E existente golf-clutch: desktop e mobile aprovados. Build e lint aprovados; aviso de chunk >500 kB permanece. Capturas e pixels de canvas revisados; teste garante enquadramento e retorno ao carro, com motor em movimento.
- Proximo conjunto: resolver selecao documentada disco/plato/volante antes de modelagem fiel; em paralelo, refinar mestre/suporte/pedal com vistas identificadas. Nao trocar a guia para tres furos sem confirmar a aplicacao no 02S.