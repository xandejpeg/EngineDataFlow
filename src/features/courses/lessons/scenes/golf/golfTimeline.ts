import { advanceBodyControl, type BodyControlState } from './golfBodyControl';
import { advanceBrakes, type BrakeState } from './golfBrakeHydraulics';
import { bodyPower } from './golfBodyWiring';
import { advanceEgas } from './golfEgas';
import { advanceFuelSender } from './golfFuelSender';
import { advanceClock, fuelSenderSupply, sampleGolf, wiperSupply, type GolfClock } from './golfPhysics';
import { advanceWipers } from './golfWipers';

/**
 * Base de tempo unica do laboratorio: fisica, atuadores e animacoes 3D avancam
 * pelo delta desta linha do tempo, nunca pelo relogio do navegador.
 */
export interface GolfTimeState {
  /** Segundos simulados desde o ultimo zeramento. */
  time: number;
  /** Delta simulado do quadro atual, com sinal negativo quando rebobina. */
  delta: number;
  /** Multiplicador do tempo; negativo roda para tras. */
  rate: number;
  /** Camera lenta amarrada a rotacao para o virabrequim ficar visivel. */
  sync: boolean;
  /** Salto pendente em segundos, consumido no proximo quadro. */
  seek: number;
  /** Instante mais antigo ainda guardado no historico de rebobinagem. */
  floor: number;
}

export const GOLF_TIME: GolfTimeState = { time: 0, delta: 0, rate: 1, sync: false, seek: 0, floor: 0 };

export const TIME_RATES = [
  { value: -300, label: 'Reverso 300x' },
  { value: -30, label: 'Reverso 30x' },
  { value: -4, label: 'Reverso 4x' },
  { value: -1, label: 'Reverso 1x' },
  { value: 0.02, label: 'Lenta 0,02x' },
  { value: 0.1, label: 'Lenta 0,1x' },
  { value: 0.25, label: 'Lenta 0,25x' },
  { value: 1, label: 'Tempo real 1x' },
  { value: 4, label: 'Rapido 4x' },
  { value: 30, label: 'Rapido 30x' },
  { value: 300, label: 'Rapido 300x' },
  { value: 1800, label: 'Rapido 1800x' },
] as const;

export const TIME_STEPS = [-60, -10, -1, 1, 10, 60] as const;

export const TIMELINE = { sampleSeconds: 0.05, maxFrames: 4000, substepSeconds: 0.05, maxSubsteps: 12, maxFrameSeconds: 0.1 } as const;

export interface GolfWorld {
  readonly clock: GolfClock;
  readonly brakes: BrakeState;
  readonly body: BodyControlState;
}

export interface TimelineFrame {
  readonly time: number;
  readonly state: GolfWorld;
}

const history: TimelineFrame[] = [];

const pad = (value: number, size: number) => value.toString().padStart(size, '0');

/** Cronometro digital hh:mm:ss.mmm do tempo simulado. */
export function formatStopwatch(seconds: number): string {
  const total = Math.max(0, Math.round(seconds * 1000));
  return `${pad(Math.floor(total / 3600000), 2)}:${pad(Math.floor(total / 60000) % 60, 2)}:${pad(Math.floor(total / 1000) % 60, 2)}.${pad(total % 1000, 3)}`;
}

/** Quebra um avanco grande em passos curtos para a integracao nao perder resolucao. */
export function substeps(seconds: number): number {
  return Math.min(TIMELINE.maxSubsteps, Math.max(1, Math.ceil(seconds / TIMELINE.substepSeconds)));
}

export function advanceWorld(world: GolfWorld, seconds: number): GolfWorld {
  const steps = substeps(seconds);
  let next = world;
  for (let index = 0; index < steps; index += 1) next = stepWorld(next, seconds / steps);
  return next;
}

function stepWorld(world: GolfWorld, delta: number): GolfWorld {
  const advanced = advanceClock(world.clock, delta, delta);
  const sender = advanceFuelSender(advanced.fuelSender, advanced.fuel, fuelSenderSupply(advanced), delta);
  const wipers = advanceWipers(advanced.wipers, wiperSupply(advanced), delta);
  const moved: GolfClock = { ...advanced, fuelSender: sender, wipers };
  const clock = moved.egas.enabled ? { ...moved, egas: advanceEgas(moved.egas, sampleGolf(moved).electrical.ecu, delta) } : moved;
  const brakes = advanceBrakes(world.brakes, delta);
  return { clock, brakes, body: advanceBodyControl(world.body, bodyPower(clock, brakes), delta) };
}

export function recordFrame(frame: TimelineFrame): void {
  history.push(frame);
  if (history.length > TIMELINE.maxFrames) history.splice(0, history.length - TIMELINE.maxFrames);
  GOLF_TIME.floor = history[0].time;
}

/** Descarta os quadros posteriores ao instante pedido e devolve o ultimo anterior ou igual. */
export function rewindTo(time: number): TimelineFrame | null {
  let index = history.length - 1;
  while (index > 0 && history[index].time > time) index -= 1;
  history.splice(index + 1);
  return history[index] ?? null;
}

export function resetTimeline(): void {
  history.length = 0;
  GOLF_TIME.time = 0;
  GOLF_TIME.delta = 0;
  GOLF_TIME.seek = 0;
  GOLF_TIME.floor = 0;
}
