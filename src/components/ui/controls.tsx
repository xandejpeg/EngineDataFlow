import type { ReactNode } from 'react';
import './ui.css';

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="panel">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  hint?: string;
  normal?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  hint,
  normal,
  format,
  onChange,
}: SliderProps) {
  const display = format ? format(value) : value.toString();
  return (
    <div className="field">
      <div className="field-head">
        <label className="field-label">{label}</label>
        <span className="field-value mono">
          {display}
          {unit && <span className="stat-unit">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      {(hint || normal !== undefined) && (
        <div className="field-hint">
          {normal !== undefined && <>Normal: {format ? format(normal) : normal} {unit} · </>}
          {hint}
        </div>
      )}
    </div>
  );
}

export function Stat({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value mono" style={color ? { color } : undefined}>
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="toggle-row">
      <span className="field-label">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`switch${checked ? ' on' : ''}`}
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          className={o.value === value ? 'active' : ''}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
