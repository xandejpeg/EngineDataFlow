import { RotateCcw, SkipForward } from 'lucide-react';
import { advanceWipers, initialWipers, sampleWipers, type WiperFault, type WiperMode } from './golfWipers';
import { wiperSupply, type GolfClock } from './golfPhysics';

export type WiperFocus = 'circuit' | 'stalk' | 'mechanism';
export function GolfWiperPanel({ clock, focus, setFocus, change }: { clock: GolfClock; focus: WiperFocus; setFocus: (focus: WiperFocus) => void; change: (update: (clock: GolfClock) => GolfClock) => void }) {
  const state = clock.wipers;
  const sample = sampleWipers(state, wiperSupply(clock));
  const status = { unpowered: 'Sem alimentacao', motor: 'Circuito do motor aberto', linkage: 'Biela desacoplada', park: 'Retorno de repouso aberto', parking: 'Retornando ao repouso', wiping: 'Varredura', parked: 'Em repouso' };
  return <div className="golf-wiper-panel">
    <h3>Limpadores dianteiros</h3>
    <output aria-label="Estado dos limpadores">{status[sample.status as keyof typeof status]}</output>
    <label className="golf-select"><span>Vista</span><select aria-label="Vista dos limpadores" value={focus} onChange={event => setFocus(event.target.value as WiperFocus)}><option value="circuit">Circuito completo</option><option value="stalk">Comando da coluna</option><option value="mechanism">Motor e mecanismo</option></select></label>
    <label className="golf-select"><span>Comando</span><select aria-label="Modo dos limpadores" value={state.mode} onChange={event => change(current => ({ ...current, wipers: { ...current.wipers, mode: event.target.value as WiperMode } }))}><option value="off">Desligado</option><option value="intermittent">Intermitente</option><option value="low">Velocidade baixa</option><option value="high">Velocidade alta</option></select></label>
    <dl className="golf-values">
      <div><dt>Alimentacao</dt><dd>{sample.supply ? 'Disponivel' : 'Cortada'}</dd></div>
      <div><dt>Motor</dt><dd>{sample.cyclesPerMinute} ciclos/min</dd></div>
      <div><dt>Palhetas</dt><dd>{(sample.sweep * 180 / Math.PI).toFixed(1)} graus</dd></div>
      <div><dt>Contato de repouso</dt><dd>{sample.parkContact ? 'Fechado' : 'Aberto'}</dd></div>
      <div><dt>Intervalo restante</dt><dd>{state.interval.toFixed(1)} s</dd></div>
      <div><dt>Ciclos do motor</dt><dd>{state.cycles}</dd></div>
      <div><dt>Comando do lavador</dt><dd>{sample.washerPowered ? 'Ligado' : 'Desligado'}</dd></div>
      <div><dt>Retornos apos lavagem</dt><dd>{state.afterWash}</dd></div>
    </dl>
    <div className="golf-switches">
      <label><input type="checkbox" checked={state.washing} onChange={event => change(current => ({ ...current, wipers: { ...current.wipers, washing: event.target.checked } }))} />Comando de lavagem</label>
      <label><input type="checkbox" checked={state.fuseOpen} onChange={event => change(current => ({ ...current, wipers: { ...current.wipers, fuseOpen: event.target.checked } }))} />Fusivel dos limpadores aberto</label>
    </div>
    <label className="golf-select"><span>Falha</span><select aria-label="Falha dos limpadores" value={state.fault} onChange={event => change(current => ({ ...current, wipers: { ...current.wipers, fault: event.target.value as WiperFault } }))}><option value="none">Nenhuma</option><option value="motor">Motor sem continuidade</option><option value="linkage">Biela desacoplada</option><option value="park">Contato de repouso aberto</option></select></label>
    <button type="button" className="golf-service" onClick={() => change(current => ({ ...current, wipers: advanceWipers(current.wipers, wiperSupply(current), 0.25) }))}><SkipForward size={16} />Avancar 0,25 s</button>
    <button type="button" className="golf-service" onClick={() => change(current => ({ ...current, wipers: initialWipers() }))}><RotateCcw size={16} />Reiniciar limpadores</button>
    <dl className="golf-values"><div><dt>Geometria / velocidades</dt><dd>Estimadas</dd></div><div><dt>Modulo / pinagem VW</dt><dd>Nao confirmados</dd></div><div><dt>Corrente / rede CAN-LIN</dt><dd>Nao simuladas</dd></div><div><dt>Agua / sensor de chuva</dt><dd>Nao simulados</dd></div><div><dt>Limpador traseiro</dt><dd>Nao integrado</dd></div></dl>
  </div>;
}