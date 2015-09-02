/**
 * Created by xiongxing on 2014/5/26.
 */
/****
 * 通用的信息提示框
 * <div id="notice_tip" class="succ">
 *      <span id="notice_icon"></span>
        <span id="notice_txt"></span><span id="notice_close">&nbsp;</span>
   </div>
 */
(function(){


    Q.tip = {
        _tipObj: null,
        _tipC: null,
        _tipClose: null,
        _tipHeight:45,
        _intTime: -1,
        _isInit: false,
        _isShow: false,

        _setValue: function(msg, clsName, isHide) {
            this._tipC.html(msg);
            this._tipObj.attr("class", clsName);
            this.show(isHide);
        },

        _init: function() {
            if(this._isInit){
                return;
            }

            this._isInit = true;

            this._tipObj = $("#notice_tip");
            if(this._tipObj.length == 0){
                var hDom = $.parseHTML('<div id="notice_tip" class="succ">' +
                    '<span id="notice_icon">&nbsp;</span>' +
                    '<span id="notice_txt"></span>' +
                    '<span id="notice_close">&nbsp;</span>' +
                    '</div>');
                $(document.body).append(hDom);
            }

            this._tipObj = $("#notice_tip");
            this._tipC = $("#notice_txt");
            this._tipClose =  $("#notice_close");

            this._tipClose.click(function() {
                Q.tip.hide();
            });

            var noticetype = Q.url.getHashParam("_noticetype") || 'succ',
                notice =  Q.url.getHashParam("_notice"),
                isHide = Q.url.getHashParam("isHide");

            if (noticetype && notice) {
                Q.tip._show(decodeURIComponent(notice), noticetype,isHide);
            }

            if(notice){
                location.hash = '#default';
            }
        },
        info: function(msg, isHide) {
            this._show(msg, "succ", isHide);
        },
        war: function(msg, isHide) {
            this._show(msg, "war", isHide);
        },
        err: function(msg, isHide) {
            this._show(msg, "err", isHide);
        },
        succ: function(msg, isHide) {
            this._show(msg, "succ", isHide);
        },
        hide: function() {
            this._init();

            //var scroll_top=window.pageYOffset || document.documentElement.scrollTop;
            QH.tip._tipObj.animate({
                "top": -this._tipHeight+"px"
            }, 1000,"linear");
            QH.tip._isShow = false;
        },
        _show: function(msg, clsName, isHide) {
            this._init();

            this._tipC.html(msg);
            this._tipObj.attr("class", clsName);
            this._tipHeight=this._tipObj.height()+25;

            if (this._intTime != -1) {
                window.clearTimeout(this._intTime);
                this._intTime = -1;
            }
            // 先在看不见得地方显示，方便计算后面计算宽
            //this._tipObj.css("left","-2000px").show();
            //var tops = window.pageYOffset?window.pageYOffset:document.documentElement.scrollTop;
            setTimeout(function() {
                var w = QH.tip._tipObj.width();
                QH.tip._tipObj.css({
                    'left': '50%',
                    "marginLeft": -w / 2 + "px",
                    "top": - QH.tip._tipHeight + "px"
                }).animate({
                     "top": 0+"pc"
                 }, 1000);
                QH.tip._isShow = true;
                if (isHide) {
                    QH.tip._intTime = window.setTimeout(function(){
                        QH.tip.hide();
                    }, 3000);
                }
            }, 100);
        }
    }

    $(document).ready(function(){
        Q.tip._init();
    })
})();