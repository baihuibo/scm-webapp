var flagtype = true;
var paymentselectval = '';
var paymentselect = '';
var index=0;
var categoryName='';
var remarkval='';
var payFs='';
var fundCodeNumber = $('#J_payment').val();
var fundCodeNum='';
var datauesrId='';
var tuikuanSum=null;

var contractId=getQueryString("contractNo");
var chargebackId=getQueryString("chargebackid");
var ischargebackId=getQueryString("isChargebakcid");
var chargebackNumber=getQueryString("chargebacknumber");
var selectionId=getQueryString("selection");
var contractidTypeNum = '';
$(function() {
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	$('#J_reset').on('click',function(){
		commonContainer.closeWindow();
	})
	if(contractId){
		if(ischargebackId == 0){
			$('#J_annex').show();
			$('#J_submit').text('提交');
			attachmentView.init();
		}else{
			$('#J_annex').hide();
			$('#J_submit').text('保存');
		}
		addChargebackView.getContractInfo(contractId);
		addChargebackView.initFundList(contractId);
		
		$('#J_iboxpay').show();
		$('#J_iboxpay_finance').hide();
	}else{
		//初始化数据加载 选择合同操作，合同基础信息加载
		addChargebackView.init();	
		attachmentView.init();
		
		Inquire();
		$('#J_iboxpay').show();
		$('#J_iboxpay_finance').show();
		$('#J_annex').show();
	}
	
	//点击取消按钮出发事件
	$('#J_reset').on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/payment/add.htm';
	})
	
})

