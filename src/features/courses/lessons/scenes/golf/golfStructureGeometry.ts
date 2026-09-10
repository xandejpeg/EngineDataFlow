import * as THREE from 'three';

export type StructurePoint = [number, number, number];
export const FRONT_BODY_DIMENSIONS = {
  url: 'https://vwts.ru/vw/g5/vw_golf_5_2004_body_repairs_eng.pdf',
  title: 'Golf 2004 - Body Repairs',
  edition: '06.2010',
  provenance: 'independent-workshop-manual-mirror',
  section: '8.4 Floor group - front',
  purpose: 'checking-only',
  authority: 'VAS 6240',
  supplement: 'VAS 6240/2',
  measurements: [
    { figure: 'N00-10159', printedPage: 28, pdfPage: 34, distanceMm: 1097, label: 'Diagonal entre marcos do assoalho dianteiro' },
    { figure: 'N00-10086', printedPage: 29, pdfPage: 35, distanceMm: 828, label: 'Distancia transversal entre pontos destacados nos suportes das bandejas' },
  ],
  modelPointMapping: null,
  worldCoordinates: null,
} as const;
export const FRONT_LOCATION_REFERENCE = {
  url: 'https://workshop-manuals.com/volkswagen/golf-mk5/running_gear_axles_steering/front_suspension_drive_shafts/subframe_anti-roll_bar_suspension_links/fixing_position_of_subframe_and_brackets/',
  provenance: 'independent-workshop-manual-mirror',
  figure: 'N40-10020',
  locatingTool: 'T10096',
  locatingPositions: [1, 8, 9, 18],
  removalUrl: 'https://workshop-manuals.com/volkswagen/golf-mk5/running_gear_axles_steering/front_suspension_drive_shafts/subframe_anti-roll_bar_suspension_links/removing_and_installing_subframe_with_steering_box/',
  bodyConnections: [
    { component: 'console', assemblyItem: 3, positions: [1, 8] },
    { component: 'subframe', assemblyItem: 28, positions: [4, 5] },
    { component: 'mounting-bracket', assemblyItem: 4, positions: [9, 18] },
  ],
  consoleFigure: 'N40-10022',
  mountingBracketFigure: 'N40-10032',
  modelMountMapping: null,
  dimensionsVerified: false,
} as const;
export const FRONT_ASSEMBLY_REFERENCE = {
  url: 'https://workshop-manuals.com/volkswagen/golf-mk5/running_gear_axles_steering/front_suspension_drive_shafts/subframe_anti-roll_bar_suspension_links/assembly_overview_subframe_anti-roll_bar_suspension_links/',
  provenance: 'independent-workshop-manual-mirror',
  figure: 'N40-10411',
  console: { item: 3, dimensionsVerified: false },
  rearLinkBracket: { item: 4, bondedRubberBush: true, dimensionsVerified: false },
  pendulumBushes: { lowerItem: 25, upperItem: 29, variants: ['T', 'V'], selectedVariant: null },
  pendulumSupport: { item: 24, assemblyOrder: ['gearbox', 'subframe'] },
  antiRollLink: { item: 2, connects: ['anti-roll-bar', 'suspension-strut'] },
  suspensionLinks: { alternativeItems: [10, 11], mixedTypesPermitted: false, selectedType: null },
  dimensionsVerified: false,
} as const;

export const MODEL_PENDULUM_BUSHES = [
  { id: 'lower', sourceItem: FRONT_ASSEMBLY_REFERENCE.pendulumBushes.lowerItem, bottom: -18, top: 2 },
  { id: 'upper', sourceItem: FRONT_ASSEMBLY_REFERENCE.pendulumBushes.upperItem, bottom: 2, top: 22 },
] as const;

