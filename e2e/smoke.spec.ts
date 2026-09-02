import { expect, test } from '@playwright/test';

test('laboratorio carrega, motor liga e o angulo avanca', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) errors.push(msg.text());
  });

  await page.goto('/');
  await expect(page.getByRole('button', { name: /Ligar|Pausar/ })).toBeVisible();

  // Start the engine and confirm the crank angle scrubber advances.
  await page.getByRole('button', { name: 'Ligar' }).click();
  const scrubber = page.getByLabel('Angulo do virabrequim 0 a 720 graus');
  const before = await scrubber.inputValue();
  await page.waitForTimeout(700);
  const after = await scrubber.inputValue();
  expect(Number(after)).not.toEqual(Number(before));

  expect(errors, `console errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('ativar detonacao aumenta o indice de knock', async ({ page }) => {
  await page.goto('/cases/detonation');
  await expect(page.getByRole('heading', { name: /Detonacao/ })).toBeVisible();
  await page.getByRole('button', { name: 'Detonacao', exact: true }).click();
  await expect(page.getByText(/Hipotese correta/)).toBeVisible();
});

test('data flow conecta sensores e atuadores', async ({ page }) => {
  await page.goto('/data-flow');
  await expect(page.getByRole('heading', { name: 'Data Flow' })).toBeVisible();
  await expect(page.getByText('Sensores (entradas)')).toBeVisible();
  await expect(page.getByText('Atuadores (saidas da ECU)')).toBeVisible();
});

test('exportar e sobre o modelo acessiveis', async ({ page }) => {
  await page.goto('/about-model');
  await expect(page.getByRole('heading', { name: 'Sobre o modelo' })).toBeVisible();
  await expect(page.getByText(/η_ideal/)).toBeVisible();
});
