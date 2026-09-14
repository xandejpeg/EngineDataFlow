import type { FuseCircuit } from './golfElectrical';

export type SystemId =
  | 'engine' | 'intake' | 'fuel' | 'ignition' | 'exhaust' | 'cooling' | 'egas' | 'starter' | 'transmission'
  | 'electrical' | 'harness' | 'bodyLoom' | 'instruments' | 'diagnostics' | 'lighting' | 'comfort'
  | 'bodywork' | 'structure' | 'suspension' | 'steering' | 'wheels' | 'brakes' | 'interior' | 'wipers';

/** Comando proprio de dominio usado quando o sistema nao e desligado por fusivel. */
export type SystemCommand = 'engine' | 'egas' | 'wipers' | 'brakes';

export interface SystemToggle {
  readonly id: SystemId;
  readonly label: string;
  readonly group: string;
  readonly fuse?: FuseCircuit;
  readonly command?: SystemCommand;
  /** Falso quando o sistema e um circuito sem geometria propria para esconder. */
  readonly visual?: false;
}

export const SYSTEM_GROUPS = ['Motor e perifericos', 'Eletrica', 'Externas e infraestrutura'] as const;

export const SYSTEM_TOGGLES: readonly SystemToggle[] = [
  { id: 'engine', label: 'Motor', group: SYSTEM_GROUPS[0], command: 'engine' },
  { id: 'intake', label: 'Admissao', group: SYSTEM_GROUPS[0] },
  { id: 'fuel', label: 'Combustivel', group: SYSTEM_GROUPS[0], fuse: 'pump' },
  { id: 'ignition', label: 'Ignicao', group: SYSTEM_GROUPS[0], fuse: 'ignition', visual: false },
  { id: 'exhaust', label: 'Escape e emissoes', group: SYSTEM_GROUPS[0] },
  { id: 'cooling', label: 'Arrefecimento', group: SYSTEM_GROUPS[0], fuse: 'fan' },
  { id: 'egas', label: 'Acelerador E-Gas', group: SYSTEM_GROUPS[0], command: 'egas' },
  { id: 'starter', label: 'Alternador e partida', group: SYSTEM_GROUPS[0] },
  { id: 'transmission', label: 'Cambio e embreagem', group: SYSTEM_GROUPS[0] },

  { id: 'electrical', label: 'Bateria e fusiveis', group: SYSTEM_GROUPS[1], fuse: 'main' },
  { id: 'harness', label: 'Chicote do motor', group: SYSTEM_GROUPS[1], fuse: 'ecu' },
  { id: 'bodyLoom', label: 'Chicote da carroceria', group: SYSTEM_GROUPS[1] },
  { id: 'instruments', label: 'Painel de instrumentos', group: SYSTEM_GROUPS[1], fuse: 'instrument' },
  { id: 'diagnostics', label: 'Tomada OBD2', group: SYSTEM_GROUPS[1], fuse: 'diagnostics', visual: false },
  { id: 'lighting', label: 'Iluminacao externa', group: SYSTEM_GROUPS[1], fuse: 'lighting', visual: false },
  { id: 'comfort', label: 'Conforto e travas', group: SYSTEM_GROUPS[1], fuse: 'comfort', visual: false },

  { id: 'bodywork', label: 'Lataria', group: SYSTEM_GROUPS[2] },
  { id: 'structure', label: 'Chassi / monobloco', group: SYSTEM_GROUPS[2] },
  { id: 'suspension', label: 'Suspensao', group: SYSTEM_GROUPS[2] },
  { id: 'steering', label: 'Direcao', group: SYSTEM_GROUPS[2] },
  { id: 'wheels', label: 'Rodas e pneus', group: SYSTEM_GROUPS[2] },
  { id: 'brakes', label: 'Freios', group: SYSTEM_GROUPS[2], command: 'brakes' },
  { id: 'interior', label: 'Interior e cabine', group: SYSTEM_GROUPS[2] },
  { id: 'wipers', label: 'Limpadores e lavador', group: SYSTEM_GROUPS[2], command: 'wipers' },
];

export type SystemFlags = Record<SystemId, boolean>;

export function allSystems(value: boolean): SystemFlags {
  return Object.fromEntries(SYSTEM_TOGGLES.map(system => [system.id, value])) as SystemFlags;
}

/** Fusiveis que ficam abertos porque o aluno desligou o sistema correspondente. */
export function offlineCircuits(power: SystemFlags): FuseCircuit[] {
  return SYSTEM_TOGGLES.filter(system => system.fuse && !power[system.id]).map(system => system.fuse as FuseCircuit);
}
