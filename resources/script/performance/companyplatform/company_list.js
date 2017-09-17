$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	});
	//dimContainer.buildDimCheckBox($("#J_approveState"), "approveState", "approveState", "");
	//dimContainer.buildDimCheckBoxHasAll($("#J_approveState"), "approveState", "approveState", "all",'全部');
	//dimContainer.buildDimCheckBoxHasAll($("#J_houseappraise"), "approveState", "approveState", "1,2",'全部');
	//dimContainer.buildDimCheckBoxHasAll($("#J_approveState1"), "approveState", "approveState", "1",'全部');
	// 初始化所属人
	// 模糊查询
	searchContainer.searchUserListByComp($("#J_user"), true, 'right');
	searchContainer.searchUserListByComp($("#J_user1"), true, 'right');
	$('#J_reset_buy').on('click', function(event) {
		$('.J_chosen').val('');		
		$("#datetype").val('1');
		$('.J_chosen').trigger('chosen:updated'); 
		$('#J_deptLevel').val('');
		$('#J_contractNo').val('');
		$("#J_business").val('')
		enddate.min='';
		enddate.start='';
		begindate.max='';
	})	
	$('#J_reset_buy1').on('click', function(event) {
		$('.J_chosen').val('');		
		$("#datetype").val('1');
		$('.J_chosen').trigger('chosen:updated'); 
		$('#J_deptLevel').val('');
		$('#J_contractNo').val('');
		$("#J_business").val('')
		enddate1.min='';
		enddate1.start='';
		begindate1.max='';
	})	

	  // 显示部门树状结构
	/*$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'), $('#J_deptLevel'));
	});*/
	searchDept($("#J_deptName"),true ,'left').then(function(){
		$('#J_deptSelect').off().on('click', function(e) {
			showDeptTree($('#J_deptName'),$('#J_level_id'));
		})
	})
    /*$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'),$('#J_level_id'));
	});*/

	  // 显示部门树状结构
	searchDept($("#J_deptName1"),true ,'left').then(function(){
		$('#J_deptSelect1').off().on('click', function(e) {
			showDeptTree($('#J_deptName1'),$('#J_level_id1'));
		})
	})
	/*$('#J_deptSelect1').on('click', function() {
		showDeptTree($('#J_deptName1'),$('#J_level_id1'));
	});*/

	// 初始化录入日期
	var begindate = {
			elem: '#J_begindate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    isclear: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    },
		}
	
	var enddate = {
			elem: '#J_enddate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    isclear: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
	// 初始化录入日期
	var begindate1 = {
			elem: '#J_begindate1',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    isclear: false,
		    choose: function(datas){
		    	enddate1.min = datas;
		    	enddate1.start = datas
		    },
		}
	
	var enddate1 = {
			elem: '#J_enddate1',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    isclear: false,
		    choose: function(datas){
		    	begindate1.max = datas
		    }
		}
	
	laydate(begindate1);
	laydate(enddate1);
	jQuery('#J_search').on('click', function(event){	
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/applyTask/getPerfApply'});	
	});
	
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/perf/applyTask/getPerfApply',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_black_form').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.begindate) {o.begindate = encodeURI(o.begindate);}
				if(o.enddate) {o.enddate = encodeURI(o.enddate);}
				if(o.groupid){
					o.groupid = encodeURI($("#J_deptName").attr("data-id"))
				}
				/*if(o.belonguserid){
					o.belonguserid = encodeURI($("#J_user").attr("data-id"))
				}*/
				if(o.createBy){
					o.createBy = encodeURI($("#J_user").attr("data-id"))
				}
				if(o.level==1){
					o.belongShoparea = encodeURI($("#J_deptName").attr("data-id"));
				}else if(o.level==2){
					o.belongShopgroup = encodeURI($("#J_deptName").attr("data-id"))
				}else if(o.level==3){
					o.belongShop = encodeURI($("#J_deptName").attr("data-id"))
				}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.rows, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
			columns:[			         
			      	    {field:'applyNo', title: '申请编号', align: 'center',
			      	    	formatter: function(value, row, index) {
			      				var html = '';
			      				var url = '';
			      				/*url = basePath+'/perf/applyTask/toDetails.htm?applyNo='+row.applyNo;*/
			      				url = basePath+'/perf/applyTask/toDetails.htm?applyNo='+row.applyNo+'&businessType='+row.businessType+'&contractId='+row.contractId+'&companyId='+row.companyId;
			      				html = '<a href="'+url+'&contractNo='+row.contractNo+'&isdetail=true"  id="order-btn" target="_blank">'+ row.applyId+'</a>';
			      				return html;
			      	    	}
			      	    },
			      	  {field:'businessType', title: '业务类型', align: 'center',
			      	    	formatter: function(value, row, index) {
			      	    		if(row.businessType=="0"){
			      	    			return '<div data-id="'+row.companyId+'" data-id1="'+row.contractId+'">全部</div>'
			      	    		}else if(row.businessType=="1"){
			      	    			return '<div data-id="'+row.companyId+'" data-id1="'+row.contractId+'">普租</div>'
			      	    		}else{
			      	    			return '<div data-id="'+row.companyId+'" data-id1="'+row.contractId+'">二手买卖</div>'
			      	    		}
			      	    	}
			      	    },
			      	    {field:'contractNo', title: '合同编号', align: 'center',
			      	    	formatter: function(value, row, index) {
			      				var html = '';
			      				var url = '';
			      				url = basePath+'/performance/toContractPerfDetail.html?contractId='+row.contractId+ '&companyId='+row.companyId+'&businessType='+row.businessType;
			      				html = "<a href="+url+" id='order-btn' target='_blank'>"+ row.contractNo +"</a>";
			      				return html;
			      	    	}	
			           	},
			      	    {field:'approveState', title: '审批状态', align: 'center',
			           		formatter: function(value, row, index) {
		      	    		if(row.approveState=="1"){
		      	    			return '<div>待审批</div>'
		      	    		}else if(row.approveState=="2"){
		      	    			return '<div>审批中</div>'
		      	    	    }else if(row.approveState=="3"){
		      	    			return '<div>已通过</div>'
		      	    	      }else if(row.approveState=="4"){
		      	    			return '<div>待调整</div>'
		      	    	      }else if(row.approveState=="5"){
		      	    			return '<div>已驳回</div>'
		      	    	      }else if(row.approveState=="6"){
		      	    			return '<div>已撤销</div>'
		      	    	      }else if(row.approveState=="7"){
		      	    			return '<div>已提交</div>'
		      	    	      }else if(row.approveState=="8"){
		      	    			return '<div>已审批</div>'
		      	    	      }
		      	    	   }
			      	    },
			      	    {field:'compensateAmount', title: '公司平台补业绩金额', align: 'center'},
			      	    {field:'createTime', title: '申请时间', align: 'center',
			      	    },
			      	    {field:'userName', title: '申请人', align:'center',
			      	    },
			      	    {field:'mome', title: '申请备注', align:'center', 	
			           	},
			           	{field:'isRunning', title: '操作', align: 'center',
			           		formatter : function(value, row, index) {
								var html = '';
								if (row.isRunning) {
									html += '<div class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" id="button">撤销</div>'
								}
								return html;
							}
			           	}
			      	],
		})
	}
	/*
	 * （撤销）
	 * 我申请的*/
	$(document).delegate('#button','click',function(event) {
						var contractNo = $(this).parent().parent().children().eq(1).children().text();
						var mem = $("#mem").val();
						var applyId = $(this).parent().parent().children().eq(0).children().attr("applyId");
						$(".title_contractNo").text('确定撤销合同编号为：' + contractNo+ '的成交人业绩调整申请？如确认撤销，请说明原因')
						layer.open({
									title : ' ',
									type : 1,
									shift : 1,
									skin : 'layui-layer-lan layui-layer-no-overflow',
									zIndex : 10,
									content : $('#demo_layer_stantard'),
									area : [ '360px', '300px' ],
									btn : [ '确认', '取消' ],
									yes : function(index, layero) {
										$.ajax({
													url : basePath+ "/perf/authorize/updatePerfApply",
													type : 'post',
													async : true,
													cache : false,
													dataType : 'json',
													contentType : 'application/json;charset=UTF-8',
													data : JSON.stringify({
																"applyId" : applyId,
																"memo":mem,
																"approveState":"5",
																"delFlag":"1"
															}),
													success : function(result) {
														layer.closeAll()
														$('#dataTable').bootstrapTable('refresh',{url : basePath+ '/perf/applyManage/perfoApplyDetail'});
													}
												})
									}
								});
					});

	jQuery('#J_search1').on('click', function(event){	
		initListLoad1();
		$('#J_dataTable1').bootstrapTable('refresh',{ url: basePath + '/perf/applyTask/getPerfApplyTask'});
		
	});
	
	function initListLoad1(){
		$('#J_dataTable1').bootstrapTable({ 
			url:basePath + '/perf/applyTask/getPerfApplyTask',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_black_form1').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.createBy){
					o.createBy = encodeURI($("#J_user1").attr("data-id"))
				}
				if(o.level==1){
					o.belongShoparea = encodeURI($("#J_deptName1").attr("data-id"));
				}else if(o.level==2){
					o.belongShopgroup = encodeURI($("#J_deptName1").attr("data-id"))
				}else if(o.level==3){
					o.belongShop = encodeURI($("#J_deptName1").attr("data-id"))
				}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) { 
					return { "rows": result.data.rows, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
			columns:[			         
			      	    {field:'applyNo', title: '申请编号', align: 'center',
			      	    	formatter: function(value, row, index) {
			      				var html = '';
			      				var url = '';
			      				url = basePath+'/perf/applyTask/toDetails.htm?applyNo='+row.applyNo+'&businessType='+row.businessType+'&contractId='+row.contractId+'&companyId='+row.companyId;
			      				html = "<a href="+url+"&isdetail=true id='order-btn' target='_blank'>"+ row.applyId +"</a>";
			      				return html;
			      	    	}	
			      	    },
			      	  {field:'businessType', title: '业务类型', align: 'center',
			      	    	formatter: function(value, row, index) {
			      	    		if(row.businessType=="0"){
			      	    			return '<div data-id="'+row.companyId+'" data-id1="'+row.contractId+'">全部</div>'
			      	    		}else if(row.businessType=="1"){
			      	    			return '<div data-id="'+row.companyId+'" data-id1="'+row.contractId+'">普租</div>'
			      	    		}else{
			      	    			return '<div data-id="'+row.companyId+'" data-id1="'+row.contractId+'">二手买卖</div>'
			      	    		}
			      	    	}
			      	    	
			      	    },
			      	    {field:'contractNo', title: '合同编号', align: 'center',
			      	    	formatter: function(value, row, index) {
			      				var html = '';
			      				var url = '';
			      				/*url = basePath+'/performance/toContractPerfDetail.html?contractId=25';*/
			      				url = basePath+'/performance/toContractPerfDetail.html?contractId='+row.contractId+ '&companyId='+row.companyId+'&businessType='+row.businessType;
			      				html = "<a href="+url+" id='order-btn' target='_blank'>"+ row.contractNo+"</a>";
			      				return html;
			      	    	}	
			           	},
			      	    {field:'approveState', title: '审批状态', align: 'center',
			           		formatter: function(value, row, index) {
			      	    		if(row.approveState=="1"){
			      	    			return '<div>待审批</div>'
			      	    		}else if(row.approveState=="2"){
			      	    			return '<div>审批中</div>'
			      	    	    }else if(row.approveState=="3"){
			      	    			return '<div>已通过</div>'
			      	    	      }else if(row.approveState=="4"){
			      	    			return '<div>待调整</div>'
			      	    	      }else if(row.approveState=="5"){
			      	    			return '<div>已驳回</div>'
			      	    	      }else if(row.approveState=="6"){
			      	    			return '<div>已撤销</div>'
			      	    	      }else if(row.approveState=="7"){
			      	    			return '<div>已提交</div>'
			      	    	      }else if(row.approveState=="8"){
			      	    			return '<div>已审批</div>'
			      	    	      }
			      	    	   }
			      	    },
			      	    {field:'compensateAmount', title: '公司平台补业绩金额', align: 'center'},
			      	    {field:'createTime', title: '申请时间', align: 'center',
			      	    },
			      	    {field:'userName', title: '申请人', align:'center',
			      	    },
			      	    {field:'mome', title: '申请备注', align:'center',
			      	    	formatter : function(value, row, index) {
								var html='';
								if(row.mome==undefined){
									html="-";
									return html;
								}else{
									return html='<div class="remark_all" style="white-space:normal; word-break:break-all;">'+value+'</div>';
								}
								
							}
			           	},
			           	{field:'isRunning', title: '操作', align: 'center',
			      	    	formatter: function(value, row, index) {
			      	    		var html = '';
			      	    		if(row.isRunning=="0"){
			      	    		 html = '<a target="_blank" href="'+row.todoUrl+'&applyNo='+row.applyNo+'&contractId='+row.contractId+'&businessType='+row.businessType+'&companyId='+row.companyId+'" class="text-left btn btn-xs btn-success">审批</a>';	
			      	    		}else{
			      	    			 html = '';
			      	    		}
			      				return html;
			      	    	}
			           	}
			      	
			      	],
		})
	}	
})	