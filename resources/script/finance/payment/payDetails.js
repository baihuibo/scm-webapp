//付款详情
$(function(){
	payDetailsView.init();
});
var payDetailsView={
	baseLock:false,
	approLock:false,
	init:function(){
		var _this=this;
		//console.log(_this.getURLData());
		var urlData=_this.getURLData();
		if(urlData.paymentId==undefined){
			//根据taskId获取paymentId
			$.ajax({
				url : basePath+'/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=getParamsByTaskId',
				data : JSON.stringify({taskId:urlData.taskId}),
				type : 'post',
				async:false,
				dataType : 'json',
				cache : false,
				contentType : 'application/json ; charset=utf-8',
				success : function(result) {
					if(result.code == '0'){
						urlData.paymentId=result.data.formId;
					}else{
						layer.alert(result.msg);
					}
				},
				error : function (){
		            layer.alert(errorMsg);
		        }
			});
		}
		//获取付款单基本信息
		jsonGetAjax(basePath+'/finance/payment/getPaymentInfo.htm',{
			paymentId:urlData.paymentId	//付款单id
		},function(data){
			_this.baseCallback(data);
			if(urlData.templateId!==undefined){
				//获取审批按钮
				jsonGetAjax(basePath + '/workflow/selectShowLabelBytemplateId',{
					templateId:urlData.templateId
				},function(result){
					if(result.data && result.data.length>0){
						var htmlbutton = '';
						$.each(result.data,function(i,n){
							htmlbutton += '<button type="button" class="btn btn-success btn-altogether btn_size" data-labelid="'+n.labelId+'">'+n.labelName+'</button>';
						});
						$('#examBtns').show().html(htmlbutton);
						//给按钮添加事件
						$('#examBtns button').off().on('click',function(){
							_this.addEvent($(this).data('labelid'),urlData);
						});
					}
				});
			}
			//打印预览
			$('#printPreBtn').off().on('click',function(){
				//打开打印模板页面
				var templateUrl=basePath+'/finance/payment/printinfo.htm?paymentId='+urlData.paymentId;
				if(/^(返信息费|签约差旅费)$/.test(data.data.fundName)){
					templateUrl+='&backCost=1';
				}
				window.open(templateUrl);
			});
		});
		//基本信息
		$('#payDetailBtn').off().on('click',function(){
			if(_this.baseLock){
				return false;
			}else{
				_this.baseLock=false;
			}
			jsonGetAjax(basePath+'/finance/payment/getPaymentInfo.htm',{
				paymentId:urlData.paymentId		//付款单id
			},function(data){
				_this.baseCallback(data);
			},{
				completeCallBack:function(){
					_this.baseLock=false;
				}
			});
		});
		//审批历史
		$('#approhisBtn').off().on('click',function(){
			if(_this.approLock){
				return false;
			}else{
				_this.approLock=true;
			}
			//审批历史流程图
			jsonPostAjax(basePath+'/workflow/doJob?modelName=FINANCE_PAYMENT&methodName=getFlowChartUrlByBusiness',{
				formId:urlData.paymentId	//付款单id
			},function(result){
				if(!result.data.FINANCE_PAYMENT){
					return $('#flowchart').html('暂无审批历史');
				}
				console.log(result+'+'+result.data.FINANCE_PAYMENT);
				$('#flowchart').html('<iframe src="'+result.data.FINANCE_PAYMENT+'" style="width:100%;height:560px;"></iframe>');
				//审批历史列表
				jsonGetAjax(basePath+'/finance/payment/approve/findPaymentHistoryList.htm',{
					type:'FINANCE_PAYMENT',
					formId:urlData.paymentId
				},function(result){			
					$('#apprHistoryList').bootstrapTable('destroy').bootstrapTable({
						data:result.data,
						columns:[	         
							{
								field : '',
								title : '流程序号',
								align : 'center',
								formatter:function(value,row,index){
									return ++index;
								}
							},
							{
								field : 'deptname',
								title : '审批部门',
								align : 'center'
							},
							{
								field : 'rolename',
								title : '角色',
								align : 'center'
							},
							{
								field : 'username',
								title : '审批人',
								align : 'center'
							},
							{
								field : 'createtime',
								title : '审批时间',
								align : 'center'
							},
							{
								field : 'result',
								title : '审批结果',
								align : 'center'
							},
							{
								field : 'comment',
								title : '审批意见',
								align : 'center'
							},
							{
								field : 'usedtime',
								title : '审批持续时间',
								align : 'center'
							}
						]
					});			
				});
			},{
				completeCallBack:function(){
					_this.approLock=false;
				}
			});
			
		});
		//操作日志
		$('#operaLogBtn').off().on('click',function(){
			$('#operaLogTab').bootstrapTable('destroy').bootstrapTable({
				url:basePath+'/finance/payment/getPaymentOperationList.htm',
				method:'post',
				sidePagination:'server',
				dataType:'json',
				pagination: true,
				striped:true,
				pageSize:10,
				pageList:[10, 20, 50],
				queryParams: function (params) {
					return {
						  pageindex: params.offset / params.limit+ 1,
						  pagesize: params.limit,
						  sourceId: urlData.paymentId,			//来源ID(paymentId)
						  sourceType:4					//来源类型：1，财务查账；2，发票；3，付款申请；4，付款
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
						field : 'rowNum',
						title : '序号',
						align : 'center',
						formatter:function(value,row,index){
							return ++index;
						}
					},
					{
						field : 'createByName',
						title : '操作人',
						align : 'center'
					},
					{
						field : 'createByPositionName',
						title : '岗位',
						align : 'center'
					},
					{
						field : 'deptName',
						title : '所属部门',
						align : 'center'
					},
					{
						field : 'strType',
						title : '操作类型',
						align : 'center'
					},
					{
						field : 'content',
						title : '操作内容',
						align : 'center'
					},
					{
						field : 'createTime',
						title : '操作时间',
						align : 'center'
					}
				]
			});	
		});
		//是否审批
//		if(_this.urlData[1] && _this.urlData[1].split('=')[1]==1){
//			$('#examBtns').show();
//		}
	},
	//基本信息回调
	baseCallback:function(result){
		//判断合同类型 contractType 1租赁 2买卖
		var contractUrl='detail/detail';				//合同链接
		var customerUrl ='findleaseclientbycustomerid';	//客源链接
		var houseUrl='leasedetail';						//房源链接
				
		if(result.data.contractType==2){
			contractUrl='signthecontract/contractdetail';
			customerUrl='findbuyerclientbycustomerid';
			houseUrl='buydetail';
		}
		var html='\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">付款单号：</label>\
				<div class="col-sm-8 control-div">'+(result.data.paymentNumber==undefined?'':result.data.paymentNumber)+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">申请单编号：</label>\
				<div class="col-sm-8 control-div">'+(result.data.applyNumber==undefined?'':'<a href="'+basePath+'/finance/payment/apply/detail.htm?paymentType='+result.data.paymentType+'&applyId='+result.data.applyId+'" target="_blank" style="text-decoration:underline">'+result.data.applyNumber+'</a>')+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">业务来源：</label>\
				<div class="col-sm-8 control-div">'+(result.data.strPaymentType==undefined?'':result.data.strPaymentType)+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">是否来源于退单：</label>\
				<div class="col-sm-8 control-div">'+(result.data.strIsFromChargeBack==undefined?'':result.data.strIsFromChargeBack)+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">'+(result.data.payType==1?'现金索引码：':'')+'</label>\
				<div class="col-sm-8 control-div">'+(result.data.serialNumber==undefined?'':result.data.serialNumber)+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">合同编号：</label>\
				<div class="col-sm-8 control-div">'+(result.data.contractNumber==undefined?'':'<a href="'+basePath+'/sign/'+contractUrl+'.html?conid='+result.data.contractId+'" target="_blank" style="text-decoration:underline">'+result.data.contractNumber+'</a>')+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">房源编号：</label>\
				<div class="col-sm-8 control-div">'+(result.data.houseId==undefined?'':'<a href="'+basePath+'/house/main/'+houseUrl+'.htm?houseid='+result.data.houseId+'" target="_blank" style="text-decoration:underline">'+result.data.houseId+'</a>')+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">业主名称：</label>\
				<div class="col-sm-8 control-div">'+(result.data.ownerName==undefined?'':result.data.ownerName)+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">客户编号：</label>\
				<div class="col-sm-8 control-div">'+(result.data.clientId==undefined?'':'<a href="'+basePath+'/customer/main/'+customerUrl+'.htm?customerId='+result.data.customerId+'" target="_blank" style="text-decoration:underline">'+result.data.clientId+'</a>')+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">客户名称：</label>\
				<div class="col-sm-8 control-div">'+(result.data.clientName==undefined?'':result.data.clientName)+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">款项名称：</label>\
				<div class="col-sm-8 control-div">'+(result.data.fundName==undefined?'':result.data.fundName)+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">付款方式：</label>\
				<div class="col-sm-8 control-div">'+(result.data.strPayType==undefined?'':result.data.strPayType)+'</div></div></div>\
			</div>';
		//付款方式    1，现金；2，支票；3，转账；4；退POS（退款使用） ,
		if(result.data.payType==1){
			html+='\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strReceiverType==undefined?'':result.data.strReceiverType)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人：</label>\
					<div class="col-sm-8 control-div">'+(result.data.receiverName==undefined?'':result.data.receiverName)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人证件类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strReceiverCardType==undefined?'':result.data.strReceiverCardType)+'</div></div></div>\
				</div>\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人证件号码：</label>\
					<div class="col-sm-8 control-div">'+(result.data.receiverCardNumber==undefined?'':result.data.receiverCardNumber)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">领款人类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strPayeeType==undefined?'':result.data.strPayeeType)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">领款人：</label>\
					<div class="col-sm-8 control-div">'+(result.data.payeeName==undefined?'':result.data.payeeName)+'</div></div></div>\
				</div>\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">领款人证件类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strPayeeCardType==undefined?'':result.data.strPayeeCardType)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">领款人证件号码：</label>\
					<div class="col-sm-8 control-div">'+(result.data.payeeCardNumber==undefined?'':result.data.payeeCardNumber)+'</div></div></div>\
				</div>';
		}else if(result.data.payType==2){
			html+='\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strReceiverType==undefined?'':result.data.strReceiverType)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人：</label>\
					<div class="col-sm-8 control-div">'+(result.data.receiverName==undefined?'':result.data.receiverName)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人证件类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strReceiverCardType==undefined?'':result.data.strReceiverCardType)+'</div></div></div>\
				</div>\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人证件号码：</label>\
					<div class="col-sm-8 control-div">'+(result.data.receiverCardNumber==undefined?'':result.data.receiverCardNumber)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">出票单位：</label>\
					<div class="col-sm-8 control-div">'+(result.data.receiverUnit==undefined?'':result.data.receiverUnit)+'</div></div></div>\
				</div>';
		}else if(result.data.payType==3){
			html+='\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strReceiverType==undefined?'':result.data.strReceiverType)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人：</label>\
					<div class="col-sm-8 control-div">'+(result.data.receiverName==undefined?'':result.data.receiverName)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人证件类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strReceiverCardType==undefined?'':result.data.strReceiverCardType)+'</div></div></div>\
				</div>\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">收款人证件号码：</label>\
					<div class="col-sm-8 control-div">'+(result.data.receiverCardNumber==undefined?'':result.data.receiverCardNumber)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">开户人：</label>\
					<div class="col-sm-8 control-div">'+(result.data.accountHolder==undefined?'':result.data.accountHolder)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">开户人证件类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strAccountHolderCardType==undefined?'':result.data.strAccountHolderCardType)+'</div></div></div>\
				</div>\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">开户人证件号码：</label>\
					<div class="col-sm-8 control-div">'+(result.data.accountHolderCardNumber==undefined?'':result.data.accountHolderCardNumber)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">账号类型：</label>\
					<div class="col-sm-8 control-div">'+(result.data.strBankAccountKind==undefined?'':result.data.strBankAccountKind)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">账号：</label>\
					<div class="col-sm-8 control-div">'+(result.data.bankAccount==undefined?'':result.data.bankAccount)+'</div></div></div>\
				</div>\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">开户行：</label>\
					<div class="col-sm-8 control-div">'+(result.data.openBank==undefined?'':result.data.openBank)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">银行名称：</label>\
					<div class="col-sm-8 control-div">'+(result.data.bankBranchName==undefined?'':result.data.bankBranchName)+'</div></div></div>\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">开户行所在地：</label>\
					<div class="col-sm-8 control-div">'+(result.data.bankProvince==undefined?'':result.data.bankProvince)+
					(result.data.bankCity==undefined?'':result.data.bankCity)+'</div></div></div>\
				</div>\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">联行号：</label>\
					<div class="col-sm-8 control-div">'+(result.data.lineNumber==undefined?'':result.data.lineNumber)+'</div></div></div>\
				</div>';
		}
		html+='\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">应付款金额：</label>\
				<div class="col-sm-8 control-div">'+(result.data.payAmount==undefined?'':result.data.payAmount + '元')+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">应付日期：</label>\
				<div class="col-sm-8 control-div">'+(result.data.payTime==undefined?'':result.data.payTime.split(' ')[0])+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">审批状态：</label>\
				<div class="col-sm-8 control-div">'+(result.data.strAuditStatus==undefined?'':result.data.strAuditStatus)+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">付款状态：</label>\
				<div class="col-sm-8 control-div">'+(result.data.strPayStatus==undefined?'':result.data.strPayStatus)+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">'+(result.data.payStatus==3?'付款失败原因：':'')+'</label>\
				<div class="col-sm-8 control-div">'+(result.data.payStatus==3?(result.data.payFailedReason==undefined?'':result.data.payFailedReason):'')+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">实付金额：</label>\
				<div class="col-sm-8 control-div">'+((result.data.realPayAmount==undefined || result.data.payStatus==3)?'':result.data.realPayAmount + '元')+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">实付日期：</label>\
				<div class="col-sm-8 control-div">'+(result.data.realPayTime==undefined?'':result.data.realPayTime.split(' ')[0])+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">'+(result.data.payType==2?'付款支票号：':'')+'</label>\
				<div class="col-sm-8 control-div text-nowrap">'+(result.data.payType==2?(result.data.payerAccount==undefined?'':result.data.payerAccount):'')+'</div></div></div>\
			</div>';
			if(result.data.payType==3){
				html+='\
					<div class="row">\
						<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">付款账号：</label>\
						<div class="col-sm-8 control-div">'+(result.data.payerAccount==undefined?'':result.data.payerAccount)+'</div></div></div>\
						<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">付款户名：</label>\
						<div class="col-sm-8 control-div">'+(result.data.payerName==undefined?'':result.data.payerName)+'</div></div></div>\
						<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">付款开户行：</label>\
						<div class="col-sm-8 control-div">'+(result.data.payerOpenBank==undefined?'':result.data.payerOpenBank)+'</div></div></div>\
					</div>';
			}
			html+='\
				<div class="row">\
					<div class="col-sm-4"><div class="form-group"><label class="col-sm-3 control-label">付款变更情况：</label>\
					<div class="col-sm-8 control-div">'+(result.data.changeDesc==undefined?'':result.data.changeDesc)+'</div></div></div>\
				</div>';
		$('#basicInfor').html(html);
		if(result.data.payType==4){
			$('#posCont').show();
			var totalAmount=null;
			$('#POSlist').bootstrapTable('destroy').bootstrapTable({
				data:result.data.posCollectList,
				columns:[
					{
						field : 'collectionId',
						title : '收款编号',
						align : 'center'
					},
					{
						field : 'paymentTime',
						title : '原刷卡日期',
						align : 'center'
					},
					{
						field : 'terminalNumber',
						title : '原刷卡终端号',
						align : 'center'
					},
					{
						field : 'amount',
						title : '原刷卡金额',
						align : 'center'
					},
					{
						field : 'payerAccountNo',
						title : '原刷卡卡号',
						align : 'center'
					},
					{
						field : 'transNumber',
						title : '原12位参考号',
						align : 'center'
					},
					{
						field : 'payerName',
						title : '原刷卡人姓名',
						align : 'center'
					},
					{
						field : 'refundAmount',
						title : '本POS退款金额',
						align : 'center',
						formatter:function(value){
							totalAmount+=value*1;
							$('#totalAmount').html(totalAmount);
						}
					}
				]
			});
		}
	},
	//获取链接数据
	getURLData:function (){
		if(location.search){
			var objData={};
			var jieArr=[];
			var dataStr=location.search.substring(1);
			dataStr=dataStr.split('&');
			for(var i=0;i<dataStr.length;i++){
				jieArr=dataStr[i].split('=');
				objData[jieArr[0]]=jieArr[1]
			}
			return objData;
		}
	},
	//添加审批事件
	addEvent:function(labelid,obj){
		var _this=this;
		switch (labelid){
		case 'toPass':
			jsonPostAjax(basePath+'/workflow/doJob?modelName=FINANCE_PAYMENT&methodName=toPass',{
			    taskId:obj.taskId,
			    formId:obj.paymentId,
			    isEnd:obj.isEnd==undefined?'':obj.isEnd,
			    isFinance:obj.isFinance==undefined?0:obj.isFinance,
			    isCashier:obj.isCashier==undefined?0:obj.isCashier
			},function(){
				layer.alert('提交成功');
				jsonGetAjax(basePath+'/finance/payment/getPaymentInfo.htm',{
					paymentId:obj.paymentId	//付款单id
				},function(data){
					_this.baseCallback(data);
				});
				$('#examBtns').hide();
			});
		  break;
		case 'toReject':
			jsonPostAjax(basePath+'/workflow/doJob?modelName=FINANCE_PAYMENT&methodName=toReject',{
				formId:obj.paymentId,
				isEnd:obj.isEnd==undefined?'':obj.isEnd,
				isFinance:obj.isFinance==undefined?0:obj.isFinance,
				isCashier:obj.isCashier==undefined?0:obj.isCashier
			},function(){
				layer.alert('提交成功');
				jsonGetAjax(basePath+'/finance/payment/getPaymentInfo.htm',{
					paymentId:obj.paymentId	//付款单id
				},function(data){
					_this.baseCallback(data);
				});
				$('#examBtns').hide();
			});
		  break;
		case 'noPass':
			jsonPostAjax(basePath+'/workflow/doJob?modelName=FINANCE_PAYMENT&methodName=toReject',{
				taskId:obj.taskId,
				formId:obj.paymentId,
				isEnd:obj.isEnd==undefined?'':obj.isEnd,
				isFinance:obj.isFinance==undefined?0:obj.isFinance,
			    isCashier:obj.isCashier==undefined?0:obj.isCashier
			},function(){
				layer.alert('提交成功');
				jsonGetAjax(basePath+'/finance/payment/getPaymentInfo.htm',{
					paymentId:obj.paymentId	//付款单id
				},function(data){
					_this.baseCallback(data);
				});
				$('#examBtns').hide();
			});
		  break;
		case 'toRejectLastStep':
			jsonPostAjax(basePath+'/workflow/doJob?modelName=FINANCE_PAYMENT&methodName=toRejectLastStep',{
				taskId:obj.taskId,
				isEnd:obj.isEnd==undefined?'':obj.isEnd
			},function(){
				layer.alert('提交成功');
				jsonGetAjax(basePath+'/finance/payment/getPaymentInfo.htm',{
					paymentId:obj.paymentId	//付款单id
				},function(data){
					_this.baseCallback(data);
				});
				$('#examBtns').hide();
			});
		  break;
		}
	}
}