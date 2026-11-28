---
title: "学习路线总览"
description: "覆盖嵌入式、Git、C++、Linux、ROS 2、PX4 主线，以及 FPGA、机器人算法、AI Agent 与具身机器人全栈实战的实验室学习导航。"
editUrl: false
---

### 主线顺序

1. [嵌入式：51 单片机与 STM32](/knowledge/tools/learning-paths/embedded/)
2. [Git](/knowledge/tools/learning-paths/git/)
3. [C++](/knowledge/tools/learning-paths/cpp/)
4. [Linux](/knowledge/tools/learning-paths/linux/)
5. [ROS 2](/knowledge/tools/learning-paths/ros2/)
6. [PX4](/knowledge/tools/learning-paths/px4/)

```text
嵌入式（51 → STM32） → Git → C++ → Linux → ROS 2 → PX4
```

有基础的话直接跳到对应阶段即可，不必从头看。

### 选读与进阶方向

- [FPGA](/knowledge/tools/learning-paths/fpga/)：按项目需要选学，不作为 ROS 2 或 PX4 的前置条件。
- [机器人算法](/knowledge/tools/learning-paths/robotics-algorithms/)：感知与视觉、状态估计与 SLAM、路径规划与运动控制四层算法栈。
- [AI Agent 开发](/knowledge/tools/learning-paths/agent/)：Workflow 选型、MCP 与上下文治理、状态图与具身 ROS 2 安全边界。
- [具身机器人全栈实战](/knowledge/tools/learning-paths/embodied-robotics/)：从 C++17/ROS 2、FPGA 闭环到 VIO/PX4 自治的 14 阶段纵向工程实践。

### 按方向分流建议

| 目标方向 | 推荐学习组合 | 核心配套专题 |
| --- | --- | --- |
| **飞控与无人机自治** | C++ → Linux → ROS 2 → PX4 → 机器人算法 | [无人机平台与自主导航架构](/knowledge/research/flight-control/uav-platform-and-autonomy-architecture/) · [PX4 Offboard 与 External Mode](/knowledge/research/flight-control/px4-ros2-offboard-architecture/) |
| **感知定位与 SLAM** | C++ → Linux → ROS 2 → 机器人算法 | [视觉感知与点云建图](/knowledge/research/perception-localization/vision-pointcloud-and-mapping/) · [状态估计与 SLAM 融合](/knowledge/research/perception-localization/state-estimation-and-slam/) · [VIO 接入 PX4](/knowledge/research/perception-localization/vio-px4-integration/) |
| **FPGA 与硬件控制** | 嵌入式 → Git → C++ → FPGA → 具身全栈实战 | [FPGA 软硬件协同与时序设计](/knowledge/research/robotics-intelligence/fpga-hw-sw-codesign/) · [嵌入式与机器人通信](/knowledge/research/perception-localization/embedded-and-robot-communication/) |
| **具身 AI Agent** | Git → Linux → ROS 2 → AI Agent | [具身 AI Agent 与 ROS 2 安全集成](/knowledge/research/robotics-intelligence/embodied-agent-ros2-integration/) |

### 通关原则

每学完一个阶段，建议完成三件事：**独立写出最小可运行工程**、**补充异常输入测试或故障注入**、**用结构图与实测日志记录“已证明 / 未证明”的边界**，再进入下一阶段。
