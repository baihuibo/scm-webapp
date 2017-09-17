var typetaskId = getQueryString('taskId');
var fromidval = '';
var isEndVal = getQueryString('isEnd');
var isKF = getQueryString('isKF');
var t=getQueryString("t");
var contractId = '';
var contractNumber = '';
var fundNameType = '';
var strAuditStatus = '';
var applyIdNum = '';
if (t) {//
	$('#J_btn_button').hide();
	$('#J_servicedataTable tbody tr td a').hide();
	$('#J_auditrecordcontent').prop('disabled',true);
	$('#J_btnEntry').prop('disabled',true);
	jsonGetAjax(
		basePath + '/finance/payment/approve/getCommentByTaskId',
		{	
			"taskId":typetaskId							
		},
		function(resultdata) {
			if(resultdata.data.taskComment){
				$('#J_auditrecordcontent').text(resultdata.data.taskComment.split(']')[1]);
			}
		}
	)
}

$('#J_shenpiliucheng').on('click',function(){
	shenpilchen();
})

$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});	
	//判断页面加载时显示是否是客服审批
	
	if(isKF=='1'){
		$('#customer_box').show();
	}else{
		$('#customer_box').hide();
	};
	//初始根据taskId获取单据编号
	jsonPostAjax(
		basePath + '/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=getParamsByTaskId',
		{	
			"taskId":typetaskId							
		},
		function(dataresult) {
			fromidval = dataresult.data.formId;
			var detailpaymentType=dataresult.data.paymentType;
			var isposble = dataresult.data.isResponsible;
			if(isposble == "1"){
				$('#inlineRadio').prop('checked',true);
				$('#reason').show();
				trace(fromidval);
			}else{
				$('#inlineRadio1').prop('checked',true);
				$('#reason').hide();
			}
			var datailtitle='';
			if(detailpaymentType=='1'){
				datailtitle='付款申请单详情';
				$('#J_zhuankuan').hide();
				$('#J_tuikuan').hide();
				$('#J_fukuan').show();
				//付款申请单详细信息加载
				jsonGetAjax(
					basePath+'/finance/payment/apply/selectPaymentApplyById',
					{
						applyId:fromidval                                                 //付款申请单ID
					},
					function(result){
						$('#J_applynum').html(result.data.financePaymentApplyVo.applyNumber?result.data.financePaymentApplyVo.applyNumber:'-');
						$('#J_hetongnum').html(result.data.financePaymentApplyVo.contractNumber?result.data.financePaymentApplyVo.contractNumber:'-');
						$('#J_houseId').html(result.data.financePaymentApplyVo.houseId?result.data.financePaymentApplyVo.houseId:'-');
						$('#J_yezhuname').html(result.data.financePaymentApplyVo.ownerName?result.data.financePaymentApplyVo.ownerName:'-');
						$('#J_clientId').html(result.data.financePaymentApplyVo.clientId?result.data.financePaymentApplyVo.clientId:'-');
						$('#J_clientName').html(result.data.financePaymentApplyVo.clientName?result.data.financePaymentApplyVo.clientName:'-');
						$('#J_fundName').html(result.data.financePaymentApplyVo.fundName?result.data.financePaymentApplyVo.fundName:'-');
						$('#J_paidTotalAmount').html(result.data.financePaymentApplyVo.paidTotalAmount?result.data.financePaymentApplyVo.paidTotalAmount:'-');
						$('#J_paidTotaltime').html(result.data.financePaymentApplyVo.paidTime?result.data.financePaymentApplyVo.paidTime:'-');
						$('#J_strAuditStatus').html(result.data.financePaymentApplyVo.strAuditStatus?result.data.financePaymentApplyVo.strAuditStatus:'-');
						$('#J_strPaidStatus').html(result.data.financePaymentApplyVo.strPaidStatus?result.data.financePaymentApplyVo.strPaidStatus:'-');
						$('#J_paidFinishTime').html(result.data.financePaymentApplyVo.paidFinishTime?result.data.financePaymentApplyVo.paidFinishTime:'-');
						contractId = result.data.financePaymentApplyVo.contractId;
						contractNumber = result.data.financePaymentApplyVo.contractNumber;
					    fundNameType = result.data.financePaymentApplyVo.fundCode;
					    AuditStatus=result.data.financePaymentApplyVo.auditStatus;
					    applyIdNum = result.data.financePaymentApplyVo.chargebackId;
						if(fundNameType == '13'){
							$('#lishiK').hide();
							$('#J_jiange').hide();
						}else{
							$('#lishiK').show();
							$('#J_jiange').show();
						};
						if(fundNameType == '11'){
							$('#J_receiptbox').hide();
						}else{
							$('#J_receiptbox').show();
						}
						
						//回显付款原因信息
						$('#J_remarks').html(result.data.financePaymentApplyVo.remarks);
						/*
						 *strAuditStatus： 审核状态：1，付款申请中；2，付款申请不通过；3，待财务审批；4，财务审批通过；5，财务审批不通过 ；6，付款申请退回
						 */
						strAuditStatus = result.data.financePaymentApplyVo.auditStatus;
						
						if(strAuditStatus =='2' && $('#J_fukuanbtnpass').length>0){
							$('#J_btnbutton_none').show();
							$('#J_fukuanbtnpass').on('click',function(){
								window.open(basePath + '/finance/payment/apply/payment/applyedit.htm?applyId='+applyid);
							})
						}else if(strAuditStatus =='5' && $('#J_fukuanbtnpass').length>0){// SCM:FINANCE:PAYMENT:APPLY:UNPASS:EDIT
							$('#J_btnbutton_none').show();
							$('#J_fukuanbtnpass').on('click',function(){
								window.open(basePath + '/finance/payment/apply/payment/applyedit.htm?applyId='+applyid);
							})
						}else if(strAuditStatus =='6' && $('#J_fukuanbtnpass').length>0){ //SCM:FINANCE:PAYMENT:APPLY:RETURN:EDIT
							$('#J_btnbutton_none').show();
							$('#J_fukuanbtnpass').on('click',function(){
								window.open(basePath + '/finance/payment/apply/payment/paymentedit.htm?applyId='+applyid);
							})
						}else{
							$('#J_btnbutton_none').hide();
						}
				
						//加载付款信息
						if(typeof(result.data.paymentList)!="undefined"){
							$('#J_dataTable').bootstrapTable('destroy');
							$('#J_dataTable').bootstrapTable({
								data:result.data.paymentList,
								columns: [ 	
						           	{field: 'strPayType',title :'付款方式',align: 'center'},
						            {field: 'fundName', title: '付款款项', align: 'center'},
								    {field: 'payAmount', title: '付款金额', align: 'center'},
								    {field: 'bankAccount', title: '账号', align: 'center'},
								    {field: 'accountHolder', title: '开户人/收款人<br>/收款单位', align: 'center',
								    	formatter: function(value, row, index) {
						      				var html = '';
						      				var receiverAllName = '';
						      				if(row.payType == '1'){ //现金
						      					receiverAllName = row.receiverName?row.receiverName:'-';
						      				}else if(row.payType == '2'){//支票
						      					receiverAllName = row.receiverName?row.receiverName:'-';
						      				}else if(row.payType == '3'){//转账
						      					receiverAllName = row.accountHolder?row.accountHolder:'-';
						      				}else if(row.payType == '4'){//退POS
						      					receiverAllName = row.receiverName?row.receiverName:'-';
						      				}
						      				html = '<span>'+ receiverAllName +'</span>';
						      				return html;
						      	    	}
								    },
								    {field: 'paymentNumber', title: '付款单编号', align: 'center'},
								    {field: 'strPayStatus', title: '付款状态', align: 'center'},
								    {field: 'realPayTime', title: '实付日期', align: 'center'},
								    {field: 'realPayAmount', title: '实付金额', align: 'center'},
								    {field: 'opt', title: '操作', align: 'center',
								    	formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/payment/detail.htm?paymentId="+row.paymentId;
						      					html = '<a href="'+url+'" target="_blank">详情</a>'
						      				return html;
						      	    	}
								    }
								]
							});
						};
						
						//加载代收收据信息
						if(fundNameType != '11'){
							if(typeof(result.data.paymentApplyReceiptList)!="undefined"){
								$('#J_receiptdataTable').bootstrapTable('destroy');
								$('#J_receiptdataTable').bootstrapTable({
									data:result.data.paymentApplyReceiptList,
									columns: [ 	
							           	{field: 'batchId',title :'收款批次号',align: 'center',
							           		formatter: function(value, row, index) {	
							      				var html = '';
							      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
							      				html = '<a href="'+url+'" target="_blank">'+ row.batchId +'</a>';
							      				return html;
							      	    	}
							           	},
							            {field: 'receiptNumber', title: '收据编号', align: 'center',
							           		formatter: function(value, row, index) {	
							      				var html = '';
							      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
							      				html = '<a href="'+url+'" target="_blank">'+ row.receiptNumber +'</a>';
							      				return html;
							      	    	}
							            },
									    {field: 'strPayer', title: '付款方', align: 'center'},
									    {field: 'strPayee', title: '收款单位', align: 'center'},
									    {field: 'fundName', title: '款项', align: 'center'},
									    {field: 'amount', title: '收据金额', align: 'center'}
									]
								})
							}
						};
						//加载发票信息
						if(typeof(result.data.paymentApplyOtherList)!="undefined"){
							$('#J_invoicedataTable').bootstrapTable('destroy');
							$('#J_invoicedataTable').bootstrapTable({
								data:result.data.paymentApplyOtherList,
								columns: [ 	
						           	{field: 'invoiceCount',title :'发票张数',align: 'center'},
						            {field: 'strInvoiceDesc', title: '发票摘要', align: 'center'},
								    {field: 'invoiceAmount', title: '发票金额', align: 'center'}
								]
							})
						}
						//加载附件列表
						if(typeof(result.data.paymentApplyAttList)!="undefined"){
							$('#attachmentList').bootstrapTable('destroy');
							$('#attachmentList').bootstrapTable({
								data:result.data.paymentApplyAttList,
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
								    		row.remarks = (row.remarks==''||row.remarks==undefined)?row.remarks:row.remarks.encodeHTML();
								    		var dataval = JSON.stringify(row);
								    		//dataval=dataval.replace(/<br>/g,'').replace(' ','');
								    		var dataobj='data-obj="'+dataval.encodeHTML() + '"';
						      				var html = '';
						      					html = '<a onclick="yulanfujian(this)" '+dataobj+' class="btn btn-outline btn-success btn-xs">预览</a>'		 
						      				return html;
						      	    	}
								    }
								]
							})
						}				
					}
				);	
			}else if(detailpaymentType=='2'){
				datailtitle='退款申请单详情';
				$('#J_fukuan').hide();
				$('#J_zhuankuan').hide();
				$('#J_tuikuan').show();
				//退款详细信息加载
				jsonGetAjax(
					basePath+'/finance/payment/apply/selectPaymentApplyById',
					{
						applyId:fromidval                                                 //付款申请单ID
					},
					function(result){
						$('#J_applynum1').html(result.data.financePaymentApplyVo.applyNumber?result.data.financePaymentApplyVo.applyNumber:'-');
						$('#J_hetongnum1').html(result.data.financePaymentApplyVo.contractNumber?result.data.financePaymentApplyVo.contractNumber:'-');
						$('#J_houseId1').html(result.data.financePaymentApplyVo.houseId?result.data.financePaymentApplyVo.houseId:'-');
						$('#J_yezhuname1').html(result.data.financePaymentApplyVo.ownerName?result.data.financePaymentApplyVo.ownerName:'-');
						$('#J_clientId1').html(result.data.financePaymentApplyVo.clientId?result.data.financePaymentApplyVo.clientId:'-');
						$('#J_clientName1').html(result.data.financePaymentApplyVo.clientName?result.data.financePaymentApplyVo.clientName:'-');
						$('#J_fundName1').html(result.data.financePaymentApplyVo.fundName?result.data.financePaymentApplyVo.fundName:'-');
						$('#J_paidTotalAmount1').html(result.data.financePaymentApplyVo.paidTotalAmount?result.data.financePaymentApplyVo.paidTotalAmount:'-');
						$('#J_paidTotaltime1').html(result.data.financePaymentApplyVo.paidTime?result.data.financePaymentApplyVo.paidTime:'-');
						$('#J_strAuditStatus1').html(result.data.financePaymentApplyVo.strAuditStatus?result.data.financePaymentApplyVo.strAuditStatus:'-');
						$('#J_strPaidStatus1').html(result.data.financePaymentApplyVo.strPaidStatus?result.data.financePaymentApplyVo.strPaidStatus:'-');
						$('#J_paidFinishTime1').html(result.data.financePaymentApplyVo.paidFinishTime?result.data.financePaymentApplyVo.paidFinishTime:'-');
						//回显付款原因信息
						$('#J_tuikuanremarks').html(result.data.financePaymentApplyVo.remarks);
						applyIdNum = result.data.financePaymentApplyVo.chargebackId;
						/*
						 *strAuditStatus： 审核状态：1，付款申请中；2，付款申请不通过；3，待财务审批；4，财务审批通过；5，财务审批不通过 ；6，付款申请退回
						 */
						AuditStatus=result.data.financePaymentApplyVo.auditStatus;
						fundNameType = result.data.financePaymentApplyVo.fundCode;
						if(fundNameType == '13'){
							$('#lishiK').hide();
							$('#J_jiange').hide();
						}else{
							$('#lishiK').show();
							$('#J_jiange').show();
						};
						if(fundNameType == '11'){
							$('#J_receiptbox').hide();
						}else{
							$('#J_receiptbox').show();
						}
						if(AuditStatus =='2' && $('#J_tuikuanbtnpass').length>0){
							$('#J_btnbutton_nonetwo').show();
							$('#J_tuikuanbtnpass').on('click',function(){
								window.open(basePath+"/finance/payment/apply/refund/applyedit.htm?applyId="+applyid);
							})
						}else if(AuditStatus =='5' && $('#J_tuikuanbtnpass').length>0){
							$('#J_btnbutton_nonetwo').show();
							$('#J_tuikuanbtnpass').on('click',function(){
								window.open(basePath+"/finance/payment/apply/refund/applyedit.htm?applyId="+applyid);
							})
						}else if(AuditStatus =='6' && $('#J_tuikuanbtnpass').length>0){
							$('#J_btnbutton_nonetwo').show();
							$('#J_tuikuanbtnpass').on('click',function(){
								window.open(basePath+"/finance/payment/apply/refund/paymentedit.htm?applyId="+applyid);
							})
							
						}
						
						//加载退款收据信息
						if(typeof(result.data.paymentApplyReceiptList)!="undefined"){
							$('#J_tuik_dataTable').bootstrapTable('destroy');
							$('#J_tuik_dataTable').bootstrapTable({
								data:result.data.paymentApplyReceiptList,
								columns: [ 	
						           	{field: 'batchId',title :'收款批次号',align: 'center',
						           		formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
						      				html = '<a href="'+url+'" target="_blank">'+ row.batchId +'</a>';
						      				return html;
						      	    	}
						           	},
						            {field: 'receiptNumber', title: '收据编号', align: 'center',
						           		formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
						      				html = '<a href="'+url+'" target="_blank">'+ row.receiptNumber +'</a>';
						      				return html;
						      	    	}
						            },
								    {field: 'strPayer', title: '付款方', align: 'center'},
								    {field: 'strPayee', title: '收款单位', align: 'center'},
								    {field: 'fundName', title: '款项', align: 'center'},
								    {field: 'amount', title: '收据金额', align: 'center'},
								    {field: 'refundAmount',title :'退款金额',align: 'center'},
						            /*{field: 'invoiceNumbers', title: '发票编号', align: 'center'},*/
								    {field: 'printCount', title: '收据打印张数', align: 'center'},
								    {field: 'recycleCount', title: '收据回收张数', align: 'center'},
								    {field: 'differentReason', title: '回收差异原因', align: 'center'},
								    {field: 'strRecycleStatus', title: '收据回收状态', align: 'center'},
								    /*{field: 'isInvoiceStatus', title: '发票状态', align: 'center'}*/
								]
							})				
						}
						//加载付款信息
						if(typeof(result.data.paymentList)!="undefined"){
							$('#J_tuikdataTable').bootstrapTable('destroy');
							$('#J_tuikdataTable').bootstrapTable({
								data:result.data.paymentList,
								columns: [ 	
						           	{field: 'collectionBatchId',title :'收款批次号',align: 'center',
						           		formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.collectionBatchId;
						      				html = '<a href="'+url+'" target="_blank">'+ row.collectionBatchId +'</a>';
						      				return html;
						      	    	}
						           	},
						            {field: 'strPayType', title: '付款方式', align: 'center'},
								    {field: 'fundName', title: '付款款项', align: 'center'},
								    {field: 'payAmount', title: '付款金额', align: 'center'},
								    {field: 'bankAccount', title: '账号', align: 'center'},
								    {field: 'accountHolder', title: '开户人/收款人<br>/收款单位', align: 'center',
								    	formatter: function(value, row, index) {
						      				var html = '';
						      				var receiverAllName = '';
						      				if(row.payType == '1'){ //现金
						      					receiverAllName = row.receiverName?row.receiverName:'-';
						      				}else if(row.payType == '2'){//支票
						      					receiverAllName = row.receiverName?row.receiverName:'-';
						      				}else if(row.payType == '3'){//转账
						      					receiverAllName = row.accountHolder?row.accountHolder:'-';
						      				}else if(row.payType == '4'){//退POS
						      					receiverAllName = row.receiverName?row.receiverName:'-';
						      				}
						      				html = '<span>'+ receiverAllName +'</span>';
						      				return html;
						      	    	}
								    },
								    {field: 'paymentNumber', title: '付款单编号', align: 'center'},
								    {field: 'strPayStatus', title: '付款状态', align: 'center'},
								    {field: 'realPayTime', title: '实付日期', align: 'center'},
								    {field: 'realPayAmount', title: '实付金额', align: 'center'},
								    {field: 'opt', title: '操作', align: 'center',
								    	formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/payment/detail.htm?paymentId="+row.paymentId;
						      					html = '<a href="'+url+'" target="_blank">详情</a>'
						      				return html;
						      	    	}
								    }
								]
							})
						}
						//加载差额新收据
						if(typeof(result.data.gapPaymentApplyReceiptList)!="undefined"){
							$('#J_tuik_chae_dataTable').bootstrapTable('destroy');
							$('#J_tuik_chae_dataTable').bootstrapTable({
								data:result.data.gapPaymentApplyReceiptList,
								columns: [ 	
						           	{field: 'receiptNumber',title :'新收据编号',align: 'center'},
						            {field: 'createTime', title: '生成时间', align: 'center'},
								    {field: 'batchId', title: '收款批次号', align: 'center',
						            	formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
						      				html = '<a href="'+url+'" target="_blank">'+ row.batchId +'</a>';
						      				return html;
						      	    	}
								    },
								    {field: 'parentReceiptNumber', title: '原收据编号', align: 'center',
								    	formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.parentReceiptId;
						      				html = '<a href="'+url+'" target="_blank">'+ row.parentReceiptNumber +'</a>';
						      				return html;
						      	    	}
								    },
								    {field: 'invoiceNumbers', title: '发票编号', align: 'center'},
								    {field: 'strPayer', title: '付款方', align: 'center'},
								    {field: 'strPayee',title :'收款单位',align: 'center'},
						            {field: 'fundName', title: '款项', align: 'center'},
								    {field: 'amount', title: '收据金额', align: 'center'},
								    {field: 'isInvoiceStatus', title: '开票状态', align: 'center'},
								    {field: 'printStatus', title: '打印状态', align: 'center'},
								    {field: 'opt', title: '操作', align: 'center',
								    	formatter: function(value, row, index) {	
						      				var html = '';
						      				var objId = 'J_tuik_chae_dataTable';
						      				var receiptId = row.receiptId;
						      				var receiptNumber = row.receiptNumber;
						      					html = '<a onclick="receipttaTableprint('+objId+','+receiptId+','+"'"+receiptNumber+"'"+')" type="">打印</a>'
						      				return html;
						      	    	}
								    }
								]
							})
						}
						//加载退款附件列表
						if(typeof(result.data.paymentApplyAttList)!="undefined"){
							$('#tuikuanattachmentList').bootstrapTable('destroy');
							$('#tuikuanattachmentList').bootstrapTable({
								data:result.data.paymentApplyAttList,
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
								    		row.remarks = (row.remarks==''||row.remarks==undefined)?row.remarks:row.remarks.encodeHTML();
								    		var dataval = JSON.stringify(row);
								    		//dataval=dataval.replace(/<br>/g,'').replace(' ','');
								    		var dataobj='data-obj="'+dataval.encodeHTML() + '"';
						      				var html = '';
						      					html = '<a onclick="yulanfujian(this)" '+dataobj+' class="btn btn-outline btn-success btn-xs">预览</a>'		 
						      				return html;
						      	    	}
								    }
								]
							})
						}	
					}
				);
			}else if(detailpaymentType=='3'){
				datailtitle='转款申请单详情';
				$('#J_fukuan').hide();
				$('#J_tuikuan').hide();
				$('#J_zhuankuan').show();
				//转款详细信息加载
				jsonGetAjax(
					basePath+'/finance/payment/apply/selectPaymentApplyById',
					{
						applyId:fromidval                                                 //付款申请单ID
					},
					function(result){
						$('#J_applynum2').html(result.data.financePaymentApplyVo.applyNumber?result.data.financePaymentApplyVo.applyNumber:'-');
						$('#J_hetongnum2').html(result.data.financePaymentApplyVo.contractNumber?result.data.financePaymentApplyVo.contractNumber:'-');
						$('#J_houseId2').html(result.data.financePaymentApplyVo.houseId?result.data.financePaymentApplyVo.houseId:'-');
						$('#J_yezhuname2').html(result.data.financePaymentApplyVo.ownerName?result.data.financePaymentApplyVo.ownerName:'-');
						$('#J_clientId2').html(result.data.financePaymentApplyVo.clientId?result.data.financePaymentApplyVo.clientId:'-');
						$('#J_clientName2').html(result.data.financePaymentApplyVo.clientName?result.data.financePaymentApplyVo.clientName:'-');
						$('#J_fundName2').html(result.data.financePaymentApplyVo.fundName?result.data.financePaymentApplyVo.fundName:'-');
						$('#J_paidTotalAmount2').html(result.data.financePaymentApplyVo.paidTotalAmount?result.data.financePaymentApplyVo.paidTotalAmount:'-');
						$('#J_paidTotaltime2').html(result.data.financePaymentApplyVo.paidTime?result.data.financePaymentApplyVo.paidTime:'-');
						$('#J_strAuditStatus2').html(result.data.financePaymentApplyVo.strAuditStatus?result.data.financePaymentApplyVo.strAuditStatus:'-');
						$('#J_strPaidStatus2').html(result.data.financePaymentApplyVo.strPaidStatus?result.data.financePaymentApplyVo.strPaidStatus:'-');
						$('#J_paidFinishTime2').html(result.data.financePaymentApplyVo.paidFinishTime?result.data.financePaymentApplyVo.paidFinishTime:'-');
						applyIdNum = result.data.financePaymentApplyVo.chargebackId;
						//回显付款原因信息
						$('#J_zhuankuanremarks').html(result.data.financePaymentApplyVo.remarks);
						/*
						 *strAuditStatus： 审核状态：1，付款申请中；2，付款申请不通过；3，待财务审批；4，财务审批通过；5，财务审批不通过 ；6，付款申请退回
						 */
						AuditStatus=result.data.financePaymentApplyVo.auditStatus;
						fundNameType = result.data.financePaymentApplyVo.fundCode;
						if(fundNameType == '13'){
							$('#lishiK').hide();
							$('#J_jiange').hide();
						}else{
							$('#lishiK').show();
							$('#J_jiange').show();
						};
						if(fundNameType == '11'){
							$('#J_receiptbox').hide();
						}else{
							$('#J_receiptbox').show();
						};
						if(AuditStatus =='2' && $('#J_zhuankuanbtnpass').length>0){
							$('#J_btnbutton_nonethr').show();
							$('#J_zhuankuanbtnpass').on('click',function(){
								window.open(basePath+"/finance/payment/apply/transfer/applyedit.htm?applyId="+applyid);
							})
						}else if(AuditStatus =='5' && $('#J_zhuankuanbtnpass').length>0){
							$('#J_btnbutton_nonethr').show();
							$('#J_zhuankuanbtnpass').on('click',function(){
								window.open(basePath+"/finance/payment/apply/transfer/applyedit.htm?applyId="+applyid);
							})
						}else if(AuditStatus =='6' && $('#J_zhuankuanbtnpass').length>0){
							$('#J_btnbutton_nonethr').show();
							$('#J_zhuankuanbtnpass').on('click',function(){
								window.open(basePath+"/finance/payment/apply/transfer/paymentedit.htm?applyId="+applyid);
							})
							
						}
						//加载转款收据信息
						if(typeof(result.data.paymentApplyReceiptList)!="undefined"){
							$('#J_zhuankuan_dataTable').bootstrapTable('destroy');
							$('#J_zhuankuan_dataTable').bootstrapTable({
								data:result.data.paymentApplyReceiptList,
								columns: [ 	
						           	{field: 'batchId',title :'收款批次号',align: 'center',
						           		formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
						      				html = '<a href="'+url+'" target="_blank">'+ row.batchId +'</a>';
						      				return html;
						      	    	}
						           	},
						            {field: 'receiptNumber', title: '收据编号', align: 'center',
						           		formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
						      				html = '<a href="'+url+'" target="_blank">'+ row.receiptNumber +'</a>';
						      				return html;
						      	    	}
						            },
								    {field: 'strPayer', title: '付款方', align: 'center'},
								    {field: 'strPayee', title: '收款单位', align: 'center'},
								    {field: 'fundName', title: '款项', align: 'center'},
								    {field: 'amount', title: '收据金额', align: 'center'},
								    {field: 'refundAmount', title: '退款金额', align: 'center'},
								    /*{field: 'invoiceNumbers', title: '发票编号', align: 'center'},*/
								    {field: 'printCount', title: '收据打印张数', align: 'center'},
								    {field: 'recycleCount', title: '收据回收张数', align: 'center'},
								    {field: 'differentReason', title: '回收差异原因', align: 'center'},
								    {field: 'strRecycleStatus', title: '收据回收状态', align: 'center'},
								    /*{field: 'isInvoiceStatus', title: '发票状态', align: 'center'}*/
								]
							})
						}
						//加载转款信息
						if(typeof(result.data.paymentList)!="undefined"){
							$('#J_zhuankuanmessage_dataTable').bootstrapTable('destroy');
							$('#J_zhuankuanmessage_dataTable').bootstrapTable({
								data:result.data.paymentList,
								columns: [ 	
								    {field: 'collectionBatchId',title :'收款批次号',align: 'center',
						           		formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.collectionBatchId;
						      				html = '<a href="'+url+'" target="_blank">'+ row.collectionBatchId +'</a>';
						      				return html;
						      	    	}
						           	},
								    {field: 'strPayType', title: '付款方式', align: 'center'},
								    {field: 'fundName', title: '付款款项', align: 'center'},
								    {field: 'payAmount', title: '转款金额', align: 'center'},
								    {field: 'paymentNumber', title: '付款单编号', align: 'center'},
								    {field: 'newContractNumber', title: '转入新合同编号', align: 'center'},
								    {field: 'turnToCollectionBatchId', title: '转入收款批次', align: 'center'},
								    {field: 'turnToTime', title: '实转日期', align: 'center'},
								    {field: 'opt', title: '操作', align: 'center',
								    	formatter: function(value, row, index) {	
						      				var html = '';
						      				var url = basePath+"/finance/payment/detail.htm?paymentId="+row.paymentId;
						      					html = '<a href="'+url+'" target="_blank">详情</a>'
						      				return html;
						      	    	}
								    }
								]
							})
						}
						//加载转款差额信息
						if(typeof(result.data.gapPaymentApplyReceiptList)!="undefined"){
							$('#J_zhuankuanchae_dataTable').bootstrapTable('destroy');
							$('#J_zhuankuanchae_dataTable').bootstrapTable({
								data:result.data.gapPaymentApplyReceiptList,
								columns: [ 	
								    {field: 'receiptNumber', title: '新收据编号', align: 'center'},
								    {field: 'createTime', title: '生成时间', align: 'center'},
								    {field: 'batchId', title: '收款批次号', align: 'center'},
								    {field: 'parentReceiptNumber', title: '原收据编号', align: 'center',
                                        formatter: function(value, row, index) {
                                            var html = '';
                                            var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.parentReceiptId;
                                            html = '<a href="'+url+'" target="_blank">'+ row.parentReceiptNumber +'</a>';
                                            return html;
                                        }
									},
								    {field: 'invoiceNumbers', title: '发票编号', align: 'center'},
								    {field: 'strPayer', title: '付款方', align: 'center'},
								    {field: 'strPayee', title: '收款单位', align: 'center'},
								    {field: 'fundName', title: '款项', align: 'center'},
								    {field: 'amount', title: '收据金额', align: 'center'},
								    {field: 'isInvoiceStatus', title: '开票状态', align: 'center'},
								    {field: 'printStatus', title: '打印状态', align: 'center'},
								    {field: 'opt', title: '操作', align: 'center',
								    	formatter: function(value, row, index) {
						      				var html = '';
						      				var objId = 'J_zhuankuanchae_dataTable';
						      				var receiptId = row.receiptId;
						      				var receiptNumber = row.receiptNumber;
						      					html = '<a type="print" onclick="receipttaTableprint('+objId+','+receiptId+','+"'"+receiptNumber+"'"+')" class="btn btn-outline btn-success btn-xs">打印</a>'
						      				return html;
						      	    	}
								    }
								]
							})
						}
						//加载转款附件列表
						if(typeof(result.data.paymentApplyAttList)!="undefined"){
							$('#zhuankuanattachmentList').bootstrapTable('destroy');
							$('#zhuankuanattachmentList').bootstrapTable({
								data:result.data.paymentApplyAttList,
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
								    		row.remarks = (row.remarks==''||row.remarks==undefined)?row.remarks:row.remarks.encodeHTML();
								    		var dataval = JSON.stringify(row);
								    		var dataobj='data-obj="'+dataval.encodeHTML() + '"';
						      				var html = '';
						      					html = '<a onclick="yulanfujian(this)" '+dataobj+' class="btn btn-outline btn-success btn-xs">预览</a>'		 
						      				return html;
						      	    	}
								    }
								]
							})
						}
					}
				);
			}
			$('#J_titledetail').text(datailtitle);
			// 操作日志数据列表
			$('#J_approvaldataTable').bootstrapTable({
				url: basePath + '/finance/payment/approve/findHistoryList',
				sidePagination: 'server',
				dataType: 'json',
				method:'get',
				pagination: false,
				striped: true,
				pageSize: 10,
				pageList: [10, 20, 50],
				queryParams: function (params) {
					var o = new Object();
					o.formId = fromidval;
					o.type="PAYMENT_APPROVE";
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
				            {field: 'deptname', title: '审批部门', align: 'center'},
						    {field: 'rolename', title: '角色', align: 'center'},
						    {field: 'username', title: '审批人', align: 'center'},
						    {field: 'createtime', title: '审批时间', align: 'center'},
						    {field: 'result', title: '审批结果', align: 'center'},
						    {field: 'comment', title: '审批意见', align: 'center'},
						    {field: 'usedtime', title: '审批持续时间', align: 'center'}
						]
			});
			$('#J_operationlogdataTable').bootstrapTable({
				url: basePath + '/finance/payment/apply/selectOperationListByApplyId',
				sidePagination: 'server',
				dataType: 'json',
				method:'get',
				pagination: false,
				striped: true,
				pageSize: 10,
				pageList: [10, 20, 50],
				queryParams: function (params) {
					var o = new Object();
					o.timestamp = new Date().getTime();
					o.applyId =fromidval;
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
				            {field: 'createByName', title: '操作人', align: 'center'},
						    {field: 'createByPositonName', title: '岗位', align: 'center'},
						    {field: 'deptName', title: '所属部门', align: 'center'},
						    {field: 'typeName', title: '操作类型', align: 'center'},
						    {field: 'content', title: '操作内容', align: 'center'},
						    {field: 'createTime', title: '操作时间', align: 'center'}
						]
			});
			// 审批按钮事件
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
						layer.alert('审批意见不能为空');
						return false;
					}						
					if(isresponsible == 1&&tablen==1&&nofond=="no-records-found"){
						layer.alert('选择有责时，必须录入责任人');
						return false;
					}
					commonContainer.showLoading();

					if(datavalbutton == 'toPass'){
						jsonPostAjax(basePath+'/workflow/doJob?modelName=PAYMENT_APPROVE&methodName=toPass',{
                            taskId:typetaskId,
                            formId:fromidval,
                            comment:$('#J_auditrecordcontent').val(),
                            isEnd:isEndVal,
                            isResponsible:isresponsible
                        },function (result) {
                            commonContainer.hideLoading();
                            if(result.code == 0){
                                layer.alert('提交成功');
                                $('#J_btn_button button').hide();
                                $('#J_btnEntry').prop('disabled',true);
                                $('#J_auditrecordcontent').prop('disabled',true);
                                $('#J_servicedataTable a').hide();
                                return ;
                            }
                        })
					}
					if(datavalbutton == 'toReject'){
						jsonPostAjax(basePath+'/workflow/doJob?modelName=PAYMENT_APPROVE&methodName=toReject',{
                            formId:fromidval,
                            noPass:0,
                            comment:$('#J_auditrecordcontent').val(),
                            isEnd:isEndVal,
                            taskId:typetaskId
                        } , function (result) {
                            commonContainer.hideLoading();
                            if(result.code == 0){
                                layer.alert('提交成功');
                                $('#J_btn_button button').hide();
                                $('#J_btnEntry').prop('disabled',true);
                                $('#J_auditrecordcontent').prop('disabled',true);
                                $('#J_servicedataTable a').hide();
                                return ;
                            }
                        })
					}
					if(datavalbutton == 'noPass'){
						jsonPostAjax(basePath+'/workflow/doJob?modelName=PAYMENT_APPROVE&methodName=toReject',{
                            taskId:typetaskId,
                            formId:fromidval,
                            noPass:1,
                            comment:$('#J_auditrecordcontent').val(),
                            isEnd:isEndVal
                        },function (result) {
                            commonContainer.hideLoading();
                            if(result.code == 0){
                                layer.alert('提交成功');
                                $('#J_btn_button button').hide();
                                $('#J_btnEntry').prop('disabled',true);
                                $('#J_auditrecordcontent').prop('disabled',true);
                                $('#J_servicedataTable a').hide();
                                return ;
                            }
                        })
					}
					if(datavalbutton == 'toRejectLastStep'){
						jsonPostAjax(basePath+'/workflow/doJob?modelName=PAYMENT_APPROVE&methodName=toRejectLastStep',{
                            taskId:typetaskId,
                            formId:fromidval,
                            comment:$('#J_auditrecordcontent').val(),
                            isEnd:isEndVal
                        },function (result) {
                            commonContainer.hideLoading();
                            if(result.code == 0){
                                layer.alert('提交成功');
                                $('#J_btn_button button').hide();
                                $('#J_btnEntry').prop('disabled',true);
                                $('#J_auditrecordcontent').prop('disabled',true);
                                $('#J_servicedataTable a').hide();
                                return ;
                            }
                        })
					}
				}
			);
			//处理结果
			dimContainer.buildDimChosenSelector($('#J_dealResult'),'dealResult','');
			//加载录入责任人弹出框
			$('#J_btnEntry').on('click',function(){
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
								"chargebackId":fromidval,
								"reason":reason,
								"amount":amount,
								"dealResult":dealResult,
								"remark":remark,
								"userid":popuser,
								"isvalid":1
								
							},
							function(resultdata) {
								var chargebackId = fromidval;
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
			}
		);
		// 删除录入责任人数据
		$('#J_servicedataTable').delegate('a','click',function(event) {
			var _this=this;
			if (this.type == 'del') {// 根据type 判断 审核
				var dataid = $(_this).attr('data-id');
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
			};
			if (this.type == 'editor') {// 根据type 判断 审核
				var dataid = $(_this).attr('data-id');
				// 加载选择员工数据
				commonContainer.modal(
					'修改责任人',
					$('#audit_by_layer'),
					function(index, layero) {
						jsonPostAjax(
							basePath + '/sign/chargeback/updateChargebackResp',
							{
								"chargebackId":fromidval,
								"reason":$('#J_reason').val(),
								"amount":$('#J_amount').val(),
								"dealResult":$('#J_dealResult').val(),
								"remark":$('#J_layertextarearemark').val(),
								"userid":$('#J_popuser').attr('data-id'),
								"isvalid":1,
								"id":dataid
								
							},
							function(resultmap) {
								var chargebackId = fromidval;
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
							$('#J_dealResult').val('');
							$('#J_dealResult').trigger("chosen:updated");
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
					});
				};
			}
		);
		function trace(chargebackid){
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
					o.chargebackId = chargebackid;
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
				      					html = '<div class="text-left"><a type="editor" class="btn btn-outline btn-success btn-xs" data-username="'+row.username+'" data-remark="'+row.remark+'" data-dealResult="'+row.dealResult+'" data-amount="'+row.amount+'" data-reason="'+row.reason+'" data-id="'+row.id+'">修改</a>&nbsp;&nbsp;'
				      						  +'<a type="del" class="btn btn-outline btn-danger btn-xs" data-id="'+row.id+'">删除</a></div>'
				      				return html;
				      	    	}
						    	
						    }
				      	],
			})
			$('#J_servicedataTable').bootstrapTable('refresh',{ url: basePath + '/sign/chargeback/selectChargebackResp' });
		};
	});
})

