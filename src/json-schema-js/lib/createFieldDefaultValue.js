/**
 * Created by ztxs on 16-11-28.
 */

module.exports = function () {
    return {
        'null': function (x) {
            return x.hasOwnProperty("default") ? x.default : null;
        },
        'string': function (x) {
            return x.hasOwnProperty("default") ? x.default : "";
        },
        'boolean': function (x) {
            return x.hasOwnProperty("default") ? x.default : true;
        },
        'number': function (x) {
            // 还需要根据min、max等条件判断
            return x.hasOwnProperty("default") ? x.default : 0;
        },
        'integer': function (x) {
            // 还需要根据min、max等条件判断
            return x.hasOwnProperty("default") ? x.default : 0;
        },
        'object': function (x) {
            return x.hasOwnProperty("default") ? x.default : {};
        },
        'array': function (x) {
            return x.hasOwnProperty("default") ? x.default : [];
        },
        'date': function (x) {
            return x.hasOwnProperty("default") ? x.default : new Date();
        },
        'function': function (x) {
            return x.hasOwnProperty("default") ? x.default : null;//如果没有fn，则用null占位，比较容易发现问题
        }
    };
}