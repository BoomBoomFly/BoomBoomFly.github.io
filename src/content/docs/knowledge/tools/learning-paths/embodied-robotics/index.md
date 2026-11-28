---
title: "具身机器人全栈实战路线"
description: "从 C++17、ROS 2、二进制通信、FPGA 硬件闭环到 VIO/SLAM 与 PX4 无人机自治的 14 阶段纵向工程实战路线。"
editUrl: false
---

纵向实战路线：[学习路线总览](/knowledge/tools/learning-paths/) → 具身机器人全栈实战

本路线将零散的软件、硬件与无人机工具串成一条端到端纵向主线（阶段 0～13），重点解决多节点通信、软硬件接口冻结、故障注入与实机证据链闭环问题。

### 十四阶段路线总表（阶段 00～13）

```text
01. 工程基础与通信 (00–03) ──► 02. FPGA 与硬件控制 (04–08)
                                         │
04. 系统集成与收口 (13) ◄── 03. ROS 2 感知与无人机 (09–12)
```

| 阶段 | 模块归属 | 核心主题与关键工程产出 |
| ---: | --- | --- |
| **00** | 工程基础与通信 | 需求矩阵拆解、系统边界图与分层证据标准（区分单测/仿真/板级/实机） |
| **01** | 工程基础与通信 | C++17 / 现代 CMake（target 思维）/ GoogleTest 差速速度计算器与异常单测 |
| **02** | 工程基础与通信 | ROS 2 Humble 两节点通信闭环、QoS 与生命周期排障 |
| **03** | 工程基础与通信 | 二进制帧契约、校验和与流式环形解帧器（覆盖粘包/断包/错误恢复测试） |
| **04** | FPGA 与硬件控制 | Verilog 可综合规范、三段式安全模式仲裁器 FSM 与自检 Testbench |
| **05** | FPGA 与硬件控制 | 以太网帧接收、FCS 校验、异步 FIFO 格雷码同步与跨时钟域（CDC）原子事务提交 |
| **06** | FPGA 与硬件控制 | Gowin 实板构建、时序约束核对、PHY / ARP / Ping / UDP 实板抓包证据 |
| **07** | FPGA 与硬件控制 | 编码器测速、双轮电机 PID 闭环与近障/超时硬件物理安全停车 |
| **08** | FPGA 与硬件控制 | 激光雷达/相机传感前端硬件聚合减负、片上调度与 FPGA 独立任务 |
| **09** | ROS 2 感知与无人机 | 机载端（如 Jetson）与底层硬件的七层 ROS 2 实机闭环联调 |
| **10** | ROS 2 感知与无人机 | VIO / SLAM / Nav2 定位导航失效分析与视觉检测跟踪（YOLO + ByteTrack）闭环 |
| **11** | ROS 2 感知与无人机 | PX4 v1.16 + uXRCE-DDS + ROS 2 接口状态机、Mode 与 Setpoint 层级分析 |
| **12** | ROS 2 感知与无人机 | 无人机自治任务编排（Aerostack2 / GCOPTER / EGO-Planner 分层对比与轨迹提交） |
| **13** | 系统集成与收口 | 需求追踪矩阵、接口版本冻结、全链路故障与急停恢复测试及**空目录独立重建** |

### 统一工程闭环

每一阶段均建议按同一闭环推进，而非只停留在“看懂教程”或“能跑起来”：

1. **理解边界**：明确当前模块的输入、输出、物理单位、坐标系与时序期限。
2. **阅读基线源码**：固定上游仓库 tag 或 commit 后再阅读，读完关闭参考源码，自己动手实现最小可测版本。
3. **自动测试与故障注入**：主动注入粘包、超时、断链、传感器失效或非法指令，验证系统是否进入预期安全态。
4. **分层留存证据**：严格区分“单元测试通过”、“仿真通过”、“板级运行”与“实机验收”，诚实记录“已证明 / 未证明 / 下一步”。

### 全栈收口自检清单

- 所有接口版本、物理单位、坐标系方向与超时阈值已冻结且文档与源码哈希可追溯；
- 重复、倒序、损坏报文、观测过期、传感器断流与通信失联均能触发安全兜底；
- 不把外部开源仓库的仿真或演示结果直接当作当前工程验收证据，能在空目录独立重建核心闭环。

### 开源基线仓库参考

- **工程与构建**：[Missing Semester](https://github.com/missing-semester/missing-semester)、[CMake Tutorial](https://github.com/Kitware/CMake/tree/master/Help/guide/tutorial)、[GoogleTest](https://github.com/google/googletest)
- **ROS 2 与串口**：[ros2/examples (`humble`)](https://github.com/ros2/examples/tree/humble)、[ros2_control_demos (`humble`)](https://github.com/ros-controls/ros2_control_demos/tree/humble)、[osrf/ros2_serial_example](https://github.com/osrf/ros2_serial_example)
- **RTL 与板级参考**：[Project F Explore](https://github.com/projf/projf-explore)、[cocotb examples](https://github.com/cocotb/cocotb/tree/master/examples)、[TangPrimer-20K examples](https://github.com/sipeed/TangPrimer-20K-example)
- **VIO / SLAM / 导航**：[OpenVINS v2.7](https://github.com/rpng/open_vins/tree/v2.7)、[ORB-SLAM3](https://github.com/UZ-SLAMLab/ORB-SLAM3)、[Nav2 (`humble`)](https://github.com/ros-navigation/navigation2/tree/humble)
- **PX4 与无人机自治**：[PX4 v1.16.2](https://github.com/PX4/PX4-Autopilot/tree/v1.16.2)、[px4_msgs (`release/1.16`)](https://github.com/PX4/px4_msgs/tree/release/1.16)、[px4-ros2-interface-lib (`release/1.16`)](https://github.com/Auterion/px4-ros2-interface-lib/tree/release/1.16)、[EGO-Planner-Swarm ROS 2](https://github.com/ZJU-FAST-Lab/ego-planner-swarm/tree/ros2_version)

### 相关资料

- [无人机平台设计与自主导航架构](/knowledge/research/flight-control/uav-platform-and-autonomy-architecture/)
- [FPGA 软硬件协同与时序设计指南](/knowledge/research/robotics-intelligence/fpga-hw-sw-codesign/)
- [具身 AI Agent 与 ROS 2 安全集成指南](/knowledge/research/robotics-intelligence/embodied-agent-ros2-integration/)
- [嵌入式与机器人通信协议指南](/knowledge/research/perception-localization/embedded-and-robot-communication/)
- [C++ 机器人开发学习路线](/knowledge/tools/learning-paths/cpp/)
- [ROS 2 机器人开发学习路线](/knowledge/tools/learning-paths/ros2/)
- [PX4 无人机学习路线](/knowledge/tools/learning-paths/px4/)
- [FPGA 零基础学习路线](/knowledge/tools/learning-paths/fpga/)
- [机器人算法学习路线](/knowledge/tools/learning-paths/robotics-algorithms/)
