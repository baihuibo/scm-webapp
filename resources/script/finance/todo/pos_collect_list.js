$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	// 显示所属部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'),$("#J_deptLevel"));
	});
	
	// 初始化银行名称
	selectBank.selectBankByPay($("#J_chequeCheckinName"), "4","");
	
	// 初始化录入人
	searchContainer.searchUserListByComp($("#J_createBy"), true);
	
	// 初始化申请日期
	var begindate = {
			elem: '#J_createTimeStart',
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
	
	// 初始化收款日期
	var begindate = {
			elem: '#J_paymentTimeStart',
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    }
		}
	
	var enddate = {
			elem: '#J_paymentTimeEnd',  
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
			url:basePath + '/finance/todo/getPosCollectList',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_audittform').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.groupid){
					o.groupid = encodeURI($("#J_deptName").attr("data-id"))
				}
				if(o.createBy){
					o.createBy = encodeURI($("#J_createBy").attr("data-id"))
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
				      	{title: '序号', align: 'center',
				      		formatter: function (value, row, index) {  
	                            return index+1;  
	                        } 
				      	},
				      	{field: 'auditNo', title: '查账编号', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var auditNo = row.auditNo ? row.auditNo : '-';
			      				html = '<a href="../audit/detail.htm?collectionId='+row.auditNo+'" target="_blank">'+auditNo+'</a>';
			      				return html;
			      	    	}
				      	},
				      	{field: 'batchId', title: '收款批次', align: 'center'},
				      	{field: 'paymenyTypeStr', title: '支付方式', align: 'center'},
				      	{field: 'paymentTime', title: '支付日期', align: 'center',
				      		formatter: function(value) {	
		      				return value ? value.split(' ')[0]:'';
		      	    	}},
				      	{field: 'payeeAccountName', title: '收款银行', align: 'center'},
				      	{field: 'payeeAccountNo', title: '银行卡号', align: 'center'},
				      	{field: 'payerAccountNo', title: '支票号', align: 'center'},
				      	{field: 'amount', title: '收款金额', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var amount = row.amount ? row.amount : '-'
			      				html = '<div class="text-right">'+amount+'</div>';
			      				return html;
			      	    	}
				      	},
				      	{field: 'auditStatusName', title: '查账状态', align: 'center'},
				      	{field: 'belongDeptName', title: '所属部门', align: 'center'},
				      	{field: 'createByName', title: '申请人<br>申请日期', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var createByName = value?'<a onclick="getUserStaffInfo('+row.createBy+')">'+value+'</a>': '-';
			      				var createTime = row.createTime ? row.createTime : '-'
			      				html = createByName+'</br>'+createTime;
			      				return html;
			      	    	}
				      	},
				      	{field: 'auditByName', title: '审核人', align: 'center',
				      		formatter: function(value, row, index) {	
			      				return value?'<a onclick="getUserStaffInfo('+row.auditBy+')">'+value+'</a>':'-';
			      	    	}
				      	},
				      	{field: 'updateByName', title: '回复人<br>回复时间', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var updateByName = value ? '<a onclick="getUserStaffInfo('+row.updateBy+')">'+value+'</a>' : '-'
			      				var updateTime = row.updateTime ? row.updateTime : '-'
			      				html =  updateByName+'</br>'+updateTime;
			      				return html;
			      	    	}
				      	},
				      	{field: 'opt', title: '操作', align: 'center',
		                    formatter: function (value, row, index) {
		                    	var auditNo = row.auditNo ? row.auditNo : '-';
		                        var html = '<a href="'+basePath+'/finance/audit/detail.htm?collectionId='+row.auditNo+'" class="btn btn-outline btn-success btn-xs" target="_blank">审批</a>';
		                        return html;
		                    }
		                }
			],
		})
	}
})


/**
 * 银行名称下拉框
 **/
window.selectBank = {
		getDimReqUrl: function() {
			return basePath + '/finance/collect/selectBankByPayType';
		},
		selectBankByPay: function($container, keyCode, selectedValues) {
			// 初始化chosen控件
			commonContainer.initChosen($container);

			var that = this;
		    var options = [];
		    jsonGetAjax(that.getDimReqUrl(), {'payType':keyCode}, function(result) {
	    		$.each(result.data, function(n, value) {
	    	    	options.push('<option value="' + value.accountId + '">' + value.bankName + '</option>');
	    	    })
	    	    $container.append(options);

	    		var selectedValueArr = selectedValues.split(',');
	    		$container.val(selectedValueArr);
	    		$container.trigger("chosen:updated");
			})
		},
	}

