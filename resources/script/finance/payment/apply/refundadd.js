var index=0;
var tuikuanSum=null;
var paymentfundName = '';
var ownerName = '';
var clientName = '';
var categoryName='';
var remarkval='';

var editerPayeetype='';
var editerPayeename='';
var editerfinanceCardType ='';
var editerDocumentnumber = '';
var flagtype = true;
var fundcodenumber = '';
var fundCodeNum='';
var datauesrId='';
var receiptList= '';

var contractid=getQueryString("contractNo");
var chargebackId=getQueryString("chargebackid");
var chargebackNumber=getQueryString("chargebacknumber");
var selectionId=getQueryString("selection");
var Payeetypeval = '';
var dataresultdata = '';
var paymentbatchId = '';
$(function() {
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	
	$('#J_Choosecontract').val('1');
	$('#J_Choosecontract').trigger("chosen:updated");
	$('#J_reset').on('click',function(){
		commonContainer.closeWindow();
	})
	if(contractid){
		addChargebackView.getContractAndReceiptInfo(contractid);
		
		$('#J_selectContract').hide();
		$('#J_paymentbutton').text('保存');
	} else {
		Inquire();
		$('#J_annex').show();
		if($('#J_Choosecontract').val() == '1'){ // 合同跳转	
			$('#addContractNum').show();
			$('#addclientNum').hide();
			$('#J_applyadd').val('');
			addChargebackView.init();
		}else{// 客服跳转跳转		
			$('#addclientNum').show();
			$('#addContractNum').hide();
			$('#J_applyadd').val('');
			addChargeclientView.init();
		}
		
		$('#J_Choosecontract').on('input change',function(){
			var contractNum = $(this).val();
			if(contractNum=='1'){
				$('#J_iboxpay').hide();
				$('#addContractNum').show();
				$('#addclientNum').hide();
				$('#addContractNumber').val('');
				$('#J_applyadd').val('');
				$('#J_paymententry_dataTable tbody').html('');
				$('#J_Attachmentupload_dataTable tbody').html('');
				addChargebackView.init();
			}else{
				$('#J_iboxpay_finance').hide();
				$('#addclientNum').show();
				$('#addContractNum').hide();
				$('#addclientNumber').val('');
				$('#J_applyadd').val('');
				$('#J_paymententry_dataTable tbody').html('');
				$('#J_Attachmentupload_dataTable tbody').html('');
				addChargeclientView.init();
			}
		})
	}
	
	//点击取消按钮出发事件
	$('#J_reset').on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/refund/add.htm';
	})
});

