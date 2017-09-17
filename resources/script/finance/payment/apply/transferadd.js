var dataresultdata=null;
var receiptList=[];	//回传收据信息
var attInfoList = [];    //回传附件信息
var paymentinfolist=[];  //回传新增信息
var index=0;
var categoryNametype='';
var remarkval='';

var contractid=getQueryString("contractNo");
var chargebackId=getQueryString("chargebackid");
var chargebackNumber=getQueryString("chargebacknumber");
var selectionId=getQueryString("selection");
var businessTypeNum='';

$(function() {
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	
	$('#J_Choosecontract').val('1');
	$('#J_Choosecontract').trigger("chosen:updated");
	$('#J_reset').on('click',function(){
		commonContainer.closeWindow();
	})
	if(contractid){ // 合同退单跳转		
		addChargebackView.getContractAndReceiptInfo(contractid);
		addChargebackView.init();

		$('#J_selectContract').hide();
		$('#J_iboxpay').hide();
		$('#J_annex').hide();
		$('#J_paymentbutton').text('保存');
	}else{// 财务跳转	
		Inquire();
		$('#J_annex').show();
		if($('#J_Choosecontract').val() == '1'){ // 合同跳转	
			$('#addContractNum').show();
			$('#addclientNum').hide();
			$('#addContractNumbernews').val('');
			$('#J_applyadd').val('');
			addChargebackView.init();
		}else{// 客服跳转跳转		
			$('#addclientNum').show();
			$('#addContractNum').hide();
			$('#addContractNumbernews').val('');
			$('#J_applyadd').val('');
			addChargeclientView.init();
		}
		
		$('#J_Choosecontract').on('input change',function(){
			var contractNum = $(this).val();
			if(contractNum=='1'){
				$('#J_iboxpay').hide();
				$('#addContractNum').show();
				$('#addclientNum').hide();
				$('#addContractNumber').val('');
				$('#addContractNumbernews').val('');
				$('#J_applyadd').val('');
				$('#J_Attachmentupload_dataTable tbody').html('');
				addChargebackView.init();
			}else{
				$('#J_iboxpay_finance').hide();
				$('#addclientNum').show();
				$('#addContractNum').hide();
				$('#addclientNumber').val('');
				$('#addContractNumbernews').val('');
				$('#J_applyadd').val('');
				$('#J_Attachmentupload_dataTable tbody').html('');
				addChargeclientView.init();
			}
		})
	}
	
	//点击取消按钮出发事件
	$('#J_reset').on('click',function(){
		window.location.href=basePath + '/finance/payment/apply/transfer/add.htm';
	})
});


var Paymentmoeny = '';
var enclosureList=[];

