import { describe, expect, it } from 'vitest';
import { Matrix4, Vector3 } from 'three';
import { SLAVE_CYLINDER_MODEL } from './golfClutchReference';
import { CLUTCH_HYDRAULICS, CLUTCH_PRESSURE_PATH, CLUTCH_SUPPLY_PATH } from './golfHydraulics';

describe('clutch hydraulic topology', () => {
  it('terminates at the transformed slave port opening', () => {
    const port = new Vector3(-26, -59, 0)
      .applyMatrix4(new Matrix4().makeRotationZ(-Math.PI / 2))
      .add(new Vector3(...SLAVE_CYLINDER_MODEL.position))
      .add(new Vector3(...SLAVE_CYLINDER_MODEL.gearboxPosition));
    expect(port.distanceTo(new Vector3(...CLUTCH_HYDRAULICS.slavePort))).toBeLessThan(1e-8);
    expect(CLUTCH_PRESSURE_PATH.at(-1)).toEqual(CLUTCH_HYDRAULICS.slavePort);
  });
  it('connects the shared reservoir to the master without claiming factory dimensions', () => {
    expect(CLUTCH_SUPPLY_PATH[0]).toEqual(CLUTCH_HYDRAULICS.reservoirOutlet);
    expect(CLUTCH_SUPPLY_PATH.at(-1)).toEqual(CLUTCH_HYDRAULICS.masterSupply);
    expect(CLUTCH_PRESSURE_PATH[0]).toEqual(CLUTCH_HYDRAULICS.masterOutlet);
    expect(CLUTCH_HYDRAULICS.dimensionalStatus).toBe('estimated');
    expect(CLUTCH_HYDRAULICS.actuation).toBe('not-simulated');
    for (const path of [CLUTCH_SUPPLY_PATH, CLUTCH_PRESSURE_PATH]) {
      expect(path.flat().every(Number.isFinite)).toBe(true);
      path.slice(1).forEach((point, index) => expect(new Vector3(...point).distanceTo(new Vector3(...path[index]))).toBeGreaterThan(0));
    }
  });
});