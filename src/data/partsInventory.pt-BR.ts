/**
 * Inventario mestre de TODAS as pecas do motor Ciclo Otto e seus sistemas.
 * O status e derivado automaticamente:
 *   - partId presente em PART_GLB   -> 'glb' (malha gerada) = feito
 *   - partId presente em PART_MODELS -> 'procedural' = feito
 *   - proceduralLab: true            -> peca modelada no motor animado = feito
 *   - nenhum dos acima               -> 'todo' = a fazer
 * Assim, ao gerar um GLB e ligar o partId, o item vira "feito" sozinho.
 */

export interface InventoryItem {
  id: string;
  namePt: string;
  /** Liga a uma peca 3D (PART_GLB / PART_MODELS) para status automatico. */
  partId?: string;
  /** Modelada proceduralmente no motor animado do laboratorio. */
  proceduralLab?: boolean;
  note?: string;
}

export interface InventoryGroup {
  id: string;
  titlePt: string;
  descriptionPt: string;
  items: InventoryItem[];
}

export const INVENTORY: InventoryGroup[] = [
  {
    id: 'short-block',
    titlePt: 'Bloco e conjunto movel',
    descriptionPt: 'Estrutura do motor e pecas que se movem para gerar torque.',
    items: [
      { id: 'block', namePt: 'Bloco do motor', proceduralLab: true },
      { id: 'cylinders', namePt: 'Cilindros / camisas', proceduralLab: true },
      { id: 'pistons', namePt: 'Pistoes', proceduralLab: true },
      { id: 'rings', namePt: 'Aneis do pistao', proceduralLab: true },
      { id: 'piston-pin', namePt: 'Pino do pistao', proceduralLab: true },
      { id: 'conrods', namePt: 'Bielas', proceduralLab: true },
      { id: 'crankshaft', namePt: 'Virabrequim', proceduralLab: true },
      { id: 'counterweights', namePt: 'Contrapesos', proceduralLab: true },
      { id: 'flywheel', namePt: 'Volante', proceduralLab: true },
      { id: 'main-bearings', namePt: 'Bronzinas / mancais', note: 'a gerar' },
      { id: 'crank-pulley', namePt: 'Polia / amortecedor harmonico', note: 'a gerar' },
      { id: 'oil-pan', namePt: 'Cárter de oleo', note: 'a gerar' },
      { id: 'head-gasket', namePt: 'Junta do cabecote', note: 'a gerar' },
      { id: 'gaskets', namePt: 'Juntas e vedacoes', note: 'a gerar' },
    ],
  },
  {
    id: 'valvetrain',
    titlePt: 'Cabecote e comando de valvulas',
    descriptionPt: 'Admissao e escape dos gases, sincronizados com o virabrequim.',
    items: [
      { id: 'head', namePt: 'Cabecote', proceduralLab: true },
      { id: 'camshaft', namePt: 'Comando de valvulas', proceduralLab: true },
      { id: 'cam-lobes', namePt: 'Ressaltos (cames)', proceduralLab: true },
      { id: 'intake-valves', namePt: 'Valvulas de admissao', proceduralLab: true },
      { id: 'exhaust-valves', namePt: 'Valvulas de escape', proceduralLab: true },
      { id: 'valve-springs', namePt: 'Molas de valvula', note: 'a gerar' },
      { id: 'valve-guides', namePt: 'Guias e retentores', note: 'a gerar' },
      { id: 'tappets', namePt: 'Tuchos / balancins', note: 'a gerar' },
      { id: 'timing', namePt: 'Correia / corrente de sincronismo', note: 'a gerar' },
      { id: 'timing-tensioner', namePt: 'Tensor do sincronismo', note: 'a gerar' },
      { id: 'valve-cover', namePt: 'Tampa de valvulas', note: 'a gerar' },
    ],
  },
  {
    id: 'fuel',
    titlePt: 'Alimentacao e combustivel',
    descriptionPt: 'Armazena, pressuriza e dosa o combustivel.',
    items: [
      { id: 'injector', namePt: 'Injetor', partId: 'injector' },
      { id: 'fuel-pump', namePt: 'Bomba de combustivel', partId: 'fuel-pump' },
      { id: 'fuel-rail', namePt: 'Flauta de combustivel', note: 'a gerar' },
      { id: 'fuel-filter', namePt: 'Filtro de combustivel', note: 'a gerar' },
      { id: 'pressure-regulator', namePt: 'Regulador de pressao', note: 'a gerar' },
      { id: 'fuel-tank', namePt: 'Tanque de combustivel', note: 'a gerar' },
    ],
  },
  {
    id: 'intake',
    titlePt: 'Admissao de ar',
    descriptionPt: 'Filtra e conduz o ar ate os cilindros.',
    items: [
      { id: 'throttle-body', namePt: 'Corpo de borboleta', partId: 'throttle-body' },
      { id: 'intake-manifold', namePt: 'Coletor de admissao', note: 'a gerar' },
      { id: 'air-filter', namePt: 'Filtro de ar', note: 'a gerar' },
      { id: 'airbox', namePt: 'Caixa do filtro / dutos', note: 'a gerar' },
    ],
  },
  {
    id: 'ignition',
    titlePt: 'Ignicao',
    descriptionPt: 'Gera a centelha no momento certo.',
    items: [
      { id: 'ignition-coil', namePt: 'Bobina + vela', partId: 'ignition-coil' },
      { id: 'spark-plug', namePt: 'Vela de ignicao', partId: 'ignition-coil', note: 'inclusa na bobina' },
    ],
  },
  {
    id: 'exhaust',
    titlePt: 'Escapamento',
    descriptionPt: 'Conduz e trata os gases queimados.',
    items: [
      { id: 'exhaust-manifold', namePt: 'Coletor de escape', note: 'a gerar' },
      { id: 'catalytic', namePt: 'Catalisador', note: 'a gerar' },
      { id: 'muffler', namePt: 'Silencioso / escapamento', note: 'a gerar' },
    ],
  },
  {
    id: 'cooling',
    titlePt: 'Arrefecimento',
    descriptionPt: 'Controla a temperatura do motor.',
    items: [
      { id: 'cooling-fan', namePt: 'Eletroventilador', partId: 'cooling-fan' },
      { id: 'water-pump', namePt: 'Bomba d agua', note: 'a gerar' },
      { id: 'radiator', namePt: 'Radiador', note: 'a gerar' },
      { id: 'thermostat', namePt: 'Valvula termostatica', note: 'a gerar' },
      { id: 'expansion-tank', namePt: 'Reservatorio de expansao', note: 'a gerar' },
      { id: 'hoses', namePt: 'Mangueiras', note: 'a gerar' },
      { id: 'radiator-cap', namePt: 'Tampa do radiador', note: 'a gerar' },
    ],
  },
  {
    id: 'lubrication',
    titlePt: 'Lubrificacao',
    descriptionPt: 'Pressuriza e distribui o oleo.',
    items: [
      { id: 'oil-pump', namePt: 'Bomba de oleo', note: 'a gerar' },
      { id: 'oil-filter', namePt: 'Filtro de oleo', note: 'a gerar' },
      { id: 'oil-pickup', namePt: 'Pescador de oleo', note: 'a gerar' },
      { id: 'relief-valve', namePt: 'Valvula de alivio', note: 'a gerar' },
      { id: 'dipstick', namePt: 'Vareta de nivel', note: 'a gerar' },
    ],
  },
  {
    id: 'turbo',
    titlePt: 'Superalimentacao (opcional)',
    descriptionPt: 'Modulo turbo do motor.',
    items: [
      { id: 'turbo', namePt: 'Turbocompressor', note: 'a gerar' },
      { id: 'intercooler', namePt: 'Intercooler', note: 'a gerar' },
      { id: 'wastegate', namePt: 'Wastegate', note: 'a gerar' },
    ],
  },
  {
    id: 'sensors',
    titlePt: 'Sensores',
    descriptionPt: 'Os "sentidos" do motor que informam a ECU.',
    items: [
      { id: 'ckp', namePt: 'Sensor de rotacao (CKP)', partId: 'ckp-sensor' },
      { id: 'cmp', namePt: 'Sensor de fase (CMP)', partId: 'ckp-sensor' },
      { id: 'map', namePt: 'Sensor de pressao (MAP)', partId: 'map-sensor' },
      { id: 'tps', namePt: 'Sensor de borboleta (TPS)', partId: 'tps-sensor' },
      { id: 'iat-ect', namePt: 'Sensor de temperatura (IAT/ECT)', partId: 'temp-sensor' },
      { id: 'lambda', namePt: 'Sonda lambda (O2)', partId: 'lambda-sensor' },
      { id: 'knock', namePt: 'Sensor de detonacao (knock)', partId: 'knock-sensor' },
      { id: 'maf', namePt: 'Sensor de fluxo de ar (MAF)', note: 'a gerar' },
      { id: 'oil-pressure-sensor', namePt: 'Sensor de pressao de oleo', note: 'a gerar' },
      { id: 'vss', namePt: 'Sensor de velocidade (VSS)', note: 'a gerar' },
      { id: 'app', namePt: 'Sensor de pedal (APP)', note: 'a gerar' },
    ],
  },
  {
    id: 'electrical',
    titlePt: 'Controle e eletrico',
    descriptionPt: 'Cerebro e energia do sistema.',
    items: [
      { id: 'ecu', namePt: 'ECU (central eletronica)', partId: 'ecu' },
      { id: 'battery', namePt: 'Bateria', note: 'a gerar' },
      { id: 'alternator', namePt: 'Alternador', note: 'a gerar' },
      { id: 'starter', namePt: 'Motor de partida', note: 'a gerar' },
      { id: 'relays-fuses', namePt: 'Reles e fusiveis', note: 'a gerar' },
      { id: 'harness', namePt: 'Chicote eletrico', note: 'a gerar' },
    ],
  },
];
