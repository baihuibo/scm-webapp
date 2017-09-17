var chargebackId = getQueryString('chargebakcid');
var costcontractId = getQueryString('conId');
var businesstype = getQueryString('businesstype');
var contractCode = getQueryString('contractcode');
var jine=0.00;
var signnumber = '';
var strauditstatus = '';

$(function(){
	attachmentView.init();
	
});
var attachmentView={
	initFalg:true,
	chargebackId:location.search.split('&')[0].split('=')[1],
	init:function(){
		var _this=this;
		//查询单据编号
		jsonGetAjax(basePath+'/sign/chargeback/chargebackCommon.htm',{
			chargebackid:_this.chargebackId
		},function(rdata){
			if(rdata.data.auditstatus=="3"||rdata.data.auditstatus=="8"){
				$("#goFeiyzhixmx").show()
			}
			$('#signnumber').html('单据编号：'+rdata.data.signnumber);
			signnumber = rdata.data.signnumber;
			jsonGetAjax(basePath+'/sign/chargeback/chargebackdetail.htm',{
				signnumber:	rdata.data.signnumber//单据编号
			},function(result){
				if(result.data.isbackcommission ==1){//退单
					$("#J_refundapplyadd").removeAttr("disabled");
				}
				if(result.data.istransfercommission==1){//转款
					$("#J_transferapplyadd").removeAttr("disabled");
				}
				if(result.data.ispayouts==1){//付款
					$("#J_paymentapplyadd").removeAttr("disabled");
				}
				if(result.data.isreceivepenalty==1){//收款
					$("#J_altogether").removeAttr("disabled");
				}
			}); 
			$('#strauditstatus').html('审核状态：'+rdata.data.strauditstatus);
			strauditstatus = rdata.data.auditstatus;
			//跳转到退单信息
			$('#goTuidanInfor').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/detail.html?signnumber='+rdata.data.signnumber;
			});
			var urlDate=location.search;
			//跳转到附件管理
			$('#goAttachment').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/attachment.html'+urlDate;
			});
			//跳转到补充协议
			$('#goAgreement').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/supplementalagreement.html'+urlDate;
			});
			//跳转到审批流程
			$('#goShenPlc').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/auditprocess.html'+urlDate;
			});
            //跳转到业绩信息
            $('#performance').off().on('click',function(){
                location.href=basePath+'/sign/chargeback/chargeBackToPerformance'+urlDate;
            });
			//跳转到费用执行明细
			$('#goFeiyzhixmx').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/costdetail.html'+urlDate;
			});
			
			if(strauditstatus == '1'){
				$('#J_refundapplyadd').show();
				$('#J_paymentapplyadd').show();
				$('#J_transferapplyadd').show();
			}else{
				$('#J_refundapplyadd').hide();
				$('#J_paymentapplyadd').hide();
				$('#J_transferapplyadd').hide();
				$('#J_altogether').hide();
			}
		});
		
		//加载付款信息
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
				o.chargebackId = _this.chargebackId;
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
					    {field: 'applyNumber', title: '单据号', align: 'center',
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
			      				html = '<a href="'+url+'" target="_blank">'+ row.applyNumber +'</a>';
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
			      					html = '<a type="cwboedit" data-paymenttype="'+row.paymentType+'" data-applyid="'+row.applyId+'" class="btn btn-outline btn-success btn-xs">修改</a>&nbsp;&nbsp;'
			      				}else if(strauditstatus == '1'){
			      					html = '<a type="tjedit" data-paymenttype="'+row.paymentType+'" data-applyid="'+row.applyId+'" class="btn btn-outline btn-success btn-xs">修改</a>&nbsp;&nbsp;'
	      							+'<a type="tjdelete" data-paymentId="'+row.paymentId+'" class="btn btn-outline btn-danger btn-xs">删除</a>'
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
				o.chargebackId = _this.chargebackId;
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
					    {field: 'strBatchAuditStatus', title: '状态', align: 'center'}
					]
		});
	}
	
}

