//校验器
var personValidatorRule = {
    customerName: {
        required: true,
        stringCheckz: true
    }
};
var ourValidatorRule = {
    sourceId: {
        required: true
    },
    customerFinalAssessmentId: {
        required: true
    }
};
var houseValidatorRule = {
    minPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxPrice: ".J_maxPrice"
    },
    maxPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparePrice: ".J_minPrice"
    },
    minArea: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxArea: ".J_maxArea"
    },
    maxArea: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareArea: ".J_minArea"
    },
    bedRoom1: {
        required: true,
        /*compareApartmentAfter: ".J_bedRoom2"*/
    },
    bedRoom2: {
        required: true,
        /*compareApartment: ".J_bedRoom1" */
    },
    rentTime: {
        number: true,
        min: 0,
        maxlength: 9,
        decimal: true,
    }
};
var shopsValidatorRule = {
    minPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxPrice: ".J_maxPrice"
    },
    maxPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparePrice: ".J_minPrice"
    },
    minArea: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxArea: ".J_maxArea"
    },
    maxArea: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareArea: ".J_minArea"
    },
    minPropertyFee: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxPropertyFee: ".J_maxPropertyFee"
    },
    maxPropertyFee: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareWuguan: ".J_minPropertyFee"
    },
    minDoorWidth: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxDoorWidth: ".J_maxDoorWidth"
    },
    maxDoorWidth: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareWide: ".J_minDoorWidth"
    },
    minFloorHeight: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxFloorHeight: ".J_maxFloorHeight"
    },
    maxFloorHeight: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareLayer: ".J_minFloorHeight"
    },
    rentTime: {
        maxlength: 9,
        number: true,
        min: 0,
    }
};
var officeValidatorRule = {
    minPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxPrice: ".J_maxPrice"
    },
    maxPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparePrice: ".J_minPrice"
    },
    minArea: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxArea: ".J_maxArea"
    },
    maxArea: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareArea: ".J_minArea"
    },
    minPropertyFee: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxPropertyFee: ".J_maxPropertyFee"
    },
    maxPropertyFee: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareWuguan: ".J_minPropertyFee"
    },
    minOfficeSeat: {
        required: true,
        number: true,
        min: 0,
        maxlength: 9,
        digits: true,
        comparemaxOfficeSeat: ".J_maxOfficeSeat"
    },
    maxOfficeSeat: {
        required: true,
        number: true,
        digits: true,
        maxlength: 9,
        comparePeople: ".J_minOfficeSeat"
    },
    rentTime: {
        number: true,
        min: 0,
        maxlength: 9,
    }
};
var parkingValidatorRule = {

    minPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxPrice: ".J_maxPrice"
    },
    maxPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparePrice: ".J_minPrice"
    },
    minSegment: {
        number: true,
        min: 0,
        maxlength: 9,
        digits: true,
    },
    maxSegment: {
        number: true,
        min: 0,
        maxlength: 9,
        digits: true,
        compareParking: ".J_minSegment"
    },
    rentTime: {
        number: true,
        min: 0,
        maxlength: 9,
    },
    exludeNumber: {
        alnumAndchcharacter: true
    },
};
var warehouseValidatorRule = {
    minPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxPrice: ".J_maxPrice"
    },
    maxPrice: {
        required: true,
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparePrice: ".J_minPrice"
    },
    minArea: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxArea: ".J_maxArea"
    },
    maxArea: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareArea: ".J_minArea"
    },
    highbefore: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareHeighAfter: ".J_heightafter"
    },
    heightafter: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareHeigh: ".J_highbefore"
    },
    longbefore: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareLongAfter: ".J_longafter"
    },
    longafter: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareLong: ".J_longbefore"
    },
    minDoorWidth: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        comparemaxDoorWidth: ".J_maxDoorWidth"
    },
    maxDoorWidth: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareWide: ".J_minDoorWidth"
    },
    minHeight: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareTotalHeighAfter: ".J_maxHeight"
    },
    maxHeight: {
        number: true,
        decimal: true,
        min: 0,
        maxlength: 9,
        compareTotalHeigh: ".J_minHeight"
    },
    rentTime: {
        number: true,
        min: 0,
        maxlength: 9,
    },

};

