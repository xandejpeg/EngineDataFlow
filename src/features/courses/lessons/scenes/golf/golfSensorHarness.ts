import type { Position } from './golfAssembly';
import { ENGINE_CONNECTORS } from './golfMounts';
import { engineToWorld } from './golfPhysics';
import { testPoint } from './golfService';
import { zoneFinder, type LoomZone } from './golfLoom';
import { buildLoom } from './golfLoomBundles';
import { orthoRoute, trunkIndex, type OrthoSpec, type TrunkNode } from './golfOrthoRoute';

// Faces do conector de 16 vias da ECU; x entre -425 e -275, z na face do plugue.
export const ECU_PORTS = {
  ground: [-420, 930, 360] as Position,
  signal: [-400, 930, 360] as Position,
  exhaust: [-380, 930, 360] as Position,
  reference: [-362, 930, 360] as Position,
  sensorGround: [-332, 930, 360] as Position,
  actuator: [-315, 930, 360] as Position,
  permanent: [-295, 930, 360] as Position,
  terminal15: [-278, 930, 360] as Position,
};

export const IGNITION_LOCK_PLUG: Position = [-350, 743, 780];
export const NOX_MODULE_PLUG: Position = [-80, 320, 1150];
export const RADIATOR_FAN_PLUG: Position = [0, 545, -730];
export const CYLINDER_AXES = [0, 88, 176, 264];
/** Ordem dos cilindros ao longo da espinha, do lado da ECU (x menor) para o outro extremo. */
const SPINE_ORDER = [264, 176, 88, 0];

const SHELF = 'Prateleira do corta-fogo';
const HEAD = 'Tampa de valvulas';
const RISER = 'Subida do escape';
const FENDER = 'Paralama esquerdo';
const PLUG = 'Conector da ECU';
const GROMMET = 'Passa-fio do corta-fogo';
const FRONT = 'Travessa dianteira';
const NOSE = 'Frente do motor';

/**
 * Arvore de corredores do cofre. Cada trecho anda num eixo so, por vao livre medido:
 * prateleira em y=900 (acima da bateria 875 e da caixa de fusiveis 830), subida em x=-120/z=410
 * (entre as pecas do motor, que acabam em z=82, e o corta-fogo em z=450) e espinha em y=830
 * (acima da tampa de valvulas 802 e das bobinas 812).
 */