var addChargebackView={
	init:function(){
		var _this=this;
		//初始select下拉框
		$("select").chosen({
			width : "100%" , no_results_text: "未找到此选项!" 
		});
		//业务类型
		dimContainer.buildDimChosenSelector($('#J_businesstype'),'businessType','');
		//业务类型
		dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
		_this.choiceContract();
		_this.contractList();
		_this.getAddContract();
		_this.choiceContractnews();
		_this.contractListnews();
		_this.getAddContractnews();
	},
	//选择合同
	choiceContract:function(){
		var _this=this;
		var isInit=true;
		$('#addContractNum').off().on('click',function(){
			var contractNumsun=$('#addContractNum > div');
			if(contractNumsun.length>1){
				contractNumsun.eq(1).hide();
			}
			commonContainer.modal('选择合同',$('#choiceHetong'),function(i){
				_this.getAddContract(i);
				$('#J_businesstype').val('');
				$('#J_businesstype').trigger('chosen:updated');
				var htmlnum=0.00;
				$('#J_paymentmoeny').html(htmlnum);
			},{
				area:['80%','70%'],
				btns:['确定','取消'],
				overflow :true,
				success:function(){
					$('#J_businesstype').val('');
					$('#J_businesstype').trigger('chosen:updated');
					if(isInit){
						$('#J_searchcontract').off().on('click',_this.contractList);
						$('#J_reset').on('click',function(){
							$('#J_deptName').attr('data-id','');			//重置所属部门id
						});
						//所属部门
						$('#J_deptSelect').off().on('click', function() {
							showDeptTree($('#J_deptName'), $('#J_deptLevel'));
						});
						isInit=false;
					}
					//重置表单
					$('#J_contractQuery')[0].reset();
					$('#J_deptName').attr('data-id','');
					//创建表格表头
					var tabHtml='\
						<table id="contractList" class="table table-hover table-striped table-bordered">\
							<thead>\
								<tr>\
									<th data-field="">\
										<div class="th-inner">合同类型</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">合同编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">房源编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">客户编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">业主名称</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">客户名称</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">录入日期</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">成交人</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">所属部门</div>\
									</th>\
								</tr>\
							</thead>\
						</table>';
					$('#hetConten').html(tabHtml);
				}
			});
		});
	},
	
	//选择新转入合同
	choiceContractnews:function(){
		var _this=this;
		var isInit=true;
		$('#addContractNumnews').off().on('click',function(){
			//判断是否选中收据信息
			var checklength = $("#J_refunds_dataTable input[name='btSelectItem']:checked").length;
			if(checklength==0){
				layer.alert("请选择收据信息");
				return false;
			}
			var contractNumsun=$('#addContractNumnews > div');
			if(contractNumsun.length>1){
				contractNumsun.eq(1).hide();
			}
			commonContainer.modal('选择合同',$('#choiceHetongnews'),function(i){
				_this.getAddContractnews(i);
				$('#businesstype').val('');
				$('#businesstype').trigger('chosen:updated');
				var refundAddDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
				if(refundAddDataArr.length==0){
					layer.alert("没有选中合同数据，请选择");	
					return false;
				}
			},{
				area:['80%','70%'],
				btns:['确定','取消'],
				overflow :true,
				success:function(){
					$('#businesstype').val('');
					$('#businesstype').trigger('chosen:updated');
					if(isInit){
						$('#J_searchcontractnews').off().on('click',_this.contractListnews);
						$('#J_reset').on('click',function(){
							$('#J_deptName').attr('data-id','');			//重置所属部门id
						});
						//所属部门
						$('#J_deptSelect').off().on('click', function() {
							showDeptTree($('#J_deptName'), $('#J_deptLevel'));
						});
						isInit=false;
					}
					//重置表单
					$('#J_contractQuerynews')[0].reset();
					$('#J_deptName').attr('data-id','');
					//创建表格表头
					var tabHtml='\
						<table id="contractList_news" class="table table-hover table-striped table-bordered">\
							<thead>\
								<tr>\
									<th data-field="">\
										<div class="th-inner">合同类型</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">合同编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">房源编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">客户编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">业主名称</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">客户名称</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">录入日期</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">成交人</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">所属部门</div>\
									</th>\
								</tr>\
							</thead>\
						</table>';
					$('#hetContennews').html(tabHtml);
				}
			});
		});
	},
	
	//查询合同列表
	contractList:function(){
		$('#contractList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/choose/paymentContract',
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
				var data=$('#J_contractQuery').serializeObject();
				var deptId=$('#J_deptName').attr('data-id');
				if(deptId!==''){
					data.dept_id=deptId;		//所属部门id
				}
				var listbusinessType=$('#J_businesstype').val();
				if(listbusinessType!==''){
					data.businessType=listbusinessType;		//合同类型
				}
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
					field : 'strBusinessType',
					title : '合同类型',
					align : 'center'
				},
				{
					field : 'contractNumber',
					title : '合同编号',
					align : 'center'
				},
				{
					field : 'houseId',
					title : '房源编号',
					align : 'center'
				},
				{
					field : 'clientId',
					title : '客户编号',
					align : 'center'
				},
				{
					field : 'ownerName',
					title : '业主名称',
					align : 'center'
				},
				{
					field : 'clientName',
					title : '客户名称',
					align : 'center'
				},
				{
					field : 'createTime',
					title : '录入日期',
					align : 'center'
				},
				{
					field : 'trancedByName',
					title : '成交人',
					align : 'center'
				},
				{
					field : 'deptName',
					title : '所属部门',
					align : 'center'
				}
			]
		});
	},
	
	//查询新转入合同列表
	contractListnews:function(){
		$('#contractList_news').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/choose/paymentContract',
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
				var data=$('#J_contractQuerynews').serializeObject();
				var deptId=$('#J_deptName').attr('data-id');
				if(deptId!==''){
					data.dept_id=deptId;		//所属部门id
				}
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
					field : 'strBusinessType',
					title : '合同类型',
					align : 'center'
				},
				{
					field : 'contractNumber',
					title : '合同编号',
					align : 'center'
				},
				{
					field : 'houseId',
					title : '房源编号',
					align : 'center'
				},
				{
					field : 'clientId',
					title : '客户编号',
					align : 'center'
				},
				{
					field : 'ownerName',
					title : '业主名称',
					align : 'center'
				},
				{
					field : 'clientName',
					title : '客户名称',
					align : 'center'
				},
				{
					field : 'createTime',
					title : '录入日期',
					align : 'center'
				},
				{
					field : 'trancedByName',
					title : '成交人',
					align : 'center'
				},
				{
					field : 'deptName',
					title : '所属部门',
					align : 'center'
				}
			]
		});
	},
	
	
	//获取新增合同详情
	getAddContract:function(i){
		$('select').chosen({
			width:'100%'
		});
		var _this=this;
		var checkrowDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
		if(checkrowDataArr.length>0 && checkrowDataArr[0].contractId!==undefined){
			layer.close(i);
			_this.getContractAndReceiptInfo(checkrowDataArr[0].contractId);
		}	
	},
	
	// 获取合同信息&收据列表
	getContractAndReceiptInfo : function(contractId) {
		jsonGetAjax(basePath+'/finance/choose/info',{
			contractId:contractId		//合同主键id
		},function(result){
			contractId = result.data.contractId;
			//回显新增合同信息
			$('#J_iboxpay_finance').show();
			$('#addContractNumber').val(result.data.contractNumber);	
			$('#J_Contract_h').text(result.data.contractNumber?result.data.contractNumber:'-');
			$('#J_typecontract_h').text(result.data.strBusinessType?result.data.strBusinessType:'-');
			$('#J_diaplaynone').text(result.data.businessType?result.data.businessType:'-');
			$('#J_houseId_h').text(result.data.houseId?result.data.houseId:'-');
			$('#J_clientId_h').text(result.data.clientId?result.data.clientId:'-');
			$('#J_ownerName_h').text(result.data.ownerName?result.data.ownerName:'-');
			$('#J_clientName_h').text(result.data.clientName?result.data.clientName:'-');
			businessTypeNum = result.data.businessType
			
			//加载收据列表数据项
			var parmData = jQuery('#J_query').serializeObject();
			parmData.contractId = result.data.contractId;
			parmData.paymentType = 3;
			jsonPostAjax(basePath+'/finance/payment/apply/getRefundReceiptList',parmData,function(dataresult){
				dataresultdata = dataresult.data;
				$('#J_refunds_dataTable').bootstrapTable('destroy');
				if(dataresultdata.length>0){
					$('#J_refunds_dataTable').bootstrapTable({
						data:dataresultdata,
						columns:[
					        {field: 'flyid',title :'序号',checkbox:true, align: 'center',
				           		formatter: function(value, row, index){	
				           			var html='';
				           			html='<input type="hidden" id="J_auditId" data-receiptId="'+row.receiptId+'" data-fundName="'+row.fundName+'" data-fundCode="'+row.fundCode+'" class="cbx" name="category" data-receiptNumber="'+row.receiptNumber+'" contract="'+row.receiptId+'">';
				           			return html;
				           		}
				           	},
				           	{field: 'batchId', title: '收款批次号', align: 'center',
				           		formatter: function(value, row, index) {	
				      				var html = '';
				      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
				      				html = '<a class="paymentbatchId" href="'+url+'" target="_blank">'+ row.batchId +'</a>';
				      				return html;
				      	    	}
				      	    },
				      	    {field: 'receiptNumber', title: '收据编号', align: 'center',
				      	    	formatter: function(value, row, index) {	
				      				var html = '';
				      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
				      				html = '<a class="per" href="'+url+'" target="_blank">'+ row.receiptNumber +'</a>';
				      				return html;
				      	    	}
				      	    },
				      	    {field: 'strPayer', title: '付款方', align: 'center'},
				      	    {field: 'strPayee', title : '收款单位', align : 'center'},
				      	    {field: 'fundName', title: '款项', align: 'center'},
				      	    {field: 'amount', title: '收据金额', align: 'center',
				      	    	formatter: function(value, row, index){	
				           			var html='';
				           			var amount = value ? value : '-';
				           			html='<span class="per">'+amount+'</span>';
				           			return html;
				           		}
				      	    },
				      	    {field: 'refundAmount', title: '转款金额', align: 'center',
				      	    	formatter: function(value, row, index){	
				           			var html='';
				           			var refundAmount = value ? value : '-';
				           			html='<input type="text" id="zhuan'+index+'" class="form-control input_return zhuankuan" name="" readonly value="" placeholder="0.00">';
				           			return html;
				           		}
				      	    },
				      	    {field: 'invoiceNumbers', title: '发票编号', align: 'center'},
					      	{field: 'printCount', title: '收据打印张数', align: 'center'},
					      	{field: 'recycleCount', title: '收据回收张数', align: 'center',
					      		formatter: function(value, row, index){
					      			if(row.invoiceNumbers){
					      				var html='';
					           			var returnCount = value ? value : '-';
					           			html='<span>'+returnCount+'</span>';
					           			return html;
					      			}else{
					      				var html='';
					           			html='<input type="text" id="'+index+'" class="form-control input_return" name="" readonly value="">';
					           			return html;
					      			}
				           			
				           		}
					      	},
					      	{field: 'differentReason', title: '回收差异原因', align: 'center',
					      		formatter: function(value, row, index){
					      			if(row.invoiceNumbers){
					      				var html='';
					           			var returnDiffReason = value ? value : '-';
					           			html='<span>'+returnDiffReason+'</span>';
					           			return html;
					      			}else{
					      				var html='';
					           			html='<input type="text" id="yin'+index+'" class="form-control input_val" name="" readonly value="">';
					           			return html;
					      			}
				           		}
					      	}
				      	]
					});
					
					var Calculation = '0.00';
					var mun=null;
					var value=null;
					var btSelectItem=$('#J_refunds_dataTable input[name="btSelectItem"]');
					btSelectItem.off().on('click',function(){
						if($(this).is(':checked')){
							$('#'+$(this).data('index')).prop('readonly',false);
							$('#zhuan'+$(this).data('index')).prop('readonly',false);
							$('#yin'+$(this).data('index')).prop('readonly',false);
							if(btSelectItem.length==$('#J_refunds_dataTable input[name="btSelectItem"]:checked').length){
								$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',true);
							}else{
								$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',false);
							}
						}else{
							$('#'+$(this).data('index')).prop('readonly',true);
							$('#zhuan'+$(this).data('index')).prop('readonly',true);
							$('#yin'+$(this).data('index')).prop('readonly',true);
							if($('#zhuan'+$(this).data('index')) != ''){
								mun-=$('#zhuan'+$(this).data('index')).val()*1;
								$('#J_paymentmoeny').html(mun);
								$('#zhuan'+$(this).data('index')).val('');
								$('#yin'+$(this).data('index')).val('');
								$('#'+$(this).data('index')).val('');
							}
						}
					});
					
					//选中行转款金额计算
					$('.zhuankuan').off().on('blur focus',function(e){
						if(e.type=='focus'){
							value=$(this).val()*1;
							mun-=$(this).val()*1;
						}else{
							if(value!==$(this).val()*1){
								mun+=$(this).val()*1;
							}

							$('#J_paymentmoeny').html(mun);
						}
					});
				}
				attachmentView.init(dataresultdata);
			});
		});
	},
	
	//获取转入合同详情
	getAddContractnews:function(i){
		$('select').chosen({
			width:'100%'
		});
		var _this=this;
		var checkrowDataArr=$("#contractList_news").bootstrapTable('getSelections');	//选中的合同数据
		if(checkrowDataArr.length>0 && checkrowDataArr[0].contractId!==undefined){
			layer.close(i);
			//回显新增合同信息
			jsonGetAjax(basePath+'/finance/choose/info',{
				contractId:checkrowDataArr[0].contractId		//合同主键id
			},function(result){
				_this.contractId=result.data.contractId;
				//回显新增合同信息
				$('#addContractNumbernews').val(result.data.contractNumber);
			});
		}	
	}
}

