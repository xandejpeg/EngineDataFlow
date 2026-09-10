import { engineToWorld } from './golfPhysics';

export const CLUTCH_RELEASE_REFERENCE = {
  gearboxFamily: '02S',
  url: 'https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_release_mechanism/assembly_overview_clutch_release_mechanism/',
  imageUrl: 'https://workshop-manuals.com/volkswagen/golf-mk5/images/golf-mk5-3547.png',
  figure: 'A30-0005',
  sourceKind: 'independent-workshop-manual-mirror',
  slaveCylinder: { item: 10, location: 'external', mountingBoltItem: 9, plungerItem: 11 },
  releaseLever: { item: 7 },
  ballStud: { item: 2 },
  retainingSpring: { item: 5 },
  repairUrl: 'https://workshop-manuals.com/volkswagen/golf-mk5/power_transmission/6-speed_manual_gearbox_02s/clutch_control/clutch_release_mechanism/repairing_clutch_release_mechanism/',
  mountedFigure: 'S30-0070',
  leverFigure: 'A30-0068',
  releaseBearing: { item: 8, separateFromSlaveCylinder: true },
  guideSleeve: { item: 4, seal: 'vulcanised-o-ring', replaceTogetherWithSeal: true, boltItem: 6 },
  factoryDimensions: null,
  exactPartNumber: null,
} as const;

export const BELLHOUSING_MODEL = {
  dimensionalStatus: 'estimated',
  rotation: [0, 0, -Math.PI / 2] as [number, number, number],
  profile: [[80, -100], [100, -100], [165, 45], [160, 90], [150, 95]] as [number, number][],
} as const;

export const SLAVE_CYLINDER_MODEL = {
  dimensionalStatus: 'estimated',
  placementStatus: 'estimated',
  actuation: 'not-simulated',
  gearboxPosition: engineToWorld([440, 0, 0]),
  position: [-105, 144, 0] as [number, number, number],
  bodyProfile: [[0, -74], [10, -74], [14, -70], [14, -18], [18, -14], [18, -6], [12, -3], [0, -3]] as [number, number][],
  bootProfile: [[5, -3], [10, -3], [12, 0], [8, 3], [11, 6], [7, 9], [10, 12], [6, 15], [8, 18], [5, 21], [5, -3]] as [number, number][],
  plunger: { start: -3, end: 32, radius: 4 },
  mountingOffsets: [-24, 24],
} as const;