import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { CLUTCH_DISC_CANDIDATE, INPUT_SHAFT_MODEL, INPUT_SHAFT_REFERENCE, inputShaftProfile } from './golfInputShaftGeometry';
import { CLUTCH_BEARING_MODEL } from './golfClutchBearingGeometry';
import { SLAVE_CYLINDER_MODEL } from './golfClutchReference';
import { engineToWorld } from './golfPhysics';

describe('Trecho externo do eixo primario 02S', () => {
  it('separa os dados oficiais do disco candidato da aplicacao no veiculo', () => {
    expect(CLUTCH_DISC_CANDIDATE).toMatchObject({
      sourceKind: 'manufacturer-catalog',
      discPartNumber: '1864 001 694', kitPartNumber: '3000 970 036',
      diameterMm: 228, toothCount: 28, hubProfile: '20,3x22,1-28N',
      applicationStatus: 'not-confirmed-for-reference-vehicle', selectedForScene: false,
      shaftDrawing: null,
    });
    for (const url of [CLUTCH_DISC_CANDIDATE.discUrl, CLUTCH_DISC_CANDIDATE.kitUrl]) {
      expect(new URL(url).hostname).toBe('aftermarket.zf.com');
    }
    expect(INPUT_SHAFT_REFERENCE.splineCount).toBeNull();
    expect(INPUT_SHAFT_REFERENCE.partNumber).toBeNull();
    expect(INPUT_SHAFT_MODEL.splineStatus).toBe('not-modeled');
  });

  it('documenta o encaixe no disco sem inventar estrias ou aplicacao de peca', () => {
    expect(INPUT_SHAFT_REFERENCE.splineMatesWith).toBe('clutch-disc-hub');
    expect(INPUT_SHAFT_REFERENCE.splineCount).toBeNull();
    expect(INPUT_SHAFT_REFERENCE.factoryDimensions).toBeNull();
    expect(INPUT_SHAFT_REFERENCE.partNumber).toBeNull();
    expect(INPUT_SHAFT_MODEL.representation).toBe('external-envelope-only');
    expect(INPUT_SHAFT_MODEL.splineStatus).toBe('not-modeled');
    expect(INPUT_SHAFT_MODEL.actuation).toBe('not-simulated');
  });

  it('atravessa a guia sem colisao radial ou ombro dentro dela', () => {
    expect(INPUT_SHAFT_MODEL.position).toEqual(CLUTCH_BEARING_MODEL.position);
    expect(INPUT_SHAFT_MODEL.start).toBeLessThan(CLUTCH_BEARING_MODEL.guideStart);
    expect(INPUT_SHAFT_MODEL.shoulder - 2).toBeGreaterThan(CLUTCH_BEARING_MODEL.guideEnd);
    expect(INPUT_SHAFT_MODEL.end).toBeGreaterThan(CLUTCH_BEARING_MODEL.guideEnd);
    expect(Math.max(...inputShaftProfile().map(([radius]) => radius))).toBeLessThan(CLUTCH_BEARING_MODEL.guideInnerRadius);
    const origin = new THREE.Vector3(...SLAVE_CYLINDER_MODEL.gearboxPosition).add(new THREE.Vector3(...INPUT_SHAFT_MODEL.position));
    expect(origin.y).toBe(engineToWorld([0, 0, 0])[1]);
    expect(origin.z).toBe(engineToWorld([0, 0, 0])[2]);
    expect(origin.x + INPUT_SHAFT_MODEL.end).toBeLessThan(engineToWorld([339, 0, 0])[0] - 11);
  });

  it('produz volume fechado com extensao e ponta controladas', () => {
    const profile = inputShaftProfile();
    expect(profile.at(-1)).toEqual(profile[0]);
    const geometry = new THREE.LatheGeometry(profile.map(point => new THREE.Vector2(...point)), 32);
    geometry.computeBoundingBox();
    expect(geometry.boundingBox!.min.y).toBe(INPUT_SHAFT_MODEL.start);
    expect(geometry.boundingBox!.max.y).toBe(INPUT_SHAFT_MODEL.end);
    expect(geometry.boundingBox!.max.x).toBeCloseTo(INPUT_SHAFT_MODEL.envelopeRadius);
    for (const coordinate of geometry.attributes.position.array) expect(Number.isFinite(coordinate)).toBe(true);
    geometry.dispose();
  });
});