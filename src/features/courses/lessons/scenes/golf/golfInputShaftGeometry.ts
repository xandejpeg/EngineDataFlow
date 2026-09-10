import { CLUTCH_BEARING_MODEL } from './golfClutchBearingGeometry';

export const CLUTCH_DISC_CANDIDATE = {
  manufacturer: 'SACHS',
  source: 'ZF Aftermarket',
  sourceKind: 'manufacturer-catalog',
  discPartNumber: '1864 001 694',
  kitPartNumber: '3000 970 036',
  discUrl: 'https://aftermarket.zf.com/de/catalog/products/1864%20001%20694/?country=DE',
  kitUrl: 'https://aftermarket.zf.com/de/catalog/products/3000%20970%20036/?country=DE',
  diameterMm: 228,
  toothCount: 28,
  hubProfile: '20,3x22,1-28N',
  applicationStatus: 'not-confirmed-for-reference-vehicle',
  selectedForScene: false,
  shaftDrawing: null,
} as const;

export const INPUT_SHAFT_REFERENCE = {
  gearboxFamily: '02S',
  url: 'https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch/',
  assemblyUrl: 'https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_release_mechanism/assembly_overview_clutch_release_mechanism/',
  figure: 'A30-0005',
  sourceKind: 'independent-workshop-manual-mirror',
  splineMatesWith: 'clutch-disc-hub',
  splineCount: null,
  factoryDimensions: null,
  partNumber: null,
} as const;

export const INPUT_SHAFT_MODEL = {
  position: CLUTCH_BEARING_MODEL.position,
  representation: 'external-envelope-only',
  dimensionalStatus: 'estimated',
  placementStatus: 'estimated',
  actuation: 'not-simulated',
  splineStatus: 'not-modeled',
  start: CLUTCH_BEARING_MODEL.guideStart - 8,
  shoulder: CLUTCH_BEARING_MODEL.guideEnd + 8,
  tipStart: CLUTCH_BEARING_MODEL.guideEnd + 77,
  end: CLUTCH_BEARING_MODEL.guideEnd + 85,
  journalRadius: 10,
  envelopeRadius: 11,
  tipRadius: 8,
} as const;

export function inputShaftProfile(): [number, number][] {
  const model = INPUT_SHAFT_MODEL;
  return [[0, model.start], [model.journalRadius - 1, model.start],
    [model.journalRadius, model.start + 1], [model.journalRadius, model.shoulder - 2],
    [model.envelopeRadius, model.shoulder], [model.envelopeRadius, model.tipStart],
    [model.tipRadius, model.end - 2], [model.tipRadius - 1, model.end],
    [0, model.end], [0, model.start]];
}