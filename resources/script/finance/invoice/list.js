$(function() {
	$("select").chosen({
		width : "100%"
	});

	$('#J_reset').on('click', function(event){
		$('.J_chosen').val('');		
		$("#J_timeType").val('1');
		$('#J_invoiceNumber').val('1')
		$('.J_chosen').trigger('chosen:updated');
		$('#J_deptLevel').val('');
		$("#J_personnelType").val('');
		$("#J_deptName").attr("data-id",'');
		$('#J_user').attr('data-id','');
		$('#J_invoiceinput').hide();
		$('#J_invoiceonly').show();
		endtime.min='';
		endtime.start='';
		starttime.max='';
	})
	
	$('#J_endTime').on('change', function() {
		starttime.max = '';
	});
	
	$('#J_invoiceNumber').on('input change',function(){
		var invoiceType = $(this).val();
		if(invoiceType == '1'){
			$('#J_inputvalue').attr('name','invoiceNumber');
			$('#J_invoiceonly').show();
			$('#J_invoiceinput').hide();
			$('#J_invoiceStartNumber').val('');
			$('#J_invoiceEndNumber').val('');
		}
		if(invoiceType == '2'){
			$('#J_invoiceStartNumber').attr('name','invoiceStartNumber');
			$('#J_invoiceonly').hide();
			$('#J_invoiceinput').show();
			$('#J_inputvalue').val('');
		}
	})
	
	saveas();
	
	// 初始化录入日期
	var starttime = {
		elem: '#J_startTime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
        istoday:false,
	    choose: function(datas){
	    	endtime.min = datas;
	    	endtime.start = datas
	    }
	}
	
	var endtime = {
		elem: '#J_endTime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
        istoday:false,
	    choose: function(datas){
	    	starttime.max = datas
	    }
	}
	
	laydate(starttime);
	laydate(endtime);
	
	
	
	//初始化付款方数据
	dimContainer.buildDimChosenSelector($("#J_payer"), "payer", "");
	//初始化发票状态数据
	dimContainer.buildDimChosenSelector($("#J_invoiceStatus"), "invoiceStatus", "");
	//初始化人员类型数据
	dimContainer.buildDimChosenSelector($("#J_personnelType"), "invoicePersonnelType", "");
	dimContainer.buildDimChosenSelector($("#J_belongCompanyId"), "invoiceBelongCompanyId", "");
	//初始化所属财务中心店数据
	searchContainer.searchFinanceCoreListByComp($("#J_CenterShop"), true, 'right');
	//所属人自动补全查询
	searchContainer.searchUserListByComp($("#J_user"), true, 'right');
	// 显示部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'), $('#J_deptLevel'));
	});
	
	//加载列表数据项
	$('#J_search').on('click', function(event) {
		$('#J_dataTable').bootstrapTable({ 
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_query').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.personnelId){
					o.personnelId = $('#J_user').attr('data-id');
				}
				if(o.belongCenterShopId){
					o.belongCenterShopId=$('#J_CenterShop').attr('data-id');
				}
				if(o.personnelType){
					o.personnelType=$("#J_personnelType").val();
				}
				if(o.deptId){
					o.deptId = $("#J_deptName").attr("data-id");
				}
				if(o.level){
					o.level = $("#J_deptLevel").val();
				}
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.list, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
	
			columns:[
				        {field: 'flyid',title :'选择',checkbox:true, align: 'center',
				        	formatter: function(value, row, index){	
			           			var html='';
			           			html='<input class="in_invoice" type="hidden" name="invoiceType" invoice="'+row.invoiceId+'"/>';
			           			return html;
			           		}
				        },
				        {field: 'belongCompanyName', title: '所属公司', align: 'center'},
			      	    {field: 'invoiceNumber', title: '发票编号', align: 'center',
				        	formatter: function(value, row, index){	
			           			var html='';
			           			var url = basePath+"/finance/invoice/invoicedetail.html?invoiceId="+row.invoiceId;
			           			html='<a href="'+url+'" target="_blank">'+row.invoiceNumber+'</a>';
			           			return html;
			           		}
			      	    },
			      	    {field: 'oldReceiptList', title: '收据编号', align: 'center',
			      	    	formatter: function (value, row, index) {
			                	var receiptNumbers = row.oldReceiptList;
			                	var strreceiptNumbers="";
			                	var url = basePath+"/finance/receipt/detail.htm?receiptId=";
			                	for(i=0;i<receiptNumbers.length;i++){
			                		strreceiptNumbers += '<a href="'+url+ receiptNumbers[i].receiptId +'" target="_blank">'+receiptNumbers[i].receiptNumber+'</a><br>';
			                	}
			                	 var html = strreceiptNumbers;
			                     return html;
			                }
			      	    },
			      	    {field: 'strPayer', title: '付款方', align: 'center'},
			      	    {field: 'invoiceHeader', title: '发票抬头', align : 'center'},
			      	    {field: 'invoiceName', title: '发票名称', align: 'center'},
			      	    {field: 'invoiceAmount', title: '发票面值', align: 'center'},
				      	{field: 'strInvoiceStatus', title: '发票状态', align: 'center'},
				      	{field: 'contractNumber', title: '合同编号', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var contractNumber = value ? value : '-';
			      				html = contractNumber;
			      				return html;
			      	    	}
				      	},
				      	{field: 'belongCenterShopName', title: '所属财务中心店', align: 'center'},
				      	{field: 'createByName', title: '录入人<br />录入时间', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var createByName = value ? value : '-';
			      				var createTime = row.createTime ? row.createTime : '-'
			      				html = createByName +'</br>'+createTime;
			      				return html;
			      	    	}
				      	},
				      	{field: 'activedByName', title: '激活人</br>激活时间', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var activedByName = value ? value : '-';
			      				var activedTime = row.activedTime ? row.activedTime : '-'
			      				html = activedByName +'</br>'+activedTime;
			      				return html;
			      	    	}
				      	},
				      	{field: 'usedByName', title: '成交人</br>成交时间', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var usedByName = value ? value : '-';
			      				var usedTime = row.usedTime ? row.usedTime : '-'
			      				html = usedByName +'</br>'+usedTime;
			      				return html;
			      	    	}
				      	},
				      	{field: 'invalidByName', title: '财务作废人</br>财务作废时间', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var invalidByName = value ? value : '-';
			      				var invalidTime = row.invalidTime ? row.invalidTime : '-'
			      				html = invalidByName +'</br>'+invalidTime;
			      				return html;
			      	    	}
				      	}
			      	],
		})
	
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/finance/invoice/list' });
	});
	// 添加发票弹出框
	$('#J_Addinvoice').on('click',function(){
		commonContainer.modal(
			'添加发票',
			$('#Addinvoice_layer'),
			function(index, layero) {
				var Companyval = $('#J_Company_chosen span').html();
				var CenterShopId = $('#J_CenterShopId_pop').val();
				var startNumber = $('#J_startNumber').val();
				var endNumber = $('#J_endNumber').val();
				if(Companyval == '' || Companyval == '全部'){
					layer.alert('发票所属公司必填项');
					return false;
				};
				if(CenterShopId == ''){
					layer.alert('所属财务中心店必填项');
					return false;
				};
				if(startNumber == '' || endNumber == ''){
					layer.alert('编号起止必填项');
					return false;
				};
				layer.close(index);
				jsonPostAjax(
					basePath + '/finance/invoice/insert',
					{	
						"belongCenterShopId": $('#J_CenterShopId_pop').attr('data-id'),
						"belongCompanyId": $('#J_Company').val(),
						"startNumber": $('#J_startNumber').val(),
						"endNumber": $('#J_endNumber').val()
					},
					function(result) {
						layer.close(index);
						layer.msg("操作成功");
						$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/finance/invoice/list' });
					}
				)					
			}, 
			{
				overflow :true,
				area : ['60%','48%'],
				btns : ['确定', '取消'],
				success: function() {
					$("#J_CenterShopId_pop").val('');
					$("#J_Company").html('');
					$('#J_endNumber').val('');
					$('#J_startNumber').val('');
					$('#J_pageindex').html('0');
					//初始化发票所属公司
					dimContainer.buildDimChosenSelector($("#J_Company"), "invoiceBelongCompanyId", "");
					//初始化所属财务中心店数据
					searchContainer.searchFinanceCoreListByComp($("#J_CenterShopId_pop"), true, 'right');
				}
			}
		);
	});
	
	//批量添加发票时计算添加所有发票张数201404020803670374
	$('#J_endNumber , #J_startNumber').on('blur',function(){	
		
		toSize($('#J_startNumber').val() , $('#J_endNumber').val());
	});
	
	function toSize(startNumber , endNumber){
		var size = 0;
		
		if(startNumber && endNumber){
			if(startNumber > endNumber){
				layer.alert('输入错误，起始号不能大于结束号');
				return false;
			}
			var arr = endNumber.split('');
			var index = 0;
			for(var i=0;i<arr.length;i++){
				if(arr[i] != startNumber[i]){
					index = i;
					break;
				}
			}
			size = (Number(endNumber.slice(index)) - Number(startNumber.slice(index))+1);
		}
		
		$('#J_pageindex').text(size);
	}
	
	//批量删除发票数据
	$("#J_del").on("click",function(){
		
		if($("input[name='btSelectItem']:checked").length==0){
			layer.alert("请选择需要删除的发票数据");
			return false;
		}
		
		var validArr = [];
		$("input[name='btSelectItem']:checked").each(function(){
			validArr.push($(this).next().attr("invoice"));
		})
		commonContainer.confirm(
			'是否确认删除信息？',function(index, layero){
				$.ajax({
					url : basePath + '/finance/invoice/delete',
					data : JSON.stringify({invoiceIds:validArr}),
					type : 'post',
					dataType : 'json',
					cache : false,
					contentType : "application/json ; charset=utf-8",
					success : function(result) {
						if (result.code == '0') {
							layer.msg("删除成功");
							jQuery('#J_dataTable').bootstrapTable('refresh');
						} else {
							layer.alert(result.msg);
						}
					}
				})
			}
		);
	});
	
	//激活发票
	$('#J_activation').on('click',function(){
		
		if($("input[name='btSelectItem']:checked").length==0){
			layer.alert("请选择需要激活的发票数据");
			return false;
		}
		
		var validArr = [];
		$("input[name='btSelectItem']:checked").each(function(){
			validArr.push($(this).next().attr("invoice"));
		})
		
		commonContainer.confirm(
			'是否确认激活发票？',function(index, layero){
				$.ajax({
					url : basePath + '/finance/invoice/active',
					data : JSON.stringify({invoiceIds:validArr}),
					type : 'post',
					dataType : 'json',
					cache : false,
					contentType : "application/json ; charset=utf-8",
					success : function(result) {
						if (result.code == '0') {
							layer.msg("激活发票成功");
							jQuery('#J_dataTable').bootstrapTable('refresh');
						} else {
							layer.alert(result.msg);
						}
					}
				})
			}
		);
	});
	
	//发票作废
	$('#J_void').on('click',function(){
		
		if($("input[name='btSelectItem']:checked").length==0){
			layer.alert("请选择需要作废的发票数据");
			return false;
		}
		
		var validArr = [];
		$("input[name='btSelectItem']:checked").each(function(){
			validArr.push($(this).next().attr("invoice"));
		})
		
		commonContainer.confirm(
			'是否确认作废发票？',function(index, layero){
				$.ajax({
					url : basePath + '/finance/invoice/invalid',
					data : JSON.stringify({invoiceIds:validArr}),
					type : 'post',
					dataType : 'json',
					cache : false,
					contentType : "application/json ; charset=utf-8",
					success : function(result) {
						if (result.code == '0') {
							layer.msg("作废发票成功");
							jQuery('#J_dataTable').bootstrapTable('refresh');
						} else {
							layer.alert(result.msg);
						}
					}
				})
			}
		);
	});
})

