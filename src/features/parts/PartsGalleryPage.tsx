import { useMemo, useState } from 'react';
import { Boxes } from 'lucide-react';
import { PART_META, PART_MODELS, PART_GLB } from '@/engine3d/parts/partModels';
import { PartViewer } from '@/engine3d/PartViewer';
import '../pages.css';
import './parts.css';

/** Sistemas finos (PART_META.system) agrupados em poucas familias, na ordem do fluxo. */
const GROUP_OF: Record<string, string> = {
  'Motor / conjunto movel': 'Motor — mecanica',
  'Motor / bloco': 'Motor — mecanica',
  'Motor / distribuicao': 'Motor — mecanica',
  'Motor / admissao': 'Motor — mecanica',
  'Motor / escape': 'Motor — mecanica',
  Admissao: 'Admissao e ar',
  'Injecao / admissao': 'Admissao e ar',
  Alimentacao: 'Combustivel',
  'Injecao / combustivel': 'Combustivel',
  Ignicao: 'Ignicao',
  'Injecao / ignicao': 'Ignicao',
  Sensores: 'Sensores',
  'Injecao / sensores': 'Sensores',
  'Injecao / escape': 'Escape e emissoes',
  Controle: 'Controle e arrefecimento',
  Arrefecimento: 'Controle e arrefecimento',
};

const GROUP_ORDER = [
  'Motor — mecanica',
  'Admissao e ar',
  'Combustivel',
  'Ignicao',
  'Sensores',
  'Escape e emissoes',
  'Controle e arrefecimento',
  'Outros',
];

export function PartsGalleryPage() {
  const partIds = useMemo(() => Object.keys(PART_MODELS), []);
  const [defaultSource, setDefaultSource] = useState<'glb' | 'proc'>('glb');
  const generated = partIds.filter((id) => PART_GLB[id]).length;

  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const id of partIds) {
      const system = PART_META[id]?.system ?? '';
      const group = GROUP_OF[system] ?? 'Outros';
      const list = map.get(group);
      if (list) list.push(id);
      else map.set(group, [id]);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => [g, map.get(g)!] as const);
  }, [partIds]);

  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <Boxes size={26} color="var(--accent-cyan)" />
          <h1>Pecas 3D</h1>
        </div>
        <p className="page-subtitle">
          Todas as {partIds.length} pecas do motor e da injecao em 3D interativo, agrupadas por
          sistema. {generated} ja tem malha Meshy; o restante usa o modelo procedural (com rotulos).
          Gire com o mouse; use os botoes de cada peca para alternar <strong>Malha Meshy</strong> /{' '}
          <strong>Procedural</strong> e ligar/desligar os rotulos.
        </p>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '12px 0 4px' }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Mostrar por padrao:</span>
          <button
            className={`btn${defaultSource === 'glb' ? ' active' : ''}`}
            onClick={() => setDefaultSource('glb')}
          >
            Malha Meshy
          </button>
          <button
            className={`btn${defaultSource === 'proc' ? ' active' : ''}`}
            onClick={() => setDefaultSource('proc')}
          >
            Procedural
          </button>
        </div>

        {groups.map(([system, ids]) => (
          <section key={system} className="parts-group">
            <h2 className="parts-group-title">
              {system}
              <span className="parts-group-count">{ids.length}</span>
            </h2>
            <div className="parts-grid">
              {ids.map((id) => {
                const meta = PART_META[id];
                return (
                  <div className="part-tile" key={id}>
                    <PartViewer
                      key={`${id}-${defaultSource}`}
                      partId={id}
                      height={180}
                      defaultSource={defaultSource}
                    />
                    <div className="part-tile-info">
                      <strong>{meta?.namePt ?? id}</strong>
                      {meta?.conceptPt && <p className="part-tile-desc">{meta.conceptPt}</p>}
                      <div className="part-tile-tags">
                        <span className="tag info">{meta?.system ?? 'Peca'}</span>
                        {PART_GLB[id] ? (
                          <span className="tag done">3D gerado</span>
                        ) : (
                          <span className="tag">procedural</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