export const BAY_TRUNK: TrunkNode[] = [
  { id: 'shelf-plug', at: [-348, 900, 340], parent: null, zone: SHELF },
  { id: 'shelf-riser', at: [-120, 900, 340], parent: 'shelf-plug', zone: SHELF },
  { id: 'shelf-head', at: [20, 900, 340], parent: 'shelf-riser', zone: SHELF },
  { id: 'shelf-engine', at: [316, 900, 340], parent: 'shelf-head', zone: SHELF },
  { id: 'shelf-fender', at: [-450, 900, 340], parent: 'shelf-plug', zone: SHELF },
  { id: 'shelf-fuse', at: [-560, 900, 340], parent: 'shelf-fender', zone: SHELF },
  { id: 'shelf-grommet', at: [-668, 900, 340], parent: 'shelf-fuse', zone: SHELF },

  // Pente do conector: avanca ate a face do plugue, sobe e corre em x passando por cada borne.
  { id: 'plug-front', at: [-348, 900, 360], parent: 'shelf-plug', zone: PLUG },
  { id: 'plug-rail', at: [-348, 930, 360], parent: 'plug-front', zone: PLUG },
  { id: 'plug-sensor-ground', at: [-332, 930, 360], parent: 'plug-rail', zone: PLUG },
  { id: 'plug-actuator', at: [-315, 930, 360], parent: 'plug-sensor-ground', zone: PLUG },
  { id: 'plug-permanent', at: [-295, 930, 360], parent: 'plug-actuator', zone: PLUG },
  { id: 'plug-terminal15', at: [-278, 930, 360], parent: 'plug-permanent', zone: PLUG },
  { id: 'plug-reference', at: [-362, 930, 360], parent: 'plug-rail', zone: PLUG },
  { id: 'plug-exhaust', at: [-380, 930, 360], parent: 'plug-reference', zone: PLUG },
  { id: 'plug-signal', at: [-400, 930, 360], parent: 'plug-exhaust', zone: PLUG },
  { id: 'plug-ground', at: [-420, 930, 360], parent: 'plug-signal', zone: PLUG },

  // Espinha sobre a tampa de valvulas, com uma derivacao por cilindro.
  { id: 'head-front', at: [20, 900, -40], parent: 'shelf-head', zone: HEAD },
  { id: 'head-spine', at: [20, 830, -40], parent: 'head-front', zone: HEAD },
  // Encadeados do cilindro mais proximo da ECU (eixo 264 => x 36) para o mais distante.
  ...SPINE_ORDER.map((axis, index): TrunkNode => ({
    id: `head-cyl-${axis}`,
    at: [300 - axis, 830, -40],
    parent: index ? `head-cyl-${SPINE_ORDER[index - 1]}` : 'head-spine',
    zone: HEAD,
  })),

  // Subida do lado do escape, rente ao corta-fogo e fora de todas as pecas.
  { id: 'riser-top', at: [-120, 900, 410], parent: 'shelf-riser', zone: RISER },
  { id: 'riser-pre', at: [-120, 660, 410], parent: 'riser-top', zone: RISER },
  { id: 'riser-egr', at: [-120, 625, 410], parent: 'riser-pre', zone: RISER },
  { id: 'riser-post', at: [-120, 470, 410], parent: 'riser-egr', zone: RISER },
  { id: 'riser-floor', at: [-120, 230, 410], parent: 'riser-post', zone: RISER },

  // Paralama esquerdo, por fora da bateria e da torre do amortecedor.
  { id: 'fender-front', at: [-450, 900, -270], parent: 'shelf-fender', zone: FENDER },
  { id: 'fender-maf', at: [-450, 760, -270], parent: 'fender-front', zone: FENDER },
  { id: 'fender-fan', at: [-450, 545, -270], parent: 'fender-maf', zone: FENDER },

  // Plano livre a frente do motor: a peca mais avancada termina em z=-255, entao o corredor corre em z=-300.
  { id: 'nose-top', at: [-450, 900, -300], parent: 'fender-front', zone: NOSE },
  { id: 'nose-deck', at: [-450, 830, -300], parent: 'nose-top', zone: NOSE },
  { id: 'nose-cross', at: [-60, 830, -300], parent: 'nose-deck', zone: NOSE },
  { id: 'nose-block', at: [-60, 483, -300], parent: 'nose-cross', zone: NOSE },
  { id: 'nose-sump', at: [-60, 430, -300], parent: 'nose-block', zone: NOSE },

  // Travessa dianteira, atras do radiador (z>-767) e por fora da ventoinha (x<-115).
  { id: 'front-fan', at: [-450, 545, -730], parent: 'fender-fan', zone: FRONT },
  { id: 'fan-plug', at: [-130, 545, -730], parent: 'front-fan', zone: FRONT },

  // Passa-fio do corta-fogo, o mesmo furo usado pelo chicote da carroceria.
  { id: 'grommet-hole', at: [-668, 640, 340], parent: 'shelf-grommet', zone: GROMMET },
  { id: 'grommet-cabin', at: [-668, 640, 780], parent: 'grommet-hole', zone: GROMMET },
];

const BAY = trunkIndex(BAY_TRUNK);

/** Roteia qualquer fio avulso pelos mesmos corredores do chicote. */
export const bayRoute = (spec: OrthoSpec): Position[] => orthoRoute(BAY, spec) as Position[];

const BAY_ZONES: LoomZone[] = [SHELF, HEAD, RISER, FENDER, PLUG, GROMMET, FRONT, NOSE].map(label => ({
  label,
  points: BAY_TRUNK.filter(node => node.zone === label).map(node => node.at),
}));

