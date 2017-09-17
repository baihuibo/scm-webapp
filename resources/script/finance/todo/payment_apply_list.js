$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
	
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
		$("#J_deptName").attr("data-id",'');
		$("#J_deptLevel").val('');
		$('#J_applyUserId').attr('data-id','');
		endtime.min='';
		endtime.start='';
		starttime.max='';
	})
	
	//申请人自动补全查询
	searchContainer.searchUserListByComp($("#J_applyUserId"), true, 'right');
	
	// 显示部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'), $('#J_deptLevel'));
	});	
	
	//款项数据加载
	var options = [];
	jsonGetAjax(
		basePath +'/finance/common/getFinanceFundList',
		{}, 
		function(result) {
    		$.each(result.data, function(n, value) {
    	    	options.push('<option value="' + value.fundCode +'">' + value.fundName + '</option>');
    	    })
    	    $('#J_fundCode').append(options.join(''));
    		$('#J_fundCode').trigger("chosen:updated");
		}
	)
	
	// 初始申请时间
	var starttime = {
		elem: '#J_applyStartTime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	endtime.min = datas;
	    	endtime.start = datas
	    }
	}
	
	var endtime = {
		elem: '#J_applyEndTime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	starttime.max = datas
	    }
	}
	
	laydate(starttime);
	laydate(endtime);
	
	$('#J_applyEndTime').on('change', function() {
		starttime.max = '';
	});
})	

$('#J_search').on('click', function(event) {
	searchTableDatas();
});

function searchTableDatas() {
	$('#J_dataTable').bootstrapTable('destroy').bootstrapTable({
		url: basePath + '/finance/todo/getPaymentApplyList',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.applyUserId = $("#J_applyUserId").attr('data-id');
			o.timestamp = new Date().getTime();
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			o.deptId = $("#J_deptName").attr("data-id");
			o.paymentType = getQueryString("paymentType");;
			return o;
		},
		responseHandler: function(result){
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		            {field: 'strPaymentType', title: '业务来源', align: 'center'},
				    {field: 'applyNumber', title: '付款申请单编号', align: 'center',
		            	formatter: function(value, row, index) {	
		      				var html = '';
		      				var url = '';
		      				if (row.paymentType == '1') {// 跳转到付款详情
		      					url = basePath+"/finance/payment/apply/detail.htm?paymentType="+row.paymentType+"&applyId="+row.applyId;
		      				}else if (row.paymentType == '2') {// 跳转到退款详情
		      					url = basePath+"/finance/payment/apply/detail.htm?paymentType="+row.paymentType+"&applyId="+row.applyId;
		      				}else if (row.paymentType == '3') {// 跳转到转款详情
		      					url = basePath+"/finance/payment/apply/detail.htm?paymentType="+row.paymentType+"&applyId="+row.applyId;
		      				}
		      				html = '<a href="'+url+'" target="_blank">'+ value +'</a>';
		      				return html;
		      	    	}
				    },
				    {field: 'contractNumber', title: '合同编号', align: 'center'},
				    {field: 'deptName', title: '所属部门', align: 'center'},
				    {field: 'strPayStatus', title: '付款状态', align: 'center'},
				    {field: 'fundName', title: '款项', align: 'center'},
				    {field: 'payTotalAmount', title: '应付（转）金额<br/>应付（转）日期', align: 'center',
				    	formatter: function(value, row, index) {
					    	var html = '';
		      				var payTotalAmount = value ? value : '-';
		      				var payTime = row.payTime ? row.payTime : '-'
		      				html =payTotalAmount+'<br>'+payTime.substring(0,11);
				    		return html;
					    }
				    },
				    {field: 'strAuditStatus', title: '审核状态', align: 'center'},
				    {field: 'lastAuditUserName', title: '最后审核人<br/>最后审核时间', align: 'center',
					    formatter: function(value, row, index) {
					    	var html = '';
		      				var lastAuditUserName = value ? value : '-';
		      				var lastAuditTime = row.lastAuditTime ? row.lastAuditTime : '-'
		      				html =lastAuditUserName+'<br>'+lastAuditTime;
				    		return html;
					    }
				    },
			      	{field: 'opt', title: '操作', align: 'center',
			      		formatter: function(value, row, index) {
			      			var html = '<a href="'+row.todoUrl+'" class="btn btn-outline btn-success btn-xs" target="_blank">审核</a>';
		      	    		return html;
		      	    	}
			      	}
				]
	});
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 