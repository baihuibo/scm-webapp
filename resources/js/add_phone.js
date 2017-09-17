/**
 * 添加/编辑客源联系方式
 */

// 添加联系方式模态窗
var phoneArr = [];
$(document).delegate('#J_addPhone', 'click', function(event){
	$("#J_phoneType").html('');
	
	commonContainer.modal(
		'添加电话',
		$('#J_addPhoneLayer'),
		function(index, layero) {
			if(phoneArr.length != 0) {
				var arrval = phoneArr.reverse().join(",");
				$("#J_phone").val(arrval);
			}
			layer.close(index);
		}, 
		{
			overflow :true,
			area : ['500px','300px'],
			btns : [ '确定'],
			success: function(){
				$("#J_phoneInput").val('');
				$("#J_dataTablePhone tbody").html('');
				dimContainer.buildDimChosenSelector($("#J_phoneType"), "phoneType", "1");
			}
		}
	);
})

// 添加联系方式
$(document).delegate('#J_insertPhone', 'click', function(event){
	var phone = $("#J_phoneInput").val().trim();
	if(phone != ''){	
		if($("#J_phoneType").val() == 1){
			var isMob=/^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
			if(!isMob.test(phone)){
				commonContainer.alert("手机号格式不正确");
				return false;
			}
		}else if($("#J_phoneType").val() == 2){
			var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
			 if(!isPhone.test(phone)){
				 commonContainer.alert("座机号格式不正确");
				return false;
			}
		}
		
		if($.inArray(phone, phoneArr) == -1){
			var str='<tr><td>'+phone+'</td><td><a class="btn-bitbucket"><i id="J_removePhone" class="glyphicon glyphicon-remove"></i></a></td></tr>';
			$("#J_dataTablePhone tbody").append(str);
			phoneArr.push(phone);
			$("#J_phoneInput").val('');
		}else{
			commonContainer.alert("此电话号已输入");
		}
	}else{
		commonContainer.alert("电话号不允许为空");
	}
})

// 删除联系方式
$(document).delegate('#J_removePhone', 'click', function(event){
	// 获取当前联系方式
	var curPhone = $(this).closest('tr').find('td:first').text();
	// 删除当前行
	$(this).closest('tr').remove();
	// 删除当前联系方式
	phoneArr.splice($.inArray(curPhone, phoneArr), 1);
})