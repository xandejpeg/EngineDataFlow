# Modelo fisico (educacional)

Todas as grandezas internas usam SI com nomes inequivocos (`pressurePa`, `temperatureK`,
`angleRad`, ...). A conversao ocorre apenas na borda da interface
([`src/simulation/format.ts`](../src/simulation/format.ts)).

## Convencoes de angulo

- Angulo global do virabrequim: `0..720°` (fase termodinamica completa de quatro tempos).
- Posicao mecanica repete a cada `360°`; o comando gira a **metade** da velocidade do virabrequim.
- `omega = 2π·rpm/60`. A progressao usa tempo real e `delta`, com sub-passos fixos
  (`1/120 s`) para consistencia temporal quando o FPS cai
  ([`src/app/useSimulationLoop.ts`](../src/app/useSimulationLoop.ts)).

Convencao local por cilindro:

| Angulo local | Tempo |
| --- | --- |
| 0–180 | Admissao (PMS → PMI) |
| 180–360 | Compressao (PMI → PMS), centelha antes de 360 |
| 360–540 | Combustao/expansao (PMS → PMI) |
| 540–720 | Escape (PMI → PMS) |

Ordem de ignicao 1-3-4-2, eventos separados por 180°. Deslocamentos de fase em
[`src/simulation/phasing.ts`](../src/simulation/phasing.ts).

## Cinematica biela-manivela

```
x(θ) = r·(1 − cos θ) + l − √(l² − (r·sin θ)²)
```

`r` = raio da manivela (`stroke/2`), `l` = comprimento da biela. Curso = `2r`. Velocidade e
`dV/dθ` derivadas analiticamente em [`src/simulation/kinematics.ts`](../src/simulation/kinematics.ts).

## Geometria e volumes

```
Ap = π·bore²/4
Vd(cil) = Ap·stroke        Vd(total) = Vd(cil)·nCil
Vc = Vd(cil)/(CR − 1)      V(θ) = Vc + Ap·x(θ)
CR_geometrica = (Vd(cil) + Vc)/Vc
```

## Termodinamica (zona unica, continua no angulo)

Estado de referencia no fechamento da admissao (PMI, local 180°): `p1 = pressao do coletor`,
`T1 = temperatura de admissao`, `V1 = V(180)`, com `m·R = p1·V1/T1`.

- Admissao: `p ≈ pressao do coletor`, `T ≈ T_admissao`.
- Compressao (antes da centelha): `p = p1·(V1/V)^γ`, `T = T1·(V1/V)^(γ−1)`.
- Combustao/expansao: `T = T_motored + xb·Q/(m·cv)`, `p = m·R·T/V`, com
  `T_motored = T1·(V1/V)^(γ−1)`, `cv = R/(γ−1)`.
- Escape: mistura proxima da contrapressao, gas esfriando.

Fracao queimada (Wiebe): `xb = 1 − exp(−a·τ^(m+1))`, `τ` normalizado na janela de combustao
(`a=5`, `m=2` por padrao, configuraveis). Eficiencia de combustao e estabilidade dependem de
`lambda` ([`src/simulation/combustion.ts`](../src/simulation/combustion.ts)).

Eficiencia ideal do Ciclo Otto (apenas comparacao): `η_ideal = 1 − 1/CR^(γ−1)`.

## Torque, trabalho e potencia

- Torque por cilindro: `τ = (p − p_atm)·dV/dθ` (dθ em radianos), somado sobre os cilindros.
- Trabalho indicado: integral de `p dV` no ciclo. IMEP `= W/Vd(total)`.
- Potencia: `P = τ_medio·ω`. Atrito e perdas mecanicas simplificados por RPM/carga.
- Balanco energetico: util + arrefecimento + escape + bombeamento + atrito ≈ 100% (estimativa).

Media de ciclo calculada por amostragem (120 pontos) em
[`src/simulation/simulationEngine.ts`](../src/simulation/simulationEngine.ts); amostragem para
graficos em [`src/simulation/cycleSampling.ts`](../src/simulation/cycleSampling.ts).

## Mistura e combustivel

`lambda = AFR_real/AFR_estequiometrico`. Gasolina 14,7:1; etanol ~9:1 (`src/simulation/constants.ts`).
Massa de ar por ciclo a partir da eficiencia volumetrica e densidade do ar
(`ρ = p/(R·T)`); vazao de combustivel = vazao de ar / AFR.

## Sistemas lentos (integrados no tempo)

- **Arrefecimento** ([`cooling.ts`](../src/simulation/cooling.ts)): termostatica (histerese),
  eletroventilador, radiador, capacidade termica agrupada; temperaturas de liquido, cabecote e
  pistao.
- **Lubrificacao** ([`lubrication.ts`](../src/simulation/lubrication.ts)): pressao por RPM e
  viscosidade, valvula de alivio, integridade do filme, contaminacao.
- **Turbo** ([`turbo.ts`](../src/simulation/turbo.ts)): boost por energia de escape, wastegate,
  temperatura de mancal (risco de parada a quente).

## Indices heuristicos (nao previsoes de engenharia)

- Risco de detonacao: CR, avanco, carga, temperatura de liquido e admissao, octanagem, boost;
  etanol reduz o risco. A ECU recua o avanco quando o risco e alto.
- Risco de pre-ignicao: depositos, temperatura do pistao/cabecote, carga.
- Emissoes relativas (CO/HC/NOx/CO2): tendencias qualitativas em funcao de lambda, temperatura e
  misfire ([`emissions.ts`](../src/simulation/emissions.ts)).

## Limitacoes

Modelo de zona unica, sem quimica detalhada, sem CFD/FEA. Cores, particulas e deformacoes sao
explicativas e frequentemente ampliadas. Tolerancias e limites reais dependem sempre da
especificacao do fabricante.
