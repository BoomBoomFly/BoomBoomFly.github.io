---
title: "C++ 机器人开发学习路线"
description: "面向机器人、ROS 2 与 PX4 开发的现代 C++ 学习路线。"
editUrl: false
---

> 推荐路径位置 3/6：[学习路线总览](/knowledge/tools/learning-paths/) → [Git](/knowledge/tools/learning-paths/git/) → **C++（当前）** → [Linux](/knowledge/tools/learning-paths/linux/)。可按已有基础和项目需要跳转。

> 本路线面向准备继续学习 ROS 2、PX4 或嵌入式软件的读者，以现代 C++、工程能力和可靠性为主，不以刷算法题或背诵语言细节为目标。

### 这条路线要解决什么问题

走完主线后，应该能够：

1. 独立编译、运行和调试一个多文件 C++ 工程；
2. 正确使用值、引用、指针、`const` 和常见标准库容器；
3. 理解对象生命周期、RAII、智能指针和移动语义；
4. 使用类和组合拆分程序，而不是把所有逻辑写进 `main()`；
5. 用 CMake 组织库、可执行程序和测试；
6. 使用编译警告、调试器、Sanitizer 和单元测试定位问题；
7. 阅读 ROS 2 `rclcpp` 节点和 PX4 模块中的常见 C++ 写法；
8. 写出职责清晰、资源安全、可以由别人继续维护的代码。

### 学习基线

- 基准标准：C++17；
- 编译器：GCC 或 Clang；
- 构建：CMake，优先使用 target-based 写法；
- 测试：GoogleTest；
- 调试：GDB 或 IDE 调试器；
- 静态检查：编译器警告、`clang-tidy`；
- 动态检查：AddressSanitizer、UndefinedBehaviorSanitizer；
- 版本管理：Git。

C++17 是这份入门路线的统一基线，不代表所有项目都必须修改为 C++17。进入现有仓库后，应服从仓库的编译标准、工具链和代码规范，不自行提高标准版本或引入新依赖。

### 学习原则

1. **每个概念都写代码验证。** 只看语法介绍不能形成生命周期和类型系统直觉。
2. **警告就是待处理问题。** 学习代码使用较严格警告，并解释每个警告的原因。
3. **先用标准库。** 入门阶段不手写字符串、动态数组、智能指针或线程池。
4. **先写清所有权。** 每个指针和资源都要能回答“谁拥有、活多久、谁释放”。
5. **先测纯逻辑。** 把计算和状态机从 I/O、ROS 回调及硬件接口中分离出来。
6. **先读错误，再改代码。** 保留最小复现、错误信息和验证结果。
7. **小步提交。** 一次提交只表达一个完整变化，保证能够编译和测试。

### 路线总览

| 阶段 | 核心问题 | 通过标准 |
| --- | --- | --- |
| 0. 工具链 | 代码如何变成可执行程序？ | 能独立编译、运行和断点调试 |
| 1. 语言基础 | 值、类型、函数怎样工作？ | 输入异常时行为明确 |
| 2. 标准库 | 怎样安全管理一组数据？ | 会选择容器，不手写重复轮子 |
| 3. 类与模块 | 怎样划分职责和接口？ | 头文件和实现分离，职责清楚 |
| 4. 生命周期 | 资源由谁拥有和释放？ | 无泄漏、悬空指针和重复释放 |
| 5. 泛型与回调 | 怎样复用算法和表达行为？ | 能解释类型推导和捕获生命周期 |
| 6. 可靠性 | 怎样证明代码在边界上仍正确？ | 正常、边界和异常路径都有测试 |
| 7. 工程构建 | 怎样组织可维护工程？ | 可从干净目录构建和测试 |
| 8. 并发基础 | 回调同时发生时怎样保证正确？ | 能识别数据竞争和死锁风险 |
| 9. 机器人代码 | 怎样读写 ROS 2/PX4 风格代码？ | 能解释接口、所有权、线程和测试 |

### 阶段推进规则

- 阶段 0～2 建立工具链、语言基础和标准库能力，通过验收后再进入类与资源管理。
- 阶段 3～5 聚焦接口、生命周期和通用代码，通过验收后再进入可靠性、构建与并发。
- 阶段 6～8 聚焦测试、工程构建和并发能力。
- 已经掌握某项内容时，可以直接完成对应阶段的验收；不能仅凭“以前学过”跳过。

### 阶段 0：工具链和程序结构

#### 要掌握的内容

