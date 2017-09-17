/**
 * 根据组织结构选择所属人
 */
//var agentUrl = 'http://dev.cbs.bacic5i5j.com:8080/base/webutil/findErpOrganizationUserByOrgLevel.htm';
//function searchAgent($container, isShowBtn, listAlign) {
//	var itemArr = new Array();
//	
//	jsonpAjax(agentUrl, {}, function(result) {
//		$.each(result.data, function(n, value) {
//			 var data = value.id + ' / ' + value.name;
//			 
//			 var dataArr = new Object();
//			 dataArr.id = value.id;
//			 dataArr.name = value.name;
//			 dataArr.data = data;
//			 
//			 itemArr.push(dataArr);
//		 });
//		searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
//	})
//}
/**
 * 银行列表
 */
function selectBankInfo($container, selectedValues) {
	// 初始化chosen控件
	commonContainer.initChosen($container);
	
    var options = [];
	var url = basePath + '/house/main/selectBankInfo.htm';
	jsonGetAjax(url, {}, function(result) {
		$.each(result.data, function(n, value) { 
	    	options.push('<option value="' + value.id + '">' + value.bankName + '</option>');
	    })
	    $container.append(options);
		
		var selectedValueArr = selectedValues.split(',');
		$container.val(selectedValueArr);
		$container.trigger("chosen:updated");
	})
}

/**
 * 国家搜索
 */
function selectNational($container, selectedValues) {
	// 初始化chosen控件
	commonContainer.initChosen($container);
	
    var options = [];
	var url = basePath + '/custom/common/selectallnationalities.htm';
	jsonGetAjax(url, {}, function(result) {
		$.each(result.data, function(n, value) { 
	    	options.push('<option value="' + value.countryCode + '">' + value.countryName + '</option>');
	    })
	    $container.append(options);
		
		var selectedValueArr = selectedValues.split(',');
		$container.val(selectedValueArr);
		$container.trigger("chosen:updated");
	})
}

/**
 * 楼盘搜索
 */
function searchBuild($container, isShowBtn, listAlign) {
	var itemArr = new Array();
	
	return jsonGetAjax(basePath + '/building/directory/findhouseslist', {}, $.noop).then(function (result) {
        $.each(result.data || [], function(n, value) {
            var data = value.id + ' / ' + value.name;

            var dataArr = new Object();
            dataArr.id = value.bizid;
            dataArr.name = value.name;
            dataArr.data = data;

            itemArr.push(dataArr);
        });
        searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['name'], isShowBtn, listAlign);
    });
}

/**
 * 开户行搜索
 */
function Openbank($container, isShowBtn, listAlign) {
	var itemArr = new Array();
	
	jsonGetAjax(basePath + '/finance/common/selectByName', {}, function(result) {
		$.each(result.data, function(n, value) {
			 var data = value.id + ' / ' + value.bankName;
			 
			 var dataArr = new Object();
			 dataArr.id = value.id;
			 dataArr.bankName = value.bankName;
			 dataArr.data = data;
			 
			 itemArr.push(dataArr);
		 });
		searchContainer.jsonSearch_($container, itemArr, 'id', 'bankName', ['data'], isShowBtn, listAlign);
	})
}

/**
 * 商圈搜索
 */
function searchBusiness($container, isShowBtn, listAlign) {
	var itemArr = new Array();
	
	jsonAjax(basePath + '/custom/common/businessserarch.htm', {}, function(result) {
		$.each(result.data.buslist, function(n, value) {
			 var data = value.busiId + ' / ' + value.busiName;
			 
			 var dataArr = new Object();
			 dataArr.id = value.busiId;
			 dataArr.name = value.busiName;
			 dataArr.data = data;
			 
			 itemArr.push(dataArr);
		 });
		searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
	})
}

/**
 * 房源编号搜索
 */
