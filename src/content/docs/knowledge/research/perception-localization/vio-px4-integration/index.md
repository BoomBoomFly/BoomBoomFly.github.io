---
title: "视觉里程计接入 PX4 指南"
description: "面向 ROS 2 与 PX4 v1.16 无人机的 VIO 接入规范：单通路原则、ENU/FLU 到 NED/FRD 转换、时间轴对齐、先检查再限频流水线与五层验收。"
editUrl: false
---

将视觉惯性里程计（如 OpenVINS、Isaac ROS Visual SLAM）通过 `uXRCE-DDS` 接入 PX4 EKF2 时，桥接节点是**语义适配层**而不只是话题转发器。话题名正确、数值有限、发布频率高，都不能代替坐标系、时间轴、协方差与健康恢复的严格契约。

```text
D435i 双目红外 + IMU ──► VIO (OpenVINS / Isaac ROS)
                             │ nav_msgs/Odometry (ENU/FLU)
                             ▼
                     Bridge 语义适配 (先检查再限频)
                             │ px4_msgs/VehicleOdometry (NED/FRD + boot-time μs)
                             ▼
                       uXRCE-DDS ──► PX4 EKF2
```

> **单通路原则**：严禁同时通过 uXRCE-DDS 与 MAVROS 向同一台 PX4 注入视觉里程计，否则会导致重复融合或 EKF 来源不可判定。

### 1. 坐标系与四元数语义

#### 1.1 Pose 与 Twist 分属不同参考系

依据 ROS 2 Humble `nav_msgs/Odometry` 规范：
- **Pose（位置与姿态）** 由 `header.frame_id` 指定参考系；
- **Twist（线速度与角速度）** 由 `child_frame_id` 指定参考系。

以常见 VIO（`global/imu`）为例：位置在 `global` 系，速度在 `IMU/body` 系。做位置预测或积分前必须先旋转速度（$v_G = R_{GI} v_I$）；直接将 body 系速度积分到 global 位置会在机体旋转时产生伪残差。

#### 1.2 ENU / FLU 到 NED / FRD 转换

| 语义 | ROS / VIO 约定 | PX4 约定 | 注意事项 |
| --- | --- | --- | --- |
| **世界系** | ENU（东-北-天） | NED（北-东-地） | 位置、速度与协方差同步变换 |
| **机体系** | FLU（前-左-上） | FRD（前-右-下） | 向量轴变换为 $(x, -y, -z)$ |
| **姿态四元数** | 旋转表示 | 旋转表示（`px4_msgs` 顺序为 `(w, x, y, z)`） | 必须执行旋转矩阵或四元数复合，**不能把姿态四元数当普通向量换轴** |

> 常见 DDS 契约：`POSE_FRAME_FRD`（局部任意航向）+ `VELOCITY_FRAME_BODY_FRD`。世界 FRD 与机体 FRD 语义不同，不可混用。

### 2. 时钟域、采样时间与同步误区

- 必须区分并记录：**源传感器采样时刻**、**主机接收时刻**、**发布时刻**及各自所属时钟域。只有在统一时间轴映射后，`now - header.stamp` 才代表真实的样本年龄。
- **uXRCE-DDS 时间同步**：启用 `UXRCE_DDS_SYNCT=1` 并核对主机与 Agent 时钟；`timestamp_sample` 从输入样本时间戳换算为微秒，`timestamp` 置 `0` 交由 PX4 自动填充（MAVROS 由自身后端做同步，不可叠加 DDS 偏移）。
- **TIMESYNC RTT 不是图像年龄**，也不是相机与 IMU 之间的时间偏移。

### 3. 外参标定、杆臂与协方差传播

- VIO 内部已使用相机到 IMU 的标定外参 $T_{\text{cam\_imu}}$ 时，Bridge 不应重复乘相机外参。
- 更改输出测量参考点需补偿杆臂与角速度产生的线速度差，并同步传播协方差：三维向量方差块按 $R C R^T$ 变换。
- `px4_msgs/VehicleOdometry` 消息仅携带各分量的 3 个方差字段，`0` 不应被随意当作“未知”。

### 4. 数据处理流水线：先检查，再限频

```text
唯一新样本 → 时间/frame/有限值/协方差校验 → 跳变与预测残差检查
          → 视觉健康与恢复门控 → 输出限频 → 后端适配发布
```

1. **预测基线只由通过校验的原始样本推进**：若位置尖峰被拒却仍更新了基线，后续持续偏移会被误放行；在限频前执行校验，可避免异常帧恰好落在丢弃间隔内。
2. **区分“高频发布”与“真实视觉健康”**：IMU 预测传播、重复心跳或旧时间戳消息都不能为视觉健康续期。视觉丢失恢复后，应要求连续收到多个递增的新视觉时间戳与有效 Odometry 并重置会话计数；恢复供数不等于自动恢复旧飞行任务或解锁。

### 5. 五层验收证据表

| 层次 | 必须核对的独立证据 |
| --- | --- |
| **1. VIO 输出** | 图像/IMU 及时、视觉 stamp 持续推进、运动方向与尺度正确 |
| **2. Bridge 适配** | 输入、拒绝原因、坐标/时间转换、限频与输出各自可解释 |
| **3. PX4 接收** | 飞控侧实际收到的 `vehicle_visual_odometry` 内容、采样时间、frame 与 reset 计数 |
| **4. EKF2 融合** | 主估计器融合标志位、创新量（Innovation）与拒绝/超时标志 |
| **5. 运动效果** | 已知轨迹运动下的定位误差、遮挡重置恢复与可重复性 |

> Bridge 日志打印 `published` 仅证明本地调用了发布接口，参数开启与存在话题均不能替代飞控侧 EKF2 融合证据。

### 6. 方案选型建议

| 工程条件 | 优先方案 | 说明 |
| --- | --- | --- |
| 低集成成本、需观测内部状态、算力受限 | **OpenVINS** | 第一版可飞行 VIO 基线首选 |
| Jetson Orin 资源充足 + 硬件同步双目 | **Isaac ROS Visual SLAM** | 利用 GPU 加速进行对比评估 |
| 需要回环闭合 / 重定位 / 全局地图 | **独立叠加 SLAM 层** | 仅向 PX4 提供局部连续 `odom`，`map` 留给上层规划 |

### 相关资料

- [状态估计与 SLAM 融合架构](/knowledge/research/perception-localization/state-estimation-and-slam/)
- [视觉感知与点云建图指南](/knowledge/research/perception-localization/vision-pointcloud-and-mapping/)
- [PX4 Gazebo 仿真安装指南](/knowledge/research/flight-control/px4-gazebo-simulation-setup/)
- [PX4 + ROS 2 Offboard 与 External Mode 架构指南](/knowledge/research/flight-control/px4-ros2-offboard-architecture/)
- [PX4 无人机学习路线](/knowledge/tools/learning-paths/px4/)
- [机器人算法学习路线](/knowledge/tools/learning-paths/robotics-algorithms/)
