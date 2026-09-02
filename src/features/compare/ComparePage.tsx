import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DEFAULT_CONFIG } from '@/simulation/simulationEngine';
import { sampleCycle } from '@/simulation/cycleSampling';
import { FAULTS } from '@/data/faults.pt-BR';
import { NORMAL_PRESET, PRESETS } from '@/data/presets';
import { FLUID_COLORS } from '@/styles/colors';
import '../pages.css';

const AXIS = { stroke: '#5b6a86', fontSize: 11 };

export function ComparePage() {
  const [faultId, setFaultId] = useState<string>('detonation');

  const normalData = useMemo(
    () => sampleCycle({ ...DEFAULT_CONFIG, ...NORMAL_PRESET.config }, [], 120),
    [],
  );
  const faultData = useMemo(() => {
    const preset = PRESETS.find((p) => p.faultIds.includes(faultId));
    const config = { ...DEFAULT_CONFIG, ...(preset?.config ?? {}) };
    return sampleCycle(config, [faultId], 120);
  }, [faultId]);

  const merged = normalData.map((n, i) => ({
    angle: n.angle,
    normalP: n.pressureBar,
    faultP: faultData[i]?.pressureBar ?? null,
    normalT: n.torqueTotal,
    faultT: faultData[i]?.torqueTotal ?? null,
  }));

  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <h1>Comparar normal x falha</h1>
        </div>
        <p className="page-subtitle">
          Compare o funcionamento normal com uma configuracao defeituosa nos mesmos graficos
          (estimativas calculadas).
        </p>

        <label className="field-label" htmlFor="fault-select">Falha para comparar</label>
        <br />
        <select
          id="fault-select"
          className="search-input"
          value={faultId}
          onChange={(e) => setFaultId(e.target.value)}
        >
          {FAULTS.map((f) => (
            <option key={f.id} value={f.id}>{f.titlePt}</option>
          ))}
        </select>

        <section className="section">
          <h2>Pressao do cilindro x angulo (bar)</h2>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={merged}>
                <CartesianGrid stroke="#1c2740" />
                <XAxis dataKey="angle" unit="°" tick={AXIS} stroke={AXIS.stroke} />
                <YAxis tick={AXIS} stroke={AXIS.stroke} />
                <Tooltip contentStyle={tip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="normalP" name="Normal" stroke={FLUID_COLORS.normal} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="faultP" name="Falha" stroke={FLUID_COLORS.fault} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="section">
          <h2>Torque total x angulo (Nm)</h2>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={merged}>
                <CartesianGrid stroke="#1c2740" />
                <XAxis dataKey="angle" unit="°" tick={AXIS} stroke={AXIS.stroke} />
                <YAxis tick={AXIS} stroke={AXIS.stroke} />
                <Tooltip contentStyle={tip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="normalT" name="Normal" stroke={FLUID_COLORS.normal} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="faultT" name="Falha" stroke={FLUID_COLORS.fault} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

const tip = { background: '#0e131f', border: '1px solid #253049', borderRadius: 8, fontSize: 12 } as const;
