import { useState } from 'react';
import { useTelemetry } from '@/components/useTelemetry';
import { fmt } from '@/simulation/format';
import { FLUID_COLORS } from '@/styles/colors';
import '../pages.css';

export function DataFlowPage() {
  const frame = useTelemetry();
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  if (!frame) return <div className="page"><p>Carregando...</p></div>;

  const sensor = frame.sensors.find((s) => s.id === selectedSensor);

  return (
    <div className="page">
      <div className="page-title">
        <h1>Data Flow</h1>
      </div>
      <p className="page-subtitle">
        Fluxo de dados: sensores → ECU → atuadores → resposta mecanica e termica de volta aos
        sensores. Selecione um sensor para ver detalhes.
      </p>

      <div className="two-col" style={{ marginTop: 16 }}>
        <section className="section" style={{ marginTop: 0 }}>
          <h2 style={{ color: FLUID_COLORS.data }}>Sensores (entradas)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {frame.sensors.map((s) => (
              <button
                key={s.id}
                className={`btn${selectedSensor === s.id ? ' active' : ''}`}
                style={{ justifyContent: 'space-between' }}
                onClick={() => setSelectedSensor(s.id)}
              >
                <span>{s.labelPt}</span>
                <span className="mono">{fmt.n2(s.value)} {s.unit}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section" style={{ marginTop: 0 }}>
          <h2 style={{ color: FLUID_COLORS.normal }}>Atuadores (saidas da ECU)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {frame.actuators.map((a) => (
              <div key={a.id} className="card" style={{ padding: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{a.labelPt}</strong>
                  <span className="mono">{fmt.n2(a.value)} {a.unit}</span>
                </div>
                <p style={{ fontSize: 11.5, marginTop: 4 }}>{a.source}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {sensor && (
        <section className="section">
          <h2>Detalhe do sensor</h2>
          <dl className="kv">
            <dt>Grandeza</dt><dd>{sensor.quantity}</dd>
            <dt>Unidade</dt><dd>{sensor.unit}</dd>
            <dt>Valor atual</dt><dd className="mono">{fmt.n2(sensor.value)} {sensor.unit}</dd>
            <dt>Frequencia didatica</dt><dd>{sensor.updateHz} Hz</dd>
            <dt>Consumidores</dt><dd>{sensor.consumers.join(', ')}</dd>
          </dl>
        </section>
      )}

      <section className="section">
        <h2>Linha do tempo de eventos por ciclo</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {frame.events.map((e, i) => (
            <span key={i} className="tag info">
              {Math.round(e.angleDeg)}° · {e.labelPt}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
