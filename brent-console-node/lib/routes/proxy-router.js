/**
 * Created by covito on 2015/8/28.
 */
var express = require('express'),
    fs = require('fs'),
    qhClient = require('../biz/qhee-client.js'),
    fileUtils = require('../utils/file-utils.js'),
    EventProxy = require('eventproxy'),
    context = require('./context'),
    router = express.Router(),
    preBinder =  require('../binder/pre-binder'),
    loginFilter = require('../biz/login-filter'),
    config = require('../../app-config');


/**
 * 转发后台的请求,可以请求多个url,可以请求多个模板
 */
router.all(config.context + '/m-proxy-action/*', function(req, res) {
    res.set('Content-type','text/json; charset=utf-8');
    res.removeHeader("X-Powered-By");
    var params = {};

    for(var key in req.body){           // post中的参数
        params[key] = req.body[key];
    }

    var tpl = params['_tpls'] || '';
    var tpls = tpl.length > 0 ? tpl.split("|") : [];

    var option=params['_options']||'';
    var options=option.length > 0 ? option.split("|") : [];

    var action=params['_action'];

    delete params['_tpls'];
    delete params['_options'];
    delete params['_action'];

    // 使用协作来同步异步调用
    var epAll = EventProxy.create('tplAll','optionAll','httpData',function(tpls,optionAll,jsonData){
        jsonData._tpls=tpls;
        jsonData._option=optionAll;
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

        //相对路径模板
        var file = './views/' + name+ '.html';

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


    if(options.length > 0) {
        var epOpt = new EventProxy();
        epOpt.after('one_option', options.length, function (list) {

            var obj={};
            for(var i=0;i<list.length;i++){
                for(var key in list[i]){
                    obj[key]=list[i][key];
                }
            }
            epAll.emit('optionAll',obj);
        });
        for(var i=0;i<options.length;i++) {
            var key=options[i];
            var option=preBinder.getOption(key);

            if(option){
                getOptionData(req,res,key,option,function(data){
                    // 回调后的数据自动注册，默认名字为data
                    epOpt.emit('one_option',data);
                });
            }else{
                var copyData = preBinder.getOption("other");
                var newData = {};
                newData.url = copyData.url + key;
                newData.clientShow = copyData.clientShow;
                newData.wrap = copyData.wrap;

                getOptionData(req,res,key,newData,function(data){
                    // 回调后的数据自动注册，默认名字为data
                    epOpt.emit('one_option',data);
                });
            }




        }
    }else{
        epAll.emit('optionAll',[]);
    }

    qhClient.post(action,params,function(data){
        epAll.emit('httpData', data);
    },new context(req,res),true);


})
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
        //stock-market项目以后会独立出去。所以模板也就拆分出来了。不能放在公共的./views/template里面。
        //这样的话，就需要支持独立的目录访问模板。
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

    qhClient.post(action,params,function(data){
        epAll.emit('httpData', data);
    },new context(req,res),true);
});

module.exports = router;