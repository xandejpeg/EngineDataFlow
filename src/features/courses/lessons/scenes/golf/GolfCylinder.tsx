import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GOLF, sampleGolf, type GolfClock, type InjectionMode } from './golfPhysics';
import { Casting, Connector, Ring, Shaft, Tube, Turned } from './GolfPrimitives';
import { INJECTOR_ORIGIN, INJECTOR_ROTATION, INJECTOR_PLUG } from './golfMounts';

interface Props {
  clock: MutableRefObject<GolfClock>;
  index: number;
  cutaway: boolean;
  mode?: InjectionMode;
}

const SKIRT: [number, number][] = [[32, -24], [38, -23], [40.6, -19], [41, 14], [40.8, 23], [41, 29], [40.8, 32.5]];
const VALVE: [number, number][] = [[0, 0], [13, 0], [15, 1.5], [14.2, 3], [6, 6], [3, 11], [3, 72], [0, 72]];
const INJECTOR: [number, number][] = [[0, 0], [2, 0], [3, 7], [5, 11], [6, 37], [10, 41], [10.5, 69], [8, 72], [8, 88], [0, 88]];
const PLUG: [number, number][] = [[1, 0], [2, 3], [6, 5], [6, 23], [8, 25], [8, 32], [5, 35], [5, 63], [3, 65], [3, 69]];

function Crown() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    const rings = 22;
    const sides = 64;
    for (let ring = 0; ring <= rings; ring++) {
      const radius = 40.8 * ring / rings;
      for (let side = 0; side <= sides; side++) {
        const angle = side * Math.PI * 2 / sides;
        const axis = radius * Math.cos(angle);
        const depth = radius * Math.sin(angle);
        const bowl = 12 * Math.exp(-((axis / 25) ** 4 + ((depth + 8) / 27) ** 4)) * (1 - (radius / 40.8) ** 6);
        positions.push(axis, 32.5 - bowl, depth);
        if (ring < rings && side < sides) {
          const current = ring * (sides + 1) + side;
          indices.push(current, current + 1, current + sides + 1, current + 1, current + sides + 2, current + sides + 1);
        }
      }
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, []);
  return <mesh geometry={geometry}><meshStandardMaterial color="#cad0ce" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>;
}

export function GolfPistonModel() {
  return <group>
    <Turned profile={SKIRT} />
    <Crown />
    {[17, 23, 28].map(height => <Ring key={height} radius={40.9} tube={1} position={[0, height, 0]} color="#343b3e" />)}
    <Shaft from={[-39, 0, 0]} to={[39, 0, 0]} radius={9} />
  </group>;
}

export function GolfPistonCatalogPart() {
  return <group scale={0.032}><GolfPistonModel /></group>;
}

function Rod() {
  const shape = useMemo(() => {
    const profile = new THREE.Shape();
    profile.moveTo(-14, 20); profile.lineTo(-7, 125); profile.quadraticCurveTo(0, 137, 7, 125);
    profile.lineTo(14, 20); profile.closePath();
    return profile;
  }, []);
  return <group>
    <mesh position={[0, 0, -5]}>
      <extrudeGeometry args={[shape, { depth: 10, bevelEnabled: true, bevelSize: 1.2, bevelThickness: 1.2, bevelSegments: 2, steps: 1 }]} />
      <meshStandardMaterial color="#a5adb0" metalness={0.8} roughness={0.35} />
    </mesh>
    <Ring radius={25} tube={5} rotation={[0, 0, 0]} />
    <Ring radius={10} tube={4} position={[0, 144, 0]} rotation={[0, 0, 0]} color="#b9a674" />
    {[-21, 21].map(axis => <Casting key={axis} position={[axis, -12, 0]} size={[9, 20, 14]} radius={1.5} />)}
  </group>;
}

