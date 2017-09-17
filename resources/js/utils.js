var currUserId = '';
var successMsg = '操作成功！';
var errorMsg = '系统错误，请与管理员联系！';
// var loginTimeoutCode = '1010101001';
// var logoutUrl = 'http://dev.cbs.bacic5i5j.com:8080/base/system/logout.htm';

/**
 * form表单序列化
 * 
 * @return {}
 */
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (this.value && $.trim(this.value) != '') {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = $.trim(this.value || '');
			}
		}
	});

	return o;
}

/**
 * 自动填充表单
 */
$.fn.fillForm = function(array, data) {
	for (var i = 0, len = array.length; i < len; i++) {
		$.each($(array[i], this), function(index, item) {
			var obj = $(item);
			if(obj.attr('id') && data) {
				setValue(array[i], obj, data[obj.attr('id')]);
			} else if(obj.attr('name') && data) {
				setValue(array[i], obj, data[obj.attr('name')]);
			} else {
				setValue(array[i], obj, '');
			}
		});
	}

	function setValue(type, obj, value) {
		obj.val(value);
		/*
		 * if(type == 'input' || type == 'select') { obj.val(value); } else
		 * if(type == 'textarea') { obj.text(value); }
		 */
	}
}

/**
 * 表单重置
 * 
 * @param form
 * @param cfgKeyValidator
 * @returns
 */
function resetForm(form, cfgKeyValidator) {
	if (cfgKeyValidator) {
		cfgKeyValidator.resetForm();
	}
	$(".form-group", form).removeClass("has-success has-error");
}

function resetForm(form) {
	if (form.validate()) {
		form.validate().resetForm();
	}
	$(form).get(0).reset();
	$(".form-group", form).removeClass("has-success has-error");
	
	$("input[type=radio]", form).attr("checked", false);
	$("input[type=checkbox]", form).attr("checked", false);
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
}

/**
 * 重置查询条件
 * 
 * @param form
 */
$(function () {
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
	})
})

/**
 * ajax调用，返回数据格式为json，仅供base-web使用
 * 
 * @param url
 * @param method
 * @param data
 * @param success
 * @param error
 */
function ajax(url, method, data, success, error) {
	jQuery.ajax({
		url : url,
		dataType : 'json',
		data : data,
		type : method,
		success : success,
		error : error
	});
}

/**
 * 日期控件封装，默认格式：YYYY/MM/DD
 * 
 * @param element：日期控件的名称，如："#start"
 * @param option：可选（包括format，istime，min，max, choose）
 */
function datelayer(element, option) {
	option = option || {};
	
	laydate({
		elem: element,  
	    format: option.format || 'YYYY-MM-DD',  // 日期格式，默认为：YYYY/MM/DD，另一种格式为：YYYY/MM/DD hh:mm:ss
	    istime: option.istime || false,  // 是否显示时、分、秒
	    min: option.min,  // laydate.now(),设定最小日期
	    max: option.max,  // 设定最大日期
	    choose: option.choose // choose为function，可用于选择开始时间后重置结束日期。例：function(datas){end.min = datas;//开始日选好后，重置结束日的最小日期   end.start = datas//将结束日的初始值设定为开始日  }
	})  
}

/**
 * form表单验证
 */
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

/**
 * 接口的请求参数中增加currUserId
 */
function objectMergeUid_(arguments) {
	var result = {};
	result['userid'] = currUserId;
	
	var argumentsArr = $.makeArray(arguments)
    for (var i = 0; i < argumentsArr.length; i++) {
    	var obj = argumentsArr[i];
    	if (typeof obj !== 'object') continue;
    	for (var name in obj) {
    		result[name] = obj[name];
    	}
	}
    return result;
}

/**
 * ajax调用，默认get调用，返回数据格式为json调用，返回数据格式为json
 * 
 * @param url：请求地址
 * @param data：请求参数
 * @param successCallback：请求成功（接口返回的状态为“成功”）时调用的函数
 * @param option：可选（包括method，dataType，cache，errorCallBack）
 */
