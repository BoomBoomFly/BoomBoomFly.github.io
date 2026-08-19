---
title: "PX4 Gazebo 仿真安装指南（Ubuntu 20.04 / Ubuntu 22.04 WSL2）"
description: "配置 PX4 v1.16.2、ROS 2、Gazebo 与 Micro XRCE-DDS 的仿真环境指南。"
editUrl: false
---

### 1. 文档说明

本文记录两套 PX4 v1.16.2 仿真环境：

-   主线：Ubuntu 22.04 + ROS 2 Humble + Gazebo Harmonic；
-   遗留环境：Ubuntu 20.04 + ROS 2 Foxy + Gazebo Classic 11，仅用于复现已有工程。

两者均基于：

-   PX4 v1.16.2
-   SITL 仿真
-   Micro XRCE-DDS Agent v2.4.3
-   与 PX4 v1.16 匹配的 `px4_msgs` `release/1.16` 分支
-   ROS 2 通信

Gazebo Classic 与 Gazebo Harmonic 是两套不同仿真器，不应混用。ROS 2 Foxy 已停止维护，不再用于新环境。

ROS 2 基础概念、工作空间、环境加载和 CLI 用法见下方学习路线。PX4、`px4_msgs`、Micro XRCE-DDS 和 Gazebo 的精确版本组合以本文列出的上游官方资料为准，不能用通用 ROS 2 教程代替兼容性核对。

### 1.1 相关学习路线

- [ROS 2 机器人开发学习路线](/knowledge/tools/learning-paths/ros2/)：先掌握工作空间、节点、通信、QoS、TF2、launch 和 rosbag2。
- [PX4 无人机学习路线](/knowledge/tools/learning-paths/px4/)：了解仿真、PX4 架构、ROS 2 集成、Offboard 和真机安全的完整顺序。

------------------------------------------------------------------------

## 2. 环境选择

### 2.1 Ubuntu 20.04 遗留环境

仅适合：

-   ROS 2 Foxy
-   Gazebo Classic
-   传统 PX4 SITL

该环境只用于维护已有项目。新成员和新设备直接使用第 2.2 节的 Ubuntu 22.04 主线。

环境：

``` text
Ubuntu 20.04
 ├── PX4 v1.16.2
 ├── Gazebo Classic 11
 ├── ROS 2 Foxy
 └── Micro XRCE-DDS Agent
```

启动：

``` bash
make px4_sitl gazebo-classic
```

------------------------------------------------------------------------

### 2.2 Ubuntu 22.04 + WSL2 主线环境

适合：

-   ROS 2 Humble
-   Gazebo Harmonic
-   PX4 v1.16.2 新版仿真

环境：

``` text
Ubuntu 22.04
 ├── PX4 v1.16.2
 ├── Gazebo Harmonic / Gazebo Sim 8
 ├── ROS 2 Humble
 ├── Micro XRCE-DDS Agent v2.4.3
 └── px4_msgs release/1.16
```

启动：

``` bash
make px4_sitl gz_x500
```

------------------------------------------------------------------------

## 3. PX4 安装

### 3.1 创建工作目录

推荐：

``` bash
mkdir -p ~/px4_ws/external
cd ~/px4_ws/external
```

### 3.2 下载 PX4 v1.16.2

``` bash
git clone \
  --branch v1.16.2 \
  --recursive \
  https://github.com/PX4/PX4-Autopilot.git

cd PX4-Autopilot
```

检查：

``` bash
git describe --tags
git submodule status
```

如果子模块异常：

``` bash
git submodule sync --recursive
git submodule update --init --recursive
```

------------------------------------------------------------------------

## 4. 安装依赖

进入 PX4：

``` bash
cd ~/px4_ws/external/PX4-Autopilot
```

执行：

``` bash
bash Tools/setup/ubuntu.sh
```

该脚本会安装：

