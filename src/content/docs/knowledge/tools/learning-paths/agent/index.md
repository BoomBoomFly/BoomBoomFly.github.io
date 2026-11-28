---
title: "AI Agent 开发学习路线"
description: "覆盖 Workflow 选型、Tool Use 与 MCP、上下文工程、记忆与状态图、评测护栏及具身 ROS 2 安全接入的 Agent 工程学习路线。"
editUrl: false
---

选读进阶路线：[学习路线总览](/knowledge/tools/learning-paths/) → [ROS 2](/knowledge/tools/learning-paths/ros2/) → AI Agent

### 工程栈总览

现代 AI Agent 工程按自底向上的五层能力组织：

```text
核心范式与推理基础 → 工具协议与上下文工程 → 记忆状态与多智能体编排
                                                    ↓
                        具身与机器人 Agent ◄── 评测观测与安全工程
```

> 核心原则：先用无框架原生代码理解底层循环与上下文边界，再引入协议、状态图、评测与机器人安全门控。能用确定性 Workflow 解决的任务，不盲目引入自主循环 Agent。

### 阶段安排

| 阶段 | 聚焦主题 | 核心目标与最小产出 |
| --- | --- | --- |
| 阶段 0–1 | 核心范式与结构化输出 | 分清确定性 Workflow（链式、路由、并行、协调-工作者、评估-优化）与 Autonomous Agent 的适用边界；掌握 SSE 流式拼接、JSON Schema 与 Pydantic 自纠闭环；理解 ReAct、Plan-and-Execute 与 Reflection 推理模式；手写不依赖框架的最小 `while` 循环（含 `max_steps` 熔断） |
| 阶段 2 | 工具契约、MCP 与上下文治理 | 掌握 ACI（Agent-Computer Interface）工具设计原则（扁平 Schema、幂等性、结构化可恢复报错、高风险 HITL 门控）；用 MCP（Tools / Resources / Prompts）解耦工具与上下文；应用 Context Engineering 四策略（Write / Select / Compress / Isolate）对抗 Context Rot；构建混合检索（BM25 + 向量 + RRF + Rerank）与 Agentic RAG |
| 阶段 3 | 记忆系统、状态图与多智能体 | 区分情景、语义与程序记忆的 Extract-Update-Recall-Forget 生命周期；使用显式状态图（State / Node / Edge、Checkpointer 持久化、HITL `interrupt`）实现断点恢复；掌握 Multi-Agent 协作拓扑、交接契约与信息衰减治理 |
| 阶段 4 | 评测、可观测性与安全护栏 | 建立三层评测金字塔并区分 `Pass@k`（至少成功一次）与 `Pass^k`（连续多次稳定通过）；接入 Trace/Span 追踪与步数/Token 预算断路器；落实直接/间接 Prompt Injection 隔离、最小权限分层与沙箱执行防护 |
| 阶段 5 | 具身与机器人安全编排 | 理解快慢双系统架构（System 2 高层语义规划 vs System 1 底层高频控制）；将 LLM 严格限定在有限的 ROS 2 Skill / Action 任务层，禁止跨过契约门控直连 PX4/电机控制，由底层硬件与飞控 Failsafe 承担确定性安全兜底 |

### 具身与机器人 Agent 安全红线

将 LLM / VLM 接入真实无人机或移动机器人平台时，必须守住以下边界：

1. **禁止直连底层执行器**：Agent 只能调用经参数校验的有限高层技能（如起飞到安全高度、前往指定航点、执行悬停），绝不直接输出 PWM、电机转速或未受约束的姿态角速度。
2. **输入新鲜度与权限仲裁**：底层控制器持续校验传感器与目标时间戳，遥控器人工接管与飞控 Failsafe 拥有最高优先级。
3. **离线与仿真先行**：先经过离线 Mock 工具契约测试与 Gazebo 仿真故障注入，确认异常参数与超时场景被安全拦截后，方可进入真机联调。

### 通关自检清单

- 能写出不依赖框架的最小 Agent `while` 循环，包含 `max_steps` 熔断、JSON Schema 校验与错误自纠闭环；
- 能封装本地只读/受控 MCP 工具，落地长输出截断摘要与混合检索（BM25 + 向量 + RRF），并追踪 Trace 与成本；
- 能在离线 Golden 测试集计算 `Pass@k` / `Pass^k`，并在 Gazebo 中完成越界坐标、观测冻结、进程强杀与间接 Prompt 注入四项安全拦截验收。

### 推荐参考项目

- **架构与上下文**：Anthropic *Building Effective Agents*、*Effective Context Engineering*
- **协议与 SDK**：Model Context Protocol（`modelcontextprotocol/specification`、`python-sdk`）、LangGraph、OpenAI Agents SDK、PydanticAI
- **评测与追踪**：Inspect AI、Promptfoo、Langfuse、OpenTelemetry GenAI 语义约定
- **具身与 ROS**：NASA JPL ROSA、OpenVLA、LeRobot、SayCan / Code as Policies

### 相关资料

- [具身 AI Agent 与 ROS 2 安全集成指南](/knowledge/research/robotics-intelligence/embodied-agent-ros2-integration/)
- [ROS 2 机器人开发学习路线](/knowledge/tools/learning-paths/ros2/)
- [PX4 + ROS 2 Offboard 与 External Mode 架构指南](/knowledge/research/flight-control/px4-ros2-offboard-architecture/)
- [机器人算法学习路线](/knowledge/tools/learning-paths/robotics-algorithms/)
