/**
 * 页面预处理
 *  * var g_binderPreData = {
 *    info :{
 *      // info 表示加载的后台数据，填充的key
 *      // 请求的URL，可以说字符串，也可以说个function
 *      url : '/action/applyAction/fetchStockExchangeApply?id=' + params.id
      }
 * }
 */
var proxyClient = require('./../biz/proxy-client'),
    EventProxy = require('eventproxy'),
    fs = require('fs'),
    path = require('path');


/**
 * 编译完毕之后返回的数据
 * @param {object} preAjaxData {
 *      url : '',
 *      clientShow : true
 * }
 */
function CompiledData(preAjaxData,includeData){
    this.preAjaxData = preAjaxData;
    this.includeData = includeData;     // include页面的时候，被include的页面里面可能也有预加载数据
    /**
     * preAjaxUrl 是字符串，可能里面会带一些动态的参数，
     * 所以真正的URL需要通过该方法运算后才可以
     * @param request
     * @param params
     * @returns {object}
     */
    this.getJsonData = function(request,params,g_context){
        if(this.preAjaxData == null && includeData.length ==0)
            return {};

        eval('var json = ' + (this.preAjaxData || '{}'));
        // include的数据
        var includeAjax = null;
        if(includeData.length > 0){
            var code = 'includeAjax = [' + includeData.join(',') + ']';
            eval(code);

            for(var i=0;i<includeAjax.length;i++){
                var tmpData = includeAjax[i];
                for(var key in tmpData){
                    var data = tmpData[key];

                    if(typeof data['filter'] === 'undefined' || data['filter']==true)
                        json[key] = tmpData[key];
                }
            }
        }

        for(var key in json){
            var data = json[key];

            if(data["filter"]){
                var tmpParams = {};
                for(var key in data["filter"]){
                    if(typeof data["filter"][key] === 'function'){
                        tmpParams[key] = data["filter"][key](request,params,g_context);
                    }else{
                        tmpParams[key] = data["filter"][key];
                    }
                }

                data["filter"] = tmpParams;
            }

            if(typeof data['filter'] !== 'undefined' && data['filter']==false){
                delete json[key];
            }

            if(data["params"]){
                var tmpParams = {};
                for(var key in data["params"]){
                    if(typeof data["params"][key] === 'function'){
                        tmpParams[key] = data["params"][key](request,params,g_context);
                    }else{
                        tmpParams[key] = data["params"][key];
                    }
                }

                data["params"] = tmpParams;
            }
        }

        return json;
    }
    return this;
}

var m_includeRegex = new RegExp('<% include ([/|\\w|-]+)\\.html %>','ig')
var m_excludesPath = ['/template'];


module.exports = {
    /**
     * 编译html文件，
     * @param {string} file 相对views目录下的文件 /stock/index.html
     * @returns {CompiledData}
     */
    compileHtmlFile : function(file,m_preBinderData,key,myRouters,routerPath){
        // 判断是否已编译
        if(m_preBinderData[key])
            return m_preBinderData[key];

        for(var i=0;i<m_excludesPath.length;i++){
            if(file.indexOf(m_excludesPath[i]) == 0){
                return null;
            }
            // _开头的目录是分中心的目录，不需要编译
            if(file.indexOf('/_') == 0){
                return null;
            }
        }
        var html = fs.readFileSync(path.join(__dirname,'../../views',file), 'utf-8');

        var data = new CompiledData(null,[]);

        var index = html.indexOf('g_binderPreData');
        if(index != -1){
            var preDataHtml = '';
            var dataStack = []; // 通过{,}2个字符串的出入栈来匹配1个完整的{}
            for(var i = html.indexOf('{',index+1);i<html.length;i++){
                var char = html.charAt(i);
                if(char == '{'){
                    dataStack.push(1);
                }else if(char == '}'){
                    dataStack.pop();
                }
                preDataHtml += char;
                if(dataStack.length == 0){
                    break;
                }
            }

            data.preAjaxData = preDataHtml;
        }

        // 搜索include的页面
        var includeRet = null;
        while ((includeRet = m_includeRegex.exec(html)) != null){
            // include文件，可能绝对路径，可能相对路径
            var includeFile = includeRet[1] + '.html';
            // 转换成相对views目录的地址
            if(includeFile.indexOf('/') !== 0){
                // 先去掉文件名
                var tmpFile = file;
                var index = file.lastIndexOf('/');
                if(index !== -1){
                    tmpFile = file.substr(0,index);
                }
                includeFile = path.join(tmpFile,includeFile).replace(/\\/ig,'/');
            }
            var includeKey = includeFile.substr(0,includeFile.length-5);
            var includeData = module.exports.compileHtmlFile(includeFile,m_preBinderData,includeKey);
            if(includeData && includeData.preAjaxData)
                data.includeData.push(includeData.preAjaxData);
        }

        m_preBinderData[key] = data;
        return data;
    },
    /**
     * 预加载数据
     * @param preCompileData
     * @param ctx
     * @param callback
     */
    preLoad : function(preCompileData,ctx,callback){
        if(preCompileData == null){
            callback(null);
            return;
        }
        var jsonData = preCompileData.getJsonData(ctx.req,ctx.data.params,ctx.data.g_context);
        var len = 0;
        for(var key in jsonData){
            if(jsonData[key].length){
                len += jsonData[key].length;
            }else{
                len++;
            }

        }

        if(len == 0){
            callback(null);
            return;
        }

        var epTpl = new EventProxy();
        epTpl.after('one_url', len, function (list) {
            callback(list);
        });

        var getAjaxData = function(key,obj){
            //console.log(key,obj.url);
            var url = obj.url;
            var params = obj['params'] || null;
            // 判断URL中是否有参数，如果有，则需要调用EJS来渲染一下
            proxyClient.post(url,params,function(data){
                var retData = data.data;
                if(obj.wrap){
                    // 需要对数据进行包装
                    retData = obj.wrap(retData);
                }
                // 有些key包含字符. 全部替换成_
                var realKey = key.replace(/\./ig,'_');
                var jsonTmp = {};
                jsonTmp[realKey] = retData;
                if(obj.clientShow){
                    // 客户端需要该参数，直接保存进客户端
                    ctx.data.g_shareObjs[realKey] = retData;
                }
                // 回调后的数据自动注册，默认名字为data
                epTpl.emit('one_url',jsonTmp);
            },ctx);
        }

        for(var key in jsonData){
            getAjaxData(key,jsonData[key]);
        }
    },
    /**
     * 根据预加载的数据配置更多页面，主要是分页之类的
     * @param {object} binderPreAjax
     * @param {string} 数据key
     * @param {string} ignoreParams  一些URL中的参数需要在action属性中忽略，因为这些参数值form表单中也存在，输出可能会出现冲突
     */
    bindMore : function(binderPreAjax,key,ignoreParams){
        var data = binderPreAjax[key];
        if(!data)
            return '';

        var url = data.url;
        if(ignoreParams){
            var paramsList = ignoreParams.split(',');
            for(var i=0;i<paramsList.length;i++){
                url = url.replace(new RegExp(paramsList[i]+'=[^&]*','ig'),'');
            }
        }

        var html = 'action="' + url + '" data-key="' + key + '"';
        return html;
    }

}
