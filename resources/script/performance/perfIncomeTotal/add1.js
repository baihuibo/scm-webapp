$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	searchGroup($("#groupadr"), true, 'left');
	searchShop($("#shopadr"), true, 'left');
	searchArea($("#areaadr"), true, 'left');
	/*
	 * 模糊查询之大区查询*/
	function searchArea($container, isShowBtn, listAlign) {
		var itemArr = new Array();		
		jsonGetAjax(basePath + '/custom/common/getBasOrganization', {}, function(result) {		
			$.each(result.data,function(n,value){
				if(value.level == '1'){
					var data = value.id + ' / ' + value.name;			 
					 var dataArr = new Object();
					 dataArr.id = value.id;
					 dataArr.name = value.name;
					 dataArr.data = data;				 
					 itemArr.push(dataArr);
				}			
			})		
			searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
		})
	}

	/*
	 * 模糊查询之组团查询*/
	function searchGroup($container, isShowBtn, listAlign) {
		var itemArr = new Array();		
		jsonGetAjax(basePath + '/custom/common/getBasOrganization', {}, function(result) {		
			$.each(result.data,function(n,value){
				if(value.level == '2'){
					var data = value.id + ' / ' + value.name;			 
					 var dataArr = new Object();
					 dataArr.id = value.id;
					 dataArr.name = value.name;
					 dataArr.data = data;				 
					 itemArr.push(dataArr);
				}		
			})		
			searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
		})
	}


	  /*模糊查询之门店查询*/
	function searchShop($container, isShowBtn, listAlign) {
		var itemArr = new Array();		
		jsonGetAjax(basePath + '/custom/common/getBasOrganization', {}, function(result) {		
			$.each(result.data,function(n,value){
				if(value.level == '3'){
					var data = value.id + ' / ' + value.name;			 
					 var dataArr = new Object();
					 dataArr.id = value.id;
					 dataArr.name = value.name;
					 dataArr.data = data;				 
					 itemArr.push(dataArr);
				}			
			})	
			searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
		})
	}

	laydate({
		  elem: '#J_begindate',
		  format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
		  isTime:false,
		  min: '1990-01-01 00:00:01', //最小日期
		  max: laydate.now(),
		  choose: function(datas){ //选择日期完毕的回调
			 $("#J_begindate").val( datas.substring(0, 7));
		  }
	})
	// 初始化所属人
	searchContainer.searchUserListByComp($("#J_user"), true);
	//dimContainer.buildDimChosenSelector($("#customertype"), "businessType","");

})

//新增业绩总额调整

$(document).delegate(
		'#subimit',
		'click',
		function(event) {
			var contractNo=$("#contractNo").val();
			var J_user=$("#J_user").val();
			var customertype=$("#customertype option:selected").val();
			var perfType=$("#J_perfType option:selected").val();
			var adjustAmount=$("#adjustAmount").val();
			var areaadr=$("#areaadr").val();
			var groupadr=$("#groupadr").val();
			var shopadr=$("#shopadr").val();
			var J_begindate=$("#J_begindate").val();
			var J_revamp_remark=$("#J_revamp_remark").val();
			if(!(J_user&&customertype&&areaadr&&groupadr&&shopadr&&J_begindate&&J_revamp_remark&&adjustAmount)){
				layer.alert("新增信息不完整")
				return false;
			}else if(adjustAmount=="0"){
				layer.alert("调整金额不能为0")
				return false;
			}else if(!($("#areaadr").attr("data-id"))){
				layer.alert("大区输入错误！")
				return false;
			}else if(!($("#groupadr").attr("data-id"))){
				layer.alert("组团输入错误！")
				return false;
			}else if(!($("#shopadr").attr("data-id"))){
				layer.alert("店组输入错误！")
				return false;
			}else if(!($("#J_user").attr("data-id"))){
				layer.alert("被调整人输入错误！")
				return false;
			}
			
			
			var o={}
			o.contractNo=contractNo;
			o.belonger=parseInt($("#J_user").attr("data-id"))
			o.belongerName=J_user;
			o.businessType=customertype;
			o.perfType=perfType;
			o.adjustAmount=parseFloat(adjustAmount);
			o.belongShopArea =parseInt($("#areaadr").attr("data-id"));
			o.belongShopGroup=parseInt($("#groupadr").attr("data-id"));
			o.belongShopName=shopadr;
			o.belongShopAreaName =areaadr;
			o.belongShopGroupName=groupadr;
			o.belongShop=parseInt($("#shopadr").attr("data-id"));
			o.belongMonth=J_begindate;
			o.memo=J_revamp_remark;			
			$.ajax({
				url:basePath+"/performanceIncome/add",
				type : 'POST',
				async : true,
				cache : false,
				contentType : "application/json",
				data : JSON.stringify(o),
				dataType : 'json',
				success : function(result) {
					if(result.code==0){
						$("#J_user").val("");
						$("#adjustAmount").val("");
						$("#areaadr").val("");
						$("#groupadr").val("");
						$("#shopadr").val("");
						$("#contractNo").val("");
						$("#J_perfType").val("");
						$("#J_perfType").trigger("chosen:updated");
						$("#customertype").val("");
						$("#customertype").trigger("chosen:updated");
						$("#J_begindate").val("");
						$("#J_revamp_remark").val("");
						window.open("list.html","_self");
				}else{
						layer.alert(result.msg)
					}
					
				},
				error:function(){
					layer.alert(errorMsg);
				}
			})

		});

