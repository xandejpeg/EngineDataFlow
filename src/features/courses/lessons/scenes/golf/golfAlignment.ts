export const ALIGNMENT_SOURCE = {
  title: 'Golf Mk5 workshop manual - Wheel alignment specifications, Golf',
  url: 'https://workshop-manuals.com/volkswagen/golf-mk5/running_gear_axles_steering/wheels_tyres._axle_align/wheel_alignment/wheel_alignment_specifications_golf/',
  datumUrl: 'https://workshop-manuals.com/volkswagen/golf-mk5/running_gear_axles_steering/front_suspension_drive_shafts/repairing_front_suspension/raising_wheel_suspension_to_unladen_position_golf/',
  provenance: 'independent-workshop-manual-mirror',
  heightDatum: 'wheel-hub-centre-to-wheel-housing-edge',
  condition: 'unladen-normal-position',
  limitation: 'Static checks only; not pickup coordinates, full alignment approval or suspension dynamics.',
} as const;

export const ALIGNMENT_VARIANTS = {
  standard: { pr: '2UA', frontHeightMm: 382, rearHeightMm: 380, frontCamberMinutes: -30, frontCasterMinutes: 454 },
  heavyDuty: { pr: '2UB', frontHeightMm: 402, rearHeightMm: 400, frontCamberMinutes: -14, frontCasterMinutes: 437 },
  sportExcept18: { pr: '2UC', frontHeightMm: 367, rearHeightMm: 365, frontCamberMinutes: -41, frontCasterMinutes: 467 },
} as const;

export type AlignmentVariant = keyof typeof ALIGNMENT_VARIANTS;
export type AlignmentAxle = 'front' | 'rear';
export interface WheelAlignmentMeasurement {
  hubToArchMm: number | null;
  camberDegrees: number | null;
  toeInDegrees: number | null;
  casterDegrees?: number | null;
}
export interface AlignmentCheck {
  id: string;
  unit: 'mm' | 'deg';
  minimum: number;
  maximum: number;
  measured: number | null;
  status: 'not-measured' | 'invalid' | 'within-range' | 'out-of-range';
}

function check(id: string, unit: AlignmentCheck['unit'], measured: number | null, minimum: number, maximum: number): AlignmentCheck {
  const status = measured === null ? 'not-measured'
    : !Number.isFinite(measured) ? 'invalid'
      : measured >= minimum - 1e-9 && measured <= maximum + 1e-9 ? 'within-range' : 'out-of-range';
  return { id, unit, measured, minimum, maximum, status };
}

function combine(left: number | null, right: number | null, operation: (left: number, right: number) => number) {
  if (left !== null && !Number.isFinite(left)) return NaN;
  if (right !== null && !Number.isFinite(right)) return NaN;
  return left === null || right === null ? null : operation(left, right);
}

export function evaluateAxleAlignment(
  variant: AlignmentVariant,
  axle: AlignmentAxle,
  left: WheelAlignmentMeasurement,
  right: WheelAlignmentMeasurement,
): AlignmentCheck[] {
  const reference = ALIGNMENT_VARIANTS[variant];
  if (!reference || (axle !== 'front' && axle !== 'rear')) throw new Error('Explicit supported alignment variant and axle required');
  const front = axle === 'front';
  const height = front ? reference.frontHeightMm : reference.rearHeightMm;
  const camber = (front ? reference.frontCamberMinutes : -80) / 60;
  const checks: AlignmentCheck[] = [];
  for (const [side, measurement] of [['left', left], ['right', right]] as const) {
    checks.push(check(`${side}.height`, 'mm', measurement.hubToArchMm, height - 10, height + 10));
    checks.push(check(`${side}.camber`, 'deg', measurement.camberDegrees, camber - 0.5, camber + 0.5));
    if (front) {
      const caster = reference.frontCasterMinutes / 60;
      checks.push(check(`${side}.caster`, 'deg', measurement.casterDegrees ?? null, caster - 0.5, caster + 0.5));
    }
  }
  checks.push(check('camber.sideDifference', 'deg', combine(left.camberDegrees, right.camberDegrees, (leftValue, rightValue) => Math.abs(leftValue - rightValue)), 0, 0.5));
  const toeTolerance = front ? 10 : 12.5;
  checks.push(check('toe.total', 'deg', combine(left.toeInDegrees, right.toeInDegrees, (leftValue, rightValue) => leftValue + rightValue), (10 - toeTolerance) / 60, (10 + toeTolerance) / 60));
  if (front) {
    checks.push(check('caster.sideDifference', 'deg', combine(left.casterDegrees ?? null, right.casterDegrees ?? null, (leftValue, rightValue) => Math.abs(leftValue - rightValue)), 0, 0.5));
  }
  return checks;
}