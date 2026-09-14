import { useEffect, useMemo } from 'react';
import { BufferGeometry, CanvasTexture, DoubleSide, Float32BufferAttribute, PlaneGeometry, SRGBColorSpace } from 'three';
import { BODY_FINISH, bodyHalfWidth } from './golfBodyGeometry';
import { BODY_TOP } from './golfBodyProfile';
import { fitRearDetail, rearPanelPoint, rearPanelSplit } from './golfBodyFit';
import { REAR_HATCH_ROWS } from './golfRearSurface';
import { HATCH_PIVOT } from './golfBodyWiring';
import { Tube } from './GolfPrimitives';

function RearLettering({ label, across, ghost }: { label: string; across: number; ghost: boolean }) {
  const geometry = useMemo(() => fitRearDetail(new PlaneGeometry(148, 28, 24, 6), 1, [(across - rearPanelSplit(832)) * 800, 832], 7), [across]);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 96;
    const context = canvas.getContext('2d')!;
    context.font = '600 68px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.strokeStyle = '#465052'; context.lineWidth = 3;
    context.strokeText(label, 256, 48);
    context.fillStyle = '#e0e5e4';
    context.fillText(label, 256, 48);
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    return result;
  }, [label]);
  useEffect(() => () => { texture.dispose(); geometry.dispose(); }, [texture, geometry]);
  return <mesh name={`golf-rear-lettering-${label}`} geometry={geometry} dispose={null}>
    <meshStandardMaterial map={texture} transparent alphaTest={0.1} opacity={ghost ? 0.1 : 1} metalness={0.5} roughness={0.35} side={DoubleSide} />
  </mesh>;
}

export function GolfRearTrim({ ghost }: { ghost: boolean }) {
  const spoiler = useMemo(() => {
    const profile = [[-60, -9], [-38, 9], [30, 12], [65, -1], [48, -16], [-46, -19]];
    const positions: number[] = [];
    const indices: number[] = [];
    const width = bodyHalfWidth(HATCH_PIVOT[1], HATCH_PIVOT[2]) * 0.97;
    for (let column = 0; column <= 48; column++) {
      const across = column / 24 - 1;
      for (const [depth, height] of profile) positions.push(across * width, HATCH_PIVOT[1] + height + 16 * (1 - across * across), HATCH_PIVOT[2] + depth - 20 * across * across);
      if (column < 48) for (let edge = 0; edge < profile.length; edge++) {
        const first = column * profile.length + edge;
        const next = column * profile.length + (edge + 1) % profile.length;
        indices.push(first, next, first + profile.length, next, next + profile.length, first + profile.length);
      }
    }
    for (let edge = 1; edge < profile.length - 1; edge++) {
      indices.push(0, edge + 1, edge);
      const last = 48 * profile.length;
      indices.push(last, last + edge, last + edge + 1);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => spoiler.dispose(), [spoiler]);
  const opacity = ghost ? 0.1 : 1;
  const rows = BODY_TOP.rearGlass.slice(1, -1);
  return <group name="golf-rear-trim" userData={{ dimensions: 'estimated', defroster: 'visual-only' }}>
    {[-1, 1].map(side => <Tube key={`hatch-seam-${side}`} points={REAR_HATCH_ROWS.map(([, height]) => {
      const across = side * rearPanelSplit(height);
      return rearPanelPoint(across, height + (1 - across * across) * 14, 2);
    })} radius={1.6} color="#42494b" opacity={opacity} />)}
    <Tube points={Array.from({ length: 33 }, (_, index) => {
      const across = (index / 16 - 1) * rearPanelSplit(710);
      return rearPanelPoint(across, 710 + (1 - across * across) * 14, 2);
    })} radius={1.6} color="#42494b" opacity={opacity} />
    <mesh name="golf-hatch-spoiler" geometry={spoiler} dispose={null}><meshStandardMaterial color={BODY_FINISH.paint} metalness={0.35} roughness={0.3} transparent={ghost} opacity={opacity} side={DoubleSide} /></mesh>
    {[-1, 1].map(side => <Tube key={side} points={rows.map(([, height]) => rearPanelPoint(side * (rearPanelSplit(height) - 0.02), height, 2))} radius={3.2} color={BODY_FINISH.trim} opacity={opacity} />)}
    {[rows[0][1], rows[rows.length - 1][1]].map(height => <Tube key={height} points={Array.from({ length: 33 }, (_, index) => rearPanelPoint((index / 16 - 1) * (rearPanelSplit(height) - 0.02), height, 2))} radius={3.2} color={BODY_FINISH.trim} opacity={opacity} />)}
    {Array.from({ length: 10 }, (_, index) => 1100 + index * 28).map(height => <Tube key={height} points={Array.from({ length: 17 }, (_, column) => rearPanelPoint((column / 8 - 1) * (rearPanelSplit(height) - 0.06), height, 2))} radius={0.7} color="#796a52" opacity={ghost ? 0.03 : 0.55} />)}
    <RearLettering label="GOLF" across={-0.48} ghost={ghost} />
    <RearLettering label="2.0 FSI" across={0.46} ghost={ghost} />
  </group>;
}