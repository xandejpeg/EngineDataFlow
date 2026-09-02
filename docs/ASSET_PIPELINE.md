# Pipeline de ativos 3D (opcional)

O EngineDataFlow roda **totalmente offline** com geometria procedural. Este pipeline e **opcional** e
serve apenas para, no futuro, substituir pecas procedurais por GLBs otimizados. Nada aqui e exigido
para instalar, testar ou executar o app.

## Servidores MCP (configuracao)

[`.vscode/mcp.json`](../.vscode/mcp.json) declara tres servidores sem chaves literais:

- **meshy** (`@meshy-ai/meshy-mcp-server`): geracao/download 3D. Le `MESHY_API_KEY` do ambiente.
- **blender** (`blender-mcp` via `uvx`): limpeza, alinhamento e exportacao. Telemetria desabilitada.
- **playwright** (`@playwright/mcp`): validacao visual/funcional no navegador.

Ativacoes manuais inevitaveis: confirmar instaladores/UAC, confiar nos MCPs no VS Code, habilitar
`Interface: Blender MCP` e iniciar a conexao no painel BlenderMCP, e iniciar o servidor Meshy via
`MCP: List Servers`. Configure a chave por ambiente (nunca commit):

```bash
# PowerShell (sessao atual)
$env:MESHY_API_KEY = "<sua-chave>"
```

## Extracao do manual (Poppler, local)

```bash
npm run extract-manual
```

Gera texto/imagens/paginas em `references/manual/extracted/` (gitignored). Nao envia o PDF a nenhum
servico. Classifique cada item como `OTTO_ONLY`/`COMMON`/`DIESEL_ONLY` antes de usar.

## Regras de gasto (Meshy)

1. `meshy_check_balance` antes de qualquer geracao.
2. Respeitar `MESHY_CREDIT_BUDGET`; registrar tudo em
   [`docs/assets/credit-ledger.json`](assets/credit-ledger.json).
3. Sem budget definido → autorizado no maximo o saldo existente, sem comprar creditos.
4. Saldo insuficiente → fallback procedural.
5. Nunca repetir geracao sem consultar `asset-provenance.json`, `credit-ledger.json`,
   `meshy_list_tasks` e os arquivos existentes.
6. Malha economica primeiro (sem 8K/ultra); textura 2K basta; Smart Topology quando adequado.

## Fluxo por ativo

identificar peca → prompt original generico → (se permitido) recortar apenas referencias
indispensaveis → `meshy_image_to_3d`/`meshy_multi_image_to_3d`/`meshy_text_to_3d` →
`meshy_get_task_status` → `meshy_download_model` → salvar bruto em
`assets/source/meshy/<component-id>/` → limpar/alinhar/otimizar no Blender
(`assets/source/blender/`) → exportar `public/models/engine/<component-id>.glb` → atualizar
[`docs/assets/asset-provenance.json`](assets/asset-provenance.json) e o manifesto.

## Regras invioláveis

- Uma malha gerada **nunca** define a cinematica, dimensoes funcionais ou conclusoes tecnicas.
- Nenhum ativo final referencia textura remota ou URL temporaria.
- Falha ao carregar um GLB aciona fallback procedural sem derrubar a cena.
- Segredos e URLs assinadas nunca entram no bundle, logs ou screenshots.
- `ALLOW_EXTERNAL_REFERENCE_UPLOAD` deve ser `true` para enviar qualquer imagem recortada; caso
  contrario, usar apenas modelagem procedural ou text-to-3D generico.
