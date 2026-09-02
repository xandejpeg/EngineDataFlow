import { describe, expect, it } from 'vitest';
import {
  cylinderPhaseOffsetDeg,
  localCycleAngleDeg,
  phaseFromLocalAngle,
} from '../phasing';
import { computeValveState, IDEAL_VALVE_TIMING } from '../valveTrain';
import { FIRING_ORDER } from '../constants';

describe('cylinder phasing and firing order 1-3-4-2', () => {
  it('cylinder 1 fires (reaches power TDC) at global 360', () => {
    expect(cylinderPhaseOffsetDeg(1)).toBe(0);
    expect(localCycleAngleDeg(360, 1)).toBeCloseTo(360, 6);
  });

  it('firing events are separated by 180 degrees in order 1-3-4-2', () => {
    // Global crank angle at which each cylinder reaches local 360 (power TDC).
    const fireAngle = (cyl: number) => (360 - cylinderPhaseOffsetDeg(cyl) + 720) % 720;
    const angles = FIRING_ORDER.map(fireAngle);
    // Expected: 1 at 360, 3 at 540, 4 at 0(720), 2 at 180.
    expect(angles).toEqual([360, 540, 0, 180]);
  });

  it('phase mapping follows intake/compression/power/exhaust', () => {
    expect(phaseFromLocalAngle(90)).toBe('intake');
    expect(phaseFromLocalAngle(270)).toBe('compression');
    expect(phaseFromLocalAngle(450)).toBe('power');
    expect(phaseFromLocalAngle(630)).toBe('exhaust');
  });
});

describe('valve train (ideal timing)', () => {
  it('intake valve is open during intake stroke and closed during power', () => {
    const intakeMid = computeValveState(90, IDEAL_VALVE_TIMING);
    const powerMid = computeValveState(450, IDEAL_VALVE_TIMING);
    expect(intakeMid.intakeOpen).toBe(true);
    expect(intakeMid.intakeLiftM).toBeGreaterThan(0);
    expect(powerMid.intakeOpen).toBe(false);
  });

  it('exhaust valve is open during exhaust stroke', () => {
    const exhaustMid = computeValveState(630, IDEAL_VALVE_TIMING);
    const compressionMid = computeValveState(270, IDEAL_VALVE_TIMING);
    expect(exhaustMid.exhaustOpen).toBe(true);
    expect(compressionMid.exhaustOpen).toBe(false);
  });

  it('both valves are essentially closed near compression TDC (no overlap in ideal mode)', () => {
    const v = computeValveState(359, IDEAL_VALVE_TIMING);
    expect(v.intakeLiftM).toBeLessThan(1e-4);
    expect(v.exhaustLiftM).toBeLessThan(1e-4);
  });
});
