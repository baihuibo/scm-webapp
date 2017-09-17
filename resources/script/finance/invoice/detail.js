var invoiceNum=getQueryString("invoiceId");
$(function() {
	$("select").chosen({
		width : "100%"
	});
	jsonGetAjax(
		basePath + '/finance/invoice/detail',
		{	
			"invoiceId":invoiceNum								
		},
		function(result) {
			var ReceiptList = '';
			var length=result.data.oldReceiptList.length-1;
			var urlc = basePath+"/finance/receipt/detail.htm?receiptId=";
			$.each(result.data.oldReceiptList,function(i,n){
				if(i==length){
					ReceiptList += '<a href="'+urlc+ n.receiptId +'" target="_blank">'+n.receiptNumber+'</a>'
				}else{
					ReceiptList += '<a href="'+urlc+ n.receiptId +'" target="_blank">'+n.receiptNumber+',</a>';
				}
			});
			var InvoiceList = '';
			var length=result.data.oldInvoiceList.length-1;
			$.each(result.data.oldInvoiceList,function(i,n){
				if(i==length){
					InvoiceList += n.invoiceNumber
				}else{
					InvoiceList += n.invoiceNumber+',';
				}
			});
			$('#J_belongCompany').text(result.data.belongCompanyName?result.data.belongCompanyName:'-');
			$('#J_invoiceId').text(result.data.invoiceNumber?result.data.invoiceNumber:'-');
			$('#J_strcontractNumber').text(result.data.contractNumber?result.data.contractNumber:'-');
			$('#J_belongCenterShopId').text(result.data.belongCenterShopName?result.data.belongCenterShopName:'-');
			$('#J_strPayer').text(result.data.strPayer?result.data.strPayer:'-');
			$('#J_payerName').text(result.data.payerName?result.data.payerName:'-');
			$('#J_strinvoiceStatustype').text(result.data.strInvoiceStatus?result.data.strInvoiceStatus:'-');
			$('#J_strInvoiceStatus').text(result.data.invoiceName?result.data.invoiceName:'-');
			$('#J_strInvoiceType').text(result.data.strInvoiceType?result.data.strInvoiceType:'-');
			$('#J_invoiceDate').text(result.data.invoiceDate?result.data.invoiceDate:'-');
			$('#J_strinvoiceHeadertype').text(result.data.invoiceHeader?result.data.invoiceHeader:'-');
			$('#J_invoiceAmount').text(result.data.invoiceAmount?result.data.invoiceAmount:'-');
			$('#J_usedByName').text(result.data.usedByName?result.data.usedByName:'-');
			$('#J_initialReceiptNumbers').html(ReceiptList);
			$('#J_initialInvoiceNumbers').html(InvoiceList);
			$('#J_strusedTime').text(result.data.usedTime?result.data.usedTime.substring(0,19):'-');
			$('#J_hidden').val(result.data.contractType)
			$('#J_contractId').val(result.data.contractId)
		}
	)
	
	// 操作日志列表数据						
	$('#J_operationlog_dataTable').bootstrapTable('destroy').bootstrapTable({ 
		url:basePath + '/finance/invoice/detail',
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
			o.pageindex = 0,
			o.pagesize = 999;
			o.invoiceId = invoiceNum;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data) {
				return { "rows": result.data.operationLogList}
			}
			return { "rows": []} 
		},
	
		columns:[		
			{field: 'SerialNumber',title :'序号',align: 'center',
	       		formatter: function(value, row, index) {
	  				return index+1;
	  	    	}
	       	},
	  	    {field: 'createByName', title: '操作人', align: 'center'},
	  	    {field: 'createByPositionName', title: '岗位', align: 'center'},
			{field: 'deptName', title: '所属部门', align: 'center'},
	  	  	{field: 'strType', title: '操作类型', align: 'center'},
	  	    {field: 'content', title: '操作内容', align: 'center'},
	  	    {field: 'createTime', title: '操作时间', align: 'center',
	  	    	formatter: function(value, row, index) {
	  	    		createTime = value ? value : '-';
					if(value != undefined){
						var html='';
						html= createTime.substring(0,19);
						return html;
					}
			    }
	  	    },
	  	    
	  	],
	})
});

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
