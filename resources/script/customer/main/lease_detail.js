var clientId = '', customerId = '', isCurrent='' , cooperation=false;
var validatorRule,validatorAddRule;

$.fn.updateSerializeObject = function() {
	var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    var $radio = $('input[type=radio],input[type=checkbox]',this);
    $.each($radio, function(){
        if(!o.hasOwnProperty(this.name)){
            o[this.name] = '';
        }
    });

    return o;
}



$(document).ready(function(){
	if(!isNotCooperation){// 从转介进入详细页面时 隐藏转介和跟进查看电话
		$('#oper_referral,#oper_followup,#J_checkPhone,#oper_blacklist').hide();
	}
	$("select").chosen({
		width : "100%",
		no_results_text: "未找到此选项!"
	});

    if (location.href.indexOf('cooperation') > -1) {
        cooperation = true;
        $('#J_checkPhone,#oper_referral,#J_editPhone,#oper_followup').hide(); // 转介不允许查看电话,编辑电话,转介和跟进
    }

	clientId = $('#J_customerId').attr('data-clientId');
	customerId = $('#J_customerId').attr('data-customerId');
	isCurrent = $('#J_customerId').attr('data-isCurrent');

    // 显示部门树状结构
    searchDept($('#J_deptName'), true, 'left' , true).then(function () {
        $('#J_deptSelect').off().on('click', function (e) {
            showDeptTree($('#J_deptName'), $('#J_deptLevel'), null, true);// true 表示查询全量组织结构
        });
    });

	searchContainer.searchUserListByComp($("#J_sendee"), true, 'left');

	// 显示日志
	operationLog(customerId, isCurrent==1?true:false, clientId);

	initDimData();

	if ($.validator) {
		$.validator.setDefaults({
			ignore: ":hidden:not(select)",
			highlight : function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success : function(element) {
				$(element).closest('.form-group').removeClass('has-error').addClass('has-success');
			},
			errorElement : "span",
			errorPlacement : function(error, element) {
				// 隐藏错误信息
				if (element.is(":radio") || element.is(":checkbox")) {
					error.appendTo(element.parent().parent().parent());
				} else {
					error.appendTo(element.parent());
				}
			},
			errorClass : "help-block m-b-none",
			validClass : "help-block m-b-none"
		});
	}

	validatorRule = {
		// 客户姓名
		customername: {
	        required: true,
	        alnumAndchcharacter: true
	    },
		// 价格区间
		minprice: {
	        required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxprice"
	    },
	    maxprice: {
			required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minprice"
		},
		// 面积
		minarea: {
			required: {
	    		depends: function(element) {
	    			var propertytype = $(element).closest('div.tab-pane.active').attr('data-propertytype');
	    			if(propertytype == '1' || propertytype == '6' || propertytype == '7')
	    				return true;
	    		}
	    	},
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxarea"
	    },
	    maxarea: {
	    	required: {
	    		depends: function(element) {
	    			var propertytype = $(element).parents().find('.tab-pane.active').attr('data-propertytype');
	    			if(propertytype == '1' || propertytype == '6' || propertytype == '7')
	    				return true;
	    		}
	    	},
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minarea"
	    },
	    // 户型
	    bedroom1: {
	    	required: true
	    },
	    bedroom2: {
	    	required: true
	    },
	    // 物管费
	    minpropertyfee: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxpropertyfee"
	    },
	    maxpropertyfee: {
	    	number: true,
	    	decimal: true,
	    	min:0,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_minpropertyfee"
	    },
	    // 门宽
	    mindoorwidth: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxdoorwidth"
	    },
	    maxdoorwidth:{
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_mindoorwidth"
	    },
	    // 单层高
	    minfloorheight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxfloorheight"
	    },
	    maxfloorheight:{
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_minfloorheight"
	    },
	    // 可办公人数
	    minofficeseat: {
	    	required: true,
	    	number: true,
	    	min: 0,
	    	maxlength: 9,
	    	digits: true,
	    	compareMaxIntervalNumber: ".J_maxofficeseat"
	    },
	    maxofficeseat: {
	    	required: true,
	    	number: true,
	    	digits: true,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minofficeseat"
	    },
		// 段位区号
		minsegment: {
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxsegment"
	    },
	    maxsegment: {
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minsegment"
	    },
	    nonum: {
	    	alnumAndchcharacter: true
	    },
	    // 高
	    highbefore: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_heightafter"
	    },
	    heightafter: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_hightbefore"
	    },
	    // 长
	    longbefore: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_longafter"
	    },
	    longafter: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_longbefore"
	    },
	    // 高
	    minheight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxheight"
	    },
	    maxheight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minheight"
	    },
	    remark: {
	    	required: true
	    }
	};

	validatorAddRule = {
		// 价格区间
		minPrice: {
	        required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxPrice"
	    },
	    maxPrice: {
			required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minPrice"
		},
		// 面积
		minArea: {
			required: {
	    		depends: function(element) {
	    			var propertytype = $(element).parents().find('.tab-pane.active').attr('data-propertytype')
	    			if(propertytype == '1' || propertytype == '6' || propertytype == '7')
	    				return true;
	    		}
	    	},
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxArea"
	    },
	    maxArea: {
	    	required: {
	    		depends: function(element) {
	    			var propertytype = $(element).parents().find('.tab-pane.active').attr('data-propertytype')
	    			if(propertytype == '1' || propertytype == '6' || propertytype == '7')
	    				return true;
	    		}
	    	},
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minArea"
	    },
	    // 户型
	    bedRoom1: {
		    required: true
	    },
	    bedRoom2: {
		    required: true
	    },
	    // 物管费
	    minPropertyFee: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxPropertyFee"
	    },
	    maxPropertyFee: {
	    	number: true,
	    	decimal: true,
	    	min:0,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_minPropertyFee"
	    },
	    // 门宽
	    minDoorWidth: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxDoorWidth"
	    },
	    maxDoorWidth:{
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minDoorWidth"
	    },
	    // 单层高
	    minFloorHeight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxFloorHeight"
	    },
	    maxFloorHeight:{
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minFloorHeight"
	    },
	    // 可办公人数
	    minOfficeSeat: {
	    	required: true,
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxOfficeSeat"
	    },
	    maxOfficeSeat: {
	    	required: true,
	    	number: true,
	    	digits: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minOfficeSeat"
	    },
		// 段位区号
		minSegment: {
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxSegment"
	    },
	    maxSegment: {
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_minSegment"
	    },
	    exludeNumber: {
	    	alnumAndchcharacter: true
	    },
	    // 长
	    minLength: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxLength"
	    },
	    maxLength: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minLength"
	    },
	    // 宽
	    minWidth: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxWidth"
	    },
	    // 高
	    minHeight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxHeight"
	    },
	    maxHeight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minHeight"
	    },
	    maxWidth: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minWidth"
	    },
	    depositTypeId: {
	    	required: {
	    		depends: function(element) {
	    			if($(element).parents().find('.tab-pane.active').attr('data-propertytype') == '4')
	    				return true;
	    		}
	    	},
	    },
	    // 租期
	    rentTime: {
	    	number: true,
	    	min: 0,
	    	maxlength: 9
	    }
	};

	// 编辑客户需求信息（单字段修改）
	var basicInfoArr = ['customername','sex','nationalitycode','hometown','freetime','source','infosource','remark','memo'];
	$(document).delegate('.J_edit_area', 'click', function(event){
		var $this_ = $(this);
		var title = $this_.parent().find('dt').text().trim().replace('*', '');
		title = title.substring(0, title.length-1);

		var colums = $this_.attr('data-columns');
		colums = formatToComma(colums); // 转义字符
		var columArr = colums.split('|');
		var editName = columArr[0];
		var showType = columArr[1];
		var oldValue = $this_.parent().find('dd').text();
		var unit = $this_.parent().find('dd').find('span').text();

		if(lease_edit_permission) {
			commonContainer.modal(
				'修改' + title,
				$('#J_editLayer'),
				function(index, layero) {
					validate = $('#J_editForm1').validate({
						rules:validatorRule
					}).form();
					if(!validate) return false;

					var postParam = $('#J_editLayer').find('form').updateSerializeObject();
					postParam.clientid = clientId;
					postParam.customersid = customerId;
					postParam.trace = getTrace(showType, title, oldValue, editName, unit);
					postParam = formatPostParam(postParam);

					// 请求URL及必要参数
					var url = basePath + '/customer/main/updatebasicinfo.htm';
					if ($.inArray(editName, basicInfoArr) == -1) {
						url = basePath + '/customer/main/updatedemandinfo.htm';
						postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
					}

					jsonPostAjax(
						url,
						postParam,
						function(result) {
		//					$this_.parent().find('dd').html(getNewValue(showType, editName, unit));
							layer.msg('修改成功');
							layer.close(index);
							location.reload();
						}
					)
				},
				{
					success: function() {
						editWidget(customerId, $this_);
					}
				}
			)
		}
	})
});

