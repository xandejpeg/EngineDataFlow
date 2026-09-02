import { Link } from 'react-router-dom';
import { CASE_STUDIES } from '@/data/caseStudies.pt-BR';
import { FAULTS_BY_ID } from '@/data/faults.pt-BR';
import { useLearningStore } from '@/state/learningStore';
import '../pages.css';

export function CasesPage() {
  const results = useLearningStore((s) => s.caseResults);

  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <h1>Estudos de caso</h1>
          <span className="tag info">{CASE_STUDIES.length} casos</span>
        </div>
        <p className="page-subtitle">
          Cada caso segue o padrao: aspecto → dados → causas provaveis → teste discriminante →
          correcao → prevencao. Diagnostico real exige medicao e a especificacao do fabricante.
        </p>
        <div className="card-grid">
          {CASE_STUDIES.map((c) => {
            const fault = c.faultId ? FAULTS_BY_ID[c.faultId] : null;
            const severity = fault?.severity ?? 'info';
            const done = results[c.id]?.completed;
            return (
              <Link className="card" to={`/cases/${c.id}`} key={c.id}>
                <h3>{c.titlePt}</h3>
                <p>{c.narrativePt}</p>
                <div className="meta">
                  <span className={`tag ${severity}`}>{severityPt(severity)}</span>
                  {done && <span className="tag done">Resolvido</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function severityPt(s: string): string {
  if (s === 'critical') return 'Critico';
  if (s === 'warning') return 'Alerta';
  return 'Referencia';
}
