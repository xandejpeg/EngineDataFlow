import { Link } from 'react-router-dom';
import { LESSONS_BY_TRACK } from '@/data/lessons.pt-BR';
import { useLearningStore } from '@/state/learningStore';
import '../pages.css';

export function LearnPage() {
  const progress = useLearningStore((s) => s.lessonProgress);

  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <h1>Aprender</h1>
        </div>
        <p className="page-subtitle">
          Trilhas progressivas do basico ao diagnostico. Cada licao controla a camera e a simulacao.
          O laboratorio nunca fica bloqueado atras das trilhas.
        </p>

        {LESSONS_BY_TRACK.map(({ track, lessons }) => (
          <section className="section" key={track.id}>
            <h2>{track.titlePt}</h2>
            <p style={{ color: 'var(--text-2)', marginTop: -6 }}>{track.descriptionPt}</p>
            <div className="card-grid">
              {lessons.map((l) => {
                const done = progress[l.id]?.completed;
                return (
                  <Link className="card" to={`/learn/${l.id}`} key={l.id}>
                    <h3>{l.titlePt}</h3>
                    <p>{l.summaryPt}</p>
                    <div className="meta">
                      <span>{l.steps.length} passos</span>
                      {done && <span className="tag done">Concluida</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
