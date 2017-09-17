 function getUrlParams(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg);
 	if(r!=null){
 		return unescape(r[2]);
 	}
 	return null;
 }
 
 //var companyId=getUrlParams("companyId");
 // var businessType=getUrlParams("businessType");
 // var contractNo=getUrlParams("contractNo");
 // var contractId=getUrlParams("contractId");
 // var applyNo=getUrlParams("applyNo");
 // var applyId=getUrlParams("applyId");
 // var businessType=getUrlParams("businessType");

//创建业务参数
	var contractNo;
	var applyId;	
	var applyNo
	var formId;
	var companyId;
	var contractId;
	var businessType;
	//获取业务参数
	var applyNo = getUrlParams("applyNo");
	var docbizkey = getUrlParams("docbizkey");
	if(applyNo!=null){
		 formId = getUrlParams("formId") || applyNo.split("-")[1];
	}
	if(docbizkey!=null){
		formId = getUrlParams("formId") || docbizkey.split("-")[1];
		applyNo = docbizkey;
	}
//	var formId = getUrlParams("formId") || docbizkey.split("-")[1] ||applyNo.split("-")[1];
	jsonGetAjax(basePath + '/perf/authorize/timeStamp', {
		"timeStamp" : formId
	}, function(result) {
//		contractNo = result.data.contractNo;
		applyId = result.data.applyId;
		contractId=result.data.contractPerformanceId;
		companyId=result.data.companyId;
		businessType = result.data.businessType;
		applyNo = result.data.applyNo;
		getDetail()
		//initListLoad();
		//initListLoadTable();
		
		//reasons();
		//histroyLoadTable();
			  //合同详情
	  jsonGetAjax(basePath + '/perf/contract/getContractByContractId',
	 		 {"contractId":contractId,"companyId":companyId,"businessType":businessType},
	 		 function(result) {	
	 			 if(result.data!=undefined){
	 			 var num=result.data.contractCode|| "";
	 			 var receivableAmount=result.data.receivableAmount || 0;
	 			 var realIncomeAmount=result.data.realIncomeAmount|| 0;
	 			 var disCountTotal=result.data.disCountTotal|| 0;
	 			 var companyCompenstateAmount=result.data.companyCompenstateAmount|| 0;
	 			 var tomoney=receivableAmount+companyCompenstateAmount|| 0;
	 			 $(".J_num").text(num);
	 			 $(".receivableAmount").text(receivableAmount);
	 			 $(".J_realIncomeAmount").text(realIncomeAmount);
	 			 $(".J_disCountTotal").text(disCountTotal);
	 			 $(".J_companyCompenstateAmount").text(companyCompenstateAmount);
	 			 $(".J_tomoney").text(tomoney);
	 			 }
	  })
	});

	
 var templateId = getUrlParams('templateId');	
 window.onload=function(){
//	 getDetail();
	 var isdetail=getUrlParams("isdetail");
	 if(!isdetail){
		// 审批流程创建审批按钮 
			var templateId = getUrlParams('templateId');
			jsonGetAjax(
				basePath + '/workflow/selectShowLabelBytemplateId',
				{	
					"templateId":templateId						
				},
				function(result) {
					if(result.data && result.data.length>0){
						var htmlbutton = '';
						$.each(result.data,function(i,n){
							htmlbutton += '<button type="button" class="btn btn-success btn-altogether btn_size" data-val="'+n.labelId+'">'+n.labelName+'</button>';
						});
						$('#J_btn_button').append(htmlbutton);
					}			
				}
			);
	 }
	 
 }

 function getDetail(){
		/*申请详情*/
			$('#J_dataTable').bootstrapTable({ 
				url:basePath + '/perf/applyTask/getPerfApplyDeatil',
				sidePagination: 'server',
				dataType: 'json',
				method:'post',
				pagination: false,
				striped: true,
				pageSize: 10,
				pageList: [10, 20, 50],
				queryParams : function(params) {
					var o = {};
					o.timestamp = new Date().getTime(),
					o.pageindex = params.offset/ params.limit + 1,
					o.pagesize = params.limit;
					o.applyNo=applyNo;
					return o;
				},
				responseHandler: function(result) {
					if(result.code == 0 && result.data && result.data.totalcount > 0) {
						return { "rows": result.data.rows, "total": result.data.totalcount}
					}
					return { "rows": [], "total": 0 } 
				},
				columns:[			         
				      	    {field:'applyNo', title: '申请编号', align: 'center',
				      	    	formatter: function(value, row, index) {
				      				var html = '';
				      				//var url = '';
				      				/*url = basePath+'/perf/applyTask/toDetails.htm?applyNo='+row.applyNo;*/
				      				/*html = "<a href="+url+" id='order-btn'>"+ row.applyId +"</a>";*/
				      				html="<div id='order-btn'>"+ row.applyId +"</div>"
				      				return html;
				      	    	}
				      	    },
				      	    {field:'compensateAmount', title: '公司平台补业绩金额', align: 'center'},
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
				      	    {field:'userName', title: '申请人', align:'center'},
				      	    {field:'createTime', title: '申请时间', align: 'center',
				      	    },
				      	    {field:'approveTime', title: '审批时间', align: 'center',
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
				      	],
			})
			$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/applyTask/getPerfApplyDeatil'});

			/*审批历史*/
			$('#J_dataTable_history').bootstrapTable({ 
				url:basePath + '/perf/applyTask/getPerfApplyTaskHistory',
				sidePagination: 'server',
				dataType: 'json',
				method:'post',
				pagination: false,
				striped: true,
				pageSize: 10,
				pageList: [10, 20, 50],
				queryParams : function(params) {
					var o = {};
					o.timestamp = new Date().getTime(),
					o.applyNo=applyNo;
					return o;
				},
				responseHandler: function(result) {
					if(result.code == 0 && result.data ) {
						return { "rows": result.data}
					}
					return { "rows": [] } 
				},
				columns : [
					{
					 field : 'id',
					 title : '序号',
					 align : 'center',
					 formatter : function(value, row, index) {
							return index + 1;
						}
					
					},
				   {
					field : 'taskName',
					title : '审批节点',
					align : 'center'

				},
				{
					field : 'userName',
					title : '审批人',
					align : 'center'

				},{
					field : 'approveState',
					title : '审批结果',
					align : 'center',
						formatter : function(value, row) {
							if (row.approveState == 1) {
								return '<div>待审批</div>';
							} else if (row.approveState == 2) {
								return '<div>审批中</div>';
							} else if (row.approveState == 3) {
								return '<div>已通过</div>';
							} else if (row.approveState == 4) {
								return '<div>待调整</div>';
							} else if (row.approveState == 5) {
								return '<div>已驳回</div>';
							} else if (row.approveState == 6) {
								return '<div>已撤销</div>';
							}else if (row.approveState == 7) {
								return '<div>已提交</div>';
							}
							else if (row.approveState == 8) {
								return '<div>已审批</div>';
							}
							
						}
				},
				{
					field : 'createTime',
					title : '提交日期',
					align : 'center',

				}, {
					field : 'completeTime',
					title : '审批时间',
					align : 'center',
					formatter : function(value, row, index) {
						var val = value
						if (val != undefined) {
							return '<div>' + val.substring(0, 19) + '</div>';
						} else {
							return '-';
						}
					}
				}, {
					field : 'comment',
					title : '审批意见', 
					align : 'center',
					formatter : function(value, row, index) {
						var html='';
						if(row.comment==undefined){
							html="-";
							return html;
						}else{
							return html='<div class="remark_all" style="white-space:normal; word-break:break-all;">'+value+'</div>';
						}
						
					}
                    
				} ],
			})
			$('#J_dataTable_history').bootstrapTable('refresh',{ url: basePath + '/perf/applyTask/getPerfApplyTaskHistory'});
			// 申请进度表格
			/*histroyLoadTable();
			function histroyLoadTable() {
				$('#J_table').bootstrapTable({
					url : basePath + '/perf/applyTask/getPerfApplyTaskHistory',
					sidePagination : 'server',
					dataType : 'json',
					method : 'post',
					pagination : false,
					striped : true,
					queryParams : function(params) {
						var o = {};
						o.timestamp = new Date().getTime(),
						o.pageindex = params.offset/ params.limit + 1,
						o.pagesize = params.limit;
						o.applyNo=applyNo;
						return o;
					},
					responseHandler: function(result) {
						if(result.code == 0 && result.data && result.data.totalcount > 0) {
							return { "rows": result.data.rows, "total": result.data.totalcount }
						}
						return { "rows": [], "total": 0 } 
					},
					columns : [ {
						field : 'userName',
						title : '操作人',
						align : 'center'

					}, {
						field : 'createTime',
						title : '提交日期',
						align : 'center',
						formatter : function(value, row, index) {
							var val = value
							if (val != undefined) {
								return '<div>' + val.substring(0, 10) + '</div>';
							} else {
								return '-';
							}
						}
					}, {
						field : 'approveState',
						title : '当前状态',
						align : 'center',
						formatter : function(value, row) {
							if (row.approveState == 1) {
								return '<div>待审批</div>';
							} else if (row.approveState == 2) {
								return '<div>审批中</div>';
							} else if (row.approveState == 3) {
								return '<div>已通过</div>';
							} else if (row.approveState == 4) {
								return '<div>待调整</div>';
							} else if (row.approveState == 5) {
								return '<div>已驳回</div>';
							} else if (row.approveState == 6) {
								return '<div>已撤销</div>';
							}
						}
					}, {
						field : 'completeTime',
						title : '完成日期',
						align : 'center',
						formatter : function(value, row, index) {
							var val = value
							if (val != undefined) {
								return '<div>' + val.substring(0, 19) + '</div>';
							} else {
								return '-';
							}
						}
					}, {
						field : 'comment',
						title : '审核意见',
						align : 'center'

					} ]
				})
			}
*/
			/*本合同其他申请*/
			$('#J_dataTable_1').bootstrapTable({ 
				url:basePath + '/perf/applyTask/getPerfApplyOther',
				sidePagination: 'server',
				dataType: 'json',
				method:'post',
				pagination: false,
				striped: true,
				pageSize: 10,
				pageList: [10, 20, 50],
				queryParams : function(params) {
					var o = {};
					o.timestamp = new Date().getTime(),
					o.pageindex = params.offset/ params.limit + 1,
					o.pagesize = params.limit;
					o.contractId =contractId;
					o.applyNo=applyNo;
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
				      				html = "<a href="+url+"&isdetail=true id='order-btn' target='_blank'>"+ row.applyId+"</a>";
				      				return html;
				      	    	}
				      	    },
				      	    {field:'compensateAmount', title: '公司平台补业绩金额', align: 'center'},
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
				      	    {field:'userName', title: '申请人', align:'center'},
				      	    {field:'createTime', title: '申请时间', align: 'center',
				      	    },
				      	    {field:'approveTime', title: '审批时间', align: 'center',
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
				      	],
			})
	$('#J_dataTable_1').bootstrapTable('refresh',{ url: basePath + '/perf/applyTask/getPerfApplyOther'});
			
 }
