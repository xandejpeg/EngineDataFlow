import { describe, expect, it } from 'vitest';
import { GEARBOX_INTERNALS, GEARBOX_PAIRS, gearboxFlangeWorld, schematicGearShape } from './golfGearboxGeometry';
import { CHASSIS_CORNERS } from './golfChassisGeometry';
import { INPUT_SHAFT_MODEL } from './golfInputShaftGeometry';

describe('schematic gearbox assembly', () => {
  it('connects internal input and front differential flanges to existing shafts', () => {
    expect(GEARBOX_INTERNALS.shaftEnd).toBe(INPUT_SHAFT_MODEL.position[0] + INPUT_SHAFT_MODEL.start);
    expect(GEARBOX_INTERNALS.outputFlanges.map(gearboxFlangeWorld)).toEqual(CHASSIS_CORNERS.filter(corner => corner.innerCv).map(corner => corner.innerCv));
  });
  it('spaces six gear stations with pitch circles at the shaft distance', () => {
    expect(GEARBOX_PAIRS).toHaveLength(6);
    GEARBOX_PAIRS.forEach((pair, index) => {
      expect(pair.inputTeeth + pair.outputTeeth).toBe(Math.hypot(...GEARBOX_INTERNALS.output));
      if (index) expect(pair.axis - pair.width / 2).toBeGreaterThan(GEARBOX_PAIRS[index - 1].axis + pair.width / 2);
      expect(schematicGearShape(pair.inputTeeth, pair.inputTeeth).holes).toHaveLength(1);
    });
    expect(GEARBOX_INTERNALS.ratios).toBe('not-specified');
  });
});