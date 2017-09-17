//付款单管理-出纳
$(function(){
	payCashierView.init();
});
var payCashierView={
	init:function(){
		//初始select下拉框
		$('select').chosen({
			width:'100%'
		});
		//付款方式
		dimContainer.buildDimChosenSelector($('#refundPayType'),'refundPayType','');
		//付款状态
		dimContainer.buildDimChosenSelector($('#payStatus'),'paymentPayStatus','');
		//审核状态
		dimContainer.buildDimChosenSelector($('#auditStatus'),'paymentAuditStatus','');
		//创建查询日期
		this.queryDate();
		//点击查询
		$('#payQueryBtn').off().on('click',this.queryResList);
		//导出Excel
		$('#exportExcBtn').off().on('click',this.exportExcel);
		// 显示部门树状结构
		$('#J_deptSelect').on('click', function() {
			showDeptTree($('#J_deptName'), $('#J_deptLevel'));
		});
		//清空所属部门
		$('#J_reset').on('click',function(){
			 $('#J_deptName').attr('data-id','');			//所属部门id
		});
		//确认付款
		$('#surePayBtn').off().on('click',this.surePay.bind(this));
		//打印付款单
		$('#printPayment').off().on('click',this.printPayment);
	},
	//查询日期
	queryDate:function(){
		//应付日期
		var yfBeginDate={
			elem:'#paymentstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	yfEndDate.min=datas;
		    	yfEndDate.start=datas;
		    }
		};
		var yfEndDate={
			elem:'#paymentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	yfBeginDate.max=datas;
		    }
	    }
		laydate(yfBeginDate);
		laydate(yfEndDate);
		//实付日期
		var sfBeginDate={
			elem:'#shifumentstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	sfEndDate.min=datas;
		    	sfEndDate.start=datas;
		    }
		};
		var sfEndDate={
			elem:'#shifumentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	sfBeginDate.max=datas;
		    }
	    }
		laydate(sfBeginDate);
		laydate(sfEndDate);
	},
	//查询结果列表
	queryResList:function(){
		$('#paymentList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/payment/selectPaymentListByCashier.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			singleSelect:false,		// true:单选，false：多选
			clickToSelect:false,		//点击选中行
			striped:true,
			pageSize:10,
			pageList:[10, 20, 50],
			queryParams: function (params) {
				var data=$('#queryCriteria').serializeObject();
				data.deptId = $('#J_deptName').attr('data-id');
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
			    	align:'center',
//			    	formatter:function(value,row){
//						return {
//		    				disabled:row.payStatus==2?'disabled':''			//设置是否可用 (付款成功不可用)
//		    			};
//					}
	         	},
				{
					field : 'strPaymentType',
					title : '业务来源',
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
					field : 'deptName',
					title : '所属部门',
					align : 'center'
				},
				{
					field : 'strPayStatus',
					title : '付款状态',
					align : 'center'
				},
				{
					field : 'strPayType',
					title : '付款方式',
					align : 'center'
				},
				{
					field : 'payAmount',
					title : '应付金额<br />应付日期',
					align : 'center',
					formatter:function(value,row){
						return value+'<br />'+row.payTime;
					}
				},
				{
					field : 'realPayAmount',
					title : '实付金额<br />实付日期',
					align : 'center',
					formatter:function(value,row){
						return (value==undefined?'-':value)+'<br />'+(row.realPayTime==undefined?'-':row.realPayTime);
					}
				},
				{
					field : 'strAuditStatus',
					title : '审核状态',
					align : 'center'
				},
				{
					field : 'lastAuditUserName',
					title : '最后审核人<br />最后审核时间',
					align : 'center',
					formatter:function(value,row){
						return (value==undefined?'-':value)+'<br />'+(row.lastAuditTime==undefined?'-':row.lastAuditTime);
					}
				}
			]
		});
	},
	//确认付款
	surePay:function(){
		var _this=this;
		var getSurdata=$('#paymentList').bootstrapTable('getSelections');
		if(getSurdata.length>0 && getSurdata[0].paymentId!==undefined){
			commonContainer.modal('确认付款',$('#paySure'),function(i){
				layer.close(i);
				var paymentIdArr=[];
				$.each(getSurdata,function(j,m){
					paymentIdArr.push(m.paymentId);
				});
				jsonPostAjax(basePath+'/finance/payment/confirmPaidByCashier.htm',{	
					payStatus:$('#payeeType').val(),	//付款状态
					paymentIds:paymentIdArr				//付款单ID
				},function(){
					//commonContainer.alert('付款成功');
					_this.queryResList();
				});
			},{
				area:['450px'],
				btns:['确定','取消']
			});
		}else{
			commonContainer.alert('请选择付款单');
		}
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
			window.open(basePath+'/finance/payment/tellerExport.htm?paymentIds='+paymentIds);
		}else{
			commonContainer.alert('请选择付款单');
		}
	},
	//打印付款单
	printPayment:function(){
		var getSel=$('#paymentList').bootstrapTable('getSelections');	//获取选中的数据
		if(getSel.length>0 && getSel[0].paymentId!==undefined){
			var templateUrl=basePath+'/finance/payment/printinfo.htm?paymentId='+getSel[0].paymentId;
//			if(data.data.fundName=='反信息费'){
//				templateUrl+='&backCost=1'
//			}
			window.open(templateUrl);
		}else{
			commonContainer.alert('请选择付款单');
		}
	}
}