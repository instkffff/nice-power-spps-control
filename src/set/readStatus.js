// 读取电源状态

// 构造读取电源状态命令
function readStatus() {
    // 01 03 00 1D 00 05 15 CF
    const command = [
        0x01,  // 设备地址
        0x03,  // 功能码 (读取保持寄存器)
        0x00, 0x1D,  // 起始寄存器地址
        0x00, 0x05,  // 读取寄存器数量
        0x15, 0xCF   // CRC校验码
    ];
    
    return Buffer.from(command);
}

// 导出函数
export { readStatus };