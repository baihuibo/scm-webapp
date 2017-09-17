//校验器

/*var contractValidatorRule={
		customerName: {  
            required: true,
            stringCheckz : true
        },
        monthAccumulationFund:{
        	number:true,
        	decimal: true,
        	min:0,
        }
};*/

var contractValidatorRule = {
		contractcode: {//合同名称
            required: true,
        	//number:true,
        	//decimal: true,
        	//min:0,
        	//comparemaxPrice: ".J_maxPrice"
        },
        ownerbrokfixcomm:{//业主居间佣金（公司规定）
			required: true, 
		},
		ownerbrokcomm:{//业主居间佣金（合同规定）
			required: true,
		},
		ownerperffixcomm:{//业主履约佣金（公司规定）
			required: true,
		},
		ownerperfcomm:{//业主履约佣金（合同规定）
			required: true,
		},
		ownertotalcost_company:{//业主佣金合计（公司规定）
			required: true,
		},
		ownertotalcost_contract:{//业主佣金合计（合同约定）
			required: true,
		},
		customerbrokfixcomm:{//客户居间佣金（公司规定）
			required: true, 
		},
		customerbrokcomm:{//客户居间佣金（合同规定）
			required: true,
		},
		customerperffixcomm:{//客户履约佣金（公司规定）
			required: true,
		},
		customerperfcomm:{//客户履约佣金（合同规定）
			required: true,
		},
		customertotalcost_company:{//客户佣金合计（公司规定）
			required: true,
		},
		customertotalcost_contract:{//客户佣金合计（合同约定）
			required: true,
		},
		situationexplain:{//折扣原因：情况说明
			required: true,
		}		
};

function contractValidate(){
	var validate = true;

	//折扣信息
	validate = $('#J_discountForm').validate({
		rules:contractValidatorRule
	}).form();
	if(!validate) return false;
	
	if($('input[name="chargeobject"]:checked').length==0){
		commonContainer.alert("请选择服务费收取对象");
		return false;
	}
	//客户信息
	//var chk_value =[]; 
/*	$('input[name="demandType"]:checked').each(function(){ 
		//chk_value.push($(this).val()); 
		if($(this).val()==1||$(this).val()==6||$(this).val()==7){
			validate = $('#form'+$(this).val()).validate({
				rules:houseValidatorRule,
				focusInvalid:true
			}).form();
			if(!validate) return false;			
		}
	}); */	

	//我家需求
	/*if(validate==true){
		validate = $('#ourform').validate({
			rules:ourValidatorRule
		}).form();
		if(!validate) return false;
	}	*/
	return validate;
}

//比较层高
jQuery.validator.addMethod("compareLayer", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var before = ele.val();
	var after = value; 	
	if(before!=''&&after!=''){
		var decimal = /^-?\d+(\.\d{1,2})?$/;  
		if(decimal.test(ele.val())){
			var val=(Number(before) < Number(after));
			if(val!=false){
				$(param).siblings("#"+$(param).attr('name')+"-error").remove();
			}
			return val;
		}else{
			return true;
		}
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}
}, $.validator.format("存在不符合规则的数据！")); 
jQuery.validator.addMethod("compareLayerAfter", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var after = ele.val();
	var before = value; 	
	if(before!=''&&after!=''){
		var decimal = /^-?\d+(\.\d{1,2})?$/;  
		if(decimal.test(ele.val())){
			var val=(Number(before) < Number(after));
			if(val!=false){
				$(param).siblings("#"+$(param).attr('name')+"-error").remove();
			}
			return val;
		}else{
			return true;
		}
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}
}, $.validator.format("存在不符合规则的数据！")); 