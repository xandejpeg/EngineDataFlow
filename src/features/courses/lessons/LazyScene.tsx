import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Monta a cena 3D so quando entra na viewport (evita muitos canvases WebGL juntos). */
export function LazyScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '300px 0px',
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height: '100%' }}>
      {visible ? (
        children
      ) : (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7c8aa3',
            fontSize: 12,
          }}
        >
          Carregando 3D...
        </div>
      )}
    </div>
  );
}
