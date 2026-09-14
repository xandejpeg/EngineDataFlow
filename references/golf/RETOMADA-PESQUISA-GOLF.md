# Golf V: passagem de trabalho e retomada da pesquisa

Atualizado em 2026-09-11. Documento de entrada para o proximo agente pesquisador e para o Astra/agente de modelagem quando voltar.

## 1. Leia primeiro

- ULTIMA DIRETRIZ DO USUARIO, 2026-09-10, apos bancos/forros: exterior ainda esta muito longe de um Golf V. Adiar forro do teto, colunas internas e acabamento inferior do painel; manter esses tres itens pendentes, nao descartados. A prioridade agora e identidade exterior, acima das sugestoes de proximo lote registradas nas entregas anteriores. Preservar os mecanismos ja implementados.
- Proxima etapa exterior: comparar frente, perfil e traseira do modelo com referencias reais do Golf V de cinco portas ja registradas; avaliar primeiro proporcoes/silhueta e relacao capo-para-brisa-teto-traseira, depois volumes de para-lamas/para-choques e forma/posicao de farois, grades e lanternas. Sao frentes de avaliacao/correcao, nao cotas de fabrica verificadas. Nao confundir testes funcionais ou novos detalhes pequenos com aprovacao de identidade visual. Esta mudanca de prioridade foi apenas anotada; nenhuma geometria alterada nesta resposta.
- Pedido mais recente em2026-09-10: implementar agora portas, vidros, capo/vareta, porta-malas e iluminacao conectada. Lote funcional entregue abaixo; a insatisfacao com a identidade visual anterior NAO foi resolvida nem substituida por testes. Nao declarar Golf completo/fiel a fabrica.
- Diretriz do usuario em 2026-09-10: continuar a montagem acumulada em lotes substanciais, sem reiniciar nem trocar a ordem a cada exemplo. Os exemplos abaixo definem profundidade e integracao esperadas, nao uma lista exaustiva nem prioridade imediata. A priorityQueue do indice e uma fila de pesquisa dimensional antiga, nao a ordem dos lotes atuais de implementacao.
- Meta funcional: componentes conectados fisicamente e causalmente. Arrefecimento com circulacao/termostato/ventoinha; pedal interno acionando freios hidraulicos; pedal do acelerador passando pelo controle eletronico ate a TBI; comandos na coluna acionando limpadores pela rede eletrica; nivel de combustivel partindo do mecanismo sensor/boia e circuito ate o instrumento. Confirmar arquitetura e aplicacao Golf antes de afirmar pinagem, modulo, resistencia ou topologia especifica; boia nao deve ser confundida com o motor da bomba.
- Meta geometrica: carroceria reconhecivel como Golf V, paineis/portas articulados e interior completo; conferir estrutura/agregados contra referencias Golf, sem tratar envelope generico ou cotas estimadas como carroceria de fabrica certificada.
- Continuidade realizada depois de rodas/freios: comando hidraulico, pedal/ECU/TBI, arrefecimento termico, limpadores e agora boia/sensor/circuito/instrumento de combustivel integrados em modelos didaticos. Preservar os demais conjuntos. Os exemplos acima continuam metas de profundidade, nao certificacao de sistemas de fabrica completos.
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

### Conjunto traseiro compartilhado (2026-09-11, apos auditoria visual)
- Implementada primeira prioridade da auditoria, NAO todos os46itens: golfRearSurface compartilha secao curva entre lateral, tampa, lanternas e para-choque. Retorno lateral ate205mm, curva eliptica nos cantos, topo do para-choque coincide com fundo da tampa em710mm. Eliminado grande degrau/aba; cotas continuam estimadas.
- Revistos porta traseira/vidros, lanternas externas envolvendo canto, lentes tesselladas, alojamento da placa rebaixado28mm, cantos inferiores da tampa e juntas visiveis. Removida barra de macaneta incorreta. GolfRearTrim acrescenta spoiler curvo, moldura/desembacador visual e inscricoes locais GOLF/2.0FSI solidarios a tampa; sem novo funcionamento termico. Indicador tem lente clara e emissao amarela.
- Validacao:202 testes Golf em47arquivos passaram;7testes de superficie repetidos apos ajuste final de tampa. Quatro E2E exterior/controle desktop/mobile finais passaram em2,3min, com movimento/pixels/portas/vidros/capo/tampa/luzes; capturas traseira/perfil/tampa aberta revisadas. TypeScript/lint/build finais aprovados, apenas aviso antigo de chunk grande; JSON/diff-check aprovados. Sem pesquisa externa, geracao paga ou dependencias.
- Limites visuais restantes: faixa clara no canto inferior do para-choque/lateral, irregularidades nos reflexos da chapa, proporcoes/opticas ainda nao identicas a foto. Frente, teto e demais itens da auditoria NAO resolvidos nesta rodada. Interior permanece adiado.

### Revisao geral do exterior (2026-09-11)
- Usuario rejeitou novamente mudancas pequenas e custo acumulado. Prioridade e resultado visual global, nao quantidade de testes ou detalhes internos. Sem nova pesquisa externa, dependencia ou geracao paga nesta rodada.
- Reformados teto/queda traseira, vidros laterais e recorte da porta traseira/coluna C, cintura e soleiras. Pneu deixou de ser toro que ocultava o aro: perfil anular preserva raio317,15mm e abre raio214mm. Pintura prata; reflexos locais RoomEnvironment, sem HDR externo. Farol mais alto acompanha para-lama acima780mm, refletores/grade/emblema/entradas maiores; lanternas vermelhas tesselladas sobre tampa; spoiler ampliado, tampa de combustivel circular, dobradicas recuadas.
- Laterais deixaram de sobrepor para-choques; retorno frontal agora considera frontCornerSweep. Tessellacao lateral adaptada a arestas de45mm para reduzir reflexos triangulados. Sombra de contato experimental retirada por enquadramento incorreto.
- Final199 testes Golf em46arquivos, lint/TypeScript/build aprovados (aviso antigo de chunk grande). Seis E2E exterior/controle/freios desktop/mobile passaram antes do ultimo ajuste de tessellacao/encaixe/iluminacao; exterior desktop/mobile repetido apos esse ajuste, ambos passaram. Capturas finais frente/perfil/traseira revisadas, pixels/orbita/movimento verificados.
- NAO e replica identica: proporcoes da frente/cabine, encontros traseiros, acabamento das chapas e identidade visual ainda insuficientes. Nao afirmar pedido de fidelidade integral concluido. Interior continua adiado.

