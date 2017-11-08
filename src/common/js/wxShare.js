var title_wxShare;
var content_wxShare;
var imageUrl_wxShare;
var shareUrl_wxShare;
var isShare_wxShare = false;

window.doWXShareInfo = function (titleDef, contentDef, imageUrlDef, shareUrlDef, isShareDef) {
    title_wxShare = titleDef;
    content_wxShare = contentDef.replace(/<br>/g, "");
    imageUrl_wxShare = imageUrlDef;
    shareUrl_wxShare = shareUrlDef;
    isShare_wxShare = isShareDef;

    doShareWxActivity();
}

/**
 **微信分享方法
 **/
window.doShareWxActivity = function (){
    var pageUrl = encodeURIComponent(window.location.href.split('#')[0]); //微信分享传给后台接口的页面路径
    $.ajax({
        type : "get",
        async : false,
        url : 'http://cust.wsh.so/wejs?url=' + pageUrl,
        dataType : "jsonp",
        jsonp : "callbackparam", //服务端用于接收callback调用的function名的参数
        jsonpCallback : "success_jsonpCallback", //callback的function名称
        success : function(json) {
            weixinShare(json[0].appId, json[0].timestamp, json[0].nonceStr, json[0].signature, [ 'checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage' ]);
        },
        error : function() {
            console.log('fail');
        }
    });
}

//分享
window.weixinShare = function (appId, timestamp, nonceStr, signature, jsApiList) {
    wx.config({
        debug : false,
        appId : appId,
        timestamp : timestamp,
        nonceStr : nonceStr,
        signature : signature,
        jsApiList : jsApiList
    });
    // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
    wx.ready(function() {
        if(!isShare_wxShare){
            //隐藏右上角菜单接口
            wx.hideOptionMenu();
            /*
             //显示右上角菜单接口
             wx.showOptionMenu();

             //关闭当前网页窗口接口
             wx.closeWindow();

             //批量隐藏功能按钮接口
             wx.hideMenuItems({
             menuList: [] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
             });

             //批量显示功能按钮接口
             wx.showMenuItems({
             menuList: [] // 要显示的菜单项，所有menu项见附录3
             });

             //隐藏所有非基础按钮接口
             wx.hideAllNonBaseMenuItem();

             //显示所有功能按钮接口
             wx.showAllNonBaseMenuItem(); */
        }else{
            //显示右上角菜单接口
            wx.showOptionMenu();

            wx.checkJsApi({
                jsApiList : [ 'onMenuShareAppMessage', 'onMenuShareTimeline' ],
                success : function(res) {
                    console.log(JSON.stringify(res));
                }
            });
            // 2. 分享接口
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage({
                title : title_wxShare,
                desc : content_wxShare,
                link : shareUrl_wxShare,
                imgUrl : imageUrl_wxShare,
                success : function(res) {
                    console.log('已分享');
                },
                cancel : function(res) {
                    console.log('已取消');
                }
            });
            // 2.1 监听“分享到朋友圈”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
                title : title_wxShare,
                desc : content_wxShare,
                link : shareUrl_wxShare,
                imgUrl : imageUrl_wxShare,
                success : function(res) {
                    console.log('已分享');
                },
                cancel : function(res) {
                    console.log('已取消');
                }
            });
            wx.error(function(res) {
                console.log(res.errMsg);
            });
        }
    });
}