//
var addChargeclientView={
		init:function(){
			var _this=this;
			//初始select下拉框
			$('select').chosen({
				width:'100%'
			});
			
			_this.choiceContract();
			_this.contractList();
			_this.getAddContract();
		},
		//选择客户
		choiceContract:function(){
			var _this=this;
			var isInit=true;
			$('#addclientNum').off().on('click',function(){
				var contractNumsun=$('#addContractNum > div');
				if(contractNumsun.length>1){
					contractNumsun.eq(1).hide();
				}
				commonContainer.modal('选择客户',$('#choicekehu'),function(i){
					_this.getAddContract(i);
					var refundAddDataArr=$("#J_clientList").bootstrapTable('getSelections');	//选中的合同数据
					if(refundAddDataArr.length==0){
						layer.alert("没有选中客户数据，请选择");	
						return false;
					}
				},{
					area:['80%','70%'],
					btns:['确定','取消'],
					overflow :true,
					success:function(){
						if(isInit){
							$('#J_searchclient').off().on('click',_this.contractList);
							$('#J_reset').on('click',function(){
								$('#J_deptName').attr('data-id','');			//重置所属部门id
							});
							//所属部门
							$('#J_deptSelect').off().on('click', function() {
								showDeptTree($('#J_deptName'), $('#J_deptLevel'));
							});
							isInit=false;
						}
						//重置表单
						$('#J_clientQuery')[0].reset();
						$('#J_deptName').attr('data-id','');
						//创建表格表头
						var tabHtml='\
							<table id="J_clientList" class="table table-hover table-striped table-bordered">\
								<thead>\
									<tr>\
										<th data-field="">\
											<div class="th-inner">客户姓名</div>\
										</th>\
										<th data-field="">\
											<div class="th-inner">客户编号</div>\
										</th>\
										<th data-field="">\
											<div class="th-inner">归属人</div>\
										</th>\
										<th data-field="">\
											<div class="th-inner">归属部门</div>\
										</th>\
									</tr>\
								</thead>\
							</table>';
						$('#kehuConten').html(tabHtml);
					}
				});
			});
		},
		//查询客户列表
		contractList:function(){
			$('#J_clientList').bootstrapTable('destroy').bootstrapTable({
				url:basePath+'/finance/choose/paymentClient',
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
					var data=$('#J_clientQuery').serializeObject();
					var deptId=$('#J_deptName').attr('data-id');
					if(deptId!==''){
						data.dept_id=deptId;		//所属部门id
					}
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
						field : 'clinetName',
						title : '客户姓名',
						align : 'center'
					},
					{
						field : 'clientId',
						title : '客户编号',
						align : 'center'
					},
					{
						field : 'belongUserName',
						title : '归属人',
						align : 'center'
					},
					{
						field : 'belongDeptName',
						title : '归属部门',
						align : 'center'
					}
				]
			});
		},
		//获取新增客户详情
		getAddContract:function(i){
			var _this=this;
			var checkrowDataArr=$("#J_clientList").bootstrapTable('getSelections');	//选中的合同数据
			if(checkrowDataArr.length>0 && checkrowDataArr[0].clientId!==undefined){
				layer.close(i);
				//回显新增客户信息
				$('#J_iboxpay').show();
				$('#J_clientId').text(checkrowDataArr[0].clientId);
				$('#J_clientname').text(checkrowDataArr[0].clinetName);
				$('#addContractNumber').val(checkrowDataArr[0].clinetName);
				$('#addclientNumber').val(checkrowDataArr[0].clientId)
				
				//加载收据列表数据项
				var parmData = jQuery('#J_query').serializeObject();
				parmData.clientId = checkrowDataArr[0].clientId;
				parmData.paymentType = 3;
				jsonPostAjax(basePath+'/finance/payment/apply/getRefundReceiptList',parmData,function(dataresult){
					dataresultdata = dataresult.data;
					$('#J_refunds_dataTable').bootstrapTable('destroy');
					if(dataresultdata.length>0){
						$('#J_refunds_dataTable').bootstrapTable({
							data:dataresultdata,
							columns:[
						        {field: 'flyid',title :'序号',checkbox:true, align: 'center',
					           		formatter: function(value, row, index){	
					           			var html='';
					           			html='<input type="hidden" class="cbx" name="category" data-receiptNumber="'+row.receiptNumber+'" contract="'+row.receiptId+'">';
					           			return html;
					           		}
					           	},
					           	{field: 'batchId', title: '收款批次号', align: 'center',
					           		formatter: function(value, row, index) {	
					      				var html = '';
					      				var url = basePath+"/finance/collect/batchDetail.htm?batchId="+row.batchId;
					      				html = '<a class="paymentbatchId" href="'+url+'" target="_blank">'+ row.batchId +'</a>';
					      				return html;
					      	    	}
					      	    },
					      	    {field: 'receiptNumber', title: '收据编号', align: 'center',
					      	    	formatter: function(value, row, index) {	
					      				var html = '';
					      				var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
					      				html = '<a class="per" href="'+url+'" target="_blank">'+ row.receiptNumber +'</a>';
					      				return html;
					      	    	}
					      	    },
					      	    {field: 'strPayer', title: '付款方', align: 'center'},
					      	    {field: 'strPayee', title : '收款单位', align : 'center'},
					      	    {field: 'fundName', title: '款项', align: 'center'},
					      	    {field: 'amount', title: '收据金额', align: 'center',
					      	    	formatter: function(value, row, index){	
					           			var html='';
					           			var amount = value ? value : '-';
					           			html='<span class="per">'+amount+'</span>';
					           			return html;
					           		}
					      	    },
					      	    {field: 'refundAmount', title: '转款金额', align: 'center',
					      	    	formatter: function(value, row, index){	
					           			var html='';
					           			var refundAmount = value ? value : '-';
					           			html='<input type="text" id="zhuan'+index+'" class="form-control input_return zhuankuan" name="" readonly value="" placeholder="0.00">';
					           			return html;
					           		}
					      	    },
					      	    {field: 'invoiceNumbers', title: '发票编号', align: 'center'},
						      	{field: 'printCount', title: '收据打印张数', align: 'center'},
						      	{field: 'recycleCount', title: '收据回收张数', align: 'center',
						      		formatter: function(value, row, index){
						      			if(row.invoiceNumbers){
						      				var html='';
						           			var returnCount = value ? value : '-';
						           			html='<span>'+returnCount+'</span>';
						           			return html;
						      			}else{
						      				var html='';
						           			html='<input type="text" id="'+index+'" class="form-control input_return" name="" readonly value="">';
						           			return html;
						      			}
					           			
					           		}
						      	},
						      	{field: 'differentReason', title: '回收差异原因', align: 'center',
						      		formatter: function(value, row, index){
						      			if(row.invoiceNumbers){
						      				var html='';
						           			var returnDiffReason = value ? value : '-';
						           			html='<span>'+returnDiffReason+'</span>';
						           			return html;
						      			}else{
						      				var html='';
						           			html='<input type="text" id="yin'+index+'" class="form-control input_val" name="" readonly value="">';
						           			return html;
						      			}
					           		}
						      	}
					      	]
						});
					
						var Calculation = '0.00';
						var mun=null;
						var value=null;
						var btSelectItem=$('#J_refunds_dataTable input[name="btSelectItem"]');
						btSelectItem.off().on('click',function(){
							if($(this).is(':checked')){
								$('#'+$(this).data('index')).prop('readonly',false);
								$('#zhuan'+$(this).data('index')).prop('readonly',false);
								$('#yin'+$(this).data('index')).prop('readonly',false);
								if(btSelectItem.length==$('#J_refunds_dataTable input[name="btSelectItem"]:checked').length){
									$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',true);
								}else{
									$('#J_refunds_dataTable input[name="btSelectAll"]').prop('checked',false);
								}
							}else{
								$('#'+$(this).data('index')).prop('readonly',true);
								$('#zhuan'+$(this).data('index')).prop('readonly',true);
								$('#yin'+$(this).data('index')).prop('readonly',true);
								if($('#zhuan'+$(this).data('index')) != ''){
									mun-=$('#zhuan'+$(this).data('index')).val()*1;
									$('#J_paymentmoeny').html(mun);
									$('#zhuan'+$(this).data('index')).val('');
									$('#yin'+$(this).data('index')).val('');
									$('#'+$(this).data('index')).val('');
								}
							}
						});
						
						//选中行转款金额计算
						$('.zhuankuan').off().on('blur focus',function(e){
							if(e.type=='focus'){
								value=$(this).val()*1;
								mun-=$(this).val()*1;
							}else{
								if(value!==$(this).val()*1){
									mun+=$(this).val()*1;
								}

								$('#J_paymentmoeny').html(mun);
							}
						});
					}
					attachmentView.init(dataresultdata);
				});
			}	
		}
}

