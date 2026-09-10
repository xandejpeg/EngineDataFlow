import { expect, test } from '@playwright/test';

interface ClutchInspection {
  angle: number;
  contrastPixels: number;
  inputShaft: {
    representation: string;
    dimensionalStatus: string;
    splineStatus: string;
    splineCount: null;
    actuation: string;
    parent: string;
    axisParallel: number;
    radialDistance: number;
    matrix: number[];
    ends: number[][];
    min: number[];
    max: number[];
    projected: number[];
  } | null;
  clutchBearing: {
    dimensionalStatus: string;
    placementStatus: string;
    actuation: string;
    inputShaftStatus: string;
    sourceItems: number[];
    matrix: number[];
    centers: number[][];
    guideAxis: number[];
    projected: number[];
    clipCount: number;
    fixings: { sourceItem: number; dimensionalStatus: string; placementStatus: string; actuation: string; threadSpecification: null; tighteningTorqueNm: null; position: number[]; matrix: number[] }[];
    axisOffset: { height: number; depth: number };
    radialDistance: number;
    axisParallel: number;
    bellTowardsMotor: number;
  } | null;
  clutchRelease: {
    retainingSpring: {
      sourceItem: number;
      sourceFigure: string;
      dimensionalStatus: string;
      placementStatus: string;
      actuation: string;
      representation: string;
      parent: string;
      matrix: number[];
      position: number[];
      min: number[];
      max: number[];
      projected: number[];
    } | null;
    dimensionalStatus: string;
    placementStatus: string;
    actuation: string;
    sourceItems: number[];
    matrix: number[];
    contacts: number[][];
    min: number[];
    max: number[];
    projected: number[];
    bellOpacity: number;
  } | null;
  clutchSlave: {
    sourceFigure: string;
    sourceItem: number;
    location: string;
    dimensionalStatus: string;
    placementStatus: string;
    actuation: string;
    parent: string;
    children: string[];
    matrix: number[];
    min: number[];
    max: number[];
    projected: number[];
  } | null;
}

