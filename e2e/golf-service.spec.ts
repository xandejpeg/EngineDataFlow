import { expect, test, type Page } from '@playwright/test';

interface ServiceDiagnostics {
  testPoints: { id: string; position: number[]; screen: number[] }[];
  sparks: boolean[];
  contrastPixels: number;
}

async function diagnostics(page: Page, includePixels = false): Promise<ServiceDiagnostics> {
  return page.locator('canvas[data-golf-canvas]').evaluate((canvas, pixels) => (canvas as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => ServiceDiagnostics }).inspectGolf(pixels), includePixels);
}

test('Aula 5: inspecao acessivel e medicao nos terminais', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Voltar a zero graus', exact: true }).click();
  await page.getByRole('button', { name: 'Inspecao do cofre', exact: true }).click();
  await expect(page.locator('.golf-lab')).toHaveAttribute('data-inspection', 'true');
  await expect(page.getByLabel('Componente do motor')).toHaveValue('28');
  await page.getByLabel('Estado de operacao').selectOption('key');
  await expect(page.getByLabel('Tensao medida')).toHaveText('12.60');
  await page.getByLabel('Fusivel aberto').selectOption('ecu');
  await expect(page.getByLabel('Tensao medida')).toHaveText('12.60');
  await page.getByLabel('Ponta vermelha').selectOption('ecu-out');
  await expect(page.getByLabel('Tensao medida')).toHaveText('0.00');
  await page.getByLabel('Ponta preta').selectOption('ecu-in');
  await expect(page.getByLabel('Tensao medida')).toHaveText('-12.60');
  await page.getByLabel('Ponta vermelha').selectOption('ecu-in');
  await expect(page.getByLabel('Tensao medida')).toHaveText('0.00');
  await page.getByLabel('Ponta preta').selectOption('bodyGround');
  await page.locator('canvas[data-golf-canvas]').scrollIntoViewIfNeeded();
  const snapshot = await diagnostics(page, true);
  expect(snapshot.testPoints).toHaveLength(13);
  expect(snapshot.contrastPixels).toBeGreaterThan(100);
  const point = snapshot.testPoints.find(item => item.id === 'pump-out')!;
  expect(Math.abs(point.screen[0])).toBeLessThan(1);
  expect(Math.abs(point.screen[1])).toBeLessThan(1);
  const canvas = (await page.locator('canvas[data-golf-canvas]').boundingBox())!;
  await page.mouse.click(canvas.x + (point.screen[0] + 1) * canvas.width / 2, canvas.y + (1 - point.screen[1]) * canvas.height / 2);
  await expect(page.getByLabel('Ponta vermelha')).toHaveValue('pump-out');

  await page.getByRole('button', { name: 'Habitaculo', exact: true }).click();
  await expect.poll(async () => (await diagnostics(page)).testPoints.length).toBe(2);
  await page.getByRole('button', { name: 'Cofre', exact: true }).click();
  await page.getByLabel('Fusivel aberto').selectOption('');
  await page.getByLabel('Estado de operacao').selectOption('idle');
  await page.getByLabel('Angulo do virabrequim').fill('710');
  await expect.poll(async () => (await diagnostics(page)).sparks.some(Boolean)).toBe(true);
  await page.getByLabel('Fusivel aberto').selectOption('ecu');
  await expect.poll(async () => (await diagnostics(page)).sparks.some(Boolean)).toBe(false);
  await page.getByLabel('Componente do motor').selectOption('13');
  await expect(page.locator('.golf-part-detail')).toContainText('leitura indisponivel');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});