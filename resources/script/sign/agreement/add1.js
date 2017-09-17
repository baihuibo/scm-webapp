/*
 * 选择“买卖补充协议”时显示“适用场景”
 * */
$(function(){
	
	$(document).delegate('input[name="agrtType"]', 'click', function(event){
		if($(this).val()==2){
			$("#J_scenes").show();
			$("#J_paymentType").empty(); 
			dimContainer.buildDimChosenSelector($("#J_paymentType"), "paymentType", "");
		}else{
			$("#J_scenes").hide();
		}
	});
});
dimContainer.buildDimRadio($("#J_agreement_type"), "agrtType", "agrtType", "");
