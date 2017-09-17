var houseId=getQueryString("houseid");
$(function(){
	dimContainer.buildDimRadio($("#J_newBuyDemand"), "newBuyDemand", "haveOrNot", "");//贷款记录
	dimContainer.buildDimChosenSelector($("#census"), "census", "census", "");//户籍信息
	dimContainer.buildDimCheckBox($("#taxType"), "taxtype", "taxType", "1");//税种

	dimContainer.buildDimChosenSelector($("#decorationStatus"), "housedecorationstatus", "decorationStatus", "");//装修状况
	dimContainer.buildDimChosenSelector($("#fitmentYear"), "fitmentYear", "fitmentYear", "");//装修年代
	dimContainer.buildDimChosenSelector($("#buyYears"), "buyYears", "buyYears", "");//购房年限
	dimContainer.buildDimChosenSelector($("#useStatus"), "useStatus", "useStatus", "");//使用现状
	dimContainer.buildDimChosenSelector($("#freetimeType"), "freetimeType", "freetimeType", "");//腾空时间
	
	dimContainer.buildDimChosenSelector($("#certLoan"), "certLoan", "certLoan", "");//证贷情况
//	dimContainer.buildDimChosenSelector($("#buyYears"), "buyYears", "buyYears", "");//购房年限
	
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
	$(document).on("change",'#census',function(){
		if($(this).val()==1){
			$(".nonecensus").show();
			dimContainer.buildDimChosenSelector($("#censusChectoutType"), "censusChectoutType", "censusChectoutType", "");//户籍迁出时间
		}else{
			$(".nonecensus").hide();
		}
	})
$(document).on("click",'input[name="taxtype"]',function(){
	if($(this).attr("id")=='taxtype1'){
		return false;
	}
})
$("#freetime").click(function(){
	datelayer( "#freetime", {
		format: 'YYYY-MM-DD'
	});
})
$("#taxDate").click(function(){
	datelayer( "#taxDate", {
		format: 'YYYY-MM-DD'
	});
})
$("#housecodeDate").click(function(){
	datelayer( "#housecodeDate", {
		format: 'YYYY-MM-DD'
	});
})
$(document).on("change",'#certLoan',function(){
	if($(this).val()==4 || $(this).val()==2){
		$(".withoutCredit").show();
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
	$(document).on("click",'#J_leasetobuy_btn',function(){
		var val={};
		var validate = true;
		if(!leasetobuyValidate()){
			console.log("校验失败");
			commonContainer.alert("存在不符合规则的数据！");
			return;
		} 
		val=$("#formleasetobuy").serializeJson();
		var taxtypes='';
		if(val.taxtype!=undefined){
			for(var i=0;i<val.taxtype.length;i++){
				taxtypes+="##"+ val.taxtype[i];
			}
			val.taxtype=taxtypes+"##";
		}else{
			val.taxtype=taxtypes;
		}
		val.housesid=houseId;
		console.log(val);
		console.log(JSON.stringify(val));
		jsonPostAjax(basePath + '/house/informationSupplement/leaseTransferHousing', val, function(result) {
			commonContainer.alert('操作成功');
			/*layer.close(index);
			window.location.reload();//换成刷新iframe document.frames("name").location.reload(true);
*/			window.location.href="../main/buydetail.htm?houseid="+result.data;
		},{});
	})
	function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 