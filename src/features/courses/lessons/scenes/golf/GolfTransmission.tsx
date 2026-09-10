import { Casting, Turned } from './GolfPrimitives';
import { GolfClutchSlave } from './GolfClutchSlave';
import { GolfClutchLever } from './GolfClutchLever';
import { GolfClutchBearing } from './GolfClutchBearing';
import { GolfInputShaft } from './GolfInputShaft';
import { GolfClutchHydraulics } from './GolfClutchHydraulics';
import { BELLHOUSING_MODEL, SLAVE_CYLINDER_MODEL } from './golfClutchReference';
import { GolfClutchPack } from './GolfClutchPack';
import type { MutableRefObject } from 'react';
import type { GolfClock } from './golfPhysics';
import { GolfGearboxInternals } from './GolfGearboxInternals';

export function GolfTransmission({ cutaway, housing = true, hydraulics = true, exploded = false, pack = true, clock, internals = true, selectedGear = 0 }: { cutaway: boolean; housing?: boolean; hydraulics?: boolean; exploded?: boolean; pack?: boolean; clock?: MutableRefObject<GolfClock>; internals?: boolean; selectedGear?: number }) {
  return <group name="golf-transmission">
    <group name="golf-gearbox" position={SLAVE_CYLINDER_MODEL.gearboxPosition}>
      <group name="golf-transmission-housing" visible={housing}>
        <group name="golf-bellhousing" rotation={BELLHOUSING_MODEL.rotation} userData={{ dimensionalStatus: BELLHOUSING_MODEL.dimensionalStatus }}><Turned profile={BELLHOUSING_MODEL.profile} opacity={cutaway ? 0.18 : 1} /></group>
        <Casting position={[-210, -20, 0]} size={[260, 285, 270]} radius={44} opacity={cutaway ? 0.12 : 1} />
        {[-100, 0, 100].map(depth => <Casting key={depth} position={[-210, -15, depth]} size={[285, 225, 9]} radius={3} opacity={cutaway ? 0.12 : 1} />)}
        <group position={[-100, -65, 200]} rotation={[0, 0, -Math.PI / 2]}><Turned profile={[[16, -65], [70, -65], [102, -20], [102, 20], [70, 65], [16, 65]]} opacity={cutaway ? 0.12 : 1} /></group>
      </group>
      <GolfClutchSlave />
      <GolfClutchLever />
      <GolfClutchBearing />
      <GolfInputShaft />
      {internals && <GolfGearboxInternals selected={selectedGear} />}
      {pack && <GolfClutchPack exploded={exploded} clock={clock} />}
    </group>
    {hydraulics && <GolfClutchHydraulics />}
  </group>;
}