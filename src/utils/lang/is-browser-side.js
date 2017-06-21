/**
 * Created by jjq on 6/21/17.
 */
module.exports = (function(){
    let root = this;

    return function(){
        let ret = false;
        if(typeof window !== "undefined" && root === window){
            ret = true;
        }
        return ret;
    }

}).call(this);