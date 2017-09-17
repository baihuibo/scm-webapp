var conId=getQueryString('conId');
var baseContractresult={};
var buyInfoContracttresult={};
var arrphone = [];
$(document).on('show.bs.collapse' , '.secondtable' , function(){
	$(this).closest('li').find('.btn-outline').text("收起");
})
$(document).on('hide.bs.collapse' , '.secondtable' , function(){
	$(this).closest('li').find('.btn-outline').text("展开");
})
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
	// 获取已激活的标签页的名称
	var activeTab = $(e.target).attr("href");
	var $ctrl = $('#controller').controller();
	var $scope = $('#controller').scope();
	if (activeTab == '#tab-11') {
		$ctrl.init();
		$scope.$digest();//外调ag的方法
	} else if (activeTab == '#tab-12') {
		$ctrl.annexLogs();
		$scope.$digest();//外调ag的方法
		if(dealt==false){
			$('#J_annexdataTable').bootstrapTable('hideColumn', 'id');
		}
		
	} else if (activeTab == '#tab-13') {
		viewattachedcontract();
	} else if (activeTab == '#tab-14') {
		 $ctrl.initSupplAgrtList();
		 $scope.$digest();//外调ag的方法
	} else if (activeTab == '#tab-15') {
		$ctrl.contractApproval();
		$scope.$digest();//外调ag的方法
	} else if (activeTab == '#tab-16') {		
		printhistory();
	} else if (activeTab == '#tab-17') {
		operationLogs();
	} else if (activeTab == '#tab-18') {
		$ctrl.costDetail();
		$scope.$digest();//外调ag的方法
	}else if(activeTab == '#tab-19'){
		$("#iframeIdyeji").attr({"src":"/sales/performance/toContractPerfDetail.html?contractId="+conId+"&companyId="+companysId+"&businessType=2"});
	}
});
/*function costdetails(){
	$("#cost-detail input[type='text']").each(function(){
		$(this).val('');
		
	})
	jsonGetAjax(basePath + '/finance/cost/detail', {"contractId":conId}, function(result) {
		
	})
}*/
$.fn.serializeJson = function() {
	var serializeObj = {};
	var array = this.serializeArray();
	var str = this.serialize();
	$(array).each(
			function() {
				if (serializeObj[this.name]) {
					if ($.isArray(serializeObj[this.name])) {
						serializeObj[this.name].push(this.value);
					} else {
						serializeObj[this.name] = [
								serializeObj[this.name], this.value ];
					}
				} else {
					serializeObj[this.name] = this.value;
				}
			});
	return serializeObj;
};
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 

var ifflag = 0;


