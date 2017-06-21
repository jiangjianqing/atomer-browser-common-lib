/*
 clone object(only simple object)
 */
var clone = function(obj){
    //使用extend无法满足需求
    //return this.extend({},obj);

    // Handle the 3 simple types (string, number, function), and null or undefined
    if (obj === null || typeof obj !== 'object') return obj;
    var copy;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // handle RegExp
    if (obj instanceof RegExp) {
        copy = new RegExp(obj);
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++)
            copy[i] = clone(obj[i]);
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        var hasOwnProperty = copy.hasOwnProperty;
//           copy = Object.create(Object.getPrototypeOf(obj));
        for (var attr in obj) {
            if (hasOwnProperty.call(obj, attr))
                copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to clone object!");
};

module.exports = clone;