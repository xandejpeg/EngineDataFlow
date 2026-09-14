import { electricalSupply, type FuseCircuit } from './golfElectrical';
import { initialEgas, type EgasState } from './golfEgas';
import { advanceCooling, initialCooling, sampleCooling, type CoolingState } from './golfCooling';
import { initialWipers, type WiperState } from './golfWipers';
import { initialFuelSender, type FuelSenderState } from './golfFuelSender';
import { fuelConsumption } from './golfFuelConsumption';

export type InjectionMode = 'homogeneous' | 'stratified';
export type OperatingState = 'off' | 'key' | 'starting' | 'idle' | 'cruise' | 'acceleration' | 'regeneration' | 'overrun';
export type CamState = 'BALANCO' | 'ESCAPE' | 'ADMISSAO' | 'CRUZAMENTO';

export const GOLF = {
  bore: 82.5, stroke: 92.8, rod: 144, compressionHeight: 32.5,
  deck: 223, spacing: 88, tilt: 12 * Math.PI / 180,
  wheelRadius: (17 * 25.4 + 2 * 225 * 0.45) / 2,
  firingOffsets: [0, 540, 180, 360],
} as const;

export const OPERATING: Record<OperatingState, {
  label: string; rpm: number; mode: InjectionMode; lambda: number;
  throttle: number; advance: number; pulseMs: number; rail: number;
}> = {
  off: { label: 'Chave desligada', rpm: 0, mode: 'homogeneous', lambda: 1, throttle: 0, advance: 0, pulseMs: 0, rail: 0 },
  key: { label: 'Chave ligada', rpm: 0, mode: 'homogeneous', lambda: 1, throttle: 0, advance: 0, pulseMs: 0, rail: 0 },
  starting: { label: 'Partida', rpm: 250, mode: 'homogeneous', lambda: 0.85, throttle: 0.12, advance: 5, pulseMs: 2.5, rail: 30 },
  idle: { label: 'Marcha lenta', rpm: 780, mode: 'homogeneous', lambda: 1, throttle: 0.09, advance: 10, pulseMs: 2, rail: 40 },
  cruise: { label: 'Cruzeiro', rpm: 2000, mode: 'stratified', lambda: 2.5, throttle: 0.85, advance: 28, pulseMs: 1, rail: 70 },
  acceleration: { label: 'Aceleracao', rpm: 4000, mode: 'homogeneous', lambda: 1, throttle: 0.9, advance: 16, pulseMs: 2.5, rail: 110 },
  regeneration: { label: 'Regeneracao NOx', rpm: 2000, mode: 'homogeneous', lambda: 0.8, throttle: 0.35, advance: 16, pulseMs: 2.5, rail: 80 },
  overrun: { label: 'Corte na desaceleracao', rpm: 2400, mode: 'homogeneous', lambda: 4, throttle: 0.04, advance: 10, pulseMs: 0, rail: 40 },
};

export const wrap = (angle: number, period = 720): number => ((angle % period) + period) % period;
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
export const pulseDegrees = (milliseconds: number, rpm: number): number => milliseconds * rpm * 0.006;

export function pistonAt(angle: number) {
  const radians = angle * Math.PI / 180;
  const crankY = GOLF.stroke / 2 * Math.cos(radians);
  const crankZ = GOLF.stroke / 2 * Math.sin(radians);
  const pinY = crankY + Math.sqrt(GOLF.rod ** 2 - crankZ ** 2);
  return { crankY, crankZ, pinY, crownY: pinY + GOLF.compressionHeight };
}

export function valveLift(angle: number, opening: number, closing: number, peak: number): number {
  const position = wrap(angle - opening);
  const duration = wrap(closing - opening);
  return position >= duration ? 0 : peak * (1 - Math.cos(2 * Math.PI * position / duration)) / 2;
}

export function camState(intake: number, exhaust: number): CamState {
  if (intake > 0.001 && exhaust > 0.001) return 'CRUZAMENTO';
  if (intake > 0.001) return 'ADMISSAO';
  if (exhaust > 0.001) return 'ESCAPE';
  return 'BALANCO';
}

export function cylinderAt(theta: number, index: number, rpm: number, mode: InjectionMode, advance: number, pulseMs: number, camAdvance = 0) {
  const local = wrap(theta - GOLF.firingOffsets[index]);
  const intake = valveLift(local, 355 - camAdvance, 590 - camAdvance, 10);
  const exhaust = valveLift(local, 135, 370, 9.5);
  const start = mode === 'stratified' ? 640 : 380;
  const end = mode === 'stratified' ? 680 : 460;
  const duration = Math.min(end - start, pulseDegrees(pulseMs, rpm));
  const sparkAngle = wrap(720 - advance);
  const sinceSpark = wrap(local - sparkAngle);
  const beforeSpark = wrap(sparkAngle - local);
  const injecting = rpm > 0 && duration > 0 && local >= start && local < start + duration;
  const fueled = rpm > 0 && pulseMs > 0;
  return {
    local, ...pistonAt(local), intake, exhaust, state: camState(intake, exhaust),
    injectionStart: start, injectionEnd: start + duration, injecting,
    dwell: fueled && beforeSpark > 0 && beforeSpark <= pulseDegrees(3, rpm),
    spark: fueled && sinceSpark < pulseDegrees(1.2, rpm),
    combustion: fueled && (local < 100 || local >= sparkAngle),
    charge: fueled && local >= start && local < sparkAngle,
  };
}

