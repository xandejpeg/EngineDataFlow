import { useMemo } from 'react';
import * as THREE from 'three';
import { Casting, Shaft, Turned, Tube } from './GolfPrimitives';
import { CLUTCH_RELEASE_REFERENCE, SLAVE_CYLINDER_MODEL } from './golfClutchReference';

export function GolfClutchSlave() {
  const boot = useMemo(() => SLAVE_CYLINDER_MODEL.bootProfile.map(point => new THREE.Vector2(...point)), []);
  const body = useMemo(() => SLAVE_CYLINDER_MODEL.bodyProfile.map(point => new THREE.Vector2(...point)), []);
  return <group name="golf-clutch-slave" position={SLAVE_CYLINDER_MODEL.position} rotation={[0, 0, -Math.PI / 2]} userData={{
    sourceFigure: CLUTCH_RELEASE_REFERENCE.figure,
    sourceItem: CLUTCH_RELEASE_REFERENCE.slaveCylinder.item,
    location: CLUTCH_RELEASE_REFERENCE.slaveCylinder.location,
    dimensionalStatus: SLAVE_CYLINDER_MODEL.dimensionalStatus,
    placementStatus: SLAVE_CYLINDER_MODEL.placementStatus,
    actuation: SLAVE_CYLINDER_MODEL.actuation,
    visualReference: 'SACHS 6283 605 040; application to exact gearbox unverified',
  }}>
    <mesh name="golf-clutch-slave-body"><latheGeometry args={[body, 32]} /><meshStandardMaterial color="#242829" metalness={0.05} roughness={0.62} /></mesh>
    <Casting position={[0, -10, 0]} size={[8, 12, 62]} radius={3} color="#242829" />
    {SLAVE_CYLINDER_MODEL.mountingOffsets.map(offset => <group key={offset} name={`golf-clutch-slave-mount-${offset}`} position={[0, -10, offset]}>
      <Casting position={[11, 0, 0]} size={[22, 16, 14]} radius={3} color="#242829" />
      {[-5, 5].map(rib => <Casting key={rib} position={[8, rib, 0]} size={[20, 2, 16]} radius={0.6} color="#383d3e" />)}
      <Shaft from={[-7, 0, 0]} to={[22, 0, 0]} radius={3} />
      <Shaft from={[-8, 0, 0]} to={[-4, 0, 0]} radius={5} />
    </group>)}
    <mesh name="golf-clutch-slave-boot"><latheGeometry args={[boot, 24]} /><meshStandardMaterial color="#2d3436" metalness={0} roughness={0.92} /></mesh>
    <group name="golf-clutch-slave-plunger" userData={{ sourceItem: CLUTCH_RELEASE_REFERENCE.slaveCylinder.plungerItem }}>
      <Shaft from={[0, SLAVE_CYLINDER_MODEL.plunger.start, 0]} to={[0, SLAVE_CYLINDER_MODEL.plunger.end, 0]} radius={SLAVE_CYLINDER_MODEL.plunger.radius} />
      <mesh name="golf-clutch-plunger-tip" position={[0, SLAVE_CYLINDER_MODEL.plunger.end, 0]}><sphereGeometry args={[SLAVE_CYLINDER_MODEL.plunger.radius, 16, 10]} /><meshStandardMaterial color="#8c969c" metalness={0.75} roughness={0.32} /></mesh>
    </group>
    <group name="golf-clutch-slave-hydraulic-port" position={[-14, -59, 0]} rotation={[0, 0, Math.PI / 2]}>
      <Turned profile={[[3, 0], [7, 0], [7, 9], [5, 12], [3, 12], [3, 0]]} color="#242829" />
      <Tube points={[[-6, 7, -4], [-8, 7, 0], [-6, 7, 5], [6, 7, 5], [8, 7, 0], [6, 7, -4]]} radius={0.8} color="#adb3b3" />
    </group>
  </group>;
}