$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	dimContainer.buildDimChosenSelector($("#J_contractTypeStr"), "businessType","");
	dimContainer.buildDimChosenSelector($("#J_recycleStatus"), "receiptReturnStatus","");
	dimContainer.buildDimChosenSelector($("#J_approveStatus"), "collectBatchAuditStatus","");
	// 显示所属部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'),$("#J_deptLevel"));
	});
	$('#J_reset').on('click', function(event) {
		$('#J_deptLevel').val('');
	})
	// 初始化使用人
	searchContainer.searchUserListByComp($("#J_useByStr"), true);
	
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/finance/receipt/searchReceipt' });
		
	});
	
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/finance/receipt/searchReceipt',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_receiptform').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.groupid){
					o.groupid = encodeURI($("#J_deptName").attr("data-id"))
				}
				if(o.useById){
					o.useById = encodeURI($("#J_useByStr").attr("data-id"))
				}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.list, "total": result.data.totalcount}
				}
				return { "rows": [], "total": 0 } 
			},
			columns:[
		      	{
		      		field: 'receiptCode',
		      		title: '收据编号', 
		      		align: 'center',
		      		formatter: function(value ,row, index){
	      	    		var html='';
	      	    		html='<a href="../receipt/detail.htm?receiptId='+row.receiptId+'" target="_blank">'+row.receiptCode+'</a>'
	      	    		return html;
	      	    	}
		      	},
		      	{
		      		field: 'contractCode', 
		      		title: '合同编号',
		      		align: 'center'
		      	},
		      	{
		      		field: 'clientId', 
		      		title: '客户编号', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'fundName',
		      		title: '款项', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'amount', 
		      		title: '金额', 
		      		align: 'center',
		      		formatter: function(value ,row, index){
	      	    		var html='';
	      	    		html='<div class="text-right">'+row.amount+'</div>'
	      	    		return html;
	      	    	}
		      	},
		      	{
		      		field: 'payeeStr', 
		      		title: '收款单位', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'payerName', 
		      		title: '付款单位/个人 ', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'createByStr',
		      		title: '录入人', 
		      		align: 'center',
		      		formatter: function(value ,row, index){
	      	    		return row.createById==undefined?'-':'<a onclick="getUserStaffInfo('+row.createById+')">'+value+'</a>';
	      	    	}
		      	},
		      	{
		      		field: 'useByStr', 
		      		title: '使用人',
		      		align: 'center',
		      		formatter: function(value ,row, index){
	      	    		return row.useById==undefined?'-':'<a onclick="getUserStaffInfo('+row.useById+')">'+value+'</a>';
	      	    	}
		      	},
		      	{
		      		field: 'useTime', 
		      		title: '使用日期',
		      		align: 'center'
		      	},
		      	{
		      		field: 'approveStatus', 
		      		title: '审批状态', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'lastApprove', 
		      		title: '最后审批人', 
		      		align: 'center',
		      		formatter: function(value ,row, index){
	      	    		return row.lastApproveId==undefined?'-':'<a onclick="getUserStaffInfo('+row.lastApproveId+')">'+value+'</a>';
	      	    	}
		      	},
		      	{
		      		field: 'recycleStatusStr', 
		      		title: '回收状态',
		      		align: 'center'
		      	},
		      	{
		      		field: 'invoiceStatus', 
		      		title: '发票状态', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'isInvoice', 
		      		title: '可开发票', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'printCount',
		      		title: '打印张数', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'recycleCount', 
		      		title: '回收张数', 
		      		align: 'center'
		      	},
		      	{
		      		field: 'recycleMemo', 
		      		title: '回收备注',
		      		align: 'center'
		      	},
		      	{
		      		field: 'invoiceCode', 
		      		title: '发票编号', 
		      		align: 'center'
		      	}
			]
		});
	}
})