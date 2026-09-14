import { expect, it } from 'vitest';
import { advanceBodyControl, commandDoor, commandHatch, commandHood, commandLock, commandProp, commandWindow, initialBodyControl, sampleBodyControl } from './golfBodyControl';
const power = { battery: true, ignition: true, braking: false };

it('powers windows only with comfort supply and ignition while doors remain mechanical', () => {
  const requested = commandDoor(commandWindow(initialBodyControl(), 'front-left', 0), 'front-left', true);
  const off = advanceBodyControl(requested, { ...power, ignition: false }, 2);
  expect(off.doors['front-left'].open).toBe(1); expect(off.doors['front-left'].window).toBe(1);
  const on = advanceBodyControl(off, power, 2.5);
  expect(on.doors['front-left'].window).toBe(0);
  expect(sampleBodyControl(on, power).cabin).toBe(true);
});
it('locks closed doors, blocks outside opening and respects comfort fuse and hatch release', () => {
  const locked = commandLock(initialBodyControl(), true, power);
  expect(commandDoor(locked, 'rear-right', true)).toBe(locked);
  expect(commandHatch(locked, true, power)).toBe(locked);
  const failed = { ...locked, fault: 'comfort-fuse' as const };
  expect(commandLock(failed, false, power)).toBe(failed);
  expect(commandLock(commandDoor(initialBodyControl(), 'front-left', true), true, power).locked).toBe(false);
});
it('requires hood release and prevents closure with deployed prop', () => {
  const initial = initialBodyControl(); expect(commandHood(initial, true)).toBe(initial);
  const opened = advanceBodyControl(commandHood({ ...initial, hoodReleased: true }, true), power, 2);
  const supported = commandProp(opened, true); expect(supported.prop).toBe(true);
  expect(commandHood(supported, false)).toBe(supported);
  const closed = advanceBodyControl(commandHood(commandProp(supported, false), false), power, 2);
  expect(closed.hood).toBe(0); expect(closed.hoodReleased).toBe(false);
});
it('gates lights by switch ignition and branch fuse without cutting comfort', () => {
  const state = { ...initialBodyControl(), lights: 'high' as const };
  expect(sampleBodyControl(state, power).high).toBe(true);
  expect(sampleBodyControl(state, { ...power, ignition: false }).low).toBe(false);
  expect(sampleBodyControl(state, { ...power, ignition: false }).position).toBe(true);
  const failed = sampleBodyControl({ ...state, fault: 'lighting-fuse' }, power);
  expect(failed.low).toBe(false); expect(failed.windowPower).toBe(true);
  const lampOpen = sampleBodyControl({ ...state, fault: 'left-lamp-open' }, power);
  expect(lampOpen.leftLow).toBe(false); expect(lampOpen.low).toBe(true);
});
it('allows hazards without ignition, blinks both sides and connects brake signal', () => {
  const state = { ...initialBodyControl(), indicator: 'hazard' as const };
  const off = { ...power, ignition: false, braking: true };
  expect(sampleBodyControl(state, off).leftIndicator).toBe(true);
  expect(sampleBodyControl(advanceBodyControl(state, off, 0.5), off).rightIndicator).toBe(false);
  expect(sampleBodyControl(state, off).brake).toBe(true);
  expect(sampleBodyControl(state, { ...off, battery: false }).lampCurrent).toBe(0);
});