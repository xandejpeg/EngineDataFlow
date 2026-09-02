import { useTelemetry } from '@/components/useTelemetry';
import { fmt } from '@/simulation/format';

/**
 * Accessible textual summary of the scene and current state, for users who
 * cannot use the 3D visualization. Rendered as a visually-hidden live region.
 */
export function SceneSummary() {
  const frame = useTelemetry();
  if (!frame) return null;
  const sel = frame.cylinders[frame.selectedCylinderIndex];

  const text = `Motor Ciclo Otto quatro cilindros. Rotacao ${fmt.int(frame.config.rpm)} rpm, angulo do virabrequim ${fmt.int(
    frame.clock.crankAngleDeg,
  )} graus. Cilindro ${sel?.cylinderNumber} na fase de ${phasePt(sel?.phase)}. Torque medio ${fmt.n1(
    frame.performance.torqueMeanNm,
  )} newton-metro, potencia ${fmt.kw(frame.performance.powerW)} kW. Temperatura do liquido ${fmt.celsius(
    frame.cooling.coolantTempK,
  )} graus Celsius, pressao de oleo ${fmt.bar(frame.lubrication.oilPressurePa)} bar. Risco de detonacao ${fmt.pct(
    frame.combustionQuality.knockRisk,
  )}.`;

  return (
    <div className="visually-hidden" role="status" aria-live="polite">
      {text}
    </div>
  );
}

function phasePt(phase?: string): string {
  switch (phase) {
    case 'intake':
      return 'admissao';
    case 'compression':
      return 'compressao';
    case 'power':
      return 'combustao e expansao';
    case 'exhaust':
      return 'escape';
    default:
      return '-';
  }
}
