import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Connector, Shaft, Tube } from './GolfPrimitives';
import { sampleWipers, type WiperMode } from './golfWipers';
import { wiperSupply, type GolfClock } from './golfPhysics';
import { WIPER_CONTROLLER, WIPER_MOTOR, WIPER_PIVOTS, WIPER_PLANE, WIPER_STALK, WIPER_WIRES, wiperPose, type WiperPoint } from './golfWiperGeometry';
import type { WiperFocus } from './GolfWiperPanel';

export function GolfWiperSystem({ clock, inspection = false, focus = 'circuit' }: { clock: MutableRefObject<GolfClock>; inspection?: boolean; focus?: WiperFocus }) {
  const arms = useRef<(THREE.Group | null)[]>([]);
  const links = useRef<(THREE.Mesh | null)[]>([]);
  const joints = useRef<(THREE.Group | null)[]>([]);
  const stalk = useRef<THREE.Group>(null);
  const lights = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const direction = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));
  useFrame(() => {
    const state = clock.current.wipers;
    const sample = sampleWipers(state, wiperSupply(clock.current));
    const motor = wiperPose(state.phase);
    const driven = wiperPose(state.armPhase);
    const segments: [WiperPoint, WiperPoint][] = [[WIPER_MOTOR, motor.crank], [motor.crank, driven.left], [WIPER_PIVOTS[0], driven.left], [WIPER_PIVOTS[1], driven.right], [driven.left, driven.right]];
    segments.forEach(([start, finish], index) => {
      const mesh = links.current[index];
      if (!mesh) return;
      mesh.visible = index !== 1 || sample.linked;
      mesh.position.set((start[0] + finish[0]) / 2, (start[1] + finish[1]) / 2, 35);
      direction.current.set(finish[0] - start[0], finish[1] - start[1], 0);
      mesh.scale.y = direction.current.length();
      mesh.quaternion.setFromUnitVectors(up.current, direction.current.normalize());
    });
    [motor.crank, driven.left, driven.right].forEach((point, index) => joints.current[index]?.position.fromArray(point));
    arms.current.forEach(arm => { if (arm) arm.rotation.z = driven.sweep; });
    if (stalk.current) stalk.current.rotation.z = ['off', 'intermittent', 'low', 'high'].indexOf(state.mode) * 0.16;
    WIPER_WIRES.forEach((wire, index) => {
      const active = wire.id === 'supply' || wire.id === 'ground' ? sample.supply : wire.id === 'motor' ? sample.motorPowered : wire.id === 'park' ? sample.supply && sample.parkContact : wire.id === 'washer' ? sample.washerPowered : sample.supply && state.mode !== 'off';
      lights.current[index]?.color.set(active ? '#eebc40' : '#586366');
    });
  });
  const modes: WiperMode[] = ['off', 'intermittent', 'low', 'high'];
  return <group name="golf-wipers" userData={{ dimensionalStatus: 'estimated', application: 'generic-front-four-bar-not-vw-oe' }}>
    <group name="golf-wiper-stalk" position={WIPER_STALK} visible={focus !== 'mechanism'}>
      <Casting size={[34, 42, 45]} color="#2a383d" />
      <group name="golf-wiper-stalk-lever" ref={stalk} onClick={event => { event.stopPropagation(); const current = clock.current.wipers; clock.current = { ...clock.current, wipers: { ...current, mode: modes[(modes.indexOf(current.mode) + 1) % modes.length] } }; }}>
        <Shaft from={[0, 0, 0]} to={[85, 25, 40]} radius={9} color="#26383e" />
        <group name="golf-wiper-stalk-grip" position={[85, 25, 40]}><Casting size={[60, 24, 30]} radius={6} color="#26383e" /><Casting position={[0, 13, 0]} size={[28, 2, 12]} color="#d2ddd6" radius={0.5} /></group>
      </group>
    </group>
    <group name="golf-wiper-controller" position={WIPER_CONTROLLER} visible={focus === 'circuit'} userData={{ representation: 'functional-block-not-vw-module' }}><Casting size={[90, 35, 65]} color="#435153" /><group position={[30, 20, 0]}><Connector pins={4} /></group></group>
    <group name="golf-wiper-mechanism" position={WIPER_PLANE.origin} rotation={[WIPER_PLANE.tilt, 0, 0]} visible={focus !== 'stalk'}>
      {inspection && <group name="golf-wiper-glass-reference" userData={{ representation: 'estimated-windshield-plane' }}><mesh position={[0, 300, 9]}><planeGeometry args={[1634, 615]} /><meshStandardMaterial color="#4696a8" transparent opacity={0.38} side={THREE.DoubleSide} depthWrite={false} /></mesh>{[[[-817, -7, 9], [817, -7, 9]], [[-817, 607, 9], [817, 607, 9]], [[-817, -7, 9], [-817, 607, 9]], [[817, -7, 9], [817, 607, 9]]].map(([from, to], index) => <Shaft key={index} from={from as WiperPoint} to={to as WiperPoint} radius={4} color="#718f94" />)}</group>}
      <Shaft from={[-670, -20, 62]} to={[160, -20, 62]} radius={14} color="#788b91" />
      <group name="golf-wiper-motor" position={WIPER_MOTOR}><Casting position={[0, 0, 38]} size={[145, 92, 45]} color="#83969b" /><Shaft from={[-100, 0, 40]} to={[-40, 0, 40]} radius={35} color="#4b6068" /><Shaft from={[0, 0, -10]} to={[0, 0, 55]} radius={12} /></group>
      {Array.from({ length: 5 }, (_, index) => <mesh key={index} name={`golf-wiper-link-${index}`} ref={mesh => { links.current[index] = mesh; }}><cylinderGeometry args={[index === 0 ? 9 : 6, index === 0 ? 9 : 6, 1, 12]} /><meshStandardMaterial color={index === 0 ? '#bb884f' : '#a5b5b6'} metalness={0.7} roughness={0.4} /></mesh>)}
      {Array.from({ length: 3 }, (_, index) => <group key={index} name={`golf-wiper-joint-${index}`} ref={object => { joints.current[index] = object; }}><mesh><sphereGeometry args={[12, 12, 8]} /><meshStandardMaterial color="#bfa76b" metalness={0.6} roughness={0.4} /></mesh></group>)}
      {WIPER_PIVOTS.map((pivot, index) => <group key={index} position={[pivot[0], pivot[1], 0]}>
        <Shaft from={[0, 0, -18]} to={[0, 0, 65]} radius={13} />
        <group name={`golf-wiper-arm-${index}`} ref={object => { arms.current[index] = object; }}>
          <Shaft from={[0, 0, -12]} to={[280, 0, -12]} radius={7} color="#26383e" />
          <Casting position={[292, 0, -12]} size={[45, 19, 16]} radius={3} color="#6c7f84" />
          <Casting position={[390, 0, -12]} size={[380, 14, 10]} radius={3} color="#34484d" />
          <Casting position={[390, 0, -5]} size={[380, 7, 5]} radius={1} color="#172b2f" />
          <group name={`golf-wiper-tip-${index}`} position={[580, 0, -12]} />
        </group>
      </group>)}
    </group>
    <group name="golf-wiper-harness" visible={focus === 'circuit'}>
      {WIPER_WIRES.map((wire, index) => <group key={wire.id} name={`golf-wiper-wire-${wire.id}`} userData={{ representation: 'functional-route-not-pinout', from: wire.from, to: wire.to }}>
        <Tube points={[wire.from, [(wire.from[0] + wire.to[0]) / 2, Math.min(wire.from[1], wire.to[1]) - 30 - index * 6, (wire.from[2] + wire.to[2]) / 2], wire.to]} radius={2} color={wire.color} />
        <mesh position={wire.to}><sphereGeometry args={[5, 10, 8]} /><meshBasicMaterial ref={material => { lights.current[index] = material; }} color="#586366" /></mesh>
      </group>)}
    </group>
  </group>;
}