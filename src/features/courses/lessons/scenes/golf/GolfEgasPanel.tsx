import { RotateCcw } from 'lucide-react';
import { initialEgas, sampleEgas, type EgasFault, type EgasState } from './golfEgas';
import { FUSE_CIRCUITS, type FuseCircuit } from './golfElectrical';
import { sampleGolf, type GolfClock } from './golfPhysics';
import type { EgasFocus } from './GolfEgasInspection';

const statusLabels: Record<string, string> = { unpowered: 'Sem alimentacao', 'pedal-fault': 'Sinal do pedal invalido', 'position-fault': 'Retorno invalido', 'motor-open': 'Circuito do motor aberto', tracking: 'Controle ativo' };

export function GolfEgasPanel({ clock, change, changeFuse, focus, setFocus }: { clock: GolfClock; change: (update: (current: EgasState) => EgasState) => void; changeFuse: (fuse: FuseCircuit | null) => void; focus: EgasFocus; setFocus: (focus: EgasFocus) => void }) {
  const engine = sampleGolf(clock);
  const state = clock.egas;
  const sample = sampleEgas({ ...state, opening: engine.throttle }, engine.electrical.ecu);
  return <div className="golf-egas-panel">
    <h3>Acelerador / EGAS</h3>
    <label className="golf-select"><span>Vista</span><select aria-label="Vista do acelerador" value={focus} onChange={event => setFocus(event.target.value as EgasFocus)}><option value="circuit">Pedal / ECU / TBI</option><option value="pedal">Pedal interno</option><option value="throttle">Corpo de borboleta</option></select></label>
    <div className="golf-switches"><label><input type="checkbox" checked={state.enabled} onChange={event => change(current => ({ ...current, enabled: event.target.checked, opening: engine.throttle }))} />Comando pelo pedal</label></div>
    <label className="golf-brake-pedal-input"><span>Acelerador <output>{Math.round(sample.pedal * 100)}%</output></span><input type="range" min={0} max={100} aria-label="Pedal do acelerador" value={Math.round(sample.pedal * 100)} onChange={event => change(current => ({ ...current, enabled: true, pedal: Number(event.target.value) / 100, opening: current.enabled ? current.opening : engine.throttle }))} /></label>
    <output aria-label="Estado do EGAS">{state.enabled ? statusLabels[sample.status] : 'Modo de operacao predefinido'}</output>
    <dl className="golf-values"><div><dt>ECU / referencia</dt><dd>{sample.referenceV.toFixed(1)} V</dd></div><div><dt>Pedal / pista 1</dt><dd><output aria-label="Sinal pedal 1">{sample.signal1V.toFixed(2)}</output> V</dd></div><div><dt>Pedal / pista 2</dt><dd>{sample.signal2V.toFixed(2)} V</dd></div><div><dt>Abertura comandada</dt><dd>{state.enabled ? (sample.target * 100).toFixed(1) : (engine.throttle * 100).toFixed(1)}%</dd></div><div><dt>Abertura real</dt><dd><output aria-label="Abertura real TBI">{(engine.throttle * 100).toFixed(1)}</output>%</dd></div><div><dt>Retorno / pista 1</dt><dd>{sample.position1V.toFixed(2)} V</dd></div><div><dt>Retorno / pista 2</dt><dd>{sample.position2V.toFixed(2)} V</dd></div><div><dt>Comando do motor</dt><dd>{state.enabled ? (sample.motorCommand * 100).toFixed(0) : '--'}%</dd></div></dl>
    <label className="golf-select"><span>Falha do circuito</span><select aria-label="Falha do acelerador" value={state.fault} onChange={event => change(current => ({ ...current, fault: event.target.value as EgasFault }))}><option value="none">Nenhuma</option><option value="pedal-signal">Pista 2 do pedal aberta</option><option value="reference">Referencia interrompida</option><option value="motor-wire">Condutor do motor aberto</option><option value="position-signal">Retorno 2 da TBI aberto</option></select></label>
    <label className="golf-select"><span>Fusivel aberto</span><select aria-label="Fusivel do acelerador" value={clock.openFuse ?? ''} onChange={event => changeFuse((event.target.value || null) as FuseCircuit | null)}><option value="">Nenhum</option>{FUSE_CIRCUITS.map(fuse => <option key={fuse.id} value={fuse.id}>{fuse.label}</option>)}</select></label>
    <button type="button" className="golf-service" onClick={() => change(initialEgas)}><RotateCcw size={16} />Restaurar modo predefinido</button>
    <dl className="golf-values"><div><dt>Pinagem / curvas VW</dt><dd>Nao confirmadas</dd></div><div><dt>Controle manual</dt><dd>Homogeneo didatico</dd></div><div><dt>RPM / torque</dt><dd>Preset / nao acoplado</dd></div><div><dt>Retorno de seguranca</dt><dd>Modelo estimado</dd></div></dl>
  </div>;
}