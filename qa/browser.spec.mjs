import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 768, 1024, 1280, 1600, 1920]) {
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
  await page.getByRole('button', { name: 'Preparar mensaje' }).click();
  await expect(page.getByRole('heading', { name: 'Tu mensaje está listo.' })).toBeFocused();
  await expect(page.getByLabel('Mensaje preparado')).toHaveValue(/negocio & equipo/);
  const href = await page.getByRole('link', { name: 'Usar mi aplicación de correo' }).getAttribute('href');
  expect(new URL(href).searchParams.get('body')).toContain('negocio & equipo');
  const gmail = new URL(await page.getByRole('link', { name: 'Abrir en Gmail' }).getAttribute('href'));
  expect(gmail.searchParams.get('body')).toBe(await page.getByLabel('Mensaje preparado').inputValue());
  await expect(page.getByRole('link', { name: 'Abrir en Gmail' })).toHaveAttribute('target', '_blank');
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

for (const width of [320, 390, 768, 1024, 1280, 1600, 1920]) {
  test(`Diagram stays above its caption in every mode at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    for (const mode of ['Web', 'Aplicación', 'Integración']) {
      await page.getByRole('button', { name: mode, exact: true }).click();
      await page.locator('.plane').evaluateAll(async (planes) => {
        await Promise.all(
          planes.flatMap((plane) => plane.getAnimations()).map((animation) => animation.finished),
        );
      });
      const geometry = await page.locator('.blueprint').evaluate((blueprint) => {
        const caption = blueprint.querySelector('.blueprint-caption').getBoundingClientRect();
        const title = blueprint.querySelector('.blueprint-top').getBoundingClientRect();
        return [...blueprint.querySelectorAll('.plane')].map((plane) => {
          const bounds = plane.getBoundingClientRect();
          return { aboveCaption: bounds.bottom < caption.top, belowTitle: bounds.top > title.bottom };
        });
      });
      expect(geometry.every((plane) => plane.aboveCaption && plane.belowTitle)).toBe(true);
    }
    await page.screenshot({ path: `test-results/hero-${width}.png` });
  });
}

test('Contact offers manual copying when clipboard access is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('Clipboard unavailable')) },
    });
  });
  await page.goto('/#contacto');
  await page.getByRole('button', { name: 'Copiar dirección', exact: true }).click();
  await expect(page.locator('#email-copy-status')).toContainText('Selecciona Copiar');
  await page.getByLabel('¿Cómo te llamas?').fill('María');
  await page.getByLabel('¿Qué te gustaría resolver?').fill('Necesito una web para mi negocio.');
  await page.getByRole('button', { name: 'Preparar mensaje' }).click();
  await page.getByRole('button', { name: 'Copiar mensaje', exact: true }).click();
  await expect(page.locator('#draft-status')).toContainText('Selecciona Copiar');
  const preview = page.getByLabel('Mensaje preparado');
  await expect(preview).toBeFocused();
  expect(await preview.evaluate((input) => input.selectionEnd - input.selectionStart)).toBe(
    (await preview.inputValue()).length,
  );
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations,
  ).toEqual([]);
});

test('Contact copies the message and recipient without sending a request', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'clipboard', {
      value: {
        writeText: async (value) => {
          window.copiedContactText = value;
        },
      },
    });
  });
  await page.goto('/#contacto');
  await page.getByRole('button', { name: 'Copiar dirección', exact: true }).click();
  await expect(page.locator('#email-copy-status')).toHaveText('Dirección copiada.');
  expect(await page.evaluate(() => window.copiedContactText)).toBe('salgadodieguezaymar@gmail.com');
  await page.getByLabel('¿Cómo te llamas?').fill('María');
  await page.getByLabel('¿Qué te gustaría resolver?').fill('Necesito una web para mi negocio.');
  await page.getByRole('button', { name: 'Preparar mensaje' }).click();
  await page.getByRole('button', { name: 'Copiar mensaje', exact: true }).click();
  await expect(page.locator('#draft-status')).toContainText('Mensaje copiado');
  expect(await page.evaluate(() => window.copiedContactText)).toBe(
    await page.getByLabel('Mensaje preparado').inputValue(),
  );
});

for (const width of [390, 1280]) {
  test(`Scroll reveals run once and release transforms at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const heading = page.locator('#proyectos h2');
    await expect(heading).toHaveClass(/motion-pending/);
    await heading.evaluate((element) => {
      element.addEventListener('animationstart', () => {
        element.dataset.animationRuns = String(Number(element.dataset.animationRuns || 0) + 1);
      });
    });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toHaveAttribute('data-animation-runs', '1');
    await expect(heading).not.toHaveClass(/motion-pending|motion-enter/);
    await expect(heading).toHaveCSS('transform', 'none');
    await page.locator('#contacto h2').scrollIntoViewIfNeeded();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toHaveAttribute('data-animation-runs', '1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.motion-pending, .motion-enter')).toHaveCount(0);
    await expect(page.locator('.project').first()).toHaveCSS('animation-name', 'none');
  });
}
