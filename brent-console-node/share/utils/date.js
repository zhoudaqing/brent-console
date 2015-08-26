(function(mod,key,isServer){
	/**
	 * 时间帮助类
	 * @author xiongxing
	 */
	mod[key] = {
		/**
		 * @method  修改时间用语
		 * @params {string || number} time 时间(与除unit!='date'配合使用)或格式化时间(2014-11-12 12:00:24 || 2014/11/12 12:00:24)
		 * @params {string} unit 时间类型声明，suffix 时间后缀
		 * @return {string}
		 */
		toTimeText: function(time, unit, suffix) {
			var minTimestamp = 60 * 1000,
				hourTimestamp = minTimestamp * 60,
				dayTimestamp = hourTimestamp * 24,
				monthTimestamp = dayTimestamp * 30,
				timeFormat = function(timestamp) {
					var min = 0,
						hour = 0,
						day = 0,
						weeks = 0,
						month = 0,
						diffTimestamp = timestamp,
						finalTime = '';
					if(unit == 'date') {
						diffTimestamp = +new Date() - diffTimestamp;
					}		
					if(diffTimestamp < 0) {
						Q.tip.war('结束时间不能小于开始时间！', true);
						return '-';
					};
					min = diffTimestamp / minTimestamp;
					hour = diffTimestamp / hourTimestamp;
					day = diffTimestamp / dayTimestamp;
					weeks = diffTimestamp /( dayTimestamp * 7);
					month = diffTimestamp / monthTimestamp;
					if(month >= 1) {
						finalTime = parseInt(month) + '个月' + suffix;
					} else if(weeks >= 1) {
						finalTime = parseInt(weeks) + '周' + suffix;
					} else if(day >= 1) {
						finalTime = parseInt(day) + '天' + suffix;
					} else if(hour >= 1) {
						finalTime = parseInt(hour) + '小时' + suffix;
					} else if(min >= 1) {
						finalTime = parseInt(min) + '分钟' + suffix;
					} else {
						finalTime = '刚刚';
					}
					return finalTime;
				},
				timeText = '';
			if(!suffix) {
				suffix = '';
			}	
			switch(unit) {
				case 'month':
					timeText = timeFormat(time * monthTimestamp);
				break;
				case 'day':
					timeText = timeFormat(time * dayTimestamp);
				break;
				case 'hour':
					timeText = timeFormat(time * hourTimestamp);
				break;
				case 'min':
					timeText = timeFormat(time * minTimestamp);
				break;
				case 'second':
					timeText = timeFormat(time * 1000);
				break;
				case 'ms':
					timeText = timeFormat(time);
				break;
				case 'date':
					timeText = timeFormat(Date.parse(time))
				break;
				default:
					timeText = timeFormat(time);
				break;
			}
			return timeText;
		}
	}
})((typeof module !== 'undefined')?module: Q, (typeof module !== 'undefined')?'exports':'date',(typeof module !== 'undefined'));