-   PX4 编译工具链
-   Gazebo 相关依赖
-   SITL 依赖

安装完成后：

``` bash
sudo reboot
```

WSL2：

``` powershell
wsl --shutdown
```

------------------------------------------------------------------------

## 5. Gazebo Classic 11（Ubuntu 20.04）

检查：

``` bash
gazebo --version
```

预期：

``` text
Gazebo multi-robot simulator, version 11.x
```

检查：

``` bash
which gazebo
dpkg -l | grep gazebo
```

常见组件：

``` text
gazebo11
libgazebo11
libgazebo11-dev
```

启动：

``` bash
make px4_sitl gazebo-classic
```

------------------------------------------------------------------------

## 6. Gazebo Harmonic（Ubuntu 22.04）

Ubuntu 22.04 不推荐安装 Gazebo Classic。

使用：

``` bash
make px4_sitl gz_x500
```

检查：

``` bash
gz sim --versions
```

常见模型：

``` bash
make px4_sitl gz_x500
make px4_sitl gz_x500_vision
make px4_sitl gz_x500_depth
make px4_sitl gz_x500_mono_cam
make px4_sitl gz_x500_lidar_front
```

查看当前支持模型：

``` bash
make px4_sitl list_vmd_make_targets | grep gz_
```

------------------------------------------------------------------------

## 7. 首次编译测试

通用：

``` bash
make px4_sitl
```

成功后：

``` text
pxh>
```

------------------------------------------------------------------------

## 8. ROS 2 + Micro XRCE-DDS

本节只说明 Ubuntu 22.04、ROS 2 Humble、Gazebo Harmonic 和 PX4 v1.16.2 的主线环境。`/fmu/in/*` 与 `/fmu/out/*` 通过 Micro XRCE-DDS 传输；`ros_gz_bridge` 只负责 ROS 2 与 Gazebo Transport 之间需要显式桥接的话题，例如 `/clock`。两条链路不要混为一谈。

### 8.1 安装 Humble 与 Harmonic 的桥接包

Humble 默认配对 Gazebo Fortress。PX4 v1.16.2 使用 Harmonic，因此需要 Gazebo 软件源提供的非默认包 `ros-humble-ros-gzharmonic`。它与默认的 `ros-humble-ros-gz*` 包冲突。

先检查当前安装：

``` bash
dpkg -l | grep -E 'ros-humble-ros-gz|ros-humble-ros-gzharmonic'
```

如果已经安装 Humble 默认的 `ros-humble-ros-gz`，并确定本机用于 PX4 v1.16.2 + Harmonic，再执行：

``` bash
sudo apt remove ros-humble-ros-gz
sudo apt update
sudo apt install ros-humble-ros-gzharmonic
```

不要在同一系统中来回安装 Fortress 与 Harmonic 的桥接包。需要维护普通 Humble + Fortress 工程时，使用单独的虚拟机、容器或 WSL 发行版。

### 8.2 安装 Micro XRCE-DDS Agent v2.4.3

``` bash
cd ~/px4_ws/external
git clone \
  --branch v2.4.3 \
  --depth 1 \
  https://github.com/eProsima/Micro-XRCE-DDS-Agent.git
cd Micro-XRCE-DDS-Agent
mkdir build
cd build
cmake ..
make -j"$(nproc)"
sudo make install
sudo ldconfig /usr/local/lib/
```

安装后确认命令可用：

``` bash
command -v MicroXRCEAgent
MicroXRCEAgent --help
```

### 8.3 准备匹配 PX4 v1.16 的消息工作空间

`px4_msgs` 必须与 PX4 固件使用相同的消息定义。PX4 v1.16.2 对应 `release/1.16`，不要使用跟随 PX4 `main` 的默认分支。

