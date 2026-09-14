import { expect, test } from '@playwright/test';

interface BrakeInspection {
  id: string;
  exists: boolean;
  mounted: boolean;
  rimParent: string;
  rim: number[];
  spokeCount: number;
  position: number[];
  rotor: number[];
  fixed: number[];
  projected: number[][];
  status: string;
}

test('Freios: rodas removiveis rotores moveis e pincas fixas', async ({ page }, testInfo) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const lab = page.locator('.golf-lab');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectBrakes: () => BrakeInspection[] }).inspectBrakes());
  const pixels = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number } }).inspectGolf(true).contrastPixels);
  await page.getByRole('button', { name: 'Montagem', exact: true }).click();
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).filter(brake => brake.exists).length, { timeout: 30_000 }).toBe(4);
  const initial = await inspect();
  expect(initial.every(brake => brake.mounted && brake.status === 'estimated')).toBe(true);
  for (const wheel of initial) {
    expect(wheel.spokeCount).toBe(10);
    expect(wheel.rimParent).toBe(`golf-wheel-mounted-${wheel.id}`);
  }
  await page.getByRole('checkbox', { name: 'Pneus e aros', exact: true }).uncheck();
  await expect.poll(async () => (await inspect()).every(brake => !brake.mounted)).toBe(true);
  expect((await inspect()).map(brake => brake.position)).toEqual(initial.map(brake => brake.position));
  for (const coordinate of (await inspect()).flatMap(brake => brake.projected.flat())) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect(await pixels()).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('brakes-uncovered.png') });
  await page.getByRole('combobox', { name: 'Estado de operacao', exact: true }).selectOption('cruise');
  await expect.poll(async () => (await inspect()).every((brake, index) => JSON.stringify(brake.rotor) !== JSON.stringify(initial[index].rotor))).toBe(true);
  await expect.poll(async () => (await inspect()).every((brake, index) => JSON.stringify(brake.rim) !== JSON.stringify(initial[index].rim))).toBe(true);
  expect((await inspect()).map(brake => brake.fixed)).toEqual(initial.map(brake => brake.fixed));
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.6, bounds.y + bounds.height * 0.6, { steps: 10 });
  await page.mouse.up();
  expect(await pixels()).toBeGreaterThan(100);
  await canvas.screenshot({ path: testInfo.outputPath('brakes-orbit.png') });
  await page.getByRole('button', { name: 'Carro', exact: true }).click();
  await expect.poll(async () => (await inspect()).every(brake => brake.mounted)).toBe(true);
  expect(await pixels()).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('wheels-mounted.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});