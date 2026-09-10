import { useState } from 'react';
import { TEST_POINTS, testPoint, type ServiceArea } from './golfService';
import { Shaft, Tube } from './GolfPrimitives';

export function GolfTestPoints({ area, red, black, select }: { area: ServiceArea; red: string; black: string; select: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return <group name="golf-test-points">
    {TEST_POINTS.filter(point => point.area === area).map(point => <group key={point.id} position={point.position} name={`testpoint-${point.id}`} userData={{ testPoint: point.id }}>
      <mesh onClick={event => { event.stopPropagation(); select(point.id); }} onPointerOver={event => { event.stopPropagation(); setHovered(point.id); }} onPointerOut={() => setHovered(null)}>
        <sphereGeometry args={[4.5, 12, 8]} /><meshStandardMaterial color={point.id === red ? '#d54944' : point.id === black ? '#263538' : '#d8b762'} emissive={hovered === point.id ? '#ad8a36' : '#000000'} />
      </mesh>
    </group>)}
    {([{ id: red, color: '#b73534', offset: -14 }, { id: black, color: '#253134', offset: 14 }]).map(probe => {
      const point = testPoint(probe.id);
      if (!point || point.area !== area) return null;
      return <group key={probe.color} position={point.position} name={`golf-probe-${probe.offset < 0 ? 'red' : 'black'}`}>
        <Shaft from={[0, 0, 0]} to={[probe.offset, 24, 0]} radius={0.9} color="#c1c9c8" />
        <Shaft from={[probe.offset, 24, 0]} to={[probe.offset * 2, 48, 0]} radius={3.3} color={probe.color} />
        <Tube points={[[probe.offset * 2, 48, 0], [probe.offset * 3, 65, 20], [probe.offset * 5, 35, 70]]} radius={1.5} color={probe.color} />
      </group>;
    })}
  </group>;
}