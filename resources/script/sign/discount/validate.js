//校验器

/*
 * 校验字段
monthAccumulationFund:{
    required: true,
    stringCheckz : true
	number:true,
	decimal: true,
	min:0,
	number:true,
	decimal: true,
	min:0,
	comparemaxPrice: ".J_maxPrice"
}
*/

var contractValidatorRule = {
		contractcode: {//合同名称
            required: true,
        },
        ownerbrokfixcomm:{//业主居间佣金（公司规定）
			required: true, 
        	number:true,
		},
		ownerbrokcomm:{//业主居间佣金（合同规定）
			required: true,
        	number:true,
		},
		ownerperffixcomm:{//业主履约佣金（公司规定）
			required: true,
        	number:true,
		},
		ownerperfcomm:{//业主履约佣金（合同规定）
			required: true,
        	number:true,
		},
		ownertotalcost_company:{//业主佣金合计（公司规定）
			required: true,
        	number:true,
		},
		ownertotalcost_contract:{//业主佣金合计（合同约定）
			required: true,
        	number:true,
		},
		customerbrokfixcomm:{//客户居间佣金（公司规定）
			required: true, 
        	number:true,
		},
		customerbrokcomm:{//客户居间佣金（合同规定）
			required: true,
        	number:true,
		},
		customerperffixcomm:{//客户履约佣金（公司规定）
			required: true,
        	number:true,
		},
		customerperfcomm:{//客户履约佣金（合同规定）
			required: true,
        	number:true,
		},
		customertotalcost_company:{//客户佣金合计（公司规定）
			required: true,
        	number:true,
		},
		customertotalcost_contract:{//客户佣金合计（合同约定）
			required: true,
        	number:true,
		},
		chargebacktype:{//打折原因
			required: true,
		},
		situationexplain:{//折扣原因：情况说明
			required: true,
			maxlength:500
		},
		/*ownerbrokdisc:{//业主居间折扣
			trueNumber:$("#J_edit_ownerbrokdisc").val(),
		},
		ownerperfdisc:{//业主履约折扣
			trueNumber:$("#J_edit_ownerperfdisc").val(),
		},
		ownertotal_discount:{//业主总折扣
			trueNumber:$("#J_ownertotal_discount").val(),
		},
		customerbrokdisc:{//客户居间折扣
			trueNumber:$("#J_edit_customerbrokdisc").val(),
		},
		customerperfdisc:{//客户履约折扣
			trueNumber:$("#J_edit_customerperfdisc").val(),
		},
		customertotal_discount:{//客户总折扣
			trueNumber:$("#J_customertotal_discount").val(),
		},*/
		totaldiscount:{//总折扣
			trueNumber:$("#J_edit_totaldiscount").val(),
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
	return validate;
}
//自定义validate验证输入的数字不能大于10不能小于0
jQuery.validator.addMethod("trueNumber",function(value, element){
    var returnVal = true;
    inputval=Number(value);
    //if(inputval>=100 || inputval<0){
    if(inputval>=10 || inputval<0){
        returnVal = false;
        return false;
    }
    return returnVal;
//},"小数点后最多为两位");
}, $.validator.format("折扣值不能大于10，请重新输入佣金!"));//验证错误信息