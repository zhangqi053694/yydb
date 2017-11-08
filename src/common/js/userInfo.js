import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from './userAgent'
import {cookie, setCookie, getCookie, delCookie} from './cookie'
import {common, alertmsg} from './common'
import {userCookie} from './userCookie'

let _uuid = sessionStorage._uuid;
let _ooid = sessionStorage._ooid;
let _bbid = sessionStorage._bbid;
$(function () {
    // 判断是否客户端或微信
    if (!isUserAgentIsFL && !isUserAgentIsWX) {
        if (_uuid === undefined || _uuid === "" || _uuid === "[object HTMLInputElement]") {
            getBrowserUserInfo();
        }
    }
    // 流量掌厅客户端用户
    if (isUserAgentIsFL) {
        if (_uuid === undefined || _uuid === "" || _uuid === "[object HTMLInputElement]") {
            getAppUserInfo();
        }
    }
    // 微信用户
    if (isUserAgentIsWX) {
        if (_uuid === undefined || _uuid === "" || _uuid === "[object HTMLInputElement]") {
            getWxUserInfo();
        }
    }
});

let callBack;
var callBack_userInfo;
var needLoginFlag = false; // 是否需要登陆

window.getCurrentUserInfo = function(obj, flag) {
    if (obj != undefined) {
        callBack_userInfo = obj;
    }
    if (flag != undefined) {
        needLoginFlag = flag;
    }

    if (!isUserAgentIsFL && !isUserAgentIsWX) {
        // 马甲版也当做普通浏览器处理
        var bbid = sessionStorage._bbid;
        if (bbid == undefined || bbid == "" || bbid == "[object HTMLInputElement]") {
            getBrowserUserInfo(obj);
            return;
        }
    }

    if (isUserAgentIsWX) {
        // 微信用户信息
        var ooid = sessionStorage._ooid;
        if (ooid == undefined || ooid == "" || ooid == "[object HTMLInputElement]") {
            getWxUserInfo(obj);
            return;
        }
    }

    if (isUserAgentIsFL) {
        // 客户端用户信息
        var uuid = sessionStorage._uuid;
        if (uuid == undefined || uuid == "" || uuid == "[object HTMLInputElement]") {
            getAppUserInfo(obj);
            return;
        }
    }

    if (callBack_userInfo != undefined && obj != undefined) {
        callBack_userInfo();
    }
}

// 获取本地浏览器用户信息
window.getBrowserUserInfo = function(obj) {
    if (obj != undefined) {
        callBack_userInfo = obj;
    }

    var local_bbid = localStorage._bbid;
    if (local_bbid != undefined && local_bbid != "" && local_bbid != null && local_bbid !== "[object HTMLInputElement]") {
        // 本地已生成唯一标示，放入cookie，获取相关绑定用户信息
        setUserCookie('USER_BBID', local_bbid);
    }

    $.ajax({
        url : "/common/browserUserInfo?ac="+GetQueryString('ac'),
        dataType : "json",
        success : function(result) {
            if (result && result.success) {
                var _bbid = result.data.bbid;
                var _uuid = result.data.uuid;
                sessionStorage.setItem("_bbid", _bbid);
                sessionStorage.setItem("_uuid", _uuid); // 有uuid说明绑定号码了

                setUserCookie("USER_UUID", _uuid);

                if (callBack_userInfo != undefined && obj != undefined) {
                    callBack_userInfo();
                }
            } else if (result.code == "3003") {
                var _bbid = result.data.bbid;
                sessionStorage.setItem("_bbid", _bbid);
                localStorage.setItem("_bbid", _bbid); // 未绑定号码

                if (callBack_userInfo != undefined && obj != undefined) {
                    callBack_userInfo();
                }
            } else {
                alertmsg("未获取到用户信息，请尝试刷新此页面");
            }
        },
        error : function() {
            alertmsg("操作失败，请尝试刷新页面");
        }
    });
}

// 获取微信用户信息
window.getWxUserInfo = function(obj) {
    if (obj != undefined) {
        callBack_userInfo = obj;
    }

    $.ajax({
        url : "/common/wxUserInfo?ac="+GetQueryString('ac'),
        dataType : "json",
        success : function(result) {
            if (result && result.success) {
                var _ooid = result.data.ooid;
                var _uuid = result.data.uuid;
                sessionStorage.setItem("_ooid", _ooid);
                sessionStorage.setItem("_uuid", _uuid);

                setUserCookie("USER_UUID", _uuid);

                if (callBack_userInfo != undefined && obj != undefined) {
                    callBack_userInfo();
                }
            } else if (result.code == "3003") {
                var _ooid = result.data.ooid;
                sessionStorage.removeItem("_uuid");
                sessionStorage.setItem("_ooid", _ooid);

                if (callBack_userInfo != undefined && obj != undefined) {
                    callBack_userInfo();
                }
            } else {
                alertmsg("未获取到用户信息，请尝试刷新本页面");
            }
        },
        error : function() {
            alertmsg("操作失败，请尝试刷新页面");
        }
    });
}

