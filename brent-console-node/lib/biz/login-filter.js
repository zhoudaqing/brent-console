/**
 * Created by xiongxing on 2014/6/20.
 * 用于登录控制
 */
var qhClient = require('../biz/qhee-client'),
    loginConf = require('../biz/login-conf'),
    bizUtils = require('../../share/biz-utils.js');

var m_loginRouter = [];
for(var i=0;i<loginConf.length;i++){
    m_loginRouter.push(
        {
            reg : new RegExp(loginConf[i].match,'i'),
            login : loginConf[i].loginUrl
        }
    );
}

module.exports = {
    /**
     * 登录状态检查,
     * 在页面顶部配置 g_loginType= 对应的值
     * @param {int} status
     *   0: 不需要登录
     *   1: 必须登录才能访问，
     *   2：必须开户才能访问,
     *   3：必须开户并且登录交易账户才能访问
     *   4：只有合作伙伴才能访问
     *   5: 认证后的合作伙伴才能访问
     * @param {object} user 当前登录用户
     * @param {object} req  request
     * @param {object} res  response
     * @param {function} callback 回调,有几个异步请求，需要进行判断，所有只能回调
     */
    check : function(loginType,ctx,callback){
        var g_user = ctx.data.g_user;
        var request = ctx.req;
        var response = ctx.res;
        
        var curPage = encodeURIComponent(request.originalUrl);

        if(g_user == null){
            // 匹配配置，有些地方用的登陆页面不一样
            //var isMatch = false;
            for(var i=0;i<m_loginRouter.length;i++){
                if(m_loginRouter[i].reg.exec(request.path)){
                    var loginUrl = m_loginRouter[i].login;
                    if(loginUrl.indexOf('?') == -1){
                        loginUrl += '?goto_page=' + curPage;
                    }else{
                        loginUrl += '&goto_page=' + curPage;
                    }
                    response.redirect(loginUrl);
                    return;
                }

            }
        }


        if(loginType == 1 && g_user == null){
            // 仅仅需要登陆，就不需要执行后面的开户状态检查
            response.redirect('/common/user/login?goto_page=' + curPage);

            return;
        }else{
            callback();
        }
    }
}
