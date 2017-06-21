/**
 * Created by jjq on 6/9/17.
 */

let isBrowserSide = require("./utils/lang/is-browser-side")();

let JsonSchema = require('./json-schema-js');
let serviceManager = require('./service-manager');
let BrowserStorage = isBrowserSide ? require('./browser-storage') : undefined;
let EnvIniter = require('./env-initer');

export default {
    serviceManager,
    BrowserStorage,
    JsonSchema,
  	EnvIniter
}