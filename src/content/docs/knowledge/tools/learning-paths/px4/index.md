---
title: "PX4 无人机学习路线"
description: "覆盖 PX4 仿真、架构、MAVSDK、ROS 2、Offboard 与真机安全的学习路线。"
editUrl: false
---

路径位置：[总览](/knowledge/tools/learning-paths/) → [ROS 2](/knowledge/tools/learning-paths/ros2/) → PX4

### 环境基线

- Ubuntu 22.04 + PX4 v1.16.2 + Gazebo Harmonic
- ROS 2 Humble + QGroundControl
- Micro XRCE-DDS Agent v2.4.3 + `px4_msgs`（`release/1.16`）

固定使用 v1.16.2，不要把 `main` 或 v1.17 的命令和消息定义混在一起。安装参考 [PX4 v1.16 Ubuntu 开发环境](https://docs.px4.io/v1.16/en/dev_setup/dev_env_linux_ubuntu) 和 [Gazebo 仿真文档](https://docs.px4.io/v1.16/en/sim_gazebo_gz/)，或直接看本站的 [PX4 + Gazebo 仿真环境搭建](/knowledge/research/flight-control/px4-gazebo-simulation-setup/)。

### 阶段安排

| 阶段 | 核心内容 |
| --- | --- |
| 1. 基础概念 | 坐标系（NED / ENU / FRD / FLU）、欧拉角与四元数、PID 串级控制、多旋翼硬件组成 |
| 2. 仿真闭环 | 跑通 PX4 SITL + Gazebo + QGroundControl，完成起飞、悬停、航点、返航与降落 |
| 3. 飞控机制 | 飞行模式、解锁检查、失效保护；uORB 话题、参数系统与 ULog 日志分析 |
| 4. 二次开发 | 写一个最小 PX4 模块（Hello Sky）或用 MAVSDK-Python 控制仿真机 |
| 5. ROS 2 Offboard | 用 Micro XRCE-DDS 桥接 ROS 2 与 PX4，在仿真里实现持续心跳的 Offboard 轨迹控制 |
| 6. 真机安全 | 传感器校准、电调行程、无桨台架测试、遥控器急停切模式；真机测试必须双人复核 |

### 参考资料

- [PX4 v1.16 官方文档](https://docs.px4.io/v1.16/en/)
- [PX4 架构概览](https://docs.px4.io/v1.16/en/concept/architecture)
- [uORB 消息机制](https://docs.px4.io/v1.16/en/middleware/uorb)
- [PX4 第一个应用 Hello Sky](https://docs.px4.io/v1.16/en/modules/hello_sky)
- [PX4 安全与失效保护配置](https://docs.px4.io/v1.16/en/config/safety)
- [PX4 飞行日志说明](https://docs.px4.io/v1.16/en/getting_started/flight_reporting)
- [PX4 ROS 2 用户指南](https://docs.px4.io/v1.16/en/ros2/user_guide)
- [PX4 Offboard 模式](https://docs.px4.io/v1.16/en/flight_modes/offboard)
- [QGroundControl 官方指南](https://docs.qgroundcontrol.com/)
- [MAVLink 协议概览](https://mavlink.io/en/about/overview.html)
- [MAVSDK-Python 快速开始](https://mavsdk.mavlink.io/main/en/python/quickstart.html)
