
(function() {   
	/**     
	 * location.href 中url的帮助类
	 * @author xiongxing
	 */
	Q.url = {         
		_urlParams : null,   
		/**              
		 * @method 取URL中的某个参数
		 * @param {string} key
		 * @param {string} 对应的value
		 */	
		getParam : function(key){
			if(!this._urlParams){
				this._urlParams = {};

                if(window.location.search.length <= 1)
                    return null;

				var params = window.location.search.substr(1).split('&');
				for(var paramPair in params){
                    var p = params[paramPair];
                    var index = p.indexOf('=');
                    if(index !== -1){
                        this._urlParams[p.substr(0,index)] = p.substr(index+1);
                    }
				}
			}
			
			return this._urlParams[key];
		},
		
		_hashParams : null,
		/**
		 * @method 取URL中Hash的某个参数值
		 * @param {string} key
		 * @param {string} 对应的value
		 */	
		getHashParam : function(key){
			if(!this._hashParams){
				this._hashParams = {};

                // 初始化参数
                var hash = decodeURI(location.hash);
                var index = hash.indexOf('?');
                var str = '';
                if(hash.length > 1){
                    if(index != -1) {
                        str = hash.substr(index + 1);
                    }else{
                        str = hash.substr(1);
                    }
                }

                if(str.length > 0) {
                    var tmpParams = str.split('&');
                    for (var i = 0; i < tmpParams.length; i++) {
                        var paramPair = tmpParams[i];
                        var keyValue = paramPair.split('=');
                        if (keyValue.length == 2) {
                            this._hashParams[keyValue[0]] = keyValue[1];
                        }
                    }
                }
			}
			
			return this._hashParams[key];   
		},
		/**
		 * @method 向1个URL中参数值
		 * @param {string} name 参数列表，比如id=1&key=200
		 * @param {string} url,参数，不传用的是location.href
		 * @return {string}           
		 */
		addUrlParam : function(name,url){
           url = (url == undefined || url == '') ? window.location.href : url;

           url = url.indexOf('v=') === -1 ? this.addUrlParam('v='+(new Date()).getTime(),url,'') : this.changeUrlParam(url,'v',(new Date()).getTime());
           if(url.indexOf('#') === -1){
                url = url + '#'+name;
           }else{
                url = url + '&'+name;
           } 
     
           return encodeURI(url);
        },
		/**
		 * @method 向1个URL中添加hash参数值
		 * @param {string} name 参数列表，比如id=1&key=200
		 * @param {string} url,参数，不传用的是location.href
		 * @return {string}
		 */
        addHashUrlParam : function(name,url){
        	 url = (url == undefined || url == '') ? window.location.href : url;       
        	 if(url.indexOf('?') === -1){
                 url = location.hash == '' ? (url + '?'+name) : ((url).replace(location.hash,'')+'?'+name+location.hash);
             }else{
                 url = location.hash == '' ? (url + '&'+name) : ((url).replace(location.hash,'')+'&'+name+location.hash);
             }
        	 return encodeURI(url);
        },
        /**
         * @method 替换url中某个参数              
         * @param ${string} url 需要替换的url
         * @param ${string} arg 参数key
         * @param ${string} arg_val 参数值
         * @return 新的URL
         */
        replaceUrlParam : function(url,arg,arg_val){ 
            var pattern=arg+'=([^&]*)'; 
            var replaceText=arg+'='+arg_val; 
            if(url.match(pattern)){ 
                var tmp='/('+ arg+'=)([^&]*)/gi'; 
                tmp=url.replace(eval(tmp),replaceText); 
                return tmp; 
            }else{ 
                if(url.match('[\\?]')){
                    return url+'&'+replaceText; 
                }else{ 
                    return url+'?'+replaceText; 
                } 
            } 
            return url+'\n'+arg+'\n'+arg_val; 
        }
	}
})();