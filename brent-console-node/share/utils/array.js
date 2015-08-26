(function(mod,key,isServer){
	/**
	 * 数组帮助类
	 * @author xiongxing
	 */
    mod[key] = {
        /**
         * @method 查找值在数组的位置
         * @param {array} arr 数组
         * @return {string} val 值
         */
        indexOf:function(arr,val){
            var index=-1;
            for(var i=0;i<arr.length;i++)
            {
                if(arr[i]==val){
                    index=i;
                    return index;
                }
            }
            return index;
        },
        /**
         * @method 删除某个元素
         * @param {str} val 值
         * @param {array} arr 数组
         * @return {array} array 值
         */
        del: function(val, arr) {
            var tmpArr = [];
            if(!val || !arr) {
                return;
            }
            for(var i = 0, lth = arr.length; i < lth; i++) {    
                if(arr[i] == val) {
                    continue;
                } else {
                    tmpArr.push(arr[i]);
                }
            }
            return tmpArr;
        }
		
	}
})((typeof module !== 'undefined')?module: Q, (typeof module !== 'undefined')?'exports':'array',(typeof module !== 'undefined'));