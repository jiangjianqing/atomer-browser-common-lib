/**
 * Created by ztxs on 16-11-28.
 */

module.exports = function(){
    return  {
        'readOnly': function (v, p) {
            return false;
        },
        // ****** numeric validation ********
        'minimum': function (v, p, schema) {
            return !(v < p || schema.exclusiveMinimum && v <= p);
        },
        'maximum': function (v, p, schema) {
            return !(v > p || schema.exclusiveMaximum && v >= p);
        },
        'multipleOf': function (v, p) {
            return (v / p) % 1 === 0 || typeof v !== 'number';
        },
        // ****** string validation ******
        'pattern': function (v, p) {
            if (typeof v !== 'string')
                return true;
            var pattern, modifiers;
            if (typeof p === 'string')
                pattern = p;
            else {
                pattern = p[0];
                modifiers = p[1];
            }
            var regex = new RegExp(pattern, modifiers);
            return regex.test(v);
        },
        'minLength': function (v, p) {
            return v.length >= p || typeof v !== 'string';
        },
        'maxLength': function (v, p) {
            return v.length <= p || typeof v !== 'string';
        },
        // ***** array validation *****
        'minItems': function (v, p) {
            return v.length >= p || !Array.isArray(v);
        },
        'maxItems': function (v, p) {
            return v.length <= p || !Array.isArray(v);
        },
        'uniqueItems': function (v, p) {
            var hash = {}, key;
            for (var i = 0, len = v.length; i < len; i++) {
                key = JSON.stringify(v[i]);
                if (hash.hasOwnProperty(key))
                    return false;
                else
                    hash[key] = true;
            }
            return true;
        },
        // ***** object validation ****
        'minProperties': function (v, p) {
            if (typeof v !== 'object')
                return true;
            var count = 0;
            for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
            return count >= p;
        },
        'maxProperties': function (v, p) {
            if (typeof v !== 'object')
                return true;
            var count = 0;
            for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
            return count <= p;
        },
        // ****** all *****
        'constant': function (v, p) {
            return JSON.stringify(v) == JSON.stringify(p);
        },
        'enum': function (v, p) {
            var i, len, vs;
            if (typeof v === 'object') {
                vs = JSON.stringify(v);
                for (i = 0, len = p.length; i < len; i++)
                    if (vs === JSON.stringify(p[i]))
                        return true;
            } else {
                for (i = 0, len = p.length; i < len; i++)
                    if (v === p[i])
                        return true;
            }
            return false;
        }
    }
}