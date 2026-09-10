import { describe, expect, it } from 'vitest';
import { CLUTCH_RELEASE_REFERENCE, SLAVE_CYLINDER_MODEL } from './golfClutchReference';

describe('Acionamento da embreagem 02S', () => {
  it('documenta cilindro externo, haste, alavanca e rolamento separado', () => {
    expect(CLUTCH_RELEASE_REFERENCE.gearboxFamily).toBe('02S');
    expect(CLUTCH_RELEASE_REFERENCE.figure).toBe('A30-0005');
    expect(CLUTCH_RELEASE_REFERENCE.slaveCylinder).toEqual({ item: 10, location: 'external', mountingBoltItem: 9, plungerItem: 11 });
    expect(CLUTCH_RELEASE_REFERENCE.releaseLever.item).toBe(7);
    expect(CLUTCH_RELEASE_REFERENCE.releaseBearing).toEqual({ item: 8, separateFromSlaveCylinder: true });
  });

  it('nao apresenta proporcoes e posicao provisoria como cotas de fabrica', () => {
    expect(CLUTCH_RELEASE_REFERENCE.factoryDimensions).toBeNull();
    expect(CLUTCH_RELEASE_REFERENCE.exactPartNumber).toBeNull();
    expect(SLAVE_CYLINDER_MODEL.dimensionalStatus).toBe('estimated');
    expect(SLAVE_CYLINDER_MODEL.placementStatus).toBe('estimated');
    expect(SLAVE_CYLINDER_MODEL.actuation).toBe('not-simulated');
  });

  it('mantem haste coaxial saindo da coifa e duas fixacoes laterais', () => {
    const { bodyProfile, bootProfile, plunger, mountingOffsets } = SLAVE_CYLINDER_MODEL;
    expect(bodyProfile.at(-1)?.[1]).toBe(plunger.start);
    expect(bootProfile[0][1]).toBe(plunger.start);
    expect(Math.max(...bootProfile.map(([, axial]) => axial))).toBeLessThan(plunger.end);
    expect(Math.min(...bootProfile.map(([radius]) => radius))).toBeGreaterThan(plunger.radius);
    expect(mountingOffsets).toEqual([-24, 24]);
    for (const [radius, axial] of [...bodyProfile, ...bootProfile]) {
      expect(Number.isFinite(radius) && Number.isFinite(axial)).toBe(true);
      expect(radius).toBeGreaterThanOrEqual(0);
    }
  });
});