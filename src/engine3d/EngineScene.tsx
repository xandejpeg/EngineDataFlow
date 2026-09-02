import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Environment, Lightformer } from '@react-three/drei';
import { FourCylinderEngine } from './procedural/FourCylinderEngine';
import { useUiStore, type CameraPreset } from '@/state/uiStore';
import { useSimulationStore } from '@/state/simulationStore';
import { computeLayout } from './layout';

const CAMERA_POSITIONS: Record<CameraPreset, [number, number, number]> = {
  perspective: [12, 7.5, 13.5],
  front: [0, 2, 22],
  side: [24, 3, 0],
  top: [0, 26, 0.01],
  cylinderCut: [4, 4, 14],
  crankshaft: [10, -2, 12],
  head: [0, 14, 10],
  intake: [-10, 6, 12],
  exhaust: [10, 6, -12],
  lubrication: [8, -4, 14],
  cooling: [-12, 8, 10],
};

function CameraRig() {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const cameraPreset = useUiStore((s) => s.cameraPreset);
  const cameraNonce = useUiStore((s) => s.cameraNonce);
  const { camera } = useThree();

  useEffect(() => {
    const target = CAMERA_POSITIONS[cameraPreset] ?? CAMERA_POSITIONS.perspective;
    camera.position.set(...target);
    camera.lookAt(0, 3, 0);
    if (controls.current) {
      controls.current.target.set(0, 3, 0);
      controls.current.update();
    }
  }, [cameraPreset, cameraNonce, camera]);

  return (
    <OrbitControls
      ref={controls}
      enablePan
      minDistance={6}
      maxDistance={60}
      target={[0, 3, 0]}
      makeDefault
    />
  );
}

export function EngineScene() {
  const quality = useUiStore((s) => s.quality);
  const config = useSimulationStore((s) => s.config);
  const layout = computeLayout(config);
  const dpr: [number, number] = quality === 'low' ? [0.6, 1] : quality === 'high' ? [1, 2] : [1, 1.5];

  return (
    <Canvas
      shadows={quality !== 'low'}
      dpr={dpr}
      camera={{ position: CAMERA_POSITIONS.perspective, fov: 42, near: 0.1, far: 500 }}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#0a0e16']} />
      <fog attach="fog" args={['#0a0e16', 40, 90]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[12, 20, 10]} intensity={1.1} castShadow={quality !== 'low'} />
      <directionalLight position={[-14, 8, -8]} intensity={0.4} color="#88aaff" />
      <pointLight position={[0, 6, 12]} intensity={0.6} color="#2fd6e0" />

      <Suspense fallback={<SceneLoader />}>
        <Environment resolution={128}>
          <Lightformer intensity={2.0} position={[0, 6, 8]} scale={[14, 10, 1]} />
          <Lightformer intensity={1.0} position={[-8, 3, 6]} scale={[6, 12, 1]} color="#dbe6ff" />
          <Lightformer intensity={0.8} position={[8, -1, 6]} scale={[8, 10, 1]} color="#ffedd0" />
        </Environment>
        <FourCylinderEngine />
      </Suspense>

      <Grid
        position={[0, layout.crankCenterY - layout.crankRadiusU * 3, 0]}
        args={[80, 80]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#1c2740"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#2a3a5c"
        fadeDistance={70}
        infiniteGrid
      />

      <CameraRig />
    </Canvas>
  );
}

function SceneLoader() {
  return (
    <Html center>
      <div style={{ color: 'var(--text-1)', fontSize: 13 }}>Montando o motor...</div>
    </Html>
  );
}
