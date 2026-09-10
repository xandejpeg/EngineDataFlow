import { expect, test } from '@playwright/test';

interface GearboxInspection {
  selected: number;
  dimensionalStatus: string;
  ratios: string;
  objects: { name: string; exists: boolean; projected: number[][] }[];
}

test('Cambio: seis pares diferencial e retorno ao carro', async ({ page }, testInfo) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const lab = page.locator('.golf-lab');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGearbox: () => GearboxInspection }).inspectGearbox());
  const frame = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number; angle: number } }).inspectGolf(true));
  await page.getByRole('button', { name: 'Embreagem', exact: true }).click();
  await page.getByRole('button', { name: 'Cambio', exact: true }).click();
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).objects.filter(object => object.exists).length, { timeout: 30_000 }).toBe(10);
  const data = await inspect();
  expect(data.dimensionalStatus).toBe('estimated');
  expect(data.ratios).toBe('not-specified');
  for (const coordinate of data.objects.flatMap(object => object.projected.flat())) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect((await frame()).contrastPixels).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('gearbox-open.png') });
  const selection = page.getByRole('combobox', { name: 'Componente do cambio', exact: true });
  for (const value of ['1', '6', '7', '0']) {
    await selection.selectOption(value);
    await expect.poll(async () => (await inspect()).selected).toBe(Number(value));
  }
  await selection.selectOption('7');
  await lab.screenshot({ path: testInfo.outputPath('gearbox-differential.png') });
  await page.getByRole('checkbox', { name: 'Campana e caixa', exact: true }).check();
  expect((await frame()).contrastPixels).toBeGreaterThan(100);
  await page.getByRole('checkbox', { name: 'Campana e caixa', exact: true }).uncheck();
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.6, bounds.y + bounds.height * 0.6, { steps: 10 });
  await page.mouse.up();
  expect((await frame()).contrastPixels).toBeGreaterThan(100);
  await canvas.screenshot({ path: testInfo.outputPath('gearbox-orbit.png') });
  await page.getByRole('button', { name: 'Carro', exact: true }).click();
  await expect(lab).toHaveAttribute('data-clutch-focus', 'none');
  await expect.poll(async () => (await inspect()).objects.every(object => object.exists)).toBe(true);
  const angle = (await frame()).angle;
  await expect.poll(async () => (await frame()).angle).toBeGreaterThan(angle);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});