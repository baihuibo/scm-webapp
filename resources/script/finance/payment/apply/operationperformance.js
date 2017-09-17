var datailtitle='';
var applyid=getQueryString("applyId");
var detailpaymentType=getQueryString("paymentType");
var contractId=getQueryString("contractId");
var fundNameType = getQueryString("fundNameType");
$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
	
	if(fundNameType == '13'){
		$('#lishiK').hide();
		$('#J_jiange').hide();
	}else{
		$('#lishiK').show();
		$('#J_jiange').show();
	}
	//点击加载基本信息页面
	$('#J_jbmessage').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+detailpaymentType+'&applyId='+applyid+'&fundNameType='+fundNameType;
	});
	//点击加载审批历史页面
	$('#J_splishi').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/audittrace.htm?paymentType='+detailpaymentType+'&applyId='+applyid+'&fundNameType='+fundNameType;
	});
	//点击加载操作日志页面
	$('#J_czrizhi').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/operationlog.htm?paymentType='+detailpaymentType+'&applyId='+applyid+'&fundNameType='+fundNameType;
	});
	//点击加业绩信息志页面
	$('#J_yejimessage').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/operationperformance.html?paymentType='+detailpaymentType+'&applyId='+applyid+'&fundNameType='+fundNameType;
	});

	
	$('#J_srcimg').attr('src',basePath + '/performanceIncome/toExpectIncomeDetail.html?applyId='+applyid);
	
})

window.onload=function(){
	$( "#J_srcimg" ).contents().find( ".gray-bg" ).css('background-color','#fff');
	$( "#J_srcimg" ).contents().find( ".wrapper" ).css('padding','0px');
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 