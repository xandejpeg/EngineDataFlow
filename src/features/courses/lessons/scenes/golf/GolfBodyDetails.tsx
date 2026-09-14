import { useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Ring, Tube } from './GolfPrimitives';
import { BODY_FINISH, bodyHalfWidth } from './golfBodyGeometry';
import { commandHatch, sampleBodyControl, type BodyControlState } from './golfBodyControl';
import type { GolfClock } from './golfPhysics';
import type { BrakeState } from './golfBrakeHydraulics';
import { bodyLampOn, bodyPower, HATCH_ANGLE, HATCH_PIVOT, HATCH_STOP, type BodyLamp, type BodyPoint } from './golfBodyWiring.ts';
import { GolfBodyWiring } from './GolfBodyWiring.tsx';
import { fitRearDetail, rearLampSurface, rearPanelPoint } from './golfBodyFit';
import { createBumperGeometry } from './golfBumperGeometry';
import { createFrontBumperSkin, fitFrontDetail, frontIntakeWall, frontLampOutline, frontNoseBridge, frontPanelPoint, frontReflector, frontShapeSurface } from './golfFrontFit';
import { frontIntakeShapes } from './golfFrontOpenings';
import { GolfRearTrim } from './GolfRearTrim';

type BodyRefs = { bodyControl: MutableRefObject<BodyControlState>; clock: MutableRefObject<GolfClock>; brakes: MutableRefObject<BrakeState> };
type DetailProps = BodyRefs & { ghost: boolean };

function LiveLamp({ name, lamp, side = 1, position = [0, 0, 0], rotation = [0, 0, 0], color, litColor = color, children, bodyControl, clock, brakes }: BodyRefs & { name: string; lamp: BodyLamp; side?: number; position?: BodyPoint; rotation?: BodyPoint; color: string; litColor?: string; children: ReactNode }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const state = bodyControl.current;
    const output = sampleBodyControl(state, bodyPower(clock.current, brakes.current));
    const on = bodyLampOn(output, lamp, side, state);
    if (material.current) { material.current.emissive.set(litColor); material.current.emissiveIntensity = on ? lamp === 'brake' ? 3 : 1.8 : 0; }
    if (mesh.current) Object.assign(mesh.current.userData, { lamp, side, on, output: on, voltage: on ? 12 : 0 });
  });
  return <mesh ref={mesh} name={name} position={position} rotation={rotation}>
    {children}<meshStandardMaterial ref={material} color={color} emissive={color} emissiveIntensity={0} metalness={0.2} roughness={0.3} side={THREE.DoubleSide} />
  </mesh>;
}

function HeadlampBeam({ side, high, bodyControl, clock, brakes }: BodyRefs & { side: number; high: boolean }) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => { const object = new THREE.Object3D(); object.position.set(side * 550, high ? 500 : 180, high ? -14000 : -6000); return object; }, [side, high]);
  useFrame(() => {
    const output = sampleBodyControl(bodyControl.current, bodyPower(clock.current, brakes.current));
    const on = bodyLampOn(output, high ? 'high' : 'low', side);
    if (light.current) {
      light.current.visible = on;
      light.current.intensity = on ? high ? 600000000 : 400000000 : 0;
      Object.assign(light.current.userData, { on, output: on, voltage: on ? 12 : 0, target: target.position.toArray(), coordinateSpace: 'vehicle-local', photometry: 'illustrative-not-homologated' });
    }
  });
  return <group name={`golf-headlamp-${side < 0 ? 'left' : 'right'}-${high ? 'high' : 'low'}-beam`}>
    <primitive object={target} />
    <spotLight ref={light} visible={false} name={`golf-headlamp-${side < 0 ? 'left' : 'right'}-${high ? 'high' : 'low'}`} position={frontPanelPoint(side * (high ? 475 : 638), high ? 697 : 711, 24)} target={target} color={high ? '#ecf5ff' : '#fff3d8'} intensity={0} angle={high ? 0.16 : 0.32} penumbra={0.45} distance={high ? 20000 : 12000} decay={2} />
  </group>;
}

