$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	dimContainer.buildDimChosenSelector($("#J_paymentType"), "financePayType","");
	dimContainer.buildDimChosenSelector($("#J_collectionSource"), "collectionSource","");
	dimContainer.buildDimChosenSelector($("#J_auditStatus"), "collectBatchAuditStatus","");
	// 显示所属部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'),$("#J_deptLevel"));
	});
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');		
		$("#J_payer").val('1');
		$('.J_chosen').trigger('chosen:updated');
		$('#J_deptLevel').val('');
	})	
	
	// 初始化审批时间
	var begindate = {
			elem: '#J_lastAuditTimeBegin',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    }
		}
	
	var enddate = {
			elem: '#J_lastAuditTimeEnd',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	
	var submitTimeBegin = {
			elem: '#J_submitTimeBegin',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	submitTimeEnd.min = datas;
		    	submitTimeEnd.start = datas
		    }
		}
	
	var submitTimeEnd = {
			elem: '#J_submitTimeEnd',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	submitTimeBegin.max = datas
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
	laydate(submitTimeBegin);
	laydate(submitTimeEnd);
	// 初始化录入人
	searchContainer.searchUserListByComp($("#J_createBy"), true);
	searchContainer.searchUserListByComp($("#J_lastAuditUserId"), true);
	
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/finance/collect/searchCollectBatch' });
		
	});
	
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/finance/collect/searchCollectBatch',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_collectform').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.groupid){
					o.groupid = encodeURI($("#J_deptName").attr("data-id"))
				}
				if(o.createBy){
					o.createBy = encodeURI($("#J_createBy").attr("data-id"))
				}
				if(o.lastAuditUserId){
					o.lastAuditUserId = encodeURI($("#J_lastAuditUserId").attr("data-id"))
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
				      	{field: 'batchId', title: '批次编码', align: 'center',
				      		formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		html='<a href="'+basePath+'/finance/collect/batchDetail.htm?batchId='+row.batchId+'" target="_blank">'+row.batchId+'</a>'
	 		      	    		return html;
	 		      	    	}
				      	},
				      	{field: 'collectionAmount', title: '收款金额', align: 'center'},
				      	{field: 'createByName', title: '录入人', align: 'center',
				      		formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		var createByName = row.createByName ? row.createByName : '-'
	 		      	    		html='<a onclick="getUserStaffInfo('+row.createBy+')">'+createByName+'</a>'
	 		      	    		return html;
	 		      	    	}
				      	},
				      	{field: 'createByPositionName', title: '岗位', align: 'center'},
				      	{field: 'deptName', title: '所属部门', align: 'center'},
				      	{field: 'auditSubmitTime', title: '提交日期', align: 'center'},
				      	{field: 'isFinanceAudit', title: '需要财务审批', align: 'center'},
				      	{field: 'auditStatusStr', title: '审批状态', align: 'center'},
				      	{field: 'lastAuditUserName', title: '最后审批人', align: 'center',
				      		formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		if(row.lastAuditUserName){
	 		      	    			html='<a onclick="getUserStaffInfo('+row.lastAuditUserId+')">'+row.lastAuditUserName+'</a>'
	 		      	    		}else{
	 		      	    			html='-'
	 		      	    		}
	 		      	    		return html;
	 		      	    	}
				      	},
				      	{field: 'lastAuditTime', title: '最后审批时间', align: 'center'},
				      	{field: '', title: '操作', align: 'center',
				      		formatter: function(value, row, index){
			      		    	var html = '';
			      		    	if((row.auditStatus=='4' || row.auditStatus=='5') && $('#quanxian').length>0){
			      		    		html +='<div class="text-left">';
				      	    			html += '<a type=\"edit\" class=\"btn btn-outline btn-success btn-xs\" target="_blank" href="../collect/batchEdit.htm?batchId='+row.batchId+'">编辑</a>&nbsp;&nbsp;'
				      	    		html += '</div>';
			      		    	}else{
			      		    		html +='-'
			      		    	}
			      		    	
			      	    		return html;
			      	    	}
				      	},
				      	
			],
		})
	}
})