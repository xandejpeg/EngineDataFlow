import { useMemo } from 'react';
import * as THREE from 'three';
import { Casting, Ring, Shaft, Turned } from './GolfPrimitives';
import { FRONT_STRUCTURE, REAR_STRUCTURE, VERIFIED_RUNNING_GEAR, MODEL_PENDULUM_BUSHES, pendulumBushProfile, hollowSection, subframeShape, type StructurePoint } from './golfStructureGeometry';
import { GOLF } from './golfPhysics';

function BoxMember({ from, to, width, height, color, opacity }: { from: StructurePoint; to: StructurePoint; width: number; height: number; color: string; opacity: number }) {
  const shape = useMemo(() => hollowSection(width, height, 3), [width, height]);
  const direction = new THREE.Vector3(...to).sub(new THREE.Vector3(...from));
  const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.clone().normalize());
  return <mesh position={from} quaternion={rotation}>
    <extrudeGeometry args={[shape, { depth: direction.length(), bevelEnabled: true, bevelSize: 0.8, bevelThickness: 0.8, bevelSegments: 1 }]} />
    <meshStandardMaterial color={color} metalness={0.55} roughness={0.48} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} />
  </mesh>;
}

function WheelHouse({ side, opacity }: { side: number; opacity: number }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    for (let step = 0; step <= 40; step++) {
      const angle = step / 40 * Math.PI;
      for (const axis of [520, 805]) positions.push(side * axis, GOLF.wheelRadius + Math.sin(angle) * 370, Math.cos(angle) * 370);
      if (step < 40) {
        const base = step * 2;
        indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, [side]);
  return <mesh geometry={geometry}><meshStandardMaterial color="#84948e" metalness={0.5} roughness={0.58} side={THREE.DoubleSide} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} /></mesh>;
}

function Bulkhead({ opacity }: { opacity: number }) {
  const shape = useMemo(() => {
    const result = new THREE.Shape();
    result.moveTo(-700, 250); result.lineTo(-130, 250); result.lineTo(-115, 360);
    result.quadraticCurveTo(0, 395, 115, 360); result.lineTo(130, 250);
    result.lineTo(700, 250); result.lineTo(700, 750);
    result.quadraticCurveTo(670, 880, 590, 905); result.lineTo(-590, 905);
    result.quadraticCurveTo(-670, 880, -700, 750); result.closePath();
    return result;
  }, []);
  return <group name="golf-bulkhead">
    <mesh position={[0, 0, 450]}><extrudeGeometry args={[shape, { depth: 2, bevelEnabled: false }]} /><meshStandardMaterial color="#899a93" metalness={0.5} roughness={0.6} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} /></mesh>
    {[-550, -350, 350, 550].map(axis => <Casting key={axis} position={[axis, 600, 448]} size={[22, 370, 8]} radius={2} color="#768b81" opacity={opacity} />)}
    <Casting position={[0, 910, 500]} size={[1390, 3, 100]} radius={1} color="#788d82" opacity={opacity} />
    <Casting position={[0, 950, 550]} size={[1390, 80, 3]} radius={1} color="#788d82" opacity={opacity} />
    <Casting position={[0, 925, 450]} size={[1390, 30, 3]} radius={1} color="#788d82" opacity={opacity} />
  </group>;
}

