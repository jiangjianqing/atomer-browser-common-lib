/**
 * Created by ztxs on 16-11-28.
 */

//预先绑定function的部分参数，用于设计模式
var currying = function(){
    if(arguments.length < 2){
        throw new Error('bind method need 2 params at least')
    }
    var fn = [].shift.call(arguments);
    var thisArg = [].pop.call(arguments);
    var args = [].slice.call(arguments);

    return function(){
        var params = [].concat.call(args,[].slice.call(arguments));
        return fn.apply(thisArg,params);
    }
};

module.exports = currying;