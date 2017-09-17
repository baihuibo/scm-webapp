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
	searchContainer.searchUserListByComp($("#J_lastAuditBy"), true,'right');
	dimContainer.buildDimChosenSelector($("#J_auditStatus"), "receiptReturnAuditStatus","");
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
	
	
	// 初始化审批日期
	var auditTimeBegin = {
			elem: '#J_auditTimeBegin',
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    }
		}
	
	var auditTimeEnd = {
			elem: '#J_auditTimeEnd',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	
	laydate(auditTimeBegin);
	laydate(auditTimeEnd);

	
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/finance/collect/selectReceiptReturn' });
		
	});
	
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/finance/collect/selectReceiptReturn',
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
			      				html = '<a href="../receipt/returnDetail.htm?returnBatchId='+row.returnBatchId+'" target="_blank">'+returnBatchId+'</a>';
			      				return html;
			      	    	}
				      	},
				      	{field: 'amount', title: '回收金额', align: 'center'},
				      	{field: 'createTime', title: '提交日期', align: 'center'},
				      	{field: 'createByDeptName', title: '所属部门', align: 'center'},
				      	{field: 'statusStr', title: '审批状态', align: 'center'},
				      	{field: 'lastAuditByName', title: '最后审批人', align: 'center',
				      		formatter: function(value ,row, index){
	 		      	    		return value?'<a onclick="getUserStaffInfo('+row.lastAuditBy+')">'+value+'</a>':'-';
	 		      	    	}
				      	},
				      	{field: 'auditPostionName', title: '岗位', align: 'center'},
				      	{field: 'lastAuditTime', title: '最后审批时间', align: 'center'},
				      	{field: '', title: '审批历史', align: 'center',
				      		formatter: function(value, row, index) {
			      		    	var html = '';
			      		    	html +='<div class="text-left">';
			      	    		html += '<a type=\"check\" class=\"btn btn-outline btn-success btn-xs\" href="'+basePath+'/finance/receipt/returnAuditLog.htm?returnBatchId='+row.returnBatchId+'" target="_blank">查看</a>';
			      	    		html += '</div>';
			      	    		return html;
			      	    	}
				      	},
			],
		})
	}
})