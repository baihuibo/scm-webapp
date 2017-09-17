var housedetailValidateRule={
		idCard:{
		required: true,
		isIdCardNo:{
			depends: function(element) {  
				if($(element).closest('td').prev('th').prev('td').find('select  option:selected').text()=='居民身份证'){
					return true;
					}
				}
			}
		},
		NidCard:{
			isIdCardNo:{
				depends: function(element) {  
					if($(element).closest('td').prev('th').prev('td').find('select').val()=='1'){
						return true;
						}
					}
				}
			},
	/*idCardTypeId:{
		required: true,
	}*/
}


function housedetailValidate(){
	validate = $('#retrievalform').validate({
		rules:housedetailValidateRule
	}).form();
	if(!validate) return false;
	return validate;	
}

//身份证号码验证（加强验证）  
jQuery.validator.addMethod("isIdCardNo", function (value, element) {  
  return this.optional(element) || /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value);  
}, "请正确输入身份证号码"); 

//手机号码验证  
jQuery.validator.addMethod("isMobile", function (value, element) {  
  var length = value.length;  
  var mobile = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;  
  return this.optional(element) || (length == 11 && mobile.test(value));  
}, "请正确填写手机号码");  

 








 





 

  