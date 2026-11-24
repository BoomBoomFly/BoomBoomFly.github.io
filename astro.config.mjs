import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';
import { site } from './src/config/site.ts';

const generatedManifest = JSON.parse(
  readFileSync(new URL('./generated-content-manifest.json', import.meta.url), 'utf8'),
);
const fixedRedirects = {
  '/knowledge/legacy/gitbook/drone-docs/': '/knowledge/research/flight-control/',
  '/02无人机相关/': '/knowledge/research/flight-control/',
  '/knowledge/legacy/gitbook/developer-tools/': '/knowledge/tools/learning-paths/',
  '/01常用开发工具/': '/knowledge/tools/learning-paths/',
  '/knowledge/tools/': '/knowledge/tools/learning-paths/',
  '/knowledge/research/robotics-intelligence/': '/knowledge/#robotics',
  '/research/': '/#research-heading',
  '/tag/': '/knowledge/',
  '/team/': '/about/#team-roster',
};
const redirects = {};
for (const [source, target] of [...Object.entries(generatedManifest.redirects), ...Object.entries(fixedRedirects)]) {
  // GitHub Pages serves a directory and its index.html from the same file.
  const route = source.replace(/\/index\.html$/, '/');
  if (redirects[route] && redirects[route] !== target) throw new Error(`Conflicting redirects for ${route}`);
  redirects[route] = target;
}

export default defineConfig({
  site: site.url,
  scopedStyleStrategy: 'where',
  redirects,
  integrations: [
    starlight({
      title: site.name,
      description: '集美大学无人机科创实验室的公开技术知识库。',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      logo: {
        src: `./public${site.logo}`,
        alt: '无人机实验室 Logo',
      },
      favicon: site.logo,
      customCss: ['./src/styles/starlight.css'],
      head: [
        { tag: 'meta', attrs: { property: 'og:locale', content: 'zh_CN' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: site.name } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { 'data-pagefind-meta': 'type', content: '知识库' } },
        {
          tag: 'script',
          content: `const focusCodeBlocks = () => document.querySelectorAll('.expressive-code pre').forEach((block) => block.setAttribute('tabindex', '0')); document.addEventListener('DOMContentLoaded', focusCodeBlocks); document.addEventListener('astro:page-load', focusCodeBlocks);`,
        },
      ],
      social: [
        { icon: 'github', label: 'BoomBoomFly on GitHub', href: site.github },
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
            { label: '机器人与智能系统', link: '/knowledge/#robotics' },
          ],
        },
        { label: '公开代码仓库', slug: 'knowledge/tools/public-projects' },
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
