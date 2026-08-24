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
  const mainNavigation = page.getByRole('navigation', { name: '主导航' });
  await expect(mainNavigation.getByRole('link', { name: '知识库', exact: true })).toHaveAttribute('href', '/knowledge/');
  await expect(mainNavigation.getByRole('link', { name: '实验室介绍', exact: true })).toHaveAttribute('href', '/about/');
  await expect(mainNavigation.getByRole('link', { name: '研究方向', exact: true })).toHaveCount(0);
  await expect(mainNavigation.getByRole('link', { name: '项目档案', exact: true })).toHaveCount(0);
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
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(255, 255, 255)');
  await expect(themeToggle).toHaveAttribute('aria-label', '切换到深色主题');

  await themeToggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(25, 26, 27)');
  await expect
    .poll(() => page.locator('.closing-grid article').nth(1).evaluate((element) => getComputedStyle(element).backgroundColor))
    .toBe('rgb(25, 26, 27)');
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

test('Starlight sidebar groups documents into current knowledge paths', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/knowledge/');
  await expect(page.getByRole('button', { name: '搜索', exact: true })).toBeVisible();

  await page.goto('/knowledge/research/flight-control/');
  const sidebar = page.getByRole('navigation', { name: '主要' });
  const currentSidebarLink = sidebar.locator('a[href="/knowledge/research/flight-control/"]');
  await expect(currentSidebarLink).toBeVisible();
  await expect(currentSidebarLink).toHaveText('方向介绍');
  await expect(sidebar.getByText('实验室与团队', { exact: true })).toHaveCount(0);
  for (const route of [
    '/knowledge/research/flight-control/acfly-mavros/',
    '/knowledge/research/perception-localization/d435/',
    '/knowledge/research/perception-localization/uwb/',
    '/knowledge/tools/git/',
    '/knowledge/tools/conda/',
  ]) {
    await expect(sidebar.locator(`a[href="${route}"]`).getByText('历史', { exact: true })).toBeVisible();
  }
  await expect(sidebar.getByText('学习路线', { exact: true })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'ROS 2', exact: true })).toHaveAttribute(
    'href',
    '/knowledge/tools/learning-paths/ros2/',
  );
  await expect(sidebar.getByRole('link', { name: 'Ubuntu 20.04（历史）', exact: true })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: 'GitBook 旧站（历史）', exact: true })).toBeVisible();
  await expect(sidebar.getByText('旧站公开档案', { exact: true })).toHaveCount(0);
  await expect(sidebar.getByText('主题概览', { exact: true })).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const menuHost = page.locator('starlight-menu-button');
  await menuHost.locator('button').click();
  await expect(menuHost).toHaveAttribute('aria-expanded', 'true');
  await expect(currentSidebarLink).toBeVisible();
});

test('历史文档在目录入口统一标记，当前 Git 学习路线不误标', async ({ page }) => {
  for (const [route, labels] of [
    ['/knowledge/research/flight-control/', ['在上位机安装 ACFly-Mavros（历史）']],
    ['/knowledge/research/perception-localization/', ['RealSense D435（历史）', 'UWB（历史）']],
    ['/knowledge/tools/', ['Git 的安装、配置与学习入口（历史）', 'Conda 环境管理及常用指令（历史）']],
  ] as const) {
    await page.goto(route);
    for (const label of labels) await expect(page.getByRole('link', { name: label, exact: true })).toBeVisible();
  }

  const sidebar = page.getByRole('navigation', { name: '主要' });
  await expect(sidebar.locator('a[href="/knowledge/tools/learning-paths/git/"]')).not.toContainText('历史');
});

test('实验室与团队资料页指回当前主入口', async ({ page }) => {
  for (const [route, label, href] of [
    ['/knowledge/history/lab-introduction/', '实验室介绍', '/about/#lab-introduction'],
    ['/knowledge/history/about/', '实验室介绍', '/about/#lab-introduction'],
    ['/knowledge/history/team/', '团队名录', '/about/#team-roster'],
  ] as const) {
    await page.goto(route);
    const banner = page.locator('.sl-banner');
    await expect(banner).toContainText('资料归档页。网站主入口：');
    await expect(banner.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
  }
});

test('实验室介绍页集中展示实验室与团队入口', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/about/');
  const links = page.getByRole('region', { name: '实验室相关资料' });
  const teamRoster = links.getByRole('link', { name: '团队名录', exact: true });
  await expect(teamRoster).toHaveAttribute('href', '#team-roster');
  await expect(links.getByRole('link', { name: '实验室资料', exact: true })).toHaveAttribute('href', '#lab-introduction');
  await expect(links.getByRole('link', { name: '2023 年实验室介绍', exact: true })).toHaveCount(0);

  await teamRoster.click();
  expect(new URL(page.url()).pathname).toBe('/about/');
  expect(new URL(page.url()).hash).toBe('#team-roster');
  await expect(page.getByRole('heading', { name: '团队名录', exact: true })).toBeVisible();
  await expect(page.getByText('万志成', { exact: true })).toBeVisible();
  await expect(page.locator('#team-roster .sl-anchor-link').first()).toBeHidden();

  await links.getByRole('link', { name: '知识库', exact: true }).click();
  await expect(page).toHaveURL(/\/knowledge\/$/);
  await expect(page.getByRole('heading', { name: '知识库', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '知识库首页', exact: true })).toBeVisible();
});

test('旧站技术文档明确标记为历史资料', async ({ page }) => {
  await page.goto('/knowledge/tools/developer-guide/');
  await expect(page.getByText('历史资料', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'GitBook 旧站开发手册（历史环境）' })).toBeVisible();
});

test('reduced motion keeps core content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.direction-item')).toHaveCount(4);
  const duration = await page.locator('.knowledge-card').first().evaluate((item) => getComputedStyle(item).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});