function searchHouseId($container, isShowBtn, listAlign) {
	var itemArr = new Array();
	jsonPostAjax(basePath + '/house/conceal/findwouldconcealhouses', {}, function(result) {
		$.each(result.data, function(n, value) {
			if(value.buildingDistrictName){
				
			}else{
				value.buildingDistrictName='-';
			}
			 var data = value.houseId + ' / ' + value.buildingDistrictName;
			 var dataArr = new Object();
			 dataArr.id = value.houseId;
			 /*dataArr.name = value.buildingDistrictName;*/
			 dataArr.data = data;
			 itemArr.push(dataArr);
		 });
		searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
	})
}
/**
 * 区域下拉框
 */
function selectArealist($container, selectedValues) {
	// 初始化chosen控件
	commonContainer.initChosen($container);
	
    var options = [];
	var url = basePath + '/custom/common/arealist';
	jsonGetAjax(url, {}, function(result) {
		$.each(result.data, function(n, value) { 
	    	options.push('<option value="' + value.areaId + '">' + value.areaName + '</option>');
	    })
	    $container.append(options);
		
		var selectedValueArr = selectedValues.split(',');
		$container.val(selectedValueArr);
		$container.trigger("chosen:updated");
	})
}



/**
 * 经济人名片
 */
function getUserStaffInfo(userId) {
	setTimeout(function () {
        layer.open({
            title: false,
            type : 2,
            shift: 5,
            skin : 'layui-layer-lan',
            content : basePath + '/system/staff/manager.htm?usersid='+userId,
            area : ['800px', '400px'],
            btn : '确定'
        });
    });
}


/**
 * 编辑详情页面元素的公共方法（包括：input; radio; checkbox; select; intervalInput(输入框区间); intervalSelect(下拉框区间); date;）
 * 
 * @param editId：当前编辑的信息id，如客户id
 * @param $container：当前编辑元素标题的父级ID
 * @param colums：当前编辑元素的name、展示形式、基础数据的keyCode、之前选中值，用“|”隔开；当某项为空时，传空，例：name|input| 或 name|input|gender
 *                其中，展示形式包括：input; radio; checkbox; select; intervalInput(输入框区间); intervalSelect(下拉框区间); date;
 * @param widgetName：当前编辑元素的name
 * @param showType：展示形式
 * @param configKeyCode：基础数据的keyCode，若无此项传null
 */
