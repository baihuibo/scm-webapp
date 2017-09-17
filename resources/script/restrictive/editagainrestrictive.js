function getUrlParams(name){
     	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg);
 	if(r!=null){
 		return unescape(r[2]);
 	}
 	return null;
 }
 //模糊查询
 searchContainer.searchUserListByComp($("#J_revamp_nextAppvalUserId"), true);
 $.fn.serializeJson=function(){  
     var serializeObj={};  
     var array=this.serializeArray();  
     var str=this.serialize();  
     $(array).each(function(){  
         if(serializeObj[this.name]){  
             if($.isArray(serializeObj[this.name])){  
                 serializeObj[this.name].push(this.value);  
             }else{  
                 serializeObj[this.name]=[serializeObj[this.name],this.value];  
             }  
         }else{  
             serializeObj[this.name]=this.value;   
         }  
     });  
     return serializeObj;  
 };
 
$(function(){
	
	
	
	//获取基本信息
	window.onload=function(){
		$.ajax({
			url : basePath + '/restrictive/editviewrestrictive  ',
			data : {"restrictiveId":getUrlParams('id')},
			type : 'post',
			dataType : 'json',
			cache : false,
			success : function(result) {	
//				console.log(result.data)
				if (result.code == '0') {				
					for(var key in result.data){
						if($("#App_"+key)){
							$("#App_"+key).text (result.data[key]);
						}					
					}
					var  resarr=[];
					for(var reasonId in result.data.reasons){
						resarr.push(result.data.reasons[reasonId].reasonId);						
					}
					var resstr = resarr.toString();
					//判断用户类型
					if(result.data.customerTypeId==1){							
						dimContainer1.buildDimCheckBox1($("#J_revamp_reasons"),"reasons", "1",resstr);//上榜原因业主
					}else if(result.data.customerTypeId==2){							
						dimContainer1.buildDimCheckBox1($("#J_revamp_reasons"),"reasons", "2",resstr);//上榜原因客户
					}			
				} else {
					layer.alert(result.msg);
				}
			}
		});				
	}
})


//提交修改

$("#J_submit").click(function(){
	var id=$("#App_id").text()
	var J_revamp_nextAppvalUserId = $("#J_revamp_nextAppvalUserId").val();
	var remark = $("#J_memo").val();
	if(remark==""){
		layer.alert("请添加备注");
		return false;
	}else if(J_revamp_nextAppvalUserId==""){
		layer.alert("请添加审批人");
		return false;
	}
	var reasons=[];
	$("input[name='reasons']:checked").each(function(){
		var reason={};
		reason.reasonId=$(this).val();
		reasons.push(reason);
	});
	val={};
	val.reasons=reasons;

	val.nextAppvalUserId=$("#J_revamp_nextAppvalUserId").attr("data-id");
	val.id =id;
	val.remark = remark;
	console.log(val)
	jsonPostAjax(basePath + '/restrictive/lockededitsubmitrestrictive ', val, function(result) {
		if(result.data.success){
			layer.alert('操作成功!', {
				yes:function(){
//					commonContainer.closeWindow();
//					window.opener.location.href = window.opener.location.href;//刷新父页面
				}
			});        
		}else{
			commonContainer.alert(result.data.message);
		}

	},{});

	
})





window.dimContainer1 = {
	getDimReqUrl: function() {
		return basePath + '/restrictive/findrestrictivereasons';
	},	
	buildDimCheckBox1: function($container, checkboxName, keyCode, selectedValues) {
	    this.buildDimCheckBoxHasAll1($container, checkboxName, keyCode, selectedValues, null);
	},
	buildDimCheckBoxHasAll1: function($container, checkboxName, keyCode, selectedValues, allItemName) {
		var that = this;
		jsonPostAjax(that.getDimReqUrl(), {'customerTypeId':keyCode}, function(result) {
    	    var items = [];
    	    // push数据
    	   
    		$.each(result.data, function(n, value) {
    			var item = '<div class="checkbox checkbox-primary checkbox-inline">' +
    							'<input type="checkbox" id="' + checkboxName+value.reasonId + '" name="' + checkboxName + '" value="' + value.reasonId + '"><label for="' + checkboxName+value.reasonId + '">' + value.reason + '</label>' +
							'</div>';
    			items.push(item);
    	    })
    	    $container.append(items);
    	    // 选中值处理
    	    var selectedValueArr = selectedValues.split(',');
    		if($.isArray(selectedValueArr) && selectedValueArr.length>0){
    			$.each(selectedValueArr, function(n, value) {
    				$(':checkbox[value="' + value + '"]', $container).prop('checked', 'checked');
	    	    })
    		}
	    	
		})
	},
	
}