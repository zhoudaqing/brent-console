/**
 * http代理，结合http-router路由信息，主要也可以用于统计接口调用成功，失败情况
 */
var _request = require('request'),
    log4js = require('log4js'),
    httpRouter = require('./http-router');

var logger = log4js.getLogger('router');
logger.setLevel('INFO');

module.exports ={
    /**
     * 请求
     * @param url   请求的url，不到host
     * @param options
     * @param callback
     */
    request : function(request,url,options,callback){
        var router = httpRouter.getRouter(request);        // 如果机器全部发布，可能会导致路由为空
        url = (router?router.url:'') + url;
        options.url = url;
        options.pool = false;

        _request(options,function (error, response, body){


            if (error || (response && response.statusCode >= 500)) {
                logger.error(url + ' ' + (response && response.statusCode) + ' ' + (error || ''));

                router.addFailCall();
            }else{

                logger.info(url + ' ' + (response && response.statusCode));

                router.addAccessCall();
            }

            callback(error,response,body);
        });
    }
}
