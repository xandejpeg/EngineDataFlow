import { useState } from 'react';
import { Panel, Segmented, Slider, Toggle } from '@/components/ui/controls';
import { useSimulationStore } from '@/state/simulationStore';
import { PARAM_RANGES } from '@/simulation/constants';
import { PRESETS } from '@/data/presets';
import { FAULTS } from '@/data/faults.pt-BR';
import { celsiusToKelvin, kelvinToCelsius } from '@/simulation/units';
import { fmt } from '@/simulation/format';

export function ControlsPanel() {
  const config = useSimulationStore((s) => s.config);
  const faultIds = useSimulationStore((s) => s.faultIds);
  const activePreset = useSimulationStore((s) => s.activePresetId);
  const setConfig = useSimulationStore((s) => s.setConfig);
  const setGeometry = useSimulationStore((s) => s.setGeometry);
  const applyPreset = useSimulationStore((s) => s.applyPreset);
  const restoreNormal = useSimulationStore((s) => s.restoreNormal);
  const toggleFault = useSimulationStore((s) => s.toggleFault);
  const [advanced, setAdvanced] = useState(false);

  return (
    <>
      <Panel title="Presets">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`btn${activePreset === p.id ? ' active' : ''}`}
              style={{ fontSize: 12 }}
              title={p.descriptionPt}
              onClick={() => applyPreset(p.id)}
            >
              {p.namePt}
            </button>
          ))}
        </div>
        <button className="btn primary" style={{ marginTop: 8, width: '100%' }} onClick={restoreNormal}>
          Restaurar configuracao normal
        </button>
      </Panel>

      <Panel title="Controles basicos">
        <Slider
          label="Rotacao"
          value={config.rpm}
          min={PARAM_RANGES.rpm.min}
          max={PARAM_RANGES.rpm.max}
          step={PARAM_RANGES.rpm.step}
          unit="rpm"
          normal={PARAM_RANGES.rpm.normal}
          format={(v) => fmt.int(v)}
          hint="Velocidade de rotacao do virabrequim."
          onChange={(v) => setConfig({ rpm: v })}
        />
        <Slider
          label="Acelerador / carga"
          value={config.throttle}
          min={0}
          max={1}
          step={0.01}
          format={(v) => fmt.pct(v)}
          normal={PARAM_RANGES.throttle.normal}
          hint="Abertura da borboleta define a carga."
          onChange={(v) => setConfig({ throttle: v })}
        />
        <div className="field">
          <div className="field-head">
            <label className="field-label">Combustivel</label>
          </div>
          <Segmented
            ariaLabel="Combustivel"
            value={config.fuel}
            onChange={(v) => setConfig({ fuel: v })}
            options={[
              { label: 'Gasolina', value: 'gasoline' },
              { label: 'Etanol', value: 'ethanol' },
            ]}
          />
        </div>
        <Slider
          label="Lambda (mistura)"
          value={config.targetLambda}
          min={PARAM_RANGES.lambda.min}
          max={PARAM_RANGES.lambda.max}
          step={PARAM_RANGES.lambda.step}
          format={(v) => fmt.n2(v)}
          normal={1}
          hint="< 1 rica, > 1 pobre."
          onChange={(v) => setConfig({ targetLambda: v })}
        />
        <Slider
          label="Avanco de ignicao"
          value={config.ignitionAdvanceDeg}
          min={PARAM_RANGES.ignitionAdvanceDeg.min}
          max={PARAM_RANGES.ignitionAdvanceDeg.max}
          step={1}
          unit="° APMS"
          normal={PARAM_RANGES.ignitionAdvanceDeg.normal}
          format={(v) => fmt.int(v)}
          hint="Graus antes do PMS. Excesso favorece detonacao."
          onChange={(v) => setConfig({ ignitionAdvanceDeg: v })}
        />
        <Slider
          label="Temperatura ambiente"
          value={kelvinToCelsius(config.ambientTempK)}
          min={PARAM_RANGES.ambientTempC.min}
          max={PARAM_RANGES.ambientTempC.max}
          step={1}
          unit="°C"
          normal={20}
          format={(v) => fmt.int(v)}
          onChange={(v) => setConfig({ ambientTempK: celsiusToKelvin(v) })}
        />
        <Toggle
          label="Modulo turbo"
          checked={config.turboEnabled}
          onChange={(v) => setConfig({ turboEnabled: v })}
        />
        {config.turboEnabled && (
          <Slider
            label="Boost alvo"
            value={config.boostBar}
            min={0}
            max={1.2}
            step={0.05}
            unit="bar"
            format={(v) => fmt.n2(v)}
            onChange={(v) => setConfig({ boostBar: v })}
          />
        )}
      </Panel>

      <Panel title="Controles avancados">
        <Toggle label="Mostrar controles avancados" checked={advanced} onChange={setAdvanced} />
        {advanced && (
          <div style={{ marginTop: 8 }}>
            <Slider
              label="Diametro do cilindro"
              value={config.geometry.boreM * 1000}
              min={PARAM_RANGES.bore_mm.min}
              max={PARAM_RANGES.bore_mm.max}
              step={0.5}
              unit="mm"
              format={(v) => fmt.n1(v)}
              onChange={(v) => setGeometry({ boreM: v / 1000 })}
            />
            <Slider
              label="Curso"
              value={config.geometry.strokeM * 1000}
              min={PARAM_RANGES.stroke_mm.min}
              max={PARAM_RANGES.stroke_mm.max}
              step={0.5}
              unit="mm"
              format={(v) => fmt.n1(v)}
              onChange={(v) => setGeometry({ strokeM: v / 1000 })}
            />
            <Slider
              label="Comprimento da biela"
              value={config.geometry.conrodM * 1000}
              min={PARAM_RANGES.conrod_mm.min}
              max={PARAM_RANGES.conrod_mm.max}
              step={1}
              unit="mm"
              format={(v) => fmt.int(v)}
              onChange={(v) => setGeometry({ conrodM: v / 1000 })}
            />
            <Slider
              label="Taxa de compressao"
              value={config.geometry.compressionRatio}
              min={PARAM_RANGES.compressionRatio.min}
              max={PARAM_RANGES.compressionRatio.max}
              step={0.1}
              format={(v) => `${fmt.n1(v)}:1`}
              onChange={(v) => setGeometry({ compressionRatio: v })}
            />
            <Slider
              label="Eficiencia volumetrica base"
              value={config.volumetricEfficiencyBase}
              min={PARAM_RANGES.volumetricEfficiency.min}
              max={PARAM_RANGES.volumetricEfficiency.max}
              step={0.01}
              format={(v) => fmt.pct(v)}
              onChange={(v) => setConfig({ volumetricEfficiencyBase: v })}
            />
            <Slider
              label="Duracao da combustao"
              value={config.combustionDurationDeg}
              min={PARAM_RANGES.combustionDurationDeg.min}
              max={PARAM_RANGES.combustionDurationDeg.max}
              step={1}
              unit="°"
              format={(v) => fmt.int(v)}
              onChange={(v) => setConfig({ combustionDurationDeg: v })}
            />
            <Slider
              label="Gamma (indice politropico)"
              value={config.gamma}
              min={PARAM_RANGES.gamma.min}
              max={PARAM_RANGES.gamma.max}
              step={0.01}
              format={(v) => fmt.n2(v)}
              onChange={(v) => setConfig({ gamma: v })}
            />
            <Slider
              label="Atrito relativo"
              value={config.frictionFactor}
              min={PARAM_RANGES.frictionFactor.min}
              max={PARAM_RANGES.frictionFactor.max}
              step={0.05}
              format={(v) => `${fmt.n2(v)}x`}
              onChange={(v) => setConfig({ frictionFactor: v })}
            />
          </div>
        )}
      </Panel>

      <Panel title="Falhas ativas">
        <p style={{ fontSize: 11.5, color: 'var(--text-2)', marginTop: 0 }}>
          Ative uma falha para propagar seus efeitos pela simulacao.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {FAULTS.map((f) => (
            <Toggle
              key={f.id}
              label={f.titlePt}
              checked={faultIds.includes(f.id)}
              onChange={() => toggleFault(f.id)}
            />
          ))}
        </div>
      </Panel>
    </>
  );
}
