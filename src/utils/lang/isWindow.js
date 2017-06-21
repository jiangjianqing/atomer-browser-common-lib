/**
 * Created by ztxs on 16-11-28.
 */
var isWindow = function( obj ) {
    return obj != null && obj === obj.window;
};

module.exports = isWindow;