- 源文件、头文件、目标文件、静态库、动态库和可执行文件；
- 预处理、编译和链接的大致过程；
- 编译错误、链接错误、运行错误和逻辑错误的区别；
- Debug 与 Release 构建；
- 终端参数、退出码、标准输入、标准输出和标准错误；
- Git 的 `status`、`diff`、`add`、`commit` 和分支基础。

#### 推荐编译警告

```bash
g++ -std=c++17 -Wall -Wextra -Wpedantic -Wconversion -g main.cpp statistics.cpp -o statistics
```

现有项目已有警告策略时，以项目设置为准，不在全仓库盲目开启导致大量无关变化。

#### 通过标准

- 能从错误信息定位到文件和行；
- 能解释声明与定义、编译与链接的区别；
- 能在断点处查看调用栈、局部变量和参数。

### 阶段 1：语言基础

#### 要掌握的内容

- 整数、浮点数、布尔值、字符和枚举；
- 初始化、作用域、生命周期和类型转换；
- `if`、`switch`、循环和提前返回；
- 函数声明、定义、参数和返回值；
- 值传递、引用传递、`const` 引用；
- `struct`、`enum class` 和简单数据模型；
- 浮点比较、单位和数值范围。

#### 通过标准

能解释每个变量的类型、范围、单位和所有权，不依赖隐式类型转换碰运气。

### 阶段 2：标准库容器和算法

#### 要掌握的内容

- `std::string`、`std::array`、`std::vector`；
- `std::map`、`std::unordered_map` 的基本使用和选择差异；
- 迭代器、范围 `for`、`<algorithm>` 和 lambda；
- `std::optional` 表达“可能没有值”；
- `std::variant` 表达有限的多种状态；
- 容器失效规则和越界访问风险。

#### 通过标准

- 能根据访问方式和数据规模选择容器；
- 能用标准算法表达查找、转换和聚合；
- 能说明哪些操作会使引用或迭代器失效。

### 阶段 3：类、接口和模块化

#### 要掌握的内容

- 类的职责、封装、构造函数和析构函数；
- 成员初始化列表、`const` 成员函数；
- 组合优先于继承；
- 纯虚接口的适用场景；
- 头文件保护、前置声明和命名空间；
- 公开接口与实现细节；
- 依赖方向和最小可见性。

#### 通过标准

- 每个类能用一句话说明职责；
- 修改输出格式不会影响统计算法；
- 测试核心逻辑不需要真实文件、网络或 ROS 节点。

### 阶段 4：生命周期、所有权和 RAII

#### 要掌握的内容

- 自动存储期与动态存储期；
- 引用、裸指针和智能指针分别表达什么；
- `std::unique_ptr` 与独占所有权；
- `std::shared_ptr` 与共享所有权的成本；
- `std::weak_ptr` 与循环引用；
- RAII：用对象生命周期管理文件、锁和其他资源；
- 拷贝构造、移动构造、拷贝/移动赋值；
- Rule of Zero，必要时再考虑 Rule of Five；
- 悬空引用、重复释放和 use-after-free。

#### 通过标准

看到函数参数或成员中的指针时，能够说明：

- 是否允许为空；
- 是否拥有对象；
- 对象至少需要活到什么时候；
- 调用结束后是否保留引用；
- 是否存在并发访问。

### 阶段 5：模板、lambda 和回调

#### 要掌握的内容

- 函数模板和类模板的基本语法；
- 类型推导、`auto` 和 `decltype` 的常见用途；
- lambda 的值捕获、引用捕获和生命周期；
- `std::function` 的用途和额外成本；
- 模板代码放在头文件中的常见原因；
- 编译错误中定位真正的模板实例化位置。

#### 通过标准

能在普通函数、模板、lambda 和 `std::function` 之间选择最简单且职责清楚的表达方式。

### 阶段 6：错误处理、测试与调试

#### 要掌握的内容

- 输入校验、前置条件和不变量；
- 返回状态、`std::optional` 和异常的适用场景；
- 不吞掉错误，不用日志代替错误处理；
- 单元测试、集成测试和端到端测试的区别；
- 等价类、边界值和失败路径；
- AddressSanitizer 与 UndefinedBehaviorSanitizer；
- 编译器警告、`clang-tidy` 和格式化工具。

#### 通过标准

- 缺陷修复前先有能失败的测试；
- 修复后测试通过，Sanitizer 没有相关报告；
- 能说明为什么测试覆盖了风险，而不只报告“测试全绿”。

