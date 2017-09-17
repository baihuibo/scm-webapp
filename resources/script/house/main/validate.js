var houseeditValidatorRule={
	housesLevel:{
		required: true,
	}
}
//校验器
var houseValidatorRule = {
	spraybuildingname:{
		stringCheckNum:true,
	},
	sprayunitname:{
		stringCheckNum:true,
	},
	sprayfloorname:{
		stringCheckNum:true,
	},
	sprayhouseno:{
		stringCheckNum:true,
	},
	buildingname:{
		stringCheckNum:true,
	},
	unitname:{
		stringCheckNum:true,
	},
	floorname:{
		stringCheckNum:true,
	},
	houseno:{
		stringCheckNum:true,
	},
	buildingothername:{
		stringCheckNum:true,
	},
	unitothersname:{
		stringCheckNum:true,
	},
	floorothername:{
		stringCheckNum:true,
	},
	otherno:{
		stringCheckNum:true,
	},
	 bedroom:{
    	required: true,
    },
    livingroom:{
    	required: true,
    },
    kitchen:{
    	required: true,
    },
    toilet:{
    	required: true,
    },
    balcony:{
    	required: true,
    },
    towards:{
    	required: true,
    },
    totalnum: {
    	required: true,
    	number:true,
    	min:0,
    	digits:true
    },
    houseallfloor:{
    	required: true,
    	number:true,
    	min:1,
    	digits:true
    },
    buildarea:{
    	required: true,
    	number:true,
    	min:1,
    	decimal: true,
    },
    floor:{
    	required:{ 
    		depends: function(element) {  
				if($("#vifloor").is(':visible')){
					  return true;
				}
    		}
    	},
    	number:true,
    },
    buildyear:{
    	required: true,
    },
    buildingstructure:{
    	required: true,
    },
    layoutstructure:{
    	required: true,
    },
    buildingtype:{
    	required: true,
    },
    planneduses:{
    	required: true,
    },
    houseown:{
    	required: true,
    },
    housetype:{
    	required: true,
    },
    floorarea: {
    	required: true,
    	number:true,
    	min:0,
    	decimal: true,
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
    airConditionType:{
    	string:true,
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
};
var peopleValidatorRule={
	contactType:{
    	required: true,
    },
	customerName: {  
        required: true,
        stringCheckz : true
    },
    layoutstructure:{
    	required: true,
    },
    customerPhone:{
    	required: true,    	
    },
    ownership:{
    	required: true,
    },
}
var customerSourceValidatorRule={
	sourceId:{
		required: true,
	},
/*	infoSourceId:{
		required: true,
	}*/
	newdemand:{
		required: true,
	}
}
var housedetailValidateRule={
	usestatus :{
		required: true,
	},	
	/*censuschectoutType:{
		required: true,
	},*/	
}
var housePriceValidateRule={
	pledgeuser: {  
        stringCheckz : true
    },
    loancount:{
    	number:true,
    	min:0,
    	decimal: true,    	
    },
    loanyears:{
    	number:true,
    	min:0,
    	digits:true,
    },
    entrustprice:{
    	required: true,
    	number:true,
    	min:1,
    	decimal: true,    	
    },
    price:{
    	required: true,
    	number:true,
    	min:0,
    	decimal: true,    	
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
    num:{
    	number:true,
    	min:0,
    	digits:true,	
    },
    electric:{
    	required: true,	
    },
    furniture:{
    	required: true,	
    },
    num_furniture1:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furniture"]:checked').each(function(){ 
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
    num_furniture2:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furniture"]:checked').each(function(){ 
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
    num_furniture3:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furniture"]:checked').each(function(){ 
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
    num_furniture4:{
    	required:{
    		depends: function(element) {  
    			var arr =[]; 
    			$('input[name="furniture"]:checked').each(function(){ 
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
    }
}
var housebuyPriceValidateRule={
		pledgeuser: {  
	        stringCheckz : true
	    },
	    loancount:{
	    	number:true,
	    	min:0,
	    	decimal: true,    	
	    },
	    loanyears:{
	    	number:true,
	    	min:0,
	    	digits:true,
	    },
	    certloan:{
	    	required: true,
	    },
		lastbuyprice: { 			
			number:true,
	    	min:0,
	    	decimal: true, 
	    },
	    buyyears:{
	    	required: true,
	    },
	    entrustprice:{
	    	required: true,
	    	number:true,
	    	min:1,
	    	decimal: true,    	
	    },
	    price:{
	    	number:true,
	    	min:0,
	    	decimal: true,  
	    },
	    propertyfee:{
	    	number:true,
	    	min:0,
	    	decimal: true,    	
	    },
	    heatingcost:{
	    	number:true,
	    	min:0,
	    	decimal: true,    	
	    },
	}
var buytoleaseValidateRule={
		statusNow:{
	    	required: true,
	    },
	    price:{
	    	required: true,
	    	number:true,
	    	min:0,
	    	decimal: true, 	    	
	    },
	    furniture:{
	    	required: true,	
	    },
	    equipment:{
	    	required: true,	
	    },
	    num_furniture:{
	    	number:true,
	    	min:0,
	    	digits:true,	
	    }
}
var leasetobuyValidateRule={
	newBuyDemand:{
    	required: true,	
    },
    houseHoldInfo:{
    	required: true,	
    },
    houseHoldEvacuationDate:{
    	required: {
    		depends:function(element){
    			if($("#census").val()==1)return true;
    			
    		}
    	}
    },
    statusNow:{
    	required: true,
    },
    certLoan:{
    	required: true,
    },
    lastBuyprice:{
    	number:true,
    	min:0,
    	decimal: true,    	
    },
    buyYears:{
    	required: true,
    },
    entrustprice:{
    	required: true,
    	number:true,
    	min:1,
    	decimal: true,    	
    },
    price:{
    	number:true,
    	min:0,
    	decimal: true,    	
    },
    propertyFee:{
    	number:true,
    	min:0,
    	decimal: true,    	
    },
    heatingCost:{
    	number:true,
    	min:0,
    	decimal: true,    	
    },
}

function leasetobuyValidate(){
	//$.validator.setDefaults({ ignore: ":hidden" });
	validate = $('#formleasetobuy').validate({
		rules:leasetobuyValidateRule
	}).form();
	if(!validate) return false;
	return validate;	
}
function buytoleaseValidate(){
	validate = $('#formbuytolease').validate({
		rules:buytoleaseValidateRule
	}).form();
	if(!validate) return false;
	return validate;	
}
function housebuyPriceValidate(){
	validate = $('#form5').validate({
		rules:housebuyPriceValidateRule
	}).form();
	if(!validate) return false;
	return validate;	
}
function housePriceValidate(){
	validate = $('#form5').validate({
		rules:housePriceValidateRule
	}).form();
	if(!validate) return false;
	return validate;	
}
function housedetailValidate(){
	validate = $('#form4').validate({
		rules:housedetailValidateRule
	}).form();
	if(!validate) return false;
	return validate;	
}
function housePhysicsValidate(){
	$.validator.setDefaults({ ignore: ":hidden:not(select)" });

	validate = $('#form2').validate({
		rules:houseValidatorRule
	}).form();
	if(!validate) return false;
	return validate;
}
function peopleValidate(){
	validate = $('#addppeople_form').validate({
		rules:peopleValidatorRule
	}).form();
	if(!validate) return false;
	return validate;
}
function customerSourceValidate(){
	validate = $('#form3').validate({
		rules:customerSourceValidatorRule
	}).form();
	if(!validate) return false;
	return validate;	
}
//比较户型不能一致
jQuery.validator.addMethod("compareApartment", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var  before= ele.val();
	var after = value; 	
	if(before!=''&&after!=''){
		var val=(!(before == after));
		if(val!=false){
			$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		}
		return val;
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}
}, $.validator.format("户型不能相同!")); 

jQuery.validator.addMethod("compareApartmentAfter", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var after = ele.val();
	var before = value; 	
	if(before!=''&&after!=''){
		var val=(!(before == after));
		if(val!=false){
			$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		}
		return val;
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}
}, $.validator.format("户型不能相同!")); 
//判断两个值是否相等  
jQuery.validator.addMethod("notEqualTo", function (value, element, param) {  
  return value != $(param).val();  
}, $.validator.format("两次输入不能相同!"));  


//只能输入数字  
jQuery.validator.addMethod("isNum", function (value, element) {  
  var RegExp = /^\d+$/;  
  return RegExp.test(value);  
}, $.validator.format("只能为数字!"));  


//规则名：chinese，value检测对像的值，element检测的对像    
$.validator.addMethod("chinese", function (value, element) {  
  var chinese = /^[\u4e00-\u9fa5]+$/;  
  return (chinese.test(value)) || this.optional(element);  
}, "只能输入中文");  


//规则名：byteRangeLength，value检测对像的值，element检测的对像,param参数    
jQuery.validator.addMethod("byteRangeLength", function (value, element, param) {  
  var length = value.length;  
  for (var i = 0; i < value.length; i++) {  
      if (value.charCodeAt(i) > 127) {  
          length++;  
      }  
  }  
  return this.optional(element) || (length >= param[0] && length <= param[1]);  
}, $.validator.format("请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)"));  


//联系电话(手机/电话皆可)验证  
jQuery.validator.addMethod("isPhone", function (value, element) {  
  var length = value.length;  
  var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;  
  var tel = /^\d{3,4}-?\d{7,9}$/;  
  return this.optional(element) || (tel.test(value) || mobile.test(value));  


}, "请正确填写联系电话");  


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
jQuery.validator.addMethod("stringCheckNum", function(value, element) {       
    return this.optional(element) || /^[a-zA-Z0-9_]*$/.test(value);       
}, "只能包括英文字母、数字和下划线");   
jQuery.validator.addMethod("dateCheckz", function(value, element) {  
    return this.optional(element) || /^[\u4e00-\u9fa50-9]+$/.test(value);       
}, "只能包括中文字、数字！"); 
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
// 判断浮点数value是否大于0
jQuery.validator.addMethod("isFloatGtZero", function(value, element) { 
    value=parseFloat(value);      
    return this.optional(element) || value>0;       
}, "必须大于0"); 