function RearShell({ opacity }: { opacity: number }) {
  const floor = useMemo(() => {
    const shape = new THREE.Shape();
    const profile = [[1600, 251], [1780, 251], [1980, 650], [2240, 650], [2400, 570], [3250, 570]];
    profile.forEach(([depth, height], index) => { if (index === 0) shape.moveTo(depth, height); else shape.lineTo(depth, height); });
    [...profile].reverse().forEach(([depth, height]) => shape.lineTo(depth, height - 3));
    shape.closePath();
    return shape;
  }, []);
  return <group>
    <mesh position={[520, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <extrudeGeometry args={[floor, { depth: 1040, bevelEnabled: false }]} />
      <meshStandardMaterial color="#8b9b94" metalness={0.55} roughness={0.55} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} />
    </mesh>
    {[-1, 1].map(side => <group key={side}>
      {REAR_STRUCTURE.rail.slice(1).map((point, index) => <BoxMember key={index} from={[side * REAR_STRUCTURE.rail[index][0], REAR_STRUCTURE.rail[index][1], REAR_STRUCTURE.rail[index][2]]} to={[side * point[0], point[1], point[2]]} width={90} height={110} color="#758a80" opacity={opacity} />)}
      <BoxMember from={[side * 690, 300, 1600]} to={[side * 690, 300, 2150]} width={90} height={125} color="#758a80" opacity={opacity} />
      <Casting position={[side * 605, 251, 1690]} size={[170, 3, 180]} radius={1} color="#8b9b94" opacity={opacity} />
      <group position={[0, 0, REAR_STRUCTURE.axle]}><WheelHouse side={side} opacity={opacity} /></group>
      <BoxMember from={[side * 690, 300, 2150]} to={[side * 710, 620, 2300]} width={65} height={75} color="#758a80" opacity={opacity} />
      <BoxMember from={[side * 710, 620, 2300]} to={[side * 710, 685, 2850]} width={65} height={75} color="#758a80" opacity={opacity} />
      <BoxMember from={[side * 710, 685, 2850]} to={[side * 620, 580, 3220]} width={65} height={75} color="#758a80" opacity={opacity} />
      <group position={REAR_STRUCTURE.damperMounts[side < 0 ? 0 : 1]} name={`golf-rear-damper-seat-${side}`}>
        <Turned profile={[[65, -135], [65, 0], [12, 0], [12, -3], [62, -3], [62, -135]]} color="#8fa398" opacity={opacity} />
        <Ring radius={45} tube={3} color="#637f70" />
      </group>
      <group position={REAR_STRUCTURE.springSeats[side < 0 ? 0 : 1]} name={`golf-rear-spring-seat-${side}`}>
        <Turned profile={[[22, -20], [77, -20], [80, -14], [80, 0], [22, 0], [22, -20]]} color="#758a80" opacity={opacity} />
      </group>
      {[-35, 35].map(offset => <Casting key={offset} position={[side * 350 + offset, 576, 2850]} size={[16, 12, 650]} radius={3} color="#7d9186" opacity={opacity} />)}
    </group>)}
    {[1650, 2110, 2930].map((depth, index) => <BoxMember key={depth} from={[-640, index === 0 ? 275 : index === 1 ? 600 : 530, depth]} to={[640, index === 0 ? 275 : index === 1 ? 600 : 530, depth]} width={65} height={45} color="#758a80" opacity={opacity} />)}
    <Casting position={[0, 620, 3250]} size={[1380, 100, 3]} radius={1} color="#889c92" opacity={opacity} />
    <BoxMember from={[-680, 485, 3260]} to={[680, 485, 3260]} width={65} height={100} color="#a7b7b2" opacity={opacity} />
    {[-1, 1].map(side => <BoxMember key={side} from={[side * 480, 485, 3220]} to={[side * 480, 485, 3260]} width={80} height={90} color="#889b91" opacity={opacity} />)}
    {REAR_STRUCTURE.mounts.map(mount => <group key={mount.id} position={mount.position} name={`golf-body-mount-${mount.id}`}>
      <Turned profile={[[9, 0], [42, 0], [42, 9], [9, 9], [9, 0]]} color="#758a80" opacity={opacity} />
    </group>)}
  </group>;
}

function CabinFrame({ opacity }: { opacity: number }) {
  return <group>
    {[-1, 1].map(side => <group key={side}>
      {[[[690, 300, 650], [690, 910, 460]], [[690, 910, 460], [650, 1420, 980]], [[690, 300, 1500], [685, 1440, 1550]], [[690, 300, 2100], [710, 685, 2320]], [[710, 685, 2320], [650, 1400, 2300]], [[650, 1420, 980], [685, 1440, 1550]], [[685, 1440, 1550], [650, 1400, 2300]], [[650, 1400, 2300], [620, 1050, 3020]], [[620, 1050, 3020], [620, 580, 3220]]].map(([from, to], index) => <BoxMember key={index} from={[side * from[0], from[1], from[2]]} to={[side * to[0], to[1], to[2]]} width={index === 2 ? 80 : 65} height={55} color="#8fa399" opacity={opacity} />)}
    </group>)}
    {[[650, 1420, 980], [685, 1440, 1550], [650, 1400, 2300], [620, 1050, 3020]].map(([axis, height, depth]) => <BoxMember key={depth} from={[-axis, height, depth]} to={[axis, height, depth]} width={55} height={35} color="#8fa399" opacity={opacity} />)}
  </group>;
}

function RearSubframe({ opacity }: { opacity: number }) {
  return <group>
    {[-1, 1].map(side => <group key={side}>
      <BoxMember from={[side * 480, 410, 2260]} to={[side * 480, 410, 2860]} width={85} height={65} color="#48575a" opacity={opacity} />
      {[2370, 2740].map(depth => <group key={depth} position={[side * 480, 410, depth]}>
        {[-24, 24].map(offset => <Casting key={offset} position={[side * 65, 0, offset]} size={[110, 60, 6]} radius={2} color="#48575a" opacity={opacity} />)}
      </group>)}
    </group>)}
    {[2300, 2810].map(depth => <BoxMember key={depth} from={[-480, 410, depth]} to={[480, 410, depth]} width={85} height={65} color="#48575a" opacity={opacity} />)}
    {REAR_STRUCTURE.mounts.map(mount => <group key={mount.id} position={mount.position} name={`golf-subframe-mount-${mount.id}`} userData={{ bodyAttachment: VERIFIED_RUNNING_GEAR.rearFwd.bodyAttachment, isolationBushes: VERIFIED_RUNNING_GEAR.rearFwd.isolationBushes }}>
      <Turned profile={[[10, -60], [42, -60], [42, 0], [10, 0], [10, -60]]} color="#48575a" opacity={opacity} />
      <Shaft from={[0, -65, 0]} to={[0, 12, 0]} radius={8} color="#a3afb1" />
      <mesh position={[0, -65, 0]}><cylinderGeometry args={[13, 13, 9, 6]} /><meshStandardMaterial color="#677b80" metalness={0.8} roughness={0.3} /></mesh>
    </group>)}
  </group>;
}

export function GolfStructure({ monocoque = true, subframe = true, rear = true, cabin = true, rearSubframe = true, opacity = 1 }: { monocoque?: boolean; subframe?: boolean; rear?: boolean; cabin?: boolean; rearSubframe?: boolean; opacity?: number }) {
  const aggregate = useMemo(subframeShape, []);
  const tunnel = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-133, 0); shape.lineTo(-113, 113); shape.quadraticCurveTo(0, 150, 113, 113); shape.lineTo(133, 0);
    shape.lineTo(130, 0); shape.lineTo(110, 111); shape.quadraticCurveTo(0, 146, -110, 111); shape.lineTo(-130, 0); shape.closePath();
    return shape;
  }, []);
  return <group name="golf-structure" userData={{ dimensionalStatus: 'estimated' }}>
    <group name="golf-monocoque-rear" visible={rear}><RearShell opacity={opacity} /></group>
    <group name="golf-cabin-frame" visible={cabin}><CabinFrame opacity={opacity} /></group>
    <group name="golf-rear-subframe" visible={rearSubframe}><RearSubframe opacity={opacity} /></group>
    <group name="golf-monocoque-front" visible={monocoque}>
      <Bulkhead opacity={opacity} />
      <mesh position={[0, 250, 450]}><extrudeGeometry args={[tunnel, { depth: 1150, bevelEnabled: false }]} /><meshStandardMaterial color="#8b9b94" metalness={0.5} roughness={0.55} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} /></mesh>
      {[-1, 1].map(side => <group key={side} name={`golf-front-shell-${side}`}>
        {FRONT_STRUCTURE.rail.slice(1).map((point, index) => <BoxMember key={index} from={[side * FRONT_STRUCTURE.rail[index][0], FRONT_STRUCTURE.rail[index][1], FRONT_STRUCTURE.rail[index][2]]} to={[side * point[0], point[1], point[2]]} width={90} height={110} color="#758a80" opacity={opacity} />)}
        <WheelHouse side={side} opacity={opacity} />
        <Casting position={[side * 395, 251, 1025]} size={[520, 3, 1150]} radius={1} color="#8b9b94" opacity={opacity} />
        {[-150, 0, 150].map(offset => <Casting key={offset} position={[side * 395 + offset, 257, 1030]} size={[18, 12, 950]} radius={3} color="#7d9186" opacity={opacity} />)}
        <BoxMember from={[side * 690, 300, 650]} to={[side * 690, 300, 1600]} width={90} height={125} color="#758a80" opacity={opacity} />
        <BoxMember from={[side * 465, 605, -650]} to={[side * 650, 790, 410]} width={55} height={65} color="#889b91" opacity={opacity} />
        <group position={FRONT_STRUCTURE.towers[side < 0 ? 0 : 1]} name={`golf-strut-tower-${side}`}>
          <Turned profile={[[142, -185], [139, -100], [112, -35], [87, 0], [29, 0], [29, -3], [85, -3], [109, -37], [136, -102], [139, -185]]} color="#8fa398" opacity={opacity} />
          <Ring radius={87} tube={2} color="#617e6e" />
          {[0, 120, 240].map(degrees => <group key={degrees} position={[Math.cos(degrees * Math.PI / 180) * 64, 1, Math.sin(degrees * Math.PI / 180) * 64]}><Ring radius={6} tube={2} color="#526e5f" /></group>)}
          <object3D name={`golf-tower-datum-${side}`} />
        </group>
      </group>)}
      {FRONT_STRUCTURE.mounts.map(mount => <group key={mount.id} position={mount.position} name={`golf-body-mount-${mount.id}`}>
        <Casting position={[-42, 50, 0]} size={[6, 90, 70]} radius={1} color="#758a80" opacity={opacity} />
        <Casting position={[42, 50, 0]} size={[6, 90, 70]} radius={1} color="#758a80" opacity={opacity} />
        <group position={[0, 5, 0]}><Turned profile={[[9, -5], [44, -5], [44, 5], [9, 5], [9, -5]]} color="#758a80" opacity={opacity} /></group>
      </group>)}
      <BoxMember from={[-665, 445, -795]} to={[665, 445, -795]} width={65} height={110} color="#a7b7b2" opacity={opacity} />
      {[-1, 1].map(side => <BoxMember key={side} from={[side * 430, 420, -735]} to={[side * 430, 445, -795]} width={80} height={90} color="#889b91" opacity={opacity} />)}
    </group>
    <group name="golf-front-subframe" visible={subframe}>
      <mesh position={[0, 251, 0]} rotation={[-Math.PI / 2, 0, 0]}><extrudeGeometry args={[aggregate, { depth: 24, bevelEnabled: true, bevelSize: 2, bevelThickness: 1, bevelSegments: 2 }]} /><meshStandardMaterial color="#b4bcbd" metalness={0.7} roughness={0.5} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} /></mesh>
      {[-360, -250, -135, 135, 250, 360].map(axis => <Casting key={axis} position={[axis, 288, 115]} size={[9, 26, 430]} radius={2} color="#a5afb1" opacity={opacity} />)}
      {[-50, 90, 200, 375].map(depth => <Casting key={depth} position={[0, 288, depth]} size={[810, 26, 8]} radius={2} color="#a5afb1" opacity={opacity} />)}
      <group position={FRONT_STRUCTURE.torqueMount}>
        <Turned profile={[[49, -23], [60, -23], [60, 28], [49, 28], [49, -23]]} color="#acb7b7" opacity={opacity} />
        {MODEL_PENDULUM_BUSHES.map(bush => <group key={bush.id} name={`golf-pendulum-bush-${bush.id}`} userData={{ sourceItem: bush.sourceItem, dimensionalStatus: 'estimated', variant: 'unverified' }}>
          <Turned profile={pendulumBushProfile(bush.bottom, bush.top)} color="#303b3b" opacity={opacity} />
        </group>)}
        <Turned profile={[[9, -18], [18, -18], [18, 22], [9, 22], [9, -18]]} color="#a2adae" opacity={opacity} />
      </group>
      {FRONT_STRUCTURE.mounts.map(mount => <group key={mount.id} position={mount.position} name={`golf-subframe-mount-${mount.id}`}>
        <Turned profile={[[9, -24], [26, -24], [26, 0], [9, 0], [9, -24]]} color="#acb7b7" opacity={opacity} />
        <Shaft from={[0, -32, 0]} to={[0, 18, 0]} radius={7} color="#66767b" />
        <mesh position={[0, -31, 0]}><cylinderGeometry args={[12, 12, 9, 6]} /><meshStandardMaterial color="#677b80" metalness={0.8} roughness={0.3} /></mesh>
      </group>)}
    </group>
  </group>;
}