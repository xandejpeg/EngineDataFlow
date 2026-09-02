import {
  kelvinToCelsius,
  kwToHp,
  m3ToCm3,
  m3ToLiters,
  paToBar,
  paToKpa,
  radPerSecToRpm,
  wattToKw,
} from './units';

const nf = (digits: number) =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmt = {
  int: (v: number) => nf(0).format(Math.round(v)),
  n1: (v: number) => nf(1).format(v),
  n2: (v: number) => nf(2).format(v),
  pct: (v: number) => `${nf(0).format(v * 100)}%`,
  pct1: (v: number) => `${nf(1).format(v * 100)}%`,
  bar: (pa: number) => nf(2).format(paToBar(pa)),
  kpa: (pa: number) => nf(0).format(paToKpa(pa)),
  celsius: (k: number) => nf(0).format(kelvinToCelsius(k)),
  celsius1: (k: number) => nf(1).format(kelvinToCelsius(k)),
  kw: (w: number) => nf(1).format(wattToKw(w)),
  hp: (w: number) => nf(1).format(kwToHp(wattToKw(w))),
  cm3: (m3: number) => nf(0).format(m3ToCm3(m3)),
  liters: (m3: number) => nf(2).format(m3ToLiters(m3)),
  rpmFromOmega: (w: number) => nf(0).format(radPerSecToRpm(w)),
};

export { kelvinToCelsius, paToBar, paToKpa };
