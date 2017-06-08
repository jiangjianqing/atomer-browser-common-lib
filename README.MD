[![Build Status](https://travis-ci.org/jiangjianqing/atomer-common-lib.svg?branch=master)](https://travis-ci.org/jiangjianqing/atomer-common-lib)


##在package中设置bin后可以调用以下命令，免得使用npm publish
```
npm link
```
命令行参数可以用系统变量 process.argv 获取。
```npm
#!/usr/bin/env node
console.log('hello ', process.argv[2]);
```
```
$ ./hello tom
hello tom
```
上面代码中，实际上执行的是 node ./hello tom ，对应的 process.argv 是 ['node', '/path/to/hello', 'tom'] 。