// 查看电话
$(document).delegate('#J_checkPhone', 'click',function(event){
    if (lease_tel_view_permission) {
		showPhone(clientId , 1);
    }
})

// 初始化新需求字典数据
function initDimData() {
	dimContainer.buildDimChosenSelector($(".J_bedRoom1"), "houseStructure", ""); // 户型1
	dimContainer.buildDimChosenSelector($(".J_bedRoom2"), "houseStructure", ""); // 户型2
	dimContainer.buildDimCheckBox($(".J_furniture"), "furnitureIds", "furniture", ""); // 家具
	dimContainer.buildDimCheckBox($(".J_electric"), "electricIds", "electric", ""); // 家电
	dimContainer.buildDimChosenSelector($(".J_buildingType"), "buildingType", ""); // 楼体类型
	dimContainer.buildDimChosenSelector($(".J_layoutStructure"), "layoutStructure", ""); // 户型结构
	dimContainer.buildDimChosenSelector($(".J_decorationStatus"), "housedecorationstatus", ""); // 装修
	dimContainer.buildDimChosenSelector($(".J_rentMode"), "rentMode", "0"); // 合租意向
	dimContainer.buildDimChosenSelector($(".J_paymentMode"), "paymentMode", ""); // 付租方式
	dimContainer.buildDimChosenSelector($(".J_foregift"), "foregift", ""); // 押金
	dimContainer.buildDimCheckBox($(".J_specialNeeds"), "specialDemandIds", "specialNeeds", ""); // 商铺特殊需求
	dimContainer.buildDimCheckBox($(".J_locationType"), "locationIds", "locationType", ""); // 商铺位置类型
	dimContainer.buildDimChosenSelector($(".J_urgency"), "urgency", ""); // 紧急度
	dimContainer.buildDimChosenSelector($(".J_isBill"), "isBill", ""); // 是否开发票
}

