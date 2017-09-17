window.houseDesign = window.houseDesign || {};
houseDesign.flashplayerVersion = "11.2.0";
houseDesign.defaultSWF = "HouseDesign.1.0.swf";
houseDesign._top = 0;
houseDesign._height = "100%";
houseDesign._beforeunloadInterval = 0;
houseDesign._renderSizeOptions=new Array();

houseDesign.name = "";
houseDesign.openNO = "";
houseDesign.saveNO = "";
houseDesign.data = "";
houseDesign.pictureData = "";

function thisMovie(movieName) {//这个是通用的查找Flash的函数。IE下是object，而FF下是document
   var isIE = navigator.appName.indexOf("Microsoft") != -1;
   return (isIE) ? window[movieName] : document[movieName];
}

/*
houseDesign.openHouseDegin = function(houseNO)
{
	thisMovie("HouseDesign").OpenHouseDegin(houseNO);
}

houseDesign.saveSuccess = function(name,openNO,saveNO,data,pictureData) {
	houseDesign.name = name;
	houseDesign.openNO = openNO;
	houseDesign.saveNO = saveNO;
	houseDesign.data = data;
	houseDesign.pictureData = pictureData;
};*/

houseDesign._structItems = {door:"481b6990484211e4a84200163e0206cd",doubleDoor: "9e4f4cc2a73b11e2b690782bcb748630",slidingDoor: "b59078daa7cb11e287cc782bcb748630",window: "d2307b04e1aa11e5809e00163e0018da",frenchWindow: "4a625c8c362c11e38caa00163e000ee8",bayWindow: "38213098616b11e28b89782bcb748630",floorBoard: "4f921108d13911e4879a00163e021ee1",floorTile: "8066fd448e5c11e5b86d00163e0018da",floorSkirting: "6d70132ef89811e4849a00163e021ee1",wallMaterial: "b24209ded48411e19421782bcb748630",ceilingMaterial: "b16ee7fcb62511e1ac95782bcb748630"};

houseDesign.params = {quality: "high",bgcolor: "#ffffff",allowscriptaccess: "always",allowFullScreenInteractive: "true",wmode: "direct"};

houseDesign.attrs = {id: "HouseDesign",	name: "HouseDesign",align: "middle"};

houseDesign.flashVars={openCommand: "",language: "zh_CN",localeChain: "zh_CN",preloaderSWFUrl: "preloader.swf"};

houseDesign.setLaunchVars = houseDesign.setFlashVars = function(k, v) {
	houseDesign.flashVars[k] = v;
	if (k == "language") {
		houseDesign.flashVars.localeChain = v;
	}
};

//设置flash object起始的top值
houseDesign.setTop = function(top) {
	houseDesign._top = top;
	houseDesign._height = document.documentElement.clientHeight - houseDesign._top;
};

//设置多少毫秒后监听window.onbeforeunload事件，提示用户关闭时保存设计, 小于0时不设置
houseDesign.setBeforeunloadInterval = function(interval) {
	houseDesign._beforeunloadInterval = interval;
};

/**
* 添加效果图渲染尺寸选项， width，height均为0时表示可自定义
* width - 效果图宽度
* height - 效果图高度
* name - 选项别名
**/
houseDesign.addRenderSizeOption = function(width, height, name) {
	if (!arguments[2]) name="";
	houseDesign._renderSizeOptions.push({width: width, 
									height: height, 
									name: name});
};

/**
* 设置各种基本构造的默认物品编号
* structType - 基本构造类型
* itemNo - 物品编号
**/
houseDesign.setStructItem = function(structType, itemNo) {
	houseDesign._structItems[structType] = itemNo;
};

