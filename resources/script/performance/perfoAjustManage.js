$(function() {
	$("select").chosen({
		width : "100%",
		no_results_text : "未找到此选项!"
	})
	jQuery('#J_search').on('click', function(event) {
		initListLoad();
		$('#dataTable').bootstrapTable('refresh', {url : basePath + '/perf/authorize/perfoApplyDetail'});
		
	});
	jQuery('#J_search1').on('click', function(event) {
		initListLoad2();
		$('#dataTable2').bootstrapTable('refresh', {url : basePath + '/perf/authorize/perfoApproveDetail'});
		
	});

})

	/*
	 * 我申请的
	 */
	 initListLoad();
	function initListLoad() {
		$('#dataTable').bootstrapTable({
							url : basePath+ '/perf/authorize/perfoApplyDetail',
							sidePagination : 'server',
							dataType : 'json',
							method : 'post',
							pagination : true,
							striped : true,
							pageSize : 10,
							pageList : [ 10, 20, 50 ],
							queryParams : function(params) {
								var o = jQuery('#J_restrictiveform').serializeObject();
								o.timestamp = new Date().getTime(),
								o.pageindex = params.offset/ params.limit + 1,
								o.pagesize = params.limit;
								if(o.starttime) {o.starttime = encodeURI(o.starttime);}
								if(o.endtime) {o.endtime = encodeURI(o.endtime);}
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
							responseHandler : function(result) {
								if (result.code == 0 && result.data&& result.data.totalcount > 0) {
									return {"rows" : result.data.rows,"total" : result.data.totalcount
									}
								}
								return {"rows" : [],"total" : 0}
							},
							columns : [
									{
										field : 'applyId',
										title : '申请单编号',
										align : 'center',
										formatter : function(value, row, index) {
											var formId=row.applyNo;
											formId = formId.split("-")[1];
											var html = '';
											html = '<a target="_blank" href="/sales/perf/authorize/perfoEpowManagedetail.htm?formId='+formId+'">'+ value+ '</a>';
											return html;
										}
									},
									{
										field : 'contractNo',
										title : '合同编号',
										align : 'center',
										formatter : function(value, row, index) {
											if(row.businessType==2){
												var html = '';
												html = '<a target="_blank" href="/sales/sign/signthecontract/contractdetail.htm?conId='+ row.contractID+ '">'+ value+ '</a>';;
												return html;
											}else{
												return '<a target="_blank" href="/sales/sign/detail/detail.html?conid='+ row.contractID+ '&formal=true">'+ value+ '</a>';
											}									
										}
									},
									{
										field : 'businessType',
										title : '业务类型',
										align : 'center',
										formatter : function(value, row, index) {
											if(row.businessType==1){
												return '<div businessType="'+row.businessType+'">普租</div>'
											}else if(row.businessType==2){
												return '<div businessType="'+row.businessType+'">二手买卖</div>'
											}
										}
									},
									{
										field : 'belongerName',
										title : '申请人',
										align : 'center',
									},
									{
										field : 'fullDeptName',
										title : '申请人所属部门',
										align : 'center',
									},
									{
										field : 'afterAdjustPerfName',
										title : '业绩调整项',
										align : 'center'
									},
									{
										field : 'createTime',
										title : '申请日期',
										align : 'center',
									},
									{
										field : 'lastApproveUserName',
										title : '最后审批人',
										align : 'center'
									},
									{
										field : 'lastApproveTime',
										title : '最后审批日期',
										align : 'center'
									},
									{
										field : 'approveState',
										title : '审批状态',
										align : 'center',
										formatter : function(value, row, index) {
											if(row.approveState==1){
												return '<div approveState="'+row.approveState+'">待审批</div>'
											}else if(row.approveState==2){
												return '<div approveState="'+row.approveState+'">审批中</div>'
											}else if(row.approveState==3){
												return '<div approveState="'+row.approveState+'">已通过</div>'
											}else if(row.approveState==4){
												return '<div approveState="'+row.approveState+'">待调整</div>'
											}else if(row.approveState==5){
												return '<div approveState="'+row.approveState+'">已驳回</div>'
											}else if(row.approveState==6){
												return '<div approveState="'+row.approveState+'">已撤销</div>'
											}else if(row.approveState==7){
												return '<div approveState="'+row.approveState+'">已提交</div>'
											}else if(row.approveState==8){
						      	    			return '<div approveState="'+row.approveState+'">已审批</div>'
						      	    	      }
										}
									},
									{
										field : 'oper',
										title : '操作',
										align : 'center',
									}, ]
						})
	}
	/*
	 * （撤销）
	 * 我申请的*/
	
	
	$(document).delegate('#button','click',function(event) {
						var contractNo = $(this).parent().parent().children().eq(1).children().text();						
						var applyId = $(this).parent().parent().children().eq(0).children().text();
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
										var mem = $("#mem").val();
										if(mem){
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
															"approveState":"6"
														}),
												success : function(result) {
													$("#mem").val("");
													layer.closeAll()
													$('#dataTable').bootstrapTable('refresh',{url : basePath+ '/perf/authorize/perfoApplyDetail'});
												}
											})
										}else{
											commonContainer.alert("未输入申请撤销备注，不能提交");
											return false
										}										
									}
								});
					});

	/*
	 * 我审批的
	 */
	// initListLoad2();
	function initListLoad2() {
		$('#dataTable2').bootstrapTable({
							url : basePath+ '/perf/authorize/perfoApproveDetail',
							sidePagination : 'server',
							dataType : 'json',
							method : 'post',
							pagination : true,
							striped : true,
							pageSize : 10,
							pageList : [ 10, 20, 50 ],
							queryParams : function(params) {
								var o = jQuery('#J_restrictiveform').serializeObject();
								o.timestamp = new Date().getTime(),
								o.pageindex = params.offset/ params.limit + 1,
								o.pagesize = params.limit;
								if(o.starttime) {o.starttime = encodeURI(o.starttime);}
								if(o.endtime) {o.endtime = encodeURI(o.endtime);}
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
							responseHandler : function(result) {
								console.log(result);
								if (result.code == 0 && result.data&& result.data.totalcount > 0) {
									return {"rows" : result.data.rows,"total" : result.data.totalcount}
								}
								return {"rows" : [],"total" : 0}
							},
							columns : [
										{
											field : 'applyId',
											title : '申请单编号',
											align : 'center',
											formatter : function(value, row, index) {
												var formId=row.applyNo;
												formId = formId.split("-")[1];
												var html = '';
												html = '<a target="_blank" href="/sales/perf/authorize/perfoEpowManagedetail.htm?formId='+formId+'">'+ value+ '</a>';
												return html;
											}
										},
										{
											field : 'contractNo',
											title : '合同编号',
											align : 'center',
											formatter : function(value, row, index) {
												if(row.businessType==2){
													var html = '';
													html = '<a target="_blank" href="/sales/sign/signthecontract/contractdetail.htm?conId='+  row.contractID+ '">'+ value+ '</a>';
													return html;
												}else{
													return '<a target="_blank" href="/sales/sign/detail/detail.html?conid='+  row.contractID+ '&formal=true">'+ value+ '</a>';
												}
												

											}
										},
										{
											field : 'businessType',
											title : '业务类型',
											align : 'center',
											formatter : function(value, row, index) {
												if(row.businessType==1){
													return '<div businessType="'+row.businessType+'">普租</div>'
												}else{
													return '<div businessType="'+row.businessType+'">二手买卖</div>'
												}
											}
										},
										{
											field : 'belongerName',
											title : '申请人',
											align : 'center',
										},
										{
											field : 'fullDeptName',
											title : '申请人所属部门',
											align : 'center',
										},
										{
											field : 'afterAdjustPerfName',
											title : '业绩调整项',
											align : 'center'
										},
										{
											field : 'createTime',
											title : '申请日期',
											align : 'center',
										},
										{
											field : 'lastApproveUserName',
											title : '最后审批人',
											align : 'center'
										},
										{
											field : 'lastApproveTime',
											title : '最后审批日期',
											align : 'center'
										},
										{
											field : 'approveState',
											title : '审批状态',
											align : 'center',
											formatter : function(value, row, index) {
												if(row.approveState==1){
													return '<div approveState="'+row.approveState+'">待审批</div>'
												}else if(row.approveState==2){
													return '<div approveState="'+row.approveState+'">审批中</div>'
												}else if(row.approveState==3){
													return '<div approveState="'+row.approveState+'">已通过</div>'
												}else if(row.approveState==4){
													return '<div approveState="'+row.approveState+'">待调整</div>'
												}else if(row.approveState==5){
													return '<div approveState="'+row.approveState+'">已驳回</div>'
												}else if(row.approveState==6){
													return '<div approveState="'+row.approveState+'">已撤销</div>'
												}else if(row.approveState==7){
													return '<div approveState="'+row.approveState+'">已提交</div>'
												}else if(row.approveState==8){
							      	    			return '<div approveState="'+row.approveState+'">已审批</div>'
							      	    	      }
											}
										},
										{
											field : 'oper',
											title : '操作',
											align : 'center',
											formatter : function(value, row, index) {
												var html = '';
												if(row.isRunning=="0" && row.approveState!=6){
													html += '<a target="_blank" href="'+row.todoUrl+'" class="btn btn-xs btn-success" id="approve">审批</a>'											
												}												
												return html;
											}
										}, ]
						})
	}

	// 模糊查询
	searchContainer.searchUserListByComp($("#J_user"), true, 'right');

	// 部门自动补全查询
//	searchDept($('#J_deptName1'), false, 'left');
	// 显示部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'),$('#J_level_id'));
	});

	// 初始化录入日期
	var begindate = {
			elem: '#J_begindate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    isclear: false,
		    choose: function(datas){
		    	enddate.min = datas;

		    }
		}
	
	var enddate = {
			elem: '#J_enddate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    isclear: false,
		    choose: function(datas){
                begindate.max=datas;
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
	
	$('#J_enddate').on('change', function() {
		starttime.max = '';
	})

	function reset(){
		$("#J_deptName").val("");
		$("#J_deptName").attr("data-id","");
		$("#applyNo").val("");
		$("#contractNo").val("");
		$("#J_user").val("");
		$(".J_chosen").val("");
		$('.J_chosen').trigger('chosen:updated');
		console.log($(".J_chosen").val())
		$("#J_perfor").val("");
		enddate.min='';
		enddate.start='';
		begindate.max='';
	}

	$("#J_business").bind("change",function(){
		
		
		if(this.value){
			var companyId;
			var keyid=this.value;
			$.ajax({
				url : basePath + '/perf/authorize/getUserInfo',
				type : 'get',
				dataType : 'json',
				cache : true,
				success : function(result) {	
					companyId = result.data;
					$("#J_perfor").find("option:not(:first-child)").remove();
					dimContainer1.buildDimChosenSelector1($("#J_perfor"), companyId,keyid,"");
				}
			});			
		}else{
			$("#J_perfor").find("option:not(:first-child)").remove();
			$("#J_perfor").trigger("chosen:updated");
		}
		
	})
	
	
	
	
	
window.dimContainer1 = {
	getDimReqUrl: function() {
		return basePath + '/perf/setRuleDetail/findPerfType';
	},
	buildDimChosenSelector1: function($container, compId,keyId, selectedValues) {//selectedValues默认选中值
		// 初始化chosen控件
		commonContainer.initChosen($container);

		var that = this;
	    var options = [];
	    jsonPostAjax(that.getDimReqUrl(), {'compId':compId,'keyId':keyId}, function(result) {
    		$.each(result.data, function(n, value) {
    			if(value!=null){
    				options.push('<option value="' + value.valueCode + '">' + value.valueName + '</option>');
    			}    	    	
    	    })
    	    $container.append(options);

    		var selectedValueArr = selectedValues.split(',');
    		$container.val(selectedValueArr);
    		$container.trigger("chosen:updated");
		})
	},
}


