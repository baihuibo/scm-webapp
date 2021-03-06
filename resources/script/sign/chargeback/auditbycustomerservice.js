var taskId=getQueryString("taskId");
var templateid=getQueryString("templateId");
var isend=getQueryString("isEnd");
var jine=0.00;
var t=getQueryString("t");
var isposble = '';
$(function(){
	$("select").chosen({
		width : "100%"
	});
	//t=getQueryString("t");
	if (t) {
		$('#J_btn_button').hide();
		$('#J_btnEntry').prop('disabled',true);
	}
	//初始根据taskId获取单据编号
	jsonPostAjax(
		basePath + '/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=getParamsByTaskId',
		{	
			"taskId":taskId							
		},
		function(result) {
			isposble = result.data.isResponsible;
			auditbycustomerservice.init(result.data.signnum, result.data.isPay, result.data.isChargeback, result.data.isRecieve);
		}
	);
});

//标签table切换 所展示的数据总方法
var auditbycustomerservice={
	signnumber:$('#J_signnumberid').val(),	//单据编号
	init:function(signnumber, isPaynum, ischargeback, isrecieve,chargebackIdNum){
		var _$this = this;
		this.getDetai(signnumber, isPaynum, ischargeback, isrecieve);
	},
	
	//退单详情
	getDetai:function(signnumber, isPaynum, ischargeback, isrecieve){
		var _this=this;
		jsonGetAjax(basePath+'/sign/chargeback/chargebackdetail.htm',{
			signnumber:signnumber			//单据编号
		},function(result){
			this.chargebackId = result.data.chargebakcid;
			$('#J_personuserid').data('chargebackId',result.data.chargebakcid)
			$('#signnumber').html('单据编号：'+result.data.signnumber);																//单据编号
			$('#strauditstatus').html('审核状态：'+result.data.strauditstatus);	

			var chargebackIdNum = result.data.chargebakcid;
			var contracconId = result.data.contractid;

			if(isposble == "1"){
				$('#inlineRadio').prop('checked',true);
				$('#reason').show();
				trace(chargebackIdNum);
			}else{
				$('#inlineRadio1').prop('checked',true);
				$('#reason').hide();
			}
			$('#J_fileList').on('click',function(){
				_this.fileList();
			});
			$('#J_supplementalagreement').on('click',function(){
				_this.queryList(contracconId);
			});
			$('#J_feiychuli').on('click',function(){
				_this.feiychul(chargebackIdNum);
			});
			$('#J_shenpi').on('click',function(){
				_this.shenpilichen();
			});
			
			//责任认定tab切换
			$('#inlineRadio1').on('click',function(){
				$('#reason').hide();
			});
			$('#inlineRadio').on('click',function(){
				$('#reason').show();
				trace(chargebackIdNum);
			});

			//点击加业绩信息志页面
			$('#J_yeji').off().on('click',function(){
				$('#J_srcyeji').attr('src',basePath + '/performanceIncome/toExpectIncomeDetail.html?applyId='+chargebackIdNum);
			});
			//审核状态
			var xiangqurl='signthecontract/contractdetail';
			if(result.data.strbusinesstype=='租赁'){
				xiangqurl='detail/detail';
			}
			$('#addContractNumber').html('<a href="'+basePath+'/sign/'+xiangqurl+'.html?conid='+result.data.contractid+'" target="_blank" style="text-decoration:underline">'+result.data.contractcode+'</a>');								//合同编号
			$('#addBusinessType').html(result.data.strbusinesstype);															//业务类型
			$('#addCustomerName').html(result.data.customername);																//客户姓名
			$('#addOwnerName').html(result.data.ownname);																		//业主姓名
			$('#addBackCommis').html(result.data.totalcommission);																//佣金总额
			$('#addEpartment').html(result.data.shopgroupname);																	//所属部门
			$('#addHousing').html('<a href="'+basePath+'/house/main/buydetail.html?houseid='+result.data.houseid+'" target="_blank" style="text-decoration:underline">'+result.data.houseid+'</a>');											//房源编号
			$('#addTourists').html('<a href="'+basePath+'/customer/main/findbuyerclientbycustomerid.html?customerId='+result.data.customerid+'" target="_blank" style="text-decoration:underline">'+result.data.customerid+'</a>');				//客源编号
			$('#addPaidCommission').html(result.data.realreceivedcommission);													//实收佣金
			$('#addCommissionRate').html(result.data.returncommission==undefined?'-':result.data.returncommission+'%');			//退佣比例
			$('#proPeichang').html(result.data.ispayouts==1?'是':'否');															//是否付赔偿款
			$('#proShouweiyj').html(result.data.isreceivepenalty==1?'是':'否');													//是否收违约金
			$('#proTuidan').html(result.data.isbacksign==1?'是':'否');															//是否退单
			$('#proZhuany').html(result.data.istransfercommission==1?'是':'否');													//是否转佣
			$('#proTuiyong').html(result.data.isbackcommission==1?'是':'否');														//是否退佣
			$('#tuiDval').html(result.data.strchargebacktype==undefined?'-':result.data.strchargebacktype);						//退单类型
			$('#explainConten').html(result.data.remark)																		//申请说明
			var realreturncommission=result.data.realreturncommission;
			if(realreturncommission==undefined){
				realreturncommission='-';
			}else{
				var indexOf=realreturncommission.toString().indexOf('.');
				if(indexOf<0){
					realreturncommission=realreturncommission+'.00';
				}else if(realreturncommission.length-indexOf-1!==2){
					realreturncommission=realreturncommission+'0';
				}
			}
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

			//处理结果
			dimContainer.buildDimChosenSelector($('#J_dealResult'),'dealResult','');
			$('#J_btn_button').off().delegate(
					'button',
					'click',
					function(event) {
						var datavalbutton = $(this).attr('data-val');
						var isresponsible = '';
						var tablen = $("#J_servicedataTable tbody tr").length;
						nofond = $("#J_servicedataTable tbody tr").attr('class');
						if($("#auditrecord_form input[name='takeResults']:checked")){ //1,2 对内客服审批 有责 无责 判断
							isresponsible = $("#auditrecord_form input[name='takeResults']:checked").val();
						} 
						var audittextcontent = $('#J_auditrecordcontent').val();
						if(audittextcontent == ''){
							layer.alert('审批意见必填项不能为空');
							return false;
						}						
						if(isresponsible == 1&&tablen==1&&nofond=="no-records-found"){
							layer.alert('选择有责时，必须录入责任人');
							return false;
						}
						
						if(result.data.strbusinesstype=='买卖'){ // 判断业务类型 开始分支 走买卖
							if(datavalbutton == 'toPass'){
								//查询流程创建的审批人
								jsonPostAjax(basePath+'/workflow/doJob?modelName=BUY_CHARGEBACK&methodName=findUserOnTask',{
									taskId:taskId,
									isChargeback:ischargeback,
									isRecieve:isrecieve,
									isPay:isPaynum
								},function(redata){
									commonContainer.modal(redata.data[0].currentApprovalProcess+'审批','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
										var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
										//创建工作流
										if(getSelections.length>0){
											layer.close(i);
											jsonPostAjax(basePath+'/workflow/doJob?modelName=BUY_CHARGEBACK&methodName=toPass',{
												nextUser:getSelections[0].userId,				        //审批人id
											    comment:$('#J_auditrecordcontent').val(),
											    taskId:taskId,
											    isEnd:0,
											    formId:result.data.chargebakcid,
											    signnum:signnumber,
											    isChargeback:ischargeback,
												isRecieve:isrecieve,
											    isPay:isPaynum,
											    isResponsible:isresponsible  
											},function(){
												layer.alert('提交成功');
												$('#J_btn_button button').hide();
												$('#J_formnone').hide();
												$('#J_btnEntry').prop('disabled',true);
											});
										}else{
											commonContainer.alert('请选择审批人');
										}
									},{
										btns:['确定','取消'],
										area:['600px','400px'],
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
							}
							if(datavalbutton == 'toReject'){
								jsonPostAjax(basePath+'/workflow/doJob?modelName=BUY_CHARGEBACK&methodName=toReject',{
									formId:result.data.chargebakcid,
									noPass:0,
									comment:$('#J_auditrecordcontent').val(),
									taskId:taskId,
								    isChargeback:ischargeback,
								},function(){
									layer.alert('提交成功');
									$('#J_btn_button button').hide();
									$('#J_formnone').hide();
									$('#J_btnEntry').prop('disabled',true);
								});
							}
							if(datavalbutton == 'noPass'){
								jsonPostAjax(basePath+'/workflow/doJob?modelName=BUY_CHARGEBACK&methodName=toReject',{
									formId:result.data.chargebakcid,
									noPass:1,
									comment:$('#J_auditrecordcontent').val(),
									taskId:taskId,
								    isChargeback:ischargeback,
								},function(){
									layer.alert('提交成功');
									$('#J_btn_button button').hide();
									$('#J_formnone').hide();
									$('#J_btnEntry').prop('disabled',true);
								});
							}
							if(datavalbutton == 'toRejectLastStep'){
								jsonPostAjax(basePath+'/workflow/doJob?modelName=BUY_CHARGEBACK&methodName=toRejectLastStep',{
									taskId:taskId,
									comment:$('#J_auditrecordcontent').val(),
									taskId:taskId,
								    isChargeback:ischargeback,
								},function(){
									layer.alert('提交成功');
									$('#J_btn_button button').hide();
									$('#J_formnone').hide();
									$('#J_btnEntry').prop('disabled',true);
								});
							}
						}else if(result.data.strbusinesstype=='租赁'){// 判断业务类型 开始分支 走租赁
							if(datavalbutton == 'toPass'){
								//查询流程创建的审批人
								jsonPostAjax(basePath+'/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=findUserOnTask',{
									taskId:taskId,
									isPay:isPaynum,
									isRecieve:isrecieve,
									isChargeback:ischargeback
								},function(redata){
									commonContainer.modal(redata.data[0].currentApprovalProcess+'审批','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
										var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
										//创建工作流
										if(getSelections.length>0){
											layer.close(i);
											jsonPostAjax(basePath+'/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=toPass',{
												nextUser:getSelections[0].userId,				        //审批人id
											    comment:$('#J_auditrecordcontent').val(),
											    taskId:taskId,
											    isEnd:0,
											    formId:result.data.chargebakcid,
											    signnum:signnumber,
											    isPay:isPaynum,
											    isRecieve:isrecieve,
											    isResponsible:isresponsible,
											    isChargeback:ischargeback
											},function(){
												layer.alert('提交成功');
												$('#J_btn_button button').hide();
												$('#J_formnone').hide();
												$('#J_btnEntry').prop('disabled',true);
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
							}
							if(datavalbutton == 'toReject'){
								jsonPostAjax(basePath+'/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=toReject',{
									formId:result.data.chargebakcid,
									noPass:0,
									comment:$('#J_auditrecordcontent').val(),
									taskId:taskId,
								    isChargeback:ischargeback,
								},function(){
									layer.alert('提交成功');
									$('#J_btn_button button').hide();
									$('#J_formnone').hide();
									$('#J_btnEntry').prop('disabled',true);
								});
							}
							if(datavalbutton == 'noPass'){
								jsonPostAjax(basePath+'/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=toReject',{
									formId:result.data.chargebakcid,
									noPass:1,
									comment:$('#J_auditrecordcontent').val(),
									taskId:taskId,
								    isChargeback:ischargeback,
								},function(){
									layer.alert('提交成功');
									$('#J_btn_button button').hide();
									$('#J_formnone').hide();
									$('#J_btnEntry').prop('disabled',true);
								});
							}
							if(datavalbutton == 'toRejectLastStep'){
								jsonPostAjax(basePath+'/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=toRejectLastStep',{
									taskId:taskId,
									comment:$('#J_auditrecordcontent').val(),
								    isChargeback:ischargeback,
								},function(){
									layer.alert('提交成功');
									$('#J_btn_button button').hide();
									$('#J_formnone').hide();
									$('#J_btnEntry').prop('disabled',true);
								});
							}
						}
					}
				)
			//加载录入责任人弹出框
			$('#J_btnEntry').off().on('click',function(){
				// 加载选择员工数据
				commonContainer.modal(
					'录入责任人',
					$('#audit_by_layer'),
					function(index, layero) {
						var reason = $('#J_reason').val();
						var popuser = $('#J_popuser').attr('data-id');
						var amount = $('#J_amount').val();
						var dealResult = $('#J_dealResult').val();
						var remark = $('#J_layertextarearemark').val();
						
						if(reason==''){
							layer.alert('必填项责任原因不能为空');
							return false;
						}
						if(popuser==''){
							layer.alert('必填项责任人不能为空');
							return false;
						}
						if(amount==''){
							layer.alert('必填项惩罚金额不能为空');
							return false;
						}
						if(dealResult==''){
							layer.alert('必填项处理结果不能为空');
							return false;
						}
						if(remark==''){
							layer.alert('必填项备注不能为空');
							return false;
						}
						jsonPostAjax(
							basePath + '/sign/chargeback/addChargebackResp',
							{
								"chargebackId":result.data.chargebakcid,
								"reason":reason,
								"amount":amount,
								"dealResult":dealResult,
								"remark":remark,
								"userid":popuser,
								"isvalid":1
								
							},
							function(resultdata) {
								var chargebackId = result.data.chargebakcid;
								trace(chargebackId);
							}
						);
						layer.close(index);
					}, 
					{
						overflow :false,
						area : ['650px'],
						btns : ['确定', '取消'],
						success: function() {
							$('#J_popuser').val('');
							$('#J_popuser').trigger("chosen:updated");
							$('#J_reason').val('');
							$('#J_amount').val('');
							$('#J_layertextarearemark').val('');
							$('#J_dealResult').val('');
							$('#J_dealResult').trigger("chosen:updated");
							searchContainer.searchUserListByComp($("#J_popuser"), true, 'left');
						}
					}
				);
			})
			
			// 删除录入责任人数据
			$('#J_servicedataTable').delegate('a','click',function(event) {
				var _this=this;
				if (this.type == 'del') {// 根据type 判断 审核
					var dataid = $(this).attr('data-id');
					commonContainer.confirm(
						'是否确认删除此条数据？',
						function(index, layero){
							 jsonGetAjax(
								basePath + '/sign/chargeback/deleteChargebackResp',
								{"id" : dataid},
								function(){
									layer.msg("删除成功");
									jQuery('#J_servicedataTable').bootstrapTable('refresh');
								}
							)
						}
					);	
				}
				if (this.type == 'editor') {// 根据type 判断 审核
					var dataid = $(_this).data('id');
					// 加载选择员工数据
					commonContainer.modal(
						'修改责任人',
						$('#audit_by_layer'),
						function(index, layero) {
							jsonPostAjax(
								basePath + '/sign/chargeback/updateChargebackResp',
								{
									"chargebackId":result.data.chargebakcid,
									"reason":$('#J_reason').val(),
									"amount":$('#J_amount').val(),
									"dealResult":$('#J_dealResult').val(),
									"remark":$('#J_layertextarearemark').val(),
									"userid":$('#J_popuser').attr('data-id'),
									"isvalid":1,
									"id":dataid
									
								},
								function(resultmap) {
									var chargebackId = result.data.chargebakcid;
									trace(chargebackId);
								}
							);
							layer.close(index);
						}, 
						{
							overflow :false,
							area : ['650px'],
							btns : ['确定', '取消'],
							success: function() {
								var reason = $(_this).data('reason');
								var amount = $(_this).data('amount');
								var remark = $(_this).data('remark');
								var dealResult = $(_this).data('dealresult');
								var popuser = $(_this).data('username');
								$('#J_reason').val(reason);
								$('#J_amount').val(amount);
								$('#J_layertextarearemark').val(remark);
								$("#J_popuser").val(popuser);
								searchContainer.searchUserListByComp($("#J_popuser"), true, 'left');
								//处理结果
								$('#J_dealResult').val(dealResult);
								$('#J_dealResult').trigger("chosen:updated");
							}
						}
					);
				}
			})

		});
	},
	//附件列表
	fileList:function(){
		var _this=this;
		$('#attachmentList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/sign/chargeback/chargebackEnclosureList.htm',
			method:'get',
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			cache: false,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params){
				return{
					chargebackId:chargebackId,
					pageSize:params.limit,
					pageIndex:params.offset / params.limit+ 1
				};
			},
			responseHandler: function(result) {
				if (result.code == 0 && result.data && result.data.totalcount> 0){
					return {
						'rows': result.data.list, 
						'total': result.data.totalcount
					}
				}
				return {
					'rows': [],
					'total': 0
				}	
			},
			columns:[
				{
					field : 'rownum',
					title : '序号',
					align : 'center'
				},
				{
					field : 'typeValue',
					title : '附件类型',
					align : 'center'
				},
				{
					field : 'createTime',
					title : '最新上传日期',
					align : 'center'
				},
				{
					field : 'createByuserName',
					title : '最新上传人',
					align : 'center'
				},
				{
					field : 'remark',
					title : '备注',
					align : 'center'
				},
				{
					field : '',
					title : '操作',
					align : 'center',
					formatter:function(value,row){
						return '<button type="button" data-enclosureid="'+row.enclosureId+'" class="btn btn-outline btn-success btn-xs mt-3" onclick="chargebackDetailView.operationInfor(this,1)">查看</button>'
					}
				}
			]
		});
	},
	//查看附件信息 type=1 查看
	operationInfor:function(target,type){
		var _this=this;
		jsonGetAjax(basePath+'/sign/chargeback/chargebackCheckEnclosure.htm',{
			enclosureId:$(target).data('enclosureid')
		},function(rdata){
			commonContainer.modal(type==1?'查看附件':'修改附件',type==1?$('#seeInfor'):$('#attachmentCon'),function(i){
				if(type==1){
					layer.close(i);
				}else{
					_this.saveFile(target,i,1);
				}
			},{
				btns:type==1?['关闭']:['保存','取消'],
				area:'800px',
				success:function(){
					if(type==1){
						$('#fujianConten').html('');
						$('#fujianType').html(rdata.data.typeValue);
						if(rdata.data.enclosureList && rdata.data.enclosureList.length>0){
							var html='';
							$.each(rdata.data.enclosureList,function(i,n){
								html+='\
					    			<div class="col-md-3" style="padding-top:12px;text-align: center;" data-filename="" data-filepath="">\
					    				<img src="'+n.filePath+'" width="80%" height="100">\
					    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+n.fileName+'</div>\
					    				<button type="button" data-opt="del" class="btn btn-outline btn-success btn-xs mt-3" onclick="auditbycustomerservice.download(\''+n.filePath+'\')">下载</button>\
				    				</div>';
							});
							$('#fujianConten').html(html);
						}
					}else{
						_this.popCalbank(rdata.data);
					}
				}
			});
		});
	},
	//下载文件
	download:function(filePath){
		window.open(basePath+'/sign/downloadEnclosure.htm?filePath='+filePath);
	},
	// 补充协议
	queryList:function(contracconId){
		$('#retreatList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/sign/chargeback/suppleAttachList.htm',
			method:'get',
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			cache: false,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var data=$('#J_seeQuery').serializeObject();
				var deptId=$('#J_deptName').attr('data-id');
				if(deptId!==''){
					data.deptid=deptId;		//所属部门id
				}
				data.conId=contracconId;
				data.pagesize = params.limit;
				data.pageindex = params.offset / params.limit+ 1;
				return data;
			},
			responseHandler: function(result) {
				if (result.code == 0 && result.data && result.data.totalcount> 0){
					return {
						'rows': result.data.list, 
						'total': result.data.totalcount
					}
				}
				return {
					'rows': [],
					'total': 0
				}	
			},
			columns:[
						{
							field : 'agrt_type',
							title : '类型',
							align : 'center'
						},
						{
							field : 'sign_number',
							title : '编号',
							align : 'center'
						},
						{
							field : 'dept_name',
							title : '经办部门',
							align : 'center'
						},
						{
							field : 'create_by_name',
							title : '经办人',
							align : 'center'
						},
						{
							field : 'audit_status',
							title : '状态',
							align : 'center'
						},
						{
							field : 'update_time',
							title : '最新状态时间',
							align : 'center'
						},
						{
							field : '',
							title : '操作',
							align : 'center',
							formatter:function(value,row){
								if(auditstatus==1 || auditstatus==undefined){
									return row.chargeback_id==undefined?'<button type="button" data-supplagrtid="'+row.suppl_agrt_id+'" class="btn btn-outline btn-danger btn-xs" onclick="supAgreementView.agreDelete(this)">删除</button>&nbsp;&nbsp':'-';
								}
								return '-';
							}
						}
			]
		});
	},
	//费用处理加载付款信息
	feiychul:function(chargebackIdNum){
		$('#J_cost_dataTable').bootstrapTable({
			url: basePath + '/sign/chargeback/getCostHandlePaymentListByChargeback',
			sidePagination: 'server',
			dataType: 'json',
			method:'get',
			pagination: false,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var o = new Object();
				o.chargebackId = chargebackIdNum;
				o.timestamp = new Date().getTime();
				return o;
			},
			responseHandler: function(result){
				if(result.code == 0 && result.data) {
					return { "rows": result.data}
				}
				return { "rows": []} 
			},
			columns: [ 	
		           	{field: 'SerialNumber',title :'序号',align: 'center',
		           		formatter: function(value, row, index) {
		      				return index+1;
		      	    	}
		           	},
		            {field: 'strPaymentType', title: '费用类型', align: 'center'},
				    {field: 'applyId', title: '单据号', align: 'center',
		            	formatter: function(value, row, index) {
		            		var url = '';
		      				var html = '';
		      				var applyId = value?value:'-';
		      				var paymentType = row.paymentType?row.paymentType:'-';
		      				if(paymentType == '1'){
		      					url=basePath+"/finance/payment/apply/detail.htm?paymentType="+row.paymentType+"&applyId="+row.applyId;
		      				}else if(paymentType == '2'){
		      					url=basePath+"/finance/payment/apply/detail.htm?paymentType="+row.paymentType+"&applyId="+row.applyId;
		      				}else if(paymentType == '3'){
		      					url=basePath+"/finance/payment/apply/detail.htm?paymentType="+row.paymentType+"&applyId="+row.applyId;
		      				}
		      				html = '<a href="'+url+'" target="_blank">'+ row.applyId +'</a>';
		      				return html;
		      	    	}
				    },
				    {field: 'fundName', title: '款项名称', align: 'center'},
				    {field: 'strPayee', title: '承担单位', align: 'center'},
				    {field: 'strPayer', title: '收款方', align: 'center'},
				    {field: 'receiverName', title: '收款人', align: 'center'},
				    {field: 'newContractNumber', title: '转入合同', align: 'center',
				    	formatter: function(value, row, index) {
				    		if(value!=undefined){
				    			var html = '';
			      				var url = basePath+"/sign/contractSales/draftdetail.htm?conId="+row.newContractId;
			      				html = '<a href="'+url+'" target="_blank">'+ row.newContractNumber +'</a>';
			      				return html;
				    		}else{
				    			return html='<a href="'+url+'" target="_blank">-</a>';
				    		}
		      	    	}
				    },
				    {field: 'payAmount', title: '金额/元', align: 'center',
				    	formatter: function(value, row, index) {
				    		payAmount = value?value:'-';
				    		if(value != undefined){
				    			jine+=value*1;
					    		$('#J_yingfu').val(jine);
				    		}
			    			return payAmount;
		      	    	}
				    },
				    {field: 'payTime', title: '付款日期', align: 'center'},
				    {field: 'accountHolder', title: '开户人姓名<br>银行账户', align: 'center',
				    	formatter: function(value, row, index) {
					    	var html = '';
		      				var accountHolder = row.accountHolder ? row.accountHolder : '-';
		      				var bankAccount = row.bankAccount ? row.bankAccount : '-';
		      				html =accountHolder+'<br>'+bankAccount;
				    		return html;
					    }
				    },
				    {field: 'strAccountHolderCardType', title: '开户人证件类型<br>证件编号', align: 'center',
				    	formatter: function(value, row, index) {
					    	var html = '';
		      				var strAccountHolderCardType = row.strAccountHolderCardType ? row.strAccountHolderCardType : '-';
		      				var accountHolderCardNumber = row.accountHolderCardNumber ? row.accountHolderCardNumber : '-';
		      				html =strAccountHolderCardType+'<br>'+accountHolderCardNumber;
				    		return html;
					    }
				    },
				    {field: 'strPayType', title: '支付方式', align: 'center'},
				    {field: 'opt', title: '操作', align: 'center',
				    	formatter: function(value, row, index) {	
		      				var html = '';
		      				if(strauditstatus == '5'){
		      					html = '<a id="J_businesstype" data-paymentType="'+row.paymentType+'" data-applyId="'+row.applyId+'" type="editer" class="btn btn-outline btn-success btn-xs">修改</a>&nbsp;&nbsp;'
		      				}else if(strauditstatus == '1'){
		      					html = '<a id="J_businesstype" data-paymentType="'+row.paymentType+'" data-applyId="'+row.applyId+'" type="editer" class="btn btn-outline btn-success btn-xs">修改</a>&nbsp;&nbsp;'
      							+'<a id="J_businesstype" type="del" class="btn btn-outline btn-danger btn-xs">删除</a>'
		      				}else{
		      					html = '';
		      				}
		      					
		      				return html;
		      	    	}
				    }
				]
		});
		
		//加载收款信息
		$('#J_costreceipt_dataTable').bootstrapTable({
			url: basePath + '/sign/chargeback/getCostHandleReceiptListByChargeback',
			sidePagination: 'server',
			dataType: 'json',
			method:'get',
			pagination: false,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var o = new Object();
				o.chargebackId = chargebackIdNum;
				o.timestamp = new Date().getTime();
				return o;
			},
			responseHandler: function(result){
				if(result.code == 0 && result.data) {
					return { "rows": result.data}
				}
				return { "rows": []} 
			},
			columns: [ 	
			           	{field: 'SerialNumber',title :'序号',align: 'center',
			           		formatter: function(value, row, index) {
			      				return index+1;
			      	    	}
			           	},
			            {field: 'strPaymentType', title: '费用类型', align: 'center'},
					    {field: 'receiptNumber', title: '收据编号', align: 'center',
			            	formatter: function(value, row, index) {	
			      				var html = '';
			      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
			      				html = '<a href="'+url+'" target="_blank">'+ row.receiptNumber +'</a>';
			      				return html;
			      	    	}
					    },
					    {field: 'batchId', title: '收款批次单号', align: 'center',
					    	formatter: function(value, row, index) {	
			      				var html = '';
			      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
			      				html = '<a href="'+url+'" target="_blank">'+ row.batchId +'</a>';
			      				return html;
			      	    	}
					    },
					    {field: 'fundName', title: '款项名称', align: 'center'},
					    {field: 'strPayee', title: '收款单位', align: 'center'},
					    {field: 'strPayer', title: '付款方', align: 'center'},
					    {field: 'payerName', title: '付款单位/个人', align: 'center'},
					    {field: 'amount', title: '金额/元', align: 'center',
					    	formatter: function(value, row, index) {
					    		payAmount = value?value:'-';
					    		if(row.amount != undefined){
						    		jine+=value*1;
						    		$('#J_yingshou').val(jine);
					    		}
				    			return payAmount;
			      	    	}
					    },
					    {field: 'collectionTime', title: '收款日期', align: 'center'},
					    /*{field: 'opt', title: '操作', align: 'center',
					    	formatter: function(value, row, index) {	
			      				var html = '';
			      					html = '<a id="J_businesstype" type="detail" class="btn btn-outline btn-success btn-xs">修改</a>&nbsp;&nbsp;'
			      							+'<a id="J_businesstype" type="detail" class="btn btn-outline btn-danger btn-xs">删除</a>'
			      				return html;
			      	    	}
					    }*/
					]
		});
	},
	
	// 审批流程
	shenpilichen:function(){
		//初始根据taskId获取单据编号
		jsonPostAjax(basePath + '/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=getParamsByTaskId',{	
			"taskId":taskId							
		}, function(result) {
			
			chargebackDetailView.init(result.data.signnum);
		});

		//标签table切换 所展示的数据总方法
		var chargebackDetailView={
			init:function(signnumber){
				var _$this = this;
				this.getDetai(signnumber);
			},
			
			getDetai:function(signnumber){
				var _this=this;
				jsonGetAjax(basePath+'/sign/chargeback/chargebackdetail.htm',{
					signnumber:signnumber			//单据编号
				},function(result){
					_this.chargebackId = result.data.chargebakcid;
					var contractNumber = result.data.contractcode;
					var type = '';
					if(result.data.strbusinesstype=='租赁'){
						type = 'RENT_CHARGEBACK'; // 
					}else if(result.data.strbusinesstype=='买卖'){
						type = 'BUY_CHARGEBACK';
					}
					
					jsonPostAjax(basePath+'/workflow/doJob?modelName='+type+'&methodName=getFlowChartUrlByBusiness',{			
					    formId:_this.chargebackId
					},function(result){
						$('#J_srcimg').attr('src',result.data[type]);
					});
					jsonGetAjax(
							basePath+'/sign/chargeback/findAllHistoryList',
							{			
								type:type,
								formId:_this.chargebackId
							},
							function(resultdata){
								var list = []; // [ [] , [item , item] , [item , item] ]
								var cache = {};
								resultdata.data.forEach(function(item){
									var historyList = cache[item.processInstanceId];
									if(!historyList){
										historyList = cache[item.processInstanceId] = [];
										list.push(historyList);
									}
									if(!item.createtime){
										historyList.unshift(item);
									}else{
										historyList.push(item);	
									}
								});
								list.forEach(function(historyList){
									var index=1;
									var tabevaluationHtml='\
										<table id="J_evaluationtable_dataTable" class="table table-hover table-striped table-bordered">\
											<thead>\
											<tr>\
												<th data-field="">\
													<div class="th-inner" class="col-sm-1">序号</div>\
												</th>\
												<th data-field="" class="col-sm-3">\
													<div class="th-inner">审批部门</div>\
												</th>\
												<th data-field="" class="col-sm-1">\
													<div class="th-inner">角色</div>\
												</th>\
												<th data-field="" class="col-sm-1">\
													<div class="th-inner">审批人</div>\
												</th>\
												<th data-field="" class="col-sm-1">\
													<div class="th-inner">审批时间</div>\
												</div>\
												</th>\
												<th data-field="" class="col-sm-2">\
													<div class="th-inner">审批结果</div>\
												</th>\
												<th data-field="" class="col-sm-2">\
													<div class="th-inner">审批意见</div>\
												</th>\
												<th data-field=""  class="col-sm-1">\
													<div class="th-inner">审批持续时间</div>\
												</th>\
											</tr>\
										</thead>\
										<tbody>';
									historyList.forEach(function(value){
										var createtime = value.createtime;
										var usedtime = value.usedtime;
										if(createtime == undefined){
											createtime = '-';
										};
										if(usedtime == undefined){
											usedtime = '-';
										}
										tabevaluationHtml+='<tr>\
															<td>'+(index++)+'</td>\
															<td>'+value.deptname+'</td>\
															<td>'+value.rolename+'</td>\
															<td>'+value.username+'</td>\
															<td>'+createtime+'</td>\
															<td>'+value.result+'</td>\
															<td>'+value.comment+'</td>\
															<td>'+usedtime+'</td>\
														</tr>';
									})
									tabevaluationHtml+='</tbody></table>';
									$('#J_dataTable').append(tabevaluationHtml);
								});
							}
						)
				});
			}
		}
	}
}

// 审批流程创建审批按钮
var templateId = getQueryString('templateId');
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

function trace(chargebackId){
	$('#J_servicedataTable').bootstrapTable({ 
		url:basePath + '/sign/chargeback/selectChargebackResp',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: false,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = new Object();
			o.timestamp = new Date().getTime();
			o.chargebackId = chargebackId;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data) {
				return { "rows": result.data}
			}
			return { "rows": []} 
		},
	
		columns:[		
					{field: 'orderNum', title: '序号', align: 'center'},
					{field: 'reason', title: '责任原因', align: 'center'},
		      	    {field: 'username', title: '责任人', align: 'center'},
		      	    {field: 'amount', title : '惩罚金额/元', align : 'center'},
		      	  	{field: 'dealResultValue', title: '处理结果', align: 'center'},
		      	  	{field: 'remark', title : '备注', align : 'center'},
		      	  	{field: 'opt', title: '操作', align: 'center',
				    	formatter: function(value, row) {
		      				var html = '';
				    		if (!t) {
		      					html = '<div class="text-left"><a type="editor" class="btn btn-outline btn-success btn-xs" data-username="'+row.username+'" data-remark="'+row.remark+'" data-dealResult="'+row.dealResult+'" data-amount="'+row.amount+'" data-reason="'+row.reason+'" data-id="'+row.id+'">修改</a>&nbsp;&nbsp;'
		      						  +'<a type="del" class="btn btn-outline btn-danger btn-xs" data-id="'+row.id+'">删除</a></div>'
				    		}
		      				return html;
		      	    	}
				    	
				    }
		      	],
	})
	$('#J_servicedataTable').bootstrapTable('refresh',{ url: basePath + '/sign/chargeback/selectChargebackResp' });
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 