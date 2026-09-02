import { create } from 'zustand';
import type { QualityLevel } from '@/simulation/types';

export type CameraPreset =
  | 'perspective'
  | 'front'
  | 'side'
  | 'top'
  | 'cylinderCut'
  | 'crankshaft'
  | 'head'
  | 'intake'
  | 'exhaust'
  | 'lubrication'
  | 'cooling';

interface UiStore {
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  isolatedSystem: string | null;
  explodeAmount: number; // 0..1
  xrayAmount: number; // 0..1
  showLabels: boolean;
  showParticles: boolean;
  particleDensity: number; // 0..1
  cameraPreset: CameraPreset;
  cameraNonce: number; // bump to force a camera move
  quality: QualityLevel;
  reducedMotion: boolean;
  audioEnabled: boolean;
  audioVolume: number;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  hiddenSystems: string[];

  selectComponent: (id: string | null) => void;
  hoverComponent: (id: string | null) => void;
  isolateSystem: (system: string | null) => void;
  setExplode: (v: number) => void;
  setXray: (v: number) => void;
  toggleLabels: () => void;
  toggleParticles: () => void;
  setParticleDensity: (v: number) => void;
  setCamera: (preset: CameraPreset) => void;
  resetCamera: () => void;
  setQuality: (q: QualityLevel) => void;
  toggleReducedMotion: () => void;
  toggleAudio: () => void;
  setAudioVolume: (v: number) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  toggleSystemVisibility: (system: string) => void;
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useUiStore = create<UiStore>((set, get) => ({
  selectedComponentId: null,
  hoveredComponentId: null,
  isolatedSystem: null,
  explodeAmount: 0,
  xrayAmount: 0.6,
  showLabels: true,
  showParticles: true,
  particleDensity: 0.6,
  cameraPreset: 'perspective',
  cameraNonce: 0,
  quality: 'auto',
  reducedMotion: prefersReducedMotion,
  audioEnabled: false,
  audioVolume: 0.3,
  leftPanelOpen: true,
  rightPanelOpen: true,
  bottomPanelOpen: true,
  hiddenSystems: [],

  selectComponent: (id) => set({ selectedComponentId: id }),
  hoverComponent: (id) => set({ hoveredComponentId: id }),
  isolateSystem: (system) => set({ isolatedSystem: system }),
  setExplode: (v) => set({ explodeAmount: Math.min(Math.max(v, 0), 1) }),
  setXray: (v) => set({ xrayAmount: Math.min(Math.max(v, 0), 1) }),
  toggleLabels: () => set({ showLabels: !get().showLabels }),
  toggleParticles: () => set({ showParticles: !get().showParticles }),
  setParticleDensity: (v) => set({ particleDensity: Math.min(Math.max(v, 0), 1) }),
  setCamera: (preset) => set({ cameraPreset: preset, cameraNonce: get().cameraNonce + 1 }),
  resetCamera: () => set({ cameraPreset: 'perspective', cameraNonce: get().cameraNonce + 1 }),
  setQuality: (q) => set({ quality: q }),
  toggleReducedMotion: () => set({ reducedMotion: !get().reducedMotion }),
  toggleAudio: () => set({ audioEnabled: !get().audioEnabled }),
  setAudioVolume: (v) => set({ audioVolume: Math.min(Math.max(v, 0), 1) }),
  toggleLeftPanel: () => set({ leftPanelOpen: !get().leftPanelOpen }),
  toggleRightPanel: () => set({ rightPanelOpen: !get().rightPanelOpen }),
  toggleBottomPanel: () => set({ bottomPanelOpen: !get().bottomPanelOpen }),
  toggleSystemVisibility: (system) => {
    const hidden = get().hiddenSystems;
    set({
      hiddenSystems: hidden.includes(system)
        ? hidden.filter((s) => s !== system)
        : [...hidden, system],
    });
  },
}));
