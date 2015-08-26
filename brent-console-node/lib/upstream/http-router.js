/**
 * Created by xiongxing on 2014/9/23.
 */

var config = require('../../app-config'),
    fileUtils = require('../utils/file-utils'),
    winston = require('winston'),
    fs = require('fs'),
    os = require('os');

var isWin = (os.platform().indexOf('win') != -1);

var logPath = '/apps/qhee/logs/';
fileUtils.mkPath(logPath);

var log = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            level : 'info',
            json : false,
            maxsize : 1024 * 1024 * 10,     // 文件大小10M
            filename: logPath + '/router.log'
        })
    ]
});

var C_FAIL_RATE = 0.75;      // 默认错误超过75%认为后台server死掉了
var C_CONTINUE_WATCH_COUNT = 20;    // 连续调用观察到次数
// 最新的路由信息放置的目录
var routerPath = '/apps/qhee/router/';
var routerFile = routerPath + config.httpClientConfigs.appName + '.json';
/***********路由对象 begin*************/
function RouterData(config){
    this._host = config.host;
    this._port = config.port;
    this.live = config.live;

    this.url = 'http://' + this._host + ':' + this._port;
    this.count = 0;         // 调用总次数
    this.failCount = 0;     // 调用失败次数(500,超时)

    this._continueWatchCount = 0;     // 连续记录的次数
    this._continueFailCount = 0;      // 连续记录次数中的失败次数

    this._deadAccessCount = 0;        // 服务器死了后的访问次数
}
/**
 * 需要调用该方法判断服务器是否挂了
 */
RouterData.prototype.isLive = function(){
    if(this.live){
        return true;
    }

    this._deadAccessCount++;
    if(!this.live){
        // 服务器已经死了，放5%的量过来测试该服务器是否恢复正常
        if(this._deadAccessCount>=20){
            this._deadAccessCount = 0;
            return true;
        }else{
            return false;
        }
    }
}
/**
 * 调用一次
 *
 * 请求后台某台机器报错率超过90%,请求次数超过20次的时候，断开该机器的访问。认为该机器已死掉
 */
RouterData.prototype.addAccessCall = function(){
    this.count++;
    this._continueWatchCount++;

    if(this._continueWatchCount >= C_CONTINUE_WATCH_COUNT){

        // 判断失败率是否达到要求
//        var failPercent = this._continueFailCount/this._continueWatchCount;
//        if(failPercent >= C_FAIL_RATE){
//           // 失败率已经超出了，判断服务器已经死掉
//            this.live = false;
//            log.error("fail:"+this._host+'|' + this.live+'|'+this._continueFailCount+'|'+this._continueWatchCount);
//        }else{
//            if(!this.live) {
//                log.info("access:" + this._host + '|' + this.live + '|' + this._continueFailCount + '|' + this._continueWatchCount);
//            }
//            this.live = true;
//        }


        this._continueWatchCount = 0;
        this._continueFailCount = 0;
    }

}
/**
 * 调用失败
 */
RouterData.prototype.addFailCall = function(){
    this.failCount++;
    this._continueFailCount++;

    this.addAccessCall();
}
/**
 * 获取写入路由文件的配置
 */
RouterData.prototype.getWriteData = function(){
    return {host:this._host,port:this._port,live:this.live};
}
/***********路由对象 end*************/
// 路由数据保存到这个对象
var m_routerConfig = [];
// 获取路由
function loadRouterConfig(){
    var defaultRouter = null;
    // 读取最新配置
    if(fs.existsSync(routerFile)){
        var fileData = fs.readFileSync(routerFile, 'utf-8');
        defaultRouter = JSON.parse(fileData);
    }else {
        // 读取默认配置
        defaultRouter = config.httpClientConfigs.route;
    }

    log.info(process.pid + ' reload router config:',defaultRouter);
    //console.log(process.pid + ' reload router config:',defaultRouter);

    var routerDatas = [];
    for(var i=0;i<defaultRouter.length;i++){
        routerDatas.push(new RouterData(defaultRouter[i]));
    }


    m_routerConfig = routerDatas;
}
loadRouterConfig();
// 把路由写入硬盘
function writeRouterConfig(configs){
    fileUtils.mkPath(routerPath);

    var writeConfigs = [];
    for(var i=0;i<configs.length;i++){
        writeConfigs.push(configs[i].getWriteData());
    }
    var str = JSON.stringify(writeConfigs);
    // 删除老文件
    fileUtils.deleteFileSync(routerFile);
    // 写入到新的文件
    fs.appendFileSync(routerFile, str);
}

var m_nextRouter = 0;   // 保存下个路由
var m_nextRouterKey = '__NEXT_ROUTER_INDEX';
/**
 * 获取1个可用的路由地址
 * @returns {*}
 */
function getNextLiveRouter(request){
    if(m_routerConfig.length == 0)
        return null;

    if(m_nextRouter >= m_routerConfig.length){
        m_nextRouter = 0;
    }

    var m_curIndex = m_nextRouter;
    if(request && (typeof request.params[m_nextRouterKey] === 'number')){
        // request中之前已经决定了使用哪个路由，这样保证同1个请求里面的所有后端接口都请求到同1个服务器
        m_curIndex = request.params[m_nextRouterKey];
        // 这种情况下应该不需要判断live属性
        var curRouter = m_routerConfig[m_curIndex];
        if(curRouter.isLive()){
            return curRouter;
        }else{
            delete request.params[m_nextRouterKey];
            return getNextLiveRouter(request);
        }
    }else{
        var curRouter = m_routerConfig[m_curIndex];
        m_nextRouter++;
        if(curRouter.isLive()){
            if(request){
                // 该请求中的第一个接口,保存路由信息供下一次接口调用使用
                request.params[m_nextRouterKey] = m_curIndex;
            }

            return curRouter;
        }else{
            return getNextLiveRouter(request);
        }
    }
}
/**
 * 监听SIGUSR1消息来实现路由，
 * 因为生产环境会启多个进程，要通知多个进程去更新路由，
 * 目前没想到比SIGUSR1的方法
 */
process.on('SIGUSR1', function() {
    log.info('reci SIGUSR1');
    // 重新加载路由
    loadRouterConfig();
});

module.exports = {
    getRouter : function(request){
        return getNextLiveRouter(request);
    },
    /**
     * 更新路由
     * @param configs
     * @returns {Array}
     */
    updateRouter : function(configs){
        if(!configs){
            return;
        }
        var routerDatas = [];
        for(var i=0;i<configs.length;i++){
            routerDatas.push(new RouterData(configs[i]));
        }
        m_routerConfig = routerDatas;

        // 写入文件
        writeRouterConfig(m_routerConfig);
    }
}
