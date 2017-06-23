/**
 * Created by ztxs on 16-11-28.
 */

// missing: uri, date-time, ipv4, ipv6
module.exports = function () {
    return {
        'alpha': function (v) {
            return (/^[a-zA-Z]+$/).test(v);
        },
        'alphanumeric': function (v) {
            return (/^[a-zA-Z0-9]+$/).test(v);
        },
        'identifier': function (v) {
            return (/^[-_a-zA-Z0-9]+$/).test(v);
        },
        'hexadecimal': function (v) {
            return (/^[a-fA-F0-9]+$/).test(v);
        },
        'numeric': function (v) {
            return (/^[0-9]+$/).test(v);
        },
        'date-time': function (v) {
            return !isNaN(Date.parse(v)) && v.indexOf('/') === -1;
        },
        'uppercase': function (v) {
            return v === v.toUpperCase();
        },
        'lowercase': function (v) {
            return v === v.toLowerCase();
        },
        'hostname': function (v) {
            return v.length < 256 && (/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/).test(v);
        },
        'uri': function (v) {
            return (/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/).test(v);
        },
        'email': function (v) { // email, ipv4 and ipv6 adapted from node-validator
            return (/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/).test(v);
        },
        'ipv4': function (v) {
            if ((/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/).test(v)) {
                var parts = v.split('.').sort();
                if (parts[3] <= 255)
                    return true;
            }
            return false;
        },
        'ipv6': function (v) {
            return (/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/).test(v);
            /*  return (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(v); */
        }
    };
}