function editWidget(editId, $container){
	var colums = $container.attr('data-columns');
	var maxlength = $container.attr('maxlength');
	colums = formatToComma(colums); // 转义字符

    var columArr = colums.split('|');
	var widgetName = columArr[0];	// 当前编辑元素的name
	var showType = columArr[1];		// 展示形式
	var configKeyCode = columArr[2];	// 基础数据的keyCode
	var oldSelectedValue = columArr[3];	// 之前选中的值

	var newContainer = $('#J_newValue');
    newContainer.html('');
	var curLabel = $container.parent().find('dt').text().trim().replace('*', '');
	var oldValue = $container.parent().find('dd').text();
	var unit = $container.parent().find('dd').find('span').text();
	
	$('#J_oldLabel').html('原' + curLabel);
	$('#J_oldValue').text(oldValue);
	$('#J_newLabel').html($container.parent().find('dt').html());
	
	switch(showType) {
		case 'input':
			var html = '<div class="col-sm-4">' +
							'<input id="' + widgetName + '" name="' + widgetName + '" type="text" class="form-control" value="' + oldSelectedValue + '">' +
						'</div>' +
						'<label class="control-label">' + unit + '</label>'; // 区间单位
            newContainer.html(html);
			break;
		
		case 'radio':
			dimContainer.buildDimRadio(newContainer, widgetName, configKeyCode, oldSelectedValue);
			break;
		  
		case 'checkbox':
			dimContainer.buildDimCheckBox(newContainer, widgetName, configKeyCode, oldSelectedValue);
			break;
			
		case 'select':
			var html = '<select id="' + widgetName+ '" name="' + widgetName + '" class="form-control m-b" data-placeholder="请选择">' +
						'<option value="">请选择</option>' +
				   '</select>';
            newContainer.html(html);
			dimContainer.buildDimChosenSelector(newContainer.find("#" + widgetName), configKeyCode, oldSelectedValue);
			break;
			
		case 'textarea':
			var html = '<textarea id="' + widgetName + '" name="' + widgetName + '" rows="3" cols="100%" class="form-control"></textarea>';
            newContainer.html(html);
            if (maxlength) {
                newContainer.find('#' + widgetName).prop('maxLength' , maxlength);
                newContainer.append('<span class="help-block text-right">还可输入 '+maxlength+' 个字</span>');
            }
			break;
		
		case 'intervalInput':
			var widgetNameArr = widgetName.split(',');
			var oldSelectedValueArr = oldSelectedValue.split(',');
			var html = '<div class="col-sm-4">' +
						'<input type="text" id="' + widgetNameArr[0] + '" name="' + widgetNameArr[0] + '" value="' + oldSelectedValueArr[0] + '" class="form-control J_'+widgetNameArr[0]+'">' +
					'</div>' +
					'<div class="control-spacing">-</div>' +
					'<div class="col-sm-4">' +
						'<input type="text" id="' + widgetNameArr[1] + '" name="' + widgetNameArr[1] + '" value="' + oldSelectedValueArr[1] + '" class="form-control J_'+widgetNameArr[1]+'">' +
					'</div>' +
					'<label class="control-label">' + unit + '</label>'; // 区间单位
            newContainer.html(html);
			break;
			
		case 'intervalSelect':
			var widgetNameArr = widgetName.split(',');
			var oldSelectedValueArr = oldSelectedValue.split(',');
			var html = '<div class="col-sm-4">' +
						'<select id="' + widgetNameArr[0]+ '" name="' + widgetNameArr[0] + '" class="form-control m-b" data-placeholder="请选择">' +
							'<option value="">请选择</option>' +
						'</select>'+
					'</div>' +
					'<div class="control-spacing">或</div>' +
					'<div class="col-sm-4">' +
						'<select id="' + widgetNameArr[1]+ '" name="' + widgetNameArr[1] + '" class="form-control m-b" data-placeholder="请选择">' +
							'<option value="">请选择</option>' +
						'</select>'+
					'</div>' +
					'<label class="control-label">' + unit + '</label>'; // 区间单位
            newContainer.html(html);
			dimContainer.buildDimChosenSelector($("#" + widgetNameArr[0]), configKeyCode, oldSelectedValueArr[0]);
			dimContainer.buildDimChosenSelector($("#" + widgetNameArr[1]), configKeyCode, oldSelectedValueArr[1]);
			break;
			
		case 'date':
			var html = '<input id="' + widgetName + '" name="' + widgetName + '" class="form-control w120" value="' + oldSelectedValue + '" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})">';
            newContainer.html(html);
			break;
			
		case 'nationality':
			var html = '<select id="' + widgetName+ '" name="' + widgetName + '" class="form-control m-b" data-placeholder="请选择">' +
						'<option value="">请选择</option>' +
				   '</select>';
            newContainer.html(html);
			selectNational(newContainer.find("#" + widgetName), oldSelectedValue);
			break;
	}
}

//获取修改后的值，以便将此值传到页面
function getNewValue(showType, editName, unit) {
	var value = '';
	
	switch(showType) {
		case 'input':
			value = $('#'+editName).val();
			break;
		
		case 'radio':
			value = $(':radio[name="'+editName+'"]:checked').parent().find('label').text();
			break;
		  
		case 'checkbox':
			var newValue = '';
			var selectedItem = $(':checkbox[name="'+editName+'"]:checked');
			$.each(selectedItem, function(n, v) {
				newValue += $(v).parent().find('label').text() + '、';
			})
				
			value = newValue.substring(0, newValue.length-1);
			break;
			
		case 'select':
			value = $('#'+editName).find("option:selected").text();
			break;
			
		case 'textarea':
			value = $('#'+editName).val();
			break;
		
		case 'intervalInput':
			var newValue = '';
			var editNameArr = editName.split(',');
			newValue = $('#'+editNameArr[0]).val() + ' - ' + $('#'+editNameArr[1]).val() + '<span> ' + unit + '</span>';
			
			value = newValue;
			break;
			
		case 'intervalSelect':
			var newValue = '';
			var editNameArr = editName.split(',');
			newValue = $('#'+editNameArr[0]).val() + ' - ' + $('#'+editNameArr[1]).val() + '<span> ' + unit + '</span>';
			
			value = newValue;
			break;
			
		case 'date':
			value = $('#'+editName).val();
			break;
			
		case 'nationality':
			value = $('#'+editName).find("option:selected").text();
			break;
	}
	
	return value;
}

