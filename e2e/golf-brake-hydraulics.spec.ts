import { expect, test } from '@playwright/test';

interface BrakeInspection {
  pedal: number;
  pedalAngle: number;
  pedalPoint: number[];
  masterOffset: number;
  primaryBar: number;
  secondaryBar: number;
  speedMps: number;
  wheelAngle: number;
  distanceM: number;
  dissipatedJ: number;
  projected: number[][];
  sample: { wheels: { id: string; circuit: string; torqueNm: number; padTravelMm: number }[] };
  wheels: { id: string; inlet: number[]; lineEnd: number[]; pads: number[]; rotor: number[]; fixed: number[] }[];
}

test('Freios hidraulicos: pedal circuito pinca e parada da bancada', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const lab = page.locator('.golf-lab');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectBrakeHydraulics: () => BrakeInspection }).inspectBrakeHydraulics());
  const pixels = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number } }).inspectGolf(true).contrastPixels);
  await page.getByRole('button', { name: 'Freios', exact: true }).click();
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).wheels.filter(wheel => wheel.inlet).length, { timeout: 30_000 }).toBe(4);
  const initial = await inspect();
  expect(initial.primaryBar).toBe(0);
  for (const wheel of initial.wheels) wheel.inlet.forEach((coordinate, index) => expect(coordinate).toBeCloseTo(wheel.lineEnd[index], 5));
  for (const coordinate of initial.projected.flat()) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect(await pixels()).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('hydraulic-circuit.png') });

  await page.getByRole('combobox', { name: 'Vista dos freios', exact: true }).selectOption('pedal');
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).projected.every(point => point.every(coordinate => Math.abs(coordinate) < 1))).toBe(true);
  const pedalPoint = (await inspect()).pedalPoint;
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.click(bounds.x + (pedalPoint[0] + 1) * bounds.width / 2, bounds.y + (1 - pedalPoint[1]) * bounds.height / 2);
  await expect.poll(async () => (await inspect()).pedal).toBe(0.7);
  await expect.poll(async () => (await inspect()).primaryBar).toBeGreaterThan(100);
  const applied = await inspect();
  expect(applied.pedalAngle).toBeCloseTo(0.7 * 0.32);
  expect(applied.masterOffset).toBeLessThan(0);
  for (const wheel of applied.wheels) expect(wheel.pads).toEqual([0.7, -0.7]);
  expect(applied.wheels.map(wheel => wheel.fixed)).toEqual(initial.wheels.map(wheel => wheel.fixed));
  await lab.screenshot({ path: testInfo.outputPath('hydraulic-pedal.png') });

  await page.getByRole('checkbox', { name: 'Servo com assistencia', exact: true }).uncheck();
  await expect.poll(async () => (await inspect()).primaryBar).toBeLessThan(applied.primaryBar / 2);
  expect((await inspect()).primaryBar).toBeGreaterThan(0);
  await page.getByRole('checkbox', { name: 'Servo com assistencia', exact: true }).check();
  await page.getByRole('combobox', { name: 'Vazamento de freio', exact: true }).selectOption('primary');
  await expect.poll(async () => (await inspect()).primaryBar).toBe(0);
  const failed = await inspect();
  expect(failed.secondaryBar).toBeGreaterThan(0);
  expect(failed.sample.wheels.filter(wheel => wheel.circuit === 'primary').every(wheel => wheel.torqueNm === 0 && wheel.padTravelMm === 0)).toBe(true);
  expect(failed.sample.wheels.filter(wheel => wheel.circuit === 'secondary').every(wheel => wheel.torqueNm > 0)).toBe(true);
  await page.getByRole('combobox', { name: 'Vazamento de freio', exact: true }).selectOption('none');
  const pedal = page.getByRole('slider', { name: 'Pedal de freio', exact: true });
  await pedal.focus();
  await pedal.press('Home');
  await expect.poll(async () => (await inspect()).primaryBar).toBe(0);
  await page.getByRole('button', { name: 'Pausar motor', exact: true }).click();
  await expect(lab).toHaveAttribute('data-running', 'false');
  await page.getByRole('button', { name: 'Lancar a 30 km/h', exact: true }).click();
  await expect(lab).toHaveAttribute('data-running', 'true');
  await expect.poll(async () => (await inspect()).wheelAngle).toBeGreaterThan(0.1);
  expect((await inspect()).speedMps).toBeCloseTo(30 / 3.6);
  await pedal.focus();
  await pedal.press('End');
  await expect.poll(async () => (await inspect()).speedMps, { timeout: 20_000 }).toBe(0);
  const stopped = await inspect();
  expect(stopped.distanceM).toBeGreaterThan(0);
  expect(stopped.dissipatedJ).toBeGreaterThan(40000);
  expect(stopped.wheels.map(wheel => wheel.rotor)).not.toEqual(initial.wheels.map(wheel => wheel.rotor));
  expect(stopped.wheels.map(wheel => wheel.fixed)).toEqual(initial.wheels.map(wheel => wheel.fixed));

  for (const wheel of ['front-left', 'front-right', 'rear-left', 'rear-right']) {
    await page.getByRole('combobox', { name: 'Vista dos freios', exact: true }).selectOption(wheel);
    await expect.poll(async () => (await inspect()).projected.every(point => point.every(coordinate => Math.abs(coordinate) < 1))).toBe(true);
    expect(await pixels()).toBeGreaterThan(100);
  }
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await lab.screenshot({ path: testInfo.outputPath('hydraulic-caliper.png') });
  const orbit = (await canvas.boundingBox())!;
  await page.mouse.move(orbit.x + orbit.width * 0.5, orbit.y + orbit.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(orbit.x + orbit.width * 0.6, orbit.y + orbit.height * 0.55, { steps: 8 });
  await page.mouse.up();
  expect(await pixels()).toBeGreaterThan(100);
  await page.getByRole('button', { name: 'Reiniciar freios', exact: true }).click();
  await expect.poll(async () => (await inspect()).pedal).toBe(0);
  await page.getByRole('button', { name: 'Montagem', exact: true }).click();
  await expect(lab).toHaveAttribute('data-brake-focus', 'none');
  await expect.poll(async () => (await inspect()).wheels.filter(wheel => wheel.inlet).length, { timeout: 30_000 }).toBe(4);
  expect(await pixels()).toBeGreaterThan(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});