export function GolfCylinder({ clock, index, cutaway, mode }: Props) {
  const piston = useRef<THREE.Group>(null);
  const rod = useRef<THREE.Group>(null);
  const valves = useRef<(THREE.Group | null)[]>([]);
  const cloud = useRef<THREE.Mesh>(null);
  const spray = useRef<THREE.Points>(null);
  const flash = useRef<THREE.Mesh>(null);
  const flap = useRef<THREE.Mesh>(null);
  const tumble = useRef<THREE.Points>(null);
  const coil = useRef<THREE.MeshStandardMaterial>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const sprayData = useMemo(() => new Float32Array(54 * 3), []);
  const tumbleData = useMemo(() => new Float32Array(60 * 3), []);

  useFrame(() => {
    const state = clock.current;
    const sample = sampleGolf(state, mode);
    const injectionMode = sample.mode;
    const cylinder = sample.cylinders[index];
    if (flap.current) flap.current.rotation.x = injectionMode === 'stratified' ? 0.1 : Math.PI / 2;
    if (tumble.current) {
      tumble.current.visible = cutaway && sample.rpm > 0 && !cylinder.combustion;
      const height = Math.max(8, 243 - cylinder.crownY);
      for (let point = 0; point < 60; point++) {
        const rotation = point * Math.PI * 2 / 20 + state.angle * Math.PI / 180 * 0.65;
        const spread = injectionMode === 'stratified' ? 0.8 : 0.55 + (point % 3) * 0.2;
        tumbleData.set([(point % 3 - 1) * 9, cylinder.crownY + height / 2 + Math.sin(rotation) * height * 0.38 * spread, Math.cos(rotation) * 30 * spread], point * 3);
      }
      tumble.current.geometry.attributes.position.needsUpdate = true;
    }
    if (piston.current) piston.current.position.y = cylinder.pinY;
    if (rod.current) {
      rod.current.position.set(0, cylinder.crankY, cylinder.crankZ);
      rod.current.rotation.set(0, Math.PI / 2, 0);
      rod.current.rotateZ(-Math.asin(cylinder.crankZ / GOLF.rod));
    }
    valves.current.forEach((valve, valveIndex) => {
      if (valve) valve.position.y = -(valveIndex < 2 ? cylinder.intake : cylinder.exhaust);
    });
    if (coil.current) {
      coil.current.emissive.set(cylinder.dwell ? '#eab944' : '#f1f8ff');
      coil.current.emissiveIntensity = cylinder.dwell ? 1.2 : cylinder.spark ? 3 : 0;
    }
    if (flash.current) flash.current.visible = cutaway && cylinder.spark;
    if (cloud.current) {
      cloud.current.visible = cutaway && (cylinder.charge || cylinder.combustion);
      const material = cloud.current.material as THREE.MeshStandardMaterial;
      material.color.set(cylinder.combustion ? '#ed693f' : '#e6b743');
      material.emissive.set(cylinder.combustion ? '#e45525' : '#655219');
      const height = Math.max(4, 243 - cylinder.crownY);
      if (injectionMode === 'stratified' && !cylinder.combustion) {
        const progress = Math.min(1, Math.max(0, (cylinder.local - 640) / 60));
        cloud.current.position.set(0, cylinder.crownY + 4 + progress * Math.max(0, 240 - cylinder.crownY - 4), -8 * (1 - progress));
        cloud.current.scale.set(13, 6, 17);
      } else {
        cloud.current.position.set(0, cylinder.crownY + height / 2, 0);
        cloud.current.scale.set(35, height / 2, 35);
      }
    }
    if (spray.current) {
      spray.current.visible = cutaway && cylinder.injecting;
      for (let point = 0; point < 54; point++) {
        const progress = ((point / 54 + cylinder.local / 18) % 1);
        const azimuth = (point % 6) * Math.PI / 3;
        target.set(Math.cos(azimuth) * progress * 10, 240 - progress * 19, 38 - progress * 65);
        sprayData.set([target.x, target.y, target.z], point * 3);
      }
      spray.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return <group position={[index * GOLF.spacing, 0, 0]} name={`golf-cylinder-${index + 1}`}>
    {mode && <group>
      <Tube points={[[0, 245, 45], [0, 278, 90], [0, 278, 160]]} radius={21} color="#669a9d" opacity={0.23} />
      <mesh ref={flap} position={[0, 278, 127]}><circleGeometry args={[19, 28]} /><meshStandardMaterial color="#568e90" metalness={0.7} side={THREE.DoubleSide} /></mesh>
      <points ref={tumble}><bufferGeometry><bufferAttribute attach="attributes-position" args={[tumbleData, 3]} /></bufferGeometry><pointsMaterial color="#189fae" size={1.9} depthWrite={false} /></points>
    </group>}
    <mesh position={[0, 158, 0]} rotation={[0, cutaway ? Math.PI / 2 : 0, 0]}>
      <cylinderGeometry args={[41.25, 41.25, 130, 40, 1, true, 0, cutaway ? Math.PI : 2 * Math.PI]} />
      <meshStandardMaterial color="#7a8990" metalness={0.75} roughness={0.32} side={THREE.DoubleSide} />
    </mesh>
    <group ref={piston} name={`golf-piston-${index + 1}`}>
      <GolfPistonModel />
    </group>
    <group ref={rod} name={`golf-rod-${index + 1}`}><Rod /></group>
    <Casting position={[0, 287, cutaway ? -48 : 0]} size={[85, 89, cutaway ? 28 : 135]} opacity={cutaway ? 0.23 : 1} />
    {[1, -1].flatMap(side => [-17, 17].map(axis => ({ side, axis }))).map(({ side, axis }, valveIndex) => (
      <group key={valveIndex} position={[axis, 246, side * 21]} rotation={[side * 20 * Math.PI / 180, 0, 0]}>
        <group ref={value => { valves.current[valveIndex] = value; }} name={`golf-valve-${index + 1}-${valveIndex}`}>
          <Turned profile={VALVE} color={valveIndex < 2 ? '#8daab0' : '#b6a495'} />
          {[39, 44, 49, 54, 59].map(height => <Ring key={height} position={[0, height, 0]} radius={9} tube={1.1} />)}
          <Casting position={[0, 76, -4]} size={[11, 7, 31]} radius={2} />
        </group>
      </group>
    ))}
    <group position={INJECTOR_ORIGIN} quaternion={INJECTOR_ROTATION} name={`golf-injector-${index + 1}`}>
      <Turned profile={INJECTOR} />
      {[42, 73].map(height => <Ring key={height} position={[0, height, 0]} radius={9} tube={1.1} color="#246454" />)}
      <group position={[0, 62, 13]}><Connector pins={2} width={18} /></group>
    </group>
    <group position={[0, 243, 0]}><Turned profile={PLUG} color="#d9ddce" /></group>
    <group position={[0, 325, 0]} name={`golf-coil-${index + 1}`} userData={{ golfPart: 19 }}>
      <Turned profile={[[0, -28], [8, -28], [10, -15], [11, 45], [15, 50], [15, 71], [0, 73]]} color="#20282b" />
      <Casting position={[0, 65, 0]} size={[35, 26, 35]} radius={5} color="#293237" />
      <mesh position={[0, 79, 0]}><boxGeometry args={[20, 2, 22]} /><meshStandardMaterial ref={coil} color="#3e484c" /></mesh>
      <group position={[0, 64, 27]}><Connector pins={4} width={28} /></group>
    </group>
    {!mode && <>
      <Tube points={[INJECTOR_PLUG, [0, 300, 167], [0, 420, 100], [0, 420, 60]]} radius={3} color="#354346" />
      <Tube points={[[0, 389, 40], [0, 405, 55], [0, 420, 60]]} radius={4} color="#354346" />
    </>}
    <mesh ref={cloud}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial transparent opacity={0.42} depthWrite={false} roughness={1} emissiveIntensity={0.5} /></mesh>
    <mesh ref={flash} name={`golf-spark-${index + 1}`} position={[0, 242, 0]}><sphereGeometry args={[3, 12, 8]} /><meshBasicMaterial color="#fffad5" /></mesh>
    <points ref={spray}><bufferGeometry><bufferAttribute attach="attributes-position" args={[sprayData, 3]} /></bufferGeometry><pointsMaterial color="#ffd35b" size={2.4} depthWrite={false} /></points>
  </group>;
}