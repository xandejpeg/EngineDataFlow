import { useMemo } from 'react';
import { Tube } from './GolfPrimitives';
import { LOOM_SHEATH_COLOR, wireColor, wireLabel } from './golfLoom';
import { WIRE_RADIUS } from './golfLoomBundles';
import { harnessLoom, type HarnessRoute } from './golfSensorHarness';

function Loom({ route }: { route: HarnessRoute }) {
  return <group name={`golf-harness-${route.id}`} userData={{ golfPart: route.part, code: route.code, colorName: wireLabel(route.code), kind: route.kind }}>
    <Tube points={route.points} radius={WIRE_RADIUS} color={wireColor(route.code)} />
  </group>;
}

export function GolfSensorHarness() {
  const { routes, bundles } = useMemo(() => harnessLoom(), []);
  return <group name="golf-sensor-harness" userData={{ colorStandard: 'convencao-din-vw-por-borne', factoryPinout: false, bundles: bundles.length }}>
    <group name="golf-harness-loom" userData={{ routing: 'corredores-ortogonais-prateleira-subida-e-espinha' }}>
      {bundles.map(bundle => <group key={bundle.id} name={`golf-harness-${bundle.id}`} userData={{ label: bundle.label, ways: bundle.members.length, members: bundle.members }}>
        {bundle.segments.map((segment, index) => <Tube key={index} points={segment.points} radius={segment.radius} color={LOOM_SHEATH_COLOR} opacity={0.62} />)}
      </group>)}
    </group>
    {routes.map(route => <Loom key={route.id} route={route} />)}
  </group>;
}