//选择合同方法
var addChargebackView={
	init:function(){
		var _this=this;
		//初始select下拉框
		$("select").chosen({
			width : "100%" , no_results_text: "未找到此选项!" 
		});
		//业务类型
		dimContainer.buildDimChosenSelector($('#J_searchbusinessType'),'businessType','');
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
				$('#J_paymentmoeny').html('0.00');
				_this.getAddContract(i);
				$('#J_searchbusinessType').val('');
				$('#J_searchbusinessType').trigger('chosen:updated');
				var refundAddDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
				if(refundAddDataArr.length==0){
					layer.alert("没有选中合同数据，请选择");	
					return false;
				}
			},{
				area:['80%','70%'],
				btns:['确定','取消'],
				overflow :true,
				success:function(){
					$('#J_searchbusinessType').val('');
					$('#J_searchbusinessType').trigger('chosen:updated');
					if(isInit){
						$('#J_searchcontract').off().on('click',_this.contractList);
						$('#J_reset').on('click',function(){
							$('#J_deptName').attr('data-id','');			//重置所属部门id
						});
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
				var listbusinessType=$('#J_searchbusinessType').val();
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
		$('select').chosen({
			width:'100%'
		});
		var _this=this;
		var checkrowDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
		if(checkrowDataArr.length>0 && checkrowDataArr[0].contractId!==undefined){
			layer.close(i);
			_this.getContractAndReceiptInfo(checkrowDataArr[0].contractId);
		}	
	},
	
	// 获取合同信息&收据列表
	getContractAndReceiptInfo : function(contractId) {
		//回显新增合同信息
		jsonGetAjax(basePath+'/finance/choose/info',{
			contractId:contractId		//合同主键id
		},function(result){
			contractId = result.data.contractId;
			//回显新增合同信息
			$('#J_iboxpay_finance').show();
			$('#addContractNumber').val(result.data.contractNumber);	
			$('#J_Contract_h').text(result.data.contractNumber?result.data.contractNumber:'-');
			$('#J_typecontract_h').text(result.data.strBusinessType?result.data.strBusinessType:'-');
			$('#J_diaplaynone').text(result.data.businessType?result.data.businessType:'-');
			$('#J_houseId_h').text(result.data.houseId?result.data.houseId:'-');
			$('#J_clientId_h').text(result.data.clientId?result.data.clientId:'-');
			$('#J_ownerName_h').text(result.data.ownerName?result.data.ownerName:'-');
			$('#J_clientName_h').text(result.data.clientName?result.data.clientName:'-');
			ownerName = result.data.ownerName;
			clientName = result.data.clientName;
			var paymentstrPayer = '';
			//加载收据列表数据项
			var paymentUserName= '';
			var parmData = jQuery('#J_query').serializeObject();
			parmData.contractId = result.data.contractId;
			parmData.paymentType = 2;
			jsonPostAjax(basePath+'/finance/payment/apply/getRefundReceiptList',parmData,function(dataresult){
				dataresultdata = dataresult.data;
				$('#J_refunds_dataTable').bootstrapTable('destroy');
				if(dataresultdata.length>0){
					$('#J_refunds_dataTable').bootstrapTable({
						data:dataresultdata,
						columns:[
					        {field: 'flyid',title :'序号',checkbox:true, align: 'center',
				           		formatter: function(value, row, index){	
				           			var html='<input type="hidden" id="J_auditId" name="category" class="cbx"'+
				           			' data-payer="'+row.payer+'" data-strPayer="'+row.strPayer+'"'+
				           			' data-payee="'+row.payee+'" data-strPayee="'+row.strPayee+'"'+
				           			' data-fundCode="'+row.fundCode+'" data-fundName="'+row.fundName+'"'+
				           			' data-receiptId="'+row.receiptId+'" data-receiptNumber="'+row.receiptNumber+'"'+
				           			' data-batchId="'+row.batchId+'" contract="'+row.receiptId+'"'+
				           			' >' ;
				           			return html;
				           		}
				           	},
				      	    {field: 'batchId', title: '收款批次号', align: 'center',
				           		formatter: function(value, row, index) {	
				      				var html = '';
				      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
				      				html = '<a class="paymentbatchId" href="'+url+'" target="_blank">'+ row.batchId +'</a>';
				      				return html;
				      	    	}
				      	    },
				      	    {field: 'receiptNumber', title: '收据编号', align: 'center',
				      	    	formatter: function(value, row, index) {	
				      				var html = '';
				      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
				      				html = '<a class="per" href="'+url+'" target="_blank">'+ row.receiptNumber +'</a>';
				      				return html;
				      	    	}
				      	    },
				      	    {field: 'strPayer', title: '付款方', align: 'center',
				      	    	formatter: function(value, row, index){	
				           			var html='';
				           			var strPayer = value ? value : '-';
				           			html='<span class="paymentstrPayer">'+strPayer+'</span>';
				           			return html;
				           		}
				      	    },
				      	    {field: 'strPayee', title : '收款单位', align : 'center'},
				      	    {field: 'fundName', title: '款项', align: 'center',
				      	    	formatter: function(value, row, index){	
				           			var html='';
				           			var fundName = value ? value : '-';
				           			html='<span class="paymentfundName">'+fundName+'</span>';
				           			return html;
				           		}
				      	    },
				      	    {field: 'amount', title: '收据金额', align: 'center',
				      	    	formatter: function(value, row, index){	
				           			var html='';
				           			var amount = value ? value : '-';
				           			html='<span class="per">'+amount+'</span>';
				           			return html;
				           		}
				      	    },
				      	    {field: 'refundAmount', title: '退款金额', align: 'center',
				      	    	formatter: function(value, row, index){	
				           			var html='';
				           			var refundAmount = value ? value : '-';
				           			html='<input type="text" id="zhuan'+index+'" class="form-control input_return zhuankuan" name="" readonly value="" placeholder="0.00">';
				           			return html;
				           		}
				      	    },
				      	    {field: 'invoiceNumbers', title: '发票编号', align: 'center'},
					      	{field: 'printCount', title: '收据打印张数', align: 'center'},
					      	{field: 'recycleCount', title: '收据回收张数', align: 'center',
					      		formatter: function(value, row, index){
					      			if(row.invoiceNumbers){
					      				var html='';
					           			var returnCount = value ? value : '-';
					           			html='<span>'+returnCount+'</span>';
					           			return html;
					      			}else{
					      				var html='';
					           			html='<input type="text" id="'+index+'" class="form-control input_return" name="" readonly value="">';
					           			return html;
					      			}
				           			
				           		}
					      	},
					      	{field: 'differentReason', title: '回收差异原因', align: 'center',
					      		formatter: function(value, row, index){
					      			if(row.invoiceNumbers){
					      				var html='';
					           			var returnDiffReason = value ? value : '-';
					           			html='<span>'+returnDiffReason+'</span>';
					           			return html;
					      			}else{
					      				var html='';
					           			html='<input type="text" id="yin'+index+'" class="form-control input_val" name="" readonly value="">';
					           			return html;
					      			}
				           		}
					      	}
				      	]
					});
					
					var Calculation = '0.00';
					var mun=null;
					var value=null;
					var btSelectItem=$('#J_refunds_dataTable input[name="btSelectItem"]');
					btSelectItem.off().on('click',function(){
						if($(this).is(':checked')){
							$('#'+$(this).data('index')).prop('readonly',false);
							$('#zhuan'+$(this).data('index')).prop('readonly',false);
							$('#yin'+$(this).data('index')).prop('readonly',false);
							if(btSelectItem.length==$('#J_refunds_dataTable input[name="btSelectItem"]:checked').length){
								$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',true);
							}else{
								$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',false);
							}
							
						}else{
							$('#'+$(this).data('index')).prop('readonly',true);
							$('#zhuan'+$(this).data('index')).prop('readonly',true);
							$('#yin'+$(this).data('index')).prop('readonly',true);
							$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',false);
							if($('#zhuan'+$(this).data('index')).val() != ''){
								mun-=$('#zhuan'+$(this).data('index')).val()*1;
								$('#J_paymentmoeny').html(mun);
								$('#zhuan'+$(this).data('index')).val('');
								$('#yin'+$(this).data('index')).val('');
								$('#'+$(this).data('index')).val('');
							}
						}
					});
					//选中行转款金额计算
					$('.zhuankuan').off().on('blur focus',function(e){
						if (/^\d+$/.test(this.value)) {
			                this.value = this.value + '.00';
			            }
						if(e.type=='focus'){
							value=$(this).val()*1;
							mun-=$(this).val()*1;
						}else{
							if(value!==$(this).val()*1){
								mun+=$(this).val()*1;
							}
							$('#J_paymentmoeny').html(mun.toFixed(2));
						}
					});
				}
				attachmentView.init(dataresultdata);
			
			
			// 付款信息新增
			$('#J_increaseCheck').off().on('click',function(){
				//判断是否选中收据信息
				var checklength = $("#J_refunds_dataTable input[name='btSelectItem']:checked").length;
				if(checklength==0){
					layer.alert("请选择收据信息");
					return false;
				}
				
				var isBreak = false;
				var hasWjaj = false;
				$("#J_refunds_dataTable tbody tr").each(function(){
					var dataObj = $(this).find("td:eq(0)").find('input[type=hidden]');
					if(dataObj.attr('data-payee') == "2"
						&& dataObj.attr('data-fundcode') == "1") {
						hasWjaj = true;
						return false;
					}
				});

				$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
					var dataObj = $(this).next('input');
					if(hasWjaj && dataObj.attr('data-payee') == "1") {
						isBreak = true;
						return false;
					}
				})
				
				if(isBreak){
					layer.alert("请优先处理伟嘉安捷佣金退款");
					return false;
				}
				
				var paymentevaluate = $('#J_payment').val();
				// 判断收据单列表所选项收据批次号是否相同
				var stepFlag = false;
				var normalAuditStep = '';
				var strPayerArr=[];
				var strPayeeArr=[];
				var strfundNameArr=[];
				var strallArr=[];
				var strfundCodeArr = [];
				$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(index,element){
					var batchId = $(this).parent().find('#J_auditId').attr('data-batchId');
					
					//付款方是否相等
					strPayerArr.push(dataresultdata[$(this).data('index')].strPayer);
					//收款单位是否相等
					strPayeeArr.push(dataresultdata[$(this).data('index')].strPayee);
					//款项是否相等
					strfundNameArr.push(dataresultdata[$(this).data('index')].fundName);
					//款项编号
					strfundCodeArr.push(dataresultdata[$(this).data('index')].fundCode);
					strallArr.push(dataresultdata[$(this).data('index')]);
					if(index==0) normalAuditStep = batchId;
					if(batchId != normalAuditStep){	
						stepFlag = true;
					}
				});
				var isfuk=false;
				var isfukdw=false;
				var isfundName=false;
				//判断付款发是否相等
				for(var i=1;i<strPayerArr.length;i++){
					if(strPayerArr[0]!==strPayerArr[i]){
						isfuk=true;
						break;
					}
				}
				//判断收款单位是否相等
				for(var i=1;i<strPayeeArr.length;i++){
					if(strPayeeArr[0]!==strPayeeArr[i]){
						isfukdw=true;
						break;
					}
				}
				//判断款项是否相等
				for(var i=1;i<strfundNameArr.length;i++){
					if(strfundNameArr[0]!==strfundNameArr[i]){
						isfundName=true;
						break;
					}
				}
				if(isfuk){
					layer.alert("所选项必须是相同付款方，请重新选择");
					return false;
				}
				if(isfukdw){
					layer.alert("所选项必须是相同收款单位，请重新选择");
					return false;
				}
				if(isfundName){
					layer.alert("所选项必须是相同款项，请重新选择");
					return false;
				}
				commonContainer.modal(
						'付款信息新增',
						$('#J_increase'),
						function(index, layero) {
							Payeetypeval = $('#J_Payeetype').val();
							var payeehtml = '';
							var tuiPOShtml = '';
							var paymentmethod = $('#J_labeliscash').text();
							var payzhanghao = ''
							var paymentpopmoney =$('#J_paymentmoney').val();
							$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
								if(true == $(this).is(':checked')){
									paymentfundName = $(this).parent().parent().find(".paymentfundName").html();
									paymentbatchId =  $(this).parent().parent().find(".paymentbatchId").html();
									paymentstrPayer = $(this).parent().parent().find(".paymentstrPayer").html();
									fundcodenumber = $(this).next().data('fundcode');
								}
							});
							//判断付款方式collectionId  receiverName collectionBatchId
							var payFs=$("input[name='isShouweiyj']:checked").val();
							var paymentmethod='';
							var datafundname=$('#formId').serializeObject();
							if(payFs==1){
								datafundname.collectionBatchId=strallArr[0].batchId	//收款批次号	
								datafundname.fundCode=strfundCodeArr[0];					//付款款项
								datafundname.payType=1										//付款方式 1，现金；2，支票；3，转账；4；退POS（退款使用）5；退款转出（转款使用） ,										
								paymentmethod='现金';
							}else if(payFs==2){
								datafundname.collectionBatchId=strallArr[0].batchId	//收款批次号	
								datafundname.fundCode=strfundCodeArr[0];					//付款款项
								datafundname.payType=2
								paymentmethod='支票';	
							}else if(payFs==3){
								datafundname.collectionBatchId=strallArr[0].batchId	//收款批次号	
								datafundname.fundCode=strfundCodeArr[0];					//付款款项
								datafundname.payType=3
								paymentmethod='转账';
							}else if(payFs==4){
								paymentmethod='退POS';
								var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
								if(choustuipos.length>0){
									datafundname=[];
								var getMoney=$("#J_tuipos_dataTable input[name='btSelectItem']:checked");
									$.each(choustuipos,function(i,n){
										var idName='#amount'+getMoney.eq(i).data('index');
										datafundname.push({
											collectionBatchId:choustuipos[i].batchId,	//收款批次号	
											fundCode:strfundCodeArr[0],					//付款款项
											payType:4,
											collectionId:choustuipos[i].collectionId,
											bankAccount:choustuipos[i].payerAccountNo,
											payAmount:$(idName).val()
										});
									});
									
								}
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
							if(payFs==3){
								paymentUserName = $('#J_Accountholder').val();
							}
							
							// 验证必填项
							var $Payeetype = $('#J_Payeetype').val();               //收款人类型
							var $Payeename = '';               						//收款人
							var $iputvalue = $('#iputvalue').val();                 //收款人
							var $user = $('#J_user').val();                         //收款人
							var $documentType = $('#J_financeCardType').val();         //收款人证件类型
							var $Documentnumber = $('#J_Documentnumber').val();     //证件号码
							var $paymentmoney = $('#J_paymentmoney').val();
							var $accounttypeofAccount=$('#J_accounttypeofAccount').val(); //开户人证件类型
							var $accountnumber=$('#J_accountnumber').val(); //开户人证件号码
							var $Accountholder=$('#J_Accountholder').val(); //开户人
							var $accountType=$('#J_accountType').val();  //账号类型
							var $Openbank=$('#J_Openbank').val();  //开户行
							var $bankName=$('#J_bankName').val();  //银行支行名称
							var $account=$('#J_account').val();  //账号
							
							if(payFs=="1"){ //现金
								if(Payeetypeval == ''){
									layer.alert('收款人类型不能为空');
									return false;
								}
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
							if(payFs=="2"){ //支票
								if(Payeetypeval == ''){
									layer.alert('收款人类型不能为空');
									return false;
								}
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
							if(payFs=="3"){ // 转账
								if(Payeetypeval == ''){
									layer.alert('收款人类型不能为空');
									return false;
								}
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
							if(payFs=="4"){ // 退POS
								var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
								var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
								var idNameval='';
								$.each(choustuipos,function(i,n){
									var idName='#amount'+getMoney.eq(i).data('index');
									idNameval = $(idName).val();
								});
								if(idNameval == ''){
									layer.alert('退POS金额不能为空');
									return false;
								}
							}
							var dataObj=JSON.stringify(datafundname);
							var dataobjval = 'data-Obj='+dataObj;
							if(payFs!=4){
								payeehtml='\
									<tr>\
										<td class="add_create" style="text-align: center; padding:8px;">'+paymentbatchId+'</td>\
										<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
										<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
										<td class="add_create" style="text-align: center; padding:8px;">'+paymentpopmoney+'</td>\
										<td class="add_create" style="text-align: center; padding:8px;">'+payzhanghao+'</td>\
										<td class="add_create" style="text-align: center; padding:8px;">'+paymentUserName+'</td>\
										<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-fundCode="'+fundcodenumber+'" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+paymentpopmoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
									</tr>';
								$('#J_paymententry_dataTable tbody').append(payeehtml);
							}
							tuikuanSum+=paymentpopmoney*1;
							editerPayeename=$Payeename;
							editerfinanceCardType =$('#J_financeCardType').val();
							editerDocumentnumber = $('#J_Documentnumber').val();
							$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
							
							//退pos选中数据返回显示新增数据
							var checkrowDataArr=$('#J_tuipos_dataTable').bootstrapTable('getSelections');	//选中的退POS数据
							var idName='';
							$("#J_tuipos_dataTable input[name='btSelectItem']:checked").each(function(){
								idName='#amount'+$(this).data('index');
							});
							
							if(checkrowDataArr.length>0){
								$.each(checkrowDataArr,function(i,n){
									var idNameMoney = $(idName).val();
									tuiPOShtml+='\
										<tr>\
											<td class="add_create" style="text-align: center; padding:8px;">'+n.batchId+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+idNameMoney+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+n.payerAccountNo+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+(n.payerName==undefined?'-':n.payerName)+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-fundCode="'+fundcodenumber+'" data-money="'+idNameMoney+'" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+idNameMoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
										</tr>';
									tuikuanSum+=idNameMoney*1;
								})
								$('#J_paymententry_dataTable tbody').append(tuiPOShtml);
								$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
								tuiPOShtml='';
							}
							layer.close(index);
						}, 
						{
							overflow :true,
							area:['800px','400px'],
							btns : ['确定', '取消'],
							success: function() {
								$('#J_isTransfer').prop('checked',true);
								$('#J_iscash').prop('checked',false);
								$('#J_ischeck').prop('checked',false);
								$('#J_tuipos').prop('checked',false);
								$('#isTransfer').show();
								$('#iscash').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
								
								$('#J_paymentmoney').off().on('blur',function(e){
									if (/^\d+$/.test(this.value)) {
						                this.value = this.value + '.00';
						            }
								});
								//??
								if(flagtype){
									//收款人类型
									dimContainer.buildDimChosenSelector($('#J_Payeetype'),'paymentReceiverType','');
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
								//??
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
								$('#J_receiverUnit').val('');
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
								});
								//??
								var optionsbank = [];
								$('#formId').on('onSetSelectValue' , '#J_Openbank' ,function(e,data){
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
								});
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
								});
								$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
										if(true == $(this).is(':checked')){
											paymentbatchId =  $(this).parent().parent().find(".paymentbatchId").html();
											paymentstrPayer = $(this).parent().parent().find(".paymentstrPayer").html();
											if(paymentstrPayer=='-'){
												paymentstrPayer='';
												return false;
											}
										}
									})
								
								//证件类型
								dimContainer.buildDimChosenSelector($('#J_financeCardType'),'financeCardType','');
								var checkrowDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
								//退POS 加载数据列表
								$('#J_tuipos_dataTable').bootstrapTable('destroy').bootstrapTable({
									url:basePath+'/finance/payment/apply/getRefundPosCollectionList',
									method:'get',
									sidePagination:'server',
									dataType:'json',
									pagination: false,
									singleSelect:false,		//设置单选
									clickToSelect:false,		//点击选中行
									striped:true,
									pageSize:10,
									pageList:[10, 20, 50],
									queryParams: function (params) {
										var data=$('#J_query').serializeObject();
											data.collectionBatchId = paymentbatchId;
										return data;
									},
									responseHandler: function(result) {
										if (result.code == 0 && result.data){
											return {
												'rows': result.data
											}
										}
										return {
											'rows': []
										}	
									},
									columns:[
							         	{
							         		field: '',
									    	title :'选择',
									    	checkbox:true,
									    	align:'center',
									    	formatter: function(value, row, index){	
							           			var html='';
							           			html='<input type="hidden" id="J_auditId" data-collectionId="'+row.collectionId+'">';
							           			return html;
							           		}
							         	},
										{
											field : 'batchId',
											title : '收款批次',
											align : 'center'
										},
										{
											field : 'collectionId',
											title : '收款编号',
											align : 'center'
										},
										{
											field : 'paymentTime',
											title : '原刷卡日期',
											align : 'center',
											formatter: function(value, row, index) {	
							      				var html = '';
							      				var paymentTime = row.paymentTime ? row.paymentTime : '-'
							      				html = paymentTime.substring(0,11);
							      				return html;
							      	    	}
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
											title : '<span style="color:#ff0000">*</span>本POS退款金额',
											align : 'center',
											formatter: function(value, row, index){
							      				var html='';
							           			html='<input type="text" data-index="'+index+'" id="amount'+index+'" class="form-control" name="" value="">';
							           			return html;
							           			
							           		}
										}
									]
								});
								
							}
						}
					);
				$('#J_isTransfer').prop('checked',true);
				$('#J_isTransfer').on('click',function(){
					$('#iscash').show();
					$('#isTransfer').show();
					$('#J_tuipos').hide();
					$('#J_paperworcompany').hide();
				});
				$('#J_iscash').on('click',function(){
					$('#isTransfer').hide();
					$('#iscash').show();
					$('#J_tuipos').hide();
					$('#J_paperworcompany').hide();
					
				});
				$('#J_ischeck').on('click',function(){
					$('#isTransfer').hide();
					$('#iscash').show();
					$('#J_tuipos').hide();
					$('#J_paperworcompany').show();
				});
				$('#J_istuiPost').on('click',function(){
					$('#iscash').hide();
					$('#isTransfer').hide();
					$('#J_tuipos').show();
					$('#J_paperworcompany').hide();
				});
			});
		});
		deleditor();
		// 选择合同提交走接口
			$('#J_paymentbutton').on('click',function(){
				receiptList=[];	//回传收据信息
				attInfoList = [];    //回传附件信息
				var auditStep=[];
				var paymentinfolist=[];
				var paymentinfol='';
				$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
					auditStep.push(dataresultdata[$(this).data('index')]);
					var index=$(this).data('index');                          // 回收数量
					var indexyin=$('#yin'+index);              // 回收差异原因
					var indexzhuan=$('#zhuan'+index);          // 转款金额
					var  gapReceipt=dataresultdata[index];
					receiptList.push({
		            	  "receiptId":gapReceipt.receiptId,
		            	  "printCount":gapReceipt.printCount,
		            	  "receiptNumber":gapReceipt.receiptNumber,
		            	  "refundAmount": indexzhuan.val()==undefined?gapReceipt.refundAmount:indexzhuan.val(),
		                  "returnCount": $('#'+index).val()==undefined?gapReceipt.recycleCount:$('#'+index).val(),
		                  "returnDiffReason": indexyin.val()==undefined?gapReceipt.differentReason:indexyin.val()
		              });
				});
				$('#J_list_dataTable .btn_looktype').each(function(){// 附件
					attInfoList.push({
						businessType:result.data.businessType,
						fundCode:auditStep[0].fundCode,
						fundName:auditStep[0].fundName,
						largeType:$(this).data('biggerannexnum'),
						smallType:$(this).data('smallannexnum'),
						pathList:$(this).data('add')
					})
				})
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
				var payFs=$("input[name='isShouweiyj']:checked").val();
				var paymentinfol='';
				$('#J_paymententry_dataTable .btn-payment').each(function(){
					paymentinfol=$(this).data('obj');
					paymentinfol.receiverUserId=$(this).data('id');
					paymentinfolist.push(paymentinfol);
				})
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
				var checkoldDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的新转入合同数据
				var flag = false;
				if(auditStep.length>1){
					var fundname = auditStep[0].fundName;
					var batchid = auditStep[0].batchId;
					var strpayer = auditStep[0].strPayer;
					var strpayee = auditStep[0].strPayee;
					$.each(auditStep,function(i,n){
						if(i>0){
							if(fundname != n.fundName){
								layer.alert('款项不一致,重新选择');
								flag = true;
								return false;
							}
							if(batchid != n.batchId){
								layer.alert('批次号不一致,重新选择');
								flag = true;
								return false;
							}
							if(strpayer != n.strPayer){
								layer.alert('付款方不一致,重新选择');
								flag = true;
								return false;
							}
							if(strpayee != n.strPayee){
								layer.alert('收款单位不一致,重新选择');
								flag = true;
								return false;
							}
						}
						
					})
				}
				if(flag){
					return false;
				}
				jsonPostAjax(
					basePath + '/finance/payment/apply/refundSubmit',
					{
						"contractId":contractId,
						"contractNumber":$('#J_Contract_h').html(),
						"fundCode":auditStep[0].fundCode,
						"isChargeback":chargebackId == null ? 0 : 1,
						"chargebackId":chargebackId,
						"chargebackNumber":chargebackNumber,
						"paidTotalAmount":$('#J_paymentmoeny').html(),
						"paymentType":2,
						"remarks":$('#J_applyadd').val(),
						"attInfoList":attInfoList,
						"receiptList":receiptList,
						"paymentInfoList":payFs==4?paymentinfol:paymentinfolist
					},
					function(result) {
						layer.msg("操作成功");
						$('#J_paymentbutton').attr('disabled',"true");
						var dataappLy = result.data.applyId;
						var paymentType = result.data.paymentType;
						window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+paymentType+'&applyId='+dataappLy;
					}
				)
			})
		});
	}
}