$(document).delegate(
		'select[name="buyHouseQualification"]',
		'change',
		function(event) {
			if ($(this).val() != 7) {
				$('#qualificationMemo').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#qualificationMemo').val("");
				if ($('#qualificationMemo').closest('.form-group').hasClass(
						'has-error')) {
					$('#qualificationMemo').closest('.form-group')
							.removeClass('has-error');
					$('#qualificationMemo').closest('.form-group').find(
							'#qualificationMemo-error').remove();
				}
			} else {
				$('#qualificationMemo').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})
$(document).delegate('#trackingPeople', 'onSetSelectValue', function(event) {
/*$("#trackingPeople").on('onSetSelectValue', function (e, keyword) {*/
	var val=$(this).attr("data-id");
	jsonGetAjax(basePath + '/sign/contractSales/getUserMessageByUserId', {"userId":val}, function(result) {
		
	$("#spoorerAreaId").val(result.data.shopAreaName);
	$("#spoorerAreaId").attr({"data-id":result.data.shopAreaId});
	$("#spoorerGroupId").val(result.data.shopGroupName);
	$("#spoorerGroupId").attr({"data-id":result.data.shopGroupId});
	$("#spoorerId").val(result.data.shopName);
	$("#spoorerId").attr({"data-id":result.data.shopId});
	})
});
$(document).delegate('#trackingPeople', 'onUnsetSelectValue', function(event) {
	$("#spoorerAreaId").val('');
	$("#spoorerAreaId").attr({"data-id":''});
	$("#spoorerGroupId").val('');
	$("#spoorerGroupId").attr({"data-id":''});
	$("#spoorerId").val('');
	$("#spoorerId").attr({"data-id":''});	
})
$(document).delegate(
		'select[name="houseProperty"]',
		'change',
		function(event) {
			if ($(this).val() != 6) {
				$('#housePropertyother').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#housePropertyother').val("");
				if ($('#housePropertyother').closest('.form-group').hasClass(
						'has-error')) {
					$('#housePropertyother').closest('.form-group')
							.removeClass('has-error');
					$('#housePropertyother').closest('.form-group').find(
							'#housePropertyother-error').remove();
				}
			} else {
				$('#housePropertyother').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})
$(document).delegate(
		'select[name="useingMode"]',
		'change',
		function(event) {
			if ($(this).val() != 3) {
				$('#useingModeother').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#useingModeother').val("");
				if ($('#useingModeother').closest('.form-group').hasClass(
						'has-error')) {
					$('#useingModeother').closest('.form-group').removeClass(
							'has-error');
					$('#useingModeother').closest('.form-group').find(
							'#useingModeother-error').remove();
				}
			} else {
				$('#useingModeother').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})

$(document).delegate(
		'select[name="discountEmployeesId"]',
		'change',
		function(event) {
			if ($(this).val() != 4) {
				$('#otherUses').attr({
					'readonly' : 'readonly'
				});
				$('#otherUses').val("");
				if ($('#otherUses').closest('.form-group')
						.hasClass('has-error')) {
					$('#otherUses').closest('.form-group').removeClass(
							'has-error');
					$('#otherUses').closest('.form-group').find(
							'#otherUses-error').remove();
				}
			} else {
				$('#otherUses').removeAttr('readonly');
			}
			if ($(this).val() != 3) {
				$('#otherUses').attr({
					'readonly' : 'readonly'
				});
				$('#otherUses').val("");
				if ($('#otherUses').closest('.form-group')
						.hasClass('has-error')) {
					$('#otherUses').closest('.form-group').removeClass(
							'has-error');
					$('#otherUses').closest('.form-group').find(
							'#otherUses-error').remove();
				}
			} else {
				$('#otherUses').removeAttr('readonly');
			}
		})
startInit('iframeId', 560);
startInit('iframeIdyeji', 560);

var browserVersion = window.navigator.userAgent.toUpperCase();
var isOpera = browserVersion.indexOf("OPERA") > -1 ? true : false;
var isFireFox = browserVersion.indexOf("FIREFOX") > -1 ? true : false;
var isChrome = browserVersion.indexOf("CHROME") > -1 ? true : false;
var isSafari = browserVersion.indexOf("SAFARI") > -1 ? true : false;
var isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
var isIE9More = (! -[1, ] == false);
function reinitIframe(iframeId, minHeight) {
    try {
        var iframe = document.getElementById(iframeId);
        var bHeight = 0;
        if (isChrome == false && isSafari == false)
            bHeight = iframe.contentWindow.document.body.scrollHeight;

        var dHeight = 0;
        if (isFireFox == true)
            dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
        else if (isIE == false && isOpera == false)
            dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        else if (isIE == true && isIE9More) {//ie9+
            var heightDeviation = bHeight - eval("window.IE9MoreRealHeight" + iframeId);
            if (heightDeviation == 0) {
                bHeight += 3;
            } else if (heightDeviation != 3) {
                eval("window.IE9MoreRealHeight" + iframeId + "=" + bHeight);
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
function startInit(iframeIdyeji, minHeight) {
    eval("window.IE9MoreRealHeight" + iframeIdyeji + "=0");
    window.setInterval("reinitIframe('" + iframeIdyeji + "'," + minHeight + ")", 100);
}  

//表格加载完成
$(document).ajaxStop(function(){
	  if($("#dataTableownerAgent tbody tr").length>0){
		  $("#unpritable .col-sm-4").eq(27).show();
		  $("#unpritable .col-sm-4").eq(28).show();
		  $("#unpritable .col-sm-4").eq(29).show();
	  }else if($("#dataTableownerAgent tbody tr").length==0){
		  $("#unpritable .col-sm-4").eq(27).hide();
		  $("#unpritable .col-sm-4").eq(28).hide();
		  $("#unpritable .col-sm-4").eq(29).hide();
	  }
 });

