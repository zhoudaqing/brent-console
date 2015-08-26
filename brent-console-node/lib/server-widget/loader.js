/**
 * Created by xiongxing on 2014/6/18.
 * JS,CSS loader
 */
var fs = require('fs'),
    agentUtils = require('../utils/agent-utils'),
    config = require('../../app-config'),
    staticResource = require('../../static-resource.json'),
    path = require('path');

/*
已查询到的各个静态资源的版本号,
{
    "name" : 123，   // 为防止并发，版本号做一些特殊处理，
    如果没有这个key，说明还没有找该文件的版本号，
    =-1，说明正在查找
    =0 查找完成，但对应的文件不存在
    >0 查找成功
}
*/
var m_mapResourceMd5 = {};
if(!config.debug) {
    m_mapResourceMd5 = require('../../' + staticResource.md5File);
}
// 为了不每次都判断文件是否存在，加1个cache缓存
var centerCssCache={};

var _getResourceHtmlCode = function(file,type,onlyGetLink){
    if(onlyGetLink){
        return config.context + file + '\r\n';
    }
    if(type=="js"){
        return "<script src='" + config.context + file + "'></script>";
    } else if(type == 'json') {
        return require(file);
    } else {
        return '<link href="' + config.context + file + '" type="text/css" rel="stylesheet">';
    }
}
var _showDebugFiles = function(files,type,onlyGetLink){
    var html = '';
    // 测试环境
    var listFile = staticResource.merge[files];

    if(listFile){
        if(type == "json") {
            html = [];
            for(var i=0;i<listFile.list.length;i++){
                html.push(_getResourceHtmlCode(listFile.list[i],type,onlyGetLink));
            }
        } else {
            // 引入需要合并压缩的文件
            for(var i=0;i<listFile.list.length;i++){
                html += _getResourceHtmlCode(listFile.list[i],type,onlyGetLink);
            }
        }
    } else {
        if(type == 'json') {
            html = _getResourceHtmlCode(files,type,onlyGetLink);
        } else {
            // 引入单个的css文件
            html += _getResourceHtmlCode(files,type,onlyGetLink);
        }
    }
    return html;
}
module.exports = {
    /**
     * 加载样式文件，如果改文件存在的话，在存折则不加载
     * @param {string} file
     */
    loadCssIfExist : function(file){

        var cacheValue = centerCssCache[file];
        // 有缓存，并且值为0，说明文件不存在
        if(typeof cacheValue === 'undefined'){
            // 这里只能用同步判断，不然response就直接输出了

            var isExist = fs.existsSync(path.join(__dirname, '../../public/css' + file));

            centerCssCache[file] = isExist;
            cacheValue = isExist;
        }

        if(cacheValue){
            return '<link href="' + config.context + '/public/css' + file + '" type="text/css" rel="stylesheet">';
        }else{
            return '';
        }
    },
    /**
     * 在特定的操作系统下加载一些样式，比如MAC系统下才加载MAC的样式
     * @param file
     * @param osName
     */
    loadCssForOs : function(request,file,osName){
        var ua =request.get('User-Agent');
        if(!ua)
            return '';

        if(ua.indexOf(osName) !== -1){
            return '<link href="' + config.context + '/public/css' + file + '" type="text/css" rel="stylesheet">';
        }

        return '';
    },

    loadResource : function(file,type,request){
        var html = '';
        if(config.debug || request.query.__debug){
            html = _showDebugFiles(file,type);
        }else{
            // md5值并不是配置进去的，而是发布平台发布的时候写进去的
            var md5Versin = m_mapResourceMd5[file];
            if(md5Versin){
                html = _getResourceHtmlCode(file +  '?' + md5Versin,type);
            }else{
                html = _showDebugFiles(file,type);
            }
        }

        return html;
    },

    loadResourceForNative : function(file,type,request){
        if(!agentUtils.isNative(request)){
            return '';
        }else{
            return module.exports.loadResource(file,type,request);
        }
    },


    isIos : function(request){
        return agentUtils.isIos(request);
    },

    isAndroid : function(request){
        return agentUtils.isAndroid(request);
    },

    isMobile : function(request){
        return agentUtils.isMobile(request);
    },
    /*****下面仅仅生成连接，不用html代码包含，主要用于manifest文件*****/
    getResourceLink : function(file,type,request){

        var html = '';
        if(config.debug || request.query.__debug){
            html = _showDebugFiles(file,type,true);
        }else{
            // md5值并不是配置进去的，而是发布平台发布的时候写进去的
            var md5Versin = m_mapResourceMd5[file];
            if(md5Versin){
                html = _getResourceHtmlCode(file +  '?' + md5Versin,type,true);
            }else{
                html = _showDebugFiles(file,type,true);
            }
        }

        return html;
    },

    getResourceLinkForNative : function(file,type,request){
        if(!agentUtils.isNative(request)){
            return '';
        }else{
            return module.exports.getResourceLink(file,type,request);
        }
    }
}
