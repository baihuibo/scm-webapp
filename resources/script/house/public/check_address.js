/**
 * 房源查看地址
 */
/*$(function() {
	// 初始化数据
	$("select").chosen({
		width : "100%",
		no_results_text : "未找到此选项!"
	});
})*/
var houseShowAddressDialog = '<div id="demo_layer2" class="ibox-content" style="display: none">'
		+ '<form id="retreatkey_form" name="retreatkey_form" class="form-horizontal">'
		+ '<div class="row">'
		+ '<div class="col-sm-12">'
		+ '<div class="form-group trr">'
		+ '<label class="col-sm-3 control-label">喷涂地址：</label>'
		+ '<p class="col-sm-9 form-control-static" id="J_Spraying"></p>'
		+ '</div>'
		+ '<div class="form-group trr">'
		+ '<label class="col-sm-3 control-label">证载地址：</label>'
		+ '<p class="col-sm-9 form-control-static" id="J_Proof"></p>'
		+ '</div>'
		+ '<div class="form-group trr">'
		+ '<label class="col-sm-3 control-label">其他地址：</label>'
		+ '<p class="col-sm-9 form-control-static" id="J_other"></p>'
		+ '</div>' + '</div>' + '</div>' + '</form>' + '</div>';

function checkAddress(houseId) {
	commonContainer.showLoading();
	// 奇偶变色，添加样式
	/*$(document).ready(function() {
		$('.trr').addClass('odd-tr');
		$('.trr:even').addClass('even-tr');
	});*/
	$.ajax({
		url : basePath + '/house/main/checkProtectStatus',
		data : {
			houseId:houseId,
			type:1
		},
		type : 'get',
		dataType : 'json',
		cache : false,
		contentType : "application/json ; charset=utf-8",
		success : function(result) {
		 if(result.code != 0){
			 commonContainer.hideLoading();
			 layer.alert(result.msg);
			 return ;
		 }
		// 加载地址详细信息数据
		$.ajax({
			url : basePath + '/house/queryprivacy/addresslist',
			data : {
				houseid : houseId
			},
			type : 'get',
			dataType : 'json',
			cache : false,
			contentType : "application/json ; charset=utf-8",
			success : function(result) {
				commonContainer.hideLoading();
				if (result.code == '0') { // 可正常查看地址
					showAddress(houseId, result);
				}else if(result.code == '2'){
					layer.alert(result.msg);
				} else {// 返回值为1 弹出强制跟进 模态框
					$('#J_businessType').val(result.data.housekind);
					var dataaddressfollowType = result.data.followtype; // 获取地址跟进中返回参数判断
					// 返回值为2--查看地址跟进，
					// 返回值是1--查看电话跟进
					if (dataaddressfollowType == '2') {// 根据返回的参数 做转换 2--查看地址跟进
						// 对应到跟进接口里面 3是查看地址跟进
						dataaddressfollowType = '3'
					}
					if (dataaddressfollowType == '1') {// 根据返回的参数 做转换 1--查看电话跟进
						// 对应到跟进接口里面 2是查看电话跟进
						dataaddressfollowType = '2'
					}
					if (result.data.flag == true) {//是否需要跟进 true跟进
						addFollowaddress(houseId, 1, dataaddressfollowType, true);
					}
					if (result.data.flag == false && result.data.struts == true) {
						layer.alert('今日查看次数已满');
					}
				}
			}
		})
		}
	})
}
var showAddressFlag=true;
function showAddress(houseId, result) {
	if(showAddressFlag){
		$(document.body).append(houseShowAddressDialog);
		showAddressFlag=false;
	}	
	commonContainer
			.modal(
					'地址详细信息',
					$('#demo_layer2'),
					function(index, layero) {
						layer.close(index);
						addFollowaddress(houseId, 1, 3, false);
					},
					{
						overflow : true,
						area : [ '650px' ],
						btns : [ '关闭' ],
						success : function() {
							if (result.data.addresslist.length > 0) {
								$('#J_Spraying')
										.text(
												result.data.addresslist[0].address ? result.data.addresslist[0].address
														: '-');
								$('#J_Proof')
										.text(
												result.data.addresslist[0].zhengzaidizhi ? result.data.addresslist[0].zhengzaidizhi
														: '-');
								$('#J_other')
										.text(
												result.data.addresslist[0].otheraddress ? result.data.addresslist[0].otheraddress
														: '-');
							}
						}
					});
}

/**
 * 查看核心信息强制跟进
 * 
 * @param houseId
 * @param followType
 * @param followWay
 * @param showAddressAfterClosed：关闭强制跟进后是否显示地址信息
 */
