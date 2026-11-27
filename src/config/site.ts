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
  { href: '/#projects', label: '公开项目' },
  { href: '/knowledge/', label: '知识库' },
  { href: '/about/', label: '关于实验室' },
  { href: '/about/#join', label: '加入我们' },
] as const;

export const researchDirections = [
  {
    id: 'flight',
    title: '无人飞行与控制',
    summary: 'PX4 仿真、MAVROS 通信与多旋翼飞行控制。',
    guideTitle: '飞行控制与 ROS',
    href: '/knowledge/#flight-control',
  },
  {
    id: 'perception',
    title: '感知、定位与通信',
    summary: '视觉惯性里程计、深度相机感知与 UWB 测距。',
    guideTitle: '感知与定位资料',
    href: '/knowledge/#perception-localization',
  },
  {
    id: 'robotics',
    title: '地面机器人与群体协作',
    summary: 'ROS 移动底盘、机械臂与多机协作实验。',
    guideTitle: '机器人与智能系统',
    href: '/knowledge/#robotics',
  },
  {
    id: 'tools',
    title: '嵌入式与工程工具',
    summary: 'Linux、Git、C++、ROS 2 与嵌入式入门路线。',
    guideTitle: '学习路线',
    href: '/knowledge/tools/learning-paths/',
  },
] as const;
