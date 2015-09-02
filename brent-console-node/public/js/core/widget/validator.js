/**
 * 通用的验证框架
 * @version: 0.2
 * @example :
   1.在各个输入框里面绑定验证规则(所有支持的规则见本文件最底部)，有些验证规则需要传参数的，直接在规则名后面加:参数，比如下面的max-value:100
   <input type='text' valid-name='登录名' validator="required min-value:0 max-value:100" />
   <input type='text' valid-name='密码' valid-msg='required:不能为空 email:ddd' validator="required email fn:oncheck" />

   2.如果需要点击某个提交按钮的时候再验证下(之前是在输入框blur的时候验证的)，需要给按钮加上validator_btn的class，比如
   <input type='submit' value='提交' class='validator_btn' />

   3.在脚本里面初始化验证,#frm是验证表单的名字(可以说任何元素，initValid会查找#frm子元素中所有validator输入框进行验证),
     'submit'绑定了表单验证通过后执行的事件，这里一般用于提交一些数据或进行下一步操作
     $("#frm").initValid({
        'btnSelector' : 'validator_btn',
    	'submit':function(){
    		$.ajax(....)
    	}
     });
   @changelog
     0.2 增加自定义的正则和函数
 */
(function(){
   $.fn.extend({
        // 初始化验证器
        initValid : function(conf){
            // 判断是否选择了元素
            if (!this.length) {
			    throw "没有选择任何东西";
			    return;
		    }
            // 根据validator生成对应的rule
            var self = $(this[0]);
            var childrenIds = new Array();


            self.find('textarea[validator],input[validator],select[validator]').each(function(){

            	var jObj = $(this);
            	var validator = jObj.attr('validator');
            	if(!validator || $.trim(validator)==''){
            		return;
            	}

            	var vals = validator.split(' ');
            	for(var i=0;i<vals.length;i++){
            		var val = vals[i];
            		if($.trim(val)==''){
            			continue;
            		}

            		var index = val.indexOf(':');
            		var key=val,value=null;
            		if(index >= 0){
            			key = val.substr(0,index);
            			value = val.substr(index+1);
            		}
            		$._initValidator(jObj,key,value,null);
                    childrenIds.push(jObj);
            	}
            });

            var submitFn = conf['submit'];
            var mySubmitFn = function(jObj){
                try {

                    if($(this).hasClass('ignore-validator')){
                        // 忽略验证
                        submitFn.call(this);
                        return false;
                    }
                    var ret = self.valid(true);
                    if (ret && submitFn) {
                        submitFn.call(this);
                    }
                }catch(e){
                    console.error(e);
                }
                return false;
            };
            // form ，添加form验证
            if(self.is("form")){
                self[0].onsubmit = mySubmitFn;
            }

            if(submitFn){
                var btnSelector = conf.btnSelector || '.validator_btn';
                self.find(btnSelector).each(function(){
                    this.onclick = mySubmitFn;
                });
            };

		    self.data($.validator.setting.data_key,childrenIds);

            return self;
        },
        // 验证
        valid : function(autoFocus){
            if(!this.length) return true;
            try{
                var _self = $(this[0]);
                var ret = true; // 验证结果

                //var _self = $(this);
                var _validator = _self.data($.validator.setting.data_key);
                if(!_validator)
                    throw this.id + " 没有绑定验证器";

                if(_validator instanceof Array){
                    // 绑定的数据是juqery对象组成的数组
                    //var ids = _validator.split(";");
                    for(var i=0;i<_validator.length;i++){
                         ret = _validator[i].valid(autoFocus) && ret;
                    }
                }else{
                    var value = _self.val();

                    // 绑定的是validator对象
                    for(var i=0;i<_validator.rules.length;i++){
                        var _validClass = _validator.rules[i].validClass;
                        var _params = _validator.rules[i].params;

                        var _ret = true;
                        if(value != null && ($.trim(value).length !== 0 || _validClass == 'required') && !_self.is(':hidden')){

                            // 非空值的情况下，或者是必填字段，才需要验证
                            var _match = $.validator.funs[_validClass];

                            //alert((typeof _match).toString());
                            if($.isFunction(_match)){     // 是函数
                                _ret = _match.call(null,value,_params);
                            }else{    //是正则表达式
                                _ret = value.match(_match);
                            }
                        }

                        if(!_ret){
                            // 验证失败
                            _validator.currentRule = i;
                            $.validator.setError(_self,autoFocus);
                        }else{
                            // 验证通过
                            $.validator.removeError(_self);
                        }

                        ret = ret && _ret;
                        // 如果1个元素有多个验证规则，
                        // 但1个规则失败的时候就跳出改元素的其他规则验证
                        if(!_ret) break;
                    }
                }
                return (!ret?false:ret);
            }catch(e){
                throw e;
                return false;
            }
        },
        // 清空验证绑定
        clearValid :function(){
            if(!this.length) return true;

            try{
                // 循环验证
                this.each(function(ret){
                    var _self = $(this);
                    _validator = _self.data($.validator.setting.data_key);

                    if(_validator instanceof Array){
                        // 绑定的数据数组
                    	for(var i=0;i<_validator.length;i++){
                            ret = _validator[i].clearValid() && ret;
                       }
                    }else{
                        // 去除所有的事件,因为用到clearValid一般是页面跳转，
                        // 或者删除元素才使用这个，所以可以去除所有
                        _self.unbind();
                    }
                    _self.removeData($.validator.setting.data_key);
                });
            }catch(e){
                throw e;
                return false;
            }
        }
    });
    $._initValidator = function(target,ruleClass,params,msg){
    	// 绑定数据
        var _validator = target.data($.validator.setting.data_key);
        if(!_validator){
            _validator = new $.validator();
        }
        // 可以自定义消息
        msg = target.attr('valid-msg');
        
        _validator.addRule(ruleClass, params,msg);

        target.data($.validator.setting.data_key,_validator);
        // 获取中文描述
        var name = target.attr('valid-name');

        if(name==null || name==''){
        	var lable = target.parent().prev();
        	if(lable.length>0){
        		name = lable.text().replace(/[:：]/g,'');
        	}
        }
        _validator.name = name || '';
        // 绑定blur事件
        target.blur(function(){
            var jThis = $(this);
            // 日期控件延迟进行检查
            if(jThis.hasClass('wd-datepicker')){
                window.setTimeout(function(){
                    jThis.valid(false);
                },100);
            }else{
                jThis.valid(false);
            }
        });
	};
    // 验证容器
    $.validator = function(){
        // 该控件对应的所有验证规则
        this.rules = [];
        // 当前验证出错的规则index
        this.currentRule = 0;
        // 添加验证规则
        this.addRule = function(validClass,params,msg){
            var msgData = {};
            if(typeof msg === 'string') {
                // 拆分成多个消息
                var msgs = msg.split(' ');
                for(var i=0;i<msgs.length;i++){
                    var ruleMsg = msgs[i].split(':');
                    if(ruleMsg.length == 2){
                        msgData[ruleMsg[0]] = ruleMsg[1];
                    }
                }
            }
            this.rules[this.rules.length] = {
                'validClass' : validClass,
                'params' : params,
                'msg' : msgData
            };
        };
        this.name = '';
    };
    // 设置显示错误
    $.validator.setError = function(target,autoFocus){
        target.addClass($.validator.setting.fail_class);
        var icon_target = target;
        if($.validator.setting.create_icon){    //创建图标
        	var tid = target.attr("id");
            iconId = $.validator.setting.icon_prexId + tid;

            if(!document.getElementById(iconId)){ // 判断是否已创建
                spnIcon = document.createElement("SPAN");
                spnIcon.id = iconId;
                spnIcon.innerHTML = "&nbsp;";
                spnIcon.className = $.validator.setting.icon_class;

                target.after(spnIcon);
            }

            icon_target = $("#" + iconId);
            icon_target.show();

            icon_target.hover(
                function(evt){
                    $.validator.msg.show.call($.validator.msg,$(this),evt);
                },
                function(){
                    $.validator.msg.hide();
                }
            );
        }

        target.hover(
            function(evt){
                $.validator.msg.show.call($.validator.msg,icon_target,evt);
            },
            function(){
                $.validator.msg.hide();
            }
        );

        if(autoFocus){
            target.focus();
        }
    };
    // 清除错误
    $.validator.removeError = function(target){
        target.removeClass($.validator.setting.fail_class);
        var icon_target = target;
        if($.validator.setting.create_icon){
            iconId = $.validator.setting.icon_prexId + target.attr("id");
            icon_target = $("#" + iconId);
            icon_target.hide();
        }
        icon_target.unbind('mouseenter').unbind('mouseleave');
        target.unbind('mouseenter').unbind('mouseleave');

        // 此处隐藏错误提示框，因为已unbind了mouseleave，所以不会自动消失
        $.validator.msg.hide();
    };
    //消息显示对象
    $.validator.msg = {
        init : function(){
            divP = document.createElement("DIV");
            divP.id = $.validator.setting.msg_id;
            divT = document.createElement("DIV");
            divT.id = $.validator.setting.msg_text_id;
            divP.appendChild(divT);

            var divArrow = document.createElement("DIV");
            divArrow.id = $.validator.setting.msg_arrow_id;
            divP.appendChild(divArrow);
            document.body.appendChild(divP);
        },
        show : function(target,evt){
            if(!document.getElementById($.validator.setting.msg_id))
                this.init();
            // 默认情况下target是图标，不是输入框
            var dataTarget =  target;
            if($.validator.setting.create_icon){
                dataTarget = $("#" + target.attr("id").substring($.validator.setting.icon_prexId.length));
            }
            _validator = dataTarget.data($.validator.setting.data_key);
            rule = _validator.rules[_validator.currentRule];

            var msg = rule.msg[rule.validClass] || $.validator.messages[rule.validClass];

            _msg = $.validator.format(msg,rule.params,_validator.name);

            $("#" + $.validator.setting.msg_text_id).html(_msg);

            var offset = target.offset();
            // 设置绝对位置
            _msgbox = $("#"+$.validator.setting.msg_id);
            var msgH = target.outerHeight();
            _msgbox.css("top",(offset.top+msgH) + "px");
            _msgbox.css("left","-5000px");	// 先在看不见的位置显示，这样才能取到msgBox的宽度
            // 箭头位置
            //$("#"+$.validator.setting.msg_arrow_id).css('right',(msgW-(rect.right*0.04)) + 'px');
            _msgbox.show();
            var _msgWidth = _msgbox.outerWidth();
            var left = (offset.left + (target.outerWidth() - _msgWidth));
            _msgbox.css("left",left + "px");
        },
        hide : function(){
            $("#" + $.validator.setting.msg_id).hide();
        }
    };
    //  格式化文字
    $.validator.format=function(msg,params,name){
    	name = name || '';
    	msg = msg.replace(new RegExp("\\{name\\}", "g"), name);
        if(params==null) return msg;

        // 暂时只支持1个参数
        return msg.replace(new RegExp("\\{0\\}", "g"), params);
    };
    // 默认配置
    $.validator.setting={
        // 是否创建错误图标
        create_icon :false,
        msg_id : 'validator_msg',
        msg_arrow_id : 'validator_msg_arrow',
        msg_text_id : 'validator_msg_text',
        data_key : 'validator',
        icon_prexId : 'vi_',
        icon_class : 'validator_icon',
        fail_class : 'validator_fail'
    };
    // 默认提示信息
    $.validator.messages={
        'required':'{name}不能为空',
        'int':'{name}只能为整数',
        'positive_int' : '{name}只能是大于0的整数',
        'num' : '{name}只能为数字字符',
        'float':'{name}只能为数字',
        'positive_float' : '{name}只能是大于0的数字',
        'email':'请输入有效的邮件地址',
        'url':'请输入有效的URL地址',
        'pattern':'输入的值不匹配',
        'greater' : '{name}必须大于 {0}',
        'min_value':'{name}不能小于 {0}',
        'max_value':'{name}不能大于 {0}',
        'gt':'{name}必须大于 {0}',
        'equals':'输入必须与 {0} 一致',
        'must_select':'请选择{name}',
        'min_length' : "{name}不能少于{0}个字符",
        'max_length' : "{name}最多输入{0}个字符",
        'pwd_equals' : '二次输入的{name}不一致',
        'lte':'输入的值必须小于等于{0}的值',
        'mobile':'请输入正确的手机号',
        'id_card':'请输入正确的身份证',
        'date' : '请输入正确的日期格式:1980-05-28',
        'regex' : '${name}输入格式不对'
    };
    /**包含验证的所有函数**/
    $.validator.funs={
        'required' : /[\S]+/,
        'int' :  /^[-]{0,1}[\d]+$/,
        'num' :  /^[\d]+$/,
        'positive_int' : /^[\d]+$/,
        'float' : function(v){return !isNaN(v) && v.indexOf('.') != 0},
        'positive_float' : /^\d+(\.\d+)?$/,
        'email' : /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/,
        'url' : /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i,
        'pattern' : function(v,p){return v.match(p);},
        'greater' : function(v,params){return parseFloat(v)>parseFloat(params);},
        'min_value' : function(v,params){return parseFloat(v)>=parseFloat(params);},
        'gt' : function(v,params){return parseFloat(v)>parseFloat(params);},
        'max_value' : function(v,params){return parseFloat(v)<=parseFloat(params);},
        'equals' : function(v,params){return v==params;},
        'lte':function(v,params){
            return parseFloat(v)<=parseFloat($("input[name='"+params+"']").val());
        },
        'must_select' : function(v){return parseInt(v) > 0;},
        "min_length" : function(v,params){return v.length >= parseInt(params);},
        "max_length" : function(v,params){return v.length <= parseInt(params);},
        'pwd_equals' : function(v,params){return v == $("#"+params).val();},
        'mobile':/^1[\d]{10}$/,
        'id_card':/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/,
        'date' : /^[1-2]\d{3}-[0-1]\d-[0-3]\d/,
        'fn': function(v,params){
            // 支持函数调用
            var code = 'var ret =' + params + '("' + v + '")';
            eval(code);
            return ret;
        },
        'regex' : function(v,params){
            var re = new RegExp(params,'ig');
            return re.test(v);
        }
    };

})();