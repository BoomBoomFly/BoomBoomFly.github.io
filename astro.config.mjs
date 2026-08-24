import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';

const generatedManifest = JSON.parse(
  readFileSync(new URL('./generated-content-manifest.json', import.meta.url), 'utf8'),
);
const redirects = Object.fromEntries([
  ...Object.entries(generatedManifest.redirects),
  ['/tag/', '/knowledge/'],
  ['/team/', '/about/#team-roster'],
].filter(([source]) => !source.endsWith('/index.html')));

export default defineConfig({
  site: 'https://boomboomfly.github.io',
  redirects,
  integrations: [
    starlight({
      title: 'Drone Innovation Lab',
      description: '集美大学无人机科创实验室的公开技术知识库。',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      logo: {
        src: './public/brand/drone-lab-logo.svg',
        alt: '无人机实验室 Logo',
      },
      favicon: '/brand/drone-lab-logo.svg',
      customCss: ['./src/styles/starlight.css'],
      head: [
        { tag: 'meta', attrs: { property: 'og:locale', content: 'zh_CN' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'Drone Innovation Lab' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { 'data-pagefind-meta': 'type', content: '知识库' } },
        {
          tag: 'script',
          content: `const focusCodeBlocks = () => document.querySelectorAll('.expressive-code pre').forEach((block) => block.setAttribute('tabindex', '0')); document.addEventListener('DOMContentLoaded', focusCodeBlocks); document.addEventListener('astro:page-load', focusCodeBlocks);`,
        },
      ],
      social: [
        { icon: 'github', label: 'BoomBoomFly on GitHub', href: 'https://github.com/BoomBoomFly' },
      ],
      sidebar: [
        { label: '返回实验室主页', link: '/' },
        { label: '知识库首页', slug: 'knowledge' },
        {
          label: '研究与实践',
          items: [
            {
              label: '飞行控制与 ROS',
              items: [
                { label: '方向介绍', slug: 'knowledge/research/flight-control' },
                { label: 'ACFly-Mavros', slug: 'knowledge/research/flight-control/acfly-mavros', badge: { text: '历史', variant: 'caution' } },
              ],
            },
            {
              label: '感知、定位与通信',
              items: [
                { label: '方向介绍', slug: 'knowledge/research/perception-localization' },
                { label: 'T265（已停产）', slug: 'knowledge/research/perception-localization/t265' },
                { label: 'D435', slug: 'knowledge/research/perception-localization/d435', badge: { text: '历史', variant: 'caution' } },
                { label: 'UWB', slug: 'knowledge/research/perception-localization/uwb', badge: { text: '历史', variant: 'caution' } },
              ],
            },
            { label: '机器人与智能系统', slug: 'knowledge/research/robotics-intelligence' },
          ],
        },
        {
          label: '工程工具',
          items: [
            { label: '工具目录', slug: 'knowledge/tools' },
            { label: 'Git', slug: 'knowledge/tools/git', badge: { text: '历史', variant: 'caution' } },
            { label: 'Conda', slug: 'knowledge/tools/conda', badge: { text: '历史', variant: 'caution' } },
            { label: 'Ubuntu 20.04（历史）', slug: 'knowledge/tools/ubuntu-20-04-sources' },
            { label: 'GitBook 旧站（历史）', slug: 'knowledge/tools/developer-guide' },
          ],
        },
        {
          label: '学习路线',
          items: [
            { label: '路线总览', slug: 'knowledge/tools/learning-paths' },
            { label: '嵌入式', slug: 'knowledge/tools/learning-paths/embedded' },
            { label: 'Git', slug: 'knowledge/tools/learning-paths/git' },
            { label: 'C++', slug: 'knowledge/tools/learning-paths/cpp' },
            { label: 'Linux', slug: 'knowledge/tools/learning-paths/linux' },
            { label: 'ROS 2', slug: 'knowledge/tools/learning-paths/ros2' },
            { label: 'PX4', slug: 'knowledge/tools/learning-paths/px4' },
            { label: 'FPGA（选读）', slug: 'knowledge/tools/learning-paths/fpga' },
          ],
        },
        { label: '加入我们', link: '/join/' },
      ],
      lastUpdated: true,
      pagination: true,
      credits: false,
    }),
  ],
});
