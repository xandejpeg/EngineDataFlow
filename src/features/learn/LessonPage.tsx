import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LESSONS_BY_ID } from '@/data/lessons.pt-BR';
import { EngineScene } from '@/engine3d/EngineScene';
import { useSimulationStore } from '@/state/simulationStore';
import { useLearningStore } from '@/state/learningStore';
import { useUiStore } from '@/state/uiStore';
import '../pages.css';

export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? LESSONS_BY_ID[lessonId] : undefined;
  const [stepIdx, setStepIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const setCrankAngle = useSimulationStore((s) => s.setCrankAngle);
  const setRunning = useSimulationStore((s) => s.setRunning);
  const selectComponent = useUiStore((s) => s.selectComponent);
  const completeStep = useLearningStore((s) => s.completeLessonStep);

  const step = lesson?.steps[stepIdx];

  useEffect(() => {
    if (!step) return;
    if (step.crankAngleDeg !== undefined) {
      setRunning(false);
      setCrankAngle(step.crankAngleDeg);
    }
    if (step.focusComponentId) selectComponent(step.focusComponentId);
    setQuizAnswer(null);
  }, [step, setCrankAngle, setRunning, selectComponent]);

  if (!lesson || !step) {
    return (
      <div className="page">
        <p>Licao nao encontrada. <Link to="/learn">Voltar</Link></p>
      </div>
    );
  }

  const isLast = stepIdx === lesson.steps.length - 1;

  const next = () => {
    completeStep(lesson.id, `${lesson.id}-${stepIdx}`, lesson.steps.length);
    if (!isLast) setStepIdx((i) => i + 1);
  };

  return (
    <div className="page">
      <div className="page-title">
        <Link to="/learn" className="tag">← Trilhas</Link>
        <h1>{lesson.titlePt}</h1>
      </div>
      <div className="two-col" style={{ marginTop: 16 }}>
        <div>
          <div style={{ color: 'var(--text-2)', fontSize: 12, marginBottom: 6 }}>
            Passo {stepIdx + 1} de {lesson.steps.length}
          </div>
          <h2 style={{ fontSize: 18 }}>{step.titlePt}</h2>
          <p style={{ color: 'var(--text-1)', lineHeight: 1.7 }}>{step.bodyPt}</p>

          {step.quiz && (
            <div className="card" style={{ marginTop: 12 }}>
              <strong>{step.quiz.questionPt}</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {step.quiz.options.map((o, i) => (
                  <button
                    key={i}
                    className={`btn${quizAnswer === i ? (i === step.quiz!.correctIndex ? ' active' : ' danger') : ''}`}
                    onClick={() => setQuizAnswer(i)}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {quizAnswer !== null && (
                <p style={{ marginTop: 8, color: quizAnswer === step.quiz.correctIndex ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {quizAnswer === step.quiz.correctIndex ? 'Correto!' : 'Tente novamente.'}
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => Math.max(0, i - 1))}>
              Anterior
            </button>
            {!isLast ? (
              <button className="btn primary" onClick={next}>Proximo</button>
            ) : (
              <button className="btn primary" onClick={next}>Concluir licao</button>
            )}
          </div>
        </div>

        <div style={{ position: 'relative', height: 420, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <EngineScene />
        </div>
      </div>
    </div>
  );
}
