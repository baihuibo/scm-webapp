/**
 * 审批人变更
 */
$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
})
var auditlayerUrl = basePath + '/house/audit/changeaudituser';
var auditnumberUrl = basePath + '/house/audit/getcountbyuserid';

function auditlayer(veriifyIdArr, isDetailChange) {
	
	var auditlayerDialog = '<div id="audit_layer" class="ibox-content" style="display: none">' +
								'<form id="retreatkey_form" name="retreatkey_form" class="form-horizontal">' +
									'<div class="form-group">' +
										'<label class="col-sm-3 control-label">变更后审批人：</label>' +
										'<div class="col-sm-3">'+
											'<input type="hidden" value="" id="J_personuserid">'+
											'<label class="control-label text-left" id="J_personname"></label>' +
											'<label class="control-label text-left"><a id="J_Changeperson" style="color:#ff0000;">请选择变更人</a></label>' +
										'</div>'+
										'<div id="J_amount" class="col-sm-6" style="display:none;">' +
											'<label class="col-sm-4 control-label">待审批单据量：</label>' +
											'<label class="col-sm-8 control-label text-left" id="J_number"></label>' +
										'</div>' +
									'</div>' +
									'<div class="form-group">' +
										'<label class="col-sm-3 control-label">变更备注：</label>' +
										'<div class="col-sm-8">' +
											'<textarea type="text" id="J_layertextarea" name="" class="form-control" maxlength="500"></textarea>' +
										'</div>' +
									'</div>' +
								'</form>' +
							'</div>'
	$(document.body).append(auditlayerDialog);
	
	// 加载分配审批人数据
	commonContainer.modal(
			'审批人变更',
			$('#audit_layer'),
			function(index, layero) {
				jsonPostAjax(
					auditlayerUrl,
					{	
						"id" : veriifyIdArr,
						"afterchangeuserid" : $('#J_popuser').attr('data-id'),
						"changeremark": $('#J_layertextarea').val()
					},
					function(result) {
						$('#J_curauditusername').text( $('#J_popuser').val());
						jQuery('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/audit/uncheckedlist'});
						layer.msg("操作成功");
						layer.close(index);
						if(isDetailChange){
							jsonGetAjax(
								basePath + '/house/audit/detail',
								{	
									houseid: $('#J_houseidrecord').text()
								},
								function(result) {
									// 变更审批人数据加载
									loadUserTraceTableData(result);
								}
							);
						}
						
					}
				)
			}, 
			{
				overflow :true,
				area : ['650px'],
				btns : ['确定', '取消'],
				success: function() {
					$('#J_personname').text('');
					$('#J_personuserid').val('');
					$('#J_layertextarea').val('');
					$('#J_number').text('');
					$('#J_amount').hide();
					
					//操作人自动补全查询
					searchContainer.searchUserListByComp($("#J_popuser"), true, 'left');
				}
			}
		);
}

var  changepersonDialog = '<div id="J_changeperson_layer" class="ibox-content" style="display: none">' +
							  '<form id="retreatkey_form" name="retreatkey_form" class="form-horizontal">' +
			                      '<div class="col-sm-12">' +
									  '<div class="input-group">' +
										  '<input type="text" class="form-control" id="J_popuser" autocomplete="off" name="belonguserid" value="">' +
										  '<div class="input-group-btn">' +
											  '<button type="button" class="btn btn-white dropdown-toggle" data-toggle="">' +
												  '<span class="glyphicon glyphicon-search search-caret"></span>' +
											  '</button>' +
											  '<ul class="dropdown-menu dropdown-menu-left" role="menu" style="padding-top: 0px; max-height: 375px; max-width: 800px; overflow: auto; width: auto; transition: 0.3s; left: auto; right: 0px; min-width: 145px; position:absolute">' +
											  '</ul>' +
										  '</div>' +
									  '</div>' +
								  '</div>'+
					          '</form>'+
				         '</div>'
$(document.body).append(changepersonDialog);

$(document).delegate(
	'#J_Changeperson',
	'click',
	function(event) {
		commonContainer.modal(
				'选择审批人',
				$('#J_changeperson_layer'),
				function(index, layero) {
					layer.close(index);
					
					$('#J_personname').text($('#J_popuser').val());
					$('#J_personuserid').val($('#J_popuser').attr('data-id'));
					jsonGetAjax(
						auditnumberUrl,
						{	
							"audituserid" : $('#J_popuser').attr('data-id')
						},
						function(result) {
							$('#J_number').text(result.data);
							$('#J_amount').show();
						}
					)
				}, 
				{
					overflow :true,
					area : ['35%','40%'],
					btns : ['确定', '取消'],
					success: function() {
						$('#J_popuser').val('');
						$('#J_popuser').attr('data-id', '');
					}
				}
			);
	}
)