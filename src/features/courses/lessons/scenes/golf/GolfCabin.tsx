import { Casting, Ring, Shaft, Tube } from './GolfPrimitives';

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
    <Casting position={[0, 455, 0]} size={[450, 100, 470]} color="#252b2d" radius={30} />
    <Upholstery position={[0, 512, -10]} size={[300, 26, 365]} />
    {[-193, 193].map(offset => <Casting key={offset} position={[offset, 515, 0]} size={[66, 85, 440]} color="#303638" radius={20} />)}
    <group position={[0, 735, 230]} rotation={[0.13, 0, 0]}>
      <Casting size={[445, 460, 110]} color="#252b2d" radius={32} />
      <Upholstery position={[0, 0, -59]} size={[310, 375, 20]} />
      {[-190, 190].map(offset => <Casting key={offset} position={[offset, 0, -65]} size={[65, 415, 65]} color="#303638" radius={20} />)}
      {[-75, 75].map(offset => <Shaft key={offset} from={[offset, 225, 0]} to={[offset, 320, 0]} radius={7} />)}
      <Casting position={[0, 335, 0]} size={[265, 155, 100]} color="#303638" radius={25} />
    </group>
    <Shaft from={[side * 230, 460, 185]} to={[side * 255, 460, 185]} radius={31} color="#22282a" />
    <Casting position={[-side * 245, 490, 100]} size={[28, 55, 40]} color="#ab333b" radius={6} />
  </group>;
}

export function GolfCabin() {
  return <group name="golf-cabin" userData={{ dimensionalStatus: 'estimated', representation: 'static', seats: 5 }}>
    <Upholstery position={[0, 317, 1110]} size={[1350, 16, 1200]} color="#272d30" />
    {[-1, 1].map(side => <FrontSeat key={side} side={side} />)}
    <group name="golf-rear-bench">
      <Casting position={[0, 710, 2010]} size={[1250, 110, 440]} color="#282e30" radius={30} />
      <group position={[0, 935, 2210]} rotation={[0.12, 0, 0]}>
        <Casting size={[1250, 400, 100]} color="#303638" radius={30} />
        {[-430, 0, 430].map(axis => <group key={axis}>
          <Upholstery position={[axis, 0, -54]} size={[axis === 0 ? 250 : 320, 330, 16]} />
          <Shaft from={[axis - 55, 200, 0]} to={[axis - 55, 265, 0]} radius={7} />
          <Shaft from={[axis + 55, 200, 0]} to={[axis + 55, 265, 0]} radius={7} />
          <Casting position={[axis, 280, 0]} size={[240, 130, 95]} radius={23} color="#303638" />
        </group>)}
      </group>
      {[-450, -210, 210, 450].map(axis => <Casting key={axis} position={[axis, 775, 2110]} size={[27, 28, 46]} radius={5} color="#9b3038" />)}
    </group>
    <group name="golf-dashboard">
      <Casting position={[0, 885, 710]} size={[1370, 160, 260]} radius={25} color="#252d31" />
      <Casting position={[0, 791, 755]} size={[1330, 80, 180]} radius={14} color="#434a4c" />
      <Casting position={[390, 755, 861]} size={[420, 155, 20]} radius={6} color="#30383c" />
      <Casting position={[390, 805, 877]} size={[100, 12, 8]} color="#919b9e" />
      {[-590, -130, 130, 590].map(axis => <group key={axis} position={[axis, 900, 845]}>
        <Casting size={[130, 62, 10]} color="#121b20" />
        {[-18, -6, 6, 18].map(height => <Casting key={height} position={[0, height, 7]} size={[112, 3, 4]} color="#687477" radius={1} />)}
      </group>)}
      <Casting position={[-380, 960, 788]} size={[380, 110, 180]} radius={25} color="#1d2529" />
      {[-465, -315].map(axis => <group key={axis} position={[axis, 951, 883]}>
        <Ring radius={53} tube={4} rotation={[0, 0, 0]} color="#aab5b7" />
        <mesh><circleGeometry args={[49, 32]} /><meshStandardMaterial color="#111d22" /></mesh>
        <Shaft from={[0, 0, 3]} to={[-20, 27, 3]} radius={2} color="#d13942" />
        {Array.from({ length: 9 }, (_, index) => <group key={index} rotation={[0, 0, index * Math.PI / 6 - Math.PI * 2 / 3]}><Casting position={[0, 42, 2]} size={[3, 7, 2]} color="#d2dbd8" radius={0.5} /></group>)}
      </group>)}
      <Casting position={[0, 815, 862]} size={[205, 100, 16]} radius={4} color="#101c22" />
      <Casting position={[0, 825, 873]} size={[150, 48, 3]} radius={1} color="#597e83" />
      {[-66, 0, 66].map(axis => <group key={axis} position={[axis, 722, 858]}>
        <Shaft from={[0, 0, 0]} to={[0, 0, 22]} radius={22} color="#141d21" />
        <Casting position={[0, 13, 24]} size={[3, 9, 3]} color="#e0dfd0" radius={1} />
      </group>)}
    </group>
    <group name="golf-centre-console">
      <Casting position={[0, 440, 1050]} size={[240, 240, 660]} radius={20} color="#30383b" />
      <Casting position={[0, 570, 990]} size={[145, 18, 160]} radius={6} color="#8b969a" />
      <mesh position={[0, 600, 990]}><coneGeometry args={[58, 72, 16]} /><meshStandardMaterial color="#20292d" roughness={0.9} /></mesh>
      <Shaft from={[0, 620, 990]} to={[0, 690, 980]} radius={12} color="#384145" />
      <mesh position={[0, 698, 980]} scale={[1, 0.75, 1]}><sphereGeometry args={[30, 16, 12]} /><meshStandardMaterial color="#adb8ba" /></mesh>
      <Shaft from={[-60, 575, 1300]} to={[-60, 610, 1135]} radius={17} color="#20292d" />
      {[-53, 53].map(axis => <group key={axis} position={[axis, 565, 1250]}><Ring radius={38} tube={5} color="#121d22" /></group>)}
      <Casting position={[0, 660, 1390]} size={[215, 65, 190]} radius={15} color="#252e32" />
    </group>
    {[-1, 1].map(side => <group key={side} name={`golf-cabin-trim-${side}`}>
      {[1120, 1960].map(depth => <group key={depth} position={[side * 775, 655, depth]}>
        <Casting size={[38, 470, 730]} radius={12} color="#343d40" />
        <Casting position={[-side * 32, 0, 30]} size={[65, 60, 340]} radius={14} color="#202a2f" />
        <Casting position={[-side * 26, 120, -180]} size={[20, 27, 120]} radius={6} color="#a3afb0" />
        <Casting position={[-side * 26, -150, 40]} size={[25, 100, 490]} radius={12} color="#202a2f" />
      </group>)}
      <Tube points={[[side * 725, 1120, 1530], [side * 445, 820, 1420], [side * 155, 490, 1310]]} radius={9} color="#20282d" />
      <Tube points={[[side * 720, 1210, 2350], [side * 470, 1010, 2170], [side * 230, 775, 2130]]} radius={9} color="#20282d" />
      <Casting position={[side * 370, 1335, 905]} size={[330, 18, 125]} color="#929b98" radius={6} />
      <Shaft from={[side * 600, 1320, 1330]} to={[side * 600, 1320, 1460]} radius={10} color="#949d99" />
    </group>)}
    <group name="golf-cargo-area">
      <Upholstery position={[0, 605, 2780]} size={[1000, 16, 800]} color="#30393b" />
      <Casting position={[0, 1050, 2640]} size={[1120, 20, 670]} color="#363f40" radius={5} />
      <Casting position={[0, 1235, 920]} size={[220, 80, 28]} color="#252d31" radius={8} />
      <Casting position={[0, 1235, 937]} size={[198, 58, 4]} color="#b5cacb" radius={3} />
      <Shaft from={[0, 1275, 900]} to={[0, 1340, 860]} radius={10} color="#252d31" />
    </group>
  </group>;
}

