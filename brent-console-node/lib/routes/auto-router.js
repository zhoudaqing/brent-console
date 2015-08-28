/**
 * Created by raymond on 2014/5/15.
 *
 * 自动扫描的路由
 */
var express = require('express'),
    fs = require('fs'),
    fileUtils = require('../utils/file-utils.js'),
    context = require('./context'),
    router = express.Router(),
    preBinder = require('../binder/pre-binder'),
    config = require('../../app-config');

/**
 * 自定义的一些路由
 * @type {Array}
 */
var myRouters = [];
/**
 * 数据绑定的预处理数据
 * @type {{}}
 */
var m_preBinderData = {};

var rootPath = './views';
/**
 * 获取文件中对应的controller
 * @param routerPath
 * @param requirePath
 */
var getController = function (routerPath, requirePath) {
    requirePath = '../' + requirePath;
    var controller = require(requirePath);
    for (var r in controller) {
        // 查询每个具体的controller
        if (r == 'index') {
            // 不加$后缀，可能会把后面的index/next请求给拦截掉
            myRouters.push({
                reg: new RegExp('^' + routerPath + '$', 'i'),
                fn: controller[r],
                defaultView: routerPath + 'index.html'
            });
            myRouters.push({
                reg: new RegExp('^' + routerPath + 'index$', 'i'),
                fn: controller[r],
                defaultView: routerPath + 'index.html'
            });

        } else {
            if (config.debug) {
                console.log('router:' + '^' + routerPath + '(' + r + ')$');
            }
            // console.log(routerPath + r);
            myRouters.push({
                reg: new RegExp('^' + routerPath + '(' + r + ')$', 'i'),
                fn: controller[r],
                defaultView: routerPath + r + '.html'
            });
        }

    }
}
/**
 * 搜索文件内容
 * @param path
 * @param fileName
 */
var searchFile = function (path, fileName) {
    var fileExt = fileUtils.getFileExt(fileName);

    // /当前文件相对views所在目录
    var routerPath = ('.' + path + '/').substr(rootPath.length + 1);

    if (fileExt == ".js") {
        // requirePath
        var allPath = '.' + path + '/' + fileName.substr(0, index);
        getController(routerPath, allPath);

        if (config.debug) {
            // 监控文件变换，3秒轮询一次
            fs.watchFile(path + '/' + fileName, {persistent: true, interval: 3007}, function (cur, prex) {
                getController(routerPath, allPath);
            });
        }
        return;
    }


    if (fileExt == ".html") {
        // html页面，预编译
        var index = fileName.indexOf('.html');
        var key = routerPath + fileName.substr(0, index);
        preBinder.compileHtmlFile(routerPath + fileName, m_preBinderData, key, myRouters, routerPath);
    }
}
/**
 * 递归目录
 * @param path
 */
var recurPath = function (path) {
    var dirList = fs.readdirSync(path);
    dirList.forEach(function (item) {
        if (fs.statSync(path + '/' + item).isDirectory() && item.indexOf('.') === -1) {
            // 如果目录中带了.目录的，则不需要扫描，可能是SVN目录
            recurPath(path + '/' + item);
        } else {
            searchFile(path, item);
        }
    });
};
recurPath(rootPath);

var renderError = function (ctx, msg, body) {
    ctx.res.status(500);

    var _msg = msg, _body = body, _stack = '';
    if (msg instanceof Error) {
        _msg = msg.message;
        _stack = msg.stack;
        _body = '';
    }
    ctx.render('500.html', {
        message: _msg,
        'body': _body,
        stack: _stack
    });
}
//获取字典数据
function getOptionData(req, res, key, option, callback) {
    var url = option.url;
    qhClient.post(url, null, function (data) {
        var retData = data.data;
        if (option.wrap) {
            // 需要对数据进行包装
            retData = option.wrap(retData);
        }
        // 有些key包含字符. 全部替换成_
        var realKey = key.replace(/\./ig, '_');
        var jsonTmp = {};
        jsonTmp[realKey] = retData;
        callback(jsonTmp);

    }, new context(req, res));
}

/**
 * 默认的路由，不处理后端代码，直接render某个html
 */
router.use('/', function (req, res) {
    res.set('Content-type', 'text/html; charset=utf-8');
    res.removeHeader("X-Powered-By");

    var path = req.path;
    if (path.indexOf('.') !== -1) {
        var ext = fileUtils.getFileExt(path);
        if (ext !== '.html') {
            // 请求有后缀，不是我们需要的请求
            res.status(404);
            res.end('page not found');
            return;
        } else {
            // 带.html的访问和不带后缀的访问效果是一样的，带html是方便搜索引擎处理的静态URL
            path = path.substr(0, path.length - 5);
        }
    }
    if (path.lastIndexOf('/') == (path.length - 1)) {
        // end with /
        path = path + 'index';
    }
    //console.log(path);
    // 需要去掉context
    if (path.indexOf(config.context) == 0) {
        path = path.substr(config.context.length);
    }

    var view = path;
    if (view.length > 0) {
        view = view.substr(1);
    }

    var ctx = new context(req, res, view + '.html');
    // 获取用户登录信息
    try {

        var preData = m_preBinderData[path];
        var matchRouter = function () {
            // 预处理数据绑定
            preBinder.preLoad(preData, ctx, function (list) {
                if (list == null || list.length == 0) {
                    ctx.render();
                    return;
                }

                var jsonTmp = {};   // 把数组转为json对象
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    for (var key in obj) {
                        jsonTmp[key] = obj[key];
                    }
                }

                ctx.render(jsonTmp);
            });
        }
        // 匹配是否有对应的controller
        for (var i = 0; i < myRouters.length; i++) {
            var myRouter = myRouters[i];

            var m = myRouter.reg.exec(path);
            if (m) {
                // 命中
                // 以前这只支持正则的一个参数，现在修改为支持多个参数
                if (m.length > 1) {
                    for (var i = 1; i < m.length; i++) {
                        req.query[i - 1] = decodeURIComponent(m[i]);
                    }
                }

                // 匹配的路由一般都有默认view，登入可以在对应的controll里面重新设置
                if (myRouter.defaultView)
                    ctx.view = myRouter.defaultView.substr(1);  // 需要去掉开头的/

                if (myRouter.fn) {
                    // 如果有controll函数，则调用函数后直接返回
                    myRouter.fn(ctx, matchRouter);
                    return;
                }
                // 匹配上，跳出匹配
                break;
            }
        }

        matchRouter();
    } catch (err) {
        console.error(err);
        // 防止异常导致进程挂掉
        renderError(ctx, err);
        throw err;
    }
});

module.exports = router;