<template>
    <span>{{time}}</span>
</template>

<script>
    export default{
        data () {
            return {
                time: '',
                flag: false
            }

        },
        mounted () {
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
                let distancetime = (new Date(this.endTime).getTime() + 3 * 1000) - new Date().getTime();
                if (distancetime > 0) {
                    // 如果大于0.说明尚未到达截止时间
                    let ms = Math.floor(distancetime % 1000 / 10);
                    let sec = Math.floor(distancetime / 1000 % 60);
                    let min = Math.floor(distancetime / 1000 / 60 % 60);
                    let hour = Math.floor(distancetime / 1000 / 60 / 60 % 24);

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
                        this.time = min + ":" + sec + ":" + ms;
                    }
                    else {
                        this.time = hour + ":" + min + ":" + sec;
                    }
                } else {
                    this.flag = true;
                    // 若否，就是已经到截止时间了
                    this.time = "00:00:00"
                }
            }
        }
    }
</script>