// 解析电源返回数据
function parseResponse(response) {
    // 检查数据格式
    if (response.length < 3) {
        throw new Error('响应数据长度不足');
    }

    const slaveId = response[0];        // 设备地址
    const functionCode = response[1];   // 功能码

    // 根据功能码解析不同类型的响应
    switch (functionCode) {
        case 0x03: // 读取保持寄存器
            const byteCount = response[2];      // 字节数
            if (response.length < 3 + byteCount + 2) {
                throw new Error('状态响应数据长度不足');
            }

            // 数据部分从索引3开始
            const dataStartIndex = 3;
            const dataBytes = response.slice(dataStartIndex, dataStartIndex + byteCount);

            // 解析电压设定值 (前4字节 IEEE 754浮点数)
            const voltageBuffer = new ArrayBuffer(4);
            const voltageView = new DataView(voltageBuffer);
            voltageView.setUint8(0, dataBytes[0]);
            voltageView.setUint8(1, dataBytes[1]);
            voltageView.setUint8(2, dataBytes[2]);
            voltageView.setUint8(3, dataBytes[3]);
            const voltageSet = voltageView.getFloat32(0, false); // 大端序

            // 解析电流设定值 (接下来4字节 IEEE 754浮点数)
            const currentBuffer = new ArrayBuffer(4);
            const currentView = new DataView(currentBuffer);
            currentView.setUint8(0, dataBytes[4]);
            currentView.setUint8(1, dataBytes[5]);
            currentView.setUint8(2, dataBytes[6]);
            currentView.setUint8(3, dataBytes[7]);
            const currentSet = currentView.getFloat32(0, false); // 大端序

            // 解析状态 (最后2字节)
            const status = (dataBytes[8] << 8) | dataBytes[9];
            const outputOn = (status & 0x01) === 1;

            return {
                type: 'read_status',
                slaveId: slaveId,
                functionCode: functionCode,
                byteCount: byteCount,
                voltage: {
                    set: voltageSet
                },
                current: {
                    set: currentSet
                },
                output: {
                    state: outputOn ? 'on' : 'off',
                    statusRegister: status
                },
                rawData: response.toString('hex').toUpperCase()
            };

        case 0x06: // 写单个寄存器
            if (response.length < 8) {
                throw new Error('写寄存器响应数据长度不足');
            }

            const registerAddress = (response[2] << 8) | response[3];
            const value = (response[4] << 8) | response[5];

            // 根据寄存器地址判断操作类型
            let operationType = 'unknown';
            let operationValue = null;

            if (registerAddress === 0x0000) {
                // 远程/本地模式控制
                operationType = 'set_remote';
                operationValue = value === 1 ? 'remote' : 'local';
            } else if (registerAddress === 0x001B) {
                // 电源输出开关控制
                operationType = 'set_output';
                operationValue = value === 1 ? 'on' : 'off';
            }

            return {
                type: 'write_register',
                slaveId: slaveId,
                functionCode: functionCode,
                registerAddress: registerAddress,
                value: value,
                operationType: operationType,
                operationValue: operationValue,
                rawData: response.toString('hex').toUpperCase()
            };

        case 0x10: // 写多个寄存器
            if (response.length < 8) {
                throw new Error('写多个寄存器响应数据长度不足');
            }

            const startAddress = (response[2] << 8) | response[3];
            const registerCount = (response[4] << 8) | response[5];

            return {
                type: 'write_registers',
                slaveId: slaveId,
                functionCode: functionCode,
                startAddress: startAddress,
                registerCount: registerCount,
                parameterType: startAddress === 1 ? 'set_voltage' : startAddress === 3 ? 'set_current' : 'unknown',
                rawData: response.toString('hex').toUpperCase()
            };

        default:
            return {
                type: 'unknown',
                slaveId: slaveId,
                functionCode: functionCode,
                rawData: response.toString('hex').toUpperCase()
            };
    }
}

// 导出函数
export { parseResponse };

// 使用示例

/* // 1. 读取状态返回
console.log('1. 读取状态返回 (12V 0A ON):');
const statusResponse = Buffer.from([0x01, 0x03, 0x0a, 0x41, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46, 0x64]);
console.log(parseResponse(statusResponse));
console.log();

// 2. 配置远程模式返回
console.log('2. 配置远程模式返回:');
const remoteModeResponse = Buffer.from([0x01, 0x06, 0x00, 0x00, 0x00, 0x01, 0x48, 0x0A]);
console.log(parseResponse(remoteModeResponse));
console.log();

// 3. 配置本地模式返回
console.log('3. 配置本地模式返回:');
const localModeResponse = Buffer.from([0x01, 0x06, 0x00, 0x00, 0x00, 0x00, 0x89, 0xCA]);
console.log(parseResponse(localModeResponse));
console.log();

// 4. 打开电源输出返回
console.log('4. 打开电源输出返回:');
const outputOnResponse = Buffer.from([0x01, 0x06, 0x00, 0x1B, 0x00, 0x01, 0x38, 0x0D]);
console.log(parseResponse(outputOnResponse));
console.log();

// 5. 关闭电源输出返回
console.log('5. 关闭电源输出返回:');
const outputOffResponse = Buffer.from([0x01, 0x06, 0x00, 0x1B, 0x00, 0x00, 0xF9, 0xCD]);
console.log(parseResponse(outputOffResponse));
console.log();

// 6. 设置电压返回
console.log('6. 设置电压返回:');
const setVoltageResponse = Buffer.from([0x01, 0x10, 0x00, 0x01, 0x00, 0x02, 0x10, 0x08]);
console.log(parseResponse(setVoltageResponse));
console.log();

// 7. 设置电流返回
console.log('7. 设置电流返回:');
const setCurrentResponse = Buffer.from([0x01, 0x10, 0x00, 0x03, 0x00, 0x02, 0xB1, 0xCB]);
console.log(parseResponse(setCurrentResponse));
console.log(); */