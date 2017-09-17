$(function(){
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
	var flag=1;
	var flagadd=1;
	var arrphone=[];
	var sureflag=1;
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!"
	});
	
	$(document).on("change",'#J_phoneType',function(){
		if($(this).val()==2){
			$(this).closest('.row').find(".remark").show();
		}else{
			$(this).closest('.row').find(".remark").hide();
		}
	}).on('keyup input propertychange' , '#memo' , function () {
        var len = this.maxLength - this.value.length;
        if (!len) {// 用来处理不支持 maxLength 限制输入的浏览器，强行修改内容
            this.value = this.value.slice(0, this.maxLength);
        }
        $(this).next().text('还可输入 ' + len + ' 个字');
    });
	$(document).on("click",'#J_add_phone',function(){
		commonContainer.modal(
			'添加电话', 
			$('#J_phone_layer'), 
			function(index, layero) {
				if(arrphone.length!=0){
					var phonenum=0;
					for(var i=0;i<arrphone.length;i++){
						var isMob=/^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;								
						if(isMob.test(arrphone[i])){
							phonenum++;
						}
					}
					if(phonenum!=0){
						var arrval=arrphone.reverse().join(",");
						$("#J_phone").val(arrval);
						layer.close(index);
					}else{
						commonContainer.alert("至少添加一个手机号码");
						return false;
					}
					
				}else{
					commonContainer.alert("请添加电话");
					return false;
				}
			},
		{
			overflow:true,
			area : ['500px','80%'],
			btns : '确定',
			success:function(){
				if(flagadd==1){
					dimContainer.buildDimChosenSelector($("#J_phoneType"), "phoneType","1");//电话
					flagadd=0
				}
			}
		});
	})
	
	$(document).delegate('#J_add_call', 'click', function(event){
		var phone=$("#phone").val().trim();
		if(phone!=''){	
			if($("#J_phoneType").val()==1){
			    var isMob=/^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
				if(!isMob.test(phone)){
					commonContainer.alert("手机号格式不正确");
					return false;
				}
			}else if($("#J_phoneType").val()==2){
				 var isPhone = /^([0-9]{3,4}-)[0-9]{7,8}$/;
				 if(!isPhone.test(phone)){
					 commonContainer.alert("座机号格式不正确");
					return false;
				}
			}
			if($.inArray(phone, arrphone)==-1){
				var str='<tr><td>'+phone+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
				$("#J_phone_dataTable tbody").append(str);
				arrphone.push(phone);
				$("#phone").val('');
			}else{
				commonContainer.alert("此电话号已输入");
			}
		}else{
			commonContainer.alert("电话号不允许为空");
		}
	})

	$(document).on("click",'#J_add_confirm',function(){
             //换成真实校验手机号是否跟之前完全匹配过的接口
		var j_phone = $('#J_phone').val();
		if(!j_phone.trim()){
			commonContainer.alert("联系电话不能为空");
			return false;
		}
		var phoneArr=j_phone.split(',');
		var phone=[];
		for(var i=0;i<phoneArr.length;i++){
			var obj={};
			obj.phone=phoneArr[i];
			obj.phoneTypeId=0;
			phone.push(obj)
		}
		$('#J_phone_call').val(j_phone);
		jsonPostAjax(basePath + '/customer/main/checkbuyerbyphones',phone, function(result){
			var data = result.data;
			if(!data.actionName && !data.customerId){
				commonContainer.modal(
					'买卖新增',
					$('#buy_add_layer'),
					function(index, layero){
						if(sureflag==1){
							ajaxSubmit(index);
						}
					},
					{
						overflow:true,
						area : ['100%','100%'],
						btns : [ '确定'],
						success:function(){
							if(flag==1){
								dimContainer.buildDimRadio($("#J_gender"), "genderId", "gender");//性别
								dimContainer.buildDimRadio($("#J_hometown"), "householdTypeId", "hometown");//户籍
								dimContainer.buildDimRadio($("#J_loanrecord"), "hasLoanedId", "yesOrNo", "");//贷款记录
								dimContainer.buildDimRadio($("#J_renew"), "isPurchaseAfterSales", "yesOrNo", "");//是否卖旧买新
								dimContainer.buildDimRadio($("#J_houseQuantity"), "ownerHouseNumberTypeId1", "houseQuantity", "");//住宅几套房
								dimContainer.buildDimRadio($("#J_bungalowhouseQuantity"), "ownerHouseNumberTypeId2", "houseQuantity", "");//平房几套房
								dimContainer.buildDimRadio($("#J_shopsQuantity"), "ownerHouseNumberTypeId3", "houseQuantity", "");//商铺几套房
								dimContainer.buildDimRadio($("#J_villaQuantity"), "ownerHouseNumberTypeId4", "houseQuantity", "");//别墅几套房
								dimContainer.buildDimCheckBox($("#J_watchHouseTime"), "freeTimeIds", "watchHouseTime", "");//方便看房时间
								dimContainer.buildDimCheckBox($("#J_demandType"), "demandType", "demandType", "1");//需求类型
								dimContainer.buildDimCheckBox($("#J_orientation1"), "headingIds1", "orientation", "");//住宅朝向
								dimContainer.buildDimCheckBox($("#J_orientation6"), "headingIds6", "orientation", "");//平房朝向
								dimContainer.buildDimCheckBox($("#J_orientation7"), "headingIds7", "orientation", "");//别墅朝向
								dimContainer.buildDimCheckBox($("#J_furniture1"), "furnitureIds1", "furniture", "");//住宅家具
								dimContainer.buildDimCheckBox($("#J_electric1"), "electricIds1", "electric", "");//住宅家电
								dimContainer.buildDimCheckBox($("#J_furniture6"), "furnitureIds6", "furniture", "");//平房家具
								dimContainer.buildDimCheckBox($("#J_electric6"), "electricIds6", "electric", "");//平房家电
								dimContainer.buildDimCheckBox($("#J_furniture7"), "furnitureIds7", "furniture", "");//别墅家具
								dimContainer.buildDimCheckBox($("#J_electric7"), "electricIds7", "electric", "");//别墅家电
								dimContainer.buildDimCheckBox($("#J_specialNeeds"), "specialDemandIds", "specialNeeds", "");//特殊需求
								dimContainer.buildDimCheckBox($("#J_locationType"), "locationIds", "locationType", "");//位置类型
								dimContainer.buildDimCheckBox($("#J_purchaseMotivation"), "purchaseMotivation", "purchaseMotivation", "");//购房动机
								dimContainer.buildDimChosenSelector($(".J_fitmentTypeId"), "housedecorationstatus","");//装修
								dimContainer.buildDimChosenSelector($(".J_layoutStructure"), "layoutStructure","");//户型结构
								//dimContainer.buildDimChosenSelector($(".J_buildingType"), "buildingType","");//楼体类型
								dimContainer.buildDimChosenSelector($(".J_bedRoom1"), "houseStructure","");//户型
								dimContainer.buildDimChosenSelector($(".J_bedRoom2"), "houseStructure","");//户型
								dimContainer.buildDimChosenSelector($(".J_equityTypeId"), "houseown","");//产权
								dimContainer.buildDimChosenSelector($(".J_urgencyTypeId"), "urgency","");//紧急程度
								dimContainer.buildDimChosenSelector($(".J_loanTypeId"), "loanType","");//贷款类型
								dimContainer.buildDimChosenSelector($("#customerSource"), "customerSource","");//客户来源
								dimContainer.buildDimChosenSelector($("#J_finalAssessment"), "finalAssessment","");//客户评价
								selectNational($("#J_nationalityCode"), "CN");
								flag=0;
							}

						}
					});
				}else{
					if (data.actionName == "canFindClientByCustomerId" || data.actionName == "canMoveClientToOwner") {
                        location.href = basePath + "/customer/main/findbuyerclientbycustomerid.htm?customerId=" + result.data.customerId;
                    } else {
                        commonContainer.alert(data.msg);
                    }
				}
			}, {
				dataType:"json",      
			    contentType:"application/json", 
			});
		})
		
		function removeByValue(arr, val) {
		  for(var i=0; i<arr.length; i++) {
		    if(arr[i] == val) {
		      arr.splice(i, 1);
		      break;
		    }
		  }
		}

	$(document).delegate('.glyphicon-remove', 'click', function(event){
		removeByValue(arrphone, $(this).closest('tr').children('td').text());
		$(this).closest('tr').remove();
		
	})
	
	$('#buy_add_layer').on("click",'input[name=demandType]',function(){
		if($(this).is(':checked')){
			if($(this).val()==1){
				$("#residence").show();
			}else if($(this).val()==2){
				$("#shops").show();
			}else if($(this).val()==3){
				$("#office").show();
			}else if($(this).val()==4){
				$("#warehouse").show();
			}else if($(this).val()==5){
				$("#parking").show();
			}else if($(this).val()==6){
				$("#bungalow").show();
			}else if($(this).val()==7){
				$("#villa").show();
			}
		}else{
			if($(this).val()==1){
				$("#residence").hide();
			}else if($(this).val()==2){
				$("#shops").hide();
			}else if($(this).val()==3){
				$("#office").hide();
			}else if($(this).val()==4){
				$("#warehouse").hide();
			}else if($(this).val()==5){
				$("#parking").hide();
			}else if($(this).val()==6){
				$("#bungalow").hide();
			}else if($(this).val()==7){
				$("#villa").hide();
			}
		}
	})
	
})