$('.J_isBill').on("change", function(){
	$this_ = $(this);
	$curForm_ = $this_.closest('form');

	if($this_.val() == '2') {
		dimContainer.buildDimCheckBox($('.J_bill', $curForm_), "billTypesId", "bill", '');
		$('.J_bill', $curForm_).show();
	} else {
		$(':checkbox', $('.J_bill', $curForm_)).prop('checked', false);
		$('.J_bill', $curForm_).html('');
		$('.J_bill', $curForm_).hide();
	}

});

// 保存客源需求
$(document).delegate('#J_addBtn', 'click',function(event) {
	$this_ = $(this);
	$curForm_ = $this_.closest('form');

	validate = $curForm_.validate({
		rules:validatorAddRule
	}).form();
	if(!validate) return false;

	// 检测商圈
	var business = '';
	$('#J_dataTableBusiness tr:gt(0)', $curForm_).each(function(){
		var $business = $(this).find('td:first');
		var $canton = $(this).find('td:eq(1)');

		business += $business.attr('data-id') + ':' + $canton.attr('data-id') + '##';
	})
	if(business == '') {
		commonContainer.alert("请选择商圈");
		return false;
	}

	// 序列化数据
	data = $curForm_.serializeObject();
	data = formatPostParam(data);
	data.customerId = customerId;
	data.demandTypeId = $curForm_.closest('div.tab-pane.active').attr('data-propertytype');

	// 拼接楼盘
	var buildArr = [];
	$('#J_dataTableBuild tr:gt(0)', $curForm_).each(function(){
		buildArr.push($(this).find('td:first').attr('data-id'));
	})
	if (buildArr.length > 0)
		data.buildingIds = formatArrayToStringParam(buildArr);

	// 拼接商圈
	data.businessIds = '##' + business;
	console.log(data);

	jsonPostAjax(
		basePath + '/customer/detail/newdemand',
		data,
		function() {
			commonContainer.alert('添加成功');
			location.reload();
		}
	);
}).on('keyup input propertychange' , '#memo' , function () {
    var len = this.maxLength - this.value.length;
    if (!len) {// 用来处理不支持 maxLength 限制输入的浏览器，强行修改内容
        this.value = this.value.slice(0, this.maxLength);
    }
    $(this).next().text('还可输入 ' + len + ' 个字');
})

