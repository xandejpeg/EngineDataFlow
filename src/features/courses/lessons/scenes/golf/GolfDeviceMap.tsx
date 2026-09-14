import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Position } from './golfAssembly';
import { DeviceBody, type DeviceShape } from './GolfDeviceBodies';
import { Casting, Shaft, Tube } from './GolfPrimitives';
import { WIRE_RADIUS } from './golfLoomBundles';
import { CONNECTOR_DEPTH, DEVICE_KINDS, golfDevices, pinPosition, TERMINAL_ROLES, type DeviceConnector, type DeviceFilter, type DeviceTerminal, type GolfDevice } from './golfDevices';

const COPPER = '#c07a30';
const CRIMP_COLOR = '#8e979c';
const PIN_COLOR = '#c9a227';
const SHELL_COLOR = '#1d2428';
/** Trecho de cobre descascado e luva de crimpagem desenhados na ponta de cada fio. */
const BARE_MM = 20;
const CRIMP_MM = 8;

const toArray = (vector: THREE.Vector3): Position => [vector.x, vector.y, vector.z];

/** Recua as duas pontas da polilinha para abrir espaco ao cobre exposto e a luva. */
function insulated(points: Position[], inset: number): Position[] {
  const out: Position[] = points.map(point => [...point] as Position);
  for (const end of [0, out.length - 1]) {
    const neighbour = end === 0 ? 1 : out.length - 2;
    const tip = new THREE.Vector3(...out[end]);
    const next = new THREE.Vector3(...out[neighbour]);
    const span = tip.distanceTo(next);
    if (span < 1) continue;
    out[end] = toArray(tip.lerp(next, Math.min(inset, span * 0.45) / span));
  }
  return out;
}

function CopperTip({ at, toward, color }: { at: Position; toward: Position; color: string }) {
  const tip = new THREE.Vector3(...at);
  const direction = new THREE.Vector3(...toward).sub(tip);
  const span = direction.length();
  if (span < 1) return null;
  direction.multiplyScalar(1 / span);
  const bare = Math.min(BARE_MM, span * 0.32);
  const copperEnd = tip.clone().addScaledVector(direction, bare);
  const crimpEnd = copperEnd.clone().addScaledVector(direction, Math.min(CRIMP_MM, span * 0.13));
  return <group>
    <Shaft from={at} to={toArray(copperEnd)} radius={WIRE_RADIUS * 0.62} color={COPPER} />
    <Shaft from={toArray(copperEnd)} to={toArray(crimpEnd)} radius={WIRE_RADIUS * 1.45} color={CRIMP_COLOR} />
    <mesh position={at}><sphereGeometry args={[WIRE_RADIUS * 1.5, 12, 10]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} /></mesh>
  </group>;
}

function Wire({ terminal, byRole }: { terminal: DeviceTerminal; byRole: boolean }) {
  const color = byRole ? TERMINAL_ROLES[terminal.role].color : terminal.color;
  const points = insulated(terminal.points, BARE_MM + CRIMP_MM);
  const last = terminal.points.length - 1;
  return <group name={`golf-device-wire-${terminal.id}`} userData={{ pin: terminal.pin, role: terminal.role, code: terminal.code, colorName: terminal.colorName, from: terminal.at, to: terminal.far, lands: terminal.farLabel }}>
    <Tube points={points} radius={WIRE_RADIUS} color={color} />
    <CopperTip at={terminal.far} toward={terminal.points[last - 1]} color={color} />
  </group>;
}

/**
 * Peca e conector no mesmo eixo: o corpo cresce para tras da face e cada via ganha cavidade e
 * terminal metalico numerado. E nesses terminais que a ponta de prova encosta, um de cada vez.
 */
