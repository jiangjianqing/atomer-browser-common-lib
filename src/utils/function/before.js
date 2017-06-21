/**
 * Created by ztxs on 16-11-28.
 */
//注意:不要在目标fn上保存任何属性,否则decorate后会丢失!!!!!

var before = function(fn, beforeFn, thisArg){
    var self = this;
    return function () {
        var ret = beforeFn.apply(thisArg ? thisArg : self,arguments);
        if (ret !== false){
            return fn.apply(self,arguments);
        }
    }
};

module.exports = before;