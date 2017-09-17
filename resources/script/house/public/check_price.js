/**
 * 房源价格浮动
 */
var priceUrl = basePath + '/house/basichistory/pricelist';

function checkPrice(houseId) {
	var priceDialog = '<div id="price_layer" class="ibox-content" style="height: 100%;display:none">' +
		'<div class="bootstrap-table table-list" id="price-table">' +
	'<div class="fixed-table-container">' +
		'<table id="dataTableArea" class="table table-hover  table-striped bor_b_none">' +
			'<thead>' +
				'<tr>' +
					'<th data-field="id">操作部门</th>' +
					'<th data-field="price">操作人</th>' +
					'<th data-field="opt">变化前</th>' +
					'<th data-field="opt">变化后</th>' +
					'<th data-field="opt">变化幅度</th>' +
					'<th data-field="opt">操作时间</th>' +
				'</tr>' +
			'</thead>' +
			'<tbody>' +
/*				<tr>
					<td>南新仓商务大厦A组</td>
					<td>姚世强</td>
					<td>5000</td>
					<td>1000</td>
					<td>80%&nbsp;&nbsp;4000</td>
					<td>2016年10月22日11:49:51</td>
				</tr>*/
			'</tbody>' +
		'</table>' +
	'</div>' +
'</div>' +
'</div>';	
	
	//调用查看电话的接口			
	$.ajax({
	url : priceUrl,
	data:{housesid:houseId},
	type : 'get',
	dataType : 'json',
	cache : false,
	contentType : "application/json ; charset=utf-8",
	success : function(result) {
			if (result.code == '0') {//返回值判断是否有跟进
				$(document.body).append(priceDialog);
				commonContainer.modal(//查看电话模态框
					'价格变动详情',
					$('#price_layer'),
					function(index, layero) {						
						layer.close(index);						
					}, 
					{
						overflow :true,
						area : ['650px','80%'],
						btns : ['关闭'],
						success: function() {//展示查看电话数据
							$("#price-table tbody").empty();
							if(result.data.priceList.length>0){
								for(var i=0;i<result.data.priceList.length;i++){
									if(result.data.priceList[i].derection==1){
										var str='<tr><td>'+result.data.priceList[i].deptname+'</td><td onclick="getUserStaffInfo('+result.data.priceList[i].usid+')">'+result.data.priceList[i].username+'</td><td>'+result.data.priceList[i].pricebefore+'</td><td>'+result.data.priceList[i].priceafter+'</td><td style="color:#FC2C00"><i class="fa fa-long-arrow-up"></i>'+Math.mul(result.data.priceList[i].range,100)+'%&nbsp;&nbsp;'+result.data.priceList[i].balance+'</td><td>'+result.data.priceList[i].createtime+'</td></tr>';
										$("#price-table tbody").append(str);
									}else{
										var str='<tr><td>'+result.data.priceList[i].deptname+'</td><td onclick="getUserStaffInfo('+result.data.priceList[i].usid+')">'+result.data.priceList[i].username+'</td><td>'+result.data.priceList[i].pricebefore+'</td><td>'+result.data.priceList[i].priceafter+'</td><td style="color:#57CC00"><i class="fa fa-long-arrow-down"></i>'+Math.mul(result.data.priceList[i].range,100)+'%&nbsp;&nbsp;'+result.data.priceList[i].balance+'</td><td>'+result.data.priceList[i].createtime+'</td></tr>';
										$("#price-table tbody").append(str);
									}
									
								}							
							}														
						}
					}
				);
			} else {// 返回值为1 弹出强制跟进 模态框	
				layer.alert(result.msg);
			}
		}
	})	
}