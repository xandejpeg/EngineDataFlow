import { wiperPose } from './golfWiperGeometry';

export type WiperMode = 'off' | 'intermittent' | 'low' | 'high';
export type WiperFault = 'none' | 'motor' | 'linkage' | 'park';

export const WIPER_MODEL = { lowCyclesPerMinute: 40, highCyclesPerMinute: 60, intervalSeconds: 4, application: 'generic-didactic-not-vw-controller' } as const;

export interface WiperState {
  mode: WiperMode;
  fault: WiperFault;
  fuseOpen: boolean;
  phase: number;
  armPhase: number;
  cycles: number;
  interval: number;
  elapsed: number;
  washing: boolean;
  afterWash: number;
}

export function initialWipers(): WiperState {
  return { mode: 'off', fault: 'none', fuseOpen: false, phase: 0, armPhase: 0, cycles: 0, interval: 0, elapsed: 0, washing: false, afterWash: 0 };
}

export function sampleWipers(state: WiperState, powered: boolean) {
  const supply = powered && !state.fuseOpen;
  const parkContact = state.fault !== 'park' && state.phase === 0;
  const demand = state.washing || state.afterWash > 0 || state.mode === 'low' || state.mode === 'high' || (state.mode === 'intermittent' && state.interval <= 1e-10);
  const parking = !demand && !parkContact;
  const motorPowered = supply && state.fault !== 'motor' && (demand || parking);
  const cyclesPerMinute = motorPowered ? state.mode === 'high' && !state.washing ? WIPER_MODEL.highCyclesPerMinute : WIPER_MODEL.lowCyclesPerMinute : 0;
  const sweep = wiperPose(state.armPhase).sweep;
  return { supply, parkContact, demand, parking, motorPowered, cyclesPerMinute, sweep, washerPowered: supply && state.washing, linked: state.fault !== 'linkage', status: !supply ? 'unpowered' : state.fault !== 'none' ? state.fault : motorPowered ? parking ? 'parking' : 'wiping' : 'parked' };
}

export function advanceWipers(state: WiperState, powered: boolean, seconds: number): WiperState {
  if (!Number.isFinite(seconds) || seconds <= 0) return state;
  const duration = Math.min(seconds, 60);
  const steps = Math.ceil(duration / 0.01);
  const delta = duration / steps;
  const next = { ...state };
  for (let step = 0; step < steps; step += 1) {
    const sample = sampleWipers(next, powered);
    next.elapsed += delta;
    if (sample.washerPowered) next.afterWash = 2;
    if (sample.supply && !sample.motorPowered && next.mode === 'intermittent') next.interval = Math.max(0, next.interval - delta);
    if (!sample.motorPowered) continue;
    const advanced = next.phase + sample.cyclesPerMinute / 60 * delta;
    if (advanced >= 1 - 1e-10) {
      next.cycles += 1;
      if (!next.washing && next.afterWash > 0) next.afterWash -= 1;
      next.interval = next.mode === 'intermittent' && !next.washing && next.afterWash === 0 ? WIPER_MODEL.intervalSeconds : 0;
      const continuous = next.washing || next.afterWash > 0 || next.mode === 'low' || next.mode === 'high' || next.fault === 'park';
      next.phase = continuous ? Math.max(0, advanced - 1) : 0;
    } else next.phase = advanced;
    if (sample.linked) next.armPhase = next.phase;
  }
  return next;
}