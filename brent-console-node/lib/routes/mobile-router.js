/**
 * Created by xiongxing on 2014/11/7.
 *
 * 用于移动端的路由请求
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


// 所有模板(每个对象包含2个字段，ver(版本),content(内容))
var m_templates = {}
// 所有控制器
var m_controllers = {}

var m_readModuleFile = function(type,name,callback){
    //相对路径模板
    var file = '';
    if(type == 'ctl'){
        file = './public/m/js/' + name + '.js';
    }else{
        file = './views/m/' + name + '.html';
    }
    fs.readFile(file, 'utf-8', function (err, content) {
        if(err){
            callback(err);
        }else{
            callback(null,{
                "type" : type,
                "name" : name,
                "content" : content,
                "ver" : content.length      // 目前版本号采用文件的长度来判断
            });
        }

    });
}
/**
 * 获取移动端的模块
 */
router.use(config.context + '/m-module/get', function(req, res) {
    res.set('Content-type','text/json; charset=utf-8');
    res.removeHeader("X-Powered-By");

    var params = {};
    for(var key in req.body){           // post中的参数
        params[key] = req.body[key];
    }

    // 返回数据，{type:'tpl:ctl',ver:0,content:'','name':''}
    var returnData = [];

    var needReadFile = [];  // 需要加载的文件列表

    var getOneData = function(type,name,ver){
        var tmpData = null;
        if(type == 'tpl'){
            tmpData = m_templates[name];
        }else{
            tmpData = m_controllers[name];
        }

        if(!tmpData || config.debug){
            needReadFile.push({
                "name" : name,
                "type" : type
            });
        }else{
            var retData = {
                "type" : type,
                "name" : name,
                "ver" : tmpData.ver
            }
            if(tmpData.ver != ver){
                retData.content = tmpData.content;
            }

            returnData.push(retData);
        }
    }
    // 模板
    var tpl = params['tpl'] || '';
    var tplVer = params['tpl_v'] || 0;
    getOneData('tpl',tpl,tplVer);

    // 控制器
    var ctl = params['ctl'] || '';
    var ctlVer = params['ctl_v'] || 0;
    if(ctl) {
        getOneData('ctl', ctl, ctlVer);
    }

    if(needReadFile.length > 0){
        // 需要加载文件
        var epAlls = new EventProxy();
        epAlls.after('one', needReadFile.length, function (list) {
            res.json(returnData.concat(list));
        });

        for(var i=0;i<needReadFile.length;i++) {
            m_readModuleFile(needReadFile[i].type,needReadFile[i].name,function(err,obj){
                if(!err){
                    if(obj.type=='tpl'){
                        m_templates[obj.name] = obj;
                    }else{
                        m_controllers[obj.name] = obj;
                    }
                    epAlls.emit('one',obj);
                }else{
                    console.error(err);
                }
            });
        }
    }else{
        res.json(returnData);
    }
});
//获取字典数据
function getOptionData(req,res,key,option,callback){
    var url=option.url;
    qhClient.post(url,null,function(data){
        var retData = data.data;
        if(option.wrap){
            // 需要对数据进行包装
            retData = option.wrap(retData);
        }
        // 有些key包含字符. 全部替换成_
        var realKey = key.replace(/\./ig,'_');
        var jsonTmp = {};
        jsonTmp[realKey] = retData;
        callback(jsonTmp);

    },new context(req,res));
}
/**
 * 转发后台的请求,
 * {
 *    urls : 'url1|url2',
 *    system_options : 'ss|ss',
 *    tpls : 'tpl1|tpl2',
 *    controlls : 'msg|'        // 对应的js脚本控制器
 * }
 */
router.all(config.context + '/m-action/*', function(req, res) {
    res.set('Content-type','text/json; charset=utf-8');
    res.removeHeader("X-Powered-By");
    var params = {};

    for(var key in req.body){           // post中的参数
        params[key] = req.body[key];
    }

//    var tpl = params['_tpls'] || '';
//    var tpls = tpl.length > 0 ? tpl.split("|") : [];

    var option=params['_options']||'';
    var options=option.length > 0 ? option.split("|") : [];

    var action=params['_action'];

//    delete params['_tpls'];
    delete params['_options'];
    delete params['_action'];

    // 使用协作来同步异步调用
    var epAll = EventProxy.create('optionAll','httpData',function(optionAll,jsonData){
        //jsonData._tpls=tpls;
        jsonData._options=optionAll;
        res.json(jsonData);
    });

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
                var isBeginC = (key.indexOf('c_')===0);  // c_开头是为了区分一般变量，数据库是没有c_的

                newData.url = copyData.url + (isBeginC?key.substr(2):key);
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


module.exports = router;