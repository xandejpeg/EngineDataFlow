import { Panel, Segmented, Slider, Toggle } from '@/components/ui/controls';
import { useUiStore, type CameraPreset } from '@/state/uiStore';
import type { QualityLevel } from '@/simulation/types';
import { fmt } from '@/simulation/format';

const CAMERAS: { label: string; value: CameraPreset }[] = [
  { label: 'Perspectiva', value: 'perspective' },
  { label: 'Frente', value: 'front' },
  { label: 'Lateral', value: 'side' },
  { label: 'Topo', value: 'top' },
  { label: 'Corte cilindro', value: 'cylinderCut' },
  { label: 'Virabrequim', value: 'crankshaft' },
  { label: 'Cabecote', value: 'head' },
  { label: 'Admissao', value: 'intake' },
  { label: 'Escape', value: 'exhaust' },
  { label: 'Lubrificacao', value: 'lubrication' },
  { label: 'Arrefecimento', value: 'cooling' },
];

const SYSTEMS: { label: string; id: string }[] = [
  { label: 'Bloco', id: 'shortBlock' },
  { label: 'Cabecote', id: 'cylinderHead' },
];

export function LeftPanel() {
  const ui = useUiStore();

  return (
    <>
      <Panel title="Cameras predefinidas">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CAMERAS.map((c) => (
            <button
              key={c.value}
              className={`btn${ui.cameraPreset === c.value ? ' active' : ''}`}
              style={{ fontSize: 11.5 }}
              onClick={() => ui.setCamera(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button className="btn" style={{ marginTop: 8, width: '100%' }} onClick={ui.resetCamera}>
          Restaurar camera
        </button>
      </Panel>

      <Panel title="Modos de visualizacao">
        <Slider
          label="Corte / X-ray"
          value={ui.xrayAmount}
          min={0}
          max={1}
          step={0.05}
          format={(v) => fmt.pct(v)}
          onChange={ui.setXray}
        />
        <Slider
          label="Explodir conjunto"
          value={ui.explodeAmount}
          min={0}
          max={1}
          step={0.05}
          format={(v) => fmt.pct(v)}
          onChange={ui.setExplode}
        />
        <Toggle label="Rotulos" checked={ui.showLabels} onChange={ui.toggleLabels} />
        <Toggle label="Particulas de fluxo" checked={ui.showParticles} onChange={ui.toggleParticles} />
        {ui.showParticles && (
          <Slider
            label="Densidade de particulas"
            value={ui.particleDensity}
            min={0}
            max={1}
            step={0.1}
            format={(v) => fmt.pct(v)}
            onChange={ui.setParticleDensity}
          />
        )}
      </Panel>

      <Panel title="Visibilidade">
        {SYSTEMS.map((s) => (
          <Toggle
            key={s.id}
            label={s.label}
            checked={!ui.hiddenSystems.includes(s.id)}
            onChange={() => ui.toggleSystemVisibility(s.id)}
          />
        ))}
      </Panel>

      <Panel title="Qualidade e acessibilidade">
        <div className="field">
          <div className="field-head">
            <label className="field-label">Qualidade grafica</label>
          </div>
          <Segmented
            ariaLabel="Qualidade grafica"
            value={ui.quality}
            onChange={(v) => ui.setQuality(v as QualityLevel)}
            options={[
              { label: 'Baixo', value: 'low' },
              { label: 'Medio', value: 'medium' },
              { label: 'Alto', value: 'high' },
              { label: 'Auto', value: 'auto' },
            ]}
          />
        </div>
        <Toggle label="Movimento reduzido" checked={ui.reducedMotion} onChange={ui.toggleReducedMotion} />
        <Toggle label="Audio sintetizado" checked={ui.audioEnabled} onChange={ui.toggleAudio} />
      </Panel>
    </>
  );
}
