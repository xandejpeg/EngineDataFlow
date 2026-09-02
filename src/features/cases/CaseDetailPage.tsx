import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CASE_STUDIES_BY_ID } from '@/data/caseStudies.pt-BR';
import { FAULTS_BY_ID } from '@/data/faults.pt-BR';
import { EngineScene } from '@/engine3d/EngineScene';
import { useSimulationStore } from '@/state/simulationStore';
import { useLearningStore } from '@/state/learningStore';
import { useTelemetry } from '@/components/useTelemetry';
import { fmt } from '@/simulation/format';
import { riskColor } from '@/styles/colors';
import '../pages.css';

export function CaseDetailPage() {
  const { caseId } = useParams();
  const study = caseId ? CASE_STUDIES_BY_ID[caseId] : undefined;
  const fault = study?.faultId ? FAULTS_BY_ID[study.faultId] : null;
  const setFaults = useSimulationStore((s) => s.setFaults);
  const setRunning = useSimulationStore((s) => s.setRunning);
  const recordResult = useLearningStore((s) => s.recordCaseResult);
  const frame = useTelemetry();

  const [selected, setSelected] = useState<string | null>(null);
  const [revealTests, setRevealTests] = useState(false);
  const [repaired, setRepaired] = useState(false);

  useEffect(() => {
    if (!study) return;
    setFaults(study.faultId ? [study.faultId] : []);
    setRunning(true);
    setSelected(null);
    setRepaired(false);
    setRevealTests(false);
    return () => setFaults([]);
  }, [study, setFaults, setRunning]);

  if (!study) {
    return (
      <div className="page">
        <p>Caso nao encontrado. <Link to="/cases">Voltar</Link></p>
      </div>
    );
  }

  const chosen = study.hypotheses.find((h) => h.id === selected);
  const answered = selected !== null;

  const applyRepair = () => {
    setFaults([]);
    setRepaired(true);
    const correct = chosen?.correct ?? false;
    recordResult(study.id, correct ? 100 : 40, true);
  };

  return (
    <div className="page">
      <div className="page-title">
        <Link to="/cases" className="tag">← Casos</Link>
        <h1>{study.titlePt}</h1>
      </div>
      <p className="page-subtitle">{study.narrativePt}</p>

      <div className="two-col" style={{ marginTop: 16 }}>
        <div style={{ position: 'relative', height: 380, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <EngineScene />
        </div>

        <div>
          <section className="section" style={{ marginTop: 0 }}>
            <h2>Dados ao vivo</h2>
            {frame && (
              <div className="stat-grid">
                <div className="stat"><div className="stat-label">Torque</div><div className="stat-value mono">{fmt.n1(frame.performance.torqueMeanNm)}</div></div>
                <div className="stat"><div className="stat-label">Liquido °C</div><div className="stat-value mono">{fmt.celsius(frame.cooling.coolantTempK)}</div></div>
                <div className="stat"><div className="stat-label">Oleo bar</div><div className="stat-value mono">{fmt.bar(frame.lubrication.oilPressurePa)}</div></div>
                <div className="stat"><div className="stat-label">Knock</div><div className="stat-value mono" style={{ color: riskColor(frame.combustionQuality.knockRisk) }}>{fmt.pct(frame.combustionQuality.knockRisk)}</div></div>
                <div className="stat"><div className="stat-label">Lambda</div><div className="stat-value mono">{fmt.n2(frame.mixture.lambda)}</div></div>
                <div className="stat"><div className="stat-label">Misfire</div><div className="stat-value mono">{fmt.pct(frame.ignition.misfireIntensity)}</div></div>
              </div>
            )}
          </section>

          <section className="section">
            <h2>Sintomas</h2>
            <ul className="list-clean">
              {study.symptomsPt.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </section>

          <section className="section">
            <h2>Testes virtuais</h2>
            <button className="btn" onClick={() => setRevealTests((v) => !v)}>
              {revealTests ? 'Ocultar' : 'Executar testes'}
            </button>
            {revealTests && (
              <ul className="list-clean" style={{ marginTop: 8 }}>
                {study.virtualTestsPt.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
          </section>
        </div>
      </div>

      <section className="section">
        <h2>Selecione a hipotese</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {study.hypotheses.map((h) => (
            <button
              key={h.id}
              className={`btn${selected === h.id ? (h.correct ? ' active' : ' danger') : ''}`}
              onClick={() => setSelected(h.id)}
            >
              {h.labelPt}
            </button>
          ))}
        </div>
        {answered && chosen && (
          <div className="card" style={{ marginTop: 12 }}>
            <strong style={{ color: chosen.correct ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {chosen.correct ? 'Hipotese correta' : 'Hipotese incorreta'}
            </strong>
            <p style={{ marginTop: 6, color: 'var(--text-1)' }}>{chosen.explanationPt}</p>
          </div>
        )}
      </section>

      {answered && (
        <section className="section">
          <h2>Cadeia causal</h2>
          <p className="mono" style={{ color: 'var(--text-1)', fontSize: 13 }}>
            {study.causalChainPt.join('  →  ')}
          </p>
          <button className="btn primary" style={{ marginTop: 10 }} onClick={applyRepair} disabled={repaired}>
            {repaired ? 'Reparo aplicado' : 'Aplicar reparo virtual'}
          </button>
          {repaired && (
            <p style={{ marginTop: 10, color: 'var(--text-1)' }}>
              <strong>Reparo:</strong> {study.repairPt} Compare os dados ao vivo agora, com a falha
              removida, com o estado anterior.
            </p>
          )}
          {fault && (
            <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
              Prevencao: {fault.preventionPt} · Confianca da inferencia: {fmt.pct(fault.inferenceConfidence)} ·
              Efeito {fault.effectKind === 'calculated' ? 'calculado' : 'heuristico'}.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
