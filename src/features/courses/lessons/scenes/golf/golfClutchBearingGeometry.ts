import { CLUTCH_LEVER_MODEL } from './golfClutchGeometry';
import { SLAVE_CYLINDER_MODEL } from './golfClutchReference';
import { engineToWorld } from './golfPhysics';

type Profile = [number, number][];

export const CLUTCH_BEARING_MODEL = {
  position: CLUTCH_LEVER_MODEL.bearingCenter,
  dimensionalStatus: 'estimated',
  placementStatus: 'estimated',
  actuation: 'not-simulated',
  inputShaftStatus: 'external-envelope-only',
  guideInnerRadius: 13,
  guideOuterRadius: 17,
  carrierInnerRadius: 17.6,
  carrierOuterRadius: 20,
  guideStart: -34,
  guideEnd: 26,
  carrierStart: -10,
  carrierEnd: 10,
  faceStart: 11,
  faceEnd: 22,
  faceOuterRadius: 31,
  clipOffsets: [-24, 24],
} as const;

export function guideSleeveProfile(): Profile {
  const model = CLUTCH_BEARING_MODEL;
  return [[model.guideInnerRadius, model.guideStart], [24, model.guideStart],
    [24, model.guideStart + 4], [19, model.guideStart + 5], [model.guideOuterRadius, model.guideStart + 8],
    [model.guideOuterRadius, model.guideEnd - 1], [16, model.guideEnd],
    [model.guideInnerRadius, model.guideEnd], [model.guideInnerRadius, model.guideStart]];
}

export const GUIDE_FIXING_MODEL = {
  dimensionalStatus: 'estimated',
  placementStatus: 'estimated',
  actuation: 'not-simulated',
  offsets: [-28, 28],
  earRadius: 7,
  holeRadius: 3.5,
  shankRadius: 3,
  headRadius: 5.5,
  earThickness: 4,
  headHeight: 3,
  insertion: 8,
  threadSpecification: null,
  tighteningTorqueNm: null,
} as const;

export function guideFixingEarProfile(): Profile {
  const model = GUIDE_FIXING_MODEL;
  return [[model.holeRadius, 0], [model.earRadius, 0],
    [model.earRadius, model.earThickness], [model.holeRadius, model.earThickness], [model.holeRadius, 0]];
}

export function guideFixingBoltProfile(): Profile {
  const model = GUIDE_FIXING_MODEL;
  const top = model.earThickness + model.headHeight;
  return [[0, -model.insertion], [model.shankRadius, -model.insertion],
    [model.shankRadius, model.earThickness], [model.headRadius, model.earThickness],
    [model.headRadius, top - 0.5], [model.headRadius - 0.5, top],
    [2, top], [2, top - 2], [0, top - 2], [0, -model.insertion]];
}

export function bearingCarrierProfile(): Profile {
  const model = CLUTCH_BEARING_MODEL;
  return [[model.carrierInnerRadius, model.carrierStart], [model.carrierOuterRadius, model.carrierStart],
    [model.carrierOuterRadius, 3], [29, 3], [30, 5], [30, model.carrierEnd],
    [model.carrierInnerRadius, model.carrierEnd], [model.carrierInnerRadius, model.carrierStart]];
}

export function bearingFaceProfile(): Profile {
  const model = CLUTCH_BEARING_MODEL;
  return [[model.carrierInnerRadius, model.carrierEnd], [29, model.carrierEnd],
    [model.faceOuterRadius, model.faceStart + 1], [model.faceOuterRadius, model.faceEnd - 1],
    [30, model.faceEnd], [19, model.faceEnd], [model.carrierInnerRadius, model.faceEnd - 1],
    [model.carrierInnerRadius, model.carrierEnd]];
}

export function clutchAxisOffset() {
  const crank = engineToWorld([0, 0, 0]);
  const gearbox = SLAVE_CYLINDER_MODEL.gearboxPosition;
  const center = CLUTCH_BEARING_MODEL.position;
  return { height: gearbox[1] + center[1] - crank[1], depth: gearbox[2] + center[2] - crank[2] };
}