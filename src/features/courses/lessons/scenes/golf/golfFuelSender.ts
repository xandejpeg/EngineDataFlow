export type FuelSenderFault = 'none' | 'signal-open' | 'ground-open' | 'short-ground' | 'float-stuck';
export interface FuelSenderState {
  fault: FuelSenderFault;
  stuckLevel: number;
  fuseOpen: boolean;
  indicated: number;
  reserve: boolean;
  elapsed: number;
}
export const FUEL_SENDER_MODEL = { emptyOhms: 280, fullOhms: 40, pullupOhms: 220, referenceV: 5, responseSeconds: 0.8, reserveOn: 0.12, reserveOff: 0.15, application: 'generic-didactic-not-vw-calibration' } as const;
export const fuelFraction = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
export function initialFuelSender(level = 0.7): FuelSenderState {
  return { fault: 'none', stuckLevel: fuelFraction(level), fuseOpen: false, indicated: fuelFraction(level), reserve: level <= FUEL_SENDER_MODEL.reserveOn, elapsed: 0 };
}
export function decodeFuelVoltage(voltage: number): number | null {
  if (!Number.isFinite(voltage) || voltage <= 0.3 || voltage >= 4.7) return null;
  const resistance = FUEL_SENDER_MODEL.pullupOhms * voltage / (FUEL_SENDER_MODEL.referenceV - voltage);
  return fuelFraction((FUEL_SENDER_MODEL.emptyOhms - resistance) / (FUEL_SENDER_MODEL.emptyOhms - FUEL_SENDER_MODEL.fullOhms));
}
export function sampleFuelSender(state: FuelSenderState, level: number, powered: boolean) {
  const floatLevel = state.fault === 'float-stuck' ? fuelFraction(state.stuckLevel) : fuelFraction(level);
  const senderOhms = FUEL_SENDER_MODEL.emptyOhms + floatLevel * (FUEL_SENDER_MODEL.fullOhms - FUEL_SENDER_MODEL.emptyOhms);
  const supply = powered && !state.fuseOpen;
  const open = state.fault === 'signal-open' || state.fault === 'ground-open';
  const voltage = !supply ? 0 : open ? FUEL_SENDER_MODEL.referenceV : state.fault === 'short-ground' ? 0 : FUEL_SENDER_MODEL.referenceV * senderOhms / (FUEL_SENDER_MODEL.pullupOhms + senderOhms);
  const decoded = supply ? decodeFuelVoltage(voltage) : null;
  const currentMa = !supply || open ? 0 : (FUEL_SENDER_MODEL.referenceV - voltage) / FUEL_SENDER_MODEL.pullupOhms * 1000;
  const valid = decoded !== null;
  return { floatLevel, senderOhms, supply, voltage, currentMa, decoded, valid, faultLamp: supply && !valid, reserveLamp: supply && valid && state.reserve, needleAngle: (fuelFraction(state.indicated) - 0.5) * Math.PI * 0.8, status: !supply ? 'unpowered' : !valid ? 'signal-fault' : 'valid' };
}
export function advanceFuelSender(state: FuelSenderState, level: number, powered: boolean, seconds: number): FuelSenderState {
  if (!Number.isFinite(seconds) || seconds <= 0) return state;
  const sample = sampleFuelSender(state, level, powered);
  const target = sample.decoded ?? 0;
  const duration = Math.min(seconds, 60);
  const indicated = target + (state.indicated - target) * Math.exp(-duration / FUEL_SENDER_MODEL.responseSeconds);
  const reserve = sample.valid && (indicated <= FUEL_SENDER_MODEL.reserveOn || (state.reserve && indicated < FUEL_SENDER_MODEL.reserveOff));
  return { ...state, indicated, reserve, elapsed: state.elapsed + duration };
}