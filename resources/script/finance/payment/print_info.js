$(function(){
	printInfoView.init();
});
var printInfoView={
	urlData:location.search.split('&'),
	init:function(){
		var _this=this;
		var paymentid=_this.urlData[0].split('=')[1]*1;
		$('#printBtn').off().on('click',_this.printerCallb.bind(this,paymentid));
		//获取付款单打印信息
		jsonGetAjax(basePath+'/finance/payment/getPaymentApplyPrintInfo.htm',{
			paymentId:paymentid
		},function(rdata){
			$('#PayNumber').html('付款单号'+(rdata.data.paymentNumber==undefined?'-':'NO.'+rdata.data.paymentNumber));																					//付款单号
			$('#housId').html(rdata.data.houseId);																							//房源编号
			$('#payApplyNumber').html(rdata.data.applyId);																					//付款申请单编号
			$('#storefrontNum').html(rdata.data.shopId)																						//区/组团/店组编号（只显示最后一级）
			$('#storefrontName').html(rdata.data.shopName);																					//店组名称
			$('#contNumber').html(rdata.data.contractNumber);																				//合同编号
			$('#customerName').html(rdata.data.clientName);																					//客户姓名
			$('#ownerName').html(rdata.data.ownerName);																						//业主姓名
			$('#businessType').html(rdata.data.strPaymentType);																				//业务类型
			$('#moneyName').html(rdata.data.fundName)																						//款项名称
			$('#paymentMethod').html(rdata.data.strPayType);																				//付款方式
			$('#bankAddress').html(rdata.data.bankProvince+rdata.data.bankCity);															//转账：开户行具体省市信息
			$('#beneficiary').html(rdata.data.bankAccount);																					//收款人账号
			$('#beneName').html(rdata.data.receiverName);																					//收款人名称
			$('#unitName').html(rdata.data.receiverUnit);																					//支票：收款单位名称
			$('#amountLower').html(rdata.data.payAmount);																					//申请付款金额（小写）
			$('#amountCapital').html(rdata.data.uppercaseAmount);																			//申请付款金额（大写）
			$('#finanAuditor').html('财务审核人:'+(rdata.data.lastAuditUserName==undefined?'':rdata.data.lastAuditUserName));					//财务审核人
			$('#drawee').html('付款人:'+(rdata.data.realPayUserName==undefined?'':rdata.data.realPayUserName));											//付款人
			$('#payee').html('收款人：'+(rdata.data.strPayType=='现金'?'':(rdata.data.receiverName==undefined?'':rdata.data.receiverName)));	//收款人
			//判断款项名称是否是反信息费
			if(_this.urlData[1] && _this.urlData[1].split('=')[1]==1){
				jsonGetAjax(basePath+'/finance/payment/getExpenseVoucherPrintInfo.htm',{
					paymentId:paymentid
				},function(result){
					var fphtml='\
							<tr style="height:40px;">\
								<td style="border:1px solid #000;">-</td>\
								<td style="border:1px solid #000;">-</td>\
								<td colspan="4" style="border:1px solid #000;">-</td>\
							</tr>';
					if(result.data.invoiceInfoList && result.data.invoiceInfoList.length>0){
						fphtml='';
						$.each(result.data.invoiceInfoList,function(i,n){
							fphtml+='\
								<tr style="height:40px;">\
									<td style="border:1px solid #000;">'+n.strInvoiceDesc+'</td>\
									<td style="border:1px solid #000;">'+n.invoiceCount+'</td>\
									<td colspan="4" style="border:1px solid #000;">'+n.invoiceAmount+'</td>\
								</tr>';
						});
					}
					$('#CounInform').attr('id','page2').show();	//显示反信息费
					var html=$('#counter').html().replace('$num$',result.data.paymentPrintInfo.paymentNumber==undefined?'-':'NO.'+result.data.paymentPrintInfo.paymentNumber)			//付款单号
												 .replace('$htbh$',result.data.paymentPrintInfo.contractNumber||'-')																	//合同编号
												 .replace('$yzxm$',result.data.paymentPrintInfo.ownerName||'-')																			//业主姓名
												 .replace('$khxm$',result.data.paymentPrintInfo.clientName||'-')																		//客户姓名
												 .replace('<tr id="fap"></tr>',fphtml)																									//发票信息
												 .replace('$hjzs$',result.data.invoiceTotalCount||'-')																					//合计张数
												 .replace('$fkfs$',result.data.paymentPrintInfo.strPayType||'-')																		//付款方式
												 .replace('$jehj$',result.data.invoiceTotalAmount||'-')																					//发票金额合计
												 .replace('$dx$',result.data.uppercaseInvoiceTotalAmount||'-')																			//大写
												 .replace('$qymc$',result.data.paymentPrintInfo.shopAreaName||'-')																		//区域名称
												 .replace('$ztmc$',result.data.paymentPrintInfo.shopGroupName||'-')																		//组团名称
												 .replace('$dzmc$',result.data.paymentPrintInfo.shopName||'-')																			//店组名称
												 .replace('$qybm$',result.data.paymentPrintInfo.shopAreaId||'-')																		//区域编码
												 .replace('$ztbm$',result.data.paymentPrintInfo.shopGroupId||'-')																		//组团编码
												 .replace('$dzbm$',result.data.paymentPrintInfo.shopId||'-')																			//店组编码
												 .replace('$zpsk$',result.data.paymentPrintInfo.receiverUnit||'-')																		//收票单位名称
												 .replace('$cwsqr$',result.data.paymentPrintInfo.lastAuditUserName||'-')																//财务审核人
												 .replace('$fkr$',result.data.paymentPrintInfo.realPayUserName||'-')																	//付款人
												 .replace('$skr$',result.data.paymentPrintInfo.strPayType=='现金'?'':(result.data.paymentPrintInfo.receiverName||'-'))					//收款人
												 .replace('$khss$',(result.data.paymentPrintInfo.bankProvince+result.data.paymentPrintInfo.bankCity)||'-')								//转账：开户行具体省市信息
												 .replace('$skzh$',result.data.paymentPrintInfo.bankAccount||'-')																		//收款人账号
												 .replace('$skmc$',result.data.paymentPrintInfo.receiverName||'-');																		//收款人名称
					$('#counter').html(html);
					//$('#printTemplate table td').css({'border':'1px solid','border-color':'#000'});
					//获取服务器时间(限于服务器时间和本地时间无时差)
					var dataStr = new Date($.ajax({async: false}).getResponseHeader("Date"));
					$('#pdDate').text(dataStr.getFullYear()+'年'+(dataStr.getMonth()+1)+'月'+dataStr.getDate()+'日');
					$('#printBtn').off().on('click',_this.printerCallb.bind(_this,paymentid));
				});
			}else{
				//打印
				$('#printBtn').off().on('click',_this.printerCallb.bind(_this,paymentid));
			}
		});
	},
	//打印
	printerCallb:function(paymid){
   	 	var jatoolsPrinter = this.createPrinter();
        if (typeof jatoolsPrinter.print !== 'undefined' && typeof jatoolsPrinter.printPreview !== 'undefined') {
            var myDoc = {
                documents: document,
                copyrights: '杰创软件拥有版权  www.jatools.com',  // 版权声明,必须
                autoBreakPage: true,// 自动分页打印区域内容
                importedStyle : ['http://10.2.1.23:1111/static/resources/css/bootstrap.min.css?v=3.3.6','http://10.2.1.23:1111/static/resources/css/plugins/bootstrap-table/bootstrap-table.min.css','http://10.2.1.23:1111/static/resources/css/style.css?v=4.1.0'],
                settings: {
                    copies: 1, // 打印几份
                },
                onPagePrinted: function (current, total) {
                    // 每一页打印完后的回调函数
	               	if(current == total - 1){
//                		$http.get(basePath + '/finance/receipt/insertupdate' , {params : {receiptCode : receiptCode,receiptId:receiptId}}).then(function (response) {
//                			if (result.code !== 0) {
//                                throw layer.alert(result.msg);
//                            }
//                            layer.alert('打印完成');
//                        });   
	               		//记录打印日志
	               		jsonGetAjax(basePath+'/finance/payment/recordPaymentPrintInfo.htm',{
	               			paymentId:paymid
	               		},function(){});
	                }
                }
            };
            var defaultPrinter = jatoolsPrinter.getDefaultPrinter();// 获取默认打印机
            if (/pdf/i.test(defaultPrinter)) {
                layer.alert('默认打印机不能是 PDF 打印机,请重新设置默认打印机');
            }
            //jatoolsPrinter.print(myDoc);  // 直接打印
            jatoolsPrinter.printPreview(myDoc);  // 预览 
        } else {
            layer.alert('无法打印，请在`小房子`浏览器中使用此功能，如果已经在`小房子`浏览器中，请安装打印控件后重启浏览器在试');
        }
	},
	//创建打印
	createPrinter:function(){
		var toolsId = 'jatoolsPrinter';
	    if (!document.getElementById(toolsId)) {
	        document.head.insertAdjacentHTML('afterBegin', '<object id="jatoolsPrinter" ' +
	            'classid="CLSID:B43D3361-D075-4BE2-87FE-057188254255" ' +
	            'codebase="jatoolsPrinter.cab#version=5,7,0,0"></object>');
	    }
	    return document.getElementById(toolsId);
	}
}