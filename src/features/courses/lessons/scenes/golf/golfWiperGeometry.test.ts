import { describe, expect, it } from 'vitest';
import { WIPER_LINKS, WIPER_MOTOR, WIPER_PIVOTS, wiperPose, wiperToWorld } from './golfWiperGeometry';

const distance = (first: number[], second: number[]) => Math.hypot(...first.map((value, index) => value - second[index]));
describe('estimated wiper four-bar mechanism', () => {
  it('preserves every rigid link and joint through a complete revolution', () => {
    for (let step = 0; step <= 360; step += 1) {
      const pose = wiperPose(step / 360);
      expect(distance(pose.crank, WIPER_MOTOR)).toBeCloseTo(WIPER_LINKS.crank, 7);
      expect(distance(pose.crank, pose.left)).toBeCloseTo(WIPER_LINKS.rod, 7);
      expect(distance(pose.left, WIPER_PIVOTS[0])).toBeCloseTo(WIPER_LINKS.rocker, 7);
      expect(distance(pose.right, WIPER_PIVOTS[1])).toBeCloseTo(WIPER_LINKS.rocker, 7);
      expect(distance(pose.left, pose.right)).toBeCloseTo(WIPER_LINKS.tie, 7);
      expect(pose.sweep).toBeGreaterThan(-1e-8);
      expect(pose.sweep).toBeLessThan(1.3);
    }
  });
  it('parks flat and keeps both blades within the estimated windshield envelope', () => {
    expect(wiperPose(0).sweep).toBeCloseTo(0, 7);
    expect(wiperPose(1).sweep).toBeCloseTo(0, 7);
    for (let step = 0; step < 100; step += 1) for (const pivot of WIPER_PIVOTS) {
      const { sweep } = wiperPose(step / 100);
      const tip = wiperToWorld([pivot[0] + 580 * Math.cos(sweep), 580 * Math.sin(sweep), -12]);
      expect(Math.abs(tip[0])).toBeLessThan(817);
      expect(tip[1]).toBeLessThan(1410);
      expect(tip[2]).toBeLessThan(760);
      expect(tip[2]).toBeGreaterThan(210);
    }
  });
});