# 在上位机安装ACFly-Mavros
> Author: CGC


> 此为为Jetson配置Intel T265，以此为 Acfly-A9飞控提供定位
> 
> 官方参考教程：[realsense-ros](https://github.com/IntelRealSense/realsense-ros)     [acfly-mavros](https://github.com/CGC12123/acfly-mavros)

## ROS Wrapper
> T265使用所需的packages

### 安装 ROS 
>Install [ROS Kinetic](http://wiki.ros.org/kinetic/Installation/Ubuntu) on Ubuntu 16.04, [ROS Melodic](http://wiki.ros.org/melodic/Installation/Ubuntu) on Ubuntu 18.04, [ROS Noetic](http://wiki.ros.org/noetic/Installation/Ubuntu) on Ubuntu 20.04.
> [可参考autolabor的安装教程](http://www.autolabor.com.cn/book/ROSTutorials/chapter1/12-roskai-fa-gong-ju-an-zhuang/124-an-zhuang-ros.html)

### 安装realsense2_camera
realsense2_camera 可作为 ROS 发行版的 debian 软件包使用
```
sudo apt-get install ros-$ROS_DISTRO-realsense2-camera
```

## 安装mavros
```
sudo apt-get install python-catkin-tools python-rosinstall-generator -y
# 如果用的ROS版本是Noetic则使用
# sudo apt install python3-catkin-tools python3-rosinstall-generator python3-osrf-pycommon -y

# 需要替换你的ROS版本，且以下指令需要在同一个终端执行
source /opt/ros/${你的ROS版本}/setup.bash

# 因为acfly增加了自定义mavlink信息，若之前有通过二进制安装过mavros则需要卸载，没有则跳过
sudo apt purge ros-${ROS_DISTRO}-mavlink ros-${ROS_DISTRO}-mavros

# 构建ROS工作空间，可以自行修改路径
mkdir -p ~/acfly_ws/src && cd ~/acfly_ws
catkin init

# 下载mavlink和acfly-mavros
cd src
git clone -b release/${ROS_DISTRO}/mavlink/2022.1.5-1 https://gitee.com/LauZanMo/mavlink
git clone -b acfly-develop https://gitee.com/LauZanMo/acfly-mavros

# 安装依赖，如果rosdep update没执行则需要执行成功才能继续
cd .. && rosdep install --from-paths src --ignore-src -y

# 安装GeographicLib:
./src/acfly-mavros/mavros/scripts/install_geographiclib_datasets.sh
# 注意此处可能会报需要root权限（不会标error）出现后在前方加sudo即可

# 第一次编译请执行acfly提供的脚本
./src/acfly-mavros/update_custom_msg.sh
# 后续更改mavros源码只需要执行catkin build

# 每一次开启终端都需要设置环境变量
source devel/setup.bash
```

## 安装T265及相关包
```bash
cd ~/acfly_ws/src
git clone https://github.com/thien94/vision_to_mavros.git
git clone https://github.com/IntelRealSense/librealsense.git
cd ~/acfly_ws && catkin build
```

## 使用
```
# 第一个终端
# 打开t265
roslaunch realsense2_camera rs_t265.launch

# 第二个终端
# 添加权限
sudo chmod 777 /dev/ttyUSB0
roslaunch mavros acfly.launch fcu_url:=/dev/ttyUSB0:57600

# 第三个终端
# 此处需要先source前一步安装mavros工作空间中的setup.bash
source devel/setup.bash
roslaunch vision_to_mavros t265_tf_to_mavros.launch
```
或者单独写一个launch文件 `start_all.launch`
```xml
<launch>
  <include file="$(find realsense2_camera)/launch/rs_t265.launch" />
  <include file="$(find mavros)/launch/acfly.launch" />
  <include file="$(find vision_to_mavros)/launch/t265_tf_to_mavros.launch" />
</launch>
```
将文件放在新的ros包 `atart_all` 中 执行
```bash
roslaunch atart_all start_all.launch
```

> 请注意\
> `roslaunch mavros acfly.launch fcu_url:=/dev/ttyUSB0:57600`
> 中的 `fcu_url` 请修改为对应 mavlink 输出串口及波特率（也可以直接在launch文件中修改）

## 其他 使用指南
> acfly-mavros 作者提供了使用指南及二次开发指南\
> [使用指南](https://github.com/LauZanMo/acfly-mavros/blob/acfly-develop/acfly-mavros%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97.md)  
> [二次开发指南](https://github.com/LauZanMo/acfly-mavros/blob/acfly-develop/acfly-mavros%E4%BA%8C%E6%AC%A1%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.md)