/**
 * Coherent color coding for fluids, energy and states used across the whole app
 * (3D scene, charts, legends, panels).
 */
export const FLUID_COLORS = {
  air: '#7fc4ff', // ar admitido - azul claro
  fuel: '#ffcf4d', // combustivel - ambar
  mixture: '#3fe0d0', // mistura - ciano
  spark: '#e6ccff', // centelha - branco-violeta
  flame: '#ff8a3d', // frente de chama
  flameHot: '#ff3b30', // combustao intensa
  detonation: '#ff2fd0', // detonacao - vermelho-violeta
  preIgnition: '#ff5a3c', // pre-ignicao
  exhaust: '#9aa3ad', // gases de escape
  exhaustHot: '#d9603a', // escape superaquecido
  oil: '#e3a72f', // oleo - dourado
  coolantCold: '#4d9dff', // liquido frio
  coolantHot: '#e0d24a', // liquido aquecido
  coolantOverheat: '#ff4d4d',
  data: '#b46bff', // dados/sinais - violeta
  fault: '#ff4d4d', // falha
  warning: '#ffb020', // alerta
  normal: '#37d67a', // normal
} as const;

export type FluidColorKey = keyof typeof FLUID_COLORS;

/** Interpolated coolant color from cold to overheating (temperature in C). */
export function coolantColor(tempC: number): string {
  if (tempC < 85) return FLUID_COLORS.coolantCold;
  if (tempC < 105) return FLUID_COLORS.coolantHot;
  return FLUID_COLORS.coolantOverheat;
}

/** Status color for a 0..1 risk index. */
export function riskColor(risk: number): string {
  if (risk < 0.35) return FLUID_COLORS.normal;
  if (risk < 0.65) return FLUID_COLORS.warning;
  return FLUID_COLORS.fault;
}
