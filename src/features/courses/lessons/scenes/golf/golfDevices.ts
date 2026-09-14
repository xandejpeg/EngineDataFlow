import * as THREE from 'three';
import type { Position } from './golfAssembly';
import type { DeviceShape } from './GolfDeviceBodies';
import { wireColor, wireLabel } from './golfLoom';
import { CYLINDER_AXES, harnessLoom, type HarnessRoute } from './golfSensorHarness';

export type DeviceKind = 'sensor' | 'actuator';
/** Papel eletrico do fio no conector do componente, nao a pinagem de fabrica. */
export type TerminalRole = 'positive' | 'negative' | 'signal' | 'command';

export const TERMINAL_ROLES: Record<TerminalRole, { label: string; sign: string; color: string }> = {
  positive: { label: 'Positivo / alimentacao', sign: '+', color: '#c4382d' },
  negative: { label: 'Negativo / massa', sign: '\u2212', color: '#7b5433' },
  signal: { label: 'Sinal para a ECU', sign: 'S', color: '#0f8f7a' },
  command: { label: 'Comando por terra da ECU', sign: 'C', color: '#8a5cc0' },
};

export const DEVICE_KINDS: Record<DeviceKind, { label: string; plural: string; color: string }> = {
  sensor: { label: 'Sensor', plural: 'Sensores', color: '#0f7f8c' },
  actuator: { label: 'Atuador', plural: 'Atuadores', color: '#b9702a' },
};

const PORT_LABELS: Record<string, string> = {
  'plug-signal': 'ECU / borne de sinal',
  'plug-exhaust': 'ECU / borne das sondas',
  'plug-reference': 'ECU / referencia 5 V',
  'plug-sensor-ground': 'ECU / massa de sinal',
  'plug-actuator': 'ECU / estagio de potencia',
  'plug-ground': 'ECU / massa de potencia',
  'plug-permanent': 'ECU / borne 30',
  'plug-terminal15': 'ECU / borne 15',
  'shelf-fuse': 'Rele principal / borne 87',
  'riser-pre': 'Rele principal / borne 87',
  'riser-post': 'Rele principal / borne 87',
  'modulo-nox': 'Modulo de NOx J583',
};

interface DeviceSpec {
  id: string; part: number; name: string; code: string; kind: DeviceKind; system: string;
  /** Para que serve na pratica, em uma frase. O nome sozinho nao diz o que a peca faz. */
  job: string;
  shape: DeviceShape;
  principle: string; routes: string[];
}

