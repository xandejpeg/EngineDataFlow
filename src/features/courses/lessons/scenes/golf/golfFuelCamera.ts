import * as THREE from 'three';
import type { FuelFocus } from './GolfFuelPanel';

export function fuelViewBounds(focus: FuelFocus) {
  if (focus === 'gauge') return new THREE.Box3(new THREE.Vector3(-419, 901, 865), new THREE.Vector3(-361, 959, 900));
  if (focus === 'sender') return new THREE.Box3(new THREE.Vector3(-285, 300, 2105), new THREE.Vector3(-60, 610, 2195));
  if (focus === 'tank') return new THREE.Box3(new THREE.Vector3(-430, 285, 1920), new THREE.Vector3(430, 635, 2530));
  return new THREE.Box3(new THREE.Vector3(-650, 280, 400), new THREE.Vector3(440, 970, 2540));
}