function formatPostParam(postParam) {
	// 格式化方便看房时间
	if (postParam.freetime != undefined) {
		postParam.freetime = formatArrayToStringParam(postParam.freetime);
	}

	// 格式化家具
	if (postParam.furniture != undefined) { // 编辑时使用
		postParam.furniture = formatArrayToStringParam(postParam.furniture);
	}
	if (postParam.furnitureIds != undefined) { // 添加时使用
		postParam.furnitureIds = formatArrayToStringParam(postParam.furnitureIds);
	}

	// 格式化家电
	if (postParam.electric != undefined) { // 编辑时使用
		postParam.electric = formatArrayToStringParam(postParam.electric);
	}
	if (postParam.electricIds != undefined) { // 添加时使用
		postParam.electricIds = formatArrayToStringParam(postParam.electricIds);
	}

	// 格式化车库/车位-段位区号
	if(postParam.minsegment != undefined || postParam.maxsegment != undefined) {
		postParam.segment = formatIntervalToStringParam(postParam.minsegment, postParam.maxsegment);
	}

	// 格式化商铺-门宽
	if(postParam.mindoorwidth != undefined || postParam.maxdoorwidth != undefined) {
		postParam.doorwidth = formatIntervalToStringParam(postParam.mindoorwidth, postParam.maxdoorwidth);
	}

	// 格式化商铺-层高
	if(postParam.minfloorheight != undefined || postParam.maxfloorheight != undefined) {
		postParam.floorheight = formatIntervalToStringParam(postParam.minfloorheight, postParam.maxfloorheight);
	}

	// 格式化商铺-物管费
	if(postParam.minpropertyfee != undefined || postParam.minpropertyfee != undefined) {
		postParam.propertyfee = formatIntervalToStringParam(postParam.minpropertyfee, postParam.maxpropertyfee);
	}

	// 格式化商铺特殊需求
	if (postParam.specialdemand != undefined) { // 编辑时使用
		postParam.specialdemand = formatArrayToStringParam(postParam.specialdemand);
	}
	if (postParam.specialDemandIds != undefined) { // 添加时使用
		postParam.specialDemandIds = formatArrayToStringParam(postParam.specialDemandIds);
	}

	// 格式化商铺位置类型
	if (postParam.location != undefined) { // 编辑时使用
		postParam.location = formatArrayToStringParam(postParam.location);
	}
	if (postParam.locationIds != undefined) { // 添加时使用
		postParam.locationIds = formatArrayToStringParam(postParam.locationIds);
	}

	// 格式化写字楼-可办公人数
	if (postParam.minofficeseat != undefined || postParam.maxofficeseat != undefined) {
		postParam.officeseat = formatIntervalToStringParam(postParam.minofficeseat, postParam.maxofficeseat);
	}

	// 格式化厂房/仓库-长
	if (postParam.minlength != undefined || postParam.maxlength != undefined) {
		postParam.length = formatIntervalToStringParam(postParam.minlength, postParam.maxlength);
	}

	// 格式化厂房/仓库-宽
	if (postParam.minwidth != undefined || postParam.maxwidth != undefined) {
		postParam.width = formatIntervalToStringParam(postParam.minwidth, postParam.maxwidth);
	}

	// 格式化厂房/仓库-总高
	if (postParam.minheight != undefined || postParam.maxheight != undefined) {
		postParam.height = formatIntervalToStringParam(postParam.minheight, postParam.maxheight);
	}

	// 其它需求-发票类型
	if (postParam.billTypesId != undefined) { // 添加时使用
		postParam.billTypesId = formatArrayToStringParam(postParam.billTypesId);
	}

	return postParam;
}


// 编辑电话
$(document).delegate('#J_editPhone', 'click', function(event){
	if(lease_tel_edit_permission) {
		commonContainer.modal(
			'修改联系电话',
			$('#J_editPhoneLayer'),
			function(index, layero) {
				var phoneArr = [];
				$('#J_dataTablePhone tr:gt(0)').each(function(){
					phoneArr.push($(this).find('td:first').text());
				})

				var postParam = {};
				postParam.clientid = clientId;
				postParam.customersid = customerId;
				postParam.phones = formatArrayToStringParam(phoneArr);
				console.log(postParam);

				jsonGetAjax(
					basePath + '/customer/main/updatephone',
					postParam,
					function(result) {
						layer.msg('修改成功');
						layer.close(index);
						location.reload();
					}
				)
			},
			{
				success: function() {
					$("#J_phone").val('');
				}
			}
		)
	}
})

