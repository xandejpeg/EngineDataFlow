import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { BODY_FINISH, bodyHalfWidth, createBodySide } from './golfBodyGeometry';
import { DOOR_IDS, commandDoor, commandWindow, type BodyControlState, type DoorId } from './golfBodyControl';
import { DOOR_OPEN_ANGLE, clipDoorPolygon, createCabinSeal, createDoorEdgeGeometry, createDoorPanelGeometry, createDoorPillarTrim, createDoorRubStrip, createDoorSideOutline, createDoorWindowGeometry, createFixedPillarTrim, createWindowSurround, doorDefinition, doorPanelContour, doorWindowDrop } from './golfDoorGeometry';
import { VEHICLE_WINDOWS } from './golfVehicleGeometry';
import { GolfDoorMirror } from './GolfDoorMirror';
import { createDoorTrimInsert } from './golfDoorGeometry';
import { Casting, Shaft } from './GolfPrimitives';
import { GolfDoorHandle } from './GolfDoorHandle';

type DoorProps = { bodyControl: MutableRefObject<BodyControlState>; ghost: boolean };

function DoorAssembly({ id, bodyControl, ghost }: DoorProps & { id: DoorId }) {
  const definition = useMemo(() => doorDefinition(id), [id]);
  const { side, index, pivot, handleDepth } = definition;
  const hinge = useRef<THREE.Group>(null);
  const glassGroup = useRef<THREE.Group>(null);
  const glass = useRef<THREE.Mesh>(null);
  const resources = useMemo(() => {
    const innerContour = clipDoorPolygon(doorPanelContour(index).map(([depth, height]) => [depth, -height]), -975).map(([depth, height]) => new THREE.Vector2(depth, -height));
    return {
      panel: createDoorPanelGeometry(id),
      edge: createDoorEdgeGeometry(id),
      fabric: createDoorTrimInsert(id),
      upperTrim: createDoorTrimInsert(id, true),
      trim: createBodySide(new THREE.Shape(innerContour), side, -32).translate(-pivot[0], -pivot[1], -pivot[2]),
      window: createDoorWindowGeometry(id, bodyControl.current.doors[id].window),
      quarter: index === 1 ? createBodySide(new THREE.Shape(VEHICLE_WINDOWS[2].map(point => new THREE.Vector2(...point))), side, -2).translate(-pivot[0], -pivot[1], -pivot[2]) : null,
      quarterSurround: index === 1 ? createWindowSurround(2, side).translate(-pivot[0], -pivot[1], -pivot[2]) : null,
      quarterSeal: index === 1 ? createCabinSeal(VEHICLE_WINDOWS[2], side, 2, 3).translate(-pivot[0], -pivot[1], -pivot[2]) : null,
      closed: bodyControl.current.doors[id].window,
      surround: createWindowSurround(index, side).translate(-pivot[0], -pivot[1], -pivot[2]),
      pillar: createDoorPillarTrim(id),
      rubStrip: createDoorRubStrip(id),
      seal: createCabinSeal(VEHICLE_WINDOWS[index], side, 2, 3).translate(-pivot[0], -pivot[1], -pivot[2]),
      innerSeal: createCabinSeal(doorPanelContour(index), side, -10, 4).translate(-pivot[0], -pivot[1], -pivot[2]),
      seam: createCabinSeal(doorPanelContour(index), side, 0.5, 1.3).translate(-pivot[0], -pivot[1], -pivot[2]),
    };
  }, [id, index, side, pivot, bodyControl]);
  useEffect(() => () => {
    resources.panel.dispose();
    resources.edge.dispose();
    resources.fabric.dispose(); resources.upperTrim.dispose();
    resources.trim.dispose();
    resources.window.dispose();
    resources.quarter?.dispose(); resources.quarterSurround?.dispose(); resources.quarterSeal?.dispose();
    resources.surround.dispose(); resources.pillar.dispose(); resources.rubStrip.dispose();
    resources.seal.dispose(); resources.innerSeal.dispose(); resources.seam.dispose();
  }, [resources]);
  useFrame(() => {
    const state = bodyControl.current.doors[id];
    if (hinge.current) hinge.current.rotation.y = side * state.open * DOOR_OPEN_ANGLE;
    if (glassGroup.current) glassGroup.current.position.y = -doorWindowDrop(state.window);
    if (glass.current && state.window !== resources.closed) {
      const previous = resources.window;
      resources.window = createDoorWindowGeometry(id, state.window);
      glass.current.geometry = resources.window;
      glass.current.visible = state.window > 0;
      resources.closed = state.window;
      previous.dispose();
    }
  });
  const toggleDoor = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    bodyControl.current = commandDoor(bodyControl.current, id, bodyControl.current.doors[id].target < 0.5);
  };
  const setWindow = (event: ThreeEvent<MouseEvent>, target: number) => {
    event.stopPropagation();
    bodyControl.current = commandWindow(bodyControl.current, id, target);
  };
  const localPoint = (depth: number, height: number, offset = 0): [number, number, number] => [side * (bodyHalfWidth(height, depth) + offset) - pivot[0], height - pivot[1], depth - pivot[2]];
  const latchDepth = index === 0 ? 1526 : 2450;
  const armrestDepth = index === 0 ? 1070 : 1930;
  const opacity = ghost ? 0.12 : 1;
  return <group name={`golf-door-mount-${id}`} userData={{ dimensionalStatus: 'estimated', side, doorId: id, hingeAxis: 'world-Y', openingRadians: DOOR_OPEN_ANGLE }}>
    <group name={`golf-door-fixed-hinges-${id}`} position={[pivot[0] - side * 40, pivot[1], pivot[2]]} visible={!ghost}>
      {[-230, 70].map(height => <group key={height}>
        <Shaft from={[0, height - 23, 0]} to={[0, height + 23, 0]} radius={7} />
        <Casting position={[-side * 12, height, -15]} size={[26, 48, 34]} color={BODY_FINISH.paint} />
      </group>)}
    </group>
    <group name={`golf-door-striker-${id}`} position={[side * (bodyHalfWidth(850, latchDepth + 13) - 18), 850, latchDepth + 13]} visible={!ghost}>
      <Casting size={[8, 65, 28]} color="#8e9697" />
      <Shaft from={[-side * 12, -17, -8]} to={[-side * 12, 17, -8]} radius={4} />
      {[-17, 17].map(height => <Shaft key={height} from={[0, height, 0]} to={[-side * 12, height, -8]} radius={4} />)}
    </group>
    <group ref={hinge} name={`golf-door-${id}`} position={pivot} rotation={[0, side * bodyControl.current.doors[id].open * DOOR_OPEN_ANGLE, 0]} onClick={toggleDoor} onPointerDown={event => event.stopPropagation()} userData={{ dimensionalStatus: 'estimated', representation: 'articulated', doorId: id, clearance: 'mirrored estimated panels; not OE geometry' }}>
      <mesh name={`golf-door-skin-${id}`} geometry={resources.panel} dispose={null}>
        <meshStandardMaterial color={BODY_FINISH.paint} metalness={0.35} roughness={0.3} side={THREE.DoubleSide} transparent={ghost} opacity={ghost ? 0.065 : 1} depthWrite={!ghost} />
      </mesh>
      <mesh name={`golf-door-inner-trim-${id}`} geometry={resources.trim} dispose={null}>
        <meshStandardMaterial color="#343d40" roughness={0.93} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
      </mesh>
      <group name={`golf-door-upholstery-${id}`} userData={{ representation: 'estimated-static-trim-on-moving-door' }}>
        <mesh geometry={resources.fabric} dispose={null}>
          <meshStandardMaterial color="#566064" roughness={1} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
        </mesh>
        <mesh geometry={resources.upperTrim} dispose={null}>
          <meshStandardMaterial color="#202a2e" roughness={0.9} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
        </mesh>
      </group>
      <mesh name={`golf-door-edge-${id}`} geometry={resources.edge} dispose={null}>
        <meshStandardMaterial color={BODY_FINISH.paint} metalness={0.35} roughness={0.45} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
      </mesh>
      <group ref={glassGroup} name={`golf-door-glass-${id}`} position={[0, -doorWindowDrop(bodyControl.current.doors[id].window), 0]} userData={{ travelMm: 440, clipHeightMm: 990 }}>
        <mesh ref={glass} name={`golf-door-window-pane-${id}`} geometry={resources.window} visible={bodyControl.current.doors[id].window > 0} dispose={null}>
          <meshStandardMaterial color={BODY_FINISH.glass} metalness={0.3} roughness={0.12} transparent opacity={ghost ? 0.04 : 0.88} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
      <group name={`golf-door-window-seal-${id}`} visible={!ghost}>
        {[resources.seal, resources.innerSeal, resources.seam].map((geometry, part) => <mesh key={part} geometry={geometry} dispose={null}><meshStandardMaterial color={BODY_FINISH.trim} roughness={0.8} /></mesh>)}
      </group>
      {resources.quarter && <group name={`golf-door-quarter-${id}`} userData={{ glassMotion: 'fixed-in-rear-door' }}>
        <mesh name={`golf-fixed-quarter-glass-${side}`} geometry={resources.quarter} dispose={null}>
          <meshStandardMaterial color={BODY_FINISH.glass} metalness={0.3} roughness={0.12} transparent opacity={ghost ? 0.04 : 0.88} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh name={`golf-fixed-quarter-surround-${side}`} geometry={resources.quarterSurround!} dispose={null}><meshStandardMaterial color={BODY_FINISH.trim} roughness={0.65} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} depthWrite={!ghost} /></mesh>
        <mesh name={`golf-fixed-quarter-seal-${side}`} geometry={resources.quarterSeal!} visible={!ghost} dispose={null}><meshStandardMaterial color={BODY_FINISH.trim} roughness={0.8} /></mesh>
      </group>}
      {([['surround', resources.surround], ['pillar-trim', resources.pillar], ['rub-strip', resources.rubStrip]] as const).map(([name, geometry]) => <mesh key={name} name={`golf-door-${name}-${id}`} geometry={geometry} dispose={null}>
        <meshStandardMaterial color={name === 'rub-strip' ? BODY_FINISH.paint : BODY_FINISH.trim} roughness={name === 'rub-strip' ? 0.38 : 0.65} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
      </mesh>)}
      <group name={`golf-door-moving-hinges-${id}`} visible={!ghost}>
        {[-230, 70].map(height => <Casting key={height} position={[-side * 40, height, 20]} size={[20, 34, 42]} color={BODY_FINISH.paint} />)}
      </group>
      <group name={`golf-door-latch-${id}`} position={localPoint(latchDepth, 850, -20)}>
        <Casting size={[25, 58, 18]} color="#242c2f" opacity={opacity} />
        <Casting position={[-side * 4, 0, 10]} size={[14, 20, 5]} color="#b1b9ba" opacity={opacity} />
      </group>
      <group name={`golf-door-outer-handle-${id}`} position={localPoint(handleDepth, 940, 2)}>
        <GolfDoorHandle side={side} opacity={opacity} />
      </group>
      <group name={`golf-door-armrest-${id}`} position={localPoint(armrestDepth, 775, -62)}>
        <Casting size={[85, 58, 330]} color="#202a2f" radius={14} opacity={opacity} />
        <group name={`golf-door-window-switch-down-${id}`} position={[-side * 8, 35, -80]} onClick={event => setWindow(event, 0)}>
          <Casting size={[28, 12, 32]} color="#111b20" radius={3} opacity={opacity} />
        </group>
        <group name={`golf-door-window-switch-up-${id}`} position={[-side * 8, 35, -35]} onClick={event => setWindow(event, 1)}>
          <Casting size={[28, 12, 32]} color="#899797" radius={3} opacity={opacity} />
        </group>
      </group>
      <group name={`golf-door-inner-handle-${id}`} position={localPoint(armrestDepth - 120, 887, -48)}>
        <Casting size={[24, 48, 125]} color="#202a2f" radius={8} opacity={opacity} />
        <Casting position={[-side * 14, 0, 0]} size={[12, 19, 90]} color="#a3afb0" radius={5} opacity={opacity} />
      </group>
      <group name={`golf-door-speaker-${id}`} position={localPoint(index === 0 ? 665 : 1698, 575, -48)} rotation={[0, side * Math.PI / 2, 0]} userData={{ audio: 'not-simulated' }}>
        <mesh>
          <circleGeometry args={[70, 40]} />
          <meshStandardMaterial color="#111b20" roughness={0.9} side={THREE.DoubleSide} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
        </mesh>
        {[-48, -32, -16, 0, 16, 32, 48].map(height => <Casting key={height} position={[0, height, -3]} size={[2 * Math.sqrt(65 ** 2 - height ** 2), 3, 3]} color="#495357" radius={1} opacity={opacity} />)}
      </group>
      <group name={`golf-door-pocket-${id}`} position={localPoint(armrestDepth + 35, 555, -80)} userData={{ opening: 'top', cavity: true }}>
        <Casting position={[0, -44, 0]} size={[90, 8, index === 0 ? 440 : 330]} color="#202a2f" radius={3} opacity={opacity} />
        {[-1, 1].map(edge => <group key={edge}>
          <Casting position={[edge * 42, 0, 0]} size={[6, 88, index === 0 ? 440 : 330]} color="#202a2f" radius={2} opacity={opacity} />
          <Casting position={[0, 0, edge * (index === 0 ? 217 : 162)]} size={[84, 88, 6]} color="#202a2f" radius={2} opacity={opacity} />
        </group>)}
      </group>
      {index === 0 && <group name={`golf-door-mirror-${id}`} position={[side * 915 - pivot[0], 995 - pivot[1], 580 - pivot[2]]}>
        <GolfDoorMirror side={side} ghost={ghost} />
      </group>}
    </group>
  </group>;
}

