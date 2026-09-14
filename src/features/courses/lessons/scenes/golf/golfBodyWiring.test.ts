import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { bodyHingePoint, hatchStrutEndpoints, HATCH_ANGLE, HATCH_PIVOT, hoodPropEndpoints, HOOD_ANGLE, HOOD_PIVOT, HOOD_PROP_ATTACHMENT, bodyPower, bodyLampOn, BODY_WIRES, BODY_WIRING_NODES, bodyWireSample } from './golfBodyWiring.ts';
import { DOOR_IDS, initialBodyControl, sampleBodyControl } from './golfBodyControl';
import { initialClock } from './golfPhysics';
import { initialBrakes } from './golfBrakeHydraulics';
import { doorDefinition } from './golfDoorGeometry';
import { BODY_TOP } from './golfVehicleGeometry';

describe('body panel kinematics', () => {
  it('raises the hood front about the fixed rear X hinge', () => {
    expect(bodyHingePoint(HOOD_PIVOT, HOOD_PIVOT, HOOD_ANGLE)).toEqual(HOOD_PIVOT);
    expect(HOOD_PIVOT).toEqual([0, BODY_TOP.windshield[0][1], BODY_TOP.windshield[0][0]]);
    expect(bodyHingePoint([0, 795, -875], HOOD_PIVOT, HOOD_ANGLE)[1]).toBeGreaterThan(HOOD_PIVOT[1] + 800);
    expect(bodyHingePoint([0, 795, -875], HOOD_PIVOT, 0)).toEqual([0, 795, -875]);
  });
  it('raises the central hatch with negative X rotation and fixed roof hinge', () => {
    expect(bodyHingePoint(HATCH_PIVOT, HATCH_PIVOT, HATCH_ANGLE)).toEqual(HATCH_PIVOT);
    expect(HATCH_PIVOT).toEqual([0, BODY_TOP.rearGlass[0][1], BODY_TOP.rearGlass[0][0]]);
    expect(bodyHingePoint([0, 600, 3329], HATCH_PIVOT, HATCH_ANGLE)[1]).toBeGreaterThan(1800);
  });
  it('keeps the prop base fixed, attaches the deployed tip and retains a visible stowed rod', () => {
    const deployed = hoodPropEndpoints({ hood: 1, prop: true });
    const stowed = hoodPropEndpoints({ hood: 1, prop: false });
    expect(deployed.base).toEqual(stowed.base);
    expect(deployed.tip).toEqual(bodyHingePoint(HOOD_PROP_ATTACHMENT, HOOD_PIVOT, HOOD_ANGLE));
    expect(stowed.length).toBeCloseTo(deployed.length);
    expect(stowed.tip).not.toEqual(deployed.tip);
  });
  it.each([-1, 1])('attaches telescoping strut %s throughout travel', side => {
    const closed = hatchStrutEndpoints(side, 0);
    for (const hatch of [0, 0.25, 0.5, 0.75, 1]) {
      const strut = hatchStrutEndpoints(side, hatch);
      expect(strut.base).toEqual(closed.base);
      expect(strut.tip).toEqual(bodyHingePoint(strut.attachment, HATCH_PIVOT, hatch * HATCH_ANGLE));
      expect(strut.length).toBeCloseTo(new Vector3(...strut.base).distanceTo(new Vector3(...strut.tip)));
      expect(strut.length).toBeGreaterThanOrEqual(closed.length - 0.0001);
    }
  });
});

