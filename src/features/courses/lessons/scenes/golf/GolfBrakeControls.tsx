import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Shaft, Tube } from './GolfPrimitives';
import { BRAKE_HYDRAULICS, sampleBrakes, type BrakeState } from './golfBrakeHydraulics';
import { BRAKE_MASTER_LINES, BRAKE_PEDAL_PIVOT, BRAKE_RESERVOIR_LINES, BRAKE_WHEEL_LINES } from './golfBrakeRouting';

export function GolfBrakeControls({ brakes }: { brakes: MutableRefObject<BrakeState> }) {
  const pedal = useRef<THREE.Group>(null);
  const pistons = useRef<THREE.Group>(null);
  const pushrod = useRef<THREE.Mesh>(null);
  const root = useRef<THREE.Group>(null);
  const attachment = useRef(new THREE.Vector3());
  const booster = useRef(new THREE.Vector3(-360, 740, 465));
  const direction = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));
  useFrame(() => {
    const sample = sampleBrakes(brakes.current);
    if (pedal.current) pedal.current.rotation.x = sample.pedalAngle;
    if (pistons.current) pistons.current.position.z = -sample.masterTravelMm;
    if (root.current) Object.assign(root.current.userData, { primaryBar: brakes.current.primaryBar, secondaryBar: brakes.current.secondaryBar, pedal: sample.pedal });
    attachment.current.set(BRAKE_PEDAL_PIVOT[0], BRAKE_PEDAL_PIVOT[1] - 65 * Math.cos(sample.pedalAngle) - 40 * Math.sin(sample.pedalAngle), BRAKE_PEDAL_PIVOT[2] - 65 * Math.sin(sample.pedalAngle) + 40 * Math.cos(sample.pedalAngle));
    direction.current.copy(booster.current).sub(attachment.current);
    if (pushrod.current) {
      pushrod.current.position.copy(attachment.current).add(booster.current).multiplyScalar(0.5);
      pushrod.current.scale.y = direction.current.length();
      pushrod.current.quaternion.setFromUnitVectors(up.current, direction.current.normalize());
    }
  });
  return <group ref={root} name="golf-brake-control" userData={BRAKE_HYDRAULICS}>
    <Shaft from={[-360, 740, 465]} to={[-360, 740, 335]} radius={105} color="#2a383d" />
    <mesh name="golf-brake-master-housing" position={[-360, 740, 262.5]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[25, 25, 145, 24]} /><meshStandardMaterial color="#aec3c3" transparent opacity={0.25} depthWrite={false} />
    </mesh>
    <group ref={pistons} name="golf-brake-master-pistons">
      {[240, 295].map(depth => <group key={depth}><Shaft from={[-360, 740, depth - 7]} to={[-360, 740, depth + 7]} radius={21} color="#aa8235" /><Shaft from={[-360, 740, depth + 8]} to={[-360, 740, depth + 30]} radius={7} /></group>)}
    </group>
    <Tube points={[[-520, 820, 520], [-445, 820, 430], [-360, 780, 400]]} radius={6} color="#28363c" />
    <Casting position={[-570, 550, 380]} size={[100, 85, 85]} radius={7} color="#99a9ab" />
    <Casting position={[-570, 550, 330]} size={[105, 95, 30]} radius={6} color="#273940" />
    {BRAKE_RESERVOIR_LINES.map((points, index) => <Tube key={index} points={points} radius={5} color="#c7cbbc" />)}
    {BRAKE_MASTER_LINES.map((points, index) => <group key={index} name={`golf-brake-master-line-${index}`}><Tube points={points} radius={2.5} color={index ? '#087e83' : '#b88632'} /></group>)}
    {BRAKE_WHEEL_LINES.map(line => <group key={line.id} name={`golf-brake-line-${line.id}`} userData={{ circuit: line.circuit, inlet: line.inlet }}>
      <Tube points={line.rigid} radius={2.5} color={line.circuit === 'primary' ? '#b88632' : '#087e83'} />
      <Tube points={line.hose} radius={4} color="#283940" />
      <Shaft from={line.inlet} to={[line.inlet[0], line.inlet[1] + 9, line.inlet[2]]} radius={6} color="#b8bfb4" />
    </group>)}
    <Casting position={[-370, 700, 635]} size={[155, 15, 105]} radius={3} color="#596c73" />
    <Shaft from={[-440, 695, 630]} to={[-300, 695, 630]} radius={10} />
    <group ref={pedal} name="golf-brake-pedal" position={BRAKE_PEDAL_PIVOT} onClick={event => { event.stopPropagation(); brakes.current = { ...brakes.current, pedal: brakes.current.pedal > 0 ? 0 : 0.7 }; }}>
      <Shaft from={[0, 0, 0]} to={[0, -290, 175]} radius={12} color="#596c73" />
      <Casting position={[0, -290, 182]} size={[115, 75, 20]} radius={5} color="#223137" />
      {[-25, -12, 0, 12, 25].map(rib => <Casting key={rib} position={[0, -290 + rib, 194]} size={[100, 4, 3]} radius={0.8} color="#708084" />)}
    </group>
    <mesh ref={pushrod} name="golf-brake-pushrod"><cylinderGeometry args={[6, 6, 1, 12]} /><meshStandardMaterial color="#aebcbb" metalness={0.7} roughness={0.3} /></mesh>
  </group>;
}