/**
 * Unit conversion helpers. The simulation core works internally in SI units
 * (meters, radians, pascals, kelvin, seconds, newton-meters, watts). Conversions
 * happen only at the edge of the UI.
 */

export const PI = Math.PI;
export const TWO_PI = Math.PI * 2;

// Angle
export const degToRad = (deg: number): number => (deg * PI) / 180;
export const radToDeg = (rad: number): number => (rad * 180) / PI;

// Pressure
export const paToBar = (pa: number): number => pa / 1e5;
export const paToKpa = (pa: number): number => pa / 1e3;
export const barToPa = (bar: number): number => bar * 1e5;
export const kpaToPa = (kpa: number): number => kpa * 1e3;

// Temperature
export const kelvinToCelsius = (k: number): number => k - 273.15;
export const celsiusToKelvin = (c: number): number => c + 273.15;

// Volume
export const m3ToCm3 = (m3: number): number => m3 * 1e6;
export const m3ToLiters = (m3: number): number => m3 * 1e3;
export const cm3ToM3 = (cm3: number): number => cm3 / 1e6;

// Length
export const mToMm = (m: number): number => m * 1e3;
export const mmToM = (mm: number): number => mm / 1e3;

// Power
export const wattToKw = (w: number): number => w / 1e3;
export const wattToHp = (w: number): number => w / 735.49875; // metric horsepower (cv)
export const kwToHp = (kw: number): number => (kw * 1000) / 735.49875;

// Rotation
export const rpmToRadPerSec = (rpm: number): number => (TWO_PI * rpm) / 60;
export const radPerSecToRpm = (w: number): number => (w * 60) / TWO_PI;

/** Clamp a value into an inclusive range. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Map a value from one range to another, clamped. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
};

/** Normalize an angle in radians into [0, 2*PI). */
export const normalizeAngle = (rad: number): number => {
  let a = rad % TWO_PI;
  if (a < 0) a += TWO_PI;
  return a;
};

/** Normalize an angle in degrees into [0, 720). */
export const normalizeCycleAngleDeg = (deg: number): number => {
  let a = deg % 720;
  if (a < 0) a += 720;
  return a === 0 ? 0 : a; // avoid negative zero
};
