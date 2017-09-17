var houseId=getQueryString("houseid");
$(function(){
	
	dimContainer.buildDimRadio($("#J_loanrecord"), "loanrecord", "yesOrNo", "");//贷款记录
	dimContainer.buildDimChosenSelector($("#census"), "census", "census", "");//户籍信息
	
	dimContainer.buildDimChosenSelector($("#censusChectoutType"), "censusChectoutType", "censusChectoutType", "");//户籍迁出时间
	dimContainer.buildDimChosenSelector($("#decorationStatus"), "housedecorationstatus", "decorateLevel", "");//装修状况
	dimContainer.buildDimChosenSelector($("#fitmentYear"),"fitmentYear", "decorateTime",  "");//装修年代
	dimContainer.buildDimChosenSelector($("#buyYears"), "buyYears", "buyYears", "");//购房年限
	dimContainer.buildDimChosenSelector($("#useStatus"), "useStatus", "statusNow", "");//使用现状
	dimContainer.buildDimChosenSelector($("#freetimeType"), "freetimeType", "freetimeType", "");//腾空时间
	dimContainer.buildDimChosenSelector($("#payType"),"payType", "pay", "");//付款方式
	dimContainer.buildDimChosenSelector($("#certLoan"), "certLoan", "certLoan", "");//证贷情况
	dimContainer.buildDimChosenSelector($("#buyYears"), "buyYears", "buyYears", "");//购房年限
	dimContainer.buildDimChosenSelector($("#rentType"),"rentType", "rentMode", "");//出租形式
	dimContainer.buildDimCheckBox($("#J_furniture"), "furniture", "furniture", "");
	dimContainer.buildDimCheckBox($("#J_electric"),"equipment", "electric", "");
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
$("#dueDate").click(function(){
	datelayer( "#dueDate", {
		format: 'YYYY-MM-DD'
	});
})
$("#freetime").click(function(){
	datelayer( "#freetime", {
		format: 'YYYY-MM-DD'
	});
})
	$(document).on("change",'#freetimeType',function(){
		if($(this).val()==5){
			$(".freetime").show();
		}else{
			$(".freetime").hide();
		}
	})
	
	$(document).on("click",'#J_buytolease_btn',function(){
		var val={};
		var validate = true;
		if(!buytoleaseValidate()){
			console.log("校验失败");
			commonContainer.alert("存在不符合规则的数据！");
			return;
		} 
		val=$("#formbuytolease").serializeJson();
		var furnitureIds='';
		var electricIds='';
		if(val.furniture!=undefined){
			for(var i=0;i<val.furniture.length;i++){
				furnitureIds+= "##"+val.furniture[i]+":"+$("#num_furniture"+val.furniture[i]).val();
			}
			val.furniture=furnitureIds+"##";
		}else{
			val.furniture=furnitureIds;
		}
		if(val.equipment!=undefined){
			for(var i=0;i<val.equipment.length;i++){
				electricIds+="##"+ val.equipment[i];
			}
			val.equipment=electricIds+"##";
		}else{
			val.equipment=electricIds;
		}
		val.housesid=houseId;
		console.log(val);
		console.log(JSON.stringify(val));
		jsonPostAjax(basePath + '/house/informationSupplement/housingTransferLease', val, function(result) {
			commonContainer.alert('操作成功');
			/*layer.close(index);
			window.location.reload();//换成刷新iframe document.frames("name").location.reload(true);
*/			window.location.href="../main/leasedetail.htm?houseid="+result.data;
		},{});
	})
	$("#checkAll-electric").click(function(){
		if($(this).is(":checked")){
			$("input[name='equipment']").prop("checked","true"); 
		}else{
			$("input[name='equipment']").removeAttr("checked"); 
		}
	})
	$("#checkAll-furniture").click(function(){
		if($(this).is(":checked")){
			$("input[name='furniture']").prop("checked","true"); 
			$("input[name='furniture']").each(function(){
				var str='<div class="label-num"><input type="text" id="num_'+$(this).attr('id')+'" value="1" class="form-control num"></div>'
				if($(this).closest(".checkbox").find('.label-num').length==0){
					$(this).closest(".checkbox").append(str);
				}
			})
			
			
		}else{
			$("input[name='furniture']").removeAttr("checked"); 
			$("input[name='furniture']").closest(".checkbox").children('.label-num').remove();
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
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 