function InteriorLamp({ cargo = false, ...refs }: BodyRefs & { cargo?: boolean }) {
  const light = useRef<THREE.PointLight>(null);
  const position: BodyPoint = cargo ? [-480, 1180, 2910] : [0, 1415, 1180];
  const lamp = cargo ? 'cargo' : 'cabin';
  useFrame(() => {
    const output = sampleBodyControl(refs.bodyControl.current, bodyPower(refs.clock.current, refs.brakes.current));
    const on = bodyLampOn(output, lamp, 1, refs.bodyControl.current);
    if (light.current) { light.current.visible = on; light.current.intensity = on ? 150000 : 0; light.current.userData.on = on; }
  });
  return <group name={`golf-${lamp}-lamp`} position={position}>
    <Casting size={[75, 12, 38]} radius={3} color="#737e7c" />
    <LiveLamp {...refs} name={`golf-${lamp}-lens`} lamp={lamp} color="#fff0c4" position={[0, -8, 0]}><boxGeometry args={[62, 5, 28]} /></LiveLamp>
    <pointLight ref={light} visible={false} name={`golf-${lamp}-light`} position={[0, -20, 0]} color="#fff0c4" distance={1600} intensity={0} decay={2} />
  </group>;
}

function Badge({ rear = false }: { rear?: boolean }) {
  return <group name={rear ? 'golf-rear-badge' : 'golf-front-badge'} position={rear ? rearPanelPoint(0, 976, 6) : frontPanelPoint(0, 717, 22)} rotation={rear ? [-0.45, 0, 0] : [0, 0, 0]}>
    <mesh rotation={[0, rear ? 0 : Math.PI, 0]}><circleGeometry args={[rear ? 56 : 49, 48]} /><meshStandardMaterial color="#23353e" /></mesh>
    <Ring radius={rear ? 57 : 50} tube={4} rotation={[0, 0, 0]} color="#d4dce0" />
    <group position={[0, 0, rear ? 3 : -3]} scale={rear ? 1.5 : 1.3}>
      <Tube points={[[-18, 23, 0], [0, -3, 0], [18, 23, 0]]} radius={3.5} color="#e0e5e6" />
      <Tube points={[[-29, 9, 0], [-17, -23, 0], [0, -6, 0], [17, -23, 0], [29, 9, 0]]} radius={3.5} color="#e0e5e6" />
    </group>
  </group>;
}

