var receiptId=getQueryString('receiptId');
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
basicinfo();
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).attr("href");
        if(activeTab=='#tab-11'){
        	basicinfo();
        }else if(activeTab=='#tab-12'){
        	approver();
        }else if(activeTab=='#tab-13'){
        	printpast();
        }else if(activeTab=='#tab-14'){
        	receiptregain();
        }
});

/*基本信息*/
function basicinfo(){
	$.ajax({
		url : basePath + '/finance/receipt/searchReceiptById',
		data : {"receiptId":getQueryString('receiptId')},
		type : 'get',
		dataType : 'json',
		cache : false,
		success : function(result) {
			if (result.code == '0') {
				for(var key in result.data){
					if($("#J_basic_"+key)){
						$("#J_basic_"+key).text(result.data[key]);
					}
				}
				//收款批次添加链接到详情
				$('#J_basic_batchId').html('<a href="'+basePath+'/finance/collect/batchDetail.htm?batchId='+result.data.batchId+'" target="_blank">'+result.data.batchId+'</a>');
			} else {
				layer.alert(result.msg);
			}
		}
	});
}

/*打印历史*/
function printpast(){
	$('#J_printtaTable').bootstrapTable({ 
		url:basePath + '/finance/receipt/selectReceiptPrintById',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = {};
			o.timestamp = new Date().getTime();
			o.receiptId = receiptId;
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount}
			}
			return { "rows": [], "total": 0 } 
		},

		columns:[			         
		      	    {title: '序号', align: 'center',
		      	    	formatter: function (value, row, index) {  
                            return index+1;  
                        }  
		      	    },
		      	    {field: 'receiptCode', title: '收据编号', align: 'center'},
		      	    {field: 'printByStr', title: '打印人', align: 'center',
		      	    	formatter: function(value ,row, index){
		      	    		var html='';
		      	    		html='<a onclick="getUserStaffInfo('+row.printById+')">'+row.printByStr+'</a>'
		      	    		return html;
		      	    	}
		      	    },
		      	    {field: 'printCount', title: '打印张数', align: 'center'},
		      	    {field: 'printByPositionStr', title: '岗位', align: 'center'},
		      	    {field: 'shopName', title: '所属店组', align: 'center'},
		      	    {field: 'printTime', title:'打印时间', align: 'center'},
		      	],
	})
}

/*收据换回*/
function receiptregain(){
	var str;
	var src;
	jsonGetAjax(
			basePath + '/finance/receipt/selectInvoiceListByReceiptId',{
				"receiptId":receiptId,
			},function(result){
				$("#J_receipttaTable tbody").empty();
				for(var i=0;i<result.data.length;i++){
				 	str+="<tr>"
					 		+'<td>'+result.data[i].invoiceNumber+'</td>'
					 		+'<td>'+result.data[i].invoiceHeader+'</td>'
					 		+'<td>'+result.data[i].invoiceName+'</td>'
					 		+'<td>'+result.data[i].invoiceAmount+'</td>'
					 		+'<td>'+result.data[i].belongCenterShopName+'</td>'
					 	"</tr>"
				 }
				$("#J_receipttaTable tbody").append(str);
				
			}
	);
	jsonGetAjax(
			basePath + '/finance/receipt/selectReceiptReturnById',{
				"receiptId":receiptId,
			},function(result){
				$("#J_regaintaTable tbody").empty();
					src+="<tr>"
						src+='<td>'+result.data.receiptCode+'</td>'
						 		+'<td>'+result.data.contractCode+'</td>'
						 		+'<td>'+result.data.fundName+'</td>'
						 		+'<td>'+result.data.amount+'</td>'
						 		+'<td>'+result.data.payerName+'</td>'
						 		+'<td>'+result.data.createTime+'</td>'
						 		+'<td>'+result.data.approveStatus+'</td>'
						 		/*+'<td>'+result.data.printCount+'</td>'*/
						 		if(result.data.printCount==undefined){
						 			src+='<td>-</td>'
						 		}else{
						 			src+='<td>'+result.data.printCount+'</td>'
						 		}
						 		/*+'<td>'+result.data.recycleCount+'</td>'*/
						 		if(result.data.recycleCount==undefined){
						 			src+='<td>-</td>'
						 		}else{
						 			src+='<td>'+result.data.recycleCount+'</td>'
						 		}
						 		if(result.data.differentReason==undefined){
						 			src+='<td>-</td>'
						 		}else{
						 			src+='<td>'+result.data.differentReason+'</td>'
						 		}
						 		
						 	"</tr>"
				$("#J_regaintaTable tbody").append(src);
			}
	)
}


/*审批历史*/
function approver(){
	var approverStr;
	jsonGetAjax(
			basePath + '/finance/collect/auditLogList',{
				"sourceId":receiptId,
			},function(result){
				$("#J_approveTable tbody").empty();
				for(var i=0;i<result.data.length;i++){
					approverStr+='<tr>'
						approverStr+='<td>'+(i+1)+'</td>'
						approverStr+='<td>'+result.data[i].sourceId+'</td>'
						approverStr+='<td>'+result.data[i].createByName+'</td>'
						approverStr+='<td>'+result.data[i].createByPositionName+'</td>'
						approverStr+='<td>'+result.data[i].createTime+'</td>'
						approverStr+='<td>'+result.data[i].statusDesc+'</td>'					 		
					 		if(result.data[i].memo==undefined){
					 			approverStr+='<td>-</td>'
					 		}else{
					 			approverStr+=+'<td>'+result.data[i].memo+'</td>'
					 		}
					approverStr+='</tr>'
				 }
				$("#J_approveTable tbody").append(approverStr);
				
			}
	);
}
