/**
 * Created by xiongxing on 2014/5/19.
 *
 * 在各个请求中进行传递的上下文参数
 */
var path = require('path'),
    fs = require('fs');

var viewRootPath = path.join(__dirname, '../../views');
var exists = fs.existsSync || path.existsSync;
var qhClient = require('../../lib/biz/qhee-client.js');

var context = function(req,res,view){
    this.req = req;                 // 请求
    this.res = res;                 // 响应
    this.data = {};                 // 数据
    this.view = view || '';         // 模板页面
    // 当前请求中所有后端代理接口，只要1个借口出错，就直接跳转到显示错误页面
    // 设为false的时候，不跳转到错误页面，直接返回错误数据，需要前端页面自己处理错误数据
    // 主要用于一些重要页面不依赖后台的某些接口，当某些接口出错后，页面可以显示部分数据，比如首页
    this.proxyErrorBreak = true;

    this.data.request = req;
    this.data.response = res;
    this.data.params = req.query;
    this.data.g_shareObjs = {};     // 服务器加载的数据共享给客户端，一般用于一些字典数据
    this.data.g_originalUrl = encodeURIComponent(req.originalUrl);  // 当前页面的Url，主要用于一些传递

    var that = this;

    this.param = function(key,def){
        var v = this.req.param(key);
        if(!v && def){
            return def;
        }
        return v;
    },
    /**
     * 出错了，直接打印错误信息
      */
    this.renderError = function(errMsg,data){
//        if(typeof errMsg === 'object'){
//            errMsg = JSON.stringify(errMsg);
//        }
        data.code = 500;
        data.message = errMsg;
        this.res.status(500)
        this.res.setHeader("content-type", "text/html");
        this.res.render('500.html', data);
    };
    /**
     * 重写express的response的render方法
     * @param {string} view 视图模板, stock/detail.html
     * @param {object} options 参数
     * @param {function} fn 回调函数
     */
    this.render = function(view,options){
        var _view=null,_options=null,_fn=null;
        for(var i=0;i<arguments.length;i++){
            var arg = arguments[i];
            if(typeof arg === 'string'){
                _view = arg;
            }else if(typeof arg === 'object'){
                _options = arg;
            }else if(typeof arg === 'function'){
                _fn = arg;
            }
        }
        var that = this;
        // 处理ejs渲染出错
        _fn = function(err,str){
            if(err){
                that.renderError(err,_options);
            }else{
                that.res.send(str);
            }
        };
        _view = _view || this.view;
        if(_options) {
            for (var k in this.data) {
                _options[k] = this.data[k];
            }
        }else{
            _options = this.data;
        }
        if(_view.lastIndexOf('.html') === -1){
            _view += '.html';
        }

        // 文件的物理路径
        var realPath = path.join(viewRootPath, _view);
        var _render404 = function(){
            // 404
            res.status(404);
            _options.code = 404;
            res.render('500.html',_options);
        }
        // 前海页面的现实
        var _renderNormal = function(){
            if(exists(realPath)) {

                that.res.render(_view, _options, _fn);
            }else{
                _render404();
            }
        }

        _renderNormal();
    }

    /**
     * 代理AJAX请求，不需要用户再传res,res了
     */
    this.post = function(url,params,fn){
        qhClient.post(url,params,function(data){
            if(fn){
                fn(data);
            }else {
                // 如果没有定义回调函数，则直接显示页面
                that.render(data);
            }
        },this);
    }
    return this;
};

module.exports=context;