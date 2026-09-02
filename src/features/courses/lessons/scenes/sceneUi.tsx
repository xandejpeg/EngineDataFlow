/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Maximize2, Minimize2, TrendingDown, TrendingUp } from 'lucide-react';

const sceneWrap: CSSProperties = { position: 'relative', height: '100%' };
const overlay: CSSProperties = {
  position: 'absolute',
  left: 12,
  right: 12,
  bottom: 12,
  background: 'rgba(10,14,22,0.82)',
  border: '1px solid #253049',
  borderRadius: 10,
  padding: '10px 14px',
  backdropFilter: 'blur(6px)',
};
const sliderRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 };
const sliderLabel: CSSProperties = { fontSize: 12, color: '#b9c4d6', minWidth: 92 };
const fsBtn: CSSProperties = {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: 8,
  cursor: 'pointer',
  color: '#dfe6f2',
  background: 'rgba(10,14,22,0.72)',
  border: '1px solid #2a3346',
};
const fsHint: CSSProperties = {
  position: 'absolute',
  top: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 5,
  padding: '6px 14px',
  borderRadius: 999,
  fontSize: 13,
  color: '#dfe6f2',
  background: 'rgba(10,14,22,0.72)',
  border: '1px solid #2a3346',
};
const noticeBox: CSSProperties = {
  position: 'absolute',
  top: 12,
  left: '50%',
  zIndex: 6,
  width: 'min(520px, 82%)',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '11px 14px',
  borderRadius: 12,
  fontSize: 13,
  lineHeight: 1.4,
  fontWeight: 500,
  color: '#eef3fb',
  background: 'rgba(12,17,27,0.92)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
  backdropFilter: 'blur(6px)',
  transition: 'opacity 280ms ease, transform 280ms ease',
  pointerEvents: 'none',
};

export type SceneNoticeData = { key: number; text: string; tone: 'up' | 'down' | 'warn' };

export function Slider({
  label,
  value,
  min,
  max,
  step,
  color,
  onChange,
  valueLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (v: number) => void;
  valueLabel?: string;
}) {
  return (
    <div style={sliderRow}>
      <span style={sliderLabel}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: color }}
      />
      {valueLabel != null && (
        <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 44, textAlign: 'right' }}>
          {valueLabel}
        </span>
      )}
    </div>
  );
}

export function Readout({ items }: { items: { label: string; value: string; color: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 8 }}>
      {items.map((it) => (
        <div key={it.label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#7c8aa3', textTransform: 'uppercase' }}>{it.label}</div>
          <div
            style={{ fontSize: 15, fontFamily: 'var(--font-mono)', color: it.color, fontWeight: 700 }}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Envolve o canvas com um overlay de controles no rodape + botao de tela cheia. */
export function SceneShell({
  children,
  controls,
  onFullscreenChange,
}: {
  children: ReactNode;
  controls: ReactNode;
  onFullscreenChange?: (fs: boolean) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const active = document.fullscreenElement === wrapRef.current;
      setFs(active);
      onFullscreenChange?.(active);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [onFullscreenChange]);

  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrapRef.current?.requestFullscreen();
  };

  return (
    <div ref={wrapRef} style={{ ...sceneWrap, ...(fs ? { background: '#ffffff' } : null) }}>
      {children}
      <button
        type="button"
        onClick={toggle}
        aria-label={fs ? 'Sair da tela cheia' : 'Tela cheia'}
        style={fsBtn}
      >
        {fs ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
      {fs && (
        <div style={fsHint}>Arraste para girar e ver de varios angulos - role para dar zoom</div>
      )}
      <div style={overlay}>{controls}</div>
    </div>
  );
}

/** Aviso flutuante no topo da cena; reaparece a cada nova mensagem (key) e some sozinho. */
export function SceneNotice({ notice }: { notice: SceneNoticeData | null }) {
  const [shown, setShown] = useState<SceneNoticeData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notice) return;
    setShown(notice);
    setVisible(true);
    const id = window.setTimeout(() => setVisible(false), 4600);
    return () => window.clearTimeout(id);
  }, [notice]);

  if (!shown) return null;
  const accent = shown.tone === 'warn' ? '#ff7a45' : shown.tone === 'down' ? '#5b8def' : '#37d67a';
  const Icon = shown.tone === 'warn' ? AlertTriangle : shown.tone === 'down' ? TrendingDown : TrendingUp;
  return (
    <div
      style={{
        ...noticeBox,
        border: `1px solid ${accent}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, -10px)',
      }}
    >
      <Icon size={18} color={accent} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{shown.text}</span>
    </div>
  );
}

/** Seletor em botoes (ex.: trocar a lampada do circuito). */
export function Choice({
  label,
  options,
  value,
  color,
  onChange,
}: {
  label: string;
  options: string[];
  value: number;
  color: string;
  onChange: (i: number) => void;
}) {
  return (
    <div style={sliderRow}>
      <span style={sliderLabel}>{label}</span>
      <div style={{ display: 'flex', gap: 6, flex: 1 }}>
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(i)}
            style={{
              flex: 1,
              padding: '5px 4px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              border: `1px solid ${i === value ? color : '#2a3346'}`,
              background: i === value ? `${color}22` : 'transparent',
              color: i === value ? color : '#9fb0c8',
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Botao de interruptor (liga/desliga o circuito). */
export function SwitchButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        marginTop: 8,
        width: '100%',
        padding: '6px 10px',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 600,
        border: `1px solid ${on ? '#37d67a' : '#59667c'}`,
        background: on ? 'rgba(55,214,122,0.15)' : 'rgba(90,102,124,0.15)',
        color: on ? '#8ff0bd' : '#aab6c8',
      }}
    >
      Interruptor: {on ? 'LIGADO' : 'DESLIGADO'}
    </button>
  );
}
