import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Connector, Tube } from './GolfPrimitives';
import { DOOR_IDS, sampleBodyControl, type BodyControlState } from './golfBodyControl';
import type { GolfClock } from './golfPhysics';
import type { BrakeState } from './golfBrakeHydraulics';
import { LOOM_SHEATH_COLOR, wireColor, wireLabel } from './golfLoom';
import { WIRE_RADIUS } from './golfLoomBundles';
import { BODY_LOOM, BODY_WIRES, BODY_WIRING_NODES, bodyPower, bodyWireSample, type BodyWire } from './golfBodyWiring.ts';

type Props = { bodyControl: MutableRefObject<BodyControlState>; clock: MutableRefObject<GolfClock>; brakes: MutableRefObject<BrakeState>; ghost?: boolean };

function WireRoute({ route, bodyControl, clock, brakes, ghost }: Props & { route: BodyWire }) {
  const root = useRef<THREE.Group>(null);
  const segments = useRef<(THREE.Mesh | null)[]>([]);
  const materials = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const direction = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));
  const color = wireColor(route.code);
  useFrame(() => {
    const state = bodyControl.current;
    if (!state.showWiring) return;
    const sample = bodyWireSample(route, state, sampleBodyControl(state, bodyPower(clock.current, brakes.current)));
    materials.current.forEach(material => { if (material) { material.color.set(sample.active ? color : '#4c5257'); material.emissive.set(color); material.emissiveIntensity = sample.active ? ghost ? 1.4 : 0.6 : 0; } });
    if (root.current) Object.assign(root.current.userData, { from: route.from, to: route.to, circuit: route.circuit, code: route.code, colorName: wireLabel(route.code), return: route.return, active: sample.active, voltage: sample.voltage, signal: sample.signal, role: sample.role, points: sample.points, coordinateSpace: 'vehicle-local' });
    segments.current.forEach((segment, index) => {
      if (!segment) return;
      const start = sample.points[index]; const end = sample.points[index + 1];
      segment.position.set((start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2);
      direction.current.set(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
      segment.scale.y = direction.current.length();
      segment.quaternion.setFromUnitVectors(up.current, direction.current.normalize());
    });
  });
  return <group ref={root} name={`golf-body-wire-${route.id}`}>
    {route.points.slice(1).map((_, index) => <mesh key={index} ref={mesh => { segments.current[index] = mesh; }}>
      <cylinderGeometry args={[WIRE_RADIUS, WIRE_RADIUS, 1, 6]} />
      <meshStandardMaterial ref={material => { materials.current[index] = material; }} color="#4c5257" />
    </mesh>)}
  </group>;
}

function WiringNode({ id, bodyControl, clock, brakes }: Props & { id: string }) {
  const root = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const state = bodyControl.current;
    const output = sampleBodyControl(state, bodyPower(clock.current, brakes.current));
    const grounded = id === 'ground' || id === 'battery-minus' || id === 'controller-ground';
    const powered = id === 'battery-plus' ? true : id.includes('lighting') ? output.lighting : id.includes('comfort') || id.startsWith('door-') ? output.comfort : output.voltage > 0;
    const voltage = grounded ? 0 : powered ? 12 : 0;
    if (lamp.current) { lamp.current.emissiveIntensity = voltage ? 1.8 : 0; lamp.current.color.set(voltage ? '#74ef91' : '#353d3c'); }
    if (root.current) Object.assign(root.current.userData, { voltage, powered: voltage > 0, locked: state.locked, windowPower: output.windowPower, representation: 'functional-connector-not-vw-pinout', position: BODY_WIRING_NODES[id] });
  });
  return <group ref={root} name={`golf-body-${id}`} position={BODY_WIRING_NODES[id]}>
    {id.startsWith('door-') ? <Connector pins={4} width={42} /> : <Casting size={[38, 24, 28]} radius={3} color={id.includes('fuse') ? '#b99045' : '#364b52'} />}
    <mesh position={[0, 18, 0]}><sphereGeometry args={[6, 10, 8]} /><meshStandardMaterial ref={lamp} color="#353d3c" emissive="#74ef91" emissiveIntensity={0} /></mesh>
  </group>;
}

export function GolfBodyWiring(props: Props) {
  const root = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!root.current) return;
    root.current.visible = props.bodyControl.current.showWiring;
    const output = sampleBodyControl(props.bodyControl.current, bodyPower(props.clock.current, props.brakes.current));
    Object.assign(root.current.userData, { voltage: output.voltage, lighting: output.lighting, comfort: output.comfort, windowPower: output.windowPower, lampCurrent: output.lampCurrent, windowCurrent: output.windowCurrent });
  });
  return <group ref={root} name="golf-body-wiring" visible={false} userData={{ representation: 'generic-body-electrical-topology', factoryPinout: false, colorStandard: 'convencao-din-vw-por-borne', currentModel: 'boolean-load-estimate-not-circuit-solver' }}>
    <group name="golf-body-loom" userData={{ bundles: BODY_LOOM.length, routing: 'sob-o-assoalho-e-atras-dos-acabamentos', build: 'trechos-compartilhados-agrupados' }}>
      {BODY_LOOM.map(bundle => <group key={bundle.id} name={`golf-loom-${bundle.id}`} userData={{ label: bundle.label, ways: bundle.members.length, members: bundle.members, points: bundle.points }}>
        {bundle.segments.map((segment, index) => <Tube key={index} points={segment.points} radius={segment.radius} color={LOOM_SHEATH_COLOR} opacity={0.62} />)}
      </group>)}
    </group>
    <group name="golf-body-fuse-box"><Casting position={[-560, 790, 455]} size={[120, 45, 110]} color="#353c40" /></group>
    <group name="golf-body-controller" userData={{ role: 'lighting-and-comfort-not-engine-ecu' }}><Casting position={[-550, 700, 730]} size={[130, 50, 95]} color="#354c50" /></group>
    {['battery-plus', 'battery-minus', 'main-fuse', 'lighting-fuse', 'comfort-fuse', 'ground', 'controller-lighting', 'controller-comfort', 'controller-ground', ...DOOR_IDS.map(id => `door-${id}`)].map(id => <WiringNode key={id} id={id} {...props} />)}
    {BODY_WIRES.map(route => <WireRoute key={route.id} route={route} {...props} />)}
  </group>;
}