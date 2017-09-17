 function getUrlParams(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg);
 	if(r!=null){
 		return unescape(r[2]);
 	}
 	return null;
 }
 var contractId=getUrlParams("contractId");
$(function(){
	var businessType = getUrlParams('businessType')
	// 公司平台补业绩申请单（发起申请（表一操作））
/*发起申请工作流  */
         //提交 
			$('#apply').show().off().on('click',function(){
				$("#J_apply_money").val("");
				$("#J_apply_remark").val("");
				$("#checklen1").html("还可输入 <strong>"+500+"</strong> 个字").css('color', '');
				//发起流程创建的审批人
				if(businessType==1){
					jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_COMP_STATE&methodName=findUserOnStart',{
						//conId:result.data.contractid
					},function(redata){
						commonContainer.modal(redata.data[0].currentApprovalProcess+'','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
							var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
							//创建工作流
							if(getSelections.length>0){
								layer.close(i);
								
								/*======================================*/
								$("#J_apply_money").val("");
								$("#J_apply_remark").val("");
								layer.open({
									title : '公司平台补业绩申请单',
									type : 1,
									shift : 1,
									skin : 'layui-layer-lan layui-layer-no-overflow',
									zIndex : 10,
									content : $('#demo_layer_stantard'),
									area : [ '500px', '320px' ],
									btn : [ '确定', '取消' ],
									yes : function(index, layero) {
										if ($("#J_apply_money").val() == ""){
											layer.alert("请输入申请金额！");
											return false;
										}
										if ($("#J_apply_remark").val() == ""){
											layer.alert("请输入申请备注！");
											return false;
										}
										// layer.close(index);
										var compensateAmount=$("#J_apply_money").val();
										var mome=$("#J_apply_remark").val();
										var timestamp=new Date().getTime();
										contractPerformanceId =$("#App_contractNo").text();
										jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_COMP_STATE&methodName=createWorkflow',{
											compensateAmount:compensateAmount,	//申请金额
											mome:mome,						   //申请备注	
											formId:timestamp,
											nextUser :getSelections[0].userId,
											applyType:"1",
											//contractPerformanceId :$(".J_num").text()
											contractPerformanceId:contractId
											},function(){
												layer.closeAll();
												layer.msg("提交成功",{
													  icon: 1,
													  time: 1000
													},function(){
														window.location.reload();
														$('#J_btn_button button').hide();
													})
												//$('#for_dataTable').bootstrapTable('refresh', {url : basePath + '/perf/applyTask/getPerfApply'});
												
											});
									}

								});
								/*============================================*/
							}else{
								commonContainer.alert('请选择审批人');
							}
						},{
							btns:['确定','取消'],
							area:'600px',
							overflow :true,
							success:function(){
								$('#approver').bootstrapTable({
									singleSelect:true,		//设置单选
									clickToSelect:true,		//点击选中行
								    columns: [{
								        field: '',
								        title: '选择',
							        	checkbox:true,
								    	align:'center'
								    }, {
								        field: 'userName',
								        title: '用户姓名',
								        align:'center'
								    }, {
								        field: 'userDept',
								        title: '用户部门',
								        align:'center'
								    }],
								    data:redata.data
								});
								
							}
						});
					},{
						completeCallBack:function(){
							//_this.usersLock=false;
						}
					});
				}else{
					
					jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_COMP_BUY&methodName=findUserOnStart',{
						//conId:result.data.contractid
					},function(redata){
						commonContainer.modal(redata.data[0].currentApprovalProcess+'','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
							var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
							//创建工作流
							if(getSelections.length>0){
								layer.close(i);
								$("#J_apply_money").val("");
								$("#J_apply_remark").val("");
								layer.open({
									title : '公司平台补业绩申请单',
									type : 1,
									shift : 1,
									skin : 'layui-layer-lan layui-layer-no-overflow',
									zIndex : 10,
									content : $('#demo_layer_stantard'),
									area : [ '500px', '320px' ],
									btn : [ '确定', '取消' ],
									yes : function(index, layero) {
										if ($("#J_apply_money").val() == ""){
											layer.alert("请输入申请金额！");
											return false;
										}
										if ($("#J_apply_remark").val() == ""){
											layer.alert("请输入申请备注！");
											return false;
										}
										// layer.close(index);
										var compensateAmount=$("#J_apply_money").val();
										var mome=$("#J_apply_remark").val();
										var timestamp=new Date().getTime();
										contractPerformanceId =$("#App_contractNo").text();
										jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_COMP_BUY&methodName=createWorkflow',{
											compensateAmount:compensateAmount,				//申请金额
											mome:mome,										//申请备注		
											formId:timestamp,
											nextUser :getSelections[0].userId,
											applyType:"1",
											//contractPerformanceId :$(".J_num").text()
											contractPerformanceId:contractId
											},function(){
												layer.closeAll();
												layer.msg("提交成功",{
													  icon: 1,
													  time: 1000
													},function(){
														window.location.reload();
														$('#J_btn_button button').hide();
													})
												
												//$('#for_dataTable').bootstrapTable('refresh', {url : basePath + '/perf/applyTask/getPerfApply'});
											});
									}

								});					
								
							}else{
								commonContainer.alert('请选择审批人');
							}
						},{
							btns:['确定','取消'],
							area:'600px',
							overflow :true,
							success:function(){
								$('#approver').bootstrapTable({
									singleSelect:true,		//设置单选
									clickToSelect:true,		//点击选中行
								    columns: [{
								        field: '',
								        title: '选择',
							        	checkbox:true,
								    	align:'center'
								    }, {
								        field: 'userName',
								        title: '用户姓名',
								        align:'center'
								    }, {
								        field: 'userDept',
								        title: '用户部门',
								        align:'center'
								    }],
								    data:redata.data
								});
								
							}
						});
					},{
						completeCallBack:function(){
							//_this.usersLock=false;
						}
					});
				} 
				
			});
		})