function loadScript(url){
    var script=document.createElement("script");
    script.type="text/javascript";
    script.src=url;
    document.body.appendChild(script);
}

function loadScriptString(code){
    var script=document.createElement("script");
    script.type="textscript";
    try{
        script.appendChild(document.createTextNode(code));
    }catch (ex){
        script.text=code;
    }
    document.body.appendChild(script);
}

function loadStylesheet(url){
    var link=document.createElement("link");
    link.rel="stylesheet";
    link.type="text/css";
    link.href=url;
    var head=document.getElementsByTagName("head")[0];
    head.appendChild(link);
}

function loadStylesheetString(css){
    var style=document.createElement("style");
    style.type="text/css";
    try{
        style.appendChild(document.createTextNode(css));
    }catch (ex){
        style.styleSheet.cssText=css;
    }
    var head=document.getElementsByTagName("head")[0];
    head.appendChild(link);
}

module.exports={
    "loadScript":loadScript,
    "loadScriptString":loadScriptString,
    "loadStylesheet":loadStylesheet,
    "loadStylesheetString":loadStylesheetString
};