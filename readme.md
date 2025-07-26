# 电源控制软件

## 概述

这是一个基于 Node.js 的串口通信电源控制软件，用于通过串口控制电源设备的电压、电流、远程控制和输出开关等功能。

## 文件结构

```
software/
├── main.js              # 主程序文件
├── src/
│   ├── set/
│   │   ├── setA.js      # 设置电流值
│   │   ├── setV.js      # 设置电压值
│   │   ├── setRemote.js # 设置远程控制模式
│   │   ├── setOutput.js # 设置输出开关
│   │   └── readStatus.js# 读取设备状态
│   └── callback.js      # 响应解析
```

## 主要功能

### 串口操作

- `openPort(port)`: 打开指定串口
  - 默认配置: 9600波特率, 8数据位, 1停止位, 无校验
- `closePort()`: 关闭当前串口连接

### 电源控制命令

- `SetA(current)`: 设置电流值
- `SetV(voltage)`: 设置电压值
- `SetRemote(state)`: 设置远程控制模式 (开/关)
- `SetOutput(state)`: 设置输出开关 (开/关)
- `ReadStatus()`: 读取电源当前状态

### 通信机制

- 使用 Modbus RTU 协议进行通信
- 自动处理命令响应和超时
- 支持 CRC 校验验证

## 使用方法

```javascript
import { openPort, SetV, SetA, SetRemote, SetOutput, ReadStatus } from './main.js';

// 打开串口
await openPort('COM4');

// 设置电压为12V
await SetV(12);

// 设置电流为2A
await SetA(2);

// 启用远程控制
await SetRemote(1);

// 打开输出
await SetOutput(1);

// 读取状态
const status = await ReadStatus();

// 关闭串口
await closePort();
```

## 错误处理

程序包含完整的错误处理机制：
- 串口打开/关闭错误
- 命令响应超时 (3秒)
- 数据解析错误
- 串口未打开时的操作保护

## 注意事项

1. 确保串口设备已正确连接
2. 根据实际设备调整串口参数
3. 命令执行具有超时限制，避免程序阻塞
4. 所有操作均为异步，建议使用 async/await 处理
