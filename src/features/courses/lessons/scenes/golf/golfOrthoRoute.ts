export type OrthoPoint = [number, number, number];

/** No de um corredor. O trecho ate o pai e percorrido um eixo de cada vez. */
export interface TrunkNode { id: string; at: OrthoPoint; parent: string | null; zone: string }

const AXIS: Record<string, number> = { x: 0, y: 1, z: 2 };
const EPS = 0.5;

/** Cantos de um caminho em L entre dois pontos, mudando um eixo por vez; nao inclui os extremos. */
export function orthoStub(from: OrthoPoint, to: OrthoPoint, order = 'yxz'): OrthoPoint[] {
  const cursor: OrthoPoint = [from[0], from[1], from[2]];
  const corners: OrthoPoint[] = [];
  for (const letter of order) {
    const axis = AXIS[letter];
    if (Math.abs(to[axis] - cursor[axis]) < EPS) continue;
    cursor[axis] = to[axis];
    corners.push([cursor[0], cursor[1], cursor[2]]);
  }
  corners.pop();
  return corners;
}

export function trunkIndex(nodes: TrunkNode[]): Map<string, TrunkNode> {
  return new Map(nodes.map(node => [node.id, node]));
}

/** Ligacao direta em L entre dois pontos soltos, sem passar por corredor. */
export function orthoLine(from: OrthoPoint, to: OrthoPoint, order = 'yxz'): OrthoPoint[] {
  return [from, ...orthoStub(from, to, order), to];
}

type Index = Map<string, TrunkNode>;

const ancestry = (index: Index, id: string): TrunkNode[] => {
  const chain: TrunkNode[] = [];
  let current = index.get(id);
  while (current) {
    chain.push(current);
    current = current.parent ? index.get(current.parent) : undefined;
  }
  return chain;
};

/** Caminho unico entre dois nos da arvore, ja com os cantos preenchidos. */
export function trunkPath(index: Index, fromId: string, toId: string): OrthoPoint[] {
  const climb = ancestry(index, fromId);
  const descend = ancestry(index, toId);
  const seen = new Set(descend.map(node => node.id));
  const junction = climb.findIndex(node => seen.has(node.id));
  const tail = descend.slice(0, descend.findIndex(node => node.id === climb[junction].id)).reverse();
  const nodes = [...climb.slice(0, junction + 1), ...tail];
  const points: OrthoPoint[] = [nodes[0].at];
  for (let index2 = 1; index2 < nodes.length; index2 += 1) {
    points.push(...orthoStub(nodes[index2 - 1].at, nodes[index2].at), nodes[index2].at);
  }
  return points;
}

export interface OrthoSpec {
  from: OrthoPoint;
  fromPort: string;
  toPort: string;
  to: OrthoPoint;
  /** Ordem dos eixos ao sair do conector e ao chegar no outro conector. */
  inOrder?: string;
  outOrder?: string;
}

/**
 * Monta a rota conector -> corredor -> conector. Como todos os fios reusam os mesmos nos,
 * os trechos compartilhados ficam com coordenadas identicas e o agrupador os funde num chicote.
 */
export function orthoRoute(index: Index, spec: OrthoSpec): OrthoPoint[] {
  const entry = index.get(spec.fromPort)!.at;
  const exit = index.get(spec.toPort)!.at;
  const raw: OrthoPoint[] = [
    spec.from,
    ...orthoStub(spec.from, entry, spec.inOrder),
    ...trunkPath(index, spec.fromPort, spec.toPort),
    ...orthoStub(exit, spec.to, spec.outOrder),
    spec.to,
  ];
  return raw.filter((point, position) => position === 0
    || Math.hypot(point[0] - raw[position - 1][0], point[1] - raw[position - 1][1], point[2] - raw[position - 1][2]) > EPS);
}
