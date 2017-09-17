var houseId=getQueryString("houseid");
var belonguserid='';
var usersid='';
var finalassessmentCode;
function noneCheck(){
	commonContainer.alert("该房源已被保护，无法查看！");
}
function noneJurisdiction(){
	return commonContainer.alert("无权限！");
}
function check(){
	commonContainer.alert("核验结果稍后提供！");
}
function housestates(states){
	if(states=="无效"){
		commonContainer.alert("无效房源无法查看！");
	}else if(states=="成交"){
		commonContainer.alert("该房源已报成交，无法查看！");
	}	
}
function GetQueryString(name){ 
	   var reg=eval("/"+name+"/g");
	   var r = window.location.search.substr(1); 
	   var flag=reg.test(r);
	   if(flag){
	        return true;
	   }else{
	       return false;
	   } 
	}	
var isPass;
$(function(){
	if(GetQueryString("from")){
		proxyNewlyObj.documentEntry(houseId);
	}
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).attr("href");
        if(activeTab=='#tab-11'){
        	detail();
        }else if(activeTab=='#tab-13'){
        	//初始加载跟进记录
        	followUp('',houseId);
        }else if(activeTab=='#tab-14'){
        	trace(houseId);
        }else if(activeTab=='#tab-15'){
        	historylist();
        }else if(activeTab=='#tab-16'){
        	operationLogs();
        }else if(activeTab=='#tab-12'){
        	startInit('iframeId', 560);
        }
    });
});
window.onload=function(){
	if($(".tabs-container ul li").length!=0){
		$(".tabs-container ul li").eq(0).addClass('active');
		$("#tab-content1 .tab-pane").eq(0).addClass('active');
		var activeTab = $(".tabs-container ul li").eq(0).children('a').attr("href");
        if(activeTab=='#tab-11'){
        	detail();
        }else if(activeTab=='#tab-13'){
        	//初始加载跟进记录
        	followUp('',houseId);
        }else if(activeTab=='#tab-14'){
        	trace(houseId);
        }else if(activeTab=='#tab-15'){
        	historylist();
        }else if(activeTab=='#tab-16'){
        	operationLogs();
        }
	}
	
	detail();
}
function book(houseId) {
	jsonGetAjax(basePath + '/custom/common/getcuruserinfo.htm', {}, function(result) {		
		proxyNewlyObj.proxyNewlyAdded(1,houseId,result.data.userId,result.data.userName)		
	})
	
}
var validate=true, validatorRule,trace;
function updatePrice(){
	var price=$('#price').text();
	commonContainer.modal(
			'修改意向租金',
			$('#J_editpriceLayer'),
			function(index, layero) {
				validate = $('#J_editpriceForm1').validate({
					rules:{
						newPrice: {
					    	required:true,
					    	number:true,
					    	min:0,
					    	decimal: true,
					    	isFloatGtZero:true,
					    }
					}
				}).form();
				if(!validate) return false;
				/*if($('#J_newLabel').val()==price){
					commonContainer.alert("修改成功");
					layer.close(index);
				}*/
				trace = '修改意向租金，修改前为：' + price + '，修改后为：' + $('#J_newValue').val();
				jsonPostAjax(basePath + '/house/main/modifyhouse', {"housesid":houseId,"entrustprice":$('#J_newValue').val(),"trace":trace}, function(result) {
					commonContainer.alert("修改成功");
					layer.close(index);
					if(price>$('#J_newValue').val()){
						if($("#J_update_price .house-val").find('.fa').hasClass('fa-long-arrow-up')){
							$("#J_update_price .house-val").css({"color":'#57CC00'});
							$("#J_update_price .house-val").find('.fa').removeClass('fa-long-arrow-up');
							$("#J_update_price .house-val").find('.fa').addClass('fa-long-arrow-down');
						}else if($("#J_update_price .house-val").find('.fa').hasClass('fa-long-arrow-down')){
							
						}else{
							$("#J_update_price .house-val").css({"color":'#57CC00'});
							$("#J_update_price .house-val").css({"cursor":'#pointer'});
							var str='<i class="fa"></i>';
							$('.house-val').append(str);
							$("#J_update_price .house-val").find('.fa').addClass('fa-long-arrow-down');
						}
						
					}else if(price<$('#J_newValue').val()){
						if($("#J_update_price .house-val").find('.fa').hasClass('fa-long-arrow-up')){
							
						}else if($("#J_update_price .house-val").find('.fa').hasClass('fa-long-arrow-down')){
							$("#J_update_price .house-val").css({"color":'#FC2C00'});
							$("#J_update_price .house-val").find('.fa').removeClass('fa-long-arrow-down');
							$("#J_update_price .house-val").find('.fa').addClass('fa-long-arrow-up');
						}else{
							$("#J_update_price .house-val").css({"color":'#FC2C00'});
							$("#J_update_price .house-val").css({"cursor":'#pointer'});
							var str='<i class="fa"></i>';
							$('.house-val').append(str);
							$("#J_update_price .house-val").find('.fa').addClass('fa-long-arrow-up');
						}
					}
					$('#price').text($('#J_newValue').val());
					detail();
				})
			}, 
			{
				overflow :true,
				area : ['400px','270px'],
				btns : [ '确定'],
				success: function(){
					$('#J_newValue').val('');
					$('#J_oldLabel').html('原意向租金:');
					$('#new_company').text($("#company").text());
					$('#J_oldValue').text(price+$("#company").text());
					$('#J_newLabel').html('<span class="text-danger">*</span>意向租金:');
			}
		});	
}
function urlkey(keyid){
	if($("#temp_key_view").val()==undefined){
		commonContainer.alert("无权限");
		return false;
	}
	window.location.href=basePath+"/house/keyadmin/detail.htm?id="+keyid;
}
function bookadd(houseid,type,plannedUses){
	if($("#temp_proxy_add").val()==undefined){
		commonContainer.alert("无权限");
		return false;
	}
	window.open(basePath+"/house/proxy/houseProxyAdd?housesid="+houseid+"&type="+type+"&plannedUses="+plannedUses);
}
function urlbook(bookid,type){
	if($("#temp_proxy_view").val()==undefined){
		commonContainer.alert("无权限");
		return false;
	}
	window.open(basePath+"/house/proxy/houseProxyDetail?proxyId="+bookid+"&type="+type);
}
$(document).on("change",'#freetimeTypeId',function(){
	if($(this).val()=='5'){
		$(".freetime").show();
	}else{
		$(".freetime").hide();
	}
})
$(document).on("click",'#freetime',function(){
	datelayer( "#freetime", {
		format: 'YYYY-MM-DD'
	});
})
function detail(){
	jsonGetAjax(basePath + '/house/informationSupplement/housingLeaseDetails', {"housesid":houseId}, function(result) {		
		for(var key in result.data){
			if($("#tab-11 #J_detail_"+key)){
				$("#tab-11 #J_detail_"+key).text(result.data[key]);
				$("#tab-11 #J_detail_"+key).attr({"attr":result.data[key+"Id"]});
			}			
		}
		if(result.data.guihuayongtuCode==3||result.data.guihuayongtuCode==4){
			$("#company").text('元/平方米/天');
		}
        $("#J_detail_buildYear").text(result.data.buildyear);
        if(result.data.freetimeTypeId==5){
            $("#tab-11 #J_detail_freeTime").text(result.data.freeTime);
            $("#tab-11 #J_detail_freeTime").attr({"attr":result.data.freetimeTypeId});
            $("#tab-11 #J_detail_freeTime").attr({"attrTime":result.data.freeTime});
        }else{
            $("#tab-11 #J_detail_freeTime").text(result.data.freetimeType);
            $("#tab-11 #J_detail_freeTime").attr({"attr":result.data.freetimeTypeId});
        }
		/*$('#J_detail_bedRoom').val(oldSelectedValue);
		$('#livingroom').val(oldSelectedValue);
		$('#kitchen').val(oldSelectedValue);
		$('#toilet').val(oldSelectedValue);
		$('#balcony').val(oldSelectedValue);*/
		/*$(".J_edit_area").each(function(){
			if($(this).next("dd").find('.unit').length!=0){
				if($(this).next("dd").find('.unit').prev().text()==''||$(this).next("dd").find('.unit').prev().text()=='0'){
					$(this).next("dd").find('.unit').text('');
				}
			}
		});*/
		isPass=result.data.isPassCode;
		if(isPass==0){
			$('.J_evaluate_but').hide();
		}else{
			$('.J_evaluate_but').show();
		}
		
		if(result.data.finalassessmentCode){
			finalassessmentCode=result.data.finalassessmentCode;
		}
		if(result.data.belongUserId){
			belonguserid=result.data.belongUserId;
		}
		if(result.data.usersId){
			usersid=result.data.usersId;
		}
	})	
}

