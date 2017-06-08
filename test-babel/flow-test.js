/**
 * Created by jjq on 6/8/17.
 */
// @flow

function foo(x: ?number): string {
    if (x) {
        return x; //这里flow应该报错
    }
    return "default string";
}

module.exports = foo;