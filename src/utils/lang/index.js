/**
 * Created by ztxs on 16-11-28.
 */
var assign = require('./assign');

module.exports = {
    'clone' : require('./clone'),
    'assign' : assign,
    'extend' : assign,
    'isEmpty' : require('./isEmpty'),
    'isWindow' : require('./isWindow'),
    'isPlainObject' : require('./isPlainObject'),

    'isObject' : require('./isObject'),
    'isArrayLike' : require('./isArrayLike'),
    'isArray' : require('./isArray'),
    'isFunction' : require('./isFunction'),
    'isNullOrUndefined' : require('./isNullOrUndefined'),
    'isString' : require('./isString'),
    'isNumber' : require('./isNumber'),
    'isNative' : require('./isNative')
}