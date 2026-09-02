import { useEffect, useState } from 'react';
import type { TelemetryFrame } from '@/simulation/types';
import { subscribeFrame } from '@/state/frameBus';
import { useSimulationStore } from '@/state/simulationStore';

/**
 * Subscribe to the frame bus at the throttled UI cadence. Returns the latest
 * telemetry frame for panels/charts without re-rendering on every RAF tick.
 */
export function useTelemetry(): TelemetryFrame | null {
  const storeFrame = useSimulationStore((s) => s.frame);
  const [frame, setFrame] = useState<TelemetryFrame | null>(storeFrame);

  useEffect(() => {
    const unsub = subscribeFrame(setFrame);
    return unsub;
  }, []);

  return frame ?? storeFrame;
}
