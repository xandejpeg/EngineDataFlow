import { useEffect, useMemo } from 'react';
import { BODY_FINISH } from './golfBodyGeometry';
import { createMirrorFace, createMirrorShell } from './golfMirrorGeometry';
import { Casting } from './GolfPrimitives';

export function GolfDoorMirror({ side, ghost }: { side: number; ghost: boolean }) {
  const geometry = useMemo(() => ({ shell: createMirrorShell(side), bezel: createMirrorFace(side, true), glass: createMirrorFace(side) }), [side]);
  useEffect(() => () => Object.values(geometry).forEach(part => part.dispose()), [geometry]);
  const opacity = ghost ? 0.12 : 1;
  return <group name={`golf-mirror-assembly-${side}`} userData={{ dimensionalStatus: 'estimated', adjustment: 'static', glass: 'tinted-surface-not-live-reflection' }}>
    <group position={[-side * 83, -22, 28]} rotation={[0, 0, side * -0.24]}>
      <Casting size={[85, 35, 75]} color={BODY_FINISH.trim} radius={11} opacity={opacity} />
    </group>
    <mesh name={`golf-mirror-shell-${side}`} geometry={geometry.shell} dispose={null}>
      <meshStandardMaterial attach="material-0" color={BODY_FINISH.paint} metalness={0.35} roughness={0.3} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
      <meshStandardMaterial attach="material-1" color={BODY_FINISH.trim} metalness={0.05} roughness={0.8} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
    </mesh>
    <mesh name={`golf-mirror-bezel-${side}`} geometry={geometry.bezel} dispose={null}>
      <meshStandardMaterial color="#17252b" roughness={0.8} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
    </mesh>
    <mesh name={`golf-mirror-glass-${side}`} geometry={geometry.glass} dispose={null}>
      <meshStandardMaterial color="#9eafb3" metalness={0.7} roughness={0.17} transparent={ghost} opacity={opacity} depthWrite={!ghost} />
    </mesh>
  </group>;
}