import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { CLUTCH_BEARING_MODEL, GUIDE_FIXING_MODEL, bearingCarrierProfile, bearingFaceProfile, clutchAxisOffset, guideFixingBoltProfile, guideFixingEarProfile, guideSleeveProfile } from './golfClutchBearingGeometry';
import { BELLHOUSING_MODEL, CLUTCH_RELEASE_REFERENCE, SLAVE_CYLINDER_MODEL } from './golfClutchReference';
import { engineToWorld } from './golfPhysics';
import { CLUTCH_LEVER_MODEL, clutchLeverShape } from './golfClutchGeometry';

describe('Rolamento e guia 02S', () => {
  it('mantem os dois fixadores fora do eixo e atras do rolamento', () => {
    const model = GUIDE_FIXING_MODEL;
    expect(model.offsets).toHaveLength(2);
    expect(model.offsets[0]).toBe(-model.offsets[1]);
    expect(model.holeRadius).toBeGreaterThan(model.shankRadius);
    expect(model.headRadius).toBeGreaterThan(model.holeRadius);
    expect(model.headRadius).toBeLessThan(model.earRadius);
    for (const offset of model.offsets) {
      expect(Math.abs(offset) - model.earRadius).toBeLessThan(24);
      expect(Math.abs(offset) - model.holeRadius).toBeGreaterThan(24);
      expect(Math.abs(offset) - model.earRadius).toBeGreaterThan(CLUTCH_BEARING_MODEL.guideInnerRadius);
    }
    expect(CLUTCH_BEARING_MODEL.guideStart + model.earThickness + model.headHeight).toBeLessThan(CLUTCH_BEARING_MODEL.carrierStart);
    expect(model.threadSpecification).toBeNull();
    expect(model.tighteningTorqueNm).toBeNull();
    expect(model.dimensionalStatus).toBe('estimated');
  });

  it('abre os olhais e assenta a cabeca na face sem preencher o furo', () => {
    const ear = new THREE.LatheGeometry(guideFixingEarProfile().map(point => new THREE.Vector2(...point)), 32);
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(ear, material);
    mesh.updateMatrixWorld();
    const ray = new THREE.Raycaster(new THREE.Vector3(0, 20, 0), new THREE.Vector3(0, -1, 0));
    expect(ray.intersectObject(mesh)).toHaveLength(0);
    ray.set(new THREE.Vector3(5, 20, 0), new THREE.Vector3(0, -1, 0));
    expect(ray.intersectObject(mesh).length).toBeGreaterThan(0);
    for (const profile of [guideFixingEarProfile(), guideFixingBoltProfile()]) {
      expect(profile[0]).toEqual(profile.at(-1));
      for (const point of profile) for (const coordinate of point) expect(Number.isFinite(coordinate)).toBe(true);
    }
    expect(guideFixingBoltProfile()).toContainEqual([GUIDE_FIXING_MODEL.headRadius, GUIDE_FIXING_MODEL.earThickness]);
    ear.dispose();
    material.dispose();
  });

  it('separa guia com vedacao e rolamento sem alegar cotas VW', () => {
    expect(CLUTCH_RELEASE_REFERENCE.guideSleeve).toEqual({ item: 4, seal: 'vulcanised-o-ring', replaceTogetherWithSeal: true, boltItem: 6 });
    expect(CLUTCH_RELEASE_REFERENCE.releaseBearing.item).toBe(8);
    expect(CLUTCH_RELEASE_REFERENCE.factoryDimensions).toBeNull();
    expect(CLUTCH_BEARING_MODEL.dimensionalStatus).toBe('estimated');
    expect(CLUTCH_BEARING_MODEL.inputShaftStatus).toBe('external-envelope-only');
  });

  it('mantem corpo deslizante dentro da guia axial e livre na abertura da alavanca', () => {
    const model = CLUTCH_BEARING_MODEL;
    expect(model.position).toEqual(CLUTCH_LEVER_MODEL.bearingCenter);
    expect(model.carrierInnerRadius).toBeGreaterThan(model.guideOuterRadius);
    expect(model.carrierStart).toBeGreaterThan(model.guideStart + 8);
    expect(model.carrierEnd).toBeLessThan(model.guideEnd);
    expect(model.position[0] + 3).toBeGreaterThan(CLUTCH_LEVER_MODEL.plateBackX + CLUTCH_LEVER_MODEL.plateThickness + 0.7);
    const opening = clutchLeverShape().holes[0].getPoints(64);
    expect(Math.min(...opening.map(point => point.length())) - 0.7).toBeGreaterThan(model.carrierOuterRadius);
  });

  it('preserva o furo axial real nas tres geometrias', () => {
    for (const profile of [guideSleeveProfile(), bearingCarrierProfile(), bearingFaceProfile()]) {
      expect(profile[0]).toEqual(profile.at(-1));
      const geometry = new THREE.LatheGeometry(profile.map(point => new THREE.Vector2(...point)), 48);
      const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.updateMatrixWorld();
      const ray = new THREE.Raycaster(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, -1, 0));
      expect(ray.intersectObject(mesh)).toHaveLength(0);
      ray.set(new THREE.Vector3(19, 100, 0), new THREE.Vector3(0, -1, 0));
      expect(ray.intersectObject(mesh).length).toBeGreaterThan(0);
      geometry.dispose();
      material.dispose();
    }
  });

  it('alinha radialmente ao virabrequim sem afirmar transmissao funcional', () => {
    expect(clutchAxisOffset()).toEqual({ height: 0, depth: 0 });
    expect(CLUTCH_BEARING_MODEL.actuation).toBe('not-simulated');
  });

  it('orienta a boca larga da campana para o motor e preserva a distancia axial estimada', () => {
    const origin = new THREE.Vector3(...SLAVE_CYLINDER_MODEL.gearboxPosition);
    const rotation = new THREE.Euler(...BELLHOUSING_MODEL.rotation);
    const wideEnd = new THREE.Vector3(0, BELLHOUSING_MODEL.profile.at(-1)![1], 0).applyEuler(rotation).add(origin);
    const narrowEnd = new THREE.Vector3(0, BELLHOUSING_MODEL.profile[0][1], 0).applyEuler(rotation).add(origin);
    const flywheel = new THREE.Vector3(...engineToWorld([339, 0, 0]));
    expect(wideEnd.distanceTo(flywheel)).toBeLessThan(narrowEnd.distanceTo(flywheel));
    expect(origin.x).toBe(-140);
    expect(wideEnd.x).toBeCloseTo(-45);
    expect(narrowEnd.x).toBeCloseTo(-240);
    expect(BELLHOUSING_MODEL.dimensionalStatus).toBe('estimated');
  });
});