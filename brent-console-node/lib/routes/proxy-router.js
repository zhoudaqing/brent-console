/**
 * 代理后端接口
 */
var express = require('express'),
    fs = require('fs'),
    proxyClient = require('../biz/proxy-client.js'),
    EventProxy = require('eventproxy'),
    context = require('./context'),
    router = express.Router(),
    config = require('../../app-config');

/**
 * 转发后台的请求，可以接受tpl参数用于获取请求的模板
 */
router.all(config.context + '/proxy-action/*', function(req, res) {
    res.set('Content-type','text/json; charset=utf-8');
    res.removeHeader("X-Powered-By");
    var params = {};

    for(var key in req.body){           // post中的参数
        params[key] = req.body[key];
    }

    for(var key in req.query){          // get url中参数
        params[key] = req.query[key];
    }

    var tpl = params['_tpls'] || '';
    var tpls = tpl.length > 0 ? tpl.split("|") : [];

    var action = params['_action'];

    delete params['_tpls'];
    delete params['_action'];

    // 使用协作来同步异步调用
    var epAll = EventProxy.create('tplAll','httpData',function(tpls,jsonData){
        jsonData._tpls=tpls;
        res.json(jsonData);
    });

    /**
     * fs.readFile异步方法需要2次回调，不然取不到数据，这里可以提炼成公用方法
     */
    var readFile = function(name,callback){
        if(name.indexOf('.') == 0 || name.indexOf('/') == 0){
            // 必须以/开头，防止用户通过输入..返回上一页来尝试下载其他页面
            callback(null,name,'');
            return;
        }
        //暂定使用@开头来作为views内的绝对路径访问独立项目的独立模板
        if(name.charAt(0)=="@"){
            var file = './views/' + (name.substring(1)) + '.html';
        }else{
            var file = './views/template/' + name + '.html';
        }
        fs.readFile(file, 'utf-8', function (err, content) {
            if(err){
                callback(err);
            }else{
                callback(null,name,content);
            }

        });
    };

    if(tpls.length > 0) {
        var epTpl = new EventProxy();
        epTpl.after('one_tpl', tpls.length, function (list) {
            epAll.emit('tplAll',list);
        });
        for(var i=0;i<tpls.length;i++) {
            // var name = tpls[i];
            readFile(tpls[i], function (err,name,content) {
                if(err){
                    console.error(err);
                }
                epTpl.emit('one_tpl', {'name':name,'content':content});
            });
        }
    }else{
        epAll.emit('tplAll',[]);
    }

    proxyClient.post(action,params,function(data){
        epAll.emit('httpData', data);
    },new context(req,res),true);
});

module.exports = router;