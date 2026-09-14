import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AIR_PATH, CAN_PATH, EXHAUST_PATH, FUEL_PATH, type Position } from './golfAssembly';
import { engineToWorld, sampleGolf, type GolfClock } from './golfPhysics';
import { Casting, Connector, Ring, Shaft, Tube, Turned } from './GolfPrimitives';
import { GolfFuseBoxes } from './GolfFuseBoxes';
import { GolfTransmission } from './GolfTransmission';
import { GolfAuxiliaries } from './GolfAuxiliaries';
import { GolfEgasEcu, GolfEgasHarness } from './GolfEgasParts';
import { GolfSensorHarness } from './GolfHarness';
import { GolfFuelSenderHarness, GolfFuelTank } from './GolfFuelTank';
import { allSystems, type SystemFlags } from './golfSystemToggles';
import { GOLF_TIME } from './golfTimeline';

interface Props { clock: MutableRefObject<GolfClock>; cutaway: boolean; scanner: boolean; fault: boolean; inspectFuses?: boolean; show?: SystemFlags }

function Flow({ clock, path, color, kind }: { clock: MutableRefObject<GolfClock>; path: Position[]; color: string; kind: 'fuel' | 'air' | 'exhaust' | 'can' }) {
  const points = useRef<THREE.Points>(null);
  const phase = useRef(0);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path.map(point => new THREE.Vector3(...point))), [path]);
  const coordinates = useMemo(() => new Float32Array(32 * 3), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const state = clock.current;
    const sample = sampleGolf(state);
    if (!points.current) return;
    points.current.visible = kind === 'fuel' ? sample.pumpLow : kind === 'can' ? sample.powered : sample.rpm > 0;
    // Na mangueira de combustivel a velocidade das particulas segue a vazao calculada pela ECU.
    phase.current += kind === 'fuel' ? GOLF_TIME.delta * Math.max(0.03, sample.consumption.litresPerHour / 20) : 0;
    const drift = kind === 'fuel' ? phase.current : state.angle / 7200 + state.elapsed * (kind === 'can' ? 1.4 : 0.14);
    for (let index = 0; index < 32; index++) {
      const progress = (index / 32 + drift) % 1;
      curve.getPoint(progress, position);
      coordinates.set([position.x, position.y, position.z], index * 3);
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[coordinates, 3]} /></bufferGeometry><pointsMaterial color={color} size={9} sizeAttenuation depthWrite={false} /></points>;
}

function Probe({ position, id, long = false }: { position: Position; id: number; long?: boolean }) {
  return <group position={position} userData={{ golfPart: id }}>
    <Turned profile={[[0, -25], [long ? 3 : 6, -25], [long ? 3 : 6, 6], [11, 9], [11, 18], [6, 22], [6, 42], [0, 43]]} color="#a7afad" />
    <group position={[0, 50, 0]}><Connector pins={id === 24 ? 2 : 4} width={22} /></group>
  </group>;
}

function Catalyst({ position, radius, length, id, cutaway, clock }: {
  position: Position; radius: number; length: number; id: number; cutaway: boolean; clock: MutableRefObject<GolfClock>;
}) {
  const fill = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (fill.current && id === 25) {
      fill.current.scale.y = Math.max(0.01, clock.current.nox);
      fill.current.position.y = -length * (1 - clock.current.nox) / 2;
    }
    if (material.current) material.current.emissiveIntensity = Math.max(0, (clock.current.catalystTemperature - 300) / 400);
  });
  return <group position={position} rotation={[Math.PI / 2, 0, 0]} userData={{ golfPart: id }}>
    <Turned profile={[[27, -length / 2 - 65], [31, -length / 2 - 65], [radius, -length / 2], [radius, length / 2], [31, length / 2 + 65], [27, length / 2 + 65]]} opacity={cutaway ? 0.25 : 1} />
    <mesh ref={fill}><cylinderGeometry args={[radius - 7, radius - 7, length, 28]} /><meshStandardMaterial ref={material} color={id === 25 ? '#b9c372' : '#bab49d'} emissive="#bc552e" transparent opacity={cutaway ? 0.78 : 1} /></mesh>
    {Array.from({ length: 12 }, (_, index) => <Shaft key={index} from={[(radius - 16) * Math.cos(index * Math.PI / 6), -length / 2, (radius - 16) * Math.sin(index * Math.PI / 6)]} to={[(radius - 16) * Math.cos(index * Math.PI / 6), length / 2, (radius - 16) * Math.sin(index * Math.PI / 6)]} radius={2} color="#656e59" />)}
    {[-length / 2, length / 2].map(height => <Ring key={height} radius={radius} position={[0, height, 0]} tube={3} />)}
  </group>;
}

