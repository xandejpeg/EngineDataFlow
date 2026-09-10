import { useEffect, useRef, type ElementRef, type MutableRefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GolfAcceleratorPedal, GolfEgasEcu, GolfEgasHarness, GolfThrottleBody } from './GolfEgasParts';
import { GOLF, type GolfClock } from './golfPhysics';
import { MOTOR_ORIGIN } from './golfAssembly';

export type EgasFocus = 'circuit' | 'pedal' | 'throttle';

export function GolfEgasInspection({ clock, focus, reset }: { clock: MutableRefObject<GolfClock>; focus: EgasFocus; reset: number }) {
  const { camera, scene, size } = useThree();
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  useEffect(() => {
    scene.updateMatrixWorld(true);
    const name = focus === 'pedal' ? 'golf-accelerator-assembly' : focus === 'throttle' ? 'golf-throttle-body' : 'golf-egas-inspection';
    const object = scene.getObjectByName(name);
    if (!object) return;
    const bounds = new THREE.Box3().setFromObject(object).expandByScalar(focus === 'pedal' ? 40 : 12);
    const center = bounds.getCenter(new THREE.Vector3());
    const direction = (focus === 'throttle' ? new THREE.Vector3(-0.2, 0.25, -1) : new THREE.Vector3(-0.7, 0.3, 1)).normalize();
    const right = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    const up = direction.clone().cross(right).normalize();
    const vertical = Math.tan(21 * Math.PI / 180) * 0.8;
    const horizontal = vertical * size.width / size.height;
    let distance = 0;
    for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) {
      const relative = new THREE.Vector3(axis, height, depth).sub(center);
      distance = Math.max(distance, relative.dot(direction) + Math.abs(relative.dot(right)) / horizontal, relative.dot(direction) + Math.abs(relative.dot(up)) / vertical);
    }
    camera.position.copy(center).addScaledVector(direction, distance);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    controls.current?.target.copy(center);
    controls.current?.update();
  }, [camera, scene, size.width, size.height, focus, reset]);
  return <>
    <OrbitControls ref={controls} makeDefault minDistance={80} maxDistance={18000} enableDamping />
    <group name="golf-egas-inspection" userData={{ focus }}>
      <GolfAcceleratorPedal clock={clock} />
      <GolfEgasEcu />
      <GolfEgasHarness clock={clock} />
      <group position={MOTOR_ORIGIN} rotation={[GOLF.tilt, Math.PI, 0]}><GolfThrottleBody clock={clock} /></group>
    </group>
  </>;
}