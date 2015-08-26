/**
 * Created by xiongxing on 2014/6/25.
 * 其他一些业务通用方法，而非格式化的方式
 */

(function(mod,key){

    mod[key] = {
        /**
         * 一些多选的id用,隔开，显示的时候需要转成对应数据的name
         * @param {string} ids
         * @param {object} mapData
         */
        idsToNames : function(ids,mapData,defaultData){
            if(typeof ids === 'string' && ids.length ==0)
                return defaultData || '';
            ids = ids + '';
            var idArray = ids.split(',');
            var names = [];
            for(var i=0;i<idArray.length;i++){
                if(mapData[idArray[i]])
                    names.push(mapData[idArray[i]]);
            }

            return names.join('、');
        },
        /**
         * 结合父类一起显示
         * @param id
         * @param mapData
         * @param defaultData
         */
        combinWidthParent : function(id,mapData,defaultData,textField,parentField){
            if(id==null || id<=0)
                return defaultData || '';

            textField = textField || 'name';
            parentField = parentField || 'parent_id';

            var myData = mapData[id];
            var html = '';
            if(myData&&myData[parentField] > 0){
                var parentData = mapData[myData[parentField]];
                if(parentData){
                html += parentData[textField] + '&nbsp;';
                }
            }
            if(myData){
            html += myData[textField];
            }

            return html;
        },
        /**
         * 很多表格中数据可能显示1行，也可能显示2行。超过2行的自动换行需要自动剪裁的
         * @param {string} str
         * @param {number} len  一行显示的数字
         */
        cutTdText : function(str,len){
            if(!str)
                return ''

            var strRet = '',classRow = 'row';
            for(var i=0;(i<len*2 && i<str.length);i++){
                if(i==len){
                    strRet += "<br />";
                    classRow='row2';
                }
                strRet += str.charAt(i);
            }

            return '<div class="' + classRow + '" title="' + str +'">' + strRet + '</div>';
        },
        /**
         * 需要一些统计日志的log,会带上当前页面的log参数,icfa
         * @param request
         * @param url
         */
        logLink : function(request,url){
            // 已经有该参数了，不使用新的参数
//            if(url.indexOf('icfa=') !== -1){
//                return url;
//            }

            var v = request.param('icfa');
            if(v){
                if(url.indexOf('icfa=') !== -1){
                    // 替换原来的参数
                    var ret = url.replace(/icfa=\d+/ig,'icfa=' + v);
                    return ret;
                }

                if(url.indexOf('?') == -1){
                    url += '?';
                }

                url += '&icfa=' + v;
            }

            return url;
        },
        /**
         * 判断当前请求是否小微股转的
          * @param req
         */
        isStockMarket : function(req){
            var subdomains = req.subdomains;
            if(subdomains.length > 0 && subdomains[0] == 'stock'){
                return true;
            }

            return false;
        },
        /**
         * 获取小微的域名
         * @param req
         * @return http://stock.qhee.com
         */
        getStockMarketDomain : function(req){
            var host = req.get('host');
            if(host.indexOf('stock') !== 0){
                // 不是从stock二级域名来的，跳转到二级域名去
                return 'http://' + host.replace(/^([a-z]*\.){0,1}qhee\./ig,'stock.qhee.');
            }

            return 'http://' + host;
        }
    }

    // 前端、后端兼容代码
})((typeof module !== 'undefined')?module:Q, (typeof module !== 'undefined')?'exports':'bizUtils');