function customerValidate() {
    $.validator.setDefaults({ignore: ":hidden:not(select)"});
    //客户信息
    validate = $('#J_addForm').validate({
        rules: personValidatorRule
    }).form();
    if (!validate) return false;
    //var chk_value =[];
    $('input[name="demandType"]:checked').each(function () {
        //chk_value.push($(this).val());
        if ($(this).val() == 1 || $(this).val() == 6 || $(this).val() == 7) {
            validate = $('#form' + $(this).val()).validate({
                rules: houseValidatorRule,
                focusInvalid: true
            }).form();
            if (!validate) return false;
        } else if ($(this).val() == 2) {
            validate = $('#form' + $(this).val()).validate({
                rules: shopsValidatorRule
            }).form();
            if (!validate) return false;
        } else if ($(this).val() == 3) {
            validate = $('#form' + $(this).val()).validate({
                rules: officeValidatorRule
            }).form();
            if (!validate) return false;
        } else if ($(this).val() == 4) {
            validate = $('#form' + $(this).val()).validate({
                rules: warehouseValidatorRule
            }).form();
            if (!validate) return false;
        } else if ($(this).val() == 5) {
            validate = $('#form' + $(this).val()).validate({
                rules: parkingValidatorRule
            }).form();
            if (!validate) return false;
        }
    });

    //我家需求
    if (validate == true) {
        validate = $('#ourform').validate({
            rules: ourValidatorRule
        }).form();
        if (!validate) return false;
    }
    return validate;
}

//比较人数
jQuery.validator.addMethod("comparePeople", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("comparemaxOfficeSeat", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
//比较价格区间
jQuery.validator.addMethod("comparePrice", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }

}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("comparemaxPrice", function (value, element, param) {
    /*console.log($(element).closest('form').find(param).val());*/
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }

    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
//比较段位区号
jQuery.validator.addMethod("compareParking", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("comparemaxSegment", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
//比较建筑面积
jQuery.validator.addMethod("compareArea", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("comparemaxArea", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));

//比较高
jQuery.validator.addMethod("compareHeigh", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("compareHeighAfter", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
//比较长
jQuery.validator.addMethod("compareLong", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("compareLongAfter", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
//比较总高
jQuery.validator.addMethod("compareTotalHeigh", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));

//字母数字
jQuery.validator.addMethod("alnumAndchcharacter", function (value, element) {
    return /^[\w\s,，]+$/.test(value) || this.optional(element);
}, "只能包括汉字、英文字母和数字");

jQuery.validator.addMethod("compareTotalHeighAfter", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));

//比较物管费
jQuery.validator.addMethod("compareWuguan", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("comparemaxPropertyFee", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
//比较门宽
jQuery.validator.addMethod("compareWide", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("comparemaxDoorWidth", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
//比较层高
jQuery.validator.addMethod("compareLayer", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
jQuery.validator.addMethod("comparemaxFloorHeight", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var decimal = /^-?\d+(\.\d{1,2})?$/;
        if (decimal.test(ele.val())) {
            var val = (Number(before) <= Number(after));
            if (val != false) {
                $(param).siblings("#" + $(param).attr('name') + "-error").remove();
            }
            return val;
        } else {
            return true;
        }
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("存在不符合规则的数据！"));
//比较户型不能一致
jQuery.validator.addMethod("compareApartment", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var before = ele.val();
    var after = value;
    if (before != '' && after != '') {
        var val = (!(before == after));
        if (val != false) {
            $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        }
        return val;
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        return true;
    }
}, $.validator.format("户型不能相同!"));

jQuery.validator.addMethod("compareApartmentAfter", function (value, element, param) {
    var ele = $(element).closest('form').find(param);
    var after = ele.val();
    var before = value;
    if (before != '' && after != '') {
        var val = (!(before == after));
        if (val != false) {
            $(param).siblings("#" + $(param).attr('name') + "-error").remove();
        }
        return val;
    } else {
        $(param).siblings("#" + $(param).attr('name') + "-error").remove();
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
jQuery.validator.addMethod("stringCheckz", function (value, element) {
    return this.optional(element) || /^[\u4E00-\u9FA5\w]+$/.test(value);
}, "存在不符合规则的数据！");
//字符验证       
jQuery.validator.addMethod("stringCheck", function (value, element) {
    return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只能包括中文字、英文字母、数字和下划线");
//租期验证       
jQuery.validator.addMethod("dateCheckz", function (value, element) {
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
jQuery.validator.addMethod("english", function (value, element) {
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

/*var personValidatorMsg={
		customerName: {  
            required: "客源姓名不能为空！"
        }
};
var houseValidatorMsg={
		minArea: {
            required: "价格区间不能为空！"
        },
        maxPrice: {
			required: "价格区间不能为空！"
		},
		minArea: {
        	required: "建筑面积不能为空！"
        	
        },
        maxArea: {
        	required: "建筑面积不能为空！"
        }
};*/