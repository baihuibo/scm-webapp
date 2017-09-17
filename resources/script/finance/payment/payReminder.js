//付款提醒（非现金）
$(function(){
	payReminderView.init();
});
var payReminderView={
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
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#paymentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
	},
	//查询结果列表
	queryResList:function(){
		$('#paymentList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/payment/selectNonCashRemindList.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			singleSelect:true,		//设置单选
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
					field : 'strType',
					title : '付款导表类型',
					align : 'center'
				},
				{
					field : 'payTime',
					title : '应付款日期',
					align : 'center'
				},
				{
					field : 'payAmount',
					title : '付款总金额',
					align : 'center'
				},
				{
					field : 'payCount',
					title : '付款笔数',
					align : 'center'
				},
				{
					field : 'payCount',
					title : '操作',
					align : 'center',
					formatter:function(value,row){
						return '<button type="button" class="btn btn-outline btn-success btn-xs mt-3" onclick="payReminderView.seePayForm('+row.batchId+')">查看付款单</button>';
					}
				}
			]
		});
	},
	//导出EXCEL
	exportExcel:function(){
		var getSelections=$('#paymentList').bootstrapTable('getSelections');	//获取选中的数据
		if(getSelections.length>0 && getSelections[0].batchId!==undefined){
			window.open(basePath+'/finance/payment/noCashExport.htm?batchId='+getSelections[0].batchId);
		}else{
			commonContainer.alert('请选择付款单');
		}
	},
	//查看付款单
	seePayForm:function(batchid){
		var _this=this;
		commonContainer.modal('付款单列表',$('#seePaydan'),function(i){
		},{
			btns:[],
			area:['80%', '60%'],
			overflow :true,
			success:function(){
				$('#seePaydan form')[0].reset();
				var tabHtml='\
					<table id="seePayList" class="table table-hover table-striped table-bordered">\
						<thead>\
							<tr>\
								<th data-field="">\
									<div class="th-inner">序号</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">付款单编号</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">付款导表类型</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">应付款日期</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">合同编号</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">付款方式</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">收款人</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">金额</div>\
								</th>\
							</tr>\
						</thead>\
					</table>';
				$('#tabCont').html(tabHtml);
				$('#seePaydanBtn').off().on('click',_this.seePayFormList.bind(this,batchid));
			}
		});
	},
	//查看付款单列表
	seePayFormList:function(batchid){
		$('#seePayList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/payment/selectNonCashPaymentList.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			striped:true,
			pageSize:10,
			pageList:[10, 20, 50],
			queryParams: function (params) {
				var data=$('#seePayquery').serializeObject();
				data.batchId=batchid;
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
			    	title :'序号',
			    	align:'center',
			    	formatter:function(value,row,index){
						return ++index;
					}
	         	},
				{
					field : 'paymentNumber',
					title : '付款单编号',
					align : 'center',
					formatter:function(value,row){
						return '<a href="'+basePath+'/finance/payment/detail.htm?paymentId='+row.paymentId+'" target="_blank">'+value+'</a>'
					}
				},
				{
					field : 'strType',
					title : '付款导表类型',
					align : 'center'
				},
				{
					field : 'payTime',
					title : '应付款日期',
					align : 'center'
				},
				{
					field : 'contractNumber',
					title : '合同编号',
					align : 'center',
					formatter:function(value,row){
						var contractUrl='/sign/detail/detail.html?conid='+row.conId+'&formal=true&other=true';
						if(row.businessType==2){
							contractUrl='/sign/signthecontract/contractdetail.html?conid='+row.conId+'&other=true';		//买卖
						}
						return '<a href="'+basePath+contractUrl+'" target="_blank">'+value+'</a>';
					}
				},
				{
					field : 'strPayType',
					title : '付款方式',
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
				}
			]
		});
	}
}