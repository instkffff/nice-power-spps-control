// 电源输出状态

// 构造电源输出状态控制命令
function setOutput(state) {
    if (state === 'on') {
        // 01 06 00 1B 00 01 38 0D
        const command = [
            0x01,  // 设备地址
            0x06,  // 功能码 (写单个寄存器)
            0x00, 0x1B,  // 寄存器地址
            0x00, 0x01,  // 写入值 (1 = 打开)
            0x38, 0x0D   // CRC校验码
        ];
        return Buffer.from(command);
    } else if (state === 'off') {
        // 01 06 00 1B 00 00 F9 CD
        const command = [
            0x01,  // 设备地址
            0x06,  // 功能码 (写单个寄存器)
            0x00, 0x1B,  // 寄存器地址
            0x00, 0x00,  // 写入值 (0 = 关闭)
            0xF9, 0xCD   // CRC校验码
        ];
        return Buffer.from(command);
    } else {
        throw new Error("参数必须是 'on' 或 'off'");
    }
}

// 导出函数
export { setOutput };