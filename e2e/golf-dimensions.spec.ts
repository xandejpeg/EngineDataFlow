import { expect, test } from '@playwright/test';

test('Aula 5: alturas nominais e referencia explicita sem alterar o carro', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/injecao-eletronica-40h/lessons/aula-5-motor-completo');
  await page.locator('.golf-lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Estrutura', exact: true }).click();
  await page.locator('.golf-dimensions > summary').click();
  const selector = page.getByLabel('Referencia de suspensao');
  const rows = page.locator('[data-wheel-height]');
  await expect(selector).toHaveValue('');
  await expect(rows).toHaveCount(4);
  for (const row of await rows.all()) {
    await expect(row).toHaveAttribute('data-status', 'no-reference');
    await expect(row).toContainText('356,85 mm');
  }
  for (const variant of ['standard', 'heavyDuty']) {
    await selector.selectOption(variant);
    for (const row of await rows.all()) await expect(row).toHaveAttribute('data-status', 'out-of-range');
  }
  await selector.selectOption('sportExcept18');
  await expect(page.locator('[data-wheel-height="front-left"]')).toHaveAttribute('data-status', 'out-of-range');
  await expect(page.locator('[data-wheel-height="rear-left"]')).toHaveAttribute('data-status', 'within-range');
  for (const row of await rows.all()) await expect(row).toContainText('356,85 mm');
  await expect(page.locator('.golf-dimensions')).toContainText('caster e convergencia: nao medidos');
  await selector.selectOption('');
  for (const row of await rows.all()) await expect(row).toHaveAttribute('data-status', 'no-reference');
  await page.getByText('Coordenadas do modelo / mm', { exact: true }).click();
  await expect(page.locator('.golf-dimension-coordinates')).toContainText('317,15');
  await expect(page.locator('.golf-dimension-coordinates')).toContainText('674,00');
  expect(await page.locator('.golf-inspector').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.getByRole('button', { name: 'Carro', exact: true }).click();
  const canvas = page.locator('canvas[data-golf-canvas]');
  expect(await canvas.evaluate(element => (element as HTMLCanvasElement & { inspectGolf: () => { contrastPixels: number } }).inspectGolf().contrastPixels)).toBeGreaterThan(100);
  await page.getByRole('button', { name: 'Estrutura', exact: true }).click();
  await page.locator('.golf-dimensions > summary').click();
  await expect(selector).toHaveValue('');
  expect(errors).toEqual([]);
});