/*function checkadress(){
	var  val=2;
	if(val==1){
		auditshow(1);
	}else{
		followshow(1);
	}
}
function checkphone(){
	var show=1;
	if(show==1){
		seePhone(1);
	}else{
		followshow(1);
	}
}*/
var trace;
function editevaluate(){
	commonContainer.modal(
		'修改房源评价',
		$('#editevaluate_layer'),
		function(index, layero) {
			var remarkid=$("input[name='LessorHouseFinalAssessment']:checked").val();
			if(remarkid==undefined){
				commonContainer.alert("请选择房源评价");
				return false;
			}
			var old=$('#J_detail_finalassessmentId').text();
			trace = '修改房源评价，修改前为：' + old + '，修改后为：' + $("input[name='LessorHouseFinalAssessment']:checked").next('label').text();
			jsonAjax(basePath + '/house/main/updateremark', {"houseid":houseId,"remarkid":remarkid,"trace":encodeURI(trace)}, function(result) {
				commonContainer.alert("修改成功");
				/*detail();
				$('#houseremark').text($("input[name='LessorHouseFinalAssessment']:checked").next('label').text());*/
				layer.close(index);
				window.location.reload();
			})
		}, 
		{
			overflow :true,
			area : ['400px','250px'],
			btns : [ '确定'],
			success: function(){		
				if(!$("#remarkid").children().hasClass('radio')){
					if(isPass==1||isPass==2){
						var str='<div class="radio radio-primary radio-inline"><input type="radio" id="LessorHouseFinalAssessment1" name="LessorHouseFinalAssessment" value="1"><label for="LessorHouseFinalAssessment1">可租</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="LessorHouseFinalAssessment2" name="LessorHouseFinalAssessment" value="2"><label for="LessorHouseFinalAssessment2">暂不租</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="LessorHouseFinalAssessment3" name="LessorHouseFinalAssessment" value="3"><label for="LessorHouseFinalAssessment3">他租</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="LessorHouseFinalAssessment4" name="LessorHouseFinalAssessment" value="4"><label for="LessorHouseFinalAssessment4">无效</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="LessorHouseFinalAssessment5" name="LessorHouseFinalAssessment" value="5"><label for="LessorHouseFinalAssessment5">成交</label></div>';
						$("#remarkid").append(str);		
						$("input[name='LessorHouseFinalAssessment'][value="+finalassessmentCode+"]").attr("checked",true); 
					}else{
						var str='<div class="radio radio-primary radio-inline"><input type="radio" id="LessorHouseFinalAssessment1" name="LessorHouseFinalAssessment" value="1"><label for="LessorHouseFinalAssessment1">可租</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="LessorHouseFinalAssessment4" name="LessorHouseFinalAssessment" value="4"><label for="LessorHouseFinalAssessment4">无效</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="LessorHouseFinalAssessment5" name="LessorHouseFinalAssessment" value="5"><label for="LessorHouseFinalAssessment5">成交</label></div>'
							$("#remarkid").append(str);
						$("input[name='LessorHouseFinalAssessment'][value="+finalassessmentCode+"]").attr("checked",true); 
					}
					
				}				
		}
	});	
}
function updateremark(){
	commonContainer.modal(
			'修改备注',
			$('#J_editremarkLayer'),
			function(index, layero) {
				validate = $('#J_editForm2').validate({
					rules:{
						J_newValue: {
					    	required:true
					    }
					}
				}).form();
				if(!validate) return false;
				/*if($('#J_newLabel').val()==price){
					commonContainer.alert("修改成功");
					layer.close(index);
				}*/
				trace = '修改备注，修改前为：'+$('#J_oldValue1').text()+"，修改后为："+$('#J_newValue1').val();
				jsonPostAjax(basePath + '/house/main/modifyhouse', {"housesid":houseId,"memo":$('#J_newValue1').val(),"trace":trace}, function(result) {
					commonContainer.alert("修改成功");
					detail();
					$('#J_remark').text($('#J_newValue1').val());
					layer.close(index);
				})
			}, 
			{
				overflow :true,
				area : ['80%','300px'],
				btns : [ '确定'],
				success: function(){
					$('#J_oldLabel1').text("原备注:");
					$('#J_oldValue1').text($("#J_remark").text());
					$('#J_newLabel1').text("备注:");
					$('#J_newValue1').val('');
			}
		});		
}
function favoritehouse(houseid){
	jsonGetAjax(basePath + '/house/main/favoritehouse', {"houseid":houseid,"businessType":1}, function(result) {
		commonContainer.alert('收藏成功');
		$('#collection').remove();
	})	
}
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
//验证值小数位数不能超过两位  
jQuery.validator.addMethod("decimal", function (value, element) {  
  var decimal = /^-?\d+(\.\d{1,2})?$/;  
  return this.optional(element) || (decimal.test(value));  
}, $.validator.format("小数位数不能超过两位!"));  
$(document).on("click",'#J_detail_belonguser',function(){
	if(belonguserid!=''){
		getUserStaffInfo(belonguserid);
	}
})
$(document).on("click",'#J_detail_users',function(){
	if(usersid!=''){
		getUserStaffInfo(usersid);
	}
})

