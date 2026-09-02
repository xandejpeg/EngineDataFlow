import { useEffect, useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { EngineScene } from '@/engine3d/EngineScene';import { LeftPanel } from './LeftPanel';
import { ControlsPanel } from './ControlsPanel';
import { TelemetryPanel } from './TelemetryPanel';
import { TransportBar } from './TransportBar';
import { ChartsPanel } from './ChartsPanel';
import { SceneSummary } from './SceneSummary';
import { useUiStore } from '@/state/uiStore';
import { useTelemetry } from '@/components/useTelemetry';
import { riskColor, FLUID_COLORS } from '@/styles/colors';
import { fmt } from '@/simulation/format';
import './LabPage.css';

const LEGEND = [
  { c: FLUID_COLORS.air, l: 'Ar' },
  { c: FLUID_COLORS.fuel, l: 'Combustivel' },
  { c: FLUID_COLORS.flame, l: 'Chama' },
  { c: FLUID_COLORS.exhaust, l: 'Escape' },
  { c: FLUID_COLORS.oil, l: 'Oleo' },
  { c: FLUID_COLORS.coolantCold, l: 'Arrefecimento' },
  { c: FLUID_COLORS.data, l: 'Dados' },
];

export function LabPage() {
  const leftOpen = useUiStore((s) => s.leftPanelOpen);
  const rightOpen = useUiStore((s) => s.rightPanelOpen);
  const toggleLeft = useUiStore((s) => s.toggleLeftPanel);
  const toggleRight = useUiStore((s) => s.toggleRightPanel);
  const [chartsOpen, setChartsOpen] = useState(true);
  const frame = useTelemetry();

  // On narrow screens, collapse the side panels by default so the scene is visible.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      const ui = useUiStore.getState();
      if (ui.leftPanelOpen) ui.toggleLeftPanel();
      if (ui.rightPanelOpen) ui.toggleRightPanel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lab">
      <aside className={`lab-left${leftOpen ? '' : ' collapsed'}`} aria-label="Painel de visualizacao">
        {leftOpen && <LeftPanel />}
      </aside>

      <div className="lab-scene">
        <EngineScene />

        <button className="panel-toggle left" onClick={toggleLeft} aria-label={leftOpen ? 'Recolher painel esquerdo' : 'Abrir painel esquerdo'}>
          {leftOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
        <button className="panel-toggle right" onClick={toggleRight} aria-label={rightOpen ? 'Recolher painel direito' : 'Abrir painel direito'}>
          {rightOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </button>

        <div className="floating-indicators">
          {frame && (
            <>
              <div className="indicator">
                <span className="dot" style={{ background: riskColor(frame.combustionQuality.knockRisk) }} />
                Detonacao {fmt.pct(frame.combustionQuality.knockRisk)}
              </div>
              <div className="indicator">
                <span className="dot" style={{ background: riskColor(1 - frame.lubrication.filmIntegrity) }} />
                Oleo {fmt.bar(frame.lubrication.oilPressurePa)} bar
              </div>
              <div className="indicator">
                <span className="dot" style={{ background: riskColor((frame.cooling.coolantTempK - 360) / 40) }} />
                Liquido {fmt.celsius(frame.cooling.coolantTempK)}°C
              </div>
            </>
          )}
        </div>

        <div className="legend" aria-hidden="true">
          {LEGEND.map((x) => (
            <span key={x.l} className="item">
              <span className="swatch" style={{ background: x.c }} />
              {x.l}
            </span>
          ))}
        </div>

        <SceneSummary />
      </div>

      <aside className={`lab-right${rightOpen ? '' : ' collapsed'}`} aria-label="Controles e telemetria">
        {rightOpen && (
          <>
            <ControlsPanel />
            <TelemetryPanel />
          </>
        )}
      </aside>

      <div className="lab-bottom">
        <TransportBar />
        <div className="bottom-tabs">
          <button className={`btn${chartsOpen ? ' active' : ''}`} onClick={() => setChartsOpen((v) => !v)}>
            {chartsOpen ? 'Ocultar graficos' : 'Mostrar graficos'}
          </button>
        </div>
        <div className={`charts-area${chartsOpen ? '' : ' collapsed'}`}>
          <ChartsPanel />
        </div>
      </div>
    </div>
  );
}
