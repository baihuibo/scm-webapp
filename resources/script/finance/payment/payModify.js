//付款修改
$(function(){
	payModifyView.init();
});
var payModifyView={
	urlData:location.search.split('&'),
	baseLock:false,
	approLock:false,
	init:function(){
		var _this=this;
		var paymentId=_this.urlData[0].split('=')[1];
		//获取付款单基本信息
		jsonGetAjax(basePath+'/finance/payment/getPaymentInfo.htm',{
			paymentId:paymentId	//付款单id
		},function(data){
			_this.baseCallback(data);
			//提交
			$('#submitBtn').off().on('click',_this.submit.bind(_this,paymentId,data.data));
			//取消
			$('#cancelBtn').off().on('click',function(){
				window.opener=null;
				window.close();
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
				paymentId:paymentId		//付款单id
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
			jsonGetAjax(basePath+'/finance/payment/getPaymentAuditTrace.htm',{
				paymentId:paymentId	//付款单id
			},function(){
				
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
				singleSelect:true,			//设置单选
				clickToSelect:false,		//点击选中行
				striped:true,
				pageSize:10,
				pageList:[10, 20, 50],
				queryParams: function (params) {
					return {
						pageindex: params.offset / params.limit+ 1,
						pagesize: params.limit,
						sourceId: paymentId,			//来源ID(paymentId)
						sourceType: 4					//来源类型：1，财务查账；2，发票；3，付款申请；4，付款
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
	},
	//基本信息回调
	baseCallback:function(result){
		var _this=this;
		var html='\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">付款单号：</label>\
				<div class="col-sm-7 control-div">'+result.data.paymentNumber+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">申请单编号：</label>\
				<div class="col-sm-7 control-div">'+result.data.applyId+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">业务来源：</label>\
				<div class="col-sm-7 control-div">'+result.data.strPaymentType+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">是否来源于退单：</label>\
				<div class="col-sm-7 control-div">'+result.data.strIsFromChargeBack+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">合同编号：</label>\
				<div class="col-sm-7 control-div">'+result.data.contractNumber+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">房源编号：</label>\
				<div class="col-sm-7 control-div">'+result.data.houseId+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">业主名称：</label>\
				<div class="col-sm-7 control-div">'+result.data.ownerName+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">客户编号：</label>\
				<div class="col-sm-7 control-div">'+(result.data.clientId==undefined?'':result.data.clientId)+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">客户名称：</label>\
				<div class="col-sm-7 control-div">'+result.data.clientName+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">款项名称：</label>\
				<div class="col-sm-7 control-div">'+result.data.fundName+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">付款方式：</label>\
				<div class="col-sm-7">\
					<select name="payType" id="businesstype" class="J_chosen form-control">\
					</select>\
				</div></div></div>\
			</div>';
			//现金
			html+='\
				<div style="display:none;" id="xianjinCont">\
					<form id="xianjinContForm" class="form-horizontal" role="form">\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人类型：</label>\
							<div class="col-sm-7 control-div">'+(result.data.strReceiverType==undefined?'':result.data.strReceiverType)+'</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人：</label>\
							<div class="col-sm-7" id="xianjSkr">\
								<select name="receiverName" id="payeeName" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人证件类型：</label>\
							<div class="col-sm-7">\
								<select name="receiverCardType" id="zhenjType" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
						</div>\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人证件号码：</label>\
							<div class="col-sm-7">\
								<input type="text" name="receiverCardNumber" class="form-control editInput" id="receiverCardNumber" value="'+(result.data.receiverCardNumber==undefined?'':result.data.receiverCardNumber)+'">\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">领款人类型：</label>\
							<div class="col-sm-7 control-div">'+(result.data.strPayeeType==undefined?'':result.data.strPayeeType)+'</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">领款人：</label>\
							<div class="col-sm-7 control-div">'+(result.data.payeeName==undefined?'':result.data.payeeName)+'</div></div></div>\
						</div>\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">领款人证件类型：</label>\
							<div class="col-sm-7 control-div">'+(result.data.strPayeeCardType==undefined?'':result.data.strPayeeCardType)+'</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">领款人证件号码：</label>\
							<div class="col-sm-7 control-div">'+(result.data.payeeCardNumber==undefined?'':result.data.payeeCardNumber)+'</div></div></div>\
						</div>\
					</form>\
				</div>';
			//支票
			html+='\
				<div style="display:none;" id="zhipCont">\
					<form id="zhipContForm" class="form-horizontal" role="form">\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人类型：</label>\
							<div class="col-sm-7 control-div">'+(result.data.strReceiverType==undefined?'':result.data.strReceiverType)+'</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人：</label>\
							<div class="col-sm-7" id="zhipiaoSkr">\
								<select name="receiverName" id="payeeName1" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人证件类型：</label>\
							<div class="col-sm-7">\
								<select name="receiverCardType" id="zhenjType1" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
						</div>\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人证件号码：</label>\
							<div class="col-sm-7">\
								<input type="text" name="receiverCardNumber" class="form-control editInput" id="receCardNum" value="'+(result.data.receiverCardNumber==undefined?'':result.data.receiverCardNumber)+'">\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">出票单位：</label>\
							<div class="col-sm-7">\
								<input  type="text" name="receiverUnit" class="form-control editInput" id="receiverUnit" value="'+(result.data.receiverUnit==undefined?'':result.data.receiverUnit)+'">\
							</div></div></div>\
						</div>\
					</form>\
				</div>';
			//转账
			html+='\
				<div style="display:none;" id="zhuanzCont">\
					<form id="zhuanzContForm" class="form-horizontal" role="form">\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人类型：</label>\
							<div class="col-sm-7 control-div">'+(result.data.strReceiverType==undefined?'':result.data.strReceiverType)+'</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人：</label>\
							<div class="col-sm-7" id="zhuangzSkr">\
								<select name="receiverName" id="payeeName2" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人证件类型：</label>\
							<div class="col-sm-7">\
								<select name="receiverCardType" id="zhenjType2" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
						</div>\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">收款人证件号码：</label>\
							<div class="col-sm-7">\
								<input  type="text" name="receiverCardNumber" class="form-control editInput" id="zHreceCardNum" value="'+(result.data.receiverCardNumber==undefined?'':result.data.receiverCardNumber)+'">\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">开户人：</label>\
							<div class="col-sm-7">\
								<input  type="text" name="accountHolder" class="form-control editInput" id="accountHolder" value="'+(result.data.accountHolder==undefined?'':result.data.accountHolder)+'">\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">开户人证件类型：</label>\
							<div class="col-sm-7">\
								<select name="accountHolderCardType" id="zhenjType3" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
						</div>\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">开户人证件号码：</label>\
							<div class="col-sm-7">\
								<input type="text" name="accountHolderCardNumber" class="form-control editInput" id="accountHolderCardNumber" value="'+(result.data.accountHolderCardNumber==undefined?'':result.data.accountHolderCardNumber)+'">\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">账号类型：</label>\
							<div class="col-sm-7">\
								<select name="bankAccountKind" id="accountNum" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">账号：</label>\
							<div class="col-sm-7">\
								<input  type="text" name="bankAccount" class="form-control editInput" id="bankAccount" value="'+(result.data.bankAccount ? result.data.bankAccount : '')+'">\
							</div></div></div>\
						</div>\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">开户行：</label>\
							<div class="col-sm-7">\
								<select name="" id="openingBank" class="J_chosen form-control">\
								</select>\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">银行名称：</label>\
							<div class="col-sm-7">\
								<select name="bankBranchId" id="branchesBank" class="J_chosen form-control">\
									<option value="">请选择</option>\
								</select>\
							</div></div></div>\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">开户行所在地：</label>\
							<div class="col-sm-7 control-div" id="bankAddress"></div></div></div>\
						</div>\
						<div class="row">\
							<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">联行号：</label>\
							<div class="col-sm-7 control-div" id="lineNumber">'+(result.data.lineNumber==undefined?'':result.data.lineNumber)+'</div></div></div>\
						</div>\
					</form>\
				</div>';
			//退POS
			html+='\
				<div id="tuiPos" style="display:none;padding:10px 0;">\
					<div class="row">\
						<h5>POS退款信息</h5>\
						<table id="POSlist" class="table table-hover table-striped table-bordered">\
							<thead>\
								<tr>\
									<th data-field="">\
										<div class="th-inner">收款编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">原刷卡日期</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">原刷卡终端号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">原刷卡金额</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">原刷卡卡号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">原12位参考号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">原刷卡人姓名</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">本POS退款金额</div>\
									</th>\
								</tr>\
							</thead>\
						</table>\
					</div>\
				</div>';
		html+='\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">应付款金额：</label>\
				<div class="col-sm-7 control-div">'+result.data.payAmount+'元</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">应付日期：</label>\
				<div class="col-sm-7 control-div">'+result.data.payTime+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">审批状态：</label>\
				<div class="col-sm-7 control-div">'+(result.data.strAuditStatus==undefined?'':result.data.strAuditStatus)+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">付款状态：</label>\
				<div class="col-sm-7 control-div">'+result.data.strPayStatus+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">'+(result.data.payStatus==3?'付款失败原因：':'')+'</label>\
				<div class="col-sm-7 control-div">'+(result.data.payFailedReason==undefined?'':result.data.payFailedReason)+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">实付金额：</label>\
				<div class="col-sm-7 control-div">'+(result.data.realPayAmount==undefined?'':result.data.realPayAmount)+'</div></div></div>\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">实付日期：</label>\
				<div class="col-sm-7 control-div">'+(result.data.realPayTime==undefined?'':result.data.realPayTime)+'</div></div></div>\
			</div>\
			<div class="row">\
				<div class="col-sm-4"><div class="form-group"><label class="col-sm-4 control-label">付款变更情况：</label>\
				<div class="col-sm-7 control-div">'+(result.data.changeDesc==undefined?'':result.data.changeDesc)+'</div></div></div>\
			</div>';
		$('#bascInfor').html(html);
		$('select').chosen({
			width:"100%",
			disable_search_threshold : 10,
            placeholder_text : ' ',
			no_results_text: "未找到此选项!"
		});
		//付款方式
		dimContainer.buildDimChosenSelector($('#businesstype'),'refundPayType',result.data.payType+'');
		var shouKuanR=null;
		var fukuanDom=null;
		var $staffId=null;
		//付款方式：1，现金；2，支票；3，转账；4；退POS（退款使用）,
		if(result.data.payType==1){
			$('#xianjinCont').show();
			fukuanDom=$('#payeeName');
			shouKuanR=$('#xianjSkr');
			$staffId='staffName1';
			//（现金）
			//收款人证件类型
			dimContainer.buildDimChosenSelector($('#zhenjType'),'paymentCardType',result.data.receiverCardType+'');
			//领款人类型
			//dimContainer.buildDimChosenSelector($('#documentType'),'paymentPayeeType',result.data.payeeType+'');
			//证件类型
			//dimContainer.buildDimChosenSelector($('#documentType1'),'paymentCardType',result.data.payeeCardType+'');
		}else if(result.data.payType==2){
			$('#zhipCont').show();
			fukuanDom=$('#payeeName1');
			shouKuanR=$('#zhipiaoSkr');
			$staffId='staffName2';
			//支票
			//收款人证件类型
			dimContainer.buildDimChosenSelector($('#zhenjType1'),'paymentCardType',result.data.receiverCardType+'');
		}else if(result.data.payType==3){
			$('#zhuanzCont').show();
			fukuanDom=$('#payeeName2');
			shouKuanR=$('#zhuangzSkr');
			$staffId='staffName3';
			//转账
			//收款人证件类型
			dimContainer.buildDimChosenSelector($('#zhenjType2'),'paymentCardType',result.data.receiverCardType+'');
			//开户人证件类型
			dimContainer.buildDimChosenSelector($('#zhenjType3'),'paymentCardType',result.data.accountHolderCardType+'');
			//账号类型
			dimContainer.buildDimChosenSelector($('#accountNum'),'bankAccountType',result.data.bankAccountKind+'');
			_this.getBankList(result);		//获取银行列表
		}else if(result.data.payType==4){
			$('#tuiPos').show();
			//获取退Pos信息
			jsonGetAjax(basePath+'/finance/payment/apply/getRefundPosCollectionList.htm',{
				collectionBatchId:result.data.collectionBatchId		//收款批次号
			},function(rdata){
				$('#POSlist').bootstrapTable('destroy').bootstrapTable({
					data:rdata.data,
					singleSelect:true,			//设置单选
					columns:[
						{
							field: '',
							title :'选择',
							checkbox:true,
							align:'center',
							formatter:function(value,row){
					    		return {
				    				disabled:result.data.payAmount*1>row.amount*1?'disabled':''	,		//应付金额不能大于原刷卡金额  ，设置是否可用 (付款成功不可用)
				    				checked:result.data.collectionBatchId==row.collectionId?true:false 		//设置默认项（ 退款单收款编号和退pos列表收款编号相等）
					    		};
							}
						},
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
							formatter:function(value,row,index){
								return '<input  type="text" '+(result.data.payAmount*1>row.amount*1?'disabled':'')+' class="form-control editInput" value="'+(value==undefined?'':value)+'" id="jine'+index+'" oninput="clearNoNum(this)" />';
							}
						}
					]
				});
			});
		}
		//创建收款人
		if(result.data.payType!=4){
			_this.chamberlain(result,fukuanDom,shouKuanR,$staffId);
		}
		var isInit=true;
		var isInitXj=true;
		var isInitZp=true;
		var isInitZh=true;
		var isInitPos=true;
		//切换付款方式
		$('#businesstype').chosen().change(function(){
			var $thisVal=$(this).val();
			if($thisVal==1){
				$('#zhipCont').hide();
				$('#zhuanzCont').hide();
				$('#tuiPos').hide();
				$('#xianjinCont').show('300');
				if(result.data.payType!=1 && isInitXj){
					//（现金）
					$('#receiverCardNumber').val('');
					//收款人
					_this.chamberlain(result,$('#payeeName'),$('#xianjSkr'),'staffName'+result.data.payType);
					//收款人证件类型
					dimContainer.buildDimChosenSelector($('#zhenjType'),'paymentCardType','1');
					//领款人类型
					//dimContainer.buildDimChosenSelector($('#documentType'),'paymentPayeeType','1');
					//证件类型
					//dimContainer.buildDimChosenSelector($('#documentType1'),'paymentCardType','1');
					isInitXj=false;
				}
			}else if($thisVal==2){
				$('#xianjinCont').hide();
				$('#zhuanzCont').hide();
				$('#tuiPos').hide();
				$('#zhipCont').show('300');
				if(result.data.payType!=2 && isInitZp){
					//支票
					$('#receCardNum,#receiverUnit').val('');
					//收款人
					_this.chamberlain(result,$('#payeeName1'),$('#zhipiaoSkr'),'staffName'+result.data.payType);
					//收款人证件类型
					dimContainer.buildDimChosenSelector($('#zhenjType1'),'paymentCardType','1');
					isInitZp=false;
				}
			}else if($thisVal==3){
				$('#xianjinCont').hide();
				$('#tuiPos').hide();
				$('#zhipCont').hide();
				$('#zhuanzCont').show('300');
				//获取银行列表
				if(isInit && result.data.payType!=3){
					_this.getBankList(result);	//获取银行列表
					isInit=false;
				}
				if(result.data.payType!=3 && isInitZh){
					//转账
					$('#zHreceCardNum,#accountHolder,#accountHolderCardNumber,#bankAccount').val('');
					//收款人
					_this.chamberlain(result,$('#payeeName2'),$('#zhuangzSkr'),'staffName'+result.data.payType);
					//收款人证件类型
					dimContainer.buildDimChosenSelector($('#zhenjType2'),'paymentCardType','1');
					//开户人证件类型
					dimContainer.buildDimChosenSelector($('#zhenjType3'),'paymentCardType','1');
					//账号类型
					dimContainer.buildDimChosenSelector($('#accountNum'),'bankAccountType','1');
					isInitZh=false;
				}
			}else if($thisVal==4){
				$('#xianjinCont').hide();
				$('#zhipCont').hide();
				$('#zhuanzCont').hide();
				$('#tuiPos').show('300');
				if(result.data.payType!=4 && isInitPos){
					//POS退款信息
					jsonGetAjax(basePath+'/finance/payment/apply/getRefundPosCollectionList.htm',{
						collectionBatchId:result.data.collectionBatchId		//收款批次号
					},function(rdata){
						$('#POSlist').bootstrapTable('destroy').bootstrapTable({
							data:rdata.data,
							singleSelect:true,			//设置单选
							columns:[
								{
									field: '',
									title :'选择',
									checkbox:true,
									align:'center'
								},
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
									formatter:function(value,row,index){
										return '<input  type="text" '+(result.data.payAmount*1>row.amount*1?'disabled':'')+' class="form-control editInput" value="'+(value==undefined?'':value)+'" id="jine'+index+'" oninput="clearNoNum(this)" />';
									}
								}
							]
						});
					});
					isInitPos=false;
				}
			}
		});
	},
	//获取银行列表
	getBankList:function(rdata){
		var _this=this;
		jsonGetAjax(basePath+'/finance/common/selectByName.htm',{
			bankName: ''	//银行名称 
		},function(rsdata){
			if(rsdata.data.length>0){
				var html='<option value="">请选择</option>';
				$.each(rsdata.data,function(index,n){
					html+='<option value="'+n.id+'">'+n.bankName+'</option>'
				});
				$('#openingBank').html(html);
				//初始开户行
				var openBankId=rdata.data.openBankId==undefined?rsdata.data[0].id:rdata.data.openBankId+'';
				$('#openingBank').val(openBankId);
				$('#openingBank').trigger('chosen:updated');
				//获取支行列表
				_this.getBranchList(openBankId, rdata.data.bankBranchId);
				//银行所在地
				$('#bankAddress').html(rdata.data.bankProvince + rdata.data.bankCity);
				//联行号
				$('#lineNumber').html(rdata.data.branchId);
				var branchId='';
				$('#openingBank').chosen().change(function(){
					branchId=$(this).val();
					if(branchId==''){
						$('#branchesBank').html('<option value="">请选择</option>');
						$('#branchesBank').val('');
						$('#branchesBank').trigger('chosen:updated');
					}else{
						_this.getBranchList(branchId);
					}
				});
			}
		});
	},
	//获取支行列表
	getBranchList:function(bankId,bankBranchId){
		jsonGetAjax(basePath+'/finance/common/selectByBankId.htm',{
			bankId:bankId	//银行id
		},function(redata){
			if(redata.data.length>0){
				var branHtml='<option value="">请选择</option>';
				$.each(redata.data,function(i,cont){
					branHtml+='<option value="'+cont.id+'">'+cont.branchName+'</option>'
				});
				$('#branchesBank').html(branHtml);
				//初始支行
				var branId=redata.data[0];
				//$('#branchesBank').val(bankBranchId==undefined?redata.data[0].id:bankBranchId);
				$('#branchesBank').val(bankBranchId);
				$('#branchesBank').trigger('chosen:updated');
				$('#branchesBank').chosen().change(function(){
					var branVal=$(this).val();
					if(branVal==''){
						//银行所在地
						$('#bankAddress').html('');
						//联行号
						$('#lineNumber').html('');
					}else{
						jsonGetAjax(basePath+'/finance/common/getBankAddressInfo.htm',{
							id:branVal
						},function(rmdata){
							//银行所在地
							$('#bankAddress').html(rmdata.data.province+rmdata.data.city);
							//联行号
							$('#lineNumber').html(rmdata.data.branchId);
						});
					}
				});
			}
			
		});
	},
	//收款人类型
	chamberlain:function(rsultst,fuDom,shoukrr,staffName){
		var _this=this;
		//收款人类型：1，客户；2，业主；3，员工；4，其他 ,
		if(rsultst.data.receiverType==1){
			_this.payeeSplit(rsultst.data.clientName,fuDom,rsultst.data.receiverName);
		}else if(rsultst.data.receiverType==2){
			_this.payeeSplit(rsultst.data.ownerName,fuDom,rsultst.data.receiverName);
		}else if(rsultst.data.receiverType==3){
			//员工Dom
			var pserHtml='\
				<div class="input-group">\
					<input type="text" name="receiverName" data-id="'+rsultst.data.receiverUserId+'" value="'+rsultst.data.receiverName+'" class="form-control editInput" id="'+staffName+'">\
					<div class="input-group-btn">\
						<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown">\
							<span class="glyphicon glyphicon-search search-caret"></span>\
						</button>\
						<ul class="dropdown-menu dropdown-menu-right" role="menu">\
						</ul>\
					</div>\
				</div>';
			shoukrr.html(pserHtml);
			searchContainer.searchUserListByComp($('#'+staffName), true, 'right');
		}else if(rsultst.data.receiverType==4){
			var other='<input type="text" name="receiverName" value="'+rsultst.data.receiverName+'" class="form-control editInput">';
			shoukrr.html(other);
		}
	},
	//分割收款人
	payeeSplit:function(payeeName,$dom,receiverName){
		var clientName=payeeName.split(',');
		var receHtml='';
		for(var i=0;i<clientName.length;i++){
			receHtml+='<option value="'+clientName[i]+'">'+clientName[i]+'</option>';
		}
		$dom.html(receHtml);
		$dom.val(receiverName);
		$dom.trigger('chosen:updated');
	},
	//提交
	submit:function(paymentId,obj){
		var payType=$('#businesstype').val();
		//付款方式：1，现金；2，支票；3，转账；4；退POS（退款使用）,
		var parameter=null;
		if(payType==1){
			var receiverCardNumber=$.trim($('#receiverCardNumber').val());
			if(this.verificId(receiverCardNumber,$('#zhenjType'))){
				return false;
			}
			parameter=$('#xianjinContForm').serializeObject();	//现金
		}
		else if(payType==2){
			if(this.verificId($.trim($('#receCardNum').val()),$('#zhenjType1'))){
				return false;
			}
			//出票单位
			if($.trim($('#receiverUnit').val())==''){
				commonContainer.alert('请输入出票单位');
				return false;
			}
			parameter=$('#zhipContForm').serializeObject();		//支票
		}else if(payType==3){
			//收款人身份证号
			if(this.verificId($.trim($('#zHreceCardNum').val()),$('#zhenjType2'))){
				return false;
			}
			//开户人
			if($.trim($('#accountHolder').val())==''){
				commonContainer.alert('请输入开户人');
				return false;
			}
			//开户人身份证
			if(this.verificId($.trim($('#accountHolderCardNumber').val()),$('#zhenjType3'))){
				return false;
			}
			//账号
			if($.trim($('#bankAccount').val())==''){
				commonContainer.alert('请输入账号');
				return false;
			}
			//开户行
			if($('#openingBank').val()==''){
				commonContainer.alert('请选择开户行');
				return false;
			}
			//银行名称
			if($('#branchesBank').val()==''){
				commonContainer.alert('请选择银行名称');
				return false;
			}
			parameter=$('#zhuanzContForm').serializeObject();	//转账
		}else if(payType==4){
			var posDj=$('#POSlist').bootstrapTable('getSelections');		//选中的单据
			if(posDj.length>0 && posDj[0].collectionId!==undefined){
				//验证退pos金额和应付金额是否一致
				var tuiPj='#jine'+$("input[name='btSelectItem']:checked").data('index');
				var jinerPos=$(tuiPj).val();
				if(jinerPos!=obj.payAmount){
					commonContainer.alert('该POS机本次退款金额于应付金额不一致，请检查！');
					return false;
				}
				parameter={
					collectionBatchId:obj.collectionBatchId,						//收款批次号
					collectionId:posDj.collectionId,								//收款编号
					payAmount:jinerPos												//付款金额
				}	
			}else{
				commonContainer.alert('请选择退pos信息');
				return false;
			}
		}
		if(payType!=4 && obj.receiverType==3){
			parameter.receiverUserId=$('#staffName4').attr('data-id');				//收款人为员工
		}
		parameter.paymentId=paymentId;												//付款单id
		parameter.payType=payType;													//付款方式
		jsonPostAjax(basePath+'/finance/payment/updatePaymentInfo.htm',parameter,function(){
			location.href=basePath+'/finance/payment/detail.htm?paymentId='+paymentId;
		});
	},
	//验证身份证
	verificId:function(number,$typeDom){
		if(number==''){
			commonContainer.alert('请输入证件号码');
			return true;
		}
		if($typeDom.val()==1 && isIDCardNum(number)!==true){
			commonContainer.alert('请输入正确的身份证号码');
			return true;
		}
		return false;
	}
}
/*
 * 判断身份证号码
 * num：身份证号码
 * isNew:是不是新的标准 true，默认为false
 */
function isIDCardNum(num,isNew){
	if(isNew){
		if(num.length != 18){
			return '输入的身份证号长度不对，或者号码不符合规定！<br>18位号码末位可以为数字或X。';
		}
	}
	num = num.toUpperCase();
	//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
	if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
	{
		return '输入的身份证号长度不对，或者号码不符合规定！<br>15位号码应全为数字，18位号码末位可以为数字或X。';
	}
	//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	//下面分别分析出生日期和校验位
	var len, re;
	len = num.length;
	if (len == 15)
	{
		re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
		var arrSplit = num.match(re);
		
		//检查生日日期是否正确
		var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
		var bGoodDay;
		bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay)
		{
			return '输入的身份证号里出生日期不对！';
		}
		else
		{
			//将15位身份证转成18位
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var nTemp = 0, i;
			num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
			for(i = 0; i < 17; i ++)
			{
				nTemp += num.substr(i, 1) * arrInt[i];
			}
			num += arrCh[nTemp % 11];
			return true;
		}
	}
	if (len == 18)
	{
		re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
		var arrSplit = num.match(re);
		
		//检查生日日期是否正确
		var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
		var bGoodDay;
		bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay)
		{
			return '输入的身份证号里出生日期不对！';
		}
		else
		{
			//检验18位身份证的校验码是否正确。
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			var valnum;
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var nTemp = 0, i;
			for(i = 0; i < 17; i ++)
			{
				nTemp += num.substr(i, 1) * arrInt[i];
			}
			valnum = arrCh[nTemp % 11];
			if (valnum != num.substr(17, 1))
			{
				//$("#tip").html('18位身份证的校验码不正确！应该为：' + valnum);
				return '18位身份证的校验码不正确！';
			}
			return true;
		}
	}
	return '18位身份证的校验码不正确！';
}
//限制输入两位小数
function clearNoNum(obj){
	obj.value=obj.value.replace(/[^\d.]/g,''); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,''); //验证第一个字符是数字而不是"."
	obj.value = obj.value.replace(/\.{2,}/g,'.'); //只保留第一个. 清除多余的
	obj.value = obj.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
	return obj.value;
}