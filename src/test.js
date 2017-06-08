let myhttp = require('http'); //用这样的写法可以兼容es5的 require写法

//import fs from 'fs';  //不要使用这样的语法，会容易产生以下垃圾代码
//var _fs2 = _interopRequireDefault(_fs);
//function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let [a,b,c] = [1,2,3];
console.log(a,b,c);

export const test1 = 123;

export default function y() { }