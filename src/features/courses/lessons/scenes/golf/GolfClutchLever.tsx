import { useMemo } from 'react';
import * as THREE from 'three';
import { Shaft, Tube, Turned } from './GolfPrimitives';
import { CLUTCH_RELEASE_REFERENCE } from './golfClutchReference';
import { CLUTCH_LEVER_MODEL, CLUTCH_SPRING_MODEL, clutchLeverShape, clutchSpringPath } from './golfClutchGeometry';

function ContactSeat({ position, innerRadius, outerRadius }: { position: [number, number, number]; innerRadius: number; outerRadius: number }) {
  return <group position={position} rotation={[0, 0, -Math.PI / 2]}>
    <mesh><sphereGeometry args={[innerRadius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#788285" metalness={0.8} roughness={0.4} side={THREE.BackSide} /></mesh>
    <mesh><sphereGeometry args={[outerRadius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#788285" metalness={0.8} roughness={0.4} /></mesh>
    <Turned profile={[[innerRadius, 0], [outerRadius, 0], [outerRadius, 0.8], [innerRadius, 0.8], [innerRadius, 0]]} color="#788285" />
  </group>;
}

export function GolfClutchLever() {
  const shape = useMemo(clutchLeverShape, []);
  const springPath = useMemo(clutchSpringPath, []);
  const model = CLUTCH_LEVER_MODEL;
  return <group name="golf-clutch-release" userData={{ dimensionalStatus: model.dimensionalStatus, placementStatus: model.placementStatus, actuation: model.actuation }}>
    <group name="golf-clutch-lever" userData={{ sourceItem: CLUTCH_RELEASE_REFERENCE.releaseLever.item, sourceFigure: CLUTCH_RELEASE_REFERENCE.leverFigure }}>
      <mesh position={[model.plateBackX, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <extrudeGeometry args={[shape, { depth: model.plateThickness, bevelEnabled: true, bevelSize: 0.7, bevelThickness: 0.7, bevelSegments: 2, curveSegments: 24 }]} />
        <meshStandardMaterial color="#788285" metalness={0.8} roughness={0.4} />
      </mesh>
      {[-1, 1].map(side => <Tube key={side} points={[
        [model.plateBackX + model.plateThickness, 124, side * 8],
        [model.plateBackX + model.plateThickness, 75, side * 18],
        [model.plateBackX + model.plateThickness, 0, side * 26],
        [model.plateBackX + model.plateThickness, -70, side * 19],
        [model.plateBackX + model.plateThickness, -107, side * 12],
      ]} radius={2} color="#788285" />)}
      <group name="golf-clutch-plunger-seat" position={model.plungerContact}>
        <ContactSeat position={[0, 0, 0]} innerRadius={model.seatInnerRadius} outerRadius={model.seatOuterRadius} />
      </group>
      <group name="golf-clutch-pivot-seat" position={model.pivot}>
        <ContactSeat position={[0, 0, 0]} innerRadius={model.pivotSeatInnerRadius} outerRadius={model.pivotSeatOuterRadius} />
      </group>
      <group name="golf-clutch-retaining-spring" position={CLUTCH_SPRING_MODEL.position} userData={{
        sourceItem: CLUTCH_RELEASE_REFERENCE.retainingSpring.item,
        sourceFigure: CLUTCH_RELEASE_REFERENCE.leverFigure,
        dimensionalStatus: CLUTCH_SPRING_MODEL.dimensionalStatus,
        placementStatus: CLUTCH_SPRING_MODEL.placementStatus,
        actuation: CLUTCH_SPRING_MODEL.actuation,
        representation: 'bent-wire-retainer',
      }}>
        <Tube points={springPath} radius={CLUTCH_SPRING_MODEL.wireRadius} color="#737d80" />
      </group>
    </group>
    <group name="golf-clutch-ball-stud" userData={{ sourceItem: CLUTCH_RELEASE_REFERENCE.ballStud.item }}>
      <Shaft from={model.pivotBase} to={model.pivot} radius={4} />
      <group position={model.pivotBase} rotation={[0, 0, -Math.PI / 2]}>
        <Turned profile={[[0, -4], [9, -4], [9, 0], [5, 2], [5, 9], [0, 9]]} />
      </group>
      <mesh name="golf-clutch-pivot-center" position={model.pivot}><sphereGeometry args={[model.pivotRadius, 24, 16]} /><meshStandardMaterial color="#b6bdbd" roughness={0.25} metalness={0.85} /></mesh>
    </group>
  </group>;
}