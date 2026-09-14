import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Connector, Ring, Shaft, Tube } from './GolfPrimitives';
import { COOLING_PORTS, COOLING_ROUTES, coolingRoutePoints } from './golfCoolingGeometry';
import { coolingSample, type GolfClock } from './golfPhysics';
import { COOLING_MODEL } from './golfCooling';
import { GolfCoolingFlow } from './GolfCoolingFlow';
import { GolfWasherAssembly } from './GolfWasherAssembly';

const ESTIMATED = { dimensionalStatus: 'estimated', applicationStatus: 'generic-not-oe-selected', fluidSimulation: false };

export function GolfAuxiliaries({ clock, coolingOnly = false }: { clock: MutableRefObject<GolfClock>; coolingOnly?: boolean }) {
  const fan = useRef<THREE.Group>(null);
  const thermostat = useRef<THREE.Group>(null);
  const pump = useRef<THREE.Group>(null);
  useFrame(() => {
    if (fan.current) fan.current.rotation.z = clock.current.cooling.fanAngle;
    if (thermostat.current) thermostat.current.position.y = coolingSample(clock.current).thermostat * 18;
    if (pump.current) pump.current.rotation.x = clock.current.cooling.flowLitres * 2;
  });
  return <group name="golf-auxiliaries" userData={ESTIMATED}>
    <group name="golf-cooling-system" userData={{ ...ESTIMATED, fluidSimulation: 'lumped-thermal', ...COOLING_MODEL }}>
      <group name="golf-radiator">
        <Casting position={[0, 540, -780]} size={[650, 410, 26]} color="#546e76" opacity={coolingOnly ? 0.2 : 1} />
        {Array.from({ length: 26 }, (_, index) => <Casting key={index} position={[0, 345 + index * 15, -796]} size={[620, 3, 8]} color="#a1b1af" radius={0.8} />)}
        {[-1, 1].map(side => <group key={side}>
          <Casting position={[side * 332, 540, -780]} size={[35, 440, 45]} color="#273b42" radius={8} />
          <Casting position={[side * 285, 318, -780]} size={[50, 35, 65]} color="#24343b" radius={6} />
          <Shaft from={[side * 315, 755, -780]} to={[side * 395, 755, -780]} radius={9} />
        </group>)}
        <Ring position={[0, 540, -720]} radius={207} tube={12} rotation={[0, 0, 0]} color="#273b42" />
        <Shaft from={[-310, 540, -710]} to={[310, 540, -710]} radius={8} color="#273b42" />
        <Shaft from={[0, 330, -710]} to={[0, 750, -710]} radius={8} color="#273b42" />
        <group position={[0, 540, -738]} ref={fan} name="golf-cooling-fan">
          {Array.from({ length: 8 }, (_, blade) => <group key={blade} rotation={[0, 0, blade * Math.PI / 4]}><Casting position={[0, 115, 0]} size={[60, 165, 12]} radius={4} color="#2c373a" /></group>)}
          <Shaft from={[0, 0, -20]} to={[0, 0, 25]} radius={45} color="#465e69" />
        </group>
      </group>
      <group name="golf-expansion-tank" position={[420, 780, 140]}>
        <mesh scale={[1, 0.8, 0.8]}><sphereGeometry args={[84, 24, 16]} /><meshStandardMaterial color="#d4e2d4" transparent opacity={0.42} roughness={0.3} depthWrite={false} /></mesh>
        <mesh position={[0, -24, 0]}><cylinderGeometry args={[68, 56, 40, 24]} /><meshStandardMaterial color="#be5079" transparent opacity={0.65} /></mesh>
        <Ring radius={83} tube={3} color="#afc2bb" />
        <Shaft from={[0, 56, 0]} to={[0, 83, 0]} radius={29} color="#255d83" />
        <Casting position={[72, -15, 0]} size={[20, 65, 25]} color="#b4c6ba" radius={5} />
        <group position={[50, -48, 0]}><Connector pins={2} /></group>
      </group>
      <group name="golf-thermostat" position={COOLING_PORTS.thermostat}>
        <Casting size={[75, 65, 70]} radius={12} color="#4b626c" opacity={coolingOnly ? 0.2 : 1} />
        <group ref={thermostat} name="golf-thermostat-valve"><Shaft from={[0, -6, 0]} to={[0, 6, 0]} radius={22} color="#c5a55a" /></group>
        <group visible={!coolingOnly}><Shaft from={[-40, 0, 0]} to={[40, 0, 0]} radius={23} /></group>
        <group position={[0, 42, 0]}><Connector pins={4} /></group>
      </group>
      <group name="golf-coolant-head-flange" position={COOLING_PORTS.headOutlet}>
        <Casting size={[75, 42, 38]} radius={6} color="#354e59" />
        <Shaft from={[-40, 0, 0]} to={[40, 0, 0]} radius={17} />
      </group>
      {COOLING_ROUTES.map(route => <group key={route.id} name={`golf-coolant-${route.id}`} visible={coolingOnly || !['water-jacket', 'radiator-core', 'heater-core'].includes(route.id)} userData={{ representation: ['water-jacket', 'radiator-core', 'heater-core'].includes(route.id) ? 'schematic-internal-path' : 'estimated-hose' }}>
        <Tube points={coolingRoutePoints(route)} radius={route.radius} color={['water-jacket', 'radiator-core', 'heater-core'].includes(route.id) ? '#ac8750' : '#293e47'} />
        {[COOLING_PORTS[route.from], COOLING_PORTS[route.to]].map((position, index) => <mesh key={index} position={position}><sphereGeometry args={[route.radius + 2, 12, 8]} /><meshStandardMaterial color="#a2b4b3" metalness={0.75} roughness={0.4} /></mesh>)}
      </group>)}
      <group name="golf-water-pump" position={COOLING_PORTS.pumpInlet}>
        <group visible={!coolingOnly}><Shaft from={[-20, 0, 0]} to={[35, 0, 0]} radius={42} color="#82999f" /></group>
        <group ref={pump} name="golf-water-pump-impeller">{Array.from({ length: 6 }, (_, index) => <group key={index} rotation={[index * Math.PI / 3, 0, 0]}><Casting position={[15, 22, 0]} size={[12, 36, 7]} radius={2} color="#8da8b0" /></group>)}</group>
        <Shaft from={[-30, 0, 0]} to={[-20, 0, 0]} radius={48} color="#344b57" />
        {[-25, 25].map(height => <Shaft key={height} from={[34, height, 20]} to={[40, height, 20]} radius={5} />)}
      </group>
      {coolingOnly && <><GolfCoolingFlow clock={clock} /><Casting position={[0, 670, 470]} size={[145, 90, 45]} color="#9bada8" opacity={0.2} /></>}
    </group>
    <group visible={!coolingOnly}>
    <group name="golf-climate-system" userData={{ ...ESTIMATED, actuation: 'not-simulated' }}>
      <group name="golf-condenser">
        <Casting position={[0, 535, -818]} size={[600, 360, 14]} color="#647a80" />
        {Array.from({ length: 22 }, (_, index) => <Casting key={index} position={[0, 365 + index * 16, -828]} size={[580, 3, 5]} color="#afbeb9" radius={0.6} />)}
        <Shaft from={[312, 375, -820]} to={[312, 690, -820]} radius={18} color="#8ea6aa" />
      </group>
      <group name="golf-ac-compressor" position={[330, 330, -235]}>
        <Shaft from={[-55, 0, 0]} to={[65, 0, 0]} radius={52} color="#899fa6" />
        <Shaft from={[66, 0, 0]} to={[83, 0, 0]} radius={56} color="#314952" />
        <Casting position={[0, 48, 0]} size={[80, 30, 65]} color="#748f99" />
        <group position={[-40, 50, 0]}><Connector pins={2} /></group>
      </group>
      <Tube points={[[330, 375, -235], [410, 370, -380], [395, 410, -660], [312, 410, -820]]} radius={7} color="#9db3b5" />
      <Tube points={[[312, 675, -820], [480, 740, -570], [470, 760, 100], [150, 740, 450]]} radius={6} color="#9db3b5" />
      <Tube points={[[100, 760, 450], [300, 730, 330], [480, 590, 100], [410, 390, -200], [340, 380, -235]]} radius={12} color="#293f49" />
      <group name="golf-hvac-unit" position={[0, 690, 535]}>
        <Casting size={[330, 280, 145]} radius={22} color="#293e47" />
        <Casting position={[0, -10, -76]} size={[215, 140, 14]} radius={3} color="#9bada8" />
        <Casting position={[130, 60, -80]} size={[65, 45, 24]} radius={4} color="#a8b7b4" />
        <Shaft from={[190, 30, 0]} to={[320, 30, 0]} radius={94} color="#364f59" />
        <Tube points={[[0, 130, 0], [0, 185, 95], [0, 200, 205]]} radius={43} color="#293e47" />
        {[-1, 1].map(side => <Tube key={side} points={[[side * 140, 90, 0], [side * 290, 150, 110], [side * 560, 180, 240]]} radius={28} color="#293e47" />)}
      </group>
    </group>
    <group name="golf-powertrain-mounts" userData={{ ...ESTIMATED, stiffness: 'not-simulated' }}>
      {[-1, 1].map(side => <group key={side} name={`golf-powertrain-mount-${side}`} position={[side * 430, 550, -55]}>
        <Casting size={[125, 18, 135]} color="#8fa4aa" />
        <Shaft from={[0, 9, 0]} to={[0, 70, 0]} radius={45} color="#2e4148" />
        <Casting position={[0, 76, 0]} size={[90, 18, 90]} color="#a7b6b6" />
        <Shaft from={[0, 82, 0]} to={[-side * 130, 35, 0]} radius={22} color="#859ba3" />
        {[-42, 42].map(offset => <Shaft key={offset} from={[offset, -10, 45]} to={[offset, 16, 45]} radius={6} />)}
        <Shaft from={[0, 0, 0]} to={[0, -130, 0]} radius={18} color="#849b9f" />
      </group>)}
      <Shaft from={[0, 275, 295]} to={[-230, 300, 130]} radius={24} color="#81989e" />
      <Ring position={[-230, 300, 130]} radius={30} tube={10} color="#283d45" />
    </group>
    <GolfWasherAssembly />
    </group>
  </group>;
}