function addfloor(elm){
    var build = $("#J_build");
    var form = $('#'+elm);
    build.val('').attr('data-id' , '');
	commonContainer.modal(
		'添加楼盘',
		$('#J_addfloor_layer'),
		function(index, layero) {
            var buildId = build.attr('data-id');
            if(!buildId){
				commonContainer.alert("请选择需求楼盘");
				return;
			}
            if ($('tr#' + buildId , form).length) {
                commonContainer.alert("该需求楼盘已经添加过");
                return;
            }
			var str='<tr id='+buildId+'><td>'+build.val()+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
            form.find('#dataTableFloor tbody').append(str);
			layer.close(index);
		}, 
		{
			overflow :true,
			area : ['400px','300px'],
			btns : [ '确定'],
			success:function(){
				searchBuild(build,true,'right')
			}
		});
}
function addarea(elm){
    var business = $("#J_business");
    var form = $('#'+elm);
    business.val('').attr('data-id' , '');
	$("#J_region").val('');
	commonContainer.modal(
		'添加商圈',
		$('#J_addarea_layer'),
		function(index, layero) {
		    var id = business.attr('data-id');
			if(!id){
				commonContainer.alert("请选择商圈");
				return;
			}
			var areaid = $("#J_region option:selected").val();
			var tr = form.find('tr#' + id);
            if (tr.length && tr.attr('area-id') === areaid) {
                commonContainer.alert("该商圈已经添加过");
                return false;
            }
			if($("#J_region option:selected").val()==''){
				var str='<tr id='+id+' area-id='+areaid+'><td>'+business.val()+'</td><td></td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
			}else{
				var str='<tr id='+id+' area-id='+areaid+'><td>'+business.val()+'</td><td>'+$("#J_region option:selected").text()+'</td><td><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
			}
            form.find('#dataTableArea tbody').append(str);
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

/*$(document).on("change",'.J_bedRoom1',function(){
	$(this).closest('form').validate({
		rules:{
			bedRoom1:{
				required: true
				//compareApartmentAfter: ".J_bedRoom2"
	        }
		},
		focusInvalid:true
	}).form();
})*/
/*$(document).on("change",'.J_bedRoom2',function(){
	$(this).closest('form').validate({
		rules:{
			bedRoom2:{
				required: true
				//compareApartment: ".J_bedRoom1"
		    }
		},
		focusInvalid:true
	}).form();
})*/


/*$(document).on("change",'#J_finalAssessment',function(){
$(this).closest('form').validate({
	rules:{
		customerFinalAssessmentId:{
			 required: true
	    }
	},
	focusInvalid:true
}).form();	
})*/

$(document).on("change",'#customerSource',function(){
/*	$(this).closest('form').validate({
		rules:{
			sourceId:{
				 required: true
		    },
		    isPurchaseAfterSales:{
				 required: true
		   },
		},
		focusInvalid:true
	}).form();*/
	$(".none").empty();
	var val=$(this).val();
	if(val==46||val==36||val==45||val==4||val==43||val==8){
		var str='<select id="customerSourceType" name="infoSourceId" class="form-control m-b" data-placeholder="请选择" required></select>';
		$(".none").append(str);
	}
	if(val==46){
		dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource29","10_29");
	}else if(val==36){
		dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource36","20_36");
	}else if(val==45){
		dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource45","30_45");
	}else if(val==4){
		dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource4","40_4");
	}else if(val==43){
		dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource43","50_43");
	}else if(val==8){
		dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource8","60_8");
	}
});


//提交表单 
function ajaxSubmit(index){
	var demandType=[];
	$('input[name="demandType"]:checked').each(function(){ 
		demandType.push($(this).val()); 
	}); 
	if(demandType.length==''){
		commonContainer.alert("请选择需求类型");
		return;
	}
	
	var val={};
	sureflag=0;
	//暂时注掉
	if(!customerValidate()){
		//console.log("失败")
		commonContainer.alert("存在不符合规则的数据！");
		sureflag=1;
		return;
	}
	var vali=0;
	$('input[name="demandType"]:checked').each(function(){ 
		$('.form'+$(this).val()+' #dataTableArea tbody').each(function(){
			if($(this).children('tr').length==0){
				vali=1;		
				return;
			}
		})
	})

	if(vali==1){
		commonContainer.alert("商圈必填");
		return;
	}
	val=$("#J_addForm").serializeJson();
	val.phones="##"+val.phones.split(",").join("##")+"##";
	var freeTimeIds='';
	if(val.freeTimeIds!=undefined){
		for(var i=0;i<val.freeTimeIds.length;i++){
			freeTimeIds+="##"+ val.freeTimeIds[i];
		}
		freeTimeIds=freeTimeIds+"##";
	}else{
		freeTimeIds=freeTimeIds;
	}
	val.customeTypeId=2;
	val.freeTimeIds=freeTimeIds;
	val.sourceId =$("#customerSource").val();
	val.infoSourceId=$("#customerSourceType").val();
	val.customerFinalAssessmentId =$("#J_finalAssessment").val();
	val.memo =$("#memo").val();
	var purchaseMotivation='';
	val.purchaseMotivation ='';
	var pms = $("[name='purchaseMotivation']:checked");
	if(pms.length>0){
		for(var i=0;i<pms.length;i++){
			purchaseMotivation+="##"+ pms.eq(i).val();
		}
		purchaseMotivation=purchaseMotivation+"##";
	}
	val.purchaseMotivation=purchaseMotivation;
	if(demandType.length>0){
		for(var j=0;j<demandType.length;j++){
			if(demandType[j]==1){
				val.hasHouse=1;
				val.house =$("#form1").serializeJson();
				var furnitureIds='';
				var electricIds='';
				var headingIds='';
				var ownerHouseNumberTypeId='';
				if(val.house.furnitureIds1!=undefined){
					for(var i=0;i<val.house.furnitureIds1.length;i++){
						furnitureIds+= "##"+val.house.furnitureIds1[i];
					}
					val.house.furnitureIds=furnitureIds+"##";
				}else{
					val.house.furnitureIds=furnitureIds;
				}
				delete val.house.furnitureIds1;
				if(val.house.electricIds1!=undefined){
					for(var i=0;i<val.house.electricIds1.length;i++){
						electricIds+= "##"+val.house.electricIds1[i];
					}
					val.house.electricIds=electricIds+"##";
				}else{
					val.house.electricIds=electricIds;
				}
				delete val.house.electricIds1;

				if(val.house.headingIds1!=undefined){
					for(var i=0;i<val.house.headingIds1.length;i++){
						headingIds+= "##"+val.house.headingIds1[i];
					}
					val.house.headingIds=headingIds+"##";
				}else{
					val.house.headingIds=headingIds;
				}
				delete val.house.headingIds1;
				if(val.house.ownerHouseNumberTypeId1!=undefined){
						val.house.ownerHouseNumberTypeId=val.house.ownerHouseNumberTypeId1;
				}
				delete val.house.ownerHouseNumberTypeId1;
				
				var buildingIds='';
				$("#form1 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				});
				if(buildingIds){
					val.house.buildingIds=buildingIds+"##";
				}else{
					val.house.buildingIds='';
				}				
				var businessIds='';
				$("#form1 #dataTableArea tbody tr").each(function(){
					businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
				});
				if(businessIds){
					val.house.businessIds=businessIds+"##";
				}else{
					val.house.businessIds='';
				}				
			}else if(demandType[j]==2){
				val.hasShop =1;				
				val.shop=$("#form2").serializeJson();
				var specialDemandIds='';
				var locationIds='';
				var ownerHouseNumberTypeId='';
				if(val.shop.specialDemandIds!=undefined){
					for(var i=0;i<val.shop.specialDemandIds.length;i++){
						specialDemandIds+= "##"+val.shop.specialDemandIds[i];
					}
					val.shop.specialDemandIds=specialDemandIds+"##";
				}else{
					val.shop.specialDemandIds=specialDemandIds;
				}
				
				if(val.shop.ownerHouseNumberTypeId3!=undefined){
					val.shop.ownerHouseNumberTypeId=val.shop.ownerHouseNumberTypeId3;
				}
				delete val.shop.ownerHouseNumberTypeId3;
				
				if(val.shop.locationIds!=undefined){
					for(var i=0;i<val.shop.locationIds.length;i++){
						locationIds+= "##"+val.shop.locationIds[i];
					}
					val.shop.locationIds=locationIds+"##";
				}else{
					val.shop.locationIds=locationIds;
				}				
				var buildingIds='';
				$("#form2 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.shop.buildingIds=buildingIds+"##";
				}else{
					val.shop.buildingIds='';
				}				
				var businessIds='';
				$("#form2 #dataTableArea tbody tr").each(function(){
					businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
				})
				if(businessIds){
					val.shop.businessIds=businessIds+"##";
				}else{
					val.shop.businessIds=businessIds;
				}
			}else if(demandType[j]==3){
				val.hasOfficeBuilding =1;				
				val.officeBuilding =$("#form3").serializeJson();
				var buildingIds='';
				$("#form3 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.officeBuilding.buildingIds=buildingIds+"##";
				}else{
					val.officeBuilding.buildingIds='';
				}				
				var businessIds='';
				$("#form3 #dataTableArea tbody tr").each(function(){
					businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
				})
				if(businessIds){
					val.officeBuilding.businessIds=businessIds+"##";
				}else{
					val.officeBuilding.businessIds='';
				}
			}else if(demandType[j]==4){
				val.hasWorkshopWarehouse =1;				
				val.workshopWarehouse =$("#form4").serializeJson();
				var buildingIds='';
				$("#form4 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.workshopWarehouse.buildingIds=buildingIds+"##";
				}else{
					val.workshopWarehouse.buildingIds='';
				}				
				var businessIds='';
				$("#form4 #dataTableArea tbody tr").each(function(){
					businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
				})
				if(businessIds){
					val.workshopWarehouse.businessIds=businessIds+"##";
				}else{
					val.workshopWarehouse.businessIds='';
				}
			}else if(demandType[j]==5){
				val.hasParkingGarage =1;				
				val.parkingGarage  =$("#form5").serializeJson();
				var buildingIds='';
				$("#form5 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.parkingGarage.buildingIds=buildingIds+"##";
				}else{
					val.parkingGarage.buildingIds='';
				}				
				var businessIds='';
				$("#form5 #dataTableArea tbody tr").each(function(){
					businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
				})
				if(businessIds){
					val.parkingGarage.businessIds=businessIds+"##";
				}else{
					val.parkingGarage.businessIds='';
				}
			}else if(demandType[j]==6){
				val.hasBungalow =1;				
				val.bungalow=$("#form6").serializeJson();
				var furnitureIds='';
				var electricIds='';
				var headingIds='';
				var ownerHouseNumberTypeId='';
				if(val.bungalow.ownerHouseNumberTypeId2!=undefined){
					val.bungalow.ownerHouseNumberTypeId=val.bungalow.ownerHouseNumberTypeId2;
				}
				delete val.bungalow.ownerHouseNumberTypeId2;
				
				if(val.bungalow.furnitureIds6!=undefined){
					for(var i=0;i<val.bungalow.furnitureIds6.length;i++){
						furnitureIds+= "##"+val.bungalow.furnitureIds6[i];
					}
					val.bungalow.furnitureIds=furnitureIds+"##";
				}else{
					val.bungalow.furnitureIds=furnitureIds;
				}
				delete val.bungalow.furnitureIds6;
				if(val.bungalow.electricIds6!=undefined){
					for(var i=0;i<val.bungalow.electricIds6.length;i++){
						electricIds+= "##"+val.bungalow.electricIds6[i];
					}
					val.bungalow.electricIds=electricIds+"##";
				}else{
					val.bungalow.electricIds=electricIds;
				}
				delete val.bungalow.electricIds6;
				if(val.bungalow.headingIds6!=undefined){
					for(var i=0;i<val.bungalow.headingIds6.length;i++){
						headingIds+= "##"+val.bungalow.headingIds6[i];
					}
					val.bungalow.headingIds=headingIds+"##";
				}else{
					val.bungalow.headingIds=headingIds;
				}
				delete val.bungalow.headingIds6;
				
				var buildingIds='';
				$("#form6 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.bungalow.buildingIds=buildingIds+"##";
				}else{
					val.bungalow.buildingIds='';
				}				
				var businessIds='';
				$("#form6 #dataTableArea tbody tr").each(function(){
					businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
				})
				if(businessIds){
					val.bungalow.businessIds=businessIds+"##";
				}else{
					val.bungalow.businessIds='';
				}
			}else if(demandType[j]==7){
				val.hasVilla =1;				
				val.villa =$("#form7").serializeJson();
				var furnitureIds='';
				var electricIds='';
				var headingIds='';
				var ownerHouseNumberTypeId='';
				if(val.villa.ownerHouseNumberTypeId4!=undefined){
					val.villa.ownerHouseNumberTypeId=val.villa.ownerHouseNumberTypeId4;
				}
				delete val.villa.ownerHouseNumberTypeId4;
				if(val.villa.furnitureIds7!=undefined){
					for(var i=0;i<val.villa.furnitureIds7.length;i++){
						furnitureIds+= "##"+val.villa.furnitureIds7[i];
					}
					val.villa.furnitureIds=furnitureIds+"##";
				}else{
					val.villa.furnitureIds=furnitureIds;
				}
				delete val.villa.furnitureIds7;
				if(val.villa.electricIds7!=undefined){
					for(var i=0;i<val.villa.electricIds7.length;i++){
						electricIds+="##"+ val.villa.electricIds7[i];
					}
					val.villa.electricIds=electricIds+"##";
				}else{
					val.villa.electricIds=electricIds;
				}
				delete val.villa.electricIds7;
				if(val.villa.headingIds7!=undefined){
					for(var i=0;i<val.villa.headingIds7.length;i++){
						headingIds+= "##"+val.villa.headingIds7[i];
					}
					val.villa.headingIds=headingIds+"##";
				}else{
					val.villa.headingIds=headingIds;
				}
				delete val.villa.headingIds7;
				var buildingIds='';
				$("#form7 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.villa.buildingIds=buildingIds+"##";
				}else{
					val.villa.buildingIds='';
				}				
				var businessIds='';
				$("#form7 #dataTableArea tbody tr").each(function(){
					businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
				})
				if(businessIds){
					val.villa.businessIds=businessIds+"##";
				}else{
					val.villa.businessIds='';
				}
			}
		}
	}
	
	
	console.log(JSON.stringify(val));
	//暂时注掉
/*		$.ajax({ 
	     type:"POST", 
	     url: basePath + '/customer/main/newbuyer.htm',
	     dataType:"json",      
	     contentType:"application/json",               
	     data:JSON.stringify(val), 
		 success : function(data) {
				if (data.code == 0) {
					commonContainer.alert('操作成功');
					layer.close(index);
					window.location.reload();
				}else{
					if (data.code == loginTimeoutCode){
						location.href = logoutUrl;
					} else {
						layer.alert(data.msg);
					}
				}
			}
	  }); */
		
		jsonPostAjax(basePath + '/customer/main/newbuyer', val, function() {
			commonContainer.alert('操作成功');
			layer.close(index);
			window.location.reload();//换成刷新iframe document.frames("name").location.reload(true);
			window.location.href=window.location.href;//兼容火狐刷新
		},{});
		
}