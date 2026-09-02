import type { JSX } from 'react';
import { AtomScene } from './scenes/AtomScene';
import { BatteryScene } from './scenes/BatteryScene';
import { CircuitScene } from './scenes/CircuitScene';
import { VoltageScene } from './scenes/VoltageScene';
import { CurrentScene } from './scenes/CurrentScene';
import { ResistanceScene } from './scenes/ResistanceScene';
import { PowerScene } from './scenes/PowerScene';
import { MultimeterScene } from './scenes/MultimeterScene';
import { CircuitMeterScene } from './scenes/CircuitMeterScene';
import { EngineScene } from './scenes/EngineScene';
import { EngineScene2, EngineScene4 } from './scenes/inlineEngine';

/** Cenas 3D disponiveis para as aulas (lousa virtual). */
export const LESSON_SCENES: Record<string, () => JSX.Element> = {
  atom: AtomScene,
  battery: BatteryScene,
  circuit: CircuitScene,
  voltage: VoltageScene,
  current: CurrentScene,
  resistance: ResistanceScene,
  power: PowerScene,
  multimeter: MultimeterScene,
  circuitMeter: CircuitMeterScene,
  engine: EngineScene,
  engine2: EngineScene2,
  engine4: EngineScene4,
};
