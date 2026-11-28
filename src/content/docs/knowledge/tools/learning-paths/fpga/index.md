---
title: "FPGA 零基础学习路线"
description: "覆盖数字电路、Verilog、时序、接口与 HLS 的 FPGA 入门路线。"
editUrl: false
---

选读路线：[学习路线总览](/knowledge/tools/learning-paths/) → FPGA

### 工具链选择

先按手头的板子确定工具链：AMD/Xilinx 用 Vivado（约束文件为 XDC），Intel/Altera 用 Quartus（QSF / SDC），高云（Gowin）使用 Gowin 云源工具链与 `.cst`/`.sdc` 约束。要做 HLS 主线优先选支持 Vitis HLS 的 AMD/Xilinx 器件；Intel HLS Compiler 已停更，不作为入门工具。

### 阶段安排

| 阶段 | 核心内容 |
| --- | --- |
| 1. 数字电路与 Verilog | 组合逻辑、时序逻辑、触发器与三段式安全状态机（独热码、急停/超时优先恢复、带 `default` 防锁死）；阻塞与非阻塞赋值，写自检 Testbench 看波形仿真 |
| 2. 工具链与上板 | 综合、实现、引脚与时钟约束、下载比特流、ILA / SignalTap / GAO 片上抓取波形；软核协同工程保留镜像与位流哈希追溯 |
| 3. 常用接口 | 按键消抖、UART、SPI / I²C、FIFO 缓冲与基础 AXI-Stream / 以太网 UDP 数据通路 |
| 4. 时序与跨时钟域 | 读懂建立/保持时间报告（WNS/WHS）；单比特两级同步器或 Toggle/Req-Ack 握手，多比特流用格雷码异步 FIFO；不滥用 `false_path` 掩盖未同步路径 |
| 5. HLS（AMD/Xilinx） | 用 Vitis HLS 把小型 C/C++ 算法转为 RTL，跑通 C 仿真、C/RTL 协同仿真，优化 `pipeline II`、`array_partition`/`array_reshape`、`dataflow` 与 Zynq/PYNQ PS-PL DMA 协同并集成到 Vivado |

### 实板开源参考

- [TangPrimer-20K examples](https://github.com/sipeed/TangPrimer-20K-example)：Gowin 器件工程结构与外设/网络 bring-up 参考
- [Project F Explore](https://github.com/projf/projf-explore)：现代 Verilog / SystemVerilog 模块与仿真实践
- [FPGA 软硬件协同与时序设计指南](/knowledge/research/robotics-intelligence/fpga-hw-sw-codesign/)：三段式安全 FSM、FIFO/CDC 约束、STA 指标与 Vitis HLS/PYNQ 协同要点
- [具身机器人全栈实战路线](/knowledge/tools/learning-paths/embodied-robotics/)：查看阶段 4～8 的 RTL、Ethernet 与电机物理安全实作闭环

### 通关自检清单

- 能独立手写三段式安全状态机（含急停/超时最高优先级与 `default` 恢复态）及自检 Testbench，不靠肉眼看波形验收；
- 能区分综合估计时序与 PNR 后 STA 报告（WNS/WHS/WPWS），正确实现两级同步器与格雷码异步 FIFO，不滥用 `false_path`；
- 做算法加速时能跑通 Vitis HLS `csim → syn → cosim` 验证 `II=1` 流水线与数组分区/重塑，或完成 Zynq/PYNQ DMA 联调。

### 参考资料

- [AMD Vivado Design Suite 入门文档](https://docs.amd.com/r/2025.2-English/ug910-vivado-getting-started/Vivado-Design-Suite-Overview)
- [AMD Vitis HLS 用户指南 UG1399](https://docs.amd.com/r/2025.1-English/ug1399-vitis-hls)
- [AMD Vitis HLS 入门教程](https://docs.amd.com/r/2025.2-English/Vitis-Tutorials-Getting-Started/Vitis-HLS)
- [Intel Quartus Prime Pro Edition 入门指南](https://www.intel.com/content/www/us/en/docs/programmable/683463/25-1.html)
- [Intel HLS Compiler 停止通知 PDN2404](https://www.intel.com/content/www/us/en/content-details/820203/pdn2404-altera-is-discontinuing-selected-hls-compiler-software-ordering-codes.html)
- [Intel oneAPI FPGA Support Package](https://www.intel.com/content/www/us/en/developer/tools/oneapi/fpga.html)