let userAgent_userInfo = navigator.userAgent;
// 获取客户端用户信息
window.getAppUserInfo = function(obj) {
    if (obj != undefined) {
        callBack_userInfo = obj;
    }

    if (window.FLJsBridge) {
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("datamall") > 0) {
            // 坑爹的ios，getUserInfo有问题，先用getUserMobileNo
            var result = window.FLJsBridge.getUserMobileNo();
            var loginstatus = eval('(' + result + ')').loginstatus;
            if (loginstatus == 0 || loginstatus == "0") {
                delUserCookie("USER_UUID"); // 未登陆时，删除cookie

                if (needLoginFlag) {
                    window.FLJsBridge.getAuthcode('authCodeCallBack');
                }
            } else {
                // 掌厅已登陆
                window.FLJsBridge.getAuthcode('authCodeCallBack');
            }
        } else {
            window.FLJsBridge.getUserInfo('userInfoCallBack');
        }
    } else {
        document.addEventListener('FLJsBridge', function(event) {
            var userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("datamall") > 0) {
                // 坑爹的ios，getUserInfo有问题，先用getUserMobileNo
                var result = window.FLJsBridge.getUserMobileNo();
                var loginstatus = eval('(' + result + ')').loginstatus;
                if (loginstatus == 0 || loginstatus == "0") {
                    delUserCookie("USER_UUID"); // 未登陆时，删除cookie

                    if (needLoginFlag) {
                        window.FLJsBridge.getAuthcode('authCodeCallBack');
                    }
                } else {
                    // 掌厅已登陆
                    window.FLJsBridge.getAuthcode('authCodeCallBack');
                }
            } else {
                window.FLJsBridge.getUserInfo('userInfoCallBack');
            }
        }, false);
    }
}

window.userInfoCallBack = function(result) {
    var status = eval('(' + result + ')').status;
    if (status == 0 || status == "0") {
        delUserCookie("USER_UUID"); // 未登陆时，删除cookie

        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("lib_116114") > 0 && userAgent.indexOf("fc_116114") > 0) {
            // 在116114中的掌厅处理，掌厅未登陆，116114如果登陆则跳绑定页，未登陆则跳116114登陆页
            if (needLoginFlag) {
                window.FLJsBridge.register('registerCallBack');
            }
        } else {
            if (needLoginFlag) {
                window.FLJsBridge.getAuthcode('authCodeCallBack'); // 检查是否登陆，根据参数进行是否引导登陆
            }
        }
    } else {
        // 掌厅已登陆
        window.FLJsBridge.getAuthcode('authCodeCallBack'); // 检查是否登陆，根据参数进行是否引导登陆
    }
};

window.registerCallBack = function(result) {
};

window.authCodeCallBack = function(result) {
    var authCode = eval('(' + result + ')').authcode;
    if (authCode) {
        $.ajax({
            url : "/common/appUserInfo?ac="+GetQueryString('ac')+"&authCode=" + authCode,
            dataType : "json",
            success : function(result) {
                if (result && result.success) {
                    var _uuid = result.data.uuid;
                    sessionStorage.setItem("_uuid", _uuid);

                    setUserCookie("USER_UUID", _uuid);

                    if (callBack_userInfo != undefined) {
                        callBack_userInfo();
                    }
                } else {
                    alertmsg("未获取到用户信息，请尝试刷新页面");
                }
            },
            error : function() {
                alertmsg("操作失败，请尝试刷新页面");
            }
        });
    }
};


window.getUrlSource = function () {
    if(isUserAgentIsFL){
        return "fl";
    }else if(isUserAgentIsWX){
        return "wx";
    }else{
        return "ot";
    }
};

window.GetQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null)
        return unescape(r[2]);
    return 'unknown';
}

var _acVal = GetQueryString("ac");
window._ac = _acVal!==null?_acVal:'unknown';
if(_acVal !== null && _acVal.toString().length > 1) {
    sessionStorage.setItem("_yydb_access_channel", _acVal);
}

