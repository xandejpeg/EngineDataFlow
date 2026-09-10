import { expect, test } from '@playwright/test';

test('Aula 5: foco dimensional das quatro rodas e retorno geral', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Estrutura', exact: true }).click();
  await page.locator('.golf-dimensions > summary').click();
  const canvas = page.locator('canvas[data-golf-canvas]');
  const inspect = () => canvas.evaluate(element => (element as HTMLCanvasElement & {
    inspectDimensions: () => { selected: string; heightMm: number; points: { wheel: string; kind: string; position: number[]; projected: number[] }[] };
  }).inspectDimensions());
  const focus = page.getByLabel('Focar roda', { exact: true });
  await focus.check();
  await expect(page.getByLabel('Cotas no 3D', { exact: true })).toBeChecked();
  for (const wheel of ['front-left', 'front-right', 'rear-left', 'rear-right']) {
    await page.getByLabel('Roda da cota').selectOption(wheel);
    await expect.poll(async () => (await inspect()).selected).toBe(wheel);
    await expect.poll(async () => {
      const points = (await inspect()).points.filter(point => point.wheel === wheel);
      return points.every(point => Math.abs(point.projected[0]) < 0.8 && Math.abs(point.projected[1]) < 0.85);
    }).toBe(true);
    const state = await inspect();
    expect(state.heightMm).toBeCloseTo(356.85);
    const points = state.points.filter(point => point.wheel === wheel);
    expect(Math.abs(points[0].projected[1] - points[1].projected[1])).toBeGreaterThan(0.5);
    const label = page.locator(`[data-dimension-label="${wheel}"]`);
    await expect(label).toBeVisible();
    await expect.poll(async () => {
      const frame = (await canvas.boundingBox())!;
      const box = (await label.boundingBox())!;
      return box.x >= frame.x && box.y >= frame.y && box.x + box.width <= frame.x + frame.width && box.y + box.height <= frame.y + frame.height;
    }).toBe(true);
  }
  await focus.uncheck();
  await expect.poll(async () => {
    const points = (await inspect()).points.filter(point => point.wheel === 'rear-right');
    return Math.abs(points[0].projected[1] - points[1].projected[1]);
  }).toBeLessThan(0.3);
  await focus.check();
  await page.getByLabel('Vista da estrutura').selectOption('top');
  await expect(focus).not.toBeChecked();
  await focus.check();
  await page.getByLabel('Cotas no 3D', { exact: true }).uncheck();
  await expect(focus).not.toBeChecked();
  await expect(page.locator('[data-dimension-label]')).toHaveCount(0);
  expect(errors).toEqual([]);
});