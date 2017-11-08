window.setUserCookie = function(name, value) {
	document.cookie = name + "=" + escape(value) + ";path=/";
}

window.getUserCookie = function(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

window.delUserCookie = function(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getUserCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
}