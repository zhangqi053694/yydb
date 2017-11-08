<template>
    <div>

        <div class="index-top-tip">
            <img src="../../common/images/tip-guanzhu.png" v-if="isWx" @click="topTipWx">
            <div class="index-top-tip-close" @click="closeTopTip"></div>
        </div>

        <div class="masker" v-show="wxCode" @touchmove.prevent @click="closeWxCode"></div>
        <div class="index-top-wxcode-div" v-show="wxCode">
            <div class="index-top-wxcode-img">
                <img src="../../common/images/erweima.png">
            </div>
            <div class="index-top-wxcode-txt">
                <p>长按识别关注</p>
                <p>“流量掌厅”公众号</p>
            </div>
        </div>



        <div class="user-main-div">
            <div class="user-main-bind-bg">
                <div class="user-main-bind-div" @click="checkBinding">
                    <img class="user-main-header" :src="ucList.userInfo.icon"/>
                    <span>{{ucList.userInfo.mobile}}</span>
                    <div class="user-main-recharge-div" @click="toFillIndex">
                        <img src="../../common/images/user-recharge.png"/>
                        <div class="user-main-recharge">
                            <a>充值</a>
                        </div>
                    </div>
                </div>
                <div class="user-main-total-div clearfix">
                    <div class="s-left">
                        <span>流量券(张)：</span><span>{{ucList.flowCount}}</span>
                    </div>
                    <div class="s-left">
                        <span>夺宝券(张)：</span><span>{{ucList.couponCount}}</span>
                    </div>
                </div>
            </div>
            <div class="line-hr"></div>
            <div class="user-main-num-div">
                <div class="user-main-list-div">
                    <a @click="toMyOrderList(0)">
                        <p><img src="../../common/images/all_20170228.png"/></p>
                        <p>全部</p>
                    </a>
                </div>
                <div class="user-main-list-div">
                    <a @click="toMyOrderList(1)">
                        <p><img src="../../common/images/ing_20170228.png"/></p>
                        <p>进行中</p>
                    </a>
                </div>
                <div class="user-main-list-div">
                    <a @click="toMyOrderList(4)">
                        <p><img src="../../common/images/wing_20170228.png"/></p>
                        <p>中奖</p>
                    </a>
                </div>
            </div>
        </div>

        <div id="userCenterList">
            <div class="user-list-div">

                <div class="line-hr"></div>
                <a @click="toShowOrderList()">
                    <div class="user-list">
                        <img src="../../common/images/share_20170228.png">
                        <span>晒单分享</span>
                    </div>
                </a>

                <div class="line-hr"></div>
                <a @click="toshare()">
                    <div class="user-list">
                        <img src="../../common/images/gift_20170228.png">
                        <span>邀请有礼</span>
                        <p class="user-list-tip s-right" style="color: #9f9f9f;font-size: 0.75rem;">邀请好友得夺宝抵用券</p>
                    </div>
                </a>
                <div class="line-hr"></div>
            </div>

            <div class="user-list-div">
                <div class="line-hr"></div>
                <a @click="tofullPriceList(4,0)">
                    <div class="user-list">
                        <img src="../../common/images/allprice_20170228.png">
                        <span>全价购买</span>
                    </div>
                </a>
                <div class="line-hr"></div>
                <a @click="toRedList()">
                    <div class="user-list">
                        <img src="../../common/images/quan_20170228.png">
                        <span>夺宝抵用券</span>
                        <p v-show="ucList.couponCount>0" class="user-list-tip numColor s-right">{{ucList.couponCount}}张</p>
                    </div>
                </a>
                <div class="line-hr"></div>
                <a @click="toCouponList()">
                    <div class="user-list">
                        <img src="../../common/images/coupon.png">
                        <span>优惠券</span>
                        <p v-show="ucList.fullCutCouponCount>0" class="user-list-tip numColor s-right">{{ucList.fullCutCouponCount}}张</p>
                    </div>
                </a>

                <div class="line-hr"></div>
                <a @click="toAddress()">
                    <div class="user-list">
                        <img src="../../common/images/address_20170228.png">
                        <span>地址管理</span>
                    </div>
                </a>
                <div class="line-hr"></div>
            </div>

            <div class="user-list-div">
                <a href="http://wap.zt.raiyi.com/activity/info?k=yydbrule">
                    <div class="line-hr"></div>
                    <div class="user-list">
                        <img src="../../common/images/1yuan_20170228.png">
                        <span>夺宝怎么玩</span>

                    </div>
                </a>
                <a href="http://wap.zt.raiyi.com/activity/info?k=pkrule">
                    <div class="line-hr"></div>
                    <div class="user-list">
                        <img src="../../common/images/PK20170228.png">
                        <span>PK怎么玩</span>

                    </div>
                    <div class="line-hr"></div>
                </a>
            </div>
        </div>

        <!--<v-footer></v-footer>-->

        <div id="masker" class="masker" v-show="ucLoginAlert"></div>

        <div id="bind-div" class="alert-bind-div" v-show="ucLoginAlert">
            <div class="bind-title-div">
                <span>关联手机号</span>
                <div class="bind-title-div-del" @click="hideBinding"><img src="../../common/images/fail.png"></div>
            </div>
            <div class="bind-input">
                <input id="bindMobile" name="bindMobile" v-model="bindPhone" type="tel" maxlength="11" placeholder="绑定手机号码 夺宝号不丢">
                <div class="bind-yzm-div">
                    <input id="verifyBtn" type="button" value="获取验证码" @click="sendBindSms(this)">
                </div>
            </div>
            <div class="line-hr"></div>
            <div class="bind-input">
                <input id="verifyCode" name="verifyCode" type="tel" maxlength="4" placeholder="请输入验证码">
                <input type="hidden" id="verifyId" name="verifyId">
            </div>
            <div class="bind-txt-div numColor">
                <span>关联手机号绑定夺宝号，否则无法领奖</span>
            </div>
            <div class="bind-btn-div">
                <input type="button" value="立即关联" @click="checkBindCode">
            </div>
            <div class="line-hr" style="margin:0 auto;width: 60%"></div>

            <div class="bind-download-btn" @click="downloadApp">下载流量掌厅客户端</div>
            <div class="bind-gzh-div">
                <span>或者</span><span class="bind-gzh-black-txt">关注流量掌厅微信公众号（</span>
                <p class="bind-gzh-blue-txt">flowrate_hall</p>
                <span class="bind-gzh-black-txt">）</span>
            </div>
        </div>

        <div id="focus_bind" class="pk-bind-div">
            <div class="pk-bind-close-div s-right">
                <div class="pk-bind-close">
                    <img src="../../common/images/payTipsCloseImg.png">
                </div>
                <div class="pk-bind-close-line"></div>
            </div>
            <div class="clearfix"></div>
            <div class="pk-bind-border">
                <div class="pk-bind-border">
                    <div class="pk-bind-border">
                        <div class="pk-bind-content-div">
                            <div id="bind_div" class="pk-bind-zc" style="display: none;">
                                <img src="../../common/images/pkBind.png">
                                <div class="pk-bind-zc-txt">
                                    <span>绑定号码接收中奖通知</span>
                                </div>
                                <div class="pk-bind-zc-btn" onclick="toBing();">立即绑定</div>
                                <div class="pk-bind-code-tip">温馨提醒：不绑定将无法登记兑奖信息！</div>
                            </div>

                            <div id="focus_div" class="pk-bind-code">
                                <img src="../../common/images/pkBindCode.png" style="width: 80%;margin: 0 auto">
                                <div class="pk-bind-code-tip">
                                    <p>
                                        <span>不关注公众号</span><br>
                                        <span>将无法查看您的参与信息！</span>
                                    </p>
                                </div>
                                <img src="../../common/images/erweima.png">
                                <div class="pk-bind-code-txt">
                                    <p>
                                        <span>长按二维码识别“流量掌厅”公众号</span>
                                    </p>
                                </div>
                                <!--<div class="pk-bind-code-tip">温馨提醒：不关注将无法获取领奖信息！</div>-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <page-loading v-show="isLoading"></page-loading>

        <alert-msg></alert-msg>
    </div>
