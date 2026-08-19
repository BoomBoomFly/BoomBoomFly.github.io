---
title: "Git 零基础学习路线"
description: "面向零基础读者的 Git 本地版本管理、分支与远程协作路线。"
editUrl: false
---

> 推荐路径位置 2/6：[学习路线总览](/knowledge/tools/learning-paths/) → [嵌入式](/knowledge/tools/learning-paths/embedded/) → **Git（当前）** → [C++](/knowledge/tools/learning-paths/cpp/)。可按已有基础和项目需要跳转。

### 适用对象

这份路线面向没有命令行和版本管理经验的读者，不绑定某个编程语言，也不绑定 GitHub、GitLab 或其他远程仓库平台。

主线分为 4 个按依赖推进的阶段。完成当前阶段的验收后再进入下一阶段。走完整条路线后，应当能够管理本地修改，安全地撤销常见错误，使用分支完成小功能，并通过远程仓库参与一次基本协作。

### 学习目标

完成路线后，应当能够：

- 理解工作区、暂存区、本地仓库和远程仓库的关系
- 查看文件变化并创建含义清楚的提交
- 忽略不应进入仓库的临时文件和敏感信息
- 安全撤销未提交或误暂存的修改
- 创建、切换和合并功能分支
- 识别并解决简单的文本冲突
- 完成 `clone`、`pull`、`push` 和一次代码评审流程
- 在不确定时先停止操作和保留现场，不用破坏性命令碰运气

### 开始前准备

#### 软件

- Git 官方发行版
- 一个纯文本编辑器
- Windows PowerShell、Git Bash 或团队统一的终端

#### 安装后检查

```bash
git --version
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global --list
```

姓名和邮箱用于标识提交作者，不应照抄示例值。不要把访问令牌、密码或私钥写进 Git 配置示例、学习笔记或仓库。

### 先理解 Git 的数据流

```text
工作区 --git add--> 暂存区 --git commit--> 本地分支与提交
                                         |
                                         +-- git push --> 远程仓库

远程仓库 --git fetch--> 远程跟踪分支
远程跟踪分支 --merge / rebase / fast-forward--> 本地分支与提交
本地分支的检出结果 ------------------------------> 工作区
```

- 工作区：正在编辑的文件。
- 暂存区：准备放进下一次提交的修改。
- 本地分支与提交：本机已经形成的提交历史，以及当前分支指向的位置。
- 远程跟踪分支：本地记录的远程分支状态，例如 `origin/main`；只有 fetch 后才会更新。
- 远程仓库：用于备份和协作的共享仓库。

`git pull` 不是把远程文件直接复制到工作区。它先执行 fetch，再把选定的远程分支整合到当前本地分支。学习每条命令前，都要先说清楚它会影响哪个位置。

### 阶段 1：创建仓库与本地提交

#### 学习目标

- 能够创建或获取一个本地仓库
- 能够查看文件状态和具体变化
- 能够只提交本次任务需要的修改

#### 必学命令

```bash
git init
git status
git add <文件>
git commit -m "说明"
git log --oneline
git diff
git diff --staged
```

#### 验收标准

- 能解释未跟踪、已修改、已暂存和已提交四种状态
- 能在提交前说出本次提交会包含哪些内容
- `git status` 最终显示工作区干净
- `git log --oneline` 中至少有三个含义清楚的提交

### 阶段 2：忽略文件与安全撤销

#### 学习目标

- 能够用 `.gitignore` 排除可重新生成的文件
- 能够撤销工作区或暂存区中的普通错误
- 知道哪些高风险命令不能在不理解后果时使用

#### 必学内容

- 应提交：源代码、配置、构建说明、测试和必要文档
- 通常不提交：构建输出、缓存、编辑器临时文件、日志和本机路径配置
- 绝不提交：密码、令牌、私钥和其他凭据
- `.gitignore` 只负责忽略尚未被 Git 跟踪的文件

#### 必学命令

```bash
git status
git diff -- <文件>
git restore -p <文件>
git restore <文件>
git restore --staged <文件>
git rm <文件>
git mv <原路径> <新路径>
```

这些命令的风险不同：

- `git restore --staged <文件>` 只取消暂存，工作区内容仍然保留；
- `git restore -p <文件>` 逐块选择要放弃的修改；
- `git restore <文件>` 会用暂存区内容覆盖工作区，未提交且未另行保存的修改通常无法由 Git 找回；
- `git rm <文件>` 会删除工作区文件并暂存删除，不属于“撤销修改”；
- `git mv` 会移动文件并把结果加入暂存区，提交前仍要检查状态和差异。

