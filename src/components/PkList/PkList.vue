<template>
    <div class="wrapper">
        <div class="top-nav-div">
            <ul style="position: relative;">
                <li :class="{topNavSelect:topNavIsSelect}" @click="topNavChange('0')">
                    发起PK
                </li>
                <li :class="{topNavSelect:!topNavIsSelect}" @click="topNavChange('1')">
                    快速参与
                </li>
                <div class="line-middle"></div>
            </ul>
        </div>

        <div style="padding-top: 3rem;">
            <img class="mar" src="../../common/images/icon_03.png">
            <swiper id="Marquee" :options="swiperOption">
                <swiper-slide class="index-lucky-item" v-for="luckyItem in luckyList" :key="luckyItem.periodId">
                    <span>恭喜</span><span class="index-lucky-item-name">{{luckyItem.luckyUserNickname}}</span><span>用户{{luckyItem.lastTime}}前夺得{{luckyItem.goodsName}}</span>
                </swiper-slide>
            </swiper>
        </div>

        <div id="PkGoodsDiv" class="proList">
            <h3>PK商品</h3>
            <ul v-if="topNavIsSelect" class="clearfix">
                <li v-for="goodsItem in goodsList">
                    <div class="imgPro" @click="toStartPk(goodsItem.goodsId);"><img :src="goodsItem.goodsIcon"></div>
                    <div class="detailPro">
                        <h4>{{goodsItem.goodsName}}</h4>
                        <div class="pk-list-btn-div clearfix">
                            <div class="pk-list-btn s-left" @click="toStartPk(goodsItem.goodsId);">
                                发起PK
                            </div>
                            <div class="pk-list-btn pk-list-join-btn s-right" @click="toJoinPk(goodsItem.goodsId);">
                                立即参与
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <ul v-if="!topNavIsSelect" class="pk-join-list clearfix">

                <div v-if="!isHavePkJoinList" class="noRecord-div">
                    <div class="noRecord">
                        <p>没有PK记录！</p>
                        <img src="../../common/images/norecord.png">
                    </div>
                </div>

                <li v-if="isHavePkJoinList" v-for="pkJoinItem in pkJoinList">
                    <a @click="toDetail(pkJoinItem.periodId);">
                        <div class="imgPro"><img :src="pkJoinItem.goodsIcon"></div>
                        <div class="detailPro">
                            <h4>{{pkJoinItem.goodsName}}</h4>
                            <p>期号：{{pkJoinItem.periodId}}</p>
                            <div class="progress">
                                <div id="Bar" class="progressBar"></div>
                                <div class="span">正在等待PK</div>
                            </div>
                            <div class="detailProBtn" @click="toDetail(pkJoinItem.periodId);">立即PK</div>
                        </div>
                    </a>
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
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
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
                luckyList: {},
                luckyListUrl: '/yydb/ajax/luckyList',
                swiperOption: {
                    autoplay: 3000,
                    direction: 'vertical',
                    autoplayDisableOnInteraction: false,
                    loop: true
                },
                goodsList: {},
                goodsListUrl: '/yydb/ajax/loadPkGoods',
                pkJoinList: {},
                pkJoinListUrl: '/yydb/ajax/loadPkPeriod',
                pkJoinPageIndex: 1,
                pkJoinPageSize: 8,
                isLoading: false,
                isHavePkJoinList: false
            }
        },
        created(){
            initJsApi();

            var $body = $('body')
            document.title = 'PK众筹'
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="/favicon.ico" style="display: none;"></iframe>').on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove()
                }, 0)
            }).appendTo($body)

            let _this = this;

            this.isLoading = true;
            this.$http.get(urlHost + this.luckyListUrl + '?ac=' + GetQueryString('ac')).then(response => {
                response = response.data;
                if (response.code === ERR_OK) {
                    this.luckyList = response.data;
                }
                else {
                    alertmsg(dataLos);
                }
            }, response => {
                alertmsg(dataLos);
                console.log('los');
            });

            this.getPkList();

            this.getPkJoinList();

            if (sessionStorage.indexPkNavItem==0){
                this.topNavIsSelect = true;
            }
            else if (sessionStorage.indexPkNavItem==1){
                this.topNavIsSelect = false;
            }

            this.$nextTick(() => {
                this.scrollLoad();
            });
        },
        methods: {
            getPkList(){
                this.$http.get(this.HOST + this.goodsListUrl + '?ac='+GetQueryString('ac')).then(response => {
                    response = response.data;
                    if (response.code === ERR_OK) {
                        this.goodsList = response.data;
                    }
                    else {
                        alertmsg(dataLos);
                    }
                    this.isLoading = false;
                }, response => {
                    this.isLoading = false;
                    alertmsg(dataLos);
                    console.log('los');
                });
            },
            getPkJoinList(){
                this.$http.get(this.HOST + this.pkJoinListUrl+'?ac='+GetQueryString('ac')+'&pageIndex='+this.pkJoinPageIndex+'&pageSize='+this.pkJoinPageSize).then(response => {
                    response = response.data;
                    if (response.code === ERR_OK) {
                        this.pkJoinList = response.data;

                        if (isEmptyObject(this.pkJoinList)){
                            this.isHavePkJoinList = false
                        }
                        else {
                            this.isHavePkJoinList = true
                        }
                    }
                    else {
                        alertmsg(dataLos);
                    }
                }, response => {
                    alertmsg(dataLos);
                    console.log('los');
                });
            },
            toStartPk(goodsId){
                let url = "/yydb/pk/toStartPk?ac="+GetQueryString('ac');
                url += "&goodsId=" + goodsId;
                //console.log(url);
                window.location.href = url;
            },
            toJoinPk(goodsId){
                let url = "/yydb/pk/toJoinPk?ac="+GetQueryString('ac');
                url += "&goodsId=" + goodsId;
                //console.log(url);
                window.location.href = url;
            },
            toDetail(periodId){
                let url = "/yydb/pk/detail?ac="+GetQueryString('ac');
                url += "&periodId=" + periodId;
                //console.log(url);
                window.location.href = url;
            },
            topNavChange(pk_type){
                if (pk_type !== '0') {
                    sessionStorage.setItem("indexPkNavItem", 1);

                    this.topNavIsSelect = false;
                    this.getPkJoinList()
                }
                else if (pk_type !== '1') {
                    sessionStorage.setItem("indexPkNavItem", 0);

                    this.topNavIsSelect = true;
                    this.getPkList()
                }
            },
            scrollLoad(){
                let _this = this;
                $(window).scroll(function() {
                    var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                    var innerHeight = window.innerHeight;
                    if (scrollTop + innerHeight >= htmlHeight  && innerHeight < htmlHeight && !_this.topNavIsSelect && _this.pkJoinList.length>=(_this.pkJoinPageIndex*_this.pkJoinPageSize)) {
                        _this.pkJoinPageIndex++;
                        _this.isLoading = true;
                        _this.$http.get(_this.HOST + this.pkJoinListUrl+'?ac='+GetQueryString('ac')+'&pageIndex='+_this.pkJoinPageIndex+'&pageSize='+_this.pkJoinPageSize).then(response => {
                            response = response.data;
                            if (response.code === ERR_OK) {
                                for (var i=0;i<response.data.length;i++){
                                    _this.pkJoinList.push(response.data[i]);
                                }
                                _this.isLoading = false;
                            }
                        }, response => {
                            console.log('los');
                            _this.isLoading = false;
                        });
                    }
                });
            }
        },
        components: {
            'v-footer': footer,
            swiper,
            swiperSlide,
            'page-loading': pageLoading
        }
    }
