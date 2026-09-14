import { engineToWorld, type GolfClock, type GolfSample } from './golfPhysics';
import { CatmullRomCurve3, Vector3 } from 'three';
import { HIGH_PUMP_INLET, THROTTLE_INLET, RAIL_SENSOR_MOUNT } from './golfMounts';

export type Position = [number, number, number];
export type GolfView = 'vehicle' | 'engine' | 'fuel' | 'compare' | 'systems';
export type BodyMode = 'solid' | 'ghost' | 'cutaway' | 'assembly';

export const FUEL_PATH: Position[] = [[-150, 620, 2150], [-150, 240, 1750], [-150, 240, 500], [-120, 500, 50], engineToWorld(HIGH_PUMP_INLET)];
export const FUEL_LENGTH_MM = new CatmullRomCurve3(FUEL_PATH.map(point => new Vector3(...point)), false, 'centripetal').getLength();
export const EXHAUST_PATH: Position[] = [[80, 420, 200], [40, 300, 260], [-40, 200, 400], [-60, 185, 560], [-80, 180, 700], [-80, 180, 1100], [-90, 195, 1500], [-100, 200, 1900], [-100, 200, 2250], [-160, 330, 2578], [-180, 300, 2850], [-180, 280, 3150], [-300, 300, 3300]];
export const AIR_PATH: Position[] = [[-300, 700, -470], [-180, 700, -330], [-120, 680, -260], engineToWorld(THROTTLE_INLET)];
export const CAN_PATH: Position[] = [[-350, 930, 450], [-400, 700, 870], [-350, 900, 820], [-420, 620, 900]];
export const MOTOR_ORIGIN: Position = [300, 415, -70];
export const FUSE_BOX_POSITIONS: Record<'engine' | 'cabin', Position> = { engine: [-590, 780, 440], cabin: [-700, 810, 870] };

export interface GolfPart {
  id: number; name: string; code: string; position: Position; group: string; description: string;
}

