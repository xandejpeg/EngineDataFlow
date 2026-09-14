import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BODY_FINISH, bodyHalfWidth } from './golfBodyGeometry';
import { BODY_TOP } from './golfVehicleGeometry';
import { Casting, Shaft, Tube } from './GolfPrimitives';
import { commandHood, commandProp, type BodyControlState } from './golfBodyControl';
import { HATCH_ANGLE, HATCH_PIVOT, HOOD_ANGLE, HOOD_PIVOT, hatchStrutEndpoints, hoodPropEndpoints } from './golfBodyWiring.ts';
import { hoodPanelPoint, hoodSplitAt, rearPanelSplit, HOOD_GAP, HOOD_SPLIT } from './golfBodyFit';
import { cabinPanelPoint } from './golfCabinSurface';
import { REAR_HATCH_ROWS, rearSectionPoint } from './golfRearSurface';

type Section = [depth: number, height: number, halfWidth: number, crown: number];

function Panel({ sections, glass = false, ghost, from = -1, to = 1, hood = false, rear = false, cabin, name }: { sections: Section[]; glass?: boolean; ghost: boolean; from?: number; to?: number; hood?: boolean; rear?: boolean; cabin?: 'roof' | 'windshield'; name?: string }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    sections.forEach(([depth, height, halfWidth, crown], row) => {
      const boundary = (value: number) => Math.abs(value) === 1 ? value : hood ? Math.sign(value) * (hoodSplitAt(depth) + Math.abs(value) - HOOD_SPLIT) : rear ? Math.sign(value) * (rearPanelSplit(height) + Math.abs(value) - 0.7) : value;
      const rowFrom = boundary(from);
      const rowTo = boundary(to);
      for (let column = 0; column <= 16; column++) {
        const across = rowFrom + column / 16 * (rowTo - rowFrom);
        positions.push(...(hood ? hoodPanelPoint(across, depth, height) : cabin ? cabinPanelPoint(cabin, across, depth, height) : rear ? rearSectionPoint(across, depth, height, crown) : [across * halfWidth, height + (1 - across * across) * crown, depth]));
        if (row < sections.length - 1 && column < 16) {
          const base = row * 17 + column;
          indices.push(base, base + 17, base + 1, base + 1, base + 17, base + 18);
        }
      }
    });
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, [sections, from, to, hood, rear, cabin]);
  const opacity = ghost ? glass ? 0.04 : 0.065 : glass ? 0.3 : 1;
  return <mesh name={name} geometry={geometry}>
    <meshStandardMaterial color={glass ? BODY_FINISH.glass : BODY_FINISH.paint} metalness={glass ? 0.2 : 0.35} roughness={glass ? 0.16 : 0.3} side={THREE.DoubleSide} transparent={opacity < 1} opacity={glass && !ghost ? 0.82 : opacity} depthWrite={opacity === 1} />
  </mesh>;
}

function PanelSupport({ bodyControl, side }: { bodyControl: MutableRefObject<BodyControlState>; side?: number }) {
  const root = useRef<THREE.Group>(null);
  const barrel = useRef<THREE.Mesh>(null);
  const rod = useRef<THREE.Mesh>(null);
  const tipJoint = useRef<THREE.Mesh>(null);
  const direction = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));
  useFrame(() => {
    const endpoints = side === undefined ? hoodPropEndpoints(bodyControl.current) : hatchStrutEndpoints(side, bodyControl.current.hatch);
    if (!root.current || !rod.current || !tipJoint.current) return;
    const { base, tip, length } = endpoints;
    root.current.position.fromArray(base);
    direction.current.fromArray(tip).sub(new THREE.Vector3(...base));
    root.current.quaternion.setFromUnitVectors(up.current, direction.current.normalize());
    const barrelLength = side === undefined ? 0 : 145;
    rod.current.position.y = barrelLength + (length - barrelLength) / 2;
    rod.current.scale.y = length - barrelLength;
    if (barrel.current) { barrel.current.position.y = barrelLength / 2; barrel.current.scale.y = barrelLength; }
    tipJoint.current.position.y = length;
    Object.assign(root.current.userData, { base: [...base], tip: [...tip], length, coordinateSpace: 'vehicle-local', deployed: side === undefined ? bodyControl.current.prop : undefined, support: side === undefined ? 'manual-prop-rod' : 'telescoping-gas-strut' });
  });
  return <group ref={root} name={side === undefined ? 'golf-hood-prop' : `golf-hatch-strut-${side < 0 ? 'left' : 'right'}`} onClick={event => {
    if (side !== undefined) return;
    event.stopPropagation(); bodyControl.current = commandProp(bodyControl.current, !bodyControl.current.prop);
  }}>
    <mesh name="base-joint"><sphereGeometry args={[10, 12, 8]} /><meshStandardMaterial color="#969da2" /></mesh>
    {side !== undefined && <mesh ref={barrel} name="barrel"><cylinderGeometry args={[11, 11, 1, 12]} /><meshStandardMaterial color="#252b2c" metalness={0.5} roughness={0.4} /></mesh>}
    <mesh ref={rod} name="rod"><cylinderGeometry args={[side === undefined ? 6 : 5, side === undefined ? 6 : 5, 1, 12]} /><meshStandardMaterial color={side === undefined ? '#dcc06b' : '#ccd4d8'} metalness={0.7} roughness={0.3} /></mesh>
    <mesh ref={tipJoint} name="tip-joint"><sphereGeometry args={[9, 12, 8]} /><meshStandardMaterial color="#9a9e9c" /></mesh>
  </group>;
}

