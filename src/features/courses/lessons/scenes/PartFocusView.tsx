/**
 * Visualizacao isolada de uma peca: some tudo do mapa e fica so ela, o que ela
 * toca de verdade e um texto do lado explicando o que e, como funciona, quais
 * sao os fios do conector e como se testa.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import { Edges, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import { PART_MODELS } from '@/engine3d/parts/partModels';
import { Flow, GLASS, Run, type Vec3 } from './mapPrimitives';
import { GROUP_META, MOTRONIC_ITEMS, type MapItem } from './motronicMap';
import { PART_FOCUS, type FocusBox, type FocusPart, type FocusPipe, type PartFocus } from './partFocus';

const BG = '#ffffff';
const LABEL = '#475569';

function Label({ textPt, pos, title = false }: { textPt: string; pos: Vec3; title?: boolean }) {
  return (
    <group position={pos} userData={{ labelText: textPt, isTitle: title }}>
      <Text
        fontSize={title ? 0.32 : 0.24}
        color={title ? '#0f172a' : LABEL}
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
        outlineWidth={title ? 0.05 : 0.035}
        outlineColor={BG}
      >
        {textPt}
      </Text>
    </group>
  );
}

/** Clona antes de mexer: material de GLB e compartilhado entre instancias. */
function dimMaterial(m: THREE.Material): THREE.Material {
  if (m.userData.dimmed) return m;
  const c = m.clone();
  c.transparent = true;
  c.opacity = 0.3;
  c.depthWrite = false;
  c.userData.dimmed = true;
  return c;
}

function FocusPartNode({ part, titlePt }: { part: FocusPart; titlePt?: string }) {
  const g = useRef<THREE.Group>(null);
  const Part = PART_MODELS[part.partId];
  const [titleAt, setTitleAt] = useState<Vec3 | null>(null);

  // O nome fica em cima da peca, medindo o corpo dela depois que o modelo carrega.
  useEffect(() => {
    if (!titlePt) return;
    const measure = () => {
      const o = g.current;
      if (!o) return;
      const box = new THREE.Box3().setFromObject(o);
      if (box.isEmpty()) return;
      setTitleAt([(box.min.x + box.max.x) / 2, box.max.y + 0.62, part.pos[2]]);
    };
    const raf = requestAnimationFrame(measure);
    const late = setTimeout(measure, 1100);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
    };
  }, [titlePt, part]);

  useEffect(() => {
    if (!part.dim) return;
    const apply = () => {
      g.current?.traverse((o) => {
        const mesh = o as THREE.Mesh;
        const mat = mesh.material;
        if (!mat) return;
        mesh.material = Array.isArray(mat) ? mat.map(dimMaterial) : dimMaterial(mat);
      });
    };
    const raf = requestAnimationFrame(apply);
    const late = setTimeout(apply, 1200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
    };
  }, [part]);

  if (!Part) return null;
  return (
    <group>
      <group position={part.pos}>
        <group ref={g} scale={part.scale} rotation={part.rot} userData={{ bodyName: part.partId }}>
          <Part />
        </group>
      </group>
      {part.labelPt && (
        <Label
          textPt={part.labelPt}
          pos={part.labelAt ?? [part.pos[0], part.pos[1] + 1.4, part.pos[2]]}
        />
      )}
      {titlePt && titleAt && <Label textPt={titlePt} pos={part.titleAt ?? titleAt} title />}
    </group>
  );
}

function FocusBoxNode({ box }: { box: FocusBox }) {
  return (
    <group>
      <mesh position={box.pos} userData={box.glass ? undefined : { bodyName: 'caixa' }}>
        <boxGeometry args={box.size} />
        {box.glass ? (
          <meshStandardMaterial {...GLASS} />
        ) : (
          <meshStandardMaterial color={box.color ?? '#3d4657'} metalness={0.35} roughness={0.65} />
        )}
        <Edges threshold={20} color={box.glass ? '#7f93ad' : '#69768c'} />
      </mesh>
      {box.labelPt && (
        <Label
          textPt={box.labelPt}
          pos={box.labelAt ?? [box.pos[0], box.pos[1] - box.size[1] / 2 - 0.5, box.pos[2]]}
        />
      )}
    </group>
  );
}

function FocusPipeNode({ pipe, flowOn }: { pipe: FocusPipe; flowOn: boolean }) {
  return (
    <group>
      {pipe.tube !== false && (
        <group userData={{ pipePoints: pipe.points }}>
          <Run points={pipe.points} r={pipe.r} color={pipe.color} />
        </group>
      )}
      {pipe.flow && flowOn && (
        <Flow
          points={pipe.points}
          color={pipe.flow}
          count={9}
          speed={pipe.flowSpeed ?? 0.16}
          size={Math.max(0.12, pipe.r * 1.6)}
          gated={pipe.gated}
        />
      )}
      {pipe.labelPt && pipe.labelAt && <Label textPt={pipe.labelPt} pos={pipe.labelAt} />}
    </group>
  );
}

