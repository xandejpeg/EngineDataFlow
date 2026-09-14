import { Fuel, RotateCcw, SkipForward } from 'lucide-react';
import { advanceFuelSender, initialFuelSender, sampleFuelSender, type FuelSenderFault } from './golfFuelSender';
import { FUEL_CONSUMPTION, rangeSeconds, tankLitres } from './golfFuelConsumption';
import { fuelSenderSupply, sampleGolf, type GolfClock } from './golfPhysics';

function duration(seconds: number): string {
  if (!Number.isFinite(seconds)) return 'Sem consumo';
  if (seconds < 90) return `${seconds.toFixed(0)} s`;
  if (seconds < 5400) return `${(seconds / 60).toFixed(1)} min`;
  return `${(seconds / 3600).toFixed(1)} h`;
}

export type FuelFocus = 'circuit' | 'tank' | 'sender' | 'gauge';
export function GolfFuelPanel({ clock, focus, setFocus, change }: { clock: GolfClock; focus: FuelFocus; setFocus: (focus: FuelFocus) => void; change: (update: (clock: GolfClock) => GolfClock) => void }) {
  const state = clock.fuelSender;
  const sample = sampleFuelSender(state, clock.fuel, fuelSenderSupply(clock));
  const engine = sampleGolf(clock);
  const consumption = engine.consumption;
  return <div className="golf-fuel-panel">
    <h3>Nivel de combustivel</h3>
    <output aria-label="Estado do sensor de nivel">{!sample.supply ? 'Instrumento sem alimentacao' : sample.faultLamp ? 'Sinal fora da faixa' : 'Sinal eletrico valido'}</output>
    {engine.dryTank && <output className="golf-fuel-dry" aria-label="Estado do motor por combustivel">Tanque vazio: motor parado</output>}
    <label className="golf-select"><span>Vista</span><select aria-label="Vista do nivel de combustivel" value={focus} onChange={event => setFocus(event.target.value as FuelFocus)}><option value="circuit">Circuito completo</option><option value="tank">Tanque</option><option value="sender">Boia e sensor</option><option value="gauge">Instrumento</option></select></label>
    <label className="golf-brake-pedal-input"><span>Nivel no tanque <output>{(clock.fuel * 100).toFixed(0)}% / {tankLitres(clock.fuel).toFixed(1)} L</output></span><input aria-label="Nivel no tanque" type="range" min={0} max={100} step={1} value={Math.round(clock.fuel * 100)} onChange={event => change(current => ({ ...current, fuel: Number(event.target.value) / 100 }))} /></label>
    <h4>Consumo em tempo real</h4>
    <dl className="golf-values">
      <div><dt>Pedal do acelerador</dt><dd>{(engine.pedal * 100).toFixed(0)}%</dd></div>
      <div><dt>Abertura da borboleta</dt><dd>{(engine.throttle * 100).toFixed(0)}%</dd></div>
      <div><dt>Pressao no coletor</dt><dd>{engine.map.toFixed(0)} kPa</dd></div>
      <div><dt>Massa de ar admitida</dt><dd>{consumption.airFlowGs.toFixed(2)} g/s</dd></div>
      <div><dt>Lambda alvo da ECU</dt><dd>{engine.lambda.toFixed(2)}</dd></div>
      <div><dt>Combustivel pedido</dt><dd>{consumption.fuelFlowGs.toFixed(3)} g/s</dd></div>
      <div><dt>Massa por injecao</dt><dd>{consumption.mgPerInjection.toFixed(1)} mg</dd></div>
      <div><dt>Tempo de injecao</dt><dd>{consumption.pulseMs.toFixed(2)} ms / {consumption.dutyPercent.toFixed(1)}%</dd></div>
      <div><dt>Vazao da bomba</dt><dd>{consumption.litresPerHour.toFixed(2)} L/h</dd></div>
      <div><dt>Autonomia estimada</dt><dd>{duration(rangeSeconds(clock.fuel, consumption.litresPerSecond))}</dd></div>
    </dl>
    <p className="golf-note">O consumo corre na linha do tempo do laboratorio: acelere o cronometro para ver o tanque baixar.</p>
    <h4>Sensor de nivel</h4>
    <dl className="golf-values">
      <div><dt>Posicao da boia</dt><dd>{(sample.floatLevel * 100).toFixed(1)}%</dd></div>
      <div><dt>Elemento resistivo</dt><dd>{sample.senderOhms.toFixed(1)} ohm</dd></div>
      <div><dt>Tensao de sinal</dt><dd>{sample.voltage.toFixed(3)} V</dd></div>
      <div><dt>Corrente do divisor</dt><dd>{sample.currentMa.toFixed(2)} mA</dd></div>
      <div><dt>Nivel decodificado</dt><dd>{sample.decoded === null ? 'Indisponivel' : `${(sample.decoded * 100).toFixed(1)}%`}</dd></div>
      <div><dt>Ponteiro filtrado</dt><dd>{(state.indicated * 100).toFixed(1)}%</dd></div>
      <div><dt>Reserva</dt><dd>{sample.reserveLamp ? 'Acesa' : 'Apagada'}</dd></div>
      <div><dt>Falha eletrica</dt><dd>{sample.faultLamp ? 'Acesa' : 'Apagada'}</dd></div>
    </dl>
    <label className="golf-select"><span>Falha</span><select aria-label="Falha do sensor de nivel" value={state.fault} onChange={event => { const fault = event.target.value as FuelSenderFault; change(current => ({ ...current, fuelSender: { ...current.fuelSender, fault, stuckLevel: fault === 'float-stuck' ? current.fuel : current.fuelSender.stuckLevel } })); }}><option value="none">Nenhuma</option><option value="signal-open">Fio de sinal aberto</option><option value="ground-open">Retorno do sensor aberto</option><option value="short-ground">Sinal em curto ao terra</option><option value="float-stuck">Boia travada</option></select></label>
    <div className="golf-switches"><label><input type="checkbox" checked={state.fuseOpen} onChange={event => change(current => ({ ...current, fuelSender: { ...current.fuelSender, fuseOpen: event.target.checked } }))} />Fusivel do instrumento aberto</label></div>
    <button type="button" className="golf-service" onClick={() => change(current => ({ ...current, fuelSender: advanceFuelSender(current.fuelSender, current.fuel, fuelSenderSupply(current), 1) }))}><SkipForward size={16} />Avancar leitura 1 s</button>
    <button type="button" className="golf-service" onClick={() => change(current => ({ ...current, fuel: 1, fuelSender: initialFuelSender(1) }))}><Fuel size={16} />Abastecer {FUEL_CONSUMPTION.tankLitres} L</button>
    <button type="button" className="golf-service" onClick={() => change(current => ({ ...current, fuelSender: initialFuelSender(current.fuel) }))}><RotateCcw size={16} />Reiniciar sensor</button>
    <dl className="golf-values"><div><dt>Curva resistiva / circuito</dt><dd>Didaticos estimados</dd></div><div><dt>Pinagem / calibracao VW</dt><dd>Nao confirmadas</dd></div><div><dt>Rendimento volumetrico</dt><dd>Modelo estimado</dd></div><div><dt>Vazao do injetor</dt><dd>{FUEL_CONSUMPTION.injectorFlowMgPerMs} mg/ms estimados</dd></div><div><dt>Ondulacao / inclinacao</dt><dd>Nao simuladas</dd></div></dl>
  </div>;
}