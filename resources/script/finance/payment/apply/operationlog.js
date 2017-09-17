$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
	var contractId=getQueryString("contractId");
	var fundNameType = getQueryString("fundNameType");
	var datailtitle='';
	var applyid=getQueryString("applyId");
	var detailpaymentType=getQueryString("paymentType");
	
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

	if(detailpaymentType=='1'){
		datailtitle='付款申请单详情';
		$('#J_zhuankuan').hide();
		$('#J_tuikuan').hide();
		$('#J_fukuan').show();
		$('#fukuan_log').show();
		$('#tuikuan_log').hide();
		$('#zhuankuan_log').hide();
		$('#detailK').on('click',function(){
			$('#fukuan_z').show();
			$('#tuikuan_z').hide();
			$('#zhuankuan_z').hide();
			$('#fukuan_log').show();
			$('#tuikuan_log').hide();
			$('#zhuankuan_log').hide();
		})
		initTable('#J_fuk_dataTable', applyid);
	}else if(detailpaymentType=='2'){
		datailtitle='退款申请单详情';
		$('#J_fukuan').hide();
		$('#J_zhuankuan').hide();
		$('#J_tuikuan').show();
		$('#tuikuan_log').show();
		$('#fukuan_log').hide();
		$('#zhuankuan_log').hide();
		$('#lishiK').on('click',function(){
			$('#fukuan_z').hide();
			$('#tuikuan_z').show();
			$('#zhuankuan_z').hide();
			$('#fukuan_log').hide();
			$('#tuikuan_log').show();
			$('#zhuankuan_log').hide();
		})
		initTable('#J_tuik_dataTable' , applyid);
	}else if(detailpaymentType=='3'){
		datailtitle='转款申请单详情';
		$('#J_fukuan').hide();
		$('#J_tuikuan').hide();
		$('#J_zhuankuan').show();
		$('#zhuankuan_log').show();
		$('#fukuan_log').hide();
		$('#tuikuan_log').hide();
		$('#logK').on('click',function(){
			$('#fukuan_z').hide();
			$('#tuikuan_z').hide();
			$('#zhuankuan_z').show();
			$('#fukuan_log').hide();
			$('#tuikuan_log').hide();
			$('#zhuankuan_log').show();
		})
		initTable('#J_zhuank_dataTable' , applyid);
	}
	
	$('#J_titledetail').text(datailtitle);
	
	//初始化付款操作日志
	
	function initTable(id,param){
		$(id).bootstrapTable({
			url: basePath + '/finance/payment/apply/selectOperationListByApplyId',
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
				o.applyId =param;
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
			            {field: 'createByName', title: '操作人', align: 'center'},
					    {field: 'createByPositonName', title: '岗位', align: 'center'},
					    {field: 'deptName', title: '所属部门', align: 'center'},
					    {field: 'typeName', title: '操作类型', align: 'center'},
					    {field: 'content', title: '操作内容', align: 'center'},
					    {field: 'createTime', title: '操作时间', align: 'center'}
					]
		});
	}
})

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 