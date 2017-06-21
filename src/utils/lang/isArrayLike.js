/**
 * Created by ztxs on 16-11-28.
 */
var isObject = require('./isObject');

var isArrayLike = function(ary){
    if(Array.isArray(ary)){
        return true;
    };
    if(isObject(ary)){
        var length = ary.length;
        if(length && isNumber(length)){
            /*
             for(var i = 0;i<length;i++){
             if(ary[i])
             }*/
            return true;
        }else{
            return false;
        }
    };
    return false;
};

module.exports = isArrayLike;