// 远程控制开关
// 构造远程控制开关命令
function setRemote(state) {
    if (state === 'on') {
        // 01 06 00 00 00 01 48 0A
        const command = [
            0x01,  // 设备地址
            0x06,  // 功能码 (写单个寄存器)
            0x00, 0x00,  // 寄存器地址
            0x00, 0x01,  // 写入值 (1 = 打开)
            0x48, 0x0A   // CRC校验码
        ];
        return Buffer.from(command);
    } else if (state === 'off') {
        // 01 06 00 00 00 00 89 CA
        const command = [
            0x01,  // 设备地址
            0x06,  // 功能码 (写单个寄存器)
            0x00, 0x00,  // 寄存器地址
            0x00, 0x00,  // 写入值 (0 = 关闭)
            0x89, 0xCA   // CRC校验码
        ];
        return Buffer.from(command);
    } else {
        throw new Error("参数必须是 'on' 或 'off'");
    }
}

// 导出函数
export { setRemote };