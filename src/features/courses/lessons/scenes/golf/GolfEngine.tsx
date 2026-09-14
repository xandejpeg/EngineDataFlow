import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GOLF, sampleGolf, type GolfClock, type InjectionMode } from './golfPhysics';
import { GolfCylinder } from './GolfCylinder';
import { GolfThrottleBody } from './GolfEgasParts';
import { Casting, Connector, Ring, Shaft, Tube, Turned } from './GolfPrimitives';
import { INJECTOR_FUEL_PORT, RAIL_SENSOR_MOUNT, HIGH_PUMP_INLET } from './golfMounts';

const AXES = [0, 88, 176, 264];
const INTAKE_PATHS = AXES.map(axis => [[axis, 245, 51], [axis, 284, 93], [axis, 258, 157], [axis, 204, 185], [axis, 194, 142]] as [number, number, number][]);
const BELT: [number, number, number][] = [[-90, 0, -37], [-90, 335, -90], [-90, 390, -45], [-90, 335, 0], [-90, 145, 46], [-90, -34, 0], [-90, 0, -37]];
const CHAIN: [number, number, number][] = [[320, 335, -75], [320, 365, -45], [320, 365, 45], [320, 335, 75], [320, 305, 45], [320, 305, -45], [320, 335, -75]];

function Gear({ radius, teeth, width = 15 }: { radius: number; teeth: number; width?: number }) {
  return <group>
    <Shaft from={[-width / 2, 0, 0]} to={[width / 2, 0, 0]} radius={radius - 3} />
    <Ring radius={radius - 10} tube={4} rotation={[0, Math.PI / 2, 0]} />
    {Array.from({ length: teeth }, (_, index) => {
      const angle = index * Math.PI * 2 / teeth;
      return <mesh key={index} position={[0, radius * Math.cos(angle), radius * Math.sin(angle)]} rotation={[angle, 0, 0]}>
        <boxGeometry args={[width, 6, 5]} /><meshStandardMaterial color="#667276" metalness={0.8} roughness={0.4} />
      </mesh>;
    })}
  </group>;
}

function Cam({ side, clock }: { side: 1 | -1; clock: MutableRefObject<GolfClock> }) {
  const shaft = useRef<THREE.Group>(null);
  const shape = useMemo(() => {
    const result = new THREE.Shape();
    for (let step = 0; step <= 90; step++) {
      const angle = step / 90 * Math.PI * 2;
      const distance = Math.atan2(Math.sin(angle), Math.cos(angle));
      const half = 235 / 4 * Math.PI / 180;
      const lift = Math.abs(distance) < half ? (side === 1 ? 10 : 9.5) * (1 + Math.cos(Math.PI * distance / half)) / 2 : 0;
      const radius = 18 + lift;
      if (step === 0) result.moveTo(0, radius);
      else result.lineTo(radius * Math.sin(angle), radius * Math.cos(angle));
    }
    result.closePath();
    return result;
  }, [side]);
  useFrame(() => {
    if (shaft.current) shaft.current.rotation.x = (clock.current.angle + (side === 1 && clock.current.operation === 'cruise' ? 20 : 0)) * Math.PI / 360;
  });
  return <group position={[0, 335, side * 45]}>
    <group ref={shaft} name={side === 1 ? 'golf-intake-cam' : 'golf-exhaust-cam'}>
      <Shaft from={[-70, 0, 0]} to={[335, 0, 0]} radius={10} />
      {AXES.flatMap((axis, index) => [-17, 17].map(offset => (
        <group key={`${axis}-${offset}`} position={[axis + offset, 0, 0]} rotation={[(180 - (side === 1 ? 472.5 : 252.5) / 2 - GOLF.firingOffsets[index] / 2) * Math.PI / 180, 0, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-5, 0, 0]}>
            <extrudeGeometry args={[shape, { depth: 10, bevelEnabled: true, bevelSize: 0.7, bevelThickness: 0.7, bevelSegments: 1 }]} />
            <meshStandardMaterial color={side === 1 ? '#9bb7b9' : '#b4a396'} roughness={0.32} metalness={0.8} />
          </mesh>
        </group>
      )))}
      <group position={[320, 0, 0]}><Gear radius={29} teeth={24} width={10} /></group>
      {side === -1 && <group position={[-90, 0, 0]}><Gear radius={66} teeth={44} /></group>}
      {side === 1 && <group position={[342, 0, 0]}>{[0, 120, 240].map(angle => <mesh key={angle} rotation={[angle * Math.PI / 180, 0, 0]} position={[0, Math.cos(angle * Math.PI / 180) * 9, Math.sin(angle * Math.PI / 180) * 9]}>
        <sphereGeometry args={[16, 18, 12]} /><meshStandardMaterial color="#8d989d" metalness={0.8} roughness={0.3} />
      </mesh>)}</group>}
    </group>
    {[-44, 44, 132, 220, 308].map(axis => <Ring key={axis} position={[axis, 0, 0]} radius={13} tube={4} rotation={[0, Math.PI / 2, 0]} />)}
  </group>;
}

