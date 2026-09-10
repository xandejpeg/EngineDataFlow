import { EllipseCurve } from 'three';
import { describe, expect, it } from 'vitest';
import { evaluateAxleAlignment } from './golfAlignment';
import { BODY_ARCH, VEHICLE_WHEELS, createVehicleOutline, modelAxleMeasurements, modelWheelHeight, wheelDimension } from './golfVehicleGeometry';

describe('Golf: marcos dimensionais do modelo', () => {
  it('abre tres janelas laterais na chapa sem preencher os vidros com carroceria', () => {
    const outline = createVehicleOutline();
    expect(outline.holes).toHaveLength(3);
    for (const hole of outline.holes) {
      expect(hole.getPoints().every(point => Number.isFinite(point.x) && point.y >= 990)).toBe(true);
    }
  });
  it('projeta a cota para fora sem alterar cubo, recorte ou altura', () => {
    for (const wheel of VEHICLE_WHEELS) {
      const dimension = wheelDimension(wheel.id);
      expect(dimension.wheel).toBe(wheel);
      expect(dimension.lower[0]).toBe(dimension.upper[0]);
      expect(Math.abs(dimension.lower[0])).toBeGreaterThan(Math.abs(wheel.arch[0]));
      expect(dimension.lower.slice(1)).toEqual(wheel.hub.slice(1));
      expect(dimension.upper.slice(1)).toEqual(wheel.arch.slice(1));
      expect(dimension.heightMm).toBeCloseTo(356.85);
      expect(dimension.label[1]).toBeCloseTo((wheel.hub[1] + wheel.arch[1]) / 2);
    }
  });
  it('usa os topos dos arcos do contorno externo sem confundir a caixa interna', () => {
    const arcs = createVehicleOutline().curves.filter(curve => curve instanceof EllipseCurve);
    expect(arcs).toHaveLength(2);
    for (const wheel of VEHICLE_WHEELS) {
      const arc = arcs.find(curve => curve.aX === wheel.hub[2])!;
      const top = arc.getPoint(0.5);
      expect(top.x).toBeCloseTo(wheel.arch[2]);
      expect(top.y).toBeCloseTo(wheel.arch[1]);
      expect(wheel.arch[0]).toBe(wheel.side * BODY_ARCH.sideOffset);
      expect(modelWheelHeight(wheel.hub, wheel.arch).hubToArchMm).toBeCloseTo(356.85);
    }
  });
  it('mede diferenca vertical, nao distancia diagonal entre cubo e paralama', () => {
    expect(modelWheelHeight([767, 317.15, 0], [837, 674, 0]).hubToArchMm).toBeCloseTo(356.85);
    expect(modelWheelHeight([767, 327.15, 0], [837, 674, 0]).hubToArchMm).toBeCloseTo(346.85);
  });
  it('mantem rodas e eixos separados sem atribuir angulos nao medidos', () => {
    expect(VEHICLE_WHEELS.map(wheel => wheel.id)).toEqual(['front-left', 'front-right', 'rear-left', 'rear-right']);
    for (const axle of ['front', 'rear'] as const) {
      const [left, right] = modelAxleMeasurements(axle);
      const results = evaluateAxleAlignment('standard', axle, left, right);
      expect(results.filter(result => result.unit === 'mm').every(result => result.status === 'out-of-range')).toBe(true);
      expect(results.filter(result => result.unit === 'deg').every(result => result.status === 'not-measured')).toBe(true);
    }
  });
});