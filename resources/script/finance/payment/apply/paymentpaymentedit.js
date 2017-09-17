var flagtype = true;
var paymentselectval = '';
var paymentselect = '';
var index=0;
var payFs='';
var fundCodeNumber = $('#J_fundName').attr('data-fundCode');
var fundCodeNum='';
var datauesrId='';
var clientName = '';
var ownerName = '';
var tuikuanSum=null;

var contractId=getQueryString("contractNo");
var applyid = getQueryString("applyId");
var chargebackId=getQueryString("chargebackid");
var chargebackNumber=getQueryString("chargebacknumber");
var ischargebackId=getQueryString("isChargebakcid");
var newscontractId = '';
var attlistdata='';
var dataresultObj = '';
var applyIdNumber = '';
var paymentfundCode='';
var resultdatabusinessType='';
var contractid = '';
var invoiceListdataresult = '';
var attInfoList = '';
$(function() {
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	});
	
	//证件类型
	dimContainer.buildDimChosenSelector($('#J_financeCardType'),'paymentCardType','');
	
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	
	//点击取消按钮出发事件
	$('#J_reset').on('click',function(){
		commonContainer.closeWindow();
	})
	
	if(ischargebackId && ischargebackId == 1){
		$('#J_annex').hide();
		$('#J_submit').text('保存');
	}else{
		$('#J_annex').show();
		$('#J_submit').text('提交');
	}
	
	// 根据applyId 获取修改数据以及回显数据
	jsonGetAjax(
		basePath+'/finance/payment/apply/getUpdateApplyInfo',
		{
			applyId:applyid                                                 //付款申请单ID
		},
		function(result){
			$('#J_Contract_h').text(result.data.applyInfo.contractNumber?result.data.applyInfo.contractNumber:'-');
			$('#J_conType_h').text(result.data.applyInfo.strContractType?result.data.applyInfo.strContractType:'-');
			$('#J_conType_h').attr('data-conType', result.data.applyInfo.contractType?result.data.applyInfo.contractType:'');
			$('#J_diaplaynone').text(result.data.applyInfo.businessType?result.data.applyInfo.businessType:'-');
			$('#J_houseId_h').text(result.data.applyInfo.houseId?result.data.applyInfo.houseId:'-');
			$('#J_clientId_h').text(result.data.applyInfo.clientId?result.data.applyInfo.clientId:'-');
			$('#J_ownerName_h').text(result.data.applyInfo.ownerName?result.data.applyInfo.ownerName:'-');
			$('#J_clientName_h').text(result.data.applyInfo.clientName?result.data.applyInfo.clientName:'-');
			$('#J_fundName').text(result.data.applyInfo.fundName?result.data.applyInfo.fundName:'-');
			$('#J_fundName').attr('data-fundCode', result.data.applyInfo.fundCode?result.data.applyInfo.fundCode:'');
			$('#J_applyadd').val(result.data.applyInfo.remarks);                                      
			applyIdNumber = result.data.applyInfo.applyId;                   //获取付款申请Id
			paymentfundCode = result.data.applyInfo.fundCode;                //获取付款款项code
			invoiceListdataresult = result.data.invoiceList;
			ownerName = result.data.applyInfo.ownerName;
			clientName = result.data.applyInfo.clientName;
			
			var contractId = result.data.applyInfo.contractId;
			var receiptList = result.data.receiptList;
			var invoiceList = result.data.invoiceList;
			var paymentList = result.data.paymentInfoList;
			attInfoList = result.data.attList;
			
			// 加载收据信息
			if(receiptList) {
				$('#J_receiptItem').show();
				initReceiptItem(receiptList);
			}
			
			// 加载发票信息
			if(invoiceList) {
				$('#J_invoiceItem').show();
				initInvoiceItem(invoiceList);
			}

			// 加载付款信息
			initPaymentInfo(paymentList);        
			
			// 加载附件信息
			initAttInfo(attInfoList);
			

			attachmentView.init();
		}
	);
	
	function initInvoiceItem(invoiceList) {
		if(invoiceList.length>0){
			$('#J_invoiceTable').bootstrapTable('destroy');
			$('#J_invoiceTable').bootstrapTable({
				data: invoiceList,
				columns:[
					{
						field : 'invoiceCount',
						title : '发票张数',
						align : 'center'
					},
					{
						field : 'strInvoiceDesc',
						title : '发票摘要',
						align : 'center'
					},
					{
						field : 'invoiceAmount',
						title : '发票金额',
						align : 'center'
					}
				]
			});
		}else{
			$('#J_invoiceTable').hide();
		}
	}
	
	function initReceiptItem(receiptList) {
		if(receiptList.length>0){
			$('#J_receiptTable').bootstrapTable('destroy');
			$('#J_receiptTable').bootstrapTable({
				data: receiptList,
				columns:[
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
		}else{
			$('#J_receiptTable').hide();
		}
	}
	
	//加载付款信息列表数据项(公用方法在客户编号与合同编号带出的付款新增列表)
	function initPaymentInfo(dataresultObj){
		if(dataresultObj){
			$('#J_paymententry_dataTable').bootstrapTable('destroy');
			$('#J_paymententry_dataTable').bootstrapTable({
				data:dataresultObj,
				columns:[
					{field: 'payType', title: '付款方式', align: 'center',
						formatter: function(value, row, index) {
		      				return row.strPayType;
						}
					},
					{field: 'fundName', title: '付款款项', align: 'center'},
					{field: 'payAmount', title: '付款金额', align: 'center',
						formatter: function(value, row, index) {
							var html = '';
							html = '<span>'+ row.payAmount +'</span>';
							$('#J_paymentpopmoeny').text(row.payAmount+'元');
		      				return html;
						}
					},
					{field: 'bankAccount', title: '账号', align: 'center'},
					{field: 'isInvoiceStatus', title: '开户人/收款人<br>/收款单位', align: 'center',
						formatter: function(value, row, index) {
		      				var html = '';
		      				var receiverAllName = '';
		      				if(row.payType == '1'){ //现金
		      					receiverAllName = row.receiverName?row.receiverName:'-';
		      				}else if(row.payType == '2'){//支票
		      					receiverAllName = row.receiverUnit?row.receiverUnit:'-';
		      				}else if(row.payType == '3'){//转账
		      					receiverAllName = row.accountHolder?row.accountHolder:'-';
		      				}
		      				html = '<span>'+ receiverAllName +'</span>';
		      				return html;
		      	    	}
					},
					{field: 'opt', title: '操作', align: 'center',
				    	formatter: function(value, row, index) {
				    		var html = '';
				    		$.ajax({
				    			url : basePath + '/finance/payment/getPaymentInfo',
				    			data : {"paymentId":row.paymentId},
				    			type : 'get',
				    			dataType : 'json',
				    			cache : false,
				    			async: false,
				    			success : function(paymententry) {
			    					row.fundCode = paymententry.fundCode;
						    		row.receiverType = paymententry.data.receiverType;
						    		row.receiverCardNumber = paymententry.data.receiverCardNumber;
						    		row.receiverCardType = paymententry.data.receiverCardType;
				    				var addlistname = JSON.stringify(row);
						    		var dataobj='data-obj='+addlistname;
				    				if (paymententry.code == 0) {
				    					html = '<a type="modify" '+dataobj+' class="btn btn-outline btn-success btn-xs btn-payment" data-isjk="1">修改</a>&nbsp;&nbsp;<a type="del" class="btn btn-outline btn-danger btn-xs">删除</a>'		 	
				    				} else {
				    					layer.alert(paymententry.msg);
				    				}
				    			},
				    			error : function(){
				    				layer.alert(errorMsg);
				    			}
				    		});			 
		      				return html;
		      	    	}
				    }
		          ]
			})
		}
	};
	
	//附件信息加载
	function initAttInfo(dataresult){
		if(dataresult){
			$('#J_list_dataTable').bootstrapTable('destroy');
			$('#J_list_dataTable').bootstrapTable({
				data:dataresult,
				columns: [ 	
		           	{field: 'SerialNumber',title :'序号',align: 'center',
		           		formatter: function(value, row, index) {
		      				return index+1;
		      	    	}
		           	},
		            {field: 'largeTypeName', title: '附件大类', align: 'center'},
				    {field: 'smallTypeName', title: '附件小类', align: 'center'},
				    {field: 'createTime', title: '上传日期', align: 'center'},
				    {field: 'opt', title: '操作', align: 'center',
				    	formatter: function(value, row, index) {
				    		var remark = row.remarks?row.remarks.encodeHTML():'';
		    				var fundNameType = row.fundName;
		    				var fundCodeType = row.fundCode;
		    				var businesstypeNameType = row.businessTypeName
				    		var applyAttId = row.attId;
				    		var html = '';
				    		$.ajax({
				    			url : basePath + '/finance/payment/apply/selectPaymentApplyAttPathByAttId',
				    			data : {"attId":applyAttId},
				    			type : 'get',
				    			dataType : 'json',
				    			cache : false,
				    			async: false,
				    			success : function(applyIdresult) {
				    				var largeTypeName = row.largeTypeName;
				    				var smallTypeName = row.smallTypeName;
				    				var largeType = row.largeType;
				    				var smallType = row.smallType;
				    				if(row.largeType == undefined){
				    					largeType ='';
				    				};
				    				if(row.smallType == undefined){
				    					smallType ='';
				    				};
				    				var dataObj=JSON.stringify(applyIdresult.data);
				    				var dataobjval = 'data-add='+dataObj;
				    				if (applyIdresult.code == 0) {
				      					html = '<a onclick="yulanfujian(this)" '+dataobjval+' data-smallTypeName="'+smallTypeName+'" data-largeTypeName="'+largeTypeName+'" data-fundname="'+fundNameType+'" data-fundcode="'+fundCodeType+'" data-businesstypename="'+businesstypeNameType+'" data-attId="'+row.attId+'" data-smallannexnum="'+smallType+'" data-biggerannexnum="'+largeType+'" data-remark="'+remark+'" data-titlename="'+row.largeTypeName+'" data-newstime="'+row.createTime+'" class="btn btn-outline btn-success btn-xs btn_looktype">预览</a>&nbsp;&nbsp;<a onclick="deletefujian(this)" type="del" class="btn btn-outline btn-danger btn-xs">删除</a>'		 	
				    				} else {
				    					layer.alert(applyIdresult.msg);
				    				}
				    			},
				    			error : function(){
				    				layer.alert(errorMsg);
				    			}
				    		});
					    	return html;
		      	    	}
				    }
				]
			})
		}
	}
})

//付款信息新增
var Payeetypeval = '';
$('#J_increaseCheck').off().on('click',function(){
	Payeetypeval = $('#J_Payeetype').val();
/*	//判断是否选中收据信息
	var checklength = $("#J_refunds_dataTable input[name='btSelectItem']:checked").length;
	if(checklength==0){
		layer.alert("请选择收据信息");
		return false;
	}*/
	
	commonContainer.modal(
			'付款信息新增',
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
				fundCodeNum=$('#J_fundName').attr('data-fundCode');	//付款款项类型
				
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
					<tr>\
						<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
						<td class="add_create" style="text-align: center; padding:8px;">'+$('#J_fundName').text()+'</td>\
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
				area:['800px','400px'],
				btns : ['确定', '取消'],
				success: function() {
					$('#isTransfer').show();
					$('#J_paperworcompany').hide();
					$('#J_isTransfer').prop('checked',true);
					$('#J_iscash').prop('checked',false);
					$('#J_ischeck').prop('checked',false);
					//??
					if(flagtype){
						$("select").chosen({
							width : "100%" , no_results_text: "未找到此选项!" 
						});
						//收款人类型
						dimContainer.buildDimChosenSelector($('#J_Payeetype'),'paymentReceiverType','');
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
					$('#J_Payeetype').off().on('input change',function(){
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
								optionsname.push('<option value="' + value + '">' + value + '</option>');
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
								optionsname.push('<option data-id = ' + n + ' value="' + n + '">' + value + '</option>');
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
					$('#formId').on('onSetSelectValue' , '#J_Openbank',function(){
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
				}
			}
		);
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
});
deleditor();
//修改删除详情增加功能
function deleditor(){
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
						
						//判断 如果 付款方式为现金或者支票 账号项为'-'
						if(paymentmethod == '现金' || paymentmethod == '支票'){
							payzhanghao = '-';
						}
						
						if(paymentmethod == '转账'){
							payzhanghao = $('#J_account').val();
						}
						var Payeetypeval = $('#J_Payeetype').val();
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
						dataObj.receiverName.encodeHTML();
						var dataobjval = 'data-obj='+"'"+dataObj+"'";
						payeehtml='\
							<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+$('#J_fundName').text()+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+paymentmoney+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+payzhanghao+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+paymentUserName+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-funcode="'+fundCodeNum+'" data-paytype="'+payFs+'" class="btn btn-outline btn-success btn-xs btn-editor">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+paymentmoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>';
						//$('#J_paymententry_dataTable tbody').html(payeehtml);
						$($this).parents('tr').html(payeehtml);
						layer.close(index);
					}, 
					{
						overflow :true,
						area : ['68%','80%'],
						btns : ['确定', '取消'],
						success: function() {
							var typedata = $($this).data('obj').payType;
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
							var editerPayeetype = '';
							var editerDocumentnumber = '';
							var editerAccountholder = '';
							var editertypeofAccount = '';
							var editeraccountnumber = '';
							var editeraccountType = '';
							var editerOpenbank = '';
							var editerbankName = '';
							var editerbanknumber = '';
							var editeraccount = '';
							var editerpaymentmoney = '';
							var editerprovince = '';
							var editercity = '';
							var receiverUnit = '';
							var editerPayeename = '';
							editerPayeename = $($this).data('obj').receiverName;
								editerPayeetype = $($this).data('obj').receiverType;
								editerDocumentnumber = $($this).data('obj').receiverCardNumber;
								editerAccountholder = $($this).data('obj').accountHolder;
								editertypeofAccount = $($this).data('obj').accountHolderCardType;
								editeraccountnumber = $($this).data('obj').accountHolderCardNumber;
								editeraccountType = $($this).data('obj').bankAccountKind;
								editerOpenbank = $($this).data('obj').Openbank;
								editerbankName = $($this).data('obj').bankBranchId;
								editerbanknumber = $($this).data('obj').banknumber;
								editeraccount = $($this).data('obj').bankAccount;
								editerpaymentmoney = $($this).data('obj').payAmount;
								editerprovince = $($this).data('obj').province;
								editercity = $($this).data('obj').city;
								receiverUnit = $($this).data('obj').receiverUnit;
								editerfinanceCardType = $($this).data('obj').receiverCardType;
								/*<option value="'+editerPayeetype+'">'+editerPayeetype+'</option>*/
								if(editerPayeetype == '客户'){
									editerPayeetype=1;
								}else if(editerPayeetype == '业主'){
									editerPayeetype=2;
								}else if(editerPayeetype == '员工'){
									editerPayeetype=3;
								}else if(editerPayeetype == '其他'){
									editerPayeetype=4;
								}
								$('#J_Payeetype').html('<option value="">请选择</option><option value="'+editerPayeetype+'">客户</option><option value="2">业主</option><option value="3">员工</option><option value="4">其他</option>');
								$('#J_Payeetype').val(editerPayeetype);
								$('#J_Payeetype').trigger("chosen:updated");
								
								$('#J_Payeename').html('<option value="">请选择</option><option>'+editerPayeename+'</option>');
								$('#J_Payeename').val(editerPayeename);
								$('#J_Payeename').trigger("chosen:updated");
								
								if(editerfinanceCardType == '居民身份证'){
									editerfinanceCardType=1;
								}else if(editerfinanceCardType == '军（警）身份证'){
									editerfinanceCardType=2;
								}else if(editerfinanceCardType == '香港居民身份证'){
									editerfinanceCardType=3;
								}else if(editerfinanceCardType == '澳门居民身份证'){
									editerfinanceCardType=4;
								}else if(editerfinanceCardType == '台湾居民身份证'){
									editerfinanceCardType=5;
								}else if(editerfinanceCardType == '护照'){
									editerfinanceCardType=6;
								}else if(editerfinanceCardType == '来往大陆通行证'){
									editerfinanceCardType=7;
								}else if(editerfinanceCardType == '军官证'){
									editerfinanceCardType=8;
								}else if(editerfinanceCardType == '营业执照号'){
									editerfinanceCardType=9;
								}
								
								if(editertypeofAccount == 1){
									editertypeofAccount="居民身份证";
								}else if(editertypeofAccount == 2){
									editertypeofAccount='军（警）身份证';
								}else if(editertypeofAccount == 3){
									editertypeofAccount='香港居民身份证';
								}else if(editertypeofAccount ==  4){
									editertypeofAccount='澳门居民身份证';
								}else if(editertypeofAccount == 5){
									editertypeofAccount='台湾居民身份证';
								}else if(editertypeofAccount == 6){
									editertypeofAccount='护照';
								}else if(editertypeofAccount == 7){
									editertypeofAccount='来往大陆通行证';
								}else if(editertypeofAccount == 8){
									editertypeofAccount='军官证';
								}else if(editertypeofAccount == 9){
									editertypeofAccount='营业执照号';
								}
								
								$('#J_financeCardType').val(editerfinanceCardType);
								$('#J_financeCardType').trigger("chosen:updated");
								$('#J_Documentnumber').val(editerDocumentnumber);
								$('#J_paymentmoney').val(editerpaymentmoney);
								
								$('#J_Accountholder').val(editerAccountholder);
								if(typedata != '3'){
									$('#J_accounttypeofAccount').val(editertypeofAccount);
									$('#J_accounttypeofAccount').trigger("chosen:updated");
									//开户人证件类型
									dimContainer.buildDimChosenSelector($('#J_accounttypeofAccount'),'paymentCardType','');
									//账号类型
									dimContainer.buildDimChosenSelector($('#J_accountType'),'bankAccountType','');	
								}else{
									$('#J_accounttypeofAccount').html('<option value="">请选择</option><option value="'+editertypeofAccount+'">'+editertypeofAccount+'</option>');
									$('#J_accounttypeofAccount').val(editertypeofAccount);
									$('#J_accounttypeofAccount').trigger("chosen:updated");
									
									$('#J_accountType').html('<option value="">请选择</option><option value="'+editeraccountType+'">'+editeraccountType+'</option>');
									$('#J_accountType').val(editeraccountType);
									$('#J_accountType').trigger("chosen:updated");
									$('#J_accountnumber').val(editeraccountnumber);
									$('#J_Openbank').val(editerOpenbank);
									
									$('#J_bankName').html('<option value="">请选择</option><option value="'+editerbankName+'">'+editerbankName+'</option>');
									$('#J_bankName').val(editerbankName);
									$('#J_bankName').trigger("chosen:updated");
									$('#J_province').val(editerprovince);
									$('#J_city').val(editercity);
									$('#J_banknumber').val(editerbanknumber);
									$('#J_account').val(editeraccount);
									$('#J_receiverUnit').val(receiverUnit);
								}
								//开户行自动补全查询
								Openbank($("#J_Openbank"), true, 'left');
							
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
							//??
							var optionsbank = [];
							$('#formId').on('onSetSelectValue' , '#J_Openbank',function(){
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
						}
					}
				);
			}
		}
	);
}

//点击预览按钮预览附件
function yulanfujian($_this){
	commonContainer.modal('查看附件',$('#J_attachmentCon'),function(i){
		layer.close(i);
		$('#J_upFileName').html('');
	},{
		btns:['关闭'],
		area:['800px','400px'],
		overflow :true,
		success:function(){
			$('#J_upFileName').html('');
			var attId = $($_this).data('attid');
			var dataobj = $($_this).data('add');
			var remarks = $($_this).data('remark');
			var largeTypeName = $($_this).data('largetypename');
			var smallTypeName = $($_this).data('smalltypename');
			var fundName = $($_this).data('fundname');
			var businessTypeName = $($_this).data('businesstypename');
			$('#J_businesstype').text(businessTypeName);
			$('#J_Paymenttextval').html(fundName);
			$('#J_bigger').html(largeTypeName);
			$('#J_small').html(smallTypeName);
			$('#J_titleName').html(largeTypeName);
			$('#J_valremark').html(remarks);
			
			var htmlnews='';
			jsonGetAjax(
				basePath + '/finance/payment/apply/selectPaymentApplyAttPathByAttId',{
					"attId":attId,
				},function(dataresult){
					$.each(dataresult.data, function(pathIndex, pathInfo){
						 htmlnews+='\
			    			<div class="col-md-3" style="padding-top:18px;text-align: center;">\
			    				<img src="'+pathInfo.path+'" width="80%" height="100">\
			    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+pathInfo.title+'</div>\
			    				<button type="button" data-opt="del" class="btn btn-outline btn-success btn-xs mt-3" onclick="download(\''+pathInfo.path+'\')">下载</button>\
		    				</div>';
					})
					$('#J_upFileName').append(htmlnews);
				}
			);
		}
			
		}
	)
}

//删除附件数据
function deletefujian(_this){
	var trlength = $('#J_list_dataTable tbody').find('tr').length;
	if(trlength>0){
		commonContainer.confirm(
			'是否确认删除信息？',function(index, layero){
				$(_this).parent().parent().remove();
				layer.close(index);
			}
		);
	}
}

$('#J_iscash').prop('checked',true);
$('#J_iscash').on('click',function(){
	$('#isTransfer').hide();
	$('#iscash').show();
	$('#J_paperworcompany').hide();
});
$('#J_ischeck').on('click',function(){
	$('#isTransfer').hide();
	$('#iscash').show();
	$('#J_paperworcompany').show();
});
$('#J_isTransfer').on('click',function(){
	$('#iscash').show();
	$('#isTransfer').show();
	$('#J_paperworcompany').hide();
});



//上传文件方法
var attachmentView={
	initFalg:true,
	chargebackId:location.search.split('&')[0].split('=')[1],
	init:function(dataresultdata){
		var _this=this;
		//选择文件
		$('#J_addAttInfo').off().on('click',function(){
			// 获取款项信息
			var fundCode = $('#J_fundName').attr('data-fundCode');
			var fundName = $('#J_fundName').text();
			
			commonContainer.modal(
				'上传附件',
				$('#attachmentCon'),
				function(i){
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
					
					$('#J_businessType').text($('#J_conType_h').html());
					$('#J_Paymenttext').text(fundName);
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
				<td class="add_create" style="text-align: center; padding:8px;"><a type="looktype" '+dataadd+' class="btn btn-outline btn-success btn-xs btn_looktype" data-newstime="'+newstime+'" data-smallannexnum="'+smallannexnum+'" data-biggerannexnum="'+biggerannexnum+'" data-index="'+index+'">预览</a>&nbsp;&nbsp;<a type="del" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
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
						$('#J_businesstype').text($('#J_conType_h').html());
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
					$(this).parent().parent().remove();
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
		var categoryItem = [];
		
		// 获取附件大类
		var contractType = $('#J_conType_h').attr('data-conType');
		commonContainer.initChosen($('#J_attachmentType'));
	    jsonPostAjax(
			basePath +'/finance/common/getFinanceAttachPrimaryList',
			{
				"businessType":contractType,
				"fundCode":$('#J_fundName').attr('data-fundCode')
			}, 
			function(result) {
				var options = [];
	    		$.each(result.data, function(n, value) {
	    			categoryItem[value.categoryCode] = value;
	    	    	options.push('<option value="'+value.categoryCode +'，'+ value.categoryName + '">' + value.categoryName + '</option>');
	    	    })
	    	    $('#J_attachmentType').html('<option value="">请选择</option>'+options.join(''));
	    		$('#J_attachmentType').trigger("chosen:updated");
		});
		    
	    //根据大类获取附件小类
		$('#J_attachmentType').on('input change',function(){
			var option = [];
			var categoryType = $(this).val().split('，')[0];
    		if(categoryType !=''){
    			
    			$('#J_categoryName').html(categoryItem[categoryType].categoryName);
	    		$('#J_remarktext').html(categoryItem[categoryType].remark);
    			
    			jsonGetAjax(
					basePath +'/finance/common/getFinanceAttachSecondaryList',
					{
						"categoryCode":categoryType
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

//提交保存付款申请录入走审批
$('#J_submit').on('click',function(){
	var clickToSelect = $('#J_deposittable_dataTable').bootstrapTable('getSelections');
	var paymentmoney = $('#J_paymentmoney').val();
	var in_receiptId = [];
	var amountmoney='';
	var attInfoList = [];
	var paymentinfolist=[];
	
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
	$('#J_paymententry_dataTable .btn-payment').each(function(){
		var paymentinfol=$(this).data('obj');
		paymentinfol.payType=$(this).data('paytype');
		paymentinfol.fundCode=$(this).data('funcode');
		paymentinfol.receiverUserId=$(this).data('id');
		paymentinfolist.push(paymentinfol);
	})
	//附件信息
	$('#J_list_dataTable .btn_looktype').each(function(){
		attInfoList.push({
			businessType:resultdatabusinessType,
			fundCode:$('#J_fundName').attr('data-fundCode'),
			fundName:paymentselect,
			attId:$(this).data('attid'),
			largeType:$(this).data('biggerannexnum'),
			smallType:$(this).data('smallannexnum'),
			pathList:$(this).data('add')
		})
	})
	var  fundCode=$('#J_fundName').attr('data-fundCode');	//付款款项类型
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
		basePath + '/finance/payment/apply/updateApplyInfo',
		{	
			"applyId":applyid,
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
			var dataappLy = result.data.applyId;
			var paymentType = result.data.paymentType;
			window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+paymentType+'&applyId='+dataappLy;
		}
	);
})


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