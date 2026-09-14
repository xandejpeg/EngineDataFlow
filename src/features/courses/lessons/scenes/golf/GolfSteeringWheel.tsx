import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { COCKPIT, steeringSpokeShape } from './golfCockpitGeometry';
import { Casting, Ring } from './GolfPrimitives';

export function GolfSteeringWheel() {
  const spokes = useMemo(() => [-1, 0, 1].map(side => new THREE.ExtrudeGeometry(steeringSpokeShape(side), { depth: 14, bevelEnabled: true, bevelSegments: 3, bevelSize: 4, bevelThickness: 4 })), []);
  useEffect(() => () => spokes.forEach(geometry => geometry.dispose()), [spokes]);
  return <group name="golf-steering-wheel" position={COCKPIT.steeringPosition} rotation={[COCKPIT.steeringTilt, 0, 0]} userData={{ actuation: 'not-simulated', dimensionalStatus: 'estimated' }}>
    <Ring radius={167} tube={18} rotation={[0, 0, 0]} color="#202528" />
    <Ring radius={167} tube={0.9} position={[0, 0, 17]} rotation={[0, 0, 0]} color="#50595d" />
    {spokes.map((geometry, index) => <mesh key={index} geometry={geometry} position={[0, 0, -8]} dispose={null}><meshStandardMaterial color={index === 1 ? '#7b8488' : '#30373b'} metalness={0.3} roughness={0.65} /></mesh>)}
    <Casting position={[0, 0, 16]} size={[141, 107, 42]} radius={22} color="#292f33" />
    <mesh position={[0, 8, 39]}><circleGeometry args={[22, 40]} /><meshStandardMaterial color="#5c666c" metalness={0.5} roughness={0.35} /></mesh>
    <Ring radius={23} tube={2} position={[0, 8, 40]} rotation={[0, 0, 0]} color="#b9c0c2" />
    {[-1, 1].map(side => <group key={side} position={[side * 143, 43, 0]}><mesh scale={[0.75, 1.2, 1]}><sphereGeometry args={[23, 20, 12]} /><meshStandardMaterial color="#202528" roughness={0.8} /></mesh></group>)}
  </group>;
}