---
title: "Git 零基础学习路线"
description: "面向零基础读者的 Git 本地版本管理、分支与远程协作路线。"
editUrl: false
---

路径位置：[总览](/knowledge/tools/learning-paths/) → [嵌入式](/knowledge/tools/learning-paths/embedded/) → Git → [C++](/knowledge/tools/learning-paths/cpp/)

### 安装与初始配置

Windows 从 [Git 官网](https://git-scm.com/) 安装，Ubuntu 运行 `sudo apt install git`。装完先配置作者信息：

```bash
git --version
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global --list
```

不要把令牌、密码或私钥写进仓库或笔记。

### 基本数据流

```text
工作区 --git add--> 暂存区 --git commit--> 本地分支 --git push--> 远程仓库
远程仓库 --git fetch--> 远程跟踪分支 --merge / rebase--> 本地分支
```

### 阶段安排

| 阶段 | 核心命令与概念 |
| --- | --- |
| 1. 本地提交 | `init`、`status`、`diff`、`add`、`commit`、`log`，写好 `.gitignore` 过滤编译产物和密钥 |
| 2. 撤销与回退 | `restore` 撤销工作区或暂存区改动，`revert` 安全撤销已推送的提交；不确定前先停手看 `git status` 和 `git reflog`，别乱用 `reset --hard` |
| 3. 分支与冲突 | `switch -c`、`merge`、看懂 `<<<<<<<` 冲突标记并手动合并后再提交 |
| 4. 远程协作 | `clone`、`fetch`、`pull`、`push`，用功能分支提交 Pull Request 做代码评审 |

### 参考资料

- [Git 官方安装说明](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)
- [Pro Git 简体中文版](https://git-scm.com/book/zh/v2.html)
- [Learn Git Branching 中文版](https://learngitbranching.js.org/?locale=zh_CN)
- [菜鸟教程](https://www.runoob.com/)