// 编辑需求楼盘
$(document).delegate('#J_editBuild', 'click', function(event){
	var $this_ = $(this);

	var oldValue = $this_.parent().find('dd').text();

	if(lease_edit_permission) {
		commonContainer.modal(
			'修改需求楼盘',
			$('#J_editBuildLayer'),
			function(index, layero) {
				var buildArr = [];
                var newValue = [];
				$('#J_dataTableBuild tbody tr', $('#J_editBuildLayer')).each(function(){
					var tr = $(this);
					buildArr.push(tr.attr('id'));
					newValue.push(tr.find('td:first').text());
				});

				var postParam = {};
				postParam.clientid = clientId;
				postParam.customersid = customerId;
				postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
				postParam.buildings = '##' + buildArr.join('##') + '##';
				postParam.trace = '修改需求楼盘，修改前为：' + oldValue + '，修改后为：' + newValue.join('、');

				jsonPostAjax(
					url = basePath + '/customer/main/updatedemandinfo.htm',
					postParam,
					function(result) {
						layer.msg('修改成功');
						layer.close(index);
						location.reload();
					}
				)
			},
			{
				area: ['460px', '60%'],
				success: function() {
					// 初始化原楼盘信息
					initBuild($this_);
				}
			}
		)
	}
})

// 编辑商圈&行政区
$(document).delegate('#J_editBusiness', 'click', function(event){
	var $this_ = $(this);

	var oldValue = $this_.parent().find('dd').text();
	var formatOldValue = (oldValue.trim()=='') ? '空' : oldValue;

	if(lease_edit_permission) {
		commonContainer.modal(
			'修改商圈&行政区',
			$('#J_editBusinessLayer'),
			function(index, layero) {
				var business = [];
				var newValue = [];

				$('#J_editBusinessLayer #J_dataTableBusiness tbody tr').each(function(){
//						businessArr.push($(this).find('td:first').attr('data-id'));
					var tr = $(this);
					var $business = tr.find('td:eq(0)');
					var $canton = tr.find('td:eq(1)');

                    business.push(tr.attr('id') + ':' + $canton.attr('data-id'));
                    newValue.push($business.text() + '（' + $canton.text() + '）');
				});

				if (!newValue.length) {
					layer.alert('请添加商圈');
					return false;
				}

				var postParam = {};
				postParam.clientid = clientId;
				postParam.customersid = customerId;
				postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
				postParam.business = '##' + business.join('##') + '##';
				postParam.trace = '修改商圈&行政区，修改前为：' + formatOldValue + '，修改后为：' + newValue.join('、');

				jsonPostAjax(
					url = basePath + '/customer/main/updatedemandinfo.htm',
					postParam,
					function(result) {
						layer.msg('修改成功');
						layer.close(index);
						location.reload();
					}
				)
			},
			{
				area: ['460px', '60%'],
				success: function() {
					// 初始化原商圈&行政区
					initBusiness($this_ , $('#J_editBusinessLayer'));
				}
			}
		)
	}
})

// 编辑发票需求
$(document).delegate('#J_editBill', 'click', function(event){
	var $this_ = $(this);

	var newValue = '';
	var oldValue = $this_.parent().find('dd').text();
	var formatOldValue = (oldValue.trim()=='') ? '空' : oldValue;

	if(lease_edit_permission) {
		commonContainer.modal(
			'修改其它需求',
			$('#J_editBillLayer'),
			function(index, layero) {
				validate = $('#J_editBillLForm').validate({
					rules:{
						billtype: {
					    	required: {
					    		depends: function(element) {
					    			if ($('#J_isBill').val() == '2') {
					    				return true;
					    			}
					    		}
					    	},
					    }
					}
				}).form();
				if(!validate) return false;

				var newPayType = $('#J_isBill').val();
				var newPayTypeValue = $('#J_isBill').find("option:selected").text();
				var newBilTypeValue = '';
				var newBilType = [];
				var selectedBillType = $(':checkbox[name="billtype"]:checked');
				$.each(selectedBillType, function(n, v) {
					newBilTypeValue += $(v).parent().find('label').text() + '、';
					newBilType.push($(v).val());
				})
				newBilTypeValue = newBilTypeValue.substring(0, newBilTypeValue.length-1);
				if (newPayType == 1) { // 不开发票
					newValue = newPayTypeValue;
				} else if (newPayType == 2) { // 开发票
					newValue = newBilTypeValue;
				}

				var postParam = {};
				postParam.clientid = clientId;
				postParam.customersid = customerId;
				postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
				postParam.otherdemand = newPayType;
				postParam.billtype = formatArrayToStringParam(newBilType);
				postParam.trace = '修改其它需求，修改前为：' + formatOldValue + '，修改后为：' + newValue;

				jsonPostAjax(
					url = basePath + '/customer/main/updatedemandinfo.htm',
					postParam,
					function(result) {
//							$this_.parent().find('dd').html(newValue);
						layer.msg('修改成功');
						layer.close(index);
						location.reload();
					}
				)
			},
			{
				area: ['540px', '200px'],
				success: function() {
					// 初始化发票需求
					initBillItem($this_);
				}
			}
		)
	}
})

