import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Casting, Connector, Shaft, Tube } from './GolfPrimitives';
import { FUSE_CIRCUITS, type FuseCircuit } from './golfElectrical';
import { circuitOpen, sampleGolf, type GolfClock } from './golfPhysics';
import { FUSE_BOX_POSITIONS, type Position } from './golfAssembly';
import { ECU_PORTS, bayRoute, RADIATOR_FAN_PLUG } from './golfSensorHarness';
import { orthoLine } from './golfOrthoRoute';
import { carrierToWorld, fuseMount, RELAY_TESTS, testPoint } from './golfService';

const PUMP_RELAY_PINS: Record<'in' | 'out' | 'coilGround' | 'coilCommand', Position> = { in: [63, 51, 21], out: [81, 51, 21], coilGround: [63, 51, 39], coilCommand: [81, 51, 39] };
const GAUGE_PLUG: Position = [-390, 915, 875];
const TANK_MODULE_PLUG: Position = [-150, 620, 2150];

function BladeFuse({ circuit, clock }: { circuit: typeof FUSE_CIRCUITS[number]; clock: MutableRefObject<GolfClock> }) {
  const bridge = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const open = circuitOpen(clock.current, circuit.id);
    if (bridge.current) bridge.current.visible = !open;
    if (material.current) material.current.color.set(open ? '#4a4745' : circuit.color);
  });
  return <group name={`golf-fuse-${circuit.id}`}>
    <Casting size={[23, 7, 11]} color="#252e32" radius={2} />
    {[-6, 6].map(axis => <Casting key={axis} position={[axis, 8, 0]} size={[4, 19, 1.5]} color="#c5b38b" radius={0.5} />)}
    <RoundedBox position={[0, 20, 0]} args={[20, 16, 8]} radius={1.5} smoothness={2}><meshStandardMaterial ref={material} color={circuit.color} transparent opacity={0.65} roughness={0.3} /></RoundedBox>
    <group ref={bridge} position={[0, 22, 0]}><Tube points={[[-6, -5, 0], [-6, 0, 0], [0, 3, 0], [6, 0, 0], [6, -5, 0]]} radius={0.7} color="#d4c6a2" /></group>
    {[-6, 6].map(axis => <Shaft key={axis} from={[axis, 17, 0]} to={[axis, 29, 0]} radius={1.8} color="#c4bd9f" />)}
  </group>;
}

function Relay({ clock, circuit }: { clock: MutableRefObject<GolfClock>; circuit: 'main' | 'pump' }) {
  const contact = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!contact.current) return;
    const { electrical } = sampleGolf(clock.current);
    contact.current.rotation.z = (circuit === 'main' ? electrical.mainRelay : electrical.pump) ? 0 : -0.28;
  });
  return <group name={`golf-${circuit}-relay`}>
    <Casting size={[32, 36, 32]} radius={3} color={circuit === 'main' ? '#515963' : '#4c5b53'} opacity={0.25} />
    <Shaft from={[0, -10, 0]} to={[0, 8, 0]} radius={8} color="#b0764b" />
    <group ref={contact} position={[-10, 13, 0]}><Casting position={[10, 0, 0]} size={[22, 2, 8]} color="#c8b997" radius={0.5} /></group>
    <Casting position={[11, 9, 0]} size={[4, 4, 8]} color="#c8b997" radius={0.5} />
    {[-9, 9].flatMap(axis => [-9, 9].map(depth => <Casting key={`${axis}-${depth}`} position={[axis, -23, depth]} size={[4, 10, 1.5]} radius={0.5} color="#c6b792" />))}
  </group>;
}

