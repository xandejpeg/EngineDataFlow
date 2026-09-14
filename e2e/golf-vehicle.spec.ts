import { expect, test } from '@playwright/test';

interface AssemblyObject {
  name: string;
  visible: boolean;
  status?: string;
  min?: number[];
  max?: number[];
}

test('Carro: cabine, quatro suspensoes, direcao e montagem aberta', async ({ page }, testInfo) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const lab = page.locator('.golf-lab');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectVehicleAssembly: () => AssemblyObject[] }).inspectVehicleAssembly());
  const pixels = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number; angle: number } }).inspectGolf(true));
  const engineAngle = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { angle: number } }).inspectGolf(false).angle);
  const camera = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectTransmission: () => { camera: number[]; objects: { name: string; projected: number[][] }[] } }).inspectTransmission());
  await page.getByRole('button', { name: 'Montagem', exact: true }).click();
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await expect.poll(async () => (await inspect()).filter(object => !object.visible).map(object => object.name), { timeout: 30_000 }).toEqual(['golf-body-panels']);
  const objects = await inspect();
  expect(objects.find(object => object.name === 'golf-body-panels')?.visible).toBe(false);
  expect(objects.find(object => object.name === 'golf-cabin')?.status).toBe('estimated');
  expect(objects.find(object => object.name === 'golf-chassis')?.status).toBe('estimated');
  expect(objects.filter(object => object.name.startsWith('golf-halfshaft-'))).toHaveLength(2);
  for (const object of objects) {
    expect(object.min?.every(Number.isFinite)).toBe(true);
    expect(object.max?.every(Number.isFinite)).toBe(true);
  }
  expect((await pixels()).contrastPixels).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('vehicle-assembly.png') });
  const originalCamera = (await camera()).camera;
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.65, bounds.y + bounds.height * 0.7, { steps: 12 });
  await page.mouse.up();
  await expect.poll(async () => (await camera()).camera).not.toEqual(originalCamera);
  expect((await pixels()).contrastPixels).toBeGreaterThan(100);
  await canvas.screenshot({ path: testInfo.outputPath('vehicle-assembly-orbit.png') });
  await page.getByRole('button', { name: 'Carro', exact: true }).click();
  await expect.poll(async () => (await inspect()).filter(object => !object.visible).map(object => object.name)).toEqual([]);
  for (const coordinate of (await camera()).objects.find(object => object.name === 'golf-vehicle')!.projected.flat()) expect(Math.abs(coordinate)).toBeLessThan(1);
  expect((await pixels()).contrastPixels).toBeGreaterThan(100);
  await lab.screenshot({ path: testInfo.outputPath('vehicle-solid.png') });
  await page.getByRole('button', { name: 'Fantasma', exact: true }).click();
  await expect.poll(async () => (await inspect()).filter(object => !object.visible).map(object => object.name)).toEqual([]);
  await lab.screenshot({ path: testInfo.outputPath('vehicle-ghost.png') });
  expect((await pixels()).contrastPixels).toBeGreaterThan(100);
  const angle = await engineAngle();
  await expect.poll(engineAngle).toBeGreaterThan(angle);
  await page.getByRole('button', { name: 'Corte', exact: true }).click();
  await expect.poll(async () => (await inspect()).some(object => object.visible)).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});