import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { GolfClock } from './golfPhysics';
import { sampleCockpit } from './golfCockpitSignals';
import { COCKPIT } from './golfCockpitGeometry';
import { Ring, Shaft } from './GolfPrimitives';

export function GolfCockpitInstruments({ clock }: { clock: MutableRefObject<GolfClock> }) {
  const root = useRef<THREE.Group>(null);
  const needles = useRef<(THREE.Group | null)[]>([]);
  const faces = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const warning = useRef<THREE.MeshBasicMaterial>(null);
  const textures = useMemo(() => ['rpm', 'temperature'].map(kind => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#11181c'; context.fillRect(0, 0, 512, 512);
    context.textAlign = 'center'; context.textBaseline = 'middle';
    for (let tick = 0; tick <= 32; tick++) {
      const angle = -Math.PI * 7 / 6 + tick / 32 * Math.PI * 4 / 3;
      const major = tick % 4 === 0;
      context.strokeStyle = tick >= 28 ? '#de6555' : '#e8eeea'; context.lineWidth = major ? 6 : 3;
      context.beginPath(); context.moveTo(256 + Math.cos(angle) * (major ? 187 : 199), 256 + Math.sin(angle) * (major ? 187 : 199));
      context.lineTo(256 + Math.cos(angle) * 217, 256 + Math.sin(angle) * 217); context.stroke();
      if (major && (kind === 'rpm' || tick % 8 === 0)) {
        context.fillStyle = '#e8eeea'; context.font = '32px sans-serif';
        context.fillText(String(kind === 'rpm' ? tick / 4 : 50 + tick * 2.5), 256 + Math.cos(angle) * 155, 256 + Math.sin(angle) * 155);
      }
    }
    context.fillStyle = '#b8d1db'; context.font = '27px sans-serif'; context.fillText(kind === 'rpm' ? 'rpm x1000' : '\u00b0C', 256, 335);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }), []);
  useEffect(() => () => textures.forEach(texture => texture.dispose()), [textures]);
  useFrame(() => {
    const sample = sampleCockpit(clock.current);
    needles.current.forEach((needle, index) => { if (needle) needle.rotation.z = index === 0 ? sample.rpmAngle : sample.temperatureAngle; });
    faces.current.forEach(face => face?.color.set(sample.powered ? '#ffffff' : '#6e7477'));
    warning.current?.color.set(sample.hot ? '#ff4836' : '#352424');
    if (root.current) Object.assign(root.current.userData, sample);
  });
  return <group ref={root} name="golf-cockpit-instruments" userData={{ representation: 'didactic-rpm-and-coolant-not-vw-cluster' }}>
    {COCKPIT.instruments.map((position, index) => <group key={index} position={position}>
      <Ring radius={53} tube={3} rotation={[0, 0, 0]} color="#a8b1b4" />
      <mesh><circleGeometry args={[50, 64]} /><meshBasicMaterial map={textures[index]} ref={material => { faces.current[index] = material; }} /></mesh>
      <group name={`golf-cockpit-${index === 0 ? 'rpm' : 'temperature'}-needle`} ref={object => { needles.current[index] = object; }} position={[0, 0, 3]}>
        <Shaft from={[0, -7, 0]} to={[0, 41, 0]} radius={1.3} color="#e64a43" />
      </group>
      <mesh position={[0, 0, 5]}><circleGeometry args={[4, 16]} /><meshBasicMaterial color="#384146" /></mesh>
      {index === 1 && <mesh name="golf-cockpit-hot-lamp" position={[0, -32, 3]}><circleGeometry args={[3, 16]} /><meshBasicMaterial ref={warning} /></mesh>}
    </group>)}
  </group>;
}