const DEVICE_SPECS: DeviceSpec[] = [
  { id: 'maf', part: 2, name: 'Medidor de massa de ar', code: 'G70', kind: 'sensor', system: 'Ar', shape: 'cartridge', job: 'Mede quanto ar entra para a ECU saber quanta gasolina injetar', principle: 'Filme quente alimentado em 5 V', routes: ['maf'] },
  { id: 'map', part: 11, name: 'Pressao e temperatura do coletor', code: 'G71 / G42', kind: 'sensor', system: 'Ar', shape: 'pressure', job: 'Diz a carga do motor pela pressao do coletor e corrige a densidade do ar', principle: 'Piezorresistivo + NTC, alimentado em 5 V', routes: ['map'] },
  { id: 'rail-pressure', part: 13, name: 'Pressao da galeria de alta', code: 'G247', kind: 'sensor', system: 'Combustivel', shape: 'pressure', job: 'Fecha a malha da bomba de alta e define o tempo de abertura do bico', principle: 'Piezorresistivo alimentado em 5 V', routes: ['rail-pressure'] },
  { id: 'ckp', part: 17, name: 'Rotacao do virabrequim', code: 'G28', kind: 'sensor', system: 'Ignicao', shape: 'inductive', job: 'Da a posicao e a rotacao do motor: sem ele nao ha faisca nem injecao', principle: 'Indutivo: gera o proprio sinal, sem alimentacao', routes: ['ckp'] },
  { id: 'cmp', part: 20, name: 'Fase do comando', code: 'G40', kind: 'sensor', system: 'Ignicao', shape: 'hall', job: 'Diz qual das duas voltas o motor esta fazendo para acertar cilindro e tempo', principle: 'Efeito Hall alimentado em 5 V', routes: ['cmp'] },
  { id: 'ect', part: 21, name: 'Temperatura do liquido', code: 'G62', kind: 'sensor', system: 'Arrefecimento', shape: 'ntc', job: 'Enriquece a mistura com o motor frio e liga a ventoinha quando esquenta', principle: 'NTC: resistencia variavel, sem alimentacao propria', routes: ['ect'] },
  { id: 'knock-1', part: 16, name: 'Detonacao 1', code: 'G61', kind: 'sensor', system: 'Ignicao', shape: 'knock', job: 'Escuta a batida de pino nos cilindros 1 e 2 para a ECU atrasar o ponto', principle: 'Piezoeletrico: gera o proprio sinal', routes: ['knock-1'] },
  { id: 'knock-2', part: 16, name: 'Detonacao 2', code: 'G66', kind: 'sensor', system: 'Ignicao', shape: 'knock', job: 'Escuta a batida de pino nos cilindros 3 e 4 para a ECU atrasar o ponto', principle: 'Piezoeletrico: gera o proprio sinal', routes: ['knock-2'] },
  { id: 'lambda-pre', part: 22, name: 'Sonda de banda larga', code: 'G39', kind: 'sensor', system: 'Escape', shape: 'probe', job: 'Mede o lambda real do gas e corrige a mistura em malha fechada', principle: 'Celula de bombeamento e celula de Nernst; o aquecedor e comandado por PWM', routes: ['lambda-pre', 'lambda-pre-pump', 'lambda-pre-trim', 'heater-pre', 'heater-pre-command'] },
  { id: 'lambda-post', part: 26, name: 'Sonda de banda estreita', code: 'G130', kind: 'sensor', system: 'Escape', shape: 'probe', job: 'Compara o gas depois do catalisador para julgar se ele ainda trabalha', principle: 'Celula de Nernst: gera a propria tensao, so o aquecedor recebe 12 V', routes: ['lambda-post', 'heater-post', 'heater-post-command'] },
  { id: 'egt', part: 24, name: 'Temperatura do escape', code: 'G235', kind: 'sensor', system: 'Escape', shape: 'probe', job: 'Protege catalisador e acumulador limitando a temperatura do gas', principle: 'Resistencia variavel, sem alimentacao propria', routes: ['egt'] },
  { id: 'nox', part: 25, name: 'Sonda de NOx', code: 'G295', kind: 'sensor', system: 'Escape', shape: 'probe', job: 'Mede o NOx que escapa e pede a regeneracao do acumulador', principle: 'Celula ceramica lida pelo modulo J583', routes: ['nox'] },

  { id: 'egr', part: 12, name: 'Valvula de EGR resfriada', code: 'N18 / G212', kind: 'actuator', system: 'Escape', shape: 'solenoid', job: 'Devolve gas de escape para a admissao e derruba a temperatura de combustao', principle: 'Solenoide comandado por terra, com realimentacao de posicao', routes: ['egr'] },
  { id: 'purge', part: 8, name: 'Valvula de purga do canister', code: 'N80', kind: 'actuator', system: 'Combustivel', shape: 'solenoid', job: 'Manda o vapor de gasolina guardado no canister para o motor queimar', principle: 'Solenoide comandado por terra em ciclo de trabalho', routes: ['purge'] },
  ...CYLINDER_AXES.map((axis, index): DeviceSpec => ({
    id: `injector-${axis}`, part: 15, name: `Injetor do cilindro ${index + 1}`, code: `N${30 + index}`, kind: 'actuator', system: 'Combustivel', shape: 'injector',
    job: `Pulveriza a gasolina direto na camara do cilindro ${index + 1} no instante calculado`,
    principle: 'Injecao direta: 12 V permanente e terra pulsado pela ECU', routes: [`injector-${axis}`],
  })),
  ...CYLINDER_AXES.map((axis, index): DeviceSpec => ({
    id: `coil-${axis}`, part: 19, name: `Bobina do cilindro ${index + 1}`, code: ['N70', 'N127', 'N291', 'N292'][index], kind: 'actuator', system: 'Ignicao', shape: 'coil',
    job: `Transforma 12 V em dezenas de milhares de volts e solta a faisca no cilindro ${index + 1}`,
    principle: 'Primario aterrado pela ECU durante o dwell e cortado na faisca', routes: [`coil-${axis}`],
  })),
];

export interface DeviceTerminal {
  id: string; label: string; via: string; pin: number; role: TerminalRole; code: string; colorName: string; color: string;
  at: Position; far: Position; farLabel: string; points: Position[];
}

/** Base do conector: origem, eixo de saida dos fios e a grade de alojamentos. */
export interface DeviceConnector {
  at: Position; out: Position; right: Position; up: Position; rows: number; cols: number; pitch: number;
}

export interface GolfDevice extends Omit<DeviceSpec, 'routes'> {
  at: Position;
  connector: DeviceConnector;
  terminals: DeviceTerminal[];
}

