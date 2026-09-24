Vou inspecionar só leitura. Preciso dos manifests reais antes de afirmar a stack. 

Read 

Ran terminal command: git rev-parse --abbrev-ref HEAD; git log -1 --format='%H %ad %s' --date=short; node -v; npx tsc -v

Auditar pureza e assets

Read 

Read 

Searched for regex `^import .* from ['"]react|react-dom|three|@react-three|zustand|window|document|canvas|requestAnimationFrame` (`**/src/simulation/**`), 10 results

Searched for files matching `**/src/**/{golfPhysics,golfElectrical,golfCooling,golfEgas,golfFuelSender,golfFuelConsumption,golfWipers,golfHydraulics,golfSensorHarness,golfDevices,golfService,golfLoom,golfOrthoRoute,golfLoomBundles}.ts`, 14 matches

Searched for regex `fps|benchmark|performance\.now|profil|orcamento|budget` (`**/src/**/*.{ts,tsx}`), 205 results

Read 

Read 

Searched for regex `useGLTF|GLTFLoader|\.glb|\.gltf` (`**/src/**/*.{ts,tsx}`), 58 results

Searched for regex `useFrame|AnimationMixer|AnimationClip` (`**/src/**/*.{ts,tsx}`), 166 results

Read 

Read 

Read , lines 1 to 50

Read , lines 1 to 50

Read , lines 1 to 50

Read , lines 1 to 50

Read , lines 1 to 50

Read 

Read 

Searched for regex `test\(|it\(` (`**/e2e/**`), 33 results

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read , lines 1 to 20

Read 

Searched for text `quality` (`**/src/**`), 28 results

Li o documento. Inspeção somente leitura, feita agora sobre o repositório. (Os 5 documentos da entrevista eu leio depois, se você me apontar os caminhos — não são necessários para este diagnóstico.)

---

# Diagnóstico técnico — EngineDataFlow como base

**Branch** `main` · **commit** `75eb71a94790` (2026-09-13).

## 1. Stack real

Fonte: `package.json`. Versões são as **declaradas no manifest**; não li o lockfile.

| Camada | Declarado |
|---|---|
| Linguagem | TypeScript `^5.6.3` (binário resolvido na máquina: 5.9.3) |
| UI | React `^18.3.1`, react-dom `^18.3.1`, react-router-dom `^6.27.0` |
| Render 3D | three `^0.169.0`, @react-three/fiber `^8.17.10`, @react-three/drei `^9.114.0` |
| Estado | zustand `^5.0.0` · Persistência: dexie `^4.0.9` (IndexedDB) |
| Gráficos 2D | recharts `^2.13.0` · Ícones: lucide-react `^0.454.0` · Schema: zod `^3.23.8` |
| Build | vite `^5.4.10`, @vitejs/plugin-react `^4.3.3` |
| Testes | vitest `^2.1.4`, @playwright/test `^1.48.0`, @testing-library/react `^16.0.1`, jsdom `^25.0.1` |
| Node | `engines.node: >=20` (instalado: v24.13.0) |

**Biblioteca de física: nenhuma.** Não há cannon, rapier, ammo, havok ou equivalente. Toda a física é escrita à mão em TypeScript.

## 2. Núcleo reaproveitável

| # | Módulo | Caminho | Função | Depende de | Classe |
|---|---|---|---|---|---|
| 1 | Geometria + cinemática | `geometry.ts`, `kinematics.ts` | Curso, volume, dV/dθ, posição do pistão | nada | **funcional** |
| 2 | Termodinâmica do cilindro | `thermodynamics.ts` | p, T, V, torque por cilindro; `pV=mRT` | 1, 3 | **aproximação** (zona única, quase-estático) |
| 3 | Combustão Wiebe | `combustion.ts` | Fração queimada, eficiência por λ | constants | **aproximação** (a=5, m=2 fixos) |
| 4 | Admissão e mistura | `intake.ts` | p_coletor, ef. volumétrica, λ, vazão | constants | **aproximação** (parábola com pico em 3200 rpm) |
| 5 | Fasagem + comando | `phasing.ts`, `valveTrain.ts` | Ordem 1-3-4-2, altura de válvula | constants | **funcional** |
| 6 | Térmica/fluidos | `cooling.ts`, `lubrication.ts`, `turbo.ts` | Redes agregadas de calor, óleo, turbo | constants | **aproximação** |
| 7 | Falhas | faults/faultModifiers.ts | 18 modificadores escalares globais | — | **funcional**, mas **nenhuma falha elétrica** |
| 8 | Grafo elétrico + medição | `golfElectrical.ts` | 15 nós, potencial por conectividade, B+/0 V/flutuante | nada | **funcional** |
| 9 | Chicote + dispositivos | `golfSensorHarness.ts`, `golfDevices.ts` | Rotas, bornes, cores DIN, conector com via numerada | `three` (só vetor) | **funcional** |
| 10 | Gabarito do veículo | `golfPhysics.ts` + ~30 arquivos `golf*Geometry.ts` | Cotas em mm, estados de came, acoplamento elétrica→rpm | — | **funcional** (geometria) / **visualização** (o resto) |

