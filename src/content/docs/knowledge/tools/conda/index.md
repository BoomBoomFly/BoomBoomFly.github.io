---
title: "Conda 环境管理及常用指令"
description: "Conda 环境与软件包管理常用命令。"
editUrl: false
---

:::caution[历史资料]
本页来自旧站，仅用于既有设备或环境复现。内容未按当前软硬件版本全面复核，操作前请先核对官方文档与实验环境。
:::

> Author: CGC

### 创建环境
```
conda create -n name python=3.x
```
> name为环境名\
> 3.x为指定python版本

### 删除环境
```
conda remove -n name --all
```

### 激活环境
```
conda activate name
```

### 关闭环境 返回默认环境
```
conda deactivate name
```

### 查看当前有哪些环境
```
conda info -e
```
*或*
```
conda env list
```
## conda包管理
### 查看当前环境的包
```
conda list
```

### 安装指定package到当前环境
```
conda install package
```
> package 为所需包名字 可在后加入`==`指定版本或输入url指定安装源

*也可以使用pip等进行安装*

### 安装package到指定的环境
```
conda install -n name package
```

### 更新package
```
conda update -n name package
```

### 移除package
```
conda remove -n name package
```
*或*
```
conda uninstall package
```

## conda版本
### 更新conda版本
```
conda update conda
```

### 更新python版本
```
conda update python
```
> 假设当前环境是python 3.6 执行命令后conda会将python升级为3.6.x系列的当前最新版本

### 相关学习路线

- [Linux 工程实践学习路线](/knowledge/tools/learning-paths/linux/)：在 Linux 开发环境中理解软件包、路径和环境隔离。
