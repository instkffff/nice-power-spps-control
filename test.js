import {
    openPort,
    closePort,
    SetA,
    SetV,
    SetRemote,
    SetOutput,
    ReadStatus
} from "./main.js";

async function runTest() {
    try {
        // 打开串口
        await openPort('COM4');
        console.log('串口打开成功\n');
        
        // 等待串口稳定
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 设置远程控制模式为关闭
        console.log('设置远程控制模式为关闭...');
        const remoteOffResponse = await SetRemote('off');
        console.log('完整响应解析:', JSON.stringify(remoteOffResponse, null, 2));
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 设置远程控制模式为开启
        console.log('设置远程控制模式为开启...');
        const remoteOnResponse = await SetRemote('on');
        console.log('完整响应解析:', JSON.stringify(remoteOnResponse, null, 2));
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 设置输出为关闭
        console.log('设置输出为关闭...');
        const outputOffResponse = await SetOutput('off');
        console.log('完整响应解析:', JSON.stringify(outputOffResponse, null, 2));
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 设置输出为开启
        console.log('设置输出为开启...');
        const outputOnResponse = await SetOutput('on');
        console.log('完整响应解析:', JSON.stringify(outputOnResponse, null, 2));
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 设置电流为0.5A
        console.log('设置电流为0.5A...');
        const currentResponse = await SetA(0.5);
        console.log('完整响应解析:', JSON.stringify(currentResponse, null, 2));
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 设置电压为0.5V
        console.log('设置电压为0.5V...');
        const voltageResponse = await SetV(0.5);
        console.log('完整响应解析:', JSON.stringify(voltageResponse, null, 2));
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 读取状态
        console.log('读取当前状态...');
        const statusResponse = await ReadStatus();
        console.log('完整响应解析:', JSON.stringify(statusResponse, null, 2));
        
        console.log('测试完成!');

        // 关闭端口
        await closePort();
        console.log('串口关闭成功');
        
    } catch (error) {
        console.error('测试过程中出现错误:', error.message);
    }
}

// 运行测试
runTest();