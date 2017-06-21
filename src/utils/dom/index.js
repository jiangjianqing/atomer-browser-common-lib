/**
 * Created by ztxs on 16-11-14.
 */

var closest = require('./closest'),
    matches = require('./matches-selector'),
    query = require('./query'),
    domify = require('./domify'),
    remove  = require('./remove'),
    clear = require('./clear'),
    classes = require('./classes');

module.exports = {
    'closest' : closest,
    'matches' : matches,
    'query' : query,
    'domify': domify,
    'clear' : clear,
    'empty' : clear,
    'remove' : remove,
    'classes' : classes
};
