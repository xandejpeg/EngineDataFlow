import { describe, expect, it } from 'vitest';
import { ExtrudeGeometry } from 'three';
import { FRONT_STRUCTURE, REAR_STRUCTURE, VERIFIED_RUNNING_GEAR, FRONT_ASSEMBLY_REFERENCE, FRONT_LOCATION_REFERENCE, FRONT_BODY_DIMENSIONS, MODEL_PENDULUM_BUSHES, pendulumBushProfile, hollowSection, STRUCTURE_REFERENCE, subframeShape } from './golfStructureGeometry';

describe('Aula 5: estrutura dianteira provisoria', () => {
  it('preserva cotas de conferencia sem transforma-las em coordenadas de montagem', () => {
    expect(FRONT_BODY_DIMENSIONS.edition).toBe('06.2010');
    expect(FRONT_BODY_DIMENSIONS.measurements.map(measurement => [measurement.figure, measurement.distanceMm, measurement.printedPage, measurement.pdfPage])).toEqual([
      ['N00-10159', 1097, 28, 34],
      ['N00-10086', 828, 29, 35],
    ]);
    expect(FRONT_BODY_DIMENSIONS.purpose).toBe('checking-only');
    expect(FRONT_BODY_DIMENSIONS.authority).toBe('VAS 6240');
    expect(FRONT_BODY_DIMENSIONS.supplement).toBe('VAS 6240/2');
    expect(FRONT_BODY_DIMENSIONS.modelPointMapping).toBeNull();
    expect(FRONT_BODY_DIMENSIONS.worldCoordinates).toBeNull();
    expect(FRONT_STRUCTURE.mounts.map(mount => mount.position)).toEqual([
      [-430, 275, -110], [-430, 275, 340], [430, 275, -110], [430, 275, 340],
    ]);
  });
  it('nao confunde quatro pinos de localizacao com seis fixacoes na carroceria', () => {
    expect(FRONT_LOCATION_REFERENCE.figure).toBe('N40-10020');
    expect(FRONT_LOCATION_REFERENCE.locatingPositions).toEqual([1, 8, 9, 18]);
    expect(FRONT_LOCATION_REFERENCE.locatingPositions).toHaveLength(4);
    expect(VERIFIED_RUNNING_GEAR.front.bodyMountCount).toBe(6);
    expect(FRONT_LOCATION_REFERENCE.modelMountMapping).toBeNull();
    expect(FRONT_LOCATION_REFERENCE.dimensionsVerified).toBe(false);
  });
  it('identifica os seis parafusos sem reutilizar a numeracao da vista explodida', () => {
    const connections = FRONT_LOCATION_REFERENCE.bodyConnections;
    const positions = connections.flatMap(connection => [...connection.positions]);
    expect(positions.sort((first, second) => first - second)).toEqual([1, 4, 5, 8, 9, 18]);
    expect(new Set(positions).size).toBe(VERIFIED_RUNNING_GEAR.front.bodyMountCount);
    expect(connections.map(connection => connection.assemblyItem)).toEqual([3, 28, 4]);
    expect(positions.filter(position => !FRONT_LOCATION_REFERENCE.locatingPositions.some(locating => locating === position))).toEqual([4, 5]);
    expect(FRONT_LOCATION_REFERENCE.figure).not.toBe(FRONT_ASSEMBLY_REFERENCE.figure);
    expect(FRONT_STRUCTURE.mounts).toHaveLength(4);
  });
  it('separa as duas buchas documentadas sem inventar variante ou novas cotas', () => {
    expect(MODEL_PENDULUM_BUSHES.map(bush => bush.sourceItem)).toEqual([25, 29]);
    expect(FRONT_ASSEMBLY_REFERENCE.pendulumBushes.selectedVariant).toBeNull();
    expect(FRONT_ASSEMBLY_REFERENCE.dimensionsVerified).toBe(false);
    expect(FRONT_ASSEMBLY_REFERENCE.pendulumSupport.assemblyOrder).toEqual(['gearbox', 'subframe']);
    expect(FRONT_ASSEMBLY_REFERENCE.antiRollLink.connects).toEqual(['anti-roll-bar', 'suspension-strut']);
    expect(FRONT_ASSEMBLY_REFERENCE.console.item).toBe(3);
    expect(FRONT_ASSEMBLY_REFERENCE.rearLinkBracket).toMatchObject({ item: 4, bondedRubberBush: true });
    expect(FRONT_ASSEMBLY_REFERENCE.suspensionLinks.mixedTypesPermitted).toBe(false);
    expect(FRONT_ASSEMBLY_REFERENCE.suspensionLinks.selectedType).toBeNull();
    expect(MODEL_PENDULUM_BUSHES[0].bottom).toBe(-18);
    expect(MODEL_PENDULUM_BUSHES[0].top).toBe(MODEL_PENDULUM_BUSHES[1].bottom);
    expect(MODEL_PENDULUM_BUSHES[1].top).toBe(22);
    for (const bush of MODEL_PENDULUM_BUSHES) {
      const profile = pendulumBushProfile(bush.bottom, bush.top);
      expect(profile[0]).toEqual(profile.at(-1));
      expect(profile.map(point => point[0])).toEqual([20, 47, 47, 20, 20]);
    }
  });
  it('separa arquitetura documentada de geometria ainda incompleta', () => {
    expect(VERIFIED_RUNNING_GEAR.front.bodyMountCount).toBe(6);
    expect(VERIFIED_RUNNING_GEAR.front.assemblyParts).toBe(3);
    expect(FRONT_STRUCTURE.mounts).toHaveLength(4);
    expect(FRONT_STRUCTURE.mounts.length).toBeLessThan(VERIFIED_RUNNING_GEAR.front.bodyMountCount);
    expect(VERIFIED_RUNNING_GEAR.rearFwd.bodyAttachment).toBe('direct-bolted');
    expect(VERIFIED_RUNNING_GEAR.rearFwd.isolationBushes).toBe(false);
    expect(VERIFIED_RUNNING_GEAR.dimensionalStatus).toBe('not-verified');
  });
  it('continua a longarina e a soleira existentes ate alem do eixo traseiro', () => {
    expect(REAR_STRUCTURE.rail[0]).toEqual(FRONT_STRUCTURE.rail.at(-1));
    expect(REAR_STRUCTURE.sill[0]).toEqual([690, 300, REAR_STRUCTURE.floorStart]);
    expect(REAR_STRUCTURE.rail.at(-1)![2]).toBeGreaterThan(REAR_STRUCTURE.axle);
    expect(REAR_STRUCTURE.end).toBeGreaterThan(REAR_STRUCTURE.rail.at(-1)![2]);
    expect(REAR_STRUCTURE.mounts).toHaveLength(4);
    for (const { position: [axis, height, depth] } of REAR_STRUCTURE.mounts) {
      expect(REAR_STRUCTURE.mounts.some(mount => mount.position[0] === -axis && mount.position[1] === height && mount.position[2] === depth)).toBe(true);
    }
    expect(REAR_STRUCTURE.damperMounts).not.toEqual(REAR_STRUCTURE.springSeats);
  });
  it('mantem quatro fixacoes simetricas e dois centros de torre', () => {
    expect(new Set(FRONT_STRUCTURE.mounts.map(mount => mount.id)).size).toBe(4);
    for (const { position: [axis, height, depth] } of FRONT_STRUCTURE.mounts) {
      expect(FRONT_STRUCTURE.mounts.some(mount => mount.position[0] === -axis && mount.position[1] === height && mount.position[2] === depth)).toBe(true);
    }
    expect(FRONT_STRUCTURE.towers).toEqual([[-560, 785, -100], [560, 785, -100]]);
    expect(STRUCTURE_REFERENCE.status).toBe('estimated');
  });

  it('produz longarina oca com parede finita e rejeita secao fechada', () => {
    const shape = hollowSection(90, 110, 3);
    expect(shape.holes).toHaveLength(1);
    const geometry = new ExtrudeGeometry(shape, { depth: 200, bevelEnabled: false });
    geometry.computeBoundingBox();
    expect(geometry.boundingBox?.min.toArray()).toEqual([-45, -55, 0]);
    expect(geometry.boundingBox?.max.toArray()).toEqual([45, 55, 200]);
    expect(() => hollowSection(90, 110, 45)).toThrow();
    geometry.dispose();
  });

  it('abre furos reais nas quatro fixacoes e no apoio pendular', () => {
    const shape = subframeShape();
    expect(shape.holes).toHaveLength(5);
    shape.holes.slice(0, 4).forEach((hole, index) => {
      const [axis, , depth] = FRONT_STRUCTURE.mounts[index].position;
      const point = hole.getPoint(0);
      expect(point.x).toBeCloseTo(axis + 9);
      expect(point.y).toBeCloseTo(-depth);
    });
    const geometry = new ExtrudeGeometry(shape, { depth: 20, bevelEnabled: false });
    expect(Array.from(geometry.attributes.position.array).every(Number.isFinite)).toBe(true);
    geometry.dispose();
  });
});