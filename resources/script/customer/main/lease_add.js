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
	var sureflag=1;
	var arrphone=[];
	$("select").chosen({
			width : "100%",
			 allow_single_deselect: true
		});
	//$.validator.setDefaults({ ignore: ":hidden:not(select)" });
	$(document).on("change",'#phoneType',function(){
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
	$(document).delegate('#J_add_phone', 'click', function(event){
		commonContainer.modal(
				'添加电话',
				$('#addphone_layer'),
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
					overflow :true,
					area : ['500px','80%'],
					btns : [ '确定'],
					success: function(){
						if(flagadd==1){
							dimContainer.buildDimChosenSelector($("#phoneType"), "phoneType","1");
							flagadd=0;
						}
						
					}
				});
	})
	$(document).delegate('#J_addphone', 'click', function(event){
		var phone=$("#phone").val().trim();
		if(phone!=''){	
			if($("#phoneType").val()==1){
			    var isMob=/^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
				if(!isMob.test(phone)){
					commonContainer.alert("手机号格式不正确");
					return false;
				}
			}else if($("#phoneType").val()==2){
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
	
	$(document).delegate('#J_add_btn', 'click', function(event){
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
		jsonPostAjax(basePath + '/customer/main/checkleasebyphones',phone, function(result) {
            var data = result.data;
			if(!data.actionName && !data.customerId){
				
			$('#J_phone_layer').val(j_phone);
			commonContainer.modal(
					'租赁新增',
					$('#lease_add_layer'),
					function(index, layero) {
						if(sureflag==1){
							ajaxSubmit(index);
							
						}
					}, 
					{
						overflow :true,
						area : ['100%','100%'],
						btns : [ '保存'],
						success: function() {
							if(flag==1){
							dimContainer.buildDimRadio($("#gender"), "genderId", "gender");
							dimContainer.buildDimRadio($("#hometown"), "householdTypeId", "hometown");
							selectNational($("#nationalityCode"),"CN");
							dimContainer.buildDimCheckBox($("#watchHouseTime"), "freeTimeIds", "watchHouseTime", "");
							dimContainer.buildDimCheckBox($("#J_demandType"), "demandType", "demandType", "1");
							dimContainer.buildDimChosenSelector($("#customerSource"), "customerSource","");
							dimContainer.buildDimChosenSelector($("#J_finalAssessment"), "finalAssessment","");
							dimContainer.buildDimChosenSelector($(".J_bedRoom1"), "houseStructure","");
							dimContainer.buildDimChosenSelector($(".J_bedRoom2"), "houseStructure","");
							//dimContainer.buildDimChosenSelector($(".J_buildingType"), "buildingType","");
							dimContainer.buildDimChosenSelector($(".J_layoutStructure"), "layoutStructure","");
							/*dimContainer.buildDimCheckBox($(".J_furniture"), "furnitureIds", "furniture", "");*/
                                dimContainer.buildDimCheckBoxHasAll($("#J_furniture1"), "furnitureIds1", "furniture", "", "全部");
							dimContainer.buildDimCheckBox($("#J_furniture6"), "furnitureIds6", "furniture", "");
							dimContainer.buildDimCheckBox($("#J_furniture7"), "furnitureIds7", "furniture", "");
							/*dimContainer.buildDimCheckBox($(".J_electric"), "electricIds", "electric", "");*/
							dimContainer.buildDimCheckBox($("#J_electric1"), "electricIds1", "electric", "");
							dimContainer.buildDimCheckBox($("#J_electric6"), "electricIds6", "electric", "");
							dimContainer.buildDimCheckBox($("#J_electric7"), "electricIds7", "electric", "");
							dimContainer.buildDimChosenSelector($(".J_rentMode"), "rentMode","0");
							dimContainer.buildDimChosenSelector($(".J_paymentMode"), "paymentMode","");
							dimContainer.buildDimChosenSelector($(".J_foregift"), "foregift","");
							dimContainer.buildDimChosenSelector($(".J_urgency"), "urgency","");
							//dimContainer.buildDimChosenSelector($(".J_urgency"), "urgency","1");
							dimContainer.buildDimChosenSelector($(".J_isBill"), "isBill", "");
							
							dimContainer.buildDimCheckBox($("#J_bill1"), "billTypesId1", "bill", "2");
							dimContainer.buildDimCheckBox($("#J_bill2"), "billTypesId2", "bill", "2");
							dimContainer.buildDimCheckBox($("#J_bill3"), "billTypesId3", "bill", "2");
							dimContainer.buildDimCheckBox($("#J_bill4"), "billTypesId4", "bill", "2");
							dimContainer.buildDimCheckBox($("#J_bill5"), "billTypesId5", "bill", "2");
							dimContainer.buildDimCheckBox($("#J_bill6"), "billTypesId6", "bill", "2");
							dimContainer.buildDimCheckBox($("#J_bill7"), "billTypesId7", "bill", "2");
							
							dimContainer.buildDimChosenSelector($(".J_decorationStatus"), "housedecorationstatus","0");
							dimContainer.buildDimCheckBox($(".J_specialNeeds"), "specialDemandIds", "specialNeeds", "");
							dimContainer.buildDimCheckBox($(".J_locationType"), "locationIds", "locationType", "");
							
							flag=0;
							}
						}
					
					});
			}else{
				if(data.actionName=="canFindClientByCustomerId"||data.actionName=="canMoveClientToOwner"){
					location.href = basePath + '/customer/main/findleaseclientbycustomerid.htm?customerId='+data.customerId;
				}else{
					commonContainer.alert(data.msg);
				}
				
			}
		}, {
			dataType:"json",      
		    contentType:"application/json", 
		});
	})
$("#enterTime").click(function(){
	datelayer( "#enterTime", {
		format: 'YYYY-MM-DD',
		min :laydate.now()
	});
})
$("#enterTime1").click(function(){
	datelayer( "#enterTime1", {
		format: 'YYYY-MM-DD',
		min :laydate.now()
	});
})
$("#enterTime2").click(function(){
	datelayer( "#enterTime2", {
		format: 'YYYY-MM-DD',
		min :laydate.now()
	});
})
$(document).on("change",'.J_isBill',function(){
	if($(this).val()==2){
		$(this).closest('.row').find(".J_bill").show();
	}else{
		$(this).closest('.row').find(".J_bill").hide();
	}
});
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
	$('#lease_add_layer').on("click",'input[name=demandType]',function(){
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
	});
})
function addfloor(elm){
	var build = $("#J_build");
	var form = $('#'+elm);
    build.val('').attr('data-id' , '');
	commonContainer.modal(
			'添加楼盘',
			$('#addfloor_layer'),
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
				area : ['600px','450px'],
				btns : [ '确定'],
				success:function(){
					searchBuild(build,true,'right');
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
			$('#addarea_layer'),
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
					dimContainer.buildCanton($("#J_region"), '')
				}
			});
}
/*$(document).on("change",'.J_bedRoom1',function(){
	$(this).closest('form').validate({
		rules:{			
			bedRoom1:{
				required: true,
				compareApartmentAfter: ".J_bedRoom2"
	        }
		},
		focusInvalid:true
	}).form();
})
$(document).on("change",'.J_bedRoom2',function(){
	$(this).closest('form').validate({
		rules:{
			bedRoom2:{
				 required: true,
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
	/*$(this).closest('form').validate({
		rules:{
			sourceId:{
				 required: true
		    }
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
	var validate = true;	
	var demandType=[];	
	$('input[name="demandType"]:checked').each(function(){ 
		demandType.push($(this).val()); 		
	}); 	
	if(demandType.length==0){
		commonContainer.alert("请选择需求类型");
		return;
	}
	var val={};
	sureflag=0;
	//暂时注掉
	if(!customerValidate()){
		console.log("校验失败");
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
	val.customeTypeId=1;
	val.freeTimeIds=freeTimeIds;
	val.sourceId =$("#customerSource").val();
	val.infoSourceId=$("#customerSourceType").val();
	val.customerFinalAssessmentId =$("#J_finalAssessment").val();
	val.memo =$("#memo").val();
	if(demandType.length>0){
		for(var j=0;j<demandType.length;j++){
			if(demandType[j]==1){
				val.hasHouse=1;
				val.house =$("#form1").serializeJson();
				var furnitureIds='';
				var electricIds='';
				
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
				var billTypesId='';
				if(val.house.billTypesId1!=undefined){
					for(var i=0;i<val.house.billTypesId1.length;i++){
						billTypesId+= "##"+val.house.billTypesId1[i];
					}
					val.house.billTypesId=billTypesId+"##";
				}else{
					val.house.billTypesId=billTypesId;
				}
				delete val.house.billTypesId1;
				var buildingIds='';
				$("#form1 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.house.buildingIds=buildingIds+"##";
				}else{
					val.house.buildingIds='';
				}				
				var businessIds='';
				$("#form1 #dataTableArea tbody tr").each(function(){
					businessIds+="##"+$(this).attr("id")+':'+$(this).attr("area-id");
				})
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
				if(val.shop.specialDemandIds!=undefined){
					for(var i=0;i<val.shop.specialDemandIds.length;i++){
						specialDemandIds+= "##"+val.shop.specialDemandIds[i];
					}
					val.shop.specialDemandIds=specialDemandIds+"##";
				}else{
					val.shop.specialDemandIds=specialDemandIds;
				}
				
				if(val.shop.locationIds!=undefined){
					for(var i=0;i<val.shop.locationIds.length;i++){
						locationIds+= "##"+val.shop.locationIds[i];
					}
					val.shop.locationIds=locationIds+"##";
				}else{
					val.shop.locationIds=locationIds;
				}	
				var billTypesId='';
				if(val.shop.billTypesId2!=undefined){
					for(var i=0;i<val.shop.billTypesId2.length;i++){
						billTypesId+= "##"+val.shop.billTypesId2[i];
					}
					val.shop.billTypesId=billTypesId+"##";
				}else{
					val.shop.billTypesId=billTypesId;
				}
				delete val.shop.billTypesId2;
				var buildingIds='';
				$("#form2 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.shop.buildingIds=buildingIds+"##";
				}else{
					val.shop.buildingIds=buildingIds;
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
				var billTypesId='';
				if(val.officeBuilding.billTypesId3!=undefined){
					for(var i=0;i<val.officeBuilding.billTypesId3.length;i++){
						billTypesId+= "##"+val.officeBuilding.billTypesId3[i];
					}
					val.officeBuilding.billTypesId=billTypesId+"##";
				}else{
					val.officeBuilding.billTypesId=billTypesId;
				}
				delete val.officeBuilding.billTypesId3;
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
				var billTypesId='';
				if(val.workshopWarehouse.billTypesId4!=undefined){
					for(var i=0;i<val.workshopWarehouse.billTypesId4.length;i++){
						billTypesId+= "##"+val.workshopWarehouse.billTypesId4[i];
					}
					val.workshopWarehouse.billTypesId=billTypesId+"##";
				}else{
					val.workshopWarehouse.billTypesId=billTypesId;
				}
				delete val.workshopWarehouse.billTypesId4;
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
				val.parkingGarage =$("#form5").serializeJson();
				var buildingIds='';
				$("#form5 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.parkingGarage.buildingIds=buildingIds+"##";
				}else{
					val.parkingGarage.buildingIds=buildingIds;
				}		
				var billTypesId='';
				if(val.parkingGarage.billTypesId5!=undefined){
					for(var i=0;i<val.parkingGarage.billTypesId5.length;i++){
						billTypesId+= "##"+val.parkingGarage.billTypesId5[i];
					}
					val.parkingGarage.billTypesId=billTypesId+"##";
				}else{
					val.parkingGarage.billTypesId=billTypesId;
				}
				delete val.parkingGarage.billTypesId5;
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
				var billTypesId='';
				if(val.bungalow.billTypesId6!=undefined){
					for(var i=0;i<val.bungalow.billTypesId6.length;i++){
						billTypesId+= "##"+val.bungalow.billTypesId6[i];
					}
					val.bungalow.billTypesId=billTypesId+"##";
				}else{
					val.bungalow.billTypesId=billTypesId;
				}
				delete val.bungalow.billTypesId6;
				var buildingIds='';
				$("#form6 #dataTableFloor tbody tr").each(function(){
					buildingIds+='##'+$(this).attr("id");
				})
				if(buildingIds){
					val.bungalow.buildingIds=buildingIds+"##";
				}else{
					val.bungalow.buildingIds=buildingIds;
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
				var billTypesId='';
				if(val.villa.billTypesId7!=undefined){
					for(var i=0;i<val.villa.billTypesId7.length;i++){
						billTypesId+= "##"+val.villa.billTypesId7[i];
					}
					val.villa.billTypesId=billTypesId+"##";
				}else{
					val.villa.billTypesId=billTypesId;
				}
				delete val.villa.billTypesId7;
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
	console.log(val);
	jsonPostAjax(basePath + '/customer/main/newlease', val, function() {
		commonContainer.alert('操作成功');
		layer.close(index);
		window.location.reload();//换成刷新iframe document.frames("name").location.reload(true);
		window.location.href=window.location.href;//兼容火狐刷新
	},{});
		
}