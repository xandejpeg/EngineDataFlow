/**
 * Central data types for the EngineDataFlow simulation.
 * All physical quantities use SI units internally with unambiguous names
 * (e.g. pressurePa, temperatureK, angleRad).
 */

export type FuelType = 'gasoline' | 'ethanol';

export type QualityLevel = 'low' | 'medium' | 'high' | 'auto';

export type EngineSystem =
  | 'shortBlock'
  | 'cylinderHead'
  | 'valvetrain'
  | 'ignition'
  | 'fuel'
  | 'intake'
  | 'exhaust'
  | 'cooling'
  | 'lubrication'
  | 'turbo'
  | 'sensors'
  | 'ecu';

/** Fixed geometric definition of the engine (editable within safe ranges). */
export interface EngineGeometry {
  boreM: number; // cylinder bore diameter (m)
  strokeM: number; // piston stroke (m)
  conrodM: number; // connecting rod length (m)
  compressionRatio: number; // geometric compression ratio
  cylinderCount: number;
}

/** User/preset configuration that drives the simulation. */
export interface EngineConfiguration {
  geometry: EngineGeometry;
  fuel: FuelType;
  rpm: number;
  throttle: number; // 0..1
  targetLambda: number; // commanded air-fuel equivalence ratio
  ignitionAdvanceDeg: number; // degrees before TDC
  ambientTempK: number;
  gamma: number; // polytropic index
  combustionDurationDeg: number;
  volumetricEfficiencyBase: number;
  frictionFactor: number;
  turboEnabled: boolean;
  boostBar: number; // target boost (gauge) when turbo enabled
}

/** Derived, cached geometric quantities. */
export interface DerivedGeometry {
  crankRadiusM: number; // r = stroke / 2
  pistonAreaM2: number; // Ap
  displacementCylinderM3: number; // Vd per cylinder
  displacementTotalM3: number; // Vd total
  clearanceVolumeM3: number; // Vc at TDC
  rodRatio: number; // l / r
}

/** Global simulation clock. */
export interface SimulationClock {
  crankAngleDeg: number; // 0..720 (thermodynamic phase)
  timeS: number; // accumulated simulated time
  running: boolean;
  speedScale: number; // 0.1, 0.25, 0.5, 1, 2
}

export type StrokePhase = 'intake' | 'compression' | 'power' | 'exhaust';

export interface ValveState {
  intakeLiftM: number; // instantaneous intake valve lift (m)
  exhaustLiftM: number; // instantaneous exhaust valve lift (m)
  intakeOpen: boolean;
  exhaustOpen: boolean;
}

export interface CombustionState {
  spark: boolean; // spark event active this frame
  burnFraction: number; // 0..1 mass fraction burned
  burning: boolean;
}

export interface CylinderState {
  index: number; // 0-based
  cylinderNumber: number; // 1-based physical number
  localAngleDeg: number; // 0..720 phase for this cylinder
  phase: StrokePhase;
  pistonPositionM: number; // distance from TDC (0 at TDC)
  pistonVelocityMps: number;
  volumeM3: number; // instantaneous cylinder volume
  pressurePa: number;
  temperatureK: number;
  valves: ValveState;
  combustion: CombustionState;
  torqueNm: number; // instantaneous torque contribution
}

export interface CoolingState {
  coolantTempK: number;
  headTempK: number;
  pistonTempK: number;
  thermostatOpenFraction: number; // 0 closed .. 1 open
  fanOn: boolean;
  radiatorEffectiveness: number; // 0..1
  heatRejectedW: number;
}

export interface LubricationState {
  oilTempK: number;
  oilPressurePa: number;
  oilFlowRel: number; // 0..1 relative flow
  filmIntegrity: number; // 0..1 (1 = healthy hydrodynamic film)
  contamination: number; // 0..1
  viscosityRel: number; // relative to nominal
}

export interface IntakeExhaustState {
  manifoldPressurePa: number;
  boostPa: number; // gauge boost pressure (0 if NA)
  exhaustBackpressurePa: number;
  airMassPerCycleKg: number; // trapped air mass per cylinder per cycle
  volumetricEfficiency: number;
}

export interface IgnitionState {
  advanceDeg: number; // effective advance after ECU correction
  requestedAdvanceDeg: number;
  knockRetardDeg: number;
  misfireIntensity: number; // 0..1
}

export interface TurboState {
  enabled: boolean;
  shaftRpm: number;
  boostPa: number;
  bearingTempK: number;
  lubricationOk: boolean;
  wastegateOpenFraction: number;
}

