function loadFlex() {

	var flaxPath = "huxing";
	var url = window.document.location.href;
	var housesId = url.findRequestParameter("HousesId");
	var sectionId = url.findRequestParameter("SectionId");
	var userId = url.findRequestParameter("UserId");
	var compId = url.findRequestParameter("CompId");
	var fileName = url.findRequestParameter("FileName");
	var host = findRootPath();
	var flasVars = "HousesId=" + housesId + "&SectionId=" + sectionId
			+ "&UserId=" + userId + "&CompId=" + compId + "&FileName="
			+ fileName + "&hostname=" + host;

	// flasVars="HousesId=36244694&SectionId=338997&UserId=166060&CompId=1&FileName=a8ea7bb50e0fdd12a291ef07290ae973&hostname=local.cbs.bacic5i5j.com:8080/sales/resources";
	AC_FL_RunContent(
			'codebase',
			'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0',
			'width', '930', 'height', '670', 'src', flaxPath, 'quality',
			'high', 'pluginspage', 'http://www.adobe.com/go/getflashplayer_cn',
			'align', 'middle', 'play', 'true', 'loop', 'true', 'scale',
			'showall', 'devicefont', 'false', 'id', 'huxing', 'bgcolor',
			'#0f3193', 'name', 'huxing', 'menu', 'true', 'allowFullScreen',
			'false', 'allowScriptAccess', 'sameDomain', 'movie', flaxPath,
			'salign', '', 'FlashVars', flasVars, 'wmode', 'direct'); // end
																		// AC
																		// code
	// 'wmode', 'window',
}