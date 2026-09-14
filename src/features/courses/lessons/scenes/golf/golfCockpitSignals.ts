import { circuitOpen, sampleGolf, type GolfClock } from './golfPhysics';

export function sampleCockpit(clock: GolfClock) {
  const powered = clock.operation !== 'off' && !circuitOpen(clock, 'main') && !circuitOpen(clock, 'instrument');
  const rpm = powered ? sampleGolf(clock).rpm : 0;
  const temperature = powered ? clock.temperature : null;
  const angle = (fraction: number) => (1 - 2 * Math.max(0, Math.min(1, fraction))) * Math.PI * 2 / 3;
  return {
    powered, rpm, temperature,
    rpmAngle: angle(rpm / 8000),
    temperatureAngle: angle(temperature === null ? 0 : (temperature - 50) / 80),
    hot: powered && clock.temperature >= 115,
  };
}