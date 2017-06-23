/**
 * Created by ztxs on 16-11-28.
 */

module.exports = function () {
    return {
        'null': function (x) {
            return x === null;
        },
        'string': function (x) {
            return typeof x === 'string';
        },
        'boolean': function (x) {
            return typeof x === 'boolean';
        },
        'number': function (x) {
            // Use x === x instead of !isNaN(x) for speed
            return typeof x === 'number' && x === x;
        },
        'integer': function (x) {
            return typeof x === 'number' && x % 1 === 0;
        },
        'object': function (x) {
            return x && typeof x === 'object' && !Array.isArray(x);
        },
        'array': function (x) {
            return Array.isArray(x);
        },
        'date': function (x) {
            return x instanceof Date;
        }
        ,
        'function': function (x) {
            return typeof x === 'function';
        }
    }

};