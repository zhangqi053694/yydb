<template>
    <div class="goods">
        <input id="_bbid" type="hidden"/>
        <input type="hidden" id="_appCode">
        <input type="hidden" id="_channel">
        <input type="hidden" id="_appVersion">
        <input type="hidden" id="_deviceId">
        <input type="hidden" id="_uuid">
        <input type="hidden" id="_ooid">

        <div class="index-top-tip">
            <img src="../../common/images/tip-guanzhu.png" v-if="isWx" @click="topTipWx">
            <img src="../../common/images/tip-dakai.png" v-if="isNoWx" @click="indexDownloadFun">
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

        <div v-if="bannerTip['isShow']==='1'" class="topTip">
            <ul>
                <li><a :href="bannerTip['url']">{{bannerTip['msg']}}</a></li>
            </ul>
        </div>
        <swiper v-if="bannerListLength" class="banner-swiper" :options="bannerOption">
            <swiper-slide v-for="bannerItem in bannerList" :key="bannerItem.icon">
                <a :href="bannerItem.url">
                    <img :src="bannerItem.icon">
                </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div v-if="!bannerListLength" class="banner-swiper">
            <a :href="bannerList[0].url">
                <img :src="bannerList[0].icon">
            </a>
        </div>
        <div class="index-lucky-wrapper">
            <img class="mar" src="../../common/images/icon_03.png">
            <swiper id="Marquee" :options="swiperOption">
                <swiper-slide class="index-lucky-item" v-for="luckyItem in luckyList" :key="luckyItem.periodId">
                    <span>恭喜</span><span class="index-lucky-item-name">{{luckyItem.luckyUserNickname}}</span><span>用户{{luckyItem.lastTime}}前夺得{{luckyItem.goodsName}}</span>
                </swiper-slide>
            </swiper>
        </div>
        <div v-if="topTabList!=null" class="index-tab-div clearfix">
            <div v-for="topTabItem in topTabList" class="index-tab-list s-left"
                 :class="{'index-tab-list-more':topTabList.length>3}">
                <a :href="topTabItem.url">
                    <div class="index-tab-img">
                        <img :src="topTabItem.icon"/>
                        <p class="index-tab-hot"></p>
                    </div>
                    <div class="index-tab-txt">
                        <p>{{topTabItem.cname}}</p>
                    </div>
                </a>
            </div>
        </div>
        <div class="index-timedown-div" v-if="!isEmptyObject(timeDownList)" @click="toNewOpen(3)">
            <img class="index-timedown-img" src="../../common/images/icon_04.png">
            <swiper class="index-timedown-content clearfix" :options="tdSwiperOption" v-if="timeDownList.length>1">
                <swiper-slide v-for="timeDownItem in timeDownList" :key="timeDownItem.periodId">
                    <p class="s-left">
                        <span>距离</span><span class="numColor">第{{timeDownItem.periodId}}期</span><span>开奖</span>
                    </p>
                    <p class="s-left">
                        <index-time-down :endTime='timeDownItem.countdownTime'></index-time-down>
                    </p>
                </swiper-slide>
            </swiper>
            <div class="index-timedown-content clearfix" v-else="" v-for="timeDownItem in timeDownList">
                <p class="s-left">
                    <span>距离</span><span class="numColor">第{{timeDownItem.periodId}}期</span><span>开奖</span>
                </p>
                <p class="s-left">
                    <index-time-down :endTime='timeDownItem.countdownTime' @time-done="getTimeDownList"></index-time-down>
                </p>
            </div>
        </div>

        <!--商品列表-->
        <div class="index-list-div">
            <div class="index-list-sort">
                <div v-for="item in sortTabs" class="index-list-sort-item" :class="{sortActive:item.isActive}"
                     @click="toogleSort(item)">
                    {{item.sortName}}
                    <p v-if="item.sortType==4 && item.sortRule==0 && item.isActive"
                       class="index-sort-arrow index-sort-arrow-jx">
                        <img class="index-sort-img-up" src="../../common/images/icon-sort-up.png">
                        <img class="index-sort-img-down" src="../../common/images/icon-sort-down.png">
                    </p>
                    <p v-if="item.sortType==4 && item.sortRule==1 && item.isActive" class="index-sort-arrow">
                        <img class="index-sort-img-up" src="../../common/images/icon-sort-up.png">
                        <img class="index-sort-img-down" src="../../common/images/icon-sort-down.png">
                    </p>
                    <p v-if="item.sortType==4 && !item.isActive" class="index-sort-arrow">
                        <img class="index-sort-img-up index-sort-arrow-jx" src="../../common/images/icon-sort-down.png">
                        <img class="index-sort-img-down" src="../../common/images/icon-sort-down.png">
                    </p>
                </div>
            </div>
            <div class="line-hr"></div>
            <transition name="fade">
                <div v-show="showStatus" class="index-sort-load">
                    <img class="index-sort-load-img" src="../../common/images/loading.png">
                </div>
            </transition>
            <div v-show="showStatus" class="line-hr"></div>
            <ul class="index-list" style="font-size: 0;" v-if="!isEmptyObject(goods)">
                <li v-for="proItem in goods" class="index-list-item">
                    <a @click="toUrl('/yydb/detail?',currentSortType===3?'periodId='+proItem.periodId+'&isAll=1':'periodId='+proItem.periodId)">
                        <div class="index-list-item-img">
                            <img :src="proItem.goodsIcon"/>
                        </div>
                        <p class="index-list-item-title">{{proItem.goodsName}}</p>
                        <div class="index-list-item-progress-div">
                            <div class="index-progress">
                                <div class="index-progress-bar"
                                     :style="{width:(proItem.needCount-proItem.remainCount)/proItem.needCount*100+'%'}"></div>
                            </div>
                            <p class="index-jd">进度：<span class="numColor">{{proItem.progressRate}}%</span></p>
                        </div>
                        <div v-if="currentSortType!=3" class="index-list-item-btn">立即夺宝</div>
                        <div v-if="currentSortType==3" class="index-list-item-btn">包尾</div>
                    </a>
                </li>
                <li v-if="goods.length%2!=0" class="index-list-item" style="background: #f2f2f2;">
                    <img src="../../common/images/defaultList.png" style="width: 68%;margin: 0 auto;" />
                </li>
            </ul>
        </div>
        <!--<v-footer></v-footer>-->
        <div class="tips" style="display: none;"></div>

        <div id="masker" class="masker" v-show="isPopup" @touchmove.prevent></div>
        <div v-show="isPopup" id="proListAlert">
            <div>
                <a id="popup_url" :href="indexPopup.url">
                    <img id="popup_img" :src="indexPopup.img">
                </a>
                <div @click="closeAlert();">
                    <img src="../../common/images/proListClose.png">
                </div>
            </div>
        </div>

        <div class="masker" v-show="isWinning" @touchmove.prevent @click="winningAlert"></div>
        <div v-show="isWinning" id="winningAlert">
            <div>
                <a :href="winningPopup[0].url">
                    <img :src="winningPopup[0].img">
                </a>
                <div class="winning-close" @click="winningAlert">关闭</div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import footer from '../footer/footer.vue'
    import indexTimeDown from '../time/indexTimeDown.vue'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'

    import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from '../../common/js/userAgent'
    import {cookie, setCookie, getCookie, delCookie} from '../../common/js/cookie'
    import {alertmsg} from '../../common/js/common'
    import {wxShare} from '../../common/js/wxShare'
    import {appShare, doFLShareInfo} from '../../common/js/appShare'
    import {appInfo,initJsApi} from '../../common/js/appInfo'
    import userInfo from '../../common/js/userInfo'
    import bdCount from '../../common/js/bdCount'

    import {index} from '../../common/js/index'


    const ERR_OK = "0000";

    let localObj = window.location;
    let contextPath = localObj.pathname.split("/")[1];
    let basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
    //let server_context = basePath;

    let server_context = 'http://' + localObj.host;

    let bannersList;

    let strSortType = window.location.href.substring(window.location.href.lastIndexOf("#") + 1, window.location.href.indexOf("/") + 1) + 'SortType';
    let strSortRule = window.location.href.substring(window.location.href.lastIndexOf("#") + 1, window.location.href.indexOf("/") + 1) + 'SortRule';


    export default{
        data(){
            return {
                sortTabs: [
                    {
                        sortName: "热门",
                        sortType: 1,
                        sortRule: 0,
                        isActive: true
                    },
                    {
                        sortName: "进度",
                        sortType: 2,
                        sortRule: 0,
                        isActive: false
                    },
                    {
                        sortName: "包尾",
                        sortType: 3,
                        sortRule: 0,
                        isActive: false
                    },
                    {
                        sortName: "总需",
                        sortType: 4,
                        sortRule: 0,
                        isActive: false
                    }
                ],
                goods: null,
                currentSortType: 1,
                currentSortRule: 0,
                luckyList: {},
                topTabList: [
                    {
                        cname: " ",
                        url: 'javascript:;',
                        icon: require('../../common/images/index-tab-default.png')
                    },
                    {
                        cname: " ",
                        url: 'javascript:;',
                        icon: require('../../common/images/index-tab-default.png')
                    },
                    {
                        cname: " ",
                        url: 'javascript:;',
                        icon: require('../../common/images/index-tab-default.png')
                    },
                    {
                        cname: " ",
                        url: 'javascript:;',
                        icon: require('../../common/images/index-tab-default.png')
                    },
                ],
                isPopup: false,
                indexPopup: [{img: require('../../common/images/proListAlert.png'), url: 'javascript:;'}],
                isWinning: false,
                winningPopup: [{img: require('../../common/images/alertZj.png'), url: 'javascript:;'}],
                bannerTip: {},
                bannerList: [{url: 'javascript:;', icon: require('../../common/images/mr_banner.png')}],
                bannerListLength: false,
                bannerOption: {
                    autoplay: 3000,
                    direction: 'horizontal',
                    autoplayDisableOnInteraction: false,
                    pagination: '.swiper-pagination',
                    loop: true
                },
                swiperOption: {
                    autoplay: 3000,
                    direction: 'vertical',
                    autoplayDisableOnInteraction: false,
                    loop: true
                },
                goodListUrl: '/yydb/ajax/index/goods?',
                luckyListUrl: '/yydb/ajax/luckyList',
                bannerTipUrl: '/yydb/ajax/index/bannerTip',
                //bannerListUrl: '/cms/getCmsResource?position=yydb_banner',
                showStatus: false,
                topTabListUrl: '/cms/getCmsResource?position=yydb_gnmk',
                topTimeDownUrl: '/yydb/ajax/countdownData',
                timeDownList: null,
                tdSwiperOption: {
                    autoplay: 3000,
                    direction: 'vertical',
                    autoplayDisableOnInteraction: false
                },
                isWx: false,
                wxCode: false,
                isNoWx: false
            }
        },
        created(){
            initJsApi();

            var $body = $('body')
            document.title = '1元夺宝'
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="/favicon.ico" style="display: none;"></iframe>').on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove()
                }, 0)
            }).appendTo($body)

            this.showStatus = true;

            if (!isUserAgentIsWX && !isUserAgentIsFL && !isUserAgentIsZT){
                this.isNoWx=true;
            }

            let _this = this;

            let isShare = true;
            let title = "流量掌厅，每天都给自己一点惊喜";
            let content = "哇，喜从天降，超值大奖，等你来夺！这种好消息，必须拿出来分享!";
            let imageUrl = "http://filestore.zt.raiyi.com/fs/userIcon/79800.png";
            let shareUrl = "http://hd.zt.raiyi.com/yydb/index?ac="+GetQueryString('ac');
            if (isUserAgentIsWX) {
                doWXShareInfo(title, content, imageUrl, shareUrl, isShare);
            }

            if (getCookie(strSortType)) {
                this.currentSortType = parseInt(getCookie(strSortType));
                this.currentSortRule = parseInt(getCookie(strSortRule));

                for (let i = 0; i < this.sortTabs.length; i++) {
                    this.sortTabs[i].isActive = false;
                    if (this.sortTabs[i].sortType === parseInt(this.currentSortType)) {
                        this.sortTabs[i].isActive = true;
                        this.sortTabs[i].sortRule = this.currentSortRule;
                    }
                }
            }

            let getUrl = this.goodListUrl + 'ac='+GetQueryString('ac')+'&sortType=' + this.currentSortType + '&sortRule=' + this.currentSortRule;
            this.$http.get(_this.HOST + getUrl).then(response => {
                response = response.data;
                if (response.code === ERR_OK) {
                    this.goods = response.data;
                    this.showStatus = false;
                    this.$nextTick(() => {
                        this.indexScroll();
                    });
                }
            }, response => {
                console.log('los');
            });

            this.$http.get(urlHost + this.luckyListUrl).then(response => {
                response = response.data;
                if (response.code === ERR_OK) {
                    this.luckyList = response.data;
                }
            }, response => {
                console.log('los');
            });

            this.$http.get(urlHost + this.bannerTipUrl).then(response => {
                response = response.data;
                if (response.code === ERR_OK) {
                    this.bannerTip = response.data;
                }
            }, response => {
                console.log('los');
            });

            //app回调
            if (!isUserAgentIsFL && !isUserAgentIsWX && !isUserAgentIsZT) {
                //let result = [{url: 'javascript:;', icon: require('../../common/images/PKbanner.png')}];
                //this.bannerList = result;
                getBanner('other_browser', '1.0.0', 'other_browser', 'other_browser_yydb');
                getTopTab('other_browser', '1.0.0', 'other_browser', 'other_browser_yydb');
                //this.topTabList = null;
            }
            if (isUserAgentIsWX) {
                getBanner('fc_wx', '1.0.0', 'fc_wx', 'wx_yydb');
                getTopTab('fc_wx', '1.0.0', 'fc_wx', 'wx_yydb');
            }
            if (isUserAgentIsFL || isUserAgentIsZT) {
                window.setTimeout(function () {
                    if (window.FLJsBridge) {
                        window.FLJsBridge.getAppInfo('appInfoCallBackIndex');
                    } else {
                        document.addEventListener('FLJsBridge', function (event) {
                            window.FLJsBridge.getAppInfo('appInfoCallBackIndex');
                        }, false);
                    }
                }, 200);
            }

            window.appInfoCallBackIndex = function (result) {
                var appData = eval('(' + result + ')');
                if (appData) {
                    getBanner(appData.appcode, appData.appversion, appData.channel, appData.deviceid);
                    getTopTab(appData.appcode, appData.appversion, appData.channel, appData.deviceid);
                }
            }

            function getBanner(appcode, appversion, channel, deviceid) {
                var url = urlHost + "/cms/getCmsResource?ac="+GetQueryString('ac')+"&position=yydb_banner";
                var appInfo = "&appCode=" + appcode + "&appVersion=" + appversion + "&channel=" + channel + "&deviceId=" + deviceid;
                url += appInfo;
                $.ajax({
                    url: url,
                    async: false,
                    dataType: "json",
                    success: function (result) {
                        if (result && result.code === ERR_OK) {
                            result = result.data;
                            if (result !== null) {
                                _this.bannerList = result;
                                if (result.length === 1) {
                                    _this.bannerListLength = false;
                                }
                                else {
                                    _this.bannerListLength = true;
                                }
                            }
                        } else {
                            let resultB = [{url: 'javascript:;', icon: require('../../common/images/mr_banner.png')}];
                            _this.bannerList = resultB;
                        }
                    },
                    error: function () {
                        let resultC = [{url: 'javascript:;', icon: require('../../common/images/mr_banner.png')}];
                        _this.bannerList = resultC;
                    }
                });
            }

            function getTopTab(appcode, appversion, channel, deviceid) {
                let url = urlHost + _this.topTabListUrl;
                let appInfo = "&ac="+GetQueryString('ac')+"&appCode=" + appcode + "&appVersion=" + appversion + "&channel=" + channel + "&deviceId=" + deviceid;
                url += appInfo;
                $.ajax({
                    url: url,
                    async: false,
                    dataType: "json",
                    success: function (result) {
                        if (result && result.code === ERR_OK) {
                            result = result.data;
                            if (result !== null) {
                                _this.topTabList = result;
                            }
                        } else {
                            _this.topTabList = null;
                        }
                    },
                    error: function () {
                        _this.topTabList = null;
                    }
                });
            }

            //app回调结束

            var isIndexPopup = sessionStorage.isIndexPopup;
            if (isIndexPopup !== "1" && isIndexPopup !== 1) {
                getSmartRec();
            }
            function getSmartRec() {
                let url = urlHost + "/yydb/checkIsPopup?ac="+GetQueryString('ac')+"&triggerType=index";
                $.ajax({
                    url: url,
                    async: false,
                    dataType: "json",
                    success: function (result) {
                        if (result && result.code === ERR_OK) {
                            _this.indexPopup = result.data;
                            _this.isPopup = true;
//                            var img = result.data.img;
//                            var url = result.data.url;
//                            $("#popup_img").attr("src", img);
//                            $("#popup_url").attr("href", url);

//                            $("#masker,#proListAlert").fadeIn(300);

                            sessionStorage.setItem("isIndexPopup", "1");
                        }
                    },
                    error: function () {
                    }
                });
            }

            //倒计时
            this.getTimeDownList()

            if (isUserAgentIsWX) {
                var ooid = sessionStorage._ooid;
                if (ooid == undefined || ooid == "" || ooid == "[object HTMLInputElement]") {
                }
                else {
                    $.ajax({
                        url: urlHost + "/common/checkWxSubscribe?ac=" + GetQueryString('ac'),
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
            }
        },
        methods: {
            toogleSort(item){
                this.showStatus = true;
                if (item.isActive && item.sortType === 4 && item.sortRule === 0) {
                    item.sortRule = 1;
                }
                else if (item.isActive && item.sortType === 4 && item.sortRule === 1) {
                    item.sortRule = 0;
                }
                for (let i = 0; i < this.sortTabs.length; i++) {
                    this.sortTabs[i].isActive = false;
                }
                item.isActive = !item.isActive;
                let sortUrl = this.HOST + this.goodListUrl + 'ac=' + GetQueryString('ac') + '&sortType=' + item.sortType + '&sortRule=' + item.sortRule;
                this.currentSortType = item.sortType;
                this.currentSortRule = item.sortRule;
                setCookie(strSortType, this.currentSortType);
                setCookie(strSortRule, this.currentSortRule);
                //this.sortType = item.sortType;
                this.getGoodList(sortUrl);
            },
            getGoodList(sortUrl){
                this.$http.get(sortUrl).then(response => {
                    response = response.data;
                    if (response.code === ERR_OK) {
                        this.goods = response.data;
                        this.showStatus = false;
                    }
                }, response => {
                    console.log('los');
                    this.showStatus = false;
                });
            },
            closeAlert(){
                $("#masker,#proListAlert").fadeOut(200);
            },
            winningAlert(){
                this.isWinning = false;
            },
            indexScroll(){
                let str = window.location.href;
                str = str.substring(str.lastIndexOf("#") + 1);
                str = str.substring(str.lastIndexOf("/") + 1) + 'Scroll';
                $("html,body").animate({scrollTop: getCookie(str)}, 0);
            },
            toUrl(urlAction, urlParameter){
                let url = server_context + urlAction + 'ac=' + GetQueryString('ac') + '&' + urlParameter;
                //console.log(url);
                window.location.href = url;
            },
            toNewOpen(status){
                sessionStorage.setItem("indexNavItem", status);
                //var url = server_context + "/yydb/toNewOpen?access="+getUrlSource();
                //window.location.href = url;
                this.$router.replace('/newOpen');
            },
            getTimeDownList(){
                this.$http.get(this.HOST + this.topTimeDownUrl + '?ac=' + GetQueryString('ac')).then(response => {
                    response = response.data;
                    if (response.code === ERR_OK) {
                        this.timeDownList = response.data;
                    }
                }, response => {
                    console.log('los');
                });
            },
            topTipWx(){
                this.wxCode=true;
            },
            closeWxCode(){
                this.wxCode=false;
            },
            closeTopTip(){
                this.isWx=false;
                this.isNoWx=false;
            },
            indexDownloadFun(){
                toDownload()
            },
            isEmptyObject(e){
                var t;
                for (t in e)
                    return !1;
                return !0
            }
        },
        components: {
            'v-footer': footer,
            swiper,
            swiperSlide,
            'index-time-down': indexTimeDown
        }
    }
</script>

<style scoped>
    .goods {
        height: 100%;
    }

    .banner-swiper {
        width: 100%;
    }

    .banner-swiper img {
        width: 100%;
    }

    .index-lucky-wrapper {
        background: #fff;
        border-bottom: 1px solid #f2f2f2;
    }

    .mar {
        display: inline-block;
        vertical-align: middle;
        width: 1rem;
        margin: 0.5rem 0;
        margin-left: 0.8rem;
    }

    #Marquee {
        margin: 0.5rem 0;
        color: #b0b0b0;
        height: 1.0rem;
        overflow: hidden;
        width: 90%;
        display: inline-block;
        vertical-align: middle;
    }

    .index-lucky-item {
        display: inline-block;
        line-height: 1.2rem;
        width: 97%;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .index-lucky-item-name {
        color: #35b5ff;
    }

    .index-tab-div {
        background: #fff;
        padding: 0.8rem;
        /*border-top: 1px solid #e9e9e9;*/
    }

    .index-tab-list {
        width: 33%;
        text-align: center;
        font-size: 0.75rem;
    }

    .index-tab-list-more {
        width: 25% !important;
    }

    .index-tab-img {
        width: 3rem;
        display: inline-block;
        margin-bottom: 0.3rem;
        position: relative;
    }

    .index-tab-img img {
        width: 100%;
    }

    .index-tab-hot {

    }

    .index-tab-txt {
        color: #b0b0b0;
    }

    .index-list-div {
        padding-bottom: 3rem;
        margin-top: 0.4rem;
    }

    .index-list-sort {
        font-size: 0;
        display: flex;
        padding: 0 0.8rem;
        background: #fff;
    }

    .index-list-sort-item {
        flex: 1;
        font-size: 0.85rem;
        color: #808080;
        text-align: center;
        line-height: 2.6rem;
        position: relative;
    }

    .sortActive {
        position: relative;
        color: #fc5454;
        font-size: 1rem;
    }

    .sortActive:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        margin: auto;
        width: 80%;
        height: 1px;
        background: #fc5454;
    }

    .index-sort-arrow {
        position: absolute;
        top: 0.9rem;
        right: 0.85rem;
    }

    .index-sort-arrow-jx {
        transform: rotate(180deg);
    }

    .index-sort-img-up {
        width: 0.6rem;
    }

    .index-sort-img-down {
        margin-top: 0.2rem;
        width: 0.6rem;
    }

    .index-sort-load-img {
        width: 2rem;
        margin: 0 auto;
        padding: 0.1rem;
        border-radius: 9999px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: all 0.5s
    }

    .fade-enter, .fade-leave-active {

    }

    .index-list-item {
        display: inline-block;
        padding: 0 0.5rem 1rem;
        box-sizing: border-box;
        background: #fff;
        width: 50%;
        margin-bottom: 2px;
        border-right: 1px solid #f2f2f2;
        font-size: 0;
    }

    .index-list-item-img img {
        width: 100%;
    }

    .index-list-item-title {
        font-size: 1rem;
        color: #000;
        display: -webkit-box;
        overflow: hidden;
        height: 1.5rem;
        font-weight: normal;
        line-height: 1.5rem;
        margin-bottom: 0.6rem;
    }

    .index-list-item-progress-div {
        display: inline-block;
        vertical-align: top;
        width: 57%;
        margin-right: 3%;
    }

    .index-progress {
        background: #e9e9e9;
        border-radius: 1rem;
        height: 0.25rem;
        overflow: hidden;
    }

    .index-progress-bar {
        height: 100%;
        border-radius: 1rem;
        background-color: #ff6c00;
    }

    .index-jd {
        font-size: 0.75rem;
        margin-top: 0.3rem;
        color: #808080;
    }

    .index-list-item-btn {
        display: inline-block;
        vertical-align: top;
        font-size: 0.75rem;
        background: #fff;
        color: #fc5454;
        border-radius: 3px;
        width: 40%;
        line-height: 1.6rem;
        text-align: center;
        border: 1px solid #fc5454;
        box-sizing: border-box;
    }

    .my-swipe {
        height: 200px;
        color: #fff;
        font-size: 30px;
        text-align: center;
    }

    .slide1 {
        background-color: #0089dc;
        color: #fff;
    }

    .slide2 {
        background-color: #ffd705;
        color: #000;
    }

    .slide3 {
        background-color: #ff2d4b;
        color: #fff;
    }

    .tips {
        top: 43%;
        left: 50%;
        transform: translate(-50%, -40%);
        width: 80%;
        max-width: 576px;
        min-width: 300px;
        position: fixed;
        background: rgba(0, 0, 0, 0.5);
        margin: 0 auto;
        text-align: center;
        right: 0;
        color: #fff;
        font-size: 1rem;
        padding: 0.8rem 0;
        border-radius: 2rem;
        z-index: 10;
        -webkit-transform: translate(-50%, -40%);
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
        /* display: none; */
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

    .topTip {
        background: #ff2e2e;
        margin-top: 0;
    }

    .topTip ul li {
        font-size: 0.8rem;
        font-weight: normal;
        padding: 0.3rem 0;
        text-indent: 3%;
        background: url(../../common/images/arrow2.png) 96% center no-repeat;
        background-size: 2%;
    }

    .topTip ul li a {
        color: #fff;
        display: block;
    }

    .topTip ul li:last-child {
        border-bottom: 0;
    }

    .topTip ul li span {
        color: #fff;
        font-size: 0.8rem;
        font-weight: normal;
        float: right;
        padding-right: 10%;
    }

    @-moz-keyframes three-quarters-loader {
        0% {
            -moz-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -moz-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes three-quarters-loader {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes three-quarters-loader {
        0% {
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    /* :not(:required) hides this rule from IE9 and below */
    .index-sort-load-img:not(:required) {
        -moz-animation: three-quarters-loader 1250ms infinite linear;
        -webkit-animation: three-quarters-loader 1250ms infinite linear;
        animation: three-quarters-loader 1250ms infinite linear;
    }

    .swiper-container-horizontal > .swiper-pagination {
        bottom: 0.2rem;
    }

    #winningAlert {
        position: fixed;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 576px;
        min-width: 240px;
        z-index: 10;
    }

    #winningAlert img {
        width: 100%;
    }

    .winning-close {
        color: #fff;
        font-size: 1.3rem;
        display: inline-block;
        border: 1px solid #fff;
        border-radius: 9999px;
        width: 6rem;
        text-align: center;
        line-height: 2.3rem;
        position: absolute;
        top: -35%;
        right: 0;
    }

    .index-list-default-img{
        width: 100%;
    }

    /*倒计时*/
    .index-timedown-div {
        border-top: 1px solid #f2f2f2;
        text-align: center;
        background: url(../../common/images/arrow-black.png) 95% center no-repeat;
        background-size: 2%;
        background-color: #fff;
    }

    .index-timedown-img {
        display: inline-block;
        vertical-align: middle;
        width: 1rem;
    }

    .index-timedown-content {
        margin: 0.5rem 0;
        color: #b0b0b0;
        height: 1.6rem;
        line-height: 1.6rem;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
    }

    .index-timedown-content > p:last-child {
        margin-left: 0.2rem;
        height: 1.6rem;
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

    .index-top-wxcode-div{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 60%;
        z-index: 9;
    }

    .index-top-wxcode-img{
        background-color: #fff;
    }

    .index-top-wxcode-txt{
        background-color: #1cbafb;
        font-size: 1rem;
        text-align: center;
        padding: 0.3rem 0;
        color: #fff;
    }

    .index-top-wxcode-txt>p:last-child{
        font-size: 1.1rem;
    }

    .index-top-wxcode-div img{
        width: 100%;
    }
</style>