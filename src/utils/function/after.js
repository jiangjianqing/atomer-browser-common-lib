/**
 * Created by ztxs on 16-11-28.
 */
//注意:不要在目标fn上保存任何属性,否则decorate后会丢失!!!!!
var after = function(fn, afterFn, thisArg){
    var self = this;
    return function(){
        var ret = fn.apply(self, arguments);
        afterFn.apply(thisArg ? thisArg : self, arguments);
        return ret;
    }
};

module.exports = after;