export const GOLF_PARTS: GolfPart[] = [
  { id: 1, name: 'Canister', code: 'EVAP', position: [350, 400, 2600], group: 'Combustivel', description: 'Carvao ativado retendo vapor. A purga leva os vapores a admissao com motor aquecido.' },
  { id: 2, name: 'Medicao do ar', code: 'MAF / referencia didatica', position: [-180, 700, -330], group: 'Ar', description: 'Mantem o grupo 02 da Aula 4. O MAF desta montagem e uma referencia didatica; sua presenca na variante AXW nao foi confirmada pelo SSP 322.' },
  { id: 3, name: 'Central Motronic', code: 'MED 9.5.10', position: [-350, 930, 450], group: 'Controle', description: 'Calcula injecao e ignicao a partir da fase, rotacao, carga e temperaturas.' },
  { id: 4, name: 'Diagnostico', code: 'OBD2', position: [-420, 620, 900], group: 'Controle', description: 'Tomada de 16 vias. Atividade de diagnostico so existe quando o scanner esta conectado.' },
  { id: 5, name: 'Luz de anomalia', code: 'MIL / J285', position: [-350, 900, 820], group: 'Controle', description: 'Acende no teste do painel ou por uma mensagem de falha recebida pela rede.' },
  { id: 6, name: 'Imobilizador', code: 'Antena leitora', position: [-350, 720, 780], group: 'Controle', description: 'Dialogo de autorizacao na chave ligada. Nao e um pulso de cada combustao.' },
  { id: 7, name: 'Rede CAN', code: 'J533 / J583', position: [-400, 700, 870], group: 'Controle', description: 'Rede de comunicacao com gateway; o desenho resume barramentos distintos. Terminacoes ficam nos modulos, nao penduradas nos fios.' },
  { id: 8, name: 'Valvula de purga', code: 'N80', position: [-20, 750, -230], group: 'Combustivel', description: 'Libera vapor do canister conforme a condicao de funcionamento, nao a cada volta do motor.' },
  { id: 9, name: 'Corpo de borboleta', code: 'J338', position: engineToWorld([316, 215, 161]), group: 'Ar', description: 'No estratificado trabalha mais aberto. A quantidade de combustivel passa a comandar principalmente o torque.' },
  { id: 10, name: 'Bomba de alta', code: 'N276', position: engineToWorld([342, 403, 45]), group: 'Combustivel', description: 'Embolo acionado pelo comando de admissao. O modelo usa tres golpes por ciclo, contra quatro injecoes.' },
  { id: 11, name: 'Pressao da admissao', code: 'G71', position: engineToWorld([132, 207, 198]), group: 'Sensores', description: 'A pressao do coletor acompanha a borboleta e as admissoes dos cilindros.' },
  { id: 12, name: 'EGR resfriada', code: 'N18 / G212', position: [-10, 550, 0], group: 'Escape', description: 'Recircula uma parcela dos gases. A mistura estratificada combina ar, combustivel e EGR.' },
  { id: 13, name: 'Pressao da galeria', code: 'G247', position: engineToWorld(RAIL_SENSOR_MOUNT), group: 'Sensores', description: 'Mede a pressao de alta, com ondulacao ilustrativa entre bombeadas e retiradas pelos injetores. Montado axialmente na extremidade da galeria; pinagem e curva eletrica ainda nao validadas.' },
  { id: 14, name: 'Galeria de alta', code: 'Rail', position: engineToWorld([132, 280, 128]), group: 'Combustivel', description: 'Reserva pressurizada junto aos quatro injetores. Nao confundir com a longa linha de baixa pressao.' },
  { id: 15, name: 'Quatro injetores', code: 'N30-N33', position: engineToWorld([0, 260, 75]), group: 'Combustivel', description: 'Injecao direta lateral: na admissao para homogeneizar; no fim da compressao para estratificar.' },
  { id: 16, name: 'Detonacao', code: 'G61 / G66', position: engineToWorld([44, 70, 58]), group: 'Sensores', description: 'Dois sensores no bloco. Um pico condicionado a combustao representa o cenario de detonacao selecionado.' },
  { id: 17, name: 'Rotacao', code: 'G28 / 60-2 didatico', position: engineToWorld([310, -57, 63]), group: 'Sensores', description: 'A roda didatica tem 58 dentes e duas posicoes ausentes. Sao duas sequencias por ciclo de 720 graus.' },
  { id: 18, name: 'Modulo do tanque', code: 'G6 / J538', position: [-150, 470, 2150], group: 'Combustivel', description: 'Bomba de baixa e boia dentro do tanque. A pressurizacao inicial acontece mesmo com o motor parado.' },
  { id: 19, name: 'Quatro bobinas', code: 'N70 / N127 / N291 / N292', position: engineToWorld([0, 390, 0]), group: 'Ignicao', description: 'Uma bobina por vela: carga do primario, corte e faisca na ordem 1-3-4-2.' },
  { id: 20, name: 'Fase', code: 'G40', position: engineToWorld([-45, 335, 50]), group: 'Sensores', description: 'Um pulso didatico por ciclo identifica as duas voltas. O pulso acompanha o ajuste do comando de admissao.' },
  { id: 21, name: 'Temperatura do motor', code: 'G62', position: engineToWorld([330, 215, -67]), group: 'Sensores', description: 'Temperatura muda ao longo do aquecimento, nao se repete a cada volta do virabrequim.' },
  { id: 22, name: 'Sonda de banda larga', code: 'G39', position: [160, 600, 135], group: 'Escape', description: 'Quatro cilindros em linha formam um banco so: uma sonda de banda larga regula a mistura antes do pre-catalisador. Ela tem seis vias porque mede corrente de bombeamento, nao tensao de degrau.' },
  { id: 23, name: 'Pre-catalisador', code: 'Proximo ao motor', position: [150, 460, 170], group: 'Escape', description: 'Pre-catalisador proximo do motor. As tres reacoes simultaneas exigem mistura perto de lambda 1.' },
  { id: 24, name: 'Temperatura do escape', code: 'G235', position: [-60, 210, 560], group: 'Escape', description: 'Monitora a temperatura antes do acumulador de NOx; a leitura depende da carga e do estado termico.' },
  { id: 25, name: 'Acumulador de NOx', code: 'G295 / J583 a jusante', position: [-80, 180, 900], group: 'Escape', description: 'Armazena NOx na mistura pobre. A regeneracao rica libera capacidade; o sensor fica depois do acumulador.' },
  { id: 26, name: 'Sonda pos-pre-catalisador', code: 'G130', position: [150, 350, 230], group: 'Escape', description: 'Sonda de banda estreita depois do pre-catalisador, antes do acumulador de NOx. Quatro vias: sinal, massa e os dois fios do aquecedor.' },
  { id: 27, name: 'Bateria', code: '12 V / seis celulas', position: [-450, 780, 260], group: 'Controle', description: 'A tensao cai durante a partida e passa ao nivel de carga quando o alternador sustenta o sistema.' },
  { id: 28, name: 'Fusiveis e reles', code: 'Distribuicao didatica / rele principal', position: FUSE_BOX_POSITIONS.engine, group: 'Controle', description: 'Caixas no cofre e no habitaculo. Rele com adaptador de teste 30/87/85/86. Medicao DC entre terminais; fios e contatos ideais, cargas simplificadas. Nao representa pinagem ou amperagens VW. Resistencia, corrente, maus contatos e curvas dos sensores ainda nao modelados. A falha interrompe o motor imediatamente; restaurar retoma o preset.' },
];

