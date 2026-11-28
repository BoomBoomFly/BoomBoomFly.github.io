---
title: "PX4 + ROS 2 Offboard 与 External Mode 架构指南"
description: "总结 PX4 v1.16 与 ROS 2 控制架构选型：Setpoint 五层决策树、px4-ros2-interface-lib 五平面模型、防新鲜度洗白、单 Writer 约束与离线单元测试方法。"
editUrl: false
---

基于 PX4 v1.16（`release/1.16`）与 ROS 2 Humble 的控制开发主要有两条成熟路径：**Direct Offboard**（直接发布 `OffboardControlMode` / `TrajectorySetpoint` / `VehicleCommand`）与 **External Mode**（基于 `px4-ros2-interface-lib` 的 `ModeBase` / `ModeExecutorBase`）。无论采用哪种路线，核心都在于清晰的责任边界、单写入者约束与可验证的安全降级。

### 1. Setpoint 五层控制责任与选型决策

控制层级应尽可能留在高抽象层，只有在上层无法满足机动需求且团队已充分验证对应内环时才下沉：

```text
只关心目标位置与速度上限？ ──► Goto (30 Hz，PX4 GotoControl 平滑，点到点/悬停首选)
        │ 否
需要按轴指定 p/v/a 或可信前馈？ ──► Trajectory (50 Hz，应用保证参考一致性)
        │ 否
已有验证过的位置/速度外环？ ──► Attitude (100 Hz，姿态 + body FRD 推力)
        │ 否
已有验证过的姿态控制器？ ──► Rates (200 Hz，body FRD 角速度 + 推力)
        │ 否
                        保留 PX4 原生闭环，不要下沉
```

> **投放或外设舵机**：应通过 `PeripheralActuatorControls` 控制，绝不为了驱动辅助舵机而切入 Direct Actuators 并关闭飞控姿态/分配闭环。

### 2. External Mode 五平面模型（`px4-ros2-interface-lib`）

使用官方接口库时，须把五个独立控制面区分清楚，避免把“注册成功”或“回调触发”误判为“飞控已授权执行”：

| 平面 | 核心问题 | 唯一可信证据 |
| --- | --- | --- |
| **身份平面** | ROS 组件在 PX4 中是谁？ | Registration 回复的动态 ID（不可硬编码、不跨 FMU 重启复用） |
| **健康平面** | 当前能否 Arm / Run？ | `HealthAndArmingChecks` 回复（静态要求并集 + 动态 can-run） |
| **权限平面** | 此刻谁掌管编排权？ | `VehicleStatus.executor_in_charge` + Commander 逐条鉴权 |
| **控制平面** | 哪些闭环留给 PX4？ | 构造期绑定的 Setpoint Type + 连续 Setpoint 流 |
| **完成平面** | 请求是否接受、阶段是否结束？ | 命令 ACK、`ModeCompleted`、`VehicleStatus` 与 `DeactivateReason` |

#### 易混淆语义提示

- **`completed(Result)` 不等于切模式**：调用 `completed()` 后在 PX4 真正切换走之前，当前 Mode 仍对控制连续性负责，必须继续发布安全 Setpoint。
- **ACK Timeout 不等于未执行**：收到超时反馈时应先读取 `VehicleStatus` 对账，禁止盲目重发 `arm` / `scheduleMode`。
- **Owned Mode 与 Other Mode**：Owned Mode 随 Executor 联合注册，作为外部用户切入任务的入口；Other Mode 各自独立注册，被 Executor 串行调度。

### 3. Direct Offboard 单 Writer 架构与安全门控

对于轻量且追求静态可控的任务包（如 `offboard_cpp`），推荐使用纯 C++ 状态机与单写入者分层：

```text
外部规划 / 视觉缓存 → OffboardNode (固定频率 Timer)
                             │
                             ▼
                 MissionManager (纯 C++ 状态机)
                             │
                             ▼
               FlightMode / SetpointGenerator
                             │
                             ▼
           Px4Interface (唯一 /fmu/in/* 写入者) ──► PX4
```

#### 核心安全约束

1. **单 Writer 原则**：同一时间只有一个活跃控制源向 `/fmu/in/*` 写入控制设定点，严禁多个控制节点并发双写。
2. **防“新鲜度洗白”**：定时发布器不断重发同一个过期的视觉目标会让 Setpoint 传输时间戳显得“很新”，必须用独立结构保存原始 `source_stamp`、接收时间与 `session_id` / `generation`，在每个控制周期校验业务输入是否过期。
3. **预流与门控顺序**：本地位置有效后才启动 $\to$ 先预流（Prestream）设定点再请求切入 Offboard $\to$ 确认真实进入 Offboard 后再执行任务阶段。
4. **人工接管与 Failsafe 绝对优先**：一旦遥控器切出或 PX4 触发 Failsafe，立即停止任务推进与抢权，将控制权完整交还飞控与飞手。

### 4. 纯 C++ 解耦与 GoogleTest 离线验证

将状态机（`MissionManager` / `SetpointGenerator`）与 ROS 2 传输层解耦后，可直接在主机端使用 GoogleTest 驱动离线测试：

- **覆盖梯度**：参数边界校验 $\to$ 单周期 Setpoint 输出 $\to$ 微秒级超时边界 $\to$ 多状态转移 $\to$ 安全事件优先级（如定位失效、人工接管、Failsafe 降级）。
- **防止“假通过”**：修改源码后先重新编译目标再运行 `ctest`；确认测试注册数量不为 `Running 0 tests`。
- **证据边界**：离线 GoogleTest 通过仅证明状态机逻辑自洽，**不能替代 PX4 SITL 仿真与真机系留门禁验收**。

### 相关资料

- [无人机平台设计与自主导航架构](/knowledge/research/flight-control/uav-platform-and-autonomy-architecture/)
- [四旋翼动力学与轨迹跟踪控制](/knowledge/research/flight-control/quadrotor-dynamics-and-control/)
- [路径规划与轨迹优化指南](/knowledge/research/flight-control/path-planning-and-trajectory-optimization/)
- [具身 AI Agent 与 ROS 2 安全集成指南](/knowledge/research/robotics-intelligence/embodied-agent-ros2-integration/)
- [PX4 无人机学习路线](/knowledge/tools/learning-paths/px4/)
- [ROS 2 机器人开发学习路线](/knowledge/tools/learning-paths/ros2/)
- [PX4 Gazebo 仿真安装指南](/knowledge/research/flight-control/px4-gazebo-simulation-setup/)
- [视觉里程计接入 PX4 指南](/knowledge/research/perception-localization/vio-px4-integration/)
