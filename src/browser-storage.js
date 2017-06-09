/**
 * Created by cz_jjq on 17-5-20.
 */
var Cookies = require("js-cookie");
var util = require('util');

function Storage(opts){
    this._storage = null;

}

Storage.prototype.setItem = function(key, value , opts){
    this._storage.setItem(key, value, opts);
    return this;
};

Storage.prototype.getItem = function(key){
    return this._storage.getItem(key);
};

Storage.prototype.removeItem = function(key, opts){
    this._storage.removeItem(key, opts);
    return this;
};

Storage.prototype.clear = function(){
    this._storage.clear();
    return this;
};

Storage.prototype.length = function(){
    return this._storage.length;
};

Storage.prototype.key = function(idx){
    return this._storage.key(idx);
}

function LocalStorage(){
    Storage.call(this);
    this._storage = window.localStorage;
}
util.inherits(LocalStorage,Storage);

function SessionStorage(){
    Storage.call(this);
    this._storage = window.sessionStorage;
}
util.inherits(SessionStorage,Storage);

function CookieStorage(){
    Storage.call(this);
    this._storage = {
        length : 0,
        clear : function(){},
        key : function(idx){},
        setItem : function(key, value , opts){
            Cookies.set(key, value, opts);
        },
        getItem : function(key){
            return Cookies.get(key);
        },
        removeItem : function(key, opts){
            Cookies.remove(key, opts);
        }
    };
}
util.inherits(CookieStorage,Storage);

var localStorage = new LocalStorage();
var sessionStorage = new SessionStorage();
var cookieStorage = new CookieStorage();

export default function(opts){
    var ret = localStorage;
    if (!opts){
        return ret;
    }

    if (util.isString(opts)){
        opts = {type : opts};
    }

    switch (opts.type){
        case "session":
            ret = sessionStorage;
            break;
        case "cookie":
            ret = cookieStorage;
            break;
    }

    return ret;

};

/*
cookie可选参数opts的值
 //expire    可选。规定 cookie 的有效期。按天数算
 //path      可选。规定 cookie 的服务器路径。
 //domain    可选。规定 cookie 的域名。
 //secure    可选。规定是否通过安全的 HTTPS 连接来传输 cookie。

 2、javascript 中的编码方式
 2.1 encodeURI / decodeURI

 该函数可把字符串作为 URI 进行编码
 不会对下列字符编码 ASCII字母 数字 ~!@#$&*()=:/,;?+’
 2.2 encodeURIComponent /decodeURIComponent

 函数可把字符串作为 URI 组件进行编码。
 不会对下列字符编码 ASCII字母 数字 ~!*()’
 2.3 escape unescape

 函数可对字符串进行编码，这样就可以在所有的计算机上读取该字符串。
 //不会编码的字符：@*\/+
//    2.4 三种编码方式对比结论
//
//encodeURIComponent比encodeURI编码的范围更大。
//escape 编码的字符串可以直接显示，但需要处理

 我们在cookie的操作，到底用哪个来编码比较合适呢?
 如果key=value 只是字符串可以用escape, 如果value里面的内容含有链接等建议使用encodeURIComponent

 //encodeURIComponent
 encodeURIComponent('http://www.qiku.com/zt/youth/index.html')
 //结果："http%3A%2F%2Fwww.qiku.com%2Fzt%2Fyouth%2Findex.html"
*/