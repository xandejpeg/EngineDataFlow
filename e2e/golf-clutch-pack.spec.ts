import { expect, test } from '@playwright/test';

interface PackInspection {
  exploded: boolean;
  dimensionalStatus: string;
  applicationStatus: string;
  angle: number;
  objects: { name: string; exists: boolean; position: number[]; min: number[]; max: number[]; projected: number[][] }[];
}

test('Embreagem: volante disco plato e vista explodida', async ({ page }, testInfo) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const lab = page.locator('.golf-lab');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible();
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectClutchPack: () => PackInspection }).inspectClutchPack());
  const pixels = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number } }).inspectGolf(true).contrastPixels);
  await page.getByRole('button', { name: 'Embreagem', exact: true }).click();
  await page.getByRole('button', { name: 'Conjunto', exact: true }).click();
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).objects.every(object => object.exists)).toBe(true);
  const assembled = await inspect();
  expect(assembled.exploded).toBe(false);
  expect(assembled.angle).toBe(0);
  expect(assembled.dimensionalStatus).toBe('estimated');
  expect(assembled.applicationStatus).toBe('generic-not-oe-selected');
  for (const coordinate of assembled.objects.flatMap(object => object.projected.flat())) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect(await pixels()).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('clutch-pack-assembled.png') });
  await page.getByRole('button', { name: 'Explodida', exact: true }).click();
  await expect.poll(async () => (await inspect()).exploded).toBe(true);
  await expect(page.getByRole('checkbox', { name: 'Campana e caixa', exact: true })).toBeDisabled();
  const exploded = await inspect();
  const [flywheel, disc, pressure, cover] = exploded.objects;
  expect(flywheel.min[0]).toBeGreaterThan(disc.max[0]);
  expect(disc.min[0]).toBeGreaterThan(pressure.max[0]);
  expect(pressure.min[0]).toBeGreaterThan(cover.max[0]);
  for (const coordinate of exploded.objects.flatMap(object => object.projected.flat())) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect(await pixels()).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('clutch-pack-exploded.png') });
  await page.getByRole('button', { name: 'Conjunto', exact: true }).click();
  await expect.poll(async () => (await inspect()).objects.map(object => object.position)).toEqual(assembled.objects.map(object => object.position));
  await page.getByRole('button', { name: 'Carro', exact: true }).click();
  await expect.poll(async () => (await inspect()).exploded).toBe(false);
  const angle = (await inspect()).angle;
  await expect.poll(async () => (await inspect()).angle).toBeLessThan(angle);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});