export interface CombustionQuality {
  knockRisk: number; // 0..1 detonation risk index (heuristic)
  preIgnitionRisk: number; // 0..1 (heuristic)
  peakPressurePa: number;
  peakGasTempK: number;
}

export interface PerformanceState {
  torqueInstantNm: number;
  torqueMeanNm: number;
  powerW: number;
  indicatedWorkPerCycleJ: number;
  imepPa: number;
  etaIdeal: number; // ideal Otto thermal efficiency
  etaEstimated: number; // estimated real efficiency
  energyBalance: EnergyBalance;
}

export interface EnergyBalance {
  usefulFraction: number;
  coolingFraction: number;
  exhaustFraction: number;
  pumpingFraction: number;
  frictionFraction: number;
}

export interface MixtureState {
  lambda: number;
  afr: number;
  stoichAfr: number;
  airMassFlowKgs: number;
  fuelMassFlowKgs: number;
}

export interface EmissionsState {
  coRel: number; // qualitative relative indices (0..1)
  hcRel: number;
  noxRel: number;
  co2Rel: number;
}

export interface SensorReading {
  id: string;
  labelPt: string;
  quantity: string;
  unit: string;
  value: number;
  updateHz: number;
  consumers: string[]; // ECU inputs / who uses the data
}

export interface ActuatorCommand {
  id: string;
  labelPt: string;
  value: number;
  unit: string;
  source: string; // ECU decision
}

export interface CycleEvent {
  angleDeg: number;
  cylinderNumber?: number;
  kind:
    | 'intakeOpen'
    | 'intakeClose'
    | 'exhaustOpen'
    | 'exhaustClose'
    | 'spark'
    | 'peakPressure'
    | 'ecuKnockRetard'
    | 'thermostatOpen'
    | 'fanOn';
  labelPt: string;
}

/** A single fully computed frame consumed by scene, charts, panels, alerts. */
export interface TelemetryFrame {
  clock: SimulationClock;
  config: EngineConfiguration;
  derived: DerivedGeometry;
  cylinders: CylinderState[];
  selectedCylinderIndex: number;
  cooling: CoolingState;
  lubrication: LubricationState;
  intakeExhaust: IntakeExhaustState;
  ignition: IgnitionState;
  turbo: TurboState;
  mixture: MixtureState;
  performance: PerformanceState;
  combustionQuality: CombustionQuality;
  emissions: EmissionsState;
  sensors: SensorReading[];
  actuators: ActuatorCommand[];
  events: CycleEvent[];
  activeFaultIds: string[];
}

// ---- Content types ------------------------------------------------------

export interface ComponentDefinition {
  id: string;
  namePt: string;
  category: string;
  system: EngineSystem;
  shortDescriptionPt: string;
  functionPt: string;
  typicalMaterialsPt: string[];
  relationsPt: string[];
  failureSymptomsPt: string[];
  assetMode: 'procedural' | 'glb' | 'hybrid';
}

export type FaultSeverity = 'info' | 'warning' | 'critical';

export interface FaultDefinition {
  id: string;
  titlePt: string;
  system: EngineSystem;
  severity: FaultSeverity;
  rootCausePt: string;
  contributingFactorsPt: string[];
  affectedVariablesPt: string[];
  observableSignsPt: string[];
  effects3dPt: string[];
  chartEffectsPt: string[];
  progressionPt: string;
  secondaryConsequencesPt: string[];
  diagnosticTestsPt: string[];
  repairPt: string;
  preventionPt: string;
  inferenceConfidence: number; // 0..1
  effectKind: 'calculated' | 'heuristic';
}

export interface CaseStudyHypothesis {
  id: string;
  labelPt: string;
  correct: boolean;
  explanationPt: string;
}

export interface CaseStudy {
  id: string;
  titlePt: string;
  system: EngineSystem;
  faultId: string | null;
  narrativePt: string;
  objectivesPt: string[];
  symptomsPt: string[];
  hypotheses: CaseStudyHypothesis[];
  virtualTestsPt: string[];
  causalChainPt: string[];
  repairPt: string;
}

export interface Lesson {
  id: string;
  trackId: string;
  titlePt: string;
  summaryPt: string;
  steps: LessonStep[];
}

export interface LessonStep {
  titlePt: string;
  bodyPt: string;
  focusComponentId?: string;
  crankAngleDeg?: number;
  quiz?: {
    questionPt: string;
    options: string[];
    correctIndex: number;
  };
}

export interface SimulationPreset {
  id: string;
  namePt: string;
  descriptionPt: string;
  config: Partial<EngineConfiguration>;
  faultIds: string[];
}
