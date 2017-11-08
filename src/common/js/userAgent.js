const userAgent = navigator.userAgent.toLowerCase();
export let isUserAgentIsFL = false;
export let isUserAgentIsWX = false;
export let isUserAgentIsZT = false;
export let urlHost = 'http://hd.zt.raiyi.com';

// 流量掌厅
if (userAgent.indexOf("datamall") > 0 || userAgent.indexOf("flowcircle") > 0 || userAgent.indexOf("fl") > 0  || userAgent.indexOf("dm_") > 0) {
    isUserAgentIsFL = true;
}

// 微信
if (userAgent.indexOf("micromessenger") > 0 || userAgent.indexOf("tencenttraveler") > 0) {
    isUserAgentIsWX = true;
}

// 一元夺宝马甲
if (userAgent.indexOf("zt_yydb_1") > 0 || userAgent.indexOf("zt_yydb_a") > 0 || userAgent.indexOf("zt_yydb_i") > 0) {
    isUserAgentIsZT = true;
}