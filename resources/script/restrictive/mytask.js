/*$(function(){	
	$('#J_dataTable').bootstrapTable({ 
		url:basePath + '/restrictive/mytask/agency',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = jQuery('#J_reasionform').serializeObject();
			o.currentPageIndex = params.offset / params.limit+ 1,
			o.pageSize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.recordTotal> 0) {
				return { "rows": result.data.records, "total": result.data.recordTotal }
			}
			return { "rows": [], "total": 0} 
		},
			columns:[	         
		      	    {field: 'id', title: '信息编号', align: 'center',},
		      	    {field: 'userName ', title: '姓名', align: 'center'},
		      	    {field: 'customerType', title: '客户类型', align: 'center',},
		      	    {field: 'businessType', title: '业务类型',  align: 'center'},
		      	    {field: 'reason', title: '上榜原因',  align: 'center'},
		      	    {field: 'state', title: '状态',  align: 'center'},
		      	    {field: 'equityTypeName', title: '操作', align: 'center'},
		      	],//data : tableData,
				pagination: true
	})
	
	$('#J_dataTable').bootstrapTable({ 
		url:basePath + '/restrictive/mytask/agency',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			return {
				userid:currUserId,								//用户ID
				querytype: 2,									//查询类型 1：房源收钥匙     2：钥匙转店
				onepage: 1,										//是否分页查询 0:不分页，其他:分页
				pageindex:(params.offset / params.limit+ 1),	//当前页数
				pagesize:params.limit							//每页显示数量
			}
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.recordTotal> 0) {
				return { "rows": result.data.records, "total": result.data.recordTotal }
			}
			return { "rows": [], "total": 0} 
		},
			columns:[	         
		      	    {field: 'id', title: '信息编号', align: 'center',},
		      	    {field: 'userName ', title: '姓名', align: 'center'},
		      	    {field: 'customerType', title: '客户类型', align: 'center',},
		      	    {field: 'businessType', title: '业务类型',  align: 'center'},
		      	    {field: 'reason', title: '上榜原因',  align: 'center'},
		      	    {field: 'state', title: '状态',  align: 'center'},
		      	    {field: 'operateDate', title: '操作时间', align: 'center'},
		      	],//data : tableData,
				pagination: true
	})
});*/

