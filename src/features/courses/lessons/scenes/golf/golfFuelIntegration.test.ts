import { expect, it } from 'vitest';
import { advanceClock, fuelSenderSupply, initialClock, sampleGolf } from './golfPhysics';
import { advanceFuelSender, sampleFuelSender } from './golfFuelSender';

it('reads level with key on independently of engine ECU and pump fuse', () => {
  const clock = initialClock('key');
  for (const openFuse of ['ecu', 'pump'] as const) {
    const state = { ...clock, openFuse };
    expect(fuelSenderSupply(state)).toBe(true);
    expect(sampleFuelSender(state.fuelSender, state.fuel, fuelSenderSupply(state)).decoded).toBeCloseTo(0.7);
  }
  expect(fuelSenderSupply({ ...clock, openFuse: 'main' })).toBe(false);
  expect(fuelSenderSupply(initialClock('off'))).toBe(false);
});

it('does not cut the pump when only the sender circuit fails', () => {
  const clock = initialClock('idle');
  const failed = { ...clock, fuelSender: { ...clock.fuelSender, fault: 'signal-open' as const } };
  expect(sampleGolf(failed).pumpLow).toBe(true);
  expect(sampleFuelSender(failed.fuelSender, failed.fuel, true).valid).toBe(false);
});

it('keeps sensor stepping independent while consumption feeds the same level', () => {
  const clock = initialClock();
  const running = advanceClock(clock, 10, 0);
  expect(running.fuel).toBeLessThan(clock.fuel);
  expect(running.fuelSender).toBe(clock.fuelSender);
  const sensor = advanceFuelSender(running.fuelSender, running.fuel, fuelSenderSupply(running), 1);
  expect(sensor.elapsed).toBe(1);
  expect(sensor.indicated).toBeLessThan(clock.fuel);
  expect(clock.angle).toBe(0);
});