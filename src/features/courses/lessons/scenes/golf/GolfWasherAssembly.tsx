import { Casting, Shaft, Tube } from './GolfPrimitives';

export function GolfWasherAssembly() {
  return <group name="golf-washer-system" userData={{ dimensionalStatus: 'estimated', applicationStatus: 'generic-not-oe-selected', fluidSimulation: false }}>
    <Casting position={[600, 510, -475]} size={[150, 230, 170]} radius={24} color="#bbcfc8" opacity={0.7} />
    <Tube points={[[600, 610, -475], [610, 735, -410], [610, 810, -370]]} radius={24} color="#baccc7" />
    <Shaft from={[610, 805, -370]} to={[610, 821, -370]} radius={34} color="#28789a" />
    <group name="golf-washer-pump" position={[525, 475, -470]}><Shaft from={[0, -40, 0]} to={[0, 15, 0]} radius={17} color="#283c46" /></group>
    <Tube points={[[525, 475, -470], [560, 800, -330], [560, 940, 400], [0, 960, 460]]} radius={3} color="#293e47" />
  </group>;
}