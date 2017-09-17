$(function(){
	//初始化数据
	
})
var followInsertUrl = basePath + '/house/follow/insert';

/**
 * 添加跟进
 * @param houseId：房源编号
 * @param followType：跟进类型：1，跟进；2，带看；3，空看
 * @param followWay：跟进方式：1，普通跟进；2，看电话跟进；3，看地址跟进
 * @param businessType：业务类型：1，租赁；2，买卖
 */
function addFollow(houseId, followType, followWay, businessType) {
	$('#J_followAddLayer').remove();
	
	var followDialog = '<div id="J_followAddLayer" class="ibox-content" style="display: none">'+
						   '<form name="add_form" class="form-horizontal">'+		
								'<div class="row">'+
									'<div class="col-md-11 mt20">'+
										'<div class="form-group">'+
											'<label class="col-sm-3 control-label"><span class="color_red">*</span>房源评价跟进：</label>'+
											'<div class="col-sm-4">'+
												'<select id="J_evaluateaddFollow" name="evaluate" class="J_chosen form-control">'+
												'</select>'+
											'</div>'+
											'<div id="J_notContact_box" class="col-sm-4" style="padding-left:10px !important; display:none !important;">'+
												'<select id="J_notContactReason" name="notcontactreason" class="J_chosen form-control">'+
												'</select>'+
											'</div>'+
										'</div>'+
										'<div class="form-group">'+
											'<label class="col-sm-3 control-label"><span class="color_red">*</span>跟进内容：</label>'+
											'<div class="col-sm-8">'+
												'<textarea followType="text" id="J_textarea" rows="5" name="content" class="form-control" maxlength="500"></textarea>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</form>'+
						'</div>';
	$(document.body).append(followDialog);

	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
	commonContainer.modal(
		'添加跟进',
		$('#J_followAddLayer'),
		function(index, layero) {
			var followAddcontent = $('#J_textarea').val();
			if(followAddcontent == ''){
				layer.alert('请输入跟进内容');
				return false;
			}
			commonContainer.showLoading();
			jsonPostAjax(
				followInsertUrl,
				{	
					"houseid": houseId,
					"type": followType,
					"way": followWay,
					"content": followAddcontent,
					"evaluate": $('#J_evaluateaddFollow').val(),
					"notContactReason" : $("#J_notContactReason").val()
				},
				function(result) {
					commonContainer.hideLoading();
					layer.close(index);
					layer.msg("操作成功");
					
					$('#J_followAddLayer').remove();
				}
			)
		}, 
		{
			overflow :false,
			area : ['650px','300px'],
			btns : ['保存', '关闭'],
			success: function() {
		  		$('#J_evaluateaddFollow').html('');
				$('#J_textarea').val('');
		  		// 初始化跟进评价数据
				if(businessType == 1) {
					dimContainer.buildDimChosenSelector($("#J_evaluateaddFollow"), "LessorHouseEvaluate", "1");
				} else if(businessType == 2){
					dimContainer.buildDimChosenSelector($("#J_evaluateaddFollow"), "SellerHouseEvaluate", "1");
				}

				$('#J_evaluateaddFollow').on('input change',function(){
					var followevaluate=$(this).val();
					
					if(followevaluate == '4'){
						$('#J_notContact_box').show();
						//初始化无法联系业主原因数据
						dimContainer.buildDimChosenSelector($("#J_notContactReason"), "notContactReason", "1");
					}else{
						$('#J_notContact_box').hide();
					}

				})
			}
		}
	);
}
