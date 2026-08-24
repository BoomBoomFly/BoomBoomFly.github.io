---
title: "ROS 2 机器人开发学习路线"
description: "覆盖 ROS 2 节点、通信、TF2、QoS、并发、测试与 PX4 集成的学习路线。"
editUrl: false
---

> 推荐路径位置 5/6：[学习路线总览](/knowledge/tools/learning-paths/) → [Linux](/knowledge/tools/learning-paths/linux/) → **ROS 2（当前）** → [PX4](/knowledge/tools/learning-paths/px4/)。可在满足前置能力时直接进入本路线。

> 本路线面向需要使用 ROS 2 开发机器人或 PX4 伴随计算机程序的读者，主线使用 C++。学习目标是建立可运行、可观察、可测试、可恢复的机器人软件系统，而不是只会复制节点示例。

> 内容参考约定：ROS 2 基础概念、学习顺序和入门实验同时参考鱼香 ROS《动手学 ROS2》的 Humble 版与 Foxy 版。可执行主线以 Humble 版为准，Foxy 版只用于理解旧项目和核对发行版差异；支持周期、软件包兼容性以及 PX4/Gazebo 集成仍以对应版本的官方文档为准。

### 这条路线要解决什么问题

走完主线后，应该能够：

1. 解释 ROS graph、node、topic、service、action 和 parameter 的职责；
2. 创建和维护 `ament_cmake` 包及 `colcon` 工作空间；
3. 使用 `rclcpp` 编写发布、订阅、服务、动作和参数节点；
4. 设计自定义接口，并在 topic、service、action 中做正确选择；
5. 使用 launch、YAML、namespace 和 remapping 组织多节点系统；
6. 正确处理时间戳、TF2 坐标变换、URDF 和 RViz 可视化；
7. 理解 QoS、DDS discovery 和常见网络通信问题；
8. 使用 rosbag2、日志、CLI、`rqt_graph` 和测试定位故障；
9. 理解 executor、callback group 和并发回调带来的风险；
10. 在仿真中完成一次 ROS 2 与 PX4 的可靠通信和 Offboard 控制。

### 版本基线

#### 实验室主线

- 操作系统：Ubuntu 22.04；
- ROS 2：Humble Hawksbill；
- 主要语言：C++17；
- 构建：ament_cmake + colcon；
- 仿真：Gazebo Harmonic，用于 PX4 v1.16.2 主线；
- 飞控集成：PX4 v1.16.2 + Micro XRCE-DDS Agent v2.4.3 + `px4_msgs` `release/1.16`。

截至 2026-08-19，ROS 2 官方最新长期支持发行版是 Lyrical Luth，Humble 计划支持到 2027 年 5 月。实验室现有 PX4 指南仍基于 Humble，因此入门阶段继续固定使用 Humble。不要把 Lyrical、Jazzy、Humble 或 Rolling 的安装命令和 API 示例混在同一个工作空间；升级应作为独立任务验证操作系统、依赖、消息和仿真兼容性。

