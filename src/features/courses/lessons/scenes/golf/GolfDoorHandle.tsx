import { BODY_FINISH } from './golfBodyGeometry';
import { Casting, Tube } from './GolfPrimitives';

export function GolfDoorHandle({ side, opacity }: { side: number; opacity: number }) {
  return <group>
    <mesh position={[side * 2, -2, 0]} scale={[5, 23, 73]}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshStandardMaterial color="#687372" roughness={0.5} transparent={opacity < 1} opacity={opacity} />
    </mesh>
    <Tube points={[[side * 5, 7, -62], [side * 20, 9, -38], [side * 23, 9, 27], [side * 10, 7, 47]]} radius={9} color={BODY_FINISH.paint} opacity={opacity} />
    <Casting position={[side * 7, 7, 62]} size={[16, 23, 24]} radius={6} color={BODY_FINISH.paint} opacity={opacity} />
  </group>;
}