// 付款申请跳转
$('#J_paymentapplyadd').on('click',function(){
	window.open(basePath+'/finance/payment/apply/payment/add.htm?contractNo='+costcontractId+'&isChargebakcid=1&signnumber='+signnumber+'&chargebackId='+chargebackId);
})

// 转款申请跳转
$('#J_transferapplyadd').on('click',function(){
	window.open(basePath+'/finance/payment/apply/transfer/add.htm?contractNo='+costcontractId+'&isChargebakcid=1&signnumber='+signnumber+'&chargebackId='+chargebackId);
})

// 退款申请跳转
$('#J_refundapplyadd').on('click',function(){
	window.open(basePath+'/finance/payment/apply/refund/add.htm?contractNo='+costcontractId+'&isChargebakcid=1&signnumber='+signnumber+'&chargebackId='+chargebackId);
})

//录入收款申请跳转
$('#J_altogether').on('click',function(){
	window.open(basePath+'/finance/collect/collectPlan.html?contractId='+costcontractId+'&businessType='+businesstype+'&chargebackId='+chargebackId+'&contractCode='+contractCode);
})

//付款操作列修改按钮跳转
$('#J_cost_dataTable').off().delegate('a','click',function(event){
	var _this=this;
	if(this.type == "cwboedit"){ // 判断修改按钮链接跳转
		var datapaymentId = $(_this).data('paymenttype');
		var dataapplyId = $(_this).data('applyid');
		if(datapaymentId == 1){  //付款
			window.open(basePath + '/finance/payment/apply/payment/paymentedit.htm?applyId='+dataapplyId+'&isChargebakcid=1&contractNo='+costcontractId+'&signnumber='+signnumber+'&chargebackId='+chargebackId);
		}else if(datapaymentId == 2){ // 退款
			window.open(basePath + '/finance/payment/apply/refund/paymentedit.htm?applyId='+dataapplyId+'&isChargebakcid=1&contractNo='+costcontractId+'&signnumber='+signnumber+'&chargebackId='+chargebackId);
		}else if(datapaymentId == 3){ // 转款
			window.open(basePath + '/finance/payment/apply/transfer/paymentedit.htm?&applyId='+dataapplyId+'&isChargebakcid=1&contractNo='+costcontractId+'&signnumber='+signnumber+'&chargebackId='+chargebackId);
		}
	}else if(this.type == "tjedit"){
		var datapaymentId = $(_this).data('paymenttype');
		var dataapplyId = $(_this).data('applyid');
		if(datapaymentId == 1){  //付款
			window.open(basePath + '/finance/payment/apply/payment/paymentedit.htm?applyId='+dataapplyId+'&isChargebakcid=1&contractNo='+costcontractId+'&signnumber='+signnumber+'&chargebackId='+chargebackId);
		}else if(datapaymentId == 2){ // 退款
			window.open(basePath + '/finance/payment/apply/refund/applyedit.htm?applyId='+dataapplyId+'&isChargebakcid=1&contractNo='+costcontractId+'&signnumber='+signnumber+'&chargebackId='+chargebackId);
		}else if(datapaymentId == 3){ // 转款
			window.open(basePath + '/finance/payment/apply/transfer/applyedit.htm?&applyId='+dataapplyId+'&isChargebakcid=1&contractNo='+costcontractId+'&signnumber='+signnumber+'&chargebackId='+chargebackId);
		}
	}else if(this.type == "tjdelete"){ // 判断删除按钮直接删除数据 
		var datapaymentId = $(_this).attr('data-paymentId');
		commonContainer.confirm(
			'是否确认删除此条数据？',
			function(index, layero){
				 jsonGetAjax(
					basePath + '/sign/chargeback/deleteCostHandlePayment',
					{"paymentId" : datapaymentId},
					function(){
						layer.msg("删除成功");
						jQuery('#J_cost_dataTable').bootstrapTable('refresh');
					}
				)
			}
		);
	}
});

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 