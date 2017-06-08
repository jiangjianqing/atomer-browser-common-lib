//然后，我们需要修改编译后的文件test.compiled.js，在其首行加上以下代码来载入babel-polyfill：
//require('babel-polyfill');

//或者在.babelrc中使用 transform-runtime plugin


function sleep(ms = 0) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

//换ESLint吧。既然你选择了ES7+，还是放弃滞后实践的JSHint/JSLint。

async function test() {
    for (let i = 0; i < 10; i++) {
        await sleep(500);
        console.log(`i=${i}`);
    }
}

test().then(() => console.log('done'));