/** Passo entre alojamentos: espaco suficiente para encostar a ponta de prova em uma via sem tocar na vizinha. */
export const PIN_PITCH = 12;
/** Profundidade do corpo do conector, onde os fios ainda correm separados antes de virar chicote. */
export const CONNECTOR_DEPTH = 30;

const distance = (a: Position, b: Position): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const roleOf = (route: HarnessRoute): TerminalRole => route.kind === 'feed' ? 'positive'
  : route.kind === 'return' ? 'negative'
    : route.port === 'plug-actuator' ? 'command' : 'signal';

const ROLE_ORDER: TerminalRole[] = ['positive', 'signal', 'command', 'negative'];

const vec = (point: Position) => new THREE.Vector3(...point);
const toArray = (vector: THREE.Vector3): Position => [vector.x, vector.y, vector.z];

/**
 * Todos os fios de um componente nascem no mesmo ponto da rota. Aqui a grade do conector e montada
 * em volta desse ponto para cada via ganhar um alojamento proprio onde a ponta de prova encosta.
 */
function connectorOf(at: Position, terminals: DeviceTerminal[]): DeviceConnector {
  const out = new THREE.Vector3();
  for (const terminal of terminals) {
    const step = vec(terminal.points[1]).sub(vec(terminal.at));
    if (step.lengthSq() > 1) out.add(step.normalize());
  }
  if (out.lengthSq() < 1e-4) out.set(0, 1, 0);
  out.normalize();
  const right = new THREE.Vector3(0, 1, 0).cross(out);
  if (right.lengthSq() < 1e-3) right.set(1, 0, 0);
  right.normalize();
  const rows = terminals.length > 3 ? 2 : 1;
  return { at, out: toArray(out), right: toArray(right), up: toArray(out.clone().cross(right).normalize()), rows, cols: Math.ceil(terminals.length / rows), pitch: PIN_PITCH };
}

/** Ponto do alojamento numero `index` na face do conector. */
export function pinPosition(connector: DeviceConnector, index: number, total: number): Position {
  const row = Math.floor(index / connector.cols);
  const inRow = Math.min(connector.cols, total - row * connector.cols);
  const dx = (index % connector.cols - (inRow - 1) / 2) * connector.pitch;
  const dy = ((connector.rows - 1) / 2 - row) * connector.pitch;
  return toArray(vec(connector.at).addScaledVector(vec(connector.right), dx).addScaledVector(vec(connector.up), dy));
}

let cache: GolfDevice[] | null = null;

/** Sensores e atuadores com fiacao modelada, ja orientados do componente para a ECU. */
export function golfDevices(): GolfDevice[] {
  if (cache) return cache;
  const routes = new Map(harnessLoom().routes.map(route => [route.id, route]));
  cache = DEVICE_SPECS.map(({ routes: declared, ...spec }) => {
    // Os fios de referencia, massa e alimentacao sao derivados da rota principal e entram pelo sufixo.
    const ids = [...declared, ...['reference', 'ground', 'supply'].map(suffix => `${declared[0]}-${suffix}`).filter(id => routes.has(id))];
    const at = routes.get(declared[0])!.points[0];
    const terminals = ids.map((id): DeviceTerminal => {
      const route = routes.get(id)!;
      const tail = route.points[route.points.length - 1];
      // O fio do aquecedor sai da caixa de fusiveis, entao a ponta do componente e a mais proxima do conector.
      const points = distance(route.points[0], at) <= distance(tail, at) ? route.points : [...route.points].reverse();
      return {
        id, label: route.label, via: route.label.split(' / ').pop()!, pin: 0, role: roleOf(route), code: route.code, colorName: wireLabel(route.code), color: wireColor(route.code),
        at: points[0], far: points[points.length - 1], farLabel: PORT_LABELS[route.port] ?? 'Caixa de fusiveis', points,
      };
    });
    terminals.sort((first, second) => ROLE_ORDER.indexOf(first.role) - ROLE_ORDER.indexOf(second.role));
    const connector = connectorOf(at, terminals);
    const exit = vec(connector.out).multiplyScalar(CONNECTOR_DEPTH);
    terminals.forEach((terminal, index) => {
      const pin = pinPosition(connector, index, terminals.length);
      terminal.pin = index + 1;
      terminal.at = pin;
      // O fio sai reto pelo fundo do alojamento e so depois se junta ao corredor original da rota.
      terminal.points = [pin, toArray(vec(pin).add(exit)), ...terminal.points.slice(1)];
    });
    return { ...spec, at, connector, terminals };
  });
  return cache;
}

export const DEVICE_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'sensor', label: 'Sensores' },
  { id: 'actuator', label: 'Atuadores' },
] as const;

export type DeviceFilter = typeof DEVICE_FILTERS[number]['id'];
