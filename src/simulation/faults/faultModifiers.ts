import type { EngineConfiguration } from '../types';

/**
 * Numeric fault modifiers. The Fault Engine converts active fault ids into a
 * single accumulated modifier object that adjusts configuration and subsystem
 * behavior. This keeps failures as real parameter propagation, not cosmetics.
 */
export interface FaultModifiers {
  volumetricEfficiencyMul: number;
  manifoldPressureMul: number;
  backpressureMul: number;
  ignitionAdvanceAddDeg: number;
  lambdaAdd: number;
  combustionDurationMul: number;
  octaneRel: number; // 1 = high octane, lower => knock prone
  radiatorEffectivenessMul: number;
  thermostatStuck: 'none' | 'open' | 'closed';
  fanDisabled: boolean;
  oilPressureMul: number;
  oilLevelRel: number; // 1 = full
  oilContaminationAdd: number;
  ringSealRel: number; // 1 healthy .. 0 bad
  blowbyAdd: number;
  frictionMul: number;
  pistonClearanceRel: number; // 1 normal, <1 tight, >1 loose
  misfireForceCylinders: number[];
  valveTimingErrorDeg: number;
  turboLubricationOk: boolean;
  wastegateStuck: 'none' | 'open' | 'closed';
  depositLevel: number; // 0..1 carbon deposits (pre-ignition source)
  heatGenerationMul: number;
  intakeRestriction: number; // 0 none .. 1 fully blocked
}

export function neutralModifiers(): FaultModifiers {
  return {
    volumetricEfficiencyMul: 1,
    manifoldPressureMul: 1,
    backpressureMul: 1,
    ignitionAdvanceAddDeg: 0,
    lambdaAdd: 0,
    combustionDurationMul: 1,
    octaneRel: 1,
    radiatorEffectivenessMul: 1,
    thermostatStuck: 'none',
    fanDisabled: false,
    oilPressureMul: 1,
    oilLevelRel: 1,
    oilContaminationAdd: 0,
    ringSealRel: 1,
    blowbyAdd: 0,
    frictionMul: 1,
    pistonClearanceRel: 1,
    misfireForceCylinders: [],
    valveTimingErrorDeg: 0,
    turboLubricationOk: true,
    wastegateStuck: 'none',
    depositLevel: 0,
    heatGenerationMul: 1,
    intakeRestriction: 0,
  };
}

type ModifierPatch = (m: FaultModifiers, config: EngineConfiguration) => void;

/** Numeric behavior for each fault id. Content/text lives in data/caseStudies. */
export const FAULT_MODIFIER_MAP: Record<string, ModifierPatch> = {
  detonation: (m) => {
    m.octaneRel = 0.35;
    m.ignitionAdvanceAddDeg = 8;
    m.heatGenerationMul = 1.15;
  },
  'pre-ignition': (m) => {
    m.depositLevel = 0.85;
    m.heatGenerationMul = 1.25;
  },
  'lean-mixture': (m) => {
    m.lambdaAdd = 0.22;
  },
  'rich-mixture': (m) => {
    m.lambdaAdd = -0.22;
    m.oilContaminationAdd = 0.3;
    m.ringSealRel = 0.85;
  },
  'overheat-thermostat-closed': (m) => {
    m.thermostatStuck = 'closed';
    m.heatGenerationMul = 1.05;
  },
  'cold-thermostat-open': (m) => {
    m.thermostatStuck = 'open';
  },
  'low-oil-pressure': (m) => {
    m.oilPressureMul = 0.35;
    m.oilLevelRel = 0.4;
    m.frictionMul = 1.25;
  },
  'worn-rings': (m) => {
    m.ringSealRel = 0.5;
    m.blowbyAdd = 0.5;
    m.volumetricEfficiencyMul = 0.9;
    m.oilContaminationAdd = 0.25;
  },
  'abrasive-contamination': (m) => {
    m.ringSealRel = 0.7;
    m.blowbyAdd = 0.3;
    m.frictionMul = 1.15;
  },
  'tight-piston-clearance': (m) => {
    m.pistonClearanceRel = 0.6;
    m.frictionMul = 1.4;
    m.heatGenerationMul = 1.05;
  },
  'loose-piston-clearance': (m) => {
    m.pistonClearanceRel = 1.5;
    m.blowbyAdd = 0.2;
  },
  misfire: (_m, config) => {
    _m.misfireForceCylinders = [config.geometry.cylinderCount >= 3 ? 3 : 1];
  },
  'valve-timing': (m) => {
    m.valveTimingErrorDeg = 25;
    m.volumetricEfficiencyMul = 0.8;
  },
  'burnt-exhaust-valve': (m) => {
    m.volumetricEfficiencyMul = 0.85;
    m.misfireForceCylinders = [];
    m.backpressureMul = 1.1;
  },
  'clogged-air-filter': (m) => {
    m.intakeRestriction = 0.5;
    m.manifoldPressureMul = 0.7;
    m.volumetricEfficiencyMul = 0.8;
  },
  'turbo-lubrication': (m) => {
    m.turboLubricationOk = false;
  },
  'wastegate-stuck-open': (m) => {
    m.wastegateStuck = 'open';
  },
  'wastegate-stuck-closed': (m) => {
    m.wastegateStuck = 'closed';
  },
};

/** Accumulate all active faults into a single modifier object. */
export function accumulateFaultModifiers(
  faultIds: string[],
  config: EngineConfiguration,
): FaultModifiers {
  const mods = neutralModifiers();
  for (const id of faultIds) {
    const patch = FAULT_MODIFIER_MAP[id];
    if (patch) patch(mods, config);
  }
  return mods;
}
