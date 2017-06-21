/**
 * Created by ztxs on 16-11-15.
 */

var bind = require('./bind'),
    unbind = require('./unbind'),
    trigger = require('./trigger'),
    ready = require('./ready');

module.exports = Object.assign({},{
    'bind' : bind,
    'on' : bind,
    'unbind': unbind,
    'off' : unbind,
    'trigger' : trigger,
    'ready' : ready
});