### Retrovisores e rodas (2026-09-11, rodada seguinte)
- GolfDoorMirror substitui blocos por carcasas curvas fechadas, parte inferior preta, moldura e vidro separado. Permanece na dobradica original; sem reflexo em tempo real, regulagem ou rebatimento.
- GolfRimFace substitui cinco barras por dez raios curvos afunilados, miolo, cinco fixadores e emblema. Preserva pneu, aro externo, centros, freios e grupo removivel/rotativo. Referencia visual Sportline TDI, nao prova de roda OE do FSI; dimensoes estimadas.
- Validacao desta rodada:196 testes Golf em45arquivos; TypeScript/lint/build/diff-check aprovados, aviso existente de chunk grande. Seis E2E exterior/controle/freios desktop/mobile --headed aprovados. Capturas frente/perfil/portas abertas revisadas; pixels, movimento, dez raios, parentesco/rotacao das rodas e matrizes dos retrovisores verificados. Outras suites E2E nao reexecutadas.
- Exterior continua incompleto. Proxima prioridade: frente/conjuntos opticos e transicao para-brisa/teto. Forro do teto, colunas internas e acabamento inferior do painel continuam adiados.

### Entrega de montagem ampliada, 2026-09-09

#### Continuacao em 2026-09-11: exterior comparado com referencias reais

- Reabertas as duas fotos ja listadas em bodyVisualSources: frente do Golf V Sportline TDI cinco portas e traseira do Comfortline2.0FSI. Usadas para comparar forma/divisao dos paineis, NAO para confirmar acabamento/PR do exemplar, escala ou cotas OE. Capturas anteriores e posteriores do modelo em frente/perfil/traseira revisadas; nao houve alinhamento fotogrametrico nem referencia lateral ortogonal. Imagens consultadas no navegador, nao incorporadas ao app.
- Corrigida a terceira janela lateral grande e fixa na carroceria: agora e um vidro pequeno fixo NA PORTA TRASEIRA, com moldura/vedacao e vao proprios. Porta traseira envolve esse vidro e termina sobre o arco da roda; vidros eletricos continuam quatro, com curso440mm. Janela dianteira mais curva, linha do teto termina emZ2770/Y1390 em vez de2860/1410; para-brisa e entre-eixos2578 preservados. Contornos/dimensoes estimados. Descricoes antigas de quarto lateral fixo na carroceria ficam superadas.
- Farois com ombro externo alto e ponta interna descendente; refletor/feixe alto reposicionados juntos, seta em faixa inferior. Capo afunila entre os farois: fracao transversal0,43 na frente a0,83 no corta-vento, folga continua e para-lamas fixos. Reforcos ajustados e ponto de apoio da vareta passaX-630 para-400 dentro do novo painel; base/eixo do capo e intertravamentos preservados. Nao e medicao de fabrica nem optica homologada.
- Laterais ganham volume na cintura e recolhimento inferior, preservando marcos dos arcos/rodas. Faixa plastica inferior usa grupos de material na propria malha dos para-choques. Placa traseira transferida da tampa para o para-choque fixo. Vidro traseiro ampliado com borda compartilhada entre tampa, partes fixas e ajuste das lanternas. Tampa/struts continuam articulados; sem solucao de colisao ou contato real.
- Validacao final:194 testes Golf em43arquivos, lint/build/diff-check aprovados; aviso existente de chunk grande. Seis E2E exterior/controle/cockpit desktop/mobile --headed aprovados em1,2min, capturas frente/perfil/traseira/capo/portas/vidros revisadas. Novas verificacoes medem largura real do capo, matriz do vidro pequeno acompanhando porta mas nao vidro eletrico, placa fixa ao abrir tampa; folga das lanternas, vareta, luzes, pixels e movimento preservados. Demais suites E2E nao reexecutadas.
- Resultado parcial: divisao das janelas e traseira mais coerentes, mas frente/para-brisa/volumes ainda simplificados, retrovisores blocados, aros pouco representativos e acabamento dos conjuntos opticos insuficiente. NAO declarar identidade Golf aprovada ou carro completo. Proxima rodada continua EXTERIOR, com formas da frente/para-brisa e elementos grandes de identidade; teto/colunas/acabamento inferior INTERNO permanecem adiados. Sem novas dependencias, geracao paga ou commits.

#### Continuacao em 2026-09-10: bancos, forros e piso interno

- GolfSeatPad/golfUpholsteryGeometry substituem almofadas retangulares e material metalizado por volumes fechados de tecido, com contorno arredondado, leve afunilamento e centro rebaixado. Assentos, encostos e apoios de cabeca dos cinco lugares preservam os pontos anteriores; bancos dianteiros recebem laterais, linhas de costura e detalhe de bolsa traseira. Nao ha ajuste, rebatimento, deformacao ou homologacao ergonomica.
- Quatro forros recebem inserto de tecido e faixa superior seguindo a superficie da porta, abaixo dos vidros. Grades de alto-falante sao visuais, sem audio. Bolsos agora tem fundo e paredes separados, abertos por cima; bracos, macanetas e interruptores existentes preservados no mesmo grupo articulado. Teste mede120mm desde ponto80mm acima do centro ate fundo, nao profundidade util homologada.
- Carpete prolongado ate o banco traseiro, tapetes traseiros, revestimento do tunel, canais laterais e soleiras adicionados sem mover estrutura ou chicotes. Cobertura das soleiras ajustada ao topo das pecas estruturais existentes; ainda ha fiacao e trechos estruturais expostos sob o painel e mecanismo no corta-vento. Acabamento nao equivale a correcao estrutural/OE.
- Validacao:193 testes Golf em43arquivos, lint/build e4E2E carroceria/cockpit desktop/mobile aprovados (ultima rodada57,1s). Seis regressoes EGAS/combustivel/limpadores passaram; duas de freios passaram apos corrigir a preparacao do teste para aguardar AMBOS os circuitos zerarem antes do lancamento. Fisica e tolerancia30km/h nao alteradas. Total12 E2E aprovados entre execucoes; demais suites nao reexecutadas. Capturas desktop/mobile, portas abertas e interior revisadas; matrizes dos forros acompanham dobradicas e nao descem com vidros; bolsos testados por raycast.
- Sem nova pesquisa, cotas de fabrica, dependencias ou geracao paga. Forma ainda estimada e identidade Golf incompleta. Proximo lote sugerido: forro do teto/colunas e acabamento inferior do painel, preservando visibilidade e acesso aos comandos existentes.

#### Continuacao em 2026-09-10: painel, volante e vista interna

