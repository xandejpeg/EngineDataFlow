export const FUSE_CIRCUITS = [
  { id: 'main', label: 'Distribuicao principal', location: 'Cofre', color: '#cc9a57' },
  { id: 'ecu', label: 'ECU / rele principal', location: 'Cofre', color: '#bc514d' },
  { id: 'pump', label: 'Bomba de combustivel', location: 'Cofre', color: '#e0b341' },
  { id: 'ignition', label: 'Bobinas', location: 'Cofre', color: '#4f91b9' },
  { id: 'diagnostics', label: 'Tomada OBD2', location: 'Habitaculo', color: '#bc514d' },
] as const;

export type FuseCircuit = typeof FUSE_CIRCUITS[number]['id'];

export type ElectricalNode = 'batteryPlus' | 'ground' | 'distribution' | 'ecuFeed' | 'relay87' | 'relay85' | 'relay86' | 'pumpFeed' | 'ignitionFeed' | 'obdFeed' | 'sensorReference';

export const FUSE_NODES: Record<FuseCircuit, readonly [ElectricalNode, ElectricalNode]> = {
  main: ['batteryPlus', 'distribution'],
  ecu: ['distribution', 'ecuFeed'],
  pump: ['distribution', 'pumpFeed'],
  ignition: ['relay87', 'ignitionFeed'],
  diagnostics: ['distribution', 'obdFeed'],
};

const potentialCache = new Map<string, Readonly<Record<ElectricalNode, number | null>>>();

export function electricalPotentials(keyOn: boolean, openFuse: FuseCircuit | null, volts: number): Readonly<Record<ElectricalNode, number | null>> {
  const cacheKey = `${keyOn}:${openFuse}:${volts}`;
  const cached = potentialCache.get(cacheKey);
  if (cached) return cached;
  const relayClosed = keyOn && openFuse !== 'main' && openFuse !== 'ecu';
  const links: (readonly [ElectricalNode, ElectricalNode])[] = FUSE_CIRCUITS.filter(circuit => circuit.id !== openFuse).map(circuit => FUSE_NODES[circuit.id]);
  links.push(['ground', 'relay85']);
  if (keyOn) links.push(['ecuFeed', 'relay86']);
  if (relayClosed) links.push(['ecuFeed', 'relay87']);
  const nodes: ElectricalNode[] = ['batteryPlus', 'ground', 'distribution', 'ecuFeed', 'relay87', 'relay85', 'relay86', 'pumpFeed', 'ignitionFeed', 'obdFeed', 'sensorReference'];
  const potentials = {} as Record<ElectricalNode, number | null>;
  const loads = new Set<ElectricalNode>(['ecuFeed', 'pumpFeed', 'ignitionFeed', 'obdFeed', 'relay86']);
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

export function electricalSupply(keyOn: boolean, pumpRequested: boolean, openFuse: FuseCircuit | null) {
  const potentials = electricalPotentials(keyOn, openFuse, 12.6);
  const distribution = (potentials.distribution ?? 0) > 0;
  const ecu = (potentials.relay87 ?? 0) > 0;
  const ignition = ecu && openFuse !== 'ignition';
  const pump = ecu && pumpRequested && openFuse !== 'pump';
  const diagnostics = (potentials.obdFeed ?? 0) > 0;
  return { distribution, ecu, ignition, pump, diagnostics, mainRelay: ecu, sensor5V: ecu ? 5 : 0 };
}