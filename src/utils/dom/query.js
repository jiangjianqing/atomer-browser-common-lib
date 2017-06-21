/**
 * Created by ztxs on 16-11-15.
 */
'use strict';
//referenced by component-query
var one = function(selector, el) {
    el = el || document;
    return el.querySelector(selector);
};

var all = function(selector, el){
    el = el || document;
    return el.querySelectorAll(selector);
};

module.exports = function(){
    return one.apply(null,arguments);
};

module.exports.all = function(){
    return all.apply(null,arguments);
};

module.exports.engine = function(obj){
    if (!obj.one) throw new Error('.one callback required');
    if (!obj.all) throw new Error('.all callback required');
    one = obj.one;
    all = obj.all;
    return module.exports;
};
