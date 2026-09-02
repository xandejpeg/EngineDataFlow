import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Boxes,
  CheckCircle2,
  ExternalLink,
  Clock,
  MapPin,
  Wrench,
  AlertTriangle,
  Box,
} from 'lucide-react';
import { COURSES_BY_ID, type CourseTopic } from '@/data/courses.pt-BR';
import { getCourseLessons } from '@/data/courseLessons.pt-BR';
import { COMPONENTS_BY_ID } from '@/data/components.pt-BR';
import { PartViewer } from '@/engine3d/PartViewer';
import '../pages.css';
import './courses.css';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const course = courseId ? COURSES_BY_ID[courseId] : undefined;
  const [tab, setTab] = useState<'content' | 'lessons'>('content');

  if (!course) {
    return (
      <div className="page">
        <p>Curso nao encontrado. <Link to="/courses">Voltar</Link></p>
      </div>
    );
  }

  const lessons = getCourseLessons(course.id);

  return (
    <div className="page">
      <div className="course-detail">
        <div className="page-title">
          <Link to="/courses" className="tag">← Cursos</Link>
        </div>
        <h1 className="course-h1">{course.titlePt}</h1>

        <div className="course-header glass">
          <div className="course-header-meta">
            {course.institution && (
              <span className="chip"><strong>{course.institution}</strong></span>
            )}
            <span className="chip"><Clock size={13} /> {course.hours} horas</span>
            <span className="chip">{course.category}</span>
            <span className="chip"><MapPin size={13} /> {course.unitPt}</span>
          </div>
          <p className="course-objective"><strong>Objetivo:</strong> {course.objectivePt}</p>
          <p className="course-note"><AlertTriangle size={14} /> {course.notePt}</p>
          {course.officialUrl && (
            <a className="btn" href={course.officialUrl} target="_blank" rel="noopener noreferrer">
              Pagina oficial <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Abas */}
        <div className="course-tabs" role="tablist" aria-label="Secoes do curso">
          <button
            role="tab"
            aria-selected={tab === 'content'}
            className={`course-tab${tab === 'content' ? ' active' : ''}`}
            onClick={() => setTab('content')}
          >
            Conteudo do curso
          </button>
          <button
            role="tab"
            aria-selected={tab === 'lessons'}
            className={`course-tab${tab === 'lessons' ? ' active' : ''}`}
            onClick={() => setTab('lessons')}
          >
            Aulas
          </button>
        </div>

        {tab === 'content' && (
          <>
            {/* Indice */}
            <nav className="course-index glass" aria-label="Indice do curso">
              <h2>Blocos do curso</h2>
              <ol>
                {course.blocks.map((b) => (
                  <li key={b.id}>
                    <a href={`#bloco-${b.numero}`}>
                      <span className="course-index-num">{b.numero}</span>
                      {b.titlePt}
                    </a>
                    <span className={`tag ${b.importancia === 'alta' ? 'critical' : 'warning'}`}>
                      {b.importancia === 'alta' ? 'essencial' : 'complementar'}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Blocos */}
            {course.blocks.map((b) => (
              <section key={b.id} id={`bloco-${b.numero}`} className="course-block">
                <header className="course-block-head">
                  <span className="course-block-num">{b.numero}</span>
                  <div>
                    <h2>{b.titlePt}</h2>
                    <p>{b.summaryPt}</p>
                  </div>
                </header>

                {b.topics.map((t) => (
                  <TopicCard key={t.id} topic={t} />
                ))}
              </section>
            ))}

            <p className="course-footer-note">
              Este material sera tridimensionalizado: cada componente ja possui um descritor de
              referencia 3D (forma e prompt de geracao). Os itens marcados como <em>procedural</em> ja
              aparecem no laboratorio 3D; os <em>planejados</em> entram nas proximas etapas.
            </p>
          </>
        )}

        {tab === 'lessons' && (
          <section className="course-lessons">
            {lessons.length === 0 ? (
              <div className="course-lessons-empty glass">
                <h2>Aulas</h2>
                <p>
                  As aulas serao adicionadas aqui, uma a uma. Cada aula tera simulacoes 3D completas,
                  do inicio ao fim do conteudo.
                </p>
                <span className="tag">nenhuma aula ainda</span>
              </div>
            ) : (
              <ol className="course-lessons-list">
                {lessons.map((l) => (
                  <li key={l.id} className="course-lesson-item">
                    <Link to={`/courses/${course.id}/lessons/${l.id}`} className="course-lesson-link">
                      <span className="course-index-num">{l.numero}</span>
                      <div>
                        <strong>
                          Aula {l.numero}: {l.titlePt}
                        </strong>
                        {l.summaryPt && <p>{l.summaryPt}</p>}
                        <span className="tag info">{l.tag}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: CourseTopic }) {
  const related = topic.viz3d.relatedComponentId
    ? COMPONENTS_BY_ID[topic.viz3d.relatedComponentId]
    : undefined;

  return (
    <article className="topic-card">
      <h3>{topic.titlePt}</h3>
      <p className="topic-body">{topic.bodyPt}</p>

      <div className="topic-cols">
        <div>
          <h4><CheckCircle2 size={14} /> Pontos-chave</h4>
          <ul className="list-clean">
            {topic.keyPointsPt.map((k, i) => <li key={i}>{k}</li>)}
          </ul>

          {topic.failureSymptomsPt && (
            <>
              <h4><AlertTriangle size={14} /> Sintomas de falha</h4>
              <ul className="list-clean">
                {topic.failureSymptomsPt.map((k, i) => <li key={i}>{k}</li>)}
              </ul>
            </>
          )}

          {topic.howToTestPt && (
            <>
              <h4><Wrench size={14} /> Como testar</h4>
              <ul className="list-clean">
                {topic.howToTestPt.map((k, i) => <li key={i}>{k}</li>)}
              </ul>
            </>
          )}
        </div>

        <div>
          {topic.technicalData && topic.technicalData.length > 0 && (
            <div className="tech-table">
              <h4><Boxes size={14} /> Dados tecnicos</h4>
              <dl>
                {topic.technicalData.map((d, i) => (
                  <div key={i} className="tech-row">
                    <dt>{d.label}</dt>
                    <dd className="mono">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="viz3d-card">
            <div className="viz3d-head">
              <Box size={14} />
              <strong>Referencia 3D</strong>
              <span className={`viz3d-status viz3d-${topic.viz3d.status}`}>{topic.viz3d.status}</span>
            </div>
            {topic.viz3d.partModelId && (
              <PartViewer partId={topic.viz3d.partModelId} height={200} />
            )}
            <p style={topic.viz3d.partModelId ? { marginTop: 10 } : undefined}>{topic.viz3d.shapePt}</p>
            {related && (
              <Link className="btn" to={`/components/${related.id}`}>
                Ver componente: {related.namePt}
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
