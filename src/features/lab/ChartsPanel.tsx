import { useMemo, useState } from 'react';
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { sampleCycle } from '@/simulation/cycleSampling';
import { useSimulationStore } from '@/state/simulationStore';
import { Segmented } from '@/components/ui/controls';
import { FLUID_COLORS } from '@/styles/colors';

type ChartKind = 'pressure' | 'pv' | 'temperature' | 'valves' | 'torque';

const AXIS = { stroke: '#5b6a86', fontSize: 11 };
const GRID = '#1c2740';

export function ChartsPanel() {
  const config = useSimulationStore((s) => s.config);
  const faultIds = useSimulationStore((s) => s.faultIds);
  const crankAngle = useSimulationStore((s) => s.crankAngleDeg);
  const setCrankAngle = useSimulationStore((s) => s.setCrankAngle);
  const [kind, setKind] = useState<ChartKind>('pressure');

  const data = useMemo(() => sampleCycle(config, faultIds), [config, faultIds]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 8 }}>
        <Segmented
          ariaLabel="Selecionar grafico"
          value={kind}
          onChange={(v) => setKind(v)}
          options={[
            { label: 'Pressao', value: 'pressure' },
            { label: 'p-V', value: 'pv' },
            { label: 'Temperatura', value: 'temperature' },
            { label: 'Valvulas', value: 'valves' },
            { label: 'Torque', value: 'torque' },
          ]}
        />
      </div>
      <div style={{ flex: 1, minHeight: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          {kind === 'pv' ? (
            <ScatterChart margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
              <CartesianGrid stroke={GRID} />
              <XAxis
                type="number"
                dataKey="volumeCm3"
                name="Volume"
                unit=" cm3"
                tick={AXIS}
                stroke={AXIS.stroke}
              />
              <YAxis
                type="number"
                dataKey="pressureBar"
                name="Pressao"
                unit=" bar"
                tick={AXIS}
                stroke={AXIS.stroke}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Scatter data={data} fill={FLUID_COLORS.data} line={{ stroke: FLUID_COLORS.data }} />
            </ScatterChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, bottom: 4, left: 4 }}
              onClick={(e) => {
                const label = e?.activeLabel;
                if (label !== undefined) setCrankAngle(Number(label));
              }}
            >
              <CartesianGrid stroke={GRID} />
              <XAxis dataKey="angle" unit="°" tick={AXIS} stroke={AXIS.stroke} />
              <YAxis tick={AXIS} stroke={AXIS.stroke} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={Math.round(crankAngle)} stroke={FLUID_COLORS.warning} strokeDasharray="4 3" />
              {kind === 'pressure' && (
                <Line type="monotone" dataKey="pressureBar" name="Pressao (bar)" stroke={FLUID_COLORS.flameHot} dot={false} strokeWidth={2} />
              )}
              {kind === 'temperature' && (
                <Line type="monotone" dataKey="temperatureC" name="Temperatura (C)" stroke={FLUID_COLORS.warning} dot={false} strokeWidth={2} />
              )}
              {kind === 'valves' && (
                <>
                  <Line type="monotone" dataKey="intakeLiftMm" name="Adm. (mm)" stroke={FLUID_COLORS.air} dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="exhaustLiftMm" name="Esc. (mm)" stroke={FLUID_COLORS.exhaust} dot={false} strokeWidth={2} />
                </>
              )}
              {kind === 'torque' && (
                <>
                  <Line type="monotone" dataKey="torqueTotal" name="Torque total (Nm)" stroke={FLUID_COLORS.normal} dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="torqueCyl1" name="Cil. 1 (Nm)" stroke={FLUID_COLORS.data} dot={false} strokeWidth={1.5} />
                </>
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: 10.5, color: 'var(--text-2)', margin: '4px 0 0' }}>
        Estimativas educacionais calculadas a partir da configuracao atual. Clique no grafico (com a
        simulacao pausada) para posicionar o angulo na cena.
      </p>
    </div>
  );
}

const tooltipStyle = {
  background: '#0e131f',
  border: '1px solid #253049',
  borderRadius: 8,
  fontSize: 12,
} as const;
