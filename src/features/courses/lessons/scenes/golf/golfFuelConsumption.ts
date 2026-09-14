/**
 * Cadeia de consumo: pedal -> abertura da borboleta -> massa de ar admitida -> massa de combustivel
 * pedida pela ECU -> vazao entregue pela bomba -> nivel do tanque.
 */
export const FUEL_CONSUMPTION = {
  displacementL: 1.984,
  cylinders: 4,
  tankLitres: 55,
  densityGPerL: 745,
  stoichiometricAfr: 14.7,
  intakeAirC: 25,
  injectorFlowMgPerMs: 3,
  gasConstantJPerKgK: 287.05,
  application: 'generic-didactic-not-vw-calibration',
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Densidade do ar admitido em g/L, que numericamente equivale a kg/m3. */
export function intakeAirDensity(mapKpa: number, airC = FUEL_CONSUMPTION.intakeAirC): number {
  if (!Number.isFinite(mapKpa) || mapKpa <= 0) return 0;
  return mapKpa * 1000 / (FUEL_CONSUMPTION.gasConstantJPerKgK * (airC + 273.15));
}

export function volumetricEfficiency(rpm: number, throttle: number): number {
  const opening = clamp(throttle, 0, 1);
  const speed = clamp(1 - Math.abs(rpm - 3500) / 6000, 0.8, 1);
  return clamp((0.5 + 0.45 * opening) * speed, 0, 1.05);
}

/** Massa de ar admitida em g/s pelo metodo speed-density (rotacao x cilindrada x rendimento x densidade). */
export function airMassFlow(rpm: number, throttle: number, mapKpa: number): number {
  if (!Number.isFinite(rpm) || rpm <= 0) return 0;
  return rpm / 120 * FUEL_CONSUMPTION.displacementL * volumetricEfficiency(rpm, throttle) * intakeAirDensity(mapKpa);
}

/** Massa de combustivel em g/s que a ECU pede para a relacao lambda alvo. */
export function fuelMassFlow(airFlowGs: number, lambda: number): number {
  if (!Number.isFinite(airFlowGs) || airFlowGs <= 0 || !Number.isFinite(lambda) || lambda <= 0) return 0;
  return airFlowGs / (FUEL_CONSUMPTION.stoichiometricAfr * lambda);
}

export interface ConsumptionInput {
  rpm: number;
  throttle: number;
  mapKpa: number;
  lambda: number;
  injecting: boolean;
}

export function fuelConsumption({ rpm, throttle, mapKpa, lambda, injecting }: ConsumptionInput) {
  const airFlowGs = airMassFlow(rpm, throttle, mapKpa);
  const fuelFlowGs = injecting ? fuelMassFlow(airFlowGs, lambda) : 0;
  const injectionsPerSecond = rpm > 0 ? rpm / 120 * FUEL_CONSUMPTION.cylinders : 0;
  const mgPerInjection = injectionsPerSecond > 0 ? fuelFlowGs * 1000 / injectionsPerSecond : 0;
  const pulseMs = mgPerInjection / FUEL_CONSUMPTION.injectorFlowMgPerMs;
  const litresPerSecond = fuelFlowGs / FUEL_CONSUMPTION.densityGPerL;
  return {
    airFlowGs,
    fuelFlowGs,
    airFuelRatio: fuelFlowGs > 0 ? airFlowGs / fuelFlowGs : 0,
    injectionsPerSecond,
    mgPerInjection,
    pulseMs,
    dutyPercent: rpm > 0 ? clamp(pulseMs * rpm / 1200, 0, 100) : 0,
    litresPerSecond,
    litresPerHour: litresPerSecond * 3600,
    tankFractionPerSecond: litresPerSecond / FUEL_CONSUMPTION.tankLitres,
  };
}

export type FuelConsumptionSample = ReturnType<typeof fuelConsumption>;

export const tankLitres = (fraction: number) => clamp(fraction, 0, 1) * FUEL_CONSUMPTION.tankLitres;

/** Autonomia em segundos com a vazao atual; Infinity quando o motor nao esta consumindo. */
export function rangeSeconds(fraction: number, litresPerSecond: number): number {
  return litresPerSecond > 0 ? tankLitres(fraction) / litresPerSecond : Infinity;
}
