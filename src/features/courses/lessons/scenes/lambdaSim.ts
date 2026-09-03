/**
 * Modelo simplificado da sonda lambda usado nas cenas da aula.
 * Nao e um modelo fisico exato: e a curva e o comportamento que o mecanico ve
 * na tela do osciloscopio e no scanner.
 */

/** Tensao da celula de zirconia (banda estreita), em mV, a partir do fator lambda. */
export function nernstMv(lambda: number): number {
  // Curva quase vertical em lambda = 1: 900 mV rica, 450 mV estequiometria, 100 mV pobre.
  return 100 + 800 / (1 + Math.exp((lambda - 1) / 0.006));
}

/** Corrente de bombeamento da sonda de banda larga, em mA (positiva = mistura pobre). */
export function pumpMa(lambda: number): number {
  if (lambda >= 1) return Math.min(2.5, 2.55 * (1 - Math.exp(-(lambda - 1) * 1.15)));
  return -Math.min(2.2, 8.0 * (1 - lambda));
}

export type MixtureFault = 'ok' | 'air-leak' | 'leaky-injector';

/** Lambda que o motor produziria SEM correcao da ECU, por defeito simulado. */
export function baseLambda(fault: MixtureFault): number {
  if (fault === 'air-leak') return 1.09; // entrada de ar falsa -> pobre
  if (fault === 'leaky-injector') return 0.9; // injetor vazando -> rica
  return 1.0;
}

export interface LoopState {
  /** Correcao de combustivel acumulada pela ECU (fuel trim), em fracao. */
  trim: number;
  /** Fila de atraso: tempo entre injetar e a sonda "sentir" (gas percorre o escape). */
  delay: number[];
  /** Lambda que chega na sonda agora. */
  sensed: number;
  /** Temperatura da ceramica, em °C. */
  tempC: number;
}

export function newLoopState(): LoopState {
  return { trim: 0, delay: new Array(28).fill(1), sensed: 1, tempC: 20 };
}

export interface LoopParams {
  fault: MixtureFault;
  closedLoop: boolean;
  /** Ganho do integrador da ECU (quanto ela corrige por segundo). */
  gain: number;
  heaterOn: boolean;
}

/** Avanca a simulacao da malha fechada em dt segundos. */
export function stepLoop(s: LoopState, dt: number, p: LoopParams): LoopState {
  // A sonda so gera sinal acima de ~300 °C; ate la a ECU fica em malha aberta.
  const targetT = p.heaterOn ? 780 : 250;
  s.tempC += (targetT - s.tempC) * Math.min(1, dt * 0.55);
  const alive = s.tempC > 300;

  // Lambda produzido agora = base do defeito, deslocado pela correcao da ECU.
  const produced = baseLambda(p.fault) * (1 + s.trim);

  // Atraso de transporte: e ele que faz a sonda oscilar em vez de estabilizar.
  s.delay.push(produced);
  s.sensed = s.delay.shift() ?? 1;

  if (p.closedLoop && alive) {
    // A sonda so diz o LADO. Entao a ECU integra em uma direcao ate cruzar,
    // passa do ponto e volta: nasce a oscilacao permanente de 1 a 2 Hz.
    const rich = nernstMv(s.sensed) > 450;
    s.trim += (rich ? 1 : -1) * p.gain * dt;
    s.trim = Math.max(-0.3, Math.min(0.3, s.trim));
  }
  return s;
}

/** Estado textual da mistura para os avisos da cena. */
export function mixtureLabel(mv: number): 'rica' | 'pobre' | 'lambda = 1' {
  if (mv > 600) return 'rica';
  if (mv < 300) return 'pobre';
  return 'lambda = 1';
}

/** Potencia media entregue ao aquecedor por um sinal PWM de 12 V. */
export function pwmAverageV(duty: number): number {
  return 12 * duty;
}

/** Rampa de duty que a ECU aplica para nao trincar a ceramica no arranque. */
export function heaterRampDuty(t: number): number {
  // Comeca baixo (agua condensada no escape) e sobe ate o patamar de regulacao.
  return Math.min(0.85, 0.1 + t * 0.09);
}