$("#cancle").on("click",function(){
	$("#J_user").val("");
	$("#adjustAmount").val("");
	$("#areaadr").val("");
	$("#groupadr").val("");
	$("#shopadr").val("");
	$("#contractNo").val("");
	$("#customertype").val("");
	$("#customertype").trigger("chosen:updated");
	$("#J_perfType").val("");
	$("#J_perfType").trigger("chosen:updated");
	$("#J_begindate").val("");
	$("#J_revamp_remark").val("");
	commonContainer.closeWindow()

})


var old="";
function check(ele){
var pattern = /^(\+|\-)?((([1-9]([0-9]*))|0)(\.([0-9]){0,2})?)?$/; 
var val=ele.value;
if(val.match(pattern)){
old=val;
return true;
}else{
ele.value=old;
return false;
}
}
function allCheck(ele){
var pattern = /^(\+|\-)?(([1-9]([0-9]*))|0)(\.([0-9]){0,2})?$/; 
var val=ele.value;
if(val.match(pattern)){
old=val;
return true;
}else{
ele.value="";
return false;
}
}
$("#customertype").bind("change",function(){
	if(this.value){
		var companyId;
		var keyid=this.value;
		$.ajax({
			url : basePath + '/perf/authorize/getUserInfo',
			type : 'get',
			dataType : 'json',
			cache : true,
			success : function(result) {	
				companyId = result.data;
				$("#J_perfType").find("option:not(:first-child)").remove();
				dimContainer1.buildDimChosenSelector1($("#J_perfType"), companyId,keyid,"");
			}
		});			
	}else{
		$("#J_perfType").find("option:not(:first-child)").remove();
		$("#J_perfType").trigger("chosen:updated");
	}
	
})

window.dimContainer1 = {
		getDimReqUrl: function() {
			return basePath + '/perf/setRuleDetail/findPerfType';
		},
		buildDimChosenSelector1: function($container, compId,keyId, selectedValues) {//selectedValues默认选中值
			// 初始化chosen控件
			commonContainer.initChosen($container);

			var that = this;
		    var options = [];
		    jsonPostAjax(that.getDimReqUrl(), {'compId':compId,'keyId':keyId}, function(result) {
	    		$.each(result.data, function(n, value) {
	    			if(value!=null){
	    				options.push('<option value="' + value.valueCode + '">' + value.valueName + '</option>');
	    			}    	    	
	    	    })
	    	    $container.append(options);

	    		var selectedValueArr = selectedValues.split(',');
	    		$container.val(selectedValueArr);
	    		$container.trigger("chosen:updated");
			})
		},
	}



