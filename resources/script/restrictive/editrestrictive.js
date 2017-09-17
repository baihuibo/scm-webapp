 function getUrlParams(name){
     	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg);
 	if(r!=null){
 		return unescape(r[2]);
 	}
 	return null;
 }

$(function(){

//	dimContainer.buildDimChosenSelector($("#J_revamp_customerTypeId"), "clientType","");//客户类型
//	dimContainer.buildDimChosenSelector($("#J_revamp_businessTypeId"), "businessType","");//业务类型
//	dimContainer.buildDimChosenSelector($("#J_revamp_houseCardTypeId"), "HousecertificateType","");//房产证类型
	dimContainer.buildDimChosenSelector($("#J_revamp_idCardTypeId"), "cardType","");//身份证件类型
//	dimContainer1.buildDimCheckBox1($("#J_revamp_reasons"),"reasons", "0","");//上榜原因业主
	$(document).on("change",'#J_revamp_customerTypeId',function(){
		if($(this).val()==1){
			$('#J_revamp_reasons').html("");
			$('#J_revamp_houseCard').removeAttr("disabled");
			$('#J_revamp_houseCardTypeId').removeAttr("disabled");
			$('#J_revamp_houseCardTypeId').trigger("chosen:updated");
			dimContainer1.buildDimCheckBox1($("#J_revamp_reasons"),"reasons", "1","");//上榜原因业主
		}else if($(this).val()==2){
			$('#J_revamp_reasons').html("");
			$('#J_revamp_houseCard').attr({"disabled":"disabled"});
			$('#J_revamp_houseCardTypeId').attr({"disabled":"disabled"});
			$('#J_revamp_houseCard').val("");
			$('#J_revamp_houseCardTypeId').val("0");
			$('#J_revamp_houseCardTypeId').trigger("chosen:updated");
			dimContainer1.buildDimCheckBox1($("#J_revamp_reasons"),"reasons", "2","");//上榜原因客户
		}else if($(this).val()==''){
			$('#J_revamp_reasons').html("");
			$('#J_revamp_houseCard').removeAttr("disabled");
			$('#J_revamp_houseCardTypeId').removeAttr("disabled");
			$('#J_revamp_houseCard').val("");
			$('#J_revamp_houseCardTypeId').val("0");
			$('#J_revamp_houseCardTypeId').trigger("chosen:updated");
		}
	})
	searchContainer.searchUserListByComp($("#J_revamp_nextAppvalUserId"), true);
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
     
   //获取url参数
  
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	})

})

var val={};

$("#J_submit").click(
	function(){
		if(!housedetailValidate()){
			commonContainer.alert("存在不符合规则的数据！");
			return;
		}
		var J_idCardType=$('#J_idCardType').val();
	if(!housedetailValidate()||J_idCardType==1){			
		var idCard=$('#idCard').val();
		var str=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
		if(idCard==''){
			$('.error2').css('color','#a94442');
			$('.error2').css('display','block');
			$('.idcard').css('color','#ed5565');
			return;
			
		}else {
			if(!str.test(idCard)){
				commonContainer.alert("存在不符合规则的数据！");
				J_idCardType='';
				$('.idcard').css('color','#ed5565');
				$('.error').css('display','block');
				$('.error').css('color','#a94442');
				return;
			}
		} 			
	}
var customerTelephone=$('#customerTelephone').val();

if(customerTelephone){
	var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;  
    var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/; 
    if (customerTelephone.substring(0, 1) == 1) {  
        if (!isMobile.exec(customerTelephone) && customerTelephone.length != 11) {  
        	customerTelephone='';
			$('.customerTelephone').css('color','red');
			return 
        }  
    }  
    // 如果为0开头则验证固定电话号码
    else if (customerTelephone.substring(0, 1) == 0) {  
        if (!isPhone.test(customerTelephone)){  
        	customerTelephone='';
			$('.customerTelephone').css('color','#ed5565');
			return  
        }  
    } 
}

var reasons=[];
$("input[name='reasons']:checked").each(function(){
	var reason={};
	reason.reasonId=$(this).val();
	reasons.push(reason);
});
val=$("#newform").serializeJson();
val.reasons=reasons;
//console.log(val)
val.nextAppvalUserId=$("#J_revamp_nextAppvalUserId").attr("data-id");
jsonPostAjax(basePath + '/restrictive/updaterestrictive', val, function(result) {
	console.log(result)
	if(result.data.success==true){
		var cusId = $("#J_revamp_reid").val();
		//window.open("viewrestrictives.html?id="+cusId,"_blank");
		commonContainer.closeWindow();
	}else{
		commonContainer.alert(result.data.message)
		return false;
	}
	window.location.reload();
},{});
})

