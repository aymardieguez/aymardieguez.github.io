import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 768, 1280, 1600]) {
  test(`Home layout, assets and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    for (const section of ['#proyectos', '#servicios', '#sobre-mi', '#contacto']) {
      await page.locator(section).scrollIntoViewIfNeeded();
    }
    const images = await page
      .locator('img')
      .evaluateAll((items) => items.map((item) => item.complete && item.naturalWidth > 0));
    expect(images.every(Boolean)).toBe(true);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations,
    ).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  });
}

for (const slug of ['jose-vale', 'nereida', 'viaja']) {
  test(`Direct project URL and mobile layout: ${slug}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/proyectos/${slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('link', { name: 'Resultado', exact: true }).click();
    await expect(page.locator('#resultado')).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations,
    ).toEqual([]);
    await page.screenshot({ path: `test-results/${slug}-390.png`, fullPage: true });
  });
}

test('Contact creates a reviewable draft and supports editing without sending requests', async ({ page }) => {
  await page.goto('/#contacto');
  await page.getByLabel('¿Cómo te llamas?').fill('María');
  await page
    .getByLabel('¿Qué te gustaría resolver?')
    .fill('Necesito una aplicación para organizar mi negocio & equipo.');
  await page.getByRole('button', { name: 'Preparar correo' }).click();
  await expect(page.getByRole('status')).toContainText('borrador está preparado');
  const href = await page.getByRole('link', { name: 'Abrir mi correo' }).getAttribute('href');
  expect(new URL(href).searchParams.get('body')).toContain('negocio & equipo');
  await expect(page.getByRole('link', { name: 'Abrir mi correo' })).toBeFocused();
  await page.getByRole('button', { name: 'Editar mi idea' }).click();
  await expect(page.getByLabel('¿Qué te gustaría resolver?')).toBeFocused();
  await expect(page.getByLabel('¿Cómo te llamas?')).toHaveValue('María');
});

test('Mobile menu closes with Escape and the interactive diagram works by keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menú' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  const integration = page.getByRole('button', { name: 'Integración', exact: true });
  await integration.focus();
  await page.keyboard.press('Enter');
  await expect(integration).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#blueprint-project')).toContainText('Gemini');
});

test('Reduced motion and no-JS preserve access to content and contact', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Escribir un correo' })).toHaveAttribute('href', /^mailto:/);
  await expect(page.getByRole('heading', { name: 'Menos promesas. Más producto.' })).toBeVisible();
  await context.close();
});
