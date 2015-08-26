
(function(mod,key,isServer){
	/**
	 * 字符串帮助类
	 * @author xiongxing
	 */
    mod[key] = {
		/**
		 * @method 去掉2头的空字符串
		 * @param {string} str,字符串
		 * @param {string} 去掉后的字符串
		 */	
		trim : function(str){
            if(!str)
                return '';

			return str.replace(/(^\s*)|(\s*$)/g, "");
		},	
		/**
		 * @method 判断是否为空
		 * @param {string} str,字符串
		 * @param {boolean} 是否空
		 */	
		isEmpty : function(str){
			if(typeof str === 'undefined' || !str)
				return true;
			
			return this.trim(str).length === 0;
		},
        /**
         * 把字符串、数字等转为boolean
         * @param b
         * @returns {string|number|boolean}
         */
        praseBool : function(b){
            if(typeof b === 'string'){
                return b === 'true';
            }else if(typeof b === 'boolean'){
                return b;
            }else if(typeof b === 'number'){
                return b !== 0;
            }
        },
        /**
         * 对字符串进行拆分
         * @param str
         * @returns {Array}
         */
        splitToArray : function(str,splitChar){
            if(Q.string.isEmpty(str))
                return [];

            return str.split(splitChar);
        },

        // json对象解析成string
        stringify : function(obj){
              if (typeof JSON !== 'undefined') {
                return JSON.stringify(obj);
              }
              var t = typeof (obj);
              if (t != "object" || obj === null) {
                  // simple data type
                  if (t == "string") obj = '"' + obj + '"';
                  return String(obj);
              } else {
                  // recurse array or object
                  var n, v, json = [], arr = (obj && obj.constructor == Array);

                  // fix.
                  var self = arguments.callee;

                  for (n in obj) {
                      v = obj[n];
                      t = typeof(v);
                      if (obj.hasOwnProperty(n)) {
                          if (t == "string")
                              v = '"' + v + '"';
                          else if (t == "object" && v !== null)
                              v = self(v);
                          json.push((arr ? "" : '"' + n + '":') + String(v));
                      }
                  }
                  return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
              }
      }
	}
})((typeof module !== 'undefined')?module: Q, (typeof module !== 'undefined')?'exports':'string',(typeof module !== 'undefined'));