function FuseCarrier({ clock, cabin, open }: { clock: MutableRefObject<GolfClock>; cabin: boolean; open: boolean }) {
  const width = cabin ? 120 : 180;
  const depth = cabin ? 100 : 140;
  const ids: FuseCircuit[] = cabin ? ['diagnostics', 'instrument'] : ['main', 'ecu', 'pump', 'ignition', 'lighting', 'comfort', 'fan'];
  return <group position={cabin ? FUSE_BOX_POSITIONS.cabin : FUSE_BOX_POSITIONS.engine} rotation={cabin ? [0, 0, Math.PI / 2] : [0, 0, 0]} userData={{ golfPart: 28 }} name={cabin ? 'golf-fusebox-cabin' : 'golf-fusebox-engine'}>
    <Casting position={[0, -18, 0]} size={[width + 30, 8, depth + 25]} radius={3} color="#849491" />
    {[-1, 1].map(side => <group key={side}>
      <Casting position={[side * (width / 2 - 12), -7, 0]} size={[12, 14, 40]} radius={2} color="#273237" />
      <Shaft from={[side * (width / 2 + 8), -20, 0]} to={[side * (width / 2 + 8), -10, 0]} radius={3} />
    </group>)}
    <Casting size={[width, 10, depth]} radius={4} color="#293437" />
    {[-1, 1].map(side => <group key={side}>
      <Casting position={[side * (width / 2 - 3), open ? 16 : 25, 0]} size={[6, open ? 32 : 50, depth]} radius={2} color="#303a3d" />
      <Casting position={[0, open ? 16 : 25, side * (depth / 2 - 3)]} size={[width, open ? 32 : 50, 6]} radius={2} color="#303a3d" />
      <Casting position={[side * (width / 2 + 4), 27, 0]} size={[8, 20, 28]} radius={2} color="#4b575b" />
    </group>)}
    <group position={[0, 53, depth / 2]} rotation={[open ? -2 : 0, 0, 0]}>
      <Casting position={[0, 0, -depth / 2]} size={[width + 6, 8, depth + 6]} radius={3} color="#354247" />
      {[-30, 0, 30].map(axis => <Casting key={axis} position={[axis, 5, -depth / 2]} size={[3, 3, depth - 22]} radius={0.8} color="#4a565a" />)}
    </group>
    <Casting position={[0, 8, -depth / 4]} size={[width - 22, 3, 8]} radius={1} color="#b47f4c" />
    {ids.map(id => <group key={id} position={fuseMount(id).position}>
      <BladeFuse circuit={FUSE_CIRCUITS.find(circuit => circuit.id === id)!} clock={clock} />
    </group>)}
    {!cabin && <group position={[38, 28, 30]}><Relay clock={clock} circuit="main" /></group>}
    {!cabin && <group position={[72, 28, 30]}><Relay clock={clock} circuit="pump" /></group>}
    {!cabin && RELAY_TESTS.map(point => <group key={point.id} position={point.local}>
      <Shaft from={[0, -46, 0]} to={[0, 0, 0]} radius={1.8} color="#c4bd9f" />
    </group>)}
    {!cabin && Object.entries(PUMP_RELAY_PINS).map(([id, pin]) => <group key={id} position={pin}>
      <Shaft from={[0, -46, 0]} to={[0, 0, 0]} radius={1.8} color="#c4bd9f" />
    </group>)}
    <group position={[-width / 4, -10, depth / 3]}><Connector pins={cabin ? 6 : 12} width={cabin ? 44 : 70} /></group>
  </group>;
}

