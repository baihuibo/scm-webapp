$(function(){	
	var companyId= getQueryString("companyId");
	$("select").chosen({
		width : "100%",
		no_results_text: "未找到此选项!" 
	});
	 // 显示部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#deptId'), $('#J_deptLevel'));
	});
 /*新增部门规则*/
	$(document).delegate("#add-departmenttype","click",function(event){
		$.ajax({
			url : basePath + '/perf/authorize/getUserInfo',
			type : 'get',
			dataType : 'json',
			cache : true,
			success : function(result) {
				var keyId = $("h5").attr("keyId");
				companyId = result.data;
				$("#J_perfType").find("option:not(:first-child)").remove();
				dimContainer1.buildDimChosenSelector1($("#J_perfType"), companyId, keyId,"");
			}
		});	
		//添加表单，清空数据
		$("#J_perfType").val("");
		$('#J_perfType').trigger('chosen:updated');
		$('#J_calculate').find("option:not(:first-child)").remove();
		$("#J_calculate").val("");
		$("#J_calculate").trigger('chosen:updated');
		$("#J_lowerLimit").val("");
		$("#J_lowerLimit").removeAttr('disabled', 'disabled');
		$("#J_upperLimit").val("");	
		$("#J_upperLimit").removeAttr('disabled', 'disabled');
		$("#J_movePercent").val("1");
		//$("#J_movePercent").removeAttr('disabled', 'disabled');
		$("#J_percent").val("");
		$("#J_DefaultCalculate").val("");
		$('#J_DefaultCalculate').trigger('chosen:updated');
		$("#J_AllowAdjust").val("");
		$('#J_AllowAdjust').trigger('chosen:updated');
		$("#J_sharetypeadd")[0].reset();
		 /*
	      * 增加表单
	      * */
		var div = $('#add_sharetype');
		layer.open({
		  	type: 1,
		  	shift: 5,
	  		title: '业绩分单新增明细',
		  	area: ['90%', '400px'],
		  	skin : 'layui-layer-lan',
		  	content: div,
		  	btn : ['确定', '取消'],
	    	yes: function(index, layero) {
	    		if($("#J_AllowAdjust").val()==1){
		    		 if($("#J_upperLimit").val()==""){
		    		    	commonContainer.alert("请输入分单上限");
		    		    	return false;
		    		    }
		    		 if($("#J_lowerLimit").val()==""){
		    		    	commonContainer.alert("请输入分单下限");
		    		    	return false;
		    		    }
		    		/* if($("#J_percent").val()==""){
		    		    	commonContainer.alert("请输入默认比例");
		    		    	return false;
		    		    }*/
		    		 if($("#J_movePercent").val()==""){
		    		    	commonContainer.alert("请输入分单进阶百分比");
		    		    	return false;
		    		    }
		    		if(parseInt($("#J_lowerLimit").val())>parseInt($("#J_upperLimit").val())){
			    			commonContainer.alert("分单下限不能大于分单上限 ！");
			    			 return false;
			    		 }
			    	if(parseInt($("#J_lowerLimit").val())==parseInt($("#J_upperLimit").val())){
			    			commonContainer.alert("分单下限不能等于分单上限 ！");
			    			 return false;
			    		 }
			    	if(parseInt($("#J_movePercent").val())>parseInt($("#J_upperLimit").val())){
			    			commonContainer.alert("分单进阶百分比不能大于分单上限 ！");
			    			 return false;
			    		 }
	    		}
	    	
	    		 if($("#J_calculate").val()==""){
	    		    	commonContainer.alert("请输入计算方式");
	    		    	return false;
	    		    }
	    		if($("#J_perfType").val()==''){
	    			commonContainer.alert("分单类型不能为空！");
	    			 return false;
	    		 }
	    		if($("#J_DefaultCalculate").val()==''){
	    			commonContainer.alert("是否默认计算不能为空");
	    			 return false;
	    		 }
	    		if($("#J_calculate").val()==1){
	    			 if($("#J_percent").val()==""){
		    		    	commonContainer.alert("请输入默认比例");
		    		    	return false;
		    		    }
	    		}
	    		if($("#J_AllowAdjust").val()==''){
	    			commonContainer.alert("是否允许调整不能为空！");
	    			 return false;
	    		 }
	    		/*
	    		 * 获取列表中的业绩类型
	    		 * */
	    		/*
	    		 * 设置一个全局变量，用于存储业绩类型
	    		 * */
	    		var performance_ath=[];
	    		var performance_ath1=[];
	    		function performance(){
	    			$("#J_dataTable").each(function (){
	    		        var dataTable_length=$('#J_dataTable tbody tr').length-1;
	    		        //alert(dataTable_length);
	    		        for(var i=0;i<dataTable_length;i++){
	    		        	var performance=$("#J_dataTable  tbody").find("tr").eq(i).find("td").eq(0).text();
	    		        	var performance1=$("#J_dataTable  tbody").find("tr").eq(i).find("td").eq(2).text();
	    		        	performance_ath.push(performance)
	    		        	performance_ath1.push(performance1)
	    		        }
	    		       // alert(performance)
	    		        //console.log(performance_ath);
	    			});
	    		}
	    		performance();
	    		var performance_s;
	    		var sel_value=$("#J_perfType").find("option:selected").text();
	    		var sel_value1=$("#J_calculate").find("option:selected").text();
	    			for(var i=0;i<performance_ath.length;i++){
	    					if(performance_ath[i]==sel_value){
	    						commonContainer.alert('该业绩类型已选择，不允许重复添加');
	    						return false;
	    				}
	    					 if(performance_ath1[i]=='倒扣计算'){
		    						if(sel_value1=='倒扣计算'){
		    							commonContainer.alert('倒扣计算最多添加一条');
			    						return false;
		    						}
		    						
		    				}
	    			}
	    			
		  		$("#J_dataTable_1>tbody").find("tr").each(function(){
		  			var perfType=$("#J_perfType").find("option:selected").text();
		  			var perfTypeval=$("#J_perfType").find("option:selected").val();
		  			var DefaultCalculate=$("#J_DefaultCalculate").find("option:selected").text();
		  			var calculate=$("#J_calculate").find("option:selected").text();
		  			//var percent=$("#J_percent").val();
		  			var percent1="-";
		  			var percent=$("#J_percent").val() || "-";
		  			if(percent!="-"){
		  				percent1=percent+"%";
		  			}
		  			var AllowAdjust=$("#J_AllowAdjust").find("option:selected").text();
		  			var lowerLimit1="-";
		  			var upperLimit1="-";
		  			var movePercent1="-";
		  			var lowerLimit=$("#J_lowerLimit").val() || "-";
		  			if(lowerLimit!="-"){
		  				 lowerLimit1=lowerLimit+"%";
		  			}
		  			var upperLimit=$("#J_upperLimit").val()|| "-";
		  			if(upperLimit!="-"){
		  				 upperLimit1=upperLimit+"%";
		  			}
		  			var movePercent=$("#J_movePercent").val()|| "-";
		  			if(movePercent!="-"){
		  				 movePercent1=movePercent+"%";
		  			}

		  			var tr='\
		  				<tr><td data-text='+perfType+'><div class="perfType" type="'+perfTypeval+'" data-id="">'+perfType+'</div></td>\
							    <td>'+DefaultCalculate+'</td>\
							    <td>'+calculate+'</td>\
							    <td>'+percent1+'</td>\
							    <td>'+AllowAdjust+'</td>\
							    <td>'+lowerLimit1+'</td>\
							    <td>'+upperLimit1+'</td>\
							   <td>'+movePercent1+'</td>\
							    <td style="text-align: center;"><a class="J_shreinfo_modify btn btn-success btn-xs">修改</a>  <a class="J_shareinfo_del btn btn-outline btn-danger btn-xs">删除</a></td>\
						       </tr>';
					sessionStorage.setItem("trAll", sessionStorage.getItem("trAll") + tr)
		  			$('#J_dataTable tbody').prepend(tr); 
		  			sessionStorage.trAll=$("#J_dataTable tbody").html();
		  			layer.close(index);
		  		})
	  		}		
	  
})   

})
/*修改
//计算方式是否下拉框选中
*/
function selectDefaultCalculateValue(selectedValue,pId,indexs) {
	var index=indexs;
		$(pId+" option").each(function (){						
		    if($(this).text()==selectedValue){
		        $(this).parent().val(index);
		        $(this).parent().trigger('chosen:updated');
		    }
		    index+=1;
		});
	}
	function selectPerfTypeValue(selectedValue,pId) {
//		var index=0;
			$(pId+" option").each(function (){						
			    if($(this).val()==selectedValue){
			        $(this).parent().val($(this).val());
			        $(this).parent().trigger('chosen:updated');
			    }
//			    index+=1;
			});
		}
