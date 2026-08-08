import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  { name: 'home desktop', route: '/' },
  { name: 'home mobile', route: '/', viewport: { width: 390, height: 844 } },
  { name: 'research', route: '/research/' },
  { name: 'projects', route: '/projects/' },
  { name: 'team', route: '/team/' },
  { name: 'join', route: '/join/' },
  { name: 'about', route: '/about/' },
  { name: 'Starlight desktop', route: '/knowledge/' },
  { name: 'Starlight mobile', route: '/knowledge/', viewport: { width: 390, height: 844 } },
  { name: 'legacy archive desktop', route: '/knowledge/legacy/gitbook/uwb/' },
  { name: 'legacy archive mobile', route: '/knowledge/legacy/hexo/team-2023/', viewport: { width: 390, height: 844 } },
];

for (const pageCase of pages) {
  test(`${pageCase.name} has no automatically detectable WCAG A/AA violations`, async ({ page }) => {
    if (pageCase.viewport) await page.setViewportSize(pageCase.viewport);
    await page.goto(pageCase.route, { waitUntil: 'domcontentloaded' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    await test.info().attach(`${pageCase.name.replaceAll(' ', '-')}-axe.json`, {
      body: Buffer.from(JSON.stringify(results, null, 2)),
      contentType: 'application/json',
    });
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test('Starlight open mobile sidebar has no automatically detectable WCAG A/AA violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/knowledge/research/flight-control/', { waitUntil: 'domcontentloaded' });
  await page.locator('starlight-menu-button button').click();
  await expect(page.getByRole('navigation', { name: '主要' }).getByRole('link', { name: '飞行控制与 ROS', exact: true })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  await test.info().attach('Starlight-open-mobile-sidebar-axe.json', {
    body: Buffer.from(JSON.stringify(results, null, 2)),
    contentType: 'application/json',
  });
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
