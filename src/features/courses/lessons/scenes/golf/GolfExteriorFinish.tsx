import { BODY_TOP } from './golfBodyProfile';
import { cabinPanelPoint } from './golfCabinSurface';
import { BODY_FINISH, bodyHalfWidth } from './golfBodyGeometry';
import { Casting, Shaft, Tube } from './GolfPrimitives';

export function GolfExteriorFinish({ ghost }: { ghost: boolean }) {
  const opacity = ghost ? 0.12 : 1;
  const antenna = cabinPanelPoint('roof', 0, 2570, 1450);
  return <group name="golf-exterior-finish" userData={{ dimensionalStatus: 'estimated' }}>
    {[-1, 1].map(side => <group key={side}>
      <Tube points={BODY_TOP.roof.slice(1, -2).map(([depth, height]) => {
        const point = cabinPanelPoint('roof', side * 0.93, depth, height);
        return [point[0], point[1] + 1, point[2]];
      })} radius={1.5} color="#68716f" opacity={opacity} />
      <Casting position={[side * 480, 999, 230]} size={[36, 9, 17]} radius={3} color={BODY_FINISH.trim} opacity={opacity} />
      <Tube points={Array.from({ length: 30 }, (_, index) => {
        const depth = 460 + index / 29 * 1670;
        return [side * (bodyHalfWidth(258, depth) - 8), 258, depth];
      })} radius={3} color="#424a48" opacity={opacity} />
    </group>)}
    <Casting position={antenna} size={[45, 15, 80]} radius={9} color="#242b2b" opacity={opacity} />
    <Tube points={[[antenna[0], antenna[1] + 6, antenna[2]], [antenna[0], antenna[1] + 195, antenna[2] + 115]]} radius={3.5} color="#252d2c" opacity={opacity} />
  </group>;
}

export function GolfUnderbodyFinish() {
  return <group name="golf-underbody-finish" userData={{ dimensionalStatus: 'estimated', representation: 'simplified-covers-not-factory-underbody' }}>
    <Casting position={[0, 205, -40]} size={[980, 12, 900]} radius={25} color="#252c2d" />
    {[-1, 1].map(side => <group key={side}>
      <Casting position={[side * 510, 255, 1260]} size={[340, 12, 1340]} radius={20} color="#303635" />
      <Shaft from={[side * 390, 198, -380]} to={[side * 390, 198, 350]} radius={4} color="#424a48" />
    </group>)}
  </group>;
}