export type HarnessKind = 'signal' | 'feed' | 'return';
export interface HarnessRoute { id: string; part: number; label: string; kind: HarnessKind; code: string; port: string; points: Position[] }

const probePlug = (axis: number, height: number, depth: number): Position => [axis, height + 50, depth];

/** Vias do conector de cada sonda, espalhadas em x para o chicote abrir em leque na saida. */
const PRE_PROBE = (axis: number): Position => probePlug(axis, 595, 143);
const POST_PROBE = (axis: number): Position => probePlug(axis, 350, 225);

/** Conectores presos ao proprio motor, ja convertidos para o referencial do carro. */
const enginePlug = (name: string): Position => engineToWorld(ENGINE_CONNECTORS.find(item => item.name === name)!.point);

type HarnessSpec = Omit<HarnessRoute, 'points' | 'port'> & {
  from: Position; fromPort: string; toPort: string; to: Position; inOrder?: string; outOrder?: string;
};

const build = ({ from, fromPort, toPort, to, inOrder, outOrder, ...rest }: HarnessSpec): HarnessRoute =>
  ({ ...rest, port: toPort, points: orthoRoute(BAY, { from, fromPort, toPort, to, inOrder, outOrder }) as Position[] });

const SENSOR_SPECS: HarnessSpec[] = [
  { id: 'maf', part: 2, label: 'Massa de ar G70 / sinal', kind: 'signal', code: 'gn',
    from: [-180, 712, -330], fromPort: 'fender-maf', toPort: 'plug-signal', to: ECU_PORTS.signal, inOrder: 'yzx' },
  { id: 'egr', part: 12, label: 'Recirculacao N18 e posicao G212 / comando do solenoide', kind: 'signal', code: 'gn/ge',
    from: [-10, 625, 0], fromPort: 'riser-egr', toPort: 'plug-actuator', to: ECU_PORTS.actuator, inOrder: 'yxz' },
  { id: 'purge', part: 8, label: 'Valvula do canister N80 / comando do solenoide', kind: 'signal', code: 'sw/gn',
    from: [-20, 760, -230], fromPort: 'head-front', toPort: 'plug-actuator', to: ECU_PORTS.actuator, inOrder: 'yxz' },
  // Quatro cilindros em linha = um banco de escape, entao uma sonda antes e uma depois do catalisador.
  { id: 'lambda-pre', part: 22, label: 'Banda larga G39 / celula de Nernst', kind: 'signal', code: 'vi',
    from: PRE_PROBE(145), fromPort: 'riser-pre', toPort: 'plug-exhaust', to: ECU_PORTS.exhaust, inOrder: 'yxz' },
  { id: 'lambda-post', part: 26, label: 'Banda estreita G130 / sinal', kind: 'signal', code: 'bl',
    from: POST_PROBE(145), fromPort: 'riser-post', toPort: 'plug-exhaust', to: ECU_PORTS.exhaust, inOrder: 'yxz' },
  { id: 'egt', part: 24, label: 'Temperatura do escape G235 / sinal', kind: 'signal', code: 'gr/ge',
    from: probePlug(-60, 210, 560), fromPort: 'riser-floor', toPort: 'plug-exhaust', to: ECU_PORTS.exhaust, inOrder: 'yxz' },
  ...CYLINDER_AXES.map((axis): HarnessSpec => ({
    id: `coil-${axis}`, part: 19, label: 'Bobina / comando do primario', kind: 'signal', code: 'sw/bl',
    from: engineToWorld([axis, 394, 6]), fromPort: `head-cyl-${axis}`, toPort: 'plug-actuator', to: ECU_PORTS.actuator, inOrder: 'yzx',
  })),
  ...CYLINDER_AXES.map((axis): HarnessSpec => ({
    // Desce pela frente da tampa de valvulas (z<-69) e passa longe da galeria de alta (z>-113).
    id: `injector-${axis}`, part: 15, label: 'Injetor / comando pelo estagio de potencia', kind: 'signal', code: 'sw/ge',
    from: engineToWorld([axis, 274, 80]), fromPort: `head-cyl-${axis}`, toPort: 'plug-actuator', to: ECU_PORTS.actuator, inOrder: 'yzx',
  })),
  // Conectores do bloco e do cabecote: saem pela frente do motor (z=-300) e sobem pelo paralama.
  { id: 'map', part: 11, label: 'Coletor G71 e G42 / sinal', kind: 'signal', code: 'gr/bl',
    from: enginePlug('map'), fromPort: 'nose-block', toPort: 'plug-signal', to: ECU_PORTS.signal, inOrder: 'zyx' },
  { id: 'rail-pressure', part: 13, label: 'Pressao da galeria G247 / sinal', kind: 'signal', code: 'gr/ro',
    from: enginePlug('rail-pressure'), fromPort: 'nose-block', toPort: 'plug-signal', to: ECU_PORTS.signal, inOrder: 'zyx' },
  { id: 'cmp', part: 20, label: 'Fase do comando G40 / sinal', kind: 'signal', code: 'gr/gn',
    from: enginePlug('cmp'), fromPort: 'nose-block', toPort: 'plug-signal', to: ECU_PORTS.signal, inOrder: 'zyx' },
  { id: 'ckp', part: 17, label: 'Rotacao do virabrequim G28 / sinal', kind: 'signal', code: 'gr/sw',
    from: enginePlug('ckp'), fromPort: 'nose-sump', toPort: 'plug-signal', to: ECU_PORTS.signal, inOrder: 'yzx' },
  { id: 'ect', part: 21, label: 'Temperatura do liquido G62 / sinal', kind: 'signal', code: 'br/bl',
    from: enginePlug('ect'), fromPort: 'riser-top', toPort: 'plug-signal', to: ECU_PORTS.signal, inOrder: 'zyx' },
  ...['knock-1', 'knock-2'].map((name, index): HarnessSpec => ({
    id: name, part: 16, label: index ? 'Detonacao G66 / sinal' : 'Detonacao G61 / sinal', kind: 'signal', code: index ? 'gr/ws' : 'gr/ge',
    from: enginePlug(name), fromPort: 'nose-block', toPort: 'plug-signal', to: ECU_PORTS.signal, inOrder: 'zxy',
  })),
];