test('Aula 5: cilindro externo 02S independente do virabrequim', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  await page.getByRole('button', { name: 'Proxima', exact: true }).click();
  await expect(page.locator('.golf-lab')).toHaveAttribute('data-view', 'engine');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Voltar a zero graus', exact: true }).click();
  const canvas = page.locator('canvas[data-golf-canvas]');
  const inspect = (pixels = false) => canvas.evaluate((element, includePixels) =>
    (element as HTMLCanvasElement & { inspectGolf: (includePixels: boolean) => ClutchInspection }).inspectGolf(includePixels), pixels);
  const initialState = await inspect();
  const initial = initialState.clutchSlave;
  const release = initialState.clutchRelease;
  const spring = release?.retainingSpring;
  expect(spring).toMatchObject({ sourceItem: 5, sourceFigure: 'A30-0068', dimensionalStatus: 'estimated', placementStatus: 'estimated', actuation: 'not-simulated', representation: 'bent-wire-retainer', parent: 'golf-clutch-lever' });
  expect(spring!.position).toEqual(release!.contacts[2]);
  for (const coordinate of [...spring!.min, ...spring!.max]) expect(Number.isFinite(coordinate)).toBe(true);
  for (const coordinate of spring!.projected) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect(spring!.max[1]).toBeLessThan(350);
  const bearing = initialState.clutchBearing;
  expect(bearing!.fixings).toHaveLength(2);
  for (const fixing of bearing!.fixings) {
    expect(fixing).toMatchObject({ sourceItem: 6, dimensionalStatus: 'estimated', placementStatus: 'estimated', actuation: 'not-simulated', threadSpecification: null, tighteningTorqueNm: null });
    expect(fixing.position[0]).toBeCloseTo(-240);
    expect(Math.abs(fixing.position[1] - 415)).toBeCloseTo(28);
    expect(fixing.position[2]).toBeCloseTo(-70);
  }
  expect(bearing).toMatchObject({ sourceItems: [4, 8], dimensionalStatus: 'estimated', placementStatus: 'estimated', actuation: 'not-simulated', inputShaftStatus: 'external-envelope-only', clipCount: 2, axisOffset: { height: 0, depth: 0 } });
  const shaft = initialState.inputShaft;
  expect(shaft).toMatchObject({ representation: 'external-envelope-only', dimensionalStatus: 'estimated', splineStatus: 'not-modeled', splineCount: null, actuation: 'not-simulated', parent: 'golf-gearbox' });
  expect(shaft!.axisParallel).toBeCloseTo(1, 8);
  expect(shaft!.radialDistance).toBeLessThan(1e-8);
  expect(shaft!.ends[0][0]).toBeCloseTo(-248);
  expect(shaft!.ends[1][0]).toBeCloseTo(-95);
  for (const end of shaft!.ends) {
    expect(end[1]).toBeCloseTo(415);
    expect(end[2]).toBeCloseTo(-70);
  }
  for (const coordinate of [...shaft!.min, ...shaft!.max]) expect(Number.isFinite(coordinate)).toBe(true);
  for (const coordinate of shaft!.projected) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect(bearing!.radialDistance).toBeLessThan(1e-8);
  expect(bearing!.axisParallel).toBeCloseTo(1, 8);
  expect(bearing!.bellTowardsMotor).toBeCloseTo(1, 8);
  expect(bearing!.centers[0]).toEqual(bearing!.centers[1]);
  expect(bearing!.centers[0]).toEqual([-206, 415, -70]);
  for (let axis = 0; axis < 3; axis++) expect(bearing!.guideAxis[axis]).toBeCloseTo(axis === 0 ? 1 : 0, 8);
  expect(release).toMatchObject({ sourceItems: [7, 2], dimensionalStatus: 'estimated', placementStatus: 'estimated', actuation: 'not-simulated' });
  for (const [first, second] of [[0, 1], [2, 3]]) {
    for (let axis = 0; axis < 3; axis++) expect(release!.contacts[first][axis]).toBeCloseTo(release!.contacts[second][axis], 8);
  }
  expect(initial).not.toBeNull();
  expect(initial).toMatchObject({
    sourceFigure: 'A30-0005', sourceItem: 10, location: 'external',
    dimensionalStatus: 'estimated', placementStatus: 'estimated',
    actuation: 'not-simulated', parent: 'golf-gearbox',
  });
  expect(initial?.children).toEqual(expect.arrayContaining([
    'golf-clutch-slave-body', 'golf-clutch-slave-boot', 'golf-clutch-slave-plunger',
    'golf-clutch-slave-mount--24', 'golf-clutch-slave-mount-24',
  ]));
  for (const mode of ['Carro', 'Fantasma', 'Corte']) {
    await page.getByRole('button', { name: mode, exact: true }).click();
    const state = await inspect(true);
    expect(state.contrastPixels).toBeGreaterThan(100);
    expect(state.clutchSlave?.matrix).toEqual(initial?.matrix);
    expect(state.inputShaft?.matrix).toEqual(shaft?.matrix);
    expect(state.clutchRelease?.matrix).toEqual(release?.matrix);
    expect(state.clutchRelease?.retainingSpring?.matrix).toEqual(spring?.matrix);
    expect(state.clutchBearing?.matrix).toEqual(bearing?.matrix);
    expect(state.clutchBearing?.fixings).toEqual(bearing?.fixings);
    expect(state.clutchBearing!.radialDistance).toBeLessThan(1e-8);
    expect(state.clutchBearing!.axisParallel).toBeCloseTo(1, 8);
    expect(state.clutchBearing!.bellTowardsMotor).toBeCloseTo(1, 8);
    expect(state.clutchRelease?.bellOpacity).toBe(mode === 'Carro' ? 1 : 0.18);
  }
  await page.getByRole('button', { name: 'Rodar motor', exact: true }).click();
  await expect.poll(async () => (await inspect()).angle).toBeGreaterThan(10);
  const runningState = await inspect();
  expect(runningState.clutchSlave?.matrix).toEqual(initial?.matrix);
  expect(runningState.inputShaft?.matrix).toEqual(shaft?.matrix);
  expect(runningState.clutchRelease?.matrix).toEqual(release?.matrix);
  expect(runningState.clutchRelease?.retainingSpring?.matrix).toEqual(spring?.matrix);
  expect(runningState.clutchBearing?.matrix).toEqual(bearing?.matrix);
  expect(runningState.clutchBearing?.fixings).toEqual(bearing?.fixings);
  expect(runningState.clutchBearing!.radialDistance).toBeLessThan(1e-8);
  expect(runningState.clutchBearing!.axisParallel).toBeCloseTo(1, 8);
  await page.getByRole('button', { name: 'Voltar a zero graus', exact: true }).click();
  const finalState = await inspect(true);
  const current = finalState.clutchSlave;
  expect(current).not.toBeNull();
  for (const coordinate of [...current!.min, ...current!.max]) expect(Number.isFinite(coordinate)).toBe(true);
  expect(current!.min[1]).toBeCloseTo(537);
  expect(current!.min[1]).toBeLessThanOrEqual(415 - 20 + 285 / 2);
  for (const coordinate of current!.projected) expect(Math.abs(coordinate)).toBeLessThan(1);
  const finalRelease = finalState.clutchRelease!;
  for (const coordinate of [...finalRelease.min, ...finalRelease.max]) expect(Number.isFinite(coordinate)).toBe(true);
  for (const coordinate of finalRelease.projected) expect(Math.abs(coordinate)).toBeLessThan(1);
  for (const coordinate of finalState.clutchBearing!.projected) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.locator('.golf-lab').screenshot({ path: testInfo.outputPath('clutch-engine.png') });
  expect(errors).toEqual([]);
});