function Bumper({ rear, ghost }: { rear: boolean; ghost: boolean }) {
  const geometry = useMemo(() => rear ? createBumperGeometry(true) : createFrontBumperSkin(), [rear]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh name={rear ? 'golf-rear-bumper' : 'golf-front-bumper'} geometry={geometry}>
    <meshStandardMaterial attach="material-0" color={BODY_FINISH.paint} metalness={0.35} roughness={0.3} side={THREE.DoubleSide} transparent={ghost} opacity={ghost ? 0.08 : 1} depthWrite={!ghost} />
    <meshStandardMaterial attach="material-1" color={BODY_FINISH.trim} metalness={0.05} roughness={0.8} side={THREE.DoubleSide} transparent={ghost} opacity={ghost ? 0.08 : 1} depthWrite={!ghost} />
  </mesh>;
}

function Headlamp({ side, ghost, ...refs }: DetailProps & { side: number }) {
  const geometry = useMemo(() => {
    const shape = frontLampOutline();
    return {
      housing: frontShapeSurface(shape, side, [550, 701], 7),
      cover: frontShapeSurface(shape, side, [550, 701], 18),
      high: fitFrontDetail(new THREE.CircleGeometry(26, 40), side, [475, 697], 12),
      low: fitFrontDetail(new THREE.CircleGeometry(29, 40), side, [638, 711], 12),
      highRing: frontReflector(side, [475, 697], 26, 53),
      lowRing: frontReflector(side, [638, 711], 29, 58),
      position: fitFrontDetail(new THREE.CircleGeometry(9, 20), side, [389, 652], 13),
      indicator: fitFrontDetail(new THREE.PlaneGeometry(170, 14, 12, 2), side, [610, 633], 13),
    };
  }, [side]);
  useEffect(() => () => Object.values(geometry).forEach(surface => surface.dispose()), [geometry]);
  return <group name={`golf-headlamp-${side}`} userData={{ surfaceFitted: true }}>
    <Tube points={frontLampOutline().getSpacedPoints(80).map(point => frontPanelPoint(side * (550 + point.x), 701 + point.y, 18))} radius={2.8} color="#555f61" opacity={ghost ? 0.08 : 1} />
    <mesh name={`golf-headlamp-housing-${side}`} geometry={geometry.housing} dispose={null}><meshStandardMaterial color="#a4afb4" metalness={0.55} roughness={0.24} side={THREE.DoubleSide} transparent={ghost} opacity={ghost ? 0.08 : 1} /></mesh>
    {(['high', 'low'] as const).map(lamp => <group key={lamp}>
      <mesh geometry={geometry[lamp === 'high' ? 'highRing' : 'lowRing']} dispose={null}><meshStandardMaterial color="#e5e9e7" metalness={0.9} roughness={0.16} side={THREE.DoubleSide} flatShading /></mesh>
      <LiveLamp {...refs} name={`golf-headlamp-${side < 0 ? 'left' : 'right'}-${lamp}-lens`} lamp={lamp} side={side} color={lamp === 'low' ? '#c6cecb' : '#bbc8d1'}><primitive object={geometry[lamp]} attach="geometry" /></LiveLamp>
    </group>)}
    <LiveLamp {...refs} name={`golf-front-position-${side}`} lamp="position" side={side} color="#fff1c5"><primitive object={geometry.position} attach="geometry" /></LiveLamp>
    <LiveLamp {...refs} name={`golf-front-indicator-${side}`} lamp="indicator" side={side} color="#cdd5d4" litColor="#e8a14e"><primitive object={geometry.indicator} attach="geometry" /></LiveLamp>
    <mesh name={`golf-headlamp-cover-${side}`} geometry={geometry.cover} dispose={null}><meshStandardMaterial color="#d1dfe4" transparent opacity={ghost ? 0.025 : 0.2} metalness={0.15} roughness={0.12} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  </group>;
}

function FrontFascia({ ghost, ...refs }: DetailProps) {
  const opacity = ghost ? 0.08 : 1;
  const geometry = useMemo(() => {
    const { upper, lower, pockets } = frontIntakeShapes();
    const molding = new THREE.Shape();
    molding.moveTo(429, 607); molding.lineTo(753, 601);
    molding.quadraticCurveTo(779, 581, 750, 565);
    molding.lineTo(441, 568); molding.quadraticCurveTo(411, 582, 429, 607); molding.closePath();
    return {
      nose: frontNoseBridge(),
      upper: frontShapeSurface(upper, 1, [0, 0], -35),
      lower: frontShapeSurface(lower, 1, [0, 0], -35),
      walls: [upper, lower, ...pockets].map(shape => frontIntakeWall(shape)),
      moldings: [-1, 1].map(side => frontShapeSurface(molding, side, [0, 0], 9)),
      plate: fitFrontDetail(new THREE.PlaneGeometry(430, 100, 24, 6), 1, [0, 546], 12),
      pockets: pockets.map(shape => frontShapeSurface(shape, 1, [0, 0], -35)),
      fogs: [-1, 1].map(side => fitFrontDetail(new THREE.CircleGeometry(33, 40), side, [653, 427], -8)),
      rings: [-1, 1].map(side => fitFrontDetail(new THREE.RingGeometry(35, 41, 40), side, [653, 427], -7)),
    };
  }, []);
  useEffect(() => () => {
    [geometry.nose, geometry.upper, geometry.lower, geometry.plate, ...geometry.walls, ...geometry.moldings, ...geometry.pockets, ...geometry.fogs, ...geometry.rings].forEach(surface => surface.dispose());
  }, [geometry]);
  const strip = (start: number, end: number, height: number, clearance: number) => Array.from({ length: 25 }, (_, index) => frontPanelPoint(start + (end - start) * index / 24, height, clearance));
  return <group name="golf-front-fascia" userData={{ surfaceFitted: true }}>
    {geometry.walls.map((wall, index) => <mesh key={index} name={`golf-intake-wall-${index}`} geometry={wall} dispose={null}><meshStandardMaterial color="#252b2c" roughness={0.65} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} /></mesh>)}
    <mesh name="golf-front-nose-bridge" geometry={geometry.nose} dispose={null}><meshStandardMaterial color={BODY_FINISH.paint} metalness={0.35} roughness={0.3} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} /></mesh>
    {[geometry.upper, geometry.lower].map((surface, index) => <mesh key={index} name={`golf-front-grille-${index}`} geometry={surface} dispose={null}><meshStandardMaterial color="#141b1e" side={THREE.DoubleSide} transparent={ghost} opacity={opacity} roughness={0.65} /></mesh>)}
    {[685, 713, 743].map(height => <Tube key={height} points={strip(-315, 315, height, 7)} radius={6} color={BODY_FINISH.paint} opacity={opacity} />)}
    {[370, 405, 440, 474].map(height => <Tube key={height} points={strip(-389, 389, height, -10)} radius={4} color="#30383a" opacity={opacity} />)}
    {[-300, -150, 0, 150, 300].map(horizontal => <Tube key={horizontal} points={[frontPanelPoint(horizontal, 360, -17), frontPanelPoint(horizontal, 480, -17)]} radius={3} color="#252d2f" opacity={opacity} />)}
    <mesh name="golf-front-number-plate" geometry={geometry.plate} dispose={null}><meshStandardMaterial color="#dce1de" side={THREE.DoubleSide} transparent={ghost} opacity={opacity} /></mesh>
    {[-1, 1].map((side, index) => <group key={side}>
      <mesh name={`golf-front-fog-pocket-${side}`} geometry={geometry.pockets[index]} dispose={null}><meshStandardMaterial color="#182124" side={THREE.DoubleSide} transparent={ghost} opacity={opacity} /></mesh>
      {[390, 418, 446].map(height => <Tube key={height} points={strip(side * 540, side * 609, height, 12)} radius={3} color="#455154" opacity={opacity} />)}
      <mesh geometry={geometry.rings[index]} dispose={null}><meshStandardMaterial color="#aababc" metalness={0.65} roughness={0.25} side={THREE.DoubleSide} /></mesh>
      <LiveLamp {...refs} name={`golf-fog-${side}`} lamp="fog" side={side} color="#d8d9c9"><primitive object={geometry.fogs[index]} attach="geometry" /></LiveLamp>
      <mesh geometry={geometry.moldings[index]} dispose={null}><meshStandardMaterial color={BODY_FINISH.paint} metalness={0.2} roughness={0.4} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} /></mesh>
    </group>)}
    <Badge />
  </group>;
}

