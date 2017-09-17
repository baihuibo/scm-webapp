String.prototype.findRequestParameter = function(key) {
	var re = new RegExp(key + '=([^&]*)(?:&)?');
	return this.match(re) && this.match(re)[1];
};
function findRelativePath() {
	var pathName = window.location.pathname.substring(1);
	var webName = pathName == '' ? '' : pathName.substring(0, pathName
			.indexOf('/'));
	if (webName == "") {
		return "";
	} else {
		return '/' + webName;
	}
}
function findRootPath() {
	var pathName = window.location.pathname.substring(1);
	var webName = pathName == '' ? '' : pathName.substring(0, pathName
			.indexOf('/'));
	if (webName == "") {
		return  window.location.host ;
	} else {
		return  window.location.host
				+ '/' + webName;
	}
}