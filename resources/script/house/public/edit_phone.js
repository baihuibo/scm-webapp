var arrphone=[];
var type='add';
function editPhone(elem,photoList,type,houseId){
	type=type;
	arrphone=[];
	commonContainer.modal(
			'添加电话',
			$('#J_phone_layer'),
			function(index, layero) {
				if(arrphone.length!=0){
					var phonenum=0;
					for(var i=0;i<arrphone.length;i++){
						var isMob=/^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;								
						if(isMob.test(arrphone[i])){
							phonenum++;
						}
					}
					if(phonenum!=0){
						if(type=='add'){						
							var arrval=arrphone.reverse().join(",");
							elem.text(arrval);
							elem.attr({"china":"china"});
						}else{
							commonContainer.showLoading();
							var arrval=arrphone.reverse().join(",");
							$.ajax({
								url : basePath + '/house/main/updateContact',
								data:{
									"contactId":elem.closest('tr').find('.glyphicon-remove').attr("attr"),
									"houseid": houseId,
									"phones": arrval
									},
								type : 'post',
								dataType : 'json',
								cache : false,
								contentType : "application/json ; charset=utf-8",
								success : function(result) {
									commonContainer.hideLoading();
									if (result.code != '0') {										
										layer.alert(result.msg);
									} else {
										elem.text(arrval);
										elem.attr({"china":"china"});
									}
								}
							})	
							
						}
						layer.close(index);
					}else{
						commonContainer.alert("至少添加一个国内手机号码");
						return false;
					}
					
				}else{
					commonContainer.alert("请添加电话");
					return false;
				}
				
			}, 
			{
				overflow :true,
				area : ['800px','300px'],
				btns : [ '保存'],
				success: function(){
					$("#J_edit_phone").val('');
					$("#J_editphoneType").val('1');
					$('.J_chosen').trigger("chosen:updated");
					$('.remark').hide();
					var str;
					arrphone=[];
					$("#J_phone_dataTable tbody").empty();
					for(var i=0;i<photoList.length;i++){
						 var noPhone = /^[\u4E00-\u9FA5\w\d\-\_]+\-[\u4E00-\u9FA5\w\d\-\_]+$/;
						 var phone=photoList[i];
						if(!noPhone.test(photoList[i])){
							str+='<tr calss="china"><td>'+photoList[i]+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
						}else{
							str+='<tr><td>'+photoList[i]+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
						}						
						arrphone.push(phone);
					}				
					$("#J_phone_dataTable tbody").append(str);
					
				}
			});
}
function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}

$(document).delegate('#J_phone_dataTable .glyphicon-remove', 'click', function(event){
	removeByValue(arrphone, $(this).closest('tr').children('td').text());
	$(this).closest('tr').remove();		
})
$(document).delegate('#J_add_call', 'click', function(event){
	var phone=$("#J_edit_phone").val().trim();
	if(phone!=''){	
		if($("#J_phone_dataTable tbody tr").length>=10){
			commonContainer.alert("电话号最多输入10个,禁止再添加！");
			return false;
		}
		if($("#J_editphoneType").val()==1){
		    var isMob=/^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
			if(!isMob.test(phone)){
				commonContainer.alert("手机号格式不正确");
				return false;
			}
		}else if($("#J_editphoneType").val()==2){
			 var isPhone = /^([0-9]{3,4}-)[0-9]{7,8}$/;
			 if(!isPhone.test(phone)){
				 commonContainer.alert("座机号格式不正确");
				return false;
			}
		}else{
			 var isabroadPhone = /^[\u4E00-\u9FA5\w\d\-\_]+\-[\u4E00-\u9FA5\w\d\-\_]+$/;
			 if(!isabroadPhone.test(phone)){
				 commonContainer.alert("国外手机号格式不正确");
				return false;
			}
		}
		if($.inArray(phone, arrphone)==-1){
			var str;
			if($("#J_editphoneType").val()==1){
				str='<tr class="china"><td>'+phone+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
			}else{
				str='<tr><td>'+phone+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
			}
			$("#J_phone_dataTable tbody").append(str);
			arrphone.push(phone);
			$("#J_edit_phone").val('');
		}else{
			commonContainer.alert("此电话号已输入");
		}
	}else{
		commonContainer.alert("电话号不允许为空");
	}
})