/**
 * Created by ztxs on 16-11-28.
 */
var isPlainObject = require('./isPlainObject');

var isEmpty = function(obj){
    if(!isPlainObject(obj)){
        return false;
    }
    for(var v in obj){
        return false;
    }
    return true;
};

module.exports = isEmpty;