function FuelSystem({ clock }: Pick<Props, 'clock'>) {
  const purge = useRef<THREE.MeshStandardMaterial>(null);
  const vapor = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const sample = sampleGolf(clock.current);
    if (purge.current) purge.current.emissiveIntensity = sample.purge ? 1.2 : 0;
    if (vapor.current) vapor.current.scale.setScalar(sample.purge ? 0.45 + 0.15 * Math.sin(clock.current.elapsed * 5) : 0.75);
  });
  return <group name="golf-fuel-system">
    <GolfFuelTank clock={clock} />
    <GolfFuelSenderHarness clock={clock} />
    <Tube points={FUEL_PATH} radius={4} color="#c2a94e" />
    <Flow clock={clock} path={FUEL_PATH} color="#ffe16f" kind="fuel" />
    <group position={[350, 400, 2600]} userData={{ golfPart: 1 }}>
      <Casting size={[270, 150, 170]} radius={18} color="#273033" opacity={0.5} />
      <mesh ref={vapor}><sphereGeometry args={[80, 16, 12]} /><meshStandardMaterial color="#b5b59d" transparent opacity={0.28} depthWrite={false} /></mesh>
      <Tube points={[[0, 60, 0], [-50, 150, -100], [-350, 220, -450]]} radius={4} color="#373f41" />
    </group>
    <Tube points={[[350, 430, 2600], [400, 250, 1900], [400, 250, 300], [-20, 792, -230]]} radius={4} color="#343c3e" />
    <Tube points={[[-20, 708, -230], [-45, 665, -240], engineToWorld([0, 190, 194])]} radius={4} color="#343c3e" />
    <group position={[-20, 750, -230]} userData={{ golfPart: 8 }}>
      <Turned profile={[[3, -42], [4, -42], [4, -28], [13, -25], [14, 25], [4, 28], [4, 42], [3, 42]]} color="#343e42" />
      <mesh><cylinderGeometry args={[10, 10, 40, 16]} /><meshStandardMaterial ref={purge} color="#4b595b" emissive="#c1aa62" /></mesh>
      <Connector pins={2} />
    </group>
  </group>;
}

