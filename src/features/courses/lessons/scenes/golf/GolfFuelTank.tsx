import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Connector, Shaft, Tube, Turned } from './GolfPrimitives';
import { fuelSenderSupply, sampleGolf, type GolfClock } from './golfPhysics';
import { sampleFuelSender, fuelFraction } from './golfFuelSender';
import { FUEL_GEOMETRY, FUEL_SENDER_ROUTES, fuelFloatPose } from './golfFuelGeometry';

export function GolfFuelTank({ clock, sensorOnly = false }: { clock: MutableRefObject<GolfClock>; sensorOnly?: boolean }) {
  const level = useRef<THREE.Group>(null);
  const rotor = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);
  useFrame(() => {
    const state = clock.current;
    const sample = sampleFuelSender(state.fuelSender, state.fuel, fuelSenderSupply(state));
    if (level.current) level.current.scale.y = fuelFraction(state.fuel);
    if (rotor.current && sampleGolf(state).pumpLow) rotor.current.rotation.y = state.elapsed * 40;
    if (arm.current) arm.current.rotation.z = fuelFloatPose(sample.floatLevel).angle;
  });
  return <group name="golf-fuel-tank" userData={{ dimensionalStatus: 'estimated', application: 'existing-generic-tank-not-vw-volume-map' }}>
    <group visible={!sensorOnly}>
    {[-230, 230].map(axis => <Casting key={axis} position={[axis, 460, 2225]} size={[335, 315, 550]} radius={28} color="#374348" opacity={0.2} />)}
    <Casting position={[0, 590, 2225]} size={[800, 58, 550]} radius={15} color="#374348" opacity={0.2} />
    <group ref={level} name="golf-fuel-liquid" position={[0, FUEL_GEOMETRY.bottom, 0]}>{[-230, 230].map(axis => <mesh key={axis} position={[axis, 130, 2225]}><boxGeometry args={[300, 260, 500]} /><meshStandardMaterial color="#c8ae52" transparent opacity={0.3} depthWrite={false} /></mesh>)}</group>
    <group name="golf-fuel-filler-neck" userData={{ dimensionalStatus: 'estimated', role: 'abastecimento-do-tanque' }}>
      <Tube points={[[770, 955, 2845], [700, 900, 2760], [520, 760, 2560], [300, 640, 2360], [230, 610, 2290]]} radius={22} color="#4a5458" />
      <group position={[780, 955, 2850]} rotation={[0, 0, Math.PI / 2]}><Turned profile={[[0, 0], [30, 0], [30, 26], [22, 34], [0, 34]]} color="#2f3a3d" /></group>
      <Tube points={[[740, 930, 2820], [690, 985, 2700], [430, 900, 2440], [250, 640, 2280]]} radius={7} color="#5a6468" />
    </group>
    <group name="golf-fuel-pump-module" position={FUEL_GEOMETRY.module} userData={{ golfPart: 18 }}>
      <Turned profile={[[55, -110], [64, -108], [65, 90], [79, 94], [79, 102], [52, 102]]} color="#c6c8b5" opacity={0.45} />
      <group ref={rotor} name="golf-fuel-pump-rotor"><Shaft from={[0, -55, 0]} to={[0, 55, 0]} radius={19} /><Casting position={[0, -30, 18]} size={[34, 15, 8]} color="#bf9569" /></group>
    </group>
    </group>
    <group name="golf-fuel-sender" position={FUEL_GEOMETRY.pivot}>
      <Shaft from={[0, 0, -8]} to={[75, 0, -8]} radius={5} color="#a2a78f" />
      <Casting position={[4, 0, 12]} size={[48, 55, 10]} radius={4} color="#d2c5a2" />
      {Array.from({ length: 11 }, (_, index) => <group name={`golf-fuel-resistor-track-${index}`} key={index} rotation={[0, 0, -0.95 + index * 0.19]}><Casting position={[20, 0, 18]} size={[8, 2, 2]} radius={0.5} color="#796140" /></group>)}
      <Shaft from={[0, 0, -8]} to={[0, 0, 23]} radius={5} />
      <group ref={arm} name="golf-fuel-float-arm">
        <Shaft from={[0, 0, 0]} to={[160, 0, 0]} radius={2} />
        <Casting position={[12, 0, 20]} size={[24, 3, 2]} radius={0.5} color="#d8a651" />
        <group name="golf-fuel-float" position={[160, 0, 0]}><mesh scale={[1.4, 0.75, 1]}><sphereGeometry args={[18, 16, 12]} /><meshStandardMaterial color="#303a3b" roughness={0.7} /></mesh></group>
      </group>
    </group>
    <group name="golf-fuel-sender-plug" position={FUEL_GEOMETRY.senderPlug}><Connector pins={2} /></group>
  </group>;
}

export function GolfFuelSenderHarness({ clock }: { clock: MutableRefObject<GolfClock> }) {
  const indicators = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  useFrame(() => {
    const state = clock.current;
    const sample = sampleFuelSender(state.fuelSender, state.fuel, fuelSenderSupply(state));
    FUEL_SENDER_ROUTES.forEach((route, index) => {
      const failed = route.id === 'signal' && ['signal-open', 'short-ground'].includes(state.fuelSender.fault) || route.id === 'return' && state.fuelSender.fault === 'ground-open';
      indicators.current[index]?.color.set(failed ? '#c73a45' : sample.supply ? '#e8bc43' : '#52666b');
    });
  });
  return <group name="golf-fuel-sender-harness">{FUEL_SENDER_ROUTES.map((route, index) => <group key={route.id} name={`golf-fuel-sender-wire-${route.id}`} userData={{ from: route.points[0], to: route.points[route.points.length - 1], representation: 'functional-route-not-vw-pinout' }}>
    <Tube points={route.points} radius={2} color={route.color} />
    <mesh position={route.points[1]}><sphereGeometry args={[6, 10, 8]} /><meshBasicMaterial ref={material => { indicators.current[index] = material; }} /></mesh>
  </group>)}</group>;
}