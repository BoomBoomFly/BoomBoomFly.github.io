import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/',
  '/research/',
  '/projects/',
  '/knowledge/',
  '/knowledge/research/flight-control/',
  '/knowledge/research/perception-localization/',
  '/knowledge/research/robotics-intelligence/',
  '/knowledge/tools/',
  '/knowledge/legacy/lab-introduction/',
  '/knowledge/legacy/gitbook/developer-guide/',
  '/knowledge/legacy/gitbook/developer-tools/',
  '/knowledge/legacy/gitbook/git/',
  '/knowledge/legacy/gitbook/conda/',
  '/knowledge/legacy/gitbook/ubuntu-20-04-sources/',
  '/knowledge/legacy/gitbook/drone-docs/',
  '/knowledge/legacy/gitbook/acfly-mavros/',
  '/knowledge/legacy/gitbook/t265/',
  '/knowledge/legacy/gitbook/d435/',
  '/knowledge/legacy/gitbook/uwb/',
  '/knowledge/legacy/hexo/about-2023/',
  '/knowledge/legacy/hexo/team-2023/',
  '/team/',
  '/join/',
  '/about/',
];

function collectRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

for (const route of routes) {
  test(`${route} renders without browser errors`, async ({ page }) => {
    const runtimeErrors = collectRuntimeErrors(page);
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response, `No response received for ${route}`).not.toBeNull();
    expect(response?.status(), `Unexpected status for ${route}`).toBe(200);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('main h1')).toHaveCount(1);

    await page.evaluate(() => [...document.images].forEach((image) => { image.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every((image) => image.complete));

    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      brokenImages: [...document.images]
        .filter((image) => image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
      description: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? '',
      lang: document.documentElement.lang,
    }));

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.brokenImages).toEqual([]);
    expect(metrics.description).not.toBe('');
    expect(metrics.lang).toBe('zh-CN');
    expect(runtimeErrors).toEqual([]);
  });
}

test('home exposes conservative Organization JSON-LD', async ({ page }) => {
  await page.goto('/');
  const data = await page.locator('script[type="application/ld+json"]').evaluate((script) => JSON.parse(script.textContent ?? '{}'));
  expect(data['@type']).toBe('Organization');
  expect(data.name).toBe('Drone Innovation Lab');
  expect(data.member).toBeUndefined();
  expect(data.email).toBeUndefined();
});

for (const [legacyUrl, expectedRoute] of [
  ['/00开发者使用手册/', '/knowledge/legacy/gitbook/developer-guide/'],
  ['/01常用开发工具/git.html', '/knowledge/legacy/gitbook/git/'],
  ['/02无人机相关/UWB.html', '/knowledge/legacy/gitbook/uwb/'],
  ['/2023/10/29/about/', '/knowledge/legacy/hexo/about-2023/'],
  ['/group/', '/knowledge/legacy/hexo/team-2023/'],
  ['/tag/', '/knowledge/'],
] as const) {
  test(`${legacyUrl} redirects to its reviewed public replacement`, async ({ page }) => {
    const response = await page.goto(legacyUrl, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(expectedRoute);
    await expect(page.locator('main h1')).toHaveCount(1);
  });
}
