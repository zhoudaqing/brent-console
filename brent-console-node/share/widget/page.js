/**
 * Created by xiongxing on 2014/6/20.
 * 分页组件
 */

(function(mod,key,isServer){

    mod[key]={
        /**
         * 创建分页，注意，这里只创建html代码，
         * 而不绑定事件，事件代码中自己绑定
         * @param {object} data
         *  pageCount: 2
            pageNo: 1
            pageSize: 10
            record: []
            recordCount: 10
            totalRecordCount: 17
         */
        createPage : function(data){
            // 只有一页的时候不显示分页,但需要放1个隐藏域
            if(data.pageCount <=1) {
                return '<input type="hidden" name="pageno" value="1" />';
            }
            var html = '<div class="wd-page"><input type="hidden" name="pageno" value="1" />';
            html += '<ul>';
            // 只显示当前页的前后2页
            var startPage = data.pageNo - 2;
            if(startPage < 1) startPage = 1;

            // 添加首页，上一页按钮
            if(data.pageNo > 1){
                html += '<li data-value="1">首页</li>';
                html += '<li data-value="' + (data.pageNo - 1) +'">上一页</li>';
            }
            // 一次最多显示5个页面可以点击
            for(var i = startPage;i<=data.pageCount && i<(startPage+5);i++){
                html += '<li data-value="' + i + '" class="' + (data.pageNo==i?'active':'') + '">' + i + '</li>';
            }

            if(data.pageNo < data.pageCount){
                html += '<li data-value="' + (data.pageNo + 1) + '">下一页</li>';
                html += '<li data-value="' + data.pageCount +'">末页</li>';
            }

            html += '</ul>';
            html += '</div>';

            return html;
        },
        /**
         * 创建查看更多地分页
         * @param {object} data 分页的数据，如果为空，表示第一次加载
         */
        createPageMore : function(data){

            if(data && data.pageNo >= data.pageCount){
                // 最后一页
                return '<input type="hidden" name="pageno" value="' + data.pageNo + '" />';
            }

            var html = '<div class="wd-page-more"><div class="more-line"></div><span>' +
                (data?'查看更多':'加载中...') + '</span><input type="hidden" name="pageno" value="' +
                ((data?data.pageNo:0) + 1) + '" /></div>';

            return html;
        }
    }

    //客户端绑定
    if(!isServer){
        $(document).ready(function(){
            $('.wd-page ul li').live('click',function(){
                    var jThis = $(this);
                    if(jThis.hasClass('active')){
                        // 当前页面不能点击
                        return;
                    }
                    jThis.addClass('active');
                    var pageNo = parseInt(jThis.attr('data-value'));
                    var jParent = jThis.parent().parent();
                    jParent.find('input[name="pageno"]').val(pageNo).change();
            });

            $('.wd-page-more>span').live('click',function(){
                var jThis = $(this);
                //jThis.html('加载中...');

                jThis.parent().find('input[name="pageno"]').change();
            });
        });
    }
})((typeof module !== 'undefined')?module: Q.widget, (typeof module !== 'undefined')?'exports':'page',(typeof module !== 'undefined'));