- GolfDashboard substitui os blocos antigos por uma superficie fechada que vai ate o corta-vento, com capela, saidas de ar, fascia central, porta-luvas e acabamentos. GolfSteeringWheel preserva o eixo anterior e acrescenta aro, tres raios e cubo; nao simula esterco ou buzina. Todas as dimensoes e formas sao estimadas, sem nova comparacao fotografica ou cotas VW.
- GolfCentreConsole adiciona coifa/alavanca, freio de estacionamento, porta-copos, bandeja e apoio de braco. Carpete, tapetes, soleiras e revestimento dos pes ampliados; pedais existentes preservados. Radio, climatizacao, porta-luvas, cambio e freio de estacionamento sao acabamentos estaticos, nao novos comandos funcionais.
- GolfCockpitInstruments usa sampleGolf(clock).rpm e a temperatura compartilhada pelo arrefecimento. Chave/main desligados estacionam os ponteiros; ECU aberta zera RPM sem cortar automaticamente o indicador termico. Escalas e alerta115C genericos, nao quadro/calibracao/rede Volkswagen. Indicador de combustivel e comando de limpadores existentes reutilizados sem duplicacao; nao foi adicionado velocimetro ficticio.
- Vista do carro > Interior mostra o painel com orbita/reset. FOV calculado pelos limites reais do volante e proporcao do canvas, com margem8%; retorno para exterior ou inspecoes restaura42graus. Testes de navegador verificam os oito cantos do envelope, pixels, movimento do motor, RPM, chave e transicoes por combustivel/limpadores em desktop e celular.
- Validacao:191 testes Golf em41arquivos, lint e build aprovados, aviso antigo de bundle grande. Dois novos E2E de cockpit e oito regressoes de carroceria/controle/combustivel/limpadores aprovados. Capturas internas desktop/mobile revisadas; corte do volante no celular detectado visualmente e corrigido com teste de limites. Demais suites E2E nao reexecutadas.
- Ainda ha estrutura/fiacao expostas junto ao assoalho e mecanismo visivel no corta-vento; cabine nao e reproducao de fabrica. Proximo lote sugerido: bancos, forros internos das portas e continuidade do acabamento do assoalho, preservando pedais e mecanismos. Sem dependencias, pesquisa/geracao paga ou commits.

#### Continuacao em 2026-09-10: contornos da cabine e acabamento das portas

- golfCabinContours arredonda cantos com curvas quadraticas amostradas, compartilhadas por vaos, vidros e vedacoes. Linha superior dos vidros revisada; tres vidros por lado continuam com quarto fixo. Vaos das portas arredondados mantendo contencao, rodas, dobradicas e curso440mm. Formas e afastamentos estimados, sem novas cotas VW ou comparacao fotografica.
- Coluna B recebe acabamento preto dividido entre pilar fixo e duas portas, sem faixa rigida atravessando juntas. Molduras de janela vazadas, frisos laterais separados por porta e vedações continuas em uma malha por percurso acompanham as superficies. Eixos e ferragens das dobradicas permanecem anteriores; nao ha correcao estrutural de fabrica.
- Perimetro de cada porta tem retorno interno28mm, seguindo o mesmo contorno externo; nao e porta totalmente fechada/manifold nem estamparia OE. Vidros continuam com translacao vertical idealizada e recorte na cintura, sem trilhos/regulador/antipincamento ou contato/colisoes.
- Validacao final:186 testes Golf em39arquivos, lint/build e diff-check aprovados; aviso antigo de bundle grande. Quatro E2E carroceria externa/controle integrado desktop/mobile --headed aprovados em47,7s. Adicionada verificacao e captura dos quatro vidros apos1s de descida (176mm), alem do curso completo. Capturas perfil/frente, portas abertas e vidros parciais/baixados revisadas; enquadramento, pixels, movimento, luzes e intertravamentos preservados. Demais E2E nao reexecutados.
- A faixa dos vidros ficou mais continua e as portas ganharam borda/acabamento; silhueta ainda simplificada, Golf V fiel/completo NAO aprovado. Proximo conjunto sugerido: interior visivel pelas portas, painel/volante/acabamentos usando os comandos ja existentes; nao reiniciar sistemas mecanicos ou pesquisa ampla. Sem dependencias, geracao paga ou commits.

#### Continuacao em 2026-09-10: frente integrada e cantos arredondados

- golfFrontFit interpola os triangulos reais do para-choque para assentar carcasas, lentes, refletores, grades superior/inferior, placa e nichos dos neblinas. Resolve recortes antes enterrados na pele. Grades e nichos sao apliques escuros ajustados, NAO aberturas vazadas/ductos de ar; folgas7..18mm e formas estimadas.
- Farois tem contorno novo, refletores concavos de6mm de relevo, lentes centrais separadas e cobertura transparente. Feixes baixo/alto e pontos de conexao do chicote acompanham a nova posicao. Logica eletrica preservada; nao e optica fisica nem fotometria homologada.
- frontCornerSweep recua cantos dianteiros ate160mm de forma monotona entreZ-875 e-500, aplicado conjuntamente a laterais e borda do capo. frontNoseBridge fecha o encontro da pele do para-choque emY780 com o bordo do capo. Rodas, arcos, portas e dobradicas preservados; nenhuma cota VW ou nova comparacao fotografica. Capo abre com vareta e para-lamas fixos.
- Validacao final:183 testes Golf em39arquivos, lint/build e git diff --check aprovados; aviso preexistente de bundle grande. Quatro E2E carroceria externa/controle integrado desktop/mobile --headed aprovados em49,4s. Capturas frente, perfil, capo aberto e farois noturnos revisadas; enquadramento, pixels, movimentos, intertravamentos e falhas eletricas verificados. Demais E2E nao reexecutados.
- Frente visivelmente menos reta e conjuntos inferiores expostos, mas identidade Golf V continua incompleta. Proximo conjunto: cabine, colunas e recortes laterais/coerencia das portas, mantendo mecanismos. Nao declarar carro completo ou fidelidade de fabrica. Sem dependencias novas, pesquisa paga ou commits.

#### Continuacao em 2026-09-10: proporcoes coordenadas

- Base do para-brisa avancada de Z390 para210 e encontro superior de840 para760; comprimento longitudinal do capo reduzido de1265 para1085mm. Teto prolongado ateZ2860, com traseira mais vertical e vidros/vaos laterais revistos juntos. Rodas e entre-eixos preservados. Sao estimativas visuais do modelo, NAO cotas Volkswagen; nenhuma comparacao nova com fotos foi realizada nesta rodada.
- Perfil extraido para golfBodyProfile, sem dependencia do motor, evitando ciclo de imports. Capo, tampa, reforcos, dobradicas e detalhes moveis usam os novos encontros; limpadores usam base e inclinacao derivadas do para-brisa, preservando elos rigidos. Nao simula contato das palhetas com vidro curvo nem colisoes dos paineis.
- Tampa abre agora -1,5rad e sua borda inferior central fica acima de1800mm no modelo; amortecedores acompanham todo o curso. Capo e vareta preservam intertravamento. Nao sao amplitudes ou alturas certificadas de fabrica.
- Validacao:179 testes Golf em38arquivos e teste final das13verificacoes de articulacao aprovados; lint/build aprovados com aviso antigo de bundle grande. Quatro E2E carroceria externa/controle desktop/mobile --headed aprovados na execucao final50,5s. Capturas frente/perfil/traseira, portas, capo, tampa e luzes revisadas; pixels, enquadramento e movimento verificados. Demais suites E2E nao reexecutadas.
- Perfil mostra cabine avancada e capo mais curto, mas frente/opticas e acabamento ainda simplificados: identidade Golf nao aprovada. Proxima prioridade: forma conjunta dos farois, grade e nariz da frente a partir das referencias existentes, sem substituir isso por mais testes ou pesquisa ampla.

