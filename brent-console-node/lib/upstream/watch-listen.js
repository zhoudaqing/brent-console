/**
 * 监听对应端口，用来监控路由的启动和端口
 *
 * 如果需要更新路由，可以这样调用 post 数据到下面接口，
 * 数据key是data,value = [
    {host: '10.60.60.49', port: 8080, live: true},
    {host: '10.60.60.22', port: 8080, live: true}
 ]
 */
var http = require('http'),
    httpRouter = require('./http-router'),
    spawn = require('child_process').spawn,
    os = require('os'),
    express = require('express'),
    log4js = require('log4js'),
    router = express.Router();

var isWin = (os.platform().indexOf('win') != -1);

var logger = log4js.getLogger('router');
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

/**
 * 更新路由接口
 */
router.use('/upstream-watch', function(req, res,next){
    var jsonStr = req.param('data');

    logger.info('receive request data:'+jsonStr);

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