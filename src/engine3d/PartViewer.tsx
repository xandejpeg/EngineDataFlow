import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { PART_ANNOTATIONS, PART_GLB, PART_MODELS } from './parts/partModels';

interface PartViewerProps {
  partId: string;
  autoRotate?: boolean;
  height?: number;
  defaultSource?: 'proc' | 'glb';
}

/** Carrega um GLB local. Suspende ate carregar; erros sao capturados pelo boundary. */
function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/** Boundary que troca para o modelo procedural se o GLB falhar ao carregar. */
class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Visualizador 3D interativo de uma peca procedural (offline, sem ativos remotos).
 * O canvas WebGL so e montado quando o card entra na viewport e e desmontado ao
 * sair, evitando esgotar o numero de contextos WebGL do navegador quando ha
 * muitos visualizadores na mesma pagina.
 */
export function PartViewer({ partId, autoRotate = true, height = 220, defaultSource = 'proc' }: PartViewerProps) {
  const Part = PART_MODELS[partId];
  const annotations = PART_ANNOTATIONS[partId] ?? [];
  const glbUrl = PART_GLB[partId];
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [source, setSource] = useState<'proc' | 'glb'>(glbUrl ? defaultSource : 'proc');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Sem margem: o navegador so aguenta ~16 contextos WebGL vivos ao mesmo tempo.
      { rootMargin: '0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!Part) return null;
  const showingGlb = source === 'glb' && !!glbUrl;
  const labelsVisible = showLabels && !showingGlb;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', height, borderRadius: 8, overflow: 'hidden', background: '#0a0e16' }}
    >
      <div style={topBarStyle}>
        {glbUrl && (
          <button onClick={() => setSource((s) => (s === 'glb' ? 'proc' : 'glb'))} style={pillStyle}>
            {showingGlb ? 'Procedural' : 'Malha Meshy'}
          </button>
        )}
        {annotations.length > 0 && !showingGlb && (
          <button onClick={() => setShowLabels((v) => !v)} aria-pressed={showLabels} style={pillStyle}>
            {showLabels ? 'Rotulos on' : 'Rotulos off'}
          </button>
        )}
      </div>

      {visible ? (
        <Canvas camera={{ position: [3, 2, 4], fov: 40 }} dpr={[1, 1.5]}>
          <color attach="background" args={['#0a0e16']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 6, 4]} intensity={1.1} />
          <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#88aaff" />
          <Suspense fallback={null}>
            <Stage environment={null} intensity={0.3} adjustCamera={1.2} shadows={false}>
              {showingGlb ? (
                <ModelBoundary fallback={<Part />}>
                  <GltfModel url={glbUrl} />
                </ModelBoundary>
              ) : (
                <>
                  <Part />
                  {labelsVisible &&
                    annotations.map((a, i) => (
                      <Html key={i} position={a.pos} center style={{ pointerEvents: 'none' }}>
                        <div style={labelStyle}>{a.label}</div>
                      </Html>
                    ))}
                </>
              )}
            </Stage>
          </Suspense>
          <OrbitControls
            enablePan={false}
            autoRotate={autoRotate && !labelsVisible}
            autoRotateSpeed={1.6}
            minDistance={2.5}
            maxDistance={9}
          />
        </Canvas>
      ) : (
        <div style={placeholderStyle}>Modelo 3D</div>
      )}
    </div>
  );
}

const topBarStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 3,
  display: 'flex',
  gap: 6,
};

const pillStyle: React.CSSProperties = {
  fontSize: 11,
  padding: '3px 8px',
  borderRadius: 6,
  border: '1px solid #33425f',
  background: 'rgba(10,14,22,0.8)',
  color: '#b9c4d6',
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  background: 'rgba(10,14,22,0.85)',
  border: '1px solid #33425f',
  borderRadius: 6,
  color: '#eef3fb',
  fontSize: 10.5,
  lineHeight: 1.2,
  padding: '2px 6px',
  whiteSpace: 'nowrap',
  transform: 'translateY(-2px)',
};

const placeholderStyle: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-2)',
  fontSize: 12,
};