### 阶段 7：CMake 和工程化

#### 要掌握的内容

- `project()`、target、源文件和 include 目录；
- `add_library()`、`add_executable()`、`target_link_libraries()`；
- `PRIVATE`、`PUBLIC`、`INTERFACE` 的传播关系；
- target 级编译特性、警告和定义；
- Debug/Release 配置与 out-of-source build；
- CTest 与 GoogleTest；
- 安装、导出和第三方依赖只学项目需要的最小部分。

#### 推荐工程结构

```text
telemetry_project/
├── CMakeLists.txt
├── include/telemetry/
├── src/
├── app/
├── test/
└── README.md
```

#### 通过标准

- 不依赖 IDE 中未记录的手工设置；
- 库和应用的依赖方向正确；
- 克隆项目的人按 README 能完成构建与测试。

### 阶段 8：并发和回调基础

#### 要掌握的内容

- 线程与进程的基本区别；
- `std::thread`、`std::mutex`、`std::lock_guard`；
- `std::condition_variable`；
- 原子类型的基本用途和限制；
- 数据竞争、死锁、饥饿和锁粒度；
- 共享可变状态为什么难维护；
- 回调是否会并发、阻塞或访问已销毁对象。

#### 通过标准

- 能画出线程、共享数据和锁的关系；
- 能解释停止流程，不通过强制终止线程收尾；
- 知道何时不应该增加多线程。

### 阶段 9：进入 ROS 2 和 PX4 代码

#### ROS 2 中重点识别

- `rclcpp::Node`、publisher、subscription、service、action；
- 回调、lambda 捕获和 `std::bind`；
- `SharedPtr` 的所有权和消息生命周期；
- timer、executor 和 callback group；
- `package.xml`、`CMakeLists.txt` 与 ament；
- 节点接口与纯算法如何分离。

#### PX4 中重点识别

- 模块入口、任务和 Work Queue；
- uORB 订阅/发布；
- 参数对象、日志宏和错误返回；
- 固定容量容器、实时约束和避免动态分配的场景；
- 板端代码与 SITL 代码的共同接口。

完成 C++ 主线后，可以继续 [Linux 工程实践学习路线](/knowledge/tools/learning-paths/linux/)，也可以在满足前置能力时直接进入 [ROS 2 机器人开发学习路线](/knowledge/tools/learning-paths/ros2/) 或 [PX4 无人机学习路线](/knowledge/tools/learning-paths/px4/)。

### 自检问题

完成主线后，应能不用搜索直接回答：

1. 引用和指针有什么区别，何时允许为空？
2. 为什么优先使用 RAII 和 Rule of Zero？
3. `unique_ptr` 与 `shared_ptr` 分别表达什么所有权？
4. 哪些 `vector` 操作可能使引用和迭代器失效？
5. lambda 按引用捕获可能产生什么生命周期问题？
6. 编译错误和链接错误怎样区分？
7. CMake 中 `PUBLIC`、`PRIVATE` 和 `INTERFACE` 有什么影响？
8. 怎样为一个状态机设计边界和失败测试？
9. 两个回调同时修改同一对象会发生什么？
10. 为什么不是所有 ROS 2 对象都应该使用 `shared_ptr`？

### 提交和代码审查清单

- [ ] 能从干净目录完成构建；
- [ ] 编译警告已处理；
- [ ] 没有无理由的裸 `new`/`delete`；
- [ ] 所有权和空值语义清楚；
- [ ] 接口有单位、范围和错误约定；
- [ ] 纯逻辑与 I/O 分离；
- [ ] 正常、边界和失败路径有测试；
- [ ] Sanitizer 或等效检查已运行；
- [ ] README 包含环境、命令和结果；
- [ ] 提交中没有生成目录、临时文件和无关格式化。

### 参考资料

- [菜鸟教程](https://www.runoob.com/)：C++ 中文入门参考
- [Standard C++：学习与标准资料入口](https://isocpp.org/get-started)
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
- [CMake 官方教程](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)
- [GoogleTest User's Guide](https://google.github.io/googletest/)
- [GCC Warning Options](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html)
- [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)
- [Clang UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html)
- [clang-tidy 官方文档](https://clang.llvm.org/extra/clang-tidy/)
- [ROS 2 Humble C++ Publisher/Subscriber 教程](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Publisher-And-Subscriber.html)
- [PX4 v1.16 Hello Sky](https://docs.px4.io/v1.16/en/modules/hello_sky)