``` bash
mkdir -p ~/px4_ws/ros2_ws/src
cd ~/px4_ws/ros2_ws/src
git clone \
  --branch release/1.16 \
  --depth 1 \
  https://github.com/PX4/px4_msgs.git

source /opt/ros/humble/setup.bash
cd ~/px4_ws/ros2_ws
rosdep install --from-paths src --ignore-src -r -y
colcon build --symlink-install
```

记录实际分支和提交：

``` bash
git -C ~/px4_ws/ros2_ws/src/px4_msgs branch --show-current
git -C ~/px4_ws/ros2_ws/src/px4_msgs rev-parse HEAD
```

每个需要解析 PX4 消息的新终端都要加载 ROS 2 和该工作空间：

``` bash
source /opt/ros/humble/setup.bash
source ~/px4_ws/ros2_ws/install/setup.bash
```

### 8.4 启动 PX4 与 Agent

终端 1：

``` bash
MicroXRCEAgent udp4 -p 8888
```

终端 2：

``` bash
cd ~/px4_ws/external/PX4-Autopilot
make px4_sitl gz_x500
```

SITL 会自动启动 uXRCE-DDS client，并连接本机 UDP 8888。PX4 控制台应出现 data writer 创建信息；Agent 终端也应显示 client 和 publisher 已建立。

在 PX4 控制台检查 client 状态：

``` text
uxrce_dds_client status
```

### 8.5 验证 ROS 2 通信

终端 3：

``` bash
source /opt/ros/humble/setup.bash
source ~/px4_ws/ros2_ws/install/setup.bash
ros2 topic list | grep '^/fmu/'
ros2 topic info /fmu/out/vehicle_status --verbose
ros2 topic echo /fmu/out/vehicle_status
ros2 topic hz /fmu/out/vehicle_status
```

看到 `/fmu/in/*` 和 `/fmu/out/*` 只说明 DDS discovery 已经建立。还必须确认：

- `topic info --verbose` 中存在发布端和订阅端，QoS 符合预期；
- `topic echo` 能解析消息，证明 `px4_msgs` 已构建并正确 source；
- `topic hz` 有稳定频率；
- 停止 Agent 后话题数据中断，重新启动后能按预期恢复。

### 8.6 可选：桥接 Gazebo 仿真时间

只有 ROS 2 节点需要使用 Gazebo `/clock` 时才添加桥接：

``` bash
ros2 run ros_gz_bridge parameter_bridge \
  '/clock@rosgraph_msgs/msg/Clock[gz.msgs.Clock'
```

使用 Gazebo `/clock` 时，相关 ROS 2 节点应设置 `use_sim_time: true`，并按 PX4 v1.16 官方说明评估是否关闭 `UXRCE_DDS_SYNCT`。不要同时使用两个未经确认的时间源。

------------------------------------------------------------------------

## 9. WSL2 特殊配置

### 禁止 Windows PATH 注入

编辑：

``` bash
sudo nano /etc/wsl.conf
```

添加：

``` ini
[interop]
enabled=true
appendWindowsPath=false
```

重启：

``` powershell
wsl --shutdown
```

验证：

``` bash
echo "$PATH" | tr ':' '\n'
```

不应出现：

``` text
/mnt/e/Python/Anaconda
/mnt/c/Windows
```

------------------------------------------------------------------------

## 10. Protobuf 冲突排查

### 错误现象

Gazebo Harmonic 编译可能出现：

``` text
This file was generated by a newer version of protoc
which is incompatible with your Protocol Buffer headers
```

------------------------------------------------------------------------

### 正确判断

不要直接升级 protobuf。

Ubuntu 22.04 默认：

``` text
protoc:
3.12.4

protobuf headers:
3.12.4
```

通常与：

``` text
gz-msgs10
```

匹配。

------------------------------------------------------------------------

### 检查

``` bash
which protoc
protoc --version

pkg-config --modversion protobuf
```

查看实际头文件：

``` bash
echo | c++ -dM -E -x c++ \
-include google/protobuf/stubs/common.h - \
| grep GOOGLE_PROTOBUF
```

