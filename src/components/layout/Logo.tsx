interface LogoProps {
  size?: number;
}

/** Original typographic + flow/cycle logo for EngineDataFlow (SVG, no third-party marks). */
export function Logo({ size = 26 }: LogoProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        role="img"
        aria-label="EngineDataFlow"
        fill="none"
      >
        <circle cx="20" cy="20" r="16" stroke="var(--accent-cyan)" strokeWidth="2" opacity="0.85" />
        <path
          d="M20 6 A14 14 0 0 1 34 20"
          stroke="var(--accent-violet)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="4.5" fill="var(--accent-amber)" />
        <circle cx="20" cy="20" r="4.5" fill="var(--accent-amber)">
          <animate attributeName="r" values="4.5;6;4.5" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <path d="M6 20 H13" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" />
        <path d="M27 20 H34" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span style={{ fontWeight: 700, letterSpacing: 0.3 }}>
        Engine<span style={{ color: 'var(--accent-cyan)' }}>Data</span>Flow
      </span>
    </span>
  );
}
