//var customerId = getUrlParams("customerId");		
var customerId="";			//需求编号
var clientId="";			//客户编号
var propertytype="";		//物业类型 物业基本信息
var validatorRule,validatorAddRule,validatorRule_Area;

window.onload=function(){
	//J_edit_area
	//$(".nav_tab_ath li").attr("class","");
	//新增 加载
	dimContainer.buildDimChosenSelector($(".J_bedRoom1"), "houseStructure","");//户型
	dimContainer.buildDimChosenSelector($(".J_bedRoom2"), "houseStructure","");//户型
	dimContainer.buildDimCheckBox($(".J_orientation"), "headingIds", "orientation", "");//朝向
	dimContainer.buildDimChosenSelector($(".J_fitmentTypeId"), "housedecorationstatus","");//装修
	dimContainer.buildDimChosenSelector($(".J_layoutStructure"), "layoutStructure","");//户型结构
	dimContainer.buildDimChosenSelector($(".J_equityTypeId"), "houseown","");//产权
	//dimContainer.buildDimChosenSelector($(".J_buildingType"), "buildingType","");//楼体类型
	dimContainer.buildDimCheckBox($(".J_furniture"), "furnitureIds", "furniture", "");//家具
	dimContainer.buildDimCheckBox($(".J_electric"), "electricIds", "electric", "");//家电
	dimContainer.buildDimChosenSelector($(".J_loanTypeId"), "loanType","");//贷款类型
	dimContainer.buildDimChosenSelector($(".J_urgencyTypeId"), "urgency","");//紧急程度
	dimContainer.buildDimRadio($(".J_houseQuantity"), "ownerHouseNumberTypeId", "houseQuantity", "");//几套房
	dimContainer.buildDimCheckBox($("#J_specialNeeds"), "specialDemandIds", "specialNeeds", "");//特殊需求
	dimContainer.buildDimCheckBox($("#J_locationType"), "locationIds", "locationType", "");//位置类型
}

$(document).ready(function(){

    if(!isNotCooperation){// 从转介进入详细页面时 隐藏转介和跟进查看电话
        $('#oper_referral,#oper_followup,#J_checkPhone,#oper_blacklist').hide();
    }
    
	/*
	 * select提示中文
	 * */
	$("select").chosen({
		width : "100%",
		no_results_text: "未找到此选项!" 
	});
	
	/*
	 * 判断，如果是过往需求，则不可修改、新增
	 * <!-- 0过往需求 1当前需求 -->
	 * */
	var iscurrent_ath=$('#J_iscurrent_ath').val();
	if(iscurrent_ath==0){
        buy_edit_permission = false;
	}
	
	customerId=$("#J_customerId").attr("data-customerId");
	clientId=$("#J_customerId").attr("data-clientId");
	
	//显示日志 cijiangbo api
	setisCurrent(customerId,clientId);

	// 显示部门树状结构
    searchDept($('#J_deptName'), true, 'left' , true).then(function () {
        $('#J_deptSelect').off().on('click', function (e) {
            showDeptTree($('#J_deptName'), $('#J_deptLevel'), null, true);// true 表示查询全量组织结构
        });
    });

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
	
	/*jsonGetAjax(
		basePath + '/customer/main/findbuyerclientbycustomerid',
		{
			"customerId": customerId,
		},
		function(result) {
			alert("a");
			console.log(result.data);
			$('#J_customerName_sign').text(result.data.customerName);
			$('#J_customerId').text(customerId);
			$('#J_customername').find("dd").text(result.data.customerName);
			$('#J_gender').find("dd").text(result.data.genderName);//性别
			$('#J_editNationality').find("dd").text(result.data.customerName);//TODO 国籍 待修改
			$('#J_hometown').find("dd").text(result.data.householdTypeName);
		}
	);*/
	
	//加载日期
/*	var reminder_time = {
		elem: '#J_reminder_time',  
	    format: 'YYYY-MM-DD hh:mm',
	    istime: false,
	    choose: function(datas){
	    	//begindate.max = datas
	    }
	}
	laydate(reminder_time);*/
	
	//初始化数据，绑定控件
	//绑定搜索
	searchContainer.searchUserListByComp($("#J_sendee"), true, 'left');
	
	// 更新贷款记录
	loanUpdate('#J_loan');

	// 更新公积金月缴额
	fundUpdate('#J_fund');

	//  1住宅  2平房  3别墅       4车位/车库  5商铺             6写字楼     7厂房/仓库
	//	1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 ,
	/*	propertytype (string): 
	 *  物业类型:1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 ,
	 */
	//更新价格区间
	priceUpdate('#J_pricerange_1',1 );
	priceUpdate('#J_pricerange_2',6 );
	priceUpdate('#J_pricerange_3',7 );
	priceUpdate('#J_pricerange_4',5 );
	priceUpdate('#J_pricerange_5',2 );
	priceUpdate('#J_pricerange_6',3 );
	priceUpdate('#J_pricerange_7',4 );

	// 更新建筑面积
	coveredareaUpdate('#J_coveredarea_1',1);
	coveredareaUpdate('#J_coveredarea_2',6);
	coveredareaUpdate('#J_coveredarea_3',7);
	coveredareaUpdate('#J_coveredarea_5',2);
	coveredareaUpdate('#J_coveredarea_6',3);
	coveredareaUpdate('#J_coveredarea_7',4);

	// 更新户型
	houseUpdate('#J_houseStructure_1',1);
	houseUpdate('#J_houseStructure_2',6);
	houseUpdate('#J_houseStructure_3',7);

	
	// 更新房屋朝向
	headingUpdate('#J_orientation_1',1);
	headingUpdate('#J_orientation_2',6);
	headingUpdate('#J_orientation_3',7);

	// 更新装修
	fitmentTypeIdUpdate('#J_fitmentTypeId_1',1);
	fitmentTypeIdUpdate('#J_fitmentTypeId_2',6);
	fitmentTypeIdUpdate('#J_fitmentTypeId_3',7);
	fitmentTypeIdUpdate('#J_fitmentTypeId_5',2);
	fitmentTypeIdUpdate('#J_fitmentTypeId_6',3);

	// 更新户型结构
	layoutStructureUpdate('#J_layoutStructure_1',1);
	layoutStructureUpdate('#J_layoutStructure_2',6);
	layoutStructureUpdate('#J_layoutStructure_3',7);

	// 更新楼层范围
	floorrangUpdate('#J_floor_1',1);

	// 更新产权
	propertyUpdate('#J_property_1',1);
	propertyUpdate('#J_property_2',6);
	propertyUpdate('#J_property_3',7);

	// 更新楼体类型
	//buildingTypeUpdate('#J_buildingType_1',1);
	//buildingTypeUpdate('#J_buildingType_3',7);

	// 更新家具
	furnitureUpdate('#J_furniture_1',1);
	furnitureUpdate('#J_furniture_2',6);
	furnitureUpdate('#J_furniture_3',7);

	// 更新家电
	electricUpdate('#J_electric_1',1)
	electricUpdate('#J_electric_2',6)
	electricUpdate('#J_electric_3',7)
	
//
//	//编辑需求楼盘
//	editBuildUpdate('#J_editBuild_1',1);
//	editBuildUpdate('#J_editBuild_2',6);
//	editBuildUpdate('#J_editBuild_3',7);
//	editBuildUpdate('#J_editBuild_4',5);
//	editBuildUpdate('#J_editBuild_5',2);
//	editBuildUpdate('#J_editBuild_6',3);
//	editBuildUpdate('#J_editBuild_7',4);
//
//	// 编辑商圈&行政区
//	editBusinessUpdate('#J_editBusiness_1',1);
//	editBusinessUpdate('#J_editBusiness_2',6);
//	editBusinessUpdate('#J_editBusiness_3',7);
//	editBusinessUpdate('#J_editBusiness_4',5);
//	editBusinessUpdate('#J_editBusiness_5',2);
//	editBusinessUpdate('#J_editBusiness_6',3);
//	editBusinessUpdate('#J_editBusiness_7',4);

	// 更新贷款类型
	loanTypeUpdate('#J_loanType_1',1);
	loanTypeUpdate('#J_loanType_2',6);
	loanTypeUpdate('#J_loanType_3',7);
	loanTypeUpdate('#J_loanType_4',5);
	loanTypeUpdate('#J_loanType_5',2);
	loanTypeUpdate('#J_loanType_6',3);
	loanTypeUpdate('#J_loanType_7',4);
	
	// 更新首付
	paymentsUpdate('#J_payments_1',1);
	paymentsUpdate('#J_payments_2',6);
	paymentsUpdate('#J_payments_3',7);
	paymentsUpdate('#J_payments_4',5);
	paymentsUpdate('#J_payments_5',2);
	paymentsUpdate('#J_payments_6',3);
	paymentsUpdate('#J_payments_7',4);

	// 更新紧急度
	urgencyUpdate('#J_urgency_1',1);
	urgencyUpdate('#J_urgency_2',6);
	urgencyUpdate('#J_urgency_3',7);
	urgencyUpdate('#J_urgency_4',5);
	urgencyUpdate('#J_urgency_5',2);
	urgencyUpdate('#J_urgency_6',3);
	urgencyUpdate('#J_urgency_7',4);	

	// 更新有几套房
	houseQuantityUpdate('#J_houseQuantity_1',1);
	houseQuantityUpdate('#J_houseQuantity_2',6);
	houseQuantityUpdate('#J_houseQuantity_3',7);
	houseQuantityUpdate('#J_houseQuantity_5',2);
	
	//更新门宽
	doorwidthUpdate('#J_doorwidth_5',2);//商铺
	
	//更新层高
	floorUpdate('#J_floorheight_5',2);
	floorUpdate('#J_floorheight_7',4);
	
	//更新物管费
	propertyfeeUpdate('#J_propertyfee_5',2);
	propertyfeeUpdate('#J_propertyfee_6',3);

	//更新长
	lengthUpdate('#J_length_7',4);

	//更新宽
	widthUpdate('#J_width_7',4);

	//更新总高
	heightUpdate('#J_height_7',4);

	//更新商铺特殊需求
	specialdemandUpdate('#J_specialdemand',2);
	
	//更新位置类型
	//location
	locationUpdate('#J_location',2);
	
	//更新段位区号
	areacodeUpdate('#J_areacode_4',5);
	
	//更新不要数字
	nonumbersUpdate('#J_nonumbers_4',5);
	
	//更新可办公人数
	officeseatUpdate('#J_officeseat_6',3);
	

	/*
	 * 校验
	 */

	if ($.validator) {
		$.validator.setDefaults({
			ignore: ":hidden:not(select)",
			highlight : function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success : function(element) {
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
	}

	validatorRule = {
		// 客户姓名
		customername: {
	        required: true,
	        alnumAndchcharacter: true
	    },
		// 价格区间
		minprice: {
	        required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 7,
	    	compareMaxIntervalNumber: ".J_maxprice"
	    },
	    maxprice: {
			required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 7,
	    	compareMinIntervalNumber: ".J_minprice"
		},
		// 面积
		minarea: {
			required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxarea"
	    },
	    maxarea: {
	    	required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minarea"
	    },
	    // 户型
	    bedroom1: {
	    	required: true,
//	    	compareBedroom: ".bedroom1"
	    },
	    bedroom2: {
	    	required: true,
//	    	compareBedroom: ".J_bedroom2"
	    },
        loanType:{//贷款
        	required: true,
        },
	    // 物管费
	    minpropertyfee: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxpropertyfee"
	    },
	    maxpropertyfee: {
	    	number: true,
	    	decimal: true,
	    	min:0,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_minpropertyfee"
	    },
	    // 门宽
	    mindoorwidth: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxdoorwidth"
	    },
	    maxdoorwidth:{
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_mindoorwidth" 
	    },
	    // 单层高
	    minfloorheight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxfloorheight"
	    },
	    maxfloorheight:{
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_minfloorheight" 
	    },
	    // 可办公人数
	    minofficeseat: {
	    	required: true,
	    	number: true,
	    	min: 0,
	    	maxlength: 9,
	    	digits: true,
	    	compareMaxIntervalNumber: ".J_maxofficeseat"   
	    },
	    maxofficeseat: {
	    	required: true,
	    	number: true,
	    	digits: true,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minofficeseat"
	    },
		// 段位区号
		minsegment: {
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxsegment"
	    },
	    maxsegment: {
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minsegment"
	    },
	    nonum: {
	    	alnumAndchcharacter: true
	    },
	    // 高
	    highbefore: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_heightafter"
	    },
	    heightafter: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_highbefore"
	    },
	    // 长
	    longbefore: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_longafter"
	    },
	    longafter: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_longbefore"
	    },
	    // 高
	    minheight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxheight"
	    },
	    maxheight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minheight" 
	    },
	    //楼层范围
	    minfloorrang: {
	    	number: true,
	    	min: 0,
	    	maxlength: 7,
	    },
	    maxfloorrang: {
	    	number: true,
	    	min: 0,
	    	maxlength: 7,
	    },
	    //首付
	    payments: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9, 
	    },
	    //不要数字
	    nonumbers: {
	    	number: true,
	    	min: 0,
	    	maxlength: 5,
	    },
	    // 长
	    minLength: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareLongAfter: ".J_maxLength"
	    },
	    maxLength: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareLong: ".J_minLength"
	    },
	    // 宽
        minWidth: {
        	number:true,
        	decimal: true,
        	min:0,
        	compareWideAfter: ".J_maxWidth"
        },
        maxWidth:{
        	number:true,
        	decimal: true,
        	min:0,
        	compareWide: ".J_minWidth" 
        },
	    // 总高
        minHeight: {
        	number:true,
        	decimal: true,
        	min:0,
        	compareLayerAfter: ".J_maxHeight"
        },
        maxHeight:{
        	number:true,
        	decimal: true,
        	min:0,
        	compareLayer: ".J_minHeight" 
        }
	};
	
	validatorRule_Area={
			// 面积
			minarea: {
		    	number: true,
		    	decimal: true,
		    	min: 0,
		    	maxlength: 9,
		    	compareMaxIntervalNumber: ".J_maxarea"
		    },
		    maxarea: {
		    	number: true,
		    	decimal: true,
		    	min: 0,
		    	maxlength: 9,
		    	compareMinIntervalNumber: ".J_minarea"
		    },
	};

	validatorAddRule = {
		// 价格区间
		minPrice: {
	        required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxPrice"
	    },
	    maxPrice: {
			required: true,
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minPrice"
		},
		// 面积
		minArea: {
			required: {
	    		depends: function(element) {
	    			var propertytype = $(element).closest('form').parent().parent().attr('data-propertytype')
	    			if(propertytype == '1' || propertytype == '6' || propertytype == '7')
	    				return true;
	    		}
	    	},
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxArea"
	    },
	    maxArea: {
	    	required: {
	    		depends: function(element) {
	    			var propertytype = $(element).closest('form').parent().parent().attr('data-propertytype')
	    			if(propertytype == '1' || propertytype == '6' || propertytype == '7')
	    				return true;
	    		}
	    	},
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minArea"
	    },
	    // 户型
	    bedRoom1: {
		    required: true,
//	    	compareBedroom: ".bedRoom1"
	    },
	    bedRoom2: {
		    required: true
//	    	compareBedroom: ".J_bedRoom2"
	    },
	    // 物管费
	    minPropertyFee: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 5,
	    	compareMaxIntervalNumber: ".J_maxPropertyFee"
	    },
	    maxpropertyfee: {
	    	number: true,
	    	decimal: true,
	    	min:0,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_minPropertyFee"
	    },
	    // 门宽
	    minDoorWidth: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxDoorWidth"
	    },
	    maxDoorWidth:{
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minDoorWidth" 
	    },
	    // 单层高
	    minFloorHeight: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxFloorHeight"
	    },
	    maxFloorHeight:{
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minFloorHeight" 
	    },
	    // 可办公人数
	    minOfficeSeat: {
	    	required: true,
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_maxOfficeSeat"   
	    },
	    maxOfficeSeat: {
	    	required: true,
	    	number: true,
	    	digits: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_minOfficeSeat"
	    },
		// 段位区号
		minSegment: {
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_maxSegment"
	    },
	    maxSegment: {
	    	number: true,
	    	min: 0,
	    	digits: true,
	    	maxlength: 5,
	    	compareMinIntervalNumber: ".J_minSegment"
	    },
	    exludeNumber: {
	    	alnumAndchcharacter: true
	    },
	    // 高
	    heightBefore: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_heighAfter"
	    },
	    heightAfter: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_heighBefore"
	    },
	    // 长
	    longBefore: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMaxIntervalNumber: ".J_longAfter"
	    },
	    longAfter: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareMinIntervalNumber: ".J_longBefore"
	    },
	    depositTypeId: {
	    	required: {
	    		depends: function(element) {
	    			if($(element).closest('form').parent().parent().attr('data-propertytype') == '4')
	    				return true;
	    		}
	    	},
	    },
	    //楼层范围
	    minFloorRang: {
	    	number: true,
	    	min: 0,
	    	maxlength: 7,
	    },
	    maxFloorRang: {
	    	number: true,
	    	min: 0,
	    	maxlength: 7,
	    },
	    //首付
	    payments: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9, 
	    },
	    //不要数字
	    nonumbers: {
	    	number: true,
	    	min: 0,
	    	maxlength: 5,
	    },
	    // 长
	    minLength: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareLongAfter: ".J_maxLength"
	    },
	    maxLength: {
	    	number: true,
	    	decimal: true,
	    	min: 0,
	    	maxlength: 9,
	    	compareLong: ".J_minLength"
	    },
	    // 宽
        minWidth: {
        	number:true,
        	decimal: true,
        	min:0,
        	compareWideAfter: ".J_maxWidth"
        },
        maxWidth:{
        	number:true,
        	decimal: true,
        	min:0,
        	compareWide: ".J_minWidth" 
        },
	    // 总高
        minHeight: {
        	number:true,
        	decimal: true,
        	min:0,
        	compareLayerAfter: ".J_maxHeight"
        },
        maxHeight:{
        	number:true,
        	decimal: true,
        	min:0,
        	compareLayer: ".J_minHeight" 
        }
	};
	/* 校验end */
	
});