const NOX_ROUTE: HarnessRoute = {
  id: 'nox', part: 25, label: 'Sonda de NOx G295 / sinal para o modulo J583', kind: 'signal', code: 'or/sw', port: 'modulo-nox',
  points: [probePlug(-80, 205, 1180), [-80, 255, 1150], NOX_MODULE_PLUG],
};

/** Sensores alimentados com 5 V pela ECU; os demais geram o proprio sinal (NTC, piezo, indutivo, sondas). */
const REFERENCE_FED = new Set(['maf', 'map', 'rail-pressure', 'cmp']);

const fuseTop = (blade: Position): Position => [blade[0], 769, blade[2]];

/**
 * Fecha o circuito de cada componente: sensor recebe massa de sinal (e 5 V quando e alimentado),
 * atuador recebe 12 V do borne 87. Reusa o corredor da rota principal, entao so muda o borne de chegada.
 */
function companionSpecs(): HarnessSpec[] {
  const relay87 = fuseTop(testPoint('relay87')!.position);
  return SENSOR_SPECS.flatMap((spec): HarnessSpec[] => spec.toPort === 'plug-actuator'
    ? [{ ...spec, id: `${spec.id}-supply`, label: `${spec.label} / alimentacao 12 V`, kind: 'feed', code: 'ro/sw', toPort: 'shelf-fuse', to: relay87, outOrder: 'yxz' }]
    : [
      ...REFERENCE_FED.has(spec.id) ? [{ ...spec, id: `${spec.id}-reference`, label: `${spec.label} / referencia 5 V`, kind: 'feed' as const, code: 'ro/ws', toPort: 'plug-reference', to: ECU_PORTS.reference }] : [],
      { ...spec, id: `${spec.id}-ground`, label: `${spec.label} / massa de sinal`, kind: 'return', code: 'br/ws', toPort: 'plug-sensor-ground', to: ECU_PORTS.sensorGround },
    ]);
}

