<template>
    <div v-html="time">
    </div>
</template>

<script>
    export default{
        data () {
            return {
                time: '',
                flag: false
            }
        },
        created () {
            let time = setInterval(() => {
                if (this.flag === true) {
                    clearInterval(time)
                }
                this.timeDown()
            }, 1)
        },
        props: ['endTime'],
        methods: {
            timeDown () {
                let distancetime = new Date(this.endTime).getTime() - new Date().getTime();
                if (distancetime > 0) {
                    // 如果大于0.说明尚未到达截止时间
                    let ms = (Math.floor(distancetime % 1000 / 10)).toString();
                    let sec = (Math.floor(distancetime / 1000 % 60)).toString();
                    let min = (Math.floor(distancetime / 1000 / 60 % 60)).toString();
                    let hour = (Math.floor(distancetime / 1000 / 60 / 60 % 24)).toString();

                    if (ms < 10) {
                        ms = "0" + ms;
                    }
                    if (sec < 10) {
                        sec = "0" + sec;
                    }
                    if (min < 10) {
                        min = "0" + min;
                    }
                    if (hour < 10) {
                        hour = "0" + hour;
                    }
                    if (hour <= 0) {
                        //this.time = min + ":" + sec + ":" + ms;
                        this.time = '<span class="index-timedown-time">'+min.split('')[0]+'</span><span class="index-timedown-time">'+min.split('')[1]+'</span><span class="index-timedown-colon">:</span><span class="index-timedown-time">'+sec.split('')[0]+'</span><span class="index-timedown-time">'+sec.split('')[1]+'</span><span class="index-timedown-colon">:</span><span class="index-timedown-time">'+ms.split('')[0]+'</span><span class="index-timedown-time">'+ms.split('')[1]+'</span>'
                    }
                    else {
                        //this.time = hour + ":" + min + ":" + sec;
                        this.time = '<span class="index-timedown-time">'+hour.split('')[0]+'</span><span class="index-timedown-time">'+hour.split('')[1]+'</span><span class="index-timedown-colon">:</span><span class="index-timedown-time">'+min.split('')[0]+'</span><span class="index-timedown-time">'+min.split('')[1]+'</span><span class="index-timedown-colon">:</span><span class="index-timedown-time">'+sec.split('')[0]+'</span><span class="index-timedown-time">'+sec.split('')[1]+'</span>'
                    }
                } else {
                    this.flag = true;
                    this.$emit('time-done');
                    this.time = '<span class="index-timedown-time">0</span><span class="index-timedown-time">0</span><span class="index-timedown-colon">:</span><span class="index-timedown-time">0</span><span class="index-timedown-time">0</span><span class="index-timedown-colon">:</span><span class="index-timedown-time">0</span><span class="index-timedown-time">0</span>'
                }
            }
        }
    }
</script>

<style>
    .index-timedown-time{
        font-size: 1.1rem;
        color: #fff;
        display: inline-block;
        background: #fc5454;
        margin: 0 0.1rem;
        width: 1rem;
        text-align: center;
        line-height: 1;
        padding: 0.28rem 0 0.25rem;
        border-radius: 0.2rem;
    }

    .index-timedown-colon{
        font-size: 1.5rem;
        color: #000;
        font-weight: bold;
        line-height: 0.6;
    }
</style>