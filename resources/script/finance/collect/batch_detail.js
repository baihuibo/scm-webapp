var batchId=getQueryString('batchId');
var approveStatusId;
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
receiptinfo();
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    // 获取已激活的标签页的名称
    var activeTab = $(e.target).attr("href");
    var $ctrl = $('#ibox').controller();
	var $scope = $('#ibox').scope();
    if(activeTab=='#tab-11'){
    	receiptinfo();
    }else if(activeTab=='#tab-12'){
    	$ctrl.receiptPlan();
		$scope.$digest();//外调ag的方法
    }else if(activeTab=='#tab-13'){
    	approver()
    }
});


function receiptinfo(){
	var str;
	var src;
	/*收款信息*/
	jsonGetAjax(
			basePath + '/finance/collect/selectCollectListByBatchId',{
				"batchId":batchId,
			},function(result){
				$("#J_gatheringtaTable tbody").empty();
				for(var i=0;i<result.data.length;i++){
				 	str+='<tr>'
				 		str+='<td>'+result.data[i].collectionId+'</td>'
				 		str+='<td>'+result.data[i].paymenyTypeStr+'</td>'
				 		str+='<td>'+result.data[i].amount+'</td>'
				 		str+='<td>'+result.data[i].paymentTime.substring(0,10)+'</td>'
				 		str+='<td>'+result.data[i].auditStatus+'</td>'
				 		str+='<td>'+result.data[i].deptName+'</td>'
				 		str+='<td>'+result.data[i].createByName+'</td>'
				 		str+='<td>'+result.data[i].createTime+'</td>'
					 		if(typeof(result.data[i].auditByName)=="undefined"){
					 			str+='<td>-</td>'
					 		}else{
					 			str+='<td>'+result.data[i].auditByName+'</td>'
					 		}
					 		
				 	str+='</tr>'
				 }
				$("#J_gatheringtaTable tbody").append(str);
				
			}
	);
	/*收据信息*/
	jsonGetAjax(
			basePath + '/finance/collect/selectReceiptListByBatchId',{
				"batchId":batchId,
			},function(result){
				approveStatusId=result.data[0].approveStatusId;
				if(approveStatusId==2){
					$('#J_auditItem').show();
				}
				$("#J_receipttaTable tbody").empty();
					for(var j=0;j<result.data.length;j++){
						src+='<tr>'
									src+='<td>'+result.data[j].receiptCode+'</td>'
									src+='<td>'+result.data[j].collectionSourceStr+'</td>'
							 		src+='<td>'+(result.data[j].contractCode || '-')+'</td>'
							 		if(typeof(result.data[j].clientId)=="undefined"){
							 			src+='<td>-</td>'
							 		}else{
							 			src+='<td>'+result.data[j].clientId+'</td>'
							 		}
							 		/*+'<td>'+result.data[j].clientId+'</td>'*/
									src+='<td>'+result.data[j].fundName+'</td>'
									src+='<td>'+result.data[j].amount+'</td>'
							 		src+='<td>'+result.data[j].payerStr+'</td>'
							 		src+='<td>'+result.data[j].payerName+'</td>'
							 		if(result.data[j].createByStr==undefined){
							 			src+='<td>-</td>'
							 		}else{
							 			src+='<td>'+result.data[j].createByStr+'</td>'
							 		}
									if(result.data[j].createTime==undefined){
							 			src+='<td>-</td>'
							 		}else{
							 			src+='<td>'+result.data[j].createTime+'</td>'
							 		}
							 		if(result.data[j].printTime==undefined){
							 			src+='<td>-</td>'
							 		}else{
							 			src+='<td>'+result.data[j].printTime+'</td>'
							 		}
							 		if(result.data[j].recycleStatusStr==undefined){
							 			src+='<td>-</td>'
							 		}else{
							 			src+='<td>'+result.data[j].recycleStatusStr+'</td>'
							 		}
							 		if(result.data[j].invoiceCode==undefined){
							 			src+='<td>-</td>'
							 		}else{
							 			src+='<td>'+result.data[j].invoiceCode+'</td>'
							 		}
							 		if($('#quanxian').length>0){
							 			src+='<td><a type=\"print\" id="print" class=\"btn btn-outline btn-success btn-xs\" data-receiptId="'+result.data[j].receiptId+'" data-receiptCode="'+result.data[j].receiptCode+'">打 印</a></td>'
							 		}else{
							 			src+='<td>-</td>';
							 		}
									
								src+='</tr>'
					}
				$("#J_receipttaTable tbody").append(src);
			}
			
	);
	
}
function createPrinter () {
    var toolsId = 'jatoolsPrinter';
    if (!document.getElementById(toolsId)) {
        document.head.insertAdjacentHTML('afterBegin', '<object id="jatoolsPrinter" ' +
            'classid="CLSID:B43D3361-D075-4BE2-87FE-057188254255" ' +
            'codebase="jatoolsPrinter.cab#version=5,7,0,0"></object>');
    }
    return document.getElementById(toolsId);
}