$(document).delegate('.J_shreinfo_modify', 'click', function(event){
	//修改表单，清空数据
	$("#J_perfType").val("");
	$('#J_perfType').trigger('chosen:updated');
	$('#J_calculate').find("option:not(:first-child)").remove();
	$("#J_calculate").val("");
	$("#J_calculate").trigger('chosen:updated');
	$("#J_lowerLimit").val("");
	$("#J_lowerLimit").removeAttr('disabled', 'disabled');
	$("#J_upperLimit").val("");	
	$("#J_upperLimit").removeAttr('disabled', 'disabled');
	$("#J_movePercent").val("");
	$("#J_movePercent").removeAttr('disabled', 'disabled');
	$("#J_percent").val("");
	$("#J_DefaultCalculate").val("");
	$('#J_DefaultCalculate').trigger('chosen:updated');
	$("#J_AllowAdjust").val("");
	$('#J_AllowAdjust').trigger('chosen:updated');
   var currentEditTr = $(this).parent().parent();
   var currentIndex = $('#J_dataTable tr').index(currentEditTr);
	var div = $('#add_sharetype');	
	var tr= $("#J_dataTable_1").find("tr").eq(currentIndex).find("td"); 
	selectPerfTypeValue(currentEditTr.find("td").eq(0).find("div").attr("type"),"#J_perfType");
	 if($("#J_perfType").val()==1 || $("#J_perfType").val()==2 || $("#J_perfType").val()==3 || $("#J_perfType").val()==5 ||$("#J_perfType").val()==6||$("#J_perfType").val()==7){
			$('#J_DefaultCalculate').find("option:not(:first-child)").remove();
			$('#J_DefaultCalculate').append("<option value='1'>是</option>"+
											"<option value='2'>否</option>");
			$('#J_DefaultCalculate').trigger('chosen:updated');
		 }else{
			 $('#J_DefaultCalculate').find("option:not(:first-child)").remove();
			 $('#J_DefaultCalculate').append("<option value='2'>否</option>");
			 $('#J_DefaultCalculate').trigger('chosen:updated');
		 }
	//selectDefaultCalculateValue(currentEditTr.find("td").eq(1).text(),"#J_DefaultCalculate",0);
	if(currentEditTr.find("td").eq(1).text()=='是'){
		selectPerfTypeValue("1","#J_DefaultCalculate");
		   $('#J_calculate').find("option:not(:first-child)").remove();
		   $('#J_calculate').append("<option value='1'>默认比例</option>"+"<option value='2'>倒扣计算</option>");
		   $('#J_calculate').trigger('chosen:updated');
		   $("#J_percent").removeAttr('disabled', 'disabled');//移除只读
	       $("#J_percent").val('');	
	       selectDefaultCalculateValue(currentEditTr.find("td").eq(2).text(),"#J_calculate",0);
	}else if(currentEditTr.find("td").eq(1).text()=='否'){
		selectPerfTypeValue("2","#J_DefaultCalculate");
		   $('#J_calculate').find("option:not(:first-child)").remove();
		   $('#J_calculate').append("<option value='3'>手动计算</option>");
		   $('#J_calculate').trigger('chosen:updated');
		   $("#J_percent").attr('disabled', 'disabled');//不可输入
	       $("#J_percent").val('');
	       selectDefaultCalculateValue(currentEditTr.find("td").eq(2).text(),"#J_calculate",2);
	}
	if($("#J_calculate").val()==2 ||$("#J_calculate").val()==3){
		 $("#J_percent").attr('disabled', 'disabled');//不可输入
		 $("#J_percent").val('');
	}else{
		  $("#J_percent").removeAttr('disabled', 'disabled');//移除只读
	       $("#J_percent").val('');	
	}
	selectDefaultCalculateValue(currentEditTr.find("td").eq(4).text(),"#J_AllowAdjust",0);
	    if($("#J_AllowAdjust").val()==1){
	    	$("#J_lowerLimit").removeAttr('disabled', 'disabled');//移除只读
	    	$("#J_upperLimit").removeAttr('disabled', 'disabled');//移除只读
	    	$("#J_movePercent").removeAttr('disabled', 'disabled');//移除只读
	    }else{
	    	$("#J_lowerLimit").attr('disabled', 'disabled');//不可输入
	    	$("#J_lowerLimit").val('');
	    	$("#J_upperLimit").attr('disabled', 'disabled');//不可输入
	    	$("#J_upperLimit").val('');
	    	$("#J_movePercent").attr('disabled', 'disabled');//不可输入
	    	$("#J_movePercent").val('');
	    } 
	$("#J_percent").val(currentEditTr.find("td").eq(3).text().substr(0, currentEditTr.find("td").eq(3).text().length - 1));
	$("#J_lowerLimit").val(currentEditTr.find("td").eq(5).text().substr(0, currentEditTr.find("td").eq(5).text().length - 1));
	$("#J_upperLimit").val(currentEditTr.find("td").eq(6).text().substr(0, currentEditTr.find("td").eq(6).text().length - 1));
	$("#J_movePercent").val(currentEditTr.find("td").eq(7).text().substr(0, currentEditTr.find("td").eq(7).text().length - 1));
	layer.open({
	  	type: 1,
	  	shift: 5,
 		title: '业绩分单修改明细',
	  	area: ['1100px', '400px'],
	  	skin : 'layui-layer-lan',
	  	content: div,
	  	btn : ['确定', '取消'],
   	yes: function(index, layero) {
		/*
		 * 获取列表中的业绩类型
		 * */
		/*
		 * 设置一个全局变量，用于存储业绩类型
		 * */
		var performance_ath=[];
		var performance_ath1=[];
		function performance(){
			$("#J_dataTable").each(function (){
		        var dataTable_length=$('#J_dataTable tbody tr').length-1;
		        //alert(dataTable_length);
		        for(var i=1;i<=dataTable_length;i++){
		        	var performance=$("#J_dataTable").find("tr").eq(i).find("td").eq(0).text();
		        	var performance1=$("#J_dataTable").find("tr").eq(i).find("td").eq(2).text();
		        	performance_ath.push(performance)
		        	performance_ath1.push(performance1)
		        }
		       // alert(performance)
		        //console.log(performance_ath);
			});
		}
		performance();
		var performance_s;
		var sel_value1=$("#J_calculate").find("option:selected").text();
		var sel_value=$("#J_perfType").find("option:selected").text();
			for(var i=0;i<performance_ath.length;i++){
					if($("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(0).text()==$("#J_perfType").find("option:selected").text()){
						//commonContainer.alert('可以修改');
					}else if(performance_ath[i]==sel_value){
						commonContainer.alert('该业绩类型已选择，不允许重复添加');
						return false;
				}
					if($("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(2).text()==$("#J_calculate").find("option:selected").text()){
						//commonContainer.alert('可以修改');
					}else if(performance_ath1[i]=='倒扣计算'){
    						if(sel_value1=='倒扣计算'){
    							commonContainer.alert('倒扣计算最多添加一条');
	    						return false;
    						}
    						
    				}
 						
 				}
			if($("#J_AllowAdjust").val()==1){
	    		 if($("#J_upperLimit").val()==""){
	    		    	commonContainer.alert("请输入分单上限");
	    		    	return false;
	    		    }
	    		 if($("#J_lowerLimit").val()==""){
	    		    	commonContainer.alert("请输入分单下限");
	    		    	return false;
	    		    }
	    		
	    		 if($("#J_movePercent").val()==""){
	    		    	commonContainer.alert("请输入分单进阶百分比");
	    		    	return false;
	    		    }	
	    		 if(parseInt($("#J_lowerLimit").val())>parseInt($("#J_upperLimit").val())){
		    			commonContainer.alert("分单下限不能大于分单上限 ！");
		    			 return false;
		    		 }
		    		if(parseInt($("#J_lowerLimit").val())==parseInt($("#J_upperLimit").val())){
		    			commonContainer.alert("分单下限不能等于分单上限 ！");
		    			 return false;
		    		 }
		    		if(parseInt($("#J_movePercent").val())>parseInt($("#J_upperLimit").val())){
		    			commonContainer.alert("分单进阶百分比不能大于分单上限 ！");
		    			 return false;
		    		 }
    		}
    	
			if($("#J_perfType").find("option:selected").text()=="请选择"){
				commonContainer.alert('分单类型不正确');
				return false;
			}
			if($("#J_AllowAdjust").find("option:selected").text()=="请选择"){
				commonContainer.alert('是否允许调整不正确');
				return false;
			}
			if($("#J_calculate").find("option:selected").text()=="请选择"){
				commonContainer.alert('计算方式不正确');
				return false;
			}
			if($("#J_calculate").val()==1){
   			 if($("#J_percent").val()==""){
	    		    	commonContainer.alert("请输入默认比例");
	    		    	return false;
	    		    }
   		}
			if($("#J_DefaultCalculate").find("option:selected").text()=="请选择"){
				commonContainer.alert('是否默认计算不正确');
				return false;
			}
			var J_type = $("#J_perfType").find("option:selected").text();
			var J_tVal = $("#J_perfType").find("option:selected").val()
   		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(0).text($("#J_perfType").find("option:selected").text());
   		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(0).html('<div class="perfType" type="'+J_tVal+'">'+J_type+'</div>');
   		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(0).attr("data-value",$("#J_perfType").find("option:selected").val());
   		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(1).text($("#J_DefaultCalculate").find("option:selected").text());			   
   		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(2).text($("#J_calculate").find("option:selected").text());
   		if($("#J_calculate").val()==1){
   			$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(3).text($("#J_percent").val()+'%');
   		}else{
   			$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(3).text('-');
   		}
   		//$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(3).text($("#J_percent").val()+'%');
   		//$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(4).text($("#J_AllowAdjust").find("option:selected").text());
   		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(4).text($("#J_AllowAdjust").find("option:selected").text());
		if($("#J_AllowAdjust").val()=="1"){
			$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(5).text($("#J_lowerLimit").val()+'%');
    		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(6).text($("#J_upperLimit").val()+'%');
    		if(parseInt($("#J_lowerLimit").val())>parseInt($("#J_upperLimit").val())){
    			commonContainer.alert("分单下限不能大于分单上限 ！");
    			 return false;
    		 }
    		if(parseInt($("#J_lowerLimit").val())==parseInt($("#J_upperLimit").val())){
    			commonContainer.alert("分单下限不能等于分单上限 ！");
    			 return false;
    		 }
    		if(parseInt($("#J_movePercent").val())>parseInt($("#J_upperLimit").val())){
    			commonContainer.alert("分单进阶百分比不能大于分单上限 ！");
    			 return false;
    		 }
    		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(7).text($("#J_movePercent").val()+'%');
		}else if($("#J_AllowAdjust").val()=="2"){
		
			$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(5).text('-');
    		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(6).text('-');
    		if(parseInt($("#J_lowerLimit").val())>parseInt($("#J_upperLimit").val())){
    			commonContainer.alert("分单下限不能大于分单上限 ！");
    			 return false;
    		 }
    		if(parseInt($("#J_lowerLimit").val())==parseInt($("#J_upperLimit").val())){
    			commonContainer.alert("分单下限不能等于分单上限 ！");
    			 return false;
    		 }
    		if(parseInt($("#J_movePercent").val())>parseInt($("#J_upperLimit").val())){
    			commonContainer.alert("分单进阶百分比不能大于分单上限 ！");
    			 return false;
    		 }
    		$("#J_dataTable").find("tr").eq(currentIndex).find("td").eq(7).text('-');	
		}
	  	    layer.close(index);
   	}	
	  		
}) 
});	
//删除
$(document).delegate('.J_shareinfo_del', 'click', function(event){
var deleteTr = $(this).parent().parent();
layer.alert("确定删除吗?",{
	btn:['确定','取消'],
	yes:function(index){
		deleteTr.remove();
		layer.close(index);
	},
	cancle:function(index){
		layer.close(index);
	}});

});
//下拉框判断
$("#J_AllowAdjust").bind("change",function(){ 
   if($(this).val()==1){
   	$("#J_lowerLimit").removeAttr('disabled', 'disabled');//移除只读
   	$("#J_upperLimit").removeAttr('disabled', 'disabled');//移除只读
   //	$("#J_movePercent").removeAttr('disabled', 'disabled');//移除只读
	$("#J_movePercent").val('1');
   } 
   else{
   	$("#J_lowerLimit").attr('disabled', 'disabled');//不可输入
   	$("#J_lowerLimit").val('');
   	$("#J_upperLimit").attr('disabled', 'disabled');//不可输入
   	$("#J_upperLimit").val('');
   	$("#J_movePercent").attr('disabled', 'disabled');//不可输入
   	$("#J_movePercent").val('');
   } 
 }); 

/*默认计算和计算方式联动验证*/
$(document).delegate('#J_DefaultCalculate', 'change', function(event){
	 if($(this).val()==1){
	   $('#J_calculate').find("option:not(:first-child)").remove();
	   $('#J_calculate').append("<option value='1'>默认比例</option>"+											"<option value='2'>倒扣计算</option>");
	   $('#J_calculate').trigger('chosen:updated');
	   $("#J_percent").removeAttr('disabled', 'disabled');//移除只读
       $("#J_percent").val('');	
	}else if($(this).val()==2){
		  $('#J_calculate').find("option:not(:first-child)").remove();
		   $('#J_calculate').append("<option value='3'>手动计算</option>");
		   $('#J_calculate').trigger('chosen:updated');
		   $("#J_percent").attr('disabled', 'disabled');//不可输入
	    	$("#J_percent").val('');
	}
});
$(document).delegate('#J_calculate', 'change', function(event){
	 if($(this).val()==3 ||$(this).val()==2){
		 $("#J_percent").attr('disabled', 'disabled');//不可输入
		 $("#J_percent").val('');
	 }else{
		  $("#J_percent").removeAttr('disabled', 'disabled');//移除只读
		  $("#J_percent").val('');
	 }
})
//业绩类型和是否默认计算联动
$(document).delegate('#J_perfType', 'change', function(event){
	 if($(this).val()==1 || $(this).val()==2 || $(this).val()==3 || $(this).val()==5 ||$(this).val()==6||$(this).val()==7){
		$('#J_DefaultCalculate').find("option:not(:first-child)").remove();
		$('#J_DefaultCalculate').append("<option value='1'>是</option>"+
										"<option value='2'>否</option>");
		$('#J_DefaultCalculate').trigger('chosen:updated');
		 /* $("#J_DefaultCalculate_chosen").hide();
		 $("#J_DefaultCalculate").show()*/
	 }else{
		 $('#J_DefaultCalculate').find("option:not(:first-child)").remove();
		 $('#J_DefaultCalculate').append("<option value='2'>否</option>");
		 $('#J_DefaultCalculate').trigger('chosen:updated');
//		 $("#J_DefaultCalculate option[value='1']").remove(); 
	 }
})

//默认比例不能大于100
var J_percent = document.getElementById("J_percent");
J_percent.oninput = function(){
	this.value=this.value.replace(/\D/g,'');
	if(J_percent.value>100){
		commonContainer.alert('默认比例不能大于100%');
		$("#J_percent").val("")
		return false;
	}
}
var J_upperLimit = document.getElementById("J_upperLimit");
J_upperLimit.oninput = function(){
	this.value=this.value.replace(/\D/g,'');
	if(J_upperLimit.value>100){
		commonContainer.alert('分单上限不能大于100%');
		$("#J_upperLimit").val("");
		return false;
	}
}

//保存部门新增普租提交增加页
$(document).delegate("#save-add-city","click",function(event){	
//	var tr= $("#J_dataTable").find("tr").eq(1).find("td");
	var leng = $("#J_dataTable tbody tr").length;
	var deptId=$("#deptId").attr("data-id")
	var beginDate=$('#beginDate').val();
	var mome=$('#mome').val(); 
	var defatotal = 0;
	var dkTotal =0;
	var totalRow;
	var isdefa=0;
	if(leng>=2){
	 var Arr = [];
	    for(var i=1; i<leng; i++)  
	    {  
	    	var obj={};
	    	obj.perfType=$("#J_dataTable").find("tr").eq(i).find("td").eq(0).find("div").attr("type");
	    	obj.isDefaultCalculate=$("#J_dataTable").find("tr").eq(i).find("td").eq(1).text();
	    	obj.calculateWay=$("#J_dataTable").find("tr").eq(i).find("td").eq(2).text();
	    	obj.percent=$("#J_dataTable").find("tr").eq(i).find("td").eq(3).text().substr(0, $("#J_dataTable").find("tr").eq(i).find("td").eq(3).text().length - 1);;
	    	obj.isAllowAdjust=$("#J_dataTable").find("tr").eq(i).find("td").eq(4).text();
	    	obj.lowerLimit=$("#J_dataTable").find("tr").eq(i).find("td").eq(5).text().substr(0, $("#J_dataTable").find("tr").eq(i).find("td").eq(5).text().length - 1);
	    	obj.upperLimit=$("#J_dataTable").find("tr").eq(i).find("td").eq(6).text().substr(0, $("#J_dataTable").find("tr").eq(i).find("td").eq(6).text().length - 1);
	    	obj.movePercent=$("#J_dataTable").find("tr").eq(i).find("td").eq(7).text().substr(0, $("#J_dataTable").find("tr").eq(i).find("td").eq(7).text().length - 1);
	    	//obj.mome=$('#mome').val(); 
	    	Arr.push(obj)
	    	 if(obj.isDefaultCalculate=="是"){
	    			obj.isDefaultCalculate = 1;
	    		}else{
	    			obj.isDefaultCalculate = 0;
	    		}
	    	    if(obj.isAllowAdjust=="是"){
	    	    	obj.isAllowAdjust = 1;
	    		}else{
	    			obj.isAllowAdjust = 0;
	    		}
	    	    
	    	    //默认比例总和计算
		    	  if(obj.calculateWay=="默认比例"){
		    		  totalRow = obj.percent;
		    		  defatotal =defatotal+parseInt(totalRow);
		    	  }else if(obj.calculateWay=="倒扣计算"){
		    		  totalRow = obj.percent;
		    		  if(totalRow==""){
			    			 totalRow=0  
			    				// alert("111")
			    			  dkTotal =dkTotal+parseInt(totalRow);
				    		  isdefa=1;
					    	}
		    	  }	
	    }
	    //判断值
	    if(isdefa==1){
	    	if(defatotal+dkTotal>100){
	    		commonContainer.alert("默认比例总和不等于100%；请修改默认比例");
	        	return false;
	    	}else if(defatotal+dkTotal==100){
	    		commonContainer.alert("无法配置倒扣比例;请修改默认比例");
	        	return false;
	    	}
	    }else if(isdefa==0){
	    	if(defatotal!=100){
	    		commonContainer.alert("默认比例总和不等于100%；请修改默认比例");
	        	return false;
	    	}
	    }
	var arr_arr=$.makeArray(Arr);
	 if(deptId==""){
	    	commonContainer.alert("请选择适用部门");
	    	return false;
	    }
    if(beginDate==""){
    	commonContainer.alert("请选择启用日期");
    	return false;
    }
     
    //获得所属部门的层级
    var departmentTypeId
	var departmentTypeId_val=$('#J_deptLevel').val();
    if(departmentTypeId_val!=1){
		layer.alert('适用部门只能选择部门大区！');
		return false;
	}
   var ere={};
   ere.cityids = Arr;
   ere.deptId =deptId;
   ere.mome =mome;
   ere.beginDate = beginDate;
   $("#save-add-city").attr("disabled","true");
   //console.log(JSON.stringify(ere))
   $.ajax({
		type : "Post",
		url : basePath + '/perf/setRuleDetail/addSaveP',
		dataType : "json",
		contentType : "application/json",
		data : JSON.stringify(ere),
		timeout : 3000,
		success : function(data) {
			if (data.code == 0) {
				layer.msg("添加成功",{
				  icon: 1,
				  time: 100
				},function(index){
					window.location.href=basePath + '/perf/setRuleDetail/toPuzu.htm?companyId='+companyId;
				});
			}else{
				layer.msg("日期重复不能保存");
				$("#save-add-city").removeAttr("disabled");
			}
		},
		error : function(data){
			
		}
	});
 }else{
		commonContainer.alert("无业绩分单类型 ");
	}

});


//保存部门新增二手买卖提交增加页
$(document).delegate("#save-add-city1","click",function(event){	
//	var tr= $("#J_dataTable").find("tr").eq(1).find("td");
	var leng = $("#J_dataTable tbody tr").length;
	var deptId=$("#deptId").attr("data-id")
	var beginDate=$('#beginDate').val();
	var mome=$('#mome').val(); 
	var defatotal = 0;
	var dkTotal =0;
	var totalRow;
	var isdefa=0;
	if(leng>=2){
	 var Arr = [];
	    for(var i=1; i<leng; i++)  
	    {  
	    	var obj={};
	    	obj.perfType=$("#J_dataTable").find("tr").eq(i).find("td").eq(0).find("div").attr("type");
	    	obj.isDefaultCalculate=$("#J_dataTable").find("tr").eq(i).find("td").eq(1).text();
	    	obj.calculateWay=$("#J_dataTable").find("tr").eq(i).find("td").eq(2).text();
	    	obj.percent=$("#J_dataTable").find("tr").eq(i).find("td").eq(3).text().substr(0, $("#J_dataTable").find("tr").eq(i).find("td").eq(3).text().length - 1);;
	    	obj.isAllowAdjust=$("#J_dataTable").find("tr").eq(i).find("td").eq(4).text();
	    	obj.lowerLimit=$("#J_dataTable").find("tr").eq(i).find("td").eq(5).text().substr(0, $("#J_dataTable").find("tr").eq(i).find("td").eq(5).text().length - 1);
	    	obj.upperLimit=$("#J_dataTable").find("tr").eq(i).find("td").eq(6).text().substr(0, $("#J_dataTable").find("tr").eq(i).find("td").eq(6).text().length - 1);
	    	obj.movePercent=$("#J_dataTable").find("tr").eq(i).find("td").eq(7).text().substr(0, $("#J_dataTable").find("tr").eq(i).find("td").eq(7).text().length - 1);
	    	//obj.mome=$('#mome').val(); 
	    	Arr.push(obj)
	    	 if(obj.isDefaultCalculate=="是"){
	    			obj.isDefaultCalculate = 1;
	    		}else{
	    			obj.isDefaultCalculate = 0;
	    		}
	    	    if(obj.isAllowAdjust=="是"){
	    	    	obj.isAllowAdjust = 1;
	    		}else{
	    			obj.isAllowAdjust = 0;
	    		}
	    	  //默认比例总和计算
		    	  if(obj.calculateWay=="默认比例"){
		    		  totalRow = obj.percent;
		    		  defatotal =defatotal+parseInt(totalRow);
		    	  }else if(obj.calculateWay=="倒扣计算"){
		    		  totalRow = obj.percent;
		    		  dkTotal =dkTotal+parseInt(totalRow);
		    		  isdefa=1;
		    	  }	
	    }
	    //判断值
	    if(isdefa==1){
	    	if(defatotal+dkTotal>100){
	    		commonContainer.alert("默认比例总和不能大约100%；请修改默认比例");
	        	return false;
	    	}else if(defatotal+dkTotal==100){
	    		commonContainer.alert("无法配置倒扣比例;请修改默认比例");
	        	return false;
	    	}
	    }else if(isdefa==0){
	    	if(defatotal!=100){
	    		commonContainer.alert("默认比例总和不等于100%；请修改默认比例");
	        	return false;
	    	}
	    }
	var arr_arr=$.makeArray(Arr); 
	 if(deptId==""){
	    	commonContainer.alert("请选择适用部门");
	    	return false;
	    }
    if(beginDate==""){
    	commonContainer.alert("请选择启用日期");
    	return false;
    }
     
    //获得所属部门的层级
    var departmentTypeId
	var departmentTypeId_val=$('#J_deptLevel').val();
    if(departmentTypeId_val!=1){
		layer.alert('适用部门只能选择部门大区！');
		return false;
	}
   var ere={};
   ere.cityids = Arr;
   ere.mome =mome;
   ere.deptId =deptId;
   ere.beginDate = beginDate;
   $("#save-add-city1").attr("disabled","true");
   //console.log(JSON.stringify(ere))
   $.ajax({
		type : "Post",
		url : basePath + '/perf/setRuleDetail/addSaveE',
		dataType : "json",
		contentType : "application/json",
		data : JSON.stringify(ere),
		timeout : 3000,
		success : function(data) {
			if (data.code == 0) {
				layer.msg("添加成功",{
				  icon: 1,
				  time: 2000
				},function(index){
					//window.location.href=basePath + '/perf/setRuleDetail/shareratio';
					 window.location.href=basePath + '/perf/setRuleDetail/toDetail.htm?companyId='+companyId;
				});
			}else{
				layer.msg("日期重复不能保存");
				$("#save-add-city1").removeAttr("disabled");
			}
		},
		error : function(data){
			
		}
	});
 }else{
	 commonContainer.alert("无业绩分单类型 ");
 }
   
});

/*字数限制  
$("#mome").on("input propertychange", function() {  
var $this = $(this),  
   _val = $this.val(),  
   count = "";  
if (_val.length > 120) {  
   $this.val(_val.substring(0, 120));  
}  
count = 120 - $this.val().length;  
$("#text-count").text(count);  
});  */
//textarae字数限制
mome.oninput = function strLenCalc(obj, checklen, maxlen) {
	var v = $("#mome").val(), charlen = 0, maxlen = !maxlen ? 240 : maxlen, curlen = maxlen, len = v.length;
	for(var i = 0; i < v.length; i++) {
	//if(v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
	curlen -= 1;
	//}
	}
  if(curlen >= len) {
	$("#checklen").html("还可输入 <strong>"+Math.floor((curlen-len)/2)+"</strong> 个字").css('color', '');
	$("#save-add-city").removeAttr("disabled");
	} else {
	$("#checklen").html("已经超过 <strong>"+Math.ceil((len-curlen)/2)+"</strong> 个字").css('color', '#FF0000');
	$("#save-add-city").attr("disabled", "disabled");
	}
 }

window.dimContainer1 = {
		getDimReqUrl: function() {
			return basePath + '/perf/setRuleDetail/findPerfType';
		},
		buildDimChosenSelector1: function($container, compId,keyId, selectedValues) {//selectedValues默认选中值
			// 初始化chosen控件
			commonContainer.initChosen($container);

			var that = this;
		    var options = [];
		    jsonPostAjax(that.getDimReqUrl(), {'compId':compId,'keyId':keyId}, function(result) {
	    		$.each(result.data, function(n, value) {
	    			if(value!=null){
	    				options.push('<option value="' + value.valueCode + '">' + value.valueName + '</option>');
	    			}    	    	
	    	    })
	    	    $container.append(options);

	    		var selectedValueArr = selectedValues.split(',');
	    		$container.val(selectedValueArr);
	    		$container.trigger("chosen:updated");
			})
		},
	}
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg);  
	if (r != null) return unescape(r[2]); return null;  
} 
})