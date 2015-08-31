var express = require('express'),
    path = require('path');
    favicon = require('static-favicon'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    debug = require('debug')('my-application'),
    http = require('http'),
    cluster = require('cluster'),
    log4js = require('log4js'),
    config = require('./app-config');

log4js.configure('log4js.json', {});

// 默认http maxsockets只有5个，设置为50，
// 本机压力测试调用1个20ms的接口，设置该属性，压测QPS是原来的2.5倍
http.globalAgent.maxSockets = 50;

var app = express();

// evn config setup
app.set('env',config.debug ? 'development' :'production');
app.set('port',config.port);
app.enable('strict routing');
app.disable('etag');

// view engine setup
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
if(!config.debug){
    app.enable('view cache');
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(config.context + '/public',express.static(path.join(__dirname, 'public')));
app.use(config.context + '/share',express.static(path.join(__dirname, 'share')));

// access log
var logger = log4js.getLogger('access');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));


app.use('/', require('./lib/upstream/watch-listen'));
app.use('/', require('./lib/routes/proxy-router.js'));
app.use('/', require('./lib/routes/auto-router'));

app.locals.g_config = config;
app.locals.g_loader = require('./lib/server-widget/loader.js');
// 注册静态资源目录
app.locals.g_resJs = config.context + '/public/js';
app.locals.g_resCss = config.context + '/public/css';
app.locals.g_resImg = config.context + '/public/images';
// 添加所有前后端共享
var shareCore = require('./share/core');
shareCore.share(app);

// 启动服务
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

/**
 * 当前线程出现没有catch的异常的时候，直接退出，
 * 继续服务可能会出现一些内存溢出的问题
 */
process.on('uncaughtException', function(err) {

    try {
        var logger = log4js.getLogger('error');
        logger.error(process.pid,err);
        console.log(err);
    } catch (e) {
        console.log('error when exit', e.stack);
    }
});
console.log("server runing!");


