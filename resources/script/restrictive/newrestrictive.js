	$(document).on("change",'#J_customerType',function(){
		if($(this).val()==1){
			$('#J_reason').html("");
			$('#J_houseCard').removeAttr("disabled");
			$('#J_houseCardType').removeAttr("disabled");
			$('#J_houseCardType').trigger("chosen:updated");
			dimContainer1.buildDimCheckBox1($("#J_reason"),"reasons", "1","");// 上榜原因业主
		}else if($(this).val()==2){
			$('#J_reason').html("");
			$('#J_houseCardType').val("");
			$('#J_houseCard').val("");
			$('#J_houseCard').attr({"disabled":"disabled"});
			$('#J_houseCardType').attr({"disabled":"disabled"});
			$('#J_houseCardType').trigger("chosen:updated");
			dimContainer1.buildDimCheckBox1($("#J_reason"),"reasons", "2","");// 上榜原因客户
		}else if($(this).val()==''){
			$('#J_reason').html("");
			$('#J_houseCardType').val("");
			$('#J_houseCard').val("");
			$('#J_houseCard').removeAttr("disabled");
			$('#J_houseCardType').removeAttr("disabled");
			$('#J_houseCardType').trigger("chosen:updated");
		}
	})
$(function(){
	
	searchContainer.searchUserListByComp($("#J_createUser"), true);
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
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	})
	
	dimContainer.buildDimChosenSelector($("#J_customerType"), "clientType","");// 客户类型
	dimContainer.buildDimChosenSelector($("#J_businessType"), "businessType","");// 业务类型
	dimContainer.buildDimChosenSelector($("#J_houseCardType"), "HousecertificateType","");// 房产证类型
	dimContainer.buildDimChosenSelector($("#J_idCardType"), "cardType","");//身份证件类型

})
var val={};

// 新增提交数据
$(document).delegate(
		'#J_submit',
		'click',
		function(){
			var J_idCardType=$('#J_idCardType').val();
			var idCard=$('#idCard').val();
		if(!housedetailValidate()||(J_idCardType==1&&idCard=='')){
			commonContainer.alert("存在不符合规则的数据！");
			var idCard=$('#idCard').val();
			var str=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
			if(idCard==''){
				
				$('.error2').css('color','#a94442');
				$('.error2').css('display','block');
				$('.idcard').css('color','#ed5565');
				return false;
				
			}else {
				if(!str.test(idCard)){
					//commonContainer.alert("存在不符合规则的数据！");
					J_idCardType='';
					$('.idcard').css('color','#ed5565');
					$('.error').css('display','block');
					$('.error').css('color','#a94442');
					return false;
				}
			}
			
			return false;
		}else if (!housedetailValidate()){
			commonContainer.alert("存在不符合规则的数据！");
			return false;
		}
	var customerTelephone=$('#customerTelephone').val();
	
	if(customerTelephone!=''){
		var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;  
        var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/; 
        if (customerTelephone.substring(0, 1) == 1) {  
            if (!isMobile.exec(customerTelephone) && customerTelephone.length != 11) {  
            	customerTelephone='';
    			$('.customerTelephone').css('color','red');
    			return 
            }  
        }  
        // 如果为0开头则验证固定电话号码
        else if (customerTelephone.substring(0, 1) == 0) {  
            if (!isPhone.test(customerTelephone)){  
            	customerTelephone='';
    			$('.customerTelephone').css('color','#ed5565');
    			return  
            }  
        } 
	}

	var reasons=[];
	$("input[name='reasons']:checked").each(function(){
		var reason={};
		reason.reasonId=$(this).val();
		reasons.push(reason);
	});
	val=$("#newform").serializeJson();
	val.reasons=reasons;
	val.nextAppvalUserId=$("#J_createUser").attr("data-id");
	jsonPostAjax(basePath + '/restrictive/insertrestrictive', val, function(result) {
		if(result.data.success==true){
			var a = $('<a target="_blank">');
			a.attr('href' ,"../restrictive/viewrestrictives.html?id="+result.data.id);
			a.appendTo('#J_submit');
			a.get(0).click();
			a.remove();
//			$("#J_submit").attr("href","../restrictive/viewrestrictives.html?id="+result.data.id);
			//window.open("../restrictive/viewrestrictives.html?id="+result.data.id);
		//	commonContainer.closeWindow();
		}else{
			commonContainer.alert(result.data.message)
			return false;
		}
		window.location.reload();
	},{});
// console.log(JSON.stringify(val));

})


// 录入人

$.ajax({
			url : basePath + '/restrictive/findusername',
			type : 'get',
			dataType : 'json',
			cache : false,
			success : function(result) {	
// console.log(result.data)
				$("#userName").val(result.data)
			}
		});















































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