执行会覆盖或删除内容的命令前，先运行 `git status` 和 `git diff -- <文件>`。如果不能确认哪些内容会丢失，先提交到临时分支、复制到仓库外的明确位置，或请熟悉当前仓库的人复核。

#### 安全红线

在没有确认影响范围或可靠备份时，不执行：

```text
git reset --hard
git clean -fd
git push --force
```

`git restore <文件>`、`git rm <文件>` 和覆盖式重定向虽然不在上面的命令列表中，也可能永久丢失未提交内容。它们只能用于目标和影响已经确认的文件。

看到陌生命令时，先运行 `git status`，保存错误信息并询问，不要连续尝试可能覆盖现场的命令。

#### 验收标准

- 临时构建文件不会进入提交
- 能区分“取消暂存”和“放弃文件修改”
- 能说明 `.gitignore` 为什么不能移除已经被跟踪的文件
- 能说出三类绝不能提交的敏感信息

### 阶段 3：分支、合并与冲突

#### 学习目标

- 能够在独立分支上完成小功能
- 能够把功能分支合并回主分支
- 能够解决简单的同一行文本冲突

#### 必学命令

```bash
git branch
git switch -c <分支名>
git switch <分支名>
git merge <分支名>
git status
```

#### 验收标准

- 能解释分支不是另一份手工复制的工程目录
- 能在操作前确认当前分支
- 能指出冲突双方的内容并说明最终选择
- 合并后文件无冲突标记，程序或文档仍能正常使用

### 阶段 4：远程仓库与协作

#### 学习目标

- 能够从远程仓库开始工作
- 能够同步他人的修改并推送自己的分支
- 能够发起一次合并请求或拉取请求并回应评审意见

#### 必学命令

```bash
git clone <仓库地址>
git remote -v
git pull
git push
git push -u origin <分支名>
```

#### 标准协作流程

1. 克隆目标仓库。
2. 阅读 README 和贡献要求。
3. 同步主分支。
4. 创建一个功能分支。
5. 完成小改动并自查差异。
6. 分阶段提交并推送功能分支。
7. 发起合并请求或拉取请求。
8. 根据评审意见继续提交修改。
9. 合并后同步本地主分支。

#### 验收标准

- 能区分本地分支与远程分支
- 能解释 `pull` 和 `push` 的方向
- 合并请求只包含本任务相关的修改
- 评审者可以根据说明验证修改
- 仓库中没有凭据、构建缓存或无关大文件

### 提交要求

一次合格提交应当：

- 只解决一个清楚的问题
- 提交前检查 `git diff` 或 `git diff --staged`
- 说明修改目的，避免只写 `update`、`fix` 或日期
- 不混入格式化、个人配置或无关文件
- 修改行为时同时更新必要文档或测试

示例：

```text
docs: 补充开发板烧录步骤
fix: 修正串口波特率配置
feat: 增加传感器离线提示
```

本路线不强制使用某一种提交前缀；清楚、真实、可追溯比格式更重要。

### 日常操作检查表

开始工作：

```bash
git status
git switch <主分支>
git pull --ff-only
git switch -c <功能分支>
```

`git pull --ff-only` 失败时，说明本地与远程历史需要进一步检查。保留现场并查看 `git status`、`git log --oneline --graph --decorate --all`，不要改用强制命令绕过。

准备提交：

```bash
git status
git diff
git add <本次需要的文件>
git diff --staged
git commit -m "清楚的说明"
```

准备协作：

```bash
git status
git push -u origin <功能分支>
```

命令只是检查表，不应在不理解当前仓库状态时机械执行。

### 与技术路线的衔接

Git 路线负责版本管理能力；C++、Linux、ROS 2、PX4 以及选读的 FPGA 路线只规定工程产物，不再重复讲解 Git 命令。完成四个阶段后，通常可以继续 [C++ 机器人开发学习路线](/knowledge/tools/learning-paths/cpp/)，也可以按项目需要从 [学习路线总览](/knowledge/tools/learning-paths/) 选择其他路线。

### 相关公开资料

- [Git 的安装、配置与学习入口](/knowledge/tools/git/)：用于补充 Git 安装、身份配置和入门练习入口。

### 参考资料

- [菜鸟教程](https://www.runoob.com/)：Git 中文入门参考
- [Git 官方安装说明](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)
- [Pro Git 简体中文版](https://git-scm.com/book/zh/v2.html)
- [Learn Git Branching 中文版](https://learngitbranching.js.org/?locale=zh_CN)
