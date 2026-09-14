import { expect, test } from '@playwright/test';

interface EgasInspection {
  enabled: boolean; pedal: number; opening: number; throttle: number; rpm: number; engineAngle: number;
  butterflyAngle: number; pedalAngle: number; pedalPoint: number[]; projected: number[][]; camera: number[];
  electrical: { referenceV: number; signal1V: number; signal2V: number; status: string; motorCommand: number };
  plugs: { name: string; position: number[] }[];
  wires: { name: string; from: number[]; to: number[] }[];
}

test('EGAS: pedal ECU TBI sinais falhas e retorno a montagem', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const lab = page.locator('.golf-lab');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectEgas: () => EgasInspection }).inspectEgas());
  const pixels = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number } }).inspectGolf(true).contrastPixels);
  await page.getByRole('button', { name: 'Acelerador', exact: true }).click();
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).wires.length, { timeout: 30_000 }).toBe(12);
  const initial = await inspect();
  expect(initial.enabled).toBe(false);
  expect(initial.throttle).toBe(0.09);
  expect(initial.plugs.every(plug => plug.position.length === 3)).toBe(true);
  for (const coordinate of initial.projected.flat()) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect(await pixels()).toBeGreaterThan(100);
  expect(await lab.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return Array.from(element.querySelectorAll('.golf-toolbar, .golf-workspace, .golf-transport')).every(row => row.getBoundingClientRect().right <= bounds.right + 1 && row.getBoundingClientRect().left >= bounds.left - 1);
  })).toBe(true);
  await lab.screenshot({ path: testInfo.outputPath('egas-circuit.png') });

  await page.getByRole('combobox', { name: 'Vista do acelerador' }).selectOption('pedal');
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).projected.every(point => point.every(coordinate => Math.abs(coordinate) < 1))).toBe(true);
  const point = (await inspect()).pedalPoint;
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.click(bounds.x + (point[0] + 1) * bounds.width / 2, bounds.y + (1 - point[1]) * bounds.height / 2);
  await expect.poll(async () => (await inspect()).pedal).toBe(0.7);
  await expect.poll(async () => (await inspect()).opening).toBeGreaterThan(0.67);
  const applied = await inspect();
  expect(applied.enabled).toBe(true);
  expect(applied.pedalAngle).toBeCloseTo(0.7 * 0.35);
  expect(applied.electrical.signal1V).toBeCloseTo(3.3);
  expect(applied.electrical.signal2V).toBeCloseTo(1.65);
  expect(applied.butterflyAngle).toBeCloseTo(applied.throttle * Math.PI / 2);
  await lab.screenshot({ path: testInfo.outputPath('egas-pedal.png') });

  await page.getByRole('combobox', { name: 'Vista do acelerador' }).selectOption('throttle');
  await expect.poll(async () => (await inspect()).projected.every(point => point.every(coordinate => Math.abs(coordinate) < 1))).toBe(true);
  const pedal = page.getByRole('slider', { name: 'Pedal do acelerador', exact: true });
  await pedal.scrollIntoViewIfNeeded();
  expect(await pedal.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2) === element;
  })).toBe(true);
  await page.locator('.golf-inspector').screenshot({ path: testInfo.outputPath('egas-controls.png') });
  await pedal.focus(); await pedal.press('End');
  await expect.poll(async () => (await inspect()).opening).toBeGreaterThan(0.93);
  expect(await pixels()).toBeGreaterThan(100);
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await lab.screenshot({ path: testInfo.outputPath('egas-throttle-open.png') });
  const openCamera = (await inspect()).camera;

  for (const fault of ['pedal-signal', 'reference', 'motor-wire', 'position-signal']) {
    await page.getByRole('combobox', { name: 'Falha do acelerador' }).selectOption(fault);
    await expect.poll(async () => (await inspect()).opening).toBeLessThan(0.07);
    expect((await inspect()).electrical.motorCommand).toBe(0);
    await page.getByRole('combobox', { name: 'Falha do acelerador' }).selectOption('none');
    await expect.poll(async () => (await inspect()).opening).toBeGreaterThan(0.93);
  }
  await page.getByRole('combobox', { name: 'Fusivel do acelerador' }).selectOption('ecu');
  await expect.poll(async () => (await inspect()).opening).toBeLessThan(0.07);
  expect((await inspect()).electrical.referenceV).toBe(0);
  await page.getByRole('combobox', { name: 'Fusivel do acelerador' }).selectOption('');
  await expect.poll(async () => (await inspect()).opening).toBeGreaterThan(0.93);
  await page.getByRole('combobox', { name: 'Estado de operacao', exact: true }).selectOption('off');
  await expect.poll(async () => (await inspect()).opening).toBeLessThan(0.07);
  expect((await inspect()).pedal).toBe(1);
  await page.getByRole('combobox', { name: 'Estado de operacao', exact: true }).selectOption('idle');
  await expect.poll(async () => (await inspect()).opening).toBeGreaterThan(0.93);

  await page.getByRole('button', { name: 'Pausar motor', exact: true }).click();
  const frozen = (await inspect()).opening;
  await pedal.focus(); await pedal.press('Home');
  expect((await inspect()).opening).toBe(frozen);
  await page.getByRole('button', { name: 'Rodar motor', exact: true }).click();
  await expect.poll(async () => (await inspect()).opening).toBeLessThan(0.07);
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await lab.screenshot({ path: testInfo.outputPath('egas-throttle-closed.png') });
  const orbit = (await canvas.boundingBox())!;
  await page.mouse.move(orbit.x + orbit.width / 2, orbit.y + orbit.height / 2);
  await page.mouse.down();
  await page.mouse.move(orbit.x + orbit.width * 0.6, orbit.y + orbit.height * 0.55, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await inspect()).camera).not.toEqual(openCamera);
  expect(await pixels()).toBeGreaterThan(100);
  await page.getByRole('button', { name: 'Montagem', exact: true }).click();
  await expect(lab).toHaveAttribute('data-egas-focus', 'none');
  await expect.poll(async () => (await inspect()).wires.length, { timeout: 30_000 }).toBe(12);
  const returned = await inspect();
  expect(returned.enabled).toBe(true);
  expect(returned.plugs).toEqual(initial.plugs);
  await page.getByRole('button', { name: 'Acelerador', exact: true }).click();
  await page.getByRole('button', { name: 'Restaurar modo predefinido', exact: true }).click();
  await expect.poll(async () => (await inspect()).enabled).toBe(false);
  expect((await inspect()).throttle).toBe(0.09);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});