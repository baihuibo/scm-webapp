$(function() {
	$("select").chosen({
		width : "100%"
	});
	$('#J_reset').on('click',function(){
		commonContainer.closeWindow();
	})
	//var businesstype = $('#J_dataTable input[name="invoiceType"]').data('businesstype');
	
	//初始化合同类型数据
	dimContainer.buildDimChosenSelector($("#J_businessType"), "businessType", "");
	//加载列表数据项
	$('#J_search').on('click', function(event) {
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/finance/choose/invoiceContract',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			singleSelect:true,		//设置单选
			clickToSelect:true,		//点击选中行
			striped:true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_query').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.list, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
	
			columns:[
			        {field: '', title :'选择', checkbox:true, align:'center',
			        	formatter: function(value, row, index){	
		           			var html='';
		           			html='<input type="hidden" name="invoiceType" data-businesstype="'+row.businessType+'" contract="'+row.contractId+'"/>';
		           			return html;
		           		}
			        },
		      	    {field: 'strBusinessType', title: '合同类型', align: 'center'},
		      	    {field: 'contractNumber', title: '合同编号', align: 'center',
		      	    	formatter: function(value, row, index) {	
		      				var html = '';
		      				var url = '';
		      				if (row.businessType == '1') {// 跳转到租赁详情
		      					url = basePath+"/sign/detail/detail.html?conId="+row.contractId+"&formal=true";
		      				} else if (row.businessType == '2') {// 跳转到买卖详情
		      					url = basePath+"/sign/signthecontract/contractdetail.htm?conId="+row.contractId;
		      				}
		      				html = '<a href="'+url+'" target="_blank">'+ row.contractNumber +'</a>';
		      				return html;
		      	    	}
		      	    },
		      	    {field: 'houseId', title: '房源编号', align: 'center',
		      	    	formatter: function(value, row, index) {	
		      				var html = '';
		      				var url = '';
		      				if (row.businessType == '1') {// 跳转到租赁详情
		      					url = basePath+"/house/main/leasedetail.htm?houseid="+row.houseId;
		      				} else if (row.businessType == '2') {// 跳转到买卖详情
		      					url = basePath+"/house/main/buydetail.htm?houseid="+row.houseId;
		      				}
		      				html = '<a href="'+url+'" target="_blank">'+ row.houseId +'</a>';
		      				return html;
		      	    	}
		      	    },
		      	    {field: 'clientId', title : '客户编号', align : 'center',
						formatter: function(value, row, index) {	
							var html = '';
							var url = '';
							if (row.businessType == '1') {// 跳转到租赁详情
								url = basePath+"/customer/main/findleaseclientbycustomerid.htm?customerId="+row.customerId;
							} else if (row.businessType == '2') {// 跳转到买卖详情
								url = basePath+"/customer/main/findbuyerclientbycustomerid.htm?customerId="+row.customerId;
							}
							html = '<a href="'+url+'" target="_blank">'+ row.clientId +'</a>';
							return html;
						}
		      	    },
		      	    {field: 'ownerName', title: '业主名称', align: 'center'},
		      	    {field: 'clientName', title: '客户名称', align: 'center'},
			      	{field: 'createTime', title: '录入日期', align: 'center'},
			      	{field: 'trancedByName', title: '成交人', align: 'center'},
			      	{field: 'deptName', title: '所属部门', align: 'center'}
		      	],
		})
	
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/finance/choose/invoiceContract' });
	});
	
	//下一步填写合同信息跳转
	$('#J_nextstep').on('click',function(){
		
		var validArr = [];
		$("input[name='btSelectItem']:checked").each(function(){
			validArr.push($(this).next().attr("contract"));
		})
		
		if(validArr.length == 0) {
			layer.alert("请选择合同信息");
			return false;
		}
	
		var checkrowDataArr=$("#J_dataTable").bootstrapTable('getSelections');
		if(checkrowDataArr.length>0 && checkrowDataArr[0].contract!=''){
			window.open(basePath+"/finance/invoice/choosecontract.html?contractNo="+validArr);
		}else{
			layer.alert("请选择合同信息");
			return false;
		}
	})
})
