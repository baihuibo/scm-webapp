var newhouse=1;//判定添加虚拟房源还是普通房源
var virtualtype='';

$(function(){
	searchHouses($("#J_build"), true, 'left').then(function(){
		$("#J_build").on('onDataRequestSuccess', function (e, result) {       	
			result.value = result.data;
			console.log(result.value);
			result.value.push({'name':'添加虚拟房源'});
		    console.log('onDataRequestSuccess: ', result);
		}).on('onSetSelectValue', function (e, keyword) {
			var value=$(this).attr("data-id");
			var val=value.split(';')[0];
		    if(val){
		    	 findbuildinglist($("#J_building"),0,val,'');
		         findbuildinglist($("#unit"),1,'','');
		         findbuildinglist($("#floor"),2,'','');
		         findbuildinglist($("#houseNumber"),3,'','');
		    }else{
		    	virtualtype=1; 
		    	fictitiousHref(1,'');
		    }
		})		
	}
	); // 楼盘
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
})
$("select").chosen({
	width : "100%",
	allow_single_deselect: true
});
$("#dueDate").click(function(){
	laydate({
		  elem: '#dueDate',
		  format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
		  choose: function(datas){
			  $("#dueDate").val(datas.substring(0,7)); 
		  }
		});
})
$("#deedDate").click(function(){
	datelayer( "#deedDate", {
		format: 'YYYY-MM-DD'
	});
})
$("#dateIssue").click(function(){
	datelayer( "#dateIssue", {
		format: 'YYYY-MM-DD'
	});
})
$("#freetime").click(function(){
	datelayer( "#freetime", {
		format: 'YYYY-MM-DD'
	});
})
$(document).on("click",'#form1 .chosen-container',function(){
	if($(this).siblings('select').find('option').length!=0){
		if($(this).siblings('select').find("option[value='-1']").length==0){
			var str='<option value="-1">添加虚拟房源</option>'
				$(this).siblings('select').append(str);
				$(this).siblings('select').trigger("chosen:updated");
		}
		
	}
})
$(document).on("change",'.J_chosen',function(){
	if($(this).val()==-1){
		var type;
		var idval;
		var typeresult;
		var id=$(this).attr('id');
		if(id=='J_building'){
			virtualtype=2;
			$('#unit').removeAttr('disabled');
			$('#floor').removeAttr('disabled');
			$('#houseNumber').removeAttr('disabled');
			$("select").trigger("chosen:updated");
			type=2;
			idval=$("#J_build").attr('data-id');
			typeresult='';
		}else if(id=='unit'){
			virtualtype=3;
			$('#floor').removeAttr('disabled');
			$('#houseNumber').removeAttr('disabled');
			$("select").trigger("chosen:updated");
			type=3;
			if($("#J_building").val()==null){
				idval=$("#J_build").attr('data-id');	
				typeresult=0;
			}else{
				idval=$("#J_building").val();
				typeresult=1;
			}			
		}else if(id=='floor'){
			virtualtype=4; 
			$('#houseNumber').removeAttr('disabled');
			$("select").trigger("chosen:updated");
			type=4;
			if($("#unit").val()==null){				
				if($("#J_building").val()==null){
					idval=$("#J_build").attr('data-id');
					typeresult=0;
				}else{
					idval=$("#J_building").val();
					typeresult=1;
				}				
			}else{
				idval=$("#unit").val();
				typeresult=2;
			}
		}else if(id=='houseNumber'){
			virtualtype=5; 
			type=5;
			if($("#floor").val()==null){
				if($("#unit").val()==null){				
					if($("#J_building").val()==null){
						idval=$("#J_build").attr('data-id');
						typeresult=0;
					}else{
						idval=$("#J_building").val();
						typeresult=1;
					}				
				}else{
					idval=$("#unit").val();
					typeresult=2;
				}
			}else{
				idval=$("#floor").val();
				typeresult=3;
			}
			
		}
		fictitiousHref(type,idval.split(';')[0],typeresult);
	}
})
$(document).on("change",'#J_building',function(){
	var val=$(this).val().split(';')[0];
	findbuildinglist($("#unit"),1,val,'');
    findbuildinglist($("#floor"),2,'','');
    findbuildinglist($("#houseNumber"),3,'','');
})
$(document).on("change",'#unit',function(){
	var val=$(this).val().split(';')[0];
	findbuildinglist($("#floor"),2,val,'');
	findbuildinglist($("#houseNumber"),3,'','');
})
$(document).on("change",'#floor',function(){
	var val=$(this).val().split(';')[0];
	findbuildinglist($("#houseNumber"),3,val,'');
})
var val={};
window.onload=function(){
	dimContainer.buildDimRadio($("#gender"), "genderId", "gender", "1");//性别
	dimContainer.buildDimCheckBox($("#towards"), "towards", "orientation", "");//朝向
	dimContainer.buildDimChosenSelector($("#buildingtype"), "buildType", "buildType", "");//建筑年代
	dimContainer.buildDimChosenSelector($("#architecture"), "architecture", "architecture", "");//建筑结构
	dimContainer.buildDimChosenSelector($("#houseown"), "houseown", "houseown", "");//产权性质
	dimContainer.buildDimChosenSelector($("#layoutstructure"), "layoutStructure", "layoutStructure", "");//户型结构
	dimContainer.buildDimChosenSelector($("#housetype"), "plannedUses", "plannedUses", "");//土地规划用途
	dimContainer.buildDimChosenSelector($("#landuselife"), "landUseLife", "landUseLife", "");//土地使用年限
	
	dimContainer.buildDimChosenSelector($("#contactType"), "contactType", "contactType", "");//联系人类别
	dimContainer.buildDimChosenSelector($("#ownership"), "ownership", "ownership", "");//与产权人关系
	
	dimContainer.buildDimChosenSelector($("#decorationStatus"), "housedecorationstatus", "decorationStatus", "");//装修状况
	dimContainer.buildDimChosenSelector($("#fitmentYear"), "fitmentYear", "fitmentYear", "");//装修年代
	dimContainer.buildDimChosenSelector($("#useStatus"), "useStatus", "useStatus", "");//使用现状
	dimContainer.buildDimChosenSelector($("#freetimeType"), "freetimeType", "freetimeType", "");//使用现状
	
	dimContainer.buildDimChosenSelector($("#certLoan"), "certLoan", "certLoan", "");//证贷情况
	dimContainer.buildDimChosenSelector($("#rentType"), "rentType", "rentType", "");//出租形式
	dimContainer.buildDimChosenSelector($("#payType"), "payType", "payType", "");//付款方式
	
	dimContainer.buildDimChosenSelector($("#ishavewindow"), "yesOrNo", "hasWindow", "");//卫生间是否带窗
	dimContainer.buildDimChosenSelector($("#whethergarden"), "yesOrNo", "hasGarden", "");//是否带花园
	dimContainer.buildDimChosenSelector($("#whethergarage"), "yesOrNo", "hasCarport", "");//是否有车库
	dimContainer.buildDimChosenSelector($("#whetherbasement"), "yesOrNo", "hasBasement", "");//是否有地下室
	
	dimContainer.buildDimChosenSelector($("#shopslevel"), "level", "level", "");//登记
	dimContainer.buildDimChosenSelector($("#buildingsstackedway"), "overlayType", "overlayType", "");//叠加方式
	dimContainer.buildDimChosenSelector($("#airconditiontype"), "airConditionType", "airConditionType", "");//空调方式
	
	dimContainer.buildDimCheckBox($("#J_furniture"), "furniture", "furniture", "");
	dimContainer.buildDimCheckBox($("#J_electric"), "electric", "electric", "");
	var str='';
	var numArr=['零','一','二','三','四','五','六','七','八','九','十']
	for(var i=0;i<21;i++){
		if(i>9){
			str+='<option value="'+i+'">'+i+'</option>';
		}else{
			str+='<option value="0'+i+'">'+i+'</option>';
		}
	}
	$(".layout").append(str);
	$(".layout").trigger("chosen:updated");
	var date='';
	for(var j=2017;j>=1900;j--){
		date+='<option value="'+j+'">'+j+'</option>';
	}
	$("#buildingyear").append(date);
	$("#buildingyear").trigger("chosen:updated");
}
var resultDetail={};
	$(".J_next,.J_nextadd").click(function(){
		var flag=0;
		var index=$(this).closest(".tab-pane").index();
		var nextindex=Number(index)+Number(1);			
		//检验form-nextindex 表单
		var islock='';

		if(nextindex==1){
			if($("#houseNumber").val()==null||$("#houseNumber").val()==''){
				commonContainer.alert("此页信息尚未填写完整");
				return false;
			}else{
				jsonGetAjax(basePath + '/house/main/checkhousevalidity', {"businesstype":1,"buildinghouseid":$("#houseNumber").val().split(';')[0]}, function(result) {
					var operationalservicetype= $("#houseNumber option[value='"+$("#houseNumber").val()+"']").attr("operationalservicetype");
					if(operationalservicetype.indexOf("1") == -1 ){
						commonContainer.alert("该房间不能做租赁业务");
						return false;
					}
					val.houseBuildingInfoVo=$("#form1").serializeJson();
					val.houseBuildingInfoVo.conmmunityid=$('#J_build').attr('data-id').split(';')[1];
					if(val.houseBuildingInfoVo.buildingid){
						val.houseBuildingInfoVo.buildingid=val.houseBuildingInfoVo.buildingid.split(';')[1];
					}
					if(val.houseBuildingInfoVo.buildingunitid){
						val.houseBuildingInfoVo.buildingunitid=val.houseBuildingInfoVo.buildingunitid.split(';')[1];
					}
					if(val.houseBuildingInfoVo.buildingfloorid){
						val.houseBuildingInfoVo.buildingfloorid=val.houseBuildingInfoVo.buildingfloorid.split(';')[1];
					}
					if(val.houseBuildingInfoVo.buildinghouseid){
						val.houseBuildingInfoVo.buildinghouseid=val.houseBuildingInfoVo.buildinghouseid.split(';')[1];
					}
					
					console.log(JSON.stringify(val));
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({"data-toggle":"tab"});
					$(".nav-tabs li").eq(nextindex).children(".taba").attr({"href":"#tab-"+(nextindex+1)});
					$('#lease-add li:eq('+nextindex+') a').tab('show');
					$(".nav-tabs li").each(function(){
						if($(this).index()<nextindex){
							$(this).children(".taba").removeAttr("data-toggle");
							$(this).children(".taba").removeAttr("href");
						}
					});
					jsonGetAjax(basePath + '/building/directory/findhousedetail', {"id":$("#houseNumber").val().split(';')[0]}, function(result) {
						islock=result.data.islock;
						resultDetail=result.data;
						/*if(result.data.islock!=0){
							//锁定，禁止修改
							$('input,select,textarea',$('form[name="form2"]')).prop('disabled','disabled');
							$("select").trigger("chosen:updated");
							$("#heatingfee").prop('disabled','disabled');
							$("#propertyfee").prop('disabled','disabled');
							
						}*/
						if(result.data.heatingfee){
							$("#heatingfee").val(result.data.heatingfee);
						}
						if(result.data.propertyfee){
							$("#propertyfee").val(result.data.propertyfee);
						}
						
						$('input,select,textarea',$('form[name="form2"]')).each(function(){
							if($(this).attr('id')!='bedroom'&&$(this).attr('id')!='livingroom'&&$(this).attr('id')!='kitchen'&&$(this).attr('id')!='toilet'&&$(this).attr('id')!='balcony'&&$(this).attr('name')!='towards'){							
								
								for(var key in result.data){
									if(key=$(this).attr('id')){
										$(this).val(result.data[key]);
									}
								}
								if($(this).attr('id')=='vifloor'){
									if(result.data.floor){
										$(this).val(result.data.floor);
									}								
								}
							}else{
								if($(this).attr('name')=='towards'){
									var val=result.data.towards;
									if(val){
										if(val.toString().indexOf('##')!=-1){
											var flavors =val.split("##");
											var flavorsval=flavors.splice(1,flavors.length-2)
											for(var i=0;i<flavorsval.length;i++){
												$("input[name='towards'][value="+flavorsval[i]+"]").attr("checked","checked");
											}
										}else{								
											$("input[id='towards'][value="+val+"]").attr("checked","checked");
										}	
									}										
									
								}else{
									var val=result.data.housetype;
									var val=result.data.airConditionType;
									if(val){
										$("select[id='bedroom']").val(val.substr(0,2));
										$("select[id='livingroom']").val(val.substr(2,2));
										$("select[id='kitchen']").val(val.substr(4,2));
										$("select[id='toilet']").val(val.substr(6,2));
										$("select[id='balcony']").val(val.substr(8,2));
									}
									
									
								}
							}
							
							
							$("#address").val((result.data.districtname?result.data.districtname:'')+(result.data.spraypropertyname?result.data.spraypropertyname:'')+(result.data.spraybuildingname?result.data.spraybuildingname:'')+(result.data.sprayunitname?result.data.sprayunitname:'')+(result.data.sprayfloorname?result.data.sprayfloorname:'')+(result.data.sprayhouseno?result.data.sprayhouseno:''));
							$("#cardaddress").val((result.data.districtname?result.data.districtname:'')+(result.data.propertyname?result.data.propertyname:'')+(result.data.buildingname?result.data.buildingname:'')+(result.data.unitname?result.data.unitname:'')+(result.data.houseno?result.data.houseno:''));
							$("#otheraddress").val((result.data.districtname?result.data.districtname:'')+(result.data.propertyothername?result.data.propertyothername:'')+(result.data.buildingothername?result.data.buildingothername:'')+(result.data.unitothersname?result.data.unitothersname:'')+(result.data.otherno?result.data.otherno:''));
							
							$("select").trigger("chosen:updated");
						})
					})					
				})
			}
		}else if(nextindex==2){


			
			if($(".normal").is(":hidden")){
				if($('#area').val==''){
					commonContainer.alert("区域的必填！");
					return;
				}
				
				if($("#spraypropertyname").val()==''&&$("#spraybuildingname").val()==''&&$("#sprayunitname").val()==''&&$("#sprayfloorname").val()==''&&$("#sprayhouseno").val()==''){
					commonContainer.alert("喷涂地址的必填！");
					return;
				}
				if($("#sprayhouseno").val()==''){
					commonContainer.alert("喷涂地址门牌号的必填！");
					return;
				}
				if($("#bedroom").val()==0&&$("#livingroom").val()==0){
            		commonContainer.alert("存在不合规数据，室或厅必须有一项大于1！");
					  return;
            	}
				if(!housePhysicsValidate()){
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				} 
				$('#district').val($("#area").val());
				$('#district').val($("#area").val());
				if($("#area").val()!=''){
					$('#districtname').val($("#area").find("option:selected").text());
				}else{
					$('#districtname').val('');
				}
				$("#address").val($("#area").find("option:selected").text()+$("#spraypropertyname").val()+$("#spraybuildingname").val()+$("#sprayunitname").val()+$("#sprayfloorname").val()+$("#sprayhouseno").val());
				var cardaddress=$("#propertyname").val()+$("#buildingname").val()+$("#unitname").val()+$("#floorname").val()+$("#houseno").val();
				if(cardaddress!=''){
					$("#cardaddress").val($("#area").find("option:selected").text()+cardaddress);
				}else{
					$("#cardaddress").val('');
				}
				var otheraddress=$("#propertyothername").val()+$("#buildingothername").val()+$("#unitothersname").val()+$("#floorothername").val()+$("#otherno").val()
				if(otheraddress!=''){
					$("#otheraddress").val($("#area").find("option:selected").text()+otheraddress);
				}else{
					$("#otheraddress").val('');
				}
			
				val.housePhysicsInfoVo=$("#form2").serializeJson();			
				var towards='';
				if(val.housePhysicsInfoVo.towards!=undefined){
					for(var i=0;i<val.housePhysicsInfoVo.towards.length;i++){
						towards+= "##"+val.housePhysicsInfoVo.towards[i];
					}
					val.housePhysicsInfoVo.heading=towards+"##";
				}else{
					val.housePhysicsInfoVo.heading=towards;
				}
				delete val.housePhysicsInfoVo.towards;
				delete val.housePhysicsInfoVo.towards;
				delete val.housePhysicsInfoVo.spraybuildingname;
				delete val.housePhysicsInfoVo.sprayunitname;
				delete val.housePhysicsInfoVo.sprayfloorname;
				delete val.housePhysicsInfoVo.sprayhouseno;
				delete val.housePhysicsInfoVo.buildingname;
				delete val.housePhysicsInfoVo.unitname;
				delete val.housePhysicsInfoVo.floorname;
				delete val.housePhysicsInfoVo.houseno;
				delete val.housePhysicsInfoVo.buildingothername;
				delete val.housePhysicsInfoVo.unitothersname;
				delete val.housePhysicsInfoVo.floorothername;
				delete val.housePhysicsInfoVo.otherno;
				
				val.housePhysicsInfoVo.conmmunityname=$("#spraypropertyname").val();			
				val.housePhysicsInfoVo.buildingname=$("#spraybuildingname").val();
				val.housePhysicsInfoVo.buildingunitname=$("#sprayunitname").val();
				val.housePhysicsInfoVo.buildingfloorname=$("#sprayfloorname").val();
				val.housePhysicsInfoVo.buildinghousename=$("#sprayhouseno").val();
				
			}else{			
				if($("#bedroom").val()==0&&$("#livingroom").val()==0){
            		commonContainer.alert("存在不合规数据，室或厅必须有一项大于1！");
					  return;
            	}
				//if(islock==0){
					var validate = true;
					if(!housePhysicsValidate()){
						console.log("校验失败");
						commonContainer.alert("存在不符合规则的数据！");
						return;
					} 
					
				//}		
				/*if(islock!=0){
					$('input,select,textarea',$('form[name="form2"]')).removeAttr('disabled');
					$('input,select,textarea',$('form[name="form2"]')).prop('readonly','readonly');
					$("select").trigger("chosen:updated");
				}*/
				val.housePhysicsInfoVo=$("#form2").serializeJson();			
				var towards='';
				if(val.housePhysicsInfoVo.towards!=undefined){
					for(var i=0;i<val.housePhysicsInfoVo.towards.length;i++){
						towards+= "##"+val.housePhysicsInfoVo.towards[i];
					}
					val.housePhysicsInfoVo.heading=towards+"##";
				}else{
					val.housePhysicsInfoVo.heading=towards;
				}
				delete val.housePhysicsInfoVo.towards;
			
				
				val.housePhysicsInfoVo.conmmunityname=resultDetail.spraypropertyname?resultDetail.spraypropertyname:'';			
				val.housePhysicsInfoVo.buildingname=resultDetail.spraybuildingname?resultDetail.spraybuildingname:'';
				val.housePhysicsInfoVo.buildingunitname=resultDetail.sprayunitname?resultDetail.sprayunitname:'';
				val.housePhysicsInfoVo.buildingfloorname=resultDetail.sprayfloorname?resultDetail.sprayfloorname:'';
				val.housePhysicsInfoVo.buildinghousename=resultDetail.sprayhouseno?resultDetail.sprayhouseno:'';
			}
				$(".nav-tabs li").eq(nextindex).children(".taba").attr({"data-toggle":"tab"});
				$(".nav-tabs li").eq(nextindex).children(".taba").attr({"href":"#tab-"+(nextindex+1)});
				$('#lease-add li:eq('+nextindex+') a').tab('show');
				$(".nav-tabs li").each(function(){
					if($(this).index()<nextindex){
						$(this).children(".taba").removeAttr("data-toggle");
						$(this).children(".taba").removeAttr("href");
					}
				});
            if(flag==0){
                dimContainer.buildDimChosenSelector($("#customerSource"), "customerSource","");
                flag=1;
            }
				console.log(val);
		}else if(nextindex==3){
			if($("#dataTablePeople tbody tr").length==0){
				commonContainer.alert("至少添加一条联系人信息！");
				return;
			}
			var validate = true;
			if(!customerSourceValidate()){
				console.log("校验失败");
				commonContainer.alert("存在不符合规则的数据！");
				return;
			} 
			var phoneChina=0;
			$("#dataTablePeople tbody tr").each(function(){
				if(!$(this).find('.phonelist').attr('china')){
					phoneChina=1;
					return;
				}
			})
			if(phoneChina==1){
				commonContainer.alert("请至少添加一个国内号码！！");
				return;
			}
			val.houseContactInfoVo=$("#form3").serializeJson();
			val.houseContactInfoVo.contactlist=[];
			$("#dataTablePeople tbody tr").each(function(){
				var obj={};
				obj.name=$(this).children('td').eq(1).text();
				obj.phones=$(this).children('td').eq(3).find('.phonelist').text();
				obj.relationshipid=$(this).children('td').eq(4).attr('id');
				obj.sexid=$(this).children('td').eq(2).attr('id');
				obj.typeid=$(this).children('td').eq(0).attr('id');
				val.houseContactInfoVo.contactlist.push(obj);
			})
			console.log(val);
			$(".nav-tabs li").eq(nextindex).children(".taba").attr({"data-toggle":"tab"});
			$(".nav-tabs li").eq(nextindex).children(".taba").attr({"href":"#tab-"+(nextindex+1)});
			$('#lease-add li:eq('+nextindex+') a').tab('show');
			$(".nav-tabs li").each(function(){
				if($(this).index()<nextindex){
					$(this).children(".taba").removeAttr("data-toggle");
					$(this).children(".taba").removeAttr("href");
				}
			});
		}else if(nextindex==4){
			var validate = true;
			if(!housedetailValidate()){
				console.log("校验失败");
				commonContainer.alert("存在不符合规则的数据！");
				return;
			} 
			if($("#freetimeType").val()==5){
				if($("#freetime").val()==''){
					commonContainer.alert("请填写具体腾空时间！");
					return;
				}
			}
			val.houseDetailInfoVo=$("#form4").serializeJson();
			console.log(val);
			$(".nav-tabs li").eq(nextindex).children(".taba").attr({"data-toggle":"tab"});
			$(".nav-tabs li").eq(nextindex).children(".taba").attr({"href":"#tab-"+(nextindex+1)});
			$('#lease-add li:eq('+nextindex+') a').tab('show');
			if(val.housePhysicsInfoVo.planneduses==3||val.housePhysicsInfoVo.planneduses==4){
				$("#company").text('元/平方米/天');
			}
			$(".nav-tabs li").each(function(){
				if($(this).index()<nextindex){
					$(this).children(".taba").removeAttr("data-toggle");
					$(this).children(".taba").removeAttr("href");
				}
			});
		}else if(nextindex==5){
			var isadd=1;
			var that=$(this);
			if($(this).hasClass('J_nextadd')){
				isadd=0;
			}
			
			var validate = true;
			if(!housePriceValidate()){
				console.log("校验失败");
				commonContainer.alert("存在不符合规则的数据！");
				return;
			} 
			that.attr({"disabled":"disabled"});
			val.housePriceInfoVo=$("#form5").serializeJson();
			if(val.housePriceInfoVo.num_furniture1){
				delete val.housePriceInfoVo.num_furniture1;
			}
			if(val.housePriceInfoVo.num_furniture2){
				delete val.housePriceInfoVo.num_furniture2;
			}
			if(val.housePriceInfoVo.num_furniture3){
				delete val.housePriceInfoVo.num_furniture3;
			}
			if(val.housePriceInfoVo.num_furniture4){
				delete val.housePriceInfoVo.num_furniture4;
			}
			var furnitureIds='';
			var electricIds='';
			if(val.housePriceInfoVo.furniture!=undefined){
				for(var i=0;i<val.housePriceInfoVo.furniture.length;i++){
					furnitureIds+= "##"+val.housePriceInfoVo.furniture[i]+":"+$("#num_furniture"+val.housePriceInfoVo.furniture[i]).val();
				}
				val.housePriceInfoVo.furniture=furnitureIds+"##";
			}else{
				val.housePriceInfoVo.furniture=furnitureIds;
			}			
			if(val.housePriceInfoVo.electric!=undefined){
				for(var i=0;i<val.housePriceInfoVo.electric.length;i++){
					electricIds+="##"+ val.housePriceInfoVo.electric[i];
				}
				val.housePriceInfoVo.electric=electricIds+"##";
			}else{
				val.housePriceInfoVo.electric=electricIds;
			}
			val.businesstype=1;
			if(newhouse==1){
				val.isvirtual=0;
			}else{
				val.isvirtual=1;
				val.virtualtype=virtualtype; 
			}
			console.log(val);
			console.log(JSON.stringify(val));
			jsonPostAjax(basePath + '/house/main/inserthouse', val, function(result) {
				that.removeAttr('disabled');
				commonContainer.alert('操作成功');
				layer.close(index);
				//window.location.reload();//换成刷新iframe document.frames("name").location.reload(true);
				if(isadd==1){
					if(newhouse==1){
						window.location.href="../main/leasedetail.htm?houseid="+result.data;//兼容火狐刷新
					}else{
						//跳转虚拟房源详情
						window.location.href="../virtual/detail.htm?type=1&houseid="+result.data;//兼容火狐刷新
					}
				}else{
					if(newhouse==1){
						window.location.href="../main/leasedetail.htm?houseid="+result.data+"&from=addCertificates";//兼容火狐刷新
					}else{
						//跳转虚拟房源详情
						window.location.href="../virtual/detail.htm?type=1&houseid="+result.data+"&from=addCertificates";//兼容火狐刷新
					}
				}
				
				
			},{
				errorCallBack:function(){
					that.removeAttr('disabled');
					layer.alert(errorMsg);
				}
			});
		}
		
	});
	$("#checkAll-electric").click(function(){
		if($(this).is(":checked")){
			$("input[name='electric']").prop("checked","true"); 
		}else{
			$("input[name='electric']").removeAttr("checked"); 
		}
	})
	$("#checkAll-furniture").click(function(){
		if($(this).is(":checked")){
			$("input[name='furniture']").prop("checked","true"); 
			$("input[name='furniture']").each(function(){
				var str='<div class="label-num"><input type="text" id="num_'+$(this).attr('id')+'" name="num_'+$(this).attr('id')+'" value="1" class="form-control num"></div>'
				if($(this).closest(".checkbox").find('.label-num').length==0){
					$(this).closest(".checkbox").append(str);
				}
			})
			
			
		}else{
			$("input[name='furniture']").removeAttr("checked"); 
			$("input[name='furniture']").closest(".checkbox").children('.label-num').remove();
		}
	})
	var bankflag=0;
	$(document).on("change",'#certLoan',function(){
		if($(this).val()==2||$(this).val()==4){
			$(".withoutCredit").show();
			if(bankflag==0){
				/*selectBankInfo($("#loanbank"),'');*/
				dimContainer.buildDimChosenSelector($("#loanbank"), "loanBank", "");//贷款银行
				bankflag=1;
			}
		}else{
			$(".withoutCredit").hide();
		}
	})
	$(document).on("change",'#freetimeType',function(){
		if($(this).val()==5){
			$(".freetime").show();
		}else{
			$(".freetime").hide();
		}
	})
