<template>
    <div>

        <div class="new-top-nav">
            <ul>
                <li @click="topNavChange('3')" :class="{topNavSelect:topNavIsSelect}">
                    往期揭晓
                </li>
                <li @click="topNavChange('2')" :class="{topNavSelect:!topNavIsSelect}">
                    即将揭晓
                </li>
                <div class="line-middle"></div>
            </ul>
        </div>

        <div v-if="topNavIsSelect" id="NewOpenDiv" class="anced">
            <ul class="clearfix">
                <li @click="toDetail(newOpenItem.periodId,newOpenItem.isPk==1?1:0);" v-for="newOpenItem in newOpenList">
                    <img :src="newOpenItem.goodsIcon">
                    <p>{{newOpenItem.goodsName}}</p>
                    <span>期号：{{newOpenItem.periodId}}</span>
                    <i>幸运号码：</i>
                    <em>{{newOpenItem.luckyNumber}}</em>
                </li>
            </ul>
        </div>

        <div v-if="!topNavIsSelect" id="CountdownDiv" class="anced">
            <ul class="clearfix">
                <div v-if="!isHaveForthcoming" class="noRecord-div">
                    <div class="noRecord">
                        <p>没有揭晓记录！</p>
                        <img src="../../common/images/norecord.png" alt="">
                    </div>
                </div>

                <li v-if="isHaveForthcoming" @click="toDetail(forthcomingItem.periodId,forthcomingItem.isPk==1?1:0);" v-for="forthcomingItem in forthcomingList">
                    <img :src="forthcomingItem.goodsIcon">
                    <p>{{forthcomingItem.goodsName}}</p>
                    <span>期号：{{forthcomingItem.periodId}}</span>
                    <time-down :endTime='forthcomingItem.countdownTime'></time-down>
                </li>

            </ul>
        </div>

        <page-loading v-show="isLoading"></page-loading>

        <div class="tips" style="display: none;"></div>

        <!--<v-footer></v-footer>-->
    </div>
</template>

<script type="text/ecmascript-6">
    import footer from '../footer/footer.vue'
    import timeDown from '../time/timeDown.vue'
    import pageLoading from '../loading/pageLoading.vue'

    import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from '../../common/js/userAgent'
    import {isEmptyObject,alertmsg} from '../../common/js/common'
    import {initJsApi} from '../../common/js/appInfo'

    const ERR_OK = "0000";
    const dataLos = "数据获取失败，请稍候重试";

    export default{
        data(){
            return {
                topNavIsSelect: true,
                newOpenList: {},
                newOpenListUrl: '/yydb/ajax/loadNewOpen',
                newOpenPageIndex: 1,
                newOpenPageSize: 8,
                forthcomingList: {},
                forthcomingUrl: '/yydb/ajax/loadCountdown',
                forthcomingPageIndex: 1,
                forthcomingPageSize: 8,
                isHaveForthcoming: false,
                isLoading: false
            }
        },
        created(){
            initJsApi();

            var $body = $('body')
            document.title = '最新揭晓'
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="/favicon.ico" style="display: none;"></iframe>').on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove()
                }, 0)
            }).appendTo($body)

            let _this = this

            this.getNewOpenList()

            this.getForthcomingList()

            if (sessionStorage.indexNavItem==2){
                this.topNavIsSelect = true;
            }
            else if (sessionStorage.indexNavItem==3){
                this.topNavIsSelect = false;
            }

            this.$nextTick(() => {
                this.scrollLoad()
            });
        },
        methods: {
            scrollLoad(){
                let _this = this;
                $(window).scroll(function () {
                    var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                    var innerHeight = window.innerHeight;
                    if (scrollTop + innerHeight >= htmlHeight && innerHeight < htmlHeight && _this.topNavIsSelect && _this.newOpenList.length>=(_this.newOpenPageIndex*_this.newOpenPageSize)) {
                        //往期揭晓
                        _this.newOpenPageIndex++;
                        _this.getNewOpenList();
                    }
                    else if (scrollTop + innerHeight >= htmlHeight && innerHeight < htmlHeight && !_this.topNavIsSelect && _this.forthcomingList.length>=(_this.forthcomingPageIndex*_this.forthcomingPageSize)) {
                        //即将揭晓
                        _this.forthcomingPageIndex++;
                        _this.getForthcomingList();
                    }
                });
            },
            getNewOpenList(){
                this.isLoading = true;
                this.$http.get(this.HOST + this.newOpenListUrl + '?ac='+GetQueryString('ac')+'&pageIndex=' + this.newOpenPageIndex + '&pageSize=' + this.newOpenPageSize).then(response => {
                    response = response.data;
                    if (response.code === ERR_OK) {
                        if (isEmptyObject(this.newOpenList)) {
                            this.newOpenList = response.data;
                        }
                        else {
                            for (var i = 0; i < response.data.length; i++) {
                                this.newOpenList.push(response.data[i]);
                            }
                        }
                        this.isLoading = false;
                    }
                    else {
                        alertmsg(dataLos)
                        this.isLoading = false;
                    }
                }, response => {
                    console.log('los');
                    alertmsg(dataLos)
                    this.isLoading = false;
                });
            },
            getForthcomingList(){
                this.isLoading = true;
                this.$http.get(this.HOST + this.forthcomingUrl + '?ac='+GetQueryString('ac')+'&pageIndex=' + this.forthcomingPageIndex + '&pageSize=' + this.forthcomingPageSize).then(response => {
                    response = response.data;
                    if (response.code === ERR_OK) {
                        if (isEmptyObject(this.forthcomingList)) {
                            this.forthcomingList = response.data;
                            if (isEmptyObject(this.forthcomingList)){
                                this.isHaveForthcoming = false;
                            }
                            else {
                                this.isHaveForthcoming = true;
                            }
                        }
                        else {
                            for (var i = 0; i < response.data.length; i++) {
                                this.forthcomingList.push(response.data[i]);
                            }
                        }
                        this.isLoading = false;
                    }
                    else {
                        alertmsg(dataLos)
                        this.isLoading = false;
                    }
                }, response => {
                    console.log('los');
                    alertmsg(dataLos)
                    this.isLoading = false;
                });
            },
            toDetail(periodId, isPk){
                sessionStorage.setItem("isDetail", "1");
                let url = "/yydb/detail?ac="+GetQueryString('ac');
                if (isPk !== undefined && (isPk === 1 || isPk === "1")) {
                    url = "/yydb/pk/detail?ac="+GetQueryString('ac');
                }
                url += "&periodId=" + periodId;
                //console.log(url);
                window.location.href = url;
            },
            topNavChange(pk_type){
                if (pk_type !== '3') {
                    sessionStorage.setItem("indexNavItem", 3);

                    this.topNavIsSelect = false;
                    this.forthcomingList = null;
                    this.forthcomingPageIndex = 1;
                    this.getForthcomingList();
                }
                else if (pk_type !== '2') {
                    sessionStorage.setItem("indexNavItem", 2);

                    this.topNavIsSelect = true;
                    this.newOpenList = null;
                    this.newOpenPageIndex = 1;
                    this.getNewOpenList();
                }
            }
        },
        components: {
            'v-footer': footer,
            'time-down': timeDown,
            'page-loading': pageLoading
        }
    }
