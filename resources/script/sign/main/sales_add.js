var arrphone = [];
var val = {};
var flag1 = 0;
var flag2 = 0;
var flag3 = 0;
var flag4 = 0;
var flag5 = 0;
var from=getQueryString('from');
conId =getQueryString('conId')||'';
function transation(){	
	dimContainer.buildDimRadio($("#entrustedTransfer"), "entrustedTransfer", "yesOrNo", "0");// 单独委托过户
	dimContainer.buildDimRadio($("#ownerType"), "ownerType", "ownerType", "");// 业主类型
	dimContainer.buildDimRadio($("#firstPurchase"), "firstPurchase", "yesOrNo","");// 是否首次购房
	$.when(
			searchContainer.searchUserListByComp($("#belonguserid"), true, 'left')// 所属人自动补全查询
	).then(function(){
		$.ajax({
			url : basePath + '/custom/common/getcuruserinfo',
			type : 'get',
			dataType : 'json',
			cache : false,
			success : function(result) {	
				$("#belonguserid").val(result.data.userName);
				$("#belonguserid").attr({"data-id":result.data.userId});
				$("#inputName").text(result.data.userName);
			}
		});
	})
}

function belongUser(){
	jsonGetAjax(basePath + '/sign/contractSales/getBelongUserMssages', {"contractId":conId}, function(result) {
		$("#dealAreaId").val(result.data.shopAreaName);
		$("#dealAreaId").attr({"data-id":result.data.shopAreaId});
		$("#dealGroupId").val(result.data.shopGroupName);
		$("#dealGroupId").attr({"data-id":result.data.shopGroupId});
		$("#dealShopId").val(result.data.shopName);
		$("#dealShopId").attr({"data-id":result.data.shopId});
		if(result.data.isProxy){
			$("#collectingDeposit").parents(".col-md-4").show();
			$("#entrustNotarialDeed").parents(".col-md-4").show();
			$("#principalCollectiongDeposit").parents(".col-md-4").show();
		}else{
			$("#collectingDeposit").parents(".col-md-4").hide();
			$("#entrustNotarialDeed").parents(".col-md-4").hide();
			$("#principalCollectiongDeposit").parents(".col-md-4").hide();
		}
	});
}
function basic(){
	new linkageContainer.regionSelector($("#housingDistrictId"),
			$("#housingTownId"), "", "");
	dimContainer.buildDimRadio($("#housingType"), "housingType",
			"houseingType", "");// 房屋类型
	dimContainer.buildDimRadio($("#restrictedPurchase"), "restrictedPurchase",
			"yesOrNo", "");// 限购房产
	dimContainer.buildDimRadio($("#ownerOnlyHousing"), "ownerOnlyHousing",
			"yesOrNo", "");// 业主唯一住房
	/*dimContainer.buildDimRadio($("#fullFiveYears"), "fullFiveYears", "yesOrNo",
			"");*/// 是否满五年
	/*dimContainer.buildDimChosenSelector($("#fullFiveGist"), "fullfiveGist",
			"fullFiveGist", "");*/// 满五年依据
	/*dimContainer.buildDimChosenSelector($("#houseProperty"), "houseProperty",
			"houseProperty", "");*/// 房屋设计用途

	/*dimContainer.buildDimChosenSelector($("#designUsesId"), "plannedUses",
			"designUsesId", "");*/// 房屋设计用途
	//dimContainer.buildDimRadio($("#carPort"), "carPort", "yesOrNo", "");// 是否带车位
	dimContainer.buildDimRadio($("#isHouseLease"), "isHouseLease",
			"houseLease", "");// 是否房屋出租
	//dimContainer.buildDimChosenSelector($("#useingMode"), "useingMode","useingMode", "");// 土地使用权获得方式
	/*dimContainer.buildDimRadio($("#isLandCertificate"), "isLandCertificate",
			"yesOrNo", "1");*/// 是否土地使用权证
	
	dimContainer.buildDimRadio($("#houseCharge"), "isHouseCharge", "houseCharge",
			"1");// 房屋抵押	
	//$('#fullFiveGist').prop('disabled','disabled');	
}
function agent(){
	dimContainer.buildDimChosenSelector($("#depositType"),
			"deliveryConditions", "depositType", "");// 定金交付方式

	dimContainer.buildDimChosenSelector($("#payType"), "payTypeSign", "payType",
			"");// 付款方式
	dimContainer.buildDimChosenSelector($("#noBatchLoan"), "noBatchLoan", "noBatchLoan",
	"");// 未批贷款解决方式	
	dimContainer.buildDimChosenSelector($("#liabilityShift"), "liabilityShift",
			"liabilityShift", "");// 风险责任转移日期
	dimContainer.buildDimChosenSelector($("#taxes"), "taxes", "taxes", "");// 税费承担方
	/*dimContainer.buildDimChosenSelector($("#taxPayingParty"), "taxPayingParty",
			"taxPayingParty", "");*/// 增加新税费缴纳方

	
}
function service(){
	dimContainer.buildDimCheckBox($("#chargeObject"), "chargeObject","clientType", "1,2");// 服务费收取对象
	searchContainer.searchUserListByComp($("#discountEmployeesId"), true, 'left');// 员工姓名	
	/*dimContainer.buildDimChosenSelector($("#discountReason"), "discountReason",
			"discountReason", "");// 打折原因
*/	dimContainer.buildDimCheckBox($("#buildingCheck"), "buildingCheck","buildingCheck", "");// 房屋校验
}
var userid;
function unprint(){
	//dimContainer.buildDimRadio($("#continuousOrder"), "continuousOrder","yesOrNo", "");// 是否连环订单
	dimContainer.buildDimRadio($("#mortgage"), "mortgage", "yesOrNo", "");// 是否按揭
	dimContainer.buildDimChosenSelector($("#mortgagePayments"),"mortgagePayments", "mortgagePayments", "");// 抵押还款人
	dimContainer.buildDimRadio($("#valueAddedTax"), "valueAddedTax", "yesOrNo","");// 是否增值税
	dimContainer.buildDimRadio($("#incomeTax"), "incomeTax", "yesOrNo","");// 是否个税
	dimContainer.buildDimChosenSelector($("#sellersHouseReason"),"houseReason", "sellersHouseReason", "");// 售房原因
	dimContainer.buildDimChosenSelector($("#buyHouseReason"), "buyReason","buyHouseReason", "");// 买房原因
	searchContainer.searchManagerListByComp($("#areaContractor"), true, 'left');// 大区助理
	searchContainer.searchStoreManagerListByComp($("#storeManager"), true, 'left');// 大区助理
	searchContainer.searchShopAssistantListByComp($("#storeContractor"), true, 'left');// 店面助理
	searchContainer.searchUserListByComp($("#trackingPeople"), true, 'left');// 跟单人
	searchContainer.searchUserListByComp($("#financialRisk"), true, 'left');// 金融风险师
	dimContainer.buildDimChosenSelector($("#integratedPayment"),"integratedPayment", "integratedPayment", "");// 综合地价款
	//dimContainer.buildDimChosenSelector($("#buyHouseQualification"),"buyHouseQualification", "buyHouseQualification", "");// 购房资质
	dimContainer.buildDimRadio($("#collectingDeposit"), "collectingDeposit","yesOrNo", "");// 业主代理人代收定金及房款
	dimContainer.buildDimRadio($("#entrustNotarialDeed"), "entrustNotarialDeed","yesOrNo", "");// 委托公证书
	dimContainer.buildDimRadio($("#principalCollectiongDeposit"), "principalCollectiongDeposit","yesOrNo", "");// 委托公证书是否注明委托人代收定金或房款
	$.when(
			searchContainer.searchUserListByComp($("#trackingPeople"), true, 'left')// 所属人自动补全查询
	).then(function(){
		$.ajax({
			url : basePath + '/custom/common/getcuruserinfo',
			type : 'get',
			dataType : 'json',
			cache : false,
			success : function(result) {	
				userid=result.data.userId;
				$("#trackingPeople").val(result.data.userName);
				$("#trackingPeople").attr({"data-id":result.data.userId});
				$("#spoorerAreaId").val(result.data.shopArea.deptName);
				$("#spoorerAreaId").attr({"data-id":result.data.shopArea.deptId});
				$("#spoorerGroupId").val(result.data.shopGroup.deptName);
				$("#spoorerGroupId").attr({"data-id":result.data.shopGroup.deptId});
				$("#spoorerId").val(result.data.shop.deptName);
				$("#spoorerId").attr({"data-id":result.data.shop.deptId});
			}
		});
	})
}
$("#trackingPeople").on('onSetSelectValue', function (e, keyword) {
	var val=$(this).attr("data-id");
	jsonGetAjax(basePath + '/sign/contractSales/getUserMessageByUserId', {"userId":val}, function(result) {
		
	$("#spoorerAreaId").val(result.data.shopAreaName);
	$("#spoorerAreaId").attr({"data-id":result.data.shopAreaId});
	$("#spoorerGroupId").val(result.data.shopGroupName);
	$("#spoorerGroupId").attr({"data-id":result.data.shopGroupId});
	$("#spoorerId").val(result.data.shopName);
	$("#spoorerId").attr({"data-id":result.data.shopId});
	})
}).on('onUnsetSelectValue',function(e){
	$("#spoorerAreaId").val('');
	$("#spoorerAreaId").attr({"data-id":''});
	$("#spoorerGroupId").val('');
	$("#spoorerGroupId").attr({"data-id":''});
	$("#spoorerId").val('');
	$("#spoorerId").attr({"data-id":''});
});
$("#signingDate").click(function() {
	laydate({elem:"#signingDate", 
		format : 'YYYY-MM-DD'
	});
});

