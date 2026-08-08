import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';

const generatedManifest = JSON.parse(
  readFileSync(new URL('./generated-content-manifest.json', import.meta.url), 'utf8'),
);
const redirects = Object.fromEntries([
  ...Object.entries(generatedManifest.redirects).filter(([source]) => !source.endsWith('/index.html')),
  ['/tag/', '/knowledge/'],
]);

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
        { label: '研究方向', link: '/research/' },
        { label: '项目档案', link: '/projects/' },
        { label: '知识库首页', slug: 'knowledge' },
        {
          label: '研究与实践',
          items: [
            { label: '飞行控制与 ROS', slug: 'knowledge/research/flight-control' },
            { label: '感知、定位与通信', slug: 'knowledge/research/perception-localization' },
            { label: '机器人与智能系统', slug: 'knowledge/research/robotics-intelligence' },
            {
              label: '飞控与感知（历史）',
              items: [
                { label: 'ACFly-Mavros', slug: 'knowledge/legacy/gitbook/acfly-mavros' },
                { label: 'T265', slug: 'knowledge/legacy/gitbook/t265' },
                { label: 'D435', slug: 'knowledge/legacy/gitbook/d435' },
                { label: 'UWB', slug: 'knowledge/legacy/gitbook/uwb' },
                { label: '无人机文档索引', slug: 'knowledge/legacy/gitbook/drone-docs' },
              ],
            },
          ],
        },
        {
          label: '工程工具',
          items: [
            { label: '开发环境与工具', slug: 'knowledge/tools' },
            {
              label: '环境与工具（历史）',
              items: [
                { label: 'Git', slug: 'knowledge/legacy/gitbook/git' },
                { label: 'Conda', slug: 'knowledge/legacy/gitbook/conda' },
                { label: 'Ubuntu 20.04 换源', slug: 'knowledge/legacy/gitbook/ubuntu-20-04-sources' },
                { label: 'GitBook 手册', slug: 'knowledge/legacy/gitbook/developer-guide' },
                { label: '开发工具索引', slug: 'knowledge/legacy/gitbook/developer-tools' },
              ],
            },
          ],
        },
        {
          label: '实验室与团队',
          items: [
            { label: '实验室介绍', link: '/about/' },
            { label: '团队', link: '/team/' },
            {
              label: '历史档案',
              items: [
                { label: 'GitBook 实验室介绍', slug: 'knowledge/legacy/lab-introduction' },
                { label: '2023 年实验室介绍', slug: 'knowledge/legacy/hexo/about-2023' },
                { label: '2023 年团队名录', slug: 'knowledge/legacy/hexo/team-2023' },
              ],
            },
          ],
        },
        { label: '加入我们', link: '/join/' },
      ],
      lastUpdated: true,
      pagination: true,
      credits: false,
      disable404Route: true,
    }),
  ],
});
