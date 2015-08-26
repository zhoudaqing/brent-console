/**
 * Created by xiongxing on 2014/6/24.
 *
 * 用于一般服务器端只创建组件，客户端绑定的方式来实现
 */
// 默认配置
var defalutCascadeOptions = {
    parentText : '请选择',           // 默认文字
    childText : '请选择',           // 默认文字
    parentUnit : '',
    childUnit : '',
    idCol : 'id',
    nameCol : 'name',
    parentCol : 'parent_id',
    valueField : 'id'          // 选中后获取的值是取id，还是取name(这里只能输入id或者name，不是更idField一样)
}
var nextId = 0;

module.exports = {
    /**
     * 创建弹出的下拉列表
     * @param options
     * {
     *      defaultText : '添加地区',           // 默认文字
     *      inputName : 'area',                 // 输入框的名字
     *      multi : true,                       // 是否多选
     *      dataSource : 'region|industry',        // 数据源,目前只支持地区和行业
     *      cols : 4,                           // 显示多少列
     *      idCol : 'id',
            nameCol : 'name',
            parentCol : 'parent_id',
            valueField : 'id',          // 选中后获取的值是取id，还是取name(这里只能输入id或者name，不是更idField一样)
            showSelectAll : true,       // 是否显示不限选项
            showSelectAll2 : true,      // 2级菜单显示不限选项
     * }
     */
    createPopSelect : function(options){
        // 默认配置
        var defalutOptions = {
            defaultText : '',
            defaultValue:'',
            multi : false,
            cols : 4,
            idCol : 'id',
            nameCol : 'name',
            parentCol : 'parent_id',
            valueField : 'id',
            inputName : '',
            showSelectAll : true,
            showSelectAll2 : true
        }

        for(var k in defalutOptions){
            if(typeof options[k] === 'undefined'){
                options[k] = defalutOptions[k];
            }
        }

        var html = '<div class="wd-pop-select"';
        var reg = /([A-Z])/g;
        for(var key in options){
            // key需要把大写字母替换成-，不然客户端取到的可能都是小写
            var replaceKey = key.replace(reg,'-$1').toLowerCase();
            html += ' data-' + replaceKey + '="' + options[key] + '" ';
        }
        html += '>';
        html += '<span class="text">' + options.defaultText + '</span>' +
            '<span class="unit"><span class="icon-arrow"></span></span>';
        html += '<input type="hidden" name="' + options.inputName+ '" value="'+options.defaultValue+'" />'
            html += '</div>'

        return html;
    },
    /**
     * 创建级联下拉菜单，比如地区之类的
     * @param options
     *  {
     *      parentText : '请选择省份',           // 下拉默认文字
     *      childText : '请选择城市',           // 下拉默认文字
     *      parentUnit : '省',
     *      childUnit : '市',
     *      parentInputName : 'province',                 // 输入框的名字
     *      childInputName : 'city',                 // 输入框的名字
     *      dataSource : 'region|industry',        // 数据源,目前只支持地区和行业
     *      idCol : 'id',
            nameCol : 'name',
            parentCol : 'parent_id',
            valueField : 'id'          // 选中后获取的值是取id，还是取name(这里只能输入id或者name，不是更idField一样)
     * }
     */
    createCascadeSelect : function(options){
        for(var k in defalutCascadeOptions){
            if(typeof options[k] === 'undefined'){
                options[k] = defalutCascadeOptions[k];
            }
        }

        var html = '<div class="wd-cascade-select" id="' + (options.id || '') + '"';
        var reg = /([A-Z])/g;
        for(var key in options){
            // key需要把大写字母替换成-，不然客户端取到的可能都是小写
            var replaceKey = key.replace(reg,'-$1').toLowerCase();
            html += ' data-' + replaceKey + '="' + options[key] + '" ';
        }
        html += '>';

        html += '<span class="wd-cascade-parent">' +
                    '<select valid-name="' + options.parentUnit + '"  name="' + options.parentInputName + '" '
                        + (options.required?'validator="required"':'') + '>' +
                        '<option value="">' + options.parentText + '</option>' +
                    '</select>'+ options.parentUnit +
                '</span>';

        html += '<span class="wd-cascade-child">' +
                    '<select valid-name="' + options.childUnit + '" name="' + options.childInputName + '" '+ (options.required?'validator="required"':'') + '></select>' + options.childUnit +
                '</span>';

        if(options.grandsonInputName) {
            html += '<span class="wd-cascade-grandson">' +
                '<select valid-name="' + options.grandsonUnit + '" name="' + options.grandsonInputName + '" ' + (options.required ? 'validator="required"' : '') + '></select>' + options.grandsonUnit +
                '</span>';
        }
        html += '</div>';

        return html;
    },

    createSwfUpload : function(options){
        options.width = options.width || 140;
        options.height = options.height || 140;
        var html = '<div class="wd-upload" id="' + (options.id || '') + '" style="';
            html += 'width:'+ options.width+'px!important;';
            html += 'height:'+ options.height+'px!important;';

        html += '"';

        var reg = /([A-Z])/g;
        for(var key in options){
            // key需要把大写字母替换成-，不然客户端取到的可能都是小写
            var replaceKey = key.replace(reg,'-$1').toLowerCase();
            html += ' data-' + replaceKey + '="' + options[key] + '" ';
        }
        html += '>';
        // 注：这里的wd-upload-flash必须有id，不然swfupload组件支持的会有问题
        html += '<div class="wd-upload-flash" id="wd-upload-flash-'+ (nextId++) + '"></div>' +
             '<input type="hidden" class="wd-upload-value" name="'+ options.valueHiddenName + '" />';
        html += '</div>';

        return html;
    },
    createWebUpload : function(options){
        // delay防止隐藏后在现实点击区域大小不正常
        // $obj.find('.wd-web-upload').removeClass('wd-web-upload-delay');
        // Q.notify.broadcast('G_WIDGET_NEW_CREATE', 'web-upload');
        options.width = options.width || 140;
        options.height = options.height || 140;
        var html = '<div class="wd-web-upload' + (options.delay ? ' wd-web-upload-delay' : '') + '" id="' + (options.id || new Date().getTime()) + '" style="';
        html += 'width:'+ options.width+'px!important;';
        html += 'height:'+ options.height+'px!important;';

        html += '"';

        var reg = /([A-Z])/g;
        for(var key in options){
            // key需要把大写字母替换成-，不然客户端取到的可能都是小写
            var replaceKey = key.replace(reg,'-$1').toLowerCase();
            html += ' data-' + replaceKey + '="' + options[key] + '" ';
        }
        html += '>';
        // 注：这里的wd-upload-flash必须有id，不然swfupload组件支持的会有问题
        html += '<div class="text">' + (options.buttonText || '点击上传图片') +'</div>' +
                '<input type="hidden" class="wd-upload-value" name="'+ options.valueHiddenName + '" />' +
            '</div>';

        return html;
    }
}