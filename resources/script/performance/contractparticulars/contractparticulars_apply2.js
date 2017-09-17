$(function(){
	// 公司平台补业绩申请单（发起申请（表一操作））
	function apply() {

	};
/*发起申请工作流*/
         //提交 
			$('#apply').show().off().on('click',function(){
				//发起流程创建的审批人
				jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_COMP_STATE&methodName=findUserOnStart',{
					//conId:result.data.contractid
				},function(redata){
					commonContainer.modal('店长审批','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
						var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
						//创建工作流
						if(getSelections.length>0){
							layer.close(i);
							/*var isPay='0';
							if(result.data.ispayouts==1 || result.data.istransfercommission==1 || result.data.isbackcommission==1){
								isPay='1';
							}*/
						 /*jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_COMP_STATE&methodName=createWorkflow',{
								//signnumber:_this.signnumber,							//单据编号
							    formId:result.data.chargebakcid,				//退单id
							    nextUser:getSelections[0].userId,				//审批人id
							    signnum:_this.signnumber,						//单据编号
							    isPay:isPay										//是否处理费用（是否退佣，是否转佣，是否付赔偿款）有一个为是  isPay=1，反之  isPay=0
								
							},function(){
								layer.alert('提交成功', {
									skin: 'layui-layer-lan',
									closeBtn:0,  // 是否显示关闭按钮
									yes:function(){
										apply();
									}
								});
							});*/
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
									if ($("#J_apply_money").val() == ""
											|| $("#J_apply_remark").val() == "") {
									layer.alert("请输入完整信息！");
									
									} /*else {

									}*/
									// layer.close(index);
									var compensateAmount=$("#J_apply_compensateAmount").val();
									var mome=$("#J_apply_mome").val();
									var timestamp=new Date().getTime();
									contractPerformanceId =$("#App_contractNo").text();
									alert(contractPerformanceId)
									alert(mome)
									
									jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_COMP_STATE&methodName=createWorkflow',{
										compensateAmount:compensateAmount,				//申请金额
										    mome:mome,//申请备注	
										    
										    applyType:"1",
										    nextUser :getSelections[0].userId,
										    contractPerformanceId :$("#App_contractNo").text(),
										    formId:timestamp
										},function(){
											layer.alert('提交成功', {
											});
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
			});
		})