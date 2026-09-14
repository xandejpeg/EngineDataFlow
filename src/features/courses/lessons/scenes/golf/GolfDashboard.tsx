import { useEffect, useMemo, type MutableRefObject } from 'react';
import type { GolfClock } from './golfPhysics';
import { Casting, Ring, Shaft, Tube } from './GolfPrimitives';
import { createDashboardGeometry } from './golfCockpitGeometry';
import { GolfCockpitInstruments } from './GolfCockpitInstruments.tsx';
import { GolfFuelGauge } from './GolfFuelGauge';

function Vent({ position, width = 120 }: { position: [number, number, number]; width?: number }) {
  return <group position={position}>
    <Casting size={[width + 14, 67, 12]} radius={6} color="#626c70" />
    <Casting position={[0, 0, 8]} size={[width, 55, 8]} radius={5} color="#10171b" />
    {[-18, -6, 6, 18].map(height => <Casting key={height} position={[0, height, 15]} size={[width - 8, 3, 7]} radius={1} color="#414b4e" />)}
    <Casting position={[15, 0, 20]} size={[21, 9, 9]} radius={2} color="#a3abae" />
  </group>;
}

export function GolfDashboard({ clock, instruments = true }: { clock: MutableRefObject<GolfClock>; instruments?: boolean }) {
  const geometry = useMemo(createDashboardGeometry, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group name="golf-dashboard" userData={{ dimensionalStatus: 'estimated', radioClimate: 'static-trim-only' }}>
    <mesh name="golf-dashboard-shell" geometry={geometry} dispose={null}><meshStandardMaterial color="#292e32" roughness={0.88} /></mesh>
    <Tube points={[[-635, 820, 803], [-360, 846, 860], [-180, 844, 869], [0, 841, 878], [350, 840, 853], [635, 819, 803]]} radius={3} color="#979f9f" />
    <Casting position={[-390, 959, 876]} size={[334, 154, 16]} radius={18} color="#12191d" />
    <Casting position={[-390, 1034, 821]} size={[365, 27, 163]} radius={10} color="#242b2e" />
    {[-564, -216].map(axis => <Casting key={axis} position={[axis, 977, 852]} size={[18, 105, 81]} radius={7} color="#242b2e" />)}
    <group name="golf-system-instruments" visible={instruments}><GolfCockpitInstruments clock={clock} /><GolfFuelGauge clock={clock} /></group>
    <Vent position={[-600, 880, 820]} width={100} /><Vent position={[600, 880, 820]} width={100} />
    <group name="golf-centre-stack" position={[0, 0, 0]}>
      <Casting position={[0, 798, 863]} size={[286, 300, 28]} radius={10} color="#515b60" />
      <Vent position={[-67, 916, 878]} width={107} /><Vent position={[67, 916, 878]} width={107} />
      <Casting position={[0, 813, 883]} size={[245, 110, 12]} radius={5} color="#141c21" />
      <Casting position={[0, 824, 893]} size={[165, 46, 4]} radius={2} color="#233c45" />
      {[-100, 100].map(axis => <Shaft key={axis} from={[axis, 790, 894]} to={[axis, 790, 906]} radius={12} color="#8b969b" />)}
      {[-60, -30, 0, 30, 60].map(axis => <Casting key={axis} position={[axis, 781, 895]} size={[22, 10, 6]} radius={2} color="#39464c" />)}
      <Casting position={[0, 711, 885]} size={[245, 75, 13]} radius={6} color="#1e272c" />
      {[-76, 0, 76].map(axis => <group key={axis} position={[axis, 714, 899]}>
        <Ring radius={24} tube={2.5} rotation={[0, 0, 0]} color="#9ea7aa" />
        <Shaft from={[0, 0, 0]} to={[0, 0, 12]} radius={20} color="#242c30" />
        <Casting position={[0, 13, 15]} size={[3, 9, 3]} radius={1} color="#e2e5dc" />
      </group>)}
      <Casting position={[0, 650, 903]} size={[220, 35, 70]} radius={6} color="#182125" />
    </group>
    <group name="golf-glovebox" position={[422, 752, 840]} userData={{ opening: 'not-simulated' }}>
      <Casting size={[388, 153, 26]} radius={12} color="#3b4246" />
      <Casting position={[0, 57, 18]} size={[350, 3, 3]} radius={1} color="#171e21" />
      <Casting position={[-15, 37, 21]} size={[92, 17, 12]} radius={4} color="#20282c" />
      <Casting position={[-15, 40, 28]} size={[68, 4, 3]} radius={1} color="#a4acae" />
    </group>
    {[-1, 1].map(side => <group key={side} position={[side * 435, 973, 500]} rotation={[-Math.PI / 2, 0, 0]}>
      <Casting size={[270, 22, 7]} radius={3} color="#131c20" />
      {[-8, 0, 8].map(height => <Casting key={height} position={[0, height, 5]} size={[252, 2, 4]} radius={0.5} color="#414b4e" />)}
    </group>)}
  </group>;
}