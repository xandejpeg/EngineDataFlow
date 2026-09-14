import { useEffect, type MutableRefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GolfWiperSystem } from './GolfWiperSystem';
import { GolfWasherAssembly } from './GolfWasherAssembly';
import { wiperViewBounds } from './golfWiperCamera';
import type { GolfClock } from './golfPhysics';
import type { WiperFocus } from './GolfWiperPanel';

export function GolfWiperInspection({ clock, focus, reset }: { clock: MutableRefObject<GolfClock>; focus: WiperFocus; reset: number }) {
  const { camera, size } = useThree();
  const center = wiperViewBounds(focus).getCenter(new THREE.Vector3());
  const [axis, height, depth] = center.toArray();
  useEffect(() => {
    const bounds = wiperViewBounds(focus);
    const target = new THREE.Vector3(axis, height, depth);
    const direction = new THREE.Vector3(...(focus === 'stalk' ? [0.7, 0.4, 1] as const : [0.25, 1, -1.1] as const)).normalize();
    const right = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    const up = direction.clone().cross(right).normalize();
    const tangent = Math.tan(21 * Math.PI / 180) * 0.86;
    let distance = 0;
    for (const cornerX of [bounds.min.x, bounds.max.x]) for (const cornerY of [bounds.min.y, bounds.max.y]) for (const cornerZ of [bounds.min.z, bounds.max.z]) {
      const relative = new THREE.Vector3(cornerX, cornerY, cornerZ).sub(target);
      distance = Math.max(distance, relative.dot(direction) + Math.abs(relative.dot(up)) / tangent, relative.dot(direction) + Math.abs(relative.dot(right)) / (tangent * size.width / size.height));
    }
    camera.position.copy(direction.multiplyScalar(distance).add(target));
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, focus, reset, axis, height, depth]);
  return <><group name="golf-wiper-inspection" userData={{ focus }}><GolfWiperSystem clock={clock} focus={focus} inspection />{focus === 'circuit' && <GolfWasherAssembly />}</group><OrbitControls key={`${focus}-${reset}`} makeDefault target={[axis, height, depth]} minDistance={100} maxDistance={10000} enableDamping /></>;
}