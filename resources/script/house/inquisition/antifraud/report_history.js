//var followUrl = basePath + '/custom/common/checkcustomertel.htm'
function followshow(customerId) {	
	var followDialog = '<div id="demo_layer" class="ibox-content" style="display: none">'+
						   '<form id="retreatkey_form" name="retreatkey_form" class="form-horizontal">'+
								'<div class="row">'+
									'<div id="showadd">'+
										'<div class="col-sm-4">'+
											'<label class="col-sm-5 control-label">房源编号:</label>'+
											'<p class="col-sm-7 form-control-static"><a href="">NMCA00123</a></p>'+
										'</div>'+
										'<div class="col-sm-4">'+
											'<label class="col-sm-5 control-label">楼盘:</label>'+
											'<p class="col-sm-7 form-control-static">南新仓商务大厦</p>'+
										'</div>'+
										'<div class="col-sm-4">'+
											'<label class="col-sm-5 control-label">栋座:</label>'+
											'<p class="col-sm-7 form-control-static">Ａ栋</p>'+
										'</div>'+
										'<div class="col-sm-4">'+
											'<label class="col-sm-5 control-label">户型:</label>'+
											'<p class="col-sm-7 form-control-static">3-2-1-2-1</p>'+
										'</div>'+
										'<div class="col-sm-4">'+
											'<label class="col-sm-5 control-label">面积:</label>'+
											'<p class="col-sm-7 form-control-static">100.0平方米</p>'+
										'</div>'+
										'<div class="col-sm-4">'+
											'<label class="col-sm-5 control-label">所属人:</label>'+
											'<p class="col-sm-7 form-control-static">张三</p>'+
										'</div>'+
										'<div class="col-sm-12">'+
											'<label class="col-sm-4 control-label" style="text-align:left">关键信息查看未跟进记录:</label>'+
											'<p class="col-sm-8 form-control-static">查看电话 <time style="margin-left:10px;">2017-01-23 13:15:24</time></p>'+
										'</div>'+
									'</div>'+
									'<div class="col-md-11">'+
										'<div class="form-group">'+
											'<label class="col-sm-4 control-label">房源评价跟进:</label>'+
											'<div class="col-sm-7">'+
												'<select id="J_evaluationType" name="evaluationType" class="J_chosen form-control" data-placeholder="请选择">'+
													'<option value="">请选择</option>'+
													'<option value="">可租/可售</option>'+
													'<option value="">暂不售</option>'+
													'<option value="">他租/他售</option>'+
												'</select>'+
											'</div>'+
										'</div>'+
										'<div class="form-group">'+
											'<label class="col-sm-4 control-label">跟进内容:</label>'+
											'<div class="col-sm-7">'+
												'<textarea type="text" id="J_followcontent" name="followcontent" class="form-control"></textarea>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</form>'+
						'</div>';
	$(document.body).append(followDialog);
	
	var followtitle = '';
	if(customerId == 1){
		followtitle="添加跟进";
		$('#showadd').hide();
	}else if(customerId == 2){
		followtitle="强制跟进";
		$('#showadd').show();
	};
	
	// 加载跟进强制跟进数据
	/*followInit(customerId);*/
	var div = jQuery('#demo_layer');
	layer.open({
	  	type: 1,
	  	shift: 5,
  		title: followtitle,
	  	area: ['600px'],
	  	skin : 'layui-layer-lan',
	  	content: div,
	  	btn : ['保存','关闭'],
	  	yes: function(index, layero) {
	  		
			layer.close(index);
			$('#J_customerName').html('');
			$('#J_customerPhone').html('');
	  	}
	});
}

/*function followInit(customerId) {
	if(customerId) {
		// 加载数据
		jsonGetAjax(
			followUrl,
			{clientid: customerId},
			function(result) {
				$('#J_customerName').html(); //result.data.customername
				$('#J_customerPhone').html();
			}
		)
	}
}*/

