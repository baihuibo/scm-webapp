//付款失败管理页面-经纪人/财务
$(function(){
	payCailedView.init();
});
var payCailedView={
	init:function(){
		//初始select下拉框
		$('select').chosen({
			width:'100%', no_results_text: "未找到此选项!"
		});
		//申请人
		searchContainer.searchUserListByComp($("#J_applyUserId"), true, 'right');
		//款项
		var options='';
		jsonGetAjax(basePath +'/finance/common/getFinanceFundList.htm',{},function(result) {
    		$.each(result.data, function(n, value) {
    	    	options+='<option value="' + value.fundCode +'">' + value.fundName + '</option>';
    	    });
    	    $('#fundCode').append(options);
    		$('#fundCode').trigger('chosen:updated');
		});
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
			 $('#J_applyUserId').attr('data-id','');
		})
		//修改
		$('#modifyBtn').off().on('click',this.operation.bind(this));
		//审批
		//$('#examinBtn').off().on('click',this.operation.bind(this,1));
	},
	//查询日期
	queryDate:function(){
		//申请时间
		var seeBeginDate={
			elem:'#sqmentstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#sqmentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
		//应付日期
		var seeBeginDate1={
			elem:'#paymentstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate1.min=datas;
		    	seeEndDate1.start=datas;
		    }
		};
		var seeEndDate1={
			elem:'#paymentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate1.max=datas;
		    }
	    }
		laydate(seeBeginDate1);
		laydate(seeEndDate1);
		//实付日期
		var seeBeginDate2={
			elem:'#shifumentstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate2.min=datas;
		    	seeEndDate2.start=datas;
		    }
		};
		var seeEndDate2={
			elem:'#shifumentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate2.max=datas;
		    }
	    }
		laydate(seeBeginDate2);
		laydate(seeEndDate2);
		//审核日期
		var seeBeginDate3={
				elem:'#shenhmentstarttime',
			    format:'YYYY-MM-DD',
			    istime:false,
			    choose:function(datas){
			    	seeEndDate3.min=datas;
			    	seeEndDate3.start=datas;
			    }
			};
			var seeEndDate3={
				elem:'#shenhmentendtime',
			    format:'YYYY-MM-DD',
			    istime:false,
			    choose:function(datas){
			    	seeBeginDate3.max=datas;
			    }
		    }
			laydate(seeBeginDate3);
			laydate(seeEndDate3);
	},
	//查询结果列表
	queryResList:function(){
		$('#paymentList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/payment/selectPayFailedPaymentList.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			singleSelect:true,			// true:单选，false：多选
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
			    	formatter:function(value,row){
						return {
		    				disabled:row.payStatus==2?'disabled':''			//设置是否可用 (付款成功不可用)
		    			};
					}
	         	},
				{
					field : 'strPaymentType',
					title : '业务来源',
					align : 'center'
				},
				{
					field : 'strIsFromChargeBack',
					title : '来源退单',
					align : 'center'
				},
				{
					field : 'paymentNumber',
					title : '付款单编号',
					align : 'center',
					formatter:function(value,row){
						return '<a href="'+basePath+'/finance/payment/detail.htm?paymentId='+row.paymentId+'" class="text-nowrap" target="_blank">'+value+'</a>';
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
					field : 'fundName',
					title : '款项',
					align : 'center'
				},
				{
					field : 'payAmount',
					title : '应付（转）金额<br />应付日期',
					align : 'center',
					formatter:function(value,row){
						return value+'<br />'+row.payTime;
					}
				},
				{
					field : 'payFailedReason',
					title : '失败原因',
					align : 'center'
				},
				{
					field : 'uploadTime',
					title : '退回时间',
					align : 'center'
				},
				{
					field : 'realPayTime',
					title : '付款成功时间',
					align : 'center'
				}
			]
		});
	},
	//操作 type默认修改，1为审批
	operation:function(type){
		var _this=this;
		var getSurdata=$('#paymentList').bootstrapTable('getSelections');
		if(getSurdata.length>0 && getSurdata[0].paymentId!==undefined){
			if(type==1){
				//创建审批工作流
//				jsonPostAjax(basePath+'/workflow/doJob?modelName=FINANCE_PAYMENT&methodName=createWorkflow',{
//				    formId:getSurdata[0].paymentId	//付款单编号
//				},function(){
//					commonContainer.alert('提交成功');
//					_this.queryResList();
//				});
			}else{
				var openPath=basePath+'/finance/payment/modify.htm?paymentId='+getSurdata[0].paymentId;
				window.open(openPath);
			}
		}else{
			commonContainer.alert('请选择付款单');
		}
	}
}