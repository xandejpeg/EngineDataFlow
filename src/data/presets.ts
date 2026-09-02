import type { SimulationPreset } from '@/simulation/types';

/**
 * Built-in simulation presets. The "normal" preset is always recoverable and is
 * the didactic reference for every other configuration.
 */
export const PRESETS: SimulationPreset[] = [
  {
    id: 'normal',
    namePt: 'Funcionamento normal',
    descriptionPt:
      'Motor Ciclo Otto 1.6 aspirado, mistura estequiometrica e avanco adequado. Referencia para comparacao.',
    config: {
      rpm: 2500,
      throttle: 0.35,
      targetLambda: 1,
      ignitionAdvanceDeg: 18,
      fuel: 'gasoline',
      turboEnabled: false,
      boostBar: 0,
    },
    faultIds: [],
  },
  {
    id: 'high-load',
    namePt: 'Carga elevada',
    descriptionPt: 'Borboleta quase total em rotacao media. Boa base para estudar detonacao.',
    config: { rpm: 3800, throttle: 0.95, targetLambda: 0.92, ignitionAdvanceDeg: 24 },
    faultIds: [],
  },
  {
    id: 'ethanol',
    namePt: 'Etanol',
    descriptionPt: 'Combustivel etanol, com maior resistencia a detonacao e AFR proprio.',
    config: { fuel: 'ethanol', targetLambda: 1, ignitionAdvanceDeg: 22 },
    faultIds: [],
  },
  {
    id: 'turbo',
    namePt: 'Turbo (modulo opcional)',
    descriptionPt: 'Ativa o modulo de turboalimentacao com intercooler e wastegate.',
    config: { turboEnabled: true, boostBar: 0.6, targetLambda: 0.9, ignitionAdvanceDeg: 14 },
    faultIds: [],
  },
  {
    id: 'detonation',
    namePt: 'Detonacao',
    descriptionPt: 'Combustivel de baixa octanagem e avanco excessivo sob carga.',
    config: { rpm: 3500, throttle: 0.95, ignitionAdvanceDeg: 30, targetLambda: 0.95 },
    faultIds: ['detonation'],
  },
  {
    id: 'pre-ignition',
    namePt: 'Pre-ignicao',
    descriptionPt: 'Ponto quente por deposito de carvao inicia a chama antes da centelha.',
    config: { rpm: 3200, throttle: 0.85 },
    faultIds: ['pre-ignition'],
  },
  {
    id: 'overheat',
    namePt: 'Superaquecimento',
    descriptionPt: 'Valvula termostatica travada fechada impede a circulacao pelo radiador.',
    config: { rpm: 3000, throttle: 0.7 },
    faultIds: ['overheat-thermostat-closed'],
  },
  {
    id: 'low-oil',
    namePt: 'Baixa pressao de oleo',
    descriptionPt: 'Nivel baixo e bomba desgastada reduzem a pressao e o filme lubrificante.',
    config: { rpm: 3000, throttle: 0.5 },
    faultIds: ['low-oil-pressure'],
  },
];

export const NORMAL_PRESET = PRESETS[0];
