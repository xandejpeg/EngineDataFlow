import { useEffect, useMemo } from 'react';
import { DoubleSide, Path, Shape } from 'three';
import { BODY_FINISH, createBodySide } from './golfBodyGeometry';

export function GolfFuelFlap({ ghost }: { ghost: boolean }) {
  const geometry = useMemo(() => {
    const outline = new Shape();
    outline.absarc(2850, 960, 73, 0, Math.PI * 2, false);
    const hole = new Path();
    hole.absarc(2850, 960, 70, 0, Math.PI * 2, true);
    outline.holes.push(hole);
    const cap = new Shape();
    cap.absarc(2850, 960, 70, 0, Math.PI * 2, false);
    return { seam: createBodySide(outline, 1, 1.5), cap: createBodySide(cap, 1, 2) };
  }, []);
  useEffect(() => () => { geometry.seam.dispose(); geometry.cap.dispose(); }, [geometry]);
  return <group name="golf-fuel-flap" userData={{ dimensionalStatus: 'estimated', actuation: 'static' }}>
    <mesh geometry={geometry.seam} dispose={null}><meshStandardMaterial color="#42494b" side={DoubleSide} transparent={ghost} opacity={ghost ? 0.1 : 1} /></mesh>
    <mesh geometry={geometry.cap} dispose={null}><meshStandardMaterial color={BODY_FINISH.paint} metalness={0.35} roughness={0.3} side={DoubleSide} transparent={ghost} opacity={ghost ? 0.1 : 1} /></mesh>
  </group>;
}