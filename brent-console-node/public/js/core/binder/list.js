/**
 * 没加载完一页数据就触发
 * <div class="binder-list" data-url="/qhee-webapp/action/query?business_id=<%=params.id%>&pagesize=3"
    data-page-type="more" data-tpl="stock-middle/comment">
        <div id="comment-list" class="binder-template clearfix">

        </div>
        <div class="binder-pager clearfix">

        </div>
 </div>
 */
var G_BIND_LIST_DATA_LOADED = 'G_BIND_LIST_DATA_LOADED';

(function() {
    var defaultOptions = {
        //showType : 'replace',
        emptyTip : '没有合适数据',
        firstLoad: false,
        key: 'data',
        pageType: ''
    }
    var ListBinder = function(dom, options) {
        Q.extend(options, defaultOptions);

        this.jDom = $(dom);
        this.jTarget = this.jDom;
        this.options = options;
        this._setMinHeight = false;     // 标记是否代码自动设置了min-height

        if (options.target) {
            this.jTarget = $(options.target);
        }
        // 数据列表显示位置
        this.jDomTemplate = this.jTarget.find('.binder-template');
        // 分页显示位置
        this.jDomPager = this.jTarget.find('.binder-pager');

        var that = this;
        /**
         * 显示加载中
         */
        var showLoading = function() {
                if (that.options.pageType === '')
                    return;

                if (that.options.pageType === 'more') {
                    var wdMore = that.jDomPager.find('.wd-page-more>span');
                    if (wdMore.length === 0) {
                        // 第一加载的时候没数据,手动创建1个
                        that.jDomPager.append(Q.widget.page.createPageMore(null));
                    } else {
                        wdMore.html('加载中...');
                    }
                    return;
                }

                if (that.options.pageType === 'page') {
                    var mHeight = parseFloat(that.jTarget.css('min-height'));
                    if(mHeight <=0 ){
                        that.jTarget.css('min-height','200px');
                        that._setMinHeight = true;
                    }
                    that.jTarget.css('position','relative');
                    that.jTarget.append('<div class="absolute-loading"><div class="mask"></div><div class="img"></div></div>');
                }
            }
            // 隐藏加载
        var hideLoading = function() {
            if(that._setMinHeight){
                that.jTarget.css('min-height','0px');
                that._setMinHeight = false;
            }
            if (that.options.pageType === 'page') {
                that.jTarget.find('.absolute-loading').remove();
            }
        }

        var getData = function() {
            // 分页的数据
            var pageno = that.jDomPager.find('input[name="pageno"]').val();
            var formDataStr = 'pageno=' + pageno;
            // 获取数据的url
            var url = encodeURIComponent(that.options.url);

            showLoading();

            Q.proxy(url, formDataStr, that.options.tpl, function(data) {
                hideLoading();

                if((data.data.record && data.data.record.length == 0) || (data.data && data.data.length == 0)){
                    // 没有数据
                    that.jDomTemplate.html('<div class="no-data">'+that.options.emptyTip+'</div>');
                    that.jDomPager.html('');
                } else {
                    var renderData = {}
                    renderData[that.options.key] = data.data;

                    var html = template.render(that.options.tpl, renderData);
                    // 刷新分页
                    if (that.options.pageType === 'more') {
                        that.jDomTemplate.append(html);
                        that.jDomPager.html(Q.widget.page.createPageMore(data.data));
                    } else{
                        that.jDomTemplate.html(html);
                        that.jDomPager.html(Q.widget.page.createPage(data.data));
                    }
                }

                Q.notify.broadcast(G_BIND_LIST_DATA_LOADED, {
                    jDom: that.jDom,
                    data: data
                });
            }, function() {
                hideLoading();
            });
        }

        // 绑定分页改变
        this.jDomPager.find('input').live('change', function(e) {
            e.stopPropagation();
            getData();
        });

        if (this.options.firstLoad) {
            getData();
        }
    }

    // 绑定所有加载组件
    $(document).ready(function() {
        $('.binder-list').each(function() {
            var options = Q.attrWrapOptions(this);

            new ListBinder(this, options);
        });
    });
})();