var followDialog = '<div id="J_followAddLayerAdress" class="ibox-content" style="display: none">'
	+ '<form name="add_form" class="form-horizontal">'
	+ '<div class="row">'
	+ '<div id="J_showHouseBasicInfo">'
	+ '<div class="row">'
	+ '<div class="col-sm-4">'
	+ '<label class="col-sm-5 control-label">房源编号：</label>'
	+ '<input type="hidden" value="" id="J_housekind">'
	+ '<p class="col-sm-7 form-control-static"><a id="J_houseId" target="_blank"></a></p>'
	+ '</div>'
	+ '<div class="col-sm-4">'
	+ '<label class="col-sm-5 control-label">楼盘：</label>'
	+ '<p class="col-sm-7 form-control-static" id="J_conmmunity"></p>'
	+ '</div>'
	+ '<div class="col-sm-4">'
	+ '<label class="col-sm-5 control-label">栋座：</label>'
	+ '<p class="col-sm-7 form-control-static" id="J_building"></p>'
	+ '</div>'
	+ '</div>'
	+ '<div class="row">'
	+ '<div class="col-sm-4">'
	+ '<label class="col-sm-5 control-label">户型：</label>'
	+ '<p class="col-sm-7 form-control-static" id="J_houseStructure"></p>'
	+ '</div>'
	+ '<div class="col-sm-4">'
	+ '<label class="col-sm-5 control-label">建筑面积：</label>'
	+ '<p class="col-sm-2 form-control-static" id="J_houseArea"></p>'
	+ '<p class="col-sm-5 control-label text-left">平方米</p>'
	+ '</div>'
	+ '<div class="col-sm-4">'
	+ '<label class="col-sm-5 control-label">所属人：</label>'
	+ '<input type="hidden" value="" id="J_usid">'
	+ '<p class="col-sm-7 form-control-static"><a id="J_belongUserId"></a></p>'
	+ '</div>'
	+ '</div>'
	+ '<div class="row">'
	+ '<div class="col-sm-10">'
	+ '<label class="col-sm-4 control-label">关键信息查看未跟进记录：</label>'
	+ '<span class="col-sm-2 control-label text-left" id="J_noFollowType"></span>'
	+ '<span class="col-sm-6 control-label text-left" id="J_noFollowTime"></span>'
	+ '</div>'
	+ '</div>'
	+ '</div>'
	+ '<div class="row">'
	+ '<div class="col-md-11 mt20">'
	+ '<div class="form-group">'
	+ '<label class="col-sm-3 control-label"><span class="color_red">*</span>房源评价跟进：</label>'
	+ '<div class="col-sm-4">'
	+ '<select id="J_evaluate" name="evaluate" class="J_chosen form-control">'
	+ '</select>'
	+ '</div>'
	+ '<div id="J_notContact_box" class="col-sm-4" style="padding-left:10px !important; display:none !important;">'
	+ '<select id="J_notContactReason" name="notcontactreason" class="J_chosen form-control">'
	+ '</select>'
	+ '</div>'
	+ '</div>'
	+ '<div class="form-group">'
	+ '<label class="col-sm-3 control-label"><span class="color_red">*</span>跟进内容：</label>'
	+ '<div class="col-sm-7">'
	+ '<textarea followType="text" id="J_textarea" name="content" class="form-control" maxlength="500"></textarea>'
	+ '</div>'
	+ '</div>'
	+ '</div>'
	+ '</div>'
	+ '</div>'
	+ '</form>'
	+ '</div>';
