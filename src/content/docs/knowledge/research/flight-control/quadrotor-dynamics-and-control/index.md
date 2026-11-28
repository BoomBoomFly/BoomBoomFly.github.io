---
title: "四旋翼动力学与轨迹跟踪控制"
description: "覆盖四旋翼牛顿-欧拉动力学、串级 PID 与前馈、微分平坦与 SE(3) 几何控制、MPC/CMPCC 以及 ADRC/LQR/SMC 选型对比。"
editUrl: false
---

多旋翼无人机本体不自稳，高质量飞行控制不是单纯调 PID，而是**基于动力学模型的前馈补偿 + 反馈误差校正**。

### 1. 四旋翼动力学模型

- **电机一阶响应**：$\dot\omega_i = k_m(\omega_{i,\text{des}} - \omega_i)$
- **推力与反扭矩**：$F_i = k_F \omega_i^2$，$M_i = k_M \omega_i^2$
- **姿态变换**：采用 Z-X-Y 欧拉角时，$R_{ab} = R_z(\psi)R_x(\phi)R_y(\theta)$；欧拉角导数不等于机体系角速度 $\omega$，必须通过变换矩阵转换。
- **平动与转动方程**：
  $$
  m\ddot p = -mg z_W + u_1 z_B, \qquad I\dot\omega + \omega\times(I\omega) = u_{2:4}
  $$
  四个电机的差分推力产生滚转与俯仰力矩，反扭矩组合产生偏航力矩。

### 2. 串级 PID 与前馈控制

工程上常采用**慢速位置外环 + 快速姿态内环**的串级架构（内环带宽通常需高于外环 3～5 倍，调参严格从最内环向外环整定）：

```text
位置环 P → 速度环 PID+FF → 姿态角环 P → 角速度环 PID+FF → 混控器
```

- **一阶 / 二阶积分对象前馈跟踪律**：
  $$
  u = \dot x_{\text{des}} + K_p(x_{\text{des}} - x), \qquad u = \ddot x_{\text{des}} + K_d(\dot x_{\text{des}} - \dot x) + K_p(x_{\text{des}} - x)
  $$
- **工程改进四要素**：微分先行（只对测量值求微分，消除设定值阶跃冲击）、不完全微分（串联低通/陷波滤波抑制高频噪声）、抗积分饱和（条件积分或反计算法）、前馈补偿（悬停推力与期望加速度前馈）。
- **整定原则**：Ziegler-Nichols 临界振荡法（$K_u, T_u$）仅可作为经验整定起点，不能替代安全约束与限幅下的实机测试。

### 3. 微分平坦性与 $SE(3)$ 几何控制

小角度线性化级联控制仅适合悬停附近；大姿态角与高机动动作需基于**微分平坦性**与旋转矩阵空间 $SO(3)$ 几何误差：

- **平坦输出**：$\sigma = [x, y, z, \psi]^T$。位置、速度、加速度由平坦输出求导得到；期望推力矢量方向为 $z_{B,\text{des}} = F_{\text{des}}/\|F_{\text{des}}\|$，结合期望偏航即可构造 $R_{\text{des}} \in SO(3)$，并由 jerk 与 $\dot\psi$ 映射期望角速度 $\omega_{\text{des}}$。
- **$SE(3)$ 几何控制律**（避开欧拉角万向锁奇异）：
  $$
  F_{\text{des}} = -K_p e_p - K_v e_v + mg z_W + m\ddot r_T
  $$
  $$
  u_1 = F_{\text{des}} \cdot z_B, \qquad u_{2:4} = -K_R e_R - K_\omega e_\omega
  $$
- **仿真验证梯度**：按“悬停稳定 $\to$ 单轴阶跃 $\to$ 圆轨迹 $\to$ 菱形拐角 $\to$ 质量/惯量摄动与外扰饱和测试”顺序逐级验证。

### 4. MPC、CMPCC 与常用控制算法选型

#### 4.1 滚动优化控制（MPC / CMPCC）

MPC 在有限预测时域 $N$ 内显式处理动力学与状态/输入约束，每拍仅执行第一步控制量 $u_0^*$ 并滚动重算；工程上常用热启动（Warm Start）、对状态硬约束引入松弛变量避免求解不可行。
- **走廊轮廓追踪（CMPCC）**：将轨迹进度 $\theta$ 纳入状态（含位置/速度/加速度与进度，输入为 jerk 与进度高阶量），在凸多面体安全走廊线性不等式与终端可停止速度约束下，权衡轮廓误差、跟踪误差与前进速度。

#### 4.2 常用控制算法选型对照

| 算法 | 核心机制 | 强项 | 典型适用场景 |
| --- | --- | --- | --- |
| **PID + 前馈** | 误差比例/积分/微分 + 模型前馈 | 计算极轻量、免精确建模 | 底层电流/转速/角速度环（500～1000+ Hz） |
| **LADRC** | 线性扩张状态观测器（LESO）在线估计并抵消总扰动 | 抗未知外扰强、仅需调 $\omega_o, \omega_c, b_0$ | 抗风姿态环、负载变化电机控制 |
| **SMC** | 滑模面 + 切换律（配合边界层/高阶滑模抑制抖振） | 对匹配不确定性与有界扰动强鲁棒 | 水下航行器、电机滑模观测器 |
| **LQR** | 状态空间二次型最优反馈 $u=-Kx$ | 天然处理 MIMO 耦合、离线求 $K$ 在线极快 | 倒立摆、轮腿平衡、路径横向跟踪 |
| **MPC / NMPC** | 有限时域 QP / SQP-RTI 在线滚动优化 | 显式处理状态/输入硬约束与前瞻 | 四足凸 MPC、无人机高机动穿障跟踪 |

### 相关资料

- [无人机平台设计与自主导航架构](/knowledge/research/flight-control/uav-platform-and-autonomy-architecture/)
- [路径规划与轨迹优化指南](/knowledge/research/flight-control/path-planning-and-trajectory-optimization/)
- [PX4 + ROS 2 Offboard 与 External Mode 架构指南](/knowledge/research/flight-control/px4-ros2-offboard-architecture/)
- [机器人算法学习路线](/knowledge/tools/learning-paths/robotics-algorithms/)
