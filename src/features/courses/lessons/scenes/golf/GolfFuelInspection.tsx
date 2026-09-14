import { useEffect, type MutableRefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GolfFuelGauge } from './GolfFuelGauge';
import { GolfFuelTank, GolfFuelSenderHarness } from './GolfFuelTank';
import { fuelViewBounds } from './golfFuelCamera';
import type { FuelFocus } from './GolfFuelPanel';
import type { GolfClock } from './golfPhysics';

export function GolfFuelInspection({ clock, focus, reset }: { clock: MutableRefObject<GolfClock>; focus: FuelFocus; reset: number }) {
  const { camera, size } = useThree();
  const [axis, height, depth] = fuelViewBounds(focus).getCenter(new THREE.Vector3()).toArray();
  useEffect(() => {
    const bounds = fuelViewBounds(focus);
    const target = new THREE.Vector3(axis, height, depth);
    const direction = new THREE.Vector3(...(focus === 'gauge' || focus === 'sender' ? [0.15, 0.12, 1] as const : [1, 0.8, 1] as const)).normalize();
    const right = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    const up = direction.clone().cross(right).normalize();
    const tangent = Math.tan(21 * Math.PI / 180) * 0.86;
    let distance = 0;
    for (const cornerX of [bounds.min.x, bounds.max.x]) for (const cornerY of [bounds.min.y, bounds.max.y]) for (const cornerZ of [bounds.min.z, bounds.max.z]) {
      const point = new THREE.Vector3(cornerX, cornerY, cornerZ).sub(target);
      distance = Math.max(distance, point.dot(direction) + Math.abs(point.dot(up)) / tangent, point.dot(direction) + Math.abs(point.dot(right)) / (tangent * size.width / size.height));
    }
    camera.position.copy(direction.multiplyScalar(distance).add(target)); camera.lookAt(target); camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, focus, reset, axis, height, depth]);
  return <><group name="golf-fuel-inspection" userData={{ focus }}>
    {focus !== 'gauge' && <GolfFuelTank clock={clock} sensorOnly={focus === 'sender'} />}
    {(focus === 'circuit' || focus === 'gauge') && <GolfFuelGauge clock={clock} />}
    {focus === 'circuit' && <GolfFuelSenderHarness clock={clock} />}
  </group><OrbitControls key={`${focus}-${reset}`} makeDefault target={[axis, height, depth]} minDistance={30} maxDistance={10000} enableDamping /></>;
}