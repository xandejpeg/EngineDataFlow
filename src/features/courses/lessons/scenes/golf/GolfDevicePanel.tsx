import { Cpu, Zap } from 'lucide-react';
import { DEVICE_FILTERS, DEVICE_KINDS, golfDevices, TERMINAL_ROLES, type DeviceFilter, type DeviceKind } from './golfDevices';

export function GolfDevicePanel({ filter, setFilter, byRole, setByRole, labels, setLabels, selected, select }: {
  filter: DeviceFilter; setFilter: (value: DeviceFilter) => void;
  byRole: boolean; setByRole: (value: boolean) => void;
  labels: boolean; setLabels: (value: boolean) => void;
  selected: string | null; select: (id: string | null) => void;
}) {
  const devices = golfDevices();
  const listed = devices.filter(device => filter === 'all' || device.kind === filter);
  const active = devices.find(device => device.id === selected) ?? null;
  const count = (kind: DeviceKind) => devices.filter(device => device.kind === kind).length;
  return <div className="golf-device-panel">
    <h3>Sensores e atuadores</h3>
    <div className="golf-segments" role="group" aria-label="Filtro de componentes">
      {DEVICE_FILTERS.map(option => <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => { setFilter(option.id); select(null); }}>{option.label}</button>)}
    </div>
    <p>{count('sensor')} sensores e {count('actuator')} atuadores com fiacao desenhada. Cada ponta mostra o cobre descascado e a luva de crimpagem no ponto de contato.</p>
    <div className="golf-switches">
      <label><input type="checkbox" checked={byRole} onChange={event => setByRole(event.target.checked)} />Colorir por funcao do fio</label>
      <label><input type="checkbox" checked={labels} onChange={event => setLabels(event.target.checked)} />Etiquetas na cena</label>
    </div>
    <ul className="golf-device-legend">
      {Object.entries(TERMINAL_ROLES).map(([role, meta]) => <li key={role}><i style={{ background: meta.color }} aria-hidden="true">{meta.sign}</i>{meta.label}</li>)}
    </ul>
    <ul className="golf-device-list">
      {listed.map(device => <li key={device.id}>
        <button type="button" aria-pressed={selected === device.id} onClick={() => select(selected === device.id ? null : device.id)}>
          {device.kind === 'sensor' ? <Cpu size={14} /> : <Zap size={14} />}
          <span>
            <strong>{device.code} <b>{device.name}</b></strong>
            <small>{device.job}</small>
          </span>
          <em>{device.terminals.length} vias</em>
        </button>
      </li>)}
    </ul>
    {active && <div className="golf-device-detail">
      <h4>{active.code} &middot; {active.name} <small>{DEVICE_KINDS[active.kind].label} / {active.system}</small></h4>
      <p className="golf-device-job">{active.job}</p>
      <p>{active.principle}</p>
      <table>
        <thead><tr><th>Via</th><th>Cor</th><th>Chega em</th></tr></thead>
        <tbody>
          {active.terminals.map(terminal => <tr key={terminal.id}>
            <td><i style={{ background: TERMINAL_ROLES[terminal.role].color }} aria-hidden="true">{TERMINAL_ROLES[terminal.role].sign}</i>{terminal.pin}. {terminal.via}</td>
            <td><i style={{ background: terminal.color }} aria-hidden="true" />{terminal.colorName}</td>
            <td>{terminal.farLabel}</td>
          </tr>)}
        </tbody>
      </table>
      <p className="golf-device-note">Vias numeradas como no conector desenhado, nao e a pinagem de fabrica. Cores pela convencao DIN/VW.</p>
    </div>}
  </div>;
}
