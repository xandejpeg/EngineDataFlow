import type {
  ActuatorCommand,
  CycleEvent,
  SensorReading,
  TelemetryFrame,
} from './types';
import { combustionStartDeg } from './combustion';
import { cylinderPhaseOffsetDeg } from './phasing';
import { kelvinToCelsius, normalizeCycleAngleDeg, paToBar, paToKpa, radPerSecToRpm, rpmToRadPerSec } from './units';

/** Build the sensor list for the Data Flow view (values reflect current frame). */
export function buildSensors(frame: TelemetryFrame): SensorReading[] {
  const sel = frame.cylinders[frame.selectedCylinderIndex];
  return [
    {
      id: 'ckp',
      labelPt: 'Sensor de rotacao (CKP)',
      quantity: 'Rotacao / posicao do virabrequim',
      unit: 'rpm',
      value: frame.config.rpm,
      updateHz: 200,
      consumers: ['ECU: ignicao', 'ECU: injecao'],
    },
    {
      id: 'map',
      labelPt: 'Sensor de pressao do coletor (MAP)',
      quantity: 'Pressao de admissao',
      unit: 'kPa',
      value: paToKpa(frame.intakeExhaust.manifoldPressurePa),
      updateHz: 100,
      consumers: ['ECU: carga', 'ECU: injecao'],
    },
    {
      id: 'iat',
      labelPt: 'Sensor de temperatura do ar (IAT)',
      quantity: 'Temperatura do ar admitido',
      unit: 'C',
      value: kelvinToCelsius(frame.config.ambientTempK + 10),
      updateHz: 5,
      consumers: ['ECU: densidade do ar'],
    },
    {
      id: 'ect',
      labelPt: 'Sensor de temperatura do liquido (ECT)',
      quantity: 'Temperatura do arrefecimento',
      unit: 'C',
      value: kelvinToCelsius(frame.cooling.coolantTempK),
      updateHz: 2,
      consumers: ['ECU: enriquecimento a frio', 'ECU: eletroventilador'],
    },
    {
      id: 'o2',
      labelPt: 'Sonda lambda (O2)',
      quantity: 'Mistura ar-combustivel',
      unit: 'lambda',
      value: frame.mixture.lambda,
      updateHz: 20,
      consumers: ['ECU: correcao de combustivel'],
    },
    {
      id: 'knock',
      labelPt: 'Sensor de detonacao (knock)',
      quantity: 'Vibracao de detonacao',
      unit: 'indice',
      value: frame.combustionQuality.knockRisk,
      updateHz: 500,
      consumers: ['ECU: recuo de avanco'],
    },
    {
      id: 'tps',
      labelPt: 'Sensor de borboleta (TPS)',
      quantity: 'Abertura da borboleta',
      unit: '%',
      value: frame.config.throttle * 100,
      updateHz: 100,
      consumers: ['ECU: carga', 'ECU: aceleracao'],
    },
    {
      id: 'oilp',
      labelPt: 'Sensor de pressao de oleo',
      quantity: 'Pressao de lubrificacao',
      unit: 'bar',
      value: paToBar(frame.lubrication.oilPressurePa),
      updateHz: 2,
      consumers: ['Painel: alerta de oleo'],
    },
    {
      id: 'cyl-press',
      labelPt: `Pressao do cilindro ${sel?.cylinderNumber ?? 1} (didatico)`,
      quantity: 'Pressao instantanea',
      unit: 'bar',
      value: sel ? paToBar(sel.pressurePa) : 0,
      updateHz: 1000,
      consumers: ['Visualizacao', 'Graficos'],
    },
  ];
}

/** Build the actuator command list (ECU decisions -> outputs). */
export function buildActuators(frame: TelemetryFrame): ActuatorCommand[] {
  return [
    {
      id: 'injectors',
      labelPt: 'Injetores multiponto',
      value: frame.mixture.fuelMassFlowKgs * 1e6,
      unit: 'mg/s',
      source: 'ECU: mapa de injecao + correcao lambda',
    },
    {
      id: 'coils',
      labelPt: 'Bobinas (avanco de ignicao)',
      value: frame.ignition.advanceDeg,
      unit: 'graus APMS',
      source: 'ECU: mapa de ignicao - recuo por knock',
    },
    {
      id: 'fan',
      labelPt: 'Eletroventilador',
      value: frame.cooling.fanOn ? 1 : 0,
      unit: 'on/off',
      source: 'ECU: limiar de temperatura',
    },
    {
      id: 'wastegate',
      labelPt: 'Wastegate',
      value: frame.turbo.enabled ? frame.turbo.wastegateOpenFraction : 0,
      unit: 'fracao',
      source: 'ECU: controle de boost',
    },
    {
      id: 'idle',
      labelPt: 'Atuador de marcha lenta',
      value: frame.config.throttle < 0.05 ? 1 : 0,
      unit: 'ativo',
      source: 'ECU: controle de marcha lenta',
    },
  ];
}

/** Build the per-cycle event timeline. */
export function buildEvents(frame: TelemetryFrame): CycleEvent[] {
  const events: CycleEvent[] = [];
  for (const cyl of frame.cylinders) {
    const offset = cylinderPhaseOffsetDeg(cyl.cylinderNumber);
    const sparkLocal = combustionStartDeg(frame.ignition.advanceDeg);
    events.push({
      angleDeg: normalizeCycleAngleDeg(sparkLocal - offset),
      cylinderNumber: cyl.cylinderNumber,
      kind: 'spark',
      labelPt: `Cil. ${cyl.cylinderNumber}: centelha`,
    });
    events.push({
      angleDeg: normalizeCycleAngleDeg(360 - offset),
      cylinderNumber: cyl.cylinderNumber,
      kind: 'peakPressure',
      labelPt: `Cil. ${cyl.cylinderNumber}: proximo do pico de pressao`,
    });
  }
  if (frame.ignition.knockRetardDeg > 0.5) {
    events.push({
      angleDeg: frame.clock.crankAngleDeg,
      kind: 'ecuKnockRetard',
      labelPt: `ECU: recuo de avanco (${frame.ignition.knockRetardDeg.toFixed(1)} graus)`,
    });
  }
  if (frame.cooling.thermostatOpenFraction > 0.05 && frame.cooling.thermostatOpenFraction < 0.98) {
    events.push({
      angleDeg: frame.clock.crankAngleDeg,
      kind: 'thermostatOpen',
      labelPt: 'Valvula termostatica: abertura progressiva',
    });
  }
  if (frame.cooling.fanOn) {
    events.push({
      angleDeg: frame.clock.crankAngleDeg,
      kind: 'fanOn',
      labelPt: 'Eletroventilador: acionado',
    });
  }
  return events.sort((a, b) => a.angleDeg - b.angleDeg);
}

export { radPerSecToRpm, rpmToRadPerSec };