//责任认定tab切换
$('#inlineRadio1').on('click',function(){
	$('#reason').hide();
});
$('#inlineRadio').on('click',function(){
	$('#reason').show();
});

//点击加业绩信息志页面
$('#J_yeji').off().on('click',function(){
	$('#J_srcyeji').attr('src',basePath + '/performanceIncome/toExpectIncomeDetail.html?applyId='+applyIdNum);
});

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

//点击预览按钮预览附件
function yulanfujian($_this){
	commonContainer.modal('查看附件',$('#J_attachmentCon'),function(i){
		layer.close(i);
		$('#J_upFileName').html('');
	},{
		btns:['关闭'],
		area:['80%','70%'],
		overflow :true,
		success:function(){
			$('#J_upFileName').html('');
			var dataobj = $($_this).data('obj');
			$('#J_businesstypeName').text(dataobj.businessTypeName);
			$('#J_Paymenttextval').html(dataobj.fundName);
			$('#J_bigger').html(dataobj.largeTypeName);
			$('#J_small').html(dataobj.smallTypeName);
			$('#J_titleName').html(dataobj.largeTypeName);
			$('#J_valremark').html(dataobj.remarks);
			
			var htmlnews='';
			jsonGetAjax(
				basePath + '/finance/payment/apply/selectPaymentApplyAttPathByAttId',{
					"attId":dataobj.attId,
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
function download(filePath){
	window.open(basePath+'/sign/downloadEnclosure.htm?filePath='+filePath);
};
function shenpilchen(){
	//审批历史流程图展示
	jsonPostAjax(basePath+'/workflow/doJob?modelName=PAYMENT_APPROVE&methodName=getFlowChartUrlByBusiness',{			
	    formId:fromidval
	},function(result){
		$('#J_srcimg').attr('src',result.data.PAYMENT_APPROVE);
	});
}
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}