$(function(){
	try {
		
		findPermission('SCM:HOUSE:RESTRICTIVE_MYTASK:MANAGER');
	}catch (e) {
		
	}
	storekeyending.init();
});
var storekeyending={	
	init:function(){
		
		this.creatorTab();
	},

	//创建Dom
	creatorTab:function(){
		var _this=this;
		//待处理任务
		$('#dataTable').bootstrapTable('destroy');	//清除之前的数据
		$('#dataTable').bootstrapTable({
			url: basePath+'/restrictive/mytask/findpageexcusingnodes',
			//设置为服务器分页
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			method : 'post',
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var o ={};
				
//				o.timestamp = new Date().getTime();
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				return o;
			},
			responseHandler: function(result) {
				//alert(1)
				console.log(result);
				//设置为bootstrap table能接收的格式
				if(result.code == 0 && result.data && result.data.recordTotal> 0) {
					//_this.records=result.data.records;
					return { "rows": result.data.records, "total": result.data.recordTotal }
				}
				return { "rows": [], "total": 0} 
			},
			columns:[	         
			      	    {field: 'restrictiveId', title: '信息编号', align: 'center',
			      	    	formatter: function(value, row, index){	
			      				var html='';
			      				html='<a target="_blank" href="../viewrestrictives.htm?id='+row.restrictiveId+'">'+row.restrictiveId+'</a>';
			      				return html;
			      	    	}
			      	    },
			      	    {field: 'customerName', title: '姓名', align: 'center'},
			      	    {field: 'customerTypeName', title: '客户类型', align: 'center',},
			      	    {field: 'businessTypeName', title: '业务类型',  align: 'center'},
			      	    {field: 'reasonDisplay', title: '上榜原因',  align: 'center',
			      	    	formatter:function(value){
								return '<div style="text-align:left;" class="remark_all">'+value+'</div>';
							}
			      	    },
			      	    {field: 'restrictiveStateName', title: '状态',  align: 'center'},
			      	    //{field: 'restrictiveStateName', title: '操作', align: 'center'},
			      	    {field: 'restrictiveStateName', title: '操作', align: 'center',
			      	    	formatter: function(value, row, index){	
			      	    		var html='';
			      				//console.log(row)
			      				if(row.restrictive.isCanApproval){
			      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/approvalrestrictive.htm?id='+row.id+'&reid='+row.restrictiveId+'">审批</a>&nbsp;&nbsp;'
			      				}
			      				if(row.restrictive.isCanAssign){
			      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/assignrestrictive.htm?restrictiveId='+row.restrictiveId+'">分派</a>&nbsp;&nbsp;'
			      				}
			      				if(row.restrictive.isCanEdit){
			      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/editrestrictive.htm?id='+row.restrictiveId+'">修改</a>&nbsp;&nbsp;'
			      				}
			      				if(row.restrictive.isCanCancel){
			      					html+='<a type=\"repeal\" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs cancel">撤销</a>&nbsp;&nbsp;'
			      				}
			      				if(row.restrictive.isCanLockedEdit){
			      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/editagainrestrictive.htm?id='+row.restrictiveId+'">修改</a>&nbsp;&nbsp;'
			      				}
			      				if(row.restrictive.isCanRecord){
			      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs"  href="../../restrictive/recordrestrictive.htm?id='+row.restrictiveId+'">备案</a>&nbsp;&nbsp;'
			      				}
			      				if(row.restrictive.isCanSubmitAgain){
			      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/editrestrictive.htm?id='+row.restrictiveId+'">修改</a>&nbsp;&nbsp;'
			      				}
			      				if(row.restrictive.isCanCheck){
			      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs"  href="../../restrictive/checkrestrictive.htm?restrictiveId='+row.restrictiveId+'">核查</a>'
			      				}
			      				
			      				return html;
			      				/*var html='';
			      				var nodeStateId=row.nodeStateId;
			      				var restrictiveId=row.restrictiveId;
			      				if(nodeStateId==2){
			      					html+='<a type=\"amend\" target="_self" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/approvalrestrictive.htm?id='+row.id+'&reid='+row.restrictiveId+'">审批</a>&nbsp;&nbsp;';
			      				}else if(nodeStateId==5){
			      					var lockId=row.lockId;
			      					if(lockId==1){//不解锁
			      						html+='<a type=\"amend\" target="_self" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/editrestrictive.htm?id='+row.restrictiveId+'">修改</a>&nbsp;&nbsp;';
			      						html+='<a type=\"repeal\" id="cancle" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs cancel">撤销</a>&nbsp;&nbsp;'+
			      						'<input type="hidden" name="customerType" restrictiveId="'+restrictiveId+'">';
			      					}else{
			      						html+='<a type=\"amend\" target="_self" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/editagainrestrictive.htm?id='+row.restrictiveId+'">修改</a>&nbsp;&nbsp;';
				      							
			      					}
			      					
			      				}else if(nodeStateId==8){
			      					html+='<a type=\"amend\" target="_self" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/assignrestrictive.htm?restrictiveId='+row.restrictiveId+'">分派</a>&nbsp;&nbsp;';
		      						
			      				}
			      				else if(nodeStateId==10){
			      					html+='<a type=\"amend\" target="_self" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/checkrestrictive.htm?id='+row.restrictiveId+'">核查</a>&nbsp;&nbsp;';
		      						
			      				}else if(nodeStateId==12){
			      					html+='<a type=\"amend\" target="_self" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../../restrictive/recordrestrictive.htm?id='+row.restrictiveId+'">备案</a>&nbsp;&nbsp;';
		      						
			      				}
			      				return html;*/
			      		
			      	    	},}
			      	]
		});
		//已处理任务
		$('#dataTable2').bootstrapTable('destroy');	//清除之前的数据
		$('#dataTable2').bootstrapTable({
			url: basePath+'/restrictive/mytask/findpageexcusednodes',
			//设置为服务器分页
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			method : 'post',
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var o ={};
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				return o;
			},
			responseHandler: function(result) {
				console.log(result);
				//设置为bootstrap table能接收的格式
				if(result.code == 0 && result.data && result.data.recordTotal> 0) {
					//_this.records=result.data.records;
					return { "rows": result.data.records, "total": result.data.recordTotal }
				}
				return { "rows": [], "total": 0} 
			},
			columns:[	         
			      	    {field: 'restrictiveId', title: '信息编号', align: 'center',
			      	    	formatter: function(value, row, index){	
			      				var html='';
			      				html='<a target="_blank" href="../viewrestrictives.htm?id='+row.restrictiveId+'">'+row.restrictiveId+'</a>';
			      				return html;
			      	    	}
			      	    },
			      	    {field: 'customerName', title: '姓名', align: 'center'},
			      	    {field: 'customerTypeName', title: '客户类型', align: 'center',},
			      	    {field: 'businessTypeName', title: '业务类型',  align: 'center'},
			      	    {field: 'reasonDisplay', title: '上榜原因',  align: 'center',
			      	    	formatter:function(value){
								return '<div style="text-align:left;max-width:500px;" class="remark_all">'+value+'</div>';
							}
			      	    },
				      	{field: 'restrictiveStateName', title: '审批状态',  align: 'center'},
					    //{field: 'nodeStateName', title: '操作',  align: 'center'},
			      	    {field: 'approvalTime', title: '操作时间', align: 'center'},
			      	]
		});
	},

}
//overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
//绑定事件
$(document).delegate(
		'#cancle',
		'click',
	      function(index){
			var num=$(this).next().attr("restrictiveid");
			//alert(num)
			//layer.alert('确认执行撤销操作吗')
			commonContainer.confirm(
					'确定执行撤销操作吗？',
					function(index, layero){
						var data={};
						
						data.id=num;
						$.ajax({
			    			url: basePath+'/restrictive/cancelrestrictive',
			    		    type: 'POST',
			    		    contentType : 'application/json;charset=UTF-8',
			    		    data:JSON.stringify(data),
			    		    dataType:'json',
			    		    success:function(result){
			    		    	//alert(housesId)
			    	    		console.log(result);
			    	    		//console.log(result.msg);
			    	    		console.log(result.code);
			    	    		if(result.code==1){
			    	    			layer.alert(result.data.describe);
			    	    		}else if(result.code==0){
			    	    			$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/restrictive/mytask/findpageexcusingnodes' });
			    	    			layer.msg("操作成功");
			    	    			//commonContainer.closeWindow()
			    	    			//window.opener.location.href = window.opener.location.href;
			    	    		}else{
			    	    			layer.alert(errorMsg);
			    	    		}
			    	    		
			    		    },
			    		    error:function(){
			    		    	layer.alert(errorMsg);
								//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
			    	    	}
			    		});	
						layer.close(index);
						/*$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/restrictive/findpagerestrictives' });
						layer.msg("操作成功");*/
					}
				)

		}    
	
		
);