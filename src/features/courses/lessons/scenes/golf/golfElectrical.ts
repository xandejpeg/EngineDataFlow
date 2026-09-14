export const FUSE_CIRCUITS = [
  { id: 'main', label: 'Distribuicao principal', location: 'Cofre', color: '#cc9a57' },
  { id: 'ecu', label: 'ECU / rele principal', location: 'Cofre', color: '#bc514d' },
  { id: 'pump', label: 'Bomba de combustivel', location: 'Cofre', color: '#e0b341' },
  { id: 'ignition', label: 'Bobinas', location: 'Cofre', color: '#4f91b9' },
  { id: 'diagnostics', label: 'Tomada OBD2', location: 'Habitaculo', color: '#bc514d' },
  { id: 'lighting', label: 'Iluminacao externa', location: 'Cofre', color: '#8fa06a' },
  { id: 'comfort', label: 'Conforto e travas', location: 'Cofre', color: '#7f8fbb' },
  { id: 'fan', label: 'Ventoinha do radiador', location: 'Cofre', color: '#b5763f' },
  { id: 'instrument', label: 'Painel de instrumentos', location: 'Habitaculo', color: '#74a096' },
] as const;

export type FuseCircuit = typeof FUSE_CIRCUITS[number]['id'];

export type ElectricalNode = 'batteryPlus' | 'ground' | 'distribution' | 'ecuFeed' | 'relay87' | 'relay85' | 'relay86' | 'pumpFeed' | 'ignitionFeed' | 'obdFeed' | 'sensorReference'
  | 'lightingFeed' | 'comfortFeed' | 'fanFeed' | 'instrumentFeed';

export const FUSE_NODES: Record<FuseCircuit, readonly [ElectricalNode, ElectricalNode]> = {
  main: ['batteryPlus', 'distribution'],
  ecu: ['distribution', 'ecuFeed'],
  pump: ['distribution', 'pumpFeed'],
  ignition: ['relay87', 'ignitionFeed'],
  diagnostics: ['distribution', 'obdFeed'],
  lighting: ['distribution', 'lightingFeed'],
  comfort: ['distribution', 'comfortFeed'],
  fan: ['distribution', 'fanFeed'],
  instrument: ['distribution', 'instrumentFeed'],
};

const potentialCache = new Map<string, Readonly<Record<ElectricalNode, number | null>>>();

/** Um fusivel isolado ou uma lista deles; a lista permite desligar varios sistemas ao mesmo tempo. */
export type OpenFuses = FuseCircuit | null | readonly FuseCircuit[];

export function openFuseList(open: OpenFuses): readonly FuseCircuit[] {
  return open === null ? [] : typeof open === 'string' ? [open] : open;
}

export function electricalPotentials(keyOn: boolean, open: OpenFuses, volts: number): Readonly<Record<ElectricalNode, number | null>> {
  const openFuses = openFuseList(open);
  const cacheKey = `${keyOn}:${openFuses.join(',')}:${volts}`;
  const cached = potentialCache.get(cacheKey);
  if (cached) return cached;
  const relayClosed = keyOn && !openFuses.includes('main') && !openFuses.includes('ecu');
  const links: (readonly [ElectricalNode, ElectricalNode])[] = FUSE_CIRCUITS.filter(circuit => !openFuses.includes(circuit.id)).map(circuit => FUSE_NODES[circuit.id]);
  links.push(['ground', 'relay85']);
  if (keyOn) links.push(['ecuFeed', 'relay86']);
  if (relayClosed) links.push(['ecuFeed', 'relay87']);
  const nodes: ElectricalNode[] = ['batteryPlus', 'ground', 'distribution', 'ecuFeed', 'relay87', 'relay85', 'relay86', 'pumpFeed', 'ignitionFeed', 'obdFeed', 'sensorReference', 'lightingFeed', 'comfortFeed', 'fanFeed', 'instrumentFeed'];
  const potentials = {} as Record<ElectricalNode, number | null>;
  const loads = new Set<ElectricalNode>(['ecuFeed', 'pumpFeed', 'ignitionFeed', 'obdFeed', 'relay86', 'lightingFeed', 'comfortFeed', 'fanFeed', 'instrumentFeed']);
  for (const node of nodes) {
    const connected = new Set<ElectricalNode>([node]);
    const pending: ElectricalNode[] = [node];
    while (pending.length) {
      const current = pending.pop()!;
      for (const [first, second] of links) {
        const neighbor = first === current ? second : second === current ? first : null;
        if (neighbor && !connected.has(neighbor)) { connected.add(neighbor); pending.push(neighbor); }
      }
    }
    potentials[node] = connected.has('batteryPlus') ? volts : connected.has('ground') || [...connected].some(member => loads.has(member)) ? 0 : null;
  }
  potentials.sensorReference = relayClosed ? 5 : 0;
  if (potentialCache.size >= 64) potentialCache.clear();
  const result = Object.freeze(potentials);
  potentialCache.set(cacheKey, result);
  return result;
}

export function measureVoltage(potentials: Readonly<Record<ElectricalNode, number | null>>, red: ElectricalNode | null, black: ElectricalNode | null): number | null {
  if (!red || !black) return null;
  if (red === black) return 0;
  const positive = potentials[red];
  const negative = potentials[black];
  return positive === null || negative === null ? null : positive - negative;
}

export function electricalSupply(keyOn: boolean, pumpRequested: boolean, open: OpenFuses) {
  const openFuses = openFuseList(open);
  const potentials = electricalPotentials(keyOn, openFuses, 12.6);
  const distribution = (potentials.distribution ?? 0) > 0;
  const ecu = (potentials.relay87 ?? 0) > 0;
  const ignition = ecu && !openFuses.includes('ignition');
  const pump = ecu && pumpRequested && !openFuses.includes('pump');
  const diagnostics = (potentials.obdFeed ?? 0) > 0;
  return {
    distribution, ecu, ignition, pump, diagnostics, mainRelay: ecu, sensor5V: ecu ? 5 : 0,
    lighting: (potentials.lightingFeed ?? 0) > 0,
    comfort: (potentials.comfortFeed ?? 0) > 0,
    fan: (potentials.fanFeed ?? 0) > 0,
    instrument: (potentials.instrumentFeed ?? 0) > 0,
  };
}