describe('body electrical consumers', () => {
  const power = { battery: true, ignition: true, braking: false };
  it('uses the actual clock main fuse/key and brake pedal threshold', () => {
    expect(bodyPower(initialClock('off'), initialBrakes())).toEqual({ battery: true, ignition: false, braking: false, lighting: true, comfort: true });
    expect(bodyPower({ ...initialClock(), openFuse: 'main' }, { ...initialBrakes(), pedal: 0.011 })).toEqual({ battery: false, ignition: true, braking: true, lighting: true, comfort: true });
    expect(bodyPower(initialClock(), { ...initialBrakes(), pedal: 0.01 }).braking).toBe(false);
    expect(bodyPower({ ...initialClock(), openFuse: 'ecu' }, initialBrakes()).battery).toBe(true);
  });
  it('switches low/high beams and isolates the entire left beam on an open lamp', () => {
    const state = { ...initialBodyControl(), lights: 'high' as const };
    for (const side of [-1, 1]) {
      expect(bodyLampOn(sampleBodyControl(state, power), 'low', side)).toBe(true);
      expect(bodyLampOn(sampleBodyControl(state, power), 'high', side)).toBe(true);
      expect(bodyLampOn(sampleBodyControl({ ...state, lights: 'low' }, power), 'high', side)).toBe(false);
      expect(bodyLampOn(sampleBodyControl({ ...state, lights: 'off' }, power), 'low', side)).toBe(false);
      expect(bodyLampOn(sampleBodyControl(state, { ...power, ignition: false }), 'high', side)).toBe(false);
    }
    const broken = sampleBodyControl({ ...state, fault: 'left-lamp-open' }, power);
    expect(bodyLampOn(broken, 'low', -1)).toBe(false);
    expect(bodyLampOn(broken, 'high', -1)).toBe(false);
    expect(bodyLampOn(broken, 'low', 1)).toBe(true);
    expect(bodyLampOn(broken, 'high', 1)).toBe(true);
  });
  it('separates position, brakes, hazards and ignition-controlled fog', () => {
    const state = { ...initialBodyControl(), lights: 'position' as const, indicator: 'hazard' as const, fog: true };
    const output = sampleBodyControl(state, power);
    expect(bodyLampOn(output, 'tail')).toBe(true);
    expect(bodyLampOn(output, 'low')).toBe(false);
    expect(bodyLampOn(output, 'brake')).toBe(false);
    expect(bodyLampOn(output, 'fog')).toBe(true);
    const keyOff = sampleBodyControl(state, { ...power, ignition: false, braking: true });
    expect(bodyLampOn(keyOff, 'brake')).toBe(true);
    expect(bodyLampOn(keyOff, 'fog')).toBe(false);
    for (const side of [-1, 1]) {
      expect(bodyLampOn(keyOff, 'indicator', side)).toBe(true);
      expect(bodyLampOn(sampleBodyControl({ ...state, elapsed: 0.5 }, power), 'indicator', side)).toBe(false);
    }
  });
  it('isolates lighting/comfort faults and cargo opening from cabin courtesy', () => {
    const state = initialBodyControl(); state.doors['rear-left'].open = 1; state.lights = 'high';
    const output = sampleBodyControl(state, power);
    expect(bodyLampOn(output, 'cabin', 1, state)).toBe(true);
    expect(bodyLampOn(output, 'cargo', 1, state)).toBe(false);
    state.hatch = 1;
    expect(bodyLampOn(sampleBodyControl(state, power), 'cargo', 1, state)).toBe(true);
    const lightingFailed = sampleBodyControl({ ...state, fault: 'lighting-fuse' }, { ...power, braking: true });
    for (const lamp of ['low', 'high', 'position', 'tail', 'brake', 'indicator', 'fog'] as const) expect(bodyLampOn(lightingFailed, lamp)).toBe(false);
    expect(bodyLampOn(lightingFailed, 'cargo', 1, state)).toBe(true);
    const comfortFailed = sampleBodyControl({ ...state, fault: 'comfort-fuse' }, power);
    expect(bodyLampOn(comfortFailed, 'low')).toBe(true);
    expect(bodyLampOn(comfortFailed, 'cabin', 1, state)).toBe(false);
    expect(bodyLampOn(comfortFailed, 'cargo', 1, state)).toBe(false);
    const mainFailed = sampleBodyControl(state, { ...power, battery: false });
    for (const lamp of ['low', 'high', 'position', 'tail', 'brake', 'indicator', 'fog', 'cabin', 'cargo'] as const) expect(bodyLampOn(mainFailed, lamp, 1, state)).toBe(false);
  });
});

