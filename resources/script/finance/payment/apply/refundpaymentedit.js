var index=0;
var tuikuanSum=null;
var paymentfundName = '';
var ownerName = '';
var clientName = '';
var categoryName='';
var remarkval='';

var editerPayeetype='';
var editerPayeename='';
var editerfinanceCardType ='';
var editerDocumentnumber = '';
var flagtype = true;
var fundcodenumber = '';
var datauesrId='';

var contractid=getQueryString("contractNo");
var chargebackId=getQueryString("chargebackid");
var chargebackNumber=getQueryString("chargebacknumber");
var ischargebackId=getQueryString("isChargebakcid");
var selectionId=getQueryString("selection");
var applyid = getQueryString("applyId");
var attListApplydataresult ='';
var thiscontractId='';
var resultdatabusinessType='';
var dataresultdata='';
var newscontractNumber = '';
var newscontractId = '';
var newsclientId = '';
var dataresultObj ='';
$(function() {
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	
	//证件类型
	dimContainer.buildDimChosenSelector($('#J_financeCardType'),'paymentCardType','');
	
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	
	$('#J_Choosecontract').val('1');
	$('#J_Choosecontract').trigger("chosen:updated");
	
	$('#J_reset').on('click',function(){
		commonContainer.closeWindow();
	})
	
	if(contractid){
		if(ischargebackId == 0){
			$('#J_annex').show();
			$('#J_paymentbutton').text('提交');
		}else{
			$('#J_annex').hide();
			$('#J_paymentbutton').text('保存');
		}
		$('#J_annex').hide();
		$('#J_iboxpay').hide();
		$('#J_iboxpay_finance').show();
		$('#J_selectContract').hide();
		// 根据applyId 获取修改数据以及回显数据
		jsonGetAjax(
			basePath+'/finance/payment/apply/getUpdateApplyInfo',
			{
				applyId:applyid                                                 //付款申请单ID
			},
			function(result){
				//获取选择是合同编号还是客户编号
				newscontractNumber = result.data.applyInfo.contractNumber;
				newscontractId = result.data.applyInfo.contractId;
				newsclientId = result.data.applyInfo.clientId;
				//获取申请人
				$('#J_userName').html(result.data.applyInfo.createByName);
				$('#addContractNumbernews').val(result.data.paymentInfoList[0].newContractNumber);
				$('#J_applyadd').val(result.data.applyInfo.remarks);
				$('#J_annex').show();
				//回显合同编号
				$('#J_Choosecontract').val(1);
				$('#J_Choosecontract').trigger('chosen:updated');
				$('#addContractNum').show();
				$('#addclientNum').hide();
				$('#J_iboxpay_finance').show();
				$('#J_iboxpay').hide();
				//回显合同信息
				$('#addContractNumber').val(result.data.applyInfo.contractNumber);	
				$('#J_Contract_h').text(result.data.applyInfo.contractNumber?result.data.applyInfo.contractNumber:'-');
				$('#J_typecontract_h').text(result.data.applyInfo.strContractType?result.data.applyInfo.strContractType:'-');
				$('#J_diaplaynone').text(result.data.applyInfo.businessType?result.data.applyInfo.businessType:'-');
				$('#J_houseId_h').text(result.data.applyInfo.houseId?result.data.applyInfo.houseId:'-');
				$('#J_clientId_h').text(result.data.applyInfo.clientId?result.data.applyInfo.clientId:'-');
				$('#J_ownerName_h').text(result.data.applyInfo.ownerName?result.data.applyInfo.ownerName:'-');
				$('#J_clientName_h').text(result.data.applyInfo.clientName?result.data.applyInfo.clientName:'-');
				ownerName = result.data.applyInfo.ownerName;
				clientName = result.data.applyInfo.clientName;
				applyIdNumber = result.data.applyInfo.applyId;
				thiscontractId=result.data.applyInfo.contractId;
				resultdatabusinessType = result.data.applyInfo.contractType;
				dataresultdata = result.data.receiptList;
				dataresultObj = result.data.paymentInfoList;
				var gapReceipdataresult = result.data.gapReceiptList;
				attListApplydataresult = result.data.attList;
				recptList(dataresultdata);
				fukuanmessage(dataresultObj);
				gapReceiptListApply(gapReceipdataresult);
				attListApply(attListApplydataresult);
			}
		)
	}else{
		$('#J_iboxpay').show();
		$('#J_iboxpay_finance').show();
		$('#J_annex').show();
		$('#J_selectContract').show();
		// 根据applyId 获取修改数据以及回显数据
		jsonGetAjax(
			basePath+'/finance/payment/apply/getUpdateApplyInfo',
			{
				applyId:applyid                                                 //付款申请单ID
			},
			function(result){
				//获取选择是合同编号还是客户编号
				newscontractNumber = result.data.applyInfo.contractNumber;
				newscontractId = result.data.applyInfo.contractId;
				newsclientId = result.data.applyInfo.clientId;
				//获取申请人
				$('#J_userName').html(result.data.applyInfo.createByName);
				$('#addContractNumbernews').val(result.data.paymentInfoList[0].newContractNumber);
				$('#J_applyadd').val(result.data.applyInfo.remarks);
				$('#J_annex').show();
				if(newscontractNumber!=''){
					//回显合同编号
					$('#J_Choosecontract').val(1);
					$('#J_Choosecontract').trigger('chosen:updated');
					$('#addContractNum').show();
					$('#addclientNum').hide();
					$('#J_iboxpay_finance').show();
					$('#J_iboxpay').hide();
					//回显合同信息
					$('#addContractNumber').val(result.data.applyInfo.contractNumber);	
					$('#J_Contract_h').text(result.data.applyInfo.contractNumber?result.data.applyInfo.contractNumber:'-');
					$('#J_typecontract_h').text(result.data.applyInfo.strContractType?result.data.applyInfo.strContractType:'-');
					$('#J_diaplaynone').text(result.data.applyInfo.businessType?result.data.applyInfo.businessType:'-');
					$('#J_houseId_h').text(result.data.applyInfo.houseId?result.data.applyInfo.houseId:'-');
					$('#J_clientId_h').text(result.data.applyInfo.clientId?result.data.applyInfo.clientId:'-');
					$('#J_ownerName_h').text(result.data.applyInfo.ownerName?result.data.applyInfo.ownerName:'-');
					$('#J_clientName_h').text(result.data.applyInfo.clientName?result.data.applyInfo.clientName:'-');
					ownerName = result.data.applyInfo.ownerName;
					clientName = result.data.applyInfo.clientName;
					applyIdNumber = result.data.applyInfo.applyId;
					thiscontractId=result.data.applyInfo.contractId;
					resultdatabusinessType = result.data.applyInfo.contractType;
					dataresultdata = result.data.receiptList;
					dataresultObj = result.data.paymentInfoList;
					var gapReceipdataresult = result.data.gapReceiptList;
					attListApplydataresult = result.data.attList;
					recptList(dataresultdata);
					fukuanmessage(dataresultObj);
					gapReceiptListApply(gapReceipdataresult);
					attListApply(attListApplydataresult);
				}else{
					//回显客户信息
					$('#J_clientId').text(result.data.applyInfo.clientId);
					$('#J_clientname').text(result.data.applyInfo.clinetName);
					$('#addContractNumber').val(result.data.applyInfo.clinetName);
					applyIdNumber = result.data.applyInfo.applyId;
					thiscontractId=result.data.applyInfo.contractId;
					dataresultdata = result.data.receiptList;
					dataresultObj = result.data.paymentInfoList;
					var gapReceipdataresult = result.data.gapReceiptList;
					attListApplydataresult = result.data.attList;
					recptList(dataresultdata);
					fukuanmessage(dataresultObj);
					gapReceiptListApply(gapReceipdataresult);
					attListApply(attListApplydataresult);
				}
			}
		);
		attachmentView.init();
	}
			//加载收据列表数据项(公用方法在客户编号与合同编号带出的收据列表)
			function recptList(dataresultdata){
				if(dataresultdata){
					$('#J_refunds_dataTable').bootstrapTable('destroy');
					$('#J_refunds_dataTable').bootstrapTable({
						data:dataresultdata,
						columns:[
					        {field: 'flyid',title :'序号',checkbox:true, align: 'center',
				           		formatter: function(value, row, index){	
				           			if(row.refundAmount > 0){
				           				return {
				           		            disabled : true,//设置是否可用
				           		            checked : true//设置选中
				           		        };
				           			}
				           		}
				           	},
				      	    {field: 'batchId', title: '收款批次号', align: 'center'},
				      	    {field: 'receiptNumber', title: '收据编号', align: 'center'},
				      	    {field: 'strPayer', title: '付款方', align: 'center',
				      	    	formatter: function(value, row, index){	
				           			var html='';
				           			var strPayer = value ? value : '-';
				           			html='<input class="paymentstrPayer" type="hidden" value="'+row.strPayer+'" ><span>'+strPayer+'</span>';
				           			return html;
				           		}
				      	    },
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
				      	    {field: 'refundAmount', title: '退款金额', align: 'center',
				      	    	formatter: function(value, row, index){	
				           			var html='';
				           			var refundAmount = value ? value : '-';
				           			html='<input id="zhuan'+index+'" type="text" class="form-control input_return zhuankuan" name="" readonly value="'+row.refundAmount+'" placeholder="0.00">';
				           			return html;
				           		}
				      	    },
				      	    {field: 'invoiceNumbers', title: '发票编号', align: 'center'},
					      	{field: 'printCount', title: '收据打印张数', align: 'center'},
					      	{field: 'recycleCount', title: '收据回收张数', align: 'center',
					      		formatter: function(value, row, index){
					      			var recycleCount=value?value:'-';
				      				var html='';
				           			html='<input id="'+index+'" type="text" class="form-control input_return" name="" readonly value="'+row.recycleCount+'">';
				           			return html;
				           		}
					      	},
					      	{field: 'differentReason', title: '回收差异原因', align: 'center',
					      		formatter: function(value, row, index){
					      			var differentReason=value?value:'-'
					      			if(differentReason !=undefined){
					      				var html='';
					           			html='<input type="text" id="yin'+index+'" class="form-control input_val" name="" readonly value="'+differentReason+'">';
					           			return html;
					      			}else{
					      				var html='';
					           			html='<input type="text" id="yin'+index+'" class="form-control input_val" name="" readonly value="-">';
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
					btSelectItem.each(function(){
						var zhuanMoney = $('#zhuan'+$(this).data('index')).val();
						if(zhuanMoney>0){
							$(this).attr("checked",true);
						}
					});
					btSelectItem.off().on('click',function(){
						if($(this).is(':checked')){
							$('#'+$(this).data('index')).prop('readonly',true);
							$('#zhuan'+$(this).data('index')).prop('readonly',true);
							$('#yin'+$(this).data('index')).prop('readonly',true);
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
						if (/^\d+$/.test(this.value)) {
			                this.value = this.value + '.00';
			            }
						if(e.type=='focus'){
							value=$(this).val()*1;
							mun-=$(this).val()*1;
						}else{
							if(value!==$(this).val()*1){
								mun+=$(this).val()*1;
							}
							$('#J_paymentmoeny').html(mun.toFixed(2));
						}
					});
					
					// 选中金额计算$('#J_paymentmoeny').html(mun);
					$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
						if($(this).is(':checked')){
							mun+=$('#zhuan'+$(this).data('index')).val()*1;
						}
						$('#J_paymentmoeny').html(mun);
					})
				}
			};
			//加载付款信息列表数据项(公用方法在客户编号与合同编号带出的付款新增列表)
			function fukuanmessage(dataresultObj){
				if(dataresultObj){
					$('#J_paymententry_dataTable').bootstrapTable('destroy');
					$('#J_paymententry_dataTable').bootstrapTable({
						data:dataresultObj,
						columns:[
							{field: 'collectionBatchId', title: '收款批次', align: 'center',
								formatter: function(value, row, index) {
									var html = '';
									html = '<input class="collectionBatchId" type="hidden" value="'+row.collectionBatchId+'"><span>'+ row.collectionBatchId +'</span>';
				      				return html;
								}
							},
							{field: 'strPayType', title: '付款方式', align: 'center'},
							{field: 'fundName', title: '付款款项', align: 'center'},
							{field: 'payAmount', title: '付款金额', align: 'center',
								formatter: function(value, row, index) {
									var html = '';
									html = '<span>'+ row.payAmount +'</span>';
									$('#J_paymentpopmoeny').text(row.payAmount+'元');
				      				return html;
								}
							},
							{field: 'bankAccount', title: '账号', align: 'center'},
							{field: 'isInvoiceStatus', title: '开户人/收款人<br>/收款单位', align: 'center',
								formatter: function(value, row, index) {
				      				var html = '';
				      				var receiverAllName = '';
				      				if(row.payType == '1'){ //现金
				      					receiverAllName = row.receiverName?row.receiverName:'-';
				      				}else if(row.payType == '2'){//支票
				      					receiverAllName = row.receiverUnit?row.receiverUnit:'-';
				      				}else if(row.payType == '3'){//转账
				      					receiverAllName = row.accountHolder?row.accountHolder:'-';
				      				}else if(row.payType == '4'){//退POS
				      					receiverAllName = row.receiverName?row.receiverName:'-';
				      				}
				      				html = '<span>'+ receiverAllName +'</span>';
				      				return html;
				      	    	}
							},
							{field: 'opt', title: '操作', align: 'center',
						    	formatter: function(value, row, index) {
						    		var html = '';
						    		$.ajax({
						    			url : basePath + '/finance/payment/getPaymentInfo',
						    			data : {"paymentId":row.paymentId},
						    			type : 'get',
						    			dataType : 'json',
						    			cache : false,
						    			async: false,
						    			success : function(paymententry) {
						    				row.fundCode = dataresultdata.fundCode;
								    		row.receiverType = paymententry.data.receiverType;
								    		row.receiverCardNumber = paymententry.data.receiverCardNumber;
								    		row.receiverCardType = paymententry.data.receiverCardType;
						    				var addlistname = JSON.stringify(row);
								    		var dataobj='data-obj='+addlistname;
						    				if (paymententry.code == 0) {
						    					html = '<a type="modify" '+dataobj+' class="btn btn-outline btn-success btn-xs btn-payment" data-isjk="1">修改</a>&nbsp;&nbsp;<a type="del" class="btn btn-outline btn-danger btn-xs">删除</a>'		 	
						    				} else {
						    					layer.alert(paymententry.msg);
						    				}
						    				var payAmount = paymententry.data.payAmount;
						    				tuikuanSum+=payAmount;
						    				$('#J_paymentpopmoeny').text(tuikuanSum);
						    			},
						    			error : function(){
						    				layer.alert(errorMsg);
						    			}
						    		});			 
				      				return html;
				      	    	}
						    }
				          ]
					})
				}
			};
			
			//差额收据列表
			function gapReceiptListApply(gapReceipdataresult){
				if(gapReceipdataresult){
					$('#J_gapReceiptList_dataTable').bootstrapTable('destroy');
					$('#J_gapReceiptList_dataTable').bootstrapTable({
						data:gapReceipdataresult,
						columns: [ 	
						    {field: 'receiptNumber', title: '新收据编号', align: 'center',
						    	formatter: function (value, row, index) {
						    		var html = '';
				                	var receiptNumber = value?value:'-';
				                	var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.receiptId;
				                	html = '<a href="'+url+'" target="_blank">'+row.receiptNumber+'</a>';
				                    return html;
				                }
						    },
						    {field: 'payertime', title: '生成时间', align: 'center'},
						    {field: 'batchId', title: '收款批次号', align: 'center'},
						    {field: 'parentReceiptNumber', title: '原收据编号', align: 'center',
						    	formatter: function (value, row, index) {
						    		var html = '';
				                	var parentReceiptNumber = value?value:'-';
				                	var url = basePath+"/finance/receipt/detail.htm?receiptId="+row.parentReceiptId;
				                	html = '<a href="'+url+'" target="_blank">'+row.parentReceiptNumber+'</a>';
				                    return html;
				                }
						    },
						    {field: 'invoiceNumbers', title: '发票编号', align: 'center'},
						    {field: 'strPayer', title: '付款方', align: 'center'},
						    {field: 'strPayee', title: '收款单位', align: 'center'},
						    {field: 'fundName', title: '款项', align: 'center'},
						    {field: 'amount', title: '收据金额', align: 'center'},
						    {field: 'isInvoiceStatus', title: '开票状态', align: 'center'},
						    {field: 'printStatus', title: '打印状态', align: 'center'},
						    {field: 'recycleStatus', title: '是否回收', align: 'center'},
						    {field: 'printCount', title: '收据打印张数', align: 'center'},
						    {field: 'recycleCount', title: '收据回收张数', align: 'center'},
						    {field: 'differentReason', title: '回收差异原因', align: 'center'}
						]
					})
				}
			};
			
			//附件信息加载
			function attListApply(attListApplydataresult){
				if(attListApplydataresult){
					$('#J_list_dataTable').bootstrapTable('destroy');
					$('#J_list_dataTable').bootstrapTable({
						data:attListApplydataresult,
						columns: [ 	
				           	{field: 'SerialNumber',title :'序号',align: 'center',
				           		formatter: function(value, row, index) {
				      				return index+1;
				      	    	}
				           	},
				            {field: 'largeTypeName', title: '附件大类', align: 'center'},
						    {field: 'smallTypeName', title: '附件小类', align: 'center'},
						    {field: 'createTime', title: '上传日期', align: 'center'},
						    {field: 'opt', title: '操作', align: 'center',
						    	formatter: function(value, row, index) {
						    		var remark = row.remarks.encodeHTML();
				    				var fundNameType = row.fundName;
				    				var fundCodeType = row.fundCode;
				    				var businesstypeNameType = row.businessTypeName
						    		var applyAttId = row.attId;
						    		var html = '';
						    		$.ajax({
						    			url : basePath + '/finance/payment/apply/selectPaymentApplyAttPathByAttId',
						    			data : {"attId":applyAttId},
						    			type : 'get',
						    			dataType : 'json',
						    			cache : false,
						    			async: false,
						    			success : function(applyIdresult) {
						    				var largeTypeName = row.largeTypeName;
						    				var smallTypeName = row.smallTypeName;
						    				var largeType = row.largeType;
						    				var smallType = row.smallType;
						    				if(row.largeType == undefined){
						    					largeType ='';
						    				};
						    				if(row.smallType == undefined){
						    					smallType ='';
						    				};
						    				var dataObj=JSON.stringify(applyIdresult.data);
						    				var dataobjval = 'data-add='+dataObj;
						    				if (applyIdresult.code == 0) {
						      					html = '<a onclick="yulanfujian(this)" '+dataobjval+' data-smallTypeName="'+smallTypeName+'" data-largeTypeName="'+largeTypeName+'" data-fundname="'+fundNameType+'" data-fundcode="'+fundCodeType+'" data-businesstypename="'+businesstypeNameType+'" data-attId="'+row.attId+'" data-smallannexnum="'+smallType+'" data-biggerannexnum="'+largeType+'" data-remark="'+remark+'" data-titlename="'+row.largeTypeName+'" data-newstime="'+row.createTime+'" class="btn btn-outline btn-success btn-xs btn_looktype">预览</a>&nbsp;&nbsp;<a onclick="deletefujian(this)" type="del" class="btn btn-outline btn-danger btn-xs">删除</a>'		 	
						    				} else {
						    					layer.alert(applyIdresult.msg);
						    				}
						    			},
						    			error : function(){
						    				layer.alert(errorMsg);
						    			}
						    		});
							    	return html;
				      	    	}
						    }
						]
					})
				}
			}
			attachmentView.init(dataresultdata);	
});



//点击预览按钮预览附件
function yulanfujian($_this){
	jsonGetAjax(
		basePath + '/finance/payment/apply/getUpdateApplyInfo',{
			"applyId":applyIdNumber,
		},function(result){
			commonContainer.modal('查看附件',$('#J_objattachmentCon'),function(i){
				layer.close(i);
				$('#J_objupFileName').html('');
			},{
				btns:['关闭'],
				area:['800px','400px'],
				overflow :true,
				success:function(){
					$('#J_upFileName').html('');
					var attId = $($_this).data('attid');
					var dataobj = $($_this).data('add');
					var remarks = $($_this).data('remark');
					var largeTypeName = $($_this).data('largetypename');
					var smallTypeName = $($_this).data('smalltypename');
					var fundName = $($_this).data('fundname');
					var businessTypeName = $($_this).data('businesstypename');
					$('#J_objbusinesstype').text(businessTypeName);
					$('#J_objPaymenttextval').html(fundName);
					$('#J_objbigger').html(largeTypeName);
					$('#J_objsmall').html(smallTypeName);
					$('#J_objtitleName').html(largeTypeName);
					$('#J_objvalremark').html(remarks);
					var htmlnews='';
					jsonGetAjax(
						basePath + '/finance/payment/apply/selectPaymentApplyAttPathByAttId',{
							"attId":attId,
						},function(dataresult){
							$.each(dataresult.data, function(pathIndex, pathInfo){
								 htmlnews+='\
					    			<div class="col-md-3" style="padding-top:18px;text-align: center;">\
					    				<img src="'+pathInfo.path+'" width="80%" height="100">\
					    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+pathInfo.title+'</div>\
					    				<button type="button" data-opt="del" class="btn btn-outline btn-success btn-xs mt-3" onclick="attachmentView.download(\''+pathInfo.path+'\')">下载</button>\
				    				</div>';
							})
							$('#J_objupFileName').append(htmlnews);
						}
					);
				}
			});
		}
	)
}

//删除附件数据
function deletefujian(_this){
	var trlength = $('#J_list_dataTable tbody').find('tr').length;
	if(trlength>0){
		commonContainer.confirm(
			'是否确认删除信息？',function(index, layero){
				$(_this).parent().parent().remove();
				layer.close(index);
			}
		);
	}
}

//付款信息新增
var Payeetypeval = '';
$('#J_increaseCheck').off().on('click',function(){
	Payeetypeval = $('#J_Payeetype').val();
/*	//判断是否选中收据信息
	var checklength = $("#J_refunds_dataTable input[name='btSelectItem']:checked").length;
	if(checklength==0){
		layer.alert("请选择收据信息");
		return false;
	}*/
	var paymentevaluate = $('#J_payment').val();
	// 判断收据单列表所选项收据批次号是否相同
	var stepFlag = false;
	var normalAuditStep = '';
	var strPayerArr=[];
	var strPayeeArr=[];
	var strfundNameArr=[];
	var strallArr=[];
	var strfundCodeArr = [];
	$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(index,element){
		var batchId = $(this).parent().find('#J_auditId').attr('data-batchId');
		
		//付款方是否相等
		strPayerArr.push(dataresultdata[$(this).data('index')].strPayer);
		//收款单位是否相等
		strPayeeArr.push(dataresultdata[$(this).data('index')].strPayee);
		//款项是否相等
		strfundNameArr.push(dataresultdata[$(this).data('index')].fundName);
		//款项编号
		strfundCodeArr.push(dataresultdata[$(this).data('index')].fundCode);
		strallArr.push(dataresultdata[$(this).data('index')]);
		if(index==0) normalAuditStep = batchId;
		if(batchId != normalAuditStep){	
			stepFlag = true;
		}
	});
	var isfuk=false;
	var isfukdw=false;
	var isfundName=false;
	//判断付款发是否相等
	for(var i=1;i<strPayerArr.length;i++){
		if(strPayerArr[0]!==strPayerArr[i]){
			isfuk=true;
			break;
		}
	}
	//判断收款单位是否相等
	for(var i=1;i<strPayeeArr.length;i++){
		if(strPayeeArr[0]!==strPayeeArr[i]){
			isfukdw=true;
			break;
		}
	}
	//判断款项是否相等
	for(var i=1;i<strfundNameArr.length;i++){
		if(strfundNameArr[0]!==strfundNameArr[i]){
			isfundName=true;
			break;
		}
	}
	if(isfuk){
		layer.alert("所选项必须是相同付款方，请重新选择");
		return false;
	}
	if(isfukdw){
		layer.alert("所选项必须是相同收款单位，请重新选择");
		return false;
	}
	if(isfundName){
		layer.alert("所选项必须是相同款项，请重新选择");
		return false;
	}
	
	commonContainer.modal(
			'付款信息新增',
			$('#J_increase'),
			function(index, layero) {
				var payeehtml = '';
				var tuiPOShtml = '';
				var paymentmethod = $('#J_labeliscash').text();
				var payzhanghao = ''
				var paymentpopmoney =$('#J_paymentmoney').val();
				var paymentUserName= '';
				$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
					if(true == $(this).is(':checked')){
						var $index = $(this).data('index');
						paymentfundName = dataresultdata[$index].fundName;
						paymentbatchId =  dataresultdata[$index].batchId;
						paymentstrPayer = dataresultdata[$index].strPayer;
						fundcodenumber = dataresultdata[$index].fundCode;
					}
				});
				//判断付款方式collectionId  receiverName collectionBatchId
				var payFs=$("input[name='isShouweiyj']:checked").val();
				var paymentmethod='';
				var datafundname=$('#formId').serializeObject();
				if(payFs==1){
					datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
					datafundname.fundCode=strfundCodeArr[0];					//付款款项
					datafundname.payType=1										//付款方式 1，现金；2，支票；3，转账；4；退POS（退款使用）5；退款转出（转款使用） ,										
					paymentmethod='现金';
				}else if(payFs==2){
					datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
					datafundname.fundCode=strfundCodeArr[0];					//付款款项
					datafundname.payType=2
					paymentmethod='支票';	
				}else if(payFs==3){
					datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
					datafundname.fundCode=strfundCodeArr[0];					//付款款项
					datafundname.payType=3
					paymentmethod='转账';
				}else if(payFs==4){
					
					paymentmethod='退POS';
					var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
					if(choustuipos.length>0){collectionId
						datafundname=[];
					var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
						$.each(choustuipos,function(i,n){
							var idName='#amount'+getMoney.eq(i).data('index');
							datafundname.push({
								collectionBatchId:choustuipos[i].batchId,	//收款批次号	
								fundCode:strfundCodeArr[0],					//付款款项
								payType:4,
								collectionId:choustuipos[i].collectionId,
								bankAccount:choustuipos[i].payerAccountNo,
								payAmount:$(idName).val()
							});
						});
						
					}
				}
				
				if(paymentmethod == '转账'){
					payzhanghao = $('#J_account').val();
				}
				
				if(Payeetypeval == '1'){
					paymentUserName = $('#J_Payeename').val();
				}
				if(Payeetypeval == '2'){
					paymentUserName = $('#J_Payeename').val();
				}
				if(Payeetypeval == '3'){
					paymentUserName = $('#J_user').val();
				}
				if(Payeetypeval == '4'){
					paymentUserName = $('#J_iputvalue').val();
				}
				if(payFs==3){
					paymentUserName = $('#J_Accountholder').val();
				}
				
				// 验证必填项
				var $Payeetype = $('#J_Payeetype').val();               //收款人类型
				var $Payeename = '';               						//收款人
				var $iputvalue = $('#iputvalue').val();                 //收款人
				var $user = $('#J_user').val();                         //收款人
				var $documentType = $('#J_financeCardType').val();         //收款人证件类型
				var $Documentnumber = $('#J_Documentnumber').val();     //证件号码
				var $paymentmoney = $('#J_paymentmoney').val();
				
				if(payFs=="1"){ //现金
					if(Payeetypeval == ''){
						layer.alert('收款人类型不能为空');
						return false;
					}
					if(Payeetypeval == '1'){  // 客户
						$Payeename = $('#J_Payeename').val();
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
					};
					if(Payeetypeval == '2'){  // 业主
						$Payeename = $('#J_Payeename').val();
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
					};
					if(Payeetypeval == '3'){  // 员工
						$Payeename = $('#J_user').val();
						datauesrId = $('#J_user').data('id');
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
					};
					if(Payeetypeval == '4'){  // 其他
						paymentUserName = $('#J_iputvalue').val();
						if(paymentUserName == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
					}
				}
				if(payFs=="2"){ //支票
					if(Payeetypeval == ''){
						layer.alert('收款人类型不能为空');
						return false;
					}
					if(Payeetypeval == '1'){  // 客户
						$Payeename = $('#J_Payeename').val();
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
					};
					if(Payeetypeval == '2'){  // 业主
						$Payeename = $('#J_Payeename').val();
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
					};
					if(Payeetypeval == '3'){  // 员工
						$Payeename = $('#J_user').val();
						datauesrId = $('#J_user').data('id');
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
					};
					if(Payeetypeval == '4'){  // 其他
						paymentUserName = $('#J_iputvalue').val();
						if(paymentUserName == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
					}
				}
				if(payFs=="3"){ // 转账
					if(Payeetypeval == ''){
						layer.alert('收款人类型不能为空');
						return false;
					}
					if(Payeetypeval == '1'){  // 客户
						$Payeename = $('#J_Payeename').val();
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
						if($accounttypeofAccount == ''){
							layer.alert('开户人证件类型不能为空');
							return false;
						};
						if($accountnumber== ''){
							layer.alert('开户人证件号码不能为空');
							return false;
						};
						if($accountType== ''){
							layer.alert('账号类型不能为空');
							return false;
						};
						if($Accountholder== ''){
							layer.alert('开户人不能为空');
							return false;
						};
						if($Openbank== ''){
							layer.alert('开户行不能为空');
							return false;
						};
						if($bankName== ''){
							layer.alert('银行支行名称不能为空');
							return false;
						};
						if($account== ''){
							layer.alert('账号不能为空');
							return false;
						};
					}
					if(Payeetypeval == '2'){  // 业主
						$Payeename = $('#J_Payeename').val();
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
						if($accounttypeofAccount == ''){
							layer.alert('开户人证件类型不能为空');
							return false;
						};
						if($accountnumber== ''){
							layer.alert('开户人证件号码不能为空');
							return false;
						};
						if($accountType== ''){
							layer.alert('账号类型不能为空');
							return false;
						};
						if($Accountholder== ''){
							layer.alert('开户人不能为空');
							return false;
						};
						if($Openbank== ''){
							layer.alert('开户行不能为空');
							return false;
						};
						if($bankName== ''){
							layer.alert('银行支行名称不能为空');
							return false;
						};
						if($account== ''){
							layer.alert('账号不能为空');
							return false;
						};
					};
					if(Payeetypeval == '3'){  // 员工
						$Payeename = $('#J_user').val();
						datauesrId = $('#J_user').data('id');
						if($Payeename == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
						if($accounttypeofAccount == ''){
							layer.alert('开户人证件类型不能为空');
							return false;
						};
						if($accountnumber== ''){
							layer.alert('开户人证件号码不能为空');
							return false;
						};
						if($accountType== ''){
							layer.alert('账号类型不能为空');
							return false;
						};
						if($Accountholder== ''){
							layer.alert('开户人不能为空');
							return false;
						};
						if($Openbank== ''){
							layer.alert('开户行不能为空');
							return false;
						};
						if($bankName== ''){
							layer.alert('银行支行名称不能为空');
							return false;
						};
						if($account== ''){
							layer.alert('账号不能为空');
							return false;
						};
					}
					if(Payeetypeval == '4'){  // 其他
						paymentUserName = $('#J_iputvalue').val();
						if(paymentUserName == ''){
							layer.alert('收款人不能为空');
							return false;
						};
						if($documentType == ''){
							layer.alert('收款人证件类型不能为空');
							return false;
						};
						if($Documentnumber==''){
							commonContainer.alert('请输入证件号码');
							return true;
						};
						if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
							commonContainer.alert('请输入正确的身份证号码');
							return true;
						};
						if($paymentmoney == ''){
							layer.alert('付款金额不能为空');
							return false;
						};
						if($accounttypeofAccount == ''){
							layer.alert('开户人证件类型不能为空');
							return false;
						};
						if($accountnumber== ''){
							layer.alert('开户人证件号码不能为空');
							return false;
						};
						if($accountType== ''){
							layer.alert('账号类型不能为空');
							return false;
						};
						if($Accountholder== ''){
							layer.alert('开户人不能为空');
							return false;
						};
						if($Openbank== ''){
							layer.alert('开户行不能为空');
							return false;
						};
						if($bankName== ''){
							layer.alert('银行支行名称不能为空');
							return false;
						};
						if($account== ''){
							layer.alert('账号不能为空');
							return false;
						};
					}
				}
				if(payFs=="4"){ // 退POS
					var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
					var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
					var idNameval='';
					$.each(choustuipos,function(i,n){
						var idName='#amount'+getMoney.eq(i).data('index');
						idNameval = $(idName).val();
					});
					if(idNameval == ''){
						layer.alert('退POS金额不能为空');
						return false;
					}
				}
				var dataObj=JSON.stringify(datafundname);
				var dataobjval = 'data-Obj='+dataObj;
				if(payFs!=4){
					payeehtml='\
						<tr>\
							<td class="add_create" style="text-align: center; padding:8px;">'+paymentbatchId+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+paymentpopmoney+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+payzhanghao+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;">'+paymentUserName+'</td>\
							<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-fundCode="'+fundcodenumber+'" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+paymentpopmoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
						</tr>';
					tuikuanSum+=paymentpopmoney*1;
					$('#J_paymententry_dataTable tbody').append(payeehtml);
				}
				editerPayeetype=$('#J_Payeetype').val();
				editerPayeename=$Payeename;
				editerfinanceCardType =$('#J_financeCardType').val();
				editerDocumentnumber = $('#J_Documentnumber').val();
				$('#J_paymentpopmoeny').text(tuikuanSum);
				
				//退pos选中数据返回显示新增数据
				var checkrowDataArr=$('#J_tuipos_dataTable').bootstrapTable('getSelections');	//选中的退POS数据
				var idName='';
				$("#J_tuipos_dataTable input[name='btSelectItem']:checked").each(function(){
					idName='#amount'+$(this).data('index');
				});
				if(checkrowDataArr.length>0){
					$.each(checkrowDataArr,function(i,n){
						var idNameMoney = $(idName).val();
						tuiPOShtml+='\
							<tr>\
								<td class="add_create" style="text-align: center; padding:8px;">'+n.batchId+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+idNameMoney+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+n.payerAccountNo+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;">'+(n.payerName==undefined?'-':n.payerName)+'</td>\
								<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-fundCode="'+fundcodenumber+'" data-money="'+idNameMoney+'" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+idNameMoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
							</tr>';
						tuikuanSum+=idNameMoney*1;
					})
					$('#J_paymententry_dataTable tbody').append(tuiPOShtml);
					$('#J_paymentpopmoeny').text(tuikuanSum);
					tuiPOShtml='';
				}
				layer.close(index);
			}, 
			{
				overflow :true,
				area:['800px','400px'],
				btns : ['确定', '取消'],
				success: function() {
					$('#J_isTransfer').prop('checked',true);
					$('#J_iscash').prop('checked',false);
					$('#J_ischeck').prop('checked',false);
					$('#J_tuipos').prop('checked',false);
					$('#isTransfer').show();
					$('#J_paperworcompany').hide();
					//??
					if(flagtype){
						//收款人类型
						dimContainer.buildDimChosenSelector($('#J_Payeetype'),'paymentReceiverType','');
						//开户人证件类型
						dimContainer.buildDimChosenSelector($('#J_accounttypeofAccount'),'paymentCardType','');
						//账号类型
						dimContainer.buildDimChosenSelector($('#J_accountType'),'bankAccountType','');
						//开户行自动补全查询
						Openbank($("#J_Openbank"), true, 'left');
						flagtype = false;
					}
					//??
					$('#J_financeCardType').val('');
					$('#J_financeCardType').trigger("chosen:updated");
					$('#J_Payeetype').val('');
					$('#J_Payeetype').trigger("chosen:updated");
					$('#J_Payeename').val('');
					$('#J_Payeename').trigger("chosen:updated");
					$('#J_user').val('');
					$('#J_iputvalue').val('');
					$('#J_Documentnumber').val('');
					$('#J_paymentmoney').val('');
					$('#J_accounttypeofAccount').val('');
					$('#J_accounttypeofAccount').trigger("chosen:updated");
					$('#J_accountType').val('');
					$('#J_accountType').trigger("chosen:updated");
					$('#J_accountnumber').val('');
					$('#J_Openbank').val('');
					$('#J_bankName').val('');
					$('#J_bankName').trigger("chosen:updated");
					$('#J_province').val('');
					$('#J_city').val('');
					$('#J_banknumber').val('');
					$('#J_Accountholder').val('');
					$('#J_account').val('');
					$('#J_receiverUnit').val('');
					var optionsname = [];
					$('#J_Payeetype').on('input change',function(){
						Payeetypeval = $(this).val();
						optionsname = [];
						if(Payeetypeval =='1'){
							$('#J_paperwork').show();
							$('#J_paperworNum').show();
							$('#J_select').show();
							$('#J_input').hide();
							$('#J_inputtext').hide();
							var arr = clientName.split(',');
							$.each(arr,function(n, value){
								optionsname.push('<option data-id = ' + n + ' value="' + value + '">' + value + '</option>');
							})
							 $('#J_Payeename').html('<option value="">请选择</option>'+optionsname.join(''));
				    		 $('#J_Payeename').trigger("chosen:updated");
						}
						if(Payeetypeval =='2'){
							$('#J_paperwork').show();
							$('#J_paperworNum').show();
							$('#J_select').show();
							$('#J_input').hide();
							$('#J_inputtext').hide();
							var arr = ownerName.split(',');
							$.each(arr,function(n, value){
								optionsname.push('<option data-id = ' + n + ' value="' + n + '">' + value + '</option>');
							})
							 $('#J_Payeename').html('<option value="">请选择</option>'+optionsname.join(''));
				    		 $('#J_Payeename').trigger("chosen:updated");
						}
						if(Payeetypeval =='3'){
							$('#J_paperwork').hide();
							$('#J_paperworNum').hide();
							$('#J_select').hide();
							$('#J_input').show();
							$('#J_inputtext').hide();
							
							//所属人自动补全查询
							searchContainer.searchUserListByComp($("#J_user"), true, 'left');
						}
						if(Payeetypeval =='4'){
							$('#J_paperwork').show();
							$('#J_paperworNum').show();
							$('#J_select').hide();
							$('#J_input').hide();
							$('#J_inputtext').show();
						}
					});
					//??
					var optionsbank = [];
					$('#formId').on('onSetSelectValue' , '#J_Openbank',function(){
						// 根据银行Id 查询支行列表
						var bankIdtype = $('#J_Openbank').attr('data-id')
						jsonGetAjax(
							basePath+'/finance/common/selectByBankId',
							{
								bankId:bankIdtype		//银行id
							},
							function(result){
								optionsbank=[];
								$.each(result.data,function(n, value){
									optionsbank.push('<option data-id = ' + value.id + ' value="' + value.id + '">' + value.branchName + '</option>');
								})
								 $('#J_bankName').html('<option value="">请选择</option>'+optionsbank.join(''));
					    		 $('#J_bankName').trigger("chosen:updated");
							}
						)	
					});
					$("#J_bankName").on('input change',function(){
						// 根据银行Id 查询支行省市信息
						var bankNameIdtype = $('#J_bankName').val();
						jsonGetAjax(
							basePath+'/finance/common/getBankAddressInfo',
							{
								id:bankNameIdtype		//银行id
							},
							function(result){
								$('#J_province').val(result.data.province);
								$('#J_city').val(result.data.city);
								$('#J_banknumber').val(result.data.branchId);
							}
						)	
					});
					$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
							if(true == $(this).is(':checked')){
								paymentbatchId =  $(this).parent().parent().find(".paymentbatchId").html();
								paymentstrPayer = $(this).parent().parent().find(".paymentstrPayer").html();
								if(paymentstrPayer=='-'){
									paymentstrPayer='';
									return false;
								}
							}
						})
					
					//证件类型
					dimContainer.buildDimChosenSelector($('#J_financeCardType'),'financeCardType','');
					//退POS 加载数据列表
					$('#J_tuipos_dataTable').bootstrapTable('destroy').bootstrapTable({
						url:basePath+'/finance/payment/apply/getRefundPosCollectionList',
						method:'get',
						sidePagination:'server',
						dataType:'json',
						pagination: true,
						singleSelect:false,		//设置单选
						clickToSelect:false,		//点击选中行
						striped:true,
						pageSize:10,
						pageList:[10, 20, 50],
						queryParams: function (params) {
							var data=$('#J_query').serializeObject();
							data.collectionBatchId = $('.collectionBatchId').val();
							data.pagesize = params.limit;
							data.pageindex = params.offset / params.limit+ 1;
							
							return data;
						},
						responseHandler: function(result) {
							if (result.code == 0 && result.data){
								return {
									'rows': result.data
								}
							}
							return {
								'rows': []
							}	
						},
						columns:[
				         	{
				         		field: '',
						    	title :'选择',
						    	checkbox:true,
						    	align:'center',
						    	formatter: function(value, row, index){	
				           			var html='';
				           			html='<input type="hidden" id="J_auditId" data-collectionId="'+row.collectionId+'">';
				           			return html;
				           		}
				         	},
							{
								field : 'batchId',
								title : '收款批次',
								align : 'center'
							},
							{
								field : 'collectionId',
								title : '收款编号',
								align : 'center'
							},
							{
								field : 'paymentTime',
								title : '原刷卡日期',
								align : 'center'
							},
							{
								field : 'terminalNumber',
								title : '原刷卡终端号',
								align : 'center'
							},
							{
								field : 'amount',
								title : '原刷卡金额',
								align : 'center'
							},
							{
								field : 'payerAccountNo',
								title : '原刷卡卡号',
								align : 'center'
							},
							{
								field : 'transNumber',
								title : '原12位参考号',
								align : 'center'
							},
							{
								field : 'payerName',
								title : '原刷卡人姓名',
								align : 'center'
							},
							{
								field : 'refundAmount',
								title : '本POS退款金额',
								align : 'center',
								formatter: function(value, row, index){
				      				var html='';
				           			html='<input type="text" id="amount'+index+'" class="form-control" name="" value="">';
				           			return html;
				           			
				           		}
							}
						]
					});
				}
			}
		);
	$('#J_isTransfer').prop('checked',true);
	$('#J_isTransfer').on('click',function(){
		$('#iscash').show();
		$('#isTransfer').show();
		$('#J_tuipos').hide();
		$('#J_paperworcompany').hide();
	});
	$('#J_iscash').on('click',function(){
		$('#isTransfer').hide();
		$('#iscash').show();
		$('#J_tuipos').hide();
		$('#J_paperworcompany').hide();
		
	});
	$('#J_ischeck').on('click',function(){
		$('#isTransfer').hide();
		$('#iscash').show();
		$('#J_tuipos').hide();
		$('#J_paperworcompany').hide();
	});
	$('#J_istuiPost').on('click',function(){
		$('#iscash').hide();
		$('#J_tuipos').show();
	});
});

//上传文件方法
var attachmentView={
	initFalg:true,
	chargebackId:location.search.split('&')[0].split('=')[1],
	init:function(){
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
					_this.popCalbank();
					var auditStep=[];
					$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
						auditStep.push(dataresultdata[$(this).data('index')]);
					})
					$('#J_businessType').text($('#J_typecontract_h').html());
					$('#J_Paymenttext').text(auditStep[0].fundName);
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
		index=attListApplydataresult.length;
		++index;
		//列表赋值
		contenthtml='\
			<tr>\
				<td class="add_create" style="text-align: center; padding:8px;">'+index+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+biggerannex+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+smallannex+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;">'+newstime+'</td>\
				<td class="add_create" style="text-align: center; padding:8px;"><a type="looktype" data-remark="'+remarkval+'" data-titlename="'+categoryName+'" '+dataadd+' class="btn btn-outline btn-success btn-xs btn_looktype" data-newstime="'+newstime+'" data-smallannexnum="'+smallannexnum+'" data-biggerannexnum="'+biggerannexnum+'" data-index="'+index+'">预览</a>&nbsp;&nbsp;<a type="del" class="btn btn-outline btn-danger btn-xs">删除</a></td>\
			</tr>';
		$('#J_list_dataTable tbody').append(contenthtml);
		$('#J_list_dataTable').off().delegate(
			'a',
			'click',
			function(target,type){
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
						$('#J_businessPreview').text($('#J_typecontract_h').html());
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
					$(_this).parent().parent().remove();
				}
			}
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
			// 初始化附件大类
			var auditStep=[];
			$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
				auditStep.push(dataresultdata[$(this).data('index')]);
			})
			commonContainer.initChosen($('#J_attachmentType'));
			var options = [];
		    jsonPostAjax(
				basePath +'/finance/common/getFinanceAttachPrimaryList',
				{
					"businessType":businesstype,
					"fundCode":auditStep[0].fundCode
					
				}, 
				function(result) {
					categoryName = result.data.categoryName;
					remarkval = result.data.remark;
		    		$.each(result.data, function(n, value) {
		    	    	options.push('<option value="'+value.categoryCode +'，'+ value.categoryName + '">' + value.categoryName + '</option>');
		    	    })
		    	    $('#J_attachmentType').append(options.join(''));
		    		$('#J_attachmentType').trigger("chosen:updated");
			})
			//根据大类获取附件小类
			var optiontype = [];
			$('#J_attachmentType').on('input change',function(){
				optiontype = []
    			$('#J_categoryName').html(categoryName);
	    		$('#J_remarktext').html(remarkval);
				var attachtype = $(this).val().split('，')[0];
				jsonGetAjax(
					basePath +'/finance/common/getFinanceAttachSecondaryList',
					{
						"categoryCode":attachtype
						
					}, 
					function(result) {
			    		$.each(result.data, function(n, value) {
			    			optiontype.push('<option value="' + value.secondaryCategoryCode +'，'+value.secondaryCategoryName +'">' + value.secondaryCategoryName + '</option>');
			    	    })
			    	    $('#J_smallattachmentType').append(optiontype.join(''));
			    		$('#J_smallattachmentType').trigger("chosen:updated");
				})
			})
			
			this.upFile();
	},
	//下载文件
	download:function(filePath){
		window.open(basePath+'/sign/downloadEnclosure.htm?filePath='+filePath);
	}
}