//校验区间
jQuery.validator.addMethod("compareMinIntervalNumber", function (value, element, param) {  
	var ele = $(element).closest('form').find(param);
	var before = ele.val();
	var after = value; 	
	if(before!='' && after!=''){
		var val = (Number(before) <= Number(after));
		if(val != false){
			$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		}
		return val;  
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}	
}, $.validator.format("存在不符合规则的数据！")); 
jQuery.validator.addMethod("compareMaxIntervalNumber", function (value, element, param) {  
	var ele = $(element).closest('form').find(param);
	var after = ele.val();
	var before = value; 	
	if(before!='' && after!=''){
		var val = (Number(before) <= Number(after));
		if(val != false){
			$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		}
		return val;
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}
}, $.validator.format("存在不符合规则的数据！"));

//校验区间
jQuery.validator.addMethod("compareBedRoom", function (value, element, param) {  
	var ele = $(element).closest('form').find(param);
	var before = ele.val();
	var after = value; 	
	/*alert(before);
	alert(after);*/
	if(before!='' || after!=''){
		var val = (Number(before) <= Number(after));
		if(val != false){
			$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		}
		return val;  
	}else{
		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
		return true;
	}	
}, $.validator.format("存在不符合规则的数据！"));

//比较长
jQuery.validator.addMethod("compareLong", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var before = ele.val();
	var after = value; 	
	if(before!=''&&after!=''){
		var decimal = /^-?\d+(\.\d{1,2})?$/;  
		if(decimal.test(ele.val())){
			var val=(Number(before) <= Number(after));
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
jQuery.validator.addMethod("compareLongAfter", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var after = ele.val();
	var before = value; 	
	if(before!=''&&after!=''){
		var decimal = /^-?\d+(\.\d{1,2})?$/;  
		if(decimal.test(ele.val())){
			var val=(Number(before) <= Number(after));
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

//比较宽
jQuery.validator.addMethod("compareWide", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var before = ele.val();
	var after = value; 	
	if(before!=''&&after!=''){
		var decimal = /^-?\d+(\.\d{1,2})?$/;  
		if(decimal.test(ele.val())){
			var val=(Number(before) <= Number(after));
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
jQuery.validator.addMethod("compareWideAfter", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var after = ele.val();
	var before = value; 	
	if(before!=''&&after!=''){
		var decimal = /^-?\d+(\.\d{1,2})?$/;  
		if(decimal.test(ele.val())){
			var val=(Number(before) <= Number(after));
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

//比较高
jQuery.validator.addMethod("compareLayer", function (value, element, param) {  
	var ele=$(element).closest('form').find(param);
	var before = ele.val();
	var after = value; 	
	if(before!=''&&after!=''){
		var decimal = /^-?\d+(\.\d{1,2})?$/;  
		if(decimal.test(ele.val())){
			var val=(Number(before) <= Number(after));
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
			var val=(Number(before) <= Number(after));
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

//字母数字支持,输入多个
jQuery.validator.addMethod("alnumAndchcharacter", function (value, element) {
    return /^[\w\s,，]+$/.test(value) || this.optional(element);
}, "只能包括汉字、英文字母和数字");

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


/* ********************************************************************
 * 单项修改
 */
/* *************************
 * 上部基本信息修改 start
 */
// 更新客户名称
$(document).delegate('#J_customername', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改客户名称',
		$('#J_editLayer'),
		function(index, layero) {
			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue=$("#customername").val();
			if(newvalue==""){
				commonContainer.alert("客户名称不能为空");
			}else if(newvalue==oldvalue){
				commonContainer.alert("客户名称没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改客户名称,修改前:'+oldvalue+',修改后:'+newvalue;
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "customername": newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});

// 更新性别
$(document).delegate('#J_gender', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改客户性别',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue=$("input[name='gender']:checked").val();//1男 2女
			var newval="";
			if(newvalue=="1"){
				newval="男";
			}else{
				newval="女";
			}
			if(newval==""){
				commonContainer.alert("客户性别不能为空");
			}else if(newval==oldvalue){
				commonContainer.alert("客户性别没有任何更改，确认不做更改？");
			}else{
				//commonContainer.alert("修改成功");
				var trace='修改客户性别,修改前:'+oldvalue+',修改后:'+newval;
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "sex": newvalue,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newval);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});


//更新国籍
$(document).delegate('#J_editNationality', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改国籍',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var options=$("#nationalitycode option:selected");
			var newvalue=options.val();
			var newvaluetext=options.text();				
			
			if(newvaluetext==oldvalue){
				commonContainer.alert("国籍没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改国籍,修改前:'+oldvalue+',修改后:'+newvaluetext;
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "nationalitycode":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaluetext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});

// 编辑电话
$(document).delegate('#J_editPhone', 'click', function(event){
	if(!buy_tel_edit_permission){
	    return;
	}
	commonContainer.modal(
		'修改联系电话',
		$('#J_editPhoneLayer'),
		function(index, layero) {
			var phoneArr = [];
			$('#J_dataTablePhone tr:gt(0)').each(function(){
				phoneArr.push($(this).find('td:first').text());
			})
			
			var postParam = {};
			postParam.clientid = clientId;
			postParam.customersid = customerId;
			postParam.phones = formatArrayToStringParam(phoneArr);
//			alert(postParam.phones);
//			console.log(postParam);
			
			jsonGetAjax(
				basePath + '/customer/main/updatephone',
				postParam,
				function(result) {
					layer.msg('修改成功');
					layer.close(index);
					location.reload();
				}
			)
		},
		{
			success: function() {
				$("#J_phone").val('');
			}
		}
	)
})

// 更新户籍
$(document).delegate('#J_hometown', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改客户户籍',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue=$("input[name='hometown']:checked").val();//1本地 2外埠
			var newval="";
			if(newvalue=="1"){
				newval="本地";
			}else{
				newval="外埠";
			}
			if(newval==oldvalue){
				commonContainer.alert("客户户籍没有任何更改，确认不做更改？");
			}else{
				//commonContainer.alert("修改成功");
				var trace='修改客户户籍,修改前:'+oldvalue+',修改后:'+newval;
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "hometown": newvalue,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newval);
						layer.close(index);
						location.reload();
					},{});
			}
				
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});

// 更新方便看房时间
$(document).delegate('#J_watchHouseTime', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改方便看房时间',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			//var newval=$("input[name='hometown']:checked").val();//1本地 2外埠
			//var newvalue=$("input[name='gender']:checked").parent().find("label").text();
			var newval=$("input[name='freetime']:checked");
			//var newvaltext=$("input[name='watchHouseTime']:checked").parent().find("label").text();
			var newvaltext="";
			var newvalueval="";
			
			newval.each(function(index){
				//alert($(this).parent().find("label").text());
				newvaltext+=$(this).parent().find("label").text()+",";
				newvalueval+=$(this).val()+"##";
			});
			newvaltext=newvaltext.substring(0,newvaltext.length-1);//对比用值
			
			var arr=new Array();
			for(var i=0;i<newval.length;i++){
				arr.push($(newval[i]).val());	
			}
			var newvalue="##"+newvalueval;
			if(newvaltext==oldvalue){
				commonContainer.alert("客户方便看房时间没有任何更改，确认不做更改？");
			}else{
				//commonContainer.alert("修改成功");
				var trace='修改客户方便看房时间,修改前:'+oldvalue+',修改后:'+newvaltext;
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "freetime": newvalue,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaltext);
						layer.close(index);
						location.reload();
					},{});
			}

		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});

/* 
 * 上部基本信息修改 end
 ******************** */

/* ***********************
 * 下部基本信息修改 start
 */
// 更新购房动机
$(document).delegate('#J_purchaseMotivation', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改购房动机',
		$('#J_editLayer'),
		function(index, layero) {

			var oldvalue=$this_.parent().find("dd").text();
			var newval=$("input[name='purchaseMotivation']:checked");				
			
			var newvaltext="";
			var newvalueval="";
			
			newval.each(function(index){			
				newvaltext+=$(this).parent().find("label").text()+"、";
				newvalueval+=$(this).attr("value")+"##";					
			});				
			
			newvaltext=newvaltext.substring(0,newvaltext.length-1);//对比用值
			
			var arr=new Array();
			for(var i=0;i<newval.length;i++){
				arr.push($(newval[i]).val());	
			}				
			var newvalue="##"+newvalueval;
			if(newvaltext==oldvalue){
				commonContainer.alert("购房动机没有任何更改，确认不做更改？");
			}else{
				var trace='修改购房动机,修改前:'+oldvalue+',修改后:'+newvaltext;
				
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "zheyetype": newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaltext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});	
//
//// 更新客户来源
//$(document).delegate('#J_customerSource', 'click', function(event){
//	var $this_ = $(this);
//	commonContainer.modal(
//		'修改客户来源',
//		$('#J_editLayer'),
//		function(index, layero) {
//			var oldvalue=$this_.parent().find("dd").text();
//			var options=$("#customerSource option:selected");
//			var newvalue=options.val();
//			var newvaluetext=options.text();				
//			
//			if(newvaluetext==oldvalue){
//				commonContainer.alert("客户来源没有任何更改，确认不做更改？");
//			}else{
//				commonContainer.alert("修改成功");
//				var trace='修改客户来源,修改前:'+oldvalue+',修改后:'+newvaluetext;
//				jsonPostAjax(
//					basePath + '/customer/main/updatebasicinfo',{
//						  "clientid":clientId,
//						  "customersid": customerId,
//						  "source":newvalue,
//						  "trace": trace
//					}, function() {
//						commonContainer.alert("操作成功");
//						$this_.parent().find("dd").html(newvaluetext);
//						layer.close(index);
//					},{});
//			}
//		},
//		{
//			success: function() {
//				editWidget(customerId, $this_);
//			}
//		}
//	)
//});	


//编辑客户来源
$(document).delegate('#J_editCustomerSource', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	
	var newValue = '';
	var oldValue = $this_.parent().find('dd').text();
	var formatOldValue = (oldValue.trim()=='') ? '空' : oldValue;
	
	commonContainer.modal(
		'修改客户来源',
		$('#J_editCustomerSourceLayer'),
		function(index, layero) {
			var newSourceId = $('#J_customerSource').val();
			var newSourceValue = $('#J_customerSource').find("option:selected").text();
			var newInfoSourceId = $('#J_infoSource').val();
			var newInfoSourceValue = $('#J_infoSource').find("option:selected").text();
			newValue = newSourceValue;
			if (newInfoSourceValue)
				newValue = newValue + ' - ' + newInfoSourceValue;
			
			var postParam = {};
			postParam.clientid = clientId;
			postParam.customersid = customerId;
			postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
			postParam.source = newSourceId;
			postParam.infosource = newInfoSourceId==null ? '' : newInfoSourceId;
			postParam.trace = '修改其它需求，修改前为：' + formatOldValue + '，修改后为：' + newValue;
			
//			console.log(postParam);
			jsonPostAjax(
				url = basePath + '/customer/main/updatebasicinfo.htm',
				postParam,
				function(result) {
//					$this_.parent().find('dd').html(newValue);
					layer.msg('修改成功');
					layer.close(index);
					location.reload();
				}
			)
		},
		{
			area: ['400px', '240px'],
			success: function() {
				// 初始化客户来源
				initCustomerSource($this_);
			}
		}
	)
})



// 更新客户评价
$(document).delegate('#J_finalAssessment', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改客户评价',
		$('#J_editLayer'),
		function(index, layero) {

			var oldvalue=$this_.parent().find("dd").text();
			var options=$("#finalAssessment option:selected");
			var newvalue=options.val();
			var newvaluetext=options.text();
			if(newvalue==""){
				commonContainer.alert("请选择评价");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改客户评价,修改前:'+oldvalue+',修改后:'+newvaluetext;
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "remark":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaluetext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});

// 更新是否是卖旧买新业务
$(document).delegate('#J_selloldbuynew', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改是否是卖旧买新业务',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue=$("input[name='selloldbuynew']:checked").val();//1是 0否
			var newval="";
			if(newvalue=="1"){
				newval="是";
			}else{
				newval="否";
			}
			if(newvalue==null){
				commonContainer.alert("请选择");
			}else{
				var trace='修改是否是卖旧买新业务,修改前:'+oldvalue+',修改后:'+newval;
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
							//clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)
						  "clientid":clientId,
						  "customersid": customerId,
						  "issellold": newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newval);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});

// 更新备注
$(document).delegate('#J_remark', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改备注',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue=$("#remark").val();			
			if(newvalue==oldvalue){
				commonContainer.alert("备注没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改备注,修改前:'+oldvalue+',修改后:'+newvalue;				
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "memo": newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").text(newvalue);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});

/*
 * 下部基本信息修改 end
 ************************/

/* ********************
 * clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)为必传参数,其它参数每次传一个即可
 * propertytype (string): 物业类型:1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 
 * 
 * 住宅需求 start
 */
// 更新贷款记录
function loanUpdate(objId){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改贷款记录',
		$('#J_editLayer'),
		function(index, layero) {			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue=$("input[name='loan']:checked").val();//1是 0否
			var newval="";
			if(newvalue=="1"){
				newval="是";
			}else{
				newval="否";
			}
			//var newvalue=$("input[name='gender']:checked").parent().find("label").text();
			if(newval==""){
				commonContainer.alert("请选择");
			}
			/*else if(newval==oldvalue){
				commonContainer.alert("贷款记录没有任何更改，确认不做更改？");
			}*/
			else{				
				//commonContainer.alert("修改成功");
				var trace='修改贷款记录,修改前:'+oldvalue+',修改后:'+newval;				
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
							//clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)
						  "clientid":clientId,
						  "customersid": customerId,
						  "hasloan": newvalue,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newval);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新公积金月缴额
function fundUpdate(objId){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改公积金月缴额',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue=$("#fund").val();
			newvalueval = newvalue+"元/月";
			/*if(newvalue==""){
				commonContainer.alert("公积金月缴额不能为空");
			}else if(newvalueval==oldvalue){
				commonContainer.alert("公积金月缴额没有任何更改，确认不做更改？");
			}else{*/
			if(!isNaN(newvalue)){
				commonContainer.alert("修改成功");
				var trace='修改公积金月缴额,修改前:'+oldvalue+',修改后:'+newvalueval;
				jsonPostAjax(
					basePath + '/customer/main/updatebasicinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "reservecount": newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalueval);
						layer.close(index);
						location.reload();
					},{});
			}else{
				commonContainer.alert("请输入数字");
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

$(document).on('keyup input propertychange' , '#remark' , function () {
    var len = this.maxLength - this.value.length;
    if (!len) {// 用来处理不支持 maxLength 限制输入的浏览器，强行修改内容
        this.value = this.value.slice(0, this.maxLength);
    }
    $(this).next().text('还可输入 ' + len + ' 个字');
});

//更新价格区间
function priceUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改价格区间',
		$('#J_editLayer'),
		function(index, layero) {
			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
						
			/*validate = $('#form'+$(this).val()).validate({
				rules:houseValidatorRule,
				focusInvalid:true
			}).form();
			if(!validate) return false;*/
						
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minprice").val();
			var newvalue2=$("#maxprice").val();
			var newvalue=newvalue1+" - "+newvalue2+" 元/月";
			//newvalue += "元/月";
			//alert("oldvalue:"+oldvalue+",newvalue:"+newvalue);
			/*if(newvalue1==""||newvalue2==""){
				commonContainer.alert("价格不能为空");
			}else if(newvalue==oldvalue){
				commonContainer.alert("价格没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改价格区间,修改前:'+oldvalue+',修改后:'+newvalue;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype": pType,
						  "minprice":newvalue1,
						  "maxprice":newvalue2,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新建筑面积
function coveredareaUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改需求面积',
		$('#J_editLayer'),
		function(index, layero) {
			if(pType==1 || pType==5 || pType==6 || pType==7){
				validate = $('#J_editForm1').validate({
					rules:validatorRule
				}).form();
				if(!validate) return false;				
			}else{
				validate = $('#J_editForm1').validate({
					rules:validatorRule_Area
				}).form();
				if(!validate) return false;	
			}			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minarea").val();
			var newvalue2=$("#maxarea").val();
			var newvalue=newvalue1+" - "+newvalue2+" 平方米";
			//newvalue += "元/月";
			//alert("oldvalue:"+oldvalue+",newvalue:"+newvalue);
			/*if(newvalue1==""||newvalue2==""){
				commonContainer.alert("需求面积不能为空");
			}else if(newvalue==oldvalue){
				commonContainer.alert("需求面积没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改需求面积,修改前:'+oldvalue+',修改后:'+newvalue;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "minarea":newvalue1,
						  "maxarea":newvalue2,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新户型
function houseUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改户型',
		$('#J_editLayer'),
		function(index, layero) {
			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#bedroom1").val();
			var newvalue2=$("#bedroom2").val();
			var newvalue=newvalue1+" 或 "+newvalue2+" 室";
			//alert("oldvalue:"+oldvalue+",newvalue:"+newvalue);
			/*if(newvalue1==""||newvalue2==""){
				commonContainer.alert("户型不能为空");
			}else if(newvalue==oldvalue){
				commonContainer.alert("户型没有任何更改，确认不做更改？");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改户型,修改前:'+oldvalue+',修改后:'+newvalue;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "bedroom1":newvalue1,
						  "bedroom2":newvalue2,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新房屋朝向
function headingUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改房屋朝向',
		$('#J_editLayer'),
		function(index, layero) {

			var oldvalue=$this_.parent().find("dd").text();
			var newval=$("input[name='orientation']:checked");				
			
			var newvaltext="";
			var newvalueval="";
			
			newval.each(function(index){
			
				newvaltext+=$(this).parent().find("label").text()+",";
				newvalueval+=$(this).attr("value")+"##";					
			});			
			
			newvaltext=newvaltext.substring(0,newvaltext.length-1);//对比用值			
			newvaltext=newval.parent().find("label").text();//原值中间没有","分隔所以用这个值
			var arr=new Array();
			for(var i=0;i<newval.length;i++){
				arr.push($(newval[i]).val());	
			}				
			var newvalue="##"+newvalueval;
			if(newvaltext==oldvalue){
				commonContainer.alert("客户方便看房时间没有任何更改，确认不做更改？");
			}else{
				//commonContainer.alert("修改成功");
				var trace='修改客户方便看房时间,修改前:'+oldvalue+',修改后:'+newvaltext;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "heading": newvalue,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaltext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新装修
function fitmentTypeIdUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改装修',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var options=$("#fitmentTypeId option:selected");
			var newvalue=options.val();
			var newvaluetext=options.text();				
			
			if(newvaluetext==oldvalue){
				commonContainer.alert("装修没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改装修,修改前:'+oldvalue+',修改后:'+newvaluetext;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "fitment":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaluetext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新户型结构
function layoutStructureUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改户型结构',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var options=$("#layoutStructure option:selected");
			var newvalue=options.val();
			var newvaluetext=options.text();
			
			if(newvaluetext==oldvalue){
				commonContainer.alert("户型结构没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改户型结构,修改前:'+oldvalue+',修改后:'+newvaluetext;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "roomtype":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaluetext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新楼层范围
function floorrangUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改楼层范围',
		$('#J_editLayer'),
		function(index, layero) {
			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minfloorrang").val();
			var newvalue2=$("#maxfloorrang").val();
			var newvalue_val=newvalue1+"-"+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			
			/*if(newvalue_val==oldvalue){
				commonContainer.alert("楼层范围没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改楼层范围,修改前:'+oldvalue+',修改后:'+newvalue_val;
				// alert(trace);// ##最小范围##最大范围##
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "floorrang":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue_val);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新产权
function propertyUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改产权',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var options=$("#property option:selected");
			var newvalue=options.val();
			var newvaluetext=options.text();
			
			if(newvaluetext==oldvalue){
				commonContainer.alert("产权没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改产权,修改前:'+oldvalue+',修改后:'+newvaluetext;
				//alert(trace);
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "equity":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaluetext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新楼体类型
function buildingTypeUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改楼体类型',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var options=$("#buildingType option:selected");
			var newvalue=options.val();
			var newvaluetext=options.text();			
			if(newvaluetext==oldvalue){
				commonContainer.alert("楼体类型没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改楼体类型,修改前:'+oldvalue+',修改后:'+newvaluetext;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "buildingtype":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaluetext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新家具
function furnitureUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改家具',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newval=$("input[name='furniture']:checked");			
			var newvaltext="";
			var newvalueval="";			
			newval.each(function(index){			
				newvaltext+=$(this).parent().find("label").text()+"、";
				newvalueval+=$(this).attr("value")+"##";					
			});			
			newvaltext=newvaltext.substring(0,newvaltext.length-1);//对比用值			
			var arr=new Array();
			for(var i=0;i<newval.length;i++){
				arr.push($(newval[i]).val());	
			}				
			var newvalue="##"+newvalueval;
			if(newvaltext==oldvalue){
				commonContainer.alert("家具没有任何更改，确认不做更改？");
			}else{
				var trace='修改家具,修改前:'+oldvalue+',修改后:'+newvaltext;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "furniture": newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaltext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新家电
function electricUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改家电',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newval=$("input[name='electric']:checked");			
			var newvaltext="";
			var newvalueval="";			
			newval.each(function(index){			
				newvaltext+=$(this).parent().find("label").text()+"、";
				newvalueval+=$(this).attr("value")+"##";
			});			
			newvaltext=newvaltext.substring(0,newvaltext.length-1);//对比用值			
			var arr=new Array();
			for(var i=0;i<newval.length;i++){
				arr.push($(newval[i]).val());	
			}				
			var newvalue="##"+newvalueval;
			if(newvaltext==oldvalue){
				commonContainer.alert("家电没有任何更改，确认不做更改？");
			}else{
				var trace='修改家电,修改前:'+oldvalue+',修改后:'+newvaltext;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "electric": newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaltext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}
//
////编辑需求楼盘
//function editBuildUpdate(objId,pType){
//$(document).delegate(objId, 'click', function(event){
//	var $this_ = $(this);
//	
//	commonContainer.modal(
//		'修改需求楼盘',
//		$('#J_editBuildLayer'),
//		function(index, layero) {
//			// TODO 拼接需求楼盘，并保存
//		},
//		{
//			area: ['460px', '300px'],
//			success: function() {
//				// 初始化原楼盘信息
//				initBuild($this_);
//				
//			}
//		}
//	)
//});
//}
//
//// 编辑商圈&行政区
//function editBusinessUpdate(objId,pType){
//$(document).delegate(objId, 'click', function(event){
//	var $this_ = $(this);
//	
//	commonContainer.modal(
//		'修改商圈&行政区',
//		$('#J_editBusinessLayer'),
//		function(index, layero) {
//			// TODO 拼接商圈&行政区，并保存
//		},
//		{
//			area: ['460px', '300px'],
//			success: function() {
//				// 初始化原商圈&行政区
//				initBusiness($this_);
//			}
//		}
//	)
//});
//}


//编辑需求楼盘
$(document).delegate('#J_editBuild', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);


	commonContainer.modal(
		'修改需求楼盘',
		$('#J_editBuildLayer'),
		function(index, layero) {
			var oldValue = $this_.parent().find('dd').text();
			var buildArr = [];
			var newValue = [];
			$('#J_dataTableBuild tbody tr', $('#J_editBuildLayer')).each(function(){
				var tr = $(this);
				buildArr.push(tr.attr('id'));
				newValue.push(tr.find('td:first').text());
			});
			
			var postParam = {};
			postParam.clientid = clientId;
			postParam.customersid = customerId;
			postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
			postParam.buildings = "##" + buildArr.join('##') + "##";
			postParam.trace = '修改需求楼盘，修改前为：' + oldValue + '，修改后为：' + newValue.join('、');

			jsonPostAjax(
				url = basePath + '/customer/main/updatedemandinfo.htm',
				postParam,
				function(result) {
					layer.msg('修改成功');
					layer.close(index);
					location.reload();
				}
			)
		},
		{
			area: ['460px', '60%'],
			success: function() {
				// 初始化原楼盘信息
				initBuild($this_);
			}
		}
	)
})


/*$(document).delegate('#J_editBuild', 'click', function(event){
	var $this_ = $(this);

	var newValue = '';
	var oldValue = '';
	var oldValue1 = $this_.parent().find('dd').text();
	if (oldValue1.trim()=='') oldValue = '空';
	
	commonContainer.modal(
		'修改需求楼盘',
		$('#J_editBuildLayer'),
		function(index, layero) {
			var buildArr = [];
			$('#J_dataTableBuild tr:gt(0)').each(function(){
				buildArr.push($(this).find('td:first').attr('data-id'));
				newValue += $(this).find('td:first').text() + '、';
			})
			newValue = newValue.substring(0, newValue.length-1);
			
			var postParam = {};
			postParam.clientid = clientId;
			postParam.customersid = customerId;
			postParam.propertytype = $this_.parents().find('.tab-pane').attr('data-propertytype');
			postParam.buildingtype = formatArrayToStringParam(buildArr);
			postParam.trace = '修改需求楼盘，修改前为：' + oldValue + '，修改后为：' + newValue;
			console.log(postParam);
			jsonPostAjax(
				url = basePath + '/customer/main/updatedemandinfo.htm',
				postParam,
				function(result) {
					$this_.parent().find('dd').html(newValue);
					layer.msg('修改成功');
					layer.close(index);
					location.reload();
				}
			)
			
		},
		{
			area: ['460px', '300px'],
			success: function() {
				// 初始化原楼盘信息
				initBuild($this_);
			}
		}
	)
})*/

// 编辑商圈&行政区
$(document).delegate('#J_editBusiness', 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	
	var oldValue = $this_.parent().find('dd').text();
	var formatOldValue = (oldValue.trim()=='') ? '空' : oldValue;
	
	commonContainer.modal(
		'修改商圈&行政区',
		$('#J_editBusinessLayer'),
		function(index, layero) {
            var business = [];
            var newValue = [];

            $('#J_editBusinessLayer #J_dataTableBusiness tbody tr').each(function(){
//						businessArr.push($(this).find('td:first').attr('data-id'));
                var tr = $(this);
                var $business = tr.find('td:eq(0)');
                var $canton = tr.find('td:eq(1)');

                business.push(tr.attr('id') + ':' + $canton.attr('data-id'));
                newValue.push($business.text() + '（' + $canton.text() + '）');
            });

            if (!newValue.length) {
				layer.alert('请添加商圈');
				return false;
			}
			var postParam = {};
			postParam.clientid = clientId;
			postParam.customersid = customerId;
			postParam.propertytype = $this_.parents().find('.tab-pane.active').attr('data-propertytype');
			postParam.business = '##' + business.join('##') + '##';
            postParam.trace = '修改商圈&行政区，修改前为：' + formatOldValue + '，修改后为：' + newValue.join('、');
			
			jsonPostAjax(
				url = basePath + '/customer/main/updatedemandinfo.htm',
				postParam,
				function(result) {
					layer.msg('修改成功');
					layer.close(index);
					location.reload();
				}
			)
		},
		{
			area: ['460px', '300px'],
			success: function() {
				// 初始化原商圈&行政区
				initBusiness($this_ , $('#J_editBusinessLayer'));
			}
		}
	)
})



// 更新贷款类型
function loanTypeUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改贷款类型',
		$('#J_editLayer'),
		function(index, layero) {
			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var options=$("#loanType option:selected");
			var newvalue=options.val();
			var newvaluetext=options.text();
			if(newvaluetext==oldvalue){
				commonContainer.alert("贷款类型没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改贷款类型,修改前:'+oldvalue+',修改后:'+newvaluetext;
				//alert(trace);
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "loan":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaluetext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新首付
function paymentsUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改首付',
		$('#J_editLayer'),
		function(index, layero) {
			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newval=$("#payments").val()+"万元";
			var newvalue=$("#payments").val();
			
			/*if(newvalue==oldvalue){
				commonContainer.alert("首付没有任何更改，确认不做更改？");
			}else if(isNaN($("#payments").val())){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改首付,修改前:'+oldvalue+',修改后:'+newval;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "downpayment": newvalue,
						  "propertytype":pType,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newval);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新紧急度
function urgencyUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改紧急度',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var options=$("#urgencyType option:selected");
			var newvalue=options.val();
			var newvaluetext=options.text();
			if(newvaluetext==oldvalue){
				commonContainer.alert("紧急度没有任何更改，确认不做更改？");
			}else{
				commonContainer.alert("修改成功");
				var trace='修改紧急度,修改前:'+oldvalue+',修改后:'+newvaluetext;
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "urgency":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaluetext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

// 更新有几套房
function houseQuantityUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改房产数量',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newval=$("input[name='houseQuantity']:checked");
			
			var newvaltext="";
			var newvalueval="";			
			newval.each(function(index){
				newvaltext+=$(this).parent().find("label").text()+"、";
//				newvalueval+=$(this).attr("value")+"##";
				newvalueval+=$(this).attr("value");
			});
			
			newvaltext=newvaltext.substring(0,newvaltext.length-1);//对比用值
			
			var arr=new Array();
			for(var i=0;i<newval.length;i++){
				arr.push($(newval[i]).val());
			}
//			var newvalue="##"+newvalueval;
			var newvalue=newvalueval;
//			alert(newvalue);
			if(newvaltext==oldvalue){
				commonContainer.alert("房产数量没有任何更改，确认不做更改？");
			}else{
				var trace='修改房产数量,修改前:'+oldvalue+',修改后:'+newvaltext;
//				alert(trace);
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "housenum": newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaltext);
						layer.close(index);
						location.reload();
					},{});
			}
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}
/* 
 * 住宅需求 end
 *********************/

/* ********************
 * clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)为必传参数,其它参数每次传一个即可
 * propertytype (string): 物业类型:1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 
 * 
 * 商铺需求 start
 */

//更新门宽
function doorwidthUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改门宽',
		$('#J_editLayer'),
		function(index, layero) {

			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#mindoorwidth").val();
			var newvalue2=$("#maxdoorwidth").val();
			var newvalue_val=newvalue1+"-"+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			
			/*if(newvalue_val==oldvalue){
				commonContainer.alert("门宽没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改门宽,修改前:'+oldvalue+',修改后:'+newvalue_val;
				//alert(trace);// ##最小范围##最大范围##
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "doorwidth":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue_val);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

//更新层高
function floorUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改层高',
		$('#J_editLayer'),
		function(index, layero) {

			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;

			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minfloorheight").val();
			var newvalue2=$("#maxfloorheight").val();
			var newvalue_val=newvalue1+"-"+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			
			/*if(newvalue_val==oldvalue){
				commonContainer.alert("层高没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改层高,修改前:'+oldvalue+',修改后:'+newvalue_val;
				//alert(trace);// ##最小范围##最大范围##
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "floorheight":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue_val);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

//更新物管费
function propertyfeeUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改物管费',
		$('#J_editLayer'),
		function(index, layero) {

			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minpropertyfee").val();
			var newvalue2=$("#maxpropertyfee").val();
			var newvalue_val=newvalue1+"-"+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			
			/*if(newvalue_val==oldvalue){
				commonContainer.alert("层高没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改物管费,修改前:'+oldvalue+',修改后:'+newvalue_val;
				//alert(trace);// ##最小范围##最大范围##
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "propertyfee":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue_val);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

//更新商铺特殊需求
function specialdemandUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改商铺特殊需求',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newval=$("input[name='specialdemand']:checked");
			var newvaltext="";
			var newvalueval="";
			
			newval.each(function(index){
				//alert($(this).parent().find("label").text());
				newvaltext+=$(this).parent().find("label").text()+",";
				newvalueval+=$(this).val()+"##";				
			});
			newvaltext=newvaltext.substring(0,newvaltext.length-1);//对比用值
			
			var arr=new Array();
			for(var i=0;i<newval.length;i++){
				arr.push($(newval[i]).val());
			}
			var newvalue="##"+newvalueval;
			if(newvaltext==oldvalue){
				commonContainer.alert("商铺特殊需求没有任何更改，确认不做更改？");
			}else{
				//commonContainer.alert("修改成功");
				var trace='修改商铺特殊需求,修改前:'+oldvalue+',修改后:'+newvaltext;
				// alert(trace);
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "specialdemand": newvalue,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaltext);
						layer.close(index);
						location.reload();
					},{});
			}

		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}


//更新位置类型
function locationUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改位置类型',
		$('#J_editLayer'),
		function(index, layero) {
			var oldvalue=$this_.parent().find("dd").text();
			var newval=$("input[name='location']:checked");
			var newvaltext="";
			var newvalueval="";
			
			newval.each(function(index){
				//alert($(this).parent().find("label").text());
				newvaltext+=$(this).parent().find("label").text()+",";
				newvalueval+=$(this).val()+"##";				
			});
			newvaltext=newvaltext.substring(0,newvaltext.length-1);//对比用值
			
			var arr=new Array();
			for(var i=0;i<newval.length;i++){
				arr.push($(newval[i]).val());
			}
			var newvalue="##"+newvalueval;
			if(newvaltext==oldvalue){
				commonContainer.alert("位置需求没有任何更改，确认不做更改？");
			}else{
				//commonContainer.alert("修改成功");
				var trace='修改位置需求,修改前:'+oldvalue+',修改后:'+newvaltext;
				// alert(trace);
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "location": newvalue,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvaltext);
						layer.close(index);
						//location.reload();
					},{});
			}

		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}
/* 
 * 商铺需求 end
 *********************/

/* ********************
 * clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)为必传参数,其它参数每次传一个即可
 * propertytype (string): 物业类型:1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 
 * 
 * 写字楼需求 start
 */

//更新可办公人数
function officeseatUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改可办公人数',
		$('#J_editLayer'),
		function(index, layero) {

			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minofficeseat").val();
			var newvalue2=$("#maxofficeseat").val();
			var newvalueval=newvalue1+" - "+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			// alert(newvalue1);
			// alert(newvalue2);
			/*if(newvalueval==oldvalue){
				commonContainer.alert("可办公人数没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改可办公人数,修改前:'+oldvalue+',修改后:'+newvalueval;
				
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "officeseat":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalueval);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

/* 
 * 写字楼需求 end
 *********************/

/* ********************
 * clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)为必传参数,其它参数每次传一个即可
 * propertytype (string): 物业类型:1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 
 * 
 * 厂房/仓库需求 start
 */

//更新长
function lengthUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改长',
		$('#J_editLayer'),
		function(index, layero) {

			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minlength").val();
			var newvalue2=$("#maxlength").val();
			var newvalue_val=newvalue1+"-"+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			
			/*if(newvalue_val==oldvalue){
				commonContainer.alert("长没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改长,修改前:'+oldvalue+',修改后:'+newvalue_val;
				// alert(trace);// ##最小范围##最大范围##
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "length":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue_val);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

//更新宽
function widthUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改宽',
		$('#J_editLayer'),
		function(index, layero) {

			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minwidth").val();
			var newvalue2=$("#maxwidth").val();
			var newvalue_val=newvalue1+"-"+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			
			/*if(newvalue_val==oldvalue){
				commonContainer.alert("宽没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改宽,修改前:'+oldvalue+',修改后:'+newvalue_val;
				//alert(trace);// ##最小范围##最大范围##
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "width":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue_val);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

//更新总高
function heightUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改总高',
		$('#J_editLayer'),
		function(index, layero) {

			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minheight").val();
			var newvalue2=$("#maxheight").val();
			var newvalue_val=newvalue1+"-"+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			
			/*if(newvalue_val==oldvalue){
				commonContainer.alert("总高没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改总高,修改前:'+oldvalue+',修改后:'+newvalue_val;
				//alert(trace);// ##最小范围##最大范围##
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "height":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue_val);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}
/* 
 * 厂房/仓库需求 end
 *********************/

/* ********************
 * clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)为必传参数,其它参数每次传一个即可
 * propertytype (string): 物业类型:1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 
 * 
 * 车位/车库需求 start
 */

//更新段位区号
function areacodeUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改段位区号',
		$('#J_editLayer'),
		function(index, layero) {

			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue1=$("#minsegment").val();
			var newvalue2=$("#maxsegment").val();
			var newvalueval=newvalue1+" - "+newvalue2;
			var newvalue="##"+newvalue1+"##"+newvalue2+"##";
			// alert(newvalue1);
			// alert(newvalue2);
			/*if(newvalueval==oldvalue){
				commonContainer.alert("段位区号没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue1)){
				commonContainer.alert("请输入数字");
			}else if(isNaN(newvalue2)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改段位区号,修改前:'+oldvalue+',修改后:'+newvalueval;
				// alert(trace);
				// alert(newvalue);
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "segment":newvalue,
						  "trace": trace
					}, function() {
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalueval);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

//更新不要数字
function nonumbersUpdate(objId,pType){
$(document).delegate(objId, 'click', function(event){
	if(!buy_edit_permission){
	    return;
	}
	var $this_ = $(this);
	commonContainer.modal(
		'修改不要数字',
		$('#J_editLayer'),
		function(index, layero) {
			validate = $('#J_editForm1').validate({
				rules:validatorRule
			}).form();
			if(!validate) return false;
			
			var oldvalue=$this_.parent().find("dd").text();
			var newvalue=$("#nonumbers").val();
			/*if(newvalue==oldvalue){
				commonContainer.alert("不要数字没有任何更改，确认不做更改？");
			}else if(isNaN(newvalue)){
				commonContainer.alert("请输入数字");
			}else{*/
				commonContainer.alert("修改成功");
				var trace='修改不要数字,修改前:'+oldvalue+',修改后:'+newvalue;
				// alert(trace);
				jsonPostAjax(
					basePath + '/customer/main/updatedemandinfo',{
						  "clientid":clientId,
						  "customersid": customerId,
						  "propertytype":pType,
						  "nonum": newvalue,
						  "trace": trace
					}, function() {
						//return;
						commonContainer.alert("操作成功");
						$this_.parent().find("dd").html(newvalue);
						layer.close(index);
						location.reload();
					},{});
			/*}*/
		},
		{
			success: function() {
				editWidget(customerId, $this_);
			}
		}
	)
});
}

/* 
 * 车位/车库需求 end
 *********************/

/* ********************
 * clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)为必传参数,其它参数每次传一个即可
 * propertytype (string): 物业类型:1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 
 * 
 * 平房需求 start
 */

/* 
 * 平房需求 end
 *********************/

/* ********************
 * clientid(客户编号),customersid(需求编号),trace(操作日志),propertytype(物业类型)为必传参数,其它参数每次传一个即可
 * propertytype (string): 物业类型:1住宅,2商铺,3写字楼,4厂房/仓库,5车位/车库,6平房,7别墅 
 * 
 * 别墅需求 start
 */

/* 
 * 别墅需求 end
 *********************/

/*-----------------------------------------------------------*/
/* 右侧操作栏 start */
/* 
 * 跟进
 * 
 * */
$("#oper_followup").on("click",function(){
	//var oldname=$("#oper_followup").html();//接口text的id
	//alert(oldname);
	if(!buy_follow_add_permission){
		return;
	}
	commonContainer.modal('添加跟进', $('#editfollowup_layer'), function(index, layero) {
		var follow_content=$("#J_followup_content").val();
		var remind_content=$("#J_reminder_content").val();
		var remind_time=$("#J_reminder_time").val();
		if(follow_content==""){
			commonContainer.alert("跟进内容不能为空");
		}else{
			jsonPostAjax(
				basePath + '/customer/follow/insertfollow',{
					"clientid": clientId,		//客户编号
					"content": follow_content,	//跟进内容
					"customersid": customerId,	//需求ID
					"remindmsg": remind_content,//提醒内容
					"remindtime": remind_time,	//提醒时间
					"sourceid": "",				//源ID(非必须，可不传值)
					"type": "1"					//跟进类型
				}, function() {
					commonContainer.alert("操作成功");
					layer.close(index);
					location.reload();
					//jQuery('#J_dataTable').bootstrapTable('refresh');
				},{});
			/*jsonAjax(basePath + '/house/keyadmin/lendkey.htm', {
				"id" : id,
				"keycode" : $("#borrow_keycode").text(),
			}, function() {
				commonContainer.alert("操作成功");
				layer.close(index);
				//jQuery('#J_dataTable').bootstrapTable('refresh');
			},{});*/
		}
	}, 
	{
		overflow :false,
		area : ['680px', '350px'],
		btns : [ '保存', '取消' ]
	});

});
/* 
 * 转介
 * 
 * */
$("#oper_referral").on("click",function(){
    if (!buy_referral_permission) {
        return;
    }
	/*$('input:radio[name="guest"]').change(function(){
		if($(this).val()=="1"){
			$("#private_guest_box").hide();
		}else if($(this).val()=="2"){
			$("#private_guest_box").show();
		}
	});*/
	commonContainer.modal('客源共享', $('#editreferral_layer'), function(index, layero) {
//		var clientid='';	//客户编号 上面统一调用
		var type='';		//转介类型1:共享到公客池2:转介 
		var userid='';		//接收人id

		var newname=$('input:radio[name="guest"]:checked').val();		
		if(newname==null){
			commonContainer.alert("请选择");
		}else{
			commonContainer.showLoading();
			if(newname=="1"){
				type=1;
				jsonPostAjax(
					basePath + '/customer/cooperation/detailsubtenancy.htm',{
						  "clientid": clientId,
						  "type": type
					}, function() {
                        commonContainer.hideLoading();
						commonContainer.alert("操作成功");
						layer.close(index);
						location.reload();
					},{});
			}else if(newname=="2"){
				type=2;	
				var sendee_id=$("#J_sendee").attr("data-id");//接收人id
				var sendee_val=$("#J_sendee").val();
				var deptname=$("#J_deptName").attr("data-id");//接收部门id
				var dept_val=$("#J_deptName").val();
				
				if(deptname==null || dept_val==""){
					commonContainer.alert("请选择接收部门");
					return false;
				}else if(sendee_val=="" ){
					commonContainer.alert("请选择接收人");
					return false;
				}else if(sendee_id=="" && sendee_val!=""){
					commonContainer.alert("请正确选择接收人");
					return false;
				}
				
				userid=sendee_id;				
				jsonPostAjax(
					basePath + '/customer/cooperation/detailsubtenancy.htm',{
						  "clientid": clientId,
						  "type": type,
						  //"deptid": deptname,
						  "userid": userid
					}, function() {
                        commonContainer.hideLoading();
						commonContainer.alert("操作成功");
						layer.close(index);
					},{});				
			}
		}
	}, 
	{
		overflow :false,
		area : ['680px', '260px'],
		btns : [ '保存', '取消' ],
		success: function() {
			var html = '<div class="radio radio-primary radio-inline">'+
					'<input type="radio" value="1" name="guest" id="public_guest"><label for="public_guest">共享到店组公客</label>'+
				'</div>'+
				'<div class="radio radio-primary radio-inline">'+
					'<input type="radio" value="2" name="guest" id="private_guest" style="margin-left:8px;"><label for="private_guest">转介</label>'+
				'</div>';
			$('#J_guest').html(html);
			
			$("#J_sendee").val('');
			$("#J_deptLevel").val('');
			$("#J_deptName").val('');
			$("#private_guest_box").hide();
		}
	});
});

$(document).delegate('input:radio[name="guest"]', 'click', function(event){
	if($(this).val()=="1"){
		$("#private_guest_box").hide();
	}else if($(this).val()=="2"){
		$("#private_guest_box").show();
	}
});

/* 
 * 设为黑名单
 * 
 * */
$(document).delegate('#oper_blacklist', 'click', function(event){
    if (!buy_black_permission) {
        return;
    }
	//$("#blacklist_show").show();
	//$("#oper_blacklist").hide();
	jsonGetAjax(
		basePath + '/custom/black/insertblack',
		{
			clientid: clientId,
		},
		function(result) {
			layer.msg("设置成功，已提交审核");
		}
	);
});

/* 
 * 查看电话
 * 
 * */
$(document).delegate('#J_checkPhone', 'click',function(event){
    if (!buy_tel_view_permission) {
        return;
    }
	showPhone(clientId , 2);
})
/* 右侧操作栏 end */

//获取url参数
function getUrlParams(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return unescape(r[2]);
	}
	return null;
}
//alert(getUrlParams("url"));

function setisCurrent(customerId,clientId){
	/*
	 * 0过往需求 false   1当前需求 true
	 * 过往需求不显示，当前需求显示
	 * 判断是否显示过往需求
	 * true显示   false不显示
	 * 
	 * */
	var iscurrent_val=$("#fixedwidth_right").attr("data-iscurrent");
	var iscurrent_status=false;
	if(iscurrent_val=="1"){
		iscurrent_status=true;
	}else if(iscurrent_val=="0"){
		iscurrent_status=false;
	}
	
	operationLog(customerId,iscurrent_status,clientId);
}

/* 新增物业信息 start */

/* 
 * 添加需求楼盘
 */
function addfloor(elm){
    if (!buy_edit_permission) {
        return;
    }
	$("#J_build_add").val('');
	commonContainer.modal(
		'添加楼盘',
		$('#J_addfloor_layer'),
		function(index, layero) {
			if($("#J_build_add").val()==''){
				commonContainer.alert("请选择需求楼盘");
				return;
			}
			var str='<tr id='+$("#J_build_add").attr("data-id")+'><td>'+$("#J_build_add").val()+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
			$('#'+elm).find('#dataTableFloor tbody').append(str);
			layer.close(index);
		}, 
		{
			overflow :true,
			area : ['400px','300px'],
			btns : [ '确定'],
			success:function(){
				searchBuild($("#J_build_add"),true,'right');
			}
		});
}

/* 
 * 添加商圈
 */
function addarea(elm){
    if (!buy_edit_permission) {
        return;
    }
    var business = $("#J_business_add");
    business.val('');
	$("#J_region").val('');
	commonContainer.modal(
		'添加商圈',
		$('#J_addarea_layer'),
		function(index, layero) {
			var id = business.attr('data-id');
			if(!id){
				commonContainer.alert("商圈必填");
				return;
			}
            if ($('tr#' + id).length) {
                commonContainer.alert("该商圈已经添加过");
                return false;
            }
			if($("#J_region option:selected").val()==''){
				var str='<tr id='+id+' area-id='+$("#J_region option:selected").val()+'><td>'+business.val()+'</td><td></td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
					
			}else{
				var str='<tr id='+id+' area-id='+$("#J_region option:selected").val()+'><td>'+business.val()+'</td><td>'+$("#J_region option:selected").text()+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
			}
			$('#dataTableArea tbody').append(str);
			layer.close(index);
		}, 
		{
			overflow :true,
			area : ['500px','300px'],
			btns : [ '确定'],
			success:function(){
				searchBusiness(business,true,'right');
				dimContainer.buildCanton($("#J_region"),"")
			}
		});
}

function bindClick(objId,index){
    $(document).on("click",objId,function(){
		ajaxSubmit(index);
	});
}

bindClick('#J_residence_btn',1);
bindClick('#J_shops_btn',2);
bindClick('#J_office_btn',3);
bindClick('#J_warehouse_btn',4);
bindClick('#J_parking_btn',5);
bindClick('#J_bungalow_btn',6);
bindClick('#J_villa_btn',7);

/*$(document).on("click",'#J_residence_btn',function(){
	ajaxSubmit(1);
});
$(document).on("click",'#J_shops_btn',function(){
	ajaxSubmit(2);
});
$(document).on("click",'#J_office_btn',function(){
	ajaxSubmit(3);
});
$(document).on("click",'#J_warehouse_btn',function(){
	ajaxSubmit(4);
});
$(document).on("click",'#J_parking_btn',function(){
	ajaxSubmit(5);
});
$(document).on("click",'#J_bungalow_btn',function(){
	ajaxSubmit(6);
});
$(document).on("click",'#J_villa_btn',function(){
	ajaxSubmit(7);
});*/

/*
 * 表单提交
 */
function ajaxSubmit(obj_i){

//	sureflag=0;
	if(!customerValidate()){
		//console.log("失败")
		commonContainer.alert("存在不符合规则的数据！！");
	//	sureflag=1;
		return;
	}	
	
	var val={};
	var form_this=$('.form'+obj_i+' #dataTableArea tbody');
	if(form_this.children('tr').length==0){
		commonContainer.alert("商圈必填");
		return;
	}

	/*validate = $('.form'+obj_i).validate({
		rules:validatorRule
	}).form();
	if(!validate) return false;*/
	/* new add */
/*	//价格区间
	var minPrice=$(".J_minPrice").val();
	var maxPrice=$(".J_maxPrice").val();
	//需求面积
	var minArea=$(".J_minArea").val();
	var maxArea=$(".J_maxArea").val();
	//户型
	var bedRoom1=$("#J_bedRoom1").val();
	var bedRoom2=$("#J_bedRoom2").val();
	//装修
	var fitmentTypeId=$(".J_fitmentTypeId").val();
	//户型结构
	var roomTypeId=$("#J_layoutStructure").val();
	//楼层范围
	var minFloorRang=$(".J_minFloorRang").val();
	var maxFloorRang=$(".J_maxFloorRang").val();
	//产权
	var equityTypeId=$("#J_equityTypeId").val();
	//楼体类型
	var buildingTypeId=$("#J_buildingType").val();
	//贷款
	var loanTypeId=$(".J_loanTypeId").val();
	//首付
	var downPayment=$("#downPayment").val();
	//紧急度
	var urgencyTypeId=$("#J_urgencyTypeId").val();
	//几套房
	var ownerHouseNumberTypeId=$("input[name='ownerHouseNumberTypeId']:checked").val();
	
	//物管费
	var minPropertyFee=$(".J_minPropertyFee").val();
	var maxPropertyFee=$(".J_maxPropertyFee").val();
	//可办公人数
	var minOfficeSeat=$(".J_minOfficeSeat").val();
	var maxOfficeSeat=$(".J_maxOfficeSeat").val();
	
	//层高
	var minFloorHeight=$(".J_minFloorHeight").val();
	var maxFloorHeight=$(".J_maxFloorHeight").val();
	//长
	var minLength=$(".J_minLength").val();
	var maxLength=$(".J_maxLength").val();
	//宽
	var minWidth=$(".J_minWidth").val();
	var maxWidth=$(".J_maxWidth").val();
	//总高
	var minHeight=$(".J_minHeight").val();
	var maxHeight=$(".J_maxHeight").val();

	//段位区号
	var minSegment=$(".J_minSegment").val();
	var maxSegment=$(".J_maxSegment").val();
	//不要数字
	var exludeNumber=$("#J_exludeNumber").val();*/
	
	if(obj_i=="1"){
		/* new add */
		//价格区间
		var minPrice=$("#form1 .J_minPrice").val();
		var maxPrice=$("#form1 .J_maxPrice").val();
		//需求面积
		var minArea=$("#form1 .J_minArea").val();
		var maxArea=$("#form1 .J_maxArea").val();
		//户型
		var bedRoom1=$("#form1 #J_bedRoom1").val();
		var bedRoom2=$("#form1 #J_bedRoom2").val();
		//装修
		var fitmentTypeId=$("#form1 .J_fitmentTypeId").val();
		//户型结构
		var roomTypeId=$("#form1 #J_layoutStructure").val();
		//楼层范围
		var minFloorRang=$("#form1 .J_minFloorRang").val();
		var maxFloorRang=$("#form1 .J_maxFloorRang").val();
		//产权
		var equityTypeId=$("#form1 #J_equityTypeId").val();
		//楼体类型
		//var buildingTypeId=$("#form1 #J_buildingType").val();
		//贷款
		var loanTypeId=$("#form1 .J_loanTypeId").val();
		//首付
		var downPayment=$("#form1 #downPayment").val();
		//紧急度
		var urgencyTypeId=$("#form1 #J_urgencyTypeId").val();
		//几套房
		var ownerHouseNumberTypeId=$("#form1 input[name='ownerHouseNumberTypeId']:checked").val();
			
		val =$("#form1").serializeJson();
		val.customerId= customerId,
		val.demandTypeId=1,
		console.log(val);
		var furnitureIds='';
		var electricIds='';
		var headingIds='';
		if(val.furnitureIds!=undefined){
			for(var i=0;i<val.furnitureIds.length;i++){
				furnitureIds+= "##"+val.furnitureIds[i];
			}
			val.furnitureIds=furnitureIds+"##";
		}else{
			val.furnitureIds=furnitureIds;
		}
		
		if(val.electricIds!=undefined){
			for(var i=0;i<val.electricIds.length;i++){
				electricIds+= "##"+val.electricIds[i];
			}
			val.electricIds=electricIds+"##";
		}else{
			val.electricIds=electricIds;
		}
		
		if(val.headingIds!=undefined){
			for(var i=0;i<val.headingIds.length;i++){
				headingIds+= "##"+val.headingIds[i];
			}
			val.headingIds=headingIds+"##";
		}else{
			val.headingIds=headingIds;
		}
		var buildingIds='';
		$(".form1 #dataTableFloor tbody tr").each(function(){
			buildingIds+='##'+$(this).attr("id");
		})
		if($(".form1 #dataTableFloor tbody tr").length!=0){
			val.buildingIds=buildingIds+"##";
		}else{
			val.buildingIds=buildingIds;
		}

		var businessIds='';
		$(".form1 #dataTableArea tbody tr").each(function(){
			businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
		})
		if($(".form1 #dataTableArea tbody tr").length!=0){
			val.businessIds=businessIds+"##";
		}else{
			val.businessIds=businessIds;
		}		
		
		if(minPrice!="" && maxPrice!=""){//价格区间
			val.minPrice=minPrice;
			val.maxPrice=maxPrice;
		}
		if(minArea!="" && maxArea!=""){//需求面积
			val.minArea=minArea;
			val.maxArea=maxArea;
		}
		if(bedRoom1!=null && bedRoom2!=null){//户型
			val.bedRoom1=bedRoom1;
			val.bedRoom2=bedRoom2;
		}
		if(fitmentTypeId!=null){//装修
			val.fitmentTypeId=fitmentTypeId;
		}
		if(roomTypeId!=null){//户型结构
			val.roomTypeId=roomTypeId;
		}
		if(minFloorRang!="" && maxFloorRang!=""){//楼层范围
			val.minFloorRang=minFloorRang;
			val.maxFloorRang=maxFloorRang;
		}
		if(equityTypeId!=null){//产权
			val.equityTypeId=equityTypeId;
		}
		/*if(buildingTypeId!=null){//楼体类型
			val.buildingTypeId=buildingTypeId;
		}*/
		if(loanTypeId!=null){//贷款
			val.loanTypeId=loanTypeId;
		}
		if(downPayment!=""){//首付
			val.downPayment=downPayment;
		}
		if(urgencyTypeId!=null){//紧急度
			val.urgencyTypeId=urgencyTypeId;
		}
		if(ownerHouseNumberTypeId!=null){//几套房
			val.ownerHouseNumberTypeId=ownerHouseNumberTypeId;
		}
		
	}else if(obj_i=="2"){
		//价格区间
		var minPrice=$("#form2 .J_minPrice").val();
		var maxPrice=$("#form2 .J_maxPrice").val();
		//需求面积
		var minArea=$("#form2 .J_minArea").val();
		var maxArea=$("#form2 .J_maxArea").val();
		//门宽
		var minDoorWidth=$("#form2 .J_minDoorWidth").val();
		var maxDoorWidth=$("#form2 .J_maxDoorWidth").val();
		//装修
		var fitmentTypeId=$("#form2 .J_fitmentTypeId").val();
		//贷款
		var loanTypeId=$("#form2 .J_loanTypeId").val();
		//首付
		var downPayment=$("#form2 #downPayment").val();
		//紧急度
		var urgencyTypeId=$("#form2 #J_urgencyTypeId").val();
		//几套房
		var ownerHouseNumberTypeId=$("#form2 input[name='ownerHouseNumberTypeId']:checked").val();
		
		val=$("#form2").serializeJson();
		val.customerId= customerId,
		val.demandTypeId=2,
		console.log(val);
		
		var specialDemandIds='';
		var locationIds='';
		if(val.specialDemandIds!=undefined){
			for(var i=0;i<val.specialDemandIds.length;i++){
				specialDemandIds+= "##"+val.specialDemandIds[i];
			}
			val.specialDemandIds=specialDemandIds+"##";
		}else{
			val.specialDemandIds=specialDemandIds;
		}
		
		if(val.locationIds!=undefined){
			for(var i=0;i<val.locationIds.length;i++){
				locationIds+= "##"+val.locationIds[i];
			}
			val.locationIds=locationIds+"##";
		}else{
			val.locationIds=locationIds;
		}				
		var buildingIds='';
		$(".form2 #dataTableFloor tbody tr").each(function(){
			buildingIds+='##'+$(this).attr("id");
		})
		if($(".form2 #dataTableFloor tbody tr").length!=0){
			val.buildingIds=buildingIds+"##";
		}else{
			val.buildingIds=buildingIds;
		}				
		var businessIds='';
		$(".form2 #dataTableArea tbody tr").each(function(){
			businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
		})
		if($(".form2 #dataTableArea tbody tr").length!=0){
			val.businessIds=businessIds+"##";
		}else{
			val.businessIds=businessIds;
		}		

		if(minPrice!="" && maxPrice!=""){//价格区间
			val.minPrice=minPrice;
			val.maxPrice=maxPrice;
		}
		if(minArea!="" && maxArea!=""){//需求面积
			val.minArea=minArea;
			val.maxArea=maxArea;
		}
		if(fitmentTypeId!=null){//装修
			val.fitmentTypeId=fitmentTypeId;
		}
		if(loanTypeId!=null){//贷款
			val.loanTypeId=loanTypeId;
		}
		if(downPayment!=""){//首付
			val.downPayment=downPayment;
		}
		if(urgencyTypeId!=null){//紧急度
			val.urgencyTypeId=urgencyTypeId;
		}
		if(ownerHouseNumberTypeId!=null){//几套房
			val.ownerHouseNumberTypeId=ownerHouseNumberTypeId;
		}
		if(minDoorWidth!=null){//门宽
			val.minDoorWidth=minDoorWidth;
			val.maxDoorWidth=maxDoorWidth;
		}		
	}else if(obj_i=="3"){
		//价格区间
		var minPrice=$("#form3 .J_minPrice").val();
		var maxPrice=$("#form3 .J_maxPrice").val();
		//需求面积
		var minArea=$("#form3 .J_minArea").val();
		var maxArea=$("#form3 .J_maxArea").val();
		//装修
		var fitmentTypeId=$("#form3 .J_fitmentTypeId").val();
		//贷款
		var loanTypeId=$("#form3 .J_loanTypeId").val();
		//首付
		var downPayment=$("#form3 #downPayment").val();
		//紧急度
		var urgencyTypeId=$("#form3 #J_urgencyTypeId").val();
		
		//物管费
		var minPropertyFee=$("#form3 .J_minPropertyFee").val();
		var maxPropertyFee=$("#form3 .J_maxPropertyFee").val();
		//可办公人数
		var minOfficeSeat=$("#form3 .J_minOfficeSeat").val();
		var maxOfficeSeat=$("#form3 .J_maxOfficeSeat").val();
		
		val=$("#form3").serializeJson();
		val.customerId= customerId,
		val.demandTypeId=3,
		console.log(val);
		
		var buildingIds='';
		$(".form3 #dataTableFloor tbody tr").each(function(){
			buildingIds+='##'+$(this).attr("id");
		})
		if($(".form3 #dataTableFloor tbody tr").length!=0){
			val.buildingIds=buildingIds+"##";
		}else{
			val.buildingIds=buildingIds;
		}				
		var businessIds='';
		$(".form3 #dataTableArea tbody tr").each(function(){
			businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
		})
		if($(".form3 #dataTableArea tbody tr").length!=0){
			val.businessIds=businessIds+"##";
		}else{
			val.businessIds=businessIds;
		}

		if(minPrice!="" && maxPrice!=""){//价格区间
			val.minPrice=minPrice;
			val.maxPrice=maxPrice;
		}
		if(minArea!="" && maxArea!=""){//需求面积
			val.minArea=minArea;
			val.maxArea=maxArea;
		}
		if(minPropertyFee!="" && maxPropertyFee!=""){//物管费
			val.minPropertyFee=minPropertyFee;
			val.maxPropertyFee=maxPropertyFee;
		}
		if(minOfficeSeat!="" && maxOfficeSeat!=""){//可办公人数
			val.minOfficeSeat=minOfficeSeat;
			val.maxOfficeSeat=maxOfficeSeat;
		}
		if(fitmentTypeId!=null){//装修
			val.fitmentTypeId=fitmentTypeId;
		}
		if(loanTypeId!=null){//贷款
			val.loanTypeId=loanTypeId;
		}
		if(downPayment!=""){//首付
			val.downPayment=downPayment;
		}
		if(urgencyTypeId!=null){//紧急度
			val.urgencyTypeId=urgencyTypeId;
		}
		
	}else if(obj_i=="4"){	//价格区间
		var minPrice=$("#form4 .J_minPrice").val();
		var maxPrice=$("#form4 .J_maxPrice").val();
		//需求面积
		var minArea=$("#form4 .J_minArea").val();
		var maxArea=$("#form4 .J_maxArea").val();
		
		//贷款
		var loanTypeId=$("#form4 .J_loanTypeId").val();
		//首付
		var downPayment=$("#form4 #downPayment").val();
		//紧急度
		var urgencyTypeId=$("#form4 #J_urgencyTypeId").val();
		
		//层高
		var minFloorHeight=$("#form4 .J_minFloorHeight").val();
		var maxFloorHeight=$("#form4 .J_maxFloorHeight").val();
		//长
		var minLength=$("#form4 .J_minLength").val();
		var maxLength=$("#form4 .J_maxLength").val();
		//宽
		var minWidth=$("#form4 .J_minWidth").val();
		var maxWidth=$("#form4 .J_maxWidth").val();
		//总高
		var minHeight=$("#form4 .J_minHeight").val();
		var maxHeight=$("#form4 .J_maxHeight").val();

		val=$("#form4").serializeJson();
		val.customerId= customerId,
		val.demandTypeId=4,
		console.log(val);
		
		var buildingIds='';
		$(".form4 #dataTableFloor tbody tr").each(function(){
			buildingIds+='##'+$(this).attr("id");
		})
		if($(".form4 #dataTableFloor tbody tr").length!=0){
			val.buildingIds=buildingIds+"##";
		}else{
			val.buildingIds=buildingIds;
		}				
		var businessIds='';
		$(".form4 #dataTableArea tbody tr").each(function(){
			businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
		})
		if($(".form4 #dataTableArea tbody tr").length!=0){
			val.businessIds=businessIds+"##";
		}else{
			val.businessIds=businessIds;
		}
		

		if(minPrice!="" && maxPrice!=""){//价格区间
			val.minPrice=minPrice;
			val.maxPrice=maxPrice;
		}
		if(minArea!="" && maxArea!=""){//需求面积
			val.minArea=minArea;
			val.maxArea=maxArea;
		}
		if(minFloorHeight!="" && maxFloorHeight!=""){//层高
			val.minFloorHeight=minFloorHeight;
			val.maxFloorHeight=maxFloorHeight;
		}
		if(minLength!="" && maxLength!=""){//长
			val.minLength=minLength;
			val.maxLength=maxLength;
		}
		if(minWidth!="" && maxWidth!=""){//宽
			val.minWidth=minWidth;
			val.maxWidth=maxWidth;
		}
		if(minHeight!="" && maxHeight!=""){//总高
			val.minHeight=minHeight;
			val.maxHeight=maxHeight;
		}
		if(loanTypeId!=null){//贷款
			val.loanTypeId=loanTypeId;
		}
		if(downPayment!=""){//首付
			val.downPayment=downPayment;
		}
		if(urgencyTypeId!=null){//紧急度
			val.urgencyTypeId=urgencyTypeId;
		}
		
	}else if(obj_i=="5"){
		//价格区间
		var minPrice=$("#form5 .J_minPrice").val();
		var maxPrice=$("#form5 .J_maxPrice").val();
		
		//贷款
		var loanTypeId=$("#form5 .J_loanTypeId").val();
		//首付
		var downPayment=$("#form5 #downPayment").val();
		//紧急度
		var urgencyTypeId=$("#form5 #J_urgencyTypeId").val();
		
		//段位区号
		var minSegment=$("#form5 .J_minSegment").val();
		var maxSegment=$("#form5 .J_maxSegment").val();
		//不要数字
		var exludeNumber=$("#form5 #J_exludeNumber").val();
		
		val=$("#form5").serializeJson();
		val.customerId= customerId,
		val.demandTypeId=5,
		console.log(val);
		
		var buildingIds='';
		$(".form5 #dataTableFloor tbody tr").each(function(){
			buildingIds+='##'+$(this).attr("id");
		})
		if($(".form5 #dataTableFloor tbody tr").length!=0){
			val.buildingIds=buildingIds+"##";
		}else{
			val.buildingIds=buildingIds;
		}				
		var businessIds='';
		$(".form5 #dataTableArea tbody tr").each(function(){
			businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
		})
		if($(".form5 #dataTableArea tbody tr").length!=0){
			val.businessIds=businessIds+"##";
		}else{
			val.businessIds=businessIds;
		}
		

		if(minPrice!="" && maxPrice!=""){//价格区间
			val.minPrice=minPrice;
			val.maxPrice=maxPrice;
		}
		if(minSegment!="" && maxSegment!=""){//段位区号
			val.minSegment=minSegment;
			val.maxSegment=maxSegment;
		}
		if(exludeNumber!=""){//不要数字
			val.exludeNumber=exludeNumber;
		}
		if(loanTypeId!=null){//贷款
			val.loanTypeId=loanTypeId;
		}
		if(downPayment!=""){//首付
			val.downPayment=downPayment;
		}
		if(urgencyTypeId!=null){//紧急度
			val.urgencyTypeId=urgencyTypeId;
		}

	}else if(obj_i=="6"){
		//价格区间
		var minPrice=$("#form6 .J_minPrice").val();
		var maxPrice=$("#form6 .J_maxPrice").val();
		//需求面积
		var minArea=$("#form6 .J_minArea").val();
		var maxArea=$(".J_maxArea").val();
		//户型
		var bedRoom1=$("#form6 #J_bedRoom1").val();
		var bedRoom2=$("#form6 #J_bedRoom2").val();
		//装修
		var fitmentTypeId=$("#form6 .J_fitmentTypeId").val();
		//户型结构
		var roomTypeId=$("#form6 #J_layoutStructure").val();
		//产权
		var equityTypeId=$("#form6 #J_equityTypeId").val();
		//贷款
		var loanTypeId=$("#form6 .J_loanTypeId").val();
		//首付
		var downPayment=$("#form6 #downPayment").val();
		//紧急度
		var urgencyTypeId=$("#form6 #J_urgencyTypeId").val();
		//几套房
		var ownerHouseNumberTypeId=$("#form6 input[name='ownerHouseNumberTypeId']:checked").val();
		
		val=$("#form6").serializeJson();
		val.customerId= customerId,
		val.demandTypeId=6,
		console.log(val);
		
		var furnitureIds='';
		var electricIds='';
		var headingIds='';
		if(val.furnitureIds!=undefined){
			for(var i=0;i<val.furnitureIds.length;i++){
				furnitureIds+= "##"+val.furnitureIds[i];
			}
			val.furnitureIds=furnitureIds+"##";
		}else{
			val.furnitureIds=furnitureIds;
		}
		
		if(val.electricIds!=undefined){
			for(var i=0;i<val.electricIds.length;i++){
				electricIds+= "##"+val.electricIds[i];
			}
			val.electricIds=electricIds+"##";
		}else{
			val.electricIds=electricIds;
		}
		
		if(val.headingIds!=undefined){
			for(var i=0;i<val.headingIds.length;i++){
				headingIds+= "##"+val.headingIds[i];
			}
			val.headingIds=headingIds+"##";
		}else{
			val.headingIds=headingIds;
		}
		
		
		var buildingIds='';
		$(".form6 #dataTableFloor tbody tr").each(function(){
			buildingIds+='##'+$(this).attr("id");
		})
		if($(".form6 #dataTableFloor tbody tr").length!=0){
			val.buildingIds=buildingIds+"##";
		}else{
			val.buildingIds=buildingIds;
		}				
		var businessIds='';
		$(".form6 #dataTableArea tbody tr").each(function(){
			businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
		})
		if($(".form6 #dataTableArea tbody tr").length!=0){
			val.businessIds=businessIds+"##";
		}else{
			val.businessIds=businessIds;
		}
		
		
		if(minPrice!="" && maxPrice!=""){//价格区间
			val.minPrice=minPrice;
			val.maxPrice=maxPrice;
		}
		if(minArea!="" && maxArea!=""){//需求面积
			val.minArea=minArea;
			val.maxArea=maxArea;
		}
		if(bedRoom1!=null && bedRoom2!=null){//户型
			val.bedRoom1=bedRoom1;
			val.bedRoom2=bedRoom2;
		}
		if(fitmentTypeId!=null){//装修
			val.fitmentTypeId=fitmentTypeId;
		}
		if(roomTypeId!=null){//户型结构
			val.roomTypeId=roomTypeId;
		}
		if(equityTypeId!=null){//产权
			val.equityTypeId=equityTypeId;
		}
		if(loanTypeId!=null){//贷款
			val.loanTypeId=loanTypeId;
		}
		if(downPayment!=""){//首付
			val.downPayment=downPayment;
		}
		if(urgencyTypeId!=null){//紧急度
			val.urgencyTypeId=urgencyTypeId;
		}
		if(ownerHouseNumberTypeId!=null){//几套房
			val.ownerHouseNumberTypeId=ownerHouseNumberTypeId;
		}
		
		
	}else if(obj_i=="7"){
		/* new add */
		//价格区间
		var minPrice=$("#form7 .J_minPrice").val();
		var maxPrice=$("#form7 .J_maxPrice").val();
		//需求面积
		var minArea=$("#form7 .J_minArea").val();
		var maxArea=$("#form7 .J_maxArea").val();
		//户型
		var bedRoom1=$("#form7 #J_bedRoom1").val();
		var bedRoom2=$("#form7 #J_bedRoom2").val();
		//装修
		var fitmentTypeId=$("#form7 .J_fitmentTypeId").val();
		//户型结构
		var roomTypeId=$("#form7 #J_layoutStructure").val();
		//产权
		var equityTypeId=$("#form7 #J_equityTypeId").val();
		//贷款
		var loanTypeId=$("#form7 .J_loanTypeId").val();
		//首付
		var downPayment=$("#form7 #downPayment").val();
		//紧急度
		var urgencyTypeId=$("#form7 #J_urgencyTypeId").val();
		//几套房
		var ownerHouseNumberTypeId=$("#form7 input[name='ownerHouseNumberTypeId']:checked").val();
		
		val=$("#form7").serializeJson();
		val.customerId= customerId,
		val.demandTypeId=7,
		console.log(val);

		var furnitureIds='';
		var electricIds='';
		var headingIds='';
		if(val.furnitureIds!=undefined){
			for(var i=0;i<val.furnitureIds.length;i++){
				furnitureIds+= "##"+val.furnitureIds[i];
			}
			val.furnitureIds=furnitureIds+"##";
		}else{
			val.furnitureIds=furnitureIds;
		}
		
		if(val.electricIds!=undefined){
			for(var i=0;i<val.electricIds.length;i++){
				electricIds+="##"+ val.electricIds[i];
			}
			val.electricIds=electricIds+"##";
		}else{
			val.electricIds=electricIds;
		}
		
		if(val.headingIds!=undefined){
			for(var i=0;i<val.headingIds.length;i++){
				headingIds+= "##"+val.headingIds[i];
			}
			val.headingIds=headingIds+"##";
		}else{
			val.headingIds=headingIds;
		}
		
		var buildingIds='';
		$(".form7 #dataTableFloor tbody tr").each(function(){
			buildingIds+='##'+$(this).attr("id");
		})
		if($(".form7 #dataTableFloor tbody tr").length!=0){
			val.buildingIds=buildingIds+"##";
		}else{
			val.buildingIds=buildingIds;
		}				
		var businessIds='';
		$(".form7 #dataTableArea tbody tr").each(function(){
			businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
		})
		if($(".form7 #dataTableArea tbody tr").length!=0){
			val.businessIds=businessIds+"##";
		}else{
			val.businessIds=businessIds;
		}
		
		
		if(minPrice!="" && maxPrice!=""){//价格区间
			val.minPrice=minPrice;
			val.maxPrice=maxPrice;
		}
		if(minArea!="" && maxArea!=""){//需求面积
			val.minArea=minArea;
			val.maxArea=maxArea;
		}
		if(bedRoom1!=null && bedRoom2!=null){//户型
			val.bedRoom1=bedRoom1;
			val.bedRoom2=bedRoom2;
		}
		if(fitmentTypeId!=null){//装修
			val.fitmentTypeId=fitmentTypeId;
		}
		if(roomTypeId!=null){//户型结构
			val.roomTypeId=roomTypeId;
		}
		if(equityTypeId!=null){//产权
			val.equityTypeId=equityTypeId;
		}
		if(loanTypeId!=null){//贷款
			val.loanTypeId=loanTypeId;
		}
		if(downPayment!=""){//首付
			val.downPayment=downPayment;
		}
		if(urgencyTypeId!=null){//紧急度
			val.urgencyTypeId=urgencyTypeId;
		}
		if(ownerHouseNumberTypeId!=null){//几套房
			val.ownerHouseNumberTypeId=ownerHouseNumberTypeId;
		}
	}

	jsonPostAjax(basePath + '/customer/detail/newdemand', val, function() {
		console.log(val);
		commonContainer.alert('操作成功');
		//layer.close(index);
		window.location.reload();//换成刷新iframe document.frames("name").location.reload(true);
	},{});
}
/* 新增物业信息 end */