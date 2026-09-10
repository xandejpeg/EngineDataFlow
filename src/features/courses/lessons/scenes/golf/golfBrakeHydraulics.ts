import { VEHICLE_WHEELS, type VehicleWheelId } from './golfVehicleGeometry';
import { brakeGeometry } from './golfBrakeGeometry';

export type BrakeCircuit = 'primary' | 'secondary';
export type BrakeFault = 'none' | BrakeCircuit;

export const BRAKE_HYDRAULICS = {
  dimensionalStatus: 'estimated',
  applicationStatus: 'generic-diagonal-not-pr-verified',
  actuation: 'pedal-pressure-clamp-torque',
  pedalForceN: 500,
  pedalRatio: 4,
  assistedGain: 3.5,
  masterBoreMm: 23.8,
  frontPistonMm: 54,
  rearPistonMm: 38,
  friction: 0.38,
  takeupBar: 2,
  massKg: 1400,
  tyreRadiusM: 0.31715,
  roadFriction: 0.8,
} as const;

export interface BrakeState {
  pedal: number;
  assisted: boolean;
  fault: BrakeFault;
  primaryBar: number;
  secondaryBar: number;
  benchActive: boolean;
  speedMps: number;
  wheelAngle: number;
  distanceM: number;
  dissipatedJ: number;
}

export function initialBrakes(): BrakeState {
  return { pedal: 0, assisted: true, fault: 'none', primaryBar: 0, secondaryBar: 0, benchActive: false, speedMps: 0, wheelAngle: 0, distanceM: 0, dissipatedJ: 0 };
}

const unit = (value: number) => Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
const areaM2 = (diameterMm: number) => Math.PI * (diameterMm / 2000) ** 2;

export function wheelCircuit(id: VehicleWheelId): BrakeCircuit {
  return id === 'front-left' || id === 'rear-right' ? 'primary' : 'secondary';
}

export function sampleBrakes(state: BrakeState) {
  const pedal = unit(state.pedal);
  const demand = Math.max(0, (pedal - 0.03) / 0.97);
  const pedalForceN = demand * BRAKE_HYDRAULICS.pedalForceN;
  const masterForceN = pedalForceN * BRAKE_HYDRAULICS.pedalRatio * (state.assisted ? BRAKE_HYDRAULICS.assistedGain : 1);
  const targetBar = masterForceN / areaM2(BRAKE_HYDRAULICS.masterBoreMm) / 100000;
  const wheels = VEHICLE_WHEELS.map(wheel => {
    const circuit = wheelCircuit(wheel.id);
    const pressureBar = state.fault === circuit ? 0 : state[circuit === 'primary' ? 'primaryBar' : 'secondaryBar'];
    const pistonMm = wheel.axle === 'front' ? BRAKE_HYDRAULICS.frontPistonMm : BRAKE_HYDRAULICS.rearPistonMm;
    const pistonForceN = pressureBar * 100000 * areaM2(pistonMm);
    const clampN = 2 * Math.max(0, pressureBar - BRAKE_HYDRAULICS.takeupBar) * 100000 * areaM2(pistonMm);
    const torqueNm = clampN * BRAKE_HYDRAULICS.friction * brakeGeometry(wheel.axle).padRadius / 1000;
    return { id: wheel.id, circuit, pressureBar, pistonForceN, clampN, torqueNm, padTravelMm: 0.7 * Math.min(1, pressureBar / BRAKE_HYDRAULICS.takeupBar) };
  });
  const roadForceN = wheels.reduce((force, wheel) => force + Math.min(wheel.torqueNm / BRAKE_HYDRAULICS.tyreRadiusM, BRAKE_HYDRAULICS.massKg * 9.81 * BRAKE_HYDRAULICS.roadFriction / 4), 0);
  return { pedal, pedalForceN, masterForceN, targetBar, pedalAngle: pedal * 0.32, masterTravelMm: demand * (state.fault === 'none' ? 18 : 28), wheels, decelerationMps2: roadForceN / BRAKE_HYDRAULICS.massKg };
}

export function launchBrakeBench(state: BrakeState, speedKmh = 30): BrakeState {
  const speedMps = Number.isFinite(speedKmh) ? Math.max(0, Math.min(100, speedKmh)) / 3.6 : 0;
  return { ...state, benchActive: true, speedMps, distanceM: 0, dissipatedJ: 0 };
}

export function advanceBrakes(state: BrakeState, seconds: number): BrakeState {
  if (!Number.isFinite(seconds) || seconds <= 0) return state;
  const duration = Math.min(seconds, 60);
  const steps = Math.ceil(duration / 0.01);
  const delta = duration / steps;
  let next = { ...state };
  const target = sampleBrakes(state).targetBar;
  for (let step = 0; step < steps; step += 1) {
    for (const circuit of ['primary', 'secondary'] as const) {
      const key = circuit === 'primary' ? 'primaryBar' : 'secondaryBar';
      const requested = next.fault === circuit ? 0 : target;
      next[key] = next.fault === circuit ? 0 : requested + (next[key] - requested) * Math.exp(-delta / 0.06);
      if (next[key] < 0.0001) next[key] = 0;
    }
    if (!next.benchActive || next.speedMps <= 0) continue;
    const before = next.speedMps;
    const deceleration = sampleBrakes(next).decelerationMps2;
    const movingTime = deceleration > 0 ? Math.min(delta, before / deceleration) : delta;
    const speedMps = Math.max(0, before - deceleration * movingTime);
    const distance = (before + speedMps) * movingTime / 2;
    next = { ...next, speedMps, distanceM: next.distanceM + distance, wheelAngle: next.wheelAngle + distance / BRAKE_HYDRAULICS.tyreRadiusM, dissipatedJ: next.dissipatedJ + BRAKE_HYDRAULICS.massKg * (before ** 2 - speedMps ** 2) / 2 };
  }
  return next;
}