var followAdressFlag=true;
function addFollowaddress(houseId, followType, followWay,
		showAddressAfterClosed) {
	//$('#J_followAddLayerAdress').remove();
	if(followAdressFlag){
		$(document.body).append(followDialog);
		followAdressFlag=false;
	}
	
	// 初始化数据
	$("#J_followAddLayerAdress select").chosen({
		width : "100%",
		no_results_text : "未找到此选项!"
	});

	var followTitle = '';
	if (followWay > 1) {
		followTitle = "强制跟进";
		$('#J_followAddLayerAdress #J_showHouseBasicInfo').show();
	} else {
		followTitle = "添加跟进";
		$('#J_followAddLayerAdress #J_showHouseBasicInfo').hide();
	}
	;

	// 判断是否是强制跟进，如果是加载强制跟进数据
	if (followWay > 1) {
		commonContainer.showLoading();
		$
				.ajax({
					url : basePath + '/house/queryprivacy/followuplist',
					data : {
						houseid : houseId
					},
					type : 'get',
					dataType : 'json',
					cache : false,
					contentType : "application/json ; charset=utf-8",
					success : function(result) {
						commonContainer.hideLoading();
						if (result.data && typeof (result.data) != "undefined") {
							var addressbedroom = result.data.bedroom;
							var addresslivingroom = result.data.livingroom;
							var addresskitchen = result.data.kitchen;
							var addresstoilet = result.data.toilet;
							var addressbalcony = result.data.balcony;
							var addressfollowtype = result.data.followtype;
							if (addressfollowtype == '2') {
								addressfollowtype = '查看地址';
							} else {
								addressfollowtype = '查看电话';
							}

							if (addressbedroom == undefined
									|| addressbedroom == '') {
								addressbedroom = 0;
							}
							;
							if (addresslivingroom == undefined
									|| addresslivingroom == '') {
								addresslivingroom = 0;
							}
							;
							if (addresskitchen == undefined
									|| addresskitchen == '') {
								addresskitchen = 0;
							}
							;
							if (addresstoilet == undefined
									|| addresstoilet == '') {
								addresstoilet = 0;
							}
							;
							if (addressbalcony == undefined
									|| addressbalcony == '') {
								addressbalcony = 0;
							}
							;
							$('#J_followAddLayerAdress #J_houseId').text(
									result.data.housesid);
							$('#J_followAddLayerAdress #J_conmmunity').text(
									result.data.address);
							$('#J_followAddLayerAdress #J_building').text(
									result.data.louhao);
							$('#J_followAddLayerAdress #J_houseStructure')
									.text(
											addressbedroom + '-'
													+ addresslivingroom + '-'
													+ addresskitchen + '-'
													+ addresstoilet + '-'
													+ addressbalcony);
							$('#J_followAddLayerAdress #J_houseArea').text(
									result.data.buildarea);
							$('#J_followAddLayerAdress #J_belongUserId').text(
									result.data.unname);
							$('#J_followAddLayerAdress #J_noFollowType').text(
									addressfollowtype);
							$('#J_followAddLayerAdress #J_noFollowTime').text(
									result.data.creatrtime.substring(0, 16));
							$('#J_followAddLayerAdress #J_usid').val(
									result.data.usid);
							$('#J_followAddLayerAdress #J_housekind').val(
									result.data.housekind);

							// 加载强制跟进弹出框
							commonContainer
									.modal(
											followTitle,
											$('#J_followAddLayerAdress'),
											function(indexy, layero) {
												var addresscontent = $(
														'#J_followAddLayerAdress #J_textarea')
														.val();
												if (addresscontent == '') {
													layer.alert('请输入跟进内容');
													return false;
												}
												commonContainer.showLoading();
												jsonPostAjax(
														basePath
																+ '/house/follow/insert',
														{
															"houseid" : result.data.housesid,
															"type" : followType,
															"way" : followWay,
															"content" : addresscontent,
															"evaluate" : $(
																	'#J_followAddLayerAdress #J_evaluate')
																	.val(),
															"notContactReason" : $(
																	'#J_followAddLayerAdress #J_notContactReason')
																	.val()
														},
														function(result) {

															if (showAddressAfterClosed) {
																$
																		.ajax({
																			url : basePath
																					+ '/house/queryprivacy/addresslist',
																			data : {
																				houseid : houseId
																			},
																			type : 'get',
																			dataType : 'json',
																			cache : false,
																			contentType : "application/json ; charset=utf-8",
																			success : function(
																					res) {
																				commonContainer.hideLoading();
																				layer.close(indexy);	
																				if (res.code == '0') {
																																			
																					showAddress(
																							houseId,
																							res);
																				} else {
																					layer
																							.alert(res.msg);
																					return false;
																				}
																			}
																		})
															}else{
																commonContainer.hideLoading();
																layer.close(indexy);
															}
														})
											},
											{
												overflow : true,
												area : [ '650px' ],
												btns : [ '保存', '关闭' ],
												success : function() {
													$(
															'#J_followAddLayerAdress #J_evaluate')
															.html('');
													$(
															'#J_followAddLayerAdress #J_notContactReason')
															.html('');
													$(
															'#J_followAddLayerAdress #J_textarea')
															.val('');
													var businessType = result.data.housekind;
													// 初始化跟进评价数据
													if (businessType == '1') {
														dimContainer
																.buildDimChosenSelector(
																		$(
																				"#J_evaluate",
																				$('#J_followAddLayerAdress')),
																		"LessorHouseEvaluate",
																		"1");
													} else if (businessType == '2') {
														dimContainer
																.buildDimChosenSelector(
																		$(
																				"#J_evaluate",
																				$('#J_followAddLayerAdress')),
																		"SellerHouseEvaluate",
																		"1");
													}

													// 查看地址监听联系业主失败原因数据
													$('#J_evaluate')
															.on(
																	'input change',
																	function() {
																		var followevaluate = $(
																				this)
																				.val();

																		if (followevaluate == '4') {
																			$(
																					'#J_notContact_box')
																					.show();
																			// 初始化无法联系业主原因数据
																			dimContainer
																					.buildDimChosenSelector(
																							$(
																									"#J_notContactReason",
																									$('#J_followAddLayerAdress')),
																							"notContactReason",
																							"1");
																		} else {
																			$(
																					'#J_notContact_box')
																					.hide();
																		}

																	})
												}
											});
						} else {
							layer.alert('数据返回有误,查看核心信息失败');
						}
					}
				})
	}
}

$(document).delegate(
		'#J_houseId',
		'click',
		function(event) {
			var businesstype = $('#J_housekind').val();
			var houseId = $('#J_houseId').html();
			var _this = this;
			if (businesstype == '1') {
				window.location.href = basePath
						+ "/house/main/leasedetail.htm?houseid=" + houseId;
			}
			;
			if (businesstype == '2') {
				window.location.href = basePath
						+ "/house/main/buydetail.htm?houseid=" + houseId;
			}
		})

$(document).delegate('#J_belongUserId', 'click', function(event) {
	var userId = $('#J_usid').val();
	getUserStaffInfo(userId);
})