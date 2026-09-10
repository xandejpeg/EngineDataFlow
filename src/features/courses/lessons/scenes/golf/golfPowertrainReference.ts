export const GOLF_POWERTRAIN_REFERENCE = {
  drive: 'front-wheel-drive',
  source: 'Volkswagen SSP 318',
  url: 'https://www.volkspage.net/technik/ssp/ssp/SSP_318_d1.pdf',
  combinationPages: [30, 31],
  enginePage: 37,
  engine: { code: 'AXW', powerKw: 110, management: 'Bosch Motronic MED 9.5.10' },
  manualGearbox: { family: '02S', gears: 6, identificationCode: null, ratios: null },
  exactVehicleApplicationVerified: false,
} as const;