/**
 * 系统配置
 */
var _domain ='localhost';
module.exports = {
    replaceCookie : true,
    serverContext : '/console',
    evn : "net",
    routerPath : "router/",
    domain : _domain,
    httpClientConfigs :  {
        appName : 'brent-console',
        route: [
            //{host: '10.60.60.49', port: 8080, live: true},
            {host: '127.0.0.1', port: 8083, live: true}
        ]
    },
    context :"",
    debug  : true,
    port   : 8089,
    title   : "Brent Console"
}