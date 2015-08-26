/**
 * Created by xiongxing on 2014/6/17.
 */

var bizFormat = require('./biz-format'),
    bizUtils = require('./biz-utils'),
    preBinder = require('../lib/binder/pre-binder'),
    tagsSelect = require('./widget/tags-select'),
    htmlCreate = require('./widget/html-create'),
    stringUtils = require('./utils/string'),
    moneyUtils = require('./utils/money'),
    arrayUtils = require('./utils/array'),
    dateUtils = require('./utils/date'),
    page = require('./widget/page');
/**
 * 后端加载所有前、后端共享的代码
 * @param {application} app
 */
exports.share = function(app){
    app.locals.Q = {};          // 保持和前端统一
    app.locals.Q.bizFormat = bizFormat;
    app.locals.Q.bizUtils = bizUtils;
    app.locals.Q.date = dateUtils;

    app.locals.Q.binder = {};
    app.locals.Q.binder.bindMore = preBinder.bindMore;

    app.locals.Q.widget = {};
    app.locals.Q.widget.page = page;
    app.locals.Q.widget.tagsSelect = tagsSelect;
    app.locals.Q.widget.htmlCreate = htmlCreate;

    app.locals.Q.string = stringUtils;
    app.locals.Q.money = moneyUtils;
    app.locals.Q.array = arrayUtils;
}