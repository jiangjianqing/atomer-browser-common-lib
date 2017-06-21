/**
 * Created by ztxs on 16-11-28.
 */
var isNumber = function(obj){
    return typeof obj === 'number';
    /*
     if (typeof obj === 'number'){
     return true;
     }
     return !isNaN(parseFloat(obj));
     */
};

module.exports = isNumber;