import { expect, test } from '@playwright/test';

test('Aula 5: marcadores e cotas sincronizam selecao com o painel', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Estrutura', exact: true }).click();
  await page.locator('.golf-dimensions > summary').click();
  const canvas = page.locator('canvas[data-golf-canvas]');
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & {
    inspectDimensions: () => { selected: string | null; heightMm: number | null; points: { wheel: string; kind: string; position: number[]; projected: number[] }[] };
  }).inspectDimensions());
  expect((await inspect()).points).toHaveLength(0);
  await page.getByLabel('Cotas no 3D', { exact: true }).check();
  await expect.poll(async () => (await inspect()).points.length).toBe(8);
  const initial = await inspect();
  expect(initial.selected).toBe('front-left');
  expect(initial.heightMm).toBeCloseTo(356.85);
  for (const point of initial.points) {
    expect(point.position[1]).toBeCloseTo(point.kind === 'hub' ? 317.15 : 674);
    expect(Math.abs(point.projected[0])).toBeLessThan(1);
    expect(Math.abs(point.projected[1])).toBeLessThan(1);
  }
  await page.getByLabel('Roda da cota').selectOption('rear-right');
  await expect(page.locator('[data-dimension-label="rear-right"]')).toContainText('356,85 mm');
  await expect(page.locator('[data-wheel-height="rear-right"]')).toHaveAttribute('data-selected', 'true');
  expect((await inspect()).selected).toBe('rear-right');
  const marker = (await inspect()).points.find(point => point.wheel === 'front-right' && point.kind === 'hub')!;
  await canvas.scrollIntoViewIfNeeded();
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.click(bounds.x + (marker.projected[0] + 1) * bounds.width / 2, bounds.y + (1 - marker.projected[1]) * bounds.height / 2);
  await expect(page.getByLabel('Roda da cota')).toHaveValue('front-right');
  await expect(page.locator('[data-dimension-label="front-right"]')).toBeVisible();
  const after = await inspect();
  expect(after.points.map(point => point.position)).toEqual(initial.points.map(point => point.position));
  expect(after.heightMm).toBeCloseTo(initial.heightMm!);
  await page.getByLabel('Cotas no 3D', { exact: true }).uncheck();
  await expect.poll(async () => (await inspect()).points.length).toBe(0);
  await expect(page.locator('[data-dimension-label]')).toHaveCount(0);
  await page.getByLabel('Cotas no 3D', { exact: true }).check();
  await page.getByRole('button', { name: 'Carro', exact: true }).click();
  await expect.poll(async () => (await inspect()).points.length).toBe(0);
  await expect(page.locator('[data-dimension-label]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Estrutura', exact: true }).click();
  await expect.poll(async () => (await inspect()).selected).toBe('front-right');
  expect(await canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: () => { contrastPixels: number } }).inspectGolf().contrastPixels)).toBeGreaterThan(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});