function TailLamp({ side, ghost, inner = false, ...refs }: DetailProps & { side: number; inner?: boolean }) {
  const shape = useMemo(() => {
    const contour = new THREE.Shape();
    if (inner) { contour.moveTo(-195, -50); contour.quadraticCurveTo(-225, 0, -175, 74); contour.quadraticCurveTo(-155, 95, -100, 99); contour.lineTo(-12, 105); contour.lineTo(-12, -90); contour.lineTo(-115, -90); contour.quadraticCurveTo(-180, -87, -195, -50); }
    else { contour.moveTo(8, 88); contour.quadraticCurveTo(52, 102, 95, 94); contour.quadraticCurveTo(158, 76, 208, -38); contour.quadraticCurveTo(220, -82, 115, -95); contour.quadraticCurveTo(48, -95, 8, -88); }
    contour.closePath(); return contour;
  }, [inner]);
  const geometry = useMemo(() => {
    const center: [number, number] = [inner ? -100 : 74, inner ? 929 : 941];
    return {
      housing: rearLampSurface(shape, side, [0, 932], 4),
      tail: rearLampSurface(new THREE.Shape().absarc(0, 0, inner ? 63 : 70, 0, Math.PI * 2, false), side, center, 6),
      brake: fitRearDetail(new THREE.RingGeometry(31, inner ? 56 : 63, 64, 8), side, center, 7),
      bezel: fitRearDetail(new THREE.RingGeometry(inner ? 60 : 67, inner ? 65 : 72, 64, 3), side, center, 8),
      indicator: rearLampSurface(new THREE.Shape().absarc(0, 0, 27, 0, Math.PI * 2, false), side, center, 8),
      lowerLens: fitRearDetail(new THREE.PlaneGeometry(inner ? 104 : 108, 20, 24, 4), side, [inner ? -99 : 68, 866], 8),
    };
  }, [shape, side, inner]);
  useEffect(() => () => Object.values(geometry).forEach(surface => surface.dispose()), [geometry]);
  return <group name={`golf-tail-lamp-${side}${inner ? '-inner' : ''}`} userData={{ surfaceFitted: true, lensClearanceMm: 6 }}>
    <mesh name={`golf-tail-housing-${side}-${inner ? 'inner' : 'outer'}`} geometry={geometry.housing} dispose={null}><meshStandardMaterial color="#ac1022" metalness={0.25} roughness={0.18} side={THREE.DoubleSide} transparent={ghost} opacity={ghost ? 0.08 : 1} /></mesh>
    <LiveLamp {...refs} name={`golf-tail-${side}-${inner ? 'inner' : 'outer'}`} lamp="tail" side={side} color="#df233b"><primitive object={geometry.tail} attach="geometry" /></LiveLamp>
    <LiveLamp {...refs} name={`golf-brake-${side}-${inner ? 'inner' : 'outer'}`} lamp="brake" side={side} color="#ff2336"><primitive object={geometry.brake} attach="geometry" /></LiveLamp>
    <mesh geometry={geometry.bezel} dispose={null}><meshStandardMaterial color="#6e1826" side={THREE.DoubleSide} /></mesh>
    <mesh geometry={geometry.lowerLens} dispose={null}><meshStandardMaterial color={inner ? '#cbd1ce' : '#b64a40'} metalness={0.2} roughness={0.25} side={THREE.DoubleSide} /></mesh>
    {inner && <mesh geometry={geometry.indicator} dispose={null}><meshStandardMaterial color="#cbd1ce" metalness={0.2} roughness={0.23} side={THREE.DoubleSide} /></mesh>}
    {!inner && <LiveLamp {...refs} name={`golf-rear-indicator-${side}`} lamp="indicator" side={side} color="#c9cdca" litColor="#ff9c26"><primitive object={geometry.indicator} attach="geometry" /></LiveLamp>}
  </group>;
}

