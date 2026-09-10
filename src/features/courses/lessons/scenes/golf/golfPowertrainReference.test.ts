import { describe, expect, it } from 'vitest';
import { GOLF_POWERTRAIN_REFERENCE } from './golfPowertrainReference';

describe('Referencia do conjunto FSI dianteiro', () => {
  it('associa o FSI de 110 kW ao manual 02S documentado no SSP 318', () => {
    expect(GOLF_POWERTRAIN_REFERENCE.drive).toBe('front-wheel-drive');
    expect(GOLF_POWERTRAIN_REFERENCE.engine).toEqual({ code: 'AXW', powerKw: 110, management: 'Bosch Motronic MED 9.5.10' });
    expect(GOLF_POWERTRAIN_REFERENCE.manualGearbox.family).toBe('02S');
    expect(GOLF_POWERTRAIN_REFERENCE.manualGearbox.gears).toBe(6);
    expect(GOLF_POWERTRAIN_REFERENCE.combinationPages).toEqual([30, 31]);
    expect(GOLF_POWERTRAIN_REFERENCE.enginePage).toBe(37);
  });

  it('nao deduz codigo especifico, relacoes ou aplicacao por ano a partir da familia', () => {
    expect(GOLF_POWERTRAIN_REFERENCE.manualGearbox.identificationCode).toBeNull();
    expect(GOLF_POWERTRAIN_REFERENCE.manualGearbox.ratios).toBeNull();
    expect(GOLF_POWERTRAIN_REFERENCE.exactVehicleApplicationVerified).toBe(false);
  });
});