export function engineToWorld(point: readonly [number, number, number]): [number, number, number] {
  const [axis, height, depth] = point;
  return [300 - axis, 415 + height * Math.cos(GOLF.tilt) + depth * Math.sin(GOLF.tilt),
    -70 + height * Math.sin(GOLF.tilt) - depth * Math.cos(GOLF.tilt)];
}

export function crossings(before: number, after: number, event: number, period: number): number {
  if (after <= before) return 0;
  return Math.floor((after - event) / period) - Math.floor((before - event) / period);
}

export interface GolfClock {
  readonly fuelSender: FuelSenderState;
  readonly wipers: WiperState;
  readonly cooling: CoolingState;
  readonly egas: EgasState;
  readonly angle: number;
  readonly elapsed: number;
  readonly temperature: number;
  readonly catalystTemperature: number;
  readonly nox: number;
  readonly fuel: number;
  readonly operation: OperatingState;
  readonly openFuse: FuseCircuit | null;
  /** Circuitos que o aluno desligou no painel de sistemas, somados ao fusivel aberto. */
  readonly powerOff: readonly FuseCircuit[];
}

export function openCircuits(clock: GolfClock): readonly FuseCircuit[] {
  return clock.openFuse ? [clock.openFuse, ...clock.powerOff] : clock.powerOff;
}

export function circuitOpen(clock: GolfClock, circuit: FuseCircuit): boolean {
  return clock.openFuse === circuit || clock.powerOff.includes(circuit);
}

export function initialClock(operation: OperatingState = 'idle'): GolfClock {
  const warm = !['off', 'key', 'starting'].includes(operation);
  return { fuelSender: initialFuelSender(), wipers: initialWipers(), cooling: initialCooling(warm), egas: initialEgas(), angle: 0, elapsed: 0, temperature: warm ? 90 : 20, catalystTemperature: warm ? 400 : 20, nox: 0.45, fuel: 0.7, operation, openFuse: null, powerOff: [] };
}

export function fuelSenderSupply(clock: GolfClock) {
  return clock.operation !== 'off' && !circuitOpen(clock, 'main') && !circuitOpen(clock, 'instrument');
}

export function wiperSupply(clock: GolfClock) {
  return clock.operation !== 'off' && !circuitOpen(clock, 'main');
}

export function advanceCoolingClock(clock: GolfClock, seconds: number): GolfClock {
  const sample = sampleGolf(clock);
  const result = advanceCooling(clock.cooling, { temperature: clock.temperature, rpm: sample.rpm, running: sample.running && OPERATING[clock.operation].pulseMs > 0, powered: sample.electrical.ecu && sample.electrical.fan, load: sample.throttle }, seconds);
  return { ...clock, ...result };
}

export function coolingSample(clock: GolfClock) {
  const sample = sampleGolf(clock);
  return sampleCooling(clock.cooling, { temperature: clock.temperature, rpm: sample.rpm, running: sample.running && OPERATING[clock.operation].pulseMs > 0, powered: sample.electrical.ecu && sample.electrical.fan, load: sample.throttle });
}

export function advanceClock(clock: GolfClock, seconds: number, thermalSeconds = seconds): GolfClock {
  const delta = Math.max(0, seconds);
  if (clock.operation === 'regeneration' && sampleGolf(clock).running && clock.elapsed + delta >= 3) {
    const first = Math.max(0, 3 - clock.elapsed);
    const rich = integrate(clock, first);
    return advanceCoolingClock(integrate({ ...rich, elapsed: 0, operation: 'cruise' }, delta - first), thermalSeconds);
  }
  return advanceCoolingClock(integrate(clock, delta), thermalSeconds);
}

function integrate(clock: GolfClock, delta: number): GolfClock {
  const config = OPERATING[clock.operation];
  const { rpm, running, consumption } = sampleGolf(clock);
  const angleDelta = clock.operation === 'overrun' && rpm > 0
    ? overrunIntegral(clock.elapsed + delta) - overrunIntegral(clock.elapsed)
    : 6 * rpm * delta;
  const targetCatalyst = running ? (clock.operation === 'regeneration' ? 650 : 450) : 20;
  return {
    ...clock, angle: clock.angle + angleDelta, elapsed: clock.elapsed + delta,
    catalystTemperature: targetCatalyst + (clock.catalystTemperature - targetCatalyst) * Math.exp(-delta / 35),
    nox: clamp(clock.nox + (running ? delta * (clock.operation === 'regeneration' ? -1 / 3 : config.mode === 'stratified' ? 1 / 60 : 0) : 0), 0, 1),
    fuel: Math.max(0, clock.fuel - consumption.tankFractionPerSecond * delta),
  };
}

