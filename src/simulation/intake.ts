import { AFR_STOICH, LHV, P_ATMOSPHERE } from './constants';
import type {
  EngineConfiguration,
  IntakeExhaustState,
  MixtureState,
  TurboState,
} from './types';
import { clamp } from './units';
import type { FaultModifiers } from './faults/faultModifiers';

/**
 * Intake / exhaust breathing model. Produces manifold pressure, volumetric
 * efficiency, trapped air mass and mixture (lambda/AFR, fuel flow).
 */
export function computeIntake(
  config: EngineConfiguration,
  mods: FaultModifiers,
  turbo: TurboState,
): IntakeExhaustState {
  const { throttle, rpm, volumetricEfficiencyBase } = config;

  // Throttle governs manifold pressure below atmospheric (NA) with a small idle bleed.
  const throttleFactor = 0.12 + 0.88 * throttle;
  let manifoldPressurePa =
    P_ATMOSPHERE * throttleFactor * mods.manifoldPressureMul * (1 - 0.5 * mods.intakeRestriction);

  const boostPa = turbo.enabled ? turbo.boostPa : 0;
  manifoldPressurePa += boostPa;

  // Volumetric efficiency: peaks in the mid RPM range (torque curve shape).
  const rpmShape = 1 - Math.pow((rpm - 3200) / 3600, 2) * 0.35;
  const volumetricEfficiency = clamp(
    volumetricEfficiencyBase * clamp(rpmShape, 0.6, 1.05) * mods.volumetricEfficiencyMul,
    0.2,
    1.15,
  );

  const exhaustBackpressurePa =
    P_ATMOSPHERE * (1 + 0.15 * (rpm / 6000)) * mods.backpressureMul;

  return {
    manifoldPressurePa,
    boostPa,
    exhaustBackpressurePa,
    airMassPerCycleKg: 0, // filled by thermodynamics using displacement
    volumetricEfficiency,
  };
}

export function computeMixture(
  config: EngineConfiguration,
  mods: FaultModifiers,
  airMassPerCycleKg: number,
): MixtureState {
  const stoichAfr = AFR_STOICH[config.fuel];
  const lambda = clamp(config.targetLambda + mods.lambdaAdd, 0.6, 1.6);
  const afr = lambda * stoichAfr;

  const cyclesPerSecond = config.rpm / 120; // 4-stroke: one power event per 2 revs
  const airMassFlowKgs = airMassPerCycleKg * config.geometry.cylinderCount * cyclesPerSecond;
  const fuelMassFlowKgs = airMassFlowKgs / afr;

  return { lambda, afr, stoichAfr, airMassFlowKgs, fuelMassFlowKgs };
}

/** Chemical heat released per cylinder per cycle (J). */
export function heatPerCycleJ(
  fuelType: EngineConfiguration['fuel'],
  airMassPerCycleKg: number,
  afr: number,
  combustionEff: number,
): number {
  const fuelMassKg = airMassPerCycleKg / afr;
  return fuelMassKg * LHV[fuelType] * combustionEff;
}