$(function(){	
/*按钮*/	
	$('#J_btn_button').off().delegate('button', 'click', function(event) {
		$("#mem").val("");
		$("#checklen").html("还可输入 <strong>"+120+"</strong> 个字").css('color', '');
		var typetaskId = getQueryString("taskId");
		var datavalbutton = $(this).attr('data-val');
		var applyId = getQueryString("applyId");
		var isEnd = getQueryString("isEnd");
		var docbizkey = getQueryString("docbizkey");
		var dbizkey = docbizkey.split("-")[0];
		
		if (datavalbutton == 'toPass') {
			if (!isEnd) {
				// 查询流程创建的审批人
				jsonPostAjax(basePath + '/workflow/doJob?modelName='+dbizkey+'&methodName=findUserOnTask', {
					taskId : typetaskId
				}, function(redata) {
					commonContainer.modal(redata.data[0].currentApprovalProcess+'', '<table id="approver" class="table table-hover table-striped table-bordered"></table>', function(i) {
						var getSelections = $('#approver').bootstrapTable('getSelections'); // 选中的审批人
						// 审批通过
						if (getSelections.length > 0) {
							layer.close(i);
							$(".title_contractNo").text("")
							layer.open({
								title : '请录入审批意见',
								type : 1,
								shift : 1,
								skin : 'layui-layer-lan layui-layer-no-overflow',
								zIndex : 10,
								content : $('#demo_layer_stantard'),
								area : [ '360px', '300px' ],
								btn : [ '确认', '取消' ],
								yes : function(index, layero) {
									var mem = $("#mem").val();
									if (mem == '') {
										layer.alert('审批意见必填项不能为空');
										return false;
									}
									jsonPostAjax(basePath + '/workflow/doJob?modelName='+dbizkey+'&methodName=toPass', {
										comment : $('#mem').val(),
										taskId : typetaskId,
										nextUser : getSelections[0].userId,
										formId : formId,
										applyId : applyId,
										isEnd : isEnd
									}, function() {
										layer.closeAll();
										layer.alert('提交成功', {cancel: close}, close);
										function close(){
											jsonGetAjax(basePath + '/perf/reason/incomPerf', {dbizkey:docbizkey} , function(){
												
											})
										}
										//window.location.href=basePath+'/perf/applyTask/toDetails.htm?applyNo='+applyNo+'&businessType='+businessType+'&contractId='+contractId+'&companyId='+companyId;
										$('#J_btn_button button').hide();
									});
								}
							})
						} else {
							commonContainer.alert('请选择审批人');
						}
					}, {
						btns : [ '确定', '取消' ],
						area : '600px',
						overflow : true,
						success : function() {
							$('#approver').bootstrapTable({
								singleSelect : true, // 设置单选
								clickToSelect : true, // 点击选中行
								columns : [ {
									field : '',
									title : '选择',
									checkbox : true,
									align : 'center'
								}, {
									field : 'userName',
									title : '用户姓名',
									align : 'center'
								}, {
									field : 'userDept',
									title : '用户部门',
									align : 'center'
								} ],
								data : redata.data
							});
						}
					});
				}, {
					completeCallBack : function() {

					}
				});
			} else {
				$(".title_contractNo").text("")
				layer.open({
					title :'请录入审批意见',
					type : 1,
					shift : 1,
					skin : 'layui-layer-lan layui-layer-no-overflow',
					zIndex : 10,
					content : $('#demo_layer_stantard'),
					area : [ '360px', '300px' ],
					btn : [ '确认', '取消' ],
					yes : function(index, layero) {
						var mem = $("#mem").val();
						if (mem == '') {
							layer.alert('审批意见必填项不能为空');
							return false;
						}
						jsonPostAjax(basePath + '/workflow/doJob?modelName='+dbizkey+'&methodName=toPass', {
							comment : $('#mem').val(),
							taskId : typetaskId,
							formId : formId,
							applyId : applyId,
							isEnd : isEnd
						}, function() {
							layer.closeAll();
							layer.msg("提交成功",{
								  icon: 1,
								  time: 3000
								},function(){
									window.location.reload();
									$('#J_btn_button button').hide();
								})
							//window.location.href=basePath+'/perf/applyTask/toDetails.htm?applyNo='+applyNo+'&businessType='+businessType+'&contractId='+contractId+'&companyId='+companyId;
							
						});
                        jsonPostAjax(basePath + 'perf/reason/incomPerf', {dbizkey:dbizkey,
                        })
					}
				})
			}

		} else if (datavalbutton == 'toReject') {
			layer.open({
				title : '请录入审批意见',
				type : 1,
				shift : 1,
				skin : 'layui-layer-lan layui-layer-no-overflow',
				zIndex : 10, 
				content : $('#demo_layer_stantard'),
				area : [ '360px', '300px' ],
				btn : [ '确认', '取消' ],
				yes : function(index, layero) {
					var mem = $("#mem").val();
					if (mem == '') {
						layer.alert('驳回意见必填项不能为空');
						return false;
					}
					jsonPostAjax(basePath + '/workflow/doJob?modelName='+dbizkey+'&methodName=toReject', {
						taskId : typetaskId,
						comment : $('#mem').val(),
						formId : formId,
						applyId : applyId
					}, function() {
						layer.closeAll();
						layer.msg("提交成功",{
							  icon: 1,
							  time: 3000
							},function(){
								window.location.reload();
								$('#J_btn_button button').hide();
							})
						//window.location.href=basePath+'/perf/applyTask/toDetails.htm?applyNo='+applyNo+'&businessType='+businessType+'&contractId='+contractId+'&companyId='+companyId;
						
					});
				}
			})
		}
	})
 $(document).delegate('#J_cancel','click',function(event) {
	    $("#mem").val("");
		$("#checklen").html("还可输入 <strong>"+120+"</strong> 个字").css('color', '');
					var mem = $("#mem").val();
					var applyId = getUrlParams(applyId);
					$(".title_contractNo").text('备注')
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
		 })
					
					
				//流程图
//					var docbizkey = getQueryString("applyNo");
	                var applyNo = getUrlParams("applyNo");
	                var docbizkey = getUrlParams("docbizkey");
	                var dbizkey;
	                var formId;
					if(applyNo!=null){
						  dbizkey = applyNo.split("-")[0];
						   formId = applyNo.split("-")[1];
					}
					if(docbizkey!=null){
						  dbizkey = docbizkey.split("-")[0];
						   formId = docbizkey.split("-")[1];
					}
	               
	
//					var formId = dbizkey.split("-")[1];
					jsonPostAjax(basePath+'/workflow/doJob?modelName='+dbizkey+'&methodName=getFlowChartUrlByBusiness',{			
					    formId:formId
					},function(result){
						if('PERF_COMP_STATE'==dbizkey){
							
							$('#J_srcimg').attr('src',result.data.PERF_COMP_STATE);
						}else{
							$('#J_srcimg').attr('src',result.data.PERF_COMP_BUY);
						}
						
					});
					

					function getQueryString(name) { // js获取url地址以及 取得后面的参数
						var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
						var r = window.location.search.substr(1).match(reg); 
						if (r != null) return unescape(r[2]); return null; 
					} 
					
					
					//textarae字数限制
					mem.oninput = function strLenCalc(obj, checklen, maxlen) {	
						var v = $("#mem").val(), charlen = 0, maxlen = !maxlen ? 240 : maxlen, curlen = maxlen, len = v.length;
						for(var i = 0; i < v.length; i++) {
						//if(v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
						curlen -= 1;
						//}
						}
					  if(curlen >= len) {
						$("#checklen").html("还可输入 <strong>"+Math.floor((curlen-len)/2)+"</strong> 个字").css('color', '');
//						$("#J_submit").removeAttr("disabled");
						} else {
						$("#checklen").html("已经超过 <strong>"+Math.ceil((len-curlen)/2)+"</strong> 个字").css('color', '#FF0000');
//						$("#J_submit").attr("disabled", "disabled");
						}
					 }
		
})