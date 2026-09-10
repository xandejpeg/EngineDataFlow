import { Turned } from './GolfPrimitives';
import { INPUT_SHAFT_MODEL, INPUT_SHAFT_REFERENCE, inputShaftProfile } from './golfInputShaftGeometry';

export function GolfInputShaft() {
  return <group name="golf-input-shaft" position={INPUT_SHAFT_MODEL.position} rotation={[0, 0, -Math.PI / 2]} userData={{
    representation: INPUT_SHAFT_MODEL.representation,
    dimensionalStatus: INPUT_SHAFT_MODEL.dimensionalStatus,
    placementStatus: INPUT_SHAFT_MODEL.placementStatus,
    actuation: INPUT_SHAFT_MODEL.actuation,
    splineStatus: INPUT_SHAFT_MODEL.splineStatus,
    sourceFigure: INPUT_SHAFT_REFERENCE.figure,
    splineCount: INPUT_SHAFT_REFERENCE.splineCount,
  }}>
    <Turned profile={inputShaftProfile()} color="#879396" />
    <group name="golf-input-shaft-start" position={[0, INPUT_SHAFT_MODEL.start, 0]} />
    <group name="golf-input-shaft-tip" position={[0, INPUT_SHAFT_MODEL.end, 0]} />
  </group>;
}