import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

const outputDirectory = resolve('qa-artifacts', 'screenshots');
const referenceUrl = pathToFileURL(resolve('..', 'prototypes', 'color-theme-preview', 'index.html')).href;

test.beforeAll(async () => {
  await mkdir(outputDirectory, { recursive: true });
});

for (const viewport of [
  { width: 1440, height: 1100 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]) {
  test(`capture homepage at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });

    await page.goto(referenceUrl);
    await page.getByRole('button', { name: '航空冷银' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'aviation');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: resolve(outputDirectory, `reference-home-${viewport.width}.png`),
      fullPage: true,
    });

    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: resolve(outputDirectory, `implementation-home-${viewport.width}.png`),
      fullPage: true,
    });
  });
}

test('capture dark theme, mobile navigation, and Starlight states', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('[data-theme-toggle]').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(outputDirectory, 'home-dark.png'), fullPage: false });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('[data-site-header] .menu-toggle').click();
  await page.screenshot({ path: resolve(outputDirectory, 'mobile-menu.png'), fullPage: false });

  await page.goto('/knowledge/research/flight-control/');
  await page.locator('starlight-menu-button button').click();
  await page.screenshot({ path: resolve(outputDirectory, 'starlight-mobile.png'), fullPage: false });
});

test('capture migrated archive content on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/knowledge/legacy/lab-introduction/');
  await expect(page.getByRole('heading', { level: 1, name: '实验室旧站介绍' })).toBeVisible();
  await page.screenshot({ path: resolve(outputDirectory, 'legacy-lab-introduction-desktop.png'), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/knowledge/legacy/gitbook/uwb/');
  await expect(page.getByRole('heading', { level: 1, name: '关于 UWB 的使用' })).toBeVisible();
  await page.screenshot({ path: resolve(outputDirectory, 'legacy-uwb-mobile.png'), fullPage: true });
});
