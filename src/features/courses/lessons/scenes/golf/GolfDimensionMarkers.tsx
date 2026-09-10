import { Html, Line } from '@react-three/drei';
import { VEHICLE_WHEELS, wheelDimension, type VehicleWheelId } from './golfVehicleGeometry';

export function GolfDimensionMarkers({ selected, select }: { selected: VehicleWheelId; select: (id: VehicleWheelId) => void }) {
  const dimension = wheelDimension(selected);
  const color = '#9c4913';
  const label = `${dimension.wheel.axle === 'front' ? 'Dianteira' : 'Traseira'} ${dimension.wheel.side < 0 ? 'esquerda' : 'direita'}`;
  return <group name="golf-dimension-markers" userData={{ selected, heightMm: dimension.heightMm }}>
    {VEHICLE_WHEELS.flatMap(wheel => (['hub', 'arch'] as const).map(kind => <mesh
      key={`${wheel.id}-${kind}`} name={`golf-dimension-${wheel.id}-${kind}`} position={wheel[kind]}
      renderOrder={20} userData={{ dimensionPoint: true, wheel: wheel.id, kind }}
      onClick={event => { event.stopPropagation(); select(wheel.id); }}>
      {kind === 'hub' ? <sphereGeometry args={[27, 16, 12]} /> : <boxGeometry args={[42, 42, 42]} />}
      <meshBasicMaterial color={wheel.id === selected ? color : '#137789'} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>))}
    <Line points={[dimension.wheel.hub, dimension.lower]} color={color} lineWidth={1} depthTest={false} depthWrite={false} renderOrder={21} />
    <Line points={[dimension.wheel.arch, dimension.upper]} color={color} lineWidth={1} depthTest={false} depthWrite={false} renderOrder={21} />
    <Line points={[dimension.lower, dimension.upper]} color={color} lineWidth={2} depthTest={false} depthWrite={false} renderOrder={21} />
    {[dimension.lower, dimension.upper].map((position, index) => <mesh key={index} position={[position[0], position[1] + (index === 0 ? 12 : -12), position[2]]} rotation={[0, 0, index === 0 ? Math.PI : 0]} renderOrder={22}>
      <coneGeometry args={[11, 24, 12]} /><meshBasicMaterial color={color} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>)}
    <Html position={dimension.label} center zIndexRange={[3, 0]} pointerEvents="none">
      <div className="golf-dimension-label" data-dimension-label={selected}>
        <span>{label}</span><strong>{dimension.heightMm.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mm</strong>
        <small>Contorno nominal</small>
      </div>
    </Html>
  </group>;
}