**Ressalva estrutural:** os itens 1–7 e 8–10 são **duas pilhas independentes**. Nenhum arquivo em `scenes/golf/**` importa de `simulation`. Unidades divergem: núcleo em SI (m, Pa, K, rad), Golf em mm e graus. λ é escalar global, não por cilindro. Sem dinâmica veicular: o carro não se desloca.

## 3. Separação da interface

**Roda sem navegador (TypeScript puro, zero DOM/React/three):** todos os 18 arquivos de `simulation`, mais 12 dos 14 módulos de modelo do Golf (`golfPhysics.ts`, `golfElectrical`, `golfCooling`, `golfEgas`, `golfFuelSender`, `golfFuelConsumption`, `golfWipers`, `golfHydraulics`, `golfService`, `golfLoom`, `golfOrthoRoute`, `golfLoomBundles`). `frameBus.ts` também é puro.

**Dois módulos usam `three` apenas como biblioteca de vetor/quaternion** (`Vector3`, `Matrix4`), não para renderizar: `golfSensorHarness.ts` e `golfDevices.ts`. Substituíveis por qualquer math lib.

**Preso à interface:** `useSimulationLoop.ts` (é o relógio), `simulationStore.ts` (zustand), e tudo em `engine3d/` e `features/`.

**Contrato do núcleo:** entrada `EngineConfiguration` + `faultIds` + `dt`; saída `TelemetryFrame`. Unidades SI. Tempo: `requestAnimationFrame` mede `dt` real, limita a 0,1 s, subdivide em passos fixos de no máximo 1/120 s, e o ângulo avança por `ω·dt` dentro de 0–720°. A UI é atualizada a cada 50 ms.

**O que impede execução isolada:** apenas o relógio. O `SimulationEngine` é uma classe comum; `engine.step(dt)` num laço Node funciona sem alteração. O acoplamento está na borda, não no núcleo.

## 4. Assets

- **Golf V inteiro: 100% procedural.** Nenhum arquivo de malha. Geometria gerada por código com `ExtrudeGeometry`, `LatheGeometry` e primitivas próprias em `GolfPrimitives.tsx`.
- **GLB existentes:** 6 em `lesson` e ~49 em `parts`, cada um com textura `*_base_color.png`. Carregados por `useGLTF` em 3 arquivos (`PartViewer.tsx`, `partModels.tsx`, `circuitParts.tsx`).
- **Procedência rastreada:** `asset-provenance.json` registra cada peça, o método (`meshy_text_to_3d`, modelos meshy-5/6) e o arquivo final. Pipeline descrito em `ASSET_PIPELINE.md`.
- **Animação:** 166 usos de `useFrame` em 31 arquivos. **Zero** `AnimationMixer`/`AnimationClip`. Nada é keyframe ou skinning — tudo é calculado por quadro.
- **Exportável hoje sem conversão:** os ~55 GLB. **Não exportável:** o Golf, que só existe como código.

## 5. Evidências existentes