export function GolfBodyShell({ ghost, bodyControl }: { ghost: boolean; bodyControl: MutableRefObject<BodyControlState> }) {
  const hood = useRef<THREE.Group>(null);
  const hatch = useRef<THREE.Group>(null);
  useFrame(() => {
    if (hood.current) { hood.current.rotation.x = bodyControl.current.hood * HOOD_ANGLE; Object.assign(hood.current.userData, { open: bodyControl.current.hood, released: bodyControl.current.hoodReleased, support: bodyControl.current.prop ? 'prop' : 'manual-hold-idealization' }); }
    if (hatch.current) { hatch.current.rotation.x = bodyControl.current.hatch === 0 ? 0 : bodyControl.current.hatch * HATCH_ANGLE; hatch.current.userData.open = bodyControl.current.hatch; }
  });
  const sections = (rows: [number, number][], crown: number): Section[] => rows.map(([depth, height]) => [depth, height, bodyHalfWidth(height, depth), crown]);
  return <group name="golf-body-shell" userData={{ dimensionalStatus: 'estimated' }}>
    <group ref={hood} name="golf-hood-motion" position={HOOD_PIVOT} onClick={event => { event.stopPropagation(); const state = bodyControl.current; if (state.hoodReleased) bodyControl.current = commandHood(state, state.hoodTarget === 0); }}>
      <group position={[0, -HOOD_PIVOT[1], -HOOD_PIVOT[2]]}>
        <Panel name="golf-hood-skin" ghost={ghost} hood from={-HOOD_SPLIT + HOOD_GAP} to={HOOD_SPLIT - HOOD_GAP} sections={sections(BODY_TOP.hood, 14)} />
        <group name="golf-hood-inner-reinforcement">
          {[-1, 1].map(side => <Tube key={side} points={BODY_TOP.hood.filter((_, index) => [4, 14, 24].includes(index)).map(([depth, height]) => {
            const point = hoodPanelPoint(side * hoodSplitAt(depth) * 0.8, depth, height);
            return [point[0], point[1] - 18, point[2]];
          })} radius={13} color="#596369" opacity={ghost ? 0.4 : 1} />)}
          <Tube points={[[-400, 890, -360], [0, 908, -360], [400, 890, -360]]} radius={13} color="#596369" opacity={ghost ? 0.4 : 1} />
          <Tube points={[[-580, 967, HOOD_PIVOT[2] - 90], [0, 981, HOOD_PIVOT[2] - 90], [580, 967, HOOD_PIVOT[2] - 90]]} radius={13} color="#596369" opacity={ghost ? 0.4 : 1} />
        </group>
      </group>
    </group>
    {[-1, 1].map(side => <group key={side} name={`golf-fixed-front-fender-${side}`}>
      <Panel name={`golf-fender-shoulder-${side}`} ghost={ghost} hood from={side < 0 ? -1 : HOOD_SPLIT + HOOD_GAP} to={side < 0 ? -HOOD_SPLIT - HOOD_GAP : 1} sections={sections(BODY_TOP.hood, 14)} />
    </group>)}
    <group name="golf-windshield-surround">
      <Panel name="golf-windshield-glass" ghost={ghost} glass cabin="windshield" from={-0.94} to={0.94} sections={sections(BODY_TOP.windshield.slice(1, -1), 14)} />
      <Panel ghost={ghost} cabin="windshield" sections={sections(BODY_TOP.windshield.slice(0, 2), 14)} />
      <Panel ghost={ghost} cabin="windshield" sections={sections(BODY_TOP.windshield.slice(-2), 14)} />
      {[-1, 1].map(side => <group key={side}>
        <Panel ghost={ghost} cabin="windshield" from={side < 0 ? -1 : 0.94} to={side < 0 ? -0.94 : 1} sections={sections(BODY_TOP.windshield.slice(1, -1), 14)} />
        <Tube points={BODY_TOP.windshield.slice(1, -1).map(([depth, height]) => cabinPanelPoint('windshield', side * 0.94, depth - 1, height))} radius={4} color={BODY_FINISH.trim} opacity={ghost ? 0.08 : 1} />
      </group>)}
      {[BODY_TOP.windshield[1], BODY_TOP.windshield.at(-2)!].map(([depth, height]) => <Tube key={depth} points={Array.from({ length: 25 }, (_, column) => cabinPanelPoint('windshield', -0.94 + column / 24 * 1.88, depth - 1, height))} radius={4} color={BODY_FINISH.trim} opacity={ghost ? 0.08 : 1} />)}
    </group>
    <Panel name="golf-roof-skin" ghost={ghost} cabin="roof" sections={sections(BODY_TOP.roof, 14)} />
    <group ref={hatch} name="golf-hatch-motion" position={HATCH_PIVOT}>
      <group position={[0, -HATCH_PIVOT[1], -HATCH_PIVOT[2]]}>
        <Panel name="golf-rear-window" ghost={ghost} rear glass sections={sections(BODY_TOP.rearGlass.slice(1, -1), 14)} from={-0.68} to={0.68} />
        <Panel ghost={ghost} rear sections={sections(BODY_TOP.rearGlass.slice(0, 2), 14)} from={-0.7} to={0.7} />
        <Panel ghost={ghost} rear sections={sections(BODY_TOP.rearGlass.slice(-2), 14)} from={-0.7} to={0.7} />
        {[-1, 1].map(side => <Panel key={side} ghost={ghost} rear sections={sections(BODY_TOP.rearGlass.slice(1, -1), 14)} from={side < 0 ? -0.7 : 0.68} to={side < 0 ? -0.68 : 0.7} />)}
        <Panel name="golf-hatch-skin" ghost={ghost} rear sections={sections(REAR_HATCH_ROWS, 14)} from={-0.7} to={0.7} />
      </group>
    </group>
    {[-1, 1].map(side => <group key={side} name={`golf-fixed-rear-quarter-${side < 0 ? 'left' : 'right'}`}>
      <Panel ghost={ghost} rear sections={sections(BODY_TOP.rearGlass, 14)} from={side < 0 ? -1 : 0.7} to={side < 0 ? -0.7 : 1} />
      <Panel ghost={ghost} rear sections={sections(REAR_HATCH_ROWS, 14)} from={side < 0 ? -1 : 0.7} to={side < 0 ? -0.7 : 1} />
      <group name={`golf-hood-hinge-${side}`} position={HOOD_PIVOT}><Casting position={[side * 580, -10, 0]} size={[65, 20, 85]} color="#737b80" /><Shaft from={[side * 580 - 35, 0, 0]} to={[side * 580 + 35, 0, 0]} radius={9} /></group>
      <group name={`golf-hatch-hinge-${side}`} position={HATCH_PIVOT}><Casting position={[side * 420, -6, -10]} size={[65, 18, 75]} color="#737b80" /><Shaft from={[side * 420 - 35, 0, 0]} to={[side * 420 + 35, 0, 0]} radius={9} /></group>
      <PanelSupport bodyControl={bodyControl} side={side} />
    </group>)}
    <PanelSupport bodyControl={bodyControl} />
  </group>;
}