Humble 官方默认配对 Gazebo Fortress；Harmonic 是这份 PX4 主线需要的非默认组合。使用 Harmonic 时安装 `ros-humble-ros-gzharmonic`，不要与默认的 `ros-humble-ros-gz*` 混装。需要维护普通 Humble + Fortress 项目时，使用独立的虚拟机、容器或 WSL 发行版。具体兼容关系见 [Gazebo 官方安装说明](https://gazebosim.org/docs/harmonic/ros_installation/)。

#### FishROS 双版本使用方法

| 用途 | 操作系统与 ROS 2 | 参考资料 | 执行规则 |
| --- | --- | --- | --- |
| 新环境和全部主线内容 | Ubuntu 22.04 + Humble | 《动手学 ROS2》Humble 版 | 示例、包名、环境路径和依赖都按 Humble 验证 |
| 复现或维护旧项目 | Ubuntu 20.04 + Foxy | 《动手学 ROS2》Foxy 版 | 只在隔离环境执行，并保留原项目的版本记录 |
| 理解稳定概念 | Humble 与 Foxy 对照 | 两版相同主题 | 比较 node、topic、service、action、parameter、TF2 和 DDS 等共同模型 |

使用两版资料时遵守以下规则：

1. 先阅读 Humble 版同主题内容并完成本路线的主线实验；只有维护 Foxy 项目时，才执行 Foxy 版命令。
2. 不把 `humble` 与 `foxy` 仅做字符串替换。安装源、二进制包、Python 版本、Gazebo、launch 文件和第三方仓库分支都要逐项核对。
3. 笔记和实验 README 必须在命令块前标明适用发行版；未标注的命令默认只适用于本路线的 Humble 主线。
4. FishROS 用于中文学习路径和动手实验，官方 ROS 2、Gazebo、PX4 及上游仓库文档用于确认当前支持状态和精确兼容关系。

#### 每次实验必须记录

- Ubuntu 与 ROS 2 发行版；
- RMW/DDS 实现；
- 工作空间和关键仓库的 Git 哈希；
- 使用的 Gazebo、PX4 和 `px4_msgs` 版本；
- `ROS_DOMAIN_ID`、namespace 和关键 QoS；
- 构建、启动、验证和复现命令。

### 前置能力

开始前至少需要：

- 能使用 Linux 终端、文件权限、进程和环境变量；
- 会 Git 的 clone、status、diff、branch 和 commit；
- 能编写类、函数和多文件 C++ 程序；
- 理解引用、智能指针、对象生命周期和回调；
- 了解 IP、端口、localhost、组播和防火墙的基本概念；
- 了解米、秒、弧度以及 ENU、NED、FLU、FRD 坐标系。

C++ 前置不够时，先完成：[C++ 机器人开发学习路线](/knowledge/tools/learning-paths/cpp/)。

### 学习原则

1. **先用 CLI 观察，再写代码。** 不理解现有 ROS graph 时，不急着新增节点。
2. **一次只引入一个通信机制。** 先单节点，再双节点，再 launch 多节点。
3. **接口先于实现。** 先写清数据含义、单位、频率、QoS 和失败语义。
4. **计算与 ROS 外壳分离。** 算法和状态机尽量写成普通 C++ 库，节点只负责通信与编排。
5. **先单机，后跨机。** 单机通信未通过前，不同时调试网卡、路由和防火墙。
6. **先仿真，后真机。** 控制、坐标和失效恢复没有在仿真验证前，不连接真实执行器。
7. **以证据验收。** 使用 topic 频率、时间戳、日志、bag 和测试证明系统行为。

### 路线总览

| 阶段 | 核心问题 | 通过标准 |
| --- | --- | --- |
| 0. 环境与模型 | ROS 2 系统由什么组成？ | 能解释 ROS graph 与 DDS 的关系 |
| 1. CLI 与通信 | 如何观察节点之间的交互？ | 不看 GUI 也能定位通信对象 |
| 2. 包与节点 | 如何创建可构建的 C++ 节点？ | 干净工作空间可重复构建 |
| 3. 接口设计 | topic、service、action 怎么选？ | 接口含义、单位和失败语义明确 |
| 4. 配置与启动 | 多节点怎样被配置和启动？ | 可通过参数和 remap 复用节点 |
| 5. 坐标与模型 | 数据位于哪个坐标系和时刻？ | 能发现断链、方向和时间问题 |
| 6. QoS 与网络 | 为什么看得到 topic 却收不到数据？ | 能定位兼容、发现和防火墙问题 |
| 7. 数据与回放 | 怎样保存和复现一次运行？ | 回放可复现原始问题 |
| 8. 执行与并发 | 回调何时、在哪个线程执行？ | 能解释阻塞、竞争和死锁风险 |
| 9. 测试与诊断 | 怎样证明系统可靠？ | 正常、边界和故障路径均验证 |
| 10. 仿真与 PX4 | 怎样连接机器人或飞控？ | 链路丢失后进入安全状态 |

#### 与《动手学 ROS2》配合阅读

| 本路线阶段 | Humble 版对应主题 | Foxy 版对照重点 |
| --- | --- | --- |
| 0 | ROS 2 介绍、安装、系统架构与 DDS | Ubuntu 20.04、Foxy 环境和旧中间件配置 |
| 1～2 | 节点、工作空间、功能包、Colcon、rclcpp/rclpy | 旧版包创建、构建和环境加载方式 |
| 3～4 | 话题、服务、自定义接口、参数、Action、Launch | 接口与 launch 示例的发行版差异 |
| 5 | 机器人运动学、TF2、URDF、RViz | 旧版 TF2、模型和可视化工具链 |
| 6～7 | QoS、DDS、CLI、RQT、rosbag2 | Foxy 的 QoS、发现和 rosbag2 行为 |
| 8～9 | 生命周期节点、调试工具和通信机制进阶 | 只提取旧系统排障所需内容 |
| 10 | Gazebo 与机器人仿真概念 | Foxy + Gazebo Classic 仅用于遗留环境；PX4 步骤按专项官方资料执行 |

FishROS 章节用于建立知识顺序，本路线中的故障注入、测试和 PX4 验收项继续作为工程化补充。

### 阶段推进规则

- 阶段 0～2 建立环境模型、CLI 观察能力和可构建的 C++ 包，通过验收后再设计接口与启动系统。
- 阶段 3～4 的接口、参数和 launch 是坐标、网络、数据记录与并发实验的前置基础。
- 阶段 5～8 全部通过后，再进入阶段 9 的系统测试；尚不能解释坐标、QoS、时间或并发时，不进入 PX4 Offboard。
- 阶段 9 的测试与诊断能力通过验收后，再进入阶段 10。每个阶段都要保存可复现工程、运行证据和故障记录。

### 阶段 0：环境和整体模型

#### 要掌握的内容

- ROS 2 是机器人软件中间件和工具生态，不是单个进程；
- ROS graph 与 node 的关系；
- client library、rclcpp、rcl、rmw 与 DDS 的大致层次；
- overlay workspace 和 underlay；
- shell 环境、`setup.bash` 和环境变量；
- ROS 2 发行版、操作系统和二进制包的对应关系。

#### 通过标准

- 新终端不 source 时能解释为什么找不到 ROS 命令或包；
- 能区分 ROS 2 发行版、软件包版本和自己的工作空间；
- 不在 `.bashrc` 中堆叠多个发行版的 source 命令。

### 阶段 1：ROS graph 和 CLI 工具

#### 要掌握的内容

- node、topic、service、action、parameter；
- topic 用于持续数据流；
- service 用于短时请求/响应；
- action 用于可反馈、可取消的长任务；
- name、namespace、remapping；
- `rqt_graph`、`rqt_console` 和 turtlesim。

#### 通过标准

给出任意节点名时，能用 CLI 找到它的输入、输出、类型和连接对象，而不是只依赖示例中固定的话题名。

### 阶段 2：工作空间、包和第一个 C++ 节点

#### 要掌握的内容

- workspace 的 `src`、`build`、`install`、`log`；
- `package.xml`、`CMakeLists.txt`；
- ament_cmake 与 colcon；
- publisher、subscription、timer 和 logger；
- 依赖声明、target 和安装规则；
- overlay 的构建与 source 顺序。

#### 通过标准

- 删除 `build/`、`install/`、`log/` 后可以重新构建；
- 依赖同时正确写入 `package.xml` 和 CMake target；
- 新终端按 README 能启动两个节点；
- 不提交生成目录。

### 阶段 3：通信接口设计

#### 要掌握的内容

- `.msg`、`.srv`、`.action`；
- topic、service 和 action 的选择依据；
- Header、时间戳、frame ID、单位和枚举；
- 接口包与实现包分离；
- 接口演进和兼容性；
- 不把内部类或任意字符串直接当稳定接口。

#### 通过标准

能解释为什么持续遥测不用 service、长时间任务不用普通 service、配置值不一定需要自定义 topic。

### 阶段 4：参数、launch 和系统配置

#### 要掌握的内容

- 参数声明、默认值、类型和校验；
- 参数 YAML；
- Python launch 文件；
- node name、namespace 和 remapping；
- launch argument、condition 和 event handler；
- 多机或多传感器实例的命名策略；
- 配置文件与代码默认值的优先关系。

#### 通过标准

- 不改源码即可切换配置；
- launch 不依赖当前工作目录；
- 多实例的话题、参数和 TF frame 不冲突；
- 关键参数有默认值、范围和启动时日志。

### 阶段 5：TF2、时间、URDF 和 RViz

#### 要掌握的内容

- frame、坐标变换和 TF tree；
- 静态变换与动态变换；
- parent/child 方向；
- 消息时间戳和查询时刻；
- `base_link`、`odom`、`map` 等常见 frame 的职责；
- URDF link、joint、visual、collision、inertial；
- RViz 的 Fixed Frame 和显示插件；
- ENU/FLU 与 NED/FRD 的区别。

#### 通过标准

- 能回答“这组数是在什么坐标系、相对谁、哪个时刻测得”；
- 不通过反复交换正负号来猜坐标转换；
- TF tree 连通，父子关系稳定且命名一致。

### 阶段 6：QoS、DDS 和跨机通信

#### 要掌握的内容

- history、depth、reliability、durability；
- publisher offered 与 subscription requested 的兼容关系；
- 默认 QoS 与 SensorDataQoS；
- DDS discovery、组播、domain ID；
- RMW 实现和网络接口；
- localhost、跨主机、防火墙、虚拟机/WSL/容器网络；
- 为什么“能看到 topic 名”不等于“能收到消息”。

#### 通过标准

- 能从端点信息判断 QoS 是否兼容；
- 跨机失败时能区分发现、类型、QoS、防火墙和路由问题；
- 不通过无目的重装 ROS 解决网络问题。

### 阶段 7：时间、日志、rosbag2 和传感器数据

#### 要掌握的内容

- 系统时间、ROS time 和仿真时间；
- `use_sim_time` 与 `/clock`；
- Header 时间戳和数据到达时间的区别；
- rosbag2 录制、信息查看和回放；
- 日志级别、结构化上下文和节流日志；
- 图像、IMU、点云等高频数据的容量和 QoS；
- bag 中可能包含的位置、图像和设备隐私。

#### 通过标准

- 一份故障报告附带最小必要 bag、启动命令和参数；
- 回放时节点正确使用仿真时间或数据时间戳；
- 不使用日志打印代替可查询的状态或正式错误处理。

### 阶段 8：executor、callback group 和组件

#### 要掌握的内容

- executor 如何调度 subscription、timer、service 和 action 回调；
- SingleThreadedExecutor 与 MultiThreadedExecutor；
- MutuallyExclusive 与 Reentrant callback group；
- 阻塞回调对同一 executor 中其他工作的影响；
- 共享状态、锁、死锁和数据竞争；
- component 与进程内通信；
- lifecycle node 的状态和适用场景。

#### 通过标准

- 能说明每个回调可能在哪些线程运行；
- 锁不跨越耗时 I/O、service 调用或不可控回调；
- 不以“换成 MultiThreadedExecutor”作为所有性能问题的答案。

### 阶段 9：测试、调试和性能观察

#### 要掌握的内容

- 普通 C++ 单元测试与节点集成测试；
- launch test 和端到端测试的分工；
- `ros2 doctor`、CLI introspection、`rqt_graph`、`rqt_console`；
- `topic hz`、`bw`、`delay` 和 topic statistics；
- 日志级别、节点状态和健康检查；
- CPU、内存、队列堆积和回调耗时；
- 故障注入：节点退出、消息停止、延迟、错误参数和网络断开。

#### 通过标准

- 先用数据证明消息没发出、没发现、没匹配或没及时处理；
- 测试可重复运行，不依赖固定启动等待时间碰运气；
- 修复问题时保留一个能防止回归的测试。

### 阶段 10：Gazebo、PX4 和 Offboard

#### 前置条件

只有以下内容均通过验收后才进入本阶段：

- C++ 节点能稳定构建和测试；
- 能检查 topic 类型、频率和 QoS；
- 能正确处理 TF、时间和坐标系；
- 节点退出和消息中断有明确恢复策略。

#### 学习内容

- Gazebo 与 ROS 2 bridge，只桥接 `/clock` 等明确需要的 Gazebo Transport 话题；
- PX4 uXRCE-DDS client 与 Micro XRCE-DDS Agent；
- `px4_msgs` 与 PX4 固件消息定义的版本对应关系；
- `/fmu/out/*` 与 `/fmu/in/*`；
- OffboardControlMode、TrajectorySetpoint、VehicleCommand；
- NED/FRD 与 ENU/FLU 转换；
- Offboard 心跳和链路丢失保护。

详细飞控主线见：[PX4 无人机学习路线](/knowledge/tools/learning-paths/px4/)。

#### 通过标准

- 能解释 ROS 2 消息到 PX4 uORB 的完整路径；
- 使用工具证明消息频率与 QoS 满足要求；
- 外部节点停止后，仿真飞机进入预期安全模式；
- 未通过故障注入前，不连接真机执行器。

### 自检问题

完成主线后，应能回答：

1. topic、service 和 action 分别适合什么场景？
2. 为什么相同 topic 名和消息类型仍可能收不到数据？
3. underlay 和 overlay source 顺序为什么重要？
4. 消息时间戳和接收时间有什么区别？
5. TF 查询为什么会出现 extrapolation 错误？
6. Reliable 是否一定比 Best Effort 更适合传感器？
7. 单线程 executor 中一个慢 service 会影响什么？
8. callback group 怎样影响并发？
9. 为什么算法应尽量与 `rclcpp::Node` 分离？
10. PX4 与 ROS 2 坐标系混用会产生什么后果？

### 故障定位顺序

遇到通信问题时按层检查：

1. **进程**：节点是否存活，有无错误退出；
2. **环境**：发行版和工作空间是否正确 source；
3. **名称**：node、namespace、topic、remap 是否符合预期；
4. **类型**：消息类型和接口版本是否一致；
5. **发现**：domain、RMW、网卡、防火墙和 DDS discovery；
6. **端点**：publisher/subscriber 是否存在；
7. **QoS**：端点策略是否兼容；
8. **数据**：频率、时间戳、frame、单位和值是否合理；
9. **执行**：回调是否被阻塞、队列是否堆积；
10. **业务**：状态机和前置条件是否允许当前动作。

### 提交和交接清单

- [ ] README 写明 ROS 2 发行版和操作系统；
- [ ] `package.xml` 与 CMake 依赖一致；
- [ ] 不提交 `build/`、`install/`、`log/`；
- [ ] launch 不依赖当前工作目录；
- [ ] 接口写明单位、frame 和时间语义；
- [ ] QoS 选择有理由；
- [ ] 多实例 namespace 不冲突；
- [ ] 算法与 ROS I/O 分离；
- [ ] 正常与失败路径都有测试；
- [ ] bag 和日志已检查隐私；
- [ ] 故障注入结果和剩余风险已记录。

### 相关公开资料

- [PX4 Gazebo 仿真安装指南](/knowledge/research/flight-control/px4-gazebo-simulation-setup/)：按明确的版本组合搭建 PX4、Gazebo、ROS 2 与 Micro XRCE-DDS 仿真环境。

以下内容来自早期项目记录，适合了解传感器、定位与飞控接入场景。使用其中的命令和接口前，应按当前 ROS 2 环境重新核对版本与兼容性。

- [关于 T265 的使用](/knowledge/research/perception-localization/t265/)：查看视觉里程计数据、位姿话题和坐标信息的实际示例。
- [关于 D435 的使用](/knowledge/research/perception-localization/d435/)：了解深度相机数据获取与感知程序的基本结构。
- [关于 UWB 的使用](/knowledge/research/perception-localization/uwb/)：了解外部定位数据、精度判断和飞控接入问题。
- [在上位机安装 ACFly-Mavros](/knowledge/research/flight-control/acfly-mavros/)：旧 ROS 1/MAVROS 系统的集成记录，仅作为系统组成和迁移对照。

### 参考资料

- [ROS 2 发行版与支持周期](https://docs.ros.org/en/humble/Releases.html)
- [ROS 2 Humble Beginner CLI Tutorials](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools.html)
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
