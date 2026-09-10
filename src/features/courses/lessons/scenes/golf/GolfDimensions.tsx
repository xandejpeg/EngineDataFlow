import { useState } from 'react';
import { ALIGNMENT_SOURCE, evaluateAxleAlignment, type AlignmentVariant } from './golfAlignment';
import { VEHICLE_WHEELS, modelAxleMeasurements, modelWheelHeight, type VehicleWheelId } from './golfVehicleGeometry';
import './golfDimensions.css';

const number = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

export function GolfDimensions({ markers, setMarkers, selectedWheel, selectWheel, focused, setFocused }: {
  markers: boolean;
  setMarkers: (visible: boolean) => void;
  selectedWheel: VehicleWheelId;
  selectWheel: (id: VehicleWheelId) => void;
  focused: boolean;
  setFocused: (focused: boolean) => void;
}) {
  const [variant, setVariant] = useState<AlignmentVariant | ''>('');
  return <details className="golf-dimensions">
    <summary>Medidas do modelo</summary>
    <div className="golf-dimensions-content">
      <label className="golf-dimension-toggle"><input type="checkbox" checked={markers} onChange={event => setMarkers(event.target.checked)} />Cotas no 3D</label>
      <label className="golf-dimension-toggle"><input type="checkbox" checked={focused} onChange={event => setFocused(event.target.checked)} />Focar roda</label>
      <label className="golf-select"><span>Roda selecionada</span>
        <select aria-label="Roda da cota" value={selectedWheel} onChange={event => selectWheel(event.target.value as VehicleWheelId)}>
          {VEHICLE_WHEELS.map(wheel => <option key={wheel.id} value={wheel.id}>{wheel.axle === 'front' ? 'Dianteira' : 'Traseira'} {wheel.side < 0 ? 'esquerda' : 'direita'}</option>)}
        </select>
      </label>
      {markers && <div className="golf-dimension-legend"><span><i className="golf-marker-hub" aria-hidden="true" />Cubo</span><span><i className="golf-marker-arch" aria-hidden="true" />Recorte externo</span><small>Marcos nominais sobrepostos</small></div>}
      <p>Cubo ao recorte externo nominal. Modelo estatico; acabamento da borda e deformacao do pneu excluidos. Nao e a caixa interna estrutural.</p>
      <label className="golf-select"><span>Referencia de comparacao / PR nao confirmado</span>
        <select aria-label="Referencia de suspensao" value={variant} onChange={event => setVariant(event.target.value as AlignmentVariant | '')}>
          <option value="">Sem referencia</option>
          <option value="standard">2UA / Padrao</option>
          <option value="heavyDuty">2UB / Reforcada</option>
          <option value="sportExcept18">2UC / Esportiva, exceto 18 pol.</option>
        </select>
      </label>
      <div aria-live="polite" aria-label="Comparacao dimensional">
        {(['front', 'rear'] as const).map(axle => {
          const [left, right] = modelAxleMeasurements(axle);
          const checks = variant ? evaluateAxleAlignment(variant, axle, left, right) : [];
          return <div key={axle} className="golf-dimension-axle">
            <h4>{axle === 'front' ? 'Dianteira' : 'Traseira'}</h4>
            <dl>
              {VEHICLE_WHEELS.filter(wheel => wheel.axle === axle).map(wheel => {
                const side = wheel.side < 0 ? 'left' : 'right';
                const result = checks.find(check => check.id === `${side}.height`);
                return <div key={wheel.id} data-wheel-height={wheel.id} data-status={result?.status ?? 'no-reference'} data-selected={markers && selectedWheel === wheel.id}>
                  <dt>{wheel.side < 0 ? 'Esquerda' : 'Direita'}</dt>
                  <dd><strong>{number(modelWheelHeight(wheel.hub, wheel.arch).hubToArchMm!)} mm</strong>
                    <span>{result ? `${number(result.minimum)} a ${number(result.maximum)} mm` : 'Sem referencia selecionada'}</span>
                    {result && <span>{result.status === 'within-range' ? 'Dentro da faixa nominal' : 'Fora da faixa nominal'}</span>}
                  </dd>
                </div>;
              })}
            </dl>
          </div>;
        })}
      </div>
      <p>Camber, caster e convergencia: nao medidos. Comparacao parcial, sem aprovacao de alinhamento ou fidelidade de fabrica.</p>
      <details><summary>Coordenadas do modelo / mm</summary>
        <dl className="golf-dimension-coordinates">{VEHICLE_WHEELS.map(wheel => <div key={wheel.id}>
          <dt>{wheel.axle === 'front' ? 'Dianteira' : 'Traseira'} {wheel.side < 0 ? 'esquerda' : 'direita'}</dt>
          <dd>Cubo XYZ: {wheel.hub.map(number).join(' / ')}<br />Recorte XYZ: {wheel.arch.map(number).join(' / ')}</dd>
        </div>)}</dl>
      </details>
      <a href={ALIGNMENT_SOURCE.url} target="_blank" rel="noreferrer">Manual de oficina / alinhamento (arquivo independente)</a>
    </div>
  </details>;
}