var attachmentView={
	initFalg:true,
	chargebackId:location.search.split('&')[0].split('=')[1],
	init:function(dataresultdata){
		var _this=this;
		//选择文件
		$('#addAttachment').off().on('click',function(){
			commonContainer.modal('上传附件',$('#attachmentCon'),function(i){
				var biggerannexnum = $('#J_attachmentType').val().split('，')[0];
				var smallannexnum = $('#J_smallattachmentType').val().split('，')[0];
				if(biggerannexnum == ''){
					layer.alert('附件大类为必填项,请填写');
					return false;
				}
				if(smallannexnum == ''){
					layer.alert('附件小类为必填项,请填写');
					return false;
				}
				_this.saveFile('',i);
				_this.fileList();
			},{
				area:['800px','400px'],
				overflow :true,
				success:function(){
					$('#J_attachmentType').val('');
					$('#J_attachmentType').trigger("chosen:updated");
					$('#J_smallattachmentType').val('');
					$('#J_smallattachmentType').trigger("chosen:updated");
					$('#J_categoryName').html('');
					$('#J_remarktext').html('');
					_this.popCalbank();
					$('#J_businessType').text($('#J_typecontract_h').html());
					var auditStep=[];
					$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
						auditStep.push(dataresultdata[$(this).data('index')].fundName);
					})
					$('#J_Paymenttext').text(auditStep);
					
					var flag = false;
					if(auditStep.length>1){
						var fundname = auditStep[0];
						$.each(auditStep,function(i,n){
							if(i>0){
								if(fundname != n){
									layer.alert('款项不一致,重新选择');
									flag = true;
									return false;
								}
							}
							
						})
					}
					if(flag){
						return false;
					}
				}
			});
		});
	},
	//附件列表
	fileList:function(){
		var _this=this;
		var contenthtml='';
		var addlistname = JSON.stringify(enclosureList);
		var biggerannex = $('#J_attachmentType').val().split('，')[1];
		var biggerannexnum = $('#J_attachmentType').val().split('，')[0];
		var smallannex = $('#J_smallattachmentType').val().split('，')[1];
		var smallannexnum = $('#J_smallattachmentType').val().split('，')[0];
		var dataadd='data-add='+addlistname;
		newstime = laydate.now(0, 'YYYY-MM-DD hh:mm:ss');
		//列表赋值
		contenthtml='\
			<tr>\
				<td class="add_create" style="text-align: center; padding:8px;"></td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+biggerannex+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+smallannex+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+newstime+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;"><a type="looktype" data-remark="'+remarkval+'" data-titlename="'+categoryNametype+'" '+dataadd+' class="btn btn-outline btn-success btn-xs btn_looktype" data-newstime="'+newstime+'" data-smallannexnum="'+smallannexnum+'" data-biggerannexnum="'+biggerannexnum+'" data-index="'+index+'">预览</a>&nbsp;&nbsp;<a type="del" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
			</tr>';
		$('#J_list_dataTable tbody').append(contenthtml);
		attachmentView.reIndex();
		$('#J_list_dataTable').off().delegate('a','click',function(target,type){
			var _this=this;
			if(this.type == 'looktype'){
				commonContainer.modal('查看附件',$('#J_attachmentCon'),function(i){
					layer.close(i);
					$('#J_upFileName').html('');
				},{
					btns:['关闭'],
					area:['800px','400px'],
					overflow :true,
					success:function(){
						$('#J_upFileName').html('');
						$('#J_bigger').html(biggerannex);
						$('#J_small').html(smallannex);
						$('#J_titleName').html($(_this).data('titlename'));
			    		$('#J_valremark').html($(_this).data('remark'));
						$('#J_fujianbusinessType').html($('#J_typecontract_h').html());
						$('#J_Paymenttextval').text($('#J_auditId').attr('data-fundName'));
						var htmlnews='';
						$.each($(_this).data('add'),function(i,n){
							htmlnews+='\
				    			<div class="col-md-3" style="padding-top:18px;text-align: center;">\
				    				<img src="'+n.path+'" width="80%" height="100">\
				    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+n.title+'</div>\
				    				<button type="button" data-opt="del" class="btn btn-outline btn-success btn-xs mt-3" onclick="attachmentView.download(\''+n.path+'\')">下载</button>\
			    				</div>';
						})
			    		$('#J_upFileName').append(htmlnews);
					}
				});
			}else if(this.type == 'del'){
				var trlength = $('#J_list_dataTable tbody').find('tr').length;
				if(trlength>0){
					commonContainer.confirm(
						'是否确认删除信息？',function(index, layero){
							$(_this).parent().parent().remove();
							attachmentView.reIndex();
							layer.close(index);
						}
					);
				}
			}
		})

	},
	reIndex:function(){
		$('#J_list_dataTable tbody tr').each(function(i){
			$(this).find('td').eq(0).text(i+1);
		})
	},
	//文件上传至文件服务器
	upFile:function(){
		var _this=this;
		var upImglock=false;
		//$('#upFile').val('###');
		$('#selectFile').off().on('click',function(){
			$('#upFile').click();
			_this.fileChangeEvt(upImglock);
		});
		_this.fileChangeEvt(upImglock);
	},
	fileChangeEvt:function(lock){
		$('#upFile').off().on('input change',function(){
			var upFileObj=this.files[0];
			if(lock){
				return false;
			}else{
				lock=true;
			}
			//var that=this;
			var formData=new FormData();
			formData.append('files',this.files[0]);
			$.ajax({
				url: basePath+'/custom/common/multiFileUpload.htm',
			    type: 'POST',
			    async:true,
			    cache: false,
			    data: formData,
			    processData: false,
			    contentType: false,
			    dataType:'json',
			    success:function(result){
			    	lock=false;
			    	if(result.code==0){
			    		var html='\
			    			<div class="col-md-3" style="padding-top:18px;text-align: center;" data-filename="'+result.data[0].filename+'" data-filepath="'+result.data[0].filepath+'">\
			    				<img src="'+result.data[0].filepath+'" width="80%" height="100">\
			    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+result.data[0].filename+'</div>\
			    				<button type="button" data-opt="del" class="btn btn-outline btn-danger btn-xs" onclick="attachmentView.delteFile(this)">删除</button>\
		    				</div>';
			    		$('#upFileName').append(html);
			    	}else{
			    		commonContainer.alert(result.msg);
			    	}
			    },
			    error:function(){
			    	lock=false;
			    	layer.alert(errorMsg);
		    	}
			});
			//重置上传文件控件
			$('#fileHidden').html('<input type="file" id="upFile">');
		});
	},
	delteFile:function(target){
		$(target).parent().remove();
	},
	//保存附件 type=1修改
	saveFile:function(target,i,type){
		var _this=this;
		//验证必填项
		//附件类型
		var attachmentType=$('#attachmentType').val();
		if(attachmentType==''){
			commonContainer.alert('请选择附件类型');
			return false;
		}
		var upFileLIst=$('#upFileName >div');
		if(upFileLIst.length==0){
			commonContainer.alert('请选择文件');
			return false;
		};
		layer.close(i);
		enclosureList=[];
		upFileLIst.each(function(i){
			
			enclosureList.push({
				title:$(this).data('filename'),
				path:$(this).data('filepath')
			});
			if(type==1){
				var enclosurePathid=$(this).data('enclosurepathid');
				enclosureList[i].enclosurePathId=(enclosurePathid==undefined?'':enclosurePathid);
			}
		});
	},
	//弹窗成功回调
	popCalbank:function(data){
		var attachmentType='';
		var remarks='';
		var upFileList='';
		if(data){
			attachmentType=data.type.toString();
			if(data.remark!==undefined){
				remarks=data.remark;
			}
			if(data.enclosureList && data.enclosureList.length>0){
				$.each(data.enclosureList,function(i,n){
					upFileList+='\
		    			<div class="col-md-3" style="padding-top:12px;text-align: center;" data-filename="'+n.title+'" data-filepath="'+n.path+'" data-enclosurePathid="'+n.enclosurePathId+'">\
		    				<img src="'+n.path+'" width="80%" height="100">\
		    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+n.title+'</div>\
		    				<button type="button" data-opt="del" class="btn btn-outline btn-danger btn-xs" onclick="attachmentView.delteFile(this)">删除</button>\
	    				</div>';
				});
			}
		}
		$('#remarks').val(remarks);
		$('#upFileName').html(upFileList);
			//初始select下拉框
			$('select').chosen({
				width:'100%'
			});
			//附件类型
			/*dimContainer.buildDimChosenSelector($('#attachmentType'),'type',attachmentType);*/
			var businesstype=$('#J_typecontract_h').html();
			if(businesstype=='买卖'){
				businesstype='2';
			}else if(businesstype=='租赁'){
				businesstype='1';
			}
			var auditStepfundCode=[];
			$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
				auditStepfundCode.push(dataresultdata[$(this).data('index')].fundCode);
			})
			// 初始化附件大类
			commonContainer.initChosen($('#J_attachmentType'));
			var options = [];
		    jsonPostAjax(
				basePath +'/finance/common/getFinanceAttachPrimaryList',
				{
					"businessType":businesstype,
					"fundCode":auditStepfundCode[0]
					
				}, 
				function(result) {
					categoryNametype = result.data[0].categoryName;
					remarkval = result.data[0].remark;
		    		$.each(result.data, function(n, value) {
		    	    	options.push('<option value="'+value.categoryCode +'，'+ value.categoryName + '">' + value.categoryName + '</option>');
		    	    })
		    	    $('#J_attachmentType').html('<option value="">请选择</option>'+options.join(''));
		    		$('#J_attachmentType').trigger("chosen:updated");
			})
			//根据大类获取附件小类
			var option = [];
			$('#J_attachmentType').on('input change',function(){
				option = [];
    			$('#J_categoryName').html(categoryNametype);
	    		$('#J_remarktext').html(remarkval);
				var attachtype = $(this).val().split('，')[0];
				if(attachtype !=''){
	    			jsonGetAjax(
    					basePath +'/finance/common/getFinanceAttachSecondaryList',
    					{
    						"categoryCode":attachtype
    						
    					}, 
    					function(result) {
    			    		$.each(result.data, function(n, value) {
    			    			option.push('<option value="' + value.secondaryCategoryCode +'，'+value.secondaryCategoryName +'">' + value.secondaryCategoryName + '</option>');
    			    	    })
    			    	    $('#J_smallattachmentType').html('<option value="">请选择</option>'+option.join(''));
    			    		$('#J_smallattachmentType').val('');
    			    		$('#J_smallattachmentType').trigger("chosen:updated");
    					}
    				)
	    		}else{
	    			$('#J_smallattachmentType').html('<option value="">请选择</option>');
	    			$('#J_smallattachmentType').val('');
		    		$('#J_smallattachmentType').trigger("chosen:updated");
	    		}
			})
			this.upFile();
		
	},
	//下载文件
	download:function(filePath){
		window.open(basePath+'/sign/downloadEnclosure.htm?filePath='+filePath);
	}
}

