import { create } from 'zustand';
import { DEFAULT_CONFIG, SimulationEngine } from '@/simulation/simulationEngine';
import type { EngineConfiguration, TelemetryFrame } from '@/simulation/types';
import { PARAM_RANGES } from '@/simulation/constants';
import { clamp } from '@/simulation/units';
import { NORMAL_PRESET, PRESETS } from '@/data/presets';
import { setLatestFrame } from './frameBus';

/** Single engine instance shared by the 3D scene, panels and charts. */
export const engine = new SimulationEngine(DEFAULT_CONFIG);

export type SpeedScale = 0.1 | 0.25 | 0.5 | 1 | 2;

interface SimulationStore {
  config: EngineConfiguration;
  faultIds: string[];
  running: boolean;
  speedScale: SpeedScale;
  crankAngleDeg: number;
  selectedCylinder: number;
  activePresetId: string;
  frame: TelemetryFrame | null;

  // actions
  setConfig: (partial: Partial<EngineConfiguration>) => void;
  setGeometry: (partial: Partial<EngineConfiguration['geometry']>) => void;
  setRpm: (rpm: number) => void;
  setThrottle: (throttle: number) => void;
  toggleRunning: () => void;
  setRunning: (running: boolean) => void;
  setSpeed: (scale: SpeedScale) => void;
  setCrankAngle: (deg: number) => void;
  stepAngle: (deltaDeg: number) => void;
  setSelectedCylinder: (index: number) => void;
  setFaults: (ids: string[]) => void;
  toggleFault: (id: string) => void;
  applyPreset: (id: string) => void;
  restoreNormal: () => void;
  refreshFrame: () => void;
  publishFrame: (frame: TelemetryFrame) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  config: structuredClone(DEFAULT_CONFIG),
  faultIds: [],
  running: false,
  speedScale: 1,
  crankAngleDeg: 0,
  selectedCylinder: 0,
  activePresetId: 'normal',
  frame: engine.computeFrame(),

  setConfig: (partial) => {
    engine.setConfig(partial);
    set({ config: { ...get().config, ...partial } });
    get().refreshFrame();
  },

  setGeometry: (partial) => {
    const geometry = { ...get().config.geometry, ...partial };
    engine.setConfig({ geometry });
    set({ config: { ...get().config, geometry } });
    get().refreshFrame();
  },

  setRpm: (rpm) => get().setConfig({ rpm: clamp(rpm, PARAM_RANGES.rpm.min, PARAM_RANGES.rpm.max) }),
  setThrottle: (throttle) => get().setConfig({ throttle: clamp(throttle, 0, 1) }),

  toggleRunning: () => {
    const running = !get().running;
    engine.clock.running = running;
    set({ running });
  },
  setRunning: (running) => {
    engine.clock.running = running;
    set({ running });
  },

  setSpeed: (scale) => {
    engine.clock.speedScale = scale;
    set({ speedScale: scale });
  },

  setCrankAngle: (deg) => {
    const a = ((deg % 720) + 720) % 720;
    engine.clock.crankAngleDeg = a;
    set({ crankAngleDeg: a });
    get().refreshFrame();
  },

  stepAngle: (deltaDeg) => get().setCrankAngle(get().crankAngleDeg + deltaDeg),

  setSelectedCylinder: (index) => {
    engine.selectedCylinderIndex = index;
    set({ selectedCylinder: index });
    get().refreshFrame();
  },

  setFaults: (ids) => {
    engine.setFaults(ids);
    set({ faultIds: [...ids] });
    get().refreshFrame();
  },

  toggleFault: (id) => {
    const current = get().faultIds;
    const next = current.includes(id) ? current.filter((f) => f !== id) : [...current, id];
    get().setFaults(next);
  },

  applyPreset: (id) => {
    const preset = PRESETS.find((p) => p.id === id) ?? NORMAL_PRESET;
    const config = { ...structuredClone(DEFAULT_CONFIG), ...preset.config };
    engine.config = config;
    engine.setFaults(preset.faultIds);
    engine.reset();
    set({
      config,
      faultIds: [...preset.faultIds],
      activePresetId: preset.id,
    });
    get().refreshFrame();
  },

  restoreNormal: () => get().applyPreset('normal'),

  refreshFrame: () => {
    if (!get().running) {
      const frame = engine.computeFrame();
      setLatestFrame(frame);
      set({ frame });
    }
  },

  publishFrame: (frame) => set({ frame }),
}));