</script>

<style scoped>
    .new-top-nav {
        background: #fff;
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

    .new-top-nav ul {
        overflow: hidden;
    }

    .new-top-nav ul li {
        float: left;
        width: 50%;
        text-align: center;
        font-size: 1rem;
        padding: 1rem 0;
        color: #323232;
    }

    .topNavSelect {
        color: #fc5454 !important;
        border-bottom: 1px solid #fc5454;
        position: relative;
        font-weight: bold;
    }

    .topNavSelect:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 47%;
        border-bottom: 5px solid red;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
    }

    .line-middle {
        width: 1px;
        height: 2.5rem;
        margin: 0.5rem 0;
        background: #e1e1e1;
        position: absolute;
        top: 0;
        left: 50%;
    }

    .anced {
        width: 100%;
        padding-bottom: 17%;
        padding-top: 4rem;
    }

    .anced ul li {
        width: 43.8%;
        float: left;
        border-bottom: 1px solid #e9e9e9;
        padding: 0 3%;
        background: #fff;
        margin-top: 1px;
    }

    .anced ul li:nth-child(1) {
        margin-top: 0;
    }

    .anced ul li:nth-child(odd) {
        border-right: 1px solid #e9e9e9;
    }

    .anced ul li img {
        width: 100%;
    }

    .anced ul li p {
        color: #323232;
        font-size: 0.8rem;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 2.2rem;
        line-height: 1.1rem;
    }

    .anced ul li span {
        color: #676767;
        font-size: 0.75rem;
        display: block;
        padding: 0.5rem 0 0.2rem 0;
    }

    .anced ul li i {
        color: #fc5454;
        font-size: 0.75rem;
        display: block;
        font-style: normal;
    }

    .anced ul li em {
        color: #fc5454;
        font-size: 1.2rem;
        display: block;
        font-style: normal;
        padding: 0.2rem 0 0.6rem 0;
    }

    .noRecord-div {
        position: absolute;
        width: 100%;
        max-width: 720px;
        min-width: 300px;
    }

    .noRecord {
        width: 50%;
        max-width: 360px;
        min-width: 150px;
        position: absolute;
        top: 15%;
        margin-left: 25%;
        margin-top: 10%;
        padding-bottom: 15%;
    }

    .noRecord p {
        color: #676767;
        font-size: 1.1rem;
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        top: 12%;
        text-indent: 1em;
    }

    .noRecord img {
        width: 100%;
    }

    .anced ul li span:last-child {
        display: inline-block;
        background: url(../../common/images/icon_02.png) no-repeat;
        color: #f67909;
        background-size: 20%;
        width: 5rem;
        font-size: 0.9rem;
        text-align: right;
        line-height: 1rem;
        padding: 0;
        margin: 1rem 0;
    }
</style>