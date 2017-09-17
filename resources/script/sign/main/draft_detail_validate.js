if ($.validator) {
	$.validator.setDefaults({
		ignore: ":hidden:not(select)",
		highlight : function(element) {
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            $(element).addClass('ng-invalid');
		},
		success : function(label, element) {
            $(element).removeClass('ng-invalid').addClass('ng-valid');
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
	
      $.validator.prototype.elements = function () {
               var validator = this,
                 rulesCache = {};
 
               // select all valid inputs inside the form (no submit or reset buttons)
       return $(this.currentForm)
       .find("input, select, textarea")
       .not(":submit, :reset, :image, [disabled]")
       .not(this.settings.ignore)
       .filter(function () {
           if (!this.name && validator.settings.debug && window.console) {
               console.error("%o has no name assigned", this);
           }
           //注释这行代码
           // select only the first element for each name, and only those with rules specified
           //if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
           //    return false;
           //}
               rulesCache[this.name] = true;
               return true;
           });
       }
   }
function capitalValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#capital_form').validate({
		rules:capitalValidatorRule
	}).form();
	if(!validate) return false;
	return validate;	
}
var capitalValidatorRule={
	transactionPrice:{
		required: true,
		number:true,
		min:0,
		decimal: true
	},
	mainPrice:{
		required: true,
		number:true,
		min:0,
		decimal: true
	},
	compensationPrice:{
		number:true,
		min:0,
		decimal: true
	},
	deposit:{
		number:true,
		min:0,
		decimal: true
	},
	payType:{
	    required: true
	},
	loanNum:{
		required: true
	},
	payTimes:{
	    required: true
	},
	deliveryConditions:{
	    required: true
	},
	loanAmount:{
		required:{
			depends: function(element) {  
				if(!$(element).attr('readonly')){
				return true;
				}
			}
		},
		number:true,
		min:0,
		decimal: true
	},
	noBatchLoan:{
		required:{
			depends: function(element) {  
				if(!$(element).attr('disabled')){
				return true;
				}
			}
		},
	},
	deliveryConditions:{
	    required: true
	},
	liabilityShift:{
	    required: true
	},
	taxes:{
	    required: true
	},
	taxPayingParty:{
	    required: true
	},
	taxPayingMemo:{
		required:{
			depends: function(element) {  
				if(!$(element).attr('readonly')){
				return true;
				}
			}
		},
	},
	paymentClause:{
	    required: true
	},
	paymenAmount:{
	    required: true,
	    number:true,
		min:0,
		decimal: true
	},
	condition:{
		required:{
			depends:function(element){
				var value=$('select[name="payType"]').val();
				if(value==1){
					if($(element).closest('td').prev().find('select').val()==4){
						return true;
					}
					
				}else{
					if($(element).closest('td').prev().find('select').val()==6){
						return true;
					}
				}
			}
		}
	},
	transferWay:{
	    required: true
	},
}
function houseValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#form2').validate({
		rules:houseValidatorRule
	}).form();
	if(!validate) return false;
	return validate;
}
//校验器
var houseValidatorRule = {
housingType:{
    required: true
},
housingDistrictId:{
	required: true
},
housingTownId:{
	required: true
},
housingAddr:{
	required: true
},
restrictedPurchase:{
	required: true
},
ownerOnlyHousing:{
	required: true
},

fullFiveYears:{
	required: true
},
fullFiveGist:{
	required:{
		depends: function(element) {  
			if($('input[name="fullFiveYears"]:checked').val()==1){
			return true;
			}
		}
	}
},
fullFiveMemo:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
totalFloor:{
	required: true,
	number:true,
	min:0,
	digits:true,
},
upperFloors:{
	required: true,
	number:true,
	min:0,
	digits:true,
},
underFloors:{
	required: true,
	number:true,
	min:0,
	digits:true,
},
buildingTotal:{
	required: true,
	number:true,
	min:0,
	digits:true,
},
buildArea:{
	required: true,
	number:true,
	min:0,
	decimal: true
},
designUsesId:{
	required: true
},
otherUses:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
carPort:{
	required: true
},
carPortNumber:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
carPortLocation:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
certificateNum:{
	required: true
},

unitName:{
	required: true
},
isHouseLease:{
	required: true
},
useingMode:{
	required: true
},
useingModeother:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
isLandCertificate:{
	required: true
},
houseProperty:{
	required: true
},
housePropertyother:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
houseCharge:{
	required: true
},
}
var serviceValidatorRule={
		middlemanNameFirst:{
		    required: true
		},	
		cerificateCodeFirst:{
		    required: true
		},
		middlemanNameSecond:{
		    required: true
		},
		cerificateCodeSecond:{
		    required: true
		},
		chargeObject:{
		    required: true
		},
		
		ownBrokerageReceived:{
		    required: true
		},
		ownPerformanceReceived:{
		    required: true
		},
		ownTotalReceived:{
		    required: true
		},
		cusBrokerageReceived:{
		    required: true
		},
		cusPerformanceReceived:{
		    required: true
		},
		cusTotalReceived:{
		    required: true
		},
		discountReason:{
		    required: true
		},
		discountEmployeesId:{
		    required: true
		},
		discountContract:{
		    required: true
		},
		situationExplain:{
		    required: true
		},
		buildingCheck:{
		    required: true
		},
		houseCheckMemo:{
			required:{
				depends: function(element) { 
					var flag=0;
					$("input[name='buildingCheck']:checked").each(function(){ 
						if($(this).val()==5){
							flag=1;
						}					
					})
					if(flag==1){
						return true;
					}
				}
			}
		},
	}
function detailValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#detail_form').validate({
		rules:detailValidatorRule
	}).form();
	if(!validate) return false;
	return validate;	
}
function agentValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#agent_form').validate({
		rules:contractValidatorRule
	}).form();
	if(!validate) return false;
	return validate;
}
function basicValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#basic_form').validate({
		rules:houseValidatorRule
	}).form();
	if(!validate) return false;
	return validate;
}
function ownershipValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#ownership_form').validate({
		rules:houseValidatorRule
	}).form();
	if(!validate) return false;
	return validate;	
}
function unpritableValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#unpritable_form').validate({
		rules:unpriValidatorRule
	}).form();
	if(!validate) return false;
	return validate;	
}
function serviceChargeValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select),sign-checkbox" });

	validate = $('#serviceCharge_form').validate({
		rules:serviceValidatorRule
	}).form();
	if(!validate) return false;
	return validate;
}
/*function capitalValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#capital_form').validate({
		rules:houseValidatorRule
	}).form();
	if(!validate) return false;
	return validate;	
}*/
function intermediaryValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#intermediary_form').validate({
		rules:serviceValidatorRule
	}).form();
	if(!validate) return false;
	return validate;	
}
//校验器
var houseValidatorRule = {
housingType:{
    required: true
},
housingDistrictId:{
	required: true
},
housingTownId:{
	required: true
},
housingAddr:{
	required: true
},
restrictedPurchase:{
	required: true
},
ownerOnlyHousing:{
	required: true
},

fullFiveYears:{
	required: true
},
fullFiveGist:{
	required: true
},
fullFiveMemo:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
totalFloor:{
	required: true,
	number:true,
	min:0,
	digits:true,
},
upperFloors:{
	required: true,
	number:true,
	min:0,
	digits:true,
},
underFloors:{
	required: true,
	number:true,
	min:0,
	digits:true,
},
buildingTotal:{
	required: true,
	number:true,
	min:0,
	digits:true,
},
buildArea:{
	required: true,
	number:true,
	min:0,
	decimal: true
},
designUsesId:{
	required: true
},
otherUses:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
carPort:{
	required: true
},
carPortNumber:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
carPortLocation:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
certificateNum:{
	required: true
},

unitName:{
	required: true
},
isHouseLease:{
	required: true
},
useingMode:{
	required: true
},
certificateMemo:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
landCertificate:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},	
},
/*certificateMemo:{
	required: true
},*/
houseProperty:{
	required: true
},
otherHouse:{
	required:{
		depends: function(element) {  
			if(!$(element).attr('readonly')){
			return true;
			}
		}
	},
},
houseCharge:{
	required: true
},
}
//校验器
var contractValidatorRule = {
entrustedTransfer:{
    required: true
},
ownerType:{
    required: true
},
firstPurchase:{
    required: true
},
name:{
    required: true
},
cardType:{
	required: true
},
idcardNum:{
	required: true
},
adress:{
	required: true
},
phone:{
	required: true
},
warrantNumber:{
	required: true
},
}
var detailValidatorRule={
	belonguserid:{
	    required: true
	},		
}
function contractValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#form1').validate({
		rules:contractValidatorRule
	}).form();
	if(!validate) return false;
	return validate;
}
//校验器
var contractValidatorRule = {

entrustedTransfer:{
    required: true
},
ownerType:{
    required: true
},
firstPurchase:{
    required: true
},
name:{
    required: true
},
adress:{
	required: true
},
phone:{
	required: true
},
warrantNumber:{
	required: true
},
}


var unpriValidatorRule={
		continuousOrder:{
			required: true
		},
		continuousOrderNum:{
			required:{
				depends: function(element) {  
					if(!$(element).attr('readonly')){
					return true;
					}
				}
			},
		},
		mortgagePayments:{
			required: true
		},
		mortgagePaymentsMemo:{
			required:{
				depends: function(element) {  
					if(!$(element).attr('readonly')){
					return true;
					}
				}
			},
		},
		buyHouseQualification:{
			required: true
		},
		qualificationMemo:{
			required:{
				depends: function(element) {  
					if(!$(element).attr('readonly')){
					return true;
					}
				}
			},
		},
}
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

//字母数字  
jQuery.validator.addMethod("alnumAndchcharacter", function (value, element) {  
return this.optional(element) || /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value);  
}, "只能包括汉字、英文字母和数字"); 
//护照编号验证
jQuery.validator.addMethod("passport", function(value, element) {
return this.optional(element) || checknumber(value);
}, "请正确输入您的护照编号");