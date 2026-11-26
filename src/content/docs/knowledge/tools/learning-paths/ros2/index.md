---
title: "ROS 2 机器人开发学习路线"
description: "覆盖 ROS 2 节点、通信、TF2、QoS、并发、测试与 PX4 集成的学习路线。"
editUrl: false
---

路径位置：[总览](/knowledge/tools/learning-paths/) → [Linux](/knowledge/tools/learning-paths/linux/) → ROS 2 → [PX4](/knowledge/tools/learning-paths/px4/)

### 版本基线

- Ubuntu 22.04 + ROS 2 Humble（C++17、`ament_cmake` + `colcon`）
- 仿真与飞控：Gazebo Harmonic + PX4 v1.16.2 + Micro XRCE-DDS Agent v2.4.3 + `px4_msgs`（`release/1.16`）

Humble 默认配 Gazebo Fortress，接 PX4 v1.16.2 时需装 `ros-humble-ros-gzharmonic`，不要与默认 `ros-humble-ros-gz*` 混装。兼容说明见 [Gazebo 官方安装文档](https://gazebosim.org/docs/harmonic/ros_installation/)。

中文入门可看鱼香 ROS《动手学 ROS2》Humble 版；维护旧项目时再参考 Foxy 版，不要直接拿 Foxy 命令在 Humble 里替换跑。

### 阶段安排

| 阶段 | 核心内容 |
| --- | --- |
| 1. CLI 与概念 | node、topic、service、action、parameter；熟练用 `ros2 node/topic/service/param` 和 `rqt_graph` |
| 2. 工作空间与节点 | `colcon build`、`ament_cmake`、`rclcpp` 编写发布/订阅、服务端/客户端和自定义接口 |
| 3. 系统组织 | Python/XML launch 文件、YAML 参数、namespace 与 remapping |
| 4. 坐标与可视化 | TF2 静态与动态变换、时间戳、URDF 与 RViz2 |
| 5. 通信与调试 | QoS（Reliability / Durability 匹配）、`ROS_DOMAIN_ID` 与 DDS 发现；`rosbag2` 录包回放 |
| 6. 并发与 PX4 集成 | Executor 与 Callback Group；通过 Micro XRCE-DDS 连接 PX4 跑通仿真 Offboard 控制 |

### 参考资料

- [ROS 2 发行版与支持周期](https://docs.ros.org/en/humble/Releases.html)
- [ROS 2 Humble CLI Tutorials](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools.html)
- [ROS 2 接口：Topic、Service、Action](https://docs.ros.org/en/humble/Concepts/Basic/Interfaces-Topics-Services-Actions.html)
- [ROS 2 Humble C++ Publisher/Subscriber](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Publisher-And-Subscriber.html)
- [ROS 2 Humble C++ Service/Client](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Service-And-Client.html)
- [ROS 2 Humble QoS](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Quality-of-Service-Settings.html)
- [ROS 2 Humble TF2 Tutorials](https://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Tf2-Main.html)
- [ROS 2 Humble Launch Tutorials](https://docs.ros.org/en/humble/Tutorials/Intermediate/Launch/Launch-Main.html)
- [ROS 2 Humble rosbag2 Tutorials](https://docs.ros.org/en/humble/Tutorials/Advanced/Recording-A-Bag-From-Your-Own-Node-CPP.html)
- [ROS 2 Executor 概念](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Executors.html)
- [PX4 v1.16 ROS 2 User Guide](https://docs.px4.io/v1.16/en/ros2/user_guide)
- [PX4 v1.16 Offboard Mode](https://docs.px4.io/v1.16/en/flight_modes/offboard)
- [PX4/px4_msgs 版本兼容说明](https://github.com/PX4/px4_msgs)