export function GolfDoors({ bodyControl, ghost }: DoorProps) {
  const sides = useMemo(() => [-1, 1].map(side => ({
    side,
    sheet: createBodySide(createDoorSideOutline(), side, 0, true),
    pillar: createFixedPillarTrim(side),
  })), []);
  useEffect(() => () => sides.forEach(({ sheet, pillar }) => { sheet.dispose(); pillar.dispose(); }), [sides]);
  return <group name="golf-doors" userData={{ dimensionalStatus: 'estimated', doors: 4, windows: 4, fixedQuarterWindows: 2 }}>
    {sides.map(({ side, sheet, pillar }) => <group key={side} name={`golf-body-side-${side}`}>
      <mesh name={`golf-fixed-side-sheet-${side}`} geometry={sheet} dispose={null}>
        <meshStandardMaterial attach="material-0" color={BODY_FINISH.paint} metalness={0.35} roughness={0.3} side={THREE.DoubleSide} transparent={ghost} opacity={ghost ? 0.065 : 1} depthWrite={!ghost} />
        <meshStandardMaterial attach="material-1" color={BODY_FINISH.trim} metalness={0.05} roughness={0.8} side={THREE.DoubleSide} transparent={ghost} opacity={ghost ? 0.065 : 1} depthWrite={!ghost} />
      </mesh>
      <mesh name={`golf-fixed-pillar-trim-${side}`} geometry={pillar} dispose={null}><meshStandardMaterial color={BODY_FINISH.trim} roughness={0.65} side={THREE.DoubleSide} transparent={ghost} opacity={ghost ? 0.12 : 1} depthWrite={!ghost} /></mesh>
    </group>)}
    {DOOR_IDS.map(id => <DoorAssembly key={id} id={id} bodyControl={bodyControl} ghost={ghost} />)}
  </group>;
}