// 获取修改日志
function getTrace(showType, title, oldValue, editName, unit) {
	var trace = '';
	var newValue = '';
	if (oldValue.trim()=='') oldValue = '空';
	
	switch(showType) {
		case 'input':
			newValue = $('#'+editName).val();
			break;
		
		case 'radio':
			newValue = $(':radio[name="'+editName+'"]:checked').parent().find('label').text();
			break;
		  
		case 'checkbox':
			var selectedItem = $(':checkbox[name="'+editName+'"]:checked');
			$.each(selectedItem, function(n, v) {
				newValue += $(v).parent().find('label').text() + '、';
			})
			break;
			
		case 'select':
			newValue = $('#'+editName).find("option:selected").text();
			break;
			
		case 'textarea':
			newValue = $('#'+editName).val();
			break;
		
		case 'intervalInput':
			var editNameArr = editName.split(',');
			newValue = $('#'+editNameArr[0]).val() + ' - ' + $('#'+editNameArr[1]).val() + ' ' + unit;
			break;
			
		case 'intervalSelect':
			var editNameArr = editName.split(',');
			newValue = $('#'+editNameArr[0]).val() + ' - ' + $('#'+editNameArr[1]).val() + ' ' + unit;
			break;
			
		case 'date':
			newValue = $('#'+editName).val();
			break;
		
		case 'nationality':
			newValue = $('#'+editName).find("option:selected").text();
			break;
	}
	
	if (newValue == '') newValue = '空';
	trace = '修改' + title + '，修改前为：' + oldValue + '，修改后为：' + newValue;
	return trace;
}

// 格式化入参（格式化之前为array，格式化之后为string）
function formatArrayToStringParam(param) {
	var newParam = '';
	if ($.isArray(param)) {
		if (param.length > 0) {
			newParam = '##';
			$.each(param, function(n, v) {
				newParam += v + '##';
			})
		}
	} else {
		if (param.trim() != '') {
			newParam = '##';
			newParam = param + '##';
		}
	}
	
	return newParam;
}

//格式化入参（格式化区间值）
function formatIntervalToStringParam(minParam, maxParam) {
//	var newParam = '';
//	if (minParam)
//		newParam = '##' + minParam + '##';
//	if(maxParam) {
//		if (minParam)
//			newParam += maxParam + '##';
//		else
//			newParam += '####' + maxParam + '##';
//	}
	
	var newParam = '##' + minParam + '##' + maxParam + '##';
	
	return newParam;
}

// 将分隔符##全部转换成英文逗号
function formatToComma(value) {
	var reg = new RegExp('##', 'g');
	value = value.replace(reg, ',');
	
	return value;
}

/**
 * bootstrapTable分页
 * 
 * @param $container：table控件
 * @param url：请求后台的URL
 * @param queryParams：传递参数
 * @param columns：显示列
 * @param options：其它
 * 					( method：请求方式
 * 					  dataType：返回的数据类型
 * 					  striped：是否显示行间隔色
 * 					  pagination：是否显示分页
 * 					  sidePagination：分页方式，client客户端分页，server服务端分页
 * 					  pageNumber：初始化加载第几页页，默认第1页
 * 					  pageSize：每页的行数
 *					  pageList：可供选择的每页的行数
 * 					  responseHandler：设置总页数
 * 					)
 */