function Crank({ clock }: { clock: MutableRefObject<GolfClock> }) {
  const rotating = useRef<THREE.Group>(null);
  useFrame(() => { if (rotating.current) rotating.current.rotation.x = clock.current.angle * Math.PI / 180; });
  return <group ref={rotating} name="golf-crankshaft">
    {[-44, 44, 132, 220, 308].map(axis => <Shaft key={axis} from={[axis - 14, 0, 0]} to={[axis + 14, 0, 0]} radius={27} />)}
    {AXES.map((axis, index) => <group key={axis} position={[axis, 0, 0]} rotation={[-GOLF.firingOffsets[index] * Math.PI / 180, 0, 0]}>
      <Shaft from={[-23, 46.4, 0]} to={[23, 46.4, 0]} radius={24} />
      {[-28, 28].map(offset => <group key={offset} position={[offset, 0, 0]}>
        <Casting position={[0, 8, 0]} size={[13, 90, 48]} radius={8} color="#737e83" />
        <mesh position={[0, -28, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[49, 49, 14, 24, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#7c8588" metalness={0.8} roughness={0.45} /></mesh>
      </group>)}
    </group>)}
    <group position={[-90, 0, 0]}><Gear radius={33} teeth={22} /></group>
    <group position={[316, 0, 0]} userData={{ golfPart: 17 }}>
      <Shaft from={[-3, 0, 0]} to={[3, 0, 0]} radius={70} />
      {Array.from({ length: 58 }, (_, tooth) => <mesh key={tooth} position={[0, 74 * Math.cos(tooth * Math.PI / 30), 74 * Math.sin(tooth * Math.PI / 30)]} rotation={[tooth * Math.PI / 30, 0, 0]}><boxGeometry args={[7, 8, 4]} /><meshStandardMaterial color="#434e54" metalness={0.8} /></mesh>)}
    </group>
  </group>;
}

function Intake({ clock, mode }: { clock: MutableRefObject<GolfClock>; mode?: InjectionMode }) {
  const flaps = useRef<(THREE.Mesh | null)[]>([]);
  const pump = useRef<THREE.Group>(null);
  const pressure = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const sample = sampleGolf(clock.current, mode);
    flaps.current.forEach(flap => { if (flap) flap.rotation.x = sample.mode === 'stratified' ? 0.1 : Math.PI / 2; });
    if (pump.current) pump.current.position.y = sample.pumpLift * 8;
    if (pressure.current) pressure.current.color.setHSL(0.12 - sample.railPressure / 110 * 0.1, 0.8, 0.55);
  });
  return <group>
    <Casting position={[132, 190, 148]} size={[360, 88, 92]} radius={22} color="#252d31" />
    {INTAKE_PATHS.map((path, index) => <group key={index}>
      <Tube points={path} radius={22} color="#344044" opacity={0.65} />
      <mesh ref={value => { flaps.current[index] = value; }} position={[index * 88, 258, 89]}><circleGeometry args={[19, 24]} /><meshStandardMaterial color="#4d9a9a" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} /></mesh>
    </group>)}
    <GolfThrottleBody clock={clock} mode={mode} />
    <group position={[132, 207, 198]} userData={{ golfPart: 11 }}><Casting size={[28, 36, 20]} color="#283338" /><group position={[0, 22, 0]}><Connector pins={4} /></group></group>
    <group position={[132, 280, 128]} userData={{ golfPart: 14 }}>
      <Shaft from={[-155, 0, 0]} to={[155, 0, 0]} radius={14} />
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[11, 11, 305, 24]} /><meshStandardMaterial ref={pressure} color="#dab051" /></mesh>
      {AXES.map(axis => <Shaft key={axis} from={[axis - 132, 0, 0]} to={[axis - 132, INJECTOR_FUEL_PORT[1] - 280, INJECTOR_FUEL_PORT[2] - 128]} radius={8} />)}
    </group>
    <group position={RAIL_SENSOR_MOUNT} rotation={[0, 0, Math.PI / 2]} userData={{ golfPart: 13 }} name="golf-rail-pressure-sensor">
      <Turned profile={[[0, 0], [10, 0], [10, 22], [13, 24], [13, 30], [8, 35], [8, 40], [0, 40]]} />
      <group position={[0, 47, 0]}><Connector /></group>
    </group>
    <group position={[342, 375, 45]} userData={{ golfPart: 10 }}>
      <Casting position={[0, 28, 0]} size={[68, 68, 64]} radius={12} opacity={0.45} />
      <group ref={pump}><Turned profile={[[0, -24], [6, -24], [6, 8], [15, 12], [15, 22], [0, 22]]} color="#c0b07e" /></group>
      <group position={[0, 69, 0]}><Turned profile={[[0, 0], [15, 0], [15, 30], [12, 35], [0, 35]]} color="#313a3f" /><Connector pins={2} /></group>
      <Tube points={[[30, 25, 0], [54, 25, 35], [30, -50, 83], [-210, -95, 83]]} radius={4} color="#adb9ba" />
    </group>
    <Shaft from={HIGH_PUMP_INLET} to={[342, 400, 30]} radius={4} />
    <group position={[330, 215, -67]} userData={{ golfPart: 21 }}><Casting size={[50, 35, 42]} color="#343e40" /><group position={[0, 27, 0]}><Connector pins={4} /></group></group>
    <group position={[-45, 335, 50]} userData={{ golfPart: 20 }}><Casting size={[30, 25, 25]} color="#303a3e" /><Connector /></group>
    <group position={[310, -57, 63]} userData={{ golfPart: 17 }}><Casting size={[30, 22, 27]} color="#303a3e" /><Connector /></group>
    {[44, 220].map(axis => <group key={axis} position={[axis, 70, 58]} rotation={[Math.PI / 2, 0, 0]} userData={{ golfPart: 16 }}><Ring radius={12} tube={5} /><Connector pins={2} /></group>)}
  </group>;
}

