$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
	
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
		$("#J_deptName").attr("data-id",'');
		$('#J_applyUserId').attr('data-id','');
		$("#J_paymentType").val('');
		$("#J_paidStatus").val('');
		$('#J_auditUserId').attr('data-id','');
		$("#J_auditStatus").val('');
		endtime.min='';
		endtime.start='';
		starttime.max='';
		auditendtime.min = '';
    	auditendtime.start = '';
    	auditstarttime.max = '';
    	payendtime.min = '';
    	payendtime.start = '';
    	paystarttime.max = '';
    	realPayendtime.min = '';
    	realPayendtime.start = '';
    	realPaystarttime.max = '';
	})
	
	//申请人自动补全查询
	searchContainer.searchUserListByComp($("#J_applyUserId"), true, 'right');
	// 显示部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'), $('#J_deptLevel'));
	});	
	//初始化业务来源数据
	dimContainer.buildDimChosenSelector($("#J_paymentType"), "financePaymentType", "");
	//初始化付款状态数据
	dimContainer.buildDimChosenSelector($("#J_paidStatus"), "paymentApplyPayStatus", "");
	//审核人自动补全查询
	searchContainer.searchUserListByComp($("#J_auditUserId"), true, 'right');
	//初始化审核状态数据
	dimContainer.buildDimChosenSelector($("#J_auditStatus"), "paymentApplyAuditStatus", "");
	
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
	
	// 初始审核时间
	var auditstarttime = {
			elem: '#J_auditStartTime',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	auditendtime.min = datas;
		    	auditendtime.start = datas
		    }
		}
		
	var auditendtime = {
			elem: '#J_auditEndTime',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	auditstarttime.max = datas
		    }
		}
	// 初始应付（转）日期
	var paystarttime = {
			elem: '#J_payStartTime',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	payendtime.min = datas;
		    	payendtime.start = datas
		    }
		}
		
	var payendtime = {
			elem: '#J_payEndTime',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	paystarttime.max = datas
		    }
		}
	// 初始实付完成日期
	var realPaystarttime = {
			elem: '#J_realPayStartTime',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	realPayendtime.min = datas;
		    	realPayendtime.start = datas
		    }
		}
		
	var realPayendtime = {
			elem: '#J_realPayEndTime',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	realPaystarttime.max = datas
		    }
		}
	
	laydate(starttime);
	laydate(endtime);
	laydate(auditstarttime);
	laydate(auditendtime);
	laydate(paystarttime);
	laydate(payendtime);
	laydate(realPaystarttime);
	laydate(realPayendtime);
	
	$('#J_applyEndTime').on('change', function() {
		starttime.max = '';
	});
	$('#J_auditEndTime').on('change', function() {
		auditstarttime.max = '';
	});
	$('#J_payEndTime').on('change', function() {
		paystarttime.max = '';
	});
	$('#J_realPayEndTime').on('change', function() {
		realPaystarttime.max = '';
	});
})	

//按条件查询跟进列表
$('#J_search').on('click', function(event) {
	searchTableDatas();
	jQuery('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/finance/payment/apply/list'});
});

function searchTableDatas() {
	$('#J_dataTable').bootstrapTable({
		url: basePath + '/finance/payment/apply/list',
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
			o.auditUserId = $("#J_auditUserId").attr('data-id');
			o.timestamp = new Date().getTime();
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			if(o.isPublic){
				o.isPublic = $("#J_isPublic").val();
			}
			if(o.deptId){
				o.deptId = $("#J_deptName").attr("data-id");
			}
			if(o.fundCode){
				o.fundCode = $('#J_fundCode').val();
			}
			if(o.level){
				o.level = $("#J_deptLevel").val();
			}
			if(o.paidStatus){
				o.paidStatus= $("#J_paidStatus").val();
			}
			if(o.auditStatus){
				o.auditStatus= $("#J_auditStatus").val();
			}
			if(o.paymentType){
				o.paymentType = $("#J_paymentType").val();
			}
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
				    }
				]
	});
}