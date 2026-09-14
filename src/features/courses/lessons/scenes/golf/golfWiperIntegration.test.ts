import { expect, it } from 'vitest';
import { advanceClock, initialClock, wiperSupply } from './golfPhysics';
import { advanceWipers } from './golfWipers';

it('powers the body accessory with ignition independently of ECU and RPM', () => {
  const clock = initialClock('key');
  expect(wiperSupply(clock)).toBe(true);
  expect(wiperSupply({ ...clock, openFuse: 'ecu' })).toBe(true);
  expect(wiperSupply({ ...clock, openFuse: 'main' })).toBe(false);
  expect(wiperSupply(initialClock('off'))).toBe(false);
});

it('keeps wiper time separate from engine and thermal advances', () => {
  const clock = initialClock();
  const wipers = advanceWipers({ ...clock.wipers, mode: 'low' }, true, 0.25);
  const mechanical = advanceClock({ ...clock, wipers }, 0.001, 60);
  expect(mechanical.wipers).toBe(wipers);
  expect(wipers.elapsed).toBeCloseTo(0.25);
  expect(clock.angle).toBe(0);
});