/**
 * Created by ztxs on 16-11-28.
 */
'use strict';

if (global.window){
    //referenced by component-event
    var eventUtil = (function(){
        var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
            unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
            prefix = bind !== 'addEventListener' ? 'on' : '';
        /**
         * Bind `el` event `type` to `fn`.
         *
         * @param {Element} el
         * @param {String} type
         * @param {Function} fn
         * @param {Boolean} capture   capture Stage : true = capture stage, false = bubble state
         * @return {Function}
         * @api public
         */
        return {
            'bind' :function(el, type, fn, capture){
                el[bind](prefix + type, fn, capture || false);
                return fn;
            },
            'unbind' : function(el, type, fn, capture){
                el[unbind](prefix + type, fn, capture || false);
                return fn;
            }
        }

    })();

    module.exports = eventUtil;
}
