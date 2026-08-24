---
title: "Git 的安装、配置与学习入口"
description: "Git 安装、身份配置与学习入口。"
editUrl: false
---

:::caution[历史资料]
本页来自旧站，仅用于既有设备或环境复现。内容未按当前软硬件版本全面复核，操作前请先核对官方文档与实验环境。
:::

> Author: CGC

### Windows
可从 [Git 官方网站](https://git-scm.com/) 下载。
### Ubuntu
```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install git
```
## github账号的注册
进入 [GitHub](https://github.com/) 注册账号。
> 在此处要注意记住你注册时的用户名和邮箱

## git的配置
### 找到git命令行输入处
#### 方法1-Windows
在文件夹中右键，点击 `git bash` ，没有也没关系，很可能会没有
#### 方法2-Windows
按 `win+r` 后输入 `cmd` （在默认路径下呼出）\
或 在你的目标文件夹下点击上面的框，输入 `cmd` 然后回车可以在当前路径下呼出 `cmd` 
#### 方法3-Ubuntu
直接在终端中输入 `git` 命令即可

### 配置用户名
在命令行中输入
```bash
git config --global user.name "username"
```
> 此处 `username` 是自己的用户名

### 配置邮箱
在命令行中输入
```bash
git config --global user.email "username@email.com"
```
> 此处 `username@email.com` 是自己的邮箱

### 验证配置
在命令行中输入
```bash
git config --global --list 
```
> 输出内容可以检查你的配置信息是否争取，如有误可以回到前面的配置步骤进行更改

至此，git下载及配置完成

## git常用命令的学习
推荐使用 [Learn Git Branching 中文版](https://learngitbranching.js.org/?locale=zh_CN) 练习常用操作。

### 相关学习路线

- [Git 零基础学习路线](/knowledge/tools/learning-paths/git/)：从本地版本管理逐步学习分支与远程协作。
