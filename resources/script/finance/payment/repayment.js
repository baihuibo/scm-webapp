//付款失败后重新付款
$(function(){
	repaymentView.init();
});
var repaymentView={
	init:function(){
		//初始select下拉框
		$('select').chosen({
			width:'100%'
		});
		//付款导表类型
		dimContainer.buildDimChosenSelector($('#guidetableType'),'paymentBatchType','');
		//创建查询日期
		this.queryDate();
		//点击查询
		$('#payQueryBtn').off().on('click',this.queryResList);
		//导出Excel
		$('#exportExcBtn').off().on('click',this.exportExcel);
	},
	//查询日期
	queryDate:function(){
		var seeBeginDate={
			elem:'#paymentstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
//		    choose:function(datas){
//		    	seeEndDate.min=datas;
//		    	seeEndDate.start=datas;
//		    }
		};
		var seeEndDate={
			elem:'#paymentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
//		    choose:function(datas){
//		    	seeBeginDate.max=datas;
//		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
	},
	//查询结果列表
	queryResList:function(){
		$('#paymentList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/payment/selectRepayList.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			singleSelect:false,		// true:单选，false：多选
			clickToSelect:true,		//点击选中行
			striped:true,
			pageSize:10,
			pageList:[10, 20, 50],
			queryParams: function (params) {
				var data=$('#queryCriteria').serializeObject();
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
					field : 'batchNumber',
					title : '原付款批次',
					align : 'center'
				},
				{
					field : 'paymentNumber',
					title : '付款单编号',
					align : 'center',
					formatter:function(value,row){
						return '<a href="'+basePath+'/finance/payment/detail.htm?paymentId='+row.paymentId+'" target="_blank">'+value+'</a>';
					}
				},
				{
					field : 'strType',
					title : '付款导表类型',
					align : 'center'
				},
				{
					field : 'contractNumber',
					title : '合同编号',
					align : 'center'
				},
				{
					field : 'receiverName',
					title : '收款人',
					align : 'center'
				},
				{
					field : 'payAmount',
					title : '金额',
					align : 'center'
				},
				{
					field : 'payTime',
					title : '应付款日期',
					align : 'center'
				},
				{
					field : 'firstPayTime',
					title : '上次应付款日期',
					align : 'center'
				}
			]
		});
	},
	//导出EXCEL(多选)
	exportExcel:function(){
		var getSelections=$('#paymentList').bootstrapTable('getSelections');	//获取选中的数据
		if(getSelections.length>0 && getSelections[0].paymentId!==undefined){
			var paymentIds='';	//付款单编号
			$.each(getSelections,function(i,n){
				if(i==(getSelections.length-1)){
					paymentIds+=n.paymentId;
				}else{
					paymentIds+=n.paymentId+',';
				}
			});
			window.open(basePath+'/finance/payment/failedExport.htm?paymentIds='+paymentIds);
		}else{
			commonContainer.alert('请选择付款单');
		}
	}
}