describe('body wiring topology', () => {
  it('provides distinct fused feeds and returns for every lamp/door without using the engine ECU', () => {
    expect(new Set(BODY_WIRES.map(route => route.id)).size).toBe(BODY_WIRES.length);
    for (const route of BODY_WIRES) {
      expect(route.points[0]).toEqual(BODY_WIRING_NODES[route.from]);
      expect(route.points.at(-1)).toEqual(BODY_WIRING_NODES[route.to]);
      expect(route.from + route.to).not.toMatch(/ecu/i);
      expect(route.points.flat().every(Number.isFinite)).toBe(true);
    }
    for (const id of ['head-left', 'head-right', 'rear-left', 'rear-right', 'fog-left', 'fog-right', 'cabin', 'cargo', 'hatch-stop', ...DOOR_IDS.map(id => `door-${id}`)]) {
      expect(BODY_WIRES.some(route => route.to === id && !route.return)).toBe(true);
      expect(BODY_WIRES.some(route => route.from === id && route.return && route.to === 'ground')).toBe(true);
    }
    for (const id of DOOR_IDS) expect(BODY_WIRING_NODES[`door-${id}`]).toEqual(doorDefinition(id).pivot);
    expect(BODY_WIRES.find(route => route.id === 'lighting-controller')?.from).toBe('lighting-fuse');
    expect(BODY_WIRES.find(route => route.id === 'comfort-controller')?.from).toBe('comfort-fuse');
  });
  it('keeps battery upstream live, cuts downstream on main fuse, and leaves returns at zero volts', () => {
    const state = { ...initialBodyControl(), lights: 'high' as const, hatch: 1 };
    const output = sampleBodyControl(state, { battery: false, ignition: true, braking: true });
    for (const route of BODY_WIRES) {
      const sample = bodyWireSample(route, state, output);
      expect(sample.voltage).toBe(route.circuit === 'battery' ? 12 : 0);
      expect(sample.active).toBe(route.circuit === 'battery');
    }
    const on = sampleBodyControl(state, { battery: true, ignition: true, braking: true });
    for (const route of BODY_WIRES.filter(route => route.return)) expect(bodyWireSample(route, state, on).voltage).toBe(0);
  });
  it('moves both hatch-stop feed and return endpoints with the actual hinge', () => {
    const state = { ...initialBodyControl(), hatch: 1 };
    const output = sampleBodyControl(state, { battery: true, ignition: true, braking: true });
    const moving = bodyHingePoint(BODY_WIRING_NODES['hatch-stop'], HATCH_PIVOT, HATCH_ANGLE);
    const feed = BODY_WIRES.find(route => route.id === 'hatch-stop-feed')!;
    const ground = BODY_WIRES.find(route => route.id === 'hatch-stop-return')!;
    expect(bodyWireSample(feed, state, output).points.at(-1)).toEqual(moving);
    expect(bodyWireSample(ground, state, output).points[0]).toEqual(moving);
  });
  it('routes actual door commands and feedback without inventing a bus voltage or protocol', () => {
    const state = { ...initialBodyControl(), locked: true };
    const power = { battery: true, ignition: true, braking: false };
    for (const id of DOOR_IDS) {
      state.doors[id].windowTarget = 0.25; state.doors[id].window = 0.6; state.doors[id].open = 0.4;
      const output = sampleBodyControl(state, power);
      const command = BODY_WIRES.find(route => route.id === `door-${id}-command`)!;
      const feedback = BODY_WIRES.find(route => route.id === `door-${id}-feedback`)!;
      expect(bodyWireSample(command, state, output).signal).toEqual({ locked: true, windowTarget: 0.25, windowPower: true });
      expect(bodyWireSample(command, state, output).voltage).toBeNull();
      expect(bodyWireSample(feedback, state, output).signal).toEqual({ open: 0.4, window: 0.6 });
      expect(bodyWireSample(command, state, sampleBodyControl({ ...state, fault: 'comfort-fuse' }, power)).signal).toBeNull();
    }
  });
});