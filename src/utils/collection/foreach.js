'use strict';

var isArray = require('../lang/isArray');

/**
 * internal iterator
 * @param obj
 * @param callback
 * @param thisArg
 */
var forEach = function(obj, callback, thisArg){
    if (typeof obj !== 'object')
        throw new Error("forEach invalid obj param type!");
    var self = thisArg ? thisArg : null;

    if(isArray(obj)){
        for(var i = 0;i < obj.length;i++){
            if (callback.call(self, obj[i], i) === false){
                break;
            }
        }
        return;
        //Apply.prototype.forEach.call()
    }

    var keys = Object.keys(obj);
    for(var i = 0 , key ; key = keys[i++];){
        if (callback.call(self, obj[key], key) === false){
            break;
        }
    }
};

module.exports = forEach;