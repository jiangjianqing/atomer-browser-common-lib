/**
 * Created by ztxs on 16-11-28.
 */
module.exports = function(){
    return {
        'type': true,
        'not': true,
        'anyOf': true,
        'allOf': true,
        'oneOf': true,
        '$ref': true,
        '$schema': true,
        'id': true,
        'exclusiveMaximum': true,
        'exclusiveMininum': true,
        'properties': true,
        'patternProperties': true,
        'additionalProperties': true,
        'items': true,
        'additionalItems': true,
        'required': true,
        'default': true,
        'title': true,
        'description': true,
        'definitions': true,
        'dependencies': true,
        'uicontrol': true//uicontrol作为已经处理
    };
}