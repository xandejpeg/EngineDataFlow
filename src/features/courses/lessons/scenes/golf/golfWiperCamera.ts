import * as THREE from 'three';
import { wiperToWorld } from './golfWiperGeometry';
import type { WiperFocus } from './GolfWiperPanel';

export function wiperViewBounds(focus: WiperFocus) {
  if (focus === 'stalk') return new THREE.Box3(new THREE.Vector3(-350, 825, 845), new THREE.Vector3(-195, 970, 960));
  const bounds = new THREE.Box3();
  for (const axis of [-850, 850]) for (const height of [-165, 630]) for (const depth of [-35, 120]) bounds.expandByPoint(new THREE.Vector3(...wiperToWorld([axis, height, depth])));
  if (focus === 'circuit') { bounds.expandByPoint(new THREE.Vector3(700, 380, -580)); bounds.expandByPoint(new THREE.Vector3(-670, 680, 975)); }
  return bounds;
}