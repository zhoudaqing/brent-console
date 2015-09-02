(function() {
	

	// 记录请求错误的URL参数
	//var _urlErrorMap = {};	
	/**
	 * @method 内部调用方法
	 */
	var _ajax = function(type,url,data,callback,error){
        var obj={};
        obj.type=type;
        obj.url=url;
        obj.data=data;
        obj.callback=callback;
        obj.error=error;
        obj.asyn=true;
		_ajaxAsync(obj);
	}
    var _ajaxAsync = function(obj){
       var  type=obj.type,
            url=obj.url,
            data=obj.data,
            callback=obj.callback,
            error=obj.error,
            asyn=obj.asyn?false:true;
        //var oldUrl = url;
        if(type == "GET"){
            // get请求加时间戳，防止缓存
            var timestamp = (new Date()).valueOf();
            if(url.indexOf('?') !== -1){
                url = url + '&v='+timestamp;
            }else{
                url = url + '?v='+timestamp;
            }
        }

        $.ajax({
            'url':url,
            type:type,
            dataType:'JSON',
            data:data,
            async:asyn,
            timeout : 10000,            // 设置10秒超时
            complete : function(){

            },
            success:function(e){
                var data;
                if(typeof e =="string" && e){
                    data = $.parseJSON(e);
                }else{
                    data = e;
                }
                //处理非json值错误
                if(typeof(data.ok) == 'undefined' || !typeof(data.ok)){
                    QH.tip.err('请求返回的数据异常');
                    if(error && typeof(error) === 'function'){
                        error();
                    }
                    return;
                }
                if(!data.ok){

                    // 删除按钮上的loading菊花
                    $('.btn_loading').removeClass('btn_loading');
                    // 如果定义了错误处理函数，则不截获
                    if(error && typeof(error) === 'function'){
                        error(data);
                    }else{
                        QH.tip.err(data.msg);
                    }

                    return;
                }

                if(data._tpls){
                    for(var i=0;i<data._tpls.length;i++){
                        var tpl = data._tpls[i];
                        var ele = document.createElement('script');

                        ele.setAttribute('type','text/html');
                        ele.setAttribute('id',tpl.name);
                        // 模板内容需要把<% 替换成[%，客户端，服务器的有区别
                        var str = tpl.content.replace(/<%/ig,'[%').replace(/%>/ig,'%]');

                        ele.text = str;

                        document.body.appendChild(ele);
                    }

                }

                if(callback)
                    callback(data);
            },
            error:function(httpReq, textStatus, errorThrown){
                if(error && typeof(error) === 'function'){
                    error();
                }
                if(textStatus && textStatus=='timeout'){
                    QH.tip.err('请求超时');
                    return;
                }
                QH.tip.err(httpReq.responseText);
            }
        });
    }
	/**
	 * @method ajax中POST请求
	 * @param {string} url
	 * @param {object} data 数据
	 * @param {function} callback 成功回调函数
	 * @param {function} error 失败回调函数
	 */
	Q.post = function(url,data,callback,error){
		_ajax('POST',url,data,callback,error);
	};
    Q.postAsync=function(obj){
        _ajaxAsync(obj);
        //url,data,callback,error
    };
	/**
	 * @method ajax中GET请求
	 * @param {string} url
	 * @param {object} data 数据
	 * @param {function} callback 成功回调函数
	 * @param {function} error 失败回调函数
	 */
	Q.get = function(url,data,callback,error){
		_ajax('GET',url,data,callback,error);
	};
    /**
     * 代理到JAVA的后台请求
     * @param {string} url
     * @param {object} data
     * @param {string} tpls
     * @param {function} callback
     * @param {function} error
     */
    Q.proxy = function(url,data,tpls,callback,error){
        if(typeof tpls === 'function'){
            error = callback;
            callback = tpls;
            tpls = null;
        }

        // 判断模板是否存在，如果已经存在，则不需要再请求下载
        var newTpls = [];
        if(tpls){
            if(tpls instanceof Array) {
                for (var i = 0; i < tpls.length; i++) {
                    if (!document.getElementById(tpls[i])) {
                        newTpls.push(tpls[i]);
                    }
                }
            }else{
                if (!document.getElementById(tpls)) {
                    newTpls.push(tpls);
                }
            }
        }
        tpls = newTpls.join('|');

        if(typeof data === 'string'){
            data +="&_action=" + url;
            if (tpls)
                data += '&_tpls=' + tpls;
        } else {
            data = data || {}
            data._action = url;
            if (tpls)
                data._tpls = tpls;
        }
        _ajax('POST','/proxy-action' + decodeURIComponent(url),data,callback,error);
    };
})();