/**
 * Vias que fogem do padrao sensor/atuador: a banda larga tem celula de bombeamento e resistor de
 * calibracao alem do sinal, e os dois aquecedores recebem 12 V do rele e sao comandados por terra.
 */
function probeSpecs(): HarnessSpec[] {
  const relay87 = fuseTop(testPoint('relay87')!.position);
  return [
    { id: 'lambda-pre-pump', part: 22, label: 'Banda larga G39 / celula de bombeamento', kind: 'signal', code: 'vi/ge',
      from: PRE_PROBE(153), fromPort: 'riser-pre', toPort: 'plug-exhaust', to: ECU_PORTS.exhaust, inOrder: 'yxz' },
    { id: 'lambda-pre-trim', part: 22, label: 'Banda larga G39 / resistor de calibracao', kind: 'signal', code: 'vi/gr',
      from: PRE_PROBE(161), fromPort: 'riser-pre', toPort: 'plug-exhaust', to: ECU_PORTS.exhaust, inOrder: 'yxz' },
    { id: 'heater-pre', part: 22, label: 'Aquecedor da banda larga / 12 V do borne 87', kind: 'feed', code: 'ro/sw',
      from: relay87, fromPort: 'shelf-fuse', toPort: 'riser-pre', to: PRE_PROBE(129), inOrder: 'xyz', outOrder: 'yxz' },
    { id: 'heater-pre-command', part: 22, label: 'Aquecedor da banda larga / comando por terra', kind: 'signal', code: 'sw/vi',
      from: PRE_PROBE(137), fromPort: 'riser-pre', toPort: 'plug-actuator', to: ECU_PORTS.actuator, inOrder: 'yxz' },
    { id: 'heater-post', part: 26, label: 'Aquecedor da banda estreita / 12 V do borne 87', kind: 'feed', code: 'ro/br',
      from: relay87, fromPort: 'shelf-fuse', toPort: 'riser-post', to: POST_PROBE(129), inOrder: 'xyz', outOrder: 'yxz' },
    { id: 'heater-post-command', part: 26, label: 'Aquecedor da banda estreita / comando por terra', kind: 'signal', code: 'sw/bl',
      from: POST_PROBE(137), fromPort: 'riser-post', toPort: 'plug-actuator', to: ECU_PORTS.actuator, inOrder: 'yxz' },
  ];
}

function powerSpecs(): HarnessSpec[] {
  const bodyGround = testPoint('bodyGround')!.position;
  const ecuOut = testPoint('ecu-out')!.position;
  return [
    { id: 'ecu-ground', part: 3, label: 'Massa da ECU no cofre', kind: 'return', code: 'br',
      from: bodyGround, fromPort: 'shelf-grommet', toPort: 'plug-ground', to: ECU_PORTS.ground, inOrder: 'zxy' },
    { id: 'ecu-permanent', part: 3, label: 'Borne 30 permanente da ECU', kind: 'feed', code: 'ro',
      from: fuseTop(ecuOut), fromPort: 'shelf-fuse', toPort: 'plug-permanent', to: ECU_PORTS.permanent, inOrder: 'xyz' },
    { id: 'ecu-terminal15', part: 3, label: 'Borne 15 da chave de ignicao', kind: 'feed', code: 'sw',
      from: IGNITION_LOCK_PLUG, fromPort: 'grommet-cabin', toPort: 'plug-terminal15', to: ECU_PORTS.terminal15, inOrder: 'yxz' },
  ];
}

export function harnessLoom() {
  const routes = [...SENSOR_SPECS.map(build), ...companionSpecs().map(build), ...probeSpecs().map(build), ...powerSpecs().map(build), NOX_ROUTE];
  const loom = buildLoom(routes, zoneFinder(BAY_ZONES, 260));
  return {
    routes: routes.map(route => ({ ...route, points: loom.routes.get(route.id) as Position[] })),
    bundles: loom.bundles,
  };
}
