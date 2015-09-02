/**
 * 绑定搜索列表
 *  .binder-search-list
 * 表单里面支持配置数据：
 *  data-target ：数据显示区域，jquery selector,,默认就是当前的binder-search-lis
 *  data-tpl : 对应模板文件
 *  data-key : 对应的数据key，默认就是data
 *  data-callback :默认的操作执行完毕之后所需要的执行的callback方法。
 *  data-first-load : false | true , 第一页页面出现后是否加载。默认不加载
 *
 * 表单里面输入框支持的class属性
 * .binder-enter-key: 绑定回车事件
 * .no-binder : 不绑定change事件
 */
var G_BIND_SEARCH_LIST_BEFORE_LOADING = 'G_BIND_SEARCH_LIST_BEFORE_LOADING';
var G_BIND_SEARCH_LIST_LOAD_SUCC = 'G_BIND_SEARCH_LIST_LOAD_SUCC';

(function(){
    var defaultOptions = {
        firstLoad : false,
        key : 'data',
        emptyTip : '没有合适数据'
    }
    var searchIdKey = "binder-search-id";
    var id = 0;
    /**
     *
     * @param options
     * {
     *      form :          // 对应的表单
     * }
     * @constructor
     */
    var SearchListBinder = function(obj,options){
        Q.extend(options,defaultOptions);

        this.jDom = $(obj);
        this.jDom.data(searchIdKey,searchIdKey + (id++));   // 记住id
        this.options = options;
        this.jTarget = $(options.target);
        if(this.jTarget.length==0)
            this.jTarget = this.jDom;

        this.jTemplate = this.jTarget.find('.binder-template');
        this.tplId = options.tpl;
        this.showPage = this.jTarget.find('.binder-pager').length>0;
        this.key = options.key;
        this.callback = options.callback;


        var that = this;
        this.jTemplate.css('position','relative');

        this.jDom.submit(function(){
            var formDataStr = that.jDom.serialize();

            var url = window.encodeURIComponent(that.jDom.attr('action'));
console.log(that.jDom.attr('action'));
            // 广播
            Q.notify.broadcast(G_BIND_SEARCH_LIST_BEFORE_LOADING,{
                jDom : this.jDom
            });
            that.jTemplate.append('<div class="absolute-loading"><div class="mask"></div><div class="img"></div></div>');
            Q.proxy(url,formDataStr,that.tplId,function(data){
                that.jTarget.find('.absolute-loading').remove();

                var renderData = {}
                renderData[that.key] = data.data;
                // 后台返回数据有分页则返回record字段，否则只有data字段
                if((data.data.record && data.data.record.length == 0) || (data.data && data.data.length == 0)){
                    // 没有数据
                    that.jTemplate.html('<div class="no-data">'+that.options.emptyTip+'</div>');
                    that.jTarget.find('.binder-pager').html('');
                }else {
                    var html = template.render(that.tplId, renderData);
                    that.jTemplate.html(html);

                    // 刷新分页
                    if (that.showPage) {
                        that.jTarget.find('.binder-pager').html(Q.widget.page.createPage(data.data));
                        // 绑定1个id
                        that.jTarget.find('.binder-pager').data(searchIdKey,that.jDom.data(searchIdKey));
                    }
                }

                // 重设当前页分页隐藏域的值,这样在重新搜索的时候才能从第一页开始
                that.jDom.find('input[name="pageno"]').val(1);

                // 广播
                Q.notify.broadcast(G_BIND_SEARCH_LIST_LOAD_SUCC,{
                    jDom : that.jDom,
                    "data" : data
                });
                if(that.callback)
                    window[that.callback](renderData)
            },function(){
                that.jTemplate.find('.absolute-loading').remove();
            });

            //拦截submit表单提交
            return false;
        });

        this.jDom.find('input,select,textarea').live('change',function(){
            var jThis = $(this);
            // no-binder。binder-enter-key 2个样式不直接引发sumbit
            if(jThis.hasClass("no-binder") || jThis.hasClass("binder-enter-key")){
                return;
            }

            //延迟300毫秒，可能会有其他的时间对form进行操作。确保提交时候form是最终形态
            var tmp = function(){
                return function(){
                    that.jDom.submit();
                }
            }();

            setTimeout(tmp, 300)
        });

        // 如果分页组件不在jDom中，需要绑定分页组件
        if(this.jDom.find('input[name="pageno"]').length == 0){
            // 创建1个分页隐藏域
            this.jDom.append('<input type="hidden" name="pageno" />');
            // 监听组件
            that.jTarget.find('.binder-pager input[name="pageno"]').live('change',function(e){
                if(that.jTarget.find('.binder-pager').data(searchIdKey) != that.jDom.data(searchIdKey)){
                    // 非当前表单
                    return;
                }
                // 组织冒泡，防止其他的绑定了该事件
                e.stopPropagation();
                that.jDom.find('input[name="pageno"]').val(this.value).change();
            });
        }
        // 监听回车事件
        this.jDom.find('.binder-enter-key').bind('keyup',function(e){
            if(e.keyCode == 13){
                that.jDom.submit();
                return false;
            }
        });

        // 是否需要第一次加载
        if(options.firstLoad){
            this.jDom.submit();
        }
        return this;
    };

    $(document).ready(function(){
        // 自动绑定所有列表
        $('.binder-search-list').each(function(){
            var options = Q.attrWrapOptions(this);
            new SearchListBinder(this,options);
        });
    });

})();