</template>

<script type="text/ecmascript-6">
    import footer from '../footer/footer.vue'
    import pageLoading from '../loading/pageLoading.vue'
    import alertMsg from '../common/alertMsg.vue'

    import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from '../../common/js/userAgent'
    import {isEmptyObject,alertmsg} from '../../common/js/common'
    import {tokenLock} from '../../common/js/tokenLock'
    import {initJsApi} from '../../common/js/appInfo'

    const ERR_OK = "0000";
    var countdown = 60;

    export default{
        data(){
            return {
                ucList: {
                    flowCount: 0,
                    couponCount: 0,
                    userInfo:{
                        mobile: "点击绑定",
                        icon: require("../../common/images/user-default-header.png")
                    }
                },
                ucUrl: '/yydb/ajax/userCenter',
                ucLoginAlert: false,
                isLoading: false,
                bindPhone: '',
                isWx: false,
                wxCode: false
            }
        },
        created(){
            initJsApi();

            var $body = $('body')
            document.title = '个人中心'
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="/favicon.ico" style="display: none;"></iframe>').on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove()
                }, 0)
            }).appendTo($body)

            this.checkBinding()
            this.getUcData()
        },
        methods:{
            getUcData(){
                this.$http.get(this.HOST + this.ucUrl + '?ac='+GetQueryString('ac')).then(response => {
                    response = response.data;
                    if (response.code === ERR_OK && response.data.userInfo != null) {
                        this.ucList = response.data;
                    }
                }, response => {
                    console.log('los');
                });
            },
            checkBinding(){
                var _this = this;
                var uuid = sessionStorage._uuid;
                if (uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]") {
                    if(isUserAgentIsFL){
                        getCurrentUserInfo(_this.bindingCallBack, true);
                    } else {
                        _this.showBinding();
                    }
                }
            },
            showBinding(){
                if(window.localStorage && localStorage._bbid == null && sessionStorage._bbid != null && sessionStorage._bbid != undefined){
                    alertmsg("请不要使用隐私模式");
                    return;
                }

                this.ucLoginAlert = true;
            },
            hideBinding(){
                this.ucLoginAlert = false;
            },
            sendBindSms(obj){
                obj = document.getElementById('verifyBtn')
                var _this = this;

                var mobile = this.bindPhone;
                var regMobile = /^1[3|4|5|6|7|8|9][0-9]{1}[0-9]{8}$/;
                if (!mobile || !regMobile.test(mobile)) {
                    alertmsg("请输入正确的手机号！");
                    return;
                }

                if(checkIsTokenLocked()){
                    return;
                }
                $.ajax({
                    url : "/yydb/user/bind/verifyMobile?ac="+GetQueryString('ac')+"&mobile="+mobile,
                    dataType : "json",
                    complete : function() {
                    },
                    success : function(result) {
                        if (result && result.code == "0000") {
                            $("#verifyId").val(result.data);
                            alertmsg("验证码发送成功，请关注短信！");
                            _this.settime(obj);
                        } else {
                            alertmsg(result.msg);
                        }
                        releaseTokenLock();
                    }
                });
            },
            settime(obj){
                var _this = this;
                if (countdown == 0) {
                    obj.removeAttribute("disabled");
                    obj.value="获取验证码";
                    obj.style.fontSize="0.85rem";
                    countdown = 60;
                    return;
                } else {
                    obj.setAttribute("disabled", true);
                    obj.value=countdown + "秒后重新发送";
                    obj.style.fontSize="0.75rem";
                    countdown--;
                }
                setTimeout(function() {_this.settime(obj)},1000)
            },
            checkBindCode(){
                var _this = this;

                var mobile = _this.bindPhone;
                var regMobile = /^1[3|4|5|6|7|8|9][0-9]{1}[0-9]{8}$/;
                if (!mobile || !regMobile.test(mobile)) {
                    alertmsg("请输入正确的手机号！");
                    return;
                }
                var verifyId = $("#verifyId").val();
                if (!verifyId) {
                    alertmsg("请在当前页面获取验证码！");
                    return;
                }
                var verifyCode = $("#verifyCode").val();
                if (!verifyCode || verifyCode=='验证码') {
                    alertmsg("请输入正确验证码！");
                    return;
                }
                _this.isLoading = true;
                $.ajax({
                    url: "/yydb/user/bind/verifyCode?ac="+GetQueryString('ac')+"&mobile=" + mobile + "&verifyId=" + verifyId + "&verifyCode=" + verifyCode,
                    dataType: "json",
                    complete : function() {
                        _this.isLoading = false
                    },
                    success: function (result) {
                        if (result && result.success) {
                            alertmsg("恭喜您，手机号绑定成功！");
                            window.setTimeout(function(){
                                _this.hideBinding();
                                if(isUserAgentIsWX){
                                    getWxUserInfo(_this.bindingCallBack);
                                } else {
                                    getBrowserUserInfo(_this.bindingCallBack);
                                }
                            },1500);
                        } else {
                            if (result) {
                                alertmsg(result.msg);
                            } else {
                                alertmsg("操作失败，请尝试重新打开页面！");
                            }
                        }
                    },
                    error:function(){
                        alertmsg("亲，网络不畅，请重试！");
                    }
                });
            },
            bindingCallBack(){
                this.getUcData()
            },
            verifyBinding(){
                var uuid = sessionStorage._uuid;
                var ooid = sessionStorage._ooid;

                if(isUserAgentIsFL){
                    if (uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]") {
                        getAppUserInfo();
                    }
                }else if(isUserAgentIsWX){
                    if (uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]") {
                        this.checkWxInfo();
                    }
                }else{
                    if (uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]") {
                        this.toBind();
                    }
                }
            },
            toBind(){
                if(window.localStorage && localStorage._bbid == null && sessionStorage._bbid != null && sessionStorage._bbid != undefined){
                    alertmsg("请不要使用隐私模式");
                    return;
                }

//                $('#masker').css('z-index','8');
//                $("#masker").show();
//                $("#bind-div").show();
                this.ucLoginAlert=true;
            },
            checkWxInfo(){
                var ooid = sessionStorage._ooid;
                if (ooid == undefined || ooid == "" || ooid == "[object HTMLInputElement]") {
                }
                else {
                    $.ajax({
                        url: "/common/checkWxSubscribe?ac=" + GetQueryString('ac'),
                        async: false,
                        dataType: "json",
                        success: function (result) {
                            if (result && result.success) {
                                var subscribe = result.data.subscribe;
                                // 已关注
                                if (subscribe == "1" || subscribe == 1) {

                                } else {
                                    this.isWx = true;
                                    return;
                                }
                            } else {

                            }
                        },
                        error: function () {
                        }
                    });
                }
            },
            tofullPriceList(status,preiod){
                var uuid = sessionStorage._uuid;
                if(uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]"){
                    this.verifyBinding();
                    return;
                }
                sessionStorage.setItem("isMy", "1");
                var url = "/yydb/user/center/toFullPrice?ac="+GetQueryString('ac')+"&status="+status+"&isPreiod="+preiod;
                window.location.href = url;
            },
            toRedList(){
                var uuid = sessionStorage._uuid;
                if(uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]"){
                    this.verifyBinding();
                    return ;
                }
                var url = "/yydb/redpackage/rplistInfo?ac="+GetQueryString('ac')+"&uuid="+uuid;
                window.location.href = url;
            },
            toCouponList(){
                // 跳转优惠券列表页面
                var uuid = sessionStorage._uuid;
                if (uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]") {
                    this.checkBinding();
                    return;
                }
                var url = "/yydb/coupon/toList?ac="+GetQueryString('ac');
                window.location.href = url;
            },
            toAddress(){
                var uuid = sessionStorage._uuid;
                if(uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]"){
                    this.verifyBinding();
                    return ;
                }
                sessionStorage.setItem("address_belong", "userCenter");
                var url = "/yydb/toAddressManage?ac="+GetQueryString('ac')+"&uuid="+uuid+"&belong=userCenter";
                window.location.href = url;
            },
            downloadApp(){
                window.location.href = "http://wap.zt.raiyi.com/activity/info?k=download";
            },
            toMyOrderList(status, isReplace){
                var url = "/yydb/toMy?ac="+GetQueryString('ac');
                if (status != undefined && status != "") {
                    url += "&status=" + status;
                }
                if (isReplace) {
                    window.location.replace(url);
                } else {
                    window.location.href = url;
                }
            },
            toShowOrderList(goodsId){
                var url = "/yydb/user/center/toShowOrderList?ac="+GetQueryString('ac');
                if (goodsId != null && goodsId != undefined && goodsId != "") {
                    url += "&goodsId=" + goodsId;
                }
                window.location.href = url;
            },
            toshare(){
                var uuid = sessionStorage._uuid;
                if (uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]") {
                    this.checkBinding();
                    return;
                }
                var url = "/yydb/redpackage/shareredpacket?ac="+GetQueryString('ac')+"&uuid=" + uuid;
                window.location.href = url;
            },
            topTipWx(){
                this.wxCode=true;
            },
            closeWxCode(){
                this.wxCode=false;
            },
            closeTopTip(){
                this.isWx=false;
            },
            toFillIndex(){
                var url = "/gold/fill/index?ac=" + GetQueryString('ac');
                window.location.href = url;
            },
            isEmptyObj(e){
                isEmptyObject(e)
            }
        },
        components: {
            'v-footer': footer,
            'page-loading': pageLoading,
            'alert-msg': alertMsg
        }
    }
