export type CabinPoint = [number, number];

export function roundedCabinContour(points: CabinPoint[], setback: number): CabinPoint[] {
  return points.flatMap((corner, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const previousLength = Math.hypot(previous[0] - corner[0], previous[1] - corner[1]);
    const nextLength = Math.hypot(next[0] - corner[0], next[1] - corner[1]);
    const distance = Math.min(setback, previousLength * 0.2, nextLength * 0.2);
    const start = corner.map((coordinate, axis) => coordinate + (previous[axis] - coordinate) * distance / previousLength);
    const end = corner.map((coordinate, axis) => coordinate + (next[axis] - coordinate) * distance / nextLength);
    return Array.from({ length: 7 }, (_, step): CabinPoint => {
      const fraction = step / 6;
      return [0, 1].map(axis => (1 - fraction) ** 2 * start[axis] + 2 * fraction * (1 - fraction) * corner[axis] + fraction ** 2 * end[axis]) as CabinPoint;
    });
  });
}