var xHash = {};

Q.widget.hash ={
    bindChange : function(hash,fn){
        xHash[hash] = fn;
    },
    /**
     * 除了bindHashChange绑定后的hash可以用这个来触发
     */
    bindOtherChange : function(fn){
        xHash["__all__"] = fn;
    }
}

$(document).ready(function(){
    var lastHash;
    function doHashChange(){
        var hash = location.hash.match(/#([^\?]+)/);
        if(hash){
            hash = hash[1];
        }else{
            hash = '';
        }

        if(xHash[hash]){
            xHash[hash].call(null,hash);
        }else if(xHash["__all__"]){
            xHash["__all__"].call(null,hash);
        }
    }
    function hashChangeCheck(){
        if(location.hash!=lastHash){
            doHashChange();
            lastHash = location.hash;
        }
    }
    // IE8以下不支持hashchange，但ie10/11中的IE7文档模式"onhashchange" in window 是有的
    if("onhashchange" in window && ((typeof document.documentMode === 'undefined') || document.documentMode > 7)){
        if (typeof document.addEventListener != "undefined") {
            window.addEventListener("hashchange",doHashChange,true);
        } else {
            window.attachEvent("onhashchange",doHashChange);
        }
    }else{
        // 老设备不支持hashchange，定时检查
        window.setInterval(hashChangeCheck,200);
    }

    // 开始触发一次
    doHashChange();
});
