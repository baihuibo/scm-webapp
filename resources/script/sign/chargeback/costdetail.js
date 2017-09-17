$(function(){
	attachmentView.init();
});
var chargebackId = getQueryString('chargebakcid');
var costcontractId = getQueryString('conId');
var businesstype = getQueryString('businesstype');
var contractCode = getQueryString('contractcode');
var skysjine=0.00;
var skssjine=0.00;
var fpjine=0.00;
var fkysjine=0.00;
var fkztujine=0.00;
var fksfjine=0.00;
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
			$('#strauditstatus').html('审核状态：'+rdata.data.strauditstatus);
			//跳转到退单信息
			$('#goTuidanInfor').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/detail.html?signnumber='+rdata.data.signnumber;
			});
			var urlDate=location.search;
			//跳转到费用处理
			$('#gofeiYongcl').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/cost.html'+urlDate;
			});
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
		});
		
		//加载收款信息
		$('#J_Billingmessage_dataTable').bootstrapTable({
			url: basePath + '/sign/chargeback/getCostExecuteInfoByChargeback',
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
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				return o;
			},
			responseHandler: function(result){
				if(result.code == 0 && result.data) {
					return { "rows": result.data.receiptList}
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
					    {field: 'printCount', title: '收据打印次数', align: 'center'},
					    {field: 'fundName', title: '款项名称', align: 'center'},
					    {field: 'strPayee', title: '收款单位', align: 'center'},
					    {field: 'strPayer', title: '付款方', align: 'center'},
					    {field: 'payerName', title: '付款单位/个人', align: 'center'},
					    {field: 'receiptAmount', title: '应收金额/元', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html = '<span>'+ row.receiptAmount +'</span>';
					    		if(row.receiptAmount != undefined){
					    			skysjine+=value*1;
						    		$('#J_yingshou').val(skysjine);
					    		}
			      				return html;
					    		
			      	    	}

					    },
					    {field: 'printTime', title: '收款日期', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html =row.printTime?row.printTime.substring(0,19):'-';
					    		return html;
			      	    	}
					    },
					    {field: 'transitAmount', title: '在途金额/元</br>（审批中）', align: 'center'},
					    {field: 'lastAuditTime', title: '实收日期', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html =row.lastAuditTime?row.lastAuditTime.substring(0,19):'-';
					    		return html;
			      	    	}
					    },
					    {field: 'realCollectAmount', title: '实收金额/元</br>（已审批）', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		var realCollectAmount = value?value:'-';
					    		html = '<span>'+ realCollectAmount +'</span>';
					    		if(row.realCollectAmount != undefined){
					    			skssjine+=value*1;
						    		$('#J_shishou').val(skssjine);
					    		}
					    		return html;
			      	    	}
					    },
					    {field: 'strStatus', title: '状态', align: 'center'}
					]
		});
		//加载发票信息
		$('#J_InvoiceInformation_dataTable').bootstrapTable({
			url: basePath + '/sign/chargeback/getCostExecuteInfoByChargeback',
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
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				return o;
			},
			responseHandler: function(result){
				if(result.code == 0 && result.data) {
					return { "rows": result.data.invoiceList}
				}
				return { "rows": []} 
			},
			columns: [ 	
			           	{field: 'SerialNumber',title :'序号',align: 'center',
			           		formatter: function(value, row, index) {
			      				return index+1;
			      	    	}
			           	},
			            {field: 'invoiceNumber', title: '发票编号', align: 'center',
			           		formatter: function(value, row, index) {	
			      				var html = '';
			      				var invoiceNumber = value?value:'-';
			      				var url = basePath+"/house/main/leasedetail.htm";
			      				html = '<a href="'+url+'" target="_blank">'+ invoiceNumber +'</a>';
			      				return html;
			      	    	}
			            },
					    {field: 'invoiceName', title: '发票名称', align: 'center'},
					    {field: 'invoiceAmount', title: '面值/元', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html = '<span>'+ row.invoiceAmount +'</span>';
					    		if(row.invoiceAmount != undefined){
					    			fpjine+=value*1;
						    		$('#J_mianzhi').val(fpjine);
					    		}
					    		return html;
			      	    	}
					    },
					    {field: 'createByName', title: '录入人', align: 'center'},
					    {field: 'createTime', title: '录入日期', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html =row.createTime?row.createTime.substring(0,19):'-';
					    		return html;
			      	    	}
					    },
					    {field: 'strInvoiceStatus', title: '状态', align: 'center'}
					]
		});
		
		//加载付款信息
		$('#J_paymentinfo_dataTable').bootstrapTable({
			url: basePath + '/sign/chargeback/getCostExecuteInfoByChargeback',
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
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				return o;
			},
			responseHandler: function(result){
				if(result.code == 0 && result.data) {
					return { "rows": result.data.paymentList}
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
					    {field: 'paymentNumber', title: '付款单号', align: 'center',
			            	formatter: function(value, row, index) {	
			      				var html = '';
			      				var paymentNumber = value?value:'-';
			      				var url = basePath+"/finance/payment/detail.htm?paymentId="+row.paymentId;
			      				html = '<a href="'+url+'" target="_blank">'+ paymentNumber +'</a>';
			      				return html;
			      	    	}
					    },
					    {field: 'batchNumber', title: '付款申请单号', align: 'center',
					    	formatter: function(value, row, index) {	
			      				var html = '';
			      				var batchNumber = value?value:'-';
			      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchNumber;
			      				html = '<a href="'+url+'" target="_blank">'+ batchNumber +'</a>';
			      				return html;
			      	    	}
					    },
					    {field: 'fundName', title: '款项名称', align: 'center'},
					    {field: 'strPayer', title: '付款单位', align: 'center'},
					    {field: 'receiverType', title: '收款方', align: 'center',
					    	formatter: function(value, row, index) {	
			      				var html = '';
			      				if(value==1){
			      					return html = "客户"
			      				}else if(value==2){
			      					return html = "业主"
			      				}else if(value==3){
			      					return html = "员工"
			      				}else{
			      					return html = "其他"
			      				}
			      	    	}},
					    {field: 'receiverName', title: '收款人', align: 'center'},
					    {field: 'payAmount', title: '应付金额/元', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html = '<span>'+ row.payAmount +'</span>';
					    		if(row.payAmount != undefined){
					    			fkysjine+=value*1;
						    		$('#J_yingfumoney').val(fkysjine);
					    		}
					    		return html;
			      	    	}
					    },
					    {field: 'payTime', title: '付款日期', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html =row.payTime?row.payTime.substring(0,19):'-';
					    		return html;
			      	    	}
					    },
					    {field: 'transitAmount', title: '在途金额/元</br>（审批中）', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html = '<span>'+ row.transitAmount +'</span>';
					    		if(row.transitAmount != undefined){
					    			fkztujine+=value*1;
						    		$('#J_zaitumoney').val(fkztujine);
					    		}
					    		return html;
			      	    	}
					    },
					    {field: 'realPayTime', title: '实付日期', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		html =row.realPayTime?row.realPayTime.substring(0,19):'-';
					    		return html;
			      	    	}
					    },
					    {field: 'realPayAmount', title: '实付金额/元</br>（已审批）', align: 'center',
					    	formatter: function(value, row, index) {
					    		var html = '';
					    		var realPayAmount = value?value:'-';
					    		html = '<span>'+ realPayAmount +'</span>';
					    		if(row.realPayAmount != undefined){
					    			fksfjine+=value*1;
						    		$('#J_shifumoney').val(fksfjine);
					    		}
					    		return html;
			      	    	}
					    },
					    {field: 'strPayStatus', title: '付款单状态', align: 'center'}
					]
		});
	}
}
//录入收款申请跳转
$('#J_altogether').on('click',function(){
	window.open(basePath+'/finance/collect/collectPlan.html?contractId='+costcontractId+'&businessType='+businesstype+'&ChargebakcId='+chargebackId+'&contractCode='+contractCode);
})
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 