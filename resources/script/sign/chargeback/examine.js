var index=1;

(function(){
	var taskId=getQueryString("taskId");
	var templateid=getQueryString("templateId");
	onclickexamine();
	function onclickexamine(){
		//初始根据taskId获取单据编号
		jsonPostAjax(basePath + '/workflow/doJob?modelName=RENT_CHARGEBACK&methodName=getParamsByTaskId',{	
			"taskId":taskId							
		}, function(result) {
			
			chargebackDetailView.init(result.data.signnum);
		});

		//标签table切换 所展示的数据总方法
		var chargebackDetailView={
			init:function(signnumber){
				var _$this = this;
				this.getDetai(signnumber);
			},
			
			getDetai:function(signnumber){
				var _this=this;
				jsonGetAjax(basePath+'/sign/chargeback/chargebackdetail.htm',{
					signnumber:signnumber			//单据编号
				},function(result){
					_this.chargebackId = result.data.chargebakcid;
					var contractNumber = result.data.contractcode;
					var type = '';
					if(result.data.strbusinesstype=='租赁'){
						type = 'RENT_CHARGEBACK'; // 
					}else if(result.data.strbusinesstype=='买卖'){
						type = 'BUY_CHARGEBACK';
					}
					
					jsonPostAjax(basePath+'/workflow/doJob?modelName='+type+'&methodName=getFlowChartUrlByBusiness',{			
					    formId:_this.chargebackId
					},function(result){
						$('#J_srcimg').attr('src',result.data[type]);
					});
					jsonGetAjax(
							basePath+'/sign/chargeback/findAllHistoryList',
							{			
								type:type,
								contractCode:contractNumber
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
										if(value.createtime == undefined){
											value.createtime = '-';
										};
										if(value.usedtime == undefined){
											value.usedtime = '-';
										}
										tabevaluationHtml+='<tr>\
															<td>'+(index++)+'</td>\
															<td>'+value.deptname+'</td>\
															<td>'+value.rolename+'</td>\
															<td>'+value.username+'</td>\
															<td>'+value.createtime+'</td>\
															<td>'+value.result+'</td>\
															<td>'+value.comment+'</td>\
															<td>'+value.usedtime+'</td>\
														</tr>';
									})
									tabevaluationHtml+='</tbody></table>';
									$('#J_dataTable').append(tabevaluationHtml);
								});
							}
						)
				});
			}
		}
	}
	function getQueryString(name) { // js获取url地址以及 取得后面的参数
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); return null; 
	} 

}());

