import { expect, test, type Page } from '@playwright/test';

interface Diagnostics {
  contrastPixels: number;
  parts: number[];
  pistons: { name: string; localY: number }[];
  angle: number;
  elapsed: number;
  operation: string;
  pumpLow: boolean;
  geometries: number;
  rpm: number;
  openFuse: string | null;
  electrical: { ecu: boolean; pump: boolean; ignition: boolean; diagnostics: boolean; sensor5V: number; mainRelay: boolean };
  fuseBoxes: { name: string; position: number[] }[];
}

async function inspect(page: Page, includePixels = false): Promise<Diagnostics> {
  return page.locator('canvas[data-golf-canvas]').evaluate((canvas, pixels) =>
    (canvas as HTMLCanvasElement & { inspectGolf: (pixels: boolean) => Diagnostics }).inspectGolf(pixels), includePixels);
}

test('Aula 5: cinco partes, controles, sincronismo e comparacao', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  await expect(page.getByRole('heading', { name: 'Motor completo', exact: true })).toBeVisible();
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await expect(page.locator('canvas[data-golf-canvas]')).toBeVisible();
  await page.getByRole('button', { name: 'Voltar a zero graus', exact: true }).click();
  await expect.poll(async () => (await inspect(page)).pistons[0]?.localY).toBeCloseTo(190.4);
  expect((await inspect(page)).parts).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
  expect((await inspect(page, true)).contrastPixels).toBeGreaterThan(100);
  expect(await page.locator('[data-cylinder]').evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset.state))).toEqual(['BALANCO', 'ESCAPE', 'ADMISSAO', 'CRUZAMENTO']);
  await expect(page.getByLabel('Componente do motor').locator('option')).toHaveCount(29);

  for (const mode of ['Carro', 'Fantasma', 'Corte']) {
    await page.getByRole('button', { name: mode, exact: true }).click();
    await expect(page.getByRole('button', { name: mode, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByLabel('Componente do motor').selectOption('18');
  await expect(page.locator('.golf-part-detail')).toContainText('Modulo do tanque');
  await page.getByRole('button', { name: 'Restaurar enquadramento', exact: true }).click();
  await page.getByRole('button', { name: 'Proximo tempo do motor', exact: true }).click();
  await expect.poll(async () => (await inspect(page)).pistons[0]?.localY).toBeCloseTo(97.6);
  const pausedAngle = (await inspect(page)).angle;
  await page.getByLabel('Componente do motor').selectOption('17');
  expect((await inspect(page)).angle).toBe(pausedAngle);

  await page.getByRole('button', { name: 'Proxima', exact: true }).click();
  await expect(page.locator('.golf-lab')).toHaveAttribute('data-view', 'engine');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Voltar a zero graus', exact: true }).click();
  await expect.poll(async () => (await inspect(page)).pistons[0]?.localY).toBeCloseTo(190.4);
  expect((await inspect(page, true)).contrastPixels).toBeGreaterThan(100);

  await page.getByRole('button', { name: 'Proxima', exact: true }).click();
  await expect(page.locator('.golf-lab')).toHaveAttribute('data-view', 'fuel');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await expect(page.locator('canvas[data-golf-canvas]')).toBeVisible();

  await page.getByRole('button', { name: 'Proxima', exact: true }).click();
  await expect(page.locator('.golf-lab')).toHaveAttribute('data-view', 'compare');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Voltar a zero graus', exact: true }).click();
  await page.getByLabel('Angulo do virabrequim').fill('660');
  await expect.poll(async () => (await inspect(page)).angle % 720).toBe(660);
  const compared = await inspect(page, true);
  expect(compared.pistons).toHaveLength(2);
  expect(compared.pistons[0].localY).toBeCloseTo(compared.pistons[1].localY);
  expect(compared.contrastPixels).toBeGreaterThan(100);

  await page.getByRole('button', { name: 'Proxima', exact: true }).click();
  await expect(page.locator('.golf-lab')).toHaveAttribute('data-view', 'systems');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Voltar a zero graus', exact: true }).click();
  await page.getByLabel('Estado de operacao').selectOption('key');
  const keyAngle = (await inspect(page)).angle;
  expect(keyAngle % 720).toBe(0);
  await page.getByRole('button', { name: 'Rodar motor', exact: true }).click();
  await expect.poll(async () => (await inspect(page)).pumpLow).toBe(false);
  expect((await inspect(page)).angle).toBe(keyAngle);
  await page.getByLabel('Scanner', { exact: true }).check();
  await page.getByLabel('Componente do motor').selectOption('4');
  await expect(page.locator('.golf-part-detail')).toContainText('Scanner conectado');
  await page.getByLabel('Cenario de falha').check();
  await expect(page.getByLabel('Cenario de falha')).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

test('Aula 5: caixas separadas e falhas de alimentacao', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Voltar a zero graus', exact: true }).click();
  await page.getByLabel('Componente do motor').selectOption('28');
  await expect(page.getByLabel('Fusivel aberto')).toBeVisible();
  expect((await inspect(page)).fuseBoxes).toEqual([
    { name: 'golf-fusebox-engine', position: [-590, 780, 440] },
    { name: 'golf-fusebox-cabin', position: [-700, 810, 870] },
  ]);
  for (const location of ['Habitaculo', 'Cofre']) {
    await page.getByRole('button', { name: location, exact: true }).click();
    await expect(page.getByRole('button', { name: location, exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect((await inspect(page, true)).contrastPixels).toBeGreaterThan(100);
  }
  for (const openFuse of ['ecu', 'pump', 'ignition', 'main']) {
    await page.getByLabel('Fusivel aberto').selectOption(openFuse);
    expect((await inspect(page)).rpm).toBe(0);
    expect((await inspect(page)).openFuse).toBe(openFuse);
  }
  await page.getByLabel('Fusivel aberto').selectOption('diagnostics');
  expect((await inspect(page)).rpm).toBe(780);
  expect((await inspect(page)).electrical.diagnostics).toBe(false);
  await page.getByLabel('Componente do motor').selectOption('4');
  await expect(page.locator('.golf-part-detail')).toContainText('Tomada sem alimentacao');
  await page.getByLabel('Componente do motor').selectOption('28');
  await page.getByLabel('Fusivel aberto').selectOption('ecu');
  await page.getByLabel('Estado de operacao').selectOption('starting');
  expect((await inspect(page)).rpm).toBe(250);
  expect((await inspect(page)).electrical.sensor5V).toBe(0);
  await page.getByRole('button', { name: 'Proxima', exact: true }).click();
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByLabel('Componente do motor').selectOption('28');
  await expect(page.getByLabel('Fusivel aberto')).toHaveValue('ecu');
  await page.getByLabel('Fusivel aberto').selectOption('');
  await page.getByLabel('Estado de operacao').selectOption('idle');
  await expect.poll(async () => (await inspect(page)).electrical.sensor5V).toBe(5);
  expect((await inspect(page)).rpm).toBe(780);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});