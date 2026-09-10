import { useMemo } from 'react';
import { Casting, Ring, Shaft, Tube, Turned } from './GolfPrimitives';
import { GEARBOX_INTERNALS as MODEL, GEARBOX_PAIRS, schematicGearShape } from './golfGearboxGeometry';
import type { Position } from './golfAssembly';

function Gear({ position, teeth, radius, width = 12, color = '#819ba5', bore = 14 }: { position: Position; teeth: number; radius: number; width?: number; color?: string; bore?: number }) {
  const shape = useMemo(() => schematicGearShape(teeth, radius, bore), [teeth, radius, bore]);
  return <mesh position={[position[0] - width / 2, position[1], position[2]]} rotation={[0, Math.PI / 2, 0]}>
    <extrudeGeometry args={[shape, { depth: width, bevelEnabled: false, curveSegments: 24 }]} />
    <meshStandardMaterial color={color} metalness={0.75} roughness={0.35} />
  </mesh>;
}

export function GolfGearboxInternals({ selected = 0 }: { selected?: number }) {
  return <group name="golf-gearbox-internals" userData={{ ...MODEL, selected }}>
    <group name="golf-gearbox-shafts">
      <Shaft from={[MODEL.shaftStart, 0, 0]} to={[MODEL.shaftEnd, 0, 0]} radius={13} />
      <Shaft from={[MODEL.shaftStart, ...MODEL.output]} to={[-95, ...MODEL.output]} radius={13} />
      {[MODEL.input, MODEL.output].map(([height, depth], index) => <group key={index}>
        {[-315, -112].map(axis => <group key={axis} position={[axis, height, depth]} rotation={[0, 0, -Math.PI / 2]}>
          <Turned profile={[[13, -6], [24, -6], [24, 6], [13, 6], [13, -6]]} color="#94a7a7" />
          <Ring radius={19} tube={3} color="#354e58" />
        </group>)}
      </group>)}
    </group>
    {GEARBOX_PAIRS.map(pair => <group key={pair.id} name={`golf-gear-pair-${pair.id}`} userData={{ station: pair.id, ratios: 'not-specified' }}>
      <Gear position={[pair.axis, 0, 0]} teeth={pair.inputTeeth} radius={pair.inputTeeth} color={selected === pair.id ? '#de934b' : '#819ba5'} />
      <Gear position={[pair.axis, ...MODEL.output]} teeth={pair.outputTeeth} radius={pair.outputTeeth} color={selected === pair.id ? '#de934b' : '#a4b4ae'} />
    </group>)}
    <group name="golf-gearbox-synchronizers">
      {[0, 2, 4].map(index => {
        const axis = GEARBOX_PAIRS[index].axis + 14.5;
        return <group key={index} position={[axis, ...MODEL.output]} rotation={[0, 0, -Math.PI / 2]}>
          <Turned profile={[[13, -7], [26, -7], [28, -5], [28, 5], [26, 7], [13, 7], [13, -7]]} color="#8d9f9f" />
          {[-6, 6].map(height => <Ring key={height} position={[0, height, 0]} radius={24} tube={2} color="#bcaa6e" />)}
        </group>;
      })}
    </group>
    <group name="golf-gearbox-selector">
      <Shaft from={[-310, 80, 85]} to={[-110, 80, 85]} radius={7} color="#adbbb7" />
      {[0, 2, 4].map(index => {
        const axis = GEARBOX_PAIRS[index].axis + 14.5;
        return <group key={index}>
          <Casting position={[axis, 80, 85]} size={[16, 24, 30]} color="#5b8390" />
          <Tube points={[[axis, 80, 85], [axis, 15, 105], [axis, -45, 103], [axis, -78, 89], [axis, -83, 65]]} radius={4} color="#7798a1" />
        </group>;
      })}
      <Shaft from={[-150, 80, 85]} to={[-150, 165, 85]} radius={11} />
      <Casting position={[-150, 166, 105]} size={[80, 12, 55]} color="#536e79" />
      <Shaft from={[-180, 172, 100]} to={[-180, 183, 100]} radius={8} />
      <Shaft from={[-120, 172, 115]} to={[-120, 183, 115]} radius={8} />
    </group>
    <group name="golf-differential" userData={{ type: 'open-schematic', drive: 'front', actuation: 'not-simulated' }}>
      <Gear position={[-100, -65, 200]} teeth={72} radius={91} bore={45} width={14} color={selected === 7 ? '#de934b' : '#78939b'} />
      <Gear position={[-100, ...MODEL.output]} teeth={30} radius={37.47} width={14} />
      <Shaft from={MODEL.outputFlanges[0]} to={MODEL.outputFlanges[1]} radius={15} color="#94a5a8" />
      {[-145, -55].map(axis => <group key={axis} position={[axis, -65, 200]} rotation={[0, 0, -Math.PI / 2]}>
        <Turned profile={[[16, -5], [52, -5], [52, 5], [16, 5], [16, -5]]} color="#657f88" />
        <Ring radius={34} tube={7} color="#a6b6b4" />
      </group>)}
      {[-1, 1].map(side => <Shaft key={side} from={[-145, -65 + side * 43, 220]} to={[-55, -65 + side * 43, 220]} radius={8} color="#6a8791" />)}
      {[-27, 27].map(offset => <mesh key={offset} position={[-100 + offset, -65, 200]} rotation={[0, 0, offset > 0 ? Math.PI / 2 : -Math.PI / 2]}><cylinderGeometry args={[15, 28, 15, 20]} /><meshStandardMaterial color="#9fafb0" metalness={0.7} roughness={0.4} /></mesh>)}
      <Shaft from={[-100, -102, 200]} to={[-100, -28, 200]} radius={9} />
      {[-24, 24].map(offset => <mesh key={offset} position={[-100, -65 + offset, 200]} rotation={[offset > 0 ? Math.PI : 0, 0, 0]}><cylinderGeometry args={[12, 23, 16, 16]} /><meshStandardMaterial color="#b0bdb8" metalness={0.7} roughness={0.4} /></mesh>)}
      {MODEL.outputFlanges.map((position, index) => <group key={index} name={`golf-differential-flange-${index}`} position={position} rotation={[0, 0, -Math.PI / 2]}>
        <Turned profile={[[15, -5], [45, -5], [45, 5], [15, 5], [15, -5]]} color="#8aa1a8" />
      </group>)}
    </group>
  </group>;
}