function submitContractApply() {
	receiptList=[];	//回传收据信息
	attInfoList = [];    //回传附件信息
	paymentinfolist=[];  //回传新增信息
	var auditStep=[];
	$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
		auditStep.push(dataresultdata[$(this).data('index')]);
		var index=$(this).data('index');                          // 回收数量
		var indexyin=$('#yin'+index);              // 回收差异原因
		var indexzhuan=$('#zhuan'+index);          // 转款金额
		var  gapReceipt=dataresultdata[index];
		receiptList.push({
        	  "receiptId":gapReceipt.receiptId,
        	  "receiptNumber":gapReceipt.receiptNumber,
        	  "refundAmount": indexzhuan.val()==undefined?gapReceipt.refundAmount:indexzhuan.val(),
              "returnCount": $('#'+index).val()==undefined?gapReceipt.recycleCount:$('#'+index).val(),
              "returnDiffReason": indexyin.val()==undefined?gapReceipt.differentReason:indexyin.val(),
              "printCount":gapReceipt.printCount
          });
	});
	$('#J_list_dataTable .btn_looktype').each(function(){
		attInfoList.push({
			businessType:businessTypeNum,
			fundCode:auditStep[0].fundCode,
			fundName:auditStep[0].fundName,
			largeType:$(this).data('biggerannexnum'),
			smallType:$(this).data('smallannexnum'),
			pathList:$(this).data('add')
		})
	})
	var checknewsDataArr=$("#contractList_news").bootstrapTable('getSelections');	//选中的新转入合同数据
	$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
		paymentinfolist.push({
			collectionBatchId:dataresultdata[$(this).data('index')].batchId,
			fundCode:auditStep[0].fundCode,
			newContractId:checknewsDataArr[0].contractId,
			newContractNumber:$('#addContractNumbernews').val(),
			payAmount:$('#J_paymentmoeny').html(),
			payType:5,
			payer:dataresultdata[$(this).data('index')].payee
		})
	})
	var flag = false;
	if(auditStep.length>1){
		var fundname = auditStep[0].fundName;
		var batchid = auditStep[0].batchId;
		var strpayer = auditStep[0].strPayer;
		var strpayee = auditStep[0].strPayee;
		$.each(auditStep,function(i,n){
			if(i>0){
				if(fundname != n.fundName){
					layer.alert('款项不一致,重新选择');
					flag = true;
					return false;
				}
				if(batchid != n.batchId){
					layer.alert('批次号不一致,重新选择');
					flag = true;
					return false;
				}
				if(strpayer != n.strPayer){
					layer.alert('付款方不一致,重新选择');
					flag = true;
					return false;
				}
				if(strpayee != n.strPayee){
					layer.alert('收款单位不一致,重新选择');
					flag = true;
					return false;
				}
			}
			
		})
	};
	//判断付款原因为必填
	var checkoldDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的新转入合同数据
	var applyaddtext = $('#J_applyadd').val();
	if(applyaddtext == ''){
		layer.alert('请填写付款原因，付款原因为必填项');
		return false;
	}
	var applynumber = $('#addContractNumbernews').val();
	var contractId = '';
	if(applynumber == ''){
		layer.alert('转入新合同编号为必填项,请填写');
		flag = true;
		return false;
	}
	if(flag){
		return false;
	}
	if(contractid){
		contractId = contractid;
	}else{
		contractId = checkoldDataArr[0].contractId;
	}
	jsonPostAjax(
		basePath + '/finance/payment/apply/tranferSubmit',
		{
			"contractId":contractId,
			"contractNumber":$('#J_Contract_h').html(),
			"fundCode":auditStep[0].fundCode,
			"isChargeback":chargebackId == null ? 0 : 1,
			"chargebackId":chargebackId,
			"chargebackNumber":chargebackNumber,
			"paidTotalAmount":$('#J_paymentmoeny').html(),
			"paymentType":3,
			"remarks":$('#J_applyadd').val(),
			"attInfoList":attInfoList,
			"receiptList":receiptList,
			"paymentInfoList":paymentinfolist
		},
		function(result) {
			layer.msg("操作成功");
			$('#J_paymentbutton').attr('disabled',"true");
			var dataappLy = result.data.applyId;
			var paymentType = result.data.paymentType;
			window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+paymentType+'&applyId='+dataappLy;
		}
	)
}

