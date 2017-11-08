<template>
    <div class="goodDetail">
        <div class="detail-wrapper">
            <img class="detail-proImg" :src="proInfo.goodsImages">
        </div>
        <div class="proInfo-wrapper">
            <div class="proInfo-title">
                <span class="proInfo-state" :class="stateJudge">{{stateTxt}}</span>
                <span>{{proInfo.goodsName}}</span>
            </div>
            <div class="proInfo-qh">
                <span>期号：{{proInfo.periodId}}</span>
            </div>
            <div class="proInfo-progress">
                <div class="proInfo-progress-bar" :style="{width:proInfo.progressRate+'%'}"></div>
            </div>
            <div class="proInfo-rc">
                <span>还差{{proInfo.remainCount}}人次揭晓</span>
                <span>总需{{proInfo.needCount}}人次</span>
            </div>
        </div>
        <div class="detail-participants-wrapper">
            <div v-if="isEmptyObject(participantsNum)" class="detail-participants-no">
                您还没有参与本次夺宝哦！
            </div>
            <div v-if="!isEmptyObject(participantsNum)" class="detail-participants">
                <span>您参与了：</span><span class="numColor">{{participantsNum.OrderItemCount}}</span><span>人次本期夺宝</span>
                <span>查看详情</span>
            </div>
        </div>

        <div class="detail-link-wrapper">
            <ul>
                <li class="detail-link-item" v-for="linkItem in linkList">
                    <a :href="linkItem.link">
                        {{linkItem.linkName}}
                        <span v-if="linkItem.isTip" class="detail-link-tip">{{linkItem.tip}}</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="detail-record-wrapper">
            <div class="detail-record-link">
                <a :href="'http://hd.zt.raiyi.com/yydb/toGoodsPartake?periodId='+proInfo.periodId">
                    参与记录
                    <span class="detail-link-tip">所有</span>
                </a>
            </div>
            <div class="detail-record-list">
                <ul class="detail-record-ul">
                    <li class="detail-record-li" v-for="recordItem in recordList.dtoList">
                        <div class="detail-record-header">
                            <img class="detail-record-header-img" :src="recordItem.userIcon">
                        </div>
                        <div class="detail-record-content">
                            <div class="detail-record-name">
                                <span class="name">{{recordItem.nickname}}</span>
                                <span>({{recordItem.belong}} IP:{{recordItem.userIp}})</span>
                            </div>
                            <div class="detail-record-fs">
                                <span>参与了</span><span class="numColor">{{recordItem.buyCount}}</span><span>次</span>
                            </div>
                            <div class="detail-record-time">
                                <span>{{recordItem.bookTime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="cord-line-div">
                    <div class="cord-line"></div>
                </div>
            </div>
        </div>

        <div class="detail-btn-wrapper">
            <div>
                <a id="start">立即夺宝</a>
            </div>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios'

    const ERR_OK = '0000';

    export default{
        data(){
            return {
                showDetail: true,
                proInfo: {},
                proId: '',
                stateTxt: '',
                participantsNum: {},
                recordList:{},
                linkList: [
                    {
                        link: '',
                        linkName: '图文详情',
                        isTip: true,
                        tip: '建议在WIFI下查看'
                    },
                    {
                        link: '',
                        linkName: '往期揭晓',
                        isTip: false
                    },
                    {
                        link: 'http://wap.zt.raiyi.com/activity/info?k=yydbrule',
                        linkName: '夺宝怎么玩？',
                        isTip: false
                    }
                ]
            }
        },
        computed: {
            stateJudge(){
                let stateClass = '';
                if (this.proInfo.status == 1) {
                    this.stateTxt = '进行中';
                    stateClass = 'state-jxz';
                }
                else if (this.proInfo.status == 2) {
                    this.stateTxt = '倒计时';
                    stateClass = 'state-djs';
                }
                else if (this.proInfo.status == 3) {
                    this.stateTxt = '已揭晓';
                    stateClass = 'state-yjx';
                }
                return stateClass;
            }
        },
        methods: {
            show(){
                console.log('gd show');
                this.showDetail = true;
            },
            isEmptyObject(e){
                var t;
                for (t in e)
                    return !1;
                return !0;
            }
        },
        created(){
            this.proId = this.$route.params.proId;
            //var getUrl = 'http://222.92.17.34:9192/fc-activity/yydb/ajax/period/detail?periodId='+this.proId;
            var getUrl = '/static/detail.json';
            axios.get(getUrl).then(response => {
                response = response.data;
                if (response.code === ERR_OK) {
                    this.proInfo = response.data;
                    this.linkList[0].link = this.proInfo.goodsDetail;
                    this.linkList[1].link = 'http://hd.zt.raiyi.com/yydb/toHist?goodsId=' + this.proInfo.goodsId;
                }
            }, response => {
                console.log('los');
            });

            axios.get('/static/cyfs.json').then(response => {
                response = response.data;
                if (response.code === ERR_OK) {
                    this.participantsNum = response.data;
                }
            }, response => {
                console.log('los');
            });

            axios.get('/static/cyjl.json').then(response => {
                response = response.data;
                if (response.code === ERR_OK) {
                    this.recordList = response.data;
                }
            }, response => {
                console.log('los');
            });
        }
    }
</script>

<style scoped>
    .detail-proImg {
        width: 100%;
    }

    .proInfo-wrapper {
        background-color: #fff;
        padding: 0 1rem 1rem;
    }

    .proInfo-title {
        color: #323232;
        font-size: 1rem;
        padding-bottom: 0.5rem;
    }

    .proInfo-state {
        color: #fff;
        font-size: 0.85rem;
        padding: 0.2rem;
        border-radius: 0.2rem;
        margin-right: 0.5rem;
    }

    .state-yjx {
        background: #bebebe;
    }

    .state-djs {
        background: #fc5454;
    }

    .state-jxz {
        background: #fc5454;
    }

    .proInfo-qh {
        color: #676767;
    }

    .proInfo-progress {
        width: 100%;
        height: 0.25rem;
        background: #bebebe;
        border-radius: 1rem;
        margin: 0.5rem 0 0.25rem;
        overflow: hidden;
    }

    .proInfo-progress-bar {
        border-radius: 1rem;
        background-color: #ff6c00;
        height: 100%;
    }

    .proInfo-rc {
        color: #454545;
        font-size: 0.75rem;
    }

    .proInfo-rc > span:last-child {
        float: right;
    }

    .detail-participants-wrapper {
        background-color: #fff;
        padding: 0 1rem 1rem;
    }

    .detail-participants-no {
        color: #676767;
        font-size: 1rem;
        background: #f2f2f2;
        border-radius: 0.2rem;
        padding: 0.6rem 3%;
        text-align: center;
        box-sizing: border-box;
    }

    .detail-participants {
        color: #676767;
        font-size: 1rem;
        background: #f2f2f2;
        border-radius: 0.2rem;
        padding: 0.6rem 3%;
        box-sizing: border-box;
    }

    .detail-participants span:last-child {
        float: right;
        color: #35b5ff;
    }

    .detail-link-wrapper {
        background: #fff;
        margin-top: 0.5rem;
    }

    .detail-link-item {
        font-size: 1rem;
        font-weight: bold;
        border-bottom: 1px solid #e9e9e9;
        text-indent: 3%;
        background: url(../../common/images/arrow.png) 96% center no-repeat;
        background-size: 3%;
    }

    .detail-link-item a {
        color: #323232;
        display: block;
        padding: 0.8rem 0;
    }

    .detail-link-tip {
        color: #6b6b6b;
        font-size: 0.8rem;
        font-weight: normal;
        float: right;
        padding-right: 10%;
        line-height: 1.8;
    }

    .detail-record-wrapper{
        margin-top: 0.5rem;
        background: #fff;
        padding-bottom: 3rem;
    }

    .detail-record-link{
        font-size: 1rem;
        font-weight: bold;
        border-bottom: 1px solid #e9e9e9;
        text-indent: 3%;
        background: url(../../common/images/arrow.png) 96% center no-repeat;
        background-size: 3%;
        border-bottom: 1px solid #e9e9e9;
    }

    .detail-record-link a{
        color: #323232;
        display: block;
        padding: 0.8rem 0;
    }

    .detail-record-list{
        position: relative;
    }

    .detail-record-ul{
        margin-top: -1.2rem;
        padding-left: 3%;
        position: relative;
        z-index: 2;
    }

    .detail-record-li{
        margin-top: 1.5rem;
        color: #7c7c7c;
    }

    .detail-record-header{
        display: inline-block;
    }

    .detail-record-header-img{
        width: 3rem;
        height: 3rem;
        border-radius: 9999px;
    }

    .detail-record-content{
        display: inline-block;
        margin-left: 0.3rem;
    }

    .detail-record-content>div{
        line-height: 1.2rem;
    }

    .detail-record-name .name{
        color: #35b5ff;
        font-size: 1rem;
        margin-right: 0.25rem;
    }

    .cord-line{
        position: absolute;
        top: 0.5rem;
        left: 2.2rem;
        width: 1px;
        height: 100%;
        background: #c8c8c8;
        z-index: 1;
    }

    .detail-btn-wrapper{
        width: 100%;
        max-width: 720px;
        min-width: 300px;
        background: #fff;
        position: fixed;
        bottom: 0;
        z-index: 6;
        padding-bottom: 0;
    }

    #start{
        color: #fff;
        background: #fc5454;
        font-size: 1.2rem;
        border-radius: 0;
        width: 100%;
        display: inline-block;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
    }
</style>