</script>

<style scoped>
    .user-main-div {
        background: #fff;
        padding: 5% 0 0;
    }

    .user-main-name-phone {
        width: 15rem;
    }

    .user-main-name {
        font-size: 1.5rem;
    }

    .user-main-phone {
        font-size: 1.1rem;
        color: #808080;
        margin-top: 0.5rem;
    }

    .user-main-img {
        width: 4rem;
        height: 4rem;
    }

    .user-main-img img {
        width: 100%;
        height: 100%;
        border-radius: 9999px;
    }

    .user-main-div .line-hr {
        margin-top: 0.8rem;
    }

    .user-main-num-div {
        padding: 0.5rem 0;
    }

    .user-main-num-div > .user-main-list-div:nth-child(2) {
        border-left: 1px solid #e1e1e1;
        border-right: 1px solid #e1e1e1;
    }

    .user-main-list-div {
        display: inline-block;
        text-align: center;
        width: 33%;
        margin-right: -4px;
    }

    .user-main-list-div p {
        color: #323232;
        font-size: 1rem;
    }

    .user-list-div {
        background: #fff;
        margin-top: 0.5rem;
    }

    .user-list {
        font-size: 1rem;
        color: #323232;
        line-height: 3rem;
        text-indent: 5%;
        background: url(../../common/images/arrow.png) 95% center no-repeat;
        background-size: 3%;
    }

    .user-list:active {
        background: #f2f2f2;
    }

    .user-list img {
        display: inline-block;
        width: 1.4rem;
        vertical-align: sub;
        margin-right: 0.5rem;
    }

    #userCenterList {
        margin-bottom: 4rem;
    }

    .user-main-unbind-div {
        text-align: center;
    }

    .user-main-unbind-title {
        font-size: 1.3rem;
        color: #323232;
    }

    .user-main-unbind-txt {
        font-size: 1rem;
        color: #808080;
    }

    .user-main-list-div p:first-child img {
        display: inline-block;
        width: 1.4rem;
    }

    .user-list-tip {
        font-size: 1rem;
        margin-right: 2.2rem;
        max-width: 55%;
        height: 3rem;
        overflow: hidden;
    }

    .user-main-div {
        padding: 0;
    }

    .user-main-div .line-hr {
        margin-top: 0;
    }

    .user-main-bind-bg {
        background: url(../../common/images/userCenter-bg.png) no-repeat;
        background-size: 100% 100%;
    }

    .user-main-bind-div {
        color: #fff;
        font-size: 1.3rem;
        padding: 5%;
        position: relative;
    }

    .user-main-header {
        width: 4rem;
        height: 4rem;
        border: 0;
        border-radius: 9999px;
        display: inline-block;
        vertical-align: middle;
    }

    .user-main-recharge-div {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        height: 2.2rem;
    }

    .user-main-recharge-div > img {
        height: 100%;
    }

    .user-main-recharge {
        position: absolute;
        top: 50%;
        left: 55%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-size: 1.2rem;
        line-height: 1;
    }

    .user-main-recharge a {
        color: #fff;
    }

    .user-main-total-div {
        width: 100%;
        color: #fff;
        font-size: 0.75rem;
        /*background: url(../../common/images/arrow-white.png) 95% center no-repeat;*/
        /*background-size: 3%;*/
        background-color: rgba(0, 0, 0, 0.2);
        position: relative;
    }

    .user-main-total-div:after {
        content: '';
        width: 1px;
        height: 50%;
        background-color: rgba(0, 0, 0, 0.3);
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .user-main-total-div > div {
        width: 50%;
        padding: 1rem 5%;
        box-sizing: border-box;
    }

    .user-main-total-div > div > span {
        vertical-align: middle;
    }

    .user-main-total-div > div > span:last-child {
        font-size: 1.1rem;
    }

    .alert-bind-div {
        background: #f2f2f2;
        border-radius: 3px;
        padding: 1rem 0;
        box-sizing: border-box;
        position: fixed;
        top: 50%;
        left: 50%;
        margin: auto;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 650px;
        min-width: 270px;
        z-index: 9;
    }

    .bind-title-div {
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1rem;
        position: relative;
    }

    .bind-title-div-del {
        position: absolute;
        top: -0.8rem;
        right: 0.2rem;
        width: 1.8rem;
        z-index: 9;
    }

    .bind-title-div-del img{
        width: 100%;
    }

    .bind-input {
        position: relative;
    }

    .bind-input > input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        font-size: 1rem;
        font-family: arial, "Microsoft Yahei";
        border: 0;
        padding-left: 1rem;
        box-sizing: border-box;
        line-height: 2.6rem;
    }

    .bind-yzm-div {
        position: absolute;
        top: 0;
        right: 5%;
    }

    .bind-yzm-div > input {
        -webkit-appearance: none;
        appearance: none;
        font-size: 1rem;
        font-family: arial, "Microsoft Yahei";
        line-height: 2.6rem;
        background: #fff;
        border: 0;
        color: #35b5ff;
    }

    .bind-btn-div {
        width: 75%;
        margin: 1rem auto;
    }

    .bind-btn-div > input {
        -webkit-appearance: none;
        appearance: none;
        font-size: 1rem;
        font-family: arial, "Microsoft Yahei";
        line-height: 2.6rem;
        background: #35b5ff;
        border: 0;
        border-radius: 3px;
        color: #fff;
        width: 100%;
    }

    .bind-txt-div {
        margin: 0 auto;
        text-align: center;
        font-size: 0.75rem;
        padding-top: 1rem;
    }

    .bind-gzh-div {
        text-align: center;
        font-size: 0.75rem;
        color: #808080;
    }

    .bind-gzh-black-txt {
        color: #323232;
    }

    .bind-gzh-blue-txt {
        color: #35b5ff;
        display: inline-block;
        line-height: 1.6rem;
    }

    .bind-download-btn {
        width: 75%;
        margin: 1rem auto;
        text-align: center;
        border: 1px solid #fc5454;
        border-radius: 3px;
        line-height: 2.6rem;
        font-size: 1rem;
        color: #fc5454;
    }

    .bind-gzh-btn {
        border: 1px solid #3fc731;
    }

    #proListAlert {
        position: fixed;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 576px;
        min-width: 240px;
        display: none;
        z-index: 10;
    }

    #proListAlert > div {
        position: relative;
    }

    #proListAlert > div > div {
        position: absolute;
        top: 0;
        right: 0;
        padding: 1%;
        width: 10%;
    }

    #proListAlert > div img {
        width: 100%;
    }

    .pk-bind-div {
        position: fixed;
        top: 1.5rem;
        left: 0;
        right: 0;
        margin: auto;
        width: 80%;
        max-width: 560px;
        min-width: 240px;
        z-index: 9;
        display: none;
    }

    .pk-bind-border {
        width: 100%;
        background: #ffb6b6;
        border: 2px solid #fc5454;
        padding: 0.2rem;
        box-sizing: border-box;
    }

    .pk-bind-content-div {
        background: #fff;
        border: 2px solid #fc5454;
        box-sizing: border-box;
        padding: 1rem;
        position: relative;
    }

    .pk-bind-content-div img {
        width: 100%;
    }

    .pk-bind-zc-txt {
        font-size: 1.3rem;
        margin: 1rem 0 0.6rem;
        text-align: center;
    }

    .pk-bind-zc-btn {
        background: #35b5ff;
        color: #fff;
        font-size: 1.3rem;
        text-align: center;
        line-height: 2.6rem;
        border-radius: 3px;
        margin: 0 0.4rem;
    }

    .pk-bind-close-div {
        margin-right: -1.2rem;
    }

    .pk-bind-close {
        border: 2px solid #fc5454;
        border-radius: 100%;
        display: inline-block;
        box-sizing: border-box;
        padding: 0.6rem;
    }

    .pk-bind-close > img {
        width: 1rem;
    }

    .pk-bind-close-line {
        width: 2px;
        height: 2rem;
        background: #fc5454;
        margin: 0 auto;
    }

    .pk-bind-code-txt {
        font-size: 0.75rem;
        text-align: center;
    }

    .pk-bind-code-tip {
        color: #fc5454;
        font-size: 1rem;
        padding: 0.2rem 0.2rem 0.15rem;
        box-sizing: border-box;
        text-align: center;
    }

    .index-top-tip{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        max-width: 720px;
        min-width: 300px;
        z-index: 2;
    }

    .index-top-tip img{
        width: 100%;
    }

    .index-top-tip-close{
        position: absolute;
        top: 31%;
        left: 3%;
        width: 4%;
        height: 36%;
        z-index: 9;
    }
</style>