'use strict';

var _unbind = require('../internal/eventUtil').unbind;

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

var unbind = function(el, type, fn, capture){
    _unbind(el, type, fn, capture);
};

module.exports = unbind;