export function GolfExteriorDetails({ ghost }: { ghost: boolean }) {
  const opacity = ghost ? 0.2 : 1;
  return <group name="golf-exterior-details" userData={{ dimensionalStatus: 'estimated' }}>
    {[-1, 1].map(side => <group key={side}>
      <group position={[side * 915, 995, 580]}>
        <Shaft from={[-side * 90, -35, 30]} to={[0, 0, 0]} radius={18} color="#252f33" />
        <Casting size={[150, 105, 180]} color="#a92335" radius={25} opacity={opacity} />
        <Casting position={[0, 0, 92]} size={[125, 78, 5]} radius={8} color="#bdd1d2" opacity={opacity} />
      </group>
      {[1400, 2200].map(depth => <Casting key={depth} position={[side * 873, 907, depth]} size={[20, 30, 145]} radius={8} color="#aab3b3" opacity={opacity} />)}
      <Casting position={[side * 860, 580, 1390]} size={[20, 40, 1760]} color="#242d31" radius={5} opacity={opacity} />
      {[1575, 2330].map(depth => <Tube key={depth} points={[[side * 858, 945, depth], [side * 858, 700, depth + 25], [side * 858, 390, depth - 35]]} radius={2} color="#431e27" opacity={opacity} />)}
      <Casting position={[side * 595, 460, -890]} size={[180, 75, 15]} radius={12} color="#253035" opacity={opacity} />
      <Shaft from={[side * 610, 460, -900]} to={[side * 610, 460, -910]} radius={27} color="#cbd8d5" />
      <Tube points={[[side * 570, 985, 470], [side * 280, 1000, 485], [side * 80, 1010, 500]]} radius={5} color="#202c30" opacity={opacity} />
    </group>)}
    <Casting position={[0, 460, -898]} size={[690, 92, 10]} color="#18282c" radius={4} opacity={opacity} />
    {[-30, 0, 30].map(height => <Casting key={height} position={[0, 696 + height, -901]} size={[570, 8, 7]} color="#8c9b9d" radius={2} opacity={opacity} />)}
    <Ring position={[0, 707, -910]} rotation={[0, 0, 0]} radius={37} tube={5} color="#c3cdcb" />
    <Casting position={[0, 1030, 3200]} size={[1210, 28, 125]} color="#a92335" radius={8} opacity={opacity} />
    <Casting position={[0, 575, 3335]} size={[380, 90, 8]} color="#d4dbd8" radius={3} opacity={opacity} />
    <Casting position={[873, 895, 2850]} size={[10, 135, 145]} color="#9d2637" radius={10} opacity={opacity} />
  </group>;
}