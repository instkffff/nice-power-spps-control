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

        await new Promise(resolve => setTimeout(resolve, 1000));

        await SetRemote('on');

        await new Promise(resolve => setTimeout(resolve, 1000));

        await SetA(0.02);

        await new Promise(resolve => setTimeout(resolve, 1000));

        await SetV(5);

        await new Promise(resolve => setTimeout(resolve, 1000));

        await SetOutput('on');

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(4.8);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(4.6);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(4.4);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(4.2);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(4);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(3.8);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(3.6);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(3.4);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(3.2);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(3);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetV(2.8);

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetOutput('off');

        await new Promise(resolve => setTimeout(resolve, 5000));

        await SetRemote('off');

        await new Promise(resolve => setTimeout(resolve, 5000));

        await closePort();

        console.log('串口打开成功\n');


    } catch (error) {
        console.error('测试过程中出现错误:', error.message);
    }
}

// 运行测试
runTest();