</script>

<style scoped>
    .wrapper {
        padding-bottom: 15%;
    }

    .top-nav-div {
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

    .top-nav-div ul {
        overflow: hidden;
    }

    .top-nav-div ul li {
        float: left;
        width: 46%;
        text-align: center;
        margin: 0 2%;
        font-size: 1rem;
        line-height: 3rem;
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
        height: 2rem;
        margin: 0.5rem 0;
        background: #e1e1e1;
        position: absolute;
        top: 0;
        left: 50%;
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

    .proList {
        margin-top: 0;
        border-radius: 0.2rem;
    }

    .proList h3 {
        line-height: 1;
        padding: 0.5rem 0 0.5rem 0.5rem;
        border-bottom: 1px solid #e9e9e9;
        background: #fff;
        position: relative;
    }

    .proList ul li {
        padding: 0 0.5rem 1rem;
        box-sizing: border-box;
        background: #fff;
        width: 50%;
        float: left;
        margin-bottom: 2px;
        border-right: 1px solid #e9e9e9;
    }

    .proList ul li .imgPro {
        width: 100%;
    }

    .proList ul li .imgPro img {
        width: 100%;
    }

    .proList ul li .detailPro {
        width: 100%;
        position: relative;
    }

    .proList ul li .detailPro h4 {
        font-size: 1rem;
        color: #000;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 2.85rem;
        font-weight: normal;
        line-height: 1.5rem;
    }

    .pk-list-btn-div {
        width: 90%;
        margin: 0.6rem auto 0;
    }

    .pk-list-btn {
        width: 4rem;
        text-align: center;
        line-height: 1.8rem;
        background: #fc5454;
        color: #fff;
        border: 1px solid #fc5454;
        border-radius: 3px;
    }

    .pk-list-join-btn {
        color: #35b5ff;
        border: 1px solid #35b5ff;
        background: #fff;
    }

    .detailPro p {
        color: #676767;
        font-size: 0.7rem;
        margin: 0.4rem 0;
    }

    .progress {
        width: 56%;
        margin-top: 1rem;
        background: #bebebe;
        border-radius: 1rem;
        position: relative;
    }

    .progress .progressBar {
        position: relative;
        height: 6px;
        border-radius: 1rem;
        background-color: #ff6c00;
        width: 50%;
    }

    .progress .span {
        position: absolute;
        width: 100%;
        color: #808080;
        font-size: 0.8rem;
        top: 0.5rem;
    }

    .proList ul li .detailPro .detailProBtn {
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
        position: absolute;
        bottom: -1rem;
        right: 0;
        background: #fc5454;
        color: #fff;
        border-radius: 3px;
    }

    .proList ul.pk-join-list li {
        padding-bottom: 2rem;
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
</style>