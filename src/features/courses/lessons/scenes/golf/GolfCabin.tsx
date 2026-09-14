import { Casting, Shaft, Tube } from './GolfPrimitives';
import type { MutableRefObject } from 'react';
import type { GolfClock } from './golfPhysics';
import { GolfDashboard } from './GolfDashboard';
import { GolfCentreConsole } from './GolfCentreConsole';
import { GolfSeatPad } from './GolfSeatPad';
import { GolfFuelFlap } from './GolfFuelFlap';

function Upholstery({ position, size, color = '#343a3c' }: { position: [number, number, number]; size: [number, number, number]; color?: string }) {
  return <mesh position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={0.95} />
  </mesh>;
}

function FrontSeat({ side }: { side: number }) {
  return <group name={`golf-front-seat-${side}`} position={[side * 365, 0, 1190]}>
    {[-155, 155].map(offset => <group key={offset}>
      <Casting position={[offset, 350, 0]} size={[32, 25, 480]} color="#697173" />
      <Shaft from={[offset, 360, -150]} to={[offset, 445, -120]} radius={12} />
      <Shaft from={[offset, 360, 160]} to={[offset, 445, 130]} radius={12} />
    </group>)}
    <GolfSeatPad position={[0, 463, 0]} size={[450, 100, 470]} color="#252d30" />
    <GolfSeatPad position={[0, 505, -15]} size={[306, 32, 370]} />
    {[-185, 185].map(offset => <GolfSeatPad key={offset} position={[offset, 510, 0]} size={[82, 100, 435]} color="#303a3e" />)}
    {[-110, -55, 0, 55, 110].map(offset => <Tube key={offset} points={[[offset, 518, -145], [offset, 517, 0], [offset, 518, 128]]} radius={0.9} color="#697274" />)}
    <group position={[0, 735, 230]} rotation={[0.13, 0, 0]}>
      <GolfSeatPad size={[445, 110, 460]} rotation={[-Math.PI / 2, 0, 0]} color="#252d30" />
      <GolfSeatPad position={[0, 0, -54]} size={[310, 30, 375]} rotation={[-Math.PI / 2, 0, 0]} />
      {[-185, 185].map(offset => <GolfSeatPad key={offset} position={[offset, 0, -53]} size={[80, 85, 415]} rotation={[-Math.PI / 2, 0, 0]} color="#303a3e" />)}
      {[-110, -55, 0, 55, 110].map(offset => <Tube key={offset} points={[[offset, -150, -66], [offset, 0, -65], [offset, 145, -66]]} radius={0.9} color="#697274" />)}
      <Upholstery position={[0, -80, 57]} size={[290, 150, 8]} color="#1e282c" />
      <Tube points={[[-145, -6, 62], [0, -12, 65], [145, -6, 62]]} radius={3} color="#475154" />
      {[-75, 75].map(offset => <Shaft key={offset} from={[offset, 225, 0]} to={[offset, 320, 0]} radius={7} />)}
      <GolfSeatPad position={[0, 335, 0]} size={[265, 100, 155]} rotation={[-Math.PI / 2, 0, 0]} color="#303a3e" />
    </group>
    <Shaft from={[side * 230, 460, 185]} to={[side * 255, 460, 185]} radius={31} color="#22282a" />
    <Casting position={[-side * 245, 490, 100]} size={[28, 55, 40]} color="#ab333b" radius={6} />
  </group>;
}

