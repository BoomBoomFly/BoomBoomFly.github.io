---
title: "状态估计与 SLAM 融合架构"
description: "覆盖 EKF/UKF/ESKF/PF 与因子图优化的范式选型、VIO/LIO 松紧耦合架构、OpenVINS/FAST-LIO2/LIO-SAM 对比及时空标定与机载部署建议。"
editUrl: false
---

单一传感器在真实机器人环境中均有明显短板：IMU 高频但积分数秒即漂移，相机缺绝对尺度且怕弱纹理/运动模糊，激光雷达自带尺度但易在长走廊发生几何退化。多传感器融合的核心是将高频惯导与低频外部观测互补。

### 1. 五类状态估计范式选型

| 范式 | 核心原理 | 典型强项 | 代表系统 |
| --- | --- | --- | --- |
| **EKF** | 一阶线性化高斯递推滤波 | 轻量、实时性强 | `robot_localization`、目标跟踪 |
| **UKF** | 无迹变换确定性采样 | 免推导解析雅可比、适合强非线性 | 雷达极坐标跟踪、参数联合估计 |
| **ESKF（流形误差状态）** | 名义状态积分 + $SO(3)$ 误差状态 $\delta\theta \in \mathbb{R}^3$ 滤波后注入重置 | 姿态无奇异、线性化误差小、适合高频紧耦合 | PX4 EKF2、FAST-LIO2（IESKF） |
| **PF（粒子滤波）** | 非参数蒙特卡洛粒子采样 | 支持非高斯与多峰分布、无需良好初值 | ROS 2 AMCL 全局重定位 |
| **因子图优化（FGO）** | 批优化 / 滑窗 MAP 求解（GN / LM + 李群 $\boxplus$ + IMU 预积分 + 边缘化） | 可重复重线性化历史状态、原生支持回环与乱序延迟观测 | GTSAM（iSAM2）、Ceres、g2o、LIO-SAM |

> 工程上常见分层架构：**底层高频（200～1000 Hz）用 ESKF 服务控制环，上层中低频（10～30 Hz）用因子图做高精度融合与回环建图**。

### 2. 松耦合 vs 紧耦合与主流开源框架

- **松耦合**：视觉/激光先独立输出位姿，再作为观测送入飞控滤波器（如 VIO $\to$ Bridge $\to$ PX4 EKF2），模块解耦、对接简单，但前端跟丢即整体失效。
- **紧耦合**：在同一状态向量中联合优化原始视觉重投影误差 / 激光点到面残差与 IMU 约束，退化环境下仍可利用部分特征与惯导约束，精度与鲁棒性更高。

| 框架 | 传感器组合 | 后端范式 | 适用场景 |
| --- | --- | --- | --- |
| **OpenVINS** | 单目/双目 + IMU | MSCKF（滑窗 ESKF） | 算力受限无人机、支持在线外参/时延标定 |
| **VINS-Fusion** | 单目/双目 + IMU (+ GPS) | 滑窗非线性优化（Ceres） | 室内外经典 VIO/回环基线 |
| **ORB-SLAM3** | 单目/双目/RGB-D (+ IMU) | 图优化 + 多地图 Atlas | 大尺度重定位与回环闭合（CPU 占用偏高） |
| **FAST-LIO2** | 3D 激光 + IMU | 流形 IESKF + `ikd-Tree` | 高频低延迟激光惯性里程计 |
| **LIO-SAM** | 3D 激光 + IMU (+ GPS) | 因子图（GTSAM iSAM2） | 大范围一致建图与多源融合 |
| **FAST-LIVO2** | 激光 + 相机 + IMU | IESKF（点到面 + 光度直接法） | 几何退化与弱纹理混合挑战场景 |

### 3. 工程落地关键规范

1. **时空标定决定上限**：外参旋转偏差 $1^\circ \sim 2^\circ$ 即会在高速机动时破坏预测一致性；时间同步优先采用硬件触发/PPS/PTP，否则务必启用在线时间偏移估计。
2. **协方差与姿态同步变换**：向量经旋转矩阵 $R$ 变换时，协方差矩阵必须按 $P_{\text{new}} = R P_{\text{old}} R^T$ 同步变换，不能只替换对角线元素；四元数须执行旋转复合。
3. **采样时刻对齐**：用传感器真实采样时刻 `timestamp_sample` 匹配历史姿态做运动去畸变，严禁混用主机发布时刻、Unix 时间与飞控 boot time。

### 4. 机载视觉里程计选型建议（以 Jetson + D435i 为例）

- **传感器隔离**：VIO 阶段优先使用 D435i 硬件同步双目红外灰度图（`infra1`/`infra2`）+ 内置 IMU；普通 USB 相机独立负责检测与识别任务，不混入异构 VIO。
- **平台选型**：算力或内存受限（如 Jetson 4 GB）首选 **OpenVINS**；资源充足（8 GB+ 且 JetPack 版本匹配）可对比评估 **Isaac ROS Visual SLAM**。需要闭环重定位时，仅向飞控送入局部连续 `odom`，把带跳变的全局 `map` 留在上层规划层。

### 相关资料

- [视觉里程计接入 PX4 指南](/knowledge/research/perception-localization/vio-px4-integration/)
- [视觉感知与点云建图指南](/knowledge/research/perception-localization/vision-pointcloud-and-mapping/)
- [PX4 + ROS 2 Offboard 与 External Mode 架构指南](/knowledge/research/flight-control/px4-ros2-offboard-architecture/)
- [机器人算法学习路线](/knowledge/tools/learning-paths/robotics-algorithms/)
