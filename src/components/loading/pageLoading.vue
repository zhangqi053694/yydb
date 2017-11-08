<template>
    <div class="loading">
        <div id="masker-pageLoading"></div>
        <div class="newLoad" id="wiating">
            <div class="loader">
                <div class="loading-3"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            </div>
            <div id="loadingTxt">加载中...</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{}
</script>

<style scoped>
    /*遮罩层*/
    #masker-pageLoading{
        position: fixed;
        width: 100%;
        max-width: 720px;
        min-width: 300px;
        height: 100%;
        background: rgba(0,0,0,0.4);
        top: 0;
        z-index: 998;
        padding-bottom: 1.5rem;
    }

    #loadingTxt{
        padding-top: 43%;
        text-align: center;
        color: #fff;
    }

    /*loading*/
    .newLoad {
        position: fixed;
        top: 50%;
        left: 50%;
        margin-left: -3rem;
        margin-top: -3rem;
        width: 6rem;
        height: 6rem;
        border-radius: 8px;
        background: rgba(0, 0, 0, .5);
        z-index: 999;
    }

    .loader {
        padding: 1rem 0 0 1rem;
        position: relative;
        margin-left: 30%;
        margin-top: 0.3rem;
    }


    /*加载效果*/

    @-webkit-keyframes loading-3 {
        50% {
            transform: scale(0.6);
            -webkit-transform: scale(0.6);
            opacity: 0.3;
        }
        100% {
            transform: scale(1);
            -webkit-transform: scale(1);
            opacity: 1;
        }
    }

    .loading-3 {
        position: relative;
    }

    .loading-3 i {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
    }

    .loading-3 i:nth-child(1) {
        top: 25px;
        left: 2px;
        -webkit-animation: loading-3 1s ease 0s infinite;
    }

    .loading-3 i:nth-child(2) {
        top: 21px;
        left: 11px;
        -webkit-animation: loading-3 1s ease -0.1s infinite;
    }

    .loading-3 i:nth-child(3) {
        top: 12px;
        left: 14px;
        -webkit-animation: loading-3 1s ease -0.2s infinite;
    }

    .loading-3 i:nth-child(4) {
        top: 2px;
        left: 11px;
        -webkit-animation: loading-3 1s ease -0.3s infinite;
    }

    .loading-3 i:nth-child(5) {
        top: -3px;
        left: -2px;
        -webkit-animation: loading-3 1s ease -0.4s infinite;
    }

    .loading-3 i:nth-child(6) {
        top: 2px;
        left: -11px;
        -webkit-animation: loading-3 1s ease -0.5s infinite;
    }

    .loading-3 i:nth-child(7) {
        top: 12px;
        left: -14px;
        -webkit-animation: loading-3 1s ease -0.6s infinite;
    }

    .loading-3 i:nth-child(8) {
        top: 21px;
        left: -9px;
        -webkit-animation: loading-3 1s ease -0.7s infinite;
    }
</style>