/** Anda pelo traçado do cano e diz se ele passa por dentro do retangulo do texto. */
function crossesText(pts: Vec3[], cx: number, cy: number, halfW: number): boolean {
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    for (let s = 0; s <= 20; s++) {
      const u = s / 20;
      if (Math.abs(ax + (bx - ax) * u - cx) < halfW && Math.abs(ay + (by - ay) * u - cy) < 0.3) return true;
    }
  }
  return false;
}

/** So em dev: avisa no console quando uma legenda cai por cima de um corpo. */
function useLabelOverlapCheck(root: React.RefObject<THREE.Group>, focus: PartFocus) {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const t = setTimeout(() => {
      const o = root.current;
      if (!o) return;
      const bodies: { name: string; box: THREE.Box3 }[] = [];
      const tubes: Vec3[][] = [];
      const labels: { text: string; at: THREE.Vector3; title: boolean }[] = [];
      o.traverse((n) => {
        if (n.userData.bodyName) bodies.push({ name: String(n.userData.bodyName), box: new THREE.Box3().setFromObject(n) });
        else if (n.userData.pipePoints) tubes.push(n.userData.pipePoints as Vec3[]);
        else if (n.userData.labelText)
          labels.push({
            text: String(n.userData.labelText),
            at: n.getWorldPosition(new THREE.Vector3()),
            title: Boolean(n.userData.isTitle),
          });
      });
      for (const l of labels) {
        const halfW = Math.min(5, l.text.length * 0.125) / 2;
        const r = (v: number) => Math.round(v * 100) / 100;
        if (Math.abs(l.at.x) > 9 || Math.abs(l.at.y) > 6.5) {
          console.warn(`[foco] legenda "${l.text}" fora do quadro em x ${r(l.at.x)} y ${r(l.at.y)}`);
        }
        // O nome da peca e grande: nao pode cair nem em cima de fio ou mangueira.
        if (l.title && tubes.some((pts) => crossesText(pts, l.at.x, l.at.y, halfW))) {
          console.warn(
            `[foco] titulo "${l.text}" cai sobre um fio` +
              ` | texto x[${r(l.at.x - halfW)} ${r(l.at.x + halfW)}] y ${r(l.at.y)}`,
          );
        }
        for (const b of bodies) {
          const overX = l.at.x + halfW > b.box.min.x && l.at.x - halfW < b.box.max.x;
          const overY = l.at.y > b.box.min.y - 0.18 && l.at.y < b.box.max.y + 0.18;
          if (!overX || !overY) continue;
          console.warn(
            `[foco] legenda "${l.text}" cai sobre ${b.name}` +
              ` | corpo x[${r(b.box.min.x)} ${r(b.box.max.x)}] y[${r(b.box.min.y)} ${r(b.box.max.y)}]` +
              ` | texto x[${r(l.at.x - halfW)} ${r(l.at.x + halfW)}] y ${r(l.at.y)}`,
          );
        }
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [root, focus]);
}

function FocusStage({ focus, flowOn, item }: { focus: PartFocus; flowOn: boolean; item: MapItem }) {
  const root = useRef<THREE.Group>(null);
  useLabelOverlapCheck(root, focus);
  // A peca do numero recebe o nome dela em cima; as outras sao so contexto.
  const subject = focus.parts.findIndex((p) => p.partId === item.partId && !p.dim);
  return (
    <group ref={root}>
      {focus.boxes?.map((b, i) => <FocusBoxNode key={i} box={b} />)}
      {focus.pipes?.map((p, i) => <FocusPipeNode key={i} pipe={p} flowOn={flowOn} />)}
      {focus.parts.map((p, i) => (
        <FocusPartNode key={i} part={p} titlePt={i === subject && !p.labelPt ? item.namePt : undefined} />
      ))}
      {focus.labels?.map((l, i) => <Label key={i} textPt={l.textPt} pos={l.pos} />)}
    </group>
  );
}

const panel: React.CSSProperties = {
  width: 'min(430px, 34vw)',
  flexShrink: 0,
  overflowY: 'auto',
  padding: '22px 24px 32px',
  background: '#0d1220',
  borderLeft: '1px solid #223049',
  color: '#dbe4f2',
};

const h4: React.CSSProperties = {
  fontSize: 10.5,
  letterSpacing: 0.8,
  fontWeight: 800,
  color: '#7c8ba5',
  textTransform: 'uppercase',
  margin: '22px 0 8px',
};

const para: React.CSSProperties = {
  fontSize: 13.5,
  lineHeight: 1.62,
  color: '#c2cee0',
  margin: '0 0 10px',
};

const navBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '7px 12px',
  borderRadius: 8,
  fontSize: 12.5,
  fontWeight: 600,
  cursor: 'pointer',
  color: '#c9d5e8',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #2a3852',
};

/** Itens que ja tem conteudo escrito, na ordem do mapa. */
function withFocus(): MapItem[] {
  return MOTRONIC_ITEMS.filter((i) => i.numero in PART_FOCUS);
}

export function PartFocusView({ numero, onClose }: { numero: number; onClose: () => void }) {
  const [n, setN] = useState(numero);
  const [flowOn, setFlowOn] = useState(true);
  const list = useMemo(withFocus, []);

  useEffect(() => setN(numero), [numero]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const item = MOTRONIC_ITEMS.find((i) => i.numero === n);
  const focus = PART_FOCUS[n];
  if (!item || !focus) return null;

  const color = GROUP_META[item.group].color;
  const idx = list.findIndex((i) => i.numero === n);
  const hasFlow = focus.pipes?.some((p) => p.flow) ?? false;
  const go = (d: number) => {
    const next = list[idx + d];
    if (next) setN(next.numero);
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        background: '#0a0e16',
      }}
    >
      <div style={{ flex: 1, position: 'relative', background: BG }}>
        <Canvas
          key={n}
          camera={{ position: [0, 0.4, focus.camDist ?? 11], fov: 46 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
        >
          <color attach="background" args={[BG]} />
          <ambientLight intensity={1.0} />
          <directionalLight position={[6, 8, 10]} intensity={1.0} />
          <directionalLight position={[-8, 3, -5]} intensity={0.5} />
          <Suspense fallback={null}>
            <FocusStage focus={focus} flowOn={flowOn} item={item} />
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan
            target={focus.camTarget ?? [0, 0, 0]}
            minDistance={3}
            maxDistance={26}
          />
        </Canvas>

        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '7px 13px 7px 8px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.94)',
            border: `1px solid ${color}`,
            boxShadow: '0 6px 18px rgba(15,23,42,0.14)',
          }}
        >
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 24,
              height: 24,
              borderRadius: 999,
              background: color,
              color: '#fff',
              fontSize: 12.5,
              fontWeight: 800,
            }}
          >
            {item.numero}
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{item.namePt}</span>
        </div>

        {hasFlow && (
          <button
            type="button"
            onClick={() => setFlowOn((v) => !v)}
            style={{
              position: 'absolute',
              right: 14,
              top: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              color: flowOn ? '#0f172a' : '#64748b',
              background: flowOn ? 'rgba(255,255,255,0.94)' : 'rgba(241,245,249,0.9)',
              border: `1px solid ${flowOn ? color : '#cbd5e1'}`,
              boxShadow: '0 6px 18px rgba(15,23,42,0.14)',
            }}
          >
            {flowOn ? <Pause size={14} /> : <Play size={14} />}
            {flowOn ? 'fluxo ligado' : 'fluxo desligado'}
          </button>
        )}

        <div style={{ position: 'absolute', left: 14, bottom: 14, display: 'flex', gap: 8 }}>
          <button type="button" style={navBtn} onClick={() => go(-1)} disabled={idx <= 0}>
            <ChevronLeft size={15} /> anterior
          </button>
          <button
            type="button"
            style={navBtn}
            onClick={() => go(1)}
            disabled={idx < 0 || idx >= list.length - 1}
          >
            proxima <ChevronRight size={15} />
          </button>
          <span style={{ ...navBtn, cursor: 'default', border: '1px solid transparent' }}>
            {idx + 1} de {list.length}
          </span>
        </div>
      </div>

      <aside style={panel}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: 0.7, fontWeight: 700, color }}>
              {GROUP_META[item.group].labelPt.toUpperCase()}
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: '#f1f5fb', margin: '3px 0 0' }}>
              {item.namePt}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
              color: '#c9d5e8',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #2a3852',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p
          style={{
            ...para,
            marginTop: 14,
            fontSize: 14.5,
            color: '#e6edf8',
            borderLeft: `3px solid ${color}`,
            paddingLeft: 12,
          }}
        >
          {focus.oneLinePt}
        </p>

        <h4 style={h4}>Como funciona</h4>
        {focus.bodyPt.map((t, i) => (
          <p key={i} style={para}>
            {t}
          </p>
        ))}

        <h4 style={h4}>O que aparece junto na cena</h4>
        <p style={para}>{focus.contextPt}</p>

        {focus.pinsPt && (
          <>
            <h4 style={h4}>Conector</h4>
            {focus.pinsPt.map((p, i) => (
              <div
                key={i}
                style={{ display: 'flex', gap: 9, alignItems: 'baseline', marginBottom: 7 }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 999,
                    background: p.color,
                    flexShrink: 0,
                    transform: 'translateY(1px)',
                  }}
                />
                <span style={{ fontSize: 13, lineHeight: 1.5 }}>
                  <b style={{ color: '#e6edf8' }}>{p.pinPt}</b>
                  <span style={{ color: '#a9b7cc' }}> — {p.whatPt}</span>
                </span>
              </div>
            ))}
          </>
        )}

        <h4 style={h4}>Teste e sintomas</h4>
        <ul style={{ margin: 0, paddingLeft: 17 }}>
          {focus.testPt.map((t, i) => (
            <li key={i} style={{ ...para, marginBottom: 8 }}>
              {t}
            </li>
          ))}
        </ul>
      </aside>
    </div>,
    document.body,
  );
}