export function GolfBodyDetails({ ghost, ...refs }: DetailProps) {
  const opacity = ghost ? 0.08 : 1;
  const hatch = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  useFrame(() => {
    if (hatch.current) { hatch.current.rotation.x = refs.bodyControl.current.hatch === 0 ? 0 : refs.bodyControl.current.hatch * HATCH_ANGLE; hatch.current.userData.open = refs.bodyControl.current.hatch; }
    if (root.current) root.current.userData.output = sampleBodyControl(refs.bodyControl.current, bodyPower(refs.clock.current, refs.brakes.current));
  });
  return <group ref={root} name="golf-body-details" userData={{ representation: 'photo-guided-estimated-mk5-five-door', factoryDimensions: false }}>
    <Bumper rear={false} ghost={ghost} /><Bumper rear ghost={ghost} />
    <FrontFascia ghost={ghost} {...refs} />
    <group name="golf-rear-number-plate" position={[0, 547, 3339]}>
      <Casting size={[454, 112, 6]} radius={6} color={BODY_FINISH.trim} opacity={opacity} />
      <Casting position={[0, 0, 5]} size={[430, 95, 4]} radius={3} color="#dce1de" opacity={opacity} />
    </group>
    {[-1, 1].map(side => <group key={side}>
      <Headlamp side={side} ghost={ghost} {...refs} /><TailLamp side={side} ghost={ghost} {...refs} />
      <HeadlampBeam {...refs} side={side} high={false} /><HeadlampBeam {...refs} side={side} high />
      {[0, 2578].map(axle => <Tube key={axle} points={Array.from({length: 65}, (_, index) => { const angle = index / 64 * Math.PI; const height = 317 + Math.sin(angle) * 358; const depth = axle + Math.cos(angle) * 358; return [side * (bodyHalfWidth(height, depth) - 2), height, depth]; })} radius={2.2} color="#59605f" opacity={opacity} />)}
    </group>)}
    <group ref={hatch} name="golf-hatch-details-motion" position={HATCH_PIVOT}>
      <group position={[0, -HATCH_PIVOT[1], -HATCH_PIVOT[2]]}>
        <group name="golf-hatch-handle" onClick={event => { event.stopPropagation(); const state = refs.bodyControl.current; refs.bodyControl.current = commandHatch(state, state.hatchTarget === 0, bodyPower(refs.clock.current, refs.brakes.current)); }}>
          <Badge rear />
        </group>
        {[-1, 1].map(side => <TailLamp key={side} {...refs} side={side} ghost={ghost} inner />)}
        <GolfRearTrim ghost={ghost} />
        <LiveLamp {...refs} name="golf-high-brake-lamp" lamp="brake" color="#ff2336" position={HATCH_STOP}><boxGeometry args={[340, 12, 7]} /></LiveLamp>
        <group name="golf-rear-wiper" userData={{ actuation: 'static' }}>
          <Casting position={rearPanelPoint(0, 1090, 12)} size={[43, 25, 24]} radius={10} color={BODY_FINISH.trim} opacity={opacity} />
          <Tube points={[rearPanelPoint(0, 1090, 22), rearPanelPoint(0.18, 1120, 22), rearPanelPoint(0.35, 1130, 22)]} radius={5} color={BODY_FINISH.trim} opacity={opacity} />
          <Tube points={Array.from({ length: 16 }, (_, index) => rearPanelPoint(0.16 + index / 15 * 0.45, 1125 + index / 15 * 17, 11))} radius={4.5} color="#202525" opacity={opacity} />
        </group>
      </group>
    </group>
    <InteriorLamp {...refs} /><InteriorLamp {...refs} cargo />
    <GolfBodyWiring {...refs} ghost={ghost} />
  </group>;
}