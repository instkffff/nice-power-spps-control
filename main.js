import { setA } from './setA.js'
import { setV } from './setV.js'
import { setRemote } from './setRemote.js'
import { setOutput } from './setOutput.js'
import { readStatus } from './readStatus.js'
import { parseResponse } from './callback.js'

import { SerialPort } from 'serialport'

// 全局串口对象
let globalPort = null;

// 打开串口 COM4 9600 8 1 none
async function openPort() {
    return new Promise((resolve, reject) => {
        globalPort = new SerialPort({
            path: 'COM4',
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        });
        
        globalPort.on('open', () => {
            console.log('串口 COM4 打开成功');
            resolve(globalPort);
        });
        
        globalPort.on('error', (err) => {
            console.error('串口打开失败:', err.message);
            reject(err);
        });
    });
}

// 发送命令并等待完整响应
function sendCommand(command) {
    return new Promise((resolve, reject) => {
        if (!globalPort) {
            reject(new Error('串口未打开'));
            return;
        }
        
        // 设置超时
        const timeout = setTimeout(() => {
            reject(new Error('命令响应超时'));
        }, 3000);
        
        let responseData = Buffer.alloc(0);
        
        // 监听数据响应
        const dataHandler = (data) => {
            // 累积接收到的数据
            responseData = Buffer.concat([responseData, data]);
            
            // 检查是否收到完整响应
            if (isCompleteResponse(responseData)) {
                clearTimeout(timeout);
                globalPort.removeListener('data', dataHandler);
                try {
                    const parsedResponse = parseResponse(responseData);
                    resolve(parsedResponse);
                } catch (err) {
                    reject(err);
                }
            }
        };
        
        globalPort.on('data', dataHandler);
        
        // 发送命令
        globalPort.write(command, (err) => {
            if (err) {
                clearTimeout(timeout);
                globalPort.removeListener('data', dataHandler);
                reject(err);
            }
        });
    });
}

// 检查是否收到完整响应
function isCompleteResponse(data) {
    if (data.length < 3) {
        return false;
    }
    
    const functionCode = data[1];
    
    switch (functionCode) {
        case 0x03: // 读取保持寄存器
            if (data.length >= 3) {
                const byteCount = data[2];
                // 完整响应 = 地址(1) + 功能码(1) + 字节数(1) + 数据(n) + CRC(2)
                return data.length >= 3 + byteCount + 2;
            }
            return false;
            
        case 0x06: // 写单个寄存器
            // 完整响应 = 地址(1) + 功能码(1) + 寄存器地址(2) + 值(2) + CRC(2) = 8字节
            return data.length >= 8;
            
        case 0x10: // 写多个寄存器
            // 完整响应 = 地址(1) + 功能码(1) + 起始地址(2) + 寄存器数量(2) + CRC(2) = 8字节
            return data.length >= 8;
            
        default:
            // 对于未知响应，至少等待最小长度
            return data.length >= 8;
    }
}

// 封装 setA 为 SetA 并加入返回处理
async function SetA(current) {
    const command = setA(current);
    return await sendCommand(command);
}

// 封装 setV 为 SetV 并加入返回处理
async function SetV(voltage) {
    const command = setV(voltage);
    return await sendCommand(command);
}

// 封装 setRemote 为 SetRemote 并加入返回处理
async function SetRemote(state) {
    const command = setRemote(state);
    return await sendCommand(command);
}

// 封装 setOutput 为 SetOutput 并加入返回处理
async function SetOutput(state) {
    const command = setOutput(state);
    return await sendCommand(command);
}

// 封装 readStatus 为 ReadStatus 并加入返回处理
async function ReadStatus() {
    const command = readStatus();
    return await sendCommand(command);
}

// 导出函数
export { 
    openPort, 
    SetA, 
    SetV, 
    SetRemote, 
    SetOutput, 
    ReadStatus 
};