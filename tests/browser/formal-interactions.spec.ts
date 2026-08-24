import { expect, test } from '@playwright/test';

test('知识库首页系统图谱切换节点并自动记录探索进度', async ({ page }) => {
  await page.goto('/knowledge/');
  const map = page.locator('[data-knowledge-system-map]');
  await expect(map).toBeVisible();
  await expect(map.locator('[data-progress-output]')).toHaveText('1 / 5');

  await map.getByRole('button', { name: /ROS 2/ }).click();
  await expect(map.locator('[data-system-title]')).toHaveText('ROS 2 通信层');
  await expect(map.locator('[data-system-link]')).toHaveAttribute('href', '/knowledge/tools/learning-paths/ros2/');
  await expect(map.locator('[data-progress-output]')).toHaveText('2 / 5');
});

test('飞控文档内坐标实验切换模式与航向角', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto('/knowledge/research/flight-control/');
  const lab = page.locator('[data-coordinate-lab]');
  await expect(lab).toBeVisible();
  await expect(lab.locator('.coordinate-lab__scene')).toHaveCSS('perspective', /\d+px/);

  const controls = await lab.locator('.coordinate-lab__controls').boundingBox();
  const stage = await lab.locator('.coordinate-lab__stage').boundingBox();
  expect(controls?.y).toBeLessThan(stage?.y ?? 0);

  await lab.getByRole('button', { name: 'NED', exact: true }).click();
  const nedX = await lab.locator('[data-axis-x]').boundingBox();
  const nedY = await lab.locator('[data-axis-y]').boundingBox();
  expect(nedX?.y).toBeLessThan(nedY?.y ?? 0);
  await expect(lab.locator('[data-axis-z]')).toHaveText('下 / Z+');
  await lab.locator('[data-heading-range]').fill('180');
  await expect(lab.locator('[data-heading-output]')).toHaveText('180°');

  await lab.getByRole('button', { name: 'FLU', exact: true }).click();
  const fluXBefore = await lab.locator('[data-axis-x]').boundingBox();
  await lab.locator('[data-heading-range]').fill('90');
  const fluXAfter = await lab.locator('[data-axis-x]').boundingBox();
  expect(fluXAfter?.x).toBeGreaterThan(fluXBefore?.x ?? Number.POSITIVE_INFINITY);
});

test('首页顶部品牌与导航保持可读比例', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/');

  const sizes = await page.locator('.site-header').evaluate((header) => ({
    brand: Number.parseFloat(getComputedStyle(header.querySelector('.brand strong')!).fontSize),
    navigation: Number.parseFloat(getComputedStyle(header.querySelector('nav a')!).fontSize),
  }));

  expect(sizes.brand).toBeGreaterThanOrEqual(17);
  expect(sizes.navigation).toBeGreaterThanOrEqual(16);
});

test('实验室介绍页按年份展示当前公开团队名录', async ({ page }) => {
  await page.goto('/about/#team-roster');
  const timeline = page.locator('[data-team-timeline]');
  await expect(timeline.locator('[data-team-enhanced]')).toBeVisible();
  await expect(timeline.getByRole('tab', { name: '2024', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(timeline.locator('#team-year-panel-2024')).toContainText('万志成');

  const year2023 = timeline.getByRole('tab', { name: '2023', exact: true });
  const year2024 = timeline.getByRole('tab', { name: '2024', exact: true });
  await year2023.click();
  await expect(timeline.locator('#team-year-panel-2023')).toContainText('黄力烨');
  await expect(timeline.locator('#team-year-panel-2024')).toBeHidden();
  await year2023.press('ArrowRight');
  await expect(year2024).toHaveAttribute('aria-selected', 'true');
  await year2024.press('ArrowLeft');
  await expect(year2023).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: '学习进度' })).toHaveCount(0);
});
