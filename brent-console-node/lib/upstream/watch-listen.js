/**
 * Created by xiongxing on 2014/9/23.
 *
 * 监听对应端口，用来监控路由的启动和端口
 *
 * 如果需要更新路由，可以这样调用 post 数据到下面接口，
 * 数据key是data,value = [
    {host: '10.60.60.49', port: 8080, live: true},
    {host: '10.60.60.22', port: 8080, live: true}
 ]
 * http://127.0.0.1:1035/update
 */
var http = require('http'),
    httpRouter = require('./http-router'),
    fileUtils = require('../utils/file-utils'),
    spawn = require('child_process').spawn,
    winston = require('winston'),
    os = require('os'),
    express = require('express'),
    router = express.Router(),
    urlParse = require('url');

var isWin = (os.platform().indexOf('win') != -1);

var logPath = '/apps/qhee/logs/';
fileUtils.mkPath(logPath);

var log = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            level : 'info',
            maxsize : 1024 * 1024 * 10,     // 文件大小10M
            filename: logPath + '/router-watch.log'
        })
    ]
});
/**
 * 更新路由
 */
var updateRouter = function(data,res){
    httpRouter.updateRouter(data);

    // 发送进程消息，通知所有进程更新路由
    var cmd = spawn('pm2',['sendSignal','SIGUSR1','app']);
    cmd.on('close', function (code) {
        res.end('{status:1}');
    });
}

//router.use('/', function(req, res,next){
//    // 向请求中添加1个值，用于后面标识后面的http代理是从同1个请求过来的
//    next();
//});

/**
 * 更新路由接口
 */
router.use('/upstream-watch', function(req, res,next){
    var jsonStr = req.param('data');

    log.info('receive request data:'+jsonStr);

    try {
        eval('var data = ' + jsonStr);      // POST过来的数据，以JSON格式，保存到data这个key下面
    }catch(e){
        res.status(500).send(e);
        return;
    }

    updateRouter(data, res);

    setTimeout(function(){
        // 延迟1秒响应，给时间通知各进程同步
        res.send('update succ');
    },1000);
});
// 不单独监听端口，单独的端口还需要运维开端口权限，直接和业务http端口绑定在一起，
module.exports = router;