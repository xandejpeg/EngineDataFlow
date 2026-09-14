export type CoolingFault = 'none' | 'pump' | 'thermostat-closed' | 'thermostat-open' | 'fan';

export const COOLING_MODEL = {
  application: 'generic-didactic-not-vw-calibration',
  engineCapacityJK: 85000,
  radiatorCapacityJK: 18000,
  thermostatStartC: 85,
  thermostatFullC: 98,
  fanOnC: 102,
  fanOffC: 95,
  ambientC: 20,
} as const;

export interface CoolingState {
  radiatorC: number;
  fanRequested: boolean;
  fanPowered: boolean;
  fault: CoolingFault;
  fanFuseOpen: boolean;
  heater: boolean;
  airflowKmh: number;
  elapsed: number;
  flowLitres: number;
  fanAngle: number;
  heatInputJ: number;
  heatRejectedJ: number;
}

export interface CoolingInput {
  temperature: number;
  rpm: number;
  running: boolean;
  powered: boolean;
  load: number;
}

export function initialCooling(warm = true): CoolingState {
  return { radiatorC: warm ? 65 : 20, fanRequested: false, fanPowered: false, fault: 'none', fanFuseOpen: false, heater: false, airflowKmh: 0, elapsed: 0, flowLitres: 0, fanAngle: 0, heatInputJ: 0, heatRejectedJ: 0 };
}

const clamp = (value: number, min: number, max: number) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;

export function sampleCooling(state: CoolingState, input: CoolingInput) {
  const thermostat = state.fault === 'thermostat-closed' ? 0 : state.fault === 'thermostat-open' ? 1 : clamp((input.temperature - COOLING_MODEL.thermostatStartC) / (COOLING_MODEL.thermostatFullC - COOLING_MODEL.thermostatStartC), 0, 1);
  const pumpLpm = state.fault === 'pump' ? 0 : clamp(input.rpm * 0.012, 0, 65);
  const radiatorLpm = pumpLpm * thermostat * 0.85;
  const heaterLpm = pumpLpm * 0.15;
  const bypassLpm = pumpLpm - radiatorLpm - heaterLpm;
  const fanRequested = input.temperature >= COOLING_MODEL.fanOnC || (state.fanRequested && input.temperature > COOLING_MODEL.fanOffC);
  const fanPowered = input.powered && fanRequested && !state.fanFuseOpen && state.fault !== 'fan';
  const heatInputW = input.running ? 5000 + clamp(input.rpm, 0, 7000) * 3 + clamp(input.load, 0, 1) * 15000 : 0;
  const exchangeW = radiatorLpm / 60 * 3600 * (input.temperature - state.radiatorC);
  const radiatorLossW = (22 + clamp(state.airflowKmh, 0, 130) * 4 + (fanPowered ? 320 : 0)) * (state.radiatorC - COOLING_MODEL.ambientC);
  const engineLossW = (24 + (state.heater ? heaterLpm * 5 : 0)) * (input.temperature - COOLING_MODEL.ambientC);
  return { thermostat, pumpLpm, radiatorLpm, heaterLpm, bypassLpm, fanRequested, fanPowered, heatInputW, exchangeW, radiatorLossW, engineLossW, warning: input.temperature >= 115 ? 'overheat' : 'normal' };
}

export function advanceCooling(state: CoolingState, input: CoolingInput, seconds: number): { cooling: CoolingState; temperature: number } {
  if (!Number.isFinite(seconds) || seconds <= 0) return { cooling: state, temperature: input.temperature };
  const duration = Math.min(seconds, 600);
  const steps = Math.ceil(duration / 0.1);
  const delta = duration / steps;
  let cooling = { ...state };
  let temperature = input.temperature;
  for (let step = 0; step < steps; step += 1) {
    const sample = sampleCooling(cooling, { ...input, temperature });
    temperature += (sample.heatInputW - sample.exchangeW - sample.engineLossW) * delta / COOLING_MODEL.engineCapacityJK;
    cooling = { ...cooling,
      radiatorC: cooling.radiatorC + (sample.exchangeW - sample.radiatorLossW) * delta / COOLING_MODEL.radiatorCapacityJK,
      fanRequested: sample.fanRequested, fanPowered: sample.fanPowered,
      elapsed: cooling.elapsed + delta, flowLitres: cooling.flowLitres + sample.pumpLpm / 60 * delta,
      fanAngle: cooling.fanAngle + (sample.fanPowered ? 24 * delta : 0),
      heatInputJ: cooling.heatInputJ + sample.heatInputW * delta,
      heatRejectedJ: cooling.heatRejectedJ + (sample.engineLossW + sample.radiatorLossW) * delta,
    };
  }
  return { cooling, temperature };
}