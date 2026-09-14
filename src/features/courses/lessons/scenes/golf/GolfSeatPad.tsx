import { useEffect, useMemo } from 'react';
import { createSeatPad } from './golfUpholsteryGeometry';

export function GolfSeatPad({ position = [0, 0, 0], size, color = '#424b4e', rotation = [0, 0, 0] }: {
  position?: [number, number, number]; size: [number, number, number]; color?: string; rotation?: [number, number, number];
}) {
  const [width, height, depth] = size;
  const geometry = useMemo(() => createSeatPad(width, height, depth), [width, height, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh position={position} rotation={rotation} geometry={geometry} dispose={null}>
    <meshStandardMaterial color={color} roughness={0.98} metalness={0} />
  </mesh>;
}