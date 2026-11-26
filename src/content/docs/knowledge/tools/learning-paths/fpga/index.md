---
title: "FPGA 零基础学习路线"
description: "覆盖数字电路、Verilog、时序、接口与 HLS 的 FPGA 入门路线。"
editUrl: false
---

选读路线：[学习路线总览](/knowledge/tools/learning-paths/) → FPGA

### 工具链选择

先按手头的板子确定工具链：AMD/Xilinx 用 Vivado（约束文件为 XDC），Intel/Altera 用 Quartus（QSF / SDC）。要做 HLS 主线优先选支持 Vitis HLS 的 AMD/Xilinx 器件；Intel HLS Compiler 已停更，不作为入门工具。

### 阶段安排

| 阶段 | 核心内容 |
| --- | --- |
| 1. 数字电路与 Verilog | 组合逻辑、时序逻辑、触发器与状态机；阻塞与非阻塞赋值，写 Testbench 看波形仿真 |
| 2. 工具链与上板 | 综合、实现、引脚与时钟约束、下载比特流、ILA / SignalTap 片上抓取波形 |
| 3. 常用接口 | 按键消抖、UART、SPI / I²C、FIFO 缓冲与基础 AXI-Stream |
| 4. 时序与跨时钟域 | 读懂建立/保持时间报告；单比特两级触发器同步、多比特用异步 FIFO 或握手 |
| 5. HLS（AMD/Xilinx） | 用 Vitis HLS 把小型 C/C++ 算法转为 RTL，跑通 C 仿真、C/RTL 协同仿真，分析延迟与 II 并集成到 Vivado |

### 参考资料

- [AMD Vivado Design Suite 入门文档](https://docs.amd.com/r/2025.2-English/ug910-vivado-getting-started/Vivado-Design-Suite-Overview)
- [AMD Vitis HLS 用户指南 UG1399](https://docs.amd.com/r/2025.1-English/ug1399-vitis-hls)
- [AMD Vitis HLS 入门教程](https://docs.amd.com/r/2025.2-English/Vitis-Tutorials-Getting-Started/Vitis-HLS)
- [Intel Quartus Prime Pro Edition 入门指南](https://www.intel.com/content/www/us/en/docs/programmable/683463/25-1.html)
- [Intel HLS Compiler 停止通知 PDN2404](https://www.intel.com/content/www/us/en/content-details/820203/pdn2404-altera-is-discontinuing-selected-hls-compiler-software-ordering-codes.html)
- [Intel oneAPI FPGA Support Package](https://www.intel.com/content/www/us/en/developer/tools/oneapi/fpga.html)