function initBillItem($this_) {
	$('#J_isBill').html('<option value="">请选择</option>');
	$('#J_bill').html('');
	$("#J_bill").hide();

	// 初始化原值
	$('#J_oldBill').html($this_.parent().find('dd').text());

	// 初始化“是否开发票”
	var billItemStr = $this_.attr('data-columns');
	billItemStr = formatToComma(billItemStr); // 转义字符
	var billItemArr = billItemStr.split('|');
	var isBill = billItemArr[0];
	var bill = billItemArr[1];

	dimContainer.buildDimChosenSelector($("#J_isBill"), "isBill", isBill);
	if (isBill == '2') { // 开发票
		dimContainer.buildDimCheckBox($("#J_bill"), "billtype", "bill", bill);
		$("#J_bill").show();
	}
}

$('#J_isBill').on("change", function(){
	if($(this).val() == '2') {
		if($('#J_bill').html() == '') {
			dimContainer.buildDimCheckBox($("#J_bill"), "billtype", "bill", '');
			$("#J_bill").show();
		}
	} else {
		$(':checkbox', $('#J_bill')).prop('checked', false);
		$('#J_bill').html('');
		$("#J_bill").hide();
	}

});

// 编辑客户来源
$(document).delegate('#J_editCustomerSource', 'click', function(event){
	var $this_ = $(this);

	var newValue = '';
	var oldValue = $this_.parent().find('dd').text();
	var formatOldValue = (oldValue.trim()=='') ? '空' : oldValue;

	if(lease_edit_permission) {
		commonContainer.modal(
			'修改客户来源',
			$('#J_editCustomerSourceLayer'),
			function(index, layero) {
				validate = $('#J_editSourceForm').validate({
					rules:{
					    infosource: {
					    	required: {
					    		depends: function(element) {
					    			var hasChildenArr = ['4','8','29','36','43','45'];
					    			if ($.inArray($('#J_customerSource').val(), hasChildenArr) >= 0) {
					    				return true;
					    			}
					    		}
					    	},
					    }
					}
				}).form();
				if(!validate) return false;

				var newSourceId = $('#J_customerSource').val();
				var newSourceValue = $('#J_customerSource').find("option:selected").text();
				var newInfoSourceId = $('#J_infoSource').val();
				var newInfoSourceValue = $('#J_infoSource').find("option:selected").text();
				newValue = newSourceValue;
				if (newInfoSourceValue)
					newValue = newValue + ' - ' + newInfoSourceValue;

				var postParam = {};
				postParam.clientid = clientId;
				postParam.customersid = customerId;
				postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
				postParam.source = newSourceId;
				postParam.infosource = newInfoSourceId==null ? '' : newInfoSourceId;
				postParam.trace = '修改其它需求，修改前为：' + formatOldValue + '，修改后为：' + newValue;

//					console.log(postParam);
				jsonPostAjax(
					url = basePath + '/customer/main/updatebasicinfo.htm',
					postParam,
					function(result) {
//							$this_.parent().find('dd').html(newValue);
						layer.msg('修改成功');
						layer.close(index);
						location.reload();
					}
				)
			},
			{
				area: ['400px', '240px'],
				success: function() {
					// 初始化客户来源
					initCustomerSource($this_);
				}
			}
		)
	}
})