function paging($container, url, queryParams, columns, responseHandler, options) {
	options = options || {};
	
	$container.bootstrapTable({
		url: url,
		queryParams: eval(queryParams),
		columns: columns,
		method: options.method || 'post',
		dataType: options.dataType || 'json',
		striped: commonContainer.isNull(options.striped) ? true : options.striped,
		pagination: commonContainer.isNull(options.pagination) ? true : options.pagination,
		sidePagination: options.sidePagination ? options.sidePagination : 'server',
		pageNumber: options.pageNumber ? options.pageNumber : 1,
		pageSize: options.pageSize ? options.pageSize : 10,
		pageList: options.pageList ? options.pageList : [10, 20, 50],
		responseHandler: eval(responseHandler)
	});
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function (fmt) {
	var o = {
	     "M+": this.getMonth() + 1, //月份 
	     "d+": this.getDate(), //日 
	     "h+": this.getHours(), //小时 
	     "m+": this.getMinutes(), //分 
	     "s+": this.getSeconds(), //秒 
	     "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	     "S": this.getMilliseconds() //毫秒 
	 };
	 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	 for (var k in o)
		 if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	 return fmt;
}
/**
 * 楼盘库楼盘搜索
 */
function searchHouses($container, isShowBtn, listAlign) {
    var itemArr = new Array();
    commonContainer.showLoading();
    return jsonAjax(basePath + '/building/directory/findhouseslist', {}, $.noop).then(function (result) {
        $.each(result.data || [], function (n, value) {

            var dataArr = new Object();
            dataArr.name = value.name;
            dataArr.id = value.id + ';' + value.bizid;
            itemArr.push(dataArr);
        });
        commonContainer.hideLoading();
        searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['name'], true, 'left');
    });
}
/**
 * 生成config下拉框（包含单选和多选）
 * 
 * @param $container：需要加载options的select控件（如：$("#compId")）
 * @param type：是哪种类型 0楼盘，1栋座，2单元，3楼层，4门牌号
 * @param id：取上级的id
 * @param selectedValue：所选中的值，如果没有选中值，则传""
 */
function findbuildinglist($container, type, id, selectedValues) {

	$container.empty();
	$container.trigger("chosen:updated");
	// 初始化chosen控件
	commonContainer.initChosen($container);
	
	var that = this;
    var options = [];
    if(id!=''){  
    	if(type==0){
    		$('select',$('form[name="form1"]')).removeAttr('disabled');
    		$('select',$('form[name="form1"]')).attr({"data-placeholder":"请选择"});
    	}else if(type==1){
    		$('select:gt(0)',$('form[name="form1"]')).removeAttr('disabled');
    		$('select:gt(0)',$('form[name="form1"]')).attr({"data-placeholder":"请选择"});
    	}else if(type==2){
    		$('select:gt(1)',$('form[name="form1"]')).removeAttr('disabled');
    		$('select:gt(1)',$('form[name="form1"]')).attr({"data-placeholder":"请选择"});
    	}else if(type==3){
    		$('select:gt(2)',$('form[name="form1"]')).removeAttr('disabled'); 
    		$('select:gt(2)',$('form[name="form1"]')).attr({"data-placeholder":"请选择"});
    	}   	
    	$("select").trigger("chosen:updated");
    	commonContainer.showLoading();
	    jsonGetAjax(basePath + '/building/directory/findbuildinglist', {'id':id,'type':type}, function(result) {
	    	options.push('<option value="">请选择</option>');
			$.each(result.data, function(n, value) { 
				if(result.data[0].type==4){
					options.push('<option value="' + value.id+';'+value.bizid + '" operationalservicetype ='+value.operationalservicetype +'>' + value.name + '</option>');
				}else{
					options.push('<option value="' + value.id+';'+value.bizid + '">' + value.name + '</option>');
				}
		    })
		    if(result.data.length!=0){
		    	if(result.data[0].type==1){
			    	$container=$("#J_building");
			    }else if(result.data[0].type==2){
			    	if(type==0){
			    		$('#J_building').prop('disabled','disabled');
			    		$('#J_building').attr({"data-placeholder":"无栋座"});
			    	}	
			    	$("select").trigger("chosen:updated");
			    	$container=$("#unit");
			    }else if(result.data[0].type==3){
			    	if(type==0){
			    		$('#J_building').prop('disabled','disabled');
			    		$('#J_building').attr({"data-placeholder":"无栋座"});
			    		$('#unit').prop('disabled','disabled');	
			    		$('#unit').attr({"data-placeholder":"无单元"});
			    	}else if(type==1){
			    		$('#unit').prop('disabled','disabled');	
			    		$('#unit').attr({"data-placeholder":"无单元"});
			    	}				    	
			    	$("select").trigger("chosen:updated");
			    	$container=$("#floor");
			    }else if(result.data[0].type==4){
			    	if(type==0){
			    		$('#J_building').prop('disabled','disabled');
			    		$('#J_building').attr({"data-placeholder":"无栋座"});
				    	$('#unit').prop('disabled','disabled');
				    	$('#unit').attr({"data-placeholder":"无单元"});
				    	$('#floor').prop('disabled','disabled');	
				    	$('#floor').attr({"data-placeholder":"无楼层"});
			    	}else if(type==1){
			    		$('#unit').prop('disabled','disabled');
			    		$('#unit').attr({"data-placeholder":"无单元"});
				    	$('#floor').prop('disabled','disabled');
				    	$('#floor').attr({"data-placeholder":"无楼层"});
			    	}else if(type==2){
			    		$('#floor').prop('disabled','disabled');	
			    		$('#floor').attr({"data-placeholder":"无楼层"});
			    	}			    	
			    	$("select").trigger("chosen:updated");
			    	$container=$("#houseNumber");
			    }
		    }
		    
		    $container.append(options);
		    commonContainer.hideLoading();
			var selectedValueArr = selectedValues.split(',');
			$container.val(selectedValueArr);
			$container.trigger("chosen:updated");
		})
    }
}

