import { Play, RotateCcw } from 'lucide-react';
import { initialBrakes, launchBrakeBench, sampleBrakes, type BrakeFault, type BrakeState } from './golfBrakeHydraulics';
import type { VehicleWheelId } from './golfVehicleGeometry';

export type BrakeFocus = 'circuit' | 'pedal' | VehicleWheelId;
const BRAKE_VIEW_LABELS: Record<BrakeFocus, string> = { circuit: 'Circuito completo', pedal: 'Pedal e cilindro mestre', 'front-left': 'Dianteira esquerda', 'front-right': 'Dianteira direita', 'rear-left': 'Traseira esquerda', 'rear-right': 'Traseira direita' };

export function GolfBrakePanel({ state, change, focus, setFocus }: { state: BrakeState; change: (update: (current: BrakeState) => BrakeState, resume?: boolean) => void; focus: BrakeFocus; setFocus: (focus: BrakeFocus) => void }) {
  const sample = sampleBrakes(state);
  return <div className="golf-brake-panel">
    <h3>Freios / bancada</h3>
    <label className="golf-select"><span>Vista</span><select aria-label="Vista dos freios" value={focus} onChange={event => setFocus(event.target.value as BrakeFocus)}>{Object.entries(BRAKE_VIEW_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label className="golf-brake-pedal-input"><span>Pedal <output>{Math.round(sample.pedal * 100)}%</output></span><input type="range" aria-label="Pedal de freio" min={0} max={100} value={Math.round(sample.pedal * 100)} onChange={event => change(current => ({ ...current, pedal: Number(event.target.value) / 100 }))} /></label>
    <div className="golf-switches"><label><input type="checkbox" checked={state.assisted} onChange={event => change(current => ({ ...current, assisted: event.target.checked }))} />Servo com assistencia</label></div>
    <label className="golf-select"><span>Vazamento</span><select aria-label="Vazamento de freio" value={state.fault} onChange={event => change(current => ({ ...current, fault: event.target.value as BrakeFault }))}><option value="none">Nenhum</option><option value="primary">Circuito A / DE + TD</option><option value="secondary">Circuito B / DD + TE</option></select></label>
    <dl className="golf-values"><div><dt>Forca no pedal</dt><dd>{sample.pedalForceN.toFixed(0)} N</dd></div><div><dt>Circuito A</dt><dd><output aria-label="Pressao circuito A">{state.primaryBar.toFixed(1)}</output> bar</dd></div><div><dt>Circuito B</dt><dd><output aria-label="Pressao circuito B">{state.secondaryBar.toFixed(1)}</output> bar</dd></div><div><dt>Curso do mestre</dt><dd>{sample.masterTravelMm.toFixed(1)} mm</dd></div></dl>
    <div className="golf-brake-actions"><button type="button" className="golf-service" onClick={() => change(current => launchBrakeBench(current), true)}><Play size={15} />Lancar a 30 km/h</button><button type="button" className="golf-icon" aria-label="Reiniciar freios" title="Reiniciar freios" onClick={() => change(initialBrakes)}><RotateCcw size={16} /></button></div>
    <dl className="golf-values"><div><dt>Velocidade da bancada</dt><dd><output aria-label="Velocidade da bancada">{(state.speedMps * 3.6).toFixed(1)}</output> km/h</dd></div><div><dt>Distancia percorrida</dt><dd>{state.distanceM.toFixed(2)} m</dd></div><div><dt>Energia dissipada</dt><dd>{(state.dissipatedJ / 1000).toFixed(1)} kJ</dd></div></dl>
    <table className="golf-brake-table"><caption>Torque nas rodas / Nm</caption><thead><tr><th>Roda</th><th>Circuito</th><th>Torque</th></tr></thead><tbody>{sample.wheels.map(wheel => <tr key={wheel.id}><th>{BRAKE_VIEW_LABELS[wheel.id]}</th><td>{wheel.circuit === 'primary' ? 'A' : 'B'}</td><td>{wheel.torqueNm.toFixed(0)}</td></tr>)}</tbody></table>
    <dl className="golf-values"><div><dt>Parametros / PR</dt><dd>Estimados / pendente</dd></div><div><dt>Tempo da bancada</dt><dd>Real</dd></div><div><dt>ABS / carga dinamica</dt><dd>Nao simulados</dd></div><div><dt>Acoplamento ao motor</dt><dd>Nao simulado</dd></div></dl>
  </div>;
}