---
title: "视觉感知与点云建图指南"
description: "覆盖针孔与鱼眼相机标定、视觉前端与多视图几何、YOLO/TensorRT/ByteTrack 观测契约、点云配准（ICP/GICP/NDT）以及 log-odds 占据栅格建图。"
editUrl: false
---

感知模块负责把相机、深度传感器与激光雷达的原始观测转化为**几何地图**（在哪里、形状如何）与**语义目标**（这是什么、在何处），为状态估计与规划提供可信输入。

### 1. 相机成像模型与视觉前端

#### 1.1 针孔与畸变模型

三维相机坐标系点 $(X, Y, Z)^T$ 经内参矩阵 $K$ 投影到像素 $(u, v)$：

$$
Z \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} X \\ Y \\ Z \end{bmatrix}
$$

- **畸变模型**：普通广角（FOV $< 120^\circ$）使用 RadTan（径向 $k_1, k_2, k_3$ + 切向 $p_1, p_2$）；鱼眼镜头（FOV $\ge 120^\circ$）须采用 Kannala-Brandt（Equidistant）或 Double Sphere 模型。
- **标定与快门**：单目/双目内参常用 OpenCV / `camera_calibration`，相机-IMU 联合时空标定常用 Kalibr；无人机 VIO/视觉导航优先选用全局快门（Global Shutter）相机，避免卷帘快门在振动与快转下的几何畸变。

#### 1.2 视觉前端与多视图几何

| 路线 | 代表方法 | 特点与典型应用 |
| --- | --- | --- |
| **特征点 + 描述子** | ORB、SIFT、SuperPoint | 旋转/尺度不变性强，支持大视角变化与回环重定位（如 ORB-SLAM3） |
| **稀疏光流** | Shi-Tomasi 角点 + LK 金字塔光流 | 无描述子开销、CPU 占用低（如 OpenVINS、VINS-Fusion） |
| **直接法** | 光度误差最小化 | 弱纹理表现好，但对曝光突变与卷帘快门敏感（如 DSO、FAST-LIVO） |

- 核心几何问题：2D-2D 对极几何（单目初始化，存在尺度模糊）、3D-2D PnP（已知地图点求 6-DoF 位姿）、三角化恢复深度（基线过小深度误差大），且均须配合 **RANSAC** 剔除外点。

### 2. 实时目标检测与多目标跟踪（YOLO + ByteTrack）

在嵌入式边缘端（如 Jetson）常用的 Detection-by-Tracking 管线为：`YOLO + TensorRT 推理 → 卡尔曼运动预测 → ByteTrack 两阶段数据关联 → 深度/点云 3D 升维`。

- **TensorRT 优化**：PyTorch $\to$ ONNX $\to$ TensorRT（`.engine`），开启 FP16 通常提速 2～3 倍且精度几乎无损；预处理（Letterbox）与框还原必须成对校验，先检查引擎真实输入输出张量形状与 dtype。
- **ByteTrack 两阶段关联**：第一阶段用高分框与卡尔曼预测框做 IoU 匈牙利匹配；第二阶段保留低分框对未匹配轨迹二次关联，避免目标短暂遮挡即丢失 ID；仅允许未匹配的高分框新建轨迹。
- **控制闭环观测契约**：
  1. 对外发布的“当前观测”只允许来自本帧真实匹配的检测框，不能把纯卡尔曼预测当作新观测；
  2. 目标 ID 绑定会话前缀（`session_id:track_id`），丢失超阈值明确报 `LOST`；
  3. 输出消息的 `header.stamp` 严格继承原始图像采集时刻，在接收、推理后与控制使用前多层校验新鲜度。

### 3. 点云预处理与配准（ICP / GICP / NDT）

```text
原始点云 → IMU 运动畸变去除 → 体素降采样 → KD-Tree / ikd-Tree 近邻 → ICP / GICP / NDT 配准
```

- **预处理与索引**：激光扫描存在帧内运动畸变，须利用高频 IMU 插值对齐同一时刻；暴力最近邻查询约 $O(N)$，`KD-Tree` 平均约 $O(\log N)$；增量建图常用 `ikd-Tree` 或 `iVox`。
- **三类核心配准模型**：
  - **ICP（点到点 / 点到面）**：5 步迭代流程（初始化 $\to$ 变换 $\to$ 最近邻关联 $\to$ 求解最优 $(R,t)$ $\to$ 收敛判定）；点到面在结构化墙面/地面环境中收敛精度与速度明显优于点到点；
  - **GICP（面到面）**：将局部邻域建模为高斯分布并最小化马氏距离，精度与鲁棒性优异；
  - **NDT（正态分布变换）**：在目标体素正态分布上牛顿法优化，无需逐点近邻搜索、初值容忍度较好，但精度受网格分辨率制约。
- **退化与外点**：长直走廊或空旷大平面会引起几何约束退化，需通过特征值检测在退化方向冻结激光更新并依赖 IMU/轮速维持；动态物体拖影需采用 Huber/Cauchy 鲁棒核降权。

### 4. 地图表示与占据栅格建图

| 表示 | 优点 | 局限 | 典型用途 |
| --- | --- | --- | --- |
| **占据栅格** | 结构规则、直接索引、适合碰撞查询 | 稠密存储内存开销大、分辨率固定 | 局部建图、栅格搜索 |
| **OctoMap** | 八叉树压缩空旷区域、适合大范围 3D | 查询和更新相对复杂 | 稀疏三维占据地图 |
| **点云** | 保留原始几何、易由传感器直接生成 | 无规则索引，不直接表达自由空间 | 配准、重建、局部碰撞检测 |
| **ESDF** | 每点含到最近障碍的有符号距离和梯度 | 构建与增量维护成本较高 | 梯度轨迹优化、安全距离查询 |

#### 静态二值贝叶斯占据栅格与 log-odds 更新

假设环境静态且各栅格相互独立（未知栅格 $p(m_i)=0.5$，对应 $l_0=0$），采用 log-odds 将概率连乘转为加法更新：

$$
l(m_i) = \log\frac{p(m_i)}{1 - p(m_i)}, \qquad l_{t,i} = \operatorname{inv\_sensor\_model}(m_i, x_t, z_t) + l_{t-1,i} - l_0
$$

激光束经过的离散栅格（常用 Bresenham 直线算法枚举）更新为空闲，量测终点附近更新为占据。

### 相关资料

- [状态估计与 SLAM 融合架构](/knowledge/research/perception-localization/state-estimation-and-slam/)
- [视觉里程计接入 PX4 指南](/knowledge/research/perception-localization/vio-px4-integration/)
- [路径规划与轨迹优化指南](/knowledge/research/flight-control/path-planning-and-trajectory-optimization/)
- [机器人算法学习路线](/knowledge/tools/learning-paths/robotics-algorithms/)
