/**
 * 消息通知中心
 */
(function(){
    function observer(name,callback){
        this.name = name;
        this.callback = callback;

        return this;
    }
    Q.notify = {
        _observers : [],
        /**
         * 监听某个消息
         * @param {string} name 消息名
         * @param {function }fn 回调函数
         */
        listen : function(name,fn){
            this._observers.push(new observer(name,fn));
        },
        /**
         * 取消监听某个消息
         * @param name
         * @param fn
         */
        unlisten : function(name,fn){
            for(var i=0;i<this._observers.length;i++){
                var ob = this._observers[i];
                if(ob.name == name && ob.callback == fn){
                    this._observers.splice(i,1);
                    return;
                }
            }
        },
        /**
         * 广播消息
         * @param {string} name 消息名
         * @param {object} data  参数对象
         */
        broadcast : function(name,data){
            var result = [];
            for(var i=0;i<this._observers.length;i++){
                var ob = this._observers[i];
                if(ob.name == name){
                    result.push(ob.callback(data));
                }
            }

            if(result.length == 1){
                return result[0];
            }else if(result.length == 0){
                return;
            }
            return result;
        }
    }
})();
