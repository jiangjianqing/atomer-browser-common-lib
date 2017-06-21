/**
 * Created by ztxs on 16-11-14.
 */
var supports = {
    'html5' : isSupportHtml5
};


var isBrowser = function(){
    if(document && document.body){
        return true;
    }else{
        return false;
    }
};

var isSupport = function (technologyName){
    if(supports[technologyName]){
        return supports[technologyName]() ===true;
    }else{
        console.warn("envcheck:isSupport not support this technology name :"+technologyName);
        return false;
    }
};

var isSupportHtml5 = function(){
    var ret = isBrowser() && document.body && document.body.classList;
    return ret instanceof DOMTokenList;//DOMTokenList 为 token
};

module.exports = {
    'isSupport' : isSupport,
    'isSupportHtml5' : isSupportHtml5
};