deleditor();
//修改删除详情增加功能
function deleditor(){
	// 付款信息详细展示 删除 修改  点击按钮
	$('#J_paymententry_dataTable').off().delegate(
		'a',
		'click',
		function(event) {
			var $this=$(this);
			if(this.type=='del'){//删除付款数据
				commonContainer.confirm(
					'是否确认删除信息？',function(index, layero){
						$($this).parent().parent().remove();
						var paymentdelmoney = $($this).data('paymentpopmoney');
						tuikuanSum -=paymentdelmoney*1;
						if(tuikuanSum){
							$('#J_paymentpopmoeny').text(tuikuanSum.toFixed(2));
						}else{
							$('#J_paymentpopmoeny').text('0.00');
						}
						layer.close(index);
					}
				);
			}
			if(this.type=='modify'){//修改付款数据
				var paymentevaluate = $('#J_payment').val();
				var payzhanghao = ''
				commonContainer.modal(
					'修改付款信息',
					$('#J_increase'),
					function(index, layero) {
						var paymentUserName= '';
						var Payeetypeval = $('#J_Payeetype').val();
						//判断付款方式
						var payFs=$("input[name='isShouweiyj']:checked").val();
						var paymentmethod='';
						if(payFs==1){
							paymentmethod='现金';
						}else if(payFs==2){
							paymentmethod='支票';
						}else if(payFs==3){
							paymentmethod='转账';
						}else if(payFs==4){
							paymentmethod='退POS';
						}
						if(Payeetypeval == '1'){
							paymentUserName = $('#J_Payeename').val();
						}
						if(Payeetypeval == '2'){
							paymentUserName = $('#J_Payeename').val();
						}
						if(Payeetypeval == '3'){
							paymentUserName = $('#J_user').val();
						}
						if(Payeetypeval == '4'){
							paymentUserName = $('#J_iputvalue').val();
						}
						var payeehtml = '';
						var paymentmoney = $('#J_paymentmoney').val();
						if(paymentmethod == '转账'){
							payzhanghao = $('#J_account').val();
						}
						// 验证必填项
						var $Payeetype = $('#J_Payeetype').val();               //收款人类型
						var $Payeename = '';               						//收款人
						var $iputvalue = $('#iputvalue').val();                 //收款人
						var $user = $('#J_user').val();                         //收款人
						var $documentType = $('#J_financeCardType').val();         //收款人证件类型
						var $Documentnumber = $('#J_Documentnumber').val();     //证件号码
						var $paymentmoney = $('#J_paymentmoney').val();
						var $accounttypeofAccount=$('#J_accounttypeofAccount').val(); //开户人证件类型
						var $accountnumber=$('#J_accountnumber').val(); //开户人证件号码
						var $Accountholder=$('#J_Accountholder').val(); //开户人
						var $accountType=$('#J_accountType').val();  //账号类型
						var $Openbank=$('#J_Openbank').val();  //开户行
						var $bankName=$('#J_bankName').val();  //银行支行名称
						var $account=$('#J_account').val();  //账号
						if(payFs=="1"){ //现金
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
						}
						if(payFs=="2"){ //支票
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
						}
						if(payFs=="3"){ // 转账
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($accountnumber== ''){
									layer.alert('开户人证件号码不能为空');
									return false;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
							}
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($accountnumber== ''){
									layer.alert('开户人证件号码不能为空');
									return false;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($accountnumber== ''){
									layer.alert('开户人证件号码不能为空');
									return false;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
							}
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($accountnumber== ''){
									layer.alert('开户人证件号码不能为空');
									return false;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
							}
						}if(payFs=="1"){ //现金
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
						}
						if(payFs=="2"){ //支票
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							};
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
							}
						}
						if(payFs=="3"){ // 转账
							if(Payeetypeval == ''){
								layer.alert('收款人类型不能为空');
								return false;
							}
							if(Payeetypeval == '1'){  // 客户
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($accountnumber== ''){
									layer.alert('开户人证件号码不能为空');
									return false;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
							}
							if(Payeetypeval == '2'){  // 业主
								$Payeename = $('#J_Payeename').val();
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($accountnumber== ''){
									layer.alert('开户人证件号码不能为空');
									return false;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
							};
							if(Payeetypeval == '3'){  // 员工
								$Payeename = $('#J_user').val();
								datauesrId = $('#J_user').data('id');
								if($Payeename == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($accountnumber== ''){
									layer.alert('开户人证件号码不能为空');
									return false;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
							}
							if(Payeetypeval == '4'){  // 其他
								paymentUserName = $('#J_iputvalue').val();
								if(paymentUserName == ''){
									layer.alert('收款人不能为空');
									return false;
								};
								if($documentType == ''){
									layer.alert('收款人证件类型不能为空');
									return false;
								};
								if($Documentnumber==''){
									commonContainer.alert('请输入证件号码');
									return true;
								};
								if($('#J_financeCardType').val()==1 && isIDCardNum($Documentnumber)!==true){
									commonContainer.alert('请输入正确的身份证号码');
									return true;
								};
								if($paymentmoney == ''){
									layer.alert('付款金额不能为空');
									return false;
								};
								if($accounttypeofAccount == ''){
									layer.alert('开户人证件类型不能为空');
									return false;
								};
								if($accountnumber== ''){
									layer.alert('开户人证件号码不能为空');
									return false;
								};
								if($accountType== ''){
									layer.alert('账号类型不能为空');
									return false;
								};
								if($Accountholder== ''){
									layer.alert('开户人不能为空');
									return false;
								};
								if($Openbank== ''){
									layer.alert('开户行不能为空');
									return false;
								};
								if($bankName== ''){
									layer.alert('银行支行名称不能为空');
									return false;
								};
								if($account== ''){
									layer.alert('账号不能为空');
									return false;
								};
							}
						}
						if(payFs=="4"){ // 退POS
							var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
							var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
							var idNameval='';
							$.each(choustuipos,function(i,n){
								var idName='#amount'+getMoney.eq(i).data('index');
								idNameval = $(idName).val();
							});
							if(idNameval == ''){
								layer.alert('退POS金额不能为空');
								return false;
							}
						}
						// 判断收据单列表所选项收据批次号是否相同
						var stepFlag = false;
						var normalAuditStep = '';
						var strPayerArr=[];
						var strPayeeArr=[];
						var strfundNameArr=[];
						var strallArr=[];
						var strfundCodeArr = [];
						$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(index,element){
							var batchId = $(this).parent().find('#J_auditId').attr('data-batchId');
							
							//付款方是否相等
							strPayerArr.push(dataresultdata[$(this).data('index')].strPayer);
							//收款单位是否相等
							strPayeeArr.push(dataresultdata[$(this).data('index')].strPayee);
							//款项是否相等
							strfundNameArr.push(dataresultdata[$(this).data('index')].fundName);
							//款项编号
							strfundCodeArr.push(dataresultdata[$(this).data('index')].fundCode);
							strallArr.push(dataresultdata[$(this).data('index')]);
							if(index==0) normalAuditStep = batchId;
							if(batchId != normalAuditStep){	
								stepFlag = true;
							}
						});
						var isfuk=false;
						var isfukdw=false;
						var isfundName=false;
						//判断付款发是否相等
						for(var i=1;i<strPayerArr.length;i++){
							if(strPayerArr[0]!==strPayerArr[i]){
								isfuk=true;
								break;
							}
						}
						//判断收款单位是否相等
						for(var i=1;i<strPayeeArr.length;i++){
							if(strPayeeArr[0]!==strPayeeArr[i]){
								isfukdw=true;
								break;
							}
						}
						//判断款项是否相等
						for(var i=1;i<strfundNameArr.length;i++){
							if(strfundNameArr[0]!==strfundNameArr[i]){
								isfundName=true;
								break;
							}
						}
						if(isfuk){
							layer.alert("所选项必须是相同付款方，请重新选择");
							return false;
						}
						if(isfukdw){
							layer.alert("所选项必须是相同收款单位，请重新选择");
							return false;
						}
						if(isfundName){
							layer.alert("所选项必须是相同款项，请重新选择");
							return false;
						}
						$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
							if(true == $(this).is(':checked')){
								paymentbatchId = dataresultdata[0].batchId ;
								paymentfundName = dataresultdata[0].fundName;
							}
						});
						if(payFs==4){ // 退POS
							var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
							var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
							var idNameval = '';
							$.each(choustuipos,function(i,n){
								var idName='#amount'+getMoney.eq(i).data('index');
								idNameval = $(idName).val();
							});
							if(idNameval == ''){
								layer.alert('退POS金额不能为空');
								return false;
							}
						}
						var payeehtml = '';
						var tuiPOShtml = '';
						var paymentmethod = $('#J_labeliscash').text();
						var paymentfundName = '';
						var paymentpopmoney = $('#J_paymentmoney').val();
						
						$('#J_refunds_dataTable input[name="btSelectItem"]:checkbox').each(function(){
							if(true == $(this).is(':checked')){
								paymentfundName = dataresultdata[0].fundName;
								paymentbatchId =  dataresultdata[0].batchId;
								paymentstrPayer = $(this).parent().parent().find(".paymentstrPayer").html();
								fundcodenumber = $(this).next().data('fundCode');
							}
						});
						//判断付款方式
						var payFs=$("input[name='isShouweiyj']:checked").val();
						var paymentmethod='';
						var datafundname=$('#formId').serializeObject();
						if(payFs==1){
							datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
							datafundname.fundCode=strfundCodeArr[0];					//付款款项
							datafundname.payType=1										//付款方式 1，现金；2，支票；3，转账；4；退POS（退款使用）5；退款转出（转款使用） ,										
							paymentmethod='现金';
						}else if(payFs==2){
							datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
							datafundname.fundCode=strfundCodeArr[0];					//付款款项
							datafundname.payType=2
							paymentmethod='支票';	
						}else if(payFs==3){
							datafundname.collectionBatchId=dataresultdata[0].batchId	//收款批次号	
							datafundname.fundCode=strfundCodeArr[0];					//付款款项
							datafundname.payType=3
							paymentmethod='转账';
						}else if(payFs==4){
							paymentmethod='退POS';
							var choustuipos=$("#J_tuipos_dataTable").bootstrapTable('getSelections');
							if(choustuipos.length>0){
								datafundname=[];
							var getMoney=$("#J_tuipos_dataTable input[type='checkbox']:checked");
								$.each(choustuipos,function(i,n){
									var idName='#amount'+getMoney.eq(i).data('index');
									datafundname.push({
										collectionBatchId:choustuipos[i].batchId,	//收款批次号	
										fundCode:strfundCodeArr[0],					//付款款项
										payType:4,
										collectionId:choustuipos[i].collectionId,
										bankAccount:choustuipos[i].payerAccountNo,
										payAmount:$(idName).val()
									});
								});	
							}
						}
						var dataObj=JSON.stringify(datafundname);
						var dataobjval = 'data-obj='+dataObj;
						if(payFs==1 || payFs==2 || payFs==3){
							payeehtml='\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentbatchId+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentmoney+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+(payzhanghao!=""?payzhanghao:'-')+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;">'+paymentUserName+'</td>\
									<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-funcode="'+fundcodenumber+'" data-paytype="'+payFs+'" data-isjk="2" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" class="btn btn-outline btn-danger btn-xs">删除</a></td>';
							var oldmoeny = $($this).data('obj').payAmount;
							tuikuanSum +=(-(oldmoeny-paymentmoney));
							//$('#J_paymententry_dataTable tbody').html(payeehtml);
							$($this).parents('tr').html(payeehtml);
							$('#J_paymentpopmoeny').text(tuikuanSum);
						}else{
							var checkrowDataArr=$('#J_tuipos_dataTable').bootstrapTable('getSelections');	//选中的退POS数据
							var idName='';
							$("#J_tuipos_dataTable input[name='btSelectItem']:checked").each(function(){
								idName='#amount'+$(this).data('index');
							});
							if(checkrowDataArr.length>0){
								$.each(checkrowDataArr,function(i,n){
									var idNameMoney = $(idName).val();
									tuiPOShtml+='\
											<td class="add_create" style="text-align: center; padding:8px;">'+n.batchId+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentmethod+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+paymentfundName+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+idNameMoney+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+n.payerAccountNo+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;">'+(n.payerName==undefined?'-':n.payerName)+'</td>\
											<td class="add_create" style="text-align: center; padding:8px;"><a type="modify" '+dataobjval+' data-id="'+datauesrId+'" data-fundCode="'+fundcodenumber+'" data-money="'+idNameMoney+'" class="btn btn-outline btn-success btn-xs btn-payment">修改</a>&nbsp;&nbsp;<a type="del" data-paymentpopmoney="'+idNameMoney+'" class="btn btn-outline btn-danger btn-xs">删除</a></td>';
									var oldmoenyTOPS = $($this).data('money');
									tuikuanSum+=(-(oldmoenyTOPS-idNameMoney));
								})
								//$('#J_paymententry_dataTable tbody').html(tuiPOShtml);
								$($this).parents('tr').html(tuiPOShtml);
								$('#J_paymentpopmoeny').text(tuikuanSum);
							}
						}
						layer.close(index);
					}, 
					{
						overflow :true,
						area : ['68%','80%'],
						btns : ['确定', '取消'],
						success: function() {
							$('#J_accountType').val('');
							$('#J_accountType').trigger("chosen:updated");
							var PayTypecheck = $($this).data('obj').payType;
							if(PayTypecheck == "1"){
								$("#J_iscash").prop('checked',true);
								$("#J_ischeck").prop('checked',false);
								$("#J_isTransfer").prop('checked',false);
								$("#J_istuiPost").prop('checked',false);
								$('#isTransfer').hide();
								$('#iscash').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
							}
							if(PayTypecheck == "2"){
								$("#J_iscash").prop('checked',false);
								$("#J_ischeck").prop('checked',true);
								$("#J_isTransfer").prop('checked',false);
								$("#J_istuiPost").prop('checked',false);
								$('#isTransfer').hide();
								$('#iscash').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
							}
							if(PayTypecheck == "3"){
								$("#J_iscash").prop('checked',false);
								$("#J_ischeck").prop('checked',false);
								$("#J_isTransfer").prop('checked',true);
								$("#J_istuiPost").prop('checked',false);
								$('#iscash').show();
								$('#isTransfer').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
							}
							if(PayTypecheck == "4"){
								$("#J_iscash").prop('checked',false);
								$("#J_ischeck").prop('checked',false);
								$("#J_isTransfer").prop('checked',false);
								$("#J_istuiPost").prop('checked',true);
								$('#iscash').hide();
								$('#J_tuipos').show();
							}
							var editerPayeetype = '';
							var editerDocumentnumber = '';
							var editerAccountholder = '';
							var editertypeofAccount = '';
							var editeraccountnumber = '';
							var editeraccountType = '';
							var editerOpenbank = '';
							var editerbankName = '';
							var editerbanknumber = '';
							var editeraccount = '';
							var editerpaymentmoney = '';
							var editerprovince = '';
							var editercity = '';
							var receiverUnit = '';
							var editerPayeename = '';
							editerPayeename = $($this).data('obj').receiverName;
								editerPayeetype = $($this).data('obj').receiverType;
								editerDocumentnumber = $($this).data('obj').receiverCardNumber;
								editerAccountholder = $($this).data('obj').accountHolder;
								editertypeofAccount = $($this).data('obj').accountHolderCardType;
								editeraccountnumber = $($this).data('obj').accountHolderCardNumber;
								editeraccountType = $($this).data('obj').bankAccountKind;
								editerOpenbank = $($this).data('obj').Openbank;
								editerbankName = $($this).data('obj').bankBranchId;
								editerbanknumber = $($this).data('obj').banknumber;
								editeraccount = $($this).data('obj').bankAccount;
								editerpaymentmoney = $($this).data('obj').payAmount;
								editerprovince = $($this).data('obj').province;
								editercity = $($this).data('obj').city;
								receiverUnit = $($this).data('obj').receiverUnit;
								editerfinanceCardType = $($this).data('obj').receiverCardType;
								/*<option value="'+editerPayeetype+'">'+editerPayeetype+'</option>*/
								if(editerPayeetype == '客户'){
									editerPayeetype=1;
								}else if(editerPayeetype == '业主'){
									editerPayeetype=2;
								}else if(editerPayeetype == '员工'){
									editerPayeetype=3;
								}else if(editerPayeetype == '其他'){
									editerPayeetype=4;
								}
								$('#J_Payeetype').html('<option value="">请选择</option><option value="'+editerPayeetype+'">客户</option><option value="2">业主</option><option value="3">员工</option><option value="4">其他</option>');
								$('#J_Payeetype').val(editerPayeetype);
								$('#J_Payeetype').trigger("chosen:updated");
								
								$('#J_Payeename').html('<option value="">请选择</option><option value="'+editerPayeename+'">'+editerPayeename+'</option>');
								$('#J_Payeename').val(editerPayeename);
								$('#J_Payeename').trigger("chosen:updated");
								
								if(editerfinanceCardType == '居民身份证'){
									editerfinanceCardType=1;
								}else if(editerfinanceCardType == '军（警）身份证'){
									editerfinanceCardType=2;
								}else if(editerfinanceCardType == '香港居民身份证'){
									editerfinanceCardType=3;
								}else if(editerfinanceCardType == '澳门居民身份证'){
									editerfinanceCardType=4;
								}else if(editerfinanceCardType == '台湾居民身份证'){
									editerfinanceCardType=5;
								}else if(editerfinanceCardType == '护照'){
									editerfinanceCardType=6;
								}else if(editerfinanceCardType == '来往大陆通行证'){
									editerfinanceCardType=7;
								}else if(editerfinanceCardType == '军官证'){
									editerfinanceCardType=8;
								}else if(editerfinanceCardType == '营业执照号'){
									editerfinanceCardType=9;
								}
								
								if(editertypeofAccount == 1){
									editertypeofAccount="居民身份证";
								}else if(editertypeofAccount == 2){
									editertypeofAccount='军（警）身份证';
								}else if(editertypeofAccount == 3){
									editertypeofAccount='香港居民身份证';
								}else if(editertypeofAccount ==  4){
									editertypeofAccount='澳门居民身份证';
								}else if(editertypeofAccount == 5){
									editertypeofAccount='台湾居民身份证';
								}else if(editertypeofAccount == 6){
									editertypeofAccount='护照';
								}else if(editertypeofAccount == 7){
									editertypeofAccount='来往大陆通行证';
								}else if(editertypeofAccount == 8){
									editertypeofAccount='军官证';
								}else if(editertypeofAccount == 9){
									editertypeofAccount='营业执照号';
								}
								
								$('#J_financeCardType').val(editerfinanceCardType);
								$('#J_financeCardType').trigger("chosen:updated");
								$('#J_Documentnumber').val(editerDocumentnumber);
								$('#J_paymentmoney').val(editerpaymentmoney);
								
								$('#J_Accountholder').val(editerAccountholder);
								
								if(PayTypecheck != "转账"){
									$('#J_accounttypeofAccount').val(editertypeofAccount);
									$('#J_accounttypeofAccount').trigger("chosen:updated");
									$('#J_accountType').val(editeraccountType);
									$('#J_accountType').trigger("chosen:updated");
									//开户人证件类型
									dimContainer.buildDimChosenSelector($('#J_accounttypeofAccount'),'paymentCardType','');
									//账号类型
									dimContainer.buildDimChosenSelector($('#J_accountType'),'bankAccountType','');	
								}else{
									$('#J_accounttypeofAccount').html('<option value="">请选择</option><option value="'+editertypeofAccount+'">'+editertypeofAccount+'</option>');
									$('#J_accounttypeofAccount').val(editertypeofAccount);
									$('#J_accounttypeofAccount').trigger("chosen:updated");
									
									$('#J_accountType').html('<option value="">请选择</option><option value="'+editeraccountType+'">'+editeraccountType+'</option>');
									$('#J_accountType').val(editeraccountType);
									$('#J_accountType').trigger("chosen:updated");
									$('#J_accountnumber').val(editeraccountnumber);
									$('#J_Openbank').val(editerOpenbank);
									
									$('#J_bankName').html('<option value="">请选择</option><option value="'+editerbankName+'">'+editerbankName+'</option>');
									$('#J_bankName').val(editerbankName);
									$('#J_bankName').trigger("chosen:updated");
									$('#J_province').val(editerprovince);
									$('#J_city').val(editercity);
									$('#J_banknumber').val(editerbanknumber);
									$('#J_account').val(editeraccount);
									$('#J_receiverUnit').val(receiverUnit);
								}
								//开户行自动补全查询
								Openbank($("#J_Openbank"), true, 'left');
							//判断付款方式
							var checkrowDataArr=$('#J_tuipos_dataTable').bootstrapTable('getSelections');	//选中的退POS数据
							var collectionidNum=checkrowDataArr.collectionId;
							var payFs=$("input[name='isShouweiyj']:checked").val();
							if(payFs == '4'){
								//加载修改退POS数据列表J_tuipos_dataTable
								$('#J_tuipos_dataTable').bootstrapTable('destroy').bootstrapTable({
									url:basePath+'/finance/payment/apply/getRefundPosCollectionList',
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
										var data=$('#J_query').serializeObject();
										data.collectionBatchId = $('.collectionBatchId').val();
										data.pagesize = params.limit;
										data.pageindex = params.offset / params.limit+ 1;
										
										return data;
									},
									responseHandler: function(result) {
										if (result.code == 0 && result.data){
											return {
												'rows': result.data
											}
										}
										return {
											'rows': []
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
											field : 'batchId',
											title : '收款批次',
											align : 'center'
										},
										{
											field : 'collectionId',
											title : '收款编号',
											align : 'center'
										},
										{
											field : 'paymentTime',
											title : '原刷卡日期',
											align : 'center'
										},
										{
											field : 'terminalNumber',
											title : '原刷卡终端号',
											align : 'center'
										},
										{
											field : 'amount',
											title : '原刷卡金额',
											align : 'center'
										},
										{
											field : 'payerAccountNo',
											title : '原刷卡卡号',
											align : 'center'
										},
										{
											field : 'transNumber',
											title : '原12位参考号',
											align : 'center'
										},
										{
											field : 'payerName',
											title : '原刷卡人姓名',
											align : 'center'
										},
										{
											field : 'refundAmount',
											title : '本POS退款金额',
											align : 'center',
											formatter: function(value, row, index){
							      				var html='';
							           			html='<input type="text" class="form-control" name="" value="'+$this.data('money')+'">';
							           			return html;
							           			
							           		}
										}
									]
								});
							}
							
							var optionsname = [];
							Payeetypeval = '';
							$('#J_Payeetype').on('input change',function(){
								Payeetypeval = $(this).val();
								optionsname = [];
								if(Payeetypeval =='1'){
									$('#J_paperwork').show();
									$('#J_paperworNum').show();
									$('#J_select').show();
									$('#J_input').hide();
									$('#J_inputtext').hide();
									var arr = clientName.split(',');
									$.each(arr,function(n, value){
										optionsname.push('<option data-id = ' + n + ' value="' + value + '">' + value + '</option>');
									})
									 $('#J_Payeename').html('<option value="">请选择</option>'+optionsname.join(''));
						    		 $('#J_Payeename').trigger("chosen:updated");
								}
								if(Payeetypeval =='2'){
									$('#J_paperwork').show();
									$('#J_paperworNum').show();
									$('#J_select').show();
									$('#J_input').hide();
									$('#J_inputtext').hide();
									var arr = ownerName.split(',');
									$.each(arr,function(n, value){
										optionsname.push('<option data-id = ' + n + ' value="' + value + '">' + value + '</option>');
									})
									 $('#J_Payeename').html('<option value="">请选择</option>'+optionsname.join(''));
						    		 $('#J_Payeename').trigger("chosen:updated");
								}
								if(Payeetypeval =='3'){
									$('#J_paperwork').hide();
									$('#J_paperworNum').hide();
									$('#J_select').hide();
									$('#J_input').show();
									$('#J_inputtext').hide();
									
									//所属人自动补全查询
									searchContainer.searchUserListByComp($("#J_user"), true, 'left');
								}
								if(Payeetypeval =='4'){
									$('#J_paperwork').show();
									$('#J_paperworNum').show();
									$('#J_select').hide();
									$('#J_input').hide();
									$('#J_inputtext').show();
								}
							})
							var optionsbank = [];
							$('#formId').on('onSetSelectValue' , '#J_Openbank',function(){
								// 根据银行Id 查询支行列表
								var bankIdtype = $('#J_Openbank').attr('data-id')
								jsonGetAjax(
									basePath+'/finance/common/selectByBankId',
									{
										bankId:bankIdtype		//银行id
									},
									function(result){
										optionsbank=[];
										$.each(result.data,function(n, value){
											optionsbank.push('<option data-id = ' + value.id + ' value="' + value.id + '">' + value.branchName + '</option>');
										})
										 $('#J_bankName').html('<option value="">请选择</option>'+optionsbank.join(''));
							    		 $('#J_bankName').trigger("chosen:updated");
									}
								)	
							});
							$("#J_bankName").on('input change',function(){
								// 根据银行Id 查询支行省市信息
								var bankNameIdtype = $('#J_bankName').val();
								jsonGetAjax(
									basePath+'/finance/common/getBankAddressInfo',
									{
										id:bankNameIdtype		//银行id
									},
									function(result){
										$('#J_province').val(result.data.province);
										$('#J_city').val(result.data.city);
										$('#J_banknumber').val(result.data.branchId);
									}
								)	
							});
							$('#J_isTransfer').on('click',function(){
								$('#iscash').show();
								$('#isTransfer').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
							});
							$('#J_iscash').on('click',function(){
								$('#isTransfer').hide();
								$('#iscash').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').hide();
								
							});
							$('#J_ischeck').on('click',function(){
								$('#isTransfer').hide();
								$('#iscash').show();
								$('#J_tuipos').hide();
								$('#J_paperworcompany').show();
							});
							$('#J_istuiPost').on('click',function(){
								$('#iscash').hide();
								$('#isTransfer').hide();
								$('#J_tuipos').show();
								$('#J_paperworcompany').hide();
							});
						}
					}
				);
			}
		}
	);
}
function submitContractApply(resultdatabusinessType) {
	receiptList=[];	//回传收据信息
	attInfoList = [];    //回传附件信息
	var auditStep=[];
	var paymentinfolist=[];
	var paymentmoeny = $('#J_paymentmoeny').html();
	var paymentpopmoeny = $('#J_paymentpopmoeny').html();
	if(paymentmoeny != paymentpopmoeny){
		layer.alert('退款总金额不相等，请重新填写');
		return false;
	}
	$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
		auditStep.push(dataresultdata[$(this).data('index')]);
		var index=$(this).data('index');                          // 回收数量
		var indexyin=$('#yin'+index);              // 回收差异原因
		var indexzhuan=$('#zhuan'+index);          // 转款金额
		var gapReceipt=dataresultdata;
		receiptList.push({
        	  "receiptId":dataresultdata.receiptId,
        	  "printCount":gapReceipt.printCount,
        	  "printCount":dataresultdata.printCount,
        	  "receiptNumber":dataresultdata.receiptNumber,
        	  "refundAmount": indexzhuan.val()==undefined?gapReceipt.refundAmount:indexzhuan.val(),
              "returnCount": $('#'+index).val()==undefined?gapReceipt.recycleCount:$('#'+index).val(),
              "returnDiffReason": indexyin.val()==undefined?gapReceipt.differentReason:indexyin.val()
          });
	});
	$('#J_list_dataTable .btn_looktype').each(function(){// 附件
		attInfoList.push({
			businessType:resultdatabusinessType,
			fundCode:auditStep[0].fundCode,
			fundName:dataresultdata[0].fundName,
			attId:$(this).data('attid'),
			largeType:$(this).data('biggerannexnum'),
			smallType:$(this).data('smallannexnum'),
			pathList:$(this).data('add')
		})
	})
	if(Payeetypeval == '1'){
		paymentUserName = $('#J_Payeename').val();
	}
	if(Payeetypeval == '2'){
		paymentUserName = $('#J_Payeename').val();
	}
	if(Payeetypeval == '3'){
		paymentUserName = $('#J_user').val();
	}
	if(Payeetypeval == '4'){
		paymentUserName = $('#J_iputvalue').val();
	}
	var payFs=$("input[name='isShouweiyj']:checked").val();
	$('#J_paymententry_dataTable .btn-payment').each(function(){
		var paymentinfol=$(this).data('obj');
		paymentinfol.receiverUserId=$(this).data('id');
		paymentinfolist.push(paymentinfol);
	});
	//判断付款原因为必填
	var applyaddtext = $('#J_applyadd').val();
	if(applyaddtext == ''){
		layer.alert('请填写付款原因，付款原因为必填项');
		return false;
	}
	var checkoldDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的新转入合同数据
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
	if(flag){
		return false;
	}
	jsonPostAjax(
		basePath + '/finance/payment/apply/updatePaymentInfo',
		{
			"applyId":applyid,
			"fundCode":auditStep[0].fundCode,
			"remarks":$('#J_applyadd').val(),
			"attInfoList":attInfoList,
			"paymentInfoList":paymentinfolist
		},
		function(result) {
			layer.msg("操作成功");
			var dataappLy = applyid;
			var paymentType = 2;
			window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+paymentType+'&applyId='+dataappLy;
		}
	)
};

