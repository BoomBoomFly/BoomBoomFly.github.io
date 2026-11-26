---
title: "51 单片机与 STM32F103C8T6 嵌入式零基础学习路线"
description: "从 51 单片机基础过渡到 STM32F103C8T6 与 HAL 开发的嵌入式学习路线。"
editUrl: false
---

路径位置：[总览](/knowledge/tools/learning-paths/) → 嵌入式 → [Git](/knowledge/tools/learning-paths/git/)

### 硬件与工具基线

- 51 入门：51 系列开发板，配合[江协科技 51 教程](https://www.bilibili.com/video/BV1Mb411e7re/)（[主页](https://space.bilibili.com/383400717)）。
- STM32 主线：STM32F103C8T6 最小系统板 + ST-LINK（SWD）+ STM32CubeIDE + STM32CubeF1 HAL，配合[江协科技 STM32 教程](https://www.bilibili.com/video/BV1th411z7sn/)。

51 开发板多为 5 V 逻辑，STM32F103C8T6 GPIO 通常是 3.3 V。互连前先核对原理图和数据手册，不要把未经确认的 5 V 信号直接接到 STM32 引脚。

### 阶段安排

| 阶段 | 核心内容 |
| --- | --- |
| 1. C 语言与电路基础 | 指针、位运算、结构体、`volatile`；电平、上拉下拉、限流电阻、万用表测通断与电压 |
| 2. 51 快速上手 | 建工程、下载程序、LED、按键、外部中断、定时器、串口，再选一个外设（如数码管或 I²C 器件）跑通 |
| 3. STM32CubeIDE 与 HAL | 用 `.ioc` 配置时钟和引脚，读懂 `HAL_Init()`、`SystemClock_Config()` 和 `MX_*_Init()`；知道用户代码写在哪块 `USER CODE` 区域里 |
| 4. 常用外设 | GPIO、EXTI 回调、定时器中断、PWM、ADC 采样、UART 收发、I²C / SPI 通信 |
| 5. 调试与排错 | ST-LINK 单步断点、查看外设寄存器和变量；用串口打印状态；区分阻塞、轮询与中断 |

视频里如果用了标准库，看懂外设原理后在 CubeIDE 里用 HAL 重写一遍，不要把两套工程文件混在一起。

### 参考资料

- [STM32CubeIDE 快速入门手册](https://www.st.com/resource/en/user_manual/um2553-stm32cubeide-quick-start-guide-stmicroelectronics.pdf)
- [UM1850：STM32F1 HAL 与 LL 驱动说明](https://www.st.com/resource/en/user_manual/um1850-description-of-stm32f1-hal-and-lowlayer-drivers-stmicroelectronics.pdf)
- [STM32F103C8 产品页](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html)
- [STM32F103x8/B 数据手册](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- [RM0008 STM32F1 参考手册](https://www.st.com/resource/en/reference_manual/cd00171190.pdf)
