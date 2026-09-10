import { useMemo } from 'react';
import * as THREE from 'three';

type Section = [depth: number, height: number, halfWidth: number, crown: number];

function Panel({ sections, glass = false, ghost }: { sections: Section[]; glass?: boolean; ghost: boolean }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    sections.forEach(([depth, height, halfWidth, crown], row) => {
      for (let column = 0; column <= 16; column++) {
        const across = column / 8 - 1;
        positions.push(across * halfWidth, height + (1 - across * across) * crown, depth);
        if (row < sections.length - 1 && column < 16) {
          const base = row * 17 + column;
          indices.push(base, base + 17, base + 1, base + 1, base + 17, base + 18);
        }
      }
    });
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, [sections]);
  const opacity = ghost ? glass ? 0.04 : 0.065 : glass ? 0.3 : 1;
  return <mesh geometry={geometry}>
    <meshStandardMaterial color={glass ? '#97bbbf' : '#a92335'} metalness={glass ? 0.2 : 0.45} roughness={glass ? 0.12 : 0.27} side={THREE.DoubleSide} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} />
  </mesh>;
}

export function GolfBodyShell({ ghost }: { ghost: boolean }) {
  return <group name="golf-body-shell" userData={{ dimensionalStatus: 'estimated' }}>
    <Panel ghost={ghost} sections={[[-827, 725, 825, 10], [-720, 775, 837, 25], [-400, 875, 837, 30], [0, 926, 837, 22], [390, 970, 837, 8]]} />
    <Panel ghost={ghost} glass sections={[[390, 973, 817, 8], [620, 1190, 817, 12], [840, 1395, 817, 12]]} />
    <Panel ghost={ghost} sections={[[840, 1395, 837, 12], [1000, 1442, 837, 18], [1500, 1465, 837, 20], [2100, 1450, 837, 14], [2390, 1390, 837, 10]]} />
    <Panel ghost={ghost} glass sections={[[2390, 1385, 817, 10], [2710, 1240, 817, 12], [3050, 1090, 817, 8]]} />
    <Panel ghost={ghost} sections={[[3050, 1090, 837, 10], [3300, 970, 837, 10], [3340, 865, 837, 6], [3329, 645, 837, 0]]} />
  </group>;
}