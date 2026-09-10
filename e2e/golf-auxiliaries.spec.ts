import { expect, test } from '@playwright/test';

interface AuxiliaryInspection {
  temperature: number;
  fanAngle: number;
  objects: { name: string; exists: boolean; status: string; projected: number[][] }[];
}

test('Cofre: arrefecimento climatizacao suportes e lavador', async ({ page }, testInfo) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const lab = page.locator('.golf-lab');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectAuxiliaries: () => AuxiliaryInspection }).inspectAuxiliaries());
  const pixels = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number } }).inspectGolf(true).contrastPixels);
  await page.getByRole('button', { name: 'Montagem', exact: true }).click();
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).objects.every(object => object.exists), { timeout: 30_000 }).toBe(true);
  for (const object of (await inspect()).objects) {
    expect(object.status).toBe('estimated');
    for (const coordinate of object.projected.flat()) expect(Math.abs(coordinate)).toBeLessThan(1);
  }
  expect(await pixels()).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('auxiliaries-assembly.png') });
  await page.getByRole('button', { name: 'Corte', exact: true }).click();
  await expect.poll(async () => (await inspect()).objects.every(object => object.exists)).toBe(true);
  expect(await pixels()).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('auxiliaries-cutaway.png') });
  const current = await inspect();
  expect(Number.isFinite(current.fanAngle)).toBe(true);
  if (current.temperature > 85) await expect.poll(async () => (await inspect()).fanAngle).toBeGreaterThan(current.fanAngle);
  else expect(current.fanAngle).toBe(0);
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.65, bounds.y + bounds.height * 0.7, { steps: 10 });
  await page.mouse.up();
  expect(await pixels()).toBeGreaterThan(100);
  await canvas.screenshot({ path: testInfo.outputPath('auxiliaries-orbit.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});