//嵌入SWF
houseDesign.embedSWF = function(swf, container) {

	houseDesign.container = container;
    if (document.getElementById(houseDesign.container)) {
		document.getElementById(houseDesign.container).innerHTML = '<p><a href="http://www.adobe.com/go/getflashplayer"><img alt="Get Adobe Flash player" src="http://wwwimages.adobe.com/www.adobe.com/images/shared/download_buttons/get_flash_player.gif"></a></p>';
	}
	
	var xiSwfUrlStr = "playerProductInstall.swf";
    // 此处使用replace将json字符串中的双引号，替换为单引号，是为了兼容ie浏览器给flash传参
    houseDesign.flashVars['renderSizeOptions'] = JSON.stringify(houseDesign._renderSizeOptions).replace(/\"/g, '\'');
    
    houseDesign.flashVars['structItems'] = JSON.stringify(houseDesign._structItems).replace(/\"/g, '\'');
    
    swfobject.embedSWF(swf, houseDesign.container, "100%", houseDesign._height, 
	        		houseDesign.flashplayerVersion, xiSwfUrlStr, 
                	houseDesign.flashVars, houseDesign.params, houseDesign.attrs);
    swfobject.createCSS("#"+container, "display:block;");
    
    (function(){
		swfmacmousewheel.registerObject(houseDesign.attrs.id);
	});
	
	// _beforeunloadInterval毫秒后监听window.onbeforeunload事件，提示用户保存设计数据
	if (houseDesign._beforeunloadInterval >= 0)
	{
		setTimeout(function () {
			window.onbeforeunload = function (ev) {
				return "您正在离开在线家装设计软件, 请在离开此页前确定保存好您的设计！";
			}
		}, houseDesign._beforeunloadInterval);
	}
};


//当窗口大小改变时
window.onresize = function() {
	//swf设置最小宽度和最小高度：920x600
	houseDesign._height = document.documentElement.clientHeight - houseDesign._top;
	$("#"+houseDesign.attrs.id).css("min-width","920px");
	if(houseDesign._height>600){
		$("#"+houseDesign.attrs.id).height(houseDesign._height);
	}else{
		$("#"+houseDesign.attrs.id).height(600);
	}

};

// 获取参数
function getParameterValue(name, defaultValue) {
	var value="";
	var findName = false;
	var url=location.href;
	var position=url.indexOf("?");
	var parameterStr=url.substr(position+1);//Get the string after ?
	var arr=parameterStr.split("&");
	for(i=0;i<arr.length;i++){
		var parameter=arr[i].split("=");
		if(decodeURI(parameter[0])==name){
			value=parameter[1];
			findName = true;
			break;
		}
	}
	if (findName == false) {
		value = defaultValue;
	}
	return value
}

/**
 * 保存成功后触发
 * @param no
 */
houseDesign.saveSuccess = function(no) {
	ajaxRequestHandle(no);
};

/**
 * 上传触发
 * @param no
 * @param fangyuanID
 * @param shikanID
 */
houseDesign.uploadPicture = function(no,fangyuanID,shikanID) {
	//alert(no+","+fangyuanID+","+shikanID);
	ajaxRequestHandle(no);
};

/**
 * 获取数据
 */
function ajaxRequestHandle(no){
	var index = new Date().getTime();
	//console.log(webSitePath()+'/designhouse3d/getDataUrl');
	$.ajax({
		url: webSitePath()+'/designhouse3d/getDataUrl',
	    type: 'GET',
	    async:true,
	    cache: false,
	    data:{"no": no},
	    dataType:'json',
	    success:function(result){
	    	var describ = result.data.describ;
	    	var img_out = result.data.filePath;
	    	var html = '<div class="out_img " id="out_im'+index+'">	<div class="out_imgDeal">'
			+'<img class="upload_image1" title="'+describ+'" src="'+img_out+'">'
			+'<p  class="big_pic">户型图'+'</p></div>'
			+'<span  class="delt glyphicon glyphicon-remove" id="delimg1'+index
			+'" onclick="delimg_out(this)"></span></div>';
	    	$('.img_outer', parent.document).append(html);
	    	layer.alert("设计图与房源实勘关联成功!");
	    },
	    error:function(){
	    	layer.alert(errorMsg);
    	}
	});
}
/**
 * 根据key返回值
 * @param key
 * @returns
 */
function getParameterArray(key){
	var flexFrameObj = window.parent.document.getElementById("flexFrame");
	if(flexFrameObj != "null" && flexFrameObj != null && flexFrameObj != undefined){
		var iframeUrl = flexFrameObj.src;
		var urlSuffix = iframeUrl.split("?")[1];
		var parameterArray = urlSuffix.split("&");
		var val = "";
		for(var i=0;i<parameterArray.length;i++){
			if(parameterArray[i].indexOf(key)>=0){
				return parameterArray[i].split("=")[1];
			}
		}
	}
	return null;
}

//得到网站的部署根目录
function webSitePath(){
	var pathName = window.location.pathname.substring(1);
	var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
	if(webName == ""){
		return window.location.protocol + '//' + window.location.host;
	}else{
		return window.location.protocol + '//' + window.location.host + '/' + webName;
	}
}