/**
 * 实勘录入OR详情
 * sourceId：
 * 		录入时为房源ID，显示详情为实勘ID
 * isHasInquistion：
 * 		是否有实勘：false，否；true，是
 */
function viewInquistion(sourceId, isHasInquistion) { 
	var url = '';
	if(isHasInquistion) {
		if($("#temp_inquisition_check").val()==undefined){
			commonContainer.alert("无权限");
			return false;
		}
		url = basePath+'/house/inquisition/inqCheckPage.html?inquId=' + sourceId;
		window.open(url);
	} else {
		if($("#temp_inquisition_add").val()==undefined){
			commonContainer.alert("无权限");
			return false;
		}
		url = basePath+'/house/inquisition/inqAddPage.html?housesId=' + sourceId;
		window.open(url);
		/*layer.open({
			title: false,
			type : 2,
			shift: 5,
			skin : 'layui-layer-lan',
			content : url,				
			area : ['97%', '97%'],
			btn : []
		});*/
	}
}
var browserVersion = window.navigator.userAgent.toUpperCase();
var isOpera = browserVersion.indexOf("OPERA") > -1 ? true : false;
var isFireFox = browserVersion.indexOf("FIREFOX") > -1 ? true : false;
var isChrome = browserVersion.indexOf("CHROME") > -1 ? true : false;
var isSafari = browserVersion.indexOf("SAFARI") > -1 ? true : false;
var isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
var isIE9More = (! -[1, ] == false);
function startInit(iframeId, minHeight) {
    eval("window.IE9MoreRealHeight" + iframeId + "=0");
    window.setInterval("reinitIframe('" + iframeId + "'," + minHeight + ")", 100);
}
function reinitIframe(iframeIdyeji, minHeight) {
    try {
        var iframe = document.getElementById(iframeIdyeji);
        var bHeight = 0;
        if (isChrome == false && isSafari == false)
            bHeight = iframe.contentWindow.document.body.scrollHeight;

        var dHeight = 0;
        if (isFireFox == true)
            dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
        else if (isIE == false && isOpera == false)
            dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        else if (isIE == true && isIE9More) {//ie9+
            var heightDeviation = bHeight - eval("window.IE9MoreRealHeight" + iframeIdyeji);
            if (heightDeviation == 0) {
                bHeight += 3;
            } else if (heightDeviation != 3) {
                eval("window.IE9MoreRealHeight" + iframeIdyeji + "=" + bHeight);
                bHeight += 3;
            }
        }
        else//ie[6-8]、OPERA
            bHeight += 3;

        var height = Math.max(bHeight, dHeight);
        if (height < minHeight) height = minHeight;
        iframe.style.height = height + "px";
    } catch (ex) { }
}