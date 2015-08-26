/**
 * 所有业务需要的格式化输出的收敛方法，总体需求文档如下：
 客户资产	以元为单位，最高保留宽度10亿，保留小数点后两位
 客户融资金额	以元为单位，最高保留宽度10亿，保留小数点后两位
 应还本息	以元为单位，最高保留宽度10亿，保留小数点后两位
 产品规模	以万元为单位，最高10亿，无小数点
 认购金额	以万元为单位，最高10亿，无小数点
 债券转让	以万元为单位，最高10亿，最高支持小数点4位（展示同百分比）
 股权投融资总额	以万元为单位，最高10亿，无小数点
 股权投融资单价	以元为单位，最高10亿，保留小数点后两位
 所有页面	以股为单位，最高10亿股
 股份比例、利率	最高支持小数点后4位， 股份比例如果小数第三第四位为零则只显示两位
 产品期限	单位可为天、月、年，根据产品信息自动显示
 产品募集剩余时间	单位可为天、月、年，根据产品信息自动显示，如果<1天，则显示小时
 所有页面	日期显示格式为：2014\04\07
 我的资产及融资	统一名称为预期年化收益率/利率
 业务订单	统一名称为预期年化收益率/利率
 产品列表	统一名称为预期年化收益率/利率
 产品详情页	投融宝：预期年化收益率   私募债：年化利率   小贷：年化利率
 */
