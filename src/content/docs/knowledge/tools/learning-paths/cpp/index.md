---
title: "C++ 机器人开发学习路线"
description: "面向机器人、ROS 2 与 PX4 开发的现代 C++ 学习路线。"
editUrl: false
---

路径位置：[总览](/knowledge/tools/learning-paths/) → [Git](/knowledge/tools/learning-paths/git/) → C++ → [Linux](/knowledge/tools/learning-paths/linux/)

### 基线工具

- 标准与编译器：C++17，GCC 或 Clang
- 构建与测试：CMake（target-based）、GoogleTest
- 调试与检查：GDB、`clang-tidy`、AddressSanitizer、UndefinedBehaviorSanitizer

进现有仓库时按仓库自己的 C++ 标准和告警策略来，不擅自升版本。

平时练习建议开严一点的编译警告：

```bash
g++ -std=c++17 -Wall -Wextra -Wpedantic -Wconversion -g main.cpp statistics.cpp -o statistics
```

### 阶段安排

| 阶段 | 核心内容 |
| --- | --- |
| 1. 工具链与语法 | 头文件/源文件、编译链接过程、Debug/Release；值、引用、`const`、`struct`、`enum class` |
| 2. 标准库 | `std::vector`、`std::string`、`std::array`、`std::unordered_map`、`std::optional` 和 `<algorithm>`，先用标准库不重复造轮子 |
| 3. 类与生命周期 | 头文件和实现分离；RAII、`std::unique_ptr` / `std::shared_ptr`、移动语义，明确每个资源由谁持有和释放 |
| 4. 泛型与回调 | 函数模板、lambda 捕获列表（尤其注意悬空引用） |
| 5. CMake 与测试 | 用 CMake 组织库、可执行文件和 GoogleTest；用 ASan / UBSan 查越界和未定义行为 |
| 6. 并发与机器人代码 | `std::thread`、`std::mutex`、`std::atomic`；能读懂 ROS 2 `rclcpp` 节点和 PX4 模块代码 |

### 机器人工程分层与错误处理约定

- **纯 C++ 核心与 ROS 解耦**：算法、状态机与协议编解码库尽量不直接依赖 `rclcpp`，便于用 GoogleTest 在主机端独立编译测试（详见 [PX4 + ROS 2 Offboard 与 External Mode 架构指南](/knowledge/research/flight-control/px4-ros2-offboard-architecture/)）。
- **现代 CMake 目标传播**：用 `PUBLIC` / `PRIVATE` / `INTERFACE` 精确声明目标间依赖与头文件搜索路径（配合 `$<BUILD_INTERFACE:...>` / `$<INSTALL_INTERFACE:...>`），统一 C++17 编译标准。
- **明确错误语义**：失败原因重要时优先返回带 `[[nodiscard]]` 标注的 `Status` / `StatusOr<T>`，避免只打印日志而不处理错误；在高频控制循环中避免动态内存分配与异常跨循环传播。
- **离线单测防“假通过”**：修改生产代码后必须先重新编译目标再运行 `ctest`（CTest 不会自动重编），并核对测试输出非 `Running 0 tests`。

### 通关自检清单

- 能组织“库（`core`）+ 可执行程序 + GoogleTest 单元测试”的 CMake 工程，并在开启 `-Wall -Wextra -Wpedantic` 与 ASan/UBSan 下通过测试；
- 能清晰说明 RAII、`unique_ptr` / `shared_ptr` 所有权边界及 lambda 捕获引起的悬空引用风险；
- 可衔接 [Linux 工程实践学习路线](/knowledge/tools/learning-paths/linux/) 与 [具身机器人全栈实战路线](/knowledge/tools/learning-paths/embodied-robotics/)（阶段 1 差速计算器实践）。

### 参考资料

- [Standard C++ 入门入口](https://isocpp.org/get-started)
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
- [CMake 官方教程](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)
- [GoogleTest User's Guide](https://google.github.io/googletest/)
- [GCC Warning Options](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html)
- [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)
- [Clang UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html)
- [clang-tidy 官方文档](https://clang.llvm.org/extra/clang-tidy/)
- [ROS 2 Humble C++ Publisher/Subscriber](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Publisher-And-Subscriber.html)
- [PX4 v1.16 Hello Sky](https://docs.px4.io/v1.16/en/modules/hello_sky)
- [菜鸟教程](https://www.runoob.com/)
