$(function(){
	//var str;
	var returnBatchId = getQueryString('returnBatchId');
	jsonGetAjax(basePath + '/finance/collect/selectReceiptListByReturnBatchId.htm',{
		"returnBatchId":returnBatchId,	//回收申请编号
	},function(result){
		$('#J_dataTable').bootstrapTable('destroy').bootstrapTable({
			data:result.data,
			columns:[
				{
					field : 'receiptCode',
					title : '收据编号',
					align : 'center'
				},
				{
					field : 'contractCode',
					title : '合同编号',
					align : 'center'
				},
				{
					field : 'fundName',
					title : '款项',
					align : 'center'
				},
				{
					field : 'amount',
					title : '金额',
					align : 'center'
				},
				{
					field : 'recycleStatusStr',
					title : '回收状态',
					align : 'center'
				},
				{
					field : 'payerName',
					title : '付款单位/个人',
					align : 'center'
				},
				{
					field : 'createTime',
					title : '录入日期',
					align : 'center'
				},
				{
					field : 'approveStatus',
					title : '审批状态',
					align : 'center'
				},
				{
					field : 'printCount',
					title : '打印张数',
					align : 'center'
				},
				{
					field : 'recycleCount',
					title : '回收张数',
					align : 'center'
				},
				{
					field : 'differentReason',
					title : '差异原因',
					align : 'center'
				}
			]
		});
		//获取审批状态
		jsonGetAjax(basePath+'/finance/collect/selectReceiptReturnBybatchId.htm',{
			batchId:returnBatchId
		},function(rdata){
			
//			rdata.data.status			同意       		 拒绝
//			1待店助审批         					  2         4        
//			2待财务审批       					  3         5
//			3财务审批            					 禁用按钮
//			4店助审批不通过     				禁用按钮
//			5财务审批不通过       				禁用按钮
			var auditStatus='';
			var noPass='';
			if(rdata.data.status==1){
				auditStatus=2;
				noPass=4;
			}else if(rdata.data.status==2){
				auditStatus=3;
				noPass=5;
			}
			if(auditStatus!==''){
				var lock=false;		//防止重复提交
				$('#operationBtns button').removeClass('disabled').on('click',function(){
					if(lock){
						return false;
					}else{
						lock=true;
					}
					jsonGetAjax(basePath+'/finance/collect/receiptReturnAudit.htm',{
						returnBatchId:returnBatchId,											//回收批次id
						auditStatus:$(this).data('type')==1?auditStatus:noPass,					//审批状态:2店助同意,4店助拒绝,3财务同意,5财务拒绝
						auditContent:''															//审批意见
					},function(){
						layer.msg('操作成功',{time:500}, function(){
							location.reload();
						});
					},{
						completeCallBack:function(){
							lock=false;
						}
					});
				});
			}
		});
	});
});
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}