(function(mod, key) {
    //前端的利率展示过滤code
    var m_hideProductCode = [650004, 650005, 650006, 650010, 400001, 400002, 400003, 400004];

    mod[key] = {
        /**
         * 我的金额，涉及到客户自己的钱，必须精确到小数点后2为，单位是元
         * 1,000,000,000.00元
         * @param {float,string} m 金额
         * @return {string} 1,000,000,000.<font>00元</font>
         */
        myMoney: function(m) {
            if (m == null || isNaN(m))
                return '';

            if (typeof m === 'string')
                m = parseFloat(m);

            return this._formatThousand(m.toFixed(2), '元');
        },
        /**
         * 单位为亿的数据，
         * @param m
         */
        billionMoney : function(m,unit){
            if (m == null || isNaN(m))
                return '';

            if (typeof m === 'string')
                m = parseFloat(m);

            m = m / 100000000;
            return this._formatThousand(m.toFixed(2), (unit || '亿元'));
        },
        /**
         * 单位为亿的数据，无单位
         * @param m
         */
        billionMoneyNoUnit : function(m){
            if (m == null || isNaN(m))
                return '';

            if (typeof m === 'string')
                m = parseFloat(m);

            m = m / 100000000;
            return this._formatThousand(m.toFixed(2));
        },
        /**
         * 我的金额，涉及到客户自己的钱，必须精确到小数点后2为，单位是元
         * 1,000,000,000.00元
         * @param {float,string} m 金额
         * @return {string} 1,000,000,000.<font>00元</font>
         */
        myMoneyNoUnit: function(m) {

            if (typeof m === 'string')
                m = parseFloat(m);

            return this._formatThousand(m.toFixed(2));
        },
        /**
         * 网站上其他显示的所有的金额，单位全部是万元，没有小数点
         * @param {float,string} m 金额
         * @return {string} 1,000,000,000<font>万元</font>
         */
        siteMoney: function(m) {
            if (isNaN(m))
                return '';

            if (typeof m === 'string')
                m = parseInt(m);

            m = parseInt(m / 10000)
            return this._formatThousand(m, '万');
        },
        /**
         * 以万元为单位，最高10亿，最高支持小数点4位（展示同百分比）
         * @param m
         * @return {string} 1,000,000,000<font>.05万元</font>
         */
        bondMoney: function(m) {
            if (typeof m === 'string')
                m = parseInt(m);

            m = m / 10000;
            return this._formatThousand(m, '万');
        },
        bondMoneyNoUnit: function(m) {
            if (typeof m === 'string')
                m = parseInt(m);

            m = m / 10000;
            return this._formatThousand(m);
        },
        /**
         * 股数
         * @param {float,string} m 金额
         * @return {string} 1,000,000,000股
         */
        stock: function(m, unit) {
            if (!m)
                return '';

            if (typeof m === 'string')
                m = parseInt(m);

            return this._formatThousand(m, (unit ||'股'));
        },
        /**
         * 无单位股数
         * @param {float,string} m 金额
         * @return {string} 1,000,000,000股
         */
        stockNoUnit: function(m) {
            if (!m)
                return '';

            if (typeof m === 'string')
                m = parseInt(m);

            return this._formatThousand(m);
        },
        /**
         * 百分比，股份比例，利率,保留2位小数,8.00%,如果小数点后3位、4位不为0的时候也需要显示出来，为0则不显示
         * @param {float,string} m 已经计算好的百分比0.0725,其他自己*100
         * @return {string} 72.50<font>%</font>
         */
        percent: function(m,fixedDec) {
            if (typeof m === 'string')
                m = parseFloat(m);
            //            if(m > 1){
            //                m = (m / 100).toFixed(6);
            //            }
            // 先转成字符串判断小数点位数，不要先用float去计算，容易产生精确值得问题
            var str = m + '';
            str = str.replace(/0*$/i, ""); // 去掉后面的0
            fixedDec = ((typeof fixedDec === 'undefined')?2:fixedDec); // 格式化的小数点位数。

            var index = str.indexOf('.');
            if (index !== -1) {
                fixedDec = (str.length - index - 1); // 计算出小数点后面的位数
                fixedDec = fixedDec - 2; // 因为还需要*100,所提小数点位数要-2
            }
            // 控制最大最小范围
            if (fixedDec > 4)
                fixedDec = 4;
            else if (fixedDec < 0)
                fixedDec = 0;

            var ret = (m * 100).toFixed(fixedDec);
            if (ret >= 100)
                ret = 100;
            return ret + '<font>%</font>';
        },
        yesNull:function(obj){
            return !obj&&typeof(obj)!="undefined"&&obj!=0;
        },
        /**
         * 需要计算的百分比，股份比例，利率,保留2位小数,8.00%,如果小数点后3位、4位不为0的时候也需要显示出来，为0则不显示
         * @param {float,string} num 分子
         * @param {float,string} max 分母
         * @return {string} 72.50<font>%</font>
         */
        percentCal: function(num, max) {
            var fp = (num / max).toFixed(4);

            return this.percent(fp);
        },
        /**
         * 利率百分比，需要对一些code进行过滤
         * 利率为0的时候显示非固定收益
         * @param {float} rate 比例
         * @param {string} code 代码
         * @return {string} 7.20%
         */
        ratePercent: function(rate, code) {
            if (code) {
                for (var i = 0; i < m_hideProductCode.length; i++) {
                    if (m_hideProductCode[i] == code) {
                        return "--";
                    }
                }
            }
            if (rate <= 0)
                return '非固定收益';
            return this.percent(rate);
        },
        /**
         * 利率文字，列表中的表头全部用  预期年化收益率/利率
         * // secuType 权益类别，1股权，2债券，3融资产品,4理财产品
         * 详细页面分：
         * 	私募债/小贷：年化利率
         *  投融宝：预期年化收益率
         *  @return {string}
         */
        rateText: function(secuType) {
            if (secuType == 4) {
                return '预期年化收益率';
            } else {
                return '年化利率';
            }
        },
        /**
         * 日期格式化，全部用如下日期2014\04\07
         * @param {date,int}  日期格式，或者毫秒值、秒值
         * @return {string} yyyy/MM/dd
         */
        date: function(d, fm) {
            if (!d)
                return '-';
            return this._formatTime(this._parseDate(d), fm || 'yyyy/MM/dd');
        },
        /**
         * 时间格式化，全部返回如下时间：2014\04\07 24:59:59
         * @return {string} yyyy\MM\dd hh:mm:ss
         */
        time: function(d, fm) {
            if (!d)
                return '-';
            return this._formatTime(this._parseDate(d), fm || 'yyyy/MM/dd hh:mm:ss');
        },
        // /*@private 树叶数*/
        // gradeLeaf: function(n) {
        //     var num = n || 1;
        //     return "<span  class='gradeLeaf gradeLeaf" + num + "' title='信誉评级" + num + "级'>&nbsp;</span>";
        // },
        /**星星数***/
        gradeLeaf: function(num,user_id) {
            var halfClass="icon-half-star icon-grade fl";
            var fullClass="icon-full-star icon-grade fl";
            var url
            if(user_id){
                url = 'data-url="/patenerStock/comment-list.jsp?id='+user_id+'"';
                halfClass += ' binder-open-url';
                halfClass += ' binder-open-url';
            }
            //拼接星星，实星(full-star)，半星(half-star)
            var _tmp = "";
            for (var i = 0; i < num; i++) {
                _tmp += '<span class="'+fullClass+'" '+(url?url:'')+'></span>';
            }
            if (num < 5) {
                for (var i = 0; i < 5 - num; i++) {
                    _tmp += '<span class="'+halfClass+'" '+(url?url:'')+'></span>';
                }
            }
            return _tmp;
        },
        /*****
         ****将时间戳转换成xx年/xx月
         *****/
        dateForYearMonthWithUnit: function(number) {
            var _tmp = new Date(number);
            var year = (_tmp.getFullYear() + "").substr(2, 2);
            var month = (_tmp.getMonth()) + 1;
            return year + "年" + month + "月";
        },
        _parseDate: function(d) {
            if (!d)
                return null;

            var type = typeof d;
            if (type === 'number') {
                if ((d + '').length === 10) {
                    return new Date(d * 1000);
                } else {
                    return new Date(d);
                }
            } else if (type === 'string') {
                return new Date(d);
            }

            return d;
        },
        _formatTime: function(time, fmt) {
            if (time == null)
                return '-';
            var o = {
                "M+": time.getMonth() + 1, //月份
                "d+": time.getDate(), //日
                "h+": time.getHours(), //小时
                "m+": time.getMinutes(), //分
                "s+": time.getSeconds(), //秒
                "q+": Math.floor((time.getMonth() + 3) / 3), //季度
                "S": time.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        /**
         * @private 格式为千分位的输入格式
         */
        _formatThousand: function(f, unit) {
            var txt = f + '';
            var dec = '';
            // 先判断是否有小数位
            var index = txt.indexOf('.');
            if (index != -1) {
                dec = txt.substr(index + 1);
                txt = txt.substr(0, index);
            }

            var ret = ''; // 最终返回的结果
            var step = 0; // 没3步加个,
            for (var i = (txt.length - 1); i >= 0; i--) {
                ret = txt.charAt(i) + ret;

                step++;
                if (step == 3 && i > 0) { //第3个加,如果在最后1个数字，则不加
                    step = 0;
                    ret = ',' + ret;
                }
            }

            if (dec.length > 0) {
                dec = '.<font>' + dec + '</font><font class="unit">' + (unit || '') + '</font>';
            } else if (unit) {
                dec = '<font class="unit">' + (unit || '') + '</font>';
            }
            ret += dec;
            return ret;
        },
        /**
         * 浮点数相加
         */
        floatAdd: function(arg1, arg2) {
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                 var cm = Math.pow(10, c);
                 if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;      
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                 }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        },
        /**
         * 浮点数相减
         */
        floatSub: function(arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                 r1 = 0;
            }
            try {
                 r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                 r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        }
    }
    // 前端、后端兼容代码
})((typeof module !== 'undefined') ? module : Q, (typeof module !== 'undefined') ? 'exports' : 'bizFormat');