$(function(){
	$('#J_receipttaTable').delegate('a','click',function(event){
		if(this.type=='print'){
			var receiptId=$(this).attr('data-receiptId');
			var receiptCode=$(this).attr('data-receiptCode')
			jsonGetAjax(
				basePath + '/finance/receipt/checktimes',{
					"receiptId":receiptId,
				},function(result){
					layer.open({
				         title: '打印浏览',
				         type: 2,
				         content:basePath+'/finance/receipt/print.htm?receiptId='+receiptId+'',
				         area: ['90%', '90%'],
				         btn:['打印','取消'],
				         yes: function(index,layero){
				        	/* var body = layer.getChildFrame('body', index);
				             var myDoc = {
				                 documents: body.html(),   
				                 copyrights:'杰创软件拥有版权  www.jatools.com'  // 版权声明,必须   
				             }; 
				             jatoolsPrinter.print(myDoc);  // 直接打印
				             
		*/		             
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
	})
})

/*审批历史*/
function approver(){
	var approverStr;
	jsonGetAjax(
			basePath + '/finance/collect/auditLogList',{
				"sourceId":batchId,
			},function(result){
				$("#J_approvetaTable tbody").empty();
				for(var i=0;i<result.data.length;i++){
					approverStr+='<tr>'
						approverStr+='<td>'+(i+1)+'</td>'
						approverStr+='<td>'+result.data[i].sourceId+'</td>'
						approverStr+='<td>'+result.data[i].createByName+'</td>'
						approverStr+='<td>'+result.data[i].createByPositionName+'</td>'
						approverStr+='<td>'+result.data[i].createTime+'</td>'
					 		if(result.data[i].auditOpinion==undefined){
					 			approverStr+='<td>-</td>'
					 		}else{
					 			approverStr+='<td>'+result.data[i].auditOpinion+'</td>'
					 		}
					 		if(result.data[i].auditContent==undefined){
					 			approverStr+='<td>-</td>'
					 		}else{
					 			approverStr+='<td>'+result.data[i].auditContent+'</td>'
					 		}
					 		/*+'<td>'+result.data[i].statusDesc+'</td>'*/
					 		if(result.data[i].memo==undefined){
					 			approverStr+='<td>-</td>'
					 		}else{
					 			approverStr+='<td>'+result.data[i].memo+'</td>'
					 		}
					 	approverStr+='</tr>'
				 }
				$("#J_approvetaTable tbody").append(approverStr);
				
			}
	);
}

$(document).delegate('#J_approve','click',function(event){
	commonContainer.confirm(
		'请确认是否审批？',
		function(index, layero){
			jsonAjax(
				basePath + '/finance/collect/collectBatchAudit',{
					"batchId" : batchId,
					"auditStatus":3
				},
				function(){
					layer.msg("操作成功");
					window.location.reload();
				}
			)
		}
	);
})
$(document).delegate('#J_reject','click',function(event){
	commonContainer.confirm(
		'请确认是否拒绝？',
		function(index, layero){
			jsonAjax(
				basePath + '/finance/collect/collectBatchAudit',{
					"batchId" : batchId,
					"auditStatus":5
				},
				function(){
					layer.msg("操作成功");
					window.location.reload();
				}
			)
		}
	);
})
