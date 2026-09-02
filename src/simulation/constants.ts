/**
 * Physical and model constants for the educational Otto-cycle simulation.
 * These are simplified, didactic values — not manufacturer specifications.
 */

/** Firing order for an inline-4 Otto engine. */
export const FIRING_ORDER: readonly [1, 3, 4, 2] = [1, 3, 4, 2];

/** Number of cylinders in the primary engine model. */
export const CYLINDER_COUNT = 4;

/** Full thermodynamic cycle span in degrees (four-stroke). */
export const CYCLE_DEGREES = 720;

/** Crank-to-cam ratio (crank turns twice per cam turn). */
export const CRANK_TO_CAM_RATIO = 2;

/** Universal gas constant for air (J / (kg*K)). */
export const R_AIR = 287.05;

/** Standard atmospheric pressure (Pa). */
export const P_ATMOSPHERE = 101_325;

/** Standard ambient temperature (K) ~ 20 C. */
export const T_AMBIENT = 293.15;

/** Stoichiometric air-fuel ratios (mass) — didactic starting values. */
export const AFR_STOICH = {
  gasoline: 14.7,
  ethanol: 9.0,
} as const;

/** Lower heating value (J/kg) — didactic approximations. */
export const LHV = {
  gasoline: 43.4e6,
  ethanol: 26.8e6,
} as const;

/** Default polytropic/adiabatic index for the working gas. */
export const GAMMA_DEFAULT = 1.33;

/** Wiebe combustion shape parameters (efficiency + completeness). */
export const WIEBE = {
  a: 5,
  m: 2,
} as const;

/**
 * Reference didactic numbers extracted conceptually from the reference manual.
 * Displayed only as labeled "reference material values", never as engineering
 * limits. See docs/CONTENT_SOURCES_AND_LIMITS.md.
 */
export const REFERENCE_VALUES = {
  normalCombustionDurationMs: [1, 4] as const,
  normalFlameSpeedKmh: 80,
  normalGasTempC: [1100, 1600] as const,
  preIgnitionPeakGasTempC: 2200,
  normalPeakPressureKpa: 4100,
  preIgnitionPeakPressureKpa: 8200,
  historicalOttoUsefulWorkFraction: 0.17,
  pistonSkirtTempC: [120, 200] as const,
} as const;

/** Safe editable ranges for the interactive parameters. */
export const PARAM_RANGES = {
  rpm: { min: 700, max: 7000, normal: 2500, step: 50 },
  throttle: { min: 0, max: 1, normal: 0.35, step: 0.01 },
  bore_mm: { min: 65, max: 95, normal: 77, step: 0.5 },
  stroke_mm: { min: 60, max: 100, normal: 85.8, step: 0.5 },
  conrod_mm: { min: 110, max: 180, normal: 133, step: 1 },
  compressionRatio: { min: 8, max: 14, normal: 10.5, step: 0.1 },
  ignitionAdvanceDeg: { min: -5, max: 45, normal: 18, step: 1 },
  lambda: { min: 0.7, max: 1.4, normal: 1.0, step: 0.01 },
  ambientTempC: { min: -10, max: 50, normal: 20, step: 1 },
  gamma: { min: 1.25, max: 1.4, normal: GAMMA_DEFAULT, step: 0.01 },
  combustionDurationDeg: { min: 30, max: 90, normal: 55, step: 1 },
  volumetricEfficiency: { min: 0.4, max: 1.1, normal: 0.85, step: 0.01 },
  frictionFactor: { min: 0.5, max: 2.0, normal: 1.0, step: 0.05 },
  boostBar: { min: 0, max: 1.2, normal: 0, step: 0.05 },
} as const;