export function pendulumBushProfile(bottom: number, top: number): [number, number][] {
  return [[20, bottom], [47, bottom], [47, top], [20, top], [20, bottom]];
}
export const VERIFIED_RUNNING_GEAR = {
  source: 'Volkswagen SSP 321 - The Golf 2004 Running gear',
  url: 'https://www.volkspage.net/technik/ssp/ssp/SSP_321.pdf',
  front: { page: 7, material: 'aluminium', assemblyParts: 3, bodyMountCount: 6 },
  rearFwd: { page: 13, material: 'steel', bodyAttachment: 'direct-bolted', isolationBushes: false },
  steering: { page: 23, type: 'electromechanical-dual-pinion', location: 'front-subframe' },
  dimensionalStatus: 'not-verified',
} as const;
export const STRUCTURE_REFERENCE = {
  status: 'estimated',
  source: 'Arquitetura: Volkswagen SSP 321 pp. 7, 13, 23. Geometria provisoria: ASTRA-BUILD secao 4.',
  limitation: 'Dianteira incompleta: quatro de seis fixacoes representadas; cotas, consoles e aplicacao nao verificadas.',
} as const;

export const FRONT_STRUCTURE = {
  mounts: [-1, 1].flatMap(side => [-110, 340].map(depth => ({
    id: `${side < 0 ? 'left' : 'right'}-${depth < 0 ? 'front' : 'rear'}`,
    position: [side * 430, 275, depth] as StructurePoint,
  }))),
  towers: [-1, 1].map(side => [side * 560, 785, -100] as StructurePoint),
  rail: [[430, 420, -735], [430, 420, 340], [510, 330, 550], [640, 275, 780], [640, 275, 1180]] as StructurePoint[],
  subframeOutline: [[-430, -155], [-480, -90], [-468, 190], [-450, 380], [-375, 403], [375, 403], [450, 380], [468, 190], [480, -90], [430, -155], [300, -140], [240, -95], [-240, -95], [-300, -140]] as [number, number][],
  torqueMount: [0, 275, 295] as StructurePoint,
};

export const REAR_STRUCTURE = {
  axle: 2578,
  floorStart: 1600,
  end: 3250,
  mounts: [-1, 1].flatMap(side => [2260, 2860].map(depth => ({
    id: `rear-${side < 0 ? 'left' : 'right'}-${depth < 2578 ? 'front' : 'rear'}`,
    position: [side * 480, 470, depth] as StructurePoint,
  }))),
  rail: [[640, 275, 1180], [640, 275, 1600], [600, 355, 1850], [480, 530, 2180], [480, 530, 2910], [480, 485, 3220]] as StructurePoint[],
  sill: [[690, 300, 1600], [690, 300, 2150]] as StructurePoint[],
  damperMounts: [-1, 1].map(side => [side * 660, 775, 2680] as StructurePoint),
  springSeats: [-1, 1].map(side => [side * 475, 560, 2600] as StructurePoint),
};

export const STRUCTURE_ENVELOPE = { min: [-835, 190, -850], max: [835, 1510, 3310] };

export function hollowSection(width: number, height: number, thickness: number) {
  if (thickness <= 0 || thickness * 2 >= Math.min(width, height)) throw new Error('Invalid section thickness');
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-width / 2 + thickness, -height / 2 + thickness);
  hole.lineTo(-width / 2 + thickness, height / 2 - thickness);
  hole.lineTo(width / 2 - thickness, height / 2 - thickness);
  hole.lineTo(width / 2 - thickness, -height / 2 + thickness);
  hole.closePath();
  shape.holes.push(hole);
  return shape;
}

export function subframeShape() {
  const shape = new THREE.Shape(FRONT_STRUCTURE.subframeOutline.map(([axis, depth]) => new THREE.Vector2(axis, -depth)));
  for (const mount of [...FRONT_STRUCTURE.mounts.map(mount => ({ position: mount.position, radius: 9 })), { position: FRONT_STRUCTURE.torqueMount, radius: 49 }]) {
    const hole = new THREE.Path();
    hole.absarc(mount.position[0], -mount.position[2], mount.radius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  return shape;
}