//结果另存为
function saveas(){
	$('#J_result').off().on('click',function(){
		/*var data= $('#J_query').serialize()+'&personnelId='+$('#J_user').attr('data-id')+'&belongCenterShopId='+$("#J_CenterShop").attr('data-id');
		
		if($('#J_invoiceNumber').val()==2){
			data=data.substring(data.indexOf('&')+1);
		}*/
		if($("input[name='btSelectItem']:checked").length==0){
			layer.alert("请选择需要导出的数据");
			return false;
		}
		var validArr = [];
		$("input[name='btSelectItem']:checked").each(function(){
			validArr.push($(this).next().attr("invoice"));
		})
		validArr = validArr.join(',');
		//o.userid = $('#J_user').attr('data-id');
		window.open(basePath + '/finance/invoice/downloadexcel.htm?invoiceIds='+validArr);
	});
}

$('#J_strcontractNumber').on('click',function(){
	var contractType = $('#J_hidden').val();
	var contractId = $('#J_contractId').val();
	if(contractType == 1){ //租赁合同跳转
		$(this).attr('href',basePath+"/sign/detail/detail.html?conId="+contractId+"&formal=true");
	}else if(contractType == 2){// 买卖合同跳转
		$(this).attr('href',basePath+"/sign/signthecontract/contractdetail.htm?conId="+contractId);
	}
});