function Plug({ connector, terminals, byRole, numbers, shape, tint, onSelect }: {
  connector: DeviceConnector; terminals: DeviceTerminal[]; byRole: boolean; numbers: boolean;
  shape: DeviceShape; tint: string; onSelect: (event: { stopPropagation: () => void }) => void;
}) {
  const right = new THREE.Vector3(...connector.right);
  const up = new THREE.Vector3(...connector.up);
  const out = new THREE.Vector3(...connector.out);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, out));
  const width = connector.cols * connector.pitch + 8;
  const height = connector.rows * connector.pitch + 8;
  return <group name="golf-device-plug" position={connector.at} quaternion={quaternion} userData={{ ways: terminals.length, rows: connector.rows, cols: connector.cols }}>
    <group onClick={onSelect}>
      <Casting position={[0, 0, CONNECTOR_DEPTH / 2]} size={[width, height, CONNECTOR_DEPTH]} radius={2.5} color={SHELL_COLOR} />
      <Casting position={[0, height / 2 + 1.5, CONNECTOR_DEPTH * 0.45]} size={[width * 0.42, 5, CONNECTOR_DEPTH * 0.5]} radius={1} color="#39444a" />
      <group position={[0, 0, -14]} rotation={[-Math.PI / 2, 0, 0]}><DeviceBody shape={shape} tint={tint} /></group>
    </group>
    {terminals.map((terminal, index) => {
      const pin = new THREE.Vector3(...pinPosition(connector, index, terminals.length)).sub(new THREE.Vector3(...connector.at));
      const local: Position = [pin.dot(right), pin.dot(up), 0];
      const color = byRole ? TERMINAL_ROLES[terminal.role].color : terminal.color;
      // O numero sai para o lado, senao fica em cima do corpo da peca que cresce para tras da face.
      const side = connector.rows > 1 && Math.floor(index / connector.cols) === 0 ? 1 : -1;
      return <group key={terminal.id} position={local}>
        <Casting position={[0, 0, 3]} size={[connector.pitch - 3, connector.pitch - 3, 7]} radius={1} color="#0e1416" />
        <Shaft from={[0, 0, -11]} to={[0, 0, 5]} radius={1.9} color={PIN_COLOR} />
        <mesh position={[0, 0, -11]}><sphereGeometry args={[2.6, 12, 10]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} /></mesh>
        {numbers && <Html position={[0, side * connector.pitch * 1.5, -12]} center zIndexRange={[6, 0]} pointerEvents="none">
          <span className="golf-pin-tag" style={{ borderColor: color }}>{terminal.pin}</span>
        </Html>}
      </group>;
    })}
  </group>;
}

function Device({ device, byRole, dim, labels, selected, select }: {
  device: GolfDevice; byRole: boolean; dim: boolean; labels: boolean; selected: boolean; select: (id: string) => void;
}) {
  const tint = DEVICE_KINDS[device.kind].color;
  // O corpo fica atras do conector, na direcao oposta a saida dos fios, para os terminais ficarem sempre a vista.
  const back = new THREE.Vector3(...device.connector.out).multiplyScalar(-1);
  const click = (event: { stopPropagation: () => void }) => { event.stopPropagation(); select(device.id); };
  if (dim) return <group name={`golf-device-${device.id}`} position={device.at} userData={{ golfPart: device.part, device: device.id, kind: device.kind }} onClick={click}>
    <Casting position={toArray(back.clone().multiplyScalar(38))} size={[20, 14, 16]} radius={2} color={tint} opacity={0.3} />
  </group>;
  return <group name={`golf-device-${device.id}`} userData={{ golfPart: device.part, device: device.id, kind: device.kind, code: device.code, ways: device.terminals.length }}>
    <Plug connector={device.connector} terminals={device.terminals} byRole={byRole} numbers={selected} shape={device.shape} tint={tint} onSelect={click} />
    {device.terminals.map(terminal => <Wire key={terminal.id} terminal={terminal} byRole={byRole} />)}
    {(labels || selected) && <Html position={toArray(back.clone().multiplyScalar(190).add(new THREE.Vector3(...device.at)))} center zIndexRange={[4, 0]} pointerEvents="none">
      <div className="golf-device-tag" data-kind={device.kind} data-selected={selected || undefined}>
        <strong>{device.code}</strong>
        <span>{device.name}</span>
        {selected && <small>{device.job}</small>}
        <em>{device.terminals.map(terminal => TERMINAL_ROLES[terminal.role].sign).join(' ')}</em>
      </div>
    </Html>}
  </group>;
}

export function GolfDeviceMap({ filter, byRole, labels, selected, select }: {
  filter: DeviceFilter; byRole: boolean; labels: boolean; selected: string | null; select: (id: string) => void;
}) {
  const devices = golfDevices().filter(device => filter === 'all' || device.kind === filter);
  return <group name="golf-device-map" userData={{ filter, devices: devices.length, colorMode: byRole ? 'funcao' : 'din', factoryPinout: false }}>
    {devices.map(device => <Device
      key={device.id} device={device} byRole={byRole} select={select} labels={labels}
      selected={selected === device.id}
      dim={Boolean(selected) && selected !== device.id}
    />)}
  </group>;
}
