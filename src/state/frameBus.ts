import type { TelemetryFrame } from '@/simulation/types';

/**
 * Lightweight frame bus. The RAF loop writes the latest telemetry frame here
 * every animation frame. The 3D scene reads it imperatively (no React render),
 * while UI panels subscribe at a throttled cadence.
 */
let latest: TelemetryFrame | null = null;
const subscribers = new Set<(frame: TelemetryFrame) => void>();

export function setLatestFrame(frame: TelemetryFrame): void {
  latest = frame;
}

export function getLatestFrame(): TelemetryFrame | null {
  return latest;
}

export function notifyFrameSubscribers(frame: TelemetryFrame): void {
  for (const cb of subscribers) cb(frame);
}

export function subscribeFrame(cb: (frame: TelemetryFrame) => void): () => void {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}
