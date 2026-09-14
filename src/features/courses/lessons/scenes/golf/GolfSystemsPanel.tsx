import { Eye, EyeOff, Power } from 'lucide-react';
import { SYSTEM_GROUPS, SYSTEM_TOGGLES, type SystemFlags, type SystemId } from './golfSystemToggles';

interface Props {
  power: SystemFlags;
  visible: SystemFlags;
  onPower: (id: SystemId, value: boolean) => void;
  onVisible: (id: SystemId, value: boolean) => void;
  onAllPower: (value: boolean) => void;
  onAllVisible: (value: boolean) => void;
}

const OFF_REASON = 'Sistema desligado: circuito aberto na simulacao';

export function GolfSystemsPanel({ power, visible, onPower, onVisible, onAllPower, onAllVisible }: Props) {
  const poweredCount = SYSTEM_TOGGLES.filter(system => power[system.id]).length;
  const visibleCount = SYSTEM_TOGGLES.filter(system => system.visual !== false && visible[system.id]).length;
  const visualTotal = SYSTEM_TOGGLES.filter(system => system.visual !== false).length;
  return <div className="golf-systems-panel">
    <p>Cada sistema tem um interruptor de energia, que muda a simulacao, e um olho, que apenas mostra ou esconde a geometria.</p>
    <div className="golf-systems-actions">
      <button type="button" className="golf-service" onClick={() => onAllPower(true)}><Power size={16} />Ligar tudo</button>
      <button type="button" className="golf-service" onClick={() => onAllPower(false)}><Power size={16} />Desligar tudo</button>
      <button type="button" className="golf-service" onClick={() => onAllVisible(true)}><Eye size={16} />Mostrar tudo</button>
      <button type="button" className="golf-service" onClick={() => onAllVisible(false)}><EyeOff size={16} />Ocultar tudo</button>
    </div>
    {SYSTEM_GROUPS.map(group => <section key={group} className="golf-systems-group">
      <h4>{group}</h4>
      <ul>
        {SYSTEM_TOGGLES.filter(system => system.group === group).map(system => <li key={system.id} data-off={power[system.id] ? undefined : 'true'}>
          <button
            type="button"
            className="golf-systems-power"
            aria-pressed={power[system.id]}
            aria-label={`${power[system.id] ? 'Desligar' : 'Ligar'} ${system.label}`}
            title={system.fuse ? `Circuito do fusivel ${system.fuse}` : 'Comando direto do sistema'}
            onClick={() => onPower(system.id, !power[system.id])}
          ><Power size={15} /></button>
          <span className="golf-systems-label">{system.label}</span>
          <span className="golf-systems-state">{power[system.id] ? 'Ligado' : 'Desligado'}</span>
          {system.visual === false
            ? <span className="golf-systems-noeye" title="Circuito sem geometria propria para ocultar">&mdash;</span>
            : <button
              type="button"
              className="golf-icon"
              aria-pressed={visible[system.id]}
              aria-label={`${visible[system.id] ? 'Ocultar' : 'Mostrar'} ${system.label}`}
              title={visible[system.id] ? 'Ocultar no 3D' : 'Mostrar no 3D'}
              onClick={() => onVisible(system.id, !visible[system.id])}
            >{visible[system.id] ? <Eye size={15} /> : <EyeOff size={15} />}</button>}
        </li>)}
      </ul>
    </section>)}
    <dl className="golf-values">
      <div><dt>Sistemas ligados</dt><dd>{poweredCount} de {SYSTEM_TOGGLES.length}</dd></div>
      <div><dt>Sistemas visiveis</dt><dd>{visibleCount} de {visualTotal}</dd></div>
    </dl>
    {poweredCount < SYSTEM_TOGGLES.length && <p className="golf-systems-note">{OFF_REASON}</p>}
  </div>;
}
