var conId=getQueryString('conId');
var arrphone = [];
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
	// 获取已激活的标签页的名称
	var activeTab = $(e.target).attr("href");
	var $ctrl = $('#controller').controller();
	var $scope = $('#controller').scope();
	if (activeTab == '#tab-11') {
		/*$ctrl.init();
		$scope.$digest();*///外调ag的方法
	} else if (activeTab == '#tab-12') {
		$ctrl.annexLogs();
		$scope.$digest();//外调ag的方法
		if(dealt==false){
			$('#J_annexdataTable').bootstrapTable('hideColumn', 'id');
		}
		/*var upload=$("#upload").length;
		if(upload=='0'){
			$("#upload").hide();
		}*/
	} else if (activeTab == '#tab-13') {
		viewattachedcontract();
	} else if (activeTab == '#tab-14') {
		 $ctrl.initSupplAgrtList();
		 $scope.$digest();//外调ag的方法
	} else if (activeTab == '#tab-15') {
		$ctrl.contractApproval();
		$scope.$digest();//外调ag的方法
	} else if (activeTab == '#tab-16') {
		printhistory();
	} else if (activeTab == '#tab-17') {
		operationLogs();
	}
});

$.fn.serializeJson = function() {
	var serializeObj = {};
	var array = this.serializeArray();
	var str = this.serialize();
	$(array).each(
			function() {
				if (serializeObj[this.name]) {
					if ($.isArray(serializeObj[this.name])) {
						serializeObj[this.name].push(this.value);
					} else {
						serializeObj[this.name] = [
								serializeObj[this.name], this.value ];
					}
				} else {
					serializeObj[this.name] = this.value;
				}
			});
	return serializeObj;
};
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 

