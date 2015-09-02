/**
 * 所有通用方法的前置命名空间
 */
var Q = QH = {

};
// 重新绑定组件的消息
var G_WIDGET_NEW_CREATE = 'G_WIDGET_NEW_CREATE';

Q.widget = {
    _nextUid : 0,
    _curWdigets : {},
    /**
     * 获取某个组件
     * @param jDom
     */
    getWidget : function(jDom){
        var id = jDom.data('g_widget_uid');
        return this._curWdigets[id];
    },

    addWidget : function(jDom,widget){
        var id = 'wd-uid-' + this._nextUid++;
        this._curWdigets[id] = widget;
        jDom.data('g_widget_uid',id);
    }
};

/*用于扩展一些配置属性*/
Q.extend = function(target,base){
    for(var k in base){
        if(typeof target[k] === 'undefined'){
            target[k] = base[k];
        }
    }

    return target;
};
/*根据dom的属性配置转成json，实例：
  data-key='sss'  {key : 'sss'}
  data-show-page='true'  {showPage:true}
*/
Q.attrWrapOptions = function(dom,options){
    options = options || {};

    for(var i=0;i<dom.attributes.length;i++){
        var name = dom.attributes[i].name;
        if(name.indexOf('data-') == 0){
            // data-input-name replace to inputName
            name = name.substr(5).replace(/-([a-z])/g,function($1,$2){
                var str = $2 + '';
                return str.toUpperCase();
            });
            var value = dom.attributes[i].value;
            if(value == "true" || value == "false"){
                value = (value == "true");
            }else if(/^[-]\d+$/ig.test(value)){
                value = parseInt(value);
            }else if(!isNaN(value) && value.indexOf('.') != 0){
                value = parseFloat(value);
            }
            options[name] = value;
        }
    }

    return options;
}

if(!('console' in window)){
	// 防止一些地方调用了console,但在IE8下控制台不显示的情况下是没有console对象的
	window.console = {
		log : function(){},
		error : function(){}
	}
}
