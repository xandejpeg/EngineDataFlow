import { Casting, Ring, Shaft, Tube, Turned } from './GolfPrimitives';
import { CLUTCH_HYDRAULICS, CLUTCH_PRESSURE_PATH, CLUTCH_SUPPLY_PATH } from './golfHydraulics';

export function GolfBrakeFluidReservoir() {
  return <group name="golf-brake-fluid-reservoir" position={CLUTCH_HYDRAULICS.reservoir}>
      <Casting size={[100, 70, 125]} radius={15} color="#dce5db" opacity={0.55} />
      <Casting position={[0, -14, 0]} size={[86, 30, 110]} radius={10} color="#d0b862" opacity={0.5} />
      <group position={[0, 38, 0]}><Turned profile={[[0, 0], [22, 0], [24, 5], [24, 15], [0, 15]]} color="#252a2c" /></group>
      <Shaft from={[0, -35, 0]} to={[0, -52, 0]} radius={6} color="#c7d1c8" />
    </group>;
}

export function GolfClutchHydraulics() {
  return <group name="golf-clutch-hydraulics" userData={{
    ...CLUTCH_HYDRAULICS,
    representation: 'static-topology',
    exactVehicleApplicationVerified: false,
  }}>
    <GolfBrakeFluidReservoir />
    <group name="golf-clutch-master" position={CLUTCH_HYDRAULICS.master} userData={{ visualReference: 'SACHS 6284 605 102; candidate only' }}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Turned profile={[[0, -85], [12, -85], [16, -70], [16, -12], [30, -8], [30, 0], [14, 4], [0, 4]]} color="#293032" />
        <Ring radius={27} tube={3} position={[0, -4, 0]} color="#343a39" />
        <Shaft from={[0, 0, 0]} to={[0, 55, 0]} radius={5} />
        <mesh position={[0, 55, 0]}><sphereGeometry args={[8, 16, 10]} /><meshStandardMaterial color="#8c969c" metalness={0.7} roughness={0.35} /></mesh>
      </group>
      <Casting position={[17, -12, -40]} size={[16, 24, 45]} color="#282e30" radius={3} />
      <Casting position={[26, -12, -40]} size={[12, 15, 20]} color="#444d4e" radius={2} />
      <Tube points={[[0, 0, -45], [22, 8, -45], [24, 24, -45]]} radius={6} color="#d4dbd1" />
      <group name="golf-clutch-pedal-bracket" position={[0, 0, 18]}>
        {[-32, 32].map(side => <Casting key={side} position={[side, -38, 28]} size={[6, 126, 95]} radius={3} color="#50595c" />)}
        <Casting position={[0, 20, 0]} size={[76, 8, 100]} radius={2} color="#50595c" />
        <Shaft from={[-40, 0, 55]} to={[40, 0, 55]} radius={7} />
      </group>
      <group name="golf-clutch-pedal" position={[0, 0, 73]}>
        <Tube points={[[0, 0, 0], [0, -60, 0], [0, -150, 50], [0, -210, 105]]} radius={9} color="#50595c" />
        <Shaft from={[0, 0, -18]} to={[0, -35, 0]} radius={5} />
        <Casting position={[0, -210, 105]} size={[65, 65, 14]} radius={5} color="#252b2c" />
        {[-22, -11, 0, 11, 22].map(rib => <Casting key={rib} position={[0, -210 + rib, 114]} size={[55, 4, 3]} radius={0.8} color="#505759" />)}
      </group>
    </group>
    <group name="golf-clutch-supply-line"><Tube points={CLUTCH_SUPPLY_PATH} radius={5} color="#343e3e" /></group>
    <group name="golf-clutch-pressure-line"><Tube points={CLUTCH_PRESSURE_PATH} radius={3} color="#929d9c" /></group>
    {CLUTCH_PRESSURE_PATH.slice(2, 5).map((position, index) => <group key={index} position={position} name={`golf-clutch-line-retainer-${index}`}>
      <Casting size={[13, 12, 10]} radius={2} color="#303637" />
    </group>)}
  </group>;
}