var ifflag = 0;
$(document).delegate(
		'input[name="isLandCertificate"]',
		'click',
		function(event) {
			if ($(this).val() != 1) {
				/*$('#landCertificate').attr({
					'readonly' : 'readonly'
				});*/
				$(".certificate").addClass("ng-hide")
				// 土地使用权获得方式 其他描述的修改
				$('#landCertificate').val("");
				if ($('#landCertificate').closest('.form-group').hasClass(
						'has-error')) {
					$('#landCertificate').closest('.form-group')
							.removeClass('has-error');
					$('#landCertificate').closest('.form-group').find(
							'#landCertificate-error').remove();
				}
			} else {
				//$('#landCertificate').removeAttr('readonly');// 土地使用权获得方式
				$(".certificate").removeClass("ng-hide")
																// 其他描述的修改
			}
		})
		
		$(document).delegate(
		'select[name="taxPayingParty"]',
		'change',
		function(event) {
			if ($(this).val() != 3) {
				$('#taxPayingMemo').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#taxPayingMemo').val("");
				if ($('#taxPayingMemo').closest('.form-group').hasClass(
						'has-error')) {
					$('#taxPayingMemo').closest('.form-group')
							.removeClass('has-error');
					$('#taxPayingMemo').closest('.form-group').find(
							'#taxPayingMemo-error').remove();
				}
			} else {
				$('#taxPayingMemo').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})
$(document).delegate('input[name="isHouseCharge"]', 'change', function(event) {
	if ($(this).val() == 1) {
		$('.houseCharge').hide();
	} else if ($(this).val() == 2) {
		$('.houseCharge').show();
	}

})
$(document).delegate(
		'select[name="mortgagePayments"]',
		'change',
		function(event) {
			if ($(this).val() != 4) {
				$('#mortgagePaymentsMemo').attr({
					'readonly' : 'readonly'
				});
				$('#mortgagePaymentsMemo').val("");
				if ($('#mortgagePaymentsMemo').closest('.form-group')
						.hasClass('has-error')) {
					$('#mortgagePaymentsMemo').closest('.form-group').removeClass(
							'has-error');
					$('#mortgagePaymentsMemo').closest('.form-group').find(
							'#otherUses-error').remove();
				}
			} else {
				$('#mortgagePaymentsMemo').removeAttr('readonly');
			}
		})
$(document).delegate('#trackingPeople', 'onSetSelectValue', function(event) {
/*$("#trackingPeople").on('onSetSelectValue', function (e, keyword) {*/
	var val=$(this).attr("data-id");
	jsonGetAjax(basePath + '/sign/contractSales/getUserMessageByUserId', {"userId":val}, function(result) {
		
	$("#spoorerAreaId").val(result.data.shopAreaName);
	$("#spoorerAreaId").attr({"data-id":result.data.shopAreaId});
	$("#spoorerGroupId").val(result.data.shopGroupName);
	$("#spoorerGroupId").attr({"data-id":result.data.shopGroupId});
	$("#spoorerId").val(result.data.shopName);
	$("#spoorerId").attr({"data-id":result.data.shopId});
	})
});
$(document).delegate('#trackingPeople', 'onUnsetSelectValue', function(event) {
	$("#spoorerAreaId").val('');
	$("#spoorerAreaId").attr({"data-id":''});
	$("#spoorerGroupId").val('');
	$("#spoorerGroupId").attr({"data-id":''});
	$("#spoorerId").val('');
	$("#spoorerId").attr({"data-id":''});	
})
$(document)
		.delegate(
				'a',
				'click',
				function(event) {
					var _this = $(this);
					var title = ''
					var headTitle = ''
					if ($(this).attr('type') == 'ownerAgent'
							|| $(this).attr('type') == 'customerAgent') {
						$('#J_owner_agent_dataTable thead').empty();
						if ($(this).attr('type') == 'ownerAgent') {
							title = '业主代理人信息（甲方）';
							headTitle = '<tr>'
									+ '<th><span class="text-danger">*</span>业主代理人姓名</th>'
									+ '<th><span class="text-danger">*</span>证件类型</th>'
									+ '<th><span class="text-danger">*</span>证件号码</th>'
									+ '<th><span class="text-danger">*</span>联系电话</th>'
									+ '</tr>'
						} else if ($(this).attr('type') == 'customerAgent') {
							title = '客户代理人信息（乙方）';
							headTitle = '<tr>'
									+ '<th><span class="text-danger">*</span>客户代理人姓名</th>'
									+ '<th><span class="text-danger">*</span>证件类型</th>'
									+ '<th><span class="text-danger">*</span>证件号码</th>'
									+ '<th><span class="text-danger">*</span>联系电话</th>'
									+ '</tr>'
						}
						$('#J_owner_agent_dataTable thead').append(headTitle);
						commonContainer
								.modal(
										title,
										$('#owner_agent_layer'),
										function(index, layero) {
											validate = $('#owner_agent_form')
													.validate(
															{
																rules : {
																	J_owner_agent_name : {
																		required : true,
																		stringCheckz : true
																	},
																	J_cardType : {
																		required : true
																	},
																	J_cardType_num : {
																		required : true,
																		isIdCardNo : {
																			depends : function(
																					element) {
																				if ($(
																						'#J_cardType')
																						.val() == 1) {
																					return true;
																				}

																			}
																		},
																		passport : {
																			depends : function(
																					element) {
																				if ($(
																						'#J_cardType')
																						.val() == 6) {
																					return true;
																				}

																			}
																		}
																	},
																	J_owner_agent_phone : {
																		required : true,
																	}
																}
															}).form();
											if (!validate)
												return false;
											if (_this
													.hasClass('J_addownerAgent')) {
												var str = '<tr><td>'
														+ $(
																"#J_owner_agent_name")
																.val()
														+ '</td><td attr=' +$(
														"#J_cardType option:selected")
														.val()+'>'
														+ $(
																"#J_cardType option:selected")
																.text()
														+ '</td><td>'
														+ $("#J_cardType_num")
																.val()
														+ '</td><td class="col-md-3">'
														+ $(
																"#J_owner_agent_phone")
																.val()
														+ '</td><td>'
												str += '<div class="text-left">'
												str += '<a type="ownerAgent" class="J_editownerAgent btn btn-outline btn-success btn-xs mt-3" data-name="'
														+ $(
																"#J_owner_agent_name")
																.val()
														+ '" data-cardType="'
														+ $("#J_cardType")
																.val()
														+ '" data-cardType_num="'
														+ $("#J_cardType_num")
																.val()
														+ '" data-phone="'
														+ $(
																"#J_owner_agent_phone")
																.val()
														+ '">修改</a>&nbsp;&nbsp;'
												str += '<a type="del-ownerAgent" class="btn btn-outline btn-success btn-xs mt-3">删除</a>'
												str += '</div>'
												str += '</td></tr>';
												_this.closest('.row').find(
														'table').append(str);

											} else if (_this
													.hasClass('J_editownerAgent')) {
												_this
														.closest('tr')
														.find('td')
														.eq(0)
														.text(
																$("#J_owner_agent_name").val());
												_this.closest('tr').find('td').eq(1).text(
																$("#J_cardType option:selected").text());
												_this
												.closest('tr')
												.find('td')
												.eq(1)
												.attr({"attr":
														$(
																"#J_cardType option:selected")
																.val()});
												_this
														.closest('tr')
														.find('td')
														.eq(2)
														.text(
																$(
																		"#J_cardType_num")
																		.val());
												_this
														.closest('tr')
														.find('td')
														.eq(3)
														.text(
																$(
																		"#J_owner_agent_phone")
																		.val());
												_this
														.attr({
															'data-name' : $(
																	"#J_owner_agent_name")
																	.val()
														});
												_this
														.attr({
															'data-cardType' : $(
																	"#J_cardType option:selected")
																	.val()
														});
												_this.attr({
													'data-cardType_num' : $(
															"#J_cardType_num")
															.val()
												});
												_this
														.attr({
															'data-phone' : $(
																	"#J_owner_agent_phone")
																	.val()
														});
											}
											layer.close(index);
										},
										{
											overflow : true,
											area : [ '1000px', '80%' ],
											btns : [ '确定' ],
											success : function() {
												$('#J_owner_agent_name').val('');
												$('#J_cardType').val('');
												$('select').trigger("chosen:updated");
												$('#J_cardType_num').val('');
												$('#J_owner_agent_phone').val('');
												if (ifflag == 0) {
													$.when(
															dimContainer.buildDimChosenSelector($("#J_cardType"),"cardType","cardType","")
														).then(function(result){
															if (_this.hasClass('J_editownerAgent')) {
																$("#J_owner_agent_name").val(_this.attr('data-name'));
																$("#J_cardType").val(Number(_this.attr('data-cardType')));
																$("#J_cardType_num").val(_this.attr('data-cardType_num'));
																$("#J_owner_agent_phone").val(_this.attr('data-phone'));
																$("select").trigger("chosen:updated");
															}
														});	
													
													ifflag = 1;
												}else{
													if (_this.hasClass('J_editownerAgent')) {
														$("#J_owner_agent_name").val(_this.attr('data-name'));
														$("#J_cardType").val(Number(_this.attr('data-cardType')));
														$("#J_cardType_num").val(_this.attr('data-cardType_num'));
														$("#J_owner_agent_phone").val(_this.attr('data-phone'));
														$("select").trigger("chosen:updated");
													}
												}
												

											}
										});
					} else if ($(this).attr('type') == 'del-ownerAgent') {
						commonContainer.confirm(
								'是否确认删除信息？',function(index, layero){
									_this.closest('tr').remove();
									 layer.close(index);
								})
						
					} else if ($(this).attr('type') == 'mortgage') {
						commonContainer
								.modal(
										'添加',
										$('#mortgage_layer'),
										function(index, layero) {
											validate = $('#mortgage_form')
													.validate(
															{
																rules : {
																	J_mortgage_name : {
																		required : true,
																		stringCheckz : true
																	},
																	J_mortgage_money : {
																		required : true,
																		number : true,
																		min : 0,
																		decimal : true,
																	}
																}
															}).form();
											if (!validate)
												return false;
											if (_this.hasClass('J_addmortgage')) {
												var str = '<tr><td>'
														+ $("#J_mortgage_name").val()
														+ '</td><td>'
														+ $("#J_mortgage_money").val()
														+ '</td><td>'
														+ $("#J_mortgage_condition").val()
														+ '</td><td class="col-md-2">'
														+ $("#J_mortgage_date").val()
														+ '</td><td class="col-md-3">'
														+ $("#J_mortgage_remark").val()
														+ '</td><td>'
												str += '<div class="text-left">'
												str += '<a type="mortgage" class="J_editmortgage btn btn-outline btn-success btn-xs mt-3" data-name="'
														+ $("#J_mortgage_name").val()
														+ '" data-money="'
														+ $("#J_mortgage_money").val()
														+ '" data-condition="'
														+ $("#J_mortgage_condition").val()
														+ '" data-date="'
														+ $("#J_mortgage_date").val()
														+ '" data-remark="'
														+ $("#J_mortgage_remark").val()
														+ '">修改</a>&nbsp;&nbsp;'
												str += '<a type="del-ownerAgent" class="btn btn-outline btn-success btn-xs mt-3">删除</a>'
												str += '</div>'
												str += '</td></tr>';
												_this.closest('.row').find(
														'table').append(str);

											} else if (_this
													.hasClass('J_editmortgage')) {
												_this
														.closest('tr')
														.find('td')
														.eq(0)
														.text(
																$(
																		"#J_mortgage_name")
																		.val());
												_this
														.closest('tr')
														.find('td')
														.eq(1)
														.text(
																$(
																		"#J_mortgage_money")
																		.val());
												_this
														.closest('tr')
														.find('td')
														.eq(2)
														.text(
																$(
																		"#J_mortgage_condition")
																		.val());
												_this
														.closest('tr')
														.find('td')
														.eq(3)
														.text(
																$(
																		"#J_mortgage_date")
																		.val());
												_this
														.closest('tr')
														.find('td')
														.eq(4)
														.text(
																$(
																		"#J_mortgage_remark")
																		.val());
												_this
														.attr({
															'data-name' : $(
																	"#J_mortgage_name")
																	.val()
														});
												_this
														.attr({
															'data-money' : $(
																	"#J_mortgage_money")
																	.val()
														});
												_this
														.attr({
															'data-condition' : $(
																	"#J_mortgage_condition")
																	.val()
														});
												_this.attr({
													'data-date' : $(
															"#J_mortgage_date")
															.val()
												});
												_this
														.attr({
															'data-remark' : $(
																	"#J_mortgage_remark")
																	.val()
														});
											}
											layer.close(index);
										},
										{
											overflow : true,
											area : [ '1000px', '80%' ],
											btns : [ '确定' ],
											success : function() {
												$("#J_mortgage_date").click(function() {
													datelayer(
														"#J_mortgage_date",
														{
															format : 'YYYY-MM-DD',
															min : laydate
																	.now()
														});
												})

												$('#J_mortgage_name').val('');
												$('#J_mortgage_money').val('');
												$('#J_mortgage_bigmoney').text('');
												$('#J_mortgage_condition').val('');
												$('#J_mortgage_date').val('');
												$('#J_mortgage_remark').val('');
												if (_this.hasClass('J_editmortgage')) {
													$("#J_mortgage_name").val(_this.attr('data-name'));
													$("#J_mortgage_money") .val(Number(_this.attr('data-money')));
													var money=Number(_this.attr('data-money'))
													$('#J_mortgage_bigmoney').text('¥：'+convertCurrency(money));
													$("#J_mortgage_condition").val(_this.attr('data-condition'));
													$("#J_mortgage_date").val(_this.attr('data-date'));
													$("#J_mortgage_remark").val(_this.attr('data-remark'));
												} else if (_this.hasClass('J_editmortgage')) {
													$('#J_mortgage_bigmoney').text('¥：'+convertCurrency(money));
												}

											}
										});
					}

				})
$(document)
    .on('keydown', '#phone', function (e) {
        if (e.key && e.key.length === 1 && !/\d/.test(e.key)) {
            return false;
        }
    })
    .on('compositionstart', '#phone', false) // 屏蔽输入法，IE 支持
    .on('compositionend', '#phone', function (e) {// chrome 删除输入法输入的内容
        if (e.originalEvent && e.originalEvent.data && this.value) {
            var data = e.originalEvent.data || '';
            var idx = this.selectionStart || this.selectionEnd;
            var value = this.value;
            this.value = value.slice(0 , idx - data.length) + value.slice(idx , value.length);
        }
    })
    .on('keyup', '#phone', function (e) {
        var parent = $(this).parent();
        if (!this.value) {
            return parent.removeClass('has-error has-success');
        }
        if (/^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/.test(this.value)) {
            parent.removeClass('has-error').addClass('has-success');
        } else {
            parent.removeClass('has-success').addClass('has-error');
        }
    })
    .on('click', '.J_add_phone', function (event) {
        var _this = $(this);
        var phoneList = _this.closest(".form-group").find("input").val();
        if (typeof(phoneList) == undefined || phoneList == '') {
            arrphone = [];
        } else {
            phoneList = phoneList.split(',');
            arrphone = phoneList;
        }
        commonContainer.modal('添加电话', $('#addphone_layer'), function (index, layero) {
            if (arrphone.length != 0) {
                var phonenum = 0;
                for (var i = 0; i < arrphone.length; i++) {
                    var isMob = /^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
                    if (isMob.test(arrphone[i])) {
                        phonenum++;
                    }
                }
                if (phonenum != 0) {
                    var arrval = arrphone.reverse().join(",");
                    _this.closest('tr').find('.J_phone').val(arrval);
                    ;
                    // $("#J_phone").val(arrval);
                    layer.close(index);
                } else {
                    commonContainer.alert("至少添加一个手机号码");
                    return false;
                }

            } else {
                commonContainer.alert("请添加电话");
                return false;
            }
        }, {
            overflow: true,
            area: ['500px', '80%'],
            btns: ['确定'],
            success: function () {
                $("#J_phone_dataTable tbody").empty();
                if (phoneList.length != 0) {

                    var str = ''
                    for (i = 0; i < phoneList.length; i++) {
                        str += '<tr><td>'
                            + phoneList[i]
                            + '</td><td><a class="btn-bitbucket"><b class="removed">删除</b></a></td></tr>';
                    }

                    $("#J_phone_dataTable tbody").prepend(str);
                    arrphone = phoneList;

                }
            }
        });
    })
$(document).delegate('#J_addphone', 'click', function(event) {
	var phone = $("#phone").val().trim();
	if (phone != '') {
		if ($("#phoneType").val() == 1) {
			var mobile = /^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
			if (!(mobile.test(phone))) {
				commonContainer.alert("国内手机格式不正确！");
				return;
			}
		} else if ($("#phoneType").val() == 2) {
			var tel = /^([0-9]{3,4}-)[0-9]{7,8}$/;
			if (!(tel.test(phone))) {
				commonContainer.alert("国内座机格式不正确！");
				return;
			}
		} else {
			/*var reg = /^[0-9]+$/;
			if (!reg.test(phone)) {
				commonContainer.alert("国外电话格式不正确！");
				return;
			}*/
		}
		if ($.inArray(phone, arrphone) == -1) {
			var str = '<tr><td>'
					+ phone
					+ '</td><td><a class="btn-bitbucket"><b class="removed">删除</b></a></td></tr>';
			$("#J_phone_dataTable tbody").prepend(str);
			arrphone.push(phone);
			$("#phone").val('');
		} else {
			commonContainer.alert("此电话号已输入");
		}
	} else {
		commonContainer.alert("电话号不允许为空");
	}
})
$(document).delegate('.removed', 'click', function(event) {
	removeByValue(arrphone, $(this).closest('tr').children('td').eq(0).text());
	$(this).closest('tr').remove();
})

$(document).on('input propertychange', '#J_mortgage_money', function(event) {
	$(this).next().find("#J_mortgage_bigmoney").text('¥：'+convertCurrency($(this).val()));
})	
function removeByValue(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
}
$(document).delegate('input[name="buildingCheck"]', 'click', function(event) {
	var flag=0;
	$("input[name='buildingCheck']:checked").each(function(){ 
		if($(this).val()==5){
			flag=1;
		}					
	})
	if(flag==1){
		$(".houseCheckMemo").removeClass('ng-hide');
	}else{
		$('.houseCheckMemo').addClass('ng-hide');// 土地使用权获得方式 其他描述的修改
		$('#houseCheckMemo').val("");
		if ($('#houseCheckMemo').closest('.form-group').hasClass(
				'has-error')) {
			$('#houseCheckMemo').closest('.form-group')
					.removeClass('has-error');
			$('#houseCheckMemo').closest('.form-group').find(
					'#housePropertyother-error').remove();
		}
	}

})
$(document).delegate(
		'select[name="buyHouseQualification"]',
		'change',
		function(event) {
			if ($(this).val() != 7) {
				$('#qualificationMemo').attr({
					'readonly' : 'readonly'
				});// 土地使用权获得方式 其他描述的修改
				$('#qualificationMemo').val("");
				if ($('#qualificationMemo').closest('.form-group').hasClass(
						'has-error')) {
					$('#qualificationMemo').closest('.form-group')
							.removeClass('has-error');
					$('#qualificationMemo').closest('.form-group').find(
							'#qualificationMemo-error').remove();
				}
			} else {
				$('#qualificationMemo').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})
$(document).delegate(
		'select[name="houseProperty"]',
		'change',
		function(event) {
			if ($(this).val() != 6) {
				/*$('#otherHouse').attr({
					'readonly' : 'readonly'
				});*/
				$(".other_house").addClass("ng-hide");
				// 土地使用权获得方式 其他描述的修改
				$('#otherHouse').val("");
				if ($('#otherHouse').closest('.form-group').hasClass(
						'has-error')) {
					$('#otherHouse').closest('.form-group')
							.removeClass('has-error');
					$('#otherHouse').closest('.form-group').find(
							'#otherHouse-error').remove();
				}
			} else {
				$(".other_house").removeClass("ng-hide");
				//$('#otherHouse').removeAttr('readonly');// 土地使用权获得方式
																// 其他描述的修改
			}
		})
$(document).delegate(
		'select[name="useingMode"]',
		'change',
		function(event) {
			if ($(this).val() != 3) {
				$('.certificateMemo').addClass("ng-hide");// 土地使用权获得方式 其他描述的修改
				$('#certificateMemo').val("");
				if ($('#certificateMemo').closest('.form-group').hasClass(
						'has-error')) {
					$('#certificateMemo').closest('.form-group').removeClass(
							'has-error');
					$('#certificateMemo').closest('.form-group').find(
							'#useingModeother-error').remove();
				}
			} else {
				$('.certificateMemo').removeClass("ng-hide");// 土地使用权获得方式
																// 其他描述的修改
			}
		})
$(document).delegate(
		'input[name="carPort"]',
		'change',
		function(event) {
			if ($(this).val() == 0) {
				/*$('#carPortNumber').attr({
					'readonly' : 'readonly'
				});
				$('#carPortLocation').attr({
					'readonly' : 'readonly'
				});*/
				$('.portNumber').addClass("ng-hide");
				$('.portLocation').addClass("ng-hide");
				$('#carPortNumber').val("");
				$('#carPortLocation').val("");
				if ($('#carPortNumber').closest('.form-group').hasClass(
						'has-error')) {
					$('#carPortNumber').closest('.form-group').removeClass(
							'has-error');
					$('#carPortNumber').closest('.form-group').find(
							'#carPortNumber-error').remove();
				}
				if ($('#carPortLocation').closest('.form-group').hasClass(
						'has-error')) {
					$('#carPortLocation').closest('.form-group').removeClass(
							'has-error');
					$('#carPortLocation').closest('.form-group').find(
							'#carPortLocation-error').remove();
				}

			} else {
				/*$('#carPortNumber').removeAttr('readonly');
				$('#carPortLocation').removeAttr('readonly');*/
				$('.portNumber').removeClass("ng-hide");
				$('.portLocation').removeClass("ng-hide");
			}
		})
$(document).delegate(
		'select[name="discountEmployeesId"]',
		'change',
		function(event) {
			if ($(this).val() != 4) {
				$('#otherUses').attr({
					'readonly' : 'readonly'
				});
				$('#otherUses').val("");
				if ($('#otherUses').closest('.form-group')
						.hasClass('has-error')) {
					$('#otherUses').closest('.form-group').removeClass(
							'has-error');
					$('#otherUses').closest('.form-group').find(
							'#otherUses-error').remove();
				}
			} else {
				$('#otherUses').removeAttr('readonly');
			}
			if ($(this).val() != 3) {
				$('#otherUses').attr({
					'readonly' : 'readonly'
				});
				$('#otherUses').val("");
				if ($('#otherUses').closest('.form-group')
						.hasClass('has-error')) {
					$('#otherUses').closest('.form-group').removeClass(
							'has-error');
					$('#otherUses').closest('.form-group').find(
							'#otherUses-error').remove();
				}
			} else {
				$('#otherUses').removeAttr('readonly');
			}
		})
$(document).delegate(
		'select[name="designUsesId"]',
		'change',
		function(event) {
			if ($(this).val() != 8) {
				/*$('#otherUses').attr({
					'readonly' : 'readonly'
				});*/
				$(".otherUsed").addClass("ng-hide")
				$('#otherUses').val("");
				if ($('#otherUses').closest('.form-group')
						.hasClass('has-error')) {
					$('#otherUses').closest('.form-group').removeClass(
							'has-error');
					$('#otherUses').closest('.form-group').find(
							'#otherUses-error').remove();
				}
			} else {
				//$('#otherUses').removeAttr('readonly');
				$(".otherUsed").removeClass("ng-hide")
			}
		})
$(document).delegate(
		'input[name="fullFiveYears"]',
		'click',
		function(event) {
			if ($(this).val() != 1) {
				$('.fiveGist').addClass('ng-hide');
				$('.fiveMemo').addClass('ng-hide');
				//$('.fullFiveGist').val("");
				if ($('#fullFiveGist').closest('.form-group').hasClass(
						'has-error')) {
					$('#fullFiveGist').closest('.form-group')
							.removeClass('has-error');
					$('#fullFiveGist').closest('.form-group').find(
							'#continuousOrderNum-error').remove();
				}
			} else {
				//$('.fullFiveGist').val("");
				$('.fiveGist').removeClass('ng-hide');// 土地使用权获得方式				
				$("#fullFiveGist").removeAttr("disabled");
				$("#fullFiveGist_chosen").css("width","300px");
				if($('select[name="fullFiveGist"]').val()==3){
					$('.fiveMemo').removeClass('ng-hide');
				}
						
			
																// 其他描述的修改
			}
			$("select").trigger("chosen:updated");
		})
$(document).delegate(
		'select[name="fullFiveGist"]',
		'change',
		function(event) {
			if ($(this).val() != 3) {
				$('.fiveMemo').addClass('ng-hide');;
				/*$('#fullFiveMemo').attr({
					'readonly' : 'readonly'
				});*/
				$('#fullFiveMemo').val("");
				if ($('#fullFiveMemo').closest('.form-group').hasClass(
						'has-error')) {
					$('#fullFiveMemo').closest('.form-group').removeClass(
							'has-error');
					$('#fullFiveMemo').closest('.form-group').find(
							'#fullFiveMemo-error').remove();
				}
			} else {				
				$('.fiveMemo').removeClass('ng-hide');
			}
		})
$(document).on('click' , 'input.condition' , function(){
	var val = $(this).closest('td').prev().find('select').val();
	if($("#payType").val()==1){
		if(val == 4){
			laydate({elem:this,
				format : 'YYYY-MM-DD'
			});
		}
	}else{
		if(val == 6){
			laydate({elem:this,
				format : 'YYYY-MM-DD'
			});
		}
	}
	
}).on('change' , 'select[name=paymentClause]' , function(){
	var $this = $(this);
	var input = $this.closest('td').next().find('input');
	input.val('');
	input.closest('.form-group')
	.removeClass('has-error');
	input.closest('.form-group').find('span').remove();
	if($("#payType").val()==1){
		if($this.val()==1 || $this.val()==2 || $this.val()==6 || $this.val()==7 || $this.val()==8){
			input.attr({"disabled":"disabled"})
			input.val(0)
		}else{
			input.removeAttr("disabled")
		}
	}else{
		if($this.val()==1 || $this.val()==2 || $this.val()==8 || $this.val()==9 || $this.val()==10){
			input.attr({"disabled":"disabled"})
			input.val(0)
		}else{
			input.removeAttr("disabled")
		}
	}
});
		
		$(document)
		.delegate(
				'select[name="payType"],select[name="loanNum"]',
				'change',
				function(event) {
					$('#list').empty();
					var str='';
					var value=$('select[name="payType"]').val();
					var arr=['一','二','三','四','五','六','七','八','九','十'];
					if (value) {
						if (value == 1) {
							/*$('#loanAmount').attr({
								'readonly' : 'readonly'
							});*/
							$(".loan_amount").addClass("ng-hide");
							$('#loanAmount').val("");
							$('#loanAmount').closest('.form-group').find('.color_red').text("");
							if ($('#loanAmount').closest('.form-group').hasClass(
									'has-error')) {
								$('#loanAmount').closest('.form-group').removeClass(
										'has-error');
								$('#loanAmount').closest('.form-group').find(
										'#loanAmount-error').remove();
							}
							$('#noBatchLoan').attr({
								'disabled' : 'disabled'
							});
							$('#noBatchLoan').val("");
							if ($('#noBatchLoan').closest('.form-group').hasClass(
									'has-error')) {
								$('#noBatchLoan').closest('.form-group').removeClass(
										'has-error');
								$('#noBatchLoan').closest('.form-group').find(
										'#noBatchLoan-error').remove();
							} 
							$("#noBatchLoan").trigger("chosen:updated");
						} else {							
							$(".loan_amount").removeClass("ng-hide");
							$('.loan_amount').removeAttr('readonly');
							$('#noBatchLoan').removeAttr('disabled');
						}
						var times = $('select[name="loanNum"]').val();		
						if (times) {
							for (var i = 0; i < times; i++) {							
							str += '<div class="row">'
							str += '<div class="col-md-12">'
							str += '<div class="form-group">'
							str += '<label class="col-md-11 control-label" style="text-align: left;">第'+arr[i]+'次付款: </label>'
							str += '</div>'
							str += '</div>'
							str += '<div class="col-md-12 m-b-sm ">'
							str += '<div class="bootstrap-table table-list">'
							str += '<div class="fixed-table-container">'
							str += '<table class="dataTableMoney table table-hover fixed-table-container table-striped" style="border-bottom: none">'
							str += '<thead>'
							str += '<tr>'
							str += '<th class="col-md-2"><div class="th-inner">付款方式</div></th>'
							str += '<th class="col-md-2"><div class="th-inner">'
							str += '<span class="text-danger">*</span>付款条件'
							str += '</div></th>'
							str += '<th class="col-md-2"><div class="th-inner">具体条件</div></th>'
							str += '<th class="col-md-2"><div class="th-inner">'
							str += '<span class="text-danger">*</span>支付金额（元）'
							str += '</div></th>'
							str += '<th class="col-md-2"><div class="th-inner">'
							str += '<span class="text-danger">*</span>资金划转方式'
							str += '</div></th>'
							str += '<th class="col-md-2"><div class="th-inner">备注</div></th>'
							str += '</tr>'
							str += '</thead>'
							str += '<tbody>'
							str += '<tr>'
							if(value==1){
								str += '<td>全款</td>'
							}else{
								str += '<td>贷款</td>'
							}
							
							str += '<td>'
							str += '<div class="col-sm-8 col-sm-offset-1">'
							str += '<div class="form-group">'
							str += '<select name="paymentClause" class="form-control J_chosen condition" data-placeholder="请选择">'
							str += '<option value="">请选择</option>'
								if(value==1){								
									if(i==0){
										str += '<option value="1">甲方解抵押当天</option><option value="2">房源核验通过当天</option><option value="3">网签后具体时限内</option><option value="4">具体日期</option><option value="5">其他</option>'
									}else if(i==1){
										str += '<option value="6">办理房屋所有权转移登记当天</option><option value="4">具体日期</option><option value="5">其他</option>'
									}else{
										str += '<option value="7">交付房屋当日</option><option value="8">户口迁出当日</option><option value="4">具体日期</option><option value="5">其他</option>'
									}
								}else{
									if(i==0){
										str += '<option value="1">甲方解抵押当天</option><option value="2">房源核验通过当天</option><option value="3">网签后具体时限内</option><option value="4">商贷面签</option><option value="5">公积金初审</option><option value="6">具体日期</option><option value="7">其他</option>'
									}else if(i==1){
										str += '<option value="8">办理房屋所有权转移登记当天</option><option value="6">具体日期</option><option value="7">其他</option>'
									}else{
										str += '<option value="9">交付房屋当日</option><option value="10">户口迁出当日</option><option value="6">具体日期</option><option value="7">其他</option>'
									}
								}
							str += '</select>'
							str += '</div>'
							str += '</div>'
							str += '</td>'
							str += '<td><div class="form-group">'
							str += '<div class="col-sm-8 col-sm-offset-1">'
							str += '<input name="condition" class="form-control condition" oninput="this.value=this.value.replace(/[^\\d]/g,\'\')">'
							str += '</div></div>'
							str += '</td>'
							str += '<td><div class="form-group">'
							str += '<div class="col-sm-8 col-sm-offset-1"><div class="form-group">'
							str += '<input type="text" name="paymenAmount" class="form-control J_priceCover"> <label class="color_red"></label>'
							str += '</div></div>'
							str += '</div></td>'
							str += '<td><div class="form-group">'
							str += '<div class="col-sm-8 col-sm-offset-1">'
							str += '<select name="transferWay" class="transferofFunds form-control" data-placeholder="请选择">'
							str += '<option value="">请选择</option>'
							str += '</select>'
							str += '</div>'
							str += '</div></td>'
							str += '<td>'
							str += '<div class="col-sm-8 col-sm-offset-1">'
							str += '<input name="" class="memo form-control">'
							str += '</div>'
							str += '</td>'
							str += '</tr>'
							str += '</tbody>'
							str += '</table>'
							str += '</div>'
							str += '</div>'
							str += '</div>'
							str += '</div>'
							}
							
						}
						$('#list').append(str);
						dimContainer.buildDimChosenSelector($(".transferofFunds"), "transferofFunds", "transferofFunds", "");//资金划转方式
						$('.transferofFunds').trigger("chosen:updated");
						$('select').trigger("chosen:updated");
						$("select").chosen({
							width : "100%",
							allow_single_deselect : true
						});
					}
					
				})
	//选择合同	
$(document).on( 'input propertychange','#ownBrokerageReceived,#ownPerformanceReceived,#cusBrokerageReceived,#cusPerformanceReceived', function(event) {
	var $ctrl = $('#controller').controller();
	var $scope = $('#controller').scope();
	$ctrl.discount_resfun();
	$scope.$digest();//外调ag的方法
});
$(document).on( 'input propertychange','.J_priceCover', function(event) {
	var money = $(this).val();
	var decimal = /^-?\d+(\.\d{1,2})?$/;
	if (decimal.test(money)) {
		$(this).closest('.form-group').find('.color_red').text('¥：' + convertCurrency(money));
	}
	if(money==''){
		$(this).closest('.form-group').find('.color_red').text(convertCurrency(''));
	}
})
var _this=this;
var isInit=true;
$('#createstarttime').on('click',function(){
	laydate({
		elem:'#createstarttime',
	    format:'YYYY-MM-DD',
	    istime:false,
	    choose:function(datas){
	    	seeEndDate.min=datas;
	    	seeEndDate.start=datas;
	    }
	});
});
$('#createendtime').on('click',function(){
	laydate({
		elem:'#createendtime',
	    format:'YYYY-MM-DD',
	    istime:false,
	    choose:function(datas){
	    	seeBeginDate.max=datas;
	    }
	});
});
$(document).delegate('#originalContract_btn','click',function(event) {
	var contractNumsun=$('#originalContract_btn > div');
	if(contractNumsun.length>1){
		contractNumsun.eq(1).hide();
	}
	commonContainer.modal('选择合同',$('#choiceHetong'),function(i){
		getAddContract(i);
	},{
		area:['80%','70%'],
		btns:['确定','取消'],
		overflow :true,
		success:function(){
			
			if(isInit){
				//退单类型
				dimContainer.buildDimChosenSelector($('#chargebackType'),'chargebacktype','');
				//业务类型
				dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
				
					
				$('#J_search').off().on('click',contractList);
				$('#J_reset').on('click',function(){
					$('#J_deptName').attr('data-id','');			//重置所属部门id
				});
				//所属部门
				$('#J_deptSelect').off().on('click', function() {
					showDeptTree($('#J_deptName'), $('#J_deptLevel'));
				});
				isInit=false;
			}
			//重置表单
			$('#J_contractQuery')[0].reset();
			$('#J_deptName').attr('data-id','');
			//创建表格表头
			var tabHtml='\
				<table id="contractList" class="table table-hover table-striped table-bordered">\
					<thead>\
						<tr>\
							<th data-field="">\
								<div class="th-inner">业务类型</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">合同编号</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">客户姓名<br />业主姓名</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">客户佣金<br />业主佣金（元）</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">成交价（元）</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">所属部门</div>\
							</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">成交人</div>\
							</th>\
							<th data-field="">\
								<div class="th-inner">签约日期</div>\
							</th>\
						</tr>\
					</thead>\
				</table>';
			$('#hetConten').html(tabHtml);
		}
	});
});
//查询合同列表
function contractList(){
	$('#contractList').bootstrapTable('destroy').bootstrapTable({
		url:basePath+'/sign/chargeback/choosecontract.htm',
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
			var data=$('#J_contractQuery').serializeObject();
			var deptId=$('#J_deptName').attr('data-id');
			if(deptId!==''){
				data.dept_id=deptId;		//所属部门id
			}
			data.contract_type=2;
            data.filter_change_name=1;
			data.userid=userid;
			data.pagesize = params.limit;
			data.pageindex = params.offset / params.limit+ 1;
			return data;
		},
		responseHandler: function(result) {
			if (result.code == 0 && result.data && result.data.totalcount> 0){
				return {
					'rows': result.data.list, 
					'total': result.data.totalcount
				}
			}
			return {
				'rows': [],
				'total': 0
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
				field : 'contract_type',
				title : '业务类型',
				align : 'center'
			},
			{
				field : 'contract_code',
				title : '合同编号',
				align : 'center'
			},
			{
				field : 'customer_name',
				title : '客户姓名<br />业主姓名',
				align : 'center',
				formatter:function(value,row){
					return value+'<br />'+row.owner_name;
				}
			},
			{
				field : 'customer_commission',
				title : '客户佣金<br />业主佣金（元）',
				align : 'center',
				formatter:function(value,row){
					return value+'<br />'+row.owner_commission;
				}
			},
			{
				field : 'transaction_price',
				title : '成交价（元）',
				align : 'center'
			},
			{
				field : 'dept_name',
				title : '所属部门',
				align : 'center'
			},
			{
				field : 'user_name',
				title : '成交人',
				align : 'center'
			},
			{
				field : 'create_time',
				title : '签约日期',
				align : 'center'
			}
		]
	});
}
//获取新增合同详情
function getAddContract(i){
	var _this=this;
	$('#shituiYj').val('');
	$('#addCommissionRate').val('');
	var checkrowDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
	if(checkrowDataArr.length>0 && checkrowDataArr[0].con_id!==undefined){
		layer.close(i);
		//回显新增合同信息
		$("#originalContractCode").val(checkrowDataArr[0].contract_code);
	}else{
		commonContainer.alert('请选择合同');
	}
}				
// 邮政编码验证
jQuery.validator.addMethod("isZipCode", function(value, element) {
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "请正确填写邮政编码");

// 字符验证
jQuery.validator.addMethod("string", function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "不允许包含特殊符号!");

// 必须以特定字符串开头验证
jQuery.validator.addMethod("begin", function(value, element, param) {
	var begin = new RegExp("^" + param);
	return this.optional(element) || (begin.test(value));
}, $.validator.format("必须以 {0} 开头!"));

// 验证值不允许与特定值等于
jQuery.validator.addMethod("notEqual", function(value, element, param) {
	return value != param;
}, $.validator.format("输入值不允许为{0}!"));

// 验证值必须大于特定值(不能等于)
jQuery.validator.addMethod("gt", function(value, element, param) {
	return value > param;
}, $.validator.format("输入值必须大于{0}!"));

// 字符验证
jQuery.validator.addMethod("stringCheckz", function(value, element) {
	console.log(value);
	return this.optional(element) || /^[\u4E00-\u9FA5\w]+$/.test(value);
}, "存在不符合规则的数据！");
// 字符验证
jQuery.validator.addMethod("stringCheck", function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只能包括中文字、英文字母、数字和下划线");
// 租期验证
jQuery.validator.addMethod("dateCheckz", function(value, element) {
	var RegExp = /^\d+$/;
	return this.optional(element) || /^[\u4E00-\u9FA5\w]+$/.test(value)
			|| RegExp.test(value);
}, "存在不符合规则的数据！");
// 验证值小数位数不能超过两位
jQuery.validator.addMethod("decimal", function(value, element) {
	var decimal = /^-?\d+(\.\d{1,2})?$/;
	return this.optional(element) || (decimal.test(value));
}, $.validator.format("小数位数不能超过两位!"));

// 字母数字
jQuery.validator.addMethod("alnum", function(value, element) {
	return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
}, "只能包括英文字母和数字");

// 只能输入英文
jQuery.validator.addMethod("english", function(value, element) {
	var chrnum = /^([a-zA-Z]+)$/;
	return this.optional(element) || (chrnum.test(value));
}, "只能输入字母");

// 汉字
jQuery.validator.addMethod("chcharacter", function(value, element) {
	var tel = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (tel.test(value));
}, "请输入汉字");

// 身份证号码验证（加强验证）
jQuery.validator
		.addMethod(
				"isIdCardNo",
				function(value, element) {
					return this.optional(element)
							|| /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/
									.test(value)
							|| /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/
									.test(value);
				}, "请正确输入身份证号码");

// 手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
	var length = value.length;
	var mobile = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
	return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");

// 电话号码验证
jQuery.validator.addMethod("isTel", function(value, element) {
	var tel = /^\d{3,4}-?\d{7,9}$/; // 电话号码格式010-12345678
	return this.optional(element) || (tel.test(value));
}, "请正确填写电话号码");

// 字母数字
jQuery.validator.addMethod("alnumAndchcharacter",
		function(value, element) {
			return this.optional(element)
					|| /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value);
		}, "只能包括汉字、英文字母和数字");
// 护照编号验证
jQuery.validator.addMethod("passport", function(value, element) {
	return this.optional(element) || checknumber(value);
}, "请正确输入您的护照编号");
// 验证护照是否正确
function checknumber(number) {
	var str = number;
	// 在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
	var Expression = /(P\d{7})|(G\d{8})/;
	var objExp = new RegExp(Expression);
	if (objExp.test(str) == true) {
		return true;
	} else {
		return false;
	}
};


//表格加载完成
$(document).ajaxStop(function(){
	  if($("#dataTableownerAgent tbody tr").length>0){
		  $("#unpritable .col-sm-4").eq(27).show();
		  $("#unpritable .col-sm-4").eq(28).show();
		  $("#unpritable .col-sm-4").eq(29).show();
	  }else if($("#dataTableownerAgent tbody tr").length==0){
		  $("#unpritable .col-sm-4").eq(27).hide();
		  $("#unpritable .col-sm-4").eq(28).hide();
		  $("#unpritable .col-sm-4").eq(29).hide();
	  }
 });

//textarae字数限制
function strLenCalc() {	
	var v = $("#J_memo").val(), charlen = 0, maxlen =100, curlen = maxlen, len = v.length;	
	for(var i = 0; i < v.length; i++) {
		curlen -= 1;
	}
  if(curlen > 10) {
	$("#checklen").html("还可以输入 <strong>"+curlen+"</strong> 个字").css('color', '#1d3872');
//	$("#J_submit").removeAttr("disabled");
	} else {
	$("#checklen").html("还可以输入 <strong>"+curlen+"</strong> 个字").css('color', '#FF0000');
//	$("#J_submit").attr("disabled", "disabled");
	}
 }