$(document).on('click' , 'input.condition' , function(){
	var val = $(this).closest('td').prev().find('select').val();
	if($("#payType").val()==1){
		if(val == 4){
			laydate({elem:this,
				format : 'YYYY-MM-DD'
			});
		}
	}else{
		if(val == 6){
			laydate({elem:this,
				format : 'YYYY-MM-DD'
			});
		}
	}
	
}).on('change' , 'select[name=paymentClause]' , function(){
	var $this = $(this);
	var input = $this.closest('td').next().find('input');
	input.val('');
	input.closest('.form-group')
	.removeClass('has-error');
	input.closest('.form-group').find('span').remove();
	if($("#payType").val()==1){
		if($this.val()==1 || $this.val()==2 || $this.val()==6 || $this.val()==7 || $this.val()==8){
			input.attr({"disabled":"disabled"})
			input.val(0)
		}else{
			input.removeAttr("disabled")
		}
	}else{
		if($this.val()==1 || $this.val()==2 || $this.val()==8 || $this.val()==9 || $this.val()==10){
			input.attr({"disabled":"disabled"})
			input.val(0)
		}else{
			input.removeAttr("disabled")
		}
	}
	
});
				
$("select:not([ng-model])").chosen({
	width : "100%",
	allow_single_deselect : true
});
window.onload = function() {
	if(from==1){
		transation();
	}else if(from==2){
		basic();
	}else if(from==3){
		agent();
	}else if(from==4){
		service();
		var $ctrl = $('#controller').controller();
		var $scope = $('#controller').scope();
		$ctrl.getServiceChage();
		$scope.$digest();//外调ag的方法
	}else if(from==5){
		unprint();
		belongUser();
	}else{
		transation();
	}
}
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

