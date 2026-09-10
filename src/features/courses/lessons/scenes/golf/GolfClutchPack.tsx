import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Ring, Shaft, Turned } from './GolfPrimitives';
import { CLUTCH_PACK_MODEL as MODEL, annulusProfile, clutchPackOffsets } from './golfClutchPackGeometry';
import type { GolfClock } from './golfPhysics';

function Diaphragm() {
  const geometry = useMemo(() => {
    const { innerRadius, outerRadius, tip, root, fingers } = MODEL.diaphragm;
    const positions: number[] = [];
    const indices: number[] = [];
    for (let finger = 0; finger < fingers; finger++) {
      const center = finger * Math.PI * 2 / fingers;
      const halfWidth = Math.PI / fingers * 0.78;
      for (const [radius, height] of [[innerRadius, tip], [outerRadius, root]]) {
        for (const angle of [center - halfWidth, center + halfWidth]) positions.push(radius * Math.cos(angle), height, radius * Math.sin(angle));
      }
      const base = finger * 4;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, []);
  return <group name="golf-clutch-diaphragm">
    <mesh geometry={geometry}><meshStandardMaterial color="#5d737d" side={THREE.DoubleSide} metalness={0.8} roughness={0.38} /></mesh>
    <Turned profile={annulusProfile(89, 108, 57, 60)} color="#5d737d" />
    <Ring position={[0, 58, 0]} radius={91} tube={2} color="#bac6c3" />
  </group>;
}

export function GolfClutchPack({ exploded = false, clock }: { exploded?: boolean; clock?: MutableRefObject<GolfClock> }) {
  const offsets = clutchPackOffsets(exploded);
  const rotating = useRef<THREE.Group>(null);
  useFrame(() => {
    if (rotating.current) rotating.current.rotation.y = clock && !exploded ? -clock.current.angle * Math.PI / 180 : 0;
  });
  return <group name="golf-clutch-pack" position={MODEL.position} rotation={[0, 0, -Math.PI / 2]} userData={{ dimensionalStatus: MODEL.dimensionalStatus, applicationStatus: MODEL.applicationStatus, actuation: MODEL.actuation, exploded, rotation: clock ? 'illustrative-engine-synchronized' : 'static-inspection' }}>
    <group ref={rotating} name="golf-clutch-pack-rotation">
    <group name="golf-flywheel" position={[0, offsets.flywheel, 0]}>
      <Turned profile={[[22, 100], [112, 100], [112, 102], [137, 102], [137, 116], [126, 116], [126, 124], [22, 124], [22, 100]]} color="#7f9196" />
      <Turned profile={annulusProfile(72, 112, 99.8, 100)} color="#c1cac8" />
      <Shaft from={[0, MODEL.flywheel.end, 0]} to={[0, MODEL.crankAdapterEnd, 0]} radius={23} />
      <Turned profile={annulusProfile(8, 35, 175, MODEL.crankAdapterEnd)} color="#647b84" />
      {Array.from({ length: MODEL.flywheel.teeth }, (_, index) => <group key={index} rotation={[0, index * Math.PI * 2 / MODEL.flywheel.teeth, 0]}>
        <Casting position={[138, 109, 0]} size={[7, 11, 5]} color="#a8b3b2" radius={0.8} />
      </group>)}
      {Array.from({ length: 6 }, (_, index) => <group key={index} rotation={[0, index * Math.PI / 3, 0]}>
        <Shaft from={[42, 98, 0]} to={[42, 103, 0]} radius={5} color="#42565f" />
      </group>)}
    </group>
    <group name="golf-clutch-disc" position={[0, offsets.disc, 0]}>
      <Turned profile={annulusProfile(27, 107, 95, 97)} color="#829ca6" />
      <Turned profile={annulusProfile(MODEL.disc.bore, 26, MODEL.disc.hubStart, MODEL.disc.hubEnd)} color="#95a6aa" />
      {[MODEL.disc.start, 97].map(height => <group key={height}>
        <Turned profile={annulusProfile(MODEL.disc.innerRadius, MODEL.disc.outerRadius, height, height + 3)} color="#484b44" />
        {Array.from({ length: 12 }, (_, index) => <group key={index} rotation={[0, index * Math.PI / 6, 0]}>
          <Casting position={[92, height + 1.5, 0]} size={[34, 3.2, 1.5]} color="#202f32" radius={0.3} />
          <Shaft from={[82, height - 0.2, 6]} to={[82, height + 3.2, 6]} radius={2.5} color="#9caa9c" />
        </group>)}
      </group>)}
      {Array.from({ length: 6 }, (_, index) => <group key={index} rotation={[0, index * Math.PI / 3, 0]}>
        <Casting position={[49, 94, 0]} size={[35, 5, 22]} radius={3} color="#526e7d" />
        <Shaft from={[28, 93, 0]} to={[67, 93, 0]} radius={4} color="#b2bdb8" />
      </group>)}
    </group>
    <group name="golf-clutch-pressure-plate" position={[0, offsets.pressure, 0]}>
      <Turned profile={annulusProfile(MODEL.pressure.innerRadius, MODEL.pressure.outerRadius, MODEL.pressure.start, MODEL.pressure.end)} color="#aab7b7" />
      {Array.from({ length: 6 }, (_, index) => <group key={index} rotation={[0, index * Math.PI / 3, 0]}>
        <Casting position={[107, 75, 0]} size={[19, 12, 20]} color="#718991" radius={3} />
      </group>)}
    </group>
    <group name="golf-clutch-cover" position={[0, offsets.cover, 0]}>
      <Turned profile={annulusProfile(107, 121, 40, 46)} color="#587886" />
      <Diaphragm />
      {Array.from({ length: 6 }, (_, index) => <group key={index} rotation={[0, index * Math.PI / 3, 0]}>
        <Shaft from={[113, 43, -15]} to={[121, 97, -15]} radius={6} color="#688894" />
        <Shaft from={[113, 43, 15]} to={[121, 97, 15]} radius={6} color="#688894" />
        <Casting position={[121, 98, 0]} size={[24, 4, 40]} radius={3} color="#688894" />
        <Shaft from={[123, 93, 0]} to={[123, 103, 0]} radius={4} color="#c0c9c3" />
      </group>)}
    </group>
    </group>
  </group>;
}