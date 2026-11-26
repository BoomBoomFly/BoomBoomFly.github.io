---
title: "Linux 工程实践学习路线"
description: "面向机器人与嵌入式开发的 Linux 系统、命令行和故障排查路线。"
editUrl: false
---

路径位置：[总览](/knowledge/tools/learning-paths/) → [C++](/knowledge/tools/learning-paths/cpp/) → Linux → [ROS 2](/knowledge/tools/learning-paths/ros2/)

### 环境基线

- 系统与工具：Ubuntu 22.04 LTS、Bash、systemd、APT/dpkg、OpenSSH
- 排查环境前先确认系统信息：

```bash
cat /etc/os-release
uname -r
echo "$SHELL"
```

命令行和网络基础可以在虚拟机或 WSL2 里练；碰到 USB、串口、显卡、局域网发现或 systemd 行为差异时，以原生 Ubuntu 为准。

### 阶段安排

| 阶段 | 核心内容 |
| --- | --- |
| 1. 文件与文本 | 路径、软硬链接、`grep` / `find` / `awk` / `sed`、管道与重定向、`man` |
| 2. 权限与环境 | 用户/组、`chmod` / `chown`、`sudo`、环境变量（`PATH`、`~/.bashrc`） |
| 3. 软件包与隔离 | `apt`、`dpkg`；Python 项目用 Conda 隔离环境 |
| 4. 进程与服务 | `ps`、`top` / `htop`、`kill` 信号、`systemctl`、`journalctl` 查日志 |
| 5. 网络与设备 | `ip`、`ss`、`ping`、`curl`、DNS 排查；挂载点、`/dev/ttyUSB*` 串口权限（`dialout` 组） |
| 6. 脚本与远程 | 基础 Bash 脚本（配合 `shellcheck` 检查）；SSH 密钥登录、`scp` / `rsync` 传文件 |

### 常用记录

#### Conda 环境

`conda create -n lab python` 创建环境，`conda activate lab` 进入，`conda install numpy` 装包，`conda list` 查看已装包，`conda deactivate` 退出，`conda env list` 列举环境。[Conda 文档](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)

#### Ubuntu 换源

修改 `/etc/apt/sources.list` 前先备份：

```bash
sudo cp -p /etc/apt/sources.list /etc/apt/sources.list.bak
```

改完运行 `sudo apt update`。不同 Ubuntu 版本发行代号不同（如 20.04 为 `focal`，22.04 为 `jammy`），核对后再替换。[Ubuntu 软件包文档](https://ubuntu.com/server/docs/how-to/software/package-management/) · [旧版工具记录](https://github.com/BoomBoomFly/BoomBoomFly.github.io/tree/6b0998609bcf215b3115710b9afe9bfc46b5c7d2/01常用开发工具)

### 参考资料

- [Ubuntu：Linux command line for beginners](https://ubuntu.com/desktop/docs/en/latest/tutorial/the-linux-command-line-for-beginners/)
- [Ubuntu Server documentation](https://ubuntu.com/server/docs/)
- [Ubuntu Server：Networking](https://ubuntu.com/server/docs/how-to/networking/)
- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/)
- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/)
- [systemd Manual Pages](https://www.freedesktop.org/software/systemd/man/latest/)
- [OpenSSH Manual Pages](https://www.openssh.org/manual.html)
- [Git Reference](https://git-scm.com/docs)
- [ShellCheck](https://www.shellcheck.net/)
- [菜鸟教程](https://www.runoob.com/)