$(".J_next").click(function() {
	var that=$(this);
	var index = $(this).closest(".tab-pane").index();
	var nextindex = Number(index) + Number(1);
	var moneyNum;
	
	
	if (nextindex == 1) {
		var validate = true;
		if (!contractValidate()) {
			console.log("校验失败");
			commonContainer.alert("存在不符合规则的数据！");
			return;
		}
		if($("#belonguserid").attr('data-id')&&$("#belonguserid").attr('data-id')==''){
			commonContainer.alert("合同所属人不存在！");
			return;
		}
		that.attr({"disabled":"disabled"});
		moneyNum =Number($("#deposit").val())+Number($("#loanAmount").val());
		$("input[name=paymenAmount]").each(function(){
			moneyNum=moneyNum+Number($(this).val());
		})
		if(moneyNum!=$("#transactionPrice").val()){
			layer.alert("支付金额与成交价不一致，请核实后，再进行下一步操作");
			return;
		};
		if($("#transactionPrice").val()!=Number($("#mainPrice").val())+Number($("#compensationPrice").val())){
			layer.alert("主体价（网签价）与装修设施补偿价之和与成交价不一致，请核实后，再进行下一步操作");
			return;
		};
		val = {};
		//val = $("#form1").serializeJson();
		val.belonguserid=$('#belonguserid').attr('data-id');
		val.housesCode =$('#houseId').text(); 
		val.customerCode  =$('#clientId').text();
		val.clientId = $("#customerId").text();
		val.entrustedTransfer =$('input[name="entrustedTransfer"]:checked').val(); 
		val.ownerType =$('input[name="ownerType"]:checked').val();
		val.firstPurchase=$('input[name="firstPurchase"]:checked').val();
		var contractUserList =[];
		
		
		$("#dataTableBuy tbody tr").each(function(){
			var obj={};
			obj.proxyType=1;
			obj.fullname =$(this).find('input[name="name"]').val();
			obj.idcardTypeCd =$(this).find('input[name="idcardTypeCd"]').val();
			obj.idcardNo =$(this).find('input[name="idcardNo"]').val();
			obj.addr =$(this).find('input[name="adress"]').val();
			obj.phoneNumber =$(this).find('input[name="phone"]').val();
			contractUserList.push(obj);
		})
		$("#dataTableBuyAll tbody tr").each(function(){
			var obj={};
			obj.proxyType=2;
			obj.fullname =$(this).find('input[name="name"]').val();
			obj.idcardTypeCd =$(this).find('input[name="idcardTypeCd"]').val();
			obj.idcardNo =$(this).find('input[name="idcardNo"]').val();
			obj.jointOwnershipNum =$(this).find('input[name="warrantNumber"]').val();
			obj.phoneNumber =$(this).find('input[name="phone"]').val();
			contractUserList.push(obj);
		})
		$("#dataTableownerAgent tbody tr").each(function(){
			var obj={};
			obj.proxyType=3;
			obj.fullname =$(this).find('td').eq(0).text();
			obj.idcardTypeCd =$(this).find('td').eq(1).attr('attr');
			obj.idcardNo =$(this).find('td').eq(2).text();
			obj.phoneNumber =$(this).find('td').eq(3).text();
			contractUserList.push(obj);
		})
		$("#dataTableClient tbody tr").each(function(){
			var obj={};
			obj.proxyType=4;
			obj.fullname =$(this).find('input[name="name"]').val();
			obj.idcardTypeCd =$(this).find('input[name="idcardTypeCd"]').val();
			obj.idcardNo =$(this).find('input[name="idcardNo"]').val();
			obj.addr =$(this).find('input[name="adress"]').val();
			obj.phoneNumber =$(this).find('input[name="phone"]').val();
			contractUserList.push(obj);
		})
		$("#dataTableClientAll tbody tr").each(function(){
			var obj={};
			obj.proxyType=5;
			obj.fullname =$(this).find('input[name="name"]').val();
			obj.idcardTypeCd =$(this).find('input[name="idcardTypeCd"]').val();
			obj.idcardNo =$(this).find('input[name="idcardNo"]').val();
			obj.phoneNumber =$(this).find('input[name="phone"]').val();
			contractUserList.push(obj);
		})
		$("#dataTableFloor tbody tr").each(function(){
			var obj={};
			obj.proxyType=6;
			obj.fullname =$(this).find('td').eq(0).text();
			obj.idcardTypeCd =$(this).find('td').eq(1).attr('attr');
			obj.idcardNo =$(this).find('td').eq(2).text();
			obj.phoneNumber =$(this).find('td').eq(3).text();
			contractUserList.push(obj);
		})
		val.contractUserList=contractUserList;
		console.log(JSON.stringify(val));
		jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"housesId":details.houseId}, function(result) {
			if(result.data==-1){
				that.removeAttr('disabled');
				layer.alert(result.msg);
			}else{		
				jsonPostAjax(basePath + '/sign/contractSales/saveSalesTwoSidesInformation', val, function(result) {
					that.removeAttr('disabled');
					conId=result.data;
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({
						"data-toggle" : "tab"
					});
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({
						"href" : "#tab-" + (nextindex + 1)
					});
					$('#lease-add li:eq(' + nextindex + ') a').tab('show');
					$(".nav-tabs li").each(function() {
						if ($(this).index() != nextindex) {
							$(this).children(".taba").removeAttr("data-toggle");
							$(this).children(".taba").removeAttr("href");
						}
					});
					$("body").prop('scrollTop',0)
					$("document").prop('scrollTop',0)
					$("html").prop('scrollTop',0)
					basic();
				},{
					errorCallBack:function(){
						that.removeAttr('disabled');
						layer.alert(errorMsg);
					}
				});
			}
		})
	} else if (nextindex == 2) {
		var validate = true;
		if (!houseValidate()) {
			console.log("校验失败");
			commonContainer.alert("存在不符合规则的数据！");
			return;
		}
		if ($('input[name="isHouseCharge"]:checked').val() == 2) {
			if ($('#dataTableMortgage tbody tr').length == 0) {
				commonContainer.alert("房屋抵押为已设定，请新增抵押人信息");
				return;
			}
			if($('#dataTableMortgage tbody tr').length >2){
				commonContainer.alert("抵押权人不得多于两条！");
				return;
			}
		}
		that.attr({"disabled":"disabled"});
		val = {};
		val = $("#form2").serializeJson();
		var fullFiveGist=$("#fullFiveGist").val();
		/*console.log(fullFiveGist)*/
		if(val.fullFiveGist!=undefined){
			val.fullFiveGist=val.fullFiveGist.substring(7);//取值存在问题
		}
		if(val.designUsesId!=undefined){
			val.designUsesId=val.designUsesId.substring(7);//取值存在问题
		}
		if(val.useingMode!=undefined){
			val.useingMode=val.useingMode.substring(7);//取值存在问题
		}
		if(val.houseProperty!=undefined){
			val.houseProperty=val.houseProperty.substring(7);//取值存在问题
		}
		val.conId=conId;
		val.housingDistrictName =$(
		"#housingDistrictId option:selected")
		.text()
		val.housingTownName =$(
		"#housingTownId option:selected")
		.text()
		var mortgageList =[];
		if ($('input[name="isHouseCharge"]:checked').val() == 2) {
			$('#dataTableMortgage tbody tr').each(function(){
				var obj={};
				obj.mortgageName =$(this).find('td').eq(0).text();
				obj.pawnamount =$(this).find('.smmoney').text();
				obj.cancellationConditions =$(this).find('td').eq(2).text();
				obj.transactDate =$(this).find('td').eq(3).text();
				obj.memo =$(this).find('td').eq(4).text();
				mortgageList.push(obj);				
			})
			val.mortgageList=mortgageList;
		}
		console.log(JSON.stringify(val));
		jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
			if(result.data==-1){
				that.removeAttr('disabled');
				layer.alert(result.msg);
			}else{
				jsonPostAjax(basePath + '/sign/contractSales/saveHouseOwnershipInformation', val, function(result) {
					that.removeAttr('disabled');
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({
						"data-toggle" : "tab"
					});
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({
						"href" : "#tab-" + (nextindex + 1)
					});
					$('#lease-add li:eq(' + nextindex + ') a').tab('show');
					$(".nav-tabs li").each(function() {
						if ($(this).index() != nextindex) {
							$(this).children(".taba").removeAttr("data-toggle");
							$(this).children(".taba").removeAttr("href");
						}
					});
					$("body").prop('scrollTop',0)
					$("document").prop('scrollTop',0)
					$("html").prop('scrollTop',0)
					agent();
				},{
					errorCallBack:function(){
						that.removeAttr('disabled');
						layer.alert(errorMsg);
					}
				});
			}
		})
	} else if (nextindex == 3) {
		var validate = true;
		if (!capitalValidate()) {
			console.log("校验失败");
			commonContainer.alert("存在不符合规则的数据！");
			return;
		}
		if(entrustedTransfer==1){
			
		}
		var compensationPrice_val=$("#compensationPrice").val();
		if(compensationPrice_val!=''){
			if((Number(compensationPrice_val)+Number($("#mainPrice").val()))!=Number($("#transactionPrice").val())){
				commonContainer.alert("成交价应为主体价和装修补偿价的和！");
				return;
			}
		}else{
			var transactionPrice=$("#transactionPrice").val();
			if(transactionPrice==''){
				transactionPrice=0;
			}
			if(Number($("#mainPrice").val())!=Number(transactionPrice)){
				commonContainer.alert("成交价应为主体价和装修补偿价的和！");
				return;
			}
		}
		that.attr({"disabled":"disabled"});
		val = {};
		val = $("#form3").serializeJson();
		val.conId=conId;//暂时注掉
		var paymentMethod=[];
		$('.dataTableMoney').each(function(){
			var obj={};
			obj.paymentMode =$('select[name="payType"]').val();
			obj.paymentClause =$(this).find('tbody tr').eq(0).find('td').eq(1).find('select').val();
			obj.condition =$(this).find('tbody tr').eq(0).find('td').eq(2).find('.condition').val();
			obj.paymenAmount =$(this).find('tbody tr').eq(0).find('td').eq(3).find('.J_priceCover').val();
			obj.transferWay =$(this).find('tbody tr').eq(0).find('td').eq(4).find('select').val();
			obj.memo =$(this).find('tbody tr').eq(0).find('td').eq(5).find('.memo').val();
			paymentMethod.push(obj);				
		})
		val.paymentMethod=paymentMethod;
		if(val.taxPayingParty!=undefined){
			val.taxPayingParty=val.taxPayingParty.substring(7);//取值存在问题
		}
		delete val.paymentClause;
		delete val.paymenAmount;
		delete val.transferWay;
		console.log(JSON.stringify(val));
		jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
			if(result.data==-1){
				that.removeAttr('disabled');
				layer.alert(result.msg);
			}else{
				jsonPostAjax(basePath + '/sign/contractSales/savePaymentMethod', val, function(result) {
					that.removeAttr('disabled');
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({
						"data-toggle" : "tab"
					});
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({
						"href" : "#tab-" + (nextindex + 1)
					});
					$('#lease-add li:eq(' + nextindex + ') a').tab('show');
					$(".nav-tabs li").each(function() {
						if ($(this).index() != nextindex) {
							$(this).children(".taba").removeAttr("data-toggle");
							$(this).children(".taba").removeAttr("href");
						}
					});
					$("body").prop('scrollTop',0)
					$("document").prop('scrollTop',0)
					$("html").prop('scrollTop',0)
					service();
					var $ctrl = $('#controller').controller();
					var $scope = $('#controller').scope();
					$ctrl.getServiceChage();
					$scope.$digest();//外调ag的方法
				},{
				});
			}
		})
	} else if (nextindex == 4) {
		//service();
		var validate = true;
		if (!serviceValidate()) {
			console.log("校验失败");
			commonContainer.alert("存在不符合规则的数据！");
			return;
		}
		that.attr({"disabled":"disabled"});
		val = {};
		val = $("#form4").serializeJson();
		val.conId=conId;
		val.discountEmployeesId=$("input[name='discountEmployeesId']").attr('data-id');
		var chargeObject=val.chargeObject;
		if(chargeObject.toString().indexOf(1)>-1&&chargeObject.toString().indexOf(2)>-1){
			val.chargeObject=1;
		}else if(chargeObject.indexOf(2)>-1){
			val.chargeObject=2;
		}else if(chargeObject.indexOf(1)>-1){
			val.chargeObject=3;
		}
		if(val.discountReason!=undefined){
		val.discountReason=val.discountReason.substring(7);//取值存在问题
		}
		
		var buildingCheck='';
		if(val.buildingCheck!=undefined){
			for(var i=0;i<val.buildingCheck.length;i++){
				buildingCheck+="##"+ val.buildingCheck[i];
			}
			val.houseCheck=buildingCheck+"##";
		}else{
			val.houseCheck=buildingCheck;
		}
		delete val.buildingCheck;
		console.log(JSON.stringify(val));
		jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
			if(result.data==-1){
				that.removeAttr('disabled');
				layer.alert(result.msg);
			}else{				
				jsonPostAjax(basePath + '/sign/contractSales/saveServiceChage', val, function(result) {
					that.removeAttr('disabled');
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({
						"data-toggle" : "tab"
					});
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({
						"href" : "#tab-" + (nextindex + 1)
					});
					$('#lease-add li:eq(' + nextindex + ') a').tab('show');
					$(".nav-tabs li").each(function() {
						if ($(this).index() != nextindex) {
							$(this).children(".taba").removeAttr("data-toggle");
							$(this).children(".taba").removeAttr("href");
						}
					});
					$("body").prop('scrollTop',0)
					$("document").prop('scrollTop',0)
					$("html").prop('scrollTop',0)
					unprint();
					belongUser();
					
				})
			}
		})
		} else if (nextindex == 5) {
			//service();
			var validate = true;
			if (!unprinValidate()) {
				console.log("校验失败");
				commonContainer.alert("存在不符合规则的数据！");
				return;
			}
			val = {};
			val = $("#form8").serializeJson();
			val.conId=conId;
			val.dealAreaId=$("#dealAreaId").attr("data-id");
			val.dealGroupId=$("#dealGroupId").attr("data-id");
			val.dealShopId=$("#dealShopId").attr("data-id");
			val.spoorerAreaId=$("#spoorerAreaId").attr("data-id");
			val.spoorerGroupId=$("#spoorerGroupId").attr("data-id");
			val.spoorerId=$("#spoorerId").attr("data-id");
			if($("#trackingPeople").attr("data-id")){
				val.trackingPeople=$("#trackingPeople").attr("data-id");
			}
			if($("#financialRisk").attr("data-id")){
				val.financialRisk=$("#financialRisk").attr("data-id");
			}
			if($("#areaContractor").attr("data-id")){
				val.areaContractor=$("#areaContractor").attr("data-id");
			}
			if($("#storeManager").attr("data-id")){
				val.storeManager=$("#storeManager").attr("data-id");
			}
			if($("#storeContractor").attr("data-id")){
				val.storeContractor=$("#storeContractor").attr("data-id");
			}
			if(val.buyHouseQualification!=undefined){
				val.buyHouseQualification=val.buyHouseQualification.substring(7);//取值存在问题
			}
			console.log(JSON.stringify(val));
			jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
				if(result.data==-1){
					that.removeAttr('disabled');
					layer.alert(result.msg);
				}else{	
					jsonPostAjax(basePath + '/sign/contractSales/saveNotPriont', val, function(result) {
						commonContainer.alert("操作成功！");
						window.location.href="../contractSales/draftdetail.htm?conId="+conId;//兼容火狐刷新
					});
				}
			})
		
	}

