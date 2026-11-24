export const site = {
  name: 'JMU AIR LAB',
  englishName: 'Jimei University Autonomous Intelligence & Robotics Laboratory',
  shortName: 'BoomBoomFly',
  chineseName: '集美大学无人机科创实验室',
  location: '集美大学克立楼 106–107',
  established: '2020',
  logo: '/brand/drone-lab-logo.svg',
  url: 'https://boomboomfly.github.io',
  github: 'https://github.com/BoomBoomFly',
  email: 'boomboomfly106@gmail.com',
} as const;

export const navigation = [
  { href: '/projects/', label: '公开项目' },
  { href: '/knowledge/', label: '知识库' },
  { href: '/about/', label: '实验室介绍' },
  { href: '/join/', label: '加入我们' },
] as const;

export const researchDirections = [
  {
    title: '无人飞行与控制',
    guideTitle: '飞行控制与 ROS',
    href: '/knowledge/research/flight-control/',
  },
  {
    title: '感知、定位与通信',
    href: '/knowledge/research/perception-localization/',
  },
  {
    title: '地面机器人与群体协作',
    guideTitle: '机器人与智能系统',
    href: '/knowledge/#robotics',
  },
  {
    title: '嵌入式与工程工具',
    guideTitle: '开发环境与工具学习路线',
    href: '/knowledge/tools/learning-paths/',
  },
];
