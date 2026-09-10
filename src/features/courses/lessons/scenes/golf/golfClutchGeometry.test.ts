import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { CLUTCH_LEVER_MODEL, CLUTCH_SPRING_MODEL, clutchLeverShape, clutchSpringPath, slavePlungerContact } from './golfClutchGeometry';
import { CLUTCH_RELEASE_REFERENCE, SLAVE_CYLINDER_MODEL } from './golfClutchReference';

describe('Alavanca de desengate 02S', () => {
  it('posiciona o retentor no pivo sem fechar o canal da haste', () => {
    const model = CLUTCH_SPRING_MODEL;
    expect(model.position).toEqual(CLUTCH_LEVER_MODEL.pivot);
    expect(model.halfGap - model.wireRadius).toBeGreaterThan(4);
    expect(model.halfGap - model.wireRadius).toBeLessThan(CLUTCH_LEVER_MODEL.pivotRadius);
    expect(model.neckPlaneX + model.wireRadius).toBeLessThan(-CLUTCH_LEVER_MODEL.pivotRadius + 1);
    expect(model.dimensionalStatus).toBe('estimated');
    expect(model.actuation).toBe('not-simulated');
    expect(model.position[1] + model.loopTop + model.wireRadius).toBeLessThan(-65);
  });

  it('gera arame continuo com pernas simetricas e pontas junto da alavanca', () => {
    const model = CLUTCH_SPRING_MODEL;
    const points = clutchSpringPath();
    for (let index = 0; index < points.length; index++) {
      const opposite = points[points.length - 1 - index];
      expect(points[index][0]).toBe(opposite[0]);
      expect(points[index][1]).toBe(opposite[1]);
      expect(points[index][2]).toBeCloseTo(-opposite[2]);
    }
    expect(points[0][0] + model.position[0] - model.wireRadius).toBeCloseTo(CLUTCH_LEVER_MODEL.plateBackX + CLUTCH_LEVER_MODEL.plateThickness);
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)), false, 'centripetal');
    const geometry = new THREE.TubeGeometry(curve, points.length * 10, model.wireRadius, 10, false);
    for (const coordinate of geometry.attributes.position.array) expect(Number.isFinite(coordinate)).toBe(true);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    mesh.updateMatrixWorld();
    expect(new THREE.Raycaster(new THREE.Vector3(-30, 0, 0), new THREE.Vector3(1, 0, 0)).intersectObject(mesh)).toHaveLength(0);
    geometry.dispose();
    mesh.material.dispose();
  });

  it('usa a ponta transformada da haste como centro da sede', () => {
    const expected = new THREE.Vector3(0, SLAVE_CYLINDER_MODEL.plunger.end, 0)
      .applyEuler(new THREE.Euler(0, 0, -Math.PI / 2))
      .add(new THREE.Vector3(...SLAVE_CYLINDER_MODEL.position));
    expect(new THREE.Vector3(...slavePlungerContact()).distanceTo(expected)).toBeLessThan(1e-8);
    expect(CLUTCH_LEVER_MODEL.plungerContact).toEqual(slavePlungerContact());
    expect(CLUTCH_LEVER_MODEL.seatInnerRadius).toBeGreaterThan(SLAVE_CYLINDER_MODEL.plunger.radius);
    expect(CLUTCH_LEVER_MODEL.seatOuterRadius).toBeGreaterThan(CLUTCH_LEVER_MODEL.seatInnerRadius);
  });

  it('mantem o eixo do futuro rolamento entre haste e pivo', () => {
    expect(CLUTCH_LEVER_MODEL.pivot[1]).toBeLessThan(CLUTCH_LEVER_MODEL.bearingCenter[1]);
    expect(CLUTCH_LEVER_MODEL.plungerContact[1]).toBeGreaterThan(CLUTCH_LEVER_MODEL.bearingCenter[1]);
    expect(CLUTCH_LEVER_MODEL.pivotSeatInnerRadius).toBeGreaterThan(CLUTCH_LEVER_MODEL.pivotRadius);
    expect(CLUTCH_RELEASE_REFERENCE.ballStud.item).toBe(2);
    expect(CLUTCH_RELEASE_REFERENCE.releaseLever.item).toBe(7);
    expect(CLUTCH_RELEASE_REFERENCE.retainingSpring.item).toBe(5);
    expect(CLUTCH_LEVER_MODEL.placementStatus).toBe('estimated');
    expect(CLUTCH_LEVER_MODEL.actuation).toBe('not-simulated');
  });

  it('recorta a abertura central sem preencher o caminho do eixo primario', () => {
    const shape = clutchLeverShape();
    expect(shape.holes).toHaveLength(2);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: CLUTCH_LEVER_MODEL.plateThickness, bevelEnabled: false });
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox!;
    expect(bounds.min.y).toBeLessThan(CLUTCH_LEVER_MODEL.pivot[1]);
    expect(bounds.max.y).toBeGreaterThan(CLUTCH_LEVER_MODEL.plungerContact[1]);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    mesh.updateMatrixWorld();
    const ray = new THREE.Raycaster(new THREE.Vector3(0, 0, 50), new THREE.Vector3(0, 0, -1));
    expect(ray.intersectObject(mesh)).toHaveLength(0);
    ray.set(new THREE.Vector3(26, 0, 50), new THREE.Vector3(0, 0, -1));
    expect(ray.intersectObject(mesh).length).toBeGreaterThan(0);
    geometry.dispose();
    mesh.material.dispose();
  });
});