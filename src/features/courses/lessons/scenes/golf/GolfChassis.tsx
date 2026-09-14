import { useMemo, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { Casting, Ring, Shaft, Tube, Turned } from './GolfPrimitives';
import { CHASSIS_CORNERS, CHASSIS_REFERENCE, coilPoints } from './golfChassisGeometry';
import type { StructurePoint } from './golfStructureGeometry';
import { GolfBrakeControls } from './GolfBrakeControls';
import type { BrakeState } from './golfBrakeHydraulics';
import type { GolfClock } from './golfPhysics';
import { GolfAcceleratorPedal } from './GolfEgasParts';
import { GolfSteeringWheel } from './GolfSteeringWheel';
import { allSystems, type SystemFlags } from './golfSystemToggles';

const ALL_ON = allSystems(true);

function Spring({ from, to, radius }: { from: StructurePoint; to: StructurePoint; radius: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(coilPoints(from, to, radius).map(point => new THREE.Vector3(...point))), [from, to, radius]);
  return <mesh><tubeGeometry args={[curve, 160, 9, 8, false]} /><meshStandardMaterial color="#343c40" metalness={0.6} roughness={0.45} /></mesh>;
}

function Joint({ position, radius = 26 }: { position: StructurePoint; radius?: number }) {
  return <group position={position}>
    <mesh><sphereGeometry args={[radius, 12, 8]} /><meshStandardMaterial color="#424d51" roughness={0.65} /></mesh>
    <Shaft from={[0, -radius - 7, 0]} to={[0, radius + 7, 0]} radius={9} />
  </group>;
}

function CvBoot({ from, to }: { from: StructurePoint; to: StructurePoint }) {
  const direction = new THREE.Vector3(...to).sub(new THREE.Vector3(...from));
  const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return <group position={from} quaternion={rotation}>
    <Turned color="#252e32" profile={[[18, 0], [28, 5], [20, 12], [34, 19], [23, 26], [40, 33], [26, 40], [45, 47], [32, 54], [45, 60], [45, 70], [16, 70]]} />
    <Ring position={[0, 65, 0]} radius={45} tube={3} color="#aebaba" />
  </group>;
}

export function GolfChassis({ brakes, clock, show = ALL_ON }: { brakes: MutableRefObject<BrakeState>; clock: MutableRefObject<GolfClock>; show?: SystemFlags }) {
  return <group name="golf-chassis" userData={CHASSIS_REFERENCE}>
    <group name="golf-system-suspension" visible={show.suspension}>
    {CHASSIS_CORNERS.map(corner => {
      const { side, knuckle, hub, damperTop, springTop } = corner;
      const front = corner.axle === 'front';
      const damperBottom: StructurePoint = front ? [side * 685, 370, 0] : [side * 685, 320, 2680];
      const damperMiddle = damperBottom.map((value, index) => value + (damperTop[index] - value) * 0.58) as StructurePoint;
      return <group key={corner.id} name={`golf-suspension-${corner.id}`}>
        <Casting position={knuckle} size={[65, 180, 85]} radius={15} color="#79878b" />
        <Shaft from={knuckle} to={hub} radius={42} color="#aeb8b9" />
        <Shaft from={damperBottom} to={damperMiddle} radius={27} color="#364650" />
        <Shaft from={damperMiddle} to={damperTop} radius={12} color="#c7d2d0" />
        <Joint position={damperTop} radius={35} />
        {front ? <>
          <Spring from={[side * 645, 515, -40]} to={[side * 575, 742, -90]} radius={68} />
          <Ring position={[side * 645, 510, -40]} radius={75} tube={6} />
          <Ring position={[side * 575, 750, -90]} radius={75} tube={6} />
          <Tube points={[[side * 410, 280, -70], [side * 555, 250, -80], [side * 695, 250, 0], [side * 555, 260, 200], [side * 415, 275, 315]]} radius={23} color="#717f83" />
          <Shaft from={[side * 410, 280, -70]} to={[side * 415, 275, 315]} radius={16} />
          <Joint position={[side * 695, 250, 0]} />
          <Joint position={[side * 415, 275, 315]} radius={37} />
          <Joint position={[side * 410, 280, -70]} radius={30} />
          <Shaft from={[side * 590, 330, 140]} to={[side * 650, 535, 10]} radius={9} color="#9ca8aa" />
        </> : <>
          <Spring from={[side * 475, 305, 2600]} to={springTop} radius={64} />
          <Casting position={[side * 475, 295, 2600]} size={[150, 25, 160]} color="#47565a" radius={8} />
          <Shaft from={[side * 330, 305, 2600]} to={[side * 695, 285, 2578]} radius={26} color="#536468" />
          <Shaft from={[side * 350, 455, 2460]} to={[side * 695, 400, 2550]} radius={17} color="#536468" />
          <Shaft from={[side * 350, 340, 2770]} to={[side * 695, 330, 2650]} radius={15} color="#536468" />
          <Tube points={[[side * 615, 340, 2150], [side * 665, 280, 2350], [side * 700, 280, 2578]]} radius={24} color="#536468" />
          <Joint position={[side * 615, 340, 2150]} radius={34} />
        </>}
        {corner.innerCv && <group name={`golf-halfshaft-${corner.id}`} userData={{ drive: 'front' }}>
          <Shaft from={corner.innerCv} to={knuckle} radius={18} />
          <CvBoot from={corner.innerCv} to={knuckle} />
          <CvBoot from={knuckle} to={corner.innerCv} />
          <Shaft from={corner.innerCv} to={[corner.innerCv[0] - side * 35, corner.innerCv[1], corner.innerCv[2]]} radius={53} color="#67777b" />
        </group>}
      </group>;
    })}
    <group name="golf-anti-roll-bars">
      <Tube points={[[-590, 330, 140], [-530, 350, 270], [-350, 345, 300], [350, 345, 300], [530, 350, 270], [590, 330, 140]]} radius={12} color="#344448" />
      <Tube points={[[-650, 340, 2650], [-520, 370, 2790], [-300, 365, 2810], [300, 365, 2810], [520, 370, 2790], [650, 340, 2650]]} radius={10} color="#344448" />
      {[-1, 1].map(side => <group key={side}>
        <Casting position={[side * 330, 350, 300]} size={[45, 45, 45]} radius={6} color="#1e2b30" />
        <Casting position={[side * 330, 365, 2810]} size={[40, 40, 40]} radius={6} color="#1e2b30" />
      </group>)}
    </group>
    </group>
    <group name="golf-steering" visible={show.steering} userData={{ actuation: 'not-simulated', type: 'electromechanical-dual-pinion' }}>
      <Shaft from={[-440, 360, 235]} to={[440, 360, 235]} radius={30} color="#a7b3b4" />
      <Shaft from={[-140, 410, 255]} to={[140, 410, 255]} radius={53} color="#67797d" />
      <Casting position={[20, 465, 265]} size={[170, 45, 95]} radius={7} color="#293c43" />
      {[-1, 1].map(side => <group key={side}>
        <CvBoot from={[side * 440, 360, 235]} to={[side * 600, 350, 160]} />
        <Shaft from={[side * 470, 360, 235]} to={[side * 698, 355, 100]} radius={11} />
        <Joint position={[side * 698, 355, 100]} radius={20} />
      </group>)}
      <Shaft from={[-345, 360, 235]} to={[-380, 580, 460]} radius={15} />
      <Joint position={[-380, 580, 460]} radius={22} />
      <Shaft from={[-380, 580, 460]} to={[-390, 890, 910]} radius={17} />
      <Shaft from={[-390, 760, 720]} to={[-390, 890, 910]} radius={37} color="#26383e" />
      <GolfSteeringWheel />
      <Shaft from={[-460, 860, 880]} to={[-580, 885, 920]} radius={9} color="#243238" />
    </group>
    <group name="golf-system-brake-control" visible={show.brakes}><GolfBrakeControls brakes={brakes} /></group>
    <group name="golf-system-accelerator-pedal" visible={show.egas}><GolfAcceleratorPedal clock={clock} /></group>
    <group name="golf-underbody-details" visible={show.bodywork}>
      <Casting position={[0, 345, 1430]} size={[280, 6, 1300]} color="#b8beb3" radius={2} />
      <Casting position={[0, 540, 2900]} size={[750, 6, 430]} color="#b8beb3" radius={2} />
      <Tube points={[[770, 895, 2850], [670, 770, 2830], [630, 560, 2660], [510, 430, 2210]]} radius={25} color="#2b3c40" />
    </group>
  </group>;
}