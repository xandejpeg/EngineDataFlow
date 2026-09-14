import { useEffect, useMemo } from 'react';
import { createRimSpoke, RIM_SPOKE_COUNT } from './golfRimGeometry';
import { Ring, Shaft, Turned } from './GolfPrimitives';

export function GolfRimFace({ id }: { id: string }) {
  const spoke = useMemo(createRimSpoke, []);
  useEffect(() => () => spoke.dispose(), [spoke]);
  return <group name={`golf-rim-face-${id}`} userData={{ dimensionalStatus: 'estimated', reference: 'photo-guided-ten-spokes-not-selected-OE-wheel', spokes: RIM_SPOKE_COUNT }}>
    {Array.from({ length: RIM_SPOKE_COUNT }, (_, index) => <mesh key={index} name={`golf-rim-spoke-${id}-${index}`} geometry={spoke} rotation={[index * Math.PI * 2 / RIM_SPOKE_COUNT, 0, 0]} dispose={null}>
      <meshStandardMaterial color="#bac2c4" metalness={0.75} roughness={0.32} />
    </mesh>)}
    <group rotation={[0, 0, -Math.PI / 2]}>
      <Turned profile={[[0, 52], [60, 52], [74, 62], [74, 72], [64, 80], [34, 83], [0, 83]]} color="#aeb8bc" />
    </group>
    {Array.from({ length: 5 }, (_, index) => <group key={index} rotation={[(index * 2 + 0.5) * Math.PI * 2 / RIM_SPOKE_COUNT, 0, 0]}>
      <Shaft from={[79, 56, 0]} to={[81, 56, 0]} radius={11} color="#293237" />
      <mesh position={[82, 56, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[6, 6, 3, 6]} />
        <meshStandardMaterial color="#778287" metalness={0.7} roughness={0.45} />
      </mesh>
    </group>)}
    <Shaft from={[83, 0, 0]} to={[85, 0, 0]} radius={29} color="#253237" />
    <Ring position={[86, 0, 0]} radius={26} tube={1.6} rotation={[0, Math.PI / 2, 0]} color="#d5dcdd" />
    <group position={[87, 0, 0]}>
      <Shaft from={[0, 16, -13]} to={[0, -1, 0]} radius={1.7} color="#d5dcdd" />
      <Shaft from={[0, -1, 0]} to={[0, 16, 13]} radius={1.7} color="#d5dcdd" />
      <Shaft from={[0, 7, -20]} to={[0, -15, -11]} radius={1.7} color="#d5dcdd" />
      <Shaft from={[0, -15, -11]} to={[0, -3, 0]} radius={1.7} color="#d5dcdd" />
      <Shaft from={[0, -3, 0]} to={[0, -15, 11]} radius={1.7} color="#d5dcdd" />
      <Shaft from={[0, -15, 11]} to={[0, 7, 20]} radius={1.7} color="#d5dcdd" />
    </group>
  </group>;
}