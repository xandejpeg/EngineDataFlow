import { useEffect, type MutableRefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GolfAuxiliaries } from './GolfAuxiliaries';
import { COOLING_PORTS } from './golfCoolingGeometry';
import type { GolfClock } from './golfPhysics';

export type CoolingFocus = 'circuit' | 'thermostat' | 'pump' | 'radiator';
export const COOLING_FOCUS_OBJECTS = { circuit: 'golf-cooling-system', thermostat: 'golf-thermostat', pump: 'golf-water-pump', radiator: 'golf-radiator' } as const;

export function GolfCoolingInspection({ clock, reset, focus }: { clock: MutableRefObject<GolfClock>; reset: number; focus: CoolingFocus }) {
  const { camera, size, scene } = useThree();
  const target = focus === 'thermostat' ? COOLING_PORTS.thermostat : focus === 'pump' ? COOLING_PORTS.pumpInlet : focus === 'radiator' ? [0, 540, -760] as const : [50, 590, -180] as const;
  const [axisTarget, heightTarget, depthTarget] = target;
  useEffect(() => {
    const root = scene.getObjectByName(COOLING_FOCUS_OBJECTS[focus]);
    if (!root) return;
    scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(root).expandByScalar(25);
    const direction = new THREE.Vector3(1, 0.75, -1).normalize();
    const right = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    const up = direction.clone().cross(right).normalize();
    const tangent = Math.tan(21 * Math.PI / 180) * 0.85;
    let distance = 0;
    for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) {
      const point = new THREE.Vector3(axis - axisTarget, height - heightTarget, depth - depthTarget);
      distance = Math.max(distance, point.dot(direction) + Math.abs(point.dot(up)) / tangent, point.dot(direction) + Math.abs(point.dot(right)) / (tangent * size.width / size.height));
    }
    camera.position.copy(direction.multiplyScalar(distance).add(new THREE.Vector3(axisTarget, heightTarget, depthTarget)));
    camera.lookAt(axisTarget, heightTarget, depthTarget);
    camera.updateProjectionMatrix();
  }, [camera, scene, size.width, size.height, reset, focus, axisTarget, heightTarget, depthTarget]);
  return <><group name="golf-cooling-inspection" userData={{ focus }}><GolfAuxiliaries clock={clock} coolingOnly /></group><OrbitControls key={`${reset}-${focus}`} makeDefault target={[...target]} minDistance={100} maxDistance={9000} enableDamping /></>;
}