//选择客户方法
var addChargeclientView={
		init:function(){
			var _this=this;
			//初始select下拉框
			$('select').chosen({
				width:'100%'
			});
			
			_this.choiceContract();
			_this.contractList();
			_this.getAddContract();
		},
		//选择客户
		choiceContract:function(){
			var _this=this;
			var isInit=true;
			$('#addclientNum').off().on('click',function(){
				var contractNumsun=$('#addclientNum > div');
				if(contractNumsun.length>1){
					contractNumsun.eq(1).hide();
				}
				commonContainer.modal('选择客户',$('#choicekehu'),function(i){
					$('#J_paymentmoeny').html('0.00');
					_this.getAddContract(i);
					var refundAddDataArr=$("#J_clientList").bootstrapTable('getSelections');	//选中的合同数据
					if(refundAddDataArr.length==0){
						layer.alert("没有选中客户数据，请选择");	
						return false;
					}
				},{
					area:['80%','70%'],
					btns:['确定','取消'],
					overflow :true,
					success:function(){
						if(isInit){
							$('#J_searchclient').off().on('click',_this.contractList);
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
						$('#J_clientQuery')[0].reset();
						$('#J_deptName').attr('data-id','');
						//创建表格表头
						var tabHtml='\
							<table id="J_clientList" class="table table-hover table-striped table-bordered">\
								<thead>\
									<tr>\
										<th data-field="">\
											<div class="th-inner">客户姓名</div>\
										</th>\
										<th data-field="">\
											<div class="th-inner">客户编号</div>\
										</th>\
										<th data-field="">\
											<div class="th-inner">归属人</div>\
										</th>\
										<th data-field="">\
											<div class="th-inner">归属部门</div>\
										</th>\
									</tr>\
								</thead>\
							</table>';
						$('#kehuConten').html(tabHtml);
					}
				});
			});
		},
		//查询客户列表
		contractList:function(){
			$('#J_clientList').bootstrapTable('destroy').bootstrapTable({
				url:basePath+'/finance/choose/paymentClient',
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
					var data=$('#J_clientQuery').serializeObject();
					var deptId=$('#J_deptName').attr('data-id');
					if(deptId!==''){
						data.dept_id=deptId;		//所属部门id
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
						field : 'clinetName',
						title : '客户姓名',
						align : 'center'
					},
					{
						field : 'clientId',
						title : '客户编号',
						align : 'center',
						formatter: function(value, row, index){	
		           			var html='';
		           			var clientId = value ? value : '-';
		           			html='<span class="per">'+clientId+'</span>';
		           			return html;
		           		}
					},
					{
						field : 'belongUserName',
						title : '归属人',
						align : 'center'
					},
					{
						field : 'belongDeptName',
						title : '归属部门',
						align : 'center'
					}
				]
			});
		},
		//获取新增客户详情
		getAddContract:function(i){
			var _this=this;
			var checkrowDataArr=$("#J_clientList").bootstrapTable('getSelections');	//选中的合同数据
			if(checkrowDataArr.length>0 && checkrowDataArr[0].clientId!==undefined){
				layer.close(i);
				//回显新增客户信息
				$('#J_iboxpay').show();
				$('#J_clientId').text(checkrowDataArr[0].clientId);
				$('#J_clientname').text(checkrowDataArr[0].clinetName);
				$('#addclientNumber').val(checkrowDataArr[0].clientId);
				$('#addclientNumber').attr('data-businesstype',checkrowDataArr[0].strBusinessType);
				
				//加载收据列表数据项
				var parmData = jQuery('#J_query').serializeObject();
				parmData.clientId = checkrowDataArr[0].clientId;
				parmData.paymentType = 2;
				jsonPostAjax(basePath+'/finance/payment/apply/getRefundReceiptList',parmData,function(dataresult){
					dataresultdata = dataresult.data;
					$('#J_refunds_dataTable').bootstrapTable('destroy');
					if(dataresultdata.length>0){
						$('#J_refunds_dataTable').bootstrapTable({
							data:dataresultdata,
							columns:[
						        {field: 'flyid',title :'序号',checkbox:true, align: 'center',
					           		formatter: function(value, row, index){	
					           			var html='<input type="hidden" id="J_auditId" name="category" class="cbx"'+
					           			' data-payer="'+row.payer+'" data-strPayer="'+row.strPayer+'"'+
					           			' data-payee="'+row.payee+'" data-strPayee="'+row.strPayee+'"'+
					           			' data-fundCode="'+row.fundCode+'" data-fundName="'+row.fundName+'"'+
					           			' data-receiptId="'+row.receiptId+'" data-receiptNumber="'+row.receiptNumber+'"'+
					           			' data-batchId="'+row.batchId+'" contract="'+row.receiptId+'"'+
					           			' >' ;
					           			return html;
					           		}
					           	},
					           	{field: 'batchId', title: '收款批次号', align: 'center',
					           		formatter: function(value, row, index) {	
					      				var html = '';
					      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
					      				html = '<a class="paymentbatchId" href="'+url+'" target="_blank">'+ row.batchId +'</a>';
					      				return html;
					      	    	}
					      	    },
					      	    {field: 'receiptNumber', title: '收据编号', align: 'center',
					      	    	formatter: function(value, row, index) {	
					      				var html = '';
					      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
					      				html = '<a class="per" href="'+url+'" target="_blank">'+ row.receiptNumber +'</a>';
					      				return html;
					      	    	}
					      	    },
					      	    {field: 'strPayer', title: '付款方', align: 'center',
					      	    	formatter: function(value, row, index){	
					           			var html='';
					           			var strPayer = value ? value : '-';
					           			html='<span class="paymentstrPayer">'+strPayer+'</span>';
					           			return html;
					           		}
					      	    },
					      	    {field: 'strPayee', title : '收款单位', align : 'center'},
					      	    {field: 'fundName', title: '款项', align: 'center',
					      	    	formatter: function(value, row, index){	
					           			var html='';
					           			var fundName = value ? value : '-';
					           			html='<span class="paymentfundName">'+fundName+'</span>';
					           			return html;
					           		}
					      	    },
					      	    {field: 'amount', title: '收据金额', align: 'center',
					      	    	formatter: function(value, row, index){	
					           			var html='';
					           			var amount = value ? value : '-';
					           			html='<span class="per">'+amount+'</span>';
					           			return html;
					           		}
					      	    },
					      	    {field: 'refundAmount', title: '退款金额', align: 'center',
					      	    	formatter: function(value, row, index){	
					           			var html='';
					           			var refundAmount = value ? value : '-';
					           			html='<input type="text" id="zhuan'+index+'" class="form-control input_return zhuankuan" name="" readonly value="" placeholder="0.00">';
					           			return html;
					           		}
					      	    },
					      	    {field: 'invoiceNumbers', title: '发票编号', align: 'center'},
						      	{field: 'printCount', title: '收据打印张数', align: 'center'},
						      	{field: 'recycleCount', title: '收据回收张数', align: 'center',
						      		formatter: function(value, row, index){
						      			if(row.invoiceNumbers){
						      				var html='';
						           			var returnCount = value ? value : '-';
						           			html='<span>'+returnCount+'</span>';
						           			return html;
						      			}else{
						      				var html='';
						           			html='<input type="text" id="'+index+'" class="form-control input_return" name="" readonly value="">';
						           			return html;
						      			}
					           			
					           		}
						      	},
						      	{field: 'differentReason', title: '回收差异原因', align: 'center',
						      		formatter: function(value, row, index){
						      			if(row.invoiceNumbers){
						      				var html='';
						           			var returnDiffReason = value ? value : '-';
						           			html='<span>'+returnDiffReason+'</span>';
						           			return html;
						      			}else{
						      				var html='';
						           			html='<input type="text" id="yin'+index+'" class="form-control input_val" name="" readonly value="">';
						           			return html;
						      			}
					           		}
						      	}
					      	]
						});
					
						var Calculation = '0.00';
						var mun=null;
						var value=null;
						var btSelectItem=$('#J_refunds_dataTable input[name="btSelectItem"]');
						btSelectItem.off().on('click',function(){
							if($(this).is(':checked')){
								$('#'+$(this).data('index')).prop('readonly',false);
								$('#zhuan'+$(this).data('index')).prop('readonly',false);
								$('#yin'+$(this).data('index')).prop('readonly',false);
								if(btSelectItem.length==$('#J_refunds_dataTable input[name="btSelectItem"]:checked').length){
									$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',true);
								}else{
									$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',false);
								}
							}else{
								$('#'+$(this).data('index')).prop('readonly',true);
								$('#zhuan'+$(this).data('index')).prop('readonly',true);
								$('#yin'+$(this).data('index')).prop('readonly',true);
								if($('#zhuan'+$(this).data('index')) != ''){
									mun-=$('#zhuan'+$(this).data('index')).val()*1;
									$('#J_paymentmoeny').html(mun);
									$('#zhuan'+$(this).data('index')).val('');
									$('#yin'+$(this).data('index')).val('');
									$('#'+$(this).data('index')).val('');
								}
							}
						});
						
						//选中行转款金额计算
						$('.zhuankuan').off().on('blur focus',function(e){
							if (/^\d+$/.test(this.value)) {
				                this.value = this.value + '.00';
				            }
							if(e.type=='focus'){
								value=$(this).val()*1;
								mun-=$(this).val()*1;
							}else{
								if(value!==$(this).val()*1){
									mun+=$(this).val()*1;
								}
								$('#J_paymentmoeny').html(mun.toFixed(2));
							}
						});
					}
					attachmentView.init(dataresultdata);
				
				// 付款信息新增
				$('#J_increaseCheck').off().on('click',function(){
					Payeetypeval = $('#J_Payeetype').val();
					var paymentevaluate = $('#J_payment').val();
					//判断是否选中收据信息
					var checklength = $("#J_refunds_dataTable input[name='btSelectItem']:checked").length;
				    if(checklength==0){
						layer.alert("请选择收据信息");
						return false;
					}
				    
				    var isBreak = false;
					var hasWjaj = false;
					$("#J_refunds_dataTable tbody tr").each(function(){
						var dataObj = $(this).find("td:eq(0)").find('input[type=hidden]');
						if(dataObj.attr('data-payee') == "2"
							&& dataObj.attr('data-fundcode') == "1") {
							hasWjaj = true;
							return false;
						}
					});

					$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
						var dataObj = $(this).next('input');
						if(hasWjaj && dataObj.attr('data-payee') == "1") {
							isBreak = true;
							return false;
						}
					})
					
					if(isBreak){
						layer.alert("请优先处理伟嘉安捷佣金退款");
						return false;
					}
					
					// 判断收据单列表所选项收据批次号是否相同
					var stepFlag = false;
					var normalAuditStep = '';
					var strPayerArr=[];
					var strPayeeArr=[];
					var strfundNameArr=[];
					var strfundCodeArr = [];
					$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(index,element){
						var batchId = $(this).parent().find('#J_auditId').attr('data-batchId');
						
						//付款方是否相等
						strPayerArr.push(dataresultdata[$(this).data('index')].strPayer);
						//收款单位是否相等
						strPayeeArr.push(dataresultdata[$(this).data('index')].strPayee);
						//款项是否相等
						strfundNameArr.push(dataresultdata[$(this).data('index')].fundName);
						//款项编号
						strfundCodeArr.push(dataresultdata[$(this).data('index')].fundCode);
						
						if(index==0) normalAuditStep = batchId;
						if(batchId != normalAuditStep){	
							stepFlag = true;
						}
					});
					var isfuk=false;
					var isfukdw=false;
					var isfundName=false;
					//判断付款发是否相等
					for(var i=1;i<strPayerArr.length;i++){
						if(strPayerArr[0]!==strPayerArr[i]){
							isfuk=true;
							break;
						}
					};
					//判断收款单位是否相等
					for(var i=1;i<strPayeeArr.length;i++){
						if(strPayeeArr[0]!==strPayeeArr[i]){
							isfukdw=true;
							break;
						}
					};
					//判断款项是否相等
					for(var i=1;i<strfundNameArr.length;i++){
						if(strfundNameArr[0]!==strfundNameArr[i]){
							isfundName=true;
							break;
						}
					};
					if(isfuk){
						layer.alert("所选项必须是相同付款方，请重新选择");
						return false;
					};
					if(isfukdw){
						layer.alert("所选项必须是相同收款单位，请重新选择");
						return false;
					};
					if(isfundName){
						layer.alert("所选项必须是相同款项，请重新选择");
						return false;
					};
					commonContainer.modal(
							'付款信息新增',
							$('#J_increase'),
							function(index, layero) {
								var payeehtml = '';
								var tuiPOShtml = '';
								var paymentmethod = $('#J_labeliscash').text();
								var paymentfundName = '';
								var paymentpopmoney = $('#J_paymentmoney').val();
								var payzhanghao = ''
								var paymentUserName= '';
								$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
									if(true == $(this).is(':checked')){
										paymentfundName = $(this).parent().parent().find(".paymentfundName").html();
										paymentbatchId =  $(this).parent().parent().find(".paymentbatchId").html();
										paymentstrPayer = $(this).parent().parent().find(".paymentstrPayer").html();
										fundcodenumber = $(this).next().data('fundCode');
									}
								});
								//判断付款方式
								var payFs=$("input[name='isShouweiyj']:checked").val();
								var paymentmethod='';
								var datafundname=$('#formId').serializeObject();
								if(payFs==1){
									datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
									datafundname.fundCode=strfundCodeArr[0];					//付款款项
									datafundname.payType=1										//付款方式 1，现金；2，支票；3，转账；4；退POS（退款使用）5；退款转出（转款使用） ,										
									paymentmethod='现金';
								}else if(payFs==2){
									datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
									datafundname.fundCode=strfundCodeArr[0];					//付款款项
									datafundname.payType=2
									paymentmethod='支票';	
								}else if(payFs==3){
									datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
									datafundname.fundCode=strfundCodeArr[0];					//付款款项
									datafundname.payType=3
									paymentmethod='转账';
								}else if(payFs==4){
									paymentmethod='退POS';
									var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
									if(choustuipos.length>0){
										datafundname=[];
									var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
										$.each(choustuipos,function(i,n){
											var idName='#amount'+getMoney.eq(i).data('index');
											datafundname.push({
												collectionBatchId:choustuipos[i].batchId,	//收款批次号	
												fundCode:strfundCodeArr[0],					//付款款项
												payType:4,
												collectionId:choustuipos[i].collectionId,
												bankAccount:choustuipos[i].payerAccountNo,
												payAmount:$(idName).val()
											});
										});	
									}
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
								var $paymentmoney = $('#J_paymentmoney').val();
								var $accounttypeofAccount=$('#J_accounttypeofAccount').val(); //开户人证件类型
								var $accountnumber=$('#J_accountnumber').val(); //开户人证件号码
								var $Accountholder=$('#J_Accountholder').val(); //开户人
								var $accountType=$('#J_accountType').val();  //账号类型
								var $Openbank=$('#J_Openbank').val();  //开户行
								var $bankName=$('#J_bankName').val();  //银行支行名称
								var $account=$('#J_account').val();  //账号
								if(payFs=="1"){ //现金
									if(Payeetypeval == ''){
										layer.alert('收款人类型不能为空');
										return false;
									}
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
								if(payFs=="2"){ //支票
									if(Payeetypeval == ''){
										layer.alert('收款人类型不能为空');
										return false;
									}
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
								if(payFs=="3"){ // 转账
									if(Payeetypeval == ''){
										layer.alert('收款人类型不能为空');
										return false;
									}
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
										}
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
										}
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
										}
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
										}
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
								if(payFs=="4"){ // 退POS
									var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
									var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
									var idNameval='';
									$.each(choustuipos,function(i,n){
										var idName='#amount'+getMoney.eq(i).data('index');
										idNameval = $(idName).val();
									});
									if(idNameval == ''){
										layer.alert('退POS金额不能为空');
										return false;
									}
								}
								var dataObj=JSON.stringify(datafundname);
								var dataobjval = 'data-obj='+dataObj;
								if(payFs!=4){
									payeehtml='\
										<tr>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentbatchId+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentpopmoney+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+payzhanghao+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentUserName+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-fundCode="'+fundcodenumber+'" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+paymentpopmoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
										</tr>';
									tuikuanSum+=paymentpopmoney*1;
									$('#J_paymententry_dataTable tbody').append(payeehtml);
								}
								editerPayeename=$Payeename;
								editerfinanceCardType =$('#J_financeCardType').val();
								editerDocumentnumber = $('#J_Documentnumber').val();
								$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
								//退pos选中数据返回显示新增数据
								var checkrowDataArr=$('#J_tuipos_dataTable').bootstrapTable('getSelections');	//选中的退POS数据
								var idName='';
								$("#J_tuipos_dataTable input[name='btSelectItem']:checked").each(function(){
									idName='#amount'+$(this).data('index');
								});
								
								if(checkrowDataArr.length>0){
									$.each(checkrowDataArr,function(i,n){
										var idNameMoney = $(idName).val();
										tuiPOShtml+='\
											<tr>\
												<td class="add_create" style="text-align: center; padding:8px;">'+n.batchId+'</td>\
												<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
												<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
												<td class="add_create" style="text-align: center; padding:8px;">'+idNameMoney+'</td>\
												<td class="add_create" style="text-align: center; padding:8px;">'+n.payerAccountNo+'</td>\
												<td class="add_create" style="text-align: center; padding:8px;">'+(n.payerName==undefined?'-':n.payerName)+'</td>\
												<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-fundCode="'+fundcodenumber+'" data-money="'+idNameMoney+'" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+idNameMoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
											</tr>';
										tuikuanSum+=idNameMoney*1;
									})
									$('#J_paymententry_dataTable tbody').append(tuiPOShtml);
									$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
									tuiPOShtml='';
								}
								layer.close(index);
							}, 
							{
								overflow :true,
								area:['800px','400px'],
								btns : ['确定', '取消'],
								success: function() {
									$('#J_isTransfer').prop('checked',true);
									$('#J_iscash').prop('checked',false);
									$('#J_ischeck').prop('checked',false);
									$('#J_tuipos').prop('checked',false);
									$('#isTransfer').show();
									$('#J_paperworcompany').hide();

									$('#J_paymentmoney').off().on('blur',function(e){
										if (/^\d+$/.test(this.value)) {
							                this.value = this.value + '.00';
							            }
									});
									if(flagtype){
										//证件类型
										dimContainer.buildDimChosenSelector($('#J_financeCardType'),'financeCardType','');
										//开户人证件类型
										dimContainer.buildDimChosenSelector($('#J_accounttypeofAccount'),'accounttypeofAccount','');
										//账号类型
										dimContainer.buildDimChosenSelector($('#J_accountType'),'accountType','');
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
									$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
										if(true == $(this).is(':checked')){
											paymentbatchId =  $(this).parent().parent().find(".paymentbatchId").html();
											paymentstrPayer = $(this).parent().parent().find(".paymentstrPayer").html();
											if(paymentstrPayer=='-'){
												paymentstrPayer='';
												return false;
											}
										}
									});
									var optionsbank = [];
									$('#formId').on('onSetSelectValue' , '#J_Openbank',function(e , data){
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
									
									//证件类型
									dimContainer.buildDimChosenSelector($('#J_financeCardType'),'financeCardType','');
									var checkrowDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
									//退POS 加载数据列表J_tuipos_dataTable
									$('#J_tuipos_dataTable').bootstrapTable('destroy').bootstrapTable({
										url:basePath+'/finance/payment/apply/getRefundPosCollectionList',
										method:'get',
										sidePagination:'server',
										dataType:'json',
										pagination: false,
										singleSelect:false,		//设置单选
										clickToSelect:false,		//点击选中行
										striped:true,
										pageSize:10,
										pageList:[10, 20, 50],
										queryParams: function (params) {
											var data=$('#J_query').serializeObject();
											data.collectionBatchId = paymentbatchId;
											
											return data;
										},
										responseHandler: function(result) {
											if (result.code == 0 && result.data){
												return {
													'rows': result.data
												}
											}
											return {
												'rows': []
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
												field : 'batchId',
												title : '收款批次',
												align : 'center'
											},
											{
												field : 'collectionId',
												title : '收款编号',
												align : 'center'
											},
											{
												field : 'paymentTime',
												title : '原刷卡日期',
												align : 'center',
												formatter: function(value, row, index) {	
								      				var html = '';
								      				var paymentTime = row.paymentTime ? row.paymentTime : '-'
								      				html = paymentTime.substring(0,11);
								      				return html;
								      	    	}
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
												title : '<span style="color:#ff0000">*</span>本POS退款金额',
												align : 'center',
												formatter: function(value, row, index){
								      				var html='';
								           			html='<input type="text" data-index="'+index+'" id="amount'+index+'" class="form-control deitor_input" name="" value="">';
								           			return html;
								           			
								           		}
											}
										]
									});
									
								}
							}
						);
					$('#J_isTransfer').prop('checked',true);
					$('#J_isTransfer').on('click',function(){
						$('#iscash').show();
						$('#isTransfer').show();
						$('#J_tuipos').hide();
						$('#J_paperworcompany').hide();
					});
					$('#J_iscash').on('click',function(){
						$('#isTransfer').hide();
						$('#iscash').show();
						$('#J_tuipos').hide();
						$('#J_paperworcompany').hide();
						
					});
					$('#J_ischeck').on('click',function(){
						$('#isTransfer').hide();
						$('#iscash').show();
						$('#J_tuipos').hide();
						$('#J_paperworcompany').hide();
					});
					$('#J_istuiPost').on('click',function(){
						$('#iscash').hide();
						$('#J_tuipos').show();
					});
				});
				deleditor();
				//选择客户提交走接口
				$('#J_paymentbutton').on('click',function(){
					receiptList=[];	//回传收据信息
					var auditStep=[];
					var paymentinfolist=[];
					$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
						auditStep.push(dataresultdata[$(this).data('index')]);
						var index=$(this).data('index');                          // 回收数量
						var indexyin=$('#yin'+index);              // 回收差异原因
						var indexzhuan=$('#zhuan'+index);          // 转款金额
						var  gapReceipt=dataresultdata[index];
						receiptList.push({
			            	  "receiptId":gapReceipt.receiptId,
			            	  "printCount":gapReceipt.printCount,
			            	  "receiptNumber":gapReceipt.receiptNumber,
			            	  "refundAmount": indexzhuan.val()==undefined?gapReceipt.refundAmount:indexzhuan.val(),
			                  "returnCount": $('#'+index).val()==undefined?gapReceipt.recycleCount:$('#'+index).val(),
			                  "returnDiffReason": indexyin.val()==undefined?gapReceipt.differentReason:indexyin.val()
			              });
					});
					$('#J_list_dataTable .btn_looktype').each(function(){// 附件
						attInfoList.push({
							businessType:result.data.businessType,
							fundCode:auditStep[0].fundCode,
							fundName:auditStep[0].fundName,
							largeType:$(this).data('biggerannexnum'),
							smallType:$(this).data('smallannexnum'),
							pathList:$(this).data('add')
						})
					})
					var payFs=$("input[name='isShouweiyj']:checked").val();
					var paymentinfol = '';
					$('#J_paymententry_dataTable .btn-payment').each(function(){
						paymentinfol=$(this).data('obj');
						paymentinfol.receiverUserId=$(this).data('id');
						paymentinfolist.push(paymentinfol);
					})
					
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
					var flag = false;
					if(auditStep.length>1){
						var fundname = auditStep[0].fundName;
						var batchid = auditStep[0].batchId;
						var strpayer = auditStep[0].strPayer;
						var strpayee = auditStep[0].strPayee;
						$.each(auditStep,function(i,n){
							if(i>0){
								if(fundname != n.fundName){
									layer.alert('款项不一致,重新选择');
									flag = true;
									return false;
								}
								if(batchid != n.batchId){
									layer.alert('批次号不一致,重新选择');
									flag = true;
									return false;
								}
								if(strpayer != n.strPayer){
									layer.alert('付款方不一致,重新选择');
									flag = true;
									return false;
								}
								if(strpayee != n.strPayee){
									layer.alert('收款单位不一致,重新选择');
									flag = true;
									return false;
								}
							}
							
						})
					}				
					if(flag){
						return false;
					}
					jsonPostAjax(
						basePath + '/finance/payment/apply/refundSubmit',
						{
							"clientId":$('#J_clientId').html(),
							"contractNumber":$('#J_Contract_h').html(),
							"fundCode":auditStep[0].fundCode,
							"isChargeback":chargebackId == null ? 0 : 1,
							"chargebackId":chargebackId,
							"chargebackNumber":chargebackNumber,
							"paidTotalAmount":$('#J_paymentmoeny').html(),
							"paymentType":2,
							"remarks":$('#J_applyadd').val(),
							"attInfoList":attInfoList,                                       //回传附件信息
							"receiptList":receiptList,                                       //回传就收据信息
							"paymentInfoList":payFs==4?paymentinfol:paymentinfolist
						},
						function(result) {
							layer.msg("操作成功");
							$('#J_paymentbutton').attr('disabled',"true");
							var dataappLy = result.data.applyId;
							var paymentType = result.data.paymentType;
							window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+paymentType+'&applyId='+dataappLy;
						}
					)
				})
			})
		}	
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
					var auditStep=[];
					$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
						auditStep.push(dataresultdata[$(this).data('index')].fundName);
					});
					var businessNum = $('#J_Choosecontract').val();
					if(businessNum == 1){
						$('#J_businessTypesc').text($('#J_typecontract_h').html());
					}else{
						$('#J_businessTypesc').text($('#addclientNumber').data('businesstype'));
					}
					$('#J_Paymenttext').text(auditStep[0]);
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
				<td class="add_create" style="text-align: center; padding:8px;"><a type="looktype" data-remark="'+remarkval+'" data-titlename="'+categoryName+'" '+dataadd+' class="btn btn-outline btn-success btn-xs btn_looktype" data-newstime="'+newstime+'" data-smallannexnum="'+smallannexnum+'" data-biggerannexnum="'+biggerannexnum+'" data-index="'+index+'">预览</a>&nbsp;&nbsp;<a type="del" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
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
			    		$('#J_valremark').html($(_this).data('remark'));
			    		var auditStep=[];
						$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
							auditStep.push(dataresultdata[$(this).data('index')].fundName);
						})
						$('#J_businessPreview').text($('#J_typecontract_h').html());
						$('#J_Paymenttextval').text(auditStep[0]);
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
			var auditStepfundCode=[];
			$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
				auditStepfundCode.push(dataresultdata[$(this).data('index')].fundCode);
			})
			// 初始化附件大类
			commonContainer.initChosen($('#J_attachmentType'));
			var options = [];
		    jsonPostAjax(
				basePath +'/finance/common/getFinanceAttachPrimaryList',
				{
					"businessType":businesstype,
					"fundCode":auditStepfundCode[0]
					
				}, 
				function(result) {
					categoryName = result.data[0].categoryName;
					remarkval = result.data[0].remark;
		    		$.each(result.data, function(n, value) {
		    	    	options.push('<option value="'+value.categoryCode +'，'+ value.categoryName + '">' + value.categoryName + '</option>');
		    	    })
		    	    $('#J_attachmentType').html('<option value="">请选择</option>'+options.join(''));
		    		$('#J_attachmentType').trigger("chosen:updated");
			})
			//根据大类获取附件小类
			var option = [];
			$('#J_attachmentType').on('input change',function(){
				option = [];
    			$('#J_categoryName').html(categoryName);
	    		$('#J_remarktext').html(remarkval);
				var attachtype = $(this).val().split('，')[0];
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
//修改删除详情增加功能
function deleditor(){
	// 付款信息详细展示 删除 修改  点击按钮
	$('#J_paymententry_dataTable').off().delegate(
		'a',
		'click',
		function(event) {
			var $this=this;
			if(this.type=='del'){//删除付款数据
				commonContainer.confirm(
					'是否确认删除信息？',function(index, layero){
						$($this).parent().parent().remove();
						var paymentdelmoney = $($this).data('paymentpopmoney');
						tuikuanSum -=paymentdelmoney*1;
						if(tuikuanSum){
							$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
						}else{
							$('#J_paymentpopmoeny').text('0.00');
						}
						layer.close(index);
					}
				);
				
			}
			if(this.type=='modify'){//修改付款数据
				var paymentevaluate = $('#J_payment').val();
				var tuiPOShtml = '';
				commonContainer.modal(
					'修改付款信息',
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
						}else if(payFs==4){
							paymentmethod='退POS';
						}
						
						var payeehtml = '';
						var paymentmoney = $('#J_paymentmoney').val();
						var payzhanghao = ''
						var paymentUserName= '';
						
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
						if(payFs=="1"){ //现金
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
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
						if(payFs=="2"){ //支票
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
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
						if(payFs=="3"){ // 转账
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
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
						if(payFs=="4"){ // 退POS
							var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
							var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
							var idNameval='';
							$.each(choustuipos,function(i,n){
								var idName='#amount'+getMoney.eq(i).data('index');
								idNameval = $(idName).val();
							});
							if(idNameval == ''){
								layer.alert('退POS金额不能为空');
								return false;
							}
						}
						
						$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
							if(true == $(this).is(':checked')){
								paymentbatchId =  $(this).parent().parent().find(".paymentbatchId").html();
							}
						});
						// 判断收据单列表所选项收据批次号是否相同
						var stepFlag = false;
						var normalAuditStep = '';
						var strPayerArr=[];
						var strPayeeArr=[];
						var strfundNameArr=[];
						var strallArr=[];
						var strfundCodeArr = [];
						$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(index,element){
							var batchId = $(this).parent().find('#J_auditId').attr('data-batchId');
							
							//付款方是否相等
							strPayerArr.push(dataresultdata[$(this).data('index')].strPayer);
							//收款单位是否相等
							strPayeeArr.push(dataresultdata[$(this).data('index')].strPayee);
							//款项是否相等
							strfundNameArr.push(dataresultdata[$(this).data('index')].fundName);
							//款项编号
							strfundCodeArr.push(dataresultdata[$(this).data('index')].fundCode);
							strallArr.push(dataresultdata[$(this).data('index')]);
							if(index==0) normalAuditStep = batchId;
							if(batchId != normalAuditStep){	
								stepFlag = true;
							}
						});
						var isfuk=false;
						var isfukdw=false;
						var isfundName=false;
						//判断付款发是否相等
						for(var i=1;i<strPayerArr.length;i++){
							if(strPayerArr[0]!==strPayerArr[i]){
								isfuk=true;
								break;
							}
						}
						//判断收款单位是否相等
						for(var i=1;i<strPayeeArr.length;i++){
							if(strPayeeArr[0]!==strPayeeArr[i]){
								isfukdw=true;
								break;
							}
						}
						//判断款项是否相等
						for(var i=1;i<strfundNameArr.length;i++){
							if(strfundNameArr[0]!==strfundNameArr[i]){
								isfundName=true;
								break;
							}
						}
						if(isfuk){
							layer.alert("所选项必须是相同付款方，请重新选择");
							return false;
						}
						if(isfukdw){
							layer.alert("所选项必须是相同收款单位，请重新选择");
							return false;
						}
						if(isfundName){
							layer.alert("所选项必须是相同款项，请重新选择");
							return false;
						}
						//判断付款方式
						var payFs=$("input[name='isShouweiyj']:checked").val();
						var paymentmethod='';
						var datafundname=$('#formId').serializeObject();
						if(payFs==1){
							datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
							datafundname.fundCode=strfundCodeArr[0];					//付款款项
							datafundname.payType=1										//付款方式 1，现金；2，支票；3，转账；4；退POS（退款使用）5；退款转出（转款使用） ,										
							paymentmethod='现金';
						}else if(payFs==2){
							datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
							datafundname.fundCode=strfundCodeArr[0];					//付款款项
							datafundname.payType=2
							paymentmethod='支票';	
						}else if(payFs==3){
							datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
							datafundname.fundCode=strfundCodeArr[0];					//付款款项
							datafundname.payType=3
							paymentmethod='转账';
						}else if(payFs==4){
							paymentmethod='退POS';
							var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
							if(choustuipos.length>0){
								datafundname=[];
							var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
								$.each(choustuipos,function(i,n){
									var idName='#amount'+getMoney.eq(i).data('index');
									datafundname.push({
										collectionBatchId:choustuipos[i].batchId,	//收款批次号	
										fundCode:strfundCodeArr[0],					//付款款项
										payType:4,
										collectionId:choustuipos[i].collectionId,
										bankAccount:choustuipos[i].payerAccountNo,
										payAmount:$(idName).val()
									});
								});	
							}
						}
						var dataObj=JSON.stringify(datafundname);
						var dataobjval = 'data-obj='+dataObj;
						if(payFs==1 || payFs==2 || payFs==3){
							payeehtml='\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentbatchId+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentmoney+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+(payzhanghao!=""?payzhanghao:'-')+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentUserName+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+paymentmoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>';
							var oldmoeny = $($this).data('obj').payAmount;
							tuikuanSum +=(-(oldmoeny-paymentmoney));
							$($this).parents('tr').html(payeehtml);
							$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
						}else{
							var checkrowDataArr=$('#J_tuipos_dataTable').bootstrapTable('getSelections');	//选中的退POS数据
							var idName='';
							$("#J_tuipos_dataTable input[name='btSelectItem']:checked").each(function(){
								idName='#amount'+$(this).data('index');
							});
							if(checkrowDataArr.length>0){
								$.each(checkrowDataArr,function(i,n){
									var idNameMoney = $(idName).val();
									tuiPOShtml+='\
										<tr>\
											<td class="add_create" style="text-align: center; padding:8px;">'+n.batchId+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+idNameMoney+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+n.payerAccountNo+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+(n.payerName==undefined?'-':n.payerName)+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-fundCode="'+fundcodenumber+'" data-money="'+idNameMoney+'" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+idNameMoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
										</tr>';
									var oldmoenyTOPS = $($this).data('money');
									tuikuanSum+=(-(oldmoenyTOPS-idNameMoney));
								})
								$('#J_paymententry_dataTable tbody').html(tuiPOShtml);
								$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
							}
						}
						
						layer.close(index);
					}, 
					{
						overflow :true,
						area : ['68%','80%'],
						btns : ['确定', '取消'],
						success: function() {
							var PayTypecheck = $($this).data('obj').payType;
							if(PayTypecheck == "1"){
								$("#J_iscash").prop('checked',true);
								$("#J_ischeck").prop('checked',false);
								$("#J_isTransfer").prop('checked',false);
								$("#J_istuiPost").prop('checked',false);
								$('#isTransfer').hide();
								$('#iscash').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
							}
							if(PayTypecheck == "2"){
								$("#J_iscash").prop('checked',false);
								$("#J_ischeck").prop('checked',true);
								$("#J_isTransfer").prop('checked',false);
								$("#J_istuiPost").prop('checked',false);
								$('#isTransfer').hide();
								$('#iscash').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
							}
							if(PayTypecheck == "3"){
								$("#J_iscash").prop('checked',false);
								$("#J_ischeck").prop('checked',false);
								$("#J_isTransfer").prop('checked',true);
								$("#J_istuiPost").prop('checked',false);
								$('#iscash').show();
								$('#isTransfer').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
							}
							if(PayTypecheck == "4"){
								$("#J_iscash").prop('checked',false);
								$("#J_ischeck").prop('checked',false);
								$("#J_isTransfer").prop('checked',false);
								$("#J_istuiPost").prop('checked',true);
								$('#iscash').hide();
								$('#J_tuipos').show();
							}
							$('#J_paymentmoney').off().on('blur',function(e){
								if (/^\d+$/.test(this.value)) {
					                this.value = this.value + '.00';
					            }
							});
							var editerPayeetype = $($this).data('obj').receiverType;
							var editerDocumentnumber =$($this).data('obj').receiverCardNumber;
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
							
							//判断付款方式
							var checkrowDataArr=$('#J_tuipos_dataTable').bootstrapTable('getSelections');	//选中的退POS数据
							var collectionidNum=checkrowDataArr.collectionId;
							var payFs=$("input[name='isShouweiyj']:checked").val();
							var monerTPOS = $($this).data('money');
							if(payFs == '4'){
								var collectionIdNumber = $($this).data('obj')[0].collectionId;
								//加载修改退POS数据列表J_tuipos_dataTable
								$('#J_tuipos_dataTable').bootstrapTable('destroy').bootstrapTable({
									url:basePath+'/finance/payment/apply/getRefundPosCollectionList',
									method:'get',
									sidePagination:'server',
									dataType:'json',
									pagination: false,
									singleSelect:false,		//设置单选
									clickToSelect:true,		//点击选中行
									striped:true,
									pageSize:10,
									pageList:[10, 20, 50],
									queryParams: function (params) {
										var data=$('#J_query').serializeObject();
										data.collectionBatchId = paymentbatchId;
										return data;
									},
									responseHandler: function(result) {
										if (result.code == 0 && result.data){
											return {
												'rows': result.data
											}
										}
										return {
											'rows': []
										}	
									},
									columns:[
							         	{
							         		field: 'flyid',
									    	title :'选择',
									    	checkbox:true,
									    	align:'center',
									    	formatter: function(value, row, index){
							           			if(collectionIdNumber == row.collectionId){
								           			return {
								           	            disabled : true,
								           	            checked : true
								           	        }
							           			}
							           		}
							         	},
										{
											field : 'batchId',
											title : '收款批次',
											align : 'center'
										},
										{
											field : 'collectionId',
											title : '收款编号',
											align : 'center'
										},
										{
											field : 'paymentTime',
											title : '原刷卡日期',
											align : 'center',
											formatter: function(value, row, index) {	
							      				var html = '';
							      				var paymentTime = row.paymentTime ? row.paymentTime : '-'
							      				html = paymentTime.substring(0,11);
							      				return html;
							      	    	}
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
											title : '<span style="color:#ff0000">*</span>本POS退款金额',
											align : 'center',
											formatter: function(value, row, index){
												var html='';
												if(collectionIdNumber == row.collectionId){
								           			html='<input type="text" data-index="'+index+'" id="amount'+index+'" class="form-control" name="" value="'+monerTPOS+'">';
												}else{
													html='<input type="text" data-index="'+index+'" id="amount'+index+'" class="form-control" name="" value="">';
												}
												return html;
							           			
							           		}
										}
									]
								});
							}
							
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

//获取申请人接口
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

//限制输入两位小数
function clearNoNum(obj){
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