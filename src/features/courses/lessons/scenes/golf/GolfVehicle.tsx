import { type MutableRefObject } from 'react';
import { type GolfClock } from './golfPhysics';
import type { BodyMode } from './golfAssembly';
import { GolfStructure } from './GolfFrontStructure';
import { VEHICLE_WHEELS } from './golfVehicleGeometry';
import { GolfCabin, GolfExteriorDetails } from './GolfCabin';
import { GolfChassis } from './GolfChassis';
import { GolfBodyShell } from './GolfBodyShell';
import { GolfWheel } from './GolfWheel';
import { GolfWiperSystem } from './GolfWiperSystem';
import type { BrakeState } from './golfBrakeHydraulics';
import { GolfBodyDetails } from './GolfBodyDetails';
import { GolfDoors } from './GolfDoors';
import type { BodyControlState } from './golfBodyControl';
import { GolfExteriorFinish, GolfUnderbodyFinish } from './GolfExteriorFinish';
import { allSystems, type SystemFlags } from './golfSystemToggles';

const ALL_ON = allSystems(true);

export function GolfVehicle({ mode, clock, wheelsMounted = true, brakes, bodyControl, show = ALL_ON }: { mode: BodyMode; clock: MutableRefObject<GolfClock>; wheelsMounted?: boolean; brakes: MutableRefObject<BrakeState>; bodyControl: MutableRefObject<BodyControlState>; show?: SystemFlags }) {
  const ghost = mode === 'ghost' || mode === 'assembly';
  return <group name="golf-vehicle" visible={mode !== 'cutaway'}>
    <group name="golf-system-structure" visible={show.structure}><GolfStructure opacity={ghost ? 0.12 : 1} cabin={mode !== 'solid'} /></group>
    <group name="golf-system-interior" visible={show.interior}><GolfCabin clock={clock} instruments={show.instruments} /></group>
    <GolfChassis brakes={brakes} clock={clock} show={show} />
    {mode === 'solid' && <group name="golf-system-underbody" visible={show.bodywork}><GolfUnderbodyFinish /></group>}
    <group name="golf-system-wipers" visible={show.wipers}><GolfWiperSystem clock={clock} /></group>
    <group name="golf-system-wheels" visible={show.wheels}>
      {VEHICLE_WHEELS.map(wheel => <GolfWheel key={wheel.id} location={wheel} clock={clock} mounted={wheelsMounted} brakes={brakes} />)}
    </group>
    <group name="golf-body-panels" visible={mode !== 'assembly' && show.bodywork}>
    <GolfExteriorDetails ghost={ghost} />
    <GolfExteriorFinish ghost={ghost} />
    <GolfBodyShell ghost={ghost} bodyControl={bodyControl} />
    <GolfDoors ghost={ghost} bodyControl={bodyControl} />
    <GolfBodyDetails ghost={ghost} bodyControl={bodyControl} clock={clock} brakes={brakes} />
    </group>
  </group>;
}