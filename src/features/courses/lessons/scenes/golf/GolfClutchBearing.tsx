import { useMemo } from 'react';
import * as THREE from 'three';
import { Casting, Ring, Turned } from './GolfPrimitives';
import { CLUTCH_RELEASE_REFERENCE } from './golfClutchReference';
import { CLUTCH_BEARING_MODEL, GUIDE_FIXING_MODEL, bearingCarrierProfile, bearingFaceProfile, guideFixingBoltProfile, guideFixingEarProfile, guideSleeveProfile } from './golfClutchBearingGeometry';

export function GolfClutchBearing() {
  const carrier = useMemo(() => bearingCarrierProfile().map(point => new THREE.Vector2(...point)), []);
  const model = CLUTCH_BEARING_MODEL;
  return <group name="golf-clutch-bearing-assembly" position={model.position} userData={{ dimensionalStatus: model.dimensionalStatus, placementStatus: model.placementStatus, actuation: model.actuation, inputShaftStatus: model.inputShaftStatus }}>
    <group name="golf-clutch-guide" rotation={[0, 0, -Math.PI / 2]} userData={{ sourceItem: CLUTCH_RELEASE_REFERENCE.guideSleeve.item, sourceFigure: CLUTCH_RELEASE_REFERENCE.figure }}>
      <Turned profile={guideSleeveProfile()} color="#a0a9aa" />
      <Ring position={[0, model.guideStart, 0]} radius={20} tube={1} color="#303537" />
      {GUIDE_FIXING_MODEL.offsets.map(offset => <group name={`golf-clutch-guide-fixing-${offset}`} key={offset} position={[offset, model.guideStart, 0]} userData={{
        sourceItem: CLUTCH_RELEASE_REFERENCE.guideSleeve.boltItem,
        sourceFigure: CLUTCH_RELEASE_REFERENCE.figure,
        dimensionalStatus: GUIDE_FIXING_MODEL.dimensionalStatus,
        placementStatus: GUIDE_FIXING_MODEL.placementStatus,
        actuation: GUIDE_FIXING_MODEL.actuation,
        threadSpecification: GUIDE_FIXING_MODEL.threadSpecification,
        tighteningTorqueNm: GUIDE_FIXING_MODEL.tighteningTorqueNm,
      }}>
        <group name="golf-clutch-guide-ear"><Turned profile={guideFixingEarProfile()} color="#a0a9aa" /></group>
        <group name="golf-clutch-guide-bolt"><Turned profile={guideFixingBoltProfile()} color="#6d777a" segments={24} /></group>
      </group>)}
    </group>
    <group name="golf-clutch-bearing" userData={{ sourceItem: CLUTCH_RELEASE_REFERENCE.releaseBearing.item, sourceFigure: CLUTCH_RELEASE_REFERENCE.figure }}>
      <group rotation={[0, 0, -Math.PI / 2]}>
        <mesh name="golf-clutch-bearing-carrier"><latheGeometry args={[carrier, 48]} /><meshStandardMaterial color="#343c3e" roughness={0.8} metalness={0.05} /></mesh>
        <group name="golf-clutch-bearing-face"><Turned profile={bearingFaceProfile()} color="#b6bebf" /></group>
        <Ring position={[0, model.faceStart + 1, 0]} radius={31} tube={0.5} color="#515c60" />
      </group>
      {model.clipOffsets.map(offset => <group name={`golf-clutch-bearing-clip-${offset}`} key={offset} position={[-1, 0, offset]}>
        <Casting size={[14, 10, 3]} radius={1} color="#41494b" />
        <Casting position={[-5, 0, 0]} size={[3, 10, 10]} radius={1} color="#41494b" />
      </group>)}
    </group>
  </group>;
}