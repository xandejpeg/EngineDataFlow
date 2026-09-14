import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { coolingSample, type GolfClock } from './golfPhysics';
import { COOLING_ROUTES, coolingRoutePoints } from './golfCoolingGeometry';

export function GolfCoolingFlow({ clock }: { clock: MutableRefObject<GolfClock> }) {
  const markers = useRef<(THREE.Group | null)[]>([]);
  const curves = useMemo(() => COOLING_ROUTES.map(route => new THREE.CatmullRomCurve3(coolingRoutePoints(route).map(point => new THREE.Vector3(...point)))), []);
  const phases = useRef(COOLING_ROUTES.map(() => 0));
  const previousTime = useRef(clock.current.cooling.elapsed);
  useFrame(() => {
    const sample = coolingSample(clock.current);
    const time = clock.current.cooling.elapsed;
    const delta = Math.max(0, time - previousTime.current);
    if (time < previousTime.current) phases.current.fill(0);
    previousTime.current = time;
    COOLING_ROUTES.forEach((route, index) => {
      const flow = ['upper', 'lower', 'radiator-core'].includes(route.id) ? sample.radiatorLpm : route.id.startsWith('heater') ? sample.heaterLpm : route.id === 'bypass' ? sample.bypassLpm : ['expansion', 'degassing'].includes(route.id) ? 0 : sample.pumpLpm;
      phases.current[index] = (phases.current[index] + flow * delta / 60) % 1;
      const marker = markers.current[index];
      if (!marker) return;
      marker.visible = flow > 0.001;
      marker.position.copy(curves[index].getPointAt(phases.current[index]));
      marker.userData.flowLpm = flow;
    });
  });
  return <group name="golf-coolant-flow-markers" userData={{ representation: 'flow-indicators-not-fluid-particles' }}>
    {COOLING_ROUTES.map((route, index) => <group key={route.id} name={`golf-coolant-flow-${route.id}`} position={coolingRoutePoints(route)[0]} ref={object => { markers.current[index] = object; }}>
      <mesh><sphereGeometry args={[Math.max(6, route.radius * 0.7), 10, 8]} /><meshBasicMaterial color={['lower', 'pump-feed', 'block-feed', 'heater-return'].includes(route.id) ? '#1cbddd' : '#eea13c'} depthTest={false} /></mesh>
    </group>)}
  </group>;
}