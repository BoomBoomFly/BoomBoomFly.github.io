---
title: "具身 AI Agent 与 ROS 2 安全集成指南"
description: "涵盖 Workflow vs Agent 选型、MCP 与上下文工程、快慢双系统架构、ROS 2/PX4/FPGA 五层安全接入边界与 Gazebo 故障注入验收。"
editUrl: false
---

将大模型与多模态推理引入真实无人机或移动机器人时，第一原则不是“有多智能”，而是**确定性安全兜底**。软件错误在沙箱中只是异常退出，在物理载体上则意味着碰撞与损坏。

### 1. Agent 工程基础与上下文治理

- **Workflow vs Autonomous Agent**：任务步骤固定、分支可枚举时优先采用确定性 Workflow；仅在步骤数量与路径不可预先穷举时引入自主循环 Agent，并强制设置 `max_steps` 与 Token/费用断路器。
- **ACI（Agent-Computer Interface）与 MCP**：工具 Schema 保持扁平与强类型校验；结构化回传可恢复错误原因以便自纠；高风险或不可逆操作须引入人工审批门控（HITL）；利用 MCP（Tools / Resources / Prompts）解耦模型与外部工具生态。
- **上下文与评测防线**：通过 Write / Select / Compress / Isolate 四策略抑制长任务 Context Rot（超长工具输出落盘摘要，子任务隔离上下文）；上线前区分 `Pass@k` 与 `Pass^k` 回归测试，拦截间接 Prompt Injection。

### 2. 快慢双系统架构（System 2 / System 1）

具身智能体采用异步分层的快慢双系统协同工作：

- **System 2（慢系统，0.2～2 Hz）**：VLM / LLM 负责开放词汇理解、长程任务拆解、异常恢复与高层技能调度。
- **System 1（快系统，20～500+ Hz）**：传统感知-SLAM-规划-控制栈（如检测跟踪、VIO、Nav2 / EGO-Planner、MPC / PID）或高频 VLA 策略，承担局部避障与动力学稳定闭环。

| 技术路线 | 代表思路 | 优势 | 局限与适用场景 |
| --- | --- | --- | --- |
| **LLM + 预定义技能库** | SayCan、ROSA | **安全可控、最易落地**，直接复用 ROS 2 Action | 无法完成技能集之外的灵巧动作 |
| **Code as Policies** | 生成 Python 策略代码 | 可表达循环与几何逻辑 | 须配合严格 AST 检查与沙箱隔离 |
| **VLN** | 视觉语言导航 | 擅长开放地标语言引导 | 动态避障仍高度依赖底层局部规划 |
| **端到端 VLA** | OpenVLA、$\pi_0$ | 视觉+语言直接输出动作分块 | 需大规模真机示教数据，移动平台安全性不如分层规划 |

> 对于室内无人机与移动机器人，优先采用 **“LLM/VLM（System 2）+ 检测跟踪/SLAM/规划控制（System 1）”** 的有限技能编排架构。

### 3. ROS 2 / PX4 / FPGA 五层安全接入边界

#### 三条不可逾越的硬件红线

1. **严禁 LLM 直连高频控制环**：绝不允许大模型直接输出 `cmd_vel` 连续流、PX4 `TrajectorySetpoint` 高频参考或底层电机 PWM 占空比。
2. **只暴露有限、参数化、可取消的高层 Skill**：Agent 仅可调用如 `navigate_to_waypoint`、`hover_at`、`return_and_land` 等受控技能，底层交由 Nav2、Behavior Tree 或 PX4 ModeExecutor 执行。
3. **控制权与急停永远属于底层确定性系统**：任何时候遥控器人工接管、电子围栏触发或看门狗超时，底层立即抢占控制权，Agent 无法覆写或阻止急停。

#### 五层安全接入链路

```text
1. LLM Agent (System 2 意图理解与任务编排)
       │ 离散 Skill 调用
       ▼
2. Skill 封装层 (MCP Tool Schema + 只读状态 Resource)
       │ 强类型参数
       ▼
3. 契约校验与门控层 (围栏 / 新鲜度校验 / 单 Writer 模式锁)
       │ 校验通过（越界或过期直接结构化拒绝）
       ▼
4. 确定性执行层 (ROS 2 Action / Nav2 / PX4 ModeExecutor)
       │ 受控参考指令
       ▼
5. 硬实时安全底座 (PX4 Failsafe / FPGA RTL 安全仲裁与急停)
```

#### Skill 网关五项强制门控

| 检查项 | 核心门控逻辑 |
| --- | --- |
| **物理围栏与限幅** | 目标坐标与高度/速度必须落在预设安全包络内，越界立即拒绝 |
| **观测新鲜度防洗白** | 校验决策依据图像的原始 `header.stamp`，超时直接报 `stale_observation`，严禁重打当前时间“洗白” |
| **单 Writer 与状态互斥** | 同一时刻只允许一个高层 Skill 持有运动授权，新任务须先显式取消旧 Action |
| **模式与健康前提** | 核查定位收敛、电量阈值及无人工接管后方可派发 |
| **原子超时与断连兜底** | 每个 Skill 绑定硬超时；若 Agent 进程崩溃或云端断网，System 1 独立进入悬停、降落或原地停车 |

### 4. 仿真故障注入验收清单

接入真机前须在 Gazebo 中完成五项故障注入验收：
1. **非法坐标注入**：验证门控层 100% 拦截超限坐标；
2. **观测冻结 / 丢帧**：冻结 VIO 或视觉输入，验证停止派发新移动指令并保持安全状态；
3. **Agent 进程强杀**：技能执行中途终止 Agent 进程，验证底层看门狗在规定毫秒数内接管；
4. **间接 Prompt 注入**：在识别文本中植入恶意越权指令，验证策略护栏与物理安全边界不被突破；
5. **人工接管抢占**：拨动遥控器切回手动模式，验证 Skill 立即中止且不重发覆盖指令。

### 相关资料

- [AI Agent 开发学习路线](/knowledge/tools/learning-paths/agent/)
- [PX4 + ROS 2 Offboard 与 External Mode 架构指南](/knowledge/research/flight-control/px4-ros2-offboard-architecture/)
- [视觉感知与点云建图指南](/knowledge/research/perception-localization/vision-pointcloud-and-mapping/)
- [FPGA 软硬件协同与时序设计指南](/knowledge/research/robotics-intelligence/fpga-hw-sw-codesign/)
