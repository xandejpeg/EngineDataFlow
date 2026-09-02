import { celsiusToKelvin, clamp, mapRange } from './units';
import type { EngineConfiguration, LubricationState } from './types';
import type { FaultModifiers } from './faults/faultModifiers';

/**
 * Lubrication model. Oil temperature follows engine temperature; pressure
 * depends on pump speed (RPM), viscosity and clearances; film integrity drops
 * with low pressure, high temperature and contamination.
 *
 * Flow: sump -> pickup/filter -> pump -> relief valve -> filter -> galleries ->
 * bearings/crank/rods/cam -> return to sump.
 */
export function stepLubrication(
  prev: LubricationState,
  config: EngineConfiguration,
  mods: FaultModifiers,
  engineTempK: number,
  dtS: number,
): LubricationState {
  const oilTargetK = engineTempK + 8;
  const oilTempK = approach(prev.oilTempK, oilTargetK, dtS, 1.5);

  // Viscosity falls with temperature (relative to nominal at ~100 C).
  const viscosityRel = clamp(
    mapRange(oilTempK, celsiusToKelvin(40), celsiusToKelvin(130), 2.4, 0.5),
    0.35,
    2.6,
  );

  // Pump pressure rises with RPM, modulated by viscosity, oil level and faults.
  const pumpPressurePa =
    mapRange(config.rpm, 700, 6000, 1.2e5, 5.0e5) *
    clamp(viscosityRel, 0.5, 1.6) *
    clamp(mods.oilLevelRel, 0.2, 1) *
    mods.oilPressureMul;
  // Relief valve caps maximum pressure.
  const oilPressurePa = clamp(pumpPressurePa, 0.4e5, 6.0e5);

  const oilFlowRel = clamp(oilPressurePa / 4.5e5, 0.05, 1) * clamp(mods.oilLevelRel, 0.1, 1);
  const contamination = clamp(prev.contamination + mods.oilContaminationAdd * dtS * 0.05, 0, 1);

  // Film integrity: needs pressure, moderate temperature, low contamination.
  const pressureFactor = clamp(mapRange(oilPressurePa, 0.5e5, 2.5e5, 0.2, 1), 0, 1);
  const tempFactor = clamp(mapRange(oilTempK, celsiusToKelvin(150), celsiusToKelvin(110), 0.4, 1), 0.2, 1);
  const filmIntegrity = clamp(pressureFactor * tempFactor * (1 - 0.5 * contamination), 0, 1);

  return {
    oilTempK,
    oilPressurePa,
    oilFlowRel,
    filmIntegrity,
    contamination,
    viscosityRel,
  };
}

export function initialLubrication(ambientTempK: number): LubricationState {
  return {
    oilTempK: ambientTempK,
    oilPressurePa: 1.5e5,
    oilFlowRel: 0.3,
    filmIntegrity: 1,
    contamination: 0,
    viscosityRel: 2.2,
  };
}

function approach(current: number, target: number, dtS: number, rate: number): number {
  const alpha = 1 - Math.exp(-rate * dtS);
  return current + (target - current) * alpha;
}