export function GolfFuseBoxes({ clock, open }: { clock: MutableRefObject<GolfClock>; open: boolean }) {
  const terminal = (id: string) => testPoint(id)!.position;
  const underside = (id: string): Position => {
    const point = terminal(id);
    return testPoint(id)!.area === 'cabin' ? [point[0] + 46, point[1], point[2]] : [point[0], 769, point[2]];
  };
  const pumpPin = (id: keyof typeof PUMP_RELAY_PINS): Position => {
    const point = carrierToWorld('engine', PUMP_RELAY_PINS[id]);
    return [point[0], 769, point[2]];
  };
  return <group name="golf-fuse-distribution">
    <FuseCarrier clock={clock} cabin={false} open={open} />
    <FuseCarrier clock={clock} cabin open={open} />
    <Shaft from={[-650, 774, 350]} to={terminal('bodyGround')} radius={5} />
    <Tube points={[terminal('batteryPlus'), [-590, 865, 315], [-695, 770, 340], underside('main-in')]} radius={4} color="#a3453d" />
    <Tube points={[terminal('batteryMinus'), [-410, 855, 310], [-640, 760, 325], terminal('bodyGround')]} radius={4} color="#293337" />
    {['main', 'ecu', 'pump', 'ignition', 'diagnostics', 'lighting', 'comfort', 'fan', 'instrument'].flatMap(circuit => [`${circuit}-in`, `${circuit}-out`]).concat(['relay30', 'relay87', 'relay85', 'relay86']).map(id => <Shaft key={id} from={underside(id)} to={terminal(id)} radius={0.9} color="#aa9871" />)}
    {['ecu-in', 'pump-in', 'lighting-in', 'comfort-in', 'fan-in'].map(id => <Tube key={id} points={[underside('main-out'), [terminal(id)[0], 759, 380], underside(id)]} radius={2} color="#a3453d" />)}
    <Tube points={[underside('ecu-out'), [-595, 750, 438], underside('relay30')]} radius={2} color="#a3453d" />
    <Tube points={[underside('relay87'), [-540, 750, 430], underside('ignition-in')]} radius={2} color="#a3453d" />
    <Tube points={[underside('relay85'), [-650, 755, 445], terminal('bodyGround')]} radius={1.5} color="#293337" />
    <Tube points={[underside('relay86'), [-525, 760, 490], [-350, 930, 371]]} radius={1.5} color="#795d41" />
    <Tube points={[underside('relay87'), [-480, 760, 490], [-330, 930, 371]]} radius={2} color="#a3453d" />
    <Tube points={bayRoute({ from: underside('ignition-out'), fromPort: 'shelf-fuse', toPort: 'head-cyl-0', to: [300, 790, 8], inOrder: 'xyz', outOrder: 'zyx' })} radius={3} color="#a3453d" />
    <Tube points={[underside('main-out'), [-660, 740, 620], underside('diagnostics-in')]} radius={3} color="#a3453d" />
    <Tube points={[underside('main-out'), [-678, 744, 660], underside('instrument-in')]} radius={2.5} color="#a3453d" />
    <Tube points={[underside('pump-out'), [-556, 748, 440], pumpPin('in')]} radius={2.5} color="#a3453d" />
    <Tube points={[pumpPin('out'), ...orthoLine([pumpPin('out')[0], 280, pumpPin('out')[2]], [-352, 270, 1800], 'zyx'), TANK_MODULE_PLUG]} radius={3} color="#a3453d" />
    <Tube points={[pumpPin('coilGround'), [-644, 752, 494], terminal('bodyGround')]} radius={1.5} color="#293337" />
    <Tube points={bayRoute({ from: pumpPin('coilCommand'), fromPort: 'shelf-fuse', toPort: 'plug-actuator', to: ECU_PORTS.actuator, inOrder: 'xyz' })} radius={1.5} color="#795d41" />
    <Tube points={bayRoute({ from: underside('fan-out'), fromPort: 'shelf-fuse', toPort: 'fan-plug', to: RADIATOR_FAN_PLUG, inOrder: 'xyz', outOrder: 'xzy' })} radius={2.5} color="#a3453d" />
    <Tube points={[underside('instrument-out'), [-600, 862, 892], [-430, 902, 882], GAUGE_PLUG]} radius={2} color="#a3453d" />
    <Tube points={[underside('diagnostics-out'), [-620, 630, 890], [-402.5, 614, 923.5]]} radius={2} color="#a3453d" />
  </group>;
}