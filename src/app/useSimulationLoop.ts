import { useEffect } from 'react';
import { engine, useSimulationStore } from '@/state/simulationStore';
import { notifyFrameSubscribers, setLatestFrame } from '@/state/frameBus';

const UI_UPDATE_INTERVAL_MS = 50; // ~20 Hz for React panels

/**
 * Global animation loop. Advances the simulation with real elapsed time,
 * publishes the latest frame to the frame bus every animation frame (for the
 * 3D scene), and updates the React store at a throttled cadence (for panels).
 *
 * Uses a fixed maximum sub-step so the simulation stays time-consistent even
 * when the frame rate drops.
 */
export function useSimulationLoop(): void {
  const publishFrame = useSimulationStore((s) => s.publishFrame);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastUiUpdate = 0;
    const maxSubStep = 1 / 120;

    const tick = (now: number) => {
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.1) dt = 0.1; // clamp large gaps (tab switches)

      // Fixed sub-steps for temporal consistency.
      let remaining = dt;
      let frame = engine.computeFrame();
      while (remaining > 0) {
        const step = Math.min(remaining, maxSubStep);
        frame = engine.step(step);
        remaining -= step;
      }

      setLatestFrame(frame);

      if (now - lastUiUpdate >= UI_UPDATE_INTERVAL_MS) {
        lastUiUpdate = now;
        publishFrame(frame);
        notifyFrameSubscribers(frame);
        // Keep the scrubber position in sync while running.
        if (engine.clock.running) {
          useSimulationStore.setState({ crankAngleDeg: engine.clock.crankAngleDeg });
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [publishFrame]);
}