function Electrical({ clock, scanner, fault }: Omit<Props, 'cutaway'>) {
  const lamp = useRef<THREE.MeshStandardMaterial>(null);
  const obd = useRef<THREE.MeshStandardMaterial>(null);
  const immo = useRef<THREE.MeshStandardMaterial>(null);
  const battery = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const sample = sampleGolf(clock.current);
    if (lamp.current) lamp.current.emissiveIntensity = sample.powered && (fault || clock.current.operation === 'key') ? 2 : 0;
    if (obd.current) obd.current.emissiveIntensity = sample.electrical.diagnostics && sample.electrical.ecu && scanner ? 0.7 + 0.6 * Math.sin(clock.current.elapsed * 10) : 0;
    if (immo.current) immo.current.emissiveIntensity = clock.current.operation === 'key' && clock.current.elapsed < 1 ? 1.4 : 0;
    if (battery.current) battery.current.color.set(sample.volts < 11 ? '#c67651' : sample.volts > 13 ? '#6ba480' : '#b4b697');
  });
  return <group name="golf-electrical">
    <group position={[-450, 780, 260]} userData={{ golfPart: 27 }}>
      <Casting size={[242, 190, 175]} radius={8} color="#313b3f" opacity={0.3} />
      {Array.from({ length: 6 }, (_, cell) => <group key={cell} position={[(cell - 2.5) * 36, 0, 0]}>
        <mesh><boxGeometry args={[30, 145, 142]} /><meshStandardMaterial ref={cell === 0 ? battery : undefined} color="#b4b697" transparent opacity={0.5} /></mesh>
        {[-40, 0, 40].map(depth => <Casting key={depth} position={[0, -5, depth]} size={[26, 130, 4]} radius={1} color="#848d8a" />)}
      </group>)}
      <Casting position={[0, 98, 0]} size={[242, 15, 175]} radius={4} color="#323b3d" />
      <group position={[-85, 112, 50]}><Turned profile={[[0, 0], [9.5, 0], [8.5, 20], [0, 20]]} color="#b08965" /></group>
      <group position={[85, 112, 50]}><Turned profile={[[0, 0], [8.5, 0], [7.5, 20], [0, 20]]} color="#6c787c" /></group>
    </group>
    <GolfEgasEcu />
    <GolfEgasHarness clock={clock} />
    <group position={[-420, 620, 900]} userData={{ golfPart: 4 }}>
      <Casting size={[55, 28, 40]} color="#3c3345" radius={4} />
      {Array.from({ length: 16 }, (_, pin) => <mesh key={pin} position={[(pin % 8 - 3.5) * 5, pin < 8 ? 6 : -6, 22]}><boxGeometry args={[2.5, 3, 3]} /><meshStandardMaterial color="#b6a073" /></mesh>)}
      <mesh position={[0, 18, 0]}><sphereGeometry args={[4, 10, 6]} /><meshStandardMaterial ref={obd} color="#769eae" emissive="#49b8d8" /></mesh>
    </group>
    <group position={[-350, 900, 820]} userData={{ golfPart: 5 }}>
      <Casting size={[230, 120, 40]} color="#2a3338" radius={14} />
      <mesh position={[0, 0, 23]}><boxGeometry args={[22, 16, 2]} /><meshStandardMaterial ref={lamp} color="#b57d27" emissive="#ffa922" /></mesh>
      {[-65, 65].map(axis => <Ring key={axis} radius={39} position={[axis, 0, 23]} rotation={[0, 0, 0]} color="#c0d1cc" />)}
    </group>
    <group position={[-350, 720, 780]} userData={{ golfPart: 6 }}>
      <mesh><torusGeometry args={[23, 7, 10, 24]} /><meshStandardMaterial ref={immo} color="#504f3f" emissive="#d0a543" /></mesh>
    </group>
    <group userData={{ golfPart: 7 }}>
      <Tube points={CAN_PATH} radius={2} color="#d88b36" />
      <Tube points={CAN_PATH.map(([axis, height, depth]) => [axis + 3, height + 3, depth])} radius={2} color="#ac6a3b" />
      <Tube points={[CAN_PATH[1], [-320, 360, 600], [-80, 320, 1150]]} radius={3} color="#c97f39" />
      <Flow clock={clock} path={CAN_PATH} color="#efa762" kind="can" />
      <Casting position={[-400, 700, 870]} size={[80, 45, 85]} color="#3b474c" />
    </group>
    <Tube points={[[-535, 892, 310], [-520, 550, 250], [-130, 450, 100], engineToWorld([340, -35, -120])]} radius={6} color="#a3453d" />
    <Tube points={[[-365, 892, 310], [-300, 500, 180], engineToWorld([300, 0, -70])]} radius={5} color="#343f40" />
    <Tube points={[[-350, 930, 371], [-300, 865, 310], engineToWorld([300, 420, 60]), engineToWorld([0, 420, 60])]} radius={8} color="#343c3e" />
  </group>;
}

function Accessories({ clock, cutaway, show }: Pick<Props, 'clock' | 'cutaway'> & { show: SystemFlags }) {
  const alternator = useRef<THREE.Group>(null);
  const starter = useRef<THREE.Group>(null);
  useFrame(() => {
    const sample = sampleGolf(clock.current);
    if (alternator.current && sample.rpm > 0) alternator.current.rotation.x = clock.current.angle * Math.PI / 180 * 2.4;
    if (starter.current) starter.current.position.x = clock.current.operation === 'starting' ? 20 : 0;
  });
  return <group>
    <group name="golf-system-cooling" visible={show.cooling}><GolfAuxiliaries clock={clock} /></group>
    <group name="golf-system-starter" visible={show.starter}>
      <group position={engineToWorld([-95, 40, 90])} rotation={[0, 0, Math.PI / 2]}>
        <Turned profile={[[35, -80], [55, -74], [65, -45], [65, 45], [58, 67], [35, 80]]} />
        <group ref={alternator}><Shaft from={[-85, 0, 0]} to={[85, 0, 0]} radius={17} color="#b68b58" /></group>
      </group>
      <group position={engineToWorld([340, -35, -120])}>
        <Shaft from={[-85, 0, 0]} to={[85, 0, 0]} radius={47} color="#667377" />
        <Shaft from={[-50, 58, 0]} to={[50, 58, 0]} radius={23} />
        <group ref={starter}><Shaft from={[80, 0, 0]} to={[110, 0, 0]} radius={20} /></group>
      </group>
    </group>
    <group name="golf-system-transmission" visible={show.transmission}><GolfTransmission cutaway={cutaway} clock={clock} /></group>
  </group>;
}

