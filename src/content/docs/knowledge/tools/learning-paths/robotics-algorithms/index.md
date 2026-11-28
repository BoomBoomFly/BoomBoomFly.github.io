---
title: "机器人算法学习路线"
description: "覆盖感知与视觉、状态估计与 SLAM、路径与轨迹规划以及运动控制的机器人四层算法学习路线。"
editUrl: false
---

选读进阶路线：[学习路线总览](/knowledge/tools/learning-paths/) → [PX4](/knowledge/tools/learning-paths/px4/) → 机器人算法

### 四层算法栈总览

自主机器人系统通常按四层算法栈自底向上协同工作：

```text
感知与视觉 (Perception)
  ├──► 状态估计与 SLAM (Estimation) ──► 高频状态反馈 (p, v, q, b)
  │                                          │
  └──► 路径与轨迹规划 (Planning) ◄───────────┘
             │
             ▼
       平滑参考轨迹 (p, v, a, yaw) ──► 运动控制 (Control) ──► 执行器
```

### 阶段安排

| 阶段 | 核心主题 | 关键算法与工程要点 |
| --- | --- | --- |
| 1. 感知与视觉 | 几何视觉、检测跟踪与点云建图 | 针孔/畸变模型与相机标定、ORB/光流、对极几何与 PnP；YOLO + TensorRT（FP16/INT8）与 ByteTrack 两阶段数据关联；点云去畸变、体素滤波、`ikd-Tree`、ICP/GICP/NDT 配准；占据栅格（log-odds）、OctoMap 与 ESDF 地图表示 |
| 2. 状态估计与 SLAM | 递推滤波、因子图与紧耦合融合 | 区分 EKF、UKF、$SO(3)$ 误差状态卡尔曼滤波（ESKF，如 PX4 EKF2 与 FAST-LIO2）、粒子滤波（PF/AMCL）与因子图优化（GTSAM/Ceres/g2o）；理解 VIO/LIO 松紧耦合选型、时空外参标定与 $R P R^T$ 协方差传播 |
| 3. 路径与轨迹规划 | 前端搜索、采样规划与后端轨迹优化 | 构形空间（C-Space）障碍物膨胀与离散图搜索（Dijkstra、A\*、JPS、Hybrid A\*）；高维采样规划（PRM、RRT、RRT-Connect、RRT\*、Informed RRT\*）；五次多项式、Minimum-Snap 闭式求解、B 样条/EGO-Planner 与局部避障（DWA、TEB、MPPI） |
| 4. 运动控制 | 经典抗扰、最优控制与多体动力学 | 底层高频闭环（PID + 前馈）；四旋翼微分平坦性与 $SE(3)$ 几何控制；线性二次型最优控制（LQR）；显式约束滚动优化（MPC/CMPCC）；抗扰与滑模（LADRC、SMC）；浮动基多体全身控制（WBC） |

### 选型速查

#### 状态估计范式对比

| 范式 | 核心特性 | 典型代表 |
| --- | --- | --- |
| **EKF** | 一阶线性化高斯滤波，计算轻量 | 2D `robot_localization`、目标跟踪 |
| **UKF** | 无迹变换确定性采样，免推导雅可比 | 强非线性、雷达极坐标跟踪 |
| **ESKF** | $SO(3)$ 流形误差状态，姿态无奇异 | PX4 EKF2、FAST-LIO2（IESKF） |
| **PF** | 非参数粒子采样，支持多峰分布 | ROS 2 AMCL、全局重定位 |
| **因子图优化** | 稀疏非线性最小二乘（MAP），支持回环与重线性化 | GTSAM、LIO-SAM、ORB-SLAM3 |

#### 运动控制层级对比

| 算法 | 核心优势 | 典型运行层级 |
| --- | --- | --- |
| **PID + 前馈** | 免精确建模、实现简单、计算开销极低 | 电流环 / 转速环 / 姿态角速度环（500～1000+ Hz） |
| **$SE(3)$ 几何控制** | 基于微分平坦与 $SO(3)$ 旋转矩阵误差，避开欧拉角奇异 | 四旋翼大姿态、高机动轨迹跟踪控制 |
| **LADRC / SMC** | 在线扰动估计与补偿，抗外扰与参数摄动强 | 无人机抗风姿态环、电机扰动抑制 |
| **LQR** | 自然处理 MIMO 耦合，离线求解增益、在线极快 | 倒立摆、轮腿平衡、路径横向跟踪 |
| **MPC** | 显式处理状态与执行器硬约束、具备前瞻性 | 四足凸 MPC、无人机高机动轨迹跟踪（20～200 Hz） |
| **WBC** | 结合浮动基多体动力学与足端接触摩擦锥约束 | 足式机器人与力控机械臂全身控制 |

### 建议学习顺序

1. 先打牢数学与几何基础：刚体变换（$SO(3)$ / $SE(3)$）、四元数、线性代数、非线性最小二乘（高斯-牛顿 / LM）。
2. 从控制入手理解闭环：二阶系统 PD + 前馈、串级控制与四旋翼微分平坦性。
3. 再打通前端感知与建图：针孔投影、ICP 点云配准、占据栅格（log-odds）与 ESDF/OctoMap 区别。
4. 学习前端搜索（A\* / RRT\*）与后端时间参数化轨迹（五次多项式、Minimum-Snap、B 样条）。
5. 最后结合仿真与实机完成全链路集成：关注时钟域对齐、传感器标定、状态估计延迟与在线重规划。

### 通关自检清单

- 能推导并实现针孔投影、ICP 与 log-odds 占据栅格更新，并解释 EKF、ESKF、PF 与因子图优化的适用边界；
- 能编写或调优 A\*/RRT\* 与 Minimum-Snap/B 样条轨迹规划链路，清楚时间分配与连续安全约束检查方法；
- 能完成四旋翼级联 PID、$SE(3)$ 几何控制或 MPC 的仿真轨迹跟踪验证，并分析延迟、饱和与参数摄动影响。

### 相关资料

- [视觉感知与点云建图指南](/knowledge/research/perception-localization/vision-pointcloud-and-mapping/)
- [状态估计与 SLAM 融合架构](/knowledge/research/perception-localization/state-estimation-and-slam/)
- [路径规划与轨迹优化指南](/knowledge/research/flight-control/path-planning-and-trajectory-optimization/)
- [四旋翼动力学与轨迹跟踪控制](/knowledge/research/flight-control/quadrotor-dynamics-and-control/)
- [PX4 无人机学习路线](/knowledge/tools/learning-paths/px4/)
- [ROS 2 机器人开发学习路线](/knowledge/tools/learning-paths/ros2/)
- [视觉里程计接入 PX4 指南](/knowledge/research/perception-localization/vio-px4-integration/)
- [PX4 + ROS 2 Offboard 与 External Mode 架构指南](/knowledge/research/flight-control/px4-ros2-offboard-architecture/)
