/**
 * Created by xiongxing on 2014/6/23.
 * 采用标签式的选择，支持多选，单选
 */
(function(mod,key,isServer){
    /**
     * serverCreate的默认选项
     */
    var _defautOptions = {
        inputName : '',
        idField : 'id',
        nameField : 'name',
        valueField : 'id',
        multi : false
    }

    mod[key]={
        /**
         * 服务器端创建
         * @param {object} options
         *      {
         *          inputName : ''  ,   // 提交表单输入框的名字
         *          data : []   , 数据
         *          idField : 'id',         默认是id
         *          nameField : 'name',
         *          valueField : 'id',      // 选中后获取的值是取id，还是取name(这里只能输入id或者name，不是更idField一样)
         *          multi : false           // 是否多选
         *          any: true              //是否默认有不限选项
         *      }
         */
        serverCreate : function(options){
            for(var k in _defautOptions){
                if(typeof options[k] === 'undefined'){
                    options[k] = _defautOptions[k];
                }
            }

            var html = '<div class="wd-tags-select matrix-select" data-multi="' + options.multi + '" data-value-field="' + options.valueField + '">';
            if(!!options.any) {
                html += '<span class="active no-limit" data-value="">不限</span>';
            }
            for(var i=0;i<options.data.length;i++){
                var dataTmp = options.data[i];
                html += '<span data-value="' + dataTmp[options.idField] + '">' + dataTmp[options.nameField]  + '</span>';
            }
            html += '<input type="hidden" name="' + options.inputName + '" />';
            html += '</div>';
            return html;
        },
        /**
         * 客户端绑定
         */
        clientBind : function(){

            var TagsSelect = function(jDom){
                this.jDom = jDom;
                this.valueField = jDom.attr('data-value-field');
                this.multi = jDom.attr('data-multi')=='true';
                this.input = jDom.find('input[type="hidden"]');

                var that = this;
                // 绑定点击事件
                this.jDom.find('>span').bind('click',function(){
                    var jThis = $(this);
                    var val = '';
                    if(that.valueField == 'id'){
                        val = jThis.attr('data-value');
                    }else{
                        val = jThis.text();
                    }
                    if(that.multi){
                        if(val == ""){
                            // 点击了不限
                            that.jDom.find('>span').removeClass('active');
                        }else{
                            that.jDom.find('.no-limit').removeClass('active');
                        }

                        if(jThis.hasClass('active'))
                            jThis.removeClass('active');
                        else
                            jThis.addClass('active');


                        var vals = [];
                        that.jDom.find('>.active').each(function(){
                            if(that.valueField == 'id'){
                                vals.push(this.getAttribute('data-value'));
                            }else{
                                vals.push(this.innerHTML);
                            }
                        });

                        if(vals.length == 0){
                            that.jDom.find('.no-limit').addClass('active');
                        }
                        console.log(that.input.val());
                        that.input.val(vals.join(',')).change();
                    }else{
                        // 单选
                        that.jDom.find('>span').removeClass('active');
                        jThis.addClass('active');

                        that.input.val(val).change();
                    }
                });

                return this;
            }

            $('.wd-tags-select').each(function(){
                return new TagsSelect($(this));
            })
        }
    }

    //客户端绑定
    if(!isServer){
        $(document).ready(function(){
            mod[key].clientBind();
        });
    }

})((typeof module !== 'undefined')?module: Q.widget, (typeof module !== 'undefined')?'exports':'tagsSelect',(typeof module !== 'undefined'));