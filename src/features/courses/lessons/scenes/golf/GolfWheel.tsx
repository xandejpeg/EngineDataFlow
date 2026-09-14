import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Ring, Shaft, Turned } from './GolfPrimitives';
import { BRAKE_REFERENCE, brakeAnnulus, brakeGeometry } from './golfBrakeGeometry';
import { VEHICLE_WHEELS } from './golfVehicleGeometry';
import type { GolfClock } from './golfPhysics';
import { sampleBrakes, type BrakeState } from './golfBrakeHydraulics';
import { BRAKE_CALIPER_ANGLE } from './golfBrakeRouting';
import { GolfRimFace } from './GolfRimFace';
import { createGolfTire } from './golfTireGeometry';

type WheelLocation = typeof VEHICLE_WHEELS[number];

export function GolfWheel({ location, clock, mounted = true, brakes }: { location: WheelLocation; clock: MutableRefObject<GolfClock>; mounted?: boolean; brakes?: MutableRefObject<BrakeState> }) {
  const tire = useMemo(createGolfTire, []);
  useEffect(() => () => tire.dispose(), [tire]);
  const rolling = useRef<THREE.Group>(null);
  const pads = useRef<(THREE.Group | null)[]>([]);
  const piston = useRef<THREE.Group>(null);
  const model = brakeGeometry(location.axle);
  useFrame(() => {
    if (rolling.current) {
      if (brakes?.current.benchActive) rolling.current.rotation.x = location.side * brakes.current.wheelAngle;
      else if (['cruise', 'acceleration', 'regeneration', 'overrun'].includes(clock.current.operation)) rolling.current.rotation.x = location.side * clock.current.angle * Math.PI / 180 / 3.55;
    }
    const sample = brakes ? sampleBrakes(brakes.current).wheels.find(wheel => wheel.id === location.id) : null;
    pads.current.forEach((pad, index) => { if (pad) pad.position.x = (index === 0 ? 1 : -1) * (sample?.padTravelMm ?? 0); });
    if (piston.current) piston.current.position.x = sample?.padTravelMm ?? 0;
  });
  return <group name={`golf-wheel-${location.id}`} position={location.hub} userData={{ ...BRAKE_REFERENCE, axle: location.axle, actuation: brakes ? 'hydraulic-didactic' : BRAKE_REFERENCE.actuation }}>
    <group rotation={[0, location.side < 0 ? Math.PI : 0, 0]}>
      <group ref={rolling} name={`golf-wheel-rotating-${location.id}`}>
        <group name={`golf-wheel-mounted-${location.id}`} visible={mounted}>
          <mesh name={`golf-tire-${location.id}`} geometry={tire} dispose={null}><meshStandardMaterial color="#202223" roughness={0.95} /></mesh>
          <group rotation={[0, 0, -Math.PI / 2]}>
            <Turned profile={[[205, -80], [214, -80], [214, -65], [209, -65], [209, 65], [214, 65], [214, 80], [205, 80], [205, -80]]} color="#a8b7b8" />
          </group>
          {[-80, 80].map(axis => <Ring key={axis} position={[axis, 0, 0]} radius={214} tube={5} rotation={[0, Math.PI / 2, 0]} color="#cbd2d1" />)}
          <GolfRimFace id={location.id} />
          <Shaft from={[82, 192, 22]} to={[103, 192, 22]} radius={4} color="#253d46" />
          {[-109, 109].map(axis => <Ring key={axis} position={[axis, 0, 0]} radius={260} tube={1} rotation={[0, Math.PI / 2, 0]} color="#303334" />)}
        </group>
        <group name={`golf-brake-rotor-${location.id}`} rotation={[0, 0, -Math.PI / 2]} userData={{ ...BRAKE_REFERENCE, ventilated: model.ventilated }}>
          {model.ventilated ? <>
            <Turned profile={brakeAnnulus(76, model.radius, -12, -6)} color="#aebbb8" />
            <Turned profile={brakeAnnulus(76, model.radius, 6, 12)} color="#aebbb8" />
            {Array.from({ length: 32 }, (_, index) => <group key={index} rotation={[0, index * Math.PI / 16, 0]}><Casting position={[116, 0, 0]} size={[77, 12, 3]} radius={0.8} color="#657f87" /></group>)}
          </> : <Turned profile={brakeAnnulus(69, model.radius, -5, 5)} color="#aebbb8" />}
          <Turned profile={[[29, -5], [78, -5], [78, 14], [65, 29], [65, 34], [29, 34], [29, -5]]} color="#758f99" />
          <Turned profile={brakeAnnulus(16, 63, 34, model.hubFace)} color="#92a7ae" />
          <Shaft from={[0, -50, 0]} to={[0, 38, 0]} radius={23} />
          {Array.from({ length: model.boltCount }, (_, index) => <group key={index} rotation={[0, index * Math.PI * 2 / model.boltCount, 0]}>
            <Shaft from={[model.boltCircleRadius, 29, 0]} to={[model.boltCircleRadius, mounted ? 35 : 40, 0]} radius={5} color="#344f59" />
          </group>)}
        </group>
      </group>
      <group name={`golf-brake-fixed-${location.id}`} userData={{ ...BRAKE_REFERENCE, padClearance: 0.7 }}>
        <mesh position={[model.shieldAxis, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[45, model.radius + 7, 48, 1, 0.95, Math.PI * 1.62]} />
          <meshStandardMaterial color="#536d77" metalness={0.65} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <group rotation={[BRAKE_CALIPER_ANGLE, 0, 0]}>
          <Casting position={[-25, model.padRadius, 0]} size={[14, 60, 126]} radius={6} color="#657f89" />
          {[-1, 1].map((side, index) => <group key={side} ref={object => { pads.current[index] = object; }} name={`golf-brake-pad-${location.id}-${index}`}>
            <Casting position={[side * (model.padInner + model.padOuter) / 2, model.padRadius, 0]} size={[model.padOuter - model.padInner, 38, 85]} radius={4} color="#404844" />
            <Casting position={[side * (model.padOuter + 2), model.padRadius, 0]} size={[4, 46, 94]} radius={3} color="#7b9399" />
          </group>)}
          <Casting position={[0, model.padRadius + 30, 0]} size={[model.halfThickness * 2 + 48, 16, 115]} radius={5} color="#8a9da2" />
          <Casting position={[model.halfThickness + 22, model.padRadius + 1, 0]} size={[15, 65, 95]} radius={7} color="#8a9da2" />
          <group ref={piston} name={`golf-brake-piston-${location.id}`}><Shaft from={[-model.halfThickness - 45, model.padRadius, 0]} to={[-model.padOuter - 3, model.padRadius, 0]} radius={25} color="#798d94" /></group>
          <group name={`golf-brake-inlet-${location.id}`} position={[-48, model.padRadius, 0]}><Shaft from={[-3, 0, 0]} to={[7, 0, 0]} radius={6} color="#b8bfb4" /></group>
          {[-51, 51].map(depth => <group key={depth}>
            <Shaft from={[-38, model.padRadius, depth]} to={[model.halfThickness + 30, model.padRadius, depth]} radius={7} />
            <Shaft from={[-25, model.padRadius, depth]} to={[-4, model.padRadius, depth]} radius={11} color="#293e47" />
          </group>)}
          <Shaft from={[-38, model.padRadius + 18, 23]} to={[-48, model.padRadius + 32, 23]} radius={4} color="#a9b7b3" />
          {location.axle === 'rear' && <>
            <Shaft from={[-45, model.padRadius, 0]} to={[-58, model.padRadius, 0]} radius={14} />
            <Casting position={[-61, model.padRadius - 22, 0]} size={[8, 60, 13]} color="#81999f" radius={3} />
          </>}
        </group>
      </group>
    </group>
  </group>;
}