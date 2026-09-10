import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Connector, Shaft, Tube, Turned } from './GolfPrimitives';
import { sampleGolf, type GolfClock, type InjectionMode } from './golfPhysics';
import { EGAS_MODEL, normalizedPedal, sampleEgas } from './golfEgas';
import { EGAS_ECU_ORIGIN, EGAS_PEDAL_ORIGIN, EGAS_PEDAL_PLUG, EGAS_THROTTLE_ORIGIN, EGAS_WIRES } from './golfEgasGeometry';

export function GolfThrottleBody({ clock, mode }: { clock: MutableRefObject<GolfClock>; mode?: InjectionMode }) {
  const butterfly = useRef<THREE.Group>(null);
  useFrame(() => {
    if (butterfly.current) butterfly.current.rotation.z = sampleGolf(clock.current, mode).throttle * Math.PI / 2;
  });
  return <group name="golf-throttle-body" position={EGAS_THROTTLE_ORIGIN} rotation={[Math.PI / 2, 0, 0]} userData={{ golfPart: 9, ...EGAS_MODEL }}>
    <Turned profile={[[30, -45], [43, -45], [49, -38], [49, 32], [42, 38], [30, 38], [30, -45]]} />
    <group ref={butterfly} name="golf-throttle-butterfly">
      <mesh rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[29, 32]} /><meshStandardMaterial color="#b5a271" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>
      <Shaft from={[0, 0, -32]} to={[0, 0, 32]} radius={3} color="#b9c6c4" />
    </group>
    <Casting position={[63, 0, 0]} size={[56, 65, 48]} color="#273033" radius={8} />
    <group name="golf-egas-throttle-plug" position={[92, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><Connector pins={6} width={30} /></group>
  </group>;
}

export function GolfAcceleratorPedal({ clock }: { clock: MutableRefObject<GolfClock> }) {
  const pedal = useRef<THREE.Group>(null);
  useFrame(() => { if (pedal.current) pedal.current.rotation.x = normalizedPedal(clock.current.egas.pedal) * 0.35; });
  return <group name="golf-accelerator-assembly" userData={EGAS_MODEL}>
    <Casting position={EGAS_PEDAL_ORIGIN} size={[56, 45, 44]} color="#405258" radius={5} />
    <group name="golf-egas-pedal-plug" position={EGAS_PEDAL_PLUG}><Connector pins={6} width={26} /></group>
    <group name="golf-accelerator-pedal" position={EGAS_PEDAL_ORIGIN} ref={pedal} onClick={event => {
      event.stopPropagation();
      const current = clock.current;
      clock.current = { ...current, egas: { ...current.egas, enabled: true, opening: sampleGolf(current).throttle, pedal: current.egas.pedal > 0 ? 0 : 0.7 } };
    }}>
      <Shaft from={[0, 0, 0]} to={[0, -90, 115]} radius={8} color="#596c73" />
      <Casting position={[0, -75, 122]} size={[50, 120, 20]} radius={5} color="#223137" />
      {[-45, -30, -15, 0, 15, 30, 45].map(rib => <Casting key={rib} position={[0, -75 + rib, 134]} size={[42, 4, 3]} radius={0.8} color="#718383" />)}
    </group>
  </group>;
}

export function GolfEgasEcu() {
  return <group name="golf-egas-ecu" position={EGAS_ECU_ORIGIN} userData={{ golfPart: 3 }}>
    <Casting size={[200, 45, 160]} radius={6} />
    {Array.from({ length: 12 }, (_, fin) => <Casting key={fin} position={[(fin - 5.5) * 15, 27, 0]} size={[4, 9, 140]} radius={1} />)}
    <group name="golf-egas-ecu-plug" position={[0, 0, -92]}><Connector width={150} pins={16} /></group>
  </group>;
}

export function GolfEgasHarness({ clock }: { clock: MutableRefObject<GolfClock> }) {
  const indicators = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  useFrame(() => {
    const sample = sampleEgas(clock.current.egas, sampleGolf(clock.current).electrical.ecu);
    indicators.current.forEach((material, index) => {
      if (!material) return;
      const broken = EGAS_WIRES[index].fault !== 'none' && EGAS_WIRES[index].fault === clock.current.egas.fault;
      material.color.set(broken ? '#c62943' : sample.referenceV ? '#159f82' : '#677573');
      material.emissiveIntensity = sample.referenceV && !broken ? 0.3 : 0;
    });
  });
  return <group name="golf-egas-harness" userData={{ ...EGAS_MODEL, pinout: 'not-specified' }}>
    {EGAS_WIRES.map((wire, index) => <group key={wire.id} name={`golf-egas-wire-${wire.id}`} userData={{ from: wire.points[0], to: wire.points.at(-1), circuit: wire.id }}>
      <Tube points={wire.points} radius={1.6} color={wire.color} />
      <mesh position={wire.points[1]}><sphereGeometry args={[4, 8, 6]} /><meshStandardMaterial ref={material => { indicators.current[index] = material; }} emissive="#159f82" color="#677573" /></mesh>
    </group>)}
  </group>;
}