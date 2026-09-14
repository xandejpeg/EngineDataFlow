import { RotateCcw, SkipForward } from 'lucide-react';
import { initialCooling, type CoolingFault } from './golfCooling';
import { advanceCoolingClock, coolingSample, type GolfClock } from './golfPhysics';
import type { CoolingFocus } from './GolfCoolingInspection';

export function GolfCoolingPanel({ clock, change, focus, setFocus }: { clock: GolfClock; change: (update: (clock: GolfClock) => GolfClock) => void; focus: CoolingFocus; setFocus: (focus: CoolingFocus) => void }) {
  const state = clock.cooling;
  const sample = coolingSample(clock);
  return <div className="golf-cooling-panel">
    <h3>Arrefecimento</h3>
    <label className="golf-select"><span>Componente</span><select aria-label="Vista do arrefecimento" value={focus} onChange={event => setFocus(event.target.value as CoolingFocus)}><option value="circuit">Circuito completo</option><option value="thermostat">Termostato</option><option value="pump">Bomba</option><option value="radiator">Radiador e ventoinha</option></select></label>
    <output aria-label="Estado termico" data-warning={sample.warning === 'overheat'}>{sample.warning === 'overheat' ? 'Superaquecimento' : 'Sem alerta termico'}</output>
    <dl className="golf-values">
      <div><dt>Motor / ECT</dt><dd><output aria-label="Temperatura do motor">{clock.temperature.toFixed(1)}</output> C</dd></div>
      <div><dt>Radiador</dt><dd>{state.radiatorC.toFixed(1)} C</dd></div>
      <div><dt>Termostato</dt><dd>{(sample.thermostat * 100).toFixed(0)}%</dd></div>
      <div><dt>Bomba</dt><dd>{sample.pumpLpm.toFixed(1)} L/min</dd></div>
      <div><dt>Radiador / desvio</dt><dd>{sample.radiatorLpm.toFixed(1)} / {sample.bypassLpm.toFixed(1)} L/min</dd></div>
      <div><dt>Aquecedor</dt><dd>{sample.heaterLpm.toFixed(1)} L/min</dd></div>
      <div><dt>Ventoinha</dt><dd>{sample.fanPowered ? 'Ligada' : 'Desligada'}</dd></div>
      <div><dt>Calor recebido</dt><dd>{(sample.heatInputW / 1000).toFixed(1)} kW</dd></div>
      <div><dt>Tempo termico</dt><dd>{state.elapsed.toFixed(0)} s</dd></div>
    </dl>
    <label className="golf-select"><span>Falha</span><select aria-label="Falha de arrefecimento" value={state.fault} onChange={event => change(current => ({ ...current, cooling: { ...current.cooling, fault: event.target.value as CoolingFault } }))}><option value="none">Nenhuma</option><option value="pump">Bomba sem circulacao</option><option value="thermostat-closed">Termostato fechado</option><option value="thermostat-open">Termostato aberto</option><option value="fan">Motor da ventoinha aberto</option></select></label>
    <div className="golf-switches">
      <label><input type="checkbox" checked={state.fanFuseOpen} onChange={event => change(current => ({ ...current, cooling: { ...current.cooling, fanFuseOpen: event.target.checked } }))} />Fusivel da ventoinha aberto</label>
      <label><input type="checkbox" checked={state.heater} onChange={event => change(current => ({ ...current, cooling: { ...current.cooling, heater: event.target.checked } }))} />Aquecedor da cabine</label>
    </div>
    <label className="golf-brake-pedal-input"><span>Ar frontal equivalente <output>{state.airflowKmh} km/h</output></span><input type="range" aria-label="Ar frontal equivalente" min={0} max={100} step={5} value={state.airflowKmh} onChange={event => change(current => ({ ...current, cooling: { ...current.cooling, airflowKmh: Number(event.target.value) } }))} /></label>
    <button type="button" className="golf-service" onClick={() => change(current => advanceCoolingClock(current, 60))}><SkipForward size={16} />Avancar 60 s termicos</button>
    <div className="golf-brake-actions">
      <button type="button" className="golf-service" onClick={() => change(current => ({ ...current, temperature: 20, cooling: initialCooling(false) }))}><RotateCcw size={15} />Ensaio frio</button>
      <button type="button" className="golf-service" onClick={() => change(current => ({ ...current, temperature: 110, cooling: { ...initialCooling(), radiatorC: 95 } }))}><RotateCcw size={15} />Ensaio quente</button>
    </div>
    <dl className="golf-values"><div><dt>Curvas / circuito VW</dt><dd>Nao confirmados</dd></div><div><dt>Balanco termico</dt><dd>Dois volumes</dd></div><div><dt>Pressao / ebulicao</dt><dd>Nao simuladas</dd></div><div><dt>Pos-chave / AC</dt><dd>Nao integrados</dd></div><div><dt>Ar frontal</dt><dd>Bancada independente</dd></div></dl>
  </div>;
}