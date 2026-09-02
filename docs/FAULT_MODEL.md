# Modelo de falhas (Fault Engine)

O motor de falhas nao troca apenas textos ou cores: ele converte falhas ativas em **modificadores
numericos** que alteram configuracao e subsistemas, propagando efeitos pela simulacao inteira
(cena 3D, telemetria, graficos, alertas).

- Definicoes textuais originais: [`src/data/faults.pt-BR.ts`](../src/data/faults.pt-BR.ts)
- Comportamento numerico: [`src/simulation/faults/faultModifiers.ts`](../src/simulation/faults/faultModifiers.ts)
- Estudos de caso: [`src/data/caseStudies.pt-BR.ts`](../src/data/caseStudies.pt-BR.ts)

## Estrutura de uma falha

Cada `FaultDefinition` traz: identificador, titulo, sistema, severidade, causa raiz, fatores
contribuintes, variaveis afetadas, sinais observaveis, efeitos 3D, efeitos nos graficos, progressao,
consequencias secundarias, testes de diagnostico, correcao, prevencao, confianca da inferencia e se
o efeito e `calculated` ou `heuristic`.

## Acumulacao de modificadores

`accumulateFaultModifiers(faultIds, config)` parte de um objeto neutro e aplica o patch de cada
falha. Os modificadores incluem, por exemplo: eficiencia volumetrica, pressao do coletor,
contrapressao, avanco, lambda, octanagem, termostatica travada, ventilador desabilitado, pressao e
nivel de oleo, vedacao dos aneis, blow-by, atrito, folga do pistao, misfire forcado, erro de
sincronismo de valvulas, lubrificacao do turbo, wastegate travada, deposito de carvao e restricao de
admissao.

## Exemplo de grafo causal

```
radiador/termostatica restringe circulacao
  → menor rejeicao de calor
    → temperatura do liquido sobe
      → temperatura da camara sobe
        → maior risco de detonacao
          → recuo de avanco pela ECU + perda de torque
            → dano termico (heuristico)
```

Cada estudo de caso expoe a cadeia causal (`causalChainPt`) e um fluxo de diagnostico:
**aspecto → dados → causas provaveis → teste discriminante → correcao → prevencao**.

## Cobertura (18 casos)

Combustao normal; detonacao; pre-ignicao; mistura pobre; mistura rica; superaquecimento
(termostatica fechada); motor frio (termostatica aberta); baixa pressao de oleo; aneis
desgastados/invertidos; contaminacao abrasiva; folga insuficiente; folga excessiva; misfire;
sincronismo de valvulas; valvula de escape queimada; filtro de ar obstruido; lubrificacao do turbo;
wastegate mal regulada.
