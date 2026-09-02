# Plano de geracao de ativos

Estado atual: **100% procedural**. Nenhum credito Meshy consumido. GLBs sao opcionais e futuros.
A camada de ativos aceita `procedural` | `glb` | `hybrid` por componente, com fallback procedural.

| Componente | Metodo atual | Candidato a GLB/hibrido | Referencia | Prioridade | Estado |
| --- | --- | --- | --- | --- | --- |
| Virabrequim | procedural | nao (cinematica) | — | — | pronto |
| Pistoes / aneis / pino | procedural | nao (cinematica) | — | — | pronto |
| Bielas | procedural | nao (cinematica) | — | — | pronto |
| Comando / ressaltos | procedural | nao (sincronismo) | — | — | pronto |
| Valvulas / molas | procedural | nao (sincronismo) | — | — | pronto |
| Bloco em corte | procedural | hibrido | forma externa | media | planejado |
| Cabecote | procedural | hibrido | forma externa | media | planejado |
| Coletor de admissao | procedural | glb | forma externa | baixa | planejado |
| Coletor de escape | procedural | glb | forma externa | baixa | planejado |
| Corpo de borboleta / filtro | procedural | glb | forma externa | baixa | planejado |
| Radiador / reservatorio / ventoinha | procedural | glb | forma externa | baixa | planejado |
| Carcaca do turbo / intercooler | procedural | glb | forma externa | baixa | planejado |

Limites por nivel de qualidade (orcamento visual, a validar quando GLBs forem gerados):

- Baixo: ~30k triangulos totais, texturas ≤ 1K, sem sombras.
- Medio: ~120k triangulos, texturas ≤ 2K.
- Alto: ~300k triangulos, texturas ≤ 2K, sombras.

Regras: pecas cinematicas permanecem procedurais (geometria controlada e pivos validados). Pecas
externas de alta complexidade visual sao candidatas a GLB apenas quando trouxerem ganho claro e
dentro do budget de creditos.