export function GolfCabin({ clock, instruments = true }: { clock: MutableRefObject<GolfClock>; instruments?: boolean }) {
  return <group name="golf-cabin" userData={{ dimensionalStatus: 'estimated', representation: 'static', seats: 5 }}>
    <group name="golf-cabin-floor-lining" userData={{ dimensionalStatus: 'estimated', serviceChannels: 'visual-cover-not-rerouted-wiring' }}>
      <Upholstery position={[0, 325, 1240]} size={[1540, 16, 1880]} color="#272d30" />
      <Upholstery position={[0, 480, 2180]} size={[1320, 310, 20]} color="#272d30" />
      <Upholstery position={[0, 640, 2230]} size={[1320, 16, 120]} color="#272d30" />
      <GolfSeatPad position={[0, 365, 1740]} size={[230, 120, 820]} color="#272d30" />
      {[-1, 1].map(side => <group key={side}>
        <Upholstery position={[side * 415, 338, 1705]} size={[510, 8, 445]} color="#1c2428" />
        <Upholstery position={[side * 735, 355, 1250]} size={[38, 45, 1720]} color="#252f33" />
        <Upholstery position={[side * 690, 370, 1125]} size={[110, 12, 960]} color="#252f33" />
        <Upholstery position={[side * 636, 350, 1125]} size={[8, 40, 960]} color="#252f33" />
        <Upholstery position={[side * 590, 410, 1200]} size={[20, 95, 460]} color="#252f33" />
      </group>)}
    </group>
    <group name="golf-front-footwell-lining" userData={{ dimensionalStatus: 'estimated' }}>
      <group position={[0, 536, 427]} rotation={[-0.46, 0, 0]}><Upholstery position={[0, 0, 0]} size={[1510, 470, 16]} color="#30373a" /></group>
      {[-1, 1].map(side => <group key={side}>
        <Upholstery position={[side * 775, 361, 1245]} size={[60, 65, 1810]} color="#343b3e" />
        <Upholstery position={[side * 770, 515, 625]} size={[16, 310, 290]} color="#30373a" />
        <Upholstery position={[side * 388, 338, 827]} size={[480, 6, 590]} color="#1c2428" />
      </group>)}
    </group>
    {[-1, 1].map(side => <FrontSeat key={side} side={side} />)}
    <group name="golf-rear-bench">
      <GolfSeatPad position={[0, 710, 2010]} size={[1250, 110, 440]} color="#282e30" />
      {[-430, 0, 430].map(axis => <GolfSeatPad key={axis} position={[axis, 752, 2000]} size={[axis === 0 ? 280 : 360, 28, 355]} />)}
      <group position={[0, 935, 2210]} rotation={[0.12, 0, 0]}>
        <GolfSeatPad size={[1250, 100, 400]} rotation={[-Math.PI / 2, 0, 0]} color="#303a3e" />
        {[-430, 0, 430].map(axis => <group key={axis}>
          <GolfSeatPad position={[axis, 0, -50]} size={[axis === 0 ? 250 : 320, 26, 330]} rotation={[-Math.PI / 2, 0, 0]} />
          <Shaft from={[axis - 55, 200, 0]} to={[axis - 55, 265, 0]} radius={7} />
          <Shaft from={[axis + 55, 200, 0]} to={[axis + 55, 265, 0]} radius={7} />
          <GolfSeatPad position={[axis, 280, 0]} size={[240, 95, 130]} rotation={[-Math.PI / 2, 0, 0]} color="#303a3e" />
        </group>)}
      </group>
      {[-450, -210, 210, 450].map(axis => <Casting key={axis} position={[axis, 775, 2110]} size={[27, 28, 46]} radius={5} color="#9b3038" />)}
    </group>
    <GolfDashboard clock={clock} instruments={instruments} />
    <GolfCentreConsole />
    {[-1, 1].map(side => <group key={side} name={`golf-cabin-trim-${side}`}>
      <Tube points={[[side * 725, 1120, 1530], [side * 445, 820, 1420], [side * 155, 490, 1310]]} radius={9} color="#20282d" />
      <Tube points={[[side * 720, 1210, 2350], [side * 470, 1010, 2170], [side * 230, 775, 2130]]} radius={9} color="#20282d" />
      <Casting position={[side * 370, 1335, 905]} size={[330, 18, 125]} color="#929b98" radius={6} />
      <Shaft from={[side * 600, 1320, 1330]} to={[side * 600, 1320, 1460]} radius={10} color="#949d99" />
    </group>)}
    <group name="golf-cargo-area" userData={{ dimensionalStatus: 'estimated', parcelShelf: 'removed for unobstructed hatch access' }}>
      <Upholstery position={[0, 605, 2780]} size={[1000, 16, 800]} color="#30393b" />
      {[-1, 1].map(side => <group key={side} name={`golf-cargo-side-lining-${side}`}>
        <Upholstery position={[side * 550, 790, 2750]} size={[70, 350, 710]} color="#363f40" />
        <Upholstery position={[side * 530, 965, 2660]} size={[105, 18, 440]} color="#272f32" />
      </group>)}
      <Casting position={[0, 1235, 920]} size={[220, 80, 28]} color="#252d31" radius={8} />
      <Casting position={[0, 1235, 937]} size={[198, 58, 4]} color="#b5cacb" radius={3} />
      <Shaft from={[0, 1275, 900]} to={[0, 1340, 860]} radius={10} color="#252d31" />
    </group>
  </group>;
}

export function GolfExteriorDetails({ ghost }: { ghost: boolean }) {
  return <group name="golf-exterior-details" userData={{ dimensionalStatus: 'estimated' }}>
    <GolfFuelFlap ghost={ghost} />
  </group>;
}