// 校验区间
jQuery.validator.addMethod("compareMinIntervalNumber", function (value, element, param) {
	var ele = $(element).closest('form').find(param);
	var before = ele.val();
	var after = value;
	if(before!='' && after!=''){
		var val = (Number(before) <= Number(after));
		if(val != false){
			$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		}
		return val;
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("compareMaxIntervalNumber", function (value, element, param) {
	var ele = $(element).closest('form').find(param);
	var after = ele.val();
	var before = value;
	if(before!='' && after!=''){
        console.log(before , after);
        var val = (Number(before) <= Number(after));
		if(val != false){
			$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		}
		return val;
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}
}, $.validator.format("存在不符合规则的数据！"));

//校验区间
jQuery.validator.addMethod("compareBedRoom", function (value, element, param) {
	var ele = $(element).closest('form').find(param);
	var before = ele.val();
	var after = value;
	alert(before);
	alert(after);
	if(before!='' || after!=''){
		var val = (Number(before) <= Number(after));
		if(val != false){
			$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		}
		return val;
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}
}, $.validator.format("存在不符合规则的数据！"));


//邮政编码验证  
jQuery.validator.addMethod("isZipCode", function (value, element) {
  var tel = /^[0-9]{6}$/;
  return this.optional(element) || (tel.test(value));
}, "请正确填写邮政编码");


//字符验证  
jQuery.validator.addMethod("string", function (value, element) {
  return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "不允许包含特殊符号!");


//必须以特定字符串开头验证  
jQuery.validator.addMethod("begin", function (value, element, param) {
  var begin = new RegExp("^" + param);
  return this.optional(element) || (begin.test(value));
}, $.validator.format("必须以 {0} 开头!"));


//验证值不允许与特定值等于  
jQuery.validator.addMethod("notEqual", function (value, element, param) {
  return value != param;
}, $.validator.format("输入值不允许为{0}!"));


//验证值必须大于特定值(不能等于)  
jQuery.validator.addMethod("gt", function (value, element, param) {
  return value > param;
}, $.validator.format("输入值必须大于{0}!"));

//字母数字支持,输入多个
jQuery.validator.addMethod("alnumAndchcharacter", function (value, element) {
    return /^[\w\s,，]+$/.test(value) || this.optional(element);
}, "只能包括汉字、英文字母和数字");

//字符验证       
jQuery.validator.addMethod("stringCheckz", function(value, element) {
	console.log(value);
    return this.optional(element) || /^[\u4E00-\u9FA5\w]+$/.test(value);
}, "存在不符合规则的数据！");
//字符验证       
jQuery.validator.addMethod("stringCheck", function(value, element) {
    return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只能包括中文字、英文字母、数字和下划线");
//租期验证       
jQuery.validator.addMethod("dateCheckz", function(value, element) {
	var RegExp = /^\d+$/;
    return this.optional(element) || /^[\u4E00-\u9FA5\w]+$/.test(value)||RegExp.test(value);
}, "存在不符合规则的数据！");
//验证值小数位数不能超过两位  
jQuery.validator.addMethod("decimal", function (value, element) {
  var decimal = /^-?\d+(\.\d{1,2})?$/;
  return this.optional(element) || (decimal.test(value));
}, $.validator.format("小数位数不能超过两位!"));


//字母数字  
jQuery.validator.addMethod("alnum", function (value, element) {
  return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
}, "只能包括英文字母和数字");

//只能输入英文
jQuery.validator.addMethod("english", function(value, element) {
    var chrnum = /^([a-zA-Z]+)$/;
    return this.optional(element) || (chrnum.test(value));
}, "只能输入字母");

//汉字  
jQuery.validator.addMethod("chcharacter", function (value, element) {
  var tel = /^[\u4e00-\u9fa5]+$/;
  return this.optional(element) || (tel.test(value));
}, "请输入汉字");


//身份证号码验证（加强验证）  
jQuery.validator.addMethod("isIdCardNo", function (value, element) {
  return this.optional(element) || /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/.test(value);
}, "请正确输入身份证号码");


//手机号码验证  
jQuery.validator.addMethod("isMobile", function (value, element) {
  var length = value.length;
  var mobile = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
  return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");


//电话号码验证  
jQuery.validator.addMethod("isTel", function (value, element) {
  var tel = /^\d{3,4}-?\d{7,9}$/;    //电话号码格式010-12345678
  return this.optional(element) || (tel.test(value));
}, "请正确填写电话号码");


/*-----------------------------------------------------------*/
// 跟进
$("#oper_followup").on("click",function(){
	if(!lease_follow_add_permission){
		return;
	}
	commonContainer.modal(
		'添加跟进',
		$('#editfollowup_layer'),
		function(index, layero) {
			var follow_content=$("#J_followup_content").val();
			var remind_content=$("#J_reminder_content").val();
			var remind_time=$("#J_reminder_time").val();
			if(follow_content==""){
				commonContainer.alert("跟进内容不能为空");
				return false;
			}
			jsonPostAjax(
				basePath + '/customer/follow/insertfollow',
				{
					"clientid": clientId,		//客户编号
					"customersid": customerId,	//需求ID
					"type": "1",				//跟进类型
					"content": follow_content,	//跟进内容
					"remindtime": remind_time,	//提醒时间
					"remindmsg": remind_content,//提醒内容
					"sourceid": ""				//源ID(非必须，可不传值)
				},
				function() {
					layer.msg("操作成功");
					layer.close(index);
					location.reload();
				}
			);
		},
		{
			overflow :false,
			area : ['680px', '400px'],
			btns : [ '保存', '取消' ],
			success: function() {
				$('#J_reminder_time').val('');
				$('#J_followup_content').val('');
				$('#J_reminder_content').val('');
			}
		}
	);
});

// 转介
$("#oper_referral").on("click",function(){
    if (!lease_referral_permission) {
        return;
    }
	commonContainer.modal(
		'客源共享',
		$('#editreferral_layer'),
		function(index, layero) {
			// 获取当前的转介类型 1:共享到店组公客 2:转介
			var curType = $('input:radio[name="guest"]:checked').val();
			if(curType==null){
				commonContainer.alert("请选择转介类型");
				return false;
			}

			if(curType == "1") { // 共享到店组公客
				commonContainer.showLoading();
				jsonPostAjax(
					basePath + '/customer/cooperation/detailsubtenancy.htm',
					{
					  "clientid": clientId,
					  "type": curType
					},
					function() {
						commonContainer.hideLoading();
						layer.msg("操作成功");
						layer.close(index);
						location.reload();
					}
				);
			}else if(curType == "2") { // 转介
				var deptname = $("#J_deptName").attr("data-id"); //接收部门
				var sendee_id = $("#J_sendee").attr("data-id"); //接收人id
				if(deptname == ''){
					commonContainer.alert("请选择接收部门");
					return false;
				}
				if(sendee_id == ''){
					commonContainer.alert("请选择接收人");
					return false;
				}

				commonContainer.showLoading();
				jsonPostAjax(
					basePath + '/customer/cooperation/detailsubtenancy.htm',
					{
					  "clientid": clientId,
					  "type": curType,
					  "userid":sendee_id
					},
					function() {
						commonContainer.hideLoading();
						layer.msg("操作成功");
						layer.close(index);
						location.reload();
					}
				);
			}
	},
	{
		overflow :false,
		area : ['680px', '260px'],
		btns : [ '保存', '取消' ],
		success: function() {
			var html = '<div class="radio radio-primary radio-inline">'+
					'<input type="radio" value="1" name="guest" id="public_guest"><label for="public_guest">共享到店组公客</label>'+
				'</div>'+
				'<div class="radio radio-primary radio-inline">'+
					'<input type="radio" value="2" name="guest" id="private_guest" style="margin-left:8px;"><label for="private_guest">转介</label>'+
				'</div>';
			$('#J_guest').html(html);

			$("#J_sendee").val('');
			$("#J_sendee").attr('data-id', '');
			$("#J_deptLevel").val('');
			$("#J_deptName").val('');
			$("#J_deptName").attr('data-id', '');
			$("#private_guest_box").hide();
		}
	});

});

$(document).delegate(':radio[name="guest"]', 'click', function(event){
	if($(this).val()=="1"){
		$("#private_guest_box").hide();
	}else if($(this).val()=="2"){
		$("#private_guest_box").show();
	}
});

// 设为黑名单
$(document).delegate('#oper_blacklist', 'click', function(event){
    if (!lease_black_permission) {
        return;
    }
	jsonGetAjax(
		basePath + '/custom/black/insertblack',
		{clientid: clientId},
		function(result) {
			layer.msg("设置成功，已提交审核");
		}
	);
});

