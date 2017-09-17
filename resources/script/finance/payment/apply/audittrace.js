$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});

	var datailtitle='';
	var applyid=getQueryString("applyId");
	var detailpaymentType=getQueryString("paymentType");
	var templateid=getQueryString("templateId");
	var contractId=getQueryString("contractId");
	var fundNameType = getQueryString("fundNameType");
	var contractNumber = getQueryString("contractNumber");
	var index=1;
	
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
		window.location.href=basePath + '/finance/payment/apply/audittrace.htm?paymentType='+detailpaymentType+'&applyId='+applyid+'&contractId='+contractId+'&fundNameType='+fundNameType+'&contractId='+contractNumber;
	});
	//点击加载操作日志页面
	$('#J_czrizhi').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/operationlog.htm?paymentType='+detailpaymentType+'&applyId='+applyid+'&fundNameType='+fundNameType;
	});
	//点击加业绩信息志页面
	$('#J_yejimessage').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/operationperformance.html?paymentType='+detailpaymentType+'&applyId='+applyid+'&fundNameType='+fundNameType;
	});

	
	jsonPostAjax(basePath+'/workflow/doJob?modelName=PAYMENT_APPROVE&methodName=getFlowChartUrlByBusiness',{			
	    formId:applyid
	},function(result){
		$('#J_srcimg').attr('src',result.data.PAYMENT_APPROVE);
	});
	
	if(detailpaymentType=='1'){
		datailtitle='付款申请单详情';
		$('#J_zhuankuan').hide();
		$('#J_tuikuan').hide();
		$('#J_fukuan').show();
	}else if(detailpaymentType=='2'){
		datailtitle='退款申请单详情';
		$('#J_fukuan').hide();
		$('#J_zhuankuan').hide();
		$('#J_tuikuan').show();
	}else if(detailpaymentType=='3'){
		datailtitle='转款申请单详情';
		$('#J_fukuan').hide();
		$('#J_tuikuan').hide();
		$('#J_zhuankuan').show();
	}
	$('#J_titledetail').text(datailtitle);
	
	//初始化历史审批列表
	$('#J_fuk_dataTable').bootstrapTable({
		url: basePath + '/finance/payment/approve/findHistoryList',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: false,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = new Object();
			o.timestamp = new Date().getTime();
			o.formId = applyid;
			o.type="PAYMENT_APPROVE";
			return o;
		},
		responseHandler: function(result){
			if(result.code == 0 && result.data) {
				return { "rows": result.data}
			}
			return { "rows": []} 
		},
		columns: [ 	
		           	{field: 'SerialNumber',title :'序号',align: 'center',
		           		formatter: function(value, row, index) {
		      				return index+1;
		      	    	}
		           	},
		            {field: 'deptname', title: '审批部门', align: 'center'},
				    {field: 'rolename', title: '角色', align: 'center'},
				    {field: 'username', title: '审批人', align: 'center'},
				    {field: 'createtime', title: '审批时间', align: 'center'},
				    {field: 'result', title: '审批结果', align: 'center'},
				    {field: 'comment', title: '审批意见', align: 'center'},
				    {field: 'usedtime', title: '审批持续时间', align: 'center'}
				]
	});
})

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 