/**
 * Created by ztxs on 16-11-15.
 */

var bind = require('./bind'),
    unbind = require('./unbind');

/**
 *readyState values list:
 *
 * uninitialized:未初始化
 * loading:正在加载
 * loaded:加载完毕
 * interactive:交互
 * complete:完成
 *
 *
 * @param el listen readystatechange event's element
 * @param fn callback function
 *
 */
var ready = function(el,fn){
    if (typeof el === 'function'){
        fn = el;
        el = document;
    }
    bind(el,'readystatechange',function(){
        //interactive 与 complete状态的先后顺序不确定，所以一起参与判断
        if(el.readyState === 'interactive' || el.readyState === 'complete'){
            unbind(el,'readystatechange',arguments.callee);
            fn();
        }
    },false);
};

module.exports = ready;