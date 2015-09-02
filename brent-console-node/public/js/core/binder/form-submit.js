/**
 * 表单提交数据绑定
 */
// 定义几个全局notify消息
/**
 * 表单提交前
 */
var G_BIND_FORM_BEFORE_SUBMIT = 'G_BIND_FORM_BEFORE_SUBMIT';
/**
 * 表单提交成功
 */
var G_BIND_FORM_SUBMIT_SUCC = 'G_BIND_FORM_SUBMIT_SUCC';
/**
 * 表单提交失败
 * @type {string}
 */
var G_BIND_FORM_SUBMIT_ERROR = 'G_BIND_FORM_SUBMIT_ERROR';
/**
 * 下一步提示
 */
var G_BIND_FORM_NEXT_STEP = 'G_BIND_FORM_NEXT_STEP';
/**
 * 有新的表单被动态创建，需要绑定
 */
var G_BIND_FORM_NEW_FORM_CREATE = 'G_BIND_FORM_NEW_FORM_CREATE';

(function () {
    // 判断是jQuery还是zepto
    var isJquery = (typeof jQuery !== 'undefined');

    function FormSubmitBinder(form) {
        this.jForm = $(form);
        this.validCallback = this.jForm.attr("validCallback");
        var that = this;

        // 有些按钮不能默认是submit，如果默认是submit，可能导致没绑定form，用户就点击了提交，
        // 但又希望按钮有submit属性(比如支持回车提交)
        // 这种方法直接可以设置form变动onsubmi=return false;
        /**
         * 拦截提交表单
         */
        this.jForm.initValid({
            'btnSelector' : '.next,.validator_btn',
            'submit': function (e) {

                /*
                var cannext=nextStep(this);
                if(!cannext){
                    return false;
                }*/


                if($(this).hasClass('next')){
                    nextStep(this);
                    // 非提交按钮，可能是下一步按钮
                    return false;
                }

                var btn = $(this);
                if(btn.is('form')){
                    // 表单，则默认是submit按钮的点击
                    btn = btn.find('input[type="submit"]');
                }

                var canSubmit = Q.notify.broadcast(G_BIND_FORM_BEFORE_SUBMIT,{
                    form:that.jForm,
                    "btn":btn
                });
                if(typeof canSubmit !== 'undefined' && canSubmit ==false){
                    return false;
                }

                if(btn.hasClass('btn_loading') || btn.attr('disabled')){
                    // 如果还在loading,不提交，防止用户重复点击
                    return false;
                }
                // post 数据
                btn.addClass('btn_loading');
                // 生成表单数据
                var url = encodeURIComponent(that.jForm.attr('action'));
                var formDataStr = that.jForm.serialize();
                Q.proxy(url,formDataStr,function(data){
                    btn.removeClass('btn_loading');
                    // 提交成功
                    Q.notify.broadcast(G_BIND_FORM_SUBMIT_SUCC,{
                        form:that.jForm,
                        data:data.data
                    });
                },function(data){
                    if(data && data.msg)
                        QH.tip.err(data.msg);

                    Q.notify.broadcast(G_BIND_FORM_SUBMIT_ERROR,{
                        form:that.jForm,
                        data:data
                    });
                });
                // 屏蔽默认的表单提交
                return false;
            }
        });

        // 绑定hash，下一步，上一步，支持浏览器的前进回退
        Q.widget.hash.bindOtherChange(function(hash){
            var step = 1;   // 默认第一步
            if(hash.length > 0){
                step = parseInt(hash.replace('step',''));
                if(isNaN(step)){
                    step = 1;
                }
            }

            //用于遍历是否需要显示的元素块
            that.jForm.find('[data-displayid]').each(function() {
                var jThis = $(this),
                    $id = $('#' + jThis.attr('data-displayid')),
                    isShow = $id.is(':hidden') ? false : true;
                if(isShow) {
                   jThis.show(); 
                } else {
                    jThis.hide();
                }   
            })

            var jShowStep = $('.step' + step);
            if(step > 1) {
                // copy值用于确认页面
                that.jForm.find('input[type="text"],textarea,input[type="radio"]:checked,input[type="hidden"]').each(function () {
                    var jThis = $(this),
                        val = jThis.val(),
                        name = jThis.attr('name');
                        console.log(jThis.attr('name'));
                        console.log($.inArray(jThis.attr('type'), ['radio']));
                        console.log(jThis.attr('type'));
                    if($.inArray(jThis.attr('type'), ['radio']) != -1) {
                        val = jThis.attr('title');
                    }
                    if($.inArray(jThis.get(0).tagName.toLowerCase(), ['option']) != -1) {
                        val = jThis.text();
                        name = jThis.parent().attr('name');
                    }
                    try {
                        jShowStep.find('[name="' + name + '"]').html(val);
                    } catch(e) {
                        console.log(e);
                    }
                });
                that.jForm.find('select option:selected').each(function () {
                    var jThis = $(this),
                        val = jThis.val(),
                        name = jThis.attr('name');
                    if($.inArray(jThis.attr('type'), ['radio']) != -1) {
                        val = jThis.attr('title');
                    }
                    if($.inArray(jThis.get(0).tagName.toLowerCase(), ['option']) != -1) {
                        val = jThis.text();
                        name = jThis.parent().attr('name');
                    }
                    try {
                        jShowStep.find('[name="' + name + '"]').html(val);
                    } catch(e) {
                        console.log(e);
                    }    
                });
            }

            that.jForm.find('.step1,.step2,.step3,.step4').hide();
            jShowStep.show();
        });
        var nextStep = function(obj){
            var step = parseInt($(obj).attr('bind-step'));

            var canSubmit = Q.notify.broadcast(G_BIND_FORM_NEXT_STEP,{curStep:step,nextStep:(step+1)});

            //return canSubmit;


            if(typeof canSubmit !== 'undefined' && canSubmit ==false){
                return ;
            }else{
                location.href = '#step' + (step+1);
            }
        }
        var prexStep = function(){
            var step = parseInt($(this).attr('bind-step'));
            location.href = '#step' + (step-1);

//            that.jForm.find('.step' + step).hide();
//            that.jForm.find('.step' + (step-1)).show();
        }
        // 绑定下一步按钮,目前最大支持5个步骤
        var stepIndex = 1;
        this.jForm.find('.step1 .next,.step2 .next,.step3 .next,.step4 .next').each(function(){
            // 记下step标签，使用记标签，而不是直接绑定next，
            // 然后用curStep这种游标的方式，是为了防止用户连续点击
            $(this).attr('bind-step',stepIndex++);
            // 这里不需要绑定，在验证逻辑里面已经绑定了
            //$(this).bind('click',nextStep);
        });
        // 绑定上一步
        stepIndex = 2;
        this.jForm.find('.step2 .prex,.step3 .prex,.step4 .prex,.step5 .prex').each(function(){
            $(this).attr('bind-step',stepIndex++);
            $(this).bind('click',prexStep);
        });

        return this;
    }

    $(document).ready(function(){
        var init = function(){
            // 自动绑定所有列表
            $('.binder-form-submit').each(function(){
                var jThis = $(this);
                var hasBinder = jThis.data('binder-form');
                if(hasBinder)
                    return;

                jThis.data('binder-form','1');
                var bind = new FormSubmitBinder(this);
            });
        }

        Q.notify.listen(G_BIND_FORM_NEW_FORM_CREATE,init);

        init();

        // 当用户在非step1的页面进行刷新的时候，需要重新回到step1，不然会引起很多问题，form分步提交必须从第一步开始
        if(location.hash && location.hash.indexOf('#step') == 0){   // 当前步骤不
            if($('.binder-form-submit').length > 0 && location.hash != '#step1'){
                location.href = '#step1';
            }
        }
    });
})();