function submitClientApply() {
	var auditStep=[];
	var paymentinfolist=[];
	var paymentmoeny = $('#J_paymentmoeny').html();
	var paymentpopmoeny = $('#J_paymentpopmoeny').html();
	if(paymentmoeny != paymentpopmoeny){
		layer.alert('退款总金额不相等，请重新填写');
		return false;
	}
	$("#J_refunds_dataTable input[name='btSelectItem']:checked").each(function(){
		auditStep.push(dataresultdata[$(this).data('index')]);
		var index=$(this).data('index');                          // 回收数量
		var indexyin=$('#yin'+index);              // 回收差异原因
		var indexzhuan=$('#zhuan'+index);          // 转款金额
		var  gapReceipt=dataresultdata[index];
		receiptList.push({
        	  "receiptId":gapReceipt.receiptId,
        	  "printCount":gapReceipt.printCount,
        	  "receiptNumber":gapReceipt.receiptNumber,
        	  "refundAmount": indexzhuan.val()==undefined?gapReceipt.refundAmount:indexzhuan.val(),
              "returnCount": $('#'+index).val()==undefined?gapReceipt.recycleCount:$('#'+index).val(),
              "returnDiffReason": indexyin.val()==undefined?gapReceipt.differentReason:indexyin.val()
          });
	});
	$('#J_list_dataTable .btn_looktype').each(function(){// 附件
		attInfoList.push({
			businessType:resultdatabusinessType,
			fundCode:auditStep[0].fundCode,
			fundName:auditStep[0].fundName,
			attId:$(this).data('attid'),
			largeType:$(this).data('biggerannexnum'),
			smallType:$(this).data('smallannexnum'),
			pathList:$(this).data('add')
		})
	})
	//paymentInfoList付款信息录入参数
	$('#J_paymententry_dataTable .btn-payment').each(function(){
		paymentinfolist.push($(this).data('obj'));
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
	var applyaddtext = $('#J_applyadd').val();
	if(applyaddtext == ''){
		layer.alert('请填写付款原因，付款原因为必填项');
		return false;
	}
	jsonPostAjax(
		basePath + '/finance/payment/apply/updatePaymentInfo',
		{
			"applyId":applyid,
			"fundCode":auditStep[0].fundCode,
			"remarks":$('#J_applyadd').val(),
			"attInfoList":attInfoList,                                       //回传附件信息
			"paymentInfoList":paymentinfolist
		},
		function(result) {
			layer.msg("操作成功");
			var dataappLy = applyid;
			var paymentType = 2;
			window.location.href=basePath + '/finance/payment/apply/detail.htm?paymentType='+paymentType+'&applyId='+dataappLy;
		}
	)
};

$('#J_paymentbutton').on('click', function(){
	var chooseType = $('#J_Choosecontract').val();
	if(chooseType == 1) {
		submitContractApply();
	}else if(chooseType == 2) {
		submitClientApply();
	}
})
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
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
