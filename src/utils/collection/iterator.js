var isArray = require('../lang/isArray'),
    isObject = require('../lang/isObject');

var iterator = function(obj){

    if(!isObject(obj) && !isArray(obj)){
        throw new Error('Iterator invalid obj param type')
    }
    var current = 0;
    var keys;
    if(isArray(obj)){
        keys = [];
        for(var i =0;i<obj.length;i++){
            keys[i] = i;
        }
    }else{
        keys = Object.keys(obj);
    }

    var next = function(){
        if (current>=keys.length){
            throw new Error("Iterator : current out of range");
        }
        current++;
    };

    var isDone = function(){
        return current >= keys.length;
    };

    var getCurrentItem = function(){
        var key = keys[current];
        return {
            'key' : key,
            'value' : obj[key]
        };
    };

    var reset = function(){
        current=0;
    };

    return {
        'next' : next,
        'isDone' : isDone,
        'getCurrentItem' : getCurrentItem,
        'reset' : reset
    }
};

module.exports = iterator;