var paymentevaluate = '';
$('#J_payment').on('input change',function(){		
			//创建代付房租表格表头
			var tabHtml='\
				<table id="J_contractList" class="table table-hover table-striped table-bordered">\
				<thead>\
					<tr>\
						<th data-field="">\
							<div class="th-inner">选择</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收款批次号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收据编号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">付款方</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收款单位</div>\
						</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">款项</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收据金额</div>\
						</th>\
					</tr>\
				</thead>\
			</table>';
			$('#J_hetConten').html(tabHtml);
			//创建代付押金表格表头
			var tabdepositHtml='\
				<table id="J_deposittable_dataTable" class="table table-hover table-striped table-bordered">\
				<thead>\
					<tr>\
						<th data-field="">\
							<div class="th-inner">选择</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收款批次号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收据编号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">付款方</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收款单位</div>\
						</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">款项</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收据金额</div>\
						</th>\
					</tr>\
				</thead>\
			</table>';
			$('#J_deposit_dataTable').html(tabdepositHtml);
			
			//创建抵押登记费表格表头
			var tabregistrationHtml='\
				<table id="J_registrationtable_dataTable" class="table table-hover table-striped table-bordered">\
				<thead>\
					<tr>\
						<th data-field="">\
							<div class="th-inner">选择</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收款批次号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收据编号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">付款方</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收款单位</div>\
						</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">款项</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收据金额</div>\
						</th>\
					</tr>\
				</thead>\
			</table>';
			$('#J_registration_dataTable').html(tabregistrationHtml);
			
			//创建评估费表格表头
			var tabevaluationHtml='\
				<table id="J_evaluationtable_dataTable" class="table table-hover table-striped table-bordered">\
				<thead>\
					<tr>\
						<th data-field="">\
							<div class="th-inner">选择</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收款批次号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收据编号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">付款方</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收款单位</div>\
						</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">款项</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">收据金额</div>\
						</th>\
					</tr>\
				</thead>\
			</table>';
			$('#J_evaluation_dataTable').html(tabevaluationHtml);
			paymentevaluate=$(this).val();
			if(paymentevaluate == '7'){ // 待付房租
				$('#J_payrent').show();
				jsonGetAjax(
					basePath + '/finance/payment/apply/getPaymentReceiptListByFund',
					{	
						"contractId": contractId==null?contractidTypeNum:contractId,
						"payFundCode":paymentevaluate
					},
					function(result) {
						$('#J_contractList').bootstrapTable('destroy').bootstrapTable({
							singleSelect:false,		//设置单选
							clickToSelect:true,		//点击选中行
							data:result.data,
							columns:[
								{
									field : '',
									title : '选择',
									checkbox:true,
									align : 'center',
									formatter: function(value, row, index){	
					           			var html='';
					           			html='<input type="hidden" id="J_auditId" name="auditId" data-id="'+row.id+'" data-receiveBatchId="'+row.batchId+'" />';
					           			return html;
					           		}
								},
								{
									field : 'batchId',
									title : '收款批次号',
									align : 'center'
								},
								{
									field : 'receiptNumber',
									title : '收据编号',
									align : 'center'
								},
								{
									field : 'strPayer',
									title : '付款方',
									align : 'center'
								},
								{
									field : 'strPayee',
									title : '收款单位',
									align : 'center'
								},
								{
									field : 'fundName',
									title : '款项',
									align : 'center'
								},
								{
									field : 'amount',
									title : '收据金额',
									align : 'center'
								}
							]
						});
					}
				);
				
			}else{
				$('#J_payrent').hide();
			}
			if(paymentevaluate == '11'){  //返信息费
				$('#J_Returninformation').show();

				var Returninformationhtml='';
					Returninformationhtml='\
						<tr>\
							<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入发票张数" value="" name="" class="form-control" onkeyup="clearNoNum(this)"></td>\
							<td style="width:10%; text-align: center; padding:8px;">\
								<select name="guidstatus" class="J_chosen form-control isIdshenfenz">\
									<option value="">请选择</option>\
								</select>\
							</td>\
							<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入发票金额" value="" name="" class="form-control" onkeyup="clearNoNum(this)"></td>\
							<td style="width:5%; text-align: center; padding:8px;"><a href="javascrit:;" type="delete" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
						</tr>';
				$('#J_Returninformation_dataTable tbody').html(Returninformationhtml);
				$("select").chosen({
					width : "100%" , no_results_text: "未找到此选项!" 
				});
				// 获取发票摘要基础数据
				dimContainer.buildDimChosenSelector($(".isIdshenfenz"), "InvoiceSummary", "");
				
				//增加一行数据
				var isIdshenfindex=0;
				$('#J_Increasedata').off().on('click',function(){
					var Increasedatahtml='';
						Increasedatahtml='\
						<tr>\
							<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入发票张数" value="" name="" class="form-control" onkeyup="clearNoNum(this)"></td>\
							<td style="width:10%; text-align: center; padding:8px;">\
								<select name="guidstatus" class="J_chosen form-control isIdshenfenz" id="isIdshenfenz'+isIdshenfindex+'">\
									<option value="">请选择</option>\
								</select>\
							</td>\
							<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入发票金额" value="" name="" class="form-control" onkeyup="clearNoNum(this)"></td>\
							<td style="width:5%; text-align: center; padding:8px;"><a type="delete" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
						</tr>';
					$('#J_Returninformation_dataTable tbody').append(Increasedatahtml);
					$("select").chosen({
						width : "100%" , no_results_text: "未找到此选项!" 
					});
					// 获取发票摘要基础数据
					dimContainer.buildDimChosenSelector($("#isIdshenfenz"+isIdshenfindex), "InvoiceSummary", "");
					++isIdshenfindex;
				});
				
				// 删除一行数据
				$('#J_Returninformation_dataTable').off().delegate(
					'a',
					'click',
					function(event) {
						if(this.type=='delete'){
							var trlength = $('#J_Returninformation_dataTable tbody').find('tr').length;
							if(trlength>1){
								$(this).parent().parent().remove();
							}else{
								layer.alert("默认数据不能删除");
							}
						}
					}
				);
				
			}else{
				$('#J_Returninformation').hide();
			}
			if(paymentevaluate == '14'){  //签约差旅费
				$('#J_Signedinformation').show();
				var Returninformationhtml='';
					Returninformationhtml='\
						<tr>\
							<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入发票张数" value="" name="" class="form-control" onkeyup="clearNoNum(this)"></td>\
							<td style="width:10%; text-align: center; padding:8px;">\
								<select name="guidstatus" class="J_chosen form-control isSignedinformation">\
									<option value="">请选择</option>\
								</select>\
							</td>\
							<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入发票金额" value="" name="" class="form-control" onkeyup="clearNoNum(this)"></td>\
							<td style="width:5%; text-align: center; padding:8px;"><a href="javascrit:;" type="delete" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
						</tr>';
				$('#J_Signedinformation_dataTable tbody').html(Returninformationhtml);
				$("select").chosen({
					width : "100%" , no_results_text: "未找到此选项!" 
				});
				// 获取发票摘要基础数据
				dimContainer.buildDimChosenSelector($(".isSignedinformation"), "InvoiceSummary", "");
				
				//增加一行数据
				var isIdshenfindex=0;
				$('#J_Signedinfodata').off().on('click',function(){
					var Increasedatahtml='';
						Increasedatahtml='\
						<tr>\
							<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入发票张数" value="" name="" class="form-control" onkeyup="clearNoNum(this)"></td>\
							<td style="width:10%; text-align: center; padding:8px;">\
								<select name="guidstatus" class="J_chosen form-control isIdshenfenz" id="isSignedinformation'+isIdshenfindex+'">\
									<option value="">请选择</option>\
								</select>\
							</td>\
							<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入发票金额" value="" name="" class="form-control" onkeyup="clearNoNum(this)"></td>\
							<td style="width:5%; text-align: center; padding:8px;"><a type="delete" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
						</tr>';
					$('#J_Signedinformation_dataTable tbody').append(Increasedatahtml);
					$("select").chosen({
						width : "100%" , no_results_text: "未找到此选项!" 
					});
					// 获取发票摘要基础数据
					dimContainer.buildDimChosenSelector($("#isSignedinformation"+isIdshenfindex), "InvoiceSummary", "");
					++isIdshenfindex;
				});
				
				// 删除一行数据
				$('#J_Signedinformation_dataTable').off().delegate(
					'a',
					'click',
					function(event) {
						if(this.type=='delete'){
							var trlength = $('#J_Signedinformation_dataTable tbody').find('tr').length;
							if(trlength>1){
								$(this).parent().parent().remove();
							}else{
								layer.alert("默认数据不能删除");
							}
						}
					}
				);
				
			}else{
				$('#J_Signedinformation').hide();
			}
			if(paymentevaluate == '5'){	// 待付押金		
				$('#J_deposit').show();
				jsonGetAjax(
						basePath + '/finance/payment/apply/getPaymentReceiptListByFund',
						{	
							"contractId": contractId==null?contractidTypeNum:contractId,
							"payFundCode":paymentevaluate
						},
						function(result) {
							$('#J_deposittable_dataTable').bootstrapTable('destroy').bootstrapTable({
								singleSelect:false,		//设置单选
								clickToSelect:true,		//点击选中行
								data:result.data,
								columns:[
									{
										field : '',
										title : '选择',
										checkbox:true,
										align : 'center',
										formatter: function(value, row, index){	
						           			var html='';
						           			html='<input type="hidden" id="J_auditId" name="auditId" data-id="'+row.id+'" data-receiveBatchId="'+row.batchId+'" />';
						           			return html;
						           		}
									},
									{
										field : 'batchId',
										title : '收款批次号',
										align : 'center'
									},
									{
										field : 'receiptNumber',
										title : '收据编号',
										align : 'center'
									},
									{
										field : 'strPayer',
										title : '付款方',
										align : 'center'
									},
									{
										field : 'strPayee',
										title : '收款单位',
										align : 'center'
									},
									{
										field : 'fundName',
										title : '款项',
										align : 'center'
									},
									{
										field : 'amount',
										title : '收据金额',
										align : 'center'
									}
								]
							});
						}
					);
			}else{
				$('#J_deposit').hide();
			}
			if(paymentevaluate == '8'){ //评估费
				$('#J_evaluation').show();
				jsonGetAjax(
						basePath + '/finance/payment/apply/getPaymentReceiptListByFund',
						{	
							"contractId": contractId==null?contractidTypeNum:contractId,
							"payFundCode":paymentevaluate
						},
						function(result) {
							$('#J_evaluationtable_dataTable').bootstrapTable('destroy').bootstrapTable({
								singleSelect:false,		//设置单选
								clickToSelect:true,		//点击选中行
								data:result.data,
								columns:[
									{
										field : '',
										title : '选择',
										checkbox:true,
										align : 'center',  
										formatter: function(value, row, index){	
						           			var html='';
						           			html='<input type="hidden" id="J_auditId" name="auditId" data-id="'+row.id+'" data-receiveBatchId="'+row.batchId+'" />';
						           			return html;
						           		}
									},
									{
										field : 'batchId',
										title : '收款批次号',
										align : 'center'
									},
									{
										field : 'receiptNumber',
										title : '收据编号',
										align : 'center'
									},
									{
										field : 'strPayer',
										title : '付款方',
										align : 'center'
									},
									{
										field : 'strPayee',
										title : '收款单位',
										align : 'center'
									},
									{
										field : 'fundName',
										title : '款项',
										align : 'center'
									},
									{
										field : 'amount',
										title : '收据金额',
										align : 'center'
									}
								]
							});
						}
					);
			}else{
				$('#J_evaluation').hide();
			}
			if(paymentevaluate == '9'){ //抵押登记费
				$('#J_registration').show();
				jsonGetAjax(
					basePath + '/finance/payment/apply/getPaymentReceiptListByFund',
					{	
						"contractId": contractId==null?contractidTypeNum:contractId,
						"payFundCode":paymentevaluate
					},
					function(result) {
						$('#J_registrationtable_dataTable').bootstrapTable('destroy').bootstrapTable({
							singleSelect:false,		//设置单选
							clickToSelect:true,		//点击选中行
							data:result.data,
							columns:[
								{
									field : '',
									title : '选择',
									checkbox:true,
									align : 'center',
									formatter: function(value, row, index){	
					           			var html='';
					           			html='<input type="hidden" id="J_auditId" name="auditId" data-id="'+row.id+'" data-receiveBatchId="'+row.batchId+'" />';
					           			return html;
					           		}
								},
								{
									field : 'batchId',
									title : '收款批次号',
									align : 'center'
								},
								{
									field : 'receiptNumber',
									title : '收据编号',
									align : 'center'
								},
								{
									field : 'strPayer',
									title : '付款方',
									align : 'center'
								},
								{
									field : 'strPayee',
									title : '收款单位',
									align : 'center'
								},
								{
									field : 'fundName',
									title : '款项',
									align : 'center'
								},
								{
									field : 'amount',
									title : '收据金额',
									align : 'center'
								}
							]
						});
					}
				);
			}else{
				$('#J_registration').hide();
			}
		});
		$('#J_isTransfer').prop('checked',true);
		$('#J_isTransfer').on('click',function(){
			$('#iscash').show();
			$('#isTransfer').show();
			$('#J_paperworcompany').show();
		});
		$('#J_iscash').on('click',function(){
			$('#isTransfer').hide();
			$('#iscash').show();
			$('#J_paperworcompany').show();
		});
		$('#J_ischeck').on('click',function(){
			$('#isTransfer').hide();
			$('#iscash').show();
			$('#J_paperworcompany').show();
		});

