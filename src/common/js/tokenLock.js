// 防止触发事件并发请求
window.checkIsTokenLocked = function() {
	var _tokenLock = document.getElementById('_tokenLock');
	if (_tokenLock.value == "locked") {
		return true;
	} else {
		_tokenLock.value = "locked";
		return false;
	}
}

window.releaseTokenLock = function() {
	var _tokenLock = document.getElementById('_tokenLock');
	_tokenLock.value = "";
}

$(document).ready(function() {
	// 添加隐藏的锁
	var myElement = document.createElement("input");
	myElement.type = "hidden";
	myElement.id = "_tokenLock";
	myElement.value = "";
	document.body.appendChild(myElement);
});