$(document).on("click","input[name='equipment']",function(){
	if($(this).is(":checked")){		
		if($("input[name='equipment']").length==$("input[name='equipment']:checked").length){
			$("#checkAll-electric").prop("checked","true");
		}
	}else{
		$("#checkAll-electric").removeAttr("checked"); 
	}
})	
$(document).on("click","input[name='electric']",function(){
	if($(this).is(":checked")){		
		if($("input[name='electric']").length==$("input[name='electric']:checked").length){
			$("#checkAll-electric").prop("checked","true");
		}
	}else{
		$("#checkAll-electric").removeAttr("checked"); 
	}
})
$(document).on("click","input[name='furniture']",function(){
		if($(this).is(":checked")){
			var str='<div class="label-num"><input type="text" value="1" id="num_'+$(this).attr('id')+'" class="form-control num"></div>'
				$(this).closest(".checkbox").append(str);
			
			if($("input[name='furniture']").length==$("input[name='furniture']:checked").length){
				$("#checkAll-furniture").prop("checked","true");
			}
		}else{
			$(this).closest(".checkbox").children('.label-num').remove();
			$("#checkAll-furniture").removeAttr("checked"); 
		}
	})
	$(document).on("change",'#phonetype,#phonetype1',function(){
		if($(this).val()==2){
			$(this).closest('.row').find(".remark").show();
		}else{
			$(this).closest('.row').find(".remark").hide();
		}
	})
	$(document).on("change",'#customerSource',function(){
		
		$(".none").empty();
		var val=$(this).val();
		if(val==29||val==36||val==45||val==4||val==8){
			var str='<select id="customerSourceType" name="infosourceid" class="form-control m-b" data-placeholder="请选择" required></select>';
			$(".none").append(str);
		}
		if(val==29){
			dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource29","10_29");
		}else if(val==36){
			dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource36","20_36");
		}else if(val==45){
			dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource45","30_45");
		}else if(val==4){
			dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource4","40_4");
		/*}else if(val==43){
			dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource43","50_43");*/
		}else if(val==8){
			dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource8","60_8");
		}
	});
	
	$(document).on("click",'#J_add_phone',function(){
		var _this=$(this);
		var phonelist= _this.closest(".phone-show").find('.phonelist').text();
		if(phonelist!=''){
			phonelist=phonelist.split(',');
		}		
		editPhone(_this.closest(".phone-show").find('.phonelist'),phonelist,'add');	
	})
	function fictitiousHref(type,id,typeresult){
		selectArealist($('#area'),'');
		newhouse=0;
		val.houseBuildingInfoVo=$("#form1").serializeJson();
		for(var key in val.houseBuildingInfoVo){
			if(val.houseBuildingInfoVo[key]=='-1'){
				delete val.houseBuildingInfoVo[key];
			}
		}
		val.houseBuildingInfoVo.conmmunityid=$('#J_build').attr('data-id').split(';')[1];
		if(val.houseBuildingInfoVo.buildingid){
			val.houseBuildingInfoVo.buildingid=val.houseBuildingInfoVo.buildingid.split(';')[1];
		}
		if(val.houseBuildingInfoVo.buildingunitid){
			val.houseBuildingInfoVo.buildingunitid=val.houseBuildingInfoVo.buildingunitid.split(';')[1];
		}
		if(val.houseBuildingInfoVo.buildingfloorid){
			val.houseBuildingInfoVo.buildingfloorid=val.houseBuildingInfoVo.buildingfloorid.split(';')[1];
		}
		if(val.houseBuildingInfoVo.buildinghouseid){
			val.houseBuildingInfoVo.buildinghouseid=val.houseBuildingInfoVo.buildinghouseid.split(';')[1];
		}
		$(".nav-tabs li").eq(1).children(".taba").attr({"data-toggle":"tab"});
		$(".nav-tabs li").eq(1).children(".taba").attr({"href":"#tab-2"});
		$('#lease-add li:eq(1) a').tab('show');
		$(".nav-tabs li").each(function(){
			if($(this).index()<1){
				$(this).children(".taba").removeAttr("data-toggle");
				$(this).children(".taba").removeAttr("href");
			}
		});
		$('.normal').hide();
		$('.fictitious').show();
		$('#floorCon').show();
		if(type!=1){
			//行政区不可点击			
			jsonGetAjax(basePath + '/building/directory/selecthousedetailbyidandtype', {"id":id,'type':typeresult}, function(result) {
				$('#area').val(result.data.district);				
				$("select").trigger("chosen:updated");
				$('#area').prop('disabled','disabled');
				$("select").trigger("chosen:updated");
				$('input',$('form[name="form2"] #dataTableAdress')).each(function(){
					for(var key in result.data){
						if(key=$(this).attr('id')){
							$(this).val(result.data[key]);
						}
					}			
				})
				if(result.data.sprayfloorname){
					$('#floorname').val(result.data.sprayfloorname);
					$('#floorothername').val(result.data.sprayfloorname);
				}				
				
			})
			
		}

		$('#dataTableAdress tbody tr').each(function(){
			var val=type-1;
			for(var i=1;i<$(this).find('td').length;i++){
				//var index=$(this).find('td').index();
				if(i<=val){
					$(this).find('td').eq(i).find('input').prop('readonly','readonly');
				}
				
			}			
		})
		
	}
	$(document).delegate('#dataTablePeople .glyphicon-remove', 'click', function(event){
		$(this).closest('tr').remove();		
	})
	$(document).on("click",'#J_add_people',function(){
		commonContainer.modal(
				'联系方式录入',
				$('#addppeople_layer'),
				function(index, layero) {
					var validate = true;
					if(!peopleValidate()){
						console.log("校验失败");
						commonContainer.alert("存在不符合规则的数据！");
						return;
					} 
					var value = $("#customerPhone").val();
					if($("#phonetype").val()==1){						   
						  var mobile = /^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;							   
						  if(!(mobile.test(value))){
							  commonContainer.alert("国内手机格式不正确！");
							  return; 
						  }	
					}else if($("#phonetype").val()==2){
						 var tel = /^([0-9]{3,4}-)[0-9]{7,8}$/;  
						  if(!(tel.test(value))){
							  commonContainer.alert("国内座机格式不正确！");
							  return; 
						  }	
					}else{
						/*var reg=/^[0-9]+$/;
						 if(!reg.test(value)){
							  commonContainer.alert("国外电话格式不正确！");
							  return; 
						  }	*/
					}
					var genderval=$('input:radio[name="genderId"]:checked').val();
					var gender='';
					if(genderval==1){
						gender='先生';
					}else{
						gender='女士';
					}
						
					var str='<tr><td class="col-md-2" id="'+$("#contactType").val()+'">'+$("#contactType").find("option:selected").text()+'</td>'
						str+='<td class="col-md-2">'+$("#customerName").val()+'</td>'
						str+='<td class="col-md-2" id="'+genderval+'">'+gender+'</td>'
						if($("#phonetype").val()!=1&&$("#phonetype").val()!=2){
							str+='<td class="col-md-3"><div class="phone-show"><span class="phonelist">'+$("#customerPhone").val()+'</span><a id="J_add_phone" class="btn-green btn-bitbucket add-p" style="float: right;"><i class="glyphicon glyphicon-plus"></i></a></div></td>'					
						}else{
							str+='<td class="col-md-3"><div class="phone-show"><span class="phonelist" china="china">'+$("#customerPhone").val()+'</span><a id="J_add_phone" class="btn-green btn-bitbucket add-p" style="float: right;"><i class="glyphicon glyphicon-plus"></i></a></div></td>'							
						}
						str+='<td class="col-md-2" id="'+$("#ownership").val()+'">'+$("#ownership").find("option:selected").text();+'</td></tr>'
						str+='<td class="col-md-1"><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td>'
						if($("#contactType").val()==2){
							$("#dataTablePeople tbody").prepend(str);
						}else{
							$("#dataTablePeople tbody").append(str);
						}
					layer.close(index);
				}, 
				{
					overflow :true,
					area : ['1000px','80%'],
					btns : [ '保存'],
					success: function(){
						$("#addppeople_form")[0].reset();
						$('.J_chosen').trigger("chosen:updated");
						$("input[name='genderId']:eq(0)").prop("checked", "checked");
						$('.remark').hide();
					}
				}
	)
})