#### Continuacao em 2026-09-10: superficies da cabine e para-choques

- golfBumperGeometry substitui tres faixas independentes por uma malha continua com perfil vertical interpolado e contorno curvo. Preserva extremos do perfil anterior e encontros laterais em Z-620/3130; normais compartilhadas reduzem quinas. Dois testes cobrem simetria, normais e juncoes. Dimensoes e forma estimadas, sem referencia dimensional nova.
- golfCabinSurface acrescenta coroa transversal variavel ao teto (ate30mm adicionais) e abaulamento longitudinal ao para-brisa (ate22mm), preservando bordas junto as portas e encontros com capo/teto/tampa. GolfBodyShell separa vidro, moldura pintada e vedacoes do para-brisa. Dois testes cobrem simetria, bordas e extremos. Nao recalculado contato dos limpadores com o vidro abaulado; limite existente permanece.
- Validacao apos retomada de erro do Autopilot:179 testes Golf em38arquivos, TypeScript/lint/build aprovados, aviso antigo de bundle grande. Quatro E2E carroceria externa e controle integrado desktop/mobile --headed passaram em6,1min; nao repetidos apos a retomada. Capturas frente/perfil/traseira revisadas, funcoes e pixels verificados pelos ensaios. Demais suites E2E nao executadas nesta rodada.
- Revisao visual NAO aprovou fidelidade Golf: perfil ainda mostra capo aparentemente longo, cabine angular e transicoes/lentes da frente simplificadas. Teto mais curvo e para-choques menos facetados nao resolvem proporcoes gerais. Proximo trabalho deve comparar proporcoes e encaixes com fotos existentes, nao continuar suavizacoes isoladas como substituto de identidade. Sem novas dependencias, pesquisa paga ou commits.

#### Continuacao em 2026-09-10: encaixe dos paineis e conjuntos opticos

- golfBodyFit usa o mesmo perfil BODY_TOP e largura da pele para assentar cada vertice das lanternas traseiras, com lente6mm a frente da pele. Partes internas permanecem na tampa articulada; externas ficam na carroceria. Emblema, macaneta, placa e limpador traseiro reposicionados pela superficie, reduzindo pecas salientes quando aberta. Geometria e folgas estimadas, nao medidas OE.
- Capo central separado dos ombros fixos dos para-lamas, com folga lateral aproximada3,2mm. Borda dianteira curva e coroa suave; pontos laterais de referencia, rodas, portas e dobradica preservados. Reforcos e vareta continuam no conjunto; nao e solver de contato/cargas. Friso sobreposto removido para evitar interferencia na folga, que ainda pode serrilhar em baixa resolucao.
- Farois dianteiros passam de contorno triangular/inclinacao0,72rad para contorno arredondado/inclinacao0,28rad e assentamento mais baixo. Dupla optica e funcionamento eletrico preservados. Ainda nao representa lente, reflexao ou perfil dimensional de fabrica.
- Validacao:175 testes Golf em36arquivos, TypeScript/lint/build aprovados, aviso preexistente de bundle grande. Dois E2E integrados desktop/mobile --headed passaram; raycast nas malhas reais confirma folga das lanternas antes/depois da abertura e matrizes confirmam para-lamas fixos com capo movel. Funcoes de portas/vidros/travas/luzes/falhas preservadas; capturas revisadas. Ultima execucao3,8min com variacao de desempenho no desktop. Nao reexecutados todos os E2E do projeto.
- Identidade externa ainda incompleta: silhueta geral angular, transicoes da frente/cabine/para-choques e acabamento precisam revisao. Este lote corrige encaixe e particionamento; nao afirmar Golf fiel ou carro completo. Sem pesquisa externa nova, dependencias, geracao paga ou commits.

#### Continuacao em 2026-09-10: carroceria funcional integrada

- GolfBodyControl compartilha estado de quatro portas/vidros, trava central, capo/liberacao/vareta, tampa traseira, luzes, setas e falhas. O Driver existente avanca em delta real, respeitando pausa, sem relogio concorrente. Painel Carroceria inclui passo explicito de1s que nao avanca motor; mudancas de vista/chave preservam mecanismos.
- GolfDoors substitui laterais e interiores estaticos por quatro paineis com vaos reais, dobradicas, fechos, macanetas, comandos internos e retrovisores nas portas dianteiras. Vidros descem ate440mm, recortados na cintura para nao aparecer sob as portas; vidros de quarto traseiros permanecem fixos. Abrir bloqueado por trava; trancar exige portas fechadas. Vidros dependem de chave/alimentacao/conforto.
- GolfBodyShell articula capo no eixoX traseiro e tampa no eixoX superior. Capo exige liberacao; vareta pode ser armada apos80% de abertura e impede fechamento ate recolhida. Apoio manual idealizado antes da vareta, sem gravidade/cargas. Tampa tem dois amortecedores telescopicos com extremidades acompanhando articulacao. Prateleira removida para acesso ao piso/laterais do porta-malas; nao ha manipulacao de bagagem.
- Iluminacao por controlador didatico de carroceria, NAO pela ECU do motor: posicao, baixo/alto, neblina, setas/alerta, freio usando o mesmo pedal hidraulico, cabine e carga. Farois projetam luz no chao; vista noturna inclui trecho iluminado. Intensidades/feixes ilustrativos em escala milimetrica, nao fotometria homologada. Fontes apagadas ficam invisiveis ao renderizador.
- GolfBodyWiring mostra41rotas funcionais: bateria/fusiveis/controlador, alimentacao/retorno, portas/comandos/retornos de estado, luzes e tampa. Fusivel principal existente corta corpo; falhas proprias de iluminacao/conforto e farol esquerdo aberto. Correntes estimadas por cargas nominais, sem solver eletrico, resistencia de fios, pinagem VW, CAN/LIN, modulos OE ou rede de fabrica completa.
- Limites: forma externa continua aproximada/angular; ajustes de lentes/frisos/tampa, folgas e encaixes ainda necessitam refinamento visual. Sem colisao de paineis, antiesmagamento, sensor de obstaculo, modo um-toque real, trava infantil/alarme, gravitacao ou cinetica de motores/fechos. Limpador traseiro estatico e drivetrain sem engate/torque funcional preservados. Nao equivale a carro completo.
- Validacao final:172 testes Golf em35arquivos, TypeScript/lint/build aprovados com aviso preexistente de bundle grande. Fluxo integrado em e2e/golf-body-control.spec.ts passou desktop/mobile com Chromium --headed (ultima rodada1,2min), incluindo movimentos reais, vidros/fusivel, travas, vareta, tampa/amortecedores, farois/falhas/alerta/freio, pausa/retorno e pixels claros ligado/desligado. Capturas revisadas. Headless teve timeouts de renderizacao; nao afirmar desempenho resolvido em todos os ambientes. Nao reexecutada toda suite E2E de outros sistemas nesta rodada. Sem novas dependencias, geracao paga ou commits.

