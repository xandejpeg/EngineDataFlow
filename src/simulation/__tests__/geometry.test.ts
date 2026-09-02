import { describe, expect, it } from 'vitest';
import { deriveGeometry, geometricCompressionRatio } from '../geometry';
import {
  pistonPositionFromTdcM,
  cylinderVolumeM3,
} from '../kinematics';
import { volumeAt, idealOttoEfficiency } from '../thermodynamics';
import { degToRad, m3ToCm3 } from '../units';
import { DEFAULT_CONFIG } from '../simulationEngine';

const geo = DEFAULT_CONFIG.geometry;
const derived = deriveGeometry(geo);

describe('geometry and kinematics', () => {
  it('crank radius equals half the stroke', () => {
    expect(derived.crankRadiusM).toBeCloseTo(geo.strokeM / 2, 6);
  });

  it('piston is at TDC (position 0) at 0 degrees', () => {
    const x = pistonPositionFromTdcM(degToRad(0), derived.crankRadiusM, geo.conrodM);
    expect(x).toBeCloseTo(0, 6);
  });

  it('piston is at BDC (position = stroke) at 180 degrees', () => {
    const x = pistonPositionFromTdcM(degToRad(180), derived.crankRadiusM, geo.conrodM);
    expect(x).toBeCloseTo(geo.strokeM, 6);
  });

  it('stroke equals 2r', () => {
    const xTdc = pistonPositionFromTdcM(degToRad(0), derived.crankRadiusM, geo.conrodM);
    const xBdc = pistonPositionFromTdcM(degToRad(180), derived.crankRadiusM, geo.conrodM);
    expect(xBdc - xTdc).toBeCloseTo(2 * derived.crankRadiusM, 6);
  });

  it('minimum volume is clearance volume (TDC), maximum is Vc + Vd (BDC)', () => {
    const vMin = cylinderVolumeM3(0, derived.pistonAreaM2, derived.clearanceVolumeM3);
    const vMax = cylinderVolumeM3(geo.strokeM, derived.pistonAreaM2, derived.clearanceVolumeM3);
    expect(vMin).toBeCloseTo(derived.clearanceVolumeM3, 9);
    expect(vMax).toBeCloseTo(derived.clearanceVolumeM3 + derived.displacementCylinderM3, 9);
  });

  it('geometric compression ratio matches configuration', () => {
    const cr = geometricCompressionRatio(derived.displacementCylinderM3, derived.clearanceVolumeM3);
    expect(cr).toBeCloseTo(geo.compressionRatio, 4);
  });

  it('total displacement is around 1.6 L for the default engine', () => {
    const cc = m3ToCm3(derived.displacementTotalM3);
    expect(cc).toBeGreaterThan(1400);
    expect(cc).toBeLessThan(1800);
  });

  it('volumeAt is minimal near TDC (0/360/720) and maximal near BDC (180/540)', () => {
    const vTdc = volumeAt(0, derived);
    const vBdc = volumeAt(180, derived);
    const vTdcPower = volumeAt(360, derived);
    expect(vTdc).toBeCloseTo(derived.clearanceVolumeM3, 8);
    expect(vTdcPower).toBeCloseTo(derived.clearanceVolumeM3, 8);
    expect(vBdc).toBeGreaterThan(vTdc);
  });
});

describe('ideal Otto efficiency', () => {
  it('increases with compression ratio', () => {
    const low = idealOttoEfficiency(9, 1.33);
    const high = idealOttoEfficiency(12, 1.33);
    expect(high).toBeGreaterThan(low);
    expect(low).toBeGreaterThan(0);
    expect(high).toBeLessThan(1);
  });
});
