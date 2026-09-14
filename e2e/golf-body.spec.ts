import { expect, test } from '@playwright/test';

test('Golf exterior starts closed and supports three inspectable views', async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('button', { name: 'Carro', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Pausar motor', exact: true }).click();
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectTransmission: () => { camera: number[]; objects: { name: string; projected: number[][] }[] } }).inspectTransmission());
  const pixels = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number; angle: number } }).inspectGolf(true));
  const views = page.getByRole('combobox', { name: 'Vista externa', exact: true });
  for (const view of ['front', 'side', 'rear']) {
    await views.selectOption(view);
    await canvas.evaluate(element => element.scrollIntoView({ block: 'center' }));
    await expect.poll(async () => (await inspect()).objects.find(object => object.name === 'golf-vehicle')?.projected.every(point => point.every(coordinate => Math.abs(coordinate) < 1)), { timeout: 30_000 }).toBe(true);
    expect((await pixels()).contrastPixels).toBeGreaterThan(800);
    await canvas.screenshot({ path: testInfo.outputPath(`golf-${view}.png`) });
    const camera = (await inspect()).camera;
    if (view === 'front') expect(camera[2]).toBeLessThan(0);
    if (view === 'side') expect(camera[2]).toBeCloseTo(1300);
    if (view === 'rear') expect(camera[2]).toBeGreaterThan(3000);
  }
  const original = (await inspect()).camera;
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.6, bounds.y + bounds.height * 0.6, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await inspect()).camera).not.toEqual(original);
  await page.getByRole('button', { name: 'Restaurar enquadramento', exact: true }).click();
  await expect.poll(async () => Math.abs((original[0] - (await inspect()).camera[0])), { timeout: 30_000 }).toBeLessThan(1);
  await page.getByRole('button', { name: 'Montagem', exact: true }).click();
  await expect.poll(async () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectVehicleAssembly: () => { name: string; visible: boolean }[] }).inspectVehicleAssembly().find(object => object.name === 'golf-body-panels')?.visible), { timeout: 30_000 }).toBe(false);
  await page.getByRole('button', { name: 'Carro', exact: true }).click();
  await expect(views).toHaveValue('rear');
  await canvas.evaluate(element => element.scrollIntoView({ block: 'center' }));
  expect((await pixels()).contrastPixels).toBeGreaterThan(800);
  await page.getByRole('button', { name: 'Rodar motor', exact: true }).click();
  await canvas.evaluate(element => element.scrollIntoView({ block: 'center' }));
  const angle = (await pixels()).angle;
  await expect.poll(async () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { angle: number } }).inspectGolf(false).angle), { timeout: 30_000 }).toBeGreaterThan(angle);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});