function jsonAjax(url, data, successCallback, option) {
	option = option || {};
	successCallback = successCallback || function(){layer.alert(successMsg);};
    var errorCallBack = option.errorCallBack || function () {
            layer.alert(errorMsg);
        };
    var completeCallBack = option.completeCallBack || function () {
        };
    // 返回ajax实例以便可以缓存它
	return $.ajax({
		url : url,
		data : data,
		type : option.method || 'get',
		dataType : option.dataType || 'json',
		cache : option.cache || false,
		success : function(result) {
			//result = $.parseJSON(result);
			if (result.code == 0) {
				(successCallback)(result);
			} else {
				/* if (result.code == loginTimeoutCode) {
					location.href = logoutUrl;
				} else {
					layer.alert(result.msg);
				} */
				layer.alert(result.msg);
			}
		},
		error : errorCallBack,
		complete: eval(completeCallBack)
	});
}

/**
 * ajax调用，默认get调用，返回数据格式为json
 * 
 * @param url：请求地址
 * @param data：请求参数
 * @param successCallback：请求成功（接口返回的状态为“成功”）时调用的函数
 */
function jsonGetAjax(url, data, successCallback, option) {
	option = option || {};
	successCallback = successCallback || function(){layer.alert(successMsg);};
    var errorCallBack = option.errorCallBack || function () {
            layer.alert(errorMsg);
        };
    var completeCallBack = option.completeCallBack || function () {
        };

	// 返回ajax实例以便可以缓存它
	return $.ajax({
		url : url,
		//data : objectMergeUid_(data),
		data : data,
		type : option.method || 'get',
		dataType : option.dataType || 'json',
		cache : option.cache || false,
		success : function(result) {
			if (result.code == 0) {
				(successCallback)(result);
			} else {
				commonContainer.hideLoading();
				layer.alert(result.msg);
			}
		},
		error : errorCallBack,
		complete: eval(completeCallBack)
	});
}

/**
 * ajax调用，默认post调用，返回数据格式为json调用，返回数据格式为json
 * 
 * @param url：请求地址
 * @param data：请求参数
 * @param successCallback：请求成功（接口返回的状态为“成功”）时调用的函数
 */
function jsonPostAjax(url, data, successCallback, option){	
	option = option || {};
	successCallback = successCallback || function(){layer.alert(successMsg);};
    var errorCallBack = option.errorCallBack || function () {
            layer.alert(errorMsg);
        };
    var completeCallBack = option.completeCallBack || function () {
        };
    // 返回ajax实例以便可以缓存它
	return $.ajax({
		url : url,
		//data : JSON.stringify(objectMergeUid_(data)),
		data : JSON.stringify(data),
		type : 'post',
		dataType : 'json',
		cache : false,
		contentType : "application/json ; charset=utf-8",
		success : function(result) {
			if (result.code == '0') {
				(successCallback)(result);
			} else {
                commonContainer.hideLoading();
				layer.alert(result.msg);
			}
		},
		error : errorCallBack,
		complete: eval(completeCallBack)
	});
};

/**
 * ajax调用，默认post调用，返回数据格式为jsonp
 * 
 * @param url：请求地址
 * @param data：请求参数
 * @param successCallback：请求成功（接口返回的状态为“成功”）时调用的函数
 * @param option：可选（包括method，dataType，cache，errorCallBack）
 */
function jsonpAjax(url, data, successCallback, option) {
	option = option || {};
	successCallback = successCallback || function(){layer.alert(successMsg);};
    var errorCallBack = option.errorCallBack || function () {
            layer.alert(errorMsg);
        };
    var completeCallBack = option.completeCallBack || function () {
        };
    // 返回ajax实例以便可以缓存它
	return $.ajax({
		url : url,
		data : objectMergeUid_(data),
		type : option.method || 'post',
		dataType : 'jsonp',
		jsonp: option.jsonp || 'callback',
		cache : option.cache || false,
		success : function(result) {
			if (result.code == '0') {
				(successCallback)(result);
			} else {
                commonContainer.hideLoading();
				layer.alert(result.msg);
			}
		},
		error : errorCallBack,
		complete: eval(completeCallBack)
	});
}