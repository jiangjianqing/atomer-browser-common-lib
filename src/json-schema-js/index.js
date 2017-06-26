/**
 * Created by ztxs on 16-12-9.
 */

let plugin = require('./plugins/getDefaultInstance');
let JsonSchema = require('./JsonSchema');
JsonSchema.addPlugin(plugin);
module.exports = JsonSchema;