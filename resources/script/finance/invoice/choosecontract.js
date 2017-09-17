var BusinessType = '';
var houseIdNum='';
var clientIdNum = '';
var contractid=getQueryString("contractNo");
var datapayee = '';
$(function() {
	$("select").chosen({
		width : "100%"
	});
	$('#J_reset').on('click',function(){
		window.opener=null;
		window.open('','_self');
		window.close();
	})
	
	//合同基础数据展示
	jsonGetAjax(
		basePath + '/finance/invoice/useinfo',
		{	
			"contractId": contractid
		},
		function(result) {
			BusinessType = result.data.contractInfo.businessType;
			houseIdNum = result.data.contractInfo.houseId;
			clientIdNum = result.data.contractInfo.clientNumber;
			
			var contractUrl = "";
			var houseUrl = "";
			var clientUrl = "";
			if(BusinessType == 1){
				contractUrl = basePath+"/sign/detail/detail.html?conId="+contractid+"&formal=true";
				houseUrl = basePath+"/house/main/leasedetail.htm?houseid="+houseIdNum;
				clientUrl = basePath+"/customer/main/findleaseclientbycustomerid.htm?customerId="+clientIdNum;
			}else if(BusinessType == 2){
				contractUrl = basePath+"/sign/signthecontract/contractdetail.htm?conId="+contractid;
				houseUrl = basePath+"/house/main/buydetail.htm?houseid="+houseIdNum;
				clientUrl = basePath+"/customer/main/findbuyerclientbycustomerid.htm?customerId="+clientIdNum;
			}
			
			$('#J_Contract').html('<a href="'+contractUrl+'" target="_blank">'+(result.data.contractInfo.contractNumber?result.data.contractInfo.contractNumber:'-')+'</a>');
			$('#J_typecontract').html(result.data.contractInfo.strBusinessType?result.data.contractInfo.strBusinessType:'-');
			$('#J_houseId').html('<a href="'+houseUrl+'" target="_blank">'+(result.data.contractInfo.houseId?result.data.contractInfo.houseId:'-')+'</a>');
			$('#J_houseId').html('<a href="'+clientUrl+'" target="_blank">'+(result.data.contractInfo.clientId?result.data.contractInfo.clientId:'-')+'</a>');
			$('#J_ownerName').html(result.data.contractInfo.ownerName?result.data.contractInfo.ownerName:'-');
			$('#J_clientName').html(result.data.contractInfo.clientName?result.data.contractInfo.clientName:'-');
		}
	);
	
	
	//加载未开发票收据列表数据项
	$('#J_contract_dataTable').bootstrapTable({ 
		url:basePath + '/finance/invoice/useinfo',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: false,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			return {"contractId": contractid}
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data) {
				return { "rows": result.data.receiptList}
			}
			return { "rows": [], "total": 0 } 
		},

		columns:[
		        {field: '', title :'选择', checkbox:true, align:'center',
		        	formatter: function(value, row, index){	
	           			var html='';
	           			html='<input type="hidden" id="J_payer" class="cbx" name="category" data-payee="'+row.payee+'" data-Header="'+row.payerName+'" data-strpayee="'+row.strPayee+'" data-strpayer="'+row.strPayer+'" data-payee="'+row.payee+'" data-payer="'+row.payer+'" data-receiptNumber="'+row.receiptNumber+'" contract="'+row.receiptId+'">';
	           			return html;
	           		}
		        },
	      	    {field: 'receiptNumber', title: '收据编号', align: 'center'},
	      	    {field: 'strPayer', title: '付款方', align: 'center',
	      	    	formatter: function(value, row, index){	
	           			var html='';
	           			var strPayer = value ? value : '-';
	           			html='<span class="invoicepayerhtml">'+strPayer+'</span>';
	           			return html;
	           		}
	      	    },
	      	    {field: 'payerName', title: '付款单位/个人', align: 'center'},
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
		      	{field: 'printCount', title: '打印张数', align: 'center'},
		      	{field: 'recycleCount', title: '回收张数', align: 'center',
		      		formatter: function(value, row, index){	
	           			var html='';
	           			var returnCount = value ? value : '-';
	           			html='<input type="text" class="form-control input_return" name="" value="">';
	           			return html;
	           		}
		      	},
		      	{field: 'differentReason', title: '回收差异原因', align: 'center',
		      		formatter: function(value, row, index){	
	           			var html='';
	           			var returnDiffReason = value ? value : '-';
	           			html='<input type="text" class="form-control input_val" name="" value="">';
	           			return html;
	           		}
		      	}
	      	],
	      	onCheck: function (row) { 
	      		setcontract();
	        },  
	        onUncheck: function (row) { 
	        	setcontract();
	        },
	        onCheckAll: function (row) { 
	        	setcontract();
	        },
	        onUncheckAll: function (row) { 
	        	setcontract();
	        }
	})
	
	//加载已开发票列表数据项
	$('#J_choosecontract_dataTable').bootstrapTable({ 
		url:basePath + '/finance/invoice/useinfo',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: false,
		striped: true,
		clickToSelect:true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			return {"contractId": contractid}
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data) {
				return { "rows": result.data.invoiceList}
			}
			return { "rows": [], "total": 0 } 
		},

		columns:[
		        {field: '', title :'选择', checkbox:true, align:'center',
		        	formatter: function(value, row, index){	
	           			var html='';
	           			html='<input type="hidden" id="J_payer" class="invoice" name="invoicetype" data-invoiceNumber="'+row.invoiceNumber+'" data-invoiceHeader="'+row.invoiceHeader+'" data-id="'+row.invoiceId+'" data-strpayee="'+row.strPayee+'" data-strpayer="'+row.strPayer+'" data-payee="'+row.payee+'" data-payer="'+row.payer+'">';
	           			return html;
	           		}
		        },
	      	    {field: 'invoiceNumber', title: '发票编号', align: 'center'},
	      	    {field: 'strPayer', title: '付款方', align: 'center'},
	      	    {field: 'strPayee', title : '收款单位', align : 'center'},
	      	    {field: 'invoiceHeader', title: '发票抬头', align: 'center'},
	      	    {field: 'invoiceDate', title: '发票日期', align: 'center',
	      	    	formatter: function(value, row, index) {
	      	    		invoiceDate = value ? value : '-';
						if(value != undefined){
							var html='';
							html= row.invoiceDate.substring(0,10);
							return html;
						}
				    }
	      	    },
		      	{field: 'invoiceName', title: '发票名称', align: 'center'},
		      	{field: 'invoiceAmount', title: '发票面值', align: 'center',
		      		formatter: function(value, row, index){	
	           			var html='';
	           			var invoiceAmount = value ? value : '-';
	           			html='<span class="choose">'+invoiceAmount+'</span>';
	           			return html;
	           		}
		      	}
	      	],  
	        onCheck: function (row) { 
	        	setcontract();
	        },  
	        onUncheck: function (row) { 
	        	setcontract();
	        },
	        onCheckAll: function (row) { 
	        	setcontract();
	        },
	        onUncheckAll: function (row) { 
	        	setcontract();
	        }
	})
	
	
	//待开发票面值收据金额 计算
	function setcontract(){
		var sum=0.00;
		var sumtwo=0.00;
		$("#J_contract_dataTable input[name='btSelectItem']:checkbox").each(function(){
			if (true == $(this).is(':checked')) {
				var checkedvalue=$(this).parent().parent().find(".per").html();			
				sum +=parseFloat(checkedvalue);
				parseFloat(sum).toFixed(2);
				datapayee = $(this).next().data('payee');
			}
		});

		$("#J_choosecontract_dataTable input[name='btSelectItem']:checkbox").each(function(){
			if (true == $(this).is(':checked')) {
				var checkedvalue=$(this).parent().parent().find(".choose").html();			
				sumtwo +=parseFloat(checkedvalue);
				parseFloat(sumtwo).toFixed(2);
				datapayee = $(this).next().data('payee');
			}
		});
		
		$('#sum').text((parseFloat(sum)+parseFloat(sumtwo)).toFixed(2));
	}
	var totalcount;
	var oldvalue;
	
	//已开发票面值金额 计算
	function setcontractamount(){
		var Persons=$('#J_start').val()*1;  //批量添加发票开始所填值
		var totalPersons=$('#J_end').val()*1;  //批量添加发票结束所填值	
		var invoiceAmount = $("#J_invoiceAmount").val();
		for(var i=Persons;i<=totalPersons;i++){
			totalcount = invoiceAmount*(totalPersons-Persons+1);
		}
		totalcount=totalcount*1 + oldvalue*1;
		$('#J_number').text(parseFloat(totalcount).toFixed(2));
		
	}
	
	//单一已开发票面值金额 计算
	function setcontractamountonly(){
		var invoiceAmountonly = $('#J_invoiceAmount').val();
		if(invoiceAmountonly != ''){
			totalcount=invoiceAmountonly*1 + oldvalue*1;
			
		}else{
			totalcount=0.00;
		}
		$('#J_number').text(parseFloat(totalcount).toFixed(2));
	}
	//新增发票弹出框
	$('#J_increase').on('click',function(){
		var veriifyIdArr = [];
		var stepFlag = false;
		var normalpayer = '';
		var contchecked=$("#J_contract_dataTable input[name='btSelectItem']:checked");            // 是否选中收据
		var choosechecked=$("#J_choosecontract_dataTable input[name='btSelectItem']:checked");    // 是否选中发票
		if(contchecked.length>0 || choosechecked.length>0){
			if(contchecked.length>0){
				$('#J_invoicebusinessType').text('收据换发票');
			}
			if(choosechecked.length>0){
				$('#J_invoicebusinessType').text('发票换发票');	
			}
			if(contchecked.length>0 && choosechecked.length>0){
				$('#J_invoicebusinessType').text('发票+收据换发票');
			}
		}else{
			layer.alert("没有选择未开发票以及已开发票收据，请选择");	
			return false;
		}
		var strpayerhtmlType = '';
		var strpayerhtmlName = '';
		if(contchecked.length>0 || choosechecked.length>0){
			if(contchecked.length>0 && choosechecked.length>0){
				$("#J_contract_dataTable input[name='btSelectItem']:checked").each(function(){
					if(true == $(this).is(':checked')){
						strpayerhtmlType = $(this).next().data('strpayer');
					}
				});
				$("#J_choosecontract_dataTable input[name='btSelectItem']:checkbox").each(function(){
					if(true == $(this).is(':checked')){
						strpayerhtmlName = $(this).next().data('strpayer');
					}
				});
				
				if(strpayerhtmlType != strpayerhtmlName){
					layer.alert("付款方选择错误，请重新选择");	
					return false;
				}
			}
		}
		
		$("input[name='btSelectItem']:checked").each(function(index,element){
			var payer = $(this).parent().find('#J_payer').attr('data-payer');		
			if(index==0) normalpayer = payer;
			if(payer == normalpayer){
				veriifyIdArr.push($(this).parent().find('#J_payer').attr('data-id'));
			}else{
				stepFlag = true;
			}
		})
		if(stepFlag) {
			layer.alert("付款方选择不一致，请重新选择");	
			return false;
		}
		var newsinvoiceNumber = [];
		var newsreceiptNumber = [];
		var invoiceNumbertype = '';
		var invoHeader='';
		var payeetype = '';
		var payerhtml = '';
		var strpayerhtml = '';
		commonContainer.modal(
			'新增发票',
			$('#increase_layer'),
			function(index, layero) {
				
				 $("#J_contract_dataTable input[name='btSelectItem']:checked").each(function(){
					var sreceiptNumberID = $(this).next().attr('data-receiptNumber');
					if(true == $(this).is(':checked')){
						newsreceiptNumber.push(sreceiptNumberID);
						strpayerhtml = $(this).next().data('strpayer');
						invoHeader = $(this).next().attr('data-Header');
						payeetype = $(this).next().data('payee');
						payerhtml = $(this).next().data('payer');
					};
					
				});
				
				
				$("#J_choosecontract_dataTable input[name='btSelectItem']:checkbox").each(function(){
					var invoiceNumberID = $(this).next().attr('data-invoiceNumber');
					if(true == $(this).is(':checked')){
						newsinvoiceNumber.push(invoiceNumberID);
						strpayerhtml = $(this).next().data('strpayer');
						invoHeader = $(this).next().attr('data-invoiceHeader');
						payeetype = $(this).next().data('payee');
						payerhtml = $(this).next().data('payer');
						invoiceNumbertype = $(this).next().data('invoiceNumber');
					}
				});
				var singletext = $('#J_invoiceNumber').val();
				var invoicetype = $('#J_invoicebusinessType').html();
				var invoicetypeNum = '';
				if(invoicetype == '收据换发票'){
					invoicetypeNum = '1';
				}else if(invoicetype == '发票换发票'){
					invoicetypeNum = '2';
				}else if(invoicetype == '发票+收据换发票'){
					invoicetypeNum = '3';
				}
				var datatime = $('#J_singlewatch_backtime').val();
				var invoName = $("#J_invoiceName").val();
				var invoiceAmount = $("#J_invoiceAmount").val();
				var invonum = $('#J_invoiceNumber').val();
				if(invoName =="1"){
					invoName ="服务费";
				}else{
					invoName ="违约金";
				}
				var Persons=$('#J_start').val()*1;  //批量添加发票开始所填值
				var totalPersons=$('#J_end').val();  //批量添加发票结束所填值	
				var html='';
				var content=[];
				totalcount="0.00";
				if(singletext != ''){
					if(invoName == ''){
						layer.alert('发票名称不能为空');	
						return false;
					}
					if(datatime ==''){
						layer.alert('发票日期不能为空');	
						return false;
					}
					if(singletext == ''){
						layer.alert('发票编号不能为空');	
						return false;
					}
					if(invoiceAmount == ''){
						layer.alert('发票面值不能为空');	
						return false;
					}
					
					var newfp='';
					var newFpdata='';
					
					newFpdata=JSON.stringify({
						invoiceAmount: invoiceAmount,
						invoiceDate: datatime,
						invoiceHeader: invoHeader,
						invoiceName: invoName,
						invoiceNumber: invonum,
						invoiceType: invoicetypeNum,
						oldInvoiceNumbers: newsinvoiceNumber.length==0?"":newsinvoiceNumber.join(','),
						oldReceiptNumbers: newsreceiptNumber.length==0?"":newsreceiptNumber.join(','),
						payee: payeetype,
						payer: payerhtml
					});
					var newfp='data-newfp='+"'"+newFpdata+"'";
					
					html='\
						<tr class="newfp" '+newfp+'>\
							<td class="add_create" style="text-align: center;"><input data-invoicetype="'+invoicetype+'" data-payerhtml="'+payerhtml+'" data-datatime="'+datatime+'" data-invoName="'+invoName+'" data-invoHeader="'+invoHeader+'" data-invonum="'+invonum+'" data-invoiceAmount="'+invoiceAmount+'" data-newsreceiptNumber="'+newsreceiptNumber+'" data-newsinvoiceNumber="'+newsinvoiceNumber+'" type="checkbox" name="category"></td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+invoicetype+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+strpayerhtml+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+datatime+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+invoName+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+invoHeader+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+invonum+'</td>\
							<td class="add_create chooseall" style="text-align: center; padding:8px;">'+invoiceAmount+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+(newsreceiptNumber.length==0?"":newsreceiptNumber)+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+(newsinvoiceNumber.length==0?"":newsinvoiceNumber)+'</td>\
						</tr>';
					$('#J_Newinvoice_dataTable tbody').append(html);
					oldvalue = $('#J_number').html();
					setcontractamountonly();
				}else{
							
					if(invoName == ''){
						layer.alert('发票名称不能为空');	
						return false;
					}
					if(datatime ==''){
						layer.alert('发票日期不能为空');	
						return false;
					}
					if(Persons == '' && totalPersons == ''){
						layer.alert('发票编号不能为空');	
						return false;
					}
					if(invoiceAmount == ''){
						layer.alert('发票面值不能为空');	
						return false;
					}
					var newfp='';
					var newFpdata='';
					for(var i=Persons;i<=totalPersons;i++){
						var indexsize=i;
						newFpdata=JSON.stringify({
							invoiceAmount: invoiceAmount,
							invoiceDate: datatime,
							invoiceHeader: invoHeader,
							invoiceName: invoName,
							invoiceNumber: indexsize,
							invoiceType: invoicetypeNum,
							oldInvoiceNumbers: newsinvoiceNumber.length==0?"":newsinvoiceNumber.join(','),
							oldReceiptNumbers: newsreceiptNumber.length==0?"":newsreceiptNumber.join(','),
							payee: payeetype,
							payer: payerhtml
						});
						var newfp='data-newfp='+"'"+newFpdata+"'";
						
						html='\
							<tr class="newfp" '+newfp+'>\
								<td class="add_create" style="text-align: center;"><input data-invoicetype="'+invoicetype+'" data-payerhtml="'+payerhtml+'" data-datatime="'+datatime+'" data-invoName="'+invoName+'" data-invoHeader="'+invoHeader+'" data-indexsize="'+indexsize+'" data-invoiceAmount="'+invoiceAmount+'" data-newsreceiptNumber="'+newsreceiptNumber+'" data-newsinvoiceNumber="'+newsinvoiceNumber+'" type="checkbox" name="category" invoice="'+index+'"></td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+invoicetype+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+strpayerhtml+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+datatime+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+invoName+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+invoHeader+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+indexsize+'</td>\
								<td class="add_create chooseall" style="text-align: center; padding:8px;">'+invoiceAmount+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+(newsreceiptNumber.length==0?"":newsreceiptNumber)+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+(newsinvoiceNumber.length==0?"":newsinvoiceNumber)+'</td>\
							</tr>';
						content.push(html);
					}
					$('#J_Newinvoice_dataTable tbody').append(content.join(''));	
					
					oldvalue = $('#J_number').html();
					
					setcontractamount();
				}
				layer.close(index);	
			}, 
			{
				overflow :true,
				area : ['60%'],
				btns : ['确定', '取消'],
				success: function() {
					$("#J_invoiceName").html('');
					$("#J_invoiceAmount").val('');
					$("#J_start").val('');
					$("#J_end").val('');
					$("#J_invoiceNumber").val('');
					var invoHeaderpop='';
					var strPayerpop = '';
					$("#J_contract_dataTable input[name='btSelectItem']:checked").each(function(){
						if(true == $(this).is(':checked')){
							strPayerpop = $(this).next().attr('data-strPayer');
							invoHeaderpop = $(this).next().attr('data-Header');
						}
						
					});
					$("#J_choosecontract_dataTable input[name='btSelectItem']:checkbox").each(function(){
						if(true == $(this).is(':checked')){
							strPayerpop = $(this).next().attr('data-strPayer');
							invoHeaderpop = $(this).next().attr('data-invoiceHeader');
						}
					});
					$('#J_strPayer').text(strPayerpop);
					$('#J_invoiceHeader').text(invoHeaderpop);
					//批量增加发票
					$('#J_click').on('click',function(){
						$('#J_show').show();
						$('#J_showblock').hide();
						$('#J_increaseshow').show();
						$('#J_click').hide();
						$('#J_blockbox').show();
						$('#J_nonebox').hide();
						$("#J_start").change(function(){
							$("#J_contract_dataTable input[name='btSelectItem']:checkbox").each(function(){
								if (true == $(this).is(':checked')) {
									datapayee = $('#J_payer').data('payee');
								}
							});
							searchInvoice($("#J_start"), true, 'right',$("#J_invoiceNumber").val(),datapayee);
						})
						$("#J_end").change(function(){
							$("#J_contract_dataTable input[name='btSelectItem']:checkbox").each(function(){
								if (true == $(this).is(':checked')) {
									datapayee = $('#J_payer').data('payee');
								}
							});
							searchInvoice($("#J_end"), true, 'right',$("#J_invoiceNumber").val(),datapayee);
						})
					})
					
					//单一增加发票
					$('#J_increaseshow').on('click',function(){
						$('#J_show').hide();
						$('#J_showblock').show();
						$('#J_increaseshow').hide();
						$('#J_click').show();
						$('#J_blockbox').hide();
						$('#J_nonebox').show();
					})
					//初始化人员类型数据
					dimContainer.buildDimChosenSelector($("#J_invoiceName"), "invoiceName", "1");
					$("#J_singlewatch_backtime").val(laydate.now(0, 'YYYY-MM-DD'));
					$("#J_invoiceNumber").change(function(){
						$("#J_contract_dataTable input[name='btSelectItem']:checkbox").each(function(){
							if (true == $(this).is(':checked')) {
								datapayee = $('#J_payer').data('payee');
							}
						});
						searchInvoice($("#J_invoiceNumber"), true, 'right',$("#J_invoiceNumber").val(),datapayee);
					})
				}
			}
		);
	})
	
	//删除批量删除新开发票数据	
	$('#J_delete').on('click',function(){
		if($("input[name='category']:checked").length==0){
			layer.alert("请选择需要删除的发票");
			return false;
		}
		var  sumall = $('#J_number').html();
		$("input[name='category']:checked").each(function(){			
			var checkedvalueall=$(this).parent().parent().find(".chooseall").html();	
			$(this).parent().parent().remove();	
			sumall=parseFloat(sumall);
			checkedvalueall=parseFloat(checkedvalueall);
			sumall -=checkedvalueall;
			parseFloat(sumall).toFixed(2);
			
		})	
		$('#J_number').text(parseFloat(sumall).toFixed(2));
	})
	//点击保存 发票数据保存
	
	$('#J_save').on('click',function(){
		var setcontract = $('#sum').html();
		var setcontractamount = $('#J_number').html();
		var invonum = $('#J_invoiceNumber').val();
		var	dataindexsize='';
		var datainvoicetype = '';
		var	datapayerhtml = '';
		var	datadatatime = '';
		var	datainvoName = '';
		var	datainvoHeader = '';
		var	datainvoiceAmount = '';
		var	datanewsreceiptNumber = '';
		var	datanewsinvoiceNumber = '';
		$("#J_Newinvoice_dataTable input[name='category']:checked").each(function(){
			datainvoicetype= $(this).attr('data-invoicetype');
			datapayerhtml=$(this).attr('data-payerhtml');
			datadatatime=$(this).attr('data-datatime');
			datainvoName=$(this).attr('data-invoName');
			datainvoHeader=$(this).attr('data-invoHeader');
			datainvoiceAmount=$(this).attr('data-invoiceAmount');
			datanewsreceiptNumber=$(this).attr('data-newsreceiptNumber');
			datanewsinvoiceNumber=$(this).attr('data-newsinvoiceNumber');
			if(invonum != ''){ // 判断是否批量开发票
//				isBatchnumber = 0;
				dataindexsize = $(this).attr('data-indexsize');
			}else{
//				isBatchnumber = 1;
				dataindexsize = $(this).attr('data-invonum');
			}
		});
		var oldInvoiceListcheck = $('#J_choosecontract_dataTable').bootstrapTable('getSelections');
		var oldReceiptListcheck = $('#J_contract_dataTable').bootstrapTable('getSelections');
		var printCountnum = oldReceiptListcheck.printCount;   // 获取到打印张数 值
		var oldReceiptListval = [];
		var returnCountval = [];
		$("#J_contract_dataTable input[name='btSelectItem']:checked").each(function(){
			if($(this).parent().parent().find('.input_return').val() == '') {
				layer.alert("请填写收据的回收张数");
				return false;
			}
			oldReceiptListval.push($(this).parent().parent().find('.input_val').val());
			returnCountval.push($(this).parent().parent().find('.input_return').val());  // 回收张数
		})

		if($("input[name='btSelectItem']:checked").length<=0){  //判断验证 没有选择发票或者收据 不能保存
			layer.alert("没有选中收据或者发票，不能保存");
			return false;
		};		
		size();
		function size(){
			if(oldReceiptListcheck > 0){
				for(var i=0;i<printCountnum.length; i++){
					if(printCountnum[i]>returnCountval && oldReceiptListval.length=='0'){
						layer.alert("填写回收差异原因");
						return false;
		            }  
				} 
			}
			
		}
		
		if(parseFloat(setcontract) == parseFloat(setcontractamount)){
			//获取就旧发票数据
			var oldInvoiceList=[];
			$.each(oldInvoiceListcheck,function(i,n){
				oldInvoiceList.push({
					invoiceId:n.invoiceId,
					invoiceNumber:n.invoiceNumber
				});
			});
			var datanewfplist = [];
			var flag = false;
			var num = $('#J_Newinvoice_dataTable .newfp').data('newfp').invoiceName;
			$('#J_Newinvoice_dataTable .newfp').each(function(i){
				if(i>0){
					if(num != $(this).data('newfp').invoiceName){
						layer.alert('发票名称不一致，不能保存');
						flag = true;
						return false;
					}
				}
				datanewfplist.push($(this).data('newfp'));
			})
			if(flag){
				return false;
			}
			var oldReceiptList=[];
			$.each(oldReceiptListcheck,function(i,n){
				oldReceiptList.push({
					printCount: n.printCount,
					receiptId: n.receiptId,
					receiptNumber: n.receiptNumber,
					refundAmount: n.amount
				});
			});
			$("#J_contract_dataTable input[name='btSelectItem']:checked").each(function(index){
				oldReceiptList[index].returnCount=$(this).parent().parent().find('.input_return').val();
				oldReceiptList[index].returnDiffReason=$(this).parent().parent().find('.input_val').val();
			});
			jsonPostAjax(
				basePath + '/finance/invoice/use',
				{	
					"contractId":contractid,
					"contractNumber":$('#J_Contract').text(),
					"newInvoiceList":datanewfplist,
					"oldInvoiceList":oldInvoiceList,
					"oldReceiptList":oldReceiptList	
				},
				function(result) {			
					layer.msg("操作成功");
					window.opener=null;
					window.open('','_self');
					window.close();
				}	
			)
		}else{
			layer.alert("待开发票与已开发票面值不相等，从新开发票");
			return false;
		}	
	})
	
})


//发票编号模糊匹配
function searchInvoice($container, isShowBtn, listAlign,iterinvoiceval,datapayee) {
	var itemArr = new Array();
	if(iterinvoiceval.length>=4){
		jsonAjax(
			basePath + '/finance/invoice/getShopListByPayee.htm', 
			{
				"payee":datapayee,
				"lastFourNumber":$('#J_invoiceNumber').val()
			}, 
			function(result) {
				$.each(result.data, function(n, value) {
					 var data = value.invoiceNumber;
					 
					 var dataArr = new Object();
					 dataArr.name = value.invoiceNumber;
					 dataArr.data = data;
					 
					 itemArr.push(dataArr);
				 });
				searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
			})
	}else{
		return false;
	}
	
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 


