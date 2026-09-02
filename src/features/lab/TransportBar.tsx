import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { useSimulationStore, type SpeedScale } from '@/state/simulationStore';
import { useTelemetry } from '@/components/useTelemetry';
import { Segmented } from '@/components/ui/controls';

const SPEEDS: SpeedScale[] = [0.1, 0.25, 0.5, 1, 2];
const STEPS = [1, 5, 10];

export function TransportBar() {
  const running = useSimulationStore((s) => s.running);
  const speed = useSimulationStore((s) => s.speedScale);
  const crankAngle = useSimulationStore((s) => s.crankAngleDeg);
  const toggleRunning = useSimulationStore((s) => s.toggleRunning);
  const setSpeed = useSimulationStore((s) => s.setSpeed);
  const setCrankAngle = useSimulationStore((s) => s.setCrankAngle);
  const stepAngle = useSimulationStore((s) => s.stepAngle);
  const restoreNormal = useSimulationStore((s) => s.restoreNormal);
  const frame = useTelemetry();

  const events = frame?.events ?? [];

  return (
    <div className="transport">
      <div className="transport-controls">
        <button className="btn primary" onClick={toggleRunning} aria-label={running ? 'Pausar' : 'Ligar'}>
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? 'Pausar' : 'Ligar'}
        </button>
        <button className="btn" onClick={() => restoreNormal()} aria-label="Restaurar" title="Restaurar normal">
          <RotateCcw size={15} />
        </button>
        <div className="step-group" role="group" aria-label="Passo de angulo">
          <button className="btn" onClick={() => stepAngle(-1)} aria-label="Voltar 1 grau"><SkipBack size={14} /></button>
          {STEPS.map((s) => (
            <button key={s} className="btn" onClick={() => stepAngle(s)} aria-label={`Avancar ${s} graus`}>+{s}°</button>
          ))}
          <button className="btn" onClick={() => stepAngle(1)} aria-label="Avancar 1 grau"><SkipForward size={14} /></button>
        </div>
        <Segmented
          ariaLabel="Velocidade"
          value={speed}
          onChange={(v) => setSpeed(v)}
          options={SPEEDS.map((s) => ({ label: `${s}x`, value: s }))}
        />
      </div>

      <div className="scrubber-wrap">
        <span className="mono scrubber-angle">{Math.round(crankAngle)}° / 720°</span>
        <div className="scrubber">
          <input
            type="range"
            min={0}
            max={720}
            step={1}
            value={crankAngle}
            aria-label="Angulo do virabrequim 0 a 720 graus"
            onChange={(e) => setCrankAngle(parseFloat(e.target.value))}
          />
          {events
            .filter((e) => e.kind === 'spark')
            .map((e, i) => (
              <span
                key={i}
                className="event-tick"
                style={{ left: `${(e.angleDeg / 720) * 100}%` }}
                title={e.labelPt}
                onClick={() => setCrankAngle(e.angleDeg)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