export function GolfEngine({ clock, cutaway, mode, single = false }: { clock: MutableRefObject<GolfClock>; cutaway: boolean; mode?: InjectionMode; single?: boolean }) {
  return <group name="golf-engine-local">
    {!single && <>
      <Crank clock={clock} />
      <Cam side={1} clock={clock} /><Cam side={-1} clock={clock} />
      <Tube points={BELT} radius={5} color="#262e30" />
      <Tube points={CHAIN} radius={3} color="#687780" />
      <Casting position={[132, -117, cutaway ? -65 : 0]} size={[390, 128, cutaway ? 70 : 210]} radius={18} opacity={cutaway ? 0.3 : 1} />
      <Casting position={[132, 97, -64]} size={[365, 239, 22]} radius={9} opacity={cutaway ? 0.25 : 1} />
      {[-41, 44, 132, 220, 305].map(axis => <Casting key={axis} position={[axis, 82, -67]} size={[13, 206, 25]} radius={3} />)}
      {!cutaway && <Casting position={[132, 367, 0]} size={[365, 56, 126]} radius={14} color="#303a3e" />}
      <Intake clock={clock} mode={mode} />
    </>}
    {(single ? [0] : [0, 1, 2, 3]).map(index => <group key={index} userData={{ golfPart: 15 }}><GolfCylinder index={index} clock={clock} cutaway={cutaway} mode={mode} /></group>)}
  </group>;
}