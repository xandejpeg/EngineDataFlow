import type { LoomPoint } from './golfLoom';

export interface LoomSource { id: string; points: LoomPoint[] }
export interface LoomSegment { points: [LoomPoint, LoomPoint]; radius: number }
export interface LoomBundle { id: string; label: string; members: string[]; points: LoomPoint[]; segments: LoomSegment[]; radius: number }
export interface LoomResult { routes: Map<string, LoomPoint[]>; bundles: LoomBundle[] }

/** Tolerancia para considerar que dois fios encostam no mesmo no do chicote. */
const GRID = 8;
export const WIRE_RADIUS = 2.4;
const PITCH = 6.2;
const SHEATH_WALL = 2.4;

type V3 = [number, number, number];

const keyOf = (point: LoomPoint): string => `${Math.round(point[0] / GRID)}:${Math.round(point[1] / GRID)}:${Math.round(point[2] / GRID)}`;
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scaled = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const unit = (a: V3): V3 => { const length = Math.hypot(a[0], a[1], a[2]); return length < 1e-6 ? [0, 0, 1] : scaled(a, 1 / length); };

/** Raio ocupado por `count` fios empacotados com passo `PITCH`. */
const packRadius = (count: number): number => PITCH * Math.sqrt(count * 0.2757);

/** Distribui os fios pela secao do feixe com espiral de angulo aureo, entao o feixe engrossa com a raiz do numero de vias. */
function slotOffset(slot: number, count: number): [number, number] {
  if (count < 2) return [0, 0];
  const radius = packRadius(count) * Math.sqrt((slot + 0.5) / count);
  const angle = slot * 2.39996323;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}

/**
 * Descobre onde os fios andam juntos: cada fio ganha uma posicao propria dentro do feixe
 * e cada trecho compartilhado vira um chicote. Trechos com composicao diferente viram
 * chicotes diferentes, entao dois fios formam um ramo fino que engrossa ao encontrar outros.
 */
export function buildLoom(sources: LoomSource[], zoneOf: (point: LoomPoint) => string): LoomResult {
  const members = new Map<string, string[]>();
  const anchor = new Map<string, LoomPoint>();
  const tangents = new Map<string, V3[]>();

  for (const source of sources) {
    source.points.forEach((point, index) => {
      const key = keyOf(point);
      if (!anchor.has(key)) anchor.set(key, point);
      const list = members.get(key) ?? [];
      if (!list.includes(source.id)) list.push(source.id);
      members.set(key, list);
      const before = source.points[index - 1] ?? point;
      const after = source.points[index + 1] ?? point;
      const local = tangents.get(key) ?? [];
      local.push(unit(sub(after, before)));
      tangents.set(key, local);
    });
  }
  for (const list of members.values()) list.sort();

  const frames = new Map<string, { u: V3; v: V3 }>();
  for (const [key, list] of tangents) {
    const reference = list[0];
    let accumulated: V3 = [0, 0, 0];
    for (const tangent of list) {
      const aligned = dot(tangent, reference) < 0 ? scaled(tangent, -1) : tangent;
      accumulated = [accumulated[0] + aligned[0], accumulated[1] + aligned[1], accumulated[2] + aligned[2]];
    }
    const spine = unit(accumulated);
    const up: V3 = Math.abs(spine[1]) > 0.9 ? [0, 0, 1] : [0, 1, 0];
    const u = unit(cross(spine, up));
    frames.set(key, { u, v: unit(cross(spine, u)) });
  }

  const routes = new Map<string, LoomPoint[]>();
  const spread = new Map<string, number>();
  for (const source of sources) {
    routes.set(source.id, source.points.map((point, index) => {
      // As pontas ficam no borne do conector; so o miolo entra no feixe.
      if (index === 0 || index === source.points.length - 1) return point;
      const key = keyOf(point);
      const list = members.get(key) ?? [];
      if (list.length < 2) return point;
      const [offsetU, offsetV] = slotOffset(list.indexOf(source.id), list.length);
      spread.set(`${key}|${source.id}`, Math.hypot(offsetU, offsetV));
      const { u, v } = frames.get(key)!;
      return [point[0] + u[0] * offsetU + v[0] * offsetV, point[1] + u[1] * offsetU + v[1] * offsetV, point[2] + u[2] * offsetU + v[2] * offsetV];
    }));
  }

  const edgeMembers = new Map<string, string[]>();
  const edgeEnds = new Map<string, [string, string]>();
  for (const source of sources) {
    for (let index = 1; index < source.points.length; index += 1) {
      const a = keyOf(source.points[index - 1]);
      const b = keyOf(source.points[index]);
      if (a === b) continue;
      const edge = a < b ? `${a}>${b}` : `${b}>${a}`;
      const list = edgeMembers.get(edge) ?? [];
      if (!list.includes(source.id)) list.push(source.id);
      edgeMembers.set(edge, list);
      edgeEnds.set(edge, a < b ? [a, b] : [b, a]);
    }
  }

  const groups = new Map<string, string[]>();
  for (const [edge, list] of edgeMembers) {
    if (list.length < 2) continue;
    const signature = [...list].sort().join(',');
    groups.set(signature, [...(groups.get(signature) ?? []), edge]);
  }

  const bundles: LoomBundle[] = [];
  for (const [signature, edges] of groups) {
    const group = signature.split(',');
    const pending = new Set(edges);
    const touching = new Map<string, string[]>();
    for (const edge of edges) for (const end of edgeEnds.get(edge)!) touching.set(end, [...(touching.get(end) ?? []), edge]);
    const liveDegree = (vertex: string) => (touching.get(vertex) ?? []).filter(edge => pending.has(edge)).length;

    while (pending.size) {
      let seed = '';
      for (const edge of pending) {
        const [a, b] = edgeEnds.get(edge)!;
        if (liveDegree(a) === 1 || liveDegree(b) === 1) { seed = edge; break; }
      }
      if (!seed) seed = pending.values().next().value as string;
      const [seedA, seedB] = edgeEnds.get(seed)!;
      const chain = liveDegree(seedA) === 1 ? [seedA, seedB] : [seedB, seedA];
      pending.delete(seed);
      for (;;) {
        const head = chain[chain.length - 1];
        const next = (touching.get(head) ?? []).find(edge => pending.has(edge));
        if (!next) break;
        pending.delete(next);
        const [a, b] = edgeEnds.get(next)!;
        chain.push(a === head ? b : a);
      }
      const points = chain.map(key => anchor.get(key)!);
      const segments: LoomSegment[] = [];
      for (let index = 1; index < chain.length; index += 1) {
        let widest = 0;
        for (const member of group) for (const vertex of [chain[index - 1], chain[index]]) widest = Math.max(widest, spread.get(`${vertex}|${member}`) ?? 0);
        segments.push({ points: [points[index - 1], points[index]], radius: widest + WIRE_RADIUS + SHEATH_WALL });
      }
      const named = points.map(zoneOf).filter(zone => zone !== 'Ramal');
      const head = named[0] ?? 'Ramal';
      const tail = named[named.length - 1] ?? head;
      bundles.push({
        id: `chicote-${bundles.length + 1}`,
        label: `${head === tail ? head : `${head} → ${tail}`} — ${group.length} vias`,
        members: group,
        points,
        segments,
        radius: Math.max(...segments.map(segment => segment.radius)),
      });
    }
  }

  return { routes, bundles };
}