function submitClientApply() {
	var contractNum = $(this).val();
	if(contractNum=='1'){
		$('#J_iboxpay').hide();
		$('#addContractNumber').val('');
		addChargebackView.init();
		
	}else{
		$('#J_iboxpay_finance').hide();
		$('#addContractNumber').val('');
		addChargeclientView.init();
		$('#J_paymentbutton').on('click',function(){
			paymentinfolist=[];  //回传新增信息
			receiptList=[];	//回传收据信息
			attInfoList = [];    //回传附件信息
			var auditStep=[];
			$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
				auditStep.push(dataresultdata[$(this).data('index')].fundName);
				var index=$(this).data('index');                          // 回收数量
				var indexyin=$('#yin'+index);              // 回收差异原因
				var indexzhuan=$('#zhuan'+index);          // 转款金额
				var  gapReceipt=dataresultdata[index];
				receiptList.push({
                	  "receiptId":gapReceipt.receiptId,
                	  "receiptNumber":gapReceipt.receiptNumber,
                	  "refundAmount": indexzhuan.val()==undefined?gapReceipt.refundAmount:indexzhuan.val(),
                      "returnCount": $('#'+index).val()==undefined?gapReceipt.recycleCount:$('#'+index).val(),
                      "returnDiffReason": indexyin.val()==undefined?gapReceipt.differentReason:indexyin.val(),
                      "printCount":gapReceipt.printCount
                  });
			});
			$('#J_list_dataTable .btn_looktype').each(function(){
				attInfoList.push({
					businessType:$('#J_businessType').html(),
					fundCode:auditStep[0].fundCode,
					fundName:auditStep[0].fundName,
					largeType:$(this).data('biggerannexnum'),
					smallType:$(this).data('smallannexnum'),
					pathList:$(this).data('add')
				})
			})
			var checknewsDataArr=$("#contractList_news").bootstrapTable('getSelections');	//选中的新转入合同数据
			$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
				paymentinfolist.push({
					collectionBatchId:dataresultdata[$(this).data('index')].batchId,
					fundCode:auditStep[0].fundCode,
					newContractId:dataresultdata[$(this).data('index')].contractId,
					newContractNumber:$('#addContractNumbernews').val(),
					payAmount:$('#J_paymentmoeny').html(),
					payType:5,
					payer:dataresultdata[$(this).data('index')].payee
				})
			})
			var flag = false;
			if(auditStep.length>1){
				var fundname = auditStep[0].fundName;
				var batchid = auditStep[0].batchId;
				var strpayer = auditStep[0].strPayer;
				var strpayee = auditStep[0].strPayee;
				$.each(auditStep,function(i,n){
					if(i>0){
						if(fundname != n.fundName){
							layer.alert('款项不一致,重新选择');
							flag = true;
							return false;
						}
						if(batchid != n.batchId){
							layer.alert('批次号不一致,重新选择');
							flag = true;
							return false;
						}
						if(strpayer != n.strPayer){
							layer.alert('付款方不一致,重新选择');
							flag = true;
							return false;
						}
						if(strpayee != n.strPayee){
							layer.alert('收款单位不一致,重新选择');
							flag = true;
							return false;
						}
					}
					
				})
			}
			//判断付款原因为必填
			var applyaddtext = $('#J_applyadd').val();
			if(applyaddtext == ''){
				layer.alert('请填写付款原因，付款原因为必填项');
				return false;
			}
			var applynumber = $('#addContractNumbernews').val();
			if(applynumber == ''){
				layer.alert('转入新合同编号为必填项,请填写');
				flag = true;
				return false;
			}
			if(flag){
				return false;
			}
			jsonPostAjax(
				basePath + '/finance/payment/apply/tranferSubmit',
				{
					"clientId":$('#J_clientId').html(),
					"contractNumber":$('#J_Contract_h').html(),
					"fundCode":auditStep[0].fundCode,
					"isChargeback":chargebackId == null ? 0 : 1,
					"chargebackId":chargebackId,
					"chargebackNumber":chargebackNumber,
					"paidTotalAmount":$('#J_paymentmoeny').html(),
					"paymentType":2,
					"remarks":$('#J_applyadd').val(),
					"attInfoList":attInfoList,                           //回传附件信息
					"receiptList":receiptList,                      //回传就收据信息
					"paymentInfoList":paymentinfolist               //回传新转入合同参数
				},
				function(result) {
					layer.msg("操作成功");
					$('#J_paymentbutton').attr('disabled',"true");
					var dataappLy = result.data.applyId;
					var paymentType = result.data.paymentType;
					window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+paymentType+'&applyId='+dataappLy;
				}
			)
		})
		
	}
}

$('#J_paymentbutton').on('click', function(){
	var chooseType = $('#J_Choosecontract').val();
	if(chooseType == 1) {
		submitContractApply();
	}else if(chooseType == 2) {
		submitClientApply();
	}
})

// 获取申请人接口
function Inquire(){
	jsonGetAjax(
		basePath + '/custom/common/getcuruserinfo',
		{},
		function(result) {
			$('#J_userName').text(result.data.userName);
			$('#J_userid').val(result.data.userId);
		}
	)
}
//限制输入两位小数
function clearNoNum(obj){
	obj.value=obj.value.replace(/[^\d.]/g,''); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,''); //验证第一个字符是数字而不是"."
	obj.value = obj.value.replace(/\.{2,}/g,'.'); //只保留第一个. 清除多余的
	obj.value = obj.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
	return obj.value;
}
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 