var addChargebackView={
	init:function(){
		var _this=this;
		//初始select下拉框
		$('select').chosen({
			width:'100%'
		});
		//业务类型
		dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
		_this.choiceContract();
		_this.contractList();
		_this.getAddContract();
	},
	//选择合同
	choiceContract:function(){
		var _this=this;
		var isInit=true;
		$('#addContractNum').off().on('click',function(){
			var contractNumsun=$('#addContractNum > div');
			if(contractNumsun.length>1){
				contractNumsun.eq(1).hide();
			}
			commonContainer.modal('选择合同',$('#choiceHetong'),function(i){
				_this.getAddContract(i);
				_this.initFundList(contractidTypeNum);
				$('#businesstype').val('');
				$('#businesstype').trigger('chosen:updated');
				
			},{
				area:['80%','70%'],
				btns:['确定','取消'],
				overflow :true,
				success:function(){
					$('#J_payment').val('');
					$('#J_payment').trigger("chosen:updated");
					$('#businesstype').val('');
					$('#businesstype').trigger('chosen:updated');
					if(isInit){
						$('#J_search').off().on('click',_this.contractList);
						$('#J_reset').on('click',function(){
							$('#J_deptName').attr('data-id','');			//重置所属部门id
						});
						//所属部门
						$('#J_deptSelect').off().on('click', function() {
							showDeptTree($('#J_deptName'), $('#J_deptLevel'));
						});
						isInit=false;
					}
					//重置表单
					$('#J_contractQuery')[0].reset();
					$('#J_deptName').attr('data-id','');
					//创建表格表头
					var tabHtml='\
						<table id="contractList" class="table table-hover table-striped table-bordered">\
							<thead>\
								<tr>\
									<th data-field="">\
										<div class="th-inner">合同类型</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">合同编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">房源编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">客户编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">业主名称</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">客户名称</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">录入日期</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">成交人</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">所属部门</div>\
									</th>\
								</tr>\
							</thead>\
						</table>';
					$('#hetConten').html(tabHtml);
				}
			});
		});
	},
	//查询合同列表
	contractList:function(){
		$('#contractList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/choose/paymentContract',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			singleSelect:true,		//设置单选
			clickToSelect:true,		//点击选中行
			striped:true,
			pageSize:10,
			pageList:[10, 20, 50],
			queryParams: function (params) {
				var data=$('#J_contractQuery').serializeObject();
				var deptId=$('#J_deptName').attr('data-id');
				if(deptId!==''){
					data.dept_id=deptId;		//所属部门id
				}
				var listbusinessType=$('#businesstype').val();
				if(listbusinessType!==''){
					data.businessType=listbusinessType;		//合同类型
				}
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
	         		field: '',
			    	title :'选择',
			    	checkbox:true,
			    	align:'center'
	         	},
				{
					field : 'strBusinessType',
					title : '合同类型',
					align : 'center'
				},
				{
					field : 'contractNumber',
					title : '合同编号',
					align : 'center'
				},
				{
					field : 'houseId',
					title : '房源编号',
					align : 'center'
				},
				{
					field : 'clientId',
					title : '客户编号',
					align : 'center'
				},
				{
					field : 'ownerName',
					title : '业主名称',
					align : 'center'
				},
				{
					field : 'clientName',
					title : '客户名称',
					align : 'center'
				},
				{
					field : 'createTime',
					title : '录入日期',
					align : 'center'
				},
				{
					field : 'trancedByName',
					title : '成交人',
					align : 'center'
				},
				{
					field : 'deptName',
					title : '所属部门',
					align : 'center'
				}
			]
		});
	},
	//获取新增合同详情
	getAddContract:function(i){
		var _this=this;
		var checkrowDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
		if(checkrowDataArr.length>0 && checkrowDataArr[0].contractId!==undefined){
			layer.close(i);
			_this.getContractInfo(checkrowDataArr[0].contractId);
			_this.initFundList(checkrowDataArr[0].contractId);
			contractidTypeNum = checkrowDataArr[0].contractId;
		}	
	},
	initFundList : function(contractId) {
		//初始化付款款项数据
		commonContainer.initChosen($('#J_payment'));
	    var options = ['<option value="">请选择</option>'];
	    jsonGetAjax(
			basePath +'/finance/payment/apply/getFundListByPayment',
			{
				"contractId":contractId
			}, 
			function(result) {
	    		$.each(result.data, function(n, value) {
	    	    	options.push('<option value="' + value.fundCode + '">' + value.fundName + '</option>');
	    	    })
	    		$('#J_payment').html(options.join(''))
	    		$('#J_payment').trigger("chosen:updated");
		})
	},
	getContractInfo : function(contractId) {
		jsonGetAjax(basePath+'/finance/choose/info',{
			contractId:contractId		//合同主键id
		},function(result){
			contractId = result.data.contractId;
			//回显新增合同信息
			$('#addContractNumber').val(result.data.contractNumber);	
			$('#J_Contract_h').text(result.data.contractNumber?result.data.contractNumber:'-');
			$('#J_typecontract_h').text(result.data.strBusinessType?result.data.strBusinessType:'-');
			$('#J_houseId_h').text(result.data.houseId?result.data.houseId:'-');
			$('#J_clientId_h').text(result.data.clientId?result.data.clientId:'-');
			$('#J_ownerName_h').text(result.data.ownerName?result.data.ownerName:'-');
			$('#J_clientName_h').text(result.data.clientName?result.data.clientName:'-');										//实收佣金
			var ownerName = result.data.ownerName;
			var clientName = result.data.clientName;
			
			// 付款信息新增
			var Payeetypeval = '';
			
			var editerPayeetype='';
			var editerPayeename='';
			var editerfinanceCardType ='';
			var editerDocumentnumber = '';
			$('#J_increaseCheck').off().on('click',function(){
				Payeetypeval = $('#J_Payeetype').val();
				var paymentevaluate = $('#J_payment').val();
				// 判断收据单列表所选项收据批次号是否相同
				var stepFlag = false;
				var normalAuditStep = '';
				$("input[name='btSelectItem']:checked").each(function(index,element){
					var receiveBatchId = $(this).next().find('#J_auditId').attr('data-receiveBatchId');
					
					if(index==0) {
						normalAuditStep = receiveBatchId;
					};
					if(receiveBatchId != normalAuditStep){
						stepFlag = true;
						return false;
					}
				})
				if(stepFlag) {
					layer.alert("所选项必须是相同收款批次号，请重新选择");	
					return false;
				};
				
				//判断付款款项为必填项
				var valtxt = $('#J_payment').val();
				if(valtxt == ''){
					layer.alert("不能增加数据，付款款项为必选项");
					return false;
				}
				commonContainer.modal(
					'添加付款信息',
					$('#J_increase'),
					function(index, layero) {
						
						//判断付款方式
						var payFs=$("input[name='isShouweiyj']:checked").val();
						var paymentmethod='';
						if(payFs==1){
							paymentmethod='现金';
						}else if(payFs==2){
							paymentmethod='支票';
						}else if(payFs==3){
							paymentmethod='转账';
						}
						
						var payeehtml = '';
						var paymentmoney = $('#J_paymentmoney').val();
						var payzhanghao = ''
						var paymentUserName= '';
						fundCodeNum=$('#J_payment').val();	//付款款项类型
						
						if(paymentevaluate == '5'){
							paymentselect = '代付押金';
						}
						if(paymentevaluate == '7'){
							paymentselect = '代付房租';
						}
						if(paymentevaluate == '8'){
							paymentselect = '评估费';
						}
						if(paymentevaluate == '9'){
							paymentselect = '抵押登记费';
						}
						if(paymentevaluate == '10'){
							paymentselect = '多存款';
						}
						if(paymentevaluate == '11'){
							paymentselect = '返信息费';
						}
						if(paymentevaluate == '12'){
							paymentselect = '赔偿金';
						}
						if(paymentevaluate == '13'){
							paymentselect = '普租分期';
						}
						if(paymentevaluate == '14'){
							paymentselect = '签约差旅费';
						}
						
						//判断 如果 付款方式为现金或者支票 账号项为'-'
						if(paymentmethod == '现金' || paymentmethod == '支票'){
							payzhanghao = '-';
						}
						
						if(paymentmethod == '转账'){
							payzhanghao = $('#J_account').val();
						}
						
						if(Payeetypeval == '1'){
							paymentUserName = $('#J_Payeename').val();
						}
						if(Payeetypeval == '2'){
							paymentUserName = $('#J_Payeename').val();
						}
						if(Payeetypeval == '3'){
							paymentUserName = $('#J_user').val();
						}
						if(Payeetypeval == '4'){
							paymentUserName = $('#J_iputvalue').val();
						}
						
						// 验证必填项
						var $Payeetype = $('#J_Payeetype').val();               //收款人类型
						var $Payeename = '';               						//收款人
						var $iputvalue = $('#iputvalue').val();                 //收款人
						var $user = $('#J_user').val();                         //收款人
						var $documentType = $('#J_financeCardType').val();         //收款人证件类型
						var $Documentnumber = $('#J_Documentnumber').val();     //证件号码
						var $paymentmoney = $('#J_paymentmoney').val();         //付款金额
						var $accounttypeofAccount=$('#J_accounttypeofAccount').val(); //开户人证件类型
						var $accountnumber=$('#J_accountnumber').val(); //开户人证件号码
						var $Accountholder=$('#J_Accountholder').val(); //开户人
						var $accountType=$('#J_accountType').val();  //账号类型
						var $Openbank=$('#J_Openbank').val();  //开户行
						var $bankName=$('#J_bankName').val();  //银行支行名称
						var $account=$('#J_account').val();  //账号

						if(payFs==1){ //现金
							if($Payeetype == ''){
								layer.alert('收款人类型不能为空');
								return false;
							};
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
						}
						if(payFs==2){ //支票
							if($Payeetype == ''){
								layer.alert('收款人类型不能为空');
								return false;
							};
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
						}
						if(payFs==3){ // 转账
							if($Payeetype == ''){
								layer.alert('收款人类型不能为空');
								return false;
							};
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($('#J_accounttypeofAccount').val()==1 && isIDCardNum($accountnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($('#J_accounttypeofAccount').val()==1 && isIDCardNum($accountnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($('#J_accounttypeofAccount').val()==1 && isIDCardNum($accountnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($('#J_accounttypeofAccount').val()==1 && isIDCardNum($accountnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
						}
						var dataObj=JSON.stringify($('#formId').serializeObject());
						var dataobjval = 'data-obj='+"'"+dataObj+"'";
						payeehtml='\
							<tr>\
								<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+paymentselect+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+paymentmoney+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+payzhanghao+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+paymentUserName+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-funcode="'+fundCodeNum+'" data-paytype="'+payFs+'" class="btn btn-outline btn-success btn-xs btn-editor">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+paymentmoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
							</tr>';
						tuikuanSum+=paymentmoney*1;
						$('#J_paymententry_dataTable tbody').append(payeehtml);
						editerPayeetype=$('#J_Payeetype').val();
						editerPayeename=$Payeename;
						editerfinanceCardType =$('#J_financeCardType').val();
						editerDocumentnumber = $('#J_Documentnumber').val();
						$('#J_paymentpopmoeny').text(tuikuanSum);
						layer.close(index);
					}, 
					{
						overflow :true,
						area : ['68%','80%'],
						btns : ['确定', '取消'],
						success: function() {
							$('#isTransfer').show();
							$('#J_paperworcompany').hide();
							$('#J_isTransfer').prop('checked',true);
							$('#J_iscash').prop('checked',false);
							$('#J_ischeck').prop('checked',false);
							if(flagtype){
								//证件类型
								dimContainer.buildDimChosenSelector($('#J_financeCardType'),'paymentCardType','');
								//开户人证件类型
								dimContainer.buildDimChosenSelector($('#J_accounttypeofAccount'),'paymentCardType','');
								//账号类型
								dimContainer.buildDimChosenSelector($('#J_accountType'),'bankAccountType','');
								//开户行自动补全查询
								Openbank($("#J_Openbank"), true, 'left');
								flagtype = false;
							}
							
							$('#J_financeCardType').val('');
							$('#J_financeCardType').trigger("chosen:updated");
							$('#J_Payeetype').val('');
							$('#J_Payeetype').trigger("chosen:updated");
							$('#J_Payeename').val('');
							$('#J_Payeename').trigger("chosen:updated");
							$('#J_user').val('');
							$('#J_iputvalue').val('');
							$('#J_Documentnumber').val('');
							$('#J_paymentmoney').val('');
							$('#J_accounttypeofAccount').val('');
							$('#J_accounttypeofAccount').trigger("chosen:updated");
							$('#J_accountType').val('');
							$('#J_accountType').trigger("chosen:updated");
							$('#J_accountnumber').val('');
							$('#J_Openbank').val('');
							$('#J_bankName').val('');
							$('#J_bankName').trigger("chosen:updated");
							$('#J_province').val('');
							$('#J_city').val('');
							$('#J_banknumber').val('');
							$('#J_Accountholder').val('');
							$('#J_account').val('');
							var optionsname = [];
							$('#J_Payeetype').on('input change',function(){
								Payeetypeval = $(this).val();
								optionsname = [];
								if(Payeetypeval =='1'){
									$('#J_paperwork').show();
									$('#J_paperworNum').show();
									$('#J_select').show();
									$('#J_input').hide();
									$('#J_inputtext').hide();
									var arr = clientName.split(',');
									$.each(arr,function(n, value){
										optionsname.push('<option data-id = ' + n + ' value="' + value + '">' + value + '</option>');
									})
									 $('#J_Payeename').html('<option value="">请选择</option>'+optionsname.join(''));
						    		 $('#J_Payeename').trigger("chosen:updated");
								}
								if(Payeetypeval =='2'){
									$('#J_paperwork').show();
									$('#J_paperworNum').show();
									$('#J_select').show();
									$('#J_input').hide();
									$('#J_inputtext').hide();
									var arr = ownerName.split(',');
									$.each(arr,function(n, value){
										optionsname.push('<option data-id = ' + n + ' value="' + value + '">' + value + '</option>');
									})
									 $('#J_Payeename').html('<option value="">请选择</option>'+optionsname.join(''));
						    		 $('#J_Payeename').trigger("chosen:updated");
								}
								if(Payeetypeval =='3'){
									$('#J_paperwork').hide();
									$('#J_paperworNum').hide();
									$('#J_select').hide();
									$('#J_input').show();
									$('#J_inputtext').hide();
									
									//所属人自动补全查询
									searchContainer.searchUserListByComp($("#J_user"), true, 'left');
								}
								if(Payeetypeval =='4'){
									$('#J_paperwork').show();
									$('#J_paperworNum').show();
									$('#J_select').hide();
									$('#J_input').hide();
									$('#J_inputtext').show();
								}
							})
							
							var optionsbank = [];
							$('#formId').on('onSetSelectValue' , '#J_Openbank' ,function(){
								// 根据银行Id 查询支行列表
								var bankIdtype = $('#J_Openbank').attr('data-id')
								jsonGetAjax(
									basePath+'/finance/common/selectByBankId',
									{
										bankId:bankIdtype		//银行id
									},
									function(result){
										optionsbank=[];
										$.each(result.data,function(n, value){
											optionsbank.push('<option data-id = ' + value.id + ' value="' + value.id + '">' + value.branchName + '</option>');
										})
										 $('#J_bankName').html('<option value="">请选择</option>'+optionsbank.join(''));
							    		 $('#J_bankName').trigger("chosen:updated");
									}
								)	
							})
							$("#J_bankName").on('input change',function(){
								// 根据银行Id 查询支行省市信息
								var bankNameIdtype = $('#J_bankName').val();
								jsonGetAjax(
									basePath+'/finance/common/getBankAddressInfo',
									{
										id:bankNameIdtype		//银行id
									},
									function(result){
										$('#J_province').val(result.data.province);
										$('#J_city').val(result.data.city);
										$('#J_banknumber').val(result.data.branchId);
									}
								)	
							})
						}
					}
				);
			});

			// 付款信息详细展示 删除 修改  点击按钮
			$('#J_paymententry_dataTable').delegate(
				'a',
				'click',
				function(event) {
					var $this=$(this);
					if(this.type=='del'){//删除付款数据
						commonContainer.confirm(
							'是否确认删除信息？',function(index, layero){
								$($this).parent().parent().remove();
								var paymentdelmoney = $($this).data('paymentpopmoney');
								tuikuanSum -=paymentdelmoney*1;
								$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
								layer.close(index);
							}
						);
						
					}
					if(this.type=='modify'){//修改付款数据
						var paymentevaluate = $('#J_payment').val();
						commonContainer.modal(
							'添加付款信息',
							$('#J_increase'),
							function(index, layero) {
								
								//判断付款方式
								payFs=$("input[name='isShouweiyj']:checked").val();
								var paymentmethod='';
								var datafundname=$('#formId').serializeObject();
								if(payFs==1){
									paymentmethod='现金';
								}else if(payFs==2){
									paymentmethod='支票';
								}else if(payFs==3){
									paymentmethod='转账';
								}
								
								var payeehtml = '';
								
								var paymentmoney = $('#J_paymentmoney').val();
								var payzhanghao = ''
								var paymentUserName= '';
								
								if(paymentevaluate == '5'){
									paymentselect = '代付押金';
								}
								if(paymentevaluate == '7'){
									paymentselect = '代付房租';
								}
								if(paymentevaluate == '8'){
									paymentselect = '评估费';
								}
								if(paymentevaluate == '9'){
									paymentselect = '抵押登记费';
								}
								if(paymentevaluate == '10'){
									paymentselect = '多存款';
								}
								if(paymentevaluate == '11'){
									paymentselect = '返信息费';
								}
								if(paymentevaluate == '12'){
									paymentselect = '赔偿金';
								}
								if(paymentevaluate == '13'){
									paymentselect = '普租分期';
								}
								if(paymentevaluate == '13'){
									paymentselect = '签约差旅费';
								}
								
								//判断 如果 付款方式为现金或者支票 账号项为'-'
								if(paymentmethod == '现金' || paymentmethod == '支票'){
									payzhanghao = '-';
								}
								
								if(paymentmethod == '转账'){
									payzhanghao = $('#J_account').val();
								}
								
								if(Payeetypeval == '1'){
									paymentUserName = $('#J_Payeename').val();
								}
								if(Payeetypeval == '2'){
									paymentUserName = $('#J_Payeename').val();
								}
								if(Payeetypeval == '3'){
									paymentUserName = $('#J_user').val();
								}
								if(Payeetypeval == '4'){
									paymentUserName = $('#J_iputvalue').val();
								}
								
								// 验证必填项
								var $Payeetype = $('#J_Payeetype').val();               //收款人类型
								var $Payeename = '';               						//收款人
								var $iputvalue = $('#iputvalue').val();                 //收款人
								var $user = $('#J_user').val();                         //收款人
								var $documentType = $('#J_financeCardType').val();         //收款人证件类型
								var $Documentnumber = $('#J_Documentnumber').val();     //证件号码
								var $paymentmoney = $('#J_paymentmoney').val();         //付款金额
								var $accounttypeofAccount=$('#J_accounttypeofAccount').val(); //开户人证件类型
								var $accountnumber=$('#J_accountnumber').val(); //开户人证件号码
								var $Accountholder=$('#J_Accountholder').val(); //开户人
								var $accountType=$('#J_accountType').val();  //账号类型
								var $Openbank=$('#J_Openbank').val();  //开户行
								var $bankName=$('#J_bankName').val();  //银行支行名称
								var $account=$('#J_account').val();  //账号

								if(payFs==1){ //现金
									if($Payeetype == ''){
										layer.alert('收款人类型不能为空');
										return false;
									};
									if(Payeetypeval == '1'){  // 客户
										$Payeename = $('#J_Payeename').val();
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
									};
									if(Payeetypeval == '2'){  // 业主
										$Payeename = $('#J_Payeename').val();
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
									};
									if(Payeetypeval == '3'){  // 员工
										$Payeename = $('#J_user').val();
										datauesrId = $('#J_user').data('id');
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
									};
									if(Payeetypeval == '4'){  // 其他
										paymentUserName = $('#J_iputvalue').val();
										if(paymentUserName == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
									}
								}
								if(payFs==2){ //支票
									if($Payeetype == ''){
										layer.alert('收款人类型不能为空');
										return false;
									};
									if(Payeetypeval == '1'){  // 客户
										$Payeename = $('#J_Payeename').val();
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
									};
									if(Payeetypeval == '2'){  // 业主
										$Payeename = $('#J_Payeename').val();
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
									};
									if(Payeetypeval == '3'){  // 员工
										$Payeename = $('#J_user').val();
										datauesrId = $('#J_user').data('id');
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
									};
									if(Payeetypeval == '4'){  // 其他
										paymentUserName = $('#J_iputvalue').val();
										if(paymentUserName == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
									}
								}
								if(payFs==3){ // 转账
									if($Payeetype == ''){
										layer.alert('收款人类型不能为空');
										return false;
									};
									if(Payeetypeval == '1'){  // 客户
										$Payeename = $('#J_Payeename').val();
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
										if($accounttypeofAccount == ''){
											layer.alert('开户人证件类型不能为空');
											return false;
										};
										if($accountnumber== ''){
											layer.alert('开户人证件号码不能为空');
											return false;
										};
										if($accountType== ''){
											layer.alert('账号类型不能为空');
											return false;
										};
										if($Accountholder== ''){
											layer.alert('开户人不能为空');
											return false;
										};
										if($Openbank== ''){
											layer.alert('开户行不能为空');
											return false;
										};
										if($bankName== ''){
											layer.alert('银行支行名称不能为空');
											return false;
										};
										if($account== ''){
											layer.alert('账号不能为空');
											return false;
										};
									}
									if(Payeetypeval == '2'){  // 业主
										$Payeename = $('#J_Payeename').val();
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
										if($accounttypeofAccount == ''){
											layer.alert('开户人证件类型不能为空');
											return false;
										};
										if($accountnumber== ''){
											layer.alert('开户人证件号码不能为空');
											return false;
										};
										if($accountType== ''){
											layer.alert('账号类型不能为空');
											return false;
										};
										if($Accountholder== ''){
											layer.alert('开户人不能为空');
											return false;
										};
										if($Openbank== ''){
											layer.alert('开户行不能为空');
											return false;
										};
										if($bankName== ''){
											layer.alert('银行支行名称不能为空');
											return false;
										};
										if($account== ''){
											layer.alert('账号不能为空');
											return false;
										};
									};
									if(Payeetypeval == '3'){  // 员工
										$Payeename = $('#J_user').val();
										datauesrId = $('#J_user').data('id');
										if($Payeename == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
										if($accounttypeofAccount == ''){
											layer.alert('开户人证件类型不能为空');
											return false;
										};
										if($accountnumber== ''){
											layer.alert('开户人证件号码不能为空');
											return false;
										};
										if($accountType== ''){
											layer.alert('账号类型不能为空');
											return false;
										};
										if($Accountholder== ''){
											layer.alert('开户人不能为空');
											return false;
										};
										if($Openbank== ''){
											layer.alert('开户行不能为空');
											return false;
										};
										if($bankName== ''){
											layer.alert('银行支行名称不能为空');
											return false;
										};
										if($account== ''){
											layer.alert('账号不能为空');
											return false;
										};
									}
									if(Payeetypeval == '4'){  // 其他
										paymentUserName = $('#J_iputvalue').val();
										if(paymentUserName == ''){
											layer.alert('收款人不能为空');
											return false;
										};
										if($documentType == ''){
											layer.alert('收款人证件类型不能为空');
											return false;
										};
										if($Documentnumber==''){
											commonContainer.alert('请输入证件号码');
											return true;
										};
										if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
											commonContainer.alert('请输入正确的身份证号码');
											return true;
										};
										if($paymentmoney == ''){
											layer.alert('付款金额不能为空');
											return false;
										};
										if($accounttypeofAccount == ''){
											layer.alert('开户人证件类型不能为空');
											return false;
										};
										if($accountnumber== ''){
											layer.alert('开户人证件号码不能为空');
											return false;
										};
										if($accountType== ''){
											layer.alert('账号类型不能为空');
											return false;
										};
										if($Accountholder== ''){
											layer.alert('开户人不能为空');
											return false;
										};
										if($Openbank== ''){
											layer.alert('开户行不能为空');
											return false;
										};
										if($bankName== ''){
											layer.alert('银行支行名称不能为空');
											return false;
										};
										if($account== ''){
											layer.alert('账号不能为空');
											return false;
										};
									}
								}
								var dataObj=JSON.stringify($('#formId').serializeObject());
								var dataobjval = 'data-obj='+"'"+dataObj+"'";
								payeehtml='\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentselect+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentmoney+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+payzhanghao+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentUserName+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-funcode="'+fundCodeNum+'" data-paytype="'+payFs+'" class="btn btn-outline btn-success btn-xs btn-editor">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+paymentmoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>';
								//$('#J_paymententry_dataTable tbody').html(payeehtml);
								var oldmoeny = $($this).data('obj').payAmount;
								tuikuanSum +=(-(oldmoeny-paymentmoney));
								$($this).parents('tr').html(payeehtml);
								$('#J_paymentpopmoeny').text(tuikuanSum);
								layer.close(index);
							}, 
							{
								overflow :true,
								area : ['68%','80%'],
								btns : ['确定', '取消'],
								success: function() {
									var typedata = $($this).data('paytype');
									if(typedata == '1'){
										$('#J_iscash').prop('checked',true);
										$('#isTransfer').hide();
										$('#iscash').show();
									}else if(typedata == '2'){
										$('#J_ischeck').prop('checked',true);
										$('#isTransfer').hide();
										$('#iscash').show();
									}else if(typedata == '3'){
										$('#J_isTransfer').prop('checked',true);
										$('#isTransfer').show();
										$('#iscash').show();
									}
									
									var editerPayeetype = $($this).data('obj').receiverType;
									var editerDocumentnumber = $($this).data('obj').receiverCardNumber;
									var editerAccountholder = $($this).data('obj').accountHolder;
									var editertypeofAccount = $($this).data('obj').accountHolderCardType;
									var editeraccountnumber = $($this).data('obj').accountHolderCardNumber;
									var editeraccountType = $($this).data('obj').bankAccountKind;
									var editerOpenbank = $($this).data('obj').Openbank;
									var editerbankName = $($this).data('obj').bankBranchId;
									var editerbanknumber = $($this).data('obj').banknumber;
									var editeraccount = $($this).data('obj').bankAccount;
									var editerpaymentmoney = $($this).data('obj').payAmount;
									var editerprovince = $($this).data('obj').province;
									var editercity = $($this).data('obj').city;
									var receiverUnit = $($this).data('obj').receiverUnit;
									
									$('#J_Payeetype').val(editerPayeetype);
									$('#J_Payeetype').trigger("chosen:updated");
									
									$('#J_Payeename').val(editerPayeename);
									$('#J_Payeename').trigger("chosen:updated");
									$('#J_financeCardType').val(editerfinanceCardType);
									$('#J_financeCardType').trigger("chosen:updated");
									$('#J_Documentnumber').val(editerDocumentnumber);
									$('#J_paymentmoney').val(editerpaymentmoney);
									
									
									$('#J_Accountholder').val(editerAccountholder);
									$('#J_accounttypeofAccount').val(editertypeofAccount);
									$('#J_accounttypeofAccount').trigger("chosen:updated");
									$('#J_accountType').val(editeraccountType);
									$('#J_accountType').trigger("chosen:updated");
									$('#J_accountnumber').val(editeraccountnumber);
									$('#J_Openbank').val(editerOpenbank);
									$('#J_bankName').val(editerbankName);
									$('#J_bankName').trigger("chosen:updated");
									$('#J_province').val(editerprovince);
									$('#J_city').val(editercity);
									$('#J_banknumber').val(editerbanknumber);
									$('#J_account').val(editeraccount);
									$('#J_receiverUnit').val(receiverUnit);
									
									var optionsname = [];
									$('#J_Payeetype').on('input change',function(){
										Payeetypeval = $(this).val();
										optionsname = [];
										if(Payeetypeval =='1'){
											$('#J_paperwork').show();
											$('#J_paperworNum').show();
											$('#J_select').show();
											$('#J_input').hide();
											$('#J_inputtext').hide();
											var arr = clientName.split(',');
											$.each(arr,function(n, value){
												optionsname.push('<option data-id = ' + n + ' value="' + value + '">' + value + '</option>');
											})
											 $('#J_Payeename').html('<option value="">请选择</option>'+optionsname.join(''));
								    		 $('#J_Payeename').trigger("chosen:updated");
										}
										if(Payeetypeval =='2'){
											$('#J_paperwork').show();
											$('#J_paperworNum').show();
											$('#J_select').show();
											$('#J_input').hide();
											$('#J_inputtext').hide();
											var arr = ownerName.split(',');
											$.each(arr,function(n, value){
												optionsname.push('<option data-id = ' + n + ' value="' + value + '">' + value + '</option>');
											})
											 $('#J_Payeename').html('<option value="">请选择</option>'+optionsname.join(''));
								    		 $('#J_Payeename').trigger("chosen:updated");
										}
										if(Payeetypeval =='3'){
											$('#J_paperwork').hide();
											$('#J_paperworNum').hide();
											$('#J_select').hide();
											$('#J_input').show();
											$('#J_inputtext').hide();
											
											//所属人自动补全查询
											searchContainer.searchUserListByComp($("#J_user"), true, 'left');
										}
										if(Payeetypeval =='4'){
											$('#J_paperwork').show();
											$('#J_paperworNum').show();
											$('#J_select').hide();
											$('#J_input').hide();
											$('#J_inputtext').show();
										}
									})
								}
							}
						);
					}
				}
			);
			// 提交保存付款申请录入走审批
			$('#J_submit').on('click',function(){
				var clickToSelect = $('#J_deposittable_dataTable').bootstrapTable('getSelections');
				var paymentmoney = $('#J_paymentmoney').val();
				var in_receiptId = [];
				var amountmoney='';
				var attInfoList = [];
				var paymentinfolist=[];
				
				//判断付款款项为必填项
				var valtxt = $('#J_payment').val();
				if(valtxt == ''){
					layer.alert("不能增加数据，付款款项为必选项");
					return false;
				}
				var tabletr = $('#J_paymententry_dataTable tbody tr');
				if(tabletr.length==0){
					layer.alert('请填写付款信息，付款信息为必填项');
					return false;
				}
				//判断付款原因为必填
				var fukuanbit = $('#J_applyadd').val();
				if(fukuanbit == ''){
					layer.alert('请填写付款原因，付款原因为必填项');
					return false;
				}
				//新增数据
				$('#J_paymententry_dataTable .btn-editor').each(function(){
					var paymentinfol=$(this).data('obj');
					paymentinfol.payType=$(this).data('paytype');
					paymentinfol.fundCode=$(this).data('funcode');
					paymentinfol.receiverUserId=$(this).data('id');
					paymentinfolist.push(paymentinfol);
				})
				//附件信息
				$('#J_list_dataTable .btn_looktype').each(function(){
					attInfoList.push({
						businessType:result.data.businessType,
						fundCode:$('#J_payment').val(),
						fundName:paymentselect,
						largeType:$(this).data('biggerannexnum'),
						smallType:$(this).data('smallannexnum'),
						pathList:$(this).data('add')
					})
				})
				var  fundCode=$('#J_payment').val();	//付款款项类型
				var otherInfoList=[];
				if(fundCode==8){//评估费
					var pingguf=$('#J_evaluationtable_dataTable').bootstrapTable('getSelections');
					if(pingguf.length>0 && pingguf[0].receiptNumber)
					$.each(pingguf,function(i,n){
						otherInfoList.push({
							receiptId:n.receiptId,
	                        receiptNumber:n.receiptNumber
						});
					});
				}else if(fundCode==9){//抵押登记费
					var pingguf=$('#J_registrationtable_dataTable').bootstrapTable('getSelections');
					if(pingguf.length>0 && pingguf[0].receiptNumber)
					$.each(pingguf,function(i,n){
						otherInfoList.push({
							receiptId:n.receiptId,
	                        receiptNumber:n.receiptNumber
						});
					});
				}else if(fundCode==11){//返信息费
					$('#J_Returninformation_dataTable tbody tr').each(function(){
						otherInfoList.push({
							invoiceAmount: $(this).find(':input').eq(3).val(),	//发票金额
	                        invoiceCount: $(this).find(':input').eq(0).val(),	//发票数量
	                        invoiceDesc: $(this).find(':input').eq(1).val()	//发票摘要
						});
					});
				}else if(fundCode==14){//签约差旅费
					$('#J_Signedinformation_dataTable tbody tr').each(function(){
						otherInfoList.push({
							invoiceAmount: $(this).find(':input').eq(3).val(),	//发票金额
	                        invoiceCount: $(this).find(':input').eq(0).val(),	//发票数量
	                        invoiceDesc: $(this).find(':input').eq(1).val()	//发票摘要
						});
					});
				}else if(fundCode==5){//代付押金
					var daifyj=$('#J_deposittable_dataTable').bootstrapTable('getSelections');
					if(daifyj.length>0 && daifyj[0].receiptNumber)
					$.each(daifyj,function(i,n){
						otherInfoList.push({
							receiptId:n.receiptId,
	                        receiptNumber:n.receiptNumber
						});
					});
				}else if(fundCode==7){//代付房租
					var daiffz=$('#J_contractList').bootstrapTable('getSelections');
					if(daiffz.length>0 && daiffz[0].receiptNumber)
					$.each(daiffz,function(i,n){
						otherInfoList.push({
							receiptId:n.receiptId,
	                        receiptNumber:n.receiptNumber
						});
					});
				}
				jsonPostAjax(
					basePath + '/finance/payment/apply/paymentSubmit',
					{	
						"contractId":contractId,
						"contractNumber":$('#J_Contract_h').text(),
						"fundCode":fundCode,
						"isChargeback":chargebackId == null ? 0 : 1,
						"chargebackId":chargebackId,
						"chargebackNumber":chargebackNumber,
						"paymentType":1,
						"remarks":$('#J_applyadd').val(),
						"attInfoList":attInfoList,
						"paymentInfoList":paymentinfolist,
						"otherInfoList":otherInfoList
					},
					function(result) {
						layer.msg("操作成功");
						$('#J_submit').attr('disabled',"true");
						var dataappLy = result.data.applyId;
						var paymentType = result.data.paymentType;
						window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+paymentType+'&applyId='+dataappLy;
					}
				);
			})
		})
	}
}

//上传文件方法
var attachmentView={
	initFalg:true,
	chargebackId:location.search.split('&')[0].split('=')[1],
	init:function(dataresultdata){
		var _this=this;
		//选择文件
		$('#addAttachment').off().on('click',function(){
			//判断付款款项为必填项
			var valtxt = $('#J_payment').val();
			if(valtxt == ''){
				layer.alert("不能上传附件，付款款项为必选项");
				return false;
			}
			commonContainer.modal('上传附件',$('#attachmentCon'),function(i){
				var biggerannexnum = $('#J_attachmentType').val().split('，')[0];
				var smallannexnum = $('#J_smallattachmentType').val().split('，')[0];
				if(biggerannexnum == ''){
					layer.alert('附件大类为必填项,请填写');
					return false;
				}
				if(smallannexnum == ''){
					layer.alert('附件小类为必填项,请填写');
					return false;
				}
				_this.saveFile('',i);
				_this.fileList();
			},{
				area:['800px','400px'],
				overflow :true,
				success:function(){
					$('#J_attachmentType').val('');
					$('#J_attachmentType').trigger("chosen:updated");
					$('#J_smallattachmentType').val('');
					$('#J_smallattachmentType').trigger("chosen:updated");
					$('#J_categoryName').html('');
					$('#J_remarktext').html('');
					_this.popCalbank();
					var paymentval = $('#J_payment').val();
					
					if(paymentval == '5'){
						paymentselectval = '代付押金';
					}
					if(paymentval == '7'){
						paymentselectval = '代付房租';
					}
					if(paymentval == '8'){
						paymentselectval = '评估费';
					}
					if(paymentval == '9'){
						paymentselectval = '抵押登记费';
					}
					if(paymentval == '10'){
						paymentselectval = '多存款';
					}
					if(paymentval == '11'){
						paymentselectval = '返信息费';
					}
					if(paymentval == '12'){
						paymentselectval = '赔偿金';
					}
					if(paymentval == '13'){
						paymentselectval = '普租分期';
					}
					if(paymentval == '14'){
						paymentselectval = '签约差旅费';
					}
					$('#J_businessType').text($('#J_typecontract_h').html());
					$('#J_Paymenttext').text(paymentselectval);
					var auditStep=[];
					$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
						auditStep.push(dataresultdata[$(this).data('index')].fundName);
					})
					
					var flag = false;
					if(auditStep.length>1){
						var fundname = auditStep[0];
						$.each(auditStep,function(i,n){
							if(i>0){
								if(fundname != n){
									layer.alert('款项不一致,重新选择');
									flag = true;
									return false;
								}
							}
							
						})
					}
					if(flag){
						return false;
					}
				}
			});
		});
	},
	//附件列表
	fileList:function(){
		var _this=this;
		var contenthtml='';
		var addlistname = JSON.stringify(enclosureList);
		var biggerannex = $('#J_attachmentType').val().split('，')[1];
		var biggerannexnum = $('#J_attachmentType').val().split('，')[0];
		var smallannex = $('#J_smallattachmentType').val().split('，')[1];
		var smallannexnum = $('#J_smallattachmentType').val().split('，')[0];
		var dataadd='data-add='+addlistname;
		newstime = laydate.now(0, 'YYYY-MM-DD hh:mm:ss');
		//列表赋值
		contenthtml='\
			<tr>\
				<td class="add_create" style="text-align: center; padding:8px;"></td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+biggerannex+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+smallannex+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+newstime+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;"><a type="looktype" '+dataadd+' data-remark="'+remarkval+'" data-titlename="'+categoryName+'" class="btn btn-outline btn-success btn-xs btn_looktype" data-newstime="'+newstime+'" data-smallannexnum="'+smallannexnum+'" data-biggerannexnum="'+biggerannexnum+'" data-index="'+index+'">预览</a>&nbsp;&nbsp;<a type="del" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
			</tr>';
		$('#J_list_dataTable tbody').append(contenthtml);
		attachmentView.reIndex();
		$('#J_list_dataTable').off().delegate('a','click',function(target,type){
			var _this=this;
			if(this.type == 'looktype'){
				commonContainer.modal('查看附件',$('#J_attachmentCon'),function(i){
					layer.close(i);
					$('#J_upFileName').html('');
				},{
					btns:['关闭'],
					area:['800px','400px'],
					overflow :true,
					success:function(){
						$('#J_upFileName').html('');
						$('#J_bigger').html(biggerannex);
						$('#J_small').html(smallannex);
			    		$('#J_titleName').html($(_this).data('titlename'));
			    		if($(_this).data('remark') != "undefined"){
							$('#J_valremark').html($(_this).data('remark'));
						}else{
							$('#J_valremark').html('');
						}
						$('#J_businesstype').text($('#J_typecontract_h').html());
						$('#J_Paymenttextval').text(paymentselectval);
						var htmlnews='';
						$.each($(_this).data('add'),function(i,n){
							htmlnews+='\
				    			<div class="col-md-3" style="padding-top:18px;text-align: center;">\
				    				<img src="'+n.path+'" width="80%" height="100">\
				    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+n.title+'</div>\
				    				<button type="button" data-opt="del" class="btn btn-outline btn-success btn-xs mt-3" onclick="attachmentView.download(\''+n.path+'\')">下载</button>\
			    				</div>';
						})
			    		$('#J_upFileName').append(htmlnews);
					}
				});
			}else if(this.type == 'del'){
				var trlength = $('#J_list_dataTable tbody').find('tr').length;
				if(trlength>0){
					commonContainer.confirm(
						'是否确认删除信息？',function(index, layero){
							$(_this).parent().parent().remove();
							attachmentView.reIndex();
							layer.close(index);
						}
					);
				}
				
			}
		})

	},
	reIndex:function(){
		$('#J_list_dataTable tbody tr').each(function(i){
			$(this).find('td').eq(0).text(i+1);
		})
	},
	//文件上传至文件服务器
	upFile:function(){
		var _this=this;
		var upImglock=false;
		//$('#upFile').val('###');
		$('#selectFile').off().on('click',function(){
			$('#upFile').click();
			_this.fileChangeEvt(upImglock);
		});
		_this.fileChangeEvt(upImglock);
	},
	fileChangeEvt:function(lock){
		$('#upFile').off().on('input change',function(){
			var upFileObj=this.files[0];
			if(lock){
				return false;
			}else{
				lock=true;
			}
			//var that=this;
			var formData=new FormData();
			formData.append('files',this.files[0]);
			$.ajax({
				url: basePath+'/custom/common/multiFileUpload.htm',
			    type: 'POST',
			    async:true,
			    cache: false,
			    data: formData,
			    processData: false,
			    contentType: false,
			    dataType:'json',
			    success:function(result){
			    	lock=false;
			    	if(result.code==0){
			    		var html='\
			    			<div class="col-md-3" style="padding-top:18px;text-align: center;" data-filename="'+result.data[0].filename+'" data-filepath="'+result.data[0].filepath+'">\
			    				<img src="'+result.data[0].filepath+'" width="80%" height="100">\
			    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+result.data[0].filename+'</div>\
			    				<button type="button" data-opt="del" class="btn btn-outline btn-danger btn-xs" onclick="attachmentView.delteFile(this)">删除</button>\
		    				</div>';
			    		$('#upFileName').append(html);
			    	}else{
			    		commonContainer.alert(result.msg);
			    	}
			    },
			    error:function(){
			    	lock=false;
			    	layer.alert(errorMsg);
		    	}
			});
			//重置上传文件控件
			$('#fileHidden').html('<input type="file" id="upFile">');
		});
	},
	delteFile:function(target){
		$(target).parent().remove();
	},
	//保存附件 type=1修改
	saveFile:function(target,i,type){
		var _this=this;
		//验证必填项
		//附件类型
		var attachmentType=$('#attachmentType').val();
		if(attachmentType==''){
			commonContainer.alert('请选择附件类型');
			return false;
		}
		var upFileLIst=$('#upFileName >div');
		if(upFileLIst.length==0){
			commonContainer.alert('请选择文件');
			return false;
		};
		layer.close(i);
		enclosureList=[];
		upFileLIst.each(function(i){
			
			enclosureList.push({
				title:$(this).data('filename'),
				path:$(this).data('filepath')
			});
			if(type==1){
				var enclosurePathid=$(this).data('enclosurepathid');
				enclosureList[i].enclosurePathId=(enclosurePathid==undefined?'':enclosurePathid);
			}
		});
	},
	//弹窗成功回调
	popCalbank:function(data){
		var attachmentType='';
		var remarks='';
		var upFileList='';
		if(data){
			attachmentType=data.type.toString();
			if(data.remark!==undefined){
				remarks=data.remark;
			}
			if(data.enclosureList && data.enclosureList.length>0){
				$.each(data.enclosureList,function(i,n){
					upFileList+='\
		    			<div class="col-md-3" style="padding-top:12px;text-align: center;" data-filename="'+n.title+'" data-filepath="'+n.path+'" data-enclosurePathid="'+n.enclosurePathId+'">\
		    				<img src="'+n.path+'" width="80%" height="100">\
		    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+n.title+'</div>\
		    				<button type="button" data-opt="del" class="btn btn-outline btn-danger btn-xs" onclick="attachmentView.delteFile(this)">删除</button>\
	    				</div>';
				});
			}
		}
		$('#remarks').val(remarks);
		$('#upFileName').html(upFileList);
			//初始select下拉框
			$('select').chosen({
				width:'100%'
			});
			//附件类型
			/*dimContainer.buildDimChosenSelector($('#attachmentType'),'type',attachmentType);*/
			var businesstype=$('#J_typecontract_h').html();
			if(businesstype=='买卖'){
				businesstype='2';
			}else if(businesstype=='租赁'){
				businesstype='1';
			}
			commonContainer.initChosen($('#J_attachmentType'));
			var options = [];
		    jsonPostAjax(
				basePath +'/finance/common/getFinanceAttachPrimaryList',
				{
					"businessType":businesstype,
					"fundCode":$('#J_payment').val()
					
				}, 
				function(result) {
		    		categoryName = result.data[0].categoryName;
		    		remarkval = result.data[0].remark;
		    		$.each(result.data, function(n, value) {
		    	    	options.push('<option value="'+value.categoryCode +'，'+ value.categoryName + '">' + value.categoryName + '</option>');
		    	    })
		    	    $('#J_attachmentType').html('<option value="">请选择</option>'+options.join(''));
		    		$('#J_attachmentType').trigger("chosen:updated");
		    		
			});
		  //根据大类获取附件小类
		    var option = [];
			$('#J_attachmentType').on('input change',function(){
				option = [];
				var attachtype = $(this).val().split('，')[0];
	    		$('#J_categoryName').html(categoryName);
	    		$('#J_remarktext').html(remarkval);
	    		if(attachtype !=''){
	    			jsonGetAjax(
    					basePath +'/finance/common/getFinanceAttachSecondaryList',
    					{
    						"categoryCode":attachtype
    						
    					}, 
    					function(result) {
    			    		$.each(result.data, function(n, value) {
    			    			option.push('<option value="' + value.secondaryCategoryCode +'，'+value.secondaryCategoryName +'">' + value.secondaryCategoryName + '</option>');
    			    	    })
    			    	    $('#J_smallattachmentType').html('<option value="">请选择</option>'+option.join(''));
    			    		$('#J_smallattachmentType').val('');
    			    		$('#J_smallattachmentType').trigger("chosen:updated");
    					}
    				)
	    		}else{
	    			$('#J_smallattachmentType').html('<option value="">请选择</option>');
	    			$('#J_smallattachmentType').val('');
		    		$('#J_smallattachmentType').trigger("chosen:updated");
	    		}
			})
			this.upFile();
	},
	//下载文件
	download:function(filePath){
		window.open(basePath+'/sign/downloadEnclosure.htm?filePath='+filePath);
	}
}

function Inquire(){
	jsonGetAjax(
		basePath + '/custom/common/getcuruserinfo',
		{},
		function(result) {
			$('#J_userName').text(result.data.userName);
			$('#J_userid').val(result.data.userId);
		}
	)
}

//身份证号验证
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
	obj.value=obj.value.replace(/[^\d]/g,'');   // 只能输入数字
	obj.value=obj.value.replace(/[^\d.]/g,''); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,''); //验证第一个字符是数字而不是"."
	obj.value = obj.value.replace(/\.{2,}/g,'.'); //只保留第一个. 清除多余的
	obj.value = obj.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
	return obj.value;
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 