#### Continuacao em 2026-09-10: correcao da base visual da carroceria

- GolfBodyShell/GolfVehicle substituem laterais planas por pele triangulada com cintura curva e cabine afunilada (837mm na cintura,710mm no teto, estimados). BODY_TOP em golfVehicleGeometry compartilha perfil interpolado de capo/para-brisa/teto/vidro traseiro/tampa com as laterais; extremos fixados explicitamente para eliminar diferenca numerica entre paineis. Arcos e marcos dimensionais existentes preservados pela transicao archBlend; entre-eixos2578mm e rodas nao movidos.
- GolfBodyDetails substitui farois/lanternas/para-choques em blocos: contornos de farois com dois refletores, grade horizontal, emblemas, entradas inferiores, para-choques com retornos laterais, lanternas com elementos circulares, contorno da tampa e limpador traseiro ESTATICO. Frisos, macanetas e contornos dos vidros reposicionados na pele. Nao ha iluminacao funcional, articulacao de portas ou confirmacao de acabamento OE.
- Referencias visuais consultadas e vistas no navegador: [frente Golf V Sportline2.0TDI cinco portas](https://en.wikipedia.org/wiki/File:2007_Volkswagen_Golf_(1K_MY07)_Sportline_2.0_TDI_5-door_hatchback_(2010-07-05).jpg) e [traseira Comfortline2.0FSI cinco portas](https://en.wikipedia.org/wiki/File:2005_Volkswagen_Golf_(1K)_Comfortline_2.0_FSI_5-door_hatchback_(2015-07-09)_02.jpg), via artigo Volkswagen Golf Mk5. Fotos apenas referencia de forma, nao escala, cotas ou prova do acabamento do AXW escolhido. Capturas de referencia em TEMP, sem incorporar fotos de terceiros no aplicativo.
- Modo inicial da vista vehicle agora Carro/solid, antes Fantasma; engine continua Corte. Vista externa permite Frente/Perfil/Traseira com camera mais baixa e enquadramento dos limites existentes; Montagem e Corte continuam disponiveis. Armacoes genericas de CabinFrame ocultas somente em solid para nao atravessar pele/vidro; nao foram recalculadas como estrutura de fabrica. Transparencia dos vidros ajustada, sem certificar contato de palhetas: mecanismo e plano didatico dos limpadores preservados, nao recalculados para a nova superficie.
- Limites: modelo procedural ainda simplificado e angular, sem CAD ou digitalizacao. Proporcoes locais, curvaturas, transicoes de para-choques, lentes, vãos e detalhes ainda precisam refinamento visual. Nao declarar Golf fiel/concluido nem usar sucesso dos testes como prova de identidade. Portas permanecem fechadas, sem dobradicas/fechos/abertura.
- Validacao:149 testes Golf em32arquivos aprovados; TypeScript/lint/build aprovados, aviso preexistente de bundle grande. Oito E2E carroceria/montagem/combustivel/limpadores desktop/mobile passaram juntos (7,5min). Capturas frente/perfil/traseira revisadas, canvas nao vazio, limites de camera, orbita/reset, modos e movimento verificados. Teste mobile precisa centralizar canvas depois de Rodar motor, pois a cena suspende fora da tela. Nao foram reexecutados todos os E2E de todos os sistemas. Sem dependencias novas, geracao paga ou commits.

#### Continuacao em 2026-09-10: nivel de combustivel conectado ao instrumento

- golfFuelSender: resistencia linear estimada280ohm vazio/40ohm cheio, divisor5V/220ohm, decodificacao exclusivamente pela tensao e ponteiro com filtro exponencial0,8s. Reserva liga<=12% e desliga>=15% da leitura filtrada. Nao sao curva, limiares ou estrategia de instrumento VW confirmados. Sem litros calibrados.
- GolfClock.fuel continua fonte unica do nivel fisico e consumo existente. fuelSender guarda leitura/falhas separadas; Driver usa delta real e pausa global. Troca de operacao/vista preserva ambos. Alimentacao por chave/principal/fusivel proprio do instrumento, independente dos fusiveis ECU/bomba no modelo. Avancar leitura1s nao avanca virabrequim, arrefecimento ou limpadores; Reiniciar sensor limpa falhas/leitura sem reabastecer.
- Falhas sinal aberto, retorno aberto e curto ao terra produzem tensao invalida, alerta dedicado e ponteiro tendendo a vazio, sem acender reserva. Boia travada conserva posicao/resistencia plausivel quando nivel muda: nao dispara diagnostico eletrico artificial. Falhas de sensor ou fusivel proprio nao desligam bomba. Indicadores dos fios mostram falhas injetadas, nao um diagnostico VW real.
- GolfFuelTank extraido do tanque existente em GolfSystems: mesmo liquido e modulo de bomba, sem duplicacao. Braco rigido160mm em pivo[-250,455,2150], angulo por arcsin para acompanhar superficie325..585mm no lobo esquerdo. Placa,11 segmentos resistivos, cursor e conector separados; pista/cursor na face visivel. Forma bilobada preexistente generica, escala e suporte estimados, nao topologia de tanque FWD verificada. Sem inclinacao, oscilacao, empuxo ou mapa volumetrico.
- GolfFuelSenderHarness tem quatro trajetos funcionais de sinal/retorno/alimentacao/terra, nao pinagem VW ou arquitetura de modulos confirmada. GolfFuelGauge reutilizado no painel existente e na inspecao, com mostrador texturizado, ponteiro movel, reserva e alerta separados. Nao reproduz painel OE. Combustivel abre Circuito completo, Tanque, Boia e sensor, Instrumento, com cameras de aproximacao e mesmo estado.
- Validacao:145 testes Golf em31arquivos (12 novos), TypeScript/lint/build aprovados, aviso antigo de chunk grande. Dois E2E combustivel desktop/mobile passaram apos ajuste visual da pista; verificam extremos, boia real, sinal, filtro, falhas, fusivel, pausa, passo1s, chave, reserva, retorno, pixels, cameras, orbita e controles. Espera do ponteiro ao remontar ampliada5s->30s sem reduzir precisao. Dez regressoes limpadores/arrefecimento/EGAS/freios/carro passaram entre execucoes:7 na sequencia, freio mobile apos centralizar canvas e verificar alvo do clique, montagem2 em repeticao isolada com limite150s preservado. Timeouts de captura na sequencia longa permanecem risco de desempenho; nao afirmar resolucao geral. Capturas desktop/mobile revisadas e HTTP200 confirmado. Sem pesquisa paga, dependencias novas ou commits.

#### Continuacao em 2026-09-10: comando e mecanismo dos limpadores

- golfWipers: desligado, intermitente, baixa40/alta60 ciclos/min; intervalo de 4 s no repouso, desligamento pelo comando conclui o ciclo. Chave desligada, fusivel principal ou fusivel proprio cortam movimento imediatamente, preservando fase; religar permite retorno. Fusivel ECU nao alimenta esse acessorio no modelo. Falhas: motor sem continuidade, biela desacoplada e contato de repouso aberto (comando de estacionamento permanece ativo). Parametros e logica didaticos, nao estrategia Golf confirmada.
- GolfClock.wipers avancado pelo mesmo Driver em delta real, independente de RPM/reproducao lenta e respeitando pausa global. Troca de operacao/vista preserva modo, fase e falha. Avancar0,25s permite inspecao sem avancar motor ou arrefecimento. Limite60s por chamada e subpasso maximo0,01s; erro residual numerico no intervalo corrigido e coberto por teste.
- golfWiperGeometry resolve quatro barras por intersecao de circulos. Manivela60mm, biela250mm, balancins100mm e barra paralela680mm sao estimados; todos os comprimentos e juntas conservados durante360graus em testes. Palhetas sincronizadas por barra, repouso no extremo cinematico; plano orientado ao para-brisa existente e pontas dentro do envelope estimado. Nao representa tolerancias, flexao/contato curvo, atrito ou cinetica de motor real. Ao reparar biela no ensaio, o acoplamento e idealizado, sem procedimento mecanico de oficina.
- GolfWiperSystem substitui duas hastes estaticas de GolfExteriorDetails e comando direito estatico de GolfChassis. Alavanca clicavel percorre quatro modos; motor, juntas, suportes, eixos, bracos e palhetas compartilham estado no carro e inspecao. Seis rotas com indicadores representam alimentacao/comando/motor/repouso/terra/lavador, nao pinagem nem diagrama de modulos VW. Bloco controlador e generico, sem identidade de modulo OE.
- Limpadores abre Circuito completo, Comando da coluna e Motor/mecanismo. Aproximacoes ocultam os fios/pecas nao focados; vidro plano apenas referencial na inspecao. GolfWasherAssembly extraido de GolfAuxiliaries sem duplicar no carro; mesma bomba/reservatorio/linha aparecem no circuito. Comando de lavagem aciona sinal eletrico e deixa dois retornos ao repouso apos soltar, nao necessariamente dois ciclos completos se a liberacao ocorre no meio do primeiro.
- Sem agua/jatos, vazao/nivel, chuva, limpeza do vidro, rede CAN/LIN, corrente/resistencia, motor bloqueado/protecao termica, contato VW real, parque alternado, limpador traseiro ou intertravamentos de capo. Corpo e aplicacao exata continuam estimados. Altura minima mobile agora820px para barra ampliada, canvas minimo280px e painel rolavel; comandos testados por elementFromPoint.
- Validacao: 133 testes Golf em28arquivos, TypeScript, lint e build aprovados (aviso existente chunk>500kB). Dois E2E limpadores desktop/mobile passaram, com clique3D, juntas reais, velocidades, pausa, falhas, lavagem/repouso, pixels/capturas, cameras e retorno. Nove das dez regressoes auxiliares/arrefecimento/EGAS/freios/carro passaram juntas. Montagem mobile expirou em captura/inicializacao em repeticoes; espera inicial alinhada de5s para30s como outros testes3D e poll passou a listar objetos invisiveis. Limite total150s preservado; rodada mobile final passou em2min. Nao afirmar que toda lentidao foi resolvida. Sem novas dependencias, pesquisa paga ou commits.

#### Continuacao em 2026-09-10: arrefecimento funcional

- golfCooling implementa balanco energetico de dois volumes (motor e radiador): geracao de calor por RPM/carga, troca por vazao, perdas para ambiente/ar frontal/ventoinha e aquecedor. Capacidades 85/18 kJ/K, ambiente 20 C, termostato linear 85..98 C, ventoinha liga 102/desliga 95 C e alerta 115 C sao parametros genericos estimados, NAO calibracao Volkswagen. Integracao em subpassos de ate 0,1 s, limitada a 600 s por chamada; teste conserva energia acumulada.
- GolfClock.cooling e temperature compartilham o estado com ECT/motor. Driver usa delta real termico, independente da reproducao lenta do virabrequim, respeita pausa. Mudar operacao/chave preserva calor e falhas. Avancar 60 s termicos faz ensaio explicito com RPM/carga atuais sem avancar angulo mecanico; frio/quente reiniciam apenas ensaio termico. Corte de combustivel elimina calor de combustao; bomba segue RPM, ventoinha depende da alimentacao ECU neste modelo.
- Doze rotas fecham bomba/bloco/cabecote, desvio, radiador e aquecedor; expansao/desgaseificacao permanecem conexoes estaticas. Indicadores se movem conforme vazao, sem representar particulas reais. Circuitos internos dourados sao esquematicos e ocultos na montagem normal, nao galerias de fabrica. Geometrias e roteamento estimados. GolfAuxiliaries reutilizado sem duplicar as pecas do carro; rotor da bomba, valvula e ventoinha seguem estado termico em vez da antiga regra >85 C.
- Arrefecimento abre Circuito completo, Termostato, Bomba e Radiador/ventoinha. Painel oferece bomba sem circulacao, termostato aberto/fechado, motor da ventoinha aberto, fusivel, aquecedor e ar frontal equivalente independente. Pausa, falhas, retorno ao carro e operacao usam o mesmo estado.
- Limites: nao simula pressao, ebulicao, nivel/vazamento de liquido, cavitacao, CFD, correia/acionamento real da bomba, sensor ECT com falha, ECU VW, segundo estagio/segunda ventoinha, pos-chave ou demanda AC. Temperatura nao limita automaticamente torque nem representa dano. Dimensoes/abertura de valvula/giro do rotor sao ilustrativos, nao desenho OE.
- Validacao: 121 testes Golf em 25 arquivos, TypeScript, lint e build aprovados; aviso existente de chunk >500 kB. Dois E2E termicos e oito regressoes auxiliares/EGAS/freios/carro aprovados desktop/mobile. Capturas de circuito e aproximacoes revisadas; pixels, movimento, enquadramento, orbita, pausa, chave, falhas, ensaio60s e acesso ao slider verificados. Sem dependencias, geracoes pagas ou pesquisa externa.

#### Continuacao em 2026-09-10: acelerador eletronico, pedal e TBI

- golfEgas implementa estado manual opcional, duas pistas do pedal, plausibilidade, dois retornos de posicao e comando da borboleta. Parametros didaticos: referencia 5 V, pista 1 de 0,5 a 4,5 V, pista 2 metade da primeira, retornos complementares somando 5 V, abertura de repouso 6%, maxima 94% e resposta exponencial de 180 ms. Nao sao curvas, estrategia de emergencia ou pinagem confirmadas da MED9.5.10.
- GolfEgasParts reutiliza a TBI antes contida em GolfSystems: mesmo corpo, local e borboleta, agora em GolfThrottleBody. Pedal interno articulado/clicavel substitui o acelerador estatico. ECU extraida sem duplicar a anterior. golfEgasGeometry define tres conectores e 12 trajetos didaticos (pedal/referencia/terra e motor/retornos da TBI). Indicadores mostram alimentacao e falha no trecho correspondente; nao simulam corrente/resistencia nem cada contato do conector VW.
- O unico Driver existente atualiza EGAS em delta real quando habilitado, respeitando pausa. Chave e fusiveis principal/ECU retiram alimentacao. Falhas selecionaveis: pista 2 do pedal, referencia, fio do motor e retorno 2 da TBI. O modelo remove comando e converge ao repouso estimado; nao representa mola, inercia, diagnostico latched ou estrategia de emergencia VW completa.
- Acelerador abre vistas Circuito, Pedal interno e Corpo de borboleta. Slider e clique 3D usam o mesmo estado; painel mostra sinais, abertura comandada/real e falhas. Retorno a montagem e mudanca de operacao preservam controle manual. Restaurar modo predefinido recupera os presets anteriores. Modo manual usa admissao homogenea didatica; comparacao explicita homogeneo/estratificado continua independente. MAP responde a abertura; RPM permanece no preset, sem torque ou dinamica de aceleracao inventados.
- Celular: altura minima da cena 740 px e canvas 280 px para acomodar barra ampliada, com inspector rolavel. Grade principal limitada a largura disponivel e cinco modos em colunas iguais para evitar recorte lateral. Teste confere limites internos e elementFromPoint no slider apos rolagem, sem obstrucao pelo rodape fixo da aula; captura dedicada das leituras adicionada. Nao foram refeitos carroceria/chassi nem outras aulas.
- Retomada apos interrupcao: teste golf-vehicle passou a medir movimento com inspectGolf(false), mantendo leitura de pixels separada e verificacoes de enquadramento/visibilidade; falhas agora listam objetos invisiveis. Houve timeouts intermitentes no ambiente, inclusive em transicoes de vista. Rodadas diretas finais de montagem desktop e mobile passaram com os mesmos limites; nao se afirma que toda lentidao de renderizacao foi resolvida.
- Validacao final: 110 testes Golf em 23 arquivos, TypeScript e lint aprovados; build aprovado com aviso existente de chunk >500 kB. Quatro E2E acelerador + freios aprovados juntos; dois E2E de montagem aprovados em rodadas diretas separadas. Cobertura inclui clique no pedal, abertura 3D, sinais, quatro falhas, chave/fusivel, pausa, retorno, cameras e pixels desktop/mobile. Servidor local preservado em 127.0.0.1:5173.

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

### 2026-09-11 - Reconstrucao coordenada do quarto traseiro
- Secao traseira comum, recorte lateral/porta, tampa/lanternas curvas, rebaixo de placa e acabamentos da tampa implementados e comparados com foto traseira FSI existente. Sem alegacao de replica fiel ou conclusao dos46itens.
- Proximo: resolver acabamento da quina inferior e reflexos da chapa; depois frente/capô/para-lamas/conjuntos opticos em conjunto. Nao voltar a pequenos detalhes internos nem usar testes como aprovacao visual.

### 2026-09-11 - Retrovisores curvos e rodas de dez raios
- Implementados GolfDoorMirror/golfMirrorGeometry e GolfRimFace/golfRimGeometry, sem alterar mecanismos existentes. Testes de malha/simetria/folga dos espelhos e raios/vaos/envelope das rodas, mais regressao de portas e freios:196 unitarios e6E2E aprovados, lint/build aprovados.
- Capturas desktop/mobile revisadas. Formas estimadas orientadas pela foto existente, sem selecao OE ou aprovacao de fidelidade. Proxima rodada permanece no exterior: frente, opticas e para-brisa/teto; nao retomar ainda os tres acabamentos internos adiados.

### 2026-09-11: correcao da divisao lateral e forma exterior

- Comparadas duas fotos reais ja registradas; vidro pequeno agora fixo na porta traseira, teto/contornos revistos, vidro traseiro ampliado. Capo afunilado, farois redesenhados, laterais com volume, para-choques bicolores e placa traseira fixa. Mecanismos preservados; secao2 detalha estimativas e limites.
- 194 testes Golf, lint/build/diff-check e6E2E desktop/mobile aprovados; capturas revisadas. Ainda nao reproduz convincentemente todo o Golf. Continuar exterior (frente/para-brisa, retrovisores, rodas e conjuntos opticos), sem retomar acabamentos internos adiados nem interpretar testes como aprovacao visual.

### 2026-09-10: exterior volta a ser prioridade

- Usuario considera o exterior ainda muito longe de um Golf. Suspender a proxima rodada interna e registrar como pendentes: forro do teto, colunas internas, acabamento inferior do painel.
- Prioridade: comparacao visual coordenada e correcao da carroceria Golf V cinco portas, comecando por proporcoes/silhueta antes de acabamento fino. Preservar portas/vidros/capo/vareta/tampa/luzes e demais sistemas; nao reiniciar a montagem. Sem modelagem ou nova pesquisa nesta anotacao.

### 2026-09-10: estofados, forros moveis e assoalho

- Cinco lugares com estofado curvo e material de tecido, forros com inserto/faixa superior/grades e bolsos realmente abertos. Piso traseiro, tunel, canais e soleiras revestidos; estrutura/pedais/chicotes nao reposicionados. Nao ha audio nem ajuste/rebatimento dos bancos.
- 193 testes Golf, lint/build e12 E2E aprovados entre execucoes. Teste dos freios agora aguarda ambos os circuitos descarregarem; motor/fisica sem alteracao. Proximo: teto/colunas e acabamento inferior do painel; fiacao sob painel e fidelidade de fabrica permanecem pendentes.

### 2026-09-10: interior visivel e instrumentos integrados

- Painel/volante/console substituidos; conta-giros e temperatura leem o estado compartilhado, mantendo combustivel e limpadores existentes. Nova vista Interior com enquadramento responsivo e restauracao de FOV ao sair. Radio, climatizacao, cambio, freio de estacionamento e direcao permanecem estaticos.
- 191 testes Golf, lint/build, dois E2E de cockpit e oito regressoes desktop/mobile aprovados; capturas internas revisadas. Proximo: bancos, forros internos e assoalho, sem reiniciar mecanica. Formas estimadas, estrutura/fiacao ainda parcialmente expostas e fidelidade Golf nao certificada.

### 2026-09-10: cabine, colunas e portas

- Vaos e vidros com cantos arredondados, coluna B preta dividida, molduras vazadas e frisos moveis. Vedacoes continuas e retorno28mm nas bordas das portas; mecanismos anteriores preservados.
-186 testes Golf, lint/build/diff-check e4E2E desktop/mobile47,7s aprovados. Revisao incluiu vidros parcialmente baixados. Geometria estimada e identidade ainda incompleta; proximo interior visivel/painel/volante aproveitando comandos existentes.

### 2026-09-10: farois, grades e nariz dianteiro

- Assentamento dos detalhes sobre triangulos do para-choque elimina enterramento; refletores concavos e feixes/conexoes reposicionados. Cantos do capo e laterais recuados juntos, faixa continua fecha nariz. Grades/nichos ainda apliques, nao aberturas fisicas.
-183 testes Golf, lint/build e diff-check aprovados;4E2E desktop/mobile49,4s com capturas revisadas. Modelo ainda estimado; proximo foco cabine/colunas/recortes laterais sem reiniciar sistemas ou pesquisa ampla.

### 2026-09-10: proporcoes de capo, cabine e traseira

- Avancados para-brisa/vao dianteiro e prolongados teto/vidros traseiros; dobradicas e detalhes seguem perfil compartilhado. Limpadores reposicionados mantendo mecanismo rigido; tampa abre -1,5rad para borda central acima de1,8m estimados. Sem cotas OE ou nova comparacao fotografica.
-179 testes Golf aprovados,13 de articulacao repetidos apos ajuste final; lint/build aprovados com aviso antigo,4E2E finais desktop/mobile50,5s com capturas revisadas. Ainda nao e Golf fiel/completo; proximo foco e frente/grade/opticas, nao reiniciar montagem mecanica.

### 2026-09-10: cabine curva e para-choques continuos

- Concluida rodada iniciada antes do erro de requisicao do Autopilot; quatro testes de navegador ja haviam passado. Retomada revisou capturas, executou testes/compilacao finais e atualizou este registro sem repetir E2E. Ver secao2 para179 testes e limites.
- Proxima prioridade: correcao proporcional conjunta de frente/capo/cabine a partir das referencias visuais existentes, preservando mecanismos. As imagens atuais ainda nao sustentam afirmar que o modelo reproduz um Golf V. Evitar nova sequencia de detalhes pequenos sem corrigir essa discrepancia central.

### 2026-09-10: capô separado e lanternas assentadas

- Capo agora abre separado dos ombros dos para-lamas; lanternas internas, emblema e detalhes acompanham a pele da tampa em vez de posicoes independentes. Frente com contorno optico menos triangular. Detalhes/validacao na secao2.
- Proxima prioridade: melhorar silhueta e transicoes da carroceria/cabine e para-choques com referencias existentes, sem reiniciar mecanismos ou chamar o resultado atual de Golf completo. Preservar estado funcional e usar imagens reais como comparacao; nao inventar cotas de fabrica para justificar alteracoes.

### 2026-09-10: portas, vidros, capo, tampa e iluminacao

- Comandos integrados em Aula5 > Carroceria, preservando sistemas anteriores. Detalhamento e limites na secao2;172 testes Golf e2E2E integrados desktop/mobile aprovados. Dev server preservado em http://127.0.0.1:5173/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo.
- Proxima prioridade: refinar identidade externa e encaixe visual das pecas moveis com referencias existentes, especialmente frente/capo e tampa/lanternas, sem afirmar que este lote resolveu a semelhanca com Golf real. Nao reiniciar montagem ou reabrir pesquisa ampla. Profundidade funcional restante inclui antiesmagamento/fechos e drivetrain; nao tratar exemplos do usuario como lista exaustiva concluida.

### 2026-09-10: prioridade visual antes das portas

- Usuario questionou corretamente a falta de identidade Golf antes de continuar estrutura/lataria. Rodada desviada de articulacoes para correcao da pele externa e conjuntos opticos usando duas fotos identificadas, preservando sistemas. Descricao/limites na secao2.
- Abrir Aula5 agora mostra Carro; Vista externa oferece Frente/Perfil/Traseira. Nao tratar essa correcao como fidelidade final: ainda ha simplificacoes de proporcao e acabamento. A proxima acao deve validar essa base visual com o usuario e refinar as discrepancias restantes antes de adicionar dobradicas e portas, sem retomar automaticamente detalhes internos.

### 2026-09-10: boia, circuito e instrumento integrados e validados

- Concluido lote de combustivel: nivel -> boia/braco/cursor -> resistencia -> tensao -> leitura filtrada -> ponteiro/reserva, com falhas eletricas e mecanica separadas. Ver detalhes e limites na secao2; nao confundir sensor com bomba nem considerar curva VW confirmada.
- Montagem, freios, EGAS, arrefecimento e limpadores preservados. Servidor http://127.0.0.1:5173/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo ativo; botao Combustivel.
- Proximo lote sugerido: portas e paineis articulados na carroceria existente, com dobradicas, abertura e acesso ao interior. Ainda nao implementado; preservar referencia Golf e explicitar folgas/dimensoes estimadas. Nao reiniciar sistemas entregues nem reabrir pesquisa dimensional geral automaticamente.

### 2026-09-10: limpadores integrados e validados

- Concluido lote sugerido apos arrefecimento: comando da coluna -> controle eletrico didatico -> motor -> quatro barras -> dois bracos/palhetas, com estacionamento e falhas. Ver detalhes/limites na secao2.
- Proximo lote sugerido: boia/sensor de nivel -> sinal eletrico -> instrumento de combustivel, reaproveitando tanque e painel existentes. Nao implementado nesta rodada; diferenciar boia do motor da bomba e nao inventar curva resistiva/pinagem VW como confirmadas.
- Preservar montagem, freios, EGAS, arrefecimento e limpadores. Nao retomar automaticamente a fila dimensional antiga. Servidor127.0.0.1:5173 preservado.

### 2026-09-10: arrefecimento integrado e validado

- Entrega atual descrita no inicio da secao 2: balanco termico, circulacao e falhas conectados as pecas existentes. Substitui os limites historicos de ausencia de circulacao e ventoinha puramente ilustrativa; nao altera limites dos outros fluidos.
- Servidor preservado em http://127.0.0.1:5173/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo .
- Proximo lote sugerido: comandos da coluna, circuito eletrico e mecanismo dos limpadores, usando as pecas ja montadas. Nao implementado nesta rodada. Manter topologia didatica explicita onde a aplicacao Golf nao estiver confirmada; nao reiniciar rodas, freios, EGAS ou arrefecimento nem retomar automaticamente fila dimensional antiga.

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