window.onload=function(){
	var arr=[];	
	var _result;
	
	$.ajax({
		url : basePath + '/restrictive/editviewrestrictive',
		data : {"restrictiveId":getUrlParams('id')},
		type : 'post',
		dataType : 'json'
	}).then(function(result) {
		if (result.code == '0') {
			_result = result;
			for(var key in result.data){
				if($("#J_revamp_"+key)){
					$("#J_revamp_"+key).val(result.data[key]);
				}			
			}
			var customerTypeId = $("#J_revamp_customerTypeId").val();
			$("#J_revamp_nextAppvalUserId").attr("data-id",result.data.nextApprovalUserId);
			$("#J_revamp_nextAppvalUserId").val(result.data.nextApprovalUserName);
			if(customerTypeId==1){
				$('#J_revamp_reasons').html("");
				$('#J_revamp_houseCard').removeAttr("disabled");
				$('#J_revamp_houseCardTypeId').removeAttr("disabled");
				$('#J_revamp_houseCardTypeId').trigger("chosen:updated");
				return dimContainer1.buildDimCheckBox1($("#J_revamp_reasons"),"reasons", "1","");//上榜原因业主
			}else if(customerTypeId==2){
				$('#J_revamp_reasons').html("");
				$('#J_revamp_houseCard').attr({"disabled":"disabled"});
				$('#J_revamp_houseCardTypeId').attr({"disabled":"disabled"});
				$('#J_revamp_houseCardTypeId').trigger("chosen:updated");
				return dimContainer1.buildDimCheckBox1($("#J_revamp_reasons"),"reasons", "2","");//上榜原因客户
			}else if(!customerTypeId){
				$('#J_revamp_reasons').html("");
				$('#J_revamp_houseCard').removeAttr("disabled");
				$('#J_revamp_houseCardTypeId').removeAttr("disabled");
				$('#J_revamp_houseCardTypeId').trigger("chosen:updated");
			}
		}
	}).then(function(){
		var data = _result.data;
		
		data.reasons.forEach(function(item){
			$("#reasons"+ item.reasonId).prop("checked",true);
		});
		
		$('select').trigger('chosen:updated');
		if(data.stateId =="3"){
			$(".ptb10").show();
			$(".ptb10_1").show();
		}else if(data.stateId =="1"){
			$(".ptb10").hide();
			$(".ptb10_1").hide();
		}
	});
	
	$("#J_revamp_reid").val(getUrlParams('id'));

}


window.dimContainer1 = {
	getDimReqUrl: function() {
		return basePath + '/restrictive/findrestrictivereasons';
	},	
	buildDimCheckBox1: function($container, checkboxName, keyCode, selectedValues) {
	   return this.buildDimCheckBoxHasAll1($container, checkboxName, keyCode, selectedValues, null);
	},
	buildDimCheckBoxHasAll1: function($container, checkboxName, keyCode, selectedValues, allItemName) {
		var that = this;
		return jsonPostAjax(that.getDimReqUrl(), {'customerTypeId':keyCode}, function(result) {
    	    var items = [];
    	    // push数据
    	   
    		$.each(result.data, function(n, value) {
    			var item = '<div class="checkbox checkbox-primary checkbox-inline">' +
    							'<input type="checkbox" id="' + checkboxName+value.reasonId + '" name="' + checkboxName + '" value="' + value.reasonId + '"><label for="' + checkboxName+value.reasonId + '">' + value.reason + '</label>' +
							'</div>';
    			items.push(item);
    	    })
    	    $container.append(items);
    	    // 选中值处理
    	    var selectedValueArr = selectedValues.split(',');
    		if($.isArray(selectedValueArr) && selectedValueArr.length>0){
    			$.each(selectedValueArr, function(n, value) {
    				$(':checkbox[value="' + value + '"]', $container).prop('checked', true);
	    	    })
    		}
	    	
		})
	},
	
}
//操作日志
$('#J_dataTable').bootstrapTable({ 
	url:basePath + '/restrictive/findpageoperatehistories ',
	sidePagination: 'server',
	dataType: 'json',
	method:'post',
	pagination: true,
	striped: true,
	pageSize: 10,
	pageList: [10, 20, 50],
	queryParams : function(params) {
		var o ={};
		o.restrictiveId = getUrlParams('id');
//		o.timestamp = new Date().getTime();
		o.currentPageIndex = params.offset / params.limit+ 1,
		o.pageSize = params.limit;
		return o;
	},
	responseHandler: function(result) {
		if(result.code == 0 && result.data && result.data.recordTotal> 0) {
			return { "rows": result.data.records, "total": result.data.recordTotal }
		}
		return { "rows": [], "total": 0} 
	},
	columns:[      
	        {field: 'operateUserName', title: '操作人', align: 'center'},		      	  
      	    {field: 'jobName', title: '职务', align: 'center'},
      	    {field: 'departmentName', title: '所在组店', align: 'center'},
      	    {field: 'operateTime', title: '操作时间',  align: 'center'},
      	    {field: 'operateDesc', title: '操作内容',  align: 'center',
      	    	formatter:function(value){
					return '<div style="text-align:left;" class="remark_all">'+value+'</div>';
				}
      	    	},		      
	      	]
})


//取消按钮

$("#J_reset").on("click",function(){
		commonContainer.closeWindow();
	    window.opener.location.href = window.opener.location.href;//刷新父页面
})
