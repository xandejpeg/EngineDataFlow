import { useTelemetry } from '@/components/useTelemetry';
import { Panel, Stat } from '@/components/ui/controls';
import { fmt } from '@/simulation/format';
import { riskColor, FLUID_COLORS, coolantColor } from '@/styles/colors';
import { kelvinToCelsius } from '@/simulation/units';

export function TelemetryPanel() {
  const frame = useTelemetry();
  if (!frame) return null;
  const sel = frame.cylinders[frame.selectedCylinderIndex];
  const q = frame.combustionQuality;

  return (
    <>
      <Panel title="Desempenho">
        <div className="stat-grid">
          <Stat label="Rotacao" value={fmt.int(frame.config.rpm)} unit="rpm" />
          <Stat label="Angulo" value={fmt.int(frame.clock.crankAngleDeg)} unit="°" />
          <Stat label="Torque medio" value={fmt.n1(frame.performance.torqueMeanNm)} unit="Nm" />
          <Stat label="Potencia" value={fmt.kw(frame.performance.powerW)} unit="kW" />
          <Stat label="Potencia" value={fmt.hp(frame.performance.powerW)} unit="cv" />
          <Stat label="IMEP" value={fmt.bar(frame.performance.imepPa)} unit="bar" />
          <Stat label="Ef. ideal" value={fmt.pct(frame.performance.etaIdeal)} />
          <Stat label="Ef. estimada" value={fmt.pct(frame.performance.etaEstimated)} />
        </div>
      </Panel>

      <Panel title={`Cilindro ${sel?.cylinderNumber ?? 1}`}>
        <div className="stat-grid">
          <Stat label="Fase" value={phasePt(sel?.phase)} />
          <Stat label="Pressao" value={fmt.bar(sel?.pressurePa ?? 0)} unit="bar" />
          <Stat label="Gas" value={fmt.celsius(sel?.temperatureK ?? 0)} unit="°C" />
          <Stat label="Volume" value={fmt.cm3(sel?.volumeM3 ?? 0)} unit="cm3" />
          <Stat label="Vel. pistao" value={fmt.n1(sel?.pistonVelocityMps ?? 0)} unit="m/s" />
          <Stat label="Queimado" value={fmt.pct(sel?.combustion.burnFraction ?? 0)} />
          <Stat label="Adm." value={fmt.n2((sel?.valves.intakeLiftM ?? 0) * 1000)} unit="mm" />
          <Stat label="Esc." value={fmt.n2((sel?.valves.exhaustLiftM ?? 0) * 1000)} unit="mm" />
        </div>
      </Panel>

      <Panel title="Mistura e ignicao">
        <div className="stat-grid">
          <Stat label="Lambda" value={fmt.n2(frame.mixture.lambda)} color={lambdaColor(frame.mixture.lambda)} />
          <Stat label="AFR" value={fmt.n1(frame.mixture.afr)} />
          <Stat label="Avanco" value={fmt.int(frame.ignition.advanceDeg)} unit="° APMS" />
          <Stat label="Recuo knock" value={fmt.n1(frame.ignition.knockRetardDeg)} unit="°" />
          <Stat label="Ar/ciclo" value={fmt.n2(frame.intakeExhaust.airMassPerCycleKg * 1e6)} unit="mg" />
          <Stat label="Comb." value={fmt.n2(frame.mixture.fuelMassFlowKgs * 1000)} unit="g/s" />
        </div>
      </Panel>

      <Panel title="Riscos (indices heuristicos)">
        <div className="stat-grid">
          <Stat label="Detonacao" value={fmt.pct(q.knockRisk)} color={riskColor(q.knockRisk)} />
          <Stat label="Pre-ignicao" value={fmt.pct(q.preIgnitionRisk)} color={riskColor(q.preIgnitionRisk)} />
          <Stat label="Misfire" value={fmt.pct(frame.ignition.misfireIntensity)} color={riskColor(frame.ignition.misfireIntensity)} />
          <Stat label="Blow-by" value={fmt.pct(blowby(frame))} />
        </div>
      </Panel>

      <Panel title="Arrefecimento e lubrificacao">
        <div className="stat-grid">
          <Stat label="Liquido" value={fmt.celsius(frame.cooling.coolantTempK)} unit="°C" color={coolantColor(kelvinToCelsius(frame.cooling.coolantTempK))} />
          <Stat label="Oleo" value={fmt.celsius(frame.lubrication.oilTempK)} unit="°C" />
          <Stat label="Cabecote" value={fmt.celsius(frame.cooling.headTempK)} unit="°C" />
          <Stat label="Pistao" value={fmt.celsius(frame.cooling.pistonTempK)} unit="°C" />
          <Stat label="Pressao oleo" value={fmt.bar(frame.lubrication.oilPressurePa)} unit="bar" color={frame.lubrication.oilPressurePa < 1e5 ? FLUID_COLORS.fault : undefined} />
          <Stat label="Filme" value={fmt.pct(frame.lubrication.filmIntegrity)} color={riskColor(1 - frame.lubrication.filmIntegrity)} />
          <Stat label="Termostatica" value={fmt.pct(frame.cooling.thermostatOpenFraction)} />
          <Stat label="Ventilador" value={frame.cooling.fanOn ? 'ON' : 'off'} />
        </div>
      </Panel>

      <Panel title="Emissoes relativas (qualitativas)">
        <div className="stat-grid">
          <Stat label="CO" value={fmt.pct(frame.emissions.coRel)} />
          <Stat label="HC" value={fmt.pct(frame.emissions.hcRel)} />
          <Stat label="NOx" value={fmt.pct(frame.emissions.noxRel)} />
          <Stat label="CO2" value={fmt.pct(frame.emissions.co2Rel)} />
        </div>
      </Panel>
    </>
  );
}

function phasePt(phase?: string): string {
  switch (phase) {
    case 'intake':
      return 'Admissao';
    case 'compression':
      return 'Compressao';
    case 'power':
      return 'Combustao';
    case 'exhaust':
      return 'Escape';
    default:
      return '-';
  }
}

function lambdaColor(lambda: number): string {
  if (lambda < 0.9) return FLUID_COLORS.fuel;
  if (lambda > 1.1) return FLUID_COLORS.air;
  return FLUID_COLORS.normal;
}

function blowby(frame: ReturnType<typeof useTelemetry>): number {
  if (!frame) return 0;
  return Math.min(1, (1 - frame.lubrication.filmIntegrity) * 0.3 + (frame.activeFaultIds.includes('worn-rings') ? 0.5 : 0));
}
