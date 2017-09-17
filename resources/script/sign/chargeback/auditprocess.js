$(function(){
	attachmentView.init();
});
var attachmentView={
	initFalg:true,
	chargebackId:location.search.split('&')[0].split('=')[1],
	init:function(){
		var _this=this;
		//查询单据编号
		jsonGetAjax(basePath+'/sign/chargeback/chargebackCommon.htm',{
			chargebackid:_this.chargebackId
		},function(rdata){
			if(rdata.data.auditstatus=="3"||rdata.data.auditstatus=="8"){
				$("#goFeiyzhixmx").show();
			}	
			$('#signnumber').html('单据编号：'+rdata.data.signnumber);
			$('#strauditstatus').html('审核状态：'+rdata.data.strauditstatus);
			//跳转到退单信息
			$('#goTuidanInfor').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/detail.html?signnumber='+rdata.data.signnumber;
			});
			var urlDate=location.search;
			//跳转到费用处理
			$('#gofeiYongcl').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/cost.html'+urlDate;
			});
			//跳转到附件管理
			$('#goAttachment').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/attachment.html'+urlDate;
			});
			//跳转到补充协议
			$('#goAgreement').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/supplementalagreement.html'+urlDate;
			});
            //跳转到业绩信息
            $('#performance').off().on('click',function(){
                location.href=basePath+'/sign/chargeback/chargeBackToPerformance' +
					''+urlDate;
            });
			//跳转到费用执行明细
			$('#goFeiyzhixmx').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/costdetail.html'+urlDate;
			});
			jsonGetAjax(basePath+'/sign/chargeback/chargebackdetail.htm',{
				signnumber:rdata.data.signnumber			//单据编号
			},function(result){
				var contractNumber=result.data.contractcode
				if(result.data.strbusinesstype=='租赁'){
					jsonPostAjax(basePath+'/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=getFlowChartUrlByBusiness',{			
					    formId:_this.chargebackId
					},function(result){
						$('#J_srcimg').attr('src',result.data.RENT_CHARGEBACK);
					});
					jsonGetAjax(
							basePath+'/sign/chargeback/findAllHistoryList',
							{			
								type:"RENT_CHARGEBACK",
								formId:_this.chargebackId
							},
							function(resultdata){
								var list = []; // [ [] , [item , item] , [item , item] ]
								var cache = {};
								resultdata.data.forEach(function(item){
									var historyList = cache[item.processInstanceId];
									if(!historyList){
										historyList = cache[item.processInstanceId] = [];
										list.push(historyList);
									}
									if(!item.createtime){
										historyList.unshift(item);
									}else{
										historyList.push(item);	
									}
								});
								list.forEach(function(historyList){
									var index=1;
									var tabevaluationHtml='\
										<table id="J_evaluationtable_dataTable" class="table table-hover table-striped table-bordered">\
										<thead>\
										<tr>\
											<th data-field="">\
												<div class="th-inner">序号</div>\
											</th>\
											<th data-field="" class="col-sm-3">\
												<div class="th-inner">审批部门</div>\
											</th>\
											<th data-field="">\
												<div class="th-inner">角色</div>\
											</th>\
											<th data-field="">\
												<div class="th-inner">审批人</div>\
											</th>\
											<th data-field="">\
												<div class="th-inner">审批时间</div>\
											</div>\
											</th>\
											<th data-field="">\
												<div class="th-inner">审批结果</div>\
											</th>\
											<th data-field="" class="col-sm-2">\
												<div class="th-inner">审批意见</div>\
											</th>\
											<th data-field=""  class="col-sm-1">\
												<div class="th-inner">审批持续时间</div>\
											</th>\
										</tr>\
									</thead>\
										<tbody>';
									historyList.forEach(function(value){
										var createtime = value.createtime;
										var usedtime = value.usedtime;
										if(createtime == undefined){
											createtime = '-';
										};
										if(usedtime == undefined){
											usedtime = '-';
										}
										tabevaluationHtml+='<tr>\
															<td>'+(index++)+'</td>\
															<td>'+value.deptname+'</td>\
															<td>'+value.rolename+'</td>\
															<td>'+value.username+'</td>\
															<td>'+createtime+'</td>\
															<td>'+value.result+'</td>\
															<td>'+value.comment+'</td>\
															<td>'+usedtime+'</td>\
														</tr>';
									})
									tabevaluationHtml+='</tbody></table>';
									$('#J_dataTable').append(tabevaluationHtml);
								});
							}
						)
				}else if(result.data.strbusinesstype=='买卖'){
					jsonPostAjax(basePath+'/workflow/doJob?modelName=BUY_CHARGEBACK&methodName=getFlowChartUrlByBusiness',{			
					    formId:_this.chargebackId
					},function(result){
						$('#J_srcimg').attr('src',result.data.BUY_CHARGEBACK);
					});
					jsonGetAjax(
							basePath+'/sign/chargeback/findAllHistoryList',
							{			
								type:"BUY_CHARGEBACK",
								formId:_this.chargebackId
							},
							function(resultdata){
								var list = []; // [ [] , [item , item] , [item , item] ]
								var cache = {};
								resultdata.data.forEach(function(item){
									var historyList = cache[item.processInstanceId];
									if(!historyList){
										historyList = cache[item.processInstanceId] = [];
										list.push(historyList);
									}
									if(!item.createtime){
										historyList.unshift(item);
									}else{
										historyList.push(item);	
									}
								});
								list.forEach(function(historyList){
									var index=1;
									var tabevaluationHtml='\
										<table id="J_evaluationtable_dataTable" class="table table-hover table-striped table-bordered">\
										<thead>\
											<tr>\
												<th data-field="">\
													<div class="th-inner">序号</div>\
												</th>\
												<th data-field="">\
													<div class="th-inner">审批部门</div>\
												</th>\
												<th data-field="">\
													<div class="th-inner">角色</div>\
												</th>\
												<th data-field="">\
													<div class="th-inner">审批人</div>\
												</th>\
												<th data-field="">\
													<div class="th-inner">审批时间</div>\
												</div>\
												</th>\
												<th data-field="">\
													<div class="th-inner">审批结果</div>\
												</th>\
												<th data-field="">\
													<div class="th-inner">审批意见</div>\
												</th>\
												<th data-field="">\
													<div class="th-inner">审批持续时间</div>\
												</th>\
											</tr>\
										</thead>\
										<tbody>';
									historyList.forEach(function(value){
										var createtime = value.createtime;
										var usedtime = value.usedtime;
										if(createtime == undefined){
											createtime = '-';
										};
										if(usedtime == undefined){
											usedtime = '-';
										}
										tabevaluationHtml+='<tr>\
															<td>'+(index++)+'</td>\
															<td>'+value.deptname+'</td>\
															<td>'+value.rolename+'</td>\
															<td>'+value.username+'</td>\
															<td>'+createtime+'</td>\
															<td>'+value.result+'</td>\
															<td>'+value.comment+'</td>\
															<td>'+usedtime+'</td>\
														</tr>';
									})
									tabevaluationHtml+='</tbody></table>';
									$('#J_dataTable').append(tabevaluationHtml);
								});
							}
						)
				}
			})
		});
	}
}
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 