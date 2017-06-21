/**
 * Created by ztxs on 16-11-14.
 */
'use strict';

/**
 * Module dependencies.
 */

var query = require('../dom/query'),
    closest = require('../dom/closest');

var _bind = require('../internal/eventUtil').bind;

var wrapEventFn = function(fn){

    return function(event){
        var ret = fn.call(this,event);
        if(ret === false){ //兼容jquery语法
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

var bind = function(el, selector, type, fn, capture){
    var nodes;
    if (typeof type === 'function'){
        capture = fn;
        fn = type;
        type = selector;
        selector = el;

        if (typeof el === 'string'){
            el = undefined;
            nodes = query.all(selector,el);
            if (nodes.length<=0){
                return;
            }
        }else{
            nodes = [el];
        }
        var wrappedFn = wrapEventFn(fn);
        if(nodes.length>1){
            var i,len;
            for(i=0,len = nodes.length;i<len;i++){
                _bind(nodes[i],type,wrappedFn,capture);
            }
        }else{
            _bind(nodes[0],type,wrappedFn,capture);
        }
        return wrappedFn;
    }else{
        var wrappedFn = wrapEventFn(fn);
        return _bind(el, type, function(e){
            var target = e.target || e.srcElement;
            e.delegateTarget = closest(target, selector, true, el);
            if (e.delegateTarget) wrappedFn.call(el, e);
        }, capture);
    }

};

module.exports = bind;