/**
 * 获取最小日期,返回目标元素的值或者当前时间
 * @param selector 元素选择器或者jquery元素
 * @param format
 */
function getMinDate(selector, format) {
    var val;
    if (selector) {
        val = $(selector).val()
    }
    if (val) {
        return val;
    }
    return laydate.now(Date.now(), format)
}

/**
 * 获取最大时间，返回目标元素的值或者空也就是不限制
 * @param selector
 */
function getMaxDate(selector) {
    var val;
    if (selector) {
        val = $(selector).val();
    }
    if (val) {
        return val;
    }
    return undefined;
}
/**
 * 货币转化中文
 * @param 金额
 */
function convertCurrency(money) {
	  //汉字的数字
	  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
	  //基本单位
	  var cnIntRadice = new Array('', '拾', '佰', '仟');
	  //对应整数部分扩展单位
	  var cnIntUnits = new Array('', '万', '亿', '兆');
	  //对应小数部分单位
	  var cnDecUnits = new Array('角', '分', '毫', '厘');
	  //整数金额时后面跟的字符
	  var cnInteger = '整';
	  //整型完以后的单位
	  var cnIntLast = '元';
	  //最大处理的数字
	  var maxNum = 999999999999999.9999;
	  //金额整数部分
	  var integerNum;
	  //金额小数部分
	  var decimalNum;
	  //输出的中文金额字符串
	  var chineseStr = '';
	  //分离金额后用的数组，预定义
	  var parts;
	  if (money == '') { return ''; }
	  money = parseFloat(money);
	  if (money >= maxNum) {
	    //超出最大处理数字
	    return '';
	  }
	  if (money == 0) {
	    chineseStr = cnNums[0] + cnIntLast + cnInteger;
	    return chineseStr;
	  }
	  //转换为字符串
	  money = money.toString();
	  if (money.indexOf('.') == -1) {
	    integerNum = money;
	    decimalNum = '';
	  } else {
	    parts = money.split('.');
	    integerNum = parts[0];
	    decimalNum = parts[1].substr(0, 4);
	  }
	  //获取整型部分转换
	  if (parseInt(integerNum, 10) > 0) {
	    var zeroCount = 0;
	    var IntLen = integerNum.length;
	    for (var i = 0; i < IntLen; i++) {
	      var n = integerNum.substr(i, 1);
	      var p = IntLen - i - 1;
	      var q = p / 4;
	      var m = p % 4;
	      if (n == '0') {
	        zeroCount++;
	      } else {
	        if (zeroCount > 0) {
	          chineseStr += cnNums[0];
	        }
	        //归零
	        zeroCount = 0;
	        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
	      }
	      if (m == 0 && zeroCount < 4) {
	        chineseStr += cnIntUnits[q];
	      }
	    }
	    chineseStr += cnIntLast;
	  }
	  //小数部分
	  if (decimalNum != '') {
	    var decLen = decimalNum.length;
	    for (var i = 0; i < decLen; i++) {
	      var n = decimalNum.substr(i, 1);
	      if (n != '0') {
	        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
	      }
	    }
	  }
	  if (chineseStr == '') {
	    chineseStr += cnNums[0] + cnIntLast + cnInteger;
	  } else if (decimalNum == '') {
	    chineseStr += cnInteger;
	  }
	  return chineseStr;
	}
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

