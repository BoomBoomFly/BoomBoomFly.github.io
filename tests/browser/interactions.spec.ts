import { expect, test } from '@playwright/test';

test('homepage follows the approved 01–05 editorial sequence', async ({ page }) => {
  await page.goto('/');
  const firstSection = page.locator('main > section').first();
  await expect(firstSection.locator('.section-marker').first()).toContainText('01 / INTRO');
  await expect(page.locator('main > section')).toHaveCount(5);
  await expect(page.getByRole('heading', { name: /我们构建无人机、机器人与智能感知系统/ })).toBeVisible();
  await expect(page.getByRole('link', { name: '查看项目' })).toHaveAttribute('href', '/projects/');
  await expect(page.getByRole('link', { name: '加入我们' }).first()).toHaveAttribute('href', '/join/');
  await expect(page.locator('img[src="/brand/drone-lab-logo.svg"]')).toBeVisible();
});

test('mobile menu synchronizes state, manages focus, and closes predictably', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menu = page.locator('[data-site-header] .menu-toggle');
  const navigation = page.locator('#site-navigation');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();

  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  await expect(navigation.locator('a').first()).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();

  await menu.click();
  await page.mouse.click(10, 200);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('theme preference stays consistent across Astro and Starlight', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const themeToggle = page.locator('[data-theme-toggle]');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(themeToggle).toHaveAttribute('aria-label', '切换到深色主题');

  await themeToggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(themeToggle).toHaveAttribute('aria-label', '切换到浅色主题');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('starlight-theme'))).toBe('dark');

  await page.goto('/knowledge/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const starlightTheme = page.locator('starlight-theme-select:visible select').first();
  await starlightTheme.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('Starlight sidebar groups historical material into current knowledge paths', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/knowledge/');
  await expect(page.getByRole('button', { name: '搜索', exact: true })).toBeVisible();

  await page.goto('/knowledge/research/flight-control/');
  const sidebar = page.getByRole('navigation', { name: '主要' });
  const currentSidebarLink = sidebar.getByRole('link', { name: '飞行控制与 ROS', exact: true });
  await expect(currentSidebarLink).toBeVisible();
  await expect(sidebar.getByText('飞控与感知（历史）', { exact: true })).toBeVisible();
  await expect(sidebar.getByText('环境与工具（历史）', { exact: true })).toBeVisible();
  await expect(sidebar.getByText('实验室与团队', { exact: true })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'ACFly-Mavros', exact: true })).toHaveAttribute(
    'href',
    '/knowledge/legacy/gitbook/acfly-mavros/',
  );
  await expect(sidebar.getByRole('link', { name: 'Git', exact: true })).toHaveAttribute(
    'href',
    '/knowledge/legacy/gitbook/git/',
  );
  await expect(sidebar.getByRole('link', { name: '2023 年团队名录', exact: true })).toHaveAttribute(
    'href',
    '/knowledge/legacy/hexo/team-2023/',
  );
  await expect(sidebar.getByText('旧站公开档案', { exact: true })).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const menuHost = page.locator('starlight-menu-button');
  await menuHost.locator('button').click();
  await expect(menuHost).toHaveAttribute('aria-expanded', 'true');
  await expect(currentSidebarLink).toBeVisible();
});

test('reduced motion keeps core content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.direction-item')).toHaveCount(4);
  const duration = await page.locator('.knowledge-card').first().evaluate((item) => getComputedStyle(item).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});
