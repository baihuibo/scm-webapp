$(function(){
	chargebackDetailView.init();
});
var chargebackDetailView={
	signnumber:location.search.split('=')[1],	//单据编号
	usersLock:false,
	init:function(){
		this.getDetai();
	},
	getDetai:function(){
		var _this=this;
		jsonGetAjax(basePath+'/sign/chargeback/chargebackdetail.htm',{
			signnumber:_this.signnumber			//单据编号
		},function(result){
			if(result.data.auditstatus=="3"||result.data.auditstatus=="8"){
				$("#goFeiyzhixmx").show();
			}				
			var urlData='chargebakcid='+result.data.chargebakcid+'&businesstype='+result.data.businesstype+'&conId='+result.data.contractid+'&contractcode='+result.data.contractcode;
			//跳转到费用处理
			$('#gofeiYongcl').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/cost.html?'+urlData;
			});
			//跳转到附件管理
			$('#goAttachment').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/attachment.html?'+urlData;
			});
			//跳转到补充协议
			$('#goAgreement').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/supplementalagreement.html?'+urlData;
			});
			//跳转到审批流程
			$('#goShenPlc').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/auditprocess.html?'+urlData;
			});
			//跳转到费用执行明细
			$('#goFeiyzhixmx').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/costdetail.html?'+urlData;
			});
			//跳转到业绩信息
			$('#performance').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/chargeBackToPerformance?'+urlData;
			});
			$('#signnumber').html('单据编号：'+result.data.signnumber);																//单据编号
			$('#strauditstatus').html('审核状态：'+result.data.strauditstatus);		
			//审核状态
			var xiangqurl='signthecontract/contractdetail';
			var formal='';
			if(result.data.strbusinesstype=='租赁'){
				xiangqurl='detail/detail';
				formal='&formal=true';
			}
			$('#addContractNumber').html('<a href="'+basePath+'/sign/'+xiangqurl+'.html?conid='+result.data.contractid+formal+'&other=true" target="_blank" style="text-decoration:underline">'+result.data.contractcode+'</a>');								//合同编号
			$('#addBusinessType').html(result.data.strbusinesstype);															//业务类型
			$('#addCustomerName').html(result.data.customername);																//客户姓名
			$('#addOwnerName').html(result.data.ownname);																		//业主姓名
			$('#addBackCommis').html(result.data.totalcommission);																//佣金总额
			$('#addEpartment').html(result.data.shopgroupname);																	//所属部门
			$('#addHousing').html('<a href="'+basePath+'/house/main/buydetail.html?houseid='+result.data.houseid+'" target="_blank" style="text-decoration:underline">'+result.data.houseid+'</a>');											//房源编号
			$('#addTourists').html('<a href="'+basePath+'/customer/main/findbuyerclientbycustomerid.html?customerId='+result.data.customerid+'" target="_blank" style="text-decoration:underline">'+result.data.clientid+'</a>');				//客源编号
			$('#addPaidCommission').html(result.data.realreceivedcommission);													//实收佣金
			$('#addCommissionRate').html(result.data.returncommission==undefined?'-':result.data.returncommission+'%');			//退佣比例
			$('#proPeichang').html(result.data.ispayouts==1?'是':'否');															//是否付赔偿款
			$('#proShouweiyj').html(result.data.isreceivepenalty==1?'是':'否');													//是否收违约金
			$('#proTuidan').html(result.data.isbacksign==1?'是':'否');															//是否退单
			$('#proZhuany').html(result.data.istransfercommission==1?'是':'否');													//是否转佣
			$('#proTuiyong').html(result.data.isbackcommission==1?'是':'否');														//是否退佣
			if(result.data.isbacksign==0){
				$(".tuid").hide();
			}
			if(result.data.istransfercommission==0&&result.data.isbackcommission==0){
				$(".mon").hide();
				$(".per").hide();
			}
			$('#tuiDval').html(result.data.strchargebacktype==undefined?'-':result.data.strchargebacktype);						//退单类型
			$('#explainConten').html(result.data.remark)																		//申请说明
			var realreturncommission=result.data.realreturncommission;
			/*if(realreturncommission==undefined){
				realreturncommission='-';
			}else{
				var indexOf=realreturncommission.toString().indexOf('.');
				if(indexOf<0){
					realreturncommission=realreturncommission+'.00';
				}else if(realreturncommission.length-indexOf-1!==2){
					realreturncommission=realreturncommission+'0';
				}
			}*/
			$('#shituiYj').html(realreturncommission);																			//实退佣金
			$('#createByName').html(result.data.createbyname);																	//创建人
			$('#createTime').html(result.data.createtime);																		//创建时间
			$('#updateByName').html(result.data.updatebyname==undefined?'-':result.data.updatebyname);							//最后修改人
			$('#updateTime').html(result.data.updatetime==undefined?'-':result.data.updatetime);								//最后修改时间
			if(result.data.strbusinesstype=='买卖'){
				$('#jiaoYiInfor').show();
				$('#valuationfee').html(result.data.strvaluation_fee);																//评估费
				$('#netsign').html(result.data.strnet_sign);																		//网签
				$('#roomcheck').html(result.data.strroom_check);																	//房源检验
				$('#loan').html(result.data.strloan);																				//贷款
				$('#changeName').html(result.data.strchange_name);																	//过户
			}
			//是否已提交
			//if(result.data.auditstatus==1){
				//判断单据状态状态 auditstatus 1.待提交审批2.审核中3.审批通过4.审批不通过5.待提交审批（财务驳回）6.审批通过（风控）7.作废,
				 if(result.data.auditstatus==1){
					//修改跳转
					 $('#modifyBtn').show().off().on('click',function(){
						location.href=basePath+'/sign/chargeback/add.html?signnumber='+result.data.signnumber;
					});
					//作废
					 $('#cancelBtn').show().off().on('click',function(){
						commonContainer.modal('','<div style="padding: 20px;font-size: 14px;">是否要作废</div>',function(i){
							layer.close(i);
							jsonGetAjax(basePath+'/sign/chargeback/chargebackobsolete.htm',{
								chargebackid:result.data.chargebakcid,			//退单主键id
								flag:2											//1取消作废，2作废
							},function(){
								layer.alert('作废成功', {
									skin: 'layui-layer-lan',
									closeBtn:0,  								// 是否显示关闭按钮
									yes:function(){
										location.reload();
									}
								});
							});
						},{
							btns:['确定','取消'],
							area:'300px'
						});
					});
					//提交 
					$('#submitBtn').show().off().on('click',function(){
//						if(result.data.strchange_name=='已过户'){
//							commonContainer.alert('合同已办理过户，不可提交审核；评估费未结清，单据不可审批通过。');
//							return false;
//						}
						if(_this.usersLock){
							return false;
						}else{
							_this.usersLock=true;
						}
						//退单提交校验接口
						jsonGetAjax(basePath+'/sign/chargeback/checkChargeback',{
							signnumber:result.data.signnumber
						},function(){
							//查询流程创建的审批人
							jsonPostAjax(basePath+'/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=findUserOnStart',{
								//conId:result.data.contractid
							},function(redata){
								commonContainer.modal('店长审批','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
									var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
									//创建工作流
									if(getSelections.length>0){
										layer.close(i);
										var isPay='0';
										if(result.data.ispayouts==1 || result.data.istransfercommission==1 || result.data.isbackcommission==1){
											isPay='1';
										}
										var doJobUrl='/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=createWorkflow';
										// 业务类型  1:租赁，2：买卖
										if(result.data.businesstype==2){
											doJobUrl='/workflow/doJob?modelName=BUY_CHARGEBACK&methodName=createWorkflow';
										}
										jsonPostAjax(basePath+doJobUrl,{
											//signnumber:_this.signnumber,					//单据编号
										    formId:result.data.chargebakcid,				//退单id
										    nextUser:getSelections[0].userId,				//审批人id
										    signnum:_this.signnumber,						//单据编号
										    isPay:isPay,									//是否处理费用（是否退佣，是否转佣，是否付赔偿款）有一个为是  isPay=1，反之  isPay=0
										    businesstype:result.data.businesstype,			//业务类型    1租赁    2买卖
										    isChargeback:result.data.isbacksign,			//是否退单
										    isRecieve:result.data.isreceivepenalty			//是否收违约金
										},function(){
											layer.alert('提交成功', {
												skin: 'layui-layer-lan',
												closeBtn:0,  // 是否显示关闭按钮
												yes:function(){
													location.reload();
												}
											});
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
							});
						},{
							completeCallBack:function(){
								_this.usersLock=false;
							}
						});
					});
				 }else if(result.data.auditstatus==7){
					 //取消作废
					 $('#blankoutBtn').show().off().on('click',function(){
						 commonContainer.modal('','<div style="padding: 20px;font-size: 14px;">是否要取消作废</div>',function(i){
								layer.close(i);
								jsonGetAjax(basePath+'/sign/chargeback/chargebackobsolete.htm',{
									chargebackid:result.data.chargebakcid,			//退单主键id
									flag:1											//1取消作废，2作废
								},function(){
									layer.alert('取消作废成功', {
										skin: 'layui-layer-lan',
										closeBtn:0,  // 是否显示关闭按钮
										yes:function(){
											location.reload();
										}
									});
								});
							},{
								btns:['确定','取消'],
								area:'300px'
							});
					 });
				 }
			//}
		});
	}
}