- **50 arquivos de teste unitário** (3 em `__tests__`, 47 na pasta do Golf) e **23 specs Playwright** em `e2e`.
- Cobertura útil como referência: PMS/PMI e curso (`geometry.test.ts`), ordem 1-3-4-2 e ausência de cruzamento no modo ideal (`phasing.test.ts`), balanço de energia somando ≈1 e propagação de 3 falhas (`simulationEngine.test.ts`), polaridade/flutuante/fusível (`golfMeter.test.ts`), estados de came (`golfPhysics.test.ts`).
- **Teste encontrado ≠ teste executado.** Nesta inspeção eu **não executei** Vitest nem Playwright (instrução permanente do Alessandro nesta sessão). O que executei: `tsc --noEmit`, sem erros.
- **Medição de desempenho: não existe.** `performance.now()` só aparece para calcular `dt`. Nenhum contador de fps, benchmark ou orçamento de quadro.
- **LOD de simulação: não existe.** Há um `QualityLevel` (`low|medium|high|auto`) em `types.ts`, mas ele altera **só renderização** — DPR, sombras, antialias em `EngineScene.tsx`. Não muda nada do modelo.

## 6. Custo de integração

| Alvo | Reuso direto | Adaptação | Reescrita |
|---|---|---|---|
| **Unity / C#** | Nada em binário. | As **equações e a topologia** portam bem: 18 arquivos puros + 12 do Golf são funções determinísticas sem dependência de plataforma; a tradução TS→C# é mecânica (tipos numéricos, `Math`, structs). Os testes existentes viram oráculo de paridade. O grafo elétrico e o chicote são dados + busca em largura — portam quase literalmente. | Todo o `engine3d/` e `features/`; o Golf procedural inteiro (seria remodelado como asset); o relógio; a persistência Dexie. |
| **Unreal / C++** | Igual ao Unity quanto ao núcleo. | Mesma tradução, custo maior por C++ e por Blueprint/UI. | Idem, mais caro na camada de apresentação. |
| **Web mantida como produto** | Praticamente tudo. | Unificar as duas pilhas (unidades e nomenclatura), extrair o núcleo do laço RAF. | Nada. |

**Fundamentação:** o que sustenta a portabilidade é a pureza verificada no ponto 3 — nenhum dos módulos de modelo depende de DOM, React ou do renderizador. O que encarece qualquer engine nativa é a camada 3D: ~30 arquivos de geometria procedural do Golf que não têm equivalente exportável.

**Lacuna que exige avaliação externa:** não há como afirmar custo de execução em nenhuma das opções sem medição. Não existe benchmark aqui, e o alvo do jogo (200+ NPCs, duas cidades) está muito além do que o laboratório já demonstrou — ele simula **um** carro parado.

## 7. Próximo teste mínimo

**Paridade numérica do núcleo fora do navegador.**

- **O que fazer:** portar apenas `geometry.ts`, `kinematics.ts`, `combustion.ts` e `thermodynamics.ts` para C# (ou C++), sem UI.
- **Entrada:** `DEFAULT_CONFIG` de `simulationEngine.ts`, 720° varridos em passos de 1°, sem falhas.
- **Resultado observável:** série de pressão, temperatura, volume e torque do cilindro 1. Comparar com a mesma série gerada pelo laboratório em Node.
- **Critério:** desvio relativo dentro de tolerância acordada em todos os pontos, e `sampleCycle()` reproduzindo a mesma curva p-V.

Isso ataca o maior risco — *as equações sobrevivem à mudança de linguagem e de precisão?* — com o menor volume de código, e produz de quebra o primeiro medidor de custo por passo fora do navegador.

## Conclusão

**Riscos de migração.** (1) Não existe um núcleo único: são duas pilhas com unidades e vocabulário diferentes, e uni-las é trabalho novo. (2) O ativo visual do Golf é código, não arquivo — em engine nativa ele é perda total. (3) A causalidade elétrica é ligado/desligado, sem corrente nem resistência, e não há falha elétrica; reparo interativo com multímetro exige estender o modelo. (4) λ é global: atribuir sintoma a um cilindro não é possível hoje. (5) Sem dinâmica veicular, nada do que existe contribui para dirigir.

**Informações que ainda faltam.** Custo por passo de simulação medido (não existe medição alguma); resultado real da suíte de testes, que eu não executei; hardware alvo; e quantos veículos precisam rodar em fidelidade completa ao mesmo tempo — esse número, mais que a engine, define se o núcleo atual serve.

Se quiser, o próximo passo barato que posso executar aqui é rodar a suíte de testes e medir o custo de `engine.step()` em Node, convertendo duas dessas lacunas em dado. Preciso da sua autorização, porque hoje estou proibido de rodar Vitest nesta sessão.