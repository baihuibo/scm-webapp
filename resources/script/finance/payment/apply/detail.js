var datailtitle='';
var applyid=getQueryString("applyId");
var detailpaymentType=getQueryString("paymentType");
var strAuditStatus = '';
var contractId = '';
var contractNumber = '';
var fundNameType = '';
var strAuditStatus = '';
var applyIdNum = '';
$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});

	//点击加载基本信息页面
	$('#J_jbmessage').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+detailpaymentType+'&applyId='+applyid+'&contractId='+contractId+'&fundNameType='+fundNameType;
	});
	//点击加载审批历史页面
	$('#J_splishi').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/audittrace.htm?paymentType='+detailpaymentType+'&applyId='+applyid+'&contractId='+contractId+'&fundNameType='+fundNameType+'&contractId='+contractNumber;
	});
	//点击加载操作日志页面
	$('#J_czrizhi').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/operationlog.htm?paymentType='+detailpaymentType+'&applyId='+applyid+'&contractId='+contractId+'&fundNameType='+fundNameType;
	});
	//点击加业绩信息志页面
	$('#J_yejimessage').off().on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/operationperformance.html?paymentType='+detailpaymentType+'&applyId='+applyid+'&contractId='+contractId+'&fundNameType='+fundNameType;
	});
	
	if(detailpaymentType=='1'){
		datailtitle='付款申请单详情';
		$('#J_zhuankuan').hide();
		$('#J_tuikuan').hide();
		$('#J_fukuan').show();
		//付款申请单详细信息加载
		jsonGetAjax(
			basePath+'/finance/payment/apply/selectPaymentApplyById',
			{
				applyId:applyid                                                 //付款申请单ID
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
						    		row.remarks = row.remarks?row.remarks.encodeHTML():'';
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
		$('#detailK').on('click',function(){
			$('#fukuan_z').show();
			$('#tuikuan_z').hide();
			$('#zhuankuan_z').hide();
			$('#fukuan_log').show();
			$('#tuikuan_log').hide();
			$('#zhuankuan_log').hide();
		})
	}else if(detailpaymentType=='2'){
		datailtitle='退款申请单详情';
		$('#J_fukuan').hide();
		$('#J_zhuankuan').hide();
		$('#J_tuikuan').show();
		//退款详细信息加载
		jsonGetAjax(
			basePath+'/finance/payment/apply/selectPaymentApplyById',
			{
				applyId:applyid                                                 //付款申请单ID
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
				            {field: 'createTime', title: '生成时间', align: 'center',
				           		formatter: function(value, row, index) {	
				      				var html = value.substr(0, value.length-2);
				      				return html;
				           		}
				           	},
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
						    {field: 'strInvoiceStatus', title: '开票状态', align: 'center'},
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
						    		row.remarks = row.remarks?row.remarks.encodeHTML():'';
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
		$('#lishiK').on('click',function(){
			$('#fukuan_z').hide();
			$('#tuikuan_z').show();
			$('#zhuankuan_z').hide();
			$('#fukuan_log').hide();
			$('#tuikuan_log').show();
			$('#zhuankuan_log').hide();
		})
	}else if(detailpaymentType=='3'){
		datailtitle='转款申请单详情';
		$('#J_fukuan').hide();
		$('#J_tuikuan').hide();
		$('#J_zhuankuan').show();
		//转款详细信息加载
		jsonGetAjax(
			basePath+'/finance/payment/apply/selectPaymentApplyById',
			{
				applyId:applyid                                                 //付款申请单ID
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
						    {field: 'parentReceiptNumber', title: '原收据编号', align: 'center'},
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
						    		row.remarks = row.remarks?row.remarks.encodeHTML():'';
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
		$('#logK').on('click',function(){
			$('#fukuan_z').hide();
			$('#tuikuan_z').hide();
			$('#zhuankuan_z').show();
			$('#fukuan_log').hide();
			$('#tuikuan_log').hide();
			$('#zhuankuan_log').show();
		})
	}
	$('#J_titledetail').text(datailtitle);
})

function createPrinter () {
    var toolsId = 'jatoolsPrinter';
    if (!document.getElementById(toolsId)) {
        document.head.insertAdjacentHTML('afterBegin', '<object id="jatoolsPrinter" ' +
            'classid="CLSID:B43D3361-D075-4BE2-87FE-057188254255" ' +
            'codebase="jatoolsPrinter.cab#version=5,7,0,0"></object>');
    }
    return document.getElementById(toolsId);
}
function receipttaTableprint(obj,receiptId,receiptCode){
	jsonGetAjax(
		basePath + '/finance/receipt/checktimes',{
			"receiptId":receiptId,
		},function(result){
			layer.open({
		         title: '打印浏览',
		         type: 2,
		         content:basePath+'/finance/receipt/print.htm?receiptId='+receiptId,
		         area: ['90%', '90%'],
		         btn:['打印','取消'],
		         yes: function(index){
		        	 var $body = layer.getChildFrame('body',index);
		        	 var jatoolsPrinter = createPrinter();
		        	 
                     if (typeof jatoolsPrinter.print !== 'undefined' && typeof jatoolsPrinter.printPreview !== 'undefined') {
                         var myDoc = {
                             documents: $body.get(0).ownerDocument,
                             copyrights: '杰创软件拥有版权  www.jatools.com',  // 版权声明,必须
                             autoBreakPage: true,// 自动分页打印区域内容
                             importedStyle : [basePath + '/resources/css/receipt_print.css'],
                             settings: {
                                 copies: 1, // 打印几份
                             },
                             onPagePrinted: function (current, total) {
                            	
                                 // 每一页打印完后的回调函数
                            	 if(current == total - 1){
                             		jsonPostAjax(
                         				basePath + '/finance/receipt/insertupdate',{
                							'receiptCode':receiptCode,
                							'receiptId':receiptId,
                						},
                						function(){
                							$('#'+obj).bootstrapTable('refresh', {url: basePath + '/finance/payment/apply/list'});
                							layer.alert('打印完成');
                							layer.close(index);
                						}
                					)
                             	}
                             }
                             
                         };
                         var defaultPrinter = jatoolsPrinter.getDefaultPrinter();// 获取默认打印机
                         if (/pdf/i.test(defaultPrinter)) {
                             layer.alert('默认打印机不能是 PDF 打印机,请重新设置默认打印机');
                         }
                         jatoolsPrinter.print(myDoc);  // 直接打印
                         //jatoolsPrinter.printPreview(myDoc);  // 预览 
	                     } else {
	                         layer.alert('无法打印，请在`小房子`浏览器中使用此功能，如果已经在`小房子`浏览器中，请安装打印控件后重启浏览器在试');
	                         layer.close(index);
	                     }

		        	 }
		     });
		}
	)
}


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

//下载文件
function download(filePath){
	window.open(basePath+'/sign/downloadEnclosure.htm?filePath='+filePath);
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}