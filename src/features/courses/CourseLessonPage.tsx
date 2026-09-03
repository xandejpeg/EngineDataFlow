import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { getLesson, type LessonBlock } from '@/data/courseLessons.pt-BR';
import { LESSON_SCENES } from './lessons/lessonScenes';
import { LazyScene } from './lessons/LazyScene';
import '../pages.css';
import './lesson.css';

export function CourseLessonPage() {
  const { courseId, lessonId } = useParams();
  const lesson = courseId && lessonId ? getLesson(courseId, lessonId) : undefined;
  const [pageIdx, setPageIdx] = useState(0);

  if (!lesson) {
    return (
      <div className="page">
        <p>
          Aula nao encontrada. <Link to="/courses">Voltar aos cursos</Link>
        </p>
      </div>
    );
  }

  const page = lesson.pages[pageIdx];
  const total = lesson.pages.length;

  return (
    <div className="lesson-wrap">
      <header className="lesson-topbar">
        <Link to={`/courses/${courseId}`} className="tag">
          ← Voltar ao curso
        </Link>
        <div className="lesson-title-group">
          <span className="lesson-num">Aula {lesson.numero}</span>
          <h1>{lesson.titlePt}</h1>
          <span className="tag info">{lesson.tag}</span>
        </div>
      </header>

      <main className="lesson-board">
        <div className="lesson-board-inner">
          {page ? (
            <>
              <div className="lesson-page-head">
                <span className="lesson-page-label">
                  Pagina {pageIdx + 1} de {total}
                </span>
                <h2>{page.titlePt}</h2>
              </div>
              {page.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </>
          ) : (
            <p>Pagina vazia.</p>
          )}
        </div>
      </main>

      <footer className="lesson-nav">
        <button
          className="btn"
          disabled={pageIdx === 0}
          onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        <span className="lesson-nav-dots">
          {lesson.pages.map((_, i) => (
            <span key={i} className={`dot${i === pageIdx ? ' active' : ''}`} />
          ))}
        </span>
        <button
          className="btn primary"
          disabled={pageIdx >= total - 1}
          onClick={() => setPageIdx((p) => Math.min(total - 1, p + 1))}
        >
          Proxima <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case 'question':
      return (
        <div className="lesson-question">
          <HelpCircle size={22} />
          <span>{block.textPt}</span>
        </div>
      );
    case 'heading':
      return <h3 className="lesson-heading">{block.textPt}</h3>;
    case 'text':
      return <p className="lesson-text">{block.textPt}</p>;
    case 'note':
      return <p className="lesson-note">{block.textPt}</p>;
    case 'formula':
      return <div className="lesson-formula">{block.textPt}</div>;
    case 'concept':
      return (
        <div className="lesson-concept" style={{ borderLeftColor: block.color }}>
          <div className="lesson-concept-head">
            <span className="lesson-concept-num" style={{ background: block.color }}>
              {block.numero}
            </span>
            <h3>{block.titlePt}</h3>
            <span className="lesson-concept-unit" style={{ borderColor: block.color, color: block.color }}>
              {block.unitPt}
            </span>
          </div>
          <p className="lesson-text">{block.definitionPt}</p>
        </div>
      );
    case 'scene': {
      const Scene = LESSON_SCENES[block.sceneId];
      return (
        <figure className={block.wide ? 'lesson-scene lesson-scene-wide' : 'lesson-scene'}>
          <div className="lesson-scene-canvas" style={{ height: block.heightPx ?? 320 }}>
            {Scene ? (
              <LazyScene>
                <Scene />
              </LazyScene>
            ) : (
              <div className="lesson-scene-missing">Cena 3D indisponivel</div>
            )}
          </div>
          {block.captionPt && <figcaption>{block.captionPt}</figcaption>}
        </figure>
      );
    }
    default:
      return null;
  }
}
