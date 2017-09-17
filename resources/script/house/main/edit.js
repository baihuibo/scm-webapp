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
var lease_edit_permission=true;
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
validatorRule={
	houseTypeId:{
		required:true
	},	
	buildyear:{
		required:true
	},
	buildarea:{
    	required: true,
    	number:true,
    	min:1,
    	decimal: true,
    },
    buildTypeId:{
		required:true
	},
	architectureId:{
		required:true
	},
	houseownId:{
		required:true
	},
	firstFloorHeight:{
    	number:true,
    	min:0,
    	decimal: true,
    	max:9999999999
    },
    coldAirCost:{
    	number:true,
    	min:0,
    	decimal: true,
    },
    carPortNum:{
    	number:true,
    	min:0,
    	digits:true
    },
    totalHeight:{
    	number:true,
    	min:0,
    	decimal: true,
    },
    depth:{
    	number:true,
    	min:0,
    	decimal: true,
    },
    clearHeight:{
    	number:true,
    	min:0,
    	decimal: true,
    },
    doorWidth:{
    	number:true,
    	min:0,
    	decimal: true,
    },
    gainsRate:{
    	number:true,
    	min:0,
    	decimal: true,
    },
	layoutStructure:{
		required:true
	},
	heatingcost:{
    	number:true,
    	min:0,
    	decimal: true,    	
    },
    propertyfee:{
    	number:true,
    	min:0,
    	decimal: true,    	
    },
    electricId:{
    	required: true,	
    },
    furnitureId:{
    	required: true,	
    },
    num_furnitureId1:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furnitureId"]:checked').each(function(){ 
    				arr.push($(this).val()); 
    			}); 
    			if($.inArray("1", arr)!=-1){
    				  return true;
    			}
    		}
    	},
    	number:true,
    	min:0,
    	digits:true,	
    },
    num_furnitureId2:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furnitureId"]:checked').each(function(){ 
    				arr.push($(this).val()); 
    			});
    			if($.inArray("2", arr)!=-1){
    				  return true;
    			}
    		}
    	},
    	number:true,
    	min:0,
    	digits:true,	
    },
    num_furnitureId3:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furnitureId"]:checked').each(function(){ 
    				arr.push($(this).val()); 
    			});
    			if($.inArray("3", arr)!=-1){
    				  return true;
    			}
    		}
    	},
    	number:true,
    	min:0,
    	digits:true,	
    },
    num_furnitureId4:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furnitureId"]:checked').each(function(){ 
    				arr.push($(this).val()); 
    			});
    			if($.inArray("4", arr)!=-1){
    				  return true;
    			}
    		}
    	},
    	number:true,
    	min:0,
    	digits:true,	
    },
    num_furnitureId5:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furnitureId"]:checked').each(function(){ 
    				arr.push($(this).val()); 
    			});
    			if($.inArray("5", arr)!=-1){
    				  return true;
    			}
    		}
    	},
    	number:true,
    	min:0,
    	digits:true,	
    },
    num_furnitureId6:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furnitureId"]:checked').each(function(){ 
    				arr.push($(this).val()); 
    			});
    			if($.inArray("6", arr)!=-1){
    				  return true;
    			}
    		}
    	},
    	number:true,
    	min:0,
    	digits:true,	
    },
    num_furnitureId7:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furnitureId"]:checked').each(function(){ 
    				arr.push($(this).val()); 
    			});
    			if($.inArray("7", arr)!=-1){
    				  return true;
    			}
    		}
    	},
    	number:true,
    	min:0,
    	digits:true,	
    },
	headingId:{
		required:true
	},
	certLoanId:{
		required:true
	},
	houseallfloor :{
		required: true,
    	number:true,
    	min:1,
    	digits:true
	},
}
// 编辑客户需求信息（单字段修改）
/*var basicInfoArr = ['customername','sex'];*/
	$(document).delegate('.J_edit_area', 'click', function(event){
		
		var $this_ = $(this);
		if($this_ .attr('edit-attr')==undefined){
			return false;
		}
		var title = $this_.parent().find('dt').text().trim().replace('*', '');
		title = title.substring(0, title.length-1);

		var colums = $this_.attr('edit-attr');
		colums = formatToComma(colums); // 转义字符
		var columArr = colums.split('|');
		var editName = columArr[3];
		var showType = columArr[1];
		var name=columArr[0];
		var oldValue = $this_.parent().find('#J_detail_'+name).text();
		var unit = $this_.parent().find('dd').find('.unit').text();

		if(lease_edit_permission) {
			commonContainer.modal(
				'修改' + title,
				$('#J_editcommonLayer'),
				function(index, layero) {
					
					validate = $('#J_editcommonForm').validate({
						rules:validatorRule
					}).form();
					if(!validate) return false;
					if($("#bedroom").val()==0&&$("#livingroom").val()==0){
	            		commonContainer.alert("存在不合规数据，室或厅必须有一项大于1！");
						  return;
	            	}
					var postParam = $('#J_editcommonForm').updateSerializeObject();
					postParam.housesid = houseId;
					postParam.trace = getTrace(showType, title, oldValue, editName, unit);
					if(postParam.freetimeTypeId==5&&$("#freetime").val()==''){
                        commonContainer.alert("具体时间的录入！");
                        return;
					}
					postParam = formatPostParam(postParam);
                    commonContainer.showLoading();
					// 请求URL及必要参数
					var url = basePath + '/house/main/modifyhouse';
					/*if ($.inArray(editName, basicInfoArr) == -1) {
						url = basePath + '/customer/main/updatedemandinfo.htm';
						postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
					}*/

					jsonPostAjax(
						url,
						postParam,
						function(result) {
                            commonContainer.hideLoading();
		//					$this_.parent().find('dd').html(getNewValue(showType, editName, unit));
							layer.msg('修改成功');
							layer.close(index);
							location.reload();
						}
					)
				},
				{
					success: function() {
						if($("#J_newcommonLabel").closest(".form-group").hasClass("has-error")){
							$("#J_newcommonLabel").closest(".form-group").removeClass("has-error");
						}
						
						editWidget(houseId, $this_);
					},
					area:["800px",'300px']
				
				}
			)
		}
	})
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
	var colums = $container.attr('edit-attr');
	colums = formatToComma(colums); // 转义字符
	
	var columArr = colums.split('|');
	var widgetName = columArr[3];	// 当前编辑元素的name
	var showType = columArr[1];		// 展示形式
	var configKeyCode = columArr[2];	// 基础数据的keyCode
	var name=columArr[0];
	var onlyName = columArr[4];	// 当前编辑元素的name
	var oldSelectedValue ='';	// 之前选中的值
	if($container.parent().find('#J_detail_'+name).attr("attr")){
		oldSelectedValue =$container.parent().find('#J_detail_'+name).attr("attr");	// 之前选中的值
	}
	$('#J_newcommonValue').html('');
	var curLabel = $container.parent().find('dt').text().trim().replace('*', '');
	var oldValue = $container.parent().find('#J_detail_'+name).text();
	if(onlyName=='layout' ){
		oldValue=$container.parent().find('dd').text();
	}
    if(onlyName=='buildyear') {
        oldValue = $("#J_detail_buildYear").text();
    }
	var unit = $container.parent().find('dd').find('.unit').text();
	
	$('#J_oldcommonLabel').html('原' + curLabel);
	$('#J_oldcommonValue').text(oldValue+unit);
	$('#J_newcommonLabel').html($container.parent().find('dt').html());
	
	switch(showType) {
		case 'input':
			var html = '<div class="col-sm-4">' +
							'<input id="' + widgetName + '" name="' + widgetName + '" type="text" class="form-control" value="' + oldSelectedValue + '">' +
						'</div>' +
						'<label class="control-label">' + unit + '</label>'; // 区间单位
			$('#J_newcommonValue').html(html);
			break;
		
		case 'radio':
			dimContainer.buildDimRadio($("#J_newcommonValue"), widgetName, configKeyCode, oldSelectedValue);
			break;
		  
		case 'checkbox':
			dimContainer.buildDimCheckBox($("#J_newcommonValue"), widgetName, configKeyCode, oldSelectedValue);
			break;
			
		case 'select':
			
			if(widgetName=='cashMonthNum'){
				var html = '<div class="col-sm-1"><label class="control-label">押</label></div>'+
					'<div class="col-sm-8">' +
					'<select id="' + widgetName+ '" name="' + widgetName + '" class="form-control J_chosen m-b" data-placeholder="请选择">' +
						'<option value="">请选择</option>' +
					 '</select></div>' +
					'<label class="control-label">' + unit + '</label>'; // 区间单位';
				$('#J_newcommonValue').html(html);
				commonContainer.initChosen($("#"+widgetName));
				var options='<option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>'
					$("#" + widgetName).append(options);
					$('#cashMonthNum').val(oldSelectedValue);
					$("#"+widgetName).trigger("chosen:updated");
			}else if(widgetName=='buildyear'){
				var html = '<div class="col-sm-8"><select id="' + widgetName+ '" name="' + widgetName + '" class="form-control J_chosen m-b" data-placeholder="请选择">' +
				'<option value="">请选择</option>' +
				'</select></div><div class="col-sm-2 control-label text-left">' + unit + '</div>'
				$('#J_newcommonValue').html(html);
				commonContainer.initChosen($("#"+widgetName));
				var options='';
				for(var j=2017;j>=1900;j--){
					options+='<option value="'+j+'">'+j+'</option>';
				}				
				$("#" + widgetName).append(options);
				$('#buildyear').val(oldValue);
				$("#"+widgetName).trigger("chosen:updated");
			}else if(widgetName=='freetimeTypeId'){
				var html ='<div class="col-sm-6">' +
				'<select id="' + widgetName+ '" name="' + widgetName + '" class="form-control J_chosen m-b" data-placeholder="请选择">' +
					'<option value="">请选择</option>' +
				 '</select></div>' +
				 '<div class="col-sm-6 freetime" style="display:none">' +
					'<input type="text" id="freetime" name="freetime" class="form-control"></div>'
                $('#J_newcommonValue').html(html);
				 if(oldSelectedValue!=5){
					 $(".freetime").css({"display":"none"});
						dimContainer.buildDimChosenSelector($("#" + widgetName), configKeyCode, oldSelectedValue);
				 }else{
					 $(".freetime").css({"display":"block"});
					 var oldSelectedValueTime;
						if($container.parent().find('#J_detail_'+name).attr("attr")){
							oldSelectedValueTime =$container.parent().find('#J_detail_'+name).attr("attrTime");	// 之前选中的值
						}
					dimContainer.buildDimChosenSelector($("#" + widgetName), configKeyCode, oldSelectedValue);
					$("#freetime").val(oldSelectedValueTime)
				 }
			}else if(onlyName=='layout'){
				var html = '<div class="col-sm-12">'
					html+='<div class="col-sm-2">'
					html+='<div class="col-xs-8">'
					html+='<select id="bedroom" name="bedroom" class="J_chosen form-control layout" data-placeholder="请选择">'
					html+='</select>'
					html+='</div>'
					html+='<div class="col-xs-4">'
					html+='<label class="control-label">室</label>'
					html+='</div>'
					html+='</div>'
					html+='<div class="col-sm-2">'
					html+='<div class="col-xs-8">'
					html+='<select id="livingroom" name="livingroom" class="J_chosen form-control layout" data-placeholder="请选择"></select>'
					html+='</div>'
					html+='<div class="col-xs-4">'
					html+='<label class="control-label">厅</label>'
					html+='</div>'
					html+='</div>'
					html+='<div class="col-sm-2">'
					html+='<div class="col-xs-8">'
					html+='<select id="kitchen" name="kitchen" class="J_chosen form-control layout" data-placeholder="请选择"></select>'
					html+='</div>'
					html+='<div class="col-xs-4">'
					html+='<label class="control-label">厨</label>'
					html+='</div>'
					html+='</div>'
			
					html+='<div class="col-sm-2">'
					html+='<div class="col-xs-8">'
					html+='<select id="toilet" name="toilet" class="J_chosen form-control layout" data-placeholder="请选择">'
					html+='</select>'
					html+='</div>'
					html+='<div class="col-xs-2">'
					html+='<label class="control-label">卫</label>'
					html+='</div>'
					html+='</div>'
					html+='<div class="col-sm-2">'
					html+='<div class="col-xs-8">'
					html+='<select id="balcony" name="balcony" class="J_chosen form-control layout" data-placeholder="请选择">'
					html+='</select>'
					html+='</div>'
					html+='<div class="col-xs-2">'
					html+='<label class="control-label">阳</label>'
					html+='</div>'
					html+='</div>'
			
					html+='</div>'				
				$('#J_newcommonValue').html(html);
				var str;
				for(var i=0;i<21;i++){
					str+='<option value="'+i+'">'+i+'</option>';
				}
				$(".layout").append(str);
				$('#bedroom').val($("#J_detail_bedRoom").text());
				$('#livingroom').val($("#J_detail_livingRoom").text());
				$('#kitchen').val($("#J_detail_kitchen").text());
				$('#toilet').val($("#J_detail_toilet").text());
				$('#balcony').val($("#J_detail_balcony").text());
				$container.trigger("chosen:updated");
				
			}else{
				var html = '<select id="' + widgetName+ '" name="' + widgetName + '" class="form-control m-b" data-placeholder="请选择">' +
				'<option value="">请选择</option>' +
				'</select>'
				$('#J_newcommonValue').html(html);
				dimContainer.buildDimChosenSelector($("#" + widgetName), configKeyCode, oldSelectedValue);
			}
			break;
			
		case 'textarea':
			var html = '<textarea id="' + widgetName + '" name="' + widgetName + '" rows="3" cols="100%" class="form-control"></textarea>';
			$('#J_newcommonValue').html(html);
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
			$('#J_newcommonValue').html(html);
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
			$('#J_newcommonValue').html(html);
			dimContainer.buildDimChosenSelector($("#" + widgetNameArr[0]), configKeyCode, oldSelectedValueArr[0]);
			dimContainer.buildDimChosenSelector($("#" + widgetNameArr[1]), configKeyCode, oldSelectedValueArr[1]);
			break;
			
		case 'date':
            var html;
			if(onlyName=='houseCodeDate'){
                html = '<input id="' + widgetName + '" name="' + widgetName + '" class="form-control w120" value="' + oldSelectedValue + '" onclick="laydate({istime: false,max: laydate.now() , format: \'YYYY-MM-DD\'})">';
			}else{
			 html = '<input id="' + widgetName + '" name="' + widgetName + '" class="form-control w120" value="' + oldSelectedValue + '" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})">';
            }
			$('#J_newcommonValue').html(html);
			break;
			
		case 'nationality':
			var html = '<select id="' + widgetName+ '" name="' + widgetName + '" class="form-control m-b" data-placeholder="请选择">' +
						'<option value="">请选择</option>' +
				   '</select>';
			$('#J_newcommonValue').html(html);
			selectNational($("#" + widgetName), oldSelectedValue);
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
		
		case 'date':
			value = $('#'+editName).val();
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
			if(editName=='furnitureId'){
				$.each(selectedItem, function(n, v) {
					newValue += $(v).parent().find('label').text()+':'+$(".num").eq(n).val()+ '、';
				})
			}else{
				$.each(selectedItem, function(n, v) {
					newValue += $(v).parent().find('label').text();
				})
			}
			
			break;
			
		case 'select':
			if($('#'+editName).val()!=''){
				newValue = $('#'+editName).find("option:selected").text();
			}else{
				newValue ='';
			}
			
			break;
			
		case 'textarea':
			newValue = $('#'+editName).val();
			break;
			
		case 'date':
			newValue = $('#'+editName).val();
			break;
		
		case 'nationality':
			newValue = $('#'+editName).find("option:selected").text();
			break;
	}
	
	if (newValue == '') newValue = '空';
	if(editName=='cashMonthNum'){
		if (newValue != '空'){ 
			newValue = "押"+newValue+"月";
		}
		if(oldValue!='空'){
			oldValue="押"+oldValue+"月";
		}
		trace = '修改' + title + '，修改前为：' + oldValue + '，修改后为：' + newValue;
	}else if(title=='户型'){
		oldValue=$("#J_oldcommonValue").text();
		newValue=$("#bedroom").val()+"室"+$("#livingroom").val()+"厅"+$("#kitchen").val()+"厨"+$("#toilet").val()+"卫"+$("#balcony").val()+"阳";
		trace = '修改' + title + '，修改前为：' + oldValue + '，修改后为：' + newValue;
	}else if(editName=='freetimeTypeId'){
		if (newValue =='固定日期'){ 
			newValue=$('#J_editcommonForm #freetime').val();
		}
		trace = '修改' + title + '，修改前为：' + oldValue + '，修改后为：' + newValue;
	}else{
		trace = '修改' + title + '，修改前为：' + oldValue+unit + '，修改后为：' + newValue+unit;
	}
	return trace;
}
//将分隔符##全部转换成英文逗号
function formatToComma(value) {
	var reg = new RegExp('##', 'g');
	value = value.replace(reg, ',');
	
	return value;
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
function formatPostParam(postParam) {
	// 格式化方便看房时间
	if (postParam.headingId != undefined) {
		postParam.headingId = formatArrayToStringParam(postParam.headingId);
	}
	// 格式化家具
	if (postParam.furnitureId != undefined) {
		postParam.furnitureId = formatArrayToStringParamequ(postParam.furnitureId);
	}
	if (postParam.equipmentId != undefined) { 
		postParam.equipmentId = formatArrayToStringParam(postParam.equipmentId);
	}

	

	return postParam;
}
function formatArrayToStringParamequ(param) {
	var newParam = '';
	if ($.isArray(param)) {
		if (param.length > 0) {
			newParam = '##';
			$.each(param, function(n, v) {
				newParam += v +':'+$(".num").eq(n).val()+ '##';
			})
		}
	} else {
		if (param.trim() != '') {
			newParam = '##';
			newParam = param  +':'+$(".num").eq(0).val()+ '##';
		}
	}
	
	return newParam;
}
$(document).on("click","input[name='furnitureId']",function(){
	if($(this).is(":checked")){
		var str='<div class="label-num"><input type="text" value="1" id="num_'+$(this).attr('id')+'" name="num_'+$(this).attr('id')+'" class="form-control num"></div>'
			$(this).closest(".checkbox").append(str);
		
		/*if($("input[name='furnitureId']").length==$("input[name='furnitureId']:checked").length){
			$("#checkAll-furniture").prop("checked","true");
		}*/
	}else{
		$(this).closest(".checkbox").children('.label-num').remove();
		/*$("#checkAll-furniture").removeAttr("checked"); */
	}
})