//��Number��������һ��add����������������ӷ��㡣
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};
/**
 ** �˷����������õ���ȷ�ĳ˷����
 ** ˵����javascript�ĳ˷�����������������������˵�ʱ���Ƚ����ԡ��������ؽ�Ϊ��ȷ�ĳ˷����
 ** ���ã�accMul(arg1,arg2)
 ** ����ֵ��arg1���� arg2�ľ�ȷ���
 **/
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// ��Number��������һ��mul����������������ӷ��㡣
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
};
Math.sub = function(v1, v2)
{
///<summary>精确计算减法。语法：Math.sub(v1, v2)</summary>
///<param name="v1" type="number">操作数。</param>
///<param name="v2" type="number">操作数。</param>
///<returns type="number">计算结果。</returns>
  return Math.add(v1, -v2);
}


Number.prototype.sub = function(v)
{
///<summary>精确计算减法。语法：number1.sub(v)</summary>
///<param name="v" type="number">操作数。</param>
///<returns type="number">计算结果。</returns>
  return Math.sub(this, v);
}
Math.div = function(v1, v2)
{
///<summary>精确计算除法。语法：Math.div(v1, v2)</summary>
///<param name="v1" type="number">操作数。</param>
///<param name="v2" type="number">操作数。</param>
///<returns type="number">计算结果。</returns>
  var t1 = 0;
  var t2 = 0;
  var r1, r2;
  try
  {
    t1 = v1.toString().split(".")[1].length;
  }
  catch (e)
  {
  }
  try
  {
    t2 = v2.toString().split(".")[1].length;
  }
  catch (e)
  {
  }

  with (Math)
  {
    r1 = Number(v1.toString().replace(".", ""));
    r2 = Number(v2.toString().replace(".", ""));
    return (r1 / r2) * pow(10, t2 - t1);
  }
}


Number.prototype.div = function(v)
{
///<summary>精确计算除法。语法：number1.div(v)</summary>
///<param name="v" type="number">操作数。</param>
///<returns type="number">计算结果。</returns>
  return Math.div(this, v);
}
Math.add = function(v1, v2)
{
///<summary>精确计算加法。语法：Math.add(v1, v2)</summary>
///<param name="v1" type="number">操作数。</param>
///<param name="v2" type="number">操作数。</param>
///<returns type="number">计算结果。</returns>
  var r1, r2, m;
  try
  { 
    r1 = v1.toString().split(".")[1].length;
  }
  catch (e)
  {
    r1 = 0;
  }
  try
  {
    r2 = v2.toString().split(".")[1].length;
  }
  catch (e)
  {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  
  return (v1 * m + v2 * m) / m;
}


Number.prototype.add = function(v)
{
///<summary>精确计算加法。语法：number1.add(v)</summary>
///<param name="v" type="number">操作数。</param>
///<returns type="number">计算结果。</returns>
  return Math.add(v, this);
}
Math.mul = function(v1, v2)
{
///<summary>精确计算乘法。语法：Math.mul(v1, v2)</summary>
///<param name="v1" type="number">操作数。</param>
///<param name="v2" type="number">操作数。</param>
///<returns type="number">计算结果。</returns>
  var m = 0;
  var s1 = v1.toString();
  var s2 = v2.toString();
  try
  {
    m += s1.split(".")[1].length;
  }
  catch (e)
  {
  }
  try
  {
    m += s2.split(".")[1].length;
  }
  catch (e)
  {
  }
  
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


Number.prototype.mul = function(v)
{
///<summary>精确计算乘法。语法：number1.mul(v)</summary>
///<param name="v" type="number">操作数。</param>
///<returns type="number">计算结果。</returns>
  return Math.mul(v, this);
}