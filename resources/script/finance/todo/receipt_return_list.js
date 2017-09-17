$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	// 显示所属部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'),$("#J_deptLevel"));
	});
	$('#J_reset').on('click', function(event) {
		$('#J_deptLevel').val('');
	})
	
	// 初始化提交人
	searchContainer.searchUserListByComp($("#J_createBy"), true,'right');
	
	// 初始化录入日期
	var begindate = {
			elem: '#J_createTimeBegin',
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    }
		}
	
	var enddate = {
			elem: '#J_createTimeEnd',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
	
	
	jQuery('#J_search').on('click', function(event){
		initListLoad();
	});
	
	function initListLoad(){
		$('#J_dataTable').bootstrapTable('destroy').bootstrapTable({ 
			url:basePath + '/finance/todo/getReceiptReturnList',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_returnform').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.createBy){
					o.createBy = encodeURI($("#J_createBy").attr("data-id"))
				}
				if(o.lastAuditBy){
					o.lastAuditBy = encodeURI($("#J_lastAuditBy").attr("data-id"))
				}
				if(o.groupid){
					o.groupid = encodeURI($("#J_deptName").attr("data-id"))
				}
				if(o.createTimeBegin) {o.createTimeBegin = encodeURI(o.createTimeBegin);}
				if(o.createTimeEnd) {o.createTimeEnd = encodeURI(o.createTimeEnd);}
				if(o.auditTimeBegin) {o.auditTimeBegin = encodeURI(o.auditTimeBegin);}
				if(o.auditTimeEnd) {o.auditTimeEnd = encodeURI(o.auditTimeEnd);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.list, "total": result.data.totalcount}
				}
				return { "rows": [], "total": 0 } 
			},
			columns:[
				      	{title: '序号', align: 'center',
				      		formatter: function (value, row, index) {  
	                            return index+1;  
	                        }  
				      	},
				      	{field: 'returnBatchId', title: '回收申请编号', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var returnBatchId = row.returnBatchId ? row.returnBatchId : '-'
			      				html = '<a href="'+basePath+'/finance/receipt/returnDetail.htm?returnBatchId='+row.returnBatchId+'" target="_blank">'+returnBatchId+'</a>';
			      				return html;
			      	    	}
				      	},
				      	{field: 'amount', title: '回收金额', align: 'center'},
				      	{field: 'createTime', title: '提交日期', align: 'center'},
				      	{field: 'createByDeptName', title: '所属部门', align: 'center'},
				      	{field: 'statusStr', title: '审批状态', align: 'center'},
				      	{field: 'lastAuditByName', title: '最后审批人', align: 'center',
				      		formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		var lastAuditByName=row.lastAuditByName ?row.lastAuditByName:'-'
	 		      	    		html='<a onclick="getUserStaffInfo('+row.lastAuditBy+')">'+lastAuditByName+'</a>'
	 		      	    		return html;
	 		      	    	}
				      	},
				      	{field: 'auditPostionName', title: '岗位', align: 'center'},
				      	{field: 'lastAuditTime', title: '最后审批时间', align: 'center'},
				      	{field: 'opt', title: '操作', align: 'center',
				      		formatter: function(value, row, index) {
				      			var returnBatchId = row.returnBatchId ? row.returnBatchId : '-'
				      			var html = '<a href="'+basePath+'/finance/receipt/returnDetail.htm?returnBatchId='+row.returnBatchId+'" class="btn btn-outline btn-success btn-xs" target="_blank">审核</a>';
			      	    		return html;
			      	    	}
				      	}
			],
		})
	}
})