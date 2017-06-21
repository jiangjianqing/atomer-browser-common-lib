/**
 * Created by ztxs on 16-11-28.
 */
var isObject = function(obj){
    return !Array.isArray(obj) && typeof obj === 'object';
};

module.exports = isObject;