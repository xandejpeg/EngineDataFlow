import { Casting, Shaft, Turned } from './GolfPrimitives';

export function GolfCentreConsole() {
  return <group name="golf-centre-console" userData={{ dimensionalStatus: 'estimated', gearAndHandbrake: 'static-not-coupled-to-drivetrain' }}>
    <Casting position={[0, 440, 1050]} size={[240, 240, 660]} radius={20} color="#343b3f" />
    <Casting position={[0, 565, 984]} size={[174, 16, 191]} radius={7} color="#8f989c" />
    <Casting position={[0, 575, 984]} size={[157, 8, 174]} radius={6} color="#171e22" />
    <group name="golf-gear-lever" position={[0, 580, 984]}>
      <Turned profile={[[0, 0], [62, 0], [60, 10], [46, 20], [48, 27], [34, 38], [36, 45], [21, 59], [14, 66], [0, 66]]} color="#30373b" segments={24} />
      <Shaft from={[0, 55, 0]} to={[0, 102, -7]} radius={10} color="#7b8589" />
      <mesh position={[0, 117, -7]} scale={[1, 0.85, 1]}><sphereGeometry args={[30, 24, 16]} /><meshStandardMaterial color="#242b2f" roughness={0.7} /></mesh>
      <mesh position={[0, 140, -7]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[19, 32]} /><meshStandardMaterial color="#9da5a9" roughness={0.4} metalness={0.5} /></mesh>
    </group>
    <group name="golf-console-front-tray" position={[0, 578, 811]}>
      <Casting size={[171, 4, 90]} radius={2} color="#151d21" />
      {[-87, 87].map(axis => <Casting key={axis} position={[axis, 12, 0]} size={[8, 25, 99]} radius={2} color="#30383c" />)}
      {[-47, 47].map(depth => <Casting key={depth} position={[0, 12, depth]} size={[180, 25, 8]} radius={2} color="#30383c" />)}
    </group>
    <Shaft from={[-65, 575, 1288]} to={[-65, 614, 1125]} radius={16} color="#252c30" />
    <Shaft from={[-65, 614, 1125]} to={[-65, 617, 1110]} radius={10} color="#8d989e" />
    {[-52, 52].map(axis => <group key={axis} name={`golf-console-cup-${axis}`} position={[axis, 562, 1260]}>
      <Turned profile={[[0, 0], [37, 0], [38, 25], [32, 25], [30, 4], [0, 4]]} color="#171f23" />
    </group>)}
    <Casting position={[0, 610, 1390]} size={[186, 95, 168]} radius={10} color="#30383c" />
    <Casting position={[0, 664, 1390]} size={[215, 57, 200]} radius={18} color="#252c30" />
    <Casting position={[0, 688, 1390]} size={[175, 9, 160]} radius={3} color="#384044" />
  </group>;
}