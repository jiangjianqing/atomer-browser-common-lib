/**
 * Created by ztxs on 16-11-28.
 */
var isWindow = require('./isWindow');

var isPlainObject = function( obj ) {

    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if ( typeof obj !== "object" || obj.nodeType || isWindow( obj ) ) {
        return false;
    }

    if ( obj.constructor && !({}.hasOwnProperty.call( obj.constructor.prototype, "isPrototypeOf" )) ) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};

module.exports = isPlainObject;