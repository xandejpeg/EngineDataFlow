import { useMemo, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { type GolfClock } from './golfPhysics';
import { Casting } from './GolfPrimitives';
import type { BodyMode } from './golfAssembly';
import { GolfStructure } from './GolfFrontStructure';
import { BODY_ARCH, VEHICLE_WHEELS, createVehicleOutline, createVehicleGlazing } from './golfVehicleGeometry';
import { GolfCabin, GolfExteriorDetails } from './GolfCabin';
import { GolfChassis } from './GolfChassis';
import { GolfBodyShell } from './GolfBodyShell';
import { GolfWheel } from './GolfWheel';
import type { BrakeState } from './golfBrakeHydraulics';

export function GolfVehicle({ mode, clock, wheelsMounted = true, brakes }: { mode: BodyMode; clock: MutableRefObject<GolfClock>; wheelsMounted?: boolean; brakes: MutableRefObject<BrakeState> }) {
  const outline = useMemo(createVehicleOutline, []);
  const glass = useMemo(createVehicleGlazing, []);
  const ghost = mode === 'ghost' || mode === 'assembly';
  return <group name="golf-vehicle" visible={mode !== 'cutaway'}>
    <GolfStructure opacity={ghost ? 0.12 : 1} />
    <GolfCabin />
    <GolfChassis brakes={brakes} clock={clock} />
    {VEHICLE_WHEELS.map(wheel => <GolfWheel key={wheel.id} location={wheel} clock={clock} mounted={wheelsMounted} brakes={brakes} />)}
    <group name="golf-body-panels" visible={mode !== 'assembly'}>
    <GolfExteriorDetails ghost={ghost} />
    <GolfBodyShell ghost={ghost} />
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * BODY_ARCH.sideOffset, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <extrudeGeometry args={[outline, { depth: 18, bevelEnabled: true, bevelSize: 12, bevelThickness: 12, bevelSegments: 3, curveSegments: 24 }]} />
        <meshStandardMaterial color="#a92335" metalness={0.45} roughness={0.27} transparent={ghost} opacity={ghost ? 0.065 : 1} depthWrite={!ghost} />
      </mesh>
      {glass.map((pane, index) => <mesh key={index} position={[side * 860, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <shapeGeometry args={[pane]} /><meshStandardMaterial color="#97bbbf" metalness={0.2} roughness={0.1} transparent opacity={ghost ? 0.04 : 0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>)}
    </group>)}
    <Casting position={[0, 520, -836]} size={[1700, 285, 95]} radius={25} color="#ae2736" opacity={ghost ? 0.07 : 1} />
    <Casting position={[0, 540, 3290]} size={[1700, 260, 75]} radius={20} color="#ae2736" opacity={ghost ? 0.07 : 1} />
    {[-1, 1].map(side => <group key={side}>
      <Casting position={[side * 520, 742, -827]} size={[355, 138, 35]} radius={10} color="#d9e0d5" opacity={ghost ? 0.14 : 1} />
      <Casting position={[side * 585, 948, 3230]} size={[270, 180, 32]} radius={10} color="#8f1d27" opacity={ghost ? 0.14 : 1} />
    </group>)}
    <Casting position={[0, 697, -883]} size={[610, 145, 25]} radius={6} color="#252e32" opacity={ghost ? 0.1 : 1} />
    </group>
  </group>;
}