------------------------------------------------------------------------

### 常见根因

WSL 自动加入 Windows PATH：

``` text
/mnt/e/Python/Anaconda/Library/include/google/protobuf
```

导致：

``` text
Linux Gazebo headers
+
Windows Anaconda protobuf headers
=
版本冲突
```

------------------------------------------------------------------------

### 修复

删除 PX4 构建缓存：

``` bash
rm -rf build/px4_sitl_default
```

重新：

``` bash
make px4_sitl gz_x500
```

------------------------------------------------------------------------

## 11. 常见问题

### Gazebo command not found

``` bash
sudo apt update
sudo apt install gazebo11 libgazebo11-dev
```

------------------------------------------------------------------------

### PX4 target 不存在

查看：

Classic:

``` bash
make px4_sitl list_vmd_make_targets | grep gazebo-classic
```

Harmonic:

``` bash
make px4_sitl list_vmd_make_targets | grep gz_
```

------------------------------------------------------------------------

### 仿真卡死

查看：

``` bash
ps aux | grep -E 'px4|gazebo|gzserver|gzclient'
```

清理：

``` bash
pkill -f px4
pkill -f gzserver
pkill -f gzclient
```

------------------------------------------------------------------------

## 12. QGroundControl

启动 SITL 后：

默认：

``` text
QGroundControl:
UDP 14550

Offboard:
UDP 14540

Micro XRCE-DDS:
UDP 8888
```

------------------------------------------------------------------------

## 13. 推荐启动流程

### Ubuntu 20.04 遗留环境

仅用于复现已经验证的 Foxy + Gazebo Classic 工程，不再作为新环境模板。

终端1：

``` bash
MicroXRCEAgent udp4 -p 8888
```

终端2：

``` bash
make px4_sitl gazebo-classic
```

终端3：

``` bash
ros2 topic list
```

------------------------------------------------------------------------

### Ubuntu 22.04 WSL2

终端1：

``` bash
MicroXRCEAgent udp4 -p 8888
```

终端2：

``` bash
make px4_sitl gz_x500
```

终端3：

``` bash
source /opt/ros/humble/setup.bash
source ~/px4_ws/ros2_ws/install/setup.bash
ros2 topic list | grep '^/fmu/'
ros2 topic info /fmu/out/vehicle_status --verbose
ros2 topic hz /fmu/out/vehicle_status
```

------------------------------------------------------------------------

## 14. 最终结论

主线环境：

  系统           Gazebo              PX4启动命令
  -------------- ------------------- --------------------------------
  Ubuntu 22.04   Gazebo Harmonic     `make px4_sitl gz_x500`

Ubuntu 20.04 + Gazebo Classic 11 只用于维护遗留工程，启动命令为 `make px4_sitl gazebo-classic`。

核心原则：

-   不混用 Gazebo Classic 与 Gazebo Harmonic
-   不混用 Humble 默认的 Fortress bridge 与 PX4 所需的 Harmonic bridge
-   不混用不同 Ubuntu 版本生成的 PX4 build
-   PX4 v1.16 固件配套使用 `px4_msgs` `release/1.16` 和 Micro XRCE-DDS Agent v2.4.3
-   WSL2 禁止 Windows PATH 污染 Linux 编译环境
-   protobuf 问题优先检查路径，而不是升级软件包

官方依据：

-   [PX4 v1.16 ROS 2 User Guide](https://docs.px4.io/v1.16/en/ros2/user_guide)
-   [Gazebo：ROS 2 与 Gazebo 版本配对](https://gazebosim.org/docs/harmonic/ros_installation/)
-   [PX4/px4_msgs 版本兼容说明](https://github.com/PX4/px4_msgs)
-   [eProsima Micro XRCE-DDS Agent](https://github.com/eProsima/Micro-XRCE-DDS-Agent/tree/v2.4.3)
