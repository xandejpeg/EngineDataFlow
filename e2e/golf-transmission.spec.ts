import { expect, test } from '@playwright/test';

interface TransmissionInspection {
  camera: number[];
  housing: boolean;
  objects: { name: string; exists: boolean; projected: number[][]; matrix: number[]; status: string }[];
}

test('Embreagem: mecanismo, circuito e retorno ao carro', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  const lab = page.locator('.golf-lab');
  const canvas = page.locator('canvas[data-golf-canvas]');
  await expect(canvas).toBeVisible();
  await page.getByRole('button', { name: 'Embreagem', exact: true }).click();
  await expect(lab).toHaveAttribute('data-clutch-focus', 'mechanism');
  await lab.evaluate(element => element.scrollIntoView({ block: 'start' }));
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectTransmission: () => TransmissionInspection }).inspectTransmission());
  await expect.poll(async () => (await inspect()).objects[0].exists).toBe(true);
  const mechanism = await inspect();
  expect(mechanism.housing).toBe(false);
  for (const object of mechanism.objects.filter(object => object.exists)) {
    for (const coordinate of object.projected.flat()) expect(Math.abs(coordinate)).toBeLessThan(1);
  }
  const pixels = () => canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => { contrastPixels: number; angle: number } }).inspectGolf(true));
  expect((await pixels()).contrastPixels).toBeGreaterThan(100);
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2 + 50, bounds!.y + bounds!.height / 2 + 25, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await inspect()).camera).not.toEqual(mechanism.camera);
  await page.getByRole('button', { name: 'Restaurar enquadramento', exact: true }).click();
  await expect.poll(async () => (await inspect()).camera.map(value => Math.round(value))).toEqual(mechanism.camera.map(value => Math.round(value)));
  await canvas.screenshot({ path: testInfo.outputPath('transmission-mechanism.png') });
  await page.getByRole('checkbox', { name: 'Campana e caixa', exact: true }).check();
  await expect.poll(async () => (await inspect()).housing).toBe(true);
  await page.getByRole('checkbox', { name: 'Campana e caixa', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Circuito', exact: true }).click();
  await expect.poll(async () => (await inspect()).objects[3].exists).toBe(true);
  const circuit = await inspect();
  expect(circuit.objects[3].status).toBe('estimated');
  expect(circuit.objects[0].matrix).toEqual(mechanism.objects[0].matrix);
  for (const object of circuit.objects) {
    for (const coordinate of object.projected.flat()) expect(Math.abs(coordinate)).toBeLessThan(1);
  }
  expect((await pixels()).contrastPixels).toBeGreaterThan(100);
  await canvas.screenshot({ path: testInfo.outputPath('transmission-circuit.png') });
  await page.getByRole('button', { name: 'Carro', exact: true }).click();
  await expect(lab).toHaveAttribute('data-clutch-focus', 'none');
  await expect.poll(async () => (await inspect()).housing).toBe(true);
  expect((await pixels()).contrastPixels).toBeGreaterThan(100);
  const vehicle = (await inspect()).objects.find(object => object.name === 'golf-vehicle');
  expect(vehicle?.exists).toBe(true);
  for (const coordinate of vehicle!.projected.flat()) expect(Math.abs(coordinate)).toBeLessThan(1);
  const angle = (await pixels()).angle;
  await expect.poll(async () => (await pixels()).angle).toBeGreaterThan(angle);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await lab.screenshot({ path: testInfo.outputPath('transmission-return-car.png') });
  expect(errors).toEqual([]);
});