const ALL_ON = allSystems(true);

export function GolfSystems({ clock, cutaway, scanner, fault, inspectFuses, show = ALL_ON }: Props) {
  return <group name="golf-connected-systems">
    <group name="golf-system-fuel" visible={show.fuel}><FuelSystem clock={clock} /></group>
    <group name="golf-system-electrical" visible={show.electrical}>
      <Electrical clock={clock} scanner={scanner} fault={fault} />
      <GolfFuseBoxes clock={clock} open={cutaway || Boolean(inspectFuses)} />
    </group>
    <group name="golf-system-harness" visible={show.harness}><GolfSensorHarness /></group>
    <Accessories clock={clock} cutaway={cutaway} show={show} />
    <group name="golf-system-intake" visible={show.intake}>
      <group userData={{ golfPart: 2 }} position={[-180, 700, -330]} rotation={[Math.PI / 2, 0, 0]}><Turned profile={[[36, -50], [41, -50], [41, 50], [36, 50], [36, -50]]} color="#374247" /><Casting position={[45, 0, 0]} size={[55, 50, 45]} color="#323d41" /><Connector pins={5} /></group>
      <Casting position={[-300, 700, -460]} size={[280, 180, 230]} radius={20} color="#2f3a3d" />
      <Tube points={AIR_PATH} radius={35} color="#344b50" opacity={0.35} /><Flow clock={clock} path={AIR_PATH} color="#65d8eb" kind="air" />
      <group position={[-10, 550, 0]} userData={{ golfPart: 12 }}><Casting size={[80, 80, 85]} radius={10} /><group position={[0, 68, 0]}><Connector pins={4} /></group><Casting position={[-55, 70, 50]} size={[140, 85, 85]} radius={8} /></group>
      <Tube points={[[80, 570, 160], [-60, 620, 90], [-10, 550, 0], [-80, 640, -200]]} radius={16} color="#9a9d95" />
    </group>
    <group name="golf-system-exhaust" visible={show.exhaust}>
      {[0, 1, 2, 3].map(index => <Tube key={index} points={[engineToWorld([index * 88, 244, -50]), engineToWorld([index * 88, 230, -110]), [index < 2 ? 215 : 75, 610, 140], [index < 2 ? 215 : 75, 535, 160]]} radius={19} color="#8e7d72" />)}
      {[75, 215].map(axis => <group key={axis}>
        <group position={[axis, 460, 170]} rotation={[Math.PI / 2, 0, 0]}><Catalyst position={[0, 0, 0]} radius={55} length={140} id={23} clock={clock} cutaway={cutaway} /></group>
        <Probe position={[axis, 595, 143]} id={22} />
        <Probe position={[axis, 350, 225]} id={26} />
        <Tube points={[[axis, 365, 175], [axis, 320, 220], [80, 300, 260]]} radius={27} color="#959d98" />
      </group>)}
      <Tube points={EXHAUST_PATH} radius={27.5} color="#939e9b" opacity={cutaway ? 0.5 : 1} />
      <Flow clock={clock} path={EXHAUST_PATH} color="#dc9076" kind="exhaust" />
      <Probe position={[-60, 210, 560]} id={24} long />
      <Catalyst position={[-80, 180, 900]} radius={72.5} length={400} id={25} clock={clock} cutaway={cutaway} />
      <Probe position={[-80, 205, 1180]} id={25} long />
      <Casting position={[-80, 320, 1150]} size={[120, 30, 90]} />
      <Casting position={[-100, 200, 2075]} size={[180, 180, 350]} radius={38} />
      <Casting position={[-180, 280, 3000]} size={[550, 170, 350]} radius={40} />
      {[-350, -250].map(axis => <Tube key={axis} points={[[-180, 280, 3150], [axis, 300, 3210], [axis, 300, 3330]]} radius={35} color="#b7c4c0" />)}
      {[900, 1500, 2100, 2500, 2900, 3250].map(depth => <Ring key={depth} position={[-80, 240, depth]} radius={20} tube={5} color="#3d4544" rotation={[0, 0, 0]} />)}
    </group>
  </group>;
}