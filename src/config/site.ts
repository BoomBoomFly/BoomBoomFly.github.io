export const site = {
  name: 'Drone Innovation Lab',
  shortName: 'BoomBoomFly',
  chineseName: '集美大学无人机科创实验室',
  location: '集美大学克立楼 106–107',
  established: '2020',
  logo: '/brand/drone-lab-logo.svg',
  url: 'https://boomboomfly.github.io',
  github: 'https://github.com/BoomBoomFly',
} as const;

export const navigation = [
  { href: '/research/', label: '研究方向' },
  { href: '/projects/', label: '项目档案' },
  { href: '/knowledge/', label: '技术文档' },
  { href: '/team/', label: '团队' },
  { href: '/join/', label: '加入我们' },
] as const;

export const researchDirections = [
  {
    slug: 'flight-control',
    title: '无人飞行与控制',
    href: '/knowledge/research/flight-control/',
  },
  {
    slug: 'perception-localization',
    title: '感知、定位与通信',
    href: '/knowledge/research/perception-localization/',
  },
  {
    slug: 'robotics-intelligence',
    title: '机器人与智能系统',
    href: '/knowledge/research/robotics-intelligence/',
  },
  {
    slug: 'engineering-tools',
    title: '工程工具与传承',
    href: '/knowledge/tools/',
  },
] as const;
