import { describe, expect, it } from 'vitest';
import { ALIGNMENT_SOURCE, ALIGNMENT_VARIANTS, evaluateAxleAlignment, type WheelAlignmentMeasurement } from './golfAlignment';

const front: WheelAlignmentMeasurement = { hubToArchMm: 382, camberDegrees: -0.5, toeInDegrees: 5 / 60, casterDegrees: 454 / 60 };
const rear: WheelAlignmentMeasurement = { hubToArchMm: 380, camberDegrees: -80 / 60, toeInDegrees: 5 / 60 };

describe('Golf: referencias estaticas de alinhamento', () => {
  it('preserva datum e separa as aplicacoes PR sem escolher uma para a cena', () => {
    expect(ALIGNMENT_SOURCE.heightDatum).toBe('wheel-hub-centre-to-wheel-housing-edge');
    expect(ALIGNMENT_SOURCE.condition).toBe('unladen-normal-position');
    expect(ALIGNMENT_VARIANTS.standard.pr).toBe('2UA');
    expect(ALIGNMENT_VARIANTS.heavyDuty.frontHeightMm).toBe(402);
    expect(ALIGNMENT_VARIANTS.sportExcept18.rearHeightMm).toBe(365);
  });

  it('aceita os valores nominais dianteiros e traseiros do conjunto padrao', () => {
    expect(evaluateAxleAlignment('standard', 'front', front, front).every(result => result.status === 'within-range')).toBe(true);
    expect(evaluateAxleAlignment('standard', 'rear', rear, rear).every(result => result.status === 'within-range')).toBe(true);
  });

  it('soma convergencia das duas rodas em graus e mantem sinal', () => {
    const results = evaluateAxleAlignment('standard', 'rear', { ...rear, toeInDegrees: -5 / 60 }, { ...rear, toeInDegrees: 2.5 / 60 });
    expect(results.find(result => result.id === 'toe.total')).toMatchObject({ measured: -2.5 / 60, status: 'within-range' });
    const excessive = evaluateAxleAlignment('standard', 'front', { ...front, toeInDegrees: 15 / 60 }, { ...front, toeInDegrees: 15 / 60 });
    expect(excessive.find(result => result.id === 'toe.total')?.status).toBe('out-of-range');
  });

  it('confere diferenca entre lados mesmo quando cada roda esta na tolerancia', () => {
    const results = evaluateAxleAlignment('standard', 'front', { ...front, camberDegrees: -1 }, { ...front, camberDegrees: 0 });
    expect(results.find(result => result.id === 'left.camber')?.status).toBe('within-range');
    expect(results.find(result => result.id === 'right.camber')?.status).toBe('within-range');
    expect(results.find(result => result.id === 'camber.sideDifference')?.status).toBe('out-of-range');
  });

  it('aceita limites de altura e rejeita usar raio de pneu como altura de referencia', () => {
    const results = evaluateAxleAlignment('standard', 'front', { ...front, hubToArchMm: 372 }, { ...front, hubToArchMm: 392 });
    expect(results.filter(result => result.unit === 'mm').every(result => result.status === 'within-range')).toBe(true);
    expect(evaluateAxleAlignment('standard', 'front', { ...front, hubToArchMm: 317.15 }, front)[0].status).toBe('out-of-range');
  });

  it('nao aprova medicao ausente nem numericamente invalida', () => {
    const missing: WheelAlignmentMeasurement = { hubToArchMm: null, camberDegrees: null, toeInDegrees: null };
    expect(evaluateAxleAlignment('standard', 'front', missing, missing).every(result => result.status === 'not-measured')).toBe(true);
    const invalid = evaluateAxleAlignment('standard', 'front', { ...front, hubToArchMm: Infinity, toeInDegrees: NaN }, missing);
    expect(invalid.find(result => result.id === 'left.height')?.status).toBe('invalid');
    expect(invalid.find(result => result.id === 'toe.total')?.status).toBe('invalid');
  });

  it('usa valores especificos do conjunto esportivo e reforcado', () => {
    for (const variant of ['sportExcept18', 'heavyDuty'] as const) {
      const spec = ALIGNMENT_VARIANTS[variant];
      const wheel = { hubToArchMm: spec.frontHeightMm, camberDegrees: spec.frontCamberMinutes / 60, toeInDegrees: 5 / 60, casterDegrees: spec.frontCasterMinutes / 60 };
      expect(evaluateAxleAlignment(variant, 'front', wheel, wheel).every(result => result.status === 'within-range')).toBe(true);
    }
  });
});