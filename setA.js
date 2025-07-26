// setA.js
// 构造设置电流的Modbus命令
function setA(currentValue) {
    // 将浮点数转换为IEEE 754字节数组
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, currentValue, false); // 大端序

    // 构造命令
    const command = [
        0x01,                   // 设备地址
        0x10,                   // 功能码
        0x00, 0x03,             // 起始地址
        0x00, 0x02,             // 寄存器数量
        0x04,                   // 字节数
        view.getUint8(0),       // 数据字节1
        view.getUint8(1),       // 数据字节2
        view.getUint8(2),       // 数据字节3
        view.getUint8(3),       // 数据字节4
        0x00, 0x00              // CRC占位符
    ];

    // 计算CRC
    function calculateCRC(data) {
        let crc = 0xFFFF;
        const polynomial = 0xA001;
        
        for (let i = 0; i < data.length - 2; i++) {
            crc ^= data[i];
            for (let j = 0; j < 8; j++) {
                if (crc & 0x0001) {
                    crc >>= 1;
                    crc ^= polynomial;
                } else {
                    crc >>= 1;
                }
            }
        }
        return crc;
    }

    const crc = calculateCRC(command);
    command[command.length - 2] = crc & 0xFF;
    command[command.length - 1] = (crc >> 8) & 0xFF;

    return Buffer.from(command);
}

// 导出函数
export { setA };