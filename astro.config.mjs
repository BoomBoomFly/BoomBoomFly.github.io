import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readFileSync } from 'node:fs';
import { site } from './src/config/site.ts';

const generatedManifest = JSON.parse(
  readFileSync(new URL('./generated-content-manifest.json', import.meta.url), 'utf8'),
);
const fixedRedirects = {
  '/projects/': '/#projects',
  '/join/': '/about/#join',
  '/research/': '/#research-heading',
  '/team/': '/about/#team-roster',
  '/tag/': '/knowledge/',
  '/knowledge/research/flight-control/': '/knowledge/#flight-control',
  '/knowledge/research/perception-localization/': '/knowledge/#perception-localization',
  '/knowledge/research/robotics-intelligence/': '/knowledge/#robotics',
  '/knowledge/legacy/gitbook/drone-docs/': '/knowledge/#flight-control',
  '/02无人机相关/': '/knowledge/#flight-control',
  '/knowledge/legacy/gitbook/developer-tools/': '/knowledge/tools/learning-paths/',
  '/01常用开发工具/': '/knowledge/tools/learning-paths/',
  '/knowledge/tools/': '/knowledge/tools/learning-paths/',
};
const redirects = {};
for (const [source, target] of [...Object.entries(generatedManifest.redirects), ...Object.entries(fixedRedirects)]) {
  const route = source.replace(/\/index\.html$/, '/');
  if (redirects[route] && redirects[route] !== target) throw new Error(`Conflicting redirects for ${route}`);
  redirects[route] = target;
}

export default defineConfig({
  site: site.url,
  scopedStyleStrategy: 'where',
  redirects,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
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
      customCss: ['katex/dist/katex.min.css', './src/styles/starlight.css'],
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
          label: '飞行控制与 ROS',
          items: [
            { label: 'PX4 + Gazebo 仿真', slug: 'knowledge/research/flight-control/px4-gazebo-simulation-setup' },
            { label: '无人机平台与自主导航', slug: 'knowledge/research/flight-control/uav-platform-and-autonomy-architecture' },
            { label: 'Offboard 与 External Mode', slug: 'knowledge/research/flight-control/px4-ros2-offboard-architecture' },
            { label: '四旋翼动力学与控制', slug: 'knowledge/research/flight-control/quadrotor-dynamics-and-control' },
            { label: '路径规划与轨迹优化', slug: 'knowledge/research/flight-control/path-planning-and-trajectory-optimization' },
            { label: 'ACFly-Mavros', slug: 'knowledge/research/flight-control/acfly-mavros', badge: { text: '历史', variant: 'caution' } },
          ],
        },
        {
          label: '感知、定位与通信',
          items: [
            { label: '视觉里程计接入 PX4', slug: 'knowledge/research/perception-localization/vio-px4-integration' },
            { label: '视觉感知与点云建图', slug: 'knowledge/research/perception-localization/vision-pointcloud-and-mapping' },
            { label: '状态估计与 SLAM 融合', slug: 'knowledge/research/perception-localization/state-estimation-and-slam' },
            { label: '嵌入式与机器人通信', slug: 'knowledge/research/perception-localization/embedded-and-robot-communication' },
            { label: 'T265（已停产）', slug: 'knowledge/research/perception-localization/t265' },
            { label: 'D435', slug: 'knowledge/research/perception-localization/d435', badge: { text: '历史', variant: 'caution' } },
            { label: 'UWB', slug: 'knowledge/research/perception-localization/uwb', badge: { text: '历史', variant: 'caution' } },
          ],
        },
        {
          label: '机器人与智能系统',
          items: [
            { label: 'FPGA 软硬件协同与时序', slug: 'knowledge/research/robotics-intelligence/fpga-hw-sw-codesign' },
            { label: '具身 AI Agent 与 ROS 2', slug: 'knowledge/research/robotics-intelligence/embodied-agent-ros2-integration' },
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
            { label: '机器人算法', slug: 'knowledge/tools/learning-paths/robotics-algorithms' },
            { label: 'AI Agent 开发', slug: 'knowledge/tools/learning-paths/agent' },
            { label: '具身全栈实战', slug: 'knowledge/tools/learning-paths/embodied-robotics' },
          ],
        },
        { label: '公开代码仓库', slug: 'knowledge/tools/public-projects' },
        { label: '关于与加入', link: '/about/#join' },
      ],
      lastUpdated: true,
      pagination: true,
      credits: false,
    }),
  ],
});
