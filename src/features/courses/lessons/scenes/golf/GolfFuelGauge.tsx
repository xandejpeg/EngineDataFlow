import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Casting, Connector, Ring, Shaft } from './GolfPrimitives';
import { fuelSenderSupply, type GolfClock } from './golfPhysics';
import { sampleFuelSender } from './golfFuelSender';
import { FUEL_GEOMETRY } from './golfFuelGeometry';

export function GolfFuelGauge({ clock }: { clock: MutableRefObject<GolfClock> }) {
  const needle = useRef<THREE.Group>(null);
  const reserve = useRef<THREE.MeshBasicMaterial>(null);
  const fault = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#12252a'; context.fillRect(0, 0, 256, 256);
    context.fillStyle = '#eef1e7'; context.font = '26px sans-serif'; context.textAlign = 'center';
    context.fillText('0', 39, 119); context.fillText('1/2', 128, 40); context.fillText('1', 217, 119);
    context.font = '20px sans-serif'; context.fillText('COMB.', 128, 190);
    context.strokeStyle = '#d2ddd7'; context.lineWidth = 3;
    for (let tick = 0; tick <= 8; tick += 1) {
      const angle = (tick / 8 - 0.5) * Math.PI * 0.8;
      context.beginPath(); context.moveTo(128 + Math.sin(angle) * 81, 139 - Math.cos(angle) * 81);
      context.lineTo(128 + Math.sin(angle) * 94, 139 - Math.cos(angle) * 94); context.stroke();
    }
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(() => {
    const sample = sampleFuelSender(clock.current.fuelSender, clock.current.fuel, fuelSenderSupply(clock.current));
    if (needle.current) needle.current.rotation.z = -sample.needleAngle;
    reserve.current?.color.set(sample.reserveLamp ? '#ffbc35' : '#413f31');
    fault.current?.color.set(sample.faultLamp ? '#ef4b49' : '#413533');
  });
  return <group name="golf-fuel-gauge" position={FUEL_GEOMETRY.gauge} userData={{ representation: 'didactic-instrument-not-vw-cluster' }}>
    <Casting position={[0, 0, -6]} size={[42, 42, 10]} radius={4} color="#263c40" />
    <Ring radius={19} tube={1} rotation={[0, 0, 0]} color="#a7b5b7" />
    <mesh><circleGeometry args={[18, 40]} /><meshBasicMaterial map={texture} /></mesh>
    <group name="golf-fuel-gauge-needle" ref={needle} position={[0, -1.5, 2]}><Shaft from={[0, 0, 0]} to={[0, 13, 0]} radius={0.6} color="#ed534f" /></group>
    <mesh name="golf-fuel-reserve-lamp" position={[-8, -11, 2]}><circleGeometry args={[1.7, 12]} /><meshBasicMaterial ref={reserve} /></mesh>
    <mesh name="golf-fuel-signal-lamp" position={[8, -11, 2]}><circleGeometry args={[1.7, 12]} /><meshBasicMaterial ref={fault} /></mesh>
    <group position={[0, -15, -12]}><Connector pins={4} width={20} /></group>
  </group>;
}