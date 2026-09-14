import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function GolfStudioLighting({ night }: { night: boolean }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const previous = scene.environment;
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    generator.dispose();
    return () => { scene.environment = previous; environment.dispose(); };
  }, [gl, scene]);
  useEffect(() => {
    const previous = scene.environmentIntensity;
    scene.environmentIntensity = night ? 0.025 : 0.35;
    return () => { scene.environmentIntensity = previous; };
  }, [night, scene]);
  return null;
}