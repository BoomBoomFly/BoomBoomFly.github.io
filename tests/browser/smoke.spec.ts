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
  '/knowledge/research/flight-control/acfly-mavros/',
  '/knowledge/research/perception-localization/t265/',
  '/knowledge/research/perception-localization/d435/',
  '/knowledge/research/perception-localization/uwb/',
  '/knowledge/tools/developer-guide/',
  '/knowledge/tools/git/',
  '/knowledge/tools/conda/',
  '/knowledge/tools/ubuntu-20-04-sources/',
  '/knowledge/history/lab-introduction/',
  '/knowledge/history/about/',
  '/knowledge/history/team/',
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

test('unknown routes use the built-in 404 page', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-public-route/', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.locator('body')).toBeVisible();
});

test('/team/ keeps its public URL while forwarding to the current roster', async ({ page }) => {
  const response = await page.goto('/team/', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe('/about/');
  expect(new URL(page.url()).hash).toBe('#team-roster');
  await expect(page.getByRole('heading', { name: '团队名录', exact: true })).toBeVisible();
});

for (const [legacyUrl, expectedRoute] of [
  ['/00开发者使用手册/', '/knowledge/tools/developer-guide/'],
  ['/01常用开发工具/git.html', '/knowledge/tools/git/'],
  ['/02无人机相关/UWB.html', '/knowledge/research/perception-localization/uwb/'],
  ['/2023/10/29/about/', '/knowledge/history/about/'],
  ['/knowledge/history/about-2023/', '/knowledge/history/about/'],
  ['/group/', '/knowledge/history/team/'],
  ['/knowledge/history/team-2023/', '/knowledge/history/team/'],
  ['/knowledge/legacy/gitbook/acfly-mavros/', '/knowledge/research/flight-control/acfly-mavros/'],
  ['/knowledge/legacy/gitbook/drone-docs/', '/knowledge/research/flight-control/'],
  ['/knowledge/legacy/gitbook/developer-tools/', '/knowledge/tools/'],
  ['/tag/', '/knowledge/'],
] as const) {
  test(`${legacyUrl} redirects to its reviewed public replacement`, async ({ page }) => {
    const response = await page.goto(legacyUrl, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(expectedRoute);
    await expect(page.locator('main h1')).toHaveCount(1);
  });
}
