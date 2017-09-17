

var housedetailValidateRule={
	customerName :{
		required: true,
	},
	customerTypeId :{
		required: true,
	},
	businessTypeId :{
		required: true,
	},
	houseCardTypeId :{
		required: true,
	},
	houseCard :{
		required: true,
	},
	idCardTypeId:{
		required: true,
	},
	/*idCard:{
		required: true,
			isIdCardNo:{depends: function(element) {
				//var propertytype = $(element).closest('form').parent().parent().attr('data-propertytype')
				if($('#J_idCardType').val()==1)
					return true;
			}
		}
	},*/
	nextAppvalUserId:{
		required: true,
	},
	customerTelephone:{
//		required: true,
		isMobile: true
	},
	reasons:{
		required: true,
	}
}


function housedetailValidate(){
	validate = $('#newform').validate({
		rules:housedetailValidateRule
	}).form();
	if(!validate) return false;
	return validate;	
}
//验证身份证
var J_idCardType=$('#J_idCardType').val();
if(J_idCardType==1){
	
	jQuery.validator.addMethod("isIdCardNo", function (value, element) {  
		  return this.optional(element) || /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value);  
		}, "请正确输入身份证号码");
}
//身份证号验证
//新增提交数据
/*$(document).delegate(
		'#J_submit',
		'click',
		function(){
			
//	console.log(JSON.stringify(val));
})
*/
/*function isCardID(sId){
	 var iSum=0 ;
	 var info="" ;
	 if(!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
	 sId=sId.replace(/x$/i,"a");
	 if(aCity[parseInt(sId.substr(0,2))]==null) return "你的身份证地区非法";
	 sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
	 var d=new Date(sBirthday.replace(/-/g,"/")) ;
	 if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return "身份证上的出生日期非法";
	 for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
	 if(iSum%11!=1) return "你输入的身份证号非法";
	 //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
	 return true;
	}*/
/*//身份证号码验证（加强验证）  
jQuery.validator.addMethod("isIdCardNo", function (value, element) {  
  return this.optional(element) || /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value);  
}, "请正确输入身份证号码"); */

/*//军官证验证（加强验证）  
jQuery.validator.addMethod("isIdCardNo", function (value, element) {  
  return this.optional(element) || /南字第(\d{8})号|北字第(\d{8})号|兰字第(\d{8})号|成字第(\d{8})号|济字第(\d{8})号|广字第(\d{8})号|海字第(\d{8})号|空字第(\d{8})号|参字第(\d{8})号|政字第(\d{8})号|后字第(\d{8})号|装字第(\d{8})号/.test(value);  
}, "请正确输入军官证号码"); 

//护照验证（加强验证）  
jQuery.validator.addMethod("isIdCardNo", function (value, element) {  
  return this.optional(element) || /	^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/.test(value);  
}, "请正确输入护照号码"); 
*/
//手机号码验证  
jQuery.validator.addMethod("isMobile", function (value, element) {  
  var length = value.length;  
  var mobile = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;  
  return this.optional(element) || (length == 11 && mobile.test(value));  
}, "请正确填写手机号码");  

 








 





 

  