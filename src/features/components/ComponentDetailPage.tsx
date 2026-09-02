import { Link, useParams } from 'react-router-dom';
import { COMPONENTS_BY_ID } from '@/data/components.pt-BR';
import { PartViewer } from '@/engine3d/PartViewer';
import '../pages.css';

/** Componentes que possuem peca 3D dedicada (procedural + malha Meshy). */
const COMPONENT_TO_PART: Record<string, string> = {
  injector: 'injector',
  'ignition-coil': 'ignition-coil',
  'spark-plug': 'ignition-coil',
  'throttle-body': 'throttle-body',
  ecu: 'ecu',
};

/** Componentes que aparecem no motor do laboratorio principal. */
const LAB_COMPONENTS = new Set([
  'piston',
  'piston-pin',
  'connecting-rod',
  'rings',
  'cylinder',
  'crankshaft',
  'main-bearings',
  'valves',
  'camshaft',
]);

export function ComponentDetailPage() {
  const { componentId } = useParams();
  const c = componentId ? COMPONENTS_BY_ID[componentId] : undefined;

  if (!c) {
    return (
      <div className="page">
        <p>Componente nao encontrado. <Link to="/components">Voltar</Link></p>
      </div>
    );
  }

  const partId = COMPONENT_TO_PART[c.id];
  const inLab = LAB_COMPONENTS.has(c.id);

  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <Link to="/components" className="tag">← Componentes</Link>
          <h1>{c.namePt}</h1>
          <span className="tag info">{c.assetMode}</span>
        </div>
        <p className="page-subtitle">{c.shortDescriptionPt}</p>

        {partId && (
          <section className="section" style={{ marginTop: 12 }}>
            <h2>Modelo 3D</h2>
            <PartViewer partId={partId} height={300} defaultSource="glb" />
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 6 }}>
              Gire com o mouse. Use os botoes para alternar <strong>Malha Meshy</strong> /
              <strong> Procedural</strong> e ligar/desligar os rotulos.
            </p>
          </section>
        )}

        <section className="section">
          <h2>Funcao</h2>
          <p style={{ color: 'var(--text-1)', lineHeight: 1.7 }}>{c.functionPt}</p>
        </section>

        <div className="two-col">
          <section className="section">
            <h2>Materiais tipicos</h2>
            <ul className="list-clean">
              {c.typicalMaterialsPt.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </section>
          <section className="section">
            <h2>Relacoes</h2>
            <ul className="list-clean">
              {c.relationsPt.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="section">
          <h2>Sintomas de falha</h2>
          <ul className="list-clean">
            {c.failureSymptomsPt.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {inLab && (
            <Link className="btn primary" to="/">
              Ver no motor 3D (laboratorio)
            </Link>
          )}
          <Link className="btn" to="/parts">
            Ver todas as pecas 3D
          </Link>
        </div>
      </div>
    </div>
  );
}
