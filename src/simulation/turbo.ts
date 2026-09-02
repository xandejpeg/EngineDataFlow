import { barToPa, celsiusToKelvin, clamp, mapRange } from './units';
import type { EngineConfiguration, TurboState } from './types';
import type { FaultModifiers } from './faults/faultModifiers';

/**
 * Optional turbocharger module. The turbine is driven by exhaust energy
 * (approximated from RPM and load); boost is limited by the wastegate. Bearing
 * temperature rises when lubrication is deficient (hot-shutdown risk).
 */
export function stepTurbo(
  prev: TurboState,
  config: EngineConfiguration,
  mods: FaultModifiers,
  exhaustTempK: number,
  dtS: number,
): TurboState {
  if (!config.turboEnabled) {
    return {
      enabled: false,
      shaftRpm: 0,
      boostPa: 0,
      bearingTempK: celsiusToKelvin(20),
      lubricationOk: true,
      wastegateOpenFraction: 1,
    };
  }

  // Wastegate control (stuck faults override normal regulation).
  const targetBoostPa = barToPa(config.boostBar);
  let wastegateOpenFraction: number;
  if (mods.wastegateStuck === 'open') wastegateOpenFraction = 1;
  else if (mods.wastegateStuck === 'closed') wastegateOpenFraction = 0;
  else wastegateOpenFraction = clamp(prev.boostPa / (targetBoostPa + 1) - 0, 0, 1);

  // Available boost from exhaust energy (RPM + throttle), capped by wastegate.
  const availableBoostPa =
    mapRange(config.rpm, 1500, 6000, 0, barToPa(1.1)) * (0.3 + 0.7 * config.throttle);
  const maxBoostPa =
    mods.wastegateStuck === 'closed'
      ? availableBoostPa // overboost: no relief
      : Math.min(availableBoostPa, targetBoostPa);
  const boostPa = approach(prev.boostPa, clamp(maxBoostPa, 0, barToPa(1.6)), dtS, 3);

  const shaftRpm = mapRange(boostPa, 0, barToPa(1.2), 20000, 180000);

  const lubricationOk = mods.turboLubricationOk;
  const bearingTargetK = lubricationOk
    ? celsiusToKelvin(120) + (exhaustTempK - celsiusToKelvin(600)) * 0.15
    : celsiusToKelvin(320);
  const bearingTempK = approach(prev.bearingTempK, bearingTargetK, dtS, 1.2);

  return {
    enabled: true,
    shaftRpm,
    boostPa,
    bearingTempK: clamp(bearingTempK, celsiusToKelvin(20), celsiusToKelvin(400)),
    lubricationOk,
    wastegateOpenFraction,
  };
}

export function initialTurbo(): TurboState {
  return {
    enabled: false,
    shaftRpm: 0,
    boostPa: 0,
    bearingTempK: celsiusToKelvin(20),
    lubricationOk: true,
    wastegateOpenFraction: 1,
  };
}

function approach(current: number, target: number, dtS: number, rate: number): number {
  const alpha = 1 - Math.exp(-rate * dtS);
  return current + (target - current) * alpha;
}
