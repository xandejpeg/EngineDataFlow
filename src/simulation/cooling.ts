import { celsiusToKelvin } from './units';
import type { CoolingState, EngineConfiguration } from './types';
import { clamp } from './units';
import type { FaultModifiers } from './faults/faultModifiers';

const T_THERMOSTAT_OPEN_K = celsiusToKelvin(87);
const T_THERMOSTAT_FULL_K = celsiusToKelvin(97);
const T_FAN_ON_K = celsiusToKelvin(100);
const T_FAN_OFF_K = celsiusToKelvin(94);

/**
 * Simplified thermal network for the cooling system. Slow states (coolant, head,
 * piston temperature) are integrated over time toward equilibrium based on the
 * combustion heat load and heat rejection.
 */
export function stepCooling(
  prev: CoolingState,
  _config: EngineConfiguration,
  mods: FaultModifiers,
  combustionHeatW: number,
  ambientTempK: number,
  dtS: number,
): CoolingState {
  // Thermostat behavior (with stuck-fault overrides).
  let thermostatOpenFraction: number;
  if (mods.thermostatStuck === 'closed') {
    thermostatOpenFraction = 0;
  } else if (mods.thermostatStuck === 'open') {
    thermostatOpenFraction = 1;
  } else {
    thermostatOpenFraction = clamp(
      (prev.coolantTempK - T_THERMOSTAT_OPEN_K) / (T_THERMOSTAT_FULL_K - T_THERMOSTAT_OPEN_K),
      0,
      1,
    );
  }

  // Fan hysteresis.
  let fanOn = prev.fanOn;
  if (!mods.fanDisabled) {
    if (prev.coolantTempK > T_FAN_ON_K) fanOn = true;
    else if (prev.coolantTempK < T_FAN_OFF_K) fanOn = false;
  } else {
    fanOn = false;
  }

  const radiatorEffectiveness =
    clamp((0.3 + 0.7 * thermostatOpenFraction) * (fanOn ? 1.2 : 0.85), 0, 1.3) *
    mods.radiatorEffectivenessMul;

  // Heat balance: engine gains heat from combustion, rejects to radiator/air.
  const heatToCoolantW = combustionHeatW * 0.32 * mods.heatGenerationMul;
  const heatRejectedW =
    radiatorEffectiveness * 2600 * clamp(prev.coolantTempK - ambientTempK, 0, 200);

  const coolantThermalMass = 42000; // J/K (didactic lumped capacity)
  const dCoolant = ((heatToCoolantW - heatRejectedW) / coolantThermalMass) * dtS;
  const coolantTempK = clamp(prev.coolantTempK + dCoolant, ambientTempK, celsiusToKelvin(135));

  // Head/piston follow coolant with an offset proportional to load.
  const loadOffset = clamp(combustionHeatW / 90000, 0, 1);
  const headTargetK = coolantTempK + 25 + 60 * loadOffset;
  const pistonTargetK = coolantTempK + 60 + 180 * loadOffset;
  const headTempK = approach(prev.headTempK, headTargetK, dtS, 4);
  const pistonTempK = approach(prev.pistonTempK, pistonTargetK, dtS, 3);

  return {
    coolantTempK,
    headTempK,
    pistonTempK,
    thermostatOpenFraction,
    fanOn,
    radiatorEffectiveness: clamp(radiatorEffectiveness, 0, 1),
    heatRejectedW,
  };
}

export function initialCooling(ambientTempK: number): CoolingState {
  return {
    coolantTempK: ambientTempK,
    headTempK: ambientTempK,
    pistonTempK: ambientTempK,
    thermostatOpenFraction: 0,
    fanOn: false,
    radiatorEffectiveness: 0.5,
    heatRejectedW: 0,
  };
}

/** First-order approach of a value toward target with rate (1/s). */
function approach(current: number, target: number, dtS: number, rate: number): number {
  const alpha = 1 - Math.exp(-rate * dtS);
  return current + (target - current) * alpha;
}