export function partReading(id: number, sample: GolfSample, clock: GolfClock, scanner: boolean, fault: boolean): string {
  if ([2, 11, 13, 16, 17, 20, 21, 22, 24, 26].includes(id) && !sample.electrical.ecu) return 'ECU sem alimentacao / leitura indisponivel';
  switch (id) {
    case 1: return sample.purge ? 'Purga de vapor' : 'Vapor retido';
    case 2: return `${(sample.rpm * sample.throttle / 110).toFixed(1)} g/s (ilustrativo)`;
    case 3: return !sample.electrical.ecu ? 'Sem alimentacao' : sample.running ? 'Injecao sequencial' : 'Alimentada';
    case 4: return !sample.electrical.diagnostics ? 'Tomada sem alimentacao' : scanner && sample.electrical.ecu ? 'Scanner conectado' : 'Sem comunicacao';
    case 5: return fault || clock.operation === 'key' ? 'Acesa' : 'Apagada';
    case 6: return !sample.powered ? 'Inativo' : clock.operation === 'key' && clock.elapsed < 1 ? 'Autorizando' : 'Autorizado';
    case 7: return sample.powered ? 'Rede ativa' : 'Repouso';
    case 8: return sample.purge ? 'Aberta' : 'Fechada';
    case 9: return `${Math.round(sample.throttle * 100)}% de abertura`;
    case 10: return `${(sample.pumpLift * 8).toFixed(1)} mm / 3 golpes por ciclo`;
    case 11: return `${sample.map.toFixed(1)} kPa absolutos`;
    case 12: return `${Math.round(sample.egr * 100)}% (ilustrativo)`;
    case 13: case 14: return `${sample.railPressure.toFixed(1)} bar`;
    case 15: return sample.cylinders.some(cylinder => cylinder.injecting) ? 'Pulso de injecao' : 'Injetores fechados';
    case 16: return fault && sample.cylinders.some(cylinder => cylinder.combustion) ? 'Pico de detonacao' : 'Sem evento de detonacao';
    case 17: return `${sample.rpm.toFixed(0)} rpm / ${sample.ckp ? 'dente' : 'intervalo'}`;
    case 18: return `${sample.lowPressure.toFixed(1)} bar / tanque ${Math.round(clock.fuel * 100)}%`;
    case 19: return sample.cylinders.some(cylinder => cylinder.spark) ? 'Faisca' : sample.cylinders.some(cylinder => cylinder.dwell) ? 'Carregando primario' : 'Aguardando';
    case 20: return `${sample.cmp ? 'Pulso' : 'Intervalo'} / avanco ${sample.camAdvance} graus`;
    case 21: return `${clock.temperature.toFixed(1)} C`;
    case 22: return sample.rpm ? `Lambda ${sample.lambda.toFixed(2)}` : 'Sem leitura valida';
    case 23: return `${clock.catalystTemperature.toFixed(0)} C / ${clock.catalystTemperature >= 300 ? 'aquecido' : 'aquecendo'}`;
    case 24: return `${(sample.rpm ? clock.catalystTemperature + 80 : clock.catalystTemperature).toFixed(0)} C`;
    case 25: return `${Math.round(clock.nox * 100)}% de ocupacao`;
    case 26: return sample.rpm ? `${Math.round(sample.lsf * 1000)} mV (ilustrativo)` : 'Sem leitura valida';
    case 28: return clock.openFuse || clock.powerOff.length ? 'Circuito interrompido' : sample.electrical.mainRelay ? 'Rele principal fechado' : 'Rele principal aberto';
    default: return `${sample.volts.toFixed(1)} V`;
  }
}