function overrunIntegral(seconds: number): number {
  const falling = Math.min(seconds, (2400 - 780) / 150);
  return 6 * (2400 * falling - 75 * falling ** 2 + Math.max(0, seconds - falling) * 780);
}

const sampleCache = new WeakMap<GolfClock, Map<string, ReturnType<typeof computeSample>>>();

export function sampleGolf(clock: GolfClock, overrideMode?: InjectionMode) {
  const key = overrideMode ?? 'preset';
  let modes = sampleCache.get(clock);
  const cached = modes?.get(key);
  if (cached) return cached;
  const sample = computeSample(clock, overrideMode);
  if (!modes) { modes = new Map(); sampleCache.set(clock, modes); }
  modes.set(key, sample);
  return sample;
}

function computeSample(clock: GolfClock, overrideMode?: InjectionMode) {
  const config = OPERATING[clock.operation];
  const requestedRpm = clock.operation === 'overrun' ? Math.max(780, config.rpm - clock.elapsed * 150) : config.rpm;
  const powered = clock.operation !== 'off';
  const electrical = electricalSupply(powered, requestedRpm > 0 || (clock.operation === 'key' && clock.elapsed < 2), openCircuits(clock));
  const dryTank = clock.fuel <= 0;
  const available = electrical.ecu && electrical.ignition && !circuitOpen(clock, 'pump') && !dryTank;
  const rpm = available || clock.operation === 'starting' || clock.operation === 'overrun' ? requestedRpm : 0;
  const running = available && rpm > 0;
  const theta = wrap(clock.angle);
  const manualEgas = clock.egas.enabled && !overrideMode;
  const mode = overrideMode ?? (manualEgas ? 'homogeneous' : config.mode);
  const camAdvance = clock.operation === 'cruise' ? 20 : 0;
  const cylinders = GOLF.firingOffsets.map((_, index) => cylinderAt(theta, index, rpm, mode, config.advance, running ? config.pulseMs : 0, camAdvance));
  const pumpLow = electrical.pump;
  const pumpPhase = wrap(theta + camAdvance, 240) / 240;
  const pumpLift = (1 + Math.cos(pumpPhase * 2 * Math.PI)) / 2;
  const intakeDemand = cylinders.reduce((sum, cylinder) => sum + cylinder.intake / 10, 0);
  const throttle = manualEgas ? clock.egas.opening : mode === 'stratified' ? 0.85 : overrideMode ? 0.3 : config.throttle;
  const lambda = overrideMode ? (mode === 'stratified' ? 2.5 : 1) : manualEgas && config.pulseMs > 0 ? 1 : config.lambda;
  const map = rpm ? Math.max(20, (mode === 'stratified' ? 94 : 28 + throttle * 65) - intakeDemand * 3) : 101;
  const pedal = manualEgas ? clock.egas.pedal : config.throttle;
  const consumption = fuelConsumption({ rpm, throttle, mapKpa: map, lambda, injecting: running && config.pulseMs > 0 });
  return {
    theta, rpm, mode, camAdvance, cylinders, powered, electrical, running, pumpLow, pumpLift, throttle, lambda, map, pedal, consumption, dryTank,
    volts: !powered || rpm === 0 ? 12.6 : clock.operation === 'starting' ? 9.5 : 14.2,
    lowPressure: pumpLow ? 5 : electrical.ecu && !circuitOpen(clock, 'pump') && clock.operation === 'key' ? 5 * Math.exp(-(clock.elapsed - 2) / 30) : 0,
    railPressure: rpm && pumpLow ? clamp(config.rail + 3 * (pumpLift - 0.5) - cylinders.filter(cylinder => cylinder.injecting).length * 2, 30, 110) : 0,
    ckp: rpm > 0 && Math.floor(wrap(theta, 360) / 6) < 58 && wrap(theta, 6) < 3,
    cmp: rpm > 0 && wrap(theta + camAdvance) < 30,
    egr: clock.operation === 'cruise' ? 0.35 : 0,
    purge: electrical.ecu && rpm > 500 && clock.temperature > 70 && clock.operation === 'cruise' && wrap(clock.elapsed * 360, 360) < 180,
    lsf: lambda > 1.2 ? 0.1 : lambda < 0.95 ? 0.85 : 0.7,
  };
}

export type GolfSample = ReturnType<typeof sampleGolf>;