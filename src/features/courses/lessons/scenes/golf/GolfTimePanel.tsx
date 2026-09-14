import { useEffect, useRef, useState } from 'react';
import { ChevronsLeft, ChevronsRight, Timer } from 'lucide-react';
import { GOLF_TIME, TIME_RATES, TIME_STEPS, formatStopwatch, resetTimeline } from './golfTimeline';

const stepLabel = (seconds: number) => `${seconds > 0 ? '+' : '-'}${Math.abs(seconds)} s`;

export function GolfTimePanel() {
  const display = useRef<HTMLOutputElement>(null);
  const [rate, setRate] = useState(GOLF_TIME.rate);
  const [sync, setSync] = useState(GOLF_TIME.sync);
  useEffect(() => {
    resetTimeline();
    let handle = requestAnimationFrame(function tick() {
      if (display.current) display.current.textContent = formatStopwatch(GOLF_TIME.time);
      handle = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(handle);
  }, []);
  return <div className="golf-timeline">
    <span className="golf-timeline-title"><Timer size={15} /> Tempo do laboratorio</span>
    <output ref={display} className="golf-stopwatch" aria-label="Cronometro do laboratorio">00:00:00.000</output>
    <div className="golf-timeline-steps">
      {TIME_STEPS.map(step => <button key={step} type="button" title={`Mover ${stepLabel(step)} na linha do tempo`} aria-label={`Mover ${stepLabel(step)} na linha do tempo`} onClick={() => { GOLF_TIME.seek += step; }}>
        {step < 0 && <ChevronsLeft size={13} />}{stepLabel(step)}{step > 0 && <ChevronsRight size={13} />}
      </button>)}
    </div>
    <label className="golf-select"><span>Velocidade do tempo</span>
      <select aria-label="Velocidade do tempo" value={rate} onChange={event => { const value = Number(event.target.value); GOLF_TIME.rate = value; setRate(value); }}>
        {TIME_RATES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
    <label className="golf-check"><input type="checkbox" checked={sync} onChange={event => { GOLF_TIME.sync = event.target.checked; setSync(event.target.checked); }} /> Sincronizar com a rotacao</label>
    <button type="button" className="golf-service" onClick={() => resetTimeline()}>Zerar cronometro</button>
  </div>;
}
