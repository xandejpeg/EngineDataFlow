export type EgasFault = 'none' | 'pedal-signal' | 'reference' | 'motor-wire' | 'position-signal';

export const EGAS_MODEL = {
  application: 'generic-didactic-not-vw-pinout',
  referenceV: 5,
  pedalMinV: 0.5,
  pedalRangeV: 4,
  trackRatio: 0.5,
  restOpening: 0.06,
  maxOpening: 0.94,
  responseSeconds: 0.18,
} as const;

export interface EgasState {
  enabled: boolean;
  pedal: number;
  opening: number;
  fault: EgasFault;
}

export function initialEgas(): EgasState {
  return { enabled: false, pedal: 0, opening: EGAS_MODEL.restOpening, fault: 'none' };
}

export const normalizedPedal = (pedal: number) => Number.isFinite(pedal) ? Math.max(0, Math.min(1, pedal)) : 0;

export function sampleEgas(state: EgasState, ecuPowered: boolean) {
  const pedal = normalizedPedal(state.pedal);
  const referenceV = ecuPowered && state.fault !== 'reference' ? EGAS_MODEL.referenceV : 0;
  const signal1V = referenceV ? EGAS_MODEL.pedalMinV + EGAS_MODEL.pedalRangeV * pedal : 0;
  const signal2V = !referenceV || state.fault === 'pedal-signal' ? 0 : signal1V * EGAS_MODEL.trackRatio;
  const plausible = referenceV > 0 && signal2V > 0.1 && Math.abs(signal1V - signal2V / EGAS_MODEL.trackRatio) < 0.15;
  const position1V = referenceV ? 0.5 + 4 * state.opening : 0;
  const position2V = !referenceV || state.fault === 'position-signal' ? 0 : 4.5 - 4 * state.opening;
  const positionPlausible = referenceV > 0 && Math.abs(position1V + position2V - 5) < 0.15;
  const motorPowered = ecuPowered && state.fault !== 'motor-wire';
  const allowed = motorPowered && plausible && positionPlausible;
  const target = allowed ? EGAS_MODEL.restOpening + pedal * (EGAS_MODEL.maxOpening - EGAS_MODEL.restOpening) : EGAS_MODEL.restOpening;
  const status = !ecuPowered ? 'unpowered' : !plausible ? 'pedal-fault' : !positionPlausible ? 'position-fault' : !motorPowered ? 'motor-open' : 'tracking';
  return { pedal, referenceV, signal1V, signal2V, plausible, position1V, position2V, positionPlausible, motorPowered, allowed, target, status,
    motorCommand: allowed ? Math.max(-1, Math.min(1, (target - state.opening) * 4)) : 0 };
}

export function advanceEgas(state: EgasState, ecuPowered: boolean, seconds: number): EgasState {
  if (!state.enabled || !Number.isFinite(seconds) || seconds <= 0) return state;
  const sample = sampleEgas(state, ecuPowered);
  const opening = sample.target + (state.opening - sample.target) * Math.exp(-seconds / EGAS_MODEL.responseSeconds);
  return { ...state, opening };
}