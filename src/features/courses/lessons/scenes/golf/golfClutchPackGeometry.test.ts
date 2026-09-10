import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { CLUTCH_PACK_MODEL as model, clutchPackOffsets } from './golfClutchPackGeometry';
import { INPUT_SHAFT_MODEL } from './golfInputShaftGeometry';
import { SLAVE_CYLINDER_MODEL } from './golfClutchReference';
import { engineToWorld } from './golfPhysics';
import { CLUTCH_BEARING_MODEL } from './golfClutchBearingGeometry';

describe('estimated clutch pack', () => {
  it('mates the friction faces without overlapping the disc', () => {
    expect(model.pressure.end).toBe(model.disc.start);
    expect(model.disc.end).toBe(model.flywheel.start);
    expect(model.diaphragm.tip).toBe(CLUTCH_BEARING_MODEL.faceEnd);
    expect(model.disc.bore).toBeGreaterThan(INPUT_SHAFT_MODEL.envelopeRadius);
    expect(model.disc.hubStart).toBeGreaterThan(INPUT_SHAFT_MODEL.shoulder);
    expect(model.disc.hubEnd).toBeLessThan(INPUT_SHAFT_MODEL.end);
  });
  it('aligns with the shaft and reaches the existing crank end', () => {
    expect(model.position).toEqual(INPUT_SHAFT_MODEL.position);
    const end = new Vector3(0, model.crankAdapterEnd, 0).applyAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2)
      .add(new Vector3(...model.position)).add(new Vector3(...SLAVE_CYLINDER_MODEL.gearboxPosition));
    expect(end.distanceTo(new Vector3(...engineToWorld([322, 0, 0])))).toBeLessThan(1e-8);
  });
  it('separates the three main parts only in exploded inspection', () => {
    expect(clutchPackOffsets(false)).toEqual({ flywheel: 0, disc: 0, pressure: 0, cover: 0 });
    const offsets = clutchPackOffsets(true);
    expect(model.pressure.end + offsets.pressure).toBeLessThan(model.disc.start + offsets.disc);
    expect(model.disc.end + offsets.disc).toBeLessThan(model.flywheel.start + offsets.flywheel);
    expect(model.applicationStatus).toBe('generic-not-oe-selected');
  });
});