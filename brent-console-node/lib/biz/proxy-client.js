var request = require('../upstream/http-client').request,
    log4js = require('log4js'),
    config = require('../../app-config');

var logger = log4js.getLogger('client');

/**
 * 封装调用后台的借口
 */
var host = config.proxyDomain;

var proxDomainReg = new RegExp('Domain=[\\w|\\.]+', 'ig');
var proxPathReg = new RegExp('Path=/[\\w|-]+', 'ig');
var domainReg = new RegExp(config.domain.replace(/\./, '\\.'), 'ig');

var renderError = function (ctx, msg, body) {
    ctx.res.status(500)
    var _msg=msg,_body=body,_stack='';
    if(msg instanceof Error){
        _msg = msg.message;
        _stack = msg.stack;
    }
    //res.locals.__hasRender = true;
    ctx.render('500.html', {
        code : 500,
        message: _msg,
        'body': _body,
        stack : _stack
    });
}
module.exports = {
    /**
     *
     * @param url
     * @param params
     * @param fn
     * @param ctx
     * @param isProxy 是否代理请求
     */
    post: function (url, params, fn, ctx,isProxy) {

        var req = ctx.req;
        var res = ctx.res;

        // 写入客户端返回上来的cookie
        var clientCookie = req.get("Cookie") || '';

        var options = {
            method: 'post',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Cookie' : clientCookie
            },
            timeout : 10000,
            form: params
        };

        var _request = request(ctx.req,config.serverContext + url,options, function (error, response, body) {

            if (!error && response && response.statusCode == 200) {

                // 设置编码
                // 同步写入后台返回的cookie，需要cookie中的domain都替换掉
                if (response.headers['set-cookie'] && response.headers['set-cookie'].length > 0) {
                    if (!res._headers['set-cookie']) {
                        res._headers['set-cookie'] = new Array();
                    }

                    var cookies = new Array();

                    for (var i = 0; i < response.headers['set-cookie'].length; i++) {
                        var cookieValue = response.headers['set-cookie'][i].replace(proxPathReg,'Path=/');
                        cookies.push(config.replaceCookie ? cookieValue.replace(proxDomainReg, 'Domain=' + req.host) : cookieValue);
                    }

                    res.set('set-cookie', cookies);
                }

                if(isProxy){
                    if (fn) {
                        try {
                            fn(JSON.parse(body));
                        }catch(err){
                            // catch异常但不消化异常，是为了异常都被最顶层所消化，
                            // 这里catch是为了响应response
                            renderError(ctx,err,options.url);
                            logger.error(err);
                        }
                    }else{
                        res.render(body);
                    }
                    return;
                }

                if (fn) {
                    try {
                        var json = JSON.parse(body);
                        if (typeof json['ok'] !=='undefined' && !json.ok) {
                            if(config.debug)
                                logger.error(options.url+' '+body);

                            // 出错，打印错误信息
                            renderError(ctx, options.url, json.msg);
                            return;
                        }

                        fn(json);
                    }catch(err){
                        renderError(ctx,err,options.url);
                        throw err;
                    }
                }
            } else {
                logger.error(options.url + '|' + (error||'') + '|' + (response?response.statusCode:0));
                if(isProxy){
                    if(response)
                        res.status(response.statusCode || 500);
                    else
                        res.status(500);

                    res.send(new Buffer(body));
                }else {
                    if(ctx.proxyErrorBreak) {
                        if (response)
                            renderError(ctx, (response && response.statusCode) || '', options.url);
                        else
                            renderError(ctx, error, options.url);
                    }else{
                        fn(null);
                    }
                }
            }
        });
    }
}