/*	$(".nav-tabs li").eq(nextindex).children(".taba").attr({
		"data-toggle" : "tab"
	});
	$(".nav-tabs li").eq(nextindex).children(".taba").attr({
		"href" : "#tab-" + (nextindex + 1)
	});
	$('#lease-add li:eq(' + nextindex + ') a').tab('show');
	$(".nav-tabs li").each(function() {
		if ($(this).index() != nextindex) {
			$(this).children(".taba").removeAttr("data-toggle");
			$(this).children(".taba").removeAttr("href");
		}
	});*/

})
/*
 * $(".J_before").click(function() { var index =
 * $(this).closest(".tab-pane").index(); var nextindex = Number(index) -
 * Number(1); $(".nav-tabs li").eq(nextindex).children(".taba").attr({
 * "data-toggle" : "tab" }); $(".nav-tabs
 * li").eq(nextindex).children(".taba").attr({ "href" : "#tab-" + (nextindex +
 * 1) }); $('#lease-add li:eq(' + nextindex + ') a').tab('show'); $(".nav-tabs
 * li").each(function() { if ($(this).index() != nextindex) {
 * $(this).children(".taba").removeAttr("data-toggle");
 * $(this).children(".taba").removeAttr("href"); } }); })
 */
$(document)
		.delegate(
				'select[name="payType"],select[name="loanNum"]',
				'change',
				function(event) {
					$('#list').empty();
					var id=$(this).attr("id")
					if(id=='payType'){
						if($(this).val() == 1) {
							$('#loanAmount').attr({'readonly' : 'readonly'});
							$('#noBatchLoan').attr({'disabled' :'disabled'});
							$('#loanAmount').val("");
							$('#noBatchLoan').val("");
							$('#J_loan').text('')
							$("#noBatchLoan").trigger("chosen:updated");
						} else {
							$('#loanAmount').removeAttr('readonly');
							$('#noBatchLoan').removeAttr('disabled');
							$("#noBatchLoan").trigger("chosen:updated");
						}
					}
					var str='';
					var arr=['一','二','三','四','五','六','七','八','九','十'];
					var value=$('select[name="payType"]').val();
					if (value) {
						var times = $('select[name="loanNum"]').val();						
						if (times) {
							for (var i = 0; i < times; i++) {							
							str += '<div class="row">'
							str += '<div class="col-md-12">'
							str += '<div class="form-group">'		
							str += '<label class="col-md-11 control-label" style="text-align: left;">第'+arr[i]+'次付款: </label>'
							str += '</div>'
							str += '</div>'
							str += '<div class="col-md-12 m-b-sm">'
							str += '<table  class="dataTableMoney table table-striped table-bordered table-hover dataTables-example table-condensed">'
							str += '<thead>'
							str += '<tr>'
							str += '<th style="width: 16%;">付款方式</th>'
							str += '<th style="width: 16%;" class="required">付款条件</th>'
							str += '<th style="width: 16%;">具体条件</th>'
							str += '<th style="width: 16%;" class="required">支付金额（元）</th>'
							str += '<th style="width: 16%;"class="required">资金划转方式</th>'
							str += '<th style="width: 16%;">备注</th>'
							str += '</tr>'
							str += '</thead>'
							str += '<tbody>'
							str += '<tr class="valign-top">'
							if(value==1){
								str += '<td>全款</td>'
							}else{
								str += '<td>贷款</td>'
							}
							str += '<td>'
							str += '<div class="form-group">'
							str += '<select name="paymentClause" class="form-control J_chosen condition" data-placeholder="请选择">'
							str += '<option value="">请选择</option>'
								if(value==1){								
									if(i==0){
										str += '<option value="1">甲方解抵押当天</option><option value="2">房源核验通过当天</option><option value="3">网签后具体时限内</option><option value="4">具体日期</option><option value="5">其他</option>'
									}else if(i==1){
										str += '<option value="6">办理房屋所有权转移登记当天</option><option value="4">具体日期</option><option value="5">其他</option>'
									}else{
										str += '<option value="7">交付房屋当日</option><option value="8">户口迁出当日</option><option value="4">具体日期</option><option value="5">其他</option>'
									}
								}else{
									if(i==0){
										str += '<option value="1">甲方解抵押当天</option><option value="2">房源核验通过当天</option><option value="3">网签后具体时限内</option><option value="4">商贷面签</option><option value="5">公积金初审</option><option value="6">具体日期</option><option value="7">其他</option>'
									}else if(i==1){
										str += '<option value="8">办理房屋所有权转移登记当天</option><option value="6">具体日期</option><option value="7">其他</option>'
									}else{
										str += '<option value="9">交付房屋当日</option><option value="10">户口迁出当日</option><option value="6">具体日期</option><option value="7">其他</option>'
									}
								}
							str += '</select>'
							str +='</div>'
							str += '</td>'
							str += '<td><div class="form-group">'
							str += '<input name="condition"  id="condition'+(i+1)+'" class="form-control condition">'
							str += '</div>'
							str += '</td>'
							str += '<td><div class="form-group">'
							str += '<input type="text" name="paymenAmount" class="form-control J_priceCover"> <label class="color_red"></label>'
							str += '</div></td>'
							str += '<td><div class="form-group">'
							str += '<select name="transferWay" class="transferofFunds form-control" data-placeholder="请选择">'
							str += '<option value="">请选择</option>'
							str += '</select>'
							str += '</div></td>'
							str += '<td>'
							str += '<div class="form-group">'
							str += '<input name="" class="memo form-control">'
							str += '</div>'
							str += '</td>'
							str += '</tr>'
							str += '</tbody>'
							str += '</table>'
							str += '</div>'
							str += '</div>'
							}
							
						}
						$('#list').append(str);
						dimContainer.buildDimChosenSelector($(".transferofFunds"), "transferofFunds", "transferofFunds", "");//资金划转方式
						$('select.condition').each(function(){
							$(this).trigger("chosen:updated");
							$(this).chosen({
								width : "100%",
								allow_single_deselect : true
							});
						})
						
						
					}
					
				})
/*$(document).delegate('input[name="buildingCheck"]', 'click', function(event) {
	var flag=0;
	$("input[name='buildingCheck']:checked").each(function(){ 
		if($(this).val()==5){
			flag=1;
		}					
	})
	if(flag==1){
		$("#houseCheckMemo").removeAttr('readonly');
	}else{
		$('#houseCheckMemo').attr({
			'readonly' : 'readonly'
		});// 土地使用权获得方式 其他描述的修改
		$('#houseCheckMemo').val("");
		if ($('#houseCheckMemo').closest('.form-group').hasClass(
				'has-error')) {
			$('#houseCheckMemo').closest('.form-group')
					.removeClass('has-error');
			$('#houseCheckMemo').closest('.form-group').find(
					'#housePropertyother-error').remove();
		}
	}

})	*/			
/*$(document).delegate('select[name="houseProperty"]', 'change', function(event) {
	if ($(this).val() != 6) {
		$('#otherHouse').attr({
			'readonly' : 'readonly'
		});// 土地使用权获得方式 其他描述的修改
		$('#otherHouse').val("");
		if ($('#otherHouse').closest('.form-group').hasClass(
				'has-error')) {
			$('#otherHouse').closest('.form-group')
					.removeClass('has-error');
			$('#otherHouse').closest('.form-group').find(
					'#qualificationMemo-error').remove();
		}
	} else {
		$('#otherHouse').removeAttr('readonly');// 土地使用权获得方式
														// 其他描述的修改
	}
})*/
/*$(document).delegate(
		'input[name="fullFiveYears"]',
		'click',
		function(event) {
			if ($(this).val() != 1) {
				$('#fullFiveGist').prop('disabled','disabled');
				$('#fullFiveGist').val("");
				if ($('#fullFiveGist').closest('.form-group').hasClass(
						'has-error')) {
					$('#fullFiveGist').closest('.form-group')
							.removeClass('has-error');
					$('#fullFiveGist').closest('.form-group').find(
							'#continuousOrderNum-error').remove();
				}
			} else {
				$('#fullFiveGist').removeAttr('disabled');// 土地使用权获得方式
																// 其他描述的修改
			}
			$("#fullFiveGist").trigger("chosen:updated");
		})*/
$(document).delegate(
		'input[name="continuousOrder"]',
		'click',
		function(event) {
			if ($(this).val() != 1) {
				$('#continuousOrderNum').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#continuousOrderNum').val("");
				if ($('#continuousOrderNum').closest('.form-group').hasClass(
						'has-error')) {
					$('#continuousOrderNum').closest('.form-group')
							.removeClass('has-error');
					$('#continuousOrderNum').closest('.form-group').find(
							'#continuousOrderNum-error').remove();
				}
			} else {
				$('#continuousOrderNum').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})
/*$(document).delegate(
		'select[name="taxPayingParty"]',
		'change',
		function(event) {
			if ($(this).val() != 3) {
				$('#taxPayingMemo').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#taxPayingMemo').val("");
				if ($('#taxPayingMemo').closest('.form-group').hasClass(
						'has-error')) {
					$('#taxPayingMemo').closest('.form-group')
							.removeClass('has-error');
					$('#taxPayingMemo').closest('.form-group').find(
							'#taxPayingMemo-error').remove();
				}
			} else {
				$('#taxPayingMemo').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})*/
//付款方式
$(document).delegate('select[name="payType"]','change',function(event) {
	if($(this).val() == 1) {
		$(".loanAmount").hide();
		$(".noBatchLoan").hide();
		$('#loanAmount').val("");
		$('#noBatchLoan').val("");
		$('#J_loan').text('')
		$("select").trigger("chosen:updated");
	} else {
		$(".loanAmount").show();
		$(".noBatchLoan").show();
	}
})
/*$(document).delegate(
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
		})*/
/*$(document).delegate(
		'input[name="isLandCertificate"]',
		'click',
		function(event) {
			if ($(this).val() != 1) {
				$('#landCertificate').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#landCertificate').val("");
				if ($('#landCertificate').closest('.form-group').hasClass(
						'has-error')) {
					$('#landCertificate').closest('.form-group')
							.removeClass('has-error');
					$('#landCertificate').closest('.form-group').find(
							'#landCertificate-error').remove();
				}
			} else {
				$('#landCertificate').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})*/
/*$(document).delegate(
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
		})*/
/*$(document).delegate(
		'select[name="useingMode"]',
		'change',
		function(event) {
			if ($(this).val() != 3) {
				$('#certificateMemo').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#certificateMemo').val("");
				if ($('#certificateMemo').closest('.form-group').hasClass(
						'has-error')) {
					$('#certificateMemo').closest('.form-group').removeClass(
							'has-error');
					$('#certificateMemo').closest('.form-group').find(
							'#certificateMemo-error').remove();
				}
			} else {
				$('#certificateMemo').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})*/
/*$(document).delegate(
		'input[name="carPort"]',
		'change',
		function(event) {
			if ($(this).val() == 0) {
				$('#carPortNumber').attr({
					'readonly' : 'readonly'
				});
				$('#carPortLocation').attr({
					'readonly' : 'readonly'
				});
				$('#carPortNumber').val("");
				$('#carPortLocation').val("");
				if ($('#carPortNumber').closest('.form-group').hasClass(
						'has-error')) {
					$('#carPortNumber').closest('.form-group').removeClass(
							'has-error');
					$('#carPortNumber').closest('.form-group').find(
							'#carPortNumber-error').remove();
				}
				if ($('#carPortLocation').closest('.form-group').hasClass(
						'has-error')) {
					$('#carPortLocation').closest('.form-group').removeClass(
							'has-error');
					$('#carPortLocation').closest('.form-group').find(
							'#carPortLocation-error').remove();
				}

			} else {
				$('#carPortNumber').removeAttr('readonly');
				$('#carPortLocation').removeAttr('readonly');
			}
		})*/
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
/*$(document).delegate('select[name="designUsesId"]','change',function(event) {
	if ($(this).val() != 8) {
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
})*/
	$(document).delegate(
		'select[name="mortgagePayments"]',
		'change',
		function(event) {
			if ($(this).val() != 4) {
				$('.paymentsMemo').hide();
				$('#mortgagePaymentsMemo').val("");
				if ($('#mortgagePaymentsMemo').closest('.form-group')
						.hasClass('has-error')) {
					$('#mortgagePaymentsMemo').closest('.form-group').removeClass(
							'has-error');
					$('#mortgagePaymentsMemo').closest('.form-group').find(
							'#otherUses-error').remove();
				}
			} else {
				$('.paymentsMemo').show();
			}
		})
/*$(document).delegate(
		'select[name="fullFiveGist"]',
		'change',
		function(event) {
			if ($(this).val() != 3) {
				$('#fullFiveMemo').attr({
					'readonly' : 'readonly'
				});
				$('#fullFiveMemo').val("");
				if ($('#fullFiveMemo').closest('.form-group').hasClass(
						'has-error')) {
					$('#fullFiveMemo').closest('.form-group').removeClass(
							'has-error');
					$('#fullFiveMemo').closest('.form-group').find(
							'#fullFiveMemo-error').remove();
				}
			} else {
				$('#fullFiveMemo').removeAttr('readonly');
			}
		})*/
$(document).delegate('input[name="isHouseCharge"]', 'change', function(event) {
	if ($(this).val() == 1) {
		$('.houseCharge').hide();
	} else if ($(this).val() == 2) {
		$('.houseCharge').show();
	}

})
function removeByValue(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
}

/*$(document).on("change",'#phoneType',function(){
	if($(this).val()==2){
		$(this).closest('.row').find(".remark").show();
	}else{
		$(this).closest('.row').find(".remark").hide();
	}
})*/
$(document)
    .on('keydown', '#phone', function (e) {
        if (e.key && e.key.length === 1 && !/\d/.test(e.key)) {
            return false;
        }
    })
    .on('compositionstart', '#phone', false) // 屏蔽输入法，IE 支持
    .on('compositionend', '#phone', function (e) {// chrome 删除输入法输入的内容
        if (e.originalEvent && e.originalEvent.data && this.value) {
            var data = e.originalEvent.data || '';
            var idx = this.selectionStart || this.selectionEnd;
            var value = this.value;
            this.value = value.slice(0 , idx - data.length) + value.slice(idx , value.length);
        }
    })
	.on('keyup','#phone' , function () {
		var parent = $(this).parent();
        if (!this.value) {
            return parent.removeClass('has-error has-success');
        }
        if (/^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/.test(this.value)) {
            parent.removeClass('has-error').addClass('has-success');
        }else{
            parent.removeClass('has-success').addClass('has-error');
		}
    })
	.on('click','.J_add_phone',function(event) {
	var _this = $(this);
	var phoneList=_this.closest(".form-group").find("input").val();
	if(typeof(phoneList)==undefined ||phoneList==''){
		arrphone=[];			
	}else{
		phoneList=phoneList.split(',');
		arrphone=phoneList;
	}
	
	commonContainer.modal('添加电话', $('#addphone_layer'), function(index,layero) {
		if (arrphone.length != 0) {
			var phonenum = 0;
			for (var i = 0; i < arrphone.length; i++) {
				var isMob = /^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
				if (isMob.test(arrphone[i])) {
					phonenum++;
				}
			}
			if (phonenum != 0) {
				var arrval = arrphone.reverse().join(",");
				_this.closest('tr').find('.J_phone').val(arrval);
				// $("#J_phone").val(arrval);
				layer.close(index);
			} else {
				commonContainer.alert("至少添加一个手机号码");
				return false;
			}

		} else {
			commonContainer.alert("请添加电话");
			return false;
		}
	}, {
		overflow : true,
		area : [ '500px', '80%' ],
		btns : [ '确定' ],
		success : function() {
			$("#J_phone_dataTable tbody").empty();
			if(phoneList.length!=0){
				var str=''
				for(i=0;i<phoneList.length;i++){
					str += '<tr><td>'
						+ phoneList[i]
						+ '</td>'
						+'<td><a class="btn-bitbucket"><b class="removed">删除</b></a></td></tr>';
				}
				
				$("#J_phone_dataTable tbody").prepend(str);
				arrphone=phoneList;
			
			}
		}
	});
})
$(document).delegate('#J_addphone','click',function(event) {
	var phone = $("#phone").val().trim();
	if (phone != '') {
		if ($("#phoneType").val() == 1) {
			var mobile = /^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
			if (!(mobile.test(phone))) {
				commonContainer.alert("国内手机格式不正确！");
				return;
			}
		} else if ($("#phoneType").val() == 2) {
			var tel = /^([0-9]{3,4}-)[0-9]{7,8}$/;
			if (!(tel.test(phone))) {
				commonContainer.alert("国内座机格式不正确！");
				return;
			}
		} else {
			/*var reg = /^[0-9]+$/;
			if (!reg.test(phone)) {
				commonContainer.alert("国外电话格式不正确！");
				return;
			}*/
		}
		if ($.inArray(phone, arrphone) == -1) {
			var str = '<tr><td>'
					+ phone
					+ '</td><td><a class="btn-bitbucket"><b class="removed">删除</b></a></td></tr>';
			$("#J_phone_dataTable tbody").prepend(str);
			arrphone.push(phone);
			$("#phone").val('');
		} else {
			commonContainer.alert("此电话号已输入");
		}
	} else {
		commonContainer.alert("电话号不允许为空");
	}
})
$(document).delegate('.removed', 'click', function(event) {
	removeByValue(arrphone, $(this).closest('tr').children('td').eq(0).text());
	$(this).closest('tr').remove();
	

})
var ifflag = 0;
$(document).on('input propertychange','#J_mortgage_money', function(event) {
	var money = $("#J_mortgage_money").val();
	var decimal = /^-?\d+(\.\d{1,2})?$/;
	if (decimal.test(money)) {
		$('#J_mortgage_bigmoney').text('¥：' + convertCurrency(money));
	}
	if(money==''){
		$('#J_mortgage_bigmoney').text(convertCurrency(''));
	}

});
$(document).on('input propertychange','#ownBrokerageReceived,#ownPerformanceReceived,#cusBrokerageReceived,#cusPerformanceReceived', function(event) {
	var $ctrl = $('#controller').controller();
	var $scope = $('#controller').scope();
	$ctrl.discount_resfun();
	$scope.$digest();//外调ag的方法
});

$(document).on('input propertychange','.J_priceCover', function(event) {
	var money = $(this).val();
	var decimal = /^-?\d+(\.\d{1,2})?$/;
	if (decimal.test(money)) {
		$(this).closest('.form-group').find('.color_red').text('¥：' + convertCurrency(money));
	}
	if(money==''){
		$(this).closest('.form-group').find('.color_red').text(convertCurrency(''));
	}
})



$(document)
		.delegate(
				'a',
				'click',
				function(event) {
					var _this = $(this);
					var title = ''
					var headTitle = ''
					if ($(this).attr('type') == 'ownerAgent'
							|| $(this).attr('type') == 'customerAgent') {
						$('#J_owner_agent_dataTable thead').empty();
						if ($(this).attr('type') == 'ownerAgent') {
							title = '业主代理人信息（甲方）';
							headTitle = '<tr>'
									+ '<th><span class="text-danger">*</span>业主代理人姓名</th>'
									+ '<th><span class="text-danger">*</span>证件类型</th>'
									+ '<th><span class="text-danger">*</span>证件号码</th>'
									+ '<th><span class="text-danger">*</span>联系电话</th>'
									+ '</tr>'
						} else if ($(this).attr('type') == 'customerAgent') {
							title = '客户代理人信息（乙方）';
							headTitle = '<tr>'
									+ '<th><span class="text-danger">*</span>客户代理人姓名</th>'
									+ '<th><span class="text-danger">*</span>证件类型</th>'
									+ '<th><span class="text-danger">*</span>证件号码</th>'
									+ '<th><span class="text-danger">*</span>联系电话</th>'
									+ '</tr>'
						}
						$('#J_owner_agent_dataTable thead').append(headTitle);
						commonContainer
								.modal(
										title,
										$('#owner_agent_layer'),
										function(index, layero) {
											validate = $('#owner_agent_form')
													.validate(
															{
																rules : {
																	J_owner_agent_name : {
																		required : true,
																		stringCheckz : true
																	},
																	J_cardType : {
																		required : true
																	},
																	J_cardType_num : {
																		required : true,
																		isIdCardNo : {
																			depends : function(
																					element) {
																				if ($(
																						'#J_cardType')
																						.val() == 1) {
																					return true;
																				}

																			}
																		},
																		passport : {
																			depends : function(
																					element) {
																				if ($(
																						'#J_cardType')
																						.val() == 6) {
																					return true;
																				}

																			}
																		}
																	},
																	J_owner_agent_phone : {
																		required : true,
																	}
																}
															}).form();
											if (!validate)
												return false;
											if (_this
													.hasClass('J_addownerAgent')) {
												var str = '<tr><td>'
														+ $(
																"#J_owner_agent_name")
																.val()
														+ '</td><td attr=' +$(
														"#J_cardType option:selected")
														.val()+'>'
														+ $(
																"#J_cardType option:selected")
																.text()
														+ '</td><td>'
														+ $("#J_cardType_num")
																.val()
														+ '</td><td class="col-md-3">'
														+ $(
																"#J_owner_agent_phone")
																.val()
														+ '</td><td>'
												str += '<div class="text-left">'
													if (_this.attr('type') == 'ownerAgent') {
														str += '<a type="ownerAgent" class="J_editownerAgent btn btn-outline btn-success btn-xs mt-3" data-name="'
															+ $(
																	"#J_owner_agent_name")
																	.val()
															+ '" data-cardType="'
															+ $("#J_cardType")
																	.val()
															+ '" data-cardType_num="'
															+ $("#J_cardType_num")
																	.val()
															+ '" data-phone="'
															+ $(
																	"#J_owner_agent_phone")
																	.val()
															+ '">修改</a>&nbsp;&nbsp;'
													} else if (_this.attr('type') == 'customerAgent') {
														str += '<a type="customerAgent" class="J_editownerAgent btn btn-outline btn-success btn-xs mt-3" data-name="'
															+ $(
																	"#J_owner_agent_name")
																	.val()
															+ '" data-cardType="'
															+ $("#J_cardType")
																	.val()
															+ '" data-cardType_num="'
															+ $("#J_cardType_num")
																	.val()
															+ '" data-phone="'
															+ $(
																	"#J_owner_agent_phone")
																	.val()
															+ '">修改</a>&nbsp;&nbsp;'
													}
												str += '<a type="del-ownerAgent" class="btn btn-outline btn-success btn-xs mt-3">删除</a>'
												str += '</div>'
												str += '</td></tr>';
												_this.closest('.row').find(
														'table').append(str);

											} else if (_this
													.hasClass('J_editownerAgent')) {
												_this
														.closest('tr')
														.find('td')
														.eq(0)
														.text(
																$(
																		"#J_owner_agent_name")
																		.val());
												_this
														.closest('tr')
														.find('td')
														.eq(1)
														.text(
																$(
																		"#J_cardType option:selected")
																		.text());
												_this
												.closest('tr')
												.find('td')
												.eq(1)
												.attr({"attr":
														$(
																"#J_cardType option:selected")
																.val()});
												_this
														.closest('tr')
														.find('td')
														.eq(2)
														.text(
																$(
																		"#J_cardType_num")
																		.val());
												_this
														.closest('tr')
														.find('td')
														.eq(3)
														.text(
																$(
																		"#J_owner_agent_phone")
																		.val());
												_this
														.attr({
															'data-name' : $(
																	"#J_owner_agent_name")
																	.val()
														});
												_this
														.attr({
															'data-cardType' : $(
																	"#J_cardType option:selected")
																	.val()
														});
												_this.attr({
													'data-cardType_num' : $(
															"#J_cardType_num")
															.val()
												});
												_this
														.attr({
															'data-phone' : $(
																	"#J_owner_agent_phone")
																	.val()
														});
											}
											layer.close(index);
										},
										{
											overflow : true,
											area : [ '1000px', '80%' ],
											btns : [ '确定' ],
											success : function() {
												$('#J_owner_agent_name').val('');
												$('#J_cardType').val('');
												$("select").trigger(
												"chosen:updated");
												$('#J_cardType_num').val('');
												$('#J_owner_agent_phone').val(
														'');
												if (ifflag == 0) {
													dimContainer
															.buildDimChosenSelector(
																	$("#J_cardType"),
																	"cardType",
																	"cardType",
																	"");// 建筑年代
													ifflag = 1;
												}
												if (_this
														.hasClass('J_editownerAgent')) {
													$("#J_owner_agent_name")
															.val(
																	_this
																			.attr('data-name'));
													$("#J_cardType")
															.val(
																	Number(_this
																			.attr('data-cardType')));
													$("#J_cardType_num")
															.val(
																	_this
																			.attr('data-cardType_num'));
													$("#J_owner_agent_phone")
															.val(
																	_this
																			.attr('data-phone'));
													$("select").trigger(
															"chosen:updated");
												}

											}
										});
					} else if ($(this).attr('type') == 'del-ownerAgent') {
						commonContainer.confirm(
								'是否确认删除信息？',function(index, layero){
									_this.closest('tr').remove();
									 layer.close(index);
								})
					} else if ($(this).attr('type') == 'mortgage') {
						commonContainer
								.modal(
										'添加',
										$('#mortgage_layer'),
										function(index, layero) {
											validate = $('#mortgage_form').validate({
																rules : {
																	J_mortgage_name : {
																		required : true,
																		stringCheckz : true
																	},
																	J_mortgage_money : {
																		required : true,
																		number : true,
																		min : 0,
																		decimal : true,
																	}
																}
															}).form();
											if (!validate)
												return false;
											if (_this.hasClass('J_addmortgage')) {
												var str = '<tr><td>'
														+ $("#J_mortgage_name").val()
														+ '</td><td style="font-weight:700;"><div class="smmoney">'
														+ $("#J_mortgage_money").val()
														+ '</div><div class="bigmoney color_red">'
														+'¥：' + convertCurrency($("#J_mortgage_money").val())
														+'</div></td><td>'
														+ $("#J_mortgage_condition").val()
														+ '</td><td class="col-md-2">'
														+ $("#J_mortgage_date").val()
														+ '</td><td class="col-md-3">'
														+ $("#J_mortgage_remark").val()
														+ '</td><td>'
												str += '<div class="text-left">'
												str += '<a type="mortgage" class="J_editmortgage btn btn-outline btn-success btn-xs mt-3" data-name="'
														+ $("#J_mortgage_name").val()
														+ '" data-money="'
														+ $("#J_mortgage_money").val()
														+ '" data-condition="'
														+ $("#J_mortgage_condition").val()
														+ '" data-date="'
														+ $("#J_mortgage_date").val()
														+ '" data-remark="'
														+ $("#J_mortgage_remark").val()
														+ '">修改</a>&nbsp;&nbsp;'
												str += '<a type="del-ownerAgent" class="btn btn-outline btn-success btn-xs mt-3">删除</a>'
												str += '</div>'
												str += '</td></tr>';
												_this.closest('.row').find('table').append(str);

											} else if (_this.hasClass('J_editmortgage')) {
												_this.closest('tr').find('td').eq(0).text($("#J_mortgage_name").val());
												_this.closest('tr').find('.smmoney').text($("#J_mortgage_money").val());
                                                _this.closest('tr').find('.bigmoney').text($("#J_mortgage_bigmoney").text());
												_this.closest('tr').find('td').eq(2).text($("#J_mortgage_condition").val());
												_this.closest('tr').find('td').eq(3).text($("#J_mortgage_date").val());
												_this.closest('tr').find('td').eq(4).text($("#J_mortgage_remark").val());
												_this.attr({'data-name' : $("#J_mortgage_name").val()});
												_this.attr({'data-money' : $("#J_mortgage_money").val()});
                                                _this.attr({'data-bigmoney' : $("#J_mortgage_bigmoney").text()});
												_this.attr({'data-condition' : $("#J_mortgage_condition").val()});
												_this.attr({'data-date' : $("#J_mortgage_date").val()});
												_this.attr({'data-remark' : $("#J_mortgage_remark").val()});
											}
											layer.close(index);
										},
										{
											overflow : true,
											area : [ '1000px', '80%' ],
											btns : [ '确定' ],
											success : function() {
												$('#J_mortgage_date').on('click',function(){
													laydate({
														elem:'#J_mortgage_date',
													    format:'YYYY-MM-DD',
													    min:laydate.now()
													});
												});
												
												$('#J_mortgage_name').val('');
												$('#J_mortgage_money').val('');
												$('#J_mortgage_bigmoney')
												.text(
														convertCurrency(''));
												$('#J_mortgage_condition').val(
														'');
												$('#J_mortgage_date').val('');
												$('#J_mortgage_remark').val('');
												if (_this.hasClass('J_editmortgage')) {
													$("#J_mortgage_name").val(_this.attr('data-name'));
													$("#J_mortgage_money").val(Number(_this.attr('data-money')));
													$("#J_mortgage_bigmoney").text('¥：' + convertCurrency(Number(_this.attr('data-money'))));
													$("#J_mortgage_condition").val(_this.attr('data-condition'));
													$("#J_mortgage_date").val(_this.attr('data-date'));
													$("#J_mortgage_remark").val(_this.attr('data-remar')||_this.attr('data-remark'));
												} else if (_this.hasClass('J_editmortgage')) {
													$('#J_mortgage_bigmoney').text(convertCurrency(money));
												}

											}
										});
					}

				})
				
	//选择合同	
var seeBeginDate={
	elem:'#createstarttime',
    format:'YYYY-MM-DD',
    istime:false,
    choose:function(datas){
    	seeEndDate.min=datas;
    	seeEndDate.start=datas;
    }
};
var seeEndDate={
	elem:'#createendtime',
    format:'YYYY-MM-DD',
    istime:false,
    choose:function(datas){
    	seeBeginDate.max=datas;
    }
}
laydate(seeBeginDate);
laydate(seeEndDate);
var _this=this;
var isInit=true;
$('#originalContract_btn').off().on('click',function(){
	var contractNumsun=$('#originalContract_btn > div');
	if(contractNumsun.length>1){
		contractNumsun.eq(1).hide();
	}
	commonContainer.modal('选择合同',$('#choiceHetong'),function(i){
		getAddContract(i);
	},{
		area:['80%','70%'],
		btns:['确定','取消'],
		overflow :true,
		success:function(){
			
			if(isInit){
				//退单类型
				dimContainer.buildDimChosenSelector($('#chargebackType'),'chargebacktype','');
				//业务类型
				dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
				
					
				$('#J_search').off().on('click',contractList);
				$('#J_reset').on('click',function(){
					$('#J_deptName').attr('data-id','');			//重置所属部门id
				});
				//所属部门
				$('#J_deptSelect').off().on('click', function() {
					showDeptTree($('#J_deptName'), $('#J_deptLevel'));
				});
				isInit=false;
			}
			//重置表单
			$('#J_contractQuery')[0].reset();
			$('#J_deptName').attr('data-id','');
			//创建表格表头
			var tabHtml='\
				<table id="contractList" class="table table-hover table-striped table-bordered">\
					<thead>\
						<tr>\
							<th data-field="">\
								<div class="th-inner">业务类型</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">合同编号</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">客户姓名<br />业主姓名</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">客户佣金<br />业主佣金（元）</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">成交价（元）</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">所属部门</div>\
							</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">成交人</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">签约日期</div>\
							</th>\
						</tr>\
					</thead>\
				</table>';
			$('#hetConten').html(tabHtml);
		}
	});
});
//查询合同列表
function contractList(){
	$('#contractList').bootstrapTable('destroy').bootstrapTable({
		url:basePath+'/sign/chargeback/choosecontract.htm',
		method:'post',
		sidePagination:'server',
		dataType:'json',
		pagination: true,
		singleSelect:true,		//设置单选
		clickToSelect:true,		//点击选中行
		striped:true,
		pageSize:10,
		pageList:[10, 20, 50],
		queryParams: function (params) {
			var data=$('#J_contractQuery').serializeObject();
			var deptId=$('#J_deptName').attr('data-id');
			if(deptId!==''){
				data.dept_id=deptId;		//所属部门id
			}
			data.contract_type=2;
            data.filter_change_name=1;
			data.userid=userid;
			data.pagesize = params.limit;
			data.pageindex = params.offset / params.limit+ 1;
			return data;
		},
		responseHandler: function(result) {
			if (result.code == 0 && result.data && result.data.totalcount> 0){
				return {
					'rows': result.data.list, 
					'total': result.data.totalcount
				}
			}
			return {
				'rows': [],
				'total': 0
			}	
		},
		columns:[
         	{
         		field: '',
		    	title :'选择',
		    	checkbox:true,
		    	align:'center'
         	},
			{
				field : 'contract_type',
				title : '业务类型',
				align : 'center'
			},
			{
				field : 'contract_code',
				title : '合同编号',
				align : 'center'
			},
			{
				field : 'customer_name',
				title : '客户姓名<br />业主姓名',
				align : 'center',
				formatter:function(value,row){
					return value+'<br />'+row.owner_name;
				}
			},
			{
				field : 'customer_commission',
				title : '客户佣金<br />业主佣金（元）',
				align : 'center',
				formatter:function(value,row){
					return value+'<br />'+row.owner_commission;
				}
			},
			{
				field : 'transaction_price',
				title : '成交价（元）',
				align : 'center'
			},
			{
				field : 'dept_name',
				title : '所属部门',
				align : 'center'
			},
			{
				field : 'user_name',
				title : '成交人',
				align : 'center'
			},
			{
				field : 'create_time',
				title : '签约日期',
				align : 'center'
			}
		]
	});
}
//获取新增合同详情
function getAddContract(i){
	var _this=this;
	$('#shituiYj').val('');
	$('#addCommissionRate').val('');
	var checkrowDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
	if(checkrowDataArr.length>0 && checkrowDataArr[0].con_id!==undefined){
		layer.close(i);
		//回显新增合同信息
		$("#originalContractCode").val(checkrowDataArr[0].contract_code);
	}else{
		commonContainer.alert('请选择合同');
	}
}
// 邮政编码验证
jQuery.validator.addMethod("isZipCode", function(value, element) {
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "请正确填写邮政编码");

// 字符验证
jQuery.validator.addMethod("string", function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "不允许包含特殊符号!");

// 必须以特定字符串开头验证
jQuery.validator.addMethod("begin", function(value, element, param) {
	var begin = new RegExp("^" + param);
	return this.optional(element) || (begin.test(value));
}, $.validator.format("必须以 {0} 开头!"));

// 验证值不允许与特定值等于
jQuery.validator.addMethod("notEqual", function(value, element, param) {
	return value != param;
}, $.validator.format("输入值不允许为{0}!"));

// 验证值必须大于特定值(不能等于)
jQuery.validator.addMethod("gt", function(value, element, param) {
	return value > param;
}, $.validator.format("输入值必须大于{0}!"));

// 字符验证
jQuery.validator.addMethod("stringCheckz", function(value, element) {
	console.log(value);
	return this.optional(element) || /^[\u4E00-\u9FA5\w]+$/.test(value);
}, "存在不符合规则的数据！");
// 字符验证
jQuery.validator.addMethod("stringCheck", function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只能包括中文字、英文字母、数字和下划线");
// 租期验证
jQuery.validator.addMethod("dateCheckz", function(value, element) {
	var RegExp = /^\d+$/;
	return this.optional(element) || /^[\u4E00-\u9FA5\w]+$/.test(value)
			|| RegExp.test(value);
}, "存在不符合规则的数据！");
// 验证值小数位数不能超过两位
jQuery.validator.addMethod("decimal", function(value, element) {
	var decimal = /^-?\d+(\.\d{1,2})?$/;
	return this.optional(element) || (decimal.test(value));
}, $.validator.format("小数位数不能超过两位!"));

// 字母数字
jQuery.validator.addMethod("alnum", function(value, element) {
	return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
}, "只能包括英文字母和数字");

// 只能输入英文
jQuery.validator.addMethod("english", function(value, element) {
	var chrnum = /^([a-zA-Z]+)$/;
	return this.optional(element) || (chrnum.test(value));
}, "只能输入字母");

// 汉字
jQuery.validator.addMethod("chcharacter", function(value, element) {
	var tel = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (tel.test(value));
}, "请输入汉字");

// 身份证号码验证（加强验证）
jQuery.validator
		.addMethod(
				"isIdCardNo",
				function(value, element) {
					return this.optional(element)
							|| /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/
									.test(value)
							|| /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/
									.test(value);
				}, "请正确输入身份证号码");

// 手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
	var length = value.length;
	var mobile = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
	return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");

// 电话号码验证
jQuery.validator.addMethod("isTel", function(value, element) {
	var tel = /^\d{3,4}-?\d{7,9}$/; // 电话号码格式010-12345678
	return this.optional(element) || (tel.test(value));
}, "请正确填写电话号码");

// 字母数字
jQuery.validator.addMethod("alnumAndchcharacter",
		function(value, element) {
			return this.optional(element)
					|| /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value);
		}, "只能包括汉字、英文字母和数字");
// 护照编号验证
jQuery.validator.addMethod("passport", function(value, element) {
	return this.optional(element) || checknumber(value);
}, "请正确输入您的护照编号");
// 验证护照是否正确
function checknumber(number) {
	var str = number;
	// 在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
	var Expression = /(P\d{7})|(G\d{8})/;
	var objExp = new RegExp(Expression);
	if (objExp.test(str) == true) {
		return true;
	} else {
		return false;
	}
};






