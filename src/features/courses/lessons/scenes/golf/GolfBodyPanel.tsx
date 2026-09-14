import { ArrowDown, ArrowUp, DoorOpen, Lock, Unlock, Play, Lightbulb } from 'lucide-react';
import { advanceBodyControl, commandDoor, commandHatch, commandHood, commandLock, commandProp, commandWindow, DOOR_IDS, sampleBodyControl, type BodyControlState, type BodyPower } from './golfBodyControl';

const labels = { 'front-left': 'Dianteira esquerda', 'front-right': 'Dianteira direita', 'rear-left': 'Traseira esquerda', 'rear-right': 'Traseira direita' };

export function GolfBodyPanel({ state, power, change, night, setNight, braking, setBraking }: {
  state: BodyControlState; power: BodyPower; change: (update: (state: BodyControlState) => BodyControlState) => void;
  night: boolean; setNight: (value: boolean) => void; braking: boolean; setBraking: (value: boolean) => void;
}) {
  const output = sampleBodyControl(state, power);
  return <div className="golf-body-panel">
    <h3>Carroceria</h3>
    <div className="golf-body-actions">
      <button type="button" className="golf-service" disabled={!output.comfort || !state.locked && DOOR_IDS.some(id => state.doors[id].open > 0.01 || state.doors[id].target > 0)} onClick={() => change(current => commandLock(current, !current.locked, power))}>{state.locked ? <Unlock size={16} /> : <Lock size={16} />}{state.locked ? 'Destravar portas' : 'Travar portas'}</button>
      <button type="button" className="golf-service" onClick={() => change(current => advanceBodyControl(current, power, 1))}><Play size={16} />Avancar carroceria 1 s</button>
    </div>
    {DOOR_IDS.map(id => <fieldset key={id}><legend>{labels[id]}</legend>
      <button type="button" className="golf-service" aria-label={`Porta ${labels[id].toLowerCase()}`} aria-pressed={state.doors[id].target > 0} disabled={state.locked && state.doors[id].target === 0} onClick={() => change(current => commandDoor(current, id, current.doors[id].target === 0))}><DoorOpen size={16} />{state.doors[id].target ? 'Fechar' : 'Abrir'}<output>{Math.round(state.doors[id].open * 100)}%</output></button>
      <div className="golf-body-window"><button type="button" className="golf-icon" title="Baixar vidro" aria-label={`Baixar vidro ${labels[id].toLowerCase()}`} disabled={!output.windowPower} onClick={() => change(current => commandWindow(current, id, 0))}><ArrowDown size={16} /></button><input aria-label={`Vidro ${labels[id].toLowerCase()}`} type="range" min="0" max="100" value={Math.round(state.doors[id].windowTarget * 100)} disabled={!output.windowPower} onChange={event => change(current => commandWindow(current, id, Number(event.target.value) / 100))} /><button type="button" className="golf-icon" title="Subir vidro" aria-label={`Subir vidro ${labels[id].toLowerCase()}`} disabled={!output.windowPower} onClick={() => change(current => commandWindow(current, id, 1))}><ArrowUp size={16} /></button><output>{Math.round(state.doors[id].window * 100)}%</output></div>
    </fieldset>)}
    <fieldset><legend>Capo e porta-malas</legend>
      <button type="button" className="golf-service" disabled={state.hoodReleased || state.hood > 0} onClick={() => change(current => ({ ...current, hoodReleased: true }))}>Liberar capo</button>
      <button type="button" className="golf-service" disabled={!state.hoodReleased || state.prop} onClick={() => change(current => commandHood(current, current.hoodTarget === 0))}>{state.hoodTarget ? 'Fechar capo' : 'Abrir capo'}</button>
      <label><input type="checkbox" aria-label="Vareta de sustentacao" checked={state.prop} disabled={state.hood < 0.8} onChange={event => change(current => commandProp(current, event.target.checked))} />Vareta de sustentacao</label>
      <button type="button" className="golf-service" disabled={state.hatchTarget === 0 && (state.locked || !output.comfort)} onClick={() => change(current => commandHatch(current, current.hatchTarget === 0, power))}>{state.hatchTarget ? 'Fechar porta-malas' : 'Abrir porta-malas'}</button>
    </fieldset>
    <fieldset><legend>Iluminacao</legend>
      <label>Farol<select aria-label="Comando dos farois" value={state.lights} onChange={event => change(current => ({ ...current, lights: event.target.value as BodyControlState['lights'] }))}><option value="off">Desligado</option><option value="position">Lanternas</option><option value="low">Baixo</option><option value="high">Alto</option></select></label>
      <label>Setas<select aria-label="Comando das setas" value={state.indicator} onChange={event => change(current => ({ ...current, indicator: event.target.value as BodyControlState['indicator'] }))}><option value="off">Desligadas</option><option value="left">Esquerda</option><option value="right">Direita</option><option value="hazard">Pisca-alerta</option></select></label>
      <label><input type="checkbox" checked={state.fog} onChange={event => change(current => ({ ...current, fog: event.target.checked }))} />Farois de neblina</label>
      <label><input type="checkbox" checked={braking} onChange={event => setBraking(event.target.checked)} />Pedal de freio acionado</label>
      <label><input type="checkbox" checked={night} onChange={event => setNight(event.target.checked)} /><Lightbulb size={14} />Vista noturna</label>
    </fieldset>
    <fieldset><legend>Eletrica de carroceria</legend>
      <label>Falha<select aria-label="Falha eletrica da carroceria" value={state.fault} onChange={event => change(current => ({ ...current, fault: event.target.value as BodyControlState['fault'] }))}><option value="none">Nenhuma</option><option value="lighting-fuse">Fusivel de iluminacao</option><option value="comfort-fuse">Fusivel de conforto</option><option value="left-lamp-open">Farol esquerdo aberto</option></select></label>
      <label><input type="checkbox" checked={state.showWiring} onChange={event => change(current => ({ ...current, showWiring: event.target.checked }))} />Mostrar chicote de carroceria</label>
      <dl className="golf-values"><div><dt>Alimentacao</dt><dd>{output.voltage} V</dd></div><div><dt>Iluminacao estimada</dt><dd>{output.lampCurrent.toFixed(1)} A</dd></div><div><dt>Vidros estimados</dt><dd>{output.windowCurrent.toFixed(1)} A</dd></div><div><dt>Travas</dt><dd>{state.locked ? 'Travadas' : 'Livres'}</dd></div><div><dt>Vidros</